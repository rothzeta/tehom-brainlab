task: TR-review
role: reviewer
status: complete
outcome: "Pass: all eleven TR acceptance criteria verified; no material findings or lost contract coverage."
baseline: 0a48098ff439bc84df06f5f8e965531d69e0dba2
starting_revision: ebc26d63488c37aba6a6eb0470cde6a4a6461839
candidate_revision: 2e98a276a11c0ed7db117c34dd8374ce9d5c956d
reviewed_revision: 2e98a276a11c0ed7db117c34dd8374ce9d5c956d
tested_revision: 35774f0d57280b0fe81dc4f72bac3c40fb782630
artifacts:
  - docs/mailbox/two-ring-board/reviewer.md
  - docs/mailbox/two-ring-board/assignment-reviewer.md
  - docs/mailbox/two-ring-board/compact-0.png
  - docs/mailbox/two-ring-board/spread-0.png
verification:
  - "Independent Docker full suite: exit 0; 7 files, 278 tests, 2926 actual matcher assertions."
  - "Independent Docker typecheck and production build: exit 0 each; 9 prepared assets, 18 transformed modules."
  - "Independent Chrome check: exit 0; 177 assertions, 12 fixtures, 36 token hit tests, 3 modes, 18 captures, zero uncaught exceptions."
  - "Independent archived BASE full suite and matcher counter: exit 0; 7 files, 278 tests, 4949 assertions; reduction completely accounted for."
  - "Implementation whitespace, protected paths, evidence-only successor and byte-identity audits passed."
  - "Retained Compact/Spread images and independent normal, all six Compact fixtures, Spread zero and expansion preview visually inspected."
  - "Leading ruach-handoff validator with --repo: exit 0; ok true, no diagnostics."
review:
  - "PASS; blocking findings: 0; optional findings: 0."
discoveries: []
blockers: []

Author: two-ring-board Reviewer, 2026-10-04 UTC. Governing [assignment](assignment-reviewer.md), [TR plan](../../plans/2026-10-04-d005e5f4-poc-001-two-ring-board.md), P02/P04/P05/P06 amendments, ADR-0006, consumer policy, Reviewer role, ruach-testing and ruach-handoff skills.

## Verdict and scope

**PASS — no material findings. Blocking: 0. Optional: 0.**

Reviewed the complete technical diff `ebc26d6..2e98a27`: prototype README; `src/core/{hex,formation,sectors}.ts`; `src/view/{FormationLab.ts,lab.css}`; `tests/{formation.test.ts,intents.test.ts,browser-lab.mjs}`. Inspected surrounding intent selectors, damage settlement, projection and lab session behavior, and the existing tests. Compared implementation against the accepted design rather than treating the Implementer's report as verification.

Independent candidate checks ran at `35774f0d57280b0fe81dc4f72bac3c40fb782630`. `git diff --name-status 2e98a27..35774f0` shows only the Implementer assignment/report and two screenshots; `git diff --exit-code 2e98a27..35774f0 -- poc-001-linked-formation` exits 0. Therefore its technical content is identical to reviewed candidate `2e98a27`. This report's subsequent recording commit is returned in the terminal handoff and was not the technical revision tested.

No source, tests, configuration, protected documents or generated agent definitions were edited during review. Only this report was authored; the supplied assignment is committed unchanged. Coordinator acceptance and integration remain the Coordinator's responsibility.

## Acceptance evidence

| TR criterion | Independently checked evidence |
|---|---|
| 1: exact board | Formation C1 passes: 19 unique integer cells, radius at most 2, exact independent T/S subsets and centre membership. `hex.ts:34` enumerates precisely that domain. |
| 2: rings and removal | RING_TWO declaration from its P02 T comment through EOF is byte-identical to BASE. Exact frozen S and T fixtures, cell freezing and every clockwise +1/+2 turn pass. OUTER_RING is removed; typecheck passes. |
| 3: twelve exact mappings | `formation.ts:54` uses the accepted T/S indices. All twelve independently transcribed mapping tests pass, retaining roster order, uniqueness and exact radii. Adjacency and link tests give Compact 1 and Spread 4; positive radii exclude the centre. |
| 4: identity and inverses | Unedited enumeration, both C3 tests, labelled Spread 0/2 distinction, inverse rotations, six turns, axial turns and shape round trips pass for every state. |
| 5: thresholds | Default browser links and explicit unit boundaries pass: Compact Close at 1/2, Stretched at 0; Spread Stretched at 2/3, Close at 4. CLOSE_THRESHOLD and SPLASH_RADIUS remain 2; DEFAULT_DAMAGE_RULES and its module are unchanged. |
| 6: sectors/fronts | `sectors.ts:12` returns ordered T[2s], T[2s+1], S[s]. Six exact sector/front fixtures, disjoint 18-cell partition, centre exclusion and six ordered front turns pass. |
| 7: intents and protection | All 77 intent tests pass, covering all states and legal maneuvers, marks, splash, fixed/turned areas, living/fallen Girtablilu, protection, active links and isolation. Recipient tables are byte-identical to BASE; singleton inward Pazuzu retains protection and area eligibility at (1,0). EnemyState has id/HP/facing only; selectors read no enemy cell or position. The lab renders no enemies, as required by this task. |
| 8: unedited suites | Damage, commands, view, smoke and asset-copy suites are byte-identical to BASE and pass: 48 + 37 + 19 + 2 + 3 tests. No P03/P04/P06 regression found. |
| 9: built lab | Chrome passes 177 assertions over all twelve fixtures and all 36 physical token hit tests. Core positions/links, exact preview/commit destinations including inward Pazuzu, controls, allowance, cancellation, reset, fallback artwork and 1280×800 fit pass; zero exceptions. Visual evidence detailed below. |
| 10: README | Public contracts now state 19 cells, T/S, exact TR mappings, distances 1/4, sectors on rings 1–2, six-cell fronts and centre-only unmasked/view-only enemy anchor. Search and reading find no obsolete geometry claim. The remaining “37 P03 cases” at README line 89 is a historical test count, not a board claim. |
| 11: input contracts | Unedited error, frozen-state and arbitrary-coordinate tests pass. Validation functions and public messages are unchanged; the radius-three arbitrary-distance input test is retained. |

