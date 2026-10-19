import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import topology from '../content/combat-content.v1.json';
import { applyCommand, createFight, createGauntlet, legalActions, loadContent, parseRecord, previewCommand, recordOf, replayRecord } from '../src/core';
import type { ActionId, BattleState, BroodId, Command, Content, EncounterId, Event, FormKind, IntentKind, PartId, Target } from '../src/core';

/** Keep closed behaviour topology, replace EVERY numeric leaf before configuring
 * test-owned tuning. No contract assertion depends on shipped v1 numbers. */
function fixture(): Content {
  function replace(v: any): any { return typeof v === 'number' ? 7 : Array.isArray(v) ? v.map(replace) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, replace(x)])) : v; }
  const c = replace(topology) as Content; c.contentVersion = 'test-q02'; c.fightSalveUses = 5;
  c.brood.forEach((b, i) => { b.maxHp = 99 - i * 14; b.revelationCap = 19; });
  for (const a of c.actions) {
    a.revelationCost = ['rend', 'rupture-venom', 'stolen-bolt'].includes(a.id) ? 3 : a.id === 'revoke' ? 5 : 0;
    if (a.effect.kind === 'damage') Object.assign(a.effect, { amount: 9, componentAmount: 13 });
    if (a.id === 'rend') Object.assign(a.effect, { amount: 5, componentAmount: 19 });
    if (a.effect.kind === 'hold') Object.assign(a.effect, { physicalReduction: 4, retaliation: 11 });
    if (a.effect.kind === 'envenom') Object.assign(a.effect, { amount: 4, poisonGain: 5, poisonCap: 13, weakenedReduction: 5 });
    if (a.effect.kind === 'heal') a.effect.amount = 17;
    if (a.effect.kind === 'rupture-venom') a.effect.multiplier = 4;
  }
  for (const f of c.forms) {
    f.durationRounds = 3;
    for (const m of f.modifiers) if ('amount' in m) m.amount = m.kind === 'poison-set' ? 13 : m.kind === 'bolt-amount' ? 21 : m.kind === 'venom-multiplier' ? 5 : m.kind === 'round-hp-loss' ? 4 : 3;
  }
  for (const e of c.enemies) {
    for (const p of e.parts) Object.assign(p, { pool: p.kind === 'body' ? 121 : 31, armor: 6 });
    for (const i of e.intents) {
      i.amount = i.kind === 'inscribe' ? 0 : 11; i.ward = i.kind === 'inscribe' ? 4 : 0;
      if (i.schedule.kind === 'modulo') { i.schedule.divisor = 4; i.schedule.remainder = i.kind === 'clamp' ? 1 : i.kind === 'saw' ? 2 : 0; }
      i.riders.forEach(r => { if (r.kind === 'revelation') r.amount = 5; else r.durationRounds = 3; });
      i.modifiers.forEach(m => m.amount = 9);
    }
  }
  c.starts.find(s => s.id === 'primed')!.revelationGap = 3;
  c.gauntlets[0]!.salveUses = 5;
  return loadContent(c);
}
const fight = (c: Content, encounterId: EncounterId = 'guard', party: BroodId[] = ['ugallu', 'girtablilu', 'anzu']) => createFight(c, { encounterId, party, start: 'fresh' });
const brood = (s: BattleState, id: BroodId = 'ugallu') => s.party.find(b => b.id === id)!;
const part = (s: BattleState, id: PartId, enemyIndex = 0) => s.enemies[enemyIndex]!.parts.find(p => p.id === id)!;
const tpart = (s: BattleState, id: PartId, enemyIndex = 0): Target => ({ enemy: s.enemies[enemyIndex]!.id, part: id });
const cmd = (s: BattleState, actor: BroodId, action: ActionId, target: Target): Command => ({ kind: 'act', expectedRevision: s.revision, actor, action, target });
function act(c: Content, s: BattleState, actor: BroodId, action: ActionId, target: Target) { const r = applyCommand(c, s, cmd(s, actor, action, target)); expect(r.ok).toBe(true); return r; }
function end(c: Content, s: BattleState) { const r = applyCommand(c, s, { kind: 'endPhase', expectedRevision: s.revision }); expect(r.ok).toBe(true); return r; }
function reject(c: Content, s: BattleState, command: unknown, code: string) {
  const saved = structuredClone(s); const r = applyCommand(c, s, command);
  expect(r).toEqual({ ok: false, state: saved, events: [], error: { code } }); expect(s).toEqual(saved);
}
function form(c: Content, s: BattleState, id: BroodId, kind: FormKind, untilRound = s.round + 2) {
  const b = brood(s, id); b.revelation = b.revelationCap;
  b.transformation = { id: `${id}-${kind}`, kind, untilRound };
}
function only(s: BattleState, kind: IntentKind) { const i = s.intents.find(i => i.kind === kind)!; expect(i).toBeDefined(); s.intents = [i]; return i; }
function harmless(s: BattleState) { s.intents = []; }
const damages = (events: Event[]) => events.filter((e): e is Extract<Event, { kind: 'brood-damaged' }> => e.kind === 'brood-damaged');

