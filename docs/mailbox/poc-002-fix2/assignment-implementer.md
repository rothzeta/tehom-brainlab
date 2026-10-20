# Assignment: POC 002 re-review fix R1 per brief A3 revision (task P2-FIX2)

Issued by: Coordinator, 2026-10-20. Role: **implementer**. Task ID: `P2-FIX2`.

## Workspace

- Worktree `/opt/dev/tehom-brainlab-p2-fix2`, branch `p2-fix2`, BASE `55c97fc`. That is the integration branch tip, which contains the merged P2-FIX1 and the brief's A3 revision.
- Commit on `p2-fix2` only. Do not merge or push.
- Disposable files go under the OS temporary directory.
- Do not load any `ruach-workflow-*` skill.

## Input

- **Finding R1:** in the re-review report. Read it with `git show p2-review:docs/mailbox/poc-002-review/rereview.md`.
- **Rules:** the brief `docs/prototypes/poc-002-component-combat.md`, specifically Amendment A3 and its dated "A3 revision": A3-3 revised, A3-4, A3-5, B7, and the new E54.
- **Architect's summary:** `docs/mailbox/poc-002-component-combat/architect.md`, section "Amendment 3b". It includes the noted mismatch between the poison bound and Pmax.
- **Previous fix:** `docs/mailbox/poc-002-fix1/implementer.md`.

## Scope: regression first

For each item, first add a deterministic failing test through the public API or CLI, then fix it.

1. **A3-4 / E54.** Physical mitigation must be evaluated stepwise and floored: `max(0, max(0, raw − armor) − Ward)` for actions, Envenom's hit and retaliation. Add the reviewer's large armor-plus-Ward case as a public-boundary test, asserting zero applied damage and a recordable run. Show that no intermediate falls outside the signed 32-bit range; for example, assert through a test hook or a pure helper with test-owned inputs.
2. **B7.** `loadContent` must reject every Revelation cap below 1, and every `below-cap` gap outside the range 1 to the smallest cap. Add test-owned rejections and confirm v1 still loads.
3. **Pmax.** Snapshot poison validation must use B2's Pmax, the larger of the poison cap and any poison-set amount, in place of the Envenom poison cap. Add a regression in which those two values differ.
4. **Expiry and invariants.** Write expiry arithmetic as `round + (duration − 1)`. Check that every A3-3 initial-state invariant is enforced: HP ≤ max HP; Revelation ≤ cap; pool ≤ content pool; poison ≤ Pmax; and each Guard's current plus previous ledger ≤ its lost pool. Add whichever invariant is missing, with a hostile fixture under `fixtures/hostile/fix2/`.

**Authorized paths:**
- `poc-002-component-combat/src/core/**`
- `poc-002-component-combat/fixtures/hostile/fix2/**`
- new `poc-002-component-combat/tests/fix2-*.test.ts`

Nothing else: no changes to parity fixtures, existing tests, content v1, the brief, the plan or other documents. If the brief is still ambiguous, stop (S1) and report the exact question.

## Verification

Run bare from the repository root, with no overrides:

```sh
just poc-002-install
just poc-002-typecheck
just poc-002-test
just poc-002-build
just poc-002-test-browser
just poc-002-replay poc-002-component-combat/fixtures/parity/seed-ugallu-warden.json
just poc-002-replay <each new fix2 hostile fixture>   # expect a non-zero exit with a specific reason
just poc-002-sweep --quick
just poc-002-probe
```

Also confirm the following:
- every parity record still replays unchanged;
- `git diff --stat 55c97fc..HEAD -- poc-002-component-combat/fixtures/parity poc-002-component-combat/content` is empty;
- the sweep and probe stdout is identical to the previous runs. Use the integration report `docs/mailbox/poc-002-integration/merge-fix1.md` for comparison, or say what changed and why.

## Hand-back

- **Report:** `docs/mailbox/poc-002-fix2/implementer.md` with a ruach-handoff block. Use `source_baseline: 55c97fc` and set `candidate_revision` = `tested_revision` = your fix commit.
- **Contents:** for each item, the regression (failing before, passing after), the fix and the evidence. Also include the exact commands and results, and the changed paths.
- **Validation:** validate the report with a copy of the skill in the OS temporary directory.
- **Commit:** commit the fix, then this assignment unchanged with the report.
- **Reply:** both SHAs.
