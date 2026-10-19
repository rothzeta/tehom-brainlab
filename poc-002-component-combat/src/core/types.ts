/** POC 002 portable contracts. No renderer, browser, clock or I/O dependency.
 * Content numbers are tuning; behaviour names are closed rules from brief §§1–13.
 */
export type BroodId = 'ugallu' | 'girtablilu' | 'anzu';
export type ActionId = 'claw' | 'rend' | 'hold-the-threshold' | 'pincer' | 'envenom' | 'rupture-venom' | 'talon' | 'stolen-bolt' | 'revoke' | 'guard' | 'salve';
export type EnemyId = 'celestial-guard' | 'naming-scribe' | 'corrected-beast' | 'warden-of-correct-form';
export type PartId = 'body' | 'core' | 'weapon-arm' | 'restraining-limb' | 'inscription-hand' | 'tongue' | 'shell' | 'locomotion-organ' | 'clamp' | 'saw' | 'choir';
export type EncounterId = 'guard' | 'scribe' | 'beast' | 'guard-scribe' | 'beast-scribe' | 'guard-beast' | 'warden';
export type GauntletId = 'gauntlet-v1';
export type EnemyInstanceId = `${EnemyId}#${number}`;
export type IntentKind = 'strike' | 'pin' | 'inscribe' | 'utter' | 'gore' | 'trample' | 'clamp' | 'saw' | 'hymn' | 'pulse';
export type IntentId = `r${number}.${EnemyInstanceId}.${IntentKind}`;
export type FormKind = 'rapture' | 'rupture';
export type FormId = `${BroodId}-${FormKind}`;
export type StartPreset = 'fresh' | 'wounded' | 'primed';
export type DamageType = 'physical' | 'magical' | 'poison';
export type TargetKind = 'part' | 'component' | 'poisoned-enemy' | 'intent' | 'brood' | 'none';
export type TargetingRule = 'ledger-then-highest-hp' | 'lowest-hp' | 'first-other-enemy' | 'highest-revelation-untransformed' | 'highest-revelation-then-lowest-hp' | 'clamped-else-highest-hp' | 'all-brood';
export type Schedule = { kind: 'every-round' } | { kind: 'modulo'; divisor: number; remainder: number; matches: boolean };
export type ActionEffect =
  | { kind: 'damage'; damageType: DamageType; amount: number; componentAmount: number; ignoreComponentArmor: boolean }
  | { kind: 'hold'; physicalReduction: number; retaliation: number }
  | { kind: 'envenom'; amount: number; poisonGain: number; poisonCap: number; weakenedReduction: number }
  | { kind: 'rupture-venom'; multiplier: number }
  | { kind: 'revoke' }
  | { kind: 'guard' }
  | { kind: 'heal'; amount: number };
export interface ActionDefinition { id: ActionId; name: string; target: TargetKind; revelationCost: number; effect: ActionEffect }
export type FormModifier =
  | { kind: 'attack-bonus'; actions: ActionId[]; amount: number; ignoreArmor: boolean }
  | { kind: 'block-actions'; actions: ActionId[] }
  | { kind: 'incoming-bonus'; amount: number }
  | { kind: 'poison-set'; amount: number }
  | { kind: 'venom-multiplier'; amount: number }
  | { kind: 'round-hp-loss'; amount: number }
  | { kind: 'bolt-amount'; amount: number }
  | { kind: 'revoke-any-source' };
export interface FormDefinition { id: FormId; brood: BroodId; kind: FormKind; durationRounds: number; modifiers: FormModifier[] }
export interface BroodDefinition { id: BroodId; name: string; maxHp: number; revelationCap: number; actions: ActionId[]; forms: FormId[] }
export interface PartDefinition { id: PartId; name: string; kind: 'body' | 'component'; pool: number; armor: number; living: boolean; shieldedBy: PartId | null }
export type IntentModifier =
  | { kind: 'part-intact-bonus'; part: PartId; amount: number }
  | { kind: 'clamped-bonus'; amount: number };
export type IntentRider = { kind: 'pinned' | 'clamped'; durationRounds: number } | { kind: 'revelation'; amount: number };
export interface IntentDefinition { kind: IntentKind; sourcePart: PartId; schedule: Schedule; targeting: TargetingRule; damageType: DamageType; amount: number; ward: number; modifiers: IntentModifier[]; riders: IntentRider[] }
export interface EnemyDefinition { id: EnemyId; name: string; parts: PartDefinition[]; intents: IntentDefinition[] }
export interface EncounterDefinition { id: EncounterId; enemies: EnemyId[] }
export interface GauntletDefinition { id: GauntletId; encounters: EncounterId[]; start: StartPreset; salveUses: number }
export interface StartDefinition { id: StartPreset; kind: 'full' | 'half-hp' | 'below-cap'; revelationGap: number }
export interface Content {
  schema: 'tehom-combat-content/1'; contentVersion: string;
  brood: BroodDefinition[]; actions: ActionDefinition[]; forms: FormDefinition[];
  enemies: EnemyDefinition[]; encounters: EncounterDefinition[]; gauntlets: GauntletDefinition[];
  starts: StartDefinition[]; fightSalveUses: number;
}

