import { afterAll, afterEach, expect, test } from 'vitest';
import { ABILITIES, BROOD_RULES_VERSION } from '../src/content/brood';
import type { AbilityId } from '../src/content/brood';
import { abilityLegality, applyAbility } from '../src/core/abilities';
import type { AbilityRequest, AbilityRules, TurnDirection } from '../src/core/abilities';
import type { CommandResult, ErrorCode } from '../src/core/commands';
import type { Formation, Orientation } from '../src/core/formation';
import { applyAttack } from '../src/core/damage';
import { expireShelters } from '../src/core/lifecycle';
import { createInitialState } from '../src/core/state';
import type { CombatState } from '../src/core/state';
import { applyCommand } from '../src/core/transition';

function freeze<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}
function fixture(overrides: Partial<CombatState> = {}): CombatState {
  const initial = createInitialState();
  return freeze({ ...initial,
    brood: initial.brood.map((brood) => ({ ...brood, hp: 10, maxHp: 10 })),
    enemies: [
      { id: 'warder', hp: 20, maxHp: 20, cell: { q: 0, r: 0 }, facing: 0 },
      { id: 'censer', hp: 20, maxHp: 20, cell: { q: 0, r: 0 }, facing: 0 },
      { id: 'unprotected', hp: 20, maxHp: 20, cell: { q: 0, r: 0 }, facing: 0, rotatable: false },
    ],
    protections: [{ sourceId: 'warder', targetId: 'censer' }],
    shelters: [], resolvedAttackIds: [], declaredIntentions: [], ...overrides });
}
// Independent controlled tuning: exact AC arithmetic without freezing future defaults.
const rules: AbilityRules = freeze({ clawDamage: 4, stingDamage: 4, impaleDamage: 6,
  galeDamage: 3, damageRules: { directionalReduction: 2, shelterReduction: 2, closeThreshold: 2 } });
function request(abilityId: AbilityId, overrides: Partial<AbilityRequest> = {}): AbilityRequest {
  const actorId = abilityId === 'claw' || abilityId === 'shelter' ? 'ugallu'
    : abilityId === 'sting' || abilityId === 'impale' ? 'girtablilu' : 'pazuzu';
  return freeze({ actorId, abilityId, targetId: abilityId === 'shelter' ? 'girtablilu' : 'censer',
    expectedRevision: 0, ...(abilityId === 'crosswind' ? { direction: 'clockwise' as const } : {}), ...overrides });
}
function accepted(result: CommandResult<CombatState>) {
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(`Unexpected rejection: ${result.error.code}`);
  return result;
}
function rejected(result: CommandResult<CombatState>, state: CombatState, code: ErrorCode) {
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error('Unexpected success');
  expect(result.error.code).toBe(code);
  expect(result.state).toBe(state);
  expect(result.events).toEqual([]);
}
function hp(state: CombatState, id: string) {
  return [...state.brood, ...state.enemies].find((entity) => entity.id === id)!.hp;
}
function dispatch(state: CombatState, action: AbilityRequest) {
  return applyCommand(state, { kind: 'useAbility', ...action });
}
let assertions = 0;
afterEach(() => { assertions += expect.getState().assertionCalls; });
afterAll(() => { console.info(`P07 ability assertions executed: ${assertions}`); });

test('C1: versioned immutable content names exactly two abilities for each Brood', () => {
  expect(BROOD_RULES_VERSION.trim().length).toBeGreaterThan(0);
  const byBrood = (brood: string) => Object.entries(ABILITIES)
    .filter(([, ability]) => ability.brood === brood).map(([id]) => id).sort();
  expect(byBrood('ugallu')).toEqual(['claw', 'shelter']);
  expect(byBrood('girtablilu')).toEqual(['impale', 'sting']);
  expect(byBrood('pazuzu')).toEqual(['crosswind', 'gale']);
  expect(Object.isFrozen(ABILITIES)).toBe(true);
  expect(Object.values(ABILITIES).every(Object.isFrozen)).toBe(true);
});

