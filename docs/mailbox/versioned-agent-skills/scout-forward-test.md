task: skills-scout-forward
role: scout
status: complete
outcome: Completed isolated forward probes of handoff, harness evaluation, and Herdr launch preparation
artifacts:
  - docs/mailbox/versioned-agent-skills/scout-forward-test.md
verification:
  - "Mailbox corpus: 18 files validated; 10 passed and 8 historical Markdown-first documents failed HEADER_INVALID as documented"
  - "Handoff examples: valid and revision reports passed all cwd/repository combinations; malformed and missing-revision cases failed as expected"
  - "Toy evaluation: correct candidate passed; incorrect, out-of-scope, and dirty candidates failed as expected; checkout and index snapshots unchanged"
  - "Herdr: six successful native resolve/dry-run probes after local socket access; unavailable/unsupported kinds and broken routing failed before submission"
  - "Skill tests: harness-eval 49 passed; handoff rerun 24 passed; Herdr 50 fixture setup failures caused by sandbox Unix socket restrictions"
review: not-run
tested_revision: 4e8d7d30fb57a033b5c4378aeec2fae7aaf209bd
discoveries:
  - "doc-gap: Non-offline resolve and start --dry-run require live Herdr context, not clearly stated beside quickstart examples"
  - "friction: Dirty acceptance still runs behavior checks; consume top-level ok alongside per-check results"
  - "friction: Schema errors suppress revision diagnostics until the report structure is corrected"
blockers: []

# Forward investigation

Inspected branch `versioned-agent-skills-fwd`, HEAD `4e8d7d30fb57a033b5c4378aeec2fae7aaf209bd`, on 2026-10-04. Assignment was read from the supplied external scratch path. Skill learning used only each skill's own `SKILL.md` and directory contents. I did not read the versioned-skills mailbox reports for hints or inspect Git history. Corpus validation necessarily let the validator read those reports; I examined its JSON diagnostics and revision resolutions only.

No skill, test, application, or configuration source was changed. All fixture repositories and skill copies live under `/tmp/skills-forward-iqDHcr`; only this report is intended for the local report commit. No merge, push, global install, live agent start, or pane creation was performed. The Herdr suite failed in `beforeEach` before test bodies; its fake startup tests did not reach submission. Every direct launcher `start` invocation included `--dry-run`.

## Findings and classifications

| ID | Class | Finding and reproduction | Effect / documentation expectation |
| --- | --- | --- | --- |
| H1 | doc-gap | In the ordinary sandbox, valid coordinator/reviewer/explicit Codex `resolve` and `start --dry-run` returned exit 3, `unreachable_herdr`, because caller layout could not be read. With approved access to existing local sockets, the same commands returned exit 0. | Quickstart offers these as read-only preparation, but `.agents/skills/ruach-herdr/SKILL.md:30` explicitly assigns the live-context requirement to `start`. Ordinary `resolve` has the same requirement. State this for both commands beside the examples; `resolve --offline` is the portable selection-only alternative. Adapter reference describes preflight, so this is quickstart clarity rather than contradictory implementation. |
| H2 | friction | `bun test` in the copied Herdr skill yielded 0 pass, 50 fail, 50 errors, exit 1, in 250.62 s. Each fixture socket listen raised EPERM and its hook timed out after 5 s. | Test fixture `.agents/skills/ruach-herdr/tests/worker.test.ts:53` needs Unix socket binding. This sandbox prohibits it. Not evidence of launcher failures; a prerequisite check or documented socket requirement would make the smoke test less confusing. No unrestricted rerun of startup tests was performed. |
| V1 | friction | Initial handoff suite under concurrent runs: 22 pass, 2 timeout failures, exit 1. Rerun with `bun test --timeout 30000`: 24 pass, 0 fail, exit 0. | The two timed-out tests spawn many validator subprocesses. No correctness regression was reproduced. Busy runs can exceed Bun's default 5 s per-test timeout; the successful rerun is the only full passing handoff suite result. |
| V2 | friction | `mistakes.md` returned four schema diagnostics but no missing-commit diagnostic. Correcting only the structural mistakes in the same report exposed `REVISION_MISSING /tested_revision`, exit 1. | `.agents/skills/ruach-handoff/scripts/validate.ts:100` exits before revision probing when schema validation fails. Validates correctly; fixing a report may take two passes. The skill lists the codes but does not emphasize this ordering. |
| E1 | friction | Dirty candidate A ran both tests and reported them passed, yet top-level `ok:false`, exit 1, `dirty_candidate`, with staged/unstaged/untracked records. | As documented, acceptance requires clean before/after. It does not stop executing checks merely because it began dirty. A Coordinator must consume aggregate `ok` and dirtiness, rather than count green test records or assume execution used pristine commit bytes. |
| E2 | friction | Correct and incorrect candidates had different check fingerprints despite the same assignment and acceptance configuration. | Documented and expected: fingerprints include fixture bytes. The copied `calc.py` differs across candidates. Comparing fingerprints alone would misclassify these as different acceptance definitions; inspect the separate assignment, acceptance and fixture hashes. |
| P1 | friction | `.agents/scratch/forward` creation failed with read-only filesystem although it was the assigned scratch location. | Environment mount restriction, unrelated to skill behavior. Assignment explicitly permits OS temp directories; installing copied skill directories there solved it without changing the canonical skills. |

No confirmed skill runtime defect was found in the assigned positive/negative cases. These are scoped observations, not review acceptance or proof of real native turns. Claims about account/model availability, effective role consumption, and workflow filtering during actual sessions remain untested. The toy launcher repo contains roles and routing, but no workflow skills; successful empty `hidden_workflows` does not test workflow exclusion.

## Environment, installation, and prerequisites

`B=/home/metatron/.bun/bin/bun`, Bun `1.4.2 (744846f84)`. `T=/tmp/skills-forward-iqDHcr`, `R=/opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-fwd`. Those abbreviations below are literal values used in this run. All three copied skills were installed independently using their documented command:

```sh
mkdir -p .agents/scratch/forward/skills
# exit 1: read-only filesystem; no copy occurred here
mktemp -d /tmp/skills-forward-XXXXXX
# exit 0: /tmp/skills-forward-iqDHcr
cp -R .agents/skills/ruach-handoff .agents/skills/ruach-herdr .agents/skills/ruach-harness-eval /tmp/skills-forward-iqDHcr/
# exit 0
```

From each `$T/ruach-*` skill cwd, `/home/metatron/.bun/bin/bun install --frozen-lockfile` exited 0. Handoff installed `ajv@8.20.0`, `yaml@2.9.1`, six packages; Herdr installed `ws@8.18.3`, `yaml@2.8.1`, two packages; harness-eval completed with no packages. The evaluator has no `bun.lock`, but its documented frozen install succeeded because there are no dependencies. Copied skills were used throughout.

