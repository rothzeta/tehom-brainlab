import type { Content } from './types';

/** Strict structural validation followed by ID/reference validation. No code from
 * content is evaluated. The returned copy never aliases the caller's JSON. */
type Check = (value: unknown, path: string) => void;
function fail(path: string, reason: string): never { throw new Error(`Invalid content at ${path}: ${reason}`); }
const integer: Check = (v, p) => { if (typeof v !== 'number' || !Number.isInteger(v) || v < 0 || v > 2147483647) fail(p, 'expected nonnegative integer <= 2147483647'); };
const text: Check = (v, p) => { if (typeof v !== 'string' || !v.trim()) fail(p, 'expected nonempty string'); };
const bool: Check = (v, p) => { if (typeof v !== 'boolean') fail(p, 'expected boolean'); };
const one = (...values: readonly string[]): Check => (v, p) => { if (typeof v !== 'string' || !values.includes(v)) fail(p, `unknown value ${String(v)}; expected ${values.join('|')}`); };
const nullable = (check: Check): Check => (v, p) => { if (v !== null) check(v, p); };
const list = (check: Check, nonempty = true): Check => (v, p) => {
  if (!Array.isArray(v) || (nonempty && !v.length)) fail(p, 'expected nonempty array');
  v.forEach((item, i) => check(item, `${p}[${i}]`));
};
const object = (fields: Record<string, Check>): Check => (v, p) => {
  if (v === null || typeof v !== 'object' || Array.isArray(v)) fail(p, 'expected object');
  const obj = v as Record<string, unknown>;
  for (const key of Object.keys(obj)) if (!Object.hasOwn(fields, key)) fail(`${p}.${key}`, 'unknown field');
  for (const [key, check] of Object.entries(fields)) {
    if (!Object.hasOwn(obj, key)) fail(`${p}.${key}`, 'missing field');
    check(obj[key], `${p}.${key}`);
  }
};
const tagged = (variants: Record<string, Record<string, Check>>): Check => (v, p) => {
  if (v === null || typeof v !== 'object' || Array.isArray(v)) fail(p, 'expected kind object');
  const kind = (v as { kind?: unknown }).kind;
  if (typeof kind !== 'string' || !Object.hasOwn(variants, kind)) fail(`${p}.kind`, `unknown kind ${String(kind)}`);
  object({ kind: one(kind), ...variants[kind] })(v, p);
};
const broodId = one('ugallu', 'girtablilu', 'anzu');
const actionId = one('claw', 'rend', 'hold-the-threshold', 'pincer', 'envenom', 'rupture-venom', 'talon', 'stolen-bolt', 'revoke', 'guard', 'salve');
const enemyId = one('celestial-guard', 'naming-scribe', 'corrected-beast', 'warden-of-correct-form');
const partId = one('body', 'core', 'weapon-arm', 'restraining-limb', 'inscription-hand', 'tongue', 'shell', 'locomotion-organ', 'clamp', 'saw', 'choir');
const encounterId = one('guard', 'scribe', 'beast', 'guard-scribe', 'beast-scribe', 'guard-beast', 'warden');
const startId = one('fresh', 'wounded', 'primed');
const formId = one('ugallu-rapture', 'ugallu-rupture', 'girtablilu-rapture', 'girtablilu-rupture', 'anzu-rapture', 'anzu-rupture');
const damageType = one('physical', 'magical', 'poison');
const schema = object({
  schema: one('tehom-combat-content/1'), contentVersion: text, fightSalveUses: integer,
  brood: list(object({ id: broodId, name: text, maxHp: integer, revelationCap: integer, actions: list(actionId), forms: list(formId) })),
  actions: list(object({ id: actionId, name: text, target: one('part', 'component', 'poisoned-enemy', 'intent', 'brood', 'none'), revelationCost: integer,
    effect: tagged({ damage: { damageType, amount: integer, componentAmount: integer, ignoreComponentArmor: bool }, hold: { physicalReduction: integer, retaliation: integer }, envenom: { amount: integer, poisonGain: integer, poisonCap: integer, weakenedReduction: integer }, 'rupture-venom': { multiplier: integer }, revoke: {}, guard: {}, heal: { amount: integer } }) })),
  forms: list(object({ id: formId, brood: broodId, kind: one('rapture', 'rupture'), durationRounds: integer,
    modifiers: list(tagged({ 'attack-bonus': { actions: list(actionId), amount: integer, ignoreArmor: bool }, 'block-actions': { actions: list(actionId) }, 'incoming-bonus': { amount: integer }, 'poison-set': { amount: integer }, 'venom-multiplier': { amount: integer }, 'round-hp-loss': { amount: integer }, 'bolt-amount': { amount: integer }, 'revoke-any-source': {} }), false) })),
  enemies: list(object({ id: enemyId, name: text,
    parts: list(object({ id: partId, name: text, kind: one('body', 'component'), pool: integer, armor: integer, living: bool, shieldedBy: nullable(partId) })),
    intents: list(object({ kind: one('strike', 'pin', 'inscribe', 'utter', 'gore', 'trample', 'clamp', 'saw', 'hymn', 'pulse'), sourcePart: partId,
      schedule: tagged({ 'every-round': {}, modulo: { divisor: integer, remainder: integer, matches: bool } }),
      targeting: one('ledger-then-highest-hp', 'lowest-hp', 'first-other-enemy', 'highest-revelation-untransformed', 'highest-revelation-then-lowest-hp', 'clamped-else-highest-hp', 'all-brood'),
      damageType, amount: integer, ward: integer,
      modifiers: list(tagged({ 'part-intact-bonus': { part: partId, amount: integer }, 'clamped-bonus': { amount: integer } }), false),
      riders: list(tagged({ pinned: { durationRounds: integer }, clamped: { durationRounds: integer }, revelation: { amount: integer } }), false) }), false) })),
  encounters: list(object({ id: encounterId, enemies: list(enemyId) })),
  gauntlets: list(object({ id: one('gauntlet-v1'), encounters: list(encounterId), start: startId, salveUses: integer })),
  starts: list(object({ id: startId, kind: one('full', 'half-hp', 'below-cap'), revelationGap: integer })),
});
function unique(values: readonly string[], path: string): void {
  if (new Set(values).size !== values.length) fail(path, 'duplicate ID');
}
function reference(id: string, ids: readonly string[], path: string): void {
  if (!ids.includes(id)) fail(path, `unknown ID ${id}`);
}
/** Brief A3-1: conservative bounds include mutually exclusive alternatives and
 * never subtract reductions. BigInt keeps validation itself overflow-free. */
