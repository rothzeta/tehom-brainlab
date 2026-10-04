task: CT-impl
role: implementer
status: complete
outcome: "Implemented CT.C1–CT.C4: true Compact triangles, ring-2 sectors, outward readable link captions, token hit tests and contraction browser evidence. All nine criteria verified."
baseline: 0f9c1b7d4d0ff01c4a890df8a8c4a4500737165e
starting_revision: c30e8cc9790030e7ee66060e7398ddacc7cad5e1
candidate_revision: 4fa7613f5c1b467377cef88bb89df5c30524a80d
tested_revision: 4fa7613f5c1b467377cef88bb89df5c30524a80d
artifacts:
  - docs/mailbox/compact-triangle/implementer.md
  - docs/mailbox/compact-triangle/assignment-implementer.md
  - docs/mailbox/compact-triangle/compact-0.png
  - docs/mailbox/compact-triangle/compact-4.png
  - branch compact-triangle
verification:
  - "Docker frozen installation: exit 0, 43 packages, Bun 1.4.2."
  - "Committed-candidate focused suites: exit 0, 3 files / 217 tests / 4499 matcher assertions."
  - "Committed-candidate full suite: exit 0, 7 files / 278 tests; 4949 actual matcher assertions across the suite's counters and a supplementary counter run over unchanged P01/P04 suites."
  - "Committed-candidate typecheck and build: exit 0 each; 9 prepared assets, 18 transformed modules."
  - "Built-candidate HeadlessChrome 148.0.7778.96 at 1280x800: exit 0, 176 assertions, 12 fixtures, 3 asset modes, 18 captures, zero uncaught exceptions. Six Compact captures visually inspected; two retained."
  - "BASE Spread comparison/default rules probe: exit 0, 21 checks."
  - "BASE..candidate whitespace and protected-path checks: exit 0; starting_revision..candidate protected design/agent paths unchanged."
  - "Leading handoff validator with --repo: exit 0, ok true, no diagnostics."
review: not-run
discoveries:
  - "The existing 112px token buttons already pass all 36 centre hit tests with the new geometry; no CSS or token sizing change was needed."
  - "A 72px outward caption offset clipped Compact orientation 4 at the canvas top. The final 60px offset is readable and outside every triangle without covering tokens."
  - "The existing large Phaser chunk warning remains."
blockers: []

Author: Compact-triangle Implementer, 2026-10-04 UTC. Governing [assignment](assignment-implementer.md), [CT plan](../../plans/2026-10-04-fb4bf201-poc-001-compact-triangle.md), accepted P02/P04/P05/P06 amendments and [Architect report](architect.md). Worktree `/opt/dev/tehom-brainlab-compact`, branch `compact-triangle`. Technical candidate and tested revision are identical above. The later report commit contains only this report, the unchanged assignment and two screenshots; its creating SHA is returned in the terminal handoff. Independent review, Coordinator acceptance and delivery remain pending.

## Changes and ownership

Eight technical files changed, all inside `poc-001-linked-formation/`:

- `src/core/hex.ts`: frozen clockwise `RING_TWO` table T, including frozen cells.
- `src/core/formation.ts`: Compact `R[3o+1],R[3o+2],T[2o+1]`, stable roster order and separate unchanged Spread expression.
- `src/core/sectors.ts`: append two ring-2 cells to each sector; existing front concatenation now gives ten cells.
- `src/view/FormationLab.ts`: choose each Compact caption's perpendicular away from the third vertex, with a 60px offset. Spread retains 24px.
- `tests/formation.test.ts`, `tests/intents.test.ts`, `tests/browser-lab.mjs`: only the authorized geometry updates and additional coverage detailed below.
- `README.md`: current public mapping, T table/rotation, distances, sector order and protection on both rings.

No generic geometry/layout layer, threshold/damage tuning or intent-selector logic change. `lab.css` was unnecessary. Protected P06/P03/P04 suites, lifecycle/transition/commands/state/smoke, projection/lab-state and assets are byte-identical to BASE. Brief/plans/agent configuration are byte-identical to the starting revision; their Architect changes already existed at startup. `docs/CURRENT.md` and `docs/TASK_LOGS.md` are unchanged. No merge, push, rebase or branch/worktree deletion.

## Every pre-existing test edit and its reason

