# Assignment: skills-architect (task versioned-agent-skills)

Role: architect (your canonical role is already injected). Design and planning only; do not implement skill code.

Workspace: /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills (git worktree, branch versioned-agent-skills-20261004, base c6083e892285b43c297c742ff28553ae3e2e7310). Do not touch the main checkout /opt/dev/tehom-brainlab or any other branch/worktree. Do not merge to master or install anything globally.

## Goal
Produce a concrete, bounded design and implementation plan for three versioned, self-contained, portable Agent Skills (Bun/TypeScript) under this repository's `.agents/skills/`:

```
.agents/skills/ruach-herdr/
  SKILL.md
  scripts/worker.ts
  scripts/adapters/{claude,codex,pi,opencode,dsh,omp,agy}.ts
.agents/skills/ruach-handoff/
  SKILL.md            (existing protocol; extend compatibly)
  handoff.schema.json
  scripts/validate.ts
.agents/skills/ruach-harness-eval/
  SKILL.md
  scripts/acceptance.ts
  scripts/scope-check.ts
```
Supporting references/dependencies/tests are allowed only where they concretely support these responsibilities; no placeholder/ornamental resources. Follow skill creation principles in /home/metatron/.codex/skills/.system/skill-creator/SKILL.md (concise SKILL.md, progressive disclosure, scripts for deterministic work). No giant orchestration framework. No `/tmp/brainlab-*` paths or Brainlab-only assumptions in reusable runtime code.

### 1. ruach-herdr (worker launch runtime)
Owns: deterministic role + route + cwd/worktree + name -> harness-specific argv + canonical role injection -> no-focus Herdr pane (split current pane, `herdr agent start <name> --kind <kind> --pane <pane> -- <argv>`).
- Explicit interface: `bun <skill>/scripts/worker.ts start --name foo-implementer --role implementer --kind codex --model gpt-6.1-sol --effort high --cwd /opt/dev/worktrees/foo`.
- Also: resolve a named role route from repository-owned `models.yaml`/`routing.yaml`/`roles.yaml` so a Coordinator needs only role/route/cwd/name. Provide `resolve`/dry-run output and `start`. YAML reference validation and effective values must fail clearly before any side effect. Models/routes/role preferences live in repository data, never in skill instruction copies.
- IMPORTANT: those YAML files are being created right now by another Coordinator in the main checkout and are NOT committed anywhere yet. Do not read or edit files in the main checkout. Design the resolver contract with the minimal assumptions needed, isolate the schema-dependent part, and list exactly what must be confirmed against the committed routing schema at integration. State your proposed minimal schema assumption explicitly as provisional.
- Reusable behavior to absorb (read-only; drop hard-coded experiment roots/model defaults): /tmp/brainlab-orchestrator-launch.py, /tmp/brainlab-orchestrator2-launch.py, /tmp/brainlab-routing-p02-bootstrap.py (the current bridge launcher). Related notes: /tmp/brainlab-orch2-*-help.txt, /tmp/brainlab-orch2-agy-*.
- Adapters own native mechanisms: Claude `--append-system-prompt-file` + model/effort flags; Codex developer instructions + reasoning effort (preserving existing user `developer_instructions` and skill config); Pi/OpenCode/DSH/OMP/Agy native role-contribution mechanisms. Preserve normal harness instructions, existing user developer/skill config, canonical instruction sources, and workflow visibility (workflow skills Coordinator-only; workers must not get ruach-workflow-* visible). Temporary generated native configs may reference canonical sources; never commit copied role/skill bodies or persistent user harness settings. argv arrays only, preserve cwd/args, never expose secrets, never blindly retry/duplicate submitted work.
- Verify every flag against the installed CLI (`<cli> --help` etc.) and primary documentation; never invent a flag. Record CLI versions. `herdr agent start --help` lists supported kinds; installed Herdr reportedly lacks `dsh`: the dsh adapter must exist but fail accurately before mutation when a CLI or Herdr kind is unavailable. Classify each adapter: live-verifiable vs fixture/argv-only coverage. No faking live support, no silent harness/model substitution.
- A thin root launch command in the main checkout (Python, being written by the other Coordinator) will later delegate to worker.ts; do not duplicate it; describe the delegation seam.

