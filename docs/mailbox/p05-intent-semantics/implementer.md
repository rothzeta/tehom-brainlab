task: P05-impl
status: complete
outcome: P05.C1–C4 and acceptance criteria 1–6 implemented and verified; independent review pending.
role: implementer
source_baseline: 0d6f23368f3cf21d1d14bc9bf0e8be34c0daff12
candidate_revision: a95944723194b07f050f44e760f0f752df068ed7
tested_revision: a95944723194b07f050f44e760f0f752df068ed7
artifacts:
  - docs/mailbox/p05-intent-semantics/assignment-implementer.md
  - docs/mailbox/p05-intent-semantics/implementer.md
  - poc-001-linked-formation/src/core/intents.ts
  - poc-001-linked-formation/src/core/sectors.ts
  - poc-001-linked-formation/tests/intents.test.ts
  - poc-001-linked-formation/README.md
verification:
  - "just poc-001-install: exit 0 with sandbox escalation; frozen Bun 1.4.2 Docker install."
  - "just poc-001-test tests/intents.test.ts tests/formation.test.ts: exit 0 at candidate; 165 tests, 4152 actual assertions (P05 75/803, P02 90/3349)."
  - "just poc-001-test: exit 0 at candidate; 204 tests across four files; P05 803, P02 3349, P03 253 instrumented assertions; P01 two tests without assertion-count instrumentation."
  - "just poc-001-typecheck: exit 0 at candidate."
  - "just poc-001-build: exit 0 at candidate; existing Phaser chunk-size warning only."
  - "git diff --check 0d6f23368f3cf21d1d14bc9bf0e8be34c0daff12..HEAD and git diff --check: exit 0 at candidate."
  - "PATH=/home/metatron/.bun/bin:$PATH bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p05-intent-semantics/implementer.md --repo /opt/dev/tehom-brainlab-p05: exit 0; ok true, three revisions resolved, no diagnostics."
review: not-run
discoveries:
  - "P03 has opaque intention labels and no enemy collection. P05 composes a separate IntentContext with typed declarations without extending or changing P03 state/commands."
  - "Docker access, worktree Git-index writes, and ignored validator dependency installation required successful sandbox escalation. Application checks stayed in Docker mode."
  - "Prototype README's existing P02 status/evidence still says review/delivery pending, contrary to CURRENT; only the assigned P05 public-contract section was added."
  - "Assignment BASE prefix 0d6f2335 does not resolve; supplied worktree actually started at 0d6f23368f3cf21d1d14bc9bf0e8be34c0daff12. Actual baseline is recorded above; assignment was preserved unchanged."
blockers: []

Author: P05 Implementer. Date: 2026-10-04 UTC. Worktree `/opt/dev/tehom-brainlab-p05`, branch `p05-intent-semantics`. Governing [assignment](assignment-implementer.md), [P05 plan](../../plans/2026-10-02-d66a7452-poc-001-intent-semantics.md), [testing policy](../../adr/0006-contract-invariants-and-black-box-testing.md), and [handoff protocol](../../../.agents/skills/ruach-handoff/SKILL.md).

The technical candidate above contains four files. The later report-creating commit includes only this report and the unchanged assignment; its SHA is returned in the terminal handoff. No merge or push occurred. No independent review or Coordinator acceptance is claimed.

## Changes and scope

