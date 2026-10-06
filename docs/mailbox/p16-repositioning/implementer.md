task: P16
role: implementer
worker: p16-implementer
status: complete
outcome: "P16 enemy relocation implemented; all final-candidate bare recipes, fixture/replay/screenshot checks and handoff validation passed. Existing tests and protected paths unchanged."
baseline: 7537d0bddc5d5409b116a3ad4919bf02cb1e7a36
revision: b1fab75b026d2a1d99c9d646f08e93230b91bee0
candidate_revision: b1fab75b026d2a1d99c9d646f08e93230b91bee0
tested_revision: b1fab75b026d2a1d99c9d646f08e93230b91bee0
initial_candidate_revision: bfde02bc1c115953dfe65559c0f18cf71e3df35f
artifacts:
  - "docs/mailbox/p16-repositioning/assignment-implementer.md"
  - "docs/mailbox/p16-repositioning/implementer.md"
  - "/tmp/p16-b1-browser"
  - "/tmp/p10-browser-dZYlI1"
  - "/tmp/p10-browser-4Ei5JB"
  - "/tmp/p16-compare.ts"
  - "/tmp/p16-occupancy.ts"
changed_paths:
  - "docs/mailbox/p16-repositioning/assignment-implementer.md"
  - "docs/mailbox/p16-repositioning/implementer.md"
  - "poc-001-linked-formation/README.md"
  - "poc-001-linked-formation/src/core/commands.ts"
  - "poc-001-linked-formation/src/core/enemy-movement.ts"
  - "poc-001-linked-formation/src/core/rounds.ts"
  - "poc-001-linked-formation/src/core/run-record.ts"
  - "poc-001-linked-formation/src/core/state.ts"
  - "poc-001-linked-formation/src/view/CombatScene.ts"
  - "poc-001-linked-formation/tests/browser-repositioning.mjs"
  - "poc-001-linked-formation/tests/browser/repositioning-fixture.ts"
  - "poc-001-linked-formation/tests/browser/repositioning-fixtures.ts"
  - "poc-001-linked-formation/tests/enemy-movement.test.ts"
verification:
  - "just poc-001-test: exit 0, 559 tests / 18 files, including 22 new P16 cases; all existing tests unedited."
  - "just poc-001-typecheck: exit 0."
  - "just poc-001-build: exit 0, existing bundle-size warning."
  - "just poc-001-test-browser final candidate attempt 1: exit 1 before suites, preview bind on port 4173 failed with Docker exit 125; output /tmp/p10-browser-4Ei5JB."
  - "just poc-001-test-browser final candidate attempt 2: exit 0, four suites / 4985 assertions, zero exceptions; output /tmp/p10-browser-dZYlI1; bare command, automatic Chrome discovery, fresh runner build."
  - "bun tests/browser-repositioning.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p16-b1-browser http://localhost:4176/ (prototype cwd): exit 0, 98 assertions, six inspected screenshots, zero browser exceptions; all three exports embed tested_revision."
  - "just poc-001-replay /tmp/p16-b1-browser/patrol.json: exit 0, 1 command / 12 events, revision 1, round 2, player."
  - "just poc-001-replay /tmp/p16-b1-browser/crucible.json: exit 0, 1 command / 10 events, revision 1, round 2, player."
  - "just poc-001-replay /tmp/p16-b1-browser/relocating.json: exit 0, 5 commands / 24 events, revision 5, round 3, player."
  - "bun /tmp/p16-compare.ts: exit 0, 100 transitions / five presets, records and replays identical to BASE."
  - "bun /tmp/p16-occupancy.ts: exit 0, 6720 cases / 60480 legal commands, 16992 moves / 288 blocked moves; living occupancy and timing invariants hold."
  - "git diff --check 7537d0bddc5d5409b116a3ad4919bf02cb1e7a36..HEAD: exit 0. Protected-path and existing-test git diff --exit-code checks in body: exit 0."
  - "bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p16-repositioning/implementer.md --repo /opt/dev/tehom-brainlab-p16: exit 0, ok true, no diagnostics, five revision references resolved."
