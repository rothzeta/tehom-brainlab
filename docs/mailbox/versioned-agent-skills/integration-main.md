task: versioned-agent-skills / integration-main / Part 1
status: complete
outcome: Reviewed skills merged locally; root launches delegate to ruach-herdr with repository policy retained; Part 1 quick checks pass.
artifacts:
  - docs/mailbox/versioned-agent-skills/integration-main.md
  - versioned-agent-skills-main
  - scripts/agent-routing.py
  - scripts/test-agent-routing.py
  - .agents/skills/ruach-herdr/scripts/worker.ts
verification:
  - "Root CLI suite at tested_revision: 13 tests pass, exit 0."
  - "Frozen installs in all three skill directories: exit 0."
  - "Skill suites: herdr 81 pass; handoff 24 pass; harness-eval 59 pass; all exit 0."
  - "Skill-creator quick validators: all three skills valid, exit 0; format evidence only."
  - "Protected-path baseline diff and imported skill runtime/test equivalence diff: empty, exit 0."
  - "Whitespace check: exit 0; portability runtime scan: no matches."
  - "Handoff validator: exit 0, ok true, all six supplied revisions resolved."
review: not-run
discoveries:
  - "Root resolve intentionally uses offline selection; worker JSON and failure categories replace the prior flattened result."
  - "Existing-pane launches are unsupported by the worker; root --pane is retired with an explicit diagnostic."
  - "Common baseline 62d7ac7 predates delivered routing/P02; its aggregate diff includes inherited work, not new integration edits."
blockers: []
source_baseline: 97752643b31cdcf8c8ec9f09204382c6766b1573
source_revision: 90ac37bea9ca8d308272c39976db5e020122220a
merge_revision: b9a8e020759fffecdc0bf4b3d1ab2732ec7e603c
candidate_revision: 3ba171cf37158ace89614108d795bfdc69062b33
tested_revision: 3ba171cf37158ace89614108d795bfdc69062b33
skill_evidence_revision: b9a8e020759fffecdc0bf4b3d1ab2732ec7e603c

Author: Implementer, main integration owner. Date: 2026-10-04 UTC. Destination: local `versioned-agent-skills-main` worktree. This report completes Part 1 only. Its creating commit is returned in the terminal handoff; no master delivery or new independent review is claimed.

## Part 1 interim outcome

Merged the specified `versioned-agent-skills-20261004` source revision onto the assigned baseline using `git merge --no-ff 90ac37bea9ca8d308272c39976db5e020122220a`. The only conflict was `.agents/README.md`. Resolution retained the delivered routing schema, policies, command documentation and new skill navigation/evidence limits. Merge commit: `b9a8e020759fffecdc0bf4b3d1ab2732ec7e603c`. The subsequent integration implementation is `3ba171cf37158ace89614108d795bfdc69062b33`.

The root surface remains `justfile -> bin/agent-routing -> scripts/agent-routing.py`. Python validates repository data policy (five roles, Claude/Codex, high effort, Claude coordinator, complete schema/references and canonical files). It no longer selects a route/model, composes native flags, reads native user config, injects instructions, creates adapters/panes, or calls Herdr. It invokes its own versioned skill's `worker.ts` once through a subprocess argv array, preserving streams and exit status. `--root` supplies the worker's canonical repo and cwd; `--route` is forwarded without flattening it to a native model. Bun resolves from nonempty `$BUN_BIN`, then executable `~/.bun/bin/bun`, then PATH. An explicit unavailable Bun fails without fallback.

Coordinator guidance now mentions both ruach-herdr and the delegating root surface, using role/route/cwd/name and canonical routing data without model identities or native flags. Workers validate their own handoffs; mechanical validation remains separate from technical acceptance. Workflows remain Coordinator-only, and harness-eval remains outside daily guidance. The imported SCHEMA already describes the delivered leading YAML/validator/revision contract and needed no further changes. Added vault navigation and updated operational and routing-reference docs. The routing-reference edit is documentation reconciliation required by integration, not a worker runtime change.

## Compatibility decisions

- `resolve ROLE [--name NAME]` remains usable without Herdr/native executables by mapping to worker `resolve --offline`. Default name remains `resolved-agent`. Output is worker schema version 1 with nested `selection` (`kind`/`model` replace `harness`/`native_model`); native argv are empty and `launchable` is false. Native config is not read. Use the skill directly for live resolution or dry-run.
- `start ROLE NAME [--route ID] [--root DIR]` remains, creating one sibling pane through the worker. `--pane` is retained only to produce a clear retirement diagnostic before delegation; supporting existing panes would require extending the separately owned worker contract.
- Worker stdout, stderr and exit categories 2/3/4 are forwarded unchanged. Root policy/setup errors retain exit 1, argument errors exit 2 (the inherited missing-PyYAML diagnostic also exits 2). No retries or fallback routes are added.
- Worker names now match `[a-z][a-z0-9_-]{0,31}`. Permissions are inherited rather than imposing the previous root defaults. Native preparation/configuration, workflow exclusion and private material follow the skill contract, including Codex's existing matching daemon requirement and Claude's fail-closed customization gates.

