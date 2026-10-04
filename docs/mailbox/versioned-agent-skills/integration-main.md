task: versioned-agent-skills / integration-main / Part 2
status: complete
outcome: Contract corrections merged locally, root automatic approval review restored, and assigned combined verification passed without real agent startup.
artifacts:
  - docs/mailbox/versioned-agent-skills/integration-main.md
  - versioned-agent-skills-main
  - scripts/agent-routing.py
  - scripts/test-agent-routing.py
  - .agents/skills/ruach-herdr/scripts/worker.ts
  - docs/CURRENT.md
  - docs/TASK_LOGS.md
verification:
  - "Three frozen installs: exit 0, no dependency/lock changes."
  - "Committed combined revision suites: root 13, herdr 107, handoff 24, harness-eval 59 tests pass; all exit 0."
  - "Real root surface: nine preferred/alternative resolves, five rejection cases, and two foreign/alias-root cases pass."
  - "Native matrix: all 18 resolve/auto-review dry-run preparations pass; preferred Claude Architect succeeds; panes/names/native session identities unchanged."
  - "Existing named agent resolve rejected with exit 2 and duplicate_name; no startup requested."
  - "All six ruach skill format checks and 21 versioned-skills mailbox validations pass."
  - "Evaluator scope-check: clean, 74 assessed paths, no unexpected/protected changes, exit 0."
  - "Temporary-HOME links: three realpaths, four script help calls, offline resolve and handoff validation pass; 43 skill files unchanged."
  - "P01/P02 protected-path diff empty; portability/ownership scans and whitespace checks pass."
  - "Updated Part 2 handoff validator: exit 0, ok true, eight supplied revisions resolved."
review: not-run
discoveries:
  - "Complete Claude account/plugin/managed catalog visibility remains unverified and nonfatal; launcher supplies canonical role instructions, never workflow bodies."
  - "Codex prefers a matching daemon, with short-lived stdio fallback that can initialize runtime state without changing user config; real matrix used daemon."
  - "Root passes portable auto-review policy; skill adapters own native permission flags."
  - "Herdr list contains both named agents and anonymous detected processes; corrected observer and actual named duplicate probe confirm the worker guard."
blockers: []
source_baseline: 97752643b31cdcf8c8ec9f09204382c6766b1573
source_revision: ab1de719960dcbb349bf6729444a26120db0dde7
merge_revision: e0ea8b48f6a638e22fb043b8fd0abc94750734dd
candidate_revision: 8ea1c677e88b4c0d9b96646719836cae721c3454
combined_revision: 8ea1c677e88b4c0d9b96646719836cae721c3454
tested_revision: 8ea1c677e88b4c0d9b96646719836cae721c3454
part1_candidate_revision: 3ba171cf37158ace89614108d795bfdc69062b33
part1_report_revision: 35094569941c32c1f52ffb67bd2ace046330cdf5

Author: Implementer, main integration owner. Date: 2026-10-04 UTC. Destination: local `versioned-agent-skills-main` worktree. This report records Part 1 history and completes Part 2; the source/tested revisions in the leading fields now identify Part 2. Its creating commit is returned in the terminal handoff; no master delivery or new independent review is claimed.

## Part 1 interim outcome

Merged the specified `versioned-agent-skills-20261004` source revision onto the assigned baseline using `git merge --no-ff 90ac37bea9ca8d308272c39976db5e020122220a`. The only conflict was `.agents/README.md`. Resolution retained the delivered routing schema, policies, command documentation and new skill navigation/evidence limits. Merge commit: `b9a8e020759fffecdc0bf4b3d1ab2732ec7e603c`. The subsequent integration implementation is `3ba171cf37158ace89614108d795bfdc69062b33`.

The root surface remains `justfile -> bin/agent-routing -> scripts/agent-routing.py`. Python validates repository data policy (five roles, Claude/Codex, high effort, Claude coordinator, complete schema/references and canonical files). It no longer selects a route/model, composes native flags, reads native user config, injects instructions, creates adapters/panes, or calls Herdr. It invokes its own versioned skill's `worker.ts` once through a subprocess argv array, preserving streams and exit status. `--root` supplies the worker's canonical repo and cwd; `--route` is forwarded without flattening it to a native model. Bun resolves from nonempty `$BUN_BIN`, then executable `~/.bun/bin/bun`, then PATH. An explicit unavailable Bun fails without fallback.

