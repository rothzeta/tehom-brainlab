import { afterEach, expect, it, vi } from 'vitest';
import { parseRecord } from '../src/core';
import type { StartHandler } from '../src/view/select';

const selection = vi.hoisted(() => ({ start: null as StartHandler | null }));
vi.mock('phaser', () => ({ default: { CANVAS: 1, Scale: {}, Game: class { destroy() {} } } }));
vi.mock('../src/audio', () => ({ createAudio: () => ({}) }));
vi.mock('../src/view/battle', () => ({ mountBattle: () => () => {} }));
vi.mock('../src/view/select', () => ({ mountSelect: (_root: unknown, start: StartHandler) => { selection.start = start; return () => {}; } }));
import { mountApp } from '../src/view/app';

// Minimal browser surface: the real app, run mount, session and JSON export run;
// drawing and selection input are replaced at their presentation boundaries.
class Element {
  children: Element[] = [];
  dataset: Record<string, string> = {};
  style = {};
  onclick?: () => void;
  append(...nodes: Element[]) { this.children.push(...nodes); }
  replaceChildren(...nodes: Element[]) { this.children = nodes; }
  setAttribute() {}
  remove() {}
  click() { this.onclick?.(); }
  find(control: string): Element | undefined {
    return this.dataset.control === control ? this : this.children.map(child => child.find(control)).find(Boolean);
  }
}
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); selection.start = null; });

it.each([
  ['selection', 'a'.repeat(40)], ['direct URL', 'b'.repeat(40)],
  ['selection', undefined], ['direct URL', undefined],
] as const)('exports build provenance from %s with revision %s', async (route, revision) => {
  vi.stubEnv('VITE_POC002_BUILD_REVISION', revision);
  vi.stubGlobal('document', { createElement: () => new Element() });
  vi.stubGlobal('location', { pathname: '/', search: route === 'direct URL' ? '?screen=battle&encounter=guard&party=ugallu&start=fresh' : '' });
  const blobs: Blob[] = [];
  vi.spyOn(URL, 'createObjectURL').mockImplementation(blob => { blobs.push(blob as Blob); return 'blob:test'; });
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  const root = new Element();
  const dispose = mountApp(root as unknown as HTMLElement);
  try {
    if (route === 'selection') selection.start!({ kind: 'gauntlet', party: ['ugallu', 'anzu'] });
    const exportButton = root.find('export-record');
    expect(exportButton).toBeDefined(); exportButton!.click();
    expect(blobs).toHaveLength(1);
    expect(parseRecord(await blobs[0]!.text()).buildRevision).toBe(revision ?? 'unknown');
  } finally { dispose(); }
});
