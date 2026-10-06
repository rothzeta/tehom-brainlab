import { COLLECTOR_VERSION, validCollectorRules } from '../content/collector';
import type { CollectorRules, CollectorState } from '../content/collector';
import { CRUCIBLE_VERSION, validCrucibleRules } from '../content/crucible';
import type { CrucibleRules } from '../content/crucible';
import { ENCOUNTERS, encounterFor } from './encounters';
import type { EncounterState, EncounterPreset } from './encounters';
import { BROOD_RULES_VERSION, isAbilityId } from '../content/brood';
import { PATROL_VERSION } from '../content/patrol';
import type { PatrolState } from '../content/patrol';
import { applyAbility } from './abilities';
import type { AbilityRules } from './abilities';
import type { Command, CommandResult, GameplayEvent } from './commands';
import { ROSTER, validateFormation } from './formation';
import { ENEMY_CELLS, validateHex } from './hex';
import type { Hex } from './hex';
import { applyCommand, commandAbilityRules } from './transition';

export const RECORD_VERSION = 1;
// Bump for any semantic change to geometry, legality, resolution or event ordering.
export const RUN_RULES_VERSION = `poc-001-rules-v3/${PATROL_VERSION}/${BROOD_RULES_VERSION}`;
export const CRUCIBLE_RUN_RULES_VERSION = `poc-001-rules-v3/${CRUCIBLE_VERSION}/${BROOD_RULES_VERSION}`;
export const COLLECTOR_RUN_RULES_VERSION = `poc-001-rules-v3/${COLLECTOR_VERSION}/${BROOD_RULES_VERSION}`;
export const PROTOTYPE_ID = 'poc-001-linked-formation';
export type RecordedCommand = Exclude<Command, { kind: 'attack' }>;
export interface RunRecord<State extends EncounterState = PatrolState> {
  readonly recordVersion: typeof RECORD_VERSION;
  readonly prototypeId: typeof PROTOTYPE_ID;
  readonly buildRevision: string; // exact commit or the explicit literal 'unknown'
  readonly rulesVersion: typeof RUN_RULES_VERSION | typeof CRUCIBLE_RUN_RULES_VERSION | typeof COLLECTOR_RUN_RULES_VERSION;
  readonly fixtureId: EncounterPreset;
  readonly configuration: (State extends PatrolState ? { readonly patrolRules: PatrolState['patrolRules'] } : State extends CollectorState ? { readonly collectorRules: CollectorRules } : { readonly crucibleRules: CrucibleRules }) & { readonly abilityRules: AbilityRules };
  readonly initialState: State;
  readonly acceptedCommands: readonly { readonly command: RecordedCommand; readonly revision: number;
    readonly events: readonly GameplayEvent[] }[];
  readonly finalState: State;
  readonly events: readonly GameplayEvent[];
}
const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
function fail(reason: string): never { throw new Error(`Run record: ${reason}`); }
function requireValue(condition: unknown, path: string): asserts condition {
  if (!condition) fail(`malformed ${path}`);
}
const object = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const versionLabel = (value: unknown): string | undefined => typeof value === 'string' ? value : JSON.stringify(value);
const id = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
const integer = (value: unknown): value is number => Number.isSafeInteger(value) && (value as number) >= 0;
function fields(value: unknown, names: readonly string[], path: string): asserts value is Record<string, unknown> {
  requireValue(object(value) && Object.keys(value).length === names.length
    && names.every(name => Object.hasOwn(value, name)), path);
}
function numbers(value: unknown, names: readonly string[], path: string): void {
  fields(value, names, path);
  for (const name of names) requireValue(integer(value[name]), `${path}.${name}`);
}
function damageRules(value: unknown, path: string): void {
  numbers(value, ['directionalReduction', 'shelterReduction', 'closeThreshold'], path);
}
function patrolRules(value: unknown, path: string): void {
  fields(value, ['warderDamage', 'censerDamage', 'harrierDamage', 'isolatedHarrierDamage',
    'splashRadius', 'closeThreshold', 'damageRules'], path);
  for (const [key, amount] of Object.entries(value)) if (key !== 'damageRules') requireValue(integer(amount), `${path}.${key}`);
  damageRules(value.damageRules, `${path}.damageRules`);
}
function crucibleRules(value: unknown, path: string): void {
  fields(value, ['bossHp', 'phaseTwoAt', 'splashRadius', 'closeThreshold', 'damageRules', 'patterns'], path);
  damageRules(value.damageRules, `${path}.damageRules`);
  fields(value.patterns, ['1', '2'], `${path}.patterns`);
  for (const phase of ['1', '2']) {
    const beats = value.patterns[phase];
    fields(beats, ['A', 'B'], `${path}.patterns.${phase}`);
    for (const beat of ['A', 'B']) fields(beats[beat], ['area', 'primaryDamage', 'secondaryKind', 'secondaryDamage'], `${path}.pattern`);
  }
  requireValue(validCrucibleRules(value as unknown as CrucibleRules), path);
}
function collectorRules(value: unknown, path: string): void {
  fields(value, ['bossHp', 'warderHp', 'censerHp', 'wardRange', 'warderDamage', 'censerDamage',
    'sweepDamage', 'splashRadius', 'closeThreshold', 'damageRules'], path);
  damageRules(value.damageRules, `${path}.damageRules`);
  requireValue(validCollectorRules(value as unknown as CollectorRules), path);
}
function codec(version: string) {
  return Object.values(ENCOUNTERS).find(encounter => version === `poc-001-rules-v3/${encounter.codec.version}/${BROOD_RULES_VERSION}`);
}
function abilityRules(value: unknown, path: string): void {
  fields(value, ['clawDamage', 'stingDamage', 'impaleDamage', 'galeDamage', 'damageRules'], path);
  for (const [key, amount] of Object.entries(value)) if (key !== 'damageRules') requireValue(integer(amount), `${path}.${key}`);
  damageRules(value.damageRules, `${path}.damageRules`);
}
function strings(value: unknown, path: string): asserts value is string[] {
  requireValue(Array.isArray(value) && value.every(id) && new Set(value).size === value.length, path);
}
function state(value: unknown, path: string, rulesVersion = RUN_RULES_VERSION): asserts value is EncounterState {
  const boss = rulesVersion === CRUCIBLE_RUN_RULES_VERSION;
  const collector = rulesVersion === COLLECTOR_RUN_RULES_VERSION;
  fields(value, ['revision', 'round', 'phase', 'formation', 'brood', 'actedIds', 'rotationUsed', 'shapeChangeUsed', 'intentions',
    ...(boss ? ['crucibleVersion', 'crucibleRules', 'bossPhase', 'beat'] : collector ? ['collectorVersion', 'collectorRules'] : ['patrolVersion', 'patrolRules']), 'enemies', 'protections', 'shelters', 'resolvedAttackIds', 'declaredIntentions'], path);
  requireValue(integer(value.revision) && integer(value.round) && value.round > 0, `${path}.revision/round`);
  requireValue(['player', 'enemy', 'victory', 'defeat'].includes(value.phase as string), `${path}.phase`);
  fields(value.formation, ['shape', 'orientation'], `${path}.formation`);
  try { validateFormation(value.formation); } catch { fail(`malformed ${path}.formation`); }
  requireValue(typeof value.rotationUsed === 'boolean', `${path}.rotationUsed`);
  requireValue(typeof value.shapeChangeUsed === 'boolean', `${path}.shapeChangeUsed`);
  if (boss) {
    requireValue(value.crucibleVersion === CRUCIBLE_VERSION, `${path}.crucibleVersion`);
    requireValue([1, 2].includes(value.bossPhase as number) && ['A', 'B'].includes(value.beat as string), `${path}.bossPhase/beat`);
    crucibleRules(value.crucibleRules, `${path}.crucibleRules`);
  } else if (collector) {
    requireValue(value.collectorVersion === COLLECTOR_VERSION, `${path}.collectorVersion`);
    collectorRules(value.collectorRules, `${path}.collectorRules`);
  } else {
    requireValue(value.patrolVersion === PATROL_VERSION, `${path}.patrolVersion`);
    patrolRules(value.patrolRules, `${path}.patrolRules`);
  }
  for (const name of ['brood', 'enemies', 'protections', 'shelters', 'declaredIntentions']) requireValue(Array.isArray(value[name]), `${path}.${name}`);
  const brood = value.brood as Record<string, unknown>[];
  requireValue(brood.length === ROSTER.length, `${path}.brood`);
  for (const entity of brood) {
    fields(entity, ['id', 'brood', 'owner', 'hp', 'maxHp', 'statuses'], `${path}.brood entity`);
    requireValue(id(entity.id) && ROSTER.includes(entity.brood as typeof ROSTER[number]) && entity.owner === 'player', `${path}.brood identity`);
    strings(entity.statuses, `${path}.brood.statuses`);
  }
  requireValue(new Set(brood.map(b => b.brood)).size === ROSTER.length, `${path}.brood labels`);
  const enemies = value.enemies as Record<string, unknown>[];
  for (const entity of enemies) {
    requireValue(object(entity), `${path}.enemy`);
    const keys = ['id', 'hp', 'maxHp', 'cell', 'facing',
      ...['rotatable', 'mobile', ...(collector ? ['objective'] : [])].filter(key => Object.hasOwn(entity, key))];
    fields(entity, keys, `${path}.enemy`);
    fields(entity.cell, ['q', 'r'], `${path}.enemy cell`);
    const enemyCell = entity.cell;
    try { validateHex(enemyCell); } catch { fail(`malformed ${path}.enemy cell`); }
    requireValue(ENEMY_CELLS.some(cell => cell.q === enemyCell.q && cell.r === enemyCell.r), `${path}.enemy cell placement`);
    requireValue(id(entity.id) && integer(entity.facing) && entity.facing <= 5
      && ['rotatable', 'mobile', ...(collector ? ['objective'] : [])].every(key => !Object.hasOwn(entity, key) || typeof entity[key] === 'boolean'), `${path}.enemy identity/facing`);
  }
  if (boss) requireValue(enemies.length === 1 && enemies[0]!.id === 'crucible'
    && (enemies[0]!.cell as Hex).q === 0 && (enemies[0]!.cell as Hex).r === 0, `${path}.anchored boss`);
  const enemyCells = enemies.filter(entity => (entity.hp as number) > 0).map(entity => entity.cell as Hex);
  requireValue(new Set(enemyCells.map(cell => `${cell.q},${cell.r}`)).size === enemyCells.length,
    `${path}.enemy cells distinct`);
  const entities = [...brood, ...enemies];
  for (const entity of entities) requireValue(integer(entity.hp) && integer(entity.maxHp)
    && entity.maxHp > 0 && entity.hp <= entity.maxHp, `${path}.entity HP`);
  const ids = entities.map(e => e.id);
  requireValue(new Set(ids).size === ids.length, `${path}.entity IDs`);
  for (const key of ['actedIds', 'intentions', 'resolvedAttackIds']) strings(value[key], `${path}.${key}`);
  requireValue((value.actedIds as string[]).every(actor => brood.some(b => b.id === actor)), `${path}.actedIds`);
  for (const key of ['protections', 'shelters']) {
    const entries = value[key] as Record<string, unknown>[];
    for (const entry of entries) {
      requireValue(object(entry), `${path}.${key} entry`);
      fields(entry, key === 'shelters' ? ['id', 'sourceId', 'targetId'] : ['sourceId', 'targetId', ...(collector && Object.hasOwn(entry, 'range') ? ['range'] : [])], `${path}.${key} entry`);
      if (key === 'protections' && Object.hasOwn(entry, 'range')) requireValue(integer(entry.range), `${path}.protections range`);
      requireValue(ids.includes(entry.sourceId) && ids.includes(entry.targetId)
        && (key !== 'shelters' || id(entry.id)), `${path}.${key} references`);
    }
    if (key === 'shelters') requireValue(new Set(entries.map(e => e.id)).size === entries.length, `${path}.shelter IDs`);
  }
  const intentions = value.declaredIntentions as Record<string, unknown>[];
  for (const entry of intentions) {
    requireValue(object(entry), `${path}.declaredIntention`);
    fields(entry, entry.kind === 'fixed-area' ? ['id', 'sourceId', 'kind', 'cells', 'turnable']
      : ['id', 'sourceId', 'kind', 'targetId'], `${path}.declaredIntention`);
    requireValue(id(entry.id) && enemies.some(e => e.id === entry.sourceId), `${path}.declaredIntention identity/source`);
    if (entry.kind === 'fixed-area') {
      requireValue(Array.isArray(entry.cells) && typeof entry.turnable === 'boolean', `${path}.declaredIntention cells/turnable`);
      for (const cell of entry.cells) {
        fields(cell, ['q', 'r'], `${path}.declaredIntention cell`);
        try { validateHex(cell); } catch { fail(`malformed ${path}.declaredIntention cell`); }
      }
    } else requireValue(['marked-hit', 'marked-splash'].includes(entry.kind as string)
      && brood.some(b => b.id === entry.targetId), `${path}.declaredIntention target/kind`);
  }
  requireValue(new Set(intentions.map(e => e.id)).size === intentions.length, `${path}.intention IDs`);
}
function command(value: unknown, path: string): asserts value is RecordedCommand {
  requireValue(object(value), path);
  const names = value.kind === 'endPhase' ? ['kind', 'expectedRevision']
    : value.kind === 'maneuver' ? ['kind', 'expectedRevision', 'maneuver']
      : value.kind === 'useAbility' ? ['kind', 'expectedRevision', 'actorId', 'abilityId', 'targetId',
        ...(value.abilityId === 'crosswind' ? ['direction'] : [])] : undefined;
  requireValue(names, `${path}.kind (only player commands supported)`);
  fields(value, names, path);
  requireValue(integer(value.expectedRevision), `${path}.expectedRevision`);
  if (value.kind === 'maneuver') requireValue(['clockwise', 'anticlockwise', 'expand', 'contract'].includes(value.maneuver as string), `${path}.maneuver`);
  if (value.kind === 'useAbility') {
    requireValue(id(value.actorId) && id(value.targetId) && isAbilityId(value.abilityId), `${path}.ability/actor/target`);
    if (value.abilityId === 'crosswind') requireValue(['clockwise', 'anticlockwise'].includes(value.direction as string), `${path}.direction`);
  }
}
/** Object key order is irrelevant; array/event order is contractual. */
function equal(a: unknown, b: unknown): boolean {
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((v, i) => equal(v, b[i]));
  if (object(a) && object(b)) return Object.keys(a).length === Object.keys(b).length
    && Object.keys(a).every(key => Object.hasOwn(b, key) && equal(a[key], b[key]));
  return a === b;
}
export function createRunRecord<State extends EncounterState>(initialState: State, fixtureId: EncounterPreset,
  buildRevision = 'unknown', rules: AbilityRules = commandAbilityRules(initialState)): RunRecord<State> {
  const encounter = encounterFor(initialState);
  if (!encounter) fail('unknown encounter');
  return copy({ recordVersion: RECORD_VERSION, prototypeId: PROTOTYPE_ID, buildRevision,
    rulesVersion: `poc-001-rules-v3/${encounter.codec.version}/${BROOD_RULES_VERSION}`, fixtureId,
    configuration: { [encounter.codec.rulesKey]: encounter.rules(initialState), abilityRules: rules },
    initialState, acceptedCommands: [], finalState: initialState, events: [] }) as unknown as RunRecord<State>;
}
/** Called only after P10's adapter accepts an input; rejected/selected inputs never enter the stream. */
export function appendAcceptedCommand<State extends EncounterState>(record: RunRecord<State>, input: Command, result: CommandResult): RunRecord<State> {
  if (!result.ok) fail(`cannot record rejected command: ${result.error.code}`);
  command(input, 'accepted command');
  state(result.state, 'accepted state', record.rulesVersion);
  requireValue(input.expectedRevision === record.finalState.revision
    && result.state.revision === input.expectedRevision + 1, 'accepted revision');
  return copy({ ...record, acceptedCommands: [...record.acceptedCommands,
    { command: input, revision: result.state.revision, events: result.events }],
    finalState: result.state, events: [...record.events, ...result.events] }) as unknown as RunRecord<State>;
}
export function parseRunRecord(json: string): RunRecord<EncounterState> {
  let value: unknown;
  try { value = JSON.parse(json); } catch { fail('invalid JSON'); }
  requireValue(object(value), 'record');
  if (value.recordVersion !== RECORD_VERSION) fail(`unsupported record version: ${versionLabel(value.recordVersion)}`);
  if (typeof value.rulesVersion !== 'string' || !codec(value.rulesVersion)) fail(`unsupported rules version: ${versionLabel(value.rulesVersion)}`);
  fields(value, ['recordVersion', 'prototypeId', 'buildRevision', 'rulesVersion', 'fixtureId',
    'configuration', 'initialState', 'acceptedCommands', 'finalState', 'events'], 'record');
  requireValue(value.prototypeId === PROTOTYPE_ID, 'prototypeId');
  requireValue(value.buildRevision === 'unknown' || typeof value.buildRevision === 'string'
    && /^[a-f0-9]{40}$/.test(value.buildRevision), 'buildRevision');
  const encounter = codec(value.rulesVersion as string)!;
  requireValue(encounter.presets.some(preset => preset.id === value.fixtureId), 'fixtureId');
  const key = encounter.codec.rulesKey;
  fields(value.configuration, [key, 'abilityRules'], 'configuration');
  (key === 'patrolRules' ? patrolRules : key === 'collectorRules' ? collectorRules : crucibleRules)(value.configuration[key], `configuration.${key}`);
  abilityRules(value.configuration.abilityRules, 'configuration.abilityRules');
  state(value.initialState, 'initialState', value.rulesVersion as string); state(value.finalState, 'finalState', value.rulesVersion as string);
  requireValue(value.initialState.revision === 0 && value.initialState.round === 1
    && value.initialState.phase === 'player', 'initialState attempt start');
  requireValue(equal(encounterFor(value.initialState)!.rules(value.initialState), value.configuration[key]), 'configuration/initialState rules mismatch');
  requireValue(Array.isArray(value.acceptedCommands), 'acceptedCommands');
  value.acceptedCommands.forEach((entry: unknown, index: number) => {
    fields(entry, ['command', 'revision', 'events'], `acceptedCommands[${index}]`);
    command(entry.command, `acceptedCommands[${index}].command`);
    requireValue(integer(entry.revision) && Array.isArray(entry.events), `acceptedCommands[${index}].revision/events`);
  });
  requireValue(Array.isArray(value.events), 'events');
  return value as unknown as RunRecord<EncounterState>;
}
/** Pure replay. No dynamic imports, code evaluation, IO, migrations or correction. */
export function replayRun(json: string): { state: EncounterState; events: readonly GameplayEvent[]; commands: number } {
  const record = parseRunRecord(json);
  let current = record.initialState;
  const events: GameplayEvent[] = [];
  for (const [index, entry] of record.acceptedCommands.entries()) {
    const result = entry.command.kind === 'useAbility'
      ? applyAbility(current, entry.command, record.configuration.abilityRules) as CommandResult<EncounterState>
      : applyCommand(current, entry.command);
    if (!result.ok) fail(`command ${index + 1} rejected: ${result.error.code}`);
    if (result.state.revision !== entry.revision) fail(`command ${index + 1} revision divergence`);
    if (!equal(result.events, entry.events)) fail(`command ${index + 1} event divergence`);
    current = result.state; events.push(...result.events);
  }
  if (!equal(current, record.finalState)) fail('final state divergence');
  if (!equal(events, record.events)) fail('final event order divergence');
  return { state: current, events, commands: record.acceptedCommands.length };
}
