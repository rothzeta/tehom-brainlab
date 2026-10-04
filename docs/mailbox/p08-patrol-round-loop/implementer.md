task: P08-impl
status: complete
outcome: P08.C1–C4, Amendment TR and acceptance criteria 1–7 implemented and verified headlessly; independent review pending.
role: implementer
source_baseline: 9976e9a22631e5af913fe80af87f8c9e49044def
candidate_revision: 864e3d0b1b5bba68495bcdb2141f1892c9d75b2e
tested_revision: 864e3d0b1b5bba68495bcdb2141f1892c9d75b2e
artifacts:
  - docs/mailbox/p08-patrol-round-loop/assignment-implementer.md
  - docs/mailbox/p08-patrol-round-loop/implementer.md
  - docs/mailbox/p08-patrol-round-loop/traces.json
  - poc-001-linked-formation/src/content/patrol.ts
  - poc-001-linked-formation/src/core/rounds.ts
  - poc-001-linked-formation/src/core/commands.ts
  - poc-001-linked-formation/src/core/transition.ts
  - poc-001-linked-formation/tests/patrol.test.ts
  - poc-001-linked-formation/README.md
verification:
  - "just poc-001-install: exit 0, pinned Docker Bun 1.4.2, 43 packages installed."
  - "just poc-001-test tests/patrol.test.ts tests/abilities.test.ts tests/damage.test.ts: exit 0 at candidate, 183 tests / 1869 instrumented assertions; P08 48 tests / 492 assertions."
  - "just poc-001-test: exit 0 at candidate, 413 tests across nine files / 4293 instrumented assertions, plus uninstrumented view/assets/smoke assertions."
  - "just poc-001-typecheck: exit 0 at candidate."
  - "just poc-001-build: exit 0 at candidate, nine asset files, 22 modules; existing large Phaser bundle warning."
  - "git diff --check and git diff --check 9976e9a..HEAD: exit 0 at candidate."
  - "Existing-test preservation comparison against BASE: exit 0; no existing test changed."
  - "Pinned Docker trace generation: exit 0 at candidate, all three ordinary presets reached terminal outcome, plus healthy defeat; four traces / 48 commands, input preservation and serialized command replay checked."
  - "Independent stored-transcript replay: exit 0 at candidate, all 48 results/events and four final snapshots matched; deeply frozen inputs preserved."
  - "Handoff mechanical validator: exit 0, ok true, no diagnostics; BASE/candidate/tested revisions resolved."
review: not-run
discoveries:
  - "PatrolState extends CombatState within P08 content; existing GameState/CombatState and non-patrol endPhase behavior remain compatible."
  - "An additive RoundEvent union and PatrolState dispatcher overload are the only extra type integration; no P05/P06/P07 rule implementation was changed."
  - "Ordinary healthy and wounded-Girtablilu attack traces win; the executed wounded-Ugallu trace loses. This establishes terminal execution, not that wounded Ugallu is unwinnable."
  - "Protected status documents and earlier prototype README passages need Coordinator reconciliation after acceptance; proposals below."
blockers: []