### 2. ruach-handoff (protocol + mechanical validation)
`bun <skill>/scripts/validate.ts docs/mailbox/foo/implementer.md`
- Required: task/status/outcome/artifacts/verification/discoveries/blockers; documented status enum; concise leading structured block; meaningful diagnostics and nonzero exit on failure.
- Accept the existing leading YAML block format used by reports in docs/mailbox/ and preserve its documented contract where practical. Survey existing reports; identify any intentional format boundary for historical reports instead of rewriting them.
- handoff.schema.json must match exactly what the validator accepts.
- Referenced revisions must exist in the relevant repository (explicit `--repo` context plus correct report-local inference), but never require a report to predict its own creating commit SHA; do not conflate tested/reviewed/delivered/evidence-only revisions. Templates/defaults for verification and review are neutral/not-run, never prefilled success. Mechanical validation does not establish semantic truth or execute checks.
- Test plan must cover: valid minimal reports, absent/invalid status, malformed types/header, missing/existing revisions, neutral defaults, evidence-only successors / circular-SHA boundary. No caller-specific paths in reusable code.

### 3. ruach-harness-eval (evaluation only)
- Absorb applicable behavior from /tmp/brainlab-orchestrator-acceptance.py, /tmp/brainlab-orchestrator2-acceptance.py, /tmp/check-brainlab-orchestrator-scope.py, /tmp/brainlab-orchestrator2-scope.py, /tmp/brainlab-orchestrator2-evidence-check.py (plus their JSON outputs in /tmp and docs/mailbox/orchestrator-*/ for context).
- Same assignment + same acceptance + different harness/model must be reproducible via explicit fixtures/config; clean structured results and exit statuses.
- scope-check: specified baseline/candidate vs allowed paths, identify unexpected changes and dirty state per its contract, never mutate the checkout.
- acceptance: checks observable task behavior, preserves negative evidence.
- No launcher/coordinator runtime, periodic watchers or benchmark machinery in ruach-herdr/handoff. The daily Coordinator role/workflow must not load this evaluator skill automatically.

### Canonical documentation (planned later, after ruach-herdr exists)
Narrow updates to .agents/agents/coordinator.md (use ruach-herdr with role/route/cwd/name and resolve routes from canonical YAML; no native flags; no model names), .agents/skills/ruach-workflow-feature/SKILL.md and role/report guidance references for mechanical handoff validation, .agents/README.md, docs/SCHEMA.md. Specify the minimal edits. Do NOT plan edits to docs/CURRENT.md, docs/TASK_LOGS.md, justfile, bin/, scripts/, models/routing/roles YAML, prototype source/tests, or unrelated skills (those happen at a later integration).

## Deliverable
Write your design as your owned report `docs/mailbox/versioned-agent-skills/architect.md` (this is the only file you may create/modify besides scratch under `.agents/scratch/versioned-agent-skills/architect/`). It must contain, concisely:
- CLI interface and exit-code contracts per script; the routing resolution contract and provisional schema assumption with integration checkpoints;
- per-adapter table: CLI path/version, verified flags with source (help output/doc URL), role-injection mechanism, workflow-visibility handling, temp-config handling, coverage class (live-capable vs fixture/argv only), unavailable-failure behavior;
- handoff schema/protocol decisions incl. status enum, revision-field semantics, repo inference, historical-report boundary;
- harness-eval fixture/config format and result format;
- test strategy per skill (black-box, invalid input, fixture-based; how Bun tests run; any dependency e.g. YAML parser and justification);
- implementation split into independent tasks with explicit file ownership suitable for concurrent Implementers, plus integration order and the doc-update task;
- risks, open questions, and anything needing parent/user decision.
Commit only your report on branch versioned-agent-skills-20261004 (local commit; message ending with `Co-Authored-By` trailer is not required for you). Then complete with the ruach-handoff protocol: /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills/.agents/skills/ruach-handoff/SKILL.md, reporting your report path and the actual commit SHA that contains it (as observed after committing; do not predict it inside the report).
