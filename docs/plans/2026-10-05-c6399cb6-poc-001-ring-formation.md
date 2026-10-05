# Put the Brood on the ring and the enemies on tiles

## Status and authority

**Proposed task, not implemented.** Written 2026-10-05 against BASE `ef0e3b4` (branch `ring-formation`, which contains local master with P01–P11, CT, TR and the 2026-10-05 AI playtest evidence). The Coordinator assigns the owner. The task owner is a POC 001 Implementer, who also owns local integration unless assigned otherwise.

Authority: the user's decisions of 2026-10-05, recorded in the [brief's Decision record](../prototypes/poc-001-linked-formation.md#decision-record):

1. Compact on alternating ring-1 cells, Expand one radial step to the ring-2 corners, rotation around the never-occupied centre.
2. Enemies stand on real tiles.
3. Each enemy's front, protection and reach derive from its own tile and facing; movement stays limited to the shared maneuvers.
4. Enemy placement delegated to the Architect for a proposal.

The intent is Darkest-Dungeon-style positional ranks, not tactical movement. The design is specified in its owning amendments:

- [P02 Amendment RF](2026-10-02-2e228a2b-poc-001-formation-algebra.md#amendment-rf-2026-10-05--ring-formation-and-enemy-cells): mapping tables, reversibility, links, `ENEMY_CELLS`.
- [P05 Amendment RF](2026-10-02-d66a7452-poc-001-intent-semantics.md#amendment-rf-2026-10-05--fronts-protection-and-reach-from-enemy-tiles): fronts, protection, turned areas and the reach query from enemy tiles; what stays centre-based.
- [P08 Amendment RF](2026-10-02-dc6612ec-poc-001-patrol-round-loop.md#amendment-rf-2026-10-05--enemies-on-tiles): layout, facings, reach targeting, presets, initial intentions, and the computed placement argument.
- [P09](2026-10-02-d28ae958-poc-001-preview-equivalence.md#amendment-rf-2026-10-05--end-phase-forecast-and-next-marks), [P10](2026-10-02-e7c77542-poc-001-playable-patrol.md) and [P11](2026-10-02-825a6700-poc-001-reproducible-playtests.md#amendment-rf-2026-10-05--rules-version-and-enemy-cells) RF amendments: bug B2 and next marks, rendering and bugs B1/B3, rules version.
- Assessed with no rule change: [P04](2026-10-02-9d81c6df-poc-001-formation-lab.md#amendment-rf-2026-10-05--ring-formation), [P06](2026-10-02-4c3c0d42-poc-001-damage-and-fallen.md#amendment-rf-2026-10-05--ring-formation-and-enemies-on-tiles), [P07](2026-10-02-f8938420-poc-001-brood-abilities.md#amendment-rf-2026-10-05--ring-formation-and-enemies-on-tiles) and [P12](2026-10-02-a18d7fe6-poc-001-directional-boss.md) (boss-tile note).

It supersedes the Compact mapping and the view-only enemy anchor of the [two-ring board task](2026-10-04-d005e5f4-poc-001-two-ring-board.md); that task's board, tables and corner Spread stand. Playtest evidence: [AI playtest reports](../mailbox/ai-playtest-20261005/). Design report: [Architect](../mailbox/ring-formation/architect.md). Sequence: [plan index](README.md). Format: [ADR-0002](../adr/0002-plan-filenames.md), [ADR-0003](../adr/0003-implementation-plan-writing.md). Testing: [ADR-0006](../adr/0006-contract-invariants-and-black-box-testing.md).

This is one task with ordered checkpoints. Geometry, enemy cells, targeting, rendering and the record version are coupled through the shared snapshot type, and an intermediate checkpoint cannot be played. The three bugs form a separate checkpoint that can be committed and reviewed on its own.

## Smallest useful outcome

The patrol plays with Compact as a ring-1 triangle around the empty centre and Spread on the corners, the three enemies drawn and ruled from their own edge tiles, the Warder's protection and every enemy's next-round marks depending on where the formation stands relative to each enemy, and bugs B1–B3 fixed. Previews and commits stay on one transition.

A result fails acceptance if it:

- changes the renderer only, or keeps any enemy at a view-only anchor;
- measures any enemy's protection or turned area from the centre when the enemy stands elsewhere;
- places an enemy on a Brood cell, or blocks or rejects any maneuver because of an enemy;
- limits a Brood contact attack by distance;
- changes HP, damage, mitigation, splash radius or Close threshold values (see [Open questions](#open-questions-with-applied-defaults));
- edits a test outside the enumerated exception, or freezes provisional tuning in a new assertion.

## Starting source and ownership

Inspected at `ef0e3b4`, within `poc-001-linked-formation/`:

| File | Current behaviour | Change |
|---|---|---|
| `src/core/hex.ts` | Board, `RING_ONE` (`S`), `RING_TWO` (`T`) | Add frozen `ENEMY_CELLS`: `(0,0)`, then `T[1], T[3], …, T[11]` |
| `src/core/formation.ts` | Compact `T[2o], T[2o+1], S[o]` | Compact `S[o], S[o+2], S[o+4]`; Spread unchanged; update comments |
| `src/core/sectors.ts` | Centre `sectorCells`, `frontMask`, `turnCellsClockwise` | Add `frontCells(origin, facing)` and a pivoted turn; keep the centre functions |
| `src/core/intents.ts` | `EnemyState {id,hp,facing}`; protection reads `frontMask(source.facing)`; turns about the centre | Required `cell`; protection reads `frontCells(source.cell, source.facing)`; turn about the source cell; add `broodInReach` |
| `src/content/patrol.ts` | `patrol-v1`, `PATROL_VIEW_ANCHOR`, all facings 0 | `patrol-v2`; enemy cells and facings per P08 RF; `enemyReach: 2` in `PatrolRules`; remove `PATROL_VIEW_ANCHOR` |
| `src/core/rounds.ts` | `announcePatrol` reads no enemy coordinates | Candidates from `broodInReach` with all-living fallback; validate `enemyReach` with the other rules |
| `src/core/run-record.ts` | `RUN_RULES_VERSION` `poc-001-rules-v1/…`; enemy fields `id,hp,maxHp,facing[,rotatable]` | `poc-001-rules-v2/patrol-v2/p07-v1`; require and validate `cell`; require `enemyReach` |
| `src/core/preview.ts` | `endPhase` preview forecasts a second end phase (probable B2 cause) | Fix after a failing regression (P09 RF) |
| `src/view/CombatScene.ts` | Enemies clustered at the centre; front tint `frontMask(facing)` for every enemy; controls cache key omits session generation (probable B1 cause) | Enemy tokens on cells, facing mark, Warder front tint via `frontCells`, reach and next-marks text, legend; B1 fix |
| `src/view/patrol-session.ts` | End-phase message always says "Unused actions forfeited" | B3 fix |
| `README.md` (prototype) | P02/P05/P08/P09/P10/P11 contracts describe the TR Compact, centre anchor, `patrol-v1`, rules v1 | Update those contract sections to RF |
| Tests | See [Required test updates](#required-test-updates-explicit-exception) | Exactly as enumerated |

Unchanged and protected: `src/core/{damage,lifecycle,transition,commands,state,abilities,smoke}.ts`, `src/content/brood.ts`, `src/view/{FormationLab,lab-state,projection}.ts`, `src/main.ts`, `package.json`, `bun.lock`, `vite.config.ts`, `vitest.config.ts`, `scripts/`, `bin/`, root `justfile`, `assets/`, `docs/mailbox/` outside this task's own reports, `docs/CURRENT.md`, `docs/TASK_LOGS.md`, `docs/adr/`. If one of these must change, stop and report why.

## Fixture and inputs

Use hand-written fixtures; never derive expected values from the module under test.

- `S`, `T` unchanged.
- Compact by orientation (U, G, P): 0 `(1,0) (-1,1) (0,-1)`; 1 `(0,1) (-1,0) (1,-1)`; 2 `(-1,1) (0,-1) (1,0)`; 3 `(-1,0) (1,-1) (0,1)`; 4 `(0,-1) (1,0) (-1,1)`; 5 `(1,-1) (0,1) (-1,0)`.
- Spread T indices unchanged: `[0,4,8]`, `[2,6,10]`, `[4,8,0]`, `[6,10,2]`, `[8,0,4]`, `[10,2,6]`.
- `ENEMY_CELLS`: `(0,0), (1,1), (-1,2), (-2,1), (-1,-1), (1,-2), (2,-1)`.
- `patrol-v2` content: Warder `(1,-2)` facing 0, Censer `(-2,1)` facing 4, Harrier `(1,1)` facing 2; `enemyReach` 2.
- `frontCells` examples at `(1,-2)`: facing 0 `(2,-1),(2,-2),(1,0),(0,0),(1,-1)`; facing 1 `(1,0),(0,0),(1,-1),(-1,0),(-1,-1),(0,-1)`; facing 5 `(2,-1),(2,-2)`.
- Centre-front recipients (facing 0) by orientation: Compact and Spread both `[U, U, P, P, G, G]`; facing 1: `[G, U, U, P, P, G]`.
- Reach examples (healthy, full HP, round 2, reach 2): Spread 0 → Warder Pazuzu, Censer Girtablilu, Harrier Ugallu; Compact 0 → Warder Ugallu, Censer Pazuzu, Harrier Ugallu.

These values were computed by the Architect with a disposable script outside the repository. They are provisional content and geometry fixtures, not balance.

## Contracts and decisions

### Required contracts

- Board of 19 cells, twelve distinct labelled states, no Brood on an `ENEMY_CELLS` cell, inverse rotations and shape changes restore exact labelled positions, six turns restore the start, the axial turn maps every labelled position at `o` to `o+1`, Spread cell = 2 × Compact cell per Brood and orientation.
- Compact links `[2,2,2]` Close and Spread `[4,4,4]` Stretched at threshold 2.
- Every enemy has a cell; protection, turned areas and reach read it. A centre enemy behaves exactly as delivered.
- Marks follow their creature; reach is checked only at announcement; a maneuver never cancels or retargets an announced mark.
- Every living Brood keeps a legal reliable attack against every living enemy in all twelve states.
- No maneuver is ever blocked by an enemy.
- Preview and commit use the same transition; previews do not mutate live state.
- Records replay under the new rules version; old-version records fail explicitly.

### Settled choices (user, 2026-10-05)

Formation mapping, radial Expand/Contract, centre never Brood and reserved for a boss, enemies on tiles, rules following tiles, no individual or puzzle movement, Close threshold 2.

### Proposed implementation (Architect; provisional until the user's manual test)

- Enemy cells are the centre and the ring-2 edge cells (`ENEMY_CELLS`); enemies never stand on Brood cells.
- Front = the delivered six-cell wedge carried to the enemy's tile and clipped to the board (`frontCells`).
- Reach = targeting limit at announcement, inclusive distance `enemyReach` from the enemy's tile, falling back to all living Brood when none is in reach.
- Turnable areas turn about the source tile; turned cells are not clipped.
- Patrol layout: one alternating layout for all presets (P08 RF has the computed argument).
- Do not add a board-radius parameter, a placement engine, per-enemy rule classes or a layout selector.

### Bugs to fix

- **B1** — stale actor-button HP after a preset change plus Restart ([scout-2 D1](../mailbox/ai-playtest-20261005/scout-2.md), [scout-3](../mailbox/ai-playtest-20261005/scout-3.md)). Probable cause: the `CombatScene` controls cache key `[revision, locked, actor, ability]` is unchanged by a reset at revision 0. Contract: after any reset every actor button shows the fresh state's HP before input.
- **B2** — End phase's "If end phase now" forecast includes an extra resolution ([scout-1 D1](../mailbox/ai-playtest-20261005/scout-1.md)). **Investigate first:** reproduce it from `scout-1-attempt-2.json` commands 1–3 and an End-phase preview, write a failing regression, and confirm or replace the hypothesis in P09 RF before changing code. Contract: an End-phase preview shows that command's resolution once and no further-phase forecast.
- **B3** — "Unused actions forfeited" appears when no action was unused ([scout-3](../mailbox/ai-playtest-20261005/scout-3.md)). Contract: forfeiture is reported only when at least one living Brood had not acted, with the count.

Per ADR-0003, each bug gets a deterministic regression that fails at BASE before the fix, where feasible; report it if not feasible.

## Implementation checkpoints

1. **RF.C1 — Geometry.** `formation.ts` mapping, `ENEMY_CELLS`. Formation test edits F1–F5 and new geometry tests. Run `just poc-001-test tests/formation.test.ts`.
2. **RF.C2 — Tile-based selectors.** `EnemyState.cell`, `frontCells`, pivoted turn, protection from the tile, `broodInReach`. Intents test edits I1–I7 and new RF-1–RF-4 tests. Run the intents, formation, damage and abilities suites (damage and abilities with only their listed edits).
3. **RF.C3 — Patrol content and targeting.** `patrol-v2` cells/facings/`enemyReach`, reach-based announcement, `PATROL_VIEW_ANCHOR` removal; run-record version and validation. Patrol, preview and run-record edits P1–P3, V1–V3, R1 and new reach/validation tests. Run the full unit suite and typecheck.
4. **RF.C4 — Rendering on tiles.** `CombatScene` per P10 RF; browser edits BP1–BP4 and BR1 if needed. Build and run the browser suite; capture and inspect the screenshots below.
5. **RF.C5 — Bugs B1–B3.** For each: failing regression at the pre-fix revision, fix, passing regression. B2 investigation result recorded in the handoff.
6. **RF.C6 — Contracts and full verification.** Update the prototype README contract sections; run every verification command bare at one candidate revision.

## Required test updates (explicit exception)

The assignment must grant an exception permitting exactly these edits to existing tests. Each is required because the assertion encodes the superseded TR Compact, the centre enemy anchor, the `patrol-v1` content shape, the old rules version, or one of the three bugs. Each edit must keep or strengthen the coverage it replaces. Adding new tests and new assertions is always allowed; new assertions must follow [the tuning criterion](#acceptance-criteria) (criterion 12).

`tests/formation.test.ts` (P02):

- F1. Replace the `compactCells` fixture with the RF Compact table.
- F2. "CT: every Compact pair is adjacent in all six orientations" becomes "every Compact pair is at distance 2", expecting 2.
- F3. C2 per-state radius expectation: Compact `[2,2,1]` → `[1,1,1]`; Spread unchanged.
- F4. C4 link distances: Compact `[1,1,1]` → `[2,2,2]`; link states unchanged.
- F5. Close-threshold test: replace the Compact pair "threshold 1 Close / 0 Stretched" with "threshold 2 Close / 1 Stretched"; Spread 3/4 cases unchanged.

`tests/intents.test.ts` (P05):

- I1. Add `cell: { q: 0, r: 0 }` to every enemy fixture (`context()`, the AC4 wrap enemy, `another` in the ID test, the invalid-facing enemy). No assertion change; the centre reproduces delivered semantics.
- I2. Replace `slots.compact` with the RF Compact table.
- I3. `areaRecipients.compact` → `[U],[U],[P],[P],[G],[G]`; `turnedRecipients.compact` → `[G],[U],[U],[P],[P],[G]` (identical to the unchanged Spread rows).
- I4. "CT: inward Pazuzu is protection-eligible and a fixed-area recipient" becomes "a ring-1 Compact Brood is protection-eligible and a fixed-area recipient", using Ugallu on `(1,0)` at Compact 0 with the singleton area `[(1,0)]`.
- I5. "Close and splash boundaries": the radius-1 splash on Ugallu now returns `['ugallu']`, and `isCloseLinked(…, 'ugallu', 'pazuzu', 1)` is now false. All other lines unchanged.
- I6. AC5: `selectRecipients(deadMark, area)` → `['ugallu']`.
- I7. Public-ID test: `selectRecipients(renamed, area)` → `['id-ugallu']`.

`tests/damage.test.ts` (P06):

- D1. Add `cell: { q: 0, r: 0 }` to every enemy fixture. No assertion change.

`tests/abilities.test.ts` (P07):

- A1. Add `cell: { q: 0, r: 0 }` to every enemy fixture.
- A2. The AC1 row "Sting on Censer deals 2" must run in a formation where Girtablilu stands in the centre facing-0 front (for example Compact orientation 4 or 5); its expected damage stays 2. Other rows unchanged.

`tests/patrol.test.ts` (P08):

- P1. Add `enemyReach: 4` (the board diameter, so every living Brood is in reach) to the test-local `rules`. Pre-existing targeting assertions then keep testing the unchanged selection rules; reach 2 gets new tests.
- P2. In the AC1 factory test, replace `expect(enemy).not.toHaveProperty('cell')` and the `PATROL_VIEW_ANCHOR` expectation (and its import) with hand-written expectations of each enemy's cell and facing and of distinct `ENEMY_CELLS` placement.
- P3. The AC7 traces are expected to reproduce unchanged with P1 (the Warder dies before its protection matters). If they do not, stop and report; do not edit them.

`tests/preview.test.ts` (P09):

- V1. Add `enemyReach: 4` to the test-local `rules`.
- V2. "a Warder kill removes protection…": `protectionLost` actors become `['ugallu']` (only Ugallu stands in the `(1,-2)` facing-0 front at Compact 0).
- V3. "Crosswind changes facing, protection…": replace `protectionLost toHaveLength(3)` with exact lists (lost none, gained `pazuzu`), and expect the threats `[{fixed-area, [(-1,1)], ['girtablilu']}, {fixed-area, [(2,0)], []}, {marked-hit, [(1,0)], ['ugallu']}]`. The turnable cell turns about the Warder's tile.
- V4. Add the B2 regression and any `endPhase` forecast expectation changes it requires. If an existing preview test asserts the double forecast, it may change only to the B2 contract.

`tests/run-record.test.ts` (P11):

- R1. Add `enemyReach: 4` to the test-local `rules`.

`tests/browser/fixtures.ts`:

- BF1. Add `enemyReach` to the `outcomeFixture` rules object.

`tests/browser-patrol.mjs` (P10):

- BP1. The End-phase check `feedback.includes('Unused actions forfeited')` becomes conditional on the pre-command unused count (present with the count when positive, absent when zero).
- BP2. The hit-test message "centre cluster and all Brood pointer hit-test separately" may be relabelled; the assertion stays.
- BP3. If enemy tokens expose `data-q`/`data-r`, restrict the existing Brood position snapshot to Brood tokens and add a separate enemy-cell comparison.
- BP4. Add B1 and B2 browser regressions, enemy-on-cell assertions and the Spread captures listed under Verification.

`tests/browser-patrol.mjs` and `tests/browser-run-record.mjs`, trace source:

- BR1. Both replay the historical P08 traces from `docs/mailbox/p08-patrol-round-loop/traces.json`. Their commands are re-executed against the real core, but reach changes who is marked, so a later step may become illegal (for example an actor already fallen). If so, and only then, switch these tests to a new test-owned trace file under `tests/browser/`, generated by executing the real `patrol-v2` core with the same strategies (attack/forfeit per preset). Leave the historical mailbox file untouched, and report how the new file was produced.

**Expected to pass unedited:** `tests/commands.test.ts`, `tests/view.test.ts`, `tests/smoke.test.ts`, `tests/asset-copy.test.ts`, `tests/patrol-session.test.ts` (new B3 tests are additions), `tests/browser-lab.mjs`, `tests/browser-preview.mjs`, `tests/browser/patrol-fixture.ts`, `tests/browser/outcome-fixture.ts`, and every test not named above. If any of them fails, stop and report the assertion. Do not edit it.

## Acceptance criteria

1. `formationPositions` matches the RF table for all twelve states; Compact links `[2,2,2]` Close and Spread `[4,4,4]` Stretched at threshold 2; Compact Stretched at threshold 1 and Spread Close at 4. `CLOSE_THRESHOLD`, `SPLASH_RADIUS` and `DEFAULT_DAMAGE_RULES` are unchanged.
2. Rotation, its inverse, six turns, Expand and Contract restore serialized labelled positions; the clockwise turn equals the axial turn of every labelled position; each Spread cell is twice the same Brood's Compact cell.
3. `ENEMY_CELLS` equals the fixture, is frozen, and is disjoint from every cell used by the twelve states; the twelve states use exactly the other 12 board cells.
4. `frontCells((0,0), f)` equals `frontMask(f)` for every `f`; the three `(1,-2)` examples hold in order; no front contains its origin or an off-board cell.
5. Protection reads the source's tile: the centre tables of the fixture hold, and RF-2 of P05 holds for a Warder on `(1,-2)`, including after Crosswind in both directions.
6. Crosswind turns a turnable area about its source tile (`(2,0)` about `(1,-2)` → `(-1,1)`), leaving marks and other areas unchanged; at the centre the delivered results hold.
7. `broodInReach` meets P05 RF-4. Announcement uses reach with the all-living fallback; the round-one marks of all three presets equal the `patrol-v1` values; the round-2 reach examples hold; marks never change after announcement.
8. Each preset creates the `patrol-v2` cells and facings, `enemyReach` 2, distinct `ENEMY_CELLS` placement, and otherwise unchanged HP, damage and protection relation.
9. `RUN_RULES_VERSION` is `poc-001-rules-v2/patrol-v2/p07-v1`; records require valid, distinct `ENEMY_CELLS` enemy cells and `enemyReach`; a `poc-001-rules-v1` record fails with the unsupported-rules-version error; new records replay exactly.
10. In the browser, every enemy token sits on its core cell in every preset; facing marks and the Warder's front tint come from `frontCells`; each intention lists the Brood in reach; previews with a forecast list the next marks; every Brood and enemy token pointer-hit-tests to itself in Compact and Spread; the 1280×800 layout fits without scrolling; zero uncaught exceptions.
11. B1, B2 and B3 each have a regression that fails before its fix and passes after, or a reported reason why that was not feasible. After a preset change plus Restart the actor buttons show the fresh HP. An End-phase preview shows one resolution. Forfeiture is reported only when an action was actually unused.
12. **Tuning is not frozen.** No new or edited assertion pins a production default (HP, damage, reduction, splash radius, Close threshold, `enemyReach`, enemy cells or facings) except where a test checks that content exposes its own documented values, as P08 criterion 1 already does. Rule tests use explicit test-local inputs (as the existing `rules` objects do), so changing a provisional value requires editing content and its documentation, not rule tests.
13. The suites listed as expected to pass unedited pass unedited, and the delivered P03 rejection, P06 settlement and P07 legality contracts are unchanged.
14. The prototype README's P02, P05, P08, P09, P10 and P11 sections state the RF mapping, `ENEMY_CELLS`, tile-based fronts, protection and reach, `patrol-v2` content, the forecast contract and the rules version. No remaining claim of the TR Compact, Compact distance 1, a view-only enemy anchor or `PATROL_VIEW_ANCHOR`.

## Verification and hand-back

Run from the repository root at one candidate revision, **bare** (no `POC001_CHROME`, `CHROME_PATH` or other override in the environment or on the command line):

- `just poc-001-test` (full suite; report file, test and assertion counts against BASE)
- `just poc-001-typecheck`
- `just poc-001-build`
- `just poc-001-test-browser` (report the Chrome binary the runner selected and why, assertion and exception counts)
- `git diff --check ef0e3b4..HEAD`
- `git diff --exit-code ef0e3b4..HEAD --` with the protected paths listed above

Screenshot inspection (open and look at each; keep the images outside the repository unless the Coordinator asks otherwise):

- Compact start for each preset (`healthy-start.png`, `wounded-ugallu-start.png`, `wounded-girtablilu-start.png`) showing the ring-1 triangle, the empty centre and the three enemies on their edge tiles with facing marks;
- Spread after Expand for each preset (add these captures to `tests/browser-patrol.mjs` if absent; BP4);
- the formation lab's Compact fixtures and an Expand ghost;
- an End-phase hover (B2) and a fresh wounded preset start (B1).

Return `docs/mailbox/<task-id>/implementer.md` with a leading ruach-handoff block validated with `bun .agents/skills/ruach-handoff/scripts/validate.ts <report> --repo <worktree>`. Include the tested revision, changed paths, exact commands and results, the per-file edit list mapped to the exception items above, the B2 investigation result, the acceptance mapping, serialized orientation-0 positions and links, round-one marks per preset, and the screenshots inspected. Do not edit `docs/CURRENT.md`, `docs/TASK_LOGS.md`, ADRs or plan files.

## Balance hypotheses (provisional; for the user's manual test)

The Architect owns no tuning. These are expectations to check, not decisions. Owners: P07 (ability numbers), P08 (patrol content). This task changes none of the values below.

- **H1 — The 13-damage Harrier breakpoint survives (computed).** Impale 6 + Claw 4 + Gale 3 = 13 = Harrier HP. No RF rule changes Brood damage against Harrier: it is not a protection target, and contact reach stays universal. Expand still enables Impale. So the round-one "Expand, kill Harrier" opening remains available in every preset. Levers: Harrier HP 14–15 (P08), Impale 5 (P07), or making the Warder protect Harrier (P08 relation).
- **H2 — Compact gains a positional Censer kill (computed).** The `(1,-2)` facing-0 Warder front holds exactly one Compact Brood per orientation: Ugallu at 0 and 5, Pazuzu at 1 and 2, Girtablilu at 3 and 4. Rotating clockwise from the start to Compact 1 puts only Pazuzu (whose Gale bypasses) in it, so Claw 4 + Sting 4 + Gale 3 = 11 kills Censer (10) in round one without Expand. Expected: a real Compact alternative to the Harrier opening, decided by rotation. In Spread the front holds one Brood at odd orientations and none at even ones, and Impale bypasses anyway.
- **H3 — Holding Spread may get stronger (computed risk).** With reach 2, in Spread each enemy can mark only its adjacent Brood, so the end-of-phase rotation fully decides who takes which attack next round, including Harrier's isolated 7. In Compact each enemy chooses between two Brood. Expected: more control in Spread. Levers: `enemyReach` 3 (Compact then matches `patrol-v1` targeting, and in Spread each enemy reaches two Brood), isolated Harrier damage, or Censer splash radius 1 (which removes Compact's three-way splash).
- **H4 — Rotation now has two purposes.** Protection access this round and pairing for next round's marks. Expect fewer turns where holding is obvious. Check whether the choice reads as positional ranks or as a puzzle.
- **H5 — Shelter and Crosswind.** Shelter's availability is unchanged (Compact is still Close). Crosswind anticlockwise on the Warder empties its front of Compact Brood; clockwise puts two in it (computed). Expect slightly more reason for Crosswind and no change for Shelter. Lever: Shelter reduction (P06/P07).
- **H6 — Boss (P12, not built).** A centre sweep always hits exactly one Brood in either shape (computed), so rotating chooses the victim rather than escaping.

## Open questions with applied defaults

- **RF-Q1 — What "reach" means.** The decision text "each enemy's … reach" could mean the enemy's targeting reach or how far Brood can reach that enemy. *Default applied:* enemy targeting reach, 2 steps, checked at announcement, falling back to all living Brood. Brood contact attacks still reach every enemy, because the brief settles contact reach and the no-dead-turn contract. Provisional.
- **RF-Q2 — A second layout now?** The user suggested "multiple scenarios with different positions". *Default applied:* one alternating layout for all three presets in this task. The clustered "flank" layout is documented in P08 RF as the next scenario, to add as a separate selector, not per preset. Provisional.
- **RF-Q3 — Bundle tuning?** The playtests found the patrol too easy, and H1 says the main breakpoint survives RF. *Default applied:* no numeric change in this task, so the manual test isolates the formation and tile effects. If the user wants one change bundled, the smallest is Harrier HP 13 → 15 (P08). Provisional.

## Manual test checklist (user's next round)

1. Start Healthy. Is Compact a triangle on the inner ring around an empty centre? Are the Warder (top), Censer (lower left) and Harrier (lower right) on outer edge tiles, with visible facing?
2. Expand and Contract. Does each Brood step straight out to the corner behind it and back?
3. Rotate. Does the triangle turn around the centre, and can you tell which enemy each Brood now faces?
4. Find the Warder's front tint. Rotate clockwise once from the start: only Pazuzu should stand in it. Try killing Censer in round one from Compact (H2).
5. Try the old opening (Expand, Impale + Claw + Gale on Harrier). Does it still win easily (H1)?
6. Before ending a phase, read "Next marks if you end now" after hovering a maneuver. Does the rotation choice feel like choosing ranks (who faces whom) rather than solving a puzzle (H3, H4)?
7. Wounded Ugallu and wounded Girtablilu: can you keep the wounded Brood out of Harrier's reach by rotating, and does that feel fair or dominant?
8. Bugs: change preset and Restart (actor HP correct, B1); hover End phase (one resolution, B2); end a phase with all actions used (no forfeiture message, B3).
9. Did you use Shelter or Crosswind? If not, why not?
10. Would you want the clustered "flank" layout next (RF-Q2), or tuning first (RF-Q3)?

## Non-goals and stop conditions

Out of scope: enemy movement, individual Brood movement, collision or blocking, a layout selector or second layout, per-preset layouts, the boss (P12), numeric tuning, Brood contact range, new abilities, animation of maneuvers, and amending ADR-0004 (its scope of 19 cells, two shapes and six orientations is unchanged).

Stop and report before proceeding when:

- an unlisted existing test fails, or an expected-unedited suite needs an edit;
- the AC7 P08 traces (P3) stop reproducing;
- B2's cause turns out to be in core resolution rather than presentation or forecasting, which would change accepted P08 events;
- a token cannot be made readable and pointer-selectable on its tile without changing a core contract;
- a protected path must change;
- a later user decision changes RF-Q1–RF-Q3 or the formation; the amendments and this plan must be revised first.
