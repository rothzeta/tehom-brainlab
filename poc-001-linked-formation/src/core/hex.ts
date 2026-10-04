/**
 * Integer axial combat coordinates, independent of pixels. Project with vertical
 * coordinates increasing downward: (q, r) -> (q + r / 2, sqrt(3) * r / 2).
 * Under that convention (-r, q + r) is one clockwise 60-degree step.
 */
export interface Hex {
  readonly q: number;
  readonly r: number;
}

/** Reject malformed or non-safe-integer coordinates with RangeError. */
export function validateHex(value: unknown): asserts value is Hex {
  if (typeof value !== 'object' || value === null
    || !('q' in value) || !('r' in value)
    || !Number.isSafeInteger(value.q) || !Number.isSafeInteger(value.r)) {
    throw new RangeError('Hex coordinates must be safe integers');
  }
}

/** Axial distance; rejects invalid coordinates or an unsafe integer result. */
export function hexDistance(a: Hex, b: Hex): number {
  validateHex(a);
  validateHex(b);
  const dq = a.q - b.q;
  const dr = a.r - b.r;
  const distance = Math.max(Math.abs(dq), Math.abs(dr), Math.abs(dq + dr));
  if (!Number.isSafeInteger(distance)) {
    throw new RangeError('Hex distance must be a safe integer');
  }
  return distance;
}

/** The fixed P02 arena: centre plus three rings (37 cells); order unspecified. */
export function boardCells(): readonly Hex[] {
  const cells: Hex[] = [];
  for (let q = -3; q <= 3; q += 1) {
    for (let r = -3; r <= 3; r += 1) {
      const cell = { q, r };
      if (hexDistance(cell, { q: 0, r: 0 }) <= 3) cells.push(cell);
    }
  }
  return cells;
}

/** P02 ring R: clockwise, starting at (3, 0). No pixel coordinates or sorting. */
export const OUTER_RING: readonly Hex[] = Object.freeze([
  { q: 3, r: 0 }, { q: 2, r: 1 }, { q: 1, r: 2 },
  { q: 0, r: 3 }, { q: -1, r: 3 }, { q: -2, r: 3 },
  { q: -3, r: 3 }, { q: -3, r: 2 }, { q: -3, r: 1 },
  { q: -3, r: 0 }, { q: -2, r: -1 }, { q: -1, r: -2 },
  { q: 0, r: -3 }, { q: 1, r: -3 }, { q: 2, r: -3 },
  { q: 3, r: -3 }, { q: 3, r: -2 }, { q: 3, r: -1 },
].map((cell) => Object.freeze(cell)));

/** P02 ring T: clockwise radius-two cells, starting at (2, 0). */
export const RING_TWO: readonly Hex[] = Object.freeze([
  { q: 2, r: 0 }, { q: 1, r: 1 }, { q: 0, r: 2 },
  { q: -1, r: 2 }, { q: -2, r: 2 }, { q: -2, r: 1 },
  { q: -2, r: 0 }, { q: -1, r: -1 }, { q: 0, r: -2 },
  { q: 1, r: -2 }, { q: 2, r: -2 }, { q: 2, r: -1 },
].map((cell) => Object.freeze(cell)));
