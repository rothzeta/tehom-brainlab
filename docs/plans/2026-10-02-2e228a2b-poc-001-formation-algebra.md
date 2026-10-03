# Preserve a reversible, twelve-state linked formation on a 37-cell board

## Status and authority

**P02. Draft; not implemented or verified.** Depends on [P01](2026-10-02-a87b131a-poc-001-browser-harness.md) for the unit-test harness. Baseline: `79f9498051df0281e6e9d3c904e9eee32f014873`.

Authority: the [brief's Formation rules and Initial tests](../../docs/prototypes/poc-001-linked-formation.md) and [direction ADR](../adr/0004-repository-and-poc-direction.md). The exact coordinate mapping below is a proposed implementation of the accepted experiment, not an existing approved coordinate specification. The [index](README.md) and local ADRs below establish formatting authority.

Delivery sequence: [P01–P12 index](README.md). Governing format: [ADR-0002](../adr/0002-plan-filenames.md) and [ADR-0003](../adr/0003-implementation-plan-writing.md).

Task `P02` owner and integration owner: POC 001 implementer, currently unassigned. This plan is one standalone task; its sequential checkpoints inherit the prerequisites, affected components, acceptance criteria, verification, and hand-back defined here. Checkpoint identifiers remain stable on edits. Record actual execution in [TASK_LOGS](../TASK_LOGS.md); no execution evidence exists yet.

## Smallest useful outcome

Pure functions enumerate the board and all twelve labelled formations, rotate or change shape without losing character identity, and report the three links. No rendering is needed to prove the geometry.

## Starting source and ownership

The baseline has no geometry implementation. Own proposed `src/core/hex.ts`, `src/core/formation.ts`, and `tests/formation.test.ts`, all within `poc-001-linked-formation/`. Export geometry to later consumers; do not let UI coordinates become combat coordinates. P03 owns action costs and state mutation, not this module.

## Fixture and inputs

Use integer axial coordinates `(q,r)` with distance `max(abs(dq), abs(dr), abs(dq+dr))`. Enumerate cells whose distance from `(0,0)` is at most three.

Proposed clockwise outer-ring table `R`, indexed 0 through 17:

```text
(3,0), (2,1), (1,2), (0,3), (-1,3), (-2,3),
(-3,3), (-3,2), (-3,1), (-3,0), (-2,-1), (-1,-2),
(0,-3), (1,-3), (2,-3), (3,-3), (3,-2), (3,-1)
```

Fixture roster order is `[ugallu, girtablilu, pazuzu]`. For orientation `o` in `0..5`, Compact uses indices `3o + [0,1,2]`; Spread uses `3o + [0,6,12]`, modulo 18. Orientation zero Compact therefore places the roster at `(3,0)`, `(2,1)`, `(1,2)`; Spread uses `(3,0)`, `(-3,3)`, `(0,-3)`.

## Contracts and decisions

### Required contracts

Produce 37 distinct board cells and twelve distinct **labelled** states. Brood never overlap and always occupy the outer ring. Clockwise rotation followed by anticlockwise rotation, and expansion followed by contraction, restore the exact character-to-cell mapping. Six rotations restore the initial state. Inputs are not mutated. Invalid shapes, fractional coordinates, or orientations outside the declared boundary are rejected rather than silently repaired by public APIs.

### Settled choices

Two shapes, six orientations, fixed encounter centre, no independent movement or translation. Close initially means distance at most two; otherwise Stretched. Expansion spreads the Brood around the engagement, not radially away from it. These are experimental rules, not final balance.

### Proposed implementation

Represent a formation as `{shape, orientation}` and derive labelled positions instead of maintaining two independently editable position stores. Increment orientation modulo six for clockwise rotation; decrement for anticlockwise rotation. Use the mapping above and a screen convention with positive vertical coordinates downward; the axial transform `(-r,q+r)` corresponds to one clockwise step.

Return link endpoints, integer distance, and `close`/`stretched` in stable roster-pair order. Compact distances are 1, 2, 1; Spread distances are 6, 6, 6 under this mapping. Several Spread states share an unlabelled occupied-cell set but assign different Brood to those cells; never deduplicate them. Health and active-link eligibility remain P06 concerns.

## Implementation checkpoints

1. **P02.C1** — Encode the board and ring fixtures independently of pixel conversion; hand-check orientation zero.
2. **P02.C2** — Implement public validation, position derivation, maneuvers, and link derivation.
3. **P02.C3** — Exhaustively test both shapes at every orientation and all inverse operations, including wraparound.
4. **P02.C4** — Publish typed exports and the coordinate convention so the renderer and intent masks use the same ordering.

## Acceptance criteria

1. Board enumeration returns exactly 37 unique integer cells; the outer ring contains exactly 18 and no returned cell exceeds radius three.
2. All twelve labelled states match the declared mapping, have three distinct occupied cells, and retain roster order.
3. Across every state, inverse rotations and inverse shape changes restore byte-equivalent serialized positions; six clockwise rotations also restore them.
4. All Compact links are Close and all Spread links Stretched at threshold two, including across orientation wraparound.
5. Spread orientation zero and orientation two retain different labelled assignments even though their occupied-cell sets coincide.
6. Invalid public inputs produce documented errors; a deeply frozen valid input remains unchanged after every operation.

## Verification and hand-back

Record exact executed commands, results, acceptance evidence, and limitations in [TASK_LOGS](../TASK_LOGS.md), then link that entry here and update [CURRENT](../CURRENT.md) when implementation facts change. The commands below remain proposed until their prerequisites supply them.

After P01 exists, run `just poc-001-test tests/formation.test.ts` and `just poc-001-typecheck` from the repository root. Return the coordinate table, exhaustive assertion count, command results, and a serialized example of both orientation-zero shapes. Verify the implementation, not only a drawing. Any independent arithmetic check of this draft is not a passing application test.

## Non-goals and stop conditions

No movement allowance, paths, collision, physics, terrain, arbitrary dragging, asymmetric formations, damage, or UI. Stop when the algebra is exhaustively verified. If the renderer needs a different axis convention, adapt its projection or explicitly revise this proposal and its fixtures; do not change formation identity implicitly.
