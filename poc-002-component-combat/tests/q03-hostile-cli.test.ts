import { expect, it } from 'vitest';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseRecord, replayRecord } from '../src/core';
import { MAX_RECORD_BYTES } from '../src/core/record';

const hostile = new URL('../fixtures/hostile/', import.meta.url);
const parity = new URL('../fixtures/parity/', import.meta.url);
const cli = new URL('../scripts/replay.ts', import.meta.url).pathname;
const run = (file: string) => spawnSync('bun', [cli, file], { encoding: 'utf8' });
const cases = [
  ['unknown-schema', 'record.schema'], ['unknown-rules', 'record.rulesVersion'],
  ['unknown-kind', 'unknown kind'], ['unknown-content-kind', 'unknown kind'],
  ['unknown-id', 'initialState.party[0].id'], ['unknown-command-id', 'command.action'],
  ['non-integer', 'nonnegative integer'], ['overflow', 'nonnegative integer'],
  ['extra-field', 'unknown field'], ['missing-field', 'missing field'],
  ['impossible-revelation', 'Revelation/transformation invariant'],
  ['invalid-gauntlet', 'gauntlet descriptor'], ['rejected-command', 'stale-revision'],
] as const;
it('E45: every committed hostile record has a specific rejection fixture and no parity entry', () => {
  expect(readdirSync(hostile).filter(f => f.endsWith('.json')).sort()).toEqual(cases.map(([name]) => `${name}.json`).sort());
});
it.each(cases)('E45: rejects %s with a specific reason and CLI exit 1', (name, reason) => {
  const file = new URL(`${name}.json`, hostile).pathname;
  const json = readFileSync(file, 'utf8');
  if (name === 'rejected-command') expect(replayRecord(parseRecord(json))).toMatchObject({ ok: false, commandIndex: 0, kind: 'rejected-command', message: reason });
  else expect(() => parseRecord(json)).toThrow(reason);
  const result = run(file);
  expect(result.status).toBe(1); expect(result.stderr).toContain(reason); expect(result.stdout).toBe('');
});
it.each(['fight-beast-v1', 'gauntlet-win-trio-v1', 'gauntlet-defeat-v1', 'unfinished-player-v1', 'unfinished-between-fights-v1'])('CLI prints commands/events/outcome for %s', name => {
  const file = new URL(`${name}.json`, parity).pathname;
  const record = parseRecord(readFileSync(file, 'utf8')); const replay = replayRecord(record);
  if (!replay.ok) throw new Error('fixture setup');
  const result = run(file);
  expect(result.status).toBe(0);
  expect(result.stdout.trim()).toBe(`commands=${replay.commands} events=${replay.events} outcome=${replay.outcome}`);
  expect(result.stderr).toBe('');
});
it('CLI reports first events, revision and final-state divergences with zero-based indexes', () => {
  const directory = mkdtempSync(join(tmpdir(), 'q03-divergence-'));
  try {
    const record = parseRecord(readFileSync(new URL('fight-guard-v1.json', parity), 'utf8'));
    for (const kind of ['events', 'revision', 'final-state'] as const) {
      const changed = structuredClone(record);
      if (kind === 'events') changed.commands[0]!.events = [];
      if (kind === 'revision') changed.commands[0]!.revision++;
      if (kind === 'final-state') changed.finalState.salveUses--;
      const file = join(directory, `${kind}.json`); writeFileSync(file, JSON.stringify(changed));
      const result = run(file);
      expect(result.status).toBe(1);
      expect(result.stderr).toContain(`commandIndex=${kind === 'final-state' ? record.commands.length : 0} kind=${kind}`);
    }
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
it('E45: bounds actual UTF-8 input bytes, including whitespace, before parsing', () => {
  const directory = mkdtempSync(join(tmpdir(), 'q03-oversized-'));
  try {
    const valid = readFileSync(new URL('unfinished-player-v1.json', parity), 'utf8');
    const padding = MAX_RECORD_BYTES - Buffer.byteLength(valid, 'utf8');
    const exact = valid + ' '.repeat(padding);
    expect(() => parseRecord(exact)).not.toThrow();
    const file = join(directory, 'record.json'); writeFileSync(file, exact);
    expect(run(file).status).toBe(0);
    writeFileSync(file, `${exact} `);
    expect(() => parseRecord(`${exact} `)).toThrow(`exceeds ${MAX_RECORD_BYTES} byte limit`);
    const tooLarge = run(file); expect(tooLarge.status).toBe(1); expect(tooLarge.stderr).toContain('byte limit');
    // Non-ASCII strings are counted in UTF-8 bytes, not JavaScript characters.
    const r = JSON.parse(valid); r.content.actions[0].name = 'é'.repeat(Math.floor(MAX_RECORD_BYTES / 2));
    const unicode = JSON.stringify(r);
    expect(unicode.length).toBeLessThan(MAX_RECORD_BYTES);
    expect(() => parseRecord(unicode)).toThrow('byte limit');
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
it('E45: record text is inert data; replay reads only its named input', () => {
  const directory = mkdtempSync(join(tmpdir(), 'q03-inert-'));
  try {
    const file = join(directory, 'input with spaces.json');
    const marker = join(directory, 'must-not-exist');
    const record = JSON.parse(readFileSync(new URL('fight-guard-v1.json', parity), 'utf8'));
    const text = `require('node:fs').writeFileSync(${JSON.stringify(marker)}, 'executed'); fetch('http://127.0.0.1:1/'); import('file:///missing');`;
    record.content.actions[0].name = text;
    record.content.brood[0].name = 'file:///missing-record.json';
    writeFileSync(file, JSON.stringify(record));
    const result = run(file);
    expect(result.status).toBe(0); expect(result.stderr).toBe(''); expect(existsSync(marker)).toBe(false);
    // A neighboring invalid JSON file is never discovered or loaded.
    writeFileSync(join(directory, 'neighbor.json'), '{invalid');
    expect(run(file).status).toBe(0);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
it('E45: malformed JSON, missing files and wrong CLI arity fail clearly', () => {
  const directory = mkdtempSync(join(tmpdir(), 'q03-malformed-'));
  try {
    const file = join(directory, 'malformed.json'); writeFileSync(file, '{');
    expect(run(file).status).toBe(1);
    const missing = run(join(directory, 'missing.json')); expect(missing.status).toBe(1); expect(missing.stderr).toContain('ENOENT');
    for (const args of [[], [file, file]]) {
      const result = spawnSync('bun', [cli, ...args], { encoding: 'utf8' });
      expect(result.status).toBe(1); expect(result.stderr).toContain('one record file');
    }
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