review: not-run
discoveries:
  - "Assignment destination p16-repositioning supersedes the plan's p16-enemy-repositioning spelling; no protected document edited."
  - "Concurrent P15 verification held port 4173. Final-candidate wait ran from the 05:03:59 UTC collision to the free-port poll at 05:15:47 UTC (about twelve minutes). Approximately one-minute polling followed the Coordinator's instruction. No other worker process/container stopped."
  - "P15 fixes were not merged: no merge instruction received; candidate remains based on supplied BASE. The unchanged browser runner excludes additive harnesses, which were run separately."
blockers: []

Author: p16-implementer. Assignment: [assignment-implementer.md](assignment-implementer.md), committed unchanged with the initial report and implementation at `bfde02bc1c115953dfe65559c0f18cf71e3df35f`. Contract: [P16](../../plans/2026-10-06-27ca8f17-poc-001-enemy-repositioning.md). Branch `p16-repositioning`, BASE `7537d0bddc5d5409b116a3ad4919bf02cb1e7a36`. No merge or push. Final implementation/test candidate: `b1fab75b026d2a1d99c9d646f08e93230b91bee0`; this report's creating commit is an evidence-only successor, returned in the terminal handoff.

## Implemented scope

`CombatEnemy.mobile?` defaults to stationary independently of `rotatable`. The pure `relocateEnemies` selector derives `ENEMY_ROUTE` from the reserved enemy cells, tries the clockwise neighbour then the counterclockwise neighbour, and processes living mobile enemies in array order against updated living occupancy. Fallen enemies retain identity/cell and neither move nor block. Off-route movers stay. The centre and Brood cells cannot become destinations.

The shared end phase calls the selector after committed attacks, Shelter expiry, `enemy-phase-ended` and terminal settlement, before budget reset and fresh announcement. Both movement events carry the round just ended. Terminal combat never relocates. P09 remains unchanged: its real transition supplies relocated snapshots and includes movement events in conditional forecasts. Facing stays unchanged by relocation; Crosswind remains independent.

Record version and encounter rules versions are unchanged. The codec permits optional boolean `mobile` and requires distinct cells among living enemies while retaining unique IDs, HP validation and reserved-cell placement for every enemy. Existing records keep their meaning.

The view draws living tokens above fallen ones and keeps them pointer selectable at a shared cell. End-phase previews render moved enemies' destination ghosts from authoritative preview snapshots and explain movement in the preview/history text. The prototype README describes the defaults and living-only record occupancy. The diagnostic fixture is intercepted under `tests/browser/`; no product route or product enemy gains mobility.

Only the assigned files and additive tests changed. Protected paths, generated agent resources and every existing test match BASE. `0b687795d616d9e52d64e006827ca6821cc95209` and the final candidate adjust only additive test inputs/assertions: explicit Brood HP, formation and enemy order; geometric/protection expectations derived from supplied origins rather than incidental route-dependent protection changes. No P15 review correction was supplied or merged during this assignment.

## Criterion mapping

| P16 criterion | Executed evidence |
| --- | --- |
| 1 — Clockwise relocation; Brood coordinates/allowances | Six route-relative successor/wraparound cases; actual end-phase ordering/reset; unchanged formation; legal rotation/Expand after relocation. |
| 2 — Occupied fallback/stay; valid living occupancy | Both neighbours blocked, clockwise-only blocked, two movers in either array order, shared destinations/vacated cells; eight recorded real boundaries preserve distinct living reserved cells; a separate public-command sweep covers 6,720 occupancy/mobile/fallen combinations and 60,480 legal commands. |
| 3 — Fallen cells reusable and serializable | Fallen mobile blocker stays; living mover reuses its cell; eight-boundary record parses/replays; native corpse-sharing export replays. |
| 4 — Committed origins and fresh fronts/areas | Shared real end phase resolves a controlled fixed area before moving and declares fresh cells from the destination; Warder protection uses moved origin; controlled Compact 0/facing 0 geometry verifies `(-2,1)` covers Girtablilu and `(-1,-1)` covers Girtablilu/Pazuzu via `frontCells` and `selectRecipients`. |
| 5 — Mobility/turnability independence | Mobile non-rotatable target rejected by Crosswind yet relocates; mobile rotatable enemy retains Crosswind facing; player Crosswind leaves cells unchanged; turned Crucible stays anchored and emits no movement. |
| 6 — Terminal/order/replay/preview | Victory and defeat emit no moves; ordered unique events after expiry/end and before start/declarations; 72 maneuver/Crosswind/end previews over 12 formations match real states/events and conditional forecasts without mutating live snapshots. |
| 7 — Patrol/Crucible unchanged | 537 existing unit tests and four existing browser suites unedited; 100 transitions across all five presets, complete records and replays equal BASE; native product exports replay. |
| 8 — Provisional tuning stays flexible | Controlled fixture owns HP, damage, formation, cells, facing and mobility; route expectations derive from `ENEMY_ROUTE`; no copied route or product HP/damage/facing/mobile constants are asserted. The separate computed origin example tests the required geometry. |
| 9 — Existing suites pass | Final bare unit and browser recipes; no existing test edited. |

