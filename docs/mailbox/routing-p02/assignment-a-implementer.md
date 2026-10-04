# Assignment A-impl — repository model routing setup (role: implementer)

You are the Implementer (canonical role `.agents/agents/implementer.md`, already injected). Coordinator: Claude (claude-opus-5.5-high). Do not load or follow any workflow skill; follow this assignment. Use `.agents/skills/ruach-handoff/SKILL.md` for your result; `.agents/skills/ruach-testing/SKILL.md` and ADR-0006 for tests.

## Workspace and delivery
- Repo `/opt/dev/tehom-brainlab`, baseline master `c6083e892285b43c297c742ff28553ae3e2e7310` (clean). Create local branch `routing-setup` from it and commit there (you may use a worktree under `/tmp/brainlab-routing-p02/` or `.agents/scratch/` if you prefer; state which). Do NOT merge to master yet — a separate independent review comes first; you will later get a merge assignment. No push/publication/deployment. Preserve unrelated work and prior P01 evidence.
- Temporary files: `.agents/scratch/routing-p02/` (ignored).
- Durable report (you own it): `docs/mailbox/agent-routing/implementer.md`, committed on the branch.

## Goal
Add repository model routing with real launch integration:
1. `.agents/models.yaml` — model catalog: keys `gpt-6.1-sol` (harness `codex`, native model ID `gpt-6.1-sol`) and `claude-opus-5.5` (harness `claude`, native model ID `claude-opus-5-5`). Model identity and harness live only here.
2. `.agents/routing.yaml` — route/profile names exactly `gpt-6.1-sol-high` and `claude-opus-5.5-high`, each with an explicit documented reference to a models.yaml key and `effort: high`. The `-high` suffix is a profile label, never part of the API model ID.
3. `.agents/roles.yaml` — per role: preferred route and optional alternatives. coordinator: preferred claude-opus-5.5-high only, no Codex/GPT orchestration fallback. architect: preferred claude-opus-5.5-high, alternative gpt-6.1-sol-high. scout, implementer, reviewer: preferred gpt-6.1-sol-high, alternative claude-opus-5.5-high. Role YAML selects profiles only; it must reference canonical `.agents/agents/<role>.md` (path or implicit convention) and must not duplicate role instruction bodies. Alternatives are only explicit operator choices (e.g. `--route`); tooling must never silently switch models after an error. Choosing a route not listed as preferred/alternative for that role should fail clearly (state your rule).
4. Small documented schema (in `.agents/README.md` or a short doc it links) covering required fields and references.

## Tooling (ADR-0005: root justfile -> bin -> scripts; inspect ADR-0005 and existing justfile/bin/scripts first and match their idiom)
- Minimal Python (PyYAML available; document the prerequisite) to resolve role -> route -> model and launch the harness.
- A resolve/dry-run command exposing effective role, route, harness, native model, effort and exact CLI argv as structured output, without leaking config secrets (e.g. do not print contents of user config files/developer_instructions verbatim beyond a safe placeholder/length/hash — state your choice).
- A start command that uses Herdr to create a sibling no-focus pane and `herdr agent start <name> --kind <harness> --pane <pane> -- <argv>`, injecting the canonical role and preserving existing portable guidance. Support an explicit `--route` override and optional existing pane argument.
- Reference behavior to reproduce (currently used bootstrap, read it: `/tmp/brainlab-routing-p02-bootstrap.py`):
  - claude: `--append-system-prompt-file <role file> --add-dir <adapter dir with .claude/skills symlinks: ruach-testing, ruach-simplification, ruach-handoff, plus ruach-workflow-feature only for coordinator> --permission-mode auto --model claude-opus-5-5 --effort high`. Place the adapter dir somewhere not persisted as harness config (e.g. under ignored `.agents/scratch/` or a tmp path) — state choice.
  - codex: `--approve-for-me -m gpt-6.1-sol -c model_reasoning_effort="high" -c developer_instructions=<prior developer_instructions from ~/.codex/config.toml if any + blank line + role body, TOML/JSON-quoted>`; for non-coordinator roles add `-c skills.config=[...]` preserving prior skills.config entries and appending the repo `ruach-workflow-feature/SKILL.md` with enabled=false so workers cannot see orchestration workflows.
  - Verify these flags against current installed CLIs (`claude --help`, `codex --help`, `herdr agent start --help`) and official docs (Codex config reference https://learn.chatgpt.com/docs/config-file/config-reference documents model_reasoning_effort and developer_instructions). Record what you inspected. Do not claim a model is available from YAML or stubs.
- Validate config (required fields, unknown route/model/role references, harness in {claude, codex}, effort present, route allowed for role) and fail clearly with non-zero exit BEFORE any pane creation. Preserve argument boundaries (argv lists, no shell string joining).
- Do not build a scheduling framework, root JS app, persistent harness config, or other providers/routes (no Pi/Kimi, no medium).
- Optional, narrow: one addition to `.agents/agents/coordinator.md` recommending completion notifications/event waits (e.g. `herdr agent prompt ... --wait` in a background task) instead of routine progress polling. Do not otherwise rewrite roles or workflows.
- Update `.agents/README.md`, relevant CLI docs, and factual `docs/CURRENT.md` / `docs/TASK_LOGS.md` entries (facts only; no claims of review/delivery before they happen).

## Run-specific override
For this run the Coordinator will launch every worker on `gpt-6.1-sol-high` (including any architect) via explicit `--route`. Ensure that works for architect as an allowed alternative.

## Tests (you own tests for this slice)
Focused tests at observable boundaries, using stub `herdr`/harness executables on PATH where appropriate: config resolution per role, exact model/effort/harness argv for both harnesses, explicit route override, disallowed route, invalid/missing references and fields (non-zero exit, clear message, no herdr invoked), argument boundary preservation (e.g. developer instruction text with quotes/newlines), workflow-skill exclusion for workers vs coordinator, no secret leakage in dry-run. Run them via the just/bin entrypoint and record exact commands and results. Also run any existing repository checks that your change could affect (state which). Do not launch real worker agents; the Coordinator's later launches supply live evidence.

## Handoff
Commit on `routing-setup`. Durable report at `docs/mailbox/agent-routing/implementer.md` with ruach-handoff fields, `candidate_revision`/`tested_revision` (existing SHAs only — never your report's own future commit), exact commands + results, CLI/doc flag inspection evidence, files changed, schema summary, and limitations. Then end your turn with a concise handoff summary including the report path and SHAs.
