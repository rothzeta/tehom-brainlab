import type { Brood } from '../core/formation';
import { DEFAULT_DAMAGE_RULES } from '../core/damage';

/** Versioned experimental kit, not encounter tuning or balanced character designs. */
export const BROOD_RULES_VERSION = 'p14-v1';
export type AbilityId = 'claw' | 'shelter' | 'sting' | 'impale' | 'gale' | 'crosswind';

export const ABILITIES = Object.freeze({
  claw: Object.freeze({ brood: 'ugallu', name: 'Claw', summary: 'Attack any living enemy; protection applies.', target: 'enemy', damage: 4, bypassProtection: false }),
  shelter: Object.freeze({ brood: 'ugallu', name: 'Shelter', summary: 'Protect self or a Close ally for one hit; allies must stay Close. No stacking.', target: 'self-or-close-ally', reduction: DEFAULT_DAMAGE_RULES.shelterReduction }),
  sting: Object.freeze({ brood: 'girtablilu', name: 'Sting', summary: 'Attack any living enemy; protection applies.', target: 'enemy', damage: 4, bypassProtection: false }),
  impale: Object.freeze({ brood: 'girtablilu', name: 'Impale', summary: 'Attack with at least one living partner and all partner links Stretched; protection applies.', target: 'enemy', damage: 6, bypassProtection: false }),
  gale: Object.freeze({ brood: 'pazuzu', name: 'Gale', summary: 'Attack any living enemy; bypass protection.', target: 'enemy', damage: 3, bypassProtection: true }),
  crosswind: Object.freeze({ brood: 'pazuzu', name: 'Crosswind', summary: 'Turn a rotatable enemy and its turnable areas one chosen step about its tile; marks stay fixed.', target: 'rotatable-enemy', steps: 1 }),
} satisfies Record<AbilityId, { brood: Brood; name: string; summary: string; target: string }>);

export function isAbilityId(value: unknown): value is AbilityId {
  return typeof value === 'string' && Object.hasOwn(ABILITIES, value);
}
