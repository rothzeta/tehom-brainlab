task: P11-impl
status: complete
outcome: Reproducible local attempt export and safe deterministic replay verified; automated evidence delivered with boss gate HOLD
candidate_revision: 8decc8c80546f1437fbd6107215fc84b8b2cabb2
tested_revision: 8decc8c80546f1437fbd6107215fc84b8b2cabb2
preserved_test_baseline: 83153499d4289056f07cf3b0a234b664ad0aac91
artifacts:
  - docs/mailbox/p11-reproducible-playtests/implementer.md
  - docs/mailbox/p11-reproducible-playtests/assignment-implementer.md
  - docs/mailbox/p11-reproducible-playtests/browser-export-summary.json
  - docs/playtests/2026-10-05-poc-001-p11-automated.md
  - poc-001-linked-formation/src/core/run-record.ts
verification:
  - "Final candidate: full unit suite exit 0, 12 files / 460 tests, including 20 P11 tests."
  - "Final candidate: typecheck and build exit 0; all four browser scripts exit 0, 3302 assertions."
  - "Nine native UI exports replay through just poc-001-replay with exit 0."
  - "Five malformed/version/divergence probes exit 1 with specific reasons, as required."
  - "Whitespace, unedited BASE tests and protected-document checks exit 0."
review: not-run
discoveries:
  - "P08 stores patrol tuning in state; P07 ability tuning must be captured separately and supplied to its public reducer during replay."
  - "P10's existing fixed-area test factory remains supported; capture validation initially rejected it and was corrected before the final candidate."
blockers:
  - "Boss work remains on HOLD: no human playtest attempts recorded. Independent Reviewer confirmation or contest remains pending."

# P11 Implementer handoff

Executed the unchanged [assignment](assignment-implementer.md) on branch `p11-reproducible-playtests`, in `/opt/dev/tehom-brainlab-p11`, from BASE `8315349`. Technical candidate and tested revision: **`8decc8c80546f1437fbd6107215fc84b8b2cabb2`**. This report/evidence successor changes no technical files. No merge, push, rebase or worktree/branch deletion occurred. Independent review, acceptance and integration remain Coordinator work.

## Implementation and defaults

`src/core/run-record.ts` owns versioned, detached JSON snapshots: prototype/build/rules/fixture identity, complete numeric patrol and ability configuration, initial core state, accepted player commands with expected/resulting revisions and step events, and final state/ordered events. Strict validation rejects unsupported versions, extra fields, malformed states/rules and malformed player commands. Replay uses public `applyAbility` with the record's stored tuning and `applyCommand` for maneuvers/endPhase. This preserves the same real transitions while allowing numeric defaults to evolve. First divergence identifies the command's revision/events, or the final state/event order. Object key ordering is immaterial; array/event ordering is preserved.

P10's existing accepted-command boundary is the sole capture point. Selection, hover/focus previews, unavailable inputs, stale confirmations and feedback-lock duplicates never enter its record. Export is a local JSON download; reset/preset changes create a clean record. Build metadata comes from the clean prototype's Git HEAD via its existing wrapper; dirty/untracked prototype files or unavailable Git yield the explicit `unknown` value. Static preview retains the revision embedded during build.

The replay script reads only the named input; record data never names executable modules, code, filesystem destinations or network requests. The Docker recipe mounts the named record read-only and disables networking. No dependency, telemetry, backend, import UI, migration or timeline was added. Existing core/content and preview behavior are unchanged.

