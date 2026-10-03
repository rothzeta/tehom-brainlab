# Parallel Coordinator trial — assignment

Task: `orchestrator-comparison`; author: parent experiment observer; date: 2026-10-03.
Status: experiment assignment, results recorded separately.

## Control and scope

Both runs start at `ccd0668c25af53d72a55c2148311b122d64ae036`, with identical canonical Coordinator and feature-workflow contents. The same brief below is submitted once to each Coordinator, changing only harness, task identifier, worktree path, destination branch, and worker-name prefix. It does not name a workflow or use an explicit skill invocation. It does request workflow evidence at completion: this tests workflow selection under a Coordinator assignment, rather than activation by an ordinary unassigned coding agent.

| Parameter | Claude | Codex |
| --- | --- | --- |
| Harness | Claude Code 2.1.288 | Codex CLI 0.160.0 |
| Observed default model | Opus 5.5 | GPT-6.1-Sol, high |
| Coordinator | `orch-claude` | `orch-codex` |
| Worktree | `/tmp/brainlab-orch-claude` | `/tmp/brainlab-orch-codex` |
| Destination | `experiment/orch-claude-delivery` | `experiment/orch-codex-delivery` |
| Task | `orch-claude-repo-root` | `orch-codex-repo-root` |
| Worker prefix | `oc-claude-` | `oc-codex-` |

Claude receives the canonical role through `--append-system-prompt-file` and temporary `.claude/skills/` directory symlinks through `--add-dir`. Codex receives the canonical role through `developer_instructions` and native `.agents/skills/` discovery. Existing user developer instructions are retained if present. Neither harness receives a replacement system prompt, native agent definition, or copied role/skill body. Claude uses `--permission-mode auto`; Codex uses `--approve-for-me`. These use permission review, not bypass modes. No model or reasoning override is supplied, so this is not a controlled performance comparison.

The launch route is a temporary Python helper outside the repository. It creates sibling worker panes with preserved working directory and `--no-focus`, injects the canonical assigned role, and gives workers the two technical skills. Claude workers receive a separate additional-directory adapter without the workflow alias; Codex workers disable the workflow through a per-invocation `skills.config` exclusion. The helper and adapters are experimental runtime artifacts, not repository tooling or installed configuration.

Separate worktrees isolate files and Git indexes; branches and object storage remain shared Git metadata. Each run may modify only its own candidate/destination branches. Both Coordinators run concurrently; workers within a run can use the same worktree in sequential phases with explicit ownership. Feature commits stay on experiment branches. Main-checkout changes are evidence and documentation only.

## Shared submitted brief

```text
Deliver this small repository CLI feature in your assigned isolated worktree. You are the Coordinator.
Feature: add `just repo-root`, backed by executable `bin/repo-root` and implementation `scripts/repo-root.sh`. With no arguments it prints exactly one absolute path line for THIS checkout's root and exits zero. Direct invocation by absolute path works from an unrelated cwd, including checkout paths containing spaces. Extra arguments fail nonzero with a concise usage diagnostic on stderr and no path on stdout. Use only existing shell/Python/just tools, no dependency installs.
Scope: those command files, a thin just recipe, meaningful black-box acceptance checks (a small Python stdlib test file under scripts/tests is allowed), relevant existing documentation, and owned durable reports. Preserve existing commands and all prototype files. Do not change AGENTS.md, CLAUDE.md, canonical roles/skills, or add native agent files/persistent harness configuration.
Implement and deliver locally into the assigned destination branch; an implementation/candidate branch derived from ccd0668 is permitted. Independent review is expected. Local commits and merge into YOUR experiment destination are authorized; no push, no merge to master, no other run's branch/worktree edits. Keep workers in your run's worktree (sequential roles may share it), with explicit ownership. Preserve reports in docs/mailbox/<task-id>/<role>.md; record actual checks in docs/TASK_LOGS.md and current facts in docs/CURRENT.md within this worktree. Source revision is ccd0668c25af53d72a55c2148311b122d64ae036.
Configured worker route: use Herdr and the same harness as this session. Canonical role injection and technical-skill visibility are provided by:
`python3 /tmp/brainlab-orchestrator-launch.py <kind> <role> <worktree-absolute-path> <unique-worker-name>`
It creates a sibling pane with --no-focus in the calling tab, launches the assigned canonical role, exposes technical skills to workers, and exposes orchestration skills only to Coordinators. Read its usage only if necessary; do not copy/modify it or invent another worker route. Use Herdr agent prompt/get/read/wait to coordinate. If sandbox access to Herdr or shared Git metadata is denied, use the available approval mechanism for the bounded authorized action; don't bypass permission safeguards. Ask the user before answering an actual approval/question dialog.
This is an orchestration experiment. At completion report the workflow you selected, how it was loaded (native invocation or file read), the worker IDs/roles, task status, candidate/tested/reviewed/delivered revisions, checks and review outcomes, merge result, report locations, blockers and any deviations. Do not merely outline a plan; run the task to completion.
```

## Assessment

Observe workflow selection/loading, canonical role boundaries, self-contained worker assignments, concise structured handoffs, combined-revision verification, independent review, worker-owned merge, delivery evidence, and deviations. Distinguish a skill being visible, its body being loaded, and its procedure being followed. Use actual Herdr lifecycle/terminal evidence and inspect resulting revisions; worker completion alone is insufficient.

The observer may inspect worker outputs and run final acceptance checks independently. This does not authorize the tested Coordinators to implement, inspect full diffs, verify, review, integrate, or merge themselves. No injected fault or destination movement is planned; those recovery paths require separate tests.
