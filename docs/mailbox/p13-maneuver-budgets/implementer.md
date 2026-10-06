task: P13
role: implementer
worker: p13-implementer
status: complete
outcome: "Independent rotation and shape-change budgets implemented and verified, including authorized RR1 record-path correction, native export/replay and screenshot inspection."
baseline: c596d692d6da0779213d10ff9acba7564ccad902
candidate_revision: 5e391537f14baaf90acd6d987551a7e91270b4d7
tested_revision: 5e391537f14baaf90acd6d987551a7e91270b4d7
previous_tested_revision: 9947558034e369716bf2c6bc8e2c72662e34bbda
artifacts:
  - docs/mailbox/p13-maneuver-budgets/assignment-implementer.md
  - docs/mailbox/p13-maneuver-budgets/implementer.md
  - poc-001-linked-formation/tests/maneuver-budgets.test.ts
  - /tmp/p10-browser-5vTxkW
  - /tmp/p13-final-evidence/p13-attempt.json
  - /tmp/p13-final-evidence/p13-v2.json
  - /tmp/p13-final-evidence/observations.json
changed_paths:
  - docs/mailbox/p13-maneuver-budgets/assignment-implementer.md
  - docs/mailbox/p13-maneuver-budgets/implementer.md
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
  - poc-001-linked-formation/tests/run-record.test.ts
  - poc-001-linked-formation/tests/browser-lab.mjs
  - poc-001-linked-formation/tests/browser-patrol.mjs
  - poc-001-linked-formation/tests/maneuver-budgets.test.ts
verification:
  - "just poc-001-test at tested_revision: exit 0, 15 files and 494 tests passed; 7477 assertions reported by instrumented suites. BASE had 14 files, 477 tests and 4888 reported assertions."
  - "just poc-001-typecheck at tested_revision: exit 0."
  - "just poc-001-build at tested_revision: exit 0; existing large-bundle warning only."
  - "just poc-001-test-browser at tested_revision: exit 0; own fresh Docker build; four scripts, 4985 assertions, zero uncaught browser exceptions."
  - "bun /tmp/p13-final-evidence/capture.mjs against tested_revision preview: exit 0; 32 supplemental assertions, zero browser exceptions; native exported attempt and patrol screenshots."
  - "just poc-001-replay /tmp/p13-final-evidence/p13-attempt.json: exit 0; commands 3, events 12, revision 3, round 2, phase player."
  - "just poc-001-replay /tmp/p13-final-evidence/p13-v2.json: expected exit 1; unsupported rules version: poc-001-rules-v2/patrol-v2/p07-v1."
  - "git diff --check c596d692d6da0779213d10ff9acba7564ccad902..HEAD at tested_revision: exit 0."
  - "git diff --exit-code c596d692d6da0779213d10ff9acba7564ccad902..HEAD -- <protected paths and expected-unedited suites listed below>: exit 0. RR1 is excluded from this preservation check by Coordinator authorization."
  - "Old flag search over src and README: no maneuverUsed matches; worktree clean before final report update."
  - "Opened and inspected the lab rotation/shape-available, patrol both-used and patrol round-two screenshots listed below."
  - "bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p13-maneuver-budgets/implementer.md --repo /opt/dev/tehom-brainlab-p13: exit 0, ok true, no diagnostics; all revision fields resolved."
review: not-run
test_edits:
  - "C1-C3: commands.test.ts category flags, same-category rejections plus accepted Expand, mechanical fixture/accounting changes; stale replay and serialized-input checks retained."
  - "A1, D1, P1, V1: mechanical flags with values implied by each test's own commands."
  - "W1: view.test.ts category assertions and independent second-command probes compared with applyCommand."
  - "R1: rf-contracts.test.ts composed rules version, category-specific check, explicit endPhase after both maneuvers, retained v1 and added v2 rejection."
  - "BL1-BL5: browser-lab.mjs both data flags, category-specific readouts and core-derived disabled count, rejected second rotation, accepted preview/commit Expand after rotation and rejected second shape change, drag flag preservation."
  - "BP1: browser-patrol.mjs rejected Contract after Expand and enabled Clockwise."
  - "New maneuver-budgets.test.ts: 17 tests, 2543 assertions over both orders/directions and 12 formations, previews, interleaved abilities, rejection precedence, reset/no banking, terminal budgets and serialized validation/replay."
  - "RR1 (extra Coordinator authorization, 2026-10-06): run-record.test.ts mixed-category accepted stream, replayed state/events and same-category maneuver-used rejection; initial allowance read from captured factory state, no copied allowance count."
