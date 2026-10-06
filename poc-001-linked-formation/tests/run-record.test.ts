import { afterEach, expect, test, vi } from 'vitest';
import { createPatrol } from '../src/content/patrol';
import type { PatrolPreset, PatrolRules, PatrolState } from '../src/content/patrol';
import { applyAbility } from '../src/core/abilities';
import type { AbilityRules } from '../src/core/abilities';
import type { CommandResult } from '../src/core/commands';
import { announcePatrol } from '../src/core/rounds';
import { appendAcceptedCommand, createRunRecord, parseRunRecord, replayRun } from '../src/core/run-record';
import type { RecordedCommand } from '../src/core/run-record';
import { applyCommand } from '../src/core/transition';
import { fixedAreaFixture } from './browser/fixtures';
import { PatrolSession } from '../src/view/patrol-session';

const rules: PatrolRules = { warderDamage: 3, censerDamage: 3, harrierDamage: 4,
  isolatedHarrierDamage: 7, splashRadius: 2, closeThreshold: 2,
  damageRules: { directionalReduction: 2, shelterReduction: 2, closeThreshold: 2 } };
const abilityRules: AbilityRules = { clawDamage: 4, stingDamage: 4, impaleDamage: 6,
  galeDamage: 3, damageRules: rules.damageRules };