Coordinator guidance now mentions both ruach-herdr and the delegating root surface, using role/route/cwd/name and canonical routing data without model identities or native flags. Workers validate their own handoffs; mechanical validation remains separate from technical acceptance. Workflows remain Coordinator-only, and harness-eval remains outside daily guidance. The imported SCHEMA already describes the delivered leading YAML/validator/revision contract and needed no further changes. Added vault navigation and updated operational and routing-reference docs. The routing-reference edit is documentation reconciliation required by integration, not a worker runtime change.

## Compatibility decisions

- `resolve ROLE [--name NAME]` remains usable without Herdr/native executables by mapping to worker `resolve --offline`. Default name remains `resolved-agent`. Output is worker schema version 1 with nested `selection` (`kind`/`model` replace `harness`/`native_model`); native argv are empty and `launchable` is false. Native config is not read. Use the skill directly for live resolution or dry-run.
- `start ROLE NAME [--route ID] [--root DIR]` remains, creating one sibling pane through the worker. `--pane` is retained only to produce a clear retirement diagnostic before delegation; supporting existing panes would require extending the separately owned worker contract.
- Worker stdout, stderr and exit categories 2/3/4 are forwarded unchanged. Root policy/setup errors retain exit 1, argument errors exit 2 (the inherited missing-PyYAML diagnostic also exits 2). No retries or fallback routes are added.
- Worker names now match `[a-z][a-z0-9_-]{0,31}`. Part 2 supersedes the Part 1 permission change: root automatic approval review is restored through `--permissions auto-review`. Codex now permits short-lived native stdio fallback; unverified complete Claude catalog visibility is a limitation rather than a startup gate.

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

Part 1 skill suites started with HEAD at merge `b9a8e020759fffecdc0bf4b3d1ab2732ec7e603c` and integration edits present in the worktree. Runtime, tests, manifests and locks were unchanged throughout those runs and are identical at Part 1 tested revision `3ba171cf37158ace89614108d795bfdc69062b33`; an explicit equivalence diff below confirms that. The final Part 1 root suite ran at that committed revision. No checks are claimed at the later report-only commit.

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

At the Part 1 handoff, Part 2 remained pending: merge the ruach-herdr corrections and run combined verification. Those tasks and the now-authorized CURRENT/TASK_LOGS entries are completed below. Master delivery/global installation remain Coordinator-controlled. Part 1 has no unresolved blocker. Executed `/home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/versioned-agent-skills/integration-main.md`: exit 0, `ok: true`, empty diagnostics, all six Part 1 supplied revisions resolved. The Part 2 report is checked again before commit; the terminal handoff records the observed report-containing commit.


## Part 2 — contract merge and combined verification

Source branch `versioned-agent-skills-herdr` at `ab1de719960dcbb349bf6729444a26120db0dde7` contains implementations `97e7c09` (Claude correction) and `97ced69` (Codex fallback and portable permissions). `git merge --no-ff ab1de71` produced only the expected conflict in `.agents/skills/ruach-herdr/references/routing.md`. Resolution kept corrected native-reader, visibility and permission content while preserving the delivered delegation seam. Local merge commit is `e0ea8b48f6a638e22fb043b8fd0abc94750734dd`; implementation/documentation candidate is `8ea1c677e88b4c0d9b96646719836cae721c3454`.

Root launches now pass `--permissions auto-review` as repository policy for both start and offline resolve. No native permission flags are constructed in root code. The startup argv regression checks the exact worker arguments, including this policy. Canonical Coordinator guidance remains role/route/cwd/name-based with no model names or native flags. Root help/README, operational docs, routing reference and this owner's prior prose are reconciled. SCHEMA's existing mechanical-validation/historical-boundary guidance remains accurate and was retained; navigation already links the delivered skills. CURRENT and TASK_LOGS receive factual local-integration entries; they do not establish master delivery or global installation.

