---
task: CONV-triage
status: complete
outcome: Classified all 49 legacy files; three sources are curated in one historical cleanup report and 46 are trash candidates.
role: implementer
worker: scratch-triage
artifacts:
  - docs/mailbox/agent-artifact-conventions/assignment-scratch-triage.md
  - docs/mailbox/agent-artifact-conventions/scratch-triage.md
  - docs/mailbox/worktree-cleanup-20261004/implementer-scratch-triage.md
verification:
  - "Read all 49 source files and all 344 regular archive members without extracting or executing them."
  - "Fourteen repo-root scratch copies match preserved committed mailbox objects byte for byte."
  - "All nine historical worktree branch tips resolve and equal their recorded revisions."
  - "Manifest/source comparison passes: 49 unique rows, exact sizes and totals, valid keep destinations; all original SHA-256 values unchanged."
  - "All new Markdown links resolve; assignment bytes and other branch refs are unchanged."
  - "Keyword content scan has only benign instruction/verification matches; five targeted credential patterns find no values in the three added files."
  - "git diff --check e70f49b..HEAD passes on the preservation candidate; staged evidence whitespace check passes before the recording commit."
  - "Both new reports pass the ruach-handoff validator with explicit --repo and existing revisions; ok true, diagnostics empty."
review: not-run
discoveries:
  - "Exact inventory is 49 files / 647657 bytes; the earlier 50-file estimate is stale."
  - "Repo-root trial and observer evidence exists on preserved experiment branches rather than this branch."
  - "Unique worktree/pane cleanup outcomes are preserved as historical observations; source logs omit commands and per-removal exit codes."
blockers: []
inspected_baseline: e70f49b1a6ca41e0aba4ff33015d9dc749439410
candidate_revision: efc14c28344eec6516b594efd16832249e8849e3
tested_revision: efc14c28344eec6516b594efd16832249e8849e3
---

Author: Implementer (scratch-triage), 2026-10-04 UTC. Assignment: [scratch triage](assignment-scratch-triage.md). All source paths below are relative to `/opt/dev/tehom-brainlab/.agents/scratch/`. The source checkout is read-only throughout this assignment. Work is confined to branch `agent-artifact-conventions`; no merge, push, source deletion or pane operation is performed.

## Result and totals

| Disposition | Source files | Source bytes | Preserved form |
| --- | ---: | ---: | --- |
| Keep | 3 | 4361 | One curated [historical cleanup report](../worktree-cleanup-20261004/implementer-scratch-triage.md) |
| Trash | 46 | 643296 | Findings already preserved, superseded assignments, or disposable output/fixtures |
| Total | 49 | 647657 | Every source file has one manifest row |

Keep means the unique findings are preserved in the destination; it does not require copying the raw file. Trash is a disposition for the later cleanup worker, not a deletion performed here. The five archives count as five filesystem files; their 344 regular members were also read for classification. Their expanded size is 1822723 bytes. No archive, raw output, dependency cache or private session dump is committed.

## Comparison evidence

