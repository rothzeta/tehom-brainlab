# Assignment: agent artifact conventions — final cleanup (task CONV-cleanup)

Issued by: Coordinator, 2026-10-04. Role: implementer (integration owner). Run every command with cwd `/opt/dev/tehom-brainlab` (the main checkout, which is retained). Commit this assignment unchanged with your cleanup report on master. No push.

Master is at `6b1f02b`, which includes the Coordinator's CURRENT/TASK_LOGS record.

1. **Delete the legacy scratch folder** `/opt/dev/tehom-brainlab/.agents/scratch/`. The user approved deleting the trash, and all keepers are committed. First re-verify that the 49-file inventory matches the manifest (`docs/mailbox/agent-artifact-conventions/scratch-triage.md`), and that every keep row's mailbox copy exists on master. If anything is unexpected (extra files or a missing copy), STOP and report instead of deleting. Then remove the whole folder.
2. **Remove the task worktree** with `git -C /opt/dev/tehom-brainlab worktree remove /opt/dev/tehom-brainlab-conventions`, once it is clean and its branch `agent-artifact-conventions` is fully reachable from master. Keep the branch. If removal is unsafe, preserve the worktree and report it.
3. **Panes.** The Coordinator closed `conv-reviewer` (w2G:p1C), `scratch-triage` (w2G:p1D) and `triage-reviewer` (w2G:p1E). `conv-implementer` (w2G:p1B) disappeared during the task; the Coordinator did not close it. Your pane `w2G:p1F` will be closed by the Coordinator after your handoff; do not close it yourself. Preserve the caller pane `w2G:p18` and all other panes.
4. Write `docs/mailbox/agent-artifact-conventions/cleanup.md` in ruach-handoff format. Cover: the deleted scratch inventory (count and bytes), removed and retained worktrees, closed and retained panes (noting the p1B anomaly and p1F as the parent-owned final closure), and preserved revisions (master, the `agent-artifact-conventions` branch, and the three retained repo-root branches recorded in TASK_LOGS). Validate it with `.agents/skills/ruach-handoff/scripts/validate.ts` and commit it on master.
5. Final checks: `git status --short` is clean (no `.agents/scratch/`); `git worktree list` shows only the main checkout; `just test-agent-routing` passes.

Reply with a 3-line summary: the cleanup commit SHA, what was removed, any blockers.