1. **`tests/formation.test.ts`** — C2's twelve parameterized mapping cases replace the old ring-only expression with an independent hand-written six-row Compact table and exact `[3,3,2]` radii. Spread retains the original ring-index expectation and `[3,3,3]`. C4's twelve link cases replace Compact `[1,2,1]` with `[1,1,1]`, retaining endpoints, pair order, integer and classification coverage. The configurable-threshold case makes Compact all Close at 1, retains all Stretched at 0 and Spread all Close at 6, and adds Spread all Stretched at 5. Added two tests cover frozen T's exact twelve cells/radius/rotation and all eighteen Compact pairwise adjacencies. C1/C3/C5/C6 and error tests are unchanged. Count: 90 → 92 tests, 3385 executed matchers.
2. **`tests/intents.test.ts`** — Independent hand-written T and sector/front fixtures replace six-cell outer-only fronts with ordered ten-cell masks. AC1 checks five-cell sectors; added union/disjointness coverage checks exactly 30 distinct radius-2/3 cells. `area` now uses those ten cells, and related fixed/turned cell assertions use the same independent fixture. **`areaRecipients` and `turnedRecipients` values are unchanged.** Compact slots become explicit cells; Girtablilu marks now expect `R[3o+2]`. Spread slot values remain identical, represented as cells to share the mark assertion. Inclusive-boundary case expects all Compact Brood at splash radius 1, retains target-only radius 0, expects U↔P Close at threshold 1, and adds false at 0. Added inward Pazuzu protection and singleton fixed-area recipient case. Other outcome expectations are unchanged. Count: 75 → 77 tests, 809 executed matchers.
3. **`tests/browser-lab.mjs`** — Adds one `document.elementFromPoint` check for each Brood in each of twelve fixtures (36 assertions). Adds four contraction preview/commit checks, including the ring-2 destination, to fulfill CT/P04's required contraction evidence; stores the contraction trace. Every pre-existing assertion remains unchanged. Count: 136 → 176 browser assertions.

No tests were weakened or deleted. The added contraction checks strengthen the assignment's browser preview requirement; they change no existing assertion.

## Acceptance evidence (criteria 1–9)

| # | Observable evidence and result |
| --- | --- |
| 1 | Pass. Independent Compact table matches all six orientations; exact radii and all three adjacent pairs tested. Disposable probe imports BASE's actual formation module and compares all six Spread serializations byte for byte with candidate output. |
| 2 | Pass. Unchanged enumeration, C3 inverse rotations, six clockwise/anticlockwise turns, labelled axial-turn equality and both shape round trips pass for all twelve states. Roster ordering and nonoverlap remain exact. |
| 3 | Pass. Focused geometry/boundary cases verify `[1,1,1]` and `[6,6,6]`, Compact threshold 0/1 and Spread 5/6. Public default-link probe checks all twelve states plus unchanged `CLOSE_THRESHOLD=2`, `SPLASH_RADIUS=2` and `DEFAULT_DAMAGE_RULES={directionalReduction:2,shelterReduction:2,closeThreshold:2}`. |
| 4 | Pass. Six independently expected ordered sectors/fronts and their exact 30-cell partition pass. Existing six-facing Crosswind turn tests compare every resulting declaration cell in order with the next hand-written front, including 5→0. |
| 5 | Pass. P05 tests retain independent area/turned-area recipient tables across all twelve formations, area/mark/splash queries before and after every legal maneuver, and protection/active-link/isolation cases for every state with living or fallen Girtablilu. Maneuver destinations are among these twelve exhaustively checked states. Source/mark deaths and lone-survivor behavior remain covered. The added singleton `(1,1)` area returns only Pazuzu; its facing-zero protection selection explicitly reports Warder protection. |
| 6 | Pass. Unedited damage 48 tests, commands 37, view 19, smoke 2 and asset-copy 3 all pass in the full candidate suite. Protected-path diff exits 0. |
| 7 | Pass. Built Chrome lab checks all twelve core positions/link outputs/availability, all 36 pointer centres, upright artwork and on-screen token bounds. Expansion ghosts match committed Spread cells; new contraction ghosts match committed Compact cells including Pazuzu `(1,1)`. Native keyboard rotation, pointer selection, cancellation/reset, second-maneuver rejection, drag/empty-cell no-movement, placeholders and failed artwork remain passing. Zero uncaught exceptions. All six final Compact screenshots were opened and inspected; captions are outside their triangles, readable, unoccluded and inside the canvas. |
| 8 | Pass. README lists `RING_TWO`, exact T, its turn relation, accepted mapping, triangle radii/distances, five-cell sectors, ten-cell ordered fronts and both-ring protection. Search for old `[1,2,1]`, `3o+[0,1,2]`, always-outer or `ring cell` statements finds none. |
| 9 | Pass. Delivered invalid-input/error-message and frozen-input checks remain passing and unchanged, alongside new T freezing coverage. |

