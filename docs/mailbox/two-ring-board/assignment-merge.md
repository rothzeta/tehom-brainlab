# Assignment TR-merge — deliver two-ring board to local master (Implementer / integration owner)

Role: `implementer` (follow `.agents/agents/implementer.md`). You implemented TR.

## Accepted candidate

The independent review (`docs/mailbox/two-ring-board/reviewer.md`, committed at `befb8e1`) passed technical candidate `2e98a276a11c0ed7db117c34dd8374ce9d5c956d` with 0 blocking and 0 optional findings. The Coordinator accepts TR.

## Task

1. In `/opt/dev/tehom-brainlab-tworing` on `two-ring-board`, add one documentation commit marking TR delivered:
   - update the TR plan status line (`docs/plans/2026-10-04-d005e5f4-poc-001-two-ring-board.md`) to say implemented, independently reviewed (no findings), accepted and locally delivered, linking `../mailbox/two-ring-board/implementer.md` and `reviewer.md`;
   - update the TR entry and the status summary in `docs/plans/README.md` for TR only.
   Make no source or test changes, and do not edit `docs/CURRENT.md` or `docs/TASK_LOGS.md`.
2. Confirm that local `master` is still exactly `0a48098ff439bc84df06f5f8e965531d69e0dba2` and that the main checkout is clean. If not, stop and report.
3. Run `git -C /opt/dev/tehom-brainlab merge --ff-only two-ring-board`.
4. On delivered master in the main checkout, run `just poc-001-test`, `just poc-001-typecheck` and `just poc-001-build`. Confirm that `git diff --name-only 2e98a27 master -- poc-001-linked-formation assets` is empty.
5. Write `docs/mailbox/two-ring-board/delivery.md`, starting with the ruach-handoff YAML block (destination, destination_before, candidate_revision, reviewed_revision, delivered_revision, tested_revision, verification, outcome). Commit it with this assignment unchanged on `two-ring-board`, then fast-forward master again with `--ff-only`. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/two-ring-board/delivery.md --repo /opt/dev/tehom-brainlab` until it returns `ok: true`.

## Restrictions

No push, no branch or worktree deletion, no rebase, no force. Keep disposable files outside the repository.

## Expected output

Terminal handoff: delivery report path, delivered master revision, final master revision, check results, blockers.
