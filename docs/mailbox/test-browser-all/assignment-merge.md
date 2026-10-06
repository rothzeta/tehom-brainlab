# Assignment: merge browser-runner coverage to local master (Implementer)

Role: `implementer` (follow `.agents/agents/implementer.md`). You own integration and merging for this task.
Coordinator: the Claude Coordinator session in the main checkout.

## Accepted candidate

- **Reviewed and tested code:** `796e833da5cd1129d2bc5c77d893266d51807aba`. The review and the re-review of O1 left no findings.
- **Review report:** commit `3545b20` on branch `test-browser-all-review`.
- **Destination:** local `master` in the main checkout `/opt/dev/tehom-brainlab`. Expected current SHA: `ac0d3842285be8b70f3296188cead28fd6097ec1`.
- **What master gained since your BASE `6414332`:** the reviewed P17 merge, which is only docs (P17 review and delivery reports, the P16 reports) plus the P17 code you already have. Check that the prototype content of master equals `7df00d0`'s.

## Steps

1. In `/opt/dev/tehom-brainlab-tball` (branch `test-browser-all`), run `git merge --ff-only test-browser-all-review`.
2. Merge `master` (`ac0d3842285be8b70f3296188cead28fd6097ec1`) into `test-browser-all` with a merge commit. If any conflict touches `poc-001-linked-formation/`, stop and report blocked.
3. Confirm `git diff --exit-code 796e833da5cd1129d2bc5c77d893266d51807aba HEAD -- poc-001-linked-formation` exits 0. Verification evidence is reused.
4. Confirm `master` is still exactly `ac0d3842285be8b70f3296188cead28fd6097ec1` and the main checkout is clean, otherwise stop. Then, in `/opt/dev/tehom-brainlab`, run `git merge --ff-only <full SHA of test-browser-all HEAD>`.
5. Write `docs/mailbox/test-browser-all/delivery.md`, starting with the `ruach-handoff` YAML block. Commit it on `master` in the main checkout, with this assignment unchanged. Leave no stray untracked copy.
6. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/test-browser-all/delivery.md --repo /opt/dev/tehom-brainlab` until it reports `ok: true`.

## Restrictions

- Do not push.
- Do not touch `docs/CURRENT.md`, `docs/TASK_LOGS.md` or other worktrees.

Terminal handoff: the final `master` SHA, the merge outcome and blockers.
