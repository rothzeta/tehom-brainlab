import { createPatrol } from '../../src/content/patrol';
import type { PatrolPreset, PatrolState } from '../../src/content/patrol';
import { announcePatrol } from '../../src/core/rounds';
import { frontMask } from '../../src/core/sectors';

export function fixedAreaFixture(preset: PatrolPreset = 'healthy'): PatrolState {
  const state = createPatrol(preset);
  return { ...state, declaredIntentions: [
    { id: 'owned-area', sourceId: 'warder', kind: 'fixed-area', turnable: true, cells: frontMask(0) },
    { id: 'owned-mark', sourceId: 'harrier', kind: 'marked-hit', targetId: 'pazuzu' },
  ] };
}

/** Explicit test-owned encounter inputs; provisional factory tuning cannot alter these. */
export function outcomeFixture(outcome: 'victory' | 'defeat'): PatrolState {
  const damage = outcome === 'victory' ? 0 : 50;
  const state = createPatrol('healthy', {
    warderDamage: damage, censerDamage: damage, harrierDamage: damage, isolatedHarrierDamage: damage,
    splashRadius: 2, closeThreshold: 2,
    damageRules: { directionalReduction: 0, shelterReduction: 0, closeThreshold: 2 },
  });
  return announcePatrol({ ...state, formation: { shape: 'compact', orientation: 0 },
    brood: state.brood.map(entity => ({ ...entity, hp: 20, maxHp: 20 })),
    enemies: state.enemies.map(entity => ({ ...entity, hp: outcome === 'victory' ? 1 : 20,
      maxHp: outcome === 'victory' ? 1 : 20, facing: 0 })), protections: [],
  });
}
