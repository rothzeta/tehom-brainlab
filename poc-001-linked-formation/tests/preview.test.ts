import { describe, expect, it } from 'vitest';
import { ABILITIES } from '../src/content/brood';
import type { AbilityId } from '../src/content/brood';
import { createPatrol } from '../src/content/patrol';
import type { PatrolPreset, PatrolState, PatrolRules } from '../src/content/patrol';
import { formations } from '../src/core/formation';
import type { Command, GameplayEvent } from '../src/core/commands';
import type { CombatState } from '../src/core/state';
import { createInitialState } from '../src/core/state';
import { previewCommand, previewValidity } from '../src/core/preview';
import type { CommandPreview } from '../src/core/preview';
import { applyCommand } from '../src/core/transition';
import { LabSession, MANEUVERS } from '../src/view/lab-state';

function frozen<T>(value: T): T {
  if (value && typeof value === 'object') { Object.values(value).forEach(frozen); Object.freeze(value); }
  return value;
}
const rules: PatrolRules = { warderDamage: 5, censerDamage: 0, harrierDamage: 0,
  isolatedHarrierDamage: 0, splashRadius: 2, closeThreshold: 2,
  damageRules: { directionalReduction: 2, shelterReduction: 2, closeThreshold: 2 } };
const damageEvents = (events: readonly GameplayEvent[]) => events.filter((event) => event.type === 'damage-applied');
function availableFacts(preview: Extract<CommandPreview, { ok: true }>) {
  const { before, after } = preview.projection;
  expect(before.available).toBe(true); expect(after.available).toBe(true);
  if (!before.available || !after.available) throw new Error('Expected selector facts for a valid fixture');
  return { before, after };
}
function attack(state: CombatState, targetId: string, rawDamage: number): Command {
  return { kind: 'attack', expectedRevision: state.revision, eventId: 'controlled-hit',
    sourceId: 'ugallu', recipientIds: [targetId], rawDamage, bypassProtection: true };
}
function commands(state: PatrolState): Command[] {
  return [
    ...MANEUVERS.map((maneuver): Command => ({ kind: 'maneuver', expectedRevision: state.revision, maneuver })),
    ...(Object.keys(ABILITIES) as AbilityId[]).flatMap((abilityId) => {
      const actorId = ABILITIES[abilityId].brood;
      const targets = abilityId === 'shelter' ? state.brood : state.enemies;
      return targets.flatMap(({ id: targetId }) => abilityId === 'crosswind'
        ? (['clockwise', 'anticlockwise'] as const).map((direction): Command => ({ kind: 'useAbility',
          expectedRevision: state.revision, actorId, abilityId, targetId, direction }))
        : [{ kind: 'useAbility', expectedRevision: state.revision, actorId, abilityId, targetId } as Command]);
    }),
    attack(state, 'warder', 2),
    { kind: 'endPhase', expectedRevision: state.revision },
  ];
}