Every P11-owned default is resolved with value, source and reason in the [P11 README section](../../../poc-001-linked-formation/README.md#reproducible-attempts-p11): record v1; prototype ID; rules envelope `poc-001-rules-v1/patrol-v1/p07-v1`; SHA/unknown build convention; three P08 fixture IDs; full patrol/ability numeric snapshots; accepted command/revision/step-event stream and initial/final summaries; player command kinds only; filename `poc-001-attempt.json`; separate observations without identities/timestamps; HOLD evidence default. Existing P02/P06/P07/P08 numeric defaults remain with their original owners. A semantic rule change requires a version bump; numeric tuning is serialized.

## Acceptance evidence

1. **Criteria 1 / P11.C1–C2:** the two explicit test-owned P08 win/forfeit traces export/replay identical state and event order. All three real factory starts and alternate stored ability/patrol tuning are covered without exact expectations about provisional defaults. Six native browser attempts across all starts replay identically, with their actual initial/final snapshots and event ordering retained.
2. **Criterion 2 / P11.C1:** unit tests exercise selection isolation, stale rejection, feedback locking and reset. Native browser downloads separately prove selection-only exports contain zero commands/events, successful clockwise plus busy/used-maneuver attempts contains exactly one accepted command, and reset contains none of the preceding attempt's commands/events.
3. **Criterion 3 / P11.C2:** schema/version checks and real CLI probes return specific errors. Rejected commands cannot be appended; a forged stale accepted entry fails as `command 1 rejected: stale-revision`. Step revision/event and final state/event tampering have focused divergence tests. Parsed record data is never executed or used for IO.
4. **Criteria 4–6 / P11.C3–C4 within the assignment's human boundary:** [the review artifact](../../playtests/2026-10-05-poc-001-p11-automated.md) identifies exact build, versions, all starting conditions/configuration and six **automated** attempts. Observations, tester explanations and interpretation are separate. No human playtest occurred; explanations/retry choices are explicitly not obtained. No final run is defect-blocked. Gate **HOLD**, attributed to **P11 Implementer, automated session**, with independent Reviewer confirmation/contest pending. No human attempt or quote is simulated.
5. **Criterion 7:** the artifact and README explicitly state that no fair Apex/Shadow comparison or production-combat selection has been completed.

The next bounded evidence revision is one real human attempt for each preset, saving exports and actual explanations, followed by independent gate review. This delivery does not authorize P12.

## Final-candidate verification

All commands below ran from `/opt/dev/tehom-brainlab-p11` with technical HEAD `8decc8c80546f1437fbd6107215fc84b8b2cabb2`. Docker application checks used the pinned Bun 1.4.2 wrapper; only the established host Bun/Chrome CDP driver and handoff validator run as tooling. Native browser checks used HeadlessChrome 148.0.7778.96, 1280×800, scale 1. Required checks were executed; none remain unrun.

| Exact command | Exit / result |
| --- | --- |
| `just poc-001-test` | 0; **12 files / 460 tests**, including **20 P11**. |
| `just poc-001-typecheck` | 0; strict source/test TypeScript. |
| `just poc-001-build` | 0; 27 modules; build embeds the candidate SHA. Existing large-bundle advisory only. |
| `PATH=/home/metatron/.bun/bin:$PATH just poc-001-test-browser /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p11-browser-8decc8c` | 0; **4 scripts / 3302 assertions**: lab 177, preview 24, patrol 2909, record 192. P10 12 traces / 132 attempts (108 accepted, 24 unavailable); P11 six traces / 56 accepted commands plus native selection/rejection/reset scenarios. Zero uncaught exceptions. Lab's two deliberately failed image requests are its existing fallback checks; P10 has zero failed requests. Wrapper starts/stops Docker preview. |
| `git diff --check` | 0. |
| `git diff --exit-code 8315349..HEAD -- $(git ls-tree -r --name-only 8315349 -- poc-001-linked-formation/tests)` | 0; every BASE test, including all existing browser scripts, unchanged. |
| `git diff --exit-code 8315349..HEAD -- .agents docs/CURRENT.md docs/TASK_LOGS.md docs/adr docs/plans docs/prototypes docs/playtests/TEMPLATE.md` | 0; protected/generated sources untouched. |
| `sh -n poc-001-linked-formation/scripts/run.sh poc-001-linked-formation/scripts/toolchain.sh` | 0; wrapper shell syntax. |

Executed `just poc-001-replay docs/mailbox/p11-reproducible-playtests/<file>` for **each** filename below, using the default Docker mode. The nine success commands ran sequentially in a `set -e` loop; loop exit **0**. Each command's exit is therefore **0**. All nine records were actual native UI downloads; retention removes JSON indentation only. [Download hashes, retained hashes, byte counts and automated run attribution](browser-export-summary.json) preserve their provenance. Together retained exports are 121,888 bytes. Probe files are deliberate mutations of the downloaded empty-reset record, not player inputs.

| Exact `<file>` argument | Commands / events | Final revision / round / phase | Exit |
| --- | --- | --- | --- |
| `browser-healthy-attack.json` | 14 / 71 | 14 / 4 / victory | 0 |
| `browser-healthy-forfeit.json` | 4 / 53 | 4 / 4 / defeat | 0 |
| `browser-wounded-ugallu-attack.json` | 14 / 77 | 14 / 5 / defeat | 0 |
| `browser-wounded-ugallu-forfeit.json` | 4 / 49 | 4 / 4 / defeat | 0 |
| `browser-wounded-girtablilu-attack.json` | 16 / 85 | 16 / 6 / victory | 0 |
| `browser-wounded-girtablilu-forfeit.json` | 4 / 49 | 4 / 4 / defeat | 0 |
| `browser-selection-only.json` | 0 / 0 | 0 / 1 / player | 0 |
| `browser-rejected-input.json` | 1 / 1 | 1 / 1 / player | 0 |
| `browser-reset-after-rejection.json` | 0 / 0 | 0 / 1 / player | 0 |

The following individually executed recipe calls exit **1**, as expected; each printed its useful specific failure before just propagated the exit:

| Exact command | Failure |
| --- | --- |
| `just poc-001-replay docs/mailbox/p11-reproducible-playtests/malformed-command.json` | `Run record: malformed acceptedCommands[0].command.expectedRevision` |
| `just poc-001-replay docs/mailbox/p11-reproducible-playtests/unsupported-record.json` | `Run record: unsupported record version: 99` |
| `just poc-001-replay docs/mailbox/p11-reproducible-playtests/unsupported-rules.json` | `Run record: unsupported rules version: future` |
| `just poc-001-replay docs/mailbox/p11-reproducible-playtests/unsupported-object-version.json` | `Run record: unsupported record version: {"toString":"supplied data"}` |
| `just poc-001-replay docs/mailbox/p11-reproducible-playtests/divergent-final.json` | `Run record: final state divergence` |

These checks verify errors and replay only; they are **not human playtests**. No fair comparison or production selection was run.

## Earlier checks and corrections

`just poc-001-install` passed (frozen lockfile, 43 packages). During development, the first `just poc-001-typecheck` failed on a generic result-state type; accepted state validation/narrowing fixed it. The first browser aggregate without the Bun PATH failed at the toolchain check; using the installed pinned Bun resolved it. The precommit aggregate at `/tmp/p11-browser-precommit` failed on the fixed-area capture validation regression. Fixed-area support now has a P11 regression test, and the unchanged P10 script passes.

The first committed aggregate at `/tmp/p11-browser-final` passed all three old scripts but timed out in the new driver's mistaken `?mode=patrol` route. Corrected to the actual `?play=patrol`, including the README. Isolated native export checks passed at `/tmp/p11-export-isolated` (166 assertions) and `/tmp/p11-export-rejection` (192 assertions). The predecessor committed candidate `64ab961` passed its full four-script aggregate; the final `8decc8c` repeats all required checks after making object-valued unsupported versions explicitly diagnosable. Disposable diagnostics stayed under `/tmp`; final durable evidence refers only to `8decc8c`.

## Changed files and handoff boundaries

Technical changes: root `justfile` adds only the thin replay recipe; prototype `scripts/run.sh`, `toolchain.sh`, `browser-checks.mjs` wire replay/build metadata/new browser check; new `scripts/replay-run.ts`; new `src/core/run-record.ts`; P10 `src/view/patrol-session.ts` and `CombatScene.ts`; new `tests/run-record.test.ts` and `browser-run-record.mjs`; only the prototype README's new P11 section. The wrappers are necessary to satisfy the assigned recipe/toolchain contract. Existing tests, dependencies, lockfile, core/content modules and unrelated README sections are untouched.

Evidence changes: this report, the unchanged assignment, nine browser-export records, five intentionally bad probe records, browser export summary/provenance, one new playtest artifact based on the unchanged template, and playtests README navigation. Assignment SHA-256: `464a110bd1aef964f182ae32bda4ae5eece86602980b2634b0709d8bdb3c833b`.

No implementation blocker remains. Human evidence remains absent and the boss gate remains **HOLD**. Proposed Coordinator-only follow-up after independent acceptance: update P11 plan/index/CURRENT/TASK_LOGS to distinguish implemented capture/replay from the unperformed human attempts and to retain the HOLD gate. No protected documents were edited.

## Handoff validation

Copied the unchanged generated skill to disposable `/tmp/p11-handoff-validator` rather than modifying its source. Bootstrap commands: `cp -R .agents/skills/ruach-handoff /tmp/p11-handoff-validator` and `/home/metatron/.bun/bin/bun install --frozen-lockfile --cwd /tmp/p11-handoff-validator` (both exit 0; 6 validator dependencies installed). This is handoff tooling, not host-mode application verification.

Executed `/home/metatron/.bun/bin/bun /tmp/p11-handoff-validator/scripts/validate.ts docs/mailbox/p11-reproducible-playtests/implementer.md --repo /opt/dev/tehom-brainlab-p11`: **exit 0, `ok: true`, zero diagnostics**; all three revision fields resolve. The final validation output is retained in [handoff-validation.json](handoff-validation.json).
