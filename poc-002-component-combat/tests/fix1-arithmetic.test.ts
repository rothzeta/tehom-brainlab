import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import v1 from '../content/combat-content.v1.json';
import { applyCommand, createFight, createGauntlet, legalActions, loadContent, parseRecord, previewCommand, recordOf, replayRecord } from '../src/core';
import type { BattleState, Command, Content, RecordedCommand } from '../src/core';
import { REJECTION_CODES } from '../src/core/types';

const L = 2147483647;
function content(): Content {
  return {
    schema: 'tehom-combat-content/1', contentVersion: 'test-fix1-arithmetic', fightSalveUses: 2,
    brood: [{ id: 'ugallu', name: 'Test Brood', maxHp: 100, revelationCap: 10,
      actions: ['claw', 'envenom', 'rupture-venom', 'guard', 'hold-the-threshold'], forms: ['ugallu-rapture', 'ugallu-rupture'] }],
    actions: [
      { id: 'claw', name: 'Hit', target: 'part', revelationCost: 2, effect: { kind: 'damage', damageType: 'physical', amount: 3, componentAmount: 4, ignoreComponentArmor: false } },
      { id: 'stolen-bolt', name: 'Bolt', target: 'part', revelationCost: 1, effect: { kind: 'damage', damageType: 'magical', amount: 4, componentAmount: 4, ignoreComponentArmor: false } },
      { id: 'envenom', name: 'Poison', target: 'part', revelationCost: 1, effect: { kind: 'envenom', amount: 1, poisonGain: 2, poisonCap: 5, weakenedReduction: 1 } },
      { id: 'rupture-venom', name: 'Venom', target: 'poisoned-enemy', revelationCost: 2, effect: { kind: 'rupture-venom', multiplier: 2 } },
      { id: 'guard', name: 'Guard', target: 'none', revelationCost: 0, effect: { kind: 'guard' } },
      { id: 'hold-the-threshold', name: 'Hold', target: 'brood', revelationCost: 0, effect: { kind: 'hold', physicalReduction: 0, retaliation: 2 } },
    ],
    forms: [
      { id: 'ugallu-rapture', brood: 'ugallu', kind: 'rapture', durationRounds: 2, modifiers: [
        { kind: 'attack-bonus', actions: ['claw'], amount: 1, ignoreArmor: false },
        { kind: 'bolt-amount', amount: 6 }, { kind: 'poison-set', amount: 5 }, { kind: 'venom-multiplier', amount: 3 },
      ] },
      { id: 'ugallu-rupture', brood: 'ugallu', kind: 'rupture', durationRounds: 2, modifiers: [{ kind: 'incoming-bonus', amount: 1 }] },
    ],
    enemies: [{ id: 'celestial-guard', name: 'Test enemy', parts: [
      { id: 'body', name: 'Body', kind: 'body', pool: 100, armor: 0, living: true, shieldedBy: null },
      { id: 'weapon-arm', name: 'Arm', kind: 'component', pool: 20, armor: 0, living: true, shieldedBy: null },
      { id: 'restraining-limb', name: 'Limb', kind: 'component', pool: 10, armor: 0, living: true, shieldedBy: null },
    ], intents: [{ kind: 'strike', sourcePart: 'weapon-arm', schedule: { kind: 'every-round' }, targeting: 'lowest-hp', damageType: 'physical', amount: 1, ward: 0,
      modifiers: [{ kind: 'part-intact-bonus', part: 'restraining-limb', amount: 1 }],
      riders: [{ kind: 'pinned', durationRounds: 2 }, { kind: 'clamped', durationRounds: 2 }, { kind: 'revelation', amount: 1 }],
    }] }],
    encounters: [{ id: 'guard', enemies: ['celestial-guard'] }],
    gauntlets: [{ id: 'gauntlet-v1', encounters: ['guard', 'guard'], start: 'fresh', salveUses: 2 }],
    starts: [{ id: 'fresh', kind: 'full', revelationGap: 0 }],
  };
}
const effect = (c: Content, id: string): any => c.actions.find(a => a.id === id)!.effect;
const modifier = (c: Content, kind: string): any => c.forms.flatMap(f => f.modifiers).find(m => m.kind === kind)!;
const intent = (c: Content) => c.enemies[0]!.intents[0]!;
const make = (c: Content) => createFight(c, { encounterId: 'guard', party: ['ugallu'], start: 'fresh' });
function atRound(s: BattleState, round: number): BattleState {
  s.round = round;
  for (const i of s.intents) i.id = `r${round}.${i.enemy}.${i.kind}`;
  return s;
}
const snapshot = (c: Content, s: BattleState) => recordOf({ content: c, initialState: s, commands: [], finalState: s, buildRevision: 'unknown' });
const hit = (s: BattleState, action: 'claw' | 'envenom' = 'claw'): Extract<Command, { kind: 'act' }> => ({ kind: 'act', expectedRevision: s.revision, actor: 'ugallu', action, target: { enemy: s.enemies[0]!.id, part: 'weapon-arm' } });
const end = (s: BattleState): Command => ({ kind: 'endPhase', expectedRevision: s.revision });

