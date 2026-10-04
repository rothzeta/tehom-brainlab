---
name: ruach-workflow-feature
description: Coordinate a bounded feature through optional investigation and design, implementation, integration, verification, independent review, merging, and final worktree cleanup. Use as the generic feature workflow when no more specific workflow is assigned.
---

# Feature workflow

This is the generic feature workflow. Use a more specific workflow when one is assigned; keep this procedure sufficient for ordinary feature delivery.

Only the Coordinator loads and executes this workflow. It instantiates specialist workers with self-contained assignments; workers receive their role, task context, and instructions without receiving the workflow. Require [ruach-handoff](../ruach-handoff/SKILL.md) for every worker result, including integration and merging; give workers its canonical path and their owned report path. Workers write durable reports in `docs/mailbox/` using [SCHEMA](../../../docs/SCHEMA.md#agent-work-artifacts) and keep intermediate files in `.agents/scratch/`. Canonical designs and plans stay in `docs/`. Launch workers with [ruach-herdr](../ruach-herdr/SKILL.md). Each responsible worker must run ruach-handoff's `scripts/validate.ts` on its own report before handoff; the Coordinator collects that evidence without running checks itself.

## 1. Understand

Establish:

- desired outcome;
- scope;
- relevant constraints;
- acceptance conditions;
- integration and destination branches or workspaces, delivery expectations, and any restrictions on committing or merging.

Resolve delivery details from the assignment, established project conventions, and session context. Ask for a missing destination or decision only when it prevents the next action.

Scout and Architect are optional. Assign investigation to a Scout when missing information prevents a bounded assignment. Assign design and planning artifacts to an Architect when architectural judgment is needed. Architect never performs implementation work.

Do not repeat existing specification or design work when it is already adequate.

## 2. Plan

Use existing plans and concise specialist handoffs to identify bounded implementation tasks, dependencies, and ownership. Assign required technical design or plan writing to an Architect.

Choose an Implementer to own integration and merging; the same worker may implement the feature. Specify the changes to combine, destination, and required checks.

Track task-created panes and task-created or task-assigned temporary worktrees, including any temporary Coordinator or delivery checkout, and identify a retained checkout from which final cleanup can run.

Run independent tasks concurrently when useful, with explicit file ownership and isolated workspaces or worktrees where needed to prevent conflicting edits.

## 3. Implement

Assign implementation tasks to Implementers.

Each worker must receive:

- task identifier and assigned role;
- assigned scope and file ownership;
- workspace or worktree, source branch, and expected revision handoff where applicable;
- relevant context;
- acceptance conditions;
- verification instructions and restrictions, including any exception to default test ownership;
- expected handoff and durable report path.

Record discoveries that affect other work.

## 4. Adapt

If implementation reveals that the current plan is wrong or incomplete:

- stop the affected work;
- assign required technical design or plan updates to an Architect and revise assignments from its concise handoff;
- propagate the discovery to affected workers.

Escalate changes to the requested product scope.

## 5. Integrate

After dependent workers report their assigned checks and changes ready, assign the integration Implementer to combine the specified changes in dependency order on the integration branch or workspace. When all work already shares one workspace, assign the worker to confirm the complete feature and identify its combined revision.

The worker resolves merge conflicts within the assigned scope, reports discoveries that affect behavior or design, and returns the source revisions, combined revision, conflict resolutions, and blockers. Route design changes through the adaptation step. Coordinator does not inspect diffs, resolve conflicts, or integrate changes itself.

## 6. Verify

Assign the project's relevant checks and acceptance verification on the combined feature to the integration Implementer or another verification worker. Collect the exact tested revision, commands, results, and acceptance evidence. Individual worker checks do not establish that the combined feature works. Coordinator does not run checks or validate artifacts itself.

A worker saying that the task is complete is not verification.

## 7. Review

After required checks on the combined revision succeed, assign an independent Reviewer to that revision. If the task explicitly excludes review, record that exception in the completion report.

1. Give the Reviewer the exact change and revision, acceptance conditions, verification instructions, and report path using the Coordinator's review-assignment guidance.
2. Collect the review summary, blocking and optional findings, verification results, and durable report reference. Missing findings do not establish that verification passed.
3. Return blocking findings to the responsible Implementer as bounded fixes. Require relevant verification results and the updated revision in the handoff. Route fixes through the integration and combined-verification steps before re-review.
4. Assign re-review of blocking fixes and materially changed behavior, contracts, or tests on the updated revision. Repeat while resolvable blocking findings remain; report a blocker when resolution needs a decision or exceeds the assignment.
5. Advance only when the Reviewer reports no outstanding blocking findings and the required checks have reported successful results for the reviewed revision. Optional improvements do not block completion unless required by the acceptance conditions.

## 8. Merge

Once required verification and review are satisfied, assign the integration Implementer to merge the accepted combined revision into the agreed destination using project conventions and the assignment's permissions.

Have the worker confirm the destination has not advanced since the candidate was prepared. If it has advanced, or merging requires conflict resolution or other changes to the candidate, refresh integration and repeat relevant verification and review before delivery.

Require a merge handoff identifying the reviewed candidate, destination branch, final revision, and merge outcome. The worker confirms the delivered result contains the accepted changes and reports its relation to the verified candidate. Reuse verification evidence when the delivered content is unchanged; rerun relevant checks and re-review material changes. Coordinator does not perform the merge or validate its result. Remote push, publication, and deployment require an explicit assignment.

## 9. Record delivery

Preserve the delivery summary and required durable reports in commits reachable from retained branches before removing any worktree. Record:

- implemented work;
- integration and merge outcome, destination, and final revision;
- verification actually performed and the tested revision;
- review findings and disposition;
- important discoveries or decisions;
- remaining issues;
- durable report and canonical artifact references.

## 10. Clean up

Cleanup is the final required step before reporting the workflow complete. Assign the integration Implementer to remove every completed task-owned temporary worktree with `git worktree remove`, including temporary Coordinator and delivery worktrees. Preserve the main checkout, retained destination checkout, unrelated worktrees, and branches containing delivered changes or evidence.

Close task-created worker and temporary Coordinator panes through Herdr after their final durable handoffs are committed, before removing the worktrees they use. Preserve the original caller pane and unrelated sessions. Arrange for the launching parent to close the cleanup worker's pane and any remaining temporary Coordinator pane after the final handoff; an agent must not close itself before returning that handoff.

Run worktree cleanup from the retained checkout outside the paths being removed. Preserve useful scratch evidence in durable reports first; disposable task scratch and installed dependencies may then be discarded. Do not discard uncommitted work or unresolved evidence to satisfy cleanup. Preserve affected worktrees and report a cleanup blocker if removal is unsafe or fails.

Require a cleanup handoff listing closed and retained panes, removed and retained worktrees, reasons for any exceptions or parent-owned final closures, and preserved delivery/report revisions. Store its durable report in the retained checkout, validate it through ruach-handoff, and commit it before returning. Base the final completion response on that handoff and the parent's final pane closures; a successful merge alone does not complete the workflow.
