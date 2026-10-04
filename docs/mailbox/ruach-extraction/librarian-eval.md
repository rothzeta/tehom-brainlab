task: ruach-extraction
worker: ruach-libeval
role: librarian
status: complete
outcome: "Completed the four blind Librarian cases (01-authority, 02-revisions, 03-conflicts, 04-evidence) using the packet skill copy; each case's final report.md and changes.diff are preserved under librarian-eval/. No source was moved or removed in any case."
baseline: c999037
artifacts:
  - docs/mailbox/ruach-extraction/librarian-eval.md
  - docs/mailbox/ruach-extraction/assignment-librarian-eval.md
  - docs/mailbox/ruach-extraction/librarian-eval/01-authority/report.md
  - docs/mailbox/ruach-extraction/librarian-eval/01-authority/changes.diff
  - docs/mailbox/ruach-extraction/librarian-eval/02-revisions/report.md
  - docs/mailbox/ruach-extraction/librarian-eval/02-revisions/changes.diff
  - docs/mailbox/ruach-extraction/librarian-eval/03-conflicts/report.md
  - docs/mailbox/ruach-extraction/librarian-eval/03-conflicts/changes.diff
  - docs/mailbox/ruach-extraction/librarian-eval/04-evidence/report.md
  - docs/mailbox/ruach-extraction/librarian-eval/04-evidence/changes.diff
verification:
  - "Per case: ad hoc relative-link checker (scratch script, resolves every relative Markdown link target against the linking file) reports no missing targets in index, knowledge pages, sources or report.md"
  - "Per case: grep for inbound references to every source and knowledge page; nothing moved, so no inbound repair was needed"
  - "Case 04: anchor #read-only-persistent-deployments matches the heading found by grep -n '^## ' knowledge/operations.md"
  - "Per case: diff -ruN pristine vs working corpus lists only index.md, knowledge/*.md and report.md (no source, GUIDANCE.md or STATUS.md change)"
  - "bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/ruach-extraction/librarian-eval.md --repo . exit 0, ok true, baseline resolved"
review: not-run
discoveries:
  - "Case reports are copied verbatim, so their relative links (sources/..., knowledge/...) resolve inside each case corpus, not in this Brainlab worktree"
  - "Skill interpretation points are listed under 'Skill interpretation' below"
blockers: []

# Librarian evaluation handoff: ruach-libeval

Author: worker `ruach-libeval` (Librarian). Assignment: [assignment-librarian-eval.md](assignment-librarian-eval.md). Worktree base: `c999037` on `ruach-extraction`.

I used only the packet skill `/tmp/ruach-librarian-eval-IZbUka/SKILL.md`. I did not invoke the harness `ruach-librarian` skill, because it loads the worktree copy that the assignment puts out of bounds. I did not read any `evals/` directory, the pristine packet (beyond running `diff`), or other ruach-extraction reports. Each case was done in order, using only that case's `task.md` and `corpus/`. No case output was consulted when doing a later case.

## Per-case summary

### 01-authority ([report](librarian-eval/01-authority/report.md), [diff](librarian-eval/01-authority/changes.diff))

- **Changed:** `knowledge/storage.md` now separates the accepted direction (local JSON storage for the first release, owner-accepted 2026-09-01) from proposed work (hosted storage, 2026-09-08, not accepted or implemented). It also has open questions. `index.md` gains summaries and a Sources section, which makes the previously unlinked proposal discoverable.
- **Left alone:** both sources, because the task requires them to stay at their existing paths and grants no disposition. I did not treat the later proposal as superseding the decision, because it has no acceptance.
- **Unresolved:** the decision's precondition (measured offline usage) has no evidence. No source verifies that local JSON storage is implemented.

### 02-revisions ([report](librarian-eval/02-revisions/report.md), [diff](librarian-eval/02-revisions/changes.diff))

- **Changed:** `knowledge/search.md` previously claimed that fuzzy search was verified by the test report. That report tests copper-r1, before fuzzy matching existed, and the copper-r2 change ran no tests and changed the suite. The page now separates copper-r2 implementation (unverified) from historical copper-r1 verification (exact command, 12 tests, exit 0). `index.md` gains summaries and a Sources section.
- **Left alone:** owner-only `STATUS.md`, which claims "copper-r2 has passed all tests". The report returns a proposed replacement to the owner, with sources.
- **Unresolved:** copper-r2 needs a new test run, which guidance forbids here. The extent of the test-suite change is unknown.

