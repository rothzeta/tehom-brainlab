import {
  contractFormation, expandFormation, rotateAnticlockwise, rotateClockwise,
} from './formation';
import type { Formation } from './formation';
import type { ActorAction, Command, CommandResult, ErrorCode } from './commands';
import type { BroodState, GameState } from './state';

function reject(state: GameState, code: ErrorCode): CommandResult {
  return { ok: false, state, events: [], error: { code } };
}

function guard(state: GameState, expectedRevision: number): ErrorCode | undefined {
  if (expectedRevision !== state.revision) return 'stale-revision';
  if (state.phase !== 'player') return 'wrong-phase';
  return undefined;
}

/** The single player-command boundary. P07/P08 dispatchers are not installed yet. */
export function applyCommand(state: GameState, command: Command): CommandResult {
  // Unsupported kinds stay explicit even in stale or terminal snapshots.
  if (command.kind === 'useAbility' || command.kind === 'endPhase') {
    return reject(state, 'unsupported-command');
  }
  if (command.kind !== 'maneuver') return reject(state, 'invalid-command');
  const error = guard(state, command.expectedRevision);
  if (error) return reject(state, error);
  if (state.maneuverUsed) return reject(state, 'maneuver-used');

  let formation: Formation;
  switch (command.maneuver) {
    case 'clockwise': formation = rotateClockwise(state.formation); break;
    case 'anticlockwise': formation = rotateAnticlockwise(state.formation); break;
    case 'expand':
      if (state.formation.shape === 'spread') return reject(state, 'same-shape');
      formation = expandFormation(state.formation);
      break;
    case 'contract':
      if (state.formation.shape === 'compact') return reject(state, 'same-shape');
      formation = contractFormation(state.formation);
      break;
    default: return reject(state, 'invalid-command');
  }
  const next: GameState = {
    ...state, formation, maneuverUsed: true, revision: state.revision + 1,
  };
  return {
    ok: true, state: next,
    events: [{ type: 'maneuver-applied', maneuver: command.maneuver,
      formation, revision: next.revision }],
  };
}

/** Trusted future dispatcher hooks must be pure; no ability rules ship in P03. */
export interface ActionRules {
  readonly validate: (state: GameState, actor: BroodState, action: ActorAction) =>
    'illegal-ability' | 'illegal-target' | undefined;
  // Restrict effects to entity data: effects cannot reset budgets, phase or revision.
  readonly apply: (state: GameState, actor: BroodState, action: ActorAction) => readonly BroodState[];
}

/** Validate everything before applying an effect or spending the actor's action. */
export function applyActorAction(
  state: GameState, action: ActorAction, rules: ActionRules,
): CommandResult {
  const error = guard(state, action.expectedRevision);
  if (error) return reject(state, error);
  const actor = state.brood.find(({ id }) => id === action.actorId);
  if (!actor) return reject(state, 'unknown-actor');
  if (actor.owner !== 'player') return reject(state, 'wrong-owner');
  if (actor.hp <= 0) return reject(state, 'fallen-actor');
  if (state.actedIds.includes(actor.id)) return reject(state, 'already-acted');
  const legalityError = rules.validate(state, actor, action);
  if (legalityError) return reject(state, legalityError);

  const brood = rules.apply(state, actor, action);
  const next: GameState = {
    ...state, brood, actedIds: [...state.actedIds, actor.id], revision: state.revision + 1,
  };
  return {
    ok: true, state: next,
    events: [{ type: 'action-applied', actorId: actor.id, abilityId: action.abilityId,
      targetId: action.targetId, revision: next.revision }],
  };
}