test.each<[AbilityId, string, number]>([
  ['claw', 'unprotected', 4], ['claw', 'censer', 2],
  ['sting', 'unprotected', 4], ['sting', 'censer', 2],
  ['gale', 'unprotected', 3], ['gale', 'censer', 3],
])('AC1: %s on %s deals configured %i', (abilityId, targetId, damage) => {
  const state = fixture(abilityId === 'sting' && targetId === 'censer'
    ? { formation: { shape: 'compact', orientation: 4 } } : {});
  const action = request(abilityId, { targetId });
  const before = structuredClone({ state, action });
  expect(abilityLegality(state, action, rules)).toEqual({ ok: true });
  const result = accepted(applyAbility(state, action, rules));
  expect(hp(result.state, targetId)).toBe(20 - damage);
  expect(result.state.brood).toEqual(state.brood);
  expect(result.state.formation).toEqual(state.formation);
  expect(result.state.actedIds).toEqual([action.actorId]);
  expect(result.state.rotationUsed).toBe(false);
  expect(result.state.shapeChangeUsed).toBe(false);
  expect(result.state.revision).toBe(1);
  expect(result.state.phase).toBe('player');
  expect(result.events.filter((event) => event.type === 'damage-applied')).toMatchObject([
    { targetId, damage, hpBefore: 20, hpAfter: 20 - damage },
  ]);
  expect({ state, action }).toEqual(before);
});

test('tuning: explicit nondefault damage and mitigation drive actual effects', () => {
  const state = fixture();
  const tuning: AbilityRules = { ...rules, clawDamage: 9,
    damageRules: { directionalReduction: 3, shelterReduction: 1, closeThreshold: 1 } };
  expect(hp(accepted(applyAbility(state, request('claw'), tuning)).state, 'censer')).toBe(14);
});

test.each([0, 1, 2, 3, 4, 5] as Orientation[])('AC2: protected Impale bypasses in Spread orientation %i', (orientation) => {
  const state = fixture({ formation: { shape: 'spread', orientation },
    enemies: fixture().enemies.map((enemy) => ({ ...enemy, facing: ((orientation + 2) % 6) as Orientation })) });
  const result = accepted(applyAbility(state, request('impale'), rules));
  expect(hp(result.state, 'censer')).toBe(14);
  expect(result.events.filter((event) => event.type === 'damage-applied')).toMatchObject([
    { rawDamage: 6, directionalReduction: 0, damage: 6 },
  ]);
  expect(result.state.actedIds).toEqual(['girtablilu']);
});

test.each(['compact', 'ugallu-fallen', 'pazuzu-fallen', 'both-fallen'] as const)(
  'AC2: %s rejects Impale with no spend; Sting remains', (condition) => {
    const base = fixture();
    const state = fixture({ formation: { shape: condition === 'compact' ? 'compact' : 'spread', orientation: 0 },
      brood: base.brood.map((entity) => ({ ...entity,
        hp: (condition === 'both-fallen' && entity.id !== 'girtablilu')
          || condition === `${entity.id}-fallen` ? 0 : 10 })) });
    const action = request('impale');
    expect(abilityLegality(state, action, rules)).toEqual({ ok: false, error: { code: 'illegal-ability' } });
    rejected(dispatch(state, action), state, 'illegal-ability');
    accepted(dispatch(state, request('sting')));
  });

test('AC3: Shelter installs one status on a living Close ally, with one actor cost', () => {
  const state = fixture();
  const result = accepted(dispatch(state, request('shelter')));
  expect(result.state.shelters).toHaveLength(1);
  expect(result.state.shelters[0]).toMatchObject({ sourceId: 'ugallu', targetId: 'girtablilu' });
  expect(result.events.filter((event) => event.type === 'shelter-installed')).toEqual([
    { type: 'shelter-installed', shelterId: result.state.shelters[0]!.id,
      sourceId: 'ugallu', targetId: 'girtablilu' },
  ]);
  expect(result.state.revision).toBe(1);
  expect(result.state.actedIds).toEqual(['ugallu']);
  expect(result.state.rotationUsed).toBe(false);
  expect(result.state.shapeChangeUsed).toBe(false);
  expect(result.state.brood).toEqual(state.brood);
  expect(result.state.enemies).toEqual(state.enemies);
});

