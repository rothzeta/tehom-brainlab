# Assignment P06-merge — deliver P06 to local master (Implementer / integration owner)

Role: `implementer` (follow `.agents/agents/implementer.md`). You implemented, integrated and fixed P06.

## Accepted candidate

Independent re-review (`docs/mailbox/p06-damage-and-fallen/reviewer.md`, committed at `506b2d8`) approves fixed combined revision `475823063a72c40bcb16115a53efe9a5d2712c7f`: R1 resolved, zero remaining blocking or optional findings. The Coordinator accepts P06.

## Task

1. In `/opt/dev/tehom-brainlab-p06` on `p06-damage-and-fallen`, add one documentation commit marking P06 delivered:
   - the P06 plan's status line (`docs/plans/2026-10-02-4c3c0d42-poc-001-damage-and-fallen.md`): implemented, independently reviewed (blocking R1 fixed and re-reviewed; no remaining findings), accepted, locally delivered, linking `../mailbox/p06-damage-and-fallen/implementer.md`, `integration.md`, `fix-r1.md`, `reviewer.md`;
   - the P06 row and status summaries in `docs/plans/README.md` (header paragraph and P06 row only; preserve P04/P05 status);
   - the prototype README's P06 status line if one exists.
   No source/test changes. Do not edit `docs/CURRENT.md` or `docs/TASK_LOGS.md`.
2. Confirm local `master` is still exactly `8f8c9e47859262401c189dd0d623bed09a5aeb30` and the main checkout `/opt/dev/tehom-brainlab` is clean. If master advanced or is dirty, stop and report; do not rebase or resolve conflicts.
3. Fast-forward: `git -C /opt/dev/tehom-brainlab merge --ff-only p06-damage-and-fallen`.
4. On delivered master, in the main checkout, run `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build` (Docker; escalate if needed; install first if needed) and confirm `git diff --name-only 4758230 master -- poc-001-linked-formation assets` is empty (list any status-line README edits).
5. Write `docs/mailbox/p06-damage-and-fallen/delivery.md` (ruach-handoff YAML first: destination, destination_before, candidate_revision, reviewed_revision, delivered_revision, tested_revision, verification, outcome). Commit it with this assignment unchanged on `p06-damage-and-fallen`, then fast-forward master again (`--ff-only`). Validate with `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p06-damage-and-fallen/delivery.md --repo /opt/dev/tehom-brainlab` until `ok: true`.

## Restrictions

No push, no branch/worktree deletion, no rebase, no force. Disposable files outside the repository.

## Expected output

Terminal handoff: delivery report path, delivered (technical) master revision, final master revision after the report commit, check results, blockers.
