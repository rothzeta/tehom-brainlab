// CLI pattern copied from poc-001-linked-formation/scripts/replay-run.ts at c82ec3c.
// Record data is never used as a filename, module, expression or executable.
import { openSync, readSync, closeSync } from 'node:fs';
import { MAX_RECORD_BYTES, parseRecord, replayRecord } from '../src/core/record';

try {
  const args = process.argv.slice(2);
  if (args.length !== 1) throw new Error('replay requires one record file');
  // Bound actual bytes read (including growing files); do not trust stat size.
  const fd = openSync(args[0]!, 'r');
  const chunks: Buffer[] = [];
  let total = 0;
  try {
    while (true) {
      const chunk = Buffer.alloc(Math.min(64 * 1024, MAX_RECORD_BYTES + 1 - total));
      const count = readSync(fd, chunk, 0, chunk.length, null);
      if (!count) break;
      total += count;
      if (total > MAX_RECORD_BYTES) throw new Error(`input exceeds ${MAX_RECORD_BYTES} byte limit`);
      chunks.push(chunk.subarray(0, count));
    }
  } finally { closeSync(fd); }
  const record = parseRecord(Buffer.concat(chunks).toString('utf8'));
  const result = replayRecord(record);
  if (!result.ok) {
    console.error(`replay: commandIndex=${result.commandIndex} kind=${result.kind}: ${result.message}`);
    process.exitCode = 1;
  } else {
    console.log(`commands=${result.commands} events=${result.events} outcome=${result.outcome}`);
  }
} catch (error) {
  console.error(`replay: ${error instanceof Error ? error.message : 'invalid input'}`);
  process.exitCode = 1;
}
