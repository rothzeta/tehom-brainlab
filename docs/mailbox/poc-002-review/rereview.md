task: P2-REREVIEW
role: reviewer
status: complete
outcome: "FAIL: original F1-F3 and O1 resolved; one new blocking A3 consistency finding, zero optional findings"
source_baseline: 28d68ad
reviewed_revision: "9500968"
evidence_revision: 0d260ce
tested_revision: d3f8ce54f95b9b552325d0423829c8645bb37092
artifacts:
  - docs/mailbox/poc-002-review/rereview.md
  - docs/mailbox/poc-002-review/assignment-rereview.md
verification:
  - "Required bare install/typecheck/test/build/browser/seed replay/sweep/probe pass; 351 tests and 940 browser assertions"
  - "All four fix1 hostile fixtures and original reviewer CLI input reject with specific reasons"
  - "Independent API checks pass: 17 checks, 51 accepted recordable commands, 75 atomic limit rejections"
  - "All 19 actual UI export artifacts embed the known tested build revision"
  - "New A3 counterexample: accepted armor and Ward produce intermediate -4294967288, outside signed 32-bit range"
review:
  - "Original findings resolved; acceptance condition 5 fails the newly amended intermediate-arithmetic guarantee"
discoveries:
  - "B1-B6 constrain positive damage bounds but do not make the existing combined mitigation subtraction safe in signed 32-bit arithmetic"
blockers:
  - "R1: clarify or complete A3's intermediate-arithmetic guarantee before acceptance"

# P2-REREVIEW independent report

Reviewer: Codex, 2026-10-20 UTC. **FAIL: 1 blocking finding, 0 optional findings.** Original F1, F2's multiplier reproduction, F3 and O1 are resolved. All required bare verification passes. The remaining finding concerns A3's newly stated intermediate-arithmetic guarantee, not a demonstrated TypeScript combat or export regression.

Scope: `28d68ad..0d260ce`. Reviewed implementation: `9500968f0006b8561132a9c19072cff7c65ab89d`; evidence head: `0d260ced4e305693c49151a627aa7b60c47da303`. As explicitly authorized in [the assignment](assignment-rereview.md), executed **once** `git merge --no-ff poc-002-component-combat` on `p2-review`, producing `d3f8ce54f95b9b552325d0423829c8645bb37092` without conflicts. This is the tested revision. The merge retained the prior independent report; no application edits were made by the Reviewer.

`git diff --stat 9500968 0d260ce` lists only `docs/mailbox/poc-002-integration/merge-fix1.md` (161 added lines). The tested merge's application, brief, plan and documentation match `9500968`; the merge adds review/evidence history only. Consumed the [fix assignment](../poc-002-fix1/assignment-implementer.md), [fix handoff](../poc-002-fix1/implementer.md), [integration report](../poc-002-integration/merge-fix1.md) and [Architect Amendment 3](../poc-002-component-combat/architect.md#amendment-3-2026-10-19-portable-integer-range). Applied ruach-testing and ruach-handoff; no workflows or workers launched.

## Finding

### R1 — blocking, P2: A3 does not establish its signed 32-bit intermediate guarantee

**Location:** `docs/prototypes/poc-002-component-combat.md:321`, in new Amendment A3-1. Related implementation: `poc-002-component-combat/src/core/content.ts:66–93`; existing damage expression at `src/core/engine.ts:242`.

A3 says B1–B5 bound every content-derived integer, including intermediates, so a signed 32-bit implementation never overflows. The prescribed bounds omit the negative intermediate in the existing physical damage expression `max(0, raw − armor − Ward)`.

**Executed evidence:** take the shipped topology, set a new content version, set the Guard's weapon-arm armor and the Scribe's Ward amount each to `2147483647`. This content satisfies B1–B6 and `loadContent` accepts it. Create a solo Ugallu `guard-scribe` fight and Claw the warded weapon arm. The accepted transition reports:

```text
raw=6 armor=2147483647 ward=2147483647 applied=0
raw - armor - ward = -4294967288
signed 32-bit wrap of that intermediate = 8
recordOf/replayRecord: success
```

The negative intermediate is below `-2147483648`. TypeScript's wider number representation produces the correct zero damage and valid records. A direct unchecked signed 32-bit transcription of the same expression would instead produce 8 before the floor; checked arithmetic would overflow. The wrap is demonstrated with JavaScript's explicit Int32 conversion, not an executed C# port.