it('E52: rejects the reviewer multiplier content at load', () => {
  const bad = structuredClone(v1) as Content;
  effect(bad, 'rupture-venom').multiplier = L;
  expect(() => loadContent(bad)).toThrow('B2');
});
it('E52: rejects the reviewer multiplier content in records and replay', () => {
  const r = JSON.parse(readFileSync(new URL('../fixtures/hostile/fix1-arithmetic/multiplier-overflow.json', import.meta.url), 'utf8'));
  expect(() => parseRecord(r)).toThrow('B2');
  expect(() => replayRecord(r)).toThrow('B2');
});
it('E52: shipped v1 still loads', () => { expect(loadContent(v1)).toEqual(v1); });

it.each([
  ['B1', 'base damage', (c: Content) => { effect(c, 'claw').amount = L; }],
  ['B1', 'component damage', (c: Content) => { effect(c, 'claw').componentAmount = L; }],
  ['B1', 'Envenom bonus', (c: Content) => { modifier(c, 'attack-bonus').actions = ['envenom']; modifier(c, 'attack-bonus').amount = L; }],
  ['B1', 'bolt alternatives', (c: Content) => { modifier(c, 'bolt-amount').amount = L; modifier(c, 'attack-bonus').actions = ['stolen-bolt']; }],
  ['B1', 'bonuses across forms', (c: Content) => { modifier(c, 'attack-bonus').amount = L - 4; c.forms[1]!.modifiers.push({ kind: 'attack-bonus', actions: ['claw'], amount: 1, ignoreArmor: false }); }],
  ['B2', 'base multiplier', (c: Content) => { effect(c, 'rupture-venom').multiplier = L; }],
  ['B2', 'form multiplier', (c: Content) => { modifier(c, 'venom-multiplier').amount = L; }],
  ['B2', 'poison-set alternative', (c: Content) => { modifier(c, 'poison-set').amount = L; }],
  ['B2', 'poison gain', (c: Content) => { effect(c, 'envenom').poisonGain = L; }],
  ['B2', 'poison cap plus gain', (c: Content) => { effect(c, 'envenom').poisonCap = L; effect(c, 'rupture-venom').multiplier = 0; modifier(c, 'venom-multiplier').amount = 0; }],
  ['B3', 'intent base damage', (c: Content) => { intent(c).amount = L; }],
  ['B3', 'conditional modifier', (c: Content) => { intent(c).modifiers[0]!.amount = L; }],
  ['B3', 'incoming bonuses across forms', (c: Content) => { modifier(c, 'incoming-bonus').amount = L - 2; c.forms[0]!.modifiers.push({ kind: 'incoming-bonus', amount: 1 }); }],
  ['B4', 'Revelation cap', (c: Content) => { c.brood[0]!.revelationCap = L; }],
  ['B4', 'action cost', (c: Content) => { c.actions[0]!.revelationCost = L; }],
  ['B4', 'Revelation rider', (c: Content) => { intent(c).riders.push({ kind: 'revelation', amount: L }); }],
  ['B5', 'enemy pool total', (c: Content) => { c.enemies[0]!.parts[0]!.pool = L; }],
  ['B6', 'form duration', (c: Content) => { c.forms[0]!.durationRounds = 0; }],
  ['B6', 'Pinned duration', (c: Content) => { intent(c).riders[0] = { kind: 'pinned', durationRounds: 0 }; }],
  ['B6', 'Clamped duration', (c: Content) => { intent(c).riders[1] = { kind: 'clamped', durationRounds: 0 }; }],
] as const)('E52: rejects %s %s even when every leaf is in range', (bound, _name, mutate) => {
  const c = content(); mutate(c);
  expect(() => loadContent(c)).toThrow(bound);
});

