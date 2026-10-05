# Assignment P11-merge — deliver P11 to local master (Implementer / integration owner)

Role: `implementer`. You implemented P11.

## Accepted candidate

The independent review (`docs/mailbox/p11-reproducible-playtests/reviewer.md`, committed at `1fd2927`) passed technical candidate `8decc8c80546f1437fbd6107215fc84b8b2cabb2`, with evidence successor `f9cb191`. It found 0 blocking and 0 optional findings and independently confirmed the boss gate as HOLD. The Coordinator accepts P11.

## Task

1. On `p11-reproducible-playtests`, add one docs commit that marks P11 delivered:
   - update the P11 plan status line: implemented, independently reviewed (no findings), accepted, locally delivered. State that the boss gate is HOLD because no human playtest attempts are recorded, and link `../mailbox/p11-reproducible-playtests/implementer.md`, `reviewer.md` and the playtest artifact;
   - update the P11 row and status summaries in `docs/plans/README.md` (P11 only). Note that `just poc-001-replay` exists and that P12 stays blocked by the HOLD gate;
   - update the prototype README P11 status line if one exists.

   Make no source or test changes, and do not edit `docs/CURRENT.md` or `docs/TASK_LOGS.md`.
2. Confirm that local `master` is still exactly `83153499d4289056f07cf3b0a234b664ad0aac91` and that the main checkout is clean. If not, stop and report.
3. Run `git -C /opt/dev/tehom-brainlab merge --ff-only p11-reproducible-playtests`.
4. On delivered master in the main checkout, run `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build`, `just poc-001-test-browser`, and `just poc-001-replay` on one committed exported record. Confirm that `git diff --name-only 8decc8c master -- poc-001-linked-formation assets justfile` is empty, apart from any README status-line edits you list.
5. Write `docs/mailbox/p11-reproducible-playtests/delivery.md`, starting with the ruach-handoff YAML block: destination, destination_before, candidate_revision, reviewed_revision, delivered_revision, tested_revision, verification, outcome. Commit it together with this assignment, unchanged, on the branch, then fast-forward master again with `--ff-only`. Run the validator with `--repo /opt/dev/tehom-brainlab` until it returns `ok: true`.

No push, no branch or worktree deletion, no rebase, no force.

Terminal handoff: delivery report path, delivered master revision, final master revision, check results, blockers.
