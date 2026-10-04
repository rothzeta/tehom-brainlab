# Assignment: prompt Coordinator cleanup — independent review (task CLEAN-review)

Issued by: Coordinator, 2026-10-04. Role: reviewer. Modify nothing except your report. Commit this assignment unchanged with your report.

## Change under review
Worktree `/opt/dev/tehom-brainlab-cleanup`, branch `workflow-prompt-cleanup`. BASE `06c181a`. Candidate `f2aa62c` (round 1 `2612652` plus R1). Evidence head `743abae`. Review `06c181a..743abae`, and confirm that the commits after `f2aa62c` touch only mailbox files. Inputs: `docs/mailbox/workflow-prompt-cleanup/implementer.md`, `assignment-implementer.md` (it states the user decision and the intended rules), and `assignment-implementer-r1.md`.

## Acceptance conditions
1. The Coordinator closes each worker's pane as soon as its durable handoff is committed and no further assignment will use it. It also removes that launch's reported private temporary directory. Workers never close their own panes.
2. The Coordinator removes each task-owned worktree as soon as nothing more will use it and its work is committed and reachable from a retained branch. Removal runs from a retained checkout, and branches are kept.
3. The Coordinator closes task-created Herdr workspaces and tabs once they hold no needed panes.
4. The safety rules are preserved: no discarding uncommitted work or unpreserved evidence; the caller pane, the main checkout, retained branches and unrelated sessions are kept; a blocker is reported when removal is unsafe.
5. Cleanup is no longer a deferred final step delegated to the integration Implementer, and no worker cleanup handoff is required. The Coordinator records closures, removals and exceptions in its CURRENT/TASK_LOGS record. Completion requires all resources released or reported as blockers.
6. The edits are consistent across the workflow skill, the Coordinator role and SCHEMA, with no contradictions anywhere in current guidance. The skill is self-contained. The Coordinator's do-not-implement/integrate/merge boundary is otherwise unchanged. Historical records and code/tests are untouched.

## Verification to run yourself (record commands and results)
- `git diff --stat 06c181a..743abae`, plus a non-Markdown check.
- Your own repo-wide search for cleanup, worktree removal and pane-closure guidance.
- The skill format check (`python3 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/ruach-workflow-feature`).
- `just test-agent-routing`, and `bun test` in `.agents/skills/ruach-handoff` and in `.agents/skills/ruach-herdr` (run `bun install --frozen-lockfile` first if needed).
- `git diff --check 06c181a..743abae`.

## Output
Report: `docs/mailbox/workflow-prompt-cleanup/reviewer.md`, in ruach-handoff format, with a verdict per condition and each finding classified as blocking or optional. Validate it with `.agents/skills/ruach-handoff/scripts/validate.ts`. Commit only the report and this assignment. Reply with a 3-line summary: the verdict, the blocking count, the commit SHA.
