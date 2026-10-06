import { PATROL_HP } from './patrol';
import { CLOSE_THRESHOLD, ROSTER } from '../core/formation';
import type { Orientation } from '../core/formation';
import { RING_ONE, RING_TWO } from '../core/hex';
import { sectorCells } from '../core/sectors';
import { SPLASH_RADIUS } from '../core/intents';
import type { Intention } from '../core/intents';
import { DEFAULT_DAMAGE_RULES } from '../core/damage';
import type { DamageRules } from '../core/damage';
import { createInitialState } from '../core/state';
import type { CombatState } from '../core/state';
import { endEncounterPhase } from '../core/rounds';
import type { CommandResult, GameplayEvent } from '../core/commands';

export const CRUCIBLE_VERSION = 'crucible-v1';
export type CruciblePreset = 'phase-one' | 'phase-two-diagnostic';
export type BossPhase = 1 | 2;
export type Beat = 'A' | 'B';
export interface CruciblePattern {
  readonly area: 'inner' | 'outer' | 'sector' | 'fork';
  readonly primaryDamage: number;
  readonly secondaryKind: 'marked-hit' | 'marked-splash';
  readonly secondaryDamage: number;
}
export interface CrucibleRules {
  readonly bossHp: number;
  readonly phaseTwoAt: number;
  readonly splashRadius: number;
  readonly closeThreshold: number;
  readonly damageRules: DamageRules;
  readonly patterns: Readonly<Record<BossPhase, Readonly<Record<Beat, CruciblePattern>>>>;
}
export const DEFAULT_CRUCIBLE_RULES: CrucibleRules = Object.freeze({
  bossHp: 60, phaseTwoAt: 30, splashRadius: SPLASH_RADIUS, closeThreshold: CLOSE_THRESHOLD,
  damageRules: DEFAULT_DAMAGE_RULES,
  patterns: Object.freeze({
    1: Object.freeze({ A: Object.freeze({ area: 'inner', primaryDamage: 5, secondaryKind: 'marked-hit', secondaryDamage: 3 }),
      B: Object.freeze({ area: 'sector', primaryDamage: 5, secondaryKind: 'marked-hit', secondaryDamage: 3 }) }),
    2: Object.freeze({ A: Object.freeze({ area: 'outer', primaryDamage: 5, secondaryKind: 'marked-splash', secondaryDamage: 2 }),
      B: Object.freeze({ area: 'fork', primaryDamage: 4, secondaryKind: 'marked-hit', secondaryDamage: 3 }) }),
  }),
});
export interface CrucibleState extends CombatState {
  readonly crucibleVersion: typeof CRUCIBLE_VERSION;
  readonly crucibleRules: CrucibleRules;
  readonly bossPhase: BossPhase;
  readonly beat: Beat;
}
export function validCrucibleRules(rules: CrucibleRules): boolean {
  return !!rules && [rules.bossHp, rules.phaseTwoAt, rules.splashRadius, rules.closeThreshold,
    rules.damageRules?.directionalReduction, rules.damageRules?.shelterReduction, rules.damageRules?.closeThreshold]
    .every(value => Number.isSafeInteger(value) && value >= 0) && rules.bossHp > 0
    && rules.phaseTwoAt <= rules.bossHp && ([1, 2] as const).every(phase => (['A', 'B'] as const).every(beat => {
      const pattern = rules.patterns?.[phase]?.[beat];
      return !!pattern && ['inner', 'outer', 'sector', 'fork'].includes(pattern.area)
        && ['marked-hit', 'marked-splash'].includes(pattern.secondaryKind)
        && [pattern.primaryDamage, pattern.secondaryDamage].every(value => Number.isSafeInteger(value) && value >= 0);
    }));
}
export function phaseTwoPending(state: CrucibleState): boolean {
  const boss = state.enemies.find(enemy => enemy.id === 'crucible');
  return state.bossPhase === 1 && !!boss && boss.hp > 0 && boss.hp <= state.crucibleRules.phaseTwoAt;
}
/** Declaration is the only phase boundary. Entry resets the beat without turning. */
export function announceCrucible(state: CrucibleState, initial = false): { state: CrucibleState; events: readonly GameplayEvent[] } {
  const entering = phaseTwoPending(state);
  const bossPhase = entering ? 2 : state.bossPhase;
  const beat = initial || entering ? 'A' : state.beat === 'A' ? 'B' : 'A';
  const boss = state.enemies.find(enemy => enemy.id === 'crucible')!;
  const facing = beat === 'B' ? ((boss.facing + 1) % 6) as Orientation : boss.facing;
  const living = ROSTER.flatMap(label => state.brood.filter(entity => entity.brood === label && entity.owner === 'player' && entity.hp > 0));
  const pattern = state.crucibleRules.patterns[bossPhase][beat];
  const cells = pattern.area === 'inner' ? RING_ONE : pattern.area === 'outer' ? RING_TWO
    : pattern.area === 'sector' ? sectorCells(facing) : [...sectorCells(facing), ...sectorCells(((facing + 2) % 6) as Orientation)];
  const mark = living.reduce<typeof living[number] | undefined>((lowest, candidate) => !lowest
    || BigInt(candidate.hp) * BigInt(lowest.maxHp) < BigInt(lowest.hp) * BigInt(candidate.maxHp) ? candidate : lowest, undefined);
  const declaredIntentions: readonly Intention[] = boss.hp > 0 && mark ? [
    { id: `crucible:${state.round}:primary`, sourceId: boss.id, kind: 'fixed-area', cells: cells.map(cell => ({ ...cell })),
      turnable: pattern.area === 'sector' || pattern.area === 'fork' },
    { id: `crucible:${state.round}:secondary`, sourceId: boss.id, kind: pattern.secondaryKind, targetId: mark.id },
  ] : [];
  return { state: { ...state, bossPhase, beat, enemies: state.enemies.map(enemy => enemy.id === boss.id ? { ...enemy, facing } : enemy),
    declaredIntentions, intentions: declaredIntentions.map(entry => entry.id) },
    events: entering ? [{ type: 'boss-phase-changed', sourceId: boss.id, before: 1, after: 2, round: state.round }] : [] };
}
export function createCrucible(preset: CruciblePreset = 'phase-one', rules = DEFAULT_CRUCIBLE_RULES): CrucibleState {
  if (!['phase-one', 'phase-two-diagnostic'].includes(preset)) throw new RangeError('Unknown Crucible preset');
  if (!validCrucibleRules(rules)) throw new RangeError('Invalid Crucible rules');
  const initial = createInitialState();
  return announceCrucible({ ...initial, crucibleVersion: CRUCIBLE_VERSION, crucibleRules: structuredClone(rules),
    bossPhase: preset === 'phase-one' ? 1 : 2, beat: 'A',
    brood: initial.brood.map(entity => ({ ...entity, hp: PATROL_HP[entity.brood], maxHp: PATROL_HP[entity.brood] })),
    enemies: [{ id: 'crucible', cell: { q: 0, r: 0 }, facing: 0, rotatable: true,
      hp: preset === 'phase-one' ? rules.bossHp : rules.phaseTwoAt, maxHp: rules.bossHp }],
    protections: [{ sourceId: 'crucible', targetId: 'crucible' }], shelters: [], resolvedAttackIds: [], declaredIntentions: [],
  }, true).state;
}
export function endCruciblePhase(state: CrucibleState, expectedRevision: number): CommandResult<CrucibleState> {
  const reject = (code: 'stale-revision' | 'wrong-phase' | 'invalid-command' | 'invalid-amount'): CommandResult<CrucibleState> =>
    ({ ok: false, state, events: [], error: { code } });
  if (expectedRevision !== state.revision) return reject('stale-revision');
  if (state.phase !== 'player') return reject('wrong-phase');
  if (state.crucibleVersion !== CRUCIBLE_VERSION || ![1, 2].includes(state.bossPhase) || !['A', 'B'].includes(state.beat)) return reject('invalid-command');
  if (!validCrucibleRules(state.crucibleRules)) return reject('invalid-amount');
  const pattern = state.crucibleRules.patterns[state.bossPhase][state.beat];
  if (state.enemies.length !== 1 || state.enemies[0]!.id !== 'crucible'
    || state.enemies[0]!.cell.q !== 0 || state.enemies[0]!.cell.r !== 0
    || state.declaredIntentions.length > 2 || new Set(state.declaredIntentions.map(entry => entry.id)).size !== state.declaredIntentions.length
    || state.declaredIntentions.some(entry => entry.sourceId !== 'crucible'
      || !(entry.id === `crucible:${state.round}:primary` && entry.kind === 'fixed-area'
        || entry.id === `crucible:${state.round}:secondary` && entry.kind === pattern.secondaryKind))) return reject('invalid-command');
  return endEncounterPhase(state, expectedRevision, {
    intentions: snapshot => [...snapshot.declaredIntentions].sort((a, b) => a.id.endsWith(':primary') ? -1 : b.id.endsWith(':primary') ? 1 : 0),
    damage: (_, intention) => intention.kind === 'fixed-area' ? pattern.primaryDamage : pattern.secondaryDamage,
    rules: state.crucibleRules, announce: announceCrucible,
  });
}
