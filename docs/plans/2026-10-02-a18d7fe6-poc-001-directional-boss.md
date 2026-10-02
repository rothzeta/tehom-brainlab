# Test the same formation contracts against one directional Foundry Mechanism

## Status and authority

**P12. Draft; conditionally blocked, not implemented or verified.** Depends on [P11](2026-10-02-825a6700-poc-001-reproducible-playtests.md) with an explicit **open** boss gate and the playable/core outputs of [P10](2026-10-02-e7c77542-poc-001-playable-patrol.md). Baseline: `79f9498051df0281e6e9d3c904e9eee32f014873`.

Authority: [brief Directional boss and Implementation order](../../doc/prototypes/poc-001-linked-formation.md). Do not execute merely because the earlier code compiles. The boss numbers/pattern below are a proposed test fixture, not an approved final boss. See the [index](README.md) for authority and missing ADRs.

## Smallest useful outcome

One Foundry Mechanism encounter combines directional protection, a committed sweep, and a following splash mark using the existing command, preview, damage, and UI contracts. It tests whether the formation fantasy survives a larger enemy without a special boss-only combat engine.

## Starting source and ownership

Own proposed `src/content/foundry-mechanism.ts`, focused boss tests, and one encounter-selector entry in the existing view. Extend P08's small encounter dispatch only as necessary to select patrol or boss. Reuse the already imported `foundry-mechanism.svg`, P05 masks, P06 damage, P09 previews, and P11 records. No new source art or shared framework is required.

## Fixture and inputs

Proposed `foundry-v1`: one boss at `(0,0)` with HP 42, facing 0, two-point frontal protection using P05's two-sector mask, and the same healthy three-Brood fixture as P08. Start in Compact orientation zero.

At each announcement declare two ordered attacks: first a turnable fixed-area sweep for 5 damage in the frontal mask; then a marked splash for 3 damage with radius 2, cycling living targets in `[girtablilu,pazuzu,ugallu]`. Before announcing rounds after the first, advance boss facing one clockwise step from its current facing. No automatic turning occurs later at impact. These values and cadence are experimental and must be versioned if changed.

## Contracts and decisions

### Required contracts

Boss targeting, protection, damage, cancellation, terminal behavior, and previews use the same core paths as the patrol. The sweep remains committed when the squad moves. Crosswind can explicitly change facing and its turnable sweep, but cannot change the marked target. Defeating the boss before the enemy phase cancels both attacks. The UI shows both attacks and their order before player action.

### Settled choices

One boss tests directional protection, a committed sweep, and marked splash. No phase tree, extra player abilities, or independent movement. Rotation, spreading, maintaining protection, and spending Crosswind should be competing tools; a boss solved automatically by one rotation every round requires revision rather than celebratory sign-off.

### Proposed implementation

Represent the two attacks as two intentions from one source, not two hidden enemies. At enemy resolution, settle the sweep batch through P06 before evaluating the splash. If the marked target falls to the sweep, P05's target-bound cancellation rule applies; do not secretly move the mark. Preserve facing changes made by Crosswind into the next round's stated clockwise increment.

Use the existing encounter factory/announcement selection to supply the boss data. Do not add health-dependent invulnerability, variable arena size, new masks, or new mitigation rules. Show the boss's front independently of its upright emblem. Reuse local attempt export and conditional forecasts without boss-specific calculations in the view.

## Implementation checkpoints

1. Read the actual P11 report and verify the open gate and tested commit. On hold or absent evidence, stop before implementing this plan and state the reason.
2. Add the boss fixture and its deterministic two-intention announcement using existing primitives.
3. Add selector/UI coverage and regression tests for sweep/mark interaction, Crosswind, facing cadence, and terminal cancellation.
4. Run actual boss attempts and record whether choices differ from a rote rotation sequence. Compare observed problems with the patrol rather than changing global rules ad hoc.

## Acceptance criteria

1. The hand-back references an actual open P11 gate; a missing or hold gate is reported as blocked, not treated as permission.
2. Starting the boss displays the documented HP, facing, sweep cells, marked target, and sweep-before-splash order using the normal interface.
3. Squad rotation leaves the committed sweep unchanged, while one Crosswind turns the facing/sweep one step and leaves the splash target unchanged; preview and resolution agree.
4. Spreading changes splash recipients and link-dependent abilities without disabling basic attacks, and all damage/protection uses P06/P07.
5. Killing the boss cancels both pending attacks and yields victory; loss/reset/export obey the same contracts as the patrol.
6. An executed winning trace and an executed defeat trace are reproducible under the recorded boss fixture; any tuning change is versioned rather than hidden in tests.
7. A factual report states whether observed boss play contains purposeful competing choices or a repetitive rotation solution. Either result is acceptable evidence, but a repetitive solution does not justify expanding boss content.

## Verification and hand-back

Run `npm run test:unit` including focused boss tests, `npm run test:browser` with the boss selector/preview/reset cases, `npm run typecheck`, and `npm run build`. Replay saved boss traces with P11. Hand back the gate reference, exact boss data, actual traces, screenshots, and observed design findings. If tests or playtests are blocked, identify the missing evidence; do not mark the boss validated.

## Non-goals and stop conditions

No second boss, phase system, campaign, Revelation/Glare integration, final art, production-engine migration, or claim that grid combat beats Apex/Shadow. Stop after one tested boss or at a closed gate. If it requires fundamentally different movement/targeting contracts, document a new bounded experiment instead of retrofitting exceptions into the patrol. Exposure/attrition integration and a fair original-combat comparison require later plans.
