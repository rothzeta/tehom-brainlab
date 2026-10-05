# Assignment RF-impl — ring formation, enemies on tiles, playtest bugs (Implementer)

Role: `implementer` (follow `.agents/agents/implementer.md`).
Coordinator: Claude Coordinator session in the main checkout.

## Task and scope

Implement task RF, [ring formation and enemies on tiles](../../plans/2026-10-05-c6399cb6-poc-001-ring-formation.md): every checkpoint RF.C1–RF.C6 and every acceptance criterion.

The design was accepted by the user on 2026-10-05:

- **Compact:** `S[o], S[o+2], S[o+4]`, a ring-1 triangle around a centre that is always empty, with links `[2,2,2]` Close.
- **Spread:** the ring-2 corners `T[2o], T[2o+4], T[2o+8]`, with links `[4,4,4]` Stretched.
- **Expand/Contract:** one radial step per Brood.
- **Enemies:** stand on real tiles in one alternating layout for all presets. Enemy fronts and protection derive from each enemy's own tile and facing. There is **no generic targeting-reach rule**; reach will be ability-specific and designed later. There is **no numeric tuning**.
- **Bugs:** fix B1, B2 and B3 from the playtests in RF.C5. B2's cause must be reproduced with a failing regression before it is fixed.

Do not reopen these decisions. If implementation shows a design contract is wrong, stop and report it.

The plan marks two choices as provisional proposals (enemies never on Brood cells, and the shape of the enemy front). Implement them as specified.

- **Workspace:** `/opt/dev/tehom-brainlab-ring`, branch `ring-formation`. Start from the current branch HEAD, which includes the AI playtest evidence and the Architect design commits. Work and commit only here.
- **File ownership:** as listed in the RF plan's "Starting source and ownership", plus the prototype `README.md` public contracts.
- **Test-update exception:** you may change existing tests **only** as enumerated in the RF plan's "Required test updates (explicit exception)" section. Each change must replace an expectation that encodes superseded geometry or rules with an independently written expectation. Never weaken or delete coverage. The suites the plan says must pass unedited must stay unedited.
- **No frozen provisional tuning.** New or changed assertions must not freeze provisional numeric defaults (RF criterion 12). The P07, P09 and P10 reviews each blocked on this, and the Reviewer will probe by changing defaults.

## Context

Read:

- the RF plan;
- the amended brief `docs/prototypes/poc-001-linked-formation.md` (Decision record);
- the RF amendments in the P02, P04–P12 plans;
- the Architect report `docs/mailbox/ring-formation/architect.md`, including its User confirmation section;
- the playtest reports `docs/mailbox/ai-playtest-20261005/scout-{1,2,3}.md` (bug reproductions);
- the prototype `README.md`.

Tooling: Bun, with Docker by default. Request escalation; do not switch to host mode for application checks.

## Acceptance and verification

Meet every RF acceptance criterion and map each one, criterion by criterion, to observable evidence. On your final committed candidate, run:

- `just poc-001-test`, `just poc-001-typecheck` and `just poc-001-build`;
- **`just poc-001-test-browser` exactly as a user would: bare, in a shell where `POC001_CHROME` is unset (show `env | grep POC001` is empty), with no manual prior build;**
- `git diff --check`, and the unedited-suites check against the branch BASE.

Inspect screenshots yourself: Compact, Spread, and enemies on tiles for each preset, plus a preview. Keep a few under `docs/mailbox/ring-formation/`.

For B1–B3, show each failing regression before the fix and passing after it. Also re-run each bug's reproduction steps from the playtest reports.

Record exact commands, exit codes, counts and the tested revision. Do not claim a human playtest.

## Restrictions

- Do not edit `docs/CURRENT.md`, `docs/TASK_LOGS.md`, ADRs, the brief, plans or the index. Propose corrections in your report.
- Do not merge, push or rebase, and do not delete branches or worktrees. Keep disposable files in the OS temp directory.

## Expected output

Commit this assignment unchanged with your report at `docs/mailbox/ring-formation/implementer.md`. Start the report with the `ruach-handoff` YAML block. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/ring-formation/implementer.md --repo /opt/dev/tehom-brainlab-ring` until it reports `ok: true`.

Terminal handoff: report path, report SHA, technical candidate SHA, a pass/fail summary, every changed pre-existing test with its reason, the B1–B3 causes and fixes, and blockers.
