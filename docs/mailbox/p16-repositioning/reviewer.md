task: P16-review
role: reviewer
worker: p16-reviewer
status: complete
outcome: "PASS: no material findings; P16 meets the assigned contracts on the combined P15/P16 implementation."
baseline: 69c56adec70960511927ca308e0c824d4e17e33b
reviewed_revision: d8a30c6897f09708e5c972796462ca8c0ebdc848
tested_revision: 9abd506351f9726cadd71f5d8fdb46d228f1a1dc
blocking_findings: []
optional_findings: []
artifacts:
  - docs/mailbox/p16-repositioning/assignment-reviewer.md
  - docs/mailbox/p16-repositioning/reviewer.md
  - /tmp/p10-browser-UrawEN
  - /tmp/p16-review-browser
  - /tmp/p16-review-9uf6u6o9/probe.ts
  - /tmp/p16-review-9uf6u6o9/tuning.py
verification:
  - "just poc-001-test initial sandbox attempt: exit 1, Docker daemon inaccessible."
  - "just poc-001-test initial host-access attempt: exit 127, missing vitest dependency."
  - "just poc-001-install: exit 0, frozen dependency installation."
  - "just poc-001-test after install: exit 0, 565 tests across 19 files."
  - "just poc-001-typecheck: exit 0."
  - "just poc-001-build: exit 0, existing large-chunk advisory."
  - "just poc-001-test-browser: exit 0, four suites and 4985 assertions; zero browser exceptions."
  - "P16 browser-repositioning harness: exit 0, 98 assertions; six screenshots generated and five inspected."
  - "just poc-001-replay /tmp/p16-review-browser/relocating.json: exit 0, 5 commands and 24 events."
  - "just poc-001-replay /tmp/p16-review-browser/patrol.json: exit 0, 1 command and 12 events."
  - "just poc-001-replay /tmp/p16-review-browser/crucible.json: exit 0, 1 command and 10 events."
  - "bun /tmp/p16-review-9uf6u6o9/probe.ts: exit 0, 869 base transition/preview comparisons, 75 identical record checkpoints, 7680 occupancy cases."
  - "python3 /tmp/p16-review-9uf6u6o9/tuning.py host-access run: exit 0; four independent variants each pass all 27 new tests."
  - "Scratch tuning initial sandbox runner: terminated, exit 143; host-access rerun completed."
  - "git diff --check BASE..REVIEWED: exit 0."
  - "git diff --exit-code BASE..REVIEWED over all 32 existing test files: exit 0."
  - "git diff --exit-code BASE..REVIEWED over protected paths: exit 0."
  - "git diff --exit-code REVIEWED..TESTED -- poc-001-linked-formation: exit 0."
  - "Handoff validator initial attempt: exit 2, missing locked dependencies; skill-local frozen bun install: exit 0. Final validator with --repo: exit 0, ok true."
review:
  - "Independent source, contract, assertion, browser, replay and tuning review completed; PASS with no blocking or optional findings."
discoveries:
  - "Tested HEAD is an evidence-only successor; the entire prototype matches the reviewed revision. Browser exports identify tested HEAD."
  - "Occupancy is a fixed living-only rule, not a configurable option; varied live/dead and mobile/stationary inputs cover it."
blockers: []

Author: **p16-reviewer**, 2026-10-06. Assignment: [assignment-reviewer.md](assignment-reviewer.md). Contract: [P16 plan](../../plans/2026-10-06-27ca8f17-poc-001-enemy-repositioning.md). Context inspected: [Architect](../boss-experiments/architect.md), [Implementer](implementer.md), [Integration](integration.md). Used the repository's ruach-handoff and ruach-testing skills and ADR-0006.

## Verdict and scope

**PASS. No material findings, blocking findings or optional findings.** Reviewed exactly `69c56adec70960511927ca308e0c824d4e17e33b..d8a30c6897f09708e5c972796462ca8c0ebdc848` (14 paths). Inspected all implementation changes, both new unit test files, the additive browser harness and fixtures, README changes, and surrounding transition, preview, lifecycle, record, encounter, selector and view code. Tests ran at worktree HEAD `9abd506351f9726cadd71f5d8fdb46d228f1a1dc`, whose only difference from the reviewed revision is the integration report. A prototype-wide `git diff --exit-code` confirms code, tests and runtime equivalence.

