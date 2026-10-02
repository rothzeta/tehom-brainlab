# TEHOM Brainlab

A collection of small, independent experiments for TEHOM. Each prototype tests a combat or game-design question; this repository is not the production game engine.

## Layout

```text
tehom-brainlab/
├── doc/                         # Shared design notes, decisions, and playtests
├── assets/                      # Reusable art/audio and asset provenance
├── shared/                      # Reusable code only when reuse is demonstrated
├── tools/                       # Repository and asset utilities
└── poc-001-linked-formation/     # First independent combat experiment
```

Each prototype lives directly under the repository root, named `poc-NNN-short-name/`. Its dependencies, source code, configuration, tests, and eventual run instructions belong inside that folder. There is no root application or mandatory package workspace.

## Prototype index

| Prototype | Question | Status |
|---|---|---|
| [001 — Linked formation](poc-001-linked-formation/README.md) | Do rotation and expansion create interesting combat decisions without useless character turns? | Brief and folders only; not playable |

The initial implementation target for POC 001 is TypeScript + Phaser + Vite + Vitest. This does not commit other prototypes, or the production game, to that stack. No dependency versions have been selected or installed yet.

## Working rules

- Keep experiments independent. Do not import combat rules from another prototype merely to avoid duplication.
- Put shared documentation in [`doc/`](doc/README.md), reusable assets in [`assets/`](assets/README.md), and prototype-specific rules inside the prototype.
- Promote code into `shared/` only after at least two prototypes genuinely need the same behavior. Do not build a generic engine in advance.
- Keep simulation separate from rendering. Previews and committed actions must use the same rules.
- Record hypotheses separately from observations. A proposed mechanic is not a playtest result.
- Start with labelled shapes; visual clarity matters before final art.

## Start here

Read the [POC 001 brief](doc/prototypes/poc-001-linked-formation.md), the [decision log](doc/decisions.md), and the [asset register](assets/manifest.json).

There is no runnable application yet. This initial setup contains repository structure and design documentation only.
