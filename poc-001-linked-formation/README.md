# POC 001 — Linked formation

**Status: P01–P03 accepted and locally delivered. P04 formation lab implemented, independently reviewed (no blocking findings; optional O1 open), accepted and locally delivered. [Evidence](../docs/mailbox/p04-formation-lab/implementer.md), [integration](../docs/mailbox/p04-formation-lab/integration.md), [review](../docs/mailbox/p04-formation-lab/reviewer.md). Not a playable patrol.**

Test whether rotating, expanding, and contracting three linked Brood creates interesting ordinary combat decisions. The [design brief](../docs/prototypes/poc-001-linked-formation.md) and [direction ADR](../docs/adr/0004-repository-and-poc-direction.md) describe the experiment. P01 supplies the browser harness, P02 the pure geometry, and P03 the command boundary. P04 renders the inspection and maneuver lab. Combat remains later work.

## Run the lab

Prerequisites: POSIX shell, just, and Docker CLI with an accessible daemon. Run from the repository root:

```sh
just poc-001-install
just poc-001-dev
just poc-001-typecheck
just poc-001-test
just poc-001-build
just poc-001-preview
```

Development serves <http://localhost:5173>; built preview serves <http://localhost:4173>. Stop a server with Ctrl-C. Build before preview. Both render `TEHOM — Formation Lab`, a 19-cell Phaser canvas board, and native inspection/maneuver controls. There is no backend, credentials, or external runtime asset service. Generated asset URLs use `base: './'` for static subdirectory hosting.

The default `POC001_MODE=docker` runs the official `oven/bun:1.4.2` image pinned by digest in [runtime.env](runtime.env). This prototype is mounted writable and root `assets/` read-only for the bounded preparation step, with caller UID/GID, temporary writable home/cache, and localhost port publication. Vite binds `0.0.0.0` inside the container. No Docker build or root application is needed. Image downloads and dependency installs require network access; the container cache is temporary. Install explicitly requires the committed `bun.lock` and uses `bun install --frozen-lockfile`.

For another server port, select it through `POC001_PORT` so container publication and Vite agree:

```sh
POC001_PORT=5180 just poc-001-dev
just poc-001-test tests/smoke.test.ts
just poc-001-test tests/smoke.test.ts -t 'declared literal'
just poc-001-build --outDir 'dist alternative'
```

Arguments are forwarded unchanged; file filters are relative to this prototype. Use `POC001_PORT` rather than a separate `--port` in Docker mode. Nonzero tool exits propagate unchanged through the executable and just.

An explicit host mode is available if Bun **1.4.2** is on PATH:

```sh
POC001_MODE=host just poc-001-install
POC001_MODE=host just poc-001-test
POC001_MODE=host just poc-001-dev
```

The runtime pin is enforced in either mode. Missing Bun, a mismatched Bun version, or inaccessible Docker fails clearly. The wrapper never switches modes automatically. `.bun-version` and `packageManager` also record the pin; changing it requires updating runtime.env and verifying the toolchain again. Host Vite also binds `0.0.0.0`; select Docker mode for localhost-only published access.

## Stack and boundaries

Exact direct dependencies: Bun 1.4.2, Phaser 4.2.1, Vite 8.3.2, Vitest 5.0.3, TypeScript 7.0.2, and @types/node 26.6.4. Official published engine/peer constraints were checked; actual Docker checks demonstrate compatibility under Bun. All package scripts run with `bun run --bun`; tests use `vitest run`, not Bun's built-in test runner. TypeScript 7's launcher runs under Bun and uses its packaged native compiler. No Node runtime exception is required.

`src/main.ts` alone initializes the game. `src/view/` owns presentation. `src/core/smoke.ts` has no imports and returns the contractual literal `formation-lab-ready`; it accesses no browser globals or game initialization. The Vitest test checks that literal with throwing browser-global guards, plus the actual unit-process Bun version. Strict TypeScript checks source, tests, and configuration.

Dependencies, configuration, scripts, and lockfile stay local. `node_modules/` and `dist/` are ignored. There is no root package/workspace or another-prototype dependency. The root recipes delegate to `bin/run` → `scripts/run.sh` → `scripts/toolchain.sh`.

## Formation algebra (P02)

[The P02 plan](../docs/plans/2026-10-02-2e228a2b-poc-001-formation-algebra.md) owns the coordinate fixture and reversible mapping. Import typed, browser-independent exports directly from `src/core/hex.ts` and `src/core/formation.ts`:

- `Hex`, `validateHex`, `hexDistance`, `boardCells`, `RING_TWO`, `RING_ONE`: integer axial coordinates, validation, distance, the fixed 19-cell board, and the exact clockwise 12-cell ring T and 6-cell ring S. `T` is frozen in this order: `(2,0), (1,1), (0,2), (-1,2), (-2,2), (-2,1), (-2,0), (-1,-1), (0,-2), (1,-2), (2,-2), (2,-1)`. `S` is frozen in this order: `(1,0), (0,1), (-1,1), (-1,0), (0,-1), (1,-1)`. A clockwise turn advances T by 2 indices and S by 1, modulo their lengths. Board enumeration order is unspecified; ring indices are contractual.
- `Brood`, `Shape`, `Orientation`, `Formation`, `Position`, `Link`, `ROSTER`, `CLOSE_THRESHOLD`: readonly types and the fixture constants.
- `validateFormation`, `formations`, `formationPositions`, `formationLinks`, `rotateClockwise`, `rotateAnticlockwise`, `expandFormation`, `contractFormation`: validation, twelve labelled states, derived positions/links, and pure transitions.

