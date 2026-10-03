# P01 implementation readiness — Codex Architect

- Task: `codex-architect-injection`; author/role: Codex, Architect.
- Date: 2026-10-03.
- Status: `complete` — assessment complete; P01 remains unimplemented.
- Inspected revision: `68203a63f37f62d55f6c58c6d988c712ee49ba95` (`68203a6`), matching HEAD. Initial working tree was clean; branch was three commits ahead of origin/master.
- Owned artifact: this report only. Existing plans and source documents are unchanged.

## Outcome and authority

Reuse [P01](../../plans/2026-10-02-a87b131a-poc-001-browser-harness.md) as the implementation specification. Its component boundaries, checkpoints, acceptance criteria, and stop conditions are sufficient to begin scaffolding. No prerequisite prototype slice or unresolved gameplay decision blocks this harness. This assessment does not accept the draft on behalf of a Coordinator or establish passing application checks.

The plan records its original baseline as `79f9498051df0281e6e9d3c904e9eee32f014873`; this assessment inspected the requested later baseline directly. The prototype still matches its starting-state description. Readiness is conditional on obtaining a usable toolchain and verifying compatibility during implementation: Bun is unavailable on this session's PATH, and the installed Docker CLI reports an inaccessible daemon. These are observed environment limitations, not evidence that the proposed stack is incompatible.

Starting sources: [vault entry](../../README.md), [schema](../../SCHEMA.md), P01, [prototype brief](../../prototypes/poc-001-linked-formation.md), and [prototype README](../../../poc-001-linked-formation/README.md). Further grounding: [ADR-0003](../../adr/0003-implementation-plan-writing.md), [ADR-0004](../../adr/0004-repository-and-poc-direction.md), [ADR-0005](../../adr/0005-repository-management-and-tooling.md), [ADR-0006](../../adr/0006-contract-invariants-and-black-box-testing.md), [plan index](../../plans/README.md), root [AGENTS](../../../AGENTS.md), and [Architect role](../../../.agents/agents/architect.md). CURRENT and task-log search results were inspected for repository context; historical harness observations were not used to derive this assessment. The prior harness's report was not opened. No orchestration workflow was loaded.

## Existing evidence versus proposed components

`git ls-tree` and a hidden-file listing confirm that the prototype contains its README plus `.gitkeep` files in `src/core/`, `src/content/`, `src/view/`, `public/`, and `tests/`. There is no application source, package manifest, lockfile, configuration, installed dependency set, or executable test suite in the inspected prototype. The root [justfile](../../../justfile) exposes only `default`, `doctor`, and `export-tokens`; [doctor entry point](../../../bin/doctor) delegates to [its shell implementation](../../../scripts/doctor.sh). These are existing examples, not P01 implementations.

The simplest boundaries already proposed by P01 are:

| Proposed boundary | Responsibility and limit |
| --- | --- |
| Prototype-local package, lockfile, TypeScript/Vite/Vitest configuration and HTML | Independent install, strict typecheck, unit runner, static build and preview; relative build asset paths. No root workspace. |
| One public smoke function in `src/core/` and one test in `tests/` | Explicit constant fixture callable in a unit process. No Phaser, DOM, storage, network or presentation imports. No geometry or combat. |
| Browser entry `src/main.ts` and one minimal scene in `src/view/` | Initialize Phaser and display `TEHOM — Formation Lab` plus a labelled placeholder. No gameplay state system or imported game assets. |
| Prototype-local `bin/` and `scripts/`, thin root recipes | Six contributor commands for install/dev/typecheck/test/build/preview. Resolve paths, select the prototype working directory, preserve arguments and return child failures. |
| Prototype-local toolchain configuration and README | Pin and describe the selected Bun/runtime mode; prefer a pinned official Bun container where useful. Document only commands actually supplied and tested. |

One small dispatch implementation behind thin executable entry points is sufficient; separate logic for each recipe, a generic launcher framework, additional state/event abstractions, and a populated content layer are unnecessary for P01. Preserve the useful core/browser separation. The prototype README's broader first formation slice is delivered by P01–P04 in the index; it does not require adding the board to this harness.

## Settled constraints and remaining choices

