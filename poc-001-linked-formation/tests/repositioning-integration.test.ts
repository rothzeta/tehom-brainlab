import { expect, it } from 'vitest';
import { createCrucible } from '../src/content/crucible';
import type { CrucibleRules } from '../src/content/crucible';
import type { PatrolState } from '../src/content/patrol';
import { applyAbility, DEFAULT_ABILITY_RULES } from '../src/core/abilities';
import { applyCommand, commandAbilityRules } from '../src/core/transition';
import { appendAcceptedCommand, createRunRecord, replayRun } from '../src/core/run-record';
import { previewCommand } from '../src/core/preview';
import { ENEMY_ROUTE } from '../src/core/enemy-movement';
import { formationPositions } from '../src/core/formation';
import { frontCells } from '../src/core/sectors';
import type { CombatState, GameState } from '../src/core/state';
import type { CommandResult } from '../src/core/commands';
import { repositioningFixture } from './browser/repositioning-fixtures';

function accepted<State extends GameState>(result: CommandResult<State>) {
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(result.error.code);
  return result;
}
function configuredCrucible(reduction: number) {
  const rules: CrucibleRules = {
    bossHp: 4 * (DEFAULT_ABILITY_RULES.clawDamage + DEFAULT_ABILITY_RULES.stingDamage) + 40,
    phaseTwoAt: 0, splashRadius: 2, closeThreshold: 2,
    damageRules: { directionalReduction: reduction, shelterReduction: 3, closeThreshold: 2 },
    patterns: {
      1: { A: { area: 'inner', primaryDamage: 0, secondaryKind: 'marked-hit', secondaryDamage: 0 },
        B: { area: 'sector', primaryDamage: 0, secondaryKind: 'marked-hit', secondaryDamage: 0 } },
      2: { A: { area: 'outer', primaryDamage: 0, secondaryKind: 'marked-splash', secondaryDamage: 0 },
        B: { area: 'fork', primaryDamage: 0, secondaryKind: 'marked-hit', secondaryDamage: 0 } },
    },
  };
  const state = createCrucible('phase-one', rules);
  return { ...state, brood: state.brood.map(entity => ({ ...entity, hp: 40, maxHp: 40 })) };
}
function mobileGuard(): PatrolState {
  const state = repositioningFixture('corpse');
  const actor = formationPositions(state.formation).find(p => p.brood === 'girtablilu')!;
  const origin = ENEMY_ROUTE.findIndex(cell => frontCells(cell, 0)
    .some(front => front.q === actor.cell.q && front.r === actor.cell.r));
  expect(origin).toBeGreaterThanOrEqual(0);
  const hp = configuredCrucible(0).crucibleRules.bossHp;
  return { ...state, protections: [{ sourceId: 'warder', targetId: 'warder' }],
    enemies: state.enemies.map((enemy, index) => ({ ...enemy,
      cell: ENEMY_ROUTE[(origin + index) % ENEMY_ROUTE.length]!,
      hp: index === 1 ? 0 : hp, maxHp: hp })) };
}
function assertGuardDamage(before: CombatState, after: CommandResult, amount: number, reduction: number,
  actorId: string, targetId: string) {
  const source = before.enemies.find(e => e.id === targetId)!;
  const actor = formationPositions(before.formation).find(p => p.brood === actorId)!;
  const guarded = frontCells(source.cell, source.facing).some(cell => cell.q === actor.cell.q && cell.r === actor.cell.r);
  const applied = guarded ? Math.min(amount, reduction) : 0;
  expect(after.events.find(e => e.type === 'damage-applied')).toMatchObject({ targetId,
    rawDamage: amount, directionalReduction: applied, damage: amount - applied });
}

