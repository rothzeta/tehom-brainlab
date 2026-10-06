task: P15-review
role: reviewer
worker: p15-reviewer
status: complete
outcome: "Approve re-reviewed candidate: R1 and R2 resolved; no remaining material findings or fix-diff regressions identified."
baseline: 6ebe1703c94c2bdb404fd3bcdcfa212336a18b7c
review_baseline: 6bd8d3c68f986ec145a89d14f6a9a2457a9e07aa
reviewed_revision: 4523be2ef4c6b317f3b09fb26b39d126b1673641
tested_revision: 4523be2ef4c6b317f3b09fb26b39d126b1673641
execution_revision: bdadfb23260e9e3a1777b7610d65012174c70ee7
previous_reviewed_revision: e685c3cf24f1b997fcc2cd71cad76bdada4f95f0
previous_execution_revision: 7537d0bddc5d5409b116a3ad4919bf02cb1e7a36
artifacts:
  - docs/mailbox/p15-crucible/assignment-reviewer.md
  - docs/mailbox/p15-crucible/reviewer.md
  - docs/mailbox/p15-crucible/fix.md
  - /tmp/p15-rereview-browser
  - /tmp/p10-browser-uwkcGo
  - /tmp/p15-rereview-tuning/results.json
blocking_findings: []
optional_findings: []
verification:
  - "Re-review just poc-001-test: exit 0, 538 tests in 17 files."
  - "Re-review just poc-001-typecheck: exit 0."
  - "Re-review just poc-001-build: exit 0, existing large-bundle warning."
  - "Re-review just poc-001-test-browser: exit 0, 4985 assertions across four suites, zero browser exceptions; no shutdown exit 130."
  - "Re-review Crucible harness: exit 0, 474 assertions and 11 screenshots, zero uncaught exceptions. Exact invocation below."
  - "just poc-001-replay /tmp/p15-rereview-browser/phase-crossing.json: exit 0, 14 commands, 51 events, revision 14, round 5, player with boss phase 2."
  - "just poc-001-replay /tmp/p15-rereview-browser/product-attempt.json: exit 0, 9 commands, 33 events, revision 9, round 3, player."
  - "Four independent scratch default mutations: all unit/build/browser exits 0/0/0; 21 Crucible tests and 474 browser assertions per mutation."
  - "bun /tmp/p15-rereview-extra.ts: exit 0, corrected original self-guard reproducer and 6048 preview comparisons including 504 phase entries."
  - "bun /tmp/p15-rereview-guard.ts: exit 0, 108 live/preview/replay cases and 36 explicit ability-rule override cases; patrol record defaults unchanged."
  - "Fix diff checks, pre-P15 test and protected-path preservation, candidate/execution prototype equality: exit 0."
  - "Inspected seven required screenshot views from the re-review harness; phases, turnability and telegraphs remain readable."
  - "Handoff validator command: exit 0, ok true; exact command and results recorded below."
review:
  - "Re-review complete: approve 4523be2ef4c6b317f3b09fb26b39d126b1673641. Original R1 and R2 resolved; no remaining blocking or optional findings."
discoveries:
  - "R1 uses only the configured Crucible directional reduction; other ability rules and patrol defaults retain their prior behavior."
  - "R2 preserves required controlled traces and native replay coverage while permitting product tuning. All four original mutation probes now pass."
  - "Earlier review execution history and findings are preserved below as historical evidence; Re-review is the current verdict."
blockers: []

**Historical review:** the original review below concerns `e685c3c`. Its R1/R2 findings are resolved by the appended Re-review; the leading YAML describes the current candidate.