Claude preparation supplies canonical role instructions, omits launcher-supplied workflow bodies, and suppresses known repository workflows where supported. Full account/plugin/managed catalog visibility is an unverified nonfatal limit. Codex uses the running matching daemon when available and otherwise a short-lived native stdio inspector. That fallback may initialize native runtime state, but does not write user configuration. The real matrix here used the daemon for all eight Codex preparations; fallback behavior is covered by default fixtures, not a real forced-daemon-absence run.

### Commands and results on the committed combined revision

Every combined suite and root/native/link/scope check ran with HEAD at `8ea1c677e88b4c0d9b96646719836cae721c3454` and a clean tracked worktree. Intermediate evidence stayed in ignored `.agents/scratch/integration-main-part2/`. Bun was `/home/metatron/.bun/bin/bun`, version 1.4.2. Shell invocations used `$BUN_BIN` when set, then the standard user Bun install, then PATH.

| Cwd | Exact command | Result |
| --- | --- | --- |
| `.agents/skills/ruach-herdr` | `/home/metatron/.bun/bin/bun install --frozen-lockfile` | exit 0; checked two installs across three packages, no changes |
| `.agents/skills/ruach-handoff` | `/home/metatron/.bun/bin/bun install --frozen-lockfile` | exit 0; checked six installs across seven packages, no changes |
| `.agents/skills/ruach-harness-eval` | `/home/metatron/.bun/bin/bun install --frozen-lockfile` | exit 0; done, no external dependencies |
| Repository root | `bin/test-agent-routing -v` | exit 0; 13 tests in 7.866s |
| `.agents/skills/ruach-herdr` | `/home/metatron/.bun/bin/bun test` | exit 0; 107 pass, 0 fail, 753 assertions, 124.00s |
| `.agents/skills/ruach-handoff` | `/home/metatron/.bun/bin/bun test` | exit 0; 24 pass, 0 fail, 216 assertions, 16.60s |
| `.agents/skills/ruach-harness-eval` | `/home/metatron/.bun/bin/bun test` | exit 0; 59 pass, 0 fail, 637 assertions, 12.99s |

All existing corrected skill suites were preserved unchanged. Only the root expected portable policy argv and offline policy assertions were updated.

The scratch helper was invoked as:

```sh
python3 .agents/scratch/integration-main-part2/verify.py root > .agents/scratch/integration-main-part2/root.jsonl
python3 .agents/scratch/integration-main-part2/verify.py native > .agents/scratch/integration-main-part2/native-final.jsonl
python3 .agents/scratch/integration-main-part2/verify.py links > .agents/scratch/integration-main-part2/links.jsonl
```

All final invocations exited 0. Its native command generation has no startup path without `--dry-run`. Root mode executed `just agent-routing resolve ROLE` for all five roles and repeated it with `--route ID` for each of the four declared alternatives below. All nine calls returned expected YAML-selected role/route/kind/model/effort, auto-review policy, offline action, no argv and `launchable: false`.

Real root negative calls were:

```sh
bin/agent-routing resolve unknown
bin/agent-routing resolve coordinator --route gpt-6.1-sol-high
bin/agent-routing resolve scout --unknown-option
bin/agent-routing start scout check-worker --pane existing-pane
BUN_BIN=<scratch>/does-not-exist bin/agent-routing resolve scout
```

Their observed exits were 2, 2, 2, 1 and 1, with unreadable role, disallowed route, argparse unknown-option, explicit retired-pane and missing-Bun diagnostics respectively. Foreign-cwd `--root` resolution was checked from `/tmp`, and a temporary path containing spaces/quotes symlinked to this checkout resolved to its canonical realpath. All passed. The root suite separately captures exact start argv/cwd through a fake Bun and verifies unchanged stdout/stderr and worker exits 2/3/4 with exactly one delegation/no retries. No real root start was submitted.

Native matrix commands used this exact form for each preferred role and every declared alternative (R is the absolute integration worktree):

```sh
/home/metatron/.bun/bin/bun "$R/.agents/skills/ruach-herdr/scripts/worker.ts" resolve --name "main-check-$ROLE" --role "$ROLE" --repo "$R" --cwd "$R" --permissions auto-review
/home/metatron/.bun/bin/bun "$R/.agents/skills/ruach-herdr/scripts/worker.ts" start --name "main-check-$ROLE" --role "$ROLE" --repo "$R" --cwd "$R" --permissions auto-review --dry-run
# Alternative rows append --route ROUTE_ID to each argv.
```