describe('Q02 commands and controlled content contracts (§§1–3)', () => {
  it('rejects in all ten precedence positions, including wrong target forms (A2-3)', () => {
    const c = fixture(); const s = fight(c); const valid = cmd(s, 'ugallu', 'claw', tpart(s, 'body'));
    reject(c, s, { ...valid, expectedRevision: -1 }, 'invalid-command');
    reject(c, s, { ...valid, expectedRevision: 1, actor: 'missing' }, 'stale-revision');
    s.phase = 'victory'; reject(c, s, valid, 'wrong-phase'); s.phase = 'player';
    reject(c, s, { ...valid, actor: 'missing' }, 'unknown-actor');
    brood(s).hp = 0; reject(c, s, { ...valid, action: 'unknown' }, 'actor-dead'); brood(s).hp = 99;
    brood(s).acted = true; reject(c, s, { ...valid, action: 'unknown' }, 'already-acted'); brood(s).acted = false;
    reject(c, s, { ...valid, action: 'unknown' }, 'unknown-action');
    reject(c, s, { ...valid, action: 'talon' }, 'action-unavailable');
    s.salveUses = 0; reject(c, s, cmd(s, 'ugallu', 'salve', null), 'no-item-uses');
    reject(c, s, { ...valid, target: { brood: 'unknown' } }, 'illegal-target');
  });
  it.each([null, {}, { kind: 'surprise' }, { kind: 'endPhase', expectedRevision: '0' }, { kind: 'act', expectedRevision: 0, actor: 'ugallu', action: 'claw', target: 9 }])('malformed input is atomic: %j', command => {
    const c = fixture(); reject(c, fight(c), command, 'invalid-command');
  });
  it('E37 duplicate commands are stale and accepted commands advance one revision', () => {
    const c = fixture(); const s = fight(c); const command = cmd(s, 'ugallu', 'guard', null); const before = structuredClone(s);
    const r = applyCommand(c, s, command); expect(r.state.revision).toBe(s.revision + 1); expect(s).toEqual(before);
    reject(c, r.state, command, 'stale-revision');
  });
  it('E36 endPhase forfeits unused actions and declares the next round in order', () => {
    const c = fixture(); const s = fight(c, 'guard-scribe'); const r = end(c, s);
    expect(r.state.round).toBe(s.round + 1); expect(r.state.party.every(b => !b.acted)).toBe(true);
    expect(r.state.intents.map(i => i.kind)).toEqual(['strike', 'inscribe', 'utter']);
    expect(r.events.findIndex(e => e.kind === 'round-started')).toBeGreaterThan(r.events.findIndex(e => e.kind === 'intent-resolved'));
  });
  it('E38 commands after a battle ends use wrong-phase', () => { const c = fixture(); const s = fight(c); s.phase = 'defeat'; reject(c, s, cmd(s, 'ugallu', 'guard', null), 'wrong-phase'); });
  it('E44 wounded HP rounds up and parties normalize to roster order', () => {
    const c = fixture(); const s = createFight(c, { encounterId: 'guard', party: ['anzu', 'ugallu'], start: 'wounded' });
    expect(s.party.map(b => b.id)).toEqual(['ugallu', 'anzu']); s.party.forEach(b => expect(b.hp).toBe(Math.ceil(b.maxHp / 2)));
    expect(() => fight(c, 'guard', ['ugallu', 'ugallu'])).toThrow('party');
  });
  it('all start presets and all encounter definitions use content without party scaling', () => {
    const c = fixture();
    for (const e of c.encounters) for (const start of c.starts) {
      const s = createFight(c, { encounterId: e.id, party: ['anzu'], start: start.id });
      expect(s.enemies.map(x => x.definitionId)).toEqual(e.enemies);
      expect(s.enemies).toEqual(createFight(c, { encounterId: e.id, party: ['ugallu', 'girtablilu', 'anzu'], start: start.id }).enemies);
      expect(s.party[0]!.revelation).toBe(start.kind === 'below-cap' ? s.party[0]!.revelationCap - start.revelationGap : 0);
    }
  });
});

