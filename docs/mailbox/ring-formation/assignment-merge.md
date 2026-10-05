# Assignment RF-merge — deliver ring formation to local master (Implementer / integration owner)

Role: `implementer`. You implemented RF.

## Accepted candidate

The independent review (`docs/mailbox/ring-formation/reviewer.md`, committed at `9854131`) approves `0d5fadcb1a4c1a9c1cec75d93a72c37d07fdd3ae` with 0 blocking findings and 1 optional finding: a pre-existing stale status correction in the prototype README. The Coordinator accepts RF. The branch also carries the AI playtest evidence (`docs/mailbox/ai-playtest-20261005/`), which is delivered together with RF.

## Task

1. On `ring-formation`, add one documentation commit that marks RF delivered:
   - In the RF plan status line, record: implemented, independently reviewed (no blocking findings), accepted, locally delivered. Link `../mailbox/ring-formation/implementer.md`, `fix.md` and `reviewer.md`.
   - In `docs/plans/README.md`, update the RF entry and status summary (RF only).
   - Apply the Reviewer's optional README status correction (documentation text only), and also correct the stale P02 review/delivery status text in the prototype README if it is still present.

   Make no source or test changes. Do not edit `docs/CURRENT.md` or `docs/TASK_LOGS.md`.
2. Confirm that local `master` is still exactly `552f2b1913…` (check the full SHA with `git rev-parse master`) and that the main checkout is clean. If either is not true, stop and report.
3. Run `git -C /opt/dev/tehom-brainlab merge --ff-only ring-formation`.
4. In the main checkout, run:
   - `just poc-001-test`
   - `just poc-001-typecheck`
   - **`just poc-001-test-browser` bare, with `POC001_CHROME` unset (show it)**

   Then confirm that `git diff --name-only 0d5fadc master -- poc-001-linked-formation assets justfile` is empty apart from README documentation edits, and list those edits.
5. Write `docs/mailbox/ring-formation/delivery.md`, starting with the ruach-handoff YAML block (destination, destination_before, candidate_revision, reviewed_revision, delivered_revision, tested_revision, verification, outcome). Commit it on the branch together with this assignment, unchanged, then fast-forward master again with `--ff-only`. Run the validator with `--repo /opt/dev/tehom-brainlab` until it reports `ok: true`.

Do not push, delete branches or worktrees, rebase, or force.

Terminal handoff: delivered master revision, final master revision, check results, blockers.