| Test command, cwd | Exit | Observed output |
| --- | --- | --- |
| `/home/metatron/.bun/bin/bun test`, `$T/ruach-handoff` | 1 | 22 pass, 2 fail; malformed/header and schema-oracle tests timed out; 29.71 s |
| `/home/metatron/.bun/bin/bun test --timeout 30000`, `$T/ruach-handoff` | 0 | 24 pass, 0 fail, 216 assertions; 23.36 s |
| `/home/metatron/.bun/bin/bun test`, `$T/ruach-harness-eval` | 0 | 49 pass, 0 fail, 436 assertions; 29.50 s |
| `/home/metatron/.bun/bin/bun test`, `$T/ruach-herdr` | 1 | 0 pass, 50 fail, 50 errors; EPERM socket binding in setup; 250.62 s |

Git was available at `/usr/bin/git`. Native read-only preparation found Claude `2.1.289` and Codex `0.160.0`, plus an existing matching Codex daemon. Herdr was available at `/home/metatron/.local/bin/herdr`. DSH, Pi, and OMP were absent from this invocation's PATH; Agy was present but intentionally unsupported. Installed-version statements in adapter evidence are historical inspected evidence, not a promise that this process can find each executable.

The restricted probes could read CLI help but could not reach the live Herdr socket. Approved escalation was used only for the assigned `resolve` and `start --dry-run` commands against the existing Herdr/Codex sockets. No daemon bootstrap or paid session was requested. No approval was rejected.

## Task 1: handoff

### Corpus results

Each Markdown file under `docs/mailbox/` present before writing this report was validated from unrelated temp cwd using the following exact argv shape:

```sh
/home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-fwd/docs/mailbox/FILE.md
```

The ledger below contains every invocation. 18 files were checked: 10 passed, 8 failed. Successful reports returned `schema_version:1`, `ok:true`, empty diagnostics, and resolved any supplied revisions from this worktree. Failures returned exit 1, `ok:false`, `HEADER_INVALID /header` with “Expected a leading YAML mapping, not a Markdown heading or fenced block.” No historical file was rewritten.

| Report relative to `docs/mailbox/` | Exit | Result |
| --- | --- | --- |
| README.md | 1 | HEADER_INVALID /header |
| claude-architect-injection/architect.md | 1 | HEADER_INVALID /header |
| codex-architect-injection/architect.md | 1 | HEADER_INVALID /header |
| orchestrator-comparison/assignment.md | 1 | HEADER_INVALID /header |
| orchestrator-comparison/results.md | 1 | HEADER_INVALID /header |
| orchestrator-four-harness/assignment.md | 1 | HEADER_INVALID /header |
| orchestrator-four-harness/observer-source.md | 1 | HEADER_INVALID /header |
| orchestrator-four-harness/results.md | 1 | HEADER_INVALID /header |
| p01-browser-harness/coordinator.md | 0 | pass; diagnostics empty |
| p01-browser-harness/delivery.md | 0 | pass; diagnostics empty |
| p01-browser-harness/implementer.md | 0 | pass; diagnostics empty |
| p01-browser-harness/reviewer.md | 0 | pass; diagnostics empty |
| p01-browser-harness/scout.md | 0 | pass; diagnostics empty |
| p01-browser-harness/verification.md | 0 | pass; diagnostics empty |
| versioned-agent-skills/architect.md | 0 | pass; diagnostics empty |
| versioned-agent-skills/implementer-eval.md | 0 | pass; diagnostics empty |
| versioned-agent-skills/implementer-handoff.md | 0 | pass; diagnostics empty |
| versioned-agent-skills/implementer-herdr.md | 0 | pass; diagnostics empty |

These results matched the handoff skill's historical-boundary guidance at `SKILL.md:71`. Its examples name the six browser reports and Architect report; the additional three versioned-skills Implementer reports also passed. Corpus success is mechanical structure/revision resolution only, not validation of their underlying claims.

### Three reports authored independently

Temporary repo `$T/handoff-repo` was initialized with `git init -b main` and repo-local author identity. `worker.txt` contained `observable result
`, committed as implementation; `evidence.txt` contained `Checked worker output
`, committed as an evidence-only successor. Existing implementation bytes were checked with `git show COMMIT:worker.txt`, exit 0, matching that exact string. Reports were written after these commits, with no predicted self-commit identifier.

Implementation/tested commit: `7ee9b0f3eb8aad554e65557ebc24a0e883bb6559`. Evidence-only successor: `f64285d1091f618d80bc1162bf904e71594ebaeb`. The toy revision verification reads committed bytes; it is not a test of the main repository.

`minimal.md` final contents:

```yaml
task: forward-worker
status: complete
outcome: Toy work inspected
artifacts: [minimal.md]
verification: not-run
discoveries: []
blockers: []

Minimal mechanically valid report.
```

`revision.md` final contents:

```yaml
task: forward-worker
status: complete
outcome: Toy work inspected
artifacts: [revision.md, worker.txt, evidence.txt]
verification:
  - "git show tested_revision:worker.txt matched observable result (exit 0)"
discoveries: []
blockers: []
tested_revision: 7ee9b0f3eb8aad554e65557ebc24a0e883bb6559
evidence_revision: f64285d1091f618d80bc1162bf904e71594ebaeb

Tested implementation and later evidence commit are distinct.
```

`mistakes.md` final contents:

```yaml
task: forward-worker
status: done
outcome: " "
artifacts:
  - File: worker.txt
verification:
  - Build: exit 0
discoveries: []
tested_revision: missing-forward-commit

Mistaken status, whitespace outcome, artifact mapping, absent blockers, missing revision.
```

For each of the three reports I ran with and without `--repo /tmp/skills-forward-iqDHcr/handoff-repo`, both from that repo and from `$T/unrelated` (a non-Git directory). Report arguments were absolute. The exact argv and cwd for each appear in the ledger. The revision report was validated both before and after its verification text was updated to record the executed commit-byte check.

| Case | All four combinations | Observed details |
| --- | --- | --- |
| Minimal | exit 0 | `ok:true`, no revisions, no diagnostics; final minimal worker includes its own report in artifacts; neutral-template version with an empty artifacts list also passed earlier |
| Tested + evidence revisions | exit 0 | Two revision records resolved to the distinct existing commits above; auto repository discovery used report location despite unrelated caller cwd |
| Realistic mistakes | exit 1 | `FIELD_REQUIRED /blockers`, `FIELD_ENUM /status`, `FIELD_INVALID /outcome`, `FIELD_TYPE /artifacts/0`; legacy verification mapping itself accepted |
| Same mistakes report, schema corrected temporarily | exit 1 | Only `REVISION_MISSING /tested_revision`; tested with the same four context combinations; restored malformed original afterward |

The temporary corrected report kept task/status/outcome/artifacts/verification/discoveries/blockers valid and retained `tested_revision: missing-forward-commit`. This followup confirms that unresolved commits are rejected once structural validation succeeds. It is not a fourth retained report.

The final minimal report includes its own durable handoff reference. Initial neutral-template versions with empty artifact lists also passed, as documented; I then filled artifact references for the two correct reports and reran all four combinations. A real worker must still supply evidence required by its assignment. Relevant contract: `.agents/skills/ruach-handoff/SKILL.md:14`, `:43`, `:79`, `:100`; implementation: `scripts/validate.ts:62` (header), `:91` (schema), `:100` (revision selection), `:114` (report-directory/explicit-repo discovery).

## Task 2: harness evaluation

