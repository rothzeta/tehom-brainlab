# Four-harness Coordinator trial — assignment

Task: `orchestrator-four-harness`; author/role: parent experiment observer; date: 2026-10-03.

This repeats the [two-harness trial](../orchestrator-comparison/results.md) with Claude Code, Codex, OMP using exact Sonnet 5, and Antigravity CLI (Agy) using Gemini 3.8 Flash Medium. Pi, OpenCode, DSH, Archon, campaigns, and new native agents are excluded. The canonical Coordinator and feature workflow remain unchanged. A worker-owned durable final-handoff contract is supplied in the assignment rather than added to permanent roles.

## Shared conditions

All four fresh worktrees start at `ccd0668c25af53d72a55c2148311b122d64ae036`, before the previous trial's comparison evidence. Main starts at `c430708`. The same feature contract, workflow selection opportunity, worker route, handoff fields, and observer acceptance suite apply. The feature brief does not name the workflow. Each Coordinator has the canonical Coordinator role; workers receive their own canonical role and self-contained task assignments without the orchestration body. Sequential roles may share a run's worktree; different runs remain isolated. Local candidate commits and destination merges are authorized; no push or merge to main.

| Harness | Worktree | Local destination | Coordinator | Workspace/pane |
| --- | --- | --- | --- | --- |
| Claude | `/tmp/brainlab-orch2-claude` | `experiment/orch2-claude-delivery` | `orch2-claude` | `w6R:p1` |
| Codex | `/tmp/brainlab-orch2-codex` | `experiment/orch2-codex-delivery` | `orch2-codex` | `w6S:p1` |
| OMP | `/tmp/brainlab-orch2-omp` | `experiment/orch2-omp-delivery` | `orch2-omp` | `w6T:p1` |
| Agy | `/tmp/brainlab-orch2-agy` | `experiment/orch2-agy-delivery` | `orch2-agy` | `w6V:p1` |

Canonical SHA-256: Coordinator `53abb258249d2f792eee3afd8588b931868230d111792d9670284b91b62ba99d`; feature workflow `8ac6428b30addc14ffaad7aed9596638574114286191e6d6e7e58e541c0bcf22`.

## Loading adapters

The temporary external launcher is `/tmp/brainlab-orchestrator2-launch.py`. Invocation is `python3 /tmp/brainlab-orchestrator2-launch.py <kind> <role> /tmp/brainlab-orch2-<kind> <unique-name> [existing-pane]`. It uses Herdr `agent start` and a sibling pane with `--no-focus`; it adds no repository agent files or persistent harness settings.

- Claude: canonical role via `--append-system-prompt-file`; temporary additional-directory `.claude/skills/` symlinks point to canonical skills. Coordinator receives all three; workers receive the two technical skills. `--permission-mode auto` retains permission review.
- Codex: canonical role via per-invocation `developer_instructions`, preserving an existing value if present. Workers disable the canonical workflow skill in their invocation. Native `.agents/skills/` discovery remains available. `--approve-for-me` uses approval review.
- OMP: `--append-system-prompt <canonical role file> --model anthropic/claude-sonnet-5 --no-prewalk`; workers use `--skills ruach-testing,ruach-simplification`. No permission bypass or native subagent route.
- Agy: `--model gemini-3.8-flash-medium --mode accept-edits`; a separate startup turn asks the session to read AGENTS and its canonical role, state boundaries, then wait. File edits are permitted by the mode; Bash dialogs still require user decisions. Workers are expressly forbidden to read orchestration bodies, although metadata may remain discoverable.

The Agy startup adapter initially submitted before the actual CLI input widget appeared. No acknowledgement was visible; the observer submitted the role-only turn after startup and observed both canonical file reads and the boundary acknowledgement. The adapter now waits for the actual CLI banner/input prompt before its role-only turn. Its help command was also added after OMP discovered that `--help` originally raised an argument error. These are temporary adapter corrections, not canonical role changes.

## Exact common feature brief

