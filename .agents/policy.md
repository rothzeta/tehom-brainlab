# Brainlab agent policy

This consumer policy supplements the generated Ruach roles and workflows. Brainlab owns its project decisions, documentation schema, catalogs, launcher wrapper and task evidence. Shared source ownership is recorded in the [project tooling ADR amendment](../docs/adr/0005-repository-management-and-tooling.md) and [snapshot metadata](ruach.json); shared definitions are authored upstream.

## Launch and route selection

Coordinators launch specialists with [ruach-herdr](skills/ruach-herdr/SKILL.md), or `just agent-routing start ROLE NAME [--route ROUTE] [--root WORKTREE]`. Use Herdr for monitoring, assignments, communication and pane cleanup. The root passes portable automatic approval review policy. Models, routes and preferences come only from `.agents/models.yaml`, `.agents/routing.yaml` and `.agents/roles.yaml`; the wrapper requires six roles, Claude/Codex harnesses, high effort and Claude-only Coordinator routes. Alternatives never trigger automatically.

- Launch each worker on its preferred route unless the user selects a declared alternative.
- Change routes only with explicit user approval, an applicable task-scoped instruction, or the low-allowance rule below. Do not switch for review diversity, speed or cost.
- When the preferred harness reports less than 2% of its subscription allowance remaining, the Coordinator may launch new workers on the role's declared alternative. Leave active workers on their route. Tell the user, quoting the reported figure, and record the switch in `docs/TASK_LOGS.md`.
- Otherwise, report the observed problem and propose the declared alternative. Do not infer exhaustion from low quota above that threshold, slow progress or lifecycle state alone. Continue unrelated authorized work while awaiting a decision; silence authorizes neither a switch nor repeated attempts.
- Follow the launcher's recovery contract. Before replacing a worker, confirm execution has ended and its workspace is free; preserve partial work for the replacement.

## Assignments, reports and knowledge

The Coordinator writes each self-contained assignment to `docs/mailbox/<task>/assignment-<role-or-worker>.md` in the worker's workspace, then sends it through Herdr after startup. Workers commit the unchanged assignment with their report. Follow [SCHEMA](../docs/SCHEMA.md#agent-work-artifacts) for durable report paths and ownership and [ruach-handoff](skills/ruach-handoff/SKILL.md) for reporting/validation. Disposable files belong outside the repository. Canonical designs, plans and knowledge stay in their established `docs/` locations.

Only the Coordinator edits `docs/CURRENT.md` and `docs/TASK_LOGS.md`, after acceptance and delivery, from worker handoffs. Link detailed reports and record exact execution, checks, cleanup and exceptions. Workers, including Librarians, return proposed protected-document corrections with sources to the Coordinator.

Mailbox assignments and reports are durable. Delivery and resource cleanup must not delete or fold them away. Librarian triage requires a bounded assignment naming document ownership, sources, canonical destinations and disposition permissions. Preserve unique evidence, unresolved findings, revision-specific checks and inbound references. Accepted decisions stay distinct from proposals and historical observations. Source removal is permitted only when explicitly assigned and all evidence and references are accounted for.

Only Coordinators load workflows. Use `ruach-workflow-feature` for engineering delivery and `ruach-workflow-knowledge` for bounded knowledge upkeep; workers receive self-contained assignments. Librarian prefers `gpt-6.1-sol-high`, with `claude-opus-5.5-high` as an explicit alternative, like the other documentation workers. A role's availability does not authorize running maintenance over the mailbox.

## Resource cleanup

The Coordinator closes task panes, private launch material, Herdr workspaces/tabs and temporary worktrees as soon as no concrete pending assignment needs them and durable work is preserved on retained branches. Never close the caller pane, remove the main checkout or discard uncommitted work or evidence. Record unsafe cleanup as a blocker. Global discovery links are separate deployment state; snapshot sync does not change them.
