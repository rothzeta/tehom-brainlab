import { formationLinks, formationPositions, validateFormation } from '../core/formation';
import type { Brood, Formation } from '../core/formation';
import { createInitialState } from '../core/state';
import type { GameState } from '../core/state';
import type { Command, CommandResult, Maneuver } from '../core/commands';
import { applyCommand } from '../core/transition';
import { previewCommand, previewValidity } from '../core/preview';
import type { CommandPreview } from '../core/preview';

export const MANEUVERS: readonly Maneuver[] = ['clockwise', 'anticlockwise', 'expand', 'contract'];
export const MANEUVER_LABELS: Record<Maneuver, string> = {
  clockwise: 'Rotate clockwise', anticlockwise: 'Rotate anticlockwise', expand: 'Expand', contract: 'Contract',
};

/** Presentation session only. All maneuver outcomes and availability come from P03. */
export class LabSession {
  private live: GameState;
  private generation = 0;

  constructor(private readonly factory: () => GameState = createInitialState) {
    this.live = factory();
  }
  private pending: { readonly maneuver: Maneuver; readonly state: GameState; readonly projection: CommandPreview } | undefined;
  private selection: Brood | undefined;

  get state(): GameState { return this.live; }
  get preview(): typeof this.pending { return this.pending; }
  get selected(): Brood | undefined { return this.selection; }
  get positions() { return formationPositions(this.live.formation); }
  get links() { return formationLinks(this.live.formation); }

  outcome(maneuver: Maneuver): CommandResult {
    return applyCommand(this.live, { kind: 'maneuver', expectedRevision: this.live.revision, maneuver });
  }

  previewCommand(command: Command): CommandPreview {
    return previewCommand(this.live, command, this.generation);
  }

  previewManeuver(maneuver: Maneuver): void {
    const result = this.previewCommand({ kind: 'maneuver', expectedRevision: this.live.revision, maneuver });
    this.pending = result.ok ? { maneuver, state: result.state, projection: result } : undefined;
  }

  confirmPreview(preview: CommandPreview): CommandResult | {
    readonly ok: false; readonly state: GameState; readonly events: readonly [];
    readonly error: { readonly code: 'stale-session' | 'stale-revision' };
  } {
    const stale = previewValidity(this.live, this.generation, preview);
    if (stale) { this.cancel(); return { ok: false, state: this.live, events: [], error: { code: stale } }; }
    return this.submit(preview.command);
  }

  submit(command: Command): CommandResult {
    const result = applyCommand(this.live, command);
    if (result.ok) this.live = result.state;
    this.cancel();
    return result;
  }

  commit(maneuver: Maneuver): CommandResult {
    const pending = this.pending;
    if (pending && previewValidity(this.live, this.generation, pending.projection)) {
      this.cancel();
      return { ok: false, state: this.live, events: [], error: { code: 'stale-revision' } };
    }
    return this.submit(pending?.maneuver === maneuver ? pending.projection.command
      : { kind: 'maneuver', expectedRevision: this.live.revision, maneuver });
  }

  cancel(): void { this.pending = undefined; }
  select(brood: Brood): void { this.selection = brood; }
  reset(): void { this.generation += 1; this.live = this.factory(); this.selection = undefined; this.cancel(); }

  /** Explicit test setup, never a player command or a round reset. */
  selectFixture(formation: Formation): void {
    validateFormation(formation);
    this.reset();
    this.live = { ...this.live, formation: { ...formation } };
  }
}
