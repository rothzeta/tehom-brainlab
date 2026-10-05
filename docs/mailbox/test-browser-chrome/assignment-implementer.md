# Assignment TBC-impl — make `just poc-001-test-browser` work out of the box (Implementer)

Role: `implementer` (follow `.agents/agents/implementer.md`).
Coordinator: Claude Coordinator session in the main checkout.

## Problem (reported by the user, 2026-10-05)

From the repository root, the user ran the delivered recipe with no environment set:

```
$ just poc-001-test-browser
$ bun scripts/browser-checks.mjs
error: Set POC001_CHROME or pass CHROME_PATH [OUTPUT_DIRECTORY] [BASE_URL].
      at /opt/dev/tehom-brainlab/poc-001-linked-formation/scripts/browser-checks.mjs:8:24
error: script "test:browser" exited with code 1
error: Recipe `poc-001-test-browser` failed on line 57 with exit code 1
```

All P10/P11 workers and reviewers supplied `POC001_CHROME` by hand, using `/home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell`. Before that, they also ran `just poc-001-build` separately. As a result, the bare recipe was never exercised.

## Task

Make `just poc-001-test-browser` work when run with no arguments and no environment on a machine where a suitable Chrome exists. Keep it explicit and safe:

1. **Chrome discovery** happens in the prototype's browser-check script or wrapper, not in the root justfile. Order:
   1. `POC001_CHROME` or an explicit `CHROME_PATH` argument (unchanged behaviour, highest precedence);
   2. a Playwright `chrome-headless-shell` under `${PLAYWRIGHT_BROWSERS_PATH:-$HOME/.cache/ms-playwright}/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell`, choosing the highest version deterministically;
   3. `chrome-headless-shell`, `google-chrome`, `google-chrome-stable`, `chromium` and `chromium-browser` on `PATH`.

   Print which binary was selected and why. Only use executable files.
2. If **no Chrome is found**, fail with an actionable message listing what was searched and how to set `POC001_CHROME`. Do not download anything automatically, and add no new dependencies.
3. **Build prerequisite.** If the browser checks need a fresh production build, either run the existing Docker build step from the recipe path first, or detect a missing or stale `dist` and fail with a clear instruction. Pick the simpler correct option and justify it. A user running only `just poc-001-test-browser` after a code change must not silently test a stale build. Keep application serving in the existing pinned Docker wrapper.
4. Keep the `OUTPUT_DIRECTORY` and `BASE_URL` arguments working. Default the output to an OS temp directory and print its path.
5. Update the prototype README browser-check instructions: the bare command now works, plus the override and discovery order. Keep the root justfile unchanged unless that is truly necessary.

## Scope and restrictions

- Workspace: `/opt/dev/tehom-brainlab-tbc`, branch `test-browser-chrome`, BASE `5b7c1913a07f9a8cfe473fafbdaa6fd9dbfb70f7`. Work and commit only here.
- Change only the browser-check runner and wrapper scripts, plus README instructions. Do not change application source or the assertions inside existing browser or unit tests.
- Do not edit `docs/CURRENT.md`, `docs/TASK_LOGS.md`, plans or ADRs. Do not merge, push or rebase. Keep disposable files in the OS temp directory.

## Verification

On the committed candidate, from the worktree root, use shells with `POC001_CHROME` **unset**. Show `env | grep POC001` is empty.

1. `just poc-001-test-browser` with no arguments passes all four browser scripts. Start from a state that forces the build path, for example with `dist` removed or stale, so step 3 is exercised. Record the selected Chrome line.
2. `POC001_CHROME=<path> just poc-001-test-browser` still works and takes precedence.
3. The no-Chrome path, for example `PATH` and `HOME` pointed at empty temp directories with `PLAYWRIGHT_BROWSERS_PATH` unset (adjust as needed while keeping Bun and Docker reachable), fails with the actionable message and a non-zero exit.
4. `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build`, `git diff --check`, and confirmation that no test assertions changed.

Record exact commands, exit codes and output excerpts.

## Expected output

Commit this assignment unchanged with your report at `docs/mailbox/test-browser-chrome/implementer.md`. The report starts with the `ruach-handoff` YAML block. Run the validator with `--repo /opt/dev/tehom-brainlab-tbc` until `ok: true`. Terminal handoff: report SHA, candidate SHA, results, blockers.