The fixture owns Brood HP 40, enemy HP 20 (Censer 0 in corpse mode), Compact 0, facing 0, Warder damage 2, other damage 0 and its own damage-rule values. These isolate timing/geometry and are not product tuning. Only the fixture Warder is mobile and rotatable.

## Route, destination and occupancy observations

These coordinates describe the implemented provisional route; assertions use the exported route rather than this copied observation table.

| Slot | Cell | Clockwise candidate | Counterclockwise fallback |
| --- | --- | --- | --- |
| T1 | `(1,1)` | T3 | T11 |
| T3 | `(-1,2)` | T5 | T1 |
| T5 | `(-2,1)` | T7 | T3 |
| T7 | `(-1,-1)` | T9 | T5 |
| T9 | `(1,-2)` | T11 | T7 |
| T11 | `(2,-1)` | T1 | T9 |

| Controlled input | Occupancy | Actual result |
| --- | --- | --- |
| Browser mobile mode: Warder T5 | Living Censer T7; living Harrier T9 | Clockwise blocked; Warder moves to free T3. Brood stays Compact 0. |
| Browser corpse mode, round 1: Warder T5 | Fallen Censer T7; living Harrier T9 | Warder moves clockwise to T7. Censer remains fallen at T7; Warder is on top and pointer selectable. |
| Native corpse attempt, round 2: Warder T7 | Fallen Censer shares T7; living Harrier T9 | Clockwise blocked; Warder returns to T5. Prior Crosswind facing survives. Brood's Clockwise and Expand happen in the player phase only. |
| Unit mover with both neighbours occupied | Two living blockers | No cell change; one `enemy-move-blocked`, reason `occupied`. |
| Unit mover at centre | Off route | No cell change; one blocked event, reason `off-route`. |
| Unit two movers at adjacent slots | First sees second; second sees first's actual destination | Earlier occupied/vacated cells determine the next mover's selection; reversing array order can change destinations. |

## Candidate verification

All required recipes ran from the repository root, bare, with no hand-set environment variables or Chrome override. The browser recipe builds a fresh production bundle itself. The standalone required build was executed separately. Docker/Chrome sandbox escalation was approved; no automatic approval rejection occurred.

The browser runner selected `/home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell` because it was the highest executable Playwright version discovered by the unchanged runner. The additive harness used that same binary by argument and the isolated host preview at `http://localhost:4176/`.

| Exact command | Result at final candidate |
| --- | --- |
| `just poc-001-test` | Exit 0; 559 tests / 18 files, including 22 additive P16 cases. |
| `just poc-001-typecheck` | Exit 0. |
| `just poc-001-build` | Exit 0; existing large-bundle warning. |
| `just poc-001-test-browser` | Attempt 1: exit 1 on occupied port before suites. Attempt 2: exit 0, four suites / 4,985 assertions, zero exceptions; `/tmp/p10-browser-dZYlI1`. Both commands bare; successful run built its own fresh bundle. |
| `bun tests/browser-repositioning.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p16-b1-browser http://localhost:4176/` (prototype cwd) | Exit 0; 98 assertions, six screenshots, no uncaught browser exceptions; three native exports embed final candidate SHA. |
| `just poc-001-replay /tmp/p16-b1-browser/patrol.json` | Exit 0; 1 command / 12 events; revision 1, round 2, player. |
| `just poc-001-replay /tmp/p16-b1-browser/crucible.json` | Exit 0; 1 command / 10 events; revision 1, round 2, player. |
| `just poc-001-replay /tmp/p16-b1-browser/relocating.json` | Exit 0; 5 commands / 24 events; revision 5, round 3, player. |
| `bun /tmp/p16-occupancy.ts` | Exit 0; 6,720 cases / 60,480 legal commands; 16,992 moves / 288 blocked moves; living cells distinct and reserved, Brood disjoint, player maneuvers emit no movement, at most one movement event per source per boundary. |
| `bun /tmp/p16-compare.ts` | Exit 0; 100 command results over all five presets, accumulated records and replay results exactly equal BASE. |
| `git diff --check 7537d0bddc5d5409b116a3ad4919bf02cb1e7a36..HEAD` | Exit 0. |
| Protected paths / existing tests commands below | Exit 0, empty diffs. |
| `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p16-repositioning/implementer.md --repo /opt/dev/tehom-brainlab-p16` | Exit 0; `ok: true`, no diagnostics, all five revision references resolved. |