Settled: TypeScript, Phaser, Vite, Vitest; browser-first, one screen, no backend; Bun as default package manager/runtime, prototype-local committed `bun.lock`, frozen subsequent installs; prototype-owned dependencies and configuration; root just orchestration through local scripts/executables; isolated core; meaningful test failure detection; a static build independent of credentials or an application service. Retain the existing stack and Vitest. Docker is preferred where useful, rather than an unconditional backend or a new product component.

The following are actual implementation prerequisites or bounded choices, not reasons to redesign P01:

- Establish a working pinned Bun mode. Host Bun is absent here; using the preferred container mode requires accessible Docker daemon access. This assessment does not diagnose whether the daemon limitation is caused by sandbox access, permissions, or daemon state.
- Select compatible supported dependency/runtime versions and a container image if used, consult official documentation, generate the lockfile, and prove the selected toolchain runs. No versions were selected and no image was inspected or pulled in this assignment. Any required compatibility runtime must be explicit and verified; an agreed-stack change must be reported as a blocker.
- Document the chosen host/container mode, server port handling, browser-check environment, and container ownership handling. These are ordinary scaffolding choices within the draft. Browser availability and registry connectivity were not checked.
- The plan's implementer/integration owner is still unassigned. Assignment is a coordination step before execution, not a missing architectural specification.

No decision about coordinates, sector masks, balance, targeting ties, isolation, defeat handling, patrols, or the boss is needed for P01. Those remain outside this task. Stop at the runnable shell; do not add a browser automation platform, CI rollout, assets, engine framework, or later prototype features to resolve harness verification.

## Technical skill access and application

Both names were present in the native available-skill catalog before file access. Catalog descriptions and paths establish discovery metadata only. The full canonical bodies were then read from disk with `cat`; this is separate evidence of access. The user also supplied their bodies in the task context. No inference from a path or promised skill registration was necessary.

| Native name / title | Canonical source path | Principle applied |
| --- | --- | --- |
| `ruach-testing` / **Ruach testing** | `/opt/dev/tehom-brainlab/.agents/skills/ruach-testing/SKILL.md` ([source](../../../.agents/skills/ruach-testing/SKILL.md)) | Choose the smallest public boundary exposing the required behavior. Test the core function in the unit process, CLI results through contributor commands, and visible rendering in the browser; unit success alone does not establish browser correctness. |
| `ruach-simplification` / **Ruach simplification** | `/opt/dev/tehom-brainlab/.agents/skills/ruach-simplification/SKILL.md` ([source](../../../.agents/skills/ruach-simplification/SKILL.md)) | Choose the smallest coherent design preserving useful separation. Reuse P01's core/view/tooling boundaries without generic gameplay or launcher layers; Architect proposes, Implementer implements. |

## Verification needed from the Implementer — not executed here

| Contract | Required evidence |
| --- | --- |
| Reproducible local installation | Generate and retain the local lockfile; run proposed `just poc-001-install` in a clean checkout with empty dependencies, then repeat a clean frozen install. Record versions and exit codes. |
| Real isolated core test | Proposed `just poc-001-typecheck` and `just poc-001-test` pass. The test calls the public smoke function and checks its explicit fixture contract; it is not a tautological test or a gameplay default. Run without browser globals. Inspect the core import boundary and confirm importing it creates no Phaser game. Temporarily invert the expectation, verify a nonzero command result, restore it, and rerun. |
| CLI forwarding and failure behavior | Exercise the default non-watch suite and explicit prototype-relative test paths through `just poc-001-test`; downstream plans already pass multiple files. Check argument boundaries, prototype working directory and nonzero failure propagation. Verify a clear nonzero failure for a missing selected runtime or inaccessible daemon. Existing `doctor` success cannot substitute for this failure contract. |
| Actual development screen | Proposed `just poc-001-dev` displays the required title and labelled placeholder. Record browser, URL, screenshot, console errors and unhandled rejections. If containerized, verify accessible binding with ports published on localhost. |
| Built static output | Proposed `just poc-001-build` produces `dist/`; `just poc-001-preview` serves the real build. Check local entry assets, no required backend requests, and relative assets when hosted beneath a directory. A build alone does not prove the visible scene. |
| Isolation and selected toolchain | Inspect changed paths for no root application/workspace, tracked dependency directory or other-prototype dependency. If Docker is selected, verify the pinned image contains needed tools, commands use the documented mode, and generated files retain contributor ownership. |

