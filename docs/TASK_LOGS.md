# Task logs

Record dated execution, evidence, and limitations here. Intended work follows [ADR-0002](adr/0002-plan-filenames.md) and [ADR-0003](adr/0003-implementation-plan-writing.md). Retain historical entries and link governing plans and detailed playtest reports where applicable.

## 2026-10-03 Vault alignment

Scope: align `docs/` with the user's Obsidian vault structure and adapt the missing plan/task conventions from `../enoch`. Inspected repository revision: `1cd41a0b419ddc0ac805f92c0af57b57064e800d`, with pre-existing uncommitted tooling changes, edits to the draft plans, and migration from `doc/` to `docs/`. No implementation commit was created.

Inspected Enoch's vault schema, entry points, and ADRs 0001–0003. Those notes supplied documentation conventions only; application content, review findings, runtime requirements, and its additional issue-register policy were not adopted.

Created the required vault entry points and local ADRs. Preserved the original decision log in ADR-0004 and moved the asset-import record to `exploitation/`. Kept prototype briefs and the playtest template, adding their directory indexes. Updated referring links and repository working guidance.

Reconciled all twelve draft plans with the local naming and writing ADRs, added unassigned task/integration ownership and stable checkpoint identifiers, and directed future execution evidence here. Retained filenames, draft status, dependencies, acceptance criteria, proposed game rules, and the patrol gate. No game rules or application source were implemented.

### Executed verification

| Command | Result |
| --- | --- |
| `python3 /tmp/check-brainlab-vault.py` (temporary documentation audit) | Exit 0: 10 required vault/directory entry points, 4 ADR identities, 12 plan filename/section/ownership contracts, 50 unique checkpoint identifiers, 229 local links and fragments, and whitespace across 37 Markdown files passed. Historical asset-import content and original decisions were preserved, accounting for the prior `doc/` to `docs/` migration. |
| `git diff --check` | Exit 0; no whitespace errors in the tracked working diff. The documentation audit also checked new Markdown files. |

The initial audit rejected two checker assumptions: P12 retains its existing conditionally blocked draft status, and the pre-existing migration had already changed the decision log's `doc/` reference to `docs/`. Corrected the audit to recognize those preserved conditions, then reran it successfully. The audit script is temporary and is not a repository command.

### Limitations

No dependency installation, application build, unit suite, browser combat check, or human playtest ran. The asset-import validation remains historical evidence from its existing record. This documentation alignment does not complete P01 or open the boss gate.

## 2026-10-03 Repository tooling ADR

Scope: add the user-requested decision for mandatory `.agents/`, `bin/`, and `scripts/` folders and just's repository management and tooling aggregation role. Inspected revision: `1cd41a0b419ddc0ac805f92c0af57b57064e800d`, retaining existing uncommitted tooling and vault work. No commit was created.

Added [ADR-0005](adr/0005-repository-management-and-tooling.md), covering folder ownership, thin recipes and entry points, argument and exit-code preservation, command discovery, and prototype-local tooling. Updated the ADR index, ADR-0004 cross-reference, schema, current state, repository README, and AGENTS guidance. Added `.agents/README.md` to represent the existing empty mandatory folder in Git. No command implementation or prototype source changed.

| Command | Result |
| --- | --- |
| `python3 /tmp/check-brainlab-vault.py` (temporary audit updated to include ADR-0005 and `.agents/README.md`) | Exit 0: 5 ADR identities, 12 plan contracts, 50 checkpoint identifiers, 241 local links/fragments, and whitespace across 39 Markdown files passed; historical decisions and asset-import content preserved. |
| `just --list` | Exit 0; lists the existing `default`, `doctor`, and `export-tokens` recipes. |
| `git diff --check` | Exit 0; no tracked whitespace errors. |
| `git check-ignore .agents/README.md bin/doctor scripts/doctor.sh` | Exit 1 with no output, confirming none of the inspected mandatory-folder files is ignored. |

No application suite, asset export, or playtest ran. Command implementations were unchanged; command discovery verifies the existing justfile, not future prototype recipes.

## 2026-10-03 Commit preparation

Scope: commit and push the accumulated vault, ADR, and repository tooling changes by user instruction. Parent revision: `1cd41a0b419ddc0ac805f92c0af57b57064e800d`; target branch: `master`, tracking `origin/master`.

Reviewed the existing `doc/` to `docs/` migration, Bun/Docker/just conventions, asset exporter relocation and manifest references, required-folder tracking, vault notes, and reconciled plans. The combined change includes these earlier working-tree edits as well as the vault and ADR work recorded above. Asset content and source provenance remain intact.

| Command | Result |
| --- | --- |
| `python3 /tmp/check-brainlab-vault.py` | Exit 0: vault entries, 5 ADR identities, 12 plan contracts, 50 checkpoint identifiers, local links/fragments, Markdown whitespace, and historical content preservation passed. |
| `sh -n bin/doctor bin/export-token-pngs scripts/doctor.sh` | Exit 0; shell syntax checks passed. |
| `just --list` | Exit 0; existing recipes are discoverable. |
| `just export-tokens --help` | Exit 0; the just recipe and executable wrapper reach the relocated Python CLI and forward the help argument. |
| `git diff --check` | Exit 0; no whitespace errors. |

These checks verify documentation and CLI discovery/dispatch. No PNG export, application build, game-rule suite, browser combat check, or human playtest ran. Git commit and push outcomes are reported in the session after execution.

## 2026-10-03 Portable agent baseline

Scope: create and commit the user-supplied portable source-of-truth layer, then stop before harness integration. Inspected parent revision: `f849d5e9a436876b5e05eeeea102ded23648cc69`; the working tree was clean.

Replaced root `AGENTS.md` with the requested small canonical instructions and added `CLAUDE.md` containing only `@AGENTS.md`. Added the five supplied roles under `.agents/agents/` and four supplied skills under `.agents/skills/`, preserving their text. Updated the existing `.agents/README.md` and current-state note to reflect these resources. No harness-specific agents, workflow YAML, mission state, campaign files, or Herdr scripts were added; no tools or dependencies were installed.

### Executed verification

| Command | Result |
| --- | --- |
| `python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/workflow-feature` | Exit 0; skill valid. |
| `python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/workflow-review` | Exit 0; skill valid. |
| `python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/blackbox-testing` | Exit 0; skill valid. |
| `python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/simplification` | Exit 0; skill valid. |
| `python3 /tmp/check-brainlab-portable-agents.py` (temporary audit) | Exit 0; five roles, four skill directories, minimal Claude shim, absence of native agent files, Markdown whitespace, and local links/fragments passed. |
| `git diff --check` | Exit 0; no tracked whitespace errors. |

The initial write to `.agents/` encountered the sandbox's read-only protection; the approval-reviewed write succeeded. These checks establish file structure and skill format only. Role injection, normal harness instruction preservation, skill visibility inside a harness, and Architect behavior have not been tested. No application tests or playtests ran. The requested baseline commit is reported in the session after execution; no push is requested.

## 2026-10-03 Agent artifact conventions

Scope: implement the agreed durable mailbox and local scratch conventions, reconcile role boundaries, and update schema and relevant documentation. Inspected revision: `784be4c0e22ae3c07ab9cea3df333a7ebafd0c3d`, with pre-existing user edits to Coordinator and Architect.

Created `.agents/mailbox/README.md` and `.agents/scratch/README.md`. Mailbox reports are eligible for Git; scratch contents are ignored except the README. The schema defines task-based report paths, worker ownership, structured report fields, retention, and promotion of useful findings into durable artifacts. Canonical designs and plans retain their existing vault locations and naming rules.

Preserved the user's Coordinator and Architect edits while adding artifact guidance. Architect now writes assigned design and planning files and cannot switch into implementation. Scout writes evidence-based investigation reports and cannot edit application code or take over design. Implementer and Reviewer received artifact-location guidance without broader role redesign. Feature and review workflows now request durable handoffs and assign technical verification to workers. Updated root guidance and README, agent-resource index, vault README, SCHEMA, CURRENT, and ADRs 0003 and 0005.

### Executed verification

| Command | Result |
| --- | --- |
| `python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/workflow-feature` | Exit 0; skill valid. |
| `python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/workflow-review` | Exit 0; skill valid. |
| `python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/blackbox-testing` | Exit 0; skill valid. |
| `python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/simplification` | Exit 0; skill valid. |
| `python3 /tmp/check-brainlab-agent-artifacts.py` (temporary documentation audit) | Exit 0; vault entry points, five ADR identities, twelve plan contracts, fifty stable checkpoints, local links/fragments, Markdown whitespace, historical evidence preservation, agent resource structure, minimal Claude shim, and five Git ignore cases passed. |
| `git diff --check` | Exit 0; no tracked whitespace errors. |

The first audit found the CURRENT link to this entry before the entry existed; it passed after this record was added. Protected `.agents/` writes used the approval-reviewed path. No dependencies, harness-specific agents, workflow YAML, mission state, campaign files, or Herdr scripts were added. No agents were launched through Herdr, and no role behavior, application suite, or playtest was exercised. Changes remain uncommitted for continued discussion of the roles and skills.

## 2026-10-03 Implementer test ownership

Scope: apply the agreed Implementer responsibilities before discussing Reviewer. Inspected revision remains `784be4c0e22ae3c07ab9cea3df333a7ebafd0c3d`, with the ongoing agent-documentation edits and user-added ADR-0006 and index entry preserved.

Updated `.agents/agents/implementer.md`: Implementer writes and updates tests by default, follows workflow exceptions that preserve existing tests, verifies declared contract invariants, and reports exact verification commands and unverified work. Added assigned-component boundaries, protection against weakening tests to obtain a pass, and reporting of test/contract conflicts. Its structured handoff includes task status and artifact or commit references. Linked the existing user-added ADR-0006 and updated CURRENT; no other role or workflow was changed during this step.

| Command | Result |
| --- | --- |
| `git diff --check` | Exit 0; no tracked whitespace errors. |
| `python3 /tmp/check-brainlab-agent-artifacts.py` | Exit 0; documentation links/fragments, Markdown whitespace, existing vault and agent structure, and Git ignore checks passed. |

Reviewed the updated role content directly. Protected role writes used the approval-reviewed path. No application tests, harness role execution, commit, or push occurred.

## 2026-10-03 Workflow context boundary

Scope: apply the user's clarification that only Coordinator knows and executes the workflow. Inspected revision remains `784be4c0e22ae3c07ab9cea3df333a7ebafd0c3d`; preserved the ongoing working changes and user-added ADR-0006.

Removed workflow-dependent instructions from Architect, Scout, and Implementer. Workers now follow self-contained assignments supplied by the Coordinator; Reviewer received the same assignment guidance. Coordinator translates workflow requirements into task scope, acceptance conditions, verification instructions, restrictions, and handoff requirements without passing workflow documents. Updated both workflow skills, root instructions, agent-resource index, SCHEMA, and CURRENT. Implementer test ownership remains the default, with exceptions conveyed in its assignment.

| Command | Result |
| --- | --- |
| `python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/workflow-feature` | Exit 0; skill valid. |
| `python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/workflow-review` | Exit 0; skill valid. |
| `python3 /tmp/check-brainlab-agent-artifacts.py` | Exit 0; documentation links/fragments, whitespace, vault and agent structure, and Git ignore checks passed. |
| `git diff --check` | Exit 0; no tracked whitespace errors. |
| `rg -n -i 'workflow' .agents/agents/architect.md .agents/agents/scout.md .agents/agents/implementer.md .agents/agents/reviewer.md` | Exit 1 with no matches; worker role definitions contain no workflow references. |

Reviewed the edited instructions directly. These are configuration and documentation checks; runtime context isolation and role behavior remain untested. No harness files, agents, dependency installation, commit, or push were added or executed.

## 2026-10-03 Ruach skill names and testing

Scope: apply the user's `ruach-` prefix to all custom skills and implement the agreed shared testing skill. Inspected revision remains `784be4c0e22ae3c07ab9cea3df333a7ebafd0c3d`; preserved the ongoing role/documentation work and user-added testing ADR.

Renamed `blackbox-testing` to `ruach-testing`, `simplification` to `ruach-simplification`, and the two workflows to `ruach-workflow-feature` and `ruach-workflow-review`, updating their frontmatter names. Expanded ruach-testing with contract invariants, public boundaries, representative inputs, regression coverage, assignment restrictions, and exact verification handoffs. Updated the workflow-to-review link, testing ADR link, agent-resource index, root instructions, schema, and current state. Historical task-log commands retain the paths used when they were executed. No separate regression, .NET, or TypeScript testing skill was added.

| Command | Result |
| --- | --- |
| `python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/ruach-testing` | Exit 0; skill valid. |
| `python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/ruach-simplification` | Exit 0; skill valid. |
| `python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/ruach-workflow-feature` | Exit 0; skill valid. |
| `python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/ruach-workflow-review` | Exit 0; skill valid. |
| `python3 /tmp/check-brainlab-ruach-skills.py` | Exit 0; documentation links/fragments, whitespace, vault and agent structure, Git ignore rules, skill directory/metadata identity, prefix convention, and absence of stale active skill paths passed. |
| `git diff --check` | Exit 0; no tracked whitespace errors. |

Protected skill renames and writes used the approval-reviewed path. These checks establish format and documentation consistency; they do not establish test-writing or harness behavior. No dependencies, harness-specific files, commit, or push were added or executed. Changes remain uncommitted for continued discussion.

## 2026-10-03 Self-contained testing skill

Scope: make ruach-testing independently reusable while keeping repository decisions in the vault. Inspected revision remains `784be4c0e22ae3c07ab9cea3df333a7ebafd0c3d`; preserved the ongoing edits and existing ADRs.

Removed the external ADR dependency from `.agents/skills/ruach-testing/SKILL.md`, retaining its essential principles and procedure. Added inline examples for unordered identifier results and an explicitly configured multiplication factor, illustrating strong assertions that permit legitimate variations. Root AGENTS guidance now connects the reusable skill to ADR-0006. Updated SCHEMA and CURRENT; ADRs remain in `docs/adr/`.

| Command | Result |
| --- | --- |
| `python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/ruach-testing` | Exit 0; skill valid. |
| `python3 /tmp/check-ruach-testing-portability.py` | Exit 0; a temporary standalone copy validates and has no repository file dependencies. |
| `python3 /tmp/check-brainlab-ruach-skills.py` | Exit 0; documentation links/fragments, whitespace, vault and agent structure, Git ignore rules, prefix and metadata identity, and active skill references passed. |
| `git diff --check` | Exit 0; no tracked whitespace errors. |

Protected skill edits used the approval-reviewed path. Temporary copy checks establish file independence and format; they do not validate agent behavior or the quality of tests produced. No dependency installation, harness integration, commit, or push occurred.

## 2026-10-03 Simplification procedure

Scope: apply the agreed procedure and boundaries to ruach-simplification. Inspected revision remains `784be4c0e22ae3c07ab9cea3df333a7ebafd0c3d`; preserved all ongoing working changes.

Expanded `.agents/skills/ruach-simplification/SKILL.md` with explicit invocation conditions, a five-step procedure, role-specific editing permissions, behavior and regression-coverage preservation, and a concise handoff. Architect and Reviewer propose or report simplifications; Implementer performs implementation. Opportunities outside the assignment are reported. The skill remains self-contained and independent of orchestration workflows. Updated CURRENT to reflect the configured guidance.

| Command | Result |
| --- | --- |
| `python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/ruach-simplification` | Exit 0; skill valid. |
| `python3 /tmp/check-brainlab-ruach-skills.py` | Exit 0; documentation links/fragments, whitespace, vault and agent structure, Git ignore rules, skill identity and prefix, and active references passed. |
| `git diff --check` | Exit 0; no tracked whitespace errors. |

