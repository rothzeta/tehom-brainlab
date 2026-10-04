# Assignment CT-impl — Compact triangle (Implementer)

Role: `implementer` (follow `.agents/agents/implementer.md`).
Coordinator: Claude Coordinator session in the main checkout.

## Task and scope

Implement task CT, [Compact formation as a true triangle](../../plans/2026-10-04-fb4bf201-poc-001-compact-triangle.md): checkpoints CT.C1–CT.C4 and acceptance criteria 1–9. The design decisions in that plan and the amended brief/P02/P04/P05/P06 plans are accepted user decisions (2026-10-04): two Brood on the outer ring and Pazuzu on ring 2, the mid-side placement `R[3o+1]`, `R[3o+2]`, `T[2o+1]`, and sectors extended to rings 2–3 so the inward Brood is exposed and protected like its sector. Do not reopen them; if implementation shows a design contract is wrong, stop and report.

- Workspace: `/opt/dev/tehom-brainlab-compact`, branch `compact-triangle`. Start from the current branch HEAD, which contains the Architect's design commits on BASE `0f9c1b7d4d0ff01c4a890df8a8c4a4500737165e`. Work and commit only here.
- File ownership: as listed in the CT plan's "Starting source and ownership" (P02 formation algebra, P05 sectors, P04 lab view and browser check, prototype `README.md`).
- **Test-update exception:** you may change existing tests only as enumerated in the plan's "Required test updates (explicit exception)" section. Every such change must replace an expectation that encodes the old line geometry with an independently written expectation for the new geometry; never weaken or delete coverage. The P06 damage suite and P03/P04 unit suites must pass **without edits** (criterion 6). Any other existing test that fails is a discovery to report, not to edit.

## Context

Read the CT plan, the amended brief `docs/prototypes/poc-001-linked-formation.md`, the amendment sections in the P02/P04/P05/P06 plans, and the Architect report `docs/mailbox/compact-triangle/architect.md`. Delivered public contracts are in `poc-001-linked-formation/README.md`. Tooling: Bun, Docker by default, run from the worktree root: `just poc-001-install`, `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build`, preview plus the headless Chrome `poc-001-linked-formation/tests/browser-lab.mjs` (exact usage in `docs/mailbox/p04-formation-lab/implementer.md`). Request sandbox escalation for Docker rather than switching to host mode. Testing follows ADR-0006 and `ruach-testing`.

## Acceptance and verification

All nine CT acceptance criteria are met, mapped criterion-by-criterion with observable evidence. Run the plan's verification section on your final committed candidate: full test suite, typecheck, build, browser check at 1280×800 including the new pointer-selectability assertion, Compact screenshots that you inspect yourself, and `git diff --check`. Record exact commands, exit codes, counts and the tested revision. Keep one or two Compact screenshots as evidence under `docs/mailbox/compact-triangle/`. Unit tests do not substitute for browser evidence; claim no human playtest.

## Restrictions

- Do not edit `docs/CURRENT.md`, `docs/TASK_LOGS.md`, the brief, plans or plan index; propose corrections in your report.
- No merge into `master`, push, rebase, or branch/worktree deletion. Disposable files go in the OS temp directory.

## Expected output

- Commit this assignment unchanged with your report at `docs/mailbox/compact-triangle/implementer.md`.
- The report starts with the `ruach-handoff` YAML block. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/compact-triangle/implementer.md --repo /opt/dev/tehom-brainlab-compact` until `ok: true`.
- Terminal handoff: report path, report-creating SHA, technical candidate SHA, pass/fail summary, every changed pre-existing test with a reason, blockers.
