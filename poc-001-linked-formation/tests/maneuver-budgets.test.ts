import { afterAll, afterEach, expect, test } from 'vitest';
import { createPatrol } from '../src/content/patrol';
import type { PatrolState } from '../src/content/patrol';
import { applyAbility } from '../src/core/abilities';
import type { CommandResult, ErrorCode, Maneuver } from '../src/core/commands';
import { formationPositions, formations } from '../src/core/formation';
import { previewCommand } from '../src/core/preview';
import { appendAcceptedCommand, createRunRecord, parseRunRecord, replayRun } from '../src/core/run-record';
import { createInitialState } from '../src/core/state';
import type { GameState } from '../src/core/state';
import { applyCommand } from '../src/core/transition';

let assertions = 0;
afterEach(() => { assertions += expect.getState().assertionCalls; });
afterAll(() => { console.info(`P13 budget assertions executed: ${assertions}`); });
const rotation = (maneuver: Maneuver) => maneuver === 'clockwise' || maneuver === 'anticlockwise';
const maneuvers: Maneuver[] = ['clockwise', 'anticlockwise', 'expand', 'contract'];
function frozen<T>(value: T): T {
  if (value && typeof value === 'object') { Object.values(value).forEach(frozen); Object.freeze(value); }
  return value;
}
function accepted<S extends GameState>(result: CommandResult<S>) {
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(result.error.code);
  return result;
}
function rejected(result: CommandResult, state: GameState, code: ErrorCode) {
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error('Unexpected acceptance');
  expect(result.error.code).toBe(code);
  expect(result.state).toEqual(state);
  expect(result.events).toEqual([]);
}
const patrolRules = { warderDamage: 0, censerDamage: 0, harrierDamage: 0,
  isolatedHarrierDamage: 0, splashRadius: 1, closeThreshold: 2,
  damageRules: { directionalReduction: 0, shelterReduction: 0, closeThreshold: 2 } };
const abilityRules = { clawDamage: 1, stingDamage: 1, impaleDamage: 1, galeDamage: 1,
  damageRules: patrolRules.damageRules };
function patrol(): PatrolState {
  const state = createPatrol('healthy', patrolRules);
  return { ...state, enemies: state.enemies.map(enemy => ({ ...enemy, hp: 40, maxHp: 40 })) };
}

test.each(formations())('P13: both orders and rotation directions preserve labelled destinations in $shape $orientation', formation => {
  for (const direction of ['clockwise', 'anticlockwise'] as const) {
    const shapeChange = formation.shape === 'compact' ? 'expand' : 'contract';
    const orders: readonly (readonly Maneuver[])[] = [[direction, shapeChange], [shapeChange, direction]];
    for (const order of orders) {
      let state: GameState = frozen({ ...createInitialState(), formation, actedIds: ['ugallu', 'pazuzu'] });
      const initial = state;
      for (const maneuver of order) {
        const before = JSON.stringify(state);
        const command = { kind: 'maneuver' as const, maneuver, expectedRevision: state.revision };
        const projected = previewCommand(state, command, 0);
        const result = accepted(applyCommand(state, command));
        expect(projected.ok).toBe(true);
        if (!projected.ok) throw new Error('Preview rejected');
        expect(projected.state).toEqual(result.state);
        expect(projected.events).toEqual(result.events);
        expect(result.state.revision).toBe(state.revision + 1);
        expect(result.state.actedIds).toEqual(initial.actedIds);
        expect(result.events).toEqual([{ type: 'maneuver-applied', maneuver,
          formation: result.state.formation, revision: result.state.revision }]);
        expect(JSON.stringify(state)).toBe(before);
        state = frozen(result.state);
        expect(state.rotationUsed).toBe(order.slice(0, state.revision).some(rotation));
        expect(state.shapeChangeUsed).toBe(order.slice(0, state.revision).some(item => !rotation(item)));
        // A spent-category rejection leaves the other allowance alone.
        for (const next of maneuvers.filter(item => rotation(item) === rotation(maneuver))) {
          rejected(applyCommand(state, { kind: 'maneuver', maneuver: next, expectedRevision: state.revision }), state, 'maneuver-used');
        }
      }
      expect(formationPositions(state.formation)).toEqual(formationPositions({
        shape: formation.shape === 'compact' ? 'spread' : 'compact',
        orientation: ((formation.orientation + (direction === 'clockwise' ? 1 : 5)) % 6) as typeof formation.orientation,
      }));
    }
  }
});

