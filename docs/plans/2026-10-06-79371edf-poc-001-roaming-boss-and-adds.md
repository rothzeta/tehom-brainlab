# A roaming boss and two adds create positional target-priority decisions

## Status and authority

**P17. Accepted for implementation; not implemented.** Written 2026-10-06 as a draft by an external design review (draft PR #1, commit `71cc26c`), then checked against source and made executable by the Architect on 2026-10-06 ([design report](../mailbox/boss-experiments/architect.md)). Sequence: [plan index](README.md#boss-experiments-p13p17). Format: [ADR-0002](../adr/0002-plan-filenames.md), [ADR-0003](../adr/0003-implementation-plan-writing.md). Testing: [ADR-0006](../adr/0006-contract-invariants-and-black-box-testing.md).

Authority: the user's decisions of 2026-10-06 ([brief Decision record](../prototypes/poc-001-linked-formation.md#decision-record)). There is a second, off-centre boss with adds. The HP, damage, the six-slot route and the add composition (a Warder and a Censer) are **provisional defaults, implemented as written**.

Standing direction applies:

- Positional ranks, not puzzle movement.
- The Brood move only through the shared maneuvers.
- The centre is reserved for a boss, and stays empty here.
- There is no generic reach rule. The Warder's support range is ability-specific: it belongs to that protection relation only.

Task `P17`. Owner: a POC 001 Implementer. Prerequisites: delivered P14, P15 and P16. After P17 the user plays the [combined manual round](#combined-manual-test-checklist-user-round-after-p17). Durable report: `docs/mailbox/p17-roaming-boss-and-adds/implementer.md`.

## Smallest useful outcome

A third selectable encounter, the Collector, combines a boss that relocates between rounds with two stationary adds. Where the boss stands, which add survives, and how the Brood stand all change the next useful action.

Reusing the Crucible pattern with a moving icon is insufficient.

## Starting source and ownership

Inspected at `71cc26c`, plus the P15/P16 designs, within `poc-001-linked-formation/`:

| File | Current behaviour | Change |
|---|---|---|
| new `src/content/collector.ts` | — | `COLLECTOR_VERSION = 'collector-v1'`, entities, rules, presets, factory, announcement, resolution order and damage |
| `src/core/intents.ts` | `ProtectionRelation {sourceId,targetId}`; `selectProtection` checks only that the attacker is in the source's `frontCells` | Optional `range`. When present, a source farther than `range` from its ward (hex distance) gives the per-source reason `out-of-range` and does not protect |
| `src/core/lifecycle.ts` | Victory when every enemy is fallen | Victory when every **objective** enemy is fallen. Enemies are objectives unless they set `objective: false`; with none set, delivered behaviour is unchanged |
| `src/core/state.ts` | `CombatEnemy` has `rotatable?` (and `mobile?` after P16) | Optional `objective?: boolean` |
| `src/core/encounters.ts` (P15) | patrol, crucible | Add `collector` |
| `src/core/run-record.ts` | Codecs for patrol and Crucible | Collector codec; the enemy may carry optional `objective`; a protection entry may carry an optional nonnegative integer `range` |
| `src/main.ts`, `src/view/{CombatScene,patrol-session}.ts` | Two encounters | `?play=collector`, header link, presets, ward-range readout, disabled adds after victory |
| `README.md` (prototype) | — | Collector section; P05 note on ranged protection; P06 note on objectives |

The victory predicate must live in `settleLifecycle`. Replay calls `applyAbility` directly, not the dispatcher (`run-record.ts` `replayRun`), so a rule applied only in `applyCommand` would diverge between play and replay.

Unchanged and protected: `src/core/{hex,formation,sectors,damage,abilities,transition,preview,rounds,enemy-movement,commands,smoke}.ts`, `src/content/{patrol,brood,crucible}.ts`, `src/view/{FormationLab,lab-state,projection}.ts`, `scripts/`, `bin/`, `package.json`, `bun.lock`, configs, `justfile`, `assets/`, `docs/` outside this task's report. If one must change, stop and report why.

## Fixture and inputs

The Collector is drawn with the existing `foundry-mechanism` emblem, labelled "Collector" (provisional, Q4). The adds reuse their own emblems.

| Entity | Cell | HP | Facing | Traits |
|---|---|---|---|---|
| `collector` (boss) | `(1,1)` | 36 | 0 initially; chosen at each announcement | mobile, rotatable, objective |
| `warder` | `(-2,1)` | 10 | 4 (provisional, Q2) | stationary, rotatable, `objective: false` |
| `censer` | `(1,-2)` | 10 | 0 (provisional, Q2; has no rule effect) | stationary, not rotatable, `objective: false` |

- **Protection:** `warder → collector` with `range: 2`. The reduction is the encounter's `damageRules.directionalReduction` (default 2).
- **Brood:** P08 HP and wounded presets (`healthy`, `wounded-ugallu`, `wounded-girtablilu`), imported from `PATROL_HP` and `WOUNDED_HP`. Compact orientation 0.
- **Damage:** boss sweep 5; Warder mark 2; Censer splash 3, radius 2. The ward range and these values live in `collectorRules`.
- **Fixed counts:** exactly three enemies at start, no reinforcement, and the centre stays empty.

## Contracts and decisions

### Required contracts

- Only the boss relocates, using P16 between rounds. The player keeps both P13 allowances.
- Each new attack comes from the actual post-relocation tile and is fully announced before player input.
- Every Brood keeps a legal reliable attack on every living enemy. Contact reach is unchanged, so the player never spends rounds chasing the boss.
- Frozen marks whose target falls fizzle and never retarget. The boss's sweep cells are frozen for the response. Crosswind turns them about the boss's tile; maneuvers do not.
- Moving the boss beyond ward range deactivates the protection visibly, without removing the relation. Killing the Warder removes it.
- **Boss death ends the encounter immediately** with victory. Surviving adds resolve nothing more and receive no invented death event. Killing both adds leaves the boss fight running.
- Patrol and Crucible victory, events and records are unchanged.

### Provisional defaults (as written)

- **Resolution and announcement order:** Warder, Censer, boss; then P16 relocation; then fresh declarations.
- **Warder:** a marked hit for 2 on the first living Brood in roster order (the patrol Warder's rule). Turnable, stationary.
- **Censer:** a marked splash for 3, radius 2, using the patrol's round-indexed `[girtablilu, pazuzu, ugallu]` living cycle. There is no isolation bonus.
- **Boss sweep:** at each announcement, choose the facing whose `frontCells(boss.cell, f)` holds the most living Brood. Ties go to the current facing, then successive clockwise facings. Set that facing and declare a turnable fixed area on those cells for 5. There is no second phase and no forced-expansion routine.

### Record compatibility (decision)

- New rules version `poc-001-rules-v3/collector-v1/p14-v1`. `fixtureId` is a patrol-style preset; `configuration` is `{ collectorRules, abilityRules }`; state fields are `collectorVersion` and `collectorRules`.
- `RECORD_VERSION` stays 1, and the patrol and Crucible strings are unchanged.
- The optional `objective` and `range` fields can only appear in records that pre-P17 builds already rejected. Existing records keep their meaning and replay identically.

## Implementation checkpoints

1. **P17.C1 — Shared rules.** Ranged protection in `selectProtection` and the objective predicate in `settleLifecycle`, with unit tests. Every existing suite still passes unedited.
2. **P17.C2 — Collector headless.** Content, factory, announcement (sweep choice and ties), resolution, relocation through P16, records. Deterministic tie, corpse and boss-death cases.
3. **P17.C3 — Browser.** Route, header link, presets, ward-range readout, origin and destination previews, disabled adds after victory. Build, run the browser suite, inspect screenshots.
4. **P17.C4 — Contracts, comparison traces and full verification**, bare at one candidate revision. Then hand back for the user's round.

## Required test updates (explicit exception)

**None.** Both shared changes are additive and default to delivered behaviour. If an existing test fails, stop and report it.

## Acceptance criteria

1. The encounter starts with three distinct enemy cells and an empty centre. Only the boss changes cells between rounds.
2. The boss's committed sweep is computed from its actual tile and the chosen facing, and stays fixed through the player response. Crosswind transforms only the boss's sweep and facing, or the Warder's facing; neither relocates.
3. Moving the boss into or out of ward range changes protection eligibility, with `out-of-range` in the selector and the readout. Rotating the Brood changes ward-front exposure. Neither is approximated from sprite positions.
4. Killing the Censer removes its future splash, and killing the Warder removes its guard. Killing the boss wins immediately, with no further add attack and no add `fallen` event. The adds show as disabled.
5. There is no reinforcement and no fourth enemy. Reliable attacks stay legal on every living enemy from every formation, including after Brood casualties.
6. Patrol and Crucible launch, reset and replay unchanged. Collector attempts reconstruct destinations, ward eligibility, declarations, actions and outcomes exactly with `just poc-001-replay`.
7. Controlled comparison traces record consequences for holding, rotating, changing shape and choosing a different first target. A dominant universal opening is a design finding, not a claim of tactical diversity.
8. **Tuning is not frozen.** No new assertion pins 36, 10, 5, 3, 2, cells or facings. Tests use explicit test-local rules and cells, or read the encounter's exported content. Route order and tie rules are the contract under test.
9. All existing suites pass unedited.

## Verification and hand-back

Run from the repository root at one candidate revision, **bare** (no `POC001_CHROME`, `CHROME_PATH` or other override):

- `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build`
- `just poc-001-test-browser` (report the selected Chrome binary and why)
- `just poc-001-replay` on one export each of patrol, Crucible and Collector
- `git diff --check <BASE>..HEAD` and `git diff --exit-code <BASE>..HEAD --` over the protected paths

Screenshot inspection:

- Collector start with the ward out of range;
- round 2 with the boss at `(-1,2)` and the ward in range;
- the End-phase preview with the boss destination ghost;
- the boss standing on the Warder's corpse cell;
- victory with the adds disabled;
- one placeholder capture.

Durable report: as in [P13](2026-10-06-e8cec63d-poc-001-split-maneuver-budgets.md#verification-and-hand-back), plus the route and ward tables observed and the comparison traces.

## Balance hypotheses (computed; for the manual round)

Computed by the Architect with a disposable script over all route slots, facings and 12 formations. They are expectations, not decisions.

- **R-H1 — The ward blinks.** Edge slots one step apart are distance 2; two steps, 3; opposite slots, 4. With both adds alive, the boss's clockwise step from `(-1,2)` is blocked by the Warder at `(-2,1)`. It therefore alternates `(1,1)` (distance 3, out of range) in odd rounds and `(-1,2)` (distance 2, in range) in even rounds. Killing the Censer first changes nothing: the Warder still blocks.
- **R-H2 — Killing the Warder frees the route.** The boss then steps onto the Warder's corpse at `(-2,1)`. While the Censer lives, it alternates `(-2,1)` and `(-1,-1)`, because `(1,-2)` is occupied. With both adds dead it circles all six slots.
- **R-H3 — One maneuver always dodges the sweep.** From every slot the best facing covers 2 Compact Brood or 1 Spread Brood, and some single maneuver always empties it. Expand always works from Compact; a rotation always works from Spread. Ignoring movement costs 5–10 damage a round, so moving is required, but it never needs both categories.
- **R-H4 — Spread looks dominant.** The Censer's radius-2 splash hits all three Compact Brood and only its target in Spread. Combined with R-H3, "Spread, rotate to dodge" may become a routine.
- **R-H5 — The routine has a price.** At Warder facing 4 the ward front holds exactly one Compact Brood per orientation, no Spread Brood at even orientations, and one at odd ones. A Spread rotation flips that parity, so dodging the sweep can put a Brood in the ward front. This matters only in even rounds, while the boss is in range. This is the intended positional decision; the round should show whether it reads as ranks or as a puzzle.

## Combined manual test checklist (user round after P17)

Use `?play=patrol`, `?play=crucible` and `?play=collector`, plus the formation lab at `/`. Export an attempt (JSON) whenever something looks wrong.

**Split allowances (P13).**

1. In the lab and the patrol, rotate and expand in one phase, in both orders. Do both readouts show what is spent? Are both restored next round?
2. Does having both every round make the patrol trivial? If so, is it the budget or the patrol?

**Revised kit (P14).**

3. Shelter Ugallu itself while Spread. Is a 4-point Shelter now worth an action?
4. Impale the Warder-protected Censer from Spread with Girtablilu in the Warder's front (reduced), then out of it.
5. With one Brood fallen, is Impale still available in Spread?
6. Did you use Shelter and Crosswind in every encounter? If not, why not?

**Crucible (P15).**

7. Phase one: watch the inner pulse (ring 1) and the turnable sector. Try X-H1: Expand once and stay Spread at an even orientation. Does any primary attack land?
8. Push the boss to half HP. Does the pending indicator appear, with the current attacks unchanged? Does phase two start at the next announcement?
9. Phase two: the outer pulse plus splash, and the fork. Is Compact plus one rotation enough every round (X-H2)?
10. Which Brood is in the boss's self-guard front? Did you Crosswind the boss?

**Collector (P17).**

11. Does the boss's move between rounds show in the End-phase preview? Can you tell where its next sweep comes from?
12. Does the ward blink in and out of range on alternate rounds (R-H1)? Did that change when you burst the boss?
13. Which add did you kill first, and why? After the Warder fell, did the boss walking onto its tile change anything (R-H2)?
14. Is "Spread, rotate to dodge" a routine (R-H3, R-H4)? Did the ward front ever make you hold or pick a different rotation (R-H5)?

**The core complaint.**

15. In each encounter, did you have to move to avoid damage, and did where you moved change who you attacked or protected? Or was movement a routine with one right answer?
16. Was holding formation ever right?
17. Would removing the maneuvers remove decisions you value?

**Next.** Which first: the Crucible cadence lever (X-H1), budget limits, tuning, the flank patrol layout, or ability-specific reach?

## Review corrections to the draft (2026-10-06)

- The draft left the Warder's and Censer's facings and the boss's initial facing unspecified. Provisional defaults were added (Q2): Warder 4 for its computed ward coverage, Censer 0, boss 0.
- Computed the route: with both adds alive the boss oscillates between two slots and never circles (R-H1/R-H2). This is the drafted rule's actual behaviour, now recorded.
- R-H3: the sweep is always single-maneuver dodgeable.
- The victory predicate must sit in `settleLifecycle`, because replay bypasses the dispatcher. The draft's "encode this encounter-specific victory predicate" did not say where.
- Ward range is an optional field on the protection relation. It is not a generic reach rule.
- Added the combined manual-test checklist.

## Non-goals and stop conditions

Out of scope: respawning waves, a third boss, Brood movement, a shared combat engine, generic ability range, Revelation, and campaign.

Stop and report when:

- relocation cannot change relevant consequences (fix this fixture's local rules before adding content);
- occupied slots or phase timing invalidate forecasts (return to P16);
- any existing suite fails.

A technically completed boss is not proof that this combat should replace Apex/Shadow.
