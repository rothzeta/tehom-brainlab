---
task: P10-impl
role: implementer
status: complete
outcome: All three patrol presets are playable through the real browser controls; all eight P10 criteria and required checks pass.
baseline: 767f46c4352fd3f2181550214e887a58f0df30a1
candidate_revision: 353dac7e134972e6e69b02914af10cbf1f2d34bb
tested_revision: 353dac7e134972e6e69b02914af10cbf1f2d34bb
artifacts:
  - docs/mailbox/p10-playable-patrol/assignment-implementer.md
  - docs/mailbox/p10-playable-patrol/implementer.md
  - docs/mailbox/p10-playable-patrol/browser-evidence.json
  - docs/mailbox/p10-playable-patrol/healthy-start.png
  - docs/mailbox/p10-playable-patrol/wounded-ugallu-start.png
  - docs/mailbox/p10-playable-patrol/wounded-girtablilu-start.png
  - docs/mailbox/p10-playable-patrol/victory.png
  - docs/mailbox/p10-playable-patrol/defeat.png
  - docs/mailbox/p10-playable-patrol/placeholder.png
  - docs/mailbox/p10-playable-patrol/fixed-area.png
verification:
  - "just poc-001-test: exit 0, 11 files / 434 tests."
  - "just poc-001-typecheck and just poc-001-build: each exit 0."
  - "just poc-001-test-browser: exit 0, all three scripts / 2419 browser assertions."
  - "Each browser script also ran separately: exit 0; lab 177, preview 24, patrol 2218 assertions."
  - "Patrol browser: eight recorded trace replays / 96 commands; zero uncaught exceptions and failed requests."
  - "git diff --check and unchanged baseline tests/core/assets/lockfile/protected-document checks: exit 0."
  - "Handoff validator with --repo /opt/dev/tehom-brainlab-p10: exit 0, ok true."
review: not-run
discoveries:
  - "Ordinary P08 patrols only announce following marks. An isolated test-owned page verifies fixed-area versus following rendering through the same scene and visible controls."
  - "The dependency-free CDP driver runs on host Bun/Chrome; application serving and application checks retain the default pinned Docker wrapper."
blockers: []
---

# P10 Implementer handoff

Implemented the [assignment](assignment-implementer.md) and [P10 plan with Amendment TR](../../plans/2026-10-02-e7c77542-poc-001-playable-patrol.md) on branch `p10-playable-patrol`. Technical candidate and tested revision are `353dac7e134972e6e69b02914af10cbf1f2d34bb`; the later report/evidence commit changes no application or test code. Independent review and Coordinator acceptance/delivery remain pending. No merge, push, rebase, branch deletion or worktree removal occurred.

## Result and changed files

Open `/?play=patrol`. Choose a preset, Brood, ability and target; inspect the preview, then confirm. All six abilities, Crosswind directions, four shared maneuvers, early End phase, victory/defeat and restart are available through text-labelled controls. `/?` remains the P04 lab and `/?preview=patrol` remains the P09 fixture.

| Files | Change / checkpoint |
| --- | --- |
| `poc-001-linked-formation/src/view/CombatScene.ts`, `combat.css` | C1–C3/C5: native controls/readouts, Phaser board, upright existing assets, ring-2 anchors, separate centre cluster, selector-derived links/fronts/marks, previews, feedback and terminal behavior. |
| `poc-001-linked-formation/src/view/patrol-session.ts` | C2–C3: thin adapter over the existing P09 `LabSession.confirmPreview`; original command/revision submission, a 400 ms presentation lock, timer cancellation and session-generation reset guard. |
| `poc-001-linked-formation/src/main.ts` | C1: minimal `play=patrol` route and scene/canvas dimensions; existing routes retained. |
| `poc-001-linked-formation/tests/browser-patrol.mjs` | C4: real CDP pointer/keyboard controls, all preset starts, eight complete recorded replays, projection/resource/reset/terminal checks. No direct gameplay dispatch into the page. |
| `poc-001-linked-formation/tests/browser/{fixtures.ts,patrol-fixture.ts}` | C4: explicit fixed-area/following declarations and isolated scene entry, compiled by pinned Bun for an intercepted test-only document. No production entry or fixture selector. |
| `poc-001-linked-formation/tests/patrol-session.test.ts` | Three public-controller boundary tests: isolated preview, once-only submission/serialization/stale revision; reset/callback cancellation/stale session; terminal rejection/restart. |
| `poc-001-linked-formation/scripts/{browser-checks.mjs,run.sh,toolchain.sh}`, `package.json` | Prototype-local `test:browser` script and `test-browser` wrapper dispatch; all three browser scripts run sequentially, with Docker preview startup/readiness/cleanup. |
| `justfile` | Exactly one thin `poc-001-test-browser` recipe, matching the existing wrapper pattern. |
| `poc-001-linked-formation/README.md` | Only the added P10 section: controls, route, rendering/session decisions, browser prerequisites/commands and test-fixture boundary. |
| This mailbox | Assignment unchanged, report, browser evidence and seven inspected screenshots. |

