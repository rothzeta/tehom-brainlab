task: BX-design
role: architect
status: complete
outcome: "P13–P17 adopted into the canonical plan set and made executable. P12 superseded by user decision with history kept. Brief and ADR-0004 amended for 2026-10-06. Drafts corrected against source; records reject old versions explicitly; encounters selected by ?play=; P13∥P14 and P16.C1∥P15 allowed, otherwise sequential."
baseline: 71cc26c8c2796711ef865463a2264c289b78550e
artifacts:
  - docs/mailbox/boss-experiments/architect.md
  - docs/mailbox/boss-experiments/assignment-architect.md
  - docs/plans/README.md
  - docs/plans/README-boss-experiments.md (removed; content folded into README.md)
  - docs/plans/2026-10-06-e8cec63d-poc-001-split-maneuver-budgets.md
  - docs/plans/2026-10-06-6a0ebcdc-poc-001-tactical-kit-revision.md
  - docs/plans/2026-10-06-6dcd120b-poc-001-two-phase-central-boss.md
  - docs/plans/2026-10-06-27ca8f17-poc-001-enemy-repositioning.md
  - docs/plans/2026-10-06-79371edf-poc-001-roaming-boss-and-adds.md
  - docs/plans/2026-10-02-a18d7fe6-poc-001-directional-boss.md (supersession note)
  - docs/plans/2026-10-02-825a6700-poc-001-reproducible-playtests.md (gate-lift and record notes)
  - docs/plans/2026-10-02-{2dfffcd3,d66a7452,4c3c0d42,f8938420,dc6612ec,d28ae958,e7c77542}-*.md (one-line 2026-10-06 pointers)
  - docs/prototypes/poc-001-linked-formation.md
  - docs/adr/0004-repository-and-poc-direction.md
corrections:
  - "P13: the draft omitted src/core/transition.ts, which owns the allowance check, the spend and the actor-accounting copy. Error code maneuver-used and RECORD_VERSION 1 kept; the import-UI criterion replaced by the replay CLI's explicit error."
  - "P14: self-Shelter needs damage.ts impact eligibility, not only legality, plus the same function in preview facts. The default Shelter amount lives in DEFAULT_DAMAGE_RULES and changes patrol Shelter too. The no-stacking code is illegal-target, after the identity check. The roaming-rotatable case moved to P16."
  - "P15: computed that the drafted facing cadence lets a static formation dodge every primary in each phase (X-H1/X-H2); kept as written, with the lever recorded. Added missed consumers: the patrol-only forecast and patrolRules facts in preview.ts, transition.ts dispatch on patrolVersion, the hard-coded warder lookup in CombatScene, and token images keyed by entity ID. Follow-up 2026-10-06: the user applied the lever; P15 amended and recomputed."
  - "P16: no version bump is needed, as argued in the plan. Living-only occupancy needs a corpse-sharing hit-test rule. The diagnostic encounter is a test-only fixture."
  - "P17: Warder, Censer and boss facings were unspecified (defaults 4, 0, 0). Computed the route: with both adds alive the boss oscillates (1,1)/(-1,2) and the ward blinks. The sweep is always dodgeable with one maneuver. The victory predicate must live in settleLifecycle because replay calls applyAbility directly."
  - "All five: added affected-file tables, protected paths, ordered checkpoints, enumerated test exceptions (P13 and P14 only; P15–P17 none), suites expected to pass unedited, bare verification, screenshot lists and a no-frozen-tuning criterion."
  - "Recomputed and confirmed: 120° spacing in both shapes; the centre two-sector front holds exactly one Brood in all 72 cases; pulse and sector parity; ENEMY_CELLS[1..6] is the clockwise route; edge-slot distances 2/3/4; ward range 2 covers only the adjacent slots of the Warder at (-2,1)."
record_compatibility: "Old records are rejected with 'unsupported rules version' and never migrated; they stay replayable at their embedded build. RECORD_VERSION stays 1. The rules version selects the encounter codec: patrol v3/patrol-v2/p07-v1 after P13, then p14-v1 after P14; crucible-v1 at P15; collector-v1 at P17. P16 changes no version."
encounter_selection: "?play=patrol|crucible|collector, chosen per page load; header links keep placeholder=1; per-encounter preset selector; other play values open the lab; no new ?preview= value; diagnostic boss states only through intercepted tests/browser fixtures."
sequencing: "P13 → P14 → P15 → P16 → P17. P13∥P14 may run on separate branches (disjoint source owners; shared README, abilities.test.ts, CombatScene.ts and the rf-contracts literal, all with disjoint hunks), integrated one after the other with re-verification. P16.C1 may overlap P15. Everything else is sequential, because of run-record.ts, CombatScene.ts, rounds.ts, state.ts, encounters.ts and preview.ts."
open_questions:
  - "Q1 RESOLVED (user decision, 2026-10-06): lever applied. The Crucible facing advances only on beat-B declarations. Recomputed: no formation dodges every primary in either phase. See Follow-up: Q1 lever."
  - "Q2 Collector facings. Default: Warder 4, Censer 0, boss 0 initially. Provisional."
  - "Q3 Encounter routes and presets. Default: ?play= as above. Provisional."
  - "Q4 Emblems. Default: Crucible and Collector both use foundry-mechanism with distinct labels. Provisional."
  - "Q5 Spent-category code. Default: keep maneuver-used. Provisional."
  - "Q6 Shelter stacking. Default: illegal-target, after the identity check. Provisional."
  - "Q7 Phase-two comparison. Default: living boss with hp ≤ phaseTwoAt (30). Provisional."
  - "Q8 Corpse cells. Default: a living token draws on top and stays selectable. Provisional."
