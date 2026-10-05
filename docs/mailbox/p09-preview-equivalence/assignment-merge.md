# Assignment P09-merge — deliver P09 to local master (Implementer / integration owner)

Role: `implementer`. You implemented and fixed P09.

## Accepted candidate

The independent re-review (`docs/mailbox/p09-preview-equivalence/reviewer.md`, committed at `9affcea`) approves the fixed revision `aac806868a211997258ca75fca52554f4ce01641`. Blocking findings R1 and R2 are resolved, and no findings remain. The Coordinator accepts P09.

## Task

1. On `p09-preview-equivalence`, add one docs commit that marks P09 delivered:
   - the P09 plan status line: implemented, independently reviewed (R1/R2 fixed and re-reviewed; no remaining findings), accepted, locally delivered. Link `../mailbox/p09-preview-equivalence/implementer.md`, `fix.md` and `reviewer.md`.
   - the P09 row and status summaries in `docs/plans/README.md`, for P09 only.
   - the prototype README P09 status line, if one exists.

   No source or test changes. Do not edit `docs/CURRENT.md` or `docs/TASK_LOGS.md`.
2. Confirm that local `master` is still exactly `35586e8` (full SHA via `git rev-parse`) and that the main checkout is clean. If not, stop and report.
3. Run `git -C /opt/dev/tehom-brainlab merge --ff-only p09-preview-equivalence`.
4. On the delivered master in the main checkout, run `just poc-001-test`, `just poc-001-typecheck` and `just poc-001-build`. Confirm that `git diff --name-only aac8068 master -- poc-001-linked-formation assets` is empty, apart from any listed README status-line edits.
5. Write `docs/mailbox/p09-preview-equivalence/delivery.md`, starting with the ruach-handoff YAML block (destination, destination_before, candidate_revision, reviewed_revision, delivered_revision, tested_revision, verification, outcome). Commit it with this assignment unchanged on the branch, then fast-forward master again with `--ff-only`. Run the validator with `--repo /opt/dev/tehom-brainlab` until it reports `ok: true`.

Do not push, delete branches or worktrees, rebase or force.

Terminal handoff: delivery report path, delivered master revision, final master revision, check results, blockers.
