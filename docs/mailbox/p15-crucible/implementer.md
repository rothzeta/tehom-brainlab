task: P15
role: implementer
worker: p15-implementer
status: blocked
outcome: "Crucible implemented; acceptance blocked by an existing patrol browser assertion detecting an unintended Threats preview-format change. Stopped under the plan's explicit condition."
baseline: 6ebe1703c94c2bdb404fd3bcdcfa212336a18b7c
candidate_revision: f08f473f15cbda093990e1455e320c035d9f6f77
tested_revision: f08f473f15cbda093990e1455e320c035d9f6f77
artifacts:
  - docs/mailbox/p15-crucible/assignment-implementer.md
  - docs/mailbox/p15-crucible/implementer.md
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
  - "C1 just poc-001-test: exit 0; all 517 existing tests passed unedited before adding Crucible content."
  - "just poc-001-test: exit 0; 17 files, 537 tests at tested_revision."
  - "just poc-001-typecheck: exit 0 at tested_revision."
  - "just poc-001-build: exit 0 at tested_revision; existing bundle-size warning."
  - "just poc-001-test-browser: exit 1 at tested_revision; lab 197 and preview 24 assertions passed; existing browser-patrol.mjs:120 failed all projected recipients and anchors equal P09; records did not run."
  - "bun tests/browser-crucible.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p15-final-browser http://localhost:4173/: exit 0 from prototype cwd; 330 assertions, 11 captures, zero uncaught browser exceptions."
  - "just poc-001-replay /tmp/p15-final-browser/phase-crossing.json: exit 0; 26 commands, 100 events, revision 26, round 6, victory."
  - "just poc-001-replay /tmp/p15-final-browser/phase-two-diagnostic.json: exit 0; 4 commands, 15 events, revision 4, round 2, player."
  - "just poc-001-replay /tmp/p15-final-browser/patrol.json: exit 0; fresh empty patrol attempt, revision 0, round 1, player."
  - "git diff --check 6ebe1703c94c2bdb404fd3bcdcfa212336a18b7c..HEAD: exit 0; exact protected-path and existing-test comparisons in body also exit 0."
  - "bun /tmp/p15-masks.ts: exit 0; complete 72-case mask table recorded below."
  - "Opened and inspected eight final-candidate screenshots, including every required plan capture."
  - "bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p15-crucible/implementer.md --repo /opt/dev/tehom-brainlab-p15: exit 0; ok true, no diagnostics, all revisions resolved."
review: not-run
discoveries:
  - "Cause at src/view/CombatScene.ts:274 is unintended turnability text in Threats; plan requires that line's format unchanged. Restore only this preview branch to fixed cells; keep labels in the intentions list. No existing-test change or patrol-skeleton fallback is needed."
  - "Assignment p15-crucible report path supersedes the plan's p15-central-boss spelling; no protected document edited."
blockers:
  - "Plan directs stopping on any existing-test failure. Await Coordinator instruction for the identified one-line implementation correction and new-candidate verification; no correction made after failure."

Author: p15-implementer. Assignment: [assignment-implementer.md](assignment-implementer.md), committed unchanged. Contract: [P15](../../plans/2026-10-06-6dcd120b-poc-001-two-phase-central-boss.md). Branch `p15-crucible`; no merge or push. Implementation and initial report were committed together at `f08f473f15cbda093990e1455e320c035d9f6f77`. This final report is an evidence-only successor. All candidate checks and native exports below identify that implementation revision; the creating report SHA is returned in the terminal handoff.

## Stop condition and required correction

**Blocked by the plan's existing-suite stop condition.** `just poc-001-test-browser` exits 1 at existing `tests/browser-patrol.mjs:120`, assertion **“all projected recipients and anchors equal P09”**. Its test-owned fixed-area fixture reaches `previewMatches` at line 410. The expected `Threats:` text retains `fixed cells` immediately before its coordinate list. Candidate `src/view/CombatScene.ts:274` instead adds `· turnable` or `· not turnable` there. A broad implementation replacement accidentally altered both the requested `#intentions` list and this protected-format preview line.

P15 explicitly says **“The preview panel's `Threats:` line format is unchanged”** and **“If an existing test fails, stop and report the assertion and its cause. Do not edit it.”** This is an implementation regression, not a disagreement with the existing test. No test edits are needed. No existing test was edited. Work stopped after diagnosis, and no correction was made following this failure.

