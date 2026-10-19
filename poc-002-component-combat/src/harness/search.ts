/** Headless diagnostic search. Rules and legal targets come only from the public core API. */
import { applyCommand, legalActions } from '../core';
import type { BattleState, Command, Content, Event } from '../core';

export interface SearchOptions { width: number; depth: number; soloDepth: number; salves: boolean }
export const DEFAULT_SEARCH: SearchOptions = { width: 200, depth: 30, soloDepth: 4, salves: true };
export interface Step { before: BattleState; command: Command; events: Event[]; state: BattleState }
interface Node { state: BattleState; parent: Node | null; step: Step | null; rounds: number; turns: number }
export interface Line { state: BattleState; steps: Step[]; rounds: number; outcome: 'victory' | 'no-win-found'; hp: number }
export const hp = (s: BattleState): number => s.party.reduce((n, b) => n + b.hp, 0);
const living = (s: BattleState) => s.enemies.filter(e => e.parts.some(p => p.kind === 'body' && p.pool > 0));
export function actions(c: Content, s: BattleState, salves: boolean): Command[] {
  return legalActions(c, s).map(a => a.command).filter(a => salves || a.kind !== 'act' || a.action !== 'salve');
}
function advance(c: Content, n: Node, command: Command): Node {
  const r = applyCommand(c, n.state, command);
  if (!r.ok) throw new Error(`Harness issued rejected command: ${r.error.code}`);
  return { state: r.state, parent: n, step: { before: n.state, command, events: r.events, state: r.state },
    rounds: n.rounds + (command.kind === 'continue' || r.state.round > n.state.round ? 1 : 0),
    turns: n.turns + (command.kind === 'endPhase' ? 1 : 0) };
}
/** Revision is transport accounting, not a combat choice. States within a search
 * layer have identical round budgets; deduplication keeps the first witness. */
export function stateKey(s: BattleState): string { return JSON.stringify({ ...s, revision: 0 }); }
function score(c: Content, n: Node): number {
  const s = n.state;
  // Heuristic only: reward progress, survival and retained consumables. Never changes a rule.
  let progress = 0;
  for (const e of s.enemies) {
    const def = c.enemies.find(d => d.id === e.definitionId)!;
    for (const p of e.parts) {
      const max = def.parts.find(x => x.id === p.id)!.pool;
      progress += (max - p.pool) * (p.kind === 'body' ? 2 : 0.7);
      if (p.pool === 0) progress += p.kind === 'body' ? 20 : 8;
    }
    progress += e.poison * 2;
  }
  return s.fightIndex * 10000 + (s.phase === 'between-fights' ? 5000 : 0) + hp(s) * 3 + s.salveUses * 6 + progress;
}
function better(a: Node, b: Node): boolean {
  const av = a.state.phase === 'victory', bv = b.state.phase === 'victory';
  return av !== bv ? av : hp(a.state) !== hp(b.state) ? hp(a.state) > hp(b.state) : a.rounds < b.rounds;
}
function line(n: Node): Line {
  const steps: Step[] = []; let cursor: Node | null = n;
  while (cursor?.step) { steps.push(cursor.step); cursor = cursor.parent; }
  return { state: n.state, steps: steps.reverse(), rounds: n.rounds, hp: hp(n.state), outcome: n.state.phase === 'victory' ? 'victory' : 'no-win-found' };
}
export function search(c: Content, initial: BattleState, options: Partial<SearchOptions> = {}): Line {
  const o = { ...DEFAULT_SEARCH, ...options };
  for (const [name, value] of [['width', o.width], ['depth', o.depth], ['soloDepth', o.soloDepth]] as const)
    if (!Number.isSafeInteger(value) || value < (name === 'soloDepth' ? 0 : 1)) throw new Error(`Invalid ${name}`);
  if (o.soloDepth > 4) throw new Error('soloDepth must be at most 4');
  const root: Node = { state: initial, parent: null, step: null, rounds: initial.round, turns: 0 };
  let best = root; let beam = [root];
  const maxCommands = o.depth * (initial.party.length + 2) * initial.run.encounters.length;
  // Exhaustive solo prefix: no beam pruning for four completed player phases.
  // Transpositions are equivalent combat states; they do not remove distinct futures.
  if (initial.party.length === 1 && o.soloDepth > 0) {
    const frontier = new Map<string, Node>(); const seen = new Set<string>();
    const visit = (n: Node) => {
      if (n.state.phase === 'victory' || n.state.phase === 'defeat') { if (better(n, best)) best = n; return; }
      if (n.turns >= Math.min(o.soloDepth, o.depth) || n.state.phase === 'between-fights') { frontier.set(stateKey(n.state), n); return; }
      const key = `${n.turns}:${stateKey(n.state)}`; if (seen.has(key)) return; seen.add(key);
      for (const command of actions(c, n.state, o.salves)) visit(advance(c, n, command));
    };
    visit(root); beam = [...frontier.values()].sort((a, b) => score(c, b) - score(c, a)).slice(0, o.width);
  }
  for (let layer = 0; layer < maxCommands && beam.length; layer++) {
    const candidates = new Map<string, Node>();
    for (const n of beam) {
      if (n.state.phase === 'victory' || n.state.phase === 'defeat') { if (better(n, best)) best = n; continue; }
      if (n.state.round > o.depth) { if (better(n, best)) best = n; continue; }
      for (const cmd of actions(c, n.state, o.salves)) {
        const next = advance(c, n, cmd);
        if (next.state.phase === 'victory') { if (better(next, best)) best = next; continue; }
        if (next.state.phase === 'defeat') continue;
        const key = stateKey(next.state); if (!candidates.has(key)) candidates.set(key, next);
      }
    }
    beam = [...candidates.values()].sort((a, b) => score(c, b) - score(c, a)).slice(0, o.width);
    if (beam[0] && best.state.phase !== 'victory' && score(c, beam[0]) > score(c, best)) best = beam[0];
  }
  return line(best);
}

