# Durable agent reports

Write durable investigation findings, review reports, and worker handoffs here. Include reports in Git with the related work.

Use `<task-id>/<role>.md`, adding a worker identifier when several workers share a role on the task. Each worker owns its report. Return a concise handoff with the report path to the requesting agent.

Follow [SCHEMA](../SCHEMA.md#agent-work-artifacts) for artifact conventions and [ruach-handoff](../../.agents/skills/ruach-handoff/SKILL.md) for the canonical reporting protocol. Link canonical designs and plans in `docs/` and record executed work in [TASK_LOGS](../TASK_LOGS.md).

Experiment evidence: [parallel Claude/Codex Coordinator trial](orchestrator-comparison/results.md) and [four-harness follow-up](orchestrator-four-harness/results.md). Each separates role and workflow observations from independent delivery acceptance.
