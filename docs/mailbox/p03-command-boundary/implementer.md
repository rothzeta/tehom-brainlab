task: P03-impl
status: complete
outcome: P03.C1–C4 implemented and verified by Implementer; independent review pending.
role: implementer
source_baseline: ab37525587b7739e3cf28b738f5bad5bece7965a
candidate_revision: b2d25339149b76f7a994da798f5f688449b3668c
tested_revision: b2d25339149b76f7a994da798f5f688449b3668c
artifacts:
  - docs/mailbox/p03-command-boundary/implementer.md
  - poc-001-linked-formation/src/core/state.ts
  - poc-001-linked-formation/src/core/commands.ts
  - poc-001-linked-formation/src/core/transition.ts
  - poc-001-linked-formation/tests/commands.test.ts
  - poc-001-linked-formation/README.md
  - docs/plans/2026-10-02-2dfffcd3-poc-001-command-boundary.md
  - docs/plans/README.md
  - docs/CURRENT.md
  - docs/TASK_LOGS.md
verification:
  - "just poc-001-test tests/commands.test.ts tests/formation.test.ts: exit 0; 127 tests, P03 253 and P02 3349 actual assertions."
  - "just poc-001-test: exit 0; 129 tests across three files."
  - "just poc-001-typecheck: exit 0."
  - "just poc-001-build: exit 0; existing Phaser chunk-size warning."
  - "git diff --check ab37525587b7739e3cf28b738f5bad5bece7965a..HEAD: exit 0 at candidate."
  - "Protected P01/P02/runtime/tooling diff against BASE: exit 0; unchanged."
  - "Pinned host Bun inline production trace: exit 0; accepted/rejected outputs recorded below."
  - "Handoff validator with --repo: exit 0; ok true, three revision references resolved, diagnostics empty."
review: not-run
discoveries:
  - "Sandbox Docker access, Git worktree index writes, and handoff dependency installation required successful escalation; no host-mode fallback for application checks."
  - "Existing P02 README status text still describes its earlier pending review; current P02 delivery facts are in CURRENT and its delivery report. P03 does not rewrite P02 evidence."
blockers: []

