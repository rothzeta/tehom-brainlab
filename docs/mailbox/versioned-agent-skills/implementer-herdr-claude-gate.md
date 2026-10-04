task: versioned-agent-skills / skills-impl-herdr-claude-gate
status: complete
outcome: Identified account-synced skill-cache and linked-worktree fallback gates; retained fail-closed behavior because selective non-mutating isolation was not verified, and made source diagnostics and explicit remedies actionable.
artifacts:
- .agents/skills/ruach-herdr/
- docs/mailbox/versioned-agent-skills/implementer-herdr-claude-gate.md
- versioned-agent-skills-herdr
- 8340a9d5daef0a9935a7bee328952360aa904466
verification:
- "Source suite: 81 passed, 0 failed, 485 assertions."
- "Committed standalone copy: frozen install, CLI help and 81 tests passed."
- "All five role-alone resolve/dry-run checks ran: eight prepared results and two expected Architect exit-3 gates. Explicit allowed Architect Codex alternative resolved; offline selection remained nonlaunchable."
- "Temporary HOME check exposed the separate linked-worktree fallback gate; all detached checkouts stayed clean and were removed."
- "Frozen source install, quick validator, portability/policy and scope/whitespace checks passed."
- "Handoff schema and supplied existing revisions validated successfully with the combined-branch validator."
discoveries:
- "The current account-synced cache contains 13 skills and no ruach-workflow-prefixed name; its changing native account inventory cannot be established by a cache snapshot."
- "No local managed source or personal legacy-command directory/plugin registry was present among inspected locations; no enabled plugins were declared in inspected user/current-project settings."
- "No verified selective non-mutating per-launch mechanism preserving other skills and normal configuration was established from installed help and primary docs."
- "Removing the personal-cache condition alone would still leave this detached checkout's linked-worktree fallback gate."
blockers:
- "Preferred Claude Architect preparation remains unavailable in this environment; the declared Codex alternative resolves when explicitly selected. No blocker remains to the bounded diagnostic/investigation assignment."
candidate_revision: 8340a9d5daef0a9935a7bee328952360aa904466
tested_revision: 8340a9d5daef0a9935a7bee328952360aa904466
delivered_revision: 8340a9d5daef0a9935a7bee328952360aa904466
source_baseline: 62d7ac705b04d4e039112228775f6052a6f8da64
investigation_baseline: 386a856ba66bca5d882ad2842a02d0ed454236f4
schema_revision: 97752643b31cdcf8c8ec9f09204382c6766b1573

Author: Implementer (skills-impl-herdr). Date: 2026-10-04 UTC.

## Delivery

