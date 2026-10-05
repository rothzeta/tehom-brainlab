# Inspect and maneuver the linked formation in a readable browser lab

## Status and authority

**P04. Implemented, independently reviewed (no blocking findings; optional O1 open), accepted, locally delivered.** [Implementation evidence](../mailbox/p04-formation-lab/implementer.md), [integration](../mailbox/p04-formation-lab/integration.md), [independent review](../mailbox/p04-formation-lab/reviewer.md). Depends on [P01](2026-10-02-a87b131a-poc-001-browser-harness.md), [P02](2026-10-02-2e228a2b-poc-001-formation-algebra.md), and [P03](2026-10-02-2dfffcd3-poc-001-command-boundary.md). Baseline: `79f9498051df0281e6e9d3c904e9eee32f014873`.

Authority: [prototype First implementation slice](../../poc-001-linked-formation/README.md), [brief Presentation requirements](../../docs/prototypes/poc-001-linked-formation.md), [asset manifest](../../assets/manifest.json), and [credits](../../assets/CREDITS.md). See the [index](README.md) and local ADRs below for formatting authority. Full combat previews belong to P09, not this slice.

**Amended 2026-10-04:** the lab must render the Compact triangle; see [Amendment CT](#amendment-ct-2026-10-04--compact-triangle) (implemented and locally delivered).

**Amended 2026-10-04 (later):** the lab renders the 19-cell two-ring board; see [Amendment TR](#amendment-tr-2026-10-04--two-ring-board). Not yet implemented.

**Amended 2026-10-05:** the lab shows the ring-1 Compact triangle; see [Amendment RF](#amendment-rf-2026-10-05--ring-formation). No lab code change is expected. Not yet implemented.

Delivery sequence: [P01–P12 index](README.md). Governing format: [ADR-0002](../adr/0002-plan-filenames.md) and [ADR-0003](../adr/0003-implementation-plan-writing.md).

Task `P04` owner and integration owner: POC 001 implementer, currently unassigned. This plan is one standalone task; its sequential checkpoints inherit the prerequisites, affected components, acceptance criteria, verification, and hand-back defined here. Checkpoint identifiers remain stable on edits. The Coordinator records actual execution in [TASK_LOGS](../TASK_LOGS.md) from the implementer's mailbox handoff; no execution evidence exists yet.

## Amendment RF (2026-10-05) — ring formation

**Status: assessed; no lab code change expected; not yet implemented.** Trigger: the user's ring-formation decision ([brief Decision record](../../docs/prototypes/poc-001-linked-formation.md#decision-record)) and [P02 Amendment RF](2026-10-02-2e228a2b-poc-001-formation-algebra.md#amendment-rf-2026-10-05--ring-formation-and-enemy-cells). Execution: [Ring formation task](2026-10-05-c6399cb6-poc-001-ring-formation.md).

- The lab derives every token, link and ghost from P02, so it shows the new Compact (three ring-1 cells around the empty centre, links of distance 2) without a code change. The delivered spacing (120 px), stage and legend are unchanged.
- The existing browser check compares the rendered positions, links and ghosts with core output and clicks the empty centre. It is expected to pass unedited. Its contraction message "include ring-one Pazuzu" now describes all three Brood; it is a label, not an assertion.
- Compact link labels sit on the three long sides of the triangle around the centre. If a label covers a token or the centre click target, fix the presentation, not the test.
- The lab renders no enemies (unchanged).

Additional evidence: screenshots of every Compact orientation and of an Expand ghost from Compact, inspected for readable labels and separated tokens.

## Amendment TR (2026-10-04) — two-ring board

**Status: accepted design amendment, not yet implemented.** Trigger: the user's two-ring decision ([brief Decision record](../../docs/prototypes/poc-001-linked-formation.md#decision-record)) and the [P02 two-ring amendment](2026-10-02-2e228a2b-poc-001-formation-algebra.md#amendment-tr-2026-10-04--two-ring-board). Execution: [Two-ring board task](2026-10-04-d005e5f4-poc-001-two-ring-board.md).

The lab contracts are unchanged. Board cells, positions, links, ghosts and availability come from core, and `projectHex` projects any axial cell. The delivered view (`40b516f`) has these board-size assumptions, which must change:

- **Cell count.** The legend hard-codes "37 cells". Derive it from `boardCells().length`, which already feeds `#board-stage[data-cells]`, so the text cannot drift. The lab must render 19 cells.
- **Pixel pitch (view choice, provisional).** At the delivered spacing of 85 px the 19-cell board fills about half the 760×610 stage. Raise `PROJECTION.spacing` to 120 px and keep the origin at `(380, 295)` and the stage size. At 120 px the board's hexes span about 600×554 px, the token centres stay within x 140–620 and y 87–503, and tokens 112 px wide no longer overlap neighbouring tokens. The hex radius already derives from the spacing. An Implementer may choose another spacing from 100 to 120 px if screenshots show a reason. Any value must keep every token on screen, keep the 1280×800 layout fitting the viewport, and keep link labels clear of tokens.
- **Empty-centre check.** The browser check clicks the stage origin as an empty cell. The centre `(0,0)` is still never occupied by a Brood, and the origin is unchanged, so that check stays valid.
- **Labels and ghosts.** Compact link-label placement (away from the third vertex) and Spread placement need no logic change. Spread links now cross ring 1 instead of rings 1–2. Confirm in screenshots that labels and ghost captions stay readable at the new spacing.
- **Enemy anchors.** None are rendered in this lab. Patrol emblems appear only in the credits panel.

**Amended acceptance criterion 1:** every P02 fixture renders 19 cells, three distinct labelled Brood, and three links with the same states reported by core. The other criteria and the Amendment CT evidence (per-token hit-tests, readable Compact labels, exact ghosts, now including the ring-1 cell) are unchanged.

## Amendment CT (2026-10-04) — Compact triangle

**Status: implemented and locally delivered on the radius-3 board; board size superseded by [Amendment TR](#amendment-tr-2026-10-04--two-ring-board).** Trigger: the user decision of 2026-10-04 ([brief Decision record](../../docs/prototypes/poc-001-linked-formation.md#decision-record)) and the [P02 mapping amendment](2026-10-02-2e228a2b-poc-001-formation-algebra.md#amendment-ct-2026-10-04--compact-triangle). Execution: [Compact triangle task](2026-10-04-fb4bf201-poc-001-compact-triangle.md).

The lab contracts are unchanged. Positions, links, ghosts and availability already come from core selectors, and `projectHex` projects any axial cell, including ring 2. The delivered view (`ad394558`) has one geometry assumption: Compact link-label offsets in `FormationLab.drawBoard` assume the long middle link of the old 1, 2, 1 line (a larger offset for link index 1). The view needs these changes:

- Place each Compact link label beside its link, on the side away from the triangle's third Brood, so no label sits inside the triangle or over a token. Spread placement is unchanged.
- Keep all three Compact tokens individually selectable. The tokens are 112 px wide on an 85 px cell pitch, and Pazuzu is rendered last. If its button covers a neighbour's centre, fix the presentation (size, stacking or label offset), not the test.

**Additional acceptance evidence (applies to criteria 1 and 4):** for every one of the twelve fixtures, a pointer hit-test at each token's centre resolves to that token. Updated screenshots of every Compact orientation show readable link labels that do not cover tokens. Expansion and contraction ghosts in the browser check still equal the core destinations, now including the ring-2 cell.

## Smallest useful outcome

A user can see the 37-cell board, identify each Brood and its links, preview a legal formation change, commit it once, and reset the laboratory. The interface still explains itself when all artwork is replaced by labels.

## Starting source and ownership

Reuse P01's browser entry and P03's public transition. Own proposed `src/view/FormationScene.ts`, pixel projection and rendering helpers, local `scripts/prepare-assets.mjs`, and `tests/asset-copy.test.ts` within the prototype. Keep the existing SVG masters, manifest, license, and credits at repository root unchanged. Do not introduce shared runtime code or a general asset pipeline.

## Fixture and inputs

Start with P03's fresh Compact orientation-zero fixture. Render all twelve P02 configurations through direct fixture selection in lab mode, separately from the once-per-round maneuver controls. Label any fixture selector as a test setup, not a game action.

Seven SVG emblems actually exist in `assets/tokens/`. PNG exports and audio are not committed runtime assets. Test with the six patrol emblems available, deliberate placeholder mode, and one failed image request. Use a desktop viewport of 1280 by 800 pixels for the initial layout check.

## Contracts and decisions

### Required contracts

Positions, link labels, and maneuver availability come from core selectors. Hover or keyboard focus previews a command by invoking the same transition on the current snapshot; it never mutates the live state. Clicking commits against the current revision. The preview disappears on cancel, reset, or state change. No interaction can drag an individual Brood or translate the squad.

Attribution must accompany bundled emblems. Missing visual assets must not prevent selecting a creature or inspecting the formation. Artwork and animation may not determine legality.

### Settled choices

The board, links, previews, and UI are generated. Creature artwork stays upright while its anchor changes. The seven imported SVGs are symbolic POC emblems, not final character illustrations. Core assets are shared; serving them from a prototype requires an explicit local copy/import step.

### Proposed implementation

Use solid labelled Close links, dashed labelled Stretched links, and ghosted destination anchors. Provide a text readout of selected creature, shape/orientation, coordinates, and remaining maneuver. Use native text-labelled controls or equivalent keyboard-focusable controls without React.

A small prototype-local preparation script copies only the seven allowlisted SVGs plus credits/license into generated `public/tehom/`, validates available-file hashes against the manifest, and is invoked by local predev/prebuild scripts. Ignore that generated directory in Git. Missing/corrupt required source assets fail preparation with a precise message; a runtime image-load failure falls back to a labelled geometric token. Placeholder mode intentionally skips image loading. Do not depend on an external asset server.

## Implementation checkpoints

1. **P04.C1** — Project P02 axial coordinates into pixels and render a neutral board and labelled anchors.
2. **P04.C2** — Add link styles and textual equivalents; distinguish actual positions from pending destinations.
3. **P04.C3** — Connect hover/focus/commit/cancel to P03. A used maneuver remains visibly unavailable until a fresh lab fixture is selected.
4. **P04.C4** — Add the limited asset-copy step, runtime fallback, and a visible credits control.
5. **P04.C5** — Inspect normal and placeholder modes, then capture an actual screenshot and a maneuver sequence.

## Acceptance criteria

1. Every P02 fixture renders 37 cells, three distinct labelled Brood, and three links with the same states reported by core.
2. Previewing expansion shows the exact destinations later committed, while live shape, revision, and allowance remain unchanged until confirmation.
3. After one committed maneuver, a second is unavailable with an explanation; reset creates the original fixture and removes all ghosts and selection remnants.
4. Rotation moves token anchors but does not rotate the creature images; all labels remain readable at the test viewport.
5. Placeholder mode and one failed runtime image request leave the lab operable with identifiable units.
6. Asset preparation copies the intended files without modifying root masters; copied SVG hashes match the manifest, and the credits/license are accessible in the served build.
7. Pointer dragging or clicking an empty cell cannot move a single Brood or change combat state.

## Verification and hand-back

Return exact executed commands, results, acceptance evidence, and limitations in the implementer's [mailbox](../mailbox/README.md) handoff; the Coordinator then records them in [TASK_LOGS](../TASK_LOGS.md), links that entry here, and updates [CURRENT](../CURRENT.md) when implementation facts change. The commands below remain proposed until their prerequisites supply them.

Run `just poc-001-test tests/formation.test.ts tests/commands.test.ts tests/asset-copy.test.ts`, `just poc-001-typecheck`, and `just poc-001-build`. Exercise the browser at the stated viewport: preview, cancel, rotate, attempt a second maneuver, reset, and expand. Repeat with placeholder mode and a simulated failed token request. Record screenshots, exact asset destinations, and any visual ambiguity. This milestone is an interactive formation lab, not a playable battle.

## Non-goals and stop conditions

No attacks, enemy AI, final art, sound, tile textures, animation sheets, deployment, mobile layout, or damage previews. Stop when formation-only interaction and readouts are trustworthy. If illustration prevents reading links or positions, reduce its prominence rather than adding rule exceptions. Asset preparation must remain a small consumer of existing files.