verification:
  - "Follow-up: recomputed the Crucible with the lever (disposable script in session scratch): no static dodger in phase one (16 announcements) or in phase two (entry at announcements 2–7 and the diagnostic start); zero-damage paths and their maneuver counts; the self-guard front still holds one Brood in all 72 cases."
  - "Recomputed every geometric claim with a disposable Python script in session scratch (not committed): formation angles, 72 centre-front cases, pulse/sector/fork recipients over 12 formations, cadence parity, edge-slot distances, route oscillation, Warder front coverage, sweep dodgeability, same-facing origin examples."
  - "Link and anchor check script over all changed docs: only unresolved link was this report before it was written."
  - "git diff --check over the commit: clean (see report body)."
  - "No build, unit tests or browser run: documentation-only change."
review: not-run
discoveries:
  - "Proposed CURRENT/TASK_LOGS corrections for the Coordinator: CURRENT still says P12 draft, blocked by the HOLD gate. It should say P12 superseded by user decision (2026-10-06), P13–P17 accepted for implementation, and the boss gate lifted by user decision with the historical HOLD retained."
  - "The prototype README (implementer-owned) still says boss work needs human attempts and reviewer confirmation. P15's README update should replace that."
  - "The brief's status line still said RF was 'not yet implemented'; corrected here because RF is delivered per the plan index."
  - "tests/rf-contracts.test.ts:121 freezes the composite rules-version literal. P13 edit R1 composes it from PATROL_VERSION and BROOD_RULES_VERSION, so later kit bumps need no test edit."
blockers: []

# BX-design — Architect report

Assignment: [assignment-architect.md](assignment-architect.md). Baseline `71cc26c`. Branch `boss-experiments`, worktree `/opt/dev/tehom-brainlab-boss`. Not merged or pushed.

## Proposed design and rationale

The five drafts are kept in substance and made executable. Detailed contracts live in each plan; this report summarises.

- **P13 — split allowances.** Replace `maneuverUsed` with `rotationUsed` and `shapeChangeUsed`. A command checks and spends only its own category; abilities preserve both flags; the round boundary resets both. Error codes are unchanged. This is the smallest representation and keeps the rejection precedence.
- **P14 — kit.** Changes to content, legality and impact eligibility:
  - Shelter: 4, self or a Close ally, no stacking.
  - Impale: no bypass; one living Stretched partner is enough.
  - Crosswind is already correct, so only its tests and preview text change.
- **P15 — Crucible.** An explicit encounter registry and one shared end-phase skeleton. The patrol is refactored onto the skeleton only if its suites pass unedited. The Crucible content uses a role-by-kind damage lookup: a fixed area is primary, a mark is secondary. `phaseTwoPending` is the single phase selector. Routes are `?play=`, and record codecs are selected by rules version.
- **P16 — relocation.** An optional `mobile` trait and a pure `relocateEnemies`, called by the skeleton between `enemy-phase-ended` and the next announcement. Occupancy is checked among living enemies only. There is no product route; the Collector is the consumer.
- **P17 — Collector.** Content, an optional protection `range`, and an `objective` victory predicate in `settleLifecycle`. The predicate cannot live in the dispatcher, because replay bypasses it. The plan also holds the combined manual-test checklist.

Rationale: every new rule lives in its existing owner (P05 selectors, P06 lifecycle) as an additive optional field with delivered defaults. P15–P17 therefore need **no existing-test edits**, and their regressions are strong.

## Computed findings (the user's core complaint)

Each plan states these as hypotheses for the manual round.

- **Crucible, X-H1/X-H2.**
  - Beat-B sector parity never changes: facings 1, 3, 5, …. So Spread at an even orientation dodges every phase-one primary attack.
  - The phase-two fork's parity is fixed at phase entry, so one Compact parity dodges every phase-two primary.
  - Movement matters once per phase, not every round.
  - The cadence is kept as written by user decision 3. Lever, not applied: advance the facing only on beat-B declarations.
