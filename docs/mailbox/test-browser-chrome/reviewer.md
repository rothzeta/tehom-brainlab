task: TBC-review
status: complete
outcome: Approve; no material findings. Required independent checks passed at the exact candidate revision.
role: reviewer
baseline: 5b7c1913a07f9a8cfe473fafbdaa6fd9dbfb70f7
reviewed_revision: e30cb0bf2fb579060ab9001ce330974739208279
tested_revision: e30cb0bf2fb579060ab9001ce330974739208279
evidence_revision: 3d7e9ba1ba6432ccdad4905aa4e6ee06406cfa68
artifacts:
  - docs/mailbox/test-browser-chrome/reviewer.md
  - docs/mailbox/test-browser-chrome/assignment-reviewer.md
  - docs/mailbox/test-browser-chrome/assignment-implementer.md
  - docs/mailbox/test-browser-chrome/implementer.md
verification:
  - "Bare browser recipe at e30cb0b with POC001_CHROME unset and stale dist: exit 0, all four suites passed"
  - "POC001_CHROME override recipe at e30cb0b: exit 0, all four suites passed"
  - "Isolated no-Chrome recipe at e30cb0b: expected exit 1 with actionable search/override message"
  - "Nine focused runner contract probes at e30cb0b: exit 0"
  - "just poc-001-test at e30cb0b: exit 0; 12 files, 460 tests passed"
  - "just poc-001-typecheck and just poc-001-build at e30cb0b: exit 0 each"
  - "git diff --check 5b7c191..e30cb0b: exit 0"
  - "Scoped source/tests/justfile baseline diff: exit 0, empty"
  - "Startup and real-browser assertion failure probes: expected exit 1; task containers and cached Chrome processes absent after cleanup"
  - "Assignment comparison: exit 0, unchanged"
  - "ruach-handoff validator with --repo /opt/dev/tehom-brainlab-tbc: exit 0, ok true"
review:
  - "Approve: 0 blocking findings; 0 optional findings"
discoveries: []
blockers: []

## Verdict and scope

**Approve. No material findings: 0 blocking, 0 optional.** Independently reviewed
`5b7c191..e30cb0b`, limited to the
[browser runner](../../../poc-001-linked-formation/scripts/browser-checks.mjs)
and [README](../../../poc-001-linked-formation/README.md). Read both assignments,
the implementer handoff, repository policy, wrapper/toolchain scripts and relevant
browser setup/teardown code. The successor `3d7e9ba` contains only implementation
assignment/report evidence. No production code was changed during review.

Discovery follows argument, environment, numeric Playwright cache version, then
the specified PATH names. File/executable checks reject directories and
nonexecutable candidates; invalid explicit overrides fail without fallback.
Selection and output paths are announced. The no-browser message provides search
locations and overrides. The diff adds no dependencies or download operation.

The unconditional Docker build is a simple, correct freshness prerequisite.
Both local build and preview force the existing pinned Docker mode. A supplied
BASE_URL bypasses them, and the README clearly assigns freshness to its caller.
Output/base-URL arguments reach all four child scripts. Existing Chrome teardown
and runner-owned preview teardown worked on success and the exercised failures.
The README accurately describes prerequisites, precedence and argument behavior.

## Independent verification

Checks ran in `/opt/dev/tehom-brainlab-tbc`. Host Bun was made reachable with
`export PATH=/home/metatron/.bun/bin:$PATH`; it reports version 1.4.2. Before
the bare and override runs:

```sh
unset POC001_CHROME
env | grep POC001
```

The environment check printed nothing and exited **1**, proving no POC001
variables were set. The override was supplied only for its command.

An initial bare run at the evidence-only successor `3d7e9ba`, with the existing
ignored `dist` moved to `/tmp/test-browser-chrome-review/dist-before`, passed all
four scripts from an absent build. Its first sandboxed attempt exited **1** at
the Docker accessibility check and started no preview. The approved escalated
retry passed. Unit tests and typecheck also passed there. These preliminary
results are separate from the exact-candidate checks below.

After that run completed, `git switch --detach e30cb0b` selected the exact
assigned candidate. Its `dist` still contained the successor's build, so the
following bare run exercised a stale bundle:

```sh
test -d poc-001-linked-formation/dist
just poc-001-test-browser
POC001_CHROME=/home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell just poc-001-test-browser
```

All three commands exited **0**. The bare run selected:

```text
Chrome selected: /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell (highest executable Playwright version (chromium_headless_shell-1223))
Browser output: /tmp/p10-browser-WuR8zP
Building a fresh production bundle through the pinned Docker wrapper.
```

The override run selected the same binary with reason `(POC001_CHROME override)`
and output `/tmp/p10-browser-4odxYb`. Both built before preview, then returned
`{"ok":true,"scripts":4,...}`. Each run produced:

