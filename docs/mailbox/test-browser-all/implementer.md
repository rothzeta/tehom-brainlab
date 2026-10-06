task: test-browser-all
status: complete
outcome: Follow-up O1 complete; expected preview shutdown is labelled, both bare non-PTY browser runs exited 0 without the misleading error line, and failure diagnostics remain visible.
revision: 796e833da5cd1129d2bc5c77d893266d51807aba
tested_revision: 796e833da5cd1129d2bc5c77d893266d51807aba
original_tested_revision: 0fca27879defd061ca18e8215b2b5d43ee2183d7
followup_baseline: 9649f5fd708e205c05ea7cc2c91c054c99507b9f
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
  - "Follow-up O1: just poc-001-test-browser, bare non-PTY run 1: exit 0; 8 harnesses / 5987 assertions; no preview exit-143 error line; /tmp/p10-browser-338oTS."
  - "Follow-up O1: just poc-001-test-browser, bare non-PTY run 2: exit 0; 8 harnesses / 5987 assertions; no preview exit-143 error line; /tmp/p10-browser-M8tuzO."
  - "Follow-up O1: just poc-001-test-browser from /tmp/tball-o1-failure-check: expected exit 1; forced Collector assertion and harness exit 1 remain visible; /tmp/p10-browser-oY61ko."
  - "python3 /tmp/tball-o1-boundary-check/check.py: exit 0; all 5 process-boundary cases passed (normal, startup failure, early exit, unexpected teardown exit, failed Docker stop)."
  - "node --check poc-001-linked-formation/scripts/browser-checks.mjs: exit 0."
  - "git diff --check 9649f5f..HEAD: exit 0."
  - "git diff --exit-code 9649f5f..HEAD -- poc-001-linked-formation/scripts/run.sh poc-001-linked-formation/src poc-001-linked-formation/tests poc-001-linked-formation/README.md docs/CURRENT.md docs/TASK_LOGS.md docs/plans: exit 0."
  - "bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/test-browser-all/implementer.md --repo /opt/dev/tehom-brainlab-tball: exit 0; ok true; current/original revisions and baselines resolve."
  - "docker ps -a --filter name=poc-001-browser- --format '{{.ID}} {{.Names}} {{.Status}}': exit 0; no managed preview containers remain."
original_verification:
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
  - "Before O1, expected preview exit 143 was printed as an error. O1 suppresses only this confirmed teardown diagnostic and labels the successful stop."
  - "One pre-final attempt met another worker's port-4173 preview and exited 1 (preview exit 125); waited for release without stopping another worker."
blockers: []
followup_changed_paths:
  - poc-001-linked-formation/scripts/browser-checks.mjs
  - docs/mailbox/test-browser-all/implementer.md

The original implementation evidence below is retained at `original_tested_revision`; the appended Follow-up O1 section records checks for the current `revision` and `tested_revision`.

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


## Follow-up O1

Addressed the Coordinator follow-up and [optional review finding O1](reviewer.md) on baseline `9649f5fd708e205c05ea7cc2c91c054c99507b9f`. The implementation is `796e833da5cd1129d2bc5c77d893266d51807aba`. Only `scripts/browser-checks.mjs` changed; `run.sh`, product source, README, harnesses, assertions and protected documents are unchanged in this follow-up. This updated report will be an evidence-only successor of the tested implementation.

Preview stderr streams unchanged throughout startup and harness execution. During runner-requested cleanup it is buffered until the Docker stop and preview close results are known. Only after Docker stop returns 0 and the preview returns the expected 143 does the runner remove the exact line `error: script "preview" exited with code 143`. All other diagnostics are forwarded. A successful expected stop prints `Preview stopped (expected)`. An unexpected teardown exit fails the command and keeps its diagnostics; a failed stop keeps the captured diagnostics and restores normal forwarding. Checks before and after each harness fail the command if the preview has already exited, including exit 0 or 143 before requested cleanup.

Both required checks ran from the repository root as bare non-PTY `just poc-001-test-browser`, with inherited environment, no hand-set overrides and no manual preparatory build. Output capture used `set -o pipefail` and `2>&1 | tee /tmp/tball-o1-browser-runN.log`, preserving the recipe's exit status. Each command built afresh and used its own managed preview. Both ran all eight harnesses with the unchanged counts above, totaling 5,987 assertions. Full-output checks found no exit-143 error line, and both native patrol exports identify the tested SHA.

