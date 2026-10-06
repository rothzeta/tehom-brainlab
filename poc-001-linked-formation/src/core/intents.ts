import { CLOSE_THRESHOLD, formationLinks, formationPositions } from './formation';
import type { Link, Orientation, Position } from './formation';
import { hexDistance } from './hex';
import type { Hex } from './hex';
import type { GameState } from './state';
import { frontCells, turnCellsAboutClockwise, validateFacing } from './sectors';

/** P05 supplies only selector data; enemy HP tuning and intention choice are P08. */
export interface EnemyState {
  readonly id: string;
  readonly hp: number;
  readonly facing: Orientation;
  readonly cell: Hex;
}

/** Compose with P03 state; its opaque intention labels need no breaking change. */
export interface IntentContext extends Pick<GameState, 'formation' | 'brood'> {
  readonly enemies: readonly EnemyState[];
}

interface Declaration {
  readonly id: string;
  readonly sourceId: string;
}

export type Intention =
  | (Declaration & { readonly kind: 'fixed-area'; readonly cells: readonly Hex[];
      readonly turnable: boolean })
  | (Declaration & { readonly kind: 'marked-hit' | 'marked-splash'; readonly targetId: string });

export const SPLASH_RADIUS = 2;

export interface RecipientSelection {
  /** Roster order for every kind, including splash; empty on cancellation/fizzle. */
  readonly recipientIds: readonly string[];
  readonly reason: 'resolved' | 'source-missing' | 'source-fallen'
    | 'target-missing' | 'target-fallen';
  /** Current mark anchor, or stored area; empty when cancelled/fizzled. */
  readonly cells: readonly Hex[];
}

interface LivingPosition extends Position {
  readonly id: string;
}

function livingPositions(context: IntentContext): readonly LivingPosition[] {
  return formationPositions(context.formation).flatMap((position) => {
    const entity = context.brood.find((brood) => brood.brood === position.brood
      && brood.owner === 'player' && brood.hp > 0);
    return entity ? [{ ...position, id: entity.id }] : [];
  });
}

function sameCell(a: Hex, b: Hex): boolean {
  return a.q === b.q && a.r === b.r;
}

/** Shared preview/resolution selector. No target-selection or declaration mutation. */
export function selectRecipients(
  context: IntentContext, intention: Intention, splashRadius = SPLASH_RADIUS,
): RecipientSelection {
  if (!Number.isSafeInteger(splashRadius) || splashRadius < 0) {
    throw new RangeError('Splash radius must be a nonnegative safe integer');
  }
  const empty = (reason: RecipientSelection['reason']): RecipientSelection =>
    ({ recipientIds: [], cells: [], reason });
  const source = context.enemies.find(({ id }) => id === intention.sourceId);
  if (!source) return empty('source-missing');
  if (source.hp <= 0) return empty('source-fallen');
  const positions = livingPositions(context);
  if (intention.kind === 'fixed-area') {
    return {
      reason: 'resolved', cells: intention.cells,
      recipientIds: positions.filter(({ cell }) => intention.cells.some((area) => sameCell(area, cell)))
        .map(({ id }) => id),
    };
  }
  const target = context.brood.find(({ id }) => id === intention.targetId);
  if (!target || target.owner !== 'player') return empty('target-missing');
  if (target.hp <= 0) return empty('target-fallen');
  const anchor = positions.find(({ id }) => id === target.id)!;
  return {
    reason: 'resolved', cells: [anchor.cell],
    recipientIds: positions.filter(({ id, cell }) => intention.kind === 'marked-hit'
      ? id === target.id : hexDistance(cell, anchor.cell) <= splashRadius).map(({ id }) => id),
  };
}

export interface ActiveLink extends Link {
  readonly fromId: string;
  readonly toId: string;
}

/** Living endpoints only, in P02 roster-pair order; stretched links remain visible. */
export function activeLinks(context: IntentContext, closeThreshold = CLOSE_THRESHOLD): readonly ActiveLink[] {
  const positions = livingPositions(context);
  return formationLinks(context.formation, closeThreshold).flatMap((link) => {
    const from = positions.find(({ brood }) => brood === link.from.brood);
    const to = positions.find(({ brood }) => brood === link.to.brood);
    return from && to ? [{ ...link, fromId: from.id, toId: to.id }] : [];
  });
}

export function isCloseLinked(
  context: IntentContext, fromId: string, toId: string, closeThreshold = CLOSE_THRESHOLD,
): boolean {
  return activeLinks(context, closeThreshold).some((link) => link.state === 'close'
    && ((link.fromId === fromId && link.toId === toId)
      || (link.fromId === toId && link.toId === fromId)));
}

/** Only living Brood can be isolated; no other living endpoint may be Close. */
export function isIsolated(context: IntentContext, broodId: string, closeThreshold = CLOSE_THRESHOLD): boolean {
  const links = activeLinks(context, closeThreshold);
  return livingPositions(context).some(({ id }) => id === broodId)
    && !links.some((link) => link.state === 'close' && (link.fromId === broodId || link.toId === broodId));
}

