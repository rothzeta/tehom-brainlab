# Assignment P15 fix loop: R1 and R2 (Implementer)

Role: `implementer` (follow `.agents/agents/implementer.md`).
Coordinator: the Claude Coordinator session in the main checkout.

## Context

P15 ("Crucible", the two-phase central boss) was implemented to `docs/plans/2026-10-06-6dcd120b-poc-001-two-phase-central-boss.md`; see the handoff `docs/mailbox/p15-crucible/implementer.md`. The independent review (`docs/mailbox/p15-crucible/reviewer.md`, commit `6bd8d3c`) requested changes. Read the full review first.

**R1:** `src/core/transition.ts:43`. Calling `createCrucible` with `directionalReduction` 1 still applies a reduction of 2 to a frontal Claw.
- Required fix: honour the encounter's self-guard rule consistently in live commands, previews and record configuration and replay.
- Patrol behaviour and P14 ability damage must stay unchanged.
- Add a regression test that fails before your fix. Use a non-default reduction supplied by the test.

**R2:** `tests/browser-crucible.mjs:164`. Changing only `phaseTwoAt` from 30 to 5 makes the test fail falsely, because victory comes before the first phase-two fork.
- Required fix: use controlled, test-owned rules and states for the required traces.
- Derive product-route expectations from content. Do not depend on the default fight pacing or the provisional beat table.
- The reviewer's threshold and pattern probes must then pass.

## Workspace

- Worktree `/opt/dev/tehom-brainlab-p15`, branch `p15-crucible`, at `6bd8d3c`. That is the candidate plus the review report.
- Run `just poc-001-install` first if dependencies are missing.
- P16 is being built in parallel on top of `7537d0b`; your fix will be merged into it later. Keep the change bounded to R1 and R2.

## Restrictions

- **Existing-test edits:** none to tests that existed before P15. You may edit the P15-added tests: `tests/crucible.test.ts`, `tests/browser-crucible.mjs` and `tests/browser/crucible-*.ts`.
- **Assertions must not freeze provisional tuning.** Re-run the reviewer's four default-mutation probes (boss HP, damage, threshold, a pattern entry) in a scratch copy, and confirm that no test breaks for the wrong reason. Report the result of each probe.
- **Do not edit** plans, `docs/CURRENT.md` or `docs/TASK_LOGS.md`. Do not merge or push.

## Verification (on your final commit)

Run every recipe from the repository root, bare: no `POC001_CHROME` or other hand-set env, and no manual build first. Report the exit code of every run.

- `just poc-001-test`
- `just poc-001-typecheck`
- `just poc-001-build`
- `just poc-001-test-browser`

Also run the Crucible harness `tests/browser-crucible.mjs` (see the handoff for the invocation) and replay one exported Crucible attempt.

## Expected output

1. Commit this assignment unchanged, together with `docs/mailbox/p15-crucible/fix.md`.
2. The report starts with the `ruach-handoff` YAML block: candidate and tested SHA, changed paths, each finding with its fix and evidence, the probe results, and verification.
3. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p15-crucible/fix.md --repo /opt/dev/tehom-brainlab-p15` until it reports `ok: true`.

Terminal handoff: the report SHA, the candidate SHA, the per-finding fixes, the probe results, check results and blockers.
