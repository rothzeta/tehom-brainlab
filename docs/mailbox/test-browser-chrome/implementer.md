task: TBC-impl
status: complete
outcome: Bare browser checks discover executable Chrome and rebuild through pinned Docker before local preview; all required checks passed.
role: implementer
baseline: 5b7c1913a07f9a8cfe473fafbdaa6fd9dbfb70f7
candidate_revision: e30cb0bf2fb579060ab9001ce330974739208279
tested_revision: e30cb0bf2fb579060ab9001ce330974739208279
artifacts:
  - docs/mailbox/test-browser-chrome/implementer.md
  - docs/mailbox/test-browser-chrome/assignment-implementer.md
  - poc-001-linked-formation/scripts/browser-checks.mjs
  - poc-001-linked-formation/README.md
  - test-browser-chrome
verification:
  - "just poc-001-test-browser: exit 0 with POC001_CHROME unset and dist absent; four scripts passed"
  - "POC001_CHROME override browser recipe: exit 0; four scripts passed"
  - "Isolated no-Chrome recipe: expected exit 1 with search locations and override instructions"
  - "Runner contract probes: exit 0; twelve cases passed on the committed candidate"
  - "just poc-001-test: exit 0; 12 files and 460 tests passed"
  - "just poc-001-typecheck: exit 0"
  - "just poc-001-build: exit 0"
  - "git diff --check and baseline diff check: exit 0"
  - "Source, tests and justfile baseline diff: exit 0, empty"
  - "Unchanged assignment comparison: exit 0"
  - "ruach-handoff validator with --repo /opt/dev/tehom-brainlab-tbc: exit 0, ok true"
review: not-run
discoveries:
  - "Browser checks require host Bun 1.4.2 on PATH, installed prototype dependencies, Docker access and suitable host Chrome. No browser is downloaded."
  - "A supplied BASE_URL skips the local build and preview; its caller owns build freshness."
blockers: []

Implemented in `/opt/dev/tehom-brainlab-tbc` on branch `test-browser-chrome`.
The implementation commit above contains only the runner and README. The later
report commit contains this report and the unchanged [assignment](assignment-implementer.md).
No merge, push or rebase was performed.

The [runner](../../../poc-001-linked-formation/scripts/browser-checks.mjs) preserves
explicit argument precedence over `POC001_CHROME`, checks executable files, sorts
Playwright cache revisions numerically in descending order with a deterministic
tie break, and then tries the five specified PATH names in order. Invalid explicit
overrides fail without fallback. Selection reason and absolute output path are
printed before checks. A missing browser lists the searched cache pattern, names
and PATH, and explains `POC001_CHROME` and positional overrides.

For a runner-owned server, the existing `./bin/run build` now runs before
`./bin/run preview`; both explicitly use Docker and its existing pinned runtime.
An unconditional build is the simpler correct choice: it covers changed source,
assets, configuration and dependencies without maintaining a second freshness
model. Build failure stops before preview or browser scripts. Supplied output and
BASE_URL arguments still reach all four scripts. The
[README](../../../poc-001-linked-formation/README.md) documents the bare command,
prerequisites, discovery order, override precedence, build behavior and external
server responsibility. The root justfile, wrappers, application and existing
browser/unit assertions are unchanged.

Verification ran from the worktree root on the committed candidate. The harness
PATH initially omitted Bun, so shells prepended `/home/metatron/.bun/bin` (Bun
1.4.2); no POC001 configuration was required for the bare run. Docker/loopback
checks and commits used approved sandbox escalation. Temporary logs, probe
fixtures and validator material stayed under `/tmp/test-browser-chrome-evidence`
or other OS temporary directories.

Preparation and reproduction:

```sh
export PATH=/home/metatron/.bun/bin:$PATH
unset POC001_CHROME
just poc-001-test-browser
```

At baseline this exited **1**, reproducing
`Set POC001_CHROME or pass CHROME_PATH [OUTPUT_DIRECTORY] [BASE_URL].`
`just poc-001-install` then exited **0** through pinned Docker, installing the
existing lockfile's 43 packages. No dependency declarations or lockfiles changed.

Committed-candidate bare run, exact shell commands:

```sh
export PATH=/home/metatron/.bun/bin:$PATH
unset POC001_CHROME
env | grep POC001
test ! -d poc-001-linked-formation/dist
set -o pipefail
just poc-001-test-browser 2>&1 | tee /tmp/test-browser-chrome-evidence/bare.log
```

`env | grep POC001` printed nothing and exited **1**, as expected for no matching
variables. The absent-dist check exited **0**. The browser recipe exited **0**.
Selected binary and relevant output:

```text
Chrome selected: /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell (highest executable Playwright version (chromium_headless_shell-1223))
Browser output: /tmp/p10-browser-n4KZmQ
Building a fresh production bundle through the pinned Docker wrapper.
✓ 27 modules transformed.
✓ built in 954ms
```

| Browser script | Result | Assertions | Other evidence |
| --- | --- | --- | --- |
| `browser-lab.mjs` | `ok: true` | 177 | 12 fixtures; 3 modes; 18 screenshots; 0 exceptions |
| `browser-preview.mjs` | `ok: true` | 24 | 2 screenshots; 0 exceptions |
| `browser-patrol.mjs` | `ok: true` | 2909 | 12 traces; 132 commands; 7 screenshots; 0 exceptions/failures |
| `browser-run-record.mjs` | `ok: true` | 192 | Six exported/replayed runs; candidate build revision embedded |

