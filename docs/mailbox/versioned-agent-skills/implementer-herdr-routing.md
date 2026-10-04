task: versioned-agent-skills / skills-impl-herdr-routing
status: complete
outcome: Herdr routed selection consumes the committed .agents catalogs, validates complete references and role constraints, and documents the root command delegation seam.
artifacts:
- .agents/skills/ruach-herdr/
- docs/mailbox/versioned-agent-skills/implementer-herdr-routing.md
- versioned-agent-skills-herdr
- 8dc2c9fc5826c8696f07f7f852e65f8078c0b050
- 1151b4803f30950223cadb7c46ec14c85c2fc9d1
verification:
- "Final source suite: 67 passed, 0 failed, 358 assertions."
- "Standalone copied skill: frozen installation, CLI help and 67 tests passed."
- "Six read-only resolve/dry-run preparations against detached dependency revision passed; checkout stayed clean and was removed."
- "Frozen source installation, skill quick validator, portability/model-name scans and whitespace/scope checks passed."
- "Handoff schema and existing revision validation passed using the integration branch validator."
discoveries:
- "The authoritative catalogs live under .agents/, use dotted IDs and harness/native_model plus preferred/alternatives; routed effort is required high, and coordinator routes require Claude."
- "The existing root entrypoint is just agent-routing -> bin/agent-routing -> scripts/agent-routing.py; it independently launches and does not delegate to worker.ts."
- "Integration must resolve existing-pane support, response/exit compatibility, permission defaults, workflow visibility and resolve preflight dependencies."
blockers: []
candidate_revision: 1151b4803f30950223cadb7c46ec14c85c2fc9d1
tested_revision: 1151b4803f30950223cadb7c46ec14c85c2fc9d1
delivered_revision: 1151b4803f30950223cadb7c46ec14c85c2fc9d1
source_baseline: 62d7ac705b04d4e039112228775f6052a6f8da64
adaptation_baseline: 33406598c18b8481fe843582c9e582b97e1f3d53
schema_revision: 97752643b31cdcf8c8ec9f09204382c6766b1573

Author: Implementer (skills-impl-herdr). Date: 2026-10-04 UTC.

## Delivery

Implemented on `versioned-agent-skills-herdr` in commits `8dc2c9fc5826c8696f07f7f852e65f8078c0b050` and `1151b4803f30950223cadb7c46ec14c85c2fc9d1`. Verification below ran on the final existing revision with an unchanged implementation tree. The new report is committed separately afterward; its creating SHA is returned in the terminal handoff. The prior [implementation report](implementer-herdr.md) remains unchanged.

Changed files are [SKILL.md](../../../.agents/skills/ruach-herdr/SKILL.md), [routing reference](../../../.agents/skills/ruach-herdr/references/routing.md), [routing.ts](../../../.agents/skills/ruach-herdr/scripts/routing.ts), [worker.ts](../../../.agents/skills/ruach-herdr/scripts/worker.ts), the three [routing fixtures](../../../.agents/skills/ruach-herdr/tests/fixtures/routing/), [CLI tests](../../../.agents/skills/ruach-herdr/tests/worker.test.ts), and this new report. The worker option parser change accepts dotted route IDs; external schema knowledge remains isolated in routing.ts. Fixtures copy the committed structure with invented model identities, without putting repository preferences or model defaults in code.

The resolver reads `.agents/models.yaml`, `.agents/routing.yaml` and `.agents/roles.yaml`; maps `harness`/`native_model` through route model references; enforces explicit high effort, the five canonical roles and their files, allowed preferences/alternatives, and Claude-only coordinator routed choices. Complete catalogs are validated before native preparation or mutation. Unknown/missing fields, unsupported harness/effort, missing references, invalid alternatives, empty catalogs, malformed YAML, duplicate/nonstring keys and aliases fail clearly. Direct mode retains its existing independent adapter behavior. Provisional integration status was removed from the skill; this report supersedes only the earlier report's routing assumptions.

## Verification

Bun 1.4.2. Exact top-level commands executed from this worktree (source install uses the skill as cwd):

```sh
/home/metatron/.bun/bin/bun install --frozen-lockfile
/home/metatron/.bun/bin/bun test --cwd .agents/skills/ruach-herdr > .agents/scratch/herdr-routing-delivery-tests.log 2>&1
python3 .agents/scratch/verify-herdr-portable.py > .agents/scratch/herdr-routing-delivery-portable.jsonl
python3 .agents/scratch/verify-herdr-routing-live.py > .agents/scratch/herdr-routing-delivery-live.jsonl
python3 .agents/scratch/verify-herdr-routing-portability.py
python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/ruach-herdr
git diff --check 62d7ac7..HEAD
git diff --stat 62d7ac7..HEAD
git diff --stat 3340659..HEAD
/home/metatron/.bun/bin/bun /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills/.agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/versioned-agent-skills/implementer-herdr-routing.md --repo /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-herdr
```

