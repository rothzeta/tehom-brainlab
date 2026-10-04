task: versioned-agent-skills / skills-impl-integration
status: complete
outcome: Integrated the three specified source branches locally, updated canonical documentation, and passed combined verification without changing skills or tests.
artifacts:
  - docs/mailbox/versioned-agent-skills/implementer-integration.md
  - versioned-agent-skills-20261004
  - .agents/skills/ruach-handoff/
  - .agents/skills/ruach-harness-eval/
  - .agents/skills/ruach-herdr/
  - .agents/agents/coordinator.md
  - .agents/skills/ruach-workflow-feature/SKILL.md
  - .agents/README.md
  - docs/SCHEMA.md
verification:
  - 'Frozen installs exited 0 in all three skill directories; Bun 1.4.2.'
  - 'Combined suites: handoff 24 passed, evaluator 49 passed, Herdr 50 passed; 0 failed in completed runs.'
  - 'All six discovered ruach-* SKILL.md files passed skill-creator quick validation; format evidence only.'
  - 'All five task reports, including this report, passed handoff validation with all supplied revisions resolved.'
  - 'Scope check passed: clean worktree, 47 changed paths, no unexpected paths or diagnostics.'
  - 'Installed Claude/Codex routed resolve and dry-run: four exits 0, launchable true, no submission.'
  - 'Portability/model/native-flag scans had no matches; whitespace diff check passed.'
discoveries:
  - 'Assignment says five skills; six SKILL.md files exist, so all six were format-validated.'
  - 'Routed checks use the documented provisional fixture schema; canonical repository-schema integration remains future work.'
  - 'Codex requires an already-running matching local daemon; observed CLI/server version 0.160.0.'
blockers: []
candidate_revision: 4e8d7d30fb57a033b5c4378aeec2fae7aaf209bd
tested_revision: 4e8d7d30fb57a033b5c4378aeec2fae7aaf209bd
delivered_revision: 4e8d7d30fb57a033b5c4378aeec2fae7aaf209bd
source_baseline: 62d7ac705b04d4e039112228775f6052a6f8da64
handoff_source_revision: b12aa88be63a5ea0aa4dbbb1e9953661ce4cd947
eval_source_revision: 397f22a96140ddbd329e2b5c6d565be0a3bd6b68
herdr_source_revision: 33406598c18b8481fe843582c9e582b97e1f3d53

Author: Implementer (integration owner). Date: 2026-10-04 UTC.

## Integration and changed files

Destination is local branch `versioned-agent-skills-20261004`, initially `62d7ac7`. Executed these commands in the assigned worktree, in order:

```sh
git merge --no-edit versioned-agent-skills-handoff
git merge --no-edit versioned-agent-skills-eval
git merge --no-edit versioned-agent-skills-herdr
```

The first fast-forwarded to `b12aa88`; the next two produced merge commits `6a59bfb` and `c2264aa`. No conflicts or resolutions. Source implementation revisions are `0dfb52f` (handoff), `1509d8f` (evaluator), and `a47d8d6` (Herdr); the source branches also carry their separate worker reports, preserved unchanged.

Documentation commit `4e8d7d3` is the combined tested revision. Its four owned changes are [coordinator](../../../.agents/agents/coordinator.md) launch selection through ruach-herdr and YAML, [feature workflow](../../../.agents/skills/ruach-workflow-feature/SKILL.md) launch/worker-validation pointers with sequencing preserved, [agent README](../../../.agents/README.md) skill/validator listings and accurate preparation coverage, and [SCHEMA](../../SCHEMA.md) leading-block, revision, and historical-format semantics. Other role files already reference ruach-handoff; SCHEMA and the workflow now explicitly require responsible-worker report validation, so no role-file edits were needed. No skill implementation, tests, routing YAML, root launcher, prototypes, CURRENT, TASK_LOGS, justfile, bin, or scripts changes were made by integration. No master merge, push, global install, or main-checkout worktree edits. Git used the shared metadata required for commits on this assigned worktree branch.