describe('P09 preview / real transition equivalence', () => {
  it.each(['healthy', 'wounded-ugallu', 'wounded-girtablilu'] as PatrolPreset[])(
    'compares every maneuver and ability/target/direction over all twelve formations: %s', (preset) => {
      let comparisons = 0, accepted = 0, rejected = 0;
      for (const formation of formations()) {
        const state = frozen({ ...createPatrol(preset, rules), formation });
        const bytes = JSON.stringify(state);
        for (const command of commands(state)) {
          const input = frozen(command);
          const preview = previewCommand(state, input, 7);
          const committed = applyCommand(structuredClone(state), structuredClone(input));
          expect(preview.ok).toBe(committed.ok);
          expect(preview.state).toEqual(committed.state);
          expect(preview.events).toEqual(committed.events);
          if (preview.ok) {
            accepted++;
            availableFacts(preview);
            if (preview.forecast.kind === 'transition') {
              const ended = applyCommand(structuredClone(committed.state), {
                kind: 'endPhase', expectedRevision: committed.state.revision });
              expect(preview.forecast.ok).toBe(ended.ok);
              expect(preview.forecast.state).toEqual(ended.state);
              expect(preview.forecast.events).toEqual(ended.events);
              expect(preview.forecast.condition).toBe('If end phase now');
              expect(preview.forecast.enemyEvents.some((event) => event.type === 'intentions-announced')).toBe(false);
            }
          } else {
            rejected++;
            expect(committed.ok).toBe(false);
            if (!committed.ok) expect(preview.error).toEqual(committed.error);
            expect(preview).not.toHaveProperty('projection');
            expect(preview).not.toHaveProperty('forecast');
          }
          expect(previewCommand(state, input, 7)).toEqual(preview);
          expect(JSON.stringify(state)).toBe(bytes);
          expect(JSON.stringify(input)).toBe(JSON.stringify(command));
          comparisons++;
        }
      }
      console.log(`P09 ${preset}: ${comparisons} comparisons (${accepted} accepted, ${rejected} rejected), each repeated`);
      expect(accepted).toBeGreaterThan(0); expect(rejected).toBeGreaterThan(0);
    });

  it('preserves rejection reasons across stale, spent, fallen, terminal, invalid and unsupported states', () => {
    const base = createPatrol('healthy', rules);
    const fixtures = [base, { ...base, actedIds: ['ugallu'] }, { ...base, maneuverUsed: true },
      { ...base, phase: 'victory' as const }, { ...base, brood: base.brood.map((entity) =>
        entity.id === 'ugallu' ? { ...entity, hp: 0 } : entity) }];
    for (const state of fixtures) for (const command of [
      ...commands(state), { kind: 'endPhase', expectedRevision: -1 } as Command,
      { kind: 'useAbility', expectedRevision: 0, actorId: 'missing', abilityId: 'claw', targetId: 'warder' } as Command,
      { kind: 'useAbility', expectedRevision: 0, actorId: 'pazuzu', abilityId: 'crosswind', targetId: 'warder' } as Command,
      { kind: 'attack', expectedRevision: 0, rawDamage: -1 } as Command,
    ]) {
      const expected = applyCommand(structuredClone(state), command);
      const actual = previewCommand(frozen(state), frozen(command), 1);
      expect(actual.ok).toBe(expected.ok); expect(actual.state).toEqual(expected.state); expect(actual.events).toEqual(expected.events);
      if (!actual.ok && !expected.ok) { expect(actual.error).toEqual(expected.error); expect(actual).not.toHaveProperty('projection'); }
    }
    const unsupported = previewCommand(frozen(createInitialState()), { kind: 'endPhase', expectedRevision: 0 }, 1);
    expect(unsupported.ok).toBe(false);
    if (!unsupported.ok) expect(unsupported.error.code).toBe('unsupported-command');
  });

  it('owns deeply immutable results without freezing or sharing mutable input collections', () => {
    const live = createPatrol('healthy', rules), command = attack(live, 'warder', 2);
    const preview = previewCommand(live, command, 1);
    const checkFrozen = (value: unknown): void => {
      if (value && typeof value === 'object') { expect(Object.isFrozen(value)).toBe(true); Object.values(value).forEach(checkFrozen); }
    };
    checkFrozen(preview); expect(Object.isFrozen(live.brood)).toBe(false); expect(Object.isFrozen(command)).toBe(false);
    const bytes = JSON.stringify(preview);
    (live.brood[0]!.statuses as string[]).push('external');
    if (command.kind === 'attack') (command.recipientIds as string[]).push('censer');
    expect(JSON.stringify(preview)).toBe(bytes);
  });
});

