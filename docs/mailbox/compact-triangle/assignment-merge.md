# Assignment CT-merge — deliver Compact triangle to local master (Implementer / integration owner)

Role: `implementer` (follow `.agents/agents/implementer.md`). You implemented CT.

## Accepted candidate

The independent review (`docs/mailbox/compact-triangle/reviewer.md`, committed at `9b9cfde`) passed technical candidate `4fa7613f5c1b467377cef88bb89df5c30524a80d` with 0 blocking and 0 optional findings. The Coordinator accepts CT.

## Task

1. In `/opt/dev/tehom-brainlab-compact` on `compact-triangle`, add one documentation commit that marks CT delivered:
   - the CT plan status line (`docs/plans/2026-10-04-fb4bf201-poc-001-compact-triangle.md`): implemented, independently reviewed (no findings), accepted, locally delivered, linking `../mailbox/compact-triangle/implementer.md` and `reviewer.md`;
   - the CT entry/row and status summary in `docs/plans/README.md` (CT only; preserve the other plans' status).
   Make no source or test changes, and do not edit `docs/CURRENT.md` or `docs/TASK_LOGS.md`.
2. Confirm that local `master` is still exactly `0f9c1b7d4d0ff01c4a890df8a8c4a4500737165e` and that the main checkout `/opt/dev/tehom-brainlab` is clean. If not, stop and report.
3. Fast-forward with `git -C /opt/dev/tehom-brainlab merge --ff-only compact-triangle`.
4. On delivered master in the main checkout, run `just poc-001-test`, `just poc-001-typecheck` and `just poc-001-build`, using Docker and escalating if needed. Confirm that `git diff --name-only 4fa7613 master -- poc-001-linked-formation assets` is empty.
5. Write `docs/mailbox/compact-triangle/delivery.md`, starting with the ruach-handoff YAML block: destination, destination_before, candidate_revision, reviewed_revision, delivered_revision, tested_revision, verification, outcome. Commit it with this assignment unchanged on `compact-triangle`, then fast-forward master again with `--ff-only`. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/compact-triangle/delivery.md --repo /opt/dev/tehom-brainlab` until it returns `ok: true`.

## Restrictions

No push, branch or worktree deletion, rebase, or force. Disposable files stay outside the repository.

## Expected output

Terminal handoff: delivery report path, delivered master revision, final master revision, check results, blockers.