### 03-conflicts ([report](librarian-eval/03-conflicts/report.md), [diff](librarian-eval/03-conflicts/changes.diff))

- **Changed:** `knowledge/offline.md` cited only observation A, which implied that offline startup was settled. It now records an explicit unresolved conflict. A side-by-side table shows A (zero network calls) and B (telemetry upload attempted) at the same revision, platform, config and command. The page explains why scope, chronology and authority do not reconcile the two results, and says what evidence would resolve the conflict. `index.md` flags the conflict and links both sources.
- **Left alone:** both sources. I did not pick a winner, because neither observation is dated or accepted.
- **Unresolved:** the conflict itself, which needs repeat captures that record the conditions the sources omit.

### 04-evidence ([report](librarian-eval/04-evidence/report.md), [diff](librarian-eval/04-evidence/changes.diff))

- **Changed:**
  - `knowledge/startup.md` now cites the primary investigation for cache population and records that permission-denied errors create no cache entry.
  - The summary's extra "avoids repeated scans" claim is attributed to the summary alone.
  - `knowledge/operations.md` gains a synthesized, unresolved "Read-only persistent deployments" section: the failing conditions, `app scan --root locked-fixture` exit 7 `EACCES`, and the fact that the retry after a permission change does not resolve the read-only case.
  - `index.md` gains summaries and a Sources section.
- **Left alone:** both sources, although removal was permitted. `details.md` holds unique failed-probe evidence and an unresolved finding. `summary.md` was not removed because its "avoids repeated scans" claim does not appear in `details.md`. Removing it would leave a canonical claim supported only by an unavailable record.
- **Unresolved:**
  - The read-only deployment failure needs a fix or decision, then a new check.
  - The summary's claim, which goes beyond the detailed report, needs confirmation.

## Skill interpretation

- **Which skill copy to use:** the role says to use `ruach-librarian`, but the assignment requires the packet copy and forbids other copies. I followed the assignment and read the packet file directly.
- **Index scope:** the skill's "Organize" disposition and "navigation" do not say whether an index should list raw sources or only synthesized pages. In every case I added a Sources section to the existing index so that every source, including previously unlinked ones, is discoverable.
- **Redundancy for removal (case 04):** "no unique evidence" could mean unique *evidence* (commands, results) or any unique *claim*. I read it at claim level, together with "Removal must not leave a canonical claim supported only by an unavailable record". On that reading, a summary that adds a claim is not redundant. A stricter evaluator might expect `summary.md` to be removed after its claim was consolidated.
- **"Current revision" (case 02):** the skill does not say how to describe which revision is current. I wrote "latest revision recorded in the sources", because no source establishes deployed or checked-out state.
- **Case report format:** the skill says to use "the assignment's handoff format". The case tasks list required content but no format, so the case reports are plain Markdown sections, without the ruach-handoff YAML block.
- **Link checking:** the skill asks for checks of changed links and inbound references, but the corpora have no documentation checker. I used an ad hoc script plus grep, and the case reports describe them exactly.
- **Conflict resolution guidance (case 03):** "state what would resolve the conflict" required me to suggest conditions to record. These suggestions are labelled as needs, not as findings.

## Verification

- Link check: for each of the four cases, the scratch script `links.sh <corpus>` (extracts `](target)` from each `*.md` and tests that the target exists relative to the linking file) reported only `OK` lines after the final edits. An earlier run flagged a literal `](target)` inside backticks in the report prose. I reworded it to avoid the false positive and reran the check.
- Diff scope: `diff -ruN <pristine>/cases/<case>/corpus <work>/cases/<case>/corpus` (exit 1, meaning differences found) lists only `index.md`, `knowledge/*.md` and `report.md` for every case. Its output is saved as each case's `changes.diff`.
- Handoff validation: `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/ruach-extraction/librarian-eval.md --repo .` → exit 0, `"ok":true`, no diagnostics, `baseline` resolved to `c9990377a0f1fc47cf4067439894b1fa09266a6e`. It was rerun after this line was edited.
- Not checked: factual correctness of the synthetic content, rendering, and independent review. No application checks exist or were run.