discoveries:
  - "Original protected run-record test assumed Expand after Clockwise was rejected; Coordinator explicitly authorized RR1 to assert mixed-category acceptance and same-category rejection. Blocker resolved without a session-layer workaround."
  - "No additional maneuverUsed consumer outside the plan's mapped source/test files. lab-state.ts stores no separate allowance and needed no edit."
  - "Coordinator documentation correction proposed: add RR1 to the plan's exception and remove run-record.test.ts from its expected-unedited list. No protected document was changed here."
  - "The plan names p13-split-maneuver-budgets as report destination; this report follows the assignment's explicit p13-maneuver-budgets destination."
  - "Host Bun was absent; pinned Bun 1.4.2 installed on the existing host PATH so all prototype recipes, including browser verification, ran bare without overrides."
blockers: []

# P13 completed implementer handoff

Assignment: [assignment-implementer.md](assignment-implementer.md). Contract: [P13 plan](../../plans/2026-10-06-e8cec63d-poc-001-split-maneuver-budgets.md), plan index and Architect report read. Branch `p13-maneuver-budgets`; no merge or push. The tested implementation is `5e391537f14baaf90acd6d987551a7e91270b4d7`. This report update is an evidence-only successor; its creating SHA is returned in the terminal handoff. The assignment remains unchanged in Git.

## Changes

Serialized `rotationUsed` and `shapeChangeUsed` replace the shared allowance. Rotation and shape change check and spend only their own flag, retaining `stale-revision`, `wrong-phase`, spent-category `maneuver-used`, then `same-shape` precedence. Each success publishes one revision and one existing maneuver event. Abilities preserve both input flags. A surviving End phase restores both; terminal settlement preserves them. Record validation requires both booleans, the core rules version is v3 and envelope version remains 1. Old records are rejected before replay rather than migrated.

Lab and patrol readouts derive each allowance from live core state. The lab exposes `data-rotation-used` and `data-shape-change-used`; controls use real command outcomes. Prototype README allowance/version passages were updated locally. No geometry, content, numeric tuning, P14 source, protected document or test outside the plan exception plus RR1 changed. No separate lab-state allowance or UI accounting was added.

## RR1 authorization and prior failure

The original candidate `9947558` passed 493 tests and failed the protected `tests/run-record.test.ts:75` assertion: Clockwise followed by Expand was expected to leave the record unchanged. Work stopped as required and the blocked handoff was committed at `a47aa0d`. The original report remains in that revision.

Coordinator authorization received 2026-10-06 explicitly permitted editing that test around line 75 to assert both categories accepted in one phase and a second use of the same category rejected with `maneuver-used`; no other unlisted test edits were authorized. RR1 now retains preview/stale-input exclusion and clean reset coverage, confirms Clockwise then Expand, compares the live state with the public core outcome, replays the exported state and ordered events, and exercises rejection through the same session/record path for both directions and both shape commands. Fresh shape allowance comes from the captured factory initial state, with no numeric allowance count copied into assertions. Rejected probes preserve the accepted record, live state and last events.

The first resumed typecheck exposed inference errors in the new P13 matrix test. Explicit `Maneuver` arrays and `GameState` annotations corrected those errors without changing assertions. The final candidate passes typecheck. An indentation correction stayed on an existing A1-edited assertion.

## Verification

Every final prototype recipe ran from the repository root as the bare command shown, with no `POC001_CHROME`, `CHROME_PATH`, mode/port overrides or manual prerequisite build supplied to the browser runner. Docker access used sandbox escalation. The standalone build was a separate required check; the browser recipe independently built its own fresh production bundle and managed its preview. All final checks below tested the same candidate SHA. The only warning was Vite's existing bundle-size warning.

