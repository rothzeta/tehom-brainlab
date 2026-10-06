# Assignment P17 merge to local master (Implementer)

Role: `implementer` (follow `.agents/agents/implementer.md`). You own integration and merging for P17.
Coordinator: the Claude Coordinator session in the main checkout.

## Accepted candidate

- **Reviewed and tested code:** `7df00d020119d1c67e85df60d5628ed418cb642c`. The independent review passed with no blocking findings. The one optional finding is a plan-wording clarification that is not yours to edit.
- **Review report:** commit `6a6b54e` on branch `p17-review`.
- **Destination:** local `master` in the main checkout `/opt/dev/tehom-brainlab`. Expected current SHA: `b1130e7839358a124c4ab228806ee9a64683ab22`. Since your BASE `9abd506` it has gained only docs: the P16 review and delivery reports.

## Steps

1. In `/opt/dev/tehom-brainlab-p17` (branch `p17-collector`), run `git merge --ff-only p17-review`.
2. Merge `master` (`b1130e7839358a124c4ab228806ee9a64683ab22`) into `p17-collector` with a merge commit. Conflicts must be docs-only; if any touches `poc-001-linked-formation/`, stop and report blocked.
3. Confirm `git diff --exit-code 7df00d020119d1c67e85df60d5628ed418cb642c HEAD -- poc-001-linked-formation` exits 0. Verification evidence is reused; do not rerun the suites.
4. Confirm `master` is still exactly `b1130e7839358a124c4ab228806ee9a64683ab22` and the main checkout is clean, otherwise stop. Then, in `/opt/dev/tehom-brainlab`, run `git merge --ff-only <full SHA of p17-collector HEAD>`.
5. Write `docs/mailbox/p17-collector/delivery.md`, starting with the `ruach-handoff` YAML block. Commit it on `master` in the main checkout, with this assignment unchanged. Leave no stray untracked copy.
6. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p17-collector/delivery.md --repo /opt/dev/tehom-brainlab` until it reports `ok: true`.

## Restrictions

- Do not push.
- Do not touch `docs/CURRENT.md`, `docs/TASK_LOGS.md` or other worktrees.

Terminal handoff: the final `master` SHA, the merge outcome and blockers.
