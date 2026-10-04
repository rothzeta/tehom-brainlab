import { RING_ONE, RING_TWO, validateHex } from './hex';
import type { Hex } from './hex';
import type { Orientation } from './formation';

export function validateFacing(facing: number): asserts facing is Orientation {
  if (!Number.isInteger(facing) || facing < 0 || facing > 5) {
    throw new RangeError('Facing must be an integer from 0 through 5');
  }
}

/** Encounter-centred sector s is T[2s], T[2s+1], then S[s]. */
export function sectorCells(sector: Orientation): readonly Hex[] {
  validateFacing(sector);
  return [RING_TWO[2 * sector]!, RING_TWO[2 * sector + 1]!, RING_ONE[sector]!];
}

/** Start at facing f, then wrap clockwise: sectors f and (f+1) mod six. */
export function frontMask(facing: Orientation): readonly Hex[] {
  validateFacing(facing);
  return [...sectorCells(facing), ...sectorCells(((facing + 1) % 6) as Orientation)];
}

/** P02 axial clockwise transform; preserve declaration order and normalize -0. */
export function turnCellsClockwise(cells: readonly Hex[]): readonly Hex[] {
  return cells.map((cell) => {
    validateHex(cell);
    const turned = { q: -cell.r + 0, r: cell.q + cell.r };
    validateHex(turned);
    return turned;
  });
}
