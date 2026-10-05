import { readFile } from 'node:fs/promises';
import { replayRun } from '../src/core/run-record';

const paths = process.argv.slice(2);
if (paths.length !== 1) {
  console.error('Usage: just poc-001-replay <record-path>');
  process.exitCode = 2;
} else {
  try {
    const result = replayRun(await readFile(paths[0]!, 'utf8'));
    console.log(JSON.stringify({ ok: true, commands: result.commands, events: result.events.length,
      revision: result.state.revision, round: result.state.round, phase: result.state.phase }));
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Run record: unknown failure');
    process.exitCode = 1;
  }
}
