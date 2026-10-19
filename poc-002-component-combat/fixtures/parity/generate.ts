/** Intentional parity-authoring tool. Every state/event is produced by the public
 * API with embedded versioned content; never patch expected output by hand.
 * Run with Bun from any directory. Existing Q02-owned seed files are read only. */
import { readFileSync, writeFileSync } from 'node:fs';
import { applyCommand, createFight, createGauntlet, loadContent, parseRecord, recordOf, replayRecord } from '../../src/core';
import type { ActionId, BattleState, BroodId, Command, EncounterId, PartId, RecordedCommand, StartPreset, Target } from '../../src/core';

const content = loadContent(JSON.parse(readFileSync(new URL('../../content/combat-content.v1.json', import.meta.url), 'utf8')));
const trio: BroodId[] = ['ugallu', 'girtablilu', 'anzu'];
class Line {
  initial: BattleState;
  state: BattleState;
  commands: RecordedCommand[] = [];
  constructor(initial: BattleState) { this.initial = initial; this.state = initial; }
  command(command: Command) {
    const result = applyCommand(content, this.state, command);
    if (!result.ok) throw new Error(`${JSON.stringify(command)}: ${result.error.code} at round ${this.state.round}`);
    this.commands.push({ command, revision: result.state.revision, events: result.events });
    this.state = result.state;
    return this;
  }
  act(actor: BroodId, action: ActionId, target: Target = null) { return this.command({ kind: 'act', expectedRevision: this.state.revision, actor, action, target }); }
  hit(actor: BroodId, action: ActionId, enemy: number, part: PartId) {
    return this.act(actor, action, { enemy: this.state.enemies[enemy]!.id, part });
  }
  revoke(kind: string) { return this.act('anzu', 'revoke', { intent: this.state.intents.find(i => i.kind === kind && i.status === 'pending')!.id }); }
  end() { return this.command({ kind: 'endPhase', expectedRevision: this.state.revision }); }
  next() { return this.command({ kind: 'continue', expectedRevision: this.state.revision }); }
  save(name: string) {
    const record = recordOf({ content, initialState: this.initial, commands: this.commands, finalState: this.state, buildRevision: 'unknown' });
    const result = replayRecord(record);
    if (!result.ok) throw new Error(`${name}: ${JSON.stringify(result)}`);
    writeFileSync(new URL(`${name}.json`, import.meta.url), `${JSON.stringify(record, null, 2)}\n`);
    console.log(`${name}: commands=${result.commands} events=${result.events} outcome=${result.outcome}`);
    return this;
  }
}
const fight = (encounterId: EncounterId, party = trio, start: StartPreset = 'fresh') => new Line(createFight(content, { encounterId, party, start }));

// §8.1 ledger, selective disarm, Pin and poison.
const guard = fight('guard', ['ugallu', 'girtablilu']);
guard.hit('ugallu', 'rend', 0, 'weapon-arm').hit('girtablilu', 'envenom', 0, 'restraining-limb').end();
guard.hit('ugallu', 'claw', 0, 'weapon-arm').hit('girtablilu', 'envenom', 0, 'body').end();
while (guard.state.phase === 'player') {
  guard.hit('ugallu', 'claw', 0, 'body');
  if (guard.state.phase === 'player') guard.hit('girtablilu', 'envenom', 0, 'body').end();
}
guard.save('fight-guard-v1');

// §8.2/E19 immediate Ward removal, then victory during Anzû's Rapture (§7).
const scribe = fight('scribe', trio, 'primed');
scribe.revoke('inscribe').hit('ugallu', 'claw', 0, 'body').hit('girtablilu', 'envenom', 0, 'body').end();
scribe.hit('anzu', 'stolen-bolt', 0, 'body').save('fight-scribe-v1').save('edge-revoke-inscribe-v1').save('edge-victory-transformed-v1');

