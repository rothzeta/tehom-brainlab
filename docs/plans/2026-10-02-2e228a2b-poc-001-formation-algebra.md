# Preserve a reversible, twelve-state linked formation on a 37-cell board

## Status and authority

**P02. Implemented, verified, independently reviewed at `803da5df5f34b387be3bb5ccce3cd7cbd733f90b` after the R1 fix, and accepted by the Coordinator. Locally delivered to master at `7e964c30a29abd1fb10613713bc205ef037b1f80`; delivered-master checks pass.** Depends on delivered [P01](2026-10-02-a87b131a-poc-001-browser-harness.md) for the unit-test harness. Original planning baseline: `79f9498051df0281e6e9d3c904e9eee32f014873`; implementation BASE: `e3f60372a5fef279f92ed14caead48271247405f`. See [execution](../TASK_LOGS.md#2026-10-04-p02-formation-algebra-candidate), [Implementer evidence](../mailbox/p02-formation-algebra/implementer.md), [independent re-review](../mailbox/p02-formation-algebra/reviewer.md#re-review-of-r1-at-803da5d), [local delivery record](../TASK_LOGS.md#2026-10-04-p02-local-delivery), and [delivery handoff](../mailbox/p02-formation-algebra/delivery.md).

Authority: the [brief's Formation rules and Initial tests](../../docs/prototypes/poc-001-linked-formation.md) and [direction ADR](../adr/0004-repository-and-poc-direction.md). The exact coordinate mapping below is now implemented as the experimental fixture under assignment B-impl; verification does not establish balanced gameplay. The [index](README.md) and local ADRs below establish formatting authority.

**Amended 2026-10-04:** Compact is now a triangle by user decision; see [Amendment CT](#amendment-ct-2026-10-04--compact-triangle). Not yet implemented.

Delivery sequence: [P01–P12 index](README.md). Governing format: [ADR-0002](../adr/0002-plan-filenames.md) and [ADR-0003](../adr/0003-implementation-plan-writing.md).

Task `P02` implementation and combined-verification owner: assignment B-impl Implementer; local integration/delivery owner: assignment B-merge Implementer. This plan is one standalone task; its sequential checkpoints inherit the prerequisites, affected components, acceptance criteria, verification, and hand-back defined here. Checkpoint identifiers remain stable on edits. Actual execution is recorded in [TASK_LOGS](../TASK_LOGS.md#2026-10-04-p02-formation-algebra-candidate).

## Amendment CT (2026-10-04) — Compact triangle

**Status: accepted design amendment, not yet implemented.** Source: user decision, 2026-10-04, recorded in the [brief's Decision record](../../docs/prototypes/poc-001-linked-formation.md#decision-record). Execution task: [Compact triangle](2026-10-04-fb4bf201-poc-001-compact-triangle.md). This section supersedes the Compact parts of the original fixture, contracts and criteria below. Those parts stay as the record of the delivered `803da5d`/`7e964c3` behaviour. Spread is unchanged.

**Settled (user):** Compact is three mutually adjacent cells, two on the outer ring and one on ring 2 just inside them. All three links are distance 1. Ugallu and Girtablilu hold the outer cells; Pazuzu is inward.

**Ring-2 table `T`** (new, proposed export beside `OUTER_RING`), clockwise from `(2,0)` in the same convention, indexed 0 through 11:

```text
(2,0), (1,1), (0,2), (-1,2), (-2,2), (-2,1),
(-2,0), (-1,-1), (0,-2), (1,-2), (2,-2), (2,-1)
```

`T[(j+2) mod 12]` is the axial clockwise turn `(-r,q+r)` of `T[j]`, just as `R[(i+3) mod 18]` is for `R`.

**Mapping (accepted user decision, 2026-10-04: Pazuzu inward, mid-side placement, clockwise order taken around the formation's own centre).** Roster order stays `[ugallu, girtablilu, pazuzu]`. For orientation `o` in `0..5`:

- Compact: `R[3o+1]`, `R[3o+2]`, `T[2o+1]`.
- Spread (unchanged): `R[3o]`, `R[3o+6]`, `R[3o+12]`, modulo 18.

| o | Ugallu | Girtablilu | Pazuzu |
|---|---|---|---|
| 0 | (2,1) | (1,2) | (1,1) |
| 1 | (-1,3) | (-2,3) | (-1,2) |
| 2 | (-3,2) | (-3,1) | (-2,1) |
| 3 | (-2,-1) | (-1,-2) | (-1,-1) |
| 4 | (1,-3) | (2,-3) | (1,-2) |
| 5 | (3,-2) | (3,-1) | (2,-1) |

Rationale:

- Compact orientation `o` takes the two interior cells of outer-ring side `o`, between corners `R[3o]` and `R[3o+3]`, plus the single ring-2 cell adjacent to both. The triangle is mirror-symmetric about the side's radial midline and points at the encounter centre with Pazuzu centred inward, matching the user's sketch.
- All three Brood stay inside encounter sector `o`, as the old Compact did. This keeps every P05 sector-based recipient and protection table unchanged (see the [P05 amendment](2026-10-02-d66a7452-poc-001-intent-semantics.md#amendment-ct-2026-10-04--compact-triangle)).
- Expansion does not mirror the formation. Around its own centroid, the Compact triangle's vertices run Ugallu → Girtablilu → Pazuzu clockwise, at −30°, 90° and 210° in downward-positive screen angles. Spread runs the same way around the encounter centre, at 0°, 120° and 240°. Expand is therefore an orientation-preserving scale and 30° twist. Putting Girtablilu inward would keep the old angular order seen from the encounter centre, but would reflect the triangle and override the user's slot preference.
- Alternative considered and not chosen: a corner-anchored triangle `R[3o]`, `R[3o+1]`, `T[2o]`. It keeps Ugallu stationary through Expand/Contract, but it is lopsided relative to the arena, and Pazuzu sits radially behind Ugallu rather than centred.

**Consequences.**

- Orientation count stays six, with twelve distinct labelled states. Rotation is unchanged: orientation ±1 modulo 6. The axial clockwise transform still maps every labelled position to its position at orientation `o+1`.
- Expand/Contract still preserve orientation, roster labels and exact reversibility. Ugallu now moves one ring step (`R[3o+1]` ↔ `R[3o]`), whereas the old mapping kept it fixed. Only destinations matter.
- Links in roster-pair order are Compact `[1,1,1]` and Spread `[6,6,6]`. `CLOSE_THRESHOLD` stays 2: thresholds 1–5 classify identically, so changing it would only cause churn. Compact is now Close even at threshold 1, and the only Close/Stretched boundary inside Compact is between thresholds 0 and 1.
- Spread occupied-cell coincidences (orientations 0/2/4 and 1/3/5) are unchanged. Compact states remain pairwise disjoint.
- Required contract change: "Brood never overlap and always occupy the outer ring" becomes "Brood never overlap; Spread Brood and Compact Ugallu and Girtablilu occupy the outer ring; Compact Pazuzu occupies ring 2; every Compact pair is adjacent".

**Amended acceptance criteria (replace 2 and 4; add 7):**

2. All twelve labelled states match the amended mapping table, have three distinct occupied cells, and retain roster order. Compact places exactly Ugallu and Girtablilu at radius 3 and Pazuzu at radius 2. Spread places all three at radius 3.
4. All Compact links are Close with distance 1 and all Spread links are Stretched with distance 6 at threshold two, across wraparound. At threshold 0, Compact links are Stretched.
7. `T` contains exactly the 12 radius-2 cells in the declared clockwise order, and `T[(j+2) mod 12]` equals the clockwise turn of `T[j]`.

Criteria 1, 3, 5 and 6 are unchanged.

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

Executed on the corrected candidate `29d9616f2ebdb69c83d12f66089495bca6f7f723` and independently rerun at reviewed `803da5df5f34b387be3bb5ccce3cd7cbd733f90b`: focused formation suite (90 tests, 3,349 actual assertions), strict typecheck, full suite (92 tests), P01 build, and whitespace checks, all exit 0. P01 prerequisites passed at implementation BASE. [Verification evidence](../mailbox/p02-formation-algebra/verification.md) records commands/output; [public exports and errors](../../poc-001-linked-formation/README.md#formation-algebra-p02) resolve P02.C4 and validation choices. No default initial formation is selected; Close threshold two remains provisional and configurable. Readonly safe-integer axial inputs and synchronous `RangeError` are explicit implementation choices. Independent re-review resolves R1 and passes all ten criteria; the Coordinator accepts P02. On delivered master `7e964c30a29abd1fb10613713bc205ef037b1f80`, focused tests (90/3,349), typecheck, and routing regression (16 tests) each exit 0; all technical content equals reviewed `803da5d`.

Record exact executed commands, results, acceptance evidence, and limitations in [TASK_LOGS](../TASK_LOGS.md), then link that entry here and update [CURRENT](../CURRENT.md) when implementation facts change. Delivered P01 supplies the required commands below.

After P01 exists, run `just poc-001-test tests/formation.test.ts` and `just poc-001-typecheck` from the repository root. Return the coordinate table, exhaustive assertion count, command results, and a serialized example of both orientation-zero shapes. Verify the implementation, not only a drawing. Any independent arithmetic check of this draft is not a passing application test.

## Non-goals and stop conditions

No movement allowance, paths, collision, physics, terrain, arbitrary dragging, asymmetric formations, damage, or UI. Stop when the algebra is exhaustively verified. If the renderer needs a different axis convention, adapt its projection or explicitly revise this proposal and its fixtures; do not change formation identity implicitly.
