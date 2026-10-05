import { afterAll, afterEach, describe, expect, test } from 'vitest';
import { boardCells, hexDistance, RING_ONE, RING_TWO, validateHex } from '../src/core/hex';
import type { Hex } from '../src/core/hex';
import {
  contractFormation, expandFormation, formationLinks, formationPositions, formations,
  rotateAnticlockwise, rotateClockwise, validateFormation,
} from '../src/core/formation';
import type { Formation, Orientation } from '../src/core/formation';

// Independent fixture transcribed from P02, rather than copied from module output.
const ringOne = [
  [1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1], [1, -1],
].map(([q, r]) => ({ q: q!, r: r! }));
const ringTwo = [
  [2, 0], [1, 1], [0, 2], [-1, 2], [-2, 2], [-2, 1],
  [-2, 0], [-1, -1], [0, -2], [1, -2], [2, -2], [2, -1],
].map(([q, r]) => ({ q: q!, r: r! }));
const compactCells = [
  [[1, 0], [-1, 1], [0, -1]], [[0, 1], [-1, 0], [1, -1]],
  [[-1, 1], [0, -1], [1, 0]], [[-1, 0], [1, -1], [0, 1]],
  [[0, -1], [1, 0], [-1, 1]], [[1, -1], [0, 1], [-1, 0]],
].map((cells) => cells.map(([q, r]) => ({ q: q!, r: r! })));
const roster = ['ugallu', 'girtablilu', 'pazuzu'];
const states: Formation[] = (['compact', 'spread'] as const).flatMap((shape) =>
  [0, 1, 2, 3, 4, 5].map((orientation) => ({ shape, orientation: orientation as Orientation })));
const cellKey = (cell: Hex) => `${cell.q},${cell.r}`;
const serializePositions = (state: Formation) => JSON.stringify(formationPositions(state));

// Report the actual matcher count, not a count inferred from loop sizes.
let assertions = 0;
afterEach(() => { assertions += expect.getState().assertionCalls; });
afterAll(() => { console.info(`P02 formation assertions executed: ${assertions}`); });

test('C1: board is exactly the 19 unique integer cells within radius two', () => {
  expect.assertions(6);
  const cells = boardCells();
  expect(cells).toHaveLength(19);
  expect(new Set(cells.map(cellKey)).size).toBe(19);
  expect(cells.every(({ q, r }) => Number.isInteger(q) && Number.isInteger(r)
    && Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r)) <= 2)).toBe(true);
  expect(new Set(cells.filter((cell) => hexDistance(cell, { q: 0, r: 0 }) === 2).map(cellKey)))
    .toEqual(new Set(ringTwo.map(cellKey)));
  expect(new Set(cells.filter((cell) => hexDistance(cell, { q: 0, r: 0 }) === 1).map(cellKey)))
    .toEqual(new Set(ringOne.map(cellKey)));
  expect(cells).toContainEqual({ q: 0, r: 0 });
});

test('C1/C4: all 6 ring indices match S and the downward-screen clockwise convention', () => {
  expect.assertions(11);
  expect(RING_ONE).toEqual(ringOne);
  expect(RING_ONE).toHaveLength(6);
  expect(new Set(RING_ONE.map(cellKey)).size).toBe(6);
  expect(RING_ONE.every((cell) => hexDistance(cell, { q: 0, r: 0 }) === 1)).toBe(true);
  expect(Object.isFrozen(RING_ONE) && RING_ONE.every(Object.isFrozen)).toBe(true);
  for (let index = 0; index < 6; index += 1) {
    const { q, r } = RING_ONE[index]!;
    // Signed zero is the same axial coordinate; arithmetic may produce -0.
    expect(RING_ONE[(index + 1) % 6]).toEqual({ q: -r + 0, r: q + r });
  }
});

test('CT: T contains twelve frozen radius-two cells in clockwise order', () => {
  expect(RING_TWO).toEqual(ringTwo);
  expect(RING_TWO).toHaveLength(12);
  expect(new Set(RING_TWO.map(cellKey)).size).toBe(12);
  expect(RING_TWO.every((cell) => hexDistance(cell, { q: 0, r: 0 }) === 2)).toBe(true);
  expect(Object.isFrozen(RING_TWO) && RING_TWO.every(Object.isFrozen)).toBe(true);
  for (let index = 0; index < 12; index += 1) {
    const { q, r } = RING_TWO[index]!;
    expect(RING_TWO[(index + 2) % 12]).toEqual({ q: -r + 0, r: q + r });
  }
});

test('CT: every Compact pair is at distance 2 in all six orientations', () => {
  for (const orientation of [0, 1, 2, 3, 4, 5] as const) {
    const cells = formationPositions({ shape: 'compact', orientation }).map(({ cell }) => cell);
    for (const [a, b] of [[0, 1], [0, 2], [1, 2]] as const) {
      expect(hexDistance(cells[a]!, cells[b]!)).toBe(2);
    }
  }
});

