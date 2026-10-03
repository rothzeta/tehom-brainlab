# POC 001 — Linked formation

**Status: folders and design brief only. Not runnable or playable yet.**

## Purpose

Test whether rotating, expanding, and contracting three linked Brood creates interesting ordinary combat decisions without leaving short-range characters unable to contribute.

The design source is the [POC brief](../docs/prototypes/poc-001-linked-formation.md). See the [direction ADR](../docs/adr/0004-repository-and-poc-direction.md) for the current scope and the [asset plan](../assets/README.md) for presentation.

## Local structure

```text
poc-001-linked-formation/
├── src/
│   ├── core/       # Pure state, geometry, targeting, commands, resolution
│   ├── content/    # This prototype's abilities and encounter definitions
│   └── view/       # Phaser rendering, input, previews, and animation
├── public/         # Runtime assets explicitly selected for this prototype
└── tests/          # Tests for geometry, rules, and preview consistency
```

The initial stack target is TypeScript + Phaser + Vite + Vitest. Package files, dependency versions, application entry points, and run commands will be added when the first implementation is scaffolded. No root workspace is required.

Bun is the default runtime and package manager; retain Vitest for unit tests and commit a local `bun.lock`. Prefer Docker where useful for a reproducible toolchain, with container configuration inside this prototype. Expose CLI commands through the root justfile, delegating to this prototype's `scripts/` and executable `bin/` entry points as needed. P01 will supply the runnable recipes and pinned tool versions.

## Architectural boundary

Player command -> pure rule validation/resolution -> new state and events -> presentation.

The renderer does not decide attack legality, link state, damage, or maneuver availability. Previews must use the same transitions without mutating live state.

## First implementation slice

Implement the 37-cell board, twelve labelled formation states, rotate/expand/contract commands, a one-maneuver allowance, and accurate previews with labelled tokens. Test these before implementing the patrol's full ability loop.

Do not add individual movement, translation, pathfinding, a campaign, or a general-purpose engine. The ordinary patrol precedes the boss.

## Running and testing

Not available yet. There is no `package.json`, installed dependency set, or executable test suite in this initialization.
