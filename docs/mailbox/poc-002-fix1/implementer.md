task: P2-FIX1
role: implementer
status: needs-decision
outcome: "F1, F3 and O1 fixed; F2 stopped under S1 for counter/expiry overflow semantics"
source_baseline: 28d68ad
candidate_revision: 82c50762cc87d6f9994e753e874451ed59c34c7d
tested_revision: 82c50762cc87d6f9994e753e874451ed59c34c7d
artifacts:
  - docs/mailbox/poc-002-fix1/assignment-implementer.md
  - docs/mailbox/poc-002-fix1/implementer.md
  - poc-002-component-combat/tests/fix1-record.test.ts
  - poc-002-component-combat/tests/fix1-build-revision.test.ts
  - poc-002-component-combat/fixtures/hostile/fix1/
verification:
  - "Regression before fix: 17 failures, 281 passes; after fix: 302 tests pass"
  - "Committed revision: install, typecheck, tests, build and seed replay exit 0"
  - "Each new hostile fixture: CLI exit 1 with the intended specific reason"
  - "Bare browser: 940 assertions; sweep: 154 cells / 115 wins; probe: 14 cells / 9 wins; all exit 0"
  - "Report validation: exit 0; revision references resolve; parity and protected-path diffs empty"
review: not-run
discoveries:
  - "Content-only bounds cannot bound v1's indefinitely incrementing round/revision counters"
  - "Existing Q02 test requires corrupted final Salve count to return final-state divergence"
  - "New hostile fixtures use a subdirectory to preserve Q03's frozen root inventory test"
blockers:
  - "S1/F2: Architect ruling required for command counter/expiry overflow and its closed rejection contract"

# P2-FIX1 implementer handoff

Implemented on `p2-fix1`; no merge or push. Author: Codex, Implementer. The fix commit is `82c50762cc87d6f9994e753e874451ed59c34c7d`. This is a **partial result needing a rules decision**, not acceptance of F2. Assignment: [unchanged assignment](assignment-implementer.md). Authority: the supplied review on `p2-review`, [brief §§2, 3, 5, 7, 8, 9, 12–13](../../prototypes/poc-002-component-combat.md), [plan S1](../../plans/2026-10-19-db0bad72-poc-002-component-combat.md), ADR-0006 and the ruach-testing / ruach-handoff skills. No workflows loaded or workers launched.

## Findings and regression evidence

### F1 — fixed

Added public-API regressions before editing production code. `just poc-002-test > /tmp/p2-fix1-red-suite.log 2>&1` exited 1: **17 failed, 281 passed**. All failures were in the new FIX1 file; existing tests passed. The tests reproduce the reviewer's area Strike followed by a real `endPhase`, poison above the embedded cap, all six contradictory target-category combinations, and the additional content-derived bounds below. Valid complete non-factory snapshots and a frozen target whose current HP ranking changed already passed. The corrected suite passes all **302** tests (279 preserved existing tests, 19 new snapshot tests, four export tests).

`record.ts` now validates declared target **category** against embedded targeting: `all-brood` requires `{allBrood:true}`, `first-other-enemy` requires `{enemy}`, and all single-Brood rules require `{brood}`. Existing membership checks remain. It never recalculates frozen targets from current HP, Revelation, ledger, or enemy state. Poison is bounded by the maximum embedded Envenom cap or form poison-set amount; a test-owned poison-set above the base cap is still accepted.

The snapshot numerical audit also fixed:

| Field | Bound and coverage |
| --- | --- |
| Transformation expiry | `untilRound - round < durationRounds` for the embedded form, alongside the existing nonexpired constraint |
| Guard / Hold expiry | Exactly the current round |
| Pinned / Clamped expiry | Remaining lifetime cannot exceed a matching rider's duration on that enemy/source part |
| Weakened | Amount must equal an embedded Envenom reduction; expiry is the current round |
| Ledger current + previous | Total attributed damage cannot exceed the enemy pools actually removed; nothing heals or regenerates |
| Initial Salve uses | At most the fight or gauntlet's embedded allowance |

Positive boundary coverage accepts these values at their bounds, a complete non-factory snapshot, and a frozen Brood target that is no longer highest HP. Existing pool/cap, part-definition, carried-state and Ward checks already derive their relevant numerical constraints from embedded content. Round and revision have no content-derived upper bound; their unresolved arithmetic is F2 below.

