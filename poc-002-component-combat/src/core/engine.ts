import type {
  ActionDefinition, BattleState, BroodId, BroodState, CancellationReason, Command,
  CommandResult, Content, DamageBreakdown, DamageSource, DamageType, DeclaredIntent,
  EnemyInstanceId, EnemyState, Event, FightOptions, FormModifier, GauntletOptions,
  IntentDefinition, IntentTarget, LegalAction, PartState, RejectionCode, RevelationSource,
  RunDescriptor, StatusKind, StatusRemovalReason, StatusTarget, Target,
} from './types';

const roster: BroodId[] = ['ugallu', 'girtablilu', 'anzu'];
const emptyStatuses = (): BroodState['statuses'] => ({ guard: null, hold: null, pinned: null, clamped: null });
const emptyLedger = () => ({ ugallu: 0, girtablilu: 0, anzu: 0 });
const body = (e: EnemyState) => e.parts.find(p => p.kind === 'body')!;
const alive = (e: EnemyState) => body(e).pool > 0;
const partOf = (e: EnemyState, id: string) => e.parts.find(p => p.id === id);
const modifiers = (c: Content, b: BroodState): FormModifier[] => c.forms.find(f => f.id === b.transformation?.id)?.modifiers ?? [];
function modifier<K extends FormModifier['kind']>(c: Content, b: BroodState, kind: K): Extract<FormModifier, { kind: K }> | undefined {
  return modifiers(c, b).find(m => m.kind === kind) as Extract<FormModifier, { kind: K }> | undefined;
}
const holdEffect = (c: Content) => c.actions.find(a => a.effect.kind === 'hold')?.effect;
const removed = (events: Event[], target: StatusTarget, status: StatusKind, reason: StatusRemovalReason) => events.push({ kind: 'status-removed', target, status, reason });
const applied = (events: Event[], target: StatusTarget, status: StatusKind, amount: number, untilRound: number | null, source: { enemy: EnemyInstanceId; part: PartState['id'] } | null = null) => events.push({ kind: 'status-applied', target, status, amount, untilRound, source });
const blankDamage = (raw: number, damageType: DamageType): DamageBreakdown => ({ raw, damageType, armor: 0, ward: 0, weakened: 0, rupture: 0, guard: 0, hold: 0, applied: 0 });

