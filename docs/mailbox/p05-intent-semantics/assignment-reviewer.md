# Assignment P05-review — intent semantics (Reviewer)

Role: `reviewer` (follow `.agents/agents/reviewer.md`).
Coordinator: Claude Coordinator session in the main checkout.

## Change under review

- Workspace: `/opt/dev/tehom-brainlab-p05`, branch `p05-intent-semantics`.
- Range: BASE `0d6f23368f3cf21d1d14bc9bf0e8be34c0daff12` .. technical candidate `a95944723194b07f050f44e760f0f752df068ed7`. Commit `c95f6b8dd3d86b9666e6872050a895bece3d9d69` adds only the Implementer report and assignment.
- Changed technical paths: `poc-001-linked-formation/src/core/intents.ts`, `src/core/sectors.ts`, `tests/intents.test.ts`, `README.md` (P05 section).
- Implementer handoff: `docs/mailbox/p05-intent-semantics/implementer.md` (criterion mapping, resolved defaults, discoveries).

## Acceptance conditions to judge

1. Every numbered acceptance criterion and required contract in the [P05 plan](../../plans/2026-10-02-d66a7452-poc-001-intent-semantics.md) is actually met by the code, with tests that assert observable contracts per `docs/adr/0006-contract-invariants-and-black-box-testing.md` (expectations independent of production code; no tautological assertions).
2. Selectors are pure, do not mutate inputs, and define masks/targeting once for downstream consumers (P06 damage, P08 intentions, P10 rendering) without duplicating P02/P03 logic.
3. Resolved provisional defaults stay inside P05's ownership (sector masks, marks, cancellation, active-link/isolation selectors) and do not silently decide P06/P07/P08-owned rules.
4. No P01–P03 source or test changed; scope stays within the listed paths.
5. Full suite, typecheck and build pass at the candidate.

## Verification instructions

Independently run at `a959447` (or the report commit `c95f6b8`, whose technical content is identical — confirm that): `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build`, `git diff --check 0d6f233..a959447`. Use Docker mode (`just poc-001-install` first if needed); request sandbox escalation for Docker rather than switching to host mode. Record exact commands, exit codes, counts and the tested revision. Do not modify source or tests; you may run disposable probes outside the repository (OS temp dir).

## Restrictions

- Do not edit any file other than your report. Do not edit `docs/CURRENT.md`, `docs/TASK_LOGS.md`, plans or index.
- Do not merge, push, rebase, or delete branches/worktrees.

## Expected output

- Commit this assignment unchanged together with your report at `docs/mailbox/p05-intent-semantics/reviewer.md` on this branch.
- The report starts with the `ruach-handoff` YAML block: reviewed revision, tested revision, verification, review outcome. List findings classified **blocking** vs **optional**, each with file:line, the concrete failure scenario and evidence. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p05-intent-semantics/reviewer.md --repo /opt/dev/tehom-brainlab-p05` until `ok: true`.
- Reply with a concise terminal handoff: report path, report-creating SHA, verdict, count of blocking/optional findings.
