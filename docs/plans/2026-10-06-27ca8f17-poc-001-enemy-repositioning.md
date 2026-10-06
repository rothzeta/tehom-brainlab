# Enemy relocation changes the threat origin without changing Brood movement

## Status and authority

P16, draft after P15 encounter integration in the [continuation](README-boss-experiments.md). The user authorizes enemies to move, explicitly excluding player walking and excluding relocation of the central boss. Between-round timing and a reserved-slot route are proposed implementations.

## Smallest useful outcome

A designated enemy changes its actual tile between responses, then declares a new attack from that tile; player maneuvers remain legal and unchanged. Sliding its sprite while rules retain the old origin fails acceptance.

## Starting source and ownership

Baseline `70b6ede002e6a09e31522d1343d29796672dfb28`, integrated after P15. Existing `src/core/sectors.ts` already provides enemy-origin fronts. RF reserves six ring-2 edge cells disjoint from every possible Brood cell, plus centre. `src/core/state.ts` distinguishes rotatability but has no relocation policy. `src/core/run-record.ts` currently demands distinct cells for all enemy records, including fallen ones. Proposed owner: `src/core/enemy-movement.ts`, with bounded integration in state, encounter end-phase dispatch, preview, records and view. Unassigned Implementer and integration Implementer.

## Fixture and inputs

Use the actual clockwise outer-edge sequence `(1,1),(-1,2),(-2,1),(-1,-1),(1,-2),(2,-1)`. Centre is not part of the route. One route step is a transition between reserved enemy slots, not a claim to move one adjacent hex. Test one anchored central boss, one roaming enemy, blocked neighbours, a fallen occupant, no legal destination and alternative enemy IDs. No new art or general navigation is required.

## Contracts and decisions

**Required:** cell change is pure authoritative state, never a renderer callback. Relocation capability is independent of `rotatable`: being turnable does not imply movable. No Brood cell, off-board cell, centre or occupied living enemy cell is a legal roaming destination. No player translation, pushes, collisions, opportunity attacks or path-crossing damage is introduced.

**Proposed timing:** resolve all current enemy attacks at their committed origins; expire round statuses and check terminal outcomes; perform permitted enemy relocations; then determine new facings/intentions and reset player budgets for the next player phase. The player therefore sees the new position and all its new threats before responding. An enemy never walks onto a new origin and fires an unannounced attack during the player's already committed response.

**Proposed route:** attempt the next clockwise slot, otherwise the immediately counterclockwise slot, otherwise stay. At most one relocation per mobile enemy per boundary; process multiple mobile enemies in stable encounter order. Only living occupants block. Keep fallen entities' last coordinates for logs but change record overlap validation to compare living occupancy, preserving unique entity IDs. An anchored entity never enters this route. Successful events include source ID, from/to cells and event identity; blocked movement records a deterministic reason without a fictitious cell change.

Old committed fixed areas are not translated in place. New areas are explicitly announced from the new origin. Crosswind remains facing control, not relocation cancellation. Version event ordering, state/record changes and occupied-cell semantics; reject incompatible prior records rather than silently reinterpret them.

## Implementation checkpoints

P16-1: define movement trait, route/destination selector and blocked/fallen occupancy behavior using the existing RF tables.

P16-2: integrate one deterministic between-round relocation event and new-origin declarations through the real end-phase transition, including preview and record validation.

P16-3: expose a diagnostic encounter/fixture with visible before/after origin and stable player controls; regress the immobile central boss and ordinary patrol.

## Acceptance criteria

1. A mobile enemy advances to the declared legal slot, while every player formation coordinate and allowance follows P13 unchanged.
2. An occupied clockwise slot produces the specified counterclockwise fallback or stay; no legal action can create overlapping living occupants or occupy any Brood slot.
3. A fallen blocker no longer reserves its cell, but its identity and historical position remain inspectable and serializable without violating the new validator.
4. Old attacks resolve from their committed origin. After relocation, new front/area cells are computed from the actual new tile and displayed before player input.
5. An anchored central boss never relocates even when turnable. A mobile non-turnable fixture can relocate without becoming a legal Crosswind target.
6. Terminal combat has no post-victory move/attack/reset; all movement events occur once and replay identically. Preview does not mutate live state.
7. A controlled same-facing attack has a different recipient set from two tested origins; sprite movement alone cannot satisfy the test.

## Verification and hand-back

Run the existing root test/typecheck/build/browser recipes and exported-record replay. Include destination/occupancy tables, a before/after browser capture and criterion mapping in `docs/mailbox/p16-enemy-repositioning/implementer.md`; record exact revisions and checks, not assumed results. Test source-relative rules rather than screenshots alone.

## Non-goals and stop conditions

No A*, free-grid locomotion, mid-player-phase movement, displacement of Brood, arbitrary enemy teleportation or new terrain. Do not make every existing enemy mobile merely because the capability exists. Report clipping, dead-origin or stale-telegraph ambiguity before integrating P17. Optional path animation must not add unmodelled intermediate gameplay.
