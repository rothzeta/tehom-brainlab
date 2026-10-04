# Assignment: agent artifact conventions — independent review (task CONV-review)

Issued by: Coordinator, 2026-10-04. Role: reviewer (follow your canonical role definition). Do not modify any file except your report. Commit this assignment unchanged with your report.

## Change under review
- Worktree `/opt/dev/tehom-brainlab-conventions`, branch `agent-artifact-conventions`.
- BASE `ec32b59d2cd34c272bed3e1d3aed50a14ad25c45`. Candidate `ef06976c57a2510c0a098f287fb627309b816d7b` (round 1 `5816b47` plus R1). Evidence-only commit at the head: `a9a52e6`.
- Review `ec32b59..a9a52e6`, and confirm that the commits after `ef06976` change only mailbox files.
- Inputs: the Implementer report `docs/mailbox/agent-artifact-conventions/implementer.md`, and the assignments `assignment-implementer.md` (the original outcomes) and `assignment-implementer-r1.md`.

## Acceptance conditions (user decisions, 2026-10-04)
1. `.agents/scratch/` is retired: the folder and its ignore rule are gone. Current guidance places disposable files outside the repository and anything durable in `docs/mailbox/`.
2. Coordinator assignments are durable: they are written to `docs/mailbox/<task>/assignment-<role-or-worker>.md`, and the worker commits them unchanged with its report.
3. Only the Coordinator edits `docs/CURRENT.md` and `docs/TASK_LOGS.md`. No current guidance (roles, skills, AGENTS, SCHEMA, mailbox README, draft plans P04–P12, ADRs as amended) tells a worker to edit them.
4. Mailbox reports are durable until a future librarian agent triages them. Delivery and cleanup do not delete them. Workers commit only content meant to be read later, with no dumps or secrets.
5. The rules are consistent across all edited files, with no contradictions. Skills remain self-contained. Historical records (delivered plans P01–P03, past mailbox reports, CURRENT/TASK_LOGS history) are not rewritten.
6. The ADR-0005 and ADR-0003 amendments preserve the original decision text, are clearly dated and marked, and match the user decisions above.
7. No code or tests changed. The default suites still pass without `.agents/scratch/`.

## Verification to run yourself (record commands, exit codes, counts)
- `git diff --stat ec32b59..a9a52e6`, plus a non-Markdown file check.
- Your own repo-wide searches for `scratch`, `CURRENT`, `TASK_LOGS`, and `mailbox` in current guidance.
- `just test-agent-routing`, and `bun test` in `.agents/skills/ruach-handoff` and in `.agents/skills/ruach-herdr` (run `bun install --frozen-lockfile` in each first if dependencies are missing).
- The skill format check on `.agents/skills/ruach-workflow-feature` (the Implementer used `quick_validate.py` from the Codex skill-creator).
- `git diff --check ec32b59..a9a52e6`.

## Output
- Report: `docs/mailbox/agent-artifact-conventions/reviewer.md`, in ruach-handoff format (`.agents/skills/ruach-handoff/SKILL.md`), with a pass/fail verdict per condition. Classify each finding as blocking or optional, with file:line, the scenario, and a fix direction. Validate it with the skill's `scripts/validate.ts`.
- Commit only the report and this assignment. No merge or push.
- Reply with a 3–5 line summary: the verdict, the blocking count, the reviewed revision, and the report commit SHA.