Use `{ shape: 'compact' | 'spread', orientation: 0 | 1 | 2 | 3 | 4 | 5 }`. Every caller supplies an explicit formation; this module chooses no default initial state. Positions are `{brood, cell: {q,r}}` in `[ugallu, girtablilu, pazuzu]` order. For orientation `o`, Compact uses `T[2o]`, `T[2o+1]`, `S[o]`; Spread uses T indices `2o+[0,4,8]`, modulo 12. Compact Ugallu and Girtablilu occupy radius 2 and Pazuzu occupies radius 1, with all three mutually adjacent. Spread occupies the outer corners on ring 2. At orientation zero Compact is `(2,0), (1,1), (1,0)` in roster order; Spread is `(2,0), (-2,2), (0,-2)`. Spread states with the same unlabelled occupied-cell set retain their different labelled assignments. Clockwise adds one orientation modulo six; anticlockwise subtracts one. Expansion and contraction preserve orientation and identity; applying either to its destination shape keeps that shape.

The experimental convention uses downward-positive screen vertical coordinates. A compatible projection is `(q + r/2, sqrt(3)*r/2)`; `(-r,q+r)` is one clockwise 60-degree turn. Pixel scale and origin belong to the future renderer. Distance is `max(abs(dq),abs(dr),abs(dq+dr))`. The fixed centre is `(0,0)`, radius two, with no translation or independent movement (plan Fixture and Settled choices; brief Formation rules).

Links return `from`/`to` labelled positions, integer `distance`, and `state: 'close' | 'stretched'`, in roster-pair order `(0,1), (0,2), (1,2)`. `formationLinks(formation, closeThreshold)` accepts an explicit nonnegative safe integer threshold, defaulting to `CLOSE_THRESHOLD = 2`. Close means distance <= threshold; Compact distances are `[1,1,1]`, Spread `[4,4,4]`. Threshold two and the coordinate presets are experimental/provisional, from the plan and brief's Links section; they are not balanced gameplay findings.

Public validation throws `RangeError` synchronously and never clamps, rounds, coerces, or normalizes invalid inputs. Error messages are:

| Invalid input | Message |
| --- | --- |
| Malformed coordinate, fractional/nonfinite/nonnumeric or unsafe `q`/`r` | `Hex coordinates must be safe integers` |
| Distance cannot be represented as a safe integer | `Hex distance must be a safe integer` |
| Malformed formation or shape outside lowercase `compact`/`spread` | `Formation shape must be compact or spread` |
| Missing/nonnumeric/fractional/nonfinite orientation or outside 0..5 | `Formation orientation must be an integer from 0 through 5` |
| Negative/fractional/nonfinite/nonnumeric or unsafe Close threshold | `Close threshold must be a nonnegative safe integer` |

`RangeError`, lowercase shape names, safe integer boundaries, and inclusive nonnegative integer threshold validation are P02 implementation choices resolving the plan's public-error contract. Orientation bounds and shape mapping come from the plan. Inputs remain unchanged, including deeply frozen inputs. Exported ring tables, their cells and roster are frozen; results use readonly types, without promising that every returned object is frozen. Link health/eligibility and action accounting are outside P02.

Run the focused contracts from the repository root with `just poc-001-test tests/formation.test.ts`. The suite reports its actual assertion count and uses explicit thresholds for classification so provisional tuning can evolve.

## Command boundary (P03)

