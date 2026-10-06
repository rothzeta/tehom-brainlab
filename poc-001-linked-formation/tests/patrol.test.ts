import { afterAll, afterEach, expect, test } from 'vitest';
import { createPatrol, createHealthyPatrol, createWoundedUgalluPatrol, createWoundedGirtabliluPatrol,
  DEFAULT_PATROL_RULES, PATROL_HP, PATROL_ORDER, PATROL_LAYOUT, WOUNDED_HP } from '../src/content/patrol';
import type { PatrolPreset, PatrolRules, PatrolState } from '../src/content/patrol';
import { ENEMY_CELLS } from '../src/core/hex';
import { applyAbility } from '../src/core/abilities';
import type { AbilityRules } from '../src/core/abilities';
import type { Command, CommandResult, ErrorCode } from '../src/core/commands';
import { selectProtection } from '../src/core/intents';
import { announcePatrol } from '../src/core/rounds';
import { createInitialState } from '../src/core/state';
import { applyCommand } from '../src/core/transition';

function freeze<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}
// Independent experiment inputs; exact arithmetic never relies on production defaults.
const rules: PatrolRules = freeze({ warderDamage: 3, censerDamage: 3,
  harrierDamage: 4, isolatedHarrierDamage: 7, splashRadius: 2, closeThreshold: 2,
  damageRules: { directionalReduction: 2, shelterReduction: 2, closeThreshold: 2 } });
const abilityRules: AbilityRules = freeze({ clawDamage: 4, stingDamage: 4, impaleDamage: 6,
  galeDamage: 3, damageRules: rules.damageRules });
function fixture(overrides: Partial<PatrolState> = {}): PatrolState {
  const state = createPatrol('healthy', rules);
  return freeze(announcePatrol({ ...state,
    brood: state.brood.map((brood) => ({ ...brood, hp: 30, maxHp: 30 })),
    enemies: state.enemies.map((enemy) => ({ ...enemy, hp: 30, maxHp: 30 })), ...overrides }));
}
function accepted(result: CommandResult<PatrolState>) {
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(result.error.code);
  return result;
}
function rejected(result: CommandResult<PatrolState>, state: PatrolState, code: ErrorCode) {
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error('Unexpected success');
  expect(result.state).toBe(state);
  expect(result.events).toEqual([]);
  expect(result.error.code).toBe(code);
}
function end(state: PatrolState) {
  return applyCommand(state, { kind: 'endPhase', expectedRevision: state.revision });
}
function marks(state: PatrolState) {
  return Object.fromEntries(state.declaredIntentions.map((intention) => [intention.sourceId,
    intention.kind === 'fixed-area' ? undefined : intention.targetId]));
}
let assertions = 0;
afterEach(() => { assertions += expect.getState().assertionCalls; });
afterAll(() => { console.info(`P08 patrol assertions executed: ${assertions}`); });

