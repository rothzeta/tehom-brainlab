# POC 001 — Linked formation

**Status:** specified experiment; P01 shell delivered, P02 pure formation algebra implemented and verified at `3570610406886f18ca08c51effc79b3e8f3ddd34` with independent review/delivery pending. Combat and playtesting have not started.

**Basis:** the POC accepted in the TEHOM planning conversation, 2 October 2026. Initial tuning and unresolved mechanics are identified below rather than presented as playtest findings.

## Question

Does changing the squad's shape make attacking, protecting, and choosing targets more interesting without creating useless turns?

The experiment tests whether three Brood attacking individually but moving as a linked formation deserve to replace the earlier fixed Apex/Shadow combat model. A grid is not a goal by itself.

## Scope

| Element | Initial scope |
|---|---|
| Arena | Central hex plus three surrounding rings: 37 cells |
| Party | Ugallu, Girtablilu, Pazuzu |
| Abilities | Two per Brood; six total |
| Maneuvers | Rotate left, rotate right, expand/contract |
| Legal configurations | Two shapes times six orientations |
| Ordinary encounter | Warder, Censer, Harrier patrol |
| Boss | One Foundry Mechanism |
| Presentation | Labelled tokens and generated geometry first |
| Technology target | TypeScript + Phaser + Vite + Vitest; no backend |

## Formation rules

Brood occupy the outer ring (radius 3), except that Compact places one Brood on ring 2 just inside the other two. Enemies occupy the central engagement area. The encounter centre is fixed and does not change when a target is selected or defeated.

