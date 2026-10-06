task: test-browser-all
status: complete
outcome: Every browser harness runs through the bare recipe; three non-PTY runs and one PTY run exited 0, and a forced harness failure exited 1.
revision: 0fca27879defd061ca18e8215b2b5d43ee2183d7
tested_revision: 0fca27879defd061ca18e8215b2b5d43ee2183d7
baseline: 64143327c47fabb45fc2262d045000258350fc1a
changed_paths:
  - poc-001-linked-formation/scripts/browser-checks.mjs
  - poc-001-linked-formation/scripts/run.sh
  - poc-001-linked-formation/README.md
  - docs/mailbox/test-browser-all/assignment-implementer.md
  - docs/mailbox/test-browser-all/implementer.md
exit_130_cause: Original teardown deliberately sent SIGINT to the Docker preview process group, producing preview exit 130. Historical propagation to the non-PTY recipe did not reproduce here.
exit_130_fix: Stop the uniquely named task-owned container with docker stop -t 5, await cleanup and preview close, and remove process-group SIGINT.
artifacts:
  - docs/mailbox/test-browser-all/implementer.md
  - docs/mailbox/test-browser-all/assignment-implementer.md
  - test-browser-all
verification:
  - "just poc-001-test: exit 0; 20 files / 581 tests passed."
  - "just poc-001-typecheck: exit 0."
  - "just poc-001-build: exit 0; existing large-bundle warning."
  - "just poc-001-test-browser, final non-PTY run 1: exit 0; all 8 harnesses / 5987 assertions; /tmp/p10-browser-l68jDX."
  - "just poc-001-test-browser, final non-PTY run 2: exit 0; all 8 harnesses / 5987 assertions; /tmp/p10-browser-j0hF0M."
  - "just poc-001-test-browser, final non-PTY run 3: exit 0; all 8 harnesses / 5987 assertions; /tmp/p10-browser-Qv2kDl."
  - "just poc-001-test-browser, PTY: exit 0; all 8 harnesses / 5987 assertions; /tmp/p10-browser-ohO877."
  - "just poc-001-test-browser from /tmp/tball-failure-check: expected exit 1; forced Collector assertion failed; owned preview stopped; /tmp/p10-browser-IjSmRp."
  - "sh -n poc-001-linked-formation/scripts/run.sh: exit 0."
  - "node --check poc-001-linked-formation/scripts/browser-checks.mjs: exit 0."
  - "git diff --check 6414332..HEAD: exit 0."
  - "git diff --exit-code 6414332..HEAD -- poc-001-linked-formation/tests poc-001-linked-formation/src docs/CURRENT.md docs/TASK_LOGS.md docs/plans: exit 0."
  - "bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/test-browser-all/implementer.md --repo /opt/dev/tehom-brainlab-tball: exit 0; ok true; all revision references resolve."
  - "bun scripts/browser-checks.mjs /bin/true /tmp/tball-discovery-output http://example.invalid/ from /tmp/tball-discovery-check: exit 0; matching harnesses discovered, arguments verified, nonmatching file skipped, total 8."
  - "docker ps -a --filter name=poc-001-browser- --format '{{.ID}} {{.Names}} {{.Status}}': exit 0; no managed preview containers remain."
review: not-run
discoveries:
  - "The historical recipe-level exit 130 was not reproduced; instrumented old teardown confirms preview exit 130 from SIGINT. Exact historical propagation remains unconfirmed."
  - "Expected child preview exit 143 from Docker SIGTERM is printed at cleanup; successful parent browser recipes exit 0."
  - "One pre-final attempt met another worker's port-4173 preview and exited 1 (preview exit 125); waited for release without stopping another worker."
blockers: []

Author: tball-implementer. Branch: `test-browser-all`. The [assignment](assignment-implementer.md) is committed unchanged. No merge or push was performed. The report commit records evidence only; implementation checks target `0fca27879defd061ca18e8215b2b5d43ee2183d7`.

The runner discovers every `tests/browser-*.mjs` file in filename order, uses the existing Chrome selection and fresh Docker build, and shares one managed preview across the harnesses. It forwards each harness's output, reports its assertion count, and reports the combined total only after cleanup succeeds. Nonzero harness exits and missing assertion summaries fail the command. Existing harness invocations already agree on `CHROME OUTPUT [BASE_URL]`; no harness or assertion needed editing. The README lists the eight covered harnesses and removes obsolete claims that the boss harnesses must run separately.

Shutdown investigation and fix:

