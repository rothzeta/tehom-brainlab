# Assignment: re-review of POC 002 after review fixes (task P2-REREVIEW)

Issued by: Coordinator, 2026-10-20. Role: **reviewer**. Same Reviewer as P2-REVIEW.

## Workspace

- Worktree `/opt/dev/tehom-brainlab-p2-review`, branch `p2-review`.
- **Authorized once:** run `git merge --no-ff poc-002-component-combat` into `p2-review`, to bring in the updated integration branch, evidence head `0d260ce`.
- **Reviewed implementation revision:** `9500968`. Later commits record evidence only; confirm this with `git diff --stat 9500968 0d260ce`.
- Commit only your report and this assignment. Do not push.

## What changed since your review

Your findings F1–F3 and optional O1 went to a fix Implementer (task P2-FIX1). F2 needed a rules decision, and the Architect added **brief Amendment A3**:
- **A3-1:** content bounds B1–B6, with new edge case E52.
- **A3-2:** a new appended rejection code `limit-reached`, with new edge case E53.
- **A3-3:** no new snapshot invariant.

Evidence:
- the fix handoff: `docs/mailbox/poc-002-fix1/implementer.md`;
- the integration report: `docs/mailbox/poc-002-integration/merge-fix1.md`;
- the Architect's amendment: `docs/mailbox/poc-002-component-combat/architect.md`, section "Amendment 3".

Review range: `28d68ad..0d260ce`.

## Acceptance conditions

1. **F1 is resolved.** Impossible intent-target shapes and over-cap poison are rejected at parse and replay with specific reasons, and valid complete non-factory snapshots are still accepted. Rerun your original reproductions, including the CLI case.
2. **F2 is resolved per A3.**
   - Your multiplier case is rejected at `loadContent` and at replay.
   - Each bound B1–B6 rejects as specified, and v1 content still loads.
   - `limit-reached` behaves as A3-2 says: atomic, checked last, judged against the actual result, and shown in previews and forecasts.
   - Every accepted command in a bounded example is recordable.
   - No v1 number or formula changed, and all parity records replay unchanged.
3. **F3 is resolved.** `docs/README.md` is accurate.
4. **O1 is resolved.** UI exports carry the build revision, falling back to `unknown`.
5. **Nothing regressed.** The fix stayed within its authorized paths, and the `types.ts` change is addition-only. Existing tests and the Q05/Q06 harnesses are unchanged. A3 is internally consistent with the brief, and the implementation matches it. Probe A3 with your own black-box checks.
6. **Fresh bare verification passes:** the same eight commands as in your original assignment, plus the `just poc-002-dev` smoke test, plus `just poc-002-replay` on each fixture under `fixtures/hostile/fix1*`, each expected to exit non-zero.

Any new defect you find anywhere in the range counts. Classify each finding as blocking or optional.

## Report

- **Report:** `docs/mailbox/poc-002-review/rereview.md` with a ruach-handoff block. Use `source_baseline: 28d68ad`, `reviewed_revision: 9500968` and `evidence_revision: 0d260ce`.
- **Contents:** a verdict for each condition, the findings, and the exact commands with their results.
- **Validation:** validate the report with your temporary-copy validator.
- **Commit:** commit the report and this assignment.
- **Reply:** the verdict and the number of blocking and optional findings.
