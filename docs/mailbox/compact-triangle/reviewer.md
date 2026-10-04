task: CT-review
role: reviewer
status: complete
outcome: "PASS: CT acceptance criteria 1–9 met; no material findings (0 blocking, 0 optional)."
baseline: 0f9c1b7d4d0ff01c4a890df8a8c4a4500737165e
starting_revision: c30e8cc9790030e7ee66060e7398ddacc7cad5e1
candidate_revision: 4fa7613f5c1b467377cef88bb89df5c30524a80d
reviewed_revision: 4fa7613f5c1b467377cef88bb89df5c30524a80d
tested_revision: 39cc86f8e362f5547b875437e78f4d952ffdfd2b
artifacts:
  - docs/mailbox/compact-triangle/reviewer.md
  - docs/mailbox/compact-triangle/assignment-reviewer.md
  - docs/mailbox/compact-triangle/compact-0.png
  - docs/mailbox/compact-triangle/compact-4.png
verification:
  - "Independent Docker full suite: exit 0; 7 files, 278 tests, 4949 matcher assertions including supplemental counters."
  - "Independent Docker focused suites: exit 0; 3 files, 217 tests, 4499 matcher assertions."
  - "Independent Docker typecheck and build: exit 0 each; 9 assets prepared, 18 modules transformed."
  - "Independent Chrome browser check: exit 0; 176 assertions, 12 fixtures, 3 modes, 18 screenshots, zero uncaught exceptions."
  - "Disposable Docker public-API probe: exit 0; 26 checks including all six byte-identical BASE Spread outputs and ordered front turns."
  - "Technical-content equality, protected-path checks and candidate whitespace check: exit 0."
  - "Report validator with --repo: exit 0, ok true, no diagnostics."
review:
  - "Reviewed all eight technical-file diffs, accepted amendments, surrounding consumers and changed-test coverage; no blocking or optional findings."
  - "Visually inspected retained Compact 0/4 captures and independent Compact 0–5 captures; triangles and outward captions are readable and unclipped."
discoveries: []
blockers: []

Author: Compact-triangle Reviewer, 2026-10-04 UTC. Authority: [unchanged assignment](assignment-reviewer.md), [CT plan](../../plans/2026-10-04-fb4bf201-poc-001-compact-triangle.md), accepted P02/P04/P05/P06 amendments and repository policy. The [Implementer report](implementer.md) was inspected as a claim to verify, not substituted for independent execution.

## Verdict and reviewed scope

**PASS. No material findings: 0 blocking, 0 optional.** All nine assigned CT acceptance criteria are met by the reviewed candidate. Coordinator acceptance and delivery remain separate decisions.

Reviewed technical change `c30e8cc..4fa7613`: prototype `README.md`, `src/core/{hex,formation,sectors}.ts`, `src/view/FormationLab.ts`, and `tests/{formation.test.ts,intents.test.ts,browser-lab.mjs}`. Inspected surrounding `intents.ts`, maneuver transitions, damage selector use, lab session, projection/style contracts, relevant tests, and the accepted mapping/mask tables. The implementation uses the specified direct index expressions and a per-link outward caption offset; it adds no generic geometry or layout layer.

All independent runtime checks ran at HEAD `39cc86f8e362f5547b875437e78f4d952ffdfd2b`. Before execution, confirmed `4fa7613..39cc86f` adds only the Implementer report, unchanged assignment and two screenshots, and that its entire prototype technical content is identical. No source or test edits were made during review. Only this report and the unchanged Reviewer assignment are committed by the Reviewer.

## Acceptance evidence

