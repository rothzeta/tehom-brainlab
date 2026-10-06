task: P15
role: implementer
worker: p15-implementer
status: complete
outcome: "Two-phase Crucible implemented; authorized one-line preview correction verified, both browser runs recorded, native exports/replay and screenshot inspections complete. No tests edited for the correction."
baseline: 6ebe1703c94c2bdb404fd3bcdcfa212336a18b7c
candidate_revision: e685c3cf24f1b997fcc2cd71cad76bdada4f95f0
tested_revision: e685c3cf24f1b997fcc2cd71cad76bdada4f95f0
previous_tested_revision: f08f473f15cbda093990e1455e320c035d9f6f77
blocked_report_revision: e4cc38c19baee1f90633bb2ef3d68c576bcb8d64
artifacts:
  - docs/mailbox/p15-crucible/assignment-implementer.md
  - docs/mailbox/p15-crucible/implementer.md
  - /tmp/p10-browser-Y6LZa2
  - /tmp/p10-browser-VfueaR
  - /tmp/p15-fixed-browser
  - /tmp/p10-browser-92DILO
  - /tmp/p15-final-browser
changed_paths:
  - docs/mailbox/p15-crucible/assignment-implementer.md
  - docs/mailbox/p15-crucible/implementer.md
  - poc-001-linked-formation/README.md
  - poc-001-linked-formation/src/content/crucible.ts
  - poc-001-linked-formation/src/core/encounters.ts
  - poc-001-linked-formation/src/core/preview.ts
  - poc-001-linked-formation/src/core/rounds.ts
  - poc-001-linked-formation/src/core/run-record.ts
  - poc-001-linked-formation/src/core/transition.ts
  - poc-001-linked-formation/src/main.ts
  - poc-001-linked-formation/src/view/CombatScene.ts
  - poc-001-linked-formation/src/view/patrol-session.ts
  - poc-001-linked-formation/tests/browser-crucible.mjs
  - poc-001-linked-formation/tests/browser/crucible-fixture.ts
  - poc-001-linked-formation/tests/browser/crucible-fixtures.ts
  - poc-001-linked-formation/tests/crucible.test.ts
verification:
  - "C1 just poc-001-test: exit 0; 517 existing tests passed unedited before Crucible content."
  - "just poc-001-test (final isolated rerun at tested_revision): exit 0; 17 files, 537 tests. First concurrent invocation exited 1 with 535 pass / two five-second timeouts; no code/test/timeout changes before successful rerun."
  - "just poc-001-typecheck: exit 0 at tested_revision."
  - "just poc-001-build: exit 0 at tested_revision; existing bundle-size warning."
  - "just poc-001-test-browser run 1, non-PTY: exit 130 during preview shutdown after all four suites passed 4985 assertions; zero browser exceptions; output /tmp/p10-browser-Y6LZa2."
  - "just poc-001-test-browser run 2, PTY: exit 0; all four suites passed 4985 assertions, zero browser exceptions; output /tmp/p10-browser-VfueaR. Both commands bare from repository root, no environment overrides."
  - "bun tests/browser-crucible.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p15-fixed-browser http://localhost:4173/: exit 0 from prototype cwd; 330 assertions, 11 screenshots, zero uncaught browser exceptions; native exports embed tested_revision."
  - "just poc-001-replay /tmp/p15-fixed-browser/phase-crossing.json: exit 0; 26 commands, 100 events, revision 26, round 6, victory."
  - "just poc-001-replay /tmp/p15-fixed-browser/phase-two-diagnostic.json: exit 0; 4 commands, 15 events, revision 4, round 2, player."
  - "just poc-001-replay /tmp/p15-fixed-browser/patrol.json: exit 0; fresh empty patrol, revision 0, round 1, player."
  - "just poc-001-replay /tmp/p10-browser-Y6LZa2/records/healthy-attack.json: exit 0; nonempty native patrol, 14 commands, 71 events, revision 14, round 4, victory."
  - "git diff --check 6ebe1703c94c2bdb404fd3bcdcfa212336a18b7c..HEAD: exit 0; protected-path and every-existing-test preservation checks in body exit 0."
  - "bun /tmp/p15-masks.ts: exit 0; reran complete 72-case mask computation at corrected candidate."
  - "Opened all eleven corrected-candidate Crucible-harness screenshots and the existing patrol fixed-area capture; all required plan views inspected."
  - "bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p15-crucible/implementer.md --repo /opt/dev/tehom-brainlab-p15: exit 0; ok true, no diagnostics, all five revision references resolved."
