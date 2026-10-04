task: versioned-agent-skills / skills-impl-herdr
status: complete
outcome: Portable single-submission Herdr worker with provisional routed/direct selection, preserving Codex/Claude
  native configuration and accurately gating five unverified adapters.
artifacts:
- .agents/skills/ruach-herdr/
- docs/mailbox/versioned-agent-skills/implementer-herdr.md
- versioned-agent-skills-herdr
- a47d8d61ce1e012212234ad2d693f97b6576aaa0
- a8403a59f6192203511af35e319f0381c0ae1dc0
- fd70f8db33e043bae4ef89b44e10f934771cb609
verification:
- 'Final skill suite: 50 passed, 0 failed, including actual startup wall-clock timeout.'
- 'Standalone copied skill: frozen install, CLI help, and the same 50 tests passed.'
- 'Installed Claude 2.1.289 and Codex 0.160.0: four routed resolve/dry-run preparations passed with fixture YAML;
  direct Codex resolution and inferred Git root also passed.'
- Skill quick validator, diff whitespace check, scope and portability/model-default scans passed.
discoveries:
- Routing remains a documented provisional schema; integration checkpoints are listed in references/routing.md.
- Codex read-only effective config requires an existing matching-version daemon; its local control socket uses WebSocket,
  not raw JSON lines.
- DSH is not a Herdr 0.9.0 kind; Pi/OpenCode/DSH executables are absent. OMP and Agy capability gaps fail before
  mutation.
blockers: []
candidate_revision: a47d8d61ce1e012212234ad2d693f97b6576aaa0
tested_revision: a47d8d61ce1e012212234ad2d693f97b6576aaa0
delivered_revision: a47d8d61ce1e012212234ad2d693f97b6576aaa0
source_baseline: 62d7ac705b04d4e039112228775f6052a6f8da64

Author: Implementer (skills-impl-herdr). Date: 2026-10-04 UTC.

## Delivery

Implementation commits are `a8403a59f6192203511af35e319f0381c0ae1dc0`, `fd70f8db33e043bae4ef89b44e10f934771cb609`, and `a47d8d61ce1e012212234ad2d693f97b6576aaa0` on `versioned-agent-skills-herdr`. The report is committed separately after implementation, as assigned; its creating revision is returned in the terminal handoff rather than predicted here. No merge, push, global installation, root launcher or repository-root YAML was performed.

Changed files are confined to the new [ruach-herdr skill](../../../.agents/skills/ruach-herdr/SKILL.md) and this report. The skill contains contracts/process/config-discovery helpers, isolated provisional routing, seven adapter modules, native Codex read-only RPC, the worker CLI, pinned package/lockfile, adapter/routing references, and CLI-boundary tests with fake executables plus fixture YAML. Generated role/config material remains temporary; committed fixtures use invented instruction text, not copied canonical role bodies.

`resolve`, `resolve --offline`, `start --dry-run`, and `start` emit versioned JSON. Direct selection preserves explicit model/kind; routed selection validates the entire role→route→model graph, efforts and canonical role sources before mutation. Coordinator routing is data-owned, with a Claude fixture profile. No code or SKILL.md model defaults exist. Offline output cannot authorize a launch. Invalid/unsupported prerequisites and native conflicts fail before files/panes; startup makes one split and one mutating agent submission, no retry. It preserves spaced cwd, exact accepted native argv, caller PATH and already-selected user harness homes. Startup errors/timeouts report uncertain state with exit 4 and retain potentially needed private material.

Codex composes effective existing `developer_instructions` and `skills.config` via the running native daemon. Claude uses canonical `--append-system-prompt-file`, a minimal settings overlay, and canonical skill symlinks. Workers hide discovered workflow names/paths; coordinators preserve existing native visibility settings. Existing nested Claude skill roots are included. Unverified managed/synced/legacy-command/main-checkout-fallback sources and unfilterable enabled workflow plugins fail before mutation. Printed developer/skill payloads and pass-through values are redacted.

## Verification and exact commands

Final commands ran against `a47d8d61ce1e012212234ad2d693f97b6576aaa0` with an unchanged implementation tree. Bun is 1.4.2.

```sh
/home/metatron/.bun/bin/bun test --cwd .agents/skills/ruach-herdr > .agents/scratch/herdr-final-tests.log 2>&1
python3 .agents/scratch/verify-herdr-portable.py > .agents/scratch/herdr-portable-results.jsonl
python3 .agents/scratch/verify-herdr-live.py > .agents/scratch/herdr-live-results.jsonl
python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/ruach-herdr
git diff --check 62d7ac7..HEAD
git diff --stat 62d7ac7..HEAD
```

