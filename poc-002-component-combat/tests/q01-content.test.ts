import { describe, expect, it } from 'vitest';
import v1 from '../content/combat-content.v1.json';
import { loadContent } from '../src/core/content';
import type { Content } from '../src/core/types';

/** Test-owned miniature content. No v1 tuning is used by validation tests. */
function fixture(): Content {
  return {
    schema: 'tehom-combat-content/1', contentVersion: 'test-owned', fightSalveUses: 5,
    brood: [{ id: 'ugallu', name: 'Test Brood', maxHp: 17, revelationCap: 7, actions: ['claw'], forms: ['ugallu-rapture'] }],
    actions: [{ id: 'claw', name: 'Test hit', target: 'part', revelationCost: 1, effect: { kind: 'damage', damageType: 'physical', amount: 11, componentAmount: 13, ignoreComponentArmor: false } }],
    forms: [{ id: 'ugallu-rapture', brood: 'ugallu', kind: 'rapture', durationRounds: 4, modifiers: [{ kind: 'incoming-bonus', amount: 7 }] }],
    enemies: [{ id: 'celestial-guard', name: 'Test enemy', parts: [
      { id: 'body', name: 'Test body', kind: 'body', pool: 31, armor: 7, living: true, shieldedBy: null },
      { id: 'weapon-arm', name: 'Test arm', kind: 'component', pool: 19, armor: 1, living: true, shieldedBy: null },
    ], intents: [{ kind: 'strike', sourcePart: 'weapon-arm', schedule: { kind: 'modulo', divisor: 5, remainder: 3, matches: true }, targeting: 'lowest-hp', damageType: 'physical', amount: 11, ward: 0, modifiers: [], riders: [] }] }],
    encounters: [{ id: 'guard', enemies: ['celestial-guard'] }],
    gauntlets: [{ id: 'gauntlet-v1', encounters: ['guard'], start: 'fresh', salveUses: 5 }],
    starts: [{ id: 'fresh', kind: 'full', revelationGap: 0 }],
  };
}

describe('Q01 content boundary', () => {
  it('accepts the shipped v1 content (no tuning snapshot)', () => {
    expect(loadContent(v1).contentVersion).toBe('poc-002-content-v1');
    expect(loadContent(v1).brood.map(b => b.id)).toEqual(['ugallu', 'girtablilu', 'anzu']);
    expect(new Set(loadContent(v1).encounters.map(e => e.id))).toEqual(new Set(['guard', 'scribe', 'beast', 'guard-scribe', 'beast-scribe', 'guard-beast', 'warden']));
  });
  it('accepts test-owned tuning and returns an independent copy', () => {
    const input = fixture(); const result = loadContent(input);
    expect(result).toEqual(input); result.brood[0]!.maxHp++;
    expect(input.brood[0]!.maxHp).toBe(17);
    expect(loadContent(JSON.stringify(input))).toEqual(input);
  });
  it.each([0, 23, 2147483647])('accepts the permitted integer boundary %s', amount => {
    const input = fixture(); input.fightSalveUses = amount;
    expect(loadContent(input).fightSalveUses).toBe(amount);
  });
  const invalid: [string, (input: any) => void, string][] = [
    ['unknown effect kind', c => { c.actions[0].effect.kind = 'execute-script'; }, 'kind'],
    ['unknown form modifier', c => { c.forms[0].modifiers[0].kind = 'script'; }, 'kind'],
    ['unknown intent kind', c => { c.enemies[0].intents[0].kind = 'surprise'; }, 'kind'],
    ['unknown target rule', c => { c.enemies[0].intents[0].targeting = 'random'; }, 'targeting'],
    ['unknown schedule', c => { c.enemies[0].intents[0].schedule.kind = 'random'; }, 'kind'],
    ['unknown ID', c => { c.brood[0].id = 'pazuzu'; }, 'id'],
    ['duplicate ID', c => { c.actions.push(structuredClone(c.actions[0])); }, 'duplicate ID'],
    ['duplicate local part', c => { c.enemies[0].parts.push(structuredClone(c.enemies[0].parts[0])); }, 'duplicate ID'],
    ['missing referenced action', c => { c.brood[0].actions.push('guard'); }, 'unknown ID'],
    ['missing referenced enemy', c => { c.encounters[0].enemies.push('naming-scribe'); }, 'unknown ID'],
    ['missing referenced part', c => { c.enemies[0].intents[0].sourcePart = 'tongue'; }, 'unknown ID'],
    ['non-integer', c => { c.brood[0].maxHp = 1.5; }, 'integer'],
    ['negative', c => { c.actions[0].effect.amount = -1; }, 'integer'],
    ['overflow', c => { c.forms[0].durationRounds = 2147483648; }, 'integer'],
    ['NaN', c => { c.enemies[0].parts[0].armor = NaN; }, 'integer'],
    ['missing field', c => { delete c.actions[0].effect.amount; }, 'missing field'],
    ['extra field', c => { c.actions[0].effect.script = 'run()'; }, 'unknown field'],
    ['unsupported schema', c => { c.schema = 'tehom-combat-content/99'; }, 'schema'],
    ['zero schedule divisor', c => { c.enemies[0].intents[0].schedule.divisor = 0; }, 'modulo range'],
    ['schedule remainder out of range', c => { c.enemies[0].intents[0].schedule.remainder = 5; }, 'modulo range'],
  ];
  it.each(invalid)('rejects %s', (_name, change, reason) => {
    const input = fixture(); change(input); expect(() => loadContent(input)).toThrow(reason);
  });
});
