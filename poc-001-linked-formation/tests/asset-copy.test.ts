import { afterEach, describe, expect, it } from 'vitest';
import { mkdtemp, readFile, readdir, rm, cp, writeFile, unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

// Exercise the public preparation API and resulting files, without a DOM or image server.
const scriptUrl = pathToFileURL(resolve('scripts/prepare-assets.mjs')).href;
const { prepareAssets }: { prepareAssets: (source: string, destination: string) => Promise<string[]> } = await import(scriptUrl);
const scratch: string[] = [];
async function directory() { const path = await mkdtemp(join(tmpdir(), 'p04-assets-')); scratch.push(path); return path; }
const source = resolve('../assets');
const ids = ['ugallu', 'girtablilu', 'pazuzu', 'warder', 'censer', 'harrier', 'foundry-mechanism'];
const intended = [...ids.map((id) => `tokens/${id}.svg`), 'CREDITS.md', 'licenses/game-icons-license.txt'];
async function bytes(paths: string[], root: string) { return Promise.all(paths.map((path) => readFile(join(root, path)))); }
afterEach(async () => { await Promise.all(scratch.splice(0).map((path) => rm(path, { recursive: true, force: true }))); });

describe('P04 bounded asset preparation', () => {
  it('copies only seven allowlisted emblems and attribution, matching manifest hashes and preserving source bytes', async () => {
    const destination = await directory(); const before = await bytes([...intended, 'manifest.json'], source);
    await writeFile(join(destination, 'unintended.txt'), 'stale');
    expect((await prepareAssets(source, destination)).sort()).toEqual([...intended].sort());
    expect((await readdir(destination, { recursive: true })).filter((path) => path !== 'tokens' && path !== 'licenses').sort()).toEqual([...intended].sort());
    const manifest = JSON.parse((await readFile(join(source, 'manifest.json'))).toString());
    for (const id of ids) {
      const copied = await readFile(join(destination, `tokens/${id}.svg`));
      expect(createHash('sha256').update(copied).digest('hex')).toBe(manifest.assets.find((asset: { id: string }) => asset.id === id).sha256);
    }
    expect(await bytes(intended, destination)).toEqual(before.slice(0, intended.length));
    expect(await bytes([...intended, 'manifest.json'], source)).toEqual(before);
  });

  it.each(['missing', 'corrupt'] as const)('fails precisely for a %s required emblem before changing output', async (failure) => {
    const temporarySource = join(await directory(), 'assets'); const destination = await directory();
    await cp(source, temporarySource, { recursive: true });
    const file = join(temporarySource, 'tokens/ugallu.svg');
    if (failure === 'missing') await unlink(file); else await writeFile(file, '<svg>corrupt</svg>');
    await writeFile(join(destination, 'preserved.txt'), 'prior valid output');
    await expect(prepareAssets(temporarySource, destination)).rejects.toThrow(failure === 'missing' ? 'missing or unreadable source tokens/ugallu.svg' : 'SHA-256 mismatch for tokens/ugallu.svg');
    expect(await readFile(join(destination, 'preserved.txt'), 'utf8')).toBe('prior valid output');
  });
});
