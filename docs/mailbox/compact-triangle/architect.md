task: CT-design (+ CT-design-confirm)
role: architect
status: complete
outcome: "Designed Compact as a true triangle and amended the brief and P02/P04/P05/P06/P10 plans, plus the plan index. Wrote bounded implementation task CT. The user then accepted all three open-question defaults (2026-10-04), and they are recorded as accepted decisions. No source or test changes."
baseline: 0f9c1b7d4d0ff01c4a890df8a8c4a4500737165e
revision: 33dcf5e5d08552287ec05b05c3934d39039b3c58
artifacts:
  - docs/mailbox/compact-triangle/architect.md
  - docs/mailbox/compact-triangle/assignment-architect.md
  - docs/mailbox/compact-triangle/assignment-architect-confirm.md
  - docs/prototypes/poc-001-linked-formation.md
  - docs/plans/2026-10-04-fb4bf201-poc-001-compact-triangle.md
  - docs/plans/2026-10-02-2e228a2b-poc-001-formation-algebra.md
  - docs/plans/2026-10-02-d66a7452-poc-001-intent-semantics.md
  - docs/plans/2026-10-02-9d81c6df-poc-001-formation-lab.md
  - docs/plans/2026-10-02-4c3c0d42-poc-001-damage-and-fallen.md
  - docs/plans/2026-10-02-e7c77542-poc-001-playable-patrol.md
  - docs/plans/README.md
  - branch compact-triangle
verification:
  - "Disposable node script outside the repository checked the arithmetic: compact pairwise distances 1,1,1 and spread 6,6,6 at all orientations; clockwise axial turn maps every labelled position to orientation o+1; T has 12 radius-2 cells; T index +2 is the clockwise turn; the six amended sectors partition the 30 radius-2/3 cells; turned front masks equal the next front in order; P05 area/turned recipient tables keep their delivered values. All matched."
  - "Relative-link existence check over the brief and all plan files: all targets exist."
  - "ruach-handoff validator with --repo: ok true, revision resolved, no diagnostics (after a frozen install of the skill-local dependencies, which is ignored by Git)."
  - "Confirmation pass: grep over the brief, the amended plans, the CT plan and the index found no remaining provisional or pending wording for Q1-Q3; git diff --check is clean."
  - "No application tests, typecheck, build or browser checks were run; no source changed."
discoveries:
  - "Delivered P05 sectors cover the outer ring only, so the inward Brood would never be protected or swept. P05 Amendment CT extends sectors to rings 2-3; without it the triangle silently creates a safe slot."
  - "Under the user's slot assignment (Pazuzu inward), the angular order seen from the encounter centre becomes U,P,G. Order around the formation's own centre stays U,G,P, so Expand is orientation-preserving. The brief's 'clockwise order' wording is amended accordingly."
  - "P06 damage tests are expected to pass unchanged: all compact geometry they depend on (front membership at o0/o2, Shelter Close pairs, splash coverage) is preserved."
  - "P04 FormationLab Compact link-label offsets assume the old 1,2,1 line. Tokens (112 px wide on an 85 px pitch) need a selectability check for the triangle."
  - "P07, P08, P09, P11 and P12 need no plan edits. P12's sweep and protection inherit the ring-2 masks through P05. P10 gained a note on ring-2 tokens next to P08's ring-1 enemy anchors."
  - "The prototype README public contracts (P02 mapping, [1,2,1], outer-only sectors) must be updated by the Implementer; this assignment did not permit editing it."
open_questions: []
resolved_questions:
  - "Q1 inward exposure: accepted by the user 2026-10-04. The ring-2 Brood is covered by sector areas, sweeps and protection fronts; sectors span rings 2-3."
  - "Q2 slot and order: accepted by the user 2026-10-04. Pazuzu is inward; clockwise order is taken around the formation's own centre (U,G,P)."
  - "Q3 placement: accepted by the user 2026-10-04. Mid-side triangle R[3o+1], R[3o+2], T[2o+1]."
blockers: []

# Compact triangle — Architect report (CT-design)

