# Six Brood abilities with distinct tactical responsibilities

## Status and authority

**P14. Accepted for implementation; not implemented.** Written 2026-10-06 as a draft by an external design review (draft PR #1, commit `71cc26c`), then checked against source and made executable by the Architect on 2026-10-06 ([design report](../mailbox/boss-experiments/architect.md)). Sequence: [plan index](README.md#boss-experiments-p13p17). Format: [ADR-0002](../adr/0002-plan-filenames.md), [ADR-0003](../adr/0003-implementation-plan-writing.md). Testing: [ADR-0006](../adr/0006-contract-invariants-and-black-box-testing.md).

Authority: the user's decisions of 2026-10-06 ([brief Decision record](../prototypes/poc-001-linked-formation.md#decision-record)). The kit numbers are **provisional defaults, implemented as written**:

- Shelter reduces by 4 and may target self.
- Impale keeps 6 damage and loses its protection bypass.
- Impale is no longer tied to exactly two living partners.

Standing direction: there is no generic reach rule; reach is ability-specific and only where an ability needs it. This revision adds no reach.

Task `P14`. Owner: a POC 001 Implementer, who also owns local integration unless assigned otherwise. Prerequisites: delivered P06, P07, P09, P10, P11 and RF. P13 is not a functional prerequisite (see [index sequencing](README.md#sequencing-and-parallelism)). Durable report: `docs/mailbox/p14-tactical-kit-revision/implementer.md`.

## Smallest useful outcome

The trio can attack reliably, can make protection worthwhile in a controlled case, and can use facing control to change a consequential threat. Shelter can protect Ugallu itself. Impale is a damage tool that a guard can reduce. One fallen partner does not disable Impale.

A result fails acceptance if it:

- changes tooltips or icons without different legal outcomes;
- adds an ability, cooldown, reach rule or reusable shield resource;
- changes enemy HP, damage or patrol layout;
- edits a test outside the enumerated exception, or freezes a provisional value in a new assertion.

## Starting source and ownership

Inspected at `71cc26c`, within `poc-001-linked-formation/`:

| File | Current behaviour (computed from source) | Change |
|---|---|---|
| `src/content/brood.ts` | `BROOD_RULES_VERSION = 'p07-v1'`; Impale `bypassProtection: true`; Shelter target `close-ally` | `p14-v1`; Impale `bypassProtection: false`; Shelter target self or Close ally; a short non-numeric rule summary per ability for the UI |
| `src/core/abilities.ts` | Shelter legal only for a Close-linked other Brood (`isCloseLinked` is false for self). Impale needs exactly two living partners and two Stretched actor links | Shelter: self or Close-linked living ally, and no second active Shelter on the same target. Impale: at least one living partner, and every actor link to a living partner Stretched |
| `src/core/damage.ts` | `DEFAULT_DAMAGE_RULES.shelterReduction = 2`; a Shelter is effective at impact only if `isCloseLinked(source, target)` | Default `4`. A self-Shelter is effective while its Brood lives; an allied Shelter still needs a Close link at impact. Export that eligibility as one function |
| `src/core/preview.ts` | Shelter `eligible` fact recomputes `isCloseLinked` | Use the exported eligibility function |
| `src/view/CombatScene.ts` | Ability buttons show names only; the Shelter readout says "Close link lost" when ineligible | One rule line for the selected ability from content and the live rules; a self-Shelter shows as eligible |
| `README.md` (prototype) | P06 and P07 sections describe Shelter 2, other-ally only, Impale bypass and two partners | Update those sections |

Crosswind already takes a direction, rejects non-rotatable targets, and turns only its target's turnable fixed areas about the target's tile (P05/P07, verified in `intents.ts` `turnEnemy`). It needs tests and preview text, not new rules.

The Shelter amount used against enemy hits comes from the encounter's `damageRules` (`patrolRules.damageRules`, copied from `DEFAULT_DAMAGE_RULES` at creation). Changing the default therefore changes patrol Shelter too. This is intended, and keeps one owner.

Unchanged and protected: `src/core/{hex,formation,sectors,intents,lifecycle,rounds,transition,commands,state,run-record,smoke}.ts`, `src/content/patrol.ts`, `src/view/{FormationLab,lab-state,patrol-session,projection}.ts`, `src/main.ts`, `scripts/`, `bin/`, `package.json`, `bun.lock`, configs, `justfile`, `assets/`, `docs/` outside this task's report. `run-record.ts` needs no edit, because `RUN_RULES_VERSION` composes `BROOD_RULES_VERSION`. If a protected path must change, stop and report why.

## Fixture and inputs

- Before changing behaviour (P14.C1), record in the handoff the BASE outcome of each of the six abilities in one controlled state. This is versioned baseline evidence, not a second runtime kit.
- Use artificial target HP and explicit `AbilityRules`/`DamageRules`, as the existing tests do.
- Include: unprotected and protected targets; Compact and Spread; self and ally Shelter; one fallen partner; both partners fallen; a rotatable enemy with a turnable fixed area anchored off the centre (test-local).
- Reuse the six names and existing UI.

## Contracts and decisions

### Required contracts

- One ability action per living Brood, deterministic outcomes, legality and previews from the same rules, and unchanged rejection atomicity and precedence.
- Every living Brood keeps a legal reliable attack (Claw, Sting or Gale) on every living enemy in all twelve formations.
- Movement and turning stay separate: Crosswind never changes an enemy's cell.

### Provisional defaults (user, 2026-10-06; implement as written)

- Claw 4, Sting 4, Gale 3 bypassing directional protection: unchanged.
- **Impale:** 6 damage, no bypass. Legal when Girtablilu has at least one living partner and every active link from Girtablilu to a living partner is Stretched. On this board that means Spread with one or two living partners. A lone Girtablilu uses Sting.
- **Shelter:** reduces the next positive hit on its target by up to 4. The target is Ugallu itself, or a living ally Close-linked at cast. An allied Shelter is effective only while still Close at impact. A self-Shelter needs no link. One-hit consumption, end-of-enemy-phase expiry and removal when the source falls are unchanged.
- **No stacking:** a Shelter on a Brood that already has an active Shelter is rejected `illegal-target` without spending an action. The existing identity-collision check (`invalid-command`) runs first.
- **Crosswind:** unchanged. It turns a rotatable enemy one chosen step and transforms only that source's turnable fixed areas. Marks, non-turnable areas and other sources are unchanged.

### Record compatibility (decision)

`BROOD_RULES_VERSION` becomes `p14-v1`, so the patrol record's rules version becomes `poc-001-rules-v3/patrol-v2/p14-v1` (on top of P13) with no edit to `run-record.ts`. Records with `p07-v1` are rejected with the explicit unsupported-rules-version error, with no migration. The new Shelter default appears in each record's `configuration`, as all tuning already does.

## Implementation checkpoints

1. **P14.C1 — Baseline.** Record the six BASE outcomes. Confirm self-target validation and Shelter consumption paths in `abilities.ts` and `damage.ts`.
2. **P14.C2 — Shelter and Impale.** Content, legality, impact eligibility and the default amount; edits K1–K3; new tests for self-Shelter, no stacking, one-partner Impale and protection-reduced Impale. Prove reliable attacks stay legal from every formation. Run `just poc-001-test` and `just poc-001-typecheck`.
3. **P14.C3 — Crosswind, previews and UI.** Crosswind tests on an off-centre turnable area; preview Shelter facts; the rule line; browser checks for self-Shelter and one-partner Impale through native controls. Build, run the browser suite and inspect the screenshots.
4. **P14.C4 — Contracts and full verification.** README P06/P07 sections; export and replay a revised-kit attempt; run all verification bare at one candidate revision.

## Required test updates (explicit exception)

The assignment must grant an exception permitting exactly these edits. Each is required because the assertion encodes a superseded kit rule. Coverage must be kept or strengthened. Line numbers are at `71cc26c`.

- **K1** `tests/abilities.test.ts:106–115` ("protected Impale bypasses in Spread"): becomes "protected Impale is reduced in Spread". With the test-local `rules`, expect HP to fall by `impaleDamage − directionalReduction`, and the event to carry `directionalReduction` equal to the supplied rule. Keep all six orientations.
- **K2** `tests/abilities.test.ts:117–128` (Impale rejections): keep `compact` and `both-fallen` as rejections. Move `ugallu-fallen` and `pazuzu-fallen` to a new acceptance case (Spread, one living stretched partner).
- **K3** `tests/abilities.test.ts:146–156` (Shelter rejections): remove `self`. Its acceptance is a new test. The other four rejections stay.

**Expected to pass unedited:** every other test file and assertion, including `tests/damage.test.ts` (directly constructed Shelters keep P06 settlement semantics), `tests/preview.test.ts` (Shelter then expansion still loses an allied Shelter and enables Impale), `tests/patrol.test.ts` (its traces use no Impale or Shelter stacking), `tests/run-record.test.ts`, `tests/rf-contracts.test.ts` (after P13 R1 the version check composes `BROOD_RULES_VERSION`; if P14 runs before P13, its literal is the only permitted extra edit, as **K4**: compose the brood segment the same way), and all browser suites (they compare against the runtime core oracle). If one fails, stop and report.

## Acceptance criteria

1. Against a protected target with explicit rules, Claw, Sting and Impale lose exactly the directional reduction, and Gale loses none. Turning the guard with Crosswind changes which Brood are reduced, through the real selector.
2. An eligible Shelter reduces a hit by the supplied `shelterReduction` (never below 0) and is consumed once. It expires at the end of the enemy phase, and cannot be stacked.
3. Self-Shelter works in Compact and in Spread. An allied Shelter is ineligible at impact after its link stretches, and is removed when its source falls. Rejected casts spend nothing.
4. Impale is legal in Spread with one fallen partner, and illegal in Compact or with no living partner. Sting stays available in every case.
5. Crosswind changes an anchored off-centre enemy's facing and its turnable area about that enemy's tile, without changing its cell. Non-turnable areas and marks are unchanged.
6. In the browser, legality, the rule line, the immediate preview, the "If end phase now" forecast and resolution agree for self-Shelter and one-partner Impale. A new exported revised-kit attempt replays exactly, and a `p07-v1` record is rejected explicitly.
7. `DEFAULT_DAMAGE_RULES.shelterReduction` and the content summaries are the only places the new defaults appear. The view consumes them.
8. The suites listed as expected to pass unedited pass unedited.
9. **Tuning is not frozen.** No new or edited assertion pins a production default (4, 6, 2, HP, enemy cells or facings), except a content test that checks content exposes its own documented values. Rule tests use explicit test-local inputs, so changing a provisional value means editing content and its documentation, not rule tests.
10. Patrol outcome differences caused by the revised kit are documented in the handoff as changed kit behaviour, not as hidden tuning.

## Verification and hand-back

Run from the repository root at one candidate revision, **bare** (no `POC001_CHROME`, `CHROME_PATH` or other override):

- `just poc-001-test` (report counts against BASE)
- `just poc-001-typecheck`
- `just poc-001-build`
- `just poc-001-test-browser` (report the selected Chrome binary and why)
- `just poc-001-replay <revised-kit export>`, plus one `p07-v1` record (expected exit 1)
- `git diff --check <BASE>..HEAD` and `git diff --exit-code <BASE>..HEAD --` over the protected paths

Screenshot inspection: self-Shelter selected in Spread with its preview; Impale available in Spread after a partner falls (test fixture); a protected Impale preview showing the reduction.

Durable report: as in [P13](2026-10-06-e8cec63d-poc-001-split-maneuver-budgets.md#verification-and-hand-back), plus the BASE ability outcomes, the edit list mapped to K1–K3 (K4 if used), and open usefulness questions. Automated fixtures establish mechanical value, not enjoyment.

## Balance hypotheses (computed; for the manual round)

These are expectations to check, not decisions.

- **K-H1 — The Harrier opening survives.** Harrier is not a protection target, so Expand then Impale 6 + Claw 4 + Gale 3 = 13 still kills it (13 HP) in round one.
- **K-H2 — Shelter now cancels most patrol hits.** Shelter 4 fully absorbs a Warder (3), a Censer (3 on the target) or a Harrier (4) hit, and cuts an isolated Harrier (7) to 3. Self-Shelter lets Ugallu tank in Spread. The patrol may become easier.
- **K-H3 — Impale against the guard.** From Spread, Impale on the Warder-protected Censer deals 4 when Girtablilu stands in the Warder's front, 6 otherwise. Rotation or Crosswind now changes Impale's value.

## Review corrections to the draft (2026-10-06)

- Self-Shelter needs a change in `damage.ts` impact eligibility, not only in legality. Otherwise a self-Shelter would install and then never reduce anything. The preview fact must use the same function.
- "Stationary-versus-roaming rotatable enemies" cannot be tested before P16. That case moved to P16 criterion 5.
- The no-stacking rejection code (`illegal-target`) and its order after the identity check are decided, so the existing collision test passes unedited.
- Shelter's amount lives in `DEFAULT_DAMAGE_RULES` (P06 owner) and flows into encounter rules. The draft did not say that patrol Shelter changes too.

## Non-goals and stop conditions

Out of scope: a third ability, ability trees, cooldowns, combo marks, generic reach, a healing economy, boss immunities, and enemy retuning.

Stop and report when:

- an expected-unedited suite fails;
- protection or control stay strictly dominated in tested encounters (report the dominated outcomes before adding complexity);
- a protected path must change.

Record numeric adjustments separately. This revision is not the Brood's final identity.
