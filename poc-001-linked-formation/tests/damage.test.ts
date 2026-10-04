import { afterAll, afterEach, expect, test } from 'vitest';
import type { Command, CommandResult, ErrorCode } from '../src/core/commands';
import { applyAttack } from '../src/core/damage';
import type { AttackCommand, DamageRules } from '../src/core/damage';
import { formationPositions } from '../src/core/formation';
import { activeLinks, isCloseLinked, selectProtection, selectRecipients } from '../src/core/intents';
import type { Intention } from '../src/core/intents';
import { expireShelters, settleLifecycle } from '../src/core/lifecycle';
import { createInitialState } from '../src/core/state';
import type { CombatState } from '../src/core/state';
import { applyActorAction, applyCommand } from '../src/core/transition';

function freeze<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}

function fixture(overrides: Partial<CombatState> = {}): CombatState {
  return freeze({
    ...createInitialState(),
    brood: createInitialState().brood.map((entity) => ({ ...entity, hp: 10, maxHp: 10 })),
    enemies: [{ id: 'warder', hp: 10, maxHp: 10, facing: 0 },
      { id: 'censer', hp: 10, maxHp: 10, facing: 3 }],
    declaredIntentions: [], protections: [], shelters: [], resolvedAttackIds: [],
    ...overrides,
  });
}

const rules: DamageRules = freeze({ directionalReduction: 2, shelterReduction: 2, closeThreshold: 2 });
const shelter = freeze({ id: 'shelter-g', sourceId: 'ugallu', targetId: 'girtablilu' });
const splash: Intention = freeze({ id: 'splash', kind: 'marked-splash', sourceId: 'censer', targetId: 'girtablilu' });
const hit: Intention = freeze({ id: 'mark-u', kind: 'marked-hit', sourceId: 'warder', targetId: 'ugallu' });

function packet(overrides: Partial<AttackCommand> = {}): AttackCommand {
  return freeze({ kind: 'attack', expectedRevision: 0, eventId: 'hit-1', sourceId: 'censer',
    recipientIds: ['ugallu'], rawDamage: 5, bypassProtection: false, ...overrides });
}

function accepted(result: CommandResult<CombatState>) {
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(`Unexpected rejection: ${result.error.code}`);
  return result;
}

function rejected(result: CommandResult, state: CombatState, code: ErrorCode) {
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error('Unexpected acceptance');
  expect(result.error.code).toBe(code);
  expect(result.state).toBe(state);
  expect(result.events).toEqual([]);
}

function hp(state: CombatState, id: string): number {
  return [...state.brood, ...state.enemies].find((entity) => entity.id === id)!.hp;
}

let assertions = 0;
afterEach(() => { assertions += expect.getState().assertionCalls; });
afterAll(() => { console.info(`P06 damage assertions executed: ${assertions}`); });

test('C1/AC1: ordinary raw five hit through the P03 boundary changes only HP and attack accounting', () => {
  const state = fixture({ actedIds: ['pazuzu'], maneuverUsed: true });
  const before = structuredClone(state);
  const attack = packet();
  const result = accepted(applyCommand(state, attack));
  expect(result.state).toEqual({ ...state, revision: 1,
    brood: state.brood.map((entity) => ({ ...entity, hp: entity.id === 'ugallu' ? 5 : 10 })),
    resolvedAttackIds: ['hit-1'] });
  expect(result.events).toEqual([
    { type: 'attack-settled', eventId: 'hit-1', sourceId: 'censer', revision: 1 },
    { type: 'damage-applied', eventId: 'hit-1', targetId: 'ugallu', rawDamage: 5,
      directionalReduction: 0, shelterReduction: 0, damage: 5, hpBefore: 10, hpAfter: 5 },
  ]);
  expect(state).toEqual(before);
  expect(attack).toEqual(packet());
});

test.each([false, true])('C1/AC1: eligible directional protection subtracts two; bypass=%s', (bypassProtection) => {
  const state = fixture({ protections: [{ sourceId: 'warder', targetId: 'censer' }] });
  const result = accepted(applyAttack(state, packet({ sourceId: 'ugallu', recipientIds: ['censer'], bypassProtection }), rules));
  expect(hp(result.state, 'censer')).toBe(bypassProtection ? 5 : 7);
  expect(result.state.protections).toEqual(state.protections);
});

