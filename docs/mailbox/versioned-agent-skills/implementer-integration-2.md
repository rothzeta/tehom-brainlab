task: versioned-agent-skills / skills-impl-integration / round-2
status: complete
outcome: Integrated all four specified branches, refreshed committed-schema documentation, passed combined checks, and completed the informational trial merge with one reported documentation conflict.
artifacts:
  - docs/mailbox/versioned-agent-skills/implementer-integration-2.md
  - versioned-agent-skills-20261004
  - .agents/skills/ruach-handoff/
  - .agents/skills/ruach-harness-eval/
  - .agents/skills/ruach-herdr/
  - .agents/README.md
  - .agents/agents/coordinator.md
verification:
  - 'Frozen installs: all three exited 0 without dependency changes.'
  - 'Default Bun suites: handoff 24 passed, evaluator 59 passed, Herdr 77 passed; 160 total, 0 failed.'
  - 'All six ruach-* skills passed quick format validation; twelve existing task reports passed handoff validation.'
  - 'Scope check: exit 0, clean worktree, 58 allowed changed paths, no unexpected/protected paths or diagnostics.'
  - 'Six role-alone resolve/dry-run preparations against detached committed catalogs passed without submission; matching Codex daemon already running.'
  - 'Portability/model-name/native-flag scans had no matches; whitespace check passed; skill content equals the supplied source revisions.'
  - 'Trial merge: exit 1, sole conflict .agents/README.md; aborted successfully, checkout restored clean and removed, master unchanged.'
review: not-run
discoveries:
  - 'Future main integration must reconcile .agents/README.md versioned-skill coverage with upstream routing documentation.'
  - 'Catalog shape is committed and verified; dependency catalogs and the separate root launcher are not yet present on this integration branch.'
  - 'The root launcher still does not delegate to the skill; compatibility decisions remain documented in the routing reference.'
blockers: []
candidate_revision: 618ee9bb858e7e1e1941f4571facfbb93d0d547b
tested_revision: 618ee9bb858e7e1e1941f4571facfbb93d0d547b
delivered_revision: 618ee9bb858e7e1e1941f4571facfbb93d0d547b
source_baseline: 62d7ac705b04d4e039112228775f6052a6f8da64
integration_start_revision: d8b67cc942bcda6f22f769f75959cbe355e308e6
handoff_source_revision: c3ed7918835bb64ec207efa5d7ff510dd4f9182b
eval_source_revision: c4532dee81710175c0176cda1ade00537a9badc0
herdr_source_revision: 386a856ba66bca5d882ad2842a02d0ed454236f4
forward_source_revision: 5c0890ce783cded3d7a13486834b315f44286842
schema_revision: 97752643b31cdcf8c8ec9f09204382c6766b1573

Author: Implementer (integration owner). Date: 2026-10-04 UTC.

## Integration and documentation

Destination: local `versioned-agent-skills-20261004`, starting at `d8b67cc`. Executed in the assigned worktree, in order:

```sh
git merge --no-edit versioned-agent-skills-handoff
git merge --no-edit versioned-agent-skills-eval
git merge --no-edit versioned-agent-skills-herdr
git merge --no-edit versioned-agent-skills-fwd
```

All exited 0 with no conflicts or resolutions. Merge commits are `da0e5c5`, `3c9b333`, `3b1f957`, and `f41a0cb` respectively. The supplied source tips and their reports were integrated unchanged:

| Source branch suffix | Source tip | Implementation/documentation revisions |
| --- | --- | --- |
| handoff | c3ed791 | aa16a0a (grouped-test timeout budgets), 974bfcb (diagnostic ordering documentation) |
| eval | c4532de | bed6510 (Git environment isolation and permission-controlled fixture tests) |
| herdr | 386a856 | 8dc2c9f/1151b48 (committed catalog adaptation), 2c6a836 (portable policy boundaries, live-context docs and socket prerequisite) |
| fwd | 5c0890c | scout-forward-test.md report only |

Combined docs commit `618ee9b` identifies the tested candidate. Only [agent README](../../../.agents/README.md) and [Coordinator](../../../.agents/agents/coordinator.md) were edited directly: removed obsolete provisional-schema wording, named the three committed `.agents/` catalogs, described the dependency/main-integration boundary, and recorded the matching-daemon and gated-adapter limitations. Coordinator selection remains role/optional route/cwd/name with no native flags or model names; Herdr still provides monitoring/communication. Workflow sequencing and worker report ownership remain unchanged. Existing workflow/SCHEMA validation pointers and role guidance were already sufficient, so they needed no changes.

