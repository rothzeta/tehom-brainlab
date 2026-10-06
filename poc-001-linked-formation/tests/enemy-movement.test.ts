import { describe, expect, it } from 'vitest';
import { createPatrol } from '../src/content/patrol';
import { createCrucible } from '../src/content/crucible';
import { ENEMY_ROUTE, relocateEnemies } from '../src/core/enemy-movement';
import { ENEMY_CELLS } from '../src/core/hex';
import { formationPositions, formations } from '../src/core/formation';
import { frontCells } from '../src/core/sectors';
import { selectProtection, selectRecipients } from '../src/core/intents';
import { endEncounterPhase } from '../src/core/rounds';
import { applyCommand } from '../src/core/transition';
import { previewCommand } from '../src/core/preview';
import { appendAcceptedCommand, createRunRecord, parseRunRecord, replayRun } from '../src/core/run-record';
import type { Command, CommandResult } from '../src/core/commands';
import type { CombatEnemy } from '../src/core/state';
import { repositioningFixture } from './browser/repositioning-fixtures';

const slot = (index: number) => ENEMY_ROUTE[(index + ENEMY_ROUTE.length) % ENEMY_ROUTE.length]!;
const enemy = (id: string, index: number, mobile = false, hp = 20): CombatEnemy =>
  ({ id, cell: slot(index), mobile, hp, maxHp: 20, facing: 0, rotatable: false });
function accepted<T extends import('../src/core/state').GameState>(result: CommandResult<T>) {
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(result.error.code);
  return result;
}
const end = (state: ReturnType<typeof createPatrol>) => accepted(applyCommand(state,
  { kind: 'endPhase', expectedRevision: state.revision }));

describe('P16 relocation selector', () => {
  it('derives reserved destinations and keeps them disjoint from every Brood formation', () => {
    expect(ENEMY_ROUTE).toEqual(ENEMY_CELLS.slice(1));
    expect(new Set(ENEMY_ROUTE.map(cell => `${cell.q},${cell.r}`)).size).toBe(ENEMY_ROUTE.length);
    for (const formation of formations()) for (const position of formationPositions(formation)) {
      expect(ENEMY_ROUTE).not.toContainEqual(position.cell);
    }
    expect(ENEMY_ROUTE).not.toContainEqual({ q: 0, r: 0 });
  });
  it.each(ENEMY_ROUTE.map((_, index) => index))('uses clockwise successor with wraparound from slot %i', index => {
    const state = { ...createPatrol(), enemies: [enemy('alternative-id', index, true)] };
    const before = structuredClone(state);
    const result = relocateEnemies(state);
    expect(result.state.enemies[0]!.cell).toEqual(slot(index + 1));
    expect(result.events).toEqual([{ type: 'enemy-moved', sourceId: 'alternative-id',
      round: state.round, from: slot(index), to: slot(index + 1) }]);
    expect(state).toEqual(before);
    expect(result.state.enemies[0]!.facing).toBe(state.enemies[0]!.facing);
  });
  it('falls back one counterclockwise slot, or stays when both neighbours are occupied', () => {
    const state = { ...createPatrol(), enemies: [enemy('mover', 0, true), enemy('blocker', 1)] };
    expect(relocateEnemies(state).state.enemies[0]!.cell).toEqual(slot(-1));
    const blocked = relocateEnemies({ ...state, enemies: [...state.enemies, enemy('other', -1)] });
    expect(blocked.state.enemies).toEqual([...state.enemies, enemy('other', -1)]);
    expect(blocked.events).toEqual([{ type: 'enemy-move-blocked', sourceId: 'mover', round: state.round,
      cell: slot(0), reason: 'occupied' }]);
  });
  it('fallen enemies neither move nor block, while retaining identity and cell', () => {
    const corpse = enemy('corpse', 1, true, 0);
    const state = { ...createPatrol(), enemies: [enemy('mover', 0, true), corpse] };
    const result = relocateEnemies(state);
    expect(result.state.enemies).toEqual([{ ...state.enemies[0]!, cell: slot(1) }, corpse]);
    expect(result.events).toHaveLength(1);
  });
  it('processes movers in array order using prior moves and vacated cells', () => {
    const first = enemy('first', 0, true), second = enemy('second', 1, true);
    const state = { ...createPatrol(), enemies: [first, second] };
    const forward = relocateEnemies(state);
    expect(forward.state.enemies.map(e => e.cell)).toEqual([slot(-1), slot(2)]);
    expect(forward.events.map(e => e.sourceId)).toEqual(['first', 'second']);
    const reversed = relocateEnemies({ ...state, enemies: [second, first] });
    expect(reversed.state.enemies.map(e => e.cell)).toEqual([slot(2), slot(1)]);
    expect(relocateEnemies({ ...state, enemies: [enemy('a', 0, true), enemy('b', 2, true)] })
      .state.enemies.map(e => e.cell)).toEqual([slot(1), slot(3)]);
  });
  it('leaves off-route mobile enemies and absent/false mobile traits stationary', () => {
    const { mobile: _mobile, ...stationary } = enemy('absent', 2);
    const state = { ...createPatrol(), enemies: [{ ...enemy('centre', 0, true), cell: ENEMY_CELLS[0]! },
      stationary, enemy('false', 4)] };
    const result = relocateEnemies(state);
    expect(result.state).toEqual(state);
    expect(result.events).toEqual([{ type: 'enemy-move-blocked', sourceId: 'centre',
      round: state.round, cell: ENEMY_CELLS[0], reason: 'off-route' }]);
  });
});

