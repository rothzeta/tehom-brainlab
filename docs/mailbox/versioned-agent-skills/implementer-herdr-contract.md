task: versioned-agent-skills / skills-impl-herdr-contract
status: complete
outcome: Removed universal Claude catalog gates; preferred Claude Architect prepares successfully with targeted known-workflow suppression and canonical-role-only launcher instructions. Codex existing-daemon prerequisite retained after stdio inspection created persistent state.
artifacts:
- .agents/skills/ruach-herdr/
- docs/mailbox/versioned-agent-skills/implementer-herdr-contract.md
- versioned-agent-skills-herdr
- 97e7c09bf8d9a8195d038217f98ad17becb69833
verification:
- 'Full default source and standalone copy suites: each 79 passed, 0 failed, 499 assertions.'
- Source and standalone frozen installs, standalone CLI help passed.
- 'All five preferred roles and every alternative: 18 resolve/dry-run preparations passed against exact 97752643 catalogs; no panes/submissions.'
- Isolated native stdio probe read layered config but created persistent state; temporary tree removed.
- Quick format validator, portability/policy scan, scope and whitespace checks passed.
- Handoff schema validation passed with ok=true, empty diagnostics and every supplied revision resolved.
discoveries:
- Full Claude account/plugin/managed/legacy catalog visibility is unverified and nonfatal under the parent correction.
- Codex 0.160.0 stdio initialization writes SQLite state, installation_id and system skills despite only config/catalog RPCs.
- The existing matching shared Codex daemon was never stopped or replaced.
blockers: []
candidate_revision: 97e7c09bf8d9a8195d038217f98ad17becb69833
tested_revision: 97e7c09bf8d9a8195d038217f98ad17becb69833
delivered_revision: 97e7c09bf8d9a8195d038217f98ad17becb69833
source_baseline: 62d7ac705b04d4e039112228775f6052a6f8da64
correction_baseline: c2a2017b79255571f97342284ede0892788ac579
schema_revision: 97752643b31cdcf8c8ec9f09204382c6766b1573

Author: Implementer (skills-impl-herdr). Date: 2026-10-04 UTC.

## Delivery

The correction changes seven owned files: [Claude adapter](../../../.agents/skills/ruach-herdr/scripts/adapters/claude.ts), [discovery](../../../.agents/skills/ruach-herdr/scripts/skills.ts), [CLI tests](../../../.agents/skills/ruach-herdr/tests/worker.test.ts), [fake harness](../../../.agents/skills/ruach-herdr/tests/fixtures/fake-cli.ts), [SKILL.md](../../../.agents/skills/ruach-herdr/SKILL.md), [adapter evidence](../../../.agents/skills/ruach-herdr/references/adapters.md), and [routing reference](../../../.agents/skills/ruach-herdr/references/routing.md). The implementation/tested revision above exists. This report is committed separately; its SHA is returned in the terminal handoff. Earlier reports remain unchanged.

Removed the blanket source refusals for managed files/fragments, enterprise skills, account caches, linked-worktree fallback, legacy commands and enabled plugins. Known local workflow names still receive a private minimal `skillOverrides` off overlay. Workers omit canonical workflow symlinks; Coordinator retains them without forcing disabled workflows on. Synced caches are left to native discovery, including when encountered through an accepted additional directory, so native cache format cannot introduce another startup gate.

Only the Coordinator loads/executes workflow bodies. The launcher supplies the canonical role as additive worker instructions and never injects workflow bodies. Workers follow their role and the Coordinator's self-contained assignment; universal catalog-description exclusion is not required. Native settings/customizations remain unchanged. Exact models/efforts, true CLI/version/capability failures, safe argv/redaction and no automatic alternatives remain. Complete live catalog visibility is explicitly documented as an unverified nonfatal limit in SKILL.md/references; existing output limits already disclaim native prompt/skill acceptance.

Replaced obsolete gate assertions with preferred Architect preparation, empty/technical/native-format caches, unchanged customization byte snapshots, canonical role paths, no workflow bodies in argv/temp files, targeted workflow suppression, Coordinator visibility and linked-worktree preparation. Managed sources are temporary fake-native fixtures, not real enterprise policy or a live managed loader. Unaffected regressions, including missing daemon/invalid catalog failures, remain.

## Codex reader assessment and decision

