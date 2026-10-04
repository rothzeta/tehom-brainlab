# Assignment: review legacy scratch triage (task CONV-triage-review)

Issued by: Coordinator, 2026-10-04. Role: reviewer. Modify nothing except your report. Commit this assignment unchanged with your report.

## Change under review
- Worktree `/opt/dev/tehom-brainlab-conventions`, branch `agent-artifact-conventions`. BASE `e70f49b` (master). Candidate `efc14c2` (kept content). Evidence commit `c35915a` (triage manifest report plus its assignment).
- Triage report: `docs/mailbox/agent-artifact-conventions/scratch-triage.md`. Assignment: `assignment-scratch-triage.md` in the same folder.
- Source files (read-only, untracked): `/opt/dev/tehom-brainlab/.agents/scratch/{p02,routing-p02,worktree-cleanup-20261004}/`.

## Why this matters
After merge, the 46 files classified as trash will be **permanently deleted**. They were never committed, so deletion is irreversible.

## Acceptance conditions
1. The manifest covers every source file exactly once, with correct sizes.
2. Every **trash** decision is justified: either the content is already preserved (byte-identical or substantively captured) in committed mailbox reports, TASK_LOGS, plans, or retained branches, or it is genuinely transient with no future value. Spot-check at least the larger files and every non-duplicate trash file. Flag any trash file holding unique findings as **blocking**.
3. Kept content is curated and readable, matches its sources, and contains no secrets, credentials, tokens, or raw dumps.
4. Only mailbox files changed in `e70f49b..c35915a`. No existing committed report was modified. CURRENT, TASK_LOGS, guidance, code, and tests are untouched.
5. Links resolve, `git diff --check` passes, and both reports validate with `.agents/skills/ruach-handoff/scripts/validate.ts`.

## Output
- Report: `docs/mailbox/agent-artifact-conventions/triage-reviewer.md`, in ruach-handoff format. Give a verdict per condition. Classify each finding as blocking or optional, with the file and the reason. Validate it.
- Commit only your report and this assignment. No merge or push.
- Reply with a 3-line summary: the verdict, the blocking count, the report commit SHA.
