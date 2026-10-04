# Assignment: prompt Coordinator cleanup — local delivery (task CLEAN-merge)

Issued by: Coordinator, 2026-10-04. Role: implementer (integration owner). The review (`reviewer.md`, commit `98f38d3`) passed with no findings. Do not change content.

1. Commit this assignment unchanged on `workflow-prompt-cleanup`.
2. Confirm that the main checkout `/opt/dev/tehom-brainlab` is clean and that master is still at `06c181a`. If master has advanced, STOP and report.
3. `git -C /opt/dev/tehom-brainlab merge --ff-only workflow-prompt-cleanup`. No push.
4. On delivered master, run `just test-agent-routing` and confirm that `git diff --name-only 743abae master` lists only mailbox files.
5. Write `docs/mailbox/workflow-prompt-cleanup/delivery.md` in the main checkout, in ruach-handoff format. Cover: the reviewed revision, the delivered revision, the merge outcome, and the checks. Validate it, then commit it on master. Do not edit CURRENT/TASK_LOGS.
6. Do no cleanup. Under the new rule, the Coordinator closes your pane and removes the worktree. Reply with a 2-line summary: the delivered SHA and the report commit.
