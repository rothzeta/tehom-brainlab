import { applyCommand } from './engine';
import type { BattleState, Content, Preview } from './types';

/** Clone/dispatch preview pattern copied from POC 001 src/core/preview.ts at
 * c82ec3c. Both the selected action and forecast use the real transition. */
export function previewCommand(content: Content, live: BattleState, command: unknown): Preview {
  const result = applyCommand(content, structuredClone(live), command);
  const state = result.state;
  const endsPhase = !!command && typeof command === 'object' && 'kind' in command && command.kind === 'endPhase';
  return {
    result, state, events: result.events,
    deltas: {
      brood: state.party.map(b => ({ id: b.id, hp: b.hp - live.party.find(x => x.id === b.id)!.hp, revelation: b.revelation - live.party.find(x => x.id === b.id)!.revelation })),
      parts: state.enemies.flatMap(e => e.parts.map(p => ({ target: { enemy: e.id, part: p.id }, pool: p.pool - (live.enemies.find(x => x.id === e.id)?.parts.find(x => x.id === p.id)?.pool ?? p.pool) }))),
      salveUses: state.salveUses - live.salveUses,
    },
    forecast: state.phase === 'player' && !endsPhase ? applyCommand(content, state, { kind: 'endPhase', expectedRevision: state.revision }) : null,
  };
}
