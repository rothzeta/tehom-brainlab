# Agent Instructions

This repository uses portable agent definitions and Agent Skills.

## Portable configuration

- Agent roles live in `.agents/agents/`.
- Skills and reusable workflows live in `.agents/skills/`.
- Do not duplicate role or skill definitions in harness-specific files unless generated from these canonical sources.

## General engineering rules

- Inspect the relevant existing code before proposing or making changes.
- Prefer the simplest implementation that satisfies the requested behavior.
- Do not broaden scope without explicit justification.
- Preserve existing behavior unless the task requires changing it.
- Verification must test observable behavior rather than implementation details where practical.
- Do not claim verification succeeded unless the relevant checks were actually executed successfully.

## Agent roles

Available role definitions:

- `coordinator`
- `architect`
- `scout`
- `implementer`
- `reviewer`

When a role is explicitly assigned, follow its definition in `.agents/agents/<role>.md`.
