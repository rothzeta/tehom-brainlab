# Librarian report: 01-authority

Mode: ingest of the two supplied sources into the existing storage page and index. Sources were not moved, edited or removed (the task requires them to stay at their existing paths and grants no disposition permission).

## Inspected sources

| Source | Content | Disposition | Canonical destination |
| --- | --- | --- | --- |
| [sources/decision.md](sources/decision.md) | Owner-accepted decision, 2026-09-01: local JSON storage for the first release; hosted service may be considered after offline usage is measured | Consolidate + Retain (it is the acceptance evidence) | [knowledge/storage.md](knowledge/storage.md) "Accepted direction" |
| [sources/proposal.md](sources/proposal.md) | Proposal, 2026-09-08: hosted storage for collaboration; explicitly no owner acceptance and no implementation check | Consolidate as proposed work + Organize (index entry; it was previously unlinked) + Retain | [knowledge/storage.md](knowledge/storage.md) "Proposed work" |

Also read: `GUIDANCE.md`, `index.md`, `knowledge/storage.md` (pre-change: a single line linking the decision).

## Changes

- `knowledge/storage.md`: split into accepted direction (linked to the decision), proposed work (linked to the proposal, marked as not accepted or implemented) and open questions.
- `index.md`: added a one-line summary to the Storage entry and a Sources section linking both sources with their status and date, so the previously unreferenced proposal is discoverable.

## Retained evidence

Both source files are unchanged at their original paths. The decision is the only acceptance evidence; the proposal is the only record of the hosted-storage recommendation and its rationale.

## Unresolved findings

- The later proposal does not supersede the earlier accepted decision: it carries no acceptance. Accepted direction remains local JSON storage until the project owner records otherwise.
- The decision's precondition for considering hosted storage (measured offline usage) has no supporting evidence in the corpus, and the proposal does not address it.
- No source verifies that local JSON storage is implemented at any revision. The knowledge page records a decision, not delivered behavior.

## Proposed owner updates

None. No protected document (e.g. STATUS.md) exists in this corpus. Whether to accept the hosted-storage proposal is the project owner's decision; it would need an owner acceptance record and, per the existing decision, evidence of measured offline usage.

## Verification

- Relative-link check (script in OS temp dir: extracts every relative Markdown link target in each `*.md` and tests that the path exists relative to the linking file): all 5 links in the index and knowledge pages (plus the pre-existing source links) resolve; the links in this report also resolve — `index.md` → `knowledge/storage.md`, `sources/decision.md`, `sources/proposal.md`; `knowledge/storage.md` → `../sources/decision.md`, `../sources/proposal.md`.
- Inbound references: `grep -rn 'decision.md\|proposal.md\|storage.md' .` — only `index.md` and `knowledge/storage.md` reference the sources and page; no source moved, so no inbound link required repair.
- Sources and GUIDANCE.md left unedited (confirmed by reading the final tree; no write was made to them).
- No application checks were run (none exist in the corpus and guidance forbids new ones). This verification is structural; it does not establish factual correctness.
