# Assignment P07-merge — deliver P07 to local master (Implementer / integration owner)

Role: `implementer`. You implemented and fixed P07.

## Accepted candidate

Independent re-review (`docs/mailbox/p07-brood-abilities/reviewer.md`, committed at `2b65f55`) approves fixed revision `90e96d301bcbe7886755425b489123d87c455776`. R1 (blocking) and R2 (optional) are resolved, and no findings remain. The Coordinator accepts P07.

## Task

1. On `p07-brood-abilities`, add one docs commit that marks P07 delivered:
   - the P07 plan status line: implemented, independently reviewed (R1 fixed and re-reviewed; no remaining findings), accepted, locally delivered. Link `../mailbox/p07-brood-abilities/implementer.md`, `fix.md`, `traces.md` (or the actual trace file) and `reviewer.md`;
   - the P07 row and status summaries in `docs/plans/README.md` (P07 only);
   - the prototype README's P07 status line, if one exists.
   No source or test changes. Do not edit `docs/CURRENT.md` or `docs/TASK_LOGS.md`.
2. Confirm that local `master` is still exactly `08dc6308649f124ee4a9d5897bcb8d92438dacec` and the main checkout is clean. If not, stop and report.
3. `git -C /opt/dev/tehom-brainlab merge --ff-only p07-brood-abilities`.
4. On delivered master in the main checkout, run `just poc-001-test`, `just poc-001-typecheck` and `just poc-001-build`. Confirm that `git diff --name-only 90e96d3 master -- poc-001-linked-formation assets` is empty, apart from any listed README status-line edits.
5. Write `docs/mailbox/p07-brood-abilities/delivery.md`, starting with the ruach-handoff YAML block (destination, destination_before, candidate_revision, reviewed_revision, delivered_revision, tested_revision, verification, outcome). Commit it together with this assignment, unchanged, on the branch, then fast-forward master again with `--ff-only`. Run the validator with `--repo /opt/dev/tehom-brainlab` until it reports `ok: true`.

No push, branch/worktree deletion, rebase or force.

Terminal handoff: delivery report path, delivered master revision, final master revision, check results, blockers.
