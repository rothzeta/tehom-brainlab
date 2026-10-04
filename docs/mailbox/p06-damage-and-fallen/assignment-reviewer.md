# Assignment P06-review — damage and Fallen (Reviewer)

Role: `reviewer` (follow `.agents/agents/reviewer.md`).
Coordinator: Claude Coordinator session in the main checkout.

## Change under review

- Workspace: `/opt/dev/tehom-brainlab-p06`, branch `p06-damage-and-fallen`.
- P06 technical candidate: `04bd6a28bd21f5248cd18de59cbf5efbc408b6a1` .. `2be2d85c3395ada92f88bd4edd0f0b23d32930ea`.
- Combined revision to review: `cad6168da387ed75b200c25ee5cc5d7081f534b9` = merge of P06 (`27b3be6`) with delivered master `8f8c9e47859262401c189dd0d623bed09a5aeb30` (P04 and P05, already reviewed and delivered — review them here only for integration correctness and compatibility with P06's P03 changes). Commit `42e54d4` adds only the integration report/evidence.
- Changed technical paths (P06): `poc-001-linked-formation/src/core/damage.ts`, `src/core/lifecycle.ts`, `tests/damage.test.ts`, `README.md` (P06 section), and **additive changes to P03 core** `src/core/state.ts`, `src/core/commands.ts`, `src/core/transition.ts`.
- Handoffs: `docs/mailbox/p06-damage-and-fallen/implementer.md` (criterion mapping, resolved defaults, discoveries incl. a P07 accounting note) and `integration.md`.

## Acceptance conditions to judge

1. Every numbered acceptance criterion and required contract in the [P06 plan](../../plans/2026-10-02-4c3c0d42-poc-001-damage-and-fallen.md) is met at the combined revision, with tests asserting observable contracts per `docs/adr/0006-contract-invariants-and-black-box-testing.md` (expectations independent of production code).
2. Settlement is deterministic and pure; invalid IDs/amounts are rejected at the P03 command boundary before any state change; rejected attacks leave state unchanged.
3. P03 changes are genuinely additive and backward-compatible: existing P03 behavior, events, errors and tests unchanged; P04 lab and P05 selectors unaffected. P06 consumes P05 recipient/protection selectors without duplicating masks or targeting.
4. Resolved defaults stay within P06's ownership (hit batching, mitigation, Shelter consumption, Fallen slots, terminal precedence) and do not decide P07 (attack/Shelter creation, ability effects) or P08 (enemy order, round expiry, loop) rules.
5. Full suite, typecheck, build and P04's browser check pass at the combined revision.

## Verification instructions

Independently run at `cad6168` (or `42e54d4`, after confirming identical technical content): `just poc-001-install` if needed, `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build`, the P04 headless Chrome check (`tests/browser-lab.mjs`; exact command in `docs/mailbox/p04-formation-lab/implementer.md`), and `git diff --check 04bd6a2..2be2d85`. Use Docker mode; request sandbox escalation rather than switching to host mode. Record exact commands, exit codes, counts and the tested revision. Do not modify source or tests; disposable probes go in the OS temp dir.

## Restrictions

- Edit only your report. Do not edit `docs/CURRENT.md`, `docs/TASK_LOGS.md`, plans or index.
- Do not merge, push, rebase, or delete branches/worktrees.

## Expected output

- Commit this assignment unchanged together with your report at `docs/mailbox/p06-damage-and-fallen/reviewer.md` on this branch.
- The report starts with the `ruach-handoff` YAML block: reviewed revision, tested revision, verification, review outcome. List findings classified **blocking** vs **optional**, each with file:line, concrete failure scenario and evidence. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p06-damage-and-fallen/reviewer.md --repo /opt/dev/tehom-brainlab-p06` until `ok: true`.
- Reply with a concise terminal handoff: report path, report-creating SHA, verdict, count of blocking/optional findings.