Author: P03-impl Implementer. Date: 2026-10-04 UTC. Workspace/branch: `/opt/dev/tehom-brainlab-p03`, `p03-command-boundary`. Governing [plan](../../plans/2026-10-02-2dfffcd3-poc-001-command-boundary.md) and [execution record](../../TASK_LOGS.md#2026-10-04-p03-command-boundary).

The full BASE and final technical candidate SHAs appear above. `git status --short` was empty at this candidate before evidence edits. A documentation-only successor records this report and status/log/README updates; its existing SHA and final clean-worktree check are returned in the session handoff, following the skill's prohibition on predicting a report's own creating commit. No executable/test changes follow the tested candidate. No merge, push, publication, or independent acceptance occurred.

## Changes and checkpoint completion

Exactly the four proposed production/test paths were used; no ownership/layout deviation. [State](../../../poc-001-linked-formation/src/core/state.ts) and [command/result contracts](../../../poc-001-linked-formation/src/core/commands.ts) implement C1. [Transition](../../../poc-001-linked-formation/src/core/transition.ts) reuses P02's four production maneuvers for C2 and owns the action-accounting seam for C3. [Tests](../../../poc-001-linked-formation/tests/commands.test.ts) and the linked README/status/log updates implement C4. All ten changed files are listed in `artifacts`.

No P01/P02 tests were edited. No formation geometry, view, runtime, dependencies/lockfiles/configuration, routing, agent source, abilities, phase driver, resets, command bus, undo, or DSL was added or changed. Skill-local ignored dependencies were installed only to run the assigned validator.

## Public contracts

Imports are direct from the three new core modules; readonly TypeScript records contain serializable plain data. Valid typed `GameState` snapshots are the input domain; P03 is not an arbitrary JSON state-schema validator. The factory produces integer HP/max HP and stable, unique roster IDs.

```ts
type Phase = 'player' | 'enemy' | 'victory' | 'defeat';
// BroodState: {id, brood: Brood, owner:'player'|'enemy', hp, maxHp, statuses:string[]}
// GameState: {revision, round, phase, formation:Formation, brood:BroodState[],
//             actedIds:string[], maneuverUsed:boolean, intentions:string[]}
type Maneuver = 'clockwise' | 'anticlockwise' | 'expand' | 'contract';
interface ActorAction {
  expectedRevision: number; actorId: string; abilityId: string; targetId: string;
}
type Command =
  | {kind:'maneuver'; expectedRevision:number; maneuver:Maneuver}
  | ({kind:'useAbility'} & ActorAction)
  | {kind:'endPhase'; expectedRevision:number};
type CommandResult =
  | {ok:true; state:GameState; events:readonly GameplayEvent[]}
  | {ok:false; state:GameState; events:readonly []; error:{code:ErrorCode}};
createInitialState(): GameState;
applyCommand(state: GameState, command: Command): CommandResult;
applyActorAction(state: GameState, action: ActorAction, rules: ActionRules): CommandResult;
```

Only **`maneuver`** is supported as a public player command: all four payloads use P02 geometry, with same-shape expansion/contraction rejected at P03. Success modifies only formation, shared allowance, and revision, and emits one ordered `{type:'maneuver-applied',maneuver,formation,revision}` event. Every rejection returns an input-equivalent state and `events:[]`; it spends nothing.

`useAbility` and `endPhase` always reject explicitly, including stale/terminal inputs. P03 installs no registration framework. Future P07/P08 work may extend this dispatch directly.

`applyActorAction` is a trusted pure dispatcher seam, not another player command. Its required `rules.validate(state,actor,action)` returns `undefined`, `illegal-ability`, or `illegal-target`; its required `rules.apply(state,actor,action)` returns replacement entity data only. Both must be pure. The helper guards revision/phase, identity, ownership, HP > 0, and unused actor budget before legality and before applying the effect. It then appends that actor ID once and increments revision once. Shared allowance, formation, round, phase, and intentions remain unchanged. It emits `{type:'action-applied',actorId,abilityId,targetId,revision}`. This limited hook cannot return replacement budget/phase/revision fields; later effects can extend it when required. Tests supply a legal artificial heal effect, not production ability rules. Trusted hook exceptions are not command errors; hook purity and valid typed state are preconditions.

## Stable error vocabulary and precedence

`error.code` is machine-readable; no prose-message matching is needed.

| Code | Example |
| --- | --- |
| `unsupported-command` | Any public `useAbility` or `endPhase`, even with outdated revision |
| `invalid-command` | Unrecognized kind or maneuver payload from a serialized caller |
| `stale-revision` | Snapshot revision 1, maneuver expectedRevision 0 |
| `wrong-phase` | Maneuver/action in enemy, victory, or defeat phase |
| `maneuver-used` | Another maneuver with current revision after spending the allowance |
| `same-shape` | Contract Compact or expand Spread with allowance unused |
| `unknown-actor` | Accounting action actor ID `absent` |
| `wrong-owner` | Known actor with owner `enemy` |
| `fallen-actor` | Known player actor HP zero (or below) |
| `already-acted` | Known living actor already in `actedIds` |
| `illegal-ability` | Dispatcher validation rejects supplied ability ID |
| `illegal-target` | Dispatcher validation rejects supplied target ID |

Precedence is explicit implementation policy: unsupported public kinds, unrecognized kind, revision, phase, shared budget, then maneuver/no-op validation. Action accounting uses revision, phase, identity, ownership, living status, actor budget, then caller-supplied legality. Only fully valid commands/effects spend resources.

## Acceptance evidence 1–6

All cases use production `applyCommand`/`applyActorAction`; tests contain no duplicate maneuver/accounting rules. Nested inputs are recursively frozen. Exact successor fields/events are assertions of the published transition contracts, not snapshots of incidental property order. Fixture HP assertions require integer/alive/bounded values rather than fixing artificial HP one.

| Criterion | Executed tests and evidence |
| --- | --- |
| 1 | `AC1: initial legal rotation...`: Compact 0 → 1, revision 0 → 1, shared allowance true, no acted IDs; all remaining state equal; one corresponding event |
| 2 | `AC2` second/replayed/stale, two same-shape cases, and enemy/victory/defeat fixtures: unchanged state/budgets, empty events, precise rejection codes; a rotation still succeeds after same-shape rejection |
| 3 | `AC3` legal test effect once, already-acted/unknown/fallen/foreign rejection, and another eligible actor still accepted; phase/revision and ability/target legality rejects before effect. Throwing caller hooks establish that rejected requests never reach effects. Before/between/after action sequences each finish with exactly three actors spent plus one shared maneuver, revision four |
| 4 | Both unsupported kinds tested in all four phases with stale revisions and spent budgets: explicit `unsupported-command`, unchanged state, empty events |
| 5 | Deeply frozen accepted and rejected snapshots and commands throughout; six explicit geometry destinations including both shapes/wraparound; recursive object-identity traversal finds no mutable nested objects shared between two factory calls |
| 6 | All four serialized legal maneuver payloads replayed against deserialized identical starting states: equal successor state and ordered events, and JSON round-trip preserves result data |

Actual P03 totals: **37 tests, 253 matcher assertions** (Vitest `assertionCalls` summed after each test). Unchanged P02: **90 tests, 3,349 assertions**. Focused: **127 tests**; full: **129 tests**, including two unchanged P01 cases.

## Chosen defaults and their sources

| Choice | Resolution and source |
| --- | --- |
| Initial revision/round/phase/formation | 0 / 1 / player / Compact orientation 0, exactly plan Fixture and inputs |
| Roster/IDs/ownership | Reuse P02 `ROSTER`; each ID equals its Brood key and owner is player. Fixed roster from plan fixture; ID spelling/owner field are minimal C1/C3 implementation choices |
| HP/max HP | Integer 1/1 in factory, with HP zero treated as fallen. Artificial minimal alive fixture resolves unspecified numeric values; plan requires integer HP/max HP and alive initial Brood. Not P08 balance |
| Statuses/intentions | Fresh empty readonly string arrays; opaque extension labels with no rules. Empty values required by plan fixture; placeholder element representation is a C1 implementation choice |
| Phases | player/enemy/victory/defeat union; non-player and terminal states reject. Names resolve plan adversarial fixture without adding a driver |
| Maneuver/action budgets | Fresh empty actedIds, false shared allowance; one shared maneuver independent of each living Brood action; no banking/reset. Plan Fixture, Settled choices, and Proposed implementation; brief Round structure |
| Command shape | `kind` discriminator, required expectedRevision; maneuver names exactly clockwise/anticlockwise/expand/contract; actor/ability/target IDs strings. Plan Proposed implementation; payload field names resolve C1 |
| Same-shape behavior | Reject with `same-shape`, preserving allowance. Plan Proposed implementation; P02 same-shape pure functions remain unchanged |
| Results/errors/events | Discriminated ok; error code object; rejected events always empty; one corresponding success event with new revision. Plan Required contracts/Proposed implementation; exact vocabulary, field spelling, and precedence are C1 implementation choices |
| Revision | Equality guard before supported work; accepted command/accounted effect increments exactly once. Plan Proposed implementation; no separate internal-effect increments |
| Accounting hooks | Required pure legality/effect callbacks, entity-only effect return, no installed ability/debug command. Minimal C3 resolution of future dispatcher/helper and legal test-effect requirements |
| Unsupported kinds/resets | Both public kinds return unsupported before other validation. No registry added. P07 abilities/P08 round driver remain future owners; only that future driver resets budgets. Plan Proposed implementation/Non-goals |
| Factory/purity | New nested objects/arrays per call; readonly inputs/results, no random/clock/browser data, immutable transitions. Plan Required contracts/Proposed implementation and AC5/6; returned objects need not themselves be runtime-frozen |

## Observed fixture traces

Captured by importing the committed production modules in pinned host Bun 1.4.2; this supplementary pure-core trace is not an application host-mode fallback. JSON equality in the trace checks input equivalence within the same object construction. All application checks used Docker/Bun. The legal effect fixture sets HP 4/max HP 9 and heals Ugallu by explicit amount two, yielding HP six.

| Input/action | Actual outcome | Revision / shared / acted IDs | Events |
| --- | --- | --- | --- |
| Initial + clockwise expected 0 | accepted, Compact orientation 1 | 1 / true / [] | one maneuver-applied |
| Accepted state + expand expected 1 | maneuver-used; input-equivalent true | 1 / true / [] | [] |
| Accepted state + original clockwise expected 0 | stale-revision; input-equivalent true | 1 / true / [] | [] |
| Initial + contract expected 0 | same-shape; input-equivalent true | 0 / false / [] | [] |
| Initial with enemy phase + clockwise | wrong-phase; input-equivalent true | 0 / false / [] | [] |
| Initial + endPhase or useAbility | unsupported-command; input-equivalent true | 0 / false / [] | [] |
| Wounded fixture + eligible Ugallu test effect | accepted; HP 4 → 6 | 1 / false / [ugallu] | one action-applied |
| Accounted state + Ugallu expected 1 | already-acted; input-equivalent true | 1 / false / [ugallu] | [] |
| Wounded fixture with Ugallu HP 0 + action | fallen-actor; input-equivalent true | 0 / false / [] | [] |
| Wounded fixture + absent actor | unknown-actor; input-equivalent true | 0 / false / [] | [] |

Actual accepted maneuver event JSON:

```json
[{"type":"maneuver-applied","maneuver":"clockwise","formation":{"shape":"compact","orientation":1},"revision":1}]
```

Actual accepted action event JSON:

```json
[{"type":"action-applied","actorId":"ugallu","abilityId":"test-effect","targetId":"ugallu","revision":1}]
```

Exact supplementary trace command (root cwd, exit 0):

```sh
/home/metatron/.bun/bin/bun --eval 'import {createInitialState} from "./poc-001-linked-formation/src/core/state.ts"; import {applyCommand,applyActorAction} from "./poc-001-linked-formation/src/core/transition.ts"; function trace(label,input,result){ console.log(JSON.stringify({label,ok:result.ok,error:result.ok?null:result.error.code,revision:result.state.revision,formation:result.state.formation,maneuverUsed:result.state.maneuverUsed,actedIds:result.state.actedIds,events:result.events,inputEquivalent:JSON.stringify(input)===JSON.stringify(result.state)})); } const initial=createInitialState(); const cmd={kind:"maneuver",expectedRevision:0,maneuver:"clockwise"}; const first=applyCommand(initial,cmd); trace("clockwise",initial,first); trace("second",first.state,applyCommand(first.state,{kind:"maneuver",expectedRevision:1,maneuver:"expand"})); trace("replay",first.state,applyCommand(first.state,cmd)); trace("same-shape",initial,applyCommand(initial,{kind:"maneuver",expectedRevision:0,maneuver:"contract"})); const enemy={...initial,phase:"enemy"}; trace("enemy-phase",enemy,applyCommand(enemy,cmd)); trace("endPhase",initial,applyCommand(initial,{kind:"endPhase",expectedRevision:0})); const request={expectedRevision:0,actorId:"ugallu",abilityId:"test-effect",targetId:"ugallu"}; trace("useAbility",initial,applyCommand(initial,{kind:"useAbility",...request})); const wounded={...initial,brood:initial.brood.map(entity=>({...entity,hp:4,maxHp:9}))}; const rules={validate:()=>undefined,apply:(state,actor)=>state.brood.map(entity=>entity.id===actor.id?{...entity,hp:entity.hp+2}:entity)}; const acted=applyActorAction(wounded,request,rules); trace("legal-effect",wounded,acted); console.log(JSON.stringify({label:"legal-effect-hp",hp:acted.state.brood.find(entity=>entity.id==="ugallu").hp})); trace("already-acted",acted.state,applyActorAction(acted.state,{...request,expectedRevision:1},rules)); const fallen={...wounded,brood:wounded.brood.map(entity=>entity.id==="ugallu"?{...entity,hp:0}:entity)}; trace("fallen",fallen,applyActorAction(fallen,request,rules)); trace("unknown",wounded,applyActorAction(wounded,{...request,actorId:"absent"},rules));'
```

## Verification and limits

Required command results and environment setup/failures are in the linked task log. All four required checks ran after committing the candidate, using unchanged default Docker wrappers, Bun 1.4.2, and Vitest 5.0.3. Install used the committed frozen lockfile. Protected source/test/runtime/tooling paths equal BASE. The build retains its existing large Phaser chunk warning.

`/home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p03-command-boundary/implementer.md --repo /opt/dev/tehom-brainlab-p03` exited 0: `schema_version:1`, `ok:true`, three revision references resolved, `diagnostics:[]`. This is structural/revision validation, not independent review.

No unresolved implementation/verification blocker. Independent review, Coordinator acceptance, and delivery await separate work. No browser session, human playtest, deliberate mutation probe, routing suite, or application host-mode run was executed; this pure-core slice adds no browser consumer. The prior browser/runtime evidence was preserved, not rerun. Valid state and trusted pure dispatcher hooks are explicit limits; ability legality content, damage/lifecycle, fallen-formation policy, round transitions, and resets remain future slices.
