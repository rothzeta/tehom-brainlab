task: RF-fix
role: implementer
status: complete
outcome: Restart stays clear until new pointer movement or focus; all lab destination captions are legible; three consecutive bare browser suites pass.
baseline: ef0e3b41ac7917fd4976594fdd79bcd206cb7dde
starting_revision: 8039a02a6712ed360f4fa2346e7a5b41dcf47593
fixed_revision: 0d5fadcb1a4c1a9c1cec75d93a72c37d07fdd3ae
tested_revision: 0d5fadcb1a4c1a9c1cec75d93a72c37d07fdd3ae
cause: Chromium sends pointerenter to Clockwise under the stationary pointer after Restart collapses the selection controls; its handler recreated the preview.
artifacts:
  - docs/mailbox/ring-formation/assignment-fix.md
  - docs/mailbox/ring-formation/fix.md
  - docs/mailbox/ring-formation/fix-lab-destinations.png
  - docs/mailbox/ring-formation/fix-patrol-compact.png
  - docs/mailbox/ring-formation/fix-patrol-spread.png
verification:
  - "just poc-001-test: exit 0; 14 files, 477 tests passed."
  - "just poc-001-typecheck: exit 0."
  - "just poc-001-build: exit 0; 27 modules transformed."
  - "just poc-001-test-browser: three consecutive bare runs, each exit 0, four scripts and 4964 assertions; no POC001 environment overrides."
  - "Preservation check against RF BASE: exit 0; unedited suites preserved, every original P04 assertion preserved, exactly one P04 assertion added; reset assertion unchanged."
  - "git diff --check and git diff --check 8039a02..HEAD: exit 0."
  - "Visual inspection: lab expansion captions and all eleven patrol screenshots from browser run 1 inspected."
  - "ruach-handoff validator: exit 0; ok true, no diagnostics, all four revision fields resolved."
review: not-run
discoveries:
  - "The reset failure is a real application defect with timing-dependent observation, not a harness defect; the patrol browser driver remains unchanged by this follow-up."
  - "Known readability item: selected-ability, multiline-preview and expanded-log states may scroll vertically; initial Compact/Spread patrol and default lab fit 1280x800."
blockers: []

# RF-fix handoff — Implementer

Completed the [follow-up assignment](assignment-fix.md) on `ring-formation`. The technical commit is `0d5fadcb1a4c1a9c1cec75d93a72c37d07fdd3ae`; the later report commit records evidence only. The earlier [blocked handoff](implementer.md) remains historical evidence.

## Cause and fix

The reset assertion is correct. A native-browser reproducer used the same actor/ability/target selection, pointer press on Confirm, keyboard focus/Enter on Restart, and no intervening pointer movement. Capture listeners observed this sequence:

1. Restart receives focus and its keyboard-generated click.
2. Reset clears pending state and removes the selected ability/target controls.
3. At the next layout update, the stationary pointer at `(757.90, 481.13)` leaves Confirm and enters the persistent Clockwise control, which moved underneath it.
4. The old `pointerenter` handler creates a new clockwise preview. No `pointermove` occurs.

This explains the earlier inconsistent browser result: an immediate snapshot can precede the layout-generated boundary event. Waiting for two animation frames exposed the defect consistently. The existing driver and reset assertion were preserved; no delays or altered expectations were added to the patrol suite.

| Native reproduction | Runs | Ghosts immediately after Restart | Ghosts after two frames | New pointer movements |
| --- | ---: | ---: | ---: | ---: |
| Before application fix | 10 | 0/10 | 10/10 | 0 |
| After application fix | 10 | 0/10 | 0/10 | 0 |

`CombatScene.previewOn` now uses `pointermove` and `focus`. Real pointer movement or focus still previews a command, as the full browser suite verifies; layout-generated entry alone cannot recreate it. Session reset, command execution and the test harness required no changes.

Lab captions previously sat above their destination ghosts, where nearby live tokens could cover them. Centering captions inside the ghosts avoids that overlap without moving the board or controls. One added browser assertion checks all 36 legal previews across the twelve Compact/Spread fixtures: three nonempty captions, within the board, with no overlap against live emblems, live names or another caption. All original P04 assertions remain unchanged. The first attempted above/below placement failed this new check in 18 previews; the final centered placement passes all 36.

## Changed files

- `poc-001-linked-formation/src/view/CombatScene.ts`: preview event change and explanatory comment.
- `poc-001-linked-formation/src/view/lab.css`: centered destination-caption placement.
- `poc-001-linked-formation/tests/browser-lab.mjs`: one added legibility assertion over 36 previews, one screenshot, updated screenshot-count metadata.
- This report, the unchanged assignment, and three retained screenshots.

## Verification on the committed fix

The unit suite, typecheck and build used the default Docker wrapper and pinned Bun image from `runtime.env`. Commands were `just poc-001-test`, `just poc-001-typecheck`, and `just poc-001-build`; each exited 0. Build reports the existing bundle-size warning (1.43 MB JavaScript), with no build failure.