Toy repository `$T/toy` owns two branches checked out in temp Git worktrees `$T/candidate-a` and `$T/candidate-b`. Both originated at the same baseline. Only `calc.py` is allowed to change. Assignment bytes: `Fix add(a,b) for signed integers. Change only calc.py.
`. Baseline implementation returned `a - b`; candidate A returned `a + b`; candidate B returned `abs(a) + abs(b)` and added unrequested `unrelated.txt`.

Observable test `test_calc.py`, identical in both candidates:

```python
from calc import add
assert add(2, 3) == 5
assert add(-2, 3) == 1
print("PASS add")
```

The first case passes in B and the signed case fails. Both evaluator checks use `PYTHONDONTWRITEBYTECODE=1` so this supplied Python test does not dirty the candidate with bytecode. One runs its script from the evaluator's foreign cwd; the other runs a copied fixture under a directory with spaces.

| Revision | SHA |
| --- | --- |
| baseline | `cad3a8472a7a645034037be44da7812dab7d1065` |
| a | `feae06095aec7f3f3516ae0ca39a6f396cd21cff` |
| b | `dc83f0800ae001d2fb337211960f2eaaedec12d5` |

`$T/evaluation.json`:

```json
{
  "schema_version": 1,
  "task": "forward-add",
  "assignment": "assignment.md",
  "acceptance": {
    "fixtures": [
      {
        "id": "spaced",
        "copy": [
          "calc.py",
          "test_calc.py"
        ],
        "directory": "toy with spaces"
      }
    ],
    "checks": [
      {
        "id": "signed-add",
        "argv": [
          "python3",
          "{repo}/test_calc.py"
        ],
        "cwd": "{foreign_cwd}",
        "timeout_ms": 10000,
        "env": {
          "PYTHONDONTWRITEBYTECODE": "1"
        },
        "expect": {
          "exit": 0,
          "stdout": "PASS add\n",
          "stderr": ""
        }
      },
      {
        "id": "copied-add",
        "argv": [
          "python3",
          "{fixture:spaced}/test_calc.py"
        ],
        "cwd": "{fixture:spaced}",
        "timeout_ms": 10000,
        "env": {
          "PYTHONDONTWRITEBYTECODE": "1"
        },
        "expect": {
          "exit": 0,
          "stdout": "PASS add\n",
          "stderr": ""
        }
      }
    ]
  },
  "runs": [
    {
      "id": "a",
      "repo": "candidate-a",
      "candidate": "candidate-a",
      "kind": "codex",
      "model": "declared-toy-a",
      "effort": "high"
    },
    {
      "id": "b",
      "repo": "candidate-b",
      "candidate": "candidate-b",
      "kind": "claude",
      "model": "declared-toy-b"
    }
  ]
}
```

`$T/scope.json`:

```json
{
  "schema_version": 1,
  "paths": [
    "calc.py"
  ],
  "require_clean": true
}
```

`$T/scope-dirty-allowed.json`:

```json
{
  "schema_version": 1,
  "paths": [
    "calc.py"
  ],
  "require_clean": false
}
```

| Invocation | Exit | Observed output |
| --- | --- | --- |
| Acceptance A clean | 0 | `ok:true`; both checks passed; exit 0, stdout `PASS add\n`, stderr empty; clean before/after |
| Scope A clean | 0 | `ok:true`; committed changed paths `[calc.py]`; no unexpected paths; clean |
| Acceptance B clean | 1 | `ok:false`; both checks failed, exit 1 with AssertionError at signed-input assertion; check-local `exit_mismatch` and `output_mismatch`; top-level diagnostics empty |
| Scope B clean | 1 | `ok:false`; committed paths `[calc.py, unrelated.txt]`; unexpected `[unrelated.txt]`; `unexpected_paths` diagnostic |
| Acceptance A dirty | 1 | Both checks passed, but `ok:false`, `dirty_candidate`, identical dirty before/after records |
| Scope A dirty | 1 | Unexpected `[README.md, loose.txt]`; `unexpected_paths` and `dirty_worktree`; staged/unstaged/untracked records preserved |
| Scope A dirty, require_clean false | 1 | `clean:false`; unexpected paths still fail; only `unexpected_paths` diagnostic remains |

Dirty state was deliberately introduced after clean A/B evaluation: `README.md` changed and staged (`M `), `calc.py` received a behavior-preserving comment without staging (` M`), and `loose.txt` was untracked (`??`). The baseline/candidate commit refs did not move. A dirty result's `tested_revision` still identifies the specified commit, so dirtiness is necessary context for the actual bytes tested.

All outputs used fresh paths outside each evaluated checkout and common Git metadata, e.g. `$T/a-clean-acceptance.json`. Outputs were retained independently. Scope alone does not require observed HEAD to equal the specified candidate; our assigned probes used matching HEADs. No scope output was treated as proof of native harness use. Both runs retained `model_use_verified:false` despite explicit route declarations.

### Checkout preservation

For each clean A, clean B, and dirty A acceptance/scope pair, a Python snapshot before acceptance, after acceptance, and after scope compared the set of regular files and each SHA-256, the worktree `.git` link-file bytes, the actual index SHA-256 and `st_mtime_ns`, and worktree Git HEAD file bytes. All six comparisons were equal. The deliberate dirty files and staged index entries remained intact. Example snapshot data and helper code are retained in `$T/snapshots.jsonl` and `$T/evaluate.py`. The extra relaxed-clean scope probe reported the same dirtiness; it was not included in those six paired snapshot comparisons.

Behavior matched documentation. Important evaluator source locations: `.agents/skills/ruach-harness-eval/references/config.md:42`, `:44`, `:70`, `:78`; `scripts/acceptance.ts:192` (per-check status/fingerprint), `:197` (dirty failure); `scripts/scope-check.ts:61` (scope paths), `:66` (clean requirement); `scripts/common.ts:67` (Git probes with optional locks disabled).

## Task 3: Herdr

Temporary repo `$T/launch-repo` has `.agents/agents/coordinator.md`, `implementer.md`, and `reviewer.md`. Each contains a heading for its role and the instruction `Follow the supplied assignment within the ROLE role.` I wrote the documented provisional root YAML as follows:

`models.yaml`:

```yaml
models:
  planner:
    kind: claude
    model: claude-opus-4-6
    efforts: [high]
  builder:
    kind: codex
    model: gpt-6.1-sol
    efforts: [high]
```

`routing.yaml`:

```yaml
routes:
  plan:
    model: planner
    effort: high
  build:
    model: builder
    effort: high
```

`roles.yaml`:

```yaml
roles:
  coordinator:
    preferred_route: plan
  implementer:
    preferred_route: build
  reviewer:
    preferred_route: build
```

I ran ordinary `resolve` and `start --dry-run` for each selection. I then ran `resolve --offline` for coordinator and reviewer. Broken-reference test changed only the unselected `build.model` to `missing-builder` while selecting coordinator's valid `plan` route; both commands returned exit 2, `missing_model`, field `routing.yaml:routes.build`, verifying entire-graph validation. Valid routing was restored before native socket-enabled probes.

