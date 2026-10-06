task: P13
role: implementer
worker: p13-implementer
status: blocked
outcome: "Partial independent-budget implementation committed; protected run-record test encodes the obsolete shared allowance and triggers the plan's mandatory stop."
baseline: c596d692d6da0779213d10ff9acba7564ccad902
candidate_revision: 9947558034e369716bf2c6bc8e2c72662e34bbda
tested_revision: 9947558034e369716bf2c6bc8e2c72662e34bbda
artifacts:
  - docs/mailbox/p13-maneuver-budgets/assignment-implementer.md
  - docs/mailbox/p13-maneuver-budgets/implementer.md
  - poc-001-linked-formation/tests/maneuver-budgets.test.ts
changed_paths:
  - poc-001-linked-formation/README.md
  - poc-001-linked-formation/src/core/state.ts
  - poc-001-linked-formation/src/core/transition.ts
  - poc-001-linked-formation/src/core/rounds.ts
  - poc-001-linked-formation/src/core/run-record.ts
  - poc-001-linked-formation/src/view/FormationLab.ts
  - poc-001-linked-formation/src/view/CombatScene.ts
  - poc-001-linked-formation/tests/commands.test.ts
  - poc-001-linked-formation/tests/abilities.test.ts
  - poc-001-linked-formation/tests/damage.test.ts
  - poc-001-linked-formation/tests/patrol.test.ts
  - poc-001-linked-formation/tests/preview.test.ts
  - poc-001-linked-formation/tests/view.test.ts
  - poc-001-linked-formation/tests/rf-contracts.test.ts
  - poc-001-linked-formation/tests/browser-lab.mjs
  - poc-001-linked-formation/tests/browser-patrol.mjs
  - poc-001-linked-formation/tests/maneuver-budgets.test.ts
verification:
  - "just poc-001-install: initial sandbox invocation exited 1 (Docker daemon inaccessible); same bare command with sandbox escalation exited 0, 43 packages installed."
  - "just poc-001-test at BASE: exit 0; 14 files and 477 tests passed; 4888 assertions reported by the seven instrumented suites."
  - "just poc-001-test before candidate commit: exit 1; 14 files passed, 1 failed; 493 tests passed, 1 failed. Mandatory stop invoked."
  - "just poc-001-test at tested_revision: exit 1; 14 files passed, 1 failed; 493 tests passed, 1 failed; same protected run-record assertion at line 75."
  - "git diff --check c596d692d6da0779213d10ff9acba7564ccad902..HEAD at tested_revision: exit 0."
  - "git diff --exit-code c596d692d6da0779213d10ff9acba7564ccad902..HEAD -- <protected paths and expected-unedited suites listed below>: exit 0."
  - "just poc-001-typecheck, just poc-001-build, just poc-001-test-browser and both just poc-001-replay checks: not run following the mandatory stop."
  - "Screenshot capture and inspection: not run following the mandatory stop; no Chrome selection, browser assertion counts or playable-patrol observation claimed."
  - "PATH=/tmp/p13-handoff-tools:$PATH bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p13-maneuver-budgets/implementer.md --repo /opt/dev/tehom-brainlab-p13: exit 0, ok true, no diagnostics."
review: not-run
test_edits:
  - "C1-C3: commands.test.ts category flags, same-category rejections plus accepted Expand, mechanical fixture/accounting changes; stale replay and serialized-input checks retained."
  - "A1, D1, P1, V1: mechanical flags with values implied by each test's own commands."
  - "W1: view.test.ts category assertions and independent second-command probes compared with applyCommand."
  - "R1: rf-contracts.test.ts composed rules version, category-specific check, explicit endPhase after both maneuvers, retained v1 and added v2 rejection."
  - "BL1-BL5: browser-lab.mjs both data flags, category-specific readouts and core-derived disabled count, rejected second rotation, accepted preview/commit Expand after rotation and rejected second shape change, drag flag preservation."
  - "BP1: browser-patrol.mjs rejected Contract after Expand and enabled Clockwise."
  - "New maneuver-budgets.test.ts: 17 tests, 2543 assertions over both orders/directions and 12 formations, previews, interleaved abilities, rejection precedence, reset/no banking, terminal budgets and serialized validation/replay."
discoveries:
  - "No additional maneuverUsed consumer outside the plan's mapped source/test files. lab-state.ts contains no allowance readout or stored allowance authority and needed no edit."
  - "Protected tests/run-record.test.ts:74-77 expects Expand after Clockwise to be rejected and the session record/state to remain equal to the first-command export. This conflicts with P13 acceptance criterion 1; it is omitted from the test-update exception."
  - "The plan names p13-split-maneuver-budgets as report destination; this report follows the assignment's explicit p13-maneuver-budgets destination."
blockers:
  - "Coordinator must authorize a bounded correction to the protected session-record test before implementation/verification continues. No protected test was edited, and no behavior workaround was introduced."

# P13 blocked implementer handoff

Assignment: [assignment-implementer.md](assignment-implementer.md). Contract: [P13 plan](../../plans/2026-10-06-e8cec63d-poc-001-split-maneuver-budgets.md), plan index and Architect report read. Branch `p13-maneuver-budgets`; no merge or push. The implementation commit above precedes this evidence-only report/unchanged-assignment commit; the latter SHA is returned in the terminal handoff.

## Implemented changes and limits