review: not-run
discoveries:
  - "Original preview-format blocker resolved by the exact Coordinator-authorized one-line change. Turnability labels remain only in the intentions list; all existing tests remain unchanged."
  - "First browser recipe repeated P14's shutdown exit 130 after all suites passed; second bare recipe with a PTY exited 0. Cause unconfirmed, no runner change or fix claimed."
  - "Concurrent unit invocation timed out in two exhaustive cases; unchanged bare command run alone passed all 537 tests."
  - "Assignment p15-crucible report destination supersedes the plan's p15-central-boss spelling; no protected document edited."
blockers: []

Author: p15-implementer. Assignment: [assignment-implementer.md](assignment-implementer.md), committed unchanged. Contract: [P15](../../plans/2026-10-06-6dcd120b-poc-001-two-phase-central-boss.md). Branch `p15-crucible`; no merge or push. Implementation and initial report were committed together at `f08f473f15cbda093990e1455e320c035d9f6f77`; the authorized correction is `e685c3cf24f1b997fcc2cd71cad76bdada4f95f0`. Current checks and exports identify the corrected candidate. This final report is an evidence-only successor; its creating SHA is returned in the terminal handoff.

## Resolved blocked episode

The initial candidate `f08f473f15cbda093990e1455e320c035d9f6f77` failed `just poc-001-test-browser` (exit 1) at existing `tests/browser-patrol.mjs:120`, **“all projected recipients and anchors equal P09”**, reached by the fixed-area fixture at line 410. The view had accidentally added turnability text to the preview panel's `Threats:` line. P15 requires that format unchanged. Work stopped under the plan's explicit condition, and the blocked handoff was committed at `e4cc38c19baee1f90633bb2ef3d68c576bcb8d64` with the diagnosis and proposed one-line restoration. Historical checks/captures remain documented in that report revision and at `/tmp/p10-browser-92DILO` and `/tmp/p15-final-browser`.

The Coordinator subsequently explicitly authorized exactly that correction, no test edits, a new candidate, all bare checks, two browser recipe runs, new native exports/replay and screenshot inspection. Commit `e685c3cf24f1b997fcc2cd71cad76bdada4f95f0` changes only the fixed-area branch in `renderPreview`'s `Threats:` template back to `'fixed cells'`. Turnability labels remain in `renderFacts`'s `#intentions` list. The existing test remains unchanged. The round skeleton was not implicated or changed. This resolves the original blocker; current results are recorded below.

## Implemented scope

- Explicit patrol/Crucible registry with factories, presets, state recognition, end phase, preview rules, codec identities and existing-emblem mapping.
- Shared synchronous end-phase lifecycle; patrol keeps its validation, ordered sources, damage and announcement. C1 passed all 517 existing unit tests before Crucible content was added.
- Crucible content captures HP, threshold, damage rules and pattern table in serialized rules. Boss is anchored at `(0,0)`, rotatable, self-protected, and resolves primary then secondary with distinct occurrence IDs. Marks use exact HP-fraction comparison and roster ties. Fallen marks fizzle, and boss death wins without more attacks.
- Announcement-only phase entry through the shared `phaseTwoPending` selector. Current attacks resolve under their current phase and beat. Entry emits one event, resets to A and retains facing/HP. Only B advances the current facing clockwise, including after Crosswind.
- Registry-backed forecasts and version-selected record validation/replay. Envelope stays version 1; patrol version remains `poc-001-rules-v3/patrol-v2/p14-v1`; Crucible version is `poc-001-rules-v3/crucible-v1/p14-v1`.
- `?play=crucible`, encounter header links/presets, clean reset, existing Foundry Mechanism emblem, pending/active phase indicator, intentions-list turnability labels and per-protection-source facing text. Unknown routes still open the lab; placeholder query survives navigation. Patrol constructor and text remain compatible; the fixed-area preview retains its original Threats format.
- README describes Crucible, registry/forecast/record changes and the user's explicit boss-work authorization while retaining historical P11 HOLD.