- Source suite: **50 passed, 0 failed**, 266 assertions, 71.49s. Tests exercise explicit/routed selection and override, whole-graph invalid YAML/references/efforts/aliases, missing CLI/kind/context/daemon/catalog, no mutation or writes for dry-run/failures, config/developer preservation, worker/coordinator workflow visibility, nested/external/synced/plugin/legacy sources, secret redaction, exact argv/cwd/config-root forwarding, unique names, split/start failures and a real 35-second startup deadline with one submission. Missing-dependency testing proves no implicit install.
- Portable script copied only this skill directory into a fresh OS temp directory with spaces in its name, excluding node_modules, then executed `/home/metatron/.bun/bin/bun install --frozen-lockfile`, `/home/metatron/.bun/bin/bun scripts/worker.ts --help`, and `/home/metatron/.bun/bin/bun test` with that copy as cwd. All exited 0; the copied suite had **50 passed, 0 failed**, 80.18s. The temporary copy was removed. Dependencies are pinned to yaml 2.8.1 and ws 8.18.3 in the skill-local manifest/lockfile.
- Quick validator: **Skill is valid!** This is format evidence only. Whitespace diff check exited 0. Source scope check found 24 skill files and no unowned paths. Portability scan found no `/tmp/brainlab`, repository names, `/home/metatron` or `/opt/dev` in committed skill sources/references/tests. Model scan found no native model identifiers in scripts or SKILL.md; identifiers live only in fixture data.

The live script created fixture YAML and temporary copies of this worktree's canonical coordinator/implementer role files under `.agents/scratch/herdr-live-fixture`, then executed these four argv arrays, with `W` equal to this worktree's absolute path and Bun added to PATH:

```sh
bun "$W/.agents/skills/ruach-herdr/scripts/worker.ts" resolve --name verify-coordinator --role coordinator --cwd "$W" --repo "$W/.agents/scratch/herdr-live-fixture"
bun "$W/.agents/skills/ruach-herdr/scripts/worker.ts" start --name verify-coordinator --role coordinator --cwd "$W" --repo "$W/.agents/scratch/herdr-live-fixture" --dry-run
bun "$W/.agents/skills/ruach-herdr/scripts/worker.ts" resolve --name verify-implementer --role implementer --cwd "$W" --repo "$W/.agents/scratch/herdr-live-fixture"
bun "$W/.agents/skills/ruach-herdr/scripts/worker.ts" start --name verify-implementer --role implementer --cwd "$W" --repo "$W/.agents/scratch/herdr-live-fixture" --dry-run
```

All four exited 0 with `launchable: true`, empty diagnostics and the following effective values. These are preparation results, not live launch acceptance:

| Role | Route | Kind/version | Fixture native model | Effort | Effective native contribution |
| --- | --- | --- | --- | --- | --- |
| coordinator | lead | claude 2.1.289 | claude-opus-4-6 | high | `--model MODEL --append-system-prompt-file ROLE --effort high --settings <private-temp>/settings.json --add-dir <private-temp>` |
| implementer | build | codex 0.160.0 | gpt-6.1-sol | high | `--model MODEL --cd CWD -c developer_instructions=<redacted> -c model_reasoning_effort="high" -c skills.config=<preserved + workflow overrides>` |

Also executed successfully without `--repo`:

```sh
PATH=/home/metatron/.bun/bin:$PATH /home/metatron/.bun/bin/bun .agents/skills/ruach-herdr/scripts/worker.ts resolve --name verify-explicit --role implementer --kind codex --model gpt-6.1-sol --effort high --cwd /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-herdr
```

It resolved this exact worktree's Git root and `.agents/agents/implementer.md`, preserving explicit kind/model/effort and preparing redacted native argv. Help/version probes included `herdr agent start --help`, `herdr pane split --help`, `herdr pane layout --help`, `herdr --version`, `claude --help/--version`, `codex --help/--version`, `codex app-server --help`, `codex app-server proxy --help`, `codex app-server daemon --help/version`, `PATH=/home/metatron/.bun/bin:$PATH omp --help`, `omp config --help`, `omp models --help`, and `agy --help`. Read-only real `herdr pane layout --current` and `herdr agent list` established caller/response shapes. Native flag sources and primary documentation links are retained in [adapter evidence](../../../.agents/skills/ruach-herdr/references/adapters.md).