describe('Q02 components, statuses and actions (§§4–6)', () => {
  it('E03 overkill does not overflow and the ledger counts only actual pools removed', () => {
    const c = fixture(); const s = fight(c); part(s, 'weapon-arm').pool = 1;
    const r = act(c, s, 'ugallu', 'rend', tpart(s, 'weapon-arm'));
    expect(part(r.state, 'body').pool).toBe(part(s, 'body').pool); expect(r.state.ledger[0]!.current.ugallu).toBe(1);
  });
  it('E04 component destruction cancels exactly its unresolved intents', () => {
    const c = fixture(); c.enemies[0]!.intents[1]!.schedule = { kind: 'every-round' }; const s = fight(c); part(s, 'weapon-arm').pool = 1;
    const r = act(c, s, 'ugallu', 'rend', tpart(s, 'weapon-arm'));
    expect(r.state.intents.map(i => [i.kind, i.status])).toEqual([['strike', 'cancelled'], ['pin', 'pending']]);
    expect(end(c, r.state).events).toContainEqual({ kind: 'intent-skipped', intent: r.state.intents[0]!.id, reason: 'cancelled' });
  });
  it('E12 zero damage Envenom still poisons and Weakens a living part', () => {
    const c = fixture(); const s = fight(c); const r = act(c, s, 'girtablilu', 'envenom', tpart(s, 'body'));
    expect(part(r.state, 'body').pool).toBe(part(s, 'body').pool); expect(r.state.enemies[0]!.poison).toBe(5); expect(r.state.enemies[0]!.weakened?.amount).toBe(5);
  });
  it('E13 Envenom destruction of a living component still applies statuses', () => {
    const c = fixture(); const s = fight(c); part(s, 'weapon-arm').armor = 0; part(s, 'weapon-arm').pool = 1;
    const r = act(c, s, 'girtablilu', 'envenom', tpart(s, 'weapon-arm')); expect(r.state.enemies[0]!.poison).toBe(5); expect(r.state.enemies[0]!.weakened).not.toBeNull();
  });
  it('E14 nonliving parts never receive poison/Weakened even during Rapture (A2-6)', () => {
    const c = fixture(); const s = fight(c, 'beast'); form(c, s, 'girtablilu', 'rapture');
    const r = act(c, s, 'girtablilu', 'envenom', tpart(s, 'shell')); expect(r.state.enemies[0]!.poison).toBe(0); expect(r.state.enemies[0]!.weakened).toBeNull();
  });
  it('E15 Rupture Venom requires poison', () => { const c = fixture(); const s = fight(c); reject(c, s, cmd(s, 'girtablilu', 'rupture-venom', { enemy: s.enemies[0]!.id }), 'illegal-target'); });
  it('E16 Rupture Venom bypasses shielding, armor and Ward and consumes poison', () => {
    const c = fixture(); const s = fight(c, 'beast-scribe'); s.enemies[0]!.poison = 7;
    const r = act(c, s, 'girtablilu', 'rupture-venom', { enemy: s.enemies[0]!.id }); expect(part(s, 'core').pool - part(r.state, 'core').pool).toBe(7 * 4); expect(r.state.enemies[0]!.poison).toBe(0);
  });
  it('E17 destroying shell immediately exposes core in the same player phase', () => {
    const c = fixture(); const s = fight(c, 'beast'); reject(c, s, cmd(s, 'ugallu', 'claw', tpart(s, 'core')), 'illegal-target'); part(s, 'shell').pool = 1;
    const r = act(c, s, 'ugallu', 'rend', tpart(s, 'shell')); expect(act(c, r.state, 'anzu', 'talon', tpart(r.state, 'core')).ok).toBe(true);
  });
  it('E18 only Anzu Rapture can Revoke body sources', () => {
    const c = fixture(); const s = fight(c, 'beast'); const target = { intent: s.intents[0]!.id };
    reject(c, s, cmd(s, 'anzu', 'revoke', target), 'illegal-target'); form(c, s, 'anzu', 'rapture'); expect(act(c, s, 'anzu', 'revoke', target).state.intents[0]!.status).toBe('revoked');
  });
  it('E19 revoking Inscribe immediately ends Ward and intact hand redeclares next round', () => {
    const c = fixture(); const s = fight(c, 'guard-scribe'); const i = s.intents.find(i => i.kind === 'inscribe')!;
    const r = act(c, s, 'anzu', 'revoke', { intent: i.id }); expect(r.state.enemies[0]!.wards).toEqual([]);
    expect(end(c, r.state).state.enemies[0]!.wards).toHaveLength(1);
  });
  it('E20 cancelled and revoked intents cannot be revoked again', () => {
    const c = fixture(); const s = fight(c); s.intents[0]!.status = 'cancelled'; reject(c, s, cmd(s, 'anzu', 'revoke', { intent: s.intents[0]!.id }), 'illegal-target');
    s.intents[0]!.status = 'revoked'; reject(c, s, cmd(s, 'anzu', 'revoke', { intent: s.intents[0]!.id }), 'illegal-target');
  });
  it('E21 Weakened does not reduce magical damage', () => {
    const c = fixture(); const s = fight(c, 'scribe', ['ugallu']); only(s, 'utter'); s.enemies[0]!.weakened = { amount: 99, untilRound: s.round };
    expect(damages(end(c, s).events)[0]!.damage.weakened).toBe(0);
  });
  it('E22 a fully Weakened Pin still pins its surviving recipient', () => {
    const c = fixture(); c.enemies[0]!.intents[1]!.schedule = { kind: 'every-round' }; const s = fight(c); const i = only(s, 'pin'); i.amount = 4; s.enemies[0]!.weakened = { amount: 5, untilRound: s.round };
    const r = end(c, s); expect(damages(r.events)[0]!.damage.applied).toBe(0); expect(brood(r.state, 'anzu').statuses.pinned).not.toBeNull();
  });
  it('E23 restraints expire after the configured last round; only one Clamp target exists', () => {
    const c = fixture(); const s = fight(c, 'warden'); const r = end(c, s); expect(r.state.party.filter(b => b.statuses.clamped)).toHaveLength(1);
    harmless(r.state); r.state.round = brood(r.state, 'anzu').statuses.clamped!.untilRound;
    expect(end(c, r.state).state.party.every(b => !b.statuses.clamped)).toBe(true);
  });
  it('E25 destroying Clamp releases Clamped without retargeting an already-declared Saw', () => {
    const c = fixture(); c.enemies[3]!.intents[1]!.schedule = { kind: 'every-round' }; const s = fight(c, 'warden'); const saw = s.intents.find(i => i.kind === 'saw')!;
    brood(s).statuses.clamped = { enemy: s.enemies[0]!.id, part: 'clamp', untilRound: 5 }; saw.target = { brood: 'ugallu' }; part(s, 'clamp').pool = 1;
    const r = act(c, s, 'ugallu', 'rend', tpart(s, 'clamp')); expect(brood(r.state).statuses.clamped).toBeNull(); expect(r.state.intents.find(i => i.kind === 'saw')!.target).toEqual(saw.target);
    expect(damages(end(c, r.state).events).find(e => e.brood === 'ugallu')!.damage.raw).toBe(11);
  });
  it('E34 Pinned prevents Hold by actor or for a Pinned ally', () => {
    const c = fixture(); const s = fight(c); const restraint = { enemy: s.enemies[0]!.id, part: 'restraining-limb' as const, untilRound: 5 };
    brood(s).statuses.pinned = restraint; reject(c, s, cmd(s, 'ugallu', 'hold-the-threshold', { brood: 'anzu' }), 'action-unavailable');
    brood(s).statuses.pinned = null; brood(s, 'anzu').statuses.pinned = restraint; reject(c, s, cmd(s, 'ugallu', 'hold-the-threshold', { brood: 'anzu' }), 'illegal-target');
  });
  it('E35 Salve rejects full/dead targets and exhausted uses, and caps actual healing', () => {
    const c = fixture(); const s = fight(c); reject(c, s, cmd(s, 'anzu', 'salve', { brood: 'ugallu' }), 'illegal-target'); brood(s).hp = 0;
    reject(c, s, cmd(s, 'anzu', 'salve', { brood: 'ugallu' }), 'illegal-target'); brood(s).hp = brood(s).maxHp - 1;
    const r = act(c, s, 'anzu', 'salve', { brood: 'ugallu' }); expect(brood(r.state).hp).toBe(brood(s).maxHp); expect(r.state.salveUses).toBe(s.salveUses - 1);
    s.salveUses = 0; reject(c, s, cmd(s, 'anzu', 'salve', { brood: 'ugallu' }), 'no-item-uses');
  });
  it('E40 the lone Scribe wards itself', () => { const c = fixture(); const s = fight(c, 'scribe'); expect(s.enemies[0]!.wards[0]!.sourceEnemy).toBe(s.enemies[0]!.id); });
  it('E41 death of the Inscribe target removes Ward and next round picks the Scribe', () => {
    const c = fixture(); const s = fight(c, 'guard-scribe'); part(s, 'body').pool = 1;
    const r = act(c, s, 'anzu', 'stolen-bolt', tpart(s, 'body')); expect(r.state.enemies[0]!.wards).toEqual([]);
    const next = end(c, r.state).state; expect(next.enemies[1]!.wards).toHaveLength(1);
  });
  it('E42 removing components leaves ordinary enemies alive/harmless and Warden pulsing', () => {
    const c = fixture(); for (const encounter of ['guard', 'warden'] as const) {
      const s = fight(c, encounter); s.enemies[0]!.parts.filter(p => p.kind === 'component').forEach(p => p.pool = 0); harmless(s);
      const r = end(c, s); expect(r.state.phase).toBe('player'); expect(r.state.intents.map(i => i.kind)).toEqual(encounter === 'guard' ? [] : ['pulse']);
    }
  });
  it('E47 poison continues after Girtablilu dies; dead actors never act', () => {
    const c = fixture(); const s = fight(c); brood(s, 'girtablilu').hp = 0; s.enemies[0]!.poison = 7; harmless(s);
    reject(c, s, cmd(s, 'girtablilu', 'rupture-venom', { enemy: s.enemies[0]!.id }), 'actor-dead');
    expect(part(s, 'body').pool - part(end(c, s).state, 'body').pool).toBe(7);
  });
  it('E48 Pinned and Clamped allow ordinary attacks and Salve', () => {
    const c = fixture(); const s = fight(c); brood(s).statuses.pinned = { enemy: s.enemies[0]!.id, part: 'restraining-limb', untilRound: 5 };
    brood(s).statuses.clamped = { enemy: s.enemies[0]!.id, part: 'clamp', untilRound: 5 };
    expect(act(c, s, 'ugallu', 'claw', tpart(s, 'body')).ok).toBe(true);
    brood(s).hp--; expect(act(c, s, 'ugallu', 'salve', { brood: 'ugallu' }).ok).toBe(true);
  });
  it('E49 revoking Saw preserves Clamp while revoking Clamp prevents its rider', () => {
    const c = fixture(); c.enemies[3]!.intents[1]!.schedule = { kind: 'every-round' }; const s = fight(c, 'warden');
    const clamp = s.intents.find(i => i.kind === 'clamp')!; const saw = s.intents.find(i => i.kind === 'saw')!;
    brood(s).statuses.clamped = { enemy: s.enemies[0]!.id, part: 'clamp', untilRound: 5 };
    const r = act(c, s, 'anzu', 'revoke', { intent: saw.id }); expect(brood(r.state).statuses.clamped).not.toBeNull();
    brood(s).statuses.clamped = null; const other = act(c, s, 'anzu', 'revoke', { intent: clamp.id });
    expect(end(c, other.state).state.party.every(b => !b.statuses.clamped)).toBe(true);
  });
  it('physical armor, Ward and magical bypass follow content for each basic attack', () => {
    const c = fixture(); for (const [actor, action] of [['ugallu', 'claw'], ['girtablilu', 'pincer'], ['anzu', 'talon']] as const) {
      const s = fight(c, 'guard-scribe'); const r = act(c, s, actor, action, tpart(s, 'weapon-arm'));
      expect(part(s, 'weapon-arm').pool - part(r.state, 'weapon-arm').pool).toBe(13 - 6 - 4);
    }
    const s = fight(c, 'guard-scribe'); const r = act(c, s, 'anzu', 'stolen-bolt', tpart(s, 'weapon-arm'));
    expect(part(s, 'weapon-arm').pool - part(r.state, 'weapon-arm').pool).toBe(13 - 4);
  });
  it('hand destruction removes Ward immediately and limb destruction releases Pinned', () => {
    const c = fixture(); const s = fight(c, 'guard-scribe'); part(s, 'inscription-hand', 1).pool = 1;
    const r = act(c, s, 'ugallu', 'rend', tpart(s, 'inscription-hand', 1)); expect(r.state.enemies[0]!.wards).toEqual([]);
    brood(r.state, 'anzu').statuses.pinned = { enemy: s.enemies[0]!.id, part: 'restraining-limb', untilRound: 5 }; part(r.state, 'restraining-limb').pool = 1;
    expect(brood(act(c, r.state, 'anzu', 'stolen-bolt', tpart(s, 'restraining-limb')).state, 'anzu').statuses.pinned).toBeNull();
  });
});

