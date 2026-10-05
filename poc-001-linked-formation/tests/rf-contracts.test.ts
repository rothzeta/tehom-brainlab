import { afterAll, afterEach, expect, test } from 'vitest';
import { abilityLegality, applyAbility } from '../src/core/abilities';
import { createPatrol } from '../src/content/patrol';
import { formationPositions, formations } from '../src/core/formation';
import { boardCells, ENEMY_CELLS, hexDistance } from '../src/core/hex';
import { frontCells, frontMask } from '../src/core/sectors';
import { selectProtection, turnEnemy } from '../src/core/intents';
import { announcePatrol } from '../src/core/rounds';
import { appendAcceptedCommand, createRunRecord, parseRunRecord, replayRun, RUN_RULES_VERSION } from '../src/core/run-record';
import { applyCommand } from '../src/core/transition';

let assertions = 0;
afterEach(() => { assertions += expect.getState().assertionCalls; });
afterAll(() => { console.info(`RF contract assertions executed: ${assertions}`); });
const key = (cell: { q: number; r: number }) => `${cell.q},${cell.r}`;
const cells = (pairs: number[][]) => pairs.map(([q, r]) => ({ q: q!, r: r! }));
const origin = { q: 1, r: -2 };
const rules = { warderDamage: 2, censerDamage: 1, harrierDamage: 2,
  isolatedHarrierDamage: 3, splashRadius: 2, closeThreshold: 2,
  damageRules: { directionalReduction: 1, shelterReduction: 1, closeThreshold: 2 } };
const fronts = {
  0: cells([[2,-1],[2,-2],[1,0],[0,0],[1,-1]]),
  1: cells([[1,0],[0,0],[1,-1],[-1,0],[-1,-1],[0,-1]]),
  5: cells([[2,-1],[2,-2]]),
};

test('RF: frozen enemy cells partition the board from all twelve labelled states', () => {
  expect(ENEMY_CELLS).toEqual(cells([[0,0],[1,1],[-1,2],[-2,1],[-1,-1],[1,-2],[2,-1]]));
  expect(Object.isFrozen(ENEMY_CELLS) && ENEMY_CELLS.every(Object.isFrozen)).toBe(true);
  const occupied = new Set(formations().flatMap(formation => formationPositions(formation).map(position => key(position.cell))));
  expect(occupied.size).toBe(12);
  expect(ENEMY_CELLS.every(cell => !occupied.has(key(cell)))).toBe(true);
  expect(new Set([...occupied, ...ENEMY_CELLS.map(key)])).toEqual(new Set(boardCells().map(key)));
  for (const orientation of [0,1,2,3,4,5] as const) {
    const compact = formationPositions({ shape: 'compact', orientation });
    const spread = formationPositions({ shape: 'spread', orientation });
    compact.forEach((position, index) => {
      expect(spread[index]).toEqual({ brood: position.brood, cell: { q: 2*position.cell.q, r: 2*position.cell.r } });
      expect(hexDistance(position.cell, spread[index]!.cell)).toBe(1);
    });
  }
});

test('RF-1: centre equivalence, ordered translated examples and board clipping', () => {
  for (const facing of [0,1,2,3,4,5] as const) {
    expect(frontCells({ q: 0, r: 0 }, facing)).toEqual(frontMask(facing));
    for (const cell of ENEMY_CELLS) {
      const front = frontCells(cell, facing);
      expect(front).not.toContainEqual(cell);
      expect(front.every(entry => boardCells().some(board => key(board) === key(entry)))).toBe(true);
    }
  }
  for (const facing of [0,1,5] as const) expect(frontCells(origin, facing)).toEqual(fronts[facing]);
});

test('RF-2: protection and both Crosswind directions read explicit tile fixtures in all states', () => {
  const compactZero = [['ugallu'],['pazuzu'],['pazuzu'],['girtablilu'],['girtablilu'],['ugallu']];
  const compactOne = [['ugallu','pazuzu'],['girtablilu','pazuzu'],['girtablilu','pazuzu'],['ugallu','girtablilu'],['ugallu','girtablilu'],['ugallu','pazuzu']];
  const spreadZero = [[],['pazuzu'],[],['girtablilu'],[],['ugallu']];
  for (const formation of formations()) {
    const base = createPatrol('healthy', rules);
    const state = { ...base, formation, enemies: base.enemies.map(enemy => enemy.id === 'warder'
      ? { ...enemy, cell: origin, facing: 0 as const } : enemy) };
    const source = state.enemies.find(enemy => enemy.id === 'warder')!;
    for (const direction of ['unchanged','clockwise','anticlockwise'] as const) {
      const enemy = direction === 'unchanged' ? source : turnEnemy(source, state.declaredIntentions, direction).enemy;
      const context = { ...state, enemies: state.enemies.map(entry => entry.id === enemy.id ? enemy : entry) };
      const protectedIds = state.brood.filter(actor => selectProtection(context, { actorId: actor.id,
        targetId: 'censer', bypassProtection: false }, state.protections).protected).map(actor => actor.id);
      const expected = formation.shape === 'compact'
        ? direction === 'clockwise' ? compactOne[formation.orientation] : direction === 'anticlockwise' ? [] : compactZero[formation.orientation]
        : direction === 'clockwise' ? [] : spreadZero[formation.orientation];
      expect(protectedIds).toEqual(expected);
    }
  }
});

