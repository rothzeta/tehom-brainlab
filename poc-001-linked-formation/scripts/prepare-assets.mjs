import { createHash } from 'node:crypto';
import { readFile, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const TOKEN_IDS = Object.freeze([
  'ugallu', 'girtablilu', 'pazuzu', 'warder', 'censer', 'harrier', 'foundry-mechanism',
]);

/** A bounded local copy; validate every source before replacing generated output. */
export async function prepareAssets(source = resolve(dirname(fileURLToPath(import.meta.url)), '../../assets'),
  destination = resolve(dirname(fileURLToPath(import.meta.url)), '../public/tehom')) {
  async function required(path) {
    try { return await readFile(resolve(source, path)); }
    catch { throw new Error(`P04 assets: missing or unreadable source ${path}`); }
  }
  const manifest = JSON.parse((await required('manifest.json')).toString());
  const files = new Map();
  for (const id of TOKEN_IDS) {
    const path = `tokens/${id}.svg`;
    const entry = manifest.assets.find((asset) => asset.id === id && asset.file === `assets/${path}`);
    if (!entry) throw new Error(`P04 assets: manifest entry missing for ${path}`);
    const bytes = await required(path);
    if (createHash('sha256').update(bytes).digest('hex') !== entry.sha256) {
      throw new Error(`P04 assets: SHA-256 mismatch for ${path}`);
    }
    files.set(path, bytes);
  }
  files.set('CREDITS.md', await required('CREDITS.md'));
  files.set('licenses/game-icons-license.txt', await required('licenses/game-icons-license.txt'));
  await rm(destination, { recursive: true, force: true });
  for (const [path, bytes] of files) {
    await mkdir(dirname(resolve(destination, path)), { recursive: true });
    await writeFile(resolve(destination, path), bytes);
  }
  return [...files.keys()];
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(`P04 assets: prepared ${(await prepareAssets()).length} files in public/tehom`); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
