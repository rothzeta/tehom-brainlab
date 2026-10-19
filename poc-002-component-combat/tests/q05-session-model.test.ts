import { describe, expect, it } from 'vitest';
import topology from '../content/combat-content.v1.json';
import { applyCommand, createFight, createGauntlet, legalActions, loadContent, previewCommand, replayRecord } from '../src/core';
import type { BattleState, Command, Content, Event } from '../src/core/types';
import { createSession } from '../src/view/session';
import { battleModel } from '../src/view/battle/model';

// Closed topology only; replace every combat number with test-owned tuning.
function fixture(): Content {
  function numbers(v: unknown): unknown {
    if (typeof v === 'number') return 5;
    if (Array.isArray(v)) return v.map(numbers);
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, numbers(x)]));
    return v;
  }
  const c = numbers(topology) as Content;
  c.contentVersion = 'test-q05';
  for (const b of c.brood) { b.maxHp = 83; b.revelationCap = 23; }
  for (const e of c.enemies) for (const i of e.intents) if (i.schedule.kind === 'modulo') { i.schedule.divisor = 7; i.schedule.remainder = 1; }
  return loadContent(c);
}
function fight(c: Content): BattleState { return createFight(c, { encounterId: 'warden', party: ['ugallu', 'girtablilu', 'anzu'], start: 'fresh' }); }

describe('Q05 session public boundary (§§2, 11, 12)', () => {
  it('previews every legal command without mutation and commits identical events/state', () => {
    const c = fixture(), initial = fight(c);
    for (const { command } of legalActions(c, initial)) {
      const session = createSession(c, initial);
      const before = session.state;
      const preview = session.preview(command);
      expect(session.state).toEqual(before);
      expect(session.exportRecord().commands).toEqual([]);
      const result = session.commit(command);
      expect(result).toEqual(preview.result);
      expect(result.events).toEqual(preview.events);
      expect(session.state).toEqual(result.state);
      expect(session.state.revision).toBe(before.revision + 1);
    }
  });
  it('rejects duplicate, invalid target and terminal commands atomically and records only accepted commands', () => {
    const c = fixture(), initial = fight(c), session = createSession(c, initial);
    const command: Command = { kind: 'act', expectedRevision: initial.revision, actor: 'ugallu', action: 'claw', target: { brood: 'ugallu' } };
    expect(session.commit(command)).toMatchObject({ ok: false, error: { code: 'illegal-target' }, events: [], state: initial });
    const end: Command = { kind: 'endPhase', expectedRevision: initial.revision };
    expect(session.commit(end).ok).toBe(true);
    const state = session.state;
    expect(session.commit(end)).toMatchObject({ ok: false, error: { code: 'stale-revision' }, events: [], state });
    expect(session.state).toEqual(state);
    expect(session.exportRecord().commands).toHaveLength(1);
    const terminal = { ...initial, phase: 'defeat' as const };
    expect(createSession(c, terminal).commit(end)).toMatchObject({ ok: false, error: { code: 'wrong-phase' }, state: terminal });
  });
  it('subscribes immediately, publishes accepted events and disposes without publishing rejections', () => {
    const c = fixture(), session = createSession(c, fight(c));
    const seen: { state: BattleState; events: readonly Event[] }[] = [];
    const unsubscribe = session.subscribe((state, events) => seen.push({ state, events }));
    expect(seen).toEqual([{ state: session.state, events: [] }]);
    const result = session.commit({ kind: 'endPhase', expectedRevision: session.state.revision });
    expect(seen.at(-1)).toEqual({ state: result.state, events: result.events });
    session.commit({ kind: 'endPhase', expectedRevision: 0 });
    expect(seen).toHaveLength(2);
    unsubscribe(); session.commit({ kind: 'endPhase', expectedRevision: session.state.revision });
    expect(seen).toHaveLength(2);
  });
  it('isolates caller snapshots and records from accidental mutation', () => {
    const c = fixture(), initial = fight(c), session = createSession(c, initial);
    const saved = session.state;
    initial.party[0]!.hp = 0; c.brood[0]!.maxHp = 1;
    session.state.party[0]!.hp = 0; session.content.brood[0]!.maxHp = 1;
    session.subscribe((state, events) => { state.party[0]!.hp = 0; (events as Event[]).length = 0; });
    expect(session.state).toEqual(saved);
    const result = session.commit({ kind: 'endPhase', expectedRevision: session.state.revision });
    const expected = structuredClone(result.state);
    result.state.party[0]!.hp = 0;
    const record = session.exportRecord(); record.commands.length = 0; record.finalState.party[0]!.hp = 0;
    expect(session.state).toEqual(expected);
    expect(session.exportRecord().commands).toHaveLength(1);
    expect(replayRecord(session.exportRecord()).ok).toBe(true);
  });
  it('exports unfinished fights with embedded content and accepts an externally created gauntlet', () => {
    const c = fixture(), initial = fight(c), session = createSession(c, initial, 'unknown');
    const record = session.exportRecord();
    expect(record.content).toEqual(c); expect(record.initialState).toEqual(initial); expect(record.finalState).toEqual(initial);
    expect(replayRecord(record)).toMatchObject({ ok: true, outcome: 'player' });
    const run = createGauntlet(c, { party: ['ugallu', 'anzu'] });
    const gauntlet = createSession(c, run);
    const command: Command = { kind: 'endPhase', expectedRevision: run.revision };
    expect(gauntlet.commit(command)).toEqual(applyCommand(c, run, command));
    expect(gauntlet.state.run.kind).toBe('gauntlet');
  });
});

