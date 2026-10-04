task: B-impl / B-fix-R1 / P02 formation algebra implementation and combined verification
status: complete
outcome: Implemented the exact experimental twelve-state formation algebra, corrected blocking test-policy finding R1, and reran all required checks at the corrected committed candidate. Ready for re-review; acceptance and delivery pending.
artifacts:
  - docs/mailbox/p02-formation-algebra/implementer.md
  - docs/mailbox/p02-formation-algebra/verification.md
  - poc-001-linked-formation/src/core/hex.ts
  - poc-001-linked-formation/src/core/formation.ts
  - poc-001-linked-formation/tests/formation.test.ts
  - poc-001-linked-formation/README.md
  - docs/plans/2026-10-02-2e228a2b-poc-001-formation-algebra.md
  - docs/plans/README.md
  - docs/CURRENT.md
  - docs/TASK_LOGS.md
  - docs/prototypes/poc-001-linked-formation.md
  - p02-formation-algebra
verification:
  - P01 prerequisite at BASE: just poc-001-test (two pass) and just poc-001-typecheck, both exit 0 with approved Docker access.
  - just poc-001-test tests/formation.test.ts: exit 0, 90 tests pass, 3349 actual P02 assertions.
  - just poc-001-typecheck: exit 0.
  - just poc-001-test: exit 0, 92 tests pass across two files, including unchanged P01 tests.
  - just poc-001-build: exit 0, existing large Phaser chunk warning.
  - git diff --check: exit 0.
  - Reordered Formation property overlay at corrected candidate: exit 0, all 90 tests and 3349 assertions pass; original assertion reproduced exit 1 with one failure.
  - Initial-candidate pinned Bun guarded import and orientation-zero JSON capture: exit 0, no browser global access; production geometry remains unchanged.
discoveries:
  - R1 was an incidental JSON property-order dependency in enumeration membership; canonical shape/orientation keys now compare only contractual content. No other assertion with that dependency was found.
  - Docker is inaccessible inside the filesystem sandbox; approved daemon access made both unchanged BASE prerequisites pass.
  - Several Spread states share occupied-cell sets but retain different labelled assignments; enumeration keeps all twelve.
  - Initial clockwise test expectations distinguished JavaScript negative zero from zero; corrected incidental comparison without changing exact geometry invariants.
  - During this task the unrelated versioned-agent-skills-handoff worktree advanced independently to b12aa88be63a5ea0aa4dbbb1e9953661ce4cd947; it was left untouched.
blockers: []
candidate_revision: 29d9616f2ebdb69c83d12f66089495bca6f7f723
tested_revision: 29d9616f2ebdb69c83d12f66089495bca6f7f723
source_baseline: e3f60372a5fef279f92ed14caead48271247405f

Author: B-impl / B-fix-R1 Implementer. Date: 2026-10-04 UTC. The revisions above already exist and identify the corrected combined application/API/test candidate. The evidence-only successor updates this report, verification, and TASK_LOGS; its SHA is returned in the terminal handoff. No executable, test, runtime, lock, configuration, or CLI changes follow `tested_revision`. Original implementation/tested candidate was `3570610406886f18ca08c51effc79b3e8f3ddd34`; initial evidence head was `fb0a352929e38dab21c9092a8d45246a2a81764d`.

## R1 correction and re-verification

Assignment B-fix-R1 changed only `tests/formation.test.ts` lines 67–68: enumeration membership now compares sets of explicit `${shape}:${orientation}` keys instead of JSON-serialized Formation objects. Length, exact twelve-state membership, distinct labelled configurations, all other exhaustive coverage, and contractual byte-equivalent serialized-position inverse assertions are preserved. No production geometry/API change was necessary. Test/assertion counts remain 90/3,349 focused and 92 full.

Checked every `JSON.stringify` and `serializePositions` assertion in the prototype tests. The remaining position serializations compare byte-equivalent positions after inverse operations (explicit plan requirement) or count distinct labelled mappings; neither compares Formation objects against independently constructed JSON property order. Frozen-input serialization compares the same object before/after for immutability. Object comparisons elsewhere use structural `toEqual`; coordinate keys and ordered roster/link arrays encode contractual values/order. No additional assertion with R1's dependency was found or changed.

