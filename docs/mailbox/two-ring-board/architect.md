task: TR-design (+ TR-design-confirm)
role: architect
status: complete
outcome: "Designed the two-ring (19-cell) board. Amended the brief (with accepted Decision record entries) and the P02/P04/P05/P06 plans, added notes to P08/P10/P12 and the CT plan, and updated the plan index. Wrote bounded implementation task TR. The user then accepted all three open-question defaults (2026-10-04): sector-aligned Compact (superseding CT mid-side), corner Spread, and a view-only centre enemy anchor. These are recorded as accepted decisions, and ADR-0004 carries a dated two-ring amendment. No source or test changes."
baseline: 0a48098ff439bc84df06f5f8e965531d69e0dba2
revision: 0d911ce07678ff5aa744e94810644dd9654811a4
artifacts:
  - docs/mailbox/two-ring-board/architect.md
  - docs/mailbox/two-ring-board/assignment-architect.md
  - docs/mailbox/two-ring-board/assignment-architect-confirm.md
  - docs/plans/2026-10-04-d005e5f4-poc-001-two-ring-board.md
  - docs/prototypes/poc-001-linked-formation.md
  - docs/plans/2026-10-02-2e228a2b-poc-001-formation-algebra.md
  - docs/plans/2026-10-02-d66a7452-poc-001-intent-semantics.md
  - docs/plans/2026-10-02-9d81c6df-poc-001-formation-lab.md
  - docs/plans/2026-10-02-4c3c0d42-poc-001-damage-and-fallen.md
  - docs/plans/2026-10-02-dc6612ec-poc-001-patrol-round-loop.md
  - docs/plans/2026-10-02-e7c77542-poc-001-playable-patrol.md
  - docs/plans/2026-10-02-a18d7fe6-poc-001-directional-boss.md
  - docs/plans/2026-10-04-fb4bf201-poc-001-compact-triangle.md
  - docs/plans/README.md
  - docs/adr/0004-repository-and-poc-direction.md
  - branch two-ring-board
verification:
  - "Disposable Python script in session scratch (outside the repository) checked the arithmetic. The board has 19 cells; T and S equal the radius-2 and radius-1 sets; the clockwise turn advances T by 2 and S by 1. For every orientation, Compact links are 1,1,1 and Spread links 4,4,4, and the turn maps each labelled position to orientation o+1. Clockwise order around the Compact centroid is -30/90/210 degrees. Sectors partition the 18 ring-1/2 cells, and each turned front equals the next front in order. P05 area/turned recipient tables keep their delivered values. All matched."
  - "Read-only inspection of delivered tests at BASE: damage, commands, view, smoke and asset-copy hold no radius-3 assertion that the TR mapping breaks (reasoned, not executed). The exact formation/intents/browser assertions that break are enumerated in the TR plan."
  - "Relative-link and heading-anchor check (scratch script) over all changed docs: 0 missing targets or anchors. The only skipped link is this report, which did not exist at check time."
  - "git diff --check: clean."
  - "ruach-handoff validator with --repo: ok true, baseline resolved, no diagnostics (after a frozen install of the skill-local dependencies, which Git ignores)."
  - "No application tests, typecheck, build or browser checks were run; no source changed."
  - "Confirmation pass: grep over the brief and docs/plans found no remaining provisional or pending-user wording for Q1-Q3. The only provisional item left is the lab pixel spacing, a view choice the user was not asked about."
  - "Confirmation pass: the link/anchor check over the changed docs and ADR-0004 found 0 missing targets or anchors; git diff --check is clean; the handoff validator with --repo returned ok true."
