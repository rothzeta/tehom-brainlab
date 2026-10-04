# Assignment: triage legacy .agents/scratch content (task CONV-triage)

Issued by: Coordinator, 2026-10-04. Role: implementer. Commit this file unchanged with your report.

## Context
The `.agents/scratch/` convention was retired (see `docs/SCHEMA.md` agent-artifacts section and `docs/mailbox/agent-artifact-conventions/`). Disposable files now belong outside the repository, and anything worth keeping belongs in `docs/mailbox/`. Mailbox reports are durable until a future librarian triages them. Commit only content meant to be read later: no raw dumps, secrets, credentials, tokens, or private home paths beyond what existing reports already show.

The main checkout `/opt/dev/tehom-brainlab` still holds untracked, previously ignored legacy folders: `.agents/scratch/p02/`, `.agents/scratch/routing-p02/`, `.agents/scratch/worktree-cleanup-20261004/` (about 50 files, about 800K). The user asked to triage them, keep what is useful in mailbox, and delete the rest.

## Workspace
- Read the legacy files from `/opt/dev/tehom-brainlab/.agents/scratch/` (read-only for now; do NOT delete or modify anything in the main checkout).
- Write and commit in worktree `/opt/dev/tehom-brainlab-conventions`, branch `agent-artifact-conventions` (currently equal to master `e70f49b`). No merge to master, no push.

## Task
1. Classify every file under the three folders as **keep** or **trash**:
   - **keep**: unique evidence or findings that a future reader (or the librarian) would need, and that are not already captured in committed mailbox reports, TASK_LOGS, or plans. Compare against `docs/mailbox/p02-formation-algebra/`, `docs/mailbox/routing-p02/`, and related reports.
   - **trash**: duplicates of committed content, transient logs or command output, intermediate drafts superseded by committed reports, build/test artifacts, anything with secrets.
2. Copy kept files into the matching existing mailbox task folder (for example `docs/mailbox/p02-formation-algebra/`, `docs/mailbox/routing-p02/`), or a new `docs/mailbox/worktree-cleanup-20261004/` if there is no matching task. Follow SCHEMA naming. Prefer a concise curated Markdown summary over committing bulky raw output; summarize where a raw file is mostly noise. Do not modify existing committed reports.
3. Write the triage report `docs/mailbox/agent-artifact-conventions/scratch-triage.md` in ruach-handoff format (`.agents/skills/ruach-handoff/SKILL.md`). Include a manifest table covering EVERY legacy file: path, size, keep/trash, destination (if kept), and a one-line reason. Also give totals.
4. Do NOT edit CURRENT.md, TASK_LOGS.md, guidance, code, or tests.

## Verification
- Show that the manifest covers every file: compare `find .agents/scratch -type f | wc -l` in the main checkout with the number of manifest rows.
- Secret scan of the kept and committed content (grep for token, key, secret, password, bearer, and similar patterns); report the result.
- Run `git diff --check` on your commit range; validate your report with `.agents/skills/ruach-handoff/scripts/validate.ts`.

## Handoff
Commit kept files, the report, and this assignment on the branch. Reply with a 3-line summary: keep/trash counts, candidate SHA, report path. Deletion of the originals happens later, in a separate cleanup step, after review and merge.