| Selection | Restricted resolve / dry-run | Socket-enabled resolve / dry-run | Expected behavior |
| --- | --- | --- | --- |
| Coordinator, role only | 3 / 3, `unreachable_herdr` | 0 / 0, route `plan`, Claude, high | Policy follows repository YAML; no hardcoded coordinator harness choice |
| Reviewer, role only | 3 / 3, `unreachable_herdr` | 0 / 0, route `build`, Codex, high | Reviewer uses supplied role source and YAML preference |
| Explicit Codex implementer | 3 / 3, `unreachable_herdr` | 0 / 0, `provenance:explicit CLI` | Direct kind/model/effort overrides route selection |
| dsh | 3 / 3, `missing_cli` | Not repeated | Absent executable; fails before mutation |
| pi | 3 / 3, `missing_cli` | Not repeated | Absent executable; fails before mutation |
| omp | 3 / 3, `missing_cli` | 3 / 3, `missing_cli` | This process cannot find OMP; no guessed flags or fallback |
| agy | 3 / 3, `unreachable_herdr` | 3 / 3, `unsupported_adapter` | Native additive role and workflow exclusion remain unverified |
| Broken YAML reference | 2 / 2, `missing_model` | Not needed | Invalid graph fails before executable/context probes |

Coordinator/reviewer offline resolution both returned exit 0, `action:resolved-offline`, correct route/kind/model/effort and role hash, `launchable:false`, `argv:[]`, `offline_unverified`, and `submission_state:not-submitted`. Thus exit 0 may mean selection resolved successfully with an explicit non-launchable limitation.

Native successful results returned `coverage:live-capable`, `launchable:true`, empty diagnostics, `direction:down` for the current caller pane, and `submission_state:not-submitted`. Resolve used `action:resolved`; dry-run used `action:dry-run`. Claude argv:

```text
--model claude-opus-4-6
--append-system-prompt-file /tmp/skills-forward-iqDHcr/launch-repo/.agents/agents/coordinator.md
--effort high
--settings <private-temp>/settings.json
--add-dir <private-temp>
```

Claude reported two planned temporary operations (workflow settings overlay and canonical skill symlinks) but no materialized launch files. Codex reviewer/implementer argv:

```text
--model gpt-6.1-sol
--cd /tmp/skills-forward-iqDHcr/launch-repo
-c developer_instructions=<redacted>
-c model_reasoning_effort="high"
-c skills.config=<preserved + workflow overrides>
```

Codex reported no temporary operations. In all failures before launch, JSON retained `phase:preflight`, `launchable:false`, no pane or temporary directory, and `submission_state:not-submitted`. Sandbox errors can mask a later unsupported-adapter diagnosis, as Agy demonstrated.

Initial restricted probes left the temp repository file/hash snapshot unchanged, including its Git files. Broken-config probes also left the deliberately broken snapshot unchanged. After restoring valid YAML and running socket-enabled native preparation, `GIT_OPTIONAL_LOCKS=0 git -C /tmp/skills-forward-iqDHcr/launch-repo status --short` exited 0 with no output. No native live-start behavior was tested. The parsed code branch at `.agents/skills/ruach-herdr/scripts/worker.ts:81` returns prepared JSON for resolve/dry-run; materialization and pane split are in the other branch at `:84` and `:91`.

Herdr sources: `SKILL.md:15` (examples), `:30` (context wording), `:34` (offline); `references/routing.md` (provisional shape and full graph); `references/adapters.md` (native limits); `scripts/worker.ts:61` through `:81` (shared preflight); `scripts/native-codex.ts:5` (existing daemon query). Neither generated argv nor declared models establish a paid session, model entitlement, or native instruction acceptance.

## Exact command ledger

The following ledger is generated from recorded subprocess argv, cwd, exit status, and abbreviated observations. These are shell-quoted renderings of exact argv, not shell interpolation used by the tool. Paths are intentionally absolute. All commands below used cwd `/tmp/skills-forward-iqDHcr` unless another cwd is named. Setup Git commands changed only the new temp repositories; their author configuration is repo-local. Skill install and test commands are recorded separately above.

1. **corpus docs/mailbox/README.md** — exit 1; ok=false; HEADER_INVALID /header.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-fwd/docs/mailbox/README.md
   ```

2. **corpus docs/mailbox/claude-architect-injection/architect.md** — exit 1; ok=false; HEADER_INVALID /header.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-fwd/docs/mailbox/claude-architect-injection/architect.md
   ```

3. **corpus docs/mailbox/codex-architect-injection/architect.md** — exit 1; ok=false; HEADER_INVALID /header.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-fwd/docs/mailbox/codex-architect-injection/architect.md
   ```

4. **corpus docs/mailbox/orchestrator-comparison/assignment.md** — exit 1; ok=false; HEADER_INVALID /header.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-fwd/docs/mailbox/orchestrator-comparison/assignment.md
   ```

5. **corpus docs/mailbox/orchestrator-comparison/results.md** — exit 1; ok=false; HEADER_INVALID /header.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-fwd/docs/mailbox/orchestrator-comparison/results.md
   ```

6. **corpus docs/mailbox/orchestrator-four-harness/assignment.md** — exit 1; ok=false; HEADER_INVALID /header.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-fwd/docs/mailbox/orchestrator-four-harness/assignment.md
   ```

7. **corpus docs/mailbox/orchestrator-four-harness/observer-source.md** — exit 1; ok=false; HEADER_INVALID /header.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-fwd/docs/mailbox/orchestrator-four-harness/observer-source.md
   ```

8. **corpus docs/mailbox/orchestrator-four-harness/results.md** — exit 1; ok=false; HEADER_INVALID /header.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-fwd/docs/mailbox/orchestrator-four-harness/results.md
   ```

9. **corpus docs/mailbox/p01-browser-harness/coordinator.md** — exit 0; ok=true; resolved 8 revisions.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-fwd/docs/mailbox/p01-browser-harness/coordinator.md
   ```

10. **corpus docs/mailbox/p01-browser-harness/delivery.md** — exit 0; ok=true; resolved 9 revisions.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-fwd/docs/mailbox/p01-browser-harness/delivery.md
   ```

11. **corpus docs/mailbox/p01-browser-harness/implementer.md** — exit 0; ok=true; resolved 3 revisions.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-fwd/docs/mailbox/p01-browser-harness/implementer.md
   ```

12. **corpus docs/mailbox/p01-browser-harness/reviewer.md** — exit 0; ok=true; resolved 6 revisions.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-fwd/docs/mailbox/p01-browser-harness/reviewer.md
   ```

13. **corpus docs/mailbox/p01-browser-harness/scout.md** — exit 0; ok=true.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-fwd/docs/mailbox/p01-browser-harness/scout.md
   ```

14. **corpus docs/mailbox/p01-browser-harness/verification.md** — exit 0; ok=true; resolved 1 revisions.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-fwd/docs/mailbox/p01-browser-harness/verification.md
   ```

15. **corpus docs/mailbox/versioned-agent-skills/architect.md** — exit 0; ok=true; resolved 1 revisions.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-fwd/docs/mailbox/versioned-agent-skills/architect.md
   ```

16. **corpus docs/mailbox/versioned-agent-skills/implementer-eval.md** — exit 0; ok=true; resolved 3 revisions.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-fwd/docs/mailbox/versioned-agent-skills/implementer-eval.md
   ```

