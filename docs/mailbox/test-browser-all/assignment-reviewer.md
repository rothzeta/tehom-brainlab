# Assignment: review of browser-runner coverage and shutdown (Reviewer)

Role: `reviewer` (follow `.agents/agents/reviewer.md`).
Coordinator: the Claude Coordinator session in the main checkout.

## Change under review

- **Candidate and tested revision:** `0fca27879defd061ca18e8215b2b5d43ee2183d7`. Your worktree HEAD `d2859a62d0f05774c7cf5334615247e8da54a7ab` adds only the report.
- **Diff:** `6414332..0fca278`. It touches `poc-001-linked-formation/scripts/browser-checks.mjs`, `scripts/run.sh` and the README.
- **Assignment and handoff:** `docs/mailbox/test-browser-all/{assignment-implementer,implementer}.md`.

## Acceptance conditions

1. Bare `just poc-001-test-browser` runs every `tests/browser-*.mjs` harness (eight today) against one managed preview. It reports per-harness counts and a total.
2. A non-PTY bare run exits 0 when every harness passes and non-zero when any fails, or when a harness gives no assertion summary.
3. Teardown stops only the task-owned preview container. It never stops another worker's container or process. No managed container is left behind.
4. Chrome discovery and the fresh build are unchanged. No product source or test assertion changed.
5. The README accurately lists the coverage.
6. **User experience:** the user runs this command in a terminal. Check whether cleanup output, such as the child-preview "exit 143" message the handoff mentions, could read like a failure on a successful run. Report it as an optional finding if so.

## Verification (run yourself, bare)

Run every recipe from the repository root: no `POC001_CHROME` or other hand-set env, and no manual build first. Run `just poc-001-install` first if needed.

- `just poc-001-test`
- `just poc-001-typecheck`
- `just poc-001-test-browser` **twice, non-PTY.** Report each exit code and the total.
- A scratch-copy check in which one harness fails, confirming a non-zero exit and a clean teardown.
- `docker ps -a` afterwards, confirming no leftover `poc-001-browser-` containers.

Port 4173 may be busy; wait for it, and never stop another worker's process.

## Restrictions

- Review only; do not fix. The worktree must be clean except for your report.
- Do not edit plans, `docs/CURRENT.md` or `docs/TASK_LOGS.md`. Do not merge or push.
- Worktree `/opt/dev/tehom-brainlab-tballr`, branch `test-browser-all-review`.

## Expected output

1. Commit this assignment unchanged, together with `docs/mailbox/test-browser-all/reviewer.md`.
2. The report starts with the `ruach-handoff` YAML block: the reviewed revision, blocking findings (each with file:line, a failure scenario and the required fix), optional findings, and verification.
3. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/test-browser-all/reviewer.md --repo /opt/dev/tehom-brainlab-tballr` until it reports `ok: true`.

Terminal handoff: the report SHA, the verdict, the findings and check results.