discoveries:
  - "Conflict: the accepted CT 'mid-side' placement has no radius-2 equivalent. Each ring-2 side has a single edge cell, so any triangle of two outer cells and one ring-1 cell pairs a corner with an edge, and its ring-1 cell sits radially inside the corner. Only two rotation-consistent families exist (A sector-aligned, B its mirror). A is used as the provisional default."
  - "With family A and corner Spread, every delivered P05/P06 recipient and protection table keeps its value, because Compact o is exactly sector o and Spread uses sectors o, o+2, o+4. Ugallu becomes stationary through Expand/Contract."
  - "P08's proposed enemy cells (0,-1), (-1,1), (1,0) are exactly Compact Pazuzu's ring-1 cells at orientations 4, 2 and 0. At the patrol-v1 start, Harrier would share Pazuzu's cell. P08 now gives enemies no board cell; the centre is a provisional view-only anchor, and P10 owns the cluster offsets."
  - "Ring 1 can no longer serve as an enemy anchor (the assignment allowed 'centre and/or ring 1'): it is Brood space inside the masks. Only the centre stays outside every mask."
  - "CLOSE_THRESHOLD 2 and SPLASH_RADIUS 2 are kept. Thresholds and radii 1-3 classify both shapes identically, and the Spread Close boundary moves from 5/6 to 3/4."
  - "The P04 lab hard-codes '37 cells' in the legend. The TR plan derives it from boardCells() and raises the pixel spacing from 85 to 120 (provisional); the origin is unchanged, so the browser empty-centre click stays valid."
  - "The P06 damage fixture area [{q:3,r:0}] is now off-board. It asserts only retention and no selector validates area cells against the board, so it stays valid unedited."
  - "ADR-0004 now carries a dated 2026-10-04 amendment (two rings, 19 cells), and its original scope sentence is retained as history. The ADR index row in docs/adr/README.md still reads 'Agreed decisions, 2026-10-02–03'. This assignment authorised only ADR-0004, so the Coordinator may want to add 'amended 2026-10-04' there, as ADR-0003 and ADR-0005 rows do."
  - "The prototype README public contracts (37 cells, OUTER_RING/R, CT mapping, Spread 6, 30-cell sectors) must be updated by the TR Implementer; that is listed in the TR plan."
  - "P07, P09 and P11 need no change: no geometry assumptions (Impale still sees Spread Stretched; Shelter sees Compact Close)."
open_questions: []
resolved_questions:
  - "Q1 Compact placement: accepted by the user 2026-10-04. Family A, sector-aligned (U T[2o] corner, G T[2o+1], P S[o]); supersedes the CT mid-side decision."
  - "Q2 Spread: accepted by the user 2026-10-04. Outer corners T[2o], T[2o+4], T[2o+8], distance 4."
  - "Q3 Enemy anchor: accepted by the user 2026-10-04. View-only centre cell, drawn as a cluster, no rule meaning; encounter layout (including off-centre bosses) stays an open experiment question."
blockers: []

# Two-ring board — Architect report (TR-design)

Author: Architect (Claude), worktree `/opt/dev/tehom-brainlab-tworing`, branch `two-ring-board`, from BASE `0a48098`. Assignment: [assignment-architect.md](assignment-architect.md), committed unchanged.

## Reading of the user decision

I adopted the Coordinator's reading with one correction. The board is the centre plus rings 1 and 2 (19 cells), and the middle is enemy and boss space. Compact is "tight against" the middle: Ugallu and Girtablilu on ring 2 and Pazuzu on ring 1. Spread is "wide around": three ring-2 cells 120° apart. Inward exposure, Pazuzu-inward and clockwise order around the formation's own centre carry over. The correction is the "mid-side" placement: it cannot carry over (see Conflict). Ring 1 also cannot serve as an enemy anchor, because it is now Brood space inside the masks.

## Proposed design