This report is an evidence-only successor; its creating SHA is returned in the terminal handoff, not predicted here. No independent review or live-session acceptance is claimed.

## Combined verification

All completed checks used combined revision `4e8d7d30fb57a033b5c4378aeec2fae7aaf209bd`, with unchanged tracked content. No tests were changed. Exact executable is `/home/metatron/.bun/bin/bun` (1.4.2); the test and installed-CLI environment added `/home/metatron/.bun/bin` to PATH.

For each skill directory `.agents/skills/ruach-handoff`, `.agents/skills/ruach-harness-eval`, `.agents/skills/ruach-herdr`, executed with that directory as cwd:

```sh
/home/metatron/.bun/bin/bun install --frozen-lockfile
PATH=/home/metatron/.bun/bin:$PATH /home/metatron/.bun/bin/bun test
```

| Skill | Install | Completed suite | Assertions | Elapsed |
| --- | --- | --- | --- | --- |
| ruach-handoff | exit 0; 6 packages | 24 pass, 0 fail | 216 | 14.06s |
| ruach-harness-eval | exit 0; dependency-free | 49 pass, 0 fail | 436 | 9.29s |
| ruach-herdr | exit 0; 2 packages | 50 pass, 0 fail | 266 | 56.67s |

The default sandbox denied the Herdr tests' temporary Unix socket (`EPERM`), causing setup-hook timeouts; that incomplete run was interrupted (exit 130). The unchanged suite was rerun with approved access and passed, including the actual 35-second uncertain-start timeout. Documentation writes, skill-local dependency installs and worktree Git commits also required sandbox escalation. A default-sandbox native daemon probe could not connect to its socket; the approved read-only probe and preparation checks below succeeded. These are environment restrictions, not hidden passing test results.

Executed quick validator child command for every discovered skill:

```sh
python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py SKILL_DIRECTORY
```

Directories: `ruach-handoff`, `ruach-harness-eval`, `ruach-herdr`, `ruach-simplification`, `ruach-testing`, `ruach-workflow-feature`, each under `.agents/skills/`. All six exited 0, `Skill is valid!`; this checks format, not behavioral quality. Running six instead of the stated five covers the entire observed corpus without changing scope.

Executed the following child command for each pre-existing task report (`architect.md`, `implementer-eval.md`, `implementer-handoff.md`, `implementer-herdr.md`):

```sh
/home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts REPORT_PATH
```

All four exited 0 with `ok: true`, empty diagnostics, and resolvable supplied revisions. Own-report/corpus validation is recorded below after writing the report. Mechanical validity does not certify truth or acceptance.

## Scope and portability evidence

Executed:

```sh
/home/metatron/.bun/bin/bun .agents/skills/ruach-harness-eval/scripts/scope-check.ts --repo . --baseline 62d7ac7 --candidate 4e8d7d30fb57a033b5c4378aeec2fae7aaf209bd --allow .agents/scratch/versioned-agent-skills/integration-evidence/allow.json
git diff --check 62d7ac7..HEAD
git diff --stat 62d7ac7..HEAD
```

Scope result: exit 0, `ok: true`, `clean: true`, branch `versioned-agent-skills-20261004`, HEAD/candidate `4e8d7d30fb57a033b5c4378aeec2fae7aaf209bd`, 47 changed/assessed paths, and empty dirty/unexpected/protected/diagnostic arrays. `require_clean` is true. Allow JSON has `schema_version: 1`; exact `paths` are coordinator/scout/architect/implementer/reviewer role files, the feature SKILL.md, agent README, and SCHEMA. Prefixes are the three integrated skill directories and `docs/mailbox/versioned-agent-skills/`; directory prefixes end in `/`, not glob `**`. Whitespace diff check exited 0. Scope stat at the combined revision:

```text
 .agents/README.md                                  |   6 +-
 .agents/agents/coordinator.md                      |   4 +-
 .agents/skills/ruach-handoff/SKILL.md              |  86 ++++++
 .agents/skills/ruach-handoff/bun.lock              |  26 ++
 .agents/skills/ruach-handoff/handoff.schema.json   |  42 +++
 .agents/skills/ruach-handoff/package.json          |   8 +
 .agents/skills/ruach-handoff/scripts/validate.ts   | 122 ++++++++
 .../skills/ruach-handoff/tests/validate.test.ts    | 220 +++++++++++++++
 .agents/skills/ruach-harness-eval/SKILL.md         |  21 ++
 .../skills/ruach-harness-eval/agents/openai.yaml   |   2 +
 .agents/skills/ruach-harness-eval/package.json     |   6 +
 .../skills/ruach-harness-eval/references/config.md |  84 ++++++
 .../ruach-harness-eval/scripts/acceptance.ts       | 209 ++++++++++++++
 .../skills/ruach-harness-eval/scripts/common.ts    | 129 +++++++++
 .../ruach-harness-eval/scripts/scope-check.ts      | 102 +++++++
 .../skills/ruach-harness-eval/tests/eval.test.ts   | 306 +++++++++++++++++++++
 .../tests/fixtures/assignment.md                   |   2 +
 .../ruach-harness-eval/tests/fixtures/task.ts      |   6 +
 .agents/skills/ruach-herdr/SKILL.md                |  40 +++
 .agents/skills/ruach-herdr/bun.lock                |  18 ++
 .agents/skills/ruach-herdr/package.json            |  13 +
 .agents/skills/ruach-herdr/references/adapters.md  |  27 ++
 .agents/skills/ruach-herdr/references/routing.md   |  49 ++++
 .agents/skills/ruach-herdr/scripts/adapters/agy.ts |   6 +
 .../skills/ruach-herdr/scripts/adapters/claude.ts  |  75 +++++
 .../skills/ruach-herdr/scripts/adapters/codex.ts   |  55 ++++
 .agents/skills/ruach-herdr/scripts/adapters/dsh.ts |   6 +
 .../skills/ruach-herdr/scripts/adapters/index.ts   |  47 ++++
 .agents/skills/ruach-herdr/scripts/adapters/omp.ts |   6 +
 .../ruach-herdr/scripts/adapters/opencode.ts       |   6 +
 .agents/skills/ruach-herdr/scripts/adapters/pi.ts  |   6 +
 .agents/skills/ruach-herdr/scripts/contracts.ts    |  39 +++
 .agents/skills/ruach-herdr/scripts/native-codex.ts |  38 +++
 .agents/skills/ruach-herdr/scripts/process.ts      |  31 +++
 .agents/skills/ruach-herdr/scripts/routing.ts      |  46 ++++
 .agents/skills/ruach-herdr/scripts/skills.ts       |  62 +++++
 .agents/skills/ruach-herdr/scripts/worker.ts       | 111 ++++++++
 .../skills/ruach-herdr/tests/fixtures/fake-cli.ts  |  43 +++
 .../ruach-herdr/tests/fixtures/routing/models.yaml |   9 +
 .../ruach-herdr/tests/fixtures/routing/roles.yaml  |   5 +
 .../tests/fixtures/routing/routing.yaml            |   7 +
 .agents/skills/ruach-herdr/tests/worker.test.ts    | 138 ++++++++++
 .agents/skills/ruach-workflow-feature/SKILL.md     |   2 +-
 docs/SCHEMA.md                                     |   2 +
 .../versioned-agent-skills/implementer-eval.md     |  79 ++++++
 .../versioned-agent-skills/implementer-handoff.md  | 105 +++++++
 .../versioned-agent-skills/implementer-herdr.md    | 126 +++++++++
 47 files changed, 2573 insertions(+), 5 deletions(-)
```

Executed portability scan over the entire three skill directories (rg respects ignored node_modules), with pattern `/tmp/brainlab|/opt/dev|/home/metatron|tehom|brainlab`; no matches, rg exit 1. Executed model scan over each integrated SKILL.md and scripts directory with pattern `gpt-[0-9]|claude-(opus|sonnet|haiku)|o[1-9](-|\b)|gemini-[0-9]|deepseek-|qwen[0-9]`; no matches, exit 1. The only actual model identifiers are in fixture routing data. Also inspected canonical launch instructions: no embedded model defaults, model names or native harness flags.

