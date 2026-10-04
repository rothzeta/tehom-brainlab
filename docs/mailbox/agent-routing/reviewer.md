---
task: A-review-agent-routing
status: complete
outcome: Independent review complete; no material findings. All eight criteria pass within the assigned static and stub verification scope; live readiness remains unverified.
artifacts:
  - docs/mailbox/agent-routing/reviewer.md
  - routing-setup
  - scripts/agent-routing.py
  - scripts/test-agent-routing.py
verification:
  - "just test-agent-routing -v: exit 0; 16 tests pass in 5.661s at reviewed_revision"
  - "All five default resolver probes and all nine allowed explicit role/route combinations: exit 0 with expected harness, native model and high effort"
  - "Disallowed coordinator GPT route, unknown route, unknown role and broken model reference: expected exit 1 with clear diagnostics"
  - "Installed CLI help, shell syntax, Python AST parsing, whitespace and protected-scope/content-equality checks: passed"
discoveries:
  - "Official Codex build-skills documentation explicitly uses SKILL.md paths for skills.config disabling, matching the bootstrap and launcher; the configuration reference's folder wording alone does not establish a defect. Live discovery was not run."
blockers: []
candidate_revision: 23decc2acef5793777c408b908fc69d3e55aee7d
tested_revision: 70f96579d725dbe2505842d0d6b2aa9016aabe40
reviewed_revision: 70f96579d725dbe2505842d0d6b2aa9016aabe40
---

Author: Reviewer. Date: 2026-10-04. Assignment: `.agents/scratch/routing-p02/assignments/A-reviewer.md`. Reviewed the full range `c6083e892285b43c297c742ff28553ae3e2e7310..70f96579d725dbe2505842d0d6b2aa9016aabe40` on `routing-setup`, including relevant surrounding entrypoint conventions, ADR-0005, ADR-0006, the schema, and the [Implementer handoff](implementer.md). Applied ruach-handoff and ruach-testing; no workflow skill was loaded or followed.

The main checkout was clean at review start. Review used that checkout; no worktree was needed. Tests and resolver probes were executed at the existing head above. `23decc2..70f9657` changes only `docs/TASK_LOGS.md` and the Implementer report, and changes no executable, configuration or test content. This uncommitted Reviewer report is the only file written in the main checkout. No production changes or commits were made.

## Findings

No material findings. No blocking findings or optional code changes requested. Review supports acceptance of the routing implementation within this assignment's verification scope. This is not delivery or evidence of live harness readiness.

## Acceptance conditions

| Criterion | Verdict | Evidence and limits |
| --- | --- | --- |
| 1. Central model identity/harness | Pass | `.agents/models.yaml` contains exactly the two assigned identities and native IDs, with Codex and Claude respectively. No other catalog provider/model entries. |
| 2. Routes and effort | Pass | `.agents/routing.yaml` contains exactly `gpt-6.1-sol-high` and `claude-opus-5.5-high`, documented model references and `high`. `resolve` reads native IDs from models; generated argv and stubs use those IDs without route suffixes. |
| 3. Role preferences and explicit alternatives | Pass | `.agents/roles.yaml` has the assigned preferences/alternatives without instruction bodies. Coordinator has only Claude; validation also rejects a configured Codex coordinator route. Start performs one selected launch; the failure test verifies no retry/fallback. |
| 4. Small schema and factual documentation | Pass | `.agents/README.md` and `docs/exploitation/agent-routing.md` explain fields, references, Python 3.11+/PyYAML and start prerequisites. CURRENT/TASK_LOGS distinguish candidate implementation/stub checks from pending independent review, live launches and merge at that revision. |
| 5. Entry point, launch, arguments, skills, secrets | Pass within boundary scope | Thin justfile → bin → scripts matches ADR-0005 and existing positional argument idiom. Resolve is side-effect-free and redacts complete developer-instruction/skill-config values. Herdr start uses kind/pane/argv; default split uses checkout cwd and no focus. Tests observe canonical role injection, previous Codex instructions and skill entries, quotes/newlines, Claude adapter symlinks and coordinator-only workflow inclusion, stale adapter rejection, and Codex worker disabling. Actual harness discovery remains unverified. |
| 6. Harness flags and bootstrap equivalence | Pass for inspected flags and generated arguments | Installed help and the hidden Claude append-file help probe exit 0. Arguments preserve the bootstrap's model, effort, approval, role, adapter and split behavior for both harnesses. Config-home selection, validation and redaction improve on the bootstrap. SKILL.md assessment below finds no evidenced defect. No model availability claim. |
| 7. Invalid input before pane creation | Pass | Full catalog validation precedes start. Negative boundary cases cover fields/types, unknown role/route/model references, missing files, duplicate YAML, unsupported harness/effort, disallowed override and invalid user config; stub records remain empty. Independent broken-copy resolver probe also fails clearly. |
| 8. Focused tests and bounded scope | Pass | All 16 tests pass through the real bin entrypoint with stub executables and temporary checkout inputs. Assertions protect the requested routing, launch and disclosure boundaries. Full changed-file list contains only assigned routing/tooling/docs files; protected baseline comparison passes for canonical roles/skills, P01 sources/evidence, guidance and shared resources. No scheduling framework, root JS application or persistent harness configuration added. |

## Executed verification

The following commands were executed by this Reviewer, rather than inferred from the Implementer's report. Successful resolver probes all return `effort: high` and the expected role/route/harness/native model. Claude uses `claude-opus-5-5`; Codex uses `gpt-6.1-sol`.