Installed help commands below all exited 0; Codex is 0.160.0. The [official app-server contract](https://developers.openai.com/codex/app-server/) supports stdio initialization and config/catalog reads separately from model turns. Debug help exposes model/prompt tools and a message sender, not a verified standalone effective-config reader. The [official configuration reference](https://developers.openai.com/codex/config-reference/) documents database storage configuration, which does not establish suppression of other installation/skill writes.

The isolated probe launched `codex app-server --listen stdio://` with temporary HOME/CODEX_HOME/XDG roots and a trusted project. It sent only initialize, initialized notification, config/read (requested cwd, includeLayers=false) and skills/list (requested cwd, forceReload=false). It returned the trusted project developer override rather than the user override. Native layered reads and catalog response succeeded, exit was 0, and SHA snapshots found no changes to pre-existing fixture files.

It nevertheless added persistent state_5, goals_1, logs_2, memories_1 and queue_1 SQLite databases, WAL/SHM files, installation_id and bundled system-skill files/marker. They remained after exit. It also created .tmp/plugins.sync.lock and a temporary git HEAD. This is not exclusively ephemeral runtime state. The probe tree `/tmp/ruach-herdr-stdio-lh_29ap6` was removed and absence confirmed. No real user settings/state or shared daemon was changed by this probe. No model thread/turn was created.

Retain the existing matching-daemon prerequisite: no suitable reader meeting the no-user-state-write constraint was verified. Redirecting database storage alone does not establish absence of the other writes, and replacing production config home would discard actual user layers. No guessed/stripped config, production inspection subprocess, persistent daemon framework or automatic fallback was introduced. This is the assignment's allowed evidence-based limitation, not a claim about future native capabilities. The existing shared daemon reports running/matching 0.160.0 and served the real preparation reads; it was never stopped. No real no-daemon resolve was run because the fallback was unchanged and stopping the shared daemon was prohibited. The missing-daemon fixture still passes its failure-before-mutation check.

## Verification commands and results

Bun 1.4.2. Commands from this worktree unless a cwd is given. Socket-dependent source/live/copy checks used authorized local socket access.

```sh
codex --version
codex app-server --help
codex debug --help
codex debug app-server --help
codex debug prompt-input --help
codex app-server daemon version
python3 .agents/scratch/probe-herdr-codex-stdio.py > .agents/scratch/herdr-contract-stdio-probe.jsonl
/home/metatron/.bun/bin/bun install --frozen-lockfile --cwd .agents/skills/ruach-herdr
/home/metatron/.bun/bin/bun test --cwd .agents/skills/ruach-herdr > .agents/scratch/herdr-contract-tests.log 2>&1
python3 .agents/scratch/verify-herdr-contract-live.py > .agents/scratch/herdr-contract-live.jsonl
python3 .agents/scratch/verify-herdr-portable.py > .agents/scratch/herdr-contract-portable.jsonl
python3 .agents/scratch/verify-herdr-fix-scan.py
python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/ruach-herdr
git diff --check
git diff --check 62d7ac7..HEAD
git diff --stat c2a2017..HEAD
git diff --stat 62d7ac7..HEAD
```

Source frozen install exited 0, checking two installs across three packages with no changes. Full default source suite: **79 pass, 0 fail, 499 assertions**, 59.36s. The tested files were committed without intervening edits. Preliminary focused Claude checks passed (10 pass, 113 assertions); the final suite verifies the final implementation.

Standalone committed copy `/tmp/ruach-herdr-copy-bo2g47ew/copied skill` ran its own `bun install --frozen-lockfile`, `bun scripts/worker.ts --help` and default `bun test`: all exit 0, **79 pass, 0 fail, 499 assertions**, 58.71s. The copy was removed. Portability/policy scan: 27 tracked skill files, zero repository-specific paths/names, cross-skill imports, native model literals in scripts/SKILL.md or routing-policy literals. Quick validator printed **Skill is valid!** (format evidence only). Scope/whitespace checks passed.

### Exact catalog preparation table

The helper ran `git worktree add --detach "/tmp/ruach-herdr-contract-wgihbt99/checkout with spaces" 97752643b31cdcf8c8ec9f09204382c6766b1573`, checked HEAD, and checked empty `git status --porcelain` before/after. It read `.agents/{models,routing,roles}.yaml` and ran these argv arrays for all five roles alone, then each declared alternative with `--route ROUTE_ID`. The detached checkout was removed using `git worktree remove`; every Git operation exited 0.

```sh
# W = this worktree; D = the detached checkout above
/home/metatron/.bun/bin/bun "$W/.agents/skills/ruach-herdr/scripts/worker.ts" resolve --name "verify-$role" --role "$role" --cwd "$D" --repo "$D"
/home/metatron/.bun/bin/bun "$W/.agents/skills/ruach-herdr/scripts/worker.ts" start --name "verify-$role" --role "$role" --cwd "$D" --repo "$D" --dry-run
# For each alternative, repeat both commands with --route ROUTE_ID appended.
```

| Role | Selection | Route | Harness | Native model | Effort | Resolve/dry-run exits |
| --- | --- | --- | --- | --- | --- | --- |
| coordinator | preferred (role alone) | claude-opus-5.5-high | claude | claude-opus-5-5 | high | 0/0 |
| architect | preferred (role alone) | claude-opus-5.5-high | claude | claude-opus-5-5 | high | 0/0 |
| architect | alternative | gpt-6.1-sol-high | codex | gpt-6.1-sol | high | 0/0 |
| scout | preferred (role alone) | gpt-6.1-sol-high | codex | gpt-6.1-sol | high | 0/0 |
| scout | alternative | claude-opus-5.5-high | claude | claude-opus-5-5 | high | 0/0 |
| implementer | preferred (role alone) | gpt-6.1-sol-high | codex | gpt-6.1-sol | high | 0/0 |
| implementer | alternative | claude-opus-5.5-high | claude | claude-opus-5-5 | high | 0/0 |
| reviewer | preferred (role alone) | gpt-6.1-sol-high | codex | gpt-6.1-sol | high | 0/0 |
| reviewer | alternative | claude-opus-5.5-high | claude | claude-opus-5-5 | high | 0/0 |

All 18 results were launchable with empty diagnostics, submission_state=not-submitted, and no pane/temp launch directory. **Preferred Architect (Claude) now prepares successfully in both commands in the actual account-cache/linked-worktree environment.** No pane was split and no task/session/model turn was submitted.

## Scope and limits

The bounded correction changes only the seven owned skill files; the report commit adds only this newly assigned report. No root launcher, shared YAML, other skill, role, earlier report, other working checkout, global installation, merge or push changed. Full historical baseline stat includes this skill and the four previously authorized reports. Bounded delta:

```text
 .agents/skills/ruach-herdr/SKILL.md                |  4 +-
 .agents/skills/ruach-herdr/references/adapters.md  | 14 +++---
 .agents/skills/ruach-herdr/references/routing.md   |  2 +-
 .../skills/ruach-herdr/scripts/adapters/claude.ts  | 52 ++--------------------
 .agents/skills/ruach-herdr/scripts/skills.ts       | 22 ++++-----
 .../skills/ruach-herdr/tests/fixtures/fake-cli.ts  |  3 +-
 .agents/skills/ruach-herdr/tests/worker.test.ts    | 49 ++++++++++++--------
 7 files changed, 54 insertions(+), 92 deletions(-)
```

Required `git diff --stat 62d7ac7..HEAD` at implementation HEAD:

```text
 .agents/skills/ruach-herdr/SKILL.md                |  50 +++++
 .agents/skills/ruach-herdr/bun.lock                |  18 ++
 .agents/skills/ruach-herdr/package.json            |  13 ++
 .agents/skills/ruach-herdr/references/adapters.md  |  37 ++++
 .agents/skills/ruach-herdr/references/routing.md   |  53 +++++
 .agents/skills/ruach-herdr/scripts/adapters/agy.ts |   6 +
 .../skills/ruach-herdr/scripts/adapters/claude.ts  |  48 +++++
 .../skills/ruach-herdr/scripts/adapters/codex.ts   |  58 +++++
 .agents/skills/ruach-herdr/scripts/adapters/dsh.ts |   6 +
 .../skills/ruach-herdr/scripts/adapters/index.ts   |  57 +++++
 .agents/skills/ruach-herdr/scripts/adapters/omp.ts |   6 +
 .../ruach-herdr/scripts/adapters/opencode.ts       |   6 +
 .agents/skills/ruach-herdr/scripts/adapters/pi.ts  |   6 +
 .agents/skills/ruach-herdr/scripts/contracts.ts    |  39 ++++
 .agents/skills/ruach-herdr/scripts/native-codex.ts |  38 ++++
 .agents/skills/ruach-herdr/scripts/process.ts      |  31 +++
 .agents/skills/ruach-herdr/scripts/routing.ts      |  53 +++++
 .agents/skills/ruach-herdr/scripts/skills.ts       |  56 +++++
 .agents/skills/ruach-herdr/scripts/worker.ts       | 111 ++++++++++
 .../skills/ruach-herdr/tests/fixtures/fake-cli.ts  |  44 ++++
 .../tests/fixtures/portable-routing/models.yaml    |   7 +
 .../tests/fixtures/portable-routing/roles.yaml     |   8 +
 .../tests/fixtures/portable-routing/routing.yaml   |   7 +
 .../ruach-herdr/tests/fixtures/routing/models.yaml |   7 +
 .../ruach-herdr/tests/fixtures/routing/roles.yaml  |  15 ++
 .../tests/fixtures/routing/routing.yaml            |  10 +
 .agents/skills/ruach-herdr/tests/worker.test.ts    | 236 +++++++++++++++++++++
 .../implementer-herdr-claude-gate.md               | 158 ++++++++++++++
 .../implementer-herdr-fix.md                       | 133 ++++++++++++
 .../implementer-herdr-routing.md                   | 136 ++++++++++++
 .../versioned-agent-skills/implementer-herdr.md    | 126 +++++++++++
 31 files changed, 1579 insertions(+)
```

Verified real preparation/config reads and fixture argv/material preservation only. Live role/skill discovery, account/plugin/managed catalog visibility, native session acceptance and model entitlement/availability remain unverified. Fake starts do not emulate native loaders. No paid acceptance check was run. No blocker remains to this bounded correction; Codex keeps its documented daemon prerequisite.

Report schema and revision validation command (integration copy, as assigned):

```sh
/home/metatron/.bun/bin/bun /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills/.agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/versioned-agent-skills/implementer-herdr-contract.md --repo /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-herdr
```

Validation exited 0 with `ok: true`, no diagnostics and all six supplied revisions resolved. This checks report format/references, not independent technical acceptance.