Author: P08 Implementer. Date: 2026-10-04 UTC. Worktree `/opt/dev/tehom-brainlab-p08`, branch `p08-patrol-round-loop`. BASE matched the starting revision. Authority: unchanged [assignment](assignment-implementer.md), [P08 plan and Amendment TR](../../plans/2026-10-02-dc6612ec-poc-001-patrol-round-loop.md), [provisional-default ownership](../../plans/README.md#ownership-of-provisional-defaults), [ADR-0006](../../adr/0006-contract-invariants-and-black-box-testing.md), [testing skill](../../../.agents/skills/ruach-testing/SKILL.md), and [handoff protocol](../../../.agents/skills/ruach-handoff/SKILL.md). P06/P07 source and the assigned [P06 handoff](../p06-damage-and-fallen/implementer.md), [P07 handoff](../p07-brood-abilities/implementer.md) and [P07 fix evidence](../p07-brood-abilities/fix.md) were read before editing.

The technical candidate was committed before final verification. This report, the unchanged assignment and generated transcripts belong to a later evidence-only commit; its creating SHA is returned in the terminal handoff. No technical change followed final checks. No merge, push, rebase, branch/worktree cleanup, browser check, human playtest, independent review or acceptance occurred.

## Changes and checkpoints

| Changed file | Result |
| --- | --- |
| [content/patrol.ts](../../../poc-001-linked-formation/src/content/patrol.ts) | C1: three independent factories, inspectable frozen defaults, serializable copied rules, view-only centre anchor, no enemy cells. |
| [core/rounds.ts](../../../poc-001-linked-formation/src/core/rounds.ts) | C2/C3: deterministic locked announcement, exact ratio/tie selection, atomic end phase, ordered P05/P06 impact settlement, expiry, terminal stopping and fresh next-round budgets. |
| [core/transition.ts](../../../poc-001-linked-formation/src/core/transition.ts) | Minimal patrol-only `endPhase` registration and additive overload; basic lab/non-patrol combat keep unsupported behavior. |
| [core/commands.ts](../../../poc-001-linked-formation/src/core/commands.ts) | Necessary additive `RoundEvent` member for typed ordered announcements/phase events. No existing variant/error changed. |
| [tests/patrol.test.ts](../../../poc-001-linked-formation/tests/patrol.test.ts) | C4: 48 public-boundary tests, 492 executed assertions; explicit arithmetic fixtures, executed win/defeat fixtures, ordinary three-preset terminal/replay checks. |
| [README P08 section](../../../poc-001-linked-formation/README.md#patrol-round-loop-p08) | Factory/command/event/rule contracts, provisional tuning, Amendment TR and compatibility. |

No existing test was edited, including the optional `endPhase` exception. No generated tracked agent source, protected document, plan/index, ADR, brief, selector, damage/lifecycle math, ability implementation, UI, package or lockfile changed. `CombatState` itself needed no modification: P08 owns its extension. Disposable generation/replay scripts remain in `/tmp/p08-patrol`; they are not repository artifacts.

## Explicit provisional-default resolutions

All P08-owned choices adopt the plan's proposed `patrol-v1` behavior, with the accepted TR replacement for enemy layout. They are reproducible experiment inputs, not balanced gameplay conclusions.

| Choice / value | Source | Reason |
| --- | --- | --- |
| Brood max/start HP: Ugallu18/18, Girtablilu14/14, Pazuzu14/14; enemies Warder12/12, Censer10/10, Harrier13/13 | P08 Fixture table | Provides the bounded ordinary encounter; actual healthy execution demonstrated a win without changing these proposals. Values live once in `PATROL_HP`. |
| Wounded Ugallu7/18 or Girtablilu5/14; only designated starting HP differs | P08 Fixture, brief's required wounded experiments | Isolates the specified starting disadvantage. Maximum HP and the rest of content remain shared; announcement changes follow the ratio rule. `WOUNDED_HP` owns values. |
| Announcement/resolution order: Warder, Censer, Harrier | P08 Proposed implementation decisions | Explicit `PATROL_ORDER` avoids dependence on entity/declaration iteration and makes sequential deaths/cancellation reproducible. |
| Warder: first living `[ugallu,girtablilu,pazuzu]`; Censer: round-indexed `[girtablilu,pazuzu,ugallu]`, scan forward; Harrier: least HP/max HP, roster-order ties | P08 Proposed implementation decisions | Deterministic marks include fallen-candidate handling. BigInt cross multiplication avoids overflow while snapshots remain plain numeric JSON. Marks lock until cancellation/next announcement. |
| Cadence: start round1/player/Compact0/revision0; explicit `endPhase` may forfeit; hit-by-hit lifecycle; expiry; nonterminal round+1 with `actedIds=[]`, `maneuverUsed=false`, then full announcement | P08 Required contracts and proposed implementation decisions | Preserves any activation order and the shared maneuver while forbidding banking or automatic input-phase advance. Terminal states keep round/budgets and stop attacks. One command owns one public revision. |
| Enemy raw hits: Warder3, Censer3, Harrier4 or isolated7 | P08 Fixture | Uses proposed encounter pressure without duplicating P06 damage. `PatrolRules` stores explicit experimental values. |
| Censer radius2; Harrier Close threshold2; mitigation directional2/Shelter2 | Inherited P05 `SPLASH_RADIUS`, P02 `CLOSE_THRESHOLD`, P06 `DEFAULT_DAMAGE_RULES` | P08 references owner exports. P05 supplies impact recipients/isolation; P06 supplies all damage/status behavior. No competing geometric or mitigation constants. |
| Warder facing0 persists, protects Censer; Warder rotatable, other enemies non-rotatable | P08 Fixture and persisted-facing decision; P07 capability seam | Crosswind changes the patrol's directional protector. Other patrol marks have no directional behavior. HP/capability/facing remain ordinary selector data. |
| No enemy cell; shared `(0,0)` view anchor only | Accepted user decision in Amendment TR | Avoids overlap with Compact Pazuzu and leaves P10 cluster offsets/layout experiment open. No selector reads the anchor. |

## Numbered acceptance evidence

References are test titles in `tests/patrol.test.ts` executed at the candidate. Tests with exact combat arithmetic supply independent `PatrolRules` and HP fixtures; the stored healthy regressions also supply independent `AbilityRules`. Default factories are tested by documented content relationships and fresh-state properties, rather than hardcoding default HP/damage expectations. Ordinary smoke traces permit victory or defeat as tuning evolves.

| Criterion | Observable evidence |
| --- | --- |
| 1 | `independent ... factories expose content HP and fresh budgets` for all three presets checks max/start HP against exported content, statuses/phase/formation/budgets and independent entity/rule/declaration objects. `named factories differ only...` compares designated HP and consequent typed mark; Crosswind test also checks fresh facing after an attempt. All enemy snapshots omit board cell/position. |
| 2 | Three `announces all living enemies before input` cases expose first marks. Six round/cycle cases test shuffled Brood/enemy arrays. `fallen candidates...` uses explicit 5/10 and 3/6 ratio ties, an unequal 2/6 ratio, and forward scanning; safe-integer-boundary test detects imprecise multiplication. Ordinary first marks are recorded below. |
| 3 | Compact/Spread impact tests move via `applyCommand` and retain locked marks; explicit HP30/rules produce Compact `[20,27,27]`, Spread `[20,27,30]`, with Censer recipients all three versus Girtablilu only, and Harrier raw4 versus7. `a manoeuvre after all three activations...` covers arbitrary activation order and after-actions movement. `Compact Harrier uses isolation after earlier attacks...` verifies isolation changes inside enemy resolution when only Pazuzu survives. |
| 4 | Parameterized `defeating ... cancels only its pending action` executes Gale against HP1 Warder/Censer/Harrier, checks immediate P06 source cancellation and surviving action membership at resolution and next announcement. Warder case additionally checks immediate protection removal through P05 `selectProtection`. |
| 5 | Compact/Spread cases verify exact source order and same public revision on all hits. `each hit settles death...` checks Fallen event before Censer action and cancelled Harrier mark with no retarget. Terminal tests verify defeat stops after first action and victory on last player hit prevents enemy phase. `unconsumed Shelter expires before announcement...` uses zero enemy damage, checks expiry order and facing persistence. Positive hit test checks actual P06 consumption. Next-round cases verify reset budgets; all-dead precedence remains covered by unchanged P06 tests. |
| 6 | Three `unused actions...` cases cover zero/partial/all spent actions and used/unused maneuver. Each allows one fresh action and maneuver, then rejects repeats. `stale repeated endPhase...` checks atomic stale rejection and six unique attack identities across two rounds. Late Harrier identity collision verifies rollback of earlier provisional hits and empty rejection events. Wrong-phase/stale precedence and invalid rules/declarations are covered separately. |
| 7 | `executed healthy win/defeat trace...` retains actual discovery-run commands, exact explicitly owned initial HP/rules and expected terminal HP/phase/round/revision/budgets, with identical serialized-run events. [traces.json](traces.json) retains full exact initial snapshots, every actual command/result/event and full final snapshots for a healthy win, healthy defeat and both wounded ordinary runs. Independent frozen stored replay matched all 48 commands and four final states. |

## Executed ordinary patrol transcripts

[traces.json](traces.json) is generated JSON, never a hand-authored transcript. Its `tested_revision` is the committed candidate, boundary `applyCommand`, content version `patrol-v1`. Four records each contain preset/strategy, full `initial`, actual `ability_rules`, all `steps` (`command` plus complete actual `result`) and full `final`. Transcript SHA-256: `4395c5a17655336c75f30b3fae091e7b64d1764d2cde60ae0afd5348a02aa3de`.

The generator creates each production preset without overrides. Its attack strategy activates living Ugallu/Claw, Girtablilu/Sting and Pazuzu/Gale in that order, each against the first living Warder/Censer/Harrier, then ends the phase if combat continues. The forfeit strategy only ends phases. A round30 bound guards the script; every recorded run terminated earlier. Each actual command was also compared with execution on serialized copies of the same input, and original-input JSON was checked unchanged. After final generation, an independent script read the stored artifact, froze every input/command and compared production outputs with all stored outputs and final states.

| Preset / strategy | Outcome, round, revision / command count | Final Brood HP `[U,G,P]` | Final enemy HP `[W,C,H]` |
| --- | --- | --- | --- |
| Healthy / attack | Victory, round4, revision14 / 14 commands | `[0,8,8]` | `[0,0,0]` |
| Wounded Ugallu / attack | Defeat, round5, revision14 / 14 commands | `[0,0,0]` | `[0,0,7]` |
| Wounded Girtablilu / attack | Victory, round6, revision16 / 16 commands | `[0,0,1]` | `[0,0,0]` |
| Healthy / forfeit | Defeat, round4, revision4 / 4 commands | `[0,0,0]` | `[12,10,13]` |

Actual announced targets below are extracted by independent replay. `—` means defeated source; columns are Warder / Censer / Harrier.

| Run | Round-by-round targets |
| --- | --- |
| Healthy attack | R1 U/G/U; R2 U/P/U; R3 —/U/U; R4 —/—/G |
| Wounded Ugallu attack | R1 U/G/U; R2 G/P/G; R3 —/G/G; R4 —/—/P; R5 —/—/P |
| Wounded Girtablilu attack | R1 U/G/G; R2 U/P/U; R3 —/U/U; R4 —/—/U; R5 —/—/P; R6 —/—/P |
| Healthy forfeit | R1 U/G/U; R2 U/P/U; R3 G/G/G; R4 P/P/P |

These are actual bounded headless outcomes, not evidence of tactical interest, balance, wounded-Ugallu unwinnability, or browser/human playtest success.

## Exact verification

All application checks used default Docker mode and pinned Bun1.4.2. Docker, linked-worktree Git writes and ignored validator dependency installation used sandbox escalation. No automatic approval rejection occurred. Required final checks ran on the committed technical candidate; only evidence followed.

| Exact command | Result |
| --- | --- |
| `just poc-001-install` | Exit0 before implementation, 43 packages. |
| `just poc-001-test tests/patrol.test.ts tests/abilities.test.ts tests/damage.test.ts` | Exit0 on candidate; 183 tests, three files, 1869 instrumented assertions: P08 48/492, P07 87/1072, P06 48/305. |
| `just poc-001-test` | Exit0 on candidate; 413 tests, nine files: patrol48, abilities87, damage48, intents77, commands37, formation92, view19, assets3, smoke2. Instrumented counts sum4293; view/assets/smoke do not publish counts. |
| `just poc-001-typecheck` | Exit0 on candidate, source/tests/configuration. |
| `just poc-001-build` | Exit0 on candidate; nine asset files prepared, 22 transformed modules. Existing >500kB bundle warning remains. |
| `git diff --check` | Exit0 on candidate. |
| `git diff --check 9976e9a..HEAD` | Exit0 on candidate. |
| `git diff --exit-code 9976e9a HEAD -- poc-001-linked-formation/tests ':!poc-001-linked-formation/tests/patrol.test.ts'` | Exit0 on candidate; all eight existing test files unchanged. |
| `sha256sum docs/mailbox/p08-patrol-round-loop/assignment-implementer.md` | Exit0, unchanged `91260103aa68dd4db266fb9bd1cb85091f5ae308b3ca94cf11fa8d8cc79ef4ba`, matching initial read. |
| `/home/metatron/.bun/bin/bun install --frozen-lockfile` in `.agents/skills/ruach-handoff` | Exit0 with escalation; six pinned validator dependencies in ignored `node_modules`. |
| `sha256sum docs/mailbox/p08-patrol-round-loop/traces.json` | Exit0; hash above. |

Before committing, the first focused run exited1: 177 passed and one new parameterized test failed because Vitest unpacked an empty array rather than supplying an action-list argument. The accompanying typecheck exited1 and identified the same test-data error. Replacing rows with `{actedIds}` objects fixed it without changing production or existing tests. The next focused run/typecheck and all committed-candidate checks passed. Validator dependency installation initially exited1 under the sandbox (`EROFS` in its generated skill directory); the authorized ignored dependency install with escalation succeeded. Neither setup issue remains unresolved.

Exact final transcript generation command (exit0):

```sh
docker run --rm --init --user "$(id -u):$(id -g)" --env HOME=/tmp --env P08_TESTED_REVISION=864e3d0b1b5bba68495bcdb2141f1892c9d75b2e --volume /opt/dev/tehom-brainlab-p08/poc-001-linked-formation:/app:ro --volume /tmp/p08-patrol:/probe --volume /opt/dev/tehom-brainlab-p08/docs/mailbox/p08-patrol-round-loop:/evidence --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 bun /probe/traces.ts
```

Exact independent stored replay command (exit0; four terminal traces, 48 commands matched, frozen inputs preserved):

```sh
docker run --rm --init --user "$(id -u):$(id -g)" --env HOME=/tmp --env P08_TESTED_REVISION=864e3d0b1b5bba68495bcdb2141f1892c9d75b2e --volume /opt/dev/tehom-brainlab-p08/poc-001-linked-formation:/app:ro --volume /tmp/p08-patrol:/probe:ro --volume /opt/dev/tehom-brainlab-p08/docs/mailbox/p08-patrol-round-loop:/evidence:ro --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 bun /probe/replay.ts
```

The independent replay's essential reproducible assertions were:

```ts
import { strict as assert } from 'node:assert';
import { applyCommand } from '/app/src/core/transition.ts';
import { createPatrol } from '/app/src/content/patrol.ts';
const artifact = await Bun.file('/evidence/traces.json').json();
assert.equal(artifact.tested_revision, process.env.P08_TESTED_REVISION);
for (const trace of artifact.traces) {
  assert.deepEqual(trace.initial, createPatrol(trace.preset));
  let state = trace.initial; // Actual replay also recursively froze every snapshot/command.
  for (const step of trace.steps) {
    const before = JSON.stringify(state);
    const result = applyCommand(state, step.command);
    assert.deepEqual(result, step.result);
    assert.equal(JSON.stringify(state), before);
    assert.equal(result.state.revision, state.revision + 1);
    state = result.state;
  }
  assert.deepEqual(state, trace.final);
  assert.ok(['victory', 'defeat'].includes(state.phase));
}
```

`PATH=/home/metatron/.bun/bin:$PATH bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p08-patrol-round-loop/implementer.md --repo /opt/dev/tehom-brainlab-p08` exited0 with `ok:true`, empty diagnostics and all three revision fields resolved. The validator was also run successfully via the absolute Bun executable before recording this result.

## Discoveries and proposed Coordinator follow-up

The public command uses P05 impact selectors and P06's existing trusted lifecycle/expiry operations. Internal P06 settlements all receive the public input revision, then their intermediate snapshot revision is normalized until final accounting assigns input+1. Thus each attack event identifies the one public transition, and a later error can return the untouched original snapshot. No callback, target-selection geometry, damage calculation, ability logic or status operation was duplicated. Revisions remain monotonic across rounds; the identity ledger retains distinct per-round attacks.

P08 adds a trusted state extension and scheduling API, not a serialized-state parser. Existing valid-snapshot assumptions from P06/P07 remain. `declaredIntentions` is authoritative; legacy `intentions` string labels are refreshed at announcement and may retain cancelled IDs within a player/terminal phase, as prior P06 behavior does. P10 should use typed declarations/events and render the centre anchor as view-only data, including its own cluster offsets.

Proposed protected-document corrections after acceptance: update P08 plan/amendment draft/unassigned status and checkpoints from this evidence; update the plans index, CURRENT and TASK_LOGS with the accepted implementation and exact candidate/checks. Earlier README introductory/P03/P06/P07 passages still describe combat/`endPhase` as pending or unsupported; the assigned new P08 public-contract section explicitly supersedes them without editing unrelated historical passages. No protected-document corrections were applied.

No implementation or verification blocker remains. Review, acceptance, main-checkout integration and cleanup remain Coordinator work.
