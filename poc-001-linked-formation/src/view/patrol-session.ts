import type { EncounterState, EncounterPreset } from '../core/encounters';
import { createPatrol } from '../content/patrol';
import type { PatrolPreset, PatrolState } from '../content/patrol';
import type { Command, GameplayEvent } from '../core/commands';
import type { CommandPreview } from '../core/preview';
import { appendAcceptedCommand, createRunRecord } from '../core/run-record';
import type { RunRecord } from '../core/run-record';
import { LabSession } from './lab-state';

type ControlCommand = Exclude<Command, { kind: 'attack' }>;

/** Control identity excludes revision so matching cached previews retain stale guards. */
function controlIdentity(command: ControlCommand): string {
  switch (command.kind) {
    case 'maneuver': return JSON.stringify([command.kind, command.maneuver]);
    case 'useAbility': return JSON.stringify([command.kind, command.actorId, command.abilityId,
      command.targetId, 'direction' in command ? command.direction : undefined]);
    case 'endPhase': return command.kind;
  }
}

/** The existing P09 adapter owns all command submission and preview validity. */
export class PatrolSession<State extends EncounterState = PatrolState, Preset extends EncounterPreset = PatrolPreset> {
  private preset: Preset;
  private readonly adapter: LabSession;
  private record: RunRecord<State>;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private generation = 0;
  busy = false;
  pending: CommandPreview | undefined;
  events: readonly GameplayEvent[] = [];
  message = 'Choose a Brood, ability and target. Confirm to act.';

  constructor(private readonly changed: () => void = () => {}, private readonly duration = 400,
    private readonly factory: (preset: Preset) => State = createPatrol as unknown as (preset: Preset) => State,
    initialPreset: Preset = 'healthy' as Preset, private readonly encounterTitle = 'patrol') {
    this.preset = initialPreset;
    this.adapter = new LabSession(() => this.factory(this.preset));
    this.record = this.freshRecord();
  }
  private freshRecord(): RunRecord<State> {
    return createRunRecord(this.state, this.preset, import.meta.env?.VITE_POC001_BUILD_REVISION || 'unknown');
  }
  exportRecord(): string { return JSON.stringify(this.record, null, 2); }
  get state(): State { return this.adapter.state as State; }
  project(command: Command): CommandPreview { return this.adapter.previewCommand(command); }
  preview(command: Command): void {
    if (this.busy) return;
    this.pending = this.project(command); this.changed();
  }
  cancel(): void { this.pending = undefined; this.changed(); }
  activate(command: ControlCommand): void {
    const pending = this.pending;
    this.confirm(pending && pending.command.kind !== 'attack'
      && controlIdentity(pending.command) === controlIdentity(command)
      ? pending : this.project(command));
  }
  confirm(preview = this.pending): void {
    if (this.busy || !preview) return;
    const unused = this.state.brood.filter(entity => entity.hp > 0 && !this.state.actedIds.includes(entity.id)).length;
    const result = this.adapter.confirmPreview(preview);
    this.pending = undefined;
    if (!result.ok) { this.message = `Unavailable: ${result.error.code}.`; this.changed(); return; }
    this.record = appendAcceptedCommand(this.record, preview.command, result);
    this.events = result.events;
    this.message = preview.command.kind === 'endPhase'
      ? `${unused > 0 ? `Unused actions forfeited: ${unused}. ` : ''}Enemy intentions resolved in the announced order.`
      : 'Action resolved.';
    this.busy = true;
    const generation = this.generation;
    this.timer = setTimeout(() => {
      if (generation !== this.generation) return;
      this.busy = false; this.timer = undefined; this.changed();
    }, this.duration);
    this.changed();
  }
  reset(preset: Preset = this.preset): void {
    this.generation += 1;
    if (this.timer !== undefined) clearTimeout(this.timer);
    this.timer = undefined; this.preset = preset; this.adapter.reset();
    this.record = this.freshRecord();
    this.busy = false; this.pending = undefined; this.events = [];
    this.message = `Fresh ${this.encounterTitle}. Choose a Brood, ability and target.`; this.changed();
  }
}
