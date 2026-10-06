import type { PatrolState } from '../../src/content/patrol';
import { createPatrol } from '../../src/content/patrol';
import { ENEMY_ROUTE } from '../../src/core/enemy-movement';

/** Test-only inputs; no product enemies are made mobile. */
export function repositioningFixture(mode = 'mobile'): PatrolState {
  const state = createPatrol('healthy', {
    warderDamage: 2, censerDamage: 0, harrierDamage: 0, isolatedHarrierDamage: 0,
    splashRadius: 2, closeThreshold: 2,
    damageRules: { directionalReduction: 0, shelterReduction: 3, closeThreshold: 2 },
  });
  return { ...state, enemies: state.enemies.map((enemy, index) => ({ ...enemy,
    cell: ENEMY_ROUTE[(index + 2) % ENEMY_ROUTE.length]!, facing: 0 as const,
    hp: mode === 'corpse' && index === 1 ? 0 : 20, maxHp: 20,
    mobile: index === 0, rotatable: index === 0,
  })) };
}