Reviewed the updated skill directly. Protected edits used the approval-reviewed path. No application simplification, behavioral evaluation, dependency installation, harness integration, commit, or push occurred.

## 2026-10-03 Review workflow consolidation

Scope: remove the redundant standalone review skill and place useful instructions in the roles and feature workflow. Inspected revision remains `784be4c0e22ae3c07ab9cea3df333a7ebafd0c3d`; preserved all other ongoing edits and historical task records.

Removed `.agents/skills/ruach-workflow-review/SKILL.md` and its directory. Coordinator now specifies review-assignment context and exact revision; Reviewer reports inspected scope, verification evidence, and limitations and leaves fixes to Implementer. Expanded ruach-workflow-feature with independent review after successful assigned checks, explicit task exceptions, bounded blocking fixes, verification of updated revisions, re-review, and completion conditions. Updated the agent-resource index and CURRENT to list the three remaining custom skills. Worker roles remain independent of workflow documents.

| Command | Result |
| --- | --- |
| `python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/ruach-workflow-feature` | Exit 0; skill valid. |
| `python3 /tmp/check-brainlab-ruach-skills.py` (updated for three skills) | Exit 0; documentation links/fragments, whitespace, vault and agent structure, ignore rules, skill identity and prefix, and active references passed. |
| `git diff --check` | Exit 0; no tracked whitespace errors. |
| `rg -n -i 'workflow' .agents/agents/architect.md .agents/agents/scout.md .agents/agents/implementer.md .agents/agents/reviewer.md` | Exit 1 with no matches; worker roles have no workflow references. |

Protected edits and removal used the approval-reviewed path. No review agents or feature workflow were executed; runtime behavior remains untested. No dependency installation, harness integration, commit, or push occurred.

## 2026-10-03 Generic feature integration and merging

Scope: extend the generic feature workflow through integration and merging, keeping Scout and Architect optional. Inspected revision remains `784be4c0e22ae3c07ab9cea3df333a7ebafd0c3d`; preserved all ongoing edits.

Updated ruach-workflow-feature with delivery destinations, task ownership, optional specialist routing, Architect-owned technical planning updates, and an assigned Implementer responsible for integration and merging. Combined verification precedes independent review; blocking fixes return through integration and verification before re-review. Merge handoffs identify the accepted candidate, destination, final revision, and evidence relationship. Destination advancement or conflict resolution requires refreshed integration and relevant checks and review. Coordinator remains an orchestrator; workers receive self-contained assignments. Added assigned integration and merge responsibilities to Implementer and updated the agent-resource index, SCHEMA, and CURRENT. No specialized workflow was created.

| Command | Result |
| --- | --- |
| `python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/ruach-workflow-feature` | Exit 0; skill valid. |
| `python3 /tmp/check-brainlab-ruach-skills.py` | Exit 0; documentation links/fragments, whitespace, vault and agent structure, ignore rules, skill identity and prefix, and active references passed. |
| `git diff --check` | Exit 0; no tracked whitespace errors. |
| `rg -n -i 'workflow' .agents/agents/architect.md .agents/agents/scout.md .agents/agents/implementer.md .agents/agents/reviewer.md` | Exit 1 with no matches; worker roles have no workflow references. |

Reviewed the workflow directly for role ownership, ordering, and revision handoffs. Protected edits used the approval-reviewed path. These checks verify configuration and documentation only; no feature agents, integration, tests on an application, or merge were executed. No dependency installation, harness integration, commit, or push occurred.

## 2026-10-03 Revised portable baseline

Scope: reconcile the reviewed portable definitions, move durable reports into the documentation vault, and commit the revised baseline before inspecting Architect injection. Parent revision: `784be4c0e22ae3c07ab9cea3df333a7ebafd0c3d`; included the user-edited roles and user-added testing ADR in the reviewed change.

Moved the mailbox README from `.agents/mailbox/` to `docs/mailbox/`. Updated all active role, workflow, root-guidance, README, schema, ADR, and current-state references; preserved historical task-log paths as records of earlier execution. Added mailbox navigation and its vault-layout entry. Scratch remains local and ignored except its README. The baseline retains five roles and three custom Ruach skills; Coordinator alone receives workflows, Architect remains design-only, and generic feature delivery includes worker-owned integration and merging. No native harness agent files were created.

| Command | Result |
| --- | --- |
| `python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/ruach-testing` | Exit 0; skill valid. |
| `python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/ruach-simplification` | Exit 0; skill valid. |
| `python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/ruach-workflow-feature` | Exit 0; skill valid. |
| `python3 /tmp/check-ruach-testing-portability.py` | Exit 0; standalone testing skill validates without repository dependencies. |
| `python3 /tmp/check-brainlab-ruach-skills.py` (updated for vault mailbox) | Exit 0; vault contracts, documentation links/fragments and whitespace, role/skill structure, skill identity and prefix, ignore behavior, and corrected mailbox references passed. |
| `git diff --check` | Exit 0; no tracked whitespace errors. |
| `git diff --cached --check` | Exit 0; staged baseline has no whitespace errors. |
| `claude --version` | Exit 0; installed Claude Code reports `2.1.288`. |

Reviewed the final changed file set and content. Protected mailbox movement and agent-resource edits used the approval-reviewed path. No game implementation, application suite, playtest, dependency installation, or push occurred. The revised commit is reported in the session after execution. Harness initialization and Architect behavior remain to be tested after this baseline.

## 2026-10-03 Claude Architect injection startup

Scope: begin the authorized Claude Code Architect experiment without a native Claude agent definition. Inspected baseline: `384e26233a41d9930d16ff93ecd732458d347682` (`Refine portable roles and Ruach workflows`); the working tree was clean after that commit.

