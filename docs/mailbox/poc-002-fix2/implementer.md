task: P2-FIX2
role: implementer
status: complete
outcome: "A3-4 mitigation, B7 and expiry grouping fixed; Pmax and all A3-3 invariants confirmed; required bare verification passes"
source_baseline: 55c97fc
candidate_revision: 98763e12c69cf6fc602362222fa8d1cae5d10813
tested_revision: 98763e12c69cf6fc602362222fa8d1cae5d10813
artifacts:
  - docs/mailbox/poc-002-fix2/assignment-implementer.md
  - docs/mailbox/poc-002-fix2/implementer.md
  - poc-002-component-combat/tests/fix2-arithmetic.test.ts
  - poc-002-component-combat/fixtures/hostile/fix2/ledger-over-lost-pool.json
verification:
  - "Pre-fix suite: expected exit 1, 11 failures / 370 passes; three E54 intermediate failures and eight B7 rejection failures"
  - "At the fix commit: bare install/typecheck/test/build/browser/seed replay/sweep/probe exit 0; 381 tests / 18 files; 940 browser assertions"
  - "New hostile fixture: expected CLI exit 1, initialState ledger exceeds removed pools"
  - "All 24 unchanged parity records replay; shipped content, parity and existing-test diffs empty"
  - "Sweep and probe stdout byte-identical to FIX1 integration; 19 browser exports embed the tested revision"
  - "Temporary-copy handoff validator and Git whitespace checks pass"
review: not-run
discoveries:
  - "Baseline record.ts already computes B2 Pmax from Envenom caps and every poison-set amount; the Architect's noted mismatch is absent at 55c97fc"
  - "All five A3-3 initial-state invariants already exist at the baseline; new coverage passes before and after the fix"
blockers: []

# P2-FIX2 implementer handoff

Author: Codex, Implementer, 2026-10-20 UTC. Branch `p2-fix2`; no merge or push. Consumed the [assignment](assignment-implementer.md), R1 via `git show p2-review:docs/mailbox/poc-002-review/rereview.md`, the brief's dated A3 revision, Architect Amendment 3b, and FIX1 implementation/integration reports. Applied ruach-testing and ruach-handoff; no workflow or workers launched.

## Changes and regression evidence

Added the tests and hostile fixture before editing runtime code. `just poc-002-test > /tmp/p2-fix2-red.txt 2>&1` exited 1: **11 failures / 370 passes**. All 351 existing tests passed. Of 30 new tests, 11 exposed defects and 19 confirmed existing behavior. No existing tests or expected outputs were edited.

1. **A3-4 / E54:** Three command-boundary regressions exercise Claw, Envenom's physical hit, and Hold retaliation against a Guard weapon arm with armor L and a Scribe Ward of L, where L = 2147483647. Each asserts zero applied damage, unchanged target pool, and successful record/replay. A temporary `Math.max` spy observes the actual operands entering the engine's floors, checking every observed integer lies in [−L, L]; it restores the original function in `finally` and leaves arithmetic unchanged. This explicit intermediate contract is invisible in final TypeScript damage events. All three failed before the fix on values below −L while their damage and record assertions passed. The final Claw case uses raw 6, matching R1's numeric counterexample. `hitPart` now evaluates `max(0, max(0, raw − armor) − Ward)` for all existing hit routes. Both subtractions have operands in [0, L], so each intermediate lies in [−L, L], including simultaneous maximum reductions. Final suite: all three pass.

2. **B7:** Eight pre-fix failures cover each Brood's zero cap, gap 0, a gap above the smallest cap, and invalid gaps on every supported start ID when its kind is `below-cap`. `arithmeticBounds` now rejects zero caps and every `below-cap` gap outside [1, smallest cap], naming B7 in its errors. Negative cap inputs retain structural rejection. Positive tests cover gaps at both inclusive boundaries, cap 1 / gap 1, recordable primed states, unconstrained gaps on other preset kinds, and unchanged v1 loading. All pass after the fix.

3. **Pmax:** Inspection of baseline `src/core/record.ts:98` and the executed pre-fix tests show the requested behavior already exists: the local variable named `poisonCap` is the maximum of all Envenom caps and all poison-set amounts. With test-owned Envenom cap 4 and poison-set 9, snapshots at poison 4, 5 and 9 record/replay, and subsequent Rupture Venom commands remain recordable. Another test starts from a factory state, reaches transformation through actual commands, sets poison to 9, and replays the full run. Poison 10 rejects. These tests were green before and after; no runtime change to `record.ts` was needed.

4. **Expiry and A3-3:** Both transformation and restraint expiry expressions now group as `round + (duration − 1)`. New public tests accept duration 1 at round L for transformation, Pinned and Clamped, assert emitted expiry L, and record/replay; the status cases end the fight before next-round declaration. These observable TypeScript results already passed before the source grouping correction. Existing FIX1 expiry/atomic-limit tests remain unchanged and pass. Audited all five initial-state invariants: HP ≤ max HP, Revelation ≤ cap, pool ≤ content pool, poison ≤ Pmax, and each Guard's combined ledger ≤ lost pool. All were already enforced. New test-owned violations reject through parsing and replay; exact boundaries accept, including Revelation at cap with a valid transformation. The new hostile fixture allocates six damage points across all three actors and both ledger rounds after only five pool points were lost. Each individual entry and each separate round fits; the combined ledger correctly rejects before and after the fix.

## Changed paths

Fix commit `98763e12c69cf6fc602362222fa8d1cae5d10813` contains only:

