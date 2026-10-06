import { describe, expect, it } from 'vitest';
import { announceCrucible, createCrucible, DEFAULT_CRUCIBLE_RULES, phaseTwoPending } from '../src/content/crucible';
import type { CrucibleRules, CrucibleState } from '../src/content/crucible';
import { applyCommand } from '../src/core/transition';
import { previewCommand, previewFacts } from '../src/core/preview';
import { formationPositions, ROSTER } from '../src/core/formation';
import type { Orientation, Shape } from '../src/core/formation';
import { RING_ONE, RING_TWO } from '../src/core/hex';
import { frontCells, sectorCells, turnCellsAboutClockwise } from '../src/core/sectors';
import { selectRecipients, selectProtection } from '../src/core/intents';
import { appendAcceptedCommand, createRunRecord, parseRunRecord, replayRun, RUN_RULES_VERSION, CRUCIBLE_RUN_RULES_VERSION } from '../src/core/run-record';
import type { Command } from '../src/core/commands';
import { PatrolSession } from '../src/view/patrol-session';

// Explicit experimental inputs: tuning is permitted to change independently of these contracts.
const rules: CrucibleRules = { bossHp: 90, phaseTwoAt: 45, splashRadius: 2, closeThreshold: 2,
  damageRules: { directionalReduction: 8, shelterReduction: 9, closeThreshold: 2 },
  patterns: {
    1: { A: { area: 'inner', primaryDamage: 7, secondaryKind: 'marked-hit', secondaryDamage: 6 },
      B: { area: 'sector', primaryDamage: 11, secondaryKind: 'marked-hit', secondaryDamage: 6 } },
    2: { A: { area: 'outer', primaryDamage: 7, secondaryKind: 'marked-splash', secondaryDamage: 6 },
      B: { area: 'fork', primaryDamage: 11, secondaryKind: 'marked-hit', secondaryDamage: 6 } },
  } };
const orientations = [0, 1, 2, 3, 4, 5] as const;
function fixture(phase: 1 | 2 = 1, facing: Orientation = 0, shape: Shape = 'compact', orientation: Orientation = 0): CrucibleState {
  const fresh = createCrucible(phase === 1 ? 'phase-one' : 'phase-two-diagnostic', rules);
  return announceCrucible({ ...fresh, formation: { shape, orientation },
    brood: fresh.brood.map(b => ({ ...b, hp: 200, maxHp: 200 })),
    enemies: fresh.enemies.map(e => ({ ...e, facing })) }, true).state;
}
function run(state: CrucibleState, input: Omit<Extract<Command, { kind: 'maneuver' }>, 'expectedRevision'>
  | Omit<Extract<Command, { kind: 'endPhase' }>, 'expectedRevision'>
  | { kind: 'useAbility'; abilityId: string; actorId: string; targetId: string; direction?: 'clockwise' | 'anticlockwise' }) {
  const result = applyCommand(state, { ...input, expectedRevision: state.revision } as Command);
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(result.error.code);
  expect(result.state.revision).toBe(state.revision + 1);
  expect(result.state.enemies[0]!.cell).toEqual({ q: 0, r: 0 });
  return result;
}
const end = (state: CrucibleState) => run(state, { kind: 'endPhase' });
const same = (a: { q: number; r: number }, b: { q: number; r: number }) => a.q === b.q && a.r === b.r;