The old shared flag is replaced by serialized `rotationUsed` and `shapeChangeUsed`. A successful command checks/spends only its category, and actor accounting copies both input flags. Surviving End phase restores both; terminal settlement preserves them. Record validation requires both booleans, the core rules version is v3, and the envelope version remains 1. Lab and patrol readouts derive separate allowance text from core state; the lab exposes both data attributes. Prototype README allowance/version passages were updated locally. No geometry, content, numeric tuning, P14 source, protected document or expected-unedited suite changed.

This is a partial, unaccepted candidate. On the first implementation unit run the plan's explicit stop condition was hit. Work stopped, and the partial implementation was committed so the same failure could be recorded at an exact SHA. The unit suite was then rerun against that SHA solely for the blocked handoff. Typecheck, build, browser, screenshots and CLI replay were deferred; the views and new test TypeScript have not been typechecked, and browser changes have not executed.

## Blocker and bounded correction needed

`tests/run-record.test.ts`, test **session records only accepted confirmations; reset starts a clean attempt and stale input stays excluded**, first confirms Clockwise. Line 74 then activates Expand at the current revision. Line 75 asserts the exported record still equals the Clockwise-only record. P13 correctly accepts Expand, so that assertion fails. The subsequent line 77 replay/state equality would also compare the earlier record against the expanded session.

The plan declares this suite expected to pass unedited and the assignment forbids unenumerated existing-test edits. A bounded extension could replace the line-74 probe with a second rotation (`anticlockwise`), preserving the rejected-confirmation, stale-input and reset coverage, while the new P13 suite already verifies both categories export/replay together. This is a proposed correction for Coordinator authorization, not an edit made here. Do not resolve it by rejecting legal Expand in the session adapter.

## Verification evidence

All just invocations used the repository root and bare commands without environment overrides. Docker access needed sandbox escalation; there was no automatic approval rejection. BASE passed 14/14 files and 477/477 tests. Candidate passed 14/15 files and 493/494 tests; the only failure was the protected assertion described above. All 17 new budget tests passed, executing 2543 assertions. Existing instrumented suites reported P02 1361, P03 277, P05 810, P06 307, P07 1091, P08 504 and RF 584: 4934, up 46 from BASE's 4888. Including P13, 7477 assertions were reported. These are counts from instrumented suites, not the full-suite assertion total; the other suites do not report assertion counts. File count increased by one and test count by 17. No existing test was removed.

Exact preservation check (exit 0, no output) at the tested revision:

```sh
git diff --exit-code c596d692d6da0779213d10ff9acba7564ccad902..HEAD -- poc-001-linked-formation/src/core/{hex,formation,sectors,intents,damage,lifecycle,abilities,preview,commands,smoke}.ts poc-001-linked-formation/src/content poc-001-linked-formation/src/view/{patrol-session,projection}.ts poc-001-linked-formation/src/main.ts poc-001-linked-formation/scripts poc-001-linked-formation/bin poc-001-linked-formation/{package.json,bun.lock,vite.config.ts,vitest.config.ts} justfile assets docs/plans docs/adr docs/prototypes docs/CURRENT.md docs/TASK_LOGS.md poc-001-linked-formation/tests/{formation,intents,run-record,patrol-session,rf-bugs,smoke,asset-copy}.test.ts poc-001-linked-formation/tests/browser-{preview,run-record}.mjs poc-001-linked-formation/tests/browser
```

## Acceptance mapping

- AC1-3: new core tests pass over all labelled formations, both orders/directions, immutable inputs, independent spends/rejections, stale/same-shape rejection and one event/revision per success.
- AC4: controlled patrol inputs cover three real abilities before/between/after both maneuvers, all four input budget combinations on early End phase, stale replay of End phase and victory/defeat flag retention. Reset expectations read live factory flags; damage/HP are explicit test-local inputs.
- AC5: public preview/commit equivalence passes for both categories; updated view/browser behavior remains unverified.
- AC6: new record and R1 unit replay coverage passes, including explicit old-version rejection; exported playable attempt and CLI checks not run.
- AC7: mapped old flag removed from source, serialized state and README; no other mapped owner found.
- AC8: blocked by the expected-unedited run-record test; all other expected-unedited unit suites passed, browser suites not run.
- AC9: new tests use explicit numeric fixture inputs, controlled category commands and live factory reset flags; no copied provisional damage, HP, geometry threshold or refresh allowance count.
- AC10: README updated; no acceptance/review claimed.

No screenshots inspected. The requested visible observations (lab rotation with shape available, patrol both spent, round-two allowances restored) remain outstanding. The browser-lab probe includes a new `rotation-shape-available.png` capture for the first observation when resumed.

## Handoff validator setup

Host Bun was absent (`bun ...validate.ts ...` exited 127). Extracted the pinned Bun 1.4.2 executable from the existing prototype Docker image to `/tmp/p13-handoff-tools/bun`; no runtime or generated skill source changed. Installed the skill's frozen dependencies with `PATH=/tmp/p13-handoff-tools:$PATH bun install --frozen-lockfile` in `.agents/skills/ruach-handoff` (initial sandbox attempt hit EROFS; sandbox-escalated retry exited 0, six packages). The validator invocation recorded above then returned `ok: true`, resolving BASE and the candidate/tested SHA with no diagnostics. This PATH addition applies only to the handoff validator/setup, not any prototype recipe.
