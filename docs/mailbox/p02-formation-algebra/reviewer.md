task: B-review / B-rereview — P02 formation algebra independent review
status: complete
outcome: R1 resolved; all ten acceptance criteria pass. Required re-verification and property-order variation probe pass; no material findings remain.
artifacts:
  - docs/mailbox/p02-formation-algebra/reviewer.md
  - docs/mailbox/p02-formation-algebra/implementer.md
  - docs/mailbox/p02-formation-algebra/verification.md
  - local branch p02-formation-algebra
verification:
  - Focused formation suite: exit 0, 90 tests, 3349 actual assertions.
  - Strict typecheck: exit 0.
  - Full suite: exit 0, 92 tests in two files, including two unchanged P01 tests.
  - Build: exit 0; existing large Phaser chunk warning.
  - Reviewed-range whitespace and technical-tree equality checks: exit 0.
  - Network-disabled, read-only property-order overlay suite: exit 0, 90 tests, 3349 actual assertions.
discoveries:
  - Enumeration membership now compares contractual shape/orientation values; coverage and counts are unchanged.
  - Executable/test/configuration content at reviewed head equals corrected candidate 29d9616f2ebdb69c83d12f66089495bca6f7f723.
blockers: []
candidate_revision: 29d9616f2ebdb69c83d12f66089495bca6f7f723
reviewed_revision: 803da5df5f34b387be3bb5ccce3cd7cbd733f90b
tested_revision: 803da5df5f34b387be3bb5ccce3cd7cbd733f90b

