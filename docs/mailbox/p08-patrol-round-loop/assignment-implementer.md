# Assignment P08-impl — patrol round loop (Implementer)

Role: `implementer` (follow `.agents/agents/implementer.md`).
Coordinator: the Claude Coordinator session in the main checkout.

## Task and scope

Implement plan P08, the [patrol round loop](../../plans/2026-10-02-dc6612ec-poc-001-patrol-round-loop.md), including its **Amendment TR (2026-10-04)**. That means all of its checkpoints, required contracts and numbered acceptance criteria. P08 owns these provisional defaults: patrol HP, intention order, target ties, wounded presets and round cadence. Resolve each one explicitly and record it in your report with its value, source and reason. The outcome is to run the ordinary patrol headlessly through to victory or defeat.

- Workspace: `/opt/dev/tehom-brainlab-p08`, branch `p08-patrol-round-loop`, BASE `9976e9a` (local `master`). Work and commit only here.
- File ownership:
  - `poc-001-linked-formation/src/content/patrol.ts`, `src/core/rounds.ts` and `tests/patrol.test.ts`. Further P08-only test files are fine.
  - Registration of `endPhase` in P03's dispatcher. It currently returns unsupported. Keep the change minimal and backward-compatible.
  - The prototype `README.md` P08 public-contract section.
- Reuse the P05 selectors, P06 damage, Shelter, lifecycle and status operations, and P07 abilities through their exports. Do not duplicate targeting, damage or ability logic. Build three factory presets, not a procedural encounter system. P10 owns the playable interface.
- **Two-ring board (accepted user decision):** enemies have **no board cell**. The centre is a provisional, view-only anchor, and no selector reads enemy cells. Follow Amendment TR exactly.
- Existing P01–P07 and two-ring tests must pass **unedited**. Additive, backward-compatible type changes are allowed only where they are genuinely needed. One exception: if an existing test asserts that `endPhase` returns unsupported, you may update only that assertion, and you must report it explicitly.

## Context

- `docs/CURRENT.md` is current through P07 and the two-ring board.
- `docs/plans/README.md` contains the ownership table.
- Read the P08 plan and its amendment, and the prototype `README.md` public contracts.
- Read the handoffs `docs/mailbox/p07-brood-abilities/implementer.md` and `fix.md` (abilities and the combat accounting adapter) and `docs/mailbox/p06-damage-and-fallen/implementer.md`.
- Tooling: Bun, in Docker by default. Run `just poc-001-install`, `just poc-001-test`, `just poc-001-typecheck` and `just poc-001-build` from the worktree root. Request sandbox escalation for Docker rather than using host mode.
- Testing follows ADR-0006 and `ruach-testing`. Exact arithmetic that depends on provisional tuning must use explicit, test-owned inputs. Do not freeze provisional defaults; the P07 review blocked on exactly this.

## Acceptance conditions

1. Every numbered P08 acceptance criterion is met, with observable evidence mapped criterion by criterion. This includes a headless run of the ordinary patrol from each of its three starting presets through to victory or defeat.
2. The loop is deterministic and replayable. Illegal or stale commands reject atomically.
3. The full suite, typecheck and build pass, and existing tests are unedited (except for the single exception above).

## Verification

On your final committed candidate, run:

- the focused P08 tests;
- full `just poc-001-test`, `just poc-001-typecheck` and `just poc-001-build`;
- `git diff --check`.

Record exact commands, exit codes, counts and the tested revision. Include one actual executed headless patrol transcript (or a bounded excerpt) per preset as a durable artifact under `docs/mailbox/p08-patrol-round-loop/`. Never write transcripts by hand. Do not claim a browser check or human playtest.

## Restrictions

- Do not edit `docs/CURRENT.md`, `docs/TASK_LOGS.md`, ADRs, the brief, plans or the index. Propose corrections in your report.
- Do not merge, push, rebase, or delete branches or worktrees. Keep disposable files in the OS temp directory.

## Expected output

- Commit this assignment unchanged with your report at `docs/mailbox/p08-patrol-round-loop/implementer.md`. The report starts with the `ruach-handoff` YAML block.
- Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p08-patrol-round-loop/implementer.md --repo /opt/dev/tehom-brainlab-p08` until it reports `ok: true`.
- Terminal handoff: report path, report-creating SHA, technical candidate SHA, pass/fail summary, any edited existing test with its reason, and blockers.
