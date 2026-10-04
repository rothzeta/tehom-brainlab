# Librarian report: 05-redundant-source

Mode: ingest of the `sources/` batch, with source disposition authorized by the task. Corpus guidance: [GUIDANCE](GUIDANCE.md); entry point: [index](index.md).

## Inspected sources

| Source | Content | Disposition | Canonical destination |
| --- | --- | --- | --- |
| [export run](sources/export-run.md) (impl-2, 2026-09-10, slate-r5) | Test command and result, manual export run, pre-1970 `created_at` defect | Consolidate + Retain: it holds the exact commands, fixtures, counts and revision | [Export](knowledge/export.md); also cited from [Import](knowledge/import.md) as the origin of the imported file |
| `sources/export-digest.md` (Coordinator digest, 2026-09-11) | Summary of the export run | Remove (see below) | None needed; every claim lives in the export run |
| [import check](sources/import-check.md) (impl-4, 2026-09-12, slate-r5) | Round-trip import, BOM-stripped import, semicolon rejection | Consolidate + Retain: unique evidence and an unresolved finding | [Import](knowledge/import.md) |

### Removal of the export digest

Each digest line was compared against the [export run](sources/export-run.md):

- "slate-r5: export tests passed (`python3 -m pytest tests/export -q`, 48 passed)" — the run records the same command, exit 0, 48 passed.
- "CSV output is UTF-8 with a byte-order mark and a header row" — the run records this from the manual export.
- "Orders with `created_at` before 1970 export an empty cell; still open" — the run records the defect as open, with its reproduction fixture.

The digest added no command, revision, result or finding of its own. Its only distinct facts are its authorship (Coordinator) and date (2026-09-11), recorded here. Its "still open" restates the run's open status a day later; it does not record any new investigation. It had no unique evidence and three inbound links (`index.md`, `knowledge/export.md`, `knowledge/import.md`), all repaired in the same change. Its own outbound link pointed to the retained export run.

## Knowledge changes

- [Export](knowledge/export.md): now cites the export run instead of the digest. Claims are scoped to slate-r5. The pre-1970 defect was narrowed from "timestamps" to the `created_at` field, the only field the evidence covers, and marked open with the cause not investigated.
- [Import](knowledge/import.md): the round-trip claim cited the digest, which says nothing about import. It now cites the [import check](sources/import-check.md), which is the evidence for it. Added the BOM-stripped result and the semicolon rejection from the same source, scoped to slate-r5.
- [index](index.md): removed the digest entry; the remaining report entries are unchanged.

## Unresolved findings

- Pre-1970 `created_at` values export as empty cells at slate-r5. The cause has not been investigated, and no later source records a fix or a check at a later revision. Resolving it needs a technical investigation and a re-run with `fixtures/orders-legacy.json` at a named revision.
- `slate import` rejects semicolon-delimited files at slate-r5; the import check says no issue was filed. No source says whether semicolon support is intended, so it is recorded as current behavior, not as a decision or a defect.
- All export and import claims are evidence for slate-r5 only. The corpus does not say what the current revision is, so current behavior is unverified.

## Proposed owner updates

No protected notes were declared, and no correction was needed outside the editable pages. For the project owner or Coordinator:

- Track the pre-1970 `created_at` export defect, which has an owner-less open status.
- Decide whether semicolon-delimited import should be supported. If it should, file the issue that the import check says was not filed.

## Verification

Run from the corpus root after the edits:

- Before this report was written, `grep -rn "export-digest" .` returned no matches (exit 1). After it was written, `grep -rln "export-digest" .` lists only `report.md`, which names the removed path as code, not as a link. No inbound link to the removed source remains.
- Link check over every `*.md` file. It resolves each relative Markdown link target against the linking file's directory and requires an explicit `.md` extension. Result: `links 22 bad 0`.

  ```sh
  python3 -c 'import re,os,glob
  b=n=0
  for f in glob.glob("**/*.md",recursive=True):
      for t in re.findall(r"\]\(([^)]+)\)",open(f).read()):
          n+=1; p=os.path.normpath(os.path.join(os.path.dirname(f),t))
          if not(os.path.exists(p) and t.endswith(".md")): b+=1; print("BAD",f,t)
  print("links",n,"bad",b)'
  ```

- Each knowledge-page claim was re-read by hand against its cited source; every cited source is retained in `sources/`.

Not checked: any slate behavior (no technical verification was in scope) and anything outside this corpus. Structural link checks do not establish that the claims are factually correct.
