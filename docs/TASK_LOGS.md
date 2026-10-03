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