test('C1: directional mitigation uses impact facing and living source, without stacking relations', () => {
  const base = fixture({ protections: [{ sourceId: 'warder', targetId: 'censer' },
    { sourceId: 'warder', targetId: 'censer' }] });
  const attack = packet({ sourceId: 'ugallu', recipientIds: ['censer'] });
  expect(hp(accepted(applyAttack(base, attack, rules)).state, 'censer')).toBe(7);
  const away = fixture({ ...base, formation: { shape: 'compact', orientation: 2 } });
  expect(hp(accepted(applyAttack(away, attack, rules)).state, 'censer')).toBe(5);
  const dead = fixture({ ...base, enemies: base.enemies.map((entity) => ({ ...entity,
    hp: entity.id === 'warder' ? 0 : 10 })) });
  const result = accepted(applyAttack(dead, attack, rules));
  expect(hp(result.state, 'censer')).toBe(5);
  expect(result.state.protections).toEqual([]);
});

test('C1/C2: directional protection survives its source death within a batch and disappears for the next hit', () => {
  const base = fixture();
  const state = fixture({ enemies: base.enemies.map((entity) => ({ ...entity, hp: entity.id === 'warder' ? 2 : 10 })),
    protections: [{ sourceId: 'warder', targetId: 'censer' }] });
  const attack = packet({ sourceId: 'ugallu', recipientIds: ['warder', 'censer'], rawDamage: 5 });
  const first = accepted(applyAttack(state, attack, rules));
  expect(hp(first.state, 'warder')).toBe(0);
  expect(hp(first.state, 'censer')).toBe(7);
  expect(first.state.protections).toEqual([]);
  expect(applyAttack(state, { ...attack, recipientIds: ['censer', 'warder'] }, rules)).toEqual(first);
  const later = accepted(applyAttack(first.state, packet({ expectedRevision: 1, eventId: 'later',
    sourceId: 'ugallu', recipientIds: ['censer'] }), rules));
  expect(hp(later.state, 'censer')).toBe(2);
});

test.each([0, 1, 2, 3])('C1/AC2: Shelter mitigates positive raw %i and clamps at zero', (rawDamage) => {
  const state = fixture({ shelters: [shelter] });
  const result = accepted(applyAttack(state, packet({ recipientIds: ['girtablilu'], rawDamage }), rules));
  expect(hp(result.state, 'girtablilu')).toBe(10 - Math.max(0, rawDamage - 2));
  expect(result.state.shelters).toEqual(rawDamage === 0 ? [shelter] : []);
  expect(result.events.filter((event) => event.type === 'shelter-consumed')).toEqual(rawDamage === 0 ? [] :
    [{ type: 'shelter-consumed', shelterId: 'shelter-g', targetId: 'girtablilu', eligible: true }]);
  const later = accepted(applyAttack(result.state, packet({ eventId: 'later', expectedRevision: 1,
    recipientIds: ['girtablilu'], rawDamage: 3 }), rules));
  expect(hp(later.state, 'girtablilu')).toBe(rawDamage === 0 ? 9 : hp(result.state, 'girtablilu') - 3);
});

test('AC2: expansion before impact invalidates Shelter and consumes it without refunding action', () => {
  const state = fixture({ shelters: [shelter], actedIds: ['ugallu'] });
  const expanded = applyCommand(state, { kind: 'maneuver', expectedRevision: 0, maneuver: 'expand' });
  expect(expanded.ok).toBe(true);
  if (!expanded.ok) throw new Error('Expansion rejected');
  const atImpact = fixture({ ...state, ...expanded.state });
  const result = accepted(applyAttack(atImpact, packet({ expectedRevision: 1, recipientIds: ['girtablilu'] }), rules));
  expect(hp(result.state, 'girtablilu')).toBe(5);
  expect(result.state.shelters).toEqual([]);
  expect(result.state.actedIds).toEqual(['ugallu']);
  expect(result.state.maneuverUsed).toBe(true);
  expect(result.events).toContainEqual({ type: 'shelter-consumed', shelterId: 'shelter-g', targetId: 'girtablilu', eligible: false });
});

test.each(['fallen', 'missing'] as const)('AC2: %s Shelter source cannot mitigate', (source) => {
  const base = fixture();
  const state = fixture({ brood: base.brood.map((entity) => ({ ...entity, hp: entity.id === 'ugallu' ? 0 : 10 })),
    shelters: [{ ...shelter, sourceId: source === 'missing' ? 'absent' : 'ugallu' }] });
  const result = accepted(applyAttack(state, packet({ recipientIds: ['girtablilu'] }), rules));
  expect(hp(result.state, 'girtablilu')).toBe(5);
  expect(result.state.shelters).toEqual([]);
});

