# Follow-up assignment: legacy scratch triage R1 (task CONV-triage-r1)

Issued by: Coordinator, 2026-10-04. Role: implementer. Worktree `/opt/dev/tehom-brainlab-conventions`, branch `agent-artifact-conventions` (head `e6d5c35`). Commit this file unchanged with your changes. No merge or push. Do not delete or modify anything in the main checkout's `.agents/scratch/` yet.

The triage review (`docs/mailbox/agent-artifact-conventions/triage-reviewer.md`) has no blocking findings. The Coordinator accepts its optional findings O1 and O3:

1. **O1: preserve the legacy Coordinator assignments verbatim.**
   - Copy the 9 files under `/opt/dev/tehom-brainlab/.agents/scratch/routing-p02/assignments/*.md` unchanged to `docs/mailbox/routing-p02/assignment-<original-basename>.md`. Match the existing folder's naming; if a file name already starts with a role prefix, keep it readable.
   - Extract `/opt/dev/tehom-brainlab/.agents/scratch/worktree-cleanup-20261004/versioned-agent-skills-scratch.tar.gz` into a temporary directory OUTSIDE the repository, and never execute anything from it. Copy the 24 unique Markdown assignment members listed in O1 unchanged to `docs/mailbox/versioned-agent-skills/assignment-<basename>.md`. Skip `delivery-coordinator.md`, which is already tracked.
   - Before committing, run a secret-pattern scan on each copied file and verify each copy's bytes against its source with a hash check.
2. **O3: add the session IDs.** In `docs/mailbox/worktree-cleanup-20261004/implementer-scratch-triage.md`, add a table of the nine `skills-*` worker names and their Codex session IDs, taken from `pane-cleanup-before.json`.
3. **Update the manifest** in `docs/mailbox/agent-artifact-conventions/scratch-triage.md`. Mark the affected rows (routing-p02 assignments, the archive, `pane-cleanup-before.json`) to show where their content is now preserved. Correct the reason that cited a nonexistent "routing plan". Keep the trash classification only for content that is still not preserved and is genuinely transient. Record this as an R1 section and update the revision fields. Do not edit the reviewer's report or any other existing reports.

Do not edit CURRENT, TASK_LOGS, guidance, code, or tests.

Verification: confirm hash equality for all 33 copies, scan for secrets, check that all links resolve, run `git diff --check e6d5c35..HEAD`, and validate the updated reports with `.agents/skills/ruach-handoff/scripts/validate.ts`. Commit, then reply with a 3-line summary that includes the new candidate SHA.