| CT criterion | Independent evidence and assessment |
| --- | --- |
| 1 | Formation fixtures match all six accepted handwritten Compact rows, with radii `[3,3,2]` and all 18 Compact pair distances equal to 1. The disposable probe compares JSON serialization of candidate Spread positions with actual BASE modules for every orientation; all six are byte-equal. |
| 2 | Unchanged enumeration, inverse-turn, six-turn, axial-turn-equality and expand/contract round-trip assertions pass for all twelve states. Exact roster order and distinct cells remain covered. |
| 3 | Link expectations are Compact `[1,1,1]` Close and Spread `[6,6,6]` Stretched at the delivered default. Explicit Compact thresholds 0/1 and Spread 5/6 retain inclusive-boundary coverage. `CLOSE_THRESHOLD = 2`, `SPLASH_RADIUS = 2` and `DEFAULT_DAMAGE_RULES` are unchanged; the probe confirms default link classifications and prints rules `{directionalReduction:2,shelterReduction:2,closeThreshold:2}`. |
| 4 | Handwritten sector/front fixtures verify all six ordered five-cell sectors and ten-cell fronts. The union/disjointness check verifies exactly the 30 ring-2/3 cells. Existing turn tests pass for each facing; the independent probe additionally compares every turned front element by element with the next front, including wraparound. |
| 5 | Intent tests keep the original handwritten area/turned recipient values. All twelve states and every legal maneuver retain mark, splash and fixed-area coverage; per-state protection/live-link/isolation checks include fallen Girtablilu. The added inward Pazuzu case verifies full Warder protection output and singleton ring-2 area selection. Existing source/mark-death, ordering and lone-survivor checks pass. |
| 6 | BASE protected-path comparison exits 0. Unedited damage (48), commands (37), view (19), smoke (2), and asset-copy (3) tests all pass. |
| 7 | Independently rebuilt lab passes 176 browser assertions, all twelve core positions/links/availability fixtures and 36 token-centre hit tests. Expansion and contraction ghosts equal committed destinations, including inward Pazuzu. All six independent Compact captures visibly show triangles with readable outside captions, no caption/token overlap or clipping. Zero uncaught exceptions. |
| 8 | README accurately documents `RING_TWO`, its complete table and rotation, the new Compact mapping/distances, ordered ring-2/3 sectors/fronts and protection on both rings. Its only always-outer statement is correctly limited to Spread. No obsolete Compact `[1,2,1]`, `3o+[0,1,2]`, or outer-only `ring cell` contract remains. |
| 9 | Invalid-input/error and frozen-input coverage is retained and passes. The new T fixture also verifies the export and all its cells are frozen. Validation logic is unchanged. |

## Existing-test exception audit

The complete test diff was checked against the CT plan's permitted edits. No existing test was deleted or weakened, and expected geometry is specified independently of module output.

- `formation.test.ts`: only C2 mapping/radii, C4 Compact distances, and the configurable threshold case change existing expectations. Compact/T fixtures reproduce the accepted handwritten tables. Added T and pair-adjacency tests plus the Spread threshold-5 check strengthen coverage. C1, C3, C5, C6 and error cases remain unchanged. Tests increase from 90 to 92.
- `intents.test.ts`: handwritten T/sectors/fronts extend masks in the required order; affected declaration-cell assertions follow that fixture. Compact slots become explicit cells. Spread indices are converted to cells solely to preserve the shared mark assertion, with identical expected values. `areaRecipients` and `turnedRecipients` are unchanged. Threshold expectations reflect distance 1 and retain exclusions at 0. Added partition and inward-Pazuzu tests protect the new contract. Tests increase from 75 to 77.
- `browser-lab.mjs`: adds the authorized 36 token-centre assertions and four contraction preview/commit assertions needed by the accepted P04 evidence requirement. Every pre-existing assertion remains unchanged. The added sequence is followed by reset, preserving the setup for subsequent checks. Browser assertions increase from 136 to 176.
- Protected P03/P04/P06 suites remain byte-identical to BASE. No unrelated fixture, tuning or settlement change accompanies the geometry updates.

## Independent verification commands and results

Commands ran from `/opt/dev/tehom-brainlab-compact` at the tested revision above. All application suite/typecheck/build/preview checks used explicit Docker mode, the pinned Bun 1.4.2 image and approved sandbox escalation. Existing dependencies were usable; installation was not needed and `just poc-001-install` was not rerun. Host Bun was used only for the assigned Chrome driver and report validator. No application host-mode fallback occurred.

| Exact command | Exit and result |
| --- | --- |
| `git diff --name-status 4fa7613..39cc86f` | 0; four evidence-only additions. |
| `git diff --exit-code 4fa7613..39cc86f -- poc-001-linked-formation` | 0; identical technical content. |
| `POC001_MODE=docker just poc-001-test` | 0; 7 files, 278 tests. Suite counters: formation 3385, commands 253, intents 809, damage 305. |
| `POC001_MODE=docker just poc-001-typecheck` | 0; `tsc --noEmit`. |
| `POC001_MODE=docker just poc-001-build` | 0; 9 assets, 18 modules, JS 1394.69 kB / gzip 364.57 kB. Existing large-chunk warning remains. |
| `POC001_MODE=docker just poc-001-preview` | Served rebuilt candidate at `http://localhost:4173/`; stopped with Ctrl-C after the browser check, exit 130. |
| `/home/metatron/.bun/bin/bun poc-001-linked-formation/tests/browser-lab.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/ct-review-browser` | 0; HeadlessChrome 148.0.7778.96 / CDP 1.3, 1280×800 at device scale 1, 176 assertions, 12 fixtures, 3 modes, 18 captures, 0 exceptions, 2 intentionally blocked image requests. |
| `POC001_MODE=docker just poc-001-test tests/formation.test.ts tests/intents.test.ts tests/damage.test.ts` | 0; 3 files, 217 tests, 4499 matcher assertions. |
| `git diff --check c30e8cc..4fa7613` | 0; no whitespace errors. |
| `git diff --exit-code c30e8cc..39cc86f -- docs/plans docs/prototypes .agents .codex` | 0; no implementation edits to accepted design or agent configuration. |
| `/home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/compact-triangle/reviewer.md --repo /opt/dev/tehom-brainlab-compact` | 0; `ok: true`, no diagnostics, all supplied revisions resolve. |

