# ADR-0002 — Plan filenames

Status: accepted by user instruction, 2026-10-03; existing plan filenames already conform.

## Decision

Every implementation plan and standalone task specification uses `yyyy-mm-dd-[rand:8]-{name}.md`:

- `yyyy-mm-dd`: creation date.
- `[rand:8]`: eight randomly generated characters.
- `{name}`: descriptive name of the bounded work.

Store these notes in `docs/plans/`. Generate the random identifier once and retain the filename on subsequent edits. Existing Brainlab plans use eight lowercase hexadecimal characters and keep their original creation date and identifiers. For example, `2026-10-02-a87b131a-poc-001-browser-harness.md`.

A standalone task specification is a bounded plan and follows the same rule. Tasks inside a plan use stable identifiers in that document; execution is recorded in [TASK_LOGS](../TASK_LOGS.md). Navigation files such as `plans/README.md` are indexes, not implementation plans.

Use `git mv` for tracked plan renames and update references in the same change. A pre-existing plan that requires migration uses the rule-adoption date. Status does not exempt a plan from the naming rule.

## Rationale

The date exposes the plan's origin, the random identifier distinguishes similar work, and the descriptive suffix makes the file recognizable. Delivery order belongs in the index and dependencies rather than filename sorting.

## Consequences

Filenames remain stable through implementation. Status and evidence links change inside the note and index. This local rule adapts Enoch's ADR-0002 and replaces the former reference to an unavailable ADR-0007.
