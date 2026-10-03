# ADR-0004 — Repository and POC direction

Status: agreed repository and experiment direction; individual decision dates and qualifications are retained below (2026-10-02–03).

## Decision

This record preserves the original Brainlab decision log. Its accepted constraints remain in force; technology targets, asset plans, and tuning retain their stated provisional scope. Documentation and task conventions are governed separately by [ADR-0001](0001-documentation-vault.md), [ADR-0002](0002-plan-filenames.md), and [ADR-0003](0003-implementation-plan-writing.md).

## 2026-10-02 — Independent prototypes at repository root

**Status: agreed repository direction.**

Use one top-level folder per prototype, named `poc-NNN-short-name/`, with `docs/`, `assets/`, and other shared folders at root. Initial common folders are `shared/` and `tools/`.

Keep each prototype's dependencies and tests local. No shared combat engine or root package workspace is needed for the initial setup. These conventions allow later experiments to use a different stack without restructuring the lab.

## 2026-10-02 — POC 001: linked formation

**Status: agreed experiment; not a production combat decision.**

The experiment replaces the earlier fixed Apex/Shadow formation with a bounded hex arena. Brood attack individually but reposition together through rotation and expansion/contraction. There is no individual walking and no squad translation.

The accepted POC scope is a centre hex plus three rings (37 cells), two formation shapes and six orientations, three Brood with two abilities each, one ordinary patrol, and one directional boss. Start with the patrol; the boss is not sufficient evidence that the system works across normal encounters.

See the [brief](../prototypes/poc-001-linked-formation.md) for the initial rule set.

## 2026-10-02 — Technology target for POC 001

**Status: initial implementation target; not a production-engine commitment.**

Use TypeScript + Phaser + Vite + Vitest for the browser-first experiment. Keep the rules independent of Phaser. There is no backend in the POC.

Dependencies and versions have not been selected or installed in this repository. This initialization creates documentation and directories only.

## 2026-10-02 — Presentation and shared assets

**Status: initial asset plan.**

Begin with labelled geometric tokens. The first optional identity pass needs seven static creature images: Ugallu, Girtablilu, Pazuzu, Warder, Censer, Harrier, and the Foundry Mechanism.

Draw the board, links, facing, threat zones, previews, and interface in code. No imported tile set, directional character sheets, final art, or music is required to test the rules.

Asset dimensions, visual treatments, damage values, exact formation coordinates, and link thresholds are test parameters, not finished balance or production specifications.

## 2026-10-03 — Bun, Docker, and just CLI conventions

**Status: user-directed development defaults.**

Use Bun as the default JavaScript/TypeScript runtime and package manager. Keep dependencies and a committed `bun.lock` local to each prototype; use `bun install --frozen-lockfile` for reproducible installs. POC 001 retains TypeScript, Phaser, Vite, and Vitest. Document and verify any compatibility exception before adding another runtime or package manager.

Prefer Docker where useful for dependency isolation or a reproducible toolchain. Keep prototype container configuration inside its owning folder and pin runtime/image versions when scaffolding. Docker does not introduce a backend requirement.

Use the root `justfile` to orchestrate CLI commands, delegating logic to implementations in `scripts/` and executable entry points in `bin/`. Prototype-specific scripts and entry points belong in the prototype's own directories. The root command surface does not introduce a root application or package workspace. The existing PNG exporter now follows this convention; its manifest tool references have been updated without changing asset provenance or hashes.

[ADR-0005](0005-repository-management-and-tooling.md) formalizes the mandatory `.agents/`, `bin/`, and `scripts/` folders and the just repository management and tooling aggregation contract.

## Promotion rule

Do not mark the new combat model as selected for the full game until ordinary encounters, wounded starting conditions, and a fair comparison with the original Apex/Shadow model have been tested. Record findings, including failures, rather than replacing hypotheses with unsupported conclusions.

## Rationale

Independent prototype ownership allows experiments to disagree about rules and technology. A small deterministic formation experiment tests the combat question before production systems or a shared engine are introduced. Local dependencies and thin CLI orchestration support reproducible work without a root application.

## Consequences

Keep prototype source, tests, dependencies, container configuration, and run instructions local. Preserve accepted scope, distinguish tuning from evidence, and record actual playtests before promoting the model. Retain these historical decisions here; future separate decisions use the next unused ADR number.
