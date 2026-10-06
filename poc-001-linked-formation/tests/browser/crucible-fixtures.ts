import { createCrucible } from '../../src/content/crucible';
import type { CruciblePreset } from '../../src/content/crucible';

export function crucibleFixture(mode: string, preset: CruciblePreset = 'phase-one') {
  const state = createCrucible(preset);
  return { ...state, enemies: state.enemies.map(enemy => ({ ...enemy,
    hp: mode === 'kill' ? 1 : state.crucibleRules.phaseTwoAt + 1 })) };
}