- [sectors.ts](../../../poc-001-linked-formation/src/core/sectors.ts): C1 ordered encounter-centred sectors/front masks, facing validation, and the P02-convention clockwise axial transform.
- [intents.ts](../../../poc-001-linked-formation/src/core/intents.ts): C2 declarations, live recipients/protection/links/isolation and machine-readable explanations; C3 explicit facing/turnable-area transform and ordered events.
- [intents.test.ts](../../../poc-001-linked-formation/tests/intents.test.ts): C4 independent masks/position/recipient tables, all twelve formation states, maneuvers, deaths, inclusive boundaries, custom IDs, array reordering, wraparound, and input purity.
- [README P05 public contracts](../../../poc-001-linked-formation/README.md#intent-semantics-p05): selector input/output domains, ordering, cancellation, protection, explicit-turn events, and experimental defaults.

P02/P03 exports supply ring order, formation/links, Brood IDs and state, and real maneuver commands. No existing P01–P03 tests or core modules changed. No edits to view/main/assets/runtime/toolchain/dependencies, generated agent definitions, protected CURRENT/TASK_LOGS, or plans/index. P03 optional O1–O3 remain open and unchanged. No damage, AI, ability dispatch, or rendering implementation.

## Acceptance evidence

All 75 P05 tests passed with **803 actual matcher assertions**, summed from Vitest `assertionCalls`. Expected mask/position/recipient tables are independently transcribed; they do not call production selectors to construct expectations. Query/transform inputs are recursively frozen, with explicit before/after comparisons in the twelve-state tests.

| Criterion | Observable evidence in executed tests |
| --- | --- |
| 1 | Six `AC1: sector and ordered front` cases compare full cells/order to hand-written ring-index fixtures. Facing 0 is exactly R[0,1,2,3,4,5]; facing 5 is exactly R[15,16,17,0,1,2]. Each sector is its first three indices. |
| 2 | Twelve `AC2/3` cases run P03 `applyCommand` for clockwise, anticlockwise, and each valid shape change, checking successful results, unchanged stored area cells and the independently specified recipient IDs at the destination. Compact 0 expansion changes area recipients from all three to Ugallu; Compact 1 clockwise changes all three to none. |
| 3 | The same twelve cases verify a direct Girtablilu mark before/after every legal maneuver, its exact current anchor from the independent slot table, and splash membership: all living Brood in Compact at radius 2, only Girtablilu in Spread. Querying another target leaves all declarations unchanged. Explicit radius fixtures test inclusion at distance 2 and exclusion beyond radius 1. |
| 4 | Twelve `AC4: explicit turn` cases assert facing 0→1, R[0..5]→R[3..8], exact facing/intent events and independently specified recipients. Marks, non-turnable areas and another source's area are preserved. Six additional facing cases verify every facing transition, including 5→0, with marked-hit and marked-splash declarations belonging to the turned source retaining their target IDs. |
| 5 | `AC5` verifies zero-HP sources cancel all three intention kinds (`source-fallen`, empty recipients/cells); zero-HP Girtablilu fizzles both mark kinds and the whole splash (`target-fallen`) even with living nearby alternatives. Zero-HP non-marked Brood are excluded from splash/area recipients. Fallen explicit-turn sources emit no events. Missing sources/marks have explicit explanations. |
| 6 | Twenty-four `AC6` cases cover both shapes × six orientations, with all alive and with fallen Girtablilu. Every roster ID's protection, source IDs, isolation and Ugallu Close relation are checked against explicit expectations; remaining pair lists/order and Close/stretched classification are checked. A lone-survivor fixture verifies isolation and no active links. Additional fixtures cover living-source/designated-living-target requirements, fallen/missing attackers/targets/sources, bypass, source-centred geometry after turning, source deduplication, custom IDs and entity/relation array reordering. Frozen inputs plus full comparisons establish purity. |

## Resolved provisional defaults

P05 owns these families under the [index ownership table](../../plans/README.md#ownership-of-provisional-defaults). Values below are experimental rules, not balance or playtest findings. Numeric HP 10 in tests is an artificial living fixture; P08 still owns encounter HP.

| Choice / implemented value | Source | Reason |
| --- | --- | --- |
| Sector s = R[3s,3s+1,3s+2]; front f = sectors f and (f+1)%6 | P05 Fixture and inputs, adopted unchanged; P02 supplies R | Six equal outer sectors and six-cell fronts, including contractual wrap/order; one mask source for all consumers. |
| Encounter-centred masks; ignore enemy visual anchors | P05 Fixture and Proposed implementation | Protection is determined by current player ring cells without inventing sprite-relative cones. |
| Fixed area stores explicit cells plus a required turnable boolean | P05 Required contracts / Proposed implementation | Maneuvers/previews cannot rewrite commitments; explicit turning is opt-in. |
| Direct mark keeps stable target ID; splash uses target's current anchor and inclusive radius 2 | P05 Proposed implementation, adopted unchanged | Makes target-following distinct from fixed locations. `SPLASH_RADIUS` is exported; explicit radius argument permits tuning tests/consumers. |
| HP > 0 means living; fallen source cancels; fallen mark fizzles entire splash, no retargeting | P05 Proposed implementation / AC5; existing P03 eligibility | Avoids dead actors, replacement targets, and orphaned splash. Missing entities also return empty results with distinct reasons as a defensive selector choice. |
| Recipient IDs in P02 roster order, independent of entity-array order; area returns declared cells, mark returns current anchor | P05 Required ordered recipients/explanations; P02 stable roster | A single predictable preview/resolution boundary; no damage or event timing implied. |
| Explicit clockwise facing +1 mod 6; rotate only matching source's turnable fixed areas via (-r,q+r) | P05 Settled choices / Proposed implementation; P02 coordinate convention | Crosswind changes the named source's commitments intentionally; non-turnable areas and marks stay intact. Fallen sources return a no-op failure. |
| Facing event first; changed-intention events in input declaration order, carrying before/after cells | P05 Proposed implementation requires facing/intent-change event; exact payload/order is P05 API choice | Consumers can explain each explicit geometry change without deriving it again. |
| Protection relation is explicit sourceId→targetId; both living, living Brood attacker in source front, bypass disables | P05 Proposed implementation, adopted unchanged | Usable by P06/P07 at impact, independent of enemy adjacency; no mitigation amount assigned here. |
| Protection reports unique source IDs in lexical order and per-source explanations | P05 Required explanations; ordering/deduplication is P05 API choice | Deterministic eligibility independent of relation array order; leaves stacking/mitigation to P06. |
| Active links retain P02 roster-pair order and Close/stretched state but exclude any fallen endpoint | P05 Proposed implementation; P06 dead-link eligibility context | Both visible states remain usable; fallen endpoints cannot grant effects. P02 still provides the full geometric links for inert visual markers. |
| Isolation = living Brood with no other living Close endpoint; fallen/missing returns false | P05 Proposed implementation, adopted; fallen-query value is explicit P05 choice | Eligibility describes living targets. A lone survivor is isolated even in Compact. |
| Close defaults to P02 `CLOSE_THRESHOLD` 2; active/Close/isolation queries accept an explicit threshold | P02-owned threshold, reused | Avoids another hidden constant and permits tuning without changing geometry. |
| Separate `IntentContext` and declarations; P03 `GameState` unchanged | Existing P03 state; assignment permits only necessary state extensions | Enemy selector data and typed commitments compose with P03 without broadening command/accounting work. P06/P08 can adopt these exported types. |
| Valid typed snapshots with globally unique entity IDs and one player entity per roster slot | Existing P02/P03 domain, documented P05 input precondition | Keeps selectors small; arbitrary serialized-state validation belongs at a future command/input boundary. |
| Facing 0..5, safe nonnegative integer radii/thresholds; RangeError on invalid explicit values | P02 public validation convention; exact P05 validation choice | Consistent boundary behavior; no silent normalization. Readonly output sharing is permitted; inputs are never mutated. |

## Verified recipient/turn examples

These values are asserted by the executed production-selector tests, using source Warder HP 10/facing 0 and living Ugallu/Girtablilu/Pazuzu unless specified. IDs below abbreviate U/G/P only for readability.

| State/action | Area cells / recipients | Mark and splash |
| --- | --- | --- |
| Compact 0, declared area facing 0 | R[0..5] / [U,G,P] | G anchor R[1]=(2,1); direct [G], splash [U,G,P] |
| Expand to Spread 0 | Same stored R[0..5] / [U] | Same G ID, current anchor R[6]=(-3,3); direct [G], splash [G] |
| Compact 1 → clockwise Compact 2 | Stored R[0..5] stays fixed; [U,G,P] → [] | Same G ID; anchor R[4]=(-1,3) → R[7]=(-3,2); direct [G], splash [U,G,P] |
| Explicit Warder turn at Compact 2 | Facing 0→1; turnable R[0..5]→R[3..8]; []→[U,G,P] | Marks unchanged; non-turnable R[0..5] unchanged |
| Explicit facing wrap | Facing 5→0; R[15,16,17,0,1,2]→R[0,1,2,3,4,5] | Marked target IDs unchanged |
| Compact 0 with G fallen | Stored area still R[0..5], recipients [U,P]; active link only U↔P, Close | Direct/splash G mark both fizzle with empty recipients; no substitution |
| Fallen Warder | `source-fallen`, empty recipients/cells; no directional protection | No explicit turn events |

## Commands, results and limitations

All application commands ran from the worktree root using default Docker mode (official pinned Bun 1.4.2). The final-candidate checks were run **after** the technical commit; no code/test/README change followed them.

| Exact command | Result |
| --- | --- |
| `just poc-001-install` | Initial sandbox attempt exit 1, inaccessible Docker; escalated retry exit 0, frozen lockfile, 43 installed packages. |
| `just poc-001-test tests/intents.test.ts tests/formation.test.ts` | Exit 0 before commit, then exit 0 at final candidate; 165 tests / 4,152 instrumented assertions each run. |
| `just poc-001-test` | Exit 0 at candidate; 204 tests (75 P05, 90 P02, 37 P03, 2 P01). P02/P03/P05 counters report 4,405 assertions combined; P01 has no assertion-count instrumentation. |
| `just poc-001-typecheck` | Exit 0 before commit and at candidate; source/tests/configuration checked. |
| `just poc-001-build` | Exit 0 at candidate; existing >500 kB Phaser chunk warning; no browser check. |
| `git diff --check 0d6f23368f3cf21d1d14bc9bf0e8be34c0daff12..HEAD` | Exit 0 at candidate, covers all committed implementation changes. |
| `git diff --check` | Exit 0 at candidate. |
| `git diff --name-only 0d6f23368f3cf21d1d14bc9bf0e8be34c0daff12..HEAD` | Exit 0; only the four assigned technical paths listed above. |
| `/home/metatron/.bun/bin/bun install --frozen-lockfile` in `.agents/skills/ruach-handoff` | Initial sandbox exit 1 (read-only node_modules); escalated retry exit 0, six ignored dependency packages. Generated tracked skill files unchanged. |
| `PATH=/home/metatron/.bun/bin:$PATH bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p05-intent-semantics/implementer.md --repo /opt/dev/tehom-brainlab-p05` | Exit 0; `ok: true`, all three revision fields resolve, diagnostics empty. Bun's directory was added to PATH only for the standalone validator. |

Git's initial staging attempt exited 128 because the worktree index is in `/opt/dev/tehom-brainlab/.git/worktrees/tehom-brainlab-p05`; escalation allowed the authorized branch-local technical commit. No host-mode fallback occurred for application checks.

Assignment preserved byte-for-byte; SHA-256: `1c9f00618b26f2367c23ebbe0f64df83c9424e123f8e85d2a5fca57e754f6830`.

The assignment's abbreviated BASE `0d6f2335` is a typo: `git rev-parse --verify '0d6f2335^{commit}'` exits 128. The supplied branch/worktree started at the full actual baseline in the structured block (`0d6f2336…`), which was used for every diff; no baseline or branch was changed to compensate.

No browser check is required or claimed for this headless slice. No human playtest, mutation-testing run, P06 damage, P07 dispatcher, P08 intention choice, or P10 rendering is verified. Existing README P02 status/evidence paragraphs appear stale relative to CURRENT; proposed correction for the Coordinator is to reconcile those paragraphs using the existing P02 delivery evidence, outside this P05-owned section. No blockers remain.
