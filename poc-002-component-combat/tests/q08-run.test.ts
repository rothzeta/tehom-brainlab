import { describe, expect, it } from 'vitest';
import topology from '../content/combat-content.v1.json';
import { legalActions, loadContent, replayRecord } from '../src/core';
import type { BroodId, Content } from '../src/core/types';
import { createRunSession } from '../src/view/run/session';

function fixture(): Content {
  function numbers(v: unknown): unknown {
    if (typeof v === 'number') return 5;
    if (Array.isArray(v)) return v.map(numbers);
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, numbers(x)]));
    return v;
  }
  const c = numbers(topology) as Content;
  c.contentVersion = 'test-q08';
  for (const b of c.brood) { b.maxHp = b.id === 'anzu' ? 1 : 97; b.revelationCap = 37; }
  for (const a of c.actions) {
    a.revelationCost = 1;
    if (a.effect.kind === 'damage') { a.effect.amount = 41; a.effect.componentAmount = 41; }
  }
  for (const enemy of c.enemies) {
    for (const p of enemy.parts) { p.pool = 7; p.armor = 0; }
    for (const i of enemy.intents) {
      i.targeting = 'all-brood'; i.amount = 3; i.damageType = 'magical';
      i.riders = []; i.modifiers = [];
      if (i.schedule.kind === 'modulo') { i.schedule.divisor = 7; i.schedule.remainder = 1; }
    }
  }
  return loadContent(c);
}

describe('Q08 attempts through the public session boundary (§§10,12)', () => {
  it('launches every nonempty party × encounter × preset with fresh record evidence', () => {
    const c = fixture();
    for (let mask = 1; mask < 1 << c.brood.length; mask++) {
      const party = c.brood.filter((_, index) => mask & (1 << index)).map(b => b.id);
      for (const e of c.encounters) for (const start of c.starts) {
        const session = createRunSession(c, { kind: 'fight', party, encounterId: e.id, start: start.id });
        expect(session.state.run).toMatchObject({ kind: 'fight', party, encounterId: e.id, start: start.id });
        expect(session.exportRecord().commands).toEqual([]);
        expect(replayRecord(session.exportRecord())).toMatchObject({ ok: true, state: session.state });
      }
    }
  });

  it('exports after death and between fights, carries only core-produced state, and records explicit continue', () => {
    const c = fixture();
    const party: BroodId[] = ['ugallu', 'girtablilu', 'anzu'];
    const session = createRunSession(c, { kind: 'gauntlet', party });
    const verifyExport = () => expect(replayRecord(session.exportRecord())).toMatchObject({ ok: true, state: session.state });
    session.commit({ kind: 'endPhase', expectedRevision: session.state.revision });
    expect(session.state.party.find(b => b.id === 'anzu')!.hp).toBe(0);
    expect(session.state.phase).toBe('player'); verifyExport();
    const salve = legalActions(c, session.state).find(a => a.command.kind === 'act' && a.command.action === 'salve');
    expect(salve).toBeDefined(); expect(session.commit(salve!.command).ok).toBe(true);
    const finish = () => {
      for (let step = 0; session.state.phase === 'player' && step < 50; step++) {
        const commands = legalActions(c, session.state);
        const hit = commands.find(a => a.command.kind === 'act' && ['claw', 'pincer'].includes(a.command.action));
        expect(session.commit((hit ?? commands.find(a => a.command.kind === 'endPhase'))!.command).ok).toBe(true);
      }
    };
    for (let index = 0; index < c.gauntlets[0]!.encounters.length; index++) {
      finish(); verifyExport();
      expect(session.state.run.encounters[session.state.fightIndex]).toBe(c.gauntlets[0]!.encounters[index]);
      if (index === c.gauntlets[0]!.encounters.length - 1) break;
      expect(session.state.phase).toBe('between-fights');
      const before = session.state;
      expect(session.commit({ kind: 'endPhase', expectedRevision: before.revision }).ok).toBe(false);
      expect(session.state).toEqual(before);
      expect(session.commit({ kind: 'continue', expectedRevision: before.revision }).ok).toBe(true);
      expect(session.state.party.map(b => [b.id, b.hp, b.revelation])).toEqual(before.party.map(b => [b.id, b.hp, b.revelation]));
      expect(session.state.salveUses).toBe(before.salveUses);
      expect(session.state.party.find(b => b.id === 'anzu')!.hp).toBe(0);
      verifyExport();
    }
    expect(session.state.phase).toBe('victory');
    expect(session.exportRecord().commands.filter(s => s.command.kind === 'continue')).toHaveLength(c.gauntlets[0]!.encounters.length - 1);
  });

  it('ends a defeated gauntlet and a new launch has no prior commands or preview effects', () => {
    const c = fixture(), request = { kind: 'gauntlet' as const, party: ['anzu'] as BroodId[] };
    const old = createRunSession(c, request);
    old.preview({ kind: 'endPhase', expectedRevision: old.state.revision });
    old.commit({ kind: 'endPhase', expectedRevision: old.state.revision });
    expect(old.state.phase).toBe('defeat');
    const ended = old.state;
    expect(old.commit({ kind: 'continue', expectedRevision: ended.revision }).ok).toBe(false);
    expect(old.state).toEqual(ended);
    expect(replayRecord(old.exportRecord())).toMatchObject({ ok: true, state: ended });
    const fresh = createRunSession(c, request);
    expect(fresh.state.phase).toBe('player');
    expect(fresh.exportRecord().commands).toEqual([]);
    expect(fresh.state.party[0]!.hp).toBe(c.brood.find(b => b.id === 'anzu')!.maxHp);
  });
});
