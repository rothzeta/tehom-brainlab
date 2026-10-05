import { afterEach, expect, test, vi } from 'vitest';
import { createPatrol } from '../src/content/patrol';
import { applyAbility } from '../src/core/abilities';
import { previewCommand } from '../src/core/preview';
import { applyCommand } from '../src/core/transition';
import { PatrolSession } from '../src/view/patrol-session';

afterEach(() => vi.useRealTimers());
const rules = { warderDamage: 3, censerDamage: 3, harrierDamage: 4,
  isolatedHarrierDamage: 7, splashRadius: 2, closeThreshold: 2,
  damageRules: { directionalReduction: 2, shelterReduction: 2, closeThreshold: 2 } };

test('B2: scout-1 attempt-2 commands 1–3 then End phase resolve exactly once', () => {
  // Historical inputs transcribed from the record, independent of current defaults.
  const base = createPatrol('healthy', rules);
  let state = { ...base,
    brood: base.brood.map(entity => ({ ...entity, hp: entity.id === 'ugallu' ? 18 : 14,
      maxHp: entity.id === 'ugallu' ? 18 : 14 })),
    enemies: base.enemies.map(entity => ({ ...entity,
      hp: entity.id === 'warder' ? 12 : entity.id === 'censer' ? 10 : 13,
      maxHp: entity.id === 'warder' ? 12 : entity.id === 'censer' ? 10 : 13 })) };
  const abilityRules = { clawDamage: 4, stingDamage: 4, impaleDamage: 6,
    galeDamage: 3, damageRules: rules.damageRules };
  for (const [actorId, abilityId] of [['ugallu', 'claw'], ['girtablilu', 'sting'], ['pazuzu', 'gale']] as const) {
    const result = applyAbility(state, { actorId, abilityId, targetId: 'warder',
      expectedRevision: state.revision }, abilityRules);
    expect(result.ok).toBe(true); if (!result.ok) throw new Error(result.error.code);
    state = result.state;
  }
  const bytes = JSON.stringify(state);
  const command = { kind: 'endPhase' as const, expectedRevision: state.revision };
  const preview = previewCommand(state, command, 0), committed = applyCommand(state, command);
  expect(preview.ok).toBe(true); if (!preview.ok) return;
  expect(preview.state.brood.map(entity => entity.hp)).toEqual([8, 11, 11]);
  expect(preview.state).toEqual(committed.state); expect(preview.events).toEqual(committed.events);
  expect(preview.forecast).toMatchObject({ kind: 'not-applicable', events: [] });
  expect(JSON.stringify(state)).toBe(bytes);
});

test.each([0, 1, 3])('B3: End phase reports only the %i actual unused living actions', unused => {
  vi.useFakeTimers();
  const session = new PatrolSession(() => {}, 400, () => {
    const base = createPatrol('healthy', rules);
    return { ...base, actedIds: base.brood.slice(unused).map(entity => entity.id) };
  });
  session.activate({ kind: 'endPhase', expectedRevision: 0 });
  expect(session.state.revision).toBe(1);
  expect(session.message.includes('Unused actions forfeited')).toBe(unused > 0);
  if (unused > 0) expect(session.message).toContain(`Unused actions forfeited: ${unused}.`);
  expect(session.message).toContain('Enemy intentions resolved in the announced order.');
});