function arithmeticBounds(c: Content): void {
  const sum = (values: number[]) => values.reduce((total, value) => total + BigInt(value), 0n);
  const largest = (values: number[]) => values.reduce((max, value) => Math.max(max, value), 0);
  const bound = (path: string, value: bigint) => { if (value > 2147483647n) fail(path, 'derived arithmetic exceeds portable integer limit 2147483647'); };
  const modifiers = c.forms.flatMap(f => f.modifiers);
  for (const a of c.actions) if (a.effect.kind === 'damage' || a.effect.kind === 'envenom') {
    const alternatives = [a.effect.amount];
    if (a.effect.kind === 'damage') alternatives.push(a.effect.componentAmount);
    if (a.id === 'stolen-bolt') for (const m of modifiers) if (m.kind === 'bolt-amount') alternatives.push(m.amount);
    const bonuses = modifiers.flatMap(m => m.kind === 'attack-bonus' && m.actions.includes(a.id) ? [m.amount] : []);
    bound(`${a.id}.B1 action damage`, BigInt(largest(alternatives)) + sum(bonuses));
  }
  const poison = c.actions.flatMap(a => a.effect.kind === 'envenom' ? [a.effect] : []);
  const pmax = largest([...poison.map(e => e.poisonCap), ...modifiers.flatMap(m => m.kind === 'poison-set' ? [m.amount] : [])]);
  const mmax = largest([...c.actions.flatMap(a => a.effect.kind === 'rupture-venom' ? [a.effect.multiplier] : []), ...modifiers.flatMap(m => m.kind === 'venom-multiplier' ? [m.amount] : [])]);
  bound('B2 poison product', BigInt(pmax) * BigInt(mmax));
  bound('B2 poison gain', BigInt(pmax) + BigInt(largest(poison.map(e => e.poisonGain))));
  const incoming = sum(modifiers.flatMap(m => m.kind === 'incoming-bonus' ? [m.amount] : []));
  for (const e of c.enemies) {
    bound(`${e.id}.B5 pools`, sum(e.parts.map(p => p.pool)));
    for (const i of e.intents) bound(`${e.id}.${i.kind}.B3 intent damage`, BigInt(i.amount) + sum(i.modifiers.map(m => m.amount)) + incoming);
  }
  const gain = largest([...c.actions.map(a => a.revelationCost), ...c.enemies.flatMap(e => e.intents.flatMap(i => i.riders.flatMap(r => r.kind === 'revelation' ? [r.amount] : [])))]);
  for (const b of c.brood) bound(`${b.id}.B4 Revelation`, BigInt(b.revelationCap) + BigInt(gain));
  for (const f of c.forms) if (f.durationRounds < 1) fail(`${f.id}.B6 durationRounds`, 'duration must be at least 1');
  for (const e of c.enemies) for (const i of e.intents) for (const r of i.riders) {
    if (r.kind !== 'revelation' && r.durationRounds < 1) fail(`${e.id}.${i.kind}.${r.kind}.B6 durationRounds`, 'duration must be at least 1');
  }
  for (const b of c.brood) if (b.revelationCap < 1) fail(`${b.id}.B7 revelationCap`, 'Revelation cap must be at least 1');
  const smallestCap = Math.min(...c.brood.map(b => b.revelationCap));
  for (const s of c.starts) if (s.kind === 'below-cap' && (s.revelationGap < 1 || s.revelationGap > smallestCap)) {
    fail(`${s.id}.B7 revelationGap`, 'below-cap gap must be between 1 and the smallest Revelation cap');
  }
}
export function loadContent(json: unknown): Content {
  const value: unknown = typeof json === 'string' ? JSON.parse(json) : json;
  schema(value, 'content');
  const c = value as Content;
  for (const key of ['brood', 'actions', 'forms', 'enemies', 'encounters', 'gauntlets', 'starts'] as const) unique(c[key].map(v => v.id), key);
  const ids = { brood: c.brood.map(v => v.id), actions: c.actions.map(v => v.id), forms: c.forms.map(v => v.id), enemies: c.enemies.map(v => v.id), encounters: c.encounters.map(v => v.id), starts: c.starts.map(v => v.id) };
  for (const b of c.brood) {
    unique(b.actions, `${b.id}.actions`); unique(b.forms, `${b.id}.forms`);
    b.actions.forEach(id => reference(id, ids.actions, `${b.id}.actions`));
    b.forms.forEach(id => {
      reference(id, ids.forms, `${b.id}.forms`);
      if (c.forms.find(f => f.id === id)!.brood !== b.id) fail(`${b.id}.forms`, 'form belongs to another Brood');
    });
  }
  for (const f of c.forms) {
    reference(f.brood, ids.brood, `${f.id}.brood`);
    if (f.id !== `${f.brood}-${f.kind}`) fail(f.id, 'form ID does not match Brood/kind');
    for (const m of f.modifiers) if ('actions' in m) { unique(m.actions, `${f.id}.actions`); m.actions.forEach(id => reference(id, ids.actions, f.id)); }
  }
  for (const e of c.enemies) {
    unique(e.parts.map(p => p.id), `${e.id}.parts`); unique(e.intents.map(i => i.kind), `${e.id}.intents`);
    if (e.parts.filter(p => p.kind === 'body').length !== 1) fail(e.id, 'expected exactly one body');
    const parts = e.parts.map(p => p.id);
    for (const p of e.parts) if (p.shieldedBy !== null) {
      reference(p.shieldedBy, parts, `${e.id}.${p.id}.shieldedBy`);
      if (e.parts.find(s => s.id === p.shieldedBy)!.kind !== 'component' || p.id === p.shieldedBy) fail(e.id, 'shield must be another component');
    }
    for (const i of e.intents) {
      reference(i.sourcePart, parts, `${e.id}.${i.kind}.sourcePart`);
      for (const m of i.modifiers) if (m.kind === 'part-intact-bonus') reference(m.part, parts, `${e.id}.${i.kind}.modifier`);
      if (i.schedule.kind === 'modulo' && (i.schedule.divisor === 0 || i.schedule.remainder >= i.schedule.divisor)) fail(`${e.id}.${i.kind}.schedule`, 'invalid modulo range');
    }
  }
  for (const e of c.encounters) { unique(e.enemies, `${e.id}.enemies`); e.enemies.forEach(id => reference(id, ids.enemies, e.id)); }
  for (const g of c.gauntlets) { g.encounters.forEach(id => reference(id, ids.encounters, g.id)); reference(g.start, ids.starts, g.id); }
  arithmeticBounds(c);
  return structuredClone(c);
}
