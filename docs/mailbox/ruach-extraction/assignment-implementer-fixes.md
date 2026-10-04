# Assignment: review follow-up fixes

Role: Implementer. Task: `ruach-extraction`. Worker name: `ruach-impl`.

Independent review accepted Ruach `25186fe` and Brainlab `10d7b96` with no blocking findings and five optional ones: see `docs/mailbox/ruach-extraction/reviewer.md` ("Optional findings"). Because Ruach is about to become public and installed into consumers, apply the following bounded fixes. Same workspaces, branches and restrictions as your first assignment (`assignment-implementer.md`): Ruach branch `extraction` only (no `main` commits, never push), Brainlab worktree branch `ruach-extraction`, no merge, no global-link changes, no edits to `docs/CURRENT.md`/`docs/TASK_LOGS.md`.

## Fixes

1. **Finding 2 — evaluator answers shipped to consumers.** Move the Librarian behavioral evaluation material out of the installed skill, e.g. to a top-level Ruach `evals/ruach-librarian/` (or equivalent) that the installer does not copy, so consumer snapshots and global installs no longer contain `expected/rubric.md` or the fixture corpora. **Do not change fixture or rubric content** (the blind run at `25186fe` must stay attributable to the same bytes); a pure move plus path updates is intended. Update provenance, README/CONTRIBUTING references, `scripts/check.py` / installer tests as needed so the exclusion is checked.
2. **Finding 1 — record the known limits, do not redesign now.** In the evals README (Ruach), add a short "Known limits" note: sources carry explicit cues; shared guidance enforces several behaviors; case 04's `summary.md` holds a claim absent from `details.md`, so the removal and inbound-link-repair path is untested; over-caution and confirmation gates are untested; results come from one sequential synthetic run. Keep it concise; new cases are follow-up work, not this assignment.
3. **Finding 3.** Repair the corrupted sentence at `skills/ruach-herdr/references/adapters.md:33` so it reads correctly with its original meaning.
4. **Finding 4.** Add one concise line in Brainlab `docs/SCHEMA.md` or `docs/mailbox/README.md` naming the known pre-contract mailbox reports that the baseline `ruach-handoff/SKILL.md` used to list (recover the list from `git show 255ed68:.agents/skills/ruach-handoff/SKILL.md`).
5. **Finding 5.** Collapse the double blank lines in `.agents/README.md` and `docs/adr/0005-repository-management-and-tooling.md`.

Then commit the Ruach fixes on `extraction`, resync Brainlab's snapshot to the new Ruach SHA with the existing `just sync-ruach` tooling, and commit Brainlab source changes on `ruach-extraction` (separately from your report commit).

## Verification

Rerun, recording each tool's **actual exit status** (unpiped or with `set -o pipefail`/`PIPESTATUS`) and counts: Ruach `python3 scripts/check.py`, `python3 -m unittest discover -s tests`, `bun install --frozen-lockfile && bun test` in `skills/ruach-herdr` (the edited skill; others only if touched); a temp install showing no `evals`/`rubric` in the installed tree and `check` passing; Brainlab `just check-ruach`, `just check-ruach --source /opt/dev/ruach`, `just test-agent-routing`, `just agent-routing resolve librarian`; relative-link check over changed docs; `git grep` portability/credential scan of the new Ruach tree. Confirm with `git diff -M` that moved fixture/rubric files are byte-identical renames.

## Handoff

Write `docs/mailbox/ruach-extraction/implementer-fixes.md` (ruach-handoff format, validate with its `scripts/validate.ts`) and commit it with this assignment unchanged. Report the new Ruach and Brainlab source revisions, per-fix disposition, exact commands with exit statuses, and blockers. Then wait for the next assignment.
