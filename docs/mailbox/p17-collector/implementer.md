task: P17
role: implementer
author: p17-implementer
status: complete
outcome: "Collector implemented and verified; roaming local sweep, ranged ward, objective victory, browser selection and exact replay delivered with the Coordinator-authorized transition exception."
baseline: 9abd506351f9726cadd71f5d8fdb46d228f1a1dc
candidate_revision: 7df00d020119d1c67e85df60d5628ed418cb642c
tested_revision: 7df00d020119d1c67e85df60d5628ed418cb642c
previous_candidate_revision: 7c169492de6b12b2da897923ab788e6ca75b0812
blocked_report_revision: 2b5c95fd9e90523c4bc2f1a1504036951707a4a5
artifacts:
  - docs/mailbox/p17-collector/assignment-implementer.md
  - docs/mailbox/p17-collector/implementer.md
  - /tmp/p17-final-browser
  - /tmp/p17-product-corpse
  - /tmp/p17-manual-browser
  - /tmp/p17-comparison.json
  - /tmp/p17-route-ward.json
  - /tmp/p17-tuning-probes
changed_paths:
  - docs/mailbox/p17-collector/assignment-implementer.md
  - docs/mailbox/p17-collector/implementer.md
  - poc-001-linked-formation/README.md
  - poc-001-linked-formation/src/content/collector.ts
  - poc-001-linked-formation/src/core/encounters.ts
  - poc-001-linked-formation/src/core/intents.ts
  - poc-001-linked-formation/src/core/lifecycle.ts
  - poc-001-linked-formation/src/core/run-record.ts
  - poc-001-linked-formation/src/core/state.ts
  - poc-001-linked-formation/src/core/transition.ts
  - poc-001-linked-formation/src/main.ts
  - poc-001-linked-formation/src/view/CombatScene.ts
  - poc-001-linked-formation/tests/collector.test.ts
  - poc-001-linked-formation/tests/browser-collector.mjs
  - poc-001-linked-formation/tests/browser/collector-fixture.ts
  - poc-001-linked-formation/tests/browser/collector-fixtures.ts
verification:
  - "just poc-001-test: exit 0; 581 tests in 20 files, including all 565 existing tests unchanged."
  - "just poc-001-typecheck: exit 0."
  - "just poc-001-build: exit 0; existing bundle-size advisory only."
  - "just poc-001-test-browser: exit 0; 4985 assertions, zero uncaught exceptions; /tmp/p10-browser-4F6smm."
  - "Collector browser harness: exit 0; 379 assertions, 13 screenshots, zero uncaught exceptions; default playthrough won in round 4, 18 commands."
  - "Real-build manual mechanics trace: exit 0; 523 assertions. Real-build Warder-first corpse trace: exit 0; 73 assertions. Exact commands and findings below."
  - "Eight just poc-001-replay commands: all exit 0; exact paths, counts and outcomes below."
  - "bun /tmp/p17-comparison.ts and bun /tmp/p17-route-ward.ts: both exit 0; controlled comparisons and observed route/ward tables below."
  - "python3 /tmp/p17-tuning-probes.py: exit 0; five independent default mutations, all 16 Collector tests passed for each."
  - "Six required final-build screenshot views opened and inspected. Combined manual checklist has no mechanically impossible step; subjective questions await the user round."
  - "Existing-test and protected-path preservation comparisons, git diff --check, and assignment checksum: passed."
  - "bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p17-collector/implementer.md --repo /opt/dev/tehom-brainlab-p17: exit 0; ok true."
review: not-run
discoveries:
  - "Coordinator authorized the previously blocked transition.ts change: configured directional reduction applies to crucible OR collector, with its comment updated; patrol remains unchanged."
  - "At current defaults the ward alternates off/on while Warder lives. Killing Warder frees its corpse and then the opposite edge pair while Censer lives; killing both adds opens the complete route."
  - "Spreading dominates holding and the tested clockwise response on incoming damage in the controlled two-round comparisons; this is a design finding, not proof of tactical diversity or a universal winning strategy."
  - "Product exports embed the tested SHA. Intercepted controlled fixture exports deliberately record unknown build metadata; their configuration, state and ordered events replay exactly."
  - "Assignment destination p17-collector supersedes the plan's p17-roaming-boss-and-adds spelling; proposed Coordinator correction only."
