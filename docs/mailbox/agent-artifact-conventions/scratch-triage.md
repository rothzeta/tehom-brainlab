---
task: CONV-triage (R1 CONV-triage-r1)
status: complete
outcome: "Classified all 49 legacy files. After R1, 14 sources are kept: 33 legacy Coordinator assignments are copied verbatim to the mailbox and the cleanup report also carries nine session IDs. The other 35 are trash candidates."
role: implementer
worker: scratch-triage
artifacts:
  - docs/mailbox/agent-artifact-conventions/assignment-scratch-triage.md
  - docs/mailbox/agent-artifact-conventions/scratch-triage.md
  - docs/mailbox/worktree-cleanup-20261004/implementer-scratch-triage.md
  - docs/mailbox/agent-artifact-conventions/assignment-triage-r1.md
  - "docs/mailbox/routing-p02/assignment-*.md (9 verbatim copies)"
  - "docs/mailbox/versioned-agent-skills/assignment-*.md (24 verbatim copies)"
verification:
  - "Read all 49 source files and all 344 regular archive members without extracting or executing them."
  - "Fourteen repo-root scratch copies match preserved committed mailbox objects byte for byte."
  - "All nine historical worktree branch tips resolve and equal their recorded revisions."
  - "Manifest/source comparison passes: 49 unique rows, exact sizes and totals, valid keep destinations; all original SHA-256 values unchanged."
  - "All new Markdown links resolve; assignment bytes and other branch refs are unchanged."
  - "Keyword content scan has only benign instruction/verification matches; five targeted credential patterns find no values in the three added files."
  - "git diff --check e70f49b..HEAD passes on the preservation candidate; staged evidence whitespace check passes before the recording commit."
  - "Both new reports pass the ruach-handoff validator with explicit --repo and existing revisions; ok true, diagnostics empty."
  - "R1: all 33 copies are SHA-256 equal to their sources; 110730 bytes (27382 routing-p02, 83348 versioned-agent-skills)."
  - "R1: secret-pattern scan of the 33 copies finds no credential values; keyword matches are benign instructions."
  - "R1: nine session-ID rows match pane-cleanup-before.json field by field."
  - "R1: links resolve, git diff --check e6d5c35..HEAD passes, and both updated reports validate ok true."
review: not-run
discoveries:
  - "Exact inventory is 49 files / 647657 bytes; the earlier 50-file estimate is stale."
  - "Repo-root trial and observer evidence exists on preserved experiment branches rather than this branch."
  - "Unique worktree/pane cleanup outcomes are preserved as historical observations; source logs omit commands and per-removal exit codes."
  - "R1: the copied assignments are cited by their old .agents/scratch paths in committed reports; the R1 section maps each old name to its mailbox copy."
blockers: []
inspected_baseline: e70f49b1a6ca41e0aba4ff33015d9dc749439410
r0_candidate_revision: efc14c28344eec6516b594efd16832249e8849e3
r1_baseline: e6d5c353189b4d2c35c38a2f2a50f2de37419f6f
candidate_revision: 783b98ff915ffb485f151349937b67df0e92b6fc
tested_revision: 783b98ff915ffb485f151349937b67df0e92b6fc
---

Author: Implementer (scratch-triage), 2026-10-04 UTC. Assignment: [scratch triage](assignment-scratch-triage.md). All source paths below are relative to `/opt/dev/tehom-brainlab/.agents/scratch/`. The source checkout is read-only throughout this assignment. Work is confined to branch `agent-artifact-conventions`; no merge, push, source deletion or pane operation is performed.

## Result and totals

