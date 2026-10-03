# P01 browser harness — implementation readiness

- **Task:** `claude-architect-injection`. This assesses implementation readiness for [P01](../../plans/2026-10-02-a87b131a-poc-001-browser-harness.md).
- **Author:** Architect (Claude Code, `claude-opus-5-5`).
- **Status:** `complete`.
- **Inspected revision:** `384e26233a41d9930d16ff93ecd732458d347682`. The working tree has uncommitted edits to `docs/CURRENT.md` and `docs/TASK_LOGS.md`. Those edits predate this task and were not touched.
- **Outcome:** P01 is ready for implementation. No decision blocks it. Two clarifications are recommended, and each has a default an Implementer can apply. The existing draft plan is reused unchanged; this report adds no new design.

## Sources inspected

- [docs/README](../../README.md), [SCHEMA](../../SCHEMA.md), [CURRENT](../../CURRENT.md) (working-tree copy), [plans index](../../plans/README.md), [P01 plan](../../plans/2026-10-02-a87b131a-poc-001-browser-harness.md)
- [POC 001 brief](../../prototypes/poc-001-linked-formation.md), [prototype README](../../../poc-001-linked-formation/README.md)
- [ADR-0004](../../adr/0004-repository-and-poc-direction.md), [ADR-0005](../../adr/0005-repository-management-and-tooling.md), [ADR-0006](../../adr/0006-contract-invariants-and-black-box-testing.md)
- Root `justfile`, `bin/doctor`, `scripts/doctor.sh`, `.gitignore`, and the file listing of `poc-001-linked-formation/`
- `grep` of `docs/plans/*.md` for the `just poc-001-*` and `test:unit` usages that later plans depend on

## Existing files compared with planned work

| Item | State at `384e262` |
| --- | --- |
| `poc-001-linked-formation/` | **Exists.** Contains `README.md` and `.gitkeep` files in `src/core`, `src/content`, `src/view`, `public`, and `tests`. Nothing else. |
| `package.json`, `bun.lock`, TS/Vite/Vitest config, `index.html`, `src/main.ts`, scene, smoke module, test | **Planned.** None exist. |
| Prototype `bin/` and `scripts/` | **Planned.** Neither exists. `.gitignore` already re-includes `/poc-*/bin/**`, so a prototype `bin/` is not ignored. |
| Prototype Docker configuration | **Planned.** None exists. |
| Root recipes `poc-001-install`, `-dev`, `-typecheck`, `-test`, `-build`, `-preview` | **Planned.** The root `justfile` has only `default`, `doctor`, and `export-tokens`. It already sets `positional-arguments`. |
| `dist/`, `node_modules/` | Ignored by the root `.gitignore`. Correct for P01 acceptance criterion 6. |

## Simplest component boundaries

All of these follow the plan. Paths are proposed.

1. **Pure core smoke module** in `src/core/`. It is a single exported value or function with no imports from Phaser, DOM, storage, network, or `src/view`. Recommendation: have it supply the scene's displayed title (`TEHOM — Formation Lab`), and have the view render that value. The smoke test then protects a real contract: the core supplies what the shell displays, and the core imports without browser globals. It is not just a constant checked against itself, which fits [ADR-0006](../../adr/0006-contract-invariants-and-black-box-testing.md).
2. **View**, made of `src/main.ts` and one scene in `src/view/`. Phaser initialisation happens only here. The scene renders the title and a labelled placeholder, with no physics and no starter assets.
3. **Prototype toolchain:** `package.json` scripts `dev`, `typecheck`, `test:unit` (non-watch and accepts file paths), `build`, and `preview`. Strict TypeScript, a relative Vite `base`, one committed `bun.lock`.
4. **Command layer:** root recipe, then the prototype `bin/` entry, then the prototype `scripts/` implementation. That implementation `cd`s into the prototype and runs the Bun or Docker command.
   - *Simplification proposal (ruach-simplification, "indirection without meaningful separation"):* use one prototype entry point that dispatches subcommands to one script, rather than six entry/script pairs. This preserves the ADR-0005 `just → bin → scripts` contract with less duplication. It is a recommendation, not a requirement.
5. **Container configuration** in the prototype, using the official Bun image pinned by the Implementer. It is a toolchain wrapper only. It adds no backend.

Excluded, as the plan says: no root workspace, no shared engine, no React, no CI, no game rules.

## Settled constraints

These are verified in the sources.

- The stack is TypeScript, Phaser, Vite, and Vitest. Vitest is kept and not replaced by `bun test` (ADR-0004, P01).
- Bun is the runtime and package manager, with a prototype-local `bun.lock` and `bun install --frozen-lockfile` after the first generation. Adding a non-Bun runtime needs a documented and verified compatibility exception. No silent npm or Node fallback (ADR-0004, P01).
- Recipes are thin, run from the repository root, use the `poc-001-` prefix, and are added only once their implementations exist. Entry points must preserve argument boundaries and exit codes. Missing prerequisites must produce failures (ADR-0005).
- Core never imports the renderer. The renderer does not own rules (ADR-0004, prototype README).
- Tests assert contract invariants, not incidental output (ADR-0006).
- Later plans call `just poc-001-test <relative test paths…>` (P02–P11) and `just poc-001-typecheck`/`-build`. P01 must therefore support file-path arguments relative to the prototype. `test-browser` and `replay` belong to later plans and are not P01's.
- Exact versions are chosen at implementation time against official documentation. This report selects none.