export interface ProtectionRelation {
  readonly sourceId: string;
  readonly targetId: string;
  /** Ability-specific source-to-ward distance; absent means unlimited support. */
  readonly range?: number;
}

export interface ProtectionSelection {
  readonly protected: boolean;
  /** Unique protecting sources in lexical ID order; no stacking amount chosen here. */
  readonly sourceIds: readonly string[];
  readonly reason: 'actor-unavailable' | 'target-unavailable' | 'bypassed' | 'protected' | 'unprotected';
  readonly checks: readonly {
    readonly sourceId: string;
    readonly reason: 'source-missing' | 'source-fallen' | 'out-of-range' | 'outside-sector' | 'protected';
  }[];
}

/** Contact attacks need no enemy adjacency. Protection uses the source enemy's tile. */
export function selectProtection(
  context: IntentContext,
  attack: { readonly actorId: string; readonly targetId: string; readonly bypassProtection: boolean },
  relations: readonly ProtectionRelation[],
): ProtectionSelection {
  if (relations.some(relation => relation.range !== undefined
    && (!Number.isSafeInteger(relation.range) || relation.range < 0))) {
    throw new RangeError('Protection range must be a nonnegative safe integer');
  }
  const empty = (reason: ProtectionSelection['reason']): ProtectionSelection =>
    ({ protected: false, sourceIds: [], reason, checks: [] });
  const actor = livingPositions(context).find(({ id }) => id === attack.actorId);
  if (!actor) return empty('actor-unavailable');
  if (!context.enemies.some(({ id, hp }) => id === attack.targetId && hp > 0)) {
    return empty('target-unavailable');
  }
  if (attack.bypassProtection) return empty('bypassed');
  const sources = [...new Set(relations.filter(({ targetId }) => targetId === attack.targetId)
    .map(({ sourceId }) => sourceId))].sort();
  const checks: ProtectionSelection['checks'] = sources.map((sourceId) => {
    const source = context.enemies.find(({ id }) => id === sourceId);
    if (!source) return { sourceId, reason: 'source-missing' };
    if (source.hp <= 0) return { sourceId, reason: 'source-fallen' };
    const target = context.enemies.find(enemy => enemy.id === attack.targetId)!;
    if (!relations.some(relation => relation.sourceId === sourceId && relation.targetId === target.id
      && (relation.range === undefined || hexDistance(source.cell, target.cell) <= relation.range))) {
      return { sourceId, reason: 'out-of-range' };
    }
    return { sourceId, reason: frontCells(source.cell, source.facing).some((cell) => sameCell(cell, actor.cell))
      ? 'protected' : 'outside-sector' };
  });
  const sourceIds = checks.filter(({ reason }) => reason === 'protected').map(({ sourceId }) => sourceId);
  return { protected: sourceIds.length > 0, sourceIds,
    reason: sourceIds.length > 0 ? 'protected' : 'unprotected', checks };
}

export type FacingEvent =
  | { readonly type: 'facing-changed'; readonly sourceId: string;
      readonly before: Orientation; readonly after: Orientation }
  | { readonly type: 'intention-turned'; readonly intentionId: string; readonly sourceId: string;
      readonly beforeCells: readonly Hex[]; readonly afterCells: readonly Hex[] };

export type FacingTurn =
  | { readonly ok: false; readonly reason: 'source-fallen'; readonly enemy: EnemyState;
      readonly intentions: readonly Intention[]; readonly events: readonly [] }
  | { readonly ok: true; readonly enemy: EnemyState; readonly intentions: readonly Intention[];
      readonly events: readonly FacingEvent[] };

/** Explicit Crosswind geometry only; P07 owns legality, action cost and dispatch. */
export function turnEnemyClockwise(enemy: EnemyState, intentions: readonly Intention[]): FacingTurn {
  return turnEnemy(enemy, intentions, 'clockwise');
}

/** Signed P07 turn, using the same P05 transform for either direction. */
export function turnEnemy(
  enemy: EnemyState, intentions: readonly Intention[], direction: 'clockwise' | 'anticlockwise',
): FacingTurn {
  validateFacing(enemy.facing);
  if (enemy.hp <= 0) return { ok: false, reason: 'source-fallen', enemy, intentions, events: [] };
  const facing = ((enemy.facing + (direction === 'clockwise' ? 1 : 5)) % 6) as Orientation;
  const events: FacingEvent[] = [{ type: 'facing-changed', sourceId: enemy.id, before: enemy.facing, after: facing }];
  const next = intentions.map((intention): Intention => {
    if (intention.sourceId !== enemy.id || intention.kind !== 'fixed-area' || !intention.turnable) return intention;
    // Five clockwise transforms are exactly one anticlockwise step, with no extra events.
    let cells = intention.cells;
    for (let step = 0; step < (direction === 'clockwise' ? 1 : 5); step += 1) {
      cells = turnCellsAboutClockwise(cells, enemy.cell);
    }
    events.push({ type: 'intention-turned', intentionId: intention.id, sourceId: enemy.id,
      beforeCells: intention.cells, afterCells: cells });
    return { ...intention, cells };
  });
  return { ok: true, enemy: { ...enemy, facing }, intentions: next, events };
}
