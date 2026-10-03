# Current state

As of 2026-10-03. Repository inspected at `f849d5e9a436876b5e05eeeea102ded23648cc69` with a clean working tree before the portable agent baseline. The [portable agent baseline record](TASK_LOGS.md#2026-10-03-portable-agent-baseline) documents the new definitions and their verification.

## Delivered repository

Brainlab contains independent prototype folders, the POC 001 design brief, shared assets and provenance, repository CLI tooling, and twelve draft implementation plans. POC 001 has no package manifest, dependency lockfile, runnable application, or executable test suite. Dependencies and versions have not been selected.

The root justfile exposes repository tooling inspection and the optional token exporter. Prototype application recipes are planned under P01 and later slices; they are not available yet. The [asset import record](exploitation/asset-import-001.md) retains its original scope and verification provenance; that verification was not rerun during this vault change.

## Direction and planned work

[ADR-0004](adr/0004-repository-and-poc-direction.md) preserves agreed repository and experiment constraints. Bun is the default JavaScript/TypeScript runtime and package manager; POC 001 retains TypeScript, Phaser, Vite, and Vitest. Prefer Docker where useful and expose CLI work through thin just recipes.

[ADR-0005](adr/0005-repository-management-and-tooling.md) establishes mandatory repository-root `.agents/`, `bin/`, and `scripts/` folders and formalizes just as the repository management and tooling aggregation surface. The existing folders and command implementations remain in place. See its [task log entry](TASK_LOGS.md#2026-10-03-repository-tooling-adr) for verification.

[AGENTS.md](../AGENTS.md) is the canonical portable instruction entry point; [CLAUDE.md](../CLAUDE.md) contains only `@AGENTS.md`. Five roles live in `.agents/agents/`, and four skills live in `.agents/skills/`. No harness-specific agents or integrations have been configured. The next intended experiment is to inject the portable Architect role into Claude Code and verify instruction loading, skill visibility, and role behavior; that experiment has not run.

The [P01–P12 sequence](plans/README.md) is proposed work. P01–P04 target an interactive formation lab; subsequent slices target deterministic patrol combat, accurate previews, a playable patrol, and reproducible evidence. The boss remains gated on the patrol review. No implementation plan has been completed.

## Verification and limits

The [vault alignment task log](TASK_LOGS.md#2026-10-03-vault-alignment) records documentation changes and executed checks. No application tests, browser combat checks, or human playtests were performed in this task. [Playtests](playtests/README.md) currently contains navigation and a template only.