Exact scan command forms (model scan lists all three SKILL.md/scripts pairs; braces below abbreviate those argv entries):

```sh
rg -n -i '/tmp/brainlab|/opt/dev|/home/metatron|tehom|brainlab' .agents/skills/ruach-handoff .agents/skills/ruach-harness-eval .agents/skills/ruach-herdr
rg -n -i 'gpt-[0-9]|claude-(opus|sonnet|haiku)|o[1-9](-|\b)|gemini-[0-9]|deepseek-|qwen[0-9]' .agents/skills/ruach-{handoff,harness-eval,herdr}/SKILL.md .agents/skills/ruach-{handoff,harness-eval,herdr}/scripts
rg -n -i 'gpt-[0-9]|claude-(opus|sonnet|haiku)|gemini-[0-9]|deepseek-|qwen[0-9]|--[a-z][a-z-]*|model_reasoning_effort' .agents/agents/coordinator.md .agents/skills/ruach-workflow-feature/SKILL.md
```

All scans exited 1 (no matches), with empty stderr. Scan patterns alone are not proof against every possible future model identifier.

## Installed-CLI preparation and limits

Executed `python3 .agents/scratch/versioned-agent-skills/integration-evidence/verify.py` with approved socket access. It copied only this skill's three fixture routing YAML files and the combined canonical coordinator/implementer role files into `.agents/scratch/versioned-agent-skills/integration-evidence/routing-fixture`; no root routing data was created or edited. The following are its exact worker argv forms, with `W` the absolute assigned worktree `/opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills` and `F` equal to `W/.agents/scratch/versioned-agent-skills/integration-evidence/routing-fixture` (variables abbreviate literal paths supplied as argv):

```sh
bun "$W/.agents/skills/ruach-herdr/scripts/worker.ts" resolve --name integ-coordinator --role coordinator --cwd "$W" --repo "$F"
bun "$W/.agents/skills/ruach-herdr/scripts/worker.ts" start --name integ-coordinator --role coordinator --cwd "$W" --repo "$F" --dry-run
bun "$W/.agents/skills/ruach-herdr/scripts/worker.ts" resolve --name integ-implementer --role implementer --cwd "$W" --repo "$F"
bun "$W/.agents/skills/ruach-herdr/scripts/worker.ts" start --name integ-implementer --role implementer --cwd "$W" --repo "$F" --dry-run
codex app-server daemon version
```

All four worker commands exited 0, `ok: true`, `launchable: true`, `submission_state: not-submitted`, coverage `live-capable`, empty diagnostics and stderr. Coordinator selected fixture route `lead`, Claude 2.1.289, model `claude-opus-4-6`, effort high. Implementer selected `build`, Codex 0.160.0, model `gpt-6.1-sol`, effort high. Daemon probe exited 0 and observed `status: running`, app-server and CLI versions both 0.160.0. No daemon was started by these checks; Codex preparation requires that existing daemon to read effective config/catalog without bootstrap writes. No real agent session or paid turn was started.

Preparation/fake-launch coverage does not establish account entitlement, remote model availability, native injected-role or filtered-skill acceptance, or live session behavior. Other adapters remain gated before mutation as reported by the Herdr worker. Provisional schema compatibility with eventual canonical YAML and live acceptance are outside this integration assignment. No skill defect requiring an out-of-scope fix was found. Required integration checks were executed; no outstanding assigned blocker.

## Own report validation

After writing this report, executed `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/versioned-agent-skills/implementer-integration.md`: exit 0, `ok: true`, seven revision fields resolved, empty diagnostics. Then executed the same validator child command over every `docs/mailbox/versioned-agent-skills/*.md`: all five reports exited 0 with empty diagnostics. Added only this observed evidence and revalidated the final report before its evidence-only commit.
