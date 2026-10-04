task: ruach-extraction
status: complete
outcome: Prepared verified local Ruach and Brainlab implementation candidates with completed Librarian resources and blind evaluation fixtures
candidate_revision: 10d7b962e8f9c74c144c45e39e16b77cc4ae071f
tested_revision: 10d7b962e8f9c74c144c45e39e16b77cc4ae071f
upstream:
  repository: /opt/dev/ruach
  origin: git@github.com:rothzeta/ruach.git
  branch: extraction
  candidate_revision: 25186fe958450c92067d1e67224c0dc83373be9e
  tested_revision: 25186fe958450c92067d1e67224c0dc83373be9e
artifacts:
  - docs/mailbox/ruach-extraction/implementer.md
  - docs/mailbox/ruach-extraction/assignment-implementer.md
  - .agents/ruach.json
  - .agents/policy.md
  - /opt/dev/ruach/PROVENANCE.md
  - /opt/dev/ruach/docs/adr/0001-source-and-consumer-ownership.md
  - /opt/dev/ruach/skills/ruach-librarian/evals/cases/
  - /opt/dev/ruach/skills/ruach-librarian/evals/expected/rubric.md
verification:
  - "Ruach source suites: handoff 24, Herdr 107, harness-eval 59 passed; frozen installs passed."
  - "Standalone copied suites: handoff 24, Herdr 107, harness-eval 59 passed with unchanged default tests/timeouts."
  - "Installer contracts: 10 tests passed; names/frontmatter/file-target checks passed for all eight skills."
  - "Brainlab and independent fresh clone: 14 routing tests passed; both offline Librarian routes resolved; snapshot checks passed."
  - "Local links: 53 Brainlab/installed Markdown documents and eight relative anchors passed; 91-file Ruach portability scan found no matches."
  - "Own handoff validator: exit 0, no diagnostics, both Brainlab revision fields resolved."
review: not-run
discoveries:
  - "Brainlab CURRENT line 81 still describes a future Librarian and five roles; its protected owner must update after acceptance."
  - "Copied Herdr verification initially required socket escalation and later hit one default timeout; serial retry passed all 107 tests without changes."
blockers: []

## Candidates and scope

Ruach `extraction`: **25186fe958450c92067d1e67224c0dc83373be9e**. Brainlab `ruach-extraction`: **10d7b962e8f9c74c144c45e39e16b77cc4ae071f**. These are implementation candidates, not reviewed or delivered destinations. No merge, push, publication, global-link migration, real mailbox triage, paid model session or application change was performed. Ruach has one root commit on `extraction` and no `main` commit. Its configured SSH origin was preserved.

Top-level revision fields resolve in Brainlab. The nested upstream revisions belong to the separate Ruach repository and were checked with `git -C /opt/dev/ruach rev-parse --verify 25186fe958450c92067d1e67224c0dc83373be9e^{commit}` and `git -C /opt/dev/ruach rev-parse extraction` (both returned the source SHA). No source history was imported.

Ruach contains 91 authored/extracted files: six roles under `agents/`; eight skills under `skills/`, including feature and knowledge workflows only there; a source/consumer ownership ADR; focused README/CONTRIBUTING/provenance/license; install/resource-check scripts; installer contract tests; and skill-local scripts, manifests, locks, fixtures and tests. MIT covers authored material. Provenance names Brainlab baseline **255ed6871ec3d7897e5a2ff481f2f4f62e3eb816** and each extracted item's origin path; Librarian inputs are explicitly identified as uncommitted drafts supplied alongside that baseline. No upstream source license/notice was found in the extracted material or repository-root file scan. External dependencies retain their own licenses and are not bundled. The Librarian technique links [Karpathy's LLM Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f); no gist prose is copied.

Brainlab's source commit changes 56 files. Shared role/skill definitions are now an 85-file generated snapshot with origin, full upstream SHA, hashes and executable-mode records in `.agents/ruach.json`; the installer, MIT license and provenance are included. Author shared changes upstream, then use `just sync-ruach --source DIR --revision SHA`. `just check-ruach` works without a sibling checkout; adding `--source DIR` compares with the recorded Git tree. Launch checks local snapshot integrity before delegation. Explicit `--replace` is required for managed drift or conflicts; unrelated consumer catalogs and local resources are preserved.

Brainlab-specific route preferences/switch rules, Claude-only Coordinator policy, automatic approval review, Herdr monitoring/communication/cleanup, assignment/report commits, mailbox retention and protected-document ownership are in `.agents/policy.md`, required by `AGENTS.md`. Existing catalogs and wrapper remain Brainlab-owned. Librarian is registered with GPT preferred and Claude alternative; launcher/test contracts cover six roles and required knowledge resources. `.agents/README.md`, AGENTS, SCHEMA, mailbox README, tooling ADR amendment and routing guide describe the new ownership/role consistently. Generated role/workflow bodies read consumer policy rather than duplicating it.