Only assigned source components, additive tests, prototype README and the assigned mailbox artifacts changed. All pre-existing tests and protected paths match BASE. P13/P14 behavior was not edited. No generated role/skill source changed.

## Verification at the candidate

Every final recipe below ran from the repository root bare, with the ordinary inherited environment, no Chrome/mode/port overrides. The browser recipe independently built a fresh production bundle and managed its preview before the separate required standalone build. Sandbox escalation permitted Docker/Chrome access; no automatic approval rejection occurred.

| Exact command | Actual result |
| --- | --- |
| `just poc-001-test` (final isolated rerun) | Exit 0; 17 files, 537 tests. All 517 existing tests unchanged; 20 additive Crucible cases. |
| `just poc-001-typecheck` | Exit 0. |
| `just poc-001-build` | Exit 0; existing large-bundle warning only. |
| `just poc-001-test-browser` (run 1, non-PTY) | Exit 130 during preview shutdown after all four suites reported success: 197 + 24 + 4572 + 192 = 4985 assertions, zero browser exceptions. Output `/tmp/p10-browser-Y6LZa2`. |
| `just poc-001-test-browser` (run 2, PTY) | Exit 0; all four suites passed 4985 assertions, zero browser exceptions. Output `/tmp/p10-browser-VfueaR`. |
| `bun tests/browser-crucible.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p15-fixed-browser http://localhost:4173/` | Exit 0; 330 assertions, 11 screenshots, zero uncaught browser exceptions. Prototype cwd. Used run 1's fresh candidate preview while the standard runner owned it. |
| `just poc-001-replay /tmp/p15-fixed-browser/phase-crossing.json` | Exit 0; commands 26, events 100, revision 26, round 6, victory. |
| `just poc-001-replay /tmp/p15-fixed-browser/phase-two-diagnostic.json` | Exit 0; commands 4, events 15, revision 4, round 2, player. |
| `just poc-001-replay /tmp/p15-fixed-browser/patrol.json` | Exit 0; fresh empty patrol export, commands/events/revision 0, round 1, player. |
| `just poc-001-replay /tmp/p10-browser-Y6LZa2/records/healthy-attack.json` | Exit 0; nonempty native patrol export, commands 14, events 71, revision 14, round 4, victory. |
| `git diff --check 6ebe1703c94c2bdb404fd3bcdcfa212336a18b7c..HEAD` | Exit 0 at the corrected candidate. |
| Protected paths and existing-test preservation commands below | Exit 0 with no diff. |
| `bun /tmp/p15-masks.ts` | Exit 0; reran all 72 formation/facing combinations; complete count table below remains unchanged. |

Both browser recipes were exactly `just poc-001-test-browser`, from the root, with no `POC001_CHROME`, `CHROME_PATH`, mode, port or other hand-set environment. Run 1 used the tool's non-PTY default. Run 2 used `tty: true`, following the existing P14 shutdown observation; no application, test, runner or wrapper change accompanied it. Run 1's exit 130 is recorded rather than counted as a clean recipe exit. Its complete per-suite success establishes assertions ran; the successful second recipe establishes a clean end-to-end execution. No manual interrupt or extra process signal was sent by this worker. Shutdown cause remains unconfirmed; the earlier P14 report records the same symptom.

The first unit invocation at this candidate ran concurrently with typecheck and the first browser build and exited 1: 535 tests passed; an existing preview matrix case and the new phase-one Compact matrix case exceeded five seconds. No assertion mismatch was reported. The exact same bare `just poc-001-test` command run alone then passed 537/537 at the unchanged candidate. This is consistent with resource contention; no test, configuration or timeout adjustment was made. Both invocations are retained as execution history.