function chooseTarget(s: BattleState, e: EnemyState, d: IntentDefinition): IntentTarget {
  const living = s.party.filter(b => b.hp > 0);
  const highestHp = (bs = living) => bs.reduce((a, b) => b.hp > a.hp ? b : a);
  const lowestHp = (bs = living) => bs.reduce((a, b) => b.hp < a.hp ? b : a);
  switch (d.targeting) {
    case 'all-brood': return { allBrood: true };
    case 'first-other-enemy': return { enemy: s.enemies.find(x => x.id !== e.id && alive(x))?.id ?? e.id };
    case 'lowest-hp': return { brood: lowestHp().id };
    case 'highest-revelation-untransformed': {
      const eligible = living.filter(b => !b.transformation);
      return { brood: (eligible.length ? eligible.reduce((a, b) => b.revelation > a.revelation ? b : a) : lowestHp()).id };
    }
    case 'highest-revelation-then-lowest-hp': return { brood: living.reduce((a, b) => b.revelation > a.revelation || (b.revelation === a.revelation && b.hp < a.hp) ? b : a).id };
    case 'clamped-else-highest-hp': return { brood: (living.find(b => b.statuses.clamped) ?? highestHp()).id };
    case 'ledger-then-highest-hp': {
      const previous = s.ledger.find(l => l.enemy === e.id)?.previous ?? emptyLedger();
      return { brood: living.reduce((a, b) => previous[b.id] > previous[a.id] || (previous[b.id] === previous[a.id] && b.hp > a.hp) ? b : a).id };
    }
  }
}
function declare(c: Content, s: BattleState, events: Event[]): void {
  s.intents = [];
  events.push({ kind: 'round-started', round: s.round });
  for (const e of s.enemies.filter(alive)) {
    for (const d of c.enemies.find(x => x.id === e.definitionId)!.intents) {
      const schedule = d.schedule;
      if (!partOf(e, d.sourcePart)?.pool || (schedule.kind === 'modulo' && (s.round % schedule.divisor === schedule.remainder) !== schedule.matches)) continue;
      const intent: DeclaredIntent = {
        id: `r${s.round}.${e.id}.${d.kind}`, enemy: e.id, sourcePart: d.sourcePart, kind: d.kind,
        target: chooseTarget(s, e, d), damageType: d.damageType, amount: d.amount,
        modifiers: structuredClone(d.modifiers), riders: structuredClone(d.riders), ward: d.ward,
        status: 'pending', cancellationReason: null,
      };
      s.intents.push(intent);
      events.push({ kind: 'intent-declared', intent: structuredClone(intent) });
      if (d.kind === 'inscribe' && 'enemy' in intent.target) {
        const target = s.enemies.find(x => x.id === (intent.target as { enemy: EnemyInstanceId }).enemy)!;
        target.wards.push({ sourceEnemy: e.id, sourcePart: d.sourcePart, intent: intent.id, amount: d.ward, untilRound: s.round });
        applied(events, { enemy: target.id }, 'ward', d.ward, s.round, { enemy: e.id, part: d.sourcePart });
      }
    }
  }
}
function buildFight(c: Content, run: RunDescriptor, fightIndex: number, revision: number, salveUses: number, carry: BattleState['carried'] = [], events: Event[] = []): BattleState {
  if (!run.party.length || run.party.length > roster.length || new Set(run.party).size !== run.party.length || run.party.some(id => !c.brood.some(b => b.id === id))) throw new Error('Invalid party');
  const start = c.starts.find(x => x.id === run.start);
  const encounter = c.encounters.find(x => x.id === run.encounters[fightIndex]);
  if (!start || !encounter) throw new Error('Unknown encounter or start');
  const party = roster.filter(id => run.party.includes(id)).map(id => {
    const d = c.brood.find(b => b.id === id)!;
    const carried = carry.find(b => b.id === id);
    return { id, hp: carried?.hp ?? (start.kind === 'half-hp' ? Math.ceil(d.maxHp / 2) : d.maxHp), maxHp: d.maxHp,
      revelation: carried?.revelation ?? (start.kind === 'below-cap' ? Math.max(0, d.revelationCap - start.revelationGap) : 0),
      revelationCap: d.revelationCap, acted: false, statuses: emptyStatuses(), transformation: null, pendingCrossing: null };
  });
  const enemies: EnemyState[] = encounter.enemies.map((id, i) => ({
    id: `${id}#${i + 1}`, definitionId: id,
    parts: c.enemies.find(e => e.id === id)!.parts.map(p => ({ id: p.id, kind: p.kind, pool: p.pool, maxPool: p.pool, armor: p.armor, living: p.living, shieldedBy: p.shieldedBy })),
    poison: 0, weakened: null, wards: [],
  }));
  const s: BattleState = { round: 1, phase: 'player', revision, party, enemies, intents: [], salveUses,
    ledger: enemies.filter(e => e.definitionId === 'celestial-guard').map(e => ({ enemy: e.id, current: emptyLedger(), previous: emptyLedger() })),
    run: { ...structuredClone(run), party: party.map(b => b.id) }, fightIndex, carried: structuredClone(carry) };
  declare(c, s, events);
  return s;
}
export function createFight(c: Content, options: FightOptions): BattleState {
  return buildFight(c, { kind: 'fight', ...structuredClone(options), encounters: [options.encounterId] }, 0, 0, c.fightSalveUses);
}
export function createGauntlet(c: Content, options: GauntletOptions): BattleState {
  const g = c.gauntlets.find(g => g.id === 'gauntlet-v1');
  if (!g) throw new Error('Missing gauntlet-v1');
  return buildFight(c, { kind: 'gauntlet', gauntletId: g.id, encounters: [...g.encounters], party: [...options.party], start: g.start }, 0, 0, g.salveUses);
}

/** Structural validation deliberately leaves unknown IDs and wrong target forms
 * to semantic validation (brief §2, A2-3). */
