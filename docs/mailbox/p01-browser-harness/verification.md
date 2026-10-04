task: P01 combined committed-revision verification
status: complete
outcome: Assigned observable checks executed successfully at fce94b20cf69eae8030b20282a2f3ad82099d418; independent review pending.
artifacts:
  - docs/mailbox/p01-browser-harness/implementer.md
  - docs/mailbox/p01-browser-harness/commands.json
  - docs/mailbox/p01-browser-harness/clean-install.json
  - docs/mailbox/p01-browser-harness/browser.json
  - docs/mailbox/p01-browser-harness/scope-runtime.json
  - docs/mailbox/p01-browser-harness/dependencies.json
  - docs/mailbox/p01-browser-harness/dev.png
  - docs/mailbox/p01-browser-harness/preview.png
verification:
  - Executed commands, exits, environment, and stdout/stderr recorded in linked JSON and tables below.
discoveries:
  - Pinned official Bun image runs the complete TypeScript/Phaser/Vite/Vitest stack without a Node runtime exception.
blockers: []
tested_revision: fce94b20cf69eae8030b20282a2f3ad82099d418

Author: Implementer. Date: 2026-10-04 UTC. Baseline `656dd6a76d0bb4fedf74a96e9fcdce412becbd51`; combined implementation `aaaca78ba7b39c0173eac6ea39ed487a024809d6`; one README correction precedes the tested revision. All commands below execute that existing combined revision unless explicitly marked as initial discovery. Later changes record evidence/status only. [Implementer handoff](implementer.md) owns the acceptance matrix, changed paths, integration outcome, and limits.

## Environment and primary sources

Linux amd64, Debian 13.6; Bun 1.4.2 (744846f84), just 1.40.0, Docker client/server 29.7.2, Python 3.13.5, Chrome headless shell 148.0.7778.96. Official image: `oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895`. The image was downloaded with `docker pull oven/bun:1.4.2` (exit 0). Subsequent wrappers use the digest. Caller UID/GID is 1000:1000. Docker generated files are caller-owned; container inspection confirmed localhost-only published ports and the configured user. `/proc/*/exe` inspection inside the actual dev/preview containers found Bun executables, docker-init, and dash; Vitest independently asserts `process.versions.bun === '1.4.2'` inside its worker. The image's `/usr/local/bun-node-fallback-bin/node` is a symlink to `/usr/local/bin/bun`; `node -e 'console.log(process.versions.bun)'` returns 1.4.2. Bun's reported Node API compatibility version is 26.3.0; this is not a separately installed Node runtime.

Exact published metadata was read on 4 October from the official package registry; [dependencies.json](dependencies.json) preserves the relevant fields. Vite's `^20.19.0 || >=22.12.0` engine and Vitest's `^22.12.0 || ^24.0.0 || >=26.0.0` engine intersect, and Vitest's Vite peer accepts Vite 8.3.2. Engine declarations alone do not prove Bun compatibility; the actual checks below establish this selected environment.