Notation: `T` is ring 2 (12 cells, the same frozen table as Amendment CT's `T`) and `S` is ring 1 (6 cells, new). One clockwise 60° step advances `T` by 2 and `S` by 1. There are six orientations.

| o | Compact U | Compact G | Compact P | Spread U | Spread G | Spread P |
|---|---|---|---|---|---|---|
| 0 | (2,0) | (1,1) | (1,0) | (2,0) | (-2,2) | (0,-2) |
| 1 | (0,2) | (-1,2) | (0,1) | (0,2) | (-2,0) | (2,-2) |
| 2 | (-2,2) | (-2,1) | (-1,1) | (-2,2) | (0,-2) | (2,0) |
| 3 | (-2,0) | (-1,-1) | (-1,0) | (-2,0) | (2,-2) | (0,2) |
| 4 | (0,-2) | (1,-2) | (0,-1) | (0,-2) | (2,0) | (-2,2) |
| 5 | (2,-2) | (2,-1) | (1,-1) | (2,-2) | (0,2) | (-2,0) |

- **Formulae.** Compact is `T[2o], T[2o+1], S[o]`. Spread is `T[2o], T[2o+4], T[2o+8]` mod 12.
- **Links.** Compact is `[1,1,1]` Close and Spread is `[4,4,4]` Stretched.
- **Threshold and splash.** Both stay 2. Values 1–3 classify both shapes identically. Spread remains Stretched.
- **Reversibility.** Rotation is orientation ±1, and the axial turn maps each labelled position to `o+1`. Expand/Contract preserve orientation and labels and reverse exactly. Ugallu does not move on a shape change.
- **Sectors.** `sectorCells(s) = T[2s], T[2s+1], S[s]`. A front is two sectors, six cells. The sectors partition the 18 ring-1/2 cells, and the centre is unmasked. Turned fronts keep their order.
- **Tables.** Every P05/P06 recipient and protection table value is unchanged.
- **Exports.** Keep `RING_TWO`, add `RING_ONE` and remove `OUTER_RING`, whose radius-3 cells are off the board.
- **Lab.** The legend count derives from `boardCells()`, and spacing goes from 85 to 120 px (provisional) with the origin unchanged.
- **Enemies.** Enemies have no board cell; the centre is a provisional, view-only anchor. Selectors never read enemy cells.

Full specification: [P02 Amendment TR](../../plans/2026-10-02-2e228a2b-poc-001-formation-algebra.md#amendment-tr-2026-10-04--two-ring-board), [P05 Amendment TR](../../plans/2026-10-02-d66a7452-poc-001-intent-semantics.md#amendment-tr-2026-10-04--two-ring-board), [P04 Amendment TR](../../plans/2026-10-02-9d81c6df-poc-001-formation-lab.md#amendment-tr-2026-10-04--two-ring-board), [P06 Amendment TR](../../plans/2026-10-02-4c3c0d42-poc-001-damage-and-fallen.md#amendment-tr-2026-10-04--two-ring-board). Implementation task: [TR plan](../../plans/2026-10-04-d005e5f4-poc-001-two-ring-board.md).

## Conflict: mid-side placement

On the radius-3 board each outer side had two interior cells, so the CT triangle could be mirror-symmetric about the side's radial midline. On the radius-2 board each side has one edge cell. Two adjacent outer cells are therefore always a corner `T[2o]` and an edge `T[2o±1]`, and their only common ring-1 neighbour is `S[o]`, which lies radially inside the corner. Every valid triangle is lopsided. I chose family A (exactly sector `o`) over its mirror B for three reasons:

- A keeps every hand-written P05/P06 table, because the whole formation stays in one sector.
- A keeps Ugallu fixed through Expand/Contract.
- A keeps the same −30°/90°/210° order around the formation centre that CT accepted.

B straddles sectors and would change the protection and area tables. A is recorded as a provisional default in the brief, P02 and the TR plan, and the TR plan's stop conditions require revising the amendments first if the user picks B.

## Affected components

- **Source (TR task):** `src/core/hex.ts`, `src/core/formation.ts`, `src/core/sectors.ts`, comments in `src/core/intents.ts`, `src/view/FormationLab.ts` (and `lab.css` only if needed), and the prototype `README.md`.
- **Tests (enumerated exception):** `tests/formation.test.ts` (7 items), `tests/intents.test.ts` (4 items, with the recipient tables frozen) and `tests/browser-lab.mjs` (count 37 → 19, a legend assertion, one optional message rename).
- **Must pass unedited:** the damage, commands, view, smoke and asset-copy suites.

## Later plans assessed

| Plan | Result |
|---|---|
| P06 | No change; fixtures stay valid (amendment records the hand check). |
| P07 | No change; Impale/Shelter link conditions hold (Spread 4 Stretched, Compact 1 Close). |
| P08 | Amended: enemy cells superseded because they collide with Compact Pazuzu; centre view-only anchor; no placement rule. |
| P09 | No change; no geometry. |
| P10 | Amended note: centre enemy cluster, hit-tests for enemy and Brood tokens, telegraphs on rings 1–2. |
| P11 | No change; records carry fixture versions, no geometry. |
| P12 | Amended note: the boss at `(0,0)` is provisional; off-centre with rule meaning needs its own mask proposal; the six-cell sweep is still one third of Brood cells; cadence unchanged. |
| CT plan | Status note: geometry superseded; decisions still apply. |
| ADR-0004 | Not editable here; its "three rings (37 cells)" scope line needs a Coordinator or Librarian amendment. |

## Constraints, risks and boundaries

- **Lopsided Compact.** The provisional Compact looks lopsided relative to the arena. If players read it as wrong, B is the only alternative short of changing the ring count again.
- **Crowded centre.** A centre-only enemy anchor makes the P10 patrol visuals crowded; P10 must prove readability with hit-tests.
- **Smaller fronts.** A front is 6 cells, so each Compact rotation crosses a whole sector, as before. Boss "one rotation solves it" risk is unchanged in kind and stays a gate-review item.
- **Out of scope.** No enemy placement rule, configurable board radius, new shapes or tuning. The TR plan lists stop conditions.

## Readiness

TR is ready for implementation on the provisional defaults. There are no blockers. Q1–Q3 in the leading block need the user but do not block; if the user changes Q1 or Q2, the P02/P05 amendments and the TR plan must be revised before implementation.

## User confirmation

Assignment: [assignment-architect-confirm.md](assignment-architect-confirm.md), committed unchanged. On 2026-10-04 the user chose the default for each open question:

1. **Compact placement:** family A, sector-aligned: Ugallu `T[2o]` (corner), Girtablilu `T[2o+1]`, Pazuzu `S[o]`. It supersedes the CT "mid-side" decision, which has no radius-2 equivalent.
2. **Spread:** the outer corners `T[2o]`, `T[2o+4]`, `T[2o+8]`, distance 4.
3. **Enemy anchor:** view-only at the centre cell, drawn as a cluster, with no rule meaning. Encounter layout, including off-centre bosses, stays an open experiment question.

Changes made, with no other content changed:

- **Brief:** the Formation rules and Open decisions now state the three choices as accepted user decisions. The two-ring Decision record entry lists them as accepted, with Q1 superseding CT decision 3. The CT entry's board note and its placement item point to the superseding decision.
- **P02 Amendment TR:** the status, family A label (B marked not chosen), mapping heading and Spread rationale now read as accepted.
- **P05 and P08/P10/P12 notes:** the centre enemy anchor is now an accepted user decision. Encounter layout stays open, and P12 still notes that an off-centre boss with rule meaning needs its own mask proposal.
- **TR plan:** the authority paragraph says the choices are accepted. "Provisional defaults" became "Accepted user decisions (2026-10-04)" plus a remaining provisional view choice (lab spacing). The criterion 10 wording and the stop condition were updated to match.
- **CT plan:** accepted decision 3 is annotated as superseded on the two-ring board.
- **Plan index:** the TR row and the P05 ownership row record the accepted decisions.
- **ADR-0004:** the status line notes the amendment. A dated italic pointer follows the original scope sentence, which stays unchanged as history, and a new `## Amendments` section records the 2026-10-04 two-ring decision and its source, following the ADR-0003 amendment pattern.

The TR task is ready for implementation with no open questions and no blockers. Lab pixel spacing (120 px, 100–120 allowed) remains a provisional view choice for the Implementer, as P04 Amendment TR states.