| Check | Result |
| --- | --- |
| `just poc-001-test-browser`, bare non-PTY run 1 | Exit 0; 5,987 assertions; `/tmp/p10-browser-338oTS`; log `/tmp/tball-o1-browser-run1.log`. |
| `just poc-001-test-browser`, bare non-PTY run 2 | Exit 0; 5,987 assertions; `/tmp/p10-browser-M8tuzO`; log `/tmp/tball-o1-browser-run2.log`. |
| `just poc-001-test-browser` from `/tmp/tball-o1-failure-check` | Expected exit 1; assertion failure remains visible after expected cleanup; `/tmp/p10-browser-oY61ko`; log `/tmp/tball-o1-browser-failure.log`. |
| `python3 /tmp/tball-o1-boundary-check/check.py` | Exit 0; all five process-boundary cases below passed. |
| `node --check poc-001-linked-formation/scripts/browser-checks.mjs` | Exit 0. |
| `git diff --check 9649f5f..HEAD` | Exit 0. |
| `git diff --exit-code 9649f5f..HEAD -- poc-001-linked-formation/scripts/run.sh poc-001-linked-formation/src poc-001-linked-formation/tests poc-001-linked-formation/README.md docs/CURRENT.md docs/TASK_LOGS.md docs/plans` | Exit 0. |

Run 1 tail, quoted verbatim:

```text
Stopping browser preview container poc-001-browser-4b7cd2df-5aa1-47c0-b37d-30bef283bdb8
poc-001-browser-4b7cd2df-5aa1-47c0-b37d-30bef283bdb8
Preview stopped (expected)
Browser total: 5987 assertions passed across 8 harnesses
{"ok":true,"scripts":8,"assertions":5987,"harnesses":[{"script":"tests/browser-collector.mjs","assertions":379},{"script":"tests/browser-crucible.mjs","assertions":474},{"script":"tests/browser-lab.mjs","assertions":197},{"script":"tests/browser-p14-kit.mjs","assertions":51},{"script":"tests/browser-patrol.mjs","assertions":4572},{"script":"tests/browser-preview.mjs","assertions":24},{"script":"tests/browser-repositioning.mjs","assertions":98},{"script":"tests/browser-run-record.mjs","assertions":192}],"output":"/tmp/p10-browser-338oTS"}
```

Run 2 tail, quoted verbatim:

```text
Stopping browser preview container poc-001-browser-fd959c08-91b6-415f-866a-97d1fb95bce4
poc-001-browser-fd959c08-91b6-415f-866a-97d1fb95bce4
Preview stopped (expected)
Browser total: 5987 assertions passed across 8 harnesses
{"ok":true,"scripts":8,"assertions":5987,"harnesses":[{"script":"tests/browser-collector.mjs","assertions":379},{"script":"tests/browser-crucible.mjs","assertions":474},{"script":"tests/browser-lab.mjs","assertions":197},{"script":"tests/browser-p14-kit.mjs","assertions":51},{"script":"tests/browser-patrol.mjs","assertions":4572},{"script":"tests/browser-preview.mjs","assertions":24},{"script":"tests/browser-repositioning.mjs","assertions":98},{"script":"tests/browser-run-record.mjs","assertions":192}],"output":"/tmp/p10-browser-M8tuzO"}
```

The failure copy was created with `git archive HEAD` at the tested implementation into `/tmp/tball-o1-failure-check`, with copied installed dependencies. Only its Collector harness was changed, inserting `assert.fail('O1 scratch forced harness failure');` before argument parsing. Its ordinary fresh-build/preview recipe returned 1. The following errors remained visible; no aggregate success total appeared:

```text
AssertionError: O1 scratch forced harness failure
error: tests/browser-collector.mjs: exit 1
error: script "test:browser" exited with code 1
error: Recipe `poc-001-test-browser` failed on line 57 with exit code 1
```

Additional process-boundary verification uses a copied runner with test-owned preview and Docker fixtures, an isolated HTTP port, and one test-owned harness. The normal fixture emits the known exit-143 line in split chunks and another diagnostic; only the known line disappears, while the other diagnostic remains. The failure fixtures emit their diagnostics before exit so visibility assertions cover output that actually reached the runner.

| Explicit fixture | Observed runner exit and preserved output |
| --- | --- |
| Expected stop | Exit 0; expected-stop label; split exit-143 line suppressed; unrelated teardown diagnostic preserved. |
| Preview dies during startup | Exit 1; startup diagnostic and `Preview exited 7`. |
| Preview dies while harness runs, exit 143 | Exit 1; raw exit-143 line and `Preview exited 143`; no expected-stop label or success total. |
| Preview exits 7 during requested cleanup | Exit 1; raw exit-7 line and `Preview exited 7 during cleanup`; no success total. |
| Docker stop fails, exit 9 | Exit 1; Docker error, preview diagnostics including raw exit-143, and `Preview cleanup exited 9`; no success total. |

All requested O1 checks were executed. Separate unit/typecheck/build recipes and a PTY run were not requested or repeated for this runner-only follow-up; their original-revision results remain preserved above. O1 has not received independent re-review. No blockers, merge or push.

O1 handoff validation: `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/test-browser-all/implementer.md --repo /opt/dev/tehom-brainlab-tball` returned exit 0 and `ok: true`. Final `docker ps -a --filter name=poc-001-browser- --format '{{.ID}} {{.Names}} {{.Status}}'` returned exit 0 with no managed preview containers. Read-only `/proc` inspection also found no surviving preview processes from the isolated boundary fixtures.
