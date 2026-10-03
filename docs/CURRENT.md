# Current state

As of 2026-10-03. Repository inspected at `784be4c0e22ae3c07ab9cea3df333a7ebafd0c3d` with user edits to Coordinator and Architect. The [agent artifact conventions record](TASK_LOGS.md#2026-10-03-agent-artifact-conventions) documents the subsequent role and documentation updates. The [portable agent baseline record](TASK_LOGS.md#2026-10-03-portable-agent-baseline) documents the original definitions and verification.

## Delivered repository

Brainlab contains independent prototype folders, the POC 001 design brief, shared assets and provenance, repository CLI tooling, and twelve draft implementation plans. POC 001 has no package manifest, dependency lockfile, runnable application, or executable test suite. Dependencies and versions have not been selected.

The root justfile exposes repository tooling inspection and the optional token exporter. Prototype application recipes are planned under P01 and later slices; they are not available yet. The [asset import record](exploitation/asset-import-001.md) retains its original scope and verification provenance; that verification was not rerun during this vault change.

## Direction and planned work

[ADR-0004](adr/0004-repository-and-poc-direction.md) preserves agreed repository and experiment constraints. Bun is the default JavaScript/TypeScript runtime and package manager; POC 001 retains TypeScript, Phaser, Vite, and Vitest. Prefer Docker where useful and expose CLI work through thin just recipes.

[ADR-0005](adr/0005-repository-management-and-tooling.md) establishes mandatory repository-root `.agents/`, `bin/`, and `scripts/` folders and formalizes just as the repository management and tooling aggregation surface. The existing folders and command implementations remain in place. See its [task log entry](TASK_LOGS.md#2026-10-03-repository-tooling-adr) for verification.

[AGENTS.md](../AGENTS.md) is the canonical portable instruction entry point; [CLAUDE.md](../CLAUDE.md) contains only `@AGENTS.md`. Five roles live in `.agents/agents/`, and three skills live in `.agents/skills/`. No harness-specific agents or integrations have been configured. The next intended experiment is to inject the portable Architect role into Claude Code and verify instruction loading, skill visibility, and role behavior; that experiment has not run.

Durable worker reports belong in [docs/mailbox/](mailbox/README.md); local working files belong in [.agents/scratch/](../.agents/scratch/README.md), ignored except its README. The [schema](SCHEMA.md#agent-work-artifacts) defines naming, ownership, report fields, and promotion into canonical vault notes. Coordinator follows the selected workflow, uses Herdr for communication, and delegates technical work. Architect writes designs and plans without implementing; Scout writes evidence-based investigation reports. These are configured responsibilities, with runtime behavior still untested. The five roles and three remaining skills have been discussed and their agreed changes are reflected in the definitions. Runtime role behavior remains to be tested.

The [P01–P12 sequence](plans/README.md) is proposed work. P01–P04 target an interactive formation lab; subsequent slices target deterministic patrol combat, accurate previews, a playable patrol, and reproducible evidence. The boss remains gated on the patrol review. No implementation plan has been completed.

Only the Coordinator receives and executes workflows; workers receive role definitions and self-contained assignments. Verification requirements and exceptions are supplied in those assignments. See the [workflow context boundary record](TASK_LOGS.md#2026-10-03-workflow-context-boundary).

Implementer owns test creation and updates by default, with assignment exceptions for tasks that must preserve existing tests. Its reports identify verification commands, outcomes, and unverified work. Test assertions follow [ADR-0006](adr/0006-contract-invariants-and-black-box-testing.md). See the [Implementer role record](TASK_LOGS.md#2026-10-03-implementer-test-ownership).

All three custom skills use the `ruach-` prefix: `ruach-testing`, `ruach-simplification`, and `ruach-workflow-feature`. [ruach-testing](../.agents/skills/ruach-testing/SKILL.md) combines contract-based black-box test design, regression coverage, assignment restrictions, and verification handoffs. Separate regression or framework-specific skills have not been added. See the [Ruach skills record](TASK_LOGS.md#2026-10-03-ruach-skill-names-and-testing) for the original renames.

`ruach-testing` now contains its essential instructions and two inline contract examples without depending on repository files. Root guidance connects it to the repository's testing ADR, which remains in `docs/adr/`. A copied skill directory passed format validation and a check for external file dependencies; agent behavior remains untested. See the [self-contained testing skill record](TASK_LOGS.md#2026-10-03-self-contained-testing-skill).

[ruach-simplification](../.agents/skills/ruach-simplification/SKILL.md) now includes a bounded procedure, role-specific editing permissions, preservation of behavior and regression coverage, and an evidence-based handoff. It remains self-contained. See the [simplification skill record](TASK_LOGS.md#2026-10-03-simplification-procedure).

The redundant standalone review skill was removed. Coordinator owns review-assignment guidance, Reviewer owns inspection and reporting, and [ruach-workflow-feature](../.agents/skills/ruach-workflow-feature/SKILL.md) contains the review trigger, blocking-finding fix loop, re-review, and completion conditions. See the [review consolidation record](TASK_LOGS.md#2026-10-03-review-workflow-consolidation).

[ruach-workflow-feature](../.agents/skills/ruach-workflow-feature/SKILL.md) now covers generic feature delivery through worker-owned integration and merging. Scout and Architect remain optional; technical plan updates belong to Architect when needed. An assigned Implementer combines changes, workers verify the combined revision, Reviewer reviews it, and the assigned Implementer merges into the agreed destination. Destination changes or conflict resolutions return to relevant verification and review. Coordinator orchestrates these tasks without performing them. More specific implementation workflows remain future work. See the [feature delivery workflow record](TASK_LOGS.md#2026-10-03-generic-feature-integration-and-merging).

The revised portable baseline includes the agreed role boundaries, three Ruach skills, and durable mailbox inside the vault. The [baseline consistency record](TASK_LOGS.md#2026-10-03-revised-portable-baseline) records the final checks. Claude Code `2.1.288` is installed; harness injection has not yet been exercised.

## Verification and limits

The [vault alignment task log](TASK_LOGS.md#2026-10-03-vault-alignment) records documentation changes and executed checks. No application tests, browser combat checks, or human playtests were performed in this task. [Playtests](playtests/README.md) currently contains navigation and a template only.
