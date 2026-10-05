# Assignment P10-merge — deliver P10 to local master (Implementer / integration owner)

Role: `implementer`. You implemented and fixed P10.

## Accepted candidate

Independent re-review (`docs/mailbox/p10-playable-patrol/reviewer.md`, committed at `a7e422d`) approves fixed revision `dfeaadeb56250d4f21168efa2950c09606e8d5e1`. Blocking findings R1 and R2 are resolved, and no findings remain. The Coordinator accepts P10.

## Task

1. On `p10-playable-patrol`, add one docs commit that marks P10 delivered:
   - the P10 plan status line: implemented, independently reviewed (R1/R2 fixed and re-reviewed; no remaining findings), accepted, locally delivered. Link `../mailbox/p10-playable-patrol/implementer.md`, `fix.md` and `reviewer.md`.
   - the P10 row and status summaries in `docs/plans/README.md`, for P10 only. Note there that `just poc-001-test-browser` now exists.
   - the prototype README's P10 status line, if one exists.

   Make no source or test changes, and do not edit `docs/CURRENT.md` or `docs/TASK_LOGS.md`.
2. Confirm that local `master` is still exactly `767f46c4352fd3f2181550214e887a58f0df30a1` and that the main checkout is clean. If not, stop and report.
3. Run `git -C /opt/dev/tehom-brainlab merge --ff-only p10-playable-patrol`.
4. On the delivered master in the main checkout, run `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build` and `just poc-001-test-browser`. Confirm that `git diff --name-only dfeaade master -- poc-001-linked-formation assets justfile` is empty, apart from any README status-line edits you list.
5. Write `docs/mailbox/p10-playable-patrol/delivery.md`, starting with the ruach-handoff YAML block (destination, destination_before, candidate_revision, reviewed_revision, delivered_revision, tested_revision, verification, outcome). Commit it together with this assignment, unchanged, on the branch, then fast-forward master again with `--ff-only`. Run the validator with `--repo /opt/dev/tehom-brainlab` until it returns `ok: true`.

Do not push, delete branches or worktrees, rebase or force.

Terminal handoff: delivery report path, delivered master revision, final master revision, check results, blockers.