| Direct pin | Primary source |
| --- | --- |
| Bun 1.4.2 | [Bun exact release](https://github.com/oven-sh/bun/releases/tag/bun-v1.4.2), [official Docker guide](https://bun.sh/guides/ecosystem/docker), [run --bun](https://bun.sh/docs/runtime) |
| Phaser 4.2.1 | [Official download](https://phaser.io/download), [published metadata](https://registry.npmjs.org/phaser/latest) |
| Vite 8.3.2 | [Published metadata](https://registry.npmjs.org/vite/latest), [support policy](https://vite.dev/releases), [relative asset base](https://vite.dev/guide/build.html#relative-base) |
| Vitest 5.0.3 | [Published metadata](https://registry.npmjs.org/vitest/latest), [Vitest guide](https://vitest.dev/guide/), [node environment](https://vitest.dev/guide/environment.html) |
| TypeScript 7.0.2 | [Published metadata](https://registry.npmjs.org/typescript/latest), [Bun TypeScript 6/7 guidance](https://bun.sh/docs/typescript-6) |
| @types/node 26.6.4 | [Published metadata](https://registry.npmjs.org/@types/node/latest) |

No compatibility stack change was necessary. TypeScript 7 uses its packaged native compiler after its launcher runs under Bun. No install trust override, npm command, Node fallback, or Bun built-in test runner was used. Bounded escalation supplied network/Docker/browser/Git and scratch access where the sandbox denied it; no host security setting, daemon configuration, or genuine approval dialog was changed.

## Exact commands and exits

[commands.json](commands.json) contains 33 command records with argv arrays, cwd, explicit environment, exit, combined stdout/stderr, and captured forwarded child arguments where applicable. All root commands run in `/opt/dev/tehom-brainlab`, with prototype working directory `/app` in Docker or the absolute local prototype path in host mode.

| Command | Observed result |
| --- | --- |
| `just poc-001-install` | Exit 0; `bun install --frozen-lockfile`; committed bun.lock required |
| `just poc-001-typecheck` | Exit 0; `bun run --bun typecheck` → `tsc --noEmit` |
| `just poc-001-test` | Exit 0; `bun run --bun test:unit` → Vitest 5.0.3, one file/two tests passing |
| `just poc-001-build` | Exit 0; Vite 8.3.2 static dist, 7 modules transformed |
| Temporarily replace only `toBe('formation-lab-ready')` with `toBe('deliberately-wrong')`, then `just poc-001-test` | Exit 1 with actual expected/received assertion failure, one failed and one passed test |
| Restore exact saved test bytes; `just poc-001-test`; `git diff --exit-code -- poc-001-linked-formation/tests/smoke.test.ts` | Both exit 0; two tests passing; committed test unchanged |
| `just poc-001-test tests/smoke.test.ts -t 'declared literal'` | Exit 0; one selected test passes, runtime-pin test skipped by the explicit name filter |
| `just poc-001-test tests/does-not-exist.test.ts` | Exit 1; no test files found, proving filter/exit behavior |
| `POC001_MODE=host PATH=/home/metatron/.bun/bin:$PATH just poc-001-{install,typecheck,test,build}` (four separate commands) | Each exit 0; explicit same-pin host mode works |
| `POC001_MODE=host PATH=/usr/bin:/bin just poc-001-test` | Exit 1; `Bun 1.4.2 required on PATH in host mode` |
| `DOCKER_HOST=unix:///tmp/p01-inaccessible-docker.sock just poc-001-test` | Exit 1; `Docker daemon inaccessible; check availability and socket permissions` |
| Six root recipes with `['value with spaces', 'literal;$(echo unsafe)', '--example']`, explicit-host recording Bun executable returning 37 | Each exit 37; exact argument boundaries, prototype cwd and `--bun` routing confirmed; no metacharacter execution |
| Same six commands via local `bin/run`, recording child exit 37 | Each exit 37 unchanged |
| Host recording Bun reports version 0.0.0 | Exit 1; required/found version message |
| Root just with a PATH containing only sh/dirname prerequisites, no Docker CLI | Exit 1; explicit Docker CLI missing message |
| Copied prototype/justfile with bun.lock absent, `just poc-001-install` | Exit 1 before installation; committed lockfile required |
| `bin/run test 'a b'` from unrelated cwd, executable in copied path containing spaces | Exit 0; prototype resolution and argument preserved |
| Docker recording executable (`info` succeeds, `run` exits 37), local `bin/run test 'file with spaces.test.ts'` | Exit 37; Docker argv has quoted final file argument and local script invocation |

The recording executables are boundary probes for forwarding/error propagation, not substitutes for actual Bun/Docker/tool runs. Initial scratch verification aborted because it incorrectly expected just to remap child 37 to 1; the observed boundary was correct. The driver and README were corrected before the final complete run. The final [commands.json](commands.json) records the corrected full run at `tested_revision`.

The smoke test guards global `window`, `document`, and `Phaser` with throwing getters before dynamically importing the pure core module. A second direct Bun process imports it with identical guards and an access counter: exit 0, `{"bun":"1.4.2","fixture":"formation-lab-ready","browserGlobalAccesses":0}`. Exact argv is in [scope-runtime.json](scope-runtime.json). Inspected `src/core/smoke.ts` has no imports at all; only browser `src/main.ts` initializes Phaser. No test imports the scene or entry point, or installs DOM emulation.

## Second clean checkout

`git worktree add --detach /tmp/brainlab-p01-clean-aaaca78 aaaca78ba7b39c0173eac6ea39ed487a024809d6` initially created the empty dependency checkout; it was advanced to `tested_revision` before installation. The following aggregate command in that checkout exited 0, establishing that every `&&` operand succeeded:

```sh
git switch --detach fce94b20cf69eae8030b20282a2f3ad82099d418 &&
test ! -e poc-001-linked-formation/node_modules &&
sha256sum poc-001-linked-formation/bun.lock &&
just poc-001-install &&
sha256sum poc-001-linked-formation/bun.lock &&
just poc-001-typecheck &&
just poc-001-test &&
just poc-001-build &&
git status --short
```

[clean-install.json](clean-install.json) records the results: 43 packages installed, two tests pass, typecheck/build exit 0, status clean. Before/after lock hash is `97cf0bb58eea9ea8b98751e06d83bd64d8ea8df1660cae2ba135bddda9f9477a`; it also matches the primary checkout and committed source. No node_modules existed before install. Each Docker run has a fresh temporary Bun cache under `/tmp`, removed with its container; the pinned Docker image is reused. No root-owned generated files were found in either checkout.

## Actual browser evidence

`just poc-001-dev` and `just poc-001-preview` were launched in the primary checkout through default Docker mode at `tested_revision`. Vite reported ready on localhost:5173 and localhost:4173 respectively; Docker inspection confirmed `127.0.0.1` publication, `1000:1000` user, and Bun processes. Browser command: `/home/metatron/.bun/bin/bun .agents/scratch/p01/browser.ts` (exit 0). This temporary CDP driver spawned:

```text
/home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell
  --no-first-run --no-default-browser-check --disable-background-networking
  --remote-debugging-port=9227
  --user-data-dir=/opt/dev/tehom-brainlab/.agents/scratch/p01/browser-profile
  about:blank
```

Chrome's own sandbox stayed enabled; no `--no-sandbox`, unsafe software-rendering opt-in, or other safeguard bypass was used. The driver attached [Runtime](https://chromedevtools.github.io/devtools-protocol/tot/Runtime/), [Network](https://chromedevtools.github.io/devtools-protocol/tot/Network/), Log and [Page](https://chromedevtools.github.io/devtools-protocol/tot/Page/) listeners before navigation, disabled the page cache, waited for a nonblank 960×600 Canvas, and collected screenshots with `Page.captureScreenshot`. Viewport was 1100×750, device scale 1. Canvas pixel inspection found 5747 bright pixels for each page; the page title was exact. `Runtime.exceptionThrown` covers thrown exceptions and unhandled rejections during the observation; no such events occurred.

Both actual screenshots were opened with `view_image` and visually inspected by the Implementer. The title reads **TEHOM — Formation Lab**, and the bordered panel reads **Formation placeholder** / **Browser harness ready**. Captures were separately taken from dev and preview and happen to be byte-identical (SHA256 `7073cf3b307729c097573dc956677470ea8ee1a7357b34e22b59d411a3bdc11a` each), consistent with the same scene. Both show scrollbars; all requested text is visible. This is automated real-browser execution and agent visual inspection, not a human playtest or manual human visit.

| Page | Requests / assets | Console / runtime | Artifact |
| --- | --- | --- | --- |
| Dev `http://localhost:5173/` | 12 requests: 7 local documents/scripts and 5 embedded Phaser data images; local responses 200; local Vite HMR WebSocket | Vite debug/Phaser banner only; zero errors/exceptions/rejections/failures | [dev.png](dev.png) |
| Preview `http://localhost:4173/` | 8 requests: HTML, relative built JS and CSS, 5 embedded data images; local responses 200; no WebSocket | Phaser banner only; zero errors/exceptions/rejections/failures | [preview.png](preview.png) |

There were no XHR/Fetch/backend requests, external-origin page requests, HTTP 4xx/5xx responses, or missing local assets. Browser evidence includes URL/type/status, console calls, exceptions, network failures, canvas metrics, command flags and actual browser version in [browser.json](browser.json). Only the transient Vite HMR token query was stripped from socket URLs. Build HTML inspection confirmed `./assets/index-Dsr-fa2K.js` and `./assets/index-CXVwlNtD.css`.

Chrome emits one rendering warning per page about deprecated automatic software-WebGL fallback during capability detection; the application uses Canvas. The warning was retained, and its suggested unsafe flag was not used. Browser-internal diagnostics remained scratch; no application console error was found. Chrome was closed after captures. Ctrl-C stopped both wrapper servers (normal interruption exit 130); a subsequent image-filtered `docker ps` returned no matching running containers.

## Scope, limits, and final evidence

[scope-runtime.json](scope-runtime.json) preserves exact scope/runtime commands: protected-path baseline diff empty; Scout report unchanged since the implementation commit; current application/justfile diff against tested HEAD empty; tracked dependencies/dist absent; generated directories ignored; no root package/lock/workspace/dependencies; UID/GID and Bun executable evidence; clean checkout revision/status/lock diff confirmed. `master` still resolves to `656dd6a76d0bb4fedf74a96e9fcdce412becbd51`. No source/CLI/configuration changes are left unverified.

Vite's large Phaser chunk warning is expected and remains visible: JS 1,375.84 kB, gzip 358.19 kB. No browser matrix, human playtest, combat validation, remote deployment, or publication ran. All assigned verification is complete; independent review and delivery are pending. Evidence/status-only successor changes are validated for links, whitespace, JSON readability, scope, unchanged tested application, and clean Git state before terminal handoff.