17. **corpus docs/mailbox/versioned-agent-skills/implementer-handoff.md** — exit 0; ok=true; resolved 3 revisions.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-fwd/docs/mailbox/versioned-agent-skills/implementer-handoff.md
   ```

18. **corpus docs/mailbox/versioned-agent-skills/implementer-herdr.md** — exit 0; ok=true; resolved 4 revisions.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-fwd/docs/mailbox/versioned-agent-skills/implementer-herdr.md
   ```

19. **setup: git init** — exit 0; Initialized empty Git repository in /tmp/skills-forward-iqDHcr/handoff-repo/.git/.

   ```sh
   git -C /tmp/skills-forward-iqDHcr/handoff-repo init -b main
   ```

20. **setup: git config** — exit 0; no stdout.

   ```sh
   git -C /tmp/skills-forward-iqDHcr/handoff-repo config user.name 'Forward Scout'
   ```

21. **setup: git config** — exit 0; no stdout.

   ```sh
   git -C /tmp/skills-forward-iqDHcr/handoff-repo config user.email forward-scout@example.invalid
   ```

22. **setup: git add** — exit 0; no stdout.

   ```sh
   git -C /tmp/skills-forward-iqDHcr/handoff-repo add .
   ```

23. **setup: git commit** — exit 0; [main (root-commit) 7ee9b0f] Implement toy result.

   ```sh
   git -C /tmp/skills-forward-iqDHcr/handoff-repo commit -m 'Implement toy result'
   ```

24. **setup: git rev-parse** — exit 0; 7ee9b0f3eb8aad554e65557ebc24a0e883bb6559.

   ```sh
   git -C /tmp/skills-forward-iqDHcr/handoff-repo rev-parse HEAD
   ```

25. **setup: git add** — exit 0; no stdout.

   ```sh
   git -C /tmp/skills-forward-iqDHcr/handoff-repo add .
   ```

26. **setup: git commit** — exit 0; [main f64285d] Record evidence only.

   ```sh
   git -C /tmp/skills-forward-iqDHcr/handoff-repo commit -m 'Record evidence only'
   ```

27. **setup: git rev-parse** — exit 0; f64285d1091f618d80bc1162bf904e71594ebaeb.

   ```sh
   git -C /tmp/skills-forward-iqDHcr/handoff-repo rev-parse HEAD
   ```

28. **handoff minimal cwd=handoff-repo explicit=False** — exit 0; ok=true.

   Cwd: `/tmp/skills-forward-iqDHcr/handoff-repo`.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /tmp/skills-forward-iqDHcr/handoff-repo/minimal.md
   ```

29. **handoff minimal cwd=handoff-repo explicit=True** — exit 0; ok=true.

   Cwd: `/tmp/skills-forward-iqDHcr/handoff-repo`.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /tmp/skills-forward-iqDHcr/handoff-repo/minimal.md --repo /tmp/skills-forward-iqDHcr/handoff-repo
   ```

30. **handoff minimal cwd=unrelated explicit=False** — exit 0; ok=true.

   Cwd: `/tmp/skills-forward-iqDHcr/unrelated`.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /tmp/skills-forward-iqDHcr/handoff-repo/minimal.md
   ```

31. **handoff minimal cwd=unrelated explicit=True** — exit 0; ok=true.

   Cwd: `/tmp/skills-forward-iqDHcr/unrelated`.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /tmp/skills-forward-iqDHcr/handoff-repo/minimal.md --repo /tmp/skills-forward-iqDHcr/handoff-repo
   ```

32. **handoff revision cwd=handoff-repo explicit=False** — exit 0; ok=true; resolved 2 revisions.

   Cwd: `/tmp/skills-forward-iqDHcr/handoff-repo`.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /tmp/skills-forward-iqDHcr/handoff-repo/revision.md
   ```

33. **handoff revision cwd=handoff-repo explicit=True** — exit 0; ok=true; resolved 2 revisions.

   Cwd: `/tmp/skills-forward-iqDHcr/handoff-repo`.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /tmp/skills-forward-iqDHcr/handoff-repo/revision.md --repo /tmp/skills-forward-iqDHcr/handoff-repo
   ```

34. **handoff revision cwd=unrelated explicit=False** — exit 0; ok=true; resolved 2 revisions.

   Cwd: `/tmp/skills-forward-iqDHcr/unrelated`.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /tmp/skills-forward-iqDHcr/handoff-repo/revision.md
   ```

35. **handoff revision cwd=unrelated explicit=True** — exit 0; ok=true; resolved 2 revisions.

   Cwd: `/tmp/skills-forward-iqDHcr/unrelated`.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /tmp/skills-forward-iqDHcr/handoff-repo/revision.md --repo /tmp/skills-forward-iqDHcr/handoff-repo
   ```

36. **handoff mistakes cwd=handoff-repo explicit=False** — exit 1; ok=false; FIELD_REQUIRED /blockers, FIELD_ENUM /status, FIELD_INVALID /outcome, FIELD_TYPE /artifacts/0.

   Cwd: `/tmp/skills-forward-iqDHcr/handoff-repo`.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /tmp/skills-forward-iqDHcr/handoff-repo/mistakes.md
   ```

37. **handoff mistakes cwd=handoff-repo explicit=True** — exit 1; ok=false; FIELD_REQUIRED /blockers, FIELD_ENUM /status, FIELD_INVALID /outcome, FIELD_TYPE /artifacts/0.

   Cwd: `/tmp/skills-forward-iqDHcr/handoff-repo`.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /tmp/skills-forward-iqDHcr/handoff-repo/mistakes.md --repo /tmp/skills-forward-iqDHcr/handoff-repo
   ```

38. **handoff mistakes cwd=unrelated explicit=False** — exit 1; ok=false; FIELD_REQUIRED /blockers, FIELD_ENUM /status, FIELD_INVALID /outcome, FIELD_TYPE /artifacts/0.

   Cwd: `/tmp/skills-forward-iqDHcr/unrelated`.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /tmp/skills-forward-iqDHcr/handoff-repo/mistakes.md
   ```

39. **handoff mistakes cwd=unrelated explicit=True** — exit 1; ok=false; FIELD_REQUIRED /blockers, FIELD_ENUM /status, FIELD_INVALID /outcome, FIELD_TYPE /artifacts/0.

   Cwd: `/tmp/skills-forward-iqDHcr/unrelated`.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /tmp/skills-forward-iqDHcr/handoff-repo/mistakes.md --repo /tmp/skills-forward-iqDHcr/handoff-repo
   ```

40. **setup: git init** — exit 0; Initialized empty Git repository in /tmp/skills-forward-iqDHcr/toy/.git/.

   ```sh
   git -C /tmp/skills-forward-iqDHcr/toy init -b main
   ```

41. **setup: git config** — exit 0; no stdout.

   ```sh
   git -C /tmp/skills-forward-iqDHcr/toy config user.name 'Forward Scout'
   ```

42. **setup: git config** — exit 0; no stdout.

   ```sh
   git -C /tmp/skills-forward-iqDHcr/toy config user.email forward-scout@example.invalid
   ```

43. **setup: git add** — exit 0; no stdout.

   ```sh
   git -C /tmp/skills-forward-iqDHcr/toy add .
   ```

