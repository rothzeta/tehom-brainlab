import { afterAll, afterEach, expect, test } from 'vitest';
import type { ActorAction, Command, CommandResult, ErrorCode, Maneuver } from '../src/core/commands';
import type { Formation } from '../src/core/formation';
import { createInitialState } from '../src/core/state';
import type { GameState, Phase } from '../src/core/state';
import { applyActorAction, applyCommand } from '../src/core/transition';
import type { ActionRules } from '../src/core/transition';

function freeze<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}

function fixture(overrides: Partial<GameState> = {}): GameState {
  return freeze({ ...createInitialState(), ...overrides });
}

function accepted(result: CommandResult) {
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(`Unexpected rejection: ${result.error.code}`);
  return result;
}

function rejected(result: CommandResult, input: GameState, code: ErrorCode) {
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error('Unexpected acceptance');
  expect(result.error.code).toBe(code);
  expect(result.state).toEqual(input);
  expect(result.events).toEqual([]);
}

let assertions = 0;
afterEach(() => { assertions += expect.getState().assertionCalls; });
afterAll(() => { console.info(`P03 command assertions executed: ${assertions}`); });

test('AC1: initial legal rotation spends only the shared maneuver and one revision', () => {
  const state = fixture();
  const before = JSON.stringify(state);
  const command = freeze({ kind: 'maneuver', expectedRevision: 0, maneuver: 'clockwise' } as const);
  const result = accepted(applyCommand(state, command));
  expect(result.state).toEqual({
    ...state, formation: { shape: 'compact', orientation: 1 }, rotationUsed: true, shapeChangeUsed: false, revision: 1,
  });
  expect(result.state.actedIds).toEqual([]);
  expect(result.events).toEqual([{
    type: 'maneuver-applied', maneuver: 'clockwise',
    formation: result.state.formation, revision: 1,
  }]);
  expect(JSON.stringify(state)).toBe(before);
  expect(command).toEqual({ kind: 'maneuver', expectedRevision: 0, maneuver: 'clockwise' });
});

// Explicit P02 contract destinations, including wraparound and shape preservation.
test.each<[Formation, Maneuver, Formation]>([
  [{ shape: 'compact', orientation: 5 }, 'clockwise', { shape: 'compact', orientation: 0 }],
  [{ shape: 'spread', orientation: 5 }, 'clockwise', { shape: 'spread', orientation: 0 }],
  [{ shape: 'compact', orientation: 0 }, 'anticlockwise', { shape: 'compact', orientation: 5 }],
  [{ shape: 'spread', orientation: 0 }, 'anticlockwise', { shape: 'spread', orientation: 5 }],
  [{ shape: 'compact', orientation: 2 }, 'expand', { shape: 'spread', orientation: 2 }],
  [{ shape: 'spread', orientation: 4 }, 'contract', { shape: 'compact', orientation: 4 }],
])('C2/AC5: frozen %j accepts %s with destination %j', (formation, maneuver, destination) => {
  const state = fixture({ formation, actedIds: ['girtablilu'] });
  const before = JSON.stringify(state);
  const result = accepted(applyCommand(state, freeze({ kind: 'maneuver', expectedRevision: 0, maneuver })));
  expect(result.state).toEqual({ ...state, formation: destination,
    rotationUsed: maneuver === 'clockwise' || maneuver === 'anticlockwise',
    shapeChangeUsed: maneuver === 'expand' || maneuver === 'contract', revision: 1 });
  expect(result.events).toEqual([{
    type: 'maneuver-applied', maneuver, formation: destination, revision: 1,
  }]);
  expect(JSON.stringify(state)).toBe(before);
});

