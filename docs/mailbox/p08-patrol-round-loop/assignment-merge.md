# Assignment P08-merge — deliver P08 to local master (Implementer / integration owner)

Role: `implementer`. You implemented P08.

## Accepted candidate

The independent review (`docs/mailbox/p08-patrol-round-loop/reviewer.md`, committed at `eb4ec1c`) approved `864e3d0b1b5bba68495bcdb2141f1892c9d75b2e` with 0 blocking and 0 optional findings. The Coordinator accepts P08.

## Task

1. On `p08-patrol-round-loop`, add one docs commit marking P08 delivered:
   - in the P08 plan status line, record: implemented, independently reviewed (no findings), accepted, locally delivered. Link `../mailbox/p08-patrol-round-loop/implementer.md` and `reviewer.md`.
   - in `docs/plans/README.md`, update the P08 row and status summaries, P08 only.
   - update the prototype README's P08 status line if one exists.

   Make no source or test changes. Do not edit `docs/CURRENT.md` or `docs/TASK_LOGS.md`.
2. Confirm that local `master` is still exactly `9976e9a22631e5af913fe80af87f8c9e49044def` and that the main checkout is clean. If not, stop and report.
3. Run `git -C /opt/dev/tehom-brainlab merge --ff-only p08-patrol-round-loop`.
4. On delivered master in the main checkout, run `just poc-001-test`, `just poc-001-typecheck` and `just poc-001-build`. Confirm that `git diff --name-only 864e3d0 master -- poc-001-linked-formation assets` is empty, apart from any README status-line edits you list.
5. Write `docs/mailbox/p08-patrol-round-loop/delivery.md`, starting with the ruach-handoff YAML block: destination, destination_before, candidate_revision, reviewed_revision, delivered_revision, tested_revision, verification, outcome. Commit it on the branch together with this assignment, unchanged, then fast-forward master again with `--ff-only`. Run the validator with `--repo /opt/dev/tehom-brainlab` until it reports `ok: true`.

No push, no branch or worktree deletion, no rebase, no force.

Terminal handoff: delivery report path, delivered master revision, final master revision, check results, blockers.