The first integration report and all other workers' reports remain unchanged. Skills/tests were merged exactly as supplied, not edited by integration. No routing YAML, root launcher, CURRENT, TASK_LOGS, justfile, bin, scripts, prototypes, master, or main-checkout worktree edits; no push, global install or real agent startup. Temporary dependency worktree creation and abort/removal were explicitly assigned. Git writes used only the shared metadata needed for the assigned branch and temporary worktree operations.

This report is committed separately as an evidence-only successor. Its creating SHA is returned in the terminal handoff rather than predicted here. New independent review and live native-session acceptance are not claimed.

## Combined checks

All required checks used existing combined revision `618ee9bb858e7e1e1941f4571facfbb93d0d547b` with unchanged tracked implementation content. Bun is 1.4.2. Each skill had its own cwd; exact commands:

```sh
/home/metatron/.bun/bin/bun install --frozen-lockfile
PATH=/home/metatron/.bun/bin:$PATH /home/metatron/.bun/bin/bun test
```

| Skill cwd under .agents/skills/ | Frozen install | Default bun test | Assertions | Elapsed |
| --- | --- | --- | --- | --- |
| ruach-handoff | exit 0; checked 6 installs, no changes | exit 0; 24 pass, 0 fail | 216 | 15.14s |
| ruach-harness-eval | exit 0; no dependencies | exit 0; 59 pass, 0 fail | 637 | 12.30s |
| ruach-herdr | exit 0; checked 2 installs, no changes | exit 0; 77 pass, 0 fail | 428 | 60.79s |

The three suites ran concurrently using their documented default commands, without timeout overrides or test changes. Coverage includes evaluator Git redirection/output-boundary regressions and fixture mode sensitivity; grouped handoff probes; generic portable role/route selection and native adapter validation; live-context errors; preserved developer/skill configuration; no-mutation/uncertain-start behavior, including the actual 35-second fake-start timeout. Herdr ran with approved Unix socket access from the outset because its explicit test prerequisite requires it. Installs and narrow .agents documentation writes also needed approved access to the read-only sandbox mount. There were no failed or skipped completed checks this round.

Executed this child command for every `.agents/skills/ruach-*/SKILL.md` directory:

```sh
python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py SKILL_DIRECTORY
```

Six exits 0, `Skill is valid!`: handoff, harness-eval, herdr, simplification, testing, workflow-feature. Format evidence only. Executed this validator child command for every existing `docs/mailbox/versioned-agent-skills/*.md`:

```sh
/home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts REPORT_PATH
```

Twelve reports exited 0 with `ok: true`, empty diagnostics and resolvable supplied revisions: Architect, original evaluator plus evaluator-fix, original handoff plus handoff-fix/handoff-doc, original Herdr plus Herdr-routing/Herdr-fix, first integration, Reviewer, and forward Scout. Own-report validation is recorded after writing below. Mechanical report validity does not certify claim truth or review acceptance.

## Scope and portability

Executed:

```sh
/home/metatron/.bun/bin/bun .agents/skills/ruach-harness-eval/scripts/scope-check.ts --repo . --baseline 62d7ac7 --candidate 618ee9bb858e7e1e1941f4571facfbb93d0d547b --allow .agents/scratch/versioned-agent-skills/integration-evidence/allow.json
git diff --check 62d7ac7..HEAD
git diff --stat 62d7ac7..HEAD
git diff --exit-code c3ed791 HEAD -- .agents/skills/ruach-handoff
git diff --exit-code c4532de HEAD -- .agents/skills/ruach-harness-eval
git diff --exit-code 386a856 HEAD -- .agents/skills/ruach-herdr
git diff --exit-code d8b67cc HEAD -- docs/mailbox/versioned-agent-skills/implementer-integration.md
```

All exited 0. Scope uses the existing round-one allowance unchanged: `schema_version: 1`, `require_clean: true`, expected branch `versioned-agent-skills-20261004`; exact allowed paths are coordinator/scout/architect/implementer/reviewer role files, feature SKILL.md, agent README and SCHEMA. Allowed directory prefixes are the three skill dirs and `docs/mailbox/versioned-agent-skills/`, with trailing `/`. Scope result: `ok: true`, `clean: true`, candidate and worktree HEAD `618ee9bb858e7e1e1941f4571facfbb93d0d547b`, 58 changed/assessed paths, empty dirty/unexpected/protected/diagnostic arrays. The source-content comparisons and previous-report comparison prove no integration edits to those artifacts. Full-baseline scope stat:

