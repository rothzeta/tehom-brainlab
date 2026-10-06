task: P13-P14-integration
role: implementer
worker: p13-implementer
status: complete
outcome: "Specified Architect and P14 revisions merged in order with merge commits; combined verification, two bare non-PTY browser runs, native interleaving/replay and all six screenshot inspections complete."
destination: p13-maneuver-budgets
destination_before: 4e29315983e199e512fc8358e1f5dad3d0c26d8a
p13_source_revision: 4e29315983e199e512fc8358e1f5dad3d0c26d8a
architect_source_revision: 5c3e6146696bff0a02c214c14d480581291cebab
p14_source_revision: 3688256661f3dfd28d94e7a4f08453c1742789a1
architect_merge_revision: 6d310fbca7f486bd865e5a99d02b2a58c035604e
combined_revision: 7904f9f0e13572e103cb5eb0b363e5c9fc54902f
tested_revision: 7904f9f0e13572e103cb5eb0b363e5c9fc54902f
artifacts:
  - docs/mailbox/p13-maneuver-budgets/assignment-integration.md
  - docs/mailbox/p13-maneuver-budgets/integration.md
  - docs/mailbox/p13-maneuver-budgets/implementer.md
  - docs/mailbox/p14-kit-revision/implementer.md
  - /tmp/p10-browser-Yxtmhj
  - /tmp/p10-browser-C3rSRF
  - /tmp/p13-p14-integration-evidence
changed_paths:
  - docs/mailbox/boss-experiments/architect.md
  - docs/mailbox/p13-maneuver-budgets/assignment-integration.md
  - docs/mailbox/p13-maneuver-budgets/integration.md
  - docs/mailbox/p14-kit-revision/assignment-implementer.md
  - docs/mailbox/p14-kit-revision/implementer.md
  - docs/plans/2026-10-06-6dcd120b-poc-001-two-phase-central-boss.md
  - docs/plans/2026-10-06-79371edf-poc-001-roaming-boss-and-adds.md
  - docs/plans/README.md
  - docs/prototypes/poc-001-linked-formation.md
  - poc-001-linked-formation/README.md
  - poc-001-linked-formation/src/content/brood.ts
  - poc-001-linked-formation/src/core/abilities.ts
  - poc-001-linked-formation/src/core/damage.ts
  - poc-001-linked-formation/src/core/preview.ts
  - poc-001-linked-formation/src/view/CombatScene.ts
  - poc-001-linked-formation/tests/abilities.test.ts
  - poc-001-linked-formation/tests/browser-p14-kit.mjs
  - poc-001-linked-formation/tests/browser/p14-fixture.ts
  - poc-001-linked-formation/tests/browser/p14-fixtures.ts
  - poc-001-linked-formation/tests/p14-kit.test.ts
conflict_resolutions:
  - "README Shelter paragraph combines P14 no-stacking/identity precedence with P13 independent allowance preservation."
  - "README rules-version row combines P13 v3 semantic envelope with P14 p14-v1 kit and retains P13 compatibility explanation."
  - "rf-contracts.test.ts retains P13 R1 import order and owner-composed v3/PATROL_VERSION/BROOD_RULES_VERSION assertion, category flags, End phase and old-version rejection coverage."
  - "CombatScene.ts and abilities.test.ts merged automatically; inspected that both P13 allowance edits and P14 rule/UI/test edits remain present."