**Why blocking:** rereview condition 5 explicitly requires A3 to be internally consistent. The new guarantee that B1–B5 alone suffice for signed 32-bit intermediate arithmetic is false for accepted content. This is a concrete numerical counterexample to that guarantee, rather than a request to redesign combat, change v1 tuning, or implement C# now. All explicit B1–B6 checks and the original multiplier fix behave as specified.

**Suggested direction:** have the Architect specify overflow-free mitigation evaluation (for example, equivalent sequential subtraction floored to zero, or sufficiently wide intermediates) and qualify the guarantee accordingly, or strengthen the relevant bounds. Preserve the mathematical damage formula and v1 numbers. Add a public-boundary case with large simultaneous armor and Ward to protect the chosen contract. Fixes remain with the responsible Implementer/Architect.

### Self-contained reproduction

From the repository root, save this block as `/tmp/p2-rereview-mitigation-repro.ts` and run `bun /tmp/p2-rereview-mitigation-repro.ts`:

```ts
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const api = await import(process.cwd() + '/poc-002-component-combat/src/core/index.ts');
const c = JSON.parse(readFileSync('poc-002-component-combat/content/combat-content.v1.json', 'utf8'));
const L = 2147483647;
c.contentVersion = 'rereview-mitigation-range';
c.enemies.find((e: any) => e.id === 'celestial-guard').parts.find((p: any) => p.id === 'weapon-arm').armor = L;
c.enemies.find((e: any) => e.id === 'naming-scribe').intents.find((i: any) => i.kind === 'inscribe').ward = L;
const content = api.loadContent(c);
const initial = api.createFight(content, { encounterId: 'guard-scribe', party: ['ugallu'], start: 'fresh' });
const command = { kind: 'act', expectedRevision: 0, actor: 'ugallu', action: 'claw', target: { enemy: initial.enemies[0].id, part: 'weapon-arm' } };
const result = api.applyCommand(content, initial, command);
assert.equal(result.ok, true);
const damage = result.events.find((e: any) => e.kind === 'part-damaged').damage;
const intermediate = damage.raw - damage.armor - damage.ward;
assert.ok(intermediate < -2147483648);
assert.equal(damage.applied, 0);
const record = api.recordOf({ content, initialState: initial, commands: [{ command, revision: result.state.revision, events: result.events }], finalState: result.state, buildRevision: 'unknown' });
assert.equal(api.replayRecord(record).ok, true);
console.log({ damage, intermediate, wrappedInt32: intermediate | 0, replay: 'passes' });
```

## Acceptance conditions

| Condition | Verdict | Evidence |
| --- | --- | --- |
| 1. F1 resolved | **PASS** | Both impossible Strike shapes and over-cap poison fail parsing and replay with specific reasons. All three committed fixtures and the original reviewer CLI file reject. Independently tested a complete snapshot at revision 12 after changing current HP so the frozen Strike recipient is no longer the highest-HP Brood; it still parses/replays. |
| 2. F2 resolved per A3 | **PASS for the specified B1–B6 and A3-2 contract** | Original large multiplier now fails `loadContent`, record parsing, replay and CLI with B2. Independent test-owned variants reject each bound; suite covers exact boundaries and alternatives. Near-limit checks confirm last-precedence atomic rejection, preview equality, rejection in forecasts, accepted terminal commands at round L, and rejection of a new expiry even when subsequently cleared by victory. All 51 independently accepted commands export/replay. V1 content/formulas and all 24 parity fixtures are unchanged and replay. R1 separately challenges A3's broader sufficiency claim under condition 5. |
| 3. F3 resolved | **PASS** | `docs/README.md:24` now describes POC 002 as implemented on its branch, with human playtesting pending, and links the prototype README. |
| 4. O1 resolved | **PASS** | Both `mountRun` routes receive build metadata with `unknown` fallback. Four new app/export boundary tests cover known/missing metadata for selection and direct routes. All 19 actual browser export artifacts embed tested merge SHA `d3f8ce54f95b9b552325d0423829c8645bb37092`; protocol wording is accurate. |
| 5. Nothing regressed; scope and A3 consistency | **FAIL solely for R1** | Runtime code matches the explicitly listed bounds/rejection behavior. Authorized paths confirmed; `types.ts` only appends `limit-reached`. Existing tests, every browser harness (including Q05/Q06-related checks), audio code, content and parity files remain unchanged. A3's additional intermediate-range guarantee has the reproduced counterexample above. No other material regression found. |
| 6. Fresh bare verification | **PASS** | Eight required commands exit 0; dev HTTP 200 and successful targeted cleanup; all four new hostile fixtures exit 1. Details below. |

