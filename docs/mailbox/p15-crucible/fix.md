task: P15-fix
role: implementer
worker: p15-fix
status: complete
outcome: "R1 fixed with reproduced regression coverage; R2 browser traces use controlled inputs. All required checks and four tuning probes pass."
baseline: 6bd8d3c
candidate_revision: 4523be2ef4c6b317f3b09fb26b39d126b1673641
tested_revision: 4523be2ef4c6b317f3b09fb26b39d126b1673641
artifacts:
  - docs/mailbox/p15-crucible/assignment-fix.md
  - docs/mailbox/p15-crucible/fix.md
  - /tmp/p15-fix-browser
  - /tmp/p15-fix-tuning/results.json
  - /tmp/p10-browser-bVwG8U
changed_paths:
  - poc-001-linked-formation/src/core/transition.ts
  - poc-001-linked-formation/src/core/run-record.ts
  - poc-001-linked-formation/tests/crucible.test.ts
  - poc-001-linked-formation/tests/browser-crucible.mjs
  - poc-001-linked-formation/tests/browser/crucible-fixtures.ts
  - docs/mailbox/p15-crucible/assignment-fix.md
  - docs/mailbox/p15-crucible/fix.md
findings:
  - "R1: dispatcher and record defaults share the configured Crucible self-guard reduction. New test reproduced reduction 2 instead of 1 before the fix and now verifies damage 3, preview equivalence, exported configuration and replay."
  - "R2: required phase crossing, pulses, sector/fork, Shelter, maneuvers and cadence use explicit test-owned rules and durable living snapshots. Product-route checks derive visible intentions and phase from content/state and permit unfinished, victory or defeat outcomes."
probe_results:
  - "HP 60 -> 72: unit/build/browser exits 0/0/0; 21 tests, 474 browser assertions."
  - "Phase-one A primary damage 5 -> 6: unit/build/browser exits 0/0/0; 21 tests, 474 browser assertions."
  - "Threshold 30 -> 5: unit/build/browser exits 0/0/0; 21 tests, 474 browser assertions."
  - "Phase-two B area fork -> inner: unit/build/browser exits 0/0/0; 21 tests, 474 browser assertions."
verification:
  - "just poc-001-test: exit 0; 538 tests in 17 files."
  - "just poc-001-typecheck: exit 0."
  - "just poc-001-build: exit 0; existing large-bundle warning."
  - "just poc-001-test-browser: exit 0; 4985 assertions across four suites, zero browser exceptions."
  - "Separate Crucible browser harness: exit 0; 474 assertions, 11 screenshots, zero uncaught exceptions; native exports replayed in-process."
  - "just poc-001-replay /tmp/p15-fix-browser/phase-crossing.json: exit 0; 14 commands, 51 events, round 5, player phase with boss phase 2."
  - "just poc-001-replay /tmp/p15-fix-browser/product-attempt.json: exit 0; 9 commands, 33 events, round 3, player phase."
  - "Four independent scratch probes: all unit/build/browser commands exit 0."
  - "Original-test and protected-document preservation; git diff --check: exit 0."
  - "Handoff validator: exit 0, ok true."
discoveries:
  - "Correct mitigation exposed an assumption in the P15 threshold test: reduction 8 can absorb frontal Claw. Its phase-boundary trace now chooses an unguarded attacker, preserving the asserted threshold and phase invariants."
  - "Product exports identify the tested candidate SHA; the intercepted test fixture records buildRevision unknown, as permitted by the codec."
blockers: []

Author: p15-fix, Implementer. Assignment: [assignment-fix.md](assignment-fix.md). Findings: [reviewer.md](reviewer.md). No merge, push, plan change, generated-skill change or protected-document change performed. The report/assignment commit is an evidence-only successor to the tested candidate; no implementation changes follow that candidate.

## R1: configured self-guard

`commandAbilityRules` supplies only Crucible's configured directional reduction to the live ability dispatcher and the default record configuration. Other P14 ability amounts, Shelter/Close rules, explicit record ability overrides and patrol dispatch retain their existing behavior. Immediate and forecast previews execute the same dispatcher; replay consumes the serialized ability configuration.

Added an observable regression using reduction **1**, differing from the ability default **2**. At the public command boundary it requires frontal Claw raw damage 4, reduction 1, damage 3 and boss HP 87 from the explicitly supplied HP 90. It compares preview state/events, verifies the exported ability rules, and replays the record to the same state/events.

Before changing production code, `bun run --bun test:unit tests/crucible.test.ts` with worker IPC access exited **1**: the new regression received reduction 2 and damage 2 (20 tests passed, 1 failed). After the fix, the same command initially exposed the existing P15 threshold trace's absorbed hit; choosing an unguarded Ugallu/Girtablilu preserves a guaranteed threshold-crossing attack across all tested facings. Final focused rerun exited **0**, 21/21 tests. An initial sandbox-only focused run exited **1** after a worker IPC timeout with no tests executed; it was a setup failure, not the reproducer.

## R2: tuning-independent browser evidence

