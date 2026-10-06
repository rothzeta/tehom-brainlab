task: test-browser-all-review
status: complete
outcome: O1 resolved; no blocking or outstanding optional findings; independent success, forced-failure and preview-error checks passed.
reviewed_revision: 796e833da5cd1129d2bc5c77d893266d51807aba
tested_revision: abd79f1231c9fbf2e4151bddb92c0065232967b9
initial_reviewed_revision: 0fca27879defd061ca18e8215b2b5d43ee2183d7
initial_tested_revision: d2859a62d0f05774c7cf5334615247e8da54a7ab
followup_baseline: 9649f5fd708e205c05ea7cc2c91c054c99507b9f
baseline: 64143327c47fabb45fc2262d045000258350fc1a
artifacts:
  - docs/mailbox/test-browser-all/reviewer.md
  - docs/mailbox/test-browser-all/assignment-reviewer.md
  - test-browser-all-review
blocking_findings: []
optional_findings: []
resolved_findings:
  - id: O1
    status: resolved by 796e833 and independently re-reviewed
    severity: low
    location: poc-001-linked-formation/scripts/browser-checks.mjs:105
    scenario: A successful bare browser run stops its preview with docker stop.
    problem: Forwarded preview stderr prints an error for expected shutdown before the successful browser total.
    why_it_matters: A terminal user can interpret the cleanup message as a failed regression check despite exit 0.
    evidence: 'Both independent successful runs printed error: script "preview" exited with code 143, then Browser total: 5987 assertions passed across 8 harnesses, and exited 0.'
    suggested_direction: Label the expected shutdown or suppress only the known expected teardown diagnostic while preserving unexpected preview errors and cleanup failures.
verification:
  - "O1 just poc-001-test-browser, bare non-PTY: exit 0; 8 harnesses and 5987 assertions; /tmp/p10-browser-GT74oi; full output has no error line."
  - "O1 just poc-001-test-browser from /tmp/tball-review-o1-failure-ky3fb0u8: expected exit 1; forced assertion error preserved; owned preview stopped; no aggregate success total."
  - "python3 /tmp/tball-review-o1-boundary-kvlsyfdu/check.py: exit 0; five inspected process-fixture cases independently passed, including unexpected preview exits and cleanup failure."
  - "O1 docker ps -a --filter name=poc-001-browser- --format '{{.ID}} {{.Names}} {{.Status}}': exit 0; empty after checks."
  - "O1 ss -ltn 'sport = :4173': exit 0; no listener before or after checks."
  - "node --check poc-001-linked-formation/scripts/browser-checks.mjs: exit 0 at O1 candidate."
  - "git diff --check 9649f5f..796e833: exit 0."
  - "git diff --exit-code 796e833..HEAD -- poc-001-linked-formation: exit 0; tested report successor has identical prototype content."
  - "git diff --exit-code 9649f5f..796e833 -- poc-001-linked-formation/scripts/run.sh poc-001-linked-formation/src poc-001-linked-formation/tests poc-001-linked-formation/README.md docs/CURRENT.md docs/TASK_LOGS.md docs/plans: exit 0."
  - "O1 bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/test-browser-all/reviewer.md --repo /opt/dev/tehom-brainlab-tballr: exit 0; ok true; all six current and historical revision references resolved."