Changed components: `.agents/agents/`, `.agents/skills/`, `.agents/ruach*`, `.agents/policy.md`, `.agents/roles.yaml`, `.agents/README.md`, `AGENTS.md`, `docs/SCHEMA.md`, `docs/mailbox/README.md`, `docs/adr/0005-repository-management-and-tooling.md`, `docs/exploitation/agent-routing.md`, `justfile`, `scripts/agent-routing.py`, `scripts/test-agent-routing.py`, `scripts/sync-ruach.py`. Exact file inventories are available from `git show --format= --name-only` at the two candidate commits.

## Verification commands and outcomes

Commands below use Bun **1.4.2**, invoked as `/home/metatron/.bun/bin/bun` because it is outside PATH. That home path appears only in Brainlab execution evidence, not Ruach source. Working directories are explicit; no successful result is inferred from frontmatter or prose.

| Cwd | Exact argv/command | Result |
| --- | --- | --- |
| `/opt/dev/ruach/skills/ruach-handoff` | `/home/metatron/.bun/bin/bun install --frozen-lockfile`; `/home/metatron/.bun/bin/bun test` | exit 0 each; 24 tests |
| `/opt/dev/ruach/skills/ruach-herdr` | `/home/metatron/.bun/bin/bun install --frozen-lockfile`; `/home/metatron/.bun/bin/bun test` | exit 0 each; 107 tests; socket-permitted execution |
| `/opt/dev/ruach/skills/ruach-harness-eval` | `/home/metatron/.bun/bin/bun install --frozen-lockfile`; `/home/metatron/.bun/bin/bun test` | exit 0 each; 59 tests; package has no dependencies |
| `/opt/dev/ruach` | `python3 scripts/check.py` | exit 0; skill identity/description and relative file targets |
| `/opt/dev/ruach` | `python3 -m unittest discover -s tests -v` | exit 0; 10 CLI/Git-boundary installer tests |
| Brainlab worktree | `python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py /opt/dev/ruach/skills/NAME` for each of `ruach-handoff`, `ruach-harness-eval`, `ruach-herdr`, `ruach-librarian`, `ruach-simplification`, `ruach-testing`, `ruach-workflow-feature`, `ruach-workflow-knowledge` | exit 0 for all eight |
| Brainlab worktree | `just sync-ruach --source /opt/dev/ruach --revision 25186fe958450c92067d1e67224c0dc83373be9e` | exit 0; 85 committed-object files installed |
| Brainlab worktree | `just check-ruach`; `just check-ruach --source /opt/dev/ruach` | exit 0 each; local and upstream-tree integrity |
| Brainlab `.agents/skills/NAME` | `/home/metatron/.bun/bin/bun install --frozen-lockfile` for `ruach-handoff`, `ruach-herdr`, `ruach-harness-eval` | exit 0 each |
| Brainlab worktree | `just test-agent-routing -v`; `just agent-routing resolve librarian`; `just agent-routing resolve librarian --route claude-opus-5.5-high` | exit 0 each; 14 tests; GPT/Claude selections, high effort, no submission |

Installer tests cover committed rather than uncommitted input, standalone installed checks without source, preserved consumer policy, hash/mode/missing-file drift, unexpected files, explicit replacement, managed pruning, symlink/traversal rejection and optional upstream comparison. Root regression retains existing assertions and adds Librarian membership/routes and pre-delegation drift rejection.

Standalone install used this exact command from the Brainlab worktree:

```sh
python3 /opt/dev/ruach/scripts/install.py install --source /opt/dev/ruach --revision 25186fe958450c92067d1e67224c0dc83373be9e --target /tmp/ruach-installed-_vze66fc/.agents
python3 /tmp/ruach-installed-_vze66fc/.agents/ruach-install.py check --target /tmp/ruach-installed-_vze66fc/.agents --source /opt/dev/ruach
```

Both exited 0. Each executable skill was then copied independently from that installation to `/tmp/ruach-installed-_vze66fc/NAME` without dependencies. From each copied directory, `/home/metatron/.bun/bin/bun install --frozen-lockfile` exited 0. From foreign cwd `/tmp/ruach-installed-_vze66fc`, exact test argv was `/home/metatron/.bun/bin/bun test /tmp/ruach-installed-_vze66fc/NAME/tests` for each of `ruach-handoff`, `ruach-herdr`, `ruach-harness-eval`: final results 24/107/59 passed, exit 0. No repository runtime or global installation was needed.

