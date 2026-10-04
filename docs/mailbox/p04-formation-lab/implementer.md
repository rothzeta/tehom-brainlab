task: P04-impl
status: complete
outcome: P04.C1–C5 implemented and verified; independent review and Coordinator acceptance pending.
role: implementer
source_baseline: 0d6f23368f3cf21d1d14bc9bf0e8be34c0daff12
candidate_revision: 32f07c0063bc2162965ad5d21fc26fc160fa799b
tested_revision: 32f07c0063bc2162965ad5d21fc26fc160fa799b
artifacts:
  - docs/mailbox/p04-formation-lab/assignment-implementer.md
  - docs/mailbox/p04-formation-lab/implementer.md
  - docs/mailbox/p04-formation-lab/browser-evidence.json
  - docs/mailbox/p04-formation-lab/normal.png
  - docs/mailbox/p04-formation-lab/expand-preview.png
  - docs/mailbox/p04-formation-lab/spread.png
  - docs/mailbox/p04-formation-lab/placeholder.png
  - docs/mailbox/p04-formation-lab/failed-image.png
  - docs/mailbox/p04-formation-lab/credits.png
  - poc-001-linked-formation/.gitignore
  - poc-001-linked-formation/README.md
  - poc-001-linked-formation/package.json
  - poc-001-linked-formation/scripts/run.sh
  - poc-001-linked-formation/scripts/prepare-assets.mjs
  - poc-001-linked-formation/src/main.ts
  - poc-001-linked-formation/src/view/FormationLab.ts
  - poc-001-linked-formation/src/view/lab-state.ts
  - poc-001-linked-formation/src/view/projection.ts
  - poc-001-linked-formation/src/view/lab.css
  - poc-001-linked-formation/tests/view.test.ts
  - poc-001-linked-formation/tests/asset-copy.test.ts
  - poc-001-linked-formation/tests/browser-lab.mjs
verification:
  - "just poc-001-install: exit 0; pinned Docker Bun 1.4.2, frozen lockfile, 43 packages."
  - "just poc-001-test tests/formation.test.ts tests/commands.test.ts tests/asset-copy.test.ts: exit 0; 3 files, 130 tests."
  - "just poc-001-test: exit 0; 5 files, 151 tests, including unchanged 129 P01–P03 tests."
  - "just poc-001-typecheck: exit 0."
  - "just poc-001-build: exit 0; 9 prepared assets, 14 transformed modules; existing large Phaser chunk warning."
  - "Headless Chrome CDP browser-lab.mjs: exit 0; 136 assertions, 12 fixtures, 3 asset modes, 18 captures, zero uncaught exceptions. Exact command below."
  - "git diff --check and git diff --check 0d6f2336..HEAD: exit 0 at technical candidate."
  - "Protected-path diff against actual baseline: exit 0; core, existing tests, root assets and protected documents unchanged."
  - "Handoff validator with --repo: exit 0; ok true, three revisions resolved, diagnostics empty."
review: not-run
discoveries:
  - "Assignment BASE 0d6f2335 is a typo and does not resolve; actual starting HEAD and local master were 0d6f23368f3cf21d1d14bc9bf0e8be34c0daff12."
  - "Asset preparation requires root assets inside Docker; minimal scripts/run.sh wiring adds a read-only /assets mount."
  - "P03 optional O1–O3 remain untouched; this lab needs no change to core semantics."
blockers: []

Author: P04 Implementer. Date: 2026-10-04 UTC. Worktree `/opt/dev/tehom-brainlab-p04`, branch `p04-formation-lab`. Governing [assignment](assignment-implementer.md) and [P04 plan](../../plans/2026-10-02-9d81c6df-poc-001-formation-lab.md). Technical/tested revision is above; the evidence-only report-creating successor is returned in the terminal handoff. No merge, push, or branch/worktree deletion occurred.

## Changes and checkpoint evidence

