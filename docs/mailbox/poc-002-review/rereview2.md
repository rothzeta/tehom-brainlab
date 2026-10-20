task: P2-REREVIEW2
role: reviewer
status: complete
outcome: "PASS: R1 resolved; 0 blocking findings and 0 optional findings"
source_baseline: 0d260ce
reviewed_revision: 5f4988f
evidence_revision: ee882a5
tested_revision: 3e33c27e34f690f27ddc2e22585fe92a7dde5666
artifacts:
  - docs/mailbox/poc-002-review/rereview2.md
  - docs/mailbox/poc-002-review/assignment-rereview2.md
verification:
  - "Required bare install/typecheck/test/build/browser/seed replay/sweep/probe pass: 381 tests, 940 browser assertions"
  - "All five hostile fixtures under fix1*, fix2 reject with specific reasons; dev HTTP smoke and cleanup pass"
  - "Independent adversarial checks: 14 recordable transitions, 125 observed floor/minimum operands in range, five snapshot invariants and 12 B7 cases"
  - "Previous independent checks pass: 17 checks, 51 accepted recordable commands and 75 atomic limit rejections"
  - "Parity/content/preserved-test diffs empty; sweep/probe stdout byte-identical to previous review; 19 UI exports carry the tested revision"
review:
  - "Independent second rereview complete; all four assignment conditions pass"
discoveries: []
blockers: []

# Independent second rereview — P2-REREVIEW2

Reviewer: Codex, 2026-10-20 UTC. **PASS; 0 blocking findings, 0 optional findings. No material findings remain in the assigned scope.** R1 is resolved by the revised rules and their implementation. The prior F1–F3/O1 fixes remain effective.

Scope: `0d260ce..ee882a5`. Reviewed implementation is `5f4988f078cd9a118c5a736ce4acab6fcf1bdd5c`; evidence head is `ee882a5cd5b2b047f61154d410081941a93585f6`. Executed the [assignment](assignment-rereview2.md)'s authorized **one-time** `git merge --no-ff poc-002-component-combat` into `p2-review`, without conflicts. The resulting tested merge is `3e33c27e34f690f27ddc2e22585fe92a7dde5666`. No production code was changed by the Reviewer.

`git diff --stat 5f4988f ee882a5` shows only 126 added lines in the FIX2 integration report. The tested merge's application, brief, plan and prototype documentation match the reviewed implementation; additional history contains evidence and prior review reports. Consumed the [FIX2 assignment](../poc-002-fix2/assignment-implementer.md), [fix handoff](../poc-002-fix2/implementer.md), [integration evidence](../poc-002-integration/merge-fix2.md), and [Architect Amendment 3b](../poc-002-component-combat/architect.md#amendment-3b-2026-10-20-overflow-free-intermediates). Applied ruach-testing and ruach-handoff; no workflows or workers launched.

## Acceptance conditions

| Condition | Verdict | Evidence |
| --- | --- | --- |
| 1. R1 resolved | **PASS** | `hitPart` now floors after armor and after Ward. This shared path handles actions, Envenom's physical hit and retaliation. Independent real-command probes with simultaneous armor L and Ward L produce zero damage, record/replay, and expose no floor operand outside [−L,L]. New E54 tests also observe actual intermediate floor operands. |
| 2. A3 internally consistent | **PASS** | Revised guarantee accounts for reductions, positive sums/products, snapshot bounds and guarded counters. Independent adversarial checks cover more than mitigation, as detailed below. B7 rejects invalid caps/gaps and accepts inclusive boundaries. All five A3-3 invariants reject violations through parse and replay. All 24 parity records replay unchanged; content and parity diffs are empty. Fresh sweep/probe stdout is byte-identical to the previous review and matches FIX2 integration hashes. |
| 3. No regressions; scope respected | **PASS** | Direct FIX2 implementation changes exactly four authorized paths: content validator, engine, new FIX2 tests and new FIX2 hostile fixture. Existing tests, browser harnesses, audio, record parser, public types, content and parity files are unchanged. Earlier target/poison/multiplier protections still reject, frozen-target snapshots remain valid, documentation stays accurate, and actual UI exports embed the known revision. Known/missing metadata tests for both routes remain green. |
| 4. Fresh bare verification | **PASS** | All eight required commands pass. Dev answers HTTP 200 at default port and is stopped. Every JSON fixture under `hostile/fix1`, `fix1-arithmetic` and `fix2` exits 1 with a specific validation reason. No caller mode, tuning, port or Chrome overrides. |