test.each(['self', 'fallen', 'enemy', 'stretched', 'missing'] as const)(
  'AC3: Shelter rejects %s targets atomically', (condition) => {
    const base = fixture();
    const state = fixture({ formation: { shape: condition === 'stretched' ? 'spread' : 'compact', orientation: 0 },
      brood: base.brood.map((entity) => condition === 'fallen' && entity.id === 'girtablilu'
        ? { ...entity, hp: 0 } : entity) });
    const action = request('shelter', { targetId: condition === 'self' ? 'ugallu'
      : condition === 'enemy' ? 'censer' : condition === 'missing' ? 'missing' : 'girtablilu' });
    expect(abilityLegality(state, action, rules)).toEqual({ ok: false, error: { code: 'illegal-target' } });
    rejected(dispatch(state, action), state, 'illegal-target');
  });

test.each([false, true])('AC3: Shelter checks Close at later impact; expanded=%s', (expand) => {
  const sheltered = accepted(applyAbility(fixture(), request('shelter'), rules)).state;
  const current = expand ? accepted(applyCommand(sheltered,
    { kind: 'maneuver', expectedRevision: 1, maneuver: 'expand' })).state : sheltered;
  const hit = accepted(applyAttack(freeze(current), { kind: 'attack', eventId: 'enemy-hit',
    expectedRevision: current.revision, sourceId: 'censer', recipientIds: ['girtablilu'],
    rawDamage: 5, bypassProtection: false }, rules.damageRules));
  expect(hp(hit.state, 'girtablilu')).toBe(expand ? 5 : 7);
  expect(hit.state.shelters).toEqual([]);
  expect(hit.state.actedIds).toEqual(['ugallu']);
  expect(hit.events.filter((event) => event.type === 'shelter-consumed')).toMatchObject([{ eligible: !expand }]);
});

test('AC3: installed Shelter delegates same-blast death and expiry to P06', () => {
  const base = fixture();
  const state = fixture({ brood: base.brood.map((entity) => entity.id === 'ugallu' ? { ...entity, hp: 2 } : entity) });
  const sheltered = accepted(dispatch(state, request('shelter'))).state;
  const hit = accepted(applyAttack(sheltered, { kind: 'attack', expectedRevision: 1, eventId: 'blast',
    sourceId: 'censer', recipientIds: ['ugallu', 'girtablilu', 'pazuzu'], rawDamage: 3, bypassProtection: false }, rules.damageRules));
  expect(hp(hit.state, 'ugallu')).toBe(0);
  expect(hp(hit.state, 'girtablilu')).toBe(9);
  expect(hp(hit.state, 'pazuzu')).toBe(7);
  expect(hit.state.shelters).toEqual([]);
  const expired = expireShelters(sheltered);
  expect(expired.state.shelters).toEqual([]);
  expect(expireShelters(expired.state).state).toBe(expired.state);
});

// Dispatcher behavior uses relative outcomes, so positive default mitigation can be tuned.
test.each([false, true])('AC3 dispatcher: Shelter mitigation requires Close at impact; expanded=%s', (expand) => {
  const sheltered = accepted(dispatch(fixture(), request('shelter'))).state;
  const current = freeze(expand ? accepted(applyCommand(sheltered,
    { kind: 'maneuver', expectedRevision: 1, maneuver: 'expand' })).state : sheltered);
  const before = structuredClone(current);
  const attack = freeze({ kind: 'attack', expectedRevision: current.revision, eventId: 'dispatch-hit',
    sourceId: 'censer', recipientIds: ['girtablilu'], rawDamage: 5, bypassProtection: false } as const);
  const unshielded = accepted(applyCommand(freeze({ ...current, shelters: [] }), attack));
  const hit = accepted(applyCommand(current, attack));
  if (expand) expect(hp(hit.state, 'girtablilu')).toBe(hp(unshielded.state, 'girtablilu'));
  else expect(hp(hit.state, 'girtablilu')).toBeGreaterThan(hp(unshielded.state, 'girtablilu'));
  expect(hit.state.shelters).toEqual([]);
  expect(hit.state.actedIds).toEqual(current.actedIds);
  expect(hit.state.rotationUsed).toBe(current.rotationUsed);
  expect(hit.state.shapeChangeUsed).toBe(current.shapeChangeUsed);
  expect(hit.state.revision).toBe(current.revision + 1);
  expect(hit.events.filter((event) => event.type === 'shelter-consumed')).toMatchObject([{ eligible: !expand }]);
  expect(current).toEqual(before);
});