verification:
  - "just poc-001-test-browser run 2 (non-PTY): exit 0; four scripts, 4985 assertions, zero uncaught browser exceptions; output /tmp/p10-browser-C3rSRF. Exit 130 did not recur in either run; runner unchanged."
  - "just poc-001-test-browser run 1 (non-PTY): exit 0; four scripts, 4985 assertions, zero uncaught browser exceptions; output /tmp/p10-browser-Yxtmhj."
  - "just poc-001-test: exit 0; 16 files, 517 tests; 7460 assertions reported by instrumented suites."
  - "just poc-001-typecheck: exit 0."
  - "just poc-001-build: exit 0; existing large-bundle warning only."
  - "bun tests/browser-p14-kit.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p13-p14-integration-evidence/p14-kit http://localhost:4173/ (prototype cwd): exit 0; 51 assertions, three screenshots, zero uncaught browser exceptions."
  - "bun /tmp/p13-p14-integration-evidence/capture.mjs (repository cwd): exit 0; 90 supplemental native-input/interleaving assertions, zero browser exceptions; six-command export stamped with tested_revision."
  - "just poc-001-replay /tmp/p13-p14-integration-evidence/combined-attempt.json: exit 0; commands 6, events 20, revision 6, round 2, player."
  - "just poc-001-replay /tmp/p13-p14-integration-evidence/old-v2.json: expected exit 1; unsupported rules version poc-001-rules-v2/patrol-v2/p07-v1."
  - "just poc-001-replay /tmp/p13-p14-integration-evidence/old-p07.json: expected exit 1; unsupported rules version poc-001-rules-v3/patrol-v2/p07-v1."
  - "just poc-001-replay /tmp/p13-p14-integration-evidence/p14-kit/revised-kit.json: exit 0; commands 3, events 14, revision 3, round 2, player."
  - "just poc-001-replay /tmp/p13-p14-integration-evidence/p14-kit/old-p07.json: expected exit 1; unsupported rules version poc-001-rules-v3/patrol-v2/p07-v1."
  - "git diff --check 4e29315983e199e512fc8358e1f5dad3d0c26d8a..HEAD: exit 0."
  - "Protected/common source preservation and per-source owner checks listed below: exit 0; no source semantic change beyond the two supplied revisions."
  - "Opened and inspected all six screenshots named by P13 and P14 on the combined candidate."
  - "bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p13-maneuver-budgets/integration.md --repo /opt/dev/tehom-brainlab-p13: exit 0, ok true, all revision fields resolved, no diagnostics."
review: not-run
test_edits:
  - "Integration existing-test edit only: conflict resolution retaining the P13 R1 version composition; no new semantic test edit. P13 enumeration/RR1 and P14 K1-K4 remain combined."
discoveries:
  - "The assignment example Expand then Impale then Contract being legal contradicts P13's explicit one-shape-change contract. Integration preserves the supplied plans: Expand/Impale is legal; Contract after it rejects maneuver-used with unchanged state/events. No second shape allowance was added."
  - "P14 shutdown exit 130 was not reproduced: both full bare browser runs used non-PTY execution, passed all scripts and exited 0; no runner change made."
  - "Combined exported rules version is poc-001-rules-v3/patrol-v2/p14-v1, owner-composed in source/test."
blockers: []

# P13 + P14 integration handoff

Assignment: [assignment-integration.md](assignment-integration.md), unchanged. Source handoffs: [P13](implementer.md), [P14](../p14-kit-revision/implementer.md). Plans read before merging; generated role/skill policy followed. Destination is the assigned `p13-maneuver-budgets` branch only; no merge into master, rebase, squash or push.

## Integration outcome

Both local refs resolved to exactly their assigned SHAs. Created merge commits in the assigned order:

1. `6d310fbca7f486bd865e5a99d02b2a58c035604e`: parents P13 `4e29315983e199e512fc8358e1f5dad3d0c26d8a` and Architect `5c3e6146696bff0a02c214c14d480581291cebab`. Architect documentation imported unchanged; no runtime changes or conflicts.
2. `7904f9f0e13572e103cb5eb0b363e5c9fc54902f`: parents first merge `6d310fbca7f486bd865e5a99d02b2a58c035604e` and P14 `3688256661f3dfd28d94e7a4f08453c1742789a1`. This is the combined and tested implementation revision.

Only README and `tests/rf-contracts.test.ts` conflicted. README preserves both no-stacking and independent maneuver accounting, and documents `poc-001-rules-v3/patrol-v2/p14-v1`. The rules-version test keeps P13's v3 envelope, with the patrol and brood segments read from their owners. P13 budget tests/flags, R1 and RR1 remain intact. Automatically merged CombatScene and abilities tests retain both plans' local hunks. No test assertions were weakened or changed beyond combining the authorized changes.

The report/assignment commit is an evidence-only successor to the combined revision. Its SHA and the final branch revision are returned in the terminal handoff; no self-referential SHA is predicted here.

## Observable interaction, records and defaults

Temporary probe `/tmp/p13-p14-integration-evidence/capture.mjs` used native mouse inputs against the combined production preview. The accepted phase was **Clockwise → Ugallu self-Shelter → Expand → Girtablilu Impale on Censer → Pazuzu clockwise Crosswind on Warder → End phase**. The two maneuvers preserve actor action accounting; abilities preserve both category flags. Self-Shelter stays eligible after the link stretches. The immediate previews and conditional enemy forecasts agree with the public transition; state and ordered events in the downloaded attempt agree with replay. Each accepted input advances one revision. Both native exports embed the exact tested build SHA and `poc-001-rules-v3/patrol-v2/p14-v1`.