blockers: []

Assignment: [assignment-implementer.md](assignment-implementer.md). Contract: [P17 plan](../../plans/2026-10-06-79371edf-poc-001-roaming-boss-and-adds.md). Branch `p17-collector`; no merge or push. All required final checks identify the tested candidate above. This report is an evidence-only successor; its creating SHA is returned in the terminal handoff. No independent review, acceptance, or human balance playtest is claimed.

## Authorized exception and resolved blocker

The initial blocked report is preserved at `2b5c95f`. Its public-boundary scratch probe confirmed that a registered Collector with ward reduction 1 still dispatched, previewed and exported reduction 2 because `commandAbilityRules` selected only the Crucible. The plan protected `transition.ts` and explicitly required stopping before changing it.

The Coordinator subsequently explicitly authorized exactly the proposed `crucible OR collector` condition and comment update, with no other protected changes or existing-test edits. [transition.ts](../../../poc-001-linked-formation/src/core/transition.ts) now uses that condition. It changes only configured directional reduction; patrol's dispatch and all remaining default P14 ability rules are preserved. The new Collector regression uses a test-owned reduction 1, a front-exposed Claw, and compares live damage, immediate preview, default record configuration and replay. The entire existing suite remains unchanged.

## Implementation and contract coverage

- [collector.ts](../../../poc-001-linked-formation/src/content/collector.ts) owns provisional layout, HP, damage, range, facings, presets and Warder/Censer/boss declaration order. It uses the shared end-phase skeleton and P16 relocation without changing them. Facing selection maximizes living coverage from the actual tile, retaining current-facing ties before clockwise candidates. The fixed sweep is stored at announcement; maneuvers retain it and Crosswind turns it about the current boss tile. Marks use the declared living-roster and round cycle rules and never silently retarget.
- Shared protection accepts optional inclusive source-to-ward `range`, reports `out-of-range`, and retains the relation while support is inactive. Optional enemy `objective` defaults to true. `settleLifecycle` ends combat immediately after objective death, including the direct `applyAbility` replay path; living adds retain HP and emit no invented deaths.
- The registry, main entry, emblems and combat view select `?play=collector`, offer the three patrol-style presets, preserve placeholder links, display support distance/eligibility and destination support, and reuse P16's destination ghost. Collector enemy tokens are disabled after terminal outcome and a live boss stays selectable above a corpse.
- The Collector codec uses `poc-001-rules-v3/collector-v1/p14-v1`, `collectorVersion`, `collectorRules` and `{ collectorRules, abilityRules }`. Optional `objective` and `range` are admitted only for this codec; range must be a nonnegative safe integer and objective a boolean. Patrol and Crucible strings and accepted field meanings stay unchanged. Records capture actual initial layout, rules and commands, rather than reconstructing them from later defaults.
- [collector.test.ts](../../../poc-001-linked-formation/tests/collector.test.ts) adds 16 boundary tests: inclusive/unlimited support, bypass/source precedence, objectives and defeat precedence, independent presets, living coverage/ties across route tiles and formations, committed/turned geometry, order/fizzle, relocation/allowances, exposure, configured mitigation, add deaths/corpse reuse/direct boss victory, broad reliable access after casualties, Shelter/splash, record validation, reset guards, and every legal preview/forecast over controlled route origins and formations. Product layout/count expectations derive from exported content; consequence traces use explicit test-owned rules/states.
- The additive Collector harness and its controlled fixtures follow the existing browser-fixture convention. The standard runner is unchanged. No change was needed in the already generic `patrol-session.ts`.

## Checkpoint and acceptance mapping

| Checkpoint / acceptance | Implementation and observable evidence |
| --- | --- |
| C1; criteria 3–4 | `intents.ts`, `state.ts`, `lifecycle.ts`; inclusive range/source precedence, nonobjective victory and defeat-precedence tests |
| C2; criteria 1–2, 4–6 | `collector.ts`, registry and codec; actual-origin coverage/ties, committed/turned sweep, ordering/fizzle, corpse relocation, reliable access and direct-ability replay tests |
| C3; criteria 2–4, 6 | Main/view/emblem selection; presets, support labels, destination ghosts, pointer hit over a corpse, native exports and six inspected views |
| C4; criteria 6–9 | Nine controlled comparisons, route/ward observations, five tuning probes, all final bare recipes and unchanged-existing-test/protected-path comparisons |

