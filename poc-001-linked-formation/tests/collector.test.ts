import { describe, it, expect } from 'vitest';
import { announceCollector, createCollector, COLLECTOR_LAYOUT, COLLECTOR_ORDER, DEFAULT_COLLECTOR_RULES, COLLECTOR_VERSION } from '../src/content/collector';
import type { CollectorState } from '../src/content/collector';
import { applyAbility, abilityLegality, DEFAULT_ABILITY_RULES } from '../src/core/abilities';
import { applyCommand } from '../src/core/transition';
import type { Command } from '../src/core/commands';
import { formations, formationPositions, ROSTER } from '../src/core/formation';
import type { Orientation } from '../src/core/formation';
import { ENEMY_ROUTE } from '../src/core/enemy-movement';
import { hexDistance } from '../src/core/hex';
import { frontCells, turnCellsAboutClockwise } from '../src/core/sectors';
import { selectProtection, selectRecipients } from '../src/core/intents';
import { settleLifecycle } from '../src/core/lifecycle';
import { previewCommand, previewFacts } from '../src/core/preview';
import { appendAcceptedCommand, createRunRecord, parseRunRecord, replayRun, COLLECTOR_RUN_RULES_VERSION, RUN_RULES_VERSION, CRUCIBLE_RUN_RULES_VERSION } from '../src/core/run-record';
import { PatrolSession } from '../src/view/patrol-session';
import { ENCOUNTERS } from '../src/core/encounters';
import { collectorFixture, COLLECTOR_TEST_RULES } from './browser/collector-fixtures';

const same = (a: { q: number; r: number }, b: { q: number; r: number }) => a.q === b.q && a.r === b.r;
const boss = (state: CollectorState) => state.enemies.find(enemy => enemy.id === 'collector')!;
const sweep = (state: CollectorState) => state.declaredIntentions.find(entry => entry.sourceId === 'collector')!;
type Input<T> = T extends unknown ? Omit<T, 'expectedRevision'> : never;
const run = (state: CollectorState, input: Input<Command>) => {
  const command = { ...input, expectedRevision: state.revision } as Command;
  const before = structuredClone(state), preview = previewCommand(state, command, 0), result = applyCommand(state, command);
  expect(result.ok).toBe(true); expect(preview.ok).toBe(true);
  expect(state).toEqual(before); expect(preview.state).toEqual(result.state); expect(preview.events).toEqual(result.events);
  expect(result.state.revision).toBe(state.revision + 1);
  return result;
};
const end = (state: CollectorState) => run(state, { kind: 'endPhase' });
const protection = (state: CollectorState, actorId = 'ugallu') => selectProtection(state,
  { actorId, targetId: 'collector', bypassProtection: false }, state.protections);

