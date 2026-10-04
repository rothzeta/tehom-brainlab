# Assignment: skills-impl-integration — round 3

Worktree/branch as before (versioned-agent-skills-20261004, HEAD e618c79 = reviewer-2 report on top of reviewed candidate 618ee9b). New report docs/mailbox/versioned-agent-skills/implementer-integration-3.md. Previous rules/ownership apply.

1. Merge versioned-agent-skills-herdr @ c2a2017 (Claude gate diagnostics 8340a9d; report implementer-herdr-claude-gate.md).
2. Docs: only if your owned docs (README/coordinator/workflow/SCHEMA) now state something inaccurate about Claude worker launch; e.g. README coverage can mention that Claude worker preparation fails closed when account-synced/managed/linked-worktree workflow sources cannot be excluded, with the explicit `--route` alternative remedy. No model names in coordinator.md. Keep it minimal; skip if nothing is inaccurate.
3. Combined verification on the new combined revision: frozen installs + default `bun test` for all three skills; quick validator; handoff validator over all docs/mailbox/versioned-agent-skills/*.md; scope-check 62d7ac7 -> new revision with the same allowed set; role-alone resolve/dry-run for all five roles plus explicit `--route` alternative for architect against a detached temp worktree of 97752643 (remove after); portability/model-name/native-flag scans.
Commit, then report (evidence-only successor, validated). Report combined/tested revision and report SHA (terminal handoff).