Chrome selected by the bare runner: `/home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell`; printed reason **highest executable Playwright version (chromium_headless_shell-1223)**. Both browser runs selected that same executable; the additive harness used it on a distinct CDP port. Lab's two failed-image requests are intentional fallback coverage.

Exact preservation checks:

```sh
git diff --exit-code 6ebe1703c94c2bdb404fd3bcdcfa212336a18b7c..HEAD -- poc-001-linked-formation/src/core/{hex,formation,sectors,intents,damage,lifecycle,abilities,state,commands,smoke}.ts poc-001-linked-formation/src/content/{patrol,brood}.ts poc-001-linked-formation/src/view/{FormationLab,lab-state,projection}.ts poc-001-linked-formation/scripts poc-001-linked-formation/bin poc-001-linked-formation/{package.json,bun.lock,runtime.env,tsconfig.json,vite.config.ts,vitest.config.ts,index.html} justfile assets docs/plans docs/adr docs/prototypes docs/CURRENT.md docs/TASK_LOGS.md
git diff --exit-code 6ebe1703c94c2bdb404fd3bcdcfa212336a18b7c..HEAD -- $(git ls-tree -r --name-only 6ebe1703c94c2bdb404fd3bcdcfa212336a18b7c poc-001-linked-formation/tests)
```

Development-only checks before the candidate passed the 517-test patrol-only C1 checkpoint, then the 533-test first Crucible suite and a 330-assertion browser run. The added exhaustive legal-action matrix initially exceeded the test runner's five-second timeout as one case. Splitting it into four independently labelled phase/shape cases retained every assertion and passed; no runner configuration or existing test changed. Development type errors in new generic/test annotations were corrected before the candidate. Missing prototype dependencies were installed with `just poc-001-install` (43 pinned packages). Missing validator dependencies were installed with `bun install --frozen-lockfile` in the skill directory (six ignored packages); generated files stayed unchanged. Initial sandbox-only Docker access and skill dependency installation failed; escalated retries succeeded.

## Contract coverage and observed native traces

New tests use explicit local HP, threshold, damage, mitigation and patterns rather than copying provisional tuning into expectations. Geometry assertions derive recipient identities from formation positions and masks. The phase/shape/facing matrix verifies actual declarations and every legal ability/maneuver against real preview results while preserving input snapshots and boss anchoring. Controlled facings cover A/B cadence, both Crosswind directions, phase entry and the phase-two diagnostic start. Other cases protect primary/secondary order, fallen-target fizzle, primary-killed mark, terminal interruption, Shelter consumption, deferred threshold transition, clean budgets/reset and malformed/versioned records.

Both phases have mechanical traces using both maneuver categories in one round plus Shelter and Crosswind; these are automated traces, not human evidence.

The native product-route phase-crossing attempt chose shapes/rotation using public threat selectors and used Claw, Impale/Sting and Gale. It reached phase two at round 4 / transition revision 13. The boundary's actual event order was:

`enemy-phase-started → attack-settled → attack-settled → damage-applied → enemy-phase-ended → round-started → boss-phase-changed → intentions-announced`.

The threshold-crossing player's declarations stayed intact; the pending indicator appeared before the next announcement, and the native forecasts matched committed HP/events around entry. Final round 6 victory left Ugallu 4/18, Girtablilu 12/14, Pazuzu 12/14 and the boss 0/60 at `(0,0)`, facing 2. These are observed results of the current provisional content, not test-pinned tuning or balance conclusions.

The native diagnostic attempt started at phase two and recorded Clockwise, self-Shelter, anticlockwise Crosswind and End phase. Its forecast matched committed results. All three native Crucible-harness exports embed exactly `e685c3cf24f1b997fcc2cd71cad76bdada4f95f0`. The standard browser suites also produce nonempty patrol attempts from that same candidate. Intercepted test-only threshold and kill states also passed: next-announcement phase entry, immediate kill victory, no kill phase-change event and disabled terminal controls. Header navigation worked in normal/placeholder mode; unknown `play` opened the lab.

## Actual tuning

