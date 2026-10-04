# Hand back reproducible patrol attempts and an evidence-based boss gate

## Status and authority

**P11. Draft; not implemented or verified.** Depends on [P10](2026-10-02-e7c77542-poc-001-playable-patrol.md). Baseline: `79f9498051df0281e6e9d3c904e9eee32f014873`.

Authority: [existing playtest template](../../docs/playtests/TEMPLATE.md), [brief Acceptance questions and Implementation order](../../docs/prototypes/poc-001-linked-formation.md), and [direction ADR Promotion rule](../adr/0004-repository-and-poc-direction.md). The export format and explicit boss gate are proposed implementation details. The [index](README.md) records local ADR authority and draft status.

Delivery sequence: [P01–P12 index](README.md). Governing format: [ADR-0002](../adr/0002-plan-filenames.md) and [ADR-0003](../adr/0003-implementation-plan-writing.md).

Task `P11` owner and integration owner: POC 001 implementer, currently unassigned. This plan is one standalone task; its sequential checkpoints inherit the prerequisites, affected components, acceptance criteria, verification, and hand-back defined here. Checkpoint identifiers remain stable on edits. The Coordinator records actual execution in [TASK_LOGS](../TASK_LOGS.md) from the implementer's mailbox handoff; no execution evidence exists yet.

## Smallest useful outcome

A tester can export one exact patrol attempt, a developer can replay it against the same rules, and a review can distinguish actual decisions/defects from enthusiasm or speculation. A negative finding is a valid hand-back; this plan does not require declaring the combat successful.

## Starting source and ownership

Own proposed `src/core/run-record.ts`, a local export control, `scripts/replay-run.ts` or equivalent, and `tests/run-record.test.ts`. Use P10's accepted-command stream and P08's factories without adding analytics infrastructure. Actual observations belong in new files under `docs/playtests/`, based on the existing template; do not overwrite that template. This plan introduces no root telemetry service.

## Fixture and inputs

Use at least one actual attempt for each patrol preset, plus two deterministic command traces from P08 and one deliberately malformed/version-mismatched record. Use anonymous session labels; record whether the tester is the implementing developer rather than implying independent research.

Proposed record version 1 contains: prototype ID; exact build commit when known, otherwise explicitly unknown; rules version; fixture ID and numeric configuration snapshot; initial serialized core state; ordered accepted commands with revisions; and final state/event summary. Include optional separately entered observations, but no inferred quotes, personal identifiers, wall-clock data needed for replay, or credentials.

## Contracts and decisions

### Required contracts

A record must distinguish actual accepted commands from rejected inputs and UI selections. Replaying a valid record under its matching rules reproduces final state and event order. Reset begins a new attempt, never appends to the previous attempt's commands. Unsupported versions or malformed commands produce explicit failure, not silent correction or execution of supplied code.

Observations, tester explanations, defect reports, and interpretations stay separate. A bug-contaminated run is identified as such. Automated correctness tests do not establish enjoyment, audience preference, or superiority to Apex/Shadow.

### Settled choices

Evaluate ordinary encounters and wounded starts before relying on the boss. Look for changed target priority/ability order, purposeful maneuver or hold decisions, automatic formation loops, and turns without worthwhile contribution. A later fair comparison with the old combat remains necessary before selecting production combat.

### Proposed implementation and review gate

Export JSON locally with no network transmission. Provide a local replay command, proposed as `just poc-001-replay <record-path>`, using the same public reducer. Validate the record schema and rules version; return a useful first-divergence report. Do not build browser import, migrations, or a replay timeline.

For each preset, record build/conditions, the player's reason for key decisions when actually obtained, unused/unavailable-action incidents, target order, meaningful holds, and whether the player would retry differently. Missing explanations are marked `not obtained`; never supply plausible quotations.

Add a review field `boss gate: open | hold` with evidence references. Proposed opening condition: actual patrol records show purposeful formation-dependent choices without unresolved preview/legality defects or obligatory useless turns, and the reviewer explicitly authorizes boss work. A rote loop, dominant obvious sequence, unclear UI, or insufficient evidence keeps the gate on hold. This is a human review decision, not a numeric fun score or automatic metric threshold. Plan completion can produce a hold decision.

## Implementation checkpoints

1. **P11.C1** — Capture/export one session's accepted inputs and fixture/rules context; reset creates a clean record.
2. **P11.C2** — Add the deterministic local replay verifier and malformed/version-mismatch tests.
3. **P11.C3** — Run actual attempts for all three starts using P10; save factual notes through the existing report structure.
4. **P11.C4** — Separate implementation defects from design findings and write an explicit open/hold gate decision with the tested commit.

## Acceptance criteria

1. Exporting and replaying each deterministic fixture trace produces exactly the recorded final state and event order under matching rules.
2. A reset yields a new record containing none of the previous attempt's commands; rejected actions are never treated as successful replay inputs.
3. Malformed commands or an unsupported rules/record version fail with a specific reason and do not trigger arbitrary file/network/code execution.
4. A review artifact identifies the actual build, configuration, and all three starting conditions, including any runs blocked by defects.
5. The artifact separates observed choices, actual tester explanations, and interpretation; it contains no invented player quotations or unsupported claims of enjoyment.
6. The boss gate is explicitly open or hold with evidence and reviewer attribution by role/session label; absent or inconclusive evidence cannot silently open it.
7. The report states that no fair Apex/Shadow comparison or production-combat selection has been completed by this plan.

## Verification and hand-back

Return exact executed commands, results, acceptance evidence, and limitations in the implementer's [mailbox](../mailbox/README.md) handoff; the Coordinator then records them in [TASK_LOGS](../TASK_LOGS.md), links that entry here, and updates [CURRENT](../CURRENT.md) when implementation facts change. The commands below remain proposed until their prerequisites supply them.

Run `just poc-001-test tests/run-record.test.ts tests/patrol.test.ts`, `just poc-001-typecheck`, and the actual local replay command on saved attempts. Record exact results and first-divergence output from a deliberately altered record. Hand back the records, factual playtest report, open/hold decision, and one bounded next revision supported by findings. Do not count preparing empty templates as conducting a playtest.

## Non-goals and stop conditions

No analytics backend, user tracking, accounts, automated fun scoring, campaign, statistical audience study, or old-combat implementation. Stop once attempts are reproducible and the gate decision is documented. If no tester/run is available, deliver the capture capability and mark the evidence/gate blocked; do not authorize P12 by assumption.