The comparison script imports archived BASE core/content and the candidate's corresponding public APIs. For each of the three patrol and two Crucible presets, it submits Clockwise, a shape change, clockwise Crosswind, self-Shelter and End phase for four rounds or until terminal, comparing every accepted/rejected result, appended record and replay. It made 100 comparisons and five identical records/replays. Disposable source and BASE extraction remain in `/tmp/p16-compare.ts` and `/tmp/p16-baseline`; no baseline source was edited.

The occupancy sweep uses every ordered placement of three enemies on the exported route, all eight mobile-trait masks and all seven nonterminal fallen masks. It executes three rounds of Clockwise, shape change and End phase with controlled zero damage, checking live distinctness, reserved/disjoint placement, player-phase stationarity, event uniqueness and ended-round identity after each public command. Its disposable source is `/tmp/p16-occupancy.ts`.

Exact preservation checks from the root:

```sh
git diff --exit-code 7537d0bddc5d5409b116a3ad4919bf02cb1e7a36..HEAD -- poc-001-linked-formation/tests ':!poc-001-linked-formation/tests/enemy-movement.test.ts' ':!poc-001-linked-formation/tests/browser-repositioning.mjs' ':!poc-001-linked-formation/tests/browser/repositioning-fixture.ts' ':!poc-001-linked-formation/tests/browser/repositioning-fixtures.ts'
git diff --exit-code 7537d0bddc5d5409b116a3ad4919bf02cb1e7a36..HEAD -- poc-001-linked-formation/src/core/{hex,formation,sectors,intents,damage,lifecycle,abilities,transition,preview,smoke}.ts poc-001-linked-formation/src/content/ poc-001-linked-formation/src/view/{FormationLab,lab-state,projection,patrol-session}.ts poc-001-linked-formation/src/main.ts poc-001-linked-formation/scripts/ poc-001-linked-formation/bin/ poc-001-linked-formation/{package.json,bun.lock,tsconfig.json,vite.config.ts,vitest.config.ts} justfile assets/ .agents/ docs/ ':!docs/mailbox/p16-repositioning/'
```

## Screenshot and export evidence

All six final-candidate captures in `/tmp/p16-b1-browser/` were opened with the image viewer at the captured 1280px viewport. The mobile-mode preview leaves the actual Warder at T5 while showing its labelled ghost at fallback T3. After commitment, the live token is at T3 and its front tint clips to `(0,2)` from its new origin, with new intentions visible. Corpse-mode preview shows the ghost at fallen Censer's T7; after commitment, the Warder draws above that corpse. A real pointer hit selects Warder; its subsequent Crosswind, rotation, Expand and second End phase are recorded and replayed. Corpse-mode protection is correctly removed by existing lifecycle because its protected Censer is fallen, so that mode does not retain a front tint after settlement.

