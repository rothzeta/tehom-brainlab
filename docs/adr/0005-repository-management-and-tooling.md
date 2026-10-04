# ADR-0005 — Mandatory repository folders and just tooling aggregation

Status: accepted by user instruction, 2026-10-03; amended by user decision, 2026-10-04 (see Amendments).

## Decision

Every Brainlab checkout must contain these repository-root folders:

| Folder | Responsibility |
| --- | --- |
| `.agents/` | Repository-owned agent resources, such as skills, reusable prompts, and workflow support; root `AGENTS.md` remains the working-guidance entry point |
| `bin/` | Executable CLI entry points that delegate to script implementations |
| `scripts/` | Implementations of repository management and tooling commands |

Keep required folders represented in Git with useful content, a README, or a placeholder when otherwise empty. Keep prototype-specific scripts and entry points in the owning prototype's `scripts/` and `bin/`; root folders own repository-wide behavior. `tools/` remains available for supporting utility resources.

Within `.agents/`, `agents/` and `skills/` contain canonical role and skill definitions. `scratch/` contains local working artifacts ignored by Git, with its README retained to represent the directory in checkouts. Durable worker reports belong in `docs/mailbox/` and are included in Git with the related work. Canonical shared designs and plans also remain in `docs/`. Naming, report content, ownership, and artifact lifetimes follow [SCHEMA](../SCHEMA.md#agent-work-artifacts).

Use the root `justfile` as the common command surface for repository management and tooling aggregation. Expose contributor-facing commands there, including environment inspection, asset workflows, and prototype installation, development, checks, builds, and container tooling as those capabilities are implemented. Aggregate commands without centralizing prototype dependencies or introducing a root application or mandatory package workspace.

Recipes stay thin: delegate command logic to executable entry points and scripts. Entry points resolve their implementation paths explicitly and preserve argument boundaries and exit codes. Scripts choose the appropriate working directory and report missing prerequisites as failures. Keep dependency installation and runtime configuration with their owning prototype, following the existing Bun and Docker direction in [ADR-0004](0004-repository-and-poc-direction.md).

Run recipes from the repository root. `just` lists available commands through its default recipe; `just --list` provides explicit discovery. Use a prototype prefix such as `poc-001-` for aggregated prototype commands. Add recipes only when their implementations exist; documentation must distinguish proposed commands from runnable ones.

## Rationale

Mandatory folder roles make agent resources, command entry points, and implementation logic easy to locate. One discoverable justfile lets contributors use repository tooling consistently while each prototype retains its own technology and dependencies.

## Consequences

New repository tooling follows the `justfile` → `bin/` → `scripts/` convention. Prototype recipes route to prototype-owned implementations. Update relevant READMEs when commands or prerequisites change, and verify changed commands with focused checks that exercise their argument handling and failures where relevant.

Existing `doctor` and `export-tokens` recipes illustrate the convention. This ADR formalizes the mandatory folders and tooling aggregation, extending the earlier CLI decision without implementing the planned prototype recipes. Record actual work in [TASK_LOGS](../TASK_LOGS.md) and summarize current facts in [CURRENT](../CURRENT.md).

## Amendments

**2026-10-04, user decision: `.agents/scratch/` is retired.** The `scratch/` provision above no longer applies; the folder, its README, and its ignore rule are removed. Disposable working files live outside the repository, in the OS temporary directory or the harness's session scratch. Durable findings, worker reports, and Coordinator assignments go to `docs/mailbox/`. See [SCHEMA agent work artifacts](../SCHEMA.md#agent-work-artifacts).


**2026-10-04, authorized Ruach extraction: shared sources move upstream.** The canonical-role/skill provision above is superseded: `.agents/agents/` and `.agents/skills/` are now a generated pinned Ruach installation. The shared source repository owns roles, skills, workflows, handoff contracts, adapters and their tests. Brainlab retains this project ADR, its knowledge schema, model/route preferences, launcher wrapper, plans and task evidence. [Snapshot metadata](../../.agents/ruach.json) records upstream origin, revision and file hashes; `just sync-ruach --source DIR --revision SHA` updates explicitly and `just check-ruach` verifies local integrity without a sibling dependency. Global skill discovery is separate deployment state, not canonical source ownership. See [Brainlab agent policy](../../.agents/policy.md).
