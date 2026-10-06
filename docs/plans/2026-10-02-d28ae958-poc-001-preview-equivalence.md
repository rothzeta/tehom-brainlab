# Make combat previews immutable and equivalent to the action actually committed

## Status and authority

**P09. Implemented, independently reviewed (R1/R2 fixed and re-reviewed; no remaining findings), accepted, locally delivered.** [Implementation](../mailbox/p09-preview-equivalence/implementer.md), [fix](../mailbox/p09-preview-equivalence/fix.md), [review](../mailbox/p09-preview-equivalence/reviewer.md). Depends on [P04](2026-10-02-9d81c6df-poc-001-formation-lab.md) and [P08](2026-10-02-dc6612ec-poc-001-patrol-round-loop.md), including their core prerequisites. Baseline: `79f9498051df0281e6e9d3c904e9eee32f014873`.

Authority: [AGENTS](../../AGENTS.md), [prototype architectural boundary](../../poc-001-linked-formation/README.md), and [brief Presentation requirements](../../docs/prototypes/poc-001-linked-formation.md). This extends the early formation-only preview, not a second rules implementation. The [index](README.md) and local ADRs below establish formatting authority.

Delivery sequence: [P01–P12 index](README.md). Governing format: [ADR-0002](../adr/0002-plan-filenames.md) and [ADR-0003](../adr/0003-implementation-plan-writing.md).

**Amended 2026-10-06 (planned, not implemented):** [P15](2026-10-06-6dcd120b-poc-001-two-phase-central-boss.md) computes the forecast for every registered encounter, not only the patrol, and excludes `boss-phase-changed` from `enemyEvents`. [P16](2026-10-06-27ca8f17-poc-001-enemy-repositioning.md) relocations appear in the forecast because it runs the real end phase.

Task `P09` owner and integration owner: POC 001 implementer, currently unassigned. This plan is one standalone task; its sequential checkpoints inherit the prerequisites, affected components, acceptance criteria, verification, and hand-back defined here. Checkpoint identifiers remain stable on edits. The Coordinator records actual execution in [TASK_LOGS](../TASK_LOGS.md) from the implementer's mailbox handoff; no execution evidence exists yet.