C1 projects P02 coordinates onto the neutral 37-cell Phaser canvas, with three native labelled token buttons. C2 renders three solid/dashed labelled links, an exact textual pair/distance/state readout, and separate outlined destination ghosts. C3 consumes P03 through `LabSession`, with native hover/focus/click/Enter controls, Escape/cancel, reset and twelve explicitly labelled fresh test setups. C4 supplies bounded hash-checked asset copies, runtime fallback, placeholder mode, attribution and a six-emblem patrol reference gallery. C5 exercises the built application in real headless Chrome and preserves screenshots and state sequences.

The thirteen technical paths are listed in `artifacts`; the assignment, report, browser evidence and six PNGs are evidence-only successor paths. Reused existing `FormationLab.ts` rather than creating a second scene. Added view-local CSS instead of editing the P01 stylesheet. Minimal `main.ts` wiring mounts the shell and canvas. Package changes only chain preparation into dev/build; no dependency or lockfile change was needed.

**Necessary asset-copy component extension:** `scripts/run.sh` was not a named proposed view file, but the existing Docker wrapper mounts only the prototype. Its two-line change makes existing root masters available at `/assets` **read-only**, while retaining the prototype-local preparation script's `../assets` path in host and Docker modes. This is required wiring for the assigned asset-copy component, not a general pipeline or tooling redesign. Added prototype-local `.gitignore` for generated `public/tehom/`; root `.gitignore` is unchanged.

P02/P03 core modules and all existing tests are byte-identical to actual baseline. No `intents.ts`, `sectors.ts`, shared engine, combat/phase/action logic, root master, generated agent definition, protected document, plan or index changed.

## Acceptance criteria 1–7

[Browser evidence](browser-evidence.json) records actual viewport/version, core-compared fixtures, normal/placeholder/failed-image sequences, request failures, and served SVG hashes. The executable probe is [browser-lab.mjs](../../../poc-001-linked-formation/tests/browser-lab.mjs); it drives actual Chrome through CDP and imports production core selectors only for expected public outcomes.

| # | Result and observable evidence |
| --- | --- |
| 1 | Pass. All twelve fixture selections have revision zero and unused allowance; three distinct labelled token coordinates equal `formationPositions`, and all three textual pair/state/distance outputs equal `formationLinks`. Availability also equals actual P03 outcomes for every maneuver in every fixture. Board renders directly from `boardCells()` (37), exposes its count, and is visible in [normal.png](normal.png). The browser checks the count and twelve fixture outputs; 12 parameterized view tests cover the same public selection boundary. |
| 2 | Pass. Pointer expansion preview shows exact Spread-0 destinations: Ugallu `(3,0)`, Girtablilu `(-3,3)`, Pazuzu `(0,-3)`. Live positions, live shape/revision readout and unused allowance stay unchanged. Later committed positions equal those exact ghosts, revision becomes one, allowance becomes used and ghosts disappear. [expand-preview.png](expand-preview.png), [spread.png](spread.png), normal trace, and four frozen-input unit cases (all maneuvers) demonstrate equivalence. |
| 3 | Pass. Native Enter commits a focused clockwise preview once; all four maneuver buttons then disable. A physical pointer attempt on Expand changes no readout or coordinate. Visible explanation says the maneuver is used and names fresh fixture/reset recovery. Reset restores the original snapshot, no ghosts, and no selection; explicit tests also reset a pending preview and a selected Brood. Fixture selection clears both session remnants. Repeated in all three asset modes. |
| 4 | Pass. Focused clockwise preview and committed coordinates match Compact orientation one; anchor movement occurs while image CSS transform remains `none`. The browser checks every labelled token's bounds within 1280×800 and upright images for all twelve fixtures. Instructions/readouts and default layout fit that viewport. Six final screenshots were opened and visually inspected by the Implementer; additional fixture screenshots were captured automatically, with all ten other layouts visually inspected during precommit rendering checks. Solid/dashed links and readable textual equivalents survive rotation. |
| 5 | Pass. `?placeholder=1` makes **zero token-image requests**, shows geometric tokens and keeps all labels/inspection working. Its visible checkbox can also restore loaded emblems and return to placeholders without changing session state. CDP blocks `*tehom/tokens/ugallu.svg`; two actual image failures result (live token and reference gallery), both with blocked reason `inspector`. Ugallu falls back to geometry and remains selectable. Full cancel/rotate/second-attempt/reset/expand sequences pass in both modes; [placeholder.png](placeholder.png), [failed-image.png](failed-image.png). |
| 6 | Pass. Preparation copies exactly seven allowlisted SVGs and two attribution files. Asset tests compare every copied SVG SHA-256 with the manifest and all source bytes before/after; missing and corrupt Ugallu fail precisely before touching previous generated output. Final `dist/tehom/tokens/*.svg` hashes also match manifest values (preserved in browser evidence). Browser fetches bundled credits and license with HTTP 200 and loads all six patrol gallery emblems. [credits.png](credits.png) shows the attribution and reference gallery. Root `assets/` has no baseline diff. |
| 7 | Pass. Physical CDP pointer press/move/release drags from Ugallu toward an empty location; then a physical empty-centre-cell click occurs. Coordinates, revision/shape and allowance remain unchanged. Only token selection has a handler; no translation/individual movement command exists in the view. Unit inspection/same-shape rejection also leaves the full frozen combat snapshot unchanged. |

