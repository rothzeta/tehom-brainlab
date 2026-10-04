# Assignment P04-merge — deliver P04 to local master (Implementer / integration owner)

Role: `implementer` (follow `.agents/agents/implementer.md`). You implemented and integrated P04.

## Accepted candidate

The independent review (`docs/mailbox/p04-formation-lab/reviewer.md`, committed at `4b5de4a4cae00336d459cdf60271b21649bfe6e5`) passed combined revision `b5e7c54ebd361fd926f197d014f01f3e8e89581d` with 0 blocking findings and one optional finding (O1: browser assertions over-constrain link-readout punctuation and button order). The Coordinator accepts P04. O1 stays open as an optional follow-up; do not fix it here.

## Task

1. In `/opt/dev/tehom-brainlab-p04` on `p04-formation-lab`, add one documentation commit marking P04 delivered:
   - the P04 plan's status line (`docs/plans/2026-10-02-9d81c6df-poc-001-formation-lab.md`): implemented, independently reviewed (no blocking findings; optional O1 open), accepted, locally delivered, linking `../mailbox/p04-formation-lab/implementer.md`, `integration.md`, `reviewer.md`;
   - the P04 row and the status summaries in `docs/plans/README.md` (header paragraph and P04 row only; preserve P05's existing status);
   - the prototype README's P04 status line if one exists.
   No source/test changes. Do not edit `docs/CURRENT.md` or `docs/TASK_LOGS.md`.
2. Confirm local `master` is still exactly `04bd6a28bd21f5248cd18de59cbf5efbc408b6a1` and the main checkout `/opt/dev/tehom-brainlab` is clean. If master advanced or is dirty, stop and report; do not rebase or resolve conflicts.
3. Fast-forward: `git -C /opt/dev/tehom-brainlab merge --ff-only p04-formation-lab`.
4. On delivered master, in the main checkout, run `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build` (Docker; escalate if needed; install first if needed) and confirm `git diff --name-only b5e7c54 master -- poc-001-linked-formation assets` is empty (status-line README edits excepted, which you must list).
5. Write `docs/mailbox/p04-formation-lab/delivery.md` (ruach-handoff YAML first: destination, destination_before, candidate_revision, reviewed_revision, delivered_revision, tested_revision, verification, outcome). Commit it together with this assignment unchanged on `p04-formation-lab`, then fast-forward master again (`--ff-only`). Validate with `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p04-formation-lab/delivery.md --repo /opt/dev/tehom-brainlab` until `ok: true`.

## Restrictions

No push, no branch/worktree deletion, no rebase, no force. Disposable files outside the repository.

## Expected output

Terminal handoff: delivery report path, delivered (technical) master revision, final master revision after the report commit, check results, blockers.
