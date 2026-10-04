# Librarian report: 04-evidence

Mode: ingest and consolidation of two startup sources into the existing Startup and Operations pages and index. The task permits removing a redundant source after its unique evidence is preserved and its inbound references are repaired. I removed no source: neither is redundant (see dispositions).

## Inspected sources

| Source | Content | Disposition | Canonical destination |
| --- | --- | --- | --- |
| [sources/details.md](sources/details.md) | copper-r4 investigation: successful startup populates cache; permission-denied creates no valid cache entry; unique failed probe `app scan --root locked-fixture` exit 7 `EACCES` (read-only directory, missing cache file); retry succeeded after permissions changed; unresolved on read-only persistent deployments | Consolidate + Retain (unique failed-probe evidence and an unresolved finding; also the target of `summary.md`'s link) | [knowledge/startup.md](knowledge/startup.md), [knowledge/operations.md](knowledge/operations.md#read-only-persistent-deployments) |
| [sources/summary.md](sources/summary.md) | copper-r4 summary: startup caching avoids repeated scans after a successful first scan; "summarizes the detailed report" | Consolidate + Retain. Not removed: its claim that caching *avoids repeated scans* does not appear in `details.md`, which states only that successful startup populates cache. Removing it would leave that canonical claim supported only by an unavailable record. | [knowledge/startup.md](knowledge/startup.md) |

Also read: `GUIDANCE.md`, `index.md`, `knowledge/startup.md`, `knowledge/operations.md`.

## Changes

- `knowledge/startup.md`: cites the primary investigation for "successful startup scan populates cache". The page previously cited only the summary for that claim. The page attributes the "avoids repeated scans" claim to the summary alone and records that permission-denied errors create no valid cache entry. It links to Operations for the read-only failure rather than duplicating it.
- `knowledge/operations.md`: replaced the bare pointer with a synthesized "Read-only persistent deployments" section. It covers the failing conditions, the exact failing command and its exit status and error, and the cache consequence, and states that the successful retry after the permission change does not resolve the read-only case. It is marked unresolved, cites the investigation, and states what would resolve it.
- `index.md`: added a summary to each knowledge entry and a Sources section linking both sources.
- No source moved or removed, so no inbound link needed repair.

## Retained evidence

- `sources/details.md` is retained: it is the only record of the failed probe (`app scan --root locked-fixture`, exit 7, `EACCES`, read-only directory plus missing cache file, later successful retry) and of the unresolved read-only deployment failure. Its key facts are also reproduced in Operations with a link back.
- `sources/summary.md` is retained: it is the only source for the repeated-scan-avoidance claim, and it links to `details.md`.

## Unresolved findings

- Startup on read-only persistent deployments fails at copper-r4 (`EACCES`, exit 7, no valid cache entry). Resolving it needs a fix or a decision, then a new check at the fixed revision. Guidance forbids running new application checks, so that check is outside this assignment.
- `summary.md` describes itself as a summary of `details.md`, yet it adds a claim (`avoids repeated scans`) that `details.md` does not contain. Either the detailed evidence was incomplete, or the summary overstates it. Confirming it needs the summary author's source or a check of repeated startups at copper-r4. Until then, the claim is attributed to the summary only.
- The investigation does not say how many runs or which platform. The only revision label is copper-r4.

## Proposed owner updates

None. No protected document (e.g. STATUS.md) exists in this corpus. If the project owner wants `summary.md` removed later, the repeated-scan claim first needs supporting evidence in a retained source or must be dropped from Startup.

## Verification

- Relative-link check (script in OS temp dir: extracts every relative Markdown link target in each `*.md`, tests the path exists relative to the linking file): all 10 links in the index and knowledge pages (plus the pre-existing source links) resolve; the links in this report also resolve. These include `knowledge/startup.md` → `operations.md` and the pre-existing `sources/summary.md` → `details.md`.
- Anchor: `grep -n '^## ' knowledge/operations.md` shows the heading `## Read-only persistent deployments`, which matches the `#read-only-persistent-deployments` fragment used in `knowledge/startup.md` and in this report.
- Inbound references: `grep -rn 'details.md\|summary.md\|startup.md\|operations.md' .` shows that `details.md` is referenced by `index.md`, both knowledge pages and `sources/summary.md`, and `summary.md` by `index.md` and `knowledge/startup.md`. All targets exist, since nothing was removed.
- Sources and `GUIDANCE.md` were not written. No application checks were run. This verification is structural; it does not establish factual correctness.
