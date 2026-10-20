import { expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import topology from '../content/combat-content.v1.json';
import { applyCommand, createFight, loadContent, parseRecord, recordOf, replayRecord } from '../src/core';
import type { BattleState, Content, IntentTarget } from '../src/core';

function content(): Content {
  const replace = (v: any): any => typeof v === 'number' ? 7 : Array.isArray(v) ? v.map(replace) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, replace(x)])) : v;
  const c = replace(topology) as Content;
  c.contentVersion = 'test-fix1'; c.fightSalveUses = 3;
  for (const b of c.brood) { b.maxHp = 60; b.revelationCap = 9; }
  for (const a of c.actions) {
    a.revelationCost = 1;
    if (a.effect.kind === 'envenom') Object.assign(a.effect, { amount: 3, poisonGain: 2, poisonCap: 5, weakenedReduction: 3 });
  }
  for (const f of c.forms) {
    f.durationRounds = 4;
    for (const m of f.modifiers) if (m.kind === 'poison-set') m.amount = 5;
  }
  for (const e of c.enemies) {
    for (const p of e.parts) { p.pool = 30; p.armor = 0; }
    for (const i of e.intents) {
      i.amount = 3; i.modifiers.forEach(m => m.amount = 1);
      if (i.schedule.kind === 'modulo') { i.schedule.divisor = 3; i.schedule.remainder = 0; }
      for (const r of i.riders) if (r.kind !== 'revelation') r.durationRounds = 2;
    }
  }
  return loadContent(c);
}
function snapshot(c: Content, s: BattleState) {
  return recordOf({ content: c, initialState: s, commands: [], finalState: s, buildRevision: 'unknown' });
}
it.each([
  ['guard', 'strike', { allBrood: true }], ['guard', 'strike', { enemy: 'celestial-guard#1' }],
  ['beast', 'trample', { brood: 'ugallu' }], ['beast', 'trample', { enemy: 'corrected-beast#1' }],
  ['scribe', 'inscribe', { brood: 'ugallu' }], ['scribe', 'inscribe', { allBrood: true }],
] as const)('rejects %s %s with a contradictory target category', (encounterId, kind, target) => {
  const c = content(); const s = createFight(c, { encounterId, party: ['ugallu', 'anzu'], start: 'fresh' });
  if (encounterId === 'beast') {
    const next = applyCommand(c, s, { kind: 'endPhase', expectedRevision: s.revision });
    Object.assign(s, next.state);
    Object.assign(s, applyCommand(c, s, { kind: 'endPhase', expectedRevision: s.revision }).state);
  }
  const r = snapshot(c, s);
  r.initialState.intents.find(i => i.kind === kind)!.target = target as IntentTarget;
  expect(() => parseRecord(r)).toThrow('intent target shape');
});
it('reproduces the reviewer area Strike after one real endPhase', () => {
  const c = content(); const s = createFight(c, { encounterId: 'guard', party: ['ugallu', 'anzu'], start: 'fresh' });
  s.intents[0]!.target = { allBrood: true };
  const command = { kind: 'endPhase' as const, expectedRevision: s.revision };
  const result = applyCommand(c, s, command);
  expect(result.ok).toBe(true);
  expect(result.events.filter(e => e.kind === 'brood-damaged')).toHaveLength(2);
  expect(() => recordOf({ content: c, initialState: s, commands: [{ command, revision: result.state.revision, events: result.events }], finalState: result.state, buildRevision: 'unknown' })).toThrow('intent target shape');
});
it('rejects poison above the embedded cap and permits a higher content-defined poison-set', () => {
  const c = content(); const s = createFight(c, { encounterId: 'guard', party: ['ugallu'], start: 'fresh' });
  const r = snapshot(c, s);
  r.initialState.enemies[0]!.poison = 6;
  expect(() => parseRecord(r)).toThrow('poison exceeds content cap');
  const set = c.forms.flatMap(f => f.modifiers).find(m => m.kind === 'poison-set')!;
  if (set.kind !== 'poison-set') throw new Error('setup');
  set.amount = 8; s.enemies[0]!.poison = 8;
  expect(replayRecord(snapshot(c, s))).toMatchObject({ ok: true, state: s });
});
it('accepts complete non-factory snapshots without recalculating frozen Brood targets', () => {
  const c = content(); const s = createFight(c, { encounterId: 'guard', party: ['ugallu', 'anzu'], start: 'fresh' });
  expect(s.intents[0]!.target).toEqual({ brood: 'ugallu' });
  s.party[0]!.hp = 1; // Highest current HP is now Anzu, but the declared target stays Ugallu.
  s.revision = 12;
  expect(replayRecord(parseRecord(JSON.stringify(snapshot(c, s))))).toMatchObject({ ok: true, state: s });
});
it.each([
  ['Salve uses', (s: BattleState) => { s.salveUses = 4; }, 'Salve uses exceed'],
  ['Weakened amount', (s: BattleState) => { s.enemies[0]!.weakened = { amount: 4, untilRound: s.round }; }, 'Weakened'],
  ['Weakened expiry', (s: BattleState) => { s.enemies[0]!.weakened = { amount: 3, untilRound: s.round + 1 }; }, 'Weakened'],
  ['Guard expiry', (s: BattleState) => { s.party[0]!.statuses.guard = { untilRound: s.round + 1 }; }, 'round-scoped'],
  ['Hold expiry', (s: BattleState) => { s.party[0]!.statuses.hold = { target: 'ugallu', untilRound: s.round + 1 }; }, 'round-scoped'],
  ['form expiry', (s: BattleState) => { s.party[0]!.revelation = 9; s.party[0]!.transformation = { id: 'ugallu-rapture', kind: 'rapture', untilRound: s.round + 4 }; }, 'transformation duration'],
  ['restraint expiry', (s: BattleState) => { s.party[0]!.statuses.pinned = { enemy: s.enemies[0]!.id, part: 'restraining-limb', untilRound: s.round + 2 }; }, 'restraint duration'],
  ['ledger damage', (s: BattleState) => { s.ledger[0]!.current.ugallu = 1; }, 'ledger exceeds removed pools'],
] as const)('rejects an impossible content-derived %s bound', (_name, mutate, reason) => {
  const c = content(); const s = createFight(c, { encounterId: 'guard', party: ['ugallu'], start: 'fresh' });
  const r = snapshot(c, s); mutate(r.initialState);
  expect(() => parseRecord(r)).toThrow(reason);
});
it('accepts the content-derived duration, status, Salve and ledger boundaries', () => {
  const c = content(); const s = createFight(c, { encounterId: 'guard', party: ['ugallu'], start: 'fresh' });
  s.party[0]!.revelation = 9;
  s.party[0]!.transformation = { id: 'ugallu-rapture', kind: 'rapture', untilRound: s.round + 3 };
  s.party[0]!.statuses.guard = { untilRound: s.round };
  s.party[0]!.statuses.hold = { target: 'ugallu', untilRound: s.round };
  s.party[0]!.statuses.pinned = { enemy: s.enemies[0]!.id, part: 'restraining-limb', untilRound: s.round + 1 };
  s.enemies[0]!.weakened = { amount: 3, untilRound: s.round };
  s.enemies[0]!.parts[0]!.pool -= 5;
  s.ledger[0]!.current.ugallu = 2; s.ledger[0]!.previous.ugallu = 3;
  expect(replayRecord(snapshot(c, s))).toMatchObject({ ok: true, state: s });
});
it('rejects every FIX1 hostile input with its specific reason', () => {
  const directory = new URL('../fixtures/hostile/fix1/', import.meta.url);
  for (const name of readdirSync(directory).filter(n => n.endsWith('.json'))) {
    const reason = name.includes('poison') ? 'poison exceeds content cap' : 'intent target shape';
    expect(() => parseRecord(readFileSync(new URL(name, directory), 'utf8'))).toThrow(reason);
  }
});
