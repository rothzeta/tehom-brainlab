# Assignment P15 merge to local master (Implementer)

Role: `implementer` (follow `.agents/agents/implementer.md`). You own integration and merging for P15.
Coordinator: the Claude Coordinator session in the main checkout.

## Accepted candidate

- **Reviewed and tested code:** `4523be2ef4c6b317f3b09fb26b39d126b1673641`. The re-review approved it with no remaining findings; the report commit is `ed62bc2` on branch `p15-review`.
- **Destination:** local `master` in the main checkout `/opt/dev/tehom-brainlab`. Expected current SHA: `283a7ba87418982420b1e3dab266f51466b9d0f3`.
- `master` has advanced since P15 branched (`6ebe170`), but only with docs: the P13/P14 delivery report and the Coordinator records. No prototype change.

## Steps

1. In `/opt/dev/tehom-brainlab-p15` (branch `p15-crucible`), run `git merge --ff-only p15-review` to pick up the review report.
2. Merge `master` (`283a7ba87418982420b1e3dab266f51466b9d0f3`) into `p15-crucible` with a merge commit. Any conflicts must be docs-only. If a conflict touches `poc-001-linked-formation/`, stop and report blocked.
3. Confirm `git diff --exit-code 4523be2ef4c6b317f3b09fb26b39d126b1673641 HEAD -- poc-001-linked-formation` exits 0. Verification evidence is reused because the content is unchanged; do not rerun the suites.
4. Confirm `master` is still exactly `283a7ba87418982420b1e3dab266f51466b9d0f3` and the main checkout is clean, otherwise stop. Then, in `/opt/dev/tehom-brainlab`, run `git merge --ff-only <full SHA of p15-crucible HEAD>`.
5. Write `docs/mailbox/p15-crucible/delivery.md`. Start it with the `ruach-handoff` YAML block: candidate, destination, final revision, merge outcome, and the relation to the verified candidate. Commit it on `master` in the main checkout, together with this assignment unchanged.
6. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p15-crucible/delivery.md --repo /opt/dev/tehom-brainlab` until it reports `ok: true`.

## Restrictions

- Do not push.
- Do not touch `docs/CURRENT.md`, `docs/TASK_LOGS.md` or other worktrees.

Terminal handoff: the final `master` SHA, the merge outcome and blockers.
