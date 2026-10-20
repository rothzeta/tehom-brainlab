task: P2-REVIEW
role: reviewer
status: complete
outcome: "FAIL: 3 blocking findings and 1 optional finding; all required bare verification commands pass"
source_baseline: 19af724
reviewed_revision: 1b57b0f
evidence_revision: 28d68ad
tested_revision: 28d68ad
artifacts:
  - docs/mailbox/poc-002-review/reviewer.md
  - docs/mailbox/poc-002-review/assignment-reviewer.md
verification:
  - "Bare install, typecheck, test (279), build, browser (940 assertions), seed replay, quick sweep and default probe: exit 0"
  - "Bare dev: HTTP 200 on 5273; identified container stopped successfully"
  - "Independent public-API checks: five positive contracts pass; impossible snapshots accepted and accepted content produces an unexportable run"
  - "Protected-path, Q05 harness and Q06 test preservation checks pass"
review:
  - "Independent review complete; acceptance withheld for F1-F3"
discoveries:
  - "Shipped-content parity and automated browser checks pass despite gaps in hostile-state validation and arithmetic bounds"
blockers:
  - "F1: impossible declared-intent target and over-cap poison accepted by record validation"
  - "F2: accepted content can produce damage outside the portable record integer range"
  - "F3: docs/README.md incorrectly says POC 002 is unimplemented"

# Independent review — P2-REVIEW

Reviewer: Codex, 2026-10-19 UTC. **Verdict: FAIL; 3 blocking findings, 1 optional finding.** No production code was changed. Scope is `19af724..28d68ad`; implementation is `1b57b0f866ff43a38be23f69df8215e80e35ac7f`. Checks ran with HEAD `28d68ad394999ef57c3c63ca381736df937d37c9` on `p2-review`. `git diff --stat 1b57b0f 28d68ad` confirms the only successor change is `docs/mailbox/poc-002-q09/implementer.md` (165 insertions, 99 deletions). The checked application therefore equals the requested implementation.

Authority: [assignment](assignment-reviewer.md), [ADR-0006](../../adr/0006-contract-invariants-and-black-box-testing.md), [ADR-0007](../../adr/0007-poc-002-component-combat.md), [brief, including A2](../../prototypes/poc-002-component-combat.md), and [Q01–Q10 plan](../../plans/2026-10-19-db0bad72-poc-002-component-combat.md). Consumed checkpoint and integration handoffs, including the [final Q09 evidence](../poc-002-q09/implementer.md). Applied ruach-testing and ruach-handoff; no workflows or workers launched.

## Findings, ordered by severity

### F1 — blocking, P2: reject impossible intent targets and poison pools

**Location:** `poc-002-component-combat/src/core/record.ts:137–138` (intent targets), `:119–126` (enemy state checks).

The parser verifies that a Brood/enemy target ID exists, but never checks the target's shape against the embedded intent's targeting rule. A record can replace the Guard's single-target Strike with `{allBrood:true}`, leave its embedded definition unchanged, and replay successfully. The engine then damages both party members. Conversely, `{enemy:<source enemy>}` can make that Strike resolve through the Inscribe-style no-damage branch. Enemy poison is checked only as a 31-bit integer, so a snapshot with poison above its embedded Envenom cap also passes.

**Why it matters:** brief §§3, 5, 8 and 12, E45, and Q03 acceptance 2 require impossible initial states to be rejected. Re-executing commands does not establish conformance if the starting declared intent already changes the rules. This is an acceptance defect, not a claim of code execution, file access or network access.

**Executed reproduction:** the durable script below changes only the snapshot target, records one real `endPhase` transition, then calls `parseRecord`/`replayRecord`. Replay returns success and produces two Strike damage events. The original independently generated file also passed the actual CLI:

```text
just poc-002-replay /tmp/p2-review-area-strike.json
commands=1 events=6 outcome=player
exit 0
```

A separate zero-command record with poison 7 against embedded cap 6 also replays successfully.

**Suggested direction:** validate target category against `IntentDefinition.targeting` without recomputing a frozen Brood target from current HP/ledger; enforce content-derived poison bounds and add focused hostile fixtures. Preserve valid complete non-factory snapshots.

### F2 — blocking, P2: bound derived arithmetic before accepting content

**Location:** `poc-002-component-combat/src/core/engine.ts:277` (Venom multiplication), `src/core/content.ts:64–99` (accepted-content validation).

