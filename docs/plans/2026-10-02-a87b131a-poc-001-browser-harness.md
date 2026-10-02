# Run POC 001 as an isolated, testable browser application

## Status and authority

**P01. Draft; not implemented or verified.** No prerequisites. Baseline: `79f9498051df0281e6e9d3c904e9eee32f014873`.

Authority: [AGENTS](../../AGENTS.md), [prototype README](../../poc-001-linked-formation/README.md), and the [technology decision](../../doc/decisions.md). The user's supplied ADR-0008 section template and ADR-0007 filename rule govern this document. Neither referenced ADR file exists at the inspected baseline; see the [plan index](README.md). Do not claim the full ADRs were reviewed.

## Smallest useful outcome

A contributor can install dependencies inside this prototype, start one browser screen, run one real core test, and build a static application without configuring another prototype or a backend. This is a harness, not combat.

## Starting source and ownership

`poc-001-linked-formation/` currently contains a README, empty source/test directories, and placeholders. There is no package manifest, installed dependency set, application, or executable test suite.

Own only this prototype's package and lock files, TypeScript/Vite/Vitest configuration, HTML entry, `src/main.ts`, a minimal scene under `src/view/`, one pure smoke function under `src/core/`, its test, and local run instructions. These are proposed paths, not existing implementations. Do not create a root workspace or move shared assets.

## Fixture and inputs

Use a fresh checkout and an empty dependency directory. The smoke scene displays `TEHOM — Formation Lab` plus a labelled placeholder; its pure fixture returns an explicit constant without DOM or Phaser access. Use a second clean install from the committed lockfile to test reproducibility.

Choose compatible supported dependency/runtime versions during implementation, verify against their official documentation, and record the exact Node and package-manager versions used. This plan does not assert current version numbers.

## Contracts and decisions

### Required contracts

Installation, execution, testing, and build commands run from the prototype directory. Core modules must not import Phaser, the DOM, browser storage, network clients, or presentation modules. Tests must fail when the smoke expectation is deliberately broken; an empty suite is not acceptance evidence. A build must not require credentials or a running service.

### Settled choices

The initial stack target is TypeScript, Phaser, Vite, and Vitest. Browser-first, one screen, no backend. The renderer illustrates rules and does not own them. This does not select the production engine.

### Proposed implementation

Use npm with one committed `package-lock.json`, strict TypeScript, and local scripts `dev`, `typecheck`, `test:unit`, `build`, and `preview`. Define `test:unit` as a non-watch test run so later plans can pass explicit file paths. Use relative build asset paths to support static hosting beneath a directory. Declare the selected runtime in local documentation and a version file. Keep Phaser initialization in the browser entry; the unit test imports only the smoke core module. Avoid a starter game's physics or example assets.

## Implementation checkpoints

1. Inspect the latest branch and local guidance; preserve unrelated changes. Select and lock dependencies inside this prototype.
2. Add the smallest browser scene and a pure module with a nontrivial assertion. Confirm the module runs under the unit runner without browser globals.
3. Add the command scripts and a production build. Exercise both the development server and the built output.
4. Replace the prototype README's obsolete run section with actual commands and tested environment. Describe this as a runnable shell, not a playable patrol.

## Acceptance criteria

1. `npm ci` succeeds in a clean prototype checkout using the committed lockfile.
2. `npm run dev` displays the named scene without application-origin console errors or an unhandled rejection.
3. `npm run typecheck` and `npm run test:unit` pass; temporarily inverting the smoke assertion makes the test command return nonzero.
4. `npm run build` produces a static `dist/`; `npm run preview` serves it with no required backend requests or missing local entry assets.
5. Importing the smoke core fixture in the unit process does not create a Phaser game or access `window` or `document`.
6. The change creates no root application, mandatory workspace, dependency directory in Git, or dependency on another prototype.

## Verification and hand-back

From `poc-001-linked-formation/`, run `npm ci`, `npm run typecheck`, `npm run test:unit`, and `npm run build`. Record exact commands, runtime/package-manager versions, exit codes, and the tested commit. Manually open development and preview builds; record the browser and any console/network errors. Return the entry-point paths, a screenshot of the actual shell, and known limitations. No commands or tests in this draft have been executed against an application.

## Non-goals and stop conditions

No hex board, game rules, asset generation, deployment account, CI platform rollout, React, backend, or shared engine. Stop after the runnable/testable shell. If dependency compatibility requires changing the agreed stack, record the blocker rather than silently switching engines. Reconcile with new repository code or ADRs if they appear before execution.