test.each<PatrolPreset>(['healthy', 'wounded-ugallu', 'wounded-girtablilu'])('AC1: independent %s factories expose content HP and fresh budgets', (preset) => {
  const state = createPatrol(preset);
  const another = createPatrol(preset);
  expect(state).toEqual(another);
  expect(state).not.toBe(another);
  expect(state).toMatchObject({ revision: 0, round: 1, phase: 'player',
    formation: { shape: 'compact', orientation: 0 }, actedIds: [], rotationUsed: false, shapeChangeUsed: false, shelters: [], resolvedAttackIds: [] });
  for (const brood of state.brood) {
    expect(brood.maxHp).toBe(PATROL_HP[brood.brood]);
    expect(brood.hp).toBe(preset === 'wounded-ugallu' && brood.brood === 'ugallu' ? WOUNDED_HP.ugallu
      : preset === 'wounded-girtablilu' && brood.brood === 'girtablilu' ? WOUNDED_HP.girtablilu : brood.maxHp);
    expect(brood.statuses).toEqual([]);
    expect(brood.hp).toBeGreaterThan(0);
    expect(brood.hp).toBeLessThanOrEqual(brood.maxHp);
    expect(brood).not.toBe(another.brood.find(({ id }) => id === brood.id));
  }
  for (const enemy of state.enemies) {
    expect(enemy.hp).toBe(PATROL_HP[enemy.id as 'warder' | 'censer' | 'harrier']);
    expect(enemy.hp).toBe(enemy.maxHp);
    expect({ cell: enemy.cell, facing: enemy.facing }).toEqual(PATROL_LAYOUT[enemy.id as keyof typeof PATROL_LAYOUT]);
    expect(ENEMY_CELLS).toContainEqual(enemy.cell);
    expect(enemy).not.toHaveProperty('position');
  }
  expect(state.patrolRules).not.toBe(another.patrolRules);
  expect(state.patrolRules.damageRules).not.toBe(another.patrolRules.damageRules);
  expect(state.declaredIntentions).not.toBe(another.declaredIntentions);
  expect(state.enemies.map(({ id, cell, facing }) => ({ id, cell, facing }))).toEqual([
    { id: 'warder', cell: { q: 1, r: -2 }, facing: 0 },
    { id: 'censer', cell: { q: -2, r: 1 }, facing: 4 },
    { id: 'harrier', cell: { q: 1, r: 1 }, facing: 2 },
  ]);
  expect(new Set(state.enemies.map(({ cell }) => `${cell.q},${cell.r}`)).size).toBe(state.enemies.length);
});
test('AC1: named factories differ only in the designated HP and consequent mark', () => {
  const healthy = createHealthyPatrol();
  for (const [factory, wounded] of [[createWoundedUgalluPatrol, 'ugallu'], [createWoundedGirtabliluPatrol, 'girtablilu']] as const) {
    const state = factory();
    expect(state.enemies).toEqual(healthy.enemies);
    expect(state.brood.filter(({ id }) => id !== wounded)).toEqual(healthy.brood.filter(({ id }) => id !== wounded));
    expect({ ...state, brood: healthy.brood, declaredIntentions: healthy.declaredIntentions }).toEqual(healthy);
  }
  expect(() => createPatrol('invalid' as PatrolPreset)).toThrow(RangeError);
  expect(Object.isFrozen(DEFAULT_PATROL_RULES)).toBe(true);
});
test.each<PatrolPreset>(['healthy', 'wounded-ugallu', 'wounded-girtablilu'])('AC2: %s announces all living enemies before input', (preset) => {
  const state = createPatrol(preset);
  const lowest = state.brood.reduce((a, b) => BigInt(b.hp) * BigInt(a.maxHp) < BigInt(a.hp) * BigInt(b.maxHp) ? b : a);
  expect(marks(state)).toEqual({ warder: 'ugallu', censer: 'girtablilu', harrier: lowest.id });
  expect(state.declaredIntentions.map(({ sourceId }) => sourceId)).toEqual(['warder', 'censer', 'harrier']);
  expect(state.intentions).toEqual(state.declaredIntentions.map(({ id }) => id));
});
test.each([1, 2, 3, 4, 5, 6])('AC2: Censer cycles living candidates in round %i despite shuffled arrays', (round) => {
  const base = fixture();
  const state = fixture({ round, brood: base.brood.slice().reverse(), enemies: base.enemies.slice().reverse() });
  expect(marks(state)).toEqual({ warder: 'ugallu', censer: ['girtablilu', 'pazuzu', 'ugallu'][(round - 1) % 3], harrier: 'ugallu' });
  expect(state.declaredIntentions.map(({ sourceId }) => sourceId)).toEqual(['warder', 'censer', 'harrier']);
});
test('AC2: fallen candidates are skipped, unequal HP ratios and exact ties use roster order', () => {
  const base = fixture();
  const state = fixture({ brood: base.brood.map((b) => ({ ...b,
    hp: b.id === 'ugallu' ? 0 : b.id === 'girtablilu' ? 5 : 3,
    maxHp: b.id === 'pazuzu' ? 6 : 10 })) });
  expect(marks(state)).toEqual({ warder: 'girtablilu', censer: 'girtablilu', harrier: 'girtablilu' });
  const unequal = announcePatrol({ ...state, brood: state.brood.map((b) => b.id === 'pazuzu' ? { ...b, hp: 2 } : b) });
  expect(marks(unequal).harrier).toBe('pazuzu');
  const skipped = fixture({ brood: base.brood.map((b) => ({ ...b, hp: b.id === 'girtablilu' ? 0 : 30 })) });
  expect(marks(skipped).censer).toBe('pazuzu');
});
test('AC2: ratio comparison remains exact for safe integers near the upper bound', () => {
  const base = fixture();
  const m = Number.MAX_SAFE_INTEGER;
  const state = fixture({ brood: base.brood.map((b, i) => ({ ...b, hp: m - 2 + i, maxHp: m - 1 + (i === 2 ? 1 : 0) })) });
  expect(marks(state).harrier).toBe('ugallu');
});
test.each(['compact', 'spread'] as const)('AC3/5: %s selects splash and isolation at impact with fixed marks and one revision', (shape) => {
  const state = fixture();
  const moved = shape === 'spread' ? accepted(applyCommand(state,
    { kind: 'maneuver', maneuver: 'expand', expectedRevision: 0 })).state : state;
  expect(moved.declaredIntentions).toEqual(state.declaredIntentions);
  const before = JSON.stringify(moved);
  const result = accepted(end(freeze(moved)));
  expect(JSON.stringify(moved)).toBe(before);
  expect(result.state.brood.map(({ hp }) => hp)).toEqual(shape === 'compact' ? [20, 27, 27] : [20, 27, 30]);
  const splash = result.events.filter((e) => e.type === 'damage-applied' && e.eventId.endsWith(':censer'));
  expect(splash.map((e) => e.type === 'damage-applied' ? e.targetId : '')).toEqual(shape === 'compact' ? ['girtablilu', 'pazuzu', 'ugallu'] : ['girtablilu']);
  expect(result.events.filter((e) => e.type === 'damage-applied' && e.eventId.endsWith(':harrier'))).toMatchObject([{ rawDamage: shape === 'compact' ? 4 : 7, targetId: 'ugallu' }]);
  expect(result.events.filter((e) => e.type === 'attack-settled').map((e) => e.type === 'attack-settled' ? e.sourceId : '')).toEqual(['warder', 'censer', 'harrier']);
  expect(result.events.filter((e) => e.type === 'attack-settled')).toMatchObject(PATROL_ORDER.map(() => ({ revision: moved.revision + 1 })));
  expect(result.state.revision).toBe(moved.revision + 1);
  expect(result.state).toMatchObject({ phase: 'player', round: 2, actedIds: [], rotationUsed: false, shapeChangeUsed: false });
  expect(marks(result.state)).toEqual({ warder: 'ugallu', censer: 'pazuzu', harrier: 'ugallu' });
  expect(end(moved)).toEqual(result);
});
test('AC3: a manoeuvre after all three activations keeps marks locked', () => {
  let state = fixture();
  const declared = state.declaredIntentions;
  for (const [actorId, abilityId] of [['pazuzu', 'gale'], ['ugallu', 'claw'], ['girtablilu', 'sting']] as const) {
    state = accepted(applyCommand(state, { kind: 'useAbility', expectedRevision: state.revision,
      actorId, abilityId, targetId: 'harrier' })).state;
    expect(state.declaredIntentions).toEqual(declared);
  }
  state = accepted(applyCommand(state, { kind: 'maneuver', expectedRevision: state.revision, maneuver: 'clockwise' })).state;
  expect(state.declaredIntentions).toEqual(declared);
  expect(accepted(end(state)).state.round).toBe(2);
});
test.each(['warder', 'censer', 'harrier'])('AC4: defeating %s cancels only its pending action', (targetId) => {
  const base = fixture();
  const state = fixture({ enemies: base.enemies.map((e) => e.id === targetId ? { ...e, hp: 1 } : e) });
  const slain = accepted(applyCommand(state, { kind: 'useAbility', expectedRevision: 0,
    actorId: 'pazuzu', abilityId: 'gale', targetId }));
  expect(slain.state.declaredIntentions.map(({ sourceId }) => sourceId)).toEqual(['warder', 'censer', 'harrier'].filter((id) => id !== targetId));
  expect(slain.events.filter((e) => e.type === 'intention-cancelled')).toMatchObject([{ reason: 'source-fallen' }]);
  if (targetId === 'warder') {
    expect(slain.state.protections).toEqual([]);
    expect(selectProtection(slain.state, { actorId: 'ugallu', targetId: 'censer', bypassProtection: false }, slain.state.protections).protected).toBe(false);
  }
  const phase = accepted(end(slain.state));
  expect(phase.events.filter((e) => e.type === 'attack-settled').map((e) => e.type === 'attack-settled' ? e.sourceId : '')).toEqual(['warder', 'censer', 'harrier'].filter((id) => id !== targetId));
  expect(phase.state.declaredIntentions.some((i) => i.sourceId === targetId)).toBe(false);
});
test('AC5: each hit settles death before the next enemy; a fallen mark fizzles without retargeting', () => {
  const base = fixture();
  const state = fixture({ brood: base.brood.map((b) => b.id === 'ugallu' ? { ...b, hp: 2 } : b) });
  const result = accepted(end(state));
  expect(result.state.brood.map(({ hp }) => hp)).toEqual([0, 27, 27]);
  expect(result.events.filter((e) => e.type === 'attack-settled').map((e) => e.type === 'attack-settled' ? e.sourceId : '')).toEqual(['warder', 'censer']);
  const fallenIndex = result.events.findIndex((e) => e.type === 'fallen' && e.entityId === 'ugallu');
  const splashIndex = result.events.findIndex((e) => e.type === 'attack-settled' && e.sourceId === 'censer');
  expect(fallenIndex).toBeLessThan(splashIndex);
  expect(result.events).toContainEqual({ type: 'intention-cancelled', intentionId: 'patrol:1:harrier', reason: 'target-fallen' });
  expect(marks(result.state).warder).toBe('girtablilu');
});
test('AC5: terminal defeat stops remaining resolution, does not reset budgets or announce', () => {
  const base = fixture();
  const state = fixture({ brood: base.brood.map((b) => ({ ...b, hp: b.id === 'ugallu' ? 1 : 0 })),
    actedIds: ['ugallu'], rotationUsed: true, shapeChangeUsed: true });
  const result = accepted(end(state));
  expect(result.state).toMatchObject({ phase: 'defeat', round: 1, revision: 1, actedIds: ['ugallu'], rotationUsed: true, shapeChangeUsed: true });
  expect(result.events.filter((e) => e.type === 'attack-settled')).toHaveLength(1);
  expect(result.events.filter((e) => e.type === 'combat-ended')).toEqual([{ type: 'combat-ended', outcome: 'defeat' }]);
  expect(result.events.some((e) => e.type === 'intentions-announced' || e.type === 'round-started')).toBe(false);
  rejected(end(result.state), result.state, 'wrong-phase');
});
test('AC5: victory on the last player hit rejects endPhase without any enemy action', () => {
  const base = fixture();
  const state = fixture({ enemies: base.enemies.map((e) => ({ ...e, hp: e.id === 'harrier' ? 1 : 0 })) });
  const result = accepted(applyCommand(state, { kind: 'useAbility', expectedRevision: 0,
    actorId: 'pazuzu', abilityId: 'gale', targetId: 'harrier' }));
  expect(result.state.phase).toBe('victory');
  rejected(end(result.state), result.state, 'wrong-phase');
});
test('AC5: unconsumed Shelter expires before announcement; Crosswind facing persists', () => {
  const base = fixture();
  const state = fixture({ patrolRules: { ...rules, warderDamage: 0, censerDamage: 0, harrierDamage: 0, isolatedHarrierDamage: 0 } });
  const sheltered = accepted(applyCommand(state, { kind: 'useAbility', actorId: 'ugallu', abilityId: 'shelter', targetId: 'girtablilu', expectedRevision: 0 })).state;
  const turned = accepted(applyCommand(sheltered, { kind: 'useAbility', actorId: 'pazuzu', abilityId: 'crosswind', direction: 'anticlockwise', targetId: 'warder', expectedRevision: 1 })).state;
  const result = accepted(end(turned));
  expect(result.state.enemies.find((e) => e.id === 'warder')!.facing).toBe(5);
  expect(base.enemies.find((e) => e.id === 'warder')!.facing).toBe(0);
  expect(result.state.shelters).toEqual([]);
  const expiry = result.events.findIndex((e) => e.type === 'shelter-removed' && e.reason === 'expired');
  expect(expiry).toBeGreaterThan(-1);
  expect(expiry).toBeLessThan(result.events.findIndex((e) => e.type === 'intentions-announced'));
  expect(result.state.revision).toBe(3);
  expect(createHealthyPatrol().enemies.find((e) => e.id === 'warder')!.facing).toBe(0);
});
test('AC5: P06 Shelter is consumed on the first qualifying round hit', () => {
  const state = fixture();
  const sheltered = accepted(applyCommand(state, { kind: 'useAbility', actorId: 'ugallu', abilityId: 'shelter', targetId: 'girtablilu', expectedRevision: 0 })).state;
  const result = accepted(end(sheltered));
  expect(result.state.brood.map(({ hp }) => hp)).toEqual([20, 29, 27]);
  expect(result.events.filter((e) => e.type === 'shelter-consumed')).toHaveLength(1);
  expect(result.state.shelters).toEqual([]);
});
test.each([{ actedIds: [] }, { actedIds: ['ugallu'] }, { actedIds: ['ugallu', 'girtablilu', 'pazuzu'] }])('AC6: unused actions are forfeited and never banked: %j', ({ actedIds }) => {
  const state = fixture({ actedIds, rotationUsed: actedIds.length > 0, shapeChangeUsed: actedIds.length > 0 });
  const result = accepted(end(state));
  expect(result.state).toMatchObject({ round: 2, actedIds: [], rotationUsed: false, shapeChangeUsed: false });
  const acted = accepted(applyCommand(result.state, { kind: 'useAbility', expectedRevision: result.state.revision,
    actorId: 'ugallu', abilityId: 'shelter', targetId: 'girtablilu' })).state;
  rejected(applyCommand(acted, { kind: 'useAbility', expectedRevision: acted.revision,
    actorId: 'ugallu', abilityId: 'shelter', targetId: 'girtablilu' }), acted, 'already-acted');
  const moved = accepted(applyCommand(acted, { kind: 'maneuver', maneuver: 'clockwise', expectedRevision: acted.revision })).state;
  rejected(applyCommand(moved, { kind: 'maneuver', maneuver: 'clockwise', expectedRevision: moved.revision }), moved, 'maneuver-used');
});
test('AC6: stale repeated endPhase rejects atomically; encounter attack identities stay unique across rounds', () => {
  const state = fixture();
  const first = accepted(end(state)).state;
  rejected(applyCommand(first, { kind: 'endPhase', expectedRevision: state.revision }), first, 'stale-revision');
  const second = accepted(end(first)).state;
  expect(second.resolvedAttackIds).toHaveLength(6);
  expect(new Set(second.resolvedAttackIds).size).toBe(6);
  expect(second.revision).toBe(2);
});
test.each([-1, 0.5, Number.NaN, Number.POSITIVE_INFINITY, Number.MAX_SAFE_INTEGER + 1])('atomic invalid tuning rejects %s', (amount) => {
  const state = fixture({ patrolRules: { ...rules, harrierDamage: amount } });
  rejected(end(state), state, 'invalid-amount');
});
test('a late P06 identity rejection rolls the whole enemy phase back', () => {
  const state = fixture({ resolvedAttackIds: ['patrol:1:harrier'] });
  const before = JSON.stringify(state);
  rejected(end(state), state, 'duplicate-attack');
  expect(JSON.stringify(state)).toBe(before);
});
test('AC3/5: Compact Harrier uses isolation after earlier attacks leave one survivor', () => {
  const base = fixture();
  const state = fixture({ brood: base.brood.map((b) => ({ ...b, hp: b.id === 'ugallu' ? 1 : b.id === 'girtablilu' ? 4 : 30 })) });
  // Override the announced Harrier mark with an explicit valid locked mark.
  const marked = freeze({ ...state, declaredIntentions: state.declaredIntentions.map((i) =>
    i.sourceId === 'harrier' && i.kind !== 'fixed-area' ? { ...i, targetId: 'pazuzu' } : i),
    patrolRules: { ...rules, censerDamage: 5 } });
  const result = accepted(end(marked));
  expect(result.state.brood.map(({ hp }) => hp)).toEqual([0, 0, 18]);
  expect(result.events.filter((e) => e.type === 'damage-applied' && e.eventId.endsWith(':harrier'))).toMatchObject([{ rawDamage: 7, targetId: 'pazuzu' }]);
});
test.each(['enemy', 'victory', 'defeat'] as const)('endPhase rejects %s atomically with revision precedence', (phase) => {
  const state = fixture({ phase });
  rejected(end(state), state, 'wrong-phase');
  rejected(applyCommand(state, { kind: 'endPhase', expectedRevision: -1 }), state, 'stale-revision');
});
test('explicit alternate round tuning reaches the P05/P06 boundary', () => {
  const state = fixture({ patrolRules: { ...rules, warderDamage: 1, censerDamage: 2,
    harrierDamage: 5, isolatedHarrierDamage: 9, splashRadius: 0 } });
  const result = accepted(end(state));
  expect(result.state.brood.map(({ hp }) => hp)).toEqual([24, 28, 30]);
});
test('unknown or duplicate declarations reject before spending', () => {
  const state = fixture();
  for (const declaredIntentions of [[...state.declaredIntentions, state.declaredIntentions[0]!],
    [{ id: 'unknown', sourceId: 'unknown', kind: 'marked-hit' as const, targetId: 'ugallu' }]]) {
    const invalid = freeze({ ...state, declaredIntentions });
    rejected(end(invalid), invalid, 'invalid-command');
  }
});
test('legacy lab snapshots keep unsupported endPhase', () => {
  const state = createInitialState();
  expect(applyCommand(state, { kind: 'endPhase', expectedRevision: 0 })).toEqual({ ok: false, state, events: [], error: { code: 'unsupported-command' } });
});

