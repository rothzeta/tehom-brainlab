# Assignment P16: enemy repositioning (Implementer)

Role: `implementer` (follow `.agents/agents/implementer.md`).
Coordinator: the Claude Coordinator session in the main checkout.

## Task

Implement plan P16, `docs/plans/2026-10-06-27ca8f17-poc-001-enemy-repositioning.md`. Its checkpoints, acceptance criteria and verification sections are your contract.

Read for context:

- the plan index entry;
- the Architect report `docs/mailbox/boss-experiments/architect.md`;
- the P15 handoff `docs/mailbox/p15-crucible/implementer.md`, which covers the encounter registry and the shared end-phase skeleton you build on.

User direction (2026-10-06):

- Only enemies relocate. The Brood keep their shared maneuvers only.
- Relocation happens between rounds: player actions, then announced attacks resolve, then surviving mobile enemies reposition, then new attacks are announced.
- Enemies move between the reserved enemy cells (the six-slot route). Relocation never blocks Brood maneuvers.
- Not every enemy moves.
- Values are provisional defaults.

P16 has no product route of its own; the Collector (P17) is its consumer. Its diagnostic encounter is a test-only fixture, per the plan.

## Workspace

- Worktree `/opt/dev/tehom-brainlab-p16`, branch `p16-repositioning`.
- BASE `7537d0bddc5d5409b116a3ad4919bf02cb1e7a36`, the P15 Crucible candidate.
- P15 is under independent review in parallel. If the review requires fixes, the Coordinator will tell you to merge them. Do not change P15 behaviour yourself.
- Run `just poc-001-install` first if dependencies are missing.

## Restrictions

- **No existing-test edits.** The plan says P16 needs none. If an existing test fails, stop and report the assertion and its cause; do not edit it.
- **Assertions must not freeze provisional tuning**, including the route and which enemies are mobile.
- **Do not edit** plans, ADRs, the brief, `docs/CURRENT.md` or `docs/TASK_LOGS.md`. Report any needed corrections in your handoff instead.
- **Do not merge into master or push.** Put disposable files in the OS temp directory.

## Verification (on your final commit)

Run every recipe from the repository root, bare: no `POC001_CHROME` or other hand-set env, and no manual build first.

- `just poc-001-test`
- `just poc-001-typecheck`
- `just poc-001-build`
- `just poc-001-test-browser`

Report the exit code of every run. A known non-PTY run exited 130 during preview shutdown after all suites passed; record it if it happens, do not fix it here.

Also confirm:

- preview equivalence across relocation (P09);
- record and replay of a relocating fixture;
- the plan's screenshots.

## Expected output

1. Commit this assignment unchanged, together with `docs/mailbox/p16-repositioning/implementer.md` and your changes.
2. The report starts with the `ruach-handoff` YAML block: revision, tested SHA, changed paths, verification with exact commands and results, discoveries and blockers.
3. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p16-repositioning/implementer.md --repo /opt/dev/tehom-brainlab-p16` until it reports `ok: true`.

Terminal handoff: the report SHA, the tested SHA, check results, discoveries and blockers.
