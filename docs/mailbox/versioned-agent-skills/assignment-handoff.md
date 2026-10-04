# Assignment: skills-impl-handoff (role: implementer)

Worktree: /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-handoff, branch versioned-agent-skills-handoff (from 62d7ac7). Report: docs/mailbox/versioned-agent-skills/implementer-handoff.md.
Exclusive ownership: `.agents/skills/ruach-handoff/**` (existing SKILL.md: extend compatibly) and your report. Do not edit any existing docs/mailbox report.

## Required behavior
- `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/foo/implementer.md [--repo DIR]`.
- Required fields task/status/outcome/artifacts/verification/discoveries/blockers in a concise leading structured block; documented status enum (keep the existing protocol's statuses); meaningful diagnostics (field/path, stable codes) and nonzero exit on failure; exit codes per design.
- Accept the repository's existing leading YAML block (see docs/mailbox/p01-browser-harness/*.md and the existing SKILL.md) and preserve its documented contract where practical. Do not rewrite historical reports; identify the intentional format boundary (e.g. older experiment summaries without a leading block) in SKILL.md and your report, with evidence from running the validator over existing docs/mailbox reports.
- `handoff.schema.json` must match exactly what the validator accepts structurally (prefer the validator using the schema directly).
- Revisions: referenced revisions must exist in the relevant repository (explicit `--repo`, else correct inference from the report's own location incl. worktrees — never the caller cwd). Never require a report to contain its own creating commit SHA; keep tested/reviewed/delivered/evidence-only revisions distinct; evidence-only successor commits (recording commits after a tested revision) are legitimate.
- Templates/defaults in SKILL.md for verification and review are neutral/not-run, never prefilled success. SKILL.md states mechanical validation does not establish semantic truth or execute checks.
- No caller-specific paths in reusable code.

## Verification (you run)
`bun test` covering: valid minimal reports; each status; absent/invalid status; malformed header/YAML/types/duplicate keys; missing and existing revisions (temp git repos, including a worktree and explicit --repo); neutral defaults; evidence-only successor and circular-SHA boundary (report written before its commit exists). Plus a run of the validator over every existing docs/mailbox/**/*.md with results tabulated (expected failures for historical-format reports explained, not fixed).
