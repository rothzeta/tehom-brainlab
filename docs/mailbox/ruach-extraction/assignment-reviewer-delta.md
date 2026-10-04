# Assignment: delta re-review and strengthened-case grading

Role: Reviewer. Task: `ruach-extraction`. Worker name: `ruach-review`.

You accepted Ruach `25186fe` / Brainlab `10d7b96` with five optional findings (`docs/mailbox/ruach-extraction/reviewer.md`). Before publication the user asked for a bounded follow-up addressing findings 1–3 (4–5 while editing consumer docs). A new Implementer did it; review the **delta**.

## Change under review

- Ruach `/opt/dev/ruach`, branch `extraction`: **`25186fe..be77030727074d9c10e842c08647ad4a61232152`**.
- Brainlab worktree `/opt/dev/tehom-brainlab-ruach-extraction`, branch `ruach-extraction`: source delta **`dcaa286..b02b3c67a00219fd197fe31265e0faa338243b06`** (re-pin + consumer docs). Later commits `91fd2aa`, `2bac128`, `7add98c` are mailbox evidence only.
- Follow-up assignment and handoff: `assignment-implementer-followup.md`, `implementer-followup.md` (same directory). The superseded `assignment-implementer-fixes.md` was never executed.

## Acceptance for the delta

1. Eval inputs/rubrics live outside installed skill folders (top-level `evals/`), skills stay self-contained, and installs/snapshots contain no eval material; the exclusion is enforced by checks/tests. Basic cases 01–04 and `rubric.md` are byte-identical renames.
2. Strengthened cases: `05-redundant-source` (genuinely redundant source, removal authorized, inbound links require repair, act without routine confirmation) and `06-implicit-status` (status/revision inferred from evidence, not self-describing cues). Judge whether they are realistic and fair and actually exercise those behaviors; evals README accurately describes basic vs strengthened coverage and known limits.
3. Adapter sentence repaired with original meaning (`skills/ruach-herdr/references/adapters.md`).
4. Brainlab: pinned to `be77030`, pre-contract report list and blank-line tidy-ups correct; no other behavior change; accepted substantive implementation preserved.
5. Publication scope of the new Ruach tree is still clean.
6. Assess the implementer's discovery that the installer prunes removed files but leaves emptied directories — blocking or optional?

## Verification

Record each tool's actual exit status (unpiped / pipefail) with counts. Rerun relevant installer/resource/routing checks on the exact candidates: Ruach `python3 scripts/check.py`, `python3 -m unittest discover -s tests -v`, a temp install + check; Brainlab `just check-ruach`, `just check-ruach --source /opt/dev/ruach`, `just test-agent-routing`, `just agent-routing resolve librarian`, ideally from a fresh clone of `b02b3c6`. Reuse your earlier runtime-suite evidence (handoff 24, Herdr 107, harness-eval 59) unless the delta changes code in those skills or you find a concern requiring a rerun; state which you reused.

## Grade the strengthened cases

Fresh blind Librarian sessions (route `claude-opus-5.5-high`, one per case) ran cases 05 and 06 with only `SKILL.md` at `be77030`, the case `task.md` and a raw corpus copy. Outputs: `docs/mailbox/ruach-extraction/librarian-eval/05-redundant-source/`, `.../06-implicit-status/`, handoffs `ruach-libeval5.md`, `ruach-libeval6.md`. Grade each against `/opt/dev/ruach/evals/ruach-librarian/expected/strengthened-rubric.md`, with brief justification and honest limits. The original 01–04 results stand as basic-case coverage.

## Restrictions and handoff

No source edits, merges, pushes or global-link changes; disposable files in the OS temp directory. Write `docs/mailbox/ruach-extraction/reviewer-delta.md` (ruach-handoff format, validate with its `scripts/validate.ts`) and commit it with this assignment unchanged in an evidence-only commit. Include reviewed revisions, blocking vs optional findings (file:line, scenario, fix), exact commands with exit statuses, reused evidence, case grades, and disposition (accept / changes required).
