# Assignment P06-integrate — combine P06 with delivered P04 (Implementer / integration owner)

Role: `implementer` (follow `.agents/agents/implementer.md`). You implemented P06.

## Context

While you worked, P04 (formation lab: `src/view/*`, `src/main.ts`, `scripts/prepare-assets.mjs`, `scripts/run.sh`, `package.json`, `.gitignore`, view/asset/browser tests, a P04 README section, plan/index status lines, `docs/mailbox/p04-formation-lab/`) was reviewed and delivered to local `master`. Your P06 candidate `2be2d85` (report `27b3be6`) is based on `04bd6a2`. Expected overlap: `poc-001-linked-formation/README.md`. P04 consumes P02/P03 exports (`formation.ts`, `state.ts`, `commands.ts`, `transition.ts`), which P06 extended additively, so type/behavior compatibility of the P04 view with P06's P03 changes must be verified.

## Task

1. Confirm the current local `master` revision (the P04 delivery). In `/opt/dev/tehom-brainlab-p06` on `p06-damage-and-fallen`, merge that `master` into the branch with a merge commit (no rebase, no force). Resolve conflicts within scope, preserving both P04 and P06 content; report each resolution. If resolution would change behavior or P04/P05 contracts, stop and report.
2. Verify the combined revision: full `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build`, `git diff --check`, and P04's headless Chrome browser check (`poc-001-linked-formation/tests/browser-lab.mjs`; see `docs/mailbox/p04-formation-lab/implementer.md` for the exact command) to show the lab still works with P06's P03 extensions. Confirm P04 files equal master's and P06 technical files equal `2be2d85` apart from conflict resolutions.
3. Write `docs/mailbox/p06-damage-and-fallen/integration.md` (ruach-handoff YAML first: source revisions, combined_revision, tested_revision, conflict resolutions, verification, blockers). Commit it with this assignment unchanged. Do not commit throwaway screenshots; small kept browser evidence is fine. Validate with `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p06-damage-and-fallen/integration.md --repo /opt/dev/tehom-brainlab-p06` until `ok: true`.

## Restrictions

Do not merge into `master`, push, or delete branches/worktrees. Do not edit `docs/CURRENT.md`, `docs/TASK_LOGS.md`, plans or index. Disposable files outside the repository.

## Expected output

Terminal handoff: report path, report-creating SHA, combined/tested revision, check results, blockers.
