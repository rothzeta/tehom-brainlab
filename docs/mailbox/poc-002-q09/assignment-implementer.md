# Assignment: POC 002 checkpoint Q09 (integrated verification and end-to-end harness)

Issued by: Coordinator, 2026-10-19. Role: **implementer** (the POC 002 integration owner). Task ID: `P2-Q09`.

## Workspace

- Worktree `/opt/dev/tehom-brainlab-poc002`, branch `poc-002-component-combat`. Start after your merge-q08 step is committed.
- Commit there only. Do not push or merge into `master`.
- Disposable files go in the OS temporary directory.

## Scope

Implement and verify checkpoint **Q09** exactly as defined in `docs/plans/2026-10-19-db0bad72-poc-002-component-combat.md`, section "Q09 — Integrated verification and end-to-end harness", acceptance items 1–5.

**Owned paths:**
- `poc-002-component-combat/tests/browser-gauntlet-e2e.mjs`
- `poc-002-component-combat/tests/q09-*.test.ts`
- your standing paths: the root `justfile` POC 002 recipes, root `README.md` POC 002 text, and `poc-002-component-combat/README.md`

Q09 item 1 needs a **test hook on `createAudio`** to observe requested cues. If that hook does not already exist in `src/audio/**` or the app wiring, stop (S4) and report the smallest change you need. Do not add it yourself.

**Integration-only fixes:** if full verification fails because of a defect in checkpoint code, report it with the failing command and output. Do not fix it unless the Coordinator authorizes the specific fix.

## Verification

Run the full Q09 item 4 list bare from the repository root, with no `POC002_*` or Chrome overrides, all at one revision. Also run:
- the `just poc-002-dev` smoke test;
- `just --list`;
- `git diff --check`;
- `git diff --stat 19af724..HEAD -- poc-001-linked-formation shared docs/CURRENT.md docs/TASK_LOGS.md`, which must be empty.

Record every command, its exit code, and the test and assertion counts.

## Hand-back

- **Report:** `docs/mailbox/poc-002-q09/implementer.md` with a ruach-handoff block. Use `source_baseline` = the merge-q08 tip, and `candidate_revision` = `tested_revision` = the final Q09 revision.
- **Contents:**
  - the Q09 acceptance mapping 1–5;
  - the whole-plan acceptance criteria 1–5 (plan "Acceptance criteria (whole plan)"), mapped to evidence across all merge reports;
  - the final sweep and probe signal summary;
  - a list of all Coordinator-granted ownership exceptions (Q03, Q04, Q08) and where they are recorded.
- **Validation:** validate the report with your temporary-copy validator.
- **Commit:** commit the work, this assignment unchanged, and the report.
- **Reply:** the final revision and a pass/fail line.
