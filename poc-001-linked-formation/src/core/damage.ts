import type { CommandResult, ErrorCode, GameplayEvent } from './commands';
import { CLOSE_THRESHOLD } from './formation';
import { isCloseLinked, selectProtection } from './intents';
import { compareIds, settleLifecycle } from './lifecycle';
import type { CombatState, Shelter } from './state';

export interface DamageRules {
  readonly directionalReduction: number;
  readonly shelterReduction: number;
  readonly closeThreshold: number;
}

/** Provisional P06 mitigation; callers can explicitly supply experimental tuning. */
export const DEFAULT_DAMAGE_RULES: DamageRules = Object.freeze({
  directionalReduction: 2, shelterReduction: 4, closeThreshold: CLOSE_THRESHOLD,
});

export interface AttackCommand {
  readonly kind: 'attack';
  readonly expectedRevision: number;
  readonly eventId: string;
  readonly sourceId: string;
  /** P05 resolves enemy recipients; P07 supplies legal player-ability recipients. */
  readonly recipientIds: readonly string[];
  readonly rawDamage: number;
  readonly bypassProtection: boolean;
}

export type DamageEvent =
  | { readonly type: 'attack-settled'; readonly eventId: string; readonly sourceId: string;
      readonly revision: number }
  | { readonly type: 'damage-applied'; readonly eventId: string; readonly targetId: string;
      readonly rawDamage: number; readonly directionalReduction: number;
      readonly shelterReduction: number; readonly damage: number;
      readonly hpBefore: number; readonly hpAfter: number }
  | { readonly type: 'shelter-consumed'; readonly shelterId: string; readonly targetId: string;
      readonly eligible: boolean };

/** Self needs a living player Brood; allied protection also needs Close at impact. */
export function shelterEligible(
  state: CombatState, shelter: Pick<Shelter, 'sourceId' | 'targetId'>,
  closeThreshold = DEFAULT_DAMAGE_RULES.closeThreshold,
): boolean {
  const source = state.brood.find(({ id, owner, hp }) =>
    id === shelter.sourceId && owner === 'player' && hp > 0);
  return !!source && (shelter.sourceId === shelter.targetId
    || isCloseLinked(state, shelter.sourceId, shelter.targetId, closeThreshold));
}

/** Same rejection envelope and revision discipline as P03; no action/phase dispatch. */
export function applyAttack(
  state: CombatState, attack: AttackCommand, rules: DamageRules = DEFAULT_DAMAGE_RULES,
): CommandResult<CombatState> {
  const reject = (code: ErrorCode): CommandResult<CombatState> =>
    ({ ok: false, state, events: [], error: { code } });
  if (attack.expectedRevision !== state.revision) return reject('stale-revision');
  if (state.phase !== 'player' && state.phase !== 'enemy') return reject('wrong-phase');
  const validId = (id: unknown): id is string => typeof id === 'string' && id.trim().length > 0;
  // Expose sparse array positions as undefined so every logical ID is checked.
  if (attack.kind !== 'attack' || !validId(attack.eventId) || !validId(attack.sourceId)
    || !Array.isArray(attack.recipientIds) || ![...attack.recipientIds].every(validId)
    || new Set(attack.recipientIds).size !== attack.recipientIds.length
    || typeof attack.bypassProtection !== 'boolean') return reject('invalid-command');
  if (!Number.isSafeInteger(attack.rawDamage) || attack.rawDamage < 0
    || ![rules.directionalReduction, rules.shelterReduction, rules.closeThreshold]
      .every((value) => Number.isSafeInteger(value) && value >= 0)) return reject('invalid-amount');
  if (state.resolvedAttackIds.includes(attack.eventId)) return reject('duplicate-attack');
  const entities = [...state.brood, ...state.enemies];
  const source = entities.find(({ id }) => id === attack.sourceId);
  if (!source) return reject('unknown-actor');
  if (source.hp <= 0) return reject('fallen-actor');
  if (attack.recipientIds.some((id) => !entities.some((entity) => entity.id === id && entity.hp > 0))) {
    return reject('illegal-target');
  }

  const revision = state.revision + 1;
  const events: GameplayEvent[] = [{ type: 'attack-settled', eventId: attack.eventId,
    sourceId: attack.sourceId, revision }];
  const hp = new Map<string, number>();
  const consumed = new Set<string>();
  // All calculations use the same pre-hit snapshot, including a guardian hit by this batch.
  for (const targetId of attack.recipientIds.slice().sort(compareIds)) {
    const target = entities.find(({ id }) => id === targetId)!;
    const directional = selectProtection(state, { actorId: source.id, targetId,
      bypassProtection: attack.bypassProtection }, state.protections).protected;
    const shelters = attack.rawDamage > 0 ? state.shelters.filter((shelter) => shelter.targetId === targetId) : [];
    const eligible = shelters.filter((shelter) => shelterEligible(state, shelter, rules.closeThreshold));
    const directionalReduction = directional ? Math.min(attack.rawDamage, rules.directionalReduction) : 0;
    const shelterReduction = eligible.length > 0
      ? Math.min(attack.rawDamage - directionalReduction, rules.shelterReduction) : 0;
    const damage = attack.rawDamage - directionalReduction - shelterReduction;
    const hpAfter = Math.min(target.maxHp, Math.max(0, target.hp - damage));
    hp.set(targetId, hpAfter);
    events.push({ type: 'damage-applied', eventId: attack.eventId, targetId,
      rawDamage: attack.rawDamage, directionalReduction, shelterReduction, damage,
      hpBefore: target.hp, hpAfter });
    for (const shelter of shelters) consumed.add(shelter.id);
  }
  for (const shelter of state.shelters.filter(({ id }) => consumed.has(id))
    .slice().sort((a, b) => compareIds(a.id, b.id))) {
    events.push({ type: 'shelter-consumed', shelterId: shelter.id, targetId: shelter.targetId,
      eligible: shelterEligible(state, shelter, rules.closeThreshold) });
  }
  const next: CombatState = {
    ...state, revision,
    brood: state.brood.map((entity) => hp.has(entity.id) ? { ...entity, hp: hp.get(entity.id)! } : entity),
    enemies: state.enemies.map((entity) => hp.has(entity.id) ? { ...entity, hp: hp.get(entity.id)! } : entity),
    shelters: state.shelters.filter(({ id }) => !consumed.has(id)),
    resolvedAttackIds: [...state.resolvedAttackIds, attack.eventId],
  };
  const settled = settleLifecycle(state, next);
  return { ok: true, state: settled.state, events: [...events, ...settled.events] };
}