`loadContent` accepts a Rupture Venom multiplier of `2147483647`, because it fits the documented input range. Starting from `createFight`, three accepted commands—Envenom on the Guard's weapon arm, End Phase, Rupture Venom—produce `damage.raw = 4294967294`. `recordOf` then throws at `record.commands[2].events[1].damage.raw`, which must be at most `2147483647`. Pool clamping does not bound the emitted raw damage. The independent initial probe also reproduced this with an accepted complete snapshot and raw damage `10737418235`.

**Why it matters:** brief §12 requires every record integer below 2³¹, and accepted runs must be exportable for C# parity. Individually valid content numbers currently produce a real run that cannot be recorded. No fabricated state is needed for the three-command reproduction.

**Suggested direction:** reject content combinations whose possible emitted arithmetic exceeds the portable range, or obtain an explicit rules decision for handling such arithmetic. Include additive bonuses and duration/counter arithmetic in the bounds audit. Do not silently alter the specified damage formula. Add a public-boundary regression that every accepted command in the bounded example remains recordable.

### F3 — blocking, P3: correct the vault entry point's implementation claim

**Location:** `docs/README.md:24`.

The documentation still says, “POC 002 is specified but not implemented.” This conflicts with the root README, prototype README and the working selection/battle/gauntlet/export implementation. Acceptance condition 6 explicitly includes this file.

**Reproduction:** `rg -n 'poc-002|not implemented' docs/README.md` prints the stale statement; the successful browser run below demonstrates implemented behavior.

**Suggested direction:** update the sentence to describe implemented POC 002 features and pending human playtesting. Protected CURRENT/TASK_LOGS edits are not required for this correction.

### O1 — optional, P3: wire known build provenance into UI exports

**Location:** `poc-002-component-combat/src/view/app.ts:33` and `:45`.

Both `mountRun` calls omit `buildRevision`, so sessions always use `unknown`; no application source reads the wrapper's `VITE_POC002_BUILD_REVISION`. The actual downloaded keyboard-gauntlet record has `buildRevision: "unknown"`. Static inspection shows this also happens for a clean build whose revision is available. This weakens the human-test protocol's build attribution and makes its “unknown means dirty” guidance misleading.

**Reproduction:** `rg -n 'BUILD_REVISION|buildRevision' poc-002-component-combat/src` shows the defaults and unused optional argument; inspect a UI JSON export. **Suggested direction:** pass the build metadata to both run mounts, retaining `unknown` when unavailable. Optional because brief §12 explicitly permits the literal `unknown`.

## Acceptance conditions 1–7

| Condition | Verdict | Evidence and limits |
| --- | --- | --- |
| 1. Rules conformance | **FAIL** | Shipped numbers/actions/forms/schedules match the brief on inspection; named E01–E51 coverage and five independent positive checks pass. F1 violates the hostile-state contract; F2 violates the portable-number contract. No other material discrepancy found in the reviewed round ordering, damage, statuses, Warden pulse, Salve or rejection precedence. |
| 2. Every checkpoint and whole-plan criteria | **FAIL** | Checkpoint mapping below. Q03's hostile-state requirement is not met (F1), and portable records fail for accepted content (F2). |
| 3. Boundaries | **PASS** | Core imports remain inside core; harness imports core/local modules and Node-only CLI I/O, with no Phaser/view/audio/browser dependencies. Previews and forecasting call real `applyCommand`; UI/model project state/events and use preview acceptance for legality. Protected-path diff is empty; dependency pins match POC 001 and lockfile differs only in workspace name. |
| 4. Records and parity | **FAIL** | Records embed content/complete states/per-command events; all 24 parity files replay in the executed suite, as do actual UI exports including unfinished/post-death/between-fights attempts. Existing 13 hostile fixtures and size tests pass. Independent F1/F2 cases expose remaining validation and portability failures. |
| 5. Test policy and preservation | **PASS** | Rule/search/session tests use explicit test-owned content; parity expected events/states reside in versioned fixtures. No weakened contractual assertion found. Authorized deferral replacements preserve implemented dispatch checks. Q05 battle harness and Q06 tests are byte-for-byte unchanged from their implementation commits. Missing hostile/overflow cases are recorded as F1/F2 rather than treated as test weakening. |
| 6. Documentation | **FAIL** | Root and prototype READMEs match actual commands and behavior; vault entry point has F3. |
| 7. Fresh bare verification | **PASS** | All eight assigned commands exit 0; bare dev answers HTTP 200 and is stopped. Details below. Successful existing tests do not override the reproduced defects. |