describe('Collector shared contracts', () => {
  it('range is inclusive, source-to-ward, optional, and separate from attacker exposure', () => {
    const state = collectorFixture('in-range');
    const source = state.enemies.find(enemy => enemy.id === 'warder')!;
    const position = formationPositions(state.formation).find(p => frontCells(source.cell, source.facing).some(c => same(c, p.cell)))!;
    const distance = hexDistance(source.cell, boss(state).cell);
    const select = (range?: number) => selectProtection(state, { actorId: position.brood, targetId: 'collector', bypassProtection: false },
      [{ sourceId: source.id, targetId: 'collector', ...(range === undefined ? {} : { range }) }]);
    expect(select(distance).protected).toBe(true);
    expect(select(distance - 1).checks).toEqual([{ sourceId: source.id, reason: 'out-of-range' }]);
    expect(select().protected).toBe(true);
    const outsider = state.brood.find(entity => entity.id !== position.brood)!;
    expect(protection(state, outsider.id).checks).toEqual([{ sourceId: source.id, reason: 'outside-sector' }]);
    expect(selectProtection(state, { actorId: position.brood, targetId: 'collector', bypassProtection: true }, state.protections).reason).toBe('bypassed');
    expect(() => select(-1)).toThrow(RangeError); expect(() => select(1.5)).toThrow(RangeError);
  });
  it('retains unique sorted protecting sources and checks fallen/missing before range', () => {
    const state = collectorFixture('in-range');
    const actorId = formationPositions(state.formation).find(p => frontCells(state.enemies[0]!.cell, state.enemies[0]!.facing).some(c => same(c, p.cell)))!.brood;
    const context = { ...state, enemies: [...state.enemies, { ...state.enemies[0]!, id: 'other' }] };
    const relations = [{ sourceId: 'warder', targetId: 'collector', range: 0 },
      { sourceId: 'warder', targetId: 'collector', range: 2 }, { sourceId: 'other', targetId: 'collector' },
      { sourceId: 'absent', targetId: 'collector', range: 0 }];
    const result = selectProtection(context, { actorId, targetId: 'collector', bypassProtection: false }, relations);
    expect(result.sourceIds).toEqual(['other', 'warder']);
    expect(result.checks[0]).toEqual({ sourceId: 'absent', reason: 'source-missing' });
    expect(protection({ ...state, enemies: state.enemies.map(e => e.id === 'warder' ? { ...e, hp: 0 } : e) }, actorId).checks)
      .toEqual([{ sourceId: 'warder', reason: 'source-fallen' }]);
  });
  it('objectives default to all enemies; surviving nonobjectives do not receive death events', () => {
    const state = collectorFixture();
    const killed = { ...state, enemies: state.enemies.map(enemy => enemy.id === 'collector' ? { ...enemy, hp: 0 } : enemy) };
    const result = settleLifecycle(state, killed);
    expect(result.state.phase).toBe('victory');
    expect(result.events.filter(event => event.type === 'fallen').map(event => event.type === 'fallen' ? event.entityId : undefined)).toEqual(['collector']);
    expect(result.state.enemies.filter(enemy => enemy.id !== 'collector').every(enemy => enemy.hp > 0)).toBe(true);
    const defaults = { ...killed, enemies: killed.enemies.map(({ objective, ...enemy }) => enemy) };
    expect(settleLifecycle(state, defaults).state.phase).toBe('player');
    const allBroodDead = { ...killed, brood: killed.brood.map(entity => ({ ...entity, hp: 0 })) };
    expect(settleLifecycle(state, allBroodDead).state.phase).toBe('defeat');
    expect(settleLifecycle(result.state, result.state).events).toEqual([]);
  });
});

