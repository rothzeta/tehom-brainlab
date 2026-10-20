# Assignment: POC 002 review fixes F1–F3 and O1 (task P2-FIX1)

Issued by: Coordinator, 2026-10-19. Role: **implementer**. Task ID: `P2-FIX1`.

## Workspace

- Worktree `/opt/dev/tehom-brainlab-p2-fix1`, branch `p2-fix1`, BASE `28d68ad`. That is the integration branch evidence head; the reviewed implementation is `1b57b0f`.
- Commit on `p2-fix1` only. Do not merge or push.
- Disposable files go under the OS temporary directory.
- Do not load any `ruach-workflow-*` skill.

## Input

The independent review is in `docs/mailbox/poc-002-review/reviewer.md` on branch `p2-review`. Read it with `git show p2-review:docs/mailbox/poc-002-review/reviewer.md`. It gives each finding's location, an executed reproduction and a suggested direction. Rules come from the brief `docs/prototypes/poc-002-component-combat.md` (§12 records, §13, E45, Amendment A2). The plan is `docs/plans/2026-10-19-db0bad72-poc-002-component-combat.md`.

## Scope: fix exactly these findings, regression first

For F1 and F2, first add a deterministic failing regression through the public API or CLI. It must reproduce the reviewer's case. Then make the fix and show that the regression passes.

1. **F1 (blocking).** Record and initial-state validation must:
   - reject a declared intent whose target shape contradicts the embedded intent's targeting rule (single-target versus all-Brood versus enemy target). Do not recompute frozen Brood targets from current HP or ledger;
   - reject enemy poison above the content-derived cap;
   - still accept valid complete non-factory snapshots.

   Add focused hostile fixtures under `fixtures/hostile/` for both cases, and confirm `just poc-002-replay` rejects them with a specific reason. Audit the same parser for any other snapshot field that is only range-checked where the brief implies a tighter content-derived bound. Fix those too, and list them.
2. **F2 (blocking).** `loadContent` must reject content whose derived arithmetic could emit an integer outside the portable record range (§12: below 2³¹). Cover multiplicative and additive damage, bonuses, and duration and counter arithmetic. Do **not** change any damage formula or any v1 number.
   - Add a public-boundary regression: a bounded example in which every accepted command stays recordable.
   - The shipped v1 content must still load, and all parity fixtures must replay byte-for-byte unchanged.
   - If correct bounding needs a rule decision the brief doesn't make, stop (S1) and report the exact question instead of inventing one.
3. **F3 (blocking).** Correct `docs/README.md:24` and any other stale POC 002 status sentence there. Describe POC 002 as implemented on its branch, with human playtesting pending. Do not touch `docs/CURRENT.md` or `docs/TASK_LOGS.md`.
4. **O1 (optional, requested).** Pass the known build revision into both run mounts in `src/view/app.ts`, so that UI exports carry it, falling back to `unknown` when it's unavailable. Keep the human-test protocol's guidance accurate. If it now needs a wording change in `docs/playtests/poc-002-human-test-protocol.md`, make the smallest one.

**Authorized paths:**
- `poc-002-component-combat/src/core/record.ts`
- `poc-002-component-combat/src/core/content.ts`
- other `src/core/**` files only if a fix strictly needs them
- `poc-002-component-combat/src/view/app.ts`
- `poc-002-component-combat/fixtures/hostile/**`
- new `poc-002-component-combat/tests/fix1-*.test.ts`
- `docs/README.md`
- `docs/playtests/poc-002-human-test-protocol.md`, for wording only

Nothing else. In particular: no changes to `fixtures/parity/**`, existing tests, content v1 numbers, the brief, the plan, the ADRs, POC 001, `shared/` or `assets/`. If anything else needs to change, stop and report.

## Verification

Run bare from the repository root, with no `POC002_*` or Chrome overrides:

```sh
just poc-002-install
just poc-002-typecheck
just poc-002-test
just poc-002-build
just poc-002-test-browser
just poc-002-replay poc-002-component-combat/fixtures/parity/seed-ugallu-warden.json
just poc-002-replay <each new hostile fixture>   # expect a non-zero exit with a specific reason
just poc-002-sweep --quick
just poc-002-probe
```

Also rerun the reviewer's reproductions and confirm that they are now rejected. Run `git diff --check`, and confirm that `git diff --stat 28d68ad..HEAD -- poc-002-component-combat/fixtures/parity` is empty.

## Hand-back

- **Report:** `docs/mailbox/poc-002-fix1/implementer.md` with a ruach-handoff block. Use `source_baseline: 28d68ad` and set `candidate_revision` = `tested_revision` = your fix commit.
- **Contents:** for each finding, the regression (shown failing before the fix and passing after), the fix, and the evidence. Also include the exact commands and results, the changed paths, and any further bounds found by the audit.
- **Validation:** validate the report with a copy of the skill in the OS temporary directory.
- **Commit:** commit the fix, then this assignment unchanged with the report.
- **Reply:** both SHAs and a three-line summary.