## Final-candidate verification

Ran all recipes bare from `/opt/dev/tehom-brainlab-p17`, without hand-set environment or Chrome override. The browser recipe ran before the standalone final build and built its own fresh bundle. Docker, worker IPC and Chrome access used approved sandbox escalation. The recipe selected `/home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell` because it was the highest executable Playwright version. Port 4173 was available at each launch; no other worker's process was stopped.

| Exact command | Exit | Result |
| --- | ---: | --- |
| `just poc-001-test` | 0 | 581/581 tests, 20 files |
| `just poc-001-typecheck` | 0 | TypeScript passed |
| `just poc-001-test-browser` | 0 | Lab 197 + preview 24 + patrol 4572 + records 192 = 4985 assertions; no exceptions; `/tmp/p10-browser-4F6smm` |
| `just poc-001-build` | 0 | Production bundle built; existing large-chunk advisory |
| `bun /tmp/p17-comparison.ts` | 0 | Nine controlled comparisons; every command/event record replayed |
| `bun /tmp/p17-route-ward.ts` | 0 | Four eight-round route conditions and 12 formation/front cases |
| `python3 /tmp/p17-tuning-probes.py` | 0 | Five independent scratch mutations; each 16/16 Collector tests |

Against BASE's 19 files/565 tests, the candidate adds one unit file and 16 cases. The existing eight counting suites printed 7,460 assertions (P02 1,361; P03 277; P05 810; P06 307; P07 1,074; P08 504; RF 584; P13 2,543). The runner does not expose a grand assertion total for every legacy suite. To measure the new file without changing the committed tests, copied the final prototype to `/tmp/p17-assertion-count`, added observation-only `afterEach`/`afterAll` hooks to its copied Collector test, and ran `bun run --bun test:unit tests/collector.test.ts > /tmp/p17-assertion-count.log` there: exit **0**, 16/16 cases and **9,271 assertion calls**, recorded in `/tmp/p17-assertion-count.json`. An initial invocation from the repository root exited 1 (`Script not found "test:unit"`); the corrected scratch-directory invocations exited 0. No assertion or source behavior was changed by the metric hooks.

Additional browser commands, from `poc-001-linked-formation` for the committed harness and from the repository root for disposable scripts:

```sh
just poc-001-preview
bun tests/browser-collector.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p17-final-browser http://localhost:4173/
bun /tmp/p17-manual-browser.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p17-manual-browser http://localhost:4173/
bun /tmp/p17-corpse-browser.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p17-product-corpse http://localhost:4173/
```

The manual mechanics trace used the standard runner's final-build preview before its automatic shutdown; the other two traces used the subsequently started final-build preview. The three browser commands exited **0**: respectively 379, 523 and 73 assertions, all with zero uncaught exceptions. The Collector harness captured 13 PNGs and downloaded eight native exports, replaying each inside the harness. Its product fight attacked the boss with legal reliable attacks and chose a maneuver when it improved the immediate end-phase forecast; victory occurred at round 4, revision 18, with surviving adds disabled. This is automated gameplay, not a human playtest. The separate default Warder-first trace killed that add, reached its corpse tile in round 3 and retained all three Brood alive. The owned preview was interrupted after capture/replay, intentional exit **130**; the earlier preliminary owned preview likewise exited 130 on deliberate cleanup.

Every CLI command in the table below ran from the repository root, bare, and exited **0**:

| Exact command | Commands / events | Final round / outcome |
| --- | --- | --- |
| `just poc-001-replay /tmp/p17-final-browser/patrol.json` | 2 / 11 | 2 / player |
| `just poc-001-replay /tmp/p17-final-browser/crucible.json` | 2 / 8 | 2 / player |
| `just poc-001-replay /tmp/p17-final-browser/product-playthrough.json` | 18 / 71 | 4 / victory |
| `just poc-001-replay /tmp/p17-final-browser/configured-ward.json` | 1 / 3 | 1 / player |
| `just poc-001-replay /tmp/p17-final-browser/controlled-relocation.json` | 7 / 34 | 3 / player |
| `just poc-001-replay /tmp/p17-final-browser/boss-victory.json` | 1 / 7 | 1 / victory |
| `just poc-001-replay /tmp/p17-product-corpse/product-warder-first.json` | 7 / 30 | 3 / player |
| `just poc-001-replay /tmp/p17-manual-browser/manual-crucible.json` | 36 / 131 | 9 / player |