### Checkpoint and whole-plan mapping

The numbered acceptance lists were compared with implementation/tests and the source handoff mappings, then checked by fresh execution. Earlier Q01 stubs/deferrals are assessed as their authorized later implementations.

| Checkpoint | Numbered list | Assessment |
| --- | --- | --- |
| Q01 | 1–9 | Pass: pins/lock, ten dispatches, content/contracts, routing, assets, canvas smoke and README. |
| Q02 | 1–13 | Shipped rules, 79 named core tests, two seed tests and preview coverage pass; the general records/portable-content obligations remain incomplete under F2. |
| Q03 | 1–5 | **Fail item 2** under F1; other corpus, divergence, CLI and authoring requirements pass. |
| Q04 | 1–7 | Pass: complete matrix, opening enumeration, policies/signals, bounded search, numeric scan, determinism and purity; fresh quick sweep/default probe pass. |
| Q05 | 1–8 | Pass: real session/model, two-way targeting, visible numbers/intents, preview equality, invalidity, keyboard/focus behavior and all seven completed fights; 302 browser assertions. |
| Q06 | 1–3 | Pass: pure mapping, six distinct synthesized cues, lazy safe audio/mute and type-only dependency; 44 unit tests. Subjective listening explicitly unperformed in its handoff and here. |
| Q07 | 1–4 | Pass: complete labelled geometry, ≥48×48 regions, no overlap, registered portraits and credits; 20 unit tests plus actual targeting checks. |
| Q08 | 1–5 | Pass for shipped content: every launch combination, carry/deaths, explicit continue, actual downloads and unfinished replay, reset isolation and credits; 311 browser assertions and three unit tests. |
| Q09 | 1–5 | Pass: keyboard trio victory/download/CLI replay/six observed cue kinds, recipes/README, full bare checks and protected-path preservation; 321 browser assertions. |
| Q10 | Complete acceptance list | Pass: unexecuted protocol covers setup/order/predictions/falsifiers/export/separated observations/consent; local Markdown links and anchors checked successfully. No human testing claimed. |

Whole-plan **1 fails** for the gaps above. **2 passes on the available decision history**: no invented design decision was found; A2 and unfinished-export questions were resolved by Architect amendments. F1/F2 are implementation conformance defects, not evidence of an unauthorized design decision. **3 passes** on the actual UI exports and corpus executed. **4 passes**: final revision sweep/probe summaries are in the Q09 handoff, linked to durable [Q04 cell/signal evidence](../poc-002-integration/merge-q04.md). Fresh review results match the reported 154/115 and 14/9 cells/wins and 3,648 openings each. **5 passes**: protected paths are unchanged.

### Ownership exceptions

- **Q03:** `git diff ed7c8e1 071cabd -- poc-002-component-combat/tests/q01-toolchain.test.ts` shows only replay deferral replacement; sweep/probe deferrals retained.
- **Q04:** the corresponding `ed7c8e1..f00781a` diff replaces only sweep/probe deferrals and retains replay deferral. Final integration retains all three implemented dispatch checks; unrelated wrapper assertions survive.
- **Q08:** `git diff ed7c8e1 a644871 -- poc-002-component-combat/src/view/app.ts` is limited to run routing, shared resources and disposal/reset; direct-route validation remains.
- **Q09:** `git diff 19e5336 1b57b0f -- poc-002-component-combat/src/audio/index.ts` is exactly six inserted observer lines before the existing mute check; copies nonempty cue arrays and catches observer errors. Three new public-boundary observer tests pass. No Q06 test or Q05 browser harness edit.

## Exact verification commands and results

Commands ran from `/opt/dev/tehom-brainlab-p2-review` unless stated. No caller `POC002_*` or Chrome overrides. The first sandboxed install exited 1 (`Docker daemon inaccessible`); diagnostic `docker info` exited 1 with Docker-socket permission denied. The same bare commands then ran with sandbox escalation for Docker/Chrome access; automatic review did not reject an action. Host-mode scratch checks below are separate from bare verification.