it.each([1, 8])('preserves configured Crucible guard and off-route mobile events in one replay: %i', reduction => {
  const fixture = configuredCrucible(reduction);
  const initial = { ...fixture, enemies: fixture.enemies.map(e => ({ ...e, mobile: true })) };
  const command = { kind: 'useAbility' as const, expectedRevision: 0,
    actorId: 'ugallu', abilityId: 'claw' as const, targetId: 'crucible' };
  const hit = accepted(applyCommand(initial, command));
  assertGuardDamage(initial, hit, DEFAULT_ABILITY_RULES.clawDamage, reduction, 'ugallu', 'crucible');
  expect(previewCommand(initial, command, 0).state).toEqual(hit.state);
  let record = appendAcceptedCommand(createRunRecord(initial, 'phase-one'), command, hit);
  expect(record.configuration.abilityRules.damageRules.directionalReduction).toBe(reduction);
  const endCommand = { kind: 'endPhase' as const, expectedRevision: hit.state.revision };
  const ended = accepted(applyCommand(hit.state, endCommand));
  expect(ended.state.enemies[0]!.cell).toEqual(initial.enemies[0]!.cell);
  expect(ended.events.filter(e => e.type.startsWith('enemy-mov'))).toEqual([
    { type: 'enemy-move-blocked', sourceId: 'crucible', round: initial.round,
      cell: initial.enemies[0]!.cell, reason: 'off-route' },
  ]);
  record = appendAcceptedCommand(record, endCommand, ended);
  expect(replayRun(JSON.stringify(record))).toEqual({ state: ended.state, events: record.events, commands: 2 });
});

it.each([1, 8])('replays actual relocation and explicit encounter-derived mitigation before/after moving: %i', reduction => {
  const abilityRules = commandAbilityRules(configuredCrucible(reduction));
  let state = mobileGuard();
  let record = createRunRecord(state, 'healthy', 'unknown', abilityRules);
  for (let hitNumber = 0; hitNumber < 2; hitNumber++) {
    const command = { kind: 'useAbility' as const, expectedRevision: state.revision,
      actorId: 'girtablilu', abilityId: 'sting' as const, targetId: 'warder' };
    const hit = accepted(applyAbility(state, command, abilityRules));
    assertGuardDamage(state, hit, abilityRules.stingDamage, reduction, 'girtablilu', 'warder');
    record = appendAcceptedCommand(record, command, hit);
    state = hit.state as PatrolState;
    if (hitNumber === 0) {
      const endCommand = { kind: 'endPhase' as const, expectedRevision: state.revision };
      const ended = accepted(applyCommand(state, endCommand));
      expect(previewCommand(state, endCommand, 0).state).toEqual(ended.state);
      expect(ended.events.filter(e => e.type === 'enemy-moved')).toHaveLength(1);
      expect(ended.state.enemies[0]!.cell).toEqual(state.enemies[1]!.cell);
      expect(ended.state.enemies[0]!.cell).not.toEqual(state.enemies[0]!.cell);
      record = appendAcceptedCommand(record, endCommand, ended); state = ended.state;
    }
  }
  expect(record.configuration.abilityRules).toEqual(abilityRules);
  expect(replayRun(JSON.stringify(record))).toEqual({ state, events: record.events, commands: 3 });
});

it('retains patrol default mitigation in live dispatch and records alongside real relocation', () => {
  const initial = mobileGuard();
  const endedCommand = { kind: 'endPhase' as const, expectedRevision: 0 };
  const ended = accepted(applyCommand(initial, endedCommand));
  expect(ended.events.filter(e => e.type === 'enemy-moved')).toHaveLength(1);
  const command = { kind: 'useAbility' as const, expectedRevision: ended.state.revision,
    actorId: 'girtablilu', abilityId: 'sting' as const, targetId: 'warder' };
  const hit = accepted(applyCommand(ended.state, command));
  assertGuardDamage(ended.state, hit, DEFAULT_ABILITY_RULES.stingDamage,
    DEFAULT_ABILITY_RULES.damageRules.directionalReduction, 'girtablilu', 'warder');
  let record = appendAcceptedCommand(createRunRecord(initial, 'healthy'), endedCommand, ended);
  expect(record.configuration.abilityRules).toEqual(DEFAULT_ABILITY_RULES);
  record = appendAcceptedCommand(record, command, hit);
  expect(replayRun(JSON.stringify(record))).toEqual({ state: hit.state, events: record.events, commands: 2 });
});
