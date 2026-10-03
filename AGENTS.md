# Working in TEHOM Brainlab

## Repository structure

- Each prototype is a direct child of the repository root: `poc-NNN-short-name/`.
- Shared documentation belongs in `docs/`, reusable art/audio in `assets/`, and demonstrated reusable code in `shared/`.
- Keep mandatory repository-root `.agents/`, `bin/`, and `scripts/` folders represented in Git. Follow `docs/adr/0005-repository-management-and-tooling.md` for their roles and the root justfile's repository management and tooling aggregation contract.
- Use the root `justfile` to orchestrate repository CLI commands. Put script implementations in `scripts/` and executable entry points in `bin/`; keep prototype-specific scripts and executables inside the owning prototype's `scripts/` and `bin/` directories. Reserve `tools/` for supporting utility resources.
- Keep dependencies, configuration, source, tests, and run instructions inside the owning prototype. Do not introduce a root application or mandatory workspace without a concrete need.
- Do not couple experiments through a premature shared combat engine. Different prototypes must be allowed to disagree about rules and technology.

## Documentation vault

- `docs/` is an Obsidian vault. Read `docs/README.md` and `docs/SCHEMA.md` for navigation and note roles.
- Keep the common `lexicon/`, `adr/`, `plans/`, and `exploitation/` structure, with `README.md`, `SCHEMA.md`, `CURRENT.md`, and `TASK_LOGS.md` at the vault root. Prototype briefs and playtests extend it in `prototypes/` and `playtests/`.
- Follow `docs/adr/0002-plan-filenames.md` for plan and standalone task filenames and `docs/adr/0003-implementation-plan-writing.md` for bounded format, ownership, acceptance criteria, and verification. Preserve existing compliant filenames and stable task/checkpoint identifiers.
- Record actual execution and exact checks in dated `docs/TASK_LOGS.md` entries; update `docs/CURRENT.md` when facts change. Link detailed playtest observations rather than duplicating them. Use relative Markdown links and update references when moving notes.

## Development tooling

- Default to Bun for JavaScript/TypeScript runtime and dependency management. Keep a committed `bun.lock` in each owning prototype; use frozen-lockfile installs for reproducible verification. Keep Vitest as POC 001's test runner.
- Prefer Docker where it supplies useful dependency isolation or reproducible tooling. Keep prototype Docker configuration local to that prototype, pin selected runtime/image versions when scaffolding, and expose container commands through just recipes.
- Keep just recipes thin: delegate command logic to scripts and executable entry points. A root justfile does not introduce a root application or mandatory package workspace.
- Document and verify compatibility exceptions before adding another runtime or package manager.

## POC 001

Read `docs/prototypes/poc-001-linked-formation.md` before changing its design. Its initial technology target is TypeScript, Phaser, Vite, and Vitest; dependencies are not scaffolded yet.

There is no independent movement, pathfinding, or squad translation. The experiment uses only rotation and expansion/contraction, on a board of at most three hex rings around the centre.

Keep combat simulation independent of Phaser. Use the same rules for previews and committed commands; previews must not mutate live state. Start with deterministic rules and labelled shapes.

## Evidence and scope

- Distinguish agreed constraints, provisional tuning values, and observed playtest results.
- Add tests alongside implemented rules. Do not report checks as passing unless they were run.
- Record experiment outcomes under `docs/playtests/`, including the tested commit and conditions.
- Do not add campaign systems, production art, or generic frameworks to solve an untested POC problem.
- Register imported assets and their source/provenance in `assets/manifest.json`. Do not imply planned files exist.
- Keep personal information, credentials, and unrequested project-source documents out of commits.

This initial repository is documentation and folder structure only, not a playable application.
