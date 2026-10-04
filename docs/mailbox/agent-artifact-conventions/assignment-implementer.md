# Assignment: agent artifact conventions — Implementer (task CONV-impl)

Issued by: Coordinator, 2026-10-04. Role: implementer (follow your canonical role definition).

## Workspace
- Worktree `/opt/dev/tehom-brainlab-conventions`, branch `agent-artifact-conventions`, BASE master `ec32b59`.
- Commit on this branch only. No merge to master, no push.
- This assignment file is part of the deliverable: commit it unchanged together with your report.

## Desired outcome (user decisions, 2026-10-04)
1. **Retire `.agents/scratch/`** as a repository convention. Remove the folder (its README) and its ignore rule. Truly disposable working files go outside the repository: the OS temporary directory or the harness's own session scratch. Anything worth keeping goes to `docs/mailbox/`.
2. **Coordinator assignments are durable.** The Coordinator writes each worker assignment as `docs/mailbox/<task>/assignment-<role-or-worker>.md` in the worker's workspace. The worker commits it unchanged with its report.
3. **`docs/CURRENT.md` and `docs/TASK_LOGS.md` are Coordinator-only.** Workers never edit them; they write their results to `docs/mailbox/`. The Coordinator updates CURRENT/TASK_LOGS from worker handoffs after acceptance and delivery.
4. **Mailbox is durable** until a future librarian agent (not yet defined) triages it, organizing or deleting reports. Delivery and cleanup must not delete or fold away mailbox reports. Workers commit only content meant to be read later: no raw dumps, secrets, or credentials.

## Scope
Update the canonical sources so they state these rules consistently and contradict nowhere. Likely files (confirm by searching the whole repo for `scratch`, `CURRENT`, `TASK_LOGS`, and `mailbox`):
- `docs/SCHEMA.md` (agent-artifacts section and the folder/ownership tables)
- `docs/mailbox/README.md` (currently tells mailbox writers to record work in TASK_LOGS; fix this)
- `.agents/scratch/README.md` (remove) and the related `.gitignore` entry
- `AGENTS.md`, `.agents/README.md`
- `.agents/agents/coordinator.md` and the other role files where they mention scratch or report locations
- `.agents/skills/ruach-workflow-feature/SKILL.md`; other skills only where they reference `.agents/scratch/` or tell workers to edit CURRENT/TASK_LOGS
Keep edits minimal and consistent with each file's existing style. Skills must remain self-contained.

## Out of scope / stop conditions
- **Do not edit `docs/CURRENT.md` or `docs/TASK_LOGS.md`**. The Coordinator records this change.
- Do not rewrite historical mailbox reports, plans, or task-log history that mention scratch; they are history.
- **Code or tests** (`scripts/`, `bin/`, skill `scripts/`, the routing launcher) that read or write `.agents/scratch/`: do not change them. List each with file:line in your report as a discovery. If removing the folder would break a default-suite check, keep the folder's ignore rule and report it.
- **ADRs:** if an ADR mandates `.agents/scratch/`, do not edit it. Report the exact text.

## Verification (run and record actual results)
- Repo-wide search showing no remaining *current-guidance* references to `.agents/scratch/`, and no guidance telling workers to edit CURRENT/TASK_LOGS. List any remaining historical-only matches.
- Format checks for every edited skill (use the repository's existing skill format check, as used in prior skill work; find the command in the skill READMEs or justfile).
- `just test-agent-routing` (routing regression) and the ruach-handoff and ruach-herdr test suites (`bun test` in each skill directory), to confirm nothing depends on the removed folder.
- `git diff --check ec32b59..HEAD`.

## Handoff
- Report: `docs/mailbox/agent-artifact-conventions/implementer.md`, in ruach-handoff format (`.agents/skills/ruach-handoff/SKILL.md`). Validate it with that skill's `scripts/validate.ts`.
- Commit the report, this assignment file, and your changes. Report BASE, candidate SHA, clean status, a list of changed files, discoveries, and blockers.
- Reply in this session with a 3–5 line summary.
