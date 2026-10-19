import { createFight, createGauntlet } from '../core';
import type { BroodId, Content, EncounterId, StartPreset } from '../core';
import { DEFAULT_SEARCH, joinOpening, openings, search, stateKey } from './search';
import type { Line, SearchOptions } from './search';
import { POLICIES, policyApplies, policyLine } from './policies';
import { metrics, openingSignals, sweepSignals } from './signals';
import type { Cell, Metrics, OpeningResult, PartyOpenings, Signal } from './signals';
import { breakpoints } from './breakpoints';
import type { BreakpointReport } from './breakpoints';
export const CAVEAT = 'heuristic search; a loss means no win was found';
export function parties(c: Content): BroodId[][] {
  const result: BroodId[][] = [];
  for (let mask = 1; mask < 1 << c.brood.length; mask++) result.push(c.brood.filter((_, i) => mask & (1 << i)).map(b => b.id));
  return result;
}
export interface HarnessOptions extends SearchOptions { probeWidth: number }
export const DEFAULT_OPTIONS: HarnessOptions = { ...DEFAULT_SEARCH, probeWidth: 1 };
export interface OpeningSummary { cell: string; party: BroodId[]; encounter: string; salves: boolean; count: number; wins: number; best: OpeningResult | null; classes: { class: string; best: OpeningResult | null; hpGap: number | null }[]; results: OpeningResult[] }
export interface Report { kind: 'sweep' | 'probe'; caveat: string; contentVersion: string; options: HarnessOptions; openingCoverage: string; cells: Cell[]; openings: OpeningSummary[]; signals: Signal[]; breakpoints?: BreakpointReport }
function cell(c: Content, party: BroodId[], encounter: EncounterId | 'gauntlet', start: StartPreset, o: HarnessOptions): Cell {
  const initial = encounter === 'gauntlet' ? createGauntlet(c, { party }) : createFight(c, { encounterId: encounter, party, start });
  const result = search(c, initial, o);
  const policies: Cell['policies'] = {};
  for (const p of POLICIES) if (policyApplies(p, initial)) policies[p] = metrics(initial, policyLine(c, initial, p, o.depth, o.salves));
  return { id: `${party.join('+')}/${encounter}/${start}`, party, encounter, result: metrics(initial, result), policies };
}
/** All joint openings get a continuation search. Cache only identical complete
 * combat states, with revision rebasing of the returned witness on cache hits. */