Also ran `just poc-001-replay /tmp/p17-old-v2.json`, exit **1** as expected, with the explicit error `Run record: unsupported rules version: poc-001-rules-v2/patrol-v2/p07-v1`. The temporary file was a native patrol export with only its rules-version label replaced, testing compatibility rejection rather than claiming a historical attempt was authored here.

Product, patrol, Crucible and manual exports embed `7df00d020119d1c67e85df60d5628ed418cb642c`. The four controlled fixture exports use `unknown` metadata, because they are separate intercepted test bundles; their saved rules, state, commands and ordered events were compared exactly. Immediate previews and end-phase forecasts matched live state/events, including both directions of ward eligibility, relocation, corpse reuse and terminal interruption.

## Observed route and ward tables

`/tmp/p17-route-ward.ts` used product layout/facings/support range with test-owned zero enemy damage, keeping all living entities available through eight rounds. It pre-marked the named adds fallen; shared lifecycle removed their effects. The tables below summarize observed public `endPhase` transitions at the tested SHA, not assertions fixing provisional defaults.

| Fallen adds | Round 1 onward: observed boss cells | Ward |
| --- | --- | --- |
| None | `(1,1)`, `(-1,2)`, then alternates through round 8 | Distances 3/2; out-of-range/in range alternates |
| Censer | Same alternating pair | Same 3/2 support alternation |
| Warder | `(1,1)`, `(-1,2)`, `(-2,1)`, `(-1,-1)`, then alternates the last pair | Removed; corpse cell is reusable |
| Both | `(1,1)`, `(-1,2)`, `(-2,1)`, `(-1,-1)`, `(1,-2)`, `(2,-1)`, then repeats | Removed; complete six-slot route |

At the current Warder facing, the front contains:

| Orientation | 0 | 1 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- | --- | --- |
| Compact | Pazuzu | Girtablilu | Girtablilu | Ugallu | Ugallu | Pazuzu |
| Spread | none | Girtablilu | none | Ugallu | none | Pazuzu |

The relation survives out-of-range rounds. The ward table concerns directional eligibility; Gale still bypasses protection. Actual browser product rounds confirmed the first off/on transition and the default Warder-first corpse move.

## Controlled comparison traces

`/tmp/p17-comparison.ts` starts from the explicit Collector test fixture with boss HP 90, Brood HP 100 each, add HP/max HP 6 each, support range 2, reduction 1, enemy damage 2/3/5 and radius 2. For two rounds, Ugallu uses Claw and Girtablilu Sting on the chosen first target while it lives, otherwise the boss; Pazuzu uses Gale on the boss. Each round either holds, rotates clockwise, or expands once and then holds Spread. All accepted commands and ordered events are in `/tmp/p17-comparison.json`; each resulting record was replayed exactly. These values belong to controlled comparisons, not product tuning assertions.

| Response | First target | Incoming total | Boss HP after two rounds | Fallen add | Boss tile |
| --- | --- | ---: | ---: | --- | --- |
| Hold | Boss | 42 | 68 | none | `(1,1)` |
| Hold | Warder | 38 | 76 | Warder | `(-2,1)` |
| Hold | Censer | 24 | 76 | Censer | `(1,1)` |
| Clockwise each round | Boss | 42 | 69 | none | `(1,1)` |
| Clockwise each round | Warder | 38 | 76 | Warder | `(-2,1)` |
| Clockwise each round | Censer | 24 | 77 | Censer | `(1,1)` |
| Expand then hold | Boss | 15 | 68 | none | `(1,1)` |
| Expand then hold | Warder | 11 | 76 | Warder | `(-2,1)` |
| Expand then hold | Censer | 9 | 76 | Censer | `(1,1)` |

