# ADR-0004 — Repository and POC direction

Status: agreed repository and experiment direction; individual decision dates and qualifications are retained below (2026-10-02–03). Amended by user decision, 2026-10-04 and 2026-10-06 (see Amendments).

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

*Amended 2026-10-04: the arena is now a centre hex plus two rings (19 cells); the original scope sentence above is retained as history. See [Amendments](#amendments).*

*Amended 2026-10-06: two boss experiments replace the one directional boss, and designated enemies may relocate between rounds. See [Amendments](#amendments).*

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

## Amendments

**2026-10-04, user decision: two-ring arena.** For POC 001 the arena is a centre hex plus two rings (19 cells), replacing "a centre hex plus three rings (37 cells)" in the POC 001 decision above. The user's reason: "i dont see what three would bring." The middle is enemy and boss space, and the Brood occupy the two rings around it. The rest of the accepted POC scope is unchanged: two formation shapes, six orientations, three Brood with two abilities each, one ordinary patrol and one directional boss. Exact coordinates, the formation mapping and enemy placement remain test parameters owned by the [brief's Decision record](../prototypes/poc-001-linked-formation.md#decision-record) and the [two-ring board task](../plans/2026-10-04-d005e5f4-poc-001-two-ring-board.md).

**2026-10-06, user decision: boss experiments and enemy relocation.** The user played the ring-formation build and found that "the patrols and their attack pattern did not require making use of movement". They adopted the P13–P17 continuation and superseded the unimplemented directional boss (P12). The user lifted the P11 boss gate by explicit decision; the recorded gate stays HOLD and is not marked PASS. For POC 001 the scope changes in two ways:

- **Bosses.** "One directional boss" becomes two boss experiments: an anchored, two-phase boss on the centre tile, and an off-centre roaming boss with two adds.
- **Movement.** Designated enemies may relocate between rounds. The Brood still have no individual walking and no squad translation; they reposition only through rotation and expansion/contraction.

The other scope items stand: the 19-cell arena, two shapes, six orientations, three Brood with two abilities each, and one ordinary patrol, with the patrol first. The promotion rule is unchanged: neither boss is evidence that the combat should replace Apex/Shadow. Allowances, ability numbers, boss HP, patterns, the relocation route and the add composition are provisional test parameters. They are owned by the [brief's Decision record](../prototypes/poc-001-linked-formation.md#decision-record) and the [P13–P17 plans](../plans/README.md#boss-experiments-p13p17).
