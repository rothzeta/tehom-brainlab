task: RF-design
role: architect
status: complete
outcome: Ring formation and enemies-on-tiles design written into the brief and P02–P12 amendments, with one bounded implementation task (RF) that includes bugs B1–B3; the user's 2026-10-05 answers are recorded as accepted decisions (no generic reach rule, one alternating layout with flank next, no tuning); ready for implementation.
baseline: ef0e3b41ac7917fd4976594fdd79bcd206cb7dde
design_revision: bd320d36abc2273146879d5a3964175575bacd19
artifacts:
  - docs/mailbox/ring-formation/architect.md
  - docs/mailbox/ring-formation/assignment-architect.md
  - docs/mailbox/ring-formation/assignment-architect-confirm.md
  - docs/plans/2026-10-05-c6399cb6-poc-001-ring-formation.md
  - docs/prototypes/poc-001-linked-formation.md
  - docs/plans/README.md
  - docs/plans/2026-10-02-2e228a2b-poc-001-formation-algebra.md
  - docs/plans/2026-10-02-d66a7452-poc-001-intent-semantics.md
  - docs/plans/2026-10-02-dc6612ec-poc-001-patrol-round-loop.md
  - docs/plans/2026-10-02-9d81c6df-poc-001-formation-lab.md
  - docs/plans/2026-10-02-4c3c0d42-poc-001-damage-and-fallen.md
  - docs/plans/2026-10-02-f8938420-poc-001-brood-abilities.md
  - docs/plans/2026-10-02-d28ae958-poc-001-preview-equivalence.md
  - docs/plans/2026-10-02-e7c77542-poc-001-playable-patrol.md
  - docs/plans/2026-10-02-825a6700-poc-001-reproducible-playtests.md
  - docs/plans/2026-10-02-a18d7fe6-poc-001-directional-boss.md
  - docs/plans/2026-10-04-d005e5f4-poc-001-two-ring-board.md
verification:
  - "Disposable Python scripts in session scratch (outside the repository) computed the RF mapping, all invariants, frontCells examples, centre-front tables, reach tables, round-one and round-two marks, and layout exposure statistics; every hand-written value in the amendments matches their output."
  - "Relative Markdown links and heading anchors in changed files checked by a scratch script: all resolve."
  - "git diff --check on the changed documents: clean."
  - "Confirmation pass: placement statistics recomputed without reach (distance, adjacency, front membership) and round-one marks recomputed without reach; both match the amended text."
  - "Confirmation pass: links and anchors rechecked after the P05/P09 heading renames; git diff --check clean."
  - "No application test, build or browser check run; no source or test changed."
review: not-run
recommended_placement: "Accepted by the user 2026-10-05: one alternating layout for all presets, Warder (1,-2) facing 0, Censer (-2,1) facing 4, Harrier (1,1) facing 2 on ring-2 edge tiles (exact cells and facings provisional P08 content); clustered flank layout is the next scenario; the centre is reserved for the boss; enemies never stand on Brood cells (Architect proposal)."
placement_argument: "Rotation symmetry gives every layout identical averages (mean distance 2.333, adjacent enemies 1.000, front membership 0.750 for every Brood), so averages decide nothing; alternating is the only class with zero per-state spread across Brood in adjacency, distance multiset and front membership (clustered spread 2 in adjacency, 1.5 mean in fronts), so a maneuver changes only who faces whom; targeting is unchanged, so marks equal patrol-v1."
resolved_questions:
  - "RF-Q1 reach; default not accepted. No generic reach rule this round; targeting and marking unchanged; reach to be ability-specific, designed with the abilities."
  - "RF-Q2 second layout; accepted, not now. One alternating layout for all presets; clustered flank layout is the next scenario."
  - "RF-Q3 tuning; accepted. No numeric change this round."
discoveries:
  - "The 13-damage Harrier breakpoint survives RF unchanged (computed); the dominant Expand-kill-Harrier opening stays available unless P07/P08 tuning changes."
  - "Centre-based two-sector fronts now always contain exactly one Brood in both shapes, which changes P05 centre tables and the P12 sweep assumption."
  - "Probable causes found by source reading for B1 (controls cache key omits session generation) and B2 (End-phase preview forecasts a second end phase); both marked hypotheses for the implementer to confirm with failing regressions."
  - "Compact now sits exactly on Close threshold 2; any threshold below 2 disables Compact Shelter."
