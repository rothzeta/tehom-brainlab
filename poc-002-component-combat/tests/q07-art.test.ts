import { expect, it } from 'vitest';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import rawContent from '../content/combat-content.v1.json';
import { loadContent } from '../src/core/content';
import {
  battleBackground, broodPortrait, EMBLEM_CREDITS, EMBLEM_SOURCES,
  enemyArt, enemyPanel, partAppearance,
} from '../src/view/art';
import type { HitRegion, PartArt } from '../src/view/art';

const content = loadContent(rawContent);
const enemies = content.enemies.map(enemy => [enemy.id, enemy] as const);

function expectContained(inner: HitRegion, outer: HitRegion) {
  for (const value of Object.values(inner)) expect(Number.isFinite(value)).toBe(true);
  expect(inner.width).toBeGreaterThan(0);
  expect(inner.height).toBeGreaterThan(0);
  expect(inner.x).toBeGreaterThanOrEqual(outer.x);
  expect(inner.y).toBeGreaterThanOrEqual(outer.y);
  expect(inner.x + inner.width).toBeLessThanOrEqual(outer.x + outer.width);
  expect(inner.y + inner.height).toBeLessThanOrEqual(outer.y + outer.height);
}

// Q07 acceptance 1: membership comes from content, never a copied part list or
// a tuning snapshot. Tests deliberately permit alternative valid layouts/colors.
it.each(enemies)('%s has labelled, usable art for every content part', (id, enemy) => {
  const art = enemyArt(id);
  const panel = enemyPanel(id);
  expect(Object.keys(art).sort()).toEqual(enemy.parts.map(part => part.id).sort());
  expectContained(panel, { x: 0, y: 0, width: 1280, height: 720 });
  for (const definition of enemy.parts) {
    const part = art[definition.id]!;
    expect(part.partId).toBe(definition.id);
    expect(part.draw.label).toBe(definition.name);
    expect(['rectangle', 'ellipse']).toContain(part.draw.kind);
    expect(part.hitRegion.width).toBeGreaterThanOrEqual(48);
    expect(part.hitRegion.height).toBeGreaterThanOrEqual(48);
    expectContained(part.hitRegion, panel);
    expectContained(part.draw.bounds, part.hitRegion);
  }
});

// Q07 acceptance 2: both axes must intersect to overlap. This allows touching
// edges, but rejects any shared area regardless of draw order or shape type.
it.each(enemies)('%s has no overlapping part hit regions', id => {
  const parts = Object.values(enemyArt(id));
  for (let i = 0; i < parts.length; i++) {
    for (let j = i + 1; j < parts.length; j++) {
      const a = parts[i]!.hitRegion;
      const b = parts[j]!.hitRegion;
      const overlaps = a.x < b.x + b.width && b.x < a.x + a.width
        && a.y < b.y + b.height && b.y < a.y + a.height;
      expect(overlaps, `${parts[i]!.partId} / ${parts[j]!.partId}`).toBe(false);
    }
  }
});

it.each(['tongue', 'inscription-hand'] as const)('%s has a generous region larger than its shape', id => {
  const part = enemyArt('naming-scribe')[id]!;
  expect(part.hitRegion.width).toBeGreaterThan(part.draw.bounds.width);
  expect(part.hitRegion.height).toBeGreaterThan(part.draw.bounds.height);
});

it('uses ordinary 256×384 panels and a larger Warden panel', () => {
  const warden = enemyPanel('warden-of-correct-form');
  for (const enemy of content.enemies.filter(e => e.id !== 'warden-of-correct-form')) {
    const panel = enemyPanel(enemy.id);
    expect(panel.width).toBe(256);
    expect(panel.height).toBe(384);
    expect(warden.width).toBeGreaterThan(panel.width);
    expect(warden.height).toBeGreaterThan(panel.height);
  }
});

const sample: PartArt = {
  partId: 'core', draw: { kind: 'ellipse', label: 'Test core', color: 0xabcdef,
    bounds: { x: 24, y: 35, width: 60, height: 70 } },
  hitRegion: { x: 20, y: 30, width: 70, height: 80 },
};

