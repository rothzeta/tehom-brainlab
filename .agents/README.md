# Repository agent resources

Keep Brainlab policy/catalogs and the generated Ruach installation here. Working guidance starts in [AGENTS.md](../AGENTS.md).

This required folder follows [ADR-0005](../docs/adr/0005-repository-management-and-tooling.md). Portable role definitions live in `agents/`; skills and reusable workflows live in `skills/`. These are generated shared sources pinned in `ruach.json`; author edits upstream and follow Brainlab consumer policy. The repository launcher validates policy and delegates to ruach-herdr, which consumes the committed `.agents/models.yaml`, `.agents/routing.yaml`, and `.agents/roles.yaml` catalogs. The versioned ruach-herdr launcher has Claude/Codex preparation verified with fake executables and installed-CLI dry runs. Claude workers receive canonical role instructions and known local workflow suppression where supported; complete account/plugin/managed catalog visibility remains unverified and does not prohibit preparation. The launcher never supplies workflow bodies. Codex prefers a running matching daemon and otherwise uses short-lived native stdio inspection, which may initialize runtime state without changing user config. Pi, OpenCode, DSH, OMP, and Agy currently fail before mutation. Live session acceptance has not been performed. See [portable routing schema](skills/ruach-herdr/references/routing.md) and [Brainlab root delegation](../docs/exploitation/agent-routing.md). Only the Coordinator loads and executes workflows; workers receive self-contained assignments.

