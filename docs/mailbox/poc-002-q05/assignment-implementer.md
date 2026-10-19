# Assignment: POC 002 checkpoint Q05 (Phaser battle UI)

Issued by: Coordinator, 2026-10-19. Role: **implementer**. Task ID: `P2-Q05`.

## Workspace

Worktree `/opt/dev/tehom-brainlab-p2-q05`, branch `p2-q05`, BASE `d6b7249` (integration branch `poc-002-component-combat`, which contains the accepted design and every checkpoint merged so far). Commit on `p2-q05` only; do not merge, rebase onto other branches, or push. Other checkpoints are being built in parallel in other worktrees; never touch their worktrees or owned paths. Disposable files go under the OS temporary directory, never in the repository. Do not load or follow any `ruach-workflow-*` skill.

## Scope

Implement checkpoint **Q05** exactly as defined in `docs/plans/2026-10-19-db0bad72-poc-002-component-combat.md`, section "Q05 — Phaser battle UI", meeting every item of its numbered acceptance list. Rules come solely from the brief `docs/prototypes/poc-002-component-combat.md` (cite `§n`); public contracts from the plan's "Contracts and decisions" and the Q01 `src/core/types.ts`; decisions from `docs/adr/0007-poc-002-component-combat.md`. Read the merged Q01 handoff (`docs/mailbox/poc-002-q01/implementer.md`) and any other merged checkpoint handoffs under `docs/mailbox/poc-002-q*/` that your checkpoint depends on.

**Owned paths:** only the Q05 row of the plan's ownership table (under `poc-002-component-combat/`). Do not edit the root `justfile` or `poc-002-component-combat/README.md` (integration owner); supply README section text in your handoff instead.

**Notes for Q05.** Build on the merged Q02 core (previews and commits only through the real `applyCommand`/`previewCommand`), Q07 art (`src/view/art`) and Q06 audio (`src/audio`). Read `docs/mailbox/poc-002-q02/implementer.md`, `docs/mailbox/poc-002-q06/implementer.md` (audio starts muted; decide unmute through a visible control per the plan) and `docs/mailbox/poc-002-q07/implementer.md` (translate panel-local draw bounds and hit regions together). Q03 and Q04 are being built in parallel; do not depend on them. Q08 (selection screen and gauntlet flow) comes after you and builds on your `src/view/session.ts`; keep its interface as the plan specifies. You are the only checkpoint running browser checks right now.

## Restrictions

Copy, never import, POC 001 patterns. No changes to `poc-001-linked-formation/`, `shared/`, `assets/`, docs (`docs/CURRENT.md`, `docs/TASK_LOGS.md`, the brief, plan or ADRs), or other checkpoints' owned paths. No new dependencies or versions. Tests follow ADR-0006 and `.agents/skills/ruach-testing/SKILL.md`: rule tests use test-owned content variants; exact v1 numbers appear only in versioned parity fixtures. **Stop conditions S1–S6** (plan, "Non-goals and stop conditions") apply: on any, stop and report the question to the Coordinator in your reply; never invent a rule the brief does not state, and never rename or remove a Q01 public contract.

## Verification

Run bare, exactly as a user would, from the worktree root, with no extra environment variables:

```sh
./poc-002-component-combat/bin/run install
./poc-002-component-combat/bin/run typecheck
./poc-002-component-combat/bin/run test
./poc-002-component-combat/bin/run build
./poc-002-component-combat/bin/run test-browser
```

Record each command, exit code and key output line (test counts, assertion counts). If a prerequisite is missing, report it; do not work around it with environment overrides.

## Hand-back

Report `docs/mailbox/poc-002-q05/implementer.md`, beginning with the ruach-handoff block (`.agents/skills/ruach-handoff/SKILL.md`); `source_baseline: d6b7249`; `candidate_revision` and `tested_revision` = your implementation commit. Include changed paths (all within owned paths), exact commands and results, a mapping of every numbered acceptance item to evidence, README section text for the integration owner, any additions to public contracts, limitations, and any stop condition hit. Validate it: copy `.agents/skills/ruach-handoff` to the OS temporary directory, run `bun install --frozen-lockfile` there, then from the worktree root `bun <copy>/scripts/validate.ts docs/mailbox/poc-002-q05/implementer.md --repo .`; record the exact result. Commit the implementation, then this assignment unchanged with the report. Reply with both SHAs and a three-line summary.