test('AC2: second maneuver and replay of the first command cannot spend resources', () => {
  const command: Command = freeze({ kind: 'maneuver', expectedRevision: 0, maneuver: 'clockwise' });
  const first = accepted(applyCommand(fixture(), command));
  const state = freeze(first.state);
  const before = JSON.stringify(state);
  for (const maneuver of ['clockwise', 'anticlockwise'] as const) {
    rejected(applyCommand(state, { kind: 'maneuver', expectedRevision: 1, maneuver }), state, 'maneuver-used');
  }
  const expanded = accepted(applyCommand(state, { kind: 'maneuver', expectedRevision: 1, maneuver: 'expand' }));
  expect(expanded.state.rotationUsed).toBe(state.rotationUsed);
  expect(expanded.state.shapeChangeUsed).toBe(true);
  for (const maneuver of ['contract', 'expand'] as const) {
    rejected(applyCommand(expanded.state, { kind: 'maneuver', expectedRevision: expanded.state.revision, maneuver }), expanded.state, 'maneuver-used');
  }
  rejected(applyCommand(state, command), state, 'stale-revision');
  expect(JSON.stringify(state)).toBe(before);
});

test.each<[Formation, Maneuver]>([
  [{ shape: 'compact', orientation: 0 }, 'contract'],
  [{ shape: 'spread', orientation: 3 }, 'expand'],
])('AC2: same-shape %s / %s leaves the allowance available', (formation, maneuver) => {
  const state = fixture({ formation });
  const before = JSON.stringify(state);
  const result = applyCommand(state, freeze({ kind: 'maneuver', expectedRevision: 0, maneuver }));
  rejected(result, state, 'same-shape');
  expect(JSON.stringify(state)).toBe(before);
  accepted(applyCommand(result.state, { kind: 'maneuver', expectedRevision: 0, maneuver: 'clockwise' }));
});

test.each<Phase>(['enemy', 'victory', 'defeat'])('AC2: %s phase rejects maneuver atomically', (phase) => {
  const state = fixture({ phase, actedIds: ['pazuzu'] });
  const before = JSON.stringify(state);
  rejected(applyCommand(state, { kind: 'maneuver', expectedRevision: 0, maneuver: 'expand' }), state, 'wrong-phase');
  expect(JSON.stringify(state)).toBe(before);
});

test('AC2: stale revision rejects a legal unused maneuver', () => {
  const state = fixture({ revision: 7 });
  rejected(applyCommand(state, { kind: 'maneuver', expectedRevision: 6, maneuver: 'expand' }), state, 'stale-revision');
});

test.each(['useAbility', 'endPhase'] as const)('AC4: %s stays explicitly unsupported in every phase', (kind) => {
  for (const phase of ['player', 'enemy', 'victory', 'defeat'] as const) {
    const state = fixture({ phase, rotationUsed: true, shapeChangeUsed: true, actedIds: ['ugallu'] });
    const before = JSON.stringify(state);
    const command: Command = kind === 'endPhase'
      ? { kind, expectedRevision: 99 }
      : { kind, expectedRevision: 99, actorId: 'ugallu', abilityId: 'missing', targetId: 'missing' };
    rejected(applyCommand(state, freeze(command)), state, 'unsupported-command');
    expect(JSON.stringify(state)).toBe(before);
  }
});

test.each([
  { kind: 'other', expectedRevision: 0 },
  { kind: 'maneuver', expectedRevision: 0, maneuver: 'translate' },
])('C1: unrecognized serialized kind/payload is rejected atomically: %j', (command) => {
  const state = fixture();
  rejected(applyCommand(state, freeze(command) as Command), state, 'invalid-command');
});

const action: ActorAction = freeze({
  expectedRevision: 0, actorId: 'ugallu', abilityId: 'test-effect', targetId: 'ugallu',
});
// Caller-supplied legal test effect, not a production ability or duplicated accounting rules.
const healAmount = 2;
const rules: ActionRules = {
  validate: (_state, actor, request) => {
    if (request.abilityId !== 'test-effect') return 'illegal-ability';
    if (request.targetId !== actor.id) return 'illegal-target';
    return undefined;
  },
  apply: (state, actor) => state.brood.map((entity) => entity.id === actor.id
    ? { ...entity, hp: entity.hp + healAmount } : entity),
};

