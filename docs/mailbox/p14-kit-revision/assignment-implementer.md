# Assignment P14: tactical kit revision (Implementer)

Role: `implementer` (follow `.agents/agents/implementer.md`).
Coordinator: the Claude Coordinator session in the main checkout.

## Task

Implement plan P14: `docs/plans/2026-10-06-6a0ebcdc-poc-001-tactical-kit-revision.md`. The plan's checkpoints, acceptance criteria and verification sections are your contract. Read the plan index entry and the Architect report `docs/mailbox/boss-experiments/architect.md` for context.

User decision (2026-10-06): use the plan's kit values as provisional defaults:

- Claw and Sting keep 4 damage and respect protection.
- Shelter reduces by 4, may target self or a Close ally, and stays one-hit.
- Impale keeps 6 damage, loses its protection bypass, and needs only one living Stretched partner instead of exactly two.
- Gale keeps 3 damage with bypass.
- Crosswind's behaviour is unchanged.

## Workspace

- Worktree `/opt/dev/tehom-brainlab-p14`, branch `p14-kit-revision`.
- BASE `c596d692d6da0779213d10ff9acba7564ccad902`.
- Run `just poc-001-install` first if dependencies are missing.
- P13 (independent maneuver budgets) is being implemented in parallel on another branch. The Architect found the source owners disjoint. The shared files are the prototype README, `tests/abilities.test.ts`, `src/view/CombatScene.ts` and the `tests/rf-contracts.test.ts` rules-version literal. Keep your edits to those files minimal and local, so that integration in either order stays easy. Do not touch P13's files (`src/core/transition.ts`, `commands.ts`, `state.ts`, `run-record.ts` and the maneuver accounting, as listed in the P13 plan) beyond what your own plan names.

## Restrictions

- **Test edits:** only those enumerated in the plan's test-update exception. If any other existing test needs to change, stop and report it as blocked with the reason. Do not edit it.
- **Assertions must not freeze provisional tuning.** Tests must not hard-code damage, Shelter or other kit numbers when they can read the defaults from their owner (`ABILITIES` / `DEFAULT_DAMAGE_RULES`). Earlier reviews blocked on exactly this.
- **Do not edit** plans, ADRs, the brief, `docs/CURRENT.md` or `docs/TASK_LOGS.md`. Report any needed doc corrections in your handoff instead.
- **Do not merge or push.** Commit only on your branch. Put disposable files in the OS temp directory.

## Verification (required, on your final commit)

Run every recipe from the repository root, bare: no `POC001_CHROME` or other hand-set env, and no manual build first.

- `just poc-001-test`
- `just poc-001-typecheck`
- `just poc-001-build`
- `just poc-001-test-browser`

Then do the screenshot inspection named in the plan. Record each command, its result and the tested SHA. Describe the visible kit in the playable patrol: Shelter on self, Impale against a protected target (reduced), and Impale available with one ally left.

## Expected output

1. Commit this assignment unchanged, together with `docs/mailbox/p14-kit-revision/implementer.md` and your changes.
2. The report starts with the `ruach-handoff` YAML block: revision, changed paths, verification with exact commands and results, test edits made (mapped to the plan's enumeration), discoveries and blockers.
3. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p14-kit-revision/implementer.md --repo /opt/dev/tehom-brainlab-p14` until it reports `ok: true`.

Terminal handoff: the report SHA, the tested SHA, check results, test edits, discoveries and blockers.