initial_verification:
  - "just poc-001-install: exit 0; installed 43 pinned packages because dependencies were missing."
  - "just poc-001-test: exit 0; 20 files and 581 tests passed."
  - "just poc-001-typecheck: exit 0."
  - "just poc-001-test-browser, non-PTY run 1: exit 0; 8 harnesses and 5987 assertions; /tmp/p10-browser-HWONpz."
  - "just poc-001-test-browser, non-PTY run 2: exit 0; 8 harnesses and 5987 assertions; /tmp/p10-browser-rXiKhv."
  - "just poc-001-test-browser from /tmp/tball-review-failure-d1_kr2j7 with a forced Collector assertion failure: expected exit 1; owned preview stopped; no aggregate success summary."
  - "just poc-001-test-browser from the same scratch copy with Collector exiting 0 without a summary: expected exit 1; missing assertion-count summary reported; owned preview stopped; no aggregate success summary."
  - "docker ps -a: exit 0 after checks; no poc-001-browser- containers; all 11 pre-existing containers retained with the same IDs and running/exited states."
  - "docker ps -a --filter name=poc-001-browser- --format '{{.ID}} {{.Names}} {{.Status}}': exit 0; empty after both scratch checks."
  - "ss -ltn 'sport = :4173': exit 0; no listener before or after verification."
  - "sh -n poc-001-linked-formation/scripts/run.sh: exit 0."
  - "node --check poc-001-linked-formation/scripts/browser-checks.mjs: exit 0."
  - "git diff --check 6414332..HEAD: exit 0."
  - "git diff --exit-code 0fca278..HEAD -- poc-001-linked-formation: exit 0; actual tested checkout has identical prototype content to reviewed candidate."
  - "git diff --exit-code 6414332..0fca278 -- poc-001-linked-formation/src poc-001-linked-formation/tests docs/CURRENT.md docs/TASK_LOGS.md docs/plans: exit 0; protected and out-of-scope paths unchanged."
  - "bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/test-browser-all/reviewer.md --repo /opt/dev/tehom-brainlab-tballr: exit 0; ok true; all three revision references resolved."
review:
  - "No material correctness, regression, scope, or unnecessary-complexity findings in the assigned diff."
  - "Chrome discovery and fresh-build behavior are preserved; README lists all eight current harnesses accurately."
discoveries: []
initial_discoveries:
  - "Expected preview SIGTERM shutdown still prints a child exit-143 error on successful parent runs; optional UX finding above."
  - "The tested checkout d2859a6 adds only the implementer's report to reviewed candidate 0fca278; native exports correctly report d2859a6 as the build revision."
blockers: []

Author: tball-reviewer. Branch: `test-browser-all-review`. Followed the [assignment](assignment-reviewer.md), repository policy, ruach-testing, and ruach-handoff. Reviewed `6414332..0fca278` in the browser runner, Docker wrapper, and prototype README, together with surrounding wrapper/toolchain code and all harness argument/summary interfaces. The candidate also adds the implementer's assignment. HEAD `d2859a62d0f05774c7cf5334615247e8da54a7ab` adds only the [implementer report](implementer.md); all ordinary checks ran at that evidence-only successor, whose prototype content matches the reviewed candidate exactly.

Verdict: **no blocking findings**. Every acceptance condition passed independent verification, with the optional terminal-output issue identified in the leading block. No production code or repository test assertions were changed during review.

Both successful browser invocations ran from the repository root, bare, non-PTY, with `login: false`, inherited environment, no hand-set Chrome/mode/port variables, and no manual build first. Each invocation discovered Chrome automatically, built through the pinned Docker wrapper, started one uniquely named preview, ran all harnesses in filename order, stopped that preview, printed the aggregate result, and exited 0. Docker/Chrome execution required approved host access because the initial sandboxed Docker inventory could not access the daemon socket.

| Harness | Run 1 assertions | Run 2 assertions |
| --- | ---: | ---: |
| `browser-collector.mjs` | 379 | 379 |
| `browser-crucible.mjs` | 474 | 474 |
| `browser-lab.mjs` | 197 | 197 |
| `browser-p14-kit.mjs` | 51 | 51 |
| `browser-patrol.mjs` | 4572 | 4572 |
| `browser-preview.mjs` | 24 | 24 |
| `browser-repositioning.mjs` | 98 | 98 |
| `browser-run-record.mjs` | 192 | 192 |
| **Total** | **5987** | **5987** |

