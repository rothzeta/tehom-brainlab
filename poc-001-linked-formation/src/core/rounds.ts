import { PATROL_ORDER, PATROL_VERSION } from '../content/patrol';
import type { PatrolState } from '../content/patrol';
import type { CommandResult, ErrorCode, GameplayEvent } from './commands';
import { applyAttack } from './damage';
import { ROSTER } from './formation';
import { isIsolated, selectRecipients } from './intents';
import type { Intention } from './intents';
import { expireShelters, settleLifecycle } from './lifecycle';
import type { CombatState } from './state';

export type RoundEvent =
  | { readonly type: 'boss-phase-changed'; readonly sourceId: string; readonly before: 1; readonly after: 2; readonly round: number }
  | { readonly type: 'enemy-phase-started'; readonly round: number }
  | { readonly type: 'enemy-phase-ended'; readonly round: number }
  | { readonly type: 'round-started'; readonly round: number }
  | { readonly type: 'intentions-announced'; readonly round: number;
      readonly intentions: readonly Intention[] };

/** Stable roster ties, living candidates only; no rule reads enemy coordinates. */
export function announcePatrol<State extends CombatState>(state: State): State {
  const living = ROSTER.flatMap((label) => state.brood.filter(({ brood, hp, owner }) =>
    brood === label && hp > 0 && owner === 'player'));
  if (living.length === 0) return { ...state, declaredIntentions: [], intentions: [] };
  const warder = living[0]!;
  const cycle = ['girtablilu', 'pazuzu', 'ugallu'];
  const censer = Array.from({ length: cycle.length }, (_, offset) =>
    cycle[(state.round - 1 + offset) % cycle.length])
    .map((label) => living.find(({ brood }) => brood === label)).find((candidate) => candidate)!;
  const harrier = living.reduce((lowest, candidate) =>
    BigInt(candidate.hp) * BigInt(lowest.maxHp) < BigInt(lowest.hp) * BigInt(candidate.maxHp)
      ? candidate : lowest);
  const declaredIntentions: Intention[] = PATROL_ORDER.flatMap((sourceId) => {
    if (!state.enemies.some(({ id, hp }) => id === sourceId && hp > 0)) return [];
    return [{ id: `patrol:${state.round}:${sourceId}`, sourceId,
      kind: sourceId === 'censer' ? 'marked-splash' as const : 'marked-hit' as const,
      targetId: (sourceId === 'warder' ? warder : sourceId === 'censer' ? censer : harrier).id }];
  });
  return { ...state, declaredIntentions, intentions: declaredIntentions.map(({ id }) => id) };
}

/** Atomic public command: P06 settles each hit, while this adapter owns one revision. */
export function endPatrolPhase(state: PatrolState, expectedRevision: number): CommandResult<PatrolState> {
  const reject = (code: ErrorCode): CommandResult<PatrolState> =>
    ({ ok: false, state, events: [], error: { code } });
  if (expectedRevision !== state.revision) return reject('stale-revision');
  if (state.phase !== 'player') return reject('wrong-phase');
  if (state.patrolVersion !== PATROL_VERSION) return reject('invalid-command');
  const rules = state.patrolRules;
  if (![rules.warderDamage, rules.censerDamage, rules.harrierDamage, rules.isolatedHarrierDamage,
    rules.splashRadius, rules.closeThreshold, rules.damageRules.directionalReduction,
    rules.damageRules.shelterReduction, rules.damageRules.closeThreshold]
    .every((value) => Number.isSafeInteger(value) && value >= 0)) return reject('invalid-amount');
  if (state.declaredIntentions.some(({ sourceId, kind }) =>
    !PATROL_ORDER.some((id) => id === sourceId) || kind !== (sourceId === 'censer' ? 'marked-splash' : 'marked-hit'))
    || new Set(state.declaredIntentions.map(({ sourceId }) => sourceId)).size !== state.declaredIntentions.length) {
    return reject('invalid-command');
  }
  return endEncounterPhase(state, expectedRevision, {
    intentions: (snapshot) => PATROL_ORDER.flatMap(sourceId =>
      snapshot.declaredIntentions.filter(entry => entry.sourceId === sourceId)),
    damage: (snapshot, intention) => intention.sourceId === 'warder' ? rules.warderDamage
      : intention.sourceId === 'censer' ? rules.censerDamage
        : intention.kind !== 'fixed-area' && isIsolated(snapshot, intention.targetId, rules.closeThreshold)
          ? rules.isolatedHarrierDamage : rules.harrierDamage,
    rules, announce: snapshot => ({ state: announcePatrol(snapshot), events: [] }),
  });
}

/** Encounters own guards, ordering, damage and announcements; lifecycle stays shared. */
export function endEncounterPhase<State extends CombatState>(state: State, expectedRevision: number, encounter: {
  intentions: (state: State) => readonly Intention[];
  damage: (state: State, intention: Intention) => number;
  rules: { splashRadius: number; damageRules: import('./damage').DamageRules };
  announce: (state: State) => { state: State; events: readonly GameplayEvent[] };
}): CommandResult<State> {
  const reject = (code: ErrorCode): CommandResult<State> => ({ ok: false, state, events: [], error: { code } });
  if (expectedRevision !== state.revision) return reject('stale-revision');
  if (state.phase !== 'player') return reject('wrong-phase');
  const events: GameplayEvent[] = [{ type: 'enemy-phase-started', round: state.round }];
  const started = settleLifecycle(state, { ...state, phase: 'enemy' });
  let next: State = { ...state, ...started.state };
  events.push(...started.events);
  for (const intention of encounter.intentions(next)) {
    if (next.phase === 'victory' || next.phase === 'defeat') break;
    const sourceId = intention.sourceId;
    const selected = selectRecipients(next, intention, encounter.rules.splashRadius);
    if (selected.reason !== 'resolved') continue;
    const rawDamage = encounter.damage(next, intention);
    const hit = applyAttack(next, { kind: 'attack', expectedRevision: next.revision,
      eventId: intention.id, sourceId, recipientIds: selected.recipientIds,
      rawDamage, bypassProtection: false }, encounter.rules.damageRules);
    if (!hit.ok) return reject(hit.error.code);
    // Every emitted hit belongs to the single public transition, never a second callback.
    next = { ...next, ...hit.state, revision: state.revision };
    events.push(...hit.events);
  }
  const expired = expireShelters(next);
  next = { ...next, ...expired.state };
  events.push(...expired.events, { type: 'enemy-phase-ended', round: state.round });
  if (next.phase === 'enemy') {
    const announcement = encounter.announce({ ...next, round: state.round + 1, phase: 'player',
      actedIds: [], rotationUsed: false, shapeChangeUsed: false });
    next = announcement.state;
    events.push({ type: 'round-started', round: next.round }, ...announcement.events,
      { type: 'intentions-announced', round: next.round, intentions: next.declaredIntentions });
  }
  next = { ...next, revision: state.revision + 1 };
  return { ok: true, state: next, events };
}