Author: B-review / B-rereview Reviewer. Date: 2026-10-04 UTC. Review completion is not Coordinator acceptance or delivery. The current outcome and verdicts are in the [re-review section](#re-review-of-r1-at-803da5d); the initial review below is retained as historical evidence.

## Initial review revision and scope

Reviewed `e3f60372a5fef279f92ed14caead48271247405f..fb0a352929e38dab21c9092a8d45246a2a81764d` in the clean main checkout on `p02-formation-algebra`. Inspected both new core modules, the formation tests, P01 wrappers/configuration and smoke coverage, all changed status/evidence documentation, the [P02 plan](../../plans/2026-10-02-2e228a2b-poc-001-formation-algebra.md), the [brief](../../prototypes/poc-001-linked-formation.md), and [ADR-0006](../../adr/0006-contract-invariants-and-black-box-testing.md), applying ruach-testing and ruach-handoff.

`git diff --name-only 3570610406886f18ca08c51effc79b3e8f3ddd34..fb0a352` lists only eight Markdown evidence/status documents. The technical-tree diff below exits 0. Initial tests were actually run at `fb0a352929e38dab21c9092a8d45246a2a81764d`, with technical content identical to the Implementer's original tested candidate. Master remains BASE. No worktree was needed, no production/test files were modified, and no commit was made; this reviewer-owned report is left uncommitted. Temporary probes are under `.agents/scratch/p02/review-probes/`.

## Initial findings, ordered by severity

### R1 — initial P2 blocking finding; resolved on re-review

The following finding applied at `fb0a352`; it is resolved at the current reviewed revision.

- **Location:** [formation.test.ts](../../../poc-001-linked-formation/tests/formation.test.ts), lines 67–68.
- **Problem:** The enumeration membership check compares sets of `JSON.stringify(state)`. This requires every returned Formation object's properties to be inserted in the same order as the test fixture (`shape`, then `orientation`). Returning `{ orientation, shape }` describes the same twelve valid states but fails this assertion.
- **Why it matters:** [ADR-0006](../../adr/0006-contract-invariants-and-black-box-testing.md) requires valid implementation changes to pass and forbids freezing incidental representations. Neither the plan nor the published API requires serialized Formation state property order. The separate requirement for byte-equivalent serialized **positions after inverse operations** does not impose this enumeration formatting restriction. This is a concrete false regression and violates assignment criterion 8.
- **Evidence:** A read-only Bun probe called actual `formations()`, reconstructed each state as `{ orientation, shape }`, and successfully asserted structural Set equality and identical labelled position arrays. Its serialized state sets were unequal. For example, `{"shape":"compact","orientation":0}` differs from `{"orientation":0,"shape":"compact"}` only in property order; the strings in the existing assertion therefore differ. Production code and tests were not edited for this probe.
- **Suggested direction:** Compare membership structurally or compare canonical keys explicitly derived from `shape` and `orientation`. Retain the length, exact state membership, and distinct labelled-position checks, as well as the contractual serialized-position inverse assertions. Have the Implementer rerun focused/full checks and update evidence if counts change.

No other material findings or optional improvements. No algebra correctness defect, P01 regression, or scope violation was found.

## Initial acceptance verdicts at fb0a352

| Criterion | Verdict | Evidence |
| --- | --- | --- |
| 1. Board 37, ring 18, radius three | Pass | Independent bounds/count/set assertions pass; loops enumerate all integer cells within radius three. |
| 2. Twelve labelled mappings, distinct cells, roster order | Pass | All twelve explicitly supplied states equal the independent R fixture with declared offsets; enumeration retains all twelve. |
| 3. Exact inverse maneuvers and six turns | Pass | Both rotation inverse orders, both six-turn directions, relevant shape inverses, and clockwise coordinate transforms pass for every state. Serialized positions are preserved. |
| 4. Compact Close / Spread Stretched at explicit threshold two | Pass | All twelve orientations, including wraparound endpoints, have distances [1,2,1] / [6,6,6] and expected classifications; inclusive threshold boundaries also pass. |
| 5. Spread zero/two retain labels on equal occupied sets | Pass | Equal cell sets, unequal labelled positions, stable roster order, and twelve distinct labelled serializations asserted. |
| 6. Documented invalid-input errors and frozen inputs unchanged | Pass | Seven public formation operations reject eleven representative invalid inputs with documented RangeError type/messages and accept each frozen state unchanged; coordinate/threshold boundaries and unsafe distance are covered. Frozen input records are flat, so freezing them is deep for this model. |
| 7. Exact R/mapping/convention/link pair order | Pass | All 18 ring entries match the plan; R advances by three under (-r,q+r); mapping and roster-pair distances agree across all states. |
| 8. Black-box contracts, exhaustive claims, plausible defects | **Fail — R1** | Exhaustive finite-domain claims and assertion counts are accurate; tests observe public boundaries and detect wrong R, deduplication, changed labels, mutating frozen inputs, and silent repair. One enumeration assertion additionally rejects a valid property-order variation. |
| 9. Pure scope, P01 preserved, sourced defaults, factual docs | Pass | Only two pure core modules and one test suite were added; all other changes are documentation. No P03/combat/UI/movement/physics/engine additions. P01 source/runtime/config/tests are unchanged. README and reports explicitly source provisional presets/threshold and distinguish implementation/verification from pending review/delivery. |
| 10. Reported table/counts/serialized examples | Pass | Focused/full runner counts independently match 90/92 and 3349 assertions. Actual read-only Bun output matches all 18 reported ring entries and both orientation-zero example objects, including positions, endpoint order, distances, and states. |

## Initial commands and actual results

All four initial required `just` commands ran from the repository root at `fb0a352929e38dab21c9092a8d45246a2a81764d`. Each initial sandbox attempt exited 1 with `P01: Docker daemon inaccessible; check availability and socket permissions`; no application checks executed in those attempts. The exact same commands then ran successfully with approved Docker access using the unchanged wrapper, pinned Bun 1.4.2, and Vitest 5.0.3:

| Exact command | Final exit | Result |
| --- | --- | --- |
| `just poc-001-test tests/formation.test.ts` | 0 | 1 file, 90 tests pass; stdout `P02 formation assertions executed: 3349`. |
| `just poc-001-typecheck` | 0 | `tsc --noEmit` passes. |
| `just poc-001-test` | 0 | 2 files, 92 tests pass; P02 stdout again reports 3349 assertions. |
| `just poc-001-build` | 0 | 7 modules transformed; static build succeeds. Existing warning for chunks above 500 kB; output sizes match reported P01 artifacts. |
| `git diff --check e3f6037..fb0a352` | 0 | No whitespace errors. |
| `git diff --exit-code 3570610406886f18ca08c51effc79b3e8f3ddd34..fb0a352 -- poc-001-linked-formation/src poc-001-linked-formation/tests poc-001-linked-formation/package.json poc-001-linked-formation/bun.lock poc-001-linked-formation/tsconfig.json poc-001-linked-formation/runtime.env poc-001-linked-formation/scripts poc-001-linked-formation/bin justfile` | 0 | No technical differences. |

Read-only output/property-order probe command (exit 0):

```sh
docker run --rm --network none --user "$(id -u):$(id -g)" --volume "$PWD/poc-001-linked-formation:/app:ro" --volume "$PWD/.agents/scratch/p02/review-probes:/review:ro" --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 bun /review/output-probe.mjs
```

The scratch probe guards `window`, `document`, and `Phaser` with throwing getters before dynamically importing both core modules; prints actual R and both orientation-zero examples; checks structural equality of original/reordered states and their positions; and confirms unequal JSON state sets. Output: `Property-order probe: structural state membership and labelled positions equal; enumeration JSON sets unequal.` A Python extraction of the Implementer report's JSON code blocks and R table exited 0; comparison against the captured actual output confirmed ring equality (18 entries) and equality of both complete example objects. No browser globals were accessed.

The 3349 count reconciles as 25 board/ring assertions + 2738 ordered-cell-pair assertions + 6 enumeration assertions + 360 per-state assertions + 3 explicit-threshold assertions + 154 invalid-formation assertions + 48 invalid-coordinate assertions + 5 frozen/unsafe-distance assertions + 10 invalid-threshold assertions. Exhaustiveness refers to all twelve valid formation states and 1369 ordered board-cell pairs; invalid runtime values are representative boundary coverage, not an infinite exhaustive domain.

## Initial unverified areas and hand-back

No browser session, clean reinstall, host-mode run, human playtest, deliberate production-code mutation run, or delivery/merge was performed. Plausible-defect detection is established by inspection of relevant assertions, not a mutation-testing campaign. The original implementer command timestamps and historical BASE runs were not independently reproduced; this review supplies fresh passing checks on identical technical content. No complete Markdown link audit was rerun. P02 algebra requires no new browser behavior; unchanged P01 smoke tests/build passed.

Return R1 to the responsible Implementer. Re-review the corrected assertion and refreshed evidence before criterion 8 or overall acceptance is marked passed.

## Re-review of R1 at 803da5d

Assignment B-rereview reviewed `fb0a352929e38dab21c9092a8d45246a2a81764d..803da5df5f34b387be3bb5ccce3cd7cbd733f90b` in the main checkout on `p02-formation-algebra`. The technical fix is `29d9616f2ebdb69c83d12f66089495bca6f7f723`. Re-verification ran at the reviewed head `803da5df5f34b387be3bb5ccce3cd7cbd733f90b`, which has identical executable/test/configuration content to that fix.

### R1 disposition and new findings

**R1 resolved. No material findings remain; no new blocking or optional findings.**

The only technical change is [formation.test.ts](../../../poc-001-linked-formation/tests/formation.test.ts), lines 67–68: both sides of the membership comparison now derive explicit `${shape}:${orientation}` keys. These keys compare required state values independently of object property insertion order. The twelve-state count, exact membership, twelve distinct labelled positions, and all mapping/inverse/frozen-input assertions remain intact. There are still 90 formation tests and 3349 actual matcher assertions.

Audited every remaining `JSON.stringify`, `serializePositions`, and object-equality assertion in both prototype test files. Serialized positions compare the same public derivation before/after inverse transitions, as expressly required by the plan, or count distinct labelled assignments without comparing independent object constructions. Frozen inputs compare the same record before/after. Other object comparisons use structural equality; explicit cell keys and roster/link arrays preserve contractual values and order. No other assertion has R1's incidental property-insertion-order dependency.

Independently inspected the Implementer's `.agents/scratch/p02/r1/formation-reordered.ts`: a Python equality check confirmed it matches the production module exactly except for replacing `states.push({ shape, orientation: orientation as Orientation });` with `states.push({ orientation: orientation as Orientation, shape });`. Ran the actual current formation suite with that file mounted read-only over the module. All 90 tests and 3349 assertions passed, directly verifying the formerly rejected valid variation. No production or test files were changed on disk.

### Current acceptance verdicts 1–10

| Criterion | Current verdict | Re-review evidence |
| --- | --- | --- |
| 1. Board 37, ring 18, radius three | Pass | Production geometry and assertions unchanged; focused/full suites pass. |
| 2. Twelve labelled mappings, distinct cells, roster order | Pass | Canonical membership assertion retains exact twelve-state coverage; mapping tests and reordered-property overlay pass. |
| 3. Exact inverse maneuvers and six turns | Pass | All serialized-position inverse and six-turn assertions retained and pass for all twelve states. |
| 4. Compact Close / Spread Stretched at threshold two | Pass | Explicit-threshold and inclusive-boundary coverage unchanged and passing. |
| 5. Spread zero/two different labels on equal cell sets | Pass | Coincident-cell-set and distinct-labelled-state checks unchanged and passing. |
| 6. Invalid-input errors and frozen inputs unchanged | Pass | All public validation/error/immutability checks retained and passing. |
| 7. Exact R/mapping/convention/link pair order | Pass | Source and independent fixture/ordering assertions unchanged and passing. |
| 8. Black-box contracts and exhaustive coverage | Pass | R1 corrected; no other equivalent dependency found. Required state membership and distinctness preserved, counts unchanged, valid property-order variation passes the actual suite. |
| 9. Pure scope, P01 preserved, sourced defaults, factual docs | Pass | Two assertion lines are the only technical change; production source unchanged. Evidence successor changes only three Markdown reports/log files and correctly keeps acceptance/delivery pending. |
| 10. Reported table/counts/serialized examples | Pass | Fresh runs independently reproduce 90/92 tests and 3349 assertions. Production modules and historical R/examples are unchanged; Implementer now explicitly identifies the original capture revision rather than claiming a new capture. |

### Re-review commands and results

Required commands ran from the repository root at the current `tested_revision`, directly with approved Docker access because the initial review had already established the sandbox restriction. No fresh sandbox attempts were made in this re-review.

| Exact command | Exit | Result |
| --- | --- | --- |
| `just poc-001-test tests/formation.test.ts` | 0 | 1 file, 90 tests pass; stdout reports `P02 formation assertions executed: 3349`. |
| `just poc-001-typecheck` | 0 | Strict `tsc --noEmit` passes. |
| `just poc-001-test` | 0 | 2 files, 92 tests pass; 3349 P02 assertions plus two unchanged P01 tests. |
| `just poc-001-build` | 0 | 7 modules transformed; same P01 shell assets/sizes and existing large Phaser chunk warning. |
| `git diff --check fb0a352..803da5d` | 0 | No whitespace errors. |
| `git diff --exit-code fb0a352..803da5d -- poc-001-linked-formation/src` | 0 | No production-source changes. |
| `git diff --exit-code 29d9616f2ebdb69c83d12f66089495bca6f7f723..803da5d -- . ':(exclude)docs'` | 0 | No executable/test/configuration or other non-doc changes after the tested fix. |
| `rg -n 'JSON\.stringify\|serializePositions\|toEqual\|toBe' poc-001-linked-formation/tests` | 0 | Located serialization and equality assertions for direct inspection. |

The last command's search was executed using ripgrep alternation (`JSON\.stringify|serializePositions|toEqual|toBe`); the table uses escaped pipes solely for Markdown rendering.

Additional property-order overlay command, exit 0, 90 tests / 3349 assertions:

```sh
docker run --rm --network none --tmpfs /app/node_modules/.vite-temp:rw,mode=1777 --tmpfs /app/node_modules/.vite:rw,mode=1777 --user "$(id -u):$(id -g)" --volume "$PWD/poc-001-linked-formation:/app:ro" --volume "$PWD/.agents/scratch/p02/r1/formation-reordered.ts:/app/src/core/formation.ts:ro" --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 bun run --bun test:unit tests/formation.test.ts
```

This is a deliberate valid-variation experiment in addition to the stock head checks; the overlay is not a new tested Git revision. The source mounts are read-only, networking is disabled, and cache writes use disposable tmpfs mounts.

### Evidence audit, limits, and hand-back

Actual re-review range changes four files: the test, `docs/TASK_LOGS.md`, and the Implementer's two reports. Contrary to the assignment's broader parenthetical list, this evidence successor does not change CURRENT or the brief. `git diff --name-only 29d9616..803da5d` lists only the three Markdown evidence files. The updated reports correctly identify the corrected candidate, retained historical capture, unchanged assertion/test counts, property-order overlay, and pending re-review/acceptance/delivery. Their preserved original reviewer-report hash was independently verified before this reviewer-owned update: `fed11f8aed7e97730199aa8792faccc69bd2697e1026d488d5b905695a840bd7`. No evidence inconsistency requiring correction was found.

Historical before-fix overlay execution and the Implementer's original timestamps were inspected as reported evidence, not independently rerun during re-review. The current after-fix overlay was independently executed. No new browser session, clean reinstall, host-mode run, human playtest, full mutation-testing campaign, complete Markdown link audit, merge, or delivery was performed. Original geometry/example evidence remains applicable because production modules are byte-identical.

Master remains BASE `e3f60372a5fef279f92ed14caead48271247405f`. Only this reviewer-owned report was edited; it remains untracked/uncommitted. Review is complete with all ten criteria passing and no current blockers. Coordinator acceptance and any delivery remain separate actions.