test('AC2: directional bypass leaves eligible Shelter effective; stretched Shelter survives zero raw', () => {
  const state = fixture({ shelters: [shelter] });
  const bypassed = accepted(applyAttack(state, packet({ recipientIds: ['girtablilu'], rawDamage: 3, bypassProtection: true }), rules));
  expect(hp(bypassed.state, 'girtablilu')).toBe(9);
  expect(bypassed.state.shelters).toEqual([]);
  const stretched = fixture({ ...state, formation: { shape: 'spread', orientation: 0 } });
  const zero = accepted(applyAttack(stretched, packet({ recipientIds: ['girtablilu'], rawDamage: 0 }), rules));
  expect(hp(zero.state, 'girtablilu')).toBe(10);
  expect(zero.state.shelters).toEqual([shelter]);
});

test('C1: configurable reduction and Close threshold are honored, with no Shelter stacking', () => {
  const state = fixture({ shelters: [shelter, { ...shelter, id: 'second', sourceId: 'pazuzu' }] });
  const attack = packet({ recipientIds: ['girtablilu'] });
  expect(hp(accepted(applyAttack(state, attack, { ...rules, shelterReduction: 4 })).state, 'girtablilu')).toBe(9);
  expect(hp(accepted(applyAttack(state, attack, { ...rules, closeThreshold: 0 })).state, 'girtablilu')).toBe(5);
  const protectedState = fixture({ protections: [{ sourceId: 'warder', targetId: 'censer' }] });
  const contact = packet({ sourceId: 'ugallu', recipientIds: ['censer'] });
  expect(hp(accepted(applyAttack(protectedState, contact, { ...rules, directionalReduction: 4 })).state, 'censer')).toBe(9);
});

test('C1/C2/AC3: same-blast guardian death uses one snapshot in all six recipient permutations', () => {
  const base = fixture();
  const splashState = fixture({ brood: base.brood.map((entity) => ({ ...entity, hp: entity.id === 'ugallu' ? 2 : 10 })),
    shelters: [shelter], declaredIntentions: [hit, splash] });
  const selected = selectRecipients(splashState, splash, 2);
  expect(new Set(selected.recipientIds)).toEqual(new Set(['ugallu', 'girtablilu', 'pazuzu']));
  const permutations = [
    ['ugallu', 'girtablilu', 'pazuzu'], ['ugallu', 'pazuzu', 'girtablilu'],
    ['girtablilu', 'ugallu', 'pazuzu'], ['girtablilu', 'pazuzu', 'ugallu'],
    ['pazuzu', 'ugallu', 'girtablilu'], ['pazuzu', 'girtablilu', 'ugallu'],
  ];
  const result = accepted(applyAttack(splashState, packet({ recipientIds: selected.recipientIds, rawDamage: 3 }), rules));
  expect(result.state.brood.map(({ id, hp }) => [id, hp])).toEqual([['ugallu', 0], ['girtablilu', 9], ['pazuzu', 7]]);
  expect(result.events).toEqual([
    { type: 'attack-settled', eventId: 'hit-1', sourceId: 'censer', revision: 1 },
    { type: 'damage-applied', eventId: 'hit-1', targetId: 'girtablilu', rawDamage: 3,
      directionalReduction: 0, shelterReduction: 2, damage: 1, hpBefore: 10, hpAfter: 9 },
    { type: 'damage-applied', eventId: 'hit-1', targetId: 'pazuzu', rawDamage: 3,
      directionalReduction: 0, shelterReduction: 0, damage: 3, hpBefore: 10, hpAfter: 7 },
    { type: 'damage-applied', eventId: 'hit-1', targetId: 'ugallu', rawDamage: 3,
      directionalReduction: 0, shelterReduction: 0, damage: 3, hpBefore: 2, hpAfter: 0 },
    { type: 'shelter-consumed', shelterId: 'shelter-g', targetId: 'girtablilu', eligible: true },
    { type: 'fallen', entityId: 'ugallu', owner: 'player' },
    { type: 'intention-cancelled', intentionId: 'mark-u', reason: 'target-fallen' },
  ]);
  for (const recipientIds of permutations) {
    expect(applyAttack(splashState, packet({ recipientIds, rawDamage: 3 }), rules)).toEqual(result);
  }
  const later = accepted(applyAttack(result.state, packet({ expectedRevision: 1, eventId: 'later',
    recipientIds: ['girtablilu'], rawDamage: 3 }), rules));
  expect(hp(later.state, 'girtablilu')).toBe(6);
  // Guardian dies without the protected targets being hit: both unused statuses vanish.
  const state = fixture({ ...splashState, shelters: [shelter, { id: 'shelter-p', sourceId: 'ugallu', targetId: 'pazuzu' }] });
  const guardianOnly = accepted(applyAttack(state, packet({ rawDamage: 3 }), rules));
  expect(guardianOnly.state.shelters).toEqual([]);
  expect(guardianOnly.events.filter((event) => event.type === 'shelter-removed')).toEqual([
    { type: 'shelter-removed', shelterId: 'shelter-g', reason: 'source-unavailable' },
    { type: 'shelter-removed', shelterId: 'shelter-p', reason: 'source-unavailable' },
  ]);
});

