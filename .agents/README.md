# Repository agent resources

Keep repository-owned skills, reusable prompts, and workflow support here. Working guidance starts in [AGENTS.md](../AGENTS.md).

This required folder follows [ADR-0005](../docs/adr/0005-repository-management-and-tooling.md). Portable role definitions live in `agents/`; skills and reusable workflows live in `skills/`. These are the canonical sources; harness integration has not been configured. Only the Coordinator loads and executes workflows; workers receive self-contained assignments.

Durable worker handoffs live in [docs/mailbox/](../docs/mailbox/README.md); local working files live in [scratch/](scratch/README.md). Follow [SCHEMA](../docs/SCHEMA.md#agent-work-artifacts) for artifact locations, naming, ownership, and report fields. Shared designs and plans remain in `docs/`.

## Custom skills

Use the `ruach-` prefix for every custom skill's directory and frontmatter name. Directory and name must match.

- [ruach-testing](skills/ruach-testing/SKILL.md): contract-based behavior tests and regression coverage.
- [ruach-simplification](skills/ruach-simplification/SKILL.md): reduce complexity while preserving required behavior.
- [ruach-workflow-feature](skills/ruach-workflow-feature/SKILL.md): Coordinator's generic feature workflow through integration, verification, review, and merging; Scout and Architect are optional.

Workers may use technical skills within their assignments; orchestration workflows remain Coordinator-only.
