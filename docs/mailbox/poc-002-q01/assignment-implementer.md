# Assignment: POC 002 checkpoint Q01 (scaffold, toolchain, content v1 and contracts)

Issued by: Coordinator, 2026-10-19. Role: **implementer**. Task ID: `P2-Q01`.

## Workspace

- Worktree `/opt/dev/tehom-brainlab-p2-q01`, branch `p2-q01`, BASE `15c922d`. The BASE is the integration branch `poc-002-component-combat`, which contains the accepted design.
- Commit on `p2-q01` only. Do not merge, rebase onto other branches, or push.
- Disposable files go under the OS temporary directory, never in the repository.
- Do not load or follow any `ruach-workflow-*` skill.

## Scope

Implement checkpoint **Q01** exactly as defined in `docs/plans/2026-10-19-db0bad72-poc-002-component-combat.md`, section "Q01 — Scaffold, toolchain, content v1 and contracts", with its numbered acceptance list 1–9. The governing documents are:

- the rules, solely from the brief `docs/prototypes/poc-002-component-combat.md` (§1–§13);
- the public API and view interfaces, from the plan's "Contracts and decisions";
- the toolchain, pins, ports and provenance-comment rule, from the plan's "Starting source and ownership", "Fixture and inputs" and "Settled choices";
- the decisions, from `docs/adr/0007-poc-002-component-combat.md`.

Q01 fixes the public contracts in `src/core/types.ts` that Q02–Q08 will build against in parallel. Make them complete: every rejection code and event kind the brief needs, and every API signature in the plan.

**Owned paths:** only the Q01 row of the plan's ownership table, under `poc-002-component-combat/`. Do **not** edit the root `justfile`: the integration owner adds the `poc-002-*` recipes. Verify through `./poc-002-component-combat/bin/run <command>`.

## Restrictions

- Copy the POC 001 patterns; never import from `poc-001-linked-formation/`.
- Do not change anything under `poc-001-linked-formation/`, `shared/`, `assets/`, `docs/CURRENT.md`, `docs/TASK_LOGS.md` or any other document.
- Use no new dependencies or versions beyond POC 001's pins.
- Tests follow ADR-0006 and `.agents/skills/ruach-testing/SKILL.md`. Rule and validation tests use test-owned content variants, never the v1 defaults.
- **Stop conditions S1–S6** (plan, "Non-goals and stop conditions"): if one applies, stop, commit nothing further that depends on it, and report the question to the Coordinator through your reply. Never invent a rule the brief does not state.

## Verification

Run bare, exactly as a user would, from the worktree root, with no extra environment variables:

```sh
./poc-002-component-combat/bin/run install
./poc-002-component-combat/bin/run typecheck
./poc-002-component-combat/bin/run test
./poc-002-component-combat/bin/run build
./poc-002-component-combat/bin/run test-browser
```

Also confirm that `replay`, `sweep` and `probe` exit 2 with the naming message. Record each command with its exit code and the key output line. Docker is available. If a prerequisite is missing, report it; don't work around it with environment overrides.

## Hand-back

- **Report:** `docs/mailbox/poc-002-q01/implementer.md`, beginning with the ruach-handoff block (`.agents/skills/ruach-handoff/SKILL.md`). Use `source_baseline: 15c922d` and give the `candidate_revision` of your implementation commit.
- **Contents:** the changed paths (all within the owned paths), the exact commands and results, a mapping of acceptance items 1–9 to evidence, the README section text for the integration owner, a full list of the public contract names in `types.ts`, limitations, and any stop condition hit.
- **Validation:** copy `.agents/skills/ruach-handoff` to the OS temporary directory, run `bun install --frozen-lockfile` there, then from the worktree root run `bun <copy>/scripts/validate.ts docs/mailbox/poc-002-q01/implementer.md --repo .`. Record the exact result.
- **Commit:** commit the implementation, then this assignment unchanged with the report.
- **Reply:** both SHAs and a three-line summary.
