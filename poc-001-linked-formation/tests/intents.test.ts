import { afterAll, afterEach, describe, expect, test } from 'vitest';
import type { Formation, Orientation } from '../src/core/formation';
import type { Hex } from '../src/core/hex';
import { createInitialState } from '../src/core/state';
import { applyCommand } from '../src/core/transition';
import type { Maneuver } from '../src/core/commands';
import {
  activeLinks, isCloseLinked, isIsolated, selectProtection, selectRecipients, turnEnemyClockwise,
} from '../src/core/intents';
import type { IntentContext, Intention, ProtectionRelation } from '../src/core/intents';
import { frontMask, sectorCells } from '../src/core/sectors';

// Independent P02/P05 fixtures; expected masks never call the selector/transform.
const ring: readonly Hex[] = [
  [3, 0], [2, 1], [1, 2], [0, 3], [-1, 3], [-2, 3],
  [-3, 3], [-3, 2], [-3, 1], [-3, 0], [-2, -1], [-1, -2],
  [0, -3], [1, -3], [2, -3], [3, -3], [3, -2], [3, -1],
].map(([q, r]) => ({ q: q!, r: r! }));
const fronts = [
  [0, 1, 2, 3, 4, 5], [3, 4, 5, 6, 7, 8], [6, 7, 8, 9, 10, 11],
  [9, 10, 11, 12, 13, 14], [12, 13, 14, 15, 16, 17], [15, 16, 17, 0, 1, 2],
];
const slots = {
  compact: [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11], [12, 13, 14], [15, 16, 17]],
  spread: [[0, 6, 12], [3, 9, 15], [6, 12, 0], [9, 15, 3], [12, 0, 6], [15, 3, 9]],
};
const ids = ['ugallu', 'girtablilu', 'pazuzu'];
const areaRecipients = {
  compact: [ids, ids, [], [], [], []],
  spread: [['ugallu'], ['ugallu'], ['pazuzu'], ['pazuzu'], ['girtablilu'], ['girtablilu']],
};
const turnedRecipients = {
  compact: [[], ids, ids, [], [], []],
  spread: [['girtablilu'], ['ugallu'], ['ugallu'], ['pazuzu'], ['pazuzu'], ['girtablilu']],
};
const states: Formation[] = (['compact', 'spread'] as const).flatMap((shape) =>
  [0, 1, 2, 3, 4, 5].map((orientation) => ({ shape, orientation: orientation as Orientation })));
function freeze<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}
function context(formation: Formation, fallenId?: string): IntentContext {
  return freeze({
    ...createInitialState(), formation,
    brood: createInitialState().brood.map((brood) => ({ ...brood, hp: brood.id === fallenId ? 0 : 10 })),
    enemies: [
      { id: 'warder', hp: 10, facing: 0 as const },
      { id: 'censer', hp: 10, facing: 3 as const },
    ],
  });
}
const area: Intention = freeze({ id: 'sweep', sourceId: 'warder', kind: 'fixed-area',
  cells: fronts[0]!.map((i) => ring[i]!), turnable: true });
const hit: Intention = freeze({ id: 'hit', sourceId: 'censer', kind: 'marked-hit', targetId: 'girtablilu' });
const splash: Intention = freeze({ ...hit, id: 'splash', kind: 'marked-splash' });
const relations: readonly ProtectionRelation[] = freeze([{ sourceId: 'warder', targetId: 'censer' }]);

let assertions = 0;
afterEach(() => { assertions += expect.getState().assertionCalls; });
afterAll(() => { console.info(`P05 intent assertions executed: ${assertions}`); });

test.each([0, 1, 2, 3, 4, 5] as const)('AC1: sector and ordered front at facing %i', (facing) => {
  expect(sectorCells(facing)).toEqual(fronts[facing]!.slice(0, 3).map((i) => ring[i]!));
  expect(frontMask(facing)).toEqual(fronts[facing]!.map((i) => ring[i]!));
});