test('AC3 dispatcher: Shelter mitigates the blast that fells its source and is consumed', () => {
  const base = fixture();
  const wounded = fixture({ brood: base.brood.map((entity) => entity.id === 'ugallu' ? { ...entity, hp: 2 } : entity) });
  const sheltered = freeze(accepted(dispatch(wounded, request('shelter'))).state);
  const attack = freeze({ kind: 'attack', expectedRevision: sheltered.revision, eventId: 'dispatch-blast',
    sourceId: 'censer', recipientIds: ['ugallu', 'girtablilu', 'pazuzu'], rawDamage: 3, bypassProtection: false } as const);
  const unshielded = accepted(applyCommand(freeze({ ...sheltered, shelters: [] }), attack));
  const hit = accepted(applyCommand(sheltered, attack));
  expect(hp(hit.state, 'ugallu')).toBe(0);
  expect(hp(hit.state, 'girtablilu')).toBeGreaterThan(hp(unshielded.state, 'girtablilu'));
  expect(hp(hit.state, 'pazuzu')).toBe(hp(unshielded.state, 'pazuzu'));
  expect(hit.state.shelters).toEqual([]);
  expect(hit.state.actedIds).toEqual(['ugallu']);
  expect(hit.state.rotationUsed).toBe(false);
  expect(hit.state.shapeChangeUsed).toBe(false);
  expect(hit.state.revision).toBe(sheltered.revision + 1);
  expect(hit.events.filter((event) => event.type === 'shelter-consumed')).toMatchObject([{ eligible: true }]);
});

const area0 = [{ q: 2, r: 0 }, { q: 1, r: 1 }, { q: 1, r: 0 }];
const turnedAreas: Record<TurnDirection, readonly { q: number; r: number }[]> = {
  clockwise: [{ q: 0, r: 2 }, { q: -1, r: 2 }, { q: 0, r: 1 }],
  anticlockwise: [{ q: 2, r: -2 }, { q: 2, r: -1 }, { q: 1, r: -1 }],
};

test.each<[TurnDirection, Orientation, Orientation]>([
  ['clockwise', 0, 1], ['anticlockwise', 0, 5],
  ['clockwise', 5, 0], ['anticlockwise', 5, 4],
])('AC4: Crosswind %s from %i to %i turns area once and preserves marks', (direction, facing, after) => {
  const base = fixture();
  const state = fixture({ enemies: base.enemies.map((enemy) => enemy.id === 'warder' ? { ...enemy, facing } : enemy),
    declaredIntentions: [
      { id: 'area', sourceId: 'warder', kind: 'fixed-area', cells: area0, turnable: true },
      { id: 'fixed', sourceId: 'warder', kind: 'fixed-area', cells: area0, turnable: false },
      { id: 'other', sourceId: 'censer', kind: 'fixed-area', cells: area0, turnable: true },
      { id: 'hit', sourceId: 'warder', kind: 'marked-hit', targetId: 'ugallu' },
      { id: 'splash', sourceId: 'warder', kind: 'marked-splash', targetId: 'girtablilu' },
    ] });
  const before = structuredClone(state);
  const result = accepted(dispatch(state, request('crosswind', { targetId: 'warder', direction })));
  expect(result.state.enemies.find(({ id }) => id === 'warder')!.facing).toBe(after);
  expect(result.state.enemies.find(({ id }) => id === 'warder')!.maxHp).toBe(20);
  expect(result.state.declaredIntentions[0]).toEqual({ ...state.declaredIntentions[0], cells: turnedAreas[direction] });
  expect(result.state.declaredIntentions.slice(1)).toEqual(state.declaredIntentions.slice(1));
  expect(result.events.filter((event) => event.type === 'facing-changed')).toEqual([
    { type: 'facing-changed', sourceId: 'warder', before: facing, after },
  ]);
  expect(result.events.filter((event) => event.type === 'intention-turned')).toHaveLength(1);
  expect(result.state.brood).toEqual(state.brood);
  expect(result.state.enemies.map(({ hp }) => hp)).toEqual([20, 20, 20]);
  expect(result.state.actedIds).toEqual(['pazuzu']);
  expect(result.state.revision).toBe(1);
  expect(result.state.rotationUsed).toBe(false);
  expect(result.state.shapeChangeUsed).toBe(false);
  expect(state).toEqual(before);
});

