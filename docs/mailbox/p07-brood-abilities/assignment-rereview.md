# Assignment P07-rereview — R1/R2 fix (Reviewer)

Role: `reviewer`. You reviewed P07. Continue in `/opt/dev/tehom-brainlab-p07` on `p07-brood-abilities`.

## Under review

- Fix range: `20eb00c` (your review) to `90e96d301bcbe7886755425b489123d87c455776`, the fixed technical revision.
- Commit `9c39c01` adds only the fix report `fix.md`, the traces artifact and the assignment.
- Local `master` is still `08dc630`, so `90e96d3` is the new combined candidate.

## Task

1. Judge whether R1 is resolved. The exact Shelter arithmetic must use explicit, test-owned tuning. Dispatcher invariants must tolerate default changes and still detect missing mitigation and incorrect eligibility or consumption. Coverage must not be weakened. Production code and the other tests must be unchanged.
2. Judge whether R2 is satisfied. There should be six real executed traces with revision and rules version.
3. Re-check anything else the fix materially affected.
4. Verify at `90e96d3`:
   - rerun your default-override probe;
   - run `just poc-001-test`, `just poc-001-typecheck` and `just poc-001-build`;
   - run `git diff --check 20eb00c..90e96d3`;
   - run `git diff --exit-code 08dc630 90e96d3 -- poc-001-linked-formation/tests ':!poc-001-linked-formation/tests/abilities.test.ts'`.

## Output

Append a `## Re-review of R1/R2 at 90e96d3` section to `docs/mailbox/p07-brood-abilities/reviewer.md`. Update its leading YAML block (reviewed and tested revisions, outcome, blockers) and preserve the original findings in the body. Commit it with this assignment unchanged, and run the validator until it reports `ok: true`.

Edit nothing else. Do not merge, push or rebase. Finish with a terminal handoff: report-creating SHA, verdict, and remaining blocking and optional findings.