```text
 .agents/README.md                                  |    6 +-
 .agents/agents/coordinator.md                      |    4 +-
 .agents/skills/ruach-handoff/SKILL.md              |   88 ++
 .agents/skills/ruach-handoff/bun.lock              |   26 +
 .agents/skills/ruach-handoff/handoff.schema.json   |   42 +
 .agents/skills/ruach-handoff/package.json          |    8 +
 .agents/skills/ruach-handoff/scripts/validate.ts   |  122 +++
 .../skills/ruach-handoff/tests/validate.test.ts    |  222 ++++
 .agents/skills/ruach-harness-eval/SKILL.md         |   21 +
 .../skills/ruach-harness-eval/agents/openai.yaml   |    2 +
 .agents/skills/ruach-harness-eval/package.json     |    6 +
 .../skills/ruach-harness-eval/references/config.md |   84 ++
 .../ruach-harness-eval/scripts/acceptance.ts       |  209 ++++
 .../skills/ruach-harness-eval/scripts/common.ts    |  136 +++
 .../ruach-harness-eval/scripts/scope-check.ts      |  102 ++
 .../skills/ruach-harness-eval/tests/eval.test.ts   |  391 +++++++
 .../tests/fixtures/assignment.md                   |    2 +
 .../ruach-harness-eval/tests/fixtures/task.ts      |    6 +
 .agents/skills/ruach-herdr/SKILL.md                |   48 +
 .agents/skills/ruach-herdr/bun.lock                |   18 +
 .agents/skills/ruach-herdr/package.json            |   13 +
 .agents/skills/ruach-herdr/references/adapters.md  |   27 +
 .agents/skills/ruach-herdr/references/routing.md   |   53 +
 .agents/skills/ruach-herdr/scripts/adapters/agy.ts |    6 +
 .../skills/ruach-herdr/scripts/adapters/claude.ts  |   78 ++
 .../skills/ruach-herdr/scripts/adapters/codex.ts   |   58 +
 .agents/skills/ruach-herdr/scripts/adapters/dsh.ts |    6 +
 .../skills/ruach-herdr/scripts/adapters/index.ts   |   57 +
 .agents/skills/ruach-herdr/scripts/adapters/omp.ts |    6 +
 .../ruach-herdr/scripts/adapters/opencode.ts       |    6 +
 .agents/skills/ruach-herdr/scripts/adapters/pi.ts  |    6 +
 .agents/skills/ruach-herdr/scripts/contracts.ts    |   39 +
 .agents/skills/ruach-herdr/scripts/native-codex.ts |   38 +
 .agents/skills/ruach-herdr/scripts/process.ts      |   31 +
 .agents/skills/ruach-herdr/scripts/routing.ts      |   53 +
 .agents/skills/ruach-herdr/scripts/skills.ts       |   62 ++
 .agents/skills/ruach-herdr/scripts/worker.ts       |  111 ++
 .../skills/ruach-herdr/tests/fixtures/fake-cli.ts  |   43 +
 .../tests/fixtures/portable-routing/models.yaml    |    7 +
 .../tests/fixtures/portable-routing/roles.yaml     |    8 +
 .../tests/fixtures/portable-routing/routing.yaml   |    7 +
 .../ruach-herdr/tests/fixtures/routing/models.yaml |    7 +
 .../ruach-herdr/tests/fixtures/routing/roles.yaml  |   15 +
 .../tests/fixtures/routing/routing.yaml            |   10 +
 .agents/skills/ruach-herdr/tests/worker.test.ts    |  200 ++++
 .agents/skills/ruach-workflow-feature/SKILL.md     |    2 +-
 docs/SCHEMA.md                                     |    2 +
 .../versioned-agent-skills/implementer-eval-fix.md |   71 ++
 .../versioned-agent-skills/implementer-eval.md     |   79 ++
 .../implementer-handoff-doc.md                     |   37 +
 .../implementer-handoff-fix.md                     |   73 ++
 .../versioned-agent-skills/implementer-handoff.md  |  105 ++
 .../implementer-herdr-fix.md                       |  133 +++
 .../implementer-herdr-routing.md                   |  136 +++
 .../versioned-agent-skills/implementer-herdr.md    |  126 +++
 .../implementer-integration.md                     |  181 ++++
 docs/mailbox/versioned-agent-skills/reviewer.md    |   89 ++
 .../versioned-agent-skills/scout-forward-test.md   | 1140 ++++++++++++++++++++
 58 files changed, 4659 insertions(+), 5 deletions(-)
```