Full-suite matcher count is **4949**: 4752 from its four existing counters plus an independently executed supplemental count of the three uninstrumented suites: view 180, smoke 2, assets 15. Per-file test counts sum to 278 (92 + 77 + 48 + 37 + 19 + 2 + 3), versus BASE's 274; the increase is exactly four added CT tests.

The first validator invocation using bare `bun` exited 127 because Bun is absent from this shell's PATH; rerunning with its existing absolute executable path resolved that invocation issue.

Supplemental counting command (exit 0, 3 files / 24 tests / 197 matchers):

```sh
docker run --rm --init --user "$(id -u):$(id -g)" --env HOME=/tmp --env BUN_INSTALL_CACHE_DIR=/tmp/bun-cache --env POC001_PORT=0 --volume /opt/dev/tehom-brainlab-compact/poc-001-linked-formation:/app --volume /opt/dev/tehom-brainlab-compact/assets:/assets:ro --volume /tmp/ct-review-checks:/ct-review --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 sh ./scripts/toolchain.sh test tests/view.test.ts tests/smoke.test.ts tests/asset-copy.test.ts --config /ct-review/vitest.config.mjs
```

The temporary config imports `/app/vite.config.ts` and only appends a temporary setup file. Its `afterEach` accumulates `expect.getState().assertionCalls`; `afterAll` prints the per-file total. Repository tests/configuration are unchanged.

Independent BASE/turn probe command (exit 0, 26 checks):

```sh
docker run --rm --init --user "$(id -u):$(id -g)" --env HOME=/tmp --volume /opt/dev/tehom-brainlab-compact/poc-001-linked-formation:/app:ro --volume /tmp/ct-review-checks:/ct-review:ro --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 bun /ct-review/probe.mjs
```

The BASE `hex.ts` and `formation.ts` modules were extracted with `git show 0f9c1b7:poc-001-linked-formation/src/core/hex.ts` and the equivalent `formation.ts` command. The probe calls only public APIs: six serialized Spread comparisons, twelve default-link comparisons, six ordered front-turn comparisons and two unchanged constant checks. Damage rules are unchanged by the protected diff and were also printed by the probe.

Protected-path command (exit 0, no output):

```sh
git diff --exit-code 0f9c1b7..4fa7613 -- poc-001-linked-formation/src/core/damage.ts poc-001-linked-formation/src/core/lifecycle.ts poc-001-linked-formation/src/core/transition.ts poc-001-linked-formation/src/core/commands.ts poc-001-linked-formation/src/core/state.ts poc-001-linked-formation/src/core/smoke.ts poc-001-linked-formation/src/view/projection.ts poc-001-linked-formation/src/view/lab-state.ts poc-001-linked-formation/tests/damage.test.ts poc-001-linked-formation/tests/commands.test.ts poc-001-linked-formation/tests/view.test.ts poc-001-linked-formation/tests/smoke.test.ts poc-001-linked-formation/tests/asset-copy.test.ts assets docs/CURRENT.md docs/TASK_LOGS.md
```

## Visual evidence and limits

Opened the retained [Compact 0](compact-0.png) and [Compact 4](compact-4.png) screenshots personally. Independently generated and opened `/tmp/ct-review-browser/fixture-0.png` through `fixture-5.png`. Every orientation shows three triangular anchors with Pazuzu inward, three Close links, and outside captions clear of token artwork/names. Orientation 4's top caption remains within the canvas. All 36 token centres resolve to the intended token in Chrome; the unchanged pointer-selection assertion also passes. The driver uses Chrome's sandbox without bypass flags.

Disposable captures, trace, Chrome diagnostics, BASE modules and counters remain under `/tmp/ct-review-browser` and `/tmp/ct-review-checks`. Durable visual examples are already committed in the Implementer evidence. No human playtest, mobile/alternate-browser matrix or balance assessment was performed; those are outside this assignment. No requested check remains unverified.

The unchanged assignment SHA-256 is `4900150586d386eeca20ca86e0eaab8a751b4717d9868ed39e0fb4dbbe87ad5e`. Report validation is mechanical and does not itself establish acceptance. The terminal handoff supplies the report-creating commit separately from the tested technical content.