The first green attempt exposed a conflict with `tests/q02-core.test.ts:470`: its changed final Salve count must yield `kind: final-state`, rather than throw during parsing. No existing test changed. The initial allowance is checked in `parseRecord`; the altered final expected count remains range-checked and is rejected by replay divergence. This preserves replay's separation between initial input and expected output. An intermediate typecheck also found a closure narrowing error in the new Salve expression; the corrected final code passes typechecking.

Three focused fixtures live under `fixtures/hostile/fix1/`. The subdirectory preserves the existing, unmodified Q03 test's explicit inventory of root JSON files. New FIX1 tests enumerate the new subdirectory. The actual bare CLI rejects each:

- `area-strike.json`: exit 1, `Invalid record at initialState: intent target shape contradicts embedded targeting rule`.
- `enemy-strike.json`: exit 1, same specific reason.
- `over-cap-poison.json`: exit 1, `Invalid record at initialState: poison exceeds content cap`.

Before the fix, `bun /tmp/p2-review-reproduce.ts` and `bun /tmp/p2-review-overflow.ts` both exited 0, reproducing the review exactly: accepted area Strike, accepted over-cap poison, and accepted three-command run emitting raw damage `4294967294`. After the fix, the unchanged first script exits 1 at its first forged `recordOf`, with the intent target shape reason. The new poison fixture independently exercises and rejects the second F1 case. The overflow reproduction still succeeds in demonstrating F2; it is not claimed fixed.

### F2 — S1 stop; no content or combat arithmetic changes

A pre-fix public-boundary regression was executed as `bun /tmp/p2-fix1-red-arithmetic.ts` and exited 1 with `AssertionError: Missing expected exception`. Its essential assertion is:

```ts
const raw = await Bun.file('poc-002-component-combat/content/combat-content.v1.json').json();
raw.actions.find(a => a.id === 'rupture-venom').effect.multiplier = 2147483647;
assert.throws(() => core.loadContent(raw), /portable|arithmetic|overflow/);
```

The reviewer's unchanged factory-origin three-command script also still produces raw `4294967294` and an unexportable run. There is **no passing F2 regression, no committed failing test, and no claim that every accepted command is recordable**. `content.ts` and all formulas remain unchanged pending the required decision. The existing parity suite still verifies exact ordered events and states for all 24 frozen records.

**Exact S1 question:** When an otherwise legal `act`, `endPhase` or `continue` would make `revision`, `round`, or `round + durationRounds - 1` exceed `2147483647`, what is the prescribed observable result? If it is atomic rejection, which closed rejection code and precedence apply? What invariant should limit near-boundary complete initial snapshots? Rejecting content alone cannot solve this while continuing to accept v1. The brief specifies neither a maximum run length nor overflow rejection, and §2 requires every accepted command to increment revision exactly once. Wrapping, saturation, silently ending combat, an arbitrary round ceiling, or inventing a rejection code would each choose a new rule.

This is not merely theoretical for the loader audit: brief §8 explicitly permits harmless dismantled ordinary enemies, so repeated `endPhase` has no finite content-derived bound even for v1. A portable complete snapshot at the boundary exposes the issue in one command. `bun /tmp/p2-fix1-counter.ts` exited 0 and asserted all three failures below against the fix commit. To reproduce from the root (imports / assertions omitted only where shown):

```ts
import assert from 'node:assert/strict';
const core = await import(process.cwd() + '/poc-002-component-combat/src/core/index.ts');
const c = core.loadContent(await Bun.file('poc-002-component-combat/content/combat-content.v1.json').json());
const snapshot = s => core.recordOf({ content: c, initialState: s, commands: [], finalState: s, buildRevision: 'unknown' });
const make = () => core.createFight(c, { encounterId: 'guard', party: ['ugallu'], start: 'fresh' });
const s = make(); s.revision = 2147483647; snapshot(s);
const command = { kind: 'endPhase', expectedRevision: s.revision };
const result = core.applyCommand(c, s, command);
assert.equal(result.ok, true); assert.equal(result.state.revision, 2147483648);
assert.throws(() => core.recordOf({ content: c, initialState: s,
  commands: [{ command, revision: result.state.revision, events: result.events }],
  finalState: result.state, buildRevision: 'unknown' }), /revision/);
const inert = make();
for (const p of inert.enemies[0].parts) if (p.kind === 'component') p.pool = 0;
inert.intents = []; inert.round = 2147483647; snapshot(inert);
const end = core.applyCommand(c, inert, { kind: 'endPhase', expectedRevision: inert.revision });
assert.equal(end.ok, true); assert.equal(end.state.round, 2147483648);
const form = make(); form.round = 2147483647;
for (const i of form.intents) i.id = `r${form.round}.${i.enemy}.${i.kind}`;
form.party[0].revelation = form.party[0].revelationCap - 1; snapshot(form);
const cross = core.applyCommand(c, form, { kind: 'act', actor: 'ugallu', action: 'rend',
  target: { enemy: form.enemies[0].id, part: 'weapon-arm' }, expectedRevision: form.revision });
assert.equal(cross.ok, true);
assert.equal(cross.state.party[0].transformation.untilRound, 2147483648);
```