## Existing-test exception and assertion reduction

Compared every changed hunk against the TR plan's numbered exception items. Expectations use handwritten coordinates/index tables independent of production exports and outputs. No test, matcher family, invalid-input case or state/maneuver case was removed or weakened.

- **formation.test.ts:** exceptions 1–7 only: S/Compact fixtures and import; board count/radius/membership; equivalent S ring rotation/freeze checks; ordered-pair assertion count; exact per-state TR positions/radii; Spread link distances; configurable Spread threshold boundary. T fixture and its test, Compact adjacency, enumeration, both C3 tests, C6 and arbitrary frozen-coordinate coverage remain unchanged.
- **intents.test.ts:** exceptions 1, 3 and 4 only: T/S/sector/front/slot fixtures; 18-cell partition plus centre exclusion; inward singleton coordinate. Exception 2's recipient tables are byte-identical. Every other test body, including boundary and outside-sector cases, is unchanged.
- **browser-lab.mjs:** exceptions 1–3 only: 37 → 19 board-count expectation; one legend assertion; contraction assertion's message says ring-one. The actual contraction comparison and all other assertions, including 36 hit tests, remain unchanged.

Executed the archived BASE suite independently in Docker with the same dependencies and an external matcher counter. Independently counted the candidate's three normally uninstrumented suites; existing counters supply the other four. These are actual `expect.getState().assertionCalls`, not estimated totals.

| Suite | Tests BASE → TR | Matchers BASE → TR | Difference |
|---|---:|---:|---:|
| Formation | 92 → 92 | 3385 → 1361 | −2024 |
| Intents | 77 → 77 | 809 → 810 | +1 |
| Commands | 37 → 37 | 253 → 253 | 0 |
| Damage | 48 → 48 | 305 → 305 | 0 |
| View | 19 → 19 | 180 → 180 | 0 |
| Smoke | 2 → 2 | 2 → 2 | 0 |
| Asset copy | 3 → 3 | 15 → 15 | 0 |
| **Total** | **278 → 278** | **4949 → 2926** | **−2023** |

Every reduction is explained:

1. Ordered board pairs still get distance and integrality assertions: `2 × (37² − 19²) = 2016` fewer matchers because radius-three cells leave the board. The loop body is unchanged.
2. The superseded 18-entry R rotation test becomes a six-entry S test: 12 fewer turns. It adds radius and deep-freeze assertions (+2), yielding 21 → 11, a net reduction of 10. Equivalent exact-order, length, uniqueness and every-entry turn contracts remain protected; the unchanged T test still covers all twelve T turns.
3. Board membership gains exact S/centre coverage: 4 → 6 (+2).
4. Sector partition gains centre exclusion: +1.

Thus `2016 + 10 − 2 − 1 = 2023`. There is **no lost contract coverage**. Browser assertions independently increase 176 → 177.

## Independent verification commands and results

Commands ran from `/opt/dev/tehom-brainlab-tworing`; application tasks stayed in default Docker mode with pinned Bun 1.4.2 and Vitest 5.0.3. Dependencies were already installed, so `just poc-001-install` was not needed. Initial sandboxed `just poc-001-test` exited 1 because the Docker daemon was inaccessible; the authorized escalated Docker retry succeeded. No host-mode application fallback was used. Host Bun is used only for the assigned Chrome probe and handoff validator.

