task: versioned-agent-skills / skills-impl-herdr-codex-permissions
status: complete
outcome: Codex prefers the matching existing daemon and falls back to a terminated short-lived native stdio reader. Portable auto-review is mapped inside the Claude/Codex adapters, preserves normal permission review, and rejects conflicting native flags.
artifacts:
- .agents/skills/ruach-herdr/
- docs/mailbox/versioned-agent-skills/implementer-herdr-codex-permissions.md
- versioned-agent-skills-herdr
- 97ced69eeafbded858698372ff1c65eed9caca01
verification:
- 'Source and committed standalone full default suites: each 107 passed, 0 failed, 753 assertions.'
- Source and standalone frozen installs, standalone CLI help, quick format validation, portability/policy and scope/whitespace checks passed.
- 'All five preferred roles and every alternative: 18 resolve/dry-run preparations passed with auto-review at exact 97752643; no panes/submissions.'
- 'Implemented native stdio reader passed in isolated synthetic config home: project layer and disabled user skill preserved; no pre-existing file changes; fixture removed.'
- Installed Claude/Codex help verified permission flags; shared matching Codex daemon stayed running.
- Handoff validation passed with ok=true, empty diagnostics and all supplied revisions resolved.
discoveries:
- The Coordinator explicitly authorizes native Codex runtime initialization; only resolve --offline promises fully write-free preparation.
- Root integration must pass --permissions auto-review rather than duplicate native harness flags; default remains inherit.
- The real no-daemon check exercised the native reader boundary in isolation; full CLI no-daemon resolve/dry-run/start and lifecycle failure paths were exercised with fakes.
blockers: []
candidate_revision: 97ced69eeafbded858698372ff1c65eed9caca01
tested_revision: 97ced69eeafbded858698372ff1c65eed9caca01
delivered_revision: 97ced69eeafbded858698372ff1c65eed9caca01
source_baseline: 62d7ac705b04d4e039112228775f6052a6f8da64
followup_baseline: e3a23eedd9c5b692bf3b6780d176f613dd9fa414
schema_revision: 97752643b31cdcf8c8ec9f09204382c6766b1573

Author: Implementer (skills-impl-herdr). Date: 2026-10-04 UTC.

## Delivery and integration seam

Implementation changes eleven owned skill files: [worker CLI](../../../.agents/skills/ruach-herdr/scripts/worker.ts), [contracts](../../../.agents/skills/ruach-herdr/scripts/contracts.ts), [adapter dispatch](../../../.agents/skills/ruach-herdr/scripts/adapters/index.ts), [Claude](../../../.agents/skills/ruach-herdr/scripts/adapters/claude.ts), [Codex](../../../.agents/skills/ruach-herdr/scripts/adapters/codex.ts), [native Codex reader](../../../.agents/skills/ruach-herdr/scripts/native-codex.ts), [tests](../../../.agents/skills/ruach-herdr/tests/worker.test.ts), [fake CLI](../../../.agents/skills/ruach-herdr/tests/fixtures/fake-cli.ts), [SKILL.md](../../../.agents/skills/ruach-herdr/SKILL.md), [adapter reference](../../../.agents/skills/ruach-herdr/references/adapters.md) and [routing reference](../../../.agents/skills/ruach-herdr/references/routing.md). The existing tested implementation SHA is above; the later report-only commit SHA is returned in the terminal handoff. Previous reports are unchanged.

`--permissions inherit|auto-review` defaults to inherit and appears in resolve/dry-run output and selection. Offline reports the requested policy without claiming native capability. Auto-review maps inside the selected adapter: Claude emits `--permission-mode auto`; Codex emits `--approve-for-me`. Unsupported adapter mappings fail exit 3 before mutation. Conflicting native permission/approval/sandbox flags fail exit 2 before config inspection, including equals forms and short aliases. Existing bounded permission pass-through remains available under inherit. No bypass mode, unconditional approval, broad permission default or silent alternative was introduced.

Root integration should forward **`--permissions auto-review`** to preserve the required automatic review policy. Native flag construction belongs only to the skill adapters. Root launcher changes and integration/merging are outside this assignment and were not performed.

