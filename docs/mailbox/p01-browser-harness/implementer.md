task: P01 implementation and combined integration/verification
status: complete
outcome: Implemented the isolated browser shell and completed the assigned verification for criteria 1–7 at the committed combined application revision. Ready for independent review; no acceptance, merge, or delivery is inferred.
artifacts:
  - docs/mailbox/p01-browser-harness/implementer.md
  - docs/mailbox/p01-browser-harness/verification.md
  - docs/mailbox/p01-browser-harness/commands.json
  - docs/mailbox/p01-browser-harness/clean-install.json
  - docs/mailbox/p01-browser-harness/browser.json
  - docs/mailbox/p01-browser-harness/dev.png
  - docs/mailbox/p01-browser-harness/preview.png
  - docs/mailbox/p01-browser-harness/scope-runtime.json
  - docs/mailbox/p01-browser-harness/dependencies.json
  - docs/mailbox/p01-browser-harness/scout.md (preserved unchanged)
  - candidate/p01-browser-harness-20261004-impl
verification:
  - Root Docker install/typecheck/test/build: exit 0 at tested_revision; Vitest two tests passed.
  - Deliberately false literal: exit 1; exact committed test restored, passing rerun exit 0.
  - Clean second checkout with empty node_modules: frozen install/typecheck/test/build exit 0; lock SHA256 unchanged.
  - Explicit pinned host install/typecheck/test/build exit 0; pure standalone import and CLI boundaries passed.
  - Actual sandbox-enabled Chrome dev/preview capture: named rendered canvas; no console errors, unhandled exceptions/rejections, network failures, missing entry assets, or backend requests; both screenshots visually inspected with view_image.
  - Protected paths, ignored generated dependencies, no root application, unchanged Scout report and master, caller-owned output: confirmed.
discoveries:
  - Official Bun image's node-named executable is a symlink to Bun; actual Vitest workers and running Vite processes use Bun 1.4.2. No separate Node exception needed.
  - just 1.40.0 preserves child exit 37 exactly. An initial scratch-driver expectation of exit 1 was corrected; documentation correction is included in tested_revision.
  - Phaser bundle warning and Chrome software-WebGL warning are retained limitations; no browser safeguards were bypassed.
blockers: []
candidate_revision: fce94b20cf69eae8030b20282a2f3ad82099d418
tested_revision: fce94b20cf69eae8030b20282a2f3ad82099d418
source_baseline: 656dd6a76d0bb4fedf74a96e9fcdce412becbd51

Author: Implementer. Date: 2026-10-04 UTC. `candidate_revision` identifies the existing combined application candidate checked before recording this handoff. The final evidence-only successor, containing this report and all artifacts, is identified in the terminal handoff; this file need not contain its own future commit SHA. No implementation/configuration/test/runtime changes follow `tested_revision`.

## Changes and integration

The candidate branch starts at the verified destination `master` baseline above. `aaaca78ba7b39c0173eac6ea39ed487a024809d6` combines all scoped application/tooling changes, scoped documentation, and the previously uncommitted Scout report. `fce94b20cf69eae8030b20282a2f3ad82099d418` corrects one README statement about just exit forwarding. This is the exact combined application revision verified in both checkouts and the browser. No conflicting worker changes existed; no merge was required or performed. Destination `master` remains at the source baseline; no remote push/publication occurred.

Changed application paths: [package.json](../../../poc-001-linked-formation/package.json), [bun.lock](../../../poc-001-linked-formation/bun.lock), [.bun-version](../../../poc-001-linked-formation/.bun-version), [runtime.env](../../../poc-001-linked-formation/runtime.env), [index.html](../../../poc-001-linked-formation/index.html), [tsconfig.json](../../../poc-001-linked-formation/tsconfig.json), [vite.config.ts](../../../poc-001-linked-formation/vite.config.ts), [vitest.config.ts](../../../poc-001-linked-formation/vitest.config.ts), [main.ts](../../../poc-001-linked-formation/src/main.ts), [style.css](../../../poc-001-linked-formation/src/style.css), [FormationLab.ts](../../../poc-001-linked-formation/src/view/FormationLab.ts), [smoke.ts](../../../poc-001-linked-formation/src/core/smoke.ts), and [smoke.test.ts](../../../poc-001-linked-formation/tests/smoke.test.ts).