// §8.3 shell opening and poison/venom bypass of the shield.
const beast = fight('beast');
beast.hit('ugallu', 'rend', 0, 'shell').hit('girtablilu', 'envenom', 0, 'locomotion-organ').hit('anzu', 'stolen-bolt', 0, 'shell').end();
beast.hit('ugallu', 'claw', 0, 'core').act('girtablilu', 'rupture-venom', { enemy: beast.state.enemies[0]!.id }).hit('anzu', 'stolen-bolt', 0, 'core').save('fight-beast-v1');

// §10 first gauntlet fight: remove the Ward source before disarming the Guard.
function first(line: Line) {
  line.hit('ugallu', 'rend', 1, 'inscription-hand').hit('anzu', 'stolen-bolt', 0, 'weapon-arm').hit('girtablilu', 'envenom', 0, 'weapon-arm').end();
  line.hit('ugallu', 'rend', 0, 'weapon-arm').hit('girtablilu', 'envenom', 0, 'body').hit('anzu', 'stolen-bolt', 1, 'tongue').end();
  line.hit('ugallu', 'claw', 0, 'restraining-limb').hit('girtablilu', 'pincer', 0, 'restraining-limb').hit('anzu', 'stolen-bolt', 1, 'body').end();
  line.hit('ugallu', 'claw', 1, 'body').hit('girtablilu', 'envenom', 1, 'body').hit('anzu', 'stolen-bolt', 0, 'body').end();
  if (line.state.phase === 'player') line.hit('ugallu', 'claw', 0, 'body');
  return line;
}
first(fight('guard-scribe')).save('fight-guard-scribe-v1');

// §8.2–8.3 combined shielding, Ward, Revoke and poison.
const bs = fight('beast-scribe');
bs.hit('ugallu', 'rend', 1, 'inscription-hand').hit('girtablilu', 'envenom', 0, 'locomotion-organ').hit('anzu', 'stolen-bolt', 1, 'tongue').end();
bs.hit('ugallu', 'rend', 0, 'shell').hit('girtablilu', 'envenom', 0, 'locomotion-organ').hit('anzu', 'stolen-bolt', 0, 'shell').end();
bs.hit('ugallu', 'claw', 0, 'core');
if (bs.state.enemies[0]!.parts[0]!.pool) bs.act('girtablilu', 'rupture-venom', { enemy: bs.state.enemies[0]!.id });
bs.hit('anzu', 'stolen-bolt', 1, 'body').end();
bs.hit('ugallu', 'claw', 1, 'body').hit('girtablilu', 'pincer', 1, 'body').save('fight-beast-scribe-v1');

function second(line: Line) {
  line.hit('ugallu', 'rend', 0, 'weapon-arm').hit('anzu', 'stolen-bolt', 0, 'weapon-arm').hit('girtablilu', 'envenom', 1, 'locomotion-organ').end();
  line.hit('ugallu', 'rend', 1, 'shell');
  line.hit('anzu', 'stolen-bolt', 1, line.state.enemies[1]!.parts.find(p => p.id === 'shell')!.pool ? 'shell' : 'core').hit('girtablilu', 'envenom', 1, 'locomotion-organ').end();
  if (line.state.enemies[1]!.parts[0]!.pool) line.hit('ugallu', 'claw', 1, 'core');
  else line.hit('ugallu', 'claw', 0, 'body');
  if (line.state.enemies[1]!.parts[0]!.pool) line.act('girtablilu', 'rupture-venom', { enemy: line.state.enemies[1]!.id });
  line.hit('anzu', 'stolen-bolt', 0, 'restraining-limb').end();
  while (line.state.phase === 'player') {
    for (const [actor, action] of [['ugallu', 'claw'], ['girtablilu', 'envenom'], ['anzu', 'stolen-bolt']] as const) {
      if (line.state.phase !== 'player') break;
      line.hit(actor, action, 0, 'body');
    }
    if (line.state.phase === 'player') line.end();
  }
  return line;
}
second(fight('guard-beast')).save('fight-guard-beast-v1');

