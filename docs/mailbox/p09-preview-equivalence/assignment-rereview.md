# Assignment P09-rereview — R1/R2 fix (Reviewer)

Role: `reviewer`. You reviewed P09. Continue in `/opt/dev/tehom-brainlab-p09` on `p09-preview-equivalence`.

## Under review

The fix range is `61aac67` (your review) to `aac806868a211997258ca75fca52554f4ce01641` (the fixed technical revision). Commit `eb24a93` adds only `fix.md` and its assignment. Local `master` is still `35586e8`, so `aac8068` is the new combined candidate.

## Task

1. Judge whether R1 is resolved. When the real `applyCommand` accepts a command, the preview must return the accepted immediate result and carry the real typed forecast rejection, also for invalid selector tuning. Live state must stay unmutated. There must be no parallel validator that can diverge from the real boundary. Test coverage must be adequate.
2. Judge whether R2 is resolved. The browser assertion must be independent of provisional tuning and still able to catch wrong rendering. The fix must add no new production debug surface beyond the bounded fixture.
3. Re-check anything the fix affected materially.
4. Verify at `aac8068`:
   - rerun your R1 probe and the R2 tuning variation;
   - `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build`;
   - both browser checks;
   - `git diff --check 61aac67..aac8068`;
   - the unedited-tests check against `35586e8` (excluding `preview.test.ts` and `browser-preview.mjs`).

## Output

Append a `## Re-review of R1/R2 at aac8068` section to `docs/mailbox/p09-preview-equivalence/reviewer.md`. Update its leading YAML block (reviewed and tested revisions, outcome, blockers) while preserving the original findings. Commit it with this assignment unchanged, and run the validator until it reports `ok: true`. Edit nothing else. Do not merge, push or rebase.

Terminal handoff: report SHA, verdict, and remaining blocking and optional findings.
