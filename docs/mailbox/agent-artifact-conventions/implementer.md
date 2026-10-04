task: CONV-impl-r1
status: complete
outcome: "Retired .agents/scratch/ and made the canonical sources, including the ADR-0003/0005 amendments and draft plans P04-P12, state that Coordinator assignments and mailbox reports are durable and that only the Coordinator edits CURRENT/TASK_LOGS."
role: implementer
source_baseline: ec32b59d2cd34c272bed3e1d3aed50a14ad25c45
candidate_revision: ef06976c57a2510c0a098f287fb627309b816d7b
tested_revision: ef06976c57a2510c0a098f287fb627309b816d7b
previous_candidate_revision: 5816b4707333f06d75b7752167783b18173211f1
artifacts:
  - docs/mailbox/agent-artifact-conventions/implementer.md
  - docs/mailbox/agent-artifact-conventions/assignment-implementer.md
  - docs/mailbox/agent-artifact-conventions/assignment-implementer-r1.md
  - "branch agent-artifact-conventions"
verification:
  - "R1 at ef06976: git grep for scratch outside docs/mailbox/*/*, TASK_LOGS and CURRENT: only ADR-0005:17 (original text, amended at :37) and scripts/test-agent-routing.py:93/:191 (test assertions, out of scope)."
  - "R1 at ef06976: git grep for Record/update ... TASK_LOGS|CURRENT|task log: only delivered plans P01-P03 (history) and ownerless statements in ADR-0002:15, ADR-0003:47 (amended), ADR-0005:33; no current guidance tells workers to edit them."
  - "R1: git diff --check ec32b59..ef06976: exit 0."
  - "R1: git diff --name-only 5816b47..ef06976 contains only Markdown, so the suites were not rerun; code and tests are unchanged since 5816b47."
  - "Round 1 at 5816b47: quick_validate.py .agents/skills/ruach-workflow-feature: exit 0, Skill is valid."
  - "Round 1 at 5816b47: just test-agent-routing: 13 tests OK (after bun install --frozen-lockfile in both skill dirs; before install, 17 failures were all dependencies_missing)."
  - "Round 1 at 5816b47: bun test in ruach-handoff: 24 pass, 0 fail; in ruach-herdr: 107 pass, 0 fail (both failed before dependency install)."
  - "bun .agents/skills/ruach-handoff/scripts/validate.ts on this report with --repo .: exit 0; ok true, revisions resolved, no diagnostics."
discoveries:
  - "R1: ADR-0005:33 ('Record actual work in TASK_LOGS and summarize current facts in CURRENT') names no owner and refers to the ADR's own adoption; left unchanged and read consistently with the ADR-0003 amendment."
  - "R1: docs/plans/README.md:9 still told plan executors to record evidence in TASK_LOGS (missed in round 1); fixed in this R1 commit."
  - "No ADR amendment precedent existed; R1 introduced a status-line note, an Amendments section, and an amended date in the ADR index."
  - "scripts/test-agent-routing.py:93 and :191 assert .agents/scratch does not exist in a temporary checkout; still passes and needs no change."
  - "Fresh worktrees need bun install --frozen-lockfile in ruach-handoff and ruach-herdr before the routing and skill suites pass."
blockers: []

# Agent artifact conventions — Implementer handoff

Author: Implementer (tasks `CONV-impl`, `CONV-impl-r1`). Date: 2026-10-04. Worktree `/opt/dev/tehom-brainlab-conventions`, branch `agent-artifact-conventions`, BASE `ec32b59`. The round 1 candidate `5816b47` contains the original convention changes, and `ef06976` adds R1; see [R1](#r1). Later commits that contain this report and the assignments ([round 1](assignment-implementer.md), [R1](assignment-implementer-r1.md)) record evidence only.

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

## R1

The R1 [assignment](assignment-implementer-r1.md) fixed the guidance contradictions that round 1 had reported as discoveries. The candidate is `ef06976`.

| File | Change |
| --- | --- |
| `docs/adr/0005-repository-management-and-tooling.md` | Status line marked amended on 2026-10-04. A new Amendments section records that `.agents/scratch/` is retired, that disposable files live outside the repository, and that durable findings, reports, and assignments go to `docs/mailbox/`. Links the SCHEMA section. The original line 17 text is unchanged. |
| `docs/adr/0003-implementation-plan-writing.md` | Same amendment style. The Coordinator records the task log entry and the CURRENT update from worker handoffs; workers return hand-back evidence in a mailbox handoff. The original line 47 text is unchanged. |
| `docs/adr/README.md` | The 0003 and 0005 status column now reads "Accepted, 2026-10-03; amended 2026-10-04". |
| Draft plans P04–P12 (nine `docs/plans/2026-10-02-*.md` files) | In the owner line, the Coordinator records execution from the implementer's mailbox handoff. In the hand-back, the implementer returns evidence in its mailbox handoff, and the Coordinator records TASK_LOGS, links the entry, and updates CURRENT. |
| `docs/plans/README.md:9` | "record executed evidence" now reads "the Coordinator records executed evidence … from worker handoffs". It was missed in round 1 and is in a file this task already owns. |

I did not touch delivered plans P01–P03, other plan content, CURRENT, TASK_LOGS, historical mailbox reports, code, or tests.

These matches remain after R1:

- `scratch` in ADR-0005:17 (preserved original text, now amended).
- The two test assertions in `scripts/test-agent-routing.py`.
- History in `docs/mailbox/*/`, CURRENT, and TASK_LOGS.
- TASK_LOGS/CURRENT recording instructions in delivered plans P01–P03.
- Ownerless statements at ADR-0002:15, ADR-0003:47 (amended), and ADR-0005:33.
