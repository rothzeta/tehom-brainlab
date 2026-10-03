# Parallel Coordinator trial — results

Task: `orchestrator-comparison`; author/role: parent experiment observer; date: 2026-10-03; status: `complete`.

## Outcome

Both Coordinators selected and loaded `ruach-workflow-feature` without its name or an explicit skill invocation in the submitted feature brief. Both delivered the same `repo-root` CLI contract in separate worktrees, using Herdr Implementer and independent Reviewer workers. Both delivered revisions passed the observer's identical acceptance probes and their own test suites. This establishes workflow use in one bounded trial per harness, with the role/context deviations below; it does not establish perfect Coordinator compliance or general reliability.

See the [assignment](assignment.md) for the exact shared brief and controls, and [acceptance evidence](acceptance.json) for tested revisions, outputs, exit codes, and test results. Feature changes remain on the experiment branches; they were not merged into the main checkout.

## Workflow and role observations

| Check | Claude | Codex |
| --- | --- | --- |
| Workflow selection | Selected `ruach-workflow-feature` without its name in the brief | Same |
| Body loading | Native `Skill` call with `{"skill":"ruach-workflow-feature"}`; returned successfully | First shell read included `.agents/skills/ruach-workflow-feature/SKILL.md`; Coordinator reported direct-file loading |
| Optional investigation/design | Skipped Scout and Architect for the fully specified task | Same |
| Implementation and integration | Delegated to Implementer; candidate revision identified before review | Same |
| Combined verification | Worker evidence and independent Reviewer suite/probes on `96ea6af` | Worker evidence and independent Reviewer suite/probes on `af6d0b7` |
| Independent review | Separate Reviewer, no blocking findings, four optional notes | Separate Reviewer, no material findings |
| Merge | Implementer fast-forwarded its destination after review | Implementer fast-forwarded its destination, then committed delivery evidence |
| Production edits/tests/merge by Coordinator | No such tool calls observed | No such tool calls observed |
| Direct delivery validation by Coordinator | Ran Git ref/status checks itself; partial boundary failure | No direct Git/source/test delivery validation observed; relied on worker handoffs |
| Worker workflow context | No workflow body in assignments or observed workflow reads/invocations | Same; per-session workflow exclusion also supplied by launcher |
| Durable delivery evidence | Implementation/review reports committed, but final merge handoff only in terminal | Implementation/review/Coordinator reports and final merge evidence committed |
| Small Coordinator context | Short worker terminal reads, but repeated reads to recover handoff headings | Broad initial context reads and repeated worker-progress sampling; improvement needed |

The source Coordinator SHA-256 is `53abb258249d2f792eee3afd8588b931868230d111792d9670284b91b62ba99d`; workflow SHA-256 is `8ac6428b30addc14ffaad7aed9596638574114286191e6d6e7e58e541c0bcf22`. Both worktrees retained those exact canonical sources. Claude's additional-directory symlink adapter made the workflow available to the native Skill tool; Codex used its canonical file directly. These are different loading mechanisms for the same body, not a comparison of two different workflow definitions.

Workers received role, task, file scope, acceptance conditions, verification instructions, workspace/branch context, restrictions, and structured handoff/report requirements. Reviewer assignments identified the exact candidate and did not include the Implementer's reasoning transcript. Each run used sequential worker ownership inside its own worktree while the two runs proceeded concurrently. No startup approval/question dialog appeared. Bounded sandbox approvals handled Herdr access, shared Git metadata, and Codex scratch fixtures without bypass modes.

## Revisions and artifacts

| Revision | Claude | Codex |
| --- | --- | --- |
| Source | `ccd0668c25af53d72a55c2148311b122d64ae036` | Same |
| Implementation | `d10b6cdfd992ba1223ed3a3365fbacd0a1218065` | `0b224052b1ef5d16022f0f741a180568d4a956bd` |
| Combined reviewed/tested candidate | `96ea6affa079034a2e483a607ff7320117a7717c` | `af6d0b7728522486bf0788f40139779423315a6b` |
| Merge candidate | `7a329126bc8b4730e50634f383059962cd360103` | `1eb51d127e767ed16c7aacbf67f1875b49f14f79` |
| Final delivered and observer-tested revision | `7a329126bc8b4730e50634f383059962cd360103` | `976d7e20739b0927ca3a42f12e56e95b343ff1f1` |
| Destination | `experiment/orch-claude-delivery` | `experiment/orch-codex-delivery` |
| Candidate branch | `orch-claude-repo-root/candidate` | `candidate/orch-codex-repo-root-20261003-7a4f9c2e` |
| Worktree | `/tmp/brainlab-orch-claude` | `/tmp/brainlab-orch-codex` |
| Coordinator | `orch-claude`, `w6P:p1` | `orch-codex`, `w6Q:p1` |
| Implementer | `oc-claude-impl`, `w6P:p2` | `oc-codex-implementer`, `w6Q:p2` |
| Reviewer | `oc-claude-review`, `w6P:p3` | `oc-codex-reviewer`, `w6Q:p3` |

