import type { Brood } from '../core/formation';
import { DEFAULT_DAMAGE_RULES } from '../core/damage';

/** P07-owned experimental kit, not encounter tuning or balanced character designs. */
export const BROOD_RULES_VERSION = 'p07-v1';
export type AbilityId = 'claw' | 'shelter' | 'sting' | 'impale' | 'gale' | 'crosswind';

export const ABILITIES = Object.freeze({
  claw: Object.freeze({ brood: 'ugallu', name: 'Claw', target: 'enemy', damage: 4, bypassProtection: false }),
  shelter: Object.freeze({ brood: 'ugallu', name: 'Shelter', target: 'close-ally', reduction: DEFAULT_DAMAGE_RULES.shelterReduction }),
  sting: Object.freeze({ brood: 'girtablilu', name: 'Sting', target: 'enemy', damage: 4, bypassProtection: false }),
  impale: Object.freeze({ brood: 'girtablilu', name: 'Impale', target: 'enemy', damage: 6, bypassProtection: true }),
  gale: Object.freeze({ brood: 'pazuzu', name: 'Gale', target: 'enemy', damage: 3, bypassProtection: true }),
  crosswind: Object.freeze({ brood: 'pazuzu', name: 'Crosswind', target: 'rotatable-enemy', steps: 1 }),
} satisfies Record<AbilityId, { brood: Brood; name: string; target: string }>);

export function isAbilityId(value: unknown): value is AbilityId {
  return typeof value === 'string' && Object.hasOwn(ABILITIES, value);
}