The implementation is small and follows the existing boundaries. `enemy-movement.ts:23–35` selects living mobile enemies, applies updated occupancy in array order, and keeps facing and corpse data. `rounds.ts:102–113` relocates only after committed attacks, expiry and terminal settlement, before budgets and fresh announcements. `run-record.ts:114–127` admits boolean mobility and living-only distinctness while retaining reserved-cell and ID checks. `CombatScene.ts:182–183` places live tokens above corpses; its End-phase ghosts use the real preview state. No renderer callback owns movement.

No production code, existing tests, plans, protected documents or generated agent resources were modified during review. The final commit contains only this report and the unchanged assignment. Assignment SHA-256: `aa59075b07d4a1c27f2b5b6a87502e61f2b31fc941118cb719ce7df7c0c986c3`.

## Acceptance evidence

| Criterion | Observable evidence and result |
| --- | --- |
| 1. Clockwise movement; Brood and allowances preserved | Six route-start cases verify successor/wraparound. Real End phase preserves formation and resets both P13 allowances. Maneuvers remain legal after relocation. |
| 2. Occupied fallback/stay; valid occupancy | Explicit fallback and both-neighbour blocking cases pass. Independent selector probe checks 7,680 three-enemy placement/mobility/life combinations: 5,652 moves, 108 blocked events, unique living occupancy, reserved destinations and exactly one event per living mobile enemy. Sequential expected destinations use updated occupancy. |
| 3. Fallen cells reusable and serializable | Corpse fixture puts the mobile Warder on fallen Censer's cell. Fallen identity/cell persist. Eight successive recorded End phases replay exactly. Browser pointer hit selects Warder above Censer; native relocating export parses and replays. |
| 4. Committed attack origins; new geometry before input | Controlled public end-phase test resolves recipients from the old fixed area before relocation and announces a fresh area from the new cell. Computed facing-0 example asserts Girtablilu at `(-2,1)` and Girtablilu/Pazuzu at `(-1,-1)` through `frontCells` and `selectRecipients`. Protection reads the moved Warder's cell. Browser tokens and ordered events match authoritative core after commit. |
| 5. Anchor and independent traits | Turned Crucible remains at centre without movement events. Nonrotatable mobile Warder moves and rejects Crosswind. Rotatable mobile Warder retains Crosswind facing through movement. |
| 6. Terminal, event/replay and P09 equivalence | Victory and defeat emit no movement. Every formation exercises End phase, maneuvers and Crosswind previews against actual states/events, including conditional forecast movement, without live mutation. Repeated relocating records reproduce ordered events. |
| 7. Existing patrol/Crucible unchanged | All old tests pass unedited. Independent comparison against archived base covers all five presets, 869 accepted/rejected transitions and previews, and 75 identical record/replay checkpoints. Native patrol and Crucible exports replay. Crucible remains anchored, and all five new integration cases preserve configured P15 R1 mitigation and explicit replay overrides. |
| 8. No frozen tuning | Four scratch variants each pass the 22 movement and five integration tests. Details below. Fixture-owned numbers/cells distinguish explicit test inputs from product defaults. |
| 9. Existing suites pass unedited | Unit, typecheck, build and all four standard browser suites pass. All 32 files present under `tests/` at base are byte-unchanged; every test path in the reviewed diff is an addition. |

## Provisional-default probes

Disposable candidate and base copies were made with `git archive` in `/tmp/p16-review-9uf6u6o9`, with installed dependency links. Only scratch sources were edited. `tuning.py` restores candidate sources between variants and at completion. Each variant ran from the scratch prototype directory:

```sh
bun node_modules/vitest/vitest.mjs run tests/enemy-movement.test.ts tests/repositioning-integration.test.ts
```

| Scratch variant | Result | Interpretation |
| --- | --- | --- |
| Change patrol HP for all six entities, all enemy damage defaults, all patrol enemy cells/facings, and Crucible HP/threshold/damage defaults | Exit 0, 27/27 | New assertions do not freeze product HP, damage, starting layouts or facings. |
| Rotate reserved route start: `[3,5,7,9,11,1]` | Exit 0, 27/27 | Successor/fallback relations adapt to the route rather than copied coordinates. |
| Reverse reserved route order: `[11,9,7,5,3,1]` | Exit 0, 27/27 | Experimental route ordering adapts. This deliberately changes the as-written clockwise route; it is a tuning robustness probe, not evidence that a reversed route satisfies the current contract. Current route order was separately checked against the plan and unchanged geometry module. |
| Mark product Censer mobile in the scratch factory | Exit 0, 27/27 | New tests use explicit mobility inputs, independently of product defaults. This experimental change is outside shipped P16's stationary-patrol contract and was not retained. |