Executed scans below (the model scan's braces abbreviate the individually supplied SKILL.md/scripts argv pairs):

```sh
rg -n -i '/tmp/brainlab|/opt/dev|/home/metatron|tehom|brainlab' .agents/skills/ruach-handoff .agents/skills/ruach-harness-eval .agents/skills/ruach-herdr
rg -n -i 'gpt-[0-9]|claude-(opus|sonnet|haiku)|o[1-9](-|\b)|gemini-[0-9]|deepseek-|qwen[0-9]' .agents/skills/ruach-{handoff,harness-eval,herdr}/SKILL.md .agents/skills/ruach-{handoff,harness-eval,herdr}/scripts
rg -n -i 'gpt-[0-9]|claude-(opus|sonnet|haiku)|gemini-[0-9]|deepseek-|qwen[0-9]|--[a-z][a-z-]*|model_reasoning_effort' .agents/agents/coordinator.md .agents/skills/ruach-workflow-feature/SKILL.md
```

Each exited 1 with zero matches and empty stderr. Entire skill scans respected ignored node_modules; runtime/SKILL.md contain no detected real model identifiers. Coordinator and feature workflow contain no native flags or model names. Pattern scans are bounded evidence, not exhaustive certification against future identifiers.

## Committed-catalog preparation

Executed `python3 .agents/scratch/versioned-agent-skills/integration-2-evidence/detached-checks.py` with approved local socket/Git metadata access. It created a detached OS-temp worktree at dependency `97752643`, used the combined worker script against its unmodified canonical catalogs/roles, then performed the informational trial merge and cleaned up. Exact child command forms, where `W=/opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills` and `D=/tmp/ruach-integration-2-ecn4d3d5/checkout with spaces` abbreviate literal argv paths:

```sh
git worktree add --detach "$D" 97752643b31cdcf8c8ec9f09204382c6766b1573
git -C "$D" rev-parse HEAD
git -C "$D" status --porcelain
```

Add and inspections exited 0; HEAD matched the exact dependency and status was empty. For each role `coordinator`, `implementer`, and `reviewer`, child commands were:

```sh
bun "$W/.agents/skills/ruach-herdr/scripts/worker.ts" resolve --name "integ2-$role" --role "$role" --cwd "$D" --repo "$D"
bun "$W/.agents/skills/ruach-herdr/scripts/worker.ts" start --name "integ2-$role" --role "$role" --cwd "$D" --repo "$D" --dry-run
codex app-server daemon version
git -C "$D" status --porcelain
```

The first two ran once per role; daemon/status ran once after all six preparations. All six worker invocations exited 0, `launchable: true`, `submission_state: not-submitted`, coverage `live-capable`, empty diagnostics/stderr. No explicit route/model/effort was passed; all selection came from committed catalogs:

| Role | Preferred route | Harness/native version | Native model | Effort |
| --- | --- | --- | --- | --- |
| coordinator | claude-opus-5.5-high | Claude 2.1.289 | claude-opus-5-5 | high |
| implementer | gpt-6.1-sol-high | Codex 0.160.0 | gpt-6.1-sol | high |
| reviewer | gpt-6.1-sol-high | Codex 0.160.0 | gpt-6.1-sol | high |

Daemon probe exited 0, `status: running`, CLI/server both 0.160.0. No daemon bootstrap. Status remained empty after preparation. No pane/session/paid turn was created. These are read-only preparation results; native instruction/skill consumption, account entitlement and remote model availability remain unverified. Pi/OpenCode/DSH/OMP/Agy remain gated before mutation.

## Informational trial merge

In that same clean detached dependency worktree, executed:

```sh
git -C "$D" merge --no-commit --no-ff 618ee9bb858e7e1e1941f4571facfbb93d0d547b
git -C "$D" diff --name-only --diff-filter=U
git -C "$D" status --porcelain
git -C "$D" merge --abort
git -C "$D" rev-parse HEAD
git -C "$D" status --porcelain
git worktree remove "$D"
git rev-parse refs/heads/master
```

Trial merge exited **1**, with one content conflict: `.agents/README.md`. The conflict probe exited 0 and returned only that file; status marked it `UU`. Other combined changes staged normally, including Coordinator/workflow/SCHEMA and the skills/reports. No conflict resolution or trial commit was attempted: this was expressly informational. Abort exited 0, HEAD remained `97752643`, status returned empty. Worktree removal exited 0, then its OS-temp parent was removed. Master was read before and after and remained exactly `97752643b31cdcf8c8ec9f09204382c6766b1573`; no changes to the main checkout.

The README conflict arises from both branches editing the canonical-source/launcher coverage paragraph. Later main integration should retain upstream catalog/root-command guidance and versioned-skill listings/verification limits together, then update the branch-integration status truthfully. This future resolution is a discovery, not a blocker to the assigned informational trial. Optional skill-suite runs in the conflicted trial tree were not run; mandatory suites passed on the combined candidate. Root-command delegation and response/permission/preflight compatibility remain a later assignment, as documented by the Herdr routing reference. No new independent review of these fixes is inferred.

## Own report validation

Executed `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/versioned-agent-skills/implementer-integration-2.md` after writing: exit 0, `ok: true`, ten existing revision fields resolved, empty diagnostics. Then ran the validator child command over every `docs/mailbox/versioned-agent-skills/*.md`, including this report: **13 reports passed**, no diagnostics. Added this observed evidence and revalidated the final report before committing it as the evidence-only successor.
