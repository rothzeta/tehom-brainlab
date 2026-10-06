# POC 001 — bounded implementation plan index

*2026-10-06: P12 is superseded by user decision and P13–P17 (the boss experiments) are added. See [Boss experiments (P13–P17)](#boss-experiments-p13p17). The status summary below is the record as of 2026-10-05, retained as history; the execution map carries current status.*

Twelve plans for the linked-formation prototype (P01 implemented, independently verified/reviewed and accepted; P02 implemented, independently verified/reviewed at `803da5df5f34b387be3bb5ccce3cd7cbd733f90b` after R1 resolution, accepted by the Coordinator, and locally delivered at `7e964c30a29abd1fb10613713bc205ef037b1f80`; P03 independently reviewed (no blocking findings), accepted, locally delivered; P04 implemented, independently reviewed (no blocking findings; optional O1 open), accepted, locally delivered; P05 implemented, independently reviewed (no findings), accepted, locally delivered; P06 implemented, independently reviewed (blocking R1 fixed and re-reviewed; no remaining findings), accepted, locally delivered; P07 implemented, independently reviewed (R1 fixed and re-reviewed; no remaining findings), accepted, locally delivered; P08 implemented, independently reviewed (no findings), accepted, locally delivered; P09 implemented, independently reviewed (R1/R2 fixed and re-reviewed; no remaining findings), accepted, locally delivered; P10 implemented, independently reviewed (R1/R2 fixed and re-reviewed; no remaining findings), accepted, locally delivered; P11 implemented, independently reviewed (no findings), accepted, locally delivered with boss gate HOLD because no human playtest attempts are recorded; P12 draft, blocked by the HOLD gate; CT implemented, independently reviewed (no findings), accepted, locally delivered; TR implemented, independently reviewed (no findings), accepted, locally delivered; RF implemented, independently reviewed (no blocking findings), accepted, locally delivered), written on 2 October 2026 against repository baseline `79f9498051df0281e6e9d3c904e9eee32f014873`.

**This is a navigation and authority note, not a thirteenth implementation plan.** Adding these documents does not implement the prototype, approve new game rules, or constitute a playtest. No package installation, application build, unit test suite, or browser combat test was run as part of drafting.

## Authority and source limits

Plans and standalone tasks follow the local [ADR-0002 filename rule](../adr/0002-plan-filenames.md) and [ADR-0003 bounded writing format](../adr/0003-implementation-plan-writing.md). Read [CURRENT](../CURRENT.md) and actual source before execution; the Coordinator records executed evidence in [TASK_LOGS](../TASK_LOGS.md) from worker handoffs.

The drafts originally used user-supplied excerpts labelled ADR-0007 and ADR-0008 because the referenced local files were absent at their baseline. On 3 October, the user's vault instruction established local ADRs adapted from `../enoch`. These local records now replace the unavailable references. Existing filenames already comply, so their 2 October creation dates and eight-character random hexadecimal identifiers are retained. Delivery order is expressed by P01–P12 and dependency links, not filename sorting.

At drafting, each plan was a proposed standalone task with an unassigned implementer/integration-owner role and stable sequential checkpoint identifiers. The acceptance criteria and verification sections define its task contract. The index describes a proposed delivery sequence; writing a plan does not complete its prerequisites or approve its provisional game rules.

Grounding sources:

- [Repository working guidance](../../AGENTS.md).
- [POC 001 design brief](../../docs/prototypes/poc-001-linked-formation.md).
- [Direction ADR](../adr/0004-repository-and-poc-direction.md).
- [Prototype architecture and starting status](../../poc-001-linked-formation/README.md).
- [Actual shared asset manifest](../../assets/manifest.json) and [credits](../../assets/CREDITS.md).
- [Existing playtest report structure](../../docs/playtests/TEMPLATE.md).

The original fixed Apex/Shadow direction is not silently promoted back into this prototype. Conversely, these plans do not promote the new formation experiment to the production combat system.

## Reading the contracts

**Settled choices** are constraints already stated in the inspected sources or the user's instruction: the accepted POC scope, no walking/translation, shared maneuvers, engine-independent rules, existing assets, and the requested document format.

**Required contracts** describe what must be observably true to accept the bounded implementation. Some are engineering invariants proposed by the plan; those are identified locally. The draft contracts alone are not claims that an implementation satisfies them; P01–P03 now link their executed evidence and distinguish review/delivery status.

**Proposed implementation / experimental defaults** fill explicitly open implementation details such as coordinate presets, mask boundaries, damage values, targeting ties, and defeat behavior. They are recommendations for executable fixtures, not historical decisions or balanced gameplay. Resolve/amend them explicitly at implementation start; a change affecting another plan requires reconciling that dependent plan's fixtures and tests, not creating a second hidden constant.

Source/test file paths listed as proposed ownership describe planned paths at drafting; P01–P03 now have implementations. At the original planning baseline the prototype had folders and a README, not a working TypeScript application. Commands in verification sections become executable only after the prerequisite plan supplies their scripts.

The user's 3 October tooling preference supersedes the original npm proposal: use Bun with a prototype-local `bun.lock`, prefer Docker where useful, and orchestrate commands through the root justfile. Run `just poc-001-*` recipes from the repository root; P01 now supplies the install/dev/typecheck/test/build/preview recipes; P10 now supplies `just poc-001-test-browser`; P11 now supplies `just poc-001-replay`. Keep implementations in the prototype's `scripts/` and executable entry points in its `bin/`. The current root justfile also retains repository tooling checks and the existing asset exporter.

## Execution map

| ID | Plan | Bounded outcome | Direct prerequisites |
|---|---|---|---|
| P01 | [Browser harness](2026-10-02-a87b131a-poc-001-browser-harness.md) | Independently install, run, test, and build one browser shell. Implemented, independently verified/reviewed and accepted. | None |
| P02 | [Formation algebra](2026-10-02-2e228a2b-poc-001-formation-algebra.md) | Preserve twelve labelled, reversible formations on 37 cells (19 cells after Amendment TR, not yet implemented). Implemented, independently verified/reviewed after R1 fix, accepted, and locally delivered. | P01 |
| P03 | [Command boundary](2026-10-02-2dfffcd3-poc-001-command-boundary.md) | Reject illegal/stale commands without spending resources or mutating state. Independently reviewed (no blocking findings), accepted, locally delivered. [Review](../mailbox/p03-command-boundary/reviewer.md); O1–O3 open optional follow-ups. [Evidence](../mailbox/p03-command-boundary/implementer.md). | P01, P02 |
| P04 | [Formation lab](2026-10-02-9d81c6df-poc-001-formation-lab.md) | Inspect, preview, commit, and reset formation-only interaction. Implemented, independently reviewed (no blocking findings; optional O1 open), accepted, locally delivered. [Evidence](../mailbox/p04-formation-lab/implementer.md); [integration](../mailbox/p04-formation-lab/integration.md); [review](../mailbox/p04-formation-lab/reviewer.md). | P01, P02, P03 |
| P05 | [Intent semantics](2026-10-02-d66a7452-poc-001-intent-semantics.md) | Keep fixed areas, following marks, and explicit facing changes distinct. Implemented, independently reviewed (no findings), accepted, locally delivered. [Evidence](../mailbox/p05-intent-semantics/implementer.md); [review](../mailbox/p05-intent-semantics/reviewer.md). | P02, P03 |
| P06 | [Damage and Fallen](2026-10-02-4c3c0d42-poc-001-damage-and-fallen.md) | Settle a hit and its lifecycle consequences deterministically. Implemented, independently reviewed (blocking R1 fixed and re-reviewed; no remaining findings), accepted, locally delivered. [Implementation](../mailbox/p06-damage-and-fallen/implementer.md); [integration](../mailbox/p06-damage-and-fallen/integration.md); [R1 fix](../mailbox/p06-damage-and-fallen/fix-r1.md); [review](../mailbox/p06-damage-and-fallen/reviewer.md). | P03, P05 |
| P07 | [Brood abilities](2026-10-02-f8938420-poc-001-brood-abilities.md) | Execute six actions without adjacency-created dead turns. Implemented, independently reviewed (R1 fixed and re-reviewed; no remaining findings), accepted, locally delivered. [Implementation](../mailbox/p07-brood-abilities/implementer.md); [fix](../mailbox/p07-brood-abilities/fix.md); [traces](../mailbox/p07-brood-abilities/traces.json); [review](../mailbox/p07-brood-abilities/reviewer.md). | P03, P05, P06 |
| P08 | [Patrol round loop](2026-10-02-dc6612ec-poc-001-patrol-round-loop.md) | Run the ordinary patrol headlessly to victory or defeat. Implemented, independently reviewed (no findings), accepted, locally delivered. [Evidence](../mailbox/p08-patrol-round-loop/implementer.md); [review](../mailbox/p08-patrol-round-loop/reviewer.md). | P05, P06, P07 |
| P09 | [Preview equivalence](2026-10-02-d28ae958-poc-001-preview-equivalence.md) | Make combat previews match real transitions without mutation. Implemented, independently reviewed (R1/R2 fixed and re-reviewed; no remaining findings), accepted, locally delivered. [Implementation](../mailbox/p09-preview-equivalence/implementer.md); [fix](../mailbox/p09-preview-equivalence/fix.md); [review](../mailbox/p09-preview-equivalence/reviewer.md). | P04, P08 |
| P10 | [Playable patrol](2026-10-02-e7c77542-poc-001-playable-patrol.md) | Play all three patrol starts through the real browser interface. Implemented, independently reviewed (R1/R2 fixed and re-reviewed; no remaining findings), accepted, locally delivered. [Implementation](../mailbox/p10-playable-patrol/implementer.md); [fix evidence](../mailbox/p10-playable-patrol/fix.md); [review](../mailbox/p10-playable-patrol/reviewer.md). | P04, P08, P09 |
| P11 | [Reproducible playtests](2026-10-02-825a6700-poc-001-reproducible-playtests.md) | Local attempt export/replay and explicitly automated evidence. Implemented, independently reviewed (no findings), accepted, locally delivered. Boss gate **HOLD**: no human playtest attempts recorded. [Implementation](../mailbox/p11-reproducible-playtests/implementer.md); [review](../mailbox/p11-reproducible-playtests/reviewer.md); [artifact](../playtests/2026-10-05-poc-001-p11-automated.md). On 2026-10-06 the user lifted the boss gate by explicit decision after their manual RF round. The recorded gate stays HOLD; it is not marked PASS. | P10 |
| P12 | [Directional boss](2026-10-02-a18d7fe6-poc-001-directional-boss.md) | Test one boss using the same combat contracts. **Superseded by user decision, 2026-10-06; never implemented.** Replaced by P15 and P17. | P10, P11 with open gate |
| CT | [Compact triangle](2026-10-04-fb4bf201-poc-001-compact-triangle.md) | Amendment task (2026-10-04, user decision): Compact becomes a true triangle (two outer-ring Brood, Pazuzu on ring 2, all links distance 1) across P02 mapping, P05 sectors and the P04 lab. Inward exposure, Pazuzu-inward slot and mid-side placement were accepted by the user on 2026-10-04. Implemented, independently reviewed (no findings), accepted, locally delivered. [Evidence](../mailbox/compact-triangle/implementer.md); [review](../mailbox/compact-triangle/reviewer.md). Amends P02/P04/P05 and assesses P06 (no change). Geometry superseded by TR; its accepted decisions still apply. | P02, P04, P05, P06 |
| TR | [Two-ring board](2026-10-04-d005e5f4-poc-001-two-ring-board.md) | Amendment task (2026-10-04, user decision): the arena becomes the centre plus two rings (19 cells). Compact stays a true triangle (two Brood on ring 2, Pazuzu on ring 1), and Spread uses three ring-2 corners at distance 4. Sectors cover rings 1–2, and the lab renders 19 cells. The sector-aligned Compact placement (superseding CT mid-side), corner Spread and the view-only centre enemy anchor are accepted user decisions (2026-10-04). Lab spacing is a provisional view choice, and encounter layout is an open experiment question. Implemented, independently reviewed (no findings), accepted, locally delivered. [Evidence](../mailbox/two-ring-board/implementer.md); [review](../mailbox/two-ring-board/reviewer.md); [design](../mailbox/two-ring-board/architect.md). Amends P02/P04/P05 and assesses P06 (no change), with notes in P08/P10/P12. | P02, P04, P05, P06, CT |
| RF | [Ring formation](2026-10-05-c6399cb6-poc-001-ring-formation.md) | Amendment task (2026-10-05, user decision): Compact on alternating ring-1 cells around the empty centre, Expand one radial step to the corners, the centre reserved for a boss, and enemies on real tiles whose front and protection follow their tile and facing. Also accepted on 2026-10-05: one alternating patrol layout for all presets (clustered "flank" layout next), no numeric tuning change, and no generic reach rule (reach will be ability-specific, designed with the abilities). The Architect's provisional proposals cover the enemy cells (centre plus ring-2 edges) and the translated front. It also fixes AI-playtest bugs B1–B3. Implemented, independently reviewed (no blocking findings), accepted, locally delivered. [Implementation](../mailbox/ring-formation/implementer.md); [fix](../mailbox/ring-formation/fix.md); [review](../mailbox/ring-formation/reviewer.md); [design](../mailbox/ring-formation/architect.md). Amends P02/P05/P08/P09/P10/P11, assesses P04/P06/P07 (no rule change), adds a boss-tile note to P12, and supersedes the TR Compact mapping and enemy anchor. | P02–P11, TR |
| P13 | [Independent maneuver budgets](2026-10-06-e8cec63d-poc-001-split-maneuver-budgets.md) | One rotation and one shape change per player phase, each with its own allowance. Accepted for implementation (2026-10-06); not implemented. | P03, P04, P08–P11, RF |
| P14 | [Tactical kit revision](2026-10-06-6a0ebcdc-poc-001-tactical-kit-revision.md) | Shelter 4 and self-target, Impale without bypass and with one living partner, Crosswind unchanged. Accepted for implementation; not implemented. | P06, P07, P09–P11, RF |
| P15 | [Two-phase central boss](2026-10-06-6dcd120b-poc-001-two-phase-central-boss.md) | The Crucible: an anchored centre boss with radial and angular threats and a 50% phase change, at `?play=crucible`. Adds the encounter registry and shared end phase. Accepted for implementation; not implemented. | P13, P14 |
| P16 | [Enemy repositioning](2026-10-06-27ca8f17-poc-001-enemy-repositioning.md) | Designated enemies relocate between rounds along the six edge slots, and threats follow their new tile. Accepted for implementation; not implemented. | P15 (P16.C1 may start earlier) |
| P17 | [Roaming boss and adds](2026-10-06-79371edf-poc-001-roaming-boss-and-adds.md) | The Collector: a roaming boss with a range-bound Warder and a Censer, at `?play=collector`. Includes the [combined manual-test checklist](2026-10-06-79371edf-poc-001-roaming-boss-and-adds.md#combined-manual-test-checklist-user-round-after-p17). Accepted for implementation; not implemented. | P14, P15, P16 |

Task CT is an amendment of delivered P02/P04/P05 rather than a new capability; it is locally delivered before P07 so later plans build on the triangle geometry. Task TR is likewise an amendment, locally delivered before P07 so that later plans build on the two-ring board. Task RF amends delivered P02–P11 after the 2026-10-05 AI playtests; it is implemented, independently reviewed (no blocking findings), accepted and locally delivered. Further patrol playtests and P12 use its contracts. P01–P04 produce the first interactive formation lab. P05–P09 complete the headless patrol rules and full preview invariant. P10 now makes all three patrol presets playable and supplies `just poc-001-test-browser`. P11 now supplies `just poc-001-replay` and explicitly automated evidence; it is implemented, independently reviewed (no findings), accepted and locally delivered. The independently confirmed boss gate is **HOLD** because no human playtest attempts are recorded. P12 remains blocked until actual human evidence supports an explicitly opened gate. Completing documentation, compiling code, or passing unit tests does not automatically open that gate.

*2026-10-06 (user decision):* after playing the RF build, the user lifted the boss gate explicitly and superseded P12 with P13–P17. The historical HOLD above is not reinterpreted as PASS.

## Ownership of provisional defaults

| Decision family | Single owning plan |
|---|---|
| Axial convention, board radius, ring tables (since Amendment TR: ring 2 `T` and ring 1 `S`), labelled shape mapping, Close threshold, Brood/enemy cell kinds (`ENEMY_CELLS`, Amendment RF) | P02 |
| Public command shape, revision checks, rejection semantics, action accounting (maneuver allowances: see P13) | P03 |
| Sector masks, fronts measured from an enemy's tile, marks, cancellation, active-link/isolation selectors (Amendment RF; the view-only centre anchor of 2026-10-04 is superseded) | P05 |
| Hit batching, mitigation, Shelter consumption, Fallen slots, terminal precedence (Shelter amount and self-Shelter eligibility since P14; objective victory since P17) | P06 |
| Six player ability effects and numeric defaults (revised kit: P14) | P07 |
| Patrol HP, intention order, target ties, wounded presets, round cadence, enemy cells and facings (Amendment RF) | P08 |
| Preview projection, conditional forecast, stale-session handling | P09 |
| Attempt-record schema and evidence hand-back (per-encounter codecs since P15) | P11 |
| ~~Boss HP, two-intention pattern, facing cadence~~ (superseded 2026-10-06) | ~~P12~~ |
| Maneuver categories, per-phase allowances and their reset | P13 |
| Revised kit: Shelter amount and targets, no stacking, Impale bypass and partner rule | P14 (values in `src/content/brood.ts` and `DEFAULT_DAMAGE_RULES`) |
| Encounter registry and routes; Crucible HP, threshold, beat table, facing cadence, self-guard | P15 |
| Relocation trait, route order, fallback, timing, living-only occupancy | P16 |
| Collector cells, HP, damage, facings, ward range, sweep facing choice, objective victory | P17 |

Fixtures may use artificial values to isolate an invariant; those unit-test values are not competing encounter tuning. Put implemented defaults in local content/core owners and make the view consume them. Do not add a shared engine or cross-prototype dependency to implement this series.

## Boss experiments (P13–P17)

### Authority and changed scope

The user's finding after playing the RF build, 2026-10-06: "the proto is fine, the patrols and their attack pattern did not require making use of movement." The cause is confirmed in source: patrol targeting reads no positions (`announcePatrol`: "no rule reads enemy coordinates"). The Warder marks the first living Brood in roster order, the Censer cycles, and the Harrier picks the lowest HP ratio.

An external design review proposed P13–P17 as draft PR #1, at `71cc26c`, from source inspection only, with no build, tests or browser. The user accepted it on 2026-10-06 ([brief Decision record](../prototypes/poc-001-linked-formation.md#decision-record)):

1. **P13–P17 are the roadmap, and P12 is superseded.** The user lifted the P11 boss gate by explicit decision, based on their manual RF round. The historical gate stays HOLD; it is not marked PASS.
2. **All of P13–P17 are built before the user's next manual round.**
3. **The drafts' numbers are provisional defaults, implemented as written** and kept in their owning content/core modules. Tests must not freeze them.

Standing direction still applies:

- Darkest Dungeon rather than XCOM: positional ranks, not puzzle movement.
- The Brood never walk individually; only the shared maneuvers move them.
- The centre is reserved for a boss.
- There is no generic reach rule; reach is ability-specific.

The Architect checked each draft against source on 2026-10-06 and made it executable. Each plan lists its corrections under "Review corrections to the draft"; the [design report](../mailbox/boss-experiments/architect.md) summarizes them. The separate draft index was folded into this section and removed.

### Settled, provisional and proposed

- **User decisions:**
  - two boss encounters, one central and two-phase, one roaming with adds;
  - only enemies relocate;
  - rotation and shape change are not mutually exclusive;
  - a small, tactically useful kit;
  - P12 superseded.
- **Provisional defaults (as written):**
  - one rotation plus one shape change per player phase, both refreshing every round;
  - Shelter 4 and self-target;
  - Impale 6 without bypass, needing one living partner;
  - Crucible HP 60, phase two at 30 from the next declaration, and its beat table and facing cadence;
  - the six-slot route and between-round timing;
  - Collector HP, damage and add composition.

  Owners are in the table above.
- **Architect proposals (provisional until the manual round):**
  - encounter routes `?play=crucible|collector`;
  - record codecs selected by rules version;
  - the representation choices in each plan;
  - the Collector Warder facing 4, Censer facing 0 and boss initial facing 0, which the drafts left open.

### Design rationale and failure probes (recomputed)

The Architect recomputed every geometric claim with a disposable script outside the repository:

- Both shapes place the Brood 120° apart (0°, 120° and 240° at orientation 0). Orientation `o` puts one Brood in each of sectors `o`, `o+2` and `o+4`.
- A centre two-sector front therefore holds exactly one living Brood in all 72 facing and formation cases. Rotation chooses the victim; it cannot reduce the count.
- A single sector holds one Brood or none, and a same-parity fork two or none, by orientation parity. Ring-1 and ring-2 pulses test shape: all three or none.
- Impale combined 6 damage with bypass while Gale also bypasses. P14 removes Impale's bypass before adding systems. Shelter is strengthened as a test, not declared balanced, and one casualty no longer disables Impale.
- Every-round allowances could make evasion effortless. Do not restore the shared allowance or add cooldowns before the manual round observes that.
- Computed results for the manual round:
  - [X-H1–X-H4](2026-10-06-6dcd120b-poc-001-two-phase-central-boss.md#balance-hypotheses-computed-for-the-manual-round): with the drafted cadence, a static formation dodges every Crucible primary in each phase. A one-line lever is recorded but not applied.
  - [R-H1–R-H5](2026-10-06-79371edf-poc-001-roaming-boss-and-adds.md#balance-hypotheses-computed-for-the-manual-round): the Collector's ward blinks in and out of range on alternate rounds, and its sweep is always dodgeable with one maneuver.

### Sequencing and parallelism

Dependency order: **P13 → P14 → P15 → P16 → P17**, with two permitted overlaps.

| Pair | Verdict | Reason |
|---|---|---|
| P13 / P14 | **May run in parallel** on separate branches; integrate one after the other | Source ownership is disjoint. P13 owns `state.ts`, `transition.ts`, `rounds.ts`, `run-record.ts`, `lab-state.ts` and `FormationLab.ts`; P14 owns `brood.ts`, `abilities.ts`, `damage.ts` and `preview.ts`. Shared files, all with disjoint hunks: the prototype `README.md` (different sections), `tests/abilities.test.ts` (P13 rule-M lines; P14 K1–K3), `src/view/CombatScene.ts` (allowance line; ability rule line) and the `tests/rf-contracts.test.ts` version literal (P13 R1 composes it; P14 K4 only if P14 lands first). Merge whichever is ready first, rebase the other, and rerun full verification on the combined revision. |
| P14 / P15 | Sequential | P15 needs the P14 kit version in its rules string and edits `preview.ts` after P14 |
| P13 / P15 | Sequential | P15's shared end phase resets both P13 flags (`rounds.ts`), and both edit `run-record.ts` and `CombatScene.ts` |
| P15 / P16 | **P16.C1 may overlap P15**; P16.C2–C4 sequential | P16.C1 touches only `state.ts` (`mobile?`; P15 leaves it alone), the new `enemy-movement.ts` and a new test file. Integration needs P15's skeleton in `rounds.ts`, its `run-record.ts` codecs and `CombatScene.ts` |
| P16 / P17 | Sequential | P17 consumes relocation and edits `state.ts`, `run-record.ts`, `encounters.ts` and `CombatScene.ts` after P16 |

Shared files that force the sequence: `src/core/run-record.ts` (P13, P15, P16, P17), `src/view/CombatScene.ts` (all five), `src/core/rounds.ts` (P13, P15, P16), `src/core/state.ts` (P13, P16, P17), `src/core/encounters.ts` (P15, P17), `src/core/preview.ts` (P14, P15) and the prototype `README.md` (all five).

### Records and rules versions (decision)

**Old records are rejected with the explicit `unsupported rules version: …` error, never migrated.** They stay replayable at their embedded build revision. This includes any export from the user's RF round. `RECORD_VERSION` stays `1` throughout: the envelope keys never change, and the rules version identifies the encounter and its semantics, as in [P11 Amendment RF](2026-10-02-825a6700-poc-001-reproducible-playtests.md#amendment-rf-2026-10-05--rules-version-and-enemy-cells).

| After | Patrol | Crucible | Collector |
|---|---|---|---|
| BASE (`71cc26c`) | `poc-001-rules-v2/patrol-v2/p07-v1` | — | — |
| P13 | `poc-001-rules-v3/patrol-v2/p07-v1` | — | — |
| P14 | `poc-001-rules-v3/patrol-v2/p14-v1` | — | — |
| P15 | unchanged | `poc-001-rules-v3/crucible-v1/p14-v1` | — |
| P16 | unchanged (no record changes meaning) | unchanged | — |
| P17 | unchanged | unchanged | `poc-001-rules-v3/collector-v1/p14-v1` |

### Common execution rules

- Each plan enumerates its test-update exception and the suites expected to pass unedited. Any other failing assertion is a stop condition.
- Verification runs `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build` and `just poc-001-test-browser` at one candidate revision. Run them **bare**, with no `POC001_CHROME`, `CHROME_PATH` or other hand-set override. Add `just poc-001-replay` on fresh exports, and inspect the screenshots named in the plan.
- Assertions must not freeze provisional tuning. Every plan has an explicit criterion for this, because the P07, P09 and P10 reviews blocked on it.
- Workers report in `docs/mailbox/<task>/implementer.md` with a validated ruach-handoff block. The Coordinator alone updates CURRENT and TASK_LOGS.
- The user's round after P17 uses the [combined manual-test checklist](2026-10-06-79371edf-poc-001-roaming-boss-and-adds.md#combined-manual-test-checklist-user-round-after-p17).

Not included: extra Brood, grid enlargement, player walking, forced pursuit, a generic movement engine, procedural encounters, campaign, Revelation, new asset purchases or final art.

## Execution and hand-back discipline

Before each plan, re-read the actual target branch and affected files. Confirm prerequisites have delivered their specified outputs; writing a predecessor plan is not completing it. Keep unrelated work intact. Record any divergence from the baseline and reconcile overlapping proposed paths with the real implementation.

For each executed plan, the Coordinator records a dated [task log entry](../TASK_LOGS.md) from worker handoffs, links it from the plan, and updates [CURRENT](../CURRENT.md) when facts change. Workers return the changed paths, exact commands and results, tested commit, fixture/configuration version, observable evidence for the numbered criteria, and remaining blockers. Only mark a check passed when it ran. Browser failures are not covered by unit-test success; human playtest results are not covered by either. Preserve negative findings and distinguish a partial hand-back from a verified capability.

## Deliberately beyond this dozen

Glare/Revelation reintroduction, persistent attrition, a fair Apex/Shadow comparison, campaign structure, additional content, final art, and production-engine selection are not authorized by these plans or by P13–P17. They require later bounded work. The boss alone cannot establish that the new combat is better or that an audience prefers it.
