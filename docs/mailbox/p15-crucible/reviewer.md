task: P15-review
role: reviewer
worker: p15-reviewer
status: complete
outcome: "Request changes: configured Crucible self-guard mitigation is ignored; additive browser assertions constrain provisional tuning."
baseline: 6ebe1703c94c2bdb404fd3bcdcfa212336a18b7c
reviewed_revision: e685c3cf24f1b997fcc2cd71cad76bdada4f95f0
tested_revision: e685c3cf24f1b997fcc2cd71cad76bdada4f95f0
execution_revision: 7537d0bddc5d5409b116a3ad4919bf02cb1e7a36
artifacts:
  - docs/mailbox/p15-crucible/assignment-reviewer.md
  - docs/mailbox/p15-crucible/reviewer.md
  - /tmp/p15-review-browser-isolated
  - /tmp/p10-browser-tnOx7y
  - /tmp/p15-review-tuning
blocking_findings:
  - "R1 (P2), poc-001-linked-formation/src/core/transition.ts:43: createCrucible with directionalReduction 1 still applies reduction 2 to frontal Claw. Required fix: honor the encounter self-guard rule consistently in live commands, previews and record configuration/replay, preserving patrol and P14 ability damage."
  - "R2 (P2), poc-001-linked-formation/tests/browser-crucible.mjs:164: changing only phaseTwoAt 30 to 5 causes a false failure when victory precedes the first phase-two fork. Required fix: use controlled test-owned rules/states for required traces and derive product-route expectations from content without requiring default fight pacing or the provisional beat table."
optional_findings: []
verification:
  - "just poc-001-test: sandbox attempt exit 1 (Docker unavailable); escalated pre-install attempt exit 127 (vitest missing); after just poc-001-install exit 0, bare rerun exit 0, 537/537 tests in 17 files."
  - "just poc-001-typecheck: exit 0."
  - "just poc-001-test-browser: exit 0, 4985 assertions across four suites, zero browser exceptions; no exit-130 shutdown in this run."
  - "just poc-001-build: exit 0, existing large-bundle warning."
  - "bun tests/browser-crucible.mjs CHROME /tmp/p15-review-browser http://localhost:4173/: exit 1 during navigation, after native exports; unchanged isolated rerun with output /tmp/p15-review-browser-isolated exit 0, 330 assertions and 11 screenshots. Exact Chrome path and commands below."
  - "just poc-001-replay on phase-crossing and diagnostic exports from each browser run: all four invocations exit 0; 26 commands/100 events/victory and 4 commands/15 events/player respectively. Nonempty healthy patrol export replay exit 0, 14 commands/71 events/victory."
  - "Four independent scratch default mutations: Crucible unit tests exit 0 (20/20 each), builds exit 0 each; browser HP and damage probes exit 0, threshold and pattern probes exit 1 at the noncontractual fork assertion."
  - "bun /tmp/p15-review-extra.ts: exit 0; reproduced R1 and passed 6048 immediate/forecast comparisons including 504 phase entries. bun /tmp/p15-review-trace.ts: exit 0; confirmed valid victory traces behind R2."
  - "Existing-test preservation, protected-path preservation, implementation equality between candidate and execution HEAD, and git diff --check: exit 0. Commands below."
  - "Inspected eleven required screenshot views across the two Crucible runs; phase status, turnability, telegraphs, encounter controls and placeholder labels readable."
  - "bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p15-crucible/reviewer.md --repo /opt/dev/tehom-brainlab-p15r: first exit 2 (missing validator dependencies); after frozen skill install exit 0, ok true."
review:
  - "Independent review complete; request changes for R1 and R2. No production code or tests modified."
discoveries:
  - "All existing tests and protected paths match the base. Bare browser discovery selected Playwright headless shell 1223."
  - "The first additive browser run encountered a navigation error; unchanged isolated rerun passed. Cause unconfirmed; no product regression inferred."
blockers:
  - "R1: encounter self-guard configuration contract is not met."
  - "R2: acceptance criterion 9 is not met by the additive browser harness."

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
