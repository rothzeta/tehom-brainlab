import { createPatrol } from '../../src/content/patrol';
import type { PatrolPreset, PatrolState } from '../../src/content/patrol';
import { frontMask } from '../../src/core/sectors';

export function fixedAreaFixture(preset: PatrolPreset = 'healthy'): PatrolState {
  const state = createPatrol(preset);
  return { ...state, declaredIntentions: [
    { id: 'owned-area', sourceId: 'warder', kind: 'fixed-area', turnable: true, cells: frontMask(0) },
    { id: 'owned-mark', sourceId: 'harrier', kind: 'marked-hit', targetId: 'pazuzu' },
  ] };
}
