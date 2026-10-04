# Assignment: skills-impl-integration (role: implementer; integration owner)

Worktree: /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills, branch versioned-agent-skills-20261004 (currently 62d7ac7, the Architect design commit). Report: docs/mailbox/versioned-agent-skills/implementer-integration.md. Read common rules in common.md next to this file (they apply, except your ownership below).

## 1. Integrate (local merges only into versioned-agent-skills-20261004)
Merge, in this order, these completed source branches (each based on 62d7ac7, disjoint ownership):
- versioned-agent-skills-handoff @ b12aa88 (impl 0dfb52f) — `.agents/skills/ruach-handoff/**`, report implementer-handoff.md
- versioned-agent-skills-eval @ 397f22a (impl 1509d8f) — `.agents/skills/ruach-harness-eval/**`, report implementer-eval.md
- versioned-agent-skills-herdr @ 3340659 (impl a47d8d6) — `.agents/skills/ruach-herdr/**`, report implementer-herdr.md
Do not modify other workers' reports. Report conflicts/resolutions (none expected). Do not merge to master, push, touch the main checkout /opt/dev/tehom-brainlab, or install globally.

## 2. Canonical documentation (now that ruach-herdr exists) — narrow edits only
Owned files: `.agents/agents/coordinator.md`, `.agents/skills/ruach-workflow-feature/SKILL.md`, report-guidance references in `.agents/agents/{scout,architect,implementer,reviewer}.md` only where needed, `.agents/README.md`, `docs/SCHEMA.md`.
- coordinator.md: launch workers with the ruach-herdr skill giving only role / route (optional) / cwd-or-worktree / name; routes and models resolve from the repository's canonical routing YAML. Do NOT prescribe native harness flags and do NOT embed any model names. Keep Herdr for monitoring/communication. Preserve role boundaries.
- ruach-workflow-feature/SKILL.md: minimal pointer that worker launch uses ruach-herdr and that worker reports must pass mechanical validation with ruach-handoff's validate.ts (run by the responsible worker; Coordinator does not run checks itself). Preserve all feature sequencing.
- Role files: only if needed so workers know to run `validate.ts` on their own report before handoff (keep it short; prefer putting it once in ruach-handoff SKILL.md if already there and only referencing it).
- .agents/README.md: list ruach-herdr, ruach-harness-eval (explicit evaluation only; not loaded by daily coordination), and the handoff validator; update the "harness integration has not been configured" sentence truthfully (adapter coverage: Claude/Codex preparation verified with fakes + installed-CLI dry-run; others fail before mutation; no live session acceptance yet).
- docs/SCHEMA.md: short addition on the leading handoff block/revision-field semantics/historical-format boundary, linking to ruach-handoff rather than duplicating it.
- Do NOT edit docs/CURRENT.md, docs/TASK_LOGS.md, justfile, bin/, scripts/, routing YAML, prototypes, or the three skill directories (if you find a defect in a skill, report it as a discovery instead of fixing it).

## 3. Combined verification on the combined revision (you run; do not change tests)
- In each skill dir: frozen dependency install (`bun install --frozen-lockfile`) and `bun test`; record counts.
- skill-creator quick validator on all five ruach-* skills that have SKILL.md (format evidence only).
- `bun .agents/skills/ruach-handoff/scripts/validate.ts` over every docs/mailbox/versioned-agent-skills/*.md (expect all valid) — report results.
- `bun .agents/skills/ruach-harness-eval/scripts/scope-check.ts` from 62d7ac7 to the combined revision with the allowed paths = the three skill dirs, the docs files you own above, and docs/mailbox/versioned-agent-skills/** ; report result.
- ruach-herdr: `resolve` and `start --dry-run` for coordinator (Claude route) and implementer (Codex route) using the skill's fixture/provisional YAML against installed CLIs; note any daemon prerequisite observed. No real agent start.
- Portability scan over the three skill dirs (no /tmp/brainlab, /opt/dev, /home/metatron, repo names; no model names in SKILL.md/scripts); confirm coordinator.md/workflow contain no model names or native flags.
Commit integration + docs; then commit your report as an evidence-only successor. Report: combined revision (the docs+merge commit that was tested), source revisions, exact commands/results, scope evidence, discoveries, blockers. Return the report commit SHA in your terminal handoff (do not predict it in the report). Validate your own report with the handoff validator before finishing.
