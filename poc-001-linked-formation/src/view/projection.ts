import type { Hex } from '../core/hex';

export interface Projection { readonly x: number; readonly y: number; readonly spacing: number }
export interface Pixel { readonly x: number; readonly y: number }

/** P02 downward-positive convention; only the origin and pixel scale are view choices. */
export function projectHex(cell: Hex, projection: Projection): Pixel {
  return {
    x: projection.x + projection.spacing * (cell.q + cell.r / 2),
    y: projection.y + projection.spacing * Math.sqrt(3) * cell.r / 2,
  };
}