- **Collector, R-H1–R-H5.**
  - With both adds alive, the boss oscillates between `(1,1)` and `(-1,2)`, so the ward is out of range in odd rounds and in range in even rounds.
  - Killing the Warder frees the route, and the boss steps onto its corpse.
  - The sweep is always dodgeable with one maneuver: Expand from Compact, a rotation from Spread.
  - The Censer splash favours Spread, and rotating in Spread flips the ward-front parity. That is the intended positional trade-off.

## Affected components

- Source and tests: per-plan tables, with exact files and protected paths. Implementers edit those files, not this task.
- Changed here: the plan index, five plans, the P12 supersession, the P11 note, seven one-line pointers in owning plans, the brief and ADR-0004.

## Constraints, dependencies and risks

- The shared skeleton (P15) is the riskiest refactor. Its guard is that patrol suites pass unedited; the stop condition keeps the patrol end phase separate if they do not.
- P13 needs the largest test exception: about 40 mechanical edits, enumerated with line numbers at `71cc26c`. If P14 lands first, line numbers in `tests/abilities.test.ts` shift; the edits are identified by content and test name as well.
- Every-round allowances may make evasion easy. The plans record this as a finding to observe in the manual round, not a reason to restrict maneuvers.

## Implementation boundaries

No player walking, generic reach, cooldowns, extra abilities, shared engine, new art or retuning beyond the drafts. Implementers do not edit plans, ADRs, CURRENT or TASK_LOGS.

## Verification detail

- The geometry script lived only in session scratch. Every number cited in the plans comes from its output. The script's results are summarised in the `corrections` and `discoveries` fields above and stated in the plans' hypothesis sections.
- A link and anchor check ran over every changed Markdown file (GitHub slug rules).
- Validation: `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/boss-experiments/architect.md --repo /opt/dev/tehom-brainlab-boss`; the result is reported in the terminal handoff.

## Readiness

Ready for implementation. P13 and P14 can be assigned now; P15–P17 follow in order. No blockers. Q1 is resolved by user decision (see the follow-up below); Q2–Q8 have provisional defaults already applied.

## Follow-up: Q1 lever (2026-10-06)

**Decision (user, relayed by the Coordinator, 2026-10-06):** apply the lever. The Crucible's facing advances only on beat-B (directional) declarations, so the safe orientation keeps shifting within a phase. Q1 is resolved.

**Changes:**

- [P15](../../plans/2026-10-06-6dcd120b-poc-001-two-phase-central-boss.md):
  - the authority list records the user decision;
  - the facing rule now says beat A leaves the facing unchanged and beat B advances it one clockwise step from the current facing, including after a Crosswind turn;
  - the phase boundary keeps the current facing;
  - new acceptance criterion 8 asserts the cadence as a relation from controlled starting facings, not as copied absolute facings; the old criteria 8–9 become 9–10;
  - X-H1/X-H2 are restated, and X-H2a and X-H5 are added;
  - the review-correction entry is updated.
- [P17 checklist](../../plans/2026-10-06-79371edf-poc-001-roaming-boss-and-adds.md#combined-manual-test-checklist-user-round-after-p17) items 7 and 9, and the "Next" line, no longer offer the lever.
- The [plan index](../../plans/README.md#boss-experiments-p13p17) and the [brief's decision record](../../prototypes/poc-001-linked-formation.md#decision-record) record the follow-up decision.

**Recomputed** with a disposable script over 12 formations and 6 facings:

- **Cadence.** Without Crosswind, phase-one beat-B facings are 1, 2, 3, 4, 5, 0 at announcements 2, 4, 6, …. Their parity alternates. Because each formation holds one Brood in sectors `o`, `o+2` and `o+4`, every formation is hit by every other beat-B sector.
- **Phase one.** No formation dodges every primary over 16 announcements; before the lever, Spread at an even orientation did.
- **Phase two.** The fork alternates parity the same way. No formation dodges every phase-two primary, for phase entry at announcements 2–7 and for the diagnostic start; before the lever, one Compact parity did.
- **Is it still dodgeable?** Yes, by reacting. Avoiding every primary needs Spread in phase one and Compact in phase two (one shape change per phase), plus a rotation or a Crosswind on the boss before each beat-B attack after the first, about every second round. From Compact 0, phase one's 12 announcements take 1 shape change and 5 rotations. A whole fight with phase two entered at announcements 3–6 takes 2 shape changes and 6–7 rotations over 14–17 rounds.
- **The split allowance.** A zero-damage path never needs both categories in one round (X-H2a), so for the Crucible the split is a convenience.
- **Crosswind.** Turning the boss shifts a declared sector or fork by one, which flips its parity and also shifts later facings (X-H5).
- **Self-guard.** The front still holds exactly one Brood in all 72 cases; it now changes only on beat-B declarations.