test('AC4: Crosswind immediately removes directional protection for the next Claw', () => {
  const turned = accepted(dispatch(fixture(), request('crosswind', { targetId: 'warder' }))).state;
  const hit = accepted(applyAbility(turned, request('claw', { expectedRevision: 1 }), rules));
  expect(hp(hit.state, 'censer')).toBe(16);
  expect(hit.events.filter((event) => event.type === 'damage-applied')).toMatchObject([{ directionalReduction: 0 }]);
});

test.each(['unprotected', 'missing', 'brood', 'fallen', 'invalid-facing', 'absent-facing'] as const)(
  'AC4: Crosswind rejects %s without cost', (condition) => {
    const base = fixture();
    const state = fixture({ enemies: base.enemies.map((enemy) => enemy.id === 'warder'
      ? { ...enemy, hp: condition === 'fallen' ? 0 : 20,
        facing: (condition === 'invalid-facing' ? 6 : condition === 'absent-facing' ? undefined : 0) as Orientation } : enemy) });
    const action = request('crosswind', { targetId: condition === 'missing' ? 'missing'
      : condition === 'brood' ? 'ugallu' : condition === 'unprotected' ? 'unprotected' : 'warder' });
    rejected(dispatch(state, action), state, 'illegal-target');
  });

const formations: Formation[] = (['compact', 'spread'] as const).flatMap((shape) =>
  ([0, 1, 2, 3, 4, 5] as Orientation[]).map((orientation) => ({ shape, orientation })));

test.each(formations)('AC5: every living Brood can attack in %j, even with a fallen partner', (formation) => {
  for (const fallenId of [undefined, 'ugallu', 'girtablilu', 'pazuzu']) {
    const base = fixture();
    const state = fixture({ formation, brood: base.brood.map((entity) => entity.id === fallenId
      ? { ...entity, hp: 0 } : entity) });
    for (const abilityId of ['claw', 'sting', 'gale'] as const) {
      const action = request(abilityId);
      if (action.actorId === fallenId) continue;
      expect(abilityLegality(state, action)).toEqual({ ok: true });
      const result = accepted(dispatch(state, action));
      expect(result.state.formation).toEqual(formation);
      expect(result.state.brood).toEqual(state.brood);
      expect(hp(result.state, 'censer')).toBeLessThan(20);
    }
  }
});

test.each(['acted', 'impersonated', 'defeated-target', 'unknown-actor', 'foreign-actor', 'fallen-actor',
  'stale', 'enemy-phase', 'victory', 'defeat', 'brood-target', 'missing-target'] as const)(
  'AC6: %s rejects atomically and legality agrees', (condition) => {
    const base = fixture();
    const code: ErrorCode = condition === 'acted' ? 'already-acted'
      : condition === 'impersonated' ? 'illegal-ability'
        : condition === 'unknown-actor' ? 'unknown-actor'
          : condition === 'foreign-actor' ? 'wrong-owner'
            : condition === 'fallen-actor' ? 'fallen-actor'
              : condition === 'stale' ? 'stale-revision'
                : ['enemy-phase', 'victory', 'defeat'].includes(condition) ? 'wrong-phase' : 'illegal-target';
    const state = fixture({ actedIds: condition === 'acted' ? ['ugallu'] : ['pazuzu'],
      rotationUsed: true, shapeChangeUsed: true, revision: condition === 'stale' ? 1 : 0,
      phase: condition === 'enemy-phase' ? 'enemy' : condition === 'victory' ? 'victory'
        : condition === 'defeat' ? 'defeat' : 'player',
      enemies: base.enemies.map((enemy) => condition === 'defeated-target' && enemy.id === 'censer'
        ? { ...enemy, hp: 0 } : enemy),
      brood: base.brood.map((entity) => entity.id !== 'ugallu' ? entity
        : { ...entity, hp: condition === 'fallen-actor' ? 0 : 10,
          owner: condition === 'foreign-actor' ? 'enemy' : 'player' }) });
    const action = request('claw', { actorId: condition === 'unknown-actor' ? 'missing'
      : condition === 'impersonated' ? 'girtablilu' : 'ugallu',
      targetId: condition === 'brood-target' ? 'girtablilu' : condition === 'missing-target' ? 'missing' : 'censer' });
    const before = structuredClone(state);
    expect(abilityLegality(state, action)).toEqual({ ok: false, error: { code } });
    rejected(dispatch(state, action), state, code);
    expect(state).toEqual(before);
  });

