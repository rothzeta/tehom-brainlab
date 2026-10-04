# Assignment P06-fix-R1 — reject sparse recipient arrays (Implementer)

Role: `implementer` (follow `.agents/agents/implementer.md`). You implemented and integrated P06.

## Finding to fix

Blocking R1 in `docs/mailbox/p06-damage-and-fallen/reviewer.md` (review commit on this branch, reviewed revision `cad6168`): an attack command whose `recipientIds` contains holes (e.g. `new Array<string>(1)`, or `['ugallu', <hole>]`) passes ID and living-target validation because `every`/`some` skip holes, then settlement dereferences `undefined` at `src/core/damage.ts` (~lines 49, 60, 81) and throws a TypeError instead of returning the documented atomic rejection envelope `{ok:false, state, error, events:[]}`.

## Task

1. In `/opt/dev/tehom-brainlab-p06` on `p06-damage-and-fallen` (current HEAD includes the review report), fix the boundary so every logical array position, including holes, is validated before any damage computation. Keep duplicate and living-target checks and all other behavior unchanged. Check whether any other P06 command-boundary array input has the same hole-skipping pattern and fix it the same way if so (report what you checked).
2. Add regression tests in `tests/damage.test.ts` for a hole-only array and valid IDs mixed with one hole, through the public `applyCommand` boundary, asserting the ordinary rejection envelope (error code), same state identity, empty events and unchanged contents. Do not modify existing P01–P05 tests.
3. Verify on the committed fix: focused P06 tests, full `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build`, P04 headless Chrome `tests/browser-lab.mjs` check, `git diff --check`. Record exact commands, exit codes, counts and the tested revision.
4. Write `docs/mailbox/p06-damage-and-fallen/fix-r1.md` (ruach-handoff YAML first: fixed_revision, tested_revision, finding addressed, verification, blockers). Commit it with this assignment unchanged. Validate with `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p06-damage-and-fallen/fix-r1.md --repo /opt/dev/tehom-brainlab-p06` until `ok: true`. Do not edit the Reviewer's report or your earlier reports.

## Restrictions

No merge into `master`, push, rebase, or branch/worktree deletion. Do not edit `docs/CURRENT.md`, `docs/TASK_LOGS.md`, plans or index. Disposable files outside the repository.

## Expected output

Terminal handoff: report path, report-creating SHA, fixed/tested technical revision, check results, blockers.
