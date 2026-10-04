task: CONV-impl
status: complete
outcome: "Retired .agents/scratch/ and made the canonical sources state that Coordinator assignments and mailbox reports are durable and that only the Coordinator edits CURRENT/TASK_LOGS."
role: implementer
source_baseline: ec32b59d2cd34c272bed3e1d3aed50a14ad25c45
candidate_revision: 5816b4707333f06d75b7752167783b18173211f1
tested_revision: 5816b4707333f06d75b7752167783b18173211f1
artifacts:
  - docs/mailbox/agent-artifact-conventions/implementer.md
  - docs/mailbox/agent-artifact-conventions/assignment-implementer.md
  - "branch agent-artifact-conventions"
verification:
  - "git grep '.agents/scratch' outside docs/mailbox/*/*, TASK_LOGS and CURRENT: only scripts/test-agent-routing.py:93 and :191 (test assertions, out of scope)."
  - "git grep CURRENT|TASK_LOGS over .agents, AGENTS.md, SCHEMA, docs/README, mailbox/README, plans/README: no remaining guidance telling workers to edit them."
  - "python3 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/ruach-workflow-feature: exit 0, Skill is valid."
  - "just test-agent-routing: 13 tests OK (after bun install --frozen-lockfile in both skill dirs; before install, 17 failures were all dependencies_missing)."
  - "bun test in .agents/skills/ruach-handoff: 24 pass, 0 fail (before install, failed on missing ajv)."
  - "bun test in .agents/skills/ruach-herdr: 107 pass, 0 fail (before install, 86 failures from missing dependencies)."
  - "git diff --check ec32b59..5816b47 and the uncommitted tree: exit 0."
  - "bun .agents/skills/ruach-handoff/scripts/validate.ts on this report with --repo .: exit 0; ok true, three revisions resolved, no diagnostics."
discoveries:
  - "ADR-0005 still mandates scratch (docs/adr/0005-repository-management-and-tooling.md:17); not edited per assignment."
  - "ADR-0003 hand-back says 'Record execution in a dated task log entry and update CURRENT when facts change' without naming an owner (docs/adr/0003-implementation-plan-writing.md:47); not edited."
  - "scripts/test-agent-routing.py:93 and :191 assert .agents/scratch does not exist in a temporary checkout; still passes and needs no change."
  - "Individual plans in docs/plans/2026-10-02-*.md tell executors to record results in TASK_LOGS and update CURRENT; treated as plan history and left unchanged."
  - "Fresh worktrees need bun install --frozen-lockfile in ruach-handoff and ruach-herdr before the routing and skill suites pass."
blockers: []

# Agent artifact conventions — Implementer handoff

Author: Implementer (task `CONV-impl`). Date: 2026-10-04. Worktree `/opt/dev/tehom-brainlab-conventions`, branch `agent-artifact-conventions`, BASE `ec32b59`. The candidate `5816b47` contains every convention change. The later commit containing this report and the [assignment](assignment-implementer.md) records evidence only.

## Changes

| File | Change |
| --- | --- |
| `.agents/scratch/README.md` | Removed; the folder no longer exists. |
| `.gitignore` | Removed the `/.agents/scratch/*` rule, its README exception, and the comment above them. |
| `docs/SCHEMA.md` | Artifact table: the mailbox row now covers Coordinator assignments and says reports stay until a librarian triages them. The `docs/` row says only the Coordinator edits CURRENT and TASK_LOGS. A new row places disposable files in the OS temporary directory or the harness session scratch. Also adds the assignment filename rule, replaces the scratch paragraph with the outside-the-repository rule, adds the rule against committing dumps or secrets, and states durability and Coordinator-only CURRENT/TASK_LOGS. |
| `docs/mailbox/README.md` | Adds the assignment filename rule, durability, and commit-content rules. Replaces the instruction to record work in TASK_LOGS with a Coordinator-only statement. |
| `AGENTS.md`, `.agents/README.md`, `README.md`, `docs/README.md` | The scratch location becomes "disposable files outside the repository". Mentions Coordinator assignments, and Coordinator-only CURRENT/TASK_LOGS in AGENTS. Removes scratch from the README layout tree. |
| `.agents/agents/coordinator.md` | The Coordinator writes the assignment file into the worker's workspace and is the only editor of CURRENT/TASK_LOGS, updating them after acceptance and delivery. Mailbox reports are never deleted or folded away. |
| `.agents/agents/{architect,implementer,reviewer,scout}.md` | Commit the assignment unchanged with the report, keep disposable files outside the repository, and do not edit CURRENT/TASK_LOGS. Removes "scratch" from the architect and scout file-change limits. |
| `.agents/skills/ruach-workflow-feature/SKILL.md` | Adds the assignment file rule and the worker rules to the opening. Adds the Coordinator's CURRENT/TASK_LOGS update to "Record delivery". The cleanup step now preserves mailbox reports and no longer mentions scratch. |
| `docs/plans/README.md` | The Coordinator records the task log entry and CURRENT update; workers return the evidence. |

No other skill referenced `.agents/scratch/` or told workers to edit CURRENT/TASK_LOGS. I did not edit `docs/CURRENT.md`, `docs/TASK_LOGS.md`, ADRs, individual plans, historical mailbox reports, or code and tests.

## Remaining historical-only matches

These `.agents/scratch` matches remain:

- `docs/CURRENT.md` and `docs/TASK_LOGS.md`. The Coordinator owns these.
- Historical reports under `docs/mailbox/*/`, including this task's assignment.
- ADR-0005:17, quoted exactly below.
- The two test assertions listed in the discoveries.

ADR-0005:17 reads: "Within `.agents/`, `agents/` and `skills/` contain canonical role and skill definitions. `scratch/` contains local working artifacts ignored by Git, with its README retained to represent the directory in checkouts." This text now contradicts the retired convention, and a decision-maker needs to amend the ADR.

The individual POC plans also still contain "Record exact executed commands … in TASK_LOGS … and update CURRENT". This applies, for example, to `docs/plans/2026-10-02-2dfffcd3-poc-001-command-boundary.md:63` and the matching line in each sibling plan. Under the new rule, the Coordinator performs that recording.