No human playtest is claimed. Browser evidence is independent of unit success: it executes the production build, native pointer inputs, focus and Enter/Escape in actual Chrome.

## Resolved implementation defaults

| Value / choice | Source and reason |
| --- | --- |
| P03 initial Compact / orientation 0, revision 0, round 1, player phase, unused maneuver | P04 Fixture and inputs; call `createInitialState()` directly rather than duplicate fixture data. HP and action fields retain P03's artificial values. |
| All twelve `formations()` as an explicit **Test setup — fresh lab fixture** selector | P04 Fixture and inputs. Selection creates a fresh factory snapshot with only formation replaced; never presented as a game action or budget reset. |
| Core `formationPositions`, `formationLinks`, and `applyCommand` for all geometry, link states and availability | Required contracts. Consume P02's existing default Close threshold without introducing another constant or legality rule. |
| Projection `(q+r/2, sqrt(3)*r/2)`, 85 px axial-neighbour spacing, origin `(380,295)`, 760×610 canvas | P02 public coordinate convention plus C1 implementation sizing. Fits the radius-three board and labels in the required 1280×800 desktop layout. View-local dimensions are presentation choices. |
| Solid Close links; dashed Stretched links (9 px strokes, 16 px period); labels plus exact textual pairs/distances | Adopt P04 Proposed implementation; generated legibility independent of artwork. Compact link captions offset 72 px (outer pair 118 px), Spread 24 px, after actual captures exposed initial token overlap. |
| Three dashed outlined destination ghosts, including stationary destinations, captions above outlines | Adopt P04 proposed ghosted anchors. Showing every Brood retains identity even when a destination equals its current anchor; distinct captions avoid covering the live token label. Ghosts are presentational and ignore pointer input. |
| Native labelled buttons/select/checkbox/details, no React | Adopt P04 Proposed implementation; keyboard-focusable controls and accessible readouts without another dependency. Focus/hover preview, native click/Enter commit, Escape/Cancel cancel. Blur/pointer-leave clears previews when focus does not retain them. |
| Commit uses current live revision; all commits/reset/fixture changes clear pending preview | P04 Required contracts. `applyCommand` runs again at commit and owns rejection/allowance semantics. Preview stores its result separately and never replaces live state. |
| Selected Brood initially absent; selection cleared by reset or fresh fixture | AC3 and proposed selected-creature readout. Roster-labelled tokens inspect rather than maneuver individually. |
| Upright 30×30 images in 42 px geometric frames; permanent name labels and stable gold/teal/lavender identity colors | Settled upright-art choice and AC4/5. Tiny symbolic emblems support readable units; neither color nor loading determines legality. |
| Placeholder mode unchecked initially; `?placeholder=1` or visible checkbox skips/removes image `src` | Fixture and asset-failure contracts. Direct query supports initial no-image-request evidence; checkbox provides normal inspection without a separate build. |
| Runtime `error` hides the failed image and exposes the labelled geometric frame | Adopt P04 Proposed implementation. Same selectable native button and text survive request failure. No asset error reaches the command boundary. |
| Exactly ugallu, girtablilu, pazuzu, warder, censer, harrier, foundry-mechanism SVGs + credits/license | Adopt P04 seven-file allowlist and existing manifest. Six patrol emblems displayed as a labelled reference gallery; the seventh is copied for asset-contract completeness, not a boss encounter. |
| Validate all sources/hashes before replacing generated output; precise missing/unreadable or SHA-256 mismatch errors | Adopt P04 Proposed implementation, strengthened to retain prior output on validation failure. Sources are read-only inputs. |
| Generated ignored `public/tehom/`; build copies served under relative `tehom/` URLs | Adopt P04 Proposed implementation and P01 `base:'./'`. No external asset server. Exact destinations below. |
| Preparation explicitly chained before dev/build in package scripts; preview serves existing build | Resolve proposed local predev/prebuild hooks as explicit `bun scripts/prepare-assets.mjs && ...` chains. Guarantees preparation runs for the existing Bun wrapper commands without relying on lifecycle-hook behavior. No new script entry or dependency needed. |
| Existing FormationLab scene; view-local session/projection/CSS; minimal root asset Docker mount | Starting-source ownership and smallest coherent change. Avoid parallel scene/render frameworks; wrapper access is necessary for the same bounded local script inside Docker. |
| Visible credits details, full source/license attribution links and bundled credits/license | P04 Required attribution contract and existing credits. Gallery/attribution expansion may scroll; default lab fits the test viewport. |