An early suite caught an absolute CLAUDE_CONFIG_DIR joining error (30 passed, 1 failed); it was corrected and all subsequent complete suites passed. Raw-JSON Codex proxy probes timed out without a model turn; inspecting the primary control-socket implementation established the verified WebSocket reader. The shipped worker never starts the standalone server or a daemon.

## Decisions, integration and coverage limits

- Assignment overrides the proposed design's wait-for-schema gate: routed start is enabled against the explicitly provisional shape. [Routing references](../../../.agents/skills/ruach-herdr/references/routing.md) isolate all integration checkpoints and describe the thin root-command delegation seam; no root command was created.
- Codex/Claude coverage is **live-capable preparation, fake launch/config acceptance only**. No real paid agent startup, prompt, turn, native injected-role/filtered-catalog acceptance, entitlement or remote model availability check was run. Those were explicitly excluded from this assignment. Native application behavior beyond documented merge/visibility semantics remains unverified.
- Pi/OpenCode/DSH/Agy/OMP coverage is **fixture/failure-only**; they emit no speculative native launch argv. Pi/OpenCode/DSH are absent; Herdr 0.9.0 omits DSH. Agy additive role/visibility is unverified. OMP has verified append/config/ignored-skill flags, but fuzzy model identity and safe effective settings discovery remain unverified; installed normal config initialization opens persistent storage. Gating OMP rather than approximating config or running a mutating preflight is a justified stricter gate than the proposed design. No harness/model substitution occurs.
- Codex requires a matching already-running local daemon to preserve effective layered config without bootstrap writes. The local Unix WebSocket transport is verified on this installed Linux environment; a Windows pipe integration is not claimed. Temp roots use OS APIs, not platform-specific task paths.
- Skill discovery/overrides are a startup snapshot. Future new skill sources or native versions need capability verification. Unsupported sources fail where detected; no watcher or ongoing catalog enforcement was added.
- No outstanding blocker to the assigned implementation/handoff. Committed-schema integration and enabling currently gated adapters are future work, not claims of completion here. Review/acceptance by another worker is not inferred.

## Scope evidence

Executed `git diff --stat 62d7ac7..HEAD` at implementation HEAD `a47d8d61ce1e012212234ad2d693f97b6576aaa0` before adding this report:

```text
.agents/skills/ruach-herdr/SKILL.md                |  40 ++++++
 .agents/skills/ruach-herdr/bun.lock                |  18 +++
 .agents/skills/ruach-herdr/package.json            |  13 ++
 .agents/skills/ruach-herdr/references/adapters.md  |  27 ++++
 .agents/skills/ruach-herdr/references/routing.md   |  49 ++++++++
 .agents/skills/ruach-herdr/scripts/adapters/agy.ts |   6 +
 .../skills/ruach-herdr/scripts/adapters/claude.ts  |  75 +++++++++++
 .../skills/ruach-herdr/scripts/adapters/codex.ts   |  55 ++++++++
 .agents/skills/ruach-herdr/scripts/adapters/dsh.ts |   6 +
 .../skills/ruach-herdr/scripts/adapters/index.ts   |  47 +++++++
 .agents/skills/ruach-herdr/scripts/adapters/omp.ts |   6 +
 .../ruach-herdr/scripts/adapters/opencode.ts       |   6 +
 .agents/skills/ruach-herdr/scripts/adapters/pi.ts  |   6 +
 .agents/skills/ruach-herdr/scripts/contracts.ts    |  39 ++++++
 .agents/skills/ruach-herdr/scripts/native-codex.ts |  38 ++++++
 .agents/skills/ruach-herdr/scripts/process.ts      |  31 +++++
 .agents/skills/ruach-herdr/scripts/routing.ts      |  46 +++++++
 .agents/skills/ruach-herdr/scripts/skills.ts       |  62 +++++++++
 .agents/skills/ruach-herdr/scripts/worker.ts       | 111 +++++++++++++++++
 .../skills/ruach-herdr/tests/fixtures/fake-cli.ts  |  43 +++++++
 .../ruach-herdr/tests/fixtures/routing/models.yaml |   9 ++
 .../ruach-herdr/tests/fixtures/routing/roles.yaml  |   5 +
 .../tests/fixtures/routing/routing.yaml            |   7 ++
 .agents/skills/ruach-herdr/tests/worker.test.ts    | 138 +++++++++++++++++++++
 24 files changed, 883 insertions(+)
```

All paths are under exclusive ownership `.agents/skills/ruach-herdr/**`. The separate handoff commit adds only this assigned report under `docs/mailbox/versioned-agent-skills/`; the final terminal handoff reports that existing report-containing SHA. Main checkout, other worktrees/branches, shared roles/workflows and shared documentation were not edited.
