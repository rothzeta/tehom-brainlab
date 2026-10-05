# Test the same formation contracts against one directional Foundry Mechanism

## Status and authority

**P12. Draft; conditionally blocked, not implemented or verified.** Depends on [P11](2026-10-02-825a6700-poc-001-reproducible-playtests.md) with an explicit **open** boss gate and the playable/core outputs of [P10](2026-10-02-e7c77542-poc-001-playable-patrol.md). Baseline: `79f9498051df0281e6e9d3c904e9eee32f014873`.

Authority: [brief Directional boss and Implementation order](../../docs/prototypes/poc-001-linked-formation.md). Do not execute merely because the earlier code compiles. The boss numbers/pattern below are a proposed test fixture, not an approved final boss. See the [index](README.md) and local ADRs below for authority.

**Amended 2026-10-04 (two-ring board):** see the TR note under Fixture and inputs.

**Amended 2026-10-05 (ring formation, boss tile):** see the RF note under Fixture and inputs.

Delivery sequence: [P01–P12 index](README.md). Governing format: [ADR-0002](../adr/0002-plan-filenames.md) and [ADR-0003](../adr/0003-implementation-plan-writing.md).

Task `P12` owner and integration owner: POC 001 implementer, currently unassigned. This plan is one standalone task; its sequential checkpoints inherit the prerequisites, affected components, acceptance criteria, verification, and hand-back defined here. Checkpoint identifiers remain stable on edits. The Coordinator records actual execution in [TASK_LOGS](../TASK_LOGS.md) from the implementer's mailbox handoff; no execution evidence exists yet.

## Smallest useful outcome

One Foundry Mechanism encounter combines directional protection, a committed sweep, and a following splash mark using the existing command, preview, damage, and UI contracts. It tests whether the formation fantasy survives a larger enemy without a special boss-only combat engine.

## Starting source and ownership

Own proposed `src/content/foundry-mechanism.ts`, focused boss tests, and one encounter-selector entry in the existing view. Extend P08's small encounter dispatch only as necessary to select patrol or boss. Reuse the already imported `foundry-mechanism.svg`, P05 masks, P06 damage, P09 previews, and P11 records. No new source art or shared framework is required.

## Fixture and inputs

Proposed `foundry-v1`: one boss at `(0,0)` with HP 42, facing 0, two-point frontal protection using P05's two-sector mask, and the same healthy three-Brood fixture as P08. Start in Compact orientation zero.

At each announcement declare two ordered attacks: first a turnable fixed-area sweep for 5 damage in the frontal mask; then a marked splash for 3 damage with radius 2, cycling living targets in `[girtablilu,pazuzu,ugallu]`. Before announcing rounds after the first, advance boss facing one clockwise step from its current facing. No automatic turning occurs later at impact. These values and cadence are experimental and must be versioned if changed.