Spreading reduced incoming damage in every sampled target choice without reducing boss damage. Rotation redistributed casualties/HP pressure and sometimes changed frontal mitigation. Censer-first reduced incoming damage most; boss-first dealt more objective damage; Warder-first changed the route and removed guard. These traces support the plan's concern about a favorable Spread routine. They do not establish a universal opening or demonstrate that movement is satisfying; no retuning was authorized or performed.

## Tuning probes

`python3 /tmp/p17-tuning-probes.py` copied the final prototype into five independent `/tmp/p17-tuning-probes/NAME` directories, linked installed dependencies, changed only the named scratch content, and ran `bun run --bun test:unit tests/collector.test.ts` in each copy. All commands exited **0**, each 16/16 tests. Production content remained unchanged.

| Probe | Independent mutation |
| --- | --- |
| HP | Boss/add HP defaults 36/10/10 → 72/18/14 |
| Damage | Warder/Censer/sweep 2/3/5 → 1/6/8 |
| Support | Ward range 2 → 4 |
| Facing | Warder initial facing 4 → 2 |
| Route | Rotate the exported route order by two slots, preserving clockwise adjacency |

Logs and structured results live in that temporary directory. These are focused contract probes, not new balance claims. The route-relative corpse fixture and product expectations permit the route's starting index to evolve.

## Screenshot inspection and manual checklist

Opened these final-candidate views with the image viewer. The current and projected tiles, support labels, threat readouts, corpse overlap and disabled controls were readable. The normal start waits for artwork to load; placeholder capture retains labels and readouts.

| Requested view | Capture | SHA-256 |
| --- | --- | --- |
| Start, ward out of range | `/tmp/p17-final-browser/collector-start.png` | `e5086c04f07aae0ee8e000dda95f5c1bf01c8c8c9a1342bd8d69d5304670a0c5` |
| Round 2, boss `(-1,2)`, ward in range | `/tmp/p17-final-browser/collector-round-two.png` | `f266a152722884446750a044d6e3c77985e000a9ab4fd2a52815359ba2a94dea` |
| End-phase destination ghost | `/tmp/p17-final-browser/end-destination-preview.png` | `ff44d044813dee2f0f8b25e685d6d4f8ef7fef78d5117e2dae261e55de2aa0a3` |
| Default boss on Warder's corpse `(-2,1)` | `/tmp/p17-product-corpse/product-warder-corpse-after.png` | `97b5ac183ebc9c6837c6cb8f549183727ebb96c1a0c972efe87d873946135063` |
| Victory with surviving adds disabled | `/tmp/p17-final-browser/victory-adds-disabled.png` | `fda042178c9d84af5d8ecf540cf6424cd0a5240ded02d5b3b848b3e568748acc` |
| Placeholder | `/tmp/p17-final-browser/collector-placeholder.png` | `5754f09786e5caf2e72d8758f1fb05879db702986eb080cb8640985457077094` |

Checked every numbered manual-checklist item against available real-build controls and states. No mechanically impossible step or required plan correction was found:

- **1–2:** the unchanged lab/patrol browser suites exercise both maneuver orders, spent readouts and resets. Whether patrol is trivial remains a human judgment.
- **3–5:** the real patrol trace accepted self-Shelter in Spread with its amount shown. At Spread orientation 3, frontal Impale on Censer dealt 4 after reduction 2; after moving out of exposure it dealt 6 with reduction 0. A separate wounded-Ugallu trace ended its first Spread round with Ugallu fallen and then accepted Girtablilu's Impale with one living partner.
- **6:** real patrol, Collector and Crucible traces used Shelter and Crosswind. Their tactical value remains for the user to assess.
- **7–10:** the real Crucible trace stayed alive through phase-one pulses/sectors, crossed the configured threshold without changing committed declarations, observed the pending text, entered phase two at the next announcement, and reached outer pulse/fork. Shelter and Crosswind were accepted in both phases. Real export reached round 9, phase two, boss HP 28. Questions about ranks, chores and need for both maneuvers remain subjective.
- **11–14:** real Collector preview showed the move and next local sweep; ward eligibility alternated while Warder lived. A Warder-first product trace reached its corpse in round 3. The controlled comparisons expose Spread pressure and guard exposure. Whether these feel routine remains for the user.
- **15–17 and Next:** all three encounters and the lab are accessible through routes/header links with export controls. These evaluation questions are doable as written and require the user's play observations; no answer or preference is invented here.

