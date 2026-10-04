import { formationLinks, formationPositions, validateFormation } from '../core/formation';
import type { Brood, Formation } from '../core/formation';
import { createInitialState } from '../core/state';
import type { GameState } from '../core/state';
import type { CommandResult, Maneuver } from '../core/commands';
import { applyCommand } from '../core/transition';

export const MANEUVERS: readonly Maneuver[] = ['clockwise', 'anticlockwise', 'expand', 'contract'];
export const MANEUVER_LABELS: Record<Maneuver, string> = {
  clockwise: 'Rotate clockwise', anticlockwise: 'Rotate anticlockwise', expand: 'Expand', contract: 'Contract',
};

/** Presentation session only. All maneuver outcomes and availability come from P03. */
export class LabSession {
  private live = createInitialState();
  private pending: { readonly maneuver: Maneuver; readonly state: GameState } | undefined;
  private selection: Brood | undefined;

  get state(): GameState { return this.live; }
  get preview(): typeof this.pending { return this.pending; }
  get selected(): Brood | undefined { return this.selection; }
  get positions() { return formationPositions(this.live.formation); }
  get links() { return formationLinks(this.live.formation); }

  outcome(maneuver: Maneuver): CommandResult {
    return applyCommand(this.live, { kind: 'maneuver', expectedRevision: this.live.revision, maneuver });
  }

  previewManeuver(maneuver: Maneuver): void {
    const result = this.outcome(maneuver);
    this.pending = result.ok ? { maneuver, state: result.state } : undefined;
  }

  commit(maneuver: Maneuver): CommandResult {
    const result = this.outcome(maneuver);
    if (result.ok) this.live = result.state;
    this.cancel();
    return result;
  }

  cancel(): void { this.pending = undefined; }
  select(brood: Brood): void { this.selection = brood; }
  reset(): void { this.live = createInitialState(); this.selection = undefined; this.cancel(); }

  /** Explicit test setup, never a player command or a round reset. */
  selectFixture(formation: Formation): void {
    validateFormation(formation);
    this.reset();
    this.live = { ...this.live, formation: { ...formation } };
  }
}
