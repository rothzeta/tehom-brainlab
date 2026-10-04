task: ruach-extraction
worker: ruach-coordinator
role: coordinator
status: complete
outcome: "Ruach extracted, reviewed and published by parent at public main be77030; Brainlab master delivered at 9090896 (source equals reviewed b02b3c6); three global links migrated to Ruach and verified by the launching parent"
destination_before: 255ed6871ec3d7897e5a2ff481f2f4f62e3eb816
reviewed_revision: b02b3c67a00219fd197fe31265e0faa338243b06
delivered_revision: 90908967cd089a826d1e0efa947c785fb9b5d8a1
evidence_revision: 07cdb12
upstream:
  repository: /opt/dev/ruach
  public: https://github.com/rothzeta/ruach
  main: be77030727074d9c10e842c08647ad4a61232152
  reviewed: be77030727074d9c10e842c08647ad4a61232152
artifacts:
  - docs/mailbox/ruach-extraction/coordinator.md
  - docs/mailbox/ruach-extraction/assignment-coordinator.md
  - docs/mailbox/ruach-extraction/implementer.md
  - docs/mailbox/ruach-extraction/implementer-followup.md
  - docs/mailbox/ruach-extraction/implementer-merge.md
  - docs/mailbox/ruach-extraction/reviewer.md
  - docs/mailbox/ruach-extraction/reviewer-delta.md
  - docs/mailbox/ruach-extraction/librarian-eval.md
  - docs/mailbox/ruach-extraction/ruach-libeval5.md
  - docs/mailbox/ruach-extraction/ruach-libeval6.md
  - docs/mailbox/ruach-extraction/librarian-drafts.patch
  - docs/mailbox/ruach-extraction/parent-verification.md
  - docs/mailbox/ruach-extraction/assignment-implementer-merge-correction.md
  - docs/CURRENT.md
  - docs/TASK_LOGS.md
verification:
  - "Coordinator ran no technical checks; evidence below is from worker reports"
  - "Ruach 25186fe: handoff 24, Herdr 107, harness-eval 59 tests exit 0 (implementer, re-run by reviewer with real exit statuses); be77030 delta: check.py and 13 installer/check tests exit 0, runtime suites reused (Markdown-only change in those skills)"
  - "Brainlab b02b3c6 and delivered 9090896: check-ruach with and without --source exit 0, test-agent-routing 14 tests exit 0, resolve librarian exit 0 (implementer-merge, reviewer-delta)"
  - "Blind Librarian cases graded by reviewer: basic 01-04 pass 4/4, strengthened 05-06 pass 2/2; single synthetic runs on the claude-opus-5.5-high route only"
  - "Global links: worker ln -sfn exit 0 for the three exact paths; the worker's own post-change verification was refused and did not run"
  - "Launching parent (parent-verification.md, 07cdb12): exact link targets and SKILL.md identities match /opt/dev/ruach/skills/<name>; validator via global ruach-handoff ok; offline Librarian resolve via global ruach-herdr ok, no submission; global harness-eval scope-check --help ok; GitHub API reports public main at be77030; all exit 0"
review:
  - "Independent review accepted 25186fe/10d7b96: 0 blocking, 5 optional"
  - "Independent delta review accepted be77030/b02b3c6: 0 blocking, 3 optional (emptied dirs after prune, name-based eval guard, alternative-route-only evaluation)"
discoveries:
  - "Under the <2% rule (ruach-impl footer: weekly limit only 1% left), new workers ran on claude-opus-5.5-high; ruach-impl was released before edits when the user redirected the follow-up"
  - "Native auto review refused untracked-draft deletion (Irreversible Local Destruction), a home skills-directory listing, and the post-link verification batch (no stated reason); delivery used the non-destructive archive retry"
  - "Parent verification resolves the historical blocker in implementer-merge.md, which stays unchanged as the worker's record; the Coordinator prompt to correction worker ruach-impl3 was refused as an auto-mode bypass and that worker never received work"