it.each([
  ['B1', (c: Content) => { effect(c, 'claw').amount = L - 1; effect(c, 'claw').componentAmount = L - 1; }],
  ['B2 product', (c: Content) => { effect(c, 'envenom').poisonCap = 1; effect(c, 'envenom').poisonGain = 0; modifier(c, 'poison-set').amount = 1; effect(c, 'rupture-venom').multiplier = L; }],
  ['B2 sum', (c: Content) => { effect(c, 'envenom').poisonCap = L - 2; effect(c, 'rupture-venom').multiplier = 0; modifier(c, 'venom-multiplier').amount = 0; }],
  ['B3', (c: Content) => { intent(c).amount = L - 2; }],
  ['B4', (c: Content) => { c.brood[0]!.revelationCap = L - 2; }],
  ['B5', (c: Content) => { c.enemies[0]!.parts[0]!.pool = L - 30; }],
  ['B6 minimum', (c: Content) => { for (const f of c.forms) f.durationRounds = 1; for (const r of intent(c).riders) if (r.kind !== 'revelation') r.durationRounds = 1; }],
  ['B6 maximum', (c: Content) => { for (const f of c.forms) f.durationRounds = L; for (const r of intent(c).riders) if (r.kind !== 'revelation') r.durationRounds = L; }],
] as const)('E52: accepts the exact %s boundary', (_bound, mutate) => {
  const c = content(); mutate(c); expect(loadContent(c)).toEqual(c);
});