Proposed smallest correction for the Coordinator to authorize: restore only the fixed-area branch in `renderPreview`'s `Threats:` template to `'fixed cells'`; retain the new turnability labels in `renderFacts`'s `#intentions` list. This has no connection to the round skeleton, whose C1 and final unit suites pass unedited; separating the patrol end phase would not fix this UI formatting regression.

After correction, commit a new candidate and rerun the four bare recipes, the additive Crucible harness/native exports, CLI replay and screenshot inspection. The standard browser record suite did not run because the patrol suite failed first. No independent review or acceptance is claimed.

## Implemented scope

- Explicit patrol/Crucible registry with factories, presets, state recognition, end phase, preview rules, codec identities and existing-emblem mapping.
- Shared synchronous end-phase lifecycle; patrol keeps its validation, ordered sources, damage and announcement. C1 passed all 517 existing unit tests before Crucible content was added.
- Crucible content captures HP, threshold, damage rules and pattern table in serialized rules. Boss is anchored at `(0,0)`, rotatable, self-protected, and resolves primary then secondary with distinct occurrence IDs. Marks use exact HP-fraction comparison and roster ties. Fallen marks fizzle, and boss death wins without more attacks.
- Announcement-only phase entry through the shared `phaseTwoPending` selector. Current attacks resolve under their current phase and beat. Entry emits one event, resets to A and retains facing/HP. Only B advances the current facing clockwise, including after Crosswind.
- Registry-backed forecasts and version-selected record validation/replay. Envelope stays version 1; patrol version remains `poc-001-rules-v3/patrol-v2/p14-v1`; Crucible version is `poc-001-rules-v3/crucible-v1/p14-v1`.
- `?play=crucible`, encounter header links/presets, clean reset, existing Foundry Mechanism emblem, pending/active phase indicator, intentions-list turnability labels and per-protection-source facing text. Unknown routes still open the lab; placeholder query survives navigation. Patrol constructor and text remain compatible except for the identified fixed-area preview regression in its intercepted fixture.
- README describes Crucible, registry/forecast/record changes and the user's explicit boss-work authorization while retaining historical P11 HOLD.

Only assigned source components, additive tests, prototype README and the assigned mailbox artifacts changed. All pre-existing tests and protected paths match BASE. P13/P14 behavior was not edited. No generated role/skill source changed.

## Verification at the candidate

Every final recipe below ran from the repository root bare, with the ordinary inherited environment, no Chrome/mode/port overrides. The browser recipe independently built a fresh production bundle and managed its preview before the separate required standalone build. Sandbox escalation permitted Docker/Chrome access; no automatic approval rejection occurred.

| Exact command | Actual result |
| --- | --- |
| `just poc-001-test` | Exit 0; 17 files, 537 tests. All 517 existing tests unchanged; 20 additive Crucible cases. |
| `just poc-001-typecheck` | Exit 0. |
| `just poc-001-build` | Exit 0; existing large-bundle warning only. |
| `just poc-001-test-browser` | **Exit 1**; lab passed 197 assertions / 20 screenshots / zero exceptions; preview passed 24 assertions / two screenshots / zero exceptions; patrol failed at the fixed-area preview-format assertion; records did not run. Output `/tmp/p10-browser-92DILO`. |
| `bun tests/browser-crucible.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p15-final-browser http://localhost:4173/` | Exit 0; 330 assertions, 11 screenshots, zero uncaught browser exceptions. Prototype cwd. Used the same fresh candidate preview while the standard runner owned it. |
| `just poc-001-replay /tmp/p15-final-browser/phase-crossing.json` | Exit 0; commands 26, events 100, revision 26, round 6, victory. |
| `just poc-001-replay /tmp/p15-final-browser/phase-two-diagnostic.json` | Exit 0; commands 4, events 15, revision 4, round 2, player. |
| `just poc-001-replay /tmp/p15-final-browser/patrol.json` | Exit 0; fresh empty patrol export, commands/events/revision 0, round 1, player. The standard nonempty-patrol export suite remains unexecuted at this candidate. |
| `git diff --check 6ebe1703c94c2bdb404fd3bcdcfa212336a18b7c..HEAD` | Exit 0 at the candidate. |
| Protected paths and existing-test preservation commands below | Exit 0 with no diff. |
| `bun /tmp/p15-masks.ts` | Exit 0; computed all 72 formation/facing combinations with public selectors; complete count table below. |