## Independent probes and scope evidence

`bun /tmp/p2-rereview-independent.ts` exited 0 with **17 checks, 51 accepted recordable commands, 75 atomic limit rejections**. It uses a small test-owned content definition with independent HP, costs, poison and damage values. It separately exercises both F1 target categories, poison, the original multiplier, and a valid frozen-target snapshot. A3 probes include durations 1/3/L, rounds 1/L−2/L and revisions L−2/L. Commands are enumerated independently of `legalActions`; each is dispatched and previewed, the input is compared unchanged, accepted paths export/replay, and the advertised legal set is compared with actual acceptance. A separate terminal poison case at round L/revision L−1 accepts and records; a new transformation expiry that overflows still rejects despite victory; a valid Guard preview has a rejected `endPhase` forecast. The unchanged original review script also reruns its five positive contracts before stopping at the now-rejected forged Strike.

No fresh tests were added to the repository. The new implementation tests add 72 cases to the preserved 279, yielding 351. Their assertions exercise public loader/command/record/export boundaries with test-owned content; existing checkpoint assertions were not weakened. BigInt is confined to content validation; content and records retain ordinary JSON numbers. No snapshot headroom requirement was added.

Scope checks performed:

```sh
git diff --name-only 28d68ad 0d260ce
git diff 28d68ad 0d260ce -- poc-002-component-combat/src/core/types.ts
git diff --stat 28d68ad 0d260ce -- poc-001-linked-formation shared assets docs/CURRENT.md docs/TASK_LOGS.md poc-002-component-combat/fixtures/parity poc-002-component-combat/content poc-002-component-combat/tests/q*.test.ts poc-002-component-combat/tests/browser*.mjs
git diff --stat 9500968 HEAD -- poc-002-component-combat docs/prototypes docs/plans docs/playtests docs/README.md
```

All exited 0; the last two outputs are empty. Direct fix paths are within the fix assignment. Brief/plan/Architect report changes are the authorized A3 amendment; prototype README is the integration owner's assembly. `types.ts` has exactly one added rejection-code entry, preserving the old order. No package, lockfile, asset, protected status document, shipped number or existing test/harness changed.

## Exact verification commands and results

All application commands ran from `/opt/dev/tehom-brainlab-p2-review`, with no caller `POC002_*` or Chrome overrides. Docker/Chrome used sandbox escalation, as in the first review; no automatic approval rejection occurred.

