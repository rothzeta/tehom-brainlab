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

/** The fixed P02 arena: centre plus two rings (19 cells); order unspecified. */
export function boardCells(): readonly Hex[] {
  const cells: Hex[] = [];
  for (let q = -2; q <= 2; q += 1) {
    for (let r = -2; r <= 2; r += 1) {
      const cell = { q, r };
      if (hexDistance(cell, { q: 0, r: 0 }) <= 2) cells.push(cell);
    }
  }
  return cells;
}

/** P02 ring S: clockwise radius-one cells, starting at (1, 0). */
export const RING_ONE: readonly Hex[] = Object.freeze([
  { q: 1, r: 0 }, { q: 0, r: 1 }, { q: -1, r: 1 },
  { q: -1, r: 0 }, { q: 0, r: -1 }, { q: 1, r: -1 },
].map((cell) => Object.freeze(cell)));

/** P02 ring T: clockwise radius-two cells, starting at (2, 0). */
export const RING_TWO: readonly Hex[] = Object.freeze([
  { q: 2, r: 0 }, { q: 1, r: 1 }, { q: 0, r: 2 },
  { q: -1, r: 2 }, { q: -2, r: 2 }, { q: -2, r: 1 },
  { q: -2, r: 0 }, { q: -1, r: -1 }, { q: 0, r: -2 },
  { q: 1, r: -2 }, { q: 2, r: -2 }, { q: 2, r: -1 },
].map((cell) => Object.freeze(cell)));

/** Cells reserved for enemies: centre, then clockwise ring-two edges. */
export const ENEMY_CELLS: readonly Hex[] = Object.freeze([
  { q: 0, r: 0 }, ...[1, 3, 5, 7, 9, 11].map(index => RING_TWO[index]!),
].map(cell => Object.freeze(cell)));
