task: versioned-agent-skills / skills-impl-eval-fix
status: complete
outcome: Fixed internal Git repository redirection and umask-dependent fixture equality without changing acceptance check environments or mode-sensitive hashes.
artifacts:
  - .agents/skills/ruach-harness-eval/scripts/common.ts
  - .agents/skills/ruach-harness-eval/tests/eval.test.ts
  - .agents/skills/ruach-harness-eval/references/config.md
  - docs/mailbox/versioned-agent-skills/implementer-eval-fix.md
  - versioned-agent-skills-eval
  - bed651059d1d92b0a1f76019a760af6f9644920c
verification:
  - Reproduced four pre-fix failures including false scope success and incorrect acceptance repository selection; all 10 targeted regressions pass after the fix.
  - Frozen install passed; full bun test passed 59 tests and 637 assertions under both umask 0022 and umask 0002.
  - Standalone Git archive of the fix commit passed frozen install and all 59 tests under umask 0002.
  - Quick skill format validator, whitespace check, and portability scan passed; baseline-to-fix scope check passed with clean state and only previously owned files.
  - Assigned handoff validator passed with explicit repository selection and all three supplied revision references resolved.
discoveries:
  - Inherited Git configuration and repository-selection variables must be isolated for private probes; intentional acceptance check overrides remain effective.
blockers: []
candidate_revision: bed651059d1d92b0a1f76019a760af6f9644920c
tested_revision: bed651059d1d92b0a1f76019a760af6f9644920c
source_baseline: 397f22a96140ddbd329e2b5c6d565be0a3bd6b68

Author: Implementer (skills-impl-eval). Date: 2026-10-04 UTC. Bounded follow-up to the independent review's Blocking P1 and Optional P3 findings. The implementation fix is committed; its later report-only commit will be identified in the terminal handoff. The [earlier report](implementer-eval.md) is preserved unchanged.

## Changes and decisions

[common.ts](../../../.agents/skills/ruach-harness-eval/scripts/common.ts) now removes all inherited `GIT_*` environment variables for private Git probes, then sets `GIT_OPTIONAL_LOCKS=0`. This covers repository/index/common-directory/object/discovery overrides and environment-injected Git configuration without maintaining a partial denylist. It creates a separate environment object; acceptance checks still receive their inherited environment plus explicit check overrides.

Repository discovery canonicalizes the explicitly requested directory and verifies that the resolved worktree contains it. A redirected worktree outside that directory is a setup error. Legitimate selected subdirectories and symlink aliases still work. Existing output guards now use this verified root and Git metadata, so inherited overrides cannot allow evidence writes inside the requested checkout.

[tests](../../../.agents/skills/ruach-harness-eval/tests/eval.test.ts) add six Git override cases, clean/dirty acceptance repository-selection checks, intentional check-environment preservation, metadata/index/worktree immutability checks for both supplied repositories, and root identity/alias/subdirectory coverage. The equal-fingerprint test explicitly gives both task fixtures mode 0644; a separate test changes only read/write permissions from 0644 to 0600 and requires different fixture/check fingerprints while assignment and acceptance hashes stay equal. Runtime full-mode hashing is preserved. [The v1 contract](../../../.agents/skills/ruach-harness-eval/references/config.md) documents the isolated-probe versus check-environment boundary.

No evaluator interface/schema changes, new dependencies, unrelated edits, global installation, merge, or push were made. The three implementation files changed by this fix are exactly the files linked above.

## Executed verification

Commands are relative to this worktree unless a different cwd is specified. Bun version: 1.4.2. Required edits/local Git commits used bounded approved escalations for the read-only `.agents` mount and shared worktree metadata; no approval-review rejection occurred.