Author: Architect, Compact-triangle task. Inspected BASE `0f9c1b7` on branch `compact-triangle`. Assignment: [assignment-architect.md](assignment-architect.md).

## Proposed design

Geometry uses outer ring `R` (P02, clockwise from `(3,0)`, 18 cells) and new ring-2 table `T`, clockwise from `(2,0)`:

```text
(2,0), (1,1), (0,2), (-1,2), (-2,2), (-2,1),
(-2,0), (-1,-1), (0,-2), (1,-2), (2,-2), (2,-1)
```

Mapping, in roster order `[ugallu, girtablilu, pazuzu]`, for orientation `o` in 0–5:

- Compact: `R[3o+1]`, `R[3o+2]`, `T[2o+1]`. At orientation 0 this is `(2,1)`, `(1,2)`, `(1,1)`.
- Spread (unchanged): `R[3o]`, `R[3o+6]`, `R[3o+12]`.

The full table is in the [P02 amendment](../../plans/2026-10-02-2e228a2b-poc-001-formation-algebra.md#amendment-ct-2026-10-04--compact-triangle).

Why this mapping:

- **Matches the user's sketch.** Ugallu and Girtablilu hold the two interior cells of outer side `o`. Pazuzu holds the one ring-2 cell adjacent to both. The triangle is symmetric about the side's radial midline, with Pazuzu centred inward.
- **Stays inside sector `o`.** The old Compact was exactly sector `o`, so the P05 tables keep their values.
- **Rotation is unchanged.** It is still orientation ±1, and the axial turn advances `R` by 3 and `T` by 2.
- **Expand/Contract need no new code paths.** They are unchanged in the formation algebra: labelled, orientation-preserving, exactly reversible and without mirroring. Pazuzu steps between ring 2 and ring 3; Ugallu moves one cell, `R[3o+1]` ↔ `R[3o]`.
- **Links.** Compact is `[1,1,1]` Close; Spread is `[6,6,6]` Stretched. The Close threshold stays 2, since thresholds 1–5 classify identically.

Sectors (P05 owns them): `sectorCells(s)` = `R[3s..3s+2]` then `T[2s..2s+1]`. `frontMask(f)` is ten ordered cells. The sectors partition rings 2–3, and a Crosswind turn maps each front to the next in order. The other intent consequences are:

- Areas, marks and splash need no code change.
- A mark on Girtablilu now anchors at `R[3o+2]`.
- Protection checks the attacker's actual cell, on either ring.
- Isolation is unchanged.

Rejected alternatives:

- **Girtablilu inward.** This keeps the old angular order seen from the centre, but reflects the triangle on Expand and overrides the user's preference.
- **Corner-anchored triangle** `R[3o], R[3o+1], T[2o]`. It keeps Ugallu fixed on Expand, but the triangle is lopsided against the arena and Pazuzu is not centred.
- **Outer-only sectors.** These give the inward Brood implicit immunity from protection fronts and sweeps.

## Affected components

- **Source, for the task to change:** `src/core/hex.ts` (add `T`), `src/core/formation.ts` (Compact mapping), `src/core/sectors.ts` (wedge sectors), `src/view/FormationLab.ts` (Compact label placement and selectability; `lab.css` only if needed), and the prototype `README.md` public contracts.
- **Tests, under an explicit exception:** `tests/formation.test.ts`, `tests/intents.test.ts`, `tests/browser-lab.mjs`. The exact edits and reasons are in the [task plan](../../plans/2026-10-04-fb4bf201-poc-001-compact-triangle.md#required-test-updates-explicit-exception).
- **Must pass unchanged:** the damage, commands, view, smoke and asset-copy tests.

## Constraints, dependencies, risks

- **P05 masks.** P05 is delivered, so the sector change alters P05 public behaviour. That is intentional and recorded as a P05-owned provisional default.
- **Token selectability.** Token overlap at 112 px on an 85 px pitch may hide a neighbour's centre in some Compact orientation. The task requires a hit-test assertion and a presentation fix, not a test weakening.
- **Delivered evidence.** P02's delivered evidence (90 tests/3,349 assertions) and P05's tables stay historical. The amendments are additive sections that supersede the named parts, and the original text records delivered behaviour.
- **Prerequisite for later plans.** P07+ plans assume P05 masks; executing CT before P07 is recommended.

## Plan edits made

| Document | Change |
|---|---|
| [Brief](../../prototypes/poc-001-linked-formation.md) | New Compact definition, "clockwise order" and Expand wording, Links note, Open-decisions note, and a dated [Decision record](../../prototypes/poc-001-linked-formation.md#decision-record) |
| [P02](../../plans/2026-10-02-2e228a2b-poc-001-formation-algebra.md#amendment-ct-2026-10-04--compact-triangle) | `T`, mapping table, rationale, consequences, amended acceptance criteria 2 and 4, new criterion 7 |
| [P05](../../plans/2026-10-02-d66a7452-poc-001-intent-semantics.md#amendment-ct-2026-10-04--compact-triangle) | Wedge sectors, ten-cell fronts, consequences, amended acceptance criterion 1, Q1 default |
| [P04](../../plans/2026-10-02-9d81c6df-poc-001-formation-lab.md#amendment-ct-2026-10-04--compact-triangle) | Label placement, selectability, extra browser evidence |
| [P06](../../plans/2026-10-02-4c3c0d42-poc-001-damage-and-fallen.md#amendment-ct-2026-10-04--compact-triangle) | Assessed: no change; stop rule if a damage test fails |
| [P10](../../plans/2026-10-02-e7c77542-poc-001-playable-patrol.md) | Note on ring-2 tokens next to ring-1 enemy anchors and ring-2 telegraphs |
| P07, P08, P09, P11, P12 | No edit needed. Impale/Shelter use links (unchanged classification). P08 targeting is roster/ID based. P09/P11 are formation-state based. P12 inherits the masks |
| [Index](../../plans/README.md) | CT row, sequencing note, P02 ownership now includes the ring-2 table |
| [Task CT](../../plans/2026-10-04-fb4bf201-poc-001-compact-triangle.md) | Bounded implementation task: files, checkpoints CT.C1–C4, test-update exception, nine acceptance criteria, verification commands |

## Open questions (provisional defaults applied)

1. **Inward exposure.** Default: the ring-2 Brood is covered by sector areas and fronts like the outer cells of its sector. The alternative would make it a sheltered slot, which is a new mechanic.
2. **Slot and order.** Default: Pazuzu is inward per the sketch, and "clockwise order" means order around the formation's own centre.
3. **Placement.** Default: the mid-side triangle, so Ugallu moves one cell on Expand. The alternative is the corner-anchored triangle, which keeps Ugallu fixed but is lopsided.

## Implementation boundaries and readiness

Ready for implementation under [task CT](../../plans/2026-10-04-fb4bf201-poc-001-compact-triangle.md). The assignment must carry its listed test-update exception. A user override of Q1–Q3 requires revising the owning plan amendment first. No blockers.

## Validation

The validator command is `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/compact-triangle/architect.md --repo /opt/dev/tehom-brainlab-compact`. It returned `ok: true` with BASE resolved and no diagnostics, after `bun install --frozen-lockfile` in the skill directory; the installed `node_modules` are Git-ignored. Only the checks listed in the leading block were performed.

## User confirmation

On 2026-10-04 the user accepted all three defaults ([assignment](assignment-architect-confirm.md)):

1. **Inward exposure:** the ring-2 Brood is covered by sector areas, sweeps and protection fronts like the outer cells of its sector.
2. **Slot and order:** Pazuzu is inward, and clockwise order is taken around the formation's own centre.
3. **Placement:** mid-side, at `R[3o+1]`, `R[3o+2]`, `T[2o+1]`.

These are now worded as accepted user decisions (2026-10-04) in the brief's Decision record and Open decisions, the P02 mapping, the P05 sector amendment, the CT task (its "Accepted user decisions" section and stop condition) and the plan index CT row. No other content changed. The earlier "Open questions" section above is historical. The task is ready for implementation with no blockers.
