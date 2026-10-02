# Working in TEHOM Brainlab

## Repository structure

- Each prototype is a direct child of the repository root: `poc-NNN-short-name/`.
- Shared documentation belongs in `doc/`, reusable art/audio in `assets/`, demonstrated reusable code in `shared/`, and repository utilities in `tools/`.
- Keep dependencies, configuration, source, tests, and run instructions inside the owning prototype. Do not introduce a root application or mandatory workspace without a concrete need.
- Do not couple experiments through a premature shared combat engine. Different prototypes must be allowed to disagree about rules and technology.

## POC 001

Read `doc/prototypes/poc-001-linked-formation.md` before changing its design. Its initial technology target is TypeScript, Phaser, Vite, and Vitest; dependencies are not scaffolded yet.

There is no independent movement, pathfinding, or squad translation. The experiment uses only rotation and expansion/contraction, on a board of at most three hex rings around the centre.

Keep combat simulation independent of Phaser. Use the same rules for previews and committed commands; previews must not mutate live state. Start with deterministic rules and labelled shapes.

## Evidence and scope

- Distinguish agreed constraints, provisional tuning values, and observed playtest results.
- Add tests alongside implemented rules. Do not report checks as passing unless they were run.
- Record experiment outcomes under `doc/playtests/`, including the tested commit and conditions.
- Do not add campaign systems, production art, or generic frameworks to solve an untested POC problem.
- Register imported assets and their source/provenance in `assets/manifest.json`. Do not imply planned files exist.
- Keep personal information, credentials, and unrequested project-source documents out of commits.

This initial repository is documentation and folder structure only, not a playable application.