Final output was `{"ok":true,"scripts":4,"output":"/tmp/p10-browser-n4KZmQ"}`.
The lab's two failed requests are its intentional image-fallback exercise.

Override regression, after the same PATH/unset preparation and another empty
`env | grep POC001` (exit **1**):

```sh
set -o pipefail
POC001_CHROME=/home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell just poc-001-test-browser 2>&1 | tee /tmp/test-browser-chrome-evidence/override.log
```

Exit **0**. Selection ended in `(POC001_CHROME override)`; output was
`/tmp/p10-browser-CrZueL`. A fresh Docker build preceded preview again. All four
scripts passed with the same assertion counts as above and the candidate build
revision embedded in all six records. Final output reported `ok: true, scripts: 4`.

No-Chrome recipe, with an empty temporary HOME and a PATH containing only the
required launcher/runtime tools:

```sh
probe_root=$(mktemp -d /tmp/tbc-no-chrome-XXXXXX)
mkdir "$probe_root/home" "$probe_root/path"
ln -s /home/metatron/.bun/bin/bun "$probe_root/path/bun"
for probe_command in docker just sh dirname; do ln -s "/usr/bin/$probe_command" "$probe_root/path/$probe_command"; done
set -o pipefail
env -u POC001_CHROME -u PLAYWRIGHT_BROWSERS_PATH HOME="$probe_root/home" PATH="$probe_root/path" /usr/bin/just poc-001-test-browser 2>&1 | tee /tmp/test-browser-chrome-evidence/no-chrome.log
```

Expected exit **1**, before any Docker build. Diagnostic began
`No executable Chrome found. Searched /tmp/tbc-no-chrome-3K4qrq/home/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell (highest version first)`.
It then listed `chrome-headless-shell, google-chrome, google-chrome-stable,
chromium, chromium-browser` and the effective PATH (including Bun's injected
script directories), followed by
`Set POC001_CHROME=/path/to/chrome-headless-shell or pass CHROME_PATH [OUTPUT_DIRECTORY] [BASE_URL]. Install Chrome separately; no browser is downloaded automatically.`

Additional observable-boundary probes ran with
`python3 /tmp/test-browser-chrome-evidence/runner-contracts.py > /tmp/test-browser-chrome-evidence/contracts.log`,
exit **0** on the committed candidate. The disposable harness copied the exact
runner, supplied isolated cache/PATH fixtures, captured each child browser
script's arguments, and supplied a temporary preview and wrapper. Twelve cases
covered explicit argument precedence, environment selection, an empty/invalid
override, numeric cache ordering (9 vs 10), skipping non-executable version 100,
HOME fallback, PATH name priority, a PATH basename argument, directory rejection,
build failure, and actionable no-Chrome failure. All four child arguments retained
supplied output and BASE_URL; external URLs skipped local build/preview; local
runs used Docker; a build exit 7 prevented preview and checks. No test files were
added to the repository because assignment scope is runner/wrappers/README and
existing assertions are protected.

An initial probe attempt was blocked by sandbox loopback restrictions. A repeat
alongside the real browser run encountered port 4173 already in use; the temporary
harness was moved to port 4187 and all twelve probes passed. Neither incident
required an implementation change or weakened assertions.

Other required checks, each with the PATH/unset preparation above and
`set -o pipefail`:

```sh
just poc-001-test 2>&1 | tee /tmp/test-browser-chrome-evidence/unit.log
just poc-001-typecheck 2>&1 | tee /tmp/test-browser-chrome-evidence/typecheck.log
just poc-001-build 2>&1 | tee /tmp/test-browser-chrome-evidence/build.log
git diff --check
git diff --check 5b7c1913a07f9a8cfe473fafbdaa6fd9dbfb70f7 HEAD
git diff --exit-code 5b7c1913a07f9a8cfe473fafbdaa6fd9dbfb70f7 HEAD -- poc-001-linked-formation/tests poc-001-linked-formation/src justfile
cmp docs/mailbox/test-browser-chrome/assignment-implementer.md /tmp/test-browser-chrome-evidence/assignment-original.md
```

All exited **0**. Unit output: `Test Files 12 passed (12)` and
`Tests 460 passed (460)`. Typecheck ran `tsc --noEmit`. Standalone build transformed
27 modules and finished in 982ms. Vite's non-failing chunk-size warning remained
visible. Both whitespace checks printed nothing; the scoped baseline diff was
empty, confirming all existing assertions and application source were unchanged.
The assignment comparison used a copy saved before edits and printed nothing.

Handoff validation used an unchanged copy of the installed skill's validator and
schema in OS temp, reusing the main checkout's existing skill dependencies through
a symlink without modifying them, to avoid edits to the generated skill snapshot:

```sh
/home/metatron/.bun/bin/bun /tmp/test-browser-chrome-evidence/handoff-skill/scripts/validate.ts docs/mailbox/test-browser-chrome/implementer.md --repo /opt/dev/tehom-brainlab-tbc
```

Exit **0**, `schema_version: 1`, `ok: true`, no diagnostics; baseline, candidate
and tested revisions resolved. No required checks remain unrun. Independent
review and Coordinator acceptance are not claimed.
