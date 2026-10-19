/** Node/Bun CLI adapter; the search/report modules themselves do no I/O. */
import { readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContent } from '../core';
import type { EncounterId } from '../core';
import { DEFAULT_OPTIONS, formatReport, probe, sweep } from './report';

export async function runCli(kind: 'sweep' | 'probe', args: string[]): Promise<void> {
  try {
    const options = { ...DEFAULT_OPTIONS }; let encounter: EncounterId = 'warden'; let scan = false; let json: string | null = null;
    for (let i = 0; i < args.length; i++) {
      const flag = args[i]!;
      if (flag === '--help') {
        process.stdout.write(`Q04 ${kind} [--quick] [--width N] [--depth N] [--solo-depth 0..4] [--probe-width N] [--encounter ID] [--breakpoints] [--json PATH]\nDefaults: beam 200, depth 30 rounds/fight, exhaustive solo 4 rounds, opening continuation beam 1. Quick: beam 8 (same coverage/depth).\nJSON must be outside the repository. For Docker persistence use --json /dev/stdout > /tmp/report.json (human report goes to stderr).\n`); return;
      }
      if (flag === '--quick') { options.width = 8; continue; }
      if (flag === '--breakpoints' && kind === 'probe') { scan = true; continue; }
      if (['--width', '--depth', '--solo-depth', '--probe-width', '--encounter', '--json'].includes(flag)) {
        const value = args[++i]; if (!value) throw new Error(`Missing value for ${flag}`);
        if (flag === '--encounter') { encounter = value as EncounterId; continue; }
        if (flag === '--json') { json = value; continue; }
        const n = Number(value);
        if (!/^\d+$/.test(value) || !Number.isSafeInteger(n) || n < (flag === '--solo-depth' ? 0 : 1) || flag === '--solo-depth' && n > 4) throw new Error(`Invalid ${flag}: ${value}`);
        if (flag === '--width') options.width = n;
        else if (flag === '--depth') options.depth = n;
        else if (flag === '--solo-depth') options.soloDepth = n;
        else options.probeWidth = n;
        continue;
      }
      throw new Error(`Unknown option ${flag}`);
    }
    const prototypeRoot = fileURLToPath(new URL('../../', import.meta.url));
    if (json && json !== '/dev/stdout') {
      // Resolve the parent and any existing output symlink before writing.
      let target: string;
      try { target = realpathSync(resolve(json)); }
      catch { target = resolve(realpathSync(dirname(resolve(json))), resolve(json).split('/').at(-1)!); }
      const repoRoot = resolve(prototypeRoot, '..');
      for (const root of [prototypeRoot, ...(repoRoot === '/' ? [] : [repoRoot])]) {
        const rel = relative(realpathSync(root), target);
        if (rel === '' || !rel.startsWith('..' + '/') && !isAbsolute(rel) && rel !== '..') throw new Error('--json PATH must be outside the repository');
      }
      json = target;
    }
    const content = loadContent(JSON.parse(readFileSync(resolve(prototypeRoot, 'content/combat-content.v1.json'), 'utf8')));
    if (!content.encounters.some(e => e.id === encounter)) throw new Error(`Unknown encounter ${encounter}`);
    const report = kind === 'sweep' ? sweep(content, options, { probeEncounter: encounter }) : probe(content, encounter, options, scan);
    const human = formatReport(report);
    if (json === '/dev/stdout') { process.stderr.write(human); process.stdout.write(JSON.stringify(report) + '\n'); }
    else { process.stdout.write(human); if (json) { writeFileSync(json, JSON.stringify(report, null, 2) + '\n'); process.stdout.write(`JSON report: ${json}\n`); } }
  } catch (e) {
    process.stderr.write(`Q04: ${e instanceof Error ? e.message : String(e)}\n`); process.exitCode = 2;
  }
}
