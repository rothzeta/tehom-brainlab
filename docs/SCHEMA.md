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
├── README.md
├── SCHEMA.md
├── CURRENT.md
└── TASK_LOGS.md
```

Each directory has a `README.md` entry point. `prototypes/` and `playtests/` extend the common vault structure for this experiment repository.

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

## Naming and status

ADRs use `NNNN-descriptive-name.md`, retain their number when amended, and record status, date, decision, rationale, and consequences. New decisions use the next unused number. The original repository decisions are preserved together in [ADR-0004](adr/0004-repository-and-poc-direction.md).

Plans and standalone task specifications use `yyyy-mm-dd-[rand:8]-{name}.md`, per [ADR-0002](adr/0002-plan-filenames.md). Generate the random identifier once and retain the filename on edits. A task inside a plan uses a stable identifier; actual execution belongs in `TASK_LOGS.md`.

Plans identify whether they are proposed, accepted, implemented, or superseded. Existing draft plans are proposed work. The plans index identifies the delivery sequence and dependencies; a plan's acceptance does not establish implementation.

Task log entries use dated headings and record scope, inspected revision, changed files or behavior, exact commands and results, findings, limitations, and governing plan links where applicable. Append evidence without erasing prior observations. Keep detailed human playtest observations in `playtests/` and link them from the task log when used as execution evidence.

## Links and evidence

Use relative Markdown links between notes, including an explicit `.md` extension. Notes remain readable in Obsidian and repository browsers. Update referring links in the same change as a rename or move. Keep source paths and revisions explicit when recording evidence.

`CURRENT.md` summarizes present facts and links to supporting records. Exact commands and historical verification belong in `TASK_LOGS.md`. Prototype-local READMEs own installation and run instructions; vault notes link to them rather than duplicating them. Asset provenance remains in `assets/manifest.json` and credits.

Repository folder roles and the just command surface are governed by [ADR-0005](adr/0005-repository-management-and-tooling.md). Agent resources belong in the root `.agents/`; shared documentation remains in this vault.

Distinguish agreed constraints, provisional tuning, implemented behavior, executed checks, and observed playtest results. Planned files and commands must be labelled proposed. Documentation, builds, unit tests, browser checks, and human playtests each establish different evidence.
