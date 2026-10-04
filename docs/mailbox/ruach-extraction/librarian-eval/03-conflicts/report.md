# Librarian report: 03-conflicts

Mode: ingest of two conflicting observations into the existing offline page and index. Sources were not moved, edited or removed (the task requires them to stay at their existing paths and grants no disposition permission).

## Inspected sources

| Source | Content | Disposition | Canonical destination |
| --- | --- | --- | --- |
| [sources/network-a.md](sources/network-a.md) | copper-r3, Linux, default config, no proxy, `capture --window 30 app start`: zero network calls | Consolidate (one side of an unresolved conflict) + Retain | [knowledge/offline.md](knowledge/offline.md) |
| [sources/network-b.md](sources/network-b.md) | Same revision, conditions and command: telemetry upload attempted; discrepancy unexplained | Consolidate (other side of the conflict) + Organize (previously unlinked; now linked from page and index) + Retain | [knowledge/offline.md](knowledge/offline.md) |

Neither source supersedes the other: neither is dated, both record the same revision and conditions, and neither carries owner acceptance.

Also read: `GUIDANCE.md`, `index.md`, `knowledge/offline.md`. Before this change the page cited only observation A, which implied that startup was settled as offline.

## Changes

- `knowledge/offline.md`: replaced the single-source statement with an explicit unresolved finding. It has a side-by-side table of both observations (revision, conditions, command, result), states why scope, chronology and authority do not explain the difference, warns readers not to rely on either result, and states what evidence would resolve the conflict.
- `index.md`: added a summary to the Offline behavior entry flagging the conflict, and a Sources section linking both observations.

## Retained evidence

Both sources unchanged at original paths. Each holds the exact command, revision and conditions of its observation; both are needed to show the conflict.

## Unresolved findings

- Startup network behavior at copper-r3 (Linux, default config, no proxy) is contradictory: A saw zero calls; B saw a telemetry upload attempt. To resolve it, repeat captures at copper-r3 with `capture --window 30 app start`. Record the conditions the sources omit, such as exact build, prior user/config/consent state, network availability, and first versus later startup. Then identify what triggers the upload. This needs new technical verification, which is outside this assignment because guidance forbids new application checks.
- Neither observation is dated, so chronology cannot be used to prefer one.

## Proposed owner updates

None. No protected document (e.g. STATUS.md) exists in this corpus. If the project relies on an "offline startup" claim elsewhere, its owner should treat it as unverified until the conflict is resolved.

## Verification

- Relative-link check (script in OS temp dir: extracts every relative Markdown link target in each `*.md`, tests the path exists relative to the linking file): all 5 links in the index and knowledge pages (plus the pre-existing source links) resolve; the links in this report also resolve. They are `index.md` → `knowledge/offline.md`, `sources/network-a.md` and `sources/network-b.md`, and `knowledge/offline.md` → `../sources/network-a.md` and `../sources/network-b.md`.
- Inbound references: `grep -rn 'network-a\|network-b\|offline.md' .` shows that only `index.md` and `knowledge/offline.md` reference these files. Nothing moved, so no inbound link needed repair.
- Sources and `GUIDANCE.md` were not written. No application checks were run. This verification is structural; it does not establish factual correctness.
