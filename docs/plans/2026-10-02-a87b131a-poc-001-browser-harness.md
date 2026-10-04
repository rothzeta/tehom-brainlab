# Run POC 001 as an isolated, testable browser application

## Status and authority

**P01. Implemented, independently verified/reviewed, and accepted by the Coordinator.** No prerequisites. Baseline: `79f9498051df0281e6e9d3c904e9eee32f014873`.

Authority: [AGENTS](../../AGENTS.md), [prototype README](../../poc-001-linked-formation/README.md), and the [technology decision](../adr/0004-repository-and-poc-direction.md). The local naming and format ADRs linked below govern this document.

Delivery sequence: [P01–P12 index](README.md). Governing format: [ADR-0002](../adr/0002-plan-filenames.md) and [ADR-0003](../adr/0003-implementation-plan-writing.md).

Task `P01` implementation and combined-verification owner: assigned Implementer. Independent review completed with no findings; local delivery is assigned to the Implementer. This plan is one standalone task; its sequential checkpoints inherit the prerequisites, affected components, acceptance criteria, verification, and hand-back defined here. Checkpoint identifiers remain stable on edits. Record actual execution in [TASK_LOGS](../TASK_LOGS.md); see the [P01 implementation entry](../TASK_LOGS.md#2026-10-04-p01-browser-harness). The [independent review](../mailbox/p01-browser-harness/reviewer.md) supports acceptance of criteria 1–7; [local delivery](../TASK_LOGS.md#2026-10-04-p01-local-delivery) records integration. Starting-source and proposed-path descriptions below preserve the planning baseline.

## Smallest useful outcome

A contributor can install dependencies inside this prototype, start one browser screen, run one real core test, and build a static application without configuring another prototype or a backend. This is a harness, not combat.

## Starting source and ownership

At the planning baseline, `poc-001-linked-formation/` contained a README, empty source/test directories, and placeholders. There was no package manifest, installed dependency set, application, or executable test suite.

Own this prototype's package and lock files, TypeScript/Vite/Vitest configuration, HTML entry, `src/main.ts`, a minimal scene under `src/view/`, one pure smoke function under `src/core/`, its test, and local run instructions. Add prototype-local CLI implementations under `scripts/`, executable entry points under `bin/`, and the corresponding thin recipes to the root justfile. Prefer prototype-local Docker configuration for an isolated reproducible Bun toolchain. These are proposed paths, not existing implementations. Do not create a root workspace or move shared assets.

## Fixture and inputs

Use a fresh checkout and an empty dependency directory. The smoke scene displays `TEHOM — Formation Lab` plus a labelled placeholder; its pure fixture returns an explicit constant without DOM or Phaser access. Use a second clean install from the committed lockfile to test reproducibility.

Choose compatible supported dependency/runtime versions during implementation, verify against their official documentation, and record the exact Bun version and any required compatibility runtime versions used. This plan does not assert current version numbers.

## Contracts and decisions

### Required contracts

Invoke just recipes from the repository root; their implementations run installation, execution, testing, and build commands with the prototype as their working directory. Core modules must not import Phaser, the DOM, browser storage, network clients, or presentation modules. Tests must fail when the smoke expectation is deliberately broken; an empty suite is not acceptance evidence. A build must not require credentials or a running application service.

### Settled choices

The initial stack target is TypeScript, Phaser, Vite, and Vitest. Browser-first, one screen, no backend. The renderer illustrates rules and does not own them. This does not select the production engine.

The user's 3 October preference establishes Bun as the default runtime/package manager, Docker where applicable, and justfile orchestration with scripts in `scripts/` and executable entry points in `bin/`. Retain Vitest; replacing it with Bun's built-in test runner is not part of this tooling change.

### Proposed implementation

Use Bun with one committed `bun.lock`, strict TypeScript, and local scripts `dev`, `typecheck`, `test:unit`, `build`, and `preview`. Define `test:unit` as a non-watch test run so later plans can pass explicit file paths. Use relative build asset paths to support static hosting beneath a directory. Declare and pin the selected Bun runtime in local documentation and tool configuration; verify the Vite/Vitest toolchain under Bun before declaring it supported. Keep Phaser initialization in the browser entry; the unit test imports only the smoke core module. Avoid a starter game's physics or example assets.

Expose `just poc-001-install`, `just poc-001-dev`, `just poc-001-typecheck`, `just poc-001-test`, `just poc-001-build`, and `just poc-001-preview`. The install implementation uses `bun install --frozen-lockfile` after the initial lockfile is generated; the other commands delegate to `bun run --bun <script>` and preserve arguments and exit codes. Test filters are relative to the prototype. Prefer a pinned official Bun container for toolchain isolation, exposing its CLI through the same entry points and documenting the selected mode. Bind any development server to an accessible container interface, publish ports on localhost, and prevent generated files becoming owned by root. Verify the chosen image contains everything the toolchain needs; document compatibility exceptions rather than silently falling back to npm or Node.

## Implementation checkpoints

1. **P01.C1** — Inspect the latest branch and local guidance; preserve unrelated changes. Select and lock dependencies inside this prototype.
2. **P01.C2** — Add the smallest browser scene and a pure module with a nontrivial assertion. Confirm the module runs under the unit runner without browser globals.
3. **P01.C3** — Add the command scripts and a production build. Exercise both the development server and the built output.
4. **P01.C4** — Replace the prototype README's obsolete run section with actual commands and tested environment. Describe this as a runnable shell, not a playable patrol.

## Acceptance criteria

1. `just poc-001-install` succeeds in a clean prototype checkout using the committed lockfile.
2. `just poc-001-dev` displays the named scene without application-origin console errors or an unhandled rejection.
3. `just poc-001-typecheck` and `just poc-001-test` pass; temporarily inverting the smoke assertion makes the test command return nonzero.
4. `just poc-001-build` produces a static `dist/`; `just poc-001-preview` serves it with no required backend requests or missing local entry assets.
5. Importing the smoke core fixture in the unit process does not create a Phaser game or access `window` or `document`.
6. The change creates no root application, mandatory workspace, dependency directory in Git, or dependency on another prototype.
7. The root just recipes delegate to prototype-local scripts/executables, preserve argument boundaries and exit codes, and exercise the documented Bun/Docker mode using pinned versions. A missing runtime or inaccessible Docker daemon yields a clear failure rather than a passing check.

## Verification and hand-back

Record exact executed commands, results, acceptance evidence, and limitations in [TASK_LOGS](../TASK_LOGS.md), then link that entry here and update [CURRENT](../CURRENT.md) when implementation facts change. The commands below remain proposed until their prerequisites supply them.

From the repository root, run `just poc-001-install`, `just poc-001-typecheck`, `just poc-001-test`, and `just poc-001-build`. Record exact commands, runtime/package-manager versions, exit codes, and the tested commit. Manually open development and preview builds; record the browser and any console/network errors. Return the entry-point paths, a screenshot of the actual shell, and known limitations. Execution update: the [Implementer handoff](../mailbox/p01-browser-harness/implementer.md) records criteria 1–7 evidence at `fce94b20cf69eae8030b20282a2f3ad82099d418`. The assigned automated real-browser captures and agent visual inspection substitute for the manual viewing step under the 4 October assignment; no human visit/playtest is claimed.

## Non-goals and stop conditions

No hex board, game rules, asset generation, deployment account, CI platform rollout, React, backend, or shared engine. Stop after the runnable/testable shell. If dependency compatibility requires changing the agreed stack, record the blocker rather than silently switching engines. Reconcile with new repository code or ADRs if they appear before execution.
