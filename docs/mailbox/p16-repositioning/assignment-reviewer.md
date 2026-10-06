# Assignment P16 review (Reviewer)

Role: `reviewer` (follow `.agents/agents/reviewer.md`).
Coordinator: the Claude Coordinator session in the main checkout.

## Change under review

P16, enemy repositioning between rounds.

- **Combined, tested revision:** `d8a30c6897f09708e5c972796462ca8c0ebdc848`. It is P16 merged with the delivered P15 on `master`. Your worktree HEAD `9abd506351f9726cadd71f5d8fdb46d228f1a1dc` adds only the report.
- **Diff to review:** `69c56adec70960511927ca308e0c824d4e17e33b..d8a30c6897f09708e5c972796462ca8c0ebdc848`. The base is the delivered `master` (P13–P15, already reviewed).
- **Contract:** `docs/plans/2026-10-06-27ca8f17-poc-001-enemy-repositioning.md`.
- **Context:** the Architect report `docs/mailbox/boss-experiments/architect.md`.
- **Handoffs:** `docs/mailbox/p16-repositioning/{implementer,integration}.md`.

## User direction (2026-10-06; values are provisional defaults)

- Only enemies relocate; the Brood keep the shared maneuvers only.
- The order is: player actions, then announced attacks resolve, then surviving mobile enemies reposition, then new attacks are announced.
- Enemies move only between the reserved enemy cells (the six-slot route). Relocation never blocks Brood maneuvers.
- Not every enemy moves.
- P16 has no product route; the Collector (P17) will consume it. Its diagnostic encounter is test-only.

## Review focus

1. Every acceptance criterion is met with observable evidence.
2. **No existing test edited.** P16 has no test-edit exception; check against base.
3. **No frozen tuning.** Probe by changing provisional defaults in a scratch copy: the route, which enemies are mobile, the occupancy rules if configurable. Report what breaks and why.
4. **Preview equivalence (P09) across relocation.** No attack's origin changes mid-resolution. Records replay. Occupancy on corpse cells follows the plan's rule.
5. **Patrol and Crucible are unchanged.** The Crucible stays anchored, and the P15 R1 configured mitigation survives relocation.

## Verification (run yourself, bare)

Run every recipe from the repository root: no `POC001_CHROME` or other hand-set env, and no manual build first. Run `just poc-001-install` first if dependencies are missing. Report every exit code.

- `just poc-001-test`
- `just poc-001-typecheck`
- `just poc-001-build`
- `just poc-001-test-browser`

Also run the P16 repositioning harness and replay a relocating export (see the handoffs for the invocations).

A known, tracked issue: an occasional non-PTY exit 130 at preview shutdown after all suites pass. Report it, but it is not a P16 finding unless P16 causes it. Port 4173 may be busy; wait, and never stop another worker's process.

## Restrictions

- Review only; do not fix. Probes go in scratch copies. The worktree must be clean except for your report.
- Do not edit plans, `docs/CURRENT.md` or `docs/TASK_LOGS.md`. Do not merge or push.
- Worktree `/opt/dev/tehom-brainlab-p16r`, branch `p16-review`.

## Expected output

1. Commit this assignment unchanged, together with `docs/mailbox/p16-repositioning/reviewer.md`.
2. The report starts with the `ruach-handoff` YAML block: the reviewed revision, blocking findings (each with file:line, a failure scenario and the required fix), optional findings, and verification.
3. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p16-repositioning/reviewer.md --repo /opt/dev/tehom-brainlab-p16r` until it reports `ok: true`.

Terminal handoff: the report SHA, the verdict, the findings and check results.