function rejected(c: Content, s: BattleState, command: Command): void {
  const before = structuredClone(s);
  const expected = { ok: false, state: before, events: [], error: { code: 'limit-reached' } };
  expect(applyCommand(c, s, command)).toEqual(expected);
  expect(previewCommand(c, s, command).result).toEqual(expected);
  expect(s).toEqual(before);
  expect(legalActions(c, s).map(a => a.command)).not.toContainEqual(command);
}
it('E53: appends limit-reached to the closed rejection codes', () => { expect(REJECTION_CODES.at(-1)).toBe('limit-reached'); });
it.each(['act', 'endPhase', 'continue'] as const)('E53: atomically rejects %s at the revision limit, including preview', kind => {
  const c = loadContent(content());
  const s = kind === 'continue' ? betweenFights(c) : make(c);
  s.revision = L;
  expect(replayRecord(snapshot(c, s))).toMatchObject({ ok: true }); // A3-3: no headroom invariant.
  const command = kind === 'act' ? hit(s) : { kind, expectedRevision: s.revision };
  rejected(c, s, command);
});
function betweenFights(c: Content): BattleState {
  const s = createGauntlet(c, { party: ['ugallu'] });
  s.enemies[0]!.parts[0]!.pool = 1;
  const r = applyCommand(c, s, { ...hit(s), target: { enemy: s.enemies[0]!.id, part: 'body' } });
  expect(r.state.phase).toBe('between-fights');
  return r.state;
}
it('E53: rejects next-round overflow while accepting the initial snapshot without headroom', () => {
  const c = loadContent(content()); const s = atRound(make(c), L);
  intent(c).riders = []; s.intents[0]!.riders = [];
  expect(replayRecord(snapshot(c, s))).toMatchObject({ ok: true });
  rejected(c, s, end(s));
});
it.each(['form', 'pinned', 'clamped'] as const)('E53: rejects a new %s expiry even if combat would end in the same command', kind => {
  const c = loadContent(content());
  if (kind !== 'form') intent(c).riders = [{ kind, durationRounds: 2 }];
  const s = atRound(make(c), L);
  if (kind === 'form') {
    s.party[0]!.revelation = s.party[0]!.revelationCap - 1;
    s.enemies[0]!.parts[0]!.pool = 1;
    rejected(c, s, { ...hit(s), target: { enemy: s.enemies[0]!.id, part: 'body' } });
  } else {
    s.enemies[0]!.poison = 5; s.enemies[0]!.parts[0]!.pool = 1;
    rejected(c, s, end(s)); // Poison would win after the status application.
  }
});
it('E53: forecast returns limit-reached while the selected command and export remain valid', () => {
  const c = loadContent(content()); const s = atRound(make(c), L);
  const command: Command = { kind: 'act', actor: 'ugallu', action: 'guard', target: null, expectedRevision: s.revision };
  const p = previewCommand(c, s, command);
  expect(p.result.ok).toBe(true);
  expect(p.forecast).toMatchObject({ ok: false, events: [], error: { code: 'limit-reached' }, state: p.state });
  expect(p.forecast!.state).toEqual(p.state);
  expect(replayRecord(recordOf({ content: c, initialState: s, commands: [{ command, revision: p.state.revision, events: p.events }], finalState: p.state, buildRevision: 'unknown' }))).toMatchObject({ ok: true });
});
it.each(['form', 'pinned', 'clamped'] as const)('E53: accepts a new %s expiry exactly at the limit', kind => {
  const c = loadContent(content());
  if (kind !== 'form') intent(c).riders = [{ kind, durationRounds: 2 }];
  const s = atRound(make(c), L - 1);
  if (kind === 'form') s.party[0]!.revelation = s.party[0]!.revelationCap - 1;
  const command = kind === 'form' ? hit(s) : end(s);
  const result = applyCommand(c, s, command);
  expect(result.ok).toBe(true);
  const expiry = kind === 'form' ? result.state.party[0]!.transformation!.untilRound : result.state.party[0]!.statuses[kind]!.untilRound;
  expect(expiry).toBe(L);
  expect(previewCommand(c, s, command).result).toEqual(result);
  expect(replayRecord(recordOf({ content: c, initialState: s, commands: [{ command, revision: result.state.revision, events: result.events }], finalState: result.state, buildRevision: 'unknown' }))).toMatchObject({ ok: true });
});
it('E53: earlier rejections retain precedence over limit-reached', () => {
  const c = loadContent(content()); const s = atRound(make(c), L); s.revision = L;
  const command = hit(s);
  expect(applyCommand(c, s, { ...command, unexpected: true })).toMatchObject({ ok: false, error: { code: 'invalid-command' } });
  expect(applyCommand(c, s, { ...command, expectedRevision: 0 })).toMatchObject({ ok: false, error: { code: 'stale-revision' } });
  expect(applyCommand(c, s, { ...command, actor: 'missing' })).toMatchObject({ ok: false, error: { code: 'unknown-actor' } });
  s.party[0]!.hp = 0;
  expect(applyCommand(c, s, command)).toMatchObject({ ok: false, error: { code: 'actor-dead' } });
  s.party[0]!.hp = s.party[0]!.maxHp;
  expect(applyCommand(c, s, { ...command, action: 'missing' })).toMatchObject({ ok: false, error: { code: 'unknown-action' } });
  expect(applyCommand(c, s, { ...command, action: 'stolen-bolt' })).toMatchObject({ ok: false, error: { code: 'action-unavailable' } });
  c.actions.push({ id: 'salve', name: 'Test heal', target: 'brood', revelationCost: 0, effect: { kind: 'heal', amount: 3 } });
  c.brood[0]!.actions.push('salve'); s.salveUses = 0;
  expect(applyCommand(c, s, { ...command, action: 'salve', target: null })).toMatchObject({ ok: false, error: { code: 'no-item-uses' } });
  expect(applyCommand(c, s, { ...command, target: null })).toMatchObject({ ok: false, error: { code: 'illegal-target' } });
  s.party[0]!.acted = true;
  expect(applyCommand(c, s, command)).toMatchObject({ ok: false, error: { code: 'already-acted' } });
  s.phase = 'defeat';
  expect(applyCommand(c, s, command)).toMatchObject({ ok: false, error: { code: 'wrong-phase' } });
});
it.each(['enemy phase', 'poison', 'action'] as const)('E53: accepts a battle-ending %s command at the round limit', how => {
  const c = loadContent(content()); intent(c).riders = [];
  const s = atRound(make(c), L); s.revision = L - 1;
  let command = end(s);
  if (how === 'enemy phase') s.party[0]!.hp = 1;
  else {
    s.enemies[0]!.parts[0]!.pool = 1;
    if (how === 'poison') s.enemies[0]!.poison = 5;
    else command = { ...hit(s), target: { enemy: s.enemies[0]!.id, part: 'body' } };
  }
  const result = applyCommand(c, s, command);
  expect(result.ok).toBe(true); expect(result.state.round).toBe(L); expect(result.state.revision).toBe(L);
  expect(result.state.phase).toBe(how === 'enemy phase' ? 'defeat' : 'victory');
  expect(previewCommand(c, s, command).result).toEqual(result);
  expect(replayRecord(recordOf({ content: c, initialState: s, commands: [{ command, revision: result.state.revision, events: result.events }], finalState: result.state, buildRevision: 'unknown' }))).toMatchObject({ ok: true });
});
it('E53: continue resets the round and accepts the final portable revision', () => {
  const c = loadContent(content()); const s = atRound(betweenFights(c), L); s.revision = L - 1;
  const command: Command = { kind: 'continue', expectedRevision: s.revision };
  const result = applyCommand(c, s, command);
  expect(result).toMatchObject({ ok: true, state: { round: 1, revision: L, fightIndex: 1 } });
  expect(previewCommand(c, s, command).result).toEqual(result);
  expect(replayRecord(recordOf({ content: c, initialState: s, commands: [{ command, revision: result.state.revision, events: result.events }], finalState: result.state, buildRevision: 'unknown' }))).toMatchObject({ ok: true });
});
it('E52/E53: every accepted command in a bounded near-limit exploration remains recordable', () => {
  const c = loadContent(content()); const initial = atRound(make(c), L - 2); initial.revision = L - 3;
  initial.party[0]!.revelation = initial.party[0]!.revelationCap - 1;
  initial.enemies[0]!.poison = 5;
  let frontier: { state: BattleState; commands: RecordedCommand[] }[] = [{ state: initial, commands: [] }];
  let accepted = 0;
  for (let depth = 0; depth < 4; depth++) {
    const next: typeof frontier = [];
    for (const { state, commands } of frontier) for (const { command } of legalActions(c, state)) {
      const result = applyCommand(c, state, command);
      expect(result.ok).toBe(true);
      const steps = [...commands, { command, revision: result.state.revision, events: result.events }];
      expect(replayRecord(recordOf({ content: c, initialState: initial, commands: steps, finalState: result.state, buildRevision: 'unknown' }))).toMatchObject({ ok: true, state: result.state });
      accepted++; next.push({ state: result.state, commands: steps });
    }
    frontier = next;
  }
  expect(accepted).toBeGreaterThan(0);
});
