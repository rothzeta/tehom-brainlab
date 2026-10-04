# Assignment: correct the merge handoff with parent link evidence

Role: Implementer. Task: `ruach-extraction`. Worker name: `ruach-impl3`.

## Context

Worker `ruach-impl2` (now released) delivered Brainlab `master` (fast-forward `255ed68` → `90908967cd089a826d1e0efa947c785fb9b5d8a1`), created Ruach `main` at `be77030727074d9c10e842c08647ad4a61232152`, and repointed three global skill links with `ln -sfn` (exit 0). Native review refused its post-change verification, so its report `docs/mailbox/ruach-extraction/implementer-merge.md` (committed in `13653d7`) says `status: blocked` with an unverified-links blocker.

The launching parent then verified the links and publication with its own read-only tools and recorded the results in `docs/mailbox/ruach-extraction/parent-verification.md`, which is untracked in this main checkout. You take over responsibility for correcting the merge report.

## Work (main checkout `/opt/dev/tehom-brainlab`, branch `master`; do not push)

1. Read `parent-verification.md` and `implementer-merge.md`.
2. Update `implementer-merge.md` so that its fields match the evidence:
   - Set `status`, `outcome`, `verification` and `blockers` accordingly.
   - Attribute the link/publication checks explicitly to the launching parent and link `parent-verification.md`.
   - Keep the statement that the worker's own post-change verification was refused and did not run. Do not claim that the refused worker checks ran.
   - Add a short note that you, `ruach-impl3`, made this correction and what changed.
   - Leave all other content as it is.
3. Validate the corrected report with the handoff validator: `bun ~/.agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/ruach-extraction/implementer-merge.md --repo /opt/dev/tehom-brainlab`. If the global path is refused, use the local installed copy `.agents/skills/ruach-handoff/scripts/validate.ts` instead and say which one you used. Bun may be at `~/.bun/bin/bun`.
4. Run no other checks and change nothing else. Do not edit `docs/CURRENT.md`, `docs/TASK_LOGS.md` or `coordinator.md`.
5. Commit exactly these files in one evidence-only commit, using an explicit pathspec:
   - this assignment, unchanged;
   - `parent-verification.md`, unchanged;
   - the corrected `implementer-merge.md`.

## Handoff

Reply with the commit SHA, the validator path you used and its exit status, and the final `status` and `blockers` values. No separate report file is needed, because the corrected `implementer-merge.md` records your change.