| Capture | Inspected observation | SHA-256 |
| --- | --- | --- |
| `mobile-before.png` | Warder at T5; Censer at clockwise T7; protection/front uses the current origin. | `60e4c760594bd00bfd2ab950d7f9df83a4719101909fe2b0950786917888ee91` |
| `mobile-destination-preview.png` | Actual Warder remains T5; labelled ghost at free fallback T3; move explained in preview. | `9211606c446ac31e91e1c49d40cbd109bb591c43cbd9336a0a11a08071f2e21f` |
| `mobile-after.png` | Warder at T3; new front tint at (0,2), fresh intentions and round-two allowances. | `7dcf5326f586aecb6b9035faf6f8afcecbf647a26cdff1f20970c44fa26e0431` |
| `corpse-before.png` | Fallen Censer at T7; Warder at T5; corpse identity/cell/HP visible. | `34fdd62c3eeb59561544c2e0453c4ddad31efa0ceb75d3a92f34674f3fd6d294` |
| `corpse-destination-preview.png` | Warder destination ghost shares fallen Censer T7; live token still at original T5. | `8bf643cb9525ba591449bbb96c901821069cc8f9d9775f340695b886e7ab3a25` |
| `corpse-after.png` | Living Warder drawn above fallen Censer at T7; actual pointer hit/select test passed. | `e75a35e8449ca0bea8b14b8d4687d85785bff6a94bada1ff7d6168e853cb188f` |

Native export SHA-256:

- `patrol.json`: `1474eb97933eaf1b48378228e97ae735faabe5c738e52a8cf13365106ee1d925`.
- `crucible.json`: `7c3e12e26fbedad7b9ac1a3240c1ee5fc5206ef5b6068f56d3b51426b21b50bd`.
- `relocating.json`: `3efaf32da71610cc62326631002f867226af5dbcdd371e731ae0775eedc3853c`.

These are automated mechanics checks and Implementer screenshot inspections. No human playtest, balance conclusion, independent review or acceptance is claimed.

## Earlier checks, failures and limitations

- Dependency installation was needed. Initial sandboxed `just poc-001-install` exited 1 because Docker was inaccessible; the same bare recipe with approved sandbox escalation exited 0. Locked validator dependency installation used `bun install --frozen-lockfile` in `.agents/skills/ruach-handoff`, exit 0. Generated tracked files stayed unchanged.
- During test development, the first focused additive run exited 1 on an incorrect defeat fixture that left living Brood. The first typecheck exited 1 on the new test's wrong Shelter event name and overly narrow inferred mutable fixture type. These new-test defects were corrected; no existing test failed or was edited.
- Preliminary full unit/typecheck/build all exited 0. A preliminary `just poc-001-preview` exited 125 because P15 review owned 4173; an attempted isolated host preview without escalation exited 1/EPERM. Approved `bun node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4176 --strictPort` (prototype cwd) started successfully. Only that P16 host preview was used for additive harness runs.
- At the initial candidate `bfde02b`, bare `just poc-001-test` and `just poc-001-typecheck` exited 0; bare `just poc-001-test-browser` exited 0 with all 4,985 assertions and no exceptions, output `/tmp/p10-browser-sQLvq1`. Its six native patrol records embed that initial candidate. Preliminary additive runs at the original working tree and initial candidate exited 0/98 assertions; they are superseded by final-candidate evidence.
- At `0b68779`, bare `just poc-001-test` exited 0/559 tests. Final additive test refinements passed focused tests and typecheck before the final candidate was committed.
- Final candidate browser attempt 1 exited 1 before any suite ran: the fresh build passed, but P15's preview owned 4173, Docker exited 125 on bind, and the runner reported `Preview exited 125`. Output `/tmp/p10-browser-4Ei5JB`. No other worker's preview was stopped and no runner change was made. The free-port poll at 05:15:47 UTC followed about twelve minutes of waiting from the 05:03:59 collision. After the Coordinator's instruction at 05:10 UTC, polling was approximately once a minute with a 30-minute cutoff; the port became free well before that cutoff. Attempt 2 exited 0 after all four suites passed, output `/tmp/p10-browser-dZYlI1`. No browser shutdown exit 130 occurred in either successful bare recipe.
- Assignment destination `docs/mailbox/p16-repositioning/implementer.md` supersedes the plan's `p16-enemy-repositioning` spelling. Proposed protected-document correction only; no plan changed.
- The protected browser runner intentionally remains unchanged and does not include the additive harness. The committed new harness was executed separately, following the P15 convention.
- All assigned checks were run successfully at the final candidate. No remaining blocker. The P16 isolated host preview was interrupted after final captures (expected process exit 130); this was deliberate cleanup of the P16 process, separate from browser-recipe shutdown.