These changes are explained in root and subcommand help, the agent README, operational docs and the routing reference. They deliberately avoid rebuilding old native mechanics to emulate prior output.

## Changed files

The source merge brings the three skills, narrow canonical docs and existing immutable versioned-skills reports. Post-merge implementation edits are exactly:

```text
 .agents/README.md                                |  12 +-
 .agents/agents/coordinator.md                    |   4 +-
 .agents/skills/ruach-herdr/references/routing.md |  26 +--
 docs/README.md                                   |   2 +
 docs/exploitation/agent-routing.md               |  36 ++--
 scripts/agent-routing.py                         | 175 ++++------------
 scripts/test-agent-routing.py                    | 256 ++++++++---------------
 7 files changed, 160 insertions(+), 351 deletions(-)

```

`bin/`, `justfile`, the routing YAML catalogs and `docs/SCHEMA.md` require no additional integration changes. Root tests retain complete catalog policy regressions and real offline role/alternative selection. Tests tied to the former native launcher are replaced by subprocess argv/cwd/Bun/stream/exit/no-retry contracts. Skill suites own native instruction preservation, workflow exclusion, redaction, capability gates and pane contracts. No prototype tests were changed.

## Executed quick verification

Bun was `/home/metatron/.bun/bin/bun`, version `1.4.2 (744846f84)`. Each install/test invocation selected `task_bun=${BUN_BIN:-$HOME/.bun/bin/bun}`, then used `command -v bun` if that path was not executable. Commands below list the actual resolved executable. Frozen installs were separate calls before testing:

| Cwd | Exact command | Result |
| --- | --- | --- |
| `.agents/skills/ruach-herdr` | `/home/metatron/.bun/bin/bun install --frozen-lockfile` | exit 0; yaml 2.8.1 and ws 8.18.3 installed |
| `.agents/skills/ruach-handoff` | `/home/metatron/.bun/bin/bun install --frozen-lockfile` | exit 0; yaml 2.9.1, ajv 8.20.0 and transitive dependencies installed |
| `.agents/skills/ruach-harness-eval` | `/home/metatron/.bun/bin/bun install --frozen-lockfile` | exit 0; dependency-free manifest, done |
| Repository root | `bin/test-agent-routing -v` | final committed revision: exit 0; 13 tests, 5.344s |
| `.agents/skills/ruach-herdr` | `/home/metatron/.bun/bin/bun test` | exit 0; 81 pass, 0 fail, 485 assertions, 68.56s |
| `.agents/skills/ruach-handoff` | `/home/metatron/.bun/bin/bun test` | exit 0; 24 pass, 0 fail, 216 assertions, 13.98s |
| `.agents/skills/ruach-harness-eval` | `/home/metatron/.bun/bin/bun test` | exit 0; 59 pass, 0 fail, 637 assertions, 11.51s |

The first root run found three obsolete error-wording assertions (12 tests, three subtest failures). They were updated to worker diagnostics without changing rejection requirements; the next run passed 12 tests. After adding the explicit-missing-Bun regression and committing implementation, the final run passed 13 tests.

Skill suites started with HEAD at `skill_evidence_revision` and integration edits present in the worktree. Runtime, tests, manifests and locks were unchanged throughout those runs and are identical at `tested_revision`; an explicit equivalence diff below confirms that. The final root suite ran at the committed `tested_revision`. No checks are claimed at the later report-only commit.

Other executed commands:

```sh
python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/ruach-herdr
python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/ruach-handoff
python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/ruach-harness-eval
bin/agent-routing --help
bin/agent-routing resolve --help
git diff --check 97752643..HEAD
rg -n '/tmp/brainlab-|tehom|Brainlab|/home/metatron|gpt-6|claude-opus' .agents/skills/ruach-herdr/scripts .agents/skills/ruach-handoff/scripts .agents/skills/ruach-harness-eval/scripts scripts/agent-routing.py
git check-ignore .agents/skills/ruach-herdr/node_modules .agents/skills/ruach-handoff/node_modules
```

Quick validators: all exit 0, `Skill is valid!` (format only). Help commands: exit 0 and compatibility guidance present. Diff check: exit 0. Portability scan: no matches (rg exit 1); no runtime username/model/repository assumptions or cross-skill imports were added. Check-ignore: both dependency directories ignored, exit 0. No root package.json/workspace was added. The harness-eval skill has no external dependencies and no lockfile to change.

## Protected scope and revision evidence

The following exact diff was empty, exit 0; these are the protected paths checked against the delivered baseline:

```sh
git diff --exit-code 97752643 HEAD -- README.md AGENTS.md CLAUDE.md justfile bin scripts/repo-root.sh scripts/test-repo-root.sh docs/CURRENT.md docs/TASK_LOGS.md docs/plans docs/prototypes docs/playtests docs/adr docs/mailbox/p01-browser-harness docs/mailbox/p02-formation-algebra docs/mailbox/routing-p02 docs/mailbox/agent-routing 'poc-*' prototypes shared tools assets .agents/models.yaml .agents/routing.yaml .agents/roles.yaml
```

