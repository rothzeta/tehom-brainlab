# Assignment P08-review — patrol round loop (Reviewer)

Role: `reviewer` (follow `.agents/agents/reviewer.md`).
Coordinator: Claude Coordinator session in the main checkout.

## Change under review

- Workspace `/opt/dev/tehom-brainlab-p08`, branch `p08-patrol-round-loop`. Local `master` is `9976e9a`, which is the branch BASE, so the branch is the combined candidate.
- Range `9976e9a..864e3d0b1b5bba68495bcdb2141f1892c9d75b2e`. Commit `ac8d0a2` adds only the Implementer report, assignment and executed transcripts.
- Handoff: `docs/mailbox/p08-patrol-round-loop/implementer.md`, which covers the criterion mapping, resolved defaults and transcripts.

## Acceptance conditions to judge

1. Every numbered acceptance criterion and required contract in the [P08 plan](../../plans/2026-10-02-dc6612ec-poc-001-patrol-round-loop.md) is met. This includes its **Amendment TR**: enemies have no board cell, the centre is view-only, and no selector reads enemy cells. Tests must assert observable contracts per ADR-0006. Exact arithmetic that depends on provisional tuning must use explicit, test-owned inputs and must not freeze defaults. Probe this by overriding defaults, as the P07 review did.
2. The loop is deterministic and replayable, uses atomic `endPhase`, and stops correctly on terminal outcomes. Intention announcement, ordering, ties, impact settlement and expiry match the plan. P05, P06 and P07 logic is reused, not duplicated.
3. The P03 `endPhase` registration and the additive `RoundEvent`/`PatrolState` overload are minimal and backward-compatible. Basic lab and non-patrol combat keep their unsupported behaviour. All existing tests are unedited and pass.
4. Defaults stay within P08 ownership and do not decide P09 (previews) or P10 (UI) rules.
5. The executed transcripts are genuine: replay them and confirm they match. The Implementer's interpretation must not overclaim: one wounded-Ugallu defeat trace does not show that the preset is unwinnable.
6. The full suite, typecheck and build pass at the candidate.

## Verification instructions

Run independently at `864e3d0`, or at `ac8d0a2` after confirming identical technical content:

- `just poc-001-install` if needed;
- `just poc-001-test`, `just poc-001-typecheck` and `just poc-001-build`;
- `git diff --check 9976e9a..864e3d0`;
- an unedited-tests check: `git diff --exit-code 9976e9a 864e3d0 -- poc-001-linked-formation/tests ':!poc-001-linked-formation/tests/patrol.test.ts'`.

Use Docker, and escalate rather than switching to host mode. Do not modify source or tests; put probes in the OS temp directory. Record exact commands, exit codes, counts and the tested revision.

## Restrictions

Edit only your report. Do not edit protected documents, plans or ADRs. Do not merge, push or rebase, and do not delete branches or worktrees.

## Expected output

Commit this assignment unchanged with your report at `docs/mailbox/p08-patrol-round-loop/reviewer.md`. Start the report with the `ruach-handoff` YAML block. Classify each finding as **blocking** or **optional**, giving file:line, a failure scenario and evidence. Run the validator with `--repo /opt/dev/tehom-brainlab-p08` until it reports `ok: true`. Terminal handoff: report-creating SHA, verdict, and the count of blocking and optional findings.