| Exact command | Exit/result |
|---|---|
| `just poc-001-test` | 0; 7 files, 278 tests. Existing counters: formation 1361, intents 810, commands 253, damage 305. Supplementary counts below produce 2926 total. |
| `just poc-001-typecheck` | 0; `tsc --noEmit`. |
| `just poc-001-build` | 0; 9 assets prepared, 18 modules transformed. Existing Phaser chunk-size warning remains; build succeeds. |
| `just poc-001-preview` | Docker served `http://localhost:4173/`; stopped with Ctrl-C after verification, exit 130. |
| `/home/metatron/.bun/bin/bun poc-001-linked-formation/tests/browser-lab.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/tr-review-browser` | 0; HeadlessChrome/148.0.7778.96, CDP 1.3, 1280×800, 177 assertions, 12 fixtures, 3 modes, 18 captures, 0 exceptions. Two deliberately blocked image requests exercise fallback. |
| `git diff --check ebc26d6..2e98a27` | 0; no whitespace errors. |
| `git diff --exit-code 2e98a27..35774f0 -- poc-001-linked-formation` | 0; identical technical content. |
| `git diff --exit-code ebc26d6..2e98a27 -- docs .agents` | 0; implementation did not edit protected design/agent documents. |
| `/home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/two-ring-board/reviewer.md --repo /opt/dev/tehom-brainlab-tworing` | 0; `ok: true`, no diagnostics, all revision fields resolve. |

Protected-path command, exit 0:

```sh
git diff --exit-code 0a48098..2e98a27 -- poc-001-linked-formation/src/core/damage.ts poc-001-linked-formation/src/core/lifecycle.ts poc-001-linked-formation/src/core/transition.ts poc-001-linked-formation/src/core/commands.ts poc-001-linked-formation/src/core/state.ts poc-001-linked-formation/src/core/smoke.ts poc-001-linked-formation/src/view/projection.ts poc-001-linked-formation/src/view/lab-state.ts poc-001-linked-formation/src/main.ts poc-001-linked-formation/tests/damage.test.ts poc-001-linked-formation/tests/commands.test.ts poc-001-linked-formation/tests/view.test.ts poc-001-linked-formation/tests/smoke.test.ts poc-001-linked-formation/tests/asset-copy.test.ts poc-001-linked-formation/package.json poc-001-linked-formation/bun.lock poc-001-linked-formation/vite.config.ts poc-001-linked-formation/scripts poc-001-linked-formation/bin justfile assets docs/CURRENT.md docs/TASK_LOGS.md
```

Temporary count setup `/tmp/tr-review-count/count.mjs` imports Vitest `afterEach`, `afterAll`, `expect`, sums `expect.getState().assertionCalls` after each test and prints the total per file. Its external config imports `/app/vitest.config.ts`, preserves its configuration and adds only that setup file. Baseline files came from `git archive 0a48098ff439bc84df06f5f8e965531d69e0dba2 poc-001-linked-formation assets | tar -x -C /tmp/tr-review-base`. No repository config or tests changed.

Exact supplementary and baseline commands, each exit 0:

```sh
docker run --rm --init --user "$(id -u):$(id -g)" --env HOME=/tmp --env BUN_INSTALL_CACHE_DIR=/tmp/bun-cache --env POC001_PORT=0 --volume /opt/dev/tehom-brainlab-tworing/poc-001-linked-formation:/app --volume /opt/dev/tehom-brainlab-tworing/assets:/assets:ro --volume /tmp/tr-review-count:/tr-review --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 sh ./scripts/toolchain.sh test tests/view.test.ts tests/smoke.test.ts tests/asset-copy.test.ts --config /tr-review/vitest.config.mjs
docker run --rm --init --user "$(id -u):$(id -g)" --env HOME=/tmp --env BUN_INSTALL_CACHE_DIR=/tmp/bun-cache --env POC001_PORT=0 --volume /tmp/tr-review-base/poc-001-linked-formation:/app --volume /opt/dev/tehom-brainlab-tworing/poc-001-linked-formation/node_modules:/app/node_modules:ro --volume /tmp/tr-review-base/assets:/assets:ro --volume /tmp/tr-review-count:/tr-review --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 sh ./scripts/toolchain.sh test --config /tr-review/vitest.config.mjs
```

Supplementary result: 3 files, 24 tests; view 180, smoke 2, asset-copy 15 matchers. Archived baseline result: 7 files, 278 tests, the BASE counts tabulated above. Read-only Python byte comparisons also exited 0 for RING_TWO and recipient tables and verified both threshold declarations remain 2.

## Visual inspection and verification limits

Personally opened retained [Compact zero](compact-0.png) and [Spread zero](spread-0.png), and independent `/tmp/tr-review-browser/normal.png`, `fixture-0.png` through `fixture-5.png`, `fixture-6.png` and `expand-preview.png`. Both retained screenshots match the independent captures. The hex board visibly has rows 3/4/5/4/3, totaling 19. Compact is an adjacent three-token triangle with Pazuzu on ring 1 toward the empty middle; Spread occupies three widely separated ring-2 corners. At 120 px pitch the entire board fits, all names/tokens are separated, and Compact Close labels sit outside the triangle without covering tokens in all six orientations. Spread dashed links and labels are readable. Expansion destination captions remain visible, and the shifted Ugallu caption and nearby Close label are separately readable. The CSS adjustment is justified by this screenshot evidence and falls within the plan's conditional allowance.

All assigned verification areas are checked; none remains unverified. No human playtest, mobile-layout evaluation, enemy-placement experiment, or P07+ behavior was performed; these are outside the assigned TR scope. Disposable probe files, baseline archive and browser output stay under `/tmp`; unique review conclusions, counts, revision references and reproducible commands are preserved here.
