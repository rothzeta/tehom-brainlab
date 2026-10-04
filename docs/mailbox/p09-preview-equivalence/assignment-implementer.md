# Assignment P09-impl — preview equivalence (Implementer)

Role: `implementer` (follow `.agents/agents/implementer.md`).
Coordinator: Claude Coordinator session in the main checkout.

## Task and scope

Implement plan P09, [preview equivalence](../../plans/2026-10-02-d28ae958-poc-001-preview-equivalence.md), including any amendments in it or its prerequisites. That covers all of its checkpoints, required contracts and numbered acceptance criteria.

The outcome: combat previews match real transitions without mutation. P09 owns these provisional defaults: preview projection, conditional forecast, and stale-session handling. Resolve each one explicitly and record its value, source and reason.

- Workspace: `/opt/dev/tehom-brainlab-p09`, branch `p09-preview-equivalence`, BASE `35586e8` (local `master`). Work and commit only here.
- File ownership:
  - `poc-001-linked-formation/src/core/preview.ts` (read-only combat projection);
  - `tests/preview.test.ts` and any further P09-only tests;
  - the P04 view adapter, only where it must consume the projection;
  - the P09 section of the prototype `README.md`.
- **P03/P08 remain the only command and resolution path.** Do not put an alternate damage calculator or rules copy in the preview layer. A preview must be produced by the real transition on an isolated copy, or by an equivalent proven mechanism, and must never mutate live state.
- Out of scope: full combat controls and the playable interface (P10).
- Existing P01–P08 and two-ring tests must pass **unedited**, including P04 `browser-lab.mjs`. Additive, backward-compatible type changes are allowed only where genuinely needed.

## Context

- `docs/CURRENT.md`: current through P08 and the two-ring board.
- `docs/plans/README.md`: includes the ownership table.
- The P09 plan and the prototype `README.md` public contracts.
- Handoffs: `docs/mailbox/p08-patrol-round-loop/implementer.md` (round loop, `endPhase`, transcripts), `docs/mailbox/p07-brood-abilities/implementer.md`, and `docs/mailbox/p04-formation-lab/implementer.md` (lab session and the browser check command).
- Tooling: Bun, with Docker by default. Run `just poc-001-install`, `just poc-001-test`, `just poc-001-typecheck` and `just poc-001-build`, then preview and run the headless Chrome check. Request escalation for Docker; do not switch to host mode.
- Testing follows ADR-0006 and `ruach-testing`. Equivalence tests should compare preview output against the real transition across a representative set of commands and states, including rejection and stale cases, rather than against hand-copied numbers. Do not freeze provisional defaults; use explicit inputs where arithmetic depends on tuning.

## Acceptance conditions

1. Every numbered P09 acceptance criterion is met, with observable evidence mapped to each criterion.
2. Previews never mutate inputs or live state. Stale sessions are detected as the plan specifies.
3. Run the full suite, typecheck and build. If you changed any view code, also run the P04 browser check. If the plan's criteria include a browser-visible preview, add a browser assertion for it and inspect a screenshot yourself.

## Verification

On your final committed candidate, run:

- focused P09 tests;
- full `just poc-001-test`, `just poc-001-typecheck` and `just poc-001-build`;
- the browser check, as above;
- `git diff --check`;
- an unedited-tests check against BASE.

Record exact commands, exit codes, counts and the tested revision. Do not claim a human playtest.

## Restrictions

- Do not edit `docs/CURRENT.md`, `docs/TASK_LOGS.md`, ADRs, the brief, plans or the index. Propose corrections in your report instead.
- Do not merge, push or rebase, and do not delete branches or worktrees. Keep disposable files in the OS temp directory.

## Expected output

Commit this assignment unchanged with your report at `docs/mailbox/p09-preview-equivalence/implementer.md`. The report starts with the `ruach-handoff` YAML block. Run the validator with `--repo /opt/dev/tehom-brainlab-p09` until it reports `ok: true`.

Terminal handoff: report path, report-creating SHA, technical candidate SHA, pass/fail summary, and blockers.
