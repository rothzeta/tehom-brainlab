# Assignment P17: roaming boss and adds, the Collector (Implementer)

Role: `implementer` (follow `.agents/agents/implementer.md`).
Coordinator: the Claude Coordinator session in the main checkout.

## Task

Implement plan P17, `docs/plans/2026-10-06-79371edf-poc-001-roaming-boss-and-adds.md`. Its checkpoints, acceptance criteria and verification sections are your contract.

Read for context:

- the plan index entry;
- the Architect report `docs/mailbox/boss-experiments/architect.md`;
- the P15 handoffs `docs/mailbox/p15-crucible/{implementer,fix}.md`, covering the registry, end-phase skeleton and configured mitigation;
- the P16 handoffs `docs/mailbox/p16-repositioning/{implementer,integration}.md`, covering mobile enemies and relocation.

User direction (2026-10-06; values are provisional defaults):

- The Collector starts off-centre, relocates between rounds along the P16 route, and fights with a Warder and a Censer that are present from the start. There are no spawns.
- The Warder protects the boss only while the boss is within its support range.
- The Censer's marked splash pressures a grouped party.
- The boss's local attack is declared from its current tile and stays committed while the player responds; it does not secretly follow the party.
- There is no generic reach: reliable attacks keep broad target access.
- The Architect's facing defaults apply: Warder 4, Censer 0, boss 0.
- Victory is decided in `settleLifecycle`, because replay calls `applyAbility` directly.
- The encounter is selected with `?play=collector`.

## Workspace

- Worktree `/opt/dev/tehom-brainlab-p17`, branch `p17-collector`.
- BASE `9abd506351f9726cadd71f5d8fdb46d228f1a1dc`, the P16 integrated candidate on top of the delivered P15.
- P16 is under independent review in parallel. If it needs fixes, the Coordinator will tell you to merge them. Do not change P16 behaviour yourself.
- Run `just poc-001-install` first if dependencies are missing.
- Port 4173 may be busy; wait for it, and never stop another worker's process.

## Restrictions

- **No existing-test edits.** The plan says P17 needs none. If an existing test fails, stop and report the assertion and its cause; do not edit it.
- **Assertions must not freeze provisional tuning:** HP, damage, support range, facings, route, composition. The reviewers on P15 probed exactly this by mutating defaults, and so will yours. Use controlled, test-owned rules and states for traces. Derive product-route expectations from content, and do not depend on default fight pacing.
- **Do not edit** plans, ADRs, the brief, `docs/CURRENT.md` or `docs/TASK_LOGS.md`. Report any needed corrections in your handoff.
- **Do not merge into master or push.** Put disposable files in the OS temp directory.

## Verification (on your final commit)

Run every recipe from the repository root, bare: no `POC001_CHROME` or other hand-set env, and no manual build first. Report every exit code.

- `just poc-001-test`
- `just poc-001-typecheck`
- `just poc-001-build`
- `just poc-001-test-browser`

Also:

- run your Collector browser harness;
- play `?play=collector` through to an outcome;
- export and replay attempts with `just poc-001-replay`;
- confirm that previews match committed results across relocation and ward on/off;
- inspect the plan's screenshots;
- check the combined manual-test checklist in the plan against the real build: every step must be doable as written. Report any step that is not.

## Expected output

1. Commit this assignment unchanged, together with `docs/mailbox/p17-collector/implementer.md` and your changes.
2. The report starts with the `ruach-handoff` YAML block: revision, tested SHA, changed paths, verification with exact commands and results, discoveries and blockers.
3. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p17-collector/implementer.md --repo /opt/dev/tehom-brainlab-p17` until it reports `ok: true`.

Terminal handoff: the report SHA, the tested SHA, check results, discoveries and blockers.
