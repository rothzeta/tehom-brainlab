# ADR-0003 — Writing bounded implementation plans

Status: accepted by user instruction, 2026-10-03.

## Decision

Write each plan as an executable specification for one bounded capability or safety invariant. Give an implementer enough information to make the change and a reviewer enough information to assess completion. Scale its length to the work.

Read relevant ADRs, [CURRENT](../CURRENT.md), the owning prototype brief, and actual source before fixing scope or API shapes. State conflicts and reconcile stale assumptions. Use [ADR-0002](0002-plan-filenames.md) for filenames. Link the delivery index or parent plan and relevant authority; maintain one delivery sequence per independent prototype.

## Required content

Use these sections as a starting structure. Small plans may combine sections while retaining their information.

| Section | Required information |
| --- | --- |
| Status and authority | Proposed, accepted, implemented, or superseded; governing decisions, parent sequence, and evidence links |
| Smallest useful outcome | Observable capability or invariant and an insufficient result that would fail acceptance |
| Starting source and ownership | Inspected revision, existing and missing behavior, relevant source/tests, proposed file homes, task owner, and integration owner |
| Fixture and inputs | Minimum controlled data, reused assets, and fixture conveniences distinguished from game rules |
| Contracts and decisions | Inputs, outputs, semantics, invalid/failure behavior, state publication, determinism, ownership, and relevant compatibility |
| Implementation checkpoints | Stable identifiers, dependencies, integration order, affected components, and observable results |
| Acceptance criteria | Numbered, independently assessable final behavior, including failure cases and real consumers |
| Verification and hand-back | Focused commands, observable evidence, broader checks where relevant, evidence destination, and reporting requirements |
| Non-goals and stop conditions | Deferred behavior, excluded abstractions, and findings that require reporting before proceeding |

A task names its owner, prerequisites, affected files or components, observable result, acceptance criteria, verification, and hand-back. A whole bounded plan may be one standalone task, with sequential checkpoints inheriting that contract. A task within a larger plan has a stable task identifier and its own bounded contract. An unassigned owner may be a role. Keep actual execution in [TASK_LOGS](../TASK_LOGS.md), linked from the plan, rather than accumulating another execution log inside it.

One implementer is appropriate for closely coupled contracts and consumers. If delegation is explicitly requested, define disjoint file ownership, complete shared prerequisites first, and integrate in dependency order. Plans must not imply delegates or independent reviews have already run.

## Contracts and acceptance

Make ambiguities that could change behavior explicit before implementation. Inspect actual state, saved-data formats, and consumers where relevant. Identify the real consumer of each new value or abstraction. Prefer the smallest representation that serves the slice and existing assets; a conceptual responsibility does not require a framework.

Distinguish required contracts and their authority, proposed implementation choices, settled choices, and experimental tuning. Fixture values are not universal limits or balanced gameplay. Resolve choices needed by dependent plans visibly and reconcile their fixtures.

Acceptance criteria state the trigger or input, observable result, and invariant. Prefer accepted state transitions and visible behavior over private fields or class names. Include invalid inputs, rejection, reset, interruption, or stale state where applicable. Keep previews and commits on the same pure rules; previews must not mutate live state.

Use minimal meaningful fixtures and deterministic checks. Alternate identifiers and inputs must work when labels have no semantic meaning. Tests, browser checks, and human playtests provide distinct evidence; passing one does not establish the others.

## Verification and evidence

Verify that recipes and tests exist before presenting commands as available. Label future commands proposed. Use the root justfile, prototype-local scripts and executables, Bun with a committed local lockfile, Vitest for POC 001, and Docker where useful, following [ADR-0004](0004-repository-and-poc-direction.md). Select and pin supported runtime versions during scaffolding; do not inherit Enoch's application runtimes.

Documentation-only changes require content, link, naming, and whitespace review. Implemented game rules require tests. For a bug, retain a deterministic failing regression before the production fix when feasible; a new capability need not be recast as a historical defect.

Hand-back records the tested revision or implementation commit, changed paths, exact commands and results, acceptance mapping, findings, limitations, and deferred work. Durable worker handoffs belong in `docs/mailbox/` under the [schema's artifact conventions](../SCHEMA.md#agent-work-artifacts), with references to the canonical plan. Record execution in a dated task log entry and update CURRENT when facts change. Link detailed playtest results from `playtests/`. Do not claim independent reviews, application checks, or live operation unless they occurred.

## Rationale and consequences

Bounded outcomes, explicit contracts, and reviewable evidence make completion assessable without adding generic engines or permanent gates to every checkpoint. This local rule adapts Enoch's ADR-0003 to Brainlab and replaces the former reference to an unavailable ADR-0008.
