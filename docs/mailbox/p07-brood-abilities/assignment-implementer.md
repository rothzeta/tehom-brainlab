# Assignment P07-impl — Brood abilities (Implementer)

Role: `implementer` (follow `.agents/agents/implementer.md`).
Coordinator: Claude Coordinator session in the main checkout.

## Task and scope

Implement plan P07, [Brood abilities](../../plans/2026-10-02-f8938420-poc-001-brood-abilities.md): all its checkpoints, required contracts and numbered acceptance criteria. P07 owns the six player ability effects and their numeric defaults. Resolve each provisional default explicitly and record it in your report with value, source and reason.

- Workspace: `/opt/dev/tehom-brainlab-p07`, branch `p07-brood-abilities`, BASE `08dc630` (local `master`). Work and commit only here.
- Files you own: `poc-001-linked-formation/src/content/brood.ts`, `src/core/abilities.ts`, `tests/abilities.test.ts` (further P07-only test files are fine), the **minimal** extension of the P03 dispatcher/accounting the plan calls for, and the prototype `README.md` section on P07 public contracts.
- Reuse the P05 facing/protection/link/isolation selectors and the P06 damage, Shelter and lifecycle operations through their exports. Do not duplicate masks, targeting or damage math.
- Out of scope:
  - full encounter factories, enemy turns and the round loop (P08);
  - previews (P09);
  - UI and buttons (P10);
  - a generic ability-scripting system;
  - rules inside button handlers.
- Additive, backward-compatible changes to P03/P05/P06 types are allowed only where P07 genuinely needs them. All existing P01–P06 and two-ring tests must pass **unedited**.

## Known constraint (from the P06 handoff and review)

P03's `ActionRules.apply` returns only Brood data and cannot return enemy or effect collections. Ability effects operate on P06's `CombatState`, so they must be integrated with P03 action accounting (actor validation, once-per-actor spend, revision, atomic rejection) without breaking existing P03 behaviour. Choose the smallest design that keeps accounting in one place, explain it in your report, and keep the P03 accounting tests passing unedited.

## Context

- `docs/CURRENT.md` is current: P01–P06, the Compact triangle, and the two-ring board (19 cells, Compact `T[2o],T[2o+1],S[o]`, Spread corners, sectors over rings 1–2, enemies view-only at the centre).
- Read `docs/plans/README.md`, including its ownership table.
- Read the P07 plan, and check for amendments in it or its prerequisites.
- Read the prototype `README.md` public contracts.
- Read the handoffs `docs/mailbox/p06-damage-and-fallen/implementer.md` (CombatState, attack command, Shelter) and `docs/mailbox/p05-intent-semantics/implementer.md`.
- Tooling is Bun, in Docker by default. Run from the worktree root: `just poc-001-install`, `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build`. If Docker needs it, ask for sandbox escalation rather than switching to host mode.
- Testing follows ADR-0006 and the `ruach-testing` skill: write expectations independently of production code. New tests are yours to write; do not modify existing tests.

## Acceptance conditions

1. Every numbered P07 acceptance criterion is met, including six actions with no adjacency-created dead turns, with observable evidence mapped criterion by criterion.
2. Abilities are deterministic and pure (no input mutation). Illegal or ineligible uses reject atomically, with no spend and no state change.
3. The full suite, typecheck and build pass, and the existing tests are unedited.

## Verification

On your final committed candidate, run the focused P07 tests, the full `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build` and `git diff --check`. Record the exact commands, exit codes, counts and the tested revision. No browser check is required; do not claim one.

## Restrictions

- Do not edit `docs/CURRENT.md`, `docs/TASK_LOGS.md`, ADRs, the brief, plans or the plan index. Propose any corrections in your report.
- Do not merge, push, rebase, or delete branches or worktrees. Keep disposable files in the OS temp directory.

## Expected output

- Commit this assignment unchanged together with your report at `docs/mailbox/p07-brood-abilities/implementer.md`.
- The report starts with the `ruach-handoff` YAML block. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p07-brood-abilities/implementer.md --repo /opt/dev/tehom-brainlab-p07` until it reports `ok: true`.
- Reply with a terminal handoff: report path, report-creating SHA, technical candidate SHA, pass/fail summary, blockers.