export function probeOpenings(c: Content, encounter: EncounterId, o: HarnessOptions, selectedParties = parties(c)): PartyOpenings[] {
  const groups: PartyOpenings[] = [];
  for (const party of selectedParties) for (const salves of [false, true]) {
    const initial = createFight(c, { encounterId: encounter, party, start: 'fresh' });
    const cache = new Map<string, Line>(); const results: OpeningResult[] = [];
    for (const opening of openings(c, initial, salves)) {
      const key = stateKey(opening.state);
      let continuation = cache.get(key);
      if (!continuation) {
        continuation = search(c, opening.state, { ...o, width: o.probeWidth, soloDepth: 0, salves }); cache.set(key, continuation);
      }
      // Cached commands have revisions from their original equivalent state.
      // Metrics use actions/events only; keep all witness revisions internally consistent.
      const offset = opening.state.revision - (continuation.steps[0]?.before.revision ?? continuation.state.revision);
      const rebased = offset === 0 ? continuation : { ...continuation,
        state: { ...continuation.state, revision: continuation.state.revision + offset },
        steps: continuation.steps.map(step => ({ ...step, before: { ...step.before, revision: step.before.revision + offset }, command: { ...step.command, expectedRevision: step.command.expectedRevision + offset }, state: { ...step.state, revision: step.state.revision + offset } })) };
      results.push({ opening: { class: opening.class, commands: opening.steps.map(s => s.command) }, result: metrics(initial, joinOpening(opening, rebased)) });
    }
    groups.push({ cell: `${party.join('+')}/${encounter}/fresh/salves=${salves}`, party, encounter, salves, results });
  }
  return groups;
}
function includeOpeningBests(cells: Cell[], groups: PartyOpenings[]): void {
  for (const group of groups) {
    if (!group.salves) continue;
    const target = cells.find(cell => cell.id === `${group.party.join('+')}/${group.encounter}/fresh`);
    if (!target) continue;
    for (const { result } of group.results) {
      if (result.outcome === 'victory' && (target.result.outcome !== 'victory' || result.hp > target.result.hp || result.hp === target.result.hp && result.rounds < target.result.rounds)) target.result = result;
    }
  }
}
function summaries(c: Content, groups: PartyOpenings[]): OpeningSummary[] {
  const best = (results: OpeningResult[]) => results.filter(r => r.result.outcome === 'victory').sort((a, b) => b.result.hp - a.result.hp || a.result.rounds - b.result.rounds)[0] ?? null;
  return groups.map(g => {
    const winner = best(g.results);
    const initial = createFight(c, { encounterId: g.encounter as EncounterId, party: g.party, start: 'fresh' });
    const classes = ['control', 'mixed', ...initial.enemies.flatMap(e => e.parts.map(p => `${e.id}/${p.kind === 'body' ? 'core' : p.id}`))];
    return { ...g, count: g.results.length, wins: g.results.filter(r => r.result.outcome === 'victory').length, best: winner,
      classes: [...new Set(classes)].sort().map(cls => {
        const result = best(g.results.filter(r => r.opening.class === cls));
        return { class: cls, best: result, hpGap: result && winner ? winner.result.hp - result.result.hp : null };
      }) };
  });
}
export interface SweepSelection { parties?: BroodId[][]; encounters?: EncounterId[]; starts?: StartPreset[]; gauntlet?: boolean; probeEncounter?: EncounterId | null }
export function sweep(c: Content, options: Partial<HarnessOptions> = {}, selection: SweepSelection = {}): Report {
  const o = { ...DEFAULT_OPTIONS, ...options }; const chosen = selection.parties ?? parties(c); const cells: Cell[] = [];
  for (const party of chosen) {
    for (const encounter of selection.encounters ?? c.encounters.map(e => e.id)) for (const start of selection.starts ?? c.starts.map(s => s.id)) cells.push(cell(c, party, encounter, start, o));
    if (selection.gauntlet !== false) cells.push(cell(c, party, 'gauntlet', c.gauntlets[0]!.start, o));
  }
  const encounter = selection.probeEncounter === undefined ? 'warden' : selection.probeEncounter;
  const groups = encounter ? probeOpenings(c, encounter, o, chosen) : [];
  includeOpeningBests(cells, groups);
  return { kind: 'sweep', caveat: CAVEAT, contentVersion: c.contentVersion, options: o, cells, openings: summaries(c, groups), signals: [...openingSignals(groups), ...sweepSignals(cells)],
    openingCoverage: encounter ? `Every distinct joint round-1 opening for ${encounter}, fresh, with/without Salves; other encounters are beam samples.` : 'Opening enumeration not requested.' };
}
export function probe(c: Content, encounter: EncounterId = 'warden', options: Partial<HarnessOptions> = {}, scan = false): Report {
  const o = { ...DEFAULT_OPTIONS, ...options };
  if (!c.encounters.some(e => e.id === encounter)) throw new Error(`Unknown encounter ${encounter}`);
  const groups = probeOpenings(c, encounter, o); const cells: Cell[] = [];
  for (const party of parties(c)) {
    cells.push(cell(c, party, encounter, 'fresh', o));
    cells.push(cell(c, party, 'gauntlet', c.gauntlets[0]!.start, o));
  }
  includeOpeningBests(cells, groups);
  return { kind: 'probe', caveat: CAVEAT, contentVersion: c.contentVersion, options: o, cells, openings: summaries(c, groups), signals: [...openingSignals(groups), ...sweepSignals(cells)],
    openingCoverage: `Every distinct joint round-1 opening for ${encounter}, fresh, with/without Salves. All action orders and forfeitures; commuting equivalents collapsed.`, ...(scan ? { breakpoints: breakpoints(c) } : {}) };
}
function resultText(m: Metrics): string {
  return `${m.outcome} rounds=${m.rounds} fight-rounds=${m.fightRounds.join(',')} hp=${m.hp}/${m.maxHp} surviving=${JSON.stringify(m.survivingHp)} salves-used=${m.salvesUsed} actions=${JSON.stringify(m.actionShares)}`;
}
function openingText(r: OpeningResult | null): string {
  return r ? `${resultText(r.result)} opening=${JSON.stringify(r.opening.commands)}` : 'no win found';
}
export function formatReport(report: Report): string {
  const lines = [`Q04 ${report.kind} content=${report.contentVersion}`, report.caveat,
    `beam width=${report.options.width}, depth=${report.options.depth} rounds per fight; exhaustive solo prefix=${report.options.soloDepth} completed rounds; probe continuation width=${report.options.probeWidth}`,
    'Objective: winning surviving HP, then fewer rounds. Beam priority: fight progress, HP, retained Salves and damage. Stable generation order breaks ties.',
    'No-win HP and actions describe the best unfinished candidate, not a winning margin. Flags report evidence, not balance gates.',
    'Policies: roster order; full-value Salves first; disable targets lowest-pool component, core targets life; poison then Guard refreshes when poison is zero; Rapture maximizes own cost until transformed then attacks; never-Revelation excludes positive costs; Revoke-every-Saw prioritizes Anzu before other actions.',
    report.openingCoverage];
  for (const cell of report.cells) {
    lines.push(`CELL ${cell.id} ${resultText(cell.result)}`);
    for (const [policy, result] of Object.entries(cell.policies)) lines.push(`POLICY ${cell.id} ${policy} ${resultText(result)}`);
  }
  for (const group of report.openings) {
    lines.push(`OPENINGS ${group.cell} count=${group.count} wins=${group.wins} best=${openingText(group.best)}`);
    for (const cls of group.classes) lines.push(`CLASS ${group.cell} ${cls.class} hp-gap=${cls.hpGap ?? 'lost'} ${openingText(cls.best)}`);
  }
  for (const signal of report.signals) lines.push(`${signal.flag ? 'FLAG' : 'ok'} ${signal.name}: ${signal.value}; cells=${signal.cells.join('; ') || 'none'}`);
  if (report.breakpoints) {
    const b = report.breakpoints;
    lines.push(`BREAKPOINTS fresh untransformed declarations: ${b.numbers} numbers; ${b.variants.length} independent variants; ${b.variants.filter(v => v.valid).length} valid; ${b.variants.filter(v => !v.valid).length} rejected by content validation`);
    for (const hit of b.baseline) lines.push(`${hit.exact ? 'FLAG exact-destruction' : 'ok one-shot-overkill'} ${JSON.stringify(hit)}`);
    for (const variant of b.variants) lines.push(`VARIANT ${variant.path} delta=${variant.delta} value=${variant.value} ${variant.valid ? `exact=${JSON.stringify(variant.exact)}` : `rejected=${variant.reason}`}`);
  }
  return lines.join('\n') + '\n';
}
