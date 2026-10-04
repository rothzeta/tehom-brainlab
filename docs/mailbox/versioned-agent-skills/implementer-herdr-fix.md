task: versioned-agent-skills / skills-impl-herdr-fix
status: complete
outcome: Portable routing now validates catalog structure and references with adapter-owned capabilities; live-context requirements and fast socket prerequisite failures are explicit.
artifacts:
- .agents/skills/ruach-herdr/
- docs/mailbox/versioned-agent-skills/implementer-herdr-fix.md
- versioned-agent-skills-herdr
- 2c6a836b236e3d4760ef9afe949b194b11420028
verification:
- "Source suite: 77 passed, 0 failed, 428 assertions."
- "Committed standalone copy: frozen install, CLI help and 77 tests passed."
- "Socket-denied sandbox failed once immediately with EPERM explanation in 38 ms, before per-test setup."
- "Six read-only dependency resolve/dry-run checks passed; detached checkout stayed clean and was removed."
- "Frozen source install, quick validator, portability and routing-policy scans, whitespace and scope checks passed."
- "Handoff schema and existing revisions validated successfully with the integration-branch validator."
discoveries:
- "At dependency revision 97752643 the root Python validator enforces five roles, Claude/Codex, high effort and Claude coordinator routes; those repository policies must remain in its validator/tests rather than this portable skill."
- "Coordinator workflow visibility remains an adapter contract, separate from data-owned coordinator model preference."
- "Sandbox Unix socket permission is required for the fake native config fixture; test module setup now fails once with an explanatory prerequisite error."
blockers: []
candidate_revision: 2c6a836b236e3d4760ef9afe949b194b11420028
tested_revision: 2c6a836b236e3d4760ef9afe949b194b11420028
delivered_revision: 2c6a836b236e3d4760ef9afe949b194b11420028
source_baseline: 62d7ac705b04d4e039112228775f6052a6f8da64
fix_baseline: 17e2db66fbab93e8775f1c120741d82434a0b3bd
schema_revision: 97752643b31cdcf8c8ec9f09204382c6766b1573

Author: Implementer (skills-impl-herdr). Date: 2026-10-04 UTC.

## Changes

Implementation commit `2c6a836b236e3d4760ef9afe949b194b11420028` on `versioned-agent-skills-herdr` contains ten owned skill files: [routing.ts](../../../.agents/skills/ruach-herdr/scripts/routing.ts), adapter [registry](../../../.agents/skills/ruach-herdr/scripts/adapters/index.ts), [Codex](../../../.agents/skills/ruach-herdr/scripts/adapters/codex.ts) and [Claude](../../../.agents/skills/ruach-herdr/scripts/adapters/claude.ts), [SKILL.md](../../../.agents/skills/ruach-herdr/SKILL.md), [routing reference](../../../.agents/skills/ruach-herdr/references/routing.md), [CLI tests](../../../.agents/skills/ruach-herdr/tests/worker.test.ts), and three [portable catalog fixtures](../../../.agents/skills/ruach-herdr/tests/fixtures/portable-routing/). This new report is committed separately; its creating revision is supplied in the terminal handoff. Earlier reports remain unchanged.

Routing keeps unknown/missing field, nonempty catalog, duplicate key, alias, type and complete reference validation. Role entries come from data, without a fixed role set; only the selected role's canonical Markdown file must exist. Registered harnesses are checked through the adapter registry. Selected efforts use the same verified adapter validators as native preparation, without duplicating effort vocabularies in routing.ts. Known gated selections reach accurate unavailable/unsupported exit-3 preparation results without fallback or mutation. Coordinator harness preference comes from data; native workflow exclusion for workers remains unchanged.

Repository-policy tests were removed or converted to generic catalog checks. New CLI-boundary coverage uses builder/designer/auditor roles, medium Codex and low Claude effort, absent unselected role files, coordinator Codex preference, unknown harnesses, unsupported selected efforts and every gated routed adapter. Existing behavior tests remain. The quickstart now states that normal resolve and dry-run require live Herdr context, with selection-only `resolve --offline` immediately nearby. A module-level socket probe fails the suite once before per-test fixtures when local IPC is denied, with explanatory docs and no silent skipping.

## Verification and exact commands

Bun 1.4.2. Commands ran from this worktree, except frozen source install used `.agents/skills/ruach-herdr` as cwd:

```sh
/home/metatron/.bun/bin/bun install --frozen-lockfile
/home/metatron/.bun/bin/bun test --cwd .agents/skills/ruach-herdr > .agents/scratch/herdr-fix-first-tests.log 2>&1
/home/metatron/.bun/bin/bun test --cwd .agents/skills/ruach-herdr --test-name-pattern prerequisite-probe-only > /tmp/herdr-fix-sandbox-probe.log 2>&1
python3 .agents/scratch/verify-herdr-portable.py > .agents/scratch/herdr-fix-portable.jsonl
python3 .agents/scratch/verify-herdr-routing-live.py > .agents/scratch/herdr-fix-live.jsonl
python3 .agents/scratch/verify-herdr-fix-scan.py
python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/ruach-herdr
git diff --check 62d7ac7..HEAD
git diff --stat 62d7ac7..HEAD
git diff --stat 17e2db6..HEAD
/home/metatron/.bun/bin/bun /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills/.agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/versioned-agent-skills/implementer-herdr-fix.md --repo /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-herdr
```

- Frozen source install exited 0, checking two installs across three packages with no changes. Dependencies/lockfile remain pinned and unchanged.
- Source full suite: **77 passed, 0 failed**, 428 assertions, 65.12s. This ran immediately before implementation commit on the exact source files subsequently committed, with no intervening edits. Existing startup timeout and config/mutation boundary regressions passed.
- Standalone helper copied the committed skill directory into `/tmp/ruach-herdr-copy-79q9vv3l/copied skill` without node_modules, ran `/home/metatron/.bun/bin/bun install --frozen-lockfile`, `/home/metatron/.bun/bin/bun scripts/worker.ts --help`, and `/home/metatron/.bun/bin/bun test` there, then removed the copy. All exited 0; **77 passed, 0 failed**, 428 assertions, 61.72s. This directly verifies the existing tested revision above.
- Restricted-sandbox prerequisite probe intentionally exited 1: **0 pass, 1 fail, 1 error, 38 ms**, reporting `Test prerequisite failed: local Unix-domain socket binding is required (EPERM)` and the required execution environment. The full suite above ran with socket access and passed. The denied run proves fast visible failure, rather than repeated hook timeouts; it is not counted as a successful suite.
- Portability/policy scan inspected 27 committed skill files, found no repository-specific paths/names, cross-skill imports or real model literals in scripts/SKILL.md. It scanned routing.ts for all former five role names, seven native harness names and effort vocabulary literals: **zero policy literals and zero violations**. Adapter capability values remain in adapter modules.
- Quick validator printed **Skill is valid!** (format evidence only). Whitespace and bounded scope checks passed. Handoff validator exited 0 with `ok: true`, no diagnostics and all supplied revisions resolved.

## Read-only committed-data check

Used the expressly allowed detached temporary worktree at exact revision `97752643b31cdcf8c8ec9f09204382c6766b1573`:

```sh
git worktree add --detach "/tmp/ruach-herdr-routing-3le2b7zv/checkout with spaces" 97752643b31cdcf8c8ec9f09204382c6766b1573
git -C "/tmp/ruach-herdr-routing-3le2b7zv/checkout with spaces" rev-parse HEAD
git -C "/tmp/ruach-herdr-routing-3le2b7zv/checkout with spaces" status --porcelain
```

For each role `coordinator`, `implementer`, `reviewer`, with `W=/opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-herdr` and `D=/tmp/ruach-herdr-routing-3le2b7zv/checkout with spaces`, the helper invoked:

```sh
/home/metatron/.bun/bin/bun "$W/.agents/skills/ruach-herdr/scripts/worker.ts" resolve --name "verify-$role" --role "$role" --cwd "$D" --repo "$D"
/home/metatron/.bun/bin/bun "$W/.agents/skills/ruach-herdr/scripts/worker.ts" start --name "verify-$role" --role "$role" --cwd "$D" --repo "$D" --dry-run
```

All six exited 0, with empty diagnostics, `launchable: true` and `submission_state: not-submitted`. Matching effective resolve/dry-run selections:

| Role | Route | Kind | Native model from committed YAML | Effort | Native version |
| --- | --- | --- | --- | --- | --- |
| coordinator | claude-opus-5.5-high | claude | claude-opus-5-5 | high | 2.1.289 |
| implementer | gpt-6.1-sol-high | codex | gpt-6.1-sol | high | 0.160.0 |
| reviewer | gpt-6.1-sol-high | codex | gpt-6.1-sol | high | 0.160.0 |

