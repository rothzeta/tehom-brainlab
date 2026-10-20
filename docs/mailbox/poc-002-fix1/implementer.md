task: P2-FIX1
role: implementer
status: complete
outcome: "F1-F3 and O1 fixed; A3 arithmetic and command limits implemented; full bare verification passes"
source_baseline: 28d68ad
candidate_revision: 123d42721a590f133b280a85b24c2c3a563edf45
tested_revision: 123d42721a590f133b280a85b24c2c3a563edf45
first_fix_revision: 82c50762cc87d6f9994e753e874451ed59c34c7d
initial_report_revision: cbcca91c5b7e8f9d351a2defb3e0189016ac61b7
destination_before: cbcca91c5b7e8f9d351a2defb3e0189016ac61b7
integration_source_revision: 1a0c3d3785de21a6d4795988ec84e9e3cfd6c707
amendment_revision: d887a98
merge_revision: 3a814938f1870dbe5960b72cf1cf7b2565ea40e6
artifacts:
  - docs/mailbox/poc-002-fix1/assignment-implementer.md
  - docs/mailbox/poc-002-fix1/implementer.md
  - poc-002-component-combat/tests/fix1-record.test.ts
  - poc-002-component-combat/tests/fix1-arithmetic.test.ts
  - poc-002-component-combat/tests/fix1-build-revision.test.ts
  - poc-002-component-combat/fixtures/hostile/fix1/
  - poc-002-component-combat/fixtures/hostile/fix1-arithmetic/
verification:
  - "F1 regression before fix: 17 failures / 281 passes; final FIX1 snapshot regressions pass"
  - "F2 A3 regression before fix: 32 failures / 316 passes; final suite: 351 tests / 17 files pass"
  - "Final bare install, typecheck, test, build, browser (940 assertions), seed replay, sweep and probe: exit 0"
  - "All four new hostile fixtures: expected CLI exit 1 with specific target, poison or B2 reasons"
  - "All 24 parity records replay unchanged; parity/content/existing-test/protected-path diffs empty"
  - "Temporary-copy handoff validator and git diff --check: exit 0"
review: not-run
discoveries:
  - "Initial F2 S1 stop resolved by Architect Amendment A3 and the Coordinator's explicit merge/S3 authorization"
  - "New-expiry checks include emitted expiries subsequently cleared by victory or death"
  - "Existing Q02 final-Salve divergence contract preserved; initial Salve allowance is validated"
blockers: []

# P2-FIX1 final implementer handoff

Author: Codex, Implementer, 2026-10-20 UTC. Branch `p2-fix1`; no push. [Assignment](assignment-implementer.md) is unchanged. This report supersedes the initial S1 handoff; its full historical evidence remains at `cbcca91:docs/mailbox/poc-002-fix1/implementer.md`. Applied ruach-testing and ruach-handoff, ADR-0006, the supplied independent review on `p2-review`, and the [brief including A3](../../prototypes/poc-002-component-combat.md). No workflows loaded or agents launched.

## S1 resolution and authorized integration

The initial implementation fixed F1/F3/O1, but stopped F2 because no content-only bound could constrain indefinitely growing round/revision counters or expiries. The initial report preserves the executed v1 counter/expiry reproducers and exact rule question. The Coordinator supplied the Architect's ruling: A3-1 bounds B1–B6 / E52, A3-2 atomic `limit-reached` checked last / E53, and A3-3 no additional snapshot headroom requirement. The Coordinator explicitly authorized one merge and the addition of `limit-reached` to `types.ts` under S3.

Executed **once**: `git merge --no-ff poc-002-component-combat` on `p2-fix1`. Destination before merge: `cbcca91c5b7e8f9d351a2defb3e0189016ac61b7`; source: `1a0c3d3785de21a6d4795988ec84e9e3cfd6c707`, including amendment `d887a98`. Merge result: `3a814938f1870dbe5960b72cf1cf7b2565ea40e6`, clean, no conflicts. It brought only the amended brief, plan and Architect report. The final implementation and tested destination is `123d42721a590f133b280a85b24c2c3a563edf45`. The later report commit records evidence only.

## Findings, regressions and fixes

### F1 — complete

Before production edits, public-API regressions reproduced the area Strike followed by a real `endPhase`, over-cap poison, and contradictory single-Brood / all-Brood / enemy target categories. The bare suite exited 1 with **17 failures / 281 passes**, all failures in the new FIX1 snapshot file. They now pass, along with positive non-factory and frozen-target cases.

`record.ts` matches declared target category to embedded targeting without recalculating frozen recipients from current HP, Revelation or ledger. Poison cannot exceed the maximum embedded Envenom cap or poison-set amount. A test-owned poison-set above the base cap remains valid. Three focused hostile fixtures are rejected by the actual CLI with specific reasons (table below).

The same-parser numerical audit added these bounds, with rejecting and accepting boundary tests:

| Snapshot field | Constraint |
| --- | --- |
| Transformation expiry | Remaining lifetime cannot exceed the embedded form's duration |
| Guard / Hold expiry | Exactly the current round |
| Pinned / Clamped expiry | Remaining lifetime bounded by a matching rider on that source enemy/part |
| Weakened | Embedded Envenom reduction amount; current-round expiry |
| Ledger current + previous | Combined attributed damage cannot exceed the enemy pools actually removed |
| Initial Salve uses | At most the embedded fight/gauntlet allowance |

Existing pool/cap, part-definition, carried-state and Ward checks already derive their relevant bounds from content. No round/revision headroom invariant was added. The existing Q02 test requires a changed final expected Salve count to return a `final-state` divergence: the initial allowance check preserves that contract. No existing test changed. The initial attempt that checked the final allowance too failed that test; moving the check to the initial input corrected it.

Hostile fixtures use subdirectories because the preserved Q03 test explicitly inventories the root JSON files. New FIX1 tests cover the new directories.

### F2 — complete under A3

Regression first: before changing `content.ts` or the engine, `just poc-002-test > /tmp/p2-fix1-a3-red.log 2>&1` exited 1 with **32 failures / 316 passes**. All failures were new A3 regressions; all existing tests passed. They include separate loader and record/replay reproductions of the reviewer's oversized multiplier, per-bound invalid inputs, atomic counter/expiry rejection, preview/forecast, and a bounded near-limit exploration that previously reached an unrecordable accepted result. The final suite passes **351** tests: the preserved 279, 19 F1 tests, four provenance tests, and 49 arithmetic/limit tests. Three exact-expiry boundary cases were added after the initial red run.

`loadContent` now applies the prescribed conservative bounds after structural/reference validation. It names the failed bound. BigInt is used only while validating sums/products, so the validator cannot overflow while diagnosing unsafe input; returned content remains ordinary JSON numbers.

| Bound | Implemented check / test-owned coverage |
| --- | --- |
| B1 | Largest base/component/bolt alternative plus **every** matching attack bonus, across forms. Covers damage, Envenom, bolt override and mutually exclusive bonuses |
| B2 | Largest poison cap/poison-set × largest base/form Venom multiplier; also Pmax + maximum poison gain. Covers both alternatives and both operations |
| B3 | Intent base + all conditional modifiers + every incoming bonus across content |
| B4 | Each Brood cap + maximum action cost or Revelation rider |
| B5 | Sum of each enemy's part pools, bounding ledger accumulation |
| B6 | Every form and Pinned/Clamped rider duration at least 1 |

Each has test-owned rejection cases. Positive tests accept exact B1–B5 upper boundaries, the B6 minimum, and maximum portable durations. Shipped v1 loads unchanged. `multiplier-overflow.json` changes only the embedded multiplier in a copy of the API-generated Girtablilu seed; loading, parsing, replay and the bare CLI reject it with `B2 poison product`. No damage formula, modifier ordering or v1 number changed.

`limit-reached` is appended to `REJECTION_CODES`; this is the **only** `types.ts` change. `applyCommand` first preserves all earlier rejection checks, runs an otherwise legal command on its clone, and checks its actual revision, round and newly emitted expiries before committing. It returns the original input state, no events, and `limit-reached` if any exceed L. JavaScript's number arithmetic exactly represents these sums of two portable integers. New expiries are checked in events, including a form/status created and then removed by a battle-ending unit. This prevents an unrecordable event despite a seemingly valid final state.

Tests cover `act`, `endPhase` and `continue` at the revision limit; next-round overflow; form, Pinned and Clamped expiry overflow; exact-limit expiry acceptance; all ten earlier rejection codes; unchanged input and empty rejected events; preview equality; and a forecast returning the actual rejection. A battle-ending enemy phase, poison tick or action at round L and revision L−1 remains accepted and replayable when no expiry overflows. `continue` can reset round L to 1 and reach revision L. Near-limit initial snapshots remain valid without additional headroom checks.

`legalActions` uses the real transition near a limit to avoid advertising rejected commands; ordinary states use the existing semantic checks after a cheap conservative headroom check. No rules are duplicated in the view. The bounded regression explores all advertised legal commands for four levels near the limits and exports/replays **every accepted path**. Preview/forecast already dispatch through `applyCommand`, so no preview-specific rule code was needed.

### F3 and O1 — complete

`docs/README.md:24` says POC 002 is implemented on its branch, with human playtesting pending, and links its README. No stale POC 002 implementation claim remains there. Neither protected status document changed.

Both run mounts in `app.ts` receive `VITE_POC002_BUILD_REVISION`, falling back to `unknown`. Four tests execute the real app/run/session/JSON export path for selection and direct-URL routes, with known and unavailable metadata. The human-test protocol accurately describes `unknown` as unavailable revision metadata, including dirty builds. Final browser output contains 19 actual UI JSON artifacts, including both routes, and every artifact embeds the full final fix SHA. No human playtesting is claimed.

## Final verification

Required commands ran bare from `/opt/dev/tehom-brainlab-p2-fix1`, without caller `POC002_*` or Chrome overrides, against fix commit `123d427`. Docker/Chrome checks used approved sandbox escalation. No automatic approval rejection occurred. Earlier diagnostic limitations and the initial S1-only verification remain in the historical report at `cbcca91`; they are superseded by the following successful final checks.