## Exact final-candidate commands and results

All commands ran from the worktree root unless stated. Application checks use the default Docker wrapper, pinned Bun 1.4.2 / Vitest 5.0.3. Docker, Git metadata writes and Chrome localhost access used approved sandbox escalation. Host Bun is used only for the assigned browser probe, disposable public-output comparison and report validator; no application host-mode fallback occurred.

| Command | Exit / result at `4fa7613` |
| --- | --- |
| `just poc-001-install` | 0 before implementation; 43 packages, frozen lockfile unchanged. |
| `just poc-001-test tests/formation.test.ts tests/intents.test.ts tests/damage.test.ts` | 0; 3 files / 217 tests / 4499 matchers (3385 + 809 + 305). |
| `just poc-001-test` | 0; 7 files / 278 tests versus delivered 274, four new tests. Suite counters: formation 3385, commands 253, intents 809, damage 305. |
| `just poc-001-typecheck` | 0; strict source and test checking. |
| `just poc-001-build` | 0; 9 assets prepared, 18 modules transformed, JS 1394.69 kB / gzip 364.57 kB; existing >500 kB chunk warning. |
| `just poc-001-preview` | Started localhost:4173 before candidate commit; served the final rebuilt candidate with Chrome cache disabled. Stopped by Ctrl-C after final check, exit 130. |
| `/home/metatron/.bun/bin/bun poc-001-linked-formation/tests/browser-lab.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/ct-browser-final` | 0; HeadlessChrome/148.0.7778.96, CDP 1.3, 1280×800 at device scale 1, 176 assertions, 12 fixtures, 3 modes, 18 screenshots, 0 exceptions, 2 deliberately blocked image failures. |
| `/home/metatron/.bun/bin/bun /tmp/ct-baseline/check.mjs` | 0; 21 checks: six BASE-byte-equal Spread serializations, twelve default-link classifications, three unchanged tuning rules/constants. BASE modules extracted with `git show 0f9c1b7:poc-001-linked-formation/src/core/{hex,formation}.ts` into `/tmp/ct-baseline/`. |
| `git diff --check 0f9c1b7d4d0ff01c4a890df8a8c4a4500737165e..HEAD` | 0. |
| Protected-path diff (exact arguments below) | 0, no output. |
| `git diff --exit-code c30e8cc9790030e7ee66060e7398ddacc7cad5e1..HEAD -- docs/plans docs/prototypes .agents .codex` | 0. |
| `docker ps --filter publish=4173 --format '{{.ID}} {{.Ports}}'` | 0, no preview containers after stopping the task-owned server. |
| `/home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/compact-triangle/implementer.md --repo /opt/dev/tehom-brainlab-compact` | 0; `ok:true`, revision resolution succeeds, no diagnostics. Skill-local dependencies were already installed. |

Full-suite matcher total is **4949**, combining actual suite counters (4752) with a supplementary run of the unchanged uninstrumented suites: smoke 2, view 180, assets 15 (197). The supplementary command exits 0, 3 files / 24 tests, at the same candidate:

```sh
docker run --rm --init --user "$(id -u):$(id -g)" --env HOME=/tmp --env BUN_INSTALL_CACHE_DIR=/tmp/bun-cache --env POC001_PORT=0 --volume /opt/dev/tehom-brainlab-compact/poc-001-linked-formation:/app --volume /opt/dev/tehom-brainlab-compact/assets:/assets:ro --volume /tmp/ct-assertions:/ct-evidence --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 sh ./scripts/toolchain.sh test tests/view.test.ts tests/smoke.test.ts tests/asset-copy.test.ts --config /ct-evidence/vitest.config.mjs
```