describe('Collector encounter', () => {
  it('creates independent presets from exported content with empty centre and one mobile objective', () => {
    for (const preset of ENCOUNTERS.collector.presets) {
      const state = createCollector(preset.id);
      expect(state.collectorRules).toEqual(DEFAULT_COLLECTOR_RULES);
      expect(state.enemies.map(enemy => enemy.id)).toEqual(COLLECTOR_ORDER);
      expect(new Set(state.enemies.map(enemy => `${enemy.cell.q},${enemy.cell.r}`)).size).toBe(state.enemies.length);
      expect(state.enemies.every(enemy => !same(enemy.cell, { q: 0, r: 0 }))).toBe(true);
      for (const enemy of state.enemies) expect(enemy.cell).toEqual(COLLECTOR_LAYOUT[enemy.id as keyof typeof COLLECTOR_LAYOUT].cell);
      expect(state.enemies.filter(enemy => enemy.mobile).map(enemy => enemy.id)).toEqual(['collector']);
      expect(state.enemies.filter(enemy => enemy.objective !== false).map(enemy => enemy.id)).toEqual(['collector']);
    }
    expect(createCollector().collectorRules).not.toBe(createCollector().collectorRules);
    expect(() => createCollector('invalid' as never)).toThrow(RangeError);
    expect(() => createCollector('healthy', { ...COLLECTOR_TEST_RULES, wardRange: -1 })).toThrow(RangeError);
  });
  it('maximizes living coverage from the actual tile, preserving facing ties then clockwise order', () => {
    for (const cell of ENEMY_ROUTE) for (const formation of formations()) for (let facing = 0; facing < 6; facing++) {
      const base = collectorFixture();
      for (const casualty of [undefined, 'ugallu']) {
        const state = { ...base, formation, enemies: base.enemies.map(enemy => enemy.id === 'collector' ? { ...enemy, cell, facing: facing as Orientation } : enemy),
          brood: base.brood.map(entity => entity.id === casualty ? { ...entity, hp: 0 } : entity) };
        const positions = formationPositions(formation).filter(position => position.brood !== casualty);
        const counts = Array.from({ length: 6 }, (_, step) => {
          const candidate = ((facing + step) % 6) as Orientation;
          return { candidate, count: positions.filter(position => frontCells(cell, candidate).some(c => same(c, position.cell))).length };
        });
        const expected = counts.find(entry => entry.count === Math.max(...counts.map(entry => entry.count)))!.candidate;
        const declared = announceCollector(state).state;
        expect(boss(declared).facing).toBe(expected);
        const attack = sweep(declared);
        expect(attack.kind === 'fixed-area' && attack.cells).toEqual(frontCells(cell, expected));
        expect(attack.kind === 'fixed-area' && attack.turnable).toBe(true);
      }
    }
  });
  it('keeps declarations committed through both maneuvers and transforms only the selected Crosswind source', () => {
    const initial = collectorFixture();
    let state = run(initial, { kind: 'maneuver', maneuver: 'expand' }).state;
    state = run(state, { kind: 'maneuver', maneuver: 'clockwise' }).state;
    expect(state.declaredIntentions).toEqual(initial.declaredIntentions);
    for (const targetId of ['collector', 'warder']) for (const direction of ['clockwise', 'anticlockwise'] as const) {
      const result = run(state, { kind: 'useAbility', actorId: 'pazuzu', abilityId: 'crosswind', targetId, direction });
      expect(result.state.enemies.map(enemy => enemy.cell)).toEqual(state.enemies.map(enemy => enemy.cell));
      const original = sweep(state);
      let cells = original.kind === 'fixed-area' ? original.cells : [];
      if (targetId === 'collector') for (let step = 0; step < (direction === 'clockwise' ? 1 : 5); step++) cells = turnCellsAboutClockwise(cells, boss(state).cell);
      const attack = sweep(result.state);
      expect(attack.kind === 'fixed-area' && attack.cells).toEqual(cells);
      expect(result.state.declaredIntentions.filter(entry => entry.sourceId !== 'collector')).toEqual(state.declaredIntentions.filter(entry => entry.sourceId !== 'collector'));
    }
  });
  it('uses living roster marks, round cycle, stable resolution order and fizzling without retargeting', () => {
    const initial = collectorFixture();
    for (let round = 1; round <= 3; round++) {
      const state = announceCollector({ ...initial, round }).state;
      expect(state.declaredIntentions.map(entry => entry.sourceId)).toEqual(COLLECTOR_ORDER);
      const mark = state.declaredIntentions.find(entry => entry.sourceId === 'censer')!;
      expect(mark.kind !== 'fixed-area' && mark.targetId).toBe(['girtablilu', 'pazuzu', 'ugallu'][round - 1]);
      const result = end({ ...state, declaredIntentions: [...state.declaredIntentions].reverse() });
      expect(result.events.filter(event => event.type === 'attack-settled').map(event => event.type === 'attack-settled' ? event.sourceId : undefined)).toEqual(COLLECTOR_ORDER);
      for (const event of result.events) if (event.type === 'damage-applied') {
        const source = event.eventId.split(':').at(-1);
        expect(event.rawDamage).toBe(source === 'warder' ? COLLECTOR_TEST_RULES.warderDamage : source === 'censer' ? COLLECTOR_TEST_RULES.censerDamage : COLLECTOR_TEST_RULES.sweepDamage);
      }
    }
    const deadMark = { ...initial, brood: initial.brood.map(entity => entity.id === 'girtablilu' ? { ...entity, hp: 0 } : entity) };
    const result = end(deadMark);
    expect(result.events.some(event => event.type === 'attack-settled' && event.sourceId === 'censer')).toBe(false);
    expect(selectRecipients(deadMark, deadMark.declaredIntentions.find(entry => entry.sourceId === 'censer')!).reason).toBe('target-fallen');
    const fresh = announceCollector(deadMark).state.declaredIntentions.find(entry => entry.sourceId === 'censer')!;
    expect(fresh.kind !== 'fixed-area' && fresh.targetId).toBe('pazuzu');
    const killedByWarder = end({ ...initial, brood: initial.brood.map(entity => entity.id === 'ugallu' ? { ...entity, hp: COLLECTOR_TEST_RULES.warderDamage } : entity),
      declaredIntentions: initial.declaredIntentions.map(entry => entry.kind === 'marked-splash' ? { ...entry, targetId: 'ugallu' } : entry) });
    expect(killedByWarder.events.some(event => event.type === 'attack-settled' && event.sourceId === 'censer')).toBe(false);
  });
  it('relocates only the boss before fresh local declaration and resets both allowances', () => {
    let state = collectorFixture();
    for (let round = 0; round < 5; round++) {
      state = run(state, { kind: 'maneuver', maneuver: state.formation.shape === 'compact' ? 'expand' : 'contract' }).state;
      state = run(state, { kind: 'maneuver', maneuver: 'clockwise' }).state;
      const slot = ENEMY_ROUTE.findIndex(cell => same(cell, boss(state).cell));
      const expected = [1, -1].map(step => ENEMY_ROUTE[(slot + step + ENEMY_ROUTE.length) % ENEMY_ROUTE.length]!)
        .find(cell => !state.enemies.some(enemy => enemy.hp > 0 && same(cell, enemy.cell)))!;
      const result = end(state), moved = result.events.findIndex(event => event.type === 'enemy-moved');
      expect(boss(result.state).cell).toEqual(expected);
      expect(result.state.enemies.filter(enemy => !enemy.mobile).map(enemy => enemy.cell)).toEqual(state.enemies.filter(enemy => !enemy.mobile).map(enemy => enemy.cell));
      expect(moved).toBeGreaterThan(result.events.findIndex(event => event.type === 'enemy-phase-ended'));
      expect(moved).toBeLessThan(result.events.findIndex(event => event.type === 'intentions-announced'));
      const attack = sweep(result.state);
      expect(attack.kind === 'fixed-area' && attack.cells).toEqual(frontCells(expected, boss(result.state).facing));
      expect(result.state.rotationUsed || result.state.shapeChangeUsed).toBe(false);
      expect(result.state.actedIds).toEqual([]); expect(result.state.enemies.length).toBe(state.enemies.length);
      state = result.state;
    }
  });
  it('leaves the ward relation present out of range; rotation changes exposure when in range', () => {
    const start = collectorFixture();
    expect(protection(start).checks.some(check => check.reason === 'out-of-range')).toBe(true);
    const next = end(start).state;
    expect(next.protections).toEqual(start.protections);
    const inRange = collectorFixture('in-range');
    const source = inRange.enemies.find(enemy => enemy.id === 'warder')!;
    for (const formation of formations()) {
      const state = { ...inRange, formation };
      for (const position of formationPositions(formation)) {
        expect(protection(state, position.brood).protected).toBe(frontCells(source.cell, source.facing).some(cell => same(cell, position.cell)));
      }
    }
  });
  it('uses a nondefault configured ward amount across live command, preview and export/replay', () => {
    const initial = collectorFixture('in-range');
    const formation = formations().find(formation => {
      const actor = formationPositions(formation).find(position => position.brood === 'ugallu')!;
      return frontCells(initial.enemies[0]!.cell, initial.enemies[0]!.facing).some(cell => same(cell, actor.cell));
    })!;
    const state = { ...initial, formation };
    const actorId = 'ugallu', abilityId = 'claw';
    const command: Command = { kind: 'useAbility', expectedRevision: 0, actorId, abilityId, targetId: 'collector' };
    const actual = applyCommand(state, command), preview = previewCommand(state, command, 0);
    expect(actual.ok).toBe(true); expect(preview.state).toEqual(actual.state); expect(preview.events).toEqual(actual.events);
    const damage = actual.events.find(event => event.type === 'damage-applied')!;
    if (damage.type !== 'damage-applied') throw new Error('damage unavailable');
    expect(damage.directionalReduction).toBe(COLLECTOR_TEST_RULES.damageRules.directionalReduction);
    expect(damage.damage).toBe(Math.max(0, damage.rawDamage - COLLECTOR_TEST_RULES.damageRules.directionalReduction));
    const record = appendAcceptedCommand(createRunRecord(state, 'healthy'), command, actual);
    expect(record.configuration.abilityRules.damageRules.directionalReduction).toBe(COLLECTOR_TEST_RULES.damageRules.directionalReduction);
    expect(replayRun(JSON.stringify(record))).toMatchObject({ state: actual.state, events: actual.events });
  });
  it('kills adds independently, frees corpse destinations, and boss death wins through direct ability and replay', () => {
    const initial = collectorFixture();
    const wardKilled = run(initial, { kind: 'useAbility', actorId: 'ugallu', abilityId: 'claw', targetId: 'warder' }).state;
    expect(wardKilled.phase).toBe('player'); expect(wardKilled.protections).toEqual([]);
    expect(wardKilled.declaredIntentions.some(entry => entry.sourceId === 'warder')).toBe(false);
    const corpseState = collectorFixture('corpse');
    const corpseResult = end(corpseState);
    expect(boss(corpseResult.state).cell).toEqual(corpseState.enemies.find(enemy => enemy.id === 'warder')!.cell);
    const censerFragile = { ...initial, enemies: initial.enemies.map(enemy => enemy.id === 'censer' ? { ...enemy, hp: 1 } : enemy) };
    const censerKilled = run(censerFragile, { kind: 'useAbility', actorId: 'ugallu', abilityId: 'claw', targetId: 'censer' }).state;
    expect(end(censerKilled).state.declaredIntentions.some(entry => entry.sourceId === 'censer')).toBe(false);
    const noAdds = { ...initial, enemies: initial.enemies.map(enemy => enemy.objective === false ? { ...enemy, hp: 0 } : enemy) };
    expect(end(noAdds).state.phase).toBe('player');
    const state = collectorFixture('kill');
    const command = { kind: 'useAbility' as const, actorId: 'pazuzu', abilityId: 'gale' as const, targetId: 'collector', expectedRevision: 0 };
    const actual = applyAbility(state, command);
    expect(actual.state.phase).toBe('victory');
    expect(actual.events.filter(event => event.type === 'fallen').map(event => event.type === 'fallen' ? event.entityId : undefined)).toEqual(['collector']);
    expect(actual.events.some(event => event.type === 'attack-settled' && event.sourceId !== 'pazuzu')).toBe(false);
    expect(applyCommand(actual.state, { kind: 'endPhase', expectedRevision: 1 }).ok).toBe(false);
    const record = appendAcceptedCommand(createRunRecord(state, 'healthy'), command, actual);
    expect(replayRun(JSON.stringify(record)).state).toEqual(actual.state);
    const preview = previewCommand(state, command, 0);
    expect(preview.ok && preview.forecast.kind).toBe('terminal');
  });
  it('reliable attacks remain legal on every living enemy in all formations after any single casualty', () => {
    for (const formation of formations()) for (const casualty of [undefined, ...ROSTER]) {
      const initial = collectorFixture();
      const state = { ...end(initial).state, formation, brood: initial.brood.map(entity => entity.id === casualty ? { ...entity, hp: 0 } : entity) };
      for (const actor of state.brood.filter(entity => entity.hp > 0)) for (const target of state.enemies.filter(enemy => enemy.hp > 0)) {
        const abilityId = actor.brood === 'ugallu' ? 'claw' : actor.brood === 'girtablilu' ? 'sting' : 'gale';
        expect(abilityLegality(state, { actorId: actor.id, targetId: target.id, abilityId, expectedRevision: state.revision }).ok).toBe(true);
      }
    }
  });
  it('Shelter forecast consumes once in resolution order and grouped splash uses configured radius', () => {
    const state = collectorFixture();
    const command: Command = { kind: 'useAbility', expectedRevision: 0, actorId: 'ugallu', abilityId: 'shelter', targetId: 'ugallu' };
    const preview = previewCommand(state, command, 0), sheltered = run(state, command).state, actual = end(sheltered);
    expect(preview.ok && preview.forecast.kind === 'transition' && preview.forecast.ok).toBe(true);
    if (!preview.ok || preview.forecast.kind !== 'transition' || !preview.forecast.ok) throw new Error('forecast unavailable');
    expect(preview.forecast.state).toEqual(actual.state); expect(preview.forecast.events).toEqual(actual.events);
    expect(actual.state.shelters).toEqual([]);
    expect(actual.events.filter(event => event.type === 'shelter-consumed')).toHaveLength(1);
    const mark = state.declaredIntentions.find(entry => entry.sourceId === 'censer')!;
    for (const shape of ['compact', 'spread'] as const) {
      const formed = { ...state, formation: { shape, orientation: 0 as const } }, positions = formationPositions(formed.formation);
      const anchor = positions.find(position => mark.kind !== 'fixed-area' && position.brood === mark.targetId)!;
      expect(selectRecipients(formed, mark, COLLECTOR_TEST_RULES.splashRadius).recipientIds)
        .toEqual(positions.filter(position => hexDistance(position.cell, anchor.cell) <= COLLECTOR_TEST_RULES.splashRadius).map(position => position.brood));
    }
  });
  it('records relocation, turns, support and terminal outcomes exactly, with distinct version and additive validation', () => {
    expect(COLLECTOR_RUN_RULES_VERSION).toContain(COLLECTOR_VERSION);
    expect([RUN_RULES_VERSION, CRUCIBLE_RUN_RULES_VERSION]).not.toContain(COLLECTOR_RUN_RULES_VERSION);
    let state = collectorFixture(), record = createRunRecord(state, 'healthy');
    for (const input of [{ kind: 'maneuver', maneuver: 'expand' }, { kind: 'maneuver', maneuver: 'anticlockwise' },
      { kind: 'endPhase' }, { kind: 'useAbility', actorId: 'pazuzu', abilityId: 'crosswind', targetId: 'collector', direction: 'clockwise' },
      { kind: 'useAbility', actorId: 'ugallu', abilityId: 'claw', targetId: 'warder' }, { kind: 'endPhase' }] as const) {
      const command = { ...input, expectedRevision: state.revision }, result = run(state, input);
      record = appendAcceptedCommand(record, command, result); state = result.state;
    }
    expect(replayRun(JSON.stringify(record))).toMatchObject({ state, events: record.events });
    for (const field of ['objective', 'mobile', 'rotatable']) {
      const malformed = structuredClone(record) as any; malformed.initialState.enemies[0][field] = 7;
      expect(() => parseRunRecord(JSON.stringify(malformed))).toThrow(/identity\/facing/);
    }
    for (const range of [-1, 0.5, '2']) {
      const malformed = structuredClone(record) as any; malformed.initialState.protections[0].range = range;
      expect(() => parseRunRecord(JSON.stringify(malformed))).toThrow(/protections range/);
    }
  });
  it('matches every legal command and forecast over controlled route origins, formations and ward eligibility', () => {
    for (let slot = 0; slot < ENEMY_ROUTE.length; slot++) for (const formation of formations()) {
      const initial = collectorFixture();
      const enemies = initial.enemies.map(enemy => ({ ...enemy,
        cell: ENEMY_ROUTE[(slot + (enemy.id === 'collector' ? 0 : enemy.id === 'warder' ? 2 : 4)) % ENEMY_ROUTE.length]! }));
      const state = announceCollector({ ...initial, enemies, formation }).state;
      const facts = previewFacts(state);
      if (!facts.available) throw new Error('facts unavailable');
      const commands: Command[] = [
        ...facts.abilities.filter(entry => entry.legality.ok).map(entry => ({ kind: 'useAbility' as const, ...entry.request })),
        ...(['clockwise', 'anticlockwise', formation.shape === 'compact' ? 'expand' : 'contract'] as const)
          .map(maneuver => ({ kind: 'maneuver' as const, expectedRevision: 0, maneuver })),
      ];
      for (const command of commands) {
        const preview = previewCommand(state, command, 0), actual = applyCommand(state, command);
        expect(preview.state).toEqual(actual.state); expect(preview.events).toEqual(actual.events);
        if (!preview.ok || preview.forecast.kind !== 'transition' || !preview.forecast.ok) continue;
        const ended = applyCommand(actual.state, { kind: 'endPhase', expectedRevision: actual.state.revision });
        expect(preview.forecast.state).toEqual(ended.state); expect(preview.forecast.events).toEqual(ended.events);
      }
    }
  });
  it('rejects malformed end-phase inputs atomically and resets the selected preset with stale guards', () => {
    const state = collectorFixture();
    for (const [snapshot, expectedRevision, code] of [
      [state, 1, 'stale-revision'], [{ ...state, phase: 'enemy' }, 0, 'wrong-phase'],
      [{ ...state, collectorRules: { ...COLLECTOR_TEST_RULES, sweepDamage: -1 } }, 0, 'invalid-amount'],
      [{ ...state, declaredIntentions: [state.declaredIntentions[0], state.declaredIntentions[0]] }, 0, 'invalid-command'],
    ] as const) expect(applyCommand(snapshot as CollectorState, { kind: 'endPhase', expectedRevision }))
      .toEqual({ ok: false, state: snapshot, events: [], error: { code } });
    const session = new PatrolSession<CollectorState, import('../src/content/collector').CollectorPreset>(() => {}, 0, createCollector, 'healthy', 'collector');
    const preview = session.project({ kind: 'maneuver', maneuver: 'expand', expectedRevision: 0 });
    session.reset('wounded-ugallu'); session.confirm(preview);
    expect(session.message).toContain('stale-session'); expect(session.state).toEqual(createCollector('wounded-ugallu'));
    expect(parseRunRecord(session.exportRecord()).fixtureId).toBe('wounded-ugallu');
    expect(previewFacts(session.state).available).toBe(true);
  });
});
