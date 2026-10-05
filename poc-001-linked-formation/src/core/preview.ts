import { ABILITIES } from '../content/brood';
import type { AbilityId } from '../content/brood';
import type { PatrolState } from '../content/patrol';
import { abilityLegality } from './abilities';
import type { AbilityRequest, TurnDirection } from './abilities';
import type { Command, CommandResult, ErrorCode, GameplayEvent } from './commands';
import { DEFAULT_DAMAGE_RULES } from './damage';
import { formationLinks, formationPositions } from './formation';
import { activeLinks, isCloseLinked, selectProtection, selectRecipients } from './intents';
import type { CombatState, GameState } from './state';
import { applyCommand } from './transition';

export const FORECAST_CONDITION = 'If end phase now';

function combat(state: GameState): state is CombatState {
  return 'enemies' in state && 'declaredIntentions' in state && 'protections' in state
    && 'shelters' in state && 'resolvedAttackIds' in state;
}
function patrol(state: GameState): state is PatrolState {
  return combat(state) && 'patrolVersion' in state && 'patrolRules' in state;
}
function freeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}

/** Selector facts only. No damage, targeting, geometry or legality rules live here. */
function deriveFacts(state: GameState) {
  const positions = formationPositions(state.formation);
  if (!combat(state)) return { positions, links: formationLinks(state.formation),
    protections: [], shelters: [], threats: [], abilities: [] };
  const rules = patrol(state) ? state.patrolRules : undefined;
  const abilities = state.brood.flatMap((actor) =>
    (Object.keys(ABILITIES) as AbilityId[]).filter((id) => ABILITIES[id].brood === actor.brood)
      .flatMap((abilityId) => {
        const targets = abilityId === 'shelter' ? state.brood : state.enemies;
        const directions: readonly (TurnDirection | undefined)[] = abilityId === 'crosswind'
          ? ['clockwise', 'anticlockwise'] : [undefined];
        return targets.flatMap((target) => directions.map((direction) => {
          const request: AbilityRequest = { expectedRevision: state.revision, actorId: actor.id,
            abilityId, targetId: target.id, ...(direction ? { direction } : {}) };
          return { request, legality: abilityLegality(state, request) };
        }));
      }));
  return {
    positions,
    links: activeLinks(state, rules?.closeThreshold),
    protections: state.brood.flatMap((actor) => state.enemies.map((target) => ({
      actorId: actor.id, targetId: target.id,
      ...selectProtection(state, { actorId: actor.id, targetId: target.id,
        bypassProtection: false }, state.protections),
    }))),
    shelters: state.shelters.map((shelter) => ({ ...shelter,
      eligible: isCloseLinked(state, shelter.sourceId, shelter.targetId,
        rules?.damageRules.closeThreshold ?? DEFAULT_DAMAGE_RULES.closeThreshold) })),
    threats: state.declaredIntentions.map((intention) => ({ intention,
      ...selectRecipients(state, intention, rules?.splashRadius) })),
    abilities,
  };
}
/** A selector rejection makes facts unavailable; it cannot reject the real command. */
export function previewFacts(state: GameState) {
  try {
    return { available: true as const, ...deriveFacts(state) };
  } catch (error) {
    if (!(error instanceof RangeError)) throw error;
    return { available: false as const, reason: error.message };
  }
}
export type PreviewFacts = ReturnType<typeof previewFacts>;
type AvailablePreviewFacts = Extract<PreviewFacts, { available: true }>;

export type PhaseForecast<State extends GameState> =
  | { readonly kind: 'terminal' | 'unavailable'; readonly condition: typeof FORECAST_CONDITION;
      readonly events: readonly [] }
  | ({ readonly kind: 'transition'; readonly condition: typeof FORECAST_CONDITION;
      /** Excludes next-round declarations; these are not attacks already dealt. */
      readonly enemyEvents: readonly GameplayEvent[] } & CommandResult<State>);

