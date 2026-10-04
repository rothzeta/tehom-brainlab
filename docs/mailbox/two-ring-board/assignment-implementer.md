# Assignment TR-impl — two-ring board (Implementer)

Role: `implementer` (follow `.agents/agents/implementer.md`).
Coordinator: Claude Coordinator session in the main checkout.

## Task and scope

Implement task TR, [two-ring board](../../plans/2026-10-04-d005e5f4-poc-001-two-ring-board.md): checkpoints TR.C1–TR.C4 and every acceptance criterion. The design is accepted by the user (2026-10-04):

- a 19-cell arena (centre plus rings 1 and 2);
- Compact `T[2o], T[2o+1], S[o]` (sector-aligned, Pazuzu on ring 1);
- Spread on the corners `T[2o], T[2o+4], T[2o+8]`, distance 4;
- `CLOSE_THRESHOLD` and `SPLASH_RADIUS` stay 2;
- `sectorCells(s) = T[2s], T[2s+1], S[s]`;
- enemies view-only at the centre.

Do not reopen these. If implementation shows a design contract is wrong, stop and report.

- Workspace: `/opt/dev/tehom-brainlab-tworing`, branch `two-ring-board`. Start from the current branch HEAD, which holds the Architect's design commits on BASE `0a48098ff439bc84df06f5f8e965531d69e0dba2`. Work and commit only here.
- File ownership is as listed in the TR plan's "Starting source and ownership", plus the prototype `README.md` public contracts.
- **Test-update exception:** change existing tests only as enumerated in the TR plan's "Required test updates (explicit exception)" section. Each change must replace an expectation that encodes the radius-3 or CT geometry with an independently written expectation for the new board. Never weaken or delete coverage. Suites the plan says must pass unedited (P06 damage and the others it names) must not be edited. Report any other failing test as a discovery; do not edit it.

## Context

Read the TR plan, the amended brief `docs/prototypes/poc-001-linked-formation.md`, the TR amendments in the P02/P04/P05/P06 (and later) plans, and the Architect report `docs/mailbox/two-ring-board/architect.md`. The prior CT implementation report `docs/mailbox/compact-triangle/implementer.md` shows the browser-check command and prior changes.

Tooling is Bun, in Docker by default. From the worktree root run `just poc-001-install`, `just poc-001-test`, `just poc-001-typecheck` and `just poc-001-build`, then the preview plus the headless Chrome check `poc-001-linked-formation/tests/browser-lab.mjs`. Request sandbox escalation for Docker rather than switching to host mode. Testing follows ADR-0006 and `ruach-testing`.

## Acceptance and verification

Meet every TR acceptance criterion and map each one to observable evidence. On your final committed candidate, run the plan's verification section:

- the full suite, typecheck and build;
- the browser check at 1280×800, including token hit tests;
- an inspection of screenshots of Compact and Spread that you make yourself;
- `git diff --check`.

Record exact commands, exit codes, counts and the tested revision. Keep one Compact and one Spread screenshot as evidence under `docs/mailbox/two-ring-board/`. Do not claim a human playtest.

## Restrictions

- Do not edit `docs/CURRENT.md`, `docs/TASK_LOGS.md`, ADRs, the brief, plans or the plan index; propose corrections in your report.
- Do not merge into `master`, push, rebase, or delete branches or worktrees. Keep disposable files in the OS temp directory.

## Expected output

- Commit this assignment unchanged with your report at `docs/mailbox/two-ring-board/implementer.md`.
- Start the report with the `ruach-handoff` YAML block. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/two-ring-board/implementer.md --repo /opt/dev/tehom-brainlab-tworing` until it returns `ok: true`.
- Terminal handoff: report path, report-creating SHA, technical candidate SHA, pass/fail summary, every changed pre-existing test with its reason, and blockers.
