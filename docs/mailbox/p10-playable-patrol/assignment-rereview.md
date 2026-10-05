# Assignment P10-rereview — R1/R2 fix (Reviewer)

Role: `reviewer`. You reviewed P10. Continue in `/opt/dev/tehom-brainlab-p10` on `p10-playable-patrol`.

## Under review

- Fix range: `7580a67` (your review) .. `dfeaadeb56250d4f21168efa2950c09606e8d5e1` (fixed technical revision).
- Commit `67b847f` adds only `fix.md` and its assignment.
- Local `master` is still `767f46c`, so `dfeaade` is the new combined candidate.

## Task

1. Judge whether R1 is resolved. Activating each control must execute exactly that control's command, for maneuvers, abilities, targets, directions and end phase. Regression coverage must exist.
2. Judge whether R2 is resolved. Browser trace assertions must be independent of provisional tuning. Criterion 2 (a win and a loss through visible controls, matching headless) must still be demonstrated. No player-reachable debug, fixture-injection or teleport path may have been added (criterion 8). If a test-only entry was added, verify that it is isolated from the playable route.
3. Re-check anything the fix affected materially.
4. Verify at `dfeaade`:
   - rerun your R1 scenario and an R2 default-change probe in a throwaway copy, never on the branch;
   - `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build` and `just poc-001-test-browser`;
   - `git diff --check 7580a67..dfeaade`;
   - the unedited-tests check against `767f46c`.

## Output

Append a `## Re-review of R1/R2 at dfeaade` section to `docs/mailbox/p10-playable-patrol/reviewer.md`. Update its leading YAML block (reviewed and tested revisions, outcome, blockers) while preserving the original findings. Commit it with this assignment unchanged. Run the validator until it reports `ok: true`. Edit nothing else. Do not merge, push or rebase.

Terminal handoff: report SHA, verdict, remaining blocking and optional findings.