export function parseCommand(value: unknown): Command | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const v = value as Record<string, unknown>;
  if (!Number.isInteger(v.expectedRevision) || (v.expectedRevision as number) < 0 || (v.expectedRevision as number) > 2147483647) return null;
  if (v.kind === 'endPhase' || v.kind === 'continue') return Object.keys(v).length === 2 ? v as Command : null;
  if (v.kind !== 'act' || Object.keys(v).length !== 5 || typeof v.actor !== 'string' || typeof v.action !== 'string' || !Object.hasOwn(v, 'target')) return null;
  const t = v.target;
  if (t !== null) {
    if (typeof t !== 'object' || Array.isArray(t)) return null;
    const o = t as Record<string, unknown>; const keys = Object.keys(o);
    if (!(keys.length === 1 && ['enemy', 'intent', 'brood'].includes(keys[0]!) && typeof o[keys[0]!] === 'string') &&
        !(keys.length === 2 && typeof o.enemy === 'string' && typeof o.part === 'string')) return null;
  }
  return v as Command;
}
function validTarget(c: Content, s: BattleState, b: BroodState, a: ActionDefinition, t: Target): boolean {
  if (a.target === 'none') return t === null;
  if (!t) return false;
  if (a.target === 'brood') {
    if (!('brood' in t)) return false;
    const recipient = s.party.find(x => x.id === t.brood);
    if (!recipient || recipient.hp <= 0) return false;
    return a.effect.kind === 'heal' ? recipient.hp < recipient.maxHp : !recipient.statuses.pinned;
  }
  if (a.target === 'intent') {
    if (!('intent' in t)) return false;
    const i = s.intents.find(x => x.id === t.intent);
    const e = s.enemies.find(x => x.id === i?.enemy);
    return !!i && i.status === 'pending' && !!e && alive(e) && !!partOf(e, i.sourcePart)?.pool &&
      (partOf(e, i.sourcePart)!.kind === 'component' || !!modifier(c, b, 'revoke-any-source'));
  }
  if (!('enemy' in t)) return false;
  const e = s.enemies.find(x => x.id === t.enemy);
  if (!e || !alive(e)) return false;
  if (a.target === 'poisoned-enemy') return !('part' in t) && e.poison > 0;
  if (!('part' in t)) return false;
  const p = partOf(e, t.part);
  return !!p && p.pool > 0 && (!p.shieldedBy || !partOf(e, p.shieldedBy)?.pool) && (a.target !== 'component' || p.kind === 'component');
}
function rejection(c: Content, s: BattleState, cmd: Command): RejectionCode | null {
  if (cmd.expectedRevision !== s.revision) return 'stale-revision';
  if (s.phase !== (cmd.kind === 'continue' ? 'between-fights' : 'player')) return 'wrong-phase';
  if (cmd.kind !== 'act') return null;
  const b = s.party.find(b => b.id === cmd.actor);
  if (!b) return 'unknown-actor';
  if (b.hp <= 0) return 'actor-dead';
  if (b.acted) return 'already-acted';
  const a = c.actions.find(a => a.id === cmd.action);
  if (!a) return 'unknown-action';
  if (!c.brood.find(x => x.id === b.id)!.actions.includes(a.id) || modifiers(c, b).some(m => m.kind === 'block-actions' && m.actions.includes(a.id)) || (b.statuses.pinned && (a.effect.kind === 'hold' || a.effect.kind === 'guard'))) return 'action-unavailable';
  if (a.effect.kind === 'heal' && s.salveUses <= 0) return 'no-item-uses';
  if (!validTarget(c, s, b, a, cmd.target)) return 'illegal-target';
  return null;
}
function endForm(b: BroodState, reason: 'death' | 'victory' | 'expired', events: Event[]): void {
  if (!b.transformation) return;
  const form = b.transformation.id;
  b.transformation = null;
  if (reason !== 'death') b.revelation = Math.floor(b.revelationCap / 2);
  events.push({ kind: 'transformation-ended', brood: b.id, form, reason, revelation: b.revelation });
}
function broodDeath(b: BroodState, events: Event[]): void {
  events.push({ kind: 'brood-died', brood: b.id });
  for (const key of ['guard', 'hold', 'pinned', 'clamped'] as const) if (b.statuses[key]) {
    b.statuses[key] = null; removed(events, { brood: b.id }, key, 'brood-died');
  }
  b.pendingCrossing = null;
  endForm(b, 'death', events);
}
function loseHp(b: BroodState, damage: DamageBreakdown, source: DamageSource, events: Event[]): void {
  damage.applied = Math.min(b.hp, Math.max(0, damage.raw - damage.weakened + damage.rupture - damage.guard - damage.hold));
  b.hp -= damage.applied;
  events.push({ kind: 'brood-damaged', brood: b.id, source, damage, remaining: b.hp });
  if (b.hp === 0) broodDeath(b, events);
}
function gain(c: Content, b: BroodState, n: number, source: RevelationSource, events: Event[]): void {
  if (n === 0) return;
  if (b.transformation) {
    const actual = Math.min(b.hp, n); b.hp -= actual;
    events.push({ kind: 'revelation-burned', brood: b.id, amount: n, applied: actual, remainingHp: b.hp, source });
    if (b.hp === 0) broodDeath(b, events);
  } else {
    const before = b.revelation;
    b.revelation = Math.min(b.revelationCap, before + n);
    events.push({ kind: 'revelation-gained', brood: b.id, amount: b.revelation - before, revelation: b.revelation, source });
    if (before < b.revelationCap && b.revelation === b.revelationCap) b.pendingCrossing = source.kind === 'action' ? 'rapture' : 'rupture';
  }
}
function startForms(c: Content, s: BattleState, events: Event[]): void {
  for (const b of s.party) {
    if (b.pendingCrossing && b.hp > 0) {
      const f = c.forms.find(f => f.brood === b.id && f.kind === b.pendingCrossing)!;
      b.transformation = { id: f.id, kind: f.kind, untilRound: s.round + f.durationRounds - 1 };
      events.push({ kind: 'transformation-started', brood: b.id, transformation: { ...b.transformation } });
    }
    b.pendingCrossing = null;
  }
}
function outcome(s: BattleState, events: Event[]): boolean {
  const result = s.party.every(b => b.hp === 0) ? 'defeat' : s.enemies.every(e => !alive(e)) ? 'victory' : null;
  if (!result) return false;
  if (result === 'victory') {
    for (const b of s.party) endForm(b, 'victory', events);
    s.carried = s.party.map(({ id, hp, revelation }) => ({ id, hp, revelation }));
  }
  s.phase = result === 'victory' && s.run.kind === 'gauntlet' && s.fightIndex + 1 < s.run.encounters.length ? 'between-fights' : result;
  events.push({ kind: 'combat-ended', outcome: result, fightIndex: s.fightIndex });
  return true;
}
function cancel(i: DeclaredIntent, reason: CancellationReason, events: Event[]): void {
  if (i.status !== 'pending') return;
  i.status = reason === 'revoked' ? 'revoked' : 'cancelled'; i.cancellationReason = reason;
  events.push({ kind: 'intent-cancelled', intent: i.id, reason });
}
function removeWards(s: BattleState, predicate: (w: EnemyState['wards'][number], e: EnemyState) => boolean, reason: StatusRemovalReason, events: Event[]): void {
  for (const e of s.enemies) {
    const before = e.wards.length; e.wards = e.wards.filter(w => !predicate(w, e));
    if (before && !e.wards.length) removed(events, { enemy: e.id }, 'ward', reason);
  }
}
function destroy(s: BattleState, e: EnemyState, p: PartState, events: Event[]): void {
  events.push({ kind: 'part-destroyed', target: { enemy: e.id, part: p.id } });
  const died = p.kind === 'body';
  if (died) events.push({ kind: 'enemy-died', enemy: e.id });
  for (const i of s.intents) if (i.enemy === e.id && (died || i.sourcePart === p.id)) cancel(i, died ? 'enemy-died' : 'source-destroyed', events);
  const reason = died ? 'enemy-died' : 'source-destroyed';
  removeWards(s, (w, recipient) => (w.sourceEnemy === e.id && (died || w.sourcePart === p.id)) || (died && recipient.id === e.id), reason, events);
  for (const b of s.party) for (const key of ['pinned', 'clamped'] as const) {
    const restraint = b.statuses[key];
    if (restraint?.enemy === e.id && (died || restraint.part === p.id)) { b.statuses[key] = null; removed(events, { brood: b.id }, key, reason); }
  }
  if (died) {
    if (e.poison) { e.poison = 0; removed(events, { enemy: e.id }, 'poison', 'enemy-died'); }
    if (e.weakened) { e.weakened = null; removed(events, { enemy: e.id }, 'weakened', 'enemy-died'); }
  }
}
function hitPart(s: BattleState, e: EnemyState, p: PartState, raw: number, type: DamageType, ignoreArmor: boolean, source: DamageSource, events: Event[]): DamageBreakdown {
  const d = blankDamage(raw, type);
  d.armor = type === 'physical' && !ignoreArmor ? p.armor : 0;
  d.ward = type === 'poison' ? 0 : Math.max(0, ...e.wards.map(w => w.amount));
  d.applied = Math.min(p.pool, Math.max(0, raw - d.armor - d.ward));
  p.pool -= d.applied;
  events.push({ kind: 'part-damaged', target: { enemy: e.id, part: p.id }, source, damage: d, remaining: p.pool });
  if (source.kind === 'action' || source.kind === 'retaliation') {
    const l = s.ledger.find(l => l.enemy === e.id); if (l) l.current[source.actor] += d.applied;
  }
  if (p.pool === 0) destroy(s, e, p, events);
  return d;
}
function action(c: Content, s: BattleState, cmd: Extract<Command, { kind: 'act' }>, events: Event[]): void {
  const b = s.party.find(b => b.id === cmd.actor)!;
  const a = c.actions.find(a => a.id === cmd.action)!; const effect = a.effect;
  b.acted = true;
  events.push({ kind: 'action-used', actor: b.id, action: a.id, target: structuredClone(cmd.target) });
  const source: DamageSource = { kind: 'action', actor: b.id, action: a.id };
  switch (effect.kind) {
    case 'damage': case 'envenom': {
      const t = cmd.target as { enemy: EnemyInstanceId; part: PartState['id'] };
      const e = s.enemies.find(e => e.id === t.enemy)!; const p = partOf(e, t.part)!;
      let raw = effect.kind === 'damage' && p.kind === 'component' ? effect.componentAmount : effect.amount;
      let ignore = effect.kind === 'damage' && p.kind === 'component' && effect.ignoreComponentArmor;
      for (const m of modifiers(c, b)) {
        if (m.kind === 'attack-bonus' && m.actions.includes(a.id)) { raw += m.amount; ignore ||= m.ignoreArmor; }
        if (m.kind === 'bolt-amount' && a.id === 'stolen-bolt') raw = m.amount;
      }
      hitPart(s, e, p, raw, effect.kind === 'damage' ? effect.damageType : 'physical', ignore, source, events);
      if (effect.kind === 'envenom' && p.living && alive(e)) {
        e.poison = modifier(c, b, 'poison-set')?.amount ?? Math.min(effect.poisonCap, e.poison + effect.poisonGain);
        applied(events, { enemy: e.id }, 'poison', e.poison, null);
        e.weakened = { amount: effect.weakenedReduction, untilRound: s.round };
        applied(events, { enemy: e.id }, 'weakened', effect.weakenedReduction, s.round);
      }
      break;
    }
    case 'rupture-venom': {
      const t = cmd.target as { enemy: EnemyInstanceId }; const e = s.enemies.find(e => e.id === t.enemy)!;
      const raw = e.poison * (modifier(c, b, 'venom-multiplier')?.amount ?? effect.multiplier);
      hitPart(s, e, body(e), raw, 'poison', true, source, events);
      if (e.poison) { e.poison = 0; removed(events, { enemy: e.id }, 'poison', 'consumed'); }
      break;
    }
    case 'revoke': {
      const i = s.intents.find(i => i.id === (cmd.target as { intent: string }).intent)!;
      cancel(i, 'revoked', events);
      removeWards(s, w => w.intent === i.id, 'revoked', events);
      break;
    }
    case 'guard': b.statuses.guard = { untilRound: s.round }; applied(events, { brood: b.id }, 'guard', 0, s.round); break;
    case 'hold': b.statuses.hold = { target: (cmd.target as { brood: BroodId }).brood, untilRound: s.round }; applied(events, { brood: b.id }, 'hold', effect.physicalReduction, s.round); break;
    case 'heal': {
      const t = s.party.find(x => x.id === (cmd.target as { brood: BroodId }).brood)!;
      const amount = Math.min(effect.amount, t.maxHp - t.hp); t.hp += amount; s.salveUses--;
      events.push({ kind: 'brood-healed', brood: t.id, actor: b.id, amount, remaining: t.hp });
      events.push({ kind: 'item-used', actor: b.id, item: 'salve', target: t.id, usesRemaining: s.salveUses });
      break;
    }
  }
  gain(c, b, a.revelationCost, { kind: 'action', action: a.id }, events);
  startForms(c, s, events);
  outcome(s, events);
}
function resolveIntent(c: Content, s: BattleState, i: DeclaredIntent, events: Event[]): void {
  const e = s.enemies.find(e => e.id === i.enemy)!;
  const p = partOf(e, i.sourcePart)!;
  let reason: Extract<Event, { kind: 'intent-skipped' }>['reason'] | null = null;
  if (i.status !== 'pending') reason = i.status === 'revoked' ? 'revoked' : 'cancelled';
  else if (!alive(e)) reason = 'enemy-died';
  else if (p.pool === 0) reason = 'source-destroyed';
  else if ('brood' in i.target && !s.party.some(b => b.id === (i.target as { brood: BroodId }).brood && b.hp > 0)) reason = 'target-dead';
  else if ('enemy' in i.target && !s.enemies.some(e => e.id === (i.target as { enemy: EnemyInstanceId }).enemy && alive(e))) reason = 'target-dead';
  if (reason) { if (i.status === 'pending') i.status = 'skipped'; events.push({ kind: 'intent-skipped', intent: i.id, reason }); return; }
  // Inscribe is effective at declaration; resolution has no effect (§8.2).
  if ('enemy' in i.target) { i.status = 'resolved'; events.push({ kind: 'intent-resolved', intent: i.id }); return; }
  const holder = s.party.find(b => b.id === 'ugallu' && b.hp > 0 && b.statuses.hold);
  let recipients: BroodState[];
  if ('allBrood' in i.target) recipients = s.party.filter(b => b.hp > 0);
  else {
    const declared = s.party.find(b => b.id === (i.target as { brood: BroodId }).brood)!;
    const redirected = holder && holder !== declared && holder.statuses.hold?.target === declared.id;
    if (redirected) events.push({ kind: 'intent-redirected', intent: i.id, from: declared.id, to: holder.id });
    recipients = [redirected ? holder : declared];
  }
  let retaliate = false;
  for (const b of recipients) {
    const d = blankDamage(i.amount, i.damageType);
    for (const m of i.modifiers) if (m.kind === 'part-intact-bonus' ? !!partOf(e, m.part)?.pool : !!b.statuses.clamped) d.raw += m.amount;
    d.weakened = i.damageType === 'physical' ? e.weakened?.amount ?? 0 : 0;
    d.rupture = modifier(c, b, 'incoming-bonus')?.amount ?? 0;
    const before = Math.max(0, d.raw - d.weakened + d.rupture);
    const hold = holdEffect(c);
    if (b.statuses.guard) d.guard = Math.floor(before / 2);
    else if (b.statuses.hold && i.damageType === 'physical' && hold?.kind === 'hold') d.hold = Math.min(before, hold.physicalReduction);
    loseHp(b, d, { kind: 'intent', intent: i.id }, events);
    if (b === holder && b.hp > 0 && d.applied > 0) retaliate = true;
    if (i.kind === 'saw' && b.statuses.clamped) { b.statuses.clamped = null; removed(events, { brood: b.id }, 'clamped', 'consumed'); }
  }
  // Damage for all recipients precedes all riders. Status riders precede gains.
  for (const b of recipients.filter(b => b.hp > 0)) {
    for (const r of i.riders) if (r.kind !== 'revelation') {
      b.statuses[r.kind] = { enemy: e.id, part: p.id, untilRound: s.round + r.durationRounds - 1 };
      applied(events, { brood: b.id }, r.kind, 0, b.statuses[r.kind]!.untilRound, { enemy: e.id, part: p.id });
    }
    for (const r of i.riders) if (r.kind === 'revelation') gain(c, b, r.amount, { kind: 'intent', intent: i.id }, events);
  }
  i.status = 'resolved'; events.push({ kind: 'intent-resolved', intent: i.id });
  const hold = holdEffect(c);
  if (retaliate && holder && holder.hp > 0 && holder.statuses.hold && alive(e) && p.pool > 0 && hold?.kind === 'hold') {
    const damage = hitPart(s, e, p, hold.retaliation, 'physical', false, { kind: 'retaliation', actor: holder.id, intent: i.id }, events);
    events.push({ kind: 'retaliated', actor: holder.id, intent: i.id, target: { enemy: e.id, part: p.id }, damage });
  }
  startForms(c, s, events);
  outcome(s, events);
}
function endRound(c: Content, s: BattleState, events: Event[]): void {
  // A2-1: E1 and E2 are one unit. No outcome check between them.
  for (const e of s.enemies.filter(alive)) if (e.poison > 0) {
    const amount = e.poison; const remainingPoison = Math.max(0, amount - 1);
    e.poison = remainingPoison;
    events.push({ kind: 'poison-ticked', enemy: e.id, amount, remainingPoison });
    hitPart(s, e, body(e), amount, 'poison', true, { kind: 'poison', enemy: e.id }, events);
    if (!remainingPoison && alive(e)) removed(events, { enemy: e.id }, 'poison', 'expired');
  }
  for (const b of s.party.filter(b => b.hp > 0)) {
    const loss = modifier(c, b, 'round-hp-loss');
    if (loss && b.transformation) loseHp(b, blankDamage(loss.amount, 'magical'), { kind: 'form', brood: b.id, form: b.transformation.id }, events);
  }
  if (outcome(s, events)) return;
  for (const b of s.party) for (const key of ['guard', 'hold', 'pinned', 'clamped'] as const) if (b.statuses[key] && b.statuses[key]!.untilRound <= s.round) {
    b.statuses[key] = null; removed(events, { brood: b.id }, key, 'expired');
  }
  for (const e of s.enemies) if (e.weakened && e.weakened.untilRound <= s.round) { e.weakened = null; removed(events, { enemy: e.id }, 'weakened', 'expired'); }
  removeWards(s, w => w.untilRound <= s.round, 'expired', events);
  for (const b of s.party) if (b.transformation && b.transformation.untilRound <= s.round) endForm(b, 'expired', events);
  for (const l of s.ledger) { l.previous = { ...l.current }; l.current = emptyLedger(); }
  s.round++; for (const b of s.party) b.acted = false;
  declare(c, s, events);
}
/** Pure, atomic command seam. Envelope pattern copied from POC 001
 * src/core/commands.ts at c82ec3c; combat rules are independent (§§1–13). */