Codex first reads through the matching existing daemon. Unavailable/mismatched/erroring daemon inspection falls back to `codex app-server --listen stdio://` using the actual cwd and unchanged environment/config home. Only initialize, initialized, config/read and skills/list are sent; no thread, turn, prompt or paid request. JSONL notifications are ignored. The reader has a ten-second deadline, closes stdin after reads, allows one second for exit, then forces termination if necessary; it is awaited on every path. When both transports are unavailable, exit 3 is retained with native output withheld. Existing config/catalog validation and developer/skill merge behavior remain. Output identifies `config_reader` and notes possible stdio runtime initialization.

## Authorization and native evidence

The parent explicitly authorizes Codex's native runtime initialization for this preparation. This supersedes the previous report's daemon-only decision; it does not authorize changing user settings. Native runtime assets can include state_5, goals_1, logs_2, memories_1 and queue_1 SQLite databases/WAL/SHM, installation_id, bundled `.system` skill files/marker, and .tmp plugin-lock/git HEAD files. Configured runtime storage can place databases outside default CODEX_HOME. The launcher and inspection protocol do not write config.toml, AGENTS.md, user-authored skills, profiles or credentials. Bundled system skills are runtime assets. Normal resolve/dry-run may initialize runtime state; only offline preparation is fully write-free. The [official app-server contract](https://developers.openai.com/codex/app-server/) documents initialization and the config/catalog RPCs separately from turns; configuration remains natively layered.

Installed help probes all exited 0. Claude **2.1.289** lists `auto` among permission-mode choices. Codex **0.160.0** describes `--approve-for-me` as routing approval requests through automatic review with workspace-write; it separately advertises dangerous bypass flags, which this mapping never emits. These are installed CLI syntax/semantics checks, not live approval-classifier acceptance.

The new isolated real probe called the implemented `codexRead` with synthetic HOME/CODEX_HOME/XDG directories at `/tmp/ruach-herdr-native-fallback-umue3853`. Isolated daemon metadata exited 1, so the implementation selected stdio. The reader exited 0, preserved trusted project developer instructions and the disabled user skill entry, and returned the requested catalog cwd. Hash snapshots found zero changes to every pre-existing fixture file: user/project config.toml, AGENTS.md, profile and custom SKILL.md. The fixture was removed. Added files were native databases, bundled system assets, installation_id and .tmp files; one additional Bun transpiler-cache file appeared under the isolated XDG cache from running the TypeScript probe. No real config/runtime home was replaced or touched by the isolated probe.

This was a native-reader boundary check, not a real full CLI no-daemon launch/resolve. The shared daemon was not stopped/replaced and afterwards still reported running with matching 0.160.0 versions. Actual all-role CLI preparations used that existing daemon for Codex. Full no-daemon resolve/dry-run/start was verified with fakes, including unchanged credential/profile/config/skill bytes, preserved layered developer text and existing skill entries, coordinator workflow visibility, PID disappearance, malformed protocol, both-reader failure, lingering-after-EOF cleanup and deadline termination. Permission mapping/default/conflict/unsupported/help checks are also at the worker CLI boundary.

## Exact verification commands

Bun 1.4.2. Commands from this worktree unless cwd is given; socket-dependent checks used authorized local socket access.

```sh
codex --help
codex --version
codex app-server --help
claude --help
claude --version
codex app-server daemon version
/home/metatron/.bun/bin/bun install --frozen-lockfile --cwd .agents/skills/ruach-herdr
/home/metatron/.bun/bin/bun test --cwd .agents/skills/ruach-herdr > .agents/scratch/herdr-permissions-tests.log 2>&1
python3 .agents/scratch/verify-herdr-permissions-live.py > .agents/scratch/herdr-permissions-live.jsonl
python3 .agents/scratch/probe-herdr-native-fallback.py > .agents/scratch/herdr-permissions-native-fallback.jsonl
python3 .agents/scratch/verify-herdr-portable.py > .agents/scratch/herdr-permissions-portable.jsonl
python3 .agents/scratch/verify-herdr-fix-scan.py
python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/ruach-herdr
git diff --check
git diff --check 62d7ac7..HEAD
git diff --stat e3a23ee..HEAD
git diff --stat 62d7ac7..HEAD
```

Source frozen install exited 0, checked two installs across three packages with no changes. Full default suite: **107 pass, 0 fail, 753 assertions**, 88.04s. The exact files were committed with no intervening edits. Preliminary focused suite: 27 pass, 0 fail, 248 assertions, 14.28s; final results include the added coordinator and deadline cases.

Standalone committed copy `/tmp/ruach-herdr-copy-21eaekvl/copied skill` ran its own `bun install --frozen-lockfile`, `bun scripts/worker.ts --help`, and default `bun test`: all exit 0, **107 pass, 0 fail, 753 assertions**, 85.56s. The copy was removed. Portability/policy scan: 27 tracked skill files, zero repository-specific paths/names, cross-skill imports, native model literals in scripts/SKILL.md or routing-policy literals. Quick validator: **Skill is valid!** (format evidence only). Scope/whitespace checks passed.

### Exact committed catalog: all roles and alternatives with auto-review

The helper added `/tmp/ruach-herdr-contract-_lx05hjw/checkout with spaces` using `git worktree add --detach PATH 97752643b31cdcf8c8ec9f09204382c6766b1573`, verified HEAD and empty `git status --porcelain` before/after, read `.agents/{models,routing,roles}.yaml`, and removed the checkout with `git worktree remove`. Every Git command exited 0. It ran these argv arrays for each of all five roles alone, then every declared alternative with `--route ROUTE_ID`:

```sh
# W = this worktree; D = detached checkout path above
/home/metatron/.bun/bin/bun "$W/.agents/skills/ruach-herdr/scripts/worker.ts" resolve --name "verify-$role" --role "$role" --cwd "$D" --repo "$D" --permissions auto-review
/home/metatron/.bun/bin/bun "$W/.agents/skills/ruach-herdr/scripts/worker.ts" start --name "verify-$role" --role "$role" --cwd "$D" --repo "$D" --permissions auto-review --dry-run
# Repeat both for each declared alternative with --route ROUTE_ID.
```

| Role | Selection | Route | Harness | Native model | Effort | Permission mapping | Resolve/dry-run exits |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coordinator | preferred (role alone) | claude-opus-5.5-high | claude | claude-opus-5-5 | high | --permission-mode auto | 0/0 |
| architect | preferred (role alone) | claude-opus-5.5-high | claude | claude-opus-5-5 | high | --permission-mode auto | 0/0 |
| architect | alternative | gpt-6.1-sol-high | codex | gpt-6.1-sol | high | --approve-for-me | 0/0 |
| scout | preferred (role alone) | gpt-6.1-sol-high | codex | gpt-6.1-sol | high | --approve-for-me | 0/0 |
| scout | alternative | claude-opus-5.5-high | claude | claude-opus-5-5 | high | --permission-mode auto | 0/0 |
| implementer | preferred (role alone) | gpt-6.1-sol-high | codex | gpt-6.1-sol | high | --approve-for-me | 0/0 |
| implementer | alternative | claude-opus-5.5-high | claude | claude-opus-5-5 | high | --permission-mode auto | 0/0 |
| reviewer | preferred (role alone) | gpt-6.1-sol-high | codex | gpt-6.1-sol | high | --approve-for-me | 0/0 |
| reviewer | alternative | claude-opus-5.5-high | claude | claude-opus-5-5 | high | --permission-mode auto | 0/0 |

All 18 results reported permissions=auto-review, launchable=true, empty diagnostics, submission_state=not-submitted, and no pane/temp launch directory. Prepared argv contained the expected mapping and no bypass flag. Preferred Claude Architect passed both commands. No pane was split and no task/session/model turn was submitted.

## Scope and remaining limits

Only the eleven owned skill files changed in the implementation; the new report commit adds only this report. No root launcher, shared YAML, other skill/role, earlier report, other working checkout, global installation, merge or push changed. Historical baseline stat includes this skill and the five earlier authorized reports. Bounded delta:

```text
 .agents/skills/ruach-herdr/SKILL.md                | 14 ++--
 .agents/skills/ruach-herdr/references/adapters.md  | 16 +++--
 .agents/skills/ruach-herdr/references/routing.md   |  4 +-
 .../skills/ruach-herdr/scripts/adapters/claude.ts  |  4 +-
 .../skills/ruach-herdr/scripts/adapters/codex.ts   |  6 +-
 .../skills/ruach-herdr/scripts/adapters/index.ts   |  2 +
 .agents/skills/ruach-herdr/scripts/contracts.ts    |  4 +-
 .agents/skills/ruach-herdr/scripts/native-codex.ts | 50 ++++++++++++--
 .agents/skills/ruach-herdr/scripts/worker.ts       | 16 +++--
 .../skills/ruach-herdr/tests/fixtures/fake-cli.ts  | 27 +++++++-
 .agents/skills/ruach-herdr/tests/worker.test.ts    | 78 +++++++++++++++++++++-
 11 files changed, 190 insertions(+), 31 deletions(-)
```

Required `git diff --stat 62d7ac7..HEAD` at implementation HEAD:

```text
 .agents/skills/ruach-herdr/SKILL.md                |  54 ++++
 .agents/skills/ruach-herdr/bun.lock                |  18 ++
 .agents/skills/ruach-herdr/package.json            |  13 +
 .agents/skills/ruach-herdr/references/adapters.md  |  43 +++
 .agents/skills/ruach-herdr/references/routing.md   |  53 ++++
 .agents/skills/ruach-herdr/scripts/adapters/agy.ts |   6 +
 .../skills/ruach-herdr/scripts/adapters/claude.ts  |  50 ++++
 .../skills/ruach-herdr/scripts/adapters/codex.ts   |  60 ++++
 .agents/skills/ruach-herdr/scripts/adapters/dsh.ts |   6 +
 .../skills/ruach-herdr/scripts/adapters/index.ts   |  59 ++++
 .agents/skills/ruach-herdr/scripts/adapters/omp.ts |   6 +
 .../ruach-herdr/scripts/adapters/opencode.ts       |   6 +
 .agents/skills/ruach-herdr/scripts/adapters/pi.ts  |   6 +
 .agents/skills/ruach-herdr/scripts/contracts.ts    |  41 +++
 .agents/skills/ruach-herdr/scripts/native-codex.ts |  80 ++++++
 .agents/skills/ruach-herdr/scripts/process.ts      |  31 +++
 .agents/skills/ruach-herdr/scripts/routing.ts      |  53 ++++
 .agents/skills/ruach-herdr/scripts/skills.ts       |  56 ++++
 .agents/skills/ruach-herdr/scripts/worker.ts       | 113 ++++++++
 .../skills/ruach-herdr/tests/fixtures/fake-cli.ts  |  67 +++++
 .../tests/fixtures/portable-routing/models.yaml    |   7 +
 .../tests/fixtures/portable-routing/roles.yaml     |   8 +
 .../tests/fixtures/portable-routing/routing.yaml   |   7 +
 .../ruach-herdr/tests/fixtures/routing/models.yaml |   7 +
 .../ruach-herdr/tests/fixtures/routing/roles.yaml  |  15 +
 .../tests/fixtures/routing/routing.yaml            |  10 +
 .agents/skills/ruach-herdr/tests/worker.test.ts    | 310 +++++++++++++++++++++
 .../implementer-herdr-claude-gate.md               | 158 +++++++++++
 .../implementer-herdr-contract.md                  | 163 +++++++++++
 .../implementer-herdr-fix.md                       | 133 +++++++++
 .../implementer-herdr-routing.md                   | 136 +++++++++
 .../versioned-agent-skills/implementer-herdr.md    | 126 +++++++++
 32 files changed, 1901 insertions(+)
```

Real evidence establishes argv/config preparation and isolated native reader behavior. Paid sessions, model availability/entitlement, native role/skill catalog acceptance, full account/plugin/managed visibility, and actual automatic-review decisions during a model turn remain unverified. Fakes inspect generated arguments/material and process lifecycle, not native model behavior. No blocker remains to this bounded implementation; root option forwarding is a Coordinator integration responsibility.

Report validation uses the instructed integration copy:

```sh
/home/metatron/.bun/bin/bun /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills/.agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/versioned-agent-skills/implementer-herdr-codex-permissions.md --repo /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-herdr
```

Validation exited 0 with `ok: true`, no diagnostics and all six revision references resolved. This validates report format/references, not independent technical acceptance.
