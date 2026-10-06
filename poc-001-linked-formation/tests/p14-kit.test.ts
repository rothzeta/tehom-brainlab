import { expect, test } from 'vitest';
import { ABILITIES } from '../src/content/brood';
import { createPatrol } from '../src/content/patrol';
import { abilityLegality, applyAbility } from '../src/core/abilities';
import type { AbilityRequest, AbilityRules } from '../src/core/abilities';
import { applyAttack } from '../src/core/damage';
import { formations } from '../src/core/formation';
import { selectProtection } from '../src/core/intents';
import { previewCommand, previewFacts } from '../src/core/preview';
import { appendAcceptedCommand, createRunRecord, replayRun } from '../src/core/run-record';
import type { CombatState } from '../src/core/state';
import { applyCommand } from '../src/core/transition';

// Controlled inputs exercise arithmetic independently of provisional production tuning.
const rules: AbilityRules = { clawDamage: 8, stingDamage: 9, impaleDamage: 11, galeDamage: 7,
  damageRules: { directionalReduction: 3, shelterReduction: 5, closeThreshold: 2 } };
function fixture(): CombatState {
  const base = createPatrol();
  return { ...base, brood: base.brood.map(entity => ({ ...entity, hp: 40, maxHp: 40 })),
    enemies: [{ id: 'guard', cell: { q: 0, r: 0 }, facing: 2, hp: 80, maxHp: 80 },
      { id: 'target', cell: { q: 1, r: 1 }, facing: 0, hp: 80, maxHp: 80 }],
    protections: [{ sourceId: 'guard', targetId: 'target' }], declaredIntentions: [] };
}
const request = (state: CombatState, abilityId: string, actorId: string, targetId: string): AbilityRequest =>
  ({ expectedRevision: state.revision, abilityId, actorId, targetId });
const hp = (state: CombatState, id: string) => [...state.brood, ...state.enemies].find(e => e.id === id)!.hp;
function accepted<T extends { ok: boolean }>(result: T): Extract<T, { ok: true }> {
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error('Unexpected rejection');
  return result as Extract<T, { ok: true }>;
}
function hit(state: CombatState, rawDamage: number, eventId: string, recipientIds = ['ugallu']) {
  return accepted(applyAttack(state, { kind: 'attack', expectedRevision: state.revision, eventId,
    sourceId: 'guard', recipientIds, rawDamage, bypassProtection: false }, rules.damageRules));
}

test.each(formations())('P14: self-Shelter is eligible and consumed once in %j', formation => {
  const state = { ...fixture(), formation };
  const action = request(state, 'shelter', 'ugallu', 'ugallu');
  expect(abilityLegality(state, action, rules)).toEqual({ ok: true });
  const sheltered = accepted(applyAbility(state, action, rules)).state;
  const facts = previewFacts(sheltered);
  expect(facts.available && facts.shelters[0]?.eligible).toBe(true);
  const zero = hit(sheltered, 0, 'zero');
  expect(zero.state.shelters).toEqual(sheltered.shelters);
  const damage = rules.damageRules.shelterReduction + 2;
  const first = hit(zero.state, damage, 'first');
  expect(hp(first.state, 'ugallu')).toBe(hp(state, 'ugallu') - (damage - rules.damageRules.shelterReduction));
  expect(first.events).toContainEqual({ type: 'shelter-consumed', shelterId: sheltered.shelters[0]!.id,
    targetId: 'ugallu', eligible: true });
  expect(first.state.shelters).toEqual([]);
  const second = hit(first.state, damage, 'second');
  expect(hp(second.state, 'ugallu')).toBe(hp(first.state, 'ugallu') - damage);
  expect(first.state.actedIds).toEqual(['ugallu']);
});

