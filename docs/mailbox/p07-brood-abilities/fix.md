task: P07-fix
status: complete
outcome: R1 corrected and verified with alternate-default and missing-mitigation probes; R2 supplied with six executed serialized traces.
role: implementer
source_baseline: 20eb00c9f2b963837eeaf5e7da8c98a7ad090ea1
fixed_revision: 90e96d301bcbe7886755425b489123d87c455776
tested_revision: 90e96d301bcbe7886755425b489123d87c455776
findings_addressed:
  - "R1: exact Shelter impact assertions now supply explicit test-owned DamageRules; dispatcher coverage uses tuning-independent outcome invariants."
  - "R2: six actual serialized command input/result traces recorded at the fixed revision with rules version p07-v1."
artifacts:
  - docs/mailbox/p07-brood-abilities/assignment-fix.md
  - docs/mailbox/p07-brood-abilities/fix.md
  - docs/mailbox/p07-brood-abilities/traces.json
  - poc-001-linked-formation/tests/abilities.test.ts
verification:
  - "just poc-001-test tests/abilities.test.ts: exit 0 at fixed revision; 87 tests / 1072 assertions."
  - "just poc-001-test: exit 0 at fixed revision; 365 tests in eight files."
  - "just poc-001-typecheck: exit 0 at fixed revision."
  - "just poc-001-build: exit 0 at fixed revision; existing bundle-size warning."
  - "git diff --check and git diff --check 20eb00c..HEAD: exit 0 at fixed revision."
  - "Other tests and production source preservation checks: exit 0; exact commands below."
  - "Pre-fix one-point default probe: exit 1 as expected; two exact HP assertions failed, one passed, 81 skipped."
  - "Fixed alternate one-point default probe: exit 0; all 87 P07 tests / 1072 assertions passed."
  - "Fixed zero-mitigation mutation probe: expected exit 1; two dispatcher invariants failed, four cases passed, 81 skipped. All three explicit-impact cases passed."
  - "Trace generation and independent stored-artifact replay: exit 0 each; six successful actual results, frozen inputs preserved and serialized replays matched."
  - "Handoff validator: exit 0; ok true, no diagnostics, all three revision fields resolve. Exact command below."
review: not-run
discoveries:
  - "R1 required only test changes; no production redesign or tuning change was needed."
  - "Dispatcher invariants tolerate positive default mitigation changes while detecting missing mitigation and preserving Close-at-impact, batching, consumption and accounting coverage."
blockers: []

Author: P07 Implementer. Date: 2026-10-04 UTC. Worktree `/opt/dev/tehom-brainlab-p07`, branch `p07-brood-abilities`. Governing [fix assignment](assignment-fix.md), [review findings](reviewer.md), [ADR-0006](../../adr/0006-contract-invariants-and-black-box-testing.md), [ruach-testing](../../../.agents/skills/ruach-testing/SKILL.md) and [handoff protocol](../../../.agents/skills/ruach-handoff/SKILL.md).

The fixed technical commit changes only `tests/abilities.test.ts`. This report, generated traces and unchanged fix assignment are included in a later evidence-only commit; its SHA is returned in the terminal handoff. No production code, other test, protected document, Reviewer report or earlier Implementer report was changed. No merge, push, rebase, browser check or human playtest occurred. Re-review and acceptance remain with the Reviewer/Coordinator.

## R1 resolution and observable coverage

The two reviewed tests now settle later damage with public `applyAttack(state,attack,rules.damageRules)`. The existing test-owned input explicitly supplies `shelterReduction:2`, alongside directional reduction 2 and Close threshold 2. Exact HP expectations remain unchanged: the Close raw-five hit leaves HP7, expansion leaves HP5, and the same-blast fixture leaves Ugallu HP0 / sheltered Girtablilu HP9 / Pazuzu HP7. These tests still assert consumption, active eligibility, accounting and expiry. Supplying rules at installation alone cannot configure impact damage; the correction supplies them at the actual hit boundary.

Three new `AC3 dispatcher` cases preserve `applyCommand` coverage for later impacts. They compare sheltered and unsheltered versions of the same frozen snapshot and attack: a Close ally must take less damage, an expanded ally must take equal damage, and the blast that fells the guardian must still mitigate the ally. The assertions do not require a particular positive default reduction. They also check consumption events/eligibility, removal of used Shelter, one impact revision, retained actor spend and maneuver budget, and unchanged inputs. These protect meaningful behavior rather than replacing exact assertions with success-only checks.

R1 was reproduced before editing, then verified after the technical commit. The isolated setup forwards to the unchanged production settlement and preserves explicitly supplied tuning:

