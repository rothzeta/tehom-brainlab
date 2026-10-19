import type { ActionId, BattleState, BroodId, Command } from '../core';
import { harmlessDeclaration, openingClass } from './search';
import type { Line } from './search';
import type { Policy } from './policies';
export interface Metrics {
  outcome: Line['outcome']; hp: number; maxHp: number; rounds: number; fightRounds: number[];
  survivingHp: Partial<Record<BroodId, number>>; salvesUsed: number;
  actions: Partial<Record<BroodId, Partial<Record<ActionId, number>>>>; actionShares: Record<string, number>;
  openingClass: string; disablingFirst: boolean | null; saws: number; revokedSaws: number; cleanup: number;
}
export function metrics(initial: BattleState, line: Line): Metrics {
  const actions: Metrics['actions'] = {}; const saws = new Set<string>(), revoked = new Set<string>();
  const fightRounds = new Map<number, number>(); const harmless = new Map<number, number>(); let cleanup = 0;
  const observe = (s: BattleState) => {
    fightRounds.set(s.fightIndex, Math.max(fightRounds.get(s.fightIndex) ?? 0, s.round));
    for (const i of s.intents) if (i.kind === 'saw') saws.add(`${s.fightIndex}:${i.id}`);
    if (s.phase === 'player' && harmlessDeclaration(s) && !harmless.has(s.fightIndex)) harmless.set(s.fightIndex, s.round);
  };
  observe(initial);
  let firstG: Metrics['disablingFirst'] = null;
  for (const step of line.steps) {
    if (step.command.kind === 'continue' || step.state.round > step.before.round) observe(step.state);
    const cmd = step.command;
    if (cmd.kind === 'act') {
      const counts = actions[cmd.actor] ??= {}; counts[cmd.action] = (counts[cmd.action] ?? 0) + 1;
      if (cmd.actor === 'girtablilu' && firstG === null) {
        const t = cmd.target;
        firstG = cmd.action === 'pincer' && !!t && 'part' in t && step.before.enemies.find(e => e.id === t.enemy)!.parts.find(p => p.id === t.part)!.kind === 'component';
      }
    }
    for (const e of step.events) {
      if (e.kind === 'intent-cancelled' && e.reason === 'revoked' && step.before.intents.find(i => i.id === e.intent)?.kind === 'saw') revoked.add(`${step.before.fightIndex}:${e.intent}`);
      if (e.kind === 'combat-ended' && e.outcome === 'victory') {
        fightRounds.set(e.fightIndex, step.before.round);
        cleanup = Math.max(cleanup, harmless.has(e.fightIndex) ? step.before.round - harmless.get(e.fightIndex)! : 0);
      }
    }
  }
  const actionShares: Record<string, number> = {};
  for (const [actor, counts] of Object.entries(actions)) {
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    for (const [action, count] of Object.entries(counts)) actionShares[`${actor}/${action}`] = count / total;
  }
  return { outcome: line.outcome, hp: line.hp, maxHp: initial.party.reduce((n, b) => n + b.maxHp, 0), rounds: line.rounds,
    fightRounds: [...fightRounds.values()], survivingHp: Object.fromEntries(line.state.party.map(b => [b.id, b.hp])),
    salvesUsed: initial.salveUses - line.state.salveUses, actions, actionShares,
    openingClass: openingClass(line.steps.filter(s => s.before.fightIndex === initial.fightIndex && s.before.round === initial.round && s.command.kind === 'act')),
    disablingFirst: firstG, saws: saws.size, revokedSaws: revoked.size, cleanup };
}
export interface OpeningResult { opening: { class: string; commands: Command[] }; result: Metrics }
export interface PartyOpenings { cell: string; party: BroodId[]; encounter: string; salves: boolean; results: OpeningResult[] }
export interface Signal { name: string; flag: boolean; value: string; cells: string[] }
const wins = (m: Metrics) => m.outcome === 'victory';
export function openingSignals(groups: PartyOpenings[]): Signal[] {
  const dominating: string[] = [], indifferent: string[] = [], coreBest: string[] = [];
  const encounterClasses = new Map<string, Map<string, string[]>>();
  for (const g of groups) {
    const winning = g.results.filter(r => wins(r.result)); if (!winning.length) continue;
    const best = Math.max(...winning.map(r => r.result.hp));
    if (winning.every(r => best - r.result.hp <= 2)) indifferent.push(g.cell);
    const classes = new Map<string, number>();
    for (const r of winning) classes.set(r.opening.class, Math.max(classes.get(r.opening.class) ?? -1, r.result.hp));
    for (const [cls, value] of classes) if (value === best && [...classes].every(([other, v]) => other === cls || best - v >= 10)) {
      const encounter = `${g.encounter}/salves=${g.salves}`;
      const map = encounterClasses.get(encounter) ?? new Map<string, string[]>();
      map.set(cls, [...(map.get(cls) ?? []), g.cell]); encounterClasses.set(encounter, map);
    }
    if (!g.salves && g.party.length > 1 && [...classes].some(([cls, v]) => cls.endsWith('/core') && v === best)) coreBest.push(g.cell);
  }
  for (const [encounter, classes] of encounterClasses) for (const [cls, cells] of classes) if (new Set(cells).size >= 6) dominating.push(`${encounter}:${cls} [${cells.join(', ')}]`);
  return [
    { name: 'dominance', flag: dominating.length > 0, value: `${dominating.length} encounter/class groups meet 6-of-7 and 10-HP gap`, cells: dominating },
    { name: 'indifference', flag: indifferent.length > 0, value: `${indifferent.length} cells: every winning opening within 2 HP`, cells: indifferent },
    { name: 'core-best-without-Salves', flag: coreBest.length > 0, value: `${coreBest.length} multi-Brood cells have a core class tied for best`, cells: coreBest },
  ];
}
export interface Cell { id: string; party: BroodId[]; encounter: string; result: Metrics; policies: Partial<Record<Policy, Metrics>> }
export function sweepSignals(cells: Cell[]): Signal[] {
  const signals: Signal[] = [];
  const add = (name: string, selected: Cell[], value: string) => signals.push({ name, flag: selected.length > 0, value, cells: selected.map(c => c.id) });
  const g = cells.filter(c => c.party.includes('girtablilu') && wins(c.result));
  add('disabling-first', g.length && g.every(c => c.result.disablingFirst) ? g : [], `${g.filter(c => c.result.disablingFirst).length}/${g.length} winning Girtablilu lines open with component Pincer`);
  const a = cells.filter(c => c.party.includes('anzu') && wins(c.result) && c.result.saws > 0);
  add('Revoke-every-Saw', a.length && a.every(c => c.result.saws === c.result.revokedSaws) ? a : [], `${a.reduce((n, c) => n + c.result.revokedSaws, 0)}/${a.reduce((n, c) => n + c.result.saws, 0)} declared Saws revoked in winning Anzu lines`);
  for (const policy of ['always-disable', 'always-core', 'poison-then-Guard', 'Rapture-as-soon-as-possible', 'never-use-Revelation-skills', 'Revoke-every-Saw'] as Policy[]) {
    const applicable = cells.filter(c => c.policies[policy]);
    const matched = applicable.filter(c => policyMatches(c.result, c.policies[policy]!));
    signals.push({ name: `policy-matches-search/${policy}`, flag: applicable.length > 0 && matched.length / applicable.length >= 0.75,
      value: `${matched.length}/${applicable.length} cells match (threshold 75%)`, cells: matched.map(c => c.id) });
  }
  for (const [brood, action] of [['girtablilu', 'pincer'], ['ugallu', 'hold-the-threshold'], ['anzu', 'guard']] as const) {
    const relevant = cells.filter(c => c.party.includes(brood));
    let total = 0, used = 0;
    for (const cell of relevant) { const counts = cell.result.actions[brood] ?? {}; total += Object.values(counts).reduce((a, b) => a + b, 0); used += counts[action] ?? 0; }
    signals.push({ name: `rare-action/${brood}/${action}`, flag: total > 0 && used / total < 0.05,
      value: `${used}/${total} actions (${total ? (100 * used / total).toFixed(2) : '0.00'}%; threshold <5%)`, cells: relevant.map(c => c.id) });
  }
  add('more-than-10-rounds', cells.filter(c => c.party.length > 1 && wins(c.result) && c.result.fightRounds.some(r => r > 10)), 'winning duo/trio fights longer than 10 rounds');
  add('cleanup', cells.filter(c => wins(c.result) && c.result.cleanup > 2), 'winning lines with cleanup >2 rounds');
  const trio = cells.filter(c => c.encounter === 'gauntlet' && c.party.length === 3);
  add('trio-gauntlet-loses', trio.filter(c => !wins(c.result)), trio.map(c => `${c.id}=${c.result.hp}/${c.result.maxHp}, ${c.result.outcome}`).join('; ') || 'no trio cells');
  const duos = cells.filter(c => c.encounter === 'gauntlet' && c.party.length === 2);
  add('duo-gauntlet-margins', duos.length === 3 && duos.every(c => wins(c.result) && c.result.hp / c.result.maxHp > 0.6) ? duos : [], duos.map(c => `${c.id}=${c.result.hp}/${c.result.maxHp}, ${c.result.outcome}`).join('; ') || 'no duo cells');
  const solo = cells.filter(c => c.encounter === 'warden' && c.party.join() === 'ugallu' && c.id.endsWith('/fresh'));
  add('solo-Ugallu-Warden-route', solo.filter(c => !wins(c.result)), solo.map(c => `${c.id}=${c.result.outcome}`).join('; ') || 'not sampled');
  signals.push({ name: 'H4-intent-predictability', flag: false, value: 'human test required', cells: [] }, { name: 'H6-component-usability', flag: false, value: 'human test required', cells: [] });
  return signals;
}
export function policyMatches(best: Metrics, policy: Metrics): boolean {
  return !wins(best) && !wins(policy) || wins(best) && wins(policy) && policy.hp >= best.hp * 0.9;
}