44. **setup: git commit** — exit 0; [main (root-commit) cad3a84] Baseline toy task.

   ```sh
   git -C /tmp/skills-forward-iqDHcr/toy commit -m 'Baseline toy task'
   ```

45. **setup: git rev-parse** — exit 0; cad3a8472a7a645034037be44da7812dab7d1065.

   ```sh
   git -C /tmp/skills-forward-iqDHcr/toy rev-parse HEAD
   ```

46. **setup: git worktree** — exit 0; HEAD is now at cad3a84 Baseline toy task.

   ```sh
   git -C /tmp/skills-forward-iqDHcr/toy worktree add -b candidate-a /tmp/skills-forward-iqDHcr/candidate-a cad3a8472a7a645034037be44da7812dab7d1065
   ```

47. **setup: git worktree** — exit 0; HEAD is now at cad3a84 Baseline toy task.

   ```sh
   git -C /tmp/skills-forward-iqDHcr/toy worktree add -b candidate-b /tmp/skills-forward-iqDHcr/candidate-b cad3a8472a7a645034037be44da7812dab7d1065
   ```

48. **setup: git add** — exit 0; no stdout.

   ```sh
   git -C /tmp/skills-forward-iqDHcr/candidate-a add .
   ```

49. **setup: git commit** — exit 0; [candidate-a feae060] Fix signed addition.

   ```sh
   git -C /tmp/skills-forward-iqDHcr/candidate-a commit -m 'Fix signed addition'
   ```

50. **setup: git rev-parse** — exit 0; feae06095aec7f3f3516ae0ca39a6f396cd21cff.

   ```sh
   git -C /tmp/skills-forward-iqDHcr/candidate-a rev-parse HEAD
   ```

51. **setup: git add** — exit 0; no stdout.

   ```sh
   git -C /tmp/skills-forward-iqDHcr/candidate-b add .
   ```

52. **setup: git commit** — exit 0; [candidate-b dc83f08] Incorrect addition plus unrelated file.

   ```sh
   git -C /tmp/skills-forward-iqDHcr/candidate-b commit -m 'Incorrect addition plus unrelated file'
   ```

53. **setup: git rev-parse** — exit 0; dc83f0800ae001d2fb337211960f2eaaedec12d5.

   ```sh
   git -C /tmp/skills-forward-iqDHcr/candidate-b rev-parse HEAD
   ```

54. **acceptance a-clean** — exit 0; ok=true; checks=signed-add:passed,copied-add:passed.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-harness-eval/scripts/acceptance.ts --config /tmp/skills-forward-iqDHcr/evaluation.json --run a --output /tmp/skills-forward-iqDHcr/a-clean-acceptance.json
   ```

55. **scope a-clean** — exit 0; ok=true.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-harness-eval/scripts/scope-check.ts --repo /tmp/skills-forward-iqDHcr/candidate-a --baseline cad3a8472a7a645034037be44da7812dab7d1065 --candidate candidate-a --allow /tmp/skills-forward-iqDHcr/scope.json --output /tmp/skills-forward-iqDHcr/a-clean-scope.json
   ```

56. **acceptance b-clean** — exit 1; ok=false; checks=signed-add:failed,copied-add:failed.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-harness-eval/scripts/acceptance.ts --config /tmp/skills-forward-iqDHcr/evaluation.json --run b --output /tmp/skills-forward-iqDHcr/b-clean-acceptance.json
   ```

57. **scope b-clean** — exit 1; ok=false; unexpected_paths paths; unexpected=unrelated.txt.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-harness-eval/scripts/scope-check.ts --repo /tmp/skills-forward-iqDHcr/candidate-b --baseline cad3a8472a7a645034037be44da7812dab7d1065 --candidate candidate-b --allow /tmp/skills-forward-iqDHcr/scope.json --output /tmp/skills-forward-iqDHcr/b-clean-scope.json
   ```

58. **setup: git add** — exit 0; no stdout.

   ```sh
   git -C /tmp/skills-forward-iqDHcr/candidate-a add README.md
   ```

59. **acceptance a-dirty** — exit 1; ok=false; checks=signed-add:passed,copied-add:passed; dirty_candidate dirty.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-harness-eval/scripts/acceptance.ts --config /tmp/skills-forward-iqDHcr/evaluation.json --run a --output /tmp/skills-forward-iqDHcr/a-dirty-acceptance.json
   ```

60. **scope a-dirty** — exit 1; ok=false; unexpected_paths paths, dirty_worktree require_clean; unexpected=README.md,loose.txt.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-harness-eval/scripts/scope-check.ts --repo /tmp/skills-forward-iqDHcr/candidate-a --baseline cad3a8472a7a645034037be44da7812dab7d1065 --candidate candidate-a --allow /tmp/skills-forward-iqDHcr/scope.json --output /tmp/skills-forward-iqDHcr/a-dirty-scope.json
   ```

61. **scope a-dirty require_clean=false** — exit 1; ok=false; unexpected_paths paths; unexpected=README.md,loose.txt.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-harness-eval/scripts/scope-check.ts --repo /tmp/skills-forward-iqDHcr/candidate-a --baseline cad3a8472a7a645034037be44da7812dab7d1065 --candidate candidate-a --allow /tmp/skills-forward-iqDHcr/scope-dirty-allowed.json --output /tmp/skills-forward-iqDHcr/a-dirty-relaxed-scope.json
   ```

62. **setup: git init** — exit 0; Initialized empty Git repository in /tmp/skills-forward-iqDHcr/launch-repo/.git/.

   ```sh
   git -C /tmp/skills-forward-iqDHcr/launch-repo init -b main
   ```

63. **setup: git config** — exit 0; no stdout.

   ```sh
   git -C /tmp/skills-forward-iqDHcr/launch-repo config user.name 'Forward Scout'
   ```

64. **setup: git config** — exit 0; no stdout.

   ```sh
   git -C /tmp/skills-forward-iqDHcr/launch-repo config user.email forward-scout@example.invalid
   ```

65. **setup: git add** — exit 0; no stdout.

   ```sh
   git -C /tmp/skills-forward-iqDHcr/launch-repo add .
   ```

66. **setup: git commit** — exit 0; [main (root-commit) 294e5a8] Toy canonical roles and provisional routing.

   ```sh
   git -C /tmp/skills-forward-iqDHcr/launch-repo commit -m 'Toy canonical roles and provisional routing'
   ```

67. **setup: git rev-parse** — exit 0; 294e5a82175a21d70fc972177b2cf2c8a997fc02.

   ```sh
   git -C /tmp/skills-forward-iqDHcr/launch-repo rev-parse HEAD
   ```

68. **herdr coordinator resolve** — exit 3; ok=false; unreachable_herdr herdr.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-herdr/scripts/worker.ts resolve --name forward-coordinator --cwd /tmp/skills-forward-iqDHcr/launch-repo --role coordinator
   ```

69. **herdr coordinator start** — exit 3; ok=false; unreachable_herdr herdr.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-herdr/scripts/worker.ts start --dry-run --name forward-coordinator --cwd /tmp/skills-forward-iqDHcr/launch-repo --role coordinator
   ```

70. **herdr reviewer resolve** — exit 3; ok=false; unreachable_herdr herdr.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-herdr/scripts/worker.ts resolve --name forward-reviewer --cwd /tmp/skills-forward-iqDHcr/launch-repo --role reviewer
   ```