Arithmetic audit for the resumed work:

| Arithmetic | Observation / remaining work |
| --- | --- |
| Venom multiplication | Bound poison (including poison-set) × base or effective form multiplier; review reproduction proves the current loader fails |
| Action additive damage | All matching attack bonuses accumulate in modifier order; Stolen Bolt overrides raw at its modifier position. Check effective outputs without changing order or formula |
| Intent additive damage | Raw includes all applicable part-intact and clamped bonuses; raw can exceed the record limit even when each leaf is valid |
| Incoming bonus / mitigations | Incoming bonus is separate from raw. Guard stores half the nonnegative pre-Guard amount; applied damage remains HP-clamped. Bound emitted fields, distinguishing internal safe-number additions from emitted integers |
| Poison gain / Revelation / healing | Poison and Revelation additions are capped; healing and applied damage are pool-clamped. Full-size leaves alone do not prove an emitted overflow in those capped results |
| Ledger counters | Applied damage accumulates across parts and retaliations. Content may give total part pools above one portable integer; resumed bounding must account for this |
| Form / restraint duration | Expiry adds current round and duration minus one. No static positive duration bound can work for every permitted round; v1 expiry overflow executed above |
| Round / revision / gauntlet | Increment counters are unbounded by content; fight index is bounded by encounter count and Salves only decrease |

An S1 clarification was sent during work. No ruling had arrived while this report was prepared. Independent F1/F3/O1 work and checks continued; no F2 rule was invented.

### F3 — fixed

`docs/README.md:24` now describes POC 002 as implemented on its branch, with human playtesting pending, and links the prototype README. No other stale POC 002 status sentence remains in that file. Neither protected status document changed.

### O1 — fixed

`mountApp` reads `import.meta.env.VITE_POC002_BUILD_REVISION`, falls back to `unknown`, and passes it through **both** selection-launched and direct-URL `mountRun` calls. Four tests execute the real app/run/session/export path, stub only presentation surfaces, and parse the exported JSON Blob: each route embeds a known commit and each accepts unavailable metadata as `unknown`. The protocol now says `unknown` means revision unavailable, including a dirty build, and asks testers to establish attribution before quantitative claims. The production bundle also embeds the fix SHA. All 19 actual UI record artifacts from the browser run contain that full SHA, including direct-URL and selection-launched exports. No human testing is claimed.

## Exact verification and outcomes

All required recipes ran bare from `/opt/dev/tehom-brainlab-p2-fix1`, with no caller `POC002_*` or Chrome overrides. Final checks target fix commit `82c5076`; the later report commit records evidence only. The initial sandboxed install failed with `Docker daemon inaccessible`; automatic approval allowed rerunning it with Docker access. Git's first sandboxed commit failed because shared worktree metadata is outside the writable root; the approved retry created the requested branch-local commit. No automatic-review rejection occurred.

