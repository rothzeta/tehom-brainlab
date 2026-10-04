# Assignment TR-design — two-ring board (Architect)

Role: `architect` (follow `.agents/agents/architect.md`). Design and plan only; do not implement source or tests.
Coordinator: Claude Coordinator session in the main checkout.

## User decision (2026-10-04)

The user decided that for this POC the arena has **only two rings** around the centre, not three: "i dont see what three would bring." Their clarification, quoted:

> some bosses will be in the midlle and a strategy will be to go wide around them vs thigt agains them, so i guess they wont be completly centered, as for encounters, thats what this pos is trying to figure out right

The Coordinator reads this as follows:

- **Board:** centre plus rings 1 and 2, giving 19 cells instead of the current 37 (radius 3).
- **The middle is enemy/boss space,** and the Brood occupy the rings around it. **Compact is "tight against" the middle:** it stays the accepted true triangle (all links distance 1; Ugallu and Girtablilu on the outer ring, which is now ring 2; Pazuzu one step inward, on ring 1, mid-side). **Spread is "wide around":** three outer-ring (ring 2) cells about 120° apart.
- **Enemy placement is deliberately not fixed.** Bosses are "in the middle" but "won't be completely centred", and encounter layout is a question this POC exists to explore. Do not design a final enemy-placement rule. Keep whatever minimal, explicitly provisional visual anchor the delivered code and later plans need (for example the centre cell and/or ring 1), and record it as an open experiment question.
- **Unchanged:** the earlier accepted Compact-triangle decisions (inward exposure: sectors cover the Brood rings so the inward Brood is hit and protected like its sector; Pazuzu inward; mid-side placement). The rest of the POC scope is also unchanged.

If any part of this reading conflicts with the brief or creates a contradiction, flag it rather than guessing silently.

## Task

1. Amend the design brief (arena row, Brood placement, Compact/Spread, maneuvers, any "37 cells"/radius-3 checks) and record this decision in its Decision record as an accepted user decision dated 2026-10-04. Keep the enemy-placement question explicit and open.
2. Amend the P02 plan for the radius-2 board. Cover: cell enumeration (19), the outer ring (12 cells) and ring 1 (6 cells) tables, the orientation count and step, the Compact and Spread mappings for every orientation, rotation/expand/contract reversibility, link distances, and the Close threshold. Justify keeping or changing the default of 2, and say whether Spread links remain Stretched. Supersede the radius-3 and CT mapping text clearly rather than deleting history.
3. Amend P05: sectors and front masks over the two Brood rings, mark/splash radius sanity on the smaller board, and protection/isolation. Amend P04 (the lab renders 19 cells, plus projection/pixel pitch and layout), P06 (fixtures stay valid?), and every later plan (P07–P12, especially the P08 enemy anchors/intentions and the P12 boss facing/sweep) for assumptions that break. Amend directly where small; otherwise list.
4. Write one bounded implementation task in `docs/plans/` (ADR-0002 filename, ADR-0003 format). Include affected files; ordered checkpoints; acceptance criteria; the exact existing tests that must change and why (as an explicit test-update exception, enumerated like the CT plan's); suites expected to pass unedited; and verification commands: `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build`, and the headless Chrome check `poc-001-linked-formation/tests/browser-lab.mjs` with screenshot inspection.
5. List questions that genuinely need the user, each with a recommended default. Use the defaults and mark them provisional; do not block.

## Context

Read `docs/CURRENT.md` (P01–P06 and the Compact triangle delivered), `docs/plans/README.md`, the brief and its Decision record, the CT plan `docs/plans/2026-10-04-fb4bf201-poc-001-compact-triangle.md`, the P02/P04/P05/P06 plans and their amendments, the prototype `README.md` public contracts, and source under `poc-001-linked-formation/src/` as needed. Prior reports are in `docs/mailbox/compact-triangle/`, `p02-*`, `p04-*`, `p05-*` and `p06-*`.

## Restrictions

- Edit only the brief, plan files, the plan index and your report. Do not touch source, tests, tooling or assets. Do not edit `docs/CURRENT.md` or `docs/TASK_LOGS.md`.
- Work and commit only in `/opt/dev/tehom-brainlab-tworing`, branch `two-ring-board`, from BASE `0a48098ff439bc84df06f5f8e965531d69e0dba2`. Commit only your own files; leave any other untracked mailbox file alone. No merge into master, no push, and no branch or worktree deletion.
- Keep disposable files in the OS temp directory.

## Expected output

- Commit this assignment unchanged with your report at `docs/mailbox/two-ring-board/architect.md` and the doc amendments.
- Start the report with the `ruach-handoff` YAML block (revision, changed paths, discoveries, open questions with defaults, blockers). Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/two-ring-board/architect.md --repo /opt/dev/tehom-brainlab-tworing` until `ok: true`.
- Terminal handoff: report path, report-creating SHA, a summary of the new mappings and threshold, open questions, blockers.
