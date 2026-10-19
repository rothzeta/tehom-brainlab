/** Negative inputs are deliberate mutations of an API-generated record. */
import { readFileSync, writeFileSync } from 'node:fs';
const base = JSON.parse(readFileSync(new URL('../parity/seed-girtablilu-guard.json', import.meta.url), 'utf8'));
const mutations: Record<string, (record: any) => void> = {
  'unknown-schema': r => { r.schema = 'tehom-combat-record/999'; },
  'unknown-rules': r => { r.rulesVersion = 'poc-002-rules-future'; },
  'unknown-kind': r => { r.commands[0].events[0].kind = 'execute'; },
  'unknown-content-kind': r => { r.content.actions[0].effect.kind = 'eval'; },
  'unknown-id': r => { r.initialState.party[0].id = 'outsider'; },
  'unknown-command-id': r => { r.commands[0].command.action = 'execute'; },
  'non-integer': r => { r.initialState.revision = 0.5; },
  'overflow': r => { r.commands[0].revision = 2147483648; },
  'extra-field': r => { r.commands[0].command.script = 'throw new Error("must never execute")'; },
  'missing-field': r => { delete r.initialState.round; },
  'impossible-revelation': r => { r.initialState.party[0].revelation = r.initialState.party[0].revelationCap; },
  'rejected-command': r => { r.commands[0].command.expectedRevision = 1; },
  'invalid-gauntlet': r => {
    const g = r.content.gauntlets[0];
    const run = { kind: 'gauntlet', gauntletId: g.id, encounters: [g.encounters[0]], party: r.run.party, start: g.start };
    r.run = run; r.initialState.run = structuredClone(run); r.finalState.run = structuredClone(run);
  },
};
for (const [name, mutate] of Object.entries(mutations)) {
  const record = structuredClone(base); mutate(record);
  writeFileSync(new URL(`${name}.json`, import.meta.url), `${JSON.stringify(record, null, 2)}\n`);
}
// Keep oversized bytes out of Git: the test generates limit+1 bytes in /tmp.