function woundedFixture(overrides: Partial<GameState> = {}): GameState {
  const initial = createInitialState();
  return fixture({
    ...initial,
    brood: initial.brood.map((entity) => ({ ...entity, hp: 4, maxHp: 9 })),
    ...overrides,
  });
}

test('AC3/AC5: legal test effect runs once and accounts only its eligible living actor', () => {
  const state = woundedFixture({ actedIds: ['pazuzu'], rotationUsed: true, shapeChangeUsed: true });
  const before = JSON.stringify(state);
  const first = accepted(applyActorAction(state, action, rules));
  expect(first.state).toEqual({
    ...state, revision: 1, actedIds: ['pazuzu', 'ugallu'],
    brood: state.brood.map((entity) => entity.id === 'ugallu' ? { ...entity, hp: 6 } : entity),
  });
  expect(first.events).toEqual([{
    type: 'action-applied', actorId: 'ugallu', abilityId: 'test-effect', targetId: 'ugallu', revision: 1,
  }]);
  expect(JSON.stringify(state)).toBe(before);
  const next = freeze(first.state);
  rejected(applyActorAction(next, { ...action, expectedRevision: 1 }, rules), next, 'already-acted');
  const second = accepted(applyActorAction(next, {
    ...action, actorId: 'girtablilu', targetId: 'girtablilu', expectedRevision: 1,
  }, rules));
  expect(new Set(second.state.actedIds)).toEqual(new Set(['pazuzu', 'ugallu', 'girtablilu']));
  expect(second.state.revision).toBe(2);
  expect(second.state.rotationUsed).toBe(true);
  expect(second.state.shapeChangeUsed).toBe(true);
});

const guardedRules: ActionRules = {
  validate: () => { throw new Error('Rejected actor reached legality validation'); },
  apply: () => { throw new Error('Rejected actor reached the effect'); },
};

test.each<[string, Partial<GameState>, Partial<ActorAction>, ErrorCode]>([
  ['already acted', { actedIds: ['ugallu'] }, {}, 'already-acted'],
  ['unknown actor', { actedIds: ['pazuzu'] }, { actorId: 'absent' }, 'unknown-actor'],
  ['wrong phase', { phase: 'enemy', actedIds: ['pazuzu'] }, {}, 'wrong-phase'],
  ['victory', { phase: 'victory' }, {}, 'wrong-phase'],
  ['defeat', { phase: 'defeat' }, {}, 'wrong-phase'],
  ['stale revision', { revision: 1 }, {}, 'stale-revision'],
])('AC3: %s rejects before legality/effect and preserves every budget', (_label, overrides, request, code) => {
  const state = woundedFixture(overrides);
  const before = JSON.stringify(state);
  rejected(applyActorAction(state, freeze({ ...action, ...request }), guardedRules), state, code);
  expect(JSON.stringify(state)).toBe(before);
});

test.each(['fallen', 'foreign'] as const)('AC3: %s actor cannot consume another actor action', (condition) => {
  const initial = woundedFixture();
  const state = fixture({ ...initial, actedIds: ['pazuzu'], brood: initial.brood.map((entity) =>
    entity.id !== 'ugallu' ? entity : condition === 'fallen'
      ? { ...entity, hp: 0 } : { ...entity, owner: 'enemy' }) });
  const before = JSON.stringify(state);
  rejected(applyActorAction(state, action, guardedRules), state,
    condition === 'fallen' ? 'fallen-actor' : 'wrong-owner');
  expect(JSON.stringify(state)).toBe(before);
  const next = accepted(applyActorAction(state, {
    ...action, actorId: 'girtablilu', targetId: 'girtablilu',
  }, rules));
  expect(new Set(next.state.actedIds)).toEqual(new Set(['pazuzu', 'girtablilu']));
});