test('P14: self-Shelter clamps reduction to the hit and expires after enemy phase', () => {
  const state = fixture();
  const sheltered = accepted(applyAbility(state, request(state, 'shelter', 'ugallu', 'ugallu'), rules)).state;
  const blocked = hit(sheltered, rules.damageRules.shelterReduction - 1, 'small');
  expect(hp(blocked.state, 'ugallu')).toBe(hp(state, 'ugallu'));
  expect(blocked.state.shelters).toEqual([]);
  const patrol = createPatrol();
  const cast = accepted(applyCommand(patrol, { kind: 'useAbility', ...request(patrol, 'shelter', 'ugallu', 'ugallu') })).state;
  const ended = accepted(applyCommand(cast, { kind: 'endPhase', expectedRevision: cast.revision }));
  expect(ended.state.shelters).toEqual([]);
});

test.each(['ugallu', 'girtablilu'])('P14: stacking on %s rejects atomically after identity validation', targetId => {
  const base = fixture();
  const state = { ...base, shelters: [{ id: 'existing', sourceId: 'ugallu', targetId }] };
  const action = request(state, 'shelter', 'ugallu', targetId);
  expect(abilityLegality(state, action, rules)).toEqual({ ok: false, error: { code: 'illegal-target' } });
  expect(applyAbility(state, action, rules)).toEqual({ ok: false, state, events: [], error: { code: 'illegal-target' } });
  const collision = accepted(applyAbility(base, request(base, 'shelter', 'ugallu', targetId), rules)).state.shelters;
  const sameId = { ...base, shelters: collision };
  expect(applyAbility(sameId, action, rules)).toEqual({ ok: false, state: sameId, events: [], error: { code: 'invalid-command' } });
});

test('P14: allied Shelter becomes ineligible after expansion and disappears when source falls', () => {
  const base = fixture();
  const sheltered = accepted(applyAbility(base, request(base, 'shelter', 'ugallu', 'girtablilu'), rules)).state;
  const spread = accepted(applyCommand(sheltered, { kind: 'maneuver', maneuver: 'expand', expectedRevision: sheltered.revision })).state;
  const facts = previewFacts(spread);
  expect(facts.available && facts.shelters[0]?.eligible).toBe(false);
  const struck = hit(spread, 7, 'ally', ['girtablilu']);
  expect(hp(struck.state, 'girtablilu')).toBe(hp(spread, 'girtablilu') - 7);
  const fallen = hit(sheltered, hp(sheltered, 'ugallu'), 'source-death');
  expect(fallen.state.shelters).toEqual([]);
  expect(fallen.events).toContainEqual({ type: 'shelter-removed', shelterId: sheltered.shelters[0]!.id,
    reason: 'source-unavailable' });
});

test.each(['ugallu', 'pazuzu'])('P14: Impale works with %s fallen and agrees with immediate and end-phase previews', fallenId => {
  const base = createPatrol();
  const state = { ...base, formation: { shape: 'spread' as const, orientation: 0 as const },
    brood: base.brood.map(entity => entity.id === fallenId ? { ...entity, hp: 0 } : entity) };
  const command = { kind: 'useAbility' as const, ...request(state, 'impale', 'girtablilu', 'harrier') };
  expect(abilityLegality(state, command)).toEqual({ ok: true });
  const actual = accepted(applyCommand(state, command));
  const preview = accepted(previewCommand(state, command, 0));
  expect(preview.state).toEqual(actual.state);
  expect(preview.events).toEqual(actual.events);
  const end = applyCommand(actual.state, { kind: 'endPhase', expectedRevision: actual.state.revision });
  expect(preview.forecast.kind).toBe('transition');
  if (preview.forecast.kind !== 'transition') throw new Error('Missing forecast');
  expect(preview.forecast.state).toEqual(end.state);
  expect(preview.forecast.events).toEqual(end.events);
  expect(abilityLegality(state, request(state, 'sting', 'girtablilu', 'harrier'))).toEqual({ ok: true });
});