| Exact command | Result |
| --- | --- |
| `just poc-002-install` | 0; pinned Bun 1.4.2, 43 installs checked, no changes |
| `just poc-002-typecheck` | 0; `tsc --noEmit` |
| `just poc-002-test > /tmp/p2-fix1-final-test.log 2>&1` | 0; 17 files, **351 tests**, all 24 parity records included |
| `just poc-002-build` | 0; four prepared assets, 21 modules; informational >500 kB bundle warning |
| `just poc-002-test-browser > /tmp/p2-fix1-final-browser.log 2>&1` | 0; **940 assertions**: battle 302, keyboard gauntlet 321, run 311, smoke 6 |
| `just poc-002-replay poc-002-component-combat/fixtures/parity/seed-ugallu-warden.json` | 0; `commands=35 events=146 outcome=victory` |
| `just poc-002-replay poc-002-component-combat/fixtures/hostile/fix1/area-strike.json` | Expected 1; `intent target shape contradicts embedded targeting rule` |
| `just poc-002-replay poc-002-component-combat/fixtures/hostile/fix1/enemy-strike.json` | Expected 1; same target-shape reason |
| `just poc-002-replay poc-002-component-combat/fixtures/hostile/fix1/over-cap-poison.json` | Expected 1; `poison exceeds content cap` |
| `just poc-002-replay poc-002-component-combat/fixtures/hostile/fix1-arithmetic/multiplier-overflow.json` | Expected 1; `Invalid content at B2 poison product: derived arithmetic exceeds portable integer limit 2147483647` |
| `just poc-002-sweep --quick > /tmp/p2-fix1-final-sweep.txt` | 0; 154 cells / 115 wins / 3,648 openings |
| `just poc-002-probe > /tmp/p2-fix1-final-probe.txt` | 0; 14 comparison cells / 9 wins / 3,648 openings |
| `bun /tmp/p2-review-reproduce.ts` | Expected 1; unchanged reviewer script now stops at the forged Strike with the target-shape reason |
| `bun /tmp/p2-review-overflow.ts` | Expected 1; unchanged factory-origin reviewer script now stops in `loadContent` with the B2 reason |
| `bun /tmp/p2-fix1-final-provenance.ts` | 0; all 19 actual UI record artifacts contain `123d42721a590f133b280a85b24c2c3a563edf45` |
| `bun /tmp/p2-fix1-final-summaries.ts` | 0; counted the sweep/probe cells, wins and openings above |
| `git diff --check` | 0 |
| `git diff --stat 28d68ad..HEAD -- poc-002-component-combat/fixtures/parity` | 0, empty; parity files byte-for-byte unchanged |
| `git diff --stat 28d68ad..HEAD -- poc-001-linked-formation shared assets docs/CURRENT.md docs/TASK_LOGS.md poc-002-component-combat/content poc-002-component-combat/tests/q*.test.ts` | 0, empty |
| `bun /tmp/p2-fix1-handoff-skill/scripts/validate.ts docs/mailbox/poc-002-fix1/implementer.md --repo /opt/dev/tehom-brainlab-p2-fix1` | 0; schema valid, every supplied Git revision resolves |

The validation skill was copied from `.agents/skills/ruach-handoff` to `/tmp/p2-fix1-handoff-skill`; `bun install --frozen-lockfile --cwd /tmp/p2-fix1-handoff-skill` previously exited 0 (six packages) and the same isolated copy is reused. No skill source changed. An intermediate A3 typecheck found the test helper's return union too broad for spreading an `act`; narrowing it corrected the error, and final typecheck passes.

Final browser artifacts: `/tmp/poc-002-browser-YhuMLb/` (disposable). The harness stopped its named preview container successfully. Sweep/probe reports are heuristic evidence, not balance assertions or human results.

## Changed paths and delivery

The direct fix commits (`82c5076` and `123d427`) change only:

- Core: `poc-002-component-combat/src/core/{record.ts,content.ts,engine.ts,types.ts}`.
- UI: `poc-002-component-combat/src/view/app.ts`.
- New tests: `poc-002-component-combat/tests/fix1-{record,arithmetic,build-revision}.test.ts`.
- New hostile inputs and READMEs: `poc-002-component-combat/fixtures/hostile/fix1/` and `fix1-arithmetic/`.
- Documentation: `docs/README.md` and wording in `docs/playtests/poc-002-human-test-protocol.md`.

The authorized merge additionally changes `docs/prototypes/poc-002-component-combat.md`, `docs/plans/2026-10-19-db0bad72-poc-002-component-combat.md`, and `docs/mailbox/poc-002-component-combat/architect.md`. Those are the Architect's unchanged A3 changes, not direct worker edits. The evidence commits own only this report and the unchanged assignment. Assignment SHA-256 remains `f3bedc5b038b672ccc59b79e29c4f29d3f444f98aa45b2577913ef5b491d98d5`.

No unresolved implementation blocker or required unrun check remains. Independent review/acceptance and human playtesting remain outside this implementation handoff. Work is committed only on `p2-fix1`; no push.
