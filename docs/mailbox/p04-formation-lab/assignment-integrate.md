# Assignment P04-integrate — combine P04 with delivered P05 (Implementer / integration owner)

Role: `implementer` (follow `.agents/agents/implementer.md`). You implemented P04.

## Context

While you worked, P05 (intent semantics: `src/core/intents.ts`, `src/core/sectors.ts`, `tests/intents.test.ts`, a P05 README section, plan/index status lines, `docs/mailbox/p05-intent-semantics/`) was reviewed and delivered. Local `master` is now `04bd6a28bd21f5248cd18de59cbf5efbc408b6a1`. Your P04 candidate `32f07c0` (report `3cfc5c2`) is based on `0d6f233`. File ownership is disjoint except possibly `poc-001-linked-formation/README.md`.

## Task

1. In `/opt/dev/tehom-brainlab-p04` on branch `p04-formation-lab`, merge `master` (`04bd6a2`) into the branch with a merge commit (no rebase, no force). Resolve any conflict within scope, preserving both P04 and P05 content; report each resolution. If resolution would change behavior or P05 contracts, stop and report instead.
2. Verify the combined revision: full `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build`, your headless Chrome `tests/browser-lab.mjs` check at 1280×800, and `git diff --check`. Confirm P05 files equal master's and P04 technical files equal `32f07c0` apart from any conflict resolution.
3. Write `docs/mailbox/p04-formation-lab/integration.md` (ruach-handoff YAML first: source revisions, combined_revision, tested_revision, conflict resolutions, verification, blockers). Commit it together with this assignment unchanged. Replace committed browser evidence only if you re-captured it, and say so. Validate with `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p04-formation-lab/integration.md --repo /opt/dev/tehom-brainlab-p04` until `ok: true`.

## Restrictions

Do not merge into `master`, push, or delete branches/worktrees. Do not edit `docs/CURRENT.md`, `docs/TASK_LOGS.md`, plans or index. Disposable files outside the repository.

## Expected output

Terminal handoff: report path, report-creating SHA, combined/tested revision, check results, blockers.