test.each([undefined, 'sideways', 1, null])('boundary: Crosswind direction %s rejects atomically', (direction) => {
  const state = fixture();
  const action = request('crosswind', { direction: direction as TurnDirection });
  rejected(dispatch(state, action), state, 'invalid-command');
  expect(abilityLegality(state, action)).toEqual({ ok: false, error: { code: 'invalid-command' } });
});

test('boundary: direction on a contact attack and unknown ability are explicit rejections', () => {
  const state = fixture();
  rejected(dispatch(state, request('claw', { direction: 'clockwise' })), state, 'invalid-command');
  const unknown = { ...request('claw'), abilityId: 'missing' };
  rejected(applyAbility(state, unknown), state, 'illegal-ability');
  rejected(dispatch(state, unknown), state, 'unsupported-command');
});

test.each([-1, 0.5, Infinity, NaN, Number.MAX_SAFE_INTEGER + 1])(
  'boundary: invalid configured damage %s rejects before effect/spend', (clawDamage) => {
    const state = fixture();
    rejected(applyAbility(state, request('claw'), { ...rules, clawDamage }), state, 'invalid-amount');
  });

test('AC7/C4: attack, maneuver, attack uses the changed formation and one revision per command', () => {
  const state = fixture({ formation: { shape: 'compact', orientation: 1 } });
  const first = accepted(applyAbility(state, request('claw'), rules)).state;
  expect(hp(first, 'censer')).toBe(18);
  expect(first.rotationUsed).toBe(false);
  expect(first.shapeChangeUsed).toBe(false);
  const moved = accepted(applyCommand(freeze(first),
    { kind: 'maneuver', expectedRevision: 1, maneuver: 'clockwise' })).state;
  expect(moved.formation).toEqual({ shape: 'compact', orientation: 2 });
  expect(moved.actedIds).toEqual(['ugallu']);
  const second = accepted(applyAbility(freeze(moved), request('sting', { expectedRevision: 2 }), rules));
  expect(hp(second.state, 'censer')).toBe(14);
  expect(second.state.revision).toBe(3);
  expect(second.state.actedIds).toEqual(['ugallu', 'girtablilu']);
  expect(second.state.rotationUsed).toBe(true);
  expect(second.state.shapeChangeUsed).toBe(false);
  rejected(dispatch(second.state, request('claw', { expectedRevision: 3 })), second.state, 'already-acted');
});

test('C4: expanding between attacks enables Impale on the current two living stretched links', () => {
  const first = accepted(dispatch(fixture(), request('claw'))).state;
  rejected(dispatch(first, request('impale', { expectedRevision: 1 })), first, 'illegal-ability');
  const moved = accepted(applyCommand(first, { kind: 'maneuver', expectedRevision: 1, maneuver: 'expand' })).state;
  const second = accepted(applyAbility(moved, request('impale', { expectedRevision: 2 }), rules)).state;
  expect(hp(second, 'censer')).toBe(hp(first, 'censer') - 6);
  expect(second.actedIds).toEqual(['ugallu', 'girtablilu']);
  expect(second.revision).toBe(3);
});

test('AC7: shared maneuver still works after all three abilities in a nonterminal player phase', () => {
  let state = fixture();
  for (const abilityId of ['claw', 'sting', 'gale'] as const) {
    state = accepted(dispatch(state, request(abilityId, { expectedRevision: state.revision }))).state;
    expect(state.phase).toBe('player');
    expect(state.rotationUsed).toBe(false);
  expect(state.shapeChangeUsed).toBe(false);
  }
  const moved = accepted(applyCommand(state, { kind: 'maneuver', expectedRevision: 3, maneuver: 'expand' })).state;
  expect(moved.revision).toBe(4);
  expect(moved.actedIds).toEqual(['ugallu', 'girtablilu', 'pazuzu']);
});

