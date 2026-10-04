import { selectRecipients } from './intents';
import type { RecipientSelection } from './intents';
import type { CombatState } from './state';

export type LifecycleEvent =
  | { readonly type: 'fallen'; readonly entityId: string; readonly owner: 'player' | 'enemy' }
  | { readonly type: 'protection-removed'; readonly sourceId: string; readonly targetId: string }
  | { readonly type: 'shelter-removed'; readonly shelterId: string;
      readonly reason: 'source-unavailable' | 'target-unavailable' | 'expired' }
  | { readonly type: 'intention-cancelled'; readonly intentionId: string;
      readonly reason: Exclude<RecipientSelection['reason'], 'resolved'> }
  | { readonly type: 'combat-ended'; readonly outcome: 'victory' | 'defeat' };

export interface LifecycleResult {
  readonly state: CombatState;
  readonly events: readonly LifecycleEvent[];
}

/** Trusted batch seam: caller owns revision accounting; compare pre/post HP once. */
export function settleLifecycle(before: CombatState, after: CombatState): LifecycleResult {
  const events: LifecycleEvent[] = [];
  const previous = new Map([...before.brood, ...before.enemies].map((entity) => [entity.id, entity.hp]));
  const entities = [...after.brood.map((entity) => ({ ...entity, owner: entity.owner })),
    ...after.enemies.map((entity) => ({ ...entity, owner: 'enemy' as const }))];
  for (const entity of entities.sort((a, b) => compareIds(a.id, b.id))) {
    if ((previous.get(entity.id) ?? 0) > 0 && entity.hp === 0) {
      events.push({ type: 'fallen', entityId: entity.id, owner: entity.owner });
    }
  }
  const living = (id: string) => entities.some((entity) => entity.id === id && entity.hp > 0);
  const protections = after.protections.filter(({ sourceId, targetId }) => living(sourceId) && living(targetId));
  for (const relation of after.protections.filter((relation) => !protections.includes(relation))
    .slice().sort((a, b) => compareIds(a.sourceId, b.sourceId) || compareIds(a.targetId, b.targetId))) {
    events.push({ type: 'protection-removed', ...relation });
  }
  const shelters = after.shelters.filter(({ sourceId, targetId }) => living(sourceId) && living(targetId));
  for (const shelter of after.shelters.filter((shelter) => !shelters.includes(shelter))
    .slice().sort((a, b) => compareIds(a.id, b.id))) {
    events.push({ type: 'shelter-removed', shelterId: shelter.id,
      reason: living(shelter.sourceId) ? 'target-unavailable' : 'source-unavailable' });
  }
  const declaredIntentions = after.declaredIntentions.filter((intention) =>
    selectRecipients(after, intention).reason === 'resolved');
  for (const intention of after.declaredIntentions.filter((intention) => !declaredIntentions.includes(intention))
    .slice().sort((a, b) => compareIds(a.id, b.id))) {
    const reason = selectRecipients(after, intention).reason;
    if (reason !== 'resolved') events.push({ type: 'intention-cancelled', intentionId: intention.id, reason });
  }
  // Empty living sets count as fallen. Defeat takes precedence in an all-dead batch.
  const phase = after.brood.every(({ hp, owner }) => owner !== 'player' || hp <= 0) ? 'defeat'
    : after.enemies.every(({ hp }) => hp <= 0) ? 'victory' : after.phase;
  if (phase !== after.phase && (phase === 'victory' || phase === 'defeat')) {
    events.push({ type: 'combat-ended', outcome: phase });
  }
  const changed = phase !== after.phase || protections.length !== after.protections.length
    || shelters.length !== after.shelters.length || declaredIntentions.length !== after.declaredIntentions.length;
  return { state: changed ? { ...after, phase, protections, shelters, declaredIntentions } : after, events };
}

/** P08 invokes this at enemy-phase end; no phase, budget, or round reset occurs here. */
export function expireShelters(state: CombatState): LifecycleResult {
  if (state.shelters.length === 0) return { state, events: [] };
  return {
    state: { ...state, shelters: [], revision: state.revision + 1 },
    events: state.shelters.slice().sort((a, b) => compareIds(a.id, b.id))
      .map(({ id }) => ({ type: 'shelter-removed', shelterId: id, reason: 'expired' })),
  };
}

/** Code-point order avoids locale-dependent event traces. */
export function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}
