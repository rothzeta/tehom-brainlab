# A roaming boss and two adds create positional target-priority decisions

## Status and authority

P17, draft after P14/P15/P16 in the [continuation](README-boss-experiments.md). The user requests a second, off-centre roaming boss with adds rather than another mandatory rotate/expand choreography. The particular add pair, stats and behavior below are test proposals.

## Smallest useful outcome

A second selectable encounter combines a relocating threat with two stationary supports; source positions and which support survives affect the next useful action. Reusing the central boss pattern with a moving icon is insufficient.

## Starting source and ownership

Baseline `70b6ede002e6a09e31522d1343d29796672dfb28`, then P13–P16. Existing `src/content/patrol.ts` supplies Warder/Censer concepts; `src/core/intents.ts` and `sectors.ts` own marks, front geometry and protection. P15 owns explicit encounter dispatch and P16 owns relocation. Propose `src/content/roaming-boss.ts` for this fixture and policies; narrowly extend explicit protection selection, record validation and real view consumers. One unassigned Implementer with a Coordinator-designated integration Implementer owns the closely coupled encounter.

## Fixture and inputs

Working name: the Collector. Proposed initial enemy cells: boss `(1,1)`, Warder `(-2,1)`, Censer `(1,-2)`. Centre stays empty. Prototype HP: boss 36, Warder 10, Censer 10. Start with exactly these three living enemies; no replenishment. Existing emblems can be reused with unmistakable labels for the new boss. These are fixture values, not final balance or a new asset request.

Boss uses P16's route. Warder and Censer are stationary. Brood use P14's kit and existing full/wounded presets. Compare the same HP/formation at two boss origins and repeat with each add defeated.

## Contracts and decisions

**Required:** only the boss relocates; the player still has the two P13 maneuver categories. Each new attack comes from the actual post-relocation origin and is fully announced. All contact basics retain their existing target access; the player never spends empty rounds chasing a retreating boss.

**Proposed boss action:** one committed local front sweep, 5 damage, using `frontCells(boss.cell,facing)`. At each announcement choose the facing hitting the most living Brood in the current formation, with ties preferring current facing then successive clockwise facings. Freeze the chosen cells for the response. It is turnable by Crosswind; it does not retarget after a maneuver. The boss uses no whole-ring forced-expansion routine and has no second phase.

**Proposed Warder:** protects the boss against attacks from its own local front only while boss and Warder are within hex distance 2. Reduction 2. This range condition applies to the protection relation, not all abilities. The Warder also announces a weak marked hit for 2 using roster-order living ties. It is turnable but stationary. Killing it removes the relation. Moving the boss beyond support range deactivates it visibly without removing the source record.

**Proposed Censer:** stationary marked splash for 3, radius 2, using the existing living-target cycle. Its mark follows the chosen Brood. Killing it removes the clustering pressure. Unlike the old patrol's Harrier, it does not create an isolation bonus to erase with a fixed opening.

Attack order is Warder, Censer, boss; then P16 relocation and fresh declaration. Frozen marks whose targets fall fizzle under existing semantics, never secretly retarget. On boss death the encounter ends immediately and surviving adds are disabled, not awarded invented death events. Killing both adds first leaves the mobile boss fight active. Encode this encounter-specific victory predicate explicitly so ordinary patrol elimination and P15 victory remain unchanged.

All details are proposed. Version encounter ID/configuration, target selection, protection-range semantics and victory predicate in exported attempts. Do not rewrite old patrol source IDs or silently reuse its version label.

## Implementation checkpoints

P17-1: create the three-entity fixture and explicit victory predicate; retain distinct reset/record selection for patrol and both bosses.

P17-2: integrate local boss targeting, range-bound Warder support and Censer marks using P14/P16 primitives, with deterministic tie and corpse cases.

P17-3: add browser selection/labels, origin and ward-range previews; play/replay healthy and wounded starts and hand back comparison evidence.

## Acceptance criteria

1. The encounter starts with three distinct reserved enemy cells and an empty centre. Only the boss changes cells between rounds.
2. The boss's committed sweep responds to its actual origin/facing and stays fixed throughout the player response; Crosswind transforms only the intended threat/facing.
3. Boss relocation into/out of Warder range changes protection eligibility; rotating the Brood changes front exposure; neither rule is approximated by sprite positions.
4. Killing the Censer removes its future splash; killing the Warder removes its guard. Killing the boss wins immediately without further add attacks or fabricated add kills.
5. There is no autonomous reinforcement loop and no fourth enemy. Ordinary attacks retain a legal living-enemy target from every legal formation, including after partner casualties.
6. Patrol and central-boss launch/reset/replay still work; roaming attempts reconstruct destinations, support eligibility, declarations, actions and terminal outcomes exactly.
7. A controlled comparison records changed consequences for holding, rotating, changing radius and choosing a different first target. Record a dominant universal opening as a design finding, not a successful tactical-diversity claim.

## Verification and hand-back

Use the existing root test/typecheck/build/browser/replay recipes with new encounter fixtures. Return exact commands/results, tested revision, captures showing changed origin and ward range, criterion mapping, baseline comparisons and limitations in `docs/mailbox/p17-roaming-boss-and-adds/implementer.md`. Human playtest notes must separately address whether movement changed target priority or merely increased calculation.

## Non-goals and stop conditions

No respawning waves, third boss, new player movement, shared combat engine, generic ability range, Revelation or campaign. If relocation cannot alter relevant consequences, fix this fixture's local rules before adding content. If occupied slots or phase timing invalidate forecasts, return to P16. A technically completed boss is not proof that this combat should replace Apex/Shadow.