| Role | Selected route (preferred first, then alternative) | Kind | Config reader | Resolve / dry-run exit |
| --- | --- | --- | --- | --- |
| coordinator | claude-opus-5.5-high | claude | n/a | 0 / 0 |
| architect | claude-opus-5.5-high | claude | n/a | 0 / 0 |
| architect | gpt-6.1-sol-high | codex | daemon | 0 / 0 |
| scout | gpt-6.1-sol-high | codex | daemon | 0 / 0 |
| scout | claude-opus-5.5-high | claude | n/a | 0 / 0 |
| implementer | gpt-6.1-sol-high | codex | daemon | 0 / 0 |
| implementer | claude-opus-5.5-high | claude | n/a | 0 / 0 |
| reviewer | gpt-6.1-sol-high | codex | daemon | 0 / 0 |
| reviewer | claude-opus-5.5-high | claude | n/a | 0 / 0 |

All 18 were launchable, returned `not-submitted`, had empty diagnostics and no pane/private launch directory. Native versions were Claude 2.1.289 and Codex 0.160.0. **Preferred Claude Architect preparation succeeded in both commands against this worktree's own catalogs.** Before/after `herdr pane layout --current` and `herdr agent list` snapshots confirm unchanged pane, named-agent and native-session identities (23 entries: 16 named and seven anonymous detected processes). No pane or agent was created.

The scratch observer initially assumed every live list entry had a name and then confused anonymous harness labels with names. Two observer-only runs stopped before native preparation. An exploratory `resolve --name codex` returned 0, but `codex` was merely a harness label and this was not a valid duplicate probe. Full response inspection corrected those assumptions; no production code or test was changed. A valid read-only probe of existing named agent `skills-impl-main` then returned exit 2 with `duplicate_name`:

```sh
/home/metatron/.bun/bin/bun /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-main/.agents/skills/ruach-herdr/scripts/worker.ts resolve --name skills-impl-main --role architect --repo /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-main --cwd /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-main --permissions auto-review
```

This resolves the briefly reported concern; there is no known duplicate-name blocker. It does not establish startup behavior because no start was requested.

### Format, handoffs, links and portability

Executed `python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py DIR` for every `.agents/skills/ruach-*/SKILL.md` owner: herdr, handoff, harness-eval, testing, simplification and workflow-feature. All six exited 0 with `Skill is valid!`; this is format evidence only.

Executed `/home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts REPORT` over all 21 `docs/mailbox/versioned-agent-skills/*.md` reports. All exited 0 with `ok: true` and empty diagnostics. Historical reports by other workers are unchanged. The updated integration report was separately validated with `/home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/versioned-agent-skills/integration-main.md`: exit 0, `ok: true`, all eight supplied revisions resolved, empty diagnostics. Corpus validation checks structure/revision existence, not truth or acceptance.

A fresh temporary HOME under ignored scratch linked `.agents/skills/{ruach-herdr,ruach-handoff,ruach-harness-eval}` to this worktree's canonical skill directories. All three resolved realpaths matched. With that HOME, commands through the links ran `worker.ts --help`, `validate.ts --help`, `acceptance.ts --help`, `scope-check.ts --help`, worker `resolve --offline --name link-check --role architect --repo R --cwd R`, and handoff validation of this report from the temporary HOME. All six exited 0; offline output remained unlaunchable. Temporary HOME was removed. SHA-256 snapshots of all 43 skill files excluding ignored node_modules matched before/after; no added/removed/changed skill files. No actual global link was installed.

Executed scans (zero matches means rg exit 1):

```sh
rg -n -- '--append-system|--permission-mode|--approve-for-me|developer_instructions|skills\.config|harness_argv|herdr_call|def resolve|toml' scripts/agent-routing.py
rg -n -- 'gpt-[0-9]|claude-opus|--model|--effort|--permission-mode|--approve-for-me|--append-system' .agents/agents/coordinator.md .agents/skills/ruach-workflow-feature/SKILL.md
rg -n --glob '!**/node_modules/**' --glob '!bun.lock' -- '/tmp/brainlab-|tehom-brainlab|Brainlab|/home/metatron|gpt-[0-9]|claude-opus' .agents/skills
rg -n -- 'from .*(ruach-|skills/)' .agents/skills/ruach-herdr/scripts .agents/skills/ruach-handoff/scripts .agents/skills/ruach-harness-eval/scripts
rg -l --glob '!**/node_modules/**' -- '--permission-mode|--approve-for-me|--append-system-prompt-file' .agents/skills
git diff --check 97752643..HEAD
```

