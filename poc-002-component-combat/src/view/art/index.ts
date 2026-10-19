import type { BroodId, EnemyId, PartId } from '../../core/types';

export interface HitRegion { x: number; y: number; width: number; height: number }
export type DrawDescription = {
  kind: 'rectangle' | 'ellipse'; label: string; color: number; bounds: HitRegion;
  alpha?: number; outline?: { color: number; width: number }; crossedOut?: boolean;
};
export interface PartArt { partId: PartId; draw: DrawDescription; hitRegion: HitRegion }
export type EnemyArt = Partial<Record<PartId, PartArt>>;
export type Portrait = { kind: 'emblem'; key: 'ugallu' | 'girtablilu'; label: string } | { kind: 'shape'; label: string; color: number };

/** Q01's prepare-assets.mjs verifies and copies these registered emblems.
 * Use these paths when preloading textures under Portrait.key; never load assets
 * directly from the repository or substitute the POC 001 Pazuzu emblem for Anzû.
 */
export const EMBLEM_SOURCES = {
  ugallu: '/tehom/tokens/ugallu.svg',
  girtablilu: '/tehom/tokens/girtablilu.svg',
} as const;
export const EMBLEM_CREDITS = {
  text: 'Ugallu (lion) and Girtablilu (scorpion): icons made by Lorc, available at Game-icons.net. Licensed under Creative Commons Attribution 3.0 Unported (CC BY 3.0). TEHOM Brainlab removed the opaque black backgrounds and added metadata and dimensions; original white foreground paths were retained.',
  artistUrl: 'http://lorcblog.blogspot.com/',
  sourceUrl: 'https://game-icons.net',
  licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
  creditsUrl: '/tehom/CREDITS.md',
} as const;

/** All geometry is panel-local, in logical pixels on the 1280×720 canvas.
 * Translate draw bounds and hit regions by the same panel origin. Keep panels
 * at native scale to preserve the >=48×48 targets (Phaser Scale.FIT scales the
 * whole canvas). The Warden is displayed alone in its larger panel.
 */
export function enemyPanel(enemyId: EnemyId): HitRegion {
  return { x: 0, y: 0, width: enemyId === 'warden-of-correct-form' ? 512 : 256,
    height: enemyId === 'warden-of-correct-form' ? 512 : 384 };
}

function part(partId: PartId, label: string, kind: DrawDescription['kind'], color: number,
  bounds: HitRegion, hitRegion: HitRegion = { ...bounds }): PartArt {
  return { partId, draw: { kind, label, color, bounds }, hitRegion };
}

/** Labelled diagrams for brief §8. Layout has no combat numbers or rule logic.
 * Regions deliberately leave gaps, including around the Scribe's small parts.
 * Each call owns its descriptions so per-instance presentation stays independent.
 */
export function enemyArt(enemyId: EnemyId): EnemyArt {
  switch (enemyId) {
    case 'celestial-guard': return {
      body: part('body', 'Body', 'ellipse', 0x8395a7, { x: 80, y: 104, width: 96, height: 208 }),
      'weapon-arm': part('weapon-arm', 'Weapon Arm', 'rectangle', 0xc99d66, { x: 8, y: 112, width: 64, height: 120 }),
      'restraining-limb': part('restraining-limb', 'Restraining Limb', 'rectangle', 0x929a69, { x: 184, y: 192, width: 64, height: 152 }),
    };
    case 'naming-scribe': return {
      body: part('body', 'Body', 'ellipse', 0x9986ad, { x: 80, y: 112, width: 96, height: 208 }),
      'inscription-hand': part('inscription-hand', 'Inscription Hand', 'rectangle', 0xd6b780,
        { x: 16, y: 180, width: 32, height: 36 }, { x: 0, y: 160, width: 64, height: 80 }),
      tongue: part('tongue', 'Tongue', 'ellipse', 0xce8e98,
        { x: 104, y: 52, width: 48, height: 24 }, { x: 88, y: 32, width: 80, height: 64 }),
    };
    case 'corrected-beast': return {
      core: part('core', 'Core', 'ellipse', 0xce8e98, { x: 80, y: 144, width: 96, height: 104 }),
      shell: part('shell', 'Shell', 'rectangle', 0xa6a9b1, { x: 32, y: 40, width: 192, height: 80 }),
      'locomotion-organ': part('locomotion-organ', 'Locomotion Organ', 'rectangle', 0x929a69, { x: 48, y: 280, width: 160, height: 72 }),
    };
    case 'warden-of-correct-form': return {
      core: part('core', 'Core', 'ellipse', 0xce8e98, { x: 184, y: 192, width: 144, height: 192 }),
      clamp: part('clamp', 'Clamp', 'rectangle', 0xc99d66, { x: 32, y: 208, width: 120, height: 112 }),
      saw: part('saw', 'Saw', 'ellipse', 0xa6a9b1, { x: 360, y: 208, width: 120, height: 112 }),
      choir: part('choir', 'Choir', 'rectangle', 0x9986ad, { x: 144, y: 48, width: 224, height: 96 }),
    };
  }
}

export type PartVisualState = 'intact' | 'destroyed' | 'shielded';
/** The UI supplies the state from the rules (brief §§4.1, 11). Styling neither
 * decides target legality nor removes hit regions: invalid parts stay inspectable.
 * Draw the outline and cross over the shape and keep the label fully legible.
 */
export function partAppearance(art: PartArt, state: PartVisualState): DrawDescription {
  const draw = { ...art.draw, bounds: { ...art.draw.bounds } };
  switch (state) {
    case 'intact': return draw;
    case 'destroyed': return { ...draw, label: `${draw.label} — destroyed`, color: 0x66717b,
      alpha: 0.45, crossedOut: true };
    case 'shielded': return { ...draw, label: `${draw.label} — shielded`,
      outline: { color: 0xf2d479, width: 4 } };
  }
}

/** Back-to-front, code-drawn arena layers; no imported background texture. */
export function battleBackground(): DrawDescription[] {
  return [
    { kind: 'rectangle', label: '', color: 0x17232e, bounds: { x: 0, y: 0, width: 1280, height: 720 } },
    { kind: 'rectangle', label: '', color: 0x263747, bounds: { x: 32, y: 32, width: 1216, height: 472 } },
    { kind: 'ellipse', label: '', color: 0x354657, bounds: { x: 272, y: 400, width: 736, height: 176 } },
    { kind: 'rectangle', label: '', color: 0x1d2d3c, bounds: { x: 0, y: 592, width: 1280, height: 128 } },
  ];
}

export function broodPortrait(broodId: BroodId): Portrait {
  return broodId === 'anzu' ? { kind: 'shape', label: 'Anzû', color: 0x9ac0dc }
    : { kind: 'emblem', key: broodId, label: broodId === 'ugallu' ? 'Ugallu' : 'Girtablilu' };
}
