import type { BroodId, EnemyId, PartId } from '../../core/types';

export interface HitRegion { x: number; y: number; width: number; height: number }
export type DrawDescription = { kind: 'rectangle' | 'ellipse'; label: string; color: number; bounds: HitRegion };
export interface PartArt { partId: PartId; draw: DrawDescription; hitRegion: HitRegion }
export type EnemyArt = Partial<Record<PartId, PartArt>>;
export type Portrait = { kind: 'emblem'; key: 'ugallu' | 'girtablilu'; label: string } | { kind: 'shape'; label: string; color: number };
/** Q07 supplies labelled shapes and >=48x48 logical-pixel hit regions. */
export function enemyArt(_enemyId: EnemyId): EnemyArt { return {}; }
export function broodPortrait(broodId: BroodId): Portrait {
  return broodId === 'anzu' ? { kind: 'shape', label: 'Anzû', color: 0x9ac0dc }
    : { kind: 'emblem', key: broodId, label: broodId === 'ugallu' ? 'Ugallu' : 'Girtablilu' };
}