- Before changing implementation, from the skill directory: `PATH=/home/metatron/.bun/bin:$PATH bun test ./tests/eval.test.ts --test-name-pattern 'inherited Git|configured check Git|fixture permission differences'` — exit 1, 5 passed / 4 failed / 49 filtered out. Actual failures included scope exit 0 for a dirty requested checkout under `GIT_DIR`/`GIT_WORK_TREE` redirection, acceptance reporting the other repository's candidate SHA, invalid inherited discovery values breaking probes, and invalid inherited GIT_DIR preventing acceptance setup. This reproduces the blocking behavior through the CLI. The initially mistargeted append command wrote nothing and its test filter matched no tests; the corrected invocation above is the reproduction.
- After the fix: `PATH=/home/metatron/.bun/bin:$PATH bun test ./tests/eval.test.ts --test-name-pattern 'inherited Git|configured check Git|fixture permission differences|repository identity'` — exit 0, 10 passed / 0 failed / 49 filtered out, 201 assertions. These tests exercise dirty evidence, candidate identity, rejected inside-checkout outputs, and byte/mode/size/mtime snapshots of both worktrees and indexes. They also confirm a configured Git check can intentionally inspect the other repository while evaluator metadata remains tied to the requested candidate.
- In `.agents/skills/ruach-harness-eval`: `PATH=/home/metatron/.bun/bin:$PATH bun install --frozen-lockfile` — exit 0; no dependencies added.
- In the skill directory: `umask 0022` followed by `PATH=/home/metatron/.bun/bin:$PATH bun test` — exit 0, **59 passed / 0 failed / 637 assertions**, 9.35 seconds.
- In the skill directory: `umask 0002` followed by `PATH=/home/metatron/.bun/bin:$PATH bun test` — exit 0, **59 passed / 0 failed / 637 assertions**, 18.66 seconds. These final implementation bytes were committed without further implementation edits.
- Archived the actual fix commit using `git archive bed651059d1d92b0a1f76019a760af6f9644920c .agents/skills/ruach-harness-eval` and extracted it using Python tarfile into `/tmp/ruach-eval-fix-portable-is9je2b2/.agents/skills/ruach-harness-eval`. In that independent copied skill: `PATH=/home/metatron/.bun/bin:$PATH bun install --frozen-lockfile`, then `umask 0002` and `PATH=/home/metatron/.bun/bin:$PATH bun test` — all exit 0, **59 passed / 0 failed / 637 assertions**, 13.47 seconds. This tests the existing fix revision with archive file modes and no source-checkout dependencies.
- `python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/ruach-harness-eval` — exit 0, `Skill is valid!`; format evidence only.
- `rg -n '/tmp/brainlab|Brainlab|tehom|gpt-|claude|codex|anthropic' .agents/skills/ruach-harness-eval` — exit 1, no matches; no experiment roots, repository names, model defaults, or cross-skill imports added.
- `git diff --check`, `git diff --cached --check`, and `git diff --check 397f22a..HEAD` — exit 0, no whitespace findings.
- `/home/metatron/.bun/bin/bun .agents/skills/ruach-harness-eval/scripts/scope-check.ts --repo . --baseline 62d7ac7 --candidate bed651059d1d92b0a1f76019a760af6f9644920c --allow .agents/scratch/versioned-agent-skills/eval/scope-allow.json` — exit 0, `ok: true`, correct baseline/fix/worktree revisions, `unexpected_paths: []`, `protected_changes: []`, `dirty: []`, `clean: true`. The existing allowance covers the skill and earlier report; the new report was not yet written.
- `git diff --stat 397f22a..HEAD` at the fix commit — only three owned implementation files, 97 insertions and 5 deletions. `git diff --stat 62d7ac7..HEAD` at the same existing revision showed only the owned evaluator skill and the preserved earlier report:

  ```text
   .agents/skills/ruach-harness-eval/SKILL.md         |  21 ++
   .../skills/ruach-harness-eval/agents/openai.yaml   |   2 +
   .agents/skills/ruach-harness-eval/package.json     |   6 +
   .../skills/ruach-harness-eval/references/config.md |  84 +++++
   .../ruach-harness-eval/scripts/acceptance.ts       | 209 +++++++++++
   .../skills/ruach-harness-eval/scripts/common.ts    | 136 +++++++
   .../ruach-harness-eval/scripts/scope-check.ts      | 102 ++++++
   .../skills/ruach-harness-eval/tests/eval.test.ts   | 391 +++++++++++++++++++++
   .../tests/fixtures/assignment.md                   |   2 +
   .../ruach-harness-eval/tests/fixtures/task.ts      |   6 +
   .../versioned-agent-skills/implementer-eval.md     |  79 +++++
   11 files changed, 1038 insertions(+)
  ```

Handoff validation: `/home/metatron/.bun/bin/bun /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills/.agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/versioned-agent-skills/implementer-eval-fix.md --repo /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-eval` — exit 0, `schema_version: 1`, `ok: true`, `diagnostics: []`; candidate/tested references resolved to the existing fix commit and source_baseline to the existing prior report commit. The final report was revalidated after recording this result.

## Coverage limits and remaining work

Both requested findings are implemented and verified; no blockers remain within this assignment. The Git isolation tests cover Linux repository selection, index/common/object storage, discovery, environment-injected configuration, and local worktree redirection. Caller environment itself is not modified. Acceptance commands retain intentional inherited/configured Git behavior and can write according to their supplied programs; this fix does not sandbox checks. No live harness/model calls or paid turns were run. Windows behavior, arbitrary non-UTF-8 filenames, and broader malicious executable/configuration scenarios remain unverified. An independent follow-up review or integration acceptance is not claimed. This report's structural validation does not certify the technical claims.