The disposable config spreads `/app/vite.config.ts` and adds only a setup file. Its setup imports Vitest's `afterEach`, `afterAll`, `expect`; accumulates `expect.getState().assertionCalls` after each test and prints totals after each file. No repository test/config edits. First counter startup with a read-only temporary mount failed exit 1 because Vite writes its temporary config bundle beside the config; the writable `/tmp` mount fixed it. No test assertion failed.

Exact protected-path check:

```sh
git diff --exit-code 0f9c1b7d4d0ff01c4a890df8a8c4a4500737165e..HEAD -- poc-001-linked-formation/src/core/damage.ts poc-001-linked-formation/src/core/lifecycle.ts poc-001-linked-formation/src/core/transition.ts poc-001-linked-formation/src/core/commands.ts poc-001-linked-formation/src/core/state.ts poc-001-linked-formation/src/core/smoke.ts poc-001-linked-formation/src/view/projection.ts poc-001-linked-formation/src/view/lab-state.ts poc-001-linked-formation/tests/damage.test.ts poc-001-linked-formation/tests/commands.test.ts poc-001-linked-formation/tests/view.test.ts poc-001-linked-formation/tests/smoke.test.ts poc-001-linked-formation/tests/asset-copy.test.ts assets docs/CURRENT.md docs/TASK_LOGS.md
```

Precommit formation check passed 92 tests / 3385 matchers; focused regression passed 217; full regression passed 278; typecheck/build and an initial browser check passed. Screenshot inspection then found the clipped caption and prompted the final 60px offset. Only the final-candidate checks above are claimed as final verification. Initial browser launch inside the restricted sandbox produced no captures and was terminated (130); approved launch completed with Chrome's own sandbox enabled. Initial Git staging/commit could not write the linked Git metadata outside the writable root; approved escalation created the technical commit. No automatic approval rejection or unresolved permissions blocker.

## Serialized orientation-zero outputs

Positions, preserving roster order:

```json
{"compact":[{"brood":"ugallu","cell":{"q":2,"r":1}},{"brood":"girtablilu","cell":{"q":1,"r":2}},{"brood":"pazuzu","cell":{"q":1,"r":1}}],"spread":[{"brood":"ugallu","cell":{"q":3,"r":0}},{"brood":"girtablilu","cell":{"q":-3,"r":3}},{"brood":"pazuzu","cell":{"q":0,"r":-3}}]}
```

Links serialized as labelled endpoints/distance/state, in public pair order (full endpoint cells are the positions above):

```json
{"compact":[{"from":"ugallu","to":"girtablilu","distance":1,"state":"close"},{"from":"ugallu","to":"pazuzu","distance":1,"state":"close"},{"from":"girtablilu","to":"pazuzu","distance":1,"state":"close"}],"spread":[{"from":"ugallu","to":"girtablilu","distance":6,"state":"stretched"},{"from":"ugallu","to":"pazuzu","distance":6,"state":"stretched"},{"from":"girtablilu","to":"pazuzu","distance":6,"state":"stretched"}]}
```

## Retained evidence and limits

Final captures `/tmp/ct-browser-final/fixture-{0,1,2,3,4,5}.png` were individually opened for visual inspection. [Compact 0](compact-0.png) and [Compact 4](compact-4.png) preserve the normal arrangement and the former clipping boundary. SHA-256: Compact 0 `b6635c4450076d6d8de6098482c78fffd660dd62df8897fb55d04842aef1e65c`; Compact 4 `1dcc8c574ccae68abd5bfbb261bc51eaea2b76bd4ce01a0aeea14e0cd5725f5f`. Other screenshots, browser trace/stderr, BASE modules and counter files remain disposable under `/tmp`. The unchanged assignment SHA-256 is `fa13d573ed084b3c8456e8547e4f28ead1a0b709f646d4dbce4ab6a5437996e7`.

Browser uses `--no-first-run --no-default-browser-check --disable-background-networking --remote-debugging-port=9234` and a temporary profile, with no Chrome sandbox-bypass flags. Chrome's existing software-WebGL warning is outside the runtime-exception check; Phaser renders the board in Canvas. No human playtest, mobile/browser matrix, encounter balance or independent review is claimed. No blockers or design-contract conflicts. No protected-document correction is needed beyond the Coordinator's ordinary acceptance/status updates.
