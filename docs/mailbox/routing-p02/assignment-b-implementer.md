# Assignment B-impl — P02 formation algebra (role: implementer)

You are the Implementer (canonical role `.agents/agents/implementer.md`, already injected), launched on route `gpt-6.1-sol-high`. Coordinator: Claude. Do not load or follow any workflow skill; follow this assignment. Use `.agents/skills/ruach-handoff/SKILL.md` for your result; `.agents/skills/ruach-testing/SKILL.md` and ADR-0006 for tests. You own implementation, tests, and combined verification for this slice.

## Workspace and delivery
- Repo `/opt/dev/tehom-brainlab`, main checkout, local `master` at `e3f60372a5fef279f92ed14caead48271247405f` (routing delivery + evidence; BASE). Create local branch `p02-formation-algebra` from it and commit there. Do NOT merge to master — independent review comes first and you will later receive a merge assignment. No push/publication/deployment. Preserve unrelated work (including the `versioned-agent-skills-20261004` worktree), routing setup and prior P01 evidence/behavior.
- Temporary files: `.agents/scratch/p02/` (ignored).
- Durable report (you own it): `docs/mailbox/p02-formation-algebra/implementer.md`, plus optional `docs/mailbox/p02-formation-algebra/verification.md`, committed on the branch.

## Authority and scope
Implement authoritative plan `docs/plans/2026-10-02-2e228a2b-poc-001-formation-algebra.md` (P02) exactly; read it and the brief `docs/prototypes/poc-001-linked-formation.md` (Formation rules, Initial tests). The design is adequate — do not redesign. First verify the delivered P01 prerequisite (unit-test harness, `just poc-001-test`, `just poc-001-typecheck`) exists and works at BASE; if not, stop and report `blocked`.
Scope: pure formation algebra and contract tests in `poc-001-linked-formation/` — proposed `src/core/hex.ts`, `src/core/formation.ts`, `tests/formation.test.ts` (adjust only if P01 layout requires; justify). 37 integer axial cells; 18-cell radius-three ring with the plan's exact clockwise table R; roster `[ugallu, girtablilu, pazuzu]`; twelve labelled Compact/Spread states with the exact mapping (Compact 3o+[0,1,2], Spread 3o+[0,6,12] mod 18); reversible rotation and shape changes; links with endpoints, integer distance, close (<=2)/stretched in stable roster-pair order; public validation (invalid shapes, fractional coords, out-of-range orientations rejected with documented errors, no silent repair); immutability (deeply frozen inputs unchanged). Publish typed exports and the coordinate convention (P02.C4). Never deduplicate Spread states sharing an occupied-cell set.
Non-goals: no P03 command/action-cost accounting, combat, damage, UI/rendering, physics, movement or additional engine. Preserve P01 behavior.
Resolve experimental defaults explicitly (e.g. close threshold 2, default initial state if any, error type/shape, orientation domain 0..5 integers) using the plan and brief; document each with its source and label it experimental/provisional where the plan says so.

## Required checks (run on your final combined candidate revision, from repo root)
- `just poc-001-test tests/formation.test.ts`
- `just poc-001-typecheck`
- Full regression: full `just poc-001-test` and the P01 build command (`just poc-001-build` or the existing equivalent — check the justfile), plus `git diff --check`.
Record exact commands, exit codes, test counts, and the tested SHA. A deliberate-failure sanity check of a key assertion (then restored) is welcome but optional.

## Required evidence in the report
- Numbered acceptance evidence for plan criteria 1–6 (test names / assertion locations and results).
- The ring table R as implemented (index -> (q,r)) and how tests assert it.
- Exhaustive assertion coverage: what is enumerated (12 states x operations, wraparound) and the actual assertion/test counts reported by the runner.
- Serialized orientation-zero examples for Compact and Spread (actual output from the implementation, e.g. JSON of labelled positions and links).
- Explicit defaults and their sources; limitations.
- Update the P02 plan status line, the plans index `docs/plans/README.md`, `docs/CURRENT.md`, `docs/TASK_LOGS.md`, and relevant prototype documentation with actual facts only (implemented + verified at SHA; review/delivery pending — do not claim them).
- ruach-handoff fields with `candidate_revision` and `tested_revision` as existing SHAs (never your report's own future commit).

End your turn with a concise ruach-handoff summary including report path and SHAs.
