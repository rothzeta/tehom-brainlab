# Assignment P13+P14 merge to local master (Implementer)

Role: `implementer` (follow `.agents/agents/implementer.md`). You own integration and merging.
Coordinator: the Claude Coordinator session in the main checkout.

## Accepted candidate

- **Reviewed and tested code:** `7904f9f0e13572e103cb5eb0b363e5c9fc54902f`. The independent review found no blocking or optional findings.
- **Delivery candidate:** `fb50de9` on branch `p13p14-review`. Get its full SHA with `git rev-parse p13p14-review`. It is the reviewed code plus the integration and review reports; docs only, with no prototype change.
- **Destination:** local `master` in the main checkout `/opt/dev/tehom-brainlab`. Expected current SHA: `70b6ede002e6a09e31522d1343d29796672dfb28`.

## Steps

1. Confirm `master` is exactly `70b6ede002e6a09e31522d1343d29796672dfb28` and the main checkout is clean. If either is not true, stop and report blocked.
2. In `/opt/dev/tehom-brainlab`, run `git merge --ff-only <full SHA of p13p14-review>`.
3. Confirm the delivered state:
   - `git diff --exit-code 7904f9f0e13572e103cb5eb0b363e5c9fc54902f master -- poc-001-linked-formation` exits 0 (no prototype difference from the reviewed code).
   - The reviewer's report exists on `master`.
   Verification evidence is reused because the content is unchanged; do not rerun the suites.
4. Write `docs/mailbox/p13-maneuver-budgets/delivery.md`. Start it with the `ruach-handoff` YAML block: candidate, destination, final revision and merge outcome, and the relation to the verified candidate. Commit it, with this assignment unchanged, on `master` in the main checkout.
5. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p13-maneuver-budgets/delivery.md --repo /opt/dev/tehom-brainlab` until it reports `ok: true`.

## Restrictions

- Do not push.
- Do not touch `docs/CURRENT.md`, `docs/TASK_LOGS.md` or the other worktrees.

Terminal handoff: the final `master` SHA, the merge outcome and blockers.