Ending `git -C "$D" status --porcelain` was empty. `git worktree remove "$D"` exited 0; its OS-temp parent was removed. No panes, launch material or paid sessions were created. These checks establish read-only preparation, not native session acceptance or account/model entitlement.

## Discovery, decisions and limits

Read-only `git show 97752643b31cdcf8c8ec9f09204382c6766b1573:scripts/agent-routing.py` confirmed fixed repository policy at `ROLES` and its harness, effort, role-set and coordinator checks. The bounded fix assignment supersedes the earlier adaptation's duplication of those policies. At integration, the root validator/tests retain repository policy before delegating generic worker preparation. The [routing reference](../../../.agents/skills/ruach-herdr/references/routing.md) explicitly distinguishes these responsibilities and preserves the previously documented root delegation/compatibility differences. No root validator/test, shared YAML or launcher was edited.

No merge, push, global installation or real paid startup occurred. Native role/filtered-skill acceptance, model entitlement and enabling gated adapters remain unverified and outside scope. The Unix socket prerequisite was exercised in the actual denied sandbox; the old repeated-beforeEach failure was not rerun on the old code. No outstanding blocker to this bounded fix. Independent review/acceptance is not inferred.

## Scope

`git diff --stat 17e2db6..HEAD` at implementation revision `2c6a836b236e3d4760ef9afe949b194b11420028` contained ten owned skill files only. The earlier report files are unchanged. Required full-baseline `git diff --stat 62d7ac7..HEAD`:

```text
.agents/skills/ruach-herdr/SKILL.md                |  48 +++++
 .agents/skills/ruach-herdr/bun.lock                |  18 ++
 .agents/skills/ruach-herdr/package.json            |  13 ++
 .agents/skills/ruach-herdr/references/adapters.md  |  27 +++
 .agents/skills/ruach-herdr/references/routing.md   |  53 ++++++
 .agents/skills/ruach-herdr/scripts/adapters/agy.ts |   6 +
 .../skills/ruach-herdr/scripts/adapters/claude.ts  |  78 ++++++++
 .../skills/ruach-herdr/scripts/adapters/codex.ts   |  58 ++++++
 .agents/skills/ruach-herdr/scripts/adapters/dsh.ts |   6 +
 .../skills/ruach-herdr/scripts/adapters/index.ts   |  57 ++++++
 .agents/skills/ruach-herdr/scripts/adapters/omp.ts |   6 +
 .../ruach-herdr/scripts/adapters/opencode.ts       |   6 +
 .agents/skills/ruach-herdr/scripts/adapters/pi.ts  |   6 +
 .agents/skills/ruach-herdr/scripts/contracts.ts    |  39 ++++
 .agents/skills/ruach-herdr/scripts/native-codex.ts |  38 ++++
 .agents/skills/ruach-herdr/scripts/process.ts      |  31 ++++
 .agents/skills/ruach-herdr/scripts/routing.ts      |  53 ++++++
 .agents/skills/ruach-herdr/scripts/skills.ts       |  62 +++++++
 .agents/skills/ruach-herdr/scripts/worker.ts       | 111 ++++++++++++
 .../skills/ruach-herdr/tests/fixtures/fake-cli.ts  |  43 +++++
 .../tests/fixtures/portable-routing/models.yaml    |   7 +
 .../tests/fixtures/portable-routing/roles.yaml     |   8 +
 .../tests/fixtures/portable-routing/routing.yaml   |   7 +
 .../ruach-herdr/tests/fixtures/routing/models.yaml |   7 +
 .../ruach-herdr/tests/fixtures/routing/roles.yaml  |  15 ++
 .../tests/fixtures/routing/routing.yaml            |  10 ++
 .agents/skills/ruach-herdr/tests/worker.test.ts    | 200 +++++++++++++++++++++
 .../implementer-herdr-routing.md                   | 136 ++++++++++++++
 .../versioned-agent-skills/implementer-herdr.md    | 126 +++++++++++++
 29 files changed, 1275 insertions(+)
```

The separate report commit adds only `docs/mailbox/versioned-agent-skills/implementer-herdr-fix.md`; its actual SHA is returned after committing it.
