import { ROSTER } from './formation';
import type { Brood, Formation } from './formation';

export type Phase = 'player' | 'enemy' | 'victory' | 'defeat';

export interface BroodState {
  readonly id: string;
  readonly brood: Brood;
  readonly owner: 'player' | 'enemy';
  readonly hp: number;
  readonly maxHp: number;
  readonly statuses: readonly string[];
}

/** Plain snapshots only; HP and opaque extension labels are fixture data, not balance. */
export interface GameState {
  readonly revision: number;
  readonly round: number;
  readonly phase: Phase;
  readonly formation: Formation;
  readonly brood: readonly BroodState[];
  readonly actedIds: readonly string[];
  readonly maneuverUsed: boolean;
  readonly intentions: readonly string[];
}

/** Fresh independent collections on every call. Round reset belongs to P08. */
export function createInitialState(): GameState {
  return {
    revision: 0,
    round: 1,
    phase: 'player',
    formation: { shape: 'compact', orientation: 0 },
    brood: ROSTER.map((brood) => ({
      id: brood, brood, owner: 'player', hp: 1, maxHp: 1, statuses: [],
    })),
    actedIds: [],
    maneuverUsed: false,
    intentions: [],
  };
}
