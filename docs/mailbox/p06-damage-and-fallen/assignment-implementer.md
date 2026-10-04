# Assignment P06-impl — damage and Fallen (Implementer)

Role: `implementer` (follow `.agents/agents/implementer.md`).
Coordinator: Claude Coordinator session in the main checkout.

## Task and scope

Implement plan P06, [damage and Fallen](../../plans/2026-10-02-4c3c0d42-poc-001-damage-and-fallen.md): all its checkpoints, required contracts and numbered acceptance criteria. P06 owns the provisional defaults for hit batching, mitigation, Shelter consumption, Fallen slots and terminal precedence; resolve each explicitly and record it (value, source, reason) in your report.

- Workspace: `/opt/dev/tehom-brainlab-p06`, branch `p06-damage-and-fallen`, BASE `04bd6a28bd21f5248cd18de59cbf5efbc408b6a1` (local `master`, which includes delivered P05). Work and commit only here.
- File ownership: `poc-001-linked-formation/src/core/damage.ts`, `src/core/lifecycle.ts`, `tests/damage.test.ts` (further P06-only test files are fine), and the prototype `README.md` section documenting P06 public contracts.
- Consume P05 recipient/protection/active-link/isolation selectors (`src/core/intents.ts`, `sectors.ts`) and P02/P03 exports (`formation.ts`, `hex.ts`, `state.ts`, `commands.ts`, `transition.ts`). Do not duplicate masks or targeting. Additive, backward-compatible extensions to P03/P05 types are allowed only if P06 genuinely requires them; all existing P01–P05 tests must keep passing unchanged.
- Out of scope: creating attacks or Shelter statuses (P07), enemy order / round status expiry / combat loop (P08), rendering (P10). Do not touch `src/view/`, `src/main.ts`, or asset scripts: a parallel P04 task owns them on another branch.

## Context

- Read `docs/CURRENT.md`, the [plan index](../../plans/README.md) (including "Ownership of provisional defaults"), the P06 plan, `poc-001-linked-formation/README.md` (P03 and P05 public contract sections), and the handoffs `docs/mailbox/p05-intent-semantics/implementer.md` (resolved P05 defaults, `IntentContext` design) and `docs/mailbox/p03-command-boundary/implementer.md`. P03 review optional findings O1–O3 remain open; do not fix them here.
- The P06 plan requires invalid IDs/amounts to be rejected at the command boundary before state changes; integrate with P03's boundary conventions rather than inventing a parallel one.
- Tooling: Bun, Docker by default. From the worktree root: `just poc-001-install`, `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build`. Docker access may need sandbox escalation; ask for approval rather than switching to host mode.
- Testing follows `docs/adr/0006-contract-invariants-and-black-box-testing.md` and the `ruach-testing` skill: expectations independent of production code. You own new tests. Do not modify existing P01–P05 tests.

## Acceptance conditions

1. Every numbered acceptance criterion in the P06 plan is met, with observable evidence mapped criterion-by-criterion in the report, using the plan's fixture list (raw 5 vs HP 10; overkill 9 vs HP 2; two-point protection; Shelter Ugallu→Girtablilu; three-damage splash with Ugallu HP 2, Girtablilu/Pazuzu HP 10; final-enemy and final-Brood deaths).
2. Hit settlement is deterministic and pure (no input mutation); rejected attacks leave state unchanged.
3. Full suite, typecheck and build pass.

## Verification instructions

Run on your final committed candidate: focused P06 tests, full `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build`, `git diff --check`. Record exact commands, exit codes, test/assertion counts and the tested revision. No browser check is required for this headless slice; do not claim one.

## Restrictions

- Do not edit `docs/CURRENT.md`, `docs/TASK_LOGS.md`, plan files, or the plan index; propose corrections in your report.
- Do not merge into `master`, push, or delete branches/worktrees.
- Disposable files go to the OS temp directory, not the repository.

## Expected output

- Commit this assignment file unchanged together with your report at `docs/mailbox/p06-damage-and-fallen/implementer.md`.
- The report starts with the `ruach-handoff` YAML block (`.agents/skills/ruach-handoff/SKILL.md`): candidate/tested revision, changed paths, verification, discoveries, blockers. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p06-damage-and-fallen/implementer.md --repo /opt/dev/tehom-brainlab-p06` until `ok: true`.
- Reply with a concise terminal handoff: report path, report-creating SHA, technical candidate SHA, pass/fail summary, blockers.