test('RF-3: tile-pivoted turn moves only source-owned turnable areas without clipping', () => {
  const enemy = { id: 'source', hp: 10, cell: origin, facing: 0 as const };
  const declarations = [
    { id: 'turn', sourceId: 'source', kind: 'fixed-area' as const, cells: [{ q: 2, r: 0 }], turnable: true },
    { id: 'fixed', sourceId: 'source', kind: 'fixed-area' as const, cells: [{ q: 2, r: 0 }], turnable: false },
    { id: 'other', sourceId: 'other', kind: 'fixed-area' as const, cells: [{ q: 2, r: 0 }], turnable: true },
    { id: 'mark', sourceId: 'source', kind: 'marked-hit' as const, targetId: 'ugallu' },
  ];
  const bytes = JSON.stringify({ enemy, declarations });
  const turned = turnEnemy(enemy, declarations, 'clockwise');
  expect(turned.intentions[0]).toEqual({ ...declarations[0], cells: [{ q: -1, r: 1 }] });
  expect(turned.intentions.slice(1)).toEqual(declarations.slice(1));
  expect(turnEnemy(turned.enemy, turned.intentions, 'anticlockwise').intentions).toEqual(declarations);
  const offBoard = turnEnemy(enemy, [{ id: 'off-board', sourceId: 'source', kind: 'fixed-area', turnable: true, cells: [{ q: 2, r: 0 }] }], 'anticlockwise');
  expect(offBoard.intentions[0]).toMatchObject({ cells: [{ q: 4, r: -3 }] });
  expect(JSON.stringify({ enemy, declarations })).toBe(bytes);
});

test('RF: announcements ignore enemy tiles and maneuvers preserve locked marks', () => {
  const base = createPatrol('healthy', rules);
  const controlled = announcePatrol({ ...base, brood: base.brood.map(entity => ({ ...entity, hp: 10, maxHp: 10 })) });
  expect(controlled.declaredIntentions.map(entry => entry.kind === 'fixed-area' ? undefined : entry.targetId))
    .toEqual(['ugallu','girtablilu','ugallu']);
  const relocated = { ...controlled, enemies: controlled.enemies.map((enemy, index) => ({ ...enemy, cell: ENEMY_CELLS[index]! })) };
  expect(announcePatrol(relocated).declaredIntentions).toEqual(controlled.declaredIntentions);
  for (const formation of formations()) for (const maneuver of ['clockwise','anticlockwise', formation.shape === 'compact' ? 'expand' : 'contract'] as const) {
    const state = { ...relocated, formation };
    const result = applyCommand(state, { kind: 'maneuver', maneuver, expectedRevision: 0 });
    expect(result.ok).toBe(true); expect(result.state.declaredIntentions).toEqual(controlled.declaredIntentions);
  }
});

test.each(['missing','fractional','off-board','brood','duplicate'] as const)('RF: records reject %s enemy placement', variant => {
  const record = JSON.parse(JSON.stringify(createRunRecord(createPatrol(), 'healthy')));
  const enemies = record.initialState.enemies;
  if (variant === 'missing') delete enemies[0].cell;
  else enemies[0].cell = variant === 'fractional' ? { q: 1.5, r: -2 }
    : variant === 'off-board' ? { q: 8, r: 0 } : variant === 'brood' ? { q: 1, r: 0 }
      : { r: enemies[1].cell.r, q: enemies[1].cell.q };
  expect(() => parseRunRecord(JSON.stringify(record))).toThrow(/enemy/);
});

test('RF: new version replays tile snapshots and explicitly rejects old rules', () => {
  expect(RUN_RULES_VERSION).toBe('poc-001-rules-v2/patrol-v2/p07-v1');
  const initial = createPatrol('healthy', rules);
  let record = createRunRecord(initial, 'healthy');
  for (const maneuver of ['expand','clockwise'] as const) {
    // New round resets the allowance through the real transition.
    if (record.finalState.maneuverUsed) {
      const command = { kind: 'endPhase' as const, expectedRevision: record.finalState.revision };
      record = appendAcceptedCommand(record, command, applyCommand(record.finalState, command));
    }
    const command = { kind: 'maneuver' as const, maneuver, expectedRevision: record.finalState.revision };
    record = appendAcceptedCommand(record, command, applyCommand(record.finalState, command));
  }
  const replayed = replayRun(JSON.stringify(record));
  expect(replayed.state).toEqual(record.finalState); expect(replayed.events).toEqual(record.events);
  const old = { ...record, rulesVersion: 'poc-001-rules-v1/patrol-v1/p07-v1' };
  expect(() => parseRunRecord(JSON.stringify(old))).toThrow(/unsupported rules version/);
  const centre = createRunRecord({ ...initial, enemies: initial.enemies.map((enemy, index) => index === 0
    ? { ...enemy, cell: { q: 0, r: 0 } } : enemy) }, 'healthy');
  expect(parseRunRecord(JSON.stringify(centre)).initialState.enemies[0]!.cell).toEqual({ q: 0, r: 0 });
});


test('RF: every living Brood retains its reliable attack on every tiled enemy in all states', () => {
  const abilityRules = { clawDamage: 5, stingDamage: 5, galeDamage: 4, impaleDamage: 7,
    damageRules: rules.damageRules };
  for (const formation of formations()) {
    const base = createPatrol('healthy', rules);
    const state = { ...base, formation, enemies: base.enemies.map((enemy, index) =>
      ({ ...enemy, hp: 30, maxHp: 30, cell: ENEMY_CELLS[index]! })) };
    for (const [actorId, abilityId] of [['ugallu','claw'],['girtablilu','sting'],['pazuzu','gale']] as const) {
      for (const target of state.enemies) {
        const action = { actorId, abilityId, targetId: target.id, expectedRevision: 0 };
        expect(abilityLegality(state, action, abilityRules)).toEqual({ ok: true });
        const result = applyAbility(state, action, abilityRules);
        expect(result.ok).toBe(true); expect(result.state.formation).toEqual(formation);
      }
    }
  }
});
