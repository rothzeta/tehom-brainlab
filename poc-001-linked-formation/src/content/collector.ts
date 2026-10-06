import { PATROL_HP, WOUNDED_HP } from './patrol';
import type { PatrolPreset } from './patrol';
import { CLOSE_THRESHOLD, formationPositions, ROSTER } from '../core/formation';
import type { Orientation } from '../core/formation';
import { frontCells } from '../core/sectors';
import { SPLASH_RADIUS } from '../core/intents';
import type { Intention } from '../core/intents';
import { DEFAULT_DAMAGE_RULES } from '../core/damage';
import type { DamageRules } from '../core/damage';
import { createInitialState } from '../core/state';
import type { CombatState } from '../core/state';
import { endEncounterPhase } from '../core/rounds';
import type { CommandResult, GameplayEvent } from '../core/commands';

export const COLLECTOR_VERSION = 'collector-v1';
export type CollectorPreset = PatrolPreset;
export const COLLECTOR_ORDER = Object.freeze(['warder', 'censer', 'collector'] as const);
/** Provisional starting tiles and facings; movement uses the shared P16 route. */
export const COLLECTOR_LAYOUT = Object.freeze({
  collector: Object.freeze({ cell: Object.freeze({ q: 1, r: 1 }), facing: 0 as const }),
  warder: Object.freeze({ cell: Object.freeze({ q: -2, r: 1 }), facing: 4 as const }),
  censer: Object.freeze({ cell: Object.freeze({ q: 1, r: -2 }), facing: 0 as const }),
});
export interface CollectorRules {
  readonly bossHp: number;
  readonly warderHp: number;
  readonly censerHp: number;
  readonly wardRange: number;
  readonly warderDamage: number;
  readonly censerDamage: number;
  readonly sweepDamage: number;
  readonly splashRadius: number;
  readonly closeThreshold: number;
  readonly damageRules: DamageRules;
}
export const DEFAULT_COLLECTOR_RULES: CollectorRules = Object.freeze({
  bossHp: 36, warderHp: 10, censerHp: 10, wardRange: 2,
  warderDamage: 2, censerDamage: 3, sweepDamage: 5,
  splashRadius: SPLASH_RADIUS, closeThreshold: CLOSE_THRESHOLD, damageRules: DEFAULT_DAMAGE_RULES,
});
export interface CollectorState extends CombatState {
  readonly collectorVersion: typeof COLLECTOR_VERSION;
  readonly collectorRules: CollectorRules;
}
export function validCollectorRules(rules: CollectorRules): boolean {
  return !!rules && [rules.bossHp, rules.warderHp, rules.censerHp, rules.wardRange,
    rules.warderDamage, rules.censerDamage, rules.sweepDamage, rules.splashRadius, rules.closeThreshold,
    rules.damageRules?.directionalReduction, rules.damageRules?.shelterReduction, rules.damageRules?.closeThreshold]
    .every(value => Number.isSafeInteger(value) && value >= 0)
    && rules.bossHp > 0 && rules.warderHp > 0 && rules.censerHp > 0;
}
/** Choose maximum living coverage, retaining current facing on ties, then clockwise. */
export function announceCollector(state: CollectorState): { state: CollectorState; events: readonly GameplayEvent[] } {
  const living = ROSTER.flatMap(label => state.brood.filter(entity => entity.brood === label && entity.owner === 'player' && entity.hp > 0));
  const boss = state.enemies.find(enemy => enemy.id === 'collector')!;
  const positions = formationPositions(state.formation).filter(position => living.some(entity => entity.brood === position.brood));
  const coverage = (facing: Orientation) => positions.filter(position => frontCells(boss.cell, facing)
    .some(cell => cell.q === position.cell.q && cell.r === position.cell.r)).length;
  let facing = boss.facing;
  for (let step = 1; step < 6; step++) {
    const candidate = ((boss.facing + step) % 6) as Orientation;
    if (coverage(candidate) > coverage(facing)) facing = candidate;
  }
  const cycle = ['girtablilu', 'pazuzu', 'ugallu'];
  const splashTarget = Array.from({ length: cycle.length }, (_, offset) => cycle[(state.round - 1 + offset) % cycle.length])
    .map(label => living.find(entity => entity.brood === label)).find(entity => entity);
  const declaredIntentions: Intention[] = living.length === 0 || boss.hp <= 0 ? [] : COLLECTOR_ORDER.flatMap<Intention>(sourceId => {
    if (!state.enemies.some(enemy => enemy.id === sourceId && enemy.hp > 0)) return [];
    const id = `collector:${state.round}:${sourceId}`;
    return sourceId === 'collector'
      ? [{ id, sourceId, kind: 'fixed-area' as const, cells: frontCells(boss.cell, facing).map(cell => ({ ...cell })), turnable: true }]
      : [{ id, sourceId, kind: sourceId === 'censer' ? 'marked-splash' as const : 'marked-hit' as const,
        targetId: (sourceId === 'warder' ? living[0]! : splashTarget!).id }];
  });
  return { state: { ...state, enemies: state.enemies.map(enemy => enemy.id === boss.id && boss.hp > 0 ? { ...enemy, facing } : enemy),
    declaredIntentions, intentions: declaredIntentions.map(entry => entry.id) }, events: [] };
}
export function createCollector(preset: CollectorPreset = 'healthy', rules = DEFAULT_COLLECTOR_RULES): CollectorState {
  if (!['healthy', 'wounded-ugallu', 'wounded-girtablilu'].includes(preset)) throw new RangeError('Unknown Collector preset');
  if (!validCollectorRules(rules)) throw new RangeError('Invalid Collector rules');
  const initial = createInitialState();
  return announceCollector({ ...initial, collectorVersion: COLLECTOR_VERSION, collectorRules: structuredClone(rules),
    brood: initial.brood.map(entity => ({ ...entity, maxHp: PATROL_HP[entity.brood],
      hp: preset === 'wounded-ugallu' && entity.brood === 'ugallu' ? WOUNDED_HP.ugallu
        : preset === 'wounded-girtablilu' && entity.brood === 'girtablilu' ? WOUNDED_HP.girtablilu : PATROL_HP[entity.brood] })),
    enemies: COLLECTOR_ORDER.map(id => ({ id, cell: { ...COLLECTOR_LAYOUT[id].cell }, facing: COLLECTOR_LAYOUT[id].facing,
      hp: id === 'collector' ? rules.bossHp : id === 'warder' ? rules.warderHp : rules.censerHp,
      maxHp: id === 'collector' ? rules.bossHp : id === 'warder' ? rules.warderHp : rules.censerHp,
      mobile: id === 'collector', rotatable: id !== 'censer', objective: id === 'collector' })),
    protections: [{ sourceId: 'warder', targetId: 'collector', range: rules.wardRange }],
    shelters: [], resolvedAttackIds: [], declaredIntentions: [],
  }).state;
}
export function endCollectorPhase(state: CollectorState, expectedRevision: number): CommandResult<CollectorState> {
  const reject = (code: 'stale-revision' | 'wrong-phase' | 'invalid-command' | 'invalid-amount'): CommandResult<CollectorState> =>
    ({ ok: false, state, events: [], error: { code } });
  if (expectedRevision !== state.revision) return reject('stale-revision');
  if (state.phase !== 'player') return reject('wrong-phase');
  if (state.collectorVersion !== COLLECTOR_VERSION) return reject('invalid-command');
  if (!validCollectorRules(state.collectorRules)) return reject('invalid-amount');
  if (state.declaredIntentions.some(entry => !COLLECTOR_ORDER.some(id => id === entry.sourceId)
    || entry.id !== `collector:${state.round}:${entry.sourceId}`
    || entry.kind !== (entry.sourceId === 'collector' ? 'fixed-area' : entry.sourceId === 'censer' ? 'marked-splash' : 'marked-hit'))
    || new Set(state.declaredIntentions.map(entry => entry.sourceId)).size !== state.declaredIntentions.length) return reject('invalid-command');
  const rules = state.collectorRules;
  return endEncounterPhase(state, expectedRevision, {
    intentions: snapshot => COLLECTOR_ORDER.flatMap(id => snapshot.declaredIntentions.filter(entry => entry.sourceId === id)),
    damage: (_, intention) => intention.sourceId === 'warder' ? rules.warderDamage
      : intention.sourceId === 'censer' ? rules.censerDamage : rules.sweepDamage,
    rules, announce: announceCollector,
  });
}
