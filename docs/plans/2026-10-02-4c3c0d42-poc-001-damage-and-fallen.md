# Resolve a hit and its fallen-state consequences deterministically

## Status and authority

**P06. Implemented, independently reviewed (blocking R1 fixed and re-reviewed; no remaining findings), accepted, locally delivered.** [Implementation](../mailbox/p06-damage-and-fallen/implementer.md), [integration](../mailbox/p06-damage-and-fallen/integration.md), [R1 fix](../mailbox/p06-damage-and-fallen/fix-r1.md), and [review](../mailbox/p06-damage-and-fallen/reviewer.md). Depends on [P03](2026-10-02-2dfffcd3-poc-001-command-boundary.md) and [P05](2026-10-02-d66a7452-poc-001-intent-semantics.md). Baseline: `79f9498051df0281e6e9d3c904e9eee32f014873`.

Authority: the [brief's deterministic combat requirement, Shelter description, and Open decisions](../../docs/prototypes/poc-001-linked-formation.md). Fallen-slot behavior, simultaneous-hit ordering, and terminal precedence are unresolved there; this plan proposes explicit local defaults. See the [index](README.md) for draft/ADR authority.

**Amended 2026-10-04:** reviewed against the Compact triangle; no rule change. See [Amendment CT](#amendment-ct-2026-10-04--compact-triangle).

Delivery sequence: [P01–P12 index](README.md). Governing format: [ADR-0002](../adr/0002-plan-filenames.md) and [ADR-0003](../adr/0003-implementation-plan-writing.md).

Task `P06` owner and integration owner: POC 001 implementer, currently unassigned. This plan is one standalone task; its sequential checkpoints inherit the prerequisites, affected components, acceptance criteria, verification, and hand-back defined here. Checkpoint identifiers remain stable on edits. The Coordinator records actual execution in [TASK_LOGS](../TASK_LOGS.md) from the implementer's mailbox handoff; no execution evidence exists yet.

## Amendment CT (2026-10-04) — Compact triangle

**Status: assessed, no contract change.** Trigger: the user decision of 2026-10-04 ([brief Decision record](../../docs/prototypes/poc-001-linked-formation.md#decision-record)), the [P02 mapping amendment](2026-10-02-2e228a2b-poc-001-formation-algebra.md#amendment-ct-2026-10-04--compact-triangle) and the [P05 sector amendment](2026-10-02-d66a7452-poc-001-intent-semantics.md#amendment-ct-2026-10-04--compact-triangle). Execution: [Compact triangle task](2026-10-04-fb4bf201-poc-001-compact-triangle.md).

P06 reads geometry only through P05 selectors and P02 links. Hand-checking the delivered `tests/damage.test.ts` fixtures against the amended mapping and sectors gives the following:

- Compact orientation zero still places every attacker in Warder's facing-zero front. Orientation two is still outside it.
- Shelter pairs Ugallu→Girtablilu and Pazuzu→Girtablilu stay Close (distance 1), are Stretched after expansion, and are Stretched at threshold 0.
- Splash radius 2 still covers all three Compact Brood.
- Fallen Brood keep their labelled slots. For a fallen inward Pazuzu, that slot is the ring-2 cell.

No P06 assertion is expected to change. The fixed-area fixture `[{q:3,r:0}]` asserts only declaration retention, not recipients. If a P06 test fails after the P02/P05 change, the task must report it as a finding with the exact assertion. It must not edit the test unless the assertion encodes the superseded Compact cells or distances.

## Smallest useful outcome

Applying one validated attack yields exact HP changes, consumed protections, fallen entities, cancelled eligibility, and a terminal outcome without relying on array order or animation timing.

## Starting source and ownership

Own proposed `src/core/damage.ts`, `src/core/lifecycle.ts`, and `tests/damage.test.ts`. Consume P05 recipient/protection selectors. P07 creates attacks and Shelter statuses; P08 invokes attacks in enemy order and expires round statuses. Do not implement the entire combat loop in this module.

## Fixture and inputs

Use small artificial unit fixtures, not claims about encounter balance: raw hit 5 against HP 10; overkill hit 9 against HP 2; a two-point protection; a Shelter relation from Ugallu to Girtablilu; and a three-damage splash where Ugallu starts at HP 2, Girtablilu/Pazuzu at HP 10. Include final-enemy and final-Brood deaths.

An attack carries a source ID, declared recipients from P05, nonnegative integer raw damage, bypass-protection flag, and a stable event identity. Reject invalid IDs/amounts at the command boundary before state changes.

## Contracts and decisions

### Required contracts

Damage is deterministic, HP is clamped between zero and max HP, and an entity becomes Fallen at zero. Fallen entities cannot act, grant protection, or be selected as living targets. Shelter checks its living source and Close link at impact, not merely at application. No later animation callback may apply the same damage again. A single attack's result is independent of recipient iteration order.

### Settled choices

Use guaranteed hits and fixed numbers initially. The POC has no campaign regeneration or permanent-death system. Ordinary encounters end by defeating the enemies. Formation continues to use the fixed encounter centre and accepted shape/orientation.

### Proposed implementation and experimental defaults

Compute recipients and mitigation for one multi-target attack from one pre-hit snapshot, apply its HP changes as a batch, then settle deaths and cancel source-dependent effects. This lets Ugallu's Shelter protect an ally from the same blast that fells Ugallu, but not from a later enemy's attack. Separate attacks settle sequentially.

Directional protection subtracts 2 unless bypassed. Shelter subtracts 2 when eligible. Apply directional protection before Shelter and clamp the final amount at zero. A positive-raw-damage hit consumes a Shelter on its target even if the link is no longer Close; an ineligible Shelter then reduces nothing. A zero-raw-damage packet consumes nothing. Shelter expires after the current enemy phase whether used or not; P08 calls the expiry operation.

Keep fallen Brood in their labelled formation slots as inert markers. Do not pull survivors together, refill the roster, or remove a corner. Dead links remain identifiable but grant no effects. Impale's post-death eligibility is specified in P07.

After each attack batch: all Brood fallen means defeat; otherwise all enemies fallen means victory; otherwise combat continues. For a synthetic simultaneous all-dead fixture, defeat takes precedence. Terminal states reject further gameplay commands. Revise these provisional policies explicitly if playtesting calls for another death model.

## Implementation checkpoints

1. **P06.C1** — Add pure single/multi-target damage calculation with independently tested mitigation.
2. **P06.C2** — Apply one batch and derive fallen events only on transitions from positive HP to zero.
3. **P06.C3** — Remove fallen-source protections and expose terminal status while preserving formation slots.
4. **P06.C4** — Add the explicit status-expiry helper for P08 and test its idempotence.

## Acceptance criteria

1. Raw damage 5 against HP 10 yields HP 5; with eligible two-point directional protection it yields HP 7; bypass restores HP 5.
2. Shelter reduces the next positive hit by 2 only while Ugallu is alive and Close; expanding before impact removes that reduction without refunding the action.
3. In the splash fixture, Ugallu falls, sheltered Girtablilu ends at HP 9, and Pazuzu at HP 7 regardless of iteration order; a subsequent attack receives no protection from fallen Ugallu.
4. Overkill clamps HP to zero and emits exactly one Fallen event; repeated lifecycle settlement emits no duplicate death.
5. A fallen Brood retains its labelled slot but cannot act or maintain active links; marked attacks and protections cancel according to P05.
6. Killing the final enemy produces victory, losing the final Brood produces defeat, and terminal states reject subsequent gameplay commands without changes.
7. End-of-enemy-phase expiry removes unused Shelter once, and calling expiry again makes no additional change.

## Verification and hand-back

Return exact executed commands, results, acceptance evidence, and limitations in the implementer's [mailbox](../mailbox/README.md) handoff; the Coordinator then records them in [TASK_LOGS](../TASK_LOGS.md), links that entry here, and updates [CURRENT](../CURRENT.md) when implementation facts change. The commands below remain proposed until their prerequisites supply them.

Run `just poc-001-test tests/damage.test.ts tests/intents.test.ts tests/commands.test.ts` and `just poc-001-typecheck`. Return ordered event traces for an ordinary hit, a same-blast guardian death, and both terminal outcomes. Document which defaults were implemented or amended; do not describe the proposed numbers as balanced.

## Non-goals and stop conditions

No healing, wounds between battles, resurrection, loot, random critical hits, damage-over-time engine, resistances catalogue, reactions framework, or campaign failure. Stop at a complete hit/lifecycle transition. If a new ability needs recursion or callbacks into the renderer, stop and revise the core contract rather than adding hidden side effects.
