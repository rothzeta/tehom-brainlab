import { expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { applyCommand, parseRecord, replayRecord } from '../src/core';

const directory = new URL('../fixtures/parity/', import.meta.url);
const names = readdirSync(directory).filter(name => name.endsWith('.json')).sort();
const read = (name: string) => parseRecord(readFileSync(new URL(name, directory), 'utf8'));
it.each(names)('replays all ordered events, revisions and final state: %s (§12)', name => {
  const record = read(name);
  let state = record.initialState;
  for (const step of record.commands) {
    const result = applyCommand(record.content, state, step.command);
    expect(result.ok).toBe(true);
    expect(result.events).toEqual(step.events);
    expect(result.state.revision).toBe(step.revision);
    state = result.state;
  }
  expect(state).toEqual(record.finalState);
  expect(replayRecord(record)).toMatchObject({ ok: true, state, commands: record.commands.length, outcome: state.phase });
});
it('the corpus pins embedded tuning, independently of the installed content', () => {
  const record = read('fight-guard-v1.json');
  const rend = record.content.actions.find(a => a.id === 'rend')!;
  if (rend.effect.kind !== 'damage') throw new Error('fixture setup');
  rend.effect.componentAmount++;
  expect(replayRecord(record)).toMatchObject({ ok: false, commandIndex: 0, kind: 'events' });
});
it('has a complete fight for every encounter and an own/imposed crossing for every form', () => {
  const exemplar = read('gauntlet-win-trio-v1.json');
  for (const encounter of exemplar.content.encounters) {
    const record = read(`fight-${encounter.id}-v1.json`);
    expect(record.run).toMatchObject({ kind: 'fight', encounterId: encounter.id });
    expect(record.finalState.phase).toBe('victory');
  }
  for (const form of exemplar.content.forms) {
    const record = read(`form-${form.id}-v1.json`);
    expect(record.commands.flatMap(s => s.events)).toContainEqual(expect.objectContaining({ kind: 'transformation-started', brood: form.brood, transformation: expect.objectContaining({ id: form.id, kind: form.kind }) }));
  }
});
it('covers a trio gauntlet win with every continue and a terminal gauntlet defeat (§10)', () => {
  const win = read('gauntlet-win-trio-v1.json');
  expect(win.run).toMatchObject({ kind: 'gauntlet', party: ['ugallu', 'girtablilu', 'anzu'] });
  expect(win.commands.filter(s => s.command.kind === 'continue')).toHaveLength(win.run.encounters.length - 1);
  expect(win.finalState.fightIndex).toBe(win.run.encounters.length - 1);
  expect(win.finalState.phase).toBe('victory');
  const loss = read('gauntlet-defeat-v1.json');
  expect(loss.run.kind).toBe('gauntlet');
  expect(loss.finalState.phase).toBe('defeat');
  expect(loss.finalState.party.every(b => b.hp === 0)).toBe(true);
});
it('the named edge witnesses actually exercise their stated mechanics', () => {
  const revoke = read('edge-revoke-inscribe-v1.json');
  const revoked = revoke.commands.find(s => s.command.kind === 'act' && s.command.action === 'revoke')!;
  expect(revoked.events).toContainEqual(expect.objectContaining({ kind: 'intent-cancelled', intent: expect.stringContaining('.inscribe'), reason: 'revoked' }));
  expect(revoked.events).toContainEqual(expect.objectContaining({ kind: 'status-removed', status: 'ward', reason: 'revoked' }));
  const hold = read('edge-hold-clamp-v1.json');
  const redirected = hold.commands.flatMap(s => s.events);
  expect(redirected).toContainEqual(expect.objectContaining({ kind: 'intent-redirected', intent: expect.stringContaining('.clamp'), from: 'anzu', to: 'ugallu' }));
  expect(redirected).toContainEqual(expect.objectContaining({ kind: 'status-applied', target: { brood: 'ugallu' }, status: 'clamped' }));
  const retaliation = read('edge-retaliation-kill-v1.json');
  const lethal = retaliation.commands.at(-1)!.events;
  expect(lethal).toContainEqual(expect.objectContaining({ kind: 'retaliated', damage: expect.objectContaining({ applied: expect.any(Number) }) }));
  expect(lethal).toContainEqual(expect.objectContaining({ kind: 'part-damaged', source: expect.objectContaining({ kind: 'retaliation' }), remaining: 0 }));
  expect(lethal).toContainEqual(expect.objectContaining({ kind: 'enemy-died' }));
  expect(retaliation.finalState.phase).toBe('victory');
  const victory = read('edge-victory-transformed-v1.json');
  expect(victory.commands.at(-1)!.events).toContainEqual(expect.objectContaining({ kind: 'transformation-ended', reason: 'victory' }));
  const poison = read('edge-poison-victory-v1.json');
  expect(poison.commands.at(-1)!.events).toContainEqual(expect.objectContaining({ kind: 'part-damaged', source: expect.objectContaining({ kind: 'poison' }), remaining: 0 }));
  expect(poison.finalState.phase).toBe('victory');
});
it.each(['player', 'between-fights'])('supports unfinished %s exports (§12 amendment)', phase => {
  const record = read(`unfinished-${phase}-v1.json`);
  expect(replayRecord(record)).toMatchObject({ ok: true, outcome: phase });
});