export type Phase = 'player' | 'between-fights' | 'victory' | 'defeat';
export type StatusKind = 'poison' | 'weakened' | 'ward' | 'guard' | 'hold' | 'pinned' | 'clamped';
export interface PartTarget { enemy: EnemyInstanceId; part: PartId }
export type Target = PartTarget | { enemy: EnemyInstanceId } | { intent: IntentId } | { brood: BroodId } | null;
export interface Transformation { id: FormId; kind: FormKind; untilRound: number }
export interface Restraint { enemy: EnemyInstanceId; part: PartId; untilRound: number }
export interface BroodStatuses { guard: { untilRound: number } | null; hold: { target: BroodId; untilRound: number } | null; pinned: Restraint | null; clamped: Restraint | null }
export interface BroodState { id: BroodId; hp: number; maxHp: number; revelation: number; revelationCap: number; acted: boolean; statuses: BroodStatuses; transformation: Transformation | null; pendingCrossing: FormKind | null }
export interface PartState { id: PartId; kind: 'body' | 'component'; pool: number; maxPool: number; armor: number; living: boolean; shieldedBy: PartId | null }
export interface Ward { sourceEnemy: EnemyInstanceId; sourcePart: PartId; intent: IntentId; amount: number; untilRound: number }
export interface EnemyState { id: EnemyInstanceId; definitionId: EnemyId; parts: PartState[]; poison: number; weakened: { amount: number; untilRound: number } | null; wards: Ward[] }
export type IntentTarget = { brood: BroodId } | { enemy: EnemyInstanceId } | { allBrood: true };
export type CancellationReason = 'source-destroyed' | 'enemy-died' | 'revoked';
export interface DeclaredIntent { id: IntentId; enemy: EnemyInstanceId; sourcePart: PartId; kind: IntentKind; target: IntentTarget; damageType: DamageType; amount: number; modifiers: IntentModifier[]; riders: IntentRider[]; ward: number; status: 'pending' | 'resolved' | 'cancelled' | 'revoked' | 'skipped'; cancellationReason: CancellationReason | null }
export interface LedgerEntry { enemy: EnemyInstanceId; current: Record<BroodId, number>; previous: Record<BroodId, number> }
export interface FightOptions { encounterId: EncounterId; party: BroodId[]; start: StartPreset }
export interface GauntletOptions { party: BroodId[] }
export type RunDescriptor = ({ kind: 'fight'; encounters: EncounterId[] } & FightOptions) | { kind: 'gauntlet'; gauntletId: GauntletId; encounters: EncounterId[]; party: BroodId[]; start: StartPreset };
export interface CarriedBrood { id: BroodId; hp: number; revelation: number }
export interface BattleState { round: number; phase: Phase; revision: number; party: BroodState[]; enemies: EnemyState[]; intents: DeclaredIntent[]; salveUses: number; ledger: LedgerEntry[]; run: RunDescriptor; fightIndex: number; carried: CarriedBrood[] }
export type Command =
  | { kind: 'act'; expectedRevision: number; actor: BroodId; action: ActionId; target: Target }
  | { kind: 'endPhase'; expectedRevision: number }
  | { kind: 'continue'; expectedRevision: number };
/** Validation precedence, from brief §2; do not reorder. */
export const REJECTION_CODES = ['invalid-command', 'stale-revision', 'wrong-phase', 'unknown-actor', 'actor-dead', 'already-acted', 'unknown-action', 'action-unavailable', 'no-item-uses', 'illegal-target'] as const;
export type RejectionCode = typeof REJECTION_CODES[number];
export interface CommandError { code: RejectionCode }
/** Components are nonnegative contributions, in the formula's order. Applied is
 * actual HP/pool removed (bounded by the recipient's remaining pool). */