blockers: []

# Coordinator report: Ruach extraction

Assignment: [assignment-coordinator.md](assignment-coordinator.md). Workflow: feature workflow, with blind evaluation steps added. Records: [CURRENT](../../CURRENT.md#ruach-extraction-and-librarian) and [TASK_LOGS](../../TASK_LOGS.md#2026-10-04-ruach-extraction-and-librarian).

## Publication-ready revisions

| Repository | Branch | Revision | State |
| --- | --- | --- | --- |
| Ruach | `main` | `be77030727074d9c10e842c08647ad4a61232152` | reviewed; pushed to public `rothzeta/ruach` by the parent |
| Ruach | `extraction` | `be77030` | same commit, kept locally |
| Brainlab | `master` | `9090896` | delivered source, equal to reviewed `b02b3c6` outside `docs/mailbox` |
| Brainlab | `master` | `13653d7` | merge handoff (historical `blocked` status) |
| Brainlab | `master` | `07cdb12` | parent verification evidence; this report's final commit follows it |
| Brainlab | `ruach-extraction` | `9090896` | kept; contained in `master` |

Brainlab `master` has not been pushed. Pushing it is up to the parent.

## Work and evidence

- **Extraction and integration:** [implementer.md](implementer.md).
- **Pre-publication follow-up:** [implementer-followup.md](implementer-followup.md). It moved the evals out of the installed skills, added strengthened cases 05 and 06, repaired the adapter sentence and tidied the docs.
- **Delivery:** [implementer-merge.md](implementer-merge.md), using the non-destructive retry. The original drafts are preserved in [librarian-drafts.patch](librarian-drafts.patch).
- **Reviews:** [reviewer.md](reviewer.md) and [reviewer-delta.md](reviewer-delta.md). Both accept with no blocking findings. Three optional findings remain open, as listed in TASK_LOGS.
- **Blind evaluation:** [librarian-eval.md](librarian-eval.md) covers basic cases 01–04. [ruach-libeval5.md](ruach-libeval5.md) and [ruach-libeval6.md](ruach-libeval6.md) cover the strengthened cases. Outputs are under [librarian-eval/](librarian-eval/). These are single runs on synthetic fixtures, using only the Claude alternative route.

## Global links

Before the change, the three exact paths pointed to `/opt/dev/tehom-brainlab/.agents/skills/<name>`. The parent and the worker each confirmed this.

`ruach-impl2` repointed all three to `/opt/dev/ruach/skills/<name>`, and each `ln -sfn` exited 0. Native review refused the worker's own verification afterwards, so [implementer-merge.md](implementer-merge.md) records `blocked`. That report is kept unchanged as its author's historical record.

The launching parent then verified the links with its own read-only tools; see [parent-verification.md](parent-verification.md). It confirmed:
- the targets;
- the `SKILL.md` identities;
- the validator, offline resolve and scope-check help, each run through the global links;
- public `main` at `be77030`.

This resolves the historical blocker. No other global entry was listed or changed.

## Cleanup

- **Closed panes:** `w2G:p1S`, `p1T`, `p1V`, `p1W`, `p1X` and `p1Y`.
- **Closed unused worker:** `w2G:p1Z` (`ruach-impl3`). My prompt to it was refused as an auto-mode bypass, so it never received work.
- **Removed:**
  - all worker launch directories, including `/tmp/ruach-herdr-EYc2Yh`;
  - the eval packets and the merge-check logs;
  - the draft archive `/tmp/ruach-extraction-drafts-BM3NMi`. Its content is preserved in [librarian-drafts.patch](librarian-drafts.patch) and the old link targets in the merge report.
- **Removed worktree:** `/opt/dev/tehom-brainlab-ruach-extraction`.
- **Retained:** the `ruach-extraction` branches in both repositories.
- **Not pushed:** Brainlab `master`. Pushing it is up to the parent.
- **Not touched:** the parent pane `w2G:p17` and my own pane `w2G:p1R`.
