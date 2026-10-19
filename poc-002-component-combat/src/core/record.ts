import { loadContent } from './content';
import { applyCommand, parseCommand } from './engine';
import type { BattleState, CombatRecord, Content, RecordOptions, ReplayResult } from './types';

/** Strict data-only records and pure replay; pattern copied from POC 001
 * src/core/run-record.ts at c82ec3c. Never execute or load anything from records. */
type Check = (v: unknown, p: string) => void;
const fail = (p: string, why: string): never => { throw new Error(`Invalid record at ${p}: ${why}`); };
const integer: Check = (v, p) => { if (typeof v !== 'number' || !Number.isInteger(v) || v < 0 || v > 2147483647) fail(p, 'expected nonnegative integer <= 2147483647'); };
const text: Check = (v, p) => { if (typeof v !== 'string' || !v.trim()) fail(p, 'expected nonempty string'); };
const bool: Check = (v, p) => { if (typeof v !== 'boolean') fail(p, 'expected boolean'); };
const one = (...values: string[]): Check => (v, p) => { if (typeof v !== 'string' || !values.includes(v)) fail(p, 'unknown kind or ID'); };
const nil = (check: Check): Check => (v, p) => { if (v !== null) check(v, p); };
const list = (check: Check): Check => (v, p) => { if (!Array.isArray(v)) fail(p, 'expected array'); (v as unknown[]).forEach((x, i) => check(x, `${p}[${i}]`)); };
const object = (fields: Record<string, Check>): Check => (v, p) => {
  if (!v || typeof v !== 'object' || Array.isArray(v)) fail(p, 'expected object');
  const o = v as Record<string, unknown>;
  for (const key of Object.keys(o)) if (!Object.hasOwn(fields, key)) fail(`${p}.${key}`, 'unknown field');
  for (const [key, check] of Object.entries(fields)) { if (!Object.hasOwn(o, key)) fail(`${p}.${key}`, 'missing field'); check(o[key], `${p}.${key}`); }
};
const tagged = (variants: Record<string, Record<string, Check>>): Check => (v, p) => {
  const k = v && typeof v === 'object' && 'kind' in v ? v.kind : null;
  if (typeof k !== 'string' || !Object.hasOwn(variants, k)) fail(p, 'unknown kind');
  object({ kind: one(k as string), ...variants[k as string] })(v, p);
};
const brood = one('ugallu', 'girtablilu', 'anzu');
const part = one('body', 'core', 'weapon-arm', 'restraining-limb', 'inscription-hand', 'tongue', 'shell', 'locomotion-organ', 'clamp', 'saw', 'choir');
const action = one('claw', 'rend', 'hold-the-threshold', 'pincer', 'envenom', 'rupture-venom', 'talon', 'stolen-bolt', 'revoke', 'guard', 'salve');
const form = one('ugallu-rapture', 'ugallu-rupture', 'girtablilu-rapture', 'girtablilu-rupture', 'anzu-rapture', 'anzu-rupture');
const enemy = one('celestial-guard', 'naming-scribe', 'corrected-beast', 'warden-of-correct-form');
const encounter = one('guard', 'scribe', 'beast', 'guard-scribe', 'beast-scribe', 'guard-beast', 'warden');
const start = one('fresh', 'wounded', 'primed');
const instance: Check = (v, p) => { if (typeof v !== 'string' || !/^(celestial-guard|naming-scribe|corrected-beast|warden-of-correct-form)#[1-9][0-9]*$/.test(v)) fail(p, 'unknown enemy instance ID'); };
const intentId: Check = (v, p) => { if (typeof v !== 'string' || !/^r[1-9][0-9]*\.(celestial-guard|naming-scribe|corrected-beast|warden-of-correct-form)#[1-9][0-9]*\.(strike|pin|inscribe|utter|gore|trample|clamp|saw|hymn|pulse)$/.test(v)) fail(p, 'unknown intent ID'); };
const partTarget = object({ enemy: instance, part });
const statusTarget: Check = (v, p) => v && typeof v === 'object' && 'brood' in v ? object({ brood })(v, p) : object({ enemy: instance })(v, p);
const target: Check = (v, p) => {
  if (v === null) return;
  if (!v || typeof v !== 'object') fail(p, 'invalid target');
  if ('part' in (v as object)) partTarget(v, p);
  else if ('intent' in (v as object)) object({ intent: intentId })(v, p);
  else statusTarget(v, p);
};
const transformation = object({ id: form, kind: one('rapture', 'rupture'), untilRound: integer });
const restraint = object({ enemy: instance, part, untilRound: integer });
const intentModifier = tagged({ 'part-intact-bonus': { part, amount: integer }, 'clamped-bonus': { amount: integer } });
const rider = tagged({ pinned: { durationRounds: integer }, clamped: { durationRounds: integer }, revelation: { amount: integer } });
const intentTarget: Check = (v, p) => v && typeof v === 'object' && 'allBrood' in v ? object({ allBrood: (x, q) => { if (x !== true) fail(q, 'expected true'); } })(v, p) : statusTarget(v, p);
const cancellation = one('source-destroyed', 'enemy-died', 'revoked');
const damageType = one('physical', 'magical', 'poison');
const intent = object({ id: intentId, enemy: instance, sourcePart: part, kind: one('strike', 'pin', 'inscribe', 'utter', 'gore', 'trample', 'clamp', 'saw', 'hymn', 'pulse'), target: intentTarget, damageType, amount: integer, modifiers: list(intentModifier), riders: list(rider), ward: integer, status: one('pending', 'resolved', 'cancelled', 'revoked', 'skipped'), cancellationReason: nil(cancellation) });
const run = tagged({ fight: { encounters: list(encounter), encounterId: encounter, party: list(brood), start }, gauntlet: { gauntletId: one('gauntlet-v1'), encounters: list(encounter), party: list(brood), start } });
const ledgerNumbers = object({ ugallu: integer, girtablilu: integer, anzu: integer });
const state = object({
  round: integer, phase: one('player', 'between-fights', 'victory', 'defeat'), revision: integer,
  party: list(object({ id: brood, hp: integer, maxHp: integer, revelation: integer, revelationCap: integer, acted: bool,
    statuses: object({ guard: nil(object({ untilRound: integer })), hold: nil(object({ target: brood, untilRound: integer })), pinned: nil(restraint), clamped: nil(restraint) }),
    transformation: nil(transformation), pendingCrossing: nil(one('rapture', 'rupture')) })),
  enemies: list(object({ id: instance, definitionId: enemy, parts: list(object({ id: part, kind: one('body', 'component'), pool: integer, maxPool: integer, armor: integer, living: bool, shieldedBy: nil(part) })), poison: integer,
    weakened: nil(object({ amount: integer, untilRound: integer })), wards: list(object({ sourceEnemy: instance, sourcePart: part, intent: intentId, amount: integer, untilRound: integer })) })),
  intents: list(intent), salveUses: integer, ledger: list(object({ enemy: instance, current: ledgerNumbers, previous: ledgerNumbers })), run, fightIndex: integer,
  carried: list(object({ id: brood, hp: integer, revelation: integer })),
});
const damage = object({ damageType, raw: integer, armor: integer, ward: integer, weakened: integer, rupture: integer, guard: integer, hold: integer, applied: integer });
const source = tagged({ action: { actor: brood, action }, intent: { intent: intentId }, retaliation: { actor: brood, intent: intentId }, poison: { enemy: instance }, form: { brood, form } });
const revelationSource = tagged({ action: { action }, intent: { intent: intentId } });
const event = tagged({
  'round-started': { round: integer }, 'intent-declared': { intent }, 'action-used': { actor: brood, action, target },
  'part-damaged': { target: partTarget, source, damage, remaining: integer }, 'part-destroyed': { target: partTarget }, 'enemy-died': { enemy: instance },
  'intent-cancelled': { intent: intentId, reason: cancellation }, 'intent-skipped': { intent: intentId, reason: one('target-dead', 'source-destroyed', 'enemy-died', 'cancelled', 'revoked') },
  'intent-redirected': { intent: intentId, from: brood, to: brood }, 'intent-resolved': { intent: intentId },
  'brood-damaged': { brood, source, damage, remaining: integer }, 'brood-healed': { brood, actor: brood, amount: integer, remaining: integer }, 'brood-died': { brood },
  'status-applied': { target: statusTarget, status: one('poison', 'weakened', 'ward', 'guard', 'hold', 'pinned', 'clamped'), amount: integer, untilRound: nil(integer), source: nil(partTarget) },
  'status-removed': { target: statusTarget, status: one('poison', 'weakened', 'ward', 'guard', 'hold', 'pinned', 'clamped'), reason: one('expired', 'source-destroyed', 'enemy-died', 'brood-died', 'revoked', 'consumed', 'combat-ended') },
  'poison-ticked': { enemy: instance, amount: integer, remainingPoison: integer },
  'revelation-gained': { brood, amount: integer, revelation: integer, source: revelationSource },
  'revelation-burned': { brood, amount: integer, applied: integer, remainingHp: integer, source: revelationSource },
  'transformation-started': { brood, transformation }, 'transformation-ended': { brood, form, reason: one('expired', 'victory', 'death'), revelation: integer },
  retaliated: { actor: brood, intent: intentId, target: partTarget, damage }, 'item-used': { actor: brood, item: one('salve'), target: brood, usesRemaining: integer },
  'combat-ended': { outcome: one('victory', 'defeat'), fightIndex: integer }, 'fight-continued': { encounterId: encounter, fightIndex: integer },
});
const command: Check = (v, p) => { if (!parseCommand(v)) fail(p, 'invalid command'); };
const recordShape = object({ schema: one('tehom-combat-record/1'), prototypeId: one('poc-002-component-combat'), rulesVersion: one('poc-002-rules-v1'), contentVersion: text, buildRevision: text,
  content: (v) => { loadContent(v); }, run, initialState: state, commands: list(object({ command, revision: integer, events: list(event) })), finalState: state });
/** Object keys are irrelevant for parity; array order is contractual (§12). */
function canonical(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(canonical).join(',')}]`;
  if (v !== null && typeof v === 'object') return `{${Object.keys(v).sort().map(k => `${JSON.stringify(k)}:${canonical((v as Record<string, unknown>)[k])}`).join(',')}}`;
  return JSON.stringify(v);
}
function stateInvariants(c: Content, s: BattleState, p: string): void {
  const ids = s.party.map(b => b.id);
  if (!ids.length || new Set(ids).size !== ids.length || canonical(ids) !== canonical(['ugallu', 'girtablilu', 'anzu'].filter(id => ids.includes(id as typeof ids[number])))) fail(p, 'invalid party order or membership');
  if (s.round < 1 || s.fightIndex >= s.run.encounters.length || canonical(s.run.party) !== canonical(ids)) fail(p, 'invalid run position or party');
  for (const b of s.party) {
    const d = c.brood.find(x => x.id === b.id);
    if (!d || b.hp > b.maxHp || b.maxHp !== d.maxHp || b.revelationCap !== d.revelationCap || b.revelation > b.revelationCap || b.pendingCrossing !== null) fail(p, 'invalid Brood pools or pending crossing');
    if (b.hp > 0 && (b.transformation ? b.revelation !== b.revelationCap : b.revelation >= b.revelationCap)) fail(p, 'impossible Revelation/transformation invariant');
    if (b.transformation && (b.hp === 0 || b.transformation.id !== `${b.id}-${b.transformation.kind}` || !c.forms.some(f => f.id === b.transformation!.id))) fail(p, 'invalid transformation');
  }
  if (new Set(s.enemies.map(e => e.id)).size !== s.enemies.length) fail(p, 'duplicate enemy instance');
  for (const e of s.enemies) {
    const d = c.enemies.find(x => x.id === e.definitionId);
    if (!d || e.parts.length !== d.parts.length || new Set(e.parts.map(x => x.id)).size !== e.parts.length) fail(p, 'unknown enemy or parts');
    for (const part of e.parts) { const def = d!.parts.find(x => x.id === part.id); if (!def || part.pool > part.maxPool || part.maxPool !== def.pool) fail(p, 'invalid part pool or ID'); }
  }
}
export function parseRecord(json: unknown): CombatRecord {
  const value: unknown = typeof json === 'string' ? JSON.parse(json) : json;
  recordShape(value, 'record');
  const r = value as CombatRecord;
  if (r.contentVersion !== r.content.contentVersion) fail('contentVersion', 'does not match embedded content');
  if (r.buildRevision !== 'unknown' && !/^[0-9a-f]{7,40}$/.test(r.buildRevision)) fail('buildRevision', 'expected commit or unknown');
  stateInvariants(r.content, r.initialState, 'initialState'); stateInvariants(r.content, r.finalState, 'finalState');
  if (canonical(r.run) !== canonical(r.initialState.run) || canonical(r.run) !== canonical(r.finalState.run)) fail('run', 'descriptor mismatch');
  return structuredClone(r);
}
export function recordOf(options: RecordOptions): CombatRecord {
  return parseRecord({ schema: 'tehom-combat-record/1', prototypeId: 'poc-002-component-combat', rulesVersion: 'poc-002-rules-v1', contentVersion: options.content.contentVersion,
    buildRevision: options.buildRevision, content: options.content, run: options.initialState.run, initialState: options.initialState, commands: options.commands, finalState: options.finalState });
}
export function replayRecord(record: CombatRecord): ReplayResult {
  const r = parseRecord(record); let s = r.initialState; let events = 0;
  for (const [index, step] of r.commands.entries()) {
    const result = applyCommand(r.content, s, step.command);
    if (!result.ok) return { ok: false, commandIndex: index, kind: 'rejected-command', message: result.error.code };
    if (canonical(result.events) !== canonical(step.events)) return { ok: false, commandIndex: index, kind: 'events', message: 'Event divergence' };
    if (result.state.revision !== step.revision) return { ok: false, commandIndex: index, kind: 'revision', message: 'Revision divergence' };
    s = result.state; events += result.events.length;
  }
  if (canonical(s) !== canonical(r.finalState)) return { ok: false, commandIndex: r.commands.length, kind: 'final-state', message: 'Final state divergence' };
  return { ok: true, state: s, commands: r.commands.length, events, outcome: s.phase };
}
