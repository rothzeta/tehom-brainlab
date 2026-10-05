import { hexDistance, RING_ONE, RING_TWO } from './hex';
import type { Hex } from './hex';

export const ROSTER = Object.freeze(['ugallu', 'girtablilu', 'pazuzu'] as const);
export type Brood = typeof ROSTER[number];
export type Shape = 'compact' | 'spread';
export type Orientation = 0 | 1 | 2 | 3 | 4 | 5;

/** Explicit state; P02 does not choose an initial formation for later consumers. */
export interface Formation {
  readonly shape: Shape;
  readonly orientation: Orientation;
}

export interface Position {
  readonly brood: Brood;
  readonly cell: Hex;
}

export interface Link {
  readonly from: Position;
  readonly to: Position;
  readonly distance: number;
  readonly state: 'close' | 'stretched';
}

/** Provisional experiment tuning from the brief's Links section, not balance. */
export const CLOSE_THRESHOLD = 2;

/** Reject malformed shapes/orientations with RangeError; never normalize inputs. */
export function validateFormation(value: unknown): asserts value is Formation {
  if (typeof value !== 'object' || value === null
    || !('shape' in value) || (value.shape !== 'compact' && value.shape !== 'spread')) {
    throw new RangeError('Formation shape must be compact or spread');
  }
  if (!('orientation' in value) || typeof value.orientation !== 'number'
    || !Number.isInteger(value.orientation) || value.orientation < 0 || value.orientation > 5) {
    throw new RangeError('Formation orientation must be an integer from 0 through 5');
  }
}

/** Enumerate all twelve labelled states; coincident cell sets keep their labels. */
export function formations(): readonly Formation[] {
  const states: Formation[] = [];
  for (const shape of ['compact', 'spread'] as const) {
    for (let orientation = 0; orientation < 6; orientation += 1) {
      states.push({ shape, orientation: orientation as Orientation });
    }
  }
  return states;
}

/** Stable roster order. Compact: S[o], S[o+2], S[o+4]; Spread: T[2o+{0,4,8}]. */
export function formationPositions(formation: Formation): readonly Position[] {
  validateFormation(formation);
  const o = formation.orientation;
  const cells = formation.shape === 'compact'
    ? [RING_ONE[o]!, RING_ONE[(o + 2) % 6]!, RING_ONE[(o + 4) % 6]!]
    : [RING_TWO[2 * o]!, RING_TWO[(2 * o + 4) % 12]!, RING_TWO[(2 * o + 8) % 12]!];
  return ROSTER.map((brood, index) => ({
    brood,
    cell: cells[index]!,
  }));
}

/** Advance two T indices / one S index (one clockwise 60-degree step in hex.ts convention). */
export function rotateClockwise(formation: Formation): Formation {
  validateFormation(formation);
  return { shape: formation.shape, orientation: ((formation.orientation + 1) % 6) as Orientation };
}

export function rotateAnticlockwise(formation: Formation): Formation {
  validateFormation(formation);
  return { shape: formation.shape, orientation: ((formation.orientation + 5) % 6) as Orientation };
}

/** Preserve orientation and roster identity; already-Spread states stay Spread. */
export function expandFormation(formation: Formation): Formation {
  validateFormation(formation);
  return { shape: 'spread', orientation: formation.orientation };
}

/** Preserve orientation and roster identity; already-Compact states stay Compact. */
export function contractFormation(formation: Formation): Formation {
  validateFormation(formation);
  return { shape: 'compact', orientation: formation.orientation };
}

/**
 * All three links, in roster-pair order (0,1), (0,2), (1,2). Close is inclusive.
 * An explicit threshold permits tuning without changing formation geometry.
 * Invalid thresholds (not nonnegative safe integers) produce RangeError.
 */
export function formationLinks(formation: Formation, closeThreshold = CLOSE_THRESHOLD): readonly Link[] {
  const positions = formationPositions(formation);
  if (!Number.isSafeInteger(closeThreshold) || closeThreshold < 0) {
    throw new RangeError('Close threshold must be a nonnegative safe integer');
  }
  return ([[0, 1], [0, 2], [1, 2]] as const).map(([a, b]) => {
    const from = positions[a]!;
    const to = positions[b]!;
    const distance = hexDistance(from.cell, to.cell);
    return { from, to, distance, state: distance <= closeThreshold ? 'close' : 'stretched' };
  });
}
