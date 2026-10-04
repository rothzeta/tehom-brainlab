import type { Formation } from './formation';
import type { GameState } from './state';
import type { AttackCommand, DamageEvent } from './damage';
import type { LifecycleEvent } from './lifecycle';
import type { FacingEvent } from './intents';
import type { AbilityCommand, AbilityEvent } from './abilities';
import type { RoundEvent } from './rounds';

export type Maneuver = 'clockwise' | 'anticlockwise' | 'expand' | 'contract';

export interface ActorAction {
  readonly expectedRevision: number;
  readonly actorId: string;
  readonly abilityId: string;
  readonly targetId: string;
}

export type Command =
  | AbilityCommand
  | AttackCommand
  | { readonly kind: 'maneuver'; readonly expectedRevision: number; readonly maneuver: Maneuver }
  | ({ readonly kind: 'useAbility' } & ActorAction)
  | { readonly kind: 'endPhase'; readonly expectedRevision: number };

export type ErrorCode =
  | 'stale-revision' | 'wrong-phase' | 'maneuver-used' | 'same-shape'
  | 'unknown-actor' | 'wrong-owner' | 'fallen-actor' | 'already-acted'
  | 'illegal-ability' | 'illegal-target' | 'unsupported-command' | 'invalid-command'
  | 'invalid-amount' | 'duplicate-attack';

export interface CommandError {
  readonly code: ErrorCode;
}

export type GameplayEvent =
  | DamageEvent | LifecycleEvent | FacingEvent | AbilityEvent | RoundEvent
  | { readonly type: 'maneuver-applied'; readonly maneuver: Maneuver;
      readonly formation: Formation; readonly revision: number }
  | { readonly type: 'action-applied'; readonly actorId: string;
      readonly abilityId: string; readonly targetId: string; readonly revision: number };

/** Rejections always expose an empty event list, including unsupported commands. */
export type CommandResult<State extends GameState = GameState> =
  | { readonly ok: true; readonly state: State; readonly events: readonly GameplayEvent[] }
  | { readonly ok: false; readonly state: State; readonly events: readonly [];
      readonly error: CommandError };