Implemented as provisional defaults: boss HP 60, threshold 30, Compact orientation 0, initial facing 0; Brood HP imported from patrol (18/14/14). Splash radius and Close threshold are 2. Directional reduction is 2 and Shelter reduction is 4, inherited from their existing owners.

| Phase / beat | Primary | Primary damage | Secondary | Secondary damage |
| --- | --- | ---: | --- | ---: |
| 1 / A | Inner pulse, not turnable | 5 | Marked hit | 3 |
| 1 / B | Facing sector, turnable | 5 | Marked hit | 3 |
| 2 / A | Outer pulse, not turnable | 5 | Marked splash, radius 2 | 2 |
| 2 / B | Facing sector plus sector two clockwise steps away, turnable | 4 | Marked hit | 3 |

## Computed mask table

Executed `bun /tmp/p15-masks.ts` against this candidate. Counts assume all three living Brood and the boss at `(0,0)`. Each six-entry vector is ordered by controlled facing `0,1,2,3,4,5`. Inner/outer are the ring masks; fork is `f,f+2`; Guard counts Brood whose attacks are protected. Tests protect the geometric relations and public-selector membership, rather than freezing this copied output.

| Formation | Inner | Outer | Sector f=0…5 | Fork f=0…5 | Guard f=0…5 |
| --- | ---: | ---: | --- | --- | --- |
| compact0 | 3 | 0 | 1,0,1,0,1,0 | 2,0,2,0,2,0 | 1,1,1,1,1,1 |
| compact1 | 3 | 0 | 0,1,0,1,0,1 | 0,2,0,2,0,2 | 1,1,1,1,1,1 |
| compact2 | 3 | 0 | 1,0,1,0,1,0 | 2,0,2,0,2,0 | 1,1,1,1,1,1 |
| compact3 | 3 | 0 | 0,1,0,1,0,1 | 0,2,0,2,0,2 | 1,1,1,1,1,1 |
| compact4 | 3 | 0 | 1,0,1,0,1,0 | 2,0,2,0,2,0 | 1,1,1,1,1,1 |
| compact5 | 3 | 0 | 0,1,0,1,0,1 | 0,2,0,2,0,2 | 1,1,1,1,1,1 |
| spread0 | 0 | 3 | 1,0,1,0,1,0 | 2,0,2,0,2,0 | 1,1,1,1,1,1 |
| spread1 | 0 | 3 | 0,1,0,1,0,1 | 0,2,0,2,0,2 | 1,1,1,1,1,1 |
| spread2 | 0 | 3 | 1,0,1,0,1,0 | 2,0,2,0,2,0 | 1,1,1,1,1,1 |
| spread3 | 0 | 3 | 0,1,0,1,0,1 | 0,2,0,2,0,2 | 1,1,1,1,1,1 |
| spread4 | 0 | 3 | 1,0,1,0,1,0 | 2,0,2,0,2,0 | 1,1,1,1,1,1 |
| spread5 | 0 | 3 | 0,1,0,1,0,1 | 0,2,0,2,0,2 | 1,1,1,1,1,1 |

## Screenshot inspection

Opened all eleven final-candidate Crucible-harness images with the image viewer (1280px viewport, full-page capture), plus the existing patrol suite's `fixed-area.png`. Both phases, pending versus active phase, threshold/kill forecasts, pulse/sector/fork labels, fixed boss tile, ordinary patrol and placeholder labels are legible. The corrected Shelter/threshold previews show `Threats: crucible: fixed cells ...` with coordinates immediately after the label; turnability remains visible in the intentions list. These are automated captures inspected by the Implementer, not human playtest observations.