The lab's two failed-image requests are intentional fallback coverage. Both fresh builds emitted the existing large-bundle warning. Neither affected the assertion or exit results.

Optional finding evidence: the runner forwards preview stderr at [browser-checks.mjs:105](../../../poc-001-linked-formation/scripts/browser-checks.mjs#L105), including the expected shutdown diagnostic during cleanup at lines 119–123. Both successful terminal output streams ended with this sequence (container UUID omitted):

```text
Stopping browser preview container poc-001-browser-<uuid>
error: script "preview" exited with code 143
poc-001-browser-<uuid>
Browser total: 5987 assertions passed across 8 harnesses
{"ok":true,"scripts":8,"assertions":5987,...}
```

The parent recipe exited 0 in each case, so this is a low-severity presentation issue, not a failed cleanup. Suggested direction: clearly identify this as expected teardown, or narrowly filter the expected shutdown diagnostic without hiding unexpected preview failures. No fix was made by the Reviewer.

Scratch verification used an archive of candidate `0fca27879defd061ca18e8215b2b5d43ee2183d7` in `/tmp/tball-review-failure-d1_kr2j7`, with copied installed dependencies. First, inserted `assert.fail('review scratch forced harness failure');` before argument parsing in that copy's `tests/browser-collector.mjs`. The bare root recipe built and started its ordinary preview, reported the assertion failure and harness exit 1, stopped `poc-001-browser-9896fab9-18e3-4c4d-b7af-515d02274445`, then exited 1. Filtered `docker ps -a` was empty afterwards. Next, replaced only that scratch harness with a single console message and normal exit 0. The bare recipe rejected its missing assertion summary, stopped `poc-001-browser-201234b0-fee9-411a-9010-9b8f76100e7c`, and exited 1. Neither failed run printed an aggregate success summary. Final full and filtered Docker inventories confirmed no task-owned container remained and all pre-existing container IDs/states were preserved; port 4173 had no listener.

Disposable logs are `/tmp/tball-review-browser-run1.log`, `/tmp/tball-review-browser-run2.log`, `/tmp/tball-review-browser-failure.log`, and `/tmp/tball-review-browser-no-summary.log`. The material evidence is preserved above; these scratch files are not repository artifacts.

All assigned verification was executed. A PTY browser run, a separate build recipe, and reproduction of the historical implementation's exit 130 were not required or rerun in this review. The two non-PTY candidate runs establish the required current behavior; they do not resolve the implementer's acknowledged uncertainty about historical signal propagation. External interruption, Docker daemon loss, and hung harness recovery were not independently exercised.

## Re-review O1

Reviewed fix `796e833da5cd1129d2bc5c77d893266d51807aba`, diff `9649f5f..796e833`, limited to `poc-001-linked-formation/scripts/browser-checks.mjs`. Ran the requested `git merge --ff-only test-browser-all`, which advanced this review branch to evidence-only successor `abd79f1231c9fbf2e4151bddb92c0065232967b9`. Ordinary verification ran at that checkout; prototype content is identical to the fix and native exports identify the actual checkout SHA. The original review and evidence above remain historical; the leading block now describes this follow-up.

Verdict: **O1 resolved; no blocking or outstanding optional findings**. The stderr handler at lines 113–116 forwards diagnostics normally until requested cleanup. Cleanup at lines 134–152 buffers and rejoins stderr chunks, and removes only the exact Bun exit-143 line after `docker stop` succeeds and the preview closes with exit 143. Other stderr remains visible. A failed Docker stop or unexpected preview cleanup exit throws, flushes unfiltered diagnostics, and prevents the success total. `checkPreview()` at lines 75–79 and its calls before/after each harness reject early preview death, including an early exit 143. No material regression or unnecessary complexity found in the assigned diff.

Independent bare non-PTY `just poc-001-test-browser` ran once from the repository root with `login: false`, inherited environment, no hand-set overrides and no manual build first. It returned **exit 0**, with all eight harnesses and **5,987 assertions**; per-harness counts match the original table. Full-log checks found neither the misleading exit-143 diagnostic nor any line starting with `error:`. It performed its own fresh Docker build and stopped its UUID-named preview. Its final five output lines, quoted verbatim:

```text
Stopping browser preview container poc-001-browser-97eec012-f270-4b9c-9844-54592cef8ccd
poc-001-browser-97eec012-f270-4b9c-9844-54592cef8ccd
Preview stopped (expected)
Browser total: 5987 assertions passed across 8 harnesses
{"ok":true,"scripts":8,"assertions":5987,"harnesses":[{"script":"tests/browser-collector.mjs","assertions":379},{"script":"tests/browser-crucible.mjs","assertions":474},{"script":"tests/browser-lab.mjs","assertions":197},{"script":"tests/browser-p14-kit.mjs","assertions":51},{"script":"tests/browser-patrol.mjs","assertions":4572},{"script":"tests/browser-preview.mjs","assertions":24},{"script":"tests/browser-repositioning.mjs","assertions":98},{"script":"tests/browser-run-record.mjs","assertions":192}],"output":"/tmp/p10-browser-GT74oi"}
```

The forced-failure check ran once from a fresh archive of fix `796e833` in `/tmp/tball-review-o1-failure-ky3fb0u8`, with copied installed dependencies and `assert.fail('review O1 scratch forced harness failure');` inserted before argument parsing in only that copy's Collector harness. Bare non-PTY `just poc-001-test-browser` returned **exit 1** after its fresh build and managed-preview cleanup. It retained the assertion error, `error: tests/browser-collector.mjs: exit 1`, and the failed recipe diagnostic. Expected cleanup printed `Preview stopped (expected)` without the misleading preview error. No aggregate success total appeared. Final `docker ps -a --filter name=poc-001-browser- --format '{{.ID}} {{.Names}} {{.Status}}'` was empty and port 4173 had no listener.

For the specifically requested regression boundaries, inspected the implementer's disposable fixture driver, preview stub, Docker stub and harness, copied them into private `/tmp/tball-review-o1-boundary-kvlsyfdu`, and replaced its runner copy with the reviewed candidate. Independently executed `python3 /tmp/tball-review-o1-boundary-kvlsyfdu/check.py`; exit 0, with all five case assertions passing. These fixture checks use ephemeral local ports and test-owned processes rather than real Docker. They supplement the actual bare Docker runs above.

| Process fixture | Independently observed result |
| --- | --- |
| Expected cleanup, split exit-143 diagnostic plus unrelated stderr | Runner exit 0; only the known diagnostic suppressed; unrelated stderr and expected-stop label retained. |
| Preview startup death, exit 7 | Runner exit 1; startup diagnostic and `Preview exited 7` retained. |
| Preview death during harness, exit 143 | Runner exit 1; raw exit-143 diagnostic and `Preview exited 143` retained; no expected-stop label or total. |
| Unexpected preview cleanup exit 7 | Runner exit 1; raw exit-7 diagnostic and `Preview exited 7 during cleanup` retained; no total. |
| Docker stop failure, exit 9 | Runner exit 1; Docker error, preview stderr including raw exit-143, and `Preview cleanup exited 9` retained; no total. |

Disposable full logs: `/tmp/tball-review-o1-browser.log` and `/tmp/tball-review-o1-failure.log`; material evidence is preserved here. All requested follow-up checks ran. Unit/typecheck, a separate build recipe, and PTY verification were not repeated for this runner-only follow-up. Spawn failures, daemon loss and hung-process recovery were not dynamically exercised. No production code or committed harness assertions changed during review.

Updated handoff validation: `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/test-browser-all/reviewer.md --repo /opt/dev/tehom-brainlab-tballr` returned exit 0 and `ok: true`, with all six current/historical revision references resolved. Only the Reviewer report is changed for this handoff.