test('axial distance matches cube distance for every ordered board-cell pair', () => {
  expect.assertions(19 * 19 * 2);
  for (const a of boardCells()) {
    for (const b of boardCells()) {
      const dq = a.q - b.q;
      const dr = a.r - b.r;
      const distance = hexDistance(a, b);
      expect(distance).toBe((Math.abs(dq) + Math.abs(dr) + Math.abs(-dq - dr)) / 2);
      expect(Number.isInteger(distance)).toBe(true);
    }
  }
});

test('C2/C5: enumeration retains twelve unique labelled states including coincident Spread sets', () => {
  expect.assertions(6);
  const actual = formations();
  expect(actual).toHaveLength(12);
  expect(new Set(actual.map(({ shape, orientation }) => `${shape}:${orientation}`)))
    .toEqual(new Set(states.map(({ shape, orientation }) => `${shape}:${orientation}`)));
  expect(new Set(actual.map(serializePositions)).size).toBe(12);
  const zero = formationPositions({ shape: 'spread', orientation: 0 });
  const two = formationPositions({ shape: 'spread', orientation: 2 });
  expect(new Set(zero.map(({ cell }) => cellKey(cell))))
    .toEqual(new Set(two.map(({ cell }) => cellKey(cell))));
  expect(zero).not.toEqual(two);
  expect(zero.map(({ brood }) => brood)).toEqual(two.map(({ brood }) => brood));
});

for (const state of states) {
  describe(`${state.shape} orientation ${state.orientation}`, () => {
    test('C2: positions match the labelled mapping without overlaps on the declared rings', () => {
      expect.assertions(4);
      const positions = formationPositions(state);
      const cells = state.shape === 'compact' ? compactCells[state.orientation]!
        : [0, 4, 8].map((offset) => ringTwo[(2 * state.orientation + offset) % 12]!);
      expect(positions).toEqual(roster.map((brood, index) => ({
        brood, cell: cells[index],
      })));
      expect(positions.map(({ brood }) => brood)).toEqual(roster);
      expect(new Set(positions.map(({ cell }) => cellKey(cell))).size).toBe(3);
      expect(positions.map(({ cell }) => hexDistance(cell, { q: 0, r: 0 })))
        .toEqual(state.shape === 'compact' ? [1, 1, 1] : [2, 2, 2]);
    });

    test('C3: both inverse rotations and six turns restore serialized positions, including wraparound', () => {
      expect.assertions(9);
      const clockwise = rotateClockwise(state);
      const anticlockwise = rotateAnticlockwise(state);
      expect(clockwise).toEqual({ shape: state.shape, orientation: (state.orientation + 1) % 6 });
      expect(anticlockwise).toEqual({ shape: state.shape, orientation: (state.orientation + 5) % 6 });
      expect(serializePositions(rotateAnticlockwise(clockwise))).toBe(serializePositions(state));
      expect(serializePositions(rotateClockwise(anticlockwise))).toBe(serializePositions(state));
      let right = state;
      let left = state;
      for (let turn = 0; turn < 6; turn += 1) {
        right = rotateClockwise(right);
        left = rotateAnticlockwise(left);
      }
      expect(serializePositions(right)).toBe(serializePositions(state));
      expect(serializePositions(left)).toBe(serializePositions(state));
      const rotated = formationPositions(clockwise);
      formationPositions(state).forEach(({ cell: { q, r } }, index) => {
        expect(rotated[index]!.cell).toEqual({ q: -r + 0, r: q + r });
      });
    });

    test('C3: shape changes preserve orientation and roster order and reverse exactly', () => {
      expect.assertions(5);
      const expanded = expandFormation(state);
      const contracted = contractFormation(state);
      expect(expanded).toEqual({ shape: 'spread', orientation: state.orientation });
      expect(contracted).toEqual({ shape: 'compact', orientation: state.orientation });
      expect(formationPositions(expanded).map(({ brood }) => brood)).toEqual(roster);
      expect(formationPositions(contracted).map(({ brood }) => brood)).toEqual(roster);
      const restored = state.shape === 'compact'
        ? contractFormation(expanded) : expandFormation(contracted);
      expect(serializePositions(restored)).toBe(serializePositions(state));
    });

    test('C4: links retain endpoints, integer distances and roster-pair order at explicit threshold two', () => {
      expect.assertions(5);
      const links = formationLinks(state, 2);
      const positions = formationPositions(state);
      expect(links.map(({ from, to }) => [from.brood, to.brood])).toEqual([
        ['ugallu', 'girtablilu'], ['ugallu', 'pazuzu'], ['girtablilu', 'pazuzu'],
      ]);
      expect(links.map(({ from, to }) => [from, to])).toEqual([
        [positions[0], positions[1]], [positions[0], positions[2]], [positions[1], positions[2]],
      ]);
      expect(links.map(({ distance }) => distance)).toEqual(state.shape === 'compact' ? [2, 2, 2] : [4, 4, 4]);
      expect(links.every(({ distance }) => Number.isInteger(distance))).toBe(true);
      expect(links.map(({ state: linkState }) => linkState)).toEqual(
        Array(3).fill(state.shape === 'compact' ? 'close' : 'stretched'));
    });

    test('C6: every operation accepts a deeply frozen state without changing it', () => {
      expect.assertions(7);
      const frozen = Object.freeze({ ...state });
      const before = JSON.stringify(frozen);
      const operations = [validateFormation, formationPositions, formationLinks,
        rotateClockwise, rotateAnticlockwise, expandFormation, contractFormation];
      for (const operation of operations) {
        operation(frozen);
        expect(JSON.stringify(frozen)).toBe(before);
      }
    });
  });
}

