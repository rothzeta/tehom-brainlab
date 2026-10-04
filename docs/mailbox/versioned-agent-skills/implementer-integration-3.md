task: versioned-agent-skills / skills-impl-integration / round-3
status: complete
outcome: Merged the Claude gate diagnostic change, clarified README coverage, and completed combined verification including all preferred roles and the explicit Architect alternative.
artifacts:
  - docs/mailbox/versioned-agent-skills/implementer-integration-3.md
  - versioned-agent-skills-20261004
  - .agents/skills/ruach-herdr/
  - .agents/README.md
verification:
  - 'Frozen installs: all three exited 0, dependencies unchanged.'
  - 'Default concurrent suites: handoff 24 passed, evaluator 59 passed, Herdr 81 passed; 164 total, 0 failed.'
  - 'Six skill format checks and fifteen existing task-report validations passed.'
  - 'Scope check passed with clean worktree, 61 allowed changed paths, no diagnostics; portability/model/native-flag and whitespace checks passed.'
  - 'All five preferred-role resolve/dry-run checks ran: eight prepared results and two expected Architect exit-3 gates; explicit Architect alternative resolve and dry-run both passed.'
  - 'All twelve preparation invocations reported not-submitted; detached dependency checkout stayed clean and was removed; master unchanged.'
review: not-run
discoveries:
  - 'Preferred Claude Architect preparation remains unavailable here due to unverified account-synced workflow exclusion; the diagnostic names that source and advises explicit route selection.'
  - 'Architect declared Codex alternative prepares successfully when explicitly selected; no automatic fallback occurs.'
  - 'Root/catalog delivery and the previously reported informational README trial-merge conflict remain later integration work.'
blockers: []
candidate_revision: 46689c1ea4084b5e91dd2c7c7e6ac3d11e37e866
tested_revision: 46689c1ea4084b5e91dd2c7c7e6ac3d11e37e866
delivered_revision: 46689c1ea4084b5e91dd2c7c7e6ac3d11e37e866
source_baseline: 62d7ac705b04d4e039112228775f6052a6f8da64
integration_start_revision: e618c791a0121b867d036b2dce5bd7273c157744
herdr_source_revision: c2a2017b79255571f97342284ede0892788ac579
herdr_implementation_revision: 8340a9d5daef0a9935a7bee328952360aa904466
schema_revision: 97752643b31cdcf8c8ec9f09204382c6766b1573

Author: Implementer (integration owner). Date: 2026-10-04 UTC.

## Integration and documentation

Destination is local `versioned-agent-skills-20261004`, initially `e618c79`. Executed:

```sh
git merge --no-edit versioned-agent-skills-herdr
```

The first sandboxed attempt stopped at the read-only `ORIG_HEAD.lock` metadata boundary before combining source changes. README clarification was committed as `c8b542f`, then the same merge command with approved metadata access exited 0 and created `46689c1` without conflicts. That merge is the combined tested revision and contains the specified source `c2a2017`, its implementation `8340a9d`, and the new worker-owned gate report. No conflict resolutions were needed.

Merged skill changes identify the particular unverified Claude source and explicit remedy while preserving the existing gates; SKILL.md, adapter references, Claude adapter and CLI tests came exactly from the assigned source. Integration did not edit skills or tests. The only direct documentation change was one sentence in [agent README](../../../.agents/README.md), qualifying Claude worker preparation coverage for account-synced/managed/linked-worktree sources and explaining the explicit declared-route or verified-environment remedy. Other owned docs were accurate and remain unchanged; Coordinator still has no model names or native flags.

Earlier integration/review/worker reports remain unchanged. No routing YAML, root launcher, CURRENT, TASK_LOGS, justfile, bin, scripts, prototypes, master or main-checkout worktree edits; no push, global installation, real agent startup or paid turn. The report is a separate evidence-only successor whose creating SHA is returned in the terminal handoff. Independent review/acceptance of this combined revision is not claimed.

## Combined verification

Required checks used existing combined revision `46689c1ea4084b5e91dd2c7c7e6ac3d11e37e866` with unchanged tracked implementation content. Bun 1.4.2; each skill directory was its command cwd:

```sh
/home/metatron/.bun/bin/bun install --frozen-lockfile
PATH=/home/metatron/.bun/bin:$PATH /home/metatron/.bun/bin/bun test
```

| Skill cwd under .agents/skills/ | Frozen install | Default suite | Assertions | Elapsed |
| --- | --- | --- | --- | --- |
| ruach-handoff | exit 0; checked 6 installs, no changes | exit 0; 24 pass, 0 fail | 216 | 14.45s |
| ruach-harness-eval | exit 0; dependency-free | exit 0; 59 pass, 0 fail | 637 | 11.81s |
| ruach-herdr | exit 0; checked 2 installs, no changes | exit 0; 81 pass, 0 fail | 485 | 61.65s |