71. **herdr reviewer start** — exit 3; ok=false; unreachable_herdr herdr.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-herdr/scripts/worker.ts start --dry-run --name forward-reviewer --cwd /tmp/skills-forward-iqDHcr/launch-repo --role reviewer
   ```

72. **herdr explicit-codex resolve** — exit 3; ok=false; unreachable_herdr herdr.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-herdr/scripts/worker.ts resolve --name forward-explicit-codex --cwd /tmp/skills-forward-iqDHcr/launch-repo --role implementer --kind codex --model gpt-6.1-sol --effort high
   ```

73. **herdr explicit-codex start** — exit 3; ok=false; unreachable_herdr herdr.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-herdr/scripts/worker.ts start --dry-run --name forward-explicit-codex --cwd /tmp/skills-forward-iqDHcr/launch-repo --role implementer --kind codex --model gpt-6.1-sol --effort high
   ```

74. **herdr dsh resolve** — exit 3; ok=false; missing_cli dsh.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-herdr/scripts/worker.ts resolve --name forward-dsh --cwd /tmp/skills-forward-iqDHcr/launch-repo --role implementer --kind dsh --model toy-native-model --effort high
   ```

75. **herdr dsh start** — exit 3; ok=false; missing_cli dsh.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-herdr/scripts/worker.ts start --dry-run --name forward-dsh --cwd /tmp/skills-forward-iqDHcr/launch-repo --role implementer --kind dsh --model toy-native-model --effort high
   ```

76. **herdr pi resolve** — exit 3; ok=false; missing_cli pi.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-herdr/scripts/worker.ts resolve --name forward-pi --cwd /tmp/skills-forward-iqDHcr/launch-repo --role implementer --kind pi --model toy-native-model --effort high
   ```

77. **herdr pi start** — exit 3; ok=false; missing_cli pi.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-herdr/scripts/worker.ts start --dry-run --name forward-pi --cwd /tmp/skills-forward-iqDHcr/launch-repo --role implementer --kind pi --model toy-native-model --effort high
   ```

78. **herdr omp resolve** — exit 3; ok=false; missing_cli omp.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-herdr/scripts/worker.ts resolve --name forward-omp --cwd /tmp/skills-forward-iqDHcr/launch-repo --role implementer --kind omp --model toy-native-model --effort high
   ```

79. **herdr omp start** — exit 3; ok=false; missing_cli omp.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-herdr/scripts/worker.ts start --dry-run --name forward-omp --cwd /tmp/skills-forward-iqDHcr/launch-repo --role implementer --kind omp --model toy-native-model --effort high
   ```

80. **herdr agy resolve** — exit 3; ok=false; unreachable_herdr herdr.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-herdr/scripts/worker.ts resolve --name forward-agy --cwd /tmp/skills-forward-iqDHcr/launch-repo --role implementer --kind agy --model toy-native-model --effort high
   ```

81. **herdr agy start** — exit 3; ok=false; unreachable_herdr herdr.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-herdr/scripts/worker.ts start --dry-run --name forward-agy --cwd /tmp/skills-forward-iqDHcr/launch-repo --role implementer --kind agy --model toy-native-model --effort high
   ```

82. **herdr coordinator offline** — exit 0; ok=true; offline_unverified offline; resolved-offline; launchable=false.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-herdr/scripts/worker.ts resolve --offline --name forward-offline-coordinator --role coordinator --cwd /tmp/skills-forward-iqDHcr/launch-repo
   ```

83. **herdr reviewer offline** — exit 0; ok=true; offline_unverified offline; resolved-offline; launchable=false.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-herdr/scripts/worker.ts resolve --offline --name forward-offline-reviewer --role reviewer --cwd /tmp/skills-forward-iqDHcr/launch-repo
   ```

84. **herdr broken resolve** — exit 2; ok=false; missing_model routing.yaml:routes.build.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-herdr/scripts/worker.ts resolve --name forward-broken --role coordinator --cwd /tmp/skills-forward-iqDHcr/launch-repo
   ```

85. **herdr broken start** — exit 2; ok=false; missing_model routing.yaml:routes.build.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-herdr/scripts/worker.ts start --dry-run --name forward-broken --role coordinator --cwd /tmp/skills-forward-iqDHcr/launch-repo
   ```

86. **herdr unsandboxed coordinator resolve** — exit 0; ok=true; resolved; launchable=true.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-herdr/scripts/worker.ts resolve --name forward-coordinator --cwd /tmp/skills-forward-iqDHcr/launch-repo --role coordinator
   ```

87. **herdr unsandboxed coordinator start** — exit 0; ok=true; dry-run; launchable=true.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-herdr/scripts/worker.ts start --dry-run --name forward-coordinator --cwd /tmp/skills-forward-iqDHcr/launch-repo --role coordinator
   ```

88. **herdr unsandboxed reviewer resolve** — exit 0; ok=true; resolved; launchable=true.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-herdr/scripts/worker.ts resolve --name forward-reviewer --cwd /tmp/skills-forward-iqDHcr/launch-repo --role reviewer
   ```

89. **herdr unsandboxed reviewer start** — exit 0; ok=true; dry-run; launchable=true.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-herdr/scripts/worker.ts start --dry-run --name forward-reviewer --cwd /tmp/skills-forward-iqDHcr/launch-repo --role reviewer
   ```

90. **herdr unsandboxed explicit-codex resolve** — exit 0; ok=true; resolved; launchable=true.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-herdr/scripts/worker.ts resolve --name forward-explicit-codex --cwd /tmp/skills-forward-iqDHcr/launch-repo --role implementer --kind codex --model gpt-6.1-sol --effort high
   ```

91. **herdr unsandboxed explicit-codex start** — exit 0; ok=true; dry-run; launchable=true.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-herdr/scripts/worker.ts start --dry-run --name forward-explicit-codex --cwd /tmp/skills-forward-iqDHcr/launch-repo --role implementer --kind codex --model gpt-6.1-sol --effort high
   ```

92. **herdr unsandboxed agy resolve** — exit 3; ok=false; unsupported_adapter agy.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-herdr/scripts/worker.ts resolve --name forward-agy --cwd /tmp/skills-forward-iqDHcr/launch-repo --role implementer --kind agy --model toy-native-model --effort high
   ```

93. **herdr unsandboxed agy start** — exit 3; ok=false; unsupported_adapter agy.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-herdr/scripts/worker.ts start --dry-run --name forward-agy --cwd /tmp/skills-forward-iqDHcr/launch-repo --role implementer --kind agy --model toy-native-model --effort high
   ```

94. **herdr unsandboxed omp resolve** — exit 3; ok=false; missing_cli omp.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-herdr/scripts/worker.ts resolve --name forward-omp --cwd /tmp/skills-forward-iqDHcr/launch-repo --role implementer --kind omp --model toy-native-model --effort high
   ```