```ts
vi.mock('/app/src/core/damage.ts', async (importOriginal) => {
  const actual = await importOriginal();
  const damageRules = { ...actual.DEFAULT_DAMAGE_RULES,
    shelterReduction: Number(process.env.P07_PROBE_REDUCTION ?? 1) };
  return {
    ...actual,
    DEFAULT_DAMAGE_RULES: damageRules,
    applyAttack: (state, attack, rules = damageRules) => actual.applyAttack(state, attack, rules),
  };
});
```

The temporary `tuning.config.mts` used root `/app`, cache directory `/tmp/p07-fix-vite-cache`, Node environment, `globals:true`, `include:['tests/abilities.test.ts']`, and setup `/probe/tuning.setup.ts`. Temporary scripts/configuration lived only in `/tmp/p07-fix-probes.Nkn0gS`; the application mount was read-only. No default/source files were changed by these probes.

| Probe | Observed result |
| --- | --- |
| Baseline, default reduction 1, original three impact cases | Exit1: two failures, one pass, 81 skipped, 14 assertions. Close received6/expected7; same-blast received8/expected9, matching R1. |
| Fixed revision, default reduction 1, all P07 tests | Exit0: 87 tests / 1,072 assertions pass, including both corrected exact tests and new dispatcher cases. |
| Fixed revision, default reduction 0, six exact/dispatcher cases | Intentional exit1: two failures, four passes, 81 skipped, 41 assertions. The Close dispatcher case detects HP5 is not greater than HP5; the same-blast dispatcher case detects HP7 is not greater than HP7. All three explicitly tuned impact cases and the expanded dispatcher case pass. |

The zero-default probe deliberately disables the default Shelter benefit while leaving eligibility/consumption and explicit rules intact. It verifies detection of missing mitigation; it is not an unresolved candidate failure. Existing exact expansion/consumption assertions remain, so the correction does not remove their detection of incorrect eligibility or consumption.

## R2 executed traces

[traces.json](traces.json) contains exactly six records: Claw, Shelter, Sting, Impale, Gale and Crosswind. Every record includes the full serialized input state, command, actual result state and actual event list. Metadata identifies tested revision `90e96d301bcbe7886755425b489123d87c455776`, rules version `p07-v1`, fixture version `p07-fix-traces-v1`, public boundary `applyCommand`, and the actual default ability/damage rules used.

A disposable Bun script imported the production `createInitialState`, `applyCommand`, `BROOD_RULES_VERSION` and `DEFAULT_ABILITY_RULES`. It constructed independent frozen unit fixtures (Brood HP10/max10, three enemies HP20/max20, facing-zero Warder protecting Censer), then executed and JSON-serialized each actual result. Impale uses Spread0; other abilities use Compact0. Shelter targets Girtablilu; attacks target Censer; Crosswind turns Warder anticlockwise with an associated turnable fixed area and a Girtablilu mark. No result was written by hand. The script asserted success, unchanged frozen inputs and identical replay after serialized input round-trip for all six cases before writing the artifact.

Generation reported six accepted results, six preserved inputs and six matching replays. A second invocation read the stored artifact and replayed each stored input through production `applyCommand`, comparing the result with `assert.deepEqual`; all six matched. The artifact SHA-256 is `87b0d1514ad6a92767e21c23c26580e4f44bdc5c9f9c75eac0867d6bc3ad5512`.

The stored-artifact replay script was:

```ts
import { strict as assert } from 'node:assert';
import { applyCommand } from '/app/src/core/transition.ts';
const artifact = await Bun.file('/evidence/traces.json').json();
assert.equal(artifact.tested_revision, process.env.P07_TESTED_REVISION);
assert.equal(artifact.traces.length, 6);
assert.equal(new Set(artifact.traces.map((trace) => trace.ability_id)).size, 6);
for (const trace of artifact.traces) {
  assert.deepEqual(applyCommand(trace.input.state, trace.input.command), trace.result);
}
```

## Exact verification

Required application checks ran on the committed technical fix in default Docker mode, with the pinned Bun 1.4.2 image. Dependencies from the initial implementation were already installed; no install was needed. Docker and linked-worktree Git writes used escalation; no approval rejection occurred. Source/tests did not change after the fixed commit.