it.each(['intact', 'destroyed', 'shielded'] as const)('styles %s parts without changing selection geometry', state => {
  const input = structuredClone(sample);
  const draw = partAppearance(input, state);
  expect(input).toEqual(sample);
  expect(draw.bounds).toEqual(sample.draw.bounds);
  expect(draw.kind).toBe(sample.draw.kind);
  expect(draw.label).toContain(sample.draw.label);
  if (state === 'destroyed') {
    expect(draw.label).toContain('destroyed');
    expect(draw.crossedOut).toBe(true);
    expect(draw.alpha).toBeGreaterThan(0);
    expect(draw.alpha).toBeLessThan(1);
  } else if (state === 'shielded') {
    expect(draw.label).toContain('shielded');
    expect(draw.outline?.width).toBeGreaterThan(0);
    expect(draw.crossedOut).not.toBe(true);
  } else {
    expect(draw.label).toBe(sample.draw.label);
    expect(draw.crossedOut).not.toBe(true);
  }
});

it('keeps repeated enemy instances independent when a UI changes a description', () => {
  const before = enemyArt('celestial-guard');
  const instance = enemyArt('celestial-guard');
  instance.body!.draw.label = 'local annotation';
  instance.body!.draw.bounds.x += 5;
  instance.body!.hitRegion.width += 5;
  expect(enemyArt('celestial-guard')).toEqual(before);
});

it.each(content.brood.map(brood => [brood.id, brood] as const))('%s has its own labelled portrait', (id, brood) => {
  const portrait = broodPortrait(id);
  expect(portrait.label).toBe(brood.name);
  if (id === 'anzu') {
    expect(portrait.kind).toBe('shape');
  } else {
    expect(portrait.kind).toBe('emblem');
    if (portrait.kind === 'emblem') expect(portrait.key).toBe(id);
  }
});

// Q07 acceptance 3–4: exercise paths through Q01's actual verified copier.
it('exposes only prepared registered emblems and reachable attribution for the UI', async () => {
  const { prepareAssets } = await import(pathToFileURL(resolve('scripts/prepare-assets.mjs')).href);
  const destination = await mkdtemp(join(tmpdir(), 'q07-art-'));
  try {
    const prepared: string[] = await prepareAssets(resolve('../assets'), destination);
    expect(Object.keys(EMBLEM_SOURCES).sort()).toEqual(['girtablilu', 'ugallu']);
    for (const [key, url] of Object.entries(EMBLEM_SOURCES)) {
      expect(url).toBe(`/tehom/tokens/${key}.svg`);
      const path = url.slice('/tehom/'.length);
      expect(prepared).toContain(path);
      expect(await readFile(join(destination, path))).toEqual(await readFile(resolve('../assets', path)));
    }
    expect(EMBLEM_CREDITS.text).toContain('Lorc');
    expect(EMBLEM_CREDITS.text).toContain('Game-icons.net');
    expect(EMBLEM_CREDITS.text).toContain('CC BY 3.0');
    expect(EMBLEM_CREDITS.licenseUrl).toBe('https://creativecommons.org/licenses/by/3.0/');
    expect(EMBLEM_CREDITS.creditsUrl).toBe('/tehom/CREDITS.md');
    expect(prepared).toContain('CREDITS.md');
    expect(await readFile(join(destination, 'CREDITS.md'), 'utf8')).toContain('Lorc');
  } finally {
    await rm(destination, { recursive: true, force: true });
  }
});

it('provides a code-drawn background covering the logical combat canvas', () => {
  const layers = battleBackground();
  const canvas = { x: 0, y: 0, width: 1280, height: 720 };
  expect(layers.length).toBeGreaterThan(0);
  expect(layers[0]!.kind).toBe('rectangle');
  expect(layers[0]!.bounds).toEqual(canvas);
  for (const layer of layers) {
    expect(['rectangle', 'ellipse']).toContain(layer.kind);
    expectContained(layer.bounds, canvas);
  }
});