blockers: []

# Ring formation and enemies on tiles — Architect report

Author: ring-formation Architect, 2026-10-05. Assignment: [assignment-architect.md](assignment-architect.md). BASE `ef0e3b4`. Design and planning only; no source, test or tooling changed.

## Proposed design and rationale

**Formation (user decision, encoded).** Compact puts Ugallu, Girtablilu and Pazuzu on `S[o]`, `S[o+2]`, `S[o+4]`, a ring-1 triangle around the empty centre with links `[2,2,2]` (Close at threshold 2). Spread is unchanged: `T[2o]`, `T[2o+4]`, `T[2o+8]`, links `[4,4,4]`. Since `T[2k]` = 2 × `S[k]`, Expand is exactly one radial step per Brood and Contract its inverse. Rotation stays orientation ±1, the axial turn maps every labelled state to the next orientation, and the twelve labelled states stay distinct (Compact cell sets now coincide at `o`, `o+2`, `o+4`, like Spread). Close threshold 2 is kept: 2 and 3 classify all states identically, so there is no reason to change it. Mapping tables: [P02 Amendment RF](../../plans/2026-10-02-2e228a2b-poc-001-formation-algebra.md#amendment-rf-2026-10-05--ring-formation-and-enemy-cells).

| o | Compact U, G, P | Spread U, G, P |
|---|---|---|
| 0 | (1,0) (-1,1) (0,-1) | (2,0) (-2,2) (0,-2) |
| 1 | (0,1) (-1,0) (1,-1) | (0,2) (-2,0) (2,-2) |
| 2 | (-1,1) (0,-1) (1,0) | (-2,2) (0,-2) (2,0) |
| 3 | (-1,0) (1,-1) (0,1) | (-2,0) (2,-2) (0,2) |
| 4 | (0,-1) (1,0) (-1,1) | (0,-2) (2,0) (-2,2) |
| 5 | (1,-1) (0,1) (-1,0) | (2,-2) (0,2) (-2,0) |

**Cell kinds (proposal).** The twelve states use exactly 12 cells (ring 1 and the six corners). The other 7, the centre and the six ring-2 edge cells, become `ENEMY_CELLS`. Enemies never stand on Brood cells. Allowing that would block maneuvers for some orientations and need a collision rule, which the brief excludes. It would also make maneuvers a movement puzzle, which the user rejected.

**Rules follow tiles (proposal for the user's principle).** [P05 Amendment RF](../../plans/2026-10-02-d66a7452-poc-001-intent-semantics.md#amendment-rf-2026-10-05--fronts-protection-and-areas-from-enemy-tiles):

- *Front:* `frontCells(origin, facing)` is the delivered six-cell `frontMask` carried to the enemy's tile and clipped to the board. It is identical at the centre, so the boss and existing centre fixtures keep their behaviour. It keeps its order and needs no new geometry concepts.
- *Protection:* the attacker's cell is tested against the source's own front.
- *Areas:* turnable areas turn about the source's tile.
- *Reach:* a two-step targeting limit applied when marks are announced, with an all-living fallback. Marks still follow their creature; Brood contact attacks still reach every enemy, so there are no dead turns.
- *Still centre-based:* the formation pivot, and the centre case of fronts. Links, isolation, splash and marks are Brood-relative.

**Placement (recommendation).** One alternating layout for all three presets: Warder `(1,-2)` facing 0, Censer `(-2,1)` facing 4, Harrier `(1,1)` facing 2. The patrol does not use the centre. The computed argument is in [P08 Amendment RF](../../plans/2026-10-02-dc6612ec-poc-001-patrol-round-loop.md#amendment-rf-2026-10-05--enemies-on-tiles):

- The user's "average distribution" argument is satisfied by every layout. Rotation symmetry gives each Brood identical averages over the twelve states: mean distance 2.333, mean adjacent 1.000, mean in-reach 1.500, for all three Brood in alternating, clustered and mixed layouts. Averages therefore cannot choose a layout.
- Per state, alternating has zero spread: every Brood always has one adjacent enemy and 2 (Compact) or 1 (Spread) enemies in reach. A maneuver changes the pairing (three pairings; orientations `{0,1}`, `{2,3}`, `{4,5}`; two pairings reachable per round), never the count. Clustered has spread 2 in every state, and in Spread it hides one Brood from all enemies. That adds a hiding line on top of the Spread advantage the playtests found.
- The round-one marks of all three presets equal `patrol-v1`, so the new rules are comparable with the nine recorded attempts.
- The presets stay HP-only; per-preset layouts would confound wound and layout. "Multiple scenarios" is answered by documenting the clustered "flank" layout as the next, separately selectable scenario (RF-Q2).

**Bugs.** B1 (stale actor HP), B2 (double End-phase forecast) and B3 (false forfeiture message) are in the task's checkpoint RF.C5, with probable causes from source reading at BASE. B2 must be reproduced and its cause confirmed before any fix.

## Affected components

Source (planned, by the implementer): `src/core/{hex,formation,sectors,intents,rounds,run-record,preview}.ts`, `src/content/patrol.ts`, `src/view/{CombatScene,patrol-session}.ts`, the prototype README contracts. Tests: the enumerated exception in the [task](../../plans/2026-10-05-c6399cb6-poc-001-ring-formation.md#required-test-updates-explicit-exception) (F1–F5, I1–I7, D1, A1–A2, P1–P3, V1–V4, R1, BF1, BP1–BP4, BR1), and the suites expected to pass unedited. Versions: `patrol-v2`, `poc-001-rules-v2/patrol-v2/p07-v1`; `RECORD_VERSION` stays 1.

Documents changed by this report: the brief (status, scope row, Formation rules rewritten with a Darkest-Dungeon intent paragraph, new "Enemies on tiles" subsection, Links, contact reach, Warder text, patrol layout, Open decisions, and a 2026-10-05 Decision record entry with the user's words and a diagram); P02/P05/P08 RF amendments; RF notes in P04/P06/P07/P09/P10/P11/P12; a supersession note in the TR task; the plan index (RF row, ownership). ADR-0004 is not amended: its recorded scope (19 cells, two shapes, six orientations, three Brood, one patrol, one boss) is unchanged, and it already delegates coordinates and enemy placement to the brief.

## Constraints, dependencies and risks

- **Balance risk (H1, H3).** RF does not remove the 13-damage Harrier opening. Reach 2 may strengthen holding Spread, because each enemy then has exactly one candidate there and the player controls who takes Harrier's isolated hit. H2 (computed) gives Compact a rotation-based round-one Censer kill as a counterweight. All six hypotheses and their levers are in the [task](../../plans/2026-10-05-c6399cb6-poc-001-ring-formation.md#balance-hypotheses-provisional-for-the-users-manual-test); none changes a value.
- **Test churn.** The exception list is long but mostly mechanical: centre `cell` additions and the new Compact tables. The historical P08 browser traces may become illegal under reach targeting; BR1 allows a test-owned regenerated trace file and forbids editing the mailbox evidence.
- **Old records.** The nine AI playtest exports stop replaying under the new rules version and fail explicitly. They remain replayable at their build `552f2b1`.
- **Threshold sensitivity.** Compact sits exactly on Close threshold 2.
- **P12.** A centre sweep now always hits exactly one Brood in either shape; the gate review must re-check rotation value. P12 is still blocked by HOLD.

## Open questions (defaults applied, provisional)

1. **RF-Q1 — meaning of "reach".** Default: enemy targeting reach 2, checked at announcement, fallback to all living Brood; Brood contact reach unchanged.
2. **RF-Q2 — second layout now.** Default: no; clustered "flank" layout documented as the next scenario, separate from the HP presets.
3. **RF-Q3 — bundle tuning.** Default: no numeric change, so the manual test isolates the formation and tile effects; the smallest candidate is Harrier HP 13 → 15.

## Implementation boundaries

One task, checkpoints RF.C1–RF.C6. Bugs are isolated in RF.C5. No numeric tuning, no layout selector, no enemy or individual movement, no blocking, no Brood range, no boss, no ADR change. New assertions must not freeze provisional tuning (criterion 12). Verification runs `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build` and `just poc-001-test-browser` bare, plus screenshot inspection of Compact, Spread and enemies on tiles for each preset. The task ends with a manual test checklist for the user.

## Verification performed

- Scratch scripts (session scratch, outside the repository) enumerated the 19-cell board and the twelve states, and checked: the RF mapping and links; turn equivariance; radial Expand; label distinctness; the cell partition; `frontCells` equal to `frontMask` at the centre; the three `(1,-2)` front examples; centre-front tables; reach counts for reach 1–4; round-one marks for all presets against `patrol-v1`; the round-two examples; layout statistics for the three classes; edge-cell adjacency; pairing classes; the turned area cell; and H2/H5 coverage.
- Changed documents: relative links and anchors resolved with a scratch checker; `git diff --check` clean.
- Not run: unit tests, typecheck, build, browser checks or any playtest (no code changed). Review: not run.

## Readiness

Ready for implementation under the [RF task](../../plans/2026-10-05-c6399cb6-poc-001-ring-formation.md), with RF-Q1–RF-Q3 defaults applied. No blockers. The Coordinator owns `docs/CURRENT.md`/`docs/TASK_LOGS.md` updates.

## User confirmation

On 2026-10-05 the user answered the three open questions ([confirmation assignment](assignment-architect-confirm.md)). The answers are recorded as accepted user decisions in the brief's Decision record, the P05/P08/P09/P10/P11/P12 RF amendments, the [RF task](../../plans/2026-10-05-c6399cb6-poc-001-ring-formation.md#decided-questions-user-2026-10-05) and the plan index. This section supersedes the reach statements in the sections above.

- **RF-Q1 — reach (default not accepted).** The user: "its all dependent of the abilities which we'll focus on later." The reach rule is removed everywhere: the P05 `broodInReach` query and RF-4, P08 `enemyReach` and reach-based announcement (and RF-5), the P09 next-marks note, the P10 reach and next-marks display, P11's `enemyReach` validation, and the P12 reach bullet. In the task it is gone from the contracts, the file table (`rounds.ts` no longer changes), checkpoints, acceptance criteria 7–10, 12 and 14, and the test-update list. P1, V1, R1, BF1 and BR1 are withdrawn; `tests/run-record.test.ts`, `tests/browser/fixtures.ts` and `tests/browser-run-record.mjs` are now expected to pass unedited. BR1 is withdrawn because the historical P08 traces make no maneuvers, kill the Warder before any Brood attacks Censer, and now face the delivered targeting. Hypothesis H3 (Spread control through reach) is replaced: Censer and Harrier tiles carry no rule effect this round. H4 now covers protection access only. Reach is recorded as ability-specific, to be designed with the abilities. Two headings were renamed with their anchors updated: P05's amendment is now "fronts, protection and areas from enemy tiles", and P09's is now "End-phase forecast".
- **Dependency check.** Only targeting and presentation depended on reach. Fronts, protection, turned areas, `ENEMY_CELLS`, the layout, the rules version and B1–B3 do not. Round-one marks: targeting now reads no cells, so every announcement equals `patrol-v1` for the same HP and round. Recomputed for the three presets: Warder → Ugallu, Censer → Girtablilu, Harrier → Ugallu (healthy, wounded Ugallu) or Girtablilu (wounded Girtablilu).
- **Placement argument restated, recommendation unchanged.** It is recomputed without reach, using distance, adjacency and front membership. Front membership is the count of enemy fronts containing a Brood, with every enemy facing into the arena.
  - Every layout gives every Brood the same averages: mean distance 2.333, mean adjacent enemies 1.000, mean front membership 0.750.
  - Per state, alternating `{T1,T5,T9}` has zero spread across Brood on all three measures. Each Brood has one adjacent enemy, distances `{1,2,3}` in Compact or `{1,3,4}` in Spread, and equal front membership (1 in Compact and at odd Spread orientations, 0 at even ones).
  - Clustered `{T1,T3,T5}` has adjacency spread 2 in every state, front spread 1.5 on average (2 at most) and mean-distance spread up to 2, and in Spread one Brood sits at distances `{3,4,4}`. Mixed has spread 1 on average and 2 at most.
  - Alternating therefore still makes maneuvers change only who faces whom, and it gives a neutral baseline for later ability-specific reach. The in-reach figures in the earlier sections are superseded.
- **RF-Q2 and RF-Q3 (accepted).** One alternating layout for all presets, with the clustered "flank" layout as the next scenario. No numeric change in this round.

The Architect's remaining proposals (the `ENEMY_CELLS` partition and the translated front) were not part of the questions. They stay marked as provisional proposals.