- **Compact:** a true triangle of three mutually adjacent cells: two Brood on the outer ring and one on ring 2, just inside them. All three links are distance 1. Ugallu and Girtablilu hold the outer cells; Pazuzu is the inward Brood. *(Accepted user decision, 2026-10-04; replaces "three consecutive outer-ring cells". See [Decision record](#decision-record).)*
- **Spread:** three outer-ring positions approximately 120 degrees apart.
- **Rotate:** turn the entire formation one 60-degree step clockwise or anticlockwise.
- **Expand / contract:** change shape while preserving the Brood's clockwise order around the formation's own centre and the formation's orientation.

Expansion separates the Brood around the encounter. Ugallu and Girtablilu stay on the outer ring; Pazuzu steps out from ring 2 to the outer ring, and contraction steps it back in. No Brood ever leaves the outer two rings. There is no independent movement, squad translation, pursuit, pathfinding, collision resolution, opportunity attack, or damage from crossing a telegraph during a maneuver. Only destination states determine the initial rules.

The exact experimental coordinate mapping and reversible shape transitions are now encoded in the [P02 implementation](../../poc-001-linked-formation/README.md#formation-algebra-p02) and tested against the [plan fixture](../plans/2026-10-02-2e228a2b-poc-001-formation-algebra.md). All twelve labelled states are retained even when Spread occupied-cell sets coincide. The delivered P02 Compact mapping is still the superseded collinear one; the triangle mapping is specified in the [P02 amendment](../plans/2026-10-02-2e228a2b-poc-001-formation-algebra.md#amendment-ct-2026-10-04--compact-triangle) and the [Compact triangle task](../plans/2026-10-04-fb4bf201-poc-001-compact-triangle.md), and is not yet implemented. Browser presentation remains the P01 placeholder; combat has not been added.

### Links

All three links remain visible. The initial test threshold is Close at two hex steps or less and Stretched beyond that. Compact should make all links Close (each is distance 1); Spread should make them Stretched.

This first version deliberately tests shared formation stances, not independently adjustable links or asymmetric formations. The threshold is provisional, not balanced.

## Round structure

1. Enemies announce intentions.
2. The player activates each Brood once, in a chosen order.
3. The player may use one shared formation maneuver before, between, or after those activations.
4. Surviving enemies resolve their intentions.
5. Begin the next round.

The initial maneuver has its own once-per-round allowance and does not consume a Brood's ability action. It cannot be banked. Remaining in the current formation is valid.

Area attacks stay committed to marked cells. Targeted attacks follow their marked creature. Preview and presentation must distinguish them.

Use fixed damage and guaranteed hits initially. Numeric values, enemy resolution ordering, and defeat handling are still implementation decisions.

## Test abilities

These are provisional test kits, not final character designs.

| Brood | Reliable action | Tactical action |
|---|---|---|
| Ugallu | **Claw:** damage one enemy | **Shelter:** reduce the next hit against one Close-linked ally; the link must still be Close at impact |
| Girtablilu | **Sting:** damage one enemy | **Impale:** stronger strike that ignores directional protection while both links are Stretched |
| Pazuzu | **Gale:** modest damage bypassing directional protection | **Crosswind:** turn one enemy's facing and associated directional intention by one orientation step |

Basic contact attacks can reach enemies in the central engagement area, with a lunge-and-return animation. They do not require literal tile adjacency and do not move the attacker permanently.

Directional protection can reduce attack effectiveness without making ordinary contact attacks universally illegal. Every Brood should retain a worthwhile contribution in either shape, though its ideal action or preferred target may be unavailable.

## Ordinary patrol — build first

**Warder:** protects another enemy against attacks from a marked frontal sector. Rotation or Crosswind can change attack access.

**Censer:** marks a Brood and later damages that creature plus nearby Brood. The mark follows its target. Spreading reduces splash; rotating a compact formation does not remove the mark.

**Harrier:** declares a targeted attack that becomes more dangerous if the victim is isolated when it resolves. It challenges the assumption that spreading is always safe.

The intended question is: which threat do I solve with formation, and which do I solve with abilities and target priority?

Replay this patrol with a healthy party, wounded Ugallu, and wounded Girtablilu. Damage values and targeting rules require testing; the proposed composition is not yet demonstrated to be balanced.

## Directional boss — build second

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
5. Add the directional boss only after ordinary combat produces useful decisions.
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

- The radius-three board has exactly 37 unique cells.
- All twelve labelled formation states are legal; occupied cells do not overlap.
- Six rotations restore the original labelled configuration.
- Rotation followed by its inverse restores state.
- Expansion and contraction preserve identity, order, and orientation.
- The initial link threshold produces the intended Compact and Spread states.
- Each living Brood acts at most once per player phase; only one shared maneuver is allowed.
- Area intentions remain location-bound while targeted intentions retain their target.
- Shelter checks the link when damage resolves, not only when applied.
- Preview leaves original state unchanged and agrees with the committed transition.

The first six formation checks are implemented and pass in the P02 candidate (90 focused tests, 3,349 assertions), alongside the unchanged two P01 tests. [Verification evidence](../mailbox/p02-formation-algebra/verification.md) identifies the tested revision. Activation limits, intentions, Shelter resolution, and combat preview/commit equivalence remain planned checks; no passing combat test suite or human playtest exists yet.

## Open decisions

Numeric balance, sector masks, enemy intention tie-breaking, the definition of isolation, and how formation behaves after a Brood falls must be specified before calling the combat loop complete. The Compact triangle (see [Decision record](#decision-record)) puts one Brood on ring 2; its exposure to sector-based areas and protection fronts is a provisional P05 default (covered like the outer cells of the same sector) pending user confirmation. P02 resolves exact coordinate presets and initial Close threshold two as experimental defaults, documented with sources in its [handoff](../mailbox/p02-formation-algebra/implementer.md); they remain provisional rather than playtest findings. Record later initial values as experimental defaults.

## Decision record

**2026-10-04 — Compact is a true triangle (accepted; source: user decision, 2026-10-04).** The user observed that the delivered Compact formation placed the three Brood collinearly along one outer-ring edge (link distances 1, 2, 1), so it was not a triangle. Decision: Compact becomes three mutually adjacent cells, two Brood on the outer ring and one on ring 2 just inside them, with all three links at distance 1. The user's sketch places Ugallu and Girtablilu on the outer ring and Pazuzu inward:

```
   outer ring
  ⬡ U ⬡ G ⬡
     ⬡ P ⬡     <- ring 2
U-G 1, G-P 1, U-P 1
```

This is a settled design decision, not a provisional default. The exact cell mapping, sector coverage of the inward cell, and other consequences are experimental defaults owned by the plans: the [P02 amendment](../plans/2026-10-02-2e228a2b-poc-001-formation-algebra.md#amendment-ct-2026-10-04--compact-triangle) (mapping), the [P05 amendment](../plans/2026-10-02-d66a7452-poc-001-intent-semantics.md#amendment-ct-2026-10-04--compact-triangle) (sector masks), and the [Compact triangle task](../plans/2026-10-04-fb4bf201-poc-001-compact-triangle.md). Under that mapping, "clockwise order" means the order around the formation's own centre: Ugallu → Girtablilu → Pazuzu in both shapes, so contraction never mirrors the formation. Seen from the encounter centre, Compact Pazuzu sits between Ugallu and Girtablilu.

## Explicit exclusions

No campaign, hub, recovery, equipment, procedural generation, additional Brood, terrain obstacles, individual movement, navigation, final art, or generic ability framework. Glare and Revelation are deferred from the first geometry test, not removed from TEHOM's broader design.