Coordinator assignments and durable worker handoffs live in [docs/mailbox/](../docs/mailbox/README.md); disposable working files stay outside the repository. Follow [SCHEMA](../docs/SCHEMA.md#agent-work-artifacts) for artifact locations, naming, and ownership, and [ruach-handoff](skills/ruach-handoff/SKILL.md) for the reporting protocol. Shared designs and plans remain in `docs/`.

## Pinned snapshot

Shared roles and skills are generated copies of a pinned [Ruach](https://github.com/rothzeta/ruach) commit. [ruach.json](ruach.json) records origin, full revision and file hashes. Brainlab owns [consumer policy](policy.md), catalogs and the root wrapper. Author shared changes upstream, then sync explicitly.

```sh
just check-ruach
just check-ruach --source /path/to/ruach
just sync-ruach --source /path/to/ruach --revision COMMIT_SHA
```

The bundled installer reads committed upstream Git objects and updates only shared snapshot paths. Local checks need no sibling checkout or network; upstream comparison and sync require an explicit source path. Conflicts or managed drift fail unless `--replace` explicitly authorizes overwrite. No global discovery links or harness settings change. The root launcher checks its own installed snapshot before delegation. Dependency directories are runtime state, excluded from snapshot hashes; install frozen dependencies in each executable skill after cloning or updating. License and provenance are under `ruach/`.

## Custom skills

Use the `ruach-` prefix for every custom skill's directory and frontmatter name. Directory and name must match.

- [ruach-testing](skills/ruach-testing/SKILL.md): contract-based behavior tests and regression coverage.
- [ruach-handoff](skills/ruach-handoff/SKILL.md): shared structured handoff production, consumption, and correction protocol, with the mechanical [handoff validator](skills/ruach-handoff/scripts/validate.ts).
- [ruach-herdr](skills/ruach-herdr/SKILL.md): resolve repository roles and routes, prepare native harness configuration, and launch one named worker.
- [ruach-harness-eval](skills/ruach-harness-eval/SKILL.md): acceptance and scope checks for explicit evaluation only; not loaded by daily coordination.
- [ruach-simplification](skills/ruach-simplification/SKILL.md): reduce complexity while preserving required behavior.
- [ruach-librarian](skills/ruach-librarian/SKILL.md): source evidence, synthesized knowledge, navigation and assigned documentation upkeep.
- [ruach-workflow-knowledge](skills/ruach-workflow-knowledge/SKILL.md): Coordinator-only bounded knowledge batches, proportionate review, evidence preservation and delivery.
- [ruach-workflow-feature](skills/ruach-workflow-feature/SKILL.md): Coordinator's generic feature workflow through integration, verification, review, and merging; Scout and Architect are optional.

Workers may use technical skills and the shared handoff skill within their assignments; orchestration workflows remain Coordinator-only.

## Routing schema and commands

The root launcher requires Python 3 and PyYAML (`python3 -m pip install PyYAML`), plus Bun and the skill's frozen dependencies (`bun install --frozen-lockfile` in `skills/ruach-herdr/`). Bun resolves from `$BUN_BIN`, then `~/.bun/bin/bun`, then PATH. Starting additionally requires Herdr, the chosen harness on PATH, and a trusted/authenticated harness setup. Resolution does not require Herdr or harness executables. See [launch commands](../docs/exploitation/agent-routing.md) for usage and verification limits.

Each YAML file contains one required mapping; unknown fields, duplicate keys, empty catalogs, and invalid references fail before any pane creation:

| File | Mapping | Required entry fields | References |
| --- | --- | --- | --- |
| `models.yaml` | `models` | `harness`: `claude` or `codex`; `native_model`: nonempty native CLI/API ID | Keys identify models. This is the sole source of model identity and harness. |
| `routing.yaml` | `routes` | `model`: model key; `effort`: `high` | `model` references `models.yaml`. The `-high` route suffix is a profile label and never goes to the model flag. |
| `roles.yaml` | `roles` | `preferred`: route key | Optional `alternatives`: list of route keys. Instructions implicitly reference `.agents/agents/<role>.md`. |

All six required roles must be present: coordinator, architect, scout, implementer, reviewer, librarian. Their Markdown files and the required testing, simplification, handoff, Librarian and two workflow skill files must exist. Only `high` effort is supported in this slice. A route override must appear in that role's preferred or alternatives list; unknown or disallowed choices fail with the allowed list. Coordinator routes must use Claude; no GPT orchestration fallback is configured or permitted. Alternatives never trigger automatically, including after a start failure.

The catalog defines `gpt-6.1-sol-high` and `claude-opus-5.5-high`. Coordinator prefers Claude only. Architect prefers Claude with GPT as an explicit alternative; Scout, Implementer, Reviewer and Librarian prefer GPT with Claude as an explicit alternative. YAML declarations and stub tests do not establish account/model availability.

`just agent-routing resolve architect --route gpt-6.1-sol-high` delegates to the skill's `resolve --offline`. Its versioned JSON contains effective selection under `selection` (`role`, `route`, `kind`, `model`, `effort`, `name`, `repo`, `cwd`). It creates no files or panes, reads no native config, emits no native argv and returns `launchable: false`. Use the skill directly for live prerequisite resolution or `start --dry-run`.

`just agent-routing start implementer worker-a` delegates to the skill's start command with role, name, optional route, and the selected checkout as both `--repo` and `--cwd`. `--root` selects that checkout; the launcher itself comes from this root command's versioned skill directory. Startup creates one sibling pane without focus and never retries. The former `--pane` option is retired with a diagnostic. Names follow the skill's safe identifier rule. The repository launch policy passes portable `--permissions auto-review`; adapters own its native mapping. The skill owns instruction composition, known workflow suppression, native prerequisite checks, private launch material, redaction and uncertain startup reporting; see its [instructions](skills/ruach-herdr/SKILL.md) and [adapter limits](skills/ruach-herdr/references/adapters.md).

The root command forwards worker stdout, stderr and exit status unchanged (worker failures use 2/3/4); root policy/setup failures use 1 and root argument errors use 2. It does not translate the worker schema back to the former flattened fields or argv arrays. Repository policy remains in the root validator; selection, native flags and role injection have one maintained owner in the skill.

`just test-agent-routing` runs black-box policy and delegation tests through `bin/agent-routing` using temporary checkouts, real offline selection and a stub Bun for startup stream/argv forwarding. Native launch contracts are covered by the skill suites. The test runner accepts standard unittest arguments.