P03 is independently reviewed (no blocking findings), accepted, locally delivered. [Independent review](../docs/mailbox/p03-command-boundary/reviewer.md) passes all six criteria; optional O1 effect-hook entity preservation, O2 malformed-payload error precedence, and O3 redundant fixture assertion remain open follow-ups, with no fixes in this delivery. [Plan](../docs/plans/2026-10-02-2dfffcd3-poc-001-command-boundary.md), [handoff](../docs/mailbox/p03-command-boundary/implementer.md), [implementation record](../docs/TASK_LOGS.md#2026-10-04-p03-command-boundary), and [delivery record](../docs/TASK_LOGS.md#2026-10-04-p03-local-delivery) describe its contracts, defaults, and evidence. P04 consumes this boundary for browser maneuvers.

`createInitialState()` in `src/core/state.ts` returns fresh serializable snapshots: revision zero, round one, player phase, Compact orientation zero, three player-owned living Brood with stable roster IDs, and empty statuses/intentions/acted IDs. HP/max HP of one are artificial alive-fixture values, not combat balance. Phases are `player`, `enemy`, `victory`, and `defeat`.

`applyCommand(state, command)` in `src/core/transition.ts` accepts `{kind:'maneuver', expectedRevision, maneuver:'clockwise'|'anticlockwise'|'expand'|'contract'}` through P02 geometry. Success changes formation, spends the shared allowance, increments revision once, and returns `{ok:true,state,events}`. Rejection returns `{ok:false,state,error:{code},events:[]}` with unchanged state/budgets. Errors include `stale-revision`, `wrong-phase`, `maneuver-used`, and `same-shape`. `useAbility` (with actor/ability/target IDs) and `endPhase` always return `unsupported-command`; abilities and budget resets await P07/P08.

`applyActorAction(state, action, rules)` supplies the reusable accounting seam: revision/phase, actor identity/ownership/living status/action budget, then caller-supplied ability/target validation, then a pure entity effect and one action/revision. Hooks cannot return replacement budgets or phase. No ability is registered and the seam is not a player-command alternative. See the handoff for its typed contract, full errors, event fields, and precedence. Run `just poc-001-test tests/commands.test.ts tests/formation.test.ts`; the full suite passes 129 tests, including 37 P03 cases with 253 actual assertions.

## Intent semantics (P05)

P05 supplies pure headless selectors in `src/core/intents.ts` and encounter-centred masks in `src/core/sectors.ts`. Import these exports directly for preview and resolution; downstream modules should consume them rather than reproduce targeting or masks. Damage, enemy intention choice, ability dispatch, and rendering remain with P06–P10. The [P05 plan](../docs/plans/2026-10-02-d66a7452-poc-001-intent-semantics.md) specifies the contracts; [Implementer handoff](../docs/mailbox/p05-intent-semantics/implementer.md) records defaults and verification.

`IntentContext` reuses P03 `GameState`'s `formation` and `brood`, adding `enemies: readonly EnemyState[]`, where an enemy is `{id,hp,facing:Orientation}`. Entity IDs are unique across the encounter, with one player Brood per P02 roster slot. Supply valid typed snapshots; these selectors are not a serialized-state validator. P03's opaque `intentions:string[]` stays unchanged. P05 typed declarations are supplied separately, so callers can compose P03 snapshots with enemy data without changing command accounting.

`Intention` has stable `id` and enemy `sourceId`, and one of these forms:

- `{kind:'fixed-area',cells:readonly Hex[],turnable:boolean}` stores committed cells. Squad maneuvers and repeated queries preserve the declaration.
- `{kind:'marked-hit',targetId}` follows the marked Brood's current position and returns only that living target.
- `{kind:'marked-splash',targetId}` follows that same mark and includes living Brood at distance <= `SPLASH_RADIUS = 2`. `selectRecipients(context,intention,splashRadius)` accepts an explicit nonnegative safe integer radius for experimental tuning.

`selectRecipients` returns `{recipientIds,cells,reason}` in P02 roster order, independent of entity-array order. `cells` is the stored area or current mark anchor. A living source with no area occupants returns `resolved` with an empty recipient list. Missing/fallen sources return `source-missing`/`source-fallen`; missing/fallen marks return `target-missing`/`target-fallen`. These cancelled/fizzled results have empty recipients and cells; a fallen mark cancels its whole splash without retargeting. Positive HP defines living eligibility.

`sectorCells(s)` returns `T[2s],T[2s+1],S[s]`, outer cells first, then the ring-1 cell. The six sectors partition the 18 cells of rings 1–2; only the centre `(0,0)` is outside every mask. `frontMask(f)` concatenates sectors `f,(f+1)%6`: six ordered cells. Facing zero is `T0,T1,S0,T2,T3,S1`; facing five is `T10,T11,S5,T0,T1,S0`. A clockwise turn gives the next front element by element. Facing is an integer 0–5; invalid values throw `RangeError`. Enemies use the centre as a view-only cluster anchor, with no placement rule or selector meaning. Encounter layout remains an open experiment question; this lab renders no enemies.

`turnEnemyClockwise(enemy,intentions)` returns `{ok:true,enemy,intentions,events}` with facing advanced modulo six and only that enemy's turnable fixed-area cells rotated by the P02 axial transform `(-r,q+r)`. Marks, other sources' areas, and non-turnable areas stay unchanged. Events are one `{type:'facing-changed',sourceId,before,after}`, followed by `{type:'intention-turned',intentionId,sourceId,beforeCells,afterCells}` for each changed declaration in input order. A fallen enemy returns `{ok:false,reason:'source-fallen',enemy,intentions,events:[]}`. `turnCellsClockwise(cells)` exports the same pure geometry transform, preserving cell order. P07 owns Crosswind legality and action spending.

`selectProtection(context,{actorId,targetId,bypassProtection},relations)` takes explicit `{sourceId,targetId}` Warder relations. Only living attackers, living protected enemies, and living sources qualify. The attacker's current cell, on either ring 1 or 2, must lie in the source's frontal mask. Contact reach needs no enemy adjacency. The result is `{protected,sourceIds,reason,checks}`; protecting sources are unique and sorted by ID, with no mitigation amount/stacking policy selected here. Global reasons are `actor-unavailable`, `target-unavailable`, `bypassed`, `protected`, or `unprotected`; per-source checks explain `source-missing`, `source-fallen`, `outside-sector`, or `protected`. Bypass ignores directional protection. P06/P07 own mitigation tuning.

`activeLinks(context,closeThreshold)` returns P02 links with `fromId`/`toId`, restricted to living endpoints, in roster-pair order. Close and stretched links both remain queryable; only Close links grant Close eligibility. `isCloseLinked(context,fromId,toId,closeThreshold)` is symmetric and false for self-links/fallen/missing endpoints. `isIsolated(context,broodId,closeThreshold)` means a living Brood has no other living Close neighbor; fallen/missing Brood return false. All three accept P02's explicit nonnegative safe integer threshold and default to `CLOSE_THRESHOLD = 2`.

These are the P05 plan's experimental defaults, chosen to make fixed locations, following marks, explicit turns, and live eligibility distinct and usable by P06. They are not balanced gameplay findings. Readonly outputs may share readonly declaration/ring data; no selector or transform mutates inputs. Run `just poc-001-test tests/intents.test.ts tests/formation.test.ts` for both shapes at all six orientations, every legal maneuver, death, inclusive boundaries, and facing wraparound.

## Damage and Fallen (P06)

P06 supplies pure attack settlement in `src/core/damage.ts` and lifecycle/expiry in `src/core/lifecycle.ts`. The [plan](../docs/plans/2026-10-02-4c3c0d42-poc-001-damage-and-fallen.md) owns the provisional policies; the [Implementer handoff](../docs/mailbox/p06-damage-and-fallen/implementer.md) records acceptance evidence, exact checks, and defaults. Attack creation, ability legality and Shelter application belong to P07; enemy ordering and phase/round transitions belong to P08.

`CombatState` extends P03 `GameState` with `enemies:CombatEnemy[]` (P05 enemy fields plus `maxHp`), `declaredIntentions:Intention[]`, `protections:ProtectionRelation[]`, `shelters:Shelter[]`, and `resolvedAttackIds:string[]`. A Shelter is `{id,sourceId,targetId}`. Typed declarations/effects are separate from P03's opaque string `intentions`/`statuses`; do not encode working combat effects in those labels. Supply valid serializable snapshots with unique entity IDs across both sides, one player Brood per labelled slot, unique Shelter/intention IDs, and safe integer HP/max HP within bounds. P06 does not choose encounter HP or construct an initial encounter.

`applyCommand(combatState,{kind:'attack',expectedRevision,eventId,sourceId,recipientIds,rawDamage,bypassProtection})` dispatches to `applyAttack` and returns P03's `{ok,state,events}` / `{ok:false,state,error:{code},events:[]}` envelope. `applyAttack(state,attack,rules)` also accepts explicit `DamageRules` for experiments. `DEFAULT_DAMAGE_RULES` is `{directionalReduction:2,shelterReduction:2,closeThreshold:CLOSE_THRESHOLD}`. These are provisional values, not balance findings. Attack settlement works in player or enemy phase, advances revision once, records the encounter-scoped event identity, and preserves action/maneuver budgets. Its caller supplies legal recipients from P05 `selectRecipients` at impact (enemy attacks), or P07 ability rules (player attacks); it does not create attacks or repeat targeting geometry. An empty resolved area can settle with no damage. A synthetic packet can hit both sides to exercise terminal precedence.

Before any effects, P06 checks revision, active phase, nonblank event/source/recipient IDs, unique recipients, a boolean bypass flag, nonnegative safe integer damage/tuning, unused event identity, living source, and living recipients. Rejections preserve the exact input state with no events. Errors are `stale-revision`, `wrong-phase`, `invalid-command`, `invalid-amount`, `duplicate-attack`, `unknown-actor`, `fallen-actor`, or `illegal-target`. A basic P03 snapshot without combat fields rejects `attack` as `invalid-command`. A repeated identity rejects even if a later callback supplies a fresh revision. IDs remain recorded until the encounter ends; no animation callback should apply HP separately.

All mitigation uses one pre-hit snapshot. P05 directional protection reduces raw damage by two once (multiple Warders do not stack), then eligible Shelter reduces the remainder by two once (multiple statuses do not stack). Each reduction and final damage clamp at zero; HP clamps to `[0,maxHp]`. Bypass skips directional protection, as in P05; Shelter is independent. Shelter requires living player endpoints and a current Close link through P05 `isCloseLinked`. Every Shelter on a positively hit target is consumed even if ineligible or its reduction is zero; zero raw damage consumes none. A guardian or Warder falling in the same batch still protects that batch. Separate later attacks use the settled state.

Ordered events are `attack-settled` (identity/source/new revision), `damage-applied` per recipient (raw/reductions/final damage and before/after HP), `shelter-consumed`, then lifecycle events: `fallen`, `protection-removed`, `shelter-removed`, `intention-cancelled`, and `combat-ended`. Recipients, Shelter IDs, Fallen IDs and intention IDs use code-point lexical order; protection removals use source then target ID. Exact readonly event fields are exported as `DamageEvent`/`LifecycleEvent`, and are included in P03 `GameplayEvent`. Entity/declaration arrays retain their input order. Recipient iteration order and serialized replay yield identical settlement/events.

`settleLifecycle(before,after)` is the trusted batch seam: it compares positive-to-zero HP transitions, removes effects with unavailable sources/targets, and uses P05 cancellation reasons for intentions. It preserves Brood identities, labelled slots and formation. P05 living selectors and P03 actor guards exclude Fallen entities; P02's geometric links still identify their inert slots. All Brood fallen yields `defeat`; otherwise all enemies fallen yields `victory`; otherwise combat continues. Defeat wins the synthetic all-dead case. Repeated settlement against the resulting snapshot emits no duplicate deaths or cancellations. This helper does not increment revision; the attack/ability caller owns accounting. Terminal command rejection preserves P03's existing error precedence (unsupported `useAbility`/`endPhase` remain explicit).

`expireShelters(state)` is P08's explicit end-of-enemy-phase helper. It removes all remaining Shelters, emits `shelter-removed` events with reason `expired`, and advances revision once if any exist. A repeated call returns the same snapshot with no events or revision change. The helper leaves round, phase and budgets to P08 and does not enforce scheduling itself. All P06 functions accept deeply frozen inputs without mutation and expose serializable results. Run `just poc-001-test tests/damage.test.ts tests/intents.test.ts tests/commands.test.ts` for the focused contracts.

## Brood abilities (P07)

P07 registers the six headless abilities with `applyCommand` for `CombatState`. This supersedes the earlier P03/P06 statements that all `useAbility` commands are unsupported. A basic formation-lab `GameState`, an unregistered ability ID, and `endPhase` retain their explicit `unsupported-command` behavior, including stale/terminal snapshots. Known abilities in combat receive the normal revision/phase/actor guards. No encounter, round driver, UI, preview, or automatic end of player phase is supplied here.

`src/content/brood.ts` owns the frozen definitions and `BROOD_RULES_VERSION = 'p07-v1'`. These are resolved experimental defaults from the [P07 plan](../docs/plans/2026-10-02-f8938420-poc-001-brood-abilities.md), not balance findings:

| Brood | Ability ID | Target and effect |
| --- | --- | --- |
| Ugallu | `claw` | Any living enemy, raw damage 4; P06 directional mitigation applies. |
| Ugallu | `shelter` | Another living Close ally; append one Shelter for the next enemy phase. P06 owns its two-point reduction, positive-hit consumption, impact-time eligibility and expiry. |
| Girtablilu | `sting` | Any living enemy, raw damage 4; P06 directional mitigation applies. |
| Girtablilu | `impale` | Any living enemy, raw damage 6, bypass directional protection; both other Brood must be living and both actual active links Stretched. |
| Pazuzu | `gale` | Any living enemy, raw damage 3, bypass directional protection. |
| Pazuzu | `crosswind` | Living rotatable enemy; one `clockwise` or `anticlockwise` step, no damage. |

`AbilityCommand` from `src/core/abilities.ts` is `{kind:'useAbility',expectedRevision,actorId,abilityId,targetId}` with a required `direction:'clockwise'|'anticlockwise'` for Crosswind only. Existing P03 commands keep their broad ability string type for compatibility; runtime checks reject missing/invalid Crosswind directions and directions on other abilities as `invalid-command`. Ability ownership uses the actor's Brood label, not a hardcoded entity ID. Entity IDs, valid formations, unique labelled Brood and safe HP snapshots retain the P05/P06 caller contract. Every contact attack reaches every living enemy in all twelve formations and leaves the actor's labelled position unchanged.

`abilityLegality(state,action,rules)` returns `{ok:true}` or `{ok:false,error:{code}}` without mutation or spending. `applyAbility(state,action,rules)` uses that same query and the same P03 accounting as dispatch. Optional explicit `AbilityRules` supplies four attack amounts and P06 `DamageRules`; `DEFAULT_ABILITY_RULES` references the content defaults and `DEFAULT_DAMAGE_RULES`, so geometry and mitigation have no competing constants. Nonnegative safe integer tuning is required (`invalid-amount`). Querying an unregistered ability directly returns `illegal-ability`; dispatch retains `unsupported-command` for unregistered IDs. Known wrong-Brood abilities and ineligible Impale return `illegal-ability`; invalid/dead targets and non-rotatable enemies return `illegal-target`. Actor errors retain P03 precedence: revision, phase, identity, ownership, living status, already acted, then ability/target eligibility. Failures return the exact input state and an empty event list.

P03's entity-only `ActionRules` and `applyActorAction` are unchanged public interfaces. The additive `CombatActionRules` / `applyCombatActorAction` adapter shares `actorActionError` and one internal accounting function with them. Effects may return combat collections and lifecycle phase, while accounting restores the input round, formation and maneuver, spends only the actor's action, and sets revision to input plus one. If an effect rejects, the original snapshot and empty events are returned. P06 attack settlement already produces that same revision; accounting sets it rather than incrementing again. Success emits `action-applied` first, then P06 damage/lifecycle events, or `shelter-installed`, or P05 facing/area events. Attacks record a deterministic encounter identity derived from revision, actor ID and ability ID; future round resets must keep revision monotonic. A collision with an already recorded attack rejects as `duplicate-attack`, and a colliding Shelter identity rejects as `invalid-command`, without producing duplicate IDs or spending an action.

`CombatEnemy.rotatable?:boolean` is additive: existing P05 enemies with a valid facing rotate by default; set `false` to make an enemy a legal attack target but an illegal Crosswind target. Missing/invalid facings also reject Crosswind. P05's new `turnEnemy(enemy,intentions,direction)` supplies the signed transform; `turnEnemyClockwise` retains its original behavior. The anticlockwise path composes the existing P05 clockwise cell transform five times, yielding one signed step and one facing event. Only the target enemy's turnable fixed areas change. Marks, other sources, non-turnable areas, enemy HP/max HP and capability data stay unchanged. Protection uses the new facing immediately through P05 at the next hit.

Shelter installation appends exactly one `{id,sourceId,targetId}` and emits `{type:'shelter-installed',shelterId,sourceId,targetId}`. It does not encode working status data in opaque Brood labels. P06 handles later eligibility, source death, consumption and `expireShelters`; P08 must invoke expiry at the end of the enemy phase. An accepted ability spends one actor action/revision even when its hit ends combat. Otherwise player phase continues and the shared maneuver remains available before, between or after all three actions.

Run `just poc-001-test tests/abilities.test.ts` for the P07 contracts and the normal full test/typecheck/build recipes for regression verification. All earlier test files remain unchanged. No browser or human playtest is claimed by this slice.

## Patrol round loop (P08)

P08 adds the deterministic headless ordinary patrol, following the [plan and two-ring amendment](../docs/plans/2026-10-02-dc6612ec-poc-001-patrol-round-loop.md). This section supersedes earlier statements that combat `endPhase` is unsupported or round resets are pending. The browser remains the formation lab; P10 owns the playable interface.

Import `createPatrol(preset?, rules?)`, `createHealthyPatrol`, `createWoundedUgalluPatrol`, or `createWoundedGirtabliluPatrol` from `src/content/patrol.ts`. Presets are `healthy` (default), `wounded-ugallu`, and `wounded-girtablilu`. Unknown presets throw `RangeError`. Each factory returns an independent, serializable `PatrolState`: `CombatState` plus `patrolVersion:'patrol-v1'` and a copied `patrolRules`. Round one starts in player phase, revision zero, Compact0, fresh budgets, empty statuses/Shelters and the full surviving enemy declarations already announced. Brood HP/max HP is Ugallu18, Girtablilu14, Pazuzu14; enemies are Warder12, Censer10, Harrier13. Wounded starts change only Ugallu's HP to7 or Girtablilu's to5, retaining maximum HP. Exported `PATROL_HP`, `WOUNDED_HP` and `DEFAULT_PATROL_RULES` are inspectable provisional content, not balance findings.

Enemies have **no board cell**. `PATROL_VIEW_ANCHOR={q:0,r:0}` is shared presentation data only; no rule reads it. Warder starts facing0, is rotatable by Crosswind and protects Censer while both live. Censer and Harrier are explicitly non-rotatable. Resets never retain HP, facing or effects from another attempt.

`announcePatrol(state)` is a pure, trusted scheduling helper, without revision/budget changes. It announces surviving enemies in `PATROL_ORDER=[warder,censer,harrier]`. Warder marks the first living player Brood in roster order. Censer starts at round-indexed `[girtablilu,pazuzu,ugallu]`, scanning forward for a living candidate. Harrier marks the lowest current/max HP ratio, comparing integer cross products exactly, with roster-order ties. At current defaults the healthy first marks are Ugallu/Girtablilu/Ugallu; wounded Ugallu changes Harrier to Ugallu, wounded Girtablilu changes it to Girtablilu. Declarations use occurrence identities `patrol:<round>:<source>` and update the legacy string `intentions` labels at announcement. Typed `declaredIntentions` are authoritative during play. A command never silently retargets; Fallen marks cancel through P06.

`applyCommand(patrol,{kind:'endPhase',expectedRevision})` calls `endPatrolPhase` in `src/core/rounds.ts`, resolving enemy phase and the next announcement atomically. Player actions may be forfeited. The command advances public revision **once**, including all its P06 hits and Shelter expiry. Each `attack-settled.revision` identifies that same public revision. A stale command returns `stale-revision`; enemy/terminal phase returns `wrong-phase`. Invalid version/declaration shape returns `invalid-command`, invalid numeric rules return `invalid-amount`, and P06 failures retain their codes. Every rejection returns the original state and empty events, including a late hit failure. Basic lab and non-patrol combat snapshots keep `unsupported-command` for `endPhase`.

At impact Warder hits its mark for3, Censer resolves a radius2 marked splash for3, and Harrier hits for4 or7 if isolated **then**. P05 selects recipients/isolation; P06 settles each hit, deaths, cancellations, protection removal and terminal checks before the next enemy. Defeated enemies do not act, cancelled marks do not retarget, terminal outcome stops remaining attacks. Remaining Shelter expires after enemy resolution, even on terminal outcome. A surviving encounter advances one round, resets each living actor's availability (`actedIds=[]`) and the single shared maneuver (`maneuverUsed=false`), then announces new marks. Budgets do not bank. HP, formation, facing and attack identity history persist. Terminal states retain their round/budgets and receive no announcement.

`PatrolRules` supplies `warderDamage`, `censerDamage`, `harrierDamage`, `isolatedHarrierDamage`, `splashRadius`, `closeThreshold` and nested P06 `damageRules`. All must be nonnegative safe integers. Defaults inherit P05 radius/Close threshold and P06 mitigation rather than copying them. Explicit rules are saved in the snapshot; P07's ability rules retain their existing separate boundary. As with P06/P07, callers supply valid snapshots with unique identities, valid roster/HP/formation and increasing safe integer round/revision; no serialized-state parser is introduced.

Events are `enemy-phase-started`, ordered P06 damage/lifecycle events, remaining Shelter expiry, `enemy-phase-ended`, and, for nonterminal rounds, `round-started` followed by `intentions-announced` carrying the entire declaration set. Exported `RoundEvent` extends `GameplayEvent` additively. End phase is synchronous and headless; animation must consume returned events, never apply their HP effects again. Frozen inputs and serialized replay are supported. Run `just poc-001-test tests/patrol.test.ts tests/abilities.test.ts tests/damage.test.ts`; executed ordinary runs and the criterion mapping are in the [P08 handoff](../docs/mailbox/p08-patrol-round-loop/implementer.md).

## Evidence and limitations

P02 candidate/tested revision is `3570610406886f18ca08c51effc79b3e8f3ddd34` on local branch `p02-formation-algebra`. The [P02 Implementer handoff](../docs/mailbox/p02-formation-algebra/implementer.md) records all six acceptance criteria, exact ring indices, defaults, and actual orientation-zero outputs; [verification](../docs/mailbox/p02-formation-algebra/verification.md) records command output. Focused tests pass 90 tests/3,349 assertions; full regression passes 92 tests including unchanged P01 coverage. Typecheck/build pass. Browser rendering remains the P01 placeholder; no P02 browser or human playtest was run. Review, Coordinator acceptance, and master delivery are pending.

See the [Implementer handoff](../docs/mailbox/p01-browser-harness/implementer.md) and [verification record](../docs/mailbox/p01-browser-harness/verification.md) for the exact committed revision, clean reinstall, deliberate test failure, wrapper probes, and actual automated browser captures. These checks are not human playtests or combat acceptance. Vite reports the expected large Phaser bundle warning; no optimization or gameplay was added. The [independent review](../docs/mailbox/p01-browser-harness/reviewer.md) found no issues; the Coordinator accepted P01 criteria 1–7. Local delivery is recorded in [TASK_LOGS](../docs/TASK_LOGS.md#2026-10-04-p01-local-delivery).

## Formation lab (P04)

The initial lab setup is P03's fresh Compact orientation-zero snapshot. Hover or keyboard-focus a maneuver to see labelled destination ghosts; click or press Enter to commit through the same core transition. Escape or Cancel preview clears ghosts. A committed maneuver spends the one shared allowance, disabling all maneuver buttons with a visible explanation. Reset lab restores the original fixture, clearing previews and selection. The **Test setup — fresh lab fixture** selector offers all twelve labelled formations and creates a fresh setup with an unused allowance; it is a laboratory action, not an in-game action or round reset.

Click or keyboard-select a Brood token to inspect its coordinates, shape and orientation. Solid links are Close, dashed links are Stretched; their labels and exact distances also appear in the Live links readout. Images stay upright as anchors change. Dragging tokens and clicking empty cells provide no movement. No attack, combat preview, phase advance, enemy action, translation, or independent Brood movement is exposed.

Enable **Placeholder mode — labels only**, or open `?placeholder=1`, to skip emblem image requests and use labelled geometric tokens. A failed runtime image request falls back to the same identifiable token; inspection and maneuvers remain available. The six patrol emblems can be inspected under **Emblem credits & patrol reference**; they are a reference gallery, not spawned enemies. Credits, source/license links and bundled copies accompany the emblems.

The prototype-local `scripts/prepare-assets.mjs` runs before dev/build (explicitly chained in the scripts so both entry points enforce it). It validates SHA-256 against root `assets/manifest.json` and copies only seven allowlisted SVGs into generated, ignored `public/tehom/tokens/`, plus `public/tehom/CREDITS.md` and `public/tehom/licenses/game-icons-license.txt`. Missing or corrupt sources fail before replacing generated output. Root masters are never written. Builds serve the copies at relative `tehom/` URLs; no external image server is used. Preview serves the already-prepared build.

The 19-cell board uses a 120 px pitch about stage origin `(380,295)` in the 760×610 stage. The initial layout targets 1280×800 desktop. Mobile layout, animation, final art, combat and human playtest conclusions remain outside P04. View/session/projection contracts are covered by `tests/view.test.ts`; asset output and negative preparation cases by `tests/asset-copy.test.ts`. Browser evidence and the acceptance mapping belong to [the P04 Implementer handoff](../docs/mailbox/p04-formation-lab/implementer.md). Existing historical P01/P02 evidence below refers to those earlier revisions.

## Preview equivalence (P09)

`src/core/preview.ts` exports `previewCommand(snapshot, command, sessionGeneration)`.
It clones the plain snapshot and command, invokes the real `applyCommand`, and
recursively freezes the returned projection. Success exposes the exact immediate
`state` and `events`, before/after selector facts (destination positions, living
links, protection, Shelter eligibility, distinct area/mark recipients, and each
ability/target/direction's legality), HP/status deltas, protection gained/lost,
enabled/disabled abilities and the actual events as change explanations.
Rejections expose the same error and empty events, with no projection or forecast.
No preview spends live budgets or delivers events to a live event/audio consumer.

The provisional P09 projection choice is an isolated real transition plus existing
P02/P05/P07 selectors, as proposed by the P09 plan; there is no parallel damage
calculator. The conditional forecast is labelled **If end phase now** and runs
P08's real `endPhase` on another copy of the immediate candidate. Its `state` and
`events` are the complete real result; `enemyEvents` excludes next-round
announcements and round start. Unchosen player actions are excluded. A terminal
candidate has `kind:'terminal'` and no forecast events; formation-only and plain
combat snapshots have `kind:'unavailable'`. An end-phase rejection remains an
explicit rejected forecast rather than successful enemy consequences.

The P09 stale-session choice is a monotonically increasing UI generation on reset
or fresh fixture, together with the command's original expected revision.
`previewValidity` and `LabSession.confirmPreview` reject a previous generation
(`stale-session`) or changed revision (`stale-revision`) before confirmation.
Confirmation submits the stored original command against live state. Every
accepted command clears the pending maneuver; cancellation clears only ephemeral
selection of a maneuver. These choices follow P09's proposed implementation and
prevent cached candidate assignment or same-revision reuse after reset.

The default P04 formation lab still supports its original twelve fixtures. Open
`/?preview=patrol` for a bounded P09 patrol preview fixture with the same maneuver
controls, immediate HP, links/protection/recipient changes, ability changes and
conditional HP forecast. It supports an actual maneuver preview/commit pair;
full combat controls and the playable patrol remain P10. The public model supports
all P03/P08 commands, including all six abilities and rejected commands.

Run `just poc-001-test tests/preview.test.ts tests/patrol.test.ts tests/intents.test.ts`.
The additive `tests/browser-preview.mjs` probe checks the patrol preview fixture;
run it with Bun, Chrome path and a temporary output directory, like the unchanged
P04 `tests/browser-lab.mjs` probe. See the
[P09 handoff](../docs/mailbox/p09-preview-equivalence/implementer.md) for executed
verification, decision sources and criterion evidence. No human playtest is claimed.

## Playable patrol (P10)

Open `/?play=patrol` to play the healthy, wounded-Ugallu or wounded-Girtablilu
patrol. The default route remains the P04 lab, and `/?preview=patrol` remains the
P09 maneuver fixture. Choose a Brood, one of its two abilities, and a target;
hover or keyboard focus a target to inspect the immediate result and **If end
phase now** forecast, then use **Confirm ability**. Crosswind exposes both turn
directions. Hover/focus a shared maneuver to preview; click/Enter commits it.
**End phase (N actions unused)** forfeits remaining actions and shows ordered
enemy resolution in the expandable last-action log. Unavailable controls show
the core rejection reason. Escape/Cancel clears a preview. Restart or selecting
a preset creates a completely fresh patrol, including after victory or defeat.

`CombatScene` consumes P09 `previewFacts` and `previewCommand` through a thin
`PatrolSession`, which reuses `LabSession.confirmPreview`. All gameplay still
passes through P03/P08 `applyCommand`; presentation never applies damage.
A 400 ms feedback lock serializes input. Reset clears its timer and changes the
session generation, so old completion work cannot change the fresh battle.
Selecting a creature, ability or target spends nothing. The combat route has no
formation fixture, translation, individual movement or additional ability.

The two-ring board uses the existing axial pixel projection and emblem assets.
Enemies share the view-only centre anchor, with offsets Warder `(-44,-29)`,
Censer `(44,-29)`, Harrier `(0,37)` pixels. These offsets have no core meaning.
Brood use their projected cells; enemies and adjacent ring-1 Brood have separate
pointer targets. Upright emblems, HP/name labels, textual links, numbered marks
and core front masks remain readable with `&placeholder=1` or the placeholder
checkbox. Placeholder mode makes no token-image requests; failed images retain
labelled geometry. Credits and the bundled license remain visible.

After `just poc-001-build`, run all browser checks with local Bun 1.4.2 and Chrome:

```sh
POC001_CHROME=/path/to/chrome-headless-shell just poc-001-test-browser
```

The browser wrapper starts/stops the default Docker preview on port 4173 and
runs the unchanged `browser-lab.mjs`, unchanged `browser-preview.mjs`, and new
`browser-patrol.mjs` in sequence through the prototype-local `test:browser`
script. The CDP driver uses host Chrome/Bun; application serving and application
checks use the Docker wrapper. No browser dependency is added. Put Bun on PATH.
Optional arguments are `CHROME_PATH OUTPUT_DIRECTORY [BASE_URL]`; supplying a
base URL uses an already-running server. `POC001_BROWSER_PORT` chooses the
wrapper-owned preview port. Output defaults to a fresh OS temporary directory.
Individual scripts take the same Chrome/output/base-URL arguments.

Activation belongs to its control: a focused maneuver keeps its own command when
another maneuver is hovered, and Confirm uses the selected ability, target and
Crosswind direction. Its label identifies that selection. A matching cached
preview retains P09's stale guards; a different preview cannot replace the action.

The P10 probe replays all four recorded P08 command sequences in both artwork
modes against a runtime core oracle with the same current rules as the page.
It checks both accepted and unavailable steps without freezing historical final
HP, outcome or command legality. Separate intercepted test pages use explicit
encounter rules and HP to demonstrate victory and defeat through those controls.
The probe also covers mixed focus/hover activation, previews, double input,
disabled reasons, early phase ending, reset, terminal restart and cluster hit-tests.
Another intercepted page supplies fixed-area and following declarations to the
same scene; ordinary P08 patrols only declare following marks. These entries
are under `tests/browser/`, are absent from the production build, and have no
product route or fixture control.
The controller's injectable factory is also covered at its public boundary for
stale revision/session rejection and timer cancellation. See the
[P10 handoff](../docs/mailbox/p10-playable-patrol/implementer.md) for tested
revisions, commands, screenshots and limitations. Automated browser play is not
a human playtest.

## Reproducible attempts (P11)

On `?play=patrol`, **Export attempt (JSON)** downloads the current attempt locally,
including an empty, partial or terminal attempt. Restart and preset changes begin
a fresh record. Only commands accepted by the P10 adapter are appended; selections,
previews, unavailable controls, stale confirmations and feedback-lock duplicates
are excluded. No record or observation is sent over the network.

```sh
just poc-001-replay /path/to/poc-001-attempt.json
```

The root recipe delegates through the prototype's ordinary pinned Bun/Docker
wrapper. The named record is mounted read-only; replay's Docker container has no
network. The CLI reads that file once, validates JSON and the supported versions,
then invokes the same public transitions (`applyAbility` with stored tuning for
abilities; `applyCommand` for maneuvers and phase ending). Success prints command
and event counts, revision, round and phase. Errors exit 1 with a specific schema,
version, rejection or divergence reason; wrapper/usage errors exit 2. Replay never
imports code, opens paths or follows URLs from record fields. A supplied build SHA
is metadata, not executable code or an instruction to fetch/check out a revision.
No import UI, migration or replay timeline is provided.

P11 resolves its schema and evidence defaults explicitly:

| Default / value | Source and reason |
| --- | --- |
| Record version `1`; prototype `poc-001-linked-formation` | P11 plan's proposed v1 schema; a strict local envelope gives unsupported records an explicit failure. |
| Rules version `poc-001-rules-v1/patrol-v1/p07-v1` | P11 semantic envelope plus the P08/P07 version owners. Bump the envelope for geometry, legality, resolution or event-order changes; no silent migration. Numeric tuning alone is captured separately. |
| Build revision: full Git SHA, otherwise `unknown` | P11 plan. The wrapper injects HEAD for a clean prototype build/dev run; changed/untracked prototype files or unavailable Git produce `unknown`. Static preview retains the revision embedded when built. |
| Fixture ID: `healthy`, `wounded-ugallu`, `wounded-girtablilu` | P08 factories; the actual serialized initial state is authoritative, including explicit experimental overrides. |
| Configuration: all patrol numbers, all ability damage numbers, both mitigation rule sets | P08 state's `patrolRules` and P07 `DEFAULT_ABILITY_RULES` at attempt start. Capturing both prevents later provisional default changes from altering replay. Semantic ability ownership/bypass rules remain covered by the rules version. |
| Initial state; accepted command + expected/resulting revision + ordered events per step; final state + ordered event list | P11 required exact replay and P10 accepted-command boundary. Step events locate the first divergence; the final summary proves state and overall event order. Snapshots are detached copies. Object-key ordering is immaterial. |
| Player command kinds only: maneuver, useAbility, endPhase | P10 controls; raw internal attack commands cannot be exported as player inputs. Unknown fields, malformed payloads and invalid numeric rules fail rather than being corrected. |
| Filename `poc-001-attempt.json`, formatted UTF-8 JSON | P11 local export default; a fixed name carries no person identifier or timestamp. Rename downloads to preserve multiple attempts. |
| Observations outside the record; no optional text fields, identities or wall-clock timestamps | P11 allows separately entered observations; the existing playtest template keeps observations, tester explanations and interpretation distinct without collecting personal data. |
| Boss gate **HOLD** until actual human attempts support an independent review opening it | P11 gate contract: absent/inconclusive evidence cannot open the gate. Automated verification establishes reproducibility, not enjoyment or comparative combat value. |

`tests/run-record.test.ts` verifies explicit P08 winning/forfeit traces, stored
alternate tuning, all factory starts, reset/rejection and specific failures.
`test-browser` adds `browser-run-record.mjs` after the three unchanged P01–P10
browser scripts. It uses native controls and actual downloaded files for all
three presets, compares against current transitions, and checks reset and rejected
inputs without fixing provisional outcomes. Browser output stays in the supplied
scratch directory. These runs are automated, not human playtests.

The [P11 evidence artifact](../docs/playtests/2026-10-05-poc-001-p11-automated.md)
records the build/conditions and HOLD gate. No fair Apex/Shadow comparison or
production-combat selection has been completed. Human attempts and independent
Reviewer confirmation remain necessary before boss work is authorized.