Nothing broke in those four variants. Occupancy is not configurable: living enemies block, fallen enemies do not. The independent 7,680-case probe varies every live/dead and mobile/stationary combination for three enemies at all distinct route placements. Existing selector cases separately cover omitted/false mobility, off-route centre, alternative IDs and reversed processing order. No rule alteration was needed to cover these inputs.

The first scratch test runner stalled under sandbox process restrictions and was terminated (exit 143). It yielded no completed tuning result. Only that identified review-owned runner was stopped; the host-access rerun provided the results above.

## Executed verification

Required recipes ran **bare from the repository root**, with no hand-set environment variables or Chrome override. Host access was used because Docker is inaccessible inside the sandbox. Initial unit attempts returned 1 for Docker access and 127 for missing dependencies. The prescribed frozen `just poc-001-install` returned 0, then the completed checks were:

| Command | Exit | Result |
| --- | --- | --- |
| `just poc-001-test` | 0 | 565 tests / 19 files |
| `just poc-001-typecheck` | 0 | Typecheck passes |
| `just poc-001-build` | 0 | Production build passes; existing large-chunk advisory |
| `just poc-001-test-browser` | 0 | Lab 197, preview 24, patrol 4,572, records 192 assertions; zero browser exceptions |
| `just poc-001-replay /tmp/p16-review-browser/relocating.json` | 0 | 5 commands / 24 events; revision 5, round 3, player |
| `just poc-001-replay /tmp/p16-review-browser/patrol.json` | 0 | 1 command / 12 events; revision 1, round 2, player |
| `just poc-001-replay /tmp/p16-review-browser/crucible.json` | 0 | 1 command / 10 events; revision 1, round 2, player |
| `bun /tmp/p16-review-9uf6u6o9/probe.ts` | 0 | Base preservation, record/replay equality and occupancy probes described above |
| `python3 /tmp/p16-review-9uf6u6o9/tuning.py` with host access | 0 | All four isolated variants exit 0 with 27 passing tests each |

The bare browser runner selected `/home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell` because it was the highest executable Playwright version discovered. It built its own fresh production bundle before preview. Port 4173 bound successfully on the first browser attempt; no port wait or process intervention was required. The tracked non-PTY preview shutdown exit 130 did **not** recur: this recipe returned 0 after all suites passed. Evidence: `/tmp/p10-browser-UrawEN`.

Additional P16 browser commands, sequentially after the standard browser recipe, from the prototype directory:

```sh
bun node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4187 --strictPort
bun tests/browser-repositioning.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p16-review-browser http://localhost:4187/
```

Private preview started successfully. Harness exit 0: 98 assertions, zero exceptions, six screenshots and three native exports. Inspected `mobile-before.png`, `mobile-destination-preview.png`, `mobile-after.png`, `corpse-destination-preview.png` and `corpse-after.png`: original Warder, destination ghosts, changed front tint and visible living token over a corpse are consistent with the authoritative cells. The sixth screenshot (`corpse-before.png`) was generated but not separately inspected. Exports embed tested HEAD `9abd506351f9726cadd71f5d8fdb46d228f1a1dc`. The private review preview was stopped intentionally with Ctrl-C (exit 130); this is separate from the standard bare browser recipe result.

Preservation checks all exit 0: whitespace check on the requested range; diff over all 32 existing test paths enumerated from base; diff over the plan's protected core modules, content, view adapters, main, scripts, wrappers, package/lock/config paths, assets and protected documents; and prototype-wide diff from reviewed revision to tested HEAD. Only five additive test/harness paths appear under `tests/` in the reviewed range.

Report validation command:

```sh
bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p16-repositioning/reviewer.md --repo /opt/dev/tehom-brainlab-p16r
```

The initial validator attempt exited 2 (`DEPENDENCY_UNAVAILABLE`). Installed its dependencies with `bun install --frozen-lockfile` in `.agents/skills/ruach-handoff` (exit 0), without changing generated sources. Final validation: exit 0, `ok: true`. No merge or push performed. No required acceptance or verification work remains unverified. Human balance judgments and P17's future Collector integration are outside this review.
