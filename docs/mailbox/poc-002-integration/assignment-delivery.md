# Assignment: deliver POC 002 to master (task P2-DELIVERY)

Issued by: Coordinator, 2026-10-20. Role: **implementer** (the POC 002 integration owner). Task ID: `P2-DELIVERY`.

## Authorization

On 2026-10-20 the user authorized delivery: **fast-forward local `master` to the reviewed POC 002 integration branch, then push `master` to `origin`**.

## Candidate

- Branch `poc-002-component-combat`, tip `a295413`. Its history adds only evidence after the reviewed implementation `5f4988f`:
  - the FIX2 integration report;
  - the independent review reports, merged in `9f72ff2`;
  - your `merge-review` report.
- Independent review: `docs/mailbox/poc-002-review/rereview2.md` reports PASS with 0 blocking findings.
- The destination `master` was `c82ec3c` when the candidate was prepared, and `origin/master` was `c82ec3c` as well.

## Steps

All from the main checkout `/opt/dev/tehom-brainlab`, where `master` is checked out.

1. **Confirm the destination has not moved.** `git rev-parse master origin/master` must both print `c82ec3c71a499760fc2bf7c40c9b162a6856d03b`; run `git fetch origin` first. Confirm that `git merge-base --is-ancestor master a295413` exits 0 and that the main checkout is clean apart from this untracked assignment. If any check fails, **stop and report. Do not merge.**
2. **Confirm the content is unchanged.** `git diff --stat 5f4988f a295413` must show only `docs/mailbox/**` changes. If it shows anything else, stop.
3. **Fast-forward.** Run `git merge --ff-only a295413`. Do not rebase, squash or create a merge commit.
4. **Write the delivery report.** Write `docs/mailbox/poc-002-integration/delivery.md` in ruach-handoff format. It must give:
   - `reviewed_revision: 5f4988f`;
   - `delivered_revision` (the master tip after the fast-forward);
   - the destination branch, the outcome, and confirmation that the delivered tree contains the accepted changes;
   - the checks you ran.

   The verification evidence from `merge-fix2.md` and `rereview2.md` applies because the delivered content equals the reviewed content plus mailbox evidence; say so explicitly. Validate the report with your temporary-copy validator, then commit the report and this assignment on `master`.
5. **Push.** Run `git push origin master` and record the exact result and the remote tip.
6. **Reply** with `delivered_revision`, the report commit, and the pushed remote tip.

## Restrictions

- No other edits.
- Do not touch `docs/CURRENT.md` or `docs/TASK_LOGS.md`; the Coordinator records delivery afterwards.
- No force push.
- Do not delete branches or worktrees.
