# Keep declared attacks, directional protection, and facing changes unambiguous

## Status and authority

**P05. Implemented, independently reviewed (no findings), accepted, locally delivered.** [Implementation evidence](../mailbox/p05-intent-semantics/implementer.md) and [independent review](../mailbox/p05-intent-semantics/reviewer.md). Depends on [P02](2026-10-02-2e228a2b-poc-001-formation-algebra.md) and [P03](2026-10-02-2dfffcd3-poc-001-command-boundary.md). Baseline: `79f9498051df0281e6e9d3c904e9eee32f014873`.

Authority: [brief Round structure, Test abilities, and encounter descriptions](../../docs/prototypes/poc-001-linked-formation.md). Exact sector masks and cancellation rules are explicitly open in that source; the choices below are proposals, not recovered requirements. Formatting authority is recorded in the [index](README.md).

**Amended 2026-10-04:** sectors extend to ring 2 for the Compact triangle; see [Amendment CT](#amendment-ct-2026-10-04--compact-triangle) (implemented and locally delivered on the radius-3 board).

**Amended 2026-10-04 (later):** sectors cover rings 1–2 of the two-ring board; see [Amendment TR](#amendment-tr-2026-10-04--two-ring-board). Not yet implemented.

**Amended 2026-10-05:** enemies stand on tiles, and fronts, protection, reach and turnable areas are measured from each enemy's own tile; see [Amendment RF](#amendment-rf-2026-10-05--fronts-protection-and-reach-from-enemy-tiles). Not yet implemented.

Delivery sequence: [P01–P12 index](README.md). Governing format: [ADR-0002](../adr/0002-plan-filenames.md) and [ADR-0003](../adr/0003-implementation-plan-writing.md).

Task `P05` owner and integration owner: POC 001 implementer, currently unassigned. This plan is one standalone task; its sequential checkpoints inherit the prerequisites, affected components, acceptance criteria, verification, and hand-back defined here. Checkpoint identifiers remain stable on edits. The Coordinator records actual execution in [TASK_LOGS](../TASK_LOGS.md) from the implementer's mailbox handoff; no execution evidence exists yet.

## Amendment RF (2026-10-05) — fronts, protection and reach from enemy tiles

**Status: design amendment, not yet implemented.** Trigger: the user decisions of 2026-10-05 ([brief Decision record](../../docs/prototypes/poc-001-linked-formation.md#decision-record)): enemies stand on real tiles, and each enemy's front, protection and reach derive from its own tile and facing. Geometry: [P02 Amendment RF](2026-10-02-2e228a2b-poc-001-formation-algebra.md#amendment-rf-2026-10-05--ring-formation-and-enemy-cells). Execution: [Ring formation task](2026-10-05-c6399cb6-poc-001-ring-formation.md). This is the separate mask proposal that the TR "Enemy anchors" paragraph and this plan's stop condition require before enemy cells may carry rule meaning. It supersedes the TR statements that enemy cells carry no rule meaning and that protection is encounter-centred. The definitions below are the Architect's proposal; the user decided the principle, not these shapes.

**Enemy cell.** `EnemyState` gains a required `cell: Hex`. Selectors read it; they do not validate placement. P08 content and P11 record validation check that each enemy stands on a distinct `ENEMY_CELLS` cell (P02). Unit fixtures may place an enemy on the centre, which reproduces the delivered encounter-centred behaviour exactly.

**Front (proposed `frontCells(origin, facing)`).** Take the delivered six-cell `frontMask(facing)` in its order, add `origin` to each cell, and keep the cells that are on the board. At the centre this is exactly `frontMask(facing)`, so a centre (boss) enemy's front is unchanged. Elsewhere the front is the same 120° wedge within two steps of the enemy's tile, clipped at the board edge. Hand-checked examples for the proposed Warder tile `(1,-2)` (`T9`):

- facing 0: `(2,-1), (2,-2), (1,0), (0,0), (1,-1)` (`T11, T10, S0, centre, S5`; one cell clipped);
- facing 1: `(1,0), (0,0), (1,-1), (-1,0), (-1,-1), (0,-1)` (`S0, centre, S5, S3, T7, S4`);
- facing 5: `(2,-1), (2,-2)` (`T11, T10`; four cells clipped).

`sectorCells(s)` and `frontMask(f)` stay exported and unchanged: they are the centre-tile case. Any consumer that means "this enemy's front" must call `frontCells(enemy.cell, enemy.facing)`; no consumer may substitute `frontMask(enemy.facing)` for a non-centre enemy.

**Protection.** `selectProtection` keeps its signature, reasons and ordering. A living source protects when the attacker's current cell lies in `frontCells(source.cell, source.facing)`. The per-source reason string `outside-sector` is kept for compatibility; it now means "outside that source's front".

**Areas.** A fixed area keeps its stored cells; recipients are still the living Brood standing on them. `turnEnemy` turns each turnable area cell about the source's tile: `c` becomes `E + turn(c − E)`, where `E` is the source cell and `turn(q,r) = (-r,q+r)`. Anticlockwise remains five clockwise steps with one facing event. At the centre this is the delivered transform. Turned cells are not clipped or recomputed: a cell turned off the board has no recipients and is not drawn. Turning a clipped front therefore need not equal the next facing's clipped front; that equality holds only at the centre. The patrol declares no areas, so this matters for P12 and fixtures only.

**Reach (proposed `broodInReach(context, enemyId, reach)`).** Returns the living Brood IDs, in roster order, whose current cell is within `reach` steps (inclusive) of the enemy's cell. A missing or fallen enemy returns an empty list. `reach` must be a nonnegative safe integer, or the call throws `RangeError`, like the other distance thresholds. P05 supplies the query only; P08 decides when it applies (at announcement) and the fallback. Brood contact attacks are not limited by reach: every living Brood still reaches every living enemy in all twelve states (P07 criterion 5).

**What remains centre-based.** The formation's pivot (rotation and Expand/Contract act about the centre, P02), and the centre-tile case of fronts (`sectorCells`, `frontMask`) used by a centre enemy. Links, isolation, splash and marks are measured between Brood and are unaffected by enemy tiles.

**Recipient and protection tables at the centre (changed by P02 RF).** Compact orientation `o` now places one Brood in each of sectors `o`, `o+2` and `o+4`, like Spread. A two-sector front from the centre therefore always contains exactly one Brood, in both shapes, and Expand/Contract never change which:

- Fixture area (facing-zero front from the centre): Compact `[U, U, P, P, G, G]`; Spread `[U, U, P, P, G, G]` (unchanged).
- Turned area (facing one): Compact `[G, U, U, P, P, G]`; Spread `[G, U, U, P, P, G]` (unchanged).
- A centre Warder at facing 0 protects exactly the fixture-area recipients.

**Marks, splash and isolation.** A mark on Girtablilu anchors at `S[(o+2) mod 6]` in Compact and `T[(2o+4) mod 12]` in Spread. Keep `SPLASH_RADIUS = 2`: Compact pairs are at distance 2, so a splash on any Compact Brood still reaches all three, and Spread pairs at distance 4 still isolate the target. Radii 2 and 3 behave identically; radius 1 would now reach only the target in both shapes (a P08 tuning lever, not chosen here). Isolation and active links are unchanged: Compact has no isolated Brood while two or more live, and every living Spread Brood is isolated.

**Amended acceptance criteria (additions; criteria 1–6 stand, evaluated with the RF mapping and enemies on the centre unless stated).**

- RF-1. `frontCells((0,0), f)` equals `frontMask(f)` element by element for every facing. `frontCells` at the three examples above equals the listed cells in order, and never contains an off-board cell or the origin.
- RF-2. With a Warder on `(1,-2)` at facing 0 protecting Censer, exactly the Brood standing on the facing-0 cells above are protected, across all twelve states; a Crosswind turn changes the protected set to the facing-1 or facing-5 cells.
- RF-3. Crosswind on an enemy at `(1,-2)` turns a stored turnable area about `(1,-2)`; for example the single cell `(2,0)` turns clockwise to `(-1,1)`. Marks and other areas are unchanged.
- RF-4. `broodInReach` returns roster-ordered living Brood within the inclusive distance, excludes fallen Brood, returns empty for a missing or fallen enemy, and rejects invalid reach values with `RangeError`.

## Amendment TR (2026-10-04) — two-ring board

**Status: accepted design amendment, not yet implemented.** Trigger: the user's two-ring decision of 2026-10-04 ([brief Decision record](../../docs/prototypes/poc-001-linked-formation.md#decision-record)) and the [P02 two-ring amendment](2026-10-02-2e228a2b-poc-001-formation-algebra.md#amendment-tr-2026-10-04--two-ring-board) (`T` = ring 2, `S` = ring 1). Execution: [Two-ring board task](2026-10-04-d005e5f4-poc-001-two-ring-board.md). This supersedes Amendment CT's mask cells, which describe delivered `40b516f`. The accepted inward-exposure decision is unchanged: sectors cover both Brood rings, now rings 1 and 2.

**Masks (P05 owns these definitions):**

- `sectorCells(s)` = `T[2s], T[2s+1], S[s]`: outer cells clockwise, then the ring-1 cell, which keeps Amendment CT's outer-then-inner order. These are the encounter-centred wedges from corner `T[2s]` clockwise.
- `frontMask(f)` = `sectorCells(f)` followed by `sectorCells((f+1) mod 6)`: six cells. Facing zero is `T0,T1,S0,T2,T3,S1` = `(2,0),(1,1),(1,0),(0,2),(-1,2),(0,1)`. Facing five is `T10,T11,S5,T0,T1,S0` = `(2,-2),(2,-1),(1,-1),(2,0),(1,1),(1,0)`.
- The six sectors are disjoint and partition the 18 cells of rings 1–2. Only the centre `(0,0)` is outside every mask.
- `turnCellsClockwise(frontMask(f))` equals `frontMask((f+1) mod 6)` element by element, because the turn advances `T` by 2 and `S` by 1.
- A front still covers two of six sectors, one third of the Brood cells (6 of 18, formerly 10 of 30).

**Recipient and protection tables (unchanged values).** Compact orientation `o` is exactly sector `o`. Spread places Ugallu, Girtablilu and Pazuzu in sectors `o`, `o+2` and `o+4`, as before. So every hand-written table keeps its delivered value:

- Fixture area (facing-zero front): Compact `[all, all, -, -, -, -]`. Spread `[U, U, P, P, G, G]`.
- Turned area (facing one): Compact `[-, all, all, -, -, -]`. Spread `[G, U, U, P, P, G]`.
- Warder facing-zero protection: attackers are protected exactly when they are fixture-area recipients.

The Architect checked this arithmetic with a disposable script outside the repository; the task's tests must restate it independently.

**Marks, splash and isolation.**

- A mark on Girtablilu anchors at `T[2o+1]` in Compact and `T[(2o+4) mod 12]` in Spread.
- Keep `SPLASH_RADIUS = 2`. Compact pairs are at distance 1, so a splash on any Compact Brood reaches all three. Spread pairs are at distance 4, so a splash reaches only its target. Radii 1–3 behave identically for both shapes. The board diameter is 4, so radius 4 or more would reach every Brood in any formation; 2 stays clear of that degenerate value.
- Protection checks the attacker's current cell, on either Brood ring, against the six-cell front.
- Isolation and active links are unchanged: Compact has no isolated Brood while two or more live, and in Spread every living Brood is isolated.

**Enemy anchors.** Amendment CT's statement "rings 0–1 remain enemy visual anchors outside every mask" is superseded. Ring 1 is now Brood space, inside masks. Only the centre is outside masks. By accepted user decision (2026-10-04), it is the enemy visual anchor, view-only and drawn as a cluster. Enemy cells carry no rule meaning: protection and masks are encounter-centred, and selectors never read enemy positions. Encounter layout is an open experiment question ([brief Open decisions](../../docs/prototypes/poc-001-linked-formation.md#open-decisions)). If a later experiment gives enemy cells rule meaning, that needs a separate mask proposal; it must not quietly change these selectors.

**Amended acceptance criterion 1:** a facing-zero front mask contains exactly `T[0],T[1],S[0],T[2],T[3],S[1]` in that order. A facing-five mask contains `T[10],T[11],S[5],T[0],T[1],S[0]`. The six sectors are disjoint and their union is exactly the 18 cells at radius 1 or 2. Criteria 2–6 are unchanged and are evaluated with the Amendment TR mapping.

## Amendment CT (2026-10-04) — Compact triangle

**Status: implemented and locally delivered on the radius-3 board; mask cells superseded by [Amendment TR](#amendment-tr-2026-10-04--two-ring-board).** Trigger: the user decision of 2026-10-04 ([brief Decision record](../../docs/prototypes/poc-001-linked-formation.md#decision-record)) places Compact Pazuzu on ring 2, using the mapping in the [P02 amendment](2026-10-02-2e228a2b-poc-001-formation-algebra.md#amendment-ct-2026-10-04--compact-triangle). Execution: [Compact triangle task](2026-10-04-fb4bf201-poc-001-compact-triangle.md). This supersedes the outer-ring-only sector and eligibility statements below, which describe delivered `f3a0e233`.

**Problem.** Delivered sectors contain outer-ring cells only, so an inward Brood could never be inside a protection front or a sector-built area. Compact Pazuzu would always ignore Warder protection, and a frontal sweep could never hit it. Neither outcome was chosen as a mechanic.

**Accepted user decision (2026-10-04; P05 owns the mask definition).** Sectors become encounter-centred wedges over the two Brood-occupiable rings. With `R` the outer ring and `T` the P02 ring-2 table:

- `sectorCells(s)` = `R[3s], R[3s+1], R[3s+2], T[2s], T[2s+1]`: outer cells clockwise, then ring-2 cells clockwise.
- `frontMask(f)` = `sectorCells(f)` followed by `sectorCells((f+1) mod 6)`: ten cells. Facing zero is `R[0..5]` plus `T[0..3]`, in the order `R0,R1,R2,T0,T1,R3,R4,R5,T2,T3`. Facing five is `R15,R16,R17,T10,T11,R0,R1,R2,T0,T1`.
- The six sectors partition rings 2 and 3 (30 cells). Rings 0–1 remain enemy visual anchors, outside every mask.
- `turnCellsClockwise(frontMask(f))` equals `frontMask((f+1) mod 6)` element by element. This holds because the turn advances `R` by 3 and `T` by 2, so Crosswind turns keep their order.

**Consequences (no other selector semantics change):**

- Fixed areas keep their stored cells. A Brood is a recipient exactly when its current cell, on either ring, is listed. Areas built from a front mask now include ring-2 cells.
- Compact orientation `o` lies wholly in sector `o`. Every hand-written recipient and protection table for the fixture area (facing-zero front) and turned area keeps its value. Compact is `[all, all, -, -, -, -]` for the area and `[-, all, all, -, -, -]` turned. Spread is unchanged.
- Marks follow their target's current cell. A Compact mark on Girtablilu now anchors at `R[3o+2]`, not `R[3o+1]`.
- Splash radius 2 still reaches all three Compact Brood. With every Compact pair at distance 1, radius 1 now does too.
- Protection checks the attacker's current cell, on either ring, against the ten-cell front.
- Isolation and active links are unchanged. With two or more living Brood, Compact has no isolated Brood.

**Amended acceptance criterion 1:** a facing-zero front mask contains exactly `R[0..5]` and `T[0..3]` in the declared order. A facing-five mask contains `R[15],R[16],R[17],T[10],T[11],R[0],R[1],R[2],T[0],T[1]`. The six sectors are disjoint and their union is exactly the 30 cells at radius 2 or 3. Criteria 2–6 are unchanged and are evaluated with the amended P02 mapping.

**Accepted user decision (2026-10-04):** the inward Brood is exposed to sector-based areas, sweeps and protection fronts exactly like the outer cells of its sector. The user rejected the alternative of a sheltered ring-2 slot.

## Smallest useful outcome

Pure selectors can explain which Brood a declared attack would hit in the current formation, whether an attacker is inside a protection sector, and exactly what changes when a facing is explicitly turned. No damage or enemy decision-making is implemented here.

## Starting source and ownership

Own proposed `src/core/intents.ts`, `src/core/sectors.ts`, and `tests/intents.test.ts`. Reuse P02's ring ordering and P03's entity IDs/state. P06 owns damage application; P08 owns choosing intentions; P10 owns rendering. These consumers must not duplicate masks or targeting calculations.

## Fixture and inputs

Use both P02 shapes at all six orientations. Declare a fixed area at facing zero, a direct mark on Girtablilu, a splash mark on Girtablilu, and a Warder protecting Censer at facing zero. Include an actor/target with zero HP and a facing wrap from five to zero.

Proposed outer sector `s` consists of `R[3s]`, `R[3s+1]`, `R[3s+2]`. The frontal protection/sweep mask at facing `f` covers sectors `f` and `(f+1) mod 6`: six outer cells. These are encounter-centred sectors, not line-of-sight cones emitted from the enemy sprite. Interior cell coordinates remain visual anchors for enemies; player eligibility is evaluated on the outer ring.

## Contracts and decisions

### Required contracts

A location-bound intention keeps its declared cells when the party maneuvers. A target-bound intention keeps its declared target ID and uses that target's current position at resolution. Merely selecting another target or recomputing a preview must not rewrite either intention. Ordered recipient results and explicit explanations must be available to both preview and resolution.

### Settled choices

Area and creature-targeted attacks are distinct. Crosswind may explicitly turn an enemy's facing and associated directional intention by one step. Contact attacks can reach central enemies without adjacency; directional protection reduces effectiveness rather than making all contact attacks illegal.

### Proposed implementation

Use a small intention union: `fixed-area`, `marked-hit`, and `marked-splash`. Store declared cells for fixed-area attacks plus whether the source's directional intention is explicitly turnable. Crosswind rotates only those turnable cells through P02's axial transform and emits a facing/intent-change event. Squad rotation does not. Other area effects remain fixed.

A splash affects its living marked target and living Brood within two hex steps of the target's current cell. Isolation means no other living Brood is Close. Zero-HP creatures do not grant active links or count as splash recipients. An intention from a fallen enemy is cancelled. A target-bound attack whose marked creature has fallen fizzles without retargeting, including its splash; expose this in the readout.

Warder protection is a relation from one living source to a designated living enemy. An incoming non-bypassing attack is protected when the Brood's current ring cell lies in that source's frontal mask. Do not recalculate the origin around the protected enemy. The mitigation amount is owned by P06/P07 tuning.

## Implementation checkpoints

1. **P05.C1** — Encode explicit sector and front-mask fixtures with stable cell ordering.
2. **P05.C2** — Define intention types and pure recipient/protection selectors using current live eligibility.
3. **P05.C3** — Implement the explicit one-step facing/turnable-area transform; keep target IDs unchanged.
4. **P05.C4** — Test maneuvers, deaths, boundaries, and wraparound against hand-written expected sets.

## Acceptance criteria

1. A facing-zero front mask contains exactly ring indices 0 through 5, and a facing-five mask contains 15, 16, 17, 0, 1, 2.
2. Rotating or expanding the squad leaves a stored fixed-area mask unchanged while changing its affected Brood when their positions enter or leave it.
3. A mark on Girtablilu remains on Girtablilu after every maneuver; its splash follows Girtablilu and excludes Brood farther than two steps away.
4. One explicit clockwise turn changes a turnable mask by one sector step and changes facing modulo six, but never changes marked target IDs or non-turnable areas.
5. A fallen source cancels its intention; a fallen marked target produces an empty recipient set and no replacement target.
6. Protection and isolation queries agree across all twelve states, including a fixture with one fallen Brood; all input snapshots remain unchanged.

## Verification and hand-back

Return exact executed commands, results, acceptance evidence, and limitations in the implementer's [mailbox](../mailbox/README.md) handoff; the Coordinator then records them in [TASK_LOGS](../TASK_LOGS.md), links that entry here, and updates [CURRENT](../CURRENT.md) when implementation facts change. The commands below remain proposed until their prerequisites supply them.

Run `just poc-001-test tests/intents.test.ts tests/formation.test.ts` and `just poc-001-typecheck`. Return exact mask/recipient examples before and after a maneuver and Crosswind, plus the documented distinction between committed areas and explicitly changed directional intentions. Test expected sets independently; do not build expected masks by calling the function under test.

## Non-goals and stop conditions

No AI, HP mutation, real lighting, physical shadows, line-of-sight simulation, arbitrary enemy movement, or generic area-template language. Stop at selectors and explicit intent transforms. If an intended boss pattern needs different geometry, draft a separate mask proposal instead of changing the semantics of every existing attack.
