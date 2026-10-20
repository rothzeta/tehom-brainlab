# Assignment: second re-review of POC 002 (task P2-REREVIEW2)

Issued by: Coordinator, 2026-10-20. Role: **reviewer**. Same Reviewer as before.

## Workspace

- Worktree `/opt/dev/tehom-brainlab-p2-review`, branch `p2-review`.
- **Authorized once:** run `git merge --no-ff poc-002-component-combat` into `p2-review`, to bring in the integration branch evidence head `ee882a5`.
- **Reviewed implementation revision:** `5f4988f`. Confirm that later commits record evidence only.
- Commit only your report and this assignment. Do not push.

## What changed

**R1** (blocking) went to the Architect:
- brief **A3 revision**: A3-3 revised, A3-4 stepwise floored mitigation with new E54, A3-5 formula audit with new bound B7;
- Architect report section "Amendment 3b": `docs/mailbox/poc-002-component-combat/architect.md`.

The A3 revision was then implemented by P2-FIX2:
- fix handoff: `docs/mailbox/poc-002-fix2/implementer.md`;
- integration report: `docs/mailbox/poc-002-integration/merge-fix2.md`.

Review range: `0d260ce..ee882a5`.

## Acceptance conditions

1. **R1 is resolved.** Your armor-plus-Ward counterexample yields zero damage, with no out-of-range intermediate, and records successfully. A3-4 is implemented for actions, Envenom's hit and retaliation.
2. **A3 is now internally consistent.** The brief's guarantee paragraph is true for the formulas in §4–§9. Spot-check the Architect's audit with your own adversarial content, not limited to mitigation. B7 rejects as specified. All five A3-3 invariants are enforced. v1 numbers and results are unchanged, and parity records and sweep/probe output are identical.
3. **Nothing regressed.** Changes stayed within FIX2's authorized paths, and your earlier F1–F3/O1 checks still pass.
4. **Fresh bare verification passes:** the same command list as before, plus every hostile fixture under `fix1*` and `fix2`, each expected to exit non-zero.

Classify each finding as blocking or optional. This is the second fix cycle. If you find something blocking, explain whether it is a defect in the implementation or a gap in the rules.

## Report

- **Report:** `docs/mailbox/poc-002-review/rereview2.md` with a ruach-handoff block. Use `source_baseline: 0d260ce`, `reviewed_revision: 5f4988f` and `evidence_revision: ee882a5`.
- **Validation:** validate the report with your temporary-copy validator.
- **Commit:** commit the report and this assignment.
- **Reply:** the verdict and the number of blocking and optional findings.
