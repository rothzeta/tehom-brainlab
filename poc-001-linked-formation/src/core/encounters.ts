import { createCollector, COLLECTOR_VERSION, endCollectorPhase } from '../content/collector';
import type { CollectorState } from '../content/collector';
import { createCrucible, CRUCIBLE_VERSION, endCruciblePhase } from '../content/crucible';
import type { CrucibleState } from '../content/crucible';
import { createPatrol, PATROL_VERSION } from '../content/patrol';
import type { PatrolState } from '../content/patrol';
import { endPatrolPhase } from './rounds';
import type { GameState } from './state';

export type EncounterState = PatrolState | CrucibleState | CollectorState;
export type EncounterPreset = import('../content/patrol').PatrolPreset | import('../content/crucible').CruciblePreset;
export const EMBLEMS: Readonly<Record<string, string>> = { crucible: 'foundry-mechanism', collector: 'foundry-mechanism' };
export const ENCOUNTERS = {
  patrol: { id: 'patrol', title: 'Patrol', create: createPatrol,
    presets: [{ id: 'healthy', label: 'Healthy' }, { id: 'wounded-ugallu', label: 'Wounded Ugallu' },
      { id: 'wounded-girtablilu', label: 'Wounded Girtablilu' }],
    recognizes: (state: GameState): state is PatrolState => 'patrolVersion' in state && 'patrolRules' in state
      && 'enemies' in state && 'declaredIntentions' in state && 'protections' in state
      && 'shelters' in state && 'resolvedAttackIds' in state,
    endPhase: endPatrolPhase, rules: (state: PatrolState) => state.patrolRules,
    codec: { version: PATROL_VERSION, rulesKey: 'patrolRules' },
  },
  crucible: { id: 'crucible', title: 'Crucible', create: createCrucible,
    presets: [{ id: 'phase-one', label: 'Phase one' }, { id: 'phase-two-diagnostic', label: 'Phase two — diagnostic start' }],
    recognizes: (state: GameState): state is CrucibleState => 'crucibleVersion' in state && 'crucibleRules' in state
      && 'enemies' in state && 'declaredIntentions' in state && 'protections' in state
      && 'shelters' in state && 'resolvedAttackIds' in state,
    endPhase: endCruciblePhase, rules: (state: CrucibleState) => state.crucibleRules,
    codec: { version: CRUCIBLE_VERSION, rulesKey: 'crucibleRules' },
  },
  collector: { id: 'collector', title: 'Collector', create: createCollector,
    presets: [{ id: 'healthy', label: 'Healthy' }, { id: 'wounded-ugallu', label: 'Wounded Ugallu' },
      { id: 'wounded-girtablilu', label: 'Wounded Girtablilu' }],
    recognizes: (state: GameState): state is CollectorState => 'collectorVersion' in state && 'collectorRules' in state
      && 'enemies' in state && 'declaredIntentions' in state && 'protections' in state
      && 'shelters' in state && 'resolvedAttackIds' in state,
    endPhase: endCollectorPhase, rules: (state: CollectorState) => state.collectorRules,
    codec: { version: COLLECTOR_VERSION, rulesKey: 'collectorRules' },
  },
} as const;
export type EncounterId = keyof typeof ENCOUNTERS;
export function encounterFor(state: GameState): {
  id: EncounterId; title: string; presets: readonly { id: string; label: string }[];
  endPhase: (state: EncounterState, revision: number) => import('./commands').CommandResult<EncounterState>;
  rules: (state: EncounterState) => PatrolState['patrolRules'] | CrucibleState['crucibleRules'] | CollectorState['collectorRules'];
  codec: { version: string; rulesKey: 'patrolRules' | 'crucibleRules' | 'collectorRules' };
} | undefined {
  return Object.values(ENCOUNTERS).find(encounter => encounter.recognizes(state)) as ReturnType<typeof encounterFor>;
}