describe.each(states)('$shape orientation $orientation', (formation) => {
  test('AC2/3: committed area and following marks before and after every legal maneuver', () => {
    const input = context(formation);
    const before = structuredClone({ input, area, hit, splash });
    expect(selectRecipients(input, area).recipientIds).toEqual(areaRecipients[formation.shape][formation.orientation]);
    expect(selectRecipients(input, hit).recipientIds).toEqual(['girtablilu']);
    expect(selectRecipients(input, splash, 2).recipientIds).toEqual(formation.shape === 'compact' ? ids : ['girtablilu']);
    const maneuvers: Maneuver[] = ['clockwise', 'anticlockwise', formation.shape === 'compact' ? 'expand' : 'contract'];
    for (const maneuver of maneuvers) {
      const result = applyCommand({ ...createInitialState(), ...input },
        { kind: 'maneuver', expectedRevision: 0, maneuver });
      expect(result.ok).toBe(true);
      if (!result.ok) throw new Error('Fixture maneuver rejected');
      const next = freeze({ ...input, formation: result.state.formation });
      const { shape, orientation } = next.formation;
      const fixed = selectRecipients(next, area);
      expect(fixed.cells).toEqual(fronts[0]!.map((i) => ring[i]!));
      expect(fixed.recipientIds).toEqual(areaRecipients[shape][orientation]);
      expect(selectRecipients(next, hit)).toEqual({ reason: 'resolved', recipientIds: ['girtablilu'],
        cells: [ring[slots[shape][orientation]![1]!]!] });
      expect(selectRecipients(next, splash, 2).recipientIds).toEqual(shape === 'compact' ? ids : ['girtablilu']);
    }
    // Repeated previews/selection of an unrelated mark cannot rewrite declarations.
    selectRecipients(input, { ...hit, targetId: 'pazuzu' });
    expect({ input, area, hit, splash }).toEqual(before);
  });

  test('AC4: explicit turn changes only its own turnable area, including recipient geometry', () => {
    const input = context(formation);
    const declarations: readonly Intention[] = freeze([area, hit, splash,
      { ...area, id: 'fixed', turnable: false }, { ...area, id: 'other', sourceId: 'censer' }]);
    const before = structuredClone({ input, declarations });
    const result = turnEnemyClockwise(input.enemies[0]!, declarations);
    expect(result.ok).toBe(true);
    expect(result.enemy.facing).toBe(1);
    expect(result.intentions[0]).toEqual({ ...area, cells: fronts[1]!.map((i) => ring[i]!) });
    expect(result.intentions.slice(1)).toEqual(declarations.slice(1));
    expect(result.events).toEqual([
      { type: 'facing-changed', sourceId: 'warder', before: 0, after: 1 },
      { type: 'intention-turned', sourceId: 'warder', intentionId: 'sweep',
        beforeCells: fronts[0]!.map((i) => ring[i]!), afterCells: fronts[1]!.map((i) => ring[i]!) },
    ]);
    expect(selectRecipients(input, result.intentions[0]!).recipientIds)
      .toEqual(turnedRecipients[formation.shape][formation.orientation]);
    expect({ input, declarations }).toEqual(before);
  });

  test.each([undefined, 'girtablilu'])('AC6: protection and live links/isolation, fallen=%s', (fallen) => {
    const input = context(formation, fallen);
    const before = structuredClone(input);
    const living = ids.filter((id) => id !== fallen);
    const expectedPairs = fallen ? [['ugallu', 'pazuzu']] :
      [['ugallu', 'girtablilu'], ['ugallu', 'pazuzu'], ['girtablilu', 'pazuzu']];
    const links = activeLinks(input, 2);
    expect(links.map(({ fromId, toId }) => [fromId, toId])).toEqual(expectedPairs);
    expect(links.map(({ state }) => state)).toEqual(expectedPairs.map(() => formation.shape === 'compact' ? 'close' : 'stretched'));
    for (const id of ids) {
      expect(isIsolated(input, id, 2)).toBe(living.includes(id) && formation.shape === 'spread');
      expect(isCloseLinked(input, 'ugallu', id, 2))
        .toBe(id !== 'ugallu' && living.includes(id) && formation.shape === 'compact');
      const selection = selectProtection(input, { actorId: id, targetId: 'censer', bypassProtection: false }, relations);
      const protects = living.includes(id) && areaRecipients[formation.shape][formation.orientation]!.includes(id);
      expect(selection.protected).toBe(protects);
      expect(selection.sourceIds).toEqual(protects ? ['warder'] : []);
    }
    expect(selectRecipients(input, splash, 2).recipientIds)
      .toEqual(fallen ? [] : formation.shape === 'compact' ? ids : ['girtablilu']);
    expect(input).toEqual(before);
  });
});

