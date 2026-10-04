# Assignment CT-review — Compact triangle (Reviewer)

Role: `reviewer` (follow `.agents/agents/reviewer.md`).
Coordinator: Claude Coordinator session in the main checkout.

## Change under review

- Workspace `/opt/dev/tehom-brainlab-compact`, branch `compact-triangle`. Local `master` is `0f9c1b7d4d0ff01c4a890df8a8c4a4500737165e` = this branch's BASE, so the branch is the combined candidate.
- Design (docs only, accepted by the user 2026-10-04): `0f9c1b7..c30e8cc`, covering the brief, the P02/P04/P05/P06/P10 plan amendments, the new [CT plan](../../plans/2026-10-04-fb4bf201-poc-001-compact-triangle.md), the index, and the Architect report `architect.md`.
- Implementation under review: `c30e8cc..4fa7613f5c1b467377cef88bb89df5c30524a80d`. Commit `39cc86f` adds only the Implementer report, its assignment and screenshots (`implementer.md`, `compact-0.png`, `compact-4.png`).

## Acceptance conditions to judge

1. CT acceptance criteria 1–9 are met at `4fa7613`, with observable evidence.
2. The implementation matches the accepted design: Compact `R[3o+1]`, `R[3o+2]`, `T[2o+1]` (Pazuzu inward), all links distance 1, Spread unchanged, and sectors extended to rings 2–3 so the inward Brood is exposed and protected like its sector.
3. The test-update exception was used correctly. Changed existing tests (`formation.test.ts`, `intents.test.ts`, `browser-lab.mjs`) change only the old-line-geometry expectations enumerated in the CT plan's "Required test updates" section, with independently written new expectations and no weakened or deleted coverage. P06 damage and P03/P04 unit suites are unedited and pass.
4. No regressions in P03 command semantics, P04 lab interaction, P05 marks/protection/isolation, or P06 settlement. Prototype README contracts no longer claim outer-ring-only Brood or sectors.
5. Full suite, typecheck, build and browser check pass. Inspect the Compact screenshots yourself and confirm the formation visibly renders as a triangle, with every token selectable.

## Verification instructions

Independently run at `4fa7613` (or `39cc86f`, after confirming identical technical content): `just poc-001-install` if needed, `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build`, the headless Chrome `tests/browser-lab.mjs` check (see `implementer.md` for the exact command), and `git diff --check c30e8cc..4fa7613`. Use Docker mode and escalate rather than using host mode. Record exact commands, exit codes, counts and the tested revision. Do not modify source or tests; put disposable probes in the OS temp directory.

## Restrictions

Edit only your report. Do not edit `docs/CURRENT.md`, `docs/TASK_LOGS.md`, the brief, plans or index. No merge, push, rebase, or branch/worktree deletion.

## Expected output

- Commit this assignment unchanged with your report at `docs/mailbox/compact-triangle/reviewer.md`.
- The report starts with the `ruach-handoff` YAML block. Classify each finding as **blocking** or **optional**, with file:line, a concrete failure scenario and evidence. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/compact-triangle/reviewer.md --repo /opt/dev/tehom-brainlab-compact` until `ok: true`.
- Terminal handoff: report path, report-creating SHA, verdict, and the number of blocking and optional findings.