test('P13: stale, phase, category and same-shape rejection precedence never spends either allowance', () => {
  for (const rotationUsed of [false, true]) for (const shapeChangeUsed of [false, true]) {
    const state = frozen({ ...createInitialState(), rotationUsed, shapeChangeUsed });
    for (const maneuver of maneuvers) {
      rejected(applyCommand(state, { kind: 'maneuver', maneuver, expectedRevision: state.revision + 1 }), state, 'stale-revision');
      for (const phase of ['enemy', 'victory', 'defeat'] as const) {
        const terminal = frozen({ ...state, phase });
        rejected(applyCommand(terminal, { kind: 'maneuver', maneuver, expectedRevision: terminal.revision + 1 }), terminal, 'stale-revision');
        rejected(applyCommand(terminal, { kind: 'maneuver', maneuver, expectedRevision: terminal.revision }), terminal, 'wrong-phase');
        expect(previewCommand(terminal, { kind: 'maneuver', maneuver, expectedRevision: terminal.revision }, 0).ok).toBe(false);
      }
    }
    rejected(applyCommand(state, { kind: 'maneuver', maneuver: 'contract', expectedRevision: state.revision }), state,
      shapeChangeUsed ? 'maneuver-used' : 'same-shape');
  }
});

test.each(['rotation-first', 'shape-first'] as const)('P13: abilities before, between and after %s preserve both budgets', order => {
  let state = frozen(patrol());
  const steps = order === 'rotation-first' ? ['clockwise', 'expand'] as const : ['expand', 'clockwise'] as const;
  const actions = [['ugallu', 'claw'], ['girtablilu', 'sting'], ['pazuzu', 'gale']] as const;
  for (const [index, [actorId, abilityId]] of actions.entries()) {
    const result = accepted(applyAbility(state, { actorId, abilityId, targetId: 'harrier', expectedRevision: state.revision }, abilityRules));
    expect(result.state.rotationUsed).toBe(state.rotationUsed);
    expect(result.state.shapeChangeUsed).toBe(state.shapeChangeUsed);
    expect(result.state.actedIds).toEqual([...state.actedIds, actorId]);
    expect(result.state.revision).toBe(state.revision + 1);
    state = frozen(result.state as PatrolState);
    if (index < steps.length) {
      const next = accepted(applyCommand(state, { kind: 'maneuver', maneuver: steps[index]!, expectedRevision: state.revision }));
      expect(next.state.actedIds).toEqual(state.actedIds);
      state = frozen(next.state);
    }
  }
  expect(state.phase).toBe('player');
});

test('P13: early End phase restores both live defaults once without banking; terminal endings keep flags', () => {
  const fresh = patrol();
  for (const rotationUsed of [false, true]) for (const shapeChangeUsed of [false, true]) {
    const state = frozen({ ...fresh, rotationUsed, shapeChangeUsed, actedIds: ['ugallu'] });
    const command = { kind: 'endPhase' as const, expectedRevision: state.revision };
    const next = accepted(applyCommand(state, command));
    expect(next.state.rotationUsed).toBe(fresh.rotationUsed);
    expect(next.state.shapeChangeUsed).toBe(fresh.shapeChangeUsed);
    expect(next.state.actedIds).toEqual(fresh.actedIds);
    expect(next.state.round).toBe(state.round + 1);
    expect(next.events.filter(event => event.type === 'round-started')).toEqual([{ type: 'round-started', round: next.state.round }]);
    rejected(applyCommand(next.state, command), next.state, 'stale-revision');
    for (const outcome of ['victory', 'defeat'] as const) {
      const terminalInput = frozen({ ...state,
        brood: outcome === 'defeat' ? state.brood.map(actor => ({ ...actor, hp: 0 })) : state.brood,
        enemies: outcome === 'victory' ? state.enemies.map(enemy => ({ ...enemy, hp: 0 })) : state.enemies });
      const ended = accepted(applyCommand(terminalInput, command));
      expect(ended.state.phase).toBe(outcome);
      expect(ended.state.rotationUsed).toBe(rotationUsed);
      expect(ended.state.shapeChangeUsed).toBe(shapeChangeUsed);
      expect(ended.events.some(event => event.type === 'round-started')).toBe(false);
      for (const maneuver of maneuvers) {
        rejected(applyCommand(ended.state, { kind: 'maneuver', maneuver, expectedRevision: ended.state.revision }), ended.state, 'wrong-phase');
      }
    }
  }
});

test('P13: both flags are serialized and validated; mixed-category records replay ordered events', () => {
  let record = createRunRecord(patrol(), 'healthy', 'unknown', abilityRules);
  for (const maneuver of ['expand', 'anticlockwise'] as const) {
    const command = { kind: 'maneuver' as const, maneuver, expectedRevision: record.finalState.revision };
    record = appendAcceptedCommand(record, command, applyCommand(record.finalState, command));
  }
  const replayed = replayRun(JSON.stringify(record));
  expect(replayed.state).toEqual(record.finalState);
  expect(replayed.events).toEqual(record.events);
  for (const key of ['rotationUsed', 'shapeChangeUsed'] as const) {
    for (const variant of ['missing', 'nonboolean'] as const) {
      const malformed = JSON.parse(JSON.stringify(record));
      if (variant === 'missing') delete malformed.initialState[key];
      else malformed.initialState[key] = 1;
      expect(() => parseRunRecord(JSON.stringify(malformed))).toThrow(/malformed initialState/);
    }
  }
  expect(Object.keys(record.finalState)).not.toContain('maneuver' + 'Used');
});