test.each([0, 1, 2, 3, 4, 5] as const)('AC4: clockwise turn from %i, wrap 5 to 0', (facing) => {
  const enemy = freeze({ id: 'warder', hp: 10, facing });
  const declaration: Intention = freeze({ ...area, cells: fronts[facing]!.map((i) => ring[i]!) });
  const declarations = freeze([declaration, { ...hit, sourceId: 'warder' }, { ...splash, sourceId: 'warder' }]);
  const before = structuredClone({ enemy, declarations });
  const nextFacing = ([1, 2, 3, 4, 5, 0] as const)[facing];
  const result = turnEnemyClockwise(enemy, declarations);
  expect(result.enemy.facing).toBe(nextFacing);
  expect(result.intentions[0]).toEqual({ ...declaration, cells: fronts[nextFacing]!.map((i) => ring[i]!) });
  expect(result.intentions.slice(1)).toEqual(declarations.slice(1));
  expect({ enemy, declarations }).toEqual(before);
});

test('AC5: each fallen source cancels; marked target fizzle cancels the whole splash without retargeting', () => {
  const input = context({ shape: 'compact', orientation: 0 });
  const deadSources = freeze({ ...input, enemies: input.enemies.map((enemy) => ({ ...enemy, hp: 0 })) });
  for (const declaration of [area, hit, splash]) {
    expect(selectRecipients(deadSources, declaration)).toEqual({ reason: 'source-fallen', recipientIds: [], cells: [] });
    expect(selectRecipients(input, { ...declaration, sourceId: 'missing' }).reason).toBe('source-missing');
  }
  const deadMark = context(input.formation, 'girtablilu');
  for (const declaration of [hit, splash]) {
    expect(selectRecipients(deadMark, declaration)).toEqual({ reason: 'target-fallen', recipientIds: [], cells: [] });
    expect(selectRecipients(input, { ...declaration, targetId: 'missing' } as Intention).reason).toBe('target-missing');
  }
  expect(selectRecipients(context(input.formation, 'ugallu'), splash, 2).recipientIds).toEqual(['girtablilu', 'pazuzu']);
  expect(selectRecipients(deadMark, area).recipientIds).toEqual(['ugallu', 'pazuzu']);
  const enemy = deadSources.enemies[0]!;
  expect(turnEnemyClockwise(enemy, [area])).toEqual({ ok: false, reason: 'source-fallen', enemy,
    intentions: [area], events: [] });
});

test('AC6: lone survivor is isolated; fallen Brood cannot be isolated or maintain active links', () => {
  const base = context({ shape: 'compact', orientation: 0 });
  const input = freeze({ ...base, brood: base.brood.map((entity) => ({ ...entity,
    hp: entity.id === 'ugallu' ? 10 : 0 })) });
  expect(activeLinks(input, 2)).toEqual([]);
  expect(isIsolated(input, 'ugallu', 2)).toBe(true);
  expect(isIsolated(input, 'girtablilu', 2)).toBe(false);
  expect(isIsolated(input, 'missing', 2)).toBe(false);
});

test('Close and splash boundaries use explicit tunable thresholds inclusively', () => {
  const input = context({ shape: 'compact', orientation: 0 });
  expect(selectRecipients(input, { ...splash, targetId: 'ugallu' } as Intention, 2).recipientIds).toEqual(ids);
  expect(selectRecipients(input, { ...splash, targetId: 'ugallu' } as Intention, 1).recipientIds).toEqual(['ugallu', 'girtablilu']);
  expect(selectRecipients(input, splash, 0).recipientIds).toEqual(['girtablilu']);
  expect(isCloseLinked(input, 'ugallu', 'pazuzu', 2)).toBe(true);
  expect(isCloseLinked(input, 'ugallu', 'pazuzu', 1)).toBe(false);
  expect(isCloseLinked(input, 'pazuzu', 'ugallu', 2)).toBe(true);
  expect(isIsolated(input, 'girtablilu', 0)).toBe(true);
  expect(activeLinks(context({ shape: 'spread', orientation: 0 }), 6).every(({ state }) => state === 'close')).toBe(true);
});

