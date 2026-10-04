---
task: A-impl-agent-routing
status: complete
outcome: Portable model routing, validated JSON resolution, and Herdr launch integration implemented on routing-setup; 16 boundary tests pass. Independent review and live launches remain pending.
artifacts:
  - docs/mailbox/agent-routing/implementer.md
  - .agents/models.yaml
  - .agents/routing.yaml
  - .agents/roles.yaml
  - scripts/agent-routing.py
  - scripts/test-agent-routing.py
  - docs/exploitation/agent-routing.md
  - routing-setup
verification:
  - "just test-agent-routing -v: exit 0, 16 tests pass at candidate/tested revision"
  - "Resolver probes, shell/Python syntax, CLI help/version inspection, existing command checks, whitespace and protected-scope checks: passed"
discoveries:
  - "Codex official reference describes skill-folder paths; assigned bootstrap uses SKILL.md paths. Assigned convention retained; live discovery requires Coordinator evidence."
  - "Existing doctor reports unavailable Bun and inaccessible Docker in this sandbox, and retains a stale POC scaffold message outside this slice."
blockers: []
candidate_revision: 23decc2acef5793777c408b908fc69d3e55aee7d
tested_revision: 23decc2acef5793777c408b908fc69d3e55aee7d
---

Author: Implementer. Assignment: `.agents/scratch/routing-p02/assignments/A-implementer.md`. Inspected baseline/master: `c6083e892285b43c297c742ff28553ae3e2e7310`. Workspace: main checkout `/opt/dev/tehom-brainlab`, local branch `routing-setup`; no worktree, merge, push or deployment. The following documentation-only commit adds this report and audit evidence and corrects a dated-heading link fragment; executable/configuration/test content remains the tested candidate above. Review and delivery are not claimed.

## Change and schema