export interface Opening { key: string; class: string; steps: Step[]; state: BattleState }
export function openingClass(steps: readonly Step[]): string {
  const parts = new Set<string>();
  for (const step of steps) for (const e of step.events) if (e.kind === 'part-damaged' && e.source.kind === 'action' && e.damage.applied > 0) {
    const p = step.before.enemies.find(x => x.id === e.target.enemy)!.parts.find(x => x.id === e.target.part)!;
    parts.add(`${e.target.enemy}/${p.kind === 'body' ? 'core' : p.id}`);
  }
  return parts.size === 0 ? 'control' : parts.size > 1 ? 'mixed' : [...parts][0]!;
}
/** Enumerate all orders, including forfeited actions. Collapse only commuting
 * openings with the same choices, class AND resulting state. */
export function openings(c: Content, initial: BattleState, salves: boolean): Opening[] {
  const found = new Map<string, Opening>();
  const seen = new Set<string>();
  const visit = (n: Node, choices: string[]) => {
    const cls = openingClass(line(n).steps);
    const key = `${choices.slice().sort().join('|')}:${cls}:${stateKey(n.state)}`;
    if (seen.has(key)) return; seen.add(key);
    if (n.state.phase !== 'player' || n.state.round !== initial.round) {
      found.set(key, { key, class: cls, steps: line(n).steps, state: n.state }); return;
    }
    for (const cmd of actions(c, n.state, salves)) {
      const choice = cmd.kind === 'act' ? JSON.stringify({ actor: cmd.actor, action: cmd.action, target: cmd.target }) : cmd.kind;
      visit(advance(c, n, cmd), [...choices, choice]);
    }
  };
  visit({ state: initial, parent: null, step: null, rounds: initial.round, turns: 0 }, []);
  return [...found.values()];
}
export function joinOpening(opening: Opening, continuation: Line): Line {
  return { ...continuation, steps: [...opening.steps, ...continuation.steps] };
}
export function harmlessDeclaration(s: BattleState): boolean {
  const ids = new Set(living(s).map(e => e.id));
  return !s.intents.some(i => ids.has(i.enemy) && i.amount > 0);
}
