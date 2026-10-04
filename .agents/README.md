# Repository agent resources

Keep repository-owned skills, reusable prompts, and workflow support here. Working guidance starts in [AGENTS.md](../AGENTS.md).

This required folder follows [ADR-0005](../docs/adr/0005-repository-management-and-tooling.md). Portable role definitions live in `agents/`; skills and reusable workflows live in `skills/`. These are the canonical sources; the repository launcher resolves portable model routes and injects these roles without installing persistent harness configuration. Only the Coordinator loads and executes workflows; workers receive self-contained assignments.

Durable worker handoffs live in [docs/mailbox/](../docs/mailbox/README.md); local working files live in [scratch/](scratch/README.md). Follow [SCHEMA](../docs/SCHEMA.md#agent-work-artifacts) for artifact locations, naming, and ownership, and [ruach-handoff](skills/ruach-handoff/SKILL.md) for the reporting protocol. Shared designs and plans remain in `docs/`.

## Custom skills

Use the `ruach-` prefix for every custom skill's directory and frontmatter name. Directory and name must match.

- [ruach-testing](skills/ruach-testing/SKILL.md): contract-based behavior tests and regression coverage.
- [ruach-handoff](skills/ruach-handoff/SKILL.md): shared structured handoff production, consumption, and correction protocol.
- [ruach-simplification](skills/ruach-simplification/SKILL.md): reduce complexity while preserving required behavior.
- [ruach-workflow-feature](skills/ruach-workflow-feature/SKILL.md): Coordinator's generic feature workflow through integration, verification, review, and merging; Scout and Architect are optional.

Workers may use technical skills and the shared handoff skill within their assignments; orchestration workflows remain Coordinator-only.

## Routing schema and commands

The launcher requires Python 3.11+ and PyYAML (`python3 -m pip install PyYAML`). Starting additionally requires Herdr, the chosen harness on PATH, and a trusted/authenticated harness setup. Resolution does not require Herdr or harness executables. See [launch commands](../docs/exploitation/agent-routing.md) for usage and verification limits.

Each YAML file contains one required mapping; unknown fields, duplicate keys, empty catalogs, and invalid references fail before any pane creation:

| File | Mapping | Required entry fields | References |
| --- | --- | --- | --- |
| `models.yaml` | `models` | `harness`: `claude` or `codex`; `native_model`: nonempty native CLI/API ID | Keys identify models. This is the sole source of model identity and harness. |
| `routing.yaml` | `routes` | `model`: model key; `effort`: `high` | `model` references `models.yaml`. The `-high` route suffix is a profile label and never goes to the model flag. |
| `roles.yaml` | `roles` | `preferred`: route key | Optional `alternatives`: list of route keys. Instructions implicitly reference `.agents/agents/<role>.md`. |

All five canonical roles must be present: coordinator, architect, scout, implementer, reviewer. Their Markdown files and all four canonical skill files must exist. Only `high` effort is supported in this slice. A route override must appear in that role's preferred or alternatives list; unknown or disallowed choices fail with the allowed list. Coordinator routes must use Claude; no GPT orchestration fallback is configured or permitted. Alternatives never trigger automatically, including after a start failure.

The catalog defines `gpt-6.1-sol-high` and `claude-opus-5.5-high`. Coordinator prefers Claude only. Architect prefers Claude with GPT as an explicit alternative; Scout, Implementer and Reviewer prefer GPT with Claude as an explicit alternative. YAML declarations and stub tests do not establish account/model availability.

`just agent-routing resolve architect --route gpt-6.1-sol-high` emits JSON with the effective role, route, harness, native model, effort, and CLI argv arrays. Instruction and skill-config argument values use `<redacted>` placeholders, including prior user configuration paths inside skill entries. Other argv elements are exact; an unresolved pane is represented as `<new-pane>`. Resolve creates no files or panes and reads no workflow instruction bodies.

`just agent-routing start implementer worker-a` creates a sibling pane without focusing it and starts the selected harness through Herdr. `--route`, `--pane`, and `--root` select an allowed alternative, existing pane, and checkout respectively. Claude's technical-skill adapter lives under ignored `.agents/scratch/agent-routing/claude/<role>/.claude/skills/`; only the Coordinator adapter includes the workflow. Codex appends the role to existing user developer instructions and preserves user skill entries while appending a disabled repository workflow entry for workers. The user config comes from `$CODEX_HOME/config.toml` when set, otherwise `~/.codex/config.toml`; it is never modified.

`just test-agent-routing` runs focused black-box tests through `bin/agent-routing` using temporary checkouts and stub Herdr/harness executables. The test runner accepts standard unittest arguments.