Chrome selected by the bare runner: `/home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell`; printed reason **highest executable Playwright version (chromium_headless_shell-1223)**. The additive harness used that same selected executable on a distinct CDP port. Lab's two failed-image requests are intentional fallback coverage.

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

The native diagnostic attempt started at phase two and recorded Clockwise, self-Shelter, anticlockwise Crosswind and End phase. Its forecast matched committed results. All three native exports embed exactly `f08f473f15cbda093990e1455e320c035d9f6f77`. Intercepted test-only threshold and kill states also passed: next-announcement phase entry, immediate kill victory, no kill phase-change event and disabled terminal controls. Header navigation worked in normal/placeholder mode; unknown `play` opened the lab.

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

Opened the following eight final-candidate images with the image viewer (1280px viewport, full-page capture). Both phases, the pending indicator, pulse/sector/fork labels, fixed boss tile, ordinary patrol and placeholder labels are legible. These are automated captures inspected by the Implementer; no human playtest observations are claimed. The Shelter capture also visibly contains the known unintended turnability text in its `Threats:` line.

| `/tmp/p15-final-browser/` image | Inspected observation | SHA-256 |
| --- | --- | --- |
| `crucible-start.png` | Phase 1, centre boss, inner pulse labelled not turnable and Ugallu mark. | `e77fa9c148ab5c76c969207435cae3d2086ce9f9bec5372bddc1ad0739b4a2dd` |
| `phase-one-sector.png` | Round 2 sector labelled turnable, Spread, active Phase 1. | `57a53f94399ba5e4c9ef16a182ca58bab4275d18ed4a996643fdf3025b645483` |
| `phase-pending.png` | Boss 27/60; original inner pulse and mark retained; next-announcement phase message. | `9e7d27acbcceff4c0cbb733456290fd67356b7b7acdcaf6328c409fa0ab4a2a9` |
| `phase-two-outer.png` | Active Phase 2, Compact avoids outer pulse, marked splash follows Ugallu and reaches all three. | `ed822cb777ce4d98fe5c59c958a1948f1ce478aae17763eb5ab721cd29496470` |
| `phase-two-fork.png` | Active Phase 2, turnable fork, two sectors outlined and no primary recipient after rotation. | `57fa3b936572c5272231bf26ea0cbdcd256a436f39f18525fb664458ea8ddbfc` |
| `patrol-start.png` | Original healthy patrol presets/controls, three marks and Warder facing text; added Crucible navigation. | `3e4cf14e5dc86f5688699f1cb47f093e53f5b94252e7b3164ea13f681902c29d` |
| `placeholder-patrol.png` | Labels and placeholder diamonds; artwork hidden, query retained across navigation. | `5a43c66cd041aed1563d0259cbf2b4767ad840648a3f2ece5d279893e3a8c666` |
| `phase-two-shelter-preview.png` | Diagnostic preset, self-Shelter eligibility, rule amount, immediate and conditional forecast. | `0cf2749fe9f27b052a9fd85521770fe61969fe331bbe31066085e1db759d3b39` |

Additional captures `phase-two-entry.png`, `threshold-preview.png` and `kill-preview.png` were produced by the harness but not opened individually; required plan screenshots were inspected above.

Native export hashes: phase crossing `0f7a3e09700d8cd9e7babe809ddf38caa0f3fa03a9bb69782446a361ec397bce`; diagnostic `9fa12d77aba6d60042fe755cefd148255fab393b912d0b0c07fc18259f31397c`; fresh patrol `65bf4c450f41a6fed9651ea6233275344546dde59152018cdbb6c9aa93f3fa80`.

## Discoveries and remaining work

- The assignment report destination `p15-crucible` supersedes the plan's older `p15-central-boss` destination; proposed protected-document correction only, no plan changed.
- No review fixes to P13/P14 were supplied during this assignment; the assigned BASE remains intact.
- The one-line preview-format regression prevents acceptance. The existing test should remain unchanged. The round-skeleton fallback is not applicable to this failure.
- The unchanged browser runner does not include additive P15 checks; the separate committed harness was executed against its production preview, following the P14 convention and protected-script restriction.
- Human judgments about usefulness, balance and enjoyment remain for the user round after P17. This report provides mechanics and replay evidence only.

Final report validation used the exact assigned command and returned exit 0, `ok: true`, no diagnostics and resolved BASE/candidate/tested revisions. The report-only successor leaves the tested implementation unchanged.