After Expand and Impale, Contract is a second shape change and rejects `maneuver-used`, matching P13's explicit contract. All four spent maneuver probes reject through the command/preview/native control boundaries and leave state/events unchanged; rejected inputs do not enter the recorded accepted stream. Round two restores both category flags and actor availability. This is the applicable interleaving correction to the assignment's inconsistent example; no contract/default change was made.

Supplemental probe passed 90 assertions with zero browser exceptions. Native combined export has six commands and 20 events; CLI replay reaches revision 6 / round 2 / player. The P14 check's self-Shelter export has three commands and 14 events and also replays successfully. Old core-v2 and old kit-p07 records are rejected with the exact supported error before replay. Export SHA-256s: combined `d61f51365e467fe42e46de0664a628153407dcbb83c284dd2543ffb497cce4ea`; P14 revised-kit `bac4c3e7f4f8c4363737df0d5e951c162ada92b856f8d125e48dda74661b1558`.

No provisional tuning was copied into new assertions. This integration adds no persistent test or source abstraction; the temporary probe compares public core outcomes, live content/default owners and native observations. Numeric outcomes below are observations, not frozen expectations. Interaction checks establish mechanics and record equivalence, not balance or enjoyment.

## Verification evidence

All final just recipes use the repository root and bare commands with the normal inherited environment. No Chrome, mode or port override was set. The standalone build is a separate required check; each browser recipe independently builds its own fresh production bundle and manages its preview. Extra P14/native scripts used that same combined preview on distinct CDP ports. Docker/browser access used sandbox escalation. No runner, wrapper, configuration or toolchain file changed.

`just poc-001-test` passed 16/16 files and 517/517 tests. P13 alone had 15/494 and P14 alone 15/500; common BASE had 14/477. Combined total is BASE + 17 P13 tests + 23 net P14 tests (26 new, three obsolete rejection parameters removed). Instrumented suites report P02 1361, P03 277, P05 810, P06 307, P07 1074, P08 504, RF 584 and P13 2543: 7460 reported assertions. This is not the full-suite assertion count; uninstrumented suites including RR1 and the P14 kit suite do not print assertion counts.

Typecheck passed. Production build passed with only the existing Vite bundle-size warning. P14's separate command in the YAML ran from `poc-001-linked-formation/`, passed 51 assertions and captured three screenshots. Old-record replay exit 1 is expected success for the compatibility checks.

## Screenshot inspection

All six images were opened with the image viewer from the combined candidate; files remain outside the repository. Readouts and controls are visible and consistent with both rulesets.

| Image | Inspected observation | SHA-256 |
| --- | --- | --- |
| `/tmp/p10-browser-Yxtmhj/lab/rotation-shape-available.png` | Lab Compact1: Rotation used, Shape change available; Expand enabled, rotations disabled. | `7491234484c2b3d8396e51b27bc91bda9c60c25780e414053bc9bb388bd8c14b` |
| `/tmp/p13-p14-integration-evidence/patrol-both-used.png` | Patrol round 1 Spread1 after rotation, self-Shelter and Expand: both categories used, every maneuver disabled with maneuver-used, self-Shelter eligible. | `e51c1de3231ddc4aac99adf570fbcd9c59f223020827f179ad5c24971922b083` |
| `/tmp/p13-p14-integration-evidence/patrol-round-two.png` | Round 2: both allowances available, rotations and Contract enabled; source facing changed by Crosswind and self-Shelter consumed. | `07ddd68cddf550bda296e08702de1f655997518eb5435b2657f777b5a9d8c8b2` |
| `/tmp/p13-p14-integration-evidence/p14-kit/self-shelter-spread.png` | Self-Shelter selected in Spread0; self/Confirm enabled, allies illegal-target, owner-derived rule amount, eligible immediate preview and enemy forecast. | `956bb7b08d06aeebca6c2f6c519976569448d37e4563bc4d83f6b4fb345f346f` |
| `/tmp/p13-p14-integration-evidence/p14-kit/protected-impale.png` | Protected Spread3 fixture: Impale and Confirm enabled, rule says protection applies; Censer 10 → 6, 4 damage with protection −2, matching forecast. | `1076e31b25b52856277c3dc034eda955cda7482f8d80955fef7f21b712997842` |
| `/tmp/p13-p14-integration-evidence/p14-kit/one-partner-impale.png` | Ugallu fallen, one living Stretched partner: Impale/Confirm enabled, one link visible, protected damage and forecast agree. | `ab5cefb9812e699514c8dd59e9edb53ff8ade06e00bd6837b321e6a83392af8f` |