For each of the three sequential browser runs, the exact shell commands were:

```sh
export PATH=/home/metatron/.bun/bin:$PATH
env | grep POC001
just poc-001-test-browser > /tmp/rf-fix-browser-N.log 2>&1
rf_browser_status=$?
cat /tmp/rf-fix-browser-N.log
exit "$rf_browser_status"
```

`N` was respectively `1`, `2`, and `3`. `env | grep POC001` produced **no output on every run**, confirming `POC001_CHROME` and all other POC001 overrides were absent. No browser arguments were supplied. The runner discovered `/home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell` (HeadlessChrome/148.0.7778.96) and freshly built/served the production application through Docker each time. Every exported record reports the tested technical SHA above. Code and test inputs did not change between runs.

| Run | Full output directory | Lab | Preview | Patrol | Records | Total / exit |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| 1 | `/tmp/p10-browser-C7LAug` | 178 | 24 | 4570 | 192 | 4964 / 0 |
| 2 | `/tmp/p10-browser-q3kyNs` | 178 | 24 | 4570 | 192 | 4964 / 0 |
| 3 | `/tmp/p10-browser-NQZjY9` | 178 | 24 | 4570 | 192 | 4964 / 0 |

Each patrol run checks 12 traces and 132 commands, with zero application exceptions or failed requests. Each lab run intentionally exercises missing-image fallback; its two failed requests are expected and its exception count is zero. The four-script runner ends with `ok: true` on all three runs. Required checks are all executed.

The preservation check used `git ls-tree -r --name-only ef0e3b4 poc-001-linked-formation/tests`, then `git diff --exit-code ef0e3b4..HEAD --` on every BASE-tracked test path except the seven original RF-authorized files and the newly authorized `browser-lab.mjs`. Exit 0 across twelve paths (eleven suites/fixtures plus `.gitkeep`). Those preserved files include `run-record.test.ts`, `browser/fixtures.ts`, `browser-run-record.mjs`, `commands.test.ts`, `view.test.ts`, `smoke.test.ts`, `asset-copy.test.ts`, `patrol-session.test.ts`, `browser-preview.mjs`, `browser/patrol-fixture.ts`, and `browser/outcome-fixture.ts`.

A Python comparison of the BASE P04 assertion lines with the current file confirmed all original lines still exist and the assertion count increases by exactly one. It also checked this exact line occurs once in BASE, `8039a02`, and the fixed commit:

```js
    equal((await snapshot()).ghosts,[],'reset removes old hover/focus preview before another pointer input');
```

`git diff --exit-code 8039a02..HEAD -- poc-001-linked-formation/tests/browser-patrol.mjs` exited 0, proving the entire patrol driver is unchanged by this follow-up. `git diff --exit-code 8039a02..HEAD -- docs .agents` exited 0 before adding the assigned evidence, proving no earlier report, protected document or generated definition changed. `git diff --check` and `git diff --check 8039a02..HEAD` exited 0.

Diagnostic commands were `just poc-001-dev` (exit 125 because default port 5173 was occupied), followed by `POC001_PORT=5193 just poc-001-dev` (started successfully), then:

```sh
/home/metatron/.bun/bin/bun /tmp/rf-reset-diagnose.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/rf-reset-before http://localhost:5193/
/home/metatron/.bun/bin/bun /tmp/rf-reset-diagnose.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/rf-reset-after http://localhost:5193/
/home/metatron/.bun/bin/bun poc-001-linked-formation/tests/browser-lab.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/rf-lab-centred http://localhost:5193/
```

Both reset probes and the final standalone lab check exited 0. The disposable driver and event traces remain in `/tmp`; their unique findings are preserved above. The task-owned diagnostic container `f09960521652` was stopped successfully with `docker stop f09960521652`.

## Visual inspection and remaining items

I viewed the lab expansion screenshot and all eleven patrol screenshots from run 1: all three presets in Compact and Spread, placeholders, victory, defeat, End-phase preview and fixed-area rendering. The lab's Girtablilu destination caption is fully visible. The initial Compact/Spread patrol and default lab fit at 1280x800; existing browser assertions also enforce that fit.

Retained evidence: [lab destinations](fix-lab-destinations.png), [Compact patrol](fix-patrol-compact.png), [Spread patrol](fix-patrol-spread.png). Selected-ability, multiline-preview and expanded-log states may scroll vertically; this remains the Coordinator-authorized readability item, rather than a blocker. No layout redesign was made.

The assignment checksum is `89f19a4cba7aac3ddc4dd67be4a300dfa6342431be31075f318361928e195f76` (SHA-256), unchanged from receipt. No remaining blockers. Independent review has not been run by this Implementer.

Mechanical validation command: `/home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/ring-formation/fix.md --repo /opt/dev/tehom-brainlab-ring`.
Result: exit 0, `ok: true`, empty diagnostics, and all four revision fields resolved.
