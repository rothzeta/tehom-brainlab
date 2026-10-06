# Independent rotation and shape-change allowances

## Status and authority

P13, draft continuation of the [boss-experiment sequence](README-boss-experiments.md). The user requires rotation and expansion/contraction not to be mutually exclusive. Once per player phase for each is the proposed cadence, not a settled user decision. Existing geometry, no player walking and immutable command/preview behavior remain required.

## Smallest useful outcome

In the playable patrol and formation lab, a player may rotate once and expand or contract once, in either order and interleaved with Brood actions. Merely enabling both buttons while the command layer still has one shared allowance fails this outcome.

## Starting source and ownership

Baseline `70b6ede002e6a09e31522d1343d29796672dfb28`. `src/core/state.ts` owns `maneuverUsed`; `src/core/rounds.ts` resets it; `src/core/run-record.ts` requires that exact field. Within `poc-001-linked-formation/`, ownership includes state, commands/transition, preview, records, their real view consumers and focused tests. No changes to formation coordinates or root tooling are needed. Task owner: Implementer, unassigned. Integration owner: Coordinator-designated Implementer, unassigned. Prerequisites: delivered P03/P09/P10/P11 and RF.

## Fixture and inputs

Use the existing healthy patrol and all twelve RF configurations, plus a phase with two Brood already acted, a stale revision and both terminal outcomes. Reuse existing buttons/tokens. Store two independent used flags or an equally small explicit representation. Do not infer either budget from current shape or orientation.

## Contracts and decisions

**Required:** successful commands spend only their own category, publish one revision and preserve actor budgets. Failed, stale, same-shape or second-use commands leave state/events/budgets unchanged. Holding either allowance is legal. Geometry still changes only through the existing four maneuver commands.

**Proposed default:** one clockwise OR anticlockwise rotation and one expand OR contract per player phase, with no banking, cooldown, Brood-action cost or second shape change. Both reset only at the next player phase. They may occur before, between or after ability actions. Same-shape requests spend nothing. Expand-attack-contract within one phase remains prohibited.

**Compatibility:** update record/state validation, preview and UI together; bump record schema when fields change and the run-rules version for changed semantics. Old records must be rejected with an explicit version mismatch rather than reinterpreted under the new budget. Preserve old source records and their baseline revision; automatic migration is not required. Do not leave a conflicting `maneuverUsed` field as another authority.

## Implementation checkpoints

P13-1: retain deterministic old-behavior fixtures; agree the cadence and map all consumers of the existing flag.

P13-2: implement atomic independent accounting and round reset, with unit checks for both command orders and failures.

P13-3: update live controls, preview, export/replay and displayed remaining allowances; verify against accepted transitions, not separate UI arithmetic.

## Acceptance criteria

1. Rotate then expand, and expand then rotate, both succeed in a fresh player phase with the expected final labelled formation and unchanged Brood action availability.
2. A second rotation or shape change is rejected without mutation; rejecting one category does not consume the other.
3. A no-op shape command or stale command produces no spend and no gameplay event.
4. Abilities can occur between maneuvers; the next player phase restores both allowances exactly once, including early End Phase.
5. UI previews and committed commands agree about both budgets; terminal states expose no executable maneuver.
6. A new exported attempt containing both categories replays to identical state/events. An incompatible old record fails visibly before any live-state replacement.

## Verification and hand-back

Existing root recipes inspected in `justfile`: `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build`, `just poc-001-test-browser`, `just poc-001-replay`. Add focused budget/record cases to the local suites; exact new test filenames belong to implementation. Replay an actual exported fixture via the existing wrapper. Hand back changed paths, accepted cadence, version changes, exact commands/results, tested commit, criterion mapping and a browser capture showing both budgets. Durable report: `docs/mailbox/p13-split-maneuver-budgets/implementer.md`. No execution is claimed in this draft.

## Non-goals and stop conditions

No X-round cooldown experiment, extra movement, geometry revision, stat rebalance or extra abilities. Report a forecast/replay mismatch before adding boss content. Effortless evasion is a subsequent playtest finding to record, not permission to silently restore the one-or-the-other rule.