*Amendment TR (2026-10-04, two-ring board):* the boss at `(0,0)` uses the view-only centre anchor (accepted user decision, 2026-10-04); its exact placement is not a rule. The user expects bosses "in the middle" but "won't be completely centered", and encounter layout is an open experiment question ([brief Open decisions](../../docs/prototypes/poc-001-linked-formation.md#open-decisions)). Protection and the sweep stay encounter-centred through P05, so the boss's cell has no rule effect. An off-centre boss with rule meaning would need its own mask proposal (P05 stop condition) and is not authorized here. On the [two-ring masks](2026-10-02-d66a7452-poc-001-intent-semantics.md#amendment-tr-2026-10-04--two-ring-board), the frontal sweep and protection cover six cells, sectors `f` and `f+1` across rings 1–2. That is still one third of the Brood cells. Compact orientation `o` lies in one sector, so a facing-zero sweep hits Compact at orientations 0 and 1, as before. The facing cadence, the Crosswind interaction and the splash radius (2: all of Compact, the target only in Spread) need no change. Re-check the "one rotation solves every turn" risk during the gate review, not by assumption.

*Amendment RF (2026-10-05, ring formation and enemies on tiles):* the centre is now the boss tile and is never occupied by Brood (user decision, [brief Decision record](../../docs/prototypes/poc-001-linked-formation.md#decision-record)). The Foundry Mechanism stands on `(0,0)`, a real tile. Its front is P05 `frontCells((0,0), f)`, which equals the delivered `frontMask(f)`, so its sweep and protection masks are unchanged. The formation around it changed (P02 RF):

- Compact now places one Brood in each of sectors `o`, `o+2` and `o+4`. A two-sector sweep therefore always hits exactly one Brood, in either shape, and Expand/Contract never change which. The TR statement that a facing-zero sweep hits all of Compact at orientations 0 and 1 is superseded.
- The marked blast's radius-2 splash still reaches all three Compact Brood (pairs at distance 2) and only the target in Spread.

The gate review must re-check the "one rotation solves every turn" risk against this geometry: rotation now chooses who is swept rather than escaping the sweep. Ordinary enemies sharing the board with the boss are not authorized here. The plan stays blocked by the HOLD gate.

## Contracts and decisions

### Required contracts

Boss targeting, protection, damage, cancellation, terminal behavior, and previews use the same core paths as the patrol. The sweep remains committed when the squad moves. Crosswind can explicitly change facing and its turnable sweep, but cannot change the marked target. Defeating the boss before the enemy phase cancels both attacks. The UI shows both attacks and their order before player action.

### Settled choices

One boss tests directional protection, a committed sweep, and marked splash. No phase tree, extra player abilities, or independent movement. Rotation, spreading, maintaining protection, and spending Crosswind should be competing tools; a boss solved automatically by one rotation every round requires revision rather than celebratory sign-off.

### Proposed implementation

Represent the two attacks as two intentions from one source, not two hidden enemies. At enemy resolution, settle the sweep batch through P06 before evaluating the splash. If the marked target falls to the sweep, P05's target-bound cancellation rule applies; do not secretly move the mark. Preserve facing changes made by Crosswind into the next round's stated clockwise increment.

Use the existing encounter factory/announcement selection to supply the boss data. Do not add health-dependent invulnerability, variable arena size, new masks, or new mitigation rules. Show the boss's front independently of its upright emblem. Reuse local attempt export and conditional forecasts without boss-specific calculations in the view.

## Implementation checkpoints

1. **P12.C1** — Read the actual P11 report and verify the open gate and tested commit. On hold or absent evidence, stop before implementing this plan and state the reason.
2. **P12.C2** — Add the boss fixture and its deterministic two-intention announcement using existing primitives.
3. **P12.C3** — Add selector/UI coverage and regression tests for sweep/mark interaction, Crosswind, facing cadence, and terminal cancellation.
4. **P12.C4** — Run actual boss attempts and record whether choices differ from a rote rotation sequence. Compare observed problems with the patrol rather than changing global rules ad hoc.

## Acceptance criteria

1. The hand-back references an actual open P11 gate; a missing or hold gate is reported as blocked, not treated as permission.
2. Starting the boss displays the documented HP, facing, sweep cells, marked target, and sweep-before-splash order using the normal interface.
3. Squad rotation leaves the committed sweep unchanged, while one Crosswind turns the facing/sweep one step and leaves the splash target unchanged; preview and resolution agree.
4. Spreading changes splash recipients and link-dependent abilities without disabling basic attacks, and all damage/protection uses P06/P07.
5. Killing the boss cancels both pending attacks and yields victory; loss/reset/export obey the same contracts as the patrol.
6. An executed winning trace and an executed defeat trace are reproducible under the recorded boss fixture; any tuning change is versioned rather than hidden in tests.
7. A factual report states whether observed boss play contains purposeful competing choices or a repetitive rotation solution. Either result is acceptable evidence, but a repetitive solution does not justify expanding boss content.

## Verification and hand-back

Return exact executed commands, results, acceptance evidence, and limitations in the implementer's [mailbox](../mailbox/README.md) handoff; the Coordinator then records them in [TASK_LOGS](../TASK_LOGS.md), links that entry here, and updates [CURRENT](../CURRENT.md) when implementation facts change. The commands below remain proposed until their prerequisites supply them.

Run `just poc-001-test` including focused boss tests, `just poc-001-test-browser` with the boss selector/preview/reset cases, `just poc-001-typecheck`, and `just poc-001-build`. Replay saved boss traces with P11. Hand back the gate reference, exact boss data, actual traces, screenshots, and observed design findings. If tests or playtests are blocked, identify the missing evidence; do not mark the boss validated.

## Non-goals and stop conditions

No second boss, phase system, campaign, Revelation/Glare integration, final art, production-engine migration, or claim that grid combat beats Apex/Shadow. Stop after one tested boss or at a closed gate. If it requires fundamentally different movement/targeting contracts, document a new bounded experiment instead of retrofitting exceptions into the patrol. Exposure/attrition integration and a fair original-combat comparison require later plans.