All suites ran concurrently using default commands, without timeout overrides or test changes. Herdr ran with approved Unix socket access required by its explicit test prerequisite. Installs and narrow README/Git metadata writes also required sandbox escalation. There were no failing test runs this round. Coverage includes the new empty/technical synced-cache gates, actionable source/remedy diagnostics, explicit alternative preparation without customization changes, and private-text redaction, plus all prior preserved configuration/routing/uncertain-start regressions. The actual 35-second fake-start timeout passed.

For each of the six `.agents/skills/ruach-*/SKILL.md` directories, executed this child command:

```sh
python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py SKILL_DIRECTORY
```

All exited 0, `Skill is valid!`: handoff, harness-eval, herdr, simplification, testing, workflow-feature. Format evidence only.

For every existing `docs/mailbox/versioned-agent-skills/*.md`, executed:

```sh
/home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts REPORT_PATH
```

All fifteen existing reports exited 0, `ok: true`, empty diagnostics and resolvable supplied revisions. This includes both earlier integration reports, both review reports, the new Claude gate report and forward Scout report. Own-report/corpus validation is recorded below after writing. Schema validity does not certify truth or acceptance.

## Scope and portability

Executed:

```sh
/home/metatron/.bun/bin/bun .agents/skills/ruach-harness-eval/scripts/scope-check.ts --repo . --baseline 62d7ac7 --candidate 46689c1ea4084b5e91dd2c7c7e6ac3d11e37e866 --allow .agents/scratch/versioned-agent-skills/integration-evidence/allow.json
git diff --check 62d7ac7..HEAD
git diff --exit-code c2a2017 HEAD -- .agents/skills/ruach-herdr
git diff --exit-code e618c79 HEAD -- .agents/skills/ruach-handoff .agents/skills/ruach-harness-eval docs/mailbox/versioned-agent-skills/implementer-integration.md docs/mailbox/versioned-agent-skills/implementer-integration-2.md
git diff --stat 62d7ac7..HEAD
```

All exited 0. Reused the same allowance: `schema_version: 1`, `require_clean: true`, expected branch `versioned-agent-skills-20261004`; exact allowed paths are coordinator/scout/architect/implementer/reviewer role files, feature SKILL.md, agent README, and SCHEMA; prefixes are the three skill directories and `docs/mailbox/versioned-agent-skills/`, each ending `/`. Result: `ok: true`, `clean: true`, candidate/worktree HEAD `46689c1ea4084b5e91dd2c7c7e6ac3d11e37e866`, 61 changed/assessed paths, empty dirty/unexpected/protected/diagnostic arrays. Herdr equals the supplied source revision; handoff/evaluator and prior integration reports equal the starting revision. Full-baseline scope stat:

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
 .agents/skills/ruach-herdr/SKILL.md                |   50 +
 .agents/skills/ruach-herdr/bun.lock                |   18 +
 .agents/skills/ruach-herdr/package.json            |   13 +
 .agents/skills/ruach-herdr/references/adapters.md  |   39 +
 .agents/skills/ruach-herdr/references/routing.md   |   53 +
 .agents/skills/ruach-herdr/scripts/adapters/agy.ts |    6 +
 .../skills/ruach-herdr/scripts/adapters/claude.ts  |   92 ++
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
 .agents/skills/ruach-herdr/tests/worker.test.ts    |  223 ++++
 .agents/skills/ruach-workflow-feature/SKILL.md     |    2 +-
 docs/SCHEMA.md                                     |    2 +
 .../versioned-agent-skills/implementer-eval-fix.md |   71 ++
 .../versioned-agent-skills/implementer-eval.md     |   79 ++
 .../implementer-handoff-doc.md                     |   37 +
 .../implementer-handoff-fix.md                     |   73 ++
 .../versioned-agent-skills/implementer-handoff.md  |  105 ++
 .../implementer-herdr-claude-gate.md               |  158 +++
 .../implementer-herdr-fix.md                       |  133 +++
 .../implementer-herdr-routing.md                   |  136 +++
 .../versioned-agent-skills/implementer-herdr.md    |  126 +++
 .../implementer-integration-2.md                   |  234 ++++
 .../implementer-integration.md                     |  181 ++++
 docs/mailbox/versioned-agent-skills/reviewer-2.md  |   96 ++
 docs/mailbox/versioned-agent-skills/reviewer.md    |   89 ++
 .../versioned-agent-skills/scout-forward-test.md   | 1140 ++++++++++++++++++++
 61 files changed, 5198 insertions(+), 5 deletions(-)