describe('P09 independent recipient and impact fixtures', () => {
  it('Shelter then expansion loses exactly the explicit mitigation and enables Impale', () => {
    const initial = createPatrol('healthy', rules);
    const sheltered = applyCommand(initial, { kind: 'useAbility', expectedRevision: 0,
      actorId: 'ugallu', abilityId: 'shelter', targetId: 'girtablilu' });
    expect(sheltered.ok).toBe(true); if (!sheltered.ok) return;
    const state = frozen({ ...sheltered.state, brood: sheltered.state.brood.map((entity) => ({ ...entity, hp: 20, maxHp: 20 })),
      declaredIntentions: [{ id: 'warder-hit', sourceId: 'warder', kind: 'marked-hit' as const, targetId: 'girtablilu' }] });
    const preview = previewCommand(state, { kind: 'maneuver', maneuver: 'expand', expectedRevision: state.revision }, 1);
    expect(preview.ok).toBe(true); if (!preview.ok) return;
    const facts = availableFacts(preview);
    expect(facts.before.shelters[0]?.eligible).toBe(true);
    expect(facts.after.shelters[0]?.eligible).toBe(false);
    const impale = preview.projection.abilitiesEnabled.find((entry) => entry.request.abilityId === 'impale')!;
    expect(impale.legality.ok).toBe(true);
    expect(facts.before.abilities.find((entry) => entry.request.actorId === impale.request.actorId
      && entry.request.abilityId === 'impale' && entry.request.targetId === impale.request.targetId)?.legality)
      .toEqual({ ok: false, error: { code: 'illegal-ability' } });
    const command: Command = { kind: 'useAbility', expectedRevision: preview.state.revision,
      actorId: impale.request.actorId, abilityId: 'impale', targetId: impale.request.targetId };
    expect(applyCommand(structuredClone(preview.state), command).ok).toBe(true);
    expect(facts.after.positions).toEqual([
      { brood: 'ugallu', cell: { q: 2, r: 0 } }, { brood: 'girtablilu', cell: { q: -2, r: 2 } },
      { brood: 'pazuzu', cell: { q: 0, r: -2 } },
    ]);
    const compactEnd = applyCommand(structuredClone(state), { kind: 'endPhase', expectedRevision: state.revision });
    expect(damageEvents(compactEnd.events)[0]).toMatchObject({ targetId: 'girtablilu', damage: 3, shelterReduction: 2, hpAfter: 17 });
    const forecast = preview.forecast;
    expect(forecast.kind).toBe('transition');
    if (forecast.kind === 'transition') {
      expect(forecast.ok).toBe(true);
      expect(damageEvents(forecast.events)[0]).toMatchObject({ targetId: 'girtablilu', damage: 5, shelterReduction: 0, hpAfter: 15 });
      expect(forecast).toMatchObject(applyCommand(structuredClone(preview.state), { kind: 'endPhase', expectedRevision: preview.state.revision }));
    }
  });

  it('a Warder kill removes protection and its declared attack before forecasting', () => {
    const base = createPatrol('healthy', rules);
    const state = frozen({ ...base, enemies: base.enemies.map((enemy) => enemy.id === 'warder' ? { ...enemy, hp: 2, cell: { q: 1, r: -2 }, facing: 0 as const } : enemy) });
    const preview = previewCommand(state, attack(state, 'warder', 2), 1);
    expect(preview.ok).toBe(true); if (!preview.ok) return;
    const facts = availableFacts(preview);
    expect(preview.state.protections).toEqual([]);
    expect(preview.projection.protectionLost.map((entry) => entry.actorId)).toEqual(['ugallu']);
    expect(preview.events).toContainEqual({ type: 'intention-cancelled', intentionId: 'patrol:1:warder', reason: 'source-fallen' });
    expect(facts.after.threats.some((entry) => entry.intention.sourceId === 'warder')).toBe(false);
    expect(preview.forecast.kind).toBe('transition');
    if (preview.forecast.kind === 'transition') {
      expect(preview.forecast.events.some((event) => event.type === 'attack-settled' && event.sourceId === 'warder')).toBe(false);
      expect(preview.forecast.state.brood.map(({ hp }) => hp)).toEqual(state.brood.map(({ hp }) => hp));
    }
  });

  it('Crosswind changes facing, protection and only turnable areas; marks remain distinct', () => {
    const { patrolRules: _rules, patrolVersion: _version, ...base } = createPatrol('healthy', rules);
    const state: CombatState = frozen({ ...base, enemies: base.enemies.map(enemy => enemy.id === 'warder'
      ? { ...enemy, cell: { q: 1, r: -2 }, facing: 0 as const } : enemy), declaredIntentions: [
      { id: 'turn', sourceId: 'warder', kind: 'fixed-area', cells: [{ q: 2, r: 0 }], turnable: true },
      { id: 'fixed', sourceId: 'warder', kind: 'fixed-area', cells: [{ q: 2, r: 0 }], turnable: false },
      { id: 'mark', sourceId: 'warder', kind: 'marked-hit', targetId: 'ugallu' },
    ] });
    const preview = previewCommand(state, { kind: 'useAbility', expectedRevision: 0, actorId: 'pazuzu',
      abilityId: 'crosswind', targetId: 'warder', direction: 'clockwise' }, 1);
    expect(preview.ok).toBe(true); if (!preview.ok) return;
    const facts = availableFacts(preview);
    expect(preview.state.enemies.find(({ id }) => id === 'warder')?.facing).toBe(1);
    expect(preview.projection.protectionLost.map(entry => entry.actorId)).toEqual([]);
    expect(preview.projection.protectionGained.map(entry => entry.actorId)).toEqual(['pazuzu']);
    expect(facts.after.threats.map(({ intention, cells, recipientIds }) => ({ kind: intention.kind, cells, recipientIds }))).toEqual([
      { kind: 'fixed-area', cells: [{ q: -1, r: 1 }], recipientIds: ['girtablilu'] },
      { kind: 'fixed-area', cells: [{ q: 2, r: 0 }], recipientIds: [] },
      { kind: 'marked-hit', cells: [{ q: 1, r: 0 }], recipientIds: ['ugallu'] },
    ]);
    expect(preview.forecast.kind).toBe('unavailable');
  });

  it('a fallen mark cancels without recipients or a replacement target', () => {
    const base = createPatrol('healthy', rules);
    const state = frozen({ ...base, brood: base.brood.map((entity) => entity.id === 'girtablilu' ? { ...entity, hp: 0 } : entity) });
    const preview = previewCommand(state, { kind: 'maneuver', expectedRevision: 0, maneuver: 'expand' }, 1);
    expect(preview.ok).toBe(true); if (!preview.ok) return;
    const facts = availableFacts(preview);
    expect(facts.after.threats.find((entry) => entry.intention.sourceId === 'censer')).toMatchObject({ cells: [], recipientIds: [], reason: 'target-fallen' });
    expect(facts.after.abilities.filter((entry) => entry.request.actorId === 'girtablilu').every((entry) => !entry.legality.ok)).toBe(true);
    if (preview.forecast.kind === 'transition') expect(preview.forecast.events.some((event) => event.type === 'attack-settled' && event.sourceId === 'censer')).toBe(false);
  });

  it('final-enemy kill has victory and no subsequent enemy forecast or duplicate live events', () => {
    const base = createPatrol('healthy', rules);
    const state = frozen({ ...base, enemies: base.enemies.map((enemy) => ({ ...enemy, hp: enemy.id === 'warder' ? 2 : 0 })) });
    const lab = new LabSession(() => state), command = frozen(attack(state, 'warder', 2));
    const bytes = JSON.stringify(lab.state);
    const first = lab.previewCommand(command);
    for (let i = 0; i < 5; i++) { expect(lab.previewCommand(command)).toEqual(first); lab.cancel(); }
    expect(JSON.stringify(lab.state)).toBe(bytes);
    expect(first.ok).toBe(true); if (!first.ok) return;
    expect(first.state.phase).toBe('victory'); expect(first.forecast).toMatchObject({ kind: 'terminal', events: [] });
    const commit = lab.confirmPreview(first);
    expect(commit.events.filter((event) => event.type === 'combat-ended')).toEqual([{ type: 'combat-ended', outcome: 'victory' }]);
    expect(lab.confirmPreview(first)).toMatchObject({ ok: false, events: [], error: { code: 'stale-revision' } });
  });

  it('end-now can forecast defeat without spending a still-available player action', () => {
    const base = createPatrol('healthy', { ...rules, warderDamage: 20, censerDamage: 20, harrierDamage: 20 });
    const preview = previewCommand(frozen(base), { kind: 'maneuver', expectedRevision: 0, maneuver: 'clockwise' }, 1);
    expect(preview.ok).toBe(true); if (!preview.ok) return;
    expect(preview.state.actedIds).toEqual([]);
    expect(preview.forecast.kind).toBe('transition');
    if (preview.forecast.kind === 'transition') expect(preview.forecast.state.phase).toBe('defeat');
    expect(base.phase).toBe('player');
  });

  it.each(['warderDamage', 'splashRadius', 'closeThreshold'] as const)(
    'invalid %s preserves the accepted immediate result and the real rejected forecast', (field) => {
      const state = frozen(createPatrol('healthy', { ...rules, [field]: -1 }));
      const bytes = JSON.stringify(state);
      const command: Command = { kind: 'maneuver', maneuver: 'expand', expectedRevision: 0 };
      const immediate = applyCommand(structuredClone(state), command);
      expect(immediate.ok).toBe(true); if (!immediate.ok) return;
      const ended = applyCommand(structuredClone(immediate.state), {
        kind: 'endPhase', expectedRevision: immediate.state.revision });
      expect(ended).toMatchObject({ ok: false, events: [], error: { code: 'invalid-amount' } });
      for (let attempt = 0; attempt < 2; attempt++) {
        const preview = previewCommand(state, command, 1);
        expect(preview.ok).toBe(true); if (!preview.ok) return;
        expect(preview.state).toEqual(immediate.state); expect(preview.events).toEqual(immediate.events);
        expect(preview.forecast).toMatchObject({ kind: 'transition', ...ended, enemyEvents: [] });
        expect(preview.projection.before.available).toBe(field === 'warderDamage');
        expect(preview.projection.after.available).toBe(field === 'warderDamage');
        expect(JSON.stringify(state)).toBe(bytes);
      }
    });

  it('a protection-selector rejection cannot replace an accepted immediate or end-phase result', () => {
    const base = createPatrol('healthy', rules);
    // Maneuvers and patrol marked attacks do not validate directional protection facing.
    const state = frozen({ ...base, enemies: base.enemies.map(enemy => enemy.id === 'warder'
      ? { ...enemy, facing: 6 as typeof enemy.facing } : enemy) });
    const bytes = JSON.stringify(state);
    const command: Command = { kind: 'maneuver', maneuver: 'expand', expectedRevision: 0 };
    const immediate = applyCommand(structuredClone(state), command);
    expect(immediate.ok).toBe(true); if (!immediate.ok) return;
    const ended = applyCommand(structuredClone(immediate.state), { kind: 'endPhase', expectedRevision: immediate.state.revision });
    expect(ended.ok).toBe(true);
    const preview = previewCommand(state, command, 1);
    expect(preview.ok).toBe(true); if (!preview.ok) return;
    expect(preview.state).toEqual(immediate.state); expect(preview.events).toEqual(immediate.events);
    expect(preview.projection.before.available).toBe(false); expect(preview.projection.after.available).toBe(false);
    expect(preview.forecast).toMatchObject({ kind: 'transition', ...ended });
    expect(JSON.stringify(state)).toBe(bytes);
  });

  it('an invalid Shelter selector threshold preserves immediate equivalence and the real forecast rejection', () => {
    const sheltered = applyCommand(createPatrol('healthy', rules), { kind: 'useAbility', expectedRevision: 0,
      actorId: 'ugallu', abilityId: 'shelter', targetId: 'girtablilu' });
    expect(sheltered.ok).toBe(true); if (!sheltered.ok) return;
    const state = frozen({ ...sheltered.state, patrolRules: { ...rules,
      damageRules: { ...rules.damageRules, closeThreshold: -1 } } });
    const bytes = JSON.stringify(state);
    const command: Command = { kind: 'maneuver', maneuver: 'expand', expectedRevision: state.revision };
    const immediate = applyCommand(structuredClone(state), command);
    expect(immediate.ok).toBe(true); if (!immediate.ok) return;
    const preview = previewCommand(state, command, 1);
    expect(preview.ok).toBe(true); if (!preview.ok) return;
    expect(preview.state).toEqual(immediate.state); expect(preview.events).toEqual(immediate.events);
    const ended = applyCommand(structuredClone(immediate.state), { kind: 'endPhase', expectedRevision: immediate.state.revision });
    expect(ended).toMatchObject({ ok: false, events: [], error: { code: 'invalid-amount' } });
    expect(preview.forecast).toMatchObject({ kind: 'transition', ...ended, enemyEvents: [] });
    expect(preview.projection.before.available).toBe(false);
    expect(preview.projection.after.available).toBe(false);
    expect(JSON.stringify(state)).toBe(bytes);
  });
});

