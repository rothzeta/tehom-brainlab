import { applyCommand, previewCommand, recordOf } from '../core';
import type { BattleSession, BattleState, Content, Event, RecordedCommand } from '../core/types';

/** Browser-free live adapter. All transitions, including continue, use the core.
 * Snapshots isolate live state and accepted record evidence from consumers. */
export function createSession(content: Content, initialState: BattleState, buildRevision = 'unknown'): BattleSession {
  const rules = structuredClone(content);
  const initial = structuredClone(initialState);
  let state = structuredClone(initial);
  const commands: RecordedCommand[] = [];
  const listeners = new Set<(state: BattleState, events: readonly Event[]) => void>();
  return {
    get content() { return structuredClone(rules); },
    get state() { return structuredClone(state); },
    subscribe(listener) {
      listeners.add(listener);
      listener(structuredClone(state), []);
      return () => { listeners.delete(listener); };
    },
    preview(command) { return previewCommand(rules, state, command); },
    commit(command) {
      const result = applyCommand(rules, state, command);
      if (result.ok) {
        state = result.state;
        commands.push(structuredClone({ command, revision: state.revision, events: result.events }));
        for (const listener of listeners) listener(structuredClone(state), structuredClone(result.events));
      }
      return structuredClone(result);
    },
    exportRecord() { return recordOf({ content: rules, initialState: initial, commands, finalState: state, buildRevision }); },
  };
}
