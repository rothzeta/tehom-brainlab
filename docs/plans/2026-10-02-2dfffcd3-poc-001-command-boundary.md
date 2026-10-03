# Apply legal player commands atomically without spending resources on rejection

## Status and authority

**P03. Draft; not implemented or verified.** Depends on [P01](2026-10-02-a87b131a-poc-001-browser-harness.md) and [P02](2026-10-02-2e228a2b-poc-001-formation-algebra.md). Baseline: `79f9498051df0281e6e9d3c904e9eee32f014873`.

Authority: [prototype architecture](../../poc-001-linked-formation/README.md) and the [brief's Round structure](../../docs/prototypes/poc-001-linked-formation.md). Atomic rejection and revision checking are proposed engineering contracts for this plan; they are not claimed as previously approved game design. Formatting authority is linked below and in the [index](README.md).

Delivery sequence: [P01–P12 index](README.md). Governing format: [ADR-0002](../adr/0002-plan-filenames.md) and [ADR-0003](../adr/0003-implementation-plan-writing.md).

Task `P03` owner and integration owner: POC 001 implementer, currently unassigned. This plan is one standalone task; its sequential checkpoints inherit the prerequisites, affected components, acceptance criteria, verification, and hand-back defined here. Checkpoint identifiers remain stable on edits. Record actual execution in [TASK_LOGS](../TASK_LOGS.md); no execution evidence exists yet.

## Smallest useful outcome

A pure command boundary accepts a legal formation maneuver once, rejects repeated or stale commands without side effects, and provides the action-accounting boundary that later ability and round implementations extend.

## Starting source and ownership

P02 owns geometry. Own proposed `src/core/state.ts`, `src/core/commands.ts`, `src/core/transition.ts`, and `tests/commands.test.ts`. There is no existing reducer at the baseline. Reserve abilities and encounter resolution for P07/P08; the shell must reject unsupported commands rather than simulate fake attacks.

## Fixture and inputs

Use a serializable state fixture with `revision=0`, `round=1`, `phase=player`, Compact orientation zero, the fixed three Brood alive, empty `actedIds`, and `maneuverUsed=false`. Include stable entity IDs, integer HP/max HP, empty statuses, and empty intentions as extension points. No Phaser objects belong in this state.

Adversarial fixtures: `maneuverUsed=true`, an already-acted Brood, a fallen Brood, a non-player or terminal phase, an unknown ID, and an outdated expected revision. Freeze input states in tests.

## Contracts and decisions

### Required contracts

All public commands pass through one boundary. A rejected command leaves state, revision, action budgets, and emitted gameplay events unchanged and returns a machine-readable reason. An accepted maneuver changes only formation, the shared allowance, revision, and corresponding events. No renderer method may grant an extra action or mutate formation directly.

### Settled choices

Each living Brood has at most one ability action per player phase. The squad has at most one maneuver per round, independent of Brood actions; it cannot be banked. The player can maneuver before, between, or after actions. No implicit movement or attack happens when a unit is selected.

### Proposed implementation

Use discriminated commands for `maneuver`, `useAbility`, and `endPhase`, each carrying `expectedRevision`. Maneuver payload is one of clockwise, anticlockwise, expand, contract. Applying expand to Spread or contract to Compact is an invalid no-op and does not consume the allowance.

Return `{ok,state,events}` or `{ok:false,state,error}`. A successful public command increments revision once; its internal effect steps do not increment it separately. Expose one action-accounting helper used by the future ability dispatcher: validate actor, ownership, phase, target/ability legality, and budget before spending. P03 tests that helper directly with a legal test effect; it does not add a production debug ability.

Only the P08 round driver may reset budgets. Until that driver exists, unsupported `endPhase` and `useAbility` return explicit errors. A fixture factory provides fresh independent states for the formation lab. Public snapshots contain plain data and no wall-clock or random values.

## Implementation checkpoints

1. **P03.C1** — Define minimal state and command/result types with a stable error vocabulary.
2. **P03.C2** — Wire P02 maneuvers through the immutable transition and revision guard.
3. **P03.C3** — Implement reusable actor/budget validation and accepted-action accounting without adding game abilities.
4. **P03.C4** — Test invalid commands before adding consumers; document that round reset and abilities are intentionally unavailable at this slice.

## Acceptance criteria

1. A legal rotation from the initial fixture spends exactly the shared maneuver and increments revision from 0 to 1 without marking any Brood as acted.
2. A second maneuver, same-shape command, stale revision, or wrong-phase command leaves the input-equivalent state and budgets unchanged and emits no gameplay event.
3. The action-accounting boundary permits an eligible living Brood once and rejects an already-acted, fallen, or unknown actor without consuming another actor's action.
4. Attempting `useAbility` or `endPhase` before their implementations are registered produces an explicit unsupported-command error, not silent success.
5. Frozen-state tests pass for accepted and rejected commands; two fixture-factory calls share no mutable nested collections.
6. A serialized accepted command replayed against the same serialized starting state yields the same state and ordered events.

## Verification and hand-back

Record exact executed commands, results, acceptance evidence, and limitations in [TASK_LOGS](../TASK_LOGS.md), then link that entry here and update [CURRENT](../CURRENT.md) when implementation facts change. The commands below remain proposed until their prerequisites supply them.

Run `just poc-001-test tests/commands.test.ts tests/formation.test.ts` and `just poc-001-typecheck`. Return the public command/result contracts, error examples, and passing/rejected fixture traces. State which command kinds are actually supported at this milestone. Tests must exercise the production boundary, not an independent test-only rules implementation.

## Non-goals and stop conditions

No generic command bus, network protocol, multiplayer, event-sourcing framework, undo stack, ability DSL, enemy turn loop, or global store dependency. Stop after the boundary and accounting invariant. If a later plan needs a new state field, extend it minimally with tests; do not anticipate campaign state. Changes to action economics require an explicit design decision, not a reducer convenience.
