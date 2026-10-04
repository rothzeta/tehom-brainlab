# Assignment: pre-publication follow-up

Role: Implementer. Task: `ruach-extraction`. Worker name: `ruach-impl2`.

## Context

Brainlab's reusable roles/skills were extracted into a new public repository `/opt/dev/ruach` (GitHub `rothzeta/ruach`, published later by someone else — **never push**), with a new Librarian role, `ruach-librarian` skill and `ruach-workflow-knowledge` workflow, and Brainlab now consumes a pinned Ruach snapshot. Read for context:

- Original acceptance conditions: `docs/mailbox/ruach-extraction/assignment-implementer.md`.
- Previous implementer handoff (exact earlier checks): `docs/mailbox/ruach-extraction/implementer.md`.
- Independent review — **accepted, no blockers**, optional findings 1–5: `docs/mailbox/ruach-extraction/reviewer.md`.
- Blind Librarian run outputs (4/4 basic cases passed): `docs/mailbox/ruach-extraction/librarian-eval/`.

Current exact revisions: Ruach branch `extraction` at **25186fe958450c92067d1e67224c0dc83373be9e** (`main` unborn); Brainlab worktree `/opt/dev/tehom-brainlab-ruach-extraction`, branch `ruach-extraction`, at `dcaa286` (source candidate `10d7b962e8f9c74c144c45e39e16b77cc4ae071f`; later commits are mailbox evidence only).

A previous assignment for the same fixes, `assignment-implementer-fixes.md` (uncommitted in this worktree), was **superseded by this one** before any edits were made (both trees verified clean). Commit it unchanged alongside this assignment as history; do not execute it.

The user asked for this bounded follow-up before publication. Preserve the accepted substantive implementation; change only what is listed. No real mailbox triage and no unrelated feature work.

## Changes

1. **Evals outside installed skills (finding 2).** Move developer evaluation inputs and rubrics out of `skills/ruach-librarian/` to a top-level Ruach `evals/` (e.g. `evals/ruach-librarian/`) that the installer does not copy. Skills remain self-contained for execution. Consumer snapshots and installs must contain no eval fixtures or rubrics; make the installer tests or `scripts/check.py` enforce this. Update provenance/README/CONTRIBUTING references.
2. **Strengthened behavior cases (finding 1).** Keep the four existing cases as **basic-case coverage**; do not alter their bytes except via the move (they remain attributable to the earlier 4/4 run). Add new cases (new case IDs):
   - **Evidence disposition:** a genuinely redundant source whose content is fully contained elsewhere; the task authorizes source removal; existing pages link to it, so inbound links must be repaired; the subject is authorized to act on this reversible work without asking for routine confirmation. A good outcome removes or disposes of it per authorization, repairs inbound links, and keeps unique evidence; asking for confirmation or leaving it untouched without a grounded reason should fail.
   - **Implicit authority/revision (if practical):** a variant where the accepted-vs-proposed status or which revision a check applies to must be inferred from evidence (dates, revision identifiers, owner records, command output) rather than from sources explicitly stating their own lesson. Avoid self-describing cues such as "No tests run" or "not accepted".
   - Keep fixtures small, realistic and synthetic; separate each case's `task.md` + raw `corpus/` from its expected outcomes (rubric in a separate `expected/` location) so an evaluator can receive task + skill + raw corpus only.
   - Update the evals README: describe the basic cases and the strengthened cases accurately, and keep a short "Known limits" note (synthetic, small, single runs, cue limits of the basic set).
3. **Adapter sentence (finding 3).** Repair the corrupted sentence at `skills/ruach-herdr/references/adapters.md:33` (lowercase start, lost linkage) with its original meaning; compare with `git show 255ed68:.agents/skills/ruach-herdr/references/adapters.md` in Brainlab.
4. **Consumer docs (findings 4–5, while editing).** In Brainlab, optionally add one concise line in `docs/SCHEMA.md` or `docs/mailbox/README.md` listing the known pre-contract mailbox reports (recover from `git show 255ed68:.agents/skills/ruach-handoff/SKILL.md`), and collapse the double blank lines in `.agents/README.md` and `docs/adr/0005-repository-management-and-tooling.md`.
5. **Re-pin.** Commit Ruach changes on `extraction` (new commit on top of `25186fe`; no history rewrite). Resync Brainlab's snapshot to the new Ruach SHA with the existing `just sync-ruach --source /opt/dev/ruach --revision SHA` and commit Brainlab source changes on `ruach-extraction`, separately from your report commit.

## Verification

Record each tool's **actual exit status** (unpiped, or `set -o pipefail` / `PIPESTATUS`) with counts:

- Ruach: `python3 scripts/check.py`; `python3 -m unittest discover -s tests -v` (installer/resource tests); a temp install via `scripts/install.py` showing no `evals`/rubric/fixture paths in the installed tree and its `check` passing; `git grep` portability/credential scan of the new tree; `git diff -M --stat 25186fe..HEAD` confirming the four basic cases and rubric moved as byte-identical renames.
- Brainlab: `just check-ruach`; `just check-ruach --source /opt/dev/ruach`; `just test-agent-routing`; `just agent-routing resolve librarian`; relative-link check over changed docs.
- Reuse the earlier runtime-suite evidence (handoff 24, Herdr 107, harness-eval 59) unless you change code in those skills; a Markdown-only change in `ruach-herdr/references/` does not require rerunning them. If you do change skill code, rerun that skill's suite.
- Do not run or grade the new behavior cases yourself; a separate blind evaluator will. In your report give exactly which files the evaluator should receive (skill path + each new case's task and corpus) and which it must not read.

## Restrictions

No merge to Brainlab `master`, no Ruach `main` commits, no push, no `~/.agents/skills` changes, no edits to `docs/CURRENT.md`/`docs/TASK_LOGS.md`, no deletion of mailbox reports. Disposable files in the OS temp directory. Don't weaken existing tests.

## Handoff

Write `docs/mailbox/ruach-extraction/implementer-followup.md` (ruach-handoff format; skill at `.agents/skills/ruach-handoff/SKILL.md`; run its `scripts/validate.ts` on your report) and commit it with this assignment and the superseded `assignment-implementer-fixes.md`, unchanged, in an evidence-only commit. Report: new Ruach and Brainlab source revisions; per-change disposition; new case IDs and what each tests; exact commands with exit statuses; evaluator give/withhold paths; blockers. Then wait — a merge assignment may follow.
