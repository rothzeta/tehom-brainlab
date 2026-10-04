# Assignment: prompt Coordinator cleanup — Implementer (task CLEAN-impl)

Issued by: Coordinator, 2026-10-04. Role: implementer. Commit this file unchanged with your report.

## Workspace
Worktree `/opt/dev/tehom-brainlab-cleanup`, branch `workflow-prompt-cleanup`, BASE master `06c181a`. Commit only on this branch. No merge, no push.

## User decision (2026-10-04)
"The coordinator must clean up as soon as reuse of a worktree, Herdr space, or agent is no longer required."

Today, cleanup is a final workflow step delegated to the integration Implementer, with the launching parent closing the last panes. Replace that with **prompt, Coordinator-performed cleanup**:
1. **Agents and panes.** Once a worker's durable handoff is committed and the Coordinator will not assign it further work (for example a re-review or follow-up), the Coordinator closes that worker's Herdr pane immediately. It does not wait for workflow completion. A worker never closes its own pane.
2. **Worktrees.** Once a task-owned worktree has no further use (its work is committed, reachable from a retained branch, and no further assignment will use it), the Coordinator removes it with `git worktree remove`, running from a retained checkout outside the path. It keeps the branch.
3. **Herdr workspaces/tabs.** Once a task-created Herdr workspace or tab holds no more needed panes, the Coordinator closes it.
4. **Safety (unchanged in substance).** Never discard uncommitted work or unpreserved evidence. Preserve the caller pane, the main checkout, retained branches, and unrelated sessions. If removal is unsafe or fails, keep the resource and report a blocker.
5. **Record.** The Coordinator records what it closed and removed, and any exceptions, in its own CURRENT/TASK_LOGS record. A separate worker cleanup handoff is no longer required. The workflow completes once all task resources are released or reported as blockers.
6. **Before reuse ends.** The Coordinator should decide reuse deliberately. Keep a worker or worktree alive only while a concrete pending step needs it (review fix loop, integration, merge).

## Scope
Update consistently, in minimal edits that match existing style:
- `.agents/skills/ruach-workflow-feature/SKILL.md`: rewrite step 10 "Clean up", and adjust any steps (Plan tracking, Merge, Record delivery, the intro) that defer cleanup to the end or assign it to the integration Implementer. Release resources at the natural points: after each handoff, after review acceptance, after merge.
- `.agents/agents/coordinator.md`: the Completion section and anything that says "delegate closure". The Coordinator's "do not implement/integrate" boundary stays; resource cleanup is an explicit Coordinator duty.
- `.agents/agents/implementer.md` and the other roles, only where they mention cleanup handoffs or worktree removal duties.
- `docs/SCHEMA.md` (cleanup handoff description, around line 80), `.agents/skills/ruach-handoff` (only if it requires a worker cleanup handoff), and any other current guidance found by a repo-wide search for `cleanup`, `worktree remove`, and `close`.
- Skills must remain self-contained. Do not edit CURRENT.md, TASK_LOGS.md, historical mailbox reports, code, or tests. If code or tests encode the old cleanup handoff (for example handoff schema or validator fixtures requiring cleanup fields), do NOT change them; report them as discoveries.

## Verification (run and record actual results)
- Repo-wide search: no current guidance still delegates final cleanup to a worker or defers all cleanup to the end. List historical-only matches.
- Skill format check on the edited skills (`python3 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py <skill-dir>`).
- `just test-agent-routing`, plus `bun test` in `.agents/skills/ruach-handoff` and `.agents/skills/ruach-herdr` (run `bun install --frozen-lockfile` first if needed).
- `git diff --check 06c181a..HEAD`.

## Handoff
Report: `docs/mailbox/workflow-prompt-cleanup/implementer.md`, in ruach-handoff format. Validate it with `.agents/skills/ruach-handoff/scripts/validate.ts`. Commit, then reply with a 3-line summary: the candidate SHA, the changed files, any discoveries or blockers.