| Exact command | Result |
| --- | --- |
| `just poc-002-install` | 0; Bun 1.4.2, 43 installs checked. |
| `just poc-002-typecheck` | 0; `tsc --noEmit`. |
| `just poc-002-test > /tmp/p2-rereview-test.txt 2>&1` | 0; **351 tests / 17 files**, all parity files replay. |
| `just poc-002-build` | 0; four assets, 21 modules, existing informational >500 kB bundle warning. |
| `just poc-002-test-browser > /tmp/p2-rereview-browser.txt 2>&1` | 0; **940 assertions / 4 harnesses** (302 battle, 321 keyboard gauntlet, 311 run/export, 6 smoke). |
| `just poc-002-replay poc-002-component-combat/fixtures/parity/seed-ugallu-warden.json` | 0; `commands=35 events=146 outcome=victory`. |
| `just poc-002-sweep --quick > /tmp/p2-rereview-sweep.txt` | 0; 154 cells / 115 wins / 3,648 openings. |
| `just poc-002-probe > /tmp/p2-rereview-probe.txt` | 0; 14 cells / 9 wins / 3,648 openings. |
| `just poc-002-replay poc-002-component-combat/fixtures/hostile/fix1/area-strike.json` | Expected 1; `Invalid record at initialState: intent target shape contradicts embedded targeting rule`. |
| `just poc-002-replay poc-002-component-combat/fixtures/hostile/fix1/enemy-strike.json` | Expected 1; same target-shape reason. |
| `just poc-002-replay poc-002-component-combat/fixtures/hostile/fix1/over-cap-poison.json` | Expected 1; `Invalid record at initialState: poison exceeds content cap`. |
| `just poc-002-replay poc-002-component-combat/fixtures/hostile/fix1-arithmetic/multiplier-overflow.json` | Expected 1; `Invalid content at B2 poison product: derived arithmetic exceeds portable integer limit 2147483647`. |
| `just poc-002-replay /tmp/p2-review-area-strike.json` | Expected 1; original independent CLI reproduction rejects with target-shape reason. |
| `bun /tmp/p2-review-reproduce.ts` | Expected 1; unchanged original reproduction now stops at the forged Strike with target-shape reason. Later cases checked independently. |
| `bun /tmp/p2-review-overflow.ts` | Expected 1; unchanged original factory-origin multiplier reproduction now stops at `loadContent` with B2 reason. |
| `bun /tmp/p2-review-checks.ts` | Expected 1; original five positive checks pass, then original forged Strike rejects. |
| `bun /tmp/p2-rereview-independent.ts` | 0; 17 checks / 51 recordable accepted commands / 75 atomic limit rejections. |
| `bun /tmp/p2-rereview-mitigation.ts` | 0; reproduced R1's accepted content, out-of-range negative intermediate and successful TypeScript export/replay. |
| `just poc-002-dev` | Default 5273; HTTP smoke passed; intentional stop subsequently exits 143. |
| `curl --fail --silent --show-error --include http://localhost:5273/` | 0; HTTP 200 and expected page title. |
| `docker ps --filter publish=5273 --format '{{.ID}} {{.Names}} {{.Ports}}'` | 0; identified task dev container `9cb53947260d`. |
| `docker stop -t 5 9cb53947260d` | 0; stopped that container. |
| `cmp /tmp/p2-review-sweep.txt /tmp/p2-rereview-sweep.txt` | 0; byte-identical to first review's stdout. |
| `cmp /tmp/p2-review-probe.txt /tmp/p2-rereview-probe.txt` | 0; byte-identical to first review's stdout. |
| `git diff --stat 9500968 0d260ce` | 0; only integration evidence report. |
| `git diff --check` | 0. |
| `sha256sum docs/mailbox/poc-002-review/assignment-rereview.md` | 0; unchanged `48845c3de246c2fc4fe3f88d5f0a22a22f33f85e7db762b6f0666585252e4fe6`. |
| `bun install --frozen-lockfile --cwd /tmp/p2-review-ruach-handoff` | 0; reused isolated skill copy, six installs checked. |

Browser artifacts are disposable at `/tmp/poc-002-browser-BKx1i1/`. The keyboard download replays with `commands=46 events=231 outcome=victory`; 43 observed audio requests cover all six kinds. A scratch Python JSON walk found 19 combat-record artifacts and asserted that each `buildRevision` equals the tested merge SHA; exit 0. This includes selection and direct-route exports. The runner stopped its own named preview container. Sweep/probe diagnostic flags are unchanged and remain outside balance acceptance.

## Limits and delivery

No C#/Godot code, human playtest, physical listening, full width-200 sweep or exhaustive proof over all content/state combinations was performed. R1 is a numerical/specification counterexample; it does not claim a TypeScript replay failure. Existing test evidence plus independent boundary samples establish the remaining checks, subject to the recorded limits.

The assignment is unchanged. The report is validated using the previously copied skill at `/tmp/p2-review-ruach-handoff`, with dependencies installed only there. Final self-contained-reproduction, validation and staged-scope results are appended before the report commit. Only this report and `assignment-rereview.md` are committed in the rereview report commit; the separate one-time integration merge was explicitly authorized by the assignment. No push.

Final report checks:

- `bun /tmp/p2-rereview-mitigation-repro.ts`: exit 0; extracted the self-contained block verbatim and reproduced intermediate −4294967288, Int32 wrap 8, applied damage 0 and successful replay.
- `docker ps --filter publish=5273 --filter publish=4273 --format '{{.ID}} {{.Names}} {{.Ports}}'`: exit 0, no remaining containers on either port.
- The first handoff-validation attempt identified unquoted numeric revision `9500968` as a YAML number; quoting it corrects the field type without changing the revision.
- `bun /tmp/p2-review-ruach-handoff/scripts/validate.ts docs/mailbox/poc-002-review/rereview.md --repo .`: exit 0, `ok: true`, no diagnostics; all four revision fields resolve.
- `git diff --cached --check`: exit 0; `git diff --cached --name-only` lists only this report and `docs/mailbox/poc-002-review/assignment-rereview.md`. Assignment checksum matches the pre-merge value.
