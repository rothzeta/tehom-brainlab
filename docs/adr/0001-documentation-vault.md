# ADR-0001 — Documentation is an Obsidian vault

Status: accepted by user instruction, 2026-10-03.

## Decision

`docs/` is TEHOM Brainlab's Obsidian vault root. Open that directory as a vault. Its common structure is `lexicon/`, `adr/`, `plans/`, and `exploitation/`, with `README.md`, `SCHEMA.md`, `CURRENT.md`, and `TASK_LOGS.md` at the vault root. Keep the Brainlab-specific `prototypes/` and `playtests/` extensions.

Each directory has a README entry point. [SCHEMA](../SCHEMA.md) defines note responsibilities and formats. [CURRENT](../CURRENT.md) summarizes implementation facts; [TASK_LOGS](../TASK_LOGS.md) retains dated execution evidence.

Use relative Markdown links so navigation works in Obsidian and repository browsers. Keep prototype setup instructions local to the prototype and asset provenance in the asset register. The vault must be understandable without access to another repository.

An ADR states an accepted obligation, a plan states intended work, a task log records execution, and a playtest records observed experiment results. Keep those authorities distinct.

## Rationale

One vault provides stable navigation and separates accepted decisions, current facts, proposed work, and evidence.

## Consequences

The repository README links into the vault. Existing prototype briefs and playtest records retain their homes. The original decision log moves into [ADR-0004](0004-repository-and-poc-direction.md); the asset-import record belongs under `exploitation/`.

Plans and tasks follow [ADR-0002](0002-plan-filenames.md) and [ADR-0003](0003-implementation-plan-writing.md). This convention is adapted from the documentation-vault ADR in `../enoch` by the user's instruction; Enoch application content and its additional issue-register policy are outside this adoption.