| Command | Result |
| --- | --- |
| `just poc-001-test` | Exit 0; 15/15 files, 494/494 tests |
| `just poc-001-typecheck` | Exit 0 |
| `just poc-001-build` | Exit 0 |
| `just poc-001-test-browser` | Exit 0; four scripts, 4985 assertions, zero uncaught exceptions |
| `just poc-001-replay /tmp/p13-final-evidence/p13-attempt.json` | Exit 0; `{"ok":true,"commands":3,"events":12,"revision":3,"round":2,"phase":"player"}` |
| `just poc-001-replay /tmp/p13-final-evidence/p13-v2.json` | Expected exit 1; `Run record: unsupported rules version: poc-001-rules-v2/patrol-v2/p07-v1` |
| `git diff --check c596d692d6da0779213d10ff9acba7564ccad902..HEAD` | Exit 0 |

BASE ran 14/14 files and 477/477 tests successfully. Candidate adds one file and 17 tests. Existing instrumented suites report P02 1361, P03 277, P05 810, P06 307, P07 1091, P08 504 and RF 584: 4934, up 46 from BASE's 4888. P13 adds 2543, yielding 7477 reported assertions. These are instrumented-suite counts, not the full-suite assertion total; the remaining suites, including RR1, do not report assertion counts. No existing test was removed.

Browser output is `/tmp/p10-browser-5vTxkW`. Selected binary: `/home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell`; reason printed by the runner: **highest executable Playwright version (chromium_headless_shell-1223)**. Reported version: `HeadlessChrome/148.0.7778.96`.

| Browser script | Assertions | Uncaught exceptions | Notes |
| --- | ---: | ---: | --- |
| `tests/browser-lab.mjs` | 197 | 0 | Twelve formations; normal, placeholder and failed-image modes; 20 screenshots; two deliberately failed image requests |
| `tests/browser-preview.mjs` | 24 | 0 | Unedited; two screenshots |
| `tests/browser-patrol.mjs` | 4572 | 0 | Twelve traces, 132 commands, 11 screenshots; zero failed network requests |
| `tests/browser-run-record.mjs` | 192 | 0 | Unedited; native exports across six preset/strategy runs |

The separate temporary command `bun /tmp/p13-final-evidence/capture.mjs` ran against that same preview/build while the browser runner owned the server. It exercised native pointer controls/downloads, passed 32 supplemental assertions and recorded zero browser exceptions. The native export embeds the exact tested build SHA and captures Clockwise, Expand, then early End phase. Replay validates final state and ordered events. The v2 rejection fixture uses the legacy rules version and legacy single state flag; it is intentionally rejected before command replay.

Exact preservation check, exit 0/no output (RR1 omitted by authorization):

```sh
git diff --exit-code c596d692d6da0779213d10ff9acba7564ccad902..HEAD -- poc-001-linked-formation/src/core/{hex,formation,sectors,intents,damage,lifecycle,abilities,preview,commands,smoke}.ts poc-001-linked-formation/src/content poc-001-linked-formation/src/view/{patrol-session,projection}.ts poc-001-linked-formation/src/main.ts poc-001-linked-formation/scripts poc-001-linked-formation/bin poc-001-linked-formation/{package.json,bun.lock,vite.config.ts,vitest.config.ts} justfile assets docs/plans docs/adr docs/prototypes docs/CURRENT.md docs/TASK_LOGS.md poc-001-linked-formation/tests/{formation,intents,patrol-session,rf-bugs,smoke,asset-copy}.test.ts poc-001-linked-formation/tests/browser-{preview,run-record}.mjs poc-001-linked-formation/tests/browser
```

## Screenshot inspection and visible allowances

Opened all three images with the image viewer; images and disposable capture code remain outside the repository.

