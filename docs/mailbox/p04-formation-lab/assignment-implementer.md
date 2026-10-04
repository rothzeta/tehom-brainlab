# Assignment P04-impl — formation lab (Implementer)

Role: `implementer` (follow `.agents/agents/implementer.md`).
Coordinator: Claude Coordinator session in the main checkout.

## Task and scope

Implement plan P04, [Inspect and maneuver the linked formation in a readable browser lab](../../plans/2026-10-02-9d81c6df-poc-001-formation-lab.md): all its checkpoints, required contracts and numbered acceptance criteria. Resolve its proposed implementation defaults explicitly and record each one (value, source, reason) in your report.

- Workspace: `/opt/dev/tehom-brainlab-p04`, branch `p04-formation-lab`, BASE `0d6f2335` (= local `master` at assignment time). Work and commit only here.
- File ownership: the plan's proposed view/projection/rendering files under `poc-001-linked-formation/src/view/`, `poc-001-linked-formation/scripts/prepare-assets.mjs` (or an equivalent prototype-local script), asset-copy and view tests under `poc-001-linked-formation/tests/`, minimal wiring in `src/main.ts`, prototype `README.md` (document the lab's public behavior/limits), and prototype `package.json`/`bun.lock` only if a script entry is genuinely required.
- Consume P02 (`src/core/formation.ts`, `hex.ts`) and P03 (`src/core/state.ts`, `commands.ts`, `transition.ts`) through their public exports. Do not change P02/P03 core semantics or their tests. If P04 needs a core change, stop and report it as a blocker/discovery instead.
- Do not touch `src/core/intents.ts` or `src/core/sectors.ts`: a parallel P05 task owns them on another branch.
- Keep root `assets/` (SVG masters, manifest, license, credits) unchanged. No shared engine, no cross-prototype code, no general asset pipeline, no combat previews (P09 owns those).

## Context

- Read `docs/CURRENT.md` (P01–P03 status), the [plan index](../../plans/README.md), the plan itself, `poc-001-linked-formation/README.md`, and the P03 handoff `docs/mailbox/p03-command-boundary/implementer.md` (public contracts) and `reviewer.md` (open optional findings O1–O3; do not fix them here).
- Tooling: Bun, Docker by default. Run commands from the worktree root via `just poc-001-install`, `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build`, `just poc-001-dev`/`poc-001-preview`. Docker access may need sandbox escalation; ask for approval rather than switching to host mode.
- Testing follows `docs/adr/0006-contract-invariants-and-black-box-testing.md` and the `ruach-testing` skill: assert observable contracts, not implementation details. You own new tests. Do not modify existing P01–P03 tests.

## Acceptance conditions

1. Every numbered acceptance criterion in the P04 plan is met, with observable evidence mapped criterion-by-criterion in the report.
2. Existing suite still passes; typecheck and build pass.
3. Browser-facing criteria are checked in a real browser (automated headless Chrome capture at the plan's 1280×800 viewport is acceptable, as P01 did); state exactly what was and was not exercised. Unit tests do not substitute for browser evidence, and no human playtest may be claimed.
4. Placeholder mode and a failed image request are exercised as the plan requires.

## Verification instructions

Run on your final committed candidate: full `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build`, the browser checks above, and `git diff --check`. Record exact commands, exit codes, counts and the tested revision.

## Restrictions

- Do not edit `docs/CURRENT.md`, `docs/TASK_LOGS.md`, the plan files, or the plan index; propose any corrections in your report.
- Do not merge into `master`, push, or delete branches/worktrees.
- Disposable files (screenshots you do not keep, logs, caches) go to the OS temp directory, not the repository. Keep only evidence worth reading later; small screenshots may be committed under `docs/mailbox/p04-formation-lab/` if they support a criterion.

## Expected output

- Commit this assignment file unchanged together with your report at `docs/mailbox/p04-formation-lab/implementer.md`.
- The report starts with the `ruach-handoff` YAML block (`.agents/skills/ruach-handoff/SKILL.md`): candidate/tested revision, changed paths, verification, discoveries, blockers. Run its validator (`bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p04-formation-lab/implementer.md --repo /opt/dev/tehom-brainlab-p04`) and fix until `ok: true`.
- Reply with a concise terminal handoff: report path, report-creating SHA, technical candidate SHA, pass/fail summary, blockers.