test('C2/AC4: overkill nine against HP two clamps to zero, settles death once, and rejects later hits', () => {
  const base = fixture();
  const state = fixture({ brood: base.brood.map((entity) => ({ ...entity, hp: entity.id === 'ugallu' ? 2 : 10 })) });
  const result = accepted(applyAttack(state, packet({ rawDamage: 9 }), rules));
  expect(hp(result.state, 'ugallu')).toBe(0);
  expect(result.events.filter((event) => event.type === 'fallen')).toEqual([{ type: 'fallen', entityId: 'ugallu', owner: 'player' }]);
  const repeated = settleLifecycle(result.state, result.state);
  expect(repeated.state).toBe(result.state);
  expect(repeated.events).toEqual([]);
  rejected(applyAttack(result.state, packet({ expectedRevision: 1, eventId: 'later' }), rules), result.state, 'illegal-target');
});

test('C3/AC5: Fallen keeps its labelled slot and budgets; actions, active links and marks lose eligibility', () => {
  const base = fixture();
  const state = fixture({ brood: base.brood.map((entity) => ({ ...entity, hp: entity.id === 'ugallu' ? 2 : 10 })),
    declaredIntentions: [hit, { ...splash, targetId: 'ugallu' },
      { id: 'area', sourceId: 'warder', kind: 'fixed-area', cells: [{ q: 3, r: 0 }], turnable: false }],
    actedIds: ['pazuzu'], maneuverUsed: true });
  const result = accepted(applyAttack(state, packet(), rules));
  expect(result.state.formation).toEqual(state.formation);
  expect(formationPositions(result.state.formation)).toEqual(formationPositions(state.formation));
  expect(result.state.brood.map(({ id, brood }) => [id, brood])).toEqual(state.brood.map(({ id, brood }) => [id, brood]));
  expect(result.state.actedIds).toEqual(['pazuzu']);
  expect(result.state.maneuverUsed).toBe(true);
  expect(activeLinks(result.state, 2).map(({ fromId, toId }) => [fromId, toId])).toEqual([['girtablilu', 'pazuzu']]);
  expect(isCloseLinked(result.state, 'ugallu', 'girtablilu', 2)).toBe(false);
  expect(result.state.declaredIntentions.map(({ id }) => id)).toEqual(['area']);
  expect(selectRecipients(result.state, hit).reason).toBe('target-fallen');
  rejected(applyActorAction(result.state, { actorId: 'ugallu', expectedRevision: 1, abilityId: 'fixture', targetId: 'censer' }, {
    validate: () => { throw new Error('Fallen action must reject before dispatch'); },
    apply: () => { throw new Error('Fallen action must not apply effects'); },
  }), result.state, 'fallen-actor');
});

