# Assignment: skills-impl-integration — re-integration round 2

Worktree: /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills, branch versioned-agent-skills-20261004 (HEAD d8b67cc = reviewer report on top of tested candidate 4e8d7d3). New report: docs/mailbox/versioned-agent-skills/implementer-integration-2.md (keep your first report unchanged). Rules in common.md and your earlier integration-assignment.md (same doc ownership and restrictions) apply.

## 1. Merge (local only), in order
- versioned-agent-skills-handoff @ c3ed791 (test-timeout fix aa16a0a; doc 974bfcb; reports implementer-handoff-fix.md, implementer-handoff-doc.md)
- versioned-agent-skills-eval @ c4532de (review P1/P3 fix bed6510; report implementer-eval-fix.md)
- versioned-agent-skills-herdr @ 386a856 (committed-schema routing 8dc2c9f/1151b48; portable-policy fix + H1/H2 2c6a836; reports implementer-herdr-routing.md, implementer-herdr-fix.md)
- versioned-agent-skills-fwd @ 5c0890c (forward-test report scout-forward-test.md only)
Report conflicts and resolutions.

## 2. Docs refresh (your owned docs only: .agents/agents/coordinator.md, ruach-workflow-feature/SKILL.md, role report-guidance lines, .agents/README.md, docs/SCHEMA.md)
Routing is no longer provisional: ruach-herdr now consumes the committed `.agents/models.yaml`, `.agents/routing.yaml`, `.agents/roles.yaml` schema delivered on local master at 97752643b31cdcf8c8ec9f09204382c6766b1573 (NOT present on this branch yet; main integration is a later assignment). Update any "provisional" wording truthfully; keep coordinator.md free of model names and native flags; keep adapter coverage statements truthful (Claude/Codex: preparation verified with fakes + installed-CLI dry-run, Codex needs a running matching app-server daemon; pi/opencode/dsh/omp/agy fail before mutation; no live session acceptance yet). Do not edit skills.

## 3. Combined verification on the new combined revision (you run; do not change tests)
- Each skill: `bun install --frozen-lockfile` and default `bun test`; record counts.
- quick validator on all ruach-* skills.
- handoff validator over every docs/mailbox/versioned-agent-skills/*.md.
- harness-eval scope-check 62d7ac7 -> new combined revision, allowed = three skill dirs + your owned docs + docs/mailbox/versioned-agent-skills/**.
- ruach-herdr resolve and start --dry-run for coordinator, implementer, reviewer by role alone with --repo pointing at a temporary detached worktree of 97752643 (create with `git worktree add --detach <OS temp dir> 97752643`, remove afterwards). No real start.
- Portability and model-name/native-flag scans as before.
## 4. Informational trial merge (do not deliver)
In a temporary detached worktree at 97752643, `git merge --no-commit --no-ff <new combined revision>`; report conflicts (files) or clean result; optionally run the three skill suites there; then abort and remove the temp worktree. Do not touch the main checkout or master.

Commit merges + docs, then your report as evidence-only successor (validated with validate.ts). Report combined/tested revision, source revisions, commands/results, scope evidence, trial-merge result, discoveries, blockers; report-commit SHA in terminal handoff.