| Exact command | Result |
| --- | --- |
| `just test-agent-routing -v` | Exit 0; 16 tests, 5.661s. No real harness/Herdr launches; stubs exercise start. |
| `just agent-routing resolve coordinator` | Exit 0; Claude preferred. |
| `just agent-routing resolve architect` | Exit 0; Claude preferred. |
| `just agent-routing resolve scout` | Exit 0; Codex preferred. |
| `just agent-routing resolve implementer` | Exit 0; Codex preferred. |
| `just agent-routing resolve reviewer` | Exit 0; Codex preferred. |
| `just agent-routing resolve coordinator --route claude-opus-5.5-high` | Exit 0; Claude explicit. |
| `just agent-routing resolve architect --route gpt-6.1-sol-high` | Exit 0; Codex explicit alternative. |
| `just agent-routing resolve architect --route claude-opus-5.5-high` | Exit 0; Claude explicit preferred. |
| `just agent-routing resolve scout --route gpt-6.1-sol-high` | Exit 0; Codex explicit preferred. |
| `just agent-routing resolve scout --route claude-opus-5.5-high` | Exit 0; Claude explicit alternative. |
| `just agent-routing resolve implementer --route gpt-6.1-sol-high` | Exit 0; Codex explicit preferred. |
| `just agent-routing resolve implementer --route claude-opus-5.5-high` | Exit 0; Claude explicit alternative. |
| `just agent-routing resolve reviewer --route gpt-6.1-sol-high` | Exit 0; Codex explicit preferred. |
| `just agent-routing resolve reviewer --route claude-opus-5.5-high` | Exit 0; Claude explicit alternative. |
| `just agent-routing resolve coordinator --route gpt-6.1-sol-high` | Expected exit 1; route not allowed, allowed Claude route listed. |
| `just agent-routing resolve scout --route unknown` | Expected exit 1; route not allowed, allowed routes listed. |
| `just agent-routing resolve unknown` | Expected exit 1; `Unknown role: unknown`. |
| `just agent-routing resolve scout --root /tmp/routing-review-broken-7uy75nfb` | Expected exit 1; `route gpt-6.1-sol-high: unknown model missing-model`. Temporary copy retained canonical role/skill files and substituted routing.yaml with a route referencing `missing-model`; the copy was removed afterward. |
| `claude --help`; `codex --help`; `herdr agent start --help`; `herdr pane split --help`; `herdr pane layout --help` | Each exit 0; flags and argument forwarding match launch code. Codex emits a read-only PATH-alias warning without failing. |
| `claude --append-system-prompt-file .agents/agents/scout.md --help` | Exit 0; validates acceptance of the hidden file flag without starting a session. |
| `claude --version`; `codex --version`; `herdr --version` | Exit 0; 2.1.289, 0.160.0, 0.9.0 respectively. |
| `codex app-server --help`; `codex debug --help`; `codex debug prompt-input --help`; `codex app-server generate-json-schema --help` | Exit 0; inspected possible offline inspection surfaces only. No server, schema generation or prompt-input run was started. |
| `sh -n bin/agent-routing bin/test-agent-routing` | Exit 0. |
| Inline Python `ast.parse(pathlib.Path(p).read_text())` for `scripts/agent-routing.py` and `scripts/test-agent-routing.py` | Both parse successfully, exit 0. |
| `git diff --check c6083e8..70f9657` | Exit 0. |
| `git diff --name-only 23decc2..70f9657` | Only TASK_LOGS and Implementer report. |
| `git diff --exit-code 23decc2..70f9657 -- .agents bin scripts justfile` | Exit 0; technical content unchanged. |
| `git diff --exit-code c6083e8..70f9657 -- poc-001-linked-formation docs/mailbox/p01-browser-harness .agents/agents .agents/skills AGENTS.md CLAUDE.md assets shared tools .gitignore` | Exit 0; protected scope unchanged. |
| `git status --short`; `git rev-parse HEAD`; `git diff --stat c6083e8..70f9657`; `git diff --name-only c6083e8..70f9657` | Initial checkout clean; exact head confirmed; all 15 changed files inspected. |

## Harness and skill-path assessment

Compared [launcher](../../../scripts/agent-routing.py) against `/tmp/brainlab-routing-p02-bootstrap.py`. Both use canonical role files, the same native model IDs/high effort, Claude append-file/add-dir/auto flags, Codex automatic approvals and TOML overrides, user instruction concatenation, retained skill entries plus disabled worker workflow, and the same width-dependent sibling split. Existing-pane cwd is an explicit operator prerequisite in the new documentation, consistent with the bootstrap's behavior.

The [official Codex configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference) supports `developer_instructions`, `model_reasoning_effort` and per-skill enablement; its path description says folder. However, the [official build-skills guide](https://learn.chatgpt.com/docs/build-skills#enable-or-disable-local-codex-skills) explicitly demonstrates `path = "/path/to/skill/SKILL.md"` with `enabled = false`. The [official sample configuration](https://learn.chatgpt.com/docs/config-file/config-sample) also uses a SKILL.md path. Consequently the file-path form at launcher line 175, matching the bootstrap, is supported by official examples and is not an evidenced implementation defect. Changing it to a folder solely on the reference's wording would not be justified by this review. Live effective discovery is still outside the performed checks.

The [official Claude CLI reference](https://code.claude.com/docs/en/cli-reference#system-prompt-flags) documents append-file semantics in interactive mode. The [official Claude skill guide](https://code.claude.com/docs/en/skills#load-skills-from-a-directory-outside-the-project) documents discovery from an added directory's `.claude/skills`; this matches the adapter layout. All these pages were fetched during review.

## Unverified areas and handoff

No real agents or panes were launched. Authentication/trust, account access, model availability, live Claude/Codex skill discovery, effective runtime instructions and Herdr readiness were not tested. Prototype/browser checks were not run because application sources and existing prototype tooling are unchanged. No merge, push, deployment or delivery revision is claimed. Coordinator retains the separately assigned live verification and integration work; this review has no unresolved blocker.
