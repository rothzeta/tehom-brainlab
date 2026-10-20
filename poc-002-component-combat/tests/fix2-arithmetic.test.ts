import { expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import v1 from '../content/combat-content.v1.json';
import { applyCommand, createFight, loadContent, parseRecord, recordOf, replayRecord } from '../src/core';
import type { BattleState, Command, Content } from '../src/core';

const L = 2147483647;
// Test-owned numbers; the shipped data supplies only the supported topology.
function content(): Content {
  const c = structuredClone(v1) as Content;
  c.contentVersion = 'test-fix2';
  for (const b of c.brood) { b.maxHp = 71; b.revelationCap = 13; }
  for (const a of c.actions) {
    a.revelationCost = 1;
    if (a.effect.kind === 'damage') Object.assign(a.effect, { amount: 6, componentAmount: 6, ignoreComponentArmor: false });
    if (a.effect.kind === 'envenom') Object.assign(a.effect, { amount: 5, poisonGain: 2, poisonCap: 4, weakenedReduction: 1 });
    if (a.effect.kind === 'hold') Object.assign(a.effect, { physicalReduction: 1, retaliation: 3 });
  }
  for (const f of c.forms) {
    f.durationRounds = 3;
    for (const m of f.modifiers) if (m.kind === 'poison-set') m.amount = 9;
  }
  for (const e of c.enemies) {
    for (const p of e.parts) { p.pool = 37; p.armor = 0; }
    for (const i of e.intents) {
      i.amount = 5; i.ward = 0; i.modifiers.forEach(m => m.amount = 1);
      if (i.schedule.kind === 'modulo') { i.schedule.divisor = 3; i.schedule.remainder = 0; }
      for (const r of i.riders) if (r.kind !== 'revelation') r.durationRounds = 3;
    }
  }
  return c;
}
function snapshot(c: Content, s: BattleState) {
  return recordOf({ content: c, initialState: s, commands: [], finalState: s, buildRevision: 'unknown' });
}
function recordable(c: Content, s: BattleState, command: Command) {
  const result = applyCommand(c, s, command);
  expect(result.ok).toBe(true);
  const record = recordOf({ content: c, initialState: s, commands: [{ command, revision: result.state.revision, events: result.events }], finalState: result.state, buildRevision: 'unknown' });
  expect(replayRecord(record)).toMatchObject({ ok: true, state: result.state });
  return result;
}

it.each(['claw', 'envenom', 'retaliation'] as const)('E54: %s with simultaneous maximum armor and Ward has safe intermediates and records', kind => {
  const c = content();
  c.enemies.find(e => e.id === 'celestial-guard')!.parts.find(p => p.id === 'weapon-arm')!.armor = L;
  c.enemies.find(e => e.id === 'naming-scribe')!.intents.find(i => i.kind === 'inscribe')!.ward = L;
  const loaded = loadContent(c);
  let s = createFight(loaded, { encounterId: 'guard-scribe', party: [kind === 'envenom' ? 'girtablilu' : 'ugallu'], start: 'fresh' });
  if (kind === 'retaliation') s = applyCommand(loaded, s, { kind: 'act', expectedRevision: s.revision, actor: 'ugallu', action: 'hold-the-threshold', target: { brood: 'ugallu' } }).state;
  const command: Command = kind === 'retaliation' ? { kind: 'endPhase', expectedRevision: s.revision }
    : { kind: 'act', expectedRevision: s.revision, actor: kind === 'envenom' ? 'girtablilu' : 'ugallu', action: kind, target: { enemy: s.enemies[0]!.id, part: 'weapon-arm' } };
  // A3-4 explicitly constrains intermediate operands, which final events alone
  // cannot expose in JavaScript. This hook observes values entering the floors
  // without changing arithmetic or requiring a particular number of floors.
  const floor = vi.spyOn(Math, 'max');
  let operands: number[][];
  let result: ReturnType<typeof applyCommand>;
  try {
    result = applyCommand(loaded, s, command);
    operands = floor.mock.calls.map(args => [...args]);
  } finally { floor.mockRestore(); }
  expect(result!.ok).toBe(true);
  const damage = result!.events.find(e => e.kind === 'part-damaged' && e.source.kind === (kind === 'retaliation' ? 'retaliation' : 'action'));
  expect(damage).toMatchObject({ damage: { armor: L, ward: L, applied: 0 }, remaining: 37 });
  expect(recordable(loaded, s, command)).toEqual(result!);
  expect(operands!.flat().length).toBeGreaterThan(0);
  for (const n of operands!.flat()) {
    expect(n).toBeGreaterThanOrEqual(-L);
    expect(n).toBeLessThanOrEqual(L);
  }
});

it.each(['ugallu', 'girtablilu', 'anzu'] as const)('B7: rejects a zero cap for %s', id => {
  const c = content(); c.brood.find(b => b.id === id)!.revelationCap = 0;
  expect(() => loadContent(c)).toThrow('B7');
});
it.each([-1, -L])('rejects negative Revelation cap %i structurally', cap => {
  const c = content(); c.brood[0]!.revelationCap = cap;
  expect(() => loadContent(c)).toThrow('expected nonnegative integer');
});
it.each([0, 8])('B7: rejects below-cap gap %i outside the smallest cap', gap => {
  const c = content(); c.brood[1]!.revelationCap = 7;
  c.starts.find(s => s.kind === 'below-cap')!.revelationGap = gap;
  expect(() => loadContent(c)).toThrow('B7');
});
it.each(['fresh', 'wounded', 'primed'] as const)('B7: checks every below-cap preset, including %s', id => {
  const c = content(); Object.assign(c.starts.find(s => s.id === id)!, { kind: 'below-cap', revelationGap: 0 });
  expect(() => loadContent(c)).toThrow('B7');
});
it.each([1, 7])('B7: accepts inclusive gap boundary %i and produces recordable primed state', gap => {
  const c = content(); c.brood[1]!.revelationCap = 7;
  c.starts.find(s => s.kind === 'below-cap')!.revelationGap = gap;
  const loaded = loadContent(c);
  const s = createFight(loaded, { encounterId: 'guard', party: ['ugallu', 'girtablilu', 'anzu'], start: 'primed' });
  expect(s.party.map(b => b.revelation)).toEqual([13 - gap, 7 - gap, 13 - gap]);
  expect(replayRecord(snapshot(loaded, s))).toMatchObject({ ok: true });
});
it('B7: accepts cap 1, gap 1; ignores gaps on other preset kinds; v1 still loads', () => {
  const c = content(); c.brood.forEach(b => b.revelationCap = 1);
  c.starts.forEach(s => s.revelationGap = s.kind === 'below-cap' ? 1 : L);
  expect(loadContent(c)).toEqual(c);
  expect(loadContent(v1)).toEqual(v1);
});

it.each([4, 5, 9])('A3-3: accepts poison %i up to Pmax 9 despite Envenom cap 4', poison => {
  const c = loadContent(content());
  const s = createFight(c, { encounterId: 'guard', party: ['girtablilu'], start: 'fresh' });
  s.enemies[0]!.poison = poison;
  expect(replayRecord(snapshot(c, s))).toMatchObject({ ok: true, state: s });
  recordable(c, s, { kind: 'act', actor: 'girtablilu', action: 'rupture-venom', target: { enemy: s.enemies[0]!.id }, expectedRevision: s.revision });
});
it('A3-3: a factory-origin transformation sets poison above Envenom cap and exports/replays', () => {
  const c = loadContent(content());
  const initial = createFight(c, { encounterId: 'guard', party: ['girtablilu'], start: 'primed' });
  let s = initial;
  const commands = [];
  for (const action of ['envenom', 'envenom', 'envenom', 'envenom'] as const) {
    const command: Command = { kind: 'act', actor: 'girtablilu', action, target: { enemy: s.enemies[0]!.id, part: 'weapon-arm' }, expectedRevision: s.revision };
    const r = recordable(c, s, command); commands.push({ command, revision: r.state.revision, events: r.events }); s = r.state;
    if (s.enemies[0]!.poison === 9) break;
    const end: Command = { kind: 'endPhase', expectedRevision: s.revision };
    const next = recordable(c, s, end); commands.push({ command: end, revision: next.state.revision, events: next.events }); s = next.state;
  }
  expect(s.enemies[0]!.poison).toBe(9);
  expect(replayRecord(recordOf({ content: c, initialState: initial, commands, finalState: s, buildRevision: 'unknown' }))).toMatchObject({ ok: true, state: s });
});

it.each([
  ['HP', (s: BattleState) => { s.party[0]!.hp = 72; }, 'invalid Brood pools'],
  ['Revelation', (s: BattleState) => { s.party[0]!.revelation = 14; }, 'invalid Brood pools'],
  ['pool', (s: BattleState) => { s.enemies[0]!.parts[0]!.pool = 38; }, 'invalid part pool'],
  ['Pmax', (s: BattleState) => { s.enemies[0]!.poison = 10; }, 'poison exceeds content cap'],
  ['ledger', (s: BattleState) => { s.ledger[0]!.current.ugallu = 1; }, 'ledger exceeds removed pools'],
] as const)('A3-3: rejects excess %s through parsing and replay', (_name, mutate, reason) => {
  const c = loadContent(content());
  const s = createFight(c, { encounterId: 'guard', party: ['ugallu'], start: 'fresh' });
  const r = snapshot(c, s); mutate(r.initialState);
  expect(() => parseRecord(r)).toThrow(reason);
  expect(() => replayRecord(r)).toThrow(reason);
});
it('A3-3: rejects the hostile combined-ledger fixture', () => {
  const json = readFileSync(new URL('../fixtures/hostile/fix2/ledger-over-lost-pool.json', import.meta.url), 'utf8');
  expect(() => parseRecord(json)).toThrow('ledger exceeds removed pools');
  expect(() => replayRecord(JSON.parse(json))).toThrow('ledger exceeds removed pools');
});
it('A3-3: accepts exact HP, pool, Pmax and combined ledger boundaries', () => {
  const c = loadContent(content());
  const s = createFight(c, { encounterId: 'guard', party: ['ugallu', 'girtablilu', 'anzu'], start: 'fresh' });
  s.enemies[0]!.poison = 9;
  s.enemies[0]!.parts[0]!.pool -= 6;
  s.ledger[0]!.current = { ugallu: 1, girtablilu: 1, anzu: 1 };
  s.ledger[0]!.previous = { ugallu: 1, girtablilu: 1, anzu: 1 };
  s.party[0]!.revelation = 13;
  s.party[0]!.transformation = { id: 'ugallu-rapture', kind: 'rapture', untilRound: s.round + 2 };
  expect(replayRecord(snapshot(c, s))).toMatchObject({ ok: true, state: s });
  const r = snapshot(c, s); r.initialState.ledger[0]!.previous.anzu++;
  expect(() => parseRecord(r)).toThrow('ledger exceeds removed pools');
});

it.each(['form', 'pinned', 'clamped'] as const)('A3-5: %s expiry uses the full portable range without headroom', kind => {
  const c = content();
  c.forms.forEach(f => f.durationRounds = 1);
  const strike = c.enemies.find(e => e.id === 'celestial-guard')!.intents.find(i => i.kind === 'strike')!;
  strike.riders = kind === 'form' ? [] : [{ kind, durationRounds: 1 }];
  const loaded = loadContent(c);
  const s = createFight(loaded, { encounterId: 'guard', party: ['ugallu'], start: 'fresh' });
  s.round = L;
  s.intents.forEach(i => i.id = `r${L}.${i.enemy}.${i.kind}`);
  let command: Command;
  if (kind === 'form') {
    s.party[0]!.revelation = 12;
    command = { kind: 'act', actor: 'ugallu', action: 'claw', target: { enemy: s.enemies[0]!.id, part: 'weapon-arm' }, expectedRevision: s.revision };
  } else {
    s.enemies[0]!.parts[0]!.pool = 1; s.enemies[0]!.poison = 1;
    command = { kind: 'endPhase', expectedRevision: s.revision };
  }
  const r = recordable(loaded, s, command);
  expect(r.events).toContainEqual(expect.objectContaining(kind === 'form'
    ? { kind: 'transformation-started', transformation: expect.objectContaining({ untilRound: L }) }
    : { kind: 'status-applied', status: kind, untilRound: L }));
});
