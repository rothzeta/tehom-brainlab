# Assignment P05-impl — intent semantics (Implementer)

Role: `implementer` (follow `.agents/agents/implementer.md`).
Coordinator: Claude Coordinator session in the main checkout.

## Task and scope

Implement plan P05, [intent semantics](../../plans/2026-10-02-d66a7452-poc-001-intent-semantics.md): all its checkpoints, required contracts and numbered acceptance criteria. P05 owns the provisional defaults for sector masks, marks, cancellation, and active-link/isolation selectors; resolve each explicitly and record it (value, source, reason) in your report.

- Workspace: `/opt/dev/tehom-brainlab-p05`, branch `p05-intent-semantics`, BASE `0d6f2335` (= local `master` at assignment time). Work and commit only here.
- File ownership: `poc-001-linked-formation/src/core/intents.ts`, `src/core/sectors.ts`, `tests/intents.test.ts` (further P05-only test files are fine), and the prototype `README.md` section documenting P05 public contracts.
- Reuse P02 ring ordering (`src/core/formation.ts`, `hex.ts`) and P03 entity IDs/state (`src/core/state.ts`, `commands.ts`, `transition.ts`) through their exports. Additive, backward-compatible extensions to P03 state types are allowed only if P05 genuinely requires them; existing P02/P03 tests must keep passing unchanged. Do not implement damage application (P06), intention choice (P08), or rendering (P10).
- Do not touch `src/view/`, `src/main.ts`, or asset scripts: a parallel P04 task owns them on another branch.

## Context

- Read `docs/CURRENT.md` (P01–P03 status), the [plan index](../../plans/README.md) (including its "Ownership of provisional defaults" table), the plan itself, `poc-001-linked-formation/README.md`, and the P03 handoff `docs/mailbox/p03-command-boundary/implementer.md` and `reviewer.md` (open optional findings O1–O3; do not fix them here). Glance at the P06 plan (`docs/plans/2026-10-02-4c3c0d42-poc-001-damage-and-fallen.md`) only to make the recipient/protection selectors it consumes usable; do not implement P06.
- Tooling: Bun, Docker by default. Run from the worktree root: `just poc-001-install`, `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build`. Docker access may need sandbox escalation; ask for approval rather than switching to host mode.
- Testing follows `docs/adr/0006-contract-invariants-and-black-box-testing.md` and the `ruach-testing` skill. You own new tests. Do not modify existing P01–P03 tests.

## Acceptance conditions

1. Every numbered acceptance criterion in the P05 plan is met, with observable evidence mapped criterion-by-criterion in the report (both shapes × all six orientations, the plan's fixture list, facing wrap 5→0, zero-HP actor/target).
2. Selectors are pure and do not mutate inputs; masks/targeting are defined once for downstream consumers.
3. Full suite, typecheck, and build pass.

## Verification instructions

Run on your final committed candidate: focused P05 tests, full `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build`, `git diff --check`. Record exact commands, exit codes, test/assertion counts and the tested revision. No browser check is required for this headless slice; do not claim one.

## Restrictions

- Do not edit `docs/CURRENT.md`, `docs/TASK_LOGS.md`, plan files, or the plan index; propose corrections in your report.
- Do not merge into `master`, push, or delete branches/worktrees.
- Disposable files go to the OS temp directory, not the repository.

## Expected output

- Commit this assignment file unchanged together with your report at `docs/mailbox/p05-intent-semantics/implementer.md`.
- The report starts with the `ruach-handoff` YAML block (`.agents/skills/ruach-handoff/SKILL.md`): candidate/tested revision, changed paths, verification, discoveries, blockers. Run its validator (`bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p05-intent-semantics/implementer.md --repo /opt/dev/tehom-brainlab-p05`) and fix until `ok: true`.
- Reply with a concise terminal handoff: report path, report-creating SHA, technical candidate SHA, pass/fail summary, blockers.