| Suite | Result | Assertions |
| --- | --- | --- |
| browser-lab | Pass; 12 fixtures, three modes, 18 screenshots, zero exceptions | 177 |
| browser-preview | Pass; two screenshots, zero exceptions | 24 |
| browser-patrol | Pass; 12 traces, 132 commands, seven screenshots, zero failures/exceptions | 2909 |
| browser-run-record | Pass; six exported/replayed runs | 192 |

All six records in each exact-candidate run embedded
`e30cb0bf2fb579060ab9001ce330974739208279`, demonstrating replacement of the
stale successor build. The lab's two failed image requests are intentional
fallback checks. Vite emitted its existing non-failing chunk-size warning.

For the isolated no-Chrome recipe, the temporary PATH contained only symlinks to
Bun, `dirname` and `sh`; the supplied cache was empty:

```sh
env -u POC001_CHROME PATH=/tmp/test-browser-chrome-review/no-chrome/bin PLAYWRIGHT_BROWSERS_PATH=/tmp/test-browser-chrome-review/no-chrome/cache /usr/bin/just poc-001-test-browser
```

Expected exit **1**, before build/preview. The message began `No executable Chrome
found. Searched`, named the cache pattern, all five PATH candidates and effective
PATH, gave `POC001_CHROME=/path/to/chrome-headless-shell`, and stated that no
browser is downloaded automatically.

Additional exact-candidate checks, all exit **0**:

```sh
just poc-001-test
just poc-001-typecheck
just poc-001-build
git diff --check 5b7c191..e30cb0b
git diff --exit-code 5b7c191 e30cb0b -- poc-001-linked-formation/src poc-001-linked-formation/tests justfile
```

Unit tests passed **12 files / 460 tests**; typecheck had no diagnostics; build
transformed 27 modules. Both diff checks printed nothing. All application
checks/builds/serving used the pinned Docker wrapper with approved escalation;
host mode was not used.

Nine focused black-box probes ran an unchanged copy of the candidate runner in
temporary fixtures, with a deliberately failing build launcher or argument-checking
child scripts. Command:
`/home/metatron/.bun/bin/bun /tmp/test-browser-chrome-review/probes.mjs`, exit **0**,
`{"ok":true,"cases":9,...}`. They verified numeric version 10 over 9 while
skipping nonexecutable 11, directory 12 and malformed versions; environment
override; positional override over an invalid environment override; named
override resolution on PATH; PATH candidate-name priority across directories;
invalid explicit override rejection; nonexecutable override rejection; missing
Chrome; and supplied output/base URL reaching all four scripts while bypassing
build/preview. Build-failure probes observed `Build exited 23; preview was not
started` and runner exit **1**. The probe's initial harness expectation incorrectly
expected the child's code 23 to propagate; correcting that expectation yielded
the results reported here.

## Failure handling and limits

At the exact candidate, the following real recipe probes deliberately failed:

```sh
just poc-001-test-browser /bin/false /tmp/test-browser-chrome-review/failed-output
just poc-001-test-browser /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/test-browser-chrome-review/external-output http://127.0.0.1:1/
```

Each returned expected exit **1**. The first built, started Docker preview, then
reported `Chrome exited 1` and `tests/browser-lab.mjs: exit 1`. Its preview was
removed. The second launched real Chrome, timed out waiting for application
elements at the unavailable URL, and cleaned Chrome up. Its supplied output path
was printed and `lab/chrome-stderr.txt` was written; the log contained neither
the build announcement nor a Vite preview invocation.

After bare success, override success and both failure probes, process/container
inspection found:

```json
{"worktreeContainers": [], "cachedChromePids": []}
```

Inspection selected running Docker containers mounting this prototype and process
commands beginning with the cached Chrome executable path. It did not stop any
unrelated resource. Successful BASE_URL argument forwarding was verified with
fixture children; a complete four-suite run against a separately managed live
server was not run. Forced termination and other platforms were not tested.
No assigned verification remains outstanding.

## Handoff recording

Returned to `test-browser-chrome` at `3d7e9ba` after candidate verification.
Compared the assignment with its pre-review temporary copy using `cmp`: exit
**0**, unchanged. Only this report and that assignment are included in the review
commit; no merge, push or rebase was performed. Disposable logs, fixtures and
validator material are under `/tmp/test-browser-chrome-review`; the observations
needed for this review are preserved above.

The validator/script schema were copied unchanged from the pinned skill to
temporary storage, using existing validator dependencies without changing the
generated skill snapshot. Validation command:

```sh
/home/metatron/.bun/bin/bun /tmp/test-browser-chrome-review/handoff-skill/scripts/validate.ts docs/mailbox/test-browser-chrome/reviewer.md --repo /opt/dev/tehom-brainlab-tbc
```

Exit **0**, `schema_version: 1`, `ok: true`, no diagnostics; all four revision
fields resolved. Coordinator acceptance and delivery are not claimed.