test('Close uses an inclusive configurable threshold without changing geometry', () => {
  expect.assertions(4);
  const compact: Formation = { shape: 'compact', orientation: 0 };
  expect(formationLinks(compact, 2).map(({ state }) => state)).toEqual(['close', 'close', 'close']);
  expect(formationLinks(compact, 1).map(({ state }) => state)).toEqual(['stretched', 'stretched', 'stretched']);
  expect(formationLinks({ shape: 'spread', orientation: 0 }, 3).map(({ state }) => state))
    .toEqual(['stretched', 'stretched', 'stretched']);
  expect(formationLinks({ shape: 'spread', orientation: 0 }, 4).map(({ state }) => state))
    .toEqual(['close', 'close', 'close']);
});

const invalidFormations: [string, unknown, string][] = [
  ['null', null, 'Formation shape must be compact or spread'],
  ['missing shape', { orientation: 0 }, 'Formation shape must be compact or spread'],
  ['unknown shape', { shape: 'triangle', orientation: 0 }, 'Formation shape must be compact or spread'],
  ['wrong-case shape', { shape: 'Compact', orientation: 0 }, 'Formation shape must be compact or spread'],
  ...([
    ['negative', -1], ['above boundary', 6], ['fractional', 0.5], ['NaN', NaN],
    ['infinite', Infinity], ['string', '0'], ['missing', undefined],
  ] as const).map(([name, orientation]): [string, unknown, string] =>
    [name, { shape: 'compact', orientation }, 'Formation orientation must be an integer from 0 through 5']),
];
test.each(invalidFormations)('C6: all public formation operations reject %s with documented RangeError', (_name, value, message) => {
  expect.assertions(14);
  const operations = [validateFormation, formationPositions, formationLinks,
    rotateClockwise, rotateAnticlockwise, expandFormation, contractFormation];
  for (const operation of operations) {
    expect(() => operation(value as Formation)).toThrowError(RangeError);
    expect(() => operation(value as Formation)).toThrowError(message);
  }
});

test.each([
  ['null', null], ['missing r', { q: 0 }], ['fractional q', { q: 0.5, r: 0 }],
  ['fractional r', { q: 0, r: -0.5 }], ['NaN', { q: NaN, r: 0 }],
  ['infinite', { q: 0, r: Infinity }], ['string', { q: '0', r: 0 }],
  ['unsafe integer', { q: Number.MAX_SAFE_INTEGER + 1, r: 0 }],
])('C6: public coordinate operations reject %s with documented RangeError', (_name, value) => {
  expect.assertions(6);
  const origin = { q: 0, r: 0 };
  for (const operation of [() => validateHex(value),
    () => hexDistance(value as Hex, origin), () => hexDistance(origin, value as Hex)]) {
    expect(operation).toThrowError(RangeError);
    expect(operation).toThrowError('Hex coordinates must be safe integers');
  }
});

test('C6: hex distance accepts frozen inputs unchanged and rejects unsafe results', () => {
  expect.assertions(5);
  const a = Object.freeze({ q: -3, r: 3 });
  const b = Object.freeze({ q: 0, r: -3 });
  expect(hexDistance(a, b)).toBe(6);
  expect(a).toEqual({ q: -3, r: 3 });
  expect(b).toEqual({ q: 0, r: -3 });
  const unsafe = () => hexDistance({ q: Number.MAX_SAFE_INTEGER, r: 0 }, { q: -1, r: 0 });
  expect(unsafe).toThrowError(RangeError);
  expect(unsafe).toThrowError('Hex distance must be a safe integer');
});

test.each([-1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])('C6: invalid Close threshold %s is rejected', (threshold) => {
  expect.assertions(2);
  const operation = () => formationLinks({ shape: 'compact', orientation: 0 }, threshold);
  expect(operation).toThrowError(RangeError);
  expect(operation).toThrowError('Close threshold must be a nonnegative safe integer');
});