describe('Q05 display projection (§11)', () => {
  it('copies every state number and forecast damage component without implementing arithmetic', () => {
    const c = fixture(), state = fight(c);
    const events: Event[] = [{ kind: 'brood-damaged', brood: 'anzu', source: { kind: 'intent', intent: state.intents[0]!.id },
      damage: { damageType: 'physical', raw: 71, armor: 13, ward: 17, weakened: 19, rupture: 23, guard: 29, hold: 31, applied: 37 }, remaining: 41 }];
    const saved = structuredClone({ state, events });
    const model = battleModel(state, events);
    expect(model).toMatchObject({ round: state.round, phase: state.phase, revision: state.revision, salveUses: state.salveUses, brood: state.party, enemies: state.enemies });
    expect(model.intents[0]).toEqual({ ...state.intents[0], hits: [{ brood: 'anzu', ...(events[0] as Extract<Event, { kind: 'brood-damaged' }>).damage, remaining: 41 }], resolution: [] });
    expect({ state, events }).toEqual(saved);
    model.brood[0]!.hp = 0;
    expect(state).toEqual(saved.state);
  });
  it('preserves cancelled/revoked reasons, exact deltas/events and end-phase forecast', () => {
    const c = fixture(), state = fight(c);
    state.intents[0]!.status = 'revoked'; state.intents[0]!.cancellationReason = 'revoked';
    const command = legalActions(c, state).find(a => a.command.kind === 'act')!.command;
    const preview = previewCommand(c, state, command);
    const model = battleModel(state, preview.forecast?.events ?? [], preview);
    expect(model.intents[0]).toMatchObject({ status: 'revoked', cancellationReason: 'revoked' });
    expect(model.preview).toEqual({ ok: preview.result.ok, error: null, events: preview.events, deltas: preview.deltas, forecast: preview.forecast });
    const end = previewCommand(c, state, { kind: 'endPhase', expectedRevision: state.revision });
    expect(battleModel(state, end.events, end).preview?.forecast).toBeNull();
  });
  it('uses actual recipients and per-intent event boundaries, without guessing missing damage', () => {
    const c = fixture(), state = fight(c), id = state.intents[0]!.id;
    const events: Event[] = [{ kind: 'intent-redirected', intent: id, from: 'anzu', to: 'ugallu' }, { kind: 'intent-skipped', intent: state.intents[1]!.id, reason: 'target-dead' }];
    const model = battleModel(state, events);
    expect(model.intents[0]!.hits).toEqual([]);
    expect(model.intents[0]!.resolution).toEqual([events[0]]);
    expect(model.intents[1]!.resolution).toEqual([events[1]]);
  });
});