| Command | Result |
| --- | --- |
| `just poc-002-install` | Exit 0; Bun 1.4.2, 43 installs checked (initial successful install added the pinned 43 packages) |
| `just poc-002-typecheck` | Exit 0, `tsc --noEmit` |
| `just poc-002-test > /tmp/p2-fix1-tested-suite.log 2>&1` | Exit 0, 16 files / 302 tests, all parity included |
| `just poc-002-build` | Exit 0, four prepared assets, 21 modules; informational >500 kB bundle warning |
| `just poc-002-test-browser > /tmp/p2-fix1-browser.log 2>&1` | Exit 0, 940 assertions: battle 302, keyboard gauntlet 321, run 311, smoke 6; preview container stopped normally |
| `just poc-002-replay poc-002-component-combat/fixtures/parity/seed-ugallu-warden.json` | Exit 0, `commands=35 events=146 outcome=victory` |
| `just poc-002-replay poc-002-component-combat/fixtures/hostile/fix1/area-strike.json` | Expected exit 1, target shape reason |
| `just poc-002-replay poc-002-component-combat/fixtures/hostile/fix1/enemy-strike.json` | Expected exit 1, target shape reason |
| `just poc-002-replay poc-002-component-combat/fixtures/hostile/fix1/over-cap-poison.json` | Expected exit 1, poison cap reason |
| `just poc-002-sweep --quick > /tmp/p2-fix1-sweep.txt` | Exit 0, 154 cells / 115 wins / 3,648 openings |
| `just poc-002-probe > /tmp/p2-fix1-probe.txt` | Exit 0, 14 comparison cells / 9 wins / 3,648 openings |
| `bun /tmp/p2-review-reproduce.ts` | Before: exit 0 reproduces all defects. After: expected exit 1 rejects first forged Strike |
| `bun /tmp/p2-review-overflow.ts` | Exit 0 before and after; asserts F2 is still present |
| `bun /tmp/p2-fix1-red-arithmetic.ts` | Exit 1 before fix; loader does not reject unsafe content. Unresolved under S1 |
| `bun /tmp/p2-fix1-counter.ts` | Exit 0, demonstrates the three unresolved counter/expiry failures above |
| `bun run --cwd poc-002-component-combat test:unit tests/fix1-record.test.ts > /tmp/p2-fix1-red-record.log 2>&1` | Host diagnostic attempt had a worker-start timeout and ran no tests; its shell returned 0 due to the trailing `tail`. Bare Docker red run above supplies actual regression evidence |
| `git diff --check` | Exit 0 |
| `git diff --stat 28d68ad..HEAD -- poc-002-component-combat/fixtures/parity` | Exit 0, empty |
| `git diff --stat 28d68ad..HEAD -- poc-001-linked-formation shared assets docs/CURRENT.md docs/TASK_LOGS.md poc-002-component-combat/content poc-002-component-combat/tests/q*.test.ts` | Exit 0, empty |
| `bun install --frozen-lockfile --cwd /tmp/p2-fix1-handoff-skill` | Exit 0, six packages; skill copied from `.agents/skills/ruach-handoff` into `/tmp` |
| `bun /tmp/p2-fix1-handoff-skill/scripts/validate.ts docs/mailbox/poc-002-fix1/implementer.md --repo /opt/dev/tehom-brainlab-p2-fix1` | Exit 0, schema and Git revision references valid |
| `bun /tmp/p2-fix1-summaries.ts` | Exit 0, counted the sweep/probe cells, wins and openings above |
| `bun /tmp/p2-fix1-provenance.ts` | Exit 0, all 19 actual UI JSON record artifacts contain the full fix SHA, including direct-URL and selection routes |

Browser artifacts are disposable at `/tmp/poc-002-browser-E7CHqf/`; the harness stopped its named preview container. Sweep/probe flags are heuristic evidence, not assertions of balance or human playtesting. Both summaries match the independent review.

Assignment SHA-256 before committing evidence: `f3bedc5b038b672ccc59b79e29c4f29d3f444f98aa45b2577913ef5b491d98d5`.

## Changed paths and remaining work

Implementation commit changes only:

- `poc-002-component-combat/src/core/record.ts`
- `poc-002-component-combat/src/view/app.ts`
- `poc-002-component-combat/tests/fix1-record.test.ts`
- `poc-002-component-combat/tests/fix1-build-revision.test.ts`
- `poc-002-component-combat/fixtures/hostile/fix1/{README.md,area-strike.json,enemy-strike.json,over-cap-poison.json}`
- `docs/README.md`
- `docs/playtests/poc-002-human-test-protocol.md`

The separate evidence commit adds this report and the unchanged assignment. No other files changed. Remaining work: obtain the Architect's overflow ruling, implement F2 with regression-first public-boundary tests (including recordability of every accepted command in the bounded example), and rerun the required checks on that candidate. F1/F3/O1 have automated evidence; independent review and human playtesting remain unperformed.
