task: CLEAN-impl-r1
status: complete
outcome: "Current guidance now has the Coordinator release each pane, Herdr workspace or tab, and worktree as soon as no pending step needs it. Cleanup is no longer a final step delegated to the integration Implementer, and no worker cleanup handoff is required."
role: implementer
source_baseline: 06c181a
candidate_revision: f2aa62c3792171268b67a33e0565de54deceee2d
tested_revision: f2aa62c3792171268b67a33e0565de54deceee2d
previous_candidate_revision: 261265215838cec900c96af78b84d448a24e5f4a
artifacts:
  - docs/mailbox/workflow-prompt-cleanup/implementer.md
  - docs/mailbox/workflow-prompt-cleanup/assignment-implementer.md
  - docs/mailbox/workflow-prompt-cleanup/assignment-implementer-r1.md
  - .agents/skills/ruach-workflow-feature/SKILL.md
  - .agents/agents/coordinator.md
  - docs/SCHEMA.md
  - "branch workflow-prompt-cleanup"
verification:
  - "R1 at f2aa62c: quick_validate.py .agents/skills/ruach-workflow-feature: exit 0, Skill is valid!"
  - "R1: git diff --check 06c181a..f2aa62c: exit 0, no output."
  - "R1: Markdown-only change (git diff --name-only 2612652..f2aa62c lists only .md files: the two guidance files, the R1 assignment, and the round 1 report and assignment from d9a12ec); suites not rerun, as permitted. The results below are from round 1 at 2612652."
  - "Repo-wide git grep (cleanup, clean up, worktree remove, close/closing/closure, cleanup worker/handoff, launching parent, final handoff/cleanup, delegate closure) outside docs/mailbox/*/*, CURRENT and TASK_LOGS: no current guidance delegates cleanup to a worker or defers all cleanup to the end. Remaining non-cleanup matches are listed in the report body."
  - "python3 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/ruach-workflow-feature: exit 0, Skill is valid!"
  - "just test-agent-routing: Ran 13 tests, OK (after bun install --frozen-lockfile in ruach-handoff and ruach-herdr, both exit 0)."
  - "bun test in .agents/skills/ruach-handoff: 24 pass, 0 fail."
  - "bun test in .agents/skills/ruach-herdr: 107 pass, 0 fail."
  - "git diff --check 06c181a..2612652: exit 0, no output."
  - "bun .agents/skills/ruach-handoff/scripts/validate.ts on this report with --repo .: exit 0, ok true, revisions resolved, no diagnostics."
discoveries:
  - "No code, test, schema, or validator encodes a worker cleanup handoff. ruach-handoff (SKILL.md, handoff.schema.json, validate.ts) has no cleanup fields, so it needed no change."
  - "ruach-herdr SKILL.md:48 and references/adapters.md:43 say the caller removes a started worker's private temporary directory after the session ends. Accepted by the Coordinator and addressed in R1."
  - "Delivered plan docs/plans/2026-10-02-2dfffcd3-poc-001-command-boundary.md:11 names a local integration/cleanup Implementer owner. It is a delivered (historical) plan and was left unchanged; draft plans P04-P12 contain no cleanup ownership."
blockers: []

# Prompt Coordinator cleanup — Implementer handoff

Author: Implementer (task `CLEAN-impl`). Date: 2026-10-04. Worktree `/opt/dev/tehom-brainlab-cleanup`, branch `workflow-prompt-cleanup`, BASE `06c181a`. Round 1 candidate `2612652` contains the original guidance changes, and `f2aa62c` adds [R1](#r1). The later commit that adds this report and the [assignment](assignment-implementer.md) records evidence only.

## Changes

| File | Change |
| --- | --- |
| `.agents/skills/ruach-workflow-feature/SKILL.md` | The description says "prompt Coordinator cleanup of task resources". Plan: also track Herdr workspaces or tabs, and note which pending step still needs each worker and worktree. Implement: release each worker once its handoff is committed and no further assignment will go to it. Review step 5: after acceptance, release the Reviewer and any worker or worktree that no pending step needs. Merge: after the merge handoff, release the integration Implementer and every worktree that recording does not need. Record delivery: preserve reports before removing the worktrees that hold them, and record closed, removed, and retained resources and blockers. Step 10 is rewritten: the Coordinator cleans up itself as soon as reuse ends, with rules for workers, worktrees, and Herdr workspaces or tabs. The safety rules are unchanged in substance, there is no worker cleanup handoff, and the workflow completes once all resources are released or reported as blockers. |
| `.agents/agents/coordinator.md` | Delegation: Herdr is also used to close worker panes. Boundaries: cleanup is the Coordinator's own duty and is not delegated. The do-not-implement/integrate/merge boundary is unchanged. Completion: the cleanup handoff and delegated-closure text is replaced with prompt release rules for panes, worktrees, and workspaces or tabs, plus safety rules and the completion condition. The Coordinator never closes its own pane; a launching parent closes a temporary Coordinator's pane. The CURRENT/TASK_LOGS paragraph also records what was closed and removed, and any exceptions. |
| `docs/SCHEMA.md` | Line 76: final worktree removal becomes prompt Coordinator release. Line 80: the workflow summary changes to match, and the cleanup-handoff sentence is replaced by "No worker cleanup handoff is required", with the Coordinator recording cleanup in its CURRENT/TASK_LOGS record. |

The other role files (`architect`, `implementer`, `reviewer`, `scout`) and `ruach-handoff` mention no cleanup handoff or worktree-removal duty, so they are unchanged. `implementer.md:26` "Do not perform unrelated cleanup" is about code scope. I did not edit CURRENT, TASK_LOGS, historical mailbox reports, code, or tests.

## Remaining matches after the search

Current guidance with unrelated meanings:

- `implementer.md:26` and `ruach-simplification/SKILL.md:34`: unrelated code cleanup.
- `docs/mailbox/README.md:7`: mailbox reports must not be deleted during cleanup. This is still valid.
- ruach-herdr private temp-dir caller cleanup (`SKILL.md:48`, `references/adapters.md:43`, `scripts/worker.ts:104,111`). See discoveries.
- Process or fixture cleanup in code: `native-codex.ts`, `harness-eval` `config.md:40` and `acceptance.ts:206`, and `scripts/test-agent-routing.py:33`.
- Other "close" matches: game-design "Close" link classification (lexicon, plans, prototypes, POC code), socket/WebSocket close in tests, the YAML closing delimiter, and "closely" in ADR-0003:29.

Historical only:

- `docs/CURRENT.md:83`, `docs/TASK_LOGS.md` (for example 426–437 and 704), and the delivered P03 plan line 11.
- 39 historical files under `docs/mailbox/*/*`, including `agent-artifact-conventions/cleanup.md` and `p03-command-boundary/cleanup.md`, plus this task's own assignment.

## R1

The R1 [assignment](assignment-implementer-r1.md) accepted the ruach-herdr discovery. The candidate is `f2aa62c`.

| File | Change |
| --- | --- |
| `.agents/skills/ruach-workflow-feature/SKILL.md` | Step 10 worker rule: closing a worker's pane also removes the private temporary directory reported by its launch result (`temporary_directory`), if non-null. |
| `.agents/agents/coordinator.md` | Completion worker rule: the same clause. |

There are no other changes.