// §8.4 full cycle: allow Clamp/Saw/Hymn before killing the core.
function warden(line: Line) {
  while (line.state.phase === 'player') {
    const enemy = line.state.enemies[0]!;
    const poison = enemy.poison;
    const g = line.state.party.find(b => b.id === 'girtablilu')!;
    const a = line.state.party.find(b => b.id === 'anzu')!;
    if (a.hp > 0 && line.state.intents.some(i => i.kind === 'saw') && !a.transformation) line.revoke('saw');
    line.hit('ugallu', 'claw', 0, 'core');
    if (line.state.phase !== 'player') break;
    if (g.hp > 0) {
      if (g.transformation?.kind === 'rupture') line.hit('girtablilu', 'pincer', 0, 'core');
      else if (poison >= 3) line.act('girtablilu', 'rupture-venom', { enemy: enemy.id });
      else line.hit('girtablilu', 'envenom', 0, 'core');
    }
    if (line.state.phase !== 'player') break;
    if (a.hp > 0 && !line.state.party.find(b => b.id === 'anzu')!.acted) line.hit('anzu', a.transformation?.kind === 'rupture' ? 'talon' : 'stolen-bolt', 0, 'core');
    if (line.state.phase === 'player') line.end();
  }
  return line;
}
warden(fight('warden')).save('fight-warden-v1');
const run = first(new Line(createGauntlet(content, { party: trio })));
run.save('unfinished-between-fights-v1').next();
second(run).next();
warden(run).save('gauntlet-win-trio-v1');
if (run.state.phase !== 'victory') throw new Error('gauntlet win must reach victory');
const defeat = new Line(createGauntlet(content, { party: ['anzu'] }));
while (defeat.state.phase === 'player') defeat.end();
defeat.save('gauntlet-defeat-v1');

// §7 own crossings, and the modifiers on subsequent actions.
const ur = fight('guard', ['ugallu'], 'primed');
ur.hit('ugallu', 'rend', 0, 'weapon-arm').end().hit('ugallu', 'claw', 0, 'body').save('form-ugallu-rapture-v1');
const gr = fight('beast', ['girtablilu'], 'primed');
gr.hit('girtablilu', 'envenom', 0, 'locomotion-organ').end().act('girtablilu', 'rupture-venom', { enemy: gr.state.enemies[0]!.id }).end();
gr.hit('girtablilu', 'envenom', 0, 'locomotion-organ').save('form-girtablilu-rapture-v1');
const ar = fight('warden', ['anzu'], 'primed');
ar.revoke('clamp').end().revoke('pulse').save('form-anzu-rapture-v1');
for (const id of trio) {
  const line = fight('scribe', [id], 'primed');
  line.end().hit(id, id === 'ugallu' ? 'claw' : id === 'girtablilu' ? 'pincer' : 'talon', 0, 'tongue').end().save(`form-${id}-rupture-v1`);
}
const hold = fight('warden', ['ugallu', 'anzu']);
hold.act('ugallu', 'hold-the-threshold', { brood: 'anzu' }).end().save('edge-hold-clamp-v1');

// Retain the seed's genuine play prefix, then finish with pulse retaliation.
const seed = parseRecord(readFileSync(new URL('seed-ugallu-warden.json', import.meta.url), 'utf8'));
const retaliation = new Line(seed.initialState);
for (const step of seed.commands.slice(0, -1)) retaliation.command(step.command);
retaliation.act('ugallu', 'hold-the-threshold', { brood: 'ugallu' }).end().save('edge-retaliation-kill-v1');
const poison = fight('scribe', ['girtablilu']);
for (let round = 0; round < 3; round++) poison.hit('girtablilu', 'envenom', 0, 'body').end();
poison.act('girtablilu', 'guard').end().save('edge-poison-victory-v1');
fight('guard').save('unfinished-player-v1');