- `/tmp/p10-browser-5vTxkW/lab/rotation-shape-available.png` (1280×800): Compact orientation 1, revision 1, round 1. Both rotation buttons disabled; Expand enabled. The readable allowance says **Rotation: used. Shape change: available.** Labelled Brood and Close links are visible.
- `/tmp/p13-final-evidence/patrol-both-used.png` (1280×1050): healthy patrol at Player / Round 1 / Spread 1, after Clockwise then Expand. All four maneuver controls visibly say `maneuver-used`, with **Rotation: used. Shape change: used.** All three actor actions remain available. Native attempts on a second rotation and Contract leave revision, HP, flags/allowance and events unchanged.
- `/tmp/p13-final-evidence/patrol-round-two.png` (1280×1050): after early End phase, Player / Round 2 / Spread 1. Both rotations and Contract are enabled, and **Rotation: available. Shape change: available.** Expand is disabled only because of `same-shape`. Actor actions are restored and enemy damage is visible.

SHA-256 evidence identifiers:

| Artifact | SHA-256 |
| --- | --- |
| Lab screenshot | `c52b8934a1d7214d48d779418eda63f1c0f4aefd9ac940d5829909114b70c76f` |
| Patrol both-used screenshot | `de7fb1ce69f361a2d9b911f7ec4b8eb161a2cb7cad6305aaf93b10de86e99af6` |
| Patrol round-two screenshot | `ce2452e01c1b3568d4b75435fefbe95753c04192d11471284f7d26ad4534fabd` |
| Native attempt `/tmp/p13-final-evidence/p13-attempt.json` | `bfaaef1f8913c2fd8b4f19218b0df6ee8861520c679f2bfe89b72e8a923fb638` |
| Old record `/tmp/p13-final-evidence/p13-v2.json` | `5fb20299078137da9f6e99f1f6903690c8ef85125a447cf9fcc777be6e16e033` |

## Acceptance mapping

- AC1–3: new core tests pass over all twelve labelled formations, both orders/directions, immutable inputs, independent spending/rejections, stale/same-shape rejection and one event/revision per success.
- AC4: controlled patrol tests exercise three real abilities before/between/after both maneuvers, every input flag combination on early End phase, stale End phase replay, no banking and victory/defeat flag retention. Reset expectations read live factory flags; damage/HP are explicit test-local inputs. Native round-two observation confirms refresh.
- AC5: preview/commit equivalence passes for both categories; view and browser suites pass, with separate live readouts inspected visually.
- AC6: native export using both categories in one phase replays successfully through the CLI; old v2 records exit 1 with the exact required error. RR1 protects the same session/export boundary.
- AC7: no `maneuverUsed` remains in source, serialized current state or README. A temporary old-format rejection fixture retains the historical flag deliberately.
- AC8: all expected-unedited suites pass unchanged except run-record.test.ts, whose RR1 change was explicitly authorized. No additional test edits were made.
- AC9: new tests use explicit numeric fixture inputs, controlled category commands and live factory reset flags; no copied provisional damage, HP, geometry threshold or allowance count.
- AC10: README describes both allowances, category-specific `maneuver-used`, refresh, v3 rules and explicit old-record rejection.

No required implementation or verification remains. Independent review and manual human playtesting are not claimed. Every-round refresh remains the provisional user decision; whether it makes evasion too easy remains a manual-round finding rather than a rule change here.

## Tooling and handoff validation

The initial frozen prototype install passed after sandbox escalation (43 packages). Host Bun was absent; the pinned Bun 1.4.2 executable was extracted from the already installed prototype Docker image into `/tmp/p13-handoff-tools/bun`. The handoff skill's frozen dependencies were installed in its ignored `node_modules` (six packages; initial sandbox attempt hit EROFS, escalated retry passed). During resumed work, `install -m 755 /tmp/p13-handoff-tools/bun /home/metatron/.local/bin/bun` installed that same pinned executable on the existing host PATH so the browser recipe and validator ran bare. No repository toolchain, generated skill source or environment override was changed. There was no automatic approval rejection.

Final report validation: `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p13-maneuver-budgets/implementer.md --repo /opt/dev/tehom-brainlab-p13` returned exit 0 and `ok: true` with no diagnostics, resolving BASE, current candidate/tested revision and prior tested revision.
