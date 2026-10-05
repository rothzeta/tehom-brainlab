# Assignment P10-review — playable patrol (Reviewer)

Role: `reviewer` (follow `.agents/agents/reviewer.md`).
Coordinator: Claude Coordinator session in the main checkout.

## Change under review

- Workspace `/opt/dev/tehom-brainlab-p10`, branch `p10-playable-patrol`. Local `master` is `767f46c`, which is also the branch BASE, so the branch is the combined candidate.
- Range `767f46c..353dac7e134972e6e69b02914af10cbf1f2d34bb`. Commit `ca051f7` adds only the Implementer report, its assignment and browser evidence.
- Handoff: `docs/mailbox/p10-playable-patrol/implementer.md`.

## Acceptance conditions to judge

1. All eight acceptance criteria and the required contracts of the [P10 plan](../../plans/2026-10-02-e7c77542-poc-001-playable-patrol.md), including Amendment TR, are met through the real browser interface. Browser assertions must not freeze provisional defaults (ADR-0006). Probe this as earlier reviews did.
2. P03/P08 remain the only command path, and P09 projections and `confirmPreview` are reused. The UI handlers contain no rules or alternate calculations. Invalid, double or stale input cannot spend extra resources or repeat an effect. Reset during presentation leaves no stale callbacks.
3. **Criterion 8 and the test-only surface.** The Implementer added an "isolated test-owned page" to verify fixed-area versus following-mark rendering. Confirm it is not reachable from the playable UI and does not expose movement, teleport or unplanned abilities. Confirm it does not ship a debug path that a player could use, or justify why its exposure is acceptable within the plan. Treat the existing `?preview=patrol` fixture the same way.
4. Browser play of the recorded winning and losing traces matches the headless P08 final HP and outcome.
5. The P04 lab and the P09 preview fixture still work. Existing tests are unedited. The `just poc-001-test-browser` recipe and wrapper are thin and follow the existing `poc-001-*` pattern. No new dependencies.
6. The full suite, typecheck, build and `just poc-001-test-browser` all pass. Inspect the committed screenshots yourself.

## Verification instructions

Run these independently at `353dac7`, or at `ca051f7` after confirming identical technical content:

- `just poc-001-install` if needed
- `just poc-001-test`
- `just poc-001-typecheck`
- `just poc-001-build`
- `just poc-001-test-browser`
- `git diff --check 767f46c..353dac7`
- the unedited-tests check `git diff --exit-code 767f46c 353dac7 -- <existing test files>`

Use Docker for application checks, and escalate rather than switching to host mode. Do not modify source or tests; put probes in the OS temp directory. Record exact commands, exit codes, counts and the tested revision.

## Restrictions

Edit only your report. Do not edit protected documents, plans or ADRs. Do not merge, push, rebase, or delete branches or worktrees.

## Expected output

Commit this assignment unchanged with your report at `docs/mailbox/p10-playable-patrol/reviewer.md`. The report starts with the `ruach-handoff` YAML block. Classify findings as **blocking** or **optional**, each with file:line, a failure scenario and evidence. Run the validator with `--repo /opt/dev/tehom-brainlab-p10` until it reports `ok: true`. Terminal handoff: report SHA, verdict, and the number of blocking and optional findings.