- The original `finally` sent `SIGINT` to the detached preview process group with `process.kill(-server.pid, 'SIGINT')`. The Docker CLI forwards this to the container, and the preview exits 130 (128 + SIGINT's signal number 2).
- A full original bare non-PTY `just poc-001-test-browser` run returned 0 here, with all four original harnesses passing 4,985 assertions; output `/tmp/p10-browser-H5Lo9x`. The historical top-level recipe exit 130 did **not** reproduce.
- Two shortened scratch copies retained the original build/start/teardown and skipped harness execution. `bun /tmp/tball-shutdown-diagnostic.mjs` from the prototype returned 0, logging preview `code: 130`, `signal: null`, and runner `exitCode: undefined`. Its SIGINT listener did not receive a signal. `bun run --bun test:browser` from `/tmp/tball-shutdown-probe` also returned 0 and logged the same preview exit 130. Host process inspection confirmed distinct preview and runner process groups. Thus the source of the shutdown status 130 is confirmed; the mechanism that propagated it to the historical non-PTY recipe remains unconfirmed.
- The fix removes process-group signaling. The runner assigns a random UUID container name, the wrapper passes that name only for preview, and cleanup runs `docker stop -t 5 <owned-name>`. It awaits the stop result and the preview's `close` event, subscribed before readiness polling. Cleanup errors still fail. It stops only the task-owned container, including when a harness fails.
- Docker's SIGTERM stop produces the expected child message `error: script "preview" exited with code 143`. This is preview termination, not the browser recipe result: every final successful recipe returned 0. No exit status is forced to 0, and a failed harness remains a failure.

Every final successful browser run reported these counts:

| Harness | Assertions |
| --- | ---: |
| `tests/browser-collector.mjs` | 379 |
| `tests/browser-crucible.mjs` | 474 |
| `tests/browser-lab.mjs` | 197 |
| `tests/browser-p14-kit.mjs` | 51 |
| `tests/browser-patrol.mjs` | 4,572 |
| `tests/browser-preview.mjs` | 24 |
| `tests/browser-repositioning.mjs` | 98 |
| `tests/browser-run-record.mjs` | 192 |
| **Total** | **5,987** |

The three non-PTY native patrol exports independently identify the tested SHA. All browser harnesses were discovered from the actual test directory. Lab's two failed image requests are intentional fallback coverage; they are not assertion failures.

Final verification uses the root's bare recipes, inherited environment, `login: false`, no hand-set Chrome/mode/port variables, and no manual preparatory build. Each browser command performed its own fresh build before preview. Host access was required for Docker/Chrome; a sandbox attempt failed daemon access before dependencies were installed. `just poc-001-install` then completed successfully. The pinned handoff validator dependencies were installed with `bun install --frozen-lockfile` in its skill directory; no generated skill source changed.

| Command | Result |
| --- | --- |
| `just poc-001-test` | Exit 0; 20 files, 581 tests passed. |
| `just poc-001-typecheck` | Exit 0. |
| `just poc-001-test-browser`, final non-PTY run 1 | Exit 0; 8 harnesses, 5,987 assertions; `/tmp/p10-browser-l68jDX`. |
| `just poc-001-test-browser`, final non-PTY run 2 | Exit 0; 8 harnesses, 5,987 assertions; `/tmp/p10-browser-j0hF0M`. |
| `just poc-001-test-browser`, final non-PTY run 3 | Exit 0; 8 harnesses, 5,987 assertions; `/tmp/p10-browser-Qv2kDl`. |
| `just poc-001-test-browser`, PTY | Exit 0; 8 harnesses, 5,987 assertions; `/tmp/p10-browser-ohO877`. |
| `just poc-001-build` | Exit 0; existing large Phaser bundle warning. |
| `just poc-001-test-browser`, scratch failure | Expected exit 1; assertion failure preserved after owned preview cleanup; `/tmp/p10-browser-IjSmRp`. |
| `sh -n poc-001-linked-formation/scripts/run.sh` | Exit 0. |
| `node --check poc-001-linked-formation/scripts/browser-checks.mjs` | Exit 0. |
| `git diff --check 6414332..HEAD` | Exit 0. |
| `git diff --exit-code 6414332..HEAD -- poc-001-linked-formation/tests poc-001-linked-formation/src docs/CURRENT.md docs/TASK_LOGS.md docs/plans` | Exit 0; restricted paths unchanged. |

The final three non-PTY browser commands were consecutive browser invocations at the tested revision. An earlier complete run at the initial implementation passed 5,987 assertions and exited 0; afterward, only the Docker stop option changed from deprecated `--time` to `-t`, and every required check was rerun at the finalized revision. A pre-final browser attempt exited 1 because another worker occupied port 4173 (preview exit 125). Read-only container inspection and waiting resolved the conflict; no other worker's process or container was stopped.

Scratch failure reproduction: extracted `git archive HEAD` at the tested revision into `/tmp/tball-failure-check`, copied the installed prototype `node_modules`, and inserted `assert.fail('scratch forced harness failure');` before argument parsing in that copy's `tests/browser-collector.mjs`. Ran the exact bare `just poc-001-test-browser` from that scratch repository root. It built, started its own ordinary preview, discovered the Collector harness, printed `AssertionError: scratch forced harness failure`, stopped its named container, and returned 1. It did not print an aggregate success summary. The committed tests and assertions remain unchanged.

Additional discovery boundary check: `/tmp/tball-discovery-check` contains a copy of the runner, two test-owned matching harnesses reporting explicit counts 3 and 5, and a nonmatching file that throws if executed. Running `bun scripts/browser-checks.mjs /bin/true /tmp/tball-discovery-output http://example.invalid/` there returned 0, ran both matching harnesses, verified Chrome/output/URL argument plumbing, skipped the nonmatching file, and reported total 8. These are disposable fixtures, outside the repository.

No required implementation check remains unrun. Independent review and acceptance are pending Coordinator handling. The unresolved historical signal-propagation detail above is a diagnosis limitation, not a claimed reproduction. No product or harness assertion changes were made.

Handoff validation: `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/test-browser-all/implementer.md --repo /opt/dev/tehom-brainlab-tball` returned exit 0 and `ok: true`; revision, tested revision and baseline resolve. `docker ps -a --filter name=poc-001-browser- --format '{{.ID}} {{.Names}} {{.Status}}'` returned exit 0 and no containers after the final success/failure checks.
