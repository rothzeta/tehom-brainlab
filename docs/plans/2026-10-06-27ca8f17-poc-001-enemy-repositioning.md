# Enemy relocation changes the threat origin without changing Brood movement

## Status and authority

**P16. Accepted for implementation; not implemented.** Written 2026-10-06 as a draft by an external design review (draft PR #1, commit `71cc26c`), then checked against source and made executable by the Architect on 2026-10-06 ([design report](../mailbox/boss-experiments/architect.md)). Sequence: [plan index](README.md#boss-experiments-p13p17). Format: [ADR-0002](../adr/0002-plan-filenames.md), [ADR-0003](../adr/0003-implementation-plan-writing.md). Testing: [ADR-0006](../adr/0006-contract-invariants-and-black-box-testing.md).

Authority: the user's decisions of 2026-10-06 ([brief Decision record](../prototypes/poc-001-linked-formation.md#decision-record)). Designated enemies may relocate. The Brood never walk individually, and the central boss never relocates. Between-round timing and the six-slot route are **provisional defaults, implemented as written**. This supersedes the brief's earlier "enemies never move".

Task `P16`. Owner: a POC 001 Implementer. Prerequisites: delivered P15, whose shared end-phase skeleton and registry this plan extends. Checkpoint P16.C1 may run earlier on its own branch (see [index sequencing](README.md#sequencing-and-parallelism)). Durable report: `docs/mailbox/p16-enemy-repositioning/implementer.md`.

## Smallest useful outcome

A designated enemy changes its actual tile between rounds, then declares its new threats from that tile, before player input. Player maneuvers stay legal and unchanged. P17's Collector is the first product encounter to use this. P16 is demonstrated headlessly and through a test-only browser fixture.

A result fails acceptance if:

- the sprite moves while the rules keep the old origin;
- an enemy moves during the player phase, or fires from a tile it had not announced from;
- any patrol or Crucible event, record or behaviour changes.

## Starting source and ownership

Inspected at `71cc26c`, plus the P15 design, within `poc-001-linked-formation/`:

| File | Current behaviour | Change |
|---|---|---|
| `src/core/state.ts` | `CombatEnemy` has `rotatable?`; no movement trait | Add optional `mobile?: boolean`; absent means stationary. Independent of `rotatable` |
| new `src/core/enemy-movement.ts` | — | `ENEMY_ROUTE` (from `ENEMY_CELLS`, not a copied table) and a pure `relocateEnemies(state)` returning state and events |
| `src/core/rounds.ts` (P15 skeleton) | After `enemy-phase-ended`, a nonterminal round resets and announces | Call `relocateEnemies` between `enemy-phase-ended` and the round reset/announcement |
| `src/core/commands.ts` | `GameplayEvent` union | Add the two movement events |
| `src/core/run-record.ts` | Each enemy's cell must be distinct from every other enemy's, including fallen ones; enemy fields are `id,hp,maxHp,cell,facing[,rotatable]` | Distinctness among **living** enemies only. Optional boolean `mobile`. IDs stay unique, and every cell stays in `ENEMY_CELLS` |
| `src/view/CombatScene.ts` | Tokens are placed from state; fallen tokens stay at their cell | A living token stays on top and pointer-selectable when it shares a cell with a fallen one. The End-phase preview shows enemy destination ghosts from the preview state |
| `README.md` (prototype) | — | Relocation section; P11 note on living-only distinctness |

Verified facts:

- `ENEMY_CELLS[1..6]` is exactly the clockwise edge route `(1,1), (-1,2), (-2,1), (-1,-1), (1,-2), (2,-1)` = `T1, T3, T5, T7, T9, T11`.
- Consecutive route slots are hex distance 2 apart. One step is a jump between reserved slots, not a one-hex walk.
- No route slot is a Brood cell (P02 disjointness), so relocation can never block a maneuver.

Unchanged and protected: `src/core/{hex,formation,sectors,intents,damage,lifecycle,abilities,transition,preview,smoke}.ts`, `src/content/`, `src/view/{FormationLab,lab-state,projection,patrol-session}.ts`, `src/main.ts`, `scripts/`, `bin/`, `package.json`, `bun.lock`, configs, `justfile`, `assets/`, `docs/` outside this task's report. `preview.ts` needs no change: movement events are not filtered from `enemyEvents`. If a protected path must change, stop and report why.

## Fixture and inputs

All test-local; no product encounter in P16:

- a patrol state with the Warder marked `mobile: true`, so its protection front visibly moves with it;
- a mobile enemy blocked clockwise by a living enemy;
- a mobile enemy with both neighbours occupied (it stays);
- a fallen blocker (it no longer blocks);
- two mobile enemies processed in array order;
- an anchored rotatable boss (the Crucible);
- a mobile non-rotatable enemy;
- alternative enemy IDs.

The browser fixture is an intercepted test page under `tests/browser/`, never a product route.

## Contracts and decisions

### Required contracts

- A relocation is a pure, authoritative state change, never a renderer callback.
- `mobile` and `rotatable` are independent: turnable does not mean movable.
- Legal destinations are route slots not occupied by a living enemy. The centre, Brood cells and off-board cells are never destinations.
- No Brood translation, pushes, collisions, opportunity attacks, path damage or intermediate cells.
- **Timing (as written).** Resolve all current attacks from their committed origins. Expire Shelters, `enemy-phase-ended`, and the terminal check. Then relocate. Then reset player budgets and announce new intentions from the new tiles. The player sees every new position and threat before responding. Terminal combat performs no relocation.
- Committed fixed areas are never translated; they are already resolved. New areas are declared fresh. Facing is unchanged by a move; an encounter's announcement may choose a new one.
- Crosswind remains facing control. It neither prevents nor cancels relocation.
- Previews never mutate live state. The End-phase preview and the "If end phase now" forecast include the moves, because they run the real end phase.

### Provisional defaults (as written)

- **Route:** try the next clockwise route slot, otherwise the immediately counterclockwise slot, otherwise stay. At most one relocation per mobile enemy per round boundary. Mobile enemies are processed in `state.enemies` order, each seeing earlier moves.
- **Blocking:** only living enemies block. A fallen enemy keeps its last cell and identity for logs and records.
- **Off-route:** a mobile enemy off the route (for example on the centre) stays.

### Proposed implementation (Architect)

Events, both carrying the `round` that just ended:

- `{ type: 'enemy-moved', sourceId, round, from, to }`;
- `{ type: 'enemy-move-blocked', sourceId, round, cell, reason: 'occupied' | 'off-route' }`.

The blocked event changes no cell. They appear after `enemy-phase-ended` and before `round-started`.

### Record compatibility (decision)

**No version bump.** Every record valid before P16 stays valid and replays identically. Patrol and Crucible states contain no mobile enemy, so their end phase emits the same events. Before P16 the validator rejected both the `mobile` field and shared fallen cells, so no earlier record can carry the new meaning. A record using `mobile` cannot be read by a pre-P16 build; that is acceptable forward incompatibility. P17's `collector-v1` rules version identifies the first product encounter with movement.

## Implementation checkpoints

1. **P16.C1 — Movement selector.** `ENEMY_ROUTE`, the `mobile` trait, `relocateEnemies` and its unit tests: occupied, fallen, two movers, off-route, no destination. Touches only `state.ts`, the new module and a new test file, so it may run in parallel with P15.
2. **P16.C2 — End-phase integration.** Skeleton call, events, record validator. Through the real end phase, a mobile Warder's protection and front follow its new tile. Run the full unit suite: patrol and Crucible suites unedited.
3. **P16.C3 — View.** Corpse-sharing hit-test order, End-phase destination ghosts, the intercepted fixture. Build, run the browser suite, inspect screenshots.
4. **P16.C4 — Contracts and full verification**, bare, at one candidate revision.

## Required test updates (explicit exception)

**None.** Existing record tests reject duplicate cells among living enemies (the RF `duplicate` case uses two living enemies) and keep doing so. If an existing test asserts that a fallen enemy's cell must be distinct, stop and report it. That one assertion would then need an explicit exception from the Coordinator. Every other existing test is expected to pass unedited.

## Acceptance criteria

1. A mobile enemy moves to the clockwise slot when free. Every Brood coordinate and both P13 allowances follow their own rules unchanged.
2. An occupied clockwise slot gives the counterclockwise fallback, or a stay with `enemy-move-blocked`. No sequence of legal commands creates overlapping living enemies, or places an enemy on a Brood cell or the centre by relocation.
3. A fallen blocker no longer reserves its cell. Its identity and last cell remain inspectable and serializable, and a record with a living enemy on a fallen enemy's cell parses and replays.
4. Attacks resolve from their committed origin. After relocation, new fronts and areas come from the new tile and appear before player input. The same facing from two origins gives different recipients. For example, facing 0 at Compact 0 covers Girtablilu from `(-2,1)`, and Girtablilu and Pazuzu from `(-1,-1)`. Assert this through `frontCells` and `selectRecipients`, not screenshots.
5. The anchored Crucible never relocates, even when turned. A mobile non-rotatable enemy relocates and is an illegal Crosswind target. A mobile rotatable enemy turned by Crosswind keeps its new facing when it moves. This moves the "stationary versus roaming rotatable" case from P14.
6. A terminal end phase emits no movement. Every movement event occurs once and replays identically. Previews do not mutate live state, and the End-phase preview matches the commit.
7. Patrol and Crucible traces, events and records are unchanged.
8. **Tuning is not frozen.** The route order and fallback are the contract under test. No assertion pins enemy HP, damage, layouts or facings. Fixtures set their own cells.
9. All existing suites pass unedited.

## Verification and hand-back

Run from the repository root at one candidate revision, **bare**:

- `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build`
- `just poc-001-test-browser` (report the selected Chrome binary and why)
- `just poc-001-replay` on one patrol and one Crucible export (unchanged results)
- `git diff --check <BASE>..HEAD` and `git diff --exit-code <BASE>..HEAD --` over the protected paths

Screenshot inspection, from the test fixture: the mobile Warder before End phase; the End-phase preview with its destination ghost; after relocation, with its front tint on the new tile; a living token over a corpse cell.

Durable report: as in [P13](2026-10-06-e8cec63d-poc-001-split-maneuver-budgets.md#verification-and-hand-back), plus the destination and occupancy table and the criterion mapping.

## Review corrections to the draft (2026-10-06)

- **Decided: no version bump.** This is argued above; the draft asked for one without naming a record that would change meaning.
- Living-only distinctness lets a living enemy stand on a corpse. The view's hit-test order must handle that; the draft did not mention it.
- The draft's "diagnostic encounter" is a test-only fixture, not a product route. The Collector is the product consumer.
- P14's untestable "roaming rotatable" case moved here (criterion 5). Criterion 4 now has a computed example.

## Non-goals and stop conditions

Out of scope: pathfinding, free movement, movement during the player phase, Brood displacement, teleportation, terrain, and making existing patrol enemies mobile.

Stop and report when:

- clipping, a dead origin or a stale telegraph is ambiguous;
- patrol or Crucible output changes;
- a protected path must change.

Optional path animation must not add unmodelled intermediate gameplay.