Exact generated/served destinations: `public/tehom/tokens/{ugallu,girtablilu,pazuzu,warder,censer,harrier,foundry-mechanism}.svg`, `public/tehom/CREDITS.md`, `public/tehom/licenses/game-icons-license.txt`. Vite's build places the same nine files under `dist/tehom/`; runtime URLs use the relative base, e.g. `./tehom/tokens/ugallu.svg`, `./tehom/CREDITS.md`, `./tehom/licenses/game-icons-license.txt`.

## Exact verification and environment

All application checks used the default Docker wrapper, pinned Bun 1.4.2 and Vitest 5.0.3. Commands below ran from the worktree root. Installation preceded implementation; the focused/full tests, typecheck, build, browser checks and whitespace/scope checks ran **after** technical candidate `32f07c0` was committed. No application host-mode fallback occurred.

| Command | Exit / actual result |
| --- | --- |
| `just poc-001-install` | Initial sandbox attempt exit 1: Docker daemon inaccessible. Successful bounded Docker escalation exit 0; 43 packages, frozen lockfile unchanged. |
| `just poc-001-test tests/formation.test.ts tests/commands.test.ts tests/asset-copy.test.ts` | 0; 3 files / 130 tests. Existing P02 3,349 and P03 253 matcher assertions reported by their unchanged suites. |
| `just poc-001-test` | 0; 5 files / 151 tests: P01 2, P02 90, P03 37, P04 view 19, P04 assets 3. |
| `just poc-001-typecheck` | 0; strict source and TypeScript tests. |
| `just poc-001-build` | 0; 9 prepared files, 14 transformed modules; JS 1,388.08 kB / gzip 362.56 kB, CSS 3.21 kB / gzip 1.27 kB. Existing >500 kB Phaser bundle warning remains. |
| `just poc-001-preview` | Started default Docker preview on localhost:4173; kept serving while final candidate was rebuilt, then final browser navigated with cache disabled. |
| `/home/metatron/.bun/bin/bun poc-001-linked-formation/tests/browser-lab.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p04-browser-final` | 0; HeadlessChrome 148.0.7778.96, CDP viewport 1280×800 at device scale 1; 136 assertions, 12 fixtures, 3 modes, 18 PNG captures (six retained), zero uncaught exceptions; 45 network requests, two deliberately blocked image failures. |
| `just poc-001-dev` | Final candidate: prepares 9 files before Vite becomes ready on localhost:5173. Startup exercised; detailed browser checks used built preview. |
| `git diff --check` | 0 at candidate; repeated for evidence/report successor. |
| `git diff --check 0d6f2336..HEAD` | 0 at candidate. |
| `git diff --exit-code 0d6f2336..HEAD -- assets poc-001-linked-formation/src/core poc-001-linked-formation/tests/commands.test.ts poc-001-linked-formation/tests/formation.test.ts poc-001-linked-formation/tests/smoke.test.ts docs/CURRENT.md docs/TASK_LOGS.md docs/plans` | 0 at candidate; unchanged protected/core/existing-test paths. |
| `git check-ignore poc-001-linked-formation/public/tehom/tokens/ugallu.svg` | 0; generated copy ignored. |
| `sha256sum poc-001-linked-formation/dist/tehom/tokens/*.svg` | 0; seven values match manifest; recorded in browser evidence. |
| `/home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p04-formation-lab/implementer.md --repo /opt/dev/tehom-brainlab-p04` | 0; `ok:true`, three existing revisions resolved, no diagnostics. Installed locked Ajv/YAML into ignored skill-local node_modules with `/home/metatron/.bun/bin/bun install --frozen-lockfile` (exit 0, six packages). Generated skill sources and lockfile unchanged. |