There are **no new application or dev dependencies** and no lockfile change. No core/content, existing tests, source art, generated shared agent definitions, ADRs, plans/index, brief, `CURRENT.md` or `TASK_LOGS.md` changed. Existing P04/P09 source is also unchanged.

## Acceptance criteria 1–8

Evidence is the executed [browser probe](../../../poc-001-linked-formation/tests/browser-patrol.mjs) and [browser-evidence.json](browser-evidence.json), which retains actual browser outputs, final trace snapshots and the unchanged lab/preview probe evidence. Browser checks use HeadlessChrome **148.0.7778.96**, a **1280×800** viewport and device scale 1, with cache disabled. Native CDP inputs activate actual controls; browser evaluation only inspects the page or focuses controls. Core functions run outside the browser solely to derive expected results.

| # | Observable evidence and result |
| --- | --- |
| 1 | Pass. Native preset selection starts healthy, wounded Ugallu and wounded Girtablilu in both artwork modes. Every displayed entity HP/max HP, revision/round/phase, Brood coordinate and intention source/anchor equals `createPatrol`, `formationPositions` and `previewFacts`. Each of the six tokens independently passes `elementFromPoint` at its pointer centre, physical selection and viewport bounds for all three starts in both modes. Screenshots: [healthy](healthy-start.png), [wounded Ugallu](wounded-ugallu-start.png), [wounded Girtablilu](wounded-girtablilu-start.png). |
| 2 | Pass. All four stored [P08 traces](../p08-patrol-round-loop/traces.json) play through native actor/ability/target/Confirm or End phase controls in **both** modes: eight complete replays, 96 recorded commands. Every accepted browser step matches the current public `applyCommand` result, with the final HP and outcome also equal to the recorded headless transcript. [Victory](victory.png), [defeat](defeat.png); exact table below. |
| 3 | Pass. Target hover and maneuver focus previews leave live HP/revision/formation unchanged; immediate HP/outcome, ghost destinations, living links, Shelter eligibility, protection gained/lost, recipients/anchors and the conditional forecast equal P09. Shelter followed by expansion shows `Close link lost`; Escape cancels without spending, then the committed expansion matches the projected result. Crosswind changes facing/protection exactly as projected. The isolated test-owned page displays both `fixed cells` and `follows creature`, previews/commits a real shared rotation, preserves the six fixed front cells while moving the creature mark, and demonstrates masks on both rings. [Fixed-area screenshot](fixed-area.png). Ordinary P08 does not execute fixed-area declarations; its command rejects the synthetic End phase, and this page visibly reports that rejection rather than inventing a forecast. |
| 4 | Pass. Actual double pointer activations on the first trace command and shared expansion spend only one revision/action/maneuver; the presentation lock is visible. Used actor and maneuver buttons disable with core reasons `already-acted` / `maneuver-used`, and physical attempts leave the live snapshot unchanged. A pending pointer activation interrupted by keyboard restart cannot spend a resource; reset clears its old preview before further pointer input. Exact cached stale revision/session rejection is additionally exercised at the public controller boundary without modifying the earlier P09 tests. |
| 5 | Pass. End phase's visible label reports the current number of unused living actions; the forfeit trace ends early every round. The resulting feedback says unused actions were forfeited. The native history control opens a rendered ordered event list; its attack source order equals the real core event sequence, and the next round's HP/phase/revision/anchors equal the same atomic transition. |
| 6 | Pass. In each artwork mode the browser starts End phase, observes the active feedback lock, immediately clicks Restart, then waits 600 ms (beyond the cancelled 400 ms timer). The complete observed fresh snapshot, including HP/phase/round, coordinates, intentions, ghosts, combat controls and event/feedback readouts, remains identical before/after that old deadline and equals the selected factory. The controller test also verifies that the cancelled callback does not notify the view at all. |
| 7 | Pass. Every terminal trace disables all combat choices with its terminal reason. Physical End phase, maneuver and Enter attempts leave HP unchanged. Restart restores the selected preset after every terminal battle in both modes. Patrol probes report zero uncaught exceptions and zero failed requests; the unchanged lab and preview probes also report zero exceptions. [Placeholder mode](placeholder.png) makes zero token-image requests during its initial preset/selection sequence and plays the complete traces. |
| 8 | Pass. The combat DOM has no `#fixture` selector. The browser checks exactly the two declared abilities for each Brood and exactly the four shared maneuvers. Dragging a Brood leaves coordinates unchanged. Only shared maneuver, planned ability and End phase command constructors exist in the production combat controls; preset selection explicitly starts a fresh battle rather than changing the existing formation for free. |

