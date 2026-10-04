# Assignment B-review — independent review of P02 formation algebra (role: reviewer)

You are the Reviewer (canonical role `.agents/agents/reviewer.md`, already injected), launched on route `gpt-6.1-sol-high`. Coordinator: Claude. Do not load or follow any workflow skill. Use `.agents/skills/ruach-handoff/SKILL.md` for your result and `.agents/skills/ruach-testing/SKILL.md` / ADR-0006 when judging tests.

## Exact change
- Repo `/opt/dev/tehom-brainlab`, local branch `p02-formation-algebra` (main checkout currently on it).
- Base: master `e3f60372a5fef279f92ed14caead48271247405f`.
- Candidate/tested technical revision `3570610406886f18ca08c51effc79b3e8f3ddd34`; branch head `fb0a352` adds evidence/status docs only. Review range `e3f6037..fb0a352`; confirm `3570610..fb0a352` changes no executable/test/config content.
- Implementer reports: `docs/mailbox/p02-formation-algebra/implementer.md`, `docs/mailbox/p02-formation-algebra/verification.md`.
- Do not modify tracked files or commit. Use a detached worktree under `.agents/scratch/p02/review-wt` if you need isolation; remove it after.

## Authority
`docs/plans/2026-10-02-2e228a2b-poc-001-formation-algebra.md` (P02) and the brief `docs/prototypes/poc-001-linked-formation.md` (Formation rules, Initial tests).

## Acceptance conditions (judge each, numbered)
1–6. The plan's acceptance criteria 1–6 exactly (board 37/ring 18/radius; twelve labelled states match mapping & roster order; inverse rotations/shape changes and six rotations restore byte-equivalent serialized positions across every state; Compact links all Close, Spread all Stretched at threshold 2 incl. wraparound; Spread o0 vs o2 distinct labelled assignments with equal cell sets; invalid inputs -> documented errors, deeply frozen inputs unchanged).
7. Exact ring table R and mapping (Compact 3o+[0,1,2], Spread 3o+[0,6,12] mod 18, roster [ugallu, girtablilu, pazuzu]); clockwise transform convention `(-r,q+r)` consistent with R; Compact distances 1,2,1 and Spread 6,6,6 in stable roster-pair order.
8. Tests are black-box contract tests per ADR-0006, exhaustive as claimed, and would fail on plausible defects (e.g. wrong ring order, deduplication, mutation, silent repair).
9. Scope: pure algebra only — no P03 command accounting, combat, UI, physics, movement, or extra engine; P01 behavior preserved; experimental defaults explicitly documented with sources; docs (plan status, index, CURRENT, TASK_LOGS, prototype README/brief) factual and not claiming review/delivery.
10. Reported evidence (ring table, assertion counts, serialized orientation-zero examples) matches actual implementation output.

## Verification (run yourself, from repo root, at the reviewed revision)
- `just poc-001-test tests/formation.test.ts`
- `just poc-001-typecheck`
- `just poc-001-test` (full) and `just poc-001-build`
Record exact commands, exit codes, counts. Note: these commands use Docker; if Docker access is unavailable in your sandbox, report that precisely rather than claiming results. Do not launch other agents.

## Handoff
Write your report (you own it) to `docs/mailbox/p02-formation-algebra/reviewer.md` in the main checkout working tree, uncommitted (a later worker commits it). Include ruach-handoff fields, `reviewed_revision` and `tested_revision` (existing SHAs), commands/results, per-criterion verdicts, findings ordered by severity with location/problem/why/evidence/direction, marked blocking vs optional, or an explicit statement of no material findings. End your turn with a concise handoff summary.
