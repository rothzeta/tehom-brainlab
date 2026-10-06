import { ABILITIES, isAbilityId } from '../content/brood';
import type { ActorAction, CommandResult, ErrorCode } from './commands';
import { applyAttack, DEFAULT_DAMAGE_RULES, shelterEligible } from './damage';
import type { DamageRules } from './damage';
import { activeLinks, turnEnemy } from './intents';
import { actorActionError, applyCombatActorAction } from './transition';
import type { CombatState } from './state';

export type TurnDirection = 'clockwise' | 'anticlockwise';
export interface AbilityRequest extends ActorAction {
  readonly direction?: TurnDirection;
}
/** Crosswind alone requires a direction. Runtime callers are still validated. */
export type AbilityCommand = { readonly kind: 'useAbility'; readonly expectedRevision: number;
  readonly actorId: string; readonly targetId: string } & (
    | { readonly abilityId: 'claw' | 'shelter' | 'sting' | 'impale' | 'gale'; readonly direction?: never }
    | { readonly abilityId: 'crosswind'; readonly direction: TurnDirection }
  );

export interface AbilityRules {
  readonly clawDamage: number;
  readonly stingDamage: number;
  readonly impaleDamage: number;
  readonly galeDamage: number;
  readonly damageRules: DamageRules;
}
export const DEFAULT_ABILITY_RULES: AbilityRules = Object.freeze({
  clawDamage: ABILITIES.claw.damage, stingDamage: ABILITIES.sting.damage,
  impaleDamage: ABILITIES.impale.damage, galeDamage: ABILITIES.gale.damage,
  damageRules: DEFAULT_DAMAGE_RULES,
});

export type AbilityEvent = { readonly type: 'shelter-installed'; readonly shelterId: string;
  readonly sourceId: string; readonly targetId: string };
export type AbilityLegality = { readonly ok: true }
  | { readonly ok: false; readonly error: { readonly code: ErrorCode } };

function abilityEffectId(state: CombatState, action: AbilityRequest): string {
  return `ability:${JSON.stringify([state.revision, action.actorId, action.abilityId])}`;
}

/** Same current-state legality used by dispatch and future presentation. No effects/spend. */
export function abilityLegality(
  state: CombatState, action: AbilityRequest, rules: AbilityRules = DEFAULT_ABILITY_RULES,
): AbilityLegality {
  const reject = (code: ErrorCode): AbilityLegality => ({ ok: false, error: { code } });
  const error = actorActionError(state, action);
  if (error) return reject(error);
  const actor = state.brood.find(({ id }) => id === action.actorId)!;
  if (!isAbilityId(action.abilityId) || ABILITIES[action.abilityId].brood !== actor.brood) {
    return reject('illegal-ability');
  }
  if (![rules.clawDamage, rules.stingDamage, rules.impaleDamage, rules.galeDamage,
    rules.damageRules.directionalReduction, rules.damageRules.shelterReduction,
    rules.damageRules.closeThreshold].every((value) => Number.isSafeInteger(value) && value >= 0)) {
    return reject('invalid-amount');
  }
  if (action.abilityId === 'crosswind'
    ? action.direction !== 'clockwise' && action.direction !== 'anticlockwise'
    : action.direction !== undefined) return reject('invalid-command');
  if (action.abilityId === 'shelter') {
    if (state.shelters.some(({ id }) => id === abilityEffectId(state, action))) return reject('invalid-command');
    if (state.shelters.some(({ targetId }) => targetId === action.targetId)) return reject('illegal-target');
    return shelterEligible(state, { sourceId: actor.id, targetId: action.targetId }, rules.damageRules.closeThreshold)
      ? { ok: true } : reject('illegal-target');
  }
  const target = state.enemies.find(({ id, hp }) => id === action.targetId && hp > 0);
  if (!target) return reject('illegal-target');
  if (action.abilityId === 'crosswind' && (target.rotatable === false
    || !Number.isInteger(target.facing) || target.facing < 0 || target.facing > 5)) {
    return reject('illegal-target');
  }
  if (action.abilityId !== 'crosswind' && state.resolvedAttackIds.includes(abilityEffectId(state, action))) {
    return reject('duplicate-attack');
  }
  if (action.abilityId === 'impale') {
    const partners = state.brood.filter((entity) => entity.id !== actor.id
      && entity.owner === 'player' && entity.hp > 0);
    const links = activeLinks(state, rules.damageRules.closeThreshold)
      .filter((link) => link.fromId === actor.id || link.toId === actor.id);
    if (partners.length === 0 || links.length !== partners.length || links.some(({ state }) => state !== 'stretched')) {
      return reject('illegal-ability');
    }
  }
  return { ok: true };
}

/** Six explicit effects. P03 owns accounting, P05 geometry, P06 HP/lifecycle/status impact. */
export function applyAbility(
  state: CombatState, action: AbilityRequest, rules: AbilityRules = DEFAULT_ABILITY_RULES,
): CommandResult<CombatState> {
  return applyCombatActorAction(state, action, {
    validate: (snapshot) => {
      const legality = abilityLegality(snapshot, action, rules);
      return legality.ok ? undefined : legality.error.code;
    },
    apply: (snapshot, actor) => {
      // Revision makes identities stable on replay and distinct after a round reset.
      const effectId = abilityEffectId(snapshot, action);
      switch (action.abilityId) {
        case 'shelter': {
          const shelter = { id: effectId, sourceId: actor.id, targetId: action.targetId };
          return { ok: true, state: { ...snapshot, shelters: [...snapshot.shelters, shelter] },
            events: [{ type: 'shelter-installed', shelterId: shelter.id,
              sourceId: shelter.sourceId, targetId: shelter.targetId }] };
        }
        case 'crosswind': {
          const target = snapshot.enemies.find(({ id }) => id === action.targetId)!;
          const turned = turnEnemy(target, snapshot.declaredIntentions, action.direction!);
          if (!turned.ok) return { ok: false, state: snapshot, events: [], error: { code: 'illegal-target' } };
          return { ok: true, state: { ...snapshot,
            enemies: snapshot.enemies.map((enemy) => enemy.id === target.id
              ? { ...enemy, facing: turned.enemy.facing } : enemy),
            declaredIntentions: turned.intentions }, events: turned.events };
        }
        case 'claw':
        case 'sting':
        case 'impale':
        case 'gale':
          return applyAttack(snapshot, { kind: 'attack', expectedRevision: snapshot.revision,
            eventId: effectId, sourceId: actor.id, recipientIds: [action.targetId],
            rawDamage: action.abilityId === 'claw' ? rules.clawDamage
              : action.abilityId === 'sting' ? rules.stingDamage
                : action.abilityId === 'impale' ? rules.impaleDamage : rules.galeDamage,
            bypassProtection: ABILITIES[action.abilityId].bypassProtection }, rules.damageRules);
        default:
          return { ok: false, state: snapshot, events: [], error: { code: 'illegal-ability' } };
      }
    },
  });
}