| `/tmp/p15-fixed-browser/` image | Inspected observation | SHA-256 |
| --- | --- | --- |
| `crucible-start.png` | Phase 1, centre boss, inner pulse labelled not turnable and Ugallu mark. | `e77fa9c148ab5c76c969207435cae3d2086ce9f9bec5372bddc1ad0739b4a2dd` |
| `phase-one-sector.png` | Round 2 sector labelled turnable, Spread, active Phase 1. | `57a53f94399ba5e4c9ef16a182ca58bab4275d18ed4a996643fdf3025b645483` |
| `phase-pending.png` | Boss 27/60; original pulse/mark retained; next-announcement phase message. | `9e7d27acbcceff4c0cbb733456290fd67356b7b7acdcaf6328c409fa0ab4a2a9` |
| `phase-two-entry.png` | Round 4 active Phase 2; outer pulse declared, facing/HP retained. | `cf546ad3b8df8e7b523c1c8be01575fdba43e6a6d75533d3ff15daffdcb0ae91` |
| `phase-two-outer.png` | Active Phase 2; Compact avoids outer pulse, marked splash reaches all three. | `ed822cb777ce4d98fe5c59c958a1948f1ce478aae17763eb5ab721cd29496470` |
| `phase-two-fork.png` | Active Phase 2; turnable fork avoids Brood after rotation. | `57fa3b936572c5272231bf26ea0cbdcd256a436f39f18525fb664458ea8ddbfc` |
| `phase-two-shelter-preview.png` | Diagnostic preset; self-Shelter eligibility and exact forecast; corrected Threats format. | `c589ded26cae5f9dd079e0bbd3dc5e5e75495c457dcbf75c6e9dec8cbe8ff2a9` |
| `patrol-start.png` | Original healthy patrol text/presets/controls and Warder facing; added navigation. | `3e4cf14e5dc86f5688699f1cb47f093e53f5b94252e7b3164ea13f681902c29d` |
| `placeholder-patrol.png` | Labels/placeholder diamonds, hidden artwork and preserved query. | `5a43c66cd041aed1563d0259cbf2b4767ad840648a3f2ece5d279893e3a8c666` |
| `threshold-preview.png` | Gale immediate HP drop; phase-one attacks retained and next-announcement forecast agrees. | `64babe2076f926df34e0d76f55cfac5c90298b5038da0eec509fc6b511420314` |
| `kill-preview.png` | Gale immediate victory and terminal forecast, without further boss attack. | `673f69dd3709233380af3545082aba1cfd7300db9eea6cf029487025dcff5144` |

Existing patrol capture `/tmp/p10-browser-Y6LZa2/patrol/fixed-area.png`: fixed area and following mark are distinguished, new intentions-list turnability label visible; existing preview assertion passes. SHA-256 `4d508877b1f3386761411bfde1d0fc3aed8ff81547e76f77c60949cd9536a442`.

Native export hashes: phase crossing `fb34bc95579c3acef09a001e49726f0e37ceb19c84211c3e97447c14942ae42d`; diagnostic `b55e81a3cdbc2430f8fda1b2bafdb7bc7941b3abf7c8a8dd6ec0ef8e60ab72a5`; fresh patrol `58148ed89beadb605c6e7f1b76fa4ebe635b95d8e18b175a417abbff1ba40fc4`; native patrol victory `577c79d3fda42dd37845e07427d96a6cc052bd8239a91cd79e6bcd69f5dc2f9c`. The latter is `/tmp/p10-browser-Y6LZa2/records/healthy-attack.json`.

## Discoveries and limitations

- The assignment report destination `p15-crucible` supersedes the plan's older `p15-central-boss` destination; proposed protected-document correction only, no plan changed.
- No review fixes to P13/P14 were supplied during this assignment; the assigned BASE remains intact.
- The initial preview-format regression is resolved by the explicitly authorized one-line change. No test or round-skeleton change was required.
- Run 1 repeated the prior P14 shutdown exit 130 after all suites passed; run 2 result is recorded explicitly above. No runner fix is claimed.
- The unchanged browser runner does not include additive P15 checks; the separate committed harness was executed against its production preview, following the P14 convention and protected-script restriction.
- Human judgments about usefulness, balance and enjoyment remain for the user round after P17. This report provides mechanics and replay evidence only.

Final report validation used the exact assigned command and returned exit 0, `ok: true`, no diagnostics and resolved BASE/candidate/tested revisions. The report-only successor leaves the tested implementation unchanged.

All assigned implementation and verification work is complete at the corrected candidate. No merge, push, independent review or human playtest is claimed. The report-only successor preserves the tested prototype and unchanged assignment.