All six `just poc-001-*` commands are proposed and currently unavailable. Future hand-back must include the tested implementation revision, exact commands/results, entry-point paths, real shell screenshot and limitations; update TASK_LOGS and CURRENT as the implementation assignment allows. These future updates are outside this read-only-source experiment. Browser checks are separate from unit/build evidence; human combat playtests are not P01 acceptance.

## Verification performed in this assessment

Read-only commands were executed in `/opt/dev/tehom-brainlab`; all enclosing shell invocations returned exit 0. Source reads are inspection evidence, not application verification.

| Exact command | Observed result |
| --- | --- |
| `git status --short --branch` | Clean initial tree; `master...origin/master [ahead 3]`. |
| `git rev-parse HEAD` and `git rev-parse 68203a6` | Both resolved to `68203a63f37f62d55f6c58c6d988c712ee49ba95`. |
| `rg --files --hidden poc-001-linked-formation scripts bin -g '!.git/**'` | Prototype README/placeholders and existing repository scripts/entry points only. |
| `rg --files --hidden -g 'AGENTS.md' -g '!docs/mailbox/**' -g '!.git/**'` | Only root `AGENTS.md`; no nested instruction file found. |
| `git ls-tree -r --name-only 68203a6 -- poc-001-linked-formation scripts bin justfile` | Tracked baseline corroborates the prototype placeholders and existing tooling. |
| `rg -n 'poc-001-test\|test:unit\|bun run\|test-browser' docs/plans/2026-10-02-*.md` | Existing downstream drafts require filtered/multiple-file unit invocations; browser testing belongs to later slices. |
| `just --list` | Only `default`, `doctor`, `export-tokens`; no prototype recipes. |
| `uname -m` and `id -u` | `x86_64`, UID `1000`; these do not prove container support or ownership behavior. |
| `just doctor` | Exit 0; Bun unavailable on PATH; Docker CLI `29.7.2`, daemon inaccessible; just `1.40.0`, Python `3.13.5`; scaffold pending. Doctor prints environment limitations but does not fail for them. |
| `test ! -e docs/mailbox/codex-architect-injection/architect.md` | Exit 0 before creation; the assigned report did not already exist. |

Full-body reads included `cat .agents/skills/ruach-testing/SKILL.md .agents/skills/ruach-simplification/SKILL.md` and the linked role, draft, brief, README, schema, ADRs and existing doctor implementation. A task-log text search was historical context only; no historical check was counted as this run's verification.

Report validation: `git diff --no-index --check /dev/null docs/mailbox/codex-architect-injection/architect.md` returned exit 1 with no whitespace diagnostics when comparing the new report to an empty file. `git status --short` listed only `?? docs/mailbox/codex-architect-injection/`; `git diff --name-only` produced no tracked-file changes. Content was reviewed against the assignment and schema. The following exact check returned exit 0, reporting 17 relative targets, zero missing, a terminal newline and no trailing whitespace:

```sh
python3 - <<'PY'
from pathlib import Path
import re
report = Path('docs/mailbox/codex-architect-injection/architect.md')
text = report.read_text()
links = re.findall(r'\]\(([^)]+)\)', text)
missing = [target for target in links if not (report.parent / target.split('#')[0]).exists()]
print(f'Report link check: {len(links)} relative targets; {len(missing)} missing')
for target in missing:
    print(target)
assert not missing
assert text.endswith('\n')
assert all(line == line.rstrip() for line in text.splitlines())
print('Report content check: terminal newline and no trailing whitespace')
PY
```

No installation, runtime selection, application implementation, unit suite, typecheck, application build, server launch, browser check, playtest, Docker image pull, commit, push, or harness configuration was performed. The only change is this durable report.

## Implementation readiness

**Design-ready for P01 scaffolding; current session is not ready to execute its acceptance checks.** The existing draft needs no architectural replacement. Assign the Implementer, establish the usable Bun/toolchain mode, resolve versions during scaffolding, and verify all acceptance contracts before declaring the harness delivered. No new product decision is required on present evidence; compatibility failure or an agreed-stack change would require a new decision.
