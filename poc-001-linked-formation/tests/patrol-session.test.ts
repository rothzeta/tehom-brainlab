import { afterEach, expect, test, vi } from 'vitest';
import { PatrolSession } from '../src/view/patrol-session';
import { createPatrol } from '../src/content/patrol';
import { applyCommand } from '../src/core/transition';

// Controller contracts tested at its public state/preview/reset boundary.
afterEach(() => vi.useRealTimers());
test('selection preview is isolated; confirmation submits once and serializes feedback', () => {
  vi.useFakeTimers(); const session = new PatrolSession();
  const before = structuredClone(session.state);
  const command = { kind: 'useAbility' as const, expectedRevision: before.revision,
    actorId: 'ugallu', abilityId: 'claw', targetId: 'warder' };
  session.preview(command); expect(session.state).toEqual(before);
  const pending = session.pending!; const expected = applyCommand(before, command);
  expect(expected.ok).toBe(true); session.confirm();
  expect(session.state).toEqual(expected.state);
  session.confirm(pending); expect(session.state).toEqual(expected.state);
  vi.runAllTimers(); session.confirm(pending);
  expect(session.state).toEqual(expected.state); expect(session.message).toContain('stale-revision');
});
test('reset cancels presentation and rejects an old-generation preview', () => {
  vi.useFakeTimers(); const changed = vi.fn(), session = new PatrolSession(changed);
  session.preview({ kind: 'endPhase', expectedRevision: 0 }); const pending = session.pending!;
  session.confirm(); expect(session.busy).toBe(true);
  session.reset('wounded-girtablilu'); const reset = structuredClone(session.state);
  expect(reset).toEqual(createPatrol('wounded-girtablilu')); expect(session.pending).toBeUndefined();
  expect(session.events).toEqual([]); expect(session.busy).toBe(false);
  changed.mockClear(); vi.runAllTimers(); expect(changed).not.toHaveBeenCalled(); expect(session.state).toEqual(reset);
  session.confirm(pending); expect(session.state).toEqual(reset); expect(session.message).toContain('stale-session');
});
test('terminal combat input is rejected without changing resources or HP', () => {
  vi.useFakeTimers(); const session = new PatrolSession();
  for (let round = 0; round < 50 && session.state.phase === 'player'; round++) {
    session.preview({ kind: 'endPhase', expectedRevision: session.state.revision }); session.confirm(); vi.runAllTimers();
  }
  expect(session.state.phase).toBe('defeat'); const terminal = structuredClone(session.state);
  session.preview({ kind: 'maneuver', maneuver: 'expand', expectedRevision: terminal.revision }); session.confirm();
  expect(session.state).toEqual(terminal); expect(session.message).toContain('wrong-phase');
  session.reset(); expect(session.state).toEqual(createPatrol());
});
