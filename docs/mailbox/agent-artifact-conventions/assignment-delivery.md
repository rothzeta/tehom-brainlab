# Assignment: agent artifact conventions — local delivery (task CONV-merge)

Issued by: Coordinator, 2026-10-04. Role: implementer (integration owner). Same worker and worktree as before.

The independent review (`docs/mailbox/agent-artifact-conventions/reviewer.md`, commit `1de8404`) passed all seven conditions with zero findings. Do not change any guidance, code, or tests.

1. Commit this assignment file unchanged on `agent-artifact-conventions`; it is documentation only.
2. Confirm that the main checkout `/opt/dev/tehom-brainlab` is clean and that local `master` is still at BASE `ec32b59d2cd34c272bed3e1d3aed50a14ad25c45`. If master has advanced, STOP and report.
3. Fast-forward: `git -C /opt/dev/tehom-brainlab merge --ff-only agent-artifact-conventions`. No push.
4. In the main checkout on delivered master: run `just test-agent-routing`; confirm `.agents/scratch/` is absent; confirm `git diff --name-only a9a52e6 master` lists only files under `docs/mailbox/agent-artifact-conventions/`.
5. Write `docs/mailbox/agent-artifact-conventions/delivery.md` in the main checkout, in ruach-handoff format. Cover: the reviewed candidate, destination master, the delivered revision, the merge outcome, the relation to the reviewed revision, delivered-master check results, and the review disposition. Validate it with `.agents/skills/ruach-handoff/scripts/validate.ts` and commit it on master. Do NOT edit CURRENT.md or TASK_LOGS.md.
6. Reply with a 3-line summary: the delivered SHA, the delivery-report commit, check results. Then wait: worktree cleanup is a separate assignment after the Coordinator records CURRENT/TASK_LOGS.