```

Executed these scan forms (braces abbreviate the individually supplied SKILL.md/scripts argv pairs):

```sh
rg -n -i '/tmp/brainlab|/opt/dev|/home/metatron|tehom|brainlab' .agents/skills/ruach-handoff .agents/skills/ruach-harness-eval .agents/skills/ruach-herdr
rg -n -i 'gpt-[0-9]|claude-(opus|sonnet|haiku)|o[1-9](-|\b)|gemini-[0-9]|deepseek-|qwen[0-9]' .agents/skills/ruach-{handoff,harness-eval,herdr}/SKILL.md .agents/skills/ruach-{handoff,harness-eval,herdr}/scripts
rg -n -i 'gpt-[0-9]|claude-(opus|sonnet|haiku)|gemini-[0-9]|deepseek-|qwen[0-9]|--[a-z][a-z-]*|model_reasoning_effort' .agents/agents/coordinator.md .agents/skills/ruach-workflow-feature/SKILL.md
```

All exited 1 with no matches and empty stderr. Whole-directory scans respect ignored node_modules. These are bounded absence checks, not exhaustive certification against future names.

## All-role committed-catalog checks

Executed `python3 .agents/scratch/versioned-agent-skills/integration-3-evidence/catalog-checks.py` with approved existing local socket/Git metadata access. It created a detached OS-temp worktree, ran the combined worker script without launching, and removed the checkout. Exact child command forms, with `W=/opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills` and `D=/tmp/ruach-integration-3-u3orl676/checkout with spaces` abbreviating the literal argv paths:

```sh
git worktree add --detach "$D" 97752643b31cdcf8c8ec9f09204382c6766b1573
git -C "$D" rev-parse HEAD
git -C "$D" status --porcelain
```

All exited 0, exact dependency HEAD, clean starting status. For each role `coordinator`, `architect`, `scout`, `implementer`, `reviewer`, ran both:

```sh
bun "$W/.agents/skills/ruach-herdr/scripts/worker.ts" resolve --name "integ3-$role" --role "$role" --cwd "$D" --repo "$D"
bun "$W/.agents/skills/ruach-herdr/scripts/worker.ts" start --name "integ3-$role" --role "$role" --cwd "$D" --repo "$D" --dry-run
```

| Role | Preferred route in committed catalogs | Resolve / dry-run exits | Result |
| --- | --- | --- | --- |
| coordinator | claude-opus-5.5-high | 0 / 0 | Claude 2.1.289; claude-opus-5-5, high; prepared |
| architect | claude-opus-5.5-high | 3 / 3 | Account-synced exclusion gate; not launchable |
| scout | gpt-6.1-sol-high | 0 / 0 | Codex 0.160.0; gpt-6.1-sol, high; prepared |
| implementer | gpt-6.1-sol-high | 0 / 0 | Codex 0.160.0; gpt-6.1-sol, high; prepared |
| reviewer | gpt-6.1-sol-high | 0 / 0 | Codex 0.160.0; gpt-6.1-sol, high; prepared |

The eight successful preferred preparations had `launchable: true`, empty diagnostics/stderr. Architect's two expected failures had `ok: false`, `launchable: false`, code `unverified_workflow_source`, field `/home/metatron/.claude/skills/synced`. The message identified account-synced skills, explained why the local cache cannot establish future-session exclusion, and advised `--route ROUTE_ID` or an independently verified environment. This is a preserved capability gate, not a successful preferred-route preparation. No automatic alternative was selected.

Executed the explicit declared Architect alternative in both preparation modes:

```sh
bun "$W/.agents/skills/ruach-herdr/scripts/worker.ts" resolve --name integ3-architect-alt --role architect --cwd "$D" --repo "$D" --route gpt-6.1-sol-high
bun "$W/.agents/skills/ruach-herdr/scripts/worker.ts" start --name integ3-architect-alt --role architect --cwd "$D" --repo "$D" --dry-run --route gpt-6.1-sol-high
codex app-server daemon version
git -C "$D" status --porcelain
git -C "$D" rev-parse HEAD
git worktree remove "$D"
git rev-parse refs/heads/master
```

Both alternative commands exited 0, `launchable: true`, empty diagnostics/stderr, Codex 0.160.0 from the declared route, native model gpt-6.1-sol, high effort. All twelve worker invocations reported `submission_state: not-submitted`. Daemon probe exited 0, `status: running`, CLI/server both 0.160.0; no daemon bootstrap. Final checkout status was empty, HEAD remained exact dependency; removal exited 0 and its OS-temp parent was removed. Master read before/after remained `97752643b31cdcf8c8ec9f09204382c6766b1573`; main checkout untouched.

Preferred Claude Architect preparation remains unavailable in this environment. This limitation does not block the assigned diagnostic integration and verification work; it is recorded explicitly rather than counted as a passing launch check. Managed/linked-worktree gates were not independently re-probed beyond the unchanged/full suite this round. Account entitlement, future remote inventory, actual native role/skill consumption and paid sessions remain unverified. No settings/cache/credentials were modified to bypass a gate. Root/catalog delivery and the round-two informational README trial conflict remain outside this round; no trial merge was repeated. All assigned checks were run; no outstanding assigned blocker.

## Own report validation

Executed `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/versioned-agent-skills/implementer-integration-3.md` after writing: exit 0, `ok: true`, eight existing revision fields resolved, empty diagnostics. Then ran the validator child command over every `docs/mailbox/versioned-agent-skills/*.md`, including this report: **16 reports passed**, no diagnostics. Added this observed evidence and revalidated the final report before its evidence-only commit.
