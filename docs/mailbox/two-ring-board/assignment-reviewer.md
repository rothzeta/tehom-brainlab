# Assignment TR-review — two-ring board (Reviewer)

Role: `reviewer` (follow `.agents/agents/reviewer.md`).
Coordinator: Claude Coordinator session in the main checkout.

## Change under review

- Workspace `/opt/dev/tehom-brainlab-tworing`, branch `two-ring-board`. Local `master` is `0a48098ff439bc84df06f5f8e965531d69e0dba2`, the branch BASE, so the branch is the combined candidate.
- The design was accepted by the user on 2026-10-04 and is docs only: `0a48098..ebc26d6`. It covers the brief, the TR amendments to the P02/P04/P05/P06 and later plans, the [TR plan](../../plans/2026-10-04-d005e5f4-poc-001-two-ring-board.md), the ADR-0004 amendment and the Architect report.
- Implementation under review: `ebc26d6..2e98a276a11c0ed7db117c34dd8374ce9d5c956d`. Commit `35774f0` adds only the Implementer report, its assignment and screenshots.

## Acceptance conditions to judge

1. Every TR acceptance criterion is met at `2e98a27`, with observable evidence.
2. The implementation matches the accepted design:
   - a 19-cell board;
   - Compact `T[2o], T[2o+1], S[o]`, links `[1,1,1]` Close;
   - Spread `T[2o], T[2o+4], T[2o+8]`, `[4,4,4]` Stretched;
   - thresholds of 2 unchanged;
   - `sectorCells(s) = T[2s], T[2s+1], S[s]`, partitioning the 18 ring cells, with the centre unmasked;
   - enemies view-only at the centre, with no selector reading enemy cells.
3. **Test-update exception, with a specific check.** The changed existing tests (`formation.test.ts`, `intents.test.ts`, `browser-lab.mjs`) may change only the expectations enumerated in the TR plan's "Required test updates" section, with independently written new expectations. Total instrumented assertions fell from 4,949 (CT) to 2,926. Determine whether every reduction comes from the smaller board, for example fewer cells or pairs enumerated, and not from removed or weakened contract coverage. Name any lost coverage as a finding. Suites the plan says must pass unedited must be unedited and passing.
4. There are no regressions in P03 commands, P04 lab interaction, P05 marks, protection or isolation, or P06 settlement. The prototype README contracts no longer mention 37 cells, `OUTER_RING`, radius 3 or the CT mid-side mapping.
5. The full suite, typecheck, build and browser check pass. Inspect the Compact and Spread screenshots yourself and confirm they show the 19-cell board, a Compact triangle against the middle, and a wide Spread on the corners.

## Verification instructions

Run these independently at `2e98a27`, or at `35774f0` after confirming identical technical content:

- `just poc-001-install` if needed;
- `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build`;
- the headless Chrome `tests/browser-lab.mjs` check, using the command in `implementer.md`;
- `git diff --check ebc26d6..2e98a27`.

Use Docker and escalate rather than switching to host mode. Record exact commands, exit codes, counts and the tested revision. Do not modify source or tests; put any probes in the OS temp directory.

## Restrictions

Edit only your report. Do not edit `docs/CURRENT.md`, `docs/TASK_LOGS.md`, ADRs, the brief, plans or the index. Do not merge, push, rebase, or delete branches or worktrees.

## Expected output

- Commit this assignment unchanged with your report at `docs/mailbox/two-ring-board/reviewer.md`.
- Start the report with the `ruach-handoff` YAML block. Classify each finding as **blocking** or **optional**, with file:line, a failure scenario and evidence. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/two-ring-board/reviewer.md --repo /opt/dev/tehom-brainlab-tworing` until it returns `ok: true`.
- Terminal handoff: report path, report-creating SHA, verdict, and the count of blocking and optional findings.
