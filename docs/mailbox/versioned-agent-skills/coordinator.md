task: versioned-agent-skills / coordinator
status: complete
outcome: Verified, independently reviewed candidate of ruach-herdr, extended ruach-handoff and ruach-harness-eval with narrow canonical documentation on versioned-agent-skills-20261004; main integration, root-command delegation and global installation remain for a later parent assignment.
artifacts:
  - docs/mailbox/versioned-agent-skills/coordinator.md
  - .agents/skills/ruach-herdr/
  - .agents/skills/ruach-handoff/
  - .agents/skills/ruach-harness-eval/
  - .agents/agents/coordinator.md
  - .agents/skills/ruach-workflow-feature/SKILL.md
  - .agents/README.md
  - docs/SCHEMA.md
  - versioned-agent-skills-20261004
verification:
  - "Worker-reported combined verification at tested_revision (implementer-integration-3.md): frozen installs; default bun test handoff 24, harness-eval 59, herdr 81 passed, 0 failed; skill format checks; handoff validation of task reports; scope-check from source_baseline with no unexpected paths; portability/model-name/native-flag scans."
  - "Worker-reported routed preparation against the committed catalogs at catalog_revision: coordinator, scout, implementer and reviewer resolve and dry-run passed without submission; architect preferred Claude route fails closed (exit 3); explicit declared architect alternative passed."
  - "Independent review: reviewer.md (one blocking P1 and one optional P3, both fixed), reviewer-2.md and reviewer-3.md report no outstanding blocking or optional findings for reviewed_revision."
  - "Independent forward test (scout-forward-test.md) on the first candidate: no runtime defect; doc-gap/friction items were fixed and re-reviewed."
  - "Not run: live harness sessions, paid model turns, native role-injection or workflow-visibility acceptance in launched sessions, main-checkout integration, root launcher delegation, global installation. The Coordinator ran no checks itself; all results above are worker evidence."
review:
  - "Independent Reviewer, three rounds; no outstanding blocking or optional findings at reviewed_revision."
discoveries:
  - "Preferred Claude Architect route cannot be prepared on this machine: Claude account-synced skills (and, in linked worktrees, a fallback source) cannot be verifiably excluded from worker sessions, so the adapter fails closed with an actionable diagnostic. The declared Codex alternative works only when chosen explicitly with --route. Accepting this, changing the catalog preference, or verifying a Claude exclusion mechanism is a parent/user decision."
  - "Codex launches require an already-running local codex app-server daemon of matching version, used to read effective layered config read-only; without it the adapter fails before mutation (exit 3)."
  - "pi, opencode and dsh executables are absent and dsh is not a Herdr 0.9.0 kind; omp and agy are installed but their role-contribution and workflow-exclusion mechanisms are unverified. All five fail before mutation and have fixture/failure coverage only."
  - "Repository routing policy (five roles, claude|codex, high effort, Claude coordinator) stays in the repository's own validator at catalog_revision; the portable skill validates catalog structure/references and delegates harness/effort validity to adapters."
  - "Informational trial merge onto catalog_revision conflicted only in .agents/README.md; scripts/agent-routing.py at catalog_revision launches independently and does not yet delegate to worker.ts (mapping documented in ruach-herdr references/routing.md)."
blockers: []
candidate_revision: 46689c1ea4084b5e91dd2c7c7e6ac3d11e37e866
tested_revision: 46689c1ea4084b5e91dd2c7c7e6ac3d11e37e866
reviewed_revision: 46689c1ea4084b5e91dd2c7c7e6ac3d11e37e866
source_baseline: c6083e892285b43c297c742ff28553ae3e2e7310
catalog_revision: 97752643b31cdcf8c8ec9f09204382c6766b1573

Author: Coordinator (Claude). Date: 2026-10-04 UTC. Workflow: ruach-workflow-feature. Delivery destination is local branch `versioned-agent-skills-20261004` only; nothing was merged to master, pushed, or installed globally, and the main checkout was not modified. Commits after `46689c1` on this branch are evidence-only reports. This report does not state the SHA of the commit that adds it.

## Workers and reports

All workers ran GPT-6.1-Sol/high through the temporary bootstrap bridge, in isolated worktrees under `.agents/scratch/`.

| Worker | Work | Report |
| --- | --- | --- |
| skills-architect | Design, contracts, ownership split (62d7ac7) | [architect.md](architect.md) |
| skills-impl-handoff | Validator, schema, tests; test-timeout fix; diagnostic-ordering doc | [implementer-handoff.md](implementer-handoff.md), [-fix](implementer-handoff-fix.md), [-doc](implementer-handoff-doc.md) |
| skills-impl-eval | Acceptance and scope-check; P1/P3 review fixes | [implementer-eval.md](implementer-eval.md), [-fix](implementer-eval-fix.md) |
| skills-impl-herdr | Worker launcher and seven adapters; committed-catalog routing; portable-policy fix; Claude gate diagnostics | [implementer-herdr.md](implementer-herdr.md), [-routing](implementer-herdr-routing.md), [-fix](implementer-herdr-fix.md), [-claude-gate](implementer-herdr-claude-gate.md) |
| skills-impl-integration | Three integration rounds, documentation, combined verification, trial merge | [round 1](implementer-integration.md), [round 2](implementer-integration-2.md), [round 3](implementer-integration-3.md) |
| skills-scout-forward | Realistic forward test using only skill docs, no expected answers | [scout-forward-test.md](scout-forward-test.md) |
| skills-reviewer | Independent review and two re-reviews | [reviewer.md](reviewer.md), [reviewer-2.md](reviewer-2.md), [reviewer-3.md](reviewer-3.md) |

## Decisions

- The user chose to proceed with a provisional routing schema; after routing was delivered at `catalog_revision`, ruach-herdr was reconciled to the committed `.agents/{models,routing,roles}.yaml` and re-reviewed.
- Coordinator-raised finding: routing initially hard-coded repository policy; it was moved out of the portable skill.
- Unavailable or unverified adapters fail accurately before any pane, temporary file or submission; there is no harness or model substitution.
- The harness-eval skill is evaluation-only and marked explicit-invocation; daily Coordinator guidance does not load it.

## Pending for the parent

1. Main integration against `catalog_revision` or later (resolve the `.agents/README.md` conflict), and making the root launch command delegate to `worker.ts`.
2. Global `~/.agents/skills` links to these canonical sources, plus a `bun install --frozen-lockfile` in each skill directory.
3. Decision on the Claude Architect gate described above, before the fresh route discovery test.
4. CURRENT/TASK_LOGS entries during integration.