- Source frozen install exited 0: checked two installs across three packages, no changes. An initial sandboxed install failed linking yaml with EEXIST; the authorized scoped rerun succeeded. No manifest or lockfile changes were necessary.
- Source suite: **67 passed, 0 failed**, 358 assertions, 65.69s. Includes updated dotted-route preferred/alternative selection for all canonical roles; required high effort and supported routed harnesses; complete graph, role-set, coordinator and invalid-input boundaries; native configuration preservation, visibility, redaction, mutation/uncertain-state behavior and the real startup timeout. The whole-graph regression preserves every valid preference and adds a broken unused route, asserting missing-model failure.
- Portable helper copied only the skill directory, excluding node_modules, into `/tmp/ruach-herdr-copy-aakcutny/copied skill`. There it ran `/home/metatron/.bun/bin/bun install --frozen-lockfile`, `/home/metatron/.bun/bin/bun scripts/worker.ts --help`, and `/home/metatron/.bun/bin/bun test`. All exited 0; copied suite: **67 passed, 0 failed**, 358 assertions, 67.00s. Its temporary directory was removed.
- Portability scan inspected all 24 committed skill files: no repository-specific paths/names, `/tmp/brainlab` paths, cross-skill imports, or real native model literals in scripts/SKILL.md. Format validator printed **Skill is valid!** (format evidence only). Whitespace check exited 0. Handoff validator exited 0 with `ok: true`, no diagnostics and all supplied revisions resolved.

### Exact dependency inspection and read-only checks

Only Git objects at `97752643b31cdcf8c8ec9f09204382c6766b1573` were used to inspect the dependency, including `git ls-tree -r --name-only REV` and `git show REV:PATH` for `.agents/models.yaml`, `.agents/routing.yaml`, `.agents/roles.yaml`, `.agents/README.md`, `bin/agent-routing`, `scripts/agent-routing.py`, `docs/exploitation/agent-routing.md`, and `justfile`. No main-checkout working file was read or edited. The explicitly authorized integration validator was executed read-only.

The live helper ran:

```sh
git worktree add --detach "/tmp/ruach-herdr-routing-p3qk7n1q/checkout with spaces" 97752643b31cdcf8c8ec9f09204382c6766b1573
git -C "/tmp/ruach-herdr-routing-p3qk7n1q/checkout with spaces" rev-parse HEAD
git -C "/tmp/ruach-herdr-routing-p3qk7n1q/checkout with spaces" status --porcelain
```

For each role `coordinator`, `implementer`, `reviewer`, with `W=/opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-herdr` and `D=/tmp/ruach-herdr-routing-p3qk7n1q/checkout with spaces`, it invoked these argv arrays (Bun was added to PATH):

```sh
/home/metatron/.bun/bin/bun "$W/.agents/skills/ruach-herdr/scripts/worker.ts" resolve --name "verify-$role" --role "$role" --cwd "$D" --repo "$D"
/home/metatron/.bun/bin/bun "$W/.agents/skills/ruach-herdr/scripts/worker.ts" start --name "verify-$role" --role "$role" --cwd "$D" --repo "$D" --dry-run
```

All six exited 0 with `launchable: true`, empty diagnostics and `submission_state: not-submitted`. Effective selections were identical between each role's resolve and dry-run:

| Role | Route | Kind | Native model from committed YAML | Effort | Native version |
| --- | --- | --- | --- | --- | --- |
| coordinator | claude-opus-5.5-high | claude | claude-opus-5-5 | high | 2.1.289 |
| implementer | gpt-6.1-sol-high | codex | gpt-6.1-sol | high | 0.160.0 |
| reviewer | gpt-6.1-sol-high | codex | gpt-6.1-sol | high | 0.160.0 |

Afterward `git -C "$D" status --porcelain` was still empty; `git worktree remove "$D"` exited 0 and the OS-temp parent was removed. These calls prepared argv using installed CLIs and read-only Herdr/config discovery; they did not create panes, launch material or sessions.

## Integration discoveries and remaining limits