| Exact command | Result |
| --- | --- |
| `just poc-001-test tests/abilities.test.ts` | Exit0, 87 tests / 1,072 assertions. |
| `just poc-001-test` | Exit0, 365 tests / eight files: 87 abilities, 92 formation, 37 commands, 77 intents, 48 damage, 19 view, 3 assets, 2 smoke. Instrumented counters sum to 3,801; view/assets/smoke do not report assertion counts. |
| `just poc-001-typecheck` | Exit0, source/tests/configuration typecheck. |
| `just poc-001-build` | Exit0, nine prepared assets/attribution files and 20 transformed modules; existing >500 kB bundle warning. |
| `git diff --check` | Exit0 at fixed revision. |
| `git diff --check 20eb00c..HEAD` | Exit0 at fixed revision. |
| `git diff --exit-code 20eb00c HEAD -- poc-001-linked-formation/tests ':!poc-001-linked-formation/tests/abilities.test.ts'` | Exit0, every other test unedited. |
| `git diff --exit-code 20eb00c HEAD -- poc-001-linked-formation/src` | Exit0, production source unedited. |
| `sha256sum docs/mailbox/p07-brood-abilities/assignment-fix.md` | Exit0; unchanged hash `fd52f48027da3f466ae13fbf9ba1eebe3ef3e5a7d997727ac4d3bc04f26a6900`, matching the initial read. |
| `PATH=/home/metatron/.bun/bin:$PATH bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p07-brood-abilities/fix.md --repo /opt/dev/tehom-brainlab-p07` | Exit0; `ok:true`, empty diagnostics, source/fixed/tested revisions resolved. |

Exact successful reproduction command before editing (expected test failure):

```sh
docker run --rm --init --user "$(id -u):$(id -g)" --env HOME=/tmp --env BUN_INSTALL_CACHE_DIR=/tmp/bun-cache --env P07_PROBE_REDUCTION=1 --volume /opt/dev/tehom-brainlab-p07/poc-001-linked-formation:/app:ro --volume /tmp/p07-fix-probes.Nkn0gS:/probe --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 bun run --bun test:unit --config /probe/tuning.config.mts tests/abilities.test.ts -t 'AC3: Shelter checks Close|AC3: installed Shelter'
```

An earlier invocation used `/probe:ro` and exited1 before tests because Vite could not write its temporary configuration bundle. The retry above changed only that disposable mount to writable and reproduced R1.

Exact fixed alternate-default command (exit0):

```sh
docker run --rm --init --user "$(id -u):$(id -g)" --env HOME=/tmp --env BUN_INSTALL_CACHE_DIR=/tmp/bun-cache --env P07_PROBE_REDUCTION=1 --volume /opt/dev/tehom-brainlab-p07/poc-001-linked-formation:/app:ro --volume /tmp/p07-fix-probes.Nkn0gS:/probe --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 bun run --bun test:unit --config /probe/tuning.config.mts tests/abilities.test.ts --reporter=dot
```

Exact missing-mitigation mutation command (expected exit1):

```sh
docker run --rm --init --user "$(id -u):$(id -g)" --env HOME=/tmp --env BUN_INSTALL_CACHE_DIR=/tmp/bun-cache --env P07_PROBE_REDUCTION=0 --volume /opt/dev/tehom-brainlab-p07/poc-001-linked-formation:/app:ro --volume /tmp/p07-fix-probes.Nkn0gS:/probe --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 bun run --bun test:unit --config /probe/tuning.config.mts tests/abilities.test.ts --reporter=dot -t 'AC3: Shelter checks Close|AC3: installed Shelter|AC3 dispatcher'
```

Exact trace generation command (exit0):

```sh
docker run --rm --init --user "$(id -u):$(id -g)" --env HOME=/tmp --env BUN_INSTALL_CACHE_DIR=/tmp/bun-cache --env P07_TESTED_REVISION=90e96d301bcbe7886755425b489123d87c455776 --volume /opt/dev/tehom-brainlab-p07/poc-001-linked-formation:/app:ro --volume /tmp/p07-fix-probes.Nkn0gS:/probe:ro --volume /opt/dev/tehom-brainlab-p07/docs/mailbox/p07-brood-abilities:/evidence --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 bun /probe/generate-traces.ts
```

Exact stored-artifact replay command (exit0):

```sh
docker run --rm --init --user "$(id -u):$(id -g)" --env HOME=/tmp --env BUN_INSTALL_CACHE_DIR=/tmp/bun-cache --env P07_TESTED_REVISION=90e96d301bcbe7886755425b489123d87c455776 --volume /opt/dev/tehom-brainlab-p07/poc-001-linked-formation:/app:ro --volume /tmp/p07-fix-probes.Nkn0gS:/probe:ro --volume /opt/dev/tehom-brainlab-p07/docs/mailbox/p07-brood-abilities:/evidence:ro --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 bun /probe/replay-traces.ts
```

No required check remains unrun. Browser behavior, human playtesting and independent re-review were not performed or claimed. There are no implementation blockers.
