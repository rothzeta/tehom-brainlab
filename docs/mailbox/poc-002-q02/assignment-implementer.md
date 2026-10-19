# Assignment: POC 002 checkpoint Q02 (Headless rules core)

Issued by: Coordinator, 2026-10-19. Role: **implementer**. Task ID: `P2-Q02`.

## Workspace

Worktree `/opt/dev/tehom-brainlab-p2-q02`, branch `p2-q02`, BASE `87b1441` (integration branch `poc-002-component-combat`, which contains the accepted design and every checkpoint merged so far). Commit on `p2-q02` only; do not merge, rebase onto other branches, or push. Other checkpoints are being built in parallel in other worktrees; never touch their worktrees or owned paths. Disposable files go under the OS temporary directory, never in the repository. Do not load or follow any `ruach-workflow-*` skill.

## Scope

Implement checkpoint **Q02** exactly as defined in `docs/plans/2026-10-19-db0bad72-poc-002-component-combat.md`, section "Q02 — Headless rules core", meeting every item of its numbered acceptance list. Rules come solely from the brief `docs/prototypes/poc-002-component-combat.md` (cite `§n`); public contracts from the plan's "Contracts and decisions" and the Q01 `src/core/types.ts`; decisions from `docs/adr/0007-poc-002-component-combat.md`. Read the merged Q01 handoff (`docs/mailbox/poc-002-q01/implementer.md`) and any other merged checkpoint handoffs under `docs/mailbox/poc-002-q*/` that your checkpoint depends on.

**Owned paths:** only the Q02 row of the plan's ownership table (under `poc-002-component-combat/`). Do not edit the root `justfile` or `poc-002-component-combat/README.md` (integration owner); supply README section text in your handoff instead.

**Notes for Q02.** This is the largest checkpoint: the complete rules of brief §1–§13 for all content, including commands, rejection precedence, declarations, damage, statuses, six forms, Salve, previews, legal actions, the gauntlet run and fight records. Q05–Q08 build against your public API in parallel later, so implement exactly the Q01 signatures. Per S3 you may only *add* optional fields to `src/core/types.ts` and *correct* `content/combat-content.v1.json` values against the brief; list every such change in your handoff. Implement and test the simulation boundary (no imports of phaser, `src/view/**`, `src/audio/**` or browser globals from `src/core/**`). Seed parity fixtures `fixtures/parity/seed-*.json` from the brief's tuning-check traces. If a brief rule is ambiguous, stop (S1) and report the exact question; the Coordinator routes it to the Architect for a brief amendment.

## Restrictions

Copy, never import, POC 001 patterns. No changes to `poc-001-linked-formation/`, `shared/`, `assets/`, docs (`docs/CURRENT.md`, `docs/TASK_LOGS.md`, the brief, plan or ADRs), or other checkpoints' owned paths. No new dependencies or versions. Tests follow ADR-0006 and `.agents/skills/ruach-testing/SKILL.md`: rule tests use test-owned content variants; exact v1 numbers appear only in versioned parity fixtures. **Stop conditions S1–S6** (plan, "Non-goals and stop conditions") apply: on any, stop and report the question to the Coordinator in your reply; never invent a rule the brief does not state, and never rename or remove a Q01 public contract.

## Verification

Run bare, exactly as a user would, from the worktree root, with no extra environment variables:

```sh
./poc-002-component-combat/bin/run install
./poc-002-component-combat/bin/run typecheck
./poc-002-component-combat/bin/run test
./poc-002-component-combat/bin/run build
```

Record each command, exit code and key output line (test counts, assertion counts). If a prerequisite is missing, report it; do not work around it with environment overrides.

## Hand-back

Report `docs/mailbox/poc-002-q02/implementer.md`, beginning with the ruach-handoff block (`.agents/skills/ruach-handoff/SKILL.md`); `source_baseline: 87b1441`; `candidate_revision` and `tested_revision` = your implementation commit. Include changed paths (all within owned paths), exact commands and results, a mapping of every numbered acceptance item to evidence, README section text for the integration owner, any additions to public contracts, limitations, and any stop condition hit. Validate it: copy `.agents/skills/ruach-handoff` to the OS temporary directory, run `bun install --frozen-lockfile` there, then from the worktree root `bun <copy>/scripts/validate.ts docs/mailbox/poc-002-q02/implementer.md --repo .`; record the exact result. Commit the implementation, then this assignment unchanged with the report. Reply with both SHAs and a three-line summary.
