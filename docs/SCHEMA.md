# Documentation schema

Authority: [ADR-0001](adr/0001-documentation-vault.md), [ADR-0002](adr/0002-plan-filenames.md), and [ADR-0003](adr/0003-implementation-plan-writing.md).

## Vault layout

```text
docs/
├── lexicon/
├── adr/
├── plans/
├── exploitation/
├── prototypes/
├── playtests/
├── mailbox/
├── README.md
├── SCHEMA.md
├── CURRENT.md
└── TASK_LOGS.md
```

Each directory has a `README.md` entry point. `prototypes/`, `playtests/`, and `mailbox/` extend the common vault structure for this experiment repository.

| Location | Responsibility |
| --- | --- |
| `README.md` | Vault entry point and navigation |
| `SCHEMA.md` | Document roles, formats, and linking conventions |
| `CURRENT.md` | Current implementation facts and links to evidence |
| `TASK_LOGS.md` | Dated task execution, exact verification results, findings, and limitations |
| `lexicon/` | Canonical terms and distinctions |
| `adr/` | Accepted decisions and explicitly marked proposals |
| `plans/` | Delivery order, bounded implementation plans, and standalone task specifications |
| `exploitation/` | Procedures and records for running, operating, importing assets, and recovering delivered tools |
| `prototypes/` | Experiment questions, design scope, hypotheses, and acceptance questions |
| `playtests/` | Observed experiment outcomes tied to tested commits and conditions |
| `mailbox/` | Durable worker findings, review reports, and handoffs grouped by task |

## Naming and status

ADRs use `NNNN-descriptive-name.md`, retain their number when amended, and record status, date, decision, rationale, and consequences. New decisions use the next unused number. The original repository decisions are preserved together in [ADR-0004](adr/0004-repository-and-poc-direction.md).

Plans and standalone task specifications use `yyyy-mm-dd-[rand:8]-{name}.md`, per [ADR-0002](adr/0002-plan-filenames.md). Generate the random identifier once and retain the filename on edits. A task inside a plan uses a stable identifier; actual execution belongs in `TASK_LOGS.md`.

Plans identify whether they are proposed, accepted, implemented, or superseded. Existing draft plans are proposed work. The plans index identifies the delivery sequence and dependencies; a plan's acceptance does not establish implementation.

All custom skills use the `ruach-` prefix in both directory and frontmatter `name`, which must match. [ruach-testing](../.agents/skills/ruach-testing/SKILL.md) contains shared contract-based black-box testing and regression guidance. Technical skills can be used by workers within their assignments; orchestration workflow skills are loaded only by the Coordinator. Optional framework-specific guidance should address concrete recurring needs and reference the shared testing principles.

Reusable skill instructions must carry the essential procedure and examples within their own directory. Keep repository decisions and rationale in `docs/adr/`, with repository guidance linking the applicable ADR to the skill. `ruach-testing` is self-contained; it can be copied independently while [ADR-0006](adr/0006-contract-invariants-and-black-box-testing.md) continues to govern testing in this repository.

Task log entries use dated headings and record scope, inspected revision, changed files or behavior, exact commands and results, findings, limitations, and governing plan links where applicable. Append evidence without erasing prior observations. Keep detailed human playtest observations in `playtests/` and link them from the task log when used as execution evidence.

## Links and evidence

Use relative Markdown links between notes, including an explicit `.md` extension. Notes remain readable in Obsidian and repository browsers. Update referring links in the same change as a rename or move. Keep source paths and revisions explicit when recording evidence.

`CURRENT.md` summarizes present facts and links to supporting records. Exact commands and historical verification belong in `TASK_LOGS.md`. Prototype-local READMEs own installation and run instructions; vault notes link to them rather than duplicating them. Asset provenance remains in `assets/manifest.json` and credits.

Repository folder roles and the just command surface are governed by [ADR-0005](adr/0005-repository-management-and-tooling.md). Agent resources belong in the root `.agents/`; shared documentation remains in this vault.

## Agent work artifacts

Agent roles and skills are canonical in `.agents/agents/` and `.agents/skills/`. Work artifacts use these locations relative to the repository root:

| Location | Content and lifetime |
| --- | --- |
| [docs/mailbox/](mailbox/README.md) | Durable investigation findings, review reports, and worker handoffs; include in Git with the related work |
| [.agents/scratch/](../.agents/scratch/README.md) | Intermediate outputs, exploratory scripts, hypotheses, and working notes retained across sessions; contents are ignored except the directory README |
| `docs/` | Canonical shared designs, decisions, plans, current state, and execution evidence, following the existing vault conventions |

Write reports to `docs/mailbox/<task-id>/<role>.md`. Reuse an assigned task or checkpoint identifier where available. When multiple workers have the same role on a task, append a worker identifier to the filename. Each worker owns its report; do not overwrite another worker's report. These are handoff reports; standalone task specifications and implementation plans retain [ADR-0002](adr/0002-plan-filenames.md) filenames in `docs/plans/`.

A durable report identifies its author or role and uses [ruach-handoff](../.agents/skills/ruach-handoff/SKILL.md) for the canonical fields and rules for producing, consuming, and correcting handoffs. Include the additional evidence required by the role and assignment supplied by the Coordinator. Use relative Markdown links to existing artifacts; identify source locations and inspected revisions when relevant. Keep the report focused and return its path with a concise handoff to the requesting agent.

New handoffs begin with the structured YAML block defined by [ruach-handoff](../.agents/skills/ruach-handoff/SKILL.md); the responsible worker runs its mechanical validator before returning the report. Revision fields identify existing commits and distinguish tested, reviewed, and delivered content from later evidence-only commits. Return the report-creating SHA in the terminal handoff rather than predicting it inside the report. Historical Markdown-first experiment summaries remain historical artifacts outside this leading-block contract; do not rewrite them solely to pass validation.

Scratch files can outlive a process or session, but they are local working material. Promote findings needed by other agents or future work into a mailbox report or the appropriate vault note. Scratch may be removed once its useful results are preserved; the feature workflow requires final removal of completed task-owned temporary worktrees after delivery and preservation of durable reports. Keep canonical decisions and plans in their vault locations and reference them from reports. Record actual execution and exact checks in `TASK_LOGS.md`, linking detailed reports rather than duplicating them.

Role definitions own responsibilities; workflows own sequencing, review, verification, and integration requirements. Only the Coordinator loads and executes workflows. It instantiates workers with self-contained assignments containing scope, context, acceptance conditions, verification instructions, restrictions, and handoff requirements. Workers receive their role and assignment without receiving workflow documents. The Coordinator keeps its context small and receives structured handoffs, using Herdr as the selected communication mechanism. Assigned workers perform technical investigation, verification, review, and integration. The Architect writes assigned design and planning artifacts and never becomes an Implementer. The Scout writes focused investigation reports and never modifies application code or takes over architectural design. These definitions and conventions do not establish that harness integration or role behavior has been tested.

[ruach-workflow-feature](../.agents/skills/ruach-workflow-feature/SKILL.md) is the generic feature workflow through integration, merging, and final worktree cleanup; Scout and Architect are optional. Integration and merge handoffs identify source revisions, the combined and reviewed revision, the destination, and the final revision. Verification evidence identifies the tested revision. Cleanup handoffs identify removed and retained worktrees and preserved delivery/report revisions. More specific workflows may be added for concrete needs; none are currently configured.

Distinguish agreed constraints, provisional tuning, implemented behavior, executed checks, and observed playtest results. Planned files and commands must be labelled proposed. Documentation, builds, unit tests, browser checks, and human playtests each establish different evidence.