| Disposition | Source files | Source bytes | Preserved form |
| --- | ---: | ---: | --- |
| Keep | 14 | 346950 | One curated [historical cleanup report](../worktree-cleanup-20261004/implementer-scratch-triage.md) (four sources), plus 33 verbatim Coordinator assignments from nine source files and one archive ([R1](#r1-legacy-assignments-and-session-ids)) |
| Trash | 35 | 300707 | Findings already preserved, or transient output, fixtures and scripts |
| Total | 49 | 647657 | Every source file has one manifest row |

Totals reflect R1. The original triage kept 3 files (4361 bytes) and marked 46 (643296 bytes) as trash. Keep means the unique content is preserved in the destination. It does not require copying the raw file, except for the R1 assignments, which are byte-for-byte copies. The kept archive's byte count covers the whole archive; only its 24 assignment members (83348 expanded bytes) are copied, and the rest is transient. Trash is a disposition for the later cleanup worker, not a deletion performed here. The five archives count as five filesystem files; their 344 regular members were also read for classification. Their expanded size is 1822723 bytes. No archive, raw output, dependency cache or private session dump is committed.

## Comparison evidence

P02 overlays/probes duplicate the documented property-order finding, corrected test and verification: [Implementer](../p02-formation-algebra/implementer.md), [verification](../p02-formation-algebra/verification.md), [Reviewer](../p02-formation-algebra/reviewer.md), [delivery](../p02-formation-algebra/delivery.md), and the [P02 plan](../../plans/2026-10-02-2e228a2b-poc-001-formation-algebra.md). Routing CLI help and wait output are superseded by [routing implementation](../agent-routing/implementer.md), [review](../agent-routing/reviewer.md), [delivery](../agent-routing/delivery.md), and the [routing/P02 Coordinator report](../routing-p02/coordinator.md). Related exact checks were also compared with TASK_LOGS. These existing reports remain unchanged. The routing/P02 Coordinator assignments are not superseded by any plan. No agent-routing plan exists, and the reports cite the assignments by scratch path. R1 copies them verbatim; see [R1](#r1-legacy-assignments-and-session-ids).

The 14 repo-root copies are byte-identical to Git objects at the following preserved revisions. These files are absent from this branch, but their durable copies remain committed and reachable. No copy or experiment merge is needed to preserve them; use `git show <commit>:<path>` to read them.

| Evidence ID | Preserved branch | Commit | Committed mailbox folder | Matching scratch files |
| --- | --- | --- | --- | ---: |
| D1 | `task/repo-root-command` | `a2b23ae422f47c70cdbc637ada9e914e1678f6e9` | `docs/mailbox/repo-root-command/` | 2 |
| D2 | `evidence/repo-root-20261004` | `6e448cb282e645f389f1b04a4c31a276524724c8` | `docs/mailbox/repo-root-discovery/` | 12 |

D2 includes the original failed supplemental routing acceptance, the separate passing feature acceptance, scope and session/install audits, assignment and observer report. Marking these local copies trash does not discard the failed result or its dependency caveat.

| Archive | Regular members | Expanded bytes | Existing durable evidence / discarded content |
| --- | ---: | ---: | --- |
| `versioned-agent-skills-eval-scratch.tar.gz` | 1 | 229 | Temporary scope allowlist; [evaluator implementation](../versioned-agent-skills/implementer-eval.md) preserves scope and results. |
| `versioned-agent-skills-handoff-scratch.tar.gz` | 13 | 29187 | Corpus, portability and concurrent-load probes/logs; [handoff implementation](../versioned-agent-skills/implementer-handoff.md), [timeout correction](../versioned-agent-skills/implementer-handoff-fix.md) and [diagnostic-order note](../versioned-agent-skills/implementer-handoff-doc.md) preserve findings. |
| `versioned-agent-skills-herdr-scratch.tar.gz` | 74 | 449594 | Native/probe/test output and intermediate editing/report scripts; [Herdr implementation](../versioned-agent-skills/implementer-herdr.md), [fix](../versioned-agent-skills/implementer-herdr-fix.md), [routing](../versioned-agent-skills/implementer-herdr-routing.md), [visibility gate](../versioned-agent-skills/implementer-herdr-claude-gate.md), [contract correction](../versioned-agent-skills/implementer-herdr-contract.md) and [permissions](../versioned-agent-skills/implementer-herdr-codex-permissions.md) preserve results and limitations. |
| `versioned-agent-skills-main-scratch.tar.gz` | 30 | 310817 | Integration matrices, raw snapshots and scripts; [integration](../versioned-agent-skills/integration-main.md) and [delivery](../versioned-agent-skills/delivery.md) preserve results, failed-observer caveats and confirmed duplicate-name behavior. |
| `versioned-agent-skills-scratch.tar.gz` | 226 | 1032896 | 24 unique Coordinator assignments, now copied verbatim to `docs/mailbox/versioned-agent-skills/assignment-*.md` (R1); copied skill versions, caches, fixtures and probe logs; 66 regular members exactly match tracked files. [Design](../versioned-agent-skills/architect.md), [integration](../versioned-agent-skills/implementer-integration-3.md), [review](../versioned-agent-skills/reviewer.md), [re-review](../versioned-agent-skills/reviewer-2.md), [final re-review](../versioned-agent-skills/reviewer-3.md) and [Coordinator](../versioned-agent-skills/coordinator.md) preserve the required findings. |

## Manifest

Sizes are exact filesystem bytes at inventory time. A dash means no new destination is needed. Paths within the destination column are repository-relative.

| Legacy path | Bytes | Decision | Destination | Reason |
| --- | ---: | --- | --- | --- |
| `p02/r1/formation-reordered.ts` | 4088 | trash | — | Temporary property-order overlay; fix and before/after results are preserved in P02 verification and reviewer reports. |
| `p02/review-probes/output-probe.mjs` | 1125 | trash | — | Temporary output/property-order probe; actual outputs, command and finding are preserved in the P02 reviewer report. |
| `routing-p02/A-impl-wait.json` | 638 | trash | — | Transient launch/wait output; worker route, model, pane, session and lifecycle facts are preserved in routing-p02/coordinator.md. |
| `routing-p02/A-merge-wait.json` | 638 | trash | — | Transient launch/wait output; worker route, model, pane, session and lifecycle facts are preserved in routing-p02/coordinator.md. |
| `routing-p02/A-review-wait.json` | 638 | trash | — | Transient launch/wait output; worker route, model, pane, session and lifecycle facts are preserved in routing-p02/coordinator.md. |
| `routing-p02/B-fix-wait.json` | 638 | trash | — | Transient launch/wait output; worker route, model, pane, session and lifecycle facts are preserved in routing-p02/coordinator.md. |
| `routing-p02/B-impl-resolve.json` | 843 | trash | — | Transient launch/wait output; worker route, model, pane, session and lifecycle facts are preserved in routing-p02/coordinator.md. |
| `routing-p02/B-impl-wait.json` | 638 | trash | — | Transient launch/wait output; worker route, model, pane, session and lifecycle facts are preserved in routing-p02/coordinator.md. |
| `routing-p02/B-merge-wait.json` | 638 | trash | — | Transient launch/wait output; worker route, model, pane, session and lifecycle facts are preserved in routing-p02/coordinator.md. |
| `routing-p02/B-rereview-wait.json` | 638 | trash | — | Transient launch/wait output; worker route, model, pane, session and lifecycle facts are preserved in routing-p02/coordinator.md. |
| `routing-p02/B-review-start.json` | 844 | trash | — | Transient launch/wait output; worker route, model, pane, session and lifecycle facts are preserved in routing-p02/coordinator.md. |
| `routing-p02/B-review-wait.json` | 638 | trash | — | Transient launch/wait output; worker route, model, pane, session and lifecycle facts are preserved in routing-p02/coordinator.md. |
| `routing-p02/assignments/A-implementer.md` | 6872 | keep | `docs/mailbox/routing-p02/assignment-a-implementer.md` | R1: verbatim Coordinator assignment, copied unchanged (SHA-256 equal). No agent-routing plan exists; the agent-routing reports cite this scratch path. |
| `routing-p02/assignments/A-merge.md` | 2091 | keep | `docs/mailbox/routing-p02/assignment-a-merge.md` | R1: verbatim Coordinator assignment, copied unchanged (SHA-256 equal). No agent-routing plan exists; the agent-routing reports cite this scratch path. |
| `routing-p02/assignments/A-reviewer.md` | 4344 | keep | `docs/mailbox/routing-p02/assignment-a-reviewer.md` | R1: verbatim Coordinator assignment, copied unchanged (SHA-256 equal). No agent-routing plan exists; the agent-routing reports cite this scratch path. |
| `routing-p02/assignments/B-fix-R1.md` | 2026 | keep | `docs/mailbox/routing-p02/assignment-b-fix-r1.md` | R1: verbatim Coordinator assignment, copied unchanged (SHA-256 equal). No agent-routing plan exists; the agent-routing reports cite this scratch path. |
| `routing-p02/assignments/B-implementer.md` | 4483 | keep | `docs/mailbox/routing-p02/assignment-b-implementer.md` | R1: verbatim Coordinator assignment, copied unchanged (SHA-256 equal). No agent-routing plan exists; the agent-routing reports cite this scratch path. |
| `routing-p02/assignments/B-merge.md` | 1655 | keep | `docs/mailbox/routing-p02/assignment-b-merge.md` | R1: verbatim Coordinator assignment, copied unchanged (SHA-256 equal). No agent-routing plan exists; the agent-routing reports cite this scratch path. |
| `routing-p02/assignments/B-rereview.md` | 1439 | keep | `docs/mailbox/routing-p02/assignment-b-rereview.md` | R1: verbatim Coordinator assignment, copied unchanged (SHA-256 equal). No agent-routing plan exists; the agent-routing reports cite this scratch path. |
| `routing-p02/assignments/B-reviewer.md` | 3555 | keep | `docs/mailbox/routing-p02/assignment-b-reviewer.md` | R1: verbatim Coordinator assignment, copied unchanged (SHA-256 equal). No agent-routing plan exists; the agent-routing reports cite this scratch path. |
| `routing-p02/assignments/final-record.md` | 917 | keep | `docs/mailbox/routing-p02/assignment-final-record.md` | R1: verbatim Coordinator assignment, copied unchanged (SHA-256 equal). No agent-routing plan exists; the agent-routing reports cite this scratch path. |
| `routing-p02/check-routing-docs.py` | 2406 | trash | — | Disposable validation script; checks and results are preserved in routing delivery and TASK_LOGS. |
| `routing-p02/evidence/claude-help.txt` | 22040 | trash | — | Raw CLI help; inspected flags, versions and documentation findings are preserved in agent-routing reports. |
| `routing-p02/evidence/codex-help.txt` | 5769 | trash | — | Raw CLI help; inspected flags, versions and documentation findings are preserved in agent-routing reports. |
| `routing-p02/evidence/herdr-agent-start-help.txt` | 852 | trash | — | Raw CLI help; inspected flags, versions and documentation findings are preserved in agent-routing reports. |
| `routing-p02/final-wait.json` | 638 | trash | — | Transient launch/wait output; worker route, model, pane, session and lifecycle facts are preserved in routing-p02/coordinator.md. |
| `worktree-cleanup-20261004/cleanup-result.json` | 1123 | keep | `docs/mailbox/worktree-cleanup-20261004/implementer-scratch-triage.md` | Keep historical nine-worktree removal outcome and preserved branch membership; not recorded in current cleanup reports. |
| `worktree-cleanup-20261004/pane-cleanup-before.json` | 13611 | keep | `docs/mailbox/worktree-cleanup-20261004/implementer-scratch-triage.md` | R1: the nine skills-* Codex session IDs are added to the kept report. Routing/P02 and repo-root IDs were already preserved; closure facts come from pane-cleanup-result.json. The remaining raw pane state is transient. |
| `worktree-cleanup-20261004/pane-cleanup-result.json` | 1470 | keep | `docs/mailbox/worktree-cleanup-20261004/implementer-scratch-triage.md` | Keep historical 18 pane closures and one retained current pane; unique cleanup outcome. |
| `worktree-cleanup-20261004/repo-root-command/implementer.md` | 9007 | trash | — | Byte-identical committed report at D1, docs/mailbox/repo-root-command/implementer.md. |
| `worktree-cleanup-20261004/repo-root-command/reviewer.md` | 12668 | trash | — | Byte-identical committed report at D1, docs/mailbox/repo-root-command/reviewer.md. |
| `worktree-cleanup-20261004/repo-root-discovery/acceptance-config.json` | 8322 | trash | — | Byte-identical committed evidence at D2, docs/mailbox/repo-root-discovery/acceptance-config.json. |
| `worktree-cleanup-20261004/repo-root-discovery/acceptance.json` | 33745 | trash | — | Byte-identical committed evidence at D2, docs/mailbox/repo-root-discovery/acceptance.json. |
| `worktree-cleanup-20261004/repo-root-discovery/assignment.txt` | 988 | trash | — | Byte-identical committed evidence at D2, docs/mailbox/repo-root-discovery/assignment.txt. |
| `worktree-cleanup-20261004/repo-root-discovery/completion.json` | 245 | trash | — | Byte-identical committed evidence at D2, docs/mailbox/repo-root-discovery/completion.json. |
| `worktree-cleanup-20261004/repo-root-discovery/feature-acceptance-config.json` | 7990 | trash | — | Byte-identical committed evidence at D2, docs/mailbox/repo-root-discovery/feature-acceptance-config.json. |
| `worktree-cleanup-20261004/repo-root-discovery/feature-acceptance.json` | 17315 | trash | — | Byte-identical committed evidence at D2, docs/mailbox/repo-root-discovery/feature-acceptance.json. |
| `worktree-cleanup-20261004/repo-root-discovery/feature-scope-config.json` | 1150 | trash | — | Byte-identical committed evidence at D2, docs/mailbox/repo-root-discovery/feature-scope-config.json. |
| `worktree-cleanup-20261004/repo-root-discovery/install-audit.json` | 1289 | trash | — | Byte-identical committed evidence at D2, docs/mailbox/repo-root-discovery/install-audit.json. |
| `worktree-cleanup-20261004/repo-root-discovery/launch-observer.json` | 1714 | trash | — | Byte-identical committed evidence at D2, docs/mailbox/repo-root-discovery/launch-observer.json. |
| `worktree-cleanup-20261004/repo-root-discovery/observer.md` | 10966 | trash | — | Byte-identical committed evidence at D2, docs/mailbox/repo-root-discovery/observer.md. |
| `worktree-cleanup-20261004/repo-root-discovery/scope.json` | 3897 | trash | — | Byte-identical committed evidence at D2, docs/mailbox/repo-root-discovery/scope.json. |
| `worktree-cleanup-20261004/repo-root-discovery/session-audit.json` | 9602 | trash | — | Byte-identical committed evidence at D2, docs/mailbox/repo-root-discovery/session-audit.json. |
| `worktree-cleanup-20261004/versioned-agent-skills-eval-scratch.tar.gz` | 449 | trash | — | Single temporary scope allowlist; implementation scope/results are preserved in versioned-skills implementer-eval.md. |
| `worktree-cleanup-20261004/versioned-agent-skills-handoff-scratch.tar.gz` | 5456 | trash | — | Probe scripts and raw load/corpus/portability results; findings are preserved in versioned-skills handoff/fix reports. |
| `worktree-cleanup-20261004/versioned-agent-skills-herdr-scratch.tar.gz` | 97993 | trash | — | Raw native/probe/test output and editing/report scripts; findings are preserved in versioned-skills Herdr reports. |
| `worktree-cleanup-20261004/versioned-agent-skills-main-scratch.tar.gz` | 34202 | trash | — | Temporary integration/delivery matrices and snapshots; results and failed-observer caveats are preserved in integration-main.md and delivery.md. |
| `worktree-cleanup-20261004/versioned-agent-skills-scratch.tar.gz` | 301596 | keep | `docs/mailbox/versioned-agent-skills/assignment-*.md` | R1: the 24 unique Coordinator assignment members are copied unchanged; `delivery-coordinator.md` was already tracked. Skill copies, dependency cache, fixtures and probe logs are transient, and their findings are in versioned-skills reports. |
| `worktree-cleanup-20261004/worktrees.json` | 1768 | keep | `docs/mailbox/worktree-cleanup-20261004/implementer-scratch-triage.md` | Keep exact pre-cleanup worktree-to-branch tip mapping needed to locate preserved evidence. |

## Verification and limits

The preservation candidate `efc14c28344eec6516b594efd16832249e8849e3` adds only the curated cleanup report. The recording successor adds this handoff and the unchanged assignment. Its creating SHA is returned in the terminal handoff, not predicted here.

| Exact command | Result |
| --- | --- |
| `find .agents/scratch -type f \| wc -l`, cwd `/opt/dev/tehom-brainlab` | Exit 0; 49 source files, matching the 49 manifest rows. |
| `python3 /tmp/check-scratch-triage.py`, cwd this worktree | Exit 0; set equality and unique manifest paths, exact per-file sizes and keep/trash totals, all source SHA-256 values unchanged, every keep destination exists. Also compares all curated worktree/pane facts, resolves nine exact branch tips, compares all 14 committed duplicate objects, checks unchanged assignment/other branch refs and all new Markdown links. |
| `rg -n -i 'token\|key\|secret\|password\|bearer\|credential\|authorization\|private.?key' docs/mailbox/worktree-cleanup-20261004/implementer-scratch-triage.md docs/mailbox/agent-artifact-conventions/assignment-scratch-triage.md docs/mailbox/agent-artifact-conventions/scratch-triage.md` | Exit 0; matches reviewed. Only instructions banning sensitive content and text describing the verification command/results; no credential values. The curated kept report has no keyword match. |
| `python3 /tmp/scan-scratch-triage.py` | Exit 0; all three added files checked for private-key blocks, provider-token formats, AWS access IDs, bearer values and credential assignments; zero matches. |
| `git diff --check e70f49b1a6ca41e0aba4ff33015d9dc749439410..HEAD` | Exit 0 on preservation candidate `efc14c2`; no whitespace errors. |
| `git diff --cached --check e70f49b1a6ca41e0aba4ff33015d9dc749439410` | Exit 0 for both the preservation commit and final staged recording content. |
| `/home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/worktree-cleanup-20261004/implementer-scratch-triage.md --repo /opt/dev/tehom-brainlab-conventions` | Exit 0; `ok: true`, empty diagnostics, both supplied revisions resolved. |
| `/home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/agent-artifact-conventions/scratch-triage.md --repo /opt/dev/tehom-brainlab-conventions` | Exit 0; `ok: true`, empty diagnostics; supplied revisions resolve. |

The final sandboxed `git add` attempt failed with a read-only linked-worktree index path; automatic approval review permitted the same bounded staging command against linked Git metadata. No main-checkout work file was changed.

The two temporary Python checkers remain outside the repository. Coverage is verified against actual filesystem paths and bytes; preservation is checked against the original JSON and committed Git objects. Content scanning is pattern-based inspection, not a guarantee against every possible sensitive encoding. No archive payload or raw session data is copied into committed content.

No application tests are applicable to this documentation-only triage; the historical experiments are not rerun. Independent review, merge and deletion of the originals remain separate tasks. Existing committed reports, CURRENT, TASK_LOGS, guidance, code and tests are untouched.

## R1: legacy assignments and session IDs

Author: Implementer, 2026-10-04 UTC. Assignment: [triage R1](assignment-triage-r1.md). The Coordinator accepted optional findings O1 and O3 from the [triage review](triage-reviewer.md). Baseline `e6d5c35`; preservation candidate `783b98ff915ffb485f151349937b67df0e92b6fc`. The source checkout's `.agents/scratch/` was only read; nothing there was changed or deleted.

- **O1.** The 33 legacy Coordinator assignments are copied byte for byte. The 9 routing-p02 files and 24 unique Markdown members of `versioned-agent-skills-scratch.tar.gz` total 110730 bytes. The archive was extracted only into session scratch, and nothing from it was run. `delivery-coordinator.md` was skipped because it is already tracked. Names follow the SCHEMA pattern `assignment-<role-or-worker>.md`: routing names are lowercased, and a redundant trailing `-assignment` is dropped from archive names. The manifest's earlier reason cited "routing/P02 plans"; no routing plan exists, and that reason is corrected above.
- **O3.** The [historical cleanup report](../worktree-cleanup-20261004/implementer-scratch-triage.md#versioned-skills-worker-sessions) now lists the nine `skills-*` workers with their panes and Codex session IDs. `pane-cleanup-before.json` is therefore keep. Its remaining raw pane state is transient.
- **Manifest.** The 11 affected rows are now keep, with destinations: nine routing assignments, the archive and the pane snapshot. Totals are now keep 14 / 346950 bytes and trash 35 / 300707 bytes. The 35 remaining trash rows are unchanged; their content is preserved elsewhere or is transient.
- **Not addressed.** O2 (retaining the local D1/D2 branches) and O4 (dangling historical scratch citations) were not assigned. The reviewer's 66-versus-121 matching-member note is unchanged. Existing reports other than this one and the kept cleanup report are unedited.

| Legacy source | Mailbox copy | Bytes |
| --- | --- | ---: |
| `routing-p02/assignments/A-implementer.md` | [routing-p02/assignment-a-implementer.md](../routing-p02/assignment-a-implementer.md) | 6872 |
| `routing-p02/assignments/A-merge.md` | [routing-p02/assignment-a-merge.md](../routing-p02/assignment-a-merge.md) | 2091 |
| `routing-p02/assignments/A-reviewer.md` | [routing-p02/assignment-a-reviewer.md](../routing-p02/assignment-a-reviewer.md) | 4344 |
| `routing-p02/assignments/B-fix-R1.md` | [routing-p02/assignment-b-fix-r1.md](../routing-p02/assignment-b-fix-r1.md) | 2026 |
| `routing-p02/assignments/B-implementer.md` | [routing-p02/assignment-b-implementer.md](../routing-p02/assignment-b-implementer.md) | 4483 |
| `routing-p02/assignments/B-merge.md` | [routing-p02/assignment-b-merge.md](../routing-p02/assignment-b-merge.md) | 1655 |
| `routing-p02/assignments/B-rereview.md` | [routing-p02/assignment-b-rereview.md](../routing-p02/assignment-b-rereview.md) | 1439 |
| `routing-p02/assignments/B-reviewer.md` | [routing-p02/assignment-b-reviewer.md](../routing-p02/assignment-b-reviewer.md) | 3555 |
| `routing-p02/assignments/final-record.md` | [routing-p02/assignment-final-record.md](../routing-p02/assignment-final-record.md) | 917 |
| `versioned-agent-skills-scratch.tar.gz: versioned-agent-skills/architect-assignment.md` | [versioned-agent-skills/assignment-architect.md](../versioned-agent-skills/assignment-architect.md) | 8918 |
| `versioned-agent-skills-scratch.tar.gz: versioned-agent-skills/common.md` | [versioned-agent-skills/assignment-common.md](../versioned-agent-skills/assignment-common.md) | 3154 |
| `versioned-agent-skills-scratch.tar.gz: versioned-agent-skills/eval-assignment.md` | [versioned-agent-skills/assignment-eval.md](../versioned-agent-skills/assignment-eval.md) | 2290 |
| `versioned-agent-skills-scratch.tar.gz: versioned-agent-skills/eval-fix-assignment.md` | [versioned-agent-skills/assignment-eval-fix.md](../versioned-agent-skills/assignment-eval-fix.md) | 2103 |
| `versioned-agent-skills-scratch.tar.gz: versioned-agent-skills/forward-test-assignment.md` | [versioned-agent-skills/assignment-forward-test.md](../versioned-agent-skills/assignment-forward-test.md) | 2904 |
| `versioned-agent-skills-scratch.tar.gz: versioned-agent-skills/handoff-assignment.md` | [versioned-agent-skills/assignment-handoff.md](../versioned-agent-skills/assignment-handoff.md) | 2548 |
| `versioned-agent-skills-scratch.tar.gz: versioned-agent-skills/handoff-doc-followup.md` | [versioned-agent-skills/assignment-handoff-doc-followup.md](../versioned-agent-skills/assignment-handoff-doc-followup.md) | 1324 |
| `versioned-agent-skills-scratch.tar.gz: versioned-agent-skills/handoff-fix-assignment.md` | [versioned-agent-skills/assignment-handoff-fix.md](../versioned-agent-skills/assignment-handoff-fix.md) | 1264 |
| `versioned-agent-skills-scratch.tar.gz: versioned-agent-skills/herdr-assignment.md` | [versioned-agent-skills/assignment-herdr.md](../versioned-agent-skills/assignment-herdr.md) | 4292 |
| `versioned-agent-skills-scratch.tar.gz: versioned-agent-skills/herdr-claude-gate-assignment.md` | [versioned-agent-skills/assignment-herdr-claude-gate.md](../versioned-agent-skills/assignment-herdr-claude-gate.md) | 2853 |
| `versioned-agent-skills-scratch.tar.gz: versioned-agent-skills/herdr-codex-perm-assignment.md` | [versioned-agent-skills/assignment-herdr-codex-perm.md](../versioned-agent-skills/assignment-herdr-codex-perm.md) | 3287 |
| `versioned-agent-skills-scratch.tar.gz: versioned-agent-skills/herdr-contract-fix-assignment.md` | [versioned-agent-skills/assignment-herdr-contract-fix.md](../versioned-agent-skills/assignment-herdr-contract-fix.md) | 4898 |
| `versioned-agent-skills-scratch.tar.gz: versioned-agent-skills/herdr-fix-assignment.md` | [versioned-agent-skills/assignment-herdr-fix.md](../versioned-agent-skills/assignment-herdr-fix.md) | 2931 |
| `versioned-agent-skills-scratch.tar.gz: versioned-agent-skills/herdr-routing-adapt-assignment.md` | [versioned-agent-skills/assignment-herdr-routing-adapt.md](../versioned-agent-skills/assignment-herdr-routing-adapt.md) | 3081 |
| `versioned-agent-skills-scratch.tar.gz: versioned-agent-skills/integration-assignment.md` | [versioned-agent-skills/assignment-integration.md](../versioned-agent-skills/assignment-integration.md) | 4566 |
| `versioned-agent-skills-scratch.tar.gz: versioned-agent-skills/main-delivery-part3.md` | [versioned-agent-skills/assignment-main-delivery-part3.md](../versioned-agent-skills/assignment-main-delivery-part3.md) | 4021 |
| `versioned-agent-skills-scratch.tar.gz: versioned-agent-skills/main-integration-assignment.md` | [versioned-agent-skills/assignment-main-integration.md](../versioned-agent-skills/assignment-main-integration.md) | 4557 |
| `versioned-agent-skills-scratch.tar.gz: versioned-agent-skills/main-integration-part2.md` | [versioned-agent-skills/assignment-main-integration-part2.md](../versioned-agent-skills/assignment-main-integration-part2.md) | 4744 |
| `versioned-agent-skills-scratch.tar.gz: versioned-agent-skills/reintegration-3-assignment.md` | [versioned-agent-skills/assignment-reintegration-3.md](../versioned-agent-skills/assignment-reintegration-3.md) | 1421 |
| `versioned-agent-skills-scratch.tar.gz: versioned-agent-skills/reintegration-assignment.md` | [versioned-agent-skills/assignment-reintegration.md](../versioned-agent-skills/assignment-reintegration.md) | 3226 |
| `versioned-agent-skills-scratch.tar.gz: versioned-agent-skills/rereview-3-assignment.md` | [versioned-agent-skills/assignment-rereview-3.md](../versioned-agent-skills/assignment-rereview-3.md) | 1441 |
| `versioned-agent-skills-scratch.tar.gz: versioned-agent-skills/rereview-assignment.md` | [versioned-agent-skills/assignment-rereview.md](../versioned-agent-skills/assignment-rereview.md) | 2613 |
| `versioned-agent-skills-scratch.tar.gz: versioned-agent-skills/review-assignment.md` | [versioned-agent-skills/assignment-review.md](../versioned-agent-skills/assignment-review.md) | 5617 |
| `versioned-agent-skills-scratch.tar.gz: versioned-agent-skills/review-main-assignment.md` | [versioned-agent-skills/assignment-review-main.md](../versioned-agent-skills/assignment-review-main.md) | 5295 |

| Exact command | Result |
| --- | --- |
| `python3 <scratch>/copy.py` | Copied 33 files, asserting 33 distinct destinations that did not exist beforehand. |
| `python3 <scratch>/verify.py` | Exit 0; 33 copies, zero SHA-256 mismatches against the original files and extracted members; 27382 + 83348 = 110730 bytes; zero hits for private-key, provider-token (Anthropic, OpenAI, GitHub, Slack, Google), AWS ID, bearer, JWT and credential-assignment patterns. |
| `rg -n -i 'token\|secret\|password\|bearer\|credential\|authorization\|private.?key'` over the 33 copies | 8 matches in 7 files, all reviewed. They are instructions about redacting secrets or wording about `developer_instructions` and gates; none contains a credential value. |
| `git hash-object` of every extracted top-level `.md` member, checked with `git cat-file -e` | Only `delivery-coordinator.md` exists in Git, and it is identical to the tracked file; the other 24 were absent before R1. |
| Field comparison of `pane-cleanup-before.json` with the R1 session table | All nine `skills-*` names, panes and `agent_session.value` IDs match; `skills-coordinator` has no session. |
| `<scratch>/check-r1.py` (link and session check) | Exit 0; every relative link in the R1-changed reports resolves. |
| `git diff --check e6d5c353189b4d2c35c38a2f2a50f2de37419f6f..HEAD` | Exit 0 on preservation candidate `783b98f` and again on the final recording content. |
| `/home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/worktree-cleanup-20261004/implementer-scratch-triage.md --repo /opt/dev/tehom-brainlab-conventions` | Exit 0; `ok: true`, empty diagnostics. |
| `/home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/agent-artifact-conventions/scratch-triage.md --repo /opt/dev/tehom-brainlab-conventions` | Exit 0; `ok: true`, empty diagnostics; all revisions resolve. |

The copied assignments are historical. Their own references to `.agents/scratch/` paths and old commands are unchanged, and none contains a Markdown link. The pattern scan is a check, not a guarantee against every sensitive encoding. The scratch scripts remain outside the repository. No application tests apply.
