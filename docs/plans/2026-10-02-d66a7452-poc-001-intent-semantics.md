# Keep declared attacks, directional protection, and facing changes unambiguous

## Status and authority

**P05. Draft; not implemented or verified.** Depends on [P02](2026-10-02-2e228a2b-poc-001-formation-algebra.md) and [P03](2026-10-02-2dfffcd3-poc-001-command-boundary.md). Baseline: `79f9498051df0281e6e9d3c904e9eee32f014873`.

Authority: [brief Round structure, Test abilities, and encounter descriptions](../../docs/prototypes/poc-001-linked-formation.md). Exact sector masks and cancellation rules are explicitly open in that source; the choices below are proposals, not recovered requirements. Formatting authority is recorded in the [index](README.md).

Delivery sequence: [P01–P12 index](README.md). Governing format: [ADR-0002](../adr/0002-plan-filenames.md) and [ADR-0003](../adr/0003-implementation-plan-writing.md).

Task `P05` owner and integration owner: POC 001 implementer, currently unassigned. This plan is one standalone task; its sequential checkpoints inherit the prerequisites, affected components, acceptance criteria, verification, and hand-back defined here. Checkpoint identifiers remain stable on edits. Record actual execution in [TASK_LOGS](../TASK_LOGS.md); no execution evidence exists yet.

## Smallest useful outcome

Pure selectors can explain which Brood a declared attack would hit in the current formation, whether an attacker is inside a protection sector, and exactly what changes when a facing is explicitly turned. No damage or enemy decision-making is implemented here.

## Starting source and ownership

Own proposed `src/core/intents.ts`, `src/core/sectors.ts`, and `tests/intents.test.ts`. Reuse P02's ring ordering and P03's entity IDs/state. P06 owns damage application; P08 owns choosing intentions; P10 owns rendering. These consumers must not duplicate masks or targeting calculations.

## Fixture and inputs

Use both P02 shapes at all six orientations. Declare a fixed area at facing zero, a direct mark on Girtablilu, a splash mark on Girtablilu, and a Warder protecting Censer at facing zero. Include an actor/target with zero HP and a facing wrap from five to zero.

Proposed outer sector `s` consists of `R[3s]`, `R[3s+1]`, `R[3s+2]`. The frontal protection/sweep mask at facing `f` covers sectors `f` and `(f+1) mod 6`: six outer cells. These are encounter-centred sectors, not line-of-sight cones emitted from the enemy sprite. Interior cell coordinates remain visual anchors for enemies; player eligibility is evaluated on the outer ring.

## Contracts and decisions

### Required contracts

A location-bound intention keeps its declared cells when the party maneuvers. A target-bound intention keeps its declared target ID and uses that target's current position at resolution. Merely selecting another target or recomputing a preview must not rewrite either intention. Ordered recipient results and explicit explanations must be available to both preview and resolution.

### Settled choices

Area and creature-targeted attacks are distinct. Crosswind may explicitly turn an enemy's facing and associated directional intention by one step. Contact attacks can reach central enemies without adjacency; directional protection reduces effectiveness rather than making all contact attacks illegal.

### Proposed implementation

Use a small intention union: `fixed-area`, `marked-hit`, and `marked-splash`. Store declared cells for fixed-area attacks plus whether the source's directional intention is explicitly turnable. Crosswind rotates only those turnable cells through P02's axial transform and emits a facing/intent-change event. Squad rotation does not. Other area effects remain fixed.

A splash affects its living marked target and living Brood within two hex steps of the target's current cell. Isolation means no other living Brood is Close. Zero-HP creatures do not grant active links or count as splash recipients. An intention from a fallen enemy is cancelled. A target-bound attack whose marked creature has fallen fizzles without retargeting, including its splash; expose this in the readout.

Warder protection is a relation from one living source to a designated living enemy. An incoming non-bypassing attack is protected when the Brood's current ring cell lies in that source's frontal mask. Do not recalculate the origin around the protected enemy. The mitigation amount is owned by P06/P07 tuning.

## Implementation checkpoints

1. **P05.C1** — Encode explicit sector and front-mask fixtures with stable cell ordering.
2. **P05.C2** — Define intention types and pure recipient/protection selectors using current live eligibility.
3. **P05.C3** — Implement the explicit one-step facing/turnable-area transform; keep target IDs unchanged.
4. **P05.C4** — Test maneuvers, deaths, boundaries, and wraparound against hand-written expected sets.

## Acceptance criteria

1. A facing-zero front mask contains exactly ring indices 0 through 5, and a facing-five mask contains 15, 16, 17, 0, 1, 2.
2. Rotating or expanding the squad leaves a stored fixed-area mask unchanged while changing its affected Brood when their positions enter or leave it.
3. A mark on Girtablilu remains on Girtablilu after every maneuver; its splash follows Girtablilu and excludes Brood farther than two steps away.
4. One explicit clockwise turn changes a turnable mask by one sector step and changes facing modulo six, but never changes marked target IDs or non-turnable areas.
5. A fallen source cancels its intention; a fallen marked target produces an empty recipient set and no replacement target.
6. Protection and isolation queries agree across all twelve states, including a fixture with one fallen Brood; all input snapshots remain unchanged.

## Verification and hand-back

Record exact executed commands, results, acceptance evidence, and limitations in [TASK_LOGS](../TASK_LOGS.md), then link that entry here and update [CURRENT](../CURRENT.md) when implementation facts change. The commands below remain proposed until their prerequisites supply them.

Run `just poc-001-test tests/intents.test.ts tests/formation.test.ts` and `just poc-001-typecheck`. Return exact mask/recipient examples before and after a maneuver and Crosswind, plus the documented distinction between committed areas and explicitly changed directional intentions. Test expected sets independently; do not build expected masks by calling the function under test.

## Non-goals and stop conditions

No AI, HP mutation, real lighting, physical shadows, line-of-sight simulation, arbitrary enemy movement, or generic area-template language. Stop at selectors and explicit intent transforms. If an intended boss pattern needs different geometry, draft a separate mask proposal instead of changing the semantics of every existing attack.