| Exact command | Exit/result |
| --- | --- |
| `just poc-002-install` | 0 after socket escalation; pinned Bun 1.4.2, 43 packages installed. Initial sandbox attempt described above. |
| `just poc-002-typecheck` | 0; `tsc --noEmit`. |
| `just poc-002-test` | 0; 14 files, **279 tests passed**; all 24 parity records and existing hostile/size cases included. |
| `just poc-002-build` | 0; four prepared assets, 21 modules transformed. Informational >500 kB bundle warning. |
| `just poc-002-test-browser` | 0; fresh build and **940 assertions**, four harnesses: battle 302, keyboard gauntlet 321, run 311, smoke 6. |
| `just poc-002-replay poc-002-component-combat/fixtures/parity/seed-ugallu-warden.json` | 0; `commands=35 events=146 outcome=victory`. |
| `just poc-002-sweep --quick > /tmp/p2-review-sweep.txt` | 0; 154 cells, 115 wins, 3,648 openings. |
| `just poc-002-probe > /tmp/p2-review-probe.txt` | 0; 14 comparison cells, 9 wins, 3,648 openings. |
| `just poc-002-dev` | HTTP smoke passed at default 5273; intentional container stop yields process exit 143. |
| `curl --fail --silent --show-error --include http://localhost:5273/` | 0; HTTP 200, component-combat title and entry point. |
| `docker ps --filter publish=5273 --format '{{.ID}} {{.Names}} {{.Ports}}'` | 0; identified task container `21c2762f41f8`. |
| `docker stop -t 5 21c2762f41f8` | 0; stopped only that dev container. |
| `docker ps --filter publish=5273 --filter publish=4273 --format '{{.ID}} {{.Names}} {{.Ports}}'` | 0; no remaining containers on either test port. |
| `just --list` | 0; all ten POC 002 recipes present. |
| `bun /tmp/p2-review-checks.ts` | 0; five independent positive contracts, accepted area Strike/over-cap poison, and rejected export from oversized derived damage. |
| `bun /tmp/p2-review-overflow.ts` | 0; three factory-origin commands accepted, victory, raw `4294967294`, export rejection asserted. |
| `just poc-002-replay /tmp/p2-review-area-strike.json` | 0; **unexpected acceptance**, `commands=1 events=6 outcome=player` (F1). |
| `git diff --stat 1b57b0f 28d68ad` | 0; only Q09 evidence report differs. |
| `git diff --stat 19af724 28d68ad -- poc-001-linked-formation shared assets docs/CURRENT.md docs/TASK_LOGS.md` | 0; empty. |
| `git diff --exit-code 5dd1f79 1b57b0f -- poc-002-component-combat/tests/browser-battle.mjs` | 0; unchanged Q05 harness. |
| `git diff --exit-code b3fc648 1b57b0f -- poc-002-component-combat/tests/q06-audio.test.ts` | 0; unchanged Q06 tests. |
| `git diff ed7c8e1 28d68ad -- poc-002-component-combat/src/core/types.ts poc-002-component-combat/content/combat-content.v1.json` | 0; empty; frozen contracts/content unchanged. |
| `git diff --no-index poc-001-linked-formation/bun.lock poc-002-component-combat/bun.lock` | 1 as expected for different workspace name; resolved package graph identical. |
| `git diff --check` | 0. |
| `sha256sum docs/mailbox/poc-002-review/assignment-reviewer.md` | 0; `fbc30e805ef07d0a6d74d7d400450089f91cef11dfb96421f577ac1061f80b56`, unchanged. |

Independent positive checks used test-owned HP/caps, damage/costs and relevant rule amounts: (1) poison/E2 simultaneous wipe produces defeat after both losses, with no next declaration and a replayable result; (2) Hold redirect of Saw uses Ugallu's Clamp status and configured reduction, preserving the ally's Clamp; (3) Revoke removes declaration-time Ward immediately; (4) every legal command in the constructed Guard/Scribe state has pure preview/commit equivalence; (5) exhausted Salves beat invalid-target rejection and preserve state/events. These were public API checks in scratch, not additions to production tests.

Browser artifacts are disposable under `/tmp/poc-002-browser-07A12y/`. The real keyboard export replay printed `commands=46 events=231 outcome=victory`; actual audio observation recorded 43 requests covering all six cue kinds, with no preview requests. The runner stopped its named preview container. Existing battle harness completed every encounter (victories and defeats both legitimate). Sweep/probe flags were inspected as diagnostic evidence, not defects or balance verdicts.

## Durable reproduction for F1/F2

From the repository root, save this block as `/tmp/p2-review-reproduce.ts` and run `bun /tmp/p2-review-reproduce.ts`. It leaves only a disposable JSON file under `/tmp`. Assertions describe the observed failures so a successful run reproduces both findings.

