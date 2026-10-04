# Complete a deterministic Warder–Censer–Harrier encounter through terminal outcome

## Status and authority

**P08. Implemented, independently reviewed (no findings), accepted, locally delivered.** [Implementation evidence](../mailbox/p08-patrol-round-loop/implementer.md), [independent review](../mailbox/p08-patrol-round-loop/reviewer.md). Depends on [P05](2026-10-02-d66a7452-poc-001-intent-semantics.md), [P06](2026-10-02-4c3c0d42-poc-001-damage-and-fallen.md), and [P07](2026-10-02-f8938420-poc-001-brood-abilities.md). Baseline: `79f9498051df0281e6e9d3c904e9eee32f014873`.

Authority: [brief Ordinary patrol, Round structure, and wounded starting conditions](../../docs/prototypes/poc-001-linked-formation.md). All HP values, damage, targeting ties, and resolution ordering below are proposed reproducible fixture defaults, not settled balance. See the [index](README.md) for authority labels and local ADRs.

**Amended 2026-10-04 (two-ring board):** see [Amendment TR](#amendment-tr-2026-10-04--two-ring-board). The proposed enemy cells in the fixture table are superseded.

Delivery sequence: [P01–P12 index](README.md). Governing format: [ADR-0002](../adr/0002-plan-filenames.md) and [ADR-0003](../adr/0003-implementation-plan-writing.md).

Task `P08` owner and integration owner: POC 001 implementer, currently unassigned. This plan is one standalone task; its sequential checkpoints inherit the prerequisites, affected components, acceptance criteria, verification, and hand-back defined here. Checkpoint identifiers remain stable on edits. The Coordinator records actual execution in [TASK_LOGS](../TASK_LOGS.md) from the implementer's mailbox handoff; no execution evidence exists yet.

## Amendment TR (2026-10-04) — two-ring board

**Status: draft amendment; not implemented.** Trigger: the user's two-ring decision ([brief Decision record](../../docs/prototypes/poc-001-linked-formation.md#decision-record)) and the [P02](2026-10-02-2e228a2b-poc-001-formation-algebra.md#amendment-tr-2026-10-04--two-ring-board)/[P05](2026-10-02-d66a7452-poc-001-intent-semantics.md#amendment-tr-2026-10-04--two-ring-board) two-ring amendments. Board task: [Two-ring board](2026-10-04-d005e5f4-poc-001-two-ring-board.md).

- **Enemy anchors (superseded).** The proposed Warder `(0,-1)`, Censer `(-1,1)` and Harrier `(1,0)` are ring-1 cells. On the two-ring board these are exactly Compact Pazuzu's cells at orientations 4, 2 and 0. At the proposed `patrol-v1` start (Compact orientation zero), Harrier would share Pazuzu's cell `(1,0)`.
- **Replacement (accepted user decision, 2026-10-04).** Patrol content gives enemies no board cell. All patrol enemies use the centre `(0,0)` as their shared visual anchor, and P10 owns any pixel offsets that keep them readable as a cluster. No rule reads an enemy cell: protection, masks and intentions are encounter-centred through P05. Encounter layout is an open experiment question ([brief Open decisions](../../docs/prototypes/poc-001-linked-formation.md#open-decisions)). Do not encode a final enemy-placement rule. If content needs a placeholder field, mark it view-only.
- **Unchanged.** HP, damage, targeting, round cadence, Warder facing 0 and the three presets are unchanged. Censer splash radius 2 hits all three Compact Brood and only its target in Spread (distance 4). Harrier's isolated bonus applies to every living Spread Brood and to no Compact Brood while two or more live. These are the same qualitative contrasts P05 already specifies.

## Smallest useful outcome

A headless combat session can announce intentions, accept player actions/maneuvers, resolve one enemy phase, repeat, and finish in victory or defeat. The same commands and fixture always produce the same result.

## Starting source and ownership

Own proposed `src/content/patrol.ts`, `src/core/rounds.ts`, and `tests/patrol.test.ts`; register `endPhase` in P03. Reuse P05/P06/P07 instead of duplicating targeting or damage. Own three factory presets, not a new procedural encounter system. P10 supplies the playable interface.

## Fixture and inputs

Proposed `patrol-v1` starts at round 1, Compact orientation zero, with fresh budgets and no statuses.

| Entity | Maximum/starting HP | Position or behavior |
|---|---|---|
| Ugallu | 18/18 | Brood slot 0. |
| Girtablilu | 14/14 | Brood slot 1. |
| Pazuzu | 14/14 | Brood slot 2. |
| Warder | 12/12 | `(0,-1)`, facing 0; protects Censer while both live. |
| Censer | 10/10 | `(-1,1)`; marked splash, raw damage 3, radius 2. |
| Harrier | 13/13 | `(1,0)`; marked hit, 4 damage or 7 if isolated at impact. |

Warder also declares a 3-damage hit. Wounded presets change only Ugallu's starting HP to 7, or only Girtablilu's to 5; maximum HP stays unchanged. Numeric defaults live in content, not tests or UI copies.

## Contracts and decisions

### Required contracts

Announce the full surviving enemy intention set before player input. Do not silently retarget during the player phase or enemy resolution. An enemy defeated before its action does not act. Each attack settles through P06 before the next enemy acts. Terminal outcomes stop remaining resolution. A nonterminal next round resets each living Brood's action availability and exactly one maneuver allowance, with no banking.

### Settled choices

Player activations may occur in any order, with one shared maneuver before/between/after. The patrol combines directional protection, proximity splash, and isolation pressure. Normal, wounded-Ugallu, and wounded-Girtablilu starts are required experiments. The ordinary encounter precedes the boss.

### Proposed implementation and fixture decisions

Resolve surviving enemies in explicit order Warder, Censer, Harrier, independent of object/dictionary iteration. Warder marks the first living Brood in `[ugallu,girtablilu,pazuzu]`. Censer cycles `[girtablilu,pazuzu,ugallu]` by round, scanning forward to the next living candidate if necessary. Harrier marks the lowest current-HP/max-HP ratio at announcement, with ties in fixed roster order; compare ratios by integer cross multiplication. These selections remain locked until the next announcement.

Persist Warder facing between rounds, including Crosswind changes. Select Censer's splash recipients and Harrier's isolation damage only at impact through P05. Expire remaining Shelter after the enemy phase and before new intentions are announced.

`endPhase` may forfeit unused Brood actions; it is a deliberate choice, not a new ability. The public command resolves the enemy phase and next announcement atomically, returning ordered events for later animation. It increments public revision once. Rejected/terminal calls change nothing. Factories create independent state for reset; no HP or facing leaks between attempts.

## Implementation checkpoints

1. **P08.C1** — Add the three factories and exact, inspectable content defaults.
2. **P08.C2** — Implement deterministic announcement and stable target selection, including ties and fallen candidates.
3. **P08.C3** — Implement end-phase resolution, cancellation, expiry, terminal checks, and next-round budgets.
4. **P08.C4** — Author actual winning and losing command traces after running the implementation; retain their fixtures as regressions rather than assuming this draft proves winnability.

## Acceptance criteria

1. Each fresh preset yields its documented HP and independent state; only the specified wounded starting HP differs between presets.
2. Round-one targets are Warder→Ugallu, Censer→Girtablilu, Harrier→Ugallu for the healthy preset; wounded presets change Harrier's mark according to the stated ratio rule.
3. Moving the squad does not retarget marks; Compact splash and Spread isolation damage differ exactly as P05 specifies.
4. Killing Warder immediately removes its protection and cancels its pending action; killing any other enemy cancels only that enemy's future action.
5. End phase resolves the declared order, expires Shelter, and either enters the correct terminal state or announces the next round with reset, unbanked budgets.
6. Ending early forfeits unused actions without granting them next round; no action is resolved twice by a repeated stale command.
7. At least one executed healthy-patrol winning trace and one executed defeat trace are stored with exact initial fixtures and expected final state; repeat runs produce identical events.

## Verification and hand-back

Return exact executed commands, results, acceptance evidence, and limitations in the implementer's [mailbox](../mailbox/README.md) handoff; the Coordinator then records them in [TASK_LOGS](../TASK_LOGS.md), links that entry here, and updates [CURRENT](../CURRENT.md) when implementation facts change. The commands below remain proposed until their prerequisites supply them.

Run `just poc-001-test tests/patrol.test.ts tests/abilities.test.ts tests/damage.test.ts` and `just poc-001-typecheck`. Return factory definitions, targets per tested round, the actual traces, and terminal outputs. A trace failure may require proposing a fixture change; version and document it. Do not convert a headless win into a claim of interesting decisions or human playtest success.

## Non-goals and stop conditions

No boss, procedural encounters, adaptive AI, pathfinding, tactical retreat, campaign, or endless balance sweep. Stop when the patrol loop is complete and reproducible. If no credible winning trace exists, investigate rules/fixtures before UI work; do not invent a passed trace or weaken terminal invariants to obtain one.