export interface DamageBreakdown { damageType: DamageType; raw: number; armor: number; ward: number; weakened: number; rupture: number; guard: number; hold: number; applied: number }
export type DamageSource = { kind: 'action'; actor: BroodId; action: ActionId } | { kind: 'intent'; intent: IntentId } | { kind: 'retaliation'; actor: BroodId; intent: IntentId } | { kind: 'poison'; enemy: EnemyInstanceId } | { kind: 'form'; brood: BroodId; form: FormId };
export type RevelationSource = { kind: 'action'; action: ActionId } | { kind: 'intent'; intent: IntentId };
export type StatusTarget = { brood: BroodId } | { enemy: EnemyInstanceId };
export type StatusRemovalReason = 'expired' | 'source-destroyed' | 'enemy-died' | 'brood-died' | 'revoked' | 'consumed' | 'combat-ended';
export type Event =
  | { kind: 'round-started'; round: number }
  | { kind: 'intent-declared'; intent: DeclaredIntent }
  | { kind: 'action-used'; actor: BroodId; action: ActionId; target: Target }
  | { kind: 'part-damaged'; target: PartTarget; source: DamageSource; damage: DamageBreakdown; remaining: number }
  | { kind: 'part-destroyed'; target: PartTarget }
  | { kind: 'enemy-died'; enemy: EnemyInstanceId }
  | { kind: 'intent-cancelled'; intent: IntentId; reason: CancellationReason }
  | { kind: 'intent-skipped'; intent: IntentId; reason: 'target-dead' | 'source-destroyed' | 'enemy-died' | 'cancelled' | 'revoked' }
  | { kind: 'intent-redirected'; intent: IntentId; from: BroodId; to: BroodId }
  | { kind: 'intent-resolved'; intent: IntentId }
  | { kind: 'brood-damaged'; brood: BroodId; source: DamageSource; damage: DamageBreakdown; remaining: number }
  | { kind: 'brood-healed'; brood: BroodId; actor: BroodId; amount: number; remaining: number }
  | { kind: 'brood-died'; brood: BroodId }
  | { kind: 'status-applied'; target: StatusTarget; status: StatusKind; amount: number; untilRound: number | null; source: PartTarget | null }
  | { kind: 'status-removed'; target: StatusTarget; status: StatusKind; reason: StatusRemovalReason }
  | { kind: 'poison-ticked'; enemy: EnemyInstanceId; amount: number; remainingPoison: number }
  | { kind: 'revelation-gained'; brood: BroodId; amount: number; revelation: number; source: RevelationSource }
  | { kind: 'revelation-burned'; brood: BroodId; amount: number; applied: number; remainingHp: number; source: RevelationSource }
  | { kind: 'transformation-started'; brood: BroodId; transformation: Transformation }
  | { kind: 'transformation-ended'; brood: BroodId; form: FormId; reason: 'expired' | 'victory' | 'death'; revelation: number }
  | { kind: 'retaliated'; actor: BroodId; intent: IntentId; target: PartTarget; damage: DamageBreakdown }
  | { kind: 'item-used'; actor: BroodId; item: 'salve'; target: BroodId; usesRemaining: number }
  | { kind: 'combat-ended'; outcome: 'victory' | 'defeat'; fightIndex: number }
  | { kind: 'fight-continued'; encounterId: EncounterId; fightIndex: number };
export type EventKind = Event['kind'];
// Atomic command/revision seam copied from poc-001-linked-formation/src/core/commands.ts at c82ec3c.
export type CommandResult = { ok: true; state: BattleState; events: Event[] } | { ok: false; state: BattleState; events: []; error: CommandError };
export interface StateDelta { brood: { id: BroodId; hp: number; revelation: number }[]; parts: { target: PartTarget; pool: number }[]; salveUses: number }
/** result and forecast are produced by the real dispatcher on clones. A terminal
 * result has forecast null; events always belong to the selected command only. */
export interface Preview { result: CommandResult; state: BattleState; events: Event[]; deltas: StateDelta; forecast: CommandResult | null }
export interface LegalAction { command: Command; label: string }
export interface RecordedCommand { command: Command; revision: number; events: Event[] }
export interface CombatRecord { schema: 'tehom-combat-record/1'; prototypeId: 'poc-002-component-combat'; rulesVersion: 'poc-002-rules-v1'; contentVersion: string; buildRevision: string; content: Content; run: RunDescriptor; initialState: BattleState; commands: RecordedCommand[]; finalState: BattleState }
export interface RecordOptions { content: Content; initialState: BattleState; commands: RecordedCommand[]; finalState: BattleState; buildRevision: string }
export type ReplayResult = { ok: true; state: BattleState; commands: number; events: number; outcome: Phase } | { ok: false; commandIndex: number; kind: 'events' | 'revision' | 'final-state' | 'rejected-command'; message: string };
/** Fixed module-independent API signatures. Q02 implements all but Q03's full
 * gauntlet record support; loadContent is implemented by Q01 in content.ts. */
export interface CoreApi {
  loadContent(json: unknown): Content;
  createFight(content: Content, options: FightOptions): BattleState;
  createGauntlet(content: Content, options: GauntletOptions): BattleState;
  applyCommand(content: Content, state: BattleState, command: unknown): CommandResult;
  previewCommand(content: Content, state: BattleState, command: unknown): Preview;
  legalActions(content: Content, state: BattleState): LegalAction[];
  recordOf(options: RecordOptions): CombatRecord;
  parseRecord(json: unknown): CombatRecord;
  replayRecord(record: CombatRecord): ReplayResult;
}
/** Browser-free seam consumed by mountBattle; live implementation belongs to Q05. */
export interface BattleSession { readonly content: Content; readonly state: BattleState; subscribe(listener: (state: BattleState, events: readonly Event[]) => void): () => void; preview(command: Command): Preview; commit(command: Command): CommandResult; exportRecord(): CombatRecord }