describe('P09 adapter session invalidation and live command confirmation', () => {
  it('invalidates after another accepted action and after a reset at the same revision', () => {
    const lab = new LabSession(() => createPatrol('healthy', rules));
    const preview = lab.previewCommand({ kind: 'maneuver', expectedRevision: 0, maneuver: 'expand' });
    lab.previewManeuver('expand');
    expect(lab.submit(attack(lab.state as PatrolState, 'warder', 2)).ok).toBe(true);
    expect(lab.preview).toBeUndefined();
    expect(previewValidity(lab.state, preview.sessionGeneration, preview)).toBe('stale-revision');
    const bytes = JSON.stringify(lab.state);
    expect(lab.confirmPreview(preview)).toMatchObject({ ok: false, events: [], error: { code: 'stale-revision' } });
    expect(JSON.stringify(lab.state)).toBe(bytes);
    lab.reset();
    expect(lab.state.revision).toBe(0);
    expect(lab.confirmPreview(preview)).toMatchObject({ ok: false, events: [], error: { code: 'stale-session' } });
    lab.selectFixture({ shape: 'spread', orientation: 2 });
    expect(lab.confirmPreview(preview)).toMatchObject({ ok: false, events: [], error: { code: 'stale-session' } });
  });

  it('cancellation never spends budgets and confirmation revalidates the original command', () => {
    const lab = new LabSession(() => createPatrol('healthy', rules));
    const before = frozen(lab.state), bytes = JSON.stringify(before);
    const preview = lab.previewCommand({ kind: 'maneuver', expectedRevision: 0, maneuver: 'expand' });
    lab.previewManeuver('expand'); lab.cancel(); expect(lab.preview).toBeUndefined(); expect(JSON.stringify(lab.state)).toBe(bytes);
    const expected = applyCommand(structuredClone(before), preview.command);
    expect(lab.confirmPreview(preview)).toEqual(expected);
    expect(lab.state).toEqual(preview.state); expect(lab.state).not.toBe(preview.state);
    expect(lab.confirmPreview(preview)).toMatchObject({ ok: false, events: [], error: { code: 'stale-revision' } });
  });
});