```text
Deliver this small repository CLI feature in your assigned isolated worktree. You are the Coordinator. Follow the canonical definition in .agents/agents/coordinator.md; read it if the launcher has not already injected it.
Feature: add `just repo-root`, backed by executable `bin/repo-root` and implementation `scripts/repo-root.sh`. With no arguments it prints exactly one absolute path line for THIS checkout's root and exits zero. Direct invocation by absolute path works from an unrelated cwd, including checkout paths containing spaces. Extra arguments fail nonzero with a concise usage diagnostic on stderr and no path on stdout. Use only existing shell/Python/just tools, no dependency installs.
Scope: those command files, a thin just recipe, meaningful black-box acceptance checks (a small Python stdlib test file under scripts/tests is allowed), relevant existing documentation, and owned durable reports. Preserve existing commands and all prototype files. Do not change AGENTS.md, CLAUDE.md, canonical roles/skills, or add native agent files/persistent harness configuration.
Implement and deliver locally into the assigned destination branch; an implementation/candidate branch derived from ccd0668 is permitted. Independent review is expected. Local commits and merge into YOUR experiment destination are authorized; no push, no merge to master, no other run's branch/worktree edits. Keep workers in your run's worktree (sequential roles may share it), with explicit ownership. Preserve reports in docs/mailbox/<task-id>/<role>.md; record actual checks in docs/TASK_LOGS.md and current facts in docs/CURRENT.md within this worktree. Source revision is ccd0668c25af53d72a55c2148311b122d64ae036.
Configured worker route: use Herdr and the same harness as this session. Canonical role injection and technical-skill visibility are provided by:
`python3 /tmp/brainlab-orchestrator2-launch.py <kind> <role> <worktree-absolute-path> <unique-worker-name>`
It creates a sibling pane with --no-focus in the calling tab and loads the assigned canonical role without a copied definition. Agy submits a role-only bootstrap turn: wait for it to settle before submitting the actual worker assignment. Workers must not receive or read orchestration workflow bodies; some harnesses can still expose their metadata. Do not use native subagents or an alternate worker route. OMP workers must keep anthropic/claude-sonnet-5; Agy workers must keep gemini-3.8-flash-medium. Read its usage only if necessary; do not copy/modify it or invent another worker route. Use Herdr agent prompt/get/read/wait to coordinate. If sandbox access to Herdr or shared Git metadata is denied, use the available approval mechanism for the bounded authorized action; don't bypass permission safeguards. Ask the user before answering an actual approval/question dialog.
This is an orchestration experiment. At completion report the workflow you selected, how it was loaded (native invocation or file read), the worker IDs/roles, task status, candidate/tested/reviewed/delivered revisions, checks and review outcomes, merge result, report locations, blockers and any deviations. Do not merely outline a plan; run the task to completion.

Handoff protocol for this trial (apply identically to every worker, including integration/merge): before returning complete, write the final structured handoff at the TOP of the owned durable Markdown report, preserving prior phase evidence below it. Reply in the terminal with only that same concise block. Required fields: task_id, role, phase, status, revision, report, verification (passed/failed/not-run), tested_revision, review (no-blockers/changes-required/not-run), destination, delivered_revision, needs_decision (boolean), blockers. Use null for inapplicable revisions/destination and list concrete decisions when blocked. Exact commands/results stay in the report body. For a merge handoff also include the reviewed candidate and merge outcome in the body. Record delivery evidence durably; an evidence-only successor commit is permitted when needed, with unchanged command/test content confirmed by the integration owner. A report can identify the tested delivery revision before its evidence commit; return the final branch SHA in the concise terminal block. Do not weaken the report requirement to avoid a post-merge documentation commit.
Use Herdr lifecycle status to wait for worker completion/blocking. Once settled, read only the handoff block needed to advance, using the owned report rather than reconstructing results from terminal history. Do not inspect production files, run checks, validate worker results, review diffs, integrate, merge, or independently check final delivery refs as Coordinator. Do not read previous experiment reports as a plan or source. Select the workflow yourself; the brief deliberately does not name one.
```

Each submission appended only its run parameters: kind, absolute worktree, task ID `orch2-<kind>-repo-root`, destination above, and worker-name prefix `oc2-<kind>-`.

## Observer responsibilities

Observe role loading, workflow selection/body loading, Herdr workers, workflow isolation, Coordinator boundaries, and handoff behavior. Run the identical acceptance suite against the exact delivered revisions after workers settle; distinguish tests from worker claims. Capture deviations, permission pauses, model identity, clean state, reviewed ancestry, scope, and durable delivery evidence. Preserve concise evidence without account information or raw private configuration. Feature outputs stay on experiment branches. Results and actual executed checks will be recorded separately.
