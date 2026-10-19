import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import topology from '../content/combat-content.v1.json';
import { applyCommand, createFight, loadContent } from '../src/core';
import type { Content } from '../src/core';
import { actions, openings, search } from '../src/harness/search';
import { formatReport, probe, sweep } from '../src/harness/report';
import { metrics, openingSignals, policyMatches } from '../src/harness/signals';
import type { Metrics, OpeningResult, PartyOpenings } from '../src/harness/signals';
import { POLICIES, policyLine } from '../src/harness/policies';
import { breakpoints } from '../src/harness/breakpoints';

/** Closed topology only; every shipped numeric leaf is replaced. */
function fixture(): Content {
  const replace = (v: any): any => typeof v === 'number' ? 3 : Array.isArray(v) ? v.map(replace) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, replace(x)])) : v;
  const c = replace(topology) as Content; c.contentVersion = 'test-q04'; c.fightSalveUses = 1;
  for (const b of c.brood) { b.maxHp = 23; b.revelationCap = 17; }
  for (const a of c.actions) {
    a.revelationCost = 0;
    if (a.effect.kind === 'damage') Object.assign(a.effect, { amount: 7, componentAmount: 7 });
    if (a.effect.kind === 'envenom') Object.assign(a.effect, { amount: 2, poisonGain: 2, poisonCap: 5, weakenedReduction: 1 });
    if (a.effect.kind === 'heal') a.effect.amount = 5;
  }
  for (const e of c.enemies) {
    for (const p of e.parts) { p.pool = p.kind === 'body' ? 7 : 5; p.armor = 0; }
    for (const i of e.intents) {
      i.amount = i.kind === 'inscribe' ? 0 : 2; i.ward = 0;
      if (i.schedule.kind === 'modulo') { i.schedule.divisor = 3; i.schedule.remainder = 1; }
      for (const rider of i.riders) if (rider.kind === 'revelation') rider.amount = 0;
    }
  }
  return loadContent(c);
}
const initial = (c: Content) => createFight(c, { encounterId: 'guard', party: ['ugallu'], start: 'fresh' });
function fake(hp: number, cls: string, win = true): OpeningResult {
  return { opening: { class: cls, commands: [] }, result: { outcome: win ? 'victory' : 'no-win-found', hp } as Metrics };
}
function group(index: number, results: OpeningResult[]): PartyOpenings {
  return { cell: `party-${index}`, party: ['ugallu'], encounter: 'guard', salves: true, results };
}

