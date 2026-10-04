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

Development serves <http://localhost:5173>; built preview serves <http://localhost:4173>. Stop a server with Ctrl-C. Build before preview. Both render `TEHOM — Formation Lab`, a 37-cell Phaser canvas board, and native inspection/maneuver controls. There is no backend, credentials, or external runtime asset service. Generated asset URLs use `base: './'` for static subdirectory hosting.

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

- `Hex`, `validateHex`, `hexDistance`, `boardCells`, `OUTER_RING`: integer axial coordinates, validation, distance, the fixed 37-cell board, and the exact clockwise 18-cell ring R. Board enumeration order is unspecified; ring indices are contractual.
- `Brood`, `Shape`, `Orientation`, `Formation`, `Position`, `Link`, `ROSTER`, `CLOSE_THRESHOLD`: readonly types and the fixture constants.
- `validateFormation`, `formations`, `formationPositions`, `formationLinks`, `rotateClockwise`, `rotateAnticlockwise`, `expandFormation`, `contractFormation`: validation, twelve labelled states, derived positions/links, and pure transitions.

Use `{ shape: 'compact' | 'spread', orientation: 0 | 1 | 2 | 3 | 4 | 5 }`. Every caller supplies an explicit formation; this module chooses no default initial state. Positions are `{brood, cell: {q,r}}` in `[ugallu, girtablilu, pazuzu]` order. For orientation `o`, Compact uses R indices `3o+[0,1,2]`, Spread `3o+[0,6,12]`, modulo 18. Spread states with the same unlabelled occupied-cell set retain their different labelled assignments. Clockwise adds one orientation modulo six; anticlockwise subtracts one. Expansion and contraction preserve orientation and identity; applying either to its destination shape keeps that shape.

The experimental convention uses downward-positive screen vertical coordinates. A compatible projection is `(q + r/2, sqrt(3)*r/2)`; `(-r,q+r)` is one clockwise 60-degree turn. Pixel scale and origin belong to the future renderer. Distance is `max(abs(dq),abs(dr),abs(dq+dr))`. The fixed centre is `(0,0)`, radius three, with no translation or independent movement (plan Fixture and Settled choices; brief Formation rules).

Links return `from`/`to` labelled positions, integer `distance`, and `state: 'close' | 'stretched'`, in roster-pair order `(0,1), (0,2), (1,2)`. `formationLinks(formation, closeThreshold)` accepts an explicit nonnegative safe integer threshold, defaulting to `CLOSE_THRESHOLD = 2`. Close means distance <= threshold; Compact distances are `[1,2,1]`, Spread `[6,6,6]`. Threshold two and the coordinate presets are experimental/provisional, from the plan and brief's Links section; they are not balanced gameplay findings.

Public validation throws `RangeError` synchronously and never clamps, rounds, coerces, or normalizes invalid inputs. Error messages are:

| Invalid input | Message |
| --- | --- |
| Malformed coordinate, fractional/nonfinite/nonnumeric or unsafe `q`/`r` | `Hex coordinates must be safe integers` |
| Distance cannot be represented as a safe integer | `Hex distance must be a safe integer` |
| Malformed formation or shape outside lowercase `compact`/`spread` | `Formation shape must be compact or spread` |
| Missing/nonnumeric/fractional/nonfinite orientation or outside 0..5 | `Formation orientation must be an integer from 0 through 5` |
| Negative/fractional/nonfinite/nonnumeric or unsafe Close threshold | `Close threshold must be a nonnegative safe integer` |

`RangeError`, lowercase shape names, safe integer boundaries, and inclusive nonnegative integer threshold validation are P02 implementation choices resolving the plan's public-error contract. Orientation bounds and shape mapping come from the plan. Inputs remain unchanged, including deeply frozen inputs. Exported ring cells and roster are frozen; results use readonly types, without promising that every returned object is frozen. Link health/eligibility and action accounting are outside P02.

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

`sectorCells(s)` returns R indices `3s,3s+1,3s+2`. `frontMask(f)` returns sectors `f,(f+1)%6`, preserving clockwise order from facing `f`; facing zero is indices 0–5, facing five is 15,16,17,0,1,2. Facing is an integer 0–5; invalid values throw `RangeError`. Interior enemy coordinates are visual anchors and do not change these masks.

`turnEnemyClockwise(enemy,intentions)` returns `{ok:true,enemy,intentions,events}` with facing advanced modulo six and only that enemy's turnable fixed-area cells rotated by the P02 axial transform `(-r,q+r)`. Marks, other sources' areas, and non-turnable areas stay unchanged. Events are one `{type:'facing-changed',sourceId,before,after}`, followed by `{type:'intention-turned',intentionId,sourceId,beforeCells,afterCells}` for each changed declaration in input order. A fallen enemy returns `{ok:false,reason:'source-fallen',enemy,intentions,events:[]}`. `turnCellsClockwise(cells)` exports the same pure geometry transform, preserving cell order. P07 owns Crosswind legality and action spending.

