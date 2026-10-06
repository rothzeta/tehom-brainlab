# Assignment: `just poc-001-test-browser` covers every browser harness and exits cleanly (Implementer)

Role: `implementer` (follow `.agents/agents/implementer.md`).
Coordinator: the Claude Coordinator session in the main checkout.

## Problem

The user runs `just poc-001-test-browser` bare, as the browser regression check before a manual round. Two gaps:

1. **Missing harnesses.** The aggregator `poc-001-linked-formation/scripts/browser-checks.mjs` runs only the four original harnesses: lab, preview, patrol and run-record. P14–P17 each added a harness that workers ran separately, because their plans froze the runner:
   - `tests/browser-p14-kit.mjs`;
   - `tests/browser-crucible.mjs`;
   - `tests/browser-repositioning.mjs`;
   - the P17 Collector harness (find it in `tests/`).

   So the user's command does not exercise the bosses, the kit or relocation.
2. **Exit 130 at shutdown.** Several workers saw a non-PTY run exit 130 during preview shutdown after all suites passed. Examples are in `docs/mailbox/p14-kit-revision/implementer.md` and `docs/mailbox/p15-crucible/implementer.md`. PTY runs exit 0. The cause is unconfirmed.

## Task

1. Make `just poc-001-test-browser` run every browser harness under `tests/browser-*.mjs`. Use an explicit list or discovery, whichever reads better, and report per-harness assertion counts and a total.
   - Keep the existing Chrome discovery, the fresh build, and the managed preview server.
   - Prefer one preview server shared by all harnesses over a server per harness.
   - A harness may need its invocation adapted to the shared runner (argument order, base URL, output directory). Do not change any harness assertion.
2. Investigate the exit 130.
   - Find the cause, for example the signal handling or teardown order of the Docker-wrapped preview server, or how the runner kills the child.
   - Fix it in the runner or wrapper so that a non-PTY bare run exits 0 when every suite passes and non-zero when any fails.
   - Show the failure path still works: make one harness fail in a scratch copy and confirm a non-zero exit.
3. Update the prototype README's browser-check section to list what the command covers.

## Workspace

- Worktree `/opt/dev/tehom-brainlab-tball`, branch `test-browser-all`.
- BASE `6414332`, the P17 candidate. It is under independent review in parallel; the Coordinator will tell you if you need to merge fixes.
- Run `just poc-001-install` first if dependencies are missing.
- Port 4173 may be busy with another worker. Wait for it, and never stop another worker's container or process.

## Restrictions

- **Scope:** only the browser runner, the wrapper or recipe if needed for the exit-code fix, harness invocation plumbing, and the README. No product source changes. No edits to test assertions.
- **Do not edit** plans, `docs/CURRENT.md` or `docs/TASK_LOGS.md`. Do not merge or push.

## Verification (on your final commit)

Run every recipe from the repository root, bare: no `POC001_CHROME` or other hand-set env, and no manual build first.

- `just poc-001-test`
- `just poc-001-typecheck`
- `just poc-001-build`
- `just poc-001-test-browser`: **three consecutive non-PTY bare runs, each exit 0**, listing every harness with its count. Report each exit code.
- One PTY run.
- The scratch-failure check from task step 2.

## Expected output

1. Commit this assignment unchanged, together with `docs/mailbox/test-browser-all/implementer.md` and your changes.
2. The report starts with the `ruach-handoff` YAML block: revision, tested SHA, changed paths, the exit-130 cause and fix, and verification with exact commands and results.
3. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/test-browser-all/implementer.md --repo /opt/dev/tehom-brainlab-tball` until it reports `ok: true`.

Terminal handoff: the report SHA, the tested SHA, the exit-130 cause and fix, harness coverage, check results and blockers.