P02 overlays/probes duplicate the documented property-order finding, corrected test and verification: [Implementer](../p02-formation-algebra/implementer.md), [verification](../p02-formation-algebra/verification.md), [Reviewer](../p02-formation-algebra/reviewer.md), [delivery](../p02-formation-algebra/delivery.md), and the [P02 plan](../../plans/2026-10-02-2e228a2b-poc-001-formation-algebra.md). Routing assignments, CLI help and wait output are superseded by [routing implementation](../agent-routing/implementer.md), [review](../agent-routing/reviewer.md), [delivery](../agent-routing/delivery.md), and the [routing/P02 Coordinator report](../routing-p02/coordinator.md). Related exact checks were also compared with TASK_LOGS. These existing reports remain unchanged.

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
| `versioned-agent-skills-scratch.tar.gz` | 226 | 1032896 | Superseded assignments, copied skill versions, caches, fixtures and probe logs; 66 regular members exactly match tracked files. [Design](../versioned-agent-skills/architect.md), [integration](../versioned-agent-skills/implementer-integration-3.md), [review](../versioned-agent-skills/reviewer.md), [re-review](../versioned-agent-skills/reviewer-2.md), [final re-review](../versioned-agent-skills/reviewer-3.md) and [Coordinator](../versioned-agent-skills/coordinator.md) preserve the required findings. |

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
| `routing-p02/assignments/A-implementer.md` | 6872 | trash | — | Superseded assignment; contract, review/fix/delivery outcomes and limits are preserved in routing/P02 plans and mailbox reports. |
| `routing-p02/assignments/A-merge.md` | 2091 | trash | — | Superseded assignment; contract, review/fix/delivery outcomes and limits are preserved in routing/P02 plans and mailbox reports. |
| `routing-p02/assignments/A-reviewer.md` | 4344 | trash | — | Superseded assignment; contract, review/fix/delivery outcomes and limits are preserved in routing/P02 plans and mailbox reports. |
| `routing-p02/assignments/B-fix-R1.md` | 2026 | trash | — | Superseded assignment; contract, review/fix/delivery outcomes and limits are preserved in routing/P02 plans and mailbox reports. |
| `routing-p02/assignments/B-implementer.md` | 4483 | trash | — | Superseded assignment; contract, review/fix/delivery outcomes and limits are preserved in routing/P02 plans and mailbox reports. |
| `routing-p02/assignments/B-merge.md` | 1655 | trash | — | Superseded assignment; contract, review/fix/delivery outcomes and limits are preserved in routing/P02 plans and mailbox reports. |
| `routing-p02/assignments/B-rereview.md` | 1439 | trash | — | Superseded assignment; contract, review/fix/delivery outcomes and limits are preserved in routing/P02 plans and mailbox reports. |
| `routing-p02/assignments/B-reviewer.md` | 3555 | trash | — | Superseded assignment; contract, review/fix/delivery outcomes and limits are preserved in routing/P02 plans and mailbox reports. |
| `routing-p02/assignments/final-record.md` | 917 | trash | — | Superseded assignment; contract, review/fix/delivery outcomes and limits are preserved in routing/P02 plans and mailbox reports. |
| `routing-p02/check-routing-docs.py` | 2406 | trash | — | Disposable validation script; checks and results are preserved in routing delivery and TASK_LOGS. |
| `routing-p02/evidence/claude-help.txt` | 22040 | trash | — | Raw CLI help; inspected flags, versions and documentation findings are preserved in agent-routing reports. |
| `routing-p02/evidence/codex-help.txt` | 5769 | trash | — | Raw CLI help; inspected flags, versions and documentation findings are preserved in agent-routing reports. |
| `routing-p02/evidence/herdr-agent-start-help.txt` | 852 | trash | — | Raw CLI help; inspected flags, versions and documentation findings are preserved in agent-routing reports. |
| `routing-p02/final-wait.json` | 638 | trash | — | Transient launch/wait output; worker route, model, pane, session and lifecycle facts are preserved in routing-p02/coordinator.md. |
| `worktree-cleanup-20261004/cleanup-result.json` | 1123 | keep | `docs/mailbox/worktree-cleanup-20261004/implementer-scratch-triage.md` | Keep historical nine-worktree removal outcome and preserved branch membership; not recorded in current cleanup reports. |
| `worktree-cleanup-20261004/pane-cleanup-before.json` | 13611 | trash | — | Raw full-workspace snapshot; relevant closure/retention facts are curated from pane-cleanup-result.json. |
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
| `worktree-cleanup-20261004/versioned-agent-skills-scratch.tar.gz` | 301596 | trash | — | Superseded assignments, skill copies, dependency cache, fixtures and probe logs; findings are preserved in versioned-skills reports. |
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
