# Assignment: POC 002 checkpoint Q08 (Selection screen, gauntlet flow and record export)

Issued by: Coordinator, 2026-10-19. Role: **implementer**. Task ID: `P2-Q08`.

## Workspace

Worktree `/opt/dev/tehom-brainlab-p2-q08`, branch `p2-q08`, BASE `e9c87a7` (integration branch `poc-002-component-combat`, which contains the accepted design and every checkpoint merged so far). Commit on `p2-q08` only; do not merge, rebase onto other branches, or push. Other checkpoints are being built in parallel in other worktrees; never touch their worktrees or owned paths. Disposable files go under the OS temporary directory, never in the repository. Do not load or follow any `ruach-workflow-*` skill.

## Scope

Implement checkpoint **Q08** exactly as defined in `docs/plans/2026-10-19-db0bad72-poc-002-component-combat.md`, section "Q08 — Selection screen, gauntlet flow and record export", meeting every item of its numbered acceptance list. Rules come solely from the brief `docs/prototypes/poc-002-component-combat.md` (cite `§n`); public contracts from the plan's "Contracts and decisions" and the Q01 `src/core/types.ts`; decisions from `docs/adr/0007-poc-002-component-combat.md`. Read the merged Q01 handoff (`docs/mailbox/poc-002-q01/implementer.md`) and any other merged checkpoint handoffs under `docs/mailbox/poc-002-q*/` that your checkpoint depends on.

**Owned paths:** only the Q08 row of the plan's ownership table (under `poc-002-component-combat/`). Do not edit the root `justfile` or `poc-002-component-combat/README.md` (integration owner); supply README section text in your handoff instead.

**Notes for Q08.** Build on the merged Q02 core, Q03 records, Q05 battle UI and session (`createSession(content, initialState, buildRevision?)` → `mountBattle`), Q06 audio and Q07 art; read their handoffs under `docs/mailbox/poc-002-q0{2,3,5}/`. Q08 acceptance was amended (Architect commit dcd4b44): the current attempt — fight or gauntlet, finished or unfinished, including after a death — must be exportable at any time before Reset or Return to selection, and the export must replay to the exported state (brief §12 amendment); prove it with your browser harness and the replay CLI. Q04 is being merged concurrently by the integration owner and may run browser checks on the same default port: if test-browser fails because the port is busy, wait and retry; never override the port.

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
./poc-002-component-combat/bin/run replay <a record exported by your browser harness>
```

Record each command, exit code and key output line (test counts, assertion counts). If a prerequisite is missing, report it; do not work around it with environment overrides.

## Hand-back

Report `docs/mailbox/poc-002-q08/implementer.md`, beginning with the ruach-handoff block (`.agents/skills/ruach-handoff/SKILL.md`); `source_baseline: e9c87a7`; `candidate_revision` and `tested_revision` = your implementation commit. Include changed paths (all within owned paths), exact commands and results, a mapping of every numbered acceptance item to evidence, README section text for the integration owner, any additions to public contracts, limitations, and any stop condition hit. Validate it: copy `.agents/skills/ruach-handoff` to the OS temporary directory, run `bun install --frozen-lockfile` there, then from the worktree root `bun <copy>/scripts/validate.ts docs/mailbox/poc-002-q08/implementer.md --repo .`; record the exact result. Commit the implementation, then this assignment unchanged with the report. Reply with both SHAs and a three-line summary.
