# Ingest report: 06-implicit-status

Mode: ingest of `sources/` into `knowledge/` and `index.md`. Sources and `decisions/log.md` are unchanged.

## Inspected

`GUIDANCE.md`, `index.md`, `decisions/log.md`, `knowledge/cache.md`, `knowledge/network.md`, `sources/eviction-design.md`, `sources/retry-report.md`, `sources/ci/run-4411.txt`, `sources/ci/run-4420.txt`. All were read in full. The corpus has no version control, so revisions are identified by the `ash-rN` labels inside the sources.

## Source dispositions

| Source | Disposition | Destination and reason |
| --- | --- | --- |
| [eviction-design.md](sources/eviction-design.md) | Consolidate + Retain | [Cache](knowledge/cache.md), as a *reported, unaccepted* change. It conflicts with the accepted 2026-09-02 TTL decision and its test claim is unsupported, so it is retained as evidence for an unresolved finding. |
| [retry-report.md](sources/retry-report.md) | Consolidate + Retain | [Network](knowledge/network.md). It reports the implementation of the accepted 2026-09-20 decision at ash-r8 and adds that the last error is returned. It is retained for implementation provenance. |
| [ci/run-4411.txt](sources/ci/run-4411.txt) | Retain + Organize | Indexed. It is cited in [Cache](knowledge/cache.md) only to show that it does **not** verify LRU (it tested ash-r6). |
| [ci/run-4420.txt](sources/ci/run-4420.txt) | Consolidate + Retain + Organize | [Network](knowledge/network.md): the retry-suite verification at ash-r8. Indexed. |

Nothing was removed, moved or marked superseded. The task doesn't authorize removal, and every source is still cited.

## Changes

- `knowledge/cache.md`: the old page stated "LRU, capacity 10,000 … Verified by CI run 4411" as current fact. It now shows eviction as **unresolved**:
  - the accepted decision (TTL, 15 min);
  - lee's reported LRU change at ash-r7, kept as a claim that has not been accepted or confirmed;
  - the finding that nothing verifies LRU;
  - what would resolve the conflict.

  The storage statement is unchanged.
- `knowledge/network.md`: the old page said "Requests are sent once…", which had no cited source. It now describes retries with exponential backoff (200 ms start, at most 5 attempts) and separates three things: the accepted decision, the reported implementation at ash-r8, and the scope of CI run 4420. The old statement is kept as marked history.
- `index.md`: one-line status notes on the knowledge entries, a Sources section linking all four sources, and a link to this report.

## Unresolved findings

1. **Cache eviction policy conflict.** [decisions/log.md](decisions/log.md) (dana, 2026-09-02) records TTL expiry with a 15-minute TTL. [eviction-design.md](sources/eviction-design.md) (lee, 2026-09-18) says LRU with capacity 10,000 replaced TTL and was merged as ash-r7. There is no later decision entry, so LRU has no recorded acceptance, and a reported merge does not count as acceptance. Chronology explains the order of events but not which policy has authority. Resolution needs dana's decision. To confirm current behavior, a test run covering eviction at ash-r7 or later, or an inspection of `cache/evict.py` at the current revision, would also be needed.
2. **Unsupported verification claim.** eviction-design.md says "Tests: CI run 4411 green". Run 4411 tested `revision: ash-r6` and started 2026-09-17T14:02:11Z. That is before the reported ash-r7 merge and before the report's date of 2026-09-18, so it cannot verify the LRU change. The old cache page repeated this claim as "Verified by CI run 4411", and that statement has been removed. The corpus contains no CI run at ash-r7.
3. **Retry verification scope.** Run 4420 at ash-r8 ran only `make test-retry` (18 passed). The corpus has no full-suite run at ash-r8 or later, so eviction and the rest of the suite are untested at the revision that includes both reported changes. The retry test contents are not in the corpus, so the specific parameters (200 ms, 5 attempts) are confirmed by the decision and kai's report, not by inspected tests.
4. **Current revision unknown.** The latest revision in the evidence is ash-r8. The pages make no claim about later revisions.

## Proposed owner updates (dana, `decisions/log.md`)

The log is protected and was not edited. Proposal: add an eviction entry that either:

- (a) accepts LRU eviction, capacity 10,000, as delivered in ash-r7 per [eviction-design.md](sources/eviction-design.md), and records that it supersedes the 2026-09-02 TTL decision; or
- (b) reaffirms the 15-minute TTL and directs that ash-r7 be reverted.

Once dana decides, `knowledge/cache.md` should be updated to match. No correction is proposed for the storage or retry entries, which match the sources.

## Verification

- Relative-link check (a local Python script that resolves every inline Markdown link target in each `*.md` under `corpus/` against the filesystem): every link resolves after this report was added. Before the report existed, the only broken link was `index.md -> report.md`.
- Inbound references: the corpus has no links into `knowledge/cache.md` or `knowledge/network.md` other than from `index.md` and this report. All existing outbound links from the knowledge pages were kept or re-checked. No files were moved or renamed.
- `diff -ruN` against the pristine corpus: changes are limited to `index.md`, `knowledge/cache.md`, `knowledge/network.md` and the new `report.md`. `sources/` and `decisions/log.md` are byte-identical.
- Not checked: whether the code at any revision behaves as described. No code, test contents or later CI runs are in the corpus. These checks are structural and do not establish factual correctness or independent review.
