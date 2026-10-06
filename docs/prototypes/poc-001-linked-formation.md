# POC 001 — Linked formation

**Status:** specified experiment. Delivered state is recorded in [CURRENT](../CURRENT.md); this paragraph does not restate it. AI-directed playtests of the delivered patrol were recorded on 2026-10-05 ([reports](../mailbox/ai-playtest-20261005/)); they are not human playtests. The ring formation and enemies on tiles (user decision, 2026-10-05; see [Decision record](#decision-record)) are specified in the [ring-formation task](../plans/2026-10-05-c6399cb6-poc-001-ring-formation.md), which is now delivered. The 2026-10-06 boss experiments (user decision; see [Decision record](#decision-record)) are specified in P13–P17 ([plan index](../plans/README.md#boss-experiments-p13p17)) and are not yet implemented.

**Basis:** the POC accepted in the TEHOM planning conversation, 2 October 2026. Initial tuning and unresolved mechanics are identified below rather than presented as playtest findings.

## Question

Does changing the squad's shape make attacking, protecting, and choosing targets more interesting without creating useless turns?

The experiment tests whether three Brood attacking individually but moving as a linked formation deserve to replace the earlier fixed Apex/Shadow combat model. A grid is not a goal by itself.

## Scope

| Element | Initial scope |
|---|---|
| Arena | Central hex plus two surrounding rings: 19 cells *(accepted user decision, 2026-10-04; replaces three rings and 37 cells. See [Decision record](#decision-record).)* |
| Party | Ugallu, Girtablilu, Pazuzu |
| Abilities | Two per Brood; six total |
| Maneuvers | Rotate left, rotate right, expand/contract *(2026-10-06: one rotation and one shape change per player phase, each with its own allowance; P13)* |
| Legal configurations | Two shapes times six orientations |
| Ordinary encounter | Warder, Censer, Harrier patrol, each standing on its own outer-ring edge tile *(user decision, 2026-10-05)* |
| Boss | ~~One Foundry Mechanism~~ *(superseded 2026-10-06 by user decision)*: two boss experiments, the anchored two-phase Crucible on the centre (P15) and the roaming Collector with a Warder and a Censer (P17) |
| Presentation | Labelled tokens and generated geometry first |
| Technology target | TypeScript + Phaser + Vite + Vitest; no backend |

## Formation rules

This is still mostly a Darkest Dungeon game, not an XCOM game *(user, 2026-10-05)*. Position works like Darkest Dungeon ranks: where each Brood stands relative to each enemy changes who can be protected against and which shared maneuver is worth spending. Reach is ability-specific and will be designed later with the abilities. It is not a puzzle-movement game. The only Brood movement is the shared formation maneuver; there is no individual movement. *(2026-10-06, user decision: designated enemies may relocate between rounds along the six edge slots (P16); the Brood still never walk, and the central boss never moves.)*

The board is the centre plus two rings: ring 1 (6 cells, table `S`) and ring 2 (12 cells, table `T`, whose even indices are corners and odd indices are the single edge cell between two corners). Its cells divide into two fixed kinds:

- **Brood cells** (12): every ring-1 cell and the six ring-2 corners. Only Brood stand here.
- **Enemy cells** (7): the six ring-2 edge cells and the centre. Only enemies stand here. The centre is the boss tile; the ordinary patrol does not use it.

No Brood ever occupies the centre or an edge cell, and no enemy ever occupies a Brood cell. Maneuvers are therefore never blocked, and there is no collision rule. *(The centre rule is a user decision, 2026-10-05. Keeping enemies off Brood cells is the Architect's recommendation in the [ring-formation design](../plans/2026-10-05-c6399cb6-poc-001-ring-formation.md), provisional until the user's next manual test.)*

- **Compact:** "around the rotation point" (user, 2026-10-05). The Brood stand on alternating ring-1 cells: Ugallu `S[o]`, Girtablilu `S[o+2]`, Pazuzu `S[o+4]`. They form a triangle around the empty centre, every pair at distance 2. *(User decision, 2026-10-05; supersedes the sector-aligned triangle of 2026-10-04.)*
- **Spread:** "wide around" the middle. Each Brood stands on the ring-2 corner directly behind its Compact cell: Ugallu `T[2o]`, Girtablilu `T[2o+4]`, Pazuzu `T[2o+8]`, pairwise distance 4. These are the same corner cells as before.
- **Rotate:** turn the whole triangle one 60-degree step clockwise or anticlockwise around the centre.
- **Expand / contract:** Expand moves every Brood one radial step outward, from `S[k]` to the corner `T[2k]` behind it. Contract reverses this. Orientation, roster identity and the clockwise order Ugallu → Girtablilu → Pazuzu around the centre are preserved.

There is no independent movement, squad translation, pursuit, pathfinding, collision resolution, opportunity attack, or damage from crossing a telegraph during a maneuver. Only destination states determine the rules.

The exact mapping, all twelve labelled states and their reversibility are in the [P02 ring-formation amendment](../plans/2026-10-02-2e228a2b-poc-001-formation-algebra.md#amendment-rf-2026-10-05--ring-formation-and-enemy-cells). All twelve labelled states are retained even where occupied-cell sets coincide (Compact and Spread orientations `o`, `o+2` and `o+4` share cells with different labels).

### Enemies on tiles

By user decision (2026-10-05), every enemy stands on a real tile, and each enemy's front and protection derive from its own tile and facing. The formation's position relative to each enemy therefore matters, through the shared maneuvers only. Reach is ability-specific and will be designed later together with the abilities (user decision, 2026-10-05).

- **Front:** an enemy facing `f` watches the same six-cell wedge that a centre enemy would, carried to its own tile and clipped to the board. A centre (boss) enemy keeps exactly the delivered encounter-centred front.
- **Protection:** a Warder protects its ward against non-bypassing attacks from Brood standing in the Warder's own front.
- **Reach:** no generic reach rule in this round. Enemy targeting and marking keep their delivered behaviour and read no cells. Reach will be ability-specific, designed later together with the abilities *(user decision, 2026-10-05)*. Marks still follow their creature until impact.
- **Areas:** a turnable area turns around its source's tile.
- **Unchanged:** every Brood contact attack still reaches every enemy wherever it stands; links, isolation and splash are measured between Brood; rotation and Expand/Contract still pivot on the centre.

The default patrol layout and its rationale are in the [P08 ring-formation amendment](../plans/2026-10-02-dc6612ec-poc-001-patrol-round-loop.md#amendment-rf-2026-10-05--enemies-on-tiles). Rule details are in the [P05 ring-formation amendment](../plans/2026-10-02-d66a7452-poc-001-intent-semantics.md#amendment-rf-2026-10-05--fronts-protection-and-areas-from-enemy-tiles).

### Links

All three links remain visible. The initial test threshold is Close at two hex steps or less and Stretched beyond that. Compact makes all links Close (each is distance 2); Spread makes them Stretched (each is distance 4).

This first version deliberately tests shared formation stances, not independently adjustable links or asymmetric formations. The threshold is provisional, not balanced. Compact now sits exactly on the threshold, so a threshold below 2 would make Compact Stretched.

## Round structure

1. Enemies announce intentions.
2. The player activates each Brood once, in a chosen order.
3. The player may use one shared formation maneuver before, between, or after those activations. *(2026-10-06: one rotation and one shape change, in either order; P13.)*
4. Surviving enemies resolve their intentions.
5. Begin the next round.

The initial maneuver has its own once-per-round allowance and does not consume a Brood's ability action. It cannot be banked. Remaining in the current formation is valid. *(2026-10-06: the single allowance is split into a rotation allowance and a shape-change allowance, both refreshing every player phase; provisional default, P13.)*

Area attacks stay committed to marked cells. Targeted attacks follow their marked creature. Preview and presentation must distinguish them.

Use fixed damage and guaranteed hits initially. Numeric values, enemy resolution ordering, and defeat handling are still implementation decisions.

## Test abilities

These are provisional test kits, not final character designs.

| Brood | Reliable action | Tactical action |
|---|---|---|
| Ugallu | **Claw:** damage one enemy | **Shelter:** reduce the next hit against one Close-linked ally; the link must still be Close at impact *(2026-10-06, P14: reduces by 4; may target Ugallu itself, with no link needed; no stacking)* |
| Girtablilu | **Sting:** damage one enemy | **Impale:** stronger strike that ignores directional protection while both links are Stretched *(2026-10-06, P14: keeps 6 damage but no longer ignores protection; needs at least one living partner, with every link to a living partner Stretched)* |
| Pazuzu | **Gale:** modest damage bypassing directional protection | **Crosswind:** turn one enemy's facing and associated directional intention by one orientation step |

Basic contact attacks can reach every enemy wherever it stands, with a lunge-and-return animation. They do not require literal tile adjacency and do not move the attacker permanently. *(2026-10-05: enemies now stand on tiles; this contact reach is unchanged.)*

Directional protection can reduce attack effectiveness without making ordinary contact attacks universally illegal. Every Brood should retain a worthwhile contribution in either shape, though its ideal action or preferred target may be unavailable.

## Ordinary patrol — build first

**Warder:** protects another enemy against attacks from Brood standing in its own front, measured from its tile. Rotation or Crosswind can change attack access.

**Censer:** marks a Brood and later damages that creature plus nearby Brood. The mark follows its target. Spreading reduces splash; rotating a compact formation does not remove the mark.

**Harrier:** declares a targeted attack that becomes more dangerous if the victim is isolated when it resolves. It challenges the assumption that spreading is always safe.

The intended question is: which threat do I solve with formation, and which do I solve with abilities and target priority?

Replay this patrol with a healthy party, wounded Ugallu, and wounded Girtablilu. Damage values and targeting rules require testing; the proposed composition is not yet demonstrated to be balanced.

Since 2026-10-05 the patrol stands on three alternating ring-2 edge tiles, one on each side of the triangle: Warder `(1,-2)`, Censer `(-2,1)`, Harrier `(1,1)`. All three presets use this one layout, so the wounded comparisons stay comparable. A layout clustered on one side ("flank") is the next scenario, not part of this round. Both are accepted user decisions (2026-10-05); the exact cells and facings are provisional P08 content ([P08 ring-formation amendment](../plans/2026-10-02-dc6612ec-poc-001-patrol-round-loop.md#amendment-rf-2026-10-05--enemies-on-tiles)).

## Directional boss — build second

*Superseded 2026-10-06 by user decision (see [Decision record](#decision-record)). P12 was never implemented. Two boss experiments replace it: the Crucible ([P15](../plans/2026-10-06-6dcd120b-poc-001-two-phase-central-boss.md)) and the Collector ([P17](../plans/2026-10-06-79371edf-poc-001-roaming-boss-and-adds.md)). The text below is retained as history.*

The Foundry Mechanism tests directional protection, a committed sweep across marked sectors, and a marked-target blast that splashes nearby Brood. Do not add a phase tree or large ability library.

The encounter should create competition between rotating, spreading, maintaining protection, and spending an individual action on Crosswind. If rotating once solves every turn, revise the boss rather than treating it as proof of the combat model.

## Presentation requirements

Before committing a maneuver, show destination positions, changed links, protection gained or lost, affected threats, and enabled or disabled abilities.

Keep creature art upright while positions change. Show enemy facing separately. Generate the board, links, telegraphs, and UI in code.

Previews must run the same rules as committed commands without mutating live state. An unclear or inaccurate preview invalidates the playtest.

## Implementation order

1. Define hex coordinates, legal formations, reversible maneuvers, and pure state tests.
2. Build the one-screen board with selectable placeholders and maneuver previews.
3. Add deterministic actions, intentions, damage, and the ordinary patrol.
4. Test the patrol under different starting conditions and record observations.
5. Add the directional boss only after ordinary combat produces useful decisions. *(2026-10-06: the user lifted this gate by explicit decision after the manual RF round; see [Decision record](#decision-record).)*
6. Reintroduce a small exposure/attrition pressure and compare with a fair Apex/Shadow reference.

## Acceptance questions

- Does formation change target priority, ability choice, or activation order?
- Can every Brood contribute meaningfully from both shapes?
- Is holding formation sometimes correct?
- Is there an automatic compact/attack/spread/contract loop?
- Does the ordinary patrol make players want another attempt?
- Would removing formation changes remove decisions players value?

A fair comparison must preserve the original model's own strengths: Glare pressure, productive rotation, and choosing who remains exposed. Merely freezing this arena is not an Apex/Shadow reference implementation.

## Initial tests to implement

- The radius-two board has exactly 19 unique cells.
- All twelve labelled formation states are legal; occupied cells do not overlap.
- Six rotations restore the original labelled configuration.
- Rotation followed by its inverse restores state.
- Expansion and contraction preserve identity, order, and orientation.
- The initial link threshold produces the intended Compact and Spread states.
- Each living Brood acts at most once per player phase; only one shared maneuver is allowed. *(2026-10-06: at most one rotation and one shape change; P13.)*
- Area intentions remain location-bound while targeted intentions retain their target.
- Shelter checks the link when damage resolves, not only when applied.
- Preview leaves original state unchanged and agrees with the committed transition.

The first six formation checks are implemented and pass in the P02 candidate (90 focused tests, 3,349 assertions), alongside the unchanged two P01 tests. [Verification evidence](../mailbox/p02-formation-algebra/verification.md) identifies the tested revision. Activation limits, intentions, Shelter resolution, and combat preview/commit equivalence remain planned checks; no passing combat test suite or human playtest exists yet.

## Open decisions

Numeric balance, enemy intention tie-breaking, the definition of isolation, and how formation behaves after a Brood falls must be specified before calling the combat loop complete. The 2026-10-05 decisions below replace the earlier inward-Pazuzu exposure question: every Compact Brood is on ring 1, and fronts are measured from each enemy's tile.

**Encounter layout (partly resolved 2026-10-05).** Enemies now stand on tiles, and their cells carry rule meaning (user decision, 2026-10-05). Ordinary enemies use ring-2 edge cells and the centre is the boss tile. Still open as experiment questions: other patrol layouts (for example clustered on one side), whether a boss ever stands off the centre, and ability-specific reach (to be designed with the abilities). P02 resolves exact coordinate presets and initial Close threshold two as experimental defaults, documented with sources in its [handoff](../mailbox/p02-formation-algebra/implementer.md); they remain provisional rather than playtest findings. Record later initial values as experimental defaults.

## Decision record

**2026-10-06 — Boss experiments, split maneuvers and kit revision (accepted; source: user decision, 2026-10-06).** After playing the delivered RF build, the user reported: "the proto is fine, the patrols and their attack pattern did not require making use of movement." The cause is confirmed in source: patrol targeting never reads positions. The Warder marks the first living Brood in roster order, the Censer cycles, and the Harrier picks the lowest HP ratio. An external design review proposed a continuation (draft PR #1, commit `71cc26c`, written from source inspection only). The user accepted it with these decisions:

1. **Adopt P13–P17 as the roadmap; P12 is superseded.** The directional boss will not be built separately. The user lifted the P11 boss gate by explicit decision, based on their manual RF round. The historical P11 gate stays **HOLD** and is not marked PASS.
2. **Build all of P13–P17 before the user's next manual round.**
3. **The drafts' numbers are provisional defaults**, implemented as written and kept in their owning content/core modules. Tests must not freeze them:
   - one rotation plus one shape change per player phase, both refreshing every round;
   - Shelter reduces by 4 and may target self;
   - Impale keeps 6 damage and loses its protection bypass, and is no longer tied to exactly two living partners;
   - phase two starts at 50% boss HP, from the next declaration;
   - the drafts' HP, damage, patterns, the six-slot route and the add composition.

This changes the accepted POC scope in three ways:

- **Bosses.** Two boss experiments replace the one directional boss: the Crucible, anchored on the centre with two phases ([P15](../plans/2026-10-06-6dcd120b-poc-001-two-phase-central-boss.md)), and the Collector, roaming the edge slots with a Warder and a Censer ([P17](../plans/2026-10-06-79371edf-poc-001-roaming-boss-and-adds.md)).
- **Enemy movement.** Designated enemies may relocate between rounds ([P16](../plans/2026-10-06-27ca8f17-poc-001-enemy-repositioning.md)), replacing "enemies never move".
- **Maneuvers.** The single shared allowance is split ([P13](../plans/2026-10-06-e8cec63d-poc-001-split-maneuver-budgets.md)), and the kit is revised ([P14](../plans/2026-10-06-6a0ebcdc-poc-001-tactical-kit-revision.md)).

Standing direction is unchanged: Darkest Dungeon rather than XCOM; the Brood never walk individually and move only through the shared maneuvers; the centre is reserved for a boss; there is no generic reach rule.

The Architect's provisional choices are in the plans and the [index](../plans/README.md#boss-experiments-p13p17): encounter routes `?play=crucible` and `?play=collector`; old attempt records rejected rather than migrated; the Collector add facings. The Architect also computed findings for the user's next round:

- With the drafted facing cadence, a static formation dodged every Crucible primary attack in each phase. **Follow-up decision (user, 2026-10-06):** apply the Architect's lever, so the Crucible's facing advances only on beat-B (directional) declarations and the safe orientation keeps shifting within a phase. Recomputed: no formation dodges everything in either phase ([P15](../plans/2026-10-06-6dcd120b-poc-001-two-phase-central-boss.md#balance-hypotheses-computed-for-the-manual-round)).
- The Collector's ward blinks in and out of range on alternate rounds.
- Its sweep can always be dodged with one maneuver.

The round's checklist is in [P17](../plans/2026-10-06-79371edf-poc-001-roaming-boss-and-adds.md#combined-manual-test-checklist-user-round-after-p17).

**2026-10-05 — Ring formation and enemies on tiles (accepted; source: user decision, 2026-10-05).** After three AI playtesters won all nine attempts ([reports](../mailbox/ai-playtest-20261005/)), the user added two findings. The user's words, lightly cleaned:

> The triangle should be spread on one ring, and extend should mean going to the other ring. So compact should be on the first ring, extend on the other ring. … It would mean that they would always be around the rotation point, because in their compact stance there would be the center tile that is always unoccupied, which would work well if we put a boss type enemy in there from time to time. The second problem I found is why are the enemies not on tiles but seemingly floating around? So in my heart, this is still mostly a Darkest Dungeon game rather than an XCOM game, which is why it's not a puzzle movement game, although I do want a little bit of movement impacting the game.

The user confirmed these decisions:

1. **Formation.** Compact puts the Brood on alternating ring-1 cells, Ugallu `S[o]`, Girtablilu `S[o+2]`, Pazuzu `S[o+4]`: a triangle around the centre with every pair at distance 2. Expand moves each Brood one radial step outward to the ring-2 corner behind it, giving the corner triangle at distance 4; Contract reverses this. Rotation turns the triangle around the centre. The centre is never occupied by Brood; it is reserved for an occasional boss-type enemy. This supersedes the sector-aligned Compact (`T[2o], T[2o+1], S[o]`) and the inward-Pazuzu slot of 2026-10-04. Spread stays on the ring-2 corners, and Close threshold 2 is kept.
2. **Enemies stand on real tiles**, replacing the view-only centre anchor of 2026-10-04.
3. **Rules follow tiles.** Each enemy's front, protection and reach derive from its own tile and facing, so the formation's position relative to each enemy matters. The only movement is the shared maneuvers: no individual movement and no puzzle movement. *(Reach was later deferred to ability design; see the answers below.)*
4. **Enemy placement** was delegated to the Architect for a proposal.

The intent is Darkest-Dungeon-style positional ranks, not tactical movement. Position should change who is protected against and which maneuver is worth its allowance, without turning maneuvers into a movement puzzle.

The Architect's proposals, provisional until the user's next manual test, are: enemies never stand on Brood cells (the ring-2 edges and the centre are enemy cells); and fronts are the delivered six-cell wedge carried to the enemy's tile.

On 2026-10-05 the user also answered the Architect's three open questions (accepted user decisions):

- **Reach.** No generic enemy targeting reach in this round: "its all dependent of the abilities which we'll focus on later." Enemy targeting and marking keep their delivered behaviour. Reach will be ability-specific and designed together with the abilities.
- **Layout.** One alternating layout for all three presets now. A layout clustered on one side ("flank") is recorded as the next scenario, separate from the HP presets.
- **Tuning.** No numeric change in this round, so the manual test isolates the formation and tile changes. The computed layout argument, rule details and open questions are in the [ring-formation task](../plans/2026-10-05-c6399cb6-poc-001-ring-formation.md) and its owning amendments ([P02](../plans/2026-10-02-2e228a2b-poc-001-formation-algebra.md#amendment-rf-2026-10-05--ring-formation-and-enemy-cells), [P05](../plans/2026-10-02-d66a7452-poc-001-intent-semantics.md#amendment-rf-2026-10-05--fronts-protection-and-areas-from-enemy-tiles), [P08](../plans/2026-10-02-dc6612ec-poc-001-patrol-round-loop.md#amendment-rf-2026-10-05--enemies-on-tiles)).

Orientation zero, screen convention with vertical coordinates increasing downward (`W`, `C`, `H` are the patrol's edge tiles, `·` an empty cell, `◦` the empty centre):

```
Compact 0                     Spread 0
      ·   W   ·                     P   W   ·
    ·   P   ·   ·                 ·   ·   ·   ·
  ·   ·   ◦   U   ·             ·   ·   ◦   ·   U
    C   G   ·   H                 C   ·   ·   H
      ·   ·   ·                     G   ·   ·
U-G 2, U-P 2, G-P 2           U-G 4, U-P 4, G-P 4
```

**2026-10-04 — Two-ring arena (accepted; source: user decision, 2026-10-04).** *Formation note: the Compact placement and enemy anchor in this entry are superseded by the 2026-10-05 entry above; the two-ring board itself stands.* For this POC the arena has only two rings around the centre, not three: "i dont see what three would bring." The user's clarification:

> some bosses will be in the midlle and a strategy will be to go wide around them vs thigt agains them, so i guess they wont be completly centered, as for encounters, thats what this pos is trying to figure out right

Decision: the board is the centre plus rings 1 and 2, 19 cells instead of 37. The middle is enemy and boss space, and the Brood occupy the rings around it. Compact is "tight against" the middle: the accepted true triangle, with Ugallu and Girtablilu on the outer ring (now ring 2) and Pazuzu one step inward on ring 1. Spread is "wide around": three outer-ring cells 120 degrees apart. Enemy placement is deliberately not fixed; it is an open experiment question (see [Open decisions](#open-decisions)), and the centre cell is only a view-only visual anchor (choice 3 below). The Compact-triangle decisions below keep their meaning on the new board: inward exposure (sectors now cover rings 1–2), Pazuzu inward, and clockwise order around the formation's own centre.

One part of the earlier decisions cannot carry over exactly. The radius-2 outer ring has a single cell between corners, so no triangle of two outer cells and one ring-1 cell is mirror-symmetric about a side. Every such triangle pairs an outer corner cell with an outer edge cell, and its ring-1 cell sits radially inside the corner. "Mid-side" placement (CT decision 3) therefore has no radius-2 equivalent. On 2026-10-04 the user accepted three follow-up choices, which are accepted user decisions:

1. **Compact placement (supersedes CT decision 3):** the triangle fills encounter sector `o`, with Ugallu `T[2o]` (corner), Girtablilu `T[2o+1]` and Pazuzu `S[o]`. Ugallu therefore does not move on Expand/Contract.
2. **Spread:** the outer corners `T[2o]`, `T[2o+4]`, `T[2o+8]`, pairwise distance 4.
3. **Enemy anchor:** enemies are drawn as a cluster at the centre cell, view-only, with no rule meaning. Encounter layout, including off-centre bosses, stays an open experiment question.

The mapping, tables and the rejected alternatives are in the [P02 two-ring amendment](../plans/2026-10-02-2e228a2b-poc-001-formation-algebra.md#amendment-tr-2026-10-04--two-ring-board), the [P05 two-ring amendment](../plans/2026-10-02-d66a7452-poc-001-intent-semantics.md#amendment-tr-2026-10-04--two-ring-board) and the [two-ring board task](../plans/2026-10-04-d005e5f4-poc-001-two-ring-board.md).

Orientation zero, screen convention with vertical coordinates increasing downward:

```
 C   P   U      C centre (0,0); P (1,0) on ring 1; U (2,0), an outer corner
   ·   G        G (1,1), next outer cell clockwise; · is (0,1), ring 1
U-G 1, U-P 1, G-P 1
```

**2026-10-04 — Compact is a true triangle (accepted; source: user decision, 2026-10-04).** *Board note: this entry uses the radius-3 coordinates delivered at `a76a0ff`. On the two-ring board (entry above) "outer ring" means ring 2 and "ring 2" means ring 1; placement decision 3 is superseded there by the accepted sector-aligned placement.* The user observed that the delivered Compact formation placed the three Brood collinearly along one outer-ring edge (link distances 1, 2, 1), so it was not a triangle. Decision: Compact becomes three mutually adjacent cells, two Brood on the outer ring and one on ring 2 just inside them, with all three links at distance 1. The user's sketch places Ugallu and Girtablilu on the outer ring and Pazuzu inward:

```
   outer ring
  ⬡ U ⬡ G ⬡
     ⬡ P ⬡     <- ring 2
U-G 1, G-P 1, U-P 1
```

This is a settled design decision, not a provisional default. On 2026-10-04 the user also accepted three geometry choices, which are therefore accepted user decisions rather than provisional defaults:

1. **Inward exposure:** the ring-2 Brood is covered by sector areas, sweeps and protection fronts like the outer cells of its sector. Sectors extend over rings 2–3.
2. **Slot assignment and order:** Pazuzu is inward, and "clockwise order" means order around the formation's own centre (Ugallu → Girtablilu → Pazuzu).
3. **Placement:** the triangle sits mid-side, at `R[3o+1]`, `R[3o+2]`, `T[2o+1]`. *(Superseded on the two-ring board by the accepted sector-aligned placement, user decision 2026-10-04; see the entry above.)*

These decisions are specified in the plans: the [P02 amendment](../plans/2026-10-02-2e228a2b-poc-001-formation-algebra.md#amendment-ct-2026-10-04--compact-triangle) (mapping), the [P05 amendment](../plans/2026-10-02-d66a7452-poc-001-intent-semantics.md#amendment-ct-2026-10-04--compact-triangle) (sector masks), and the [Compact triangle task](../plans/2026-10-04-fb4bf201-poc-001-compact-triangle.md). Under that mapping, "clockwise order" means the order around the formation's own centre: Ugallu → Girtablilu → Pazuzu in both shapes, so contraction never mirrors the formation. Seen from the encounter centre, Compact Pazuzu sits between Ugallu and Girtablilu.

## Explicit exclusions

No campaign, hub, recovery, equipment, procedural generation, additional Brood, terrain obstacles, individual movement, navigation, final art, or generic ability framework. Glare and Revelation are deferred from the first geometry test, not removed from TEHOM's broader design.
