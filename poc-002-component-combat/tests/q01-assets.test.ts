// Pattern copied from poc-001-linked-formation/tests/asset-copy.test.ts at c82ec3c.
import { afterEach, expect, it } from 'vitest';
import { mkdtemp, readFile, readdir, rm, cp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
const scriptUrl = pathToFileURL(resolve('scripts/prepare-assets.mjs')).href;
const { prepareAssets }: { prepareAssets: (source: string, destination: string) => Promise<string[]> } = await import(scriptUrl);
const scratch: string[] = [];
async function directory() { const path = await mkdtemp(join(tmpdir(), 'q01-assets-')); scratch.push(path); return path; }
const source = resolve('../assets');
const intended = ['tokens/ugallu.svg', 'tokens/girtablilu.svg', 'CREDITS.md', 'licenses/game-icons-license.txt'];
afterEach(async () => { await Promise.all(scratch.splice(0).map(path => rm(path, { recursive: true, force: true }))); });
it('copies only the two authorized emblems and attribution, preserving bytes', async () => {
  const destination = await directory();
  await writeFile(join(destination, 'stale.txt'), 'stale');
  expect((await prepareAssets(source, destination)).sort()).toEqual([...intended].sort());
  expect((await readdir(destination, { recursive: true })).filter(p => p !== 'tokens' && p !== 'licenses').sort()).toEqual([...intended].sort());
  for (const path of intended) expect(await readFile(join(destination, path))).toEqual(await readFile(join(source, path)));
});
it('fails a SHA mismatch before replacing previously prepared output', async () => {
  const temporarySource = join(await directory(), 'assets'); const destination = await directory();
  await cp(source, temporarySource, { recursive: true });
  await writeFile(join(temporarySource, 'tokens/ugallu.svg'), '<svg>corrupt</svg>');
  await writeFile(join(destination, 'preserved.txt'), 'prior output');
  await expect(prepareAssets(temporarySource, destination)).rejects.toThrow('SHA-256 mismatch for tokens/ugallu.svg');
  expect(await readFile(join(destination, 'preserved.txt'), 'utf8')).toBe('prior output');
});