[The routing reference](../../../.agents/skills/ruach-herdr/references/routing.md#root-command-delegation-seam) gives precise argument mappings for the committed `just agent-routing` / `bin/agent-routing` / `scripts/agent-routing.py` entrypoint: positional role/name become `--role`/`--name`, root becomes absolute `--repo` and `--cwd`, and allowed `--route` is forwarded unchanged. The existing default resolve name is preserved by a wrapper. Existing `--pane` has no worker equivalent and must be addressed explicitly at integration. No root command or shared catalogs were edited.

Both launchers append canonical roles and resolve the same high-effort profiles. Relevant differences:

- Root Codex composes only user TOML; worker preserves effective layered instructions/skills through an existing matching-version daemon, and passes cwd explicitly. Normal worker resolve also needs Herdr, the native executable and caller pane context, whereas root resolve does not; offline worker resolve cannot supply the old native argv response.
- Root filters only the repository's feature workflow and exposes three fixed technical skills through Claude adapters. Worker filters every discovered workflow name/path and rejects unfilterable sources, scans canonical technical skills and uses private temporary settings. Coordinator visibility remains subject to existing native settings.
- Root sets Claude auto permission and Codex automatic approvals; worker inherits permissions unless explicit supported native flags are supplied. Its bounded pass-through rejects the root's `--approve-for-me` spelling, so a wrapper needs a deliberate supported-policy mapping.
- Worker JSON and failure categories differ; existing-pane support, permissions and response compatibility need an integration decision. Worker checks native capabilities, unique live names and split environment before mutation, then reports uncertain failures without retry.
- YAML aliases and multiline strings remain rejected by worker as documented stricter input boundaries. Model availability and entitlement are not inferred from valid catalogs or prepared argv.

No remaining blocker to this bounded adaptation. Root delegation implementation, independent acceptance/review, global installations, enabling the five gated adapters and actual paid startup/native injected-role or filtered-catalog acceptance were **not run** and are outside this assignment. No merge or push occurred. The temporary detached worktree was the assignment's expressly allowed exception to the common worktree rule.

## Scope evidence

At final implementation HEAD `1151b4803f30950223cadb7c46ec14c85c2fc9d1`, `git diff --stat 3340659..HEAD` showed eight owned skill files only. `git diff --stat 62d7ac7..HEAD` showed the skill plus the prior assigned report:

```text
.agents/skills/ruach-herdr/SKILL.md                |  40 ++++++
 .agents/skills/ruach-herdr/bun.lock                |  18 +++
 .agents/skills/ruach-herdr/package.json            |  13 ++
 .agents/skills/ruach-herdr/references/adapters.md  |  27 ++++
 .agents/skills/ruach-herdr/references/routing.md   |  60 ++++++++
 .agents/skills/ruach-herdr/scripts/adapters/agy.ts |   6 +
 .../skills/ruach-herdr/scripts/adapters/claude.ts  |  75 ++++++++++
 .../skills/ruach-herdr/scripts/adapters/codex.ts   |  55 +++++++
 .agents/skills/ruach-herdr/scripts/adapters/dsh.ts |   6 +
 .../skills/ruach-herdr/scripts/adapters/index.ts   |  47 ++++++
 .agents/skills/ruach-herdr/scripts/adapters/omp.ts |   6 +
 .../ruach-herdr/scripts/adapters/opencode.ts       |   6 +
 .agents/skills/ruach-herdr/scripts/adapters/pi.ts  |   6 +
 .agents/skills/ruach-herdr/scripts/contracts.ts    |  39 +++++
 .agents/skills/ruach-herdr/scripts/native-codex.ts |  38 +++++
 .agents/skills/ruach-herdr/scripts/process.ts      |  31 ++++
 .agents/skills/ruach-herdr/scripts/routing.ts      |  54 +++++++
 .agents/skills/ruach-herdr/scripts/skills.ts       |  62 ++++++++
 .agents/skills/ruach-herdr/scripts/worker.ts       | 111 ++++++++++++++
 .../skills/ruach-herdr/tests/fixtures/fake-cli.ts  |  43 ++++++
 .../ruach-herdr/tests/fixtures/routing/models.yaml |   7 +
 .../ruach-herdr/tests/fixtures/routing/roles.yaml  |  15 ++
 .../tests/fixtures/routing/routing.yaml            |  10 ++
 .agents/skills/ruach-herdr/tests/worker.test.ts    | 159 +++++++++++++++++++++
 .../versioned-agent-skills/implementer-herdr.md    | 126 ++++++++++++++++
 25 files changed, 1060 insertions(+)
```

This separate report commit adds only `docs/mailbox/versioned-agent-skills/implementer-herdr-routing.md`. All scope paths remain assigned; the earlier report is byte-identical to the adaptation baseline.