CLI paths: [root justfile](../../../justfile), local executable [bin/run](../../../poc-001-linked-formation/bin/run), and [run.sh](../../../poc-001-linked-formation/scripts/run.sh)/[toolchain.sh](../../../poc-001-linked-formation/scripts/toolchain.sh). Six root recipes delegate without shell argument reconstruction. Installation explicitly checks for the committed lockfile and runs frozen; package scripts use `bun run --bun`. Docker is the default with exact image digest, caller UID/GID, temporary writable home/cache, prototype-only mount, localhost ports, and accessible container binding. Explicit host mode checks Bun's exact version; failure never changes modes.

Documentation changes: root/prototype READMEs, [CURRENT](../../CURRENT.md), [TASK_LOGS](../../TASK_LOGS.md#2026-10-04-p01-browser-harness), P01 status, and plan-index factual status. Plans/specifications, their seven acceptance criteria, and later-task scopes remain intact. The remaining commit records only evidence and factual status.

## Acceptance evidence 1–7

| Criterion | Executed evidence | Result |
| --- | --- | --- |
| 1. Clean committed-lock install | Root install in second checkout at `tested_revision`, initially no node_modules; [clean-install.json](clean-install.json) | Exit 0; 43 packages; unchanged lock hash |
| 2. Named dev scene without errors/rejection | Actual `just poc-001-dev`, Chrome CDP, [dev.png](dev.png), [browser.json](browser.json) | Named 960×600 canvas rendered; visually inspected; no application errors/rejection |
| 3. Strict typecheck/test and meaningful failure | Root checks; literal changed to `deliberately-wrong`, then exact restoration; [commands.json](commands.json) | Typecheck and two tests pass; false expectation exits 1; restored suite exits 0 |
| 4. Static build/preview without backend or missing assets | Root build/preview, actual Chrome capture, [preview.png](preview.png), [browser.json](browser.json) | dist built; relative JS/CSS URLs; all local responses 200, no failures or backend requests |
| 5. Pure core import without browser/game initialization | Vitest throwing guards plus bare Bun import; [scope-runtime.json](scope-runtime.json) | Literal returns; zero browser-global accesses; import-free core cannot initialize Phaser |
| 6. Independent prototype and clean scope | Baseline protected-path diff, Git tracked/ignored inspection, manifest/build source review; [scope-runtime.json](scope-runtime.json) | No root app/workspace, committed dependencies, or other-prototype import; protected files unchanged |
| 7. Local CLI, pins, forwarding, prerequisite failures | All six recipes with spaced/metacharacter args and child exit 37; real file/name filters; missing/mismatched Bun, Docker CLI/daemon and lockfile; actual Docker/host checks | Arguments and exits preserved; clear nonzero prerequisite failures; exact pins run under Bun |

Detailed exact commands, runtime versions, source URLs, browser methodology, clean-install hash, and limitations are in [verification.md](verification.md). Negative/failure probes are expected outcomes, not unresolved failures.

## Preservation and remaining limits

No changes to AGENTS.md, CLAUDE.md, canonical roles/skills/workflows, persistent harness settings, existing root bin/scripts, shared assets/code/tools, `.gitignore`, or P02–P12 plan files. Scope verification checks those paths against the baseline; Scout report bytes remain those committed in the first combined implementation commit. No root-owned generated files were found in either checkout. Temporary dev/preview servers and Chrome were stopped; the clean checkout remains available for review at `/tmp/brainlab-p01-clean-aaaca78` (HEAD `tested_revision`). Scratch drivers/profiles remain ignored.

This is a shell, with no formation board, combat, backend, or human playtest. Browser evidence is actual automated execution plus agent visual inspection, as authorized by the assignment; it is not a human manually visiting the page. Only cached Chrome headless shell on Linux amd64 was tested. No browser matrix or future P11 infrastructure was added. Vite warns about the 1.38 MB Phaser chunk; Chrome emits a software-WebGL deprecation warning during capability probing, even with the Canvas renderer. Screenshots show scrollbars at the captured viewport, but the complete title and placeholder are visible. Dependency upgrades, optimization, and presentation polish are outside P01. Independent Reviewer decides acceptance; merge/delivery remain unassigned.