**Amended 2026-10-05:** End-phase forecast defect B2; see [Amendment RF](#amendment-rf-2026-10-05--end-phase-forecast).

## Amendment RF (2026-10-05) — End-phase forecast

**Status: design amendment, not yet implemented.** Trigger: AI playtest defect report ([scout-1 D1](../mailbox/ai-playtest-20261005/scout-1.md#defect-d1--end-phase-forecast-describes-a-further-resolution-without-saying-so)) and [P08 Amendment RF](2026-10-02-dc6612ec-poc-001-patrol-round-loop.md#amendment-rf-2026-10-05--enemies-on-tiles). Execution: [Ring formation task](2026-10-05-c6399cb6-poc-001-ring-formation.md) (bug B2).

- **B2, End-phase forecast.** Hovering End phase showed an Immediate line that matched the committed result, plus an "If end phase now" line with lower HP. Source reading at BASE `ef0e3b4` suggests a cause: `previewCommand` builds the forecast by applying `endPhase` to the candidate state. When the previewed command is itself `endPhase`, that resolves a second enemy phase, the next round's. This is a hypothesis. The implementer must first reproduce the defect from the [scout-1 attempt 2 record](../mailbox/ai-playtest-20261005/scout-1-attempt-2.json) (commands 1–3, then preview End phase) in a failing regression test, and confirm or replace the cause before fixing.
- **Contract.** Previewing `endPhase` shows that command's own resolution exactly once. It carries no further-phase forecast, and the interface shows no "If end phase now" line for it. The forecast type may gain an explicit kind for this case (proposed `not-applicable`); the implementer documents the chosen shape in the prototype README. Forecasts for every other command are unchanged: one `endPhase` applied to the candidate.
- **Next marks.** No generic reach rule exists in this round (user decision, 2026-10-05: reach will be ability-specific), so next round's marks do not depend on the formation and no next-marks presentation is added.
- Protection gained/lost lists already come from the shared selectors, so they reflect enemy-tile fronts without change.

## Smallest useful outcome

For a proposed ability or maneuver, the player-facing model can show the exact immediate result and a clearly labelled forecast of ending the phase now, without changing the live battle or guessing future player choices.

## Starting source and ownership

Own proposed `src/core/preview.ts`, a read-only combat projection module, and `tests/preview.test.ts`. Extend P04's view adapter only where needed to consume the new projection. P10 owns full combat controls. P03/P08 remain the sole command/resolution path; do not put an alternate damage calculator in the preview layer.

## Fixture and inputs

Use the three patrol presets plus focused fixtures: Shelter before expansion; Impale becoming legal; an attack that defeats Warder; Crosswind changing protection and a synthetic turnable area; a fallen marked target; and a final-enemy kill.

Input is a frozen live snapshot, one command with its expected revision, and a session-generation identifier held by the UI. Include a stale preview after another action and a preview created before reset. Expected golden damage/recipient values must be hand-specified from P05–P08, not generated by preview itself.

## Contracts and decisions

### Required contracts

Preview invokes the same validation and transition as commit. It returns either the same immediate candidate state/events or the same rejection reason, and does not mutate the original snapshot or spend live budgets. Invalid commands never display successful consequences. A stale preview cannot be committed as though it described the current state.

### Settled choices

Previews must show destination positions, links, protection gained/lost, affected threats, and enabled/disabled abilities. Areas and marks remain visually distinguishable. The simulation decides exposure and legality; artwork does not.

### Proposed implementation

Return an immutable projection containing candidate positions/link states, immediate HP/status deltas, per-ability legality/reasons, declared-intent recipients, and change explanations. Derive these through existing core selectors after calling the public command transition on the snapshot.

Also include an explicitly conditional `if end phase now` forecast: call the same public end-phase transition on the candidate, then summarize its enemy-resolution events. Label the forecast with that exact condition; it does not predict unchosen remaining player actions or count next-round intentions as attacks already dealt. A terminal candidate has no further enemy forecast.

The UI retains the live revision and session generation used to calculate the preview. On another accepted command or reset, invalidate it and recompute on demand. Commit by submitting the original command against live state, not by assigning the cached preview state. Cancelling previews changes only ephemeral UI selection. No undo or branching timeline is needed.

## Implementation checkpoints

1. **P09.C1** — Implement a read-only projection over the existing public transition and selectors.
2. **P09.C2** — Add the conditional end-now forecast using P08 and separate its events from immediate effects.
3. **P09.C3** — Add golden fixtures for broken Shelter, removed protection, changed facing, and terminal cancellation.
4. **P09.C4** — Add revision/session invalidation at the P04 adapter boundary, then exhaustively compare preview and commit over the legal command matrix.

## Acceptance criteria

1. For each legal tested ability/maneuver, immediate preview state and events equal a real commit applied to an independent copy of the same starting snapshot.
2. Deeply frozen live input and its serialized bytes remain unchanged after repeated previews, forecasts, and cancellation.
3. Expanding after Shelter shows the same lost mitigation as actual impact; previewing a Warder kill removes its protection and pending action in the forecast.
4. Previewed recipient cells/marks and ability legality agree with independently specified fixtures, including Impale, Crosswind, and a fallen target.
5. `If end phase now` yields the same HP/terminal outcome as actually ending from the candidate state; it never claims to forecast unchosen actions.
6. An illegal command returns its rejection reason without deltas, and a preview from a stale revision or previous reset is invalidated before confirmation.
7. Previewing a final-enemy kill shows victory and no subsequent enemy damage; repeated previews produce no duplicate live events or audio triggers.

## Verification and hand-back

Return exact executed commands, results, acceptance evidence, and limitations in the implementer's [mailbox](../mailbox/README.md) handoff; the Coordinator then records them in [TASK_LOGS](../TASK_LOGS.md), links that entry here, and updates [CURRENT](../CURRENT.md) when implementation facts change. The commands below remain proposed until their prerequisites supply them.

Run `just poc-001-test tests/preview.test.ts tests/patrol.test.ts tests/intents.test.ts` and `just poc-001-typecheck`. Record the tested state/command matrix, golden examples, and mutation checks. In the lab, capture an actual preview/commit pair and its conditional forecast label. Distinguish unit equivalence from browser rendering correctness; P10 verifies the integrated display.

## Non-goals and stop conditions

No AI planner, optimal-move advice, Monte Carlo forecast, undo, saved branches, speculative network execution, or parallel damage formula. Stop at truthful single-command and end-now previews. A mismatch blocks playtesting; fix the shared rule or projection rather than hiding the affected number or weakening the acceptance criterion.
