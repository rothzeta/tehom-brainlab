import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { applyCommand, parseRecord, replayRecord } from '../src/core';

/** Versioned parity is the only suite that freezes the shipped v1 tuning.
 * Expected numbers, ordered events and states live in the embedded fixtures. */
it.each(['seed-girtablilu-guard', 'seed-ugallu-warden'])('replays the brief tuning witness %s exactly', name => {
  const record = parseRecord(readFileSync(new URL(`../fixtures/parity/${name}.json`, import.meta.url), 'utf8'));
  let state = record.initialState;
  for (const step of record.commands) {
    const result = applyCommand(record.content, state, step.command);
    expect(result.ok).toBe(true);
    expect(JSON.stringify(result.events)).toBe(JSON.stringify(step.events));
    expect(result.state.revision).toBe(step.revision);
    state = result.state;
  }
  expect(JSON.stringify(state)).toBe(JSON.stringify(record.finalState));
  const result = replayRecord(record);
  expect(result).toMatchObject({ ok: true, state: record.finalState, outcome: 'victory' });
  if (result.ok) console.log(`${name}: commands=${result.commands} events=${result.events} outcome=${result.outcome} round=${state.round} hp=${state.party[0]!.hp} revelation=${state.party[0]!.revelation}`);
});