Author: p15-reviewer. Assignment: [assignment-reviewer.md](assignment-reviewer.md). Contract: [P15](../../plans/2026-10-06-6dcd120b-poc-001-two-phase-central-boss.md); design context: [Architect follow-up](../boss-experiments/architect.md#follow-up-q1-lever-2026-10-06); incoming evidence: [Implementer](implementer.md).

Reviewed the complete `6ebe1703c94c2bdb404fd3bcdcfa212336a18b7c..e685c3cf24f1b997fcc2cd71cad76bdada4f95f0` change and relevant surrounding transition, ability, intent, damage and lifecycle code. Verification ran in the assigned worktree at `7537d0bddc5d5409b116a3ad4919bf02cb1e7a36`, which adds only the Implementer's report to the candidate. The prototype diff between these revisions is empty. Browser exports correctly identify that execution HEAD; they do not claim to identify the earlier candidate SHA. No merge or push performed.

## Blocking findings, ordered by severity

### R1 — P2: configured boss self-guard reduction is ignored

**Location:** `poc-001-linked-formation/src/core/transition.ts:43`, with the newly introduced self-protection at `src/content/crucible.ts:95` and record defaults at `src/core/run-record.ts:184`.

**Failure scenario and evidence:** clone `DEFAULT_CRUCIBLE_RULES`, set only `damageRules.directionalReduction = 1`, then call `createCrucible('phase-one', rules)`. At Compact orientation 0/facing 0, Ugallu is in the boss's guard front. Submit revision-0 Ugallu Claw through `applyCommand`. The emitted `damage-applied` event is:

```json
{"targetId":"crucible","rawDamage":4,"directionalReduction":2,"damage":2,"hpBefore":60,"hpAfter":58}
```

The configured reduction is **1**, so required damage is **3** and resulting HP **57**. The public dispatcher calls `applyAbility` without rules; that function uses `DEFAULT_ABILITY_RULES.damageRules` rather than the serialized Crucible rule. `createRunRecord` likewise defaults the ability configuration independently. Preview/commit agreement alone cannot detect this shared wrong result. The new tests use an explicit encounter reduction of 8 but never assert its effect on the boss's HP.

**Why it matters:** P15's fixture contract explicitly specifies the self-guard using the encounter's `damageRules.directionalReduction`. A valid, accepted factory configuration silently has no effect on this mechanic. Current defaults happen to agree at 2, masking the defect.

**Required fix direction:** honor the configured Crucible self-guard amount at the live command boundary and keep preview, exported ability configuration and replay consistent. Preserve patrol behavior and P14's damage/ability contracts. Add an observable test with differing encounter/default reduction values. If this needs a protected-file change, follow the assignment's stop/escalation rule rather than editing protected files without authorization.

### R2 — P2: browser coverage freezes provisional pacing and pattern

**Location:** `poc-001-linked-formation/tests/browser-crucible.mjs:164` (also the fixed 20-round loop at line 133 and unconditional victory assertion at line 165).

**Failure scenario and evidence:** in a disposable copy, change only `DEFAULT_CRUCIBLE_RULES.phaseTwoAt` from 30 to 5. All 20 Crucible unit tests and the rebuilt application pass. The otherwise unchanged browser harness exits **1** with `AssertionError: ordinary play reaches both phases and the fork`.

The public-command trace confirms correct behavior: the boss starts successive rounds at HP `60,49,38,27,16,5`; phase two enters once at round 6 on beat A, and the player wins before a phase-two B announcement. Requiring a fork before victory rejects a permitted threshold variation despite correct declaration-only entry and death-first victory. Changing only the phase-two B area's provisional value from `fork` to `inner` also passes all 20 unit tests/build but fails the same browser assertion, despite entering phase two at round 4 and winning at round 6.

**Why it matters:** acceptance criterion 9 explicitly prohibits freezing provisional numbers or the beat table in new assertions. This conjunction implicitly freezes those choices even though it contains no literal HP/threshold expectation. The fixed horizon and default-strategy victory assertion impose further balance assumptions.

**Required fix direction:** retain the native product-route smoke/export checks, deriving their assertions from configured content and permitted terminal outcomes. Exercise mandatory phase-crossing and specific telegraph/cadence traces with explicit test-local rules and controlled test-owned snapshots. Ensure their reachability independently of the product defaults; do not remove required coverage or pin the provisional table to satisfy the trace.

No optional findings. The navigation failure below is execution history, not a confirmed application issue.

## Acceptance evidence and limits

| Criterion | Evidence / result |
| --- | --- |
| 1, anchoring and Crosswind | New phase/shape/facing action matrix, cadence tests and browser traces pass; boss cell remains `(0,0)`, turnable cells rotate and pulse/mark declarations stay fixed. |
| 2, geometry | New tests cover 12 formations × 6 facings, deriving recipients from positions and ring/sector/fork geometry, checking parity relations and self-guard membership. Self-guard **amount** remains R1. |
| 3, phase boundary/death | Controlled crossing tests retain current declarations/damage, emit one next-announcement entry, retain facing/HP and reset beat. Death/defeat tests and browser fixtures pass. |
| 4, preview equivalence | Unit tests cover Shelter/order/fizzle/terminal interruption; reviewer probe adds 6048 immediate and forecast comparisons across both phases, shapes, orientations, facings and beats, including 504 phase entries. Compared complete state/events and filtered enemyEvents. Includes Crosswind forecasts in both directions. |
| 5, mechanical traces | Both phases' explicit-rule tests use both maneuver categories plus Shelter/Crosswind and verify budget reset. Automated evidence, not human playtesting. |
| 6, patrol/reset/records | Existing suites unchanged and passing, clean encounter reset test passing, native Crucible exports replaying, nonempty patrol export replaying. Record version stays 1 and patrol rules version unchanged; existing old-version rejection tests pass. |
| 7, view/routes | Successful 330-assertion harness verifies presets, normal/placeholder encounter links, lab links, unknown play route, threshold/kill states and native export. Screenshot inspection confirms legible pending/active phase and turnability labels. |
| 8, facing cadence | Tests begin from every controlled facing in each phase, turn both ways with Crosswind on A and B, assert B adds one from the current facing and A retains it. Entry preserves the turned facing; next B advances it. Diagnostic starts are included. No copied default-facing sequence. |
| 9, tunability | Unit probes pass; browser threshold/pattern probes fail for incidental expectations (R2). |
| 10, existing suites | 517 original plus 20 new tests pass; no existing test edited. |

No new manual gameplay/balance evidence collected. The preview probe verifies equivalence, not the correctness of every shared rule; R1 illustrates that distinction. Cause of the first additive harness navigation failure is unverified.

## Exact verification and execution history

Required recipes ran from `/opt/dev/tehom-brainlab-p15r`, bare, without hand-set environment or Chrome overrides. Sandbox escalation supplied Docker/Chrome access; automatic approval review rejected no action. Dependencies were missing in this worktree and installed with the required frozen recipe. The browser recipe ran before the standalone build and built its own fresh bundle.

| Command | Exit and observed result |
| --- | --- |
| `just poc-001-test` (sandbox) | 1; Docker daemon inaccessible, no tests executed. |
| `just poc-001-test` (Docker access, before install) | 127; `vitest: command not found`, no tests executed. |
| `just poc-001-install` | 0; 43 pinned packages installed. |
| `just poc-001-test` (after install) | 0; 17 files, 537 tests passed. |
| `just poc-001-typecheck` | 0. |
| `just poc-001-test-browser` | 0; lab 197 + preview 24 + patrol 4572 + records 192 = 4985 assertions; zero browser exceptions. No shutdown-130 symptom observed. |
| `just poc-001-build` | 0; existing large-bundle warning only. |
| `just poc-001-preview` | Served the standalone browser rerun; deliberately stopped its identified worktree-owned Docker container afterward. Recipe exit 143 from cleanup, not an assertion failure. |
| `just poc-001-replay /tmp/p15-review-browser/phase-crossing.json` | 0; 26 commands, 100 events, revision 26, round 6, victory. |
| `just poc-001-replay /tmp/p15-review-browser/phase-two-diagnostic.json` | 0; 4 commands, 15 events, revision 4, round 2, player. |
| `just poc-001-replay /tmp/p15-review-browser-isolated/phase-crossing.json` | 0; same counts/outcome. |
| `just poc-001-replay /tmp/p15-review-browser-isolated/phase-two-diagnostic.json` | 0; same counts/outcome. |
| `just poc-001-replay /tmp/p10-browser-tnOx7y/records/healthy-attack.json` | 0; 14 commands, 71 events, revision 14, round 4, victory. |

The bare browser runner selected `/home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell`, reporting **highest executable Playwright version (chromium_headless_shell-1223)**. Standard artifacts: `/tmp/p10-browser-tnOx7y`.

From the prototype directory, exact additive harness commands:

```sh
bun tests/browser-crucible.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p15-review-browser http://localhost:4173/
bun tests/browser-crucible.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p15-review-browser-isolated http://localhost:4173/
```

First run, alongside standard browser verification: exit **1**, `Inspected target navigated or closed` during navigation after phase-crossing, diagnostic and patrol exports. Second run, isolated, unchanged code/tests: exit **0**, 330 assertions, 11 screenshots, no uncaught browser exceptions. No claim that concurrency caused the first error. Inspected the first run's start/sector/pending/outer/fork/patrol images and the successful rerun's entry/Shelter/threshold/kill/placeholder images: all required views readable, preview `Threats:` format preserved.

## Scratch tuning and supplementary probes

Scratch copy: `/tmp/p15-review-tuning/poc`, with source/config/tests copied, dependencies linked to the installed prototype dependencies, sibling assets linked read-only by usage, and all output outside Git. Each mutation started independently from the original `crucible.ts`; production worktree files were never changed. Bun version 1.4.2.

For each row, from that scratch prototype, Python orchestration ran these exact child commands in sequence:

```sh
bun run --bun test:unit tests/crucible.test.ts
bun run --bun build
bun tests/browser-crucible.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p15-review-tuning/NAME-browser http://localhost:4174/
```

`NAME` is the row label below. A task-owned `bun run --bun preview --port 4174` served the scratch production bundles, then was terminated after the probes; its exit code was not captured. The orchestration exited 0. Source was restored; `cmp` against the saved original exited 0.

| NAME | Single default mutation | Unit exit | Build exit | Browser exit |
| --- | --- | ---: | ---: | --- |
| hp | `bossHp: 60` → `bossHp: 72` | 0, 20 tests | 0 | 0, 399 assertions |
| threshold | `phaseTwoAt: 30` → `phaseTwoAt: 5` | 0, 20 tests | 0 | 1, fork trace assertion (R2) |
| damage | first `primaryDamage: 5` → `primaryDamage: 6` (phase-one A) | 0, 20 tests | 0 | 0, 330 assertions |
| pattern | phase-two B `area: 'fork'` → `area: 'inner'` | 0, 20 tests | 0 | 1, fork trace assertion (R2) |

Logs are `/tmp/p15-review-tuning/NAME-{unit,build,browser}.log`. The first sandbox-only scratch unit orchestration timed out waiting for its Vitest worker (HP child exit 1, no tests); its next probe was stopped and the orchestration exited 143. All four actual assertion runs above then completed with working IPC, without test changes. This setup failure is not a tuning result.

`bun /tmp/p15-review-extra.ts` exited 0: the self-guard reproducer above and 6048 additional comparisons. The comparison probe used public `createCrucible`, `announceCrucible`, `previewFacts`, `previewCommand` and `applyCommand`, controlled living HP to avoid incidental termination, and checked both immediate state/events and each forecast against a real end-phase command. It varied phase, shape, orientation, facing, beat and threshold-adjacent boss HP, including every available ability/target/direction and both rotation commands plus shape change.

`bun /tmp/p15-review-trace.ts` exited 0: reproduced the harness's public-command strategy under the two failing variations, showing valid phase entry followed by victory (threshold: entry round 6, no B before victory; pattern: entry round 4, phase-two B non-turnable inner pulse, victory round 6). Its decisive outputs are preserved in R2 above.

## Preservation, handoff and ownership

All these commands exited 0 with no diff:

```sh
git diff --check 6ebe170..e685c3c
git diff --check 6ebe170..HEAD
git diff --exit-code e685c3c..HEAD -- poc-001-linked-formation
git diff --exit-code 6ebe170..e685c3c -- $(git ls-tree -r --name-only 6ebe170 poc-001-linked-formation/tests)
git diff --exit-code 6ebe170..e685c3c -- poc-001-linked-formation/src/core/{hex,formation,sectors,intents,damage,lifecycle,abilities,state,commands,smoke}.ts poc-001-linked-formation/src/content/{patrol,brood}.ts poc-001-linked-formation/src/view/{FormationLab,lab-state,projection}.ts poc-001-linked-formation/scripts poc-001-linked-formation/bin poc-001-linked-formation/{package.json,bun.lock,runtime.env,tsconfig.json,vite.config.ts,vitest.config.ts,index.html} justfile assets docs/plans docs/adr docs/prototypes docs/CURRENT.md docs/TASK_LOGS.md
```

Assignment SHA-256 before committing: `6202cb239f6ac2bdb10518941a557fe343c8bcf2dd7ec8d72e96f2e26546e9c3`. Only this reviewer report and the unchanged assignment are included in the review commit. No generated role/skill, plan or protected document edited. Fixes remain with the Implementer.

The first handoff validator invocation exited 2 with `DEPENDENCY_UNAVAILABLE`, before schema/revision validation. Ran `bun install --frozen-lockfile` in `.agents/skills/ruach-handoff` (exit 0, six ignored packages, no tracked skill changes), then reran the exact assigned validator command successfully. The report-creating commit SHA is returned in the terminal handoff.

## Re-review

**Verdict: approve. R1 and R2 resolved; no remaining material findings, optional findings or identified regressions in the fix diff.**

Re-review requested by the Coordinator in this session. Ran `git merge --ff-only p15-crucible` in the assigned worktree (exit 0), advancing `p15-review` from `6bd8d3c68f986ec145a89d14f6a9a2457a9e07aa` to the fix report commit `bdadfb23260e9e3a1777b7610d65012174c70ee7`. Reviewed the complete `6bd8d3c..4523be2ef4c6b317f3b09fb26b39d126b1673641` implementation diff, the affected surrounding code, and [fix.md](fix.md). Candidate `4523be2ef4c6b317f3b09fb26b39d126b1673641` and execution HEAD have identical prototype contents; the latter adds only fix assignment/report evidence. The explicit fast-forward instruction superseded the original assignment's no-merge restriction for this operation. No other merge or push performed.

### Finding disposition and regression inspection

**R1 resolved.** `src/core/transition.ts:17` now derives ability rules using only the Crucible's configured directional reduction. Live ability dispatch uses those rules; `src/core/run-record.ts:184` uses the same derivation for default record configuration. Preview uses the live dispatcher and replay uses serialized ability rules. Other P14 ability damage, Shelter/Close rules, explicit caller-supplied record overrides and the patrol branch remain unchanged.

Reran the original public-command reproducer with encounter reduction 1: frontal Ugallu Claw emits raw damage 4, reduction **1**, damage **3**, boss HP **60 → 57**. The new regression asserts actual damage/HP, preview state/events, exported configuration and replay using explicit test-local HP/reduction. Independent supplemental checks covered reductions 0, 1 and 8, six facings, both presets and Claw/Sting/Gale: **108** live/preview/replay cases passed, including saturated reduction, unguarded attacks and Gale bypass. **36** explicit record-rule override/replay cases passed. Patrol's default record ability configuration still equals `DEFAULT_ABILITY_RULES`.

The only changed existing P15 unit assertion setup chooses an unguarded Claw/Sting attacker for the threshold trace. This is justified: its explicit test reduction 8 now correctly absorbs a guarded Claw. The test retains declaration preservation, threshold entry, one phase event, retained HP/facing, next-B cadence and no-return assertions. All pre-P15 tests remain byte-for-byte unchanged.

**R2 resolved.** `tests/browser-crucible.mjs` now treats the ordinary product route as a two-round smoke/export check, derives visible phase and intentions from state/content, and accepts player/victory/defeat outcomes. It no longer requires the default strategy to win or show a fork before victory. Mandatory phase crossing, pulse/sector/fork telegraphs, both maneuver categories, Shelter, both Crosswind directions, facing relations and budget resets remain covered by intercepted test-owned states using explicit rules and sufficient living HP. Controlled threshold and immediate-kill cases remain. The controlled phase-crossing export replays through the CLI.

Both formerly failing tuning mutations now pass, alongside HP and damage changes. Browser coverage was moved to controlled inputs, not discarded. No changes to production boss content, the round skeleton, registry, view or patrol codec were necessary. The production fix is limited to ability dispatch and default record configuration.

### Bare recipes and browser/replay verification

All required recipes ran once from `/opt/dev/tehom-brainlab-p15r`, bare, with installed dependencies, no hand-set environment or Chrome overrides. The browser recipe began before the standalone build and built its own fresh production bundle. Docker/Chrome access used sandbox escalation; no automatic approval rejection occurred.

| Exact command | Exit | Result |
| --- | ---: | --- |
| `just poc-001-test` | 0 | 538 tests in 17 files; original patrol/P14 suites unchanged. |
| `just poc-001-typecheck` | 0 | TypeScript passed. |
| `just poc-001-test-browser` | 0 | 197 + 24 + 4572 + 192 = 4985 assertions, zero browser exceptions; `/tmp/p10-browser-uwkcGo`. No shutdown exit 130 observed. |
| `just poc-001-build` | 0 | Existing large-bundle warning only. |
| `just poc-001-preview` | 143 | Served the standalone harness successfully; exit from deliberate cleanup afterward. |
| `just poc-001-replay /tmp/p15-rereview-browser/phase-crossing.json` | 0 | 14 commands, 51 events, revision 14, round 5, player; boss phase 2. |
| `just poc-001-replay /tmp/p15-rereview-browser/product-attempt.json` | 0 | 9 commands, 33 events, revision 9, round 3, player. |

The bare runner selected `/home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell`, with reason **highest executable Playwright version (chromium_headless_shell-1223)**.

From `/opt/dev/tehom-brainlab-p15r/poc-001-linked-formation`:

```sh
bun tests/browser-crucible.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p15-rereview-browser http://localhost:4173/
```

Exit **0**, **474 assertions**, **11 screenshots**, zero uncaught exceptions; no retry needed. Product and diagnostic exports identify execution HEAD `bdadfb23260e9e3a1777b7610d65012174c70ee7`; the intercepted phase-crossing fixture records `buildRevision: unknown`, which is allowed by the record codec. Phase-crossing and product export CLI replays passed as above. The harness also replays every native export in-process.

Opened `crucible-start.png`, `phase-one-sector.png`, `phase-pending.png`, `phase-two-outer.png`, `phase-two-fork.png`, `patrol-start.png` and `placeholder-patrol.png` from this run. Pending versus active phase, non-turnable pulses, turnable sectors/fork, creature-following marks, links/controls and placeholder labels are readable. These are automated captures inspected by the Reviewer, not human playtest or balance evidence.

Stopped only the identified preview container mounted from this review worktree: `docker stop 74ab9b004c95f68dd543bff6e35e05b88e654eb39e6a9555e15b5cceea7b9f78` exited 0. Preview recipe exit 143 is recorded separately from test success.

### Four default-mutation probes rerun independently

Copied the revised prototype to `/tmp/p15-rereview-tuning/poc`, linked installed dependencies and sibling assets, and applied the same four mutations independently from its saved original content. `python3 /tmp/p15-rereview-probes.py` exited **0**. No production worktree files were mutated. From the scratch prototype, each case ran:

```sh
bun run --bun test:unit tests/crucible.test.ts
bun run --bun build
bun tests/browser-crucible.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p15-rereview-tuning/NAME-browser http://localhost:4176/
```

| NAME | Independent default mutation | Unit exit / tests | Build exit | Browser exit / assertions |
| --- | --- | --- | ---: | --- |
| hp | `bossHp: 60` → `bossHp: 72` | 0 / 21 | 0 | 0 / 474 |
| threshold | `phaseTwoAt: 30` → `phaseTwoAt: 5` | 0 / 21 | 0 | 0 / 474 |
| damage | First `primaryDamage: 5` → `primaryDamage: 6` (phase-one A) | 0 / 21 | 0 | 0 / 474 |
| pattern | Phase-two B `area: 'fork'` → `area: 'inner'` | 0 / 21 | 0 | 0 / 474 |

All four browser runs had zero uncaught exceptions. Structured results: `/tmp/p15-rereview-tuning/results.json`; logs: `/tmp/p15-rereview-tuning/NAME-{unit,build,browser}.log`. A task-owned `bun run --bun preview --port 4176` served the rebuilt scratch bundles; its cleanup exit was **143**. Restored scratch content afterward; `cmp /tmp/p15-rereview-tuning/original-crucible.ts /tmp/p15-rereview-tuning/poc/src/content/crucible.ts` exited 0.

### Supplemental checks, preservation and handoff

`bun /tmp/p15-rereview-extra.ts` exited **0**: corrected original self-guard output plus the original **6048** public-boundary immediate/forecast equivalence comparisons, including **504** next-announcement phase entries. This covers both phases, shapes, orientations, facings and beats, available abilities/targets/directions including Crosswind, maneuver choices and threshold-adjacent HP. Complete state/events and filtered forecast enemyEvents matched real committed results.

`bun /tmp/p15-rereview-guard.ts` exited **0**: the 108 mitigation/live/preview/replay and 36 explicit override cases described under R1; unchanged patrol record defaults. Supplemental scripts and their disposable evidence remain outside Git.

Preservation commands below all exited **0** with no diff:

```sh
git diff --check 6bd8d3c..4523be2
git diff --exit-code 4523be2..HEAD -- poc-001-linked-formation
git diff --exit-code 6ebe170..4523be2 -- $(git ls-tree -r --name-only 6ebe170 poc-001-linked-formation/tests)
git diff --exit-code 6ebe170..4523be2 -- poc-001-linked-formation/src/core/{hex,formation,sectors,intents,damage,lifecycle,abilities,state,commands,smoke}.ts poc-001-linked-formation/src/content/{patrol,brood}.ts poc-001-linked-formation/src/view/{FormationLab,lab-state,projection}.ts poc-001-linked-formation/scripts poc-001-linked-formation/bin poc-001-linked-formation/{package.json,bun.lock,runtime.env,tsconfig.json,vite.config.ts,vitest.config.ts,index.html} justfile assets docs/plans docs/adr docs/prototypes docs/CURRENT.md docs/TASK_LOGS.md
git diff --exit-code HEAD -- poc-001-linked-formation
```

The original assignment remains unchanged, SHA-256 `6202cb239f6ac2bdb10518941a557fe343c8bcf2dd7ec8d72e96f2e26546e9c3`. Only this report is edited for the re-review commit. Historical evidence above is retained; its prior blocking findings are superseded by this disposition. No production/test changes, canonical-document edits or new manual gameplay evidence. No remaining unverified area affecting R1/R2 acceptance; no conclusion about balance or the separately tracked intermittent runner shutdown issue.

Validation:

```sh
bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p15-crucible/reviewer.md --repo /opt/dev/tehom-brainlab-p15r
```

Exit **0**, `ok: true`, all current and historical revision fields resolved. The re-review report-creating SHA is returned in the terminal handoff.