## Independent arithmetic and invariant review

Let L = 2147483647. The new scratch script `/tmp/p2-rereview2-adversarial.ts` uses public content/state/command/record boundaries, explicit adversarial content variants and BigInt for selected independent expected values. It restores temporary Math observers in `finally`. These observers only capture arguments entering actual `Math.max`/`Math.min` calls; they do not replace the rule results or assert an incidental call count. The explicit intermediate-range contract cannot be established from final damage events alone.

| Probe | Inputs and observed contract |
| --- | --- |
| E54, three hit routes | Guard weapon-arm armor L and Scribe Ward L; Claw, Envenom and Hold retaliation each apply zero damage and record/replay. Envenom still applies poison to a living part despite zero hit damage. |
| B1, maximum raw | Claw base/component amount L−3 plus an active attack bonus of 3 emits raw L, with bounded actual pool removal and successful record/replay. |
| B2, poison | Pmax L−1, poison gain 1 and multiplier 1 reach the exact sum bound L. Both Venom and poison ticks emit raw L−1, end combat correctly and record/replay. |
| B3, mixed extrema | Intent raw 1, incoming bonus L−1, Brood HP L. Weakened reduction L produces zero; Guard produces ceil(L/2) = 1073741824; Hold reduction L produces zero. Each accepted transition records/replays. |
| B4, crossing | Revelation cap L−4 with the largest gain 4; an own-cost crossing from cap−1 caps Revelation correctly, starts Rapture and records/replays. |
| B5, ledger | Guard content pools sum to L; previous ledger L−37 equals already lost pools. A subsequent real hit adds only actual damage, preserves the combined lost-pool bound and records/replays. |
| HP/healing and half | HP max L, current HP 1 and Salve amount L heal exactly to L. Wounded HP is ceil(L/2); the constructed state records/replays. |
| Expiry grouping | Duration 1 at round L starts a transformation with expiry L and records/replays. Source uses `round + (duration − 1)` for both form and restraint expiry. |
| Pmax above base cap | Envenom cap 4 and poison-set 9 accept a snapshot at poison 9. Poison 10 rejects. |
| Five A3-3 bounds | Independently exceed HP/max, Revelation/cap, pool/content pool, poison/Pmax, and combined current+previous ledger/lost pool. Both `parseRecord` and `replayRecord` reject each with the relevant reason. |
| B7 | Twelve combinations of caps 0/1/7 and gaps 0/1/7/8 reject or accept as specified. Accepted primed states have Revelation cap−gap and record/replay. |

Final script output: **14 accepted recordable transitions, 125 observed range-checked operands, five rejected snapshot-invariant violations, twelve B7 cases**. It was broadened once to add the exact B1 and expiry-boundary probes; the initial run's twelve transitions also passed.

Reran `/tmp/p2-rereview-independent.ts` from the previous rereview: **17 checks, 51 accepted recordable commands, 75 atomic limit rejections**, exit 0. That independently retains B1–B6 rejection samples, the original F1 target categories/poison and F2 multiplier rejection, a valid frozen-target non-factory snapshot, last-precedence rejection, preview/commit equality, forecasts, exact-limit and terminal-result behavior. Existing FIX1 tests additionally retain `continue` and all earlier rejection-code precedence coverage.

The source audit supports the revised guarantee: stepwise physical reductions each subtract operands in [0,L]; magical/poison paths do not accumulate reductions. B1–B4 cover positive damage/poison/Revelation arithmetic. In enemy damage, raw−Weakened is at least −L, adding the nonnegative incoming bonus stays below the B3 total, and Guard/Hold derive from the floored nonnegative amount. B5 plus validated lost-pool accounting bounds ledger accumulation. Healing first computes the missing-HP bound, halving avoids adding to L, and expiry grouping subtracts one before adding the round. A3-2 retains actual-result rejection for counter/expiry overflow. No further material gap was found in the audited §4–§9 formulas.