export function applyCommand(c: Content, state: BattleState, value: unknown): CommandResult {
  const cmd = parseCommand(value);
  const code = cmd ? rejection(c, state, cmd) : 'invalid-command';
  if (code) return { ok: false, state, events: [], error: { code } };
  const s = structuredClone(state); const events: Event[] = [];
  s.revision++;
  if (cmd!.kind === 'act') action(c, s, cmd as Extract<Command, { kind: 'act' }>, events);
  else if (cmd!.kind === 'continue') {
    events.push({ kind: 'fight-continued', encounterId: s.run.encounters[s.fightIndex + 1]!, fightIndex: s.fightIndex + 1 });
    const next = buildFight(c, s.run, s.fightIndex + 1, s.revision, s.salveUses, s.carried, events);
    return { ok: true, state: next, events };
  } else {
    for (const b of s.party) if (b.hp > 0) b.acted = true;
    for (const i of s.intents) { resolveIntent(c, s, i, events); if (s.phase !== 'player') break; }
    if (s.phase === 'player') endRound(c, s, events);
  }
  return { ok: true, state: s, events };
}
export function legalActions(c: Content, s: BattleState): LegalAction[] {
  const candidates: Command[] = [{ kind: 'endPhase', expectedRevision: s.revision }, { kind: 'continue', expectedRevision: s.revision }];
  const targets: Target[] = [null, ...s.party.map(b => ({ brood: b.id })), ...s.intents.map(i => ({ intent: i.id })), ...s.enemies.flatMap(e => [{ enemy: e.id }, ...e.parts.map(p => ({ enemy: e.id, part: p.id }))])];
  for (const b of s.party) for (const a of c.actions) for (const target of targets) candidates.push({ kind: 'act', expectedRevision: s.revision, actor: b.id, action: a.id, target });
  return candidates.filter(cmd => !rejection(c, s, cmd)).map(command => ({ command, label: command.kind === 'act' ? c.actions.find(a => a.id === command.action)!.name : command.kind }));
}
