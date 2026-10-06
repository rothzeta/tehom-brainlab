# Assignment P15: two-phase central boss, the Crucible (Implementer)

Role: `implementer` (follow `.agents/agents/implementer.md`).
Coordinator: the Claude Coordinator session in the main checkout.

## Task

Implement plan P15, `docs/plans/2026-10-06-6dcd120b-poc-001-two-phase-central-boss.md`. Its checkpoints, acceptance criteria and verification sections are your contract.

Read for context:

- the plan index entry;
- the Architect report `docs/mailbox/boss-experiments/architect.md`, including its "Follow-up: Q1 lever" section;
- the P13 and P14 handoffs and the integration handoff under `docs/mailbox/p13-maneuver-budgets/` and `docs/mailbox/p14-kit-revision/`.

User decisions (2026-10-06):

- Build the Crucible as planned, with provisional defaults: HP, damage, patterns and phase threshold.
- The **facing lever is applied**. The boss's facing changes only before each sector (beat-B) declaration, by one clockwise step from its current facing, including after a Crosswind turn. Ring-pulse declarations do not change it.
- Phase two starts at the next declaration after the boss crosses its threshold. It never replaces attacks already shown.
- The encounter is selected with `?play=crucible`. The patrol stays at `?play=patrol`.

## Workspace

- Worktree `/opt/dev/tehom-brainlab-p15`, branch `p15-crucible`.
- BASE `6ebe1703c94c2bdb404fd3bcdcfa212336a18b7c` is the P13+P14 integrated line.
- P13+P14 is under independent review in parallel. If the review requires fixes, the Coordinator will tell you to merge them in. Do not edit P13 or P14 behaviour yourself.
- Run `just poc-001-install` first if dependencies are missing.

## Restrictions

- **No existing-test edits.** The plan says P15 needs none, so existing suites must pass unedited. If one must change, or the shared end-phase skeleton cannot keep the patrol suites passing unedited, follow the plan's stop condition: keep the patrol end phase separate. If that still fails, stop and report it as blocked.
- **Assertions must not freeze provisional tuning** (boss HP, damage, threshold, patterns). Test the cadence as a rule from controlled starting facings, not as copied facing values. This is the plan's criterion 8.
- **Do not edit** plans, ADRs, the brief, `docs/CURRENT.md` or `docs/TASK_LOGS.md`. Report any needed doc corrections in your handoff.
- **Do not merge into master or push.** Put disposable files in the OS temp directory.

## Verification (on your final commit)

Run every recipe from the repository root, bare: no `POC001_CHROME` or other hand-set env, and no manual build first.

- `just poc-001-test`
- `just poc-001-typecheck`
- `just poc-001-build`
- `just poc-001-test-browser`

Also:

- Inspect the plan's screenshots.
- Play `?play=crucible` through both phases in the browser harness.
- Export the attempt and replay it with `just poc-001-replay`.
- Confirm that the preview matches committed results, including around the phase transition.

## Expected output

1. Commit this assignment unchanged, together with `docs/mailbox/p15-crucible/implementer.md` and your changes.
2. The report starts with the `ruach-handoff` YAML block: revision, tested SHA, changed paths, verification with exact commands and results, discoveries and blockers.
3. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p15-crucible/implementer.md --repo /opt/dev/tehom-brainlab-p15` until it reports `ok: true`.

Terminal handoff: the report SHA, the tested SHA, check results, discoveries and blockers.
