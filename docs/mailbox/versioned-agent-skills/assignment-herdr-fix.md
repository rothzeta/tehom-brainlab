# Bounded fix: skills-impl-herdr (Coordinator finding + forward-test items)

Same worktree/branch/ownership (versioned-agent-skills-herdr at 17e2db6; `.agents/skills/ruach-herdr/**`). New report: docs/mailbox/versioned-agent-skills/implementer-herdr-fix.md. Common rules apply.

1. Repository policy is hard-coded in the portable skill (`scripts/routing.ts` ~lines 4, 27, 34, 45): canonical five role names, routed harness limited to claude|codex, effort must be `high`, coordinator routes must use Claude. Requirement: models/routes/role preferences belong in repository data; the skill must be portable to other repositories. Fix:
   - Validate catalog structure and references generically (unknown fields, missing refs, alternatives, duplicates, types) as now.
   - Roles = those declared in roles.yaml; require `<repo>/.agents/agents/<role>.md` to exist for the selected role (not a fixed list).
   - Harness validity is delegated to the adapter registry: unknown kind fails clearly; known-but-gated adapters fail via their own accurate unsupported/unavailable result (exit 3) before mutation.
   - Effort is validated against what the selected adapter supports (verified values), not fixed to `high`.
   - Coordinator→Claude comes only from data (preferred route). Do not encode it in code.
   - If you believe any of these constraints is part of the committed schema's own contract (e.g. enforced in 97752643:scripts/agent-routing.py), note it as an integration discovery: the repository's own validator/tests keep enforcing repository policy; the skill must not duplicate it.
   Update tests: a portable fixture with different role names / non-high effort accepted where the adapter supports it; repository-policy cases removed or converted to generic validation cases.
2. Forward-test H1 (doc-gap): non-offline `resolve` and `start --dry-run` require live Herdr context (caller layout read) exactly like `start`; SKILL.md:~30 says only `start`. State it beside the quickstart examples and point to `resolve --offline` as the selection-only alternative.
3. Forward-test H2 (friction): the test suite needs Unix socket binding (tests/worker.test.ts:~53); in a sandbox without it all 50 tests failed in beforeEach after 5s timeouts each. Add a fast, clear prerequisite failure (e.g. one guard that fails the suite immediately with an explanatory message) or document the requirement in SKILL.md/test notes — do not silently skip.

Verification: frozen install; full `bun test`; resolve/dry-run against a detached temp worktree of 97752643 again (coordinator, implementer, reviewer by role alone; remove the temp worktree); quick validator; portability scan and a scan showing no role names/harness/effort policy literals remain in routing.ts beyond adapter capability data. Commit fix, then report (validate with the integration-branch validator, --repo your worktree). Handoff with SHAs (report SHA in terminal handoff).
