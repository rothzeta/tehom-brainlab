# POC 001 — Linked formation

**Status: P01 browser shell implemented; independent review pending. Not a playable patrol.**

Test whether rotating, expanding, and contracting three linked Brood creates interesting ordinary combat decisions. The [design brief](../docs/prototypes/poc-001-linked-formation.md) and [direction ADR](../docs/adr/0004-repository-and-poc-direction.md) describe the experiment. P01 supplies only a named Phaser scene, labelled placeholder, and pure readiness fixture. Formation rules and combat remain later work.

## Run the shell

Prerequisites: POSIX shell, just, and Docker CLI with an accessible daemon. Run from the repository root:

```sh
just poc-001-install
just poc-001-dev
just poc-001-typecheck
just poc-001-test
just poc-001-build
just poc-001-preview
```

Development serves <http://localhost:5173>; built preview serves <http://localhost:4173>. Stop a server with Ctrl-C. Build before preview. Both render `TEHOM — Formation Lab` and `Formation placeholder` in an actual canvas. There is no backend, credentials, or external runtime asset service. Generated asset URLs use `base: './'` for static subdirectory hosting.

The default `POC001_MODE=docker` runs the official `oven/bun:1.4.2` image pinned by digest in [runtime.env](runtime.env). Only this prototype is mounted, with caller UID/GID, temporary writable home/cache, and localhost port publication. Vite binds `0.0.0.0` inside the container. No Docker build or root application is needed. Image downloads and dependency installs require network access; the container cache is temporary. Install explicitly requires the committed `bun.lock` and uses `bun install --frozen-lockfile`.

For another server port, select it through `POC001_PORT` so container publication and Vite agree:

```sh
POC001_PORT=5180 just poc-001-dev
just poc-001-test tests/smoke.test.ts
just poc-001-test tests/smoke.test.ts -t 'declared literal'
just poc-001-build --outDir 'dist alternative'
```

Arguments are forwarded unchanged; file filters are relative to this prototype. Use `POC001_PORT` rather than a separate `--port` in Docker mode. Nonzero tool exits propagate through the executable and just (just itself reports child failures as exit 1).

An explicit host mode is available if Bun **1.4.2** is on PATH:

```sh
POC001_MODE=host just poc-001-install
POC001_MODE=host just poc-001-test
POC001_MODE=host just poc-001-dev
```

The runtime pin is enforced in either mode. Missing Bun, a mismatched Bun version, or inaccessible Docker fails clearly. The wrapper never switches modes automatically. `.bun-version` and `packageManager` also record the pin; changing it requires updating runtime.env and verifying the toolchain again. Host Vite also binds `0.0.0.0`; select Docker mode for localhost-only published access.

## Stack and boundaries

Exact direct dependencies: Bun 1.4.2, Phaser 4.2.1, Vite 8.3.2, Vitest 5.0.3, TypeScript 7.0.2, and @types/node 26.6.4. Official published engine/peer constraints were checked; actual Docker checks demonstrate compatibility under Bun. All package scripts run with `bun run --bun`; tests use `vitest run`, not Bun's built-in test runner. TypeScript 7's launcher runs under Bun and uses its packaged native compiler. No Node runtime exception is required.

`src/main.ts` alone initializes the game. `src/view/` owns presentation. `src/core/smoke.ts` has no imports and returns the contractual literal `formation-lab-ready`; it accesses no browser globals or game initialization. The Vitest test checks that literal with throwing browser-global guards, plus the actual unit-process Bun version. Strict TypeScript checks source, tests, and configuration.

Dependencies, configuration, scripts, and lockfile stay local. `node_modules/` and `dist/` are ignored. There is no root package/workspace or another-prototype dependency. The root recipes delegate to `bin/run` → `scripts/run.sh` → `scripts/toolchain.sh`.

## Evidence and limitations

See the [Implementer handoff](../docs/mailbox/p01-browser-harness/implementer.md) and [verification record](../docs/mailbox/p01-browser-harness/verification.md) for the exact committed revision, clean reinstall, deliberate test failure, wrapper probes, and actual automated browser captures. These checks are not human playtests or combat acceptance. Vite reports the expected large Phaser bundle warning; no optimization or gameplay was added. Independent review and delivery remain pending.