test('C3/AC5: a dead Warder cancels its areas/marks and protection without altering another source', () => {
  const area: Intention = { id: 'area-w', sourceId: 'warder', kind: 'fixed-area', cells: [], turnable: true };
  const state = fixture({ protections: [{ sourceId: 'warder', targetId: 'censer' }],
    declaredIntentions: [splash, hit, area] });
  const result = accepted(applyAttack(state, packet({ sourceId: 'ugallu', recipientIds: ['warder'], rawDamage: 10 }), rules));
  expect(result.state.declaredIntentions).toEqual([splash]);
  expect(result.state.protections).toEqual([]);
  expect(selectProtection(result.state, { actorId: 'ugallu', targetId: 'censer', bypassProtection: false }, state.protections).protected).toBe(false);
  expect(result.events.slice(2)).toEqual([
    { type: 'fallen', entityId: 'warder', owner: 'enemy' },
    { type: 'protection-removed', sourceId: 'warder', targetId: 'censer' },
    { type: 'intention-cancelled', intentionId: 'area-w', reason: 'source-fallen' },
    { type: 'intention-cancelled', intentionId: 'mark-u', reason: 'source-fallen' },
  ]);
  const later = accepted(applyAttack(result.state, packet({ expectedRevision: 1, eventId: 'later',
    sourceId: 'ugallu', recipientIds: ['censer'] }), rules));
  expect(hp(later.state, 'censer')).toBe(5);
});

test.each(['victory', 'defeat'] as const)('C3/AC6: final death yields %s and subsequent commands are atomic rejections', (outcome) => {
  const base = fixture();
  const state = fixture(outcome === 'victory'
    ? { enemies: [{ id: 'last', hp: 2, maxHp: 10, facing: 0 }] }
    : { brood: base.brood.map((entity) => ({ ...entity, hp: entity.id === 'ugallu' ? 2 : 0 })) });
  const attack = packet(outcome === 'victory' ? { sourceId: 'ugallu', recipientIds: ['last'], rawDamage: 9 }
    : { rawDamage: 9 });
  const result = accepted(applyCommand(state, attack));
  expect(result.state.phase).toBe(outcome);
  expect(result.events.slice(2)).toEqual([
    { type: 'fallen', entityId: outcome === 'victory' ? 'last' : 'ugallu', owner: outcome === 'victory' ? 'enemy' : 'player' },
    { type: 'combat-ended', outcome },
  ]);
  const commands: Command[] = [
    packet({ expectedRevision: 1, eventId: 'later' }),
    { kind: 'maneuver', expectedRevision: 1, maneuver: 'clockwise' },
    { kind: 'useAbility', expectedRevision: 1, actorId: 'ugallu', abilityId: 'fixture', targetId: 'last' },
    { kind: 'endPhase', expectedRevision: 1 },
  ];
  for (const command of commands) rejected(applyCommand(result.state, command), result.state,
    command.kind === 'useAbility' || command.kind === 'endPhase' ? 'unsupported-command' : 'wrong-phase');
  rejected(applyActorAction(result.state, { expectedRevision: 1, actorId: 'ugallu', abilityId: 'fixture', targetId: 'last' }, {
    validate: () => { throw new Error('Terminal dispatch'); }, apply: () => { throw new Error('Terminal effect'); },
  }), result.state, 'wrong-phase');
  expect(settleLifecycle(result.state, result.state).events).toEqual([]);
});

test('C3/AC6: simultaneous all-dead batch chooses defeat before victory', () => {
  const base = fixture();
  const state = fixture({ brood: base.brood.map((entity) => ({ ...entity, hp: 2 })),
    enemies: [{ id: 'last', hp: 2, maxHp: 10, facing: 0 }] });
  const result = accepted(applyAttack(state, packet({ sourceId: 'last',
    recipientIds: ['last', 'ugallu', 'girtablilu', 'pazuzu'], rawDamage: 9 }), rules));
  expect([...result.state.brood, ...result.state.enemies].every(({ hp }) => hp === 0)).toBe(true);
  expect(result.state.phase).toBe('defeat');
  expect(result.events.filter((event) => event.type === 'combat-ended')).toEqual([{ type: 'combat-ended', outcome: 'defeat' }]);
});

test('C4/AC7: expiry removes unused Shelter once, increments one revision, and leaves round/phase/budgets intact', () => {
  const state = fixture({ phase: 'enemy', shelters: [shelter, { ...shelter, id: 'a', targetId: 'pazuzu' }],
    actedIds: ['ugallu'], maneuverUsed: true });
  const result = expireShelters(state);
  expect(result.state).toEqual({ ...state, shelters: [], revision: 1 });
  expect(result.events).toEqual([
    { type: 'shelter-removed', shelterId: 'a', reason: 'expired' },
    { type: 'shelter-removed', shelterId: 'shelter-g', reason: 'expired' },
  ]);
  expect(expireShelters(result.state)).toEqual({ state: result.state, events: [] });
  expect(expireShelters(result.state).state).toBe(result.state);
  expect(state.shelters).toHaveLength(2);
});