describe('P16 public round, preview and record contracts', () => {
  it('moves only at the boundary after attacks and Shelter expiry, before budgets and declarations', () => {
    const state = { ...repositioningFixture('corpse'), rotationUsed: true, shapeChangeUsed: true,
      shelters: [{ id: 'test-shelter', sourceId: 'pazuzu', targetId: 'pazuzu' }], actedIds: ['ugallu'] };
    const before = structuredClone(state);
    const result = end(state);
    const types = result.events.map(e => e.type);
    expect(types.indexOf('enemy-moved')).toBeGreaterThan(types.lastIndexOf('attack-settled'));
    expect(types.indexOf('enemy-moved')).toBeGreaterThan(types.indexOf('shelter-removed'));
    expect(types.indexOf('enemy-moved')).toBe(types.indexOf('enemy-phase-ended') + 1);
    expect(types.indexOf('round-started')).toBe(types.indexOf('enemy-moved') + 1);
    expect(types.indexOf('intentions-announced')).toBeGreaterThan(types.indexOf('round-started'));
    expect(result.events.filter(e => e.type === 'enemy-moved')).toHaveLength(1);
    expect(result.state.rotationUsed).toBe(false); expect(result.state.shapeChangeUsed).toBe(false);
    expect(result.state.actedIds).toEqual([]);
    expect(formationPositions(result.state.formation)).toEqual(formationPositions(state.formation));
    expect(state).toEqual(before);
    for (const maneuver of ['clockwise', 'anticlockwise', 'expand'] as const) {
      expect(applyCommand(result.state, { kind: 'maneuver', expectedRevision: result.state.revision, maneuver }).ok).toBe(true);
    }
  });
  it('resolves committed fixed cells before moving and announces fresh areas from the new origin', () => {
    const state = { ...repositioningFixture('corpse'), enemies: [enemy('roamer', 2, true)],
      protections: [], declaredIntentions: [{ id: 'old-area', sourceId: 'roamer', kind: 'fixed-area' as const,
        turnable: true, cells: frontCells(slot(2), 0) }] };
    const oldRecipients = selectRecipients(state, state.declaredIntentions[0]!);
    const result = accepted(endEncounterPhase(state, state.revision, {
      intentions: snapshot => snapshot.declaredIntentions, damage: () => 2, rules: state.patrolRules,
      announce: snapshot => ({ state: { ...snapshot, declaredIntentions: [{ id: 'new-area', sourceId: 'roamer',
        kind: 'fixed-area', turnable: true, cells: frontCells(snapshot.enemies[0]!.cell, 0) }] }, events: [] }),
    }));
    expect(result.events.filter(e => e.type === 'damage-applied').map(e => e.targetId)).toEqual(oldRecipients.recipientIds);
    expect(state.declaredIntentions[0]!.cells).toEqual(frontCells(slot(2), 0));
    expect(result.state.declaredIntentions[0]!.cells).toEqual(frontCells(result.state.enemies[0]!.cell, 0));
  });
  it('uses the moved Warder origin for protection and the computed same-facing recipient example', () => {
    const origin = { q: -2, r: 1 }, destination = { q: -1, r: -1 };
    const state = repositioningFixture('corpse');
    const next = end(state).state;
    expect(next.enemies.find(e => e.id === 'warder')!.cell).toEqual(slot(3));
    const recipients = (cell: typeof origin) => selectRecipients(state, { id: 'example', sourceId: 'warder',
      kind: 'fixed-area', turnable: true, cells: frontCells(cell, 0) }).recipientIds;
    expect(recipients(origin)).toEqual(['girtablilu']);
    expect(recipients(destination)).toEqual(['girtablilu', 'pazuzu']);
    const protectedTarget = next.enemies.find(e => e.hp > 0 && e.id !== 'warder')!.id;
    const protection = (snapshot: ReturnType<typeof createPatrol>) => selectProtection(snapshot, { actorId: 'pazuzu',
      targetId: protectedTarget, bypassProtection: false }, [{ sourceId: 'warder', targetId: protectedTarget }]);
    for (const snapshot of [state, next]) {
      const warder = snapshot.enemies.find(e => e.id === 'warder')!;
      const actor = formationPositions(snapshot.formation).find(p => p.brood === 'pazuzu')!;
      expect(protection(snapshot).protected).toBe(frontCells(warder.cell, warder.facing)
        .some(cell => cell.q === actor.cell.q && cell.r === actor.cell.r));
    }
  });
  it('keeps turnability independent from mobility and retains Crosswind facing when moving', () => {
    const state = repositioningFixture('corpse');
    const turned = accepted(applyCommand(state, { kind: 'useAbility', expectedRevision: state.revision,
      actorId: 'pazuzu', abilityId: 'crosswind', targetId: 'warder', direction: 'clockwise' })).state;
    expect(turned.enemies.map(e => e.cell)).toEqual(state.enemies.map(e => e.cell));
    const moved = end(turned).state;
    expect(moved.enemies[0]!.facing).toBe(turned.enemies[0]!.facing);
    expect(moved.enemies[0]!.cell).not.toEqual(turned.enemies[0]!.cell);
    const nonrotatable = { ...state, enemies: state.enemies.map(e => ({ ...e, rotatable: false })) };
    const rejected = applyCommand(nonrotatable, { kind: 'useAbility', expectedRevision: state.revision,
      actorId: 'pazuzu', abilityId: 'crosswind', targetId: 'warder', direction: 'clockwise' });
    expect(rejected).toMatchObject({ ok: false, error: { code: 'illegal-target' }, events: [] });
    expect(end(nonrotatable).state.enemies[0]!.cell).not.toEqual(state.enemies[0]!.cell);
    const boss = createCrucible();
    const bossTurned = accepted(applyCommand(boss, { kind: 'useAbility', expectedRevision: boss.revision,
      actorId: 'pazuzu', abilityId: 'crosswind', targetId: 'crucible', direction: 'clockwise' })).state;
    const bossEnd = accepted(applyCommand(bossTurned, { kind: 'endPhase', expectedRevision: bossTurned.revision }));
    expect(bossEnd.state.enemies.map(e => e.cell)).toEqual(boss.enemies.map(e => e.cell));
    expect(bossEnd.events.some(e => e.type.startsWith('enemy-mov'))).toBe(false);
  });
  it.each(['victory', 'defeat'] as const)('emits no relocation for terminal %s', phase => {
    const state = repositioningFixture('corpse');
    const terminal = phase === 'victory' ? { ...state, enemies: state.enemies.map(e => ({ ...e, hp: 0 })) }
      : { ...state, brood: state.brood.map(e => ({ ...e, hp: e.id === 'ugallu' ? 1 : 0 })), patrolRules: { ...state.patrolRules,
        warderDamage: 100, censerDamage: 100, harrierDamage: 100, isolatedHarrierDamage: 100 } };
    const result = end(terminal);
    expect(result.state.phase).toBe(phase);
    expect(result.events.some(e => e.type.startsWith('enemy-mov'))).toBe(false);
    expect(result.state.enemies.map(e => e.cell)).toEqual(terminal.enemies.map(e => e.cell));
  });
  it('matches real previews and conditional forecasts across all formations without mutating live state', () => {
    for (const formation of formations()) {
      const state = { ...repositioningFixture('corpse'), formation };
      const bytes = JSON.stringify(state);
      const commands: Command[] = [{ kind: 'endPhase', expectedRevision: 0 },
        ...(['clockwise', 'anticlockwise', 'expand', 'contract'] as const).map(maneuver =>
          ({ kind: 'maneuver' as const, expectedRevision: 0, maneuver })),
        { kind: 'useAbility', expectedRevision: 0, actorId: 'pazuzu', abilityId: 'crosswind', targetId: 'warder', direction: 'clockwise' }];
      for (const command of commands) {
        const preview = previewCommand(state, command, 9), actual = applyCommand(state, command);
        expect(preview.ok).toBe(actual.ok); expect(preview.state).toEqual(actual.state); expect(preview.events).toEqual(actual.events);
        if (preview.ok && preview.forecast.kind === 'transition') {
          const forecast = end(actual.state);
          expect(preview.forecast.state).toEqual(forecast.state); expect(preview.forecast.events).toEqual(forecast.events);
          expect(preview.forecast.enemyEvents.filter(e => e.type === 'enemy-moved')).toEqual(forecast.events.filter(e => e.type === 'enemy-moved'));
        }
        expect(JSON.stringify(state)).toBe(bytes);
      }
    }
  });
  it('records and replays repeated relocation, including a living enemy sharing a corpse cell', () => {
    const initial = repositioningFixture('corpse');
    let state = initial, record = createRunRecord(initial, 'healthy');
    for (let i = 0; i < 8; i++) {
      const command = { kind: 'endPhase' as const, expectedRevision: state.revision };
      const result = end(state); state = result.state;
      record = appendAcceptedCommand(record, command, result);
      const living = state.enemies.filter(e => e.hp > 0);
      expect(new Set(living.map(e => `${e.cell.q},${e.cell.r}`)).size).toBe(living.length);
      for (const entity of living) expect(ENEMY_CELLS).toContainEqual(entity.cell);
      expect(replayRun(JSON.stringify(record))).toEqual({ state, events: record.events, commands: i + 1 });
    }
    const first = end(initial).state;
    expect(first.enemies[0]!.cell).toEqual(first.enemies[1]!.cell);
    expect(parseRunRecord(JSON.stringify(record)).recordVersion).toBe(record.recordVersion);
  });
  it.each(['false', 1, null])('rejects a non-boolean mobile trait: %s', mobile => {
    const record = createRunRecord(repositioningFixture(), 'healthy');
    const malformed = { ...record, initialState: { ...record.initialState,
      enemies: record.initialState.enemies.map(e => ({ ...e, mobile })) } };
    expect(() => parseRunRecord(JSON.stringify(malformed))).toThrow(/enemy identity/);
  });
});
