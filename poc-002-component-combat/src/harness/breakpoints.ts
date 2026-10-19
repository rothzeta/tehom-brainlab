import { applyCommand, createFight, legalActions, loadContent } from '../core';
import type { Content } from '../core';
export interface Breakpoint { cell: string; actor: string; action: string; target: string; exact: boolean }
export interface NumericVariant { path: string; delta: number; value: number; valid: boolean; reason?: string; exact: Breakpoint[] }
export interface BreakpointReport { baseline: Breakpoint[]; numbers: number; variants: NumericVariant[] }
function hits(c: Content): Breakpoint[] {
  const result: Breakpoint[] = [];
  for (const encounter of c.encounters) {
    const s = createFight(c, { encounterId: encounter.id, party: c.brood.map(b => b.id), start: 'fresh' });
    for (const { command } of legalActions(c, s)) {
      if (command.kind !== 'act') continue;
      const r = applyCommand(c, s, command); if (!r.ok) continue;
      for (const e of r.events) if (e.kind === 'part-damaged' && e.source.kind === 'action') {
        const p = s.enemies.find(x => x.id === e.target.enemy)!.parts.find(x => x.id === e.target.part)!;
        if (e.remaining === 0) result.push({ cell: encounter.id, actor: command.actor, action: command.action, target: `${e.target.enemy}/${e.target.part}`,
          exact: e.damage.raw - e.damage.armor - e.damage.ward === p.pool });
      }
    }
  }
  return result;
}
/** Each numeric leaf is changed independently. Invalid schema/domain variants
 * are reported, never clamped or silently skipped. This scans initial fresh
 * untransformed one-action breakpoints, including declaration-time Wards. */
export function breakpoints(content: Content): BreakpointReport {
  const leaves: { path: (string | number)[]; value: number }[] = [];
  const walk = (v: unknown, path: (string | number)[]) => {
    if (typeof v === 'number') leaves.push({ path, value: v });
    else if (Array.isArray(v)) v.forEach((x, i) => walk(x, [...path, i]));
    else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(x, [...path, k]));
  };
  walk(content, []); const variants: NumericVariant[] = [];
  for (const leaf of leaves) for (const delta of [-2, -1, 1, 2]) {
    const copy = structuredClone(content); let parent: any = copy;
    for (const key of leaf.path.slice(0, -1)) parent = parent[key];
    parent[leaf.path.at(-1)!] = leaf.value + delta;
    const variant: NumericVariant = { path: '/' + leaf.path.join('/'), delta, value: leaf.value + delta, valid: false, exact: [] };
    try { const c = loadContent(copy); variant.valid = true; variant.exact = hits(c).filter(h => h.exact); }
    catch (e) { variant.reason = e instanceof Error ? e.message : String(e); }
    variants.push(variant);
  }
  return { baseline: hits(content), numbers: leaves.length, variants };
}
