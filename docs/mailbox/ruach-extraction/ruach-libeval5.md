task: ruach-extraction
worker: ruach-libeval5
role: librarian
case: 05-redundant-source
status: complete
outcome: Triaged three synthetic source reports; removed the redundant export digest after repairing its three inbound links, re-cited and revision-scoped both knowledge pages, and recorded the outcome in report.md
artifacts:
  - docs/mailbox/ruach-extraction/assignment-ruach-libeval5.md
  - docs/mailbox/ruach-extraction/ruach-libeval5.md
  - docs/mailbox/ruach-extraction/librarian-eval/05-redundant-source/report.md
  - docs/mailbox/ruach-extraction/librarian-eval/05-redundant-source/changes.diff
verification:
  - "Corpus grep for export-digest before writing report.md: no matches (exit 1); afterwards only report.md, which names the path as code, not a link"
  - "Corpus link check (python3 one-liner recorded in report.md): links 22 bad 0"
  - "changes.diff produced by diff -ruN against the pristine corpus (exit 1, differences present)"
  - "bun .agents/skills/ruach-handoff/scripts/validate.ts on this report: ok true, no diagnostics, exit 0"
discoveries:
  - "knowledge/import.md originally cited the export digest for the import round-trip claim, which the digest does not support; the claim is now cited to the import check"
blockers: []
harness: Claude Code
model: claude-opus-5-5

# Librarian evaluation case 05-redundant-source: handoff

Author: worker `ruach-libeval5` (Librarian), running in Claude Code on Opus 5.5 (`claude-opus-5-5`). No other route information is available. Assignment: [assignment-ruach-libeval5](assignment-ruach-libeval5.md). The packet skill (`/tmp/ruach-libeval-05-redundant-source-njJPMA/SKILL.md`) was the only librarian skill read. The corpus was edited in place in the packet, and the outcome is preserved in [report.md](librarian-eval/05-redundant-source/report.md) and [changes.diff](librarian-eval/05-redundant-source/changes.diff). The Brainlab worktree HEAD at start was `91fd2aa`.

## What changed

- **Removed** `sources/export-digest.md`. I compared each line against `sources/export-run.md`, which contains every claim (the test command and its 48 passes, UTF-8 with a BOM and a header row, and the open pre-1970 `created_at` defect) with more detail. The digest's only distinct facts were its authorship (Coordinator) and date (2026-09-11), which the report records. I repaired all three inbound links in the same change: `index.md`, `knowledge/export.md`, `knowledge/import.md`.
- **`knowledge/export.md`**: now cites the export run. Its claims are scoped to slate-r5, and the defect was narrowed from "timestamps" to `created_at`, the only field the evidence covers.
- **`knowledge/import.md`**: the round-trip claim was miscited to the digest. It now cites `sources/import-check.md`, and I added that source's BOM-stripped result and semicolon rejection.
- **`index.md`**: removed the digest entry.
- **`report.md`**: created, with dispositions, retained evidence, unresolved findings, proposed owner updates and the exact checks.

## Deliberately left alone

- `sources/export-run.md` and `sources/import-check.md` are retained unchanged. They hold the unique commands, fixtures, counts and revision evidence, and the knowledge pages depend on them.
- `GUIDANCE.md` is unchanged because it is project policy.
- I gave no verdict on whether semicolon import should be supported. No source records a decision, so the page states current behavior at slate-r5 only.

## Unresolved items

These are also recorded in `report.md`:

- The pre-1970 `created_at` export defect is open at slate-r5, and its cause has not been investigated.
- Semicolon-delimited import is rejected at slate-r5, and no issue was filed. Whether that is intended is undecided.
- All claims are evidence for slate-r5 only. The corpus does not identify a current revision.

## Skill interpretation

- I treated "fully contained in retained material" as: every claim and evidence item in the digest also appears in a retained source. Authorship and date are not evidence about the product, so I preserved them in the report rather than keeping the file for them. The digest's "still open" on 2026-09-11 restates the run's status without new investigation, so I did not count it as unique evidence.
- The skill says "Remove" applies when the assignment permits it and the source has no unique evidence. I chose Remove over Superseded because nothing replaced the digest's claims; they were duplicates.
- I fixed the import page's miscitation as a lint finding within the authorized pages.
- After the edits, `report.md` mentions the removed path in code formatting. I judged that acceptable because it is a disposition record, not a link.

## Checks

- The grep and link checks are listed above and given exactly in `report.md`. I did not check slate behavior, which was out of scope.
- `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/ruach-extraction/ruach-libeval5.md`: `ok: true`, no diagnostics, exit 0. I re-ran it after the final edit to this report.