`selectProtection(context,{actorId,targetId,bypassProtection},relations)` takes explicit `{sourceId,targetId}` Warder relations. Only living attackers, living protected enemies, and living sources qualify. The attacker's current ring cell must lie in the source's frontal mask. Contact reach needs no enemy adjacency. The result is `{protected,sourceIds,reason,checks}`; protecting sources are unique and sorted by ID, with no mitigation amount/stacking policy selected here. Global reasons are `actor-unavailable`, `target-unavailable`, `bypassed`, `protected`, or `unprotected`; per-source checks explain `source-missing`, `source-fallen`, `outside-sector`, or `protected`. Bypass ignores directional protection. P06/P07 own mitigation tuning.

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

## Evidence and limitations

P02 candidate/tested revision is `3570610406886f18ca08c51effc79b3e8f3ddd34` on local branch `p02-formation-algebra`. The [P02 Implementer handoff](../docs/mailbox/p02-formation-algebra/implementer.md) records all six acceptance criteria, exact ring indices, defaults, and actual orientation-zero outputs; [verification](../docs/mailbox/p02-formation-algebra/verification.md) records command output. Focused tests pass 90 tests/3,349 assertions; full regression passes 92 tests including unchanged P01 coverage. Typecheck/build pass. Browser rendering remains the P01 placeholder; no P02 browser or human playtest was run. Review, Coordinator acceptance, and master delivery are pending.

See the [Implementer handoff](../docs/mailbox/p01-browser-harness/implementer.md) and [verification record](../docs/mailbox/p01-browser-harness/verification.md) for the exact committed revision, clean reinstall, deliberate test failure, wrapper probes, and actual automated browser captures. These checks are not human playtests or combat acceptance. Vite reports the expected large Phaser bundle warning; no optimization or gameplay was added. The [independent review](../docs/mailbox/p01-browser-harness/reviewer.md) found no issues; the Coordinator accepted P01 criteria 1–7. Local delivery is recorded in [TASK_LOGS](../docs/TASK_LOGS.md#2026-10-04-p01-local-delivery).

## Formation lab (P04)

The initial lab setup is P03's fresh Compact orientation-zero snapshot. Hover or keyboard-focus a maneuver to see labelled destination ghosts; click or press Enter to commit through the same core transition. Escape or Cancel preview clears ghosts. A committed maneuver spends the one shared allowance, disabling all maneuver buttons with a visible explanation. Reset lab restores the original fixture, clearing previews and selection. The **Test setup — fresh lab fixture** selector offers all twelve labelled formations and creates a fresh setup with an unused allowance; it is a laboratory action, not an in-game action or round reset.

Click or keyboard-select a Brood token to inspect its coordinates, shape and orientation. Solid links are Close, dashed links are Stretched; their labels and exact distances also appear in the Live links readout. Images stay upright as anchors change. Dragging tokens and clicking empty cells provide no movement. No attack, combat preview, phase advance, enemy action, translation, or independent Brood movement is exposed.

Enable **Placeholder mode — labels only**, or open `?placeholder=1`, to skip emblem image requests and use labelled geometric tokens. A failed runtime image request falls back to the same identifiable token; inspection and maneuvers remain available. The six patrol emblems can be inspected under **Emblem credits & patrol reference**; they are a reference gallery, not spawned enemies. Credits, source/license links and bundled copies accompany the emblems.

The prototype-local `scripts/prepare-assets.mjs` runs before dev/build (explicitly chained in the scripts so both entry points enforce it). It validates SHA-256 against root `assets/manifest.json` and copies only seven allowlisted SVGs into generated, ignored `public/tehom/tokens/`, plus `public/tehom/CREDITS.md` and `public/tehom/licenses/game-icons-license.txt`. Missing or corrupt sources fail before replacing generated output. Root masters are never written. Builds serve the copies at relative `tehom/` URLs; no external image server is used. Preview serves the already-prepared build.

The initial layout targets 1280×800 desktop. Mobile layout, animation, final art, combat and human playtest conclusions remain outside P04. View/session/projection contracts are covered by `tests/view.test.ts`; asset output and negative preparation cases by `tests/asset-copy.test.ts`. Browser evidence and the acceptance mapping belong to [the P04 Implementer handoff](../docs/mailbox/p04-formation-lab/implementer.md). Existing historical P01/P02 evidence below refers to those earlier revisions.
