import { ROSTER } from './formation';
import type { Brood, Formation } from './formation';
import type { EnemyState, Intention, ProtectionRelation } from './intents';

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
  readonly rotationUsed: boolean;
  readonly shapeChangeUsed: boolean;
  readonly intentions: readonly string[];
}

/** P06 combat data composes P03 snapshots and P05 selector inputs. */
export interface CombatEnemy extends EnemyState {
  /** Only explicitly mobile enemies relocate between rounds. */
  readonly mobile?: boolean;
  /** Existing P05 enemies rotate by default; false explicitly disables Crosswind. */
  readonly rotatable?: boolean;
  readonly maxHp: number;
}

export interface Shelter {
  readonly id: string;
  readonly sourceId: string;
  readonly targetId: string;
}

export interface CombatState extends GameState {
  readonly enemies: readonly CombatEnemy[];
  readonly declaredIntentions: readonly Intention[];
  readonly protections: readonly ProtectionRelation[];
  readonly shelters: readonly Shelter[];
  /** Encounter-scoped identities prevent a later callback from repeating a hit. */
  readonly resolvedAttackIds: readonly string[];
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
    rotationUsed: false,
    shapeChangeUsed: false,
    intentions: [],
  };
}
