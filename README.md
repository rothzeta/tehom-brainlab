# TEHOM Brainlab

A collection of small, independent experiments for TEHOM. Each prototype tests a combat or game-design question; this repository is not the production game engine.

## Layout

```text
tehom-brainlab/
├── .agents/                     # Repository-owned agent resources
│   ├── agents/                 # Canonical role definitions
│   ├── skills/                 # Canonical skills and workflows
│   └── scratch/                # Ignored working files; README retained
├── docs/                        # Obsidian vault: decisions, plans, state, and evidence
│   └── mailbox/                # Durable worker reports
├── assets/                      # Reusable art/audio and asset provenance
├── shared/                      # Reusable code only when reuse is demonstrated
├── justfile                     # Repository CLI orchestration
├── scripts/                     # Repository script implementations
├── bin/                         # Executable CLI entry points
├── tools/                       # Supporting utility resources
└── poc-001-linked-formation/     # First independent combat experiment
```

Each prototype lives directly under the repository root, named `poc-NNN-short-name/`. Its dependencies, source code, configuration, tests, and eventual run instructions belong inside that folder. There is no root application or mandatory package workspace.

## Prototype index

| Prototype | Question | Status |
|---|---|---|
| [001 — Linked formation](poc-001-linked-formation/README.md) | Do rotation and expansion create interesting combat decisions without useless character turns? | Brief and folders only; not playable |

The initial implementation target for POC 001 is TypeScript + Phaser + Vite + Vitest. This does not commit other prototypes, or the production game, to that stack. No dependency versions have been selected or installed yet.

Use Bun by default for JavaScript/TypeScript runtime and dependency management, with a local `bun.lock` per prototype. Prefer Docker for dependency isolation and reproducible tooling where useful. Keep prototype-specific container configuration, scripts, and executables inside that prototype.

Run `just` to list repository commands and `just doctor` to inspect available tooling. The root justfile delegates to implementations in `scripts/` through executable entry points in `bin/`. `just export-tokens` runs the existing optional PNG exporter; see the [asset instructions](assets/README.md). Prototype install, run, test, and build recipes will be added with P01's scaffold.

The root `.agents/`, `bin/`, and `scripts/` folders are mandatory. [ADR-0005](docs/adr/0005-repository-management-and-tooling.md) defines their roles and just's repository management and tooling aggregation contract.

Agent instructions start in [AGENTS.md](AGENTS.md); [CLAUDE.md](CLAUDE.md) imports that canonical file. [Agent resources](.agents/README.md) include portable roles and workflows, durable reports, and local scratch space. See [SCHEMA](docs/SCHEMA.md#agent-work-artifacts) for artifact conventions. [Claude Code](docs/TASK_LOGS.md#2026-10-03-claude-architect-injection-experiment) and [Codex](docs/TASK_LOGS.md#2026-10-03-codex-architect-injection-and-native-skill-discovery) launch experiments verified bounded Architect tasks without native agent definitions. A [parallel Coordinator trial](docs/mailbox/orchestrator-comparison/results.md) then delivered the same small CLI feature on isolated experiment branches: Claude invoked the feature workflow natively through a temporary skill adapter, and Codex read its canonical file. Both delegated implementation, checks, review, and merging, with recorded role/context deviations. No persistent harness configuration is installed, and the test feature is not merged into this checkout.

## Working rules

- Keep experiments independent. Do not import combat rules from another prototype merely to avoid duplication.
- Put shared documentation in [`docs/`](docs/README.md), reusable assets in [`assets/`](assets/README.md), and prototype-specific rules inside the prototype.
- Promote code into `shared/` only after at least two prototypes genuinely need the same behavior. Do not build a generic engine in advance.
- Keep simulation separate from rendering. Previews and committed actions must use the same rules.
- Record hypotheses separately from observations. A proposed mechanic is not a playtest result.
- Start with labelled shapes; visual clarity matters before final art.

## Start here

Open [`docs/`](docs/README.md) as an Obsidian vault. Its [schema](docs/SCHEMA.md) defines the structure; [CURRENT](docs/CURRENT.md) summarizes implementation facts and [TASK_LOGS](docs/TASK_LOGS.md) records executed work.

Read the [POC 001 brief](docs/prototypes/poc-001-linked-formation.md), the [direction ADR](docs/adr/0004-repository-and-poc-direction.md), and the [asset register](assets/manifest.json).

There is no runnable application yet. The repository contains structure, design documentation, CLI tooling, and portable agent resources.

The follow-up [four-harness Coordinator trial](docs/mailbox/orchestrator-four-harness/results.md) compares Claude, Codex, OMP with Sonnet 5, and Agy with Gemini 3.8 Flash using the same canonical workflow and a durable worker-handoff contract. Its report separates delivery acceptance from role-boundary and lifecycle findings.
