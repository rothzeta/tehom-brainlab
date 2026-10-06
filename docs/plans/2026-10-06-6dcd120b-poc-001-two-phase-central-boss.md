# A central two-phase boss with trustworthy radial and angular threats

## Status and authority

P15, draft after P13/P14 in the [continuation](README-boss-experiments.md). The user requests an immobile central two-phase boss. This replaces the old unimplemented P12 design for the requested experiment; it does not mark the historical patrol gate PASS. Pattern details, name, numbers and threshold below are proposals.

## Smallest useful outcome

A separately selectable, playable encounter places one boss at `(0,0)`, changes attack language in phase two and makes ring choice and angle observably affect outcomes. More HP or a new sprite on the existing marked-hit patrol does not satisfy this capability.

## Starting source and ownership

Baseline `70b6ede002e6a09e31522d1343d29796672dfb28`, followed by P13/P14. Existing owners: `src/core/rounds.ts`, `sectors.ts`, `intents.ts`, `abilities.ts`, `preview.ts`, `run-record.ts`, and `src/content/patrol.ts` in the prototype. `endPatrolPhase` validates one declaration per patrol source and cannot simply accept a two-attack boss. Run records are currently patrol-specific. Propose `src/content/central-boss.ts` for the fixture and a small explicit encounter dispatch; share proven primitives without a generic scripting system. Owner and integration Implementer are unassigned. Existing patrol remains a selectable encounter.

## Fixture and inputs

Working name: the Crucible. Use the existing Foundry Mechanism emblem and labelled placeholders. Proposed boss HP 60, threshold 30, anchored centre, turnable facing, self directional protection reduction 2. Brood use their existing maximum HP. Provide phase-one start and a clearly labelled phase-two diagnostic start; the latter is not a completed first phase. Enumerate all twelve RF formations and six facings.

Proposed two-beat pattern per phase, primary attack before secondary:

- Phase 1 beat A: all ring-1 cells, 5 damage, non-turnable; then a marked hit for 3.
- Phase 1 beat B: one encounter-centred sector at facing f, 5 damage, turnable; then a marked hit for 3.
- Phase 2 beat A: all ring-2 cells, 5 damage, non-turnable; then a marked splash for 2, radius 2.
- Phase 2 beat B: sectors f and `(f+2)%6`, 4 damage, turnable; then a marked hit for 3.

Marks select the lowest living HP fraction at declaration, with roster-order ties. First facing is zero; subsequent announcements advance the current facing one clockwise step. Reset the beat index at phase entry. These are deliberately small deterministic test patterns, not final balance. Do not use a two-adjacent-sector centre sweep as proof of reduced victim count: it always covers one member of a complete equilateral formation.

## Contracts and decisions

**Required:** boss cell never changes; each declaration has an unambiguous source, event ID, ordered damage and fixed-area/mark semantics. Give the player a complete response phase. Keep P13 independent budgets and P14 control. Attacks from a fallen source do not resolve.

**Proposed phase boundary:** crossing 50% HP sets a pending phase-two transition. Finish the already announced enemy response unchanged; enter phase two only before the next announcement. Do not grant a bonus boss turn, discard an attack, refill HP, cap incoming damage or replace a visible telegraph mid-player-phase. Death supersedes a pending transition. Emit phase change once; no return to phase one.

The primary radial attack cannot be deflected by Crosswind. Turnable sectors and self-guard can be turned. The secondary mark follows its creature. Masks, protection and outcome previews come from the same reducers/selectors as resolution.

Extend encounter-aware state/dispatch/record validation narrowly. Bump schema/rules versions and reject incompatible records explicitly; do not retain a patrol source whitelist in the boss path. Record phase, beat, encounter ID, tuning and declaration order so both phases replay.

## Implementation checkpoints

P15-1: introduce the explicit central-boss fixture and two-declaration turn adapter while preserving patrol regressions.

P15-2: implement phase boundary, masks, mark choice, ordered resolution and failure/terminal cases headlessly.

P15-3: expose the encounter, phase indicator, masks, control previews and reset/record/replay through the actual browser.

## Acceptance criteria

1. Across every legal player action and reset, the living boss stays at `(0,0)`; Crosswind may turn its facing without relocation.
2. Expansion changes inner-pulse exposure; contraction changes outer-pulse exposure. A narrow sector/fork fixture has different recipient sets under rotation. Exact masks are asserted over all labelled formations.
3. Crossing the threshold preserves current declarations, enters phase two at the next announcement and changes the pattern once. Killing the boss instead ends combat without an extra attack.
4. Both attacks resolve in the displayed order; secondary marks, Shelter consumption and terminal interruption match the forecast.
5. Each phase has a reachable trace with both maneuver categories used in the same round and another trace that uses protection/control rather than only damaging abilities. These are mechanical traces, not human evidence.
6. The patrol still launches; boss resets create clean state; exported phase-crossing and direct phase-two attempts replay exactly, including events.
7. Browser presentation distinguishes radial masks, turnable sectors, creature-following marks and pending/active phase without depending on animation timing.

## Verification and hand-back

Use existing root test/typecheck/build/browser recipes and replay exports; add focused boss/phase fixtures. Report exact commands, actual results, baseline changes, masks, damage tuning, captures of both phases and criterion mapping at `docs/mailbox/p15-central-boss/implementer.md`. Record human observations separately, especially automatic expand/rotate routines and whether accepting damage ever feels useful.

## Non-goals and stop conditions

No adds, movement, arena enlargement, boss invulnerability, three-phase tree or new art requirement. If every beat has one effortless universal answer, record it as a design result and adjust declared pattern/tuning separately rather than silently restricting maneuvers. If phase transition or replay invalidates a telegraph, stop before P16 integration.