Consulted the installed Claude CLI and Herdr skill. The official [CLI reference](https://code.claude.com/docs/en/cli-reference) documents `--append-system-prompt-file` as appending to the default prompt; no replacement flag was used. The [memory documentation](https://code.claude.com/docs/en/memory) documents the existing `@AGENTS.md` import shim. The [skills documentation](https://code.claude.com/docs/en/skills) lists `.claude/skills/` for native project discovery; filesystem access to `.agents/skills/` must be distinguished from native skill registration in the runtime check.

| Command | Result |
| --- | --- |
| `test "${HERDR_ENV:-}" = 1` | Exit 0; this session is running inside Herdr. |
| `herdr pane layout --current` | Sandbox socket access was denied; the approval-reviewed retry succeeded and returned the current layout. |
| `herdr pane split --current --direction down --cwd /opt/dev/tehom-brainlab --no-focus` | Exit 0; created sibling pane `w2G:p5` without changing focus. |
| `herdr agent start brainlab-architect --kind claude --pane w2G:p5 -- --append-system-prompt-file .agents/agents/architect.md` | Exit 1, `agent_not_ready`; Claude Code reached a startup approval dialog. |
| `herdr agent read brainlab-architect --source recent-unwrapped --lines 100` | Exit 0; showed the launched command and first-run trust prompt for this repository. |
| `git show -1 --format=fuller --stat` | Exit 0; confirmed the revised baseline commit and its changed file set. |

Requested user confirmation before answering the startup dialog, as explicitly required by the Herdr skill. At the end of that turn the session was waiting at that prompt; this agent had submitted neither a trust choice nor a task prompt. No runtime instruction-loading, skill-discovery, or Architect behavior check had passed. The Claude shim was unchanged, and `.claude/agents/`, `.claude/skills/`, `.codex/agents/`, and `.opencode/agents/` remained absent. No installation, application implementation, or push occurred. The user subsequently approved trust and closed the pane; the restart and completed task are recorded below.

## 2026-10-03 Claude Architect injection experiment

Scope: resume the authorized Architect launch after the user trusted the repository and closed the initial pane. Baseline: `384e26233a41d9930d16ff93ecd732458d347682`. The startup-record edits in CURRENT and TASK_LOGS remained uncommitted during the worker's assessment; its report explicitly identifies that working-tree context.

Used the locally installed `herdr` skill for communication. Created a replacement sibling pane in the same tab and working directory with `--no-focus`, then launched a fresh Claude Code session. No native agent definition, replacement system prompt, plan-mode constraint, or tool removal was used. The session retained the user's trust choice and reached `idle` without another startup question.

| Check | Evidence and result |
| --- | --- |
| AGENTS received | `/memory` showed project instructions at `./CLAUDE.md` and `AGENTS.md` as `@-imported`. Before any file read or tool call, the startup response reported the Ruach prefix, Coordinator-only workflows, and ADR-0006 verification rules. Passed. |
| Architect received | Herdr returned the argv containing `--append-system-prompt-file .agents/agents/architect.md`. Before any file read or tool call, the response identified `architect`, its permitted artifact locations, and the prohibition on implementation or role switching. Passed for this launch. |
| Normal harness instructions preserved | The documented append flag was used without a replacement flag. The startup response also reported normal Claude Code tool guidance, and `/context` showed system prompt and system tools. Preservation follows the documented flag semantics; the full default prompt was not extracted or compared. |
| Expected skills visible | No Ruach skills were registered in the native Skill tool. The worker read both technical skills from their canonical files and reported their titles and applied principles. Filesystem access passed; native discovery did not. No orchestration workflow was supplied or reported loaded. |
| Architect behavior | The bounded P01 readiness task created only [its handoff](mailbox/claude-architect-injection/architect.md). It reused the existing plan, proposed boundaries and verification, selected no dependency versions, and implemented nothing. Passed for one scoped task; repeated or conflicting-task reliability is not established. |

The assignment supplied a task ID, baseline, relevant source locations, read-only source scope, owned report location, acceptance conditions, technical skill paths, and structured handoff fields. It did not supply a workflow. The worker returned a concise structured result and a detailed durable report. P01 implementation remains future work; recommendations in the report do not establish new accepted repository decisions.

| Command | Result |
| --- | --- |
| `herdr pane layout --current` | Exit 0; confirmed the initial experiment pane was closed. |
| `herdr pane split --current --direction down --cwd /opt/dev/tehom-brainlab --no-focus` | Exit 0; created replacement pane `w2G:p6`. |
| `herdr agent start brainlab-architect --kind claude --pane w2G:p6 -- --append-system-prompt-file .agents/agents/architect.md` | Exit 0; returned the launch argv and an idle, interactive-ready Claude session. |
| `herdr agent prompt brainlab-architect '<startup context probe>' --wait --timeout 60000` | Exit 0; the probe explicitly required a response before any tool call or file read. Returned role, editing boundary, three project facts, native Ruach registration, and high-level harness-guidance presence. |
| `herdr agent prompt brainlab-architect /context` | Exit 0; diagnostic showed memory files, system prompt, tools, and skills. |
| `herdr agent prompt brainlab-architect '/context all'` | Exit 0; expanded diagnostic. Terminal recovery showed only its tail, so the memory menu supplied the import-path evidence. |
| `herdr agent prompt brainlab-architect /memory` | Exit 0; visible memory menu confirmed the project shim and imported AGENTS file. |
| `herdr agent send-keys brainlab-architect esc` | Exit 0; dismissed diagnostics without selecting an edit or changing settings. |
| `herdr agent prompt brainlab-architect '<bounded P01 readiness assignment>' --wait --timeout 60000` | Prompt submitted; the wait timed out while the worker was still running. The prompt was not resent. |
| `herdr agent wait brainlab-architect --timeout 60000` | Exit 0; the existing task settled at idle. |
| `herdr agent read brainlab-architect --source recent-unwrapped --lines 300` | Exit 0 after task completion; recovered the structured handoff tail. The durable report supplied the detailed result. |

The worker reported these executed read-only checks: `git rev-parse HEAD`, `just --list`, `just doctor`, `uname -m`, `id -u`, prototype file listing, and a search of downstream plan command usages. Its handoff records the exact environment results and explicitly excludes installation, builds, application tests, browser checks, and image pulls. These are worker-reported environment checks, not independent verification of P01 acceptance.

Independent repository checks after the handoff:

| Command | Result |
| --- | --- |
| `python3 /tmp/check-brainlab-ruach-skills.py` | Exit 0; vault contracts, 315 local links/fragments, 52 Markdown whitespace checks, role/skill structure, skill identities, scratch ignore rules, and mailbox conventions passed. |
| `python3 /tmp/check-claude-architect-scope.py` | Exit 0; only the worker's owned report was newly untracked, tracked changes were limited to the parent agent's three documentation files, AGENTS/CLAUDE/agent resources were unchanged, the entire prototype file inventory matched HEAD, and native agent/skill adapter directories were absent. |
| `git diff --check` | Exit 0; no tracked whitespace errors. |

The experiment leaves native skill discovery open. The official [skills documentation](https://code.claude.com/docs/en/skills) documents `.claude/skills/` for project discovery; direct reading of `.agents/skills/` does not register native skills. The [CLI reference](https://code.claude.com/docs/en/cli-reference) documents the append behavior used here, and the [memory documentation](https://code.claude.com/docs/en/memory) documents the import shim. No adapter, installation, production implementation, dependency selection, or push occurred. The Architect session was left idle for inspection.

## 2026-10-03 Codex Architect injection and native skill discovery

Scope: answer the native discovery question and repeat the five Architect checks in Codex. Inspected baseline: `68203a63f37f62d55f6c58c6d988c712ee49ba95`; the working tree was clean before launching the worker. Used the OpenAI Docs skill for current Codex documentation and the Herdr skill for communication.

The [official skill documentation](https://learn.chatgpt.com/docs/build-skills) confirms native discovery of `.agents/skills/`. The [configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference) documents `developer_instructions` as additional session instructions and per-skill enablement overrides. The installed CLI exposes `codex debug prompt-input`; its output was inspected programmatically without printing full instruction text. A temporary launcher read the canonical Architect file at launch, serialized it into the CLI configuration value, preserved any prior user developer instructions, and retained existing skill overrides while disabling the feature workflow for this worker. No role copy, native agent file, repository script, or persistent configuration was written.

| Check | Evidence and result |
| --- | --- |
| AGENTS received | The prompt-input diagnostic contained the exact canonical AGENTS body. Before any file read or tool call, the live response reported Coordinator-only workflows, existing-code inspection, and observable verification. Passed. |
| Architect received | The diagnostic contained the exact role body read from `.agents/agents/architect.md`. The initial live response identified Architect and its design/report/scratch editing boundary. Passed. |
| Normal instructions preserved | Comparing default and role-added developer messages showed one insertion of 1,829 characters and no removals; the other two developer messages were unchanged. The default text remained intact. No replacement instruction file, model override, plan-mode constraint, or tool removal was used. Passed for the diagnostic comparison; the live session also reported normal Codex guidance. |
| Expected skills visible | Default native discovery listed all three Ruach skills. The worker invocation's override removed `ruach-workflow-feature` from its catalog, leaving `ruach-testing` and `ruach-simplification`. The live startup response listed both before file access. Explicit `$` references supplied their bodies through native skill handling; the worker also read both canonical bodies and reported applicable principles. Passed without a discovery adapter. |
| Architect behavior | The same bounded P01 readiness task produced only [the owned handoff](mailbox/codex-architect-injection/architect.md), followed by structured output. It reused the existing draft, selected no versions, and implemented nothing. Passed for one scoped task. |

The canonical Architect source SHA-256 used for the diagnostic was `31ae4594b6a4bb17b4814b7e09ff95e200f253cd25833ca136fc7214900497f7`. The unfiltered catalog exposed workflow metadata without its body; the worker override removed even that catalog entry. The assignment supplied the same sources, artifact ownership, acceptance conditions, and restrictions as the Claude trial, with baseline and report path updated. Native `$ruach-testing` and `$ruach-simplification` activation replaced the earlier direct-file-only skill request. The prior worker report was excluded as an assessment source.

| Command | Result |
| --- | --- |
| `codex --version` | Exit 0; `codex-cli 0.160.0`. Sandbox execution printed a PATH-alias initialization warning because its state directory was read-only. |
| `codex --help`, `codex debug --help`, `codex debug prompt-input --help` | Exit 0; confirmed CLI configuration overrides and the installed prompt diagnostic. |
| `python3 /tmp/brainlab-codex-architect.py audit` | Exit 0 on the approval-reviewed path. Rendered default, role-added, and worker-filtered inputs and printed only structural metadata, booleans, source hash, and Ruach names. Exact role addition and existing-message preservation passed. The initial equality comparison was refined to account for appending within an existing message; the final comparison confirmed insertion only. |
| `herdr pane split --current --direction down --cwd /opt/dev/tehom-brainlab --no-focus` | Exit 0; created sibling pane `w2G:p8` without changing focus. |
| `python3 /tmp/brainlab-codex-architect.py start w2G:p8` | Exit 0; Herdr started `brainlab-codex-architect` with canonical role text in `-c developer_instructions=…` and a per-invocation `skills.config` exclusion. Reached idle without a startup question. |
| `herdr agent prompt brainlab-codex-architect '<startup context probe>' --wait --timeout 60000` | Exit 0; returned role, editing boundary, repository facts, two native technical skills, and normal-guidance presence before any tool call or file read. |
| `herdr agent prompt brainlab-codex-architect '<bounded P01 readiness assignment>' --wait --timeout 60000` | Submitted once; its wait timed out while the task was working. The assignment was not resent. |
| `herdr agent wait brainlab-codex-architect --timeout 60000` | Continued settled-state waits; the final wait returned exit 0 at `done`. |
| `herdr agent read brainlab-codex-architect --source recent-unwrapped --lines 260` | Exit 0; recovered the startup response, tool-use history, owned artifact creation, and completed structured handoff. |

The worker's report records its exact read-only environment checks and report validation. It observed Bun unavailable on its session PATH and Docker daemon access unavailable, whereas the earlier Claude environment check reported both accessible. Those observations do not establish why the environments differ or that the proposed stack is incompatible. No permissions were broadened to fix toolchain access. No application acceptance checks were executed, and P01 remains unimplemented. Repeated or conflicting-task role reliability and other roles remain untested.

Independent repository checks after the completed task:

| Command | Result |
| --- | --- |
| `python3 /tmp/check-brainlab-ruach-skills.py` | Exit 0; vault contracts, 336 local links/fragments, 53 Markdown whitespace checks, role/skill identities, scratch ignore rules, and mailbox conventions passed. |
| `python3 /tmp/check-codex-architect-scope.py` | Exit 0; Codex added only its owned report, parent edits were limited to README/CURRENT/TASK_LOGS, canonical instructions and agent resources were unchanged, prototype file inventory matched HEAD, and native agent/skill adapter directories were absent. |
| `git diff --check` | Exit 0; no tracked whitespace errors. |

### Proposed Claude discovery adapter

Keep `.agents/skills/` canonical. The [Claude skills documentation](https://code.claude.com/docs/en/skills) supports individual symlinked skill folders under `.claude/skills/`. Expose the two reusable technical skills there while keeping workflow loading specific to Coordinator assignments. Proposed commands from the repository root:

```sh
mkdir -p .claude/skills
ln -s ../../.agents/skills/ruach-testing .claude/skills/ruach-testing
ln -s ../../.agents/skills/ruach-simplification .claude/skills/ruach-simplification
```

These commands were not executed. They would create discovery aliases, not separately maintained definitions or native agents. The Coordinator can load its selected canonical workflow directly; a role-specific native workflow discovery surface can be considered when that launch needs it. Do not expose the whole workflow directory to every worker. A future Claude adapter check must verify the native catalog and invocation, rather than count file access as registration. Codex needs no corresponding skill aliases; its worker filter was per invocation only.

## 2026-10-03 Parallel Coordinator workflow trial

Scope: run Claude and Codex Coordinators concurrently on the same small feature in isolated worktrees, observing workflow use without explicitly naming or invoking the workflow. Source: `ccd0668c25af53d72a55c2148311b122d64ae036`. The [exact assignment](mailbox/orchestrator-comparison/assignment.md), [results and deviations](mailbox/orchestrator-comparison/results.md), and [independent acceptance output](mailbox/orchestrator-comparison/acceptance.json) preserve the evidence. This main checkout records the experiment; feature implementations stay on their experiment branches.

Communication used the local Herdr skill, read from `/home/metatron/.agents/skills/herdr/SKILL.md`. The skill path is an environment resource, not a portable repository link. Created `/tmp/brainlab-orch-claude` on `experiment/orch-claude-delivery` and `/tmp/brainlab-orch-codex` on `experiment/orch-codex-delivery` through `herdr worktree create`, both at the same base and with `--no-focus`. Each Coordinator launched same-harness Implementer and Reviewer workers in its own workspace through a temporary role-injection helper. No native agent files, installed dependency, replacement system prompt, or persistent repository harness configuration was created.

Claude Code `2.1.288` displayed Opus `5.5`; Codex CLI `0.160.0` displayed GPT-6.1-Sol with high reasoning. No model/effort override was supplied. Claude used `--append-system-prompt-file` and an additional-directory temporary skill adapter with canonical-directory symlinks. Codex used `developer_instructions` and native canonical skill discovery. Worker routes exposed technical skills while withholding the orchestration body; Codex used per-invocation `skills.config` exclusion. Permission review remained enabled (`--permission-mode auto` and `--approve-for-me`), without bypass flags.

The [Claude skills documentation](https://code.claude.com/docs/en/skills) describes additional-directory discovery and directory symlinks; the experiment proved native workflow invocation through that adapter. The [Codex configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference) documents additional developer instructions and skill configuration. Source definitions were unchanged in both trials.

| Observation | Claude | Codex |
| --- | --- | --- |
| Workflow loading | Native `Skill(ruach-workflow-feature)`, successful | Read canonical feature-workflow body before delegation |
| Implementer + independent Reviewer | `oc-claude-impl` + `oc-claude-review` | `oc-codex-implementer` + `oc-codex-reviewer` |
| Reviewed combined revision | `96ea6af` | `af6d0b7` |
| Final delivered/observer-tested revision | `7a329126bc8b4730e50634f383059962cd360103` | `976d7e20739b0927ca3a42f12e56e95b343ff1f1` |
| Local delivery | Worker-owned fast-forward | Worker-owned fast-forward plus evidence-only successor |
| Review result | No blockers; four optional notes | No material findings |
| Observer suite rerun | 5/5 passing, no skips | 8/8 passing, no skips |

Both delivered `just repo-root` through `bin/repo-root` and `scripts/repo-root.sh`, with exact root output, unrelated-cwd/spaces support, and argument rejection. Workers verified combined revisions, Reviewers reran checks independently, and integration owners merged only their destinations. Post-review successors change documentation/reports only; observer checks confirmed unchanged reviewed command and test content. No main feature merge or remote push occurred. Both experiment worktrees were clean afterward; trial panes remain available.

Recorded deviations: Claude's Coordinator directly checked delivered Git metadata rather than relying solely on its worker; its final merge result was only in the terminal handoff and is now preserved in the comparison. Codex read over 600 lines of upfront guidance/history and repeatedly sampled progress; no strict context-budget threshold was assigned. The Claude terminal's convenience change previews initially looked like source reads, but the recorded tool inputs/results did not substantiate that interpretation. No Coordinator performed production edits, ran feature tests, reviewed diffs, or merged. These observations establish bounded workflow use, not perfect role obedience or recovery/repetition reliability.

Executed commands and checks:

| Command | Actual result |
| --- | --- |
| `test "${HERDR_ENV:-}" = 1`; `herdr --help`; `herdr agent`; `herdr pane`; `herdr tab`; `herdr worktree`; `herdr pane layout --current`; `herdr agent list` | Environment check passed; group syntax/current state discovered. Group usage commands can exit 2 while printing usage. Sandbox socket access required the authorized bounded escalation. |
| `herdr worktree create --cwd /opt/dev/tehom-brainlab --branch experiment/orch-claude-delivery --base ccd0668 --path /tmp/brainlab-orch-claude --label brainlab-orch-claude --no-focus` | Exit 0; workspace `w6P`, pane `w6P:p1`. |
| Corresponding Codex command with `orch-codex` names and path | Exit 0; workspace `w6Q`, pane `w6Q:p1`. |
| `python3 /tmp/brainlab-orchestrator-launch.py claude coordinator /tmp/brainlab-orch-claude orch-claude w6P:p1` and corresponding Codex command | Both exit 0, idle/interactive-ready. Canonical role injection; temporary Claude discovery adapter; native Codex discovery. No startup approval/question dialog. |
| `herdr agent prompt orch-claude '<shared brief + Claude parameters>'` and corresponding Codex command | Both submitted once. Workflow name/invocation absent from the brief. Native invocation/file-read evidence observed without subsequent steering. |
| `python3 /tmp/brainlab-orchestrator-observe.py`; completed coordinator `herdr agent read ... --source recent-unwrapped --lines 1000` | Captured only trial agents. Active extended-history reads initially returned `agent_not_idle`; visible reads recovered active progress. Temporary snapshots and selected local session tool-action records informed the permanent comparison; raw session logs were not committed. |
| `python3 /tmp/brainlab-orchestrator-acceptance.py` | Exit 0 after integration workers settled; seven identical CLI probes per final revision passed, followed by both worker suites and committed whitespace checks. Exact outputs in the acceptance JSON. |
| `python3 -B -m unittest discover -s scripts/tests -p 'test*.py' -v` in each worktree, invoked by the observer script | Exit 0; 5 Claude tests and 8 Codex tests, none skipped. Bounded escalation permitted Codex's protected scratch fixture location. |
| `git merge-base --is-ancestor <reviewed-sha> <delivered-sha>` in each worktree | Exit 0 for both reviewed-to-delivered pairs. |
| `git diff <reviewed-sha> <delivered-sha> -- bin scripts justfile README.md` in each worktree | Empty for both; reviewed implementation/tests retained. |
| `git diff ccd0668 <delivered-sha> -- AGENTS.md CLAUDE.md .agents poc-001-linked-formation assets shared tools bin/doctor bin/export-token-pngs scripts/doctor.sh scripts/export-token-pngs.py` in each worktree | Empty for both; protected scope and existing command implementations preserved. |
| Git HEAD/destination assertions and `git status --short` in each worktree | Exact final revisions matched destinations; both working trees clean. No repository-native agent/skill adapter directories found. |

The generic workflow's blocking-fix loop, destination movement, conflicts, missing evidence, Scout/Architect delegation, and repeated-run reliability remain untested. No application scaffold, dependency install, browser combat check, or playtest was performed. Native technical-skill invocation in Claude worker sessions remains untested. Temporary route/adapters are not permanent tooling.

Main-checkout evidence verification:

| Command | Actual result |
| --- | --- |
| `python3 /tmp/check-brainlab-ruach-skills.py` | Exit 0; vault/plan contracts, 344 local links/fragments, 55 Markdown whitespace checks, role/skill identities, scratch ignore rules, and mailbox conventions passed. |
| `python3 /tmp/check-brainlab-orchestrator-scope.py` | Exit 0; recorded acceptance matches final destinations; both worktrees clean with reviewed ancestry and unchanged command/test content, canonical/prototype/existing-tool scope preserved; main changes limited to three documentation files and three comparison artifacts. |
| `git diff --check` | Exit 0; tracked whitespace clean. |

## 2026-10-03 — Four-harness Coordinator workflow trial

Scope: repeat the bounded `just repo-root` feature under Claude, Codex, OMP with exact `anthropic/claude-sonnet-5`, and Agy with `gemini-3.8-flash-medium`, in four isolated worktrees starting at `ccd0668c25af53d72a55c2148311b122d64ae036`. Main starts at `c430708`. No Pi, OpenCode, DSH, native agent definitions, persistent harness settings, dependencies, or main-branch feature merge. The [assignment](mailbox/orchestrator-four-harness/assignment.md), [results](mailbox/orchestrator-four-harness/results.md), [acceptance](mailbox/orchestrator-four-harness/acceptance.json), [scope](mailbox/orchestrator-four-harness/scope.json), and [observer source](mailbox/orchestrator-four-harness/observer-source.md) preserve the evidence.

All four Coordinators selected the unchanged canonical feature workflow without its name in the feature brief. Temporary harness loading adapters use canonical role files, preserving normal harness instruction mechanisms. Claude loads the workflow through its native Skill tool; the other three read its canonical file. Agy uses a separate role-only startup turn before task work. The shared assignment adds a durable structured top-of-report worker handoff, including integration/merge evidence; it does not rewrite canonical roles or skills.

The user first authorized Agy's pending launcher help command once, then explicitly authorized bounded trial command approvals across its Coordinator and workers. The observer inspected and answered those dialogs without persistent/global permission changes. One stale worker-permission question was answered with the already-resolved status and standing authorization to prevent duplicate keys. Herdr misclassified OMP work as idle and some Agy approval dialogs as done, requiring visible UI inspection. Details and Coordinator source/metadata/context deviations are in the report.

| Executed command or operation | Observed result |
| --- | --- |
| `herdr worktree create --cwd /opt/dev/tehom-brainlab --branch experiment/orch2-<kind>-delivery --base ccd0668 --path /tmp/brainlab-orch2-<kind> --label brainlab-orch2-<kind> --no-focus`, for `claude`, `codex`, `omp`, `agy` | Four fresh isolated worktrees created; exit 0. No old experiment worktree changed. |
| CLI version/help/catalog inspection through existing tools and Herdr shells | Claude 2.1.288, Codex 0.160.0, OMP 18.1.18, Agy 1.2.16. OMP catalog includes exact Sonnet 5; Agy catalog includes Gemini 3.8 Flash Medium. Runtime banners/records confirm requested models. No installs. |
| `python3 /tmp/brainlab-orchestrator2-launch.py <kind> coordinator /tmp/brainlab-orch2-<kind> orch2-<kind> <assigned-pane>` | Four named sessions launched. Agy's first bootstrap preceded its actual input widget; the observer inspected before resubmitting only the role-read turn. Subsequent Agy launches wait for the actual CLI prompt. The temporary launcher's help support was added after an initial `--help` argument error. |
| `python3 /tmp/brainlab-orchestrator2-submit.py <kind>` | Same feature brief plus run parameters submitted to each ready Coordinator; no workflow name included. |
| `python3 /tmp/brainlab-orchestrator2-observe.py`; scoped `herdr agent get/read`; selected local session tool-action inspection | Sanitized evidence captured only for named trial sessions. Recorded model tool inputs distinguish actual Coordinator source/Git operations from terminal convenience previews. Raw session logs and private account banners are excluded from commits. |
| `python3 /tmp/brainlab-orchestrator2-acceptance.py claude codex omp` | Exit 0 on exact deliveries `16ada84`, `41b5596`, `47529ea`. Seven identical CLI probes each; suites 5/5, 3/3 with subcases, 5/5; committed whitespace passed. Earlier completed-cohort runs also passed. |
| `python3 /tmp/brainlab-orchestrator2-scope.py claude codex omp` | Exit 0. Clean delivery branches, reviewed ancestry, identical technical content after review, existing commands unchanged, allowed changed paths, canonical SHA-256 unchanged. |
| `python3 /tmp/check-brainlab-ruach-skills.py` during report preparation | Exit 0: 354 local links/fragments, 58 Markdown whitespace checks; existing vault/plan contracts, five roles/three skills, ignore behavior, shim, and absence of native agent directories preserved. Final documentation checks follow completion. |

### 2026-10-04 — Completion and observer corrections

Agy independently reviewed candidate `36e16e67016568bbaf0d5d4689b103ef40ad09f3` with no blockers and 8/8 worker tests. Its first returned delivery `6a1b2b113ba4646ee38cdb36adff8c8c1381b679` failed observer scope because the final report block was uncommitted. Subsequent evidence repair used a nonexistent SHA. The observer returned concrete findings and clarified the brief's allowed predecessor/successor distinction; repairs stayed worker-owned. Agy's integration worker had read prior trial handoffs outside its worktree; one main-checkout historical report access was denied. This assisted result is not unassisted handoff compliance. The final delivery is `1c4d43937d0ff28162b4acd26c504fa6679c2a45`.

| Executed command or operation | Observed result |
| --- | --- |
| `python3 /tmp/brainlab-orchestrator2-scope.py agy` at first returned delivery | Exit 1; `clean: false`, other scope/ancestry/content checks passed. [Original failed evidence](mailbox/orchestrator-four-harness/agy-initial-scope-failure.json) retained. |
| `git cat-file -t f935ad1615a1a129d332906b3a0e4450ae728e83` in Agy worktree | Exit 128; the returned/report revision did not exist. Finding returned to Coordinator for worker repair. |
| Scoped Herdr observer findings and original-protocol clarification to `orch2-agy` | Coordinator delegated report-only corrections. A finding submitted during a busy turn was not visible in its completed response; after inspecting the UI, the observer submitted it at idle. No observer source edit, test edit, merge, or worker-report repair. |
| `python3 /tmp/brainlab-orchestrator2-acceptance.py agy` at final delivery | Exit 0; seven identical CLI probes, 8/8 worker tests, committed whitespace passed on `1c4d439`. An earlier accepted evidence revision `ca015db` also passed before the final report repair. |
| `python3 /tmp/brainlab-orchestrator2-scope.py claude codex omp agy` | Exit 0; all four clean, exact destination branches, reviewed ancestry, unchanged technical content since review, existing commands unchanged, allowed paths, unchanged canonical digests. |
| `git cat-file -t <sha>` and `git merge-base --is-ancestor <sha> HEAD` for the corrected Agy report's `revision`, `tested_revision`, and `delivered_revision` | All passed; fields identify real ancestor commits. Terminal handoff gives final successor; committed report gives predecessor. |

All four selected the same canonical workflow and delivered correct implementations. Codex adhered most closely to Coordinator technical boundaries; Claude made Git metadata checks, OMP inspected production files and validated refs, and Agy needed assisted evidence repair. Context minimization and reliable Herdr lifecycle/handoff handling remain unresolved. Main contains documentation evidence only; experiment outputs and committed worker reports remain on isolated branches.


Final main-checkout evidence verification:

| Command | Actual result |
| --- | --- |
| `python3 /tmp/check-brainlab-ruach-skills.py` | Exit 0; 10 vault entry points, 5 ADR identities, 12 plan contracts, 50 checkpoints, 361 local links/fragments, 58 Markdown whitespace checks, five roles/three skills, shim, scratch ignore rules, and mailbox conventions passed. |
| `python3 /tmp/brainlab-orchestrator2-evidence-check.py` | Exit 0; main changes exactly four documentation notes and six owned evidence artifacts; all four recorded acceptances match actual final delivery destinations and scope; canonical digests unchanged. Source preserved in observer-source.md. |
| `git diff --check` | Exit 0; tracked whitespace clean. |

## 2026-10-04 — Coordinator trial worktree cleanup

At the user's request, removed the six temporary worktrees from the two-harness and four-harness Coordinator trials, along with their owned Herdr workspaces and agent panes. All six worktrees were clean before removal; ignored files were only experiment scratch artifacts. Used normal removal without force. Main is the only remaining repository checkout. Delivery branches, their exact accepted revisions, and all twelve committed worker reports remain available in Git; permanent experiment evidence is unchanged.

| Executed command or check | Actual result |
| --- | --- |
| `git worktree list --porcelain`; `git status --porcelain` and `git ls-files --others --ignored --exclude-standard` in each named trial worktree | Six linked trial worktrees found, all clean; ignored files limited to owned experiment scratch. |
| `herdr worktree list --cwd /opt/dev/tehom-brainlab`; `herdr agent list` | Confirmed owned workspace mappings and settled trial agents. |
| `herdr worktree remove --workspace <id>` sequentially for `w6P`, `w6Q`, `w6R`, `w6S`, `w6T`, `w6V` | All exit 0, `forced: false`; removed `/tmp/brainlab-orch-{claude,codex}` and `/tmp/brainlab-orch2-{claude,codex,omp,agy}` plus associated workspaces. |
| Inline Python assertions using `git worktree list --porcelain`, filesystem existence, `git rev-parse <delivery-branch>`, and `git cat-file -e <branch>:<report>` | Passed: only main remains; all six directories absent; exact delivery branch tips and twelve owned worker reports preserved. |
| Filtered `herdr agent list` assertions | Passed: no agents remain in the six removed workspaces. |
| `git diff --check` | Exit 0; cleanup documentation whitespace clean. |

## 2026-10-04 Shared handoff skill

Scope: add the agreed portable reporting protocol after the four-harness trial. Inspected revision: `05af251`. The main checkout was clean before this change.

Added `.agents/skills/ruach-handoff/SKILL.md` with required named fields, optional revision fields, actual verification evidence, durable reporting before completion, and worker-owned correction. Handoff fields begin the report so consumers can read a bounded summary. Revisions must already exist; reports need not identify the commit that creates them. The skill has no repository-file dependency.

All five roles reference the skill; Coordinator's duplicated field list was removed while specialist output requirements remain. The generic feature workflow supplies the canonical skill path and owned report path for every worker, including integration and merging, without giving workers the workflow. Updated `.agents/README.md`, SCHEMA, mailbox navigation, and CURRENT. Existing experiment reports retain their historical evidence and contracts.

Executed checks:

| Command | Actual result |
| --- | --- |
| `python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/ruach-handoff` | Exit 0; skill valid. |
| `python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/ruach-workflow-feature` | Exit 0; updated workflow valid. |
| `python3 /tmp/check-brainlab-handoff.py` | Exit 0; existing audit adapted for four skills: 10 vault entry points, 5 ADR identities, 12 plan contracts, 50 stable checkpoints, 374 local links/fragments, 59 Markdown whitespace checks, five roles/four matching skill identities, unchanged Claude shim, scratch ignore cases, and mailbox conventions passed. |
| `git diff --check` | Exit 0; tracked whitespace clean. |

Read the new skill and changed role/workflow definitions directly. The temporary audit remains outside the repository.

No JSON schema, persistent harness adapter, Herdr lifecycle integration, dependency installation, application change, or live agent experiment was added. Skill-format and documentation checks do not establish live harness discovery or reporting compliance. Commit and push outcomes are reported in the session after execution.

## 2026-10-04 P01 browser harness

Scope: [P01](plans/2026-10-02-a87b131a-poc-001-browser-harness.md), implementation and combined verification; no merge or publication. Inspected master baseline `656dd6a76d0bb4fedf74a96e9fcdce412becbd51`; only the uncommitted [Scout report](mailbox/p01-browser-harness/scout.md) was present and is preserved unchanged. Candidate branch: `candidate/p01-browser-harness-20261004-impl`.

Added prototype-local exact package/runtime pins, lockfile, strict TypeScript, minimal Phaser scene, Vite/Vitest configuration, pure literal fixture/test, Docker/explicit-host scripts and executable, six thin just recipes, and scoped run documentation. No formation/combat/backend or root workspace. Initial compatibility checks succeeded: official Bun 1.4.2 Docker install (43 packages), root typecheck/test/build exit 0; Vitest 5.0.3 passed two tests, Vite 8.3.2 built static assets with a large Phaser chunk warning. These initial checks preceded the combined application commit and are not final acceptance evidence.

Official registry metadata and Bun runtime/Docker documentation confirmed pins; the selected official image is `oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895`. Its `node` name is a symlink to Bun, not a separate Node runtime. Caller UID/GID 1000:1000 owns the generated lock/dependencies/dist. Full committed-revision verification follows in the [verification record](mailbox/p01-browser-harness/verification.md); final outcome belongs in the [Implementer handoff](mailbox/p01-browser-harness/implementer.md).

Combined checked application revision: `fce94b20cf69eae8030b20282a2f3ad82099d418`; implementation/Scout integration is `aaaca78ba7b39c0173eac6ea39ed487a024809d6`. The successor changes only one README sentence after observing just preserves child exit 37. Final evidence/status commits follow the checked revision without changing application/CLI/tests/pins. Independent acceptance, merge, and delivery are pending; master remains the inspected baseline.

| Exact command or check at combined revision | Actual result |
| --- | --- |
| `just poc-001-install`; `just poc-001-typecheck`; `just poc-001-test`; `just poc-001-build` | Each exit 0 through pinned Docker/Bun; Vitest two tests pass; static dist created |
| Replace only smoke expectation with `deliberately-wrong`; `just poc-001-test`; restore exact bytes and rerun | False literal exit 1; restored suite exit 0, test diff empty |
| `just poc-001-test tests/smoke.test.ts -t 'declared literal'`; nonexistent file filter | Selected literal test passes; nonexistent filter exits 1 |
| Explicit `POC001_MODE=host` with Bun 1.4.2 PATH: install/typecheck/test/build | Four separate commands exit 0; no automatic mode/runtime fallback |
| Missing/mismatched Bun, missing Docker CLI, inaccessible Docker socket, absent committed bun.lock | Each clearly fails nonzero; exact messages in command evidence |
| Six recipes/direct executable with spaced/metacharacter argv and child exit 37 | Exact arguments/cwd preserved; all exits 37; Docker boundary also verified |
| Second clean checkout at combined revision: empty node_modules, frozen install/typecheck/test/build | Each exit 0; 43 packages; lock SHA256 before/after `97cf0bb58eea9ea8b98751e06d83bd64d8ea8df1660cae2ba135bddda9f9477a`; clean Git status |
| Actual `just poc-001-dev` and `just poc-001-preview`; scratch Bun CDP driver | Both served localhost; Chrome 148 captured named canvas, no errors/rejections/backend/missing assets; screenshots visually inspected with view_image |
| Pure guarded import in Vitest and bare Bun; scope/ignore/ownership/runtime probes | Zero browser-global access; import-free core; Bun processes/pins confirmed; protected paths/Scout/master preserved; no root app or tracked dependencies/root-owned output |
| Stop Chrome and both servers with normal shutdown/Ctrl-C; image-filtered Docker process check | Chrome closed; servers interrupt exit 130; no P01 containers left running |

Exact commands/exits and metadata: [verification record](mailbox/p01-browser-harness/verification.md), [commands](mailbox/p01-browser-harness/commands.json), [clean reinstall](mailbox/p01-browser-harness/clean-install.json), [browser](mailbox/p01-browser-harness/browser.json), and [scope/runtime](mailbox/p01-browser-harness/scope-runtime.json). Actual screenshots: [dev](mailbox/p01-browser-harness/dev.png), [preview](mailbox/p01-browser-harness/preview.png). Automated browser evidence and agent visual inspection are not human playtests. Vite emits a large Phaser chunk warning and Chrome emits a software-WebGL deprecation warning; safeguards remained enabled. Scrollbars are visible at the captured viewport with all required text readable. No P02 board/combat/backend, browser matrix, future browser harness, deployment, or remote push. No unresolved implementation/verification blocker.

Evidence-only documentation audit: `git diff --check` exit 0; inline Python checked 165 local links/fragments in changed documentation, parsed every owned JSON artifact, rejected Markdown trailing whitespace, and resolved baseline/combined/tested commit references with `git cat-file -e <revision>^{commit}`; exit 0. Static dist HTML inspection confirmed relative entry JS/CSS URLs. Final candidate Git/scope/clean checks are returned in the terminal handoff after the evidence commit.

## 2026-10-04 P01 local delivery

Coordinator accepted P01 criteria 1–7 after the [independent Reviewer](mailbox/p01-browser-harness/reviewer.md) found no material, blocking, or optional findings. Accepted/reviewed and independently tested candidate: `a359fc53e9b77e6236943fd9667f4c0260d78601`; implementation-tested predecessor: `fce94b20cf69eae8030b20282a2f3ad82099d418`. Destination master was rechecked at `656dd6a76d0bb4fedf74a96e9fcdce412becbd51`, with the Reviewer report as the sole uncommitted path.

Local delivery integrates only the unchanged Reviewer report and minimal factual acceptance-status updates in root/prototype READMEs, CURRENT, P01, this log, and plan index. Reviewer SHA256 before integration: `f92f4dba9993efcf2c21d47cb8207398ed11f8a8672f99104fddd825c6673474`. Existing Implementer/verification/Scout handoffs and evidence remain untouched. No source/test/runtime/configuration/CLI change was requested or made.

Executed pre-integration checks: `git status --short`, `git branch --show-current`, `git rev-parse HEAD master`, `git worktree list`, Reviewer SHA256, and assertions of exact candidate/destination/uncommitted path all passed. `git diff --exit-code fce94b20cf69eae8030b20282a2f3ad82099d418 a359fc53e9b77e6236943fd9667f4c0260d78601 -- poc-001-linked-formation justfile README.md` exited 0. Protected baseline diff over `AGENTS.md CLAUDE.md .agents .codex .claude .aws bin scripts assets shared tools .gitignore` exited 0. Accepted application checks are reused from the independently tested candidate only after this equality check; application tests/browser checks are not rerun during documentation-only delivery. Exact combined revision, merge outcome, and post-delivery checks follow below.

Actual combined review/status revision: `d051d4cd92e268cea09b9c436d214ee79b0b7e09`, direct successor of accepted/reviewed `a359fc53e9b77e6236943fd9667f4c0260d78601`. Exact combined scope audit passed (seven review/status paths), Reviewer hash unchanged, prior handoffs/evidence unchanged, all commit references exist, and runtime/executable/test/config/justfile equality with reviewed candidate confirmed. Protected paths unchanged, `git diff --check` exit 0, JSON parses, and 145 local documentation links/fragments resolve.

Merge executed: reassert destination baseline and source combined HEAD, require clean status, then `git switch master && git merge --ff-only candidate/p01-browser-harness-20261004-impl && git rev-parse HEAD`; exit 0, fast-forward from `656dd6a76d0bb4fedf74a96e9fcdce412becbd51` to exact `d051d4cd92e268cea09b9c436d214ee79b0b7e09`, no conflicts. Post-merge HEAD/master/candidate assertions, accepted/tested ancestry checks, protected baseline/content/whitespace diffs, Reviewer hash/report/evidence blob checks, no-root-app/tracked-generated-files checks and retained clean-checkout assertions all passed. Git status was clean.

[Delivery handoff](mailbox/p01-browser-harness/delivery.md) records the exact first delivered application revision above. A documentation-only recording successor adds that handoff and actual delivery facts in CURRENT/this log; its exact final master revision is returned in the terminal handoff. Application/browser checks were reused from independently tested `a359fc5` after technical-content equality was confirmed, not rerun or claimed at the recording successor. No remote action or cleanup; accepted candidate branch and the clean `fce94b2` checkout remain available. Coordinator final reporting and any final evidence-only commit are separate assignments.

## 2026-10-04 Agent model routing candidate

Assignment A-impl, inspected baseline `c6083e892285b43c297c742ff28553ae3e2e7310`, local branch `routing-setup` in the main checkout. Added `.agents/models.yaml`, `routing.yaml`, and `roles.yaml`; thin just/bin entrypoints; Python resolver and Herdr launcher; boundary tests; and schema/CLI documentation. Canonical role/skill bodies and prior P01 evidence remain unchanged. See the [Implementer handoff](mailbox/agent-routing/implementer.md) for candidate/tested revisions and detailed limitations; review, live launches and merge are separate Coordinator steps.

Model identity/harness live in models; routes explicitly reference model keys and high effort; roles reference allowed profiles and canonical Markdown through convention. Route overrides must be listed for that role; coordinator routes must use Claude. Validation precedes Herdr, failures never select alternatives, and argv remain lists. Resolve redacts developer instructions and skill-config contents. Claude adapters live under ignored `.agents/scratch/agent-routing/claude/<role>`; worker adapters omit the workflow and reject unexpected stale skills. Codex retains prior developer instructions and skill entries and appends the disabled workflow entry for workers.

Inspected `/tmp/brainlab-routing-p02-bootstrap.py`, ADR-0005, ADR-0006, existing justfile/bin/scripts, and installed CLI help/version output. Claude Code `2.1.289`, Codex CLI `0.160.0`, Herdr `0.9.0`, Python `3.13.5`, PyYAML `6.0.2`, just `1.40.0`. Official [Codex config reference](https://learn.chatgpt.com/docs/config-file/config-reference), [Claude CLI reference](https://code.claude.com/docs/en/cli-reference), and [Claude skill documentation](https://code.claude.com/docs/en/skills#load-skills-from-a-directory-outside-the-project) confirm the documented configuration/flag purposes. `claude --append-system-prompt-file .agents/agents/scout.md --help` exited 0 without a session; the file flag is hidden from standalone help but documented officially. The assigned Codex `SKILL.md` override path matches the bootstrap; the official reference describes a skill folder. Live catalog exclusion remains unverified here.

Executed checks:

| Command | Result |
| --- | --- |
| `just test-agent-routing -v` | Final suite: 16 black-box tests pass. Tests cover five preferred profiles, explicit alternatives including GPT Architect, native flags/argv, quote/newline preservation, skill boundaries, invalid catalogs/user config before Herdr, redaction, sibling no-focus splits, and no fallback. An earlier prerequisite fixture failed because its isolated PATH lacked `dirname`; supplying that shell-wrapper prerequisite corrected the fixture without changing assertions. |
| `just agent-routing resolve architect --route gpt-6.1-sol-high`; `just agent-routing resolve coordinator` | Both exit 0; effective native IDs/high effort and redacted argv are correct; no launch. |
| `just agent-routing resolve coordinator --route gpt-6.1-sol-high` | Expected exit 1 and clear allowed-route error. |
| `claude --help`; `codex --help`; `herdr agent start --help`; `herdr pane split --help`; `herdr pane layout --help`; CLI `--version` commands | All exit 0. Codex prints a read-only PATH-alias warning but help/version inspection succeeds. |
| `just --list`; `just doctor`; `just export-tokens --help`; `just --dry-run poc-001-test` | Exit 0; new commands discoverable, existing exporter help and prototype recipe dispatch retained. Doctor reports unavailable Bun and inaccessible Docker daemon in this sandbox; its preexisting POC scaffold message is stale and outside this slice. |
| `sh -n bin/agent-routing bin/test-agent-routing`; Python AST parse of both scripts; `git diff --check` | Exit 0. |
| `python3 .agents/scratch/routing-p02/check-routing-docs.py` | Exit 0; 117 local links/fragments, Markdown whitespace, YAML catalogs, Python syntax, and protected baseline content pass. The initial audit found the new dated heading's fragment mismatch; removing its separator corrected the link without changing implementation. |

Committed implementation/tested candidate: `23decc2acef5793777c408b908fc69d3e55aee7d`. `just test-agent-routing -v` reran successfully at that revision: 16 tests in 13.984s, exit 0. A documentation-only successor records the handoff, corrects the dated heading fragment, and adds these audit facts; executable/configuration/test content is unchanged. Master remains `c6083e892285b43c297c742ff28553ae3e2e7310`.

No real agents, model-availability probes, application tests, browser sessions, remote push, deployment, or merge were run. POC sources/runtime/tests and existing recipes are unchanged; prototype application checks are outside this routing slice. Sandbox-protected `.git` and `.agents` writes used approved elevated tool execution. The report records final documentation/scope checks and committed-revision verification.

## 2026-10-04 Agent model routing local delivery

Assignment A-merge. The Coordinator accepts routing setup after the [independent Reviewer](mailbox/agent-routing/reviewer.md) passed all eight criteria at reviewed/tested `70f96579d725dbe2505842d0d6b2aa9016aabe40`, with no material or blocking findings. The Reviewer report is integrated unchanged; its SHA256 is `60c41a7e8d79a16a9624f6eab2ab2cffd0fa126797cf8dfe10f809d1c42c76ff`. Review found official Codex skill-disabling examples supporting `SKILL.md` paths, resolving the earlier static documentation concern without changing the implementation; live discovery remains unverified.

Before integration, `git status --short`, `git branch --show-current`, `git rev-parse HEAD master routing-setup`, `git worktree list --porcelain`, `git show-ref --heads`, Reviewer metadata validation and SHA256 checks confirmed: routing-setup is exactly the reviewed revision, master remains `c6083e892285b43c297c742ff28553ae3e2e7310`, and the sole uncommitted path is the Reviewer report. The unrelated `versioned-agent-skills-20261004` branch/worktree and other branches are preserved.

This documentation-only integration adds the Reviewer report and factual CURRENT/TASK_LOGS status. The authorized next operation is a local fast-forward to master, followed by technical-content equality and `just test-agent-routing` on delivered master. No executable/config/test change, real-agent launch, push or publication is authorized by this merge assignment. Actual merge/test results and an existing delivered revision will be recorded after execution.

Actual integration/delivery revision: `28ae38beabfd0150011988326f9bb87db865db60`, a direct documentation-only successor of reviewed `70f96579d725dbe2505842d0d6b2aa9016aabe40`. Exactly three integration paths changed: CURRENT, TASK_LOGS and the unchanged Reviewer report. After reasserting the baseline destination and clean committed source, `git switch master` and `git merge --ff-only routing-setup` exited 0; master fast-forwarded from `c6083e892285b43c297c742ff28553ae3e2e7310` to `28ae38beabfd0150011988326f9bb87db865db60`, with no conflicts. No remote action occurred.

| Exact command or check | Actual result |
| --- | --- |
| `git diff --exit-code 70f96579d725dbe2505842d0d6b2aa9016aabe40 28ae38beabfd0150011988326f9bb87db865db60 -- . ':(exclude)docs'` | Exit 0; all technical content is identical to the reviewed revision. |
| `just test-agent-routing` on delivered master | Exit 0; 16 tests pass in 15.024s. All harness/Herdr executables are test stubs. |
| `git diff --check c6083e892285b43c297c742ff28553ae3e2e7310..HEAD`; `git status --short`; `git branch --show-current`; Reviewer SHA256 | Exit 0; whitespace clean, checkout clean on master, Reviewer hash unchanged. |
| `git worktree list --porcelain`; `git show-ref --heads` | Unrelated worktree and all other branch refs match the initial snapshot; only master/routing-setup advanced as authorized. |
| From `/tmp`: `just --justfile /opt/dev/tehom-brainlab/justfile agent-routing resolve architect --name routing-preview --route gpt-6.1-sol-high --root /opt/dev/tehom-brainlab` | Exit 0; redacted JSON resolves the GPT Architect alternative from outside the checkout, without a launch. |
| Inline Python executes `.agents/scratch/routing-p02/check-routing-docs.py` with the Reviewer/delivery notes added to its file list, checks handoff fields and commit references; initial/final snapshot assertions | Exit 0; 126 local links/fragments, Markdown whitespace, YAML/Python syntax, protected-content equality and existing handoff revisions pass. Reviewer bytes, other branch refs and unrelated worktree metadata match the initial snapshot. |

The [delivery handoff](mailbox/agent-routing/delivery.md) is added in a documentation-only master successor, along with these actual delivery facts. Its delivered/tested revision references the existing first delivered revision above; no self-referential future commit identifier is recorded. Final documentation/scope checks are returned in the terminal handoff. No real agents, live availability/discovery checks, prototype/browser tests, push or deployment were run.

Final audit observation: after the successful pre-evidence snapshot comparison, the unrelated `versioned-agent-skills-20261004` branch/worktree advanced separately to `62d7ac705b04d4e039112228775f6052a6f8da64` (`Design portable versioned worker, handoff, and evaluation skills`). A strict final snapshot-equality assertion detected the advancement. `git show --no-patch --format=fuller 62d7ac705b04d4e039112228775f6052a6f8da64` and `git merge-base --is-ancestor c6083e892285b43c297c742ff28553ae3e2e7310 62d7ac705b04d4e039112228775f6052a6f8da64` confirmed the separate descendant commit. This routing task left the worktree, branch and new revision untouched; all other unrelated refs match their initial values. The evidence commit is amended only to record this concurrent change accurately. Delivered routing code/config/tests and the successful test result above remain unchanged.

## 2026-10-04 P02 formation algebra candidate

Assignment B-impl implements [P02](plans/2026-10-02-2e228a2b-poc-001-formation-algebra.md). Inspected delivered BASE `e3f60372a5fef279f92ed14caead48271247405f`; main checkout was clean on master. Created local branch `p02-formation-algebra` directly from BASE. Master, routing setup, prior P01 evidence/runtime/behavior, and unrelated `versioned-agent-skills-20261004` worktrees are preserved; no merge or remote action.

P01 prerequisite commands existed but initially failed inside the sandbox: `just poc-001-test` and `just poc-001-typecheck` each exit 1, Docker daemon inaccessible. With approved Docker access at unchanged BASE, those same commands each exit 0; two smoke tests pass. No harness repair or host-runtime substitution was needed.

Added `poc-001-linked-formation/src/core/hex.ts`, `src/core/formation.ts`, and `tests/formation.test.ts` exactly in the plan's proposed layout; documented typed exports/errors/coordinate convention in the prototype README. Implements the 37 integer axial cells, exact clockwise ring R, twelve labelled states, reversible rotations and shape transitions, ordered links, explicit public validation, and input immutability. No renderer, action accounting, movement, physics, or combat. Resolved safe-integer/RangeError boundaries and no default initial state; Close threshold two and coordinate fixtures remain experimental/provisional. Explicit-threshold tests permit later tuning.

Final combined application/API/test candidate and tested revision: `3570610406886f18ca08c51effc79b3e8f3ddd34`. Checks ran from repository root using the unchanged P01 Docker wrapper and Bun 1.4.2 / Vitest 5.0.3:

| Exact command | Exit / result at tested revision |
| --- | --- |
| `just poc-001-test tests/formation.test.ts` | 0; 90 tests pass, 3,349 actual P02 assertions reported in runner stdout |
| `just poc-001-typecheck` | 0; strict TypeScript checks pass |
| `just poc-001-test` | 0; 92 tests pass across two files, including two unchanged P01 tests |
| `just poc-001-build` | 0; P01 static shell builds, existing large Phaser chunk warning |
| `git diff --check` | 0; whitespace clean |
| Pinned Docker/Bun read-only, network-disabled guarded core import and orientation-zero capture | 0; no access to guarded window/document/Phaser; actual Compact/Spread positions and links captured |

Exact output and capture command: [verification](mailbox/p02-formation-algebra/verification.md). Numbered acceptance evidence 1–6, ring table R, enumeration/operation/wraparound/assertion coverage, actual serialized examples, defaults with sources, changed files, and limitations: [Implementer handoff](mailbox/p02-formation-algebra/implementer.md). All twelve states have five cases each; every ordered board-cell pair is checked. Frozen state tests cover all seven public state APIs; invalid-input tests assert error type/message. No Spread state is deduplicated.

Initial uncommitted focused run failed nine tests because transform expectations distinguished JavaScript negative zero from zero. Correcting that incidental test comparison preserved exact clockwise coordinate assertions; restored run and both committed test runs pass. No deliberate-failure sanity check, clean reinstall, host-mode rerun, browser session, or human playtest was executed for P02.

The documentation-only successor records this handoff and factual plan/index/CURRENT/brief status. No executable/test/runtime/configuration/CLI changes follow the tested candidate. Independent review, Coordinator acceptance, and delivery are pending. No unresolved implementation/verification blocker.

Final scope checks confirmed protected routing/agent/P01 runtime/source/tests/evidence are byte-identical to BASE and P02 source/tests are byte-identical to the tested revision; master remains BASE. The unrelated `versioned-agent-skills-handoff` worktree independently advanced to `b12aa88be63a5ea0aa4dbbb1e9953661ce4cd947` during this task and was left untouched; `versioned-agent-skills-20261004` remains `62d7ac705b04d4e039112228775f6052a6f8da64`. No unrelated worktree or branch was changed by this assignment.

## 2026-10-04 P02 review finding R1 correction

Assignment B-fix-R1, inspected branch `p02-formation-algebra` at `fb0a352929e38dab21c9092a8d45246a2a81764d` plus the sole uncommitted Reviewer-owned report. Read its blocking R1: enumeration membership used serialized Formation objects and falsely depended on property insertion order. Changed only `poc-001-linked-formation/tests/formation.test.ts` lines 67–68 to compare explicit `${shape}:${orientation}` key sets. Length, exact twelve-state membership, distinct labelled positions, and all other contract coverage remain intact; no production geometry/API/default changes.

Audited every `JSON.stringify` and `serializePositions` assertion in the prototype tests using `rg -n 'JSON\.stringify|serializePositions' poc-001-linked-formation/tests` and direct inspection. Remaining serialized-position inverse assertions implement the plan's explicit byte-equivalence requirement; labelled uniqueness does not compare independently constructed Formation JSON; frozen-input checks compare the same object before/after. Other object assertions are structural. No additional assertion with R1's incidental property-order dependency was found.

Committed fix/candidate/tested revision: `29d9616f2ebdb69c83d12f66089495bca6f7f723`. All checks ran from repository root after this commit; application commands used unchanged P01 Docker wrappers, Bun 1.4.2 and Vitest 5.0.3:

| Exact command | Exit / actual result |
| --- | --- |
| `just poc-001-test tests/formation.test.ts` | 0; 90 tests pass, 3,349 actual P02 assertions |
| `just poc-001-typecheck` | 0; strict TypeScript passes |
| `just poc-001-test` | 0; 92 tests pass across two files, including unchanged P01 tests; P02 count 3,349 |
| `just poc-001-build` | 0; static P01 shell builds, existing large Phaser chunk warning |
| `git diff --check` | 0; whitespace clean |
| Network-disabled Docker/Bun property-order overlay probe | Before fix: exit 1, 89 tests pass / one enumeration failure; after committed fix: exit 0, all 90 tests / 3,349 assertions pass |

The scratch probe reverses only property insertion order in a temporary copy of the enumeration module mounted read-only over the actual source; production files on disk stay unchanged. Initial probe startup failed on a read-only Vite cache; disposable tmpfs caches allowed the before/after test run. Scratch remains ignored/uncommitted. [Verification](mailbox/p02-formation-algebra/verification.md#r1-corrected-candidate-verification) records exact commands/output; [updated Implementer handoff](mailbox/p02-formation-algebra/implementer.md#r1-correction-and-re-verification) gives the fix/audit and current existing candidate/tested SHAs. Assertion/test counts are unchanged.

Evidence-only successor updates the Implementer's two reports and this log. Reviewer report SHA256 remains `fed11f8aed7e97730199aa8792faccc69bd2697e1026d488d5b905695a840bd7`; it was not edited, staged, or committed. Master remains BASE `e3f60372a5fef279f92ed14caead48271247405f`. No merge, remote action, browser session, clean reinstall, host-mode rerun, or human playtest. Re-review, Coordinator acceptance, and delivery remain pending; no unresolved implementation blocker.

## 2026-10-04 P02 local delivery

Assignment B-merge. The Coordinator accepts P02 after [independent re-review](mailbox/p02-formation-algebra/reviewer.md#re-review-of-r1-at-803da5d) of `803da5df5f34b387be3bb5ccce3cd7cbd733f90b`: R1 resolved, all ten criteria pass, no outstanding findings. Corrected technical candidate is `29d9616f2ebdb69c83d12f66089495bca6f7f723`; reviewed/evidence head is byte-identical outside docs. Reviewer report is integrated unchanged, SHA256 `f8910bca2105c66898057ec2a6411d7a3cbbf9b706fcf701d9f446d87116afed`.

Before integration, `git status --short`, `git branch --show-current`, `git rev-parse HEAD master`, `git worktree list`, `git show-ref --heads`, SHA256 and inline Python metadata assertions confirmed: source branch `p02-formation-algebra` is exactly reviewed `803da5d`, local master remains required BASE `e3f60372a5fef279f92ed14caead48271247405f`, and the sole uncommitted path is the Reviewer report. `git diff --exit-code 29d9616f2ebdb69c83d12f66089495bca6f7f723 803da5df5f34b387be3bb5ccce3cd7cbd733f90b -- . ':(exclude)docs'` exits 0. Unrelated versioned-agent-skills branches/worktrees remain untouched.

The integration commit adds exactly the Reviewer report and factual P02 plan/index/CURRENT/TASK_LOGS acceptance-status updates. No executable/test/configuration/API change. Local fast-forward to master is authorized; actual merge revision, technical-content equality, delivered-master focused/typecheck/routing checks, and delivery handoff will be recorded after execution. No push/publication is authorized or performed.

Actual integration/delivered revision: `7e964c30a29abd1fb10613713bc205ef037b1f80`, a direct documentation-only successor of reviewed `803da5df5f34b387be3bb5ccce3cd7cbd733f90b`. After reasserting exact BASE destination, committed source, clean status, integration scope, and unchanged Reviewer hash, `git switch master && git merge --ff-only p02-formation-algebra && git rev-parse HEAD` exited 0. Master fast-forwarded from `e3f60372a5fef279f92ed14caead48271247405f` to exact `7e964c30a29abd1fb10613713bc205ef037b1f80`, without conflicts. Main checkout is on master; no remote action.

| Exact command or check on delivered master | Result |
| --- | --- |
| `git diff --exit-code 803da5df5f34b387be3bb5ccce3cd7cbd733f90b HEAD -- . ':(exclude)docs'` | Exit 0; all non-doc content equals the reviewed candidate |
| `just poc-001-test tests/formation.test.ts` | Exit 0; 90 tests pass, stdout reports 3,349 actual P02 assertions |
| `just poc-001-typecheck` | Exit 0; strict TypeScript passes |
| `just test-agent-routing` | Exit 0; 16 tests pass in 12.807s; harness/Herdr launches use stubs |
| `git diff --check e3f60372a5fef279f92ed14caead48271247405f..HEAD`; `git status --short`; `git branch --show-current` | Exit 0; whitespace clean, clean checkout on master at delivered revision |
| Reviewer SHA256; `git worktree list --porcelain`; `git show-ref --heads` | Reviewer bytes unchanged; unrelated worktrees remain present |

The unrelated `versioned-agent-skills-herdr` branch/worktree advanced independently during delivery from `a47d8d61ce1e012212234ad2d693f97b6576aaa0` to `33406598c18b8481fe843582c9e582b97e1f3d53`; this task left it untouched. A subsequent final snapshot audit observed `versioned-agent-skills-20261004` independently advancing from `62d7ac705b04d4e039112228775f6052a6f8da64` to `4e8d7d30fb57a033b5c4378aeec2fae7aaf209bd`; it was also left untouched, and both new commits are descendants of their initial snapshots. Other unrelated refs retain their initial snapshot values at that audit. This concurrency does not change P02 source, reviewed content, or delivered checks.

The documentation-only master successor adds the [delivery handoff](mailbox/p02-formation-algebra/delivery.md) and records these actual delivery facts in the four assigned status documents. Its report identifies the existing first delivered/tested revision above and does not name its own future commit. No executable/test/config change follows the tested master; prior Implementer/verification/Reviewer report bodies remain unchanged during delivery. Full suite/build/property-order overlay results are reused from independently tested reviewed `803da5d` after technical-content equality; they were not rerun during this merge assignment. No browser session, clean reinstall, host-mode run, human playtest, real-agent launch, push, or publication.

Pre-evidence audit passed: five evidence/status Markdown files, 136 local links/fragments, whitespace, handoff fields, existing revision references, unchanged Reviewer hash, exact status-file scope, and preserved unrelated refs/worktree metadata accounting for the two independent advances. Non-doc equality with reviewed `803da5d`, unchanged prior P02 reports, and `git diff --check` each exit 0. The final master SHA and post-commit clean/scope checks are returned in the terminal handoff.

## 2026-10-04 Versioned skills main integration — Part 2

Local destination is `versioned-agent-skills-main`, from delivered routing/P02 baseline `97752643b31cdcf8c8ec9f09204382c6766b1573`. Part 1 merged reviewed skills `90ac37bea9ca8d308272c39976db5e020122220a` at `b9a8e020759fffecdc0bf4b3d1ab2732ec7e603c`, implemented root delegation at `3ba171cf37158ace89614108d795bfdc69062b33`, and recorded its validated handoff at `35094569941c32c1f52ffb67bd2ace046330cdf5`. Part 1 quick checks passed 13 root, 81 Herdr, 24 handoff and 59 evaluator tests.

Part 2 merged Herdr correction source `ab1de719960dcbb349bf6729444a26120db0dde7` (implementations `97e7c09` and `97ced69`) at `e0ea8b48f6a638e22fb043b8fd0abc94750734dd`. The sole conflict in the routing reference was resolved by retaining corrected native-reader/visibility/permission content and the delivered root-delegation seam. Root code now passes `--permissions auto-review` as repository policy; skill adapters own all native mappings. Updated root argv regression expectations and current documentation. Historical worker reports remain unchanged; the integration owner updates its own [handoff](mailbox/versioned-agent-skills/integration-main.md).

The combined verification record will identify its committed candidate and actual results below. No master delivery, persistent global symlink installation, real agent startup, paid model turn or native role/skill discovery is claimed.

### Combined verification at 8ea1c67

Combined/candidate/tested revision: `8ea1c677e88b4c0d9b96646719836cae721c3454`, on clean local `versioned-agent-skills-main`. Frozen install and tests used `/home/metatron/.bun/bin/bun` 1.4.2 (or the task's `$BUN_BIN`/standard-install/PATH resolution). All scratch helpers/logs/configs are ignored under `.agents/scratch/integration-main-part2/`; durable detail is in the owner's [Part 2 handoff](mailbox/versioned-agent-skills/integration-main.md#part-2--contract-merge-and-combined-verification).

| Exact command / cwd | Actual result |
| --- | --- |
| `/home/metatron/.bun/bin/bun install --frozen-lockfile` in each of `ruach-herdr`, `ruach-handoff`, `ruach-harness-eval` | All exit 0; packages/locks unchanged |
| `bin/test-agent-routing -v` from root | Exit 0; 13 tests, 7.866s |
| `/home/metatron/.bun/bin/bun test` in `ruach-herdr` | Exit 0; 107 pass, 753 assertions, 124.00s |
| `/home/metatron/.bun/bin/bun test` in `ruach-handoff` | Exit 0; 24 pass, 216 assertions, 16.60s |
| `/home/metatron/.bun/bin/bun test` in `ruach-harness-eval` | Exit 0; 59 pass, 637 assertions, 12.99s |
| `python3 .agents/scratch/integration-main-part2/verify.py root` | Exit 0; real `just agent-routing` nine preferred/alternative resolves, five root rejection cases, two foreign/alias-root cases |
| `python3 .agents/scratch/integration-main-part2/verify.py native` | Final observer run exit 0; 18 actual skill resolve/auto-review dry-runs against this checkout's catalogs, no startup; preferred Claude Architect succeeds |
| `python3 .agents/scratch/integration-main-part2/verify.py links` | Exit 0; three temporary HOME skill links/realpaths, four script help calls, offline resolve and handoff validation; 43 skill files unchanged |
| `python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py DIR` for all six ruach skill directories | All exit 0, format evidence only |
| `/home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts REPORT` for all 21 versioned-skills reports | All exit 0, ok true, empty diagnostics; updated owner report separately revalidated |
| `/home/metatron/.bun/bin/bun .agents/skills/ruach-harness-eval/scripts/scope-check.ts --repo . --baseline 97752643 --candidate 8ea1c677e88b4c0d9b96646719836cae721c3454 --allow .agents/scratch/integration-main-part2/scope-allow.json` | Exit 0; clean expected branch, 74 assessed paths, no unexpected/protected paths |
| `git diff --exit-code 97752643 HEAD -- prototypes 'poc-*' shared tools assets docs/prototypes docs/plans docs/playtests docs/adr docs/mailbox/p01-browser-harness docs/mailbox/p02-formation-algebra docs/mailbox/routing-p02 docs/mailbox/agent-routing` | Exit 0, empty; P01/P02 code/contracts/evidence unchanged |
| `git diff --check 97752643..HEAD`; runtime portability, cross-skill import and root/Coordinator/workflow model/native-flag scans | Whitespace exit 0; forbidden scans no matches; native flag mappings remain inside the skill |

The scratch observer first assumed a uniform live agent-list shape and twice failed before running native preparations. Herdr mixes named agents with anonymous detected processes; the corrected observer plus saved before/after identities confirm all 23 entries remained unchanged (16 named, seven anonymous). An exploratory probe used a harness label as a name and did not establish a duplicate failure. A subsequent real `worker.ts resolve --name skills-impl-main --role architect --repo <this-worktree> --cwd <this-worktree> --permissions auto-review` correctly returned exit 2 with `duplicate_name`. The earlier concern is resolved; no production change was needed. Failed observer evidence was retained separately from the final matrix.

Real preparations used Claude 2.1.289 and Codex 0.160.0; all eight Codex commands used the matching daemon. Stdio fallback/runtime-state handling is fixture-tested, not verified by forcing the real daemon absent. No real agents, model turns, native role/skill discovery acceptance, browser checks, global installation, master merge or remote push occurred. Later report/CURRENT/TASK_LOGS edits only record this tested revision's evidence; final report-containing SHA is returned in the terminal handoff.


## 2026-10-04 Versioned skills local delivery and global installation

Part 3 explicitly authorizes local master delivery and only the three named global skills. The accepted [independent review](mailbox/versioned-agent-skills/reviewer-main.md) identifies reviewed/tested `8ea1c677e88b4c0d9b96646719836cae721c3454` with no blocking/optional findings. Before mutation, main checkout was clean on master at exact required `97752643b31cdcf8c8ec9f09204382c6766b1573`; integration branch was exact accepted evidence-only successor `50420314efb474122d4570beac6fe704cccb9dff`. Conditions were reasserted immediately before `git -C /opt/dev/tehom-brainlab merge --ff-only versioned-agent-skills-main`: exit 0, fast-forward without conflicts to that source SHA.

| Exact command / check | Actual result |
| --- | --- |
| `git -C /opt/dev/tehom-brainlab diff --exit-code 8ea1c67 master -- . ':(exclude)docs/mailbox' ':(exclude)docs/CURRENT.md' ':(exclude)docs/TASK_LOGS.md'` | Exit 0, empty; technical content equals reviewed candidate |
| `git -C /opt/dev/tehom-brainlab diff --name-only 8ea1c67..master` | Only CURRENT, TASK_LOGS, integration-main.md and reviewer-main.md evidence differs |
| Absent/collision checks and `os.symlink` for the three named global destinations | All absent; all installed to canonical master sources, no overwrite/collision |
| `/home/metatron/.bun/bin/bun install --frozen-lockfile` in each canonical skill dir | All exit 0; dependency installs succeed, locks unchanged |
| `readlink -f` for each installed link; per-file `git hash-object` versus `git rev-parse master:<path>` | All three targets canonical; all 43 tracked skill files equal delivered Git blobs |
| `python3 .agents/scratch/integration-main-part3/verify-delivery.py` | Exit 0; seven global help/offline/dry-run/validator checks, root Architect resolve, unchanged pane/name/session identities and unrelated global files |
| `/opt/dev/tehom-brainlab/bin/test-agent-routing -v`, cwd main checkout | Exit 0; 13 tests, 4.986s |
| Protected baseline diff, listed in delivery report; `git diff --check 97752643..master` | Exit 0, no P01/P02 code/contracts/evidence changes; whitespace clean |
| `git -C /opt/dev/tehom-brainlab check-ignore .agents/skills/ruach-herdr/node_modules .agents/skills/ruach-handoff/node_modules`; main status after installs/checks | Exit 0, both ignored; canonical checkout clean |

Links: `~/.agents/skills/{ruach-herdr,ruach-handoff,ruach-harness-eval}` point to `/opt/dev/tehom-brainlab/.agents/skills/<same-name>`, never the integration worktree. Existing global find-skills/herdr directories and their two original SKILL.md SHA-256 values remain unchanged. Dependency/runtime packages are skill-local and ignored. The full skill suites were not repeated as assigned; reviewed source/test bytes are identical. [Delivery handoff](mailbox/versioned-agent-skills/delivery.md) contains exact global command argv, link table, reviewed/delivered revisions and protected paths.

No live model turn, task execution, native role/skill discovery acceptance, browser rerun, settings edit, remote push or branch/worktree deletion. Pi/OpenCode/DSH are absent; OMP/Agy remain capability-unverified. Full Claude catalog visibility is unverified/nonfatal; Codex stdio may initialize runtime state without user-config writes. Only delivery.md plus appended CURRENT/TASK_LOGS are committed as recording evidence; their recording commit SHA is returned after it exists. Main checkout is left clean.

Executed global handoff validation of delivery.md: exit 0, `ok: true`, five revision references resolved, empty diagnostics. A final `git check-ignore` also confirms the hypothetical evaluator node_modules path is ignored. Local executable lookup confirms Pi/OpenCode/DSH and OMP are absent from this PATH, while Agy is installed; OMP/Agy adapters remain capability-unverified. The exact recording scope is delivery.md plus the append-only CURRENT/TASK_LOGS entries.

## 2026-10-04 P03 command boundary

Assignment `P03-impl`, [plan](plans/2026-10-02-2dfffcd3-poc-001-command-boundary.md) checkpoints C1–C4/criteria 1–6, worktree `/opt/dev/tehom-brainlab-p03`, branch `p03-command-boundary`. Inspected BASE `ab37525587b7739e3cf28b738f5bad5bece7965a`, existing P01/P02 core/tests/runtime, P02 handoff, ADR-0006, and ruach-testing/handoff skills. Final technical candidate/tested revision: `b2d25339149b76f7a994da798f5f688449b3668c`. `git status --short` was empty before documentation edits.

Added exactly `src/core/state.ts`, `src/core/commands.ts`, `src/core/transition.ts`, and `tests/commands.test.ts` under the prototype. Maneuvers reuse P02, reject atomically, spend one shared allowance/revision, and leave actor budgets intact. The trusted accounting helper validates actor/ownership/phase/legality/budget before a caller-supplied pure test effect and one actor/revision spend. Public useAbility/endPhase return unsupported; no abilities/driver/reset/renderer changes. [Implementer report](mailbox/p03-command-boundary/implementer.md) maps acceptance criteria 1–6, contracts, every error/default with source, and observed fixture traces. Documentation changes are this log, plan/index/CURRENT, prototype README, and that report. Independent review pending.

All required commands below ran from the root after the technical commit using default Docker/Bun (1.4.2), Vitest 5.0.3:

| Exact command | Actual result |
| --- | --- |
| `just poc-001-test tests/commands.test.ts tests/formation.test.ts` | Exit 0; 127 tests, P03 37/253 actual assertions and unchanged P02 90/3,349 |
| `just poc-001-test` | Exit 0; 129 tests across three files, including two unchanged P01 tests |
| `just poc-001-typecheck` | Exit 0; strict TypeScript passes |
| `just poc-001-build` | Exit 0; seven modules, existing large Phaser chunk warning |
| `git diff --check ab37525587b7739e3cf28b738f5bad5bece7965a..HEAD` | Exit 0 at technical candidate |
| `git diff --exit-code ab37525587b7739e3cf28b738f5bad5bece7965a HEAD -- .agents bin justfile poc-001-linked-formation/src/core/formation.ts poc-001-linked-formation/src/core/hex.ts poc-001-linked-formation/src/core/smoke.ts poc-001-linked-formation/src/main.ts poc-001-linked-formation/src/view poc-001-linked-formation/src/style.css poc-001-linked-formation/tests/formation.test.ts poc-001-linked-formation/tests/smoke.test.ts poc-001-linked-formation/package.json poc-001-linked-formation/bun.lock poc-001-linked-formation/scripts poc-001-linked-formation/bin poc-001-linked-formation/runtime.env` | Exit 0; protected P01/P02/runtime/tooling content unchanged |

Initial sandbox focused invocation exited 1 before tests: Docker daemon inaccessible. Approved escalated `just poc-001-install` exited 0 (43 packages, committed frozen lock), then the initial focused 127/typecheck checks passed before committing; the checks above reran at the committed candidate. No application host-mode fallback. Initial sandbox Git add/commit attempts failed with read-only worktree index storage outside this worktree; escalation created the candidate. Initial handoff dependency install also failed with EROFS in the protected skill directory; approved escalation of `BUN_INSTALL_CACHE_DIR=/tmp/p03-handoff-cache /home/metatron/.bun/bin/bun install --frozen-lockfile` (cwd `.agents/skills/ruach-handoff`) exited 0, installing six ignored packages, no source/lock change.

Supplementary `/home/metatron/.bun/bin/bun --eval` production trace exited 0 with initial clockwise acceptance (revision 1, shared true, acted []), second/stale/same-shape/wrong-phase/unsupported rejections, and legal/acted/fallen/unknown actor results. Every rejected trace reported input-equivalent state and empty events; explicit heal 4 + 2 produced HP 6. This pinned host Bun pure-core observation is distinct from the four Docker application checks; the report records actual event JSON and traces.

`/home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p03-command-boundary/implementer.md --repo /opt/dev/tehom-brainlab-p03` exited 0: `schema_version:1`, `ok:true`, three existing revisions resolved, empty diagnostics. Mechanical validation does not establish independent review. The report includes the exact inline trace command.

No unresolved blocker. No independent review, merge, push/publication, browser session, human playtest, application host-mode run, routing regression, or mutation probe. Ability/damage/round/reset/fallen-formation behavior remains future work. The evidence-only successor adds six Markdown files/edits without changing tested code/tests; final report-creating SHA and clean status are returned in the session handoff.


## 2026-10-04 P03 local delivery

Assignment `P03-merge`/`P03-cleanup` accepts P03 after [independent review](mailbox/p03-command-boundary/reviewer.md) of `ab37525..6e0f797`: all six criteria pass, no blocking findings. Reviewed/tested revision is `6e0f797b31b0e89830ed2e7579ce40eb6feb82c5`; technical candidate is `b2d25339149b76f7a994da798f5f688449b3668c`; review report was committed at `8ff0fc9ba7e09d9c79a61d82c064bcedae16c948`. O1 effect-hook entity preservation, O2 malformed-payload error precedence, and O3 redundant fixture assertion remain open optional follow-ups. No source/test fixes are authorized or included.

Pre-delivery checks (`git -C /opt/dev/tehom-brainlab status --porcelain --untracked-files=all`, `branch --show-current`, `rev-parse HEAD`) confirm the main checkout is clean on master at required BASE `ab37525587b7739e3cf28b738f5bad5bece7965a`. The P03 worktree is clean at `8ff0fc9`; only the review report follows reviewed `6e0f797`. `git diff --exit-code b2d25339149b76f7a994da798f5f688449b3668c HEAD -- . ':(exclude)docs' ':(exclude)poc-001-linked-formation/README.md'` exits 0. Reviewer blob hash is `5054c172767efdc7fb898dfbd744eee646f0dba7` and is preserved.

The source-side integration commit updates only CURRENT, plans index, P03 plan, prototype README P03 section, and this delivery entry. It records acceptance/local-delivery status without predicting its own SHA. The authorized fast-forward and delivered-master focused/full/typecheck/build results will be recorded in the documentation-only master successor and delivery handoff after execution. No remote action; unrelated worktrees, branches, panes, and historical reports are preserved.

Actual delivered/tested master revision: `18d989894da22a47f2d9f375821d9b571c2e9804`. After immediately rechecking exact BASE, clean master/source, source revision and preserved Reviewer hash, `git -C /opt/dev/tehom-brainlab merge --ff-only p03-command-boundary` exited 0 and fast-forwarded local master without conflicts. Non-doc content equals reviewed technical candidate `b2d2533`; `git diff --name-only 6e0f797 master` lists only six Markdown paths.

All four assigned checks ran from `/opt/dev/tehom-brainlab` at this delivered revision using unchanged default Docker/Bun 1.4.2 and Vitest 5.0.3:

| Exact command | Actual result |
| --- | --- |
| `just poc-001-test tests/commands.test.ts tests/formation.test.ts` | Exit 0; 127 tests, P03 37/253 and P02 90/3,349 actual assertions |
| `just poc-001-test` | Exit 0; 129 tests across three files |
| `just poc-001-typecheck` | Exit 0 |
| `just poc-001-build` | Exit 0; seven modules, existing large Phaser chunk warning |
| `git diff --exit-code b2d25339149b76f7a994da798f5f688449b3668c master -- . ':(exclude)docs' ':(exclude)poc-001-linked-formation/README.md'` | Exit 0; tested technical content unchanged |
| `git diff --check ab37525587b7739e3cf28b738f5bad5bece7965a..master`; `git status --short` | Exit 0; whitespace clean, checkout clean before evidence edits |

The master recording successor adds [delivery handoff](mailbox/p03-command-boundary/delivery.md), this executed-check evidence, and CURRENT's delivered revision/evidence link. It contains no source/test/runtime changes and does not predict its own SHA. Prior Implementer/Reviewer reports remain unchanged. O1–O3 stay open optional; no unresolved blocker. No push, browser session, human playtest, mutation probe, routing suite, or host-mode application run. Cleanup follows only after this report is committed.

Delivery handoff validation: `/home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p03-command-boundary/delivery.md --repo /opt/dev/tehom-brainlab` exited 0, `ok:true`, seven revision references resolved, empty diagnostics.

## 2026-10-04 Agent artifact conventions and scratch retirement

Recorded by the Coordinator from worker handoffs. User decisions: retire `.agents/scratch/`; make Coordinator assignments durable mailbox files; make CURRENT/TASK_LOGS Coordinator-only; keep mailbox reports until a future librarian triages them.

- **Conventions change** (`CONV-impl`, R1): candidate `ef06976` from BASE `ec32b59` changed 29 Markdown files and `.gitignore`, including the amended ADR-0003/0005 and the draft P04–P12 hand-back lines. The [Implementer report](mailbox/agent-artifact-conventions/implementer.md) records routing (13), handoff (24) and Herdr (107) suites passing. The [independent review](mailbox/agent-artifact-conventions/reviewer.md) at `a9a52e6` passed all seven conditions with zero findings and reran those suites. Fast-forwarded to local master at `ab0e5bb`; routing tests pass there ([delivery](mailbox/agent-artifact-conventions/delivery.md)).
- **Legacy scratch triage** (`CONV-triage`, R1): all 49 files classified ([manifest](mailbox/agent-artifact-conventions/scratch-triage.md)). Fourteen kept: 33 Coordinator assignments copied verbatim to `docs/mailbox/routing-p02/` and `docs/mailbox/versioned-agent-skills/` (SHA-256 equal to their sources), and a curated cleanup report with nine `skills-*` session IDs. Thirty-five are trash: duplicates or transient. The [independent review and re-review](mailbox/agent-artifact-conventions/triage-reviewer.md) found no blocking findings. Optional findings O1 and O3 were accepted and fixed in R1; O2 and O4 are recorded here. Delivered at `b80747d`.
- **O2:** local-only branches `task/repo-root-command` (`a2b23ae`), `evidence/repo-root-20261004` (`6e448cb`) and `experiment/repo-root-20261004` hold the only copies of the repo-root discovery evidence. They are not on master or origin. Retain them; do not prune them as stale.
- **O4:** committed historical reports and earlier TASK_LOGS entries cite `.agents/scratch/...` paths. After cleanup those citations dangle by design; the kept content's mailbox locations are mapped in the triage manifest. Historical reports are not edited.

Limits: this was a documentation change with no live model session. The Coordinator did not run checks; the results above come from the cited worker reports.

## 2026-10-04 Prompt Coordinator cleanup

Recorded by the Coordinator from worker handoffs. User decision: the Coordinator cleans up as soon as reuse of a worktree, Herdr space or agent is no longer required.

- **Change** (`CLEAN-impl`, R1): candidate `f2aa62c` from BASE `06c181a` edits the feature workflow skill, the Coordinator role and SCHEMA. Markdown only. R1 adds removal of a worker launch's private temporary directory when its pane is closed, following the Implementer's ruach-herdr discovery. The [Implementer report](mailbox/workflow-prompt-cleanup/implementer.md) records the skill format check, routing (13), handoff (24) and Herdr (107) suites passing. The [independent review](mailbox/workflow-prompt-cleanup/reviewer.md) at `743abae` passed all six conditions with no findings and reran the checks. Fast-forwarded to local master at `ff65853`, and routing tests pass there ([delivery](mailbox/workflow-prompt-cleanup/delivery.md), committed at `8c1c3fb`).
- **Cleanup, applying the new rule:**
  - Reviewer pane `w2G:p1H` was closed right after its review was committed. Implementer pane `w2G:p1G` was closed after delivery.
  - Worktree `/opt/dev/tehom-brainlab-cleanup` was removed by the Coordinator; branch `workflow-prompt-cleanup` is kept and reachable from master.
  - Private Claude launch directories from this session's five Claude worker launches were removed: `/tmp/ruach-herdr-{tedr7n,qD0tSD,kh3wyE,ejtIiB,vNk0SL}`. They were identified by launch time and skill-set signature, and no process referenced them. The Codex launches reported none.
  - Retained: the Coordinator's own adapter directory, other sessions' `ruach-herdr-*` directories, the caller pane `w2G:p18`, and unrelated panes `w2G:p3` and `w2G:p17`. No task-created Herdr workspaces or tabs existed.
- **Process note:** the launcher's `temporary_directory` field was not captured at launch time for these workers, so the directories were matched after the fact. Coordinators should capture that field from each start result.

Limits: Markdown-only change, with no live model session. The Coordinator did not run checks; the results come from the cited worker reports.

## 2026-10-04 Route selection policy

Recorded by the Coordinator from worker handoffs.

**Trigger.** The user found that the Coordinator had switched 5 of 9 workers to the Claude alternative on its own judgment. The user asked for a council of Opus 5.5-high, gpt-6.1-sol-high and Gemini 3.8 Flash high.

**Council.**
- Opus and Sol, both Architects, independently recommended user-confirmed fallback with a guidance-only change ([opus](mailbox/council-fallback-policy/architect-opus.md), [sol](mailbox/council-fallback-policy/architect-sol.md)).
- Gemini could not be seated. The launcher marks Agy unsupported, and a manual Agy start was refused by the permission system. The user then approved the policy without it.

**User corrections.**
- Exit 3 can be a fixable prerequisite, so it is not proof that the model is unavailable.
- A run-specific reviewer route needs only `--route`, not a `roles.yaml` edit.
- The user added the <2% low-allowance rule.

**Change.**
- `ROUTE-impl`: candidate `905f545` from BASE `0b5acdf` on the preferred Sol route. It adds the "Route selection" section to `.agents/agents/coordinator.md`, a launch-recovery paragraph to `ruach-herdr` SKILL.md, and the `roles.yaml` header comment.
- The [Implementer report](mailbox/council-fallback-policy/implementer.md) records routing (13), Herdr (107) and handoff (24) tests passing, plus the skill format check.
- The [independent review](mailbox/council-fallback-policy/reviewer.md) on the preferred Sol route passed all five conditions with no findings.
- The change is delivered to master by fast-forward and pushed to origin by the integration Implementer; see the [delivery report](mailbox/council-fallback-policy/delivery.md) for revisions.

**Cleanup.**
- Panes: Coordinator closed council panes `w2G:p1J` and `w2G:p1K` after their reports, and the Reviewer `w2G:p1P` after review. The Gemini pane `w2G:p1M` was already gone. The Implementer pane `w2G:p1N` is closed after delivery.
- Temporary files: the Opus launch directory `/tmp/ruach-herdr-K6Dosf` was removed after its pane closed. The Codex launches reported none.
- Worktree: `/opt/dev/tehom-brainlab-council` is removed after delivery, and branch `council-fallback-policy` is kept.

**Limits.** Documentation and guidance only, with no live quota or recovery behavior exercised. The Coordinator ran no checks; the results come from the cited reports.


## 2026-10-04 Ruach extraction and Librarian

Recorded by the Coordinator from worker handoffs. User authorization: "use gh to create the public repo in /opt/dev and do what we agreed to".

**Implementation.**
- `ruach-impl` (Implementer, preferred `gpt-6.1-sol-high`) built Ruach `extraction` `25186fe` and Brainlab `ruach-extraction` `10d7b96`. The source suites passed: handoff 24, Herdr 107 and harness-eval 59. Installer, standalone-copy, fresh-clone, routing and offline Librarian checks also passed ([report](mailbox/ruach-extraction/implementer.md)).
- `ruach-impl2` (Implementer, Claude alternative) did the user-requested pre-publication follow-up, Ruach `be77030` and Brainlab `b02b3c6` ([report](mailbox/ruach-extraction/implementer-followup.md)):
  - evals moved to a top-level `evals/` that is not installed, with the exclusion enforced;
  - strengthened cases 05 and 06 added;
  - the adapter sentence repaired and the consumer docs tidied;
  - the snapshot re-pinned. Runtime suites were reused because only Markdown changed in those skills.
- The superseded `assignment-implementer-fixes.md` was never executed.

**Evaluation.**
- Blind Librarian sessions received only `SKILL.md`, the case task and a raw corpus copy:
  - one session ran basic cases 01–04 ([outputs](mailbox/ruach-extraction/librarian-eval.md));
  - separate fresh sessions ran cases 05 and 06 ([05](mailbox/ruach-extraction/ruach-libeval5.md), [06](mailbox/ruach-extraction/ruach-libeval6.md)).
- All evaluators ran on `claude-opus-5.5-high`; the basic-run handoff did not record this.
- The Reviewer graded basic cases 4/4 and strengthened cases 2/2 as passing.
- Limits:
  - single runs on small synthetic fixtures;
  - only the alternative route was evaluated;
  - the subjects, the follow-up implementer and the reviewer were the same model family;
  - the basic fixtures carry explicit cues.

**Review.**
- `ruach-review` (Reviewer, Claude alternative) accepted `25186fe`/`10d7b96` with 0 blocking and 5 optional findings ([review](mailbox/ruach-extraction/reviewer.md)), then accepted the `be77030`/`b02b3c6` delta with 0 blocking findings ([delta review](mailbox/ruach-extraction/reviewer-delta.md)).
- Open optional findings:
  - the installer leaves emptied directories after pruning;
  - the eval-placement guard matches names, not content;
  - behavior was evaluated only on the alternative route.
- The reviewer recorded actual exit statuses after the Coordinator asked it to stop relying on piped status.

**Routes.**
- The parent first saw `ruach-impl`'s footer at "weekly limit: only 3% left" and kept the route.
- It later read "weekly limit: only 1% left", which the Coordinator confirmed in the pane at about 16:14. Under the less-than-2% rule, the newly launched workers `ruach-libeval`, `ruach-review`, `ruach-impl2`, `ruach-libeval5` and `ruach-libeval6` used `claude-opus-5.5-high`.
- `ruach-impl` stayed on its route. The user then directed the follow-up to an alternative-route worker, so `ruach-impl` was interrupted before making any edits (both trees clean) and released.

**Delivery and publication.**
- Ruach `main` was created at reviewed `be77030`. The launching parent pushed it to public `rothzeta/ruach`.
- Brainlab `master` fast-forwarded from `255ed68` to `9090896`; its source equals `b02b3c6`. The merge handoff was committed at `13653d7` ([report](mailbox/ruach-extraction/implementer-merge.md)).
- Post-merge checks all exited 0: `check-ruach` with and without `--source`, 14 routing tests, and Librarian resolution.
- Native review refused deleting the untracked drafts, so delivery used a non-destructive retry. The original drafts are preserved in [librarian-drafts.patch](mailbox/ruach-extraction/librarian-drafts.patch), committed in `9137038` and verified byte-for-byte, and are archived in `/tmp/ruach-extraction-drafts-BM3NMi`.

**Global links.**
- Before: the three exact paths `~/.agents/skills/ruach-handoff`, `ruach-harness-eval` and `ruach-herdr` each pointed to `/opt/dev/tehom-brainlab/.agents/skills/<name>`. This was confirmed by the parent and by `ruach-impl2`.
- Each was repointed with `ln -sfn` to `/opt/dev/ruach/skills/<name>`, exit 0.
- The worker's post-change verification was refused by the auto-mode classifier without a stated reason, and the worker declined to split it into smaller steps around that refusal. Its [report](mailbox/ruach-extraction/implementer-merge.md) therefore stays `blocked` as a historical record and is not rewritten.
- The launching parent then verified with its own read-only tools, all exit 0 ([parent verification](mailbox/ruach-extraction/parent-verification.md), committed in `07cdb12`):
  - all three targets and their `SKILL.md` identities match `/opt/dev/ruach/skills/<name>`;
  - the validator through the global `ruach-handoff` link returns `ok: true`;
  - offline Librarian resolution through the global `ruach-herdr` link succeeds, with no submission;
  - `scope-check --help` through the global `ruach-harness-eval` link works;
  - the GitHub API reports public `main` at `be77030`.
- This resolves the worker's historical global-check blocker. The old targets remain recorded in the merge report. Unrelated global skills were not listed or touched.

**Cleanup.**
- Panes closed: `w2G:p1S` (`ruach-impl`), `p1T` (`ruach-libeval`), `p1V` (`ruach-review`), `p1W` (`ruach-impl2`), `p1X` (`ruach-libeval5`) and `p1Y` (`ruach-libeval6`).
- Launch directories removed: `/tmp/ruach-herdr-9aTaYc`, `-837R0l`, `-I6DDnh`, `-zQaLB0` and `-5pXe5X`. `ruach-impl` reported none.
- Eval packets and merge-check logs removed.
- Worktree `/opt/dev/tehom-brainlab-ruach-extraction` removed. Branch `ruach-extraction` (`9090896`) and Ruach `extraction` are kept.
- After parent verification, the Coordinator removed the draft archive `/tmp/ruach-extraction-drafts-BM3NMi`; its content is preserved in the committed patch and the merge report.
- A correction Implementer `ruach-impl3` was launched (pane `w2G:p1Z`, `claude-opus-5.5-high`). The Coordinator's prompt to it was refused by native review as an auto-mode bypass, so it never received work. Its pane was closed and its launch directory `/tmp/ruach-herdr-EYc2Yh` removed. Its unused assignment was committed unchanged by the parent in `07cdb12`.
- Nothing is retained apart from the branches listed above.

**Limits.** No live model session, no account or harness acceptance, and no actual mailbox triage. The Coordinator ran no checks; the results come from the cited reports.

## 2026-10-04 P04–P06 delivery

The user asked to "implement p03 to p06". P03 was already delivered at `18d98989`, so the work covered P04, P05 and P06. The Coordinator ran `ruach-workflow-feature`. All workers used the preferred route `gpt-6.1-sol-high` (Codex), launched with `just agent-routing start`; no route switch occurred. Each assignment is committed unchanged next to its report under `docs/mailbox/<task>/`. The Coordinator ran no checks itself. Every result below comes from the cited handoffs, each of which passed the `ruach-handoff` validator.

**Sequencing.** P04 and P05 have disjoint file ownership, so they ran in parallel worktrees from BASE `0d6f2336`. P06 depends on P05 and started from master after P05 delivery. Each candidate was merged with the current master into its branch with a merge commit before review, and verified as a combined revision. Every delivery was a fast-forward. No conflicts occurred: Git merged the shared prototype README automatically.

**P05 intent semantics** ([implementer](mailbox/p05-intent-semantics/implementer.md), [review](mailbox/p05-intent-semantics/reviewer.md), [delivery](mailbox/p05-intent-semantics/delivery.md)).
- Candidate `a9594472`. Added `src/core/intents.ts` and `sectors.ts` and `tests/intents.test.ts` (75 tests, 803 assertions). P05-owned defaults are recorded in the implementer report.
- The independent review at `a959447` passed with 0 blocking and 0 optional findings.
- Master fast-forwarded `0d6f233` → `f3a0e233` (delivered and tested: 204 tests, typecheck and build exit 0) → `04bd6a28` (delivery report).

**P04 formation lab** ([implementer](mailbox/p04-formation-lab/implementer.md), [integration](mailbox/p04-formation-lab/integration.md), [review](mailbox/p04-formation-lab/reviewer.md), [delivery](mailbox/p04-formation-lab/delivery.md)).
- Candidate `32f07c00`. Added the view and lab state, projection, asset preparation, and a read-only `/assets` Docker mount in `scripts/run.sh`, plus unit and asset tests and a headless Chrome `tests/browser-lab.mjs`.
- Integration merged master `04bd6a2` into the branch as `b5e7c54e`: 226 tests, typecheck and build passed, and the browser check passed (136 assertions, 12 fixtures, 3 asset modes, 1280×800).
- The review at `b5e7c54` found 0 blocking issues and 1 optional finding (O1, open): the browser assertions over-constrain the link-readout punctuation and button order.
- Master fast-forwarded to `ad394558` (delivered and tested: 226 tests, typecheck and build exit 0) → `8f8c9e47` (delivery report).

**P06 damage and Fallen** ([implementer](mailbox/p06-damage-and-fallen/implementer.md), [integration](mailbox/p06-damage-and-fallen/integration.md), [fix R1](mailbox/p06-damage-and-fallen/fix-r1.md), [review and re-review](mailbox/p06-damage-and-fallen/reviewer.md), [delivery](mailbox/p06-damage-and-fallen/delivery.md)).
- Candidate `2be2d85c`, from BASE `04bd6a2`. Added `damage.ts`, `lifecycle.ts` and `tests/damage.test.ts`, with additive changes to P03 `state.ts`, `commands.ts` and `transition.ts`. P01–P05 tests are unchanged.
- Integration merged master `8f8c9e4` as `cad6168d`: 272 tests passed, and the P04 browser check still passed.
- The review at `cad6168` raised blocking R1: sparse `recipientIds` arrays bypassed validation and threw a TypeError instead of returning the rejection envelope.
- Fix `47582306` reproduced the failure first, then passed with 274 tests and the browser check. The re-review at `4758230` resolved R1 with no remaining findings.
- Master fast-forwarded to `c9f66250` (delivered and tested: 274 tests, 4710 assertions; typecheck and build exit 0) → `a4ee3b95` (delivery report).

**Discoveries.**
- P07 must extend P03 accounting for combat-state ability effects, because `ActionRules.apply` returns only Brood data. The P06 Reviewer confirmed this.
- The Coordinator's assignments gave BASE as `0d6f2335`, a typo for `0d6f2336…`; the workers recorded the actual revision.
- The prototype README's P02 evidence text is stale (it still says review and delivery are pending), as P05 and P06 reported. It was not corrected here.
- Workers needed sandbox escalation for Docker, for Git writes in linked worktrees, and for validator dependency installation. Application checks stayed in Docker mode throughout.

**Cleanup.**
- Panes closed: `w2G:p21` (`p04-impl`), `p22` (`p05-impl`), `p23` (`p05-review`), `p24` (`p06-impl`), `p25` (`p04-review`) and `p26` (`p06-review`). Every launch reported `temporary_directory: null`.
- Worktrees removed: `/opt/dev/tehom-brainlab-p04`, `-p05` and `-p06`.
- Branches `p04-formation-lab`, `p05-intent-semantics` and `p06-damage-and-fallen` are kept.
- No push. No human playtest. Open optional items: P04 O1 and P03 O1–O3.

## 2026-10-04 Compact triangle

After P04–P06 delivery, the user reported that "compact formation is not a triangle". The brief's "three consecutive outer-ring cells" (P02 `3o+[0,1,2]`) is collinear, with distances 1, 2, 1. The user chose a true triangle with two Brood on the outer ring and one on ring 2. The Coordinator ran `ruach-workflow-feature` in worktree `/opt/dev/tehom-brainlab-compact`, branch `compact-triangle`, from BASE `0f9c1b7`. The Coordinator ran no checks itself, and every handoff passed the `ruach-handoff` validator.

**Design.**
- The Architect (`ct-architect`, `claude-opus-5.5-high`, pane `w2G:p28`) amended the brief, the P02/P04/P05/P06/P10 plans and the index. It wrote task [CT](plans/2026-10-04-fb4bf201-poc-001-compact-triangle.md) in `33dcf5e` ([report](mailbox/compact-triangle/architect.md)).
- It raised three open questions. The user chose the recommended answer in each case: the inward Brood is exposed and protected like its sector (sectors extended to rings 2–3); Pazuzu goes inward; the triangle sits mid-side.
- These were recorded as accepted decisions in `c30e8cc`.

**Implementation.**
- `ct-impl` (`gpt-6.1-sol-high`, pane `w2G:p29`) delivered candidate `4fa7613f`. It changed `src/core/{hex,formation,sectors}.ts`, `src/view/FormationLab.ts` and the prototype README.
- Under the plan's explicit exception, it changed the old-geometry expectations in `tests/formation.test.ts`, `tests/intents.test.ts` and `tests/browser-lab.mjs`. It added 36 token hit tests. P03, P04 and P06 unit suites are unedited.
- Results: 278 tests with 4,949 assertions, typecheck and build passed. The browser check passed 176 assertions with zero uncaught exceptions. Screenshots `compact-0.png` and `compact-4.png` are kept as evidence.

**Review and delivery.**
- `ct-review` (pane `w2G:p2A`) reviewed `4fa7613` and passed it with 0 blocking and 0 optional findings ([review](mailbox/compact-triangle/reviewer.md), `9b9cfde`). It independently ran all checks and inspected Compact captures at orientations 0–5.
- Master was not advanced during the work, so no integration merge was needed.
- Master fast-forwarded `0f9c1b7` → `40b516f4` (delivered and tested: 278 tests, typecheck and build exit 0; prototype and assets equal `4fa7613`) → `a76a0ff0` (delivery report). See the [delivery report](mailbox/compact-triangle/delivery.md).

**Cleanup.**
- Panes `w2G:p28`, `p29` and `p2A` closed. Architect launch directory `/tmp/ruach-herdr-cBeLUm` removed; the other launches reported none.
- Worktree `/opt/dev/tehom-brainlab-compact` removed. Branch `compact-triangle` kept.
- No push. No human playtest.

## 2026-10-04 Two-ring board

The user decided the POC arena has only two rings ("i dont see what three would bring"). They clarified that bosses sit in the middle, that the strategy is to go wide around them or tight against them, and that encounter layout is what the POC explores. The Coordinator ran `ruach-workflow-feature` in worktree `/opt/dev/tehom-brainlab-tworing`, branch `two-ring-board`, from BASE `0a48098`. The Coordinator ran no checks itself, and every handoff passed the `ruach-handoff` validator.

**Design.**
- Architect `tr-architect` (`claude-opus-5.5-high`, pane `w2G:p2B`) wrote `0d911ce` ([report](mailbox/two-ring-board/architect.md)), amending the brief, the P02/P04/P05/P06/P08/P10 plans, the index, and task [TR](plans/2026-10-04-d005e5f4-poc-001-two-ring-board.md).
- It found that the CT mid-side placement has no radius-2 equivalent. It also found that P08's proposed ring-1 enemy cells collide with Compact's inward Brood.
- The user chose the recommended answer on all three questions: a sector-aligned Compact, corner Spread at distance 4, and view-only enemies at the centre.
- `d71cf9f` recorded these as accepted decisions and amended ADR-0004. `fc36600`/`ebc26d6` noted the amendment in the ADR index.

**Implementation.**
- `tr-impl` (`gpt-6.1-sol-high`, pane `w2G:p2C`) delivered candidate `2e98a276`, touching `src/core/{hex,formation,sectors}.ts`, `src/view/{FormationLab.ts,lab.css}` and the README.
- Under the plan's exception it updated geometry expectations in `formation.test.ts`, `intents.test.ts` and `browser-lab.mjs`.
- Results: 278 tests with 2,926 assertions, typecheck and build all passed. The browser check passed 177 assertions, including 36 token hit tests.

**Review.**
- `tr-review` (pane `w2G:p2D`) passed `2e98a27` with 0 blocking and 0 optional findings ([review](mailbox/two-ring-board/reviewer.md), `befb8e1`).
- It reran the BASE suite (4,949 assertions) and accounted for the whole drop of 2,023: 2,016 come from 2 × (37² − 19²) board pairs, with the rest from ring-table changes. No coverage was lost.

**Delivery.** Master was not advanced during the work. It fast-forwarded `0a48098` → `21f3d331` (delivered and tested: 278 tests, typecheck and build exit 0; prototype content equals `2e98a27`) → `8297db69` (delivery report). See the [delivery report](mailbox/two-ring-board/delivery.md).

**Cleanup.**
- Panes `w2G:p2B`, `p2C` and `p2D` closed. Launch directory `/tmp/ruach-herdr-LNMkv8` removed.
- Worktree `/opt/dev/tehom-brainlab-tworing` removed. Branch `two-ring-board` kept.
- No push and no human playtest.