The product route executes up to two smoke rounds, compares HP/revision/ordered events and previews with the public core, and exports the resulting attempt. It imposes no phase-crossing, fork-before-victory or default-strategy victory requirement. Intention kinds, turnability, active/pending phase, title and presets are checked against state/content.

The intercepted fixture supplies explicit HP, threshold, damage, mitigation, patterns and living Brood HP. Its trace exercises both maneuver categories, Shelter and Crosswind in both phases, phase-one sector, phase-two outer pulse and fork, pending versus active phase, retained HP/facing at entry, B's advance from the turned facing, A's retained facing and budget resets. Controlled threshold and immediate-kill traces remain. Their reachability is independent of product tuning. The phase-crossing fixture's native export is also replayed through the CLI.

## Exact verification

All four required recipes ran from the repository root, bare, with no hand-set environment, Chrome override or manual prebuild. Existing dependencies were present. Docker/Chrome/IPC access used sandbox escalation; no automatic approval rejection occurred. Browser verification began before the standalone build and built its own fresh production bundle.

| Command | Exit | Evidence |
| --- | ---: | --- |
| `just poc-001-test` | 0 | 538/538 tests, 17 files; includes unchanged patrol/P14 suites. |
| `just poc-001-typecheck` | 0 | TypeScript passed. |
| `just poc-001-test-browser` | 0 | Lab 197 + preview 24 + patrol 4572 + records 192 = 4985 assertions; zero exceptions. Artifacts `/tmp/p10-browser-bVwG8U`. |
| `just poc-001-build` | 0 | Existing large-bundle warning only. |
| `just poc-001-replay /tmp/p15-fix-browser/phase-crossing.json` | 0 | 14 commands, 51 events, revision 14, round 5, player; active boss phase 2. |
| `just poc-001-replay /tmp/p15-fix-browser/product-attempt.json` | 0 | 9 commands, 33 events, revision 9, round 3, player. |

From `poc-001-linked-formation`, ran:

```sh
bun tests/browser-crucible.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p15-fix-browser http://localhost:4173/
```

Exit **0**, 474 assertions, 11 screenshots and zero uncaught browser exceptions. Served with `just poc-001-preview`; stopped only its identified worktree-mounted container `8eb65afff5fd` after completion (preview recipe exit 143 from deliberate cleanup). Inspected `phase-pending.png` and `phase-two-fork.png`: pending/active phase, telegraphs, turnability and controls are readable. No human gameplay/balance assessment claimed.

Native export SHA-256 values:

- `phase-crossing.json`: `b56638017e6d8ca09af8624b8a8dbed2efa8a3fd9ab959b1dd299a90f91f60b3`.
- `product-attempt.json`: `7dbeeceb8456d8a4f442e7b43287e923146756827d9d918dc5ea7c7ce00b9da3`.

## Four independent scratch probes

`python3 /tmp/p15-fix-probes.py` exited **0**. It copied the final prototype to `/tmp/p15-fix-tuning/poc`, linked installed dependencies and sibling assets, applied each single mutation independently to the original content, then ran these commands in the scratch prototype:

```sh
bun run --bun test:unit tests/crucible.test.ts
bun run --bun build
bun run --bun preview --port 4175
bun tests/browser-crucible.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p15-fix-tuning/NAME-browser http://localhost:4175/
```

| NAME | Independent default mutation | Unit exit/tests | Build exit | Browser exit/assertions |
| --- | --- | --- | ---: | --- |
| hp | `bossHp: 60` → `72` | 0 / 21 | 0 | 0 / 474 |
| damage | First `primaryDamage: 5` → `6` (phase-one A) | 0 / 21 | 0 | 0 / 474 |
| threshold | `phaseTwoAt: 30` → `5` | 0 / 21 | 0 | 0 / 474 |
| pattern | Phase-two B `area: 'fork'` → `'inner'` | 0 / 21 | 0 | 0 / 474 |

Each scratch preview was deliberately terminated afterward (exit 143). All four browser runs had zero uncaught exceptions. Logs are `/tmp/p15-fix-tuning/NAME-{unit,build,browser}.log`; structured results are `results.json`. Scratch content was restored and compared equal to its saved original. Production defaults were never mutated. Both reviewer failure probes now pass without constraining provisional pacing or patterns.

## Preservation and handoff

These commands exited **0**:

```sh
git diff --check 6bd8d3c..HEAD
git diff --exit-code 6bd8d3c..HEAD -- docs/plans docs/CURRENT.md docs/TASK_LOGS.md
git diff --exit-code 6ebe170..HEAD -- $(git ls-tree -r --name-only 6ebe170 poc-001-linked-formation/tests)
git diff --exit-code HEAD -- poc-001-linked-formation
```

Assignment SHA-256: `4ca931d5fe429971356940c45cb9a42e698929961d7cabb6900183ad0807bcde`; committed unchanged with this report. Validation command:

```sh
bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p15-crucible/fix.md --repo /opt/dev/tehom-brainlab-p15
```

Exit **0**, `ok: true`, no diagnostics, resolved baseline/candidate/tested revisions. Independent review and integration remain with the Coordinator; no implementation blockers remain.
