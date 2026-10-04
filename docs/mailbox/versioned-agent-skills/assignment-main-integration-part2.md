# Part 2: skills-impl-main — merge contract corrections, root permissions, docs, combined verification

Same integration worktree/branch (versioned-agent-skills-main at 3509456). Append a "Part 2" section to your own report docs/mailbox/versioned-agent-skills/integration-main.md and update its leading fields to describe Part 2 (it is your own report; earlier reports by others stay unchanged).

## Merge
Merge versioned-agent-skills-herdr @ ab1de71 (implementation 97e7c09 Claude contract correction; 97ced69 Codex stdio fallback + `--permissions inherit|auto-review`; reports implementer-herdr-contract.md, implementer-herdr-codex-permissions.md). Expect a conflict in `.agents/skills/ruach-herdr/references/routing.md` against your delegation-seam edits: keep the herdr implementer's technical content and your delivered root-delegation documentation; ensure the seam text is accurate after Part 2.

## Corrected contracts (parent decisions; make docs consistent)
- Claude: workers get canonical role + self-contained assignment; the launcher never supplies workflow bodies; known repository workflows are suppressed per launch where supported; full account/plugin/managed catalog visibility is an honest unverified limitation, not a startup prohibition. The preferred Claude Architect route must prepare.
- Codex: running matching daemon preferred; otherwise short-lived native stdio inspection (may initialize Codex runtime state, never user config); failure only if neither works.
- Permissions: root launches previously used automatic approval review (Claude `--permission-mode auto`, Codex `--approve-for-me`). Restore this through the skill: the root wrapper passes `--permissions auto-review` as repository launch policy (root config), not native flags. No native harness flags in root code. Document it.
- Remove from your Part-1 docs/report statements that are now inaccurate (e.g. "permission policy is inherited", Claude gate wording in README/coordinator/agent-routing docs).

## Docs
- docs/CURRENT.md and docs/TASK_LOGS.md: append factual entries for this integration and its verification (do not lose/rewrite other entries; do not claim master delivery or global installation yet; do not claim a discovery test). Reconcile docs/SCHEMA.md and navigation with what is delivered. Coordinator guidance: no model names/native flags.

## Combined verification on the new combined revision (you run; do not weaken tests; record exact commands/results)
1. Root: root test suite (bin/test-agent-routing or just recipe); root delegation boundaries via the real root surface `just agent-routing ...` / bin/agent-routing: resolve for all five roles and every declared alternative (`--route`), invalid role, disallowed route, unknown option, retired `--pane` diagnostic, missing Bun (BUN_BIN pointing to nonexistent) failure, `--root` handling, exit codes and stdout/stderr forwarding. Confirm root code contains no native harness flags/role-injection/routing resolution (grep evidence).
2. Native preparation via the skill: `worker.ts resolve` and `start --dry-run --permissions auto-review` for all five roles + alternatives against this worktree's own catalogs; preferred Architect (Claude) must succeed; no panes/submissions. Also confirm root `start` delegates the correct argv to worker.ts using a fake herdr/worker or by reviewing a dry-run-equivalent path — do NOT start real agents.
3. Skills: `bun install --frozen-lockfile` + default `bun test` in each of the three skills; quick validator for all ruach-* skills; handoff validator over all docs/mailbox/versioned-agent-skills/*.md; harness-eval scope-check from 97752643 to the combined revision with an allowed set you define (skills, root routing scripts/tests/bin/justfile if changed, docs touched, mailbox) — report unexpected paths.
4. Global-link portability: in a temporary HOME, symlink `~/.agents/skills/{ruach-herdr,ruach-handoff,ruach-harness-eval}` to this worktree's skill dirs and invoke each script's `--help` plus a worker `resolve --offline` and a handoff validation through the link path; confirm resolved realpaths; no writes into the skill dirs other than ignored node_modules.
5. P02/P01 unchanged: `git diff 97752643 <combined> --stat` restricted to non-agent paths (prototypes, poc-*, shared, tools, assets, P02/P01 evidence) is empty; list paths checked. No browser rerun needed.
6. Portability/model-name/native-flag scans over skills and coordinator/workflow docs; whitespace check.
Record limits: no live model session, no live role/skill discovery verified.
Commit (implementation/docs), then your report update (validated). Hand off with combined/tested revision and report SHA in terminal. Do NOT deliver to master or install globally yet.