// Actual discovery-run traces: immutable, explicitly tuned inputs allow defaults to evolve.
function traceFixture(): PatrolState {
  const state = fixture();
  return freeze(announcePatrol({ ...state,
    brood: state.brood.map((b) => ({ ...b, hp: b.id === 'ugallu' ? 18 : 14, maxHp: b.id === 'ugallu' ? 18 : 14 })),
    enemies: state.enemies.map((e) => ({ ...e, hp: e.id === 'warder' ? 12 : e.id === 'censer' ? 10 : 13,
      maxHp: e.id === 'warder' ? 12 : e.id === 'censer' ? 10 : 13 })) }));
}
const winningTrace = [
  ['ugallu', 'claw', 'warder'], ['girtablilu', 'sting', 'warder'], ['pazuzu', 'gale', 'warder'], [],
  ['ugallu', 'claw', 'warder'], ['girtablilu', 'sting', 'censer'], ['pazuzu', 'gale', 'censer'], [],
  ['ugallu', 'claw', 'censer'], ['girtablilu', 'sting', 'harrier'], ['pazuzu', 'gale', 'harrier'], [],
  ['girtablilu', 'sting', 'harrier'], ['pazuzu', 'gale', 'harrier'],
] as const;
test.each(['win', 'defeat'] as const)('AC7: executed healthy %s trace reproduces final state and identical events', (outcome) => {
  const initial = traceFixture();
  const commands: Command[] = outcome === 'win' ? winningTrace.map((step, expectedRevision) => step.length === 0
    ? { kind: 'endPhase', expectedRevision }
    : { kind: 'useAbility', expectedRevision, actorId: step[0], abilityId: step[1], targetId: step[2] })
    : Array.from({ length: 4 }, (_, expectedRevision) => ({ kind: 'endPhase', expectedRevision }));
  const replay = (input: PatrolState) => {
    let state = input;
    const events = [];
    for (const command of commands) {
      const result = accepted(command.kind === 'useAbility' ? applyAbility(state, command, abilityRules) as CommandResult<PatrolState>
        : applyCommand(state, command));
      events.push(...result.events);
      state = result.state;
    }
    return { state, events };
  };
  const result = replay(initial);
  expect(replay(JSON.parse(JSON.stringify(initial)) as PatrolState)).toEqual(result);
  expect(result.state).toMatchObject({ phase: outcome === 'win' ? 'victory' : 'defeat', round: 4,
    revision: commands.length, actedIds: outcome === 'win' ? ['girtablilu', 'pazuzu'] : [] });
  expect(result.state.brood.map(({ hp }) => hp)).toEqual(outcome === 'win' ? [0, 8, 8] : [0, 0, 0]);
  expect(result.state.enemies.map(({ hp }) => hp)).toEqual(outcome === 'win' ? [0, 0, 0] : [12, 10, 13]);
  rejected(end(result.state), result.state, 'wrong-phase');
});
test.each<PatrolPreset>(['healthy', 'wounded-ugallu', 'wounded-girtablilu'])('ordinary %s patrol runs headlessly to a replayable terminal outcome', (preset) => {
  const initial = freeze(createPatrol(preset));
  function run(input: PatrolState) {
    let state = input;
    const results = [];
    while (state.phase === 'player' && state.round <= 30) {
      for (const [actorId, abilityId] of [['ugallu', 'claw'], ['girtablilu', 'sting'], ['pazuzu', 'gale']] as const) {
        if (state.phase !== 'player') break;
        if (!state.brood.some((b) => b.id === actorId && b.hp > 0)) continue;
        const targetId = ['warder', 'censer', 'harrier'].find((id) => state.enemies.some((e) => e.id === id && e.hp > 0))!;
        const result = accepted(applyCommand(state, { kind: 'useAbility', expectedRevision: state.revision, actorId, abilityId, targetId }));
        results.push(result);
        state = result.state;
      }
      if (state.phase === 'player') { const result = accepted(end(state)); results.push(result); state = result.state; }
    }
    expect(['victory', 'defeat']).toContain(state.phase);
    return results;
  }
  expect(run(JSON.parse(JSON.stringify(initial)) as PatrolState)).toEqual(run(initial));
});