describe('Q02 intent units, Hold and targeting (§§3, 6.1, 8)', () => {
  it('E05 an intent with a dead declared target is skipped without retargeting', () => {
    const c = fixture(); const s = fight(c); s.intents[0]!.target = { brood: 'anzu' }; brood(s, 'anzu').hp = 0;
    const r = end(c, s); expect(damages(r.events)).toEqual([]); expect(r.events).toContainEqual({ kind: 'intent-skipped', intent: s.intents[0]!.id, reason: 'target-dead' });
  });
  it('E06 area intents do not redirect; Ugallu own share is reduced and retaliates', () => {
    const c = fixture(); const s = fight(c, 'beast'); s.round = 4; harmless(s); const declared = end(c, { ...s, round: 3 }).state; // next declaration schedules Trample
    const trample = only(declared, 'trample'); trample.amount = 11;
    const held = act(c, declared, 'ugallu', 'hold-the-threshold', { brood: 'anzu' }); const r = end(c, held.state);
    expect(r.events.some(e => e.kind === 'intent-redirected')).toBe(false); expect(damages(r.events).map(e => e.damage.applied)).toEqual([7, 11, 11]);
    expect(r.events.filter(e => e.kind === 'retaliated')).toHaveLength(1);
  });
  it.each(['clamp', 'pin', 'utter'] as const)('E07 Hold redirects %s including its rider to Ugallu', kind => {
    const c = fixture(); c.enemies[0]!.intents[1]!.schedule = { kind: 'every-round' };
    const s = fight(c, kind === 'clamp' ? 'warden' : kind === 'pin' ? 'guard' : 'scribe'); const i = only(s, kind); i.target = { brood: 'anzu' };
    const held = act(c, s, 'ugallu', 'hold-the-threshold', { brood: 'anzu' }); const r = end(c, held.state);
    expect(r.events).toContainEqual({ kind: 'intent-redirected', intent: i.id, from: 'anzu', to: 'ugallu' });
    if (kind === 'utter') expect(brood(r.state).revelation).toBe(5);
    else expect(brood(r.state).statuses[kind === 'clamp' ? 'clamped' : 'pinned']).not.toBeNull();
    expect(brood(r.state, 'anzu').hp).toBe(brood(s, 'anzu').hp);
  });
  it.each([false, true])('E08 Saw bonus checks actual Ugallu Clamp=%s; ally keeps Clamp', clamped => {
    const c = fixture(); c.enemies[3]!.intents[1]!.schedule = { kind: 'every-round' }; const s = fight(c, 'warden'); const i = only(s, 'saw'); i.target = { brood: 'anzu' };
    const restraint = { enemy: s.enemies[0]!.id, part: 'clamp' as const, untilRound: 5 }; brood(s, 'anzu').statuses.clamped = restraint;
    if (clamped) brood(s).statuses.clamped = restraint;
    const r = end(c, act(c, s, 'ugallu', 'hold-the-threshold', { brood: 'anzu' }).state);
    expect(damages(r.events)[0]!.damage.applied).toBe(11 + (clamped ? 9 : 0) - 4); expect(brood(r.state, 'anzu').statuses.clamped).not.toBeNull(); expect(brood(r.state).statuses.clamped).toBeNull();
  });
  it('E09 a gone source is skipped and cannot trigger retaliation', () => {
    const c = fixture(); const s = fight(c); part(s, 'weapon-arm').pool = 0;
    const r = end(c, act(c, s, 'ugallu', 'hold-the-threshold', { brood: 'ugallu' }).state);
    expect(r.events.some(e => e.kind === 'retaliated')).toBe(false); expect(r.events).toContainEqual({ kind: 'intent-skipped', intent: s.intents[0]!.id, reason: 'source-destroyed' });
  });
  it('E10 magical Pulse triggers Hold retaliation against its core source', () => {
    const c = fixture(); const s = fight(c, 'warden'); only(s, 'pulse'); const r = end(c, act(c, s, 'ugallu', 'hold-the-threshold', { brood: 'ugallu' }).state);
    expect(r.events.find(e => e.kind === 'retaliated')).toMatchObject({ target: tpart(s, 'core') }); expect(damages(r.events)[0]!.damage.hold).toBe(0);
  });
  it('E11 Ward and armor mitigate retaliation; actual retaliation enters the ledger', () => {
    const c = fixture(); const s = fight(c, 'guard-scribe'); only(s, 'strike'); const r = end(c, act(c, s, 'ugallu', 'hold-the-threshold', { brood: 'ugallu' }).state);
    expect(r.events.find(e => e.kind === 'retaliated')).toMatchObject({ damage: { armor: 6, ward: 4, applied: 1 } }); expect(r.state.ledger[0]!.previous.ugallu).toBe(1);
  });
  it('E24 Clamp target dying before declaration makes Saw pick highest living HP', () => {
    const c = fixture(); const s = fight(c, 'warden'); brood(s, 'anzu').hp = 1; const i = only(s, 'clamp'); i.target = { brood: 'anzu' };
    const r = end(c, s); const saw = r.state.intents.find(i => i.kind === 'saw')!; expect(brood(r.state, 'anzu').hp).toBe(0); expect(saw.target).toEqual({ brood: 'ugallu' });
  });
  it('E39 ledger ties use current HP then roster order, ignoring dead damage dealers', () => {
    const c = fixture(); const s = fight(c); harmless(s); s.ledger[0]!.current = { ugallu: 7, girtablilu: 7, anzu: 23 }; brood(s, 'anzu').hp = 0;
    brood(s).hp = brood(s, 'girtablilu').hp = 51;
    const r = end(c, s); expect(r.state.intents[0]!.target).toEqual({ brood: 'ugallu' }); expect(r.state.ledger[0]!.current).toEqual({ ugallu: 0, girtablilu: 0, anzu: 0 });
    brood(s, 'girtablilu').hp++; expect(end(c, s).state.intents[0]!.target).toEqual({ brood: 'girtablilu' });
  });
  it('E46 redirect uses Ugallu Guard/Hold/Rupture, not the original target Guard', () => {
    const c = fixture(); const s = fight(c); s.intents[0]!.target = { brood: 'anzu' }; brood(s, 'anzu').statuses.guard = { untilRound: 1 };
    const held = act(c, s, 'ugallu', 'hold-the-threshold', { brood: 'anzu' }); form(c, held.state, 'ugallu', 'rupture');
    expect(damages(end(c, held.state).events)[0]!.damage.applied).toBe(11 + 3 - 4);
    brood(held.state).statuses.guard = { untilRound: 1 }; expect(damages(end(c, held.state).events)[0]!.damage.applied).toBe(Math.ceil((11 + 3) / 2));
  });
  it('E50 Ugallu death ends Hold and later intents hit the ally without redirection', () => {
    const c = fixture(); c.enemies[0]!.intents[1]!.schedule = { kind: 'every-round' }; const s = fight(c); s.intents.forEach(i => i.target = { brood: 'anzu' }); brood(s).hp = 1;
    const r = end(c, act(c, s, 'ugallu', 'hold-the-threshold', { brood: 'anzu' }).state);
    expect(r.events.filter(e => e.kind === 'intent-redirected')).toHaveLength(1); expect(damages(r.events).map(e => e.brood)).toEqual(['ugallu', 'anzu']); expect(brood(r.state).statuses.hold).toBeNull();
  });
  it('E51 dead held ally causes target-dead skip before any redirect', () => {
    const c = fixture(); const s = fight(c); s.intents[0]!.target = { brood: 'anzu' };
    const held = act(c, s, 'ugallu', 'hold-the-threshold', { brood: 'anzu' }); brood(held.state, 'anzu').hp = 0; const r = end(c, held.state);
    expect(r.events.some(e => e.kind === 'intent-redirected')).toBe(false); expect(damages(r.events)).toEqual([]);
    expect(r.events).toContainEqual({ kind: 'intent-skipped', intent: s.intents[0]!.id, reason: 'target-dead' });
  });
  it('Utter chooses untransformed highest Revelation, falling back to lowest HP', () => {
    const c = fixture(); const s = fight(c, 'scribe'); harmless(s); brood(s, 'girtablilu').revelation = 7; form(c, s, 'ugallu', 'rapture');
    const r = end(c, s); expect(r.state.intents.find(i => i.kind === 'utter')!.target).toEqual({ brood: 'girtablilu' });
    form(c, s, 'girtablilu', 'rapture'); form(c, s, 'anzu', 'rapture'); expect(end(c, s).state.intents.find(i => i.kind === 'utter')!.target).toEqual({ brood: 'anzu' });
  });
  it('Clamp includes transformed Brood at cap and breaks equal Revelation by lower HP (A2-7)', () => {
    const c = fixture(); const s = fight(c, 'warden'); harmless(s); s.round = 4; form(c, s, 'ugallu', 'rapture', 9); form(c, s, 'girtablilu', 'rapture', 9);
    expect(end(c, s).state.intents.find(i => i.kind === 'clamp')!.target).toEqual({ brood: 'girtablilu' });
  });
  it('Gore conditional bonus disappears immediately on locomotion destruction', () => {
    const c = fixture(); const s = fight(c, 'beast'); only(s, 'gore'); part(s, 'locomotion-organ').pool = 1;
    const r = end(c, act(c, s, 'ugallu', 'rend', tpart(s, 'locomotion-organ')).state); expect(damages(r.events)[0]!.damage.raw).toBe(11);
  });
});

