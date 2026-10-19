import { expect, it } from 'vitest';
import topology from '../content/combat-content.v1.json';
import { applyCommand, createFight, createGauntlet, legalActions, loadContent, parseRecord, recordOf, replayRecord } from '../src/core';
import type { BattleState, CombatRecord, Content, RecordedCommand } from '../src/core';

/** Test-owned numbers throughout; the closed ID/behavior topology is shared. */
function content(): Content {
  const replace = (v: any): any => typeof v === 'number' ? 11 : Array.isArray(v) ? v.map(replace) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, replace(x)])) : v;
  const c = replace(topology) as Content; c.contentVersion = 'test-q03';
  for (const e of c.enemies) {
    for (const p of e.parts) { p.pool = 1; p.armor = 0; }
    for (const i of e.intents) {
      i.amount = 1; i.ward = 0; i.modifiers.forEach(m => m.amount = 0);
      if (i.schedule.kind === 'modulo') { i.schedule.divisor = 5; i.schedule.remainder = 0; }
    }
  }
  return loadContent(c);
}
function record(gauntlet = false): CombatRecord {
  const c = content();
  const initial = gauntlet ? createGauntlet(c, { party: ['ugallu', 'anzu'] }) : createFight(c, { encounterId: 'guard', party: ['ugallu'], start: 'fresh' });
  const command = { kind: 'act' as const, expectedRevision: initial.revision, actor: 'ugallu' as const, action: 'guard' as const, target: null };
  const result = applyCommand(c, initial, command);
  if (!result.ok) throw new Error('test setup');
  return recordOf({ content: c, initialState: initial, commands: [{ command, events: result.events, revision: result.state.revision }], finalState: result.state, buildRevision: 'unknown' });
}
it('replays whole gauntlets with monotonic revisions and complete carried state', () => {
  const c = content(); const initial = createGauntlet(c, { party: ['ugallu', 'anzu'] });
  let state: BattleState = initial; const commands: RecordedCommand[] = [];
  const continuations: BattleState[] = [];
  while (state.phase === 'player' || state.phase === 'between-fights') {
    if (state.phase === 'between-fights') {
      const unfinished = recordOf({ content: c, initialState: initial, commands, finalState: state, buildRevision: 'unknown' });
      expect(replayRecord(unfinished)).toMatchObject({ ok: true, state, outcome: 'between-fights' });
    }
    const command = state.phase === 'between-fights'
      ? { kind: 'continue' as const, expectedRevision: state.revision }
      : (legalActions(c, state).find(a => a.command.kind === 'act' && (a.command.action === 'claw' || a.command.action === 'stolen-bolt'))?.command ?? { kind: 'endPhase' as const, expectedRevision: state.revision });
    const result = applyCommand(c, state, command);
    expect(result.ok).toBe(true); expect(result.state.revision).toBe(state.revision + 1);
    if (command.kind === 'continue') {
      expect(result.state.party.map(({ id, hp, revelation }) => ({ id, hp, revelation }))).toEqual(state.carried);
      continuations.push(result.state);
    }
    commands.push({ command, revision: result.state.revision, events: result.events }); state = result.state;
  }
  expect(continuations).toHaveLength(c.gauntlets[0]!.encounters.length - 1);
  const r = recordOf({ content: c, initialState: initial, commands, finalState: state, buildRevision: 'unknown' });
  expect(replayRecord(parseRecord(JSON.stringify(r)))).toMatchObject({ ok: true, state, outcome: 'victory' });
  const missingCarry = structuredClone(r); missingCarry.finalState.carried = [];
  expect(() => parseRecord(missingCarry)).toThrow('carried state');
});
it('reports the first divergent command, compares events before revision, and never uses expected events as input', () => {
  const r = record(); const changed = structuredClone(r);
  changed.commands[0]!.events = [];
  changed.commands[0]!.revision++;
  expect(replayRecord(changed)).toMatchObject({ ok: false, commandIndex: 0, kind: 'events' });
  changed.commands[0]!.events = structuredClone(r.commands[0]!.events);
  expect(replayRecord(changed)).toMatchObject({ ok: false, commandIndex: 0, kind: 'revision' });
  changed.commands = structuredClone(r.commands); changed.finalState.salveUses--;
  expect(replayRecord(changed)).toMatchObject({ ok: false, commandIndex: r.commands.length, kind: 'final-state' });
  changed.commands[0]!.command.expectedRevision++;
  expect(replayRecord(changed)).toMatchObject({ ok: false, commandIndex: 0, kind: 'rejected-command', message: 'stale-revision' });
});
it('objects are key-order independent while arrays remain ordered (§12)', () => {
  const r = record(true);
  const reverseKeys = (v: any): any => Array.isArray(v) ? v.map(reverseKeys) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).reverse().map(([k, x]) => [k, reverseKeys(x)])) : v;
  expect(replayRecord(parseRecord(JSON.stringify(reverseKeys(r))))).toMatchObject({ ok: true, state: r.finalState });
  r.finalState.party.reverse(); expect(() => parseRecord(r)).toThrow('party order');
});
it.each([
  ['gauntlet descriptor', (r: CombatRecord) => { if (r.run.kind === 'gauntlet') r.run.encounters.reverse(); }, 'descriptor'],
  ['enemy identity', (r: CombatRecord) => { r.initialState.enemies[0]!.definitionId = 'naming-scribe'; }, 'enemy or parts'],
  ['part definition', (r: CombatRecord) => { r.initialState.enemies[0]!.parts[0]!.armor++; }, 'definition'],
  ['intent target', (r: CombatRecord) => { r.initialState.intents[0]!.target = { brood: 'girtablilu' }; }, 'intent target'],
  ['intent definition', (r: CombatRecord) => { r.initialState.intents[0]!.amount++; }, 'embedded definition'],
  ['duplicate intent', (r: CombatRecord) => { r.initialState.intents.push(structuredClone(r.initialState.intents[0]!)); }, 'duplicate intent'],
  ['Ward source', (r: CombatRecord) => { r.initialState.enemies[0]!.wards[0]!.sourcePart = 'body'; }, 'Ward source'],
  ['ledger reference', (r: CombatRecord) => { r.initialState.ledger = []; }, 'ledger'],
  ['carried pools', (r: CombatRecord) => { r.initialState.carried = r.initialState.party.map(b => ({ id: b.id, hp: b.maxHp + 1, revelation: b.revelation })); }, 'carried pools'],
  ['phase', (r: CombatRecord) => { r.initialState.phase = 'victory'; }, 'phase/outcome'],
] as const)('rejects impossible %s without replay', (_name, mutate, reason) => {
  const r = record(true); mutate(r); expect(() => parseRecord(r)).toThrow(reason);
});
it('supports complete non-factory snapshots and exports independent copies', () => {
  const r = record(); const snapshot = recordOf({ content: r.content, initialState: r.finalState, commands: [], finalState: r.finalState, buildRevision: 'unknown' });
  expect(replayRecord(snapshot)).toMatchObject({ ok: true, commands: 0, state: r.finalState });
  const before = r.finalState.party[0]!.hp;
  snapshot.finalState.party[0]!.hp--;
  expect(r.finalState.party[0]!.hp).toBe(before);
});
it('exports defeat mid-phase with a resolved Inscribe Ward still active (§3.5)', () => {
  const c = content(); c.brood.find(b => b.id === 'ugallu')!.maxHp = 1;
  const initial = createFight(c, { encounterId: 'scribe', party: ['ugallu'], start: 'fresh' });
  const command = { kind: 'endPhase' as const, expectedRevision: initial.revision };
  const result = applyCommand(c, initial, command);
  expect(result.ok).toBe(true); expect(result.state.phase).toBe('defeat');
  expect(result.state.intents.find(i => i.kind === 'inscribe')!.status).toBe('resolved');
  expect(result.state.enemies[0]!.wards.length).toBeGreaterThan(0);
  const r = recordOf({ content: c, initialState: initial, commands: [{ command, revision: result.state.revision, events: result.events }], finalState: result.state, buildRevision: 'unknown' });
  expect(replayRecord(r)).toMatchObject({ ok: true, state: result.state, outcome: 'defeat' });
});
