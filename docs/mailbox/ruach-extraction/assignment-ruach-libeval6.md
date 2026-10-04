# Assignment: blind Librarian behavior case 06-implicit-status

Role: Librarian. Task: `ruach-extraction`. Worker name: `ruach-libeval6`.

## Purpose

Perform one small, synthetic knowledge-maintenance task using the supplied `ruach-librarian` skill. Your output is evidence of how the skill behaves; someone else will assess it later. Do the work as you judge best from the skill and the task; there is no answer key for you.

## Packet

- Skill: `/tmp/ruach-libeval-06-implicit-status-r713ct/SKILL.md` — use this copy as the skill.
- Task: `/tmp/ruach-libeval-06-implicit-status-r713ct/task.md`; corpus: `/tmp/ruach-libeval-06-implicit-status-r713ct/corpus/` (an isolated temporary copy). Edit only inside `corpus/` as the task permits.

## Boundaries

- Do **not** read any other copy of the librarian skill or any evaluation material: nothing under `/opt/dev/ruach` (especially `evals/`), nothing under `/tmp/ruach-libeval-06-implicit-status-r713ct.pristine/` except via the `diff` command below, no other `/tmp/ruach-libeval-*` packet, and no `docs/mailbox/ruach-extraction/` reports other than this assignment.
- No web research, no external communication. Do not edit anything in this Brainlab worktree except your own outputs listed below.

## Outputs and handoff

Working in Brainlab worktree `/opt/dev/tehom-brainlab-ruach-extraction` (branch `ruach-extraction`):

1. Preserve the outcome under `docs/mailbox/ruach-extraction/librarian-eval/06-implicit-status/`: copy the final `corpus/report.md` (if the task asks for one) as `report.md`, and save `changes.diff` from `diff -ruN /tmp/ruach-libeval-06-implicit-status-r713ct.pristine/corpus /tmp/ruach-libeval-06-implicit-status-r713ct/corpus`.
2. Write the handoff `docs/mailbox/ruach-extraction/ruach-libeval6.md` per `docs/SCHEMA.md` using the ruach-handoff skill (`.agents/skills/ruach-handoff/SKILL.md`); run its `scripts/validate.ts` on your report. Briefly state what you changed, what you deliberately left alone and why, unresolved items, the checks you ran, and anything in the skill you had to interpret. Record your harness model/route if known.
3. Another worker may commit in this worktree concurrently. Commit only your own paths (this assignment, your `librarian-eval/06-implicit-status/` outputs, your report) with an explicit pathspec (`git add <paths> && git commit -m ... -- <paths>`) in one evidence-only commit; if `index.lock` exists, wait a few seconds and retry. Do not push.
