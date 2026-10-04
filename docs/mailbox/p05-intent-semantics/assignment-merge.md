# Assignment P05-merge — deliver P05 to local master (Implementer / integration owner)

Role: `implementer` (follow `.agents/agents/implementer.md`). You implemented P05.

## Accepted candidate

The independent review (`docs/mailbox/p05-intent-semantics/reviewer.md`, committed at `73fc9895f0101680fe769a23b895920db271dc41`) passed with 0 blocking and 0 optional findings on technical candidate `a95944723194b07f050f44e760f0f752df068ed7`. The Coordinator accepts P05.

## Task

1. In this worktree (`/opt/dev/tehom-brainlab-p05`, branch `p05-intent-semantics`), add one documentation commit that marks P05 delivered:
   - the P05 plan's status line (`docs/plans/2026-10-02-d66a7452-poc-001-intent-semantics.md`): implemented, independently reviewed (no findings), accepted, locally delivered, linking `../mailbox/p05-intent-semantics/implementer.md` and `reviewer.md`;
   - the P05 row and the status summaries in `docs/plans/README.md` (header paragraph and P05 row only; do not touch other plans' status);
   - the prototype README's P05 status line if one exists.
   Do not change source/tests. Do not edit `docs/CURRENT.md` or `docs/TASK_LOGS.md`.
2. Confirm local `master` is still exactly `0d6f23368f3cf21d1d14bc9bf0e8be34c0daff12` and the main checkout `/opt/dev/tehom-brainlab` is clean. If master advanced or is dirty, stop and report; do not rebase or resolve conflicts.
3. Fast-forward: `git -C /opt/dev/tehom-brainlab merge --ff-only p05-intent-semantics`.
4. On delivered master, in the main checkout, run `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build` (Docker; request sandbox escalation if needed; install first if the main checkout lacks dependencies) and confirm `git diff --name-only a959447 master -- poc-001-linked-formation ':!poc-001-linked-formation/README.md'` is empty.
5. Write `docs/mailbox/p05-intent-semantics/delivery.md` (ruach-handoff YAML first: destination, destination_before, candidate_revision, reviewed_revision, delivered_revision, tested_revision, verification, outcome). Commit it, together with this assignment unchanged, on the `p05-intent-semantics` branch, then fast-forward master again to that commit (`--ff-only`). Validate with `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p05-intent-semantics/delivery.md --repo /opt/dev/tehom-brainlab` until `ok: true`.

## Restrictions

No push, no branch/worktree deletion, no rebase, no force. Disposable files outside the repository.

## Expected output

Terminal handoff: delivery report path, delivered (technical) master revision, final master revision after the report commit, check results, blockers.
