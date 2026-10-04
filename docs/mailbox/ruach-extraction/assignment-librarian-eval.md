# Assignment: blind Librarian behavior cases

Role: Librarian. Task: `ruach-extraction`. Worker name: `ruach-libeval`.

## Purpose

Perform four small, synthetic knowledge-maintenance tasks using the supplied `ruach-librarian` skill. Your outputs are evidence of how the skill behaves; someone else will assess them later. Do the work as you judge best from the skill and each task; there is no answer key for you.

## Packet

Packet root: `/tmp/ruach-librarian-eval-IZbUka/` (an isolated temporary copy).

- Skill: `/tmp/ruach-librarian-eval-IZbUka/SKILL.md` — use this copy as the skill for every case.
- Cases, each with `task.md` and `corpus/`: `cases/01-authority`, `cases/02-revisions`, `cases/03-conflicts`, `cases/04-evidence`.

Edit only inside each case's `corpus/` as its `task.md` permits. Treat each case independently: complete a case using only its own task and corpus, and do not consult your earlier cases' outputs when doing a later one.

## Boundaries

- Do **not** read any other copy of the librarian skill or its evaluation material: in particular nothing under any `ruach-librarian/evals/` directory (in `/opt/dev/ruach` or in this Brainlab worktree's `.agents/skills/`), nor `/tmp/ruach-librarian-eval-IZbUka.pristine/`, nor `docs/mailbox/ruach-extraction/implementer.md` or other ruach-extraction reports.
- No web research, no external communication. Do not edit anything in this Brainlab worktree except your own mailbox outputs listed below. Do not touch `/opt/dev/ruach`.

## Outputs and handoff

Working in Brainlab worktree `/opt/dev/tehom-brainlab-ruach-extraction` (branch `ruach-extraction`):

1. Preserve each case's outcome under `docs/mailbox/ruach-extraction/librarian-eval/<case>/`: copy the case's final `corpus/report.md` as `report.md`, and save `changes.diff` produced by `diff -ruN /tmp/ruach-librarian-eval-IZbUka.pristine/cases/<case>/corpus /tmp/ruach-librarian-eval-IZbUka/cases/<case>/corpus` (running `diff` against the pristine copy is allowed; reading its files otherwise is not needed).
2. Write the handoff `docs/mailbox/ruach-extraction/librarian-eval.md` per `docs/SCHEMA.md` using the ruach-handoff skill (`.agents/skills/ruach-handoff/SKILL.md`); run its `scripts/validate.ts` on your own report. Briefly state, per case, what you changed, what you deliberately left alone and why, unresolved items, and the checks you ran. Note anything in the skill that was unclear or that you had to interpret.
3. Commit this assignment file unchanged, the `librarian-eval/` outputs and your report together, in one evidence-only commit on `ruach-extraction`. Do not push.