95. **herdr unsandboxed omp start** — exit 3; ok=false; missing_cli omp.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-herdr/scripts/worker.ts start --dry-run --name forward-omp --cwd /tmp/skills-forward-iqDHcr/launch-repo --role implementer --kind omp --model toy-native-model --effort high
   ```

96. **verify handoff tested commit** — exit 0; observable result.

   ```sh
   git -C /tmp/skills-forward-iqDHcr/handoff-repo show 7ee9b0f3eb8aad554e65557ebc24a0e883bb6559:worker.txt
   ```

97. **handoff verified revision cwd=handoff-repo explicit=False** — exit 0; ok=true; resolved 2 revisions.

   Cwd: `/tmp/skills-forward-iqDHcr/handoff-repo`.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /tmp/skills-forward-iqDHcr/handoff-repo/revision.md
   ```

98. **handoff verified revision cwd=handoff-repo explicit=True** — exit 0; ok=true; resolved 2 revisions.

   Cwd: `/tmp/skills-forward-iqDHcr/handoff-repo`.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /tmp/skills-forward-iqDHcr/handoff-repo/revision.md --repo /tmp/skills-forward-iqDHcr/handoff-repo
   ```

99. **handoff verified revision cwd=unrelated explicit=False** — exit 0; ok=true; resolved 2 revisions.

   Cwd: `/tmp/skills-forward-iqDHcr/unrelated`.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /tmp/skills-forward-iqDHcr/handoff-repo/revision.md
   ```

100. **handoff verified revision cwd=unrelated explicit=True** — exit 0; ok=true; resolved 2 revisions.

   Cwd: `/tmp/skills-forward-iqDHcr/unrelated`.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /tmp/skills-forward-iqDHcr/handoff-repo/revision.md --repo /tmp/skills-forward-iqDHcr/handoff-repo
   ```

101. **handoff corrected schema missing revision cwd=handoff-repo explicit=False** — exit 1; ok=false; REVISION_MISSING /tested_revision.

   Cwd: `/tmp/skills-forward-iqDHcr/handoff-repo`.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /tmp/skills-forward-iqDHcr/handoff-repo/mistakes.md
   ```

102. **handoff corrected schema missing revision cwd=handoff-repo explicit=True** — exit 1; ok=false; REVISION_MISSING /tested_revision.

   Cwd: `/tmp/skills-forward-iqDHcr/handoff-repo`.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /tmp/skills-forward-iqDHcr/handoff-repo/mistakes.md --repo /tmp/skills-forward-iqDHcr/handoff-repo
   ```

103. **handoff corrected schema missing revision cwd=unrelated explicit=False** — exit 1; ok=false; REVISION_MISSING /tested_revision.

   Cwd: `/tmp/skills-forward-iqDHcr/unrelated`.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /tmp/skills-forward-iqDHcr/handoff-repo/mistakes.md
   ```

104. **handoff corrected schema missing revision cwd=unrelated explicit=True** — exit 1; ok=false; REVISION_MISSING /tested_revision.

   Cwd: `/tmp/skills-forward-iqDHcr/unrelated`.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /tmp/skills-forward-iqDHcr/handoff-repo/mistakes.md --repo /tmp/skills-forward-iqDHcr/handoff-repo
   ```

105. **handoff final minimal cwd=handoff-repo explicit=False** — exit 0; ok=true.

   Cwd: `/tmp/skills-forward-iqDHcr/handoff-repo`.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /tmp/skills-forward-iqDHcr/handoff-repo/minimal.md
   ```

106. **handoff final minimal cwd=handoff-repo explicit=True** — exit 0; ok=true.

   Cwd: `/tmp/skills-forward-iqDHcr/handoff-repo`.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /tmp/skills-forward-iqDHcr/handoff-repo/minimal.md --repo /tmp/skills-forward-iqDHcr/handoff-repo
   ```

107. **handoff final minimal cwd=unrelated explicit=False** — exit 0; ok=true.

   Cwd: `/tmp/skills-forward-iqDHcr/unrelated`.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /tmp/skills-forward-iqDHcr/handoff-repo/minimal.md
   ```

108. **handoff final minimal cwd=unrelated explicit=True** — exit 0; ok=true.

   Cwd: `/tmp/skills-forward-iqDHcr/unrelated`.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /tmp/skills-forward-iqDHcr/handoff-repo/minimal.md --repo /tmp/skills-forward-iqDHcr/handoff-repo
   ```

109. **handoff final revision cwd=handoff-repo explicit=False** — exit 0; ok=true; resolved 2 revisions.

   Cwd: `/tmp/skills-forward-iqDHcr/handoff-repo`.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /tmp/skills-forward-iqDHcr/handoff-repo/revision.md
   ```

110. **handoff final revision cwd=handoff-repo explicit=True** — exit 0; ok=true; resolved 2 revisions.

   Cwd: `/tmp/skills-forward-iqDHcr/handoff-repo`.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /tmp/skills-forward-iqDHcr/handoff-repo/revision.md --repo /tmp/skills-forward-iqDHcr/handoff-repo
   ```

111. **handoff final revision cwd=unrelated explicit=False** — exit 0; ok=true; resolved 2 revisions.

   Cwd: `/tmp/skills-forward-iqDHcr/unrelated`.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /tmp/skills-forward-iqDHcr/handoff-repo/revision.md
   ```

112. **handoff final revision cwd=unrelated explicit=True** — exit 0; ok=true; resolved 2 revisions.

   Cwd: `/tmp/skills-forward-iqDHcr/unrelated`.

   ```sh
   /home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts /tmp/skills-forward-iqDHcr/handoff-repo/revision.md --repo /tmp/skills-forward-iqDHcr/handoff-repo
   ```

## Evidence retention and limits

Raw exact argv/stdout/stderr: `/tmp/skills-forward-iqDHcr/commands.jsonl`. Independent scripts: `runner.py`, `handoff.py`, `handoff-followup.py`, `evaluate.py`, `herdr.py`, `herdr-readonly.py`. Corpus summary: `corpus.json`. Evaluation result JSON files, config files, fixture repositories, snapshot records, and the successful handoff test rerun log remain there for local inspection. These are scratch, not durable artifacts promised to survive temp cleanup. This report preserves the required results, inputs, commands and reproduction details without requiring those scratch files.

No main-checkout or other-worktree source was changed. The handoff validator certifies report format and existing revision references only. No reviewer was run. Broader assertions about real native skill visibility, startup lifecycle, post-submission recovery, accounts or models remain outside this dry-run assignment. Herdr's full suite has only sandbox setup-failure evidence here, while native read-only preparation was successfully exercised with existing sockets.

## Report validation and delivery

Before the local report commit, the following command exited 0 and returned `schema_version:1`, `ok:true`, empty diagnostics, and a `/tested_revision` record resolving to `4e8d7d30fb57a033b5c4378aeec2fae7aaf209bd`:

```sh
/home/metatron/.bun/bin/bun /tmp/skills-forward-iqDHcr/ruach-handoff/scripts/validate.ts docs/mailbox/versioned-agent-skills/scout-forward-test.md --repo /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-fwd
```

`git diff --check` exited 0. Before staging, `git status --short` listed only this new report; branch was `versioned-agent-skills-fwd`. The local delivery commit is restricted to this report. Its creating SHA is returned in the terminal handoff, rather than predicted inside the file. The inspected/tested skill revision remains the existing pre-report commit.
