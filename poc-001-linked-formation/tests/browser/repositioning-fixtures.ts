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
  return { ...state, formation: { shape: 'compact', orientation: 0 }, brood: state.brood.map(entity => ({ ...entity, hp: 40, maxHp: 40 })), enemies: ['warder', 'censer', 'harrier'].map((id, index) => ({
    ...state.enemies.find(enemy => enemy.id === id)!,
    cell: ENEMY_ROUTE[(index + 2) % ENEMY_ROUTE.length]!, facing: 0 as const,
    hp: mode === 'corpse' && index === 1 ? 0 : 20, maxHp: 20,
    mobile: index === 0, rotatable: index === 0,
  })) };
}