The Claude post-review successor changes only TASK_LOGS and the Reviewer report. Codex post-review successors change only CURRENT, TASK_LOGS, and owned reports. Observer comparison confirmed command files, tests, recipe, and README are unchanged from each reviewed candidate. Thus technical review was reused for documentation-only successors; workers reran final checks. Neither destination advanced unexpectedly and neither merge required conflict resolution.

Reports are preserved in Git on their experiment branches:

- Claude: `docs/mailbox/orch-claude-repo-root/implementer.md` and `reviewer.md`, plus its TASK_LOGS entry. Recover with `git show 7a32912:docs/mailbox/orch-claude-repo-root/reviewer.md` or inspect the worktree. The permanent comparison here also preserves the previously terminal-only final delivery revision and merge result.
- Codex: `docs/mailbox/orch-codex-repo-root/implementer.md`, `reviewer.md`, and `coordinator.md`, plus its TASK_LOGS entries. Recover with `git show 976d7e2:docs/mailbox/orch-codex-repo-root/implementer.md` or inspect the worktree.

Claude session IDs: Coordinator `1d78e88d-c508-4a30-9e09-8c0fe58f9454`, Implementer `28d667d3-4e2d-4037-b85d-ecda382e3c26`, Reviewer `fe9501c5-091f-4614-a25a-0ad8e6345336`. Codex session IDs: Coordinator `01a103de-dff1-7d23-9541-c19b2a2d6e17`, Implementer `01a103e0-043d-7d01-a046-7b7ddc7d246b`, Reviewer `01a103e5-e4f8-72b0-8924-886fcc8e0e79`. Runtime pane IDs and temporary paths are inspection aids, not permanent launch configuration.

## Independent acceptance

The observer ran `python3 /tmp/brainlab-orchestrator-acceptance.py` once after both integration workers settled. Exit 0. For each exact delivered revision, seven identical subprocess probes passed: entry point from `/`, just recipe, single/multiple argument rejection, copied checkout layout with spaces from `/`, just in that layout, and argument rejection in that layout. Assertions checked exact root plus newline, empty successful stderr, nonzero usage failures, and empty failure stdout.

The same command also ran `python3 -B -m unittest discover -s scripts/tests -p 'test*.py' -v` in each worktree: Claude 5/5 and Codex 8/8, exit 0; no tests skipped. `git diff --check ccd0668 <delivered-revision>` passed for both. The copied space-path fixtures had the shipped command files and recipe but no Git metadata; they were removed afterward.

Observer Git checks confirmed both worktrees clean on their own delivery branches, the reviewed candidates included in delivery, and no source-to-delivery changes to AGENTS, CLAUDE, canonical agent resources, prototype files, assets, shared code, utilities, or existing doctor/exporter implementations. Main HEAD remained `ccd0668` throughout feature delivery. The observer did not merge either feature into main.

## Deviations and next refinements

1. **Claude directly checked delivery metadata.** Its Coordinator issued `git branch --show-current && git rev-parse HEAD && git status --short | head; ls docs/mailbox/orch-claude-repo-root` after the worker merge handoff. This is a small but concrete departure from the instruction that the Coordinator does not validate the merge result itself. Its earlier candidate-ref checks also duplicated worker evidence. No direct production edit, test execution, diff review, integration, or merge was observed.
2. **Claude left final merge evidence transient.** Its merge assignment explicitly allowed the result only in the terminal handoff to avoid a post-delivery documentation commit. The implementation report still says not merged; the task log points to the handoff. A durable delivery report should record the checked delivery revision, with an evidence-only successor permitted when needed. This comparison now preserves the final observed outcome without altering the tested branch.
3. **Context minimization remains qualitative.** Codex's two initial context reads returned over 600 lines of role, workflow, Herdr, schema, CURRENT, and task-log material, then it repeatedly sampled worker terminal progress. Claude used shorter terminal reads but sometimes repeated them to recover the handoff heading. Prefer explicit bounded progress/completion payloads and reading only the required report section. No context-budget threshold was assigned, so this is an improvement finding rather than a measured budget failure.
4. **Do not equate terminal convenience diffs with model source inspection.** Claude's terminal displayed file-change previews while worker commands ran in the shared run worktree. The observer initially interpreted those as a Coordinator source read. Recorded Coordinator tool inputs and model tool results did not substantiate that interpretation; the proven boundary issue is the direct Git metadata check above.

Claude's Reviewer left optional notes about an external symlink to the entry point, bytecode cleanup, a redundant executable-bit test, and physical-path output. None blocks the assigned contract; no optional fixes were requested. Codex's Reviewer returned no findings. Their different lists do not establish that either Reviewer is more reliable.

No remaining experiment blocker. No product implementation was merged into main, no dependencies installed, no persistent harness configuration or native agent files added, and no remote push performed. All six experiment panes were left available for inspection. A single ordinary feature trial does not exercise blocking-review fixes, destination movement, merge conflicts, missing worker evidence, Scout/Architect delegation, repeated runs, or hostile instructions. Default models differed; timings and context displays are not a controlled model-performance comparison. Technical-skill native invocation by Claude workers was not tested; the proven native invocation is the Coordinator workflow.