Chrome ran with its sandbox enabled, `--no-first-run --no-default-browser-check --disable-background-networking --remote-debugging-port=9234`, and a temporary `/tmp` profile. No safeguard-bypass flags were used. Chrome emits its existing software-WebGL fallback warning during Phaser capability detection; the application draws in Canvas. The test records runtime exceptions rather than claiming a complete console-error audit. The failed-image cases intentionally generate Chrome image errors. Temporary profiles, remaining fixture captures and raw Chrome stderr stay outside Git.

Precommit iterations: one typecheck failed because Phaser's polygon API requires `Vector2[]`; fixed without casting. The first browser probe failed to activate native Enter because its CDP key event omitted carriage-return text; adding proper native Enter text and bringing the page to front fixed the probe, with no custom app keyboard workaround. Captures exposed initial Close-caption overlap and a transient CSS grouping mistake hiding instructional text; both were corrected, then final committed checks passed. The initial handoff validator invocation returned exit 2 (`DEPENDENCY_UNAVAILABLE`); NODE_PATH cannot satisfy its explicit local-install guard. Installed its locked local dependencies and reran the exact assigned validator successfully. Earlier passing counts were 151 unit tests and 109/135 browser assertions; only the final 136-assertion run is the claimed tested-candidate browser evidence.

Assignment SHA-256 remains `c81d98c0a0088ffa4c5b4cf62aa1a92fc31ff15954031cb39039d15d6f40320b`; committed unchanged with this report. Actual starting/master revision differs only from the assignment's mistyped abbreviation, not from its stated worktree or branch. The Coordinator can correct BASE wording in a later assignment/status record; this worker preserves its assignment verbatim.

## Limits and hand-back

Both task-owned servers stopped with Ctrl-C (exit 130); `docker ps --filter publish=4173 --filter publish=5173 --format '{{.ID}} {{.Ports}}'` exited 0 with no containers. No blockers remain. Independent review, Coordinator acceptance and delivery are pending. P03 O1–O3 are preserved. This is a formation lab: no combat actions, enemies, damage forecasts, round driver, animation, final art, sound, deployment, mobile validation, browser matrix, human playtest or mutation-testing run. Contraction and anticlockwise commits are covered at the public view-session boundary; the actual browser committed clockwise and expansion, while checking all four controls' availability across all fixtures. Detailed interaction tests used built preview; dev startup/preparation was exercised separately.

The canvas captions identify link states, while the textual list resolves which pair and exact distance; this is particularly useful where Compact links share a line. All live names and final screenshot captions are readable at the test viewport after the spacing fix. Credits expansion intentionally scrolls, with the normal lab remaining within 1280×800. Source art stays unchanged, artwork/loading stays outside legality, and generated output is not committed.