describe('Q04 observable search and reporting contracts', () => {
  it('finds and replays a forced win without mutating content or the supplied state', () => {
    const c = fixture(); const s = initial(c); const saved = structuredClone({ c, s });
    const result = search(c, s, { width: 3, depth: 2, soloDepth: 1, salves: false });
    expect(result.outcome).toBe('victory'); expect(result.hp).toBe(s.party[0]!.hp);
    let replay = s;
    for (const step of result.steps) { const r = applyCommand(c, replay, step.command); expect(r.ok).toBe(true); expect(r.events).toEqual(step.events); replay = r.state; }
    expect(replay).toEqual(result.state); expect({ c, s }).toEqual(saved);
  });
  it('exhaustive solo prefix retains a winning choice even at beam width one', () => {
    const c = fixture();
    c.enemies[0]!.parts.find(p => p.kind === 'body')!.pool = 28;
    c.enemies[0]!.parts.filter(p => p.kind === 'component').forEach(p => p.pool = 99);
    const s = initial(c);
    const result = search(c, s, { width: 1, depth: 4, soloDepth: 4, salves: false });
    expect(result.outcome).toBe('victory'); expect(result.rounds).toBe(4);
  });
  it('enumerates every solo legal opening, includes forfeiture, separates damage classes and is pure', () => {
    const c = fixture(); const s = initial(c); const saved = structuredClone(s);
    const result = openings(c, s, false);
    const commands = result.flatMap(o => o.steps[0] ? [o.steps[0].command] : []);
    for (const cmd of actions(c, s, false)) expect(commands).toContainEqual(cmd);
    expect(result.some(o => o.class === 'control')).toBe(true);
    expect(result.some(o => o.class.endsWith('/core'))).toBe(true);
    expect(result.some(o => o.class.endsWith('/weapon-arm'))).toBe(true);
    expect(s).toEqual(saved);
  });
  it('enumerates order-dependent joint openings and witnesses replay through the core', () => {
    const c = fixture(); const s = createFight(c, { encounterId: 'beast', party: ['ugallu', 'anzu'], start: 'fresh' });
    const saved = structuredClone(s); const result = openings(c, s, true);
    expect(result.some(o => o.steps.some(x => x.command.kind === 'act' && x.command.actor === 'anzu') && o.steps[0]?.command.kind === 'act' && o.steps[0].command.actor === 'ugallu')).toBe(true);
    expect(result.some(o => o.steps[0]?.command.kind === 'act' && o.steps[0].command.actor === 'anzu')).toBe(true);
    for (const o of result) {
      let replay = s;
      for (const step of o.steps) { const r = applyCommand(c, replay, step.command); expect(r.ok).toBe(true); replay = r.state; }
      expect(replay).toEqual(o.state);
    }
    expect(s).toEqual(saved);
  });
  it('uses content-defined single-action exact breakpoints and scans every numeric leaf at four deltas', () => {
    const c = fixture(); c.enemies[0]!.parts.find(p => p.id === 'weapon-arm')!.pool = 7;
    const before = structuredClone(c); const report = breakpoints(c);
    expect(report.baseline.some(b => b.action === 'claw' && b.target.endsWith('/weapon-arm') && b.exact)).toBe(true);
    expect(report.variants).toHaveLength(report.numbers * 4);
    expect(report.variants.some(v => !v.valid)).toBe(true);
    expect(report.variants.filter(v => v.path === '/fightSalveUses').map(v => v.delta)).toEqual([-2, -1, 1, 2]);
    expect(c).toEqual(before);
  }, 20000);
  it('all fixed policies produce legal replayable commands and preserve inputs', () => {
    const c = fixture(); const s = createFight(c, { encounterId: 'warden', party: ['ugallu', 'girtablilu', 'anzu'], start: 'fresh' });
    const saved = structuredClone(s);
    for (const policy of POLICIES) {
      const result = policyLine(c, s, policy, 3); let state = s;
      for (const step of result.steps) { const r = applyCommand(c, state, step.command); expect(r.ok).toBe(true); state = r.state; }
      expect(state).toEqual(result.state);
    }
    expect(s).toEqual(saved);
  });
  it('Revoke-every-Saw revokes a declared Saw before other actors can remove its source', () => {
    const c = fixture();
    const s = createFight(c, { encounterId: 'warden', party: ['ugallu', 'anzu'], start: 'fresh' });
    const saw = s.intents.find(i => i.kind === 'saw')!;
    expect(saw).toBeDefined();
    const result = policyLine(c, s, 'Revoke-every-Saw', 2);
    expect(result.steps[0]!.command).toMatchObject({ kind: 'act', actor: 'anzu', action: 'revoke', target: { intent: saw.id } });
  });
  it('the same small sweep produces identical output and includes the heuristic caveat and metrics', () => {
    const c = fixture(); const before = structuredClone(c);
    const options = { width: 2, depth: 2, soloDepth: 1, probeWidth: 1 };
    const selected = { parties: [['ugallu'] as const].map(p => [...p]), encounters: ['guard' as const], starts: ['fresh' as const], gauntlet: false, probeEncounter: 'guard' as const };
    const a = sweep(c, options, selected), b = sweep(c, options, selected);
    expect(formatReport(a)).toBe(formatReport(b));
    expect(formatReport(a)).toContain('heuristic search; a loss means no win was found');
    expect(a.cells[0]!.result.survivingHp.ugallu).toBeGreaterThan(0);
    expect(a.cells[0]!.result.salvesUsed).toBe(0); expect(c).toEqual(before);
  });
  it('probe compares policies with the best searched opening and reports every part class', () => {
    const c = fixture();
    const report = probe(c, 'guard', { width: 1, depth: 1, soloDepth: 0, probeWidth: 1 });
    for (const opening of report.openings) {
      expect(opening.classes.map(c => c.class)).toEqual(expect.arrayContaining(['control', 'mixed', 'celestial-guard#1/core', 'celestial-guard#1/weapon-arm', 'celestial-guard#1/restraining-limb']));
      if (opening.salves && opening.best) {
        const cell = report.cells.find(cell => cell.id === `${opening.party.join('+')}/guard/fresh`)!;
        expect(cell.result.outcome).toBe('victory');
        expect(cell.result.hp).toBeGreaterThanOrEqual(opening.best.result.hp);
      }
    }
  });
  it('covers every nonempty party, encounter and start plus one gauntlet per party', () => {
    const c = fixture();
    const report = sweep(c, { width: 1, depth: 1, soloDepth: 0 }, { probeEncounter: null });
    const partyCount = (1 << c.brood.length) - 1;
    expect(report.cells).toHaveLength(partyCount * (c.encounters.length * c.starts.length + 1));
    expect(new Set(report.cells.map(cell => cell.id)).size).toBe(report.cells.length);
    expect(report.cells.filter(cell => cell.encounter === 'gauntlet')).toHaveLength(partyCount);
    for (const encounter of c.encounters) for (const start of c.starts) {
      expect(report.cells.filter(cell => cell.encounter === encounter.id && cell.id.endsWith('/' + start.id))).toHaveLength(partyCount);
    }
  });
  it('metrics count actor-specific shares, declarations and cleanup through public events', () => {
    const c = fixture(); const s = initial(c); const result = search(c, s, { width: 2, depth: 2, soloDepth: 0 });
    const m = metrics(s, result);
    expect(Object.values(m.actionShares).reduce((a, b) => a + b, 0)).toBe(1);
    expect(m.hp).toBe(result.hp); expect(m.cleanup).toBe(0);
  });
});

