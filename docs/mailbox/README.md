# Durable agent reports

Write Coordinator assignments, durable investigation findings, review reports, and worker handoffs here. Include reports in Git with the related work.

Use `<task-id>/<role>.md`, adding a worker identifier when several workers share a role on the task. Each worker owns its report. The Coordinator writes each worker assignment as `<task-id>/assignment-<role-or-worker>.md` in the worker's workspace; the worker commits it unchanged with its report. Return a concise handoff with the report path to the requesting agent.

Commit only content meant to be read later: no raw dumps, secrets, or credentials. Reports are durable until an assigned Librarian triages them under explicit source-disposition permissions, preserving unique evidence and inbound references; delivery and cleanup must not delete or fold them away.

Follow [SCHEMA](../SCHEMA.md#agent-work-artifacts) for artifact conventions and [ruach-handoff](../../.agents/skills/ruach-handoff/SKILL.md) for the canonical reporting protocol. Link canonical designs and plans in `docs/`. Workers do not edit [CURRENT](../CURRENT.md) or [TASK_LOGS](../TASK_LOGS.md); the Coordinator updates them from these reports after acceptance and delivery.

Experiment evidence: [parallel Claude/Codex Coordinator trial](orchestrator-comparison/results.md) and [four-harness follow-up](orchestrator-four-harness/results.md). Each separates role and workflow observations from independent delivery acceptance.

Pre-contract reports: the [Claude](claude-architect-injection/architect.md) and [Codex](codex-architect-injection/architect.md) architect-injection reports, the `orchestrator-comparison/` and `orchestrator-four-harness/` Markdown files, and this README start with headings and fail the handoff validator with `HEADER_INVALID`. The six `p01-browser-harness/` reports and the `versioned-agent-skills/architect.md` report pass, including legacy narrative mappings. Leave these historical documents intact.