interface PreviewIdentity {
  readonly command: Command;
  readonly expectedRevision: number;
  readonly sessionGeneration: number;
}
export type CommandPreview<State extends GameState = GameState> = PreviewIdentity & (
  | { readonly ok: false; readonly state: State; readonly events: readonly [];
      readonly error: { readonly code: ErrorCode } }
  | { readonly ok: true; readonly state: State; readonly events: readonly GameplayEvent[];
      readonly projection: {
        readonly before: PreviewFacts;
        readonly after: PreviewFacts;
        readonly deltas: readonly { readonly entityId: string; readonly hpBefore: number;
          readonly hpAfter: number; readonly statusesBefore: readonly string[];
          readonly statusesAfter: readonly string[] }[];
        /** Change lists are available only when both fact snapshots are available. */
        readonly protectionGained: AvailablePreviewFacts['protections'];
        readonly protectionLost: AvailablePreviewFacts['protections'];
        readonly abilitiesEnabled: AvailablePreviewFacts['abilities'];
        readonly abilitiesDisabled: AvailablePreviewFacts['abilities'];
        /** Real events explain HP, lifecycle, status, and facing changes. */
        readonly explanations: readonly GameplayEvent[];
      };
      readonly forecast: PhaseForecast<State> }
);

function transition<State extends GameState>(state: State, command: Command): CommandResult<State> {
  // The dispatcher preserves the snapshot family and extension data.
  return applyCommand(state, command) as CommandResult<State>;
}

/** Execute the sole public transition on an isolated copy; freeze only owned data. */
export function previewCommand<State extends GameState>(
  live: State, command: Command, sessionGeneration: number,
): CommandPreview<State> {
  const snapshot = structuredClone(live);
  const request = structuredClone(command);
  const result = transition(snapshot, request);
  const identity = { command: request, expectedRevision: command.expectedRevision, sessionGeneration };
  if (!result.ok) return freeze({ ...identity, ...result });
  const before = previewFacts(snapshot), after = previewFacts(result.state);
  const entities = (state: GameState) => [...state.brood,
    ...(combat(state) ? state.enemies.map((enemy) => ({ ...enemy, statuses: [] as readonly string[] })) : [])];
  const previous = entities(snapshot);
  const deltas = entities(result.state).flatMap((entity) => {
    const old = previous.find(({ id }) => id === entity.id)!;
    return old.hp === entity.hp && JSON.stringify(old.statuses) === JSON.stringify(entity.statuses)
      ? [] : [{ entityId: entity.id, hpBefore: old.hp, hpAfter: entity.hp,
        statusesBefore: old.statuses, statusesAfter: entity.statuses }];
  });
  const protectionChanged = (from: PreviewFacts, to: PreviewFacts) => {
    if (!from.available || !to.available) return [];
    return to.protections.filter((entry) => entry.protected && !from.protections.some((old) =>
      old.actorId === entry.actorId && old.targetId === entry.targetId && old.protected));
  };
  const abilityChanged = (enabled: boolean) => {
    if (!before.available || !after.available) return [];
    return after.abilities.filter((entry) => entry.legality.ok === enabled && before.abilities.some((old) =>
      old.request.actorId === entry.request.actorId && old.request.abilityId === entry.request.abilityId
      && old.request.targetId === entry.request.targetId && old.request.direction === entry.request.direction
      && old.legality.ok !== enabled));
  };
  let forecast: PhaseForecast<State>;
  if (result.state.phase === 'victory' || result.state.phase === 'defeat') {
    forecast = { kind: 'terminal', condition: FORECAST_CONDITION, events: [] };
  } else if (!patrol(result.state)) {
    forecast = { kind: 'unavailable', condition: FORECAST_CONDITION, events: [] };
  } else {
    const ended = transition<State>(structuredClone(result.state), { kind: 'endPhase',
      expectedRevision: result.state.revision });
    forecast = { kind: 'transition', condition: FORECAST_CONDITION, ...ended,
      enemyEvents: ended.events.filter(({ type }) => type !== 'round-started' && type !== 'intentions-announced') };
  }
  return freeze({ ...identity, ...result, projection: { before, after, deltas,
    protectionGained: protectionChanged(before, after), protectionLost: protectionChanged(after, before),
    abilitiesEnabled: abilityChanged(true), abilitiesDisabled: abilityChanged(false), explanations: result.events }, forecast });
}

/** The adapter checks this before submitting the original command to live state. */
export function previewValidity(
  live: GameState, sessionGeneration: number, preview: CommandPreview,
): 'stale-session' | 'stale-revision' | undefined {
  if (sessionGeneration !== preview.sessionGeneration) return 'stale-session';
  if (live.revision !== preview.expectedRevision) return 'stale-revision';
  return undefined;
}
