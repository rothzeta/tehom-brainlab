# Assignment P13+P14 integration (Implementer)

Role: `implementer` (follow `.agents/agents/implementer.md`). You own the integration of P13 and P14.
Coordinator: the Claude Coordinator session in the main checkout.

## Task

In your worktree `/opt/dev/tehom-brainlab-p13`, on branch `p13-maneuver-budgets`, now at `4e29315983e199e512fc8358e1f5dad3d0c26d8a`, merge in this order:

1. `boss-experiments` at `5c3e6146696bff0a02c214c14d480581291cebab`. These are Architect plan updates only (Crucible facing lever); docs, with no source change.
2. `p14-kit-revision` at `3688256661f3dfd28d94e7a4f08453c1742789a1`. This is the P14 tactical kit revision, already verified on its own branch. Its handoff is `docs/mailbox/p14-kit-revision/implementer.md`.

Use merge commits; do not rebase or squash. Both branches are local refs in this repository.

Resolve conflicts within the scope of both plans:

- P13: `docs/plans/2026-10-06-e8cec63d-poc-001-split-maneuver-budgets.md`.
- P14: `docs/plans/2026-10-06-6a0ebcdc-poc-001-tactical-kit-revision.md`.

Known overlap:

- The prototype README.
- `tests/abilities.test.ts`.
- `src/view/CombatScene.ts`.
- The `tests/rf-contracts.test.ts` rules-version literal. P14's K4 composes the version from `PATROL_VERSION` and `BROOD_RULES_VERSION` but keeps the v2 envelope. **The integrated result must keep P13's v3 envelope with P14's `p14-v1` kit**, so the record and rules version is the v3 envelope, `patrol-v2` and `p14-v1`, composed from owners.

Also check behavioural interaction, not just textual conflicts. P13 changes maneuver accounting, and P14 changes the Impale and Shelter conditions that depend on links. For example, Expand, then Impale, then Contract in one phase is now legal under P13. Confirm that previews and records stay equivalent for such interleavings.

## Restrictions

- **Test edits:** only conflict resolution that combines the two plans' already-authorised edits (P13's enumeration plus RR1, P14's K1–K4). If any other existing test needs a semantic change, stop and report it as blocked.
- **Assertions must not freeze provisional tuning.**
- **Do not edit** plans, ADRs, the brief, `docs/CURRENT.md` or `docs/TASK_LOGS.md`.
- **Do not merge into master or push.** Put disposable files in the OS temp directory.

## Verification (on the final combined commit)

Run every recipe from the repository root, bare: no `POC001_CHROME` or other hand-set env, and no manual build first.

- `just poc-001-test`
- `just poc-001-typecheck`
- `just poc-001-build`
- `just poc-001-test-browser`

P14 observed one non-PTY run of `just poc-001-test-browser` that exited with code 130 after every suite had passed. Run it at least twice and report each exit code. If 130 recurs, report the conditions you observed; do not change the runner.

Also run both plans' extra browser and replay checks on the combined commit:

- P14's `tests/browser-p14-kit.mjs`.
- A native export and replay covering one interleaved phase: rotation, shape change and abilities.
- Rejection of an old record.

Inspect the screenshots each plan names.

## Expected output

1. Commit this assignment unchanged, together with `docs/mailbox/p13-maneuver-budgets/integration.md`.
2. The report starts with the `ruach-handoff` YAML block. It gives the source revisions, the combined revision, the conflict resolutions, verification with exact commands and results, and the tested SHA.
3. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p13-maneuver-budgets/integration.md --repo /opt/dev/tehom-brainlab-p13` until it reports `ok: true`.

Terminal handoff: the report SHA, the combined and tested SHA, check results, conflict resolutions and blockers.