test.each<[Partial<ActorAction>, ErrorCode]>([
  [{ abilityId: 'missing' }, 'illegal-ability'],
  [{ targetId: 'absent' }, 'illegal-target'],
])('C3: failed ability/target legality %j rejects before the effect', (request, code) => {
  const state = woundedFixture({ actedIds: ['pazuzu'] });
  const before = JSON.stringify(state);
  rejected(applyActorAction(state, freeze({ ...action, ...request }), {
    ...rules, apply: () => { throw new Error('Illegal action reached the effect'); },
  }), state, code);
  expect(JSON.stringify(state)).toBe(before);
  const next = accepted(applyActorAction(state, action, rules));
  expect(new Set(next.state.actedIds)).toEqual(new Set(['pazuzu', 'ugallu']));
});

test.each(['before', 'between', 'after'] as const)('C3: maneuver remains available %s actor actions', (timing) => {
  let state = woundedFixture();
  const count = timing === 'before' ? 0 : timing === 'between' ? 1 : 3;
  for (const actor of state.brood.slice(0, count)) {
    state = freeze(accepted(applyActorAction(state, {
      ...action, actorId: actor.id, targetId: actor.id, expectedRevision: state.revision,
    }, rules)).state);
  }
  const maneuver = accepted(applyCommand(state, {
    kind: 'maneuver', expectedRevision: state.revision, maneuver: 'clockwise',
  }));
  expect(maneuver.state.actedIds).toEqual(state.actedIds);
  expect(maneuver.state.revision).toBe(state.revision + 1);
  expect(maneuver.state.rotationUsed).toBe(true);
  expect(maneuver.state.shapeChangeUsed).toBe(false);
  state = freeze(maneuver.state);
  for (const actor of state.brood.slice(count)) {
    const next = accepted(applyActorAction(state, {
      ...action, actorId: actor.id, targetId: actor.id, expectedRevision: state.revision,
    }, rules));
    expect(next.state.rotationUsed).toBe(true);
    expect(next.state.shapeChangeUsed).toBe(false);
    expect(next.state.actedIds).toContain(actor.id);
    state = freeze(next.state);
  }
  expect(new Set(state.actedIds)).toEqual(new Set(state.brood.map(({ id }) => id)));
  expect(state.revision).toBe(4);
});

test('AC5: fixture calls share no mutable nested collections or objects', () => {
  const first = createInitialState();
  const second = createInitialState();
  expect(first).toEqual(second);
  expect(first).toMatchObject({ revision: 0, round: 1, phase: 'player',
    formation: { shape: 'compact', orientation: 0 }, actedIds: [], rotationUsed: false, shapeChangeUsed: false, intentions: [] });
  expect(new Set(first.brood.map(({ id }) => id))).toEqual(new Set(['ugallu', 'girtablilu', 'pazuzu']));
  expect(first.brood.every(({ hp, maxHp, statuses, owner }) =>
    Number.isInteger(hp) && Number.isInteger(maxHp) && hp > 0 && hp <= maxHp
    && statuses.length === 0 && owner === 'player')).toBe(true);
  function objects(value: unknown): object[] {
    return value !== null && typeof value === 'object'
      ? [value, ...Object.values(value).flatMap(objects)] : [];
  }
  const firstObjects = new Set(objects(first));
  expect(objects(second).some((object) => firstObjects.has(object))).toBe(false);
  freeze(first);
  accepted(applyCommand(second, { kind: 'maneuver', expectedRevision: 0, maneuver: 'expand' }));
  expect(first).toEqual(second);
});

test.each<Maneuver>(['clockwise', 'anticlockwise', 'expand', 'contract'])('AC6: serialized %s replay yields identical state and ordered events', (maneuver) => {
  const state = fixture({ formation: { shape: maneuver === 'contract' ? 'spread' : 'compact', orientation: 3 } });
  const command: Command = freeze({ kind: 'maneuver', expectedRevision: 0, maneuver });
  const first = accepted(applyCommand(state, command));
  const restoredState: GameState = freeze(JSON.parse(JSON.stringify(state)));
  const restoredCommand: Command = freeze(JSON.parse(JSON.stringify(command)));
  const replay = accepted(applyCommand(restoredState, restoredCommand));
  expect(replay.state).toEqual(first.state);
  expect(replay.events).toEqual(first.events);
  expect(JSON.parse(JSON.stringify(first))).toEqual(first);
});
