# Follow-up assignment: agent artifact conventions R1 (task CONV-impl-r1)

Issued by: Coordinator, 2026-10-04. Same worker, worktree, and branch as `assignment-implementer.md`. Commit this file unchanged with your updated report.

Your discoveries surfaced current guidance that still contradicts the user's decisions. Fix these three places:

1. **ADR-0005** (`docs/adr/0005-repository-management-and-tooling.md:17`). The user decided on 2026-10-04 to retire `.agents/scratch/`. Amend the ADR to record that decision, following the ADR's existing status/amendment style (check `docs/adr/README.md` and the other ADRs for precedent). State that disposable files now live outside the repository and that durable findings and assignments go to `docs/mailbox/`. Keep the original decision text intact. Mark it as amended with the date and point to the SCHEMA section.
2. **Draft plans P04–P12** (`docs/plans/2026-10-02-*.md`, every plan whose status is Draft). Minimally reword the hand-back instruction so the implementer returns evidence in its mailbox handoff and the Coordinator records TASK_LOGS/CURRENT. Do not touch the delivered plans P01–P03 or any other plan content.
3. **ADR-0003:47** (`docs/adr/0003-implementation-plan-writing.md`). Add a minimal clarification that the Coordinator records the task log entry and the CURRENT update from worker handoffs. Keep the amendment style consistent with item 1.

Still out of scope: CURRENT.md, TASK_LOGS.md, historical mailbox reports, code and tests.

Verification: repeat your repo-wide searches, showing no remaining current-guidance contradictions (list only historical matches); run `git diff --check ec32b59..HEAD`; validate the updated report. Code is unchanged, so the test suites need not be rerun unless you touch something they cover.

Update `docs/mailbox/agent-artifact-conventions/implementer.md`, adding an R1 section and updating `candidate_revision`/`tested_revision`. Revalidate it, commit, and reply with a 3-line summary that includes the new candidate SHA.
