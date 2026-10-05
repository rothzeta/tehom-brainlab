import { CLOSE_THRESHOLD } from '../core/formation';
import { SPLASH_RADIUS } from '../core/intents';
import { DEFAULT_DAMAGE_RULES } from '../core/damage';
import type { DamageRules } from '../core/damage';
import { announcePatrol } from '../core/rounds';
import { createInitialState } from '../core/state';
import type { CombatState } from '../core/state';

export const PATROL_VERSION = 'patrol-v2';
export const PATROL_ORDER = Object.freeze(['warder', 'censer', 'harrier'] as const);
export const PATROL_HP = Object.freeze({ ugallu: 18, girtablilu: 14, pazuzu: 14,
  warder: 12, censer: 10, harrier: 13 });
export const WOUNDED_HP = Object.freeze({ ugallu: 7, girtablilu: 5 });
/** Provisional alternating tile layout shared by all HP presets. */
export const PATROL_LAYOUT = Object.freeze({
  warder: Object.freeze({ cell: Object.freeze({ q: 1, r: -2 }), facing: 0 as const }),
  censer: Object.freeze({ cell: Object.freeze({ q: -2, r: 1 }), facing: 4 as const }),
  harrier: Object.freeze({ cell: Object.freeze({ q: 1, r: 1 }), facing: 2 as const }),
});
export type PatrolPreset = 'healthy' | 'wounded-ugallu' | 'wounded-girtablilu';
export interface PatrolRules {
  readonly warderDamage: number;
  readonly censerDamage: number;
  readonly harrierDamage: number;
  readonly isolatedHarrierDamage: number;
  readonly splashRadius: number;
  readonly closeThreshold: number;
  readonly damageRules: DamageRules;
}
export const DEFAULT_PATROL_RULES: PatrolRules = Object.freeze({ warderDamage: 3,
  censerDamage: 3, harrierDamage: 4, isolatedHarrierDamage: 7,
  splashRadius: SPLASH_RADIUS, closeThreshold: CLOSE_THRESHOLD, damageRules: DEFAULT_DAMAGE_RULES });
/** Persist experimental inputs so a serialized session replays without external tuning. */
export interface PatrolState extends CombatState {
  readonly patrolVersion: typeof PATROL_VERSION;
  readonly patrolRules: PatrolRules;
}

export function createPatrol(preset: PatrolPreset = 'healthy', rules = DEFAULT_PATROL_RULES): PatrolState {
  if (!['healthy', 'wounded-ugallu', 'wounded-girtablilu'].includes(preset)) {
    throw new RangeError('Unknown patrol preset');
  }
  const initial = createInitialState();
  const state: PatrolState = { ...initial, patrolVersion: PATROL_VERSION,
    patrolRules: { ...rules, damageRules: { ...rules.damageRules } },
    brood: initial.brood.map((brood) => ({ ...brood, maxHp: PATROL_HP[brood.brood],
      hp: preset === 'wounded-ugallu' && brood.brood === 'ugallu' ? WOUNDED_HP.ugallu
        : preset === 'wounded-girtablilu' && brood.brood === 'girtablilu' ? WOUNDED_HP.girtablilu
          : PATROL_HP[brood.brood] })),
    enemies: PATROL_ORDER.map((id) => ({ id, hp: PATROL_HP[id], maxHp: PATROL_HP[id],
      cell: { ...PATROL_LAYOUT[id].cell }, facing: PATROL_LAYOUT[id].facing, rotatable: id === 'warder' })),
    protections: [{ sourceId: 'warder', targetId: 'censer' }],
    shelters: [], resolvedAttackIds: [], declaredIntentions: [] };
  return announcePatrol(state);
}
export const createHealthyPatrol = (rules = DEFAULT_PATROL_RULES) => createPatrol('healthy', rules);
export const createWoundedUgalluPatrol = (rules = DEFAULT_PATROL_RULES) => createPatrol('wounded-ugallu', rules);
export const createWoundedGirtabliluPatrol = (rules = DEFAULT_PATROL_RULES) => createPatrol('wounded-girtablilu', rules);