Pmax and the five snapshot bounds were already correctly implemented before FIX2. The Architect's possible poison mismatch is absent in this baseline; FIX2 appropriately confirms the behavior with new tests rather than editing the parser unnecessarily. The former R1 script recomputes the old combined expression outside the engine, so that external calculation is not used as evidence about FIX2's actual intermediate arithmetic.

## Scope, preservation and output parity

Inspected `git diff --name-only 55c97fc 98763e1`: only `src/core/content.ts`, `src/core/engine.ts`, `tests/fix2-arithmetic.test.ts`, and `fixtures/hostile/fix2/ledger-over-lost-pool.json`, all under the prototype and within FIX2 authorization. Later mailbox assignment/report changes are required handoff artifacts. Brief/plan/Architect changes are the authorized amendment; prototype README changes belong to the integration owner.

These checks exited 0 with empty output:

```sh
git diff --stat 55c97fc 98763e1 -- poc-002-component-combat/fixtures/parity poc-002-component-combat/content
git diff --stat 0d260ce ee882a5 -- poc-001-linked-formation shared assets docs/CURRENT.md docs/TASK_LOGS.md poc-002-component-combat/fixtures/parity poc-002-component-combat/content poc-002-component-combat/tests/q*.test.ts poc-002-component-combat/tests/fix1*.test.ts poc-002-component-combat/tests/browser*.mjs
git diff --stat 0d260ce ee882a5 -- poc-002-component-combat/src/core/types.ts poc-002-component-combat/src/core/record.ts poc-002-component-combat/src/audio
git diff --stat 5f4988f HEAD -- poc-002-component-combat docs/prototypes docs/plans docs/README.md
```

Thirty FIX2 tests add to the preserved 351; the executed suite passes all 381. No test weakening, new dependency or unrelated runtime change found. The actual formula remains mathematically equivalent for nonnegative inputs, and all recorded v1 outputs are unchanged.

Fresh stdout compares byte-for-byte with the prior rereview. Hashes also match the FIX2 handoff and integration evidence:

- Sweep: `946226814689bcef5bbe01b5dfb582d9d8ec3d5951e78360d0c400772dc630d4`.
- Probe: `0937b1f2b99ee92d00d5adf23457305dbc3479d4d4e2d581d4f7d52b87fbaa11`.

## Exact commands and results

Application commands ran from `/opt/dev/tehom-brainlab-p2-review`, bare apart from output redirection. Docker/Chrome access used sandbox escalation; no automatic approval rejection occurred.

