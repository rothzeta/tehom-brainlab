# Assignment P07-fix — review findings R1 and R2 (Implementer)

Role: `implementer`. You implemented P07. Continue in `/opt/dev/tehom-brainlab-p07` on `p07-brood-abilities`, where HEAD `20eb00c` includes the review.

Read `docs/mailbox/p07-brood-abilities/reviewer.md`.

- **R1 (blocking):** the Shelter tests at `tests/abilities.test.ts:160-176` settle hits through default `DamageRules`. Their exact HP expectations (7 and 9) therefore freeze P06's provisional two-point mitigation. Make the exact-arithmetic assertions use explicit, test-owned impact tuning, for example `applyAttack(..., rules.damageRules)` with an explicit two-point input. Keep dispatcher coverage through eligibility, accounting and outcome invariants that tolerate future default tuning. Do not weaken detection of missing mitigation or of incorrect eligibility or consumption. Do not change production code unless the test fix truly requires it. If it does, report why.
- **R2 (optional, requested by the plan):** add six actual serialized input/result traces, one per ability, from executed fixtures at the fixed revision. Put them in a bounded durable artifact `docs/mailbox/p07-brood-abilities/traces.md` (or `.json`). Record the tested revision and the rules version. Never write traces by hand or invent them.

## Verification

On the committed fix:

- the focused P07 tests;
- full `just poc-001-test`, `just poc-001-typecheck` and `just poc-001-build`;
- `git diff --check`;
- confirmation that tests other than `abilities.test.ts` are unedited.

For R1, also show that the fixed tests no longer depend on the default. Rerun the Reviewer's default-override probe idea in a temporary Docker probe. The fixed exact assertions must pass with the default changed, while the invariant tests still catch missing mitigation.

## Output

Write `docs/mailbox/p07-brood-abilities/fix.md`, starting with the ruach-handoff YAML block (fixed_revision, tested_revision, findings addressed, verification, blockers). Commit it, the traces and this assignment unchanged. Do not edit the Reviewer's report or your earlier reports. Run the handoff validator until it reports `ok: true`. Do not merge, push or rebase, and do not edit protected documents.

Finish with a terminal handoff: report path, report-creating SHA, fixed technical revision, check results and blockers.
