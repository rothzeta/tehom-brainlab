import {
  contractFormation, expandFormation, rotateAnticlockwise, rotateClockwise,
} from './formation';
import type { Formation } from './formation';
import type { ActorAction, Command, CommandResult, ErrorCode } from './commands';
import type { BroodState, GameState } from './state';
import type { CombatState } from './state';
import { applyAttack } from './damage';
import { applyAbility } from './abilities';
import { isAbilityId } from '../content/brood';

function reject(state: GameState, code: ErrorCode): CommandResult {
  return { ok: false, state, events: [], error: { code } };
}

function guard(state: GameState, expectedRevision: number): ErrorCode | undefined {
  if (expectedRevision !== state.revision) return 'stale-revision';
  if (state.phase !== 'player') return 'wrong-phase';
  return undefined;
}

/** Public dispatcher; P08 phase/round dispatch remains pending. */
export function applyCommand(state: CombatState, command: Command): CommandResult<CombatState>;
export function applyCommand(state: GameState, command: Command): CommandResult;
export function applyCommand(state: GameState, command: Command): CommandResult {
  if (command.kind === 'attack') {
    if (!('enemies' in state && 'declaredIntentions' in state && 'protections' in state
      && 'shelters' in state && 'resolvedAttackIds' in state)) return reject(state, 'invalid-command');
    return applyAttack(state as CombatState, command);
  }
  if (command.kind === 'useAbility' && isAbilityId(command.abilityId)
    && 'enemies' in state && 'declaredIntentions' in state && 'protections' in state
    && 'shelters' in state && 'resolvedAttackIds' in state) {
    return applyAbility(state as CombatState, command);
  }
  // Unregistered abilities/basic lab snapshots retain P03's unsupported behavior.
  if (command.kind === 'useAbility' || command.kind === 'endPhase') {
    return reject(state, 'unsupported-command');
  }
  if (command.kind !== 'maneuver') return reject(state, 'invalid-command');
  const error = guard(state, command.expectedRevision);
  if (error) return reject(state, error);
  if (state.maneuverUsed) return reject(state, 'maneuver-used');

  let formation: Formation;
  switch (command.maneuver) {
    case 'clockwise': formation = rotateClockwise(state.formation); break;
    case 'anticlockwise': formation = rotateAnticlockwise(state.formation); break;
    case 'expand':
      if (state.formation.shape === 'spread') return reject(state, 'same-shape');
      formation = expandFormation(state.formation);
      break;
    case 'contract':
      if (state.formation.shape === 'compact') return reject(state, 'same-shape');
      formation = contractFormation(state.formation);
      break;
    default: return reject(state, 'invalid-command');
  }
  const next: GameState = {
    ...state, formation, maneuverUsed: true, revision: state.revision + 1,
  };
  return {
    ok: true, state: next,
    events: [{ type: 'maneuver-applied', maneuver: command.maneuver,
      formation, revision: next.revision }],
  };
}

/** Trusted future dispatcher hooks must be pure; no ability rules ship in P03. */
export interface ActionRules {
  readonly validate: (state: GameState, actor: BroodState, action: ActorAction) =>
    'illegal-ability' | 'illegal-target' | undefined;
  // Restrict effects to entity data: effects cannot reset budgets, phase or revision.
  readonly apply: (state: GameState, actor: BroodState, action: ActorAction) => readonly BroodState[];
}

/** Shared legality guard for presentation and both actor-effect adapters. */
export function actorActionError(state: GameState, action: ActorAction): ErrorCode | undefined {
  const error = guard(state, action.expectedRevision);
  if (error) return error;
  const actor = state.brood.find(({ id }) => id === action.actorId);
  if (!actor) return 'unknown-actor';
  if (actor.owner !== 'player') return 'wrong-owner';
  if (actor.hp <= 0) return 'fallen-actor';
  if (state.actedIds.includes(actor.id)) return 'already-acted';
  return undefined;
}

/** Accounting lives here once; adapters supply only validated pure effects. */
function accountActorAction<State extends GameState>(
  state: State, action: ActorAction,
  validate: (state: State, actor: BroodState, action: ActorAction) => ErrorCode | undefined,
  apply: (state: State, actor: BroodState, action: ActorAction) => CommandResult<State>,
): CommandResult<State> {
  const rejectAction = (code: ErrorCode): CommandResult<State> =>
    ({ ok: false, state, events: [], error: { code } });
  const error = actorActionError(state, action);
  if (error) return rejectAction(error);
  const actor = state.brood.find(({ id }) => id === action.actorId)!;
  const legalityError = validate(state, actor, action);
  if (legalityError) return rejectAction(legalityError);
  const effect = apply(state, actor, action);
  if (!effect.ok) return rejectAction(effect.error.code);
  const next: State = {
    ...effect.state, round: state.round, formation: state.formation,
    maneuverUsed: state.maneuverUsed,
    actedIds: [...state.actedIds, actor.id], revision: state.revision + 1,
  };
  return {
    ok: true, state: next,
    events: [{ type: 'action-applied', actorId: actor.id, abilityId: action.abilityId,
      targetId: action.targetId, revision: next.revision }, ...effect.events],
  };
}

/** P03's original entity-only hooks and observable behavior remain supported. */
export function applyActorAction(
  state: GameState, action: ActorAction, rules: ActionRules,
): CommandResult {
  return accountActorAction(state, action, rules.validate, (snapshot, actor, request) => ({
    ok: true, state: { ...snapshot, brood: rules.apply(snapshot, actor, request) }, events: [],
  }));
}

/** P07 combat effects may settle HP/lifecycle or facing/status data, never budgets. */
export interface CombatActionRules {
  readonly validate: (state: CombatState, actor: BroodState, action: ActorAction) => ErrorCode | undefined;
  readonly apply: (state: CombatState, actor: BroodState, action: ActorAction) => CommandResult<CombatState>;
}

export function applyCombatActorAction(
  state: CombatState, action: ActorAction, rules: CombatActionRules,
): CommandResult<CombatState> {
  return accountActorAction(state, action, rules.validate, rules.apply);
}