test.each(['claw', 'sting', 'impale', 'gale'] as const)('P14: %s respects its bypass contract through the real selector', abilityId => {
  const actorId = ABILITIES[abilityId].brood;
  const orientation = actorId === 'ugallu' ? 2 : actorId === 'girtablilu' ? 0 : 4;
  const state = { ...fixture(), formation: { shape: 'spread' as const, orientation: orientation as 0 | 2 | 4 } };
  expect(selectProtection(state, { actorId, targetId: 'target', bypassProtection: false }, state.protections).protected).toBe(true);
  const result = accepted(applyAbility(state, request(state, abilityId, actorId, 'target'), rules));
  const reduction = abilityId === 'gale' ? 0 : rules.damageRules.directionalReduction;
  const rawDamage = rules[`${abilityId}Damage`];
  expect(hp(result.state, 'target')).toBe(hp(state, 'target') - rawDamage + reduction);
  expect(result.events.find(event => event.type === 'damage-applied')).toMatchObject({ rawDamage, directionalReduction: reduction });
});

test.each(['clockwise', 'anticlockwise'] as const)('P14: Crosswind %s pivots only owned turnable areas about an off-centre tile', direction => {
  const base = fixture(), origin = { q: 1, r: -2 }, cells = [{ q: 2, r: 0 }];
  const state = { ...base, enemies: base.enemies.map(e => e.id === 'guard' ? { ...e, cell: origin, facing: 0 as const } : e),
    declaredIntentions: [
      { id: 'turn', sourceId: 'guard', kind: 'fixed-area' as const, cells, turnable: true },
      { id: 'fixed', sourceId: 'guard', kind: 'fixed-area' as const, cells, turnable: false },
      { id: 'other', sourceId: 'target', kind: 'fixed-area' as const, cells, turnable: true },
      { id: 'mark', sourceId: 'guard', kind: 'marked-hit' as const, targetId: 'ugallu' },
    ] };
  const result = accepted(applyAbility(state, { ...request(state, 'crosswind', 'pazuzu', 'guard'), direction }, rules));
  expect(result.state.enemies.map(e => e.cell)).toEqual(state.enemies.map(e => e.cell));
  expect(result.state.enemies[0]!.facing).toBe(direction === 'clockwise' ? 1 : 5);
  expect(result.state.declaredIntentions[0]).toEqual({ ...state.declaredIntentions[0],
    cells: direction === 'clockwise' ? [{ q: -1, r: 1 }] : [{ q: 4, r: -3 }] });
  expect(result.state.declaredIntentions.slice(1)).toEqual(state.declaredIntentions.slice(1));
});

test('P14: Crosswind changes protection for a subsequent Impale', () => {
  const state = { ...fixture(), formation: { shape: 'spread' as const, orientation: 0 as const } };
  const action = request(state, 'impale', 'girtablilu', 'target');
  const protectedHit = accepted(applyAbility(state, action, rules));
  const turned = accepted(applyAbility(state, { ...request(state, 'crosswind', 'pazuzu', 'guard'), direction: 'clockwise' }, rules)).state;
  expect(selectProtection(turned, { actorId: 'girtablilu', targetId: 'target', bypassProtection: false }, turned.protections).protected).toBe(false);
  const unprotectedHit = accepted(applyAbility(turned, { ...action, expectedRevision: turned.revision }, rules));
  expect(hp(protectedHit.state, 'target') - hp(unprotectedHit.state, 'target')).toBe(rules.damageRules.directionalReduction);
});

test('P14: a revised-kit attempt replays and p07 kit records fail explicitly', () => {
  let record = createRunRecord(createPatrol(), 'healthy');
  const commands = [
    { kind: 'maneuver' as const, maneuver: 'expand' as const },
    { kind: 'useAbility' as const, actorId: 'ugallu', abilityId: 'shelter', targetId: 'ugallu' },
    { kind: 'useAbility' as const, actorId: 'girtablilu', abilityId: 'impale', targetId: 'censer' },
    { kind: 'endPhase' as const },
  ];
  for (const input of commands) {
    const command = { ...input, expectedRevision: record.finalState.revision };
    record = appendAcceptedCommand(record, command, applyCommand(record.finalState, command));
  }
  const replay = replayRun(JSON.stringify(record));
  expect(replay.state).toEqual(record.finalState);
  expect(replay.events).toEqual(record.events);
  const old = { ...record, rulesVersion: record.rulesVersion.replace(/p14-v1$/, 'p07-v1') };
  expect(() => replayRun(JSON.stringify(old))).toThrow(/unsupported rules version/);
});
