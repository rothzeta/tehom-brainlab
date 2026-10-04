# Assignment: skills-impl-eval (role: implementer)

Worktree: /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-eval, branch versioned-agent-skills-eval (from 62d7ac7). Report: docs/mailbox/versioned-agent-skills/implementer-eval.md.
Exclusive ownership: `.agents/skills/ruach-harness-eval/**` and your report.

## Required behavior
- Evaluation only: repeatable acceptance and scope evaluation. Absorb applicable behavior (read-only sources) from /tmp/brainlab-orchestrator-acceptance.py, /tmp/brainlab-orchestrator2-acceptance.py, /tmp/check-brainlab-orchestrator-scope.py, /tmp/brainlab-orchestrator2-scope.py, /tmp/brainlab-orchestrator2-evidence-check.py; context in docs/mailbox/orchestrator-comparison/ and orchestrator-four-harness/. Drop hard-coded roots/branches/models.
- Same assignment + same acceptance + different harness/model reproducible via explicit fixture/config files (documented format, schema_version); clean structured JSON results and exit statuses per design; results preserve negative evidence (failures not overwritten).
- `scripts/scope-check.ts`: compares specified baseline/candidate revisions against allowed (and protected) paths; identifies unexpected changes and dirty state per its documented contract; never mutates the checkout/index (prove it in tests).
- `scripts/acceptance.ts`: runs configured observable checks against a candidate; records commands, exit codes, outputs/excerpts, timeouts, candidate revision before/after.
- No launcher, coordinator runtime, periodic watchers, or benchmark machinery. SKILL.md description must make clear it's for explicit harness/model evaluation only, so daily coordination does not load it automatically.

## Verification (you run)
`bun test` covering the design's harness-eval matrix where applicable: same fixture under two declared harness/model runs yields identical check fingerprints; failing/timeout/missing-executable checks; scope violations (added/deleted/renamed/mode changes, untracked/staged/unstaged dirty state, protected paths); invalid config/revisions; no mutation of the repo by scope-check (compare git status/index before/after). Also run scope-check on this repository comparing 62d7ac7 to your own implementation commit with your owned path allowed, and report the result.