[Agent schema](../../../.agents/README.md#routing-schema-and-commands) and [launch instructions](../../exploitation/agent-routing.md) document prerequisites and public commands. Model entries require `harness` and `native_model`; route entries require a catalog `model` key and `effort: high`; role entries require `preferred` with optional `alternatives`. Canonical role files follow `.agents/agents/<role>.md`. Unknown fields/keys/references, duplicates, missing files, unsupported harnesses/effort and disallowed overrides fail before Herdr.

The catalog contains exactly GPT 6.1 Sol and Claude Opus 5.5 with the assigned native IDs. Route labels end in `-high`; API model IDs are read only from the model catalog. Coordinator is Claude-only, Architect allows GPT explicitly, and workers allow Claude explicitly. Failure never selects another route.

Start forwards argv lists to Herdr, creates a sibling no-focus pane when none is supplied, and injects the canonical role. Existing panes must already be at a shell prompt in the selected checkout. Claude technical-skill symlinks live under ignored `.agents/scratch/agent-routing/claude/<role>`; only the Coordinator adapter exposes the workflow. Stale unexpected adapter skills fail before pane operations. Codex reads `$CODEX_HOME/config.toml` or `~/.codex/config.toml`, preserves prior instructions and skill overrides, and appends the disabled repository workflow for workers. No persistent harness/user configuration is written.

Resolve outputs effective role/route/harness/native model/effort and argv arrays. Entire `developer_instructions` and `skills.config` values are `<redacted>`, including private skill paths; all other native arguments are exact. An unresolved pane uses `<new-pane>`. Herdr failure output is redacted because it may contain command secrets. Tests decode actual forwarded TOML and check quoted/newline text preservation.

Changed files: `.agents/{README.md,models.yaml,routing.yaml,roles.yaml}`, root `README.md`, `justfile`, `bin/{agent-routing,test-agent-routing}`, `scripts/{agent-routing.py,test-agent-routing.py}`, `docs/{CURRENT.md,TASK_LOGS.md}`, `docs/exploitation/{README.md,agent-routing.md}`, and this report. Canonical roles/skills, POC sources and prior P01 evidence are unchanged. No optional Coordinator-role edit was needed.

## Verification evidence

| Exact command | Actual result |
| --- | --- |
| `just test-agent-routing -v` | Exit 0 at `23decc2acef5793777c408b908fc69d3e55aee7d`; 16 tests pass in 13.984s. Temporary checkouts and PATH stubs test real bin entrypoint arguments, errors and filesystem effects. No live agent runs. |
| `just agent-routing resolve architect --route gpt-6.1-sol-high` | Exit 0; GPT alternative, Codex, assigned native model, high effort, redacted override values. |
| `just agent-routing resolve coordinator` | Exit 0; Claude preferred profile/native ID/high effort and append-role/adapter flags. No side effects. |
| `just agent-routing resolve coordinator --route gpt-6.1-sol-high` | Expected exit 1; clear disallowed-route error with allowed Claude profile. |
| `sh -n bin/agent-routing bin/test-agent-routing` | Exit 0. |
| Inline Python `ast.parse` of both scripts | Exit 0. |
| `just --list`; `just doctor`; `just export-tokens --help`; `just --dry-run poc-001-test` | Exit 0; new commands listed, unchanged existing command dispatch. Doctor environment observations are listed above; its stale output was preserved. |
| `git diff --check` | Exit 0. |
| `git diff --exit-code c6083e892285b43c297c742ff28553ae3e2e7310 -- poc-001-linked-formation docs/mailbox/p01-browser-harness .agents/agents .agents/skills AGENTS.md CLAUDE.md assets shared tools .gitignore` | Exit 0; protected sources, roles/skills, guidance and P01 evidence unchanged. |
| `git check-ignore .agents/scratch/agent-routing/claude/scout/.claude/skills/ruach-testing` | Exit 0; adapter path ignored. |
| `python3 .agents/scratch/routing-p02/check-routing-docs.py` | Exit 0; 117 local links/fragments, Markdown whitespace, YAML catalogs, Python syntax and unchanged protected baseline content. An initial fragment mismatch in the new dated heading was corrected. |

An earlier test run failed only in the prerequisite fixture: its deliberately isolated PATH lacked the shell wrapper's `dirname`. The fixture now supplies `dirname` and Python while excluding real harnesses; assertions and behavior expectations were preserved. Both subsequent full suites passed, including the committed-revision run above.

Additional documentation/scope audit is recorded in [TASK_LOGS](../../TASK_LOGS.md#2026-10-04-agent-model-routing-candidate). Local audit implementation and captured CLI help are in ignored `.agents/scratch/routing-p02/`; the durable commands and results are in this report and the task log.

## CLI and official-document inspection

Read `/tmp/brainlab-routing-p02-bootstrap.py`, existing entrypoints/scripts/justfile, ADR-0005 and ADR-0006 before implementation. Inspected `claude --help`, `codex --help`, `herdr agent start --help`, `herdr pane split --help`, `herdr pane layout --help`, and `claude --version`, `codex --version`, `herdr --version`, `just --version`: all exit 0. Versions: Claude Code 2.1.289, Codex 0.160.0, Herdr 0.9.0, just 1.40.0. `python3 -c 'import yaml; print(yaml.__version__)'` printed 6.0.2; `just doctor` printed Python 3.13.5. Codex warned about read-only PATH aliases during inspection, without preventing help/version output.

Codex help confirms `--approve-for-me`, `-m`, and TOML `-c` overrides. The fetched [official configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference) documents developer instructions, model reasoning effort and skill enablement. Claude help confirms model, effort, add-directory and auto permission mode. The [official CLI reference](https://code.claude.com/docs/en/cli-reference) confirms role-file append semantics; `claude --append-system-prompt-file .agents/agents/scout.md --help` exited 0 without launching a session, even though standalone help omits that flag. [Official skill documentation](https://code.claude.com/docs/en/skills#load-skills-from-a-directory-outside-the-project) confirms additional-directory skill discovery. Herdr help confirms `agent start NAME --kind HARNESS --pane ID -- [AGENT_ARG]...` and the pane split/layout flags used.

## Limits and next steps

No real worker launches, authentication checks, model-availability probes, live skill-discovery checks, browser/application tests, independent review, merge or remote actions were performed. YAML and stubs do not prove model availability. Prototype verification was not rerun because POC sources/runtime/tests and existing recipe implementations are unchanged. The Coordinator can launch every worker, including Architect, with explicit `--route gpt-6.1-sol-high` after review; coordinator itself remains Claude-only. The assigned Codex skill-file convention and actual readiness need live evidence from those later launches. There are no unresolved implementation blockers.