test('P06 integration: lethal ability clamps HP, cleans effects and enters victory with one action/revision', () => {
  const state = fixture({ enemies: [{ id: 'last', hp: 2, maxHp: 20, cell: { q: 0, r: 0 }, facing: 0 }],
    declaredIntentions: [{ id: 'mark', sourceId: 'last', kind: 'marked-hit', targetId: 'ugallu' }] });
  const result = accepted(dispatch(state, request('claw', { targetId: 'last' })));
  expect(hp(result.state, 'last')).toBe(0);
  expect(result.state.phase).toBe('victory');
  expect(result.state.declaredIntentions).toEqual([]);
  expect(result.state.actedIds).toEqual(['ugallu']);
  expect(result.state.revision).toBe(1);
  expect(result.events.filter((event) => event.type === 'fallen')).toEqual([{ type: 'fallen', entityId: 'last', owner: 'enemy' }]);
  expect(result.events.filter((event) => event.type === 'combat-ended')).toEqual([{ type: 'combat-ended', outcome: 'victory' }]);
  rejected(dispatch(result.state, request('gale', { targetId: 'last', expectedRevision: 1 })), result.state, 'wrong-phase');
});

test.each(['claw', 'shelter', 'sting', 'impale', 'gale', 'crosswind'] as AbilityId[])(
  'purity/determinism: %s serializable replay yields identical state and events', (abilityId) => {
    const state = fixture({ formation: { shape: abilityId === 'impale' ? 'spread' : 'compact', orientation: 0 } });
    const action = request(abilityId);
    const before = JSON.stringify({ state, action });
    const result = accepted(dispatch(state, action));
    expect(dispatch(freeze(JSON.parse(JSON.stringify(state))), freeze(JSON.parse(JSON.stringify(action))))).toEqual(result);
    expect(JSON.stringify({ state, action })).toBe(before);
    const actionEvents = result.events.filter((event) => event.type === 'action-applied');
    expect(actionEvents).toEqual([{ type: 'action-applied', actorId: action.actorId,
      abilityId, targetId: action.targetId, revision: 1 }]);
    rejected(dispatch(result.state, action), result.state, 'stale-revision');
  });


test('identity collisions reject before installation/hit with matching legality and no cost', () => {
  const state = fixture();
  const hit = accepted(dispatch(state, request('claw'))).state;
  const hitCollision = fixture({ resolvedAttackIds: hit.resolvedAttackIds });
  expect(abilityLegality(hitCollision, request('claw'))).toEqual({ ok: false, error: { code: 'duplicate-attack' } });
  rejected(dispatch(hitCollision, request('claw')), hitCollision, 'duplicate-attack');
  const sheltered = accepted(dispatch(state, request('shelter'))).state;
  const shelterCollision = fixture({ shelters: sheltered.shelters });
  expect(abilityLegality(shelterCollision, request('shelter'))).toEqual({ ok: false, error: { code: 'invalid-command' } });
  rejected(dispatch(shelterCollision, request('shelter')), shelterCollision, 'invalid-command');
});

test('actor identity: ability ownership and Shelter links use Brood labels with arbitrary entity IDs', () => {
  const base = fixture();
  const state = fixture({ brood: base.brood.map((entity) => ({ ...entity,
    id: entity.brood === 'ugallu' ? 'guardian-7' : entity.brood === 'girtablilu' ? 'striker-9' : 'wind-2' })) });
  const claw = request('claw', { actorId: 'guardian-7' });
  expect(abilityLegality(state, claw)).toEqual({ ok: true });
  expect(accepted(dispatch(state, claw)).state.actedIds).toEqual(['guardian-7']);
  rejected(dispatch(state, { ...claw, actorId: 'striker-9' }), state, 'illegal-ability');
  const shelter = accepted(dispatch(state, request('shelter', { actorId: 'guardian-7', targetId: 'striker-9' })));
  expect(shelter.state.shelters).toHaveLength(1);
  expect(shelter.state.shelters[0]).toMatchObject({ sourceId: 'guardian-7', targetId: 'striker-9' });
});
