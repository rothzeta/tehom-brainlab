# Assignment P16 merge to local master (Implementer)

Role: `implementer` (follow `.agents/agents/implementer.md`). You own P16 integration and merging.
Coordinator: the Claude Coordinator session in the main checkout.

## Accepted candidate

- **Reviewed code:** `d8a30c6897f09708e5c972796462ca8c0ebdc848`. The independent review found no blocking or optional findings.
- **Delivery candidate:** branch `p16-review` at `3adff6614b388e3a39d2dd9f56e88d6642e6b7aa`. It is the reviewed code plus the integration and review reports; docs only.
- **Destination:** local `master` in the main checkout `/opt/dev/tehom-brainlab`. Expected current SHA: `69c56adec70960511927ca308e0c824d4e17e33b`. It is an ancestor of the candidate, so this is a fast-forward.

## Steps

1. Confirm `master` is exactly `69c56adec70960511927ca308e0c824d4e17e33b` and the main checkout is clean. Otherwise, stop and report blocked.
2. In `/opt/dev/tehom-brainlab`, run `git merge --ff-only 3adff6614b388e3a39d2dd9f56e88d6642e6b7aa`.
3. Confirm `git diff --exit-code d8a30c6897f09708e5c972796462ca8c0ebdc848 master -- poc-001-linked-formation` exits 0. Verification evidence is reused; do not rerun the suites.
4. Write `docs/mailbox/p16-repositioning/delivery.md`, starting with the `ruach-handoff` YAML block. Commit it on `master` in the main checkout, with this assignment unchanged. Leave no stray untracked copy in your worktree.
5. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p16-repositioning/delivery.md --repo /opt/dev/tehom-brainlab` until it reports `ok: true`.

## Restrictions

- Do not push.
- Do not touch `docs/CURRENT.md`, `docs/TASK_LOGS.md` or other worktrees.

Terminal handoff: the final `master` SHA, the merge outcome and blockers.