test('Protection explains bypass, unavailable actor/target/source, and outside-sector', () => {
  const input = context({ shape: 'compact', orientation: 0 });
  const attack = freeze({ actorId: 'ugallu', targetId: 'censer', bypassProtection: false });
  expect(selectProtection(input, attack, relations).reason).toBe('protected');
  expect(selectProtection(input, { ...attack, bypassProtection: true }, relations))
    .toEqual({ protected: false, sourceIds: [], checks: [], reason: 'bypassed' });
  for (const actorId of ['missing', 'ugallu']) {
    expect(selectProtection(context(input.formation, 'ugallu'), { ...attack, actorId }, relations).reason).toBe('actor-unavailable');
  }
  for (const targetId of ['missing', 'censer']) {
    const dead = freeze({ ...input, enemies: input.enemies.map((enemy) => ({ ...enemy, hp: 0 })) });
    expect(selectProtection(dead, { ...attack, targetId }, relations).reason).toBe('target-unavailable');
  }
  const sourceDead = freeze({ ...input, enemies: input.enemies.map((enemy) => ({ ...enemy,
    hp: enemy.id === 'warder' ? 0 : enemy.hp })) });
  expect(selectProtection(sourceDead, attack, relations).checks).toEqual([{ sourceId: 'warder', reason: 'source-fallen' }]);
  expect(selectProtection(input, attack, [{ sourceId: 'absent', targetId: 'censer' }]).checks)
    .toEqual([{ sourceId: 'absent', reason: 'source-missing' }]);
  expect(selectProtection(context({ shape: 'compact', orientation: 2 }), attack, relations).checks)
    .toEqual([{ sourceId: 'warder', reason: 'outside-sector' }]);
  expect(selectProtection(input, attack, [{ sourceId: 'warder', targetId: 'other' }]).protected).toBe(false);
  const turned = turnEnemyClockwise(input.enemies[0]!, [area]);
  expect(selectProtection({ ...input, enemies: [turned.enemy, input.enemies[1]!] }, attack, relations).protected).toBe(false);
});

test('Public IDs and ordering are independent of entity array order; protection sources deduplicate', () => {
  const input = context({ shape: 'compact', orientation: 0 });
  const renamed = freeze({ ...input, brood: [...input.brood].reverse().map((entity) => ({ ...entity, id: `id-${entity.id}` })),
    enemies: [...input.enemies].reverse() });
  expect(selectRecipients(renamed, area).recipientIds).toEqual(['id-ugallu', 'id-girtablilu', 'id-pazuzu']);
  expect(selectRecipients(renamed, { ...splash, targetId: 'id-girtablilu' } as Intention, 2).recipientIds)
    .toEqual(['id-ugallu', 'id-girtablilu', 'id-pazuzu']);
  expect(activeLinks(renamed, 2).map(({ fromId, toId }) => [fromId, toId])).toEqual([
    ['id-ugallu', 'id-girtablilu'], ['id-ugallu', 'id-pazuzu'], ['id-girtablilu', 'id-pazuzu'],
  ]);
  const twoSources = freeze({ ...renamed, enemies: [...renamed.enemies, { id: 'another', hp: 10, facing: 0 as const }] });
  const duplicateRelations = freeze([...relations, ...relations, { sourceId: 'another', targetId: 'censer' }]);
  const selection = selectProtection(twoSources, { actorId: 'id-ugallu', targetId: 'censer', bypassProtection: false }, duplicateRelations);
  expect(selection.sourceIds).toEqual(['another', 'warder']);
  expect(selection).toEqual(selectProtection(twoSources,
    { actorId: 'id-ugallu', targetId: 'censer', bypassProtection: false }, [...duplicateRelations].reverse()));
});

test.each([-1, 6, 0.5, NaN, Infinity])('Reject invalid facing %s without normalization', (value) => {
  expect(() => sectorCells(value as Orientation)).toThrow(RangeError);
  expect(() => frontMask(value as Orientation)).toThrow(RangeError);
  expect(() => turnEnemyClockwise({ id: 'warder', hp: 10, facing: value as Orientation }, [area])).toThrow(RangeError);
});

test.each([-1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])('Reject invalid distance threshold %s', (value) => {
  const input = context({ shape: 'compact', orientation: 0 });
  expect(() => selectRecipients(input, splash, value)).toThrow(RangeError);
  expect(() => activeLinks(input, value)).toThrow(RangeError);
  expect(() => isIsolated(input, 'ugallu', value)).toThrow(RangeError);
});