```ts
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
const core = await import(process.cwd() + '/poc-002-component-combat/src/core/index.ts');
const raw = JSON.parse(readFileSync('poc-002-component-combat/content/combat-content.v1.json', 'utf8'));
const makeRecord = (content: any, initialState: any, commands: any[], finalState: any) =>
  core.recordOf({ content, initialState, commands, finalState, buildRevision: 'unknown' });

const content = core.loadContent(raw);
const initial = core.createFight(content, { encounterId: 'guard', party: ['ugallu', 'anzu'], start: 'fresh' });
initial.intents[0].target = { allBrood: true }; // Still a single-target Strike in embedded content.
const command = { kind: 'endPhase', expectedRevision: initial.revision };
const result = core.applyCommand(content, initial, command);
assert.equal(result.ok, true);
const forged = makeRecord(content, initial, [{ command, revision: result.state.revision, events: result.events }], result.state);
assert.equal(core.replayRecord(core.parseRecord(JSON.stringify(forged))).ok, true);
assert.equal(result.events.filter((e: any) => e.kind === 'brood-damaged').length, 2);
writeFileSync('/tmp/p2-review-forged-strike.json', JSON.stringify(forged));
console.log('F1: impossible area Strike accepted and hits both Brood');
const overCap = core.createFight(content, { encounterId: 'guard', party: ['ugallu'], start: 'fresh' });
overCap.enemies[0].poison = raw.actions.find((a: any) => a.id === 'envenom').effect.poisonCap + 1;
assert.equal(core.replayRecord(makeRecord(content, overCap, [], overCap)).ok, true);
console.log('F1: over-cap poison accepted');

const tuned = structuredClone(raw);
tuned.contentVersion = 'review-overflow';
tuned.actions.find((a: any) => a.id === 'rupture-venom').effect.multiplier = 2147483647;
const changed = core.loadContent(tuned);
const start = core.createFight(changed, { encounterId: 'guard', party: ['girtablilu'], start: 'fresh' });
let state = start;
const steps: any[] = [];
for (const payload of [
  { kind: 'act', actor: 'girtablilu', action: 'envenom', target: { enemy: start.enemies[0].id, part: 'weapon-arm' } },
  { kind: 'endPhase' },
  { kind: 'act', actor: 'girtablilu', action: 'rupture-venom', target: { enemy: start.enemies[0].id } },
]) {
  const command = { ...payload, expectedRevision: state.revision };
  const r = core.applyCommand(changed, state, command);
  assert.equal(r.ok, true);
  steps.push({ command, revision: r.state.revision, events: r.events }); state = r.state;
}
const damage = steps[2].events.find((e: any) => e.kind === 'part-damaged').damage;
assert.equal(damage.raw, 4294967294);
assert.equal(state.phase, 'victory');
assert.throws(() => makeRecord(changed, start, steps, state), /damage.raw/);
console.log('F2: real accepted run emits raw 4294967294 and cannot be exported');
```

## Limits and handoff validation

No exhaustive proof of every possible state/content combination, full width-200 sweep, human playtest, physical listening, C#/Godot verification, or balance assessment was performed. The five independent positive checks sample high-risk behavior; existing named tests and inspected code supply the remaining rule evidence. Found defects are confined to the concrete reproductions above; broader validation completeness is not claimed.

Copied `.agents/skills/ruach-handoff` to `/tmp/p2-review-ruach-handoff`; `bun install --frozen-lockfile` in that copy exited 0 (six packages). The initial copy attempt used a relative source from `/tmp` and exited 1 without copying anything; the absolute-path retry succeeded. Q10's local Markdown links and anchors were checked with a scratch Python `pathlib`/`re` checker: no missing target or anchor. The report's self-contained reproduction and mechanical handoff validation results are recorded below before commit.

Final executed report checks:

- `bun /tmp/p2-review-reproduce.ts`: exit 0; reproduced accepted area Strike, accepted over-cap poison, and the factory-origin unexportable run. This script was extracted verbatim from the durable block above.
- `bun /tmp/p2-review-ruach-handoff/scripts/validate.ts docs/mailbox/poc-002-review/reviewer.md --repo .`: exit 0; `ok: true`, no diagnostics; baseline, reviewed, evidence and tested revisions resolve.
- `git diff --check`: exit 0. Final staged whitespace/scope checks are performed before the report commit; only this report and the unchanged assignment are authorized for that commit.
- `git diff --cached --check`: exit 0; `git diff --cached --name-only` lists exactly `docs/mailbox/poc-002-review/assignment-reviewer.md` and `docs/mailbox/poc-002-review/reviewer.md`. Assignment checksum matches the pre-review value above.