Earlier copied Herdr attempts are failures, not passes: the default sandbox refused Unix socket binding with EPERM (0 tests ran); a socket-permitted run passed 106/107 but `codex auto-review policy is adapter-owned in preparation and startup` exceeded the unchanged 5000ms timeout, causing a killed-process EOF error. The complete default suite was rerun serially with socket permission and passed 107/107. No test, timeout or expected behavior was modified. Source suites and copied tests use fake native CLIs/config, not real model turns.

Fresh-clone verification used `git clone -q --no-hardlinks --branch ruach-extraction /opt/dev/tehom-brainlab-ruach-extraction /tmp/brainlab-fresh-ejyh6cef/checkout`, from cwd `/tmp/brainlab-fresh-ejyh6cef`. In that clone, `just check-ruach`, frozen Herdr installation, `just test-agent-routing -v`, and both Librarian resolve commands above all exited 0. The clone's HEAD is the Brainlab candidate. No upstream checkout was supplied to its integrity check or launcher.

Additional actual checks: inline `python3 -` inspected 53 changed-guide/installed Markdown documents for relative file targets (0 missing), and Ruach resources plus changed Brainlab guides for eight relative anchors (all resolved). An inline `python3 -` scan of all 91 Ruach tracked files found no installed dependencies/symlinks, absolute `/home/` or `/opt/dev/` paths, or matches for common GitHub/AWS credential patterns. This is a bounded pattern scan, not a secret-audit guarantee. `git diff --check` passed. `git diff --exit-code 255ed6871ec3d7897e5a2ff481f2f4f62e3eb816 -- docs/CURRENT.md docs/TASK_LOGS.md .agents/models.yaml .agents/routing.yaml bin/agent-routing bin/test-agent-routing poc-001-linked-formation poc-002-linked-tactics` exited 0 with no changes. No application suites were run because application code was unchanged. External-link availability and live harness/account/model acceptance were not tested.

The final report is validated with `/home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/ruach-extraction/implementer.md --repo /opt/dev/tehom-brainlab-ruach-extraction`; validator success is recorded in the terminal handoff before the evidence commit.

## Blind evaluator packet

Prepare an isolated copy of each corpus. **Give only** the common `/opt/dev/ruach/skills/ruach-librarian/SKILL.md`, plus the matching task and raw corpus below:

| Case | Task | Raw corpus |
| --- | --- | --- |
| Proposal versus accepted decision | `/opt/dev/ruach/skills/ruach-librarian/evals/cases/01-authority/task.md` | `/opt/dev/ruach/skills/ruach-librarian/evals/cases/01-authority/corpus/` |
| Historical checks versus current claims | `/opt/dev/ruach/skills/ruach-librarian/evals/cases/02-revisions/task.md` | `/opt/dev/ruach/skills/ruach-librarian/evals/cases/02-revisions/corpus/` |
| Conflicting sources | `/opt/dev/ruach/skills/ruach-librarian/evals/cases/03-conflicts/task.md` | `/opt/dev/ruach/skills/ruach-librarian/evals/cases/03-conflicts/corpus/` |
| Unique evidence during consolidation | `/opt/dev/ruach/skills/ruach-librarian/evals/cases/04-evidence/task.md` | `/opt/dev/ruach/skills/ruach-librarian/evals/cases/04-evidence/corpus/` |

**Withhold** `/opt/dev/ruach/skills/ruach-librarian/evals/expected/` (especially `rubric.md`), `/opt/dev/ruach/skills/ruach-librarian/evals/README.md`, this handoff and other implementation/grading reports, prior conclusions and other subject outputs. The Brainlab snapshot contains corresponding copies under `.agents/skills/ruach-librarian/evals/`; withhold its expected/README copies too. Do not supply the entire skill folder as a blind packet. The packet README documents the evaluator boundary for the Coordinator; the subject does not receive it.

No subject run or grading was performed. Structural/frontmatter/link/script checks do **not** establish Librarian behavioral quality; independent evaluation and review are later assignments.

## Owner updates and remaining work

After acceptance, the Coordinator should add a current-state entry to protected `docs/CURRENT.md` replacing the active future-Librarian/five-role description at line 81 with the defined six-role installation, source ownership and pinned revision; retain historical verification entries as history. Record actual accepted execution in `docs/TASK_LOGS.md` and link this report. Both protected files are unchanged. Global links still target their prior Brainlab source locations until a separate migration assignment. Main-checkout drafts were read only.

Independent review, blind evaluation, later grading/fixes, destination merge, public push/publication and global-link migration remain outside this assignment. No implementation blocker is open. Keep candidate branches/workspaces for the pending review/fix loop; the Coordinator owns their eventual release.