Implementation commit `8340a9d5daef0a9935a7bee328952360aa904466` changes four owned skill files: [Claude adapter](../../../.agents/skills/ruach-herdr/scripts/adapters/claude.ts), [SKILL.md](../../../.agents/skills/ruach-herdr/SKILL.md), [adapter evidence](../../../.agents/skills/ruach-herdr/references/adapters.md#claude-worker-customization-gates), and [CLI tests](../../../.agents/skills/ruach-herdr/tests/worker.test.ts). The separate new report commit SHA is supplied in the terminal handoff. Earlier reports remain unchanged.

Kept every existing fail-closed condition. Diagnostics now distinguish managed files/fragments, enterprise skills, account-synced skills, linked-worktree fallback, legacy commands and enabled plugins; path fields identify inspectable local sources without printing private content. Each advises explicitly choosing a declared alternative using another supported harness with `--route ROUTE_ID`, or an independently verified environment. Offline resolution is explicitly selection-only. No suppression flags, sync settings, credential changes, automatic fallback or persistent user configuration changes were added.

Tests exercise empty and non-workflow cache denials, source/remedy fields, user settings/cache preservation, explicit allowed alternative resolution, legacy source diagnostics and private-text redaction. Existing native argv/settings behavior tests and all regressions remain.

## Exact source findings

Read-only inventory command `python3 .agents/scratch/inspect-herdr-claude-sources.py` printed only metadata, key/skill names and booleans into ignored scratch evidence. No full private setting or skill body was printed.

| Inspected source | Exists | Workflow finding |
| --- | --- | --- |
| `/etc/claude-code/managed-settings.json` | no | no local file to inspect |
| `/etc/claude-code/managed-settings.d` | no | no local fragments to inspect |
| `/etc/claude-code/.claude/skills` | no | no local enterprise directory to inspect |
| `/home/metatron/.claude/skills/synced` | yes | 13 skill names; zero `ruach-workflow-*` names |
| `/home/metatron/.claude/commands` | no | no personal legacy command directory |
| `/home/metatron/.claude/plugins/installed_plugins.json` | no | no local installed-plugin registry |
| `/home/metatron/.claude/settings.json` | yes | no workflow overrides or enabled-plugin IDs; inspected keys were autoMode, modelSettings, statusLine, theme |
| This worktree's `.claude/settings.json` and `.claude/settings.local.json` | no | no current-project declarations |

Cached skill names were `built-in-browser, chrome-browser, computer-use, deep-research, docs, docx, google-workspace, import-memory, morning, pdf, pptx, skill-creator, xlsx`. They are metadata only; no account IDs or private bodies are reproduced here. These observations do not claim that remote managed settings/account inventories were fetched or absent.

Baseline role-alone Architect resolve/dry-run at `386a856` reproduced exit 3 `unverified_workflow_source`. The first existing local condition was the account-synced cache, now named directly in the diagnostic. In a separate temporary HOME with no personal cache, the same detached dependency checkout produced `claude.worktree_skill_fallback`, confirming a second condition. Main-checkout working files/catalogs were not inspected, so their workflow content is unverified rather than presumed empty. Temporary HOME and checkout were removed.

## Primary evidence and decision

Installed `claude --version` returned **2.1.289**. `claude --help` verified the candidate settings/source/suppression flags. No session, prompt, doctor command, plugin mutation or account fetch was used.

The [primary skills documentation](https://code.claude.com/docs/en/skills#where-synced-skills-load) documents cached/background account loading; its [visibility reference](https://code.claude.com/docs/en/skills#override-skill-visibility-from-settings) does not establish a future-name wildcard filter and excludes plugin skills. **Inference:** absence of workflow names in today's cache does not establish session-wide exclusion. This is why the gate was not narrowed on the basis of that snapshot.

The [CLI reference](https://code.claude.com/docs/en/cli-reference) documents broad disabling/source switches. They would remove other customization/configuration. The [settings reference](https://code.claude.com/docs/en/settings#exceptions-to-managed-settings-precedence) documents per-launch sync suppression, but the skills page documents cache movement when syncing stops. That does not satisfy this task's preservation/non-mutation constraints. No verified mechanism meeting all constraints was established; the assignment's diagnostic/documentation branch was therefore completed. Detailed option analysis and remedy guidance are in the linked adapter reference above. No flag or wildcard syntax was invented.

## Verification

Bun 1.4.2. Exact commands, from this worktree except the frozen source install used the skill directory as cwd:

```sh
claude --version
claude --help
python3 .agents/scratch/inspect-herdr-claude-sources.py > .agents/scratch/herdr-claude-source-inventory.jsonl
/home/metatron/.bun/bin/bun install --frozen-lockfile
/home/metatron/.bun/bin/bun test --cwd .agents/skills/ruach-herdr > .agents/scratch/herdr-claude-gate-tests.log 2>&1
python3 .agents/scratch/verify-herdr-portable.py > .agents/scratch/herdr-claude-gate-portable.jsonl
python3 .agents/scratch/verify-herdr-claude-gate-live.py > .agents/scratch/herdr-claude-gate-live.jsonl
python3 .agents/scratch/verify-herdr-claude-fallback.py > .agents/scratch/herdr-claude-fallback.jsonl
python3 .agents/scratch/verify-herdr-fix-scan.py
python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/ruach-herdr
git diff --check 62d7ac7..HEAD
git diff --stat 62d7ac7..HEAD
git diff --stat 386a856..HEAD
/home/metatron/.bun/bin/bun /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills/.agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/versioned-agent-skills/implementer-herdr-claude-gate.md --repo /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-herdr
```

- Source frozen install exited 0: two installs across three packages checked, no changes. Full default source suite: **81 pass, 0 fail**, 485 assertions, 64.47s, immediately before committing the exact tested files without intervening edits.
- Standalone committed copy at `/tmp/ruach-herdr-copy-2j55rfbb/copied skill` ran its own `/home/metatron/.bun/bin/bun install --frozen-lockfile`, `/home/metatron/.bun/bin/bun scripts/worker.ts --help`, and `/home/metatron/.bun/bin/bun test`: all exited 0; **81 pass, 0 fail**, 485 assertions, 57.39s. The copy was removed. This directly verifies the existing tested revision.
- Portability/policy scan: 27 skill files, zero repository-specific paths/names, cross-skill imports, native model literals in scripts/SKILL.md or routing-policy literals. Quick validator printed **Skill is valid!** (format evidence only). Scope/whitespace checks passed. Handoff validator exited 0 with `ok: true`, no diagnostics and every supplied revision resolved.

### All-five-role results at the exact dependency revision

The live helper ran `git worktree add --detach "/tmp/ruach-herdr-gate-x9jxp3a1/checkout with spaces" 97752643b31cdcf8c8ec9f09204382c6766b1573`, checked HEAD and starting/ending `git status --porcelain`, then removed it using `git worktree remove`. Both status results were empty; all Git commands exited 0. For each role in coordinator, architect, scout, implementer, reviewer, with `W=/opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-herdr` and `D=/tmp/ruach-herdr-gate-x9jxp3a1/checkout with spaces`, it ran these argv arrays:

```sh
/home/metatron/.bun/bin/bun "$W/.agents/skills/ruach-herdr/scripts/worker.ts" resolve --name "verify-$role" --role "$role" --cwd "$D" --repo "$D"
/home/metatron/.bun/bin/bun "$W/.agents/skills/ruach-herdr/scripts/worker.ts" start --name "verify-$role" --role "$role" --cwd "$D" --repo "$D" --dry-run
```

| Role | Declared route | Kind | Native model | Effort | Resolve/dry-run exits | Outcome |
| --- | --- | --- | --- | --- | --- | --- |
| coordinator | claude-opus-5.5-high | claude | claude-opus-5-5 | high | 0/0 | prepared |
| architect | claude-opus-5.5-high | claude | claude-opus-5-5 | high | 3/3 | account-synced gate |
| scout | gpt-6.1-sol-high | codex | gpt-6.1-sol | high | 0/0 | prepared |
| implementer | gpt-6.1-sol-high | codex | gpt-6.1-sol | high | 0/0 | prepared |
| reviewer | gpt-6.1-sol-high | codex | gpt-6.1-sol | high | 0/0 | prepared |

Prepared results had empty diagnostics and `launchable: true`; Architect had `launchable: false` and the account-synced-source diagnostic. Every invocation reported `submission_state: not-submitted`. Architect's declared selection in the table was independently read with this selection-only call:

```sh
bun "$W/.agents/skills/ruach-herdr/scripts/worker.ts" resolve --offline --name verify-architect --role architect --cwd "$D" --repo "$D"
bun "$W/.agents/skills/ruach-herdr/scripts/worker.ts" resolve --name verify-architect-alt --role architect --cwd "$D" --repo "$D" --route gpt-6.1-sol-high
```

Both exited 0; offline remained nonlaunchable, while the explicit allowed alternative prepared Codex/high with native model `gpt-6.1-sol`. No startup was submitted. The fallback helper created a second detached checkout at the same revision and temporary HOME, then ran Architect resolve with that HOME/CLAUDE_CONFIG_DIR; it intentionally exited 3 for linked-worktree fallback, stayed clean and removed both temporary paths. No real user/managed setting was modified.

## Remaining limit and scope

Preferred Claude worker preparation remains unavailable in this environment; no paid-session/native filtered-catalog, entitlement or remote inventory acceptance was run. A clear diagnostic is the completed bounded outcome, not a claim to have enabled Architect's preferred route. Root launch changes, global installation, policy edits, automatic alternatives, merges and pushes were not performed. Independent acceptance/review is not inferred.

`git diff --stat 386a856..HEAD` at implementation HEAD showed exactly four owned skill files. Earlier reports are unchanged. Required full-baseline `git diff --stat 62d7ac7..HEAD`:

```text
.agents/skills/ruach-herdr/SKILL.md                |  50 +++++
 .agents/skills/ruach-herdr/bun.lock                |  18 ++
 .agents/skills/ruach-herdr/package.json            |  13 ++
 .agents/skills/ruach-herdr/references/adapters.md  |  39 ++++
 .agents/skills/ruach-herdr/references/routing.md   |  53 +++++
 .agents/skills/ruach-herdr/scripts/adapters/agy.ts |   6 +
 .../skills/ruach-herdr/scripts/adapters/claude.ts  |  92 +++++++++
 .../skills/ruach-herdr/scripts/adapters/codex.ts   |  58 ++++++
 .agents/skills/ruach-herdr/scripts/adapters/dsh.ts |   6 +
 .../skills/ruach-herdr/scripts/adapters/index.ts   |  57 ++++++
 .agents/skills/ruach-herdr/scripts/adapters/omp.ts |   6 +
 .../ruach-herdr/scripts/adapters/opencode.ts       |   6 +
 .agents/skills/ruach-herdr/scripts/adapters/pi.ts  |   6 +
 .agents/skills/ruach-herdr/scripts/contracts.ts    |  39 ++++
 .agents/skills/ruach-herdr/scripts/native-codex.ts |  38 ++++
 .agents/skills/ruach-herdr/scripts/process.ts      |  31 +++
 .agents/skills/ruach-herdr/scripts/routing.ts      |  53 +++++
 .agents/skills/ruach-herdr/scripts/skills.ts       |  62 ++++++
 .agents/skills/ruach-herdr/scripts/worker.ts       | 111 ++++++++++
 .../skills/ruach-herdr/tests/fixtures/fake-cli.ts  |  43 ++++
 .../tests/fixtures/portable-routing/models.yaml    |   7 +
 .../tests/fixtures/portable-routing/roles.yaml     |   8 +
 .../tests/fixtures/portable-routing/routing.yaml   |   7 +
 .../ruach-herdr/tests/fixtures/routing/models.yaml |   7 +
 .../ruach-herdr/tests/fixtures/routing/roles.yaml  |  15 ++
 .../tests/fixtures/routing/routing.yaml            |  10 +
 .agents/skills/ruach-herdr/tests/worker.test.ts    | 223 +++++++++++++++++++++
 .../implementer-herdr-fix.md                       | 133 ++++++++++++
 .../implementer-herdr-routing.md                   | 136 +++++++++++++
 .../versioned-agent-skills/implementer-herdr.md    | 126 ++++++++++++
 30 files changed, 1459 insertions(+)
```

The separate report commit adds only `docs/mailbox/versioned-agent-skills/implementer-herdr-claude-gate.md`; its existing SHA is returned after commit.