Reproduced R1 before editing using a scratch copy of `formation.ts` mounted read-only over the real module, changing only enumeration construction from `{shape, orientation}` to `{orientation, shape}`. The original suite exited 1: 89 pass, one enumeration test fails. After the committed correction, the identical overlay passed all 90 tests/3,349 assertions. Production source files on disk remained unchanged; scratch probes were not committed. [Verification](verification.md#r1-corrected-candidate-verification) records exact commands and outputs.

The Reviewer-owned `reviewer.md` was read but not edited, staged, or committed. Its SHA256 remains `fed11f8aed7e97730199aa8792faccc69bd2697e1026d488d5b905695a840bd7`. This assignment's changed files are the test above, this report, `verification.md`, and `docs/TASK_LOGS.md`. Re-review, Coordinator acceptance, and delivery remain pending; master remains BASE.

## Changes and scope

Added pure [hex geometry](../../../poc-001-linked-formation/src/core/hex.ts), [formation algebra](../../../poc-001-linked-formation/src/core/formation.ts), and [black-box contract tests](../../../poc-001-linked-formation/tests/formation.test.ts) in exactly the proposed P02 layout. No P01 layout adjustment was needed. Published the typed exports, coordinate convention, defaults, and public errors in the [prototype README](../../../poc-001-linked-formation/README.md#formation-algebra-p02). Updated the assigned plan/status/index/current/task-log/brief documentation with implemented and verified facts only. All changed files are listed in `artifacts`.

The branch was created directly from BASE in the main checkout. No integration conflict or merge occurred; master remains BASE. Routing setup, canonical roles/skills, all prior P01 evidence/behavior, and unrelated worktrees are untouched. No push, publication, or deployment occurred. This satisfies the bounded implementation assignment, not independent acceptance.

## Acceptance evidence 1–6

All assertion locations below refer to `tests/formation.test.ts` at `tested_revision`; the [verification record](verification.md) contains exact commands, exit codes, runner output, and limitations.

| Plan criterion | Test and assertion locations | Actual result |
| --- | --- | --- |
| 1. Exactly 37 unique integer cells, 18 outer cells, none outside radius three | `C1: board is exactly the 37 unique integer cells within radius three`, lines 27–35; `C1/C4: all 18 ring indices match R and the downward-screen clockwise convention`, lines 38–47 | Two tests pass; 25 assertions verify board validity, the complete ring set, exact R, and clockwise ordering |
| 2. Twelve labelled mappings, distinct cells, roster order | `C2/C5: enumeration retains twelve unique labelled states including coincident Spread sets`, lines 63–75; twelve `C2: positions match the labelled mapping without overlaps and remain on the ring` cases, lines 80–89 | Enumeration passes; all twelve states equal independent expected R indices in roster order, with three distinct outer cells |
| 3. Exact inverse maneuvers and six turns | Twelve `C3: both inverse rotations and six turns restore serialized positions, including wraparound` cases, lines 92–111; twelve `C3: shape changes preserve orientation and roster order and reverse exactly` cases, lines 114–124 | 24 tests pass; both rotation inverse orders, six clockwise and six anticlockwise turns, shape inverses, and all clockwise coordinate transforms pass |
| 4. Compact Close / Spread Stretched at explicit threshold two | Twelve `C4: links retain endpoints, integer distances and roster-pair order at explicit threshold two` cases, lines 127–140; threshold-boundary test, lines 157–163 | All twelve pass, including orientations 0 and 5; distances [1,2,1] / [6,6,6], all endpoints and three ordered pairs correct; inclusive thresholds 0,1,6 also pass |
| 5. Spread 0 and 2 have coincident sets but different labels | `C2/C5` enumeration test, lines 70–75 | Equal occupied-cell sets, unequal labelled arrays, unchanged roster order; twelve distinct serialized labelled configurations retained |
| 6. Documented errors and deeply frozen inputs unchanged | Twelve `C6: every operation accepts a deeply frozen state without changing it` cases, lines 143–151; eleven invalid-formation cases, lines 166–185; eight invalid-coordinate cases, lines 187–200; frozen/unsafe distance test, lines 202–211; five invalid-threshold cases, lines 214–218 | All pass: seven operations per frozen state, seven public APIs per invalid formation, both distance argument boundaries and validator, exact RangeError type/message, and safe-integer/threshold validation |

P02.C1–C4 are implemented: exact fixtures; public validation/derivation/transitions/links; exhaustive state tests; typed exports and documented downward-screen axial convention. Test name `C1/C4` denotes fixture and coordinate-publication checkpoints; the numbered acceptance criterion 4 is covered by link tests.

## Ring table R

Implemented in `src/core/hex.ts` as a frozen array of frozen axial cells. Index order is contractual:

| Index | (q,r) |
| --- | --- |
| 0 | (3,0) |
| 1 | (2,1) |
| 2 | (1,2) |
| 3 | (0,3) |
| 4 | (-1,3) |
| 5 | (-2,3) |
| 6 | (-3,3) |
| 7 | (-3,2) |
| 8 | (-3,1) |
| 9 | (-3,0) |
| 10 | (-2,-1) |
| 11 | (-1,-2) |
| 12 | (0,-3) |
| 13 | (1,-3) |
| 14 | (2,-3) |
| 15 | (3,-3) |
| 16 | (3,-2) |
| 17 | (3,-1) |

Tests independently transcribe the plan's table (lines 10–15), compare every ring entry/order, assert 18 unique cells, and check each index advanced by three equals the clockwise transform `(-r,q+r)`. Board outer-cell membership is compared as a set; board iteration order is deliberately not fixed.

## Exhaustive coverage and actual counts

Focused runner reports **90 passing tests** and prints **3,349 actual matcher assertions**. Every test uses `expect.assertions`; after each test, the hook sums Vitest's actual `assertionCalls`, then prints the count. Full regression reports **92 passing tests** across two files, adding the two unchanged P01 tests.

| Enumerated boundary | Cases / tests | Matcher assertions |
| --- | --- | --- |
| Board/ring membership and convention | 2 tests; 18 ring transforms | 25 |
| Every ordered board-cell distance pair | 37 x 37 = 1,369 pairs; 1 test | 2,738 |
| Twelve-state enumeration / Spread set coincidence | 1 test | 6 |
| Each of 12 states: mapping, inverse/six-turn rotations, inverse shapes, links, frozen inputs | 12 x 5 = 60 tests; 30 assertions per state | 360 |
| Inclusive explicit thresholds 0,1,6 | 1 test | 3 |
| Invalid formations, all 7 public formation operations | 11 tests; 77 API/input pairs, two error assertions each | 154 |
| Invalid coordinates at validator and either distance argument | 8 tests; 24 API/input pairs, two error assertions each | 48 |
| Frozen coordinates / unsafe computed distance | 1 test | 5 |
| Invalid link thresholds | 5 tests | 10 |
| Total focused suite | 90 tests | 3,349 |

For each state, rotations are checked in both directions, both inverse orders, and six-turn cycles both ways. Orientation 5 -> 0 clockwise and 0 -> 5 anticlockwise are included for both shapes. All expand/contract destinations preserve orientation/order; Compact expand-contract and Spread contract-expand restore byte-equivalent serialized labelled positions. Already-destination shape transitions remain in that shape. Frozen formation inputs are flat readonly shape/orientation objects, so freezing the object freezes the entire input; coordinate inputs are likewise deeply frozen.

## Serialized orientation-zero examples

Actual implementation output captured at initial candidate `3570610406886f18ca08c51effc79b3e8f3ddd34` using pinned Bun, a read-only source mount, no network, and throwing browser-global guards. Command and exit 0 are in [verification](verification.md#actual-orientation-zero-capture-and-guarded-import). Both examples use the provisional default threshold two. Production modules are byte-identical at the corrected candidate; this historical capture was not rerun for R1.

Compact:

```json
{"formation":{"shape":"compact","orientation":0},"positions":[{"brood":"ugallu","cell":{"q":3,"r":0}},{"brood":"girtablilu","cell":{"q":2,"r":1}},{"brood":"pazuzu","cell":{"q":1,"r":2}}],"links":[{"from":{"brood":"ugallu","cell":{"q":3,"r":0}},"to":{"brood":"girtablilu","cell":{"q":2,"r":1}},"distance":1,"state":"close"},{"from":{"brood":"ugallu","cell":{"q":3,"r":0}},"to":{"brood":"pazuzu","cell":{"q":1,"r":2}},"distance":2,"state":"close"},{"from":{"brood":"girtablilu","cell":{"q":2,"r":1}},"to":{"brood":"pazuzu","cell":{"q":1,"r":2}},"distance":1,"state":"close"}]}
```

Spread:

```json
{"formation":{"shape":"spread","orientation":0},"positions":[{"brood":"ugallu","cell":{"q":3,"r":0}},{"brood":"girtablilu","cell":{"q":-3,"r":3}},{"brood":"pazuzu","cell":{"q":0,"r":-3}}],"links":[{"from":{"brood":"ugallu","cell":{"q":3,"r":0}},"to":{"brood":"girtablilu","cell":{"q":-3,"r":3}},"distance":6,"state":"stretched"},{"from":{"brood":"ugallu","cell":{"q":3,"r":0}},"to":{"brood":"pazuzu","cell":{"q":0,"r":-3}},"distance":6,"state":"stretched"},{"from":{"brood":"girtablilu","cell":{"q":-3,"r":3}},"to":{"brood":"pazuzu","cell":{"q":0,"r":-3}},"distance":6,"state":"stretched"}]}
```

## Explicit defaults, decisions, and sources

| Choice | Implemented value and authority | Status |
| --- | --- | --- |
| Arena and centre | Radius three, 37 cells, fixed (0,0); plan Fixture and Settled choices, brief Scope/Formation rules | Experimental POC constraint |
| Axial convention and R | Integer axial coordinates, distance max(abs(dq),abs(dr),abs(dq+dr)); exact table above; downward-positive projection and clockwise (-r,q+r); plan Fixture / Proposed implementation | Implemented experimental coordinate preset |
| Roster and mapping | [ugallu,girtablilu,pazuzu]; Compact 3o+[0,1,2], Spread 3o+[0,6,12] modulo 18; plan Fixture | Experimental labelled fixture; no deduplication |
| Shapes/orientation domain | Lowercase compact/spread; orientation integer 0..5; plan Fixture / Required contracts | Domain contractual; lowercase API spelling is an explicit implementation choice |
| Initial state | None; consumers must pass a Formation; orientation-zero states are examples only | Plan specifies examples, not a required default initial state |
| Close threshold | Default 2, inclusive; explicit nonnegative safe-integer override allowed; plan Settled choices, brief Links | Provisional tuning, not final balance; tests use explicit thresholds |
| Link ordering and fields | (ugallu,girtablilu), (ugallu,pazuzu), (girtablilu,pazuzu), each with labelled from/to, integer distance, close/stretched; plan Proposed implementation | Published P02 output contract |
| Errors and numeric safety | Synchronous RangeError with documented per-input messages; reject malformed shapes, orientations, coordinates, thresholds, and unsafe computed distances; safe integers prevent precision loss | Implementation resolution of plan Required contracts; error table in prototype README |
| Same-shape expand/contract | Preserve requested shape and orientation when already at destination shape | Explicit pure-transition choice; no allowance/resource decisions |

Public exports are documented in the prototype README; types are readonly, inputs are unchanged, shared fixture arrays/cells are frozen. Returned objects are not universally promised to be frozen. No silently repaired shape, fractional coordinate, or out-of-domain orientation is accepted. No renderer, state mutation/action accounting, movement, physics, combat, damage, health/link eligibility, or extra engine was introduced.

## Remaining limits

Re-review of R1, Coordinator acceptance, and delivery are pending separate assignments. No unresolved implementation blocker. Master remains BASE. Existing large Phaser build warning remains; browser checks, clean reinstall, host-mode rerun, deliberate corruption of an expected value, and human playtesting were not run for P02. The property-order variation probe was executed as described above. Existing P01 behavior is covered by unchanged smoke tests and the required build; prior browser evidence is preserved rather than claimed as newly executed.
