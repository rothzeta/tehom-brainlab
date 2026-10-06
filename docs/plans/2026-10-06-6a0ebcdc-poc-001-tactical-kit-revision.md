# Six Brood abilities with distinct tactical responsibilities

## Status and authority

P14, draft in the [continuation](README-boss-experiments.md), after P13. The user requests a deep but bounded tactical review. Keeping six abilities and the specific revisions here are designer proposals. None are claims of balanced gameplay or already accepted mechanics.

## Smallest useful outcome

The existing trio can attack reliably, make protection worthwhile in a controlled case, and use facing control to change a consequential threat. A tooltip-only change or extra icons without different legal outcomes is insufficient.

## Starting source and ownership

Baseline `70b6ede002e6a09e31522d1343d29796672dfb28`. Inspected `src/content/brood.ts`, `src/core/abilities.ts`, `src/core/state.ts`, `src/core/sectors.ts`, `src/core/run-record.ts` and `src/content/patrol.ts`, all under the owning prototype. Impale currently deals 6 with bypass, requires exactly two living partners and two stretched links; Crosswind already accepts a direction and a rotatable target, while the patrol flags only Warder rotatable. Front masks already use enemy coordinates. Owners: unassigned Implementer and Coordinator-designated integration Implementer. Include damage/lifecycle, preview/record consumers and their tests only as needed.

## Fixture and inputs

Preserve the current kit as versioned baseline evidence, not a second runtime engine. Compare unprotected/protected targets, a 6-damage marked hit, compact/spread, self/ally Shelter, a fallen partner and stationary-versus-roaming rotatable enemies. Artificial target HP isolates outcomes; do not simultaneously retune the patrol. Reuse the six names and existing UI.

## Contracts and decisions

**Required:** one ability action per living Brood, deterministic outcomes, no adjacency-created empty turn, accurate legality/impact previews, unchanged invalid-command atomicity. Movement capability and ability to turn are separate: a central boss can remain anchored while its weapon facing is turnable. Crosswind does not relocate a target or change its movement destination.

**Proposed test kit:** Claw stays 4 ordinary damage. Sting stays 4 ordinary damage. Gale stays 3 and bypasses directional protection. Impale stays 6 from stretched links but loses protection bypass; it is a damage tool rather than also solving every guard. Its link requirement is at least one living allied partner and all active links to living partners Stretched, so one casualty does not mechanically disable it; a lone surviving Girtablilu uses Sting.

Shelter reduces the next positive incoming hit by up to 4, rather than 2. It may target Ugallu itself or a Close-linked living ally. An allied target must remain Close at impact; self-protection has no link prerequisite. Preserve one-hit consumption/expiry semantics rather than creating a reusable shield resource or full-phase armour. Avoid stacking: reject a second active Shelter on the same target without spending an action. An allied Shelter does not become effective again after its source falls.

Crosswind rotates a rotatable enemy by one chosen step and transforms only that source's explicitly turnable directional intentions. Fixed radial pulses and marks stay unchanged. The preview identifies what changes and what does not. Do not broaden it into stun, push, cancel and damage simultaneously.

These numbers/conditions are proposed defaults to ratify before implementation. Preserve P13 budgets. Version changed kit and record semantics; old records must not replay with new hard-coded bypass rules.

## Implementation checkpoints

P14-1: record the existing six outcomes and inspect hit consumption/self-target validation before altering them.

P14-2: implement revised Shelter and Impale contracts in their existing owners; prove ordinary attacks remain legal from every formation.

P14-3: exercise Crosswind with a turnable enemy-origin area fixture, update previews/tooltips/records and compare revised-kit patrol traces without changing enemy stats.

## Acceptance criteria

1. Against a 2-point guard, revised Claw/Sting/Impale deal 2/2/4 and Gale deals 3; turning the guard changes eligible contact damage through the real selector.
2. Shelter turns a 6-damage eligible hit into 2, is consumed once, expires normally, and cannot be stacked for repeated reductions.
3. Self-Shelter works when spread; allied Shelter fails to protect at impact after its link stretches or its source falls. Rejected casts spend nothing.
4. With one fallen partner and one living stretched link Impale is legal; with a Close living link or no living partner it is not. Sting remains available.
5. Crosswind changes an anchored enemy's facing/turnable attack without changing its cell; radial masks and marks remain unchanged.
6. Actual browser descriptions, legality, forecasts, resolution and new exported/replayed attempts agree. Existing patrol differences are documented as changed kit behavior, not hidden tuning.

## Verification and hand-back

Run the existing root test/typecheck/build/browser recipes and replay captured revised-kit attempts; focused cases are added to local suites. Supply baseline/revised traces, criterion mapping, exact commands/results, source revision and unresolved usefulness questions in `docs/mailbox/p14-tactical-kit-revision/implementer.md`. Automated usefulness fixtures establish an option's mechanical value, not that people enjoy it.

## Non-goals and stop conditions

No third ability, ability tree, cooldown, combo-mark system, generic reach rule, healing economy or boss immunity catalogue. If protection/control remain strictly inferior in tested encounters, report the dominated outcomes before adding complexity. Keep numeric adjustments separately recorded. Do not claim this small revision is the final authored identity of the Brood.
