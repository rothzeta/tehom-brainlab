import { expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

it.each([['sweep', 'Q04'], ['probe', 'Q04']])('%s names its implementing checkpoint and exits 2', (command, checkpoint) => {
  const run = spawnSync('./bin/run', [command!], { encoding: 'utf8' });
  expect(run.status).toBe(2); expect(run.stderr).toContain(checkpoint); expect(run.stderr).toContain(command);
});
it('replay dispatches to the implemented Q03 script', () => {
  const run = spawnSync('./bin/run', ['replay', 'fixtures/parity/unfinished-player-v1.json'], { env: { ...process.env, POC002_MODE: 'host' }, encoding: 'utf8' });
  expect(run.status).toBe(0);
  expect(run.stdout).toMatch(/^commands=\d+ events=\d+ outcome=player\n$/);
  expect(run.stderr).toBe('');
});
it.each(['word', '-1', '0', '65536', '999999999999999999999999'])('rejects invalid port %s clearly', port => {
  const run = spawnSync('./bin/run', ['dev'], { env: { ...process.env, POC002_PORT: port }, encoding: 'utf8' });
  expect(run.status).toBe(2); expect(run.stderr).toContain('POC002_PORT must be');
});
it('reports missing Docker clearly', () => {
  const directory = mkdtempSync(join(tmpdir(), 'q01-path-'));
  try {
    // Only the tools needed to reach the Docker prerequisite check are present.
    writeFileSync(join(directory, 'dirname'), '#!/bin/sh\nexec /usr/bin/dirname "$@"\n', { mode: 0o755 });
    writeFileSync(join(directory, 'sh'), '#!/bin/sh\nexec /bin/sh "$@"\n', { mode: 0o755 });
    const run = spawnSync('/bin/sh', ['./scripts/run.sh', 'typecheck'], { env: { ...process.env, PATH: directory, POC002_MODE: 'docker' }, encoding: 'utf8' });
    expect(run.status).toBe(1); expect(run.stderr).toContain('Docker CLI missing');
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
it('reports a mismatched host Bun clearly', () => {
  const directory = mkdtempSync(join(tmpdir(), 'q01-bun-'));
  try {
    writeFileSync(join(directory, 'bun'), '#!/bin/sh\nprintf "0.0.0\\n"\n', { mode: 0o755 });
    const run = spawnSync('/bin/sh', ['./scripts/toolchain.sh', 'typecheck'], { env: { ...process.env, PATH: directory }, encoding: 'utf8' });
    expect(run.status).toBe(1); expect(run.stderr).toContain('Bun 1.4.2 required; found 0.0.0');
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
