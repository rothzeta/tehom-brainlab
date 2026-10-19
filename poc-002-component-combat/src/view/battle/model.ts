import type { BattleState, Event, Preview } from '../../core/types';

/** Projection only: no content tuning, action validation or damage arithmetic.
 * Forecast amounts and recipients are copied from the dispatcher's events. */
export function battleModel(state: BattleState, forecastEvents: readonly Event[], preview: Preview | null = null) {
  return {
    round: state.round, phase: state.phase, revision: state.revision, salveUses: state.salveUses,
    brood: structuredClone(state.party), enemies: structuredClone(state.enemies),
    intents: state.intents.map(intent => ({
      ...structuredClone(intent),
      hits: forecastEvents.flatMap(event => event.kind === 'brood-damaged' && event.source.kind === 'intent' && event.source.intent === intent.id
        ? [{ brood: event.brood, ...event.damage, remaining: event.remaining }] : []),
      resolution: structuredClone(forecastEvents.filter(event => 'intent' in event && event.intent === intent.id)),
    })),
    preview: preview ? {
      ok: preview.result.ok, error: preview.result.ok ? null : preview.result.error.code,
      deltas: structuredClone(preview.deltas), events: structuredClone(preview.events),
      forecast: structuredClone(preview.forecast),
    } : null,
  };
}