The generic `prototypes/` and repo-root script paths are absent in this baseline; the actual prototype is `poc-001-linked-formation/`, and its docs and P01/P02 mailbox evidence are included above. All P01/P02 code/contracts/evidence, shared/tools/assets, routing catalogs, CURRENT and TASK_LOGS remain unchanged.

Imported skill runtime/test equivalence was also empty, exit 0:

```sh
git diff --exit-code b9a8e02 HEAD -- .agents/skills/ruach-herdr/scripts .agents/skills/ruach-herdr/tests .agents/skills/ruach-herdr/package.json .agents/skills/ruach-herdr/bun.lock .agents/skills/ruach-handoff .agents/skills/ruach-harness-eval
```

Common-rule scope command `git diff --stat 62d7ac7..HEAD` was executed. That earlier architectural baseline predates delivered routing/P02, so it necessarily includes inherited P02 and root delivery changes. Part 1's assignment overrides that scope assumption: preservation is established against `97752643`, while the post-merge stat above identifies this worker's implementation edits. The aggregate output is retained here as evidence, not misrepresented as newly authored work:

```text
 .agents/README.md                                  |   31 +-
 .agents/agents/coordinator.md                      |    6 +-
 .agents/models.yaml                                |    8 +
 .agents/roles.yaml                                 |   17 +
 .agents/routing.yaml                               |    8 +
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
 .agents/skills/ruach-herdr/references/routing.md   |   45 +
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
 README.md                                          |    2 +
 bin/agent-routing                                  |    4 +
 bin/test-agent-routing                             |    4 +
 docs/CURRENT.md                                    |    8 +-
 docs/README.md                                     |    2 +
 docs/SCHEMA.md                                     |    2 +
 docs/TASK_LOGS.md                                  |  120 +++
 docs/exploitation/README.md                        |    1 +
 docs/exploitation/agent-routing.md                 |   32 +
 docs/mailbox/agent-routing/delivery.md             |   63 ++
 docs/mailbox/agent-routing/implementer.md          |   67 ++
 docs/mailbox/agent-routing/reviewer.md             |   91 ++
 docs/mailbox/p02-formation-algebra/delivery.md     |  109 ++
 docs/mailbox/p02-formation-algebra/implementer.md  |  150 +++
 docs/mailbox/p02-formation-algebra/reviewer.md     |  150 +++
 docs/mailbox/p02-formation-algebra/verification.md |  248 +++++
 docs/mailbox/routing-p02/coordinator.md            |   73 ++
 docs/mailbox/versioned-agent-skills/coordinator.md |   63 ++
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
 .../implementer-integration-3.md                   |  214 ++++
 .../implementer-integration.md                     |  181 ++++
 docs/mailbox/versioned-agent-skills/reviewer-2.md  |   96 ++
 docs/mailbox/versioned-agent-skills/reviewer-3.md  |   80 ++
 docs/mailbox/versioned-agent-skills/reviewer.md    |   89 ++
 .../versioned-agent-skills/scout-forward-test.md   | 1140 ++++++++++++++++++++
 ...026-10-02-2e228a2b-poc-001-formation-algebra.md |   10 +-
 docs/plans/README.md                               |    8 +-
 docs/prototypes/poc-001-linked-formation.md        |    8 +-
 justfile                                           |    8 +
 poc-001-linked-formation/README.md                 |   34 +-
 poc-001-linked-formation/src/core/formation.ts     |  102 ++
 poc-001-linked-formation/src/core/hex.ts           |   53 +
 poc-001-linked-formation/tests/formation.test.ts   |  219 ++++
 scripts/agent-routing.py                           |  170 +++
 scripts/test-agent-routing.py                      |  234 ++++
 93 files changed, 7560 insertions(+), 22 deletions(-)

```

## Limits and remaining Part 2 work

No full combined acceptance/scope evaluation, live harness startup, paid turn, model entitlement check, or independent integration review was performed. Stub argv/stream results do not prove a live harness session; handoff schema validation does not certify truth. Herdr's suite required a sandbox allowance for Unix sockets. Writes to read-only `.agents` paths and local shared Git worktree metadata used approved escalation; no unrelated worktree, master branch, global skill install, persistent harness settings, push, deletion or prototype changes occurred.

Part 2 remains: receive and merge the pending ruach-herdr contract fix into this integration branch, resolve any conflicts within scope, and perform the assigned combined verification. Later delivery/evidence updates remain Coordinator-controlled; CURRENT/TASK_LOGS have not been appended. Part 1 has no unresolved blocker. Executed `/home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/versioned-agent-skills/integration-main.md`: exit 0, `ok: true`, empty diagnostics, all six supplied revisions resolved. The final report is checked again before commit; the terminal handoff records the observed report-containing commit.