The ordinary interleaved patrol ended with Ugallu 11/18, Girtablilu 11/14, Pazuzu 14/14, Censer 4/10 and Warder facing 1. These observations arise from the combined kit/maneuver choices; no enemy HP, damage or layout was retuned. P14's provisional stronger protection and P13's every-round independent maneuvers remain open usefulness/evasion questions for the manual round.

## Preservation checks

The following exact commands all exited 0 with no diff:

```sh
git diff --exit-code 4e29315983e199e512fc8358e1f5dad3d0c26d8a..HEAD -- poc-001-linked-formation/src/core/{state,transition,rounds,run-record}.ts poc-001-linked-formation/src/view/{FormationLab,lab-state}.ts
git diff --exit-code 3688256661f3dfd28d94e7a4f08453c1742789a1..HEAD -- poc-001-linked-formation/src/content/brood.ts poc-001-linked-formation/src/core/{abilities,damage,preview}.ts poc-001-linked-formation/tests/p14-kit.test.ts poc-001-linked-formation/tests/browser-p14-kit.mjs poc-001-linked-formation/tests/browser/p14-{fixture,fixtures}.ts
git diff --exit-code 5c3e6146696bff0a02c214c14d480581291cebab..HEAD -- docs/plans docs/adr docs/prototypes docs/CURRENT.md docs/TASK_LOGS.md
git diff --exit-code c596d692d6da0779213d10ff9acba7564ccad902..HEAD -- poc-001-linked-formation/src/core/{hex,formation,sectors,intents,lifecycle,commands,smoke}.ts poc-001-linked-formation/src/content/patrol.ts poc-001-linked-formation/src/view/{lab-state,patrol-session,projection}.ts poc-001-linked-formation/src/main.ts poc-001-linked-formation/scripts poc-001-linked-formation/bin poc-001-linked-formation/{package.json,bun.lock,runtime.env,tsconfig.json,vite.config.ts,vitest.config.ts} justfile assets bin scripts poc-001-linked-formation/tests/{formation,intents,patrol-session,rf-bugs,smoke,asset-copy}.test.ts poc-001-linked-formation/tests/browser-{preview,run-record}.mjs poc-001-linked-formation/tests/browser/{fixtures,outcome-fixture,patrol-fixture,rf-fixture}.ts
git diff --exit-code 4e29315983e199e512fc8358e1f5dad3d0c26d8a..HEAD -- docs/mailbox/p13-maneuver-budgets/assignment-implementer.md docs/mailbox/p13-maneuver-budgets/implementer.md
```

Architect plans/brief changes are imported from the specifically assigned source revision, never edited during integration. Both worker reports and assignments remain intact. The only new durable artifacts owned by this assignment are this report and the unchanged integration assignment.

## Two full browser recipe runs and shutdown observation

Both calls were exactly `just poc-001-test-browser` from the repository root with `tty: false` (the tool default), normal inherited environment, no browser/mode/port override, and sandbox escalation for Docker/Chrome access. Each built its own fresh production bundle and served the combined commit. The first run also hosted the extra P14/native capture scripts on distinct Chrome/CDP ports; the second ran the full recipe alone. Neither received a manual interrupt or extra process signal from this worker.

| Run | Output directory | Lab | Preview | Patrol | Records | Total assertions | Exceptions | Recipe exit |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1, non-PTY | `/tmp/p10-browser-Yxtmhj` | 197 | 24 | 4572 | 192 | 4985 | 0 | 0 |
| 2, non-PTY | `/tmp/p10-browser-C3rSRF` | 197 | 24 | 4572 | 192 | 4985 | 0 | 0 |

The runner selected `/home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell` both times, printing **highest executable Playwright version (chromium_headless_shell-1223)**. Browser version was `HeadlessChrome/148.0.7778.96`. Lab's two deliberate failed-image requests are expected fallback coverage; patrol reported zero failed requests. Both record suites' exported runs embed the combined SHA.

P14's earlier standalone non-PTY shutdown exit 130 did not recur here. The original cause remains unestablished; these are two successful observations under the assigned repeated-run conditions, not a runner fix. No runner/source changes or PTY workaround were used.

All required verification is complete at the combined SHA. No independent review or human playtest is claimed. The report/assignment commit only records evidence and leaves the tested prototype unchanged. Final validator command: `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p13-maneuver-budgets/integration.md --repo /opt/dev/tehom-brainlab-p13`; exit 0, `ok: true`, all source/merge/test revisions resolve with no diagnostics.
