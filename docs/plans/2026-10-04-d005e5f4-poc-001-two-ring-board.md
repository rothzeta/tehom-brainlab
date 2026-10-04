# Shrink the arena to two rings across formation, intents and lab

## Status and authority

**Proposed; not implemented.** Written 2026-10-04 against BASE `0a48098ff439bc84df06f5f8e965531d69e0dba2` (local master content with P01–P06 and the Compact triangle delivered). The Coordinator assigns the owner. The task owner is a POC 001 Implementer, who also owns local integration unless assigned otherwise.

Authority: the user's two-ring decision of 2026-10-04, recorded in the [brief's Decision record](../prototypes/poc-001-linked-formation.md#decision-record). The arena is the centre plus rings 1 and 2 (19 cells). The middle is enemy and boss space. Compact is the true triangle "tight against" the middle, and Spread is "wide around" on the outer ring. Enemy placement is deliberately not fixed. The design is specified in its owning plans:

- [P02 Amendment TR](2026-10-02-2e228a2b-poc-001-formation-algebra.md#amendment-tr-2026-10-04--two-ring-board): board, `T`/`S` tables, mapping, links and threshold.
- [P05 Amendment TR](2026-10-02-d66a7452-poc-001-intent-semantics.md#amendment-tr-2026-10-04--two-ring-board): sectors, fronts, splash and enemy anchors.
- [P04 Amendment TR](2026-10-02-9d81c6df-poc-001-formation-lab.md#amendment-tr-2026-10-04--two-ring-board): 19-cell lab, pixel pitch and legend.
- [P06 Amendment TR](2026-10-02-4c3c0d42-poc-001-damage-and-fallen.md#amendment-tr-2026-10-04--two-ring-board): no change; fixtures stay valid.
- Later-plan notes, not part of this task: [P08](2026-10-02-dc6612ec-poc-001-patrol-round-loop.md#amendment-tr-2026-10-04--two-ring-board), [P10](2026-10-02-e7c77542-poc-001-playable-patrol.md), [P12](2026-10-02-a18d7fe6-poc-001-directional-boss.md).

This task supersedes the geometry of the [Compact triangle task](2026-10-04-fb4bf201-poc-001-compact-triangle.md) and keeps its accepted decisions on slot, order and inward exposure. The Compact placement (sector-aligned family A) is a **provisional default pending user confirmation**, because the accepted mid-side placement has no radius-2 equivalent (P02 Amendment TR, Geometric constraint). If the user picks the mirror family B instead, revise P02/P05 Amendment TR and this plan before implementing.

Design rationale and open questions: [Architect report](../mailbox/two-ring-board/architect.md). Sequence: [plan index](README.md). Format: [ADR-0002](../adr/0002-plan-filenames.md), [ADR-0003](../adr/0003-implementation-plan-writing.md). Testing: [ADR-0006](../adr/0006-contract-invariants-and-black-box-testing.md).

## Smallest useful outcome

Core enumerates 19 cells and places all twelve labelled states on rings 1–2 exactly per the P02 Amendment TR table. P05 masks partition rings 1–2. The browser lab renders a readable 19-cell board. All delivered contracts outside the listed test updates keep passing.

A result fails acceptance if it:

- changes only the renderer, or only the board count;
- keeps a radius-3 cell in any formation, sector or ring export;
- changes a P05 recipient or protection table value;
- encodes a final enemy-placement rule;
- edits unlisted tests to pass.

## Starting source and ownership

Inspected at `0a48098`, within `poc-001-linked-formation/`:

| File | Current behaviour | Change |
|---|---|---|
| `src/core/hex.ts` | `boardCells()` radius 3 (37); exports 18-cell `OUTER_RING` (`R`) and 12-cell `RING_TWO` (`T`) | `boardCells()` radius 2 (19). Keep `RING_TWO` byte-identical. Add frozen `RING_ONE` (`S`) per P02 Amendment TR. Remove `OUTER_RING`. Update doc comments ("centre plus two rings (19 cells)") |
| `src/core/formation.ts` | Compact `R[3o+1], R[3o+2], T[2o+1]`; Spread `R[3o+{0,6,12}]` | Compact `T[2o], T[2o+1], S[o]`; Spread `T[2o], T[(2o+4)%12], T[(2o+8)%12]`. Update comments: the rotation comment that says "three ring indices" becomes "two `T` indices / one `S` index" |
| `src/core/sectors.ts` | `sectorCells(s)` = `R[3s..3s+2]`, `T[2s..2s+1]` | `sectorCells(s)` = `T[2s], T[2s+1], S[s]`. `frontMask` keeps concatenation. Update comments |
| `src/core/intents.ts` | No ring assumption in logic | No logic change. Correct any comment that names radius-3 rings |
| `src/view/FormationLab.ts` | Legend hard-codes "37 cells"; `PROJECTION.spacing` 85 | Derive the legend count from `boardCells().length`. Spacing 120 (100–120 allowed with screenshot justification; P04 Amendment TR). Origin `(380, 295)` unchanged |
| `src/view/lab.css` | Stage 760×610 | Change only if the screenshots show a need |
| `README.md` (prototype) | Public contracts state 37 cells, `OUTER_RING`/`R`, the CT mapping, Spread `[6,6,6]`, 30-cell sectors, "rings 0–1 outside masks" | Update the P02/P05/P04 contract text to Amendment TR |
| `tests/formation.test.ts`, `tests/intents.test.ts`, `tests/browser-lab.mjs` | Encode radius-3 cells and counts | Update exactly as listed below |

Unchanged and protected:

- `src/core/{damage,lifecycle,transition,commands,state,smoke}.ts`, `src/view/{projection,lab-state}.ts` and `src/main.ts`.
- `tests/{damage,commands,view,smoke,asset-copy}.test.ts`.
- `package.json`, `bun.lock`, `vite.config.ts`, `scripts/`, `bin/`, root `justfile`.
- `assets/`, `docs/CURRENT.md`, `docs/TASK_LOGS.md`, `docs/adr/`.

`CLOSE_THRESHOLD = 2`, `SPLASH_RADIUS = 2` and `DEFAULT_DAMAGE_RULES` stay unchanged. Six orientations, the `{shape, orientation}` representation, roster order and the public error messages stay unchanged.

## Fixture and inputs

Use the hand-written P02 Amendment TR tables (`T`, `S`, and the Compact and Spread table) as independent test fixtures. Do not derive expected cells from module output. P05 expectations stay hand-written. The `areaRecipients` and `turnedRecipients` values keep their current values, as P05 Amendment TR states. The fixtures are:

- `T` (unchanged): `(2,0), (1,1), (0,2), (-1,2), (-2,2), (-2,1), (-2,0), (-1,-1), (0,-2), (1,-2), (2,-2), (2,-1)`.
- `S`: `(1,0), (0,1), (-1,1), (-1,0), (0,-1), (1,-1)`.
- Compact by orientation (U, G, P):
  - 0: `(2,0) (1,1) (1,0)`
  - 1: `(0,2) (-1,2) (0,1)`
  - 2: `(-2,2) (-2,1) (-1,1)`
  - 3: `(-2,0) (-1,-1) (-1,0)`
  - 4: `(0,-2) (1,-2) (0,-1)`
  - 5: `(2,-2) (2,-1) (1,-1)`
- Spread T indices by orientation: `[0,4,8]`, `[2,6,10]`, `[4,8,0]`, `[6,10,2]`, `[8,0,4]`, `[10,2,6]`.

No enemy cells are introduced. Enemy placement is an open experiment question ([brief Open decisions](../prototypes/poc-001-linked-formation.md#open-decisions)).

## Contracts and decisions

### Required contracts

- 19 board cells.
- Twelve distinct labelled states. No overlap, and no Brood on `(0,0)`.
- Inverse rotations and inverse shape changes restore exact labelled positions. Six turns restore the start. The clockwise axial turn maps every labelled position to orientation `o+1`.
- Orientation and roster order are preserved.
- Compact has Ugallu and Girtablilu on ring 2 and Pazuzu on ring 1, all pairwise adjacent. Spread is on ring 2 at pairwise distance 4.
- Sectors partition rings 1–2. Front masks turn in order under Crosswind.
- Inputs are not mutated, and invalid inputs are rejected with the delivered errors.
- Preview and commit stay on the same transition.

### Settled choices

- The user decision above, and the CT slot, order and inward-exposure decisions.
- Threshold 2 and splash radius 2 (P02/P05 Amendment TR justify keeping them).
- Spread links remain Stretched.

### Proposed implementation

- Keep derived positions from `{shape, orientation}`. Use index expressions over `RING_TWO` and `RING_ONE`.
- Do not add a board-radius parameter, a generic shape table or a configurable geometry layer. The board is fixed at radius 2.
- Apart from `formation.ts` and `sectors.ts`, which both change, no `src/` module imports `OUTER_RING`. Typecheck confirms its removal.

### Provisional defaults (pending user confirmation; do not block)

1. Compact family A, `T[2o], T[2o+1], S[o]`: sector-aligned, with Ugallu fixed through Expand/Contract.
2. Spread on the outer corners, `T[2o+{0,4,8}]`, distance 4.
3. Lab spacing 120 px.

## Implementation checkpoints

1. **TR.C1 — Board and formation algebra.** Change `boardCells`, add `RING_ONE`, remove `OUTER_RING`, and apply the new mapping. Update `tests/formation.test.ts` as listed. Run the focused formation suite.
2. **TR.C2 — Sectors.** Change `sectorCells`. Update `tests/intents.test.ts` as listed. Run the intents, formation and damage suites; damage must pass unchanged.
3. **TR.C3 — Lab.** Derive the legend count and set the spacing. Update `tests/browser-lab.mjs` as listed. Build, preview, run the headless Chrome check, and inspect the screenshots.
4. **TR.C4 — Contracts and full verification.** Update the prototype README public contracts. Run every verification command at one candidate revision.

## Required test updates (explicit exception)

The assignment must grant an exception permitting exactly these existing-test edits. They are required because the assertions encode the superseded radius-3 board, the `R` table, the CT mapping, Spread distance 6, or the 30-cell sectors that the user decision and the TR amendments replace. Each edit must keep or strengthen the contract coverage it replaces.

`tests/formation.test.ts` (P02):

1. **Fixtures.** Remove the 18-cell `ring` fixture and add a hand-written 6-cell `S` fixture. Keep the existing `ringTwo` (`T`) fixture unchanged. Replace `compactCells` with the TR Compact table.
2. **"C1: board is exactly the 37 unique integer cells within radius three".** Change it to 19 unique integer cells within radius two. Check that the radius-2 subset equals `T`, the radius-1 subset equals `S`, and `(0,0)` is present. Update `expect.assertions` to the new count.
3. **"C1/C4: all 18 ring indices match R …".** Replace it with an equivalent `RING_ONE` test: equals `S`, length 6, unique, every cell at radius 1, table and cells frozen, and `S[(k+1) mod 6]` equal to the clockwise turn of `S[k]`. Remove the `OUTER_RING` import. The "CT: T contains twelve frozen radius-two cells" test stays unchanged.
4. **"axial distance matches cube distance for every ordered board-cell pair".** Change only `expect.assertions(37 * 37 * 2)` to `19 * 19 * 2`.
5. **C2 per-state mapping test.** Compact expectations come from the TR table. Spread expectations become `ringTwo[(2o + offset) % 12]` with offsets `[0, 4, 8]`. The radius expectation becomes Compact `[2, 2, 1]` and Spread `[2, 2, 2]`.
6. **C4 link test.** Spread distances change from `[6,6,6]` to `[4,4,4]`. Compact stays `[1,1,1]`.
7. **"Close uses an inclusive configurable threshold" test.** The Spread boundary moves from 5/6 to 3/4: threshold 3 is all Stretched and threshold 4 is all Close. The Compact 1/0 cases stay unchanged.

The CT adjacency test, C2/C5, both C3 tests, C6, the error tests and the frozen-input `hexDistance` test (arbitrary coordinates, not board cells) stay unchanged.

`tests/intents.test.ts` (P05):

1. **Fixtures.** Replace `ring` with the hand-written 12-cell `T` and `ringTwo` with the hand-written 6-cell `S`. Rename them for clarity if wanted. Change `sectors` to `[T[2s], T[2s+1], S[s]]`; `fronts` keeps its construction. `slots.compact` becomes the TR Compact table. `slots.spread` becomes T indices `[0,4,8]`, `[2,6,10]`, `[4,8,0]`, `[6,10,2]`, `[8,0,4]`, `[10,2,6]`.
2. **`areaRecipients` and `turnedRecipients`.** These must keep their current values. Changing either is a stop condition.
3. **"CT/AC1: sectors disjointly partition the thirty radius-two/three cells".** Change it to eighteen radius-one/two cells: length 18, 18 unique, union equal to `T ∪ S`. Add an assertion that `(0,0)` is in no sector.
4. **"CT: inward Pazuzu is protection-eligible and a fixed-area recipient".** The singleton inward area cell changes from `(1,1)` to `(1,0)`, which is Compact orientation-zero Pazuzu. All other expectations stay unchanged.

Every other intents test must pass unchanged, including "Close and splash boundaries" (Compact pairs are still distance 1, and Spread at threshold 6 is still Close) and the outside-sector case at Compact orientation 2.

`tests/browser-lab.mjs` (P04):

1. `equal(... dataset.cells, 37, 'board cell count')` becomes `19`.
2. Add one assertion that the visible legend reports `19 cells`, so a hard-coded count cannot return.
3. The contraction message text "include ring-two Pazuzu" may become "include ring-one Pazuzu". This edits the label only; the assertion stays the same.

All other assertions, including the 36 per-token hit-tests, stay unchanged. Report the new assertion total against the delivered 176.

**Must pass unchanged:** `tests/damage.test.ts`, `tests/commands.test.ts`, `tests/view.test.ts`, `tests/smoke.test.ts` and `tests/asset-copy.test.ts`. If any of them fails, stop and report the assertion. Do not edit it.

## Acceptance criteria

1. `boardCells()` returns exactly 19 unique integer cells: `(0,0)`, the 6 cells of `S` and the 12 cells of `T`. None exceeds radius 2.
2. `RING_TWO` is byte-identical to BASE. `RING_ONE` equals `S`. Both are frozen, with clockwise steps of +2 and +1. `OUTER_RING` is no longer exported, and typecheck passes with no remaining consumer.
3. Every orientation `o` places Compact at Ugallu `T[2o]`, Girtablilu `T[2o+1]`, Pazuzu `S[o]`, and Spread at `T[2o]`, `T[2o+4]`, `T[2o+8]` (mod 12), exactly per the fixture table. Compact pairwise distances are 1 and Spread distances are 4. No state occupies `(0,0)`.
4. All twelve states are distinct and roster-ordered, and Spread orientations 0 and 2 keep different labelled assignments. Rotation, its inverse, six turns, and expand/contract round trips restore serialized positions. Clockwise rotation equals the axial turn of every labelled position.
5. At default threshold 2, Compact links are `[1,1,1]` Close and Spread links `[4,4,4]` Stretched. At threshold 0 Compact is Stretched. At threshold 3 Spread is Stretched, and at 4 it is Close. `CLOSE_THRESHOLD`, `SPLASH_RADIUS` and `DEFAULT_DAMAGE_RULES` are unchanged.
6. Each `sectorCells(s)` returns `T[2s], T[2s+1], S[s]` in order. The sectors partition the 18 cells of rings 1–2, and `(0,0)` is outside every sector. `frontMask(f)` returns six ordered cells, and turning `frontMask(f)` equals `frontMask(f+1)` in order.
7. Across all twelve states and every legal maneuver, the hand-written area, turned-area, mark, splash, protection, active-link and isolation expectations hold, including with a fallen Girtablilu. The recipient tables are unchanged. Compact Pazuzu on ring 1 is protected inside Warder's front and is a fixed-area recipient.
8. The P06 damage suite and the P03/P04 unit suites pass without edits.
9. The built lab renders 19 cells, and the legend reports 19. All twelve fixtures match core positions and links. Every token is on screen and pointer-selectable, and Compact link labels lie outside the triangle without covering tokens. Expand and contract previews show the ring-1 cell exactly as committed. The 1280×800 layout fits without scrolling, and the headless Chrome check reports zero uncaught exceptions.
10. The prototype README public contracts state the 19-cell board, `RING_TWO`/`RING_ONE`, the TR mapping, distances `[1,1,1]`/`[4,4,4]`, sectors over rings 1–2, and the centre as the only unmasked cell and a provisional, view-only enemy anchor. They contain no remaining claim of a 37-cell board, `OUTER_RING`/`R`, Spread distance 6 or 30-cell sectors.
11. Invalid inputs and frozen-input checks behave as delivered.

## Verification and hand-back

Run from the repository root at one candidate revision:

- `just poc-001-test tests/formation.test.ts tests/intents.test.ts tests/damage.test.ts`
- `just poc-001-test` (full suite; report file, test and assertion counts against the delivered 278 tests)
- `just poc-001-typecheck`
- `just poc-001-build`
- `just poc-001-preview`, then `bun poc-001-linked-formation/tests/browser-lab.mjs <chrome-binary> <os-temp-output-dir>`. CT used the Playwright headless shell. Record the exact binary, version, assertion count and exception count. Open and inspect at least `normal.png`, every Compact fixture capture (`fixture-0.png` to `fixture-5.png`), one Spread capture and `expand-preview.png`, checking for readable labels, separated tokens and the whole board on screen.
- `git diff --check BASE..HEAD`
- `git diff --exit-code BASE..HEAD --` with the protected paths listed under Starting source and ownership

Return `docs/mailbox/two-ring-board/implementer.md` with a leading ruach-handoff block, validated with `bun .agents/skills/ruach-handoff/scripts/validate.ts`. Include:

- the tested revision and changed paths;
- exact commands and results;
- serialized Compact and Spread orientation-zero positions and links;
- the per-file test edit list, mapped to the numbered exception items above;
- acceptance mapping;
- the chosen spacing, and the screenshots inspected (kept outside the repository unless the Coordinator asks otherwise).

Do not edit `docs/CURRENT.md`, `docs/TASK_LOGS.md`, ADRs or plan files.

## Non-goals and stop conditions

Out of scope:

- enemy placement rules, enemy tokens in the lab, or encounter content (P08/P10/P12 own those, and layout is an open experiment question);
- new shapes, a different number of orientations, or a configurable board radius;
- threshold, splash or damage tuning;
- animation or movement paths;
- P07+ implementation;
- amending ADR-0004's "three rings (37 cells)" scope line, which is a Coordinator or Librarian matter.

Stop and report before proceeding when:

- an unlisted existing test fails;
- a P05 recipient or protection table would need a value other than its current one;
- a token cannot be made selectable and readable without changing a core contract;
- the user changes a provisional default above (for example, choosing Compact family B or edge-cell Spread). The P02/P05 amendments and this plan must be revised first.