describe('Q04 A2-12 calculations with constructed outcomes', () => {
  it('dominance requires six parties with a ten-HP gap, counting no-win parties against it', () => {
    const cases = Array.from({ length: 7 }, (_, i) => group(i, i < 6 ? [fake(30, 'enemy/core'), fake(20, 'control')] : [fake(0, 'control', false)]));
    expect(openingSignals(cases).find(s => s.name === 'dominance')!.flag).toBe(true);
    cases[0]!.results[1]!.result.hp = 21;
    expect(openingSignals(cases).find(s => s.name === 'dominance')!.flag).toBe(false);
  });
  it('indifference compares every winning opening with the best, ignoring losses', () => {
    const g = group(0, [fake(31, 'core'), fake(29, 'control'), fake(0, 'mixed', false)]);
    expect(openingSignals([g]).find(s => s.name === 'indifference')!.flag).toBe(true);
    g.results.push(fake(28, 'core'));
    expect(openingSignals([g]).find(s => s.name === 'indifference')!.flag).toBe(false);
  });
  it('policy matches use the 10% boundary, both lose, and do not mistake a loss for a win', () => {
    expect(policyMatches(fake(50, '').result, fake(45, '').result)).toBe(true);
    expect(policyMatches(fake(50, '').result, fake(44, '').result)).toBe(false);
    expect(policyMatches(fake(0, '', false).result, fake(0, '', false).result)).toBe(true);
    expect(policyMatches(fake(50, '').result, fake(50, '', false).result)).toBe(false);
  });
  it('headless harness has no renderer, audio, browser global or other prototype import', () => {
    const root = join(import.meta.dirname, '../src/harness');
    const files = (path: string): string[] => readdirSync(path, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(join(path, e.name)) : [join(path, e.name)]);
    for (const file of files(root)) {
      const code = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, '');
      expect(code).not.toMatch(/(?:from\s*|import\s*\()['"`](?:phaser|[^'"`]*(?:\/view\/|\/audio\/|poc-001|shared\/))/);
      expect(code).not.toMatch(/\b(?:window|document|navigator|localStorage|HTMLCanvasElement)\b/);
    }
  });
});