describe('Q02 Revelation, six forms and unit boundaries (§7, A2)', () => {
  it.each(['ugallu', 'girtablilu', 'anzu'] as const)('own costs start %s Rapture after effects, and can cross again after expiry', id => {
    const c = fixture(); const s = fight(c); const b = brood(s, id); b.revelation = b.revelationCap - 1;
    const action = id === 'ugallu' ? 'rend' : id === 'girtablilu' ? 'rupture-venom' : 'stolen-bolt';
    s.enemies[0]!.poison = 1;
    const target = id === 'girtablilu' ? { enemy: s.enemies[0]!.id } : tpart(s, 'weapon-arm');
    const first = act(c, s, id, action, target); expect(brood(first.state, id).transformation?.kind).toBe('rapture');
    harmless(first.state); first.state.round = brood(first.state, id).transformation!.untilRound;
    const expired = end(c, first.state).state; expect(brood(expired, id).revelation).toBe(Math.floor(b.revelationCap / 2));
    // Use an explicit cost variant to reach the cap again from the actual reset.
    c.actions.find(a => a.id === action)!.revelationCost = b.revelationCap - brood(expired, id).revelation;
    expired.enemies[0]!.poison = 1; part(expired, 'weapon-arm').pool = 31;
    const again = act(c, expired, id, action, target); expect(brood(again.state, id).transformation?.kind).toBe('rapture');
  });
  it('intent damage → riders → retaliation → pending transformation → outcome is one unit', () => {
    const c = fixture(); const s = fight(c, 'warden', ['ugallu']); const i = only(s, 'pulse'); i.riders = [{ kind: 'revelation', amount: 5 }];
    brood(s).revelation = brood(s).revelationCap - 1; part(s, 'core').pool = 1;
    const r = end(c, act(c, s, 'ugallu', 'hold-the-threshold', { brood: 'ugallu' }).state); const kinds = r.events.map(e => e.kind);
    for (const [before, after] of [['brood-damaged', 'revelation-gained'], ['revelation-gained', 'retaliated'], ['retaliated', 'transformation-started'], ['transformation-started', 'combat-ended']] as const) expect(kinds.indexOf(before)).toBeLessThan(kinds.indexOf(after));
    expect(r.state.phase).toBe('victory'); expect(brood(r.state).revelation).toBe(Math.floor(brood(s).revelationCap / 2));
  });
  it('E01 action effects kill enemy before the own-cost burn kills Brood; defeat wins', () => {
    const c = fixture(); const s = fight(c, 'guard', ['ugallu']); form(c, s, 'ugallu', 'rapture'); brood(s).hp = 1; part(s, 'body').pool = 1;
    const r = act(c, s, 'ugallu', 'rend', tpart(s, 'body')); expect(r.state.phase).toBe('defeat');
    expect(r.events.findIndex(e => e.kind === 'enemy-died')).toBeLessThan(r.events.findIndex(e => e.kind === 'revelation-burned')); expect(r.events.at(-1)).toMatchObject({ kind: 'combat-ended', outcome: 'defeat' });
  });
  it('E02 retaliation wins at the intent unit; poison and E2 share one unit (A2-1)', () => {
    const c = fixture(); const s = fight(c, 'warden', ['ugallu']); only(s, 'pulse'); part(s, 'core').pool = 1;
    const r = end(c, act(c, s, 'ugallu', 'hold-the-threshold', { brood: 'ugallu' }).state); expect(r.state.phase).toBe('victory'); expect(r.events.some(e => e.kind === 'round-started')).toBe(false);
    const poisoned = fight(c, 'guard', ['girtablilu']); harmless(poisoned); form(c, poisoned, 'girtablilu', 'rapture'); brood(poisoned, 'girtablilu').hp = 1; poisoned.enemies[0]!.poison = 7; part(poisoned, 'body').pool = 1;
    const loss = end(c, poisoned); expect(loss.state.phase).toBe('defeat'); expect(loss.events.findIndex(e => e.kind === 'poison-ticked')).toBeLessThan(loss.events.findIndex(e => e.kind === 'brood-damaged'));
    expect(damages(loss.events)[0]!.source.kind).toBe('form');
  });
  it('E26 crossing is discarded when the Brood dies in the same unit', () => {
    const c = fixture(); const s = fight(c, 'scribe', ['ugallu']); const i = only(s, 'utter'); brood(s).hp = 1; brood(s).revelation = brood(s).revelationCap - 1;
    const r = end(c, s); expect(r.state.phase).toBe('defeat'); expect(r.events.some(e => e.kind === 'transformation-started')).toBe(false); expect(brood(r.state).pendingCrossing).toBeNull(); expect(i.kind).toBe('utter');
  });
  it('E27 area crossings start in roster order after all damage/riders resolve', () => {
    const c = fixture(); c.enemies[3]!.intents[2]!.schedule = { kind: 'every-round' }; const s = fight(c, 'warden'); only(s, 'hymn'); s.party.forEach(b => b.revelation = b.revelationCap - 1);
    const r = end(c, s); expect(r.events.flatMap(e => e.kind === 'transformation-started' ? [e.brood] : [])).toEqual(['ugallu', 'girtablilu', 'anzu']);
    const gains = r.events.map((e, i) => e.kind === 'revelation-gained' ? i : -1); expect(r.events.findIndex(e => e.kind === 'transformation-started')).toBeGreaterThan(Math.max(...gains));
    expect(r.state.party.every(b => b.transformation?.kind === 'rupture')).toBe(true);
  });
  it('E28 transformed enemy Revelation burns HP without Guard mitigation or retaliation (A2-5)', () => {
    const c = fixture(); const s = fight(c, 'scribe', ['ugallu']); only(s, 'utter'); form(c, s, 'ugallu', 'rapture'); brood(s).statuses.guard = { untilRound: 1 };
    const r = end(c, s); expect(r.events.find(e => e.kind === 'revelation-burned')).toMatchObject({ amount: 5, applied: 5 }); expect(brood(r.state).hp).toBe(brood(s).hp - Math.ceil(11 / 2) - 5);
  });
  it('E29 victory ends forms/reset while preserving the reset in gauntlet carried values', () => {
    const c = fixture(); const s = createGauntlet(c, { party: ['ugallu'] }); form(c, s, 'ugallu', 'rapture'); part(s, 'body').pool = 1; part(s, 'body', 1).pool = 0;
    const r = act(c, s, 'ugallu', 'claw', tpart(s, 'body')); expect(r.state.phase).toBe('between-fights'); expect(brood(r.state).transformation).toBeNull();
    expect(r.state.carried[0]!.revelation).toBe(Math.floor(brood(s).revelationCap / 2));
  });
  it('E30 transformed death ends form without resetting Revelation', () => {
    const c = fixture(); const s = fight(c, 'guard', ['ugallu']); form(c, s, 'ugallu', 'rapture'); brood(s).hp = 1;
    const r = end(c, s); expect(brood(r.state).transformation).toBeNull(); expect(brood(r.state).revelation).toBe(brood(s).revelationCap);
    expect(r.events.find(e => e.kind === 'transformation-ended')).toMatchObject({ reason: 'death', revelation: brood(s).revelationCap });
  });
  it('E31 own crossing caps excess without burn; causing action has no new-form bonus', () => {
    const c = fixture(); const s = fight(c); brood(s).revelation = brood(s).revelationCap - 1;
    const r = act(c, s, 'ugallu', 'rend', tpart(s, 'weapon-arm')); expect(brood(r.state).transformation?.kind).toBe('rapture'); expect(brood(r.state).hp).toBe(brood(s).hp);
    expect(part(s, 'weapon-arm').pool - part(r.state, 'weapon-arm').pool).toBe(19); expect(r.events.some(e => e.kind === 'revelation-burned')).toBe(false);
    expect(r.events.map(e => e.kind).indexOf('revelation-gained')).toBeGreaterThan(r.events.map(e => e.kind).indexOf('part-damaged'));
  });
  it('E32 preexisting Guard/Hold survive a form that blocks choosing them', () => {
    const c = fixture(); const s = fight(c, 'scribe'); only(s, 'utter'); s.intents[0]!.target = { brood: 'ugallu' }; brood(s).revelation = brood(s).revelationCap - 1;
    const held = act(c, s, 'ugallu', 'hold-the-threshold', { brood: 'ugallu' }); const r = end(c, held.state);
    const start = r.events.findIndex(e => e.kind === 'transformation-started'); const expires = r.events.findIndex(e => e.kind === 'status-removed' && e.status === 'hold'); expect(start).toBeGreaterThan(-1); expect(expires).toBeGreaterThan(start);
    const guarded = fight(c); brood(guarded).statuses.guard = { untilRound: 1 }; brood(guarded).revelation = brood(guarded).revelationCap - 1;
    expect(brood(act(c, guarded, 'ugallu', 'rend', tpart(guarded, 'weapon-arm')).state).statuses.guard).not.toBeNull();
  });
  it('E33 Rupture incoming bonus precedes Guard halving and Weakened precedes the bonus', () => {
    const c = fixture(); const s = fight(c); form(c, s, 'ugallu', 'rupture'); s.enemies[0]!.weakened = { amount: 5, untilRound: 1 };
    const r = end(c, act(c, s, 'ugallu', 'guard', null).state); expect(damages(r.events)[0]!.damage.applied).toBe(Math.ceil((11 - 5 + 3) / 2));
  });
  it('all six forms apply content modifiers, expiry resets to floor(cap/2), E2 bypasses mitigation', () => {
    const c = fixture();
    const u = fight(c); form(c, u, 'ugallu', 'rapture'); expect(part(u, 'body').pool - part(act(c, u, 'ugallu', 'claw', tpart(u, 'body')).state, 'body').pool).toBe(9 + 3);
    reject(c, u, cmd(u, 'ugallu', 'guard', null), 'action-unavailable'); reject(c, u, cmd(u, 'ugallu', 'hold-the-threshold', { brood: 'ugallu' }), 'action-unavailable');
    const g = fight(c); form(c, g, 'girtablilu', 'rapture'); const poisoned = act(c, g, 'girtablilu', 'envenom', tpart(g, 'weapon-arm')).state;
    expect(poisoned.enemies[0]!.poison).toBe(13); brood(poisoned, 'girtablilu').acted = false;
    expect(part(poisoned, 'body').pool - part(act(c, poisoned, 'girtablilu', 'rupture-venom', { enemy: poisoned.enemies[0]!.id }).state, 'body').pool).toBe(13 * 5);
    const a = fight(c); form(c, a, 'anzu', 'rapture'); expect(part(a, 'body').pool - part(act(c, a, 'anzu', 'stolen-bolt', tpart(a, 'body')).state, 'body').pool).toBe(21);
    reject(c, a, cmd(a, 'anzu', 'guard', null), 'action-unavailable');
    for (const id of ['ugallu', 'girtablilu', 'anzu'] as const) for (const kind of ['rapture', 'rupture'] as const) {
      const s = fight(c); harmless(s); form(c, s, id, kind, s.round); brood(s, id).statuses.guard = { untilRound: s.round };
      const r = end(c, s); expect(brood(r.state, id).transformation).toBeNull(); expect(brood(r.state, id).revelation).toBe(Math.floor(brood(s, id).revelationCap / 2));
      if (id === 'girtablilu') expect(damages(r.events)[0]!.damage).toMatchObject({ raw: 4, applied: 4, guard: 0, rupture: 0 });
    }
    for (const [id, actions] of [['girtablilu', ['envenom', 'rupture-venom']], ['anzu', ['stolen-bolt', 'revoke']]] as const) {
      const s = fight(c); form(c, s, id, 'rupture'); for (const action of actions) reject(c, s, cmd(s, id, action, null), 'action-unavailable');
    }
  });
  it('E1 poison precedes E2 loss, E4 statuses, E5 expiry, E6 ledger and next declaration', () => {
    const c = fixture(); const s = fight(c, 'guard-scribe'); harmless(s); form(c, s, 'girtablilu', 'rapture', s.round); s.enemies[0]!.poison = 7;
    brood(s).statuses.guard = { untilRound: s.round }; s.enemies[0]!.weakened = { amount: 5, untilRound: s.round };
    const r = end(c, s); const kinds = r.events.map(e => e.kind);
    expect(kinds.indexOf('poison-ticked')).toBeLessThan(kinds.indexOf('brood-damaged')); expect(kinds.indexOf('brood-damaged')).toBeLessThan(kinds.indexOf('status-removed'));
    expect(kinds.indexOf('status-removed')).toBeLessThan(kinds.indexOf('transformation-ended')); expect(kinds.indexOf('transformation-ended')).toBeLessThan(kinds.indexOf('round-started'));
    expect(r.state.enemies[0]!.poison).toBe(6); expect(r.state.enemies[0]!.weakened).toBeNull();
    expect(r.events.filter(e => e.kind === 'status-removed' && e.status === 'ward')).toHaveLength(1); expect(r.state.enemies[0]!.wards).toHaveLength(1);
  });
});