The three presets are playable to terminal outcome; this does not establish that every preset/strategy wins. These are automated browser observations, **not a human playtest**.

## Recorded trace comparison

Each row was reproduced in normal **and** placeholder mode; the arrays are actual browser observations compared to both core replay and the stored P08 result. Unit assertions do not freeze provisional defaults: selector/forecast expectations come from the fixture's stored rules and public core. The explicit old-transcript comparison is intentional because this assignment requires those recorded final results.

| P08 trace ID (preset / strategy) | Commands | Terminal round / outcome | Brood HP `[U,G,P]` | Enemy HP `[W,C,H]` |
| --- | --- | --- | --- | --- |
| healthy / attack | 14 | 4 / victory | `[0,8,8]` | `[0,0,0]` |
| wounded-ugallu / attack | 14 | 5 / defeat | `[0,0,0]` | `[0,0,7]` |
| wounded-girtablilu / attack | 16 | 6 / victory | `[0,0,1]` | `[0,0,0]` |
| healthy / forfeit | 4 | 4 / defeat | `[0,0,0]` | `[12,10,13]` |

## Decisions and boundaries

All gameplay remains P03/P08 `applyCommand`, reached through P09 `confirmPreview`. Core state never lives in Phaser objects; event/timer presentation never applies damage. The sole presentation callback releases the lock and refreshes the screen, guarded by its generation; reset also clears its timeout. Selection controls do not submit commands. Controls derive legality from P09 facts or real command projections; no alternate damage, protection, targeting or formation rules were introduced.

The existing P04 asset pipeline, upright emblem/fallback styling and axial projection are reused. P10 owns the presentation origin `(310,240)`, spacing `102`, and centre-relative offsets Warder `(-44,-29)`, Censer `(44,-29)`, Harrier `(0,37)` pixels. All enemies still have **no board coordinate**. These view dimensions and the 400 ms feedback duration are provisional presentation choices. The token labels were sized to remain separate around the cluster and its adjacent ring-1 Brood. I opened and visually inspected **all seven retained final screenshots**, including all preset starts, win/loss, placeholders and both-ring fixed-area telegraphs. The default controls fit the required desktop viewport; expanded previews/history/credits may scroll.

The fixed-area fixture's injected factory is a bounded test input at the public scene/session boundary, never a browser gameplay API. Its separately compiled test document uses the production stylesheet and real scene. No fixture page/bundle is written to `dist` or the repository; Bun's generated bundle and browser profiles remain disposable. This is necessary to test the declared area/mark rendering contract while keeping ordinary P08 presets and commands unedited.

The browser driver uses already installed host Chrome and pinned Bun 1.4.2, following the existing dependency-free P04/P09 probes. The application build/serving and unit/type checks use the default Docker wrapper. No `POC001_MODE=host` application fallback occurred. All Docker and local-network execution used bounded escalations, with no automatic-review rejection or outstanding permission request. Chrome's sandbox remains enabled; no bypass flags were added.

## Exact final verification

All commands below ran in `/opt/dev/tehom-brainlab-p10` **after** technical candidate `353dac7` was committed. Browser build serving was Docker Vite preview on `http://localhost:4173/`. Counts below are actual executions, not inferred from source or unit success.

