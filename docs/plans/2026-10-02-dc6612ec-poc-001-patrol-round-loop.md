# Complete a deterministic Warder–Censer–Harrier encounter through terminal outcome

## Status and authority

**P08. Implemented, independently reviewed (no findings), accepted, locally delivered.** [Implementation evidence](../mailbox/p08-patrol-round-loop/implementer.md), [independent review](../mailbox/p08-patrol-round-loop/reviewer.md). Depends on [P05](2026-10-02-d66a7452-poc-001-intent-semantics.md), [P06](2026-10-02-4c3c0d42-poc-001-damage-and-fallen.md), and [P07](2026-10-02-f8938420-poc-001-brood-abilities.md). Baseline: `79f9498051df0281e6e9d3c904e9eee32f014873`.

Authority: [brief Ordinary patrol, Round structure, and wounded starting conditions](../../docs/prototypes/poc-001-linked-formation.md). All HP values, damage, targeting ties, and resolution ordering below are proposed reproducible fixture defaults, not settled balance. See the [index](README.md) for authority labels and local ADRs.

**Amended 2026-10-04 (two-ring board):** see [Amendment TR](#amendment-tr-2026-10-04--two-ring-board). The proposed enemy cells in the fixture table are superseded.

**Amended 2026-10-05 (enemies on tiles):** see [Amendment RF](#amendment-rf-2026-10-05--enemies-on-tiles). Enemies stand on alternating ring-2 edge tiles and announce marks within a reach. It supersedes the TR centre anchor. Not yet implemented.

Delivery sequence: [P01–P12 index](README.md). Governing format: [ADR-0002](../adr/0002-plan-filenames.md) and [ADR-0003](../adr/0003-implementation-plan-writing.md).

Task `P08` owner and integration owner: POC 001 implementer, currently unassigned. This plan is one standalone task; its sequential checkpoints inherit the prerequisites, affected components, acceptance criteria, verification, and hand-back defined here. Checkpoint identifiers remain stable on edits. The Coordinator records actual execution in [TASK_LOGS](../TASK_LOGS.md) from the implementer's mailbox handoff; no execution evidence exists yet.

## Amendment RF (2026-10-05) — enemies on tiles

**Status: design amendment, not yet implemented.** Trigger: the user decisions of 2026-10-05 ([brief Decision record](../../docs/prototypes/poc-001-linked-formation.md#decision-record)) and the [P02](2026-10-02-2e228a2b-poc-001-formation-algebra.md#amendment-rf-2026-10-05--ring-formation-and-enemy-cells)/[P05](2026-10-02-d66a7452-poc-001-intent-semantics.md#amendment-rf-2026-10-05--fronts-protection-and-reach-from-enemy-tiles) RF amendments. Execution: [Ring formation task](2026-10-05-c6399cb6-poc-001-ring-formation.md). It supersedes the TR "Replacement" bullet (no board cell, shared centre anchor, no rule reads an enemy cell). The user asked the Architect to propose placement; everything below is provisional P08 content, to be checked by the user's next manual test.

**Content (`patrol-v2`).**

| Enemy | Cell | Facing | Rotatable | Notes |
|---|---|---|---|---|
| Warder | `(1,-2)` = `T9`, top | 0 | yes | Protects Censer from Brood in `frontCells((1,-2), 0)` = `T11, T10, S0, centre, S5`. |
| Censer | `(-2,1)` = `T5`, lower left | 4 | no | Facing has no rule effect (not a protection source, declares no area). |
| Harrier | `(1,1)` = `T1`, lower right | 2 | no | Facing has no rule effect. |

- The three facings are the same relative facing: each front points into the arena, and its bisector points at an adjacent ring-1 cell. Warder keeps facing 0, the `patrol-v1` value.
- `PatrolRules` gains `enemyReach` (default 2), saved in the snapshot like `splashRadius`. Remove `PATROL_VIEW_ANCHOR`: enemies have real cells.
- HP, damage, resolution order, protection relation and the three presets are unchanged. `PATROL_VERSION` becomes `patrol-v2`.

**Announcement with reach.** At each announcement, each living enemy forms its candidate list from P05 `broodInReach(state, enemyId, enemyReach)`. If that list is empty, it uses all living Brood. The existing rules then apply to that list unchanged: Warder marks the first candidate in roster order; Censer scans the round-indexed `[girtablilu, pazuzu, ugallu]` cycle for the first candidate; Harrier marks the candidate with the lowest HP ratio, with roster-order ties. Reach is checked only at announcement. Marks then follow their creature to impact; a maneuver never cancels or retargets an announced mark. Censer splash and Harrier isolation are still selected at impact through P05 and do not use reach.

**Initial intentions (computed).** At the Compact orientation-0 start, Warder reaches Pazuzu (1) and Ugallu (2), Censer reaches Girtablilu (1) and Pazuzu (2), and Harrier reaches Ugallu (1) and Girtablilu (2). The round-one marks are therefore identical to `patrol-v1` in all three presets: Warder → Ugallu, Censer → Girtablilu, Harrier → Ugallu (healthy and wounded Ugallu) or Girtablilu (wounded Girtablilu). Criterion 2 keeps its values, and the first decision of each attempt stays comparable with the 2026-10-05 AI playtests. From round two the formation at the end of the player phase decides each enemy's candidates. Example (healthy, all at full HP, round 2): after Expand at orientation 0, the marks are Warder → Pazuzu, Censer → Girtablilu, Harrier → Ugallu; held in Compact 0, Warder → Ugallu, Censer → Pazuzu, Harrier → Ugallu.

**Placement argument (computed, not asserted).** A disposable script outside the repository enumerated every Brood–enemy distance in all twelve states for three classes of three-enemy edge layouts (all others are rotations or mirror images of these): alternating `{T1, T5, T9}`, clustered `{T1, T3, T5}` and mixed `{T1, T3, T7}`.

- *Averages cannot choose a layout.* The six rotations carry each Brood through every ring-1 cell and every corner exactly once, so any layout gives every Brood the same exposure averaged over orientations. The script confirms it for all three classes: mean distance to the enemies 2.333, mean adjacent enemies 1.000, and mean enemies within two steps 1.500, for every Brood. The user's "mathematical argument for average distribution" therefore holds for every layout and decides nothing.
- *What differs is exposure in a single state*, which is what one maneuver changes. Alternating: in every one of the twelve states each Brood has exactly one adjacent enemy, and distances `{1,2,3}` (Compact) or `{1,3,4}` (Spread) to the three enemies. Each Brood is within reach of 2 enemies in Compact and 1 in Spread, so the spread across Brood is 0 in every state. Clustered: a Brood is within reach of 0 to 3 enemies, with a spread of 2 in every state; in Spread one Brood is out of every enemy's reach. Mixed: spread 1 on average, 2 at most.
- *Consequence.* With alternating enemies, a maneuver changes which enemy faces which Brood (a pairing), never how many threats a Brood faces. Each edge cell touches exactly one Brood in every state, and Expand/Contract keep the pairing. Orientations pair up as `{0,1}`, `{2,3}` and `{4,5}` with the same pairing. From any orientation one rotation keeps the pairing and the other shifts it, so every round offers two of the three pairings. No orientation hides a Brood. A clustered layout instead creates a front and a back rank; in Spread it lets one Brood stand out of reach of all three enemies.

**Recommendation: one alternating layout for all three presets.**

1. Alternating gives every orientation equal exposure, so position works as Darkest-Dungeon-style pairing (who faces whom) rather than as a hiding puzzle. The triangle formation and the triangle of enemies share the board's three-fold symmetry, so no orientation is strictly dominated.
2. It does not add a "Spread and hide the wounded Brood" line on top of the Spread advantages the playtests already found.
3. The round-one marks equal `patrol-v1`, so the change is comparable with the nine recorded attempts.
4. The presets stay HP-only. Giving each preset its own layout would confound starting HP with layout and break the brief's wounded-start comparison.

The clustered layout is the documented candidate for a second "flank" scenario after this round (open question RF-Q2 in the task). The patrol does not use the centre, which stays the boss tile.

**Placement constraint.** Enemies stand only on distinct `ENEMY_CELLS` cells and never on a Brood cell. An enemy on an unused ring-1 cell or corner would make some orientations illegal, need a collision rule (the brief excludes collision resolution) and turn maneuvers into a movement puzzle. Since no Brood cell is ever occupied by an enemy, every maneuver legal before remains legal.

**Amended acceptance criteria.** Criterion 1 additionally requires each enemy's documented cell and facing, and distinct `ENEMY_CELLS` placement. Criterion 2 keeps its round-one values at the default reach. Add RF-5: with `enemyReach` 2, the announced marks after a maneuver follow the reach rule above (hand-written expectations, including the round-2 examples), and an enemy with no Brood in reach falls back to all living Brood.

## Amendment TR (2026-10-04) — two-ring board

**Status: draft amendment; not implemented.** Trigger: the user's two-ring decision ([brief Decision record](../../docs/prototypes/poc-001-linked-formation.md#decision-record)) and the [P02](2026-10-02-2e228a2b-poc-001-formation-algebra.md#amendment-tr-2026-10-04--two-ring-board)/[P05](2026-10-02-d66a7452-poc-001-intent-semantics.md#amendment-tr-2026-10-04--two-ring-board) two-ring amendments. Board task: [Two-ring board](2026-10-04-d005e5f4-poc-001-two-ring-board.md).

- **Enemy anchors (superseded).** The proposed Warder `(0,-1)`, Censer `(-1,1)` and Harrier `(1,0)` are ring-1 cells. On the two-ring board these are exactly Compact Pazuzu's cells at orientations 4, 2 and 0. At the proposed `patrol-v1` start (Compact orientation zero), Harrier would share Pazuzu's cell `(1,0)`.
- **Replacement (accepted user decision, 2026-10-04).** Patrol content gives enemies no board cell. All patrol enemies use the centre `(0,0)` as their shared visual anchor, and P10 owns any pixel offsets that keep them readable as a cluster. No rule reads an enemy cell: protection, masks and intentions are encounter-centred through P05. Encounter layout is an open experiment question ([brief Open decisions](../../docs/prototypes/poc-001-linked-formation.md#open-decisions)). Do not encode a final enemy-placement rule. If content needs a placeholder field, mark it view-only.
- **Unchanged.** HP, damage, targeting, round cadence, Warder facing 0 and the three presets are unchanged. Censer splash radius 2 hits all three Compact Brood and only its target in Spread (distance 4). Harrier's isolated bonus applies to every living Spread Brood and to no Compact Brood while two or more live. These are the same qualitative contrasts P05 already specifies.

## Smallest useful outcome

A headless combat session can announce intentions, accept player actions/maneuvers, resolve one enemy phase, repeat, and finish in victory or defeat. The same commands and fixture always produce the same result.

## Starting source and ownership

Own proposed `src/content/patrol.ts`, `src/core/rounds.ts`, and `tests/patrol.test.ts`; register `endPhase` in P03. Reuse P05/P06/P07 instead of duplicating targeting or damage. Own three factory presets, not a new procedural encounter system. P10 supplies the playable interface.

## Fixture and inputs

Proposed `patrol-v1` starts at round 1, Compact orientation zero, with fresh budgets and no statuses.

| Entity | Maximum/starting HP | Position or behavior |
|---|---|---|
| Ugallu | 18/18 | Brood slot 0. |
| Girtablilu | 14/14 | Brood slot 1. |
| Pazuzu | 14/14 | Brood slot 2. |
| Warder | 12/12 | `(0,-1)`, facing 0; protects Censer while both live. |
| Censer | 10/10 | `(-1,1)`; marked splash, raw damage 3, radius 2. |
| Harrier | 13/13 | `(1,0)`; marked hit, 4 damage or 7 if isolated at impact. |

Warder also declares a 3-damage hit. Wounded presets change only Ugallu's starting HP to 7, or only Girtablilu's to 5; maximum HP stays unchanged. Numeric defaults live in content, not tests or UI copies.

## Contracts and decisions

### Required contracts

Announce the full surviving enemy intention set before player input. Do not silently retarget during the player phase or enemy resolution. An enemy defeated before its action does not act. Each attack settles through P06 before the next enemy acts. Terminal outcomes stop remaining resolution. A nonterminal next round resets each living Brood's action availability and exactly one maneuver allowance, with no banking.

### Settled choices

Player activations may occur in any order, with one shared maneuver before/between/after. The patrol combines directional protection, proximity splash, and isolation pressure. Normal, wounded-Ugallu, and wounded-Girtablilu starts are required experiments. The ordinary encounter precedes the boss.

### Proposed implementation and fixture decisions

Resolve surviving enemies in explicit order Warder, Censer, Harrier, independent of object/dictionary iteration. Warder marks the first living Brood in `[ugallu,girtablilu,pazuzu]`. Censer cycles `[girtablilu,pazuzu,ugallu]` by round, scanning forward to the next living candidate if necessary. Harrier marks the lowest current-HP/max-HP ratio at announcement, with ties in fixed roster order; compare ratios by integer cross multiplication. These selections remain locked until the next announcement.

Persist Warder facing between rounds, including Crosswind changes. Select Censer's splash recipients and Harrier's isolation damage only at impact through P05. Expire remaining Shelter after the enemy phase and before new intentions are announced.

`endPhase` may forfeit unused Brood actions; it is a deliberate choice, not a new ability. The public command resolves the enemy phase and next announcement atomically, returning ordered events for later animation. It increments public revision once. Rejected/terminal calls change nothing. Factories create independent state for reset; no HP or facing leaks between attempts.

## Implementation checkpoints

1. **P08.C1** — Add the three factories and exact, inspectable content defaults.
2. **P08.C2** — Implement deterministic announcement and stable target selection, including ties and fallen candidates.
3. **P08.C3** — Implement end-phase resolution, cancellation, expiry, terminal checks, and next-round budgets.
4. **P08.C4** — Author actual winning and losing command traces after running the implementation; retain their fixtures as regressions rather than assuming this draft proves winnability.

## Acceptance criteria

1. Each fresh preset yields its documented HP and independent state; only the specified wounded starting HP differs between presets.
2. Round-one targets are Warder→Ugallu, Censer→Girtablilu, Harrier→Ugallu for the healthy preset; wounded presets change Harrier's mark according to the stated ratio rule.
3. Moving the squad does not retarget marks; Compact splash and Spread isolation damage differ exactly as P05 specifies.
4. Killing Warder immediately removes its protection and cancels its pending action; killing any other enemy cancels only that enemy's future action.
5. End phase resolves the declared order, expires Shelter, and either enters the correct terminal state or announces the next round with reset, unbanked budgets.
6. Ending early forfeits unused actions without granting them next round; no action is resolved twice by a repeated stale command.
7. At least one executed healthy-patrol winning trace and one executed defeat trace are stored with exact initial fixtures and expected final state; repeat runs produce identical events.

## Verification and hand-back

Return exact executed commands, results, acceptance evidence, and limitations in the implementer's [mailbox](../mailbox/README.md) handoff; the Coordinator then records them in [TASK_LOGS](../TASK_LOGS.md), links that entry here, and updates [CURRENT](../CURRENT.md) when implementation facts change. The commands below remain proposed until their prerequisites supply them.

Run `just poc-001-test tests/patrol.test.ts tests/abilities.test.ts tests/damage.test.ts` and `just poc-001-typecheck`. Return factory definitions, targets per tested round, the actual traces, and terminal outputs. A trace failure may require proposing a fixture change; version and document it. Do not convert a headless win into a claim of interesting decisions or human playtest success.

## Non-goals and stop conditions

No boss, procedural encounters, adaptive AI, pathfinding, tactical retreat, campaign, or endless balance sweep. Stop when the patrol loop is complete and reproducible. If no credible winning trace exists, investigate rules/fixtures before UI work; do not invent a passed trace or weaken terminal invariants to obtain one.