| Command | Result |
| --- | --- |
| `just poc-002-install` | 0; pinned Bun 1.4.2, 43 installs checked. |
| `just poc-002-typecheck` | 0; `tsc --noEmit`. |
| `just poc-002-test > /tmp/p2-rereview2-test.txt 2>&1` | 0; **381 tests / 18 files**, all 24 parity records included. |
| `just poc-002-build` | 0; four assets, 21 modules; existing informational >500 kB chunk warning. |
| `just poc-002-test-browser > /tmp/p2-rereview2-browser.txt 2>&1` | 0; **940 assertions / four harnesses**: battle 302, keyboard gauntlet 321, run/export 311, smoke 6. |
| `just poc-002-replay poc-002-component-combat/fixtures/parity/seed-ugallu-warden.json` | 0; `commands=35 events=146 outcome=victory`. |
| `just poc-002-sweep --quick > /tmp/p2-rereview2-sweep.txt` | 0; 154 cells / 115 wins / 3,648 openings. |
| `just poc-002-probe > /tmp/p2-rereview2-probe.txt` | 0; 14 cells / 9 wins / 3,648 openings. |
| `just poc-002-replay poc-002-component-combat/fixtures/hostile/fix1/area-strike.json` | Expected 1; `initialState: intent target shape contradicts embedded targeting rule`. |
| `just poc-002-replay poc-002-component-combat/fixtures/hostile/fix1/enemy-strike.json` | Expected 1; same target-shape reason. |
| `just poc-002-replay poc-002-component-combat/fixtures/hostile/fix1/over-cap-poison.json` | Expected 1; `initialState: poison exceeds content cap`. |
| `just poc-002-replay poc-002-component-combat/fixtures/hostile/fix1-arithmetic/multiplier-overflow.json` | Expected 1; `B2 poison product: derived arithmetic exceeds portable integer limit 2147483647`. |
| `just poc-002-replay poc-002-component-combat/fixtures/hostile/fix2/ledger-over-lost-pool.json` | Expected 1; `initialState: ledger exceeds removed pools`. |
| `just poc-002-dev` | HTTP smoke passed on default 5273; deliberate stop subsequently exits 143. |
| `curl --fail --silent --show-error --include http://localhost:5273/` | 0; HTTP 200 and expected title. |
| `docker ps --filter publish=5273 --format '{{.ID}} {{.Names}} {{.Ports}}'` | 0; identified owned dev container `f61ee8de69b1`. |
| `docker stop -t 5 f61ee8de69b1` | 0; stopped only that dev container. |
| `docker ps --filter publish=5273 --filter publish=4273 --format '{{.ID}} {{.Names}} {{.Ports}}'` | 0; no containers remain on either test port. |
| `bun /tmp/p2-rereview2-adversarial.ts` | 0; final counts above. |
| `bun /tmp/p2-rereview-independent.ts` | 0; earlier independent probes still pass. |
| `cmp /tmp/p2-rereview-probe.txt /tmp/p2-rereview2-probe.txt` | 0; identical. |
| `cmp /tmp/p2-rereview-sweep.txt /tmp/p2-rereview2-sweep.txt` | 0; identical. |
| `sha256sum /tmp/p2-rereview2-sweep.txt /tmp/p2-rereview2-probe.txt` | 0; hashes above. |
| `git diff --stat 5f4988f ee882a5` | 0; only integration evidence report, 126 added lines. |
| `git diff --check` | 0. |
| `sha256sum docs/mailbox/poc-002-review/assignment-rereview2.md` | 0; unchanged `35f6726d39639e2a68555c1b25aed9ffd31c09e3ce5180d033c186f38a037abc`. |
| `bun install --frozen-lockfile --cwd /tmp/p2-review-ruach-handoff` | 0; isolated temporary validator dependencies checked. |

A scratch Python JSON walk checked all **19 actual UI combat-record artifacts** at `/tmp/poc-002-browser-3YvZin/`: every `buildRevision` equals tested merge `3e33c27e34f690f27ddc2e22585fe92a7dde5666`, exit 0. The unchanged app/export tests cover `unknown` fallback on both routes. The docs entry point still accurately describes implementation and pending human playtesting. Browser gauntlet download replays with 46 commands / 231 events / victory; 43 actual cue-request batches cover all six kinds. The runner stopped its owned preview container. Diagnostic sweep/probe flags remain evidence, not balance failures.

## Limits and delivery

No exhaustive proof over every content/state combination, C#/Godot execution, human playtest, physical listening or full-width sweep was performed. Intermediate observations sample actual arithmetic floors; the source/formula audit supplies the remaining range reasoning. All assigned checks were executed successfully within those limits.

Reused the isolated copied handoff skill at `/tmp/p2-review-ruach-handoff`. The final report validation and staged-scope checks are recorded below before commit. Only this report and the unchanged assignment are included in the report commit; the separate integration merge was explicitly authorized. No push.

Final handoff check: `bun /tmp/p2-review-ruach-handoff/scripts/validate.ts docs/mailbox/poc-002-review/rereview2.md --repo .` exited 0 with `ok: true`, no diagnostics, and all four revision fields resolved.
Final staged checks: `git diff --cached --check` exited 0; `git diff --cached --name-only` listed exactly this report and `docs/mailbox/poc-002-review/assignment-rereview2.md`. The assignment checksum matches the pre-merge value.
