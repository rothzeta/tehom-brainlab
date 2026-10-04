# Make Compact a true triangle across formation, intents and lab

## Status and authority

**Implemented, independently reviewed (no findings), accepted, locally delivered.** [Implementation evidence](../mailbox/compact-triangle/implementer.md); [independent review](../mailbox/compact-triangle/reviewer.md). Written 2026-10-04 against BASE `0f9c1b7` (local master content with P01–P06 delivered). The Coordinator assigns the owner. The task owner is a POC 001 Implementer, who also owns local integration unless assigned otherwise.

Authority: user decision of 2026-10-04, recorded in the [brief's Decision record](../prototypes/poc-001-linked-formation.md#decision-record). Compact is three mutually adjacent cells, two on the outer ring and one on ring 2, with all links at distance 1. Ugallu and Girtablilu are outer; Pazuzu is inward. The user also accepted the exact mapping and the sector coverage of the inward cell on 2026-10-04 (see Accepted user decisions below). They are specified in their owning plans:

- [P02 Amendment CT](2026-10-02-2e228a2b-poc-001-formation-algebra.md#amendment-ct-2026-10-04--compact-triangle): ring-2 table and mapping.
- [P05 Amendment CT](2026-10-02-d66a7452-poc-001-intent-semantics.md#amendment-ct-2026-10-04--compact-triangle): sectors.
- [P04 Amendment CT](2026-10-02-9d81c6df-poc-001-formation-lab.md#amendment-ct-2026-10-04--compact-triangle): lab.
- [P06 Amendment CT](2026-10-02-4c3c0d42-poc-001-damage-and-fallen.md#amendment-ct-2026-10-04--compact-triangle): no change.

Design rationale and open questions are in the [Architect report](../mailbox/compact-triangle/architect.md). Sequence: [plan index](README.md). Format: [ADR-0002](../adr/0002-plan-filenames.md), [ADR-0003](../adr/0003-implementation-plan-writing.md). Testing: [ADR-0006](../adr/0006-contract-invariants-and-black-box-testing.md).

## Smallest useful outcome

Core positions put every Compact orientation in the amended triangle with links `[1,1,1]`. P05 masks cover the inward cell. The browser lab shows readable, selectable triangles, and all delivered contracts outside the listed test updates keep passing. A result fails acceptance if it changes only the renderer, keeps outer-only sectors, or edits unlisted tests to pass.

## Starting source and ownership

Inspected at `0f9c1b7`, within `poc-001-linked-formation/`:

| File | Current behaviour | Change |
|---|---|---|
| `src/core/hex.ts` | Exports `OUTER_RING` `R` only | Add a frozen clockwise ring-2 export `T` (proposed name `RING_TWO`) per P02 Amendment CT |
| `src/core/formation.ts` | Compact = `R[3o+[0,1,2]]` via shared stride | Compact = `R[3o+1], R[3o+2], T[2o+1]`; Spread unchanged; update doc comments |
| `src/core/sectors.ts` | `sectorCells(s)` = `R[3s..3s+2]` | Append `T[2s], T[2s+1]`; `frontMask` keeps concatenation; update doc comments |
| `src/core/intents.ts` | Uses `frontMask` and positions; no ring assumption in logic | No logic change expected; correct any comment that says outer ring |
| `src/view/FormationLab.ts` (and `lab.css` only if needed) | Compact label offset assumes long middle link | Labels outside the triangle; tokens individually selectable |
| `README.md` (prototype) | Public contracts state old mapping, `[1,2,1]`, outer-only sectors and "ring cell" protection | Update P02/P05 contract text and mapping |
| `tests/formation.test.ts`, `tests/intents.test.ts`, `tests/browser-lab.mjs` | Encode old Compact cells and masks | Update as listed below |

Unchanged and protected: `src/core/{damage,lifecycle,transition,commands,state,smoke}.ts`, `src/view/{projection,lab-state}.ts`, `tests/{damage,commands,view,smoke,asset-copy}.test.ts`, assets, `docs/CURRENT.md`, `docs/TASK_LOGS.md`. `CLOSE_THRESHOLD = 2`, `SPLASH_RADIUS = 2` and `DEFAULT_DAMAGE_RULES` stay unchanged.

## Fixture and inputs

Use the hand-written P02 Amendment CT tables (`T` and the Compact cell table) as independent test fixtures. Do not derive expected cells from module output. P05 expectations stay hand-written: the area and turned-area recipient tables keep their current values, as listed in P05 Amendment CT.

## Contracts and decisions

### Required contracts

- Twelve distinct labelled states.
- Inverse rotations and inverse shape changes restore exact labelled positions; six turns restore the start.
- Orientation and roster order are preserved.
- No overlap.
- Inputs are not mutated, and invalid inputs are rejected with the delivered errors.
- Compact has two outer cells (Ugallu, Girtablilu) and one ring-2 cell (Pazuzu), all pairwise adjacent. Spread is byte-identical to BASE.
- Sectors partition rings 2–3. Front masks turn in order under Crosswind.
- Preview and commit stay on the same transition.

### Settled choices

The user decision above. Spread, six orientations, expand/contract semantics, threshold 2 and splash radius 2 are unchanged.

### Proposed implementation

Keep the formation `{shape, orientation}` representation and derived positions. Compact and Spread may use separate index expressions; do not add a generic shape table or a configurable geometry layer. For P04 label placement, a per-link offset away from the third vertex is enough. No layout engine is needed.

### Accepted user decisions (2026-10-04)

1. The inward Brood is covered by sector areas and fronts like the outer cells of its sector (P05 Amendment CT).
2. Slot assignment follows the user's sketch, Pazuzu inward. "Clockwise order" means order around the formation's own centre (brief Decision record).
3. Compact uses the mid-side triangle. Ugallu moves one cell on Expand/Contract.

## Implementation checkpoints

1. **CT.C1 — Formation algebra.** Add `T` and the Compact mapping. Update `tests/formation.test.ts` as listed. Run the focused formation suite.
2. **CT.C2 — Sectors.** Extend sectors and front masks. Update `tests/intents.test.ts` as listed. Run the intents, formation and damage suites; damage must pass unchanged.
3. **CT.C3 — Lab.** Fix Compact link-label placement and token selectability. Add the browser hit-test assertion. Build, preview and run the headless Chrome check, then inspect Compact screenshots.
4. **CT.C4 — Contracts and full verification.** Update prototype README public contracts. Run all verification commands at one candidate revision.

## Required test updates (explicit exception)

The assignment must grant an exception permitting exactly these existing-test edits. They are required because those assertions encode the superseded collinear Compact, or the outer-only sectors that the user decision and P05 Amendment CT replace. Each edit must keep or strengthen the contract coverage it replaces.

`tests/formation.test.ts` (P02):

- **C2 per-state mapping test.** Replace the ring-index expectation (`3o+[0,1,2]`) and the "all at radius 3" assertion. Use the hand-written Compact table with Ugallu and Girtablilu at radius 3 and Pazuzu at radius 2. Spread keeps its ring-index expectation and radius 3.
- **C4 link test.** Compact distances change from `[1,2,1]` to `[1,1,1]`.
- **"Close uses an inclusive configurable threshold" test.** The Compact threshold-1 expectation becomes all Close. Keep threshold 0 as all Stretched. Add a Spread 5/6 boundary to keep inclusive-boundary coverage on both sides.
- **Add** a `T` test: 12 unique radius-2 cells, equal to the hand-written table, with `T[(j+2) mod 12]` equal to the clockwise turn of `T[j]`. Also add an assertion that every Compact pair is adjacent.
- C1, C3, C5, C6 and the error tests stay unchanged. The C3 turn-equality assertion must pass as is.

`tests/intents.test.ts` (P05):

- **The `fronts` fixture and AC1 test.** Extend to the ten-cell ordered masks using an independent hand-written `T`. Add sector disjointness and the 30-cell union.
- **The `area` fixture.** It is built from `fronts[0]`, so it becomes ten cells. The `areaRecipients` and `turnedRecipients` values must stay as they are.
- **`slots.compact`.** Ring indices can no longer express Compact. Replace them with explicit Compact cells, so the mark-anchor expectation becomes Girtablilu's new cell `R[3o+2]`.
- **The "Close and splash boundaries" test.** Splash radius 1 on Ugallu now returns all three, and `isCloseLinked(ugallu, pazuzu, 1)` becomes true. Replace these with equivalent inclusive-boundary cases: distance 1 at threshold 1 is Close and at threshold 0 is not; splash radius 0 gives the target only.
- **Add** one case where Compact Pazuzu at ring 2 is protected inside Warder's front and is a fixed-area recipient. This prevents an outer-only regression.

`tests/browser-lab.mjs` (P04): add, for each of the twelve fixtures, an assertion that `document.elementFromPoint` at each token's centre resolves inside that token. Existing assertions stay unchanged; report the new assertion total.

**Must pass unchanged:** `tests/damage.test.ts`, `tests/commands.test.ts`, `tests/view.test.ts`, `tests/smoke.test.ts` and `tests/asset-copy.test.ts`. If any of them fails, stop and report the assertion. Do not edit it.

## Acceptance criteria

1. Every Compact orientation `o` places Ugallu `R[3o+1]`, Girtablilu `R[3o+2]` and Pazuzu `T[2o+1]`, exactly per the P02 table, with all pairwise distances 1. Spread positions are byte-equal to BASE output for all six orientations.
2. All twelve states are distinct and roster-ordered. Rotation, its inverse, six turns, and expand/contract round trips restore serialized positions. Clockwise rotation equals the axial turn of every labelled position.
3. At default threshold 2, Compact links are `[1,1,1]` Close and Spread links are `[6,6,6]` Stretched. At threshold 0, Compact is Stretched. `CLOSE_THRESHOLD`, `SPLASH_RADIUS` and `DEFAULT_DAMAGE_RULES` are unchanged.
4. Each `sectorCells(s)` returns the five ordered cells of P05 Amendment CT. The sectors partition the 30 radius-2/3 cells. `frontMask(f)` returns ten ordered cells, and turning `frontMask(f)` equals `frontMask(f+1)` in order.
5. Across all twelve states and every legal maneuver, hand-written area, turned-area, mark, splash, protection, active-link and isolation expectations hold, including with a fallen Girtablilu. An inward Pazuzu inside a front is protected-eligible, and inside an area is a recipient.
6. The P06 damage suite and P03/P04 unit suites pass without edits.
7. The built lab renders all twelve fixtures with core positions and links. Every token is pointer-selectable, and Compact link labels lie outside the triangle without covering tokens. Expand and contract previews show the ring-2 cell exactly as committed. The headless Chrome check reports zero uncaught exceptions.
8. The prototype README public contracts state the new mapping, `T`, the Compact distances and the ring-2 sectors. They contain no remaining claim that Brood are always on the outer ring or that protection uses a "ring cell" on the outer ring only.
9. Invalid inputs and frozen-input checks behave as delivered.

## Verification and hand-back

Run from the repository root at one candidate revision:

- `just poc-001-test tests/formation.test.ts tests/intents.test.ts tests/damage.test.ts`
- `just poc-001-test` (full suite; report file/test/assertion counts against the delivered 274 tests)
- `just poc-001-typecheck`
- `just poc-001-build`
- `just poc-001-preview`, then `bun poc-001-linked-formation/tests/browser-lab.mjs <chrome-binary> <os-temp-output-dir>`. P04 used the Playwright headless shell; record the exact binary, version, assertion count and exception count.
- `git diff --check BASE..HEAD`
- `git diff --exit-code BASE..HEAD --` with the protected paths listed under Starting source and ownership

Return `docs/mailbox/compact-triangle/implementer.md` with a leading ruach-handoff block, validated with `bun .agents/skills/ruach-handoff/scripts/validate.ts`. Include:

- the tested revision and changed paths;
- exact commands and results;
- serialized Compact and Spread orientation-zero positions and links;
- the per-file test edit list, mapped to the reasons above;
- acceptance mapping;
- screenshots inspected, kept outside the repository unless the Coordinator asks otherwise.

Do not edit `docs/CURRENT.md`, `docs/TASK_LOGS.md` or plan files.

## Non-goals and stop conditions

Out of scope:

- new shapes, asymmetric formations, or a different number of orientations;
- threshold, splash or damage tuning;
- animation or movement paths;
- P07+ implementation;
- a generic geometry or shape-table abstraction.

Stop and report before proceeding when:

- an unlisted existing test fails;
- a P05 recipient or protection table would need a different value than P05 Amendment CT states;
- token selectability cannot be fixed without changing a core contract;
- a later user decision changes one of the accepted decisions above. The affected plan amendment must be revised first.