describe('Q02 gauntlet, previews, records and simulation boundary (§§10–12)', () => {
  it('E43 gauntlet carries deaths/HP/reset Revelation/Salves and resets fight-scoped state', () => {
    const c = fixture(); const s = createGauntlet(c, { party: ['ugallu', 'girtablilu', 'anzu'] });
    brood(s, 'anzu').hp = 0; brood(s, 'girtablilu').hp = 41; brood(s, 'girtablilu').revelation = 7; s.salveUses = 3;
    form(c, s, 'ugallu', 'rapture'); s.enemies.forEach(e => e.parts.find(p => p.kind === 'body')!.pool = 1);
    // One enemy has already died; kill the remaining one through the public API.
    part(s, 'body', 1).pool = 0;
    const win = act(c, s, 'ugallu', 'claw', tpart(s, 'body')); expect(win.state.phase).toBe('between-fights');
    reject(c, win.state, cmd(win.state, 'girtablilu', 'salve', { brood: 'ugallu' }), 'wrong-phase');
    const next = applyCommand(c, win.state, { kind: 'continue', expectedRevision: win.state.revision }); expect(next.ok).toBe(true);
    expect(next.state.revision).toBe(win.state.revision + 1); expect(next.state.round).toBe(1); expect(next.state.fightIndex).toBe(s.fightIndex + 1);
    expect(next.state.party.map(b => [b.id, b.hp, b.revelation])).toEqual(win.state.carried.map(b => [b.id, b.hp, b.revelation])); expect(next.state.salveUses).toBe(3);
    expect(next.state.party.every(b => !b.acted && !b.transformation && Object.values(b.statuses).every(v => v === null))).toBe(true);
    expect(next.state.enemies.every(e => !e.poison && !e.weakened)).toBe(true); expect(next.state.ledger.every(l => Object.values(l.current).every(v => !v) && Object.values(l.previous).every(v => !v))).toBe(true);
    reject(c, next.state, cmd(next.state, 'anzu', 'talon', tpart(next.state, 'body')), 'actor-dead');
    expect(legalActions(c, next.state).every(x => x.command.kind !== 'act' || x.command.actor !== 'anzu')).toBe(true);
    reject(c, s, { kind: 'continue', expectedRevision: s.revision }, 'wrong-phase');
  });
  it('gauntlet defeat ends the run and final fight victory ends it without continue', () => {
    const c = fixture(); const s = createGauntlet(c, { party: ['ugallu'] }); brood(s).hp = 1; const loss = end(c, s); expect(loss.state.phase).toBe('defeat');
    reject(c, loss.state, { kind: 'continue', expectedRevision: loss.state.revision }, 'wrong-phase');
    const last = fight(c, 'warden', ['ugallu']); last.run = { kind: 'gauntlet', gauntletId: 'gauntlet-v1', encounters: c.gauntlets[0]!.encounters, party: ['ugallu'], start: 'fresh' }; last.fightIndex = last.run.encounters.length - 1;
    part(last, 'core').pool = 1; part(last, 'core').armor = 0; const win = act(c, last, 'ugallu', 'claw', tpart(last, 'core')); expect(win.state.phase).toBe('victory');
  });
  it('preview matches commits for EVERY legal action across representative controlled states', () => {
    const c = fixture(); const states = c.encounters.map(e => fight(c, e.id));
    const transformed = fight(c, 'warden'); form(c, transformed, 'ugallu', 'rapture'); form(c, transformed, 'girtablilu', 'rupture'); form(c, transformed, 'anzu', 'rapture'); states.push(transformed);
    const poisoned = fight(c, 'beast'); poisoned.enemies[0]!.poison = 7; brood(poisoned).hp--; states.push(poisoned);
    for (const s of states) {
      const before = structuredClone(s); const actions = legalActions(c, s); expect(actions.length).toBeGreaterThan(0);
      for (const { command } of actions) {
        const preview = previewCommand(c, s, command); const committed = applyCommand(c, s, command);
        expect(preview.result).toEqual(committed); expect(preview.events).toEqual(committed.events); expect(preview.state).toEqual(committed.state);
        expect(preview.deltas.salveUses).toBe(committed.state.salveUses - s.salveUses);
        if (command.kind === 'endPhase' || committed.state.phase !== 'player') expect(preview.forecast).toBeNull();
        else expect(preview.forecast).toEqual(applyCommand(c, committed.state, { kind: 'endPhase', expectedRevision: committed.state.revision }));
      }
      expect(s).toEqual(before);
    }
  });
  it('preview after a killing action has no forecast; rejected preview remains atomic', () => {
    const c = fixture(); const s = fight(c); part(s, 'body').pool = 1; part(s, 'body').armor = 0;
    const r = previewCommand(c, s, cmd(s, 'ugallu', 'claw', tpart(s, 'body'))); expect(r.state.phase).toBe('victory'); expect(r.forecast).toBeNull();
    expect(previewCommand(c, s, null).result).toEqual({ ok: false, state: s, events: [], error: { code: 'invalid-command' } });
  });
  it('records embed independent content, replay unfinished fights and ignore object key order', () => {
    const c = fixture(); const initial = fight(c); const command = cmd(initial, 'ugallu', 'rend', tpart(initial, 'weapon-arm')); const r = applyCommand(c, initial, command);
    const record = recordOf({ content: c, initialState: initial, commands: [{ command, revision: r.state.revision, events: r.events }], finalState: r.state, buildRevision: 'unknown' });
    expect(replayRecord(parseRecord(JSON.stringify(record)))).toMatchObject({ ok: true, state: r.state, commands: 1, outcome: 'player' });
    const reordered = { ...record, finalState: Object.fromEntries(Object.entries(record.finalState).reverse()) };
    expect(replayRecord(parseRecord(reordered)).ok).toBe(true); record.content.actions[0]!.name = 'changed'; expect(c.actions[0]!.name).not.toBe('changed');
  });
  it('replay identifies the first events, revision and final-state divergence', () => {
    const c = fixture(); const initial = fight(c); const command = cmd(initial, 'ugallu', 'guard', null); const r = applyCommand(c, initial, command);
    const record = recordOf({ content: c, initialState: initial, commands: [{ command, revision: r.state.revision, events: r.events }], finalState: r.state, buildRevision: 'unknown' });
    const changed = structuredClone(record); changed.commands[0]!.events = []; expect(replayRecord(changed)).toMatchObject({ ok: false, kind: 'events', commandIndex: 0 });
    changed.commands = structuredClone(record.commands); changed.commands[0]!.revision++; expect(replayRecord(changed)).toMatchObject({ ok: false, kind: 'revision', commandIndex: 0 });
    changed.commands = structuredClone(record.commands); changed.finalState.salveUses++; expect(replayRecord(changed)).toMatchObject({ ok: false, kind: 'final-state', commandIndex: 1 });
  });
  it('records reject unsupported versions and impossible initial Revelation without executing input', () => {
    const c = fixture(); const initial = fight(c); const record = recordOf({ content: c, initialState: initial, commands: [], finalState: initial, buildRevision: 'unknown' });
    expect(() => parseRecord({ ...record, rulesVersion: 'future' })).toThrow('unknown');
    record.initialState.party[0]!.revelation = record.initialState.party[0]!.revelationCap; expect(() => parseRecord(record)).toThrow('invariant');
  });
  it('modified content changes damage, costs, forms, healing, Ward and starts through the same API', () => {
    const c = fixture(); const original = fight(c); const action = c.actions.find(a => a.id === 'rend')!; if (action.effect.kind !== 'damage') throw new Error('test setup');
    action.effect.componentAmount = 23; action.revelationCost = 7; c.contentVersion = 'test-q02-retuned'; const modified = loadContent(JSON.stringify(c));
    const r = act(modified, original, 'ugallu', 'rend', tpart(original, 'weapon-arm')); expect(part(original, 'weapon-arm').pool - part(r.state, 'weapon-arm').pool).toBe(23); expect(brood(r.state).revelation).toBe(7);
  });
  it('core files and transitive imports exclude renderer/audio/browser dependencies', () => {
    const core = join(import.meta.dirname, '../src/core'); const files = readdirSync(core, { recursive: true }).filter((p): p is string => typeof p === 'string' && p.endsWith('.ts'));
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      // Exclude provenance comments; imported paths are checked transitively by
      // requiring every dependency to remain in this recursively scanned tree.
      const source = readFileSync(join(core, file), 'utf8').replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, '');
      for (const match of source.matchAll(/(?:\bfrom\s*|\bimport\s*)['"]([^'"]+)['"]/g)) {
        const specifier = match[1]!;
        expect(specifier.startsWith('.')).toBe(true);
        expect(relative(core, resolve(dirname(join(core, file)), specifier)).startsWith('..')).toBe(false);
      }
      expect(source).not.toMatch(/\b(?:window|document|navigator|localStorage|sessionStorage|HTMLElement|HTMLCanvasElement|AudioContext|fetch|XMLHttpRequest|globalThis|process|require)\b/);
      expect(source).not.toMatch(/\b(?:Math\s*\.\s*random|Date\s*\.\s*now|import\s*\()/);
    }
  });
});