The real mechanics trace is a disposable script in `/tmp/p17-manual-browser.mjs`; its observations and exports remain under `/tmp/p17-manual-browser`. The user round itself is not claimed as executed by a human.

## Earlier checks and preservation

Before implementation, the initial configured-ward scratch probe exited 0 and the blocked handoff validated successfully. Initial validator invocation exited 2 for missing dependencies; sandboxed `bun install --frozen-lockfile` in the handoff skill exited 1 on read-only `.agents`, and the approved escalated repeat exited 0. Those dependencies remained available for final validation. Initial unprivileged Git staging/commit was rejected by the read-only worktree index; escalated commands committed the unchanged assignment and blocked report. No automatic approval rejection occurred.

During resumed work, the first unprivileged `just poc-001-typecheck` exited 1 because Docker was inaccessible. Dependencies were missing; `just poc-001-install` with approved escalation exited 0. The first escalated typecheck exited 1 for new Collector declaration union inference. The first full unit run exited 1 with 579 pass/one **new-test** failure: its chosen front attacker used bypassing Gale, so it expected reduction 1 but received 0. No existing test failed. Corrected the new fixture to frontal Claw; focused Collector runs then exited 0. One subsequent typecheck exited 1 for new-test event narrowing; corrected those assertions without changing existing tests. All later typechecks passed.

Preliminary `just poc-001-build` exited 0. The preliminary Collector harness exited 0/367 assertions and won its product fight in round 4. Candidate `7c16949` passed bare unit/typecheck/browser recipes (581 tests, 4985 assertions, browser output `/tmp/p10-browser-pbIuXA`). A final test-only route refinement and safe object-entry validation produced `7df00d0`; **all four required recipes were rerun successfully at that final SHA**. The first five scratch tuning probes and their final-source rerun both exited 0. No source change follows the final tested candidate.

Preservation commands, all exit **0**:

```sh
git diff --check 9abd506351f9726cadd71f5d8fdb46d228f1a1dc..HEAD
git diff --exit-code 9abd506351f9726cadd71f5d8fdb46d228f1a1dc..HEAD -- $(git ls-tree -r --name-only 9abd506351f9726cadd71f5d8fdb46d228f1a1dc poc-001-linked-formation/tests)
git diff --exit-code 9abd506351f9726cadd71f5d8fdb46d228f1a1dc..HEAD -- poc-001-linked-formation/src/core/hex.ts poc-001-linked-formation/src/core/formation.ts poc-001-linked-formation/src/core/sectors.ts poc-001-linked-formation/src/core/damage.ts poc-001-linked-formation/src/core/abilities.ts poc-001-linked-formation/src/core/preview.ts poc-001-linked-formation/src/core/rounds.ts poc-001-linked-formation/src/core/enemy-movement.ts poc-001-linked-formation/src/core/commands.ts poc-001-linked-formation/src/core/smoke.ts poc-001-linked-formation/src/content/patrol.ts poc-001-linked-formation/src/content/brood.ts poc-001-linked-formation/src/content/crucible.ts poc-001-linked-formation/src/view/FormationLab.ts poc-001-linked-formation/src/view/lab-state.ts poc-001-linked-formation/src/view/projection.ts poc-001-linked-formation/scripts poc-001-linked-formation/bin poc-001-linked-formation/package.json poc-001-linked-formation/bun.lock poc-001-linked-formation/vite.config.ts poc-001-linked-formation/vitest.config.ts poc-001-linked-formation/tsconfig.json justfile assets docs/plans docs/adr docs/prototypes docs/CURRENT.md docs/TASK_LOGS.md .agents
```

Only the authorized condition/comment changed in protected `transition.ts`; all other protected paths and all existing tests remain unchanged. The assignment was committed unchanged with the initial report and remains in the final tree: SHA-256 `f5999d45943c3fbfdbe79fec774c09aa9b410d5797f774e8b605bb122b7cd988`.

Final handoff validation command: `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p17-collector/implementer.md --repo /opt/dev/tehom-brainlab-p17`, exit **0**, `ok: true`. No required implementation verification remains unrun. Independent review/integration and the user's subjective play round remain with the Coordinator; no implementation blocker remains.