test.each([-1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1, '5', undefined])('boundary: invalid raw amount %s rejects before any effect', (rawDamage) => {
  const state = fixture({ shelters: [shelter] });
  const before = structuredClone(state);
  rejected(applyCommand(state, packet({ rawDamage: rawDamage as number })), state, 'invalid-amount');
  expect(state).toEqual(before);
});

test.each<Partial<AttackCommand>>([
  { eventId: '' }, { eventId: ' ' }, { sourceId: '' }, { recipientIds: ['ugallu', 'ugallu'] },
  { recipientIds: [''] }, { recipientIds: null as unknown as string[] },
  { bypassProtection: 1 as unknown as boolean },
])('boundary: malformed attack %j rejects without effects', (overrides) => {
  const state = fixture({ shelters: [shelter] });
  rejected(applyCommand(state, packet(overrides)), state, 'invalid-command');
});

test.each<[Partial<AttackCommand>, ErrorCode]>([
  [{ sourceId: 'missing' }, 'unknown-actor'], [{ recipientIds: ['missing'] }, 'illegal-target'],
  [{ recipientIds: ['ugallu', 'missing'] }, 'illegal-target'], [{ expectedRevision: 1 }, 'stale-revision'],
])('boundary: invalid IDs/revision %j reject the entire batch', (overrides, error) => {
  const state = fixture({ shelters: [shelter] });
  rejected(applyCommand(state, packet(overrides)), state, error);
});

test('boundary: Fallen sources and already-settled event identities reject; updating revision cannot replay a callback', () => {
  const base = fixture();
  const dead = fixture({ enemies: base.enemies.map((entity) => ({ ...entity, hp: entity.id === 'censer' ? 0 : 10 })) });
  rejected(applyAttack(dead, packet(), rules), dead, 'fallen-actor');
  const first = accepted(applyCommand(base, packet()));
  rejected(applyCommand(first.state, packet()), first.state, 'stale-revision');
  rejected(applyCommand(first.state, packet({ expectedRevision: 1 })), first.state, 'duplicate-attack');
  const plain = createInitialState();
  const noCombat = applyCommand(plain, packet());
  expect(noCombat).toEqual({ ok: false, state: plain, events: [], error: { code: 'invalid-command' } });
});

test.each<Partial<DamageRules>>([{ directionalReduction: -1 }, { shelterReduction: 0.5 }, { closeThreshold: Infinity }])(
  'boundary: invalid experimental tuning %j rejects unchanged', (overrides) => {
    const state = fixture();
    rejected(applyAttack(state, packet(), { ...rules, ...overrides }), state, 'invalid-amount');
  });

test('boundary: an empty resolved area is one deterministic settlement with no damage', () => {
  const state = fixture({ phase: 'enemy', shelters: [shelter] });
  const area: Intention = { id: 'empty-area', sourceId: 'censer', kind: 'fixed-area', cells: [], turnable: false };
  const result = accepted(applyCommand(state, packet({ recipientIds: selectRecipients(state, area).recipientIds })));
  expect(result.state).toEqual({ ...state, revision: 1, resolvedAttackIds: ['hit-1'] });
  expect(result.events).toEqual([{ type: 'attack-settled', eventId: 'hit-1', sourceId: 'censer', revision: 1 }]);
});

test('determinism: serialized replay and entity/effect-array permutations preserve HP, eligibility and ordered events', () => {
  const state = fixture({ shelters: [shelter], declaredIntentions: [hit, splash] });
  const attack = packet({ recipientIds: ['ugallu', 'girtablilu', 'pazuzu'], rawDamage: 3 });
  const before = structuredClone({ state, attack });
  const first = accepted(applyAttack(state, attack, rules));
  expect(applyAttack(freeze(JSON.parse(JSON.stringify(state))), freeze(JSON.parse(JSON.stringify(attack))), rules)).toEqual(first);
  const permuted = fixture({ ...state, brood: [...state.brood].reverse(), enemies: [...state.enemies].reverse(),
    shelters: [...state.shelters].reverse(), declaredIntentions: [...state.declaredIntentions].reverse() });
  const other = accepted(applyAttack(permuted, attack, rules));
  expect(other.events).toEqual(first.events);
  for (const id of ['ugallu', 'girtablilu', 'pazuzu', 'warder', 'censer']) expect(hp(other.state, id)).toBe(hp(first.state, id));
  expect(other.state.phase).toBe(first.state.phase);
  expect({ state, attack }).toEqual(before);
});
