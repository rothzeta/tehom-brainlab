# Assignment P17 review (Reviewer)

Role: `reviewer` (follow `.agents/agents/reviewer.md`).
Coordinator: the Claude Coordinator session in the main checkout.

## Change under review

P17, the roaming boss with adds (the "Collector").

- **Candidate and tested revision:** `7df00d020119d1c67e85df60d5628ed418cb642c`. Your worktree HEAD `64143327c47fabb45fc2262d045000258350fc1a` adds only the report.
- **Diff to review:** `9abd506351f9726cadd71f5d8fdb46d228f1a1dc..7df00d020119d1c67e85df60d5628ed418cb642c`. The base is the P16 integrated candidate; it and P13–P16 are already reviewed and on `master`.
- **Contract:** `docs/plans/2026-10-06-79371edf-poc-001-roaming-boss-and-adds.md`. It includes the combined manual-test checklist for the user's next round.
- **Context:** the Architect report `docs/mailbox/boss-experiments/architect.md`.
- **Handoff:** `docs/mailbox/p17-collector/implementer.md`. It covers a blocked episode and a Coordinator-authorised exception: `src/core/transition.ts` `commandAbilityRules` now applies the configured directional reduction for the Crucible or the Collector. Check that the exception stayed within those bounds.

## User direction (2026-10-06; values are provisional defaults)

- **Composition and movement:** the Collector starts off-centre and relocates between rounds along the P16 route. The Warder and Censer are present from the start; nothing spawns.
- **Warder:** protects the boss only within its support range.
- **Censer:** its marked splash pressures a grouped party.
- **Boss attack:** the local attack is declared from the boss's current tile and stays committed; it never follows the party.
- **No generic reach.**
- **Facings:** Warder 4, Censer 0, boss 0.
- **Victory:** decided in `settleLifecycle`.
- **Route:** `?play=collector`.

## Review focus

1. Every acceptance criterion is met with observable evidence.
2. **No existing test edited.** P17 has no test-edit exception; check against base.
3. **No frozen tuning.** Probe by changing provisional defaults in a scratch copy: HP, damage, support range, facings, route, composition. Check which tests break for the wrong reason. P15's review blocked on exactly this.
4. **Preview equivalence (P09)** across relocation and the ward switching on and off. Records replay. Victory holds under replay through `applyAbility`.
5. **Patrol and Crucible behaviour are unchanged.**
6. **The combined manual checklist is doable as written** on the real build, covering both bosses, the split allowances and the revised kit.

## Verification (run yourself, bare)

Run every recipe from the repository root: no `POC001_CHROME` or other hand-set env, and no manual build first. Run `just poc-001-install` first if needed. Report every exit code.

- `just poc-001-test`
- `just poc-001-typecheck`
- `just poc-001-build`
- `just poc-001-test-browser`

Also run the Collector browser harness and at least one `just poc-001-replay` of a Collector export.

The known occasional non-PTY exit 130 at preview shutdown is tracked separately. Port 4173 may be busy; wait for it, and never stop another worker's process.

## Restrictions

- Review only; do not fix. Probes go in scratch copies. The worktree must be clean except for your report.
- Do not edit plans, `docs/CURRENT.md` or `docs/TASK_LOGS.md`. Do not merge or push.
- Worktree `/opt/dev/tehom-brainlab-p17r`, branch `p17-review`.

## Expected output

1. Commit this assignment unchanged, together with `docs/mailbox/p17-collector/reviewer.md`.
2. The report starts with the `ruach-handoff` YAML block: the reviewed revision, blocking findings (each with file:line, a failure scenario and the required fix), optional findings, and verification.
3. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p17-collector/reviewer.md --repo /opt/dev/tehom-brainlab-p17r` until it reports `ok: true`.

Terminal handoff: the report SHA, the verdict, the findings and check results.
