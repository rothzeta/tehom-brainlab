import { announceCollector, createCollector } from '../../src/content/collector';
import type { CollectorPreset, CollectorRules, CollectorState } from '../../src/content/collector';

/** Test-owned inputs keep mandatory traces independent of provisional product tuning. */
export const COLLECTOR_TEST_RULES: CollectorRules = {
  bossHp: 90, warderHp: 30, censerHp: 30, wardRange: 2,
  warderDamage: 2, censerDamage: 3, sweepDamage: 5, splashRadius: 2, closeThreshold: 2,
  damageRules: { directionalReduction: 1, shelterReduction: 4, closeThreshold: 2 },
};
export function collectorFixture(mode = 'trace', preset: CollectorPreset = 'healthy'): CollectorState {
  const state = createCollector(preset, COLLECTOR_TEST_RULES);
  return announceCollector({ ...state,
    formation: { shape: 'compact', orientation: mode === 'in-range' ? 3 : 0 },
    brood: state.brood.map(entity => ({ ...entity, hp: 100, maxHp: 100 })),
    enemies: [
      { id: 'warder', hp: mode === 'corpse' ? 0 : mode === 'trace' ? 1 : 30, maxHp: 30,
        cell: { q: -2, r: 1 }, facing: 4, mobile: false, rotatable: true, objective: false },
      { id: 'censer', hp: 30, maxHp: 30, cell: { q: 1, r: -2 }, facing: 0, mobile: false, rotatable: false, objective: false },
      { id: 'collector', hp: mode === 'kill' ? 1 : 90, maxHp: 90,
        cell: mode === 'in-range' || mode === 'corpse' ? { q: -1, r: 2 } : { q: 1, r: 1 },
        facing: 0, mobile: true, rotatable: true, objective: true },
    ],
    protections: mode === 'corpse' ? [] : [{ sourceId: 'warder', targetId: 'collector', range: 2 }],
  }).state;
}