describe('Crucible contracts', () => {
  it('derives pulse, sector, fork and self-guard masks over twelve formations and six facings', () => {
    for (const shape of ['compact', 'spread'] as const) for (const orientation of orientations) for (const facing of orientations) {
      const state = fixture(1, facing, shape, orientation), positions = formationPositions(state.formation);
      for (const [cells, count] of [[RING_ONE, shape === 'compact' ? ROSTER.length : 0],
        [RING_TWO, shape === 'spread' ? ROSTER.length : 0],
        [sectorCells(facing), orientation % 2 === facing % 2 ? 1 : 0],
        [[...sectorCells(facing), ...sectorCells(((facing + 2) % 6) as Orientation)], orientation % 2 === facing % 2 ? 2 : 0]] as const) {
        const declaration = { id: 'controlled-area', sourceId: 'crucible', kind: 'fixed-area' as const, cells, turnable: true };
        const recipients = selectRecipients(state, declaration).recipientIds;
        expect(recipients).toEqual(positions.filter(p => cells.some(cell => same(cell, p.cell))).map(p => p.brood));
        expect(recipients).toHaveLength(count);
      }
      const guarded = state.brood.filter(b => selectProtection(state, { actorId: b.id, targetId: 'crucible', bypassProtection: false }, state.protections).protected);
      expect(guarded.map(b => b.id)).toEqual(positions.filter(p => frontCells({ q: 0, r: 0 }, facing).some(c => same(c, p.cell))).map(p => p.brood));
      expect(guarded).toHaveLength(1);
    }
  });
  for (const phase of [1, 2] as const) for (const shape of ['compact', 'spread'] as const)
    it(`actual declarations and legal-action previews preserve geometry in phase ${phase}, ${shape}`, () => {
      for (const orientation of orientations) for (const facing of orientations) {
        let state = fixture(phase, facing, shape, orientation);
        for (const beat of ['A', 'B'] as const) {
          if (beat === 'B') state = end(state).state;
          const pattern = state.crucibleRules.patterns[phase][beat], f = state.enemies[0]!.facing;
          const cells = pattern.area === 'inner' ? RING_ONE : pattern.area === 'outer' ? RING_TWO
            : pattern.area === 'sector' ? sectorCells(f) : [...sectorCells(f), ...sectorCells(((f + 2) % 6) as Orientation)];
          const primary = state.declaredIntentions[0]!;
          expect(primary.kind === 'fixed-area' && primary.cells).toEqual(cells);
          expect(state.declaredIntentions[1]!.kind).toBe(pattern.secondaryKind);
          const facts = previewFacts(state);
          if (!facts.available) throw new Error('facts unavailable');
          const commands: Command[] = [
            ...facts.abilities.filter(entry => entry.legality.ok).map(entry => ({ kind: 'useAbility' as const, ...entry.request })),
            ...(['clockwise', 'anticlockwise', shape === 'compact' ? 'expand' : 'contract'] as const)
              .map(maneuver => ({ kind: 'maneuver' as const, maneuver, expectedRevision: state.revision })),
          ];
          for (const command of commands) {
            const before = structuredClone(state), preview = previewCommand(state, command, 0);
            const actual = applyCommand(state, command);
            expect(actual.ok).toBe(true); expect(preview.ok).toBe(true);
            expect(actual.state.enemies[0]!.cell).toEqual({ q: 0, r: 0 });
            expect(state).toEqual(before); expect(preview.state).toEqual(actual.state); expect(preview.events).toEqual(actual.events);
          }
        }
      }
  });
  it('factory announcements use configured area, damage and mark kind rather than hardcoded tuning', () => {
    for (const phase of [1, 2] as const) {
      const custom: CrucibleRules = { ...rules, patterns: { ...rules.patterns, [phase]: { ...rules.patterns[phase],
        A: { area: 'outer', primaryDamage: 13, secondaryKind: 'marked-splash', secondaryDamage: 8 } } } };
      const state = createCrucible(phase === 1 ? 'phase-one' : 'phase-two-diagnostic', custom);
      expect(state.enemies[0]!.maxHp).toBe(custom.bossHp);
      const primary = state.declaredIntentions[0]!;
      expect(primary.kind === 'fixed-area' && primary.cells).toEqual(RING_TWO);
      expect(state.declaredIntentions[1]!.kind).toBe(custom.patterns[phase].A.secondaryKind);
      const ended = end({ ...state, formation: { shape: 'spread', orientation: 0 }, brood: state.brood.map(b => ({ ...b, hp: 200, maxHp: 200 })) });
      expect(ended.events.filter(e => e.type === 'damage-applied' && e.eventId.endsWith(':primary')).map(e => e.type === 'damage-applied' ? e.rawDamage : undefined))
        .toEqual(ROSTER.map(() => custom.patterns[phase].A.primaryDamage));
    }
  });
  it('resolves primary then secondary independent of serialized declaration order and fizzles a fallen mark', () => {
    const state = fixture();
    const marked = state.declaredIntentions[1]!;
    expect(marked.kind !== 'fixed-area' && marked.targetId).toBe(ROSTER[0]);
    const reversed = { ...state, declaredIntentions: [...state.declaredIntentions].reverse() };
    const result = end(reversed);
    expect(result.events.filter(e => e.type === 'attack-settled').map(e => e.eventId))
      .toEqual([`crucible:${state.round}:primary`, `crucible:${state.round}:secondary`]);
    const fallen = end({ ...state, brood: state.brood.map((b, i) => i === 0 ? { ...b, hp: 0 } : b) });
    expect(fallen.events.some(e => e.type === 'attack-settled' && e.eventId.endsWith(':secondary'))).toBe(false);
    const killedByPrimary = end({ ...state, brood: state.brood.map((b, i) => i === 0 ? { ...b, hp: rules.patterns[1].A.primaryDamage } : b) });
    expect(killedByPrimary.events.some(e => e.type === 'attack-settled' && e.eventId.endsWith(':secondary'))).toBe(false);
  });
  it('marks use exact HP fractions, living roster ties, and follow the creature through maneuvers', () => {
    const base = fixture();
    const state = announceCrucible({ ...base, brood: base.brood.map((b, i) => ({ ...b, hp: [50, 25, 30][i]!, maxHp: [100, 50, 100][i]! })) }, true).state;
    const mark = state.declaredIntentions[1]!;
    expect(mark.kind !== 'fixed-area' && mark.targetId).toBe('pazuzu');
    const moved = run(state, { kind: 'maneuver', maneuver: 'expand' }).state;
    expect(moved.declaredIntentions).toEqual(state.declaredIntentions);
    expect(selectRecipients(moved, mark).cells).toEqual([formationPositions(moved.formation).find(p => p.brood === 'pazuzu')!.cell]);
  });
  for (const phase of [1, 2] as const) for (const direction of ['clockwise', 'anticlockwise'] as const) {
    it(`preserves anchoring and applies cadence after ${direction} Crosswind in phase ${phase}`, () => {
      for (const facing of orientations) {
        let state = fixture(phase, facing);
        const pulse = state.declaredIntentions;
        const turned = run(state, { kind: 'useAbility', abilityId: 'crosswind', actorId: 'pazuzu', targetId: 'crucible', direction }).state;
        const shifted = (facing + (direction === 'clockwise' ? 1 : 5)) % 6;
        expect(turned.enemies[0]!.facing).toBe(shifted);
        expect(turned.declaredIntentions).toEqual(pulse);
        state = end(turned).state;
        expect(state.beat).toBe('B');
        expect(state.enemies[0]!.facing).toBe((shifted + 1) % 6);
        const sectors = state.declaredIntentions[0]!;
        expect(sectors.kind === 'fixed-area' && sectors.turnable).toBe(true);
        const cross = run(state, { kind: 'useAbility', abilityId: 'crosswind', actorId: 'pazuzu', targetId: 'crucible', direction }).state;
        let cells = sectors.kind === 'fixed-area' ? sectors.cells : [];
        for (let i = 0; i < (direction === 'clockwise' ? 1 : 5); i++) cells = turnCellsAboutClockwise(cells, { q: 0, r: 0 });
        expect(cross.declaredIntentions[0]!.kind === 'fixed-area' && cross.declaredIntentions[0]!.cells).toEqual(cells);
        expect(cross.declaredIntentions[1]).toEqual(state.declaredIntentions[1]);
        const next = end(cross).state;
        expect(next.beat).toBe('A');
        expect(next.enemies[0]!.facing).toBe(cross.enemies[0]!.facing);
      }
    });
  }
  it('delays threshold entry, retains announced damage, emits entry once and never returns or refills', () => {
    for (const facing of orientations) for (const direction of ['clockwise', 'anticlockwise'] as const) {
      let state = fixture(1, facing);
      state = { ...state, enemies: state.enemies.map(e => ({ ...e, hp: rules.phaseTwoAt + 1 })) };
      state = run(state, { kind: 'useAbility', abilityId: 'crosswind', actorId: 'pazuzu', targetId: 'crucible', direction }).state;
      const before = state;
      const hit = run(state, { kind: 'useAbility', abilityId: 'claw', actorId: 'ugallu', targetId: 'crucible' });
      state = hit.state;
      expect(phaseTwoPending(state)).toBe(true);
      expect(state.bossPhase).toBe(1);
      expect(state.declaredIntentions).toEqual(before.declaredIntentions);
      const forecast = previewCommand(state, { kind: 'maneuver', maneuver: 'clockwise', expectedRevision: state.revision }, 0);
      expect(forecast.ok && forecast.forecast.kind === 'transition' && forecast.forecast.ok).toBe(true);
      if (!forecast.ok || forecast.forecast.kind !== 'transition' || !forecast.forecast.ok) throw new Error('forecast unavailable');
      const moved = run(state, { kind: 'maneuver', maneuver: 'clockwise' }).state;
      const ended = end(moved);
      expect(forecast.forecast.state).toEqual(ended.state);
      expect(forecast.forecast.events).toEqual(ended.events);
      expect(forecast.forecast.enemyEvents).toEqual(ended.events.filter(e => !['round-started', 'intentions-announced', 'boss-phase-changed'].includes(e.type)));
      expect(ended.events.filter(e => e.type === 'boss-phase-changed')).toHaveLength(1);
      expect(ended.state.bossPhase).toBe(2); expect(ended.state.beat).toBe('A');
      expect(ended.state.enemies[0]!.facing).toBe(state.enemies[0]!.facing);
      expect(ended.state.enemies[0]!.hp).toBe(state.enemies[0]!.hp);
      expect(ended.events.filter(e => e.type === 'damage-applied' && e.eventId.endsWith(':primary')).every(e => e.type === 'damage-applied' && e.rawDamage === rules.patterns[1].A.primaryDamage)).toBe(true);
      const next = end(ended.state);
      expect(next.state.enemies[0]!.facing).toBe((ended.state.enemies[0]!.facing + 1) % 6);
      expect(next.events.some(e => e.type === 'boss-phase-changed')).toBe(false);
      const healed = { ...next.state, enemies: next.state.enemies.map(e => ({ ...e, hp: e.maxHp })) };
      expect(end(healed).state.bossPhase).toBe(2);
    }
  });
  it('forecasts ordered Shelter consumption and terminal interruption exactly', () => {
    for (const phase of [1, 2] as const) {
      const state = fixture(phase);
      const command: Command = { kind: 'useAbility', expectedRevision: state.revision, abilityId: 'shelter', actorId: 'ugallu', targetId: 'ugallu' };
      const preview = previewCommand(state, command, 0);
      expect(preview.ok).toBe(true);
      if (!preview.ok || preview.forecast.kind !== 'transition' || !preview.forecast.ok) throw new Error('forecast unavailable');
      const sheltered = applyCommand(state, command); expect(sheltered.ok).toBe(true);
      const actual = end(sheltered.state);
      expect(preview.forecast.state).toEqual(actual.state); expect(preview.forecast.events).toEqual(actual.events);
      expect(actual.state.shelters).toEqual([]);
      const fragile = { ...state, brood: state.brood.map(b => ({ ...b, hp: 1 })), formation: { shape: phase === 1 ? 'compact' as const : 'spread' as const, orientation: 0 as const } };
      const probe = previewCommand(fragile, { kind: 'maneuver', maneuver: 'clockwise', expectedRevision: fragile.revision }, 0);
      if (!probe.ok || probe.forecast.kind !== 'transition' || !probe.forecast.ok) throw new Error('forecast unavailable');
      const killed = end(probe.state);
      expect(killed.state.phase).toBe('defeat'); expect(probe.forecast.state).toEqual(killed.state);
      expect(killed.events.filter(e => e.type === 'attack-settled')).toHaveLength(1);
      expect(killed.events.some(e => e.type === 'intentions-announced')).toBe(false);
    }
  });
  it('boss death wins before another attack or phase event', () => {
    const base = fixture();
    const state = { ...base, enemies: base.enemies.map(e => ({ ...e, hp: 1 })) };
    const preview = previewCommand(state, { kind: 'useAbility', expectedRevision: state.revision, abilityId: 'gale', actorId: 'pazuzu', targetId: 'crucible' }, 0);
    expect(preview.ok && preview.state.phase).toBe('victory');
    expect(preview.ok && preview.forecast.kind).toBe('terminal');
    expect(preview.events.some(e => e.type === 'boss-phase-changed')).toBe(false);
    const cancelled = end({ ...state, enemies: state.enemies.map(e => ({ ...e, hp: 0 })) });
    expect(cancelled.state.phase).toBe('victory');
    expect(cancelled.events.some(e => e.type === 'attack-settled' || e.type === 'boss-phase-changed')).toBe(false);
  });
  it('both phases support both maneuver categories plus Shelter and Crosswind traces and reset budgets', () => {
    for (const phase of [1, 2] as const) {
      let state = fixture(phase);
      state = run(state, { kind: 'maneuver', maneuver: 'expand' }).state;
      state = run(state, { kind: 'maneuver', maneuver: 'anticlockwise' }).state;
      expect(state.rotationUsed && state.shapeChangeUsed).toBe(true);
      state = run(state, { kind: 'useAbility', abilityId: 'shelter', actorId: 'ugallu', targetId: 'ugallu' }).state;
      state = run(state, { kind: 'useAbility', abilityId: 'crosswind', actorId: 'pazuzu', targetId: 'crucible', direction: 'clockwise' }).state;
      state = end(state).state;
      expect(state.rotationUsed || state.shapeChangeUsed).toBe(false); expect(state.actedIds).toEqual([]);
      expect(previewFacts(state).available).toBe(true);
    }
  });
  it('rejects stale, wrong phase, invalid rules and malformed declarations atomically', () => {
    const state = fixture();
    const probes = [
      { state, command: { kind: 'endPhase', expectedRevision: state.revision + 1 }, code: 'stale-revision' },
      { state: { ...state, phase: 'enemy' }, command: { kind: 'endPhase', expectedRevision: state.revision }, code: 'wrong-phase' },
      { state: { ...state, crucibleRules: { ...rules, splashRadius: -1 } }, command: { kind: 'endPhase', expectedRevision: state.revision }, code: 'invalid-amount' },
      { state: { ...state, declaredIntentions: [state.declaredIntentions[0], state.declaredIntentions[0]] }, command: { kind: 'endPhase', expectedRevision: state.revision }, code: 'invalid-command' },
    ];
    for (const probe of probes) {
      const result = applyCommand(probe.state as CrucibleState, probe.command as Command);
      expect(result).toEqual({ ok: false, state: probe.state, events: [], error: { code: probe.code } });
    }
  });
  it('roundtrips configured phase-crossing and diagnostic records without changing the patrol version', () => {
    expect(CRUCIBLE_RUN_RULES_VERSION).not.toBe(RUN_RULES_VERSION);
    for (const preset of ['phase-one', 'phase-two-diagnostic'] as const) {
      let state = fixture(preset === 'phase-one' ? 1 : 2);
      if (preset === 'phase-one') state = { ...state, enemies: state.enemies.map(e => ({ ...e, hp: rules.phaseTwoAt + 1 })) };
      let record = createRunRecord(state, preset);
      for (const input of [{ kind: 'maneuver', maneuver: 'expand' },
        { kind: 'maneuver', maneuver: 'clockwise' },
        { kind: 'useAbility', abilityId: 'gale', actorId: 'pazuzu', targetId: 'crucible' },
        { kind: 'endPhase' }, { kind: 'endPhase' }] as const) {
        const command = { ...input, expectedRevision: state.revision };
        const result = run(state, input); record = appendAcceptedCommand(record, command, result); state = result.state;
      }
      const replay = replayRun(JSON.stringify(record));
      expect(replay.state).toEqual(state); expect(replay.events).toEqual(record.events);
      const corrupted = { ...record, finalState: { ...record.finalState, beat: 'invalid' } };
      expect(() => parseRunRecord(JSON.stringify(corrupted))).toThrow(/bossPhase\/beat/);
      const moved = { ...record, initialState: { ...record.initialState, enemies: record.initialState.enemies.map(e => ({ ...e, cell: { q: 1, r: -2 } })) } };
      expect(() => parseRunRecord(JSON.stringify(moved))).toThrow(/anchored boss/);
      expect(() => parseRunRecord(JSON.stringify({ ...record, rulesVersion: 'unknown' }))).toThrow('unsupported rules version: unknown');
    }
  });
  it('keeps the encounter and preset on clean session reset, including stale preview invalidation', () => {
    const session = new PatrolSession<CrucibleState, 'phase-one' | 'phase-two-diagnostic'>(() => {}, 0, createCrucible, 'phase-one', 'crucible');
    const pending = session.project({ kind: 'maneuver', maneuver: 'expand', expectedRevision: 0 });
    session.reset('phase-two-diagnostic');
    expect(session.state).toEqual(createCrucible('phase-two-diagnostic'));
    session.confirm(pending); expect(session.message).toContain('stale-session');
    const record = parseRunRecord(session.exportRecord());
    expect(record.fixtureId).toBe('phase-two-diagnostic'); expect(record.acceptedCommands).toEqual([]);
    expect(record.rulesVersion).toBe(CRUCIBLE_RUN_RULES_VERSION);
  });
  it('content rules are independently copied between resets', () => {
    const a = createCrucible(), b = createCrucible();
    expect(a.crucibleRules).toEqual(DEFAULT_CRUCIBLE_RULES);
    expect(a.crucibleRules.patterns).not.toBe(b.crucibleRules.patterns);
  });
});
