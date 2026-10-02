# Decision log

## 2026-10-02 — Independent prototypes at repository root

**Status: agreed repository direction.**

Use one top-level folder per prototype, named `poc-NNN-short-name/`, with `doc/`, `assets/`, and other shared folders at root. Initial common folders are `shared/` and `tools/`.

Keep each prototype's dependencies and tests local. No shared combat engine or root package workspace is needed for the initial setup. These conventions allow later experiments to use a different stack without restructuring the lab.

## 2026-10-02 — POC 001: linked formation

**Status: agreed experiment; not a production combat decision.**

The experiment replaces the earlier fixed Apex/Shadow formation with a bounded hex arena. Brood attack individually but reposition together through rotation and expansion/contraction. There is no individual walking and no squad translation.

The accepted POC scope is a centre hex plus three rings (37 cells), two formation shapes and six orientations, three Brood with two abilities each, one ordinary patrol, and one directional boss. Start with the patrol; the boss is not sufficient evidence that the system works across normal encounters.

See the [brief](prototypes/poc-001-linked-formation.md) for the initial rule set.

## 2026-10-02 — Technology target for POC 001

**Status: initial implementation target; not a production-engine commitment.**

Use TypeScript + Phaser + Vite + Vitest for the browser-first experiment. Keep the rules independent of Phaser. There is no backend in the POC.

Dependencies and versions have not been selected or installed in this repository. This initialization creates documentation and directories only.

## 2026-10-02 — Presentation and shared assets

**Status: initial asset plan.**

Begin with labelled geometric tokens. The first optional identity pass needs seven static creature images: Ugallu, Girtablilu, Pazuzu, Warder, Censer, Harrier, and the Foundry Mechanism.

Draw the board, links, facing, threat zones, previews, and interface in code. No imported tile set, directional character sheets, final art, or music is required to test the rules.

Asset dimensions, visual treatments, damage values, exact formation coordinates, and link thresholds are test parameters, not finished balance or production specifications.

## Promotion rule

Do not mark the new combat model as selected for the full game until ordinary encounters, wounded starting conditions, and a fair comparison with the original Apex/Shadow model have been tested. Record findings, including failures, rather than replacing hypotheses with unsupported conclusions.
