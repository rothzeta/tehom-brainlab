import { createCrucible } from '../../src/content/crucible';
import type { CruciblePreset, CrucibleRules } from '../../src/content/crucible';

// Test-owned pacing and patterns keep mandatory traces reachable under product tuning.
const rules: CrucibleRules = {
  bossHp: 100, phaseTwoAt: 60, splashRadius: 2, closeThreshold: 2,
  damageRules: { directionalReduction: 1, shelterReduction: 3, closeThreshold: 2 },
  patterns: {
    1: { A: { area: 'inner', primaryDamage: 5, secondaryKind: 'marked-hit', secondaryDamage: 3 },
      B: { area: 'sector', primaryDamage: 5, secondaryKind: 'marked-hit', secondaryDamage: 3 } },
    2: { A: { area: 'outer', primaryDamage: 5, secondaryKind: 'marked-splash', secondaryDamage: 2 },
      B: { area: 'fork', primaryDamage: 4, secondaryKind: 'marked-hit', secondaryDamage: 3 } },
  },
};
export function crucibleFixture(mode: string, preset: CruciblePreset = 'phase-one') {
  const state = createCrucible(preset, rules);
  return { ...state, brood: state.brood.map(b => ({ ...b, hp: 200, maxHp: 200 })),
    enemies: state.enemies.map(enemy => ({ ...enemy, hp: mode === 'kill' ? 1 : rules.phaseTwoAt + 1 })) };
}
