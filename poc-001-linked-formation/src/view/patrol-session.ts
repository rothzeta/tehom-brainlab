import { createPatrol } from '../content/patrol';
import type { PatrolPreset, PatrolState } from '../content/patrol';
import type { Command, GameplayEvent } from '../core/commands';
import type { CommandPreview } from '../core/preview';
import { LabSession } from './lab-state';

/** The existing P09 adapter owns all command submission and preview validity. */
export class PatrolSession {
  private preset: PatrolPreset = 'healthy';
  private readonly adapter: LabSession;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private generation = 0;
  busy = false;
  pending: CommandPreview | undefined;
  events: readonly GameplayEvent[] = [];
  message = 'Choose a Brood, ability and target. Confirm to act.';

  constructor(private readonly changed: () => void = () => {}, private readonly duration = 400,
    private readonly factory: (preset: PatrolPreset) => PatrolState = createPatrol) {
    this.adapter = new LabSession(() => this.factory(this.preset));
  }
  get state(): PatrolState { return this.adapter.state as PatrolState; }
  project(command: Command): CommandPreview { return this.adapter.previewCommand(command); }
  preview(command: Command): void {
    if (this.busy) return;
    this.pending = this.project(command); this.changed();
  }
  cancel(): void { this.pending = undefined; this.changed(); }
  confirm(preview = this.pending): void {
    if (this.busy || !preview) return;
    const result = this.adapter.confirmPreview(preview);
    this.pending = undefined;
    if (!result.ok) { this.message = `Unavailable: ${result.error.code}.`; this.changed(); return; }
    this.events = result.events;
    this.message = preview.command.kind === 'endPhase'
      ? 'Unused actions forfeited. Enemy intentions resolved in the announced order.'
      : 'Action resolved.';
    this.busy = true;
    const generation = this.generation;
    this.timer = setTimeout(() => {
      if (generation !== this.generation) return;
      this.busy = false; this.timer = undefined; this.changed();
    }, this.duration);
    this.changed();
  }
  reset(preset = this.preset): void {
    this.generation += 1;
    if (this.timer !== undefined) clearTimeout(this.timer);
    this.timer = undefined; this.preset = preset; this.adapter.reset();
    this.busy = false; this.pending = undefined; this.events = [];
    this.message = 'Fresh patrol. Choose a Brood, ability and target.'; this.changed();
  }
}