- `poc-002-component-combat/src/core/content.ts`: five lines implementing B7.
- `poc-002-component-combat/src/core/engine.ts`: stepwise mitigation and the two grouped expiry expressions.
- `poc-002-component-combat/tests/fix2-arithmetic.test.ts`: 30 new tests.
- `poc-002-component-combat/fixtures/hostile/fix2/ledger-over-lost-pool.json`: complete hostile record with test-owned numbers.

The separate evidence commit contains this report and the unchanged assignment only. Assignment SHA-256: `eb06c29178513581d0fb8c95b76679ec370d6928e3a4ffecc4248dd930a4d3cc`.

## Required verification at the fix commit

All recipes below ran bare from `/opt/dev/tehom-brainlab-p2-fix2`, with no mode, tuning or Chrome overrides. Redirection only captures disposable logs under `/tmp`.

| Exact command | Result |
| --- | --- |
| `just poc-002-install` | Exit 0; Bun 1.4.2, 43 installs across 86 packages checked, no changes. |
| `just poc-002-typecheck` | Exit 0; `tsc --noEmit`. |
| `just poc-002-test > /tmp/p2-fix2-test.txt 2>&1` | Exit 0; **381 tests / 18 files**. Includes ordered events, revisions and final state for every one of the 24 parity JSON records. |
| `just poc-002-build > /tmp/p2-fix2-build.txt 2>&1` | Exit 0; four assets, 21 modules; existing informational >500 kB chunk warning. |
| `just poc-002-test-browser > /tmp/p2-fix2-browser.txt 2>&1` | Exit 0; **940 assertions**: battle 302, keyboard gauntlet 321, run/export 311, smoke 6. Runner stopped its own preview container. |
| `just poc-002-replay poc-002-component-combat/fixtures/parity/seed-ugallu-warden.json` | Exit 0; `commands=35 events=146 outcome=victory`. |
| `just poc-002-replay poc-002-component-combat/fixtures/hostile/fix2/ledger-over-lost-pool.json` | Expected exit 1; `replay: Invalid record at initialState: ledger exceeds removed pools`. This is the only new hostile fixture. |
| `just poc-002-sweep --quick > /tmp/p2-fix2-sweep.txt 2> /tmp/p2-fix2-sweep.stderr` | Exit 0; stdout unchanged from FIX1 integration. Stderr empty. |
| `just poc-002-probe > /tmp/p2-fix2-probe.txt 2> /tmp/p2-fix2-probe.stderr` | Exit 0; stdout unchanged from FIX1 integration. Stderr empty. |

The preserved [FIX1 integration report](../poc-002-integration/merge-fix1.md) identifies the prior output files. Both comparisons exited 0, proving byte-for-byte stdout equality:

```sh
cmp /tmp/p2-int-fix1-verification.YP9091/sweep.txt /tmp/p2-fix2-sweep.txt
cmp /tmp/p2-int-fix1-verification.YP9091/probe.txt /tmp/p2-fix2-probe.txt
sha256sum /tmp/p2-int-fix1-verification.YP9091/sweep.txt /tmp/p2-fix2-sweep.txt
sha256sum /tmp/p2-int-fix1-verification.YP9091/probe.txt /tmp/p2-fix2-probe.txt
```

Both sweep files hash to `946226814689bcef5bbe01b5dfb582d9d8ec3d5951e78360d0c400772dc630d4`; both probe files hash to `0937b1f2b99ee92d00d5adf23457305dbc3479d4d4e2d581d4f7d52b87fbaa11`. Thus the previous 154-cell/115-win quick sweep and 14-cell/9-win probe, including their diagnostic flags and 3,648 openings each, are unchanged.

Additional checks, all exit 0:

```sh
git diff --stat 55c97fc..HEAD -- poc-002-component-combat/fixtures/parity poc-002-component-combat/content
git diff --stat 55c97fc..HEAD -- docs/CURRENT.md docs/TASK_LOGS.md poc-002-component-combat/tests/q*
git diff --check 55c97fc..HEAD
docker ps --filter publish=4273 --format '{{.ID}} {{.Names}} {{.Ports}}'
sha256sum docs/mailbox/poc-002-fix2/assignment-implementer.md
```

Both scope diffs and the container query were empty. Browser artifacts are disposable at `/tmp/poc-002-browser-kVIuPH/`. A Python JSON walk asserted that all 19 exported combat records embed `98763e12c69cf6fc602362222fa8d1cae5d10813`, and exited 0. The unchanged keyboard gauntlet harness downloaded and replayed its 46-command / 231-event victory record.

## Setup corrections and handoff validation

The first sandboxed bare install exited 1 because Docker was inaccessible. Subsequent Docker recipes used sandbox escalation and passed; no automatic approval rejection occurred. The first typecheck found a test passing a JSON string to the typed `replayRecord` boundary; the test now supplies the parsed object. The corrected pre-commit typecheck and final committed typecheck both exit 0. A pre-commit green run (`just poc-002-test > /tmp/p2-fix2-green.txt 2>&1`) also passed all 381 tests. The first Git staging attempt failed on read-only worktree metadata outside this checkout; escalated explicit-path staging and commit succeeded on `p2-fix2`.

Copied the generated handoff skill without modifying it, installed its dependencies only in the temporary copy, and validated this report:

```sh
cp -a .agents/skills/ruach-handoff /tmp/p2-fix2-ruach-handoff
bun install --frozen-lockfile --cwd /tmp/p2-fix2-ruach-handoff
bun /tmp/p2-fix2-ruach-handoff/scripts/validate.ts docs/mailbox/poc-002-fix2/implementer.md --repo .
```

Install and validation exit 0; validator reports `ok: true`, no diagnostics, and resolves all three revision fields. No independent review, human playtesting, C#/Godot execution or full-width sweep was performed. All assigned verification ran; no remaining blocker.
