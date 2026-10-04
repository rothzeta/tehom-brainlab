# Follow-up assignment: prompt cleanup R1 (task CLEAN-impl-r1)

Issued by: Coordinator, 2026-10-04. Same worker, worktree, and branch. Commit this file unchanged with your changes.

The Coordinator accepts your ruach-herdr discovery. In the worker-release rule of `.agents/skills/ruach-workflow-feature/SKILL.md` step 10 and in `.agents/agents/coordinator.md` Completion, add that when the Coordinator closes a worker's pane, it also removes that launch's private temporary directory, if the launch result reported one (`temporary_directory`, non-null). Keep it to one short clause each, and keep the skill self-contained. No other changes.

Verify: skill format check, `git diff --check 06c181a..HEAD`. Update your report with an R1 section and the new `candidate_revision`/`tested_revision`, then revalidate it. The suites need not be rerun for Markdown-only changes. Commit, then reply with a 2-line summary that includes the new candidate SHA.