## Blockers and decisions

**Blocking:** none.

**Non-blocking. The Coordinator or user should confirm; otherwise the Implementer applies the default.**

1. **Execution mode for acceptance criterion 7.** The plan prefers a pinned Bun container and also says to "exercise the documented Bun/Docker mode". It does not say whether host Bun has to be supported too.
   - *Default:* make the container the only documented mode, and don't build a dual host/container switch. The host Bun is not an implicit fallback. This is simplest, and it is what makes pinning meaningful.
2. **Plan authority drift.** P01's baseline is `79f9498`. [ADR-0005](../../adr/0005-repository-management-and-tooling.md) and [ADR-0006](../../adr/0006-contract-invariants-and-black-box-testing.md) were adopted later, and P01's authority section does not cite them. Its content is consistent with both, so this is reconciliation only. Plans are read-only for this assignment, so this report does not edit P01.

**Risks for the Implementer.** These are unverified because nothing was installed.

- Vite and Vitest may not run under `bun run --bun`. The plan's stop condition covers this: record the blocker or a documented exception. Don't switch toolchains silently.
- Container details:
  - Run as host UID/GID (UID `1000` here) so `node_modules/`, `dist/`, and `bun.lock` are not root-owned.
  - Give the Bun cache or `HOME` a writable location.
  - Bind dev and preview to `0.0.0.0` inside the container and publish them on `127.0.0.1` only.
  - The very first `bun install` that creates `bun.lock` must run in the same pinned container that later frozen installs use.
- The uncommitted `docs/CURRENT.md` and `docs/TASK_LOGS.md` edits overlap P01's hand-back files, so the Implementer must preserve them.

## Verification an Implementer needs

These map to the P01 acceptance criteria. Commands are proposed until they exist.

| AC | Check |
| --- | --- |
| 1 | Delete `node_modules/`, then run `just poc-001-install`. It succeeds, and `bun.lock` is unchanged (`git diff --exit-code`). Do a second clean install to show reproducibility. |
| 2 | `just poc-001-dev`, then open it in a real browser. The title and placeholder render. Record console and network errors, the browser and its version, and a screenshot. **Needs a browser, either human or automated. None is provisioned by P01.** |
| 3 | `just poc-001-typecheck` and `just poc-001-test` exit 0. Temporarily invert the smoke assertion: the test exits nonzero. Revert the inversion and don't commit it. |
| 4 | `just poc-001-build` produces `dist/` with relative asset URLs. `just poc-001-preview` serves it, and the browser shows no 404s or backend requests. |
| 5 | The unit tests run in Vitest's Node environment, not jsdom or happy-dom, so any `window`/`document` access throws. Check that `src/core` has no `phaser` or view import, for example with `grep` or a typecheck boundary. |
| 6 | `git status`/`git ls-files` show no root `package.json`, no workspace, no tracked `node_modules/` or `dist/`, and no imports from another prototype. |
| 7 | Run `just poc-001-test <path-with-space-or-two-paths>`. Both arguments must reach Vitest intact, and a failing test's exit code must propagate. Then run with Docker unavailable (for example, `DOCKER_HOST` pointing to an invalid socket) and with `docker` missing from `PATH`. Each must exit nonzero with a clear message. |

Record the exact commands, exit codes, Bun/image/dependency versions, and tested commit in `TASK_LOGS.md`, following the plan's hand-back section.

## Technical skills read

These were read from the filesystem. Neither is registered with the native Skill tool in this session: the Claude Code Skill listing contains no `ruach-*` entries.

- `.agents/skills/ruach-testing/SKILL.md`, titled **"Ruach testing"**. The principle applied: "Every assertion must protect an identifiable contract invariant." This drove the smoke-module proposal and the mutation check for AC3.
- `.agents/skills/ruach-simplification/SKILL.md`, titled **"Ruach simplification"**. The candidate applied: "indirection without meaningful separation." This drove the single-dispatcher proposal and the single execution mode.
- No orchestration workflow (`ruach-workflow-feature`) was loaded.

## Verification performed

These were read-only checks at `384e262`.

- `git rev-parse HEAD` printed `384e26233a41d9930d16ff93ecd732458d347682`.
- `just --list` exited 0. It listed only `default`, `doctor`, and `export-tokens`.
- `just doctor` exited 0. Results: Bun `1.4.2`, Docker `29.7.2` (daemon accessible, `29.7.2`), just `1.40.0`, Python `3.13.5`. It reported "POC 001: application scaffold and browser verification are still pending". This is host availability only. No versions were selected.
- `uname -m` printed `x86_64`. `id -u` printed `1000`.
- The prototype file listing confirmed that only the README and `.gitkeep` placeholders exist.

The following were **not run**: installation, builds, tests, browser checks, and container image pulls. They are outside this assignment.

## Artifacts

- This report: `docs/mailbox/claude-architect-injection/architect.md`.
- No plan, source, configuration, or scratch file was created or modified.