First four scans had zero matches. The fifth locates expected native flag ownership inside ruach-herdr's adapters, fixtures/tests and skill docs, not root code or Coordinator/workflow guidance. An initial all-skills scan placed glob options after `--` and exited 2; the corrected command above completed with no matches. Whitespace check exited 0.

### Scope and protected paths

Executed:

```sh
/home/metatron/.bun/bin/bun .agents/skills/ruach-harness-eval/scripts/scope-check.ts --repo . --baseline 97752643 --candidate 8ea1c677e88b4c0d9b96646719836cae721c3454 --allow .agents/scratch/integration-main-part2/scope-allow.json
```

Exit 0; `ok: true`, expected branch, clean worktree, 74 changed/assessed paths, empty unexpected/protected paths and diagnostics. The explicit allow/protection configuration was:

```json
{
  "schema_version": 1,
  "paths": [
    "scripts/agent-routing.py",
    "scripts/test-agent-routing.py",
    ".agents/README.md",
    ".agents/agents/coordinator.md",
    ".agents/skills/ruach-workflow-feature/SKILL.md",
    "docs/SCHEMA.md",
    "docs/README.md",
    "docs/exploitation/agent-routing.md",
    "docs/CURRENT.md",
    "docs/TASK_LOGS.md"
  ],
  "prefixes": [
    ".agents/skills/ruach-herdr/",
    ".agents/skills/ruach-handoff/",
    ".agents/skills/ruach-harness-eval/",
    "docs/mailbox/versioned-agent-skills/"
  ],
  "require_clean": true,
  "expected_branch": "versioned-agent-skills-main",
  "protected_paths": [
    "poc-001-linked-formation/",
    "shared/",
    "tools/",
    "assets/",
    "docs/prototypes/",
    "docs/plans/",
    "docs/playtests/",
    "docs/adr/",
    "docs/mailbox/p01-browser-harness/",
    "docs/mailbox/p02-formation-algebra/",
    "docs/mailbox/routing-p02/",
    "docs/mailbox/agent-routing/",
    ".agents/models.yaml",
    ".agents/routing.yaml",
    ".agents/roles.yaml",
    "bin/",
    "justfile",
    "README.md",
    "AGENTS.md",
    "CLAUDE.md"
  ]
}
```

Protected non-agent diff was empty, exit 0:

```sh
git diff --exit-code 97752643 HEAD -- prototypes 'poc-*' shared tools assets docs/prototypes docs/plans docs/playtests docs/adr docs/mailbox/p01-browser-harness docs/mailbox/p02-formation-algebra docs/mailbox/routing-p02 docs/mailbox/agent-routing
```

The actual prototype path is `poc-001-linked-formation/`; generic `prototypes/` remains absent. P01/P02 code, contracts and evidence, shared/tools/assets and their documentation remain unchanged. Routing catalogs, root bin/just surfaces, portable role definitions other than Coordinator, and historical reports are protected by the allow-list. CURRENT/TASK_LOGS are now explicitly authorized append-only evidence paths. No browser rerun was needed or performed.

### Handoff limits and next step

No live model session, paid turn, task submission, native role contribution acceptance, or full live skill discovery was verified. Claude complete account/plugin/managed catalog visibility remains an honest unverified limit. The real no-daemon stdio path was not forced; default tests cover fallback/cleanup/runtime-state boundaries. Mechanical handoff validity does not certify truth, and stub argv checks do not establish a live session.

Part 2 has no unresolved blocker. The local combined/tested revision is the leading `8ea1c67` SHA; later report/CURRENT/TASK_LOGS changes only record evidence. Source and destination are local branches; no master delivery, remote push, branch/worktree deletion or persistent global install occurred. The Coordinator retains independent review, acceptance and any later delivery/global installation decision. Return the observed report-containing SHA after commit rather than predicting it here.