| Command | Exit / result |
| --- | --- |
| `just poc-001-test` | 0; **11 files / 434 tests**. P02 1,361, P03 253, P05 810, P06 305, P07 1,072 and P08 492 reported assertions; P09 324 comparisons per preset, each repeated. Existing suites unedited. |
| `just poc-001-typecheck` | 0; strict source/test TypeScript. |
| `just poc-001-build` | 0; 9 prepared asset files, 26 transformed modules; JS 1,424.64 kB / gzip 372.08 kB, CSS 4.48 kB / gzip 1.58 kB. Existing Phaser >500 kB warning remains. |
| `PATH=/home/metatron/.bun/bin:$PATH just poc-001-test-browser /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p10-browser-final-all` | 0; wrapper-owned Docker preview became ready and stopped afterwards; **3 scripts / 2,419 browser assertions**. Lab 177, preview 24, patrol 2,218. Aggregate captures 18 + 2 + 7; seven P10 screenshots retained. |
| `just poc-001-preview` | Docker preview started for separately required individual probes; stopped with Ctrl-C, exit 130. |
| `/home/metatron/.bun/bin/bun poc-001-linked-formation/tests/browser-lab.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p10-browser-final-individual/lab` | 0; 177 assertions, 12 fixtures, normal/placeholder/failed-image modes, 18 captures, zero exceptions; two deliberate blocked-image request failures. |
| `/home/metatron/.bun/bin/bun poc-001-linked-formation/tests/browser-preview.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p10-browser-final-individual/preview` | 0; 24 assertions, 2 captures, zero exceptions. |
| `/home/metatron/.bun/bin/bun poc-001-linked-formation/tests/browser-patrol.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p10-browser-final-individual/patrol` | 0; 2,218 assertions, 8 trace replays / 96 recorded commands, 7 captures, zero exceptions and failed requests. |
| `git diff --check` | 0; repeated after recording evidence/report. |
| `git diff --check 767f46c..HEAD` | 0. |
| `git diff --exit-code 767f46c..HEAD -- $(git ls-tree -r --name-only 767f46c -- poc-001-linked-formation/tests)` | 0; every baseline test, including both existing browser scripts, is byte-for-byte unchanged. |
| `git diff --exit-code 767f46c..HEAD -- poc-001-linked-formation/src/core poc-001-linked-formation/src/content poc-001-linked-formation/bun.lock assets .agents docs/CURRENT.md docs/TASK_LOGS.md docs/adr docs/plans` | 0; unchanged core/content, frozen dependencies, assets/generated definitions and protected documents. |
| `docker ps --filter publish=4173 --format '{{.ID}} {{.Ports}}'` | 0; no remaining preview container on the task port. |
| `/home/metatron/.bun/bin/bun /tmp/p10-handoff-skill/scripts/validate.ts docs/mailbox/p10-playable-patrol/implementer.md --repo /opt/dev/tehom-brainlab-p10` | 0; `ok:true`, no diagnostics, all three revision references resolve. |

Setup before the candidate: `just poc-001-install` exited 0, installed 43 packages with the frozen lockfile, unchanged. For handoff tooling, `cp -a .agents/skills/ruach-handoff /tmp/p10-handoff-skill` exited 0 and `/home/metatron/.bun/bin/bun install --cwd /tmp/p10-handoff-skill --frozen-lockfile` exited 0 (six pinned tool packages). The validator runs from this unchanged temporary skill copy so generated repository definitions need no edits or installation writes.

Precommit corrections: one typecheck rejected `fromId`/`toId` on the preview's lab/combat link union; the view now uses the shared public endpoint labels. One full browser run reached all trace outcomes but failed the isolated test-page startup because the temporary Bun bundle lacked Vite's `BASE_URL`; the fixture build now supplies that explicit test-owned value and UTF-8 encoding. Two later probe failures mistook fresh hover previews caused by pointer movement/scrolling for stale previews; the probe now parks the pointer before settlement and checks reset clearing before a new input. No existing assertion or core rule was weakened. Final aggregate and individual runs both pass against the committed candidate.

Chrome emits its existing software-WebGL warning during Phaser capability detection; the application uses Canvas. P10 records runtime unhandled exceptions and network failures, rather than claiming an exhaustive browser-console audit. The two P04 image failures are deliberate and required by its unchanged fallback probe. Raw Chrome stderr, transient test bundles, profiles and duplicate screenshots remain outside Git.

Assignment SHA-256: `212d258009d32d3a3cd574d4ee89ba83321da0d600d48ba6a3af410986ee850f`; preserved unchanged and committed with this report.

## Remaining work and proposed canonical updates

No implementation blocker or required unexecuted check remains. Independent review, Coordinator acceptance and delivery remain separate work. Browser ability commits cover all six abilities and clockwise Crosswind; anticlockwise Crosswind is exposed as a separate target choice and covered by the unedited P09 equivalence suite, but was not separately committed by this browser probe. No human playtest, mobile/browser matrix, accessibility certification, deployment, audio or polished animation is claimed.

The Coordinator can update `CURRENT.md`, `TASK_LOGS.md` and the P10 plan/index status from this evidence after acceptance. Older prototype README sections describing combat as later work are historical; the new P10 section documents the playable route. This worker did not edit protected status documents or earlier README sections outside the assigned P10 section.