const winningTrace = [
  ['ugallu', 'claw', 'warder'], ['girtablilu', 'sting', 'warder'], ['pazuzu', 'gale', 'warder'], [],
  ['ugallu', 'claw', 'warder'], ['girtablilu', 'sting', 'censer'], ['pazuzu', 'gale', 'censer'], [],
  ['ugallu', 'claw', 'censer'], ['girtablilu', 'sting', 'harrier'], ['pazuzu', 'gale', 'harrier'], [],
  ['girtablilu', 'sting', 'harrier'], ['pazuzu', 'gale', 'harrier'],
] as const;
function fixture(): PatrolState {
  const base = createPatrol('healthy', rules);
  return announcePatrol({ ...base,
    brood: base.brood.map(b => ({ ...b, hp: b.id === 'ugallu' ? 18 : 14, maxHp: b.id === 'ugallu' ? 18 : 14 })),
    enemies: base.enemies.map(e => ({ ...e, hp: e.id === 'warder' ? 12 : e.id === 'censer' ? 10 : 13,
      maxHp: e.id === 'warder' ? 12 : e.id === 'censer' ? 10 : 13 })) });
}
function recordTrace(initial: PatrolState, commands: RecordedCommand[], preset: PatrolPreset = 'healthy', tuning = abilityRules) {
  let record = createRunRecord(initial, preset, 'unknown', tuning);
  let state = initial; const events = [];
  for (const command of commands) {
    const result = command.kind === 'useAbility'
      ? applyAbility(state, command, tuning) as CommandResult<PatrolState> : applyCommand(state, command);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error.code);
    record = appendAcceptedCommand(record, command, result);
    state = result.state; events.push(...result.events);
  }
  expect(replayRun(JSON.stringify(record))).toEqual({ state, events, commands: commands.length });
  return record;
}
afterEach(() => vi.useRealTimers());
test.each(['win', 'defeat'] as const)('P08 explicit %s trace exports and replays final state and exact event order', outcome => {
  const commands: RecordedCommand[] = outcome === 'win' ? winningTrace.map((step, expectedRevision) => step.length
    ? { kind: 'useAbility', expectedRevision, actorId: step[0], abilityId: step[1], targetId: step[2] }
    : { kind: 'endPhase', expectedRevision })
    : Array.from({ length: 4 }, (_, expectedRevision) => ({ kind: 'endPhase', expectedRevision }));
  const record = recordTrace(fixture(), commands);
  expect(record.finalState.phase).toBe(outcome === 'win' ? 'victory' : 'defeat');
});
test.each<PatrolPreset>(['healthy', 'wounded-ugallu', 'wounded-girtablilu'])('%s captures actual factory inputs without freezing tuning', preset => {
  const initial = createPatrol(preset);
  const record = recordTrace(initial, [{ kind: 'endPhase', expectedRevision: initial.revision }], preset);
  expect(record.initialState).toEqual(initial);
  expect(record.configuration.patrolRules).toEqual(initial.patrolRules);
});
test('stored alternate ability and patrol tuning controls replay, independent of current defaults', () => {
  const initial = createPatrol('healthy', { ...rules, warderDamage: 0, harrierDamage: 1 });
  const tuning = { ...abilityRules, clawDamage: 1, damageRules: { ...rules.damageRules, directionalReduction: 0 } };
  recordTrace(initial, [{ kind: 'useAbility', expectedRevision: 0, actorId: 'ugallu', abilityId: 'claw', targetId: 'warder' },
    { kind: 'endPhase', expectedRevision: 1 }], 'healthy', tuning);
});
test('session records only accepted confirmations; reset starts a clean attempt and stale input stays excluded', () => {
  vi.useFakeTimers(); const session = new PatrolSession();
  const command = { kind: 'maneuver' as const, maneuver: 'clockwise' as const, expectedRevision: 0 };
  const fresh = session.exportRecord(); session.preview(command);
  expect(session.exportRecord()).toBe(fresh); const cached = session.pending!;
  session.confirm(); const accepted = session.exportRecord(); session.confirm(cached);
  expect(session.exportRecord()).toBe(accepted); vi.runAllTimers(); session.confirm(cached);
  expect(parseRunRecord(accepted).acceptedCommands.map(e => e.command)).toEqual([command]);
  expect(replayRun(accepted).state).toEqual(session.state);
  const initial = parseRunRecord(fresh).initialState;
  expect(session.state.rotationUsed).toBe(true);
  expect(session.state.shapeChangeUsed).toBe(initial.shapeChangeUsed);
  const expand = { kind: 'maneuver' as const, maneuver: 'expand' as const, expectedRevision: session.state.revision };
  const expected = applyCommand(session.state, expand);
  expect(expected.ok).toBe(true);
  session.activate(expand);
  expect(session.state).toEqual(expected.state);
  const both = session.exportRecord();
  const record = parseRunRecord(both);
  expect(record.acceptedCommands.map(e => e.command)).toEqual([command, expand]);
  expect(record.finalState.rotationUsed).toBe(session.state.rotationUsed);
  expect(record.finalState.shapeChangeUsed).toBe(true);
  expect(replayRun(both).state).toEqual(session.state);
  expect(replayRun(both).events).toEqual(record.events);
  vi.runAllTimers();
  for (const maneuver of ['clockwise', 'anticlockwise', 'expand', 'contract'] as const) {
    const probe = { kind: 'maneuver' as const, maneuver, expectedRevision: session.state.revision };
    const rejected = applyCommand(session.state, probe);
    expect(rejected.ok).toBe(false);
    if (rejected.ok) throw new Error('Spent category accepted');
    expect(rejected.error.code).toBe('maneuver-used');
    session.activate(probe);
    expect(session.message).toBe('Unavailable: maneuver-used.');
    expect(session.exportRecord()).toBe(both);
    expect(session.state).toEqual(record.finalState);
    expect(session.events).toEqual(expected.events);
  }
  session.reset('wounded-ugallu'); session.confirm(cached); vi.runAllTimers();
  const reset = parseRunRecord(session.exportRecord());
  expect(reset.fixtureId).toBe('wounded-ugallu'); expect(reset.acceptedCommands).toEqual([]);
  expect(reset.events).toEqual([]); expect(reset.initialState).toEqual(session.state);
  expect(reset.finalState).toEqual(reset.initialState); expect(replayRun(session.exportRecord()).state).toEqual(session.state);
});
test('records are detached from mutable caller state and results', () => {
  const initial = fixture(); const record = createRunRecord(initial, 'healthy');
  (initial.brood[0]!.statuses as string[]).push('later');
  expect(record.initialState.brood[0]!.statuses).toEqual([]);
  const request = { kind: 'maneuver' as const, maneuver: 'expand' as const, expectedRevision: 0 };
  const result = applyCommand(record.initialState, request);
  const appended = appendAcceptedCommand(record, request, result);
  (result.events as unknown[]).length = 0;
  expect(appended.acceptedCommands[0]!.events.length).toBeGreaterThan(0);
  expect(record.acceptedCommands).toEqual([]); expect(appended.acceptedCommands).toHaveLength(1);
});
test.each([
  ['recordVersion', 99, 'unsupported record version: 99'],
  ['recordVersion', { toString: 'supplied data' }, 'unsupported record version: {"toString":"supplied data"}'],
  ['rulesVersion', 'future', 'unsupported rules version: future'],
  ['buildRevision', 'not-a-commit', 'malformed buildRevision'],
  ['initialState', null, 'malformed initialState'],
  ['configuration', {}, 'malformed configuration'],
  ['acceptedCommands', [{ command: { kind: 'eval', code: 'throw new Error()' }, revision: 1, events: [] }], 'acceptedCommands[0].command.kind'],
  ['acceptedCommands', [{ command: { kind: 'maneuver', maneuver: 'clockwise', expectedRevision: '0' }, revision: 1, events: [] }], 'expectedRevision'],
])('invalid %s fails specifically', (field, value, reason) => {
  const record = { ...createRunRecord(fixture(), 'healthy'), [field]: value };
  expect(() => replayRun(JSON.stringify(record))).toThrow(reason);
});
test('invalid JSON and malformed state/rules/command payloads fail safely before replay', () => {
  expect(() => replayRun('{')).toThrow('invalid JSON');
  for (const mutate of [
    (r: any) => { r.initialState.enemies = [null]; },
    (r: any) => { r.initialState.brood[0].hp = -1; },
    (r: any) => { r.configuration.abilityRules.damageRules = null; },
    (r: any) => { r.acceptedCommands = [{ command: { kind: 'endPhase', expectedRevision: 0, path: '/tmp/unsafe' }, revision: 1, events: [] }]; },
  ]) {
    const record = JSON.parse(JSON.stringify(createRunRecord(fixture(), 'healthy'))); mutate(record);
    expect(() => replayRun(JSON.stringify(record))).toThrow('Run record: malformed');
  }
});
test('rejected commands cannot be appended or replayed as successful inputs', () => {
  const record = createRunRecord(fixture(), 'healthy');
  const input = { kind: 'endPhase' as const, expectedRevision: 1 };
  expect(() => appendAcceptedCommand(record, input, applyCommand(record.initialState, input))).toThrow('cannot record rejected command: stale-revision');
  const forged = { ...record, acceptedCommands: [{ command: input, revision: 2, events: [] }] };
  expect(() => replayRun(JSON.stringify(forged))).toThrow('command 1 rejected: stale-revision');
});
test('first divergence reports identify revisions, step events, final state and event ordering', () => {
  const record = recordTrace(fixture(), [{ kind: 'endPhase', expectedRevision: 0 }]);
  for (const [mutate, message] of [
    [(r: any) => { r.acceptedCommands[0].revision++; }, 'command 1 revision divergence'],
    [(r: any) => { r.acceptedCommands[0].events.reverse(); }, 'command 1 event divergence'],
    [(r: any) => { r.finalState.round++; }, 'final state divergence'],
    [(r: any) => { r.events.reverse(); }, 'final event order divergence'],
  ] as const) {
    const altered = JSON.parse(JSON.stringify(record)); mutate(altered);
    expect(() => replayRun(JSON.stringify(altered))).toThrow(message);
  }
});

test('existing P10 fixed-area factory remains capturable and replayable for valid maneuvers', () => {
  recordTrace(fixedAreaFixture(), [{ kind: 'maneuver', expectedRevision: 0, maneuver: 'clockwise' }]);
});
