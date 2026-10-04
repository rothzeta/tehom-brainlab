# Agent Instructions

This repository uses portable agent definitions and Agent Skills.

## Portable configuration

- Shared roles in `.agents/agents/` and skills/workflows in `.agents/skills/` are a generated pinned Ruach snapshot, recorded in `.agents/ruach.json`. Author shared changes in Ruach and sync explicitly; do not edit generated copies. See `.agents/README.md` for install/check commands.
- Read [Brainlab agent policy](.agents/policy.md) for this consumer's launch, route, report and protected-document rules. These supplement the shared roles and workflows.
- All custom skill directory and frontmatter names use the `ruach-` prefix.
- Only the Coordinator loads and executes workflows. Workers follow their role and the self-contained assignment supplied by the Coordinator.
- Coordinator assignments and durable agent reports live in `docs/mailbox/` until assigned Librarian triage; source disposition requires explicit assignment authority and preservation of unique evidence and references. Disposable working files stay outside the repository, in the OS temporary directory or the harness's session scratch. Only the Coordinator edits `docs/CURRENT.md` and `docs/TASK_LOGS.md`. Follow the artifact conventions in `docs/SCHEMA.md`.
- Do not duplicate role or skill definitions in harness-specific files unless generated from the pinned shared sources.

## General engineering rules

- Inspect the relevant existing code before proposing or making technical changes, within your assigned role's boundaries.
- Prefer the simplest implementation that satisfies the requested behavior.
- Do not broaden scope without explicit justification.
- Preserve existing behavior unless the task requires changing it.
- Verification must test observable behavior rather than implementation details where practical.
- Repository testing follows [ADR-0006](docs/adr/0006-contract-invariants-and-black-box-testing.md); [ruach-testing](.agents/skills/ruach-testing/SKILL.md) provides reusable practical guidance.
- Do not claim verification succeeded unless the relevant checks were actually executed successfully.

## Agent roles

Available role definitions:

- `coordinator`
- `architect`
- `scout`
- `implementer`
- `reviewer`
- `librarian`

When a role is explicitly assigned, follow its definition in `.agents/agents/<role>.md`.
