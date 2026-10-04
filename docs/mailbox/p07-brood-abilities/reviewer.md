task: P07-review
status: complete
outcome: Approve at 90e96d3; R1 and R2 resolved, no remaining blocking or optional findings.
role: reviewer
review_task: P07-rereview
source_baseline: 08dc6308649f124ee4a9d5897bcb8d92438dacec
candidate_revision: 90e96d301bcbe7886755425b489123d87c455776
reviewed_revision: 90e96d301bcbe7886755425b489123d87c455776
tested_revision: 90e96d301bcbe7886755425b489123d87c455776
evidence_revision: 9c39c01387980e21c4d6785a9af35bdab0e55400
original_reviewed_revision: 42deffc5aadeb5c1d8b77a2119a16aa6a408995c
original_tested_revision: 1b251bf1b1e5d38485874eb2fed5c1d5aae91f31
artifacts:
  - docs/mailbox/p07-brood-abilities/assignment-reviewer.md
  - docs/mailbox/p07-brood-abilities/assignment-rereview.md
  - docs/mailbox/p07-brood-abilities/reviewer.md
  - docs/mailbox/p07-brood-abilities/fix.md
  - docs/mailbox/p07-brood-abilities/traces.json
verification:
  - "Exact HEAD during application verification: 90e96d301bcbe7886755425b489123d87c455776; temporarily detached, then returned to p07-brood-abilities."
  - "just poc-001-test: Docker, exit 0, 365 tests in eight files; 87 P07 tests / 1072 assertions."
  - "just poc-001-typecheck and just poc-001-build: Docker, exit 0 each; existing build bundle-size warning."
  - "Original one-point default-override probe: Docker, exit 0, all 87 P07 tests / 1072 assertions."
  - "Missing-mitigation, eligibility and consumption mutation probes: intentional exit 1 each; detect the respective failures, details below."
  - "Six stored traces independently executed with frozen inputs: Docker, exit 0; all results, metadata and rules match."
  - "Required whitespace and existing-test preservation checks: exit 0 each; production source preservation also exit 0."
  - "Handoff validator: exit 0, ok true, empty diagnostics; all seven revision fields resolve."
review:
  - "Approve: R1 and R2 resolved; zero remaining blocking findings and zero remaining optional findings. Original findings preserved below as historical evidence."
discoveries:
  - "Exact Shelter arithmetic now uses explicit impact tuning; dispatcher outcomes tolerate changed positive mitigation and detect incorrect behavior."
  - "Six real serialized traces are supplied with revision, rules version and configuration, and replay exactly."
  - "The technical fix changes only abilities.test.ts; production source and all other tests are unchanged."
blockers: []

Author: P07 Reviewer. Date: 2026-10-04 UTC. Worktree `/opt/dev/tehom-brainlab-p07`, branch `p07-brood-abilities`. Governing [assignment](assignment-reviewer.md), [P07 plan](../../plans/2026-10-02-f8938420-poc-001-brood-abilities.md), [Implementer handoff](implementer.md), [ADR-0006](../../adr/0006-contract-invariants-and-black-box-testing.md), [ruach-testing](../../../.agents/skills/ruach-testing/SKILL.md), and [ruach-handoff](../../../.agents/skills/ruach-handoff/SKILL.md).

## Verdict and scope

**Request changes: one blocking finding and one optional finding.** All required candidate checks pass. No material production correctness, mutation, lifecycle, accounting, backward-compatibility or scope findings were identified. R1 prevents satisfying the assignment's explicit ADR-0006 test condition.

Reviewed technical range `08dc630..42deffc` (eight changed paths: content definitions, abilities, commands, transition, intents, state, new ability tests, README). Inspected relevant existing P03 accounting/tests, P05 link/protection/facing/recipient geometry, P06 attack and lifecycle operations, formation/sectors, and test/tooling configuration. Also read the Implementer assignment and handoff. No source, test, generated agent definition, protected document, plan or ADR was edited.

Independent application checks ran at existing HEAD `1b251bf1b1e5d38485874eb2fed5c1d5aae91f31`. `git diff --name-only 42deffc 1b251bf` lists only the Implementer assignment and report, and the application equality command exits 0. Thus these checks cover identical technical content to reviewed candidate `42deffc5aadeb5c1d8b77a2119a16aa6a408995c`. This report's later recording commit does not change the tested implementation.

## Findings, ordered by severity

### R1 — Blocking: exact Shelter outcomes use provisional default mitigation

- **Location:** [abilities.test.ts:160](../../../poc-001-linked-formation/tests/abilities.test.ts#L160), assertion at line 163; also [abilities.test.ts:173](../../../poc-001-linked-formation/tests/abilities.test.ts#L173), assertion at line 176.
- **Problem:** Both tests settle the later enemy hit through `applyCommand`, which calls `applyAttack` with its default `DamageRules`. The first test passes explicit `rules` only to Shelter installation; Shelter stores IDs, not a mitigation amount. The same-blast test uses defaults throughout. Exact expected HP 7 and 9 therefore rely on the provisional default reduction being two, rather than the independently supplied test configuration.
- **Failure scenario and why it matters:** A permitted P06 default change from two-point to one-point Shelter mitigation preserves impact-time eligibility, consumption, batching and source-death behavior, but fails these P07 tests. ADR-0006 explicitly requires configurable exact arithmetic to use explicit inputs and prohibits freezing provisional defaults. The assignment makes this a condition of acceptance. This is a test-contract defect, not evidence that current gameplay damage is wrong.
- **Evidence:** The temporary Docker probe below overrides only the exported default reduction and default-argument behavior to one, while forwarding actual settlement to the unchanged production `applyAttack` and retaining explicitly supplied rules. The Close case fails at line 163 with **received 6 / expected 7**; the same-blast case fails at line 176 with **received 8 / expected 9**. The expanded case passes. Final probe: exit 1, two failures / one pass / 81 skipped, 14 executed assertions. Tracked production and test files remained unchanged.
- **Suggested direction:** Settle the hits through public `applyAttack(..., rules.damageRules)` with test-owned tuning for exact arithmetic; keep dispatcher coverage through eligibility, accounting and outcome invariants that permit future default tuning. Preserve the current Close/expanded and same-blast assertions with their explicit two-point input, and retain tests that detect missing mitigation or incorrect eligibility/consumption. No production redesign is needed.

### R2 — Optional: include the six requested serialized traces in the handoff

- **Location:** [implementer.md:108](implementer.md#L108), and [P07 plan, Verification and hand-back](../../plans/2026-10-02-f8938420-poc-001-brood-abilities.md#verification-and-hand-back).
- **Problem:** The plan requests one real serialized input/result trace per ability. The handoff describes six deterministic replay tests and numerical outcomes, but provides no serialized input/result records or linked trace artifact. Its artifact list and remaining narrative contain none.
- **Failure scenario and why it matters:** A downstream reader can assess the summaries but cannot inspect the requested concrete command/result examples without reconstructing and executing fixtures. This is an evidence-completeness issue; the independent passing tests already support the behavior, so it does not add a production blocker.
- **Evidence:** The handoff's criterion table and C4 summary reference replay tests; the six-case test at `abilities.test.ts:362` compares serialized replay results without emitting or preserving those records. The reviewed evidence-only successor contains only the assignment and handoff, with no trace artifact.
- **Suggested direction:** Have the Implementer append six actual serialized input/result examples, or link a bounded durable mailbox artifact, retaining the tested revision and fixture/rules version. Do not substitute invented traces or alter protected documents.

## Acceptance assessment

| Assigned condition | Independent assessment |
| --- | --- |
| Plan AC1–AC7 and required runtime contracts | Covered and passing: exact explicitly configured reliable-attack arithmetic; protected Impale in six Spread orientations and rejection after partner death/in Compact; Shelter target eligibility and impact behavior; signed Crosswind area/facing changes with mark preservation; reliable attacks in all twelve labelled formations, including each fallen-partner variant; atomic actor/target failures; action/maneuver sequences and one-revision accounting. Test-policy condition needs R1. |
| Single accounting, rejection atomicity, P06 preservation | `accountActorAction` is the only actor-spend function for both adapters. Shared guard precedes effect validation; rejected effects return input state/empty events. It assigns input revision + 1, retains P06 collections and settled phase, restores formation/round/maneuver, and adds only the actor to acted IDs. Lethal-ability coverage confirms victory and a single revision/action. Unregistered/basic-snapshot unsupported precedence remains intact. |
| P05/P06 backward compatibility and unchanged earlier tests | Optional rotatable capability retains omitted-capability behavior. Clockwise export delegates to signed geometry with unchanged results; anticlockwise composes the existing transform without intermediate events. All earlier tests are byte-for-byte unchanged and pass, including two-ring geometry and P03/P06 accounting. |
| Ownership and bounded scope | Six explicit effects; P05 selectors/transforms and P06 damage/status/lifecycle reused. No UI rules, scripting system, enemy ordering, encounter factory, round reset or expiry scheduler added. P08 remains responsible for scheduling existing expiry. |
| Purity/determinism | Frozen fixtures/commands and all six serialized replay cases pass; effects create replacement objects/arrays, and existing selectors/settlement do not mutate inputs. Identity generation uses revision/actor/ability without randomness/time. |
| Full suite/typecheck/build | Pass independently on technically identical `1b251bf`. |

## Exact verification

All application execution used Docker with the committed Bun 1.4.2 image. Dependencies were already present; `just poc-001-install` was not needed or run. Docker escalation was approved automatically; no auto-review rejection occurred. No host-mode application checks ran. Recording the assigned report/assignment initially failed at `git add` (exit 128) because the worktree index is in the read-only main-checkout Git directory; committing requires escalation. The assignment's unchanged SHA-256 is `169554eb76e5feab295ed2d5d595abd5b9bc0f6b739b63141a13d7ba801b1102`.

| Exact command | Exit and result |
| --- | --- |
| `git rev-parse HEAD` | 0; `1b251bf1b1e5d38485874eb2fed5c1d5aae91f31`. |
| `git diff --name-only 42deffc 1b251bf` | 0; only `assignment-implementer.md` and `implementer.md`. |
| `git diff --exit-code 42deffc 1b251bf -- poc-001-linked-formation` | 0; technical equality confirmed. |
| `just poc-001-test` | Initial sandbox attempt 1: Docker daemon inaccessible, tests not started. Escalated retry 0: 362 passing tests / eight files; P07 84 tests / 1,040 assertions; formation 92, commands 37, intents 77, damage 48, view 19, assets 3, smoke 2. Five instrumented suites total 3,769 assertions; remaining suites do not print assertion counts. |
| `just poc-001-typecheck` | 0 with escalation; `tsc --noEmit`. |
| `just poc-001-build` | 0 with escalation; nine prepared asset/attribution files, 20 modules transformed; existing >500 kB Phaser chunk warning. |
| `git diff --check 08dc630..42deffc` | 0; no whitespace errors. |
| `git diff --exit-code 08dc630 42deffc -- poc-001-linked-formation/tests ':!poc-001-linked-formation/tests/abilities.test.ts'` | 0; all existing tests unchanged. |
| `PATH=/home/metatron/.bun/bin:$PATH bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p07-brood-abilities/reviewer.md --repo /opt/dev/tehom-brainlab-p07` | 0; `ok: true`, no diagnostics, five revision fields resolved. Structural validation does not certify the review verdict. |

### Temporary tuning probe evidence

Disposable configuration/setup lived only in `/tmp/p07-review-probes.0aXEmX`. Production and tests were used as-is. The final `tuning.config.ts` exported:

```ts
export default {
  root: '/app',
  cacheDir: '/tmp/p07-review-vite-cache',
  test: { environment: 'node', globals: true,
    include: ['tests/abilities.test.ts'], setupFiles: ['/probe/tuning.setup.ts'] },
};
```

The setup supplied alternate default tuning while preserving the implementation and any explicit caller tuning:

```ts
vi.mock('/app/src/core/damage.ts', async (importOriginal) => {
  const actual = await importOriginal();
  const damageRules = { ...actual.DEFAULT_DAMAGE_RULES, shelterReduction: 1 };
  return {
    ...actual,
    DEFAULT_DAMAGE_RULES: damageRules,
    applyAttack: (state, attack, rules = damageRules) => actual.applyAttack(state, attack, rules),
  };
});
```

Exact Docker command (executed twice, with setup corrected between attempts):

```sh
docker run --rm --init --user "$(id -u):$(id -g)" --env HOME=/tmp --env BUN_INSTALL_CACHE_DIR=/tmp/bun-cache --volume /opt/dev/tehom-brainlab-p07/poc-001-linked-formation:/app --volume /tmp/p07-review-probes.0aXEmX:/probe --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 bun run --bun test:unit --config /probe/tuning.config.ts tests/abilities.test.ts -t 'AC3: Shelter checks Close|AC3: installed Shelter'
```

First attempt exited 1 before executing tests because Vitest's mock hoisting did not accept the absolute-path `vi` import. Corrected only the temporary setup by removing that import and enabling `globals: true`. Final attempt exited 1 with the two specified arithmetic failures, one passing expanded case and 81 skipped cases. A temporary-config CommonJS/ESM advisory was emitted; it did not prevent test execution. This intentional alternate-default probe is separate from the passing unmodified candidate suite.

No browser check or human playtest was required or run. Balance, enjoyment, playable encounters, UI integration, P08 scheduling and malformed serialized-state parsing remain unverified/outside this review. No merge, push, rebase or branch/worktree deletion occurred. Fixes remain with the Implementer; acceptance and delivery remain with the Coordinator.

## Re-review of R1/R2 at 90e96d3

**Verdict: approve. R1 and R2 are resolved. Remaining findings: zero blocking, zero optional. No new material findings.** The earlier findings and verification above describe the original candidate and are preserved unchanged; this section and the updated YAML describe the fixed candidate.

Scope: [re-review assignment](assignment-rereview.md), technical fix range `20eb00c..90e96d3`, [fix handoff](fix.md), and [traces artifact](traces.json) introduced by evidence-only commit `9c39c01`. The fix changes only `poc-001-linked-formation/tests/abilities.test.ts`: one import, explicit impact tuning in the two reviewed test definitions (three executed cases), and three added dispatcher cases. Inspected all changed assertions and their P06/dispatcher boundaries; production code and all other tests are unchanged. No coverage was removed.

All application checks and probes below executed while HEAD was exactly `90e96d301bcbe7886755425b489123d87c455776`, using `git switch --detach 90e96d301bcbe7886755425b489123d87c455776`. Returned with `git switch p07-brood-abilities` to existing evidence commit `9c39c01387980e21c4d6785a9af35bdab0e55400` before recording this report. Both switch commands exited 0; branches were not rewritten. `git diff --exit-code 90e96d3 HEAD -- poc-001-linked-formation` exited 0 on return. The trace artifact was copied to temporary scratch before detaching; its checksum before and after is `87b0d1514ad6a92767e21c23c26580e4f44bdc5c9f9c75eac0867d6bc3ad5512`.

### R1 resolution

At current `abilities.test.ts:161` and `:174`, exact impact tests call public `applyAttack(..., rules.damageRules)`. The independent test input explicitly supplies two-point Shelter mitigation, and the original exact HP, eligibility, consumption, same-blast source-death and expiry assertions remain intact. Passing rules only to installation is no longer relied on to configure damage.

New dispatcher cases at `abilities.test.ts:186` and `:205` compare the same attack on sheltered and unsheltered snapshots. Eligible Close/same-blast targets must retain more HP, while an expanded target must have identical HP. They also assert consumed status removal, eligibility events, actor/maneuver preservation and one impact revision. These observable relationships allow the positive default mitigation amount to change without making missing mitigation pass. The existing frozen fixtures and replay checks remain, and the Close/expanded dispatcher cases also verify unchanged input snapshots.

Independently reran the original unchanged one-point mock/configuration from the initial review against **all 87 P07 tests**: exit 0, 1,072 assertions. Thus the previously failing exact cases pass with alternate default tuning, and the new dispatcher cases also pass. Independently checked their detection strength with temporary mutations; all deliberately incorrect behaviors fail as expected:

| Temporary behavior | Exit / counts | Evidence |
| --- | --- | --- |
| Default Shelter reduction zero; explicit tuning forwarded intact | 1; two failed, four passed, 81 skipped; 41 assertions | Close dispatcher line 196 fails HP5 > HP5; same-blast dispatcher line 214 fails HP7 > HP7. All three explicit-impact cases still pass. |
| Corrupt default impact eligibility to threshold four while retaining exported default threshold two | 1; one failed, five passed, 81 skipped; 47 assertions | Expanded dispatcher line 195 fails received HP7 / unsheltered HP5. Explicit impact tuning remains intact. |
| Restore input Shelters after otherwise normal attack settlement | 1; six failed, 81 skipped; 33 assertions | Both exact and dispatcher cases reject retained Shelters at lines 165, 179, 197 and 216. |

The eligibility probe was first run by altering the exported default threshold as well (same one-failure/five-pass result), then refined and rerun to corrupt only default impact settlement, keeping the declared geometry tuning unchanged. These are intentional mutation-test failures, not candidate failures. No source or test file was modified by any probe.

### R2 resolution

The durable artifact contains exactly six full input/result records for Claw, Shelter, Sting, Impale, Gale and Crosswind. It identifies tested revision `90e96d301bcbe7886755425b489123d87c455776`, rules version `p07-v1`, fixture version `p07-fix-traces-v1`, public boundary `applyCommand`, and actual ability/damage rules. Inspected artifact structure and independently executed every stored command against its frozen stored state. All six actual results deeply equal the stored results, each succeeds with input revision + 1, and all six inputs remain unchanged. Artifact metadata and stored rule configuration also match the production exports. R2's requested executed examples are now present and independently reproducible.

### Exact re-review verification

Application execution used Docker and the pinned Bun 1.4.2 image throughout. Dependencies were already installed; no installation was needed. Docker and linked-worktree Git writes used escalation; no approval rejection occurred. No host-mode application checks ran.

| Exact command | Exit / result |
| --- | --- |
| `git rev-parse HEAD` during application checks | 0; exact fixed technical revision `90e96d301bcbe7886755425b489123d87c455776`. |
| `just poc-001-test` | 0; 365 tests / eight files: 87 abilities, 92 formation, 37 commands, 77 intents, 48 damage, 19 view, 3 assets, 2 smoke. P07 1,072 assertions; five instrumented suites total 3,801 assertions. |
| `just poc-001-typecheck` | 0; `tsc --noEmit`. |
| `just poc-001-build` | 0; 20 modules, nine prepared asset/attribution files; existing >500 kB Phaser bundle warning. |
| `git diff --check 20eb00c..90e96d3` | 0; no whitespace errors. |
| `git diff --exit-code 08dc630 90e96d3 -- poc-001-linked-formation/tests ':!poc-001-linked-formation/tests/abilities.test.ts'` | 0; all earlier test files unchanged. |
| `git diff --exit-code 20eb00c 90e96d3 -- poc-001-linked-formation/src` | 0; production source unchanged by fix. |
| `git diff --exit-code` before returning to branch | 0; no tracked edits from checks/probes. |
| `git diff --name-only 90e96d3 9c39c01` | 0; only fix assignment, fix handoff and traces artifact. |
| `PATH=/home/metatron/.bun/bin:$PATH bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p07-brood-abilities/reviewer.md --repo /opt/dev/tehom-brainlab-p07` | 0; `ok: true`, empty diagnostics, all seven revision fields resolve. |

Original default-override probe, unchanged temporary setup/configuration shown in the original review, extended to all P07 tests (exit 0):

```sh
docker run --rm --init --user "$(id -u):$(id -g)" --env HOME=/tmp --env BUN_INSTALL_CACHE_DIR=/tmp/bun-cache --volume /opt/dev/tehom-brainlab-p07/poc-001-linked-formation:/app:ro --volume /tmp/p07-review-probes.0aXEmX:/probe --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 bun run --bun test:unit --config /probe/tuning.config.ts tests/abilities.test.ts --reporter=dot
```

The inherited `.ts` temporary configuration emits a CommonJS/ESM future-loader advisory; execution succeeds. New mutation config `mutation-rereview.config.mts` uses the same root/Node/globals/include settings, cache `/tmp/p07-rereview-vite-cache`, and setup `/probe/mutation-rereview.setup.ts`. Final setup:

```ts
vi.mock('/app/src/core/damage.ts', async (importOriginal) => {
  const actual = await importOriginal();
  const mode = process.env.P07_REREVIEW_MUTATION;
  const damageRules = { ...actual.DEFAULT_DAMAGE_RULES,
    ...(mode === 'missing' ? { shelterReduction: 0 } : {}) };
  return {
    ...actual,
    DEFAULT_DAMAGE_RULES: damageRules,
    applyAttack: (state, attack, rules = damageRules) => {
      const impactRules = mode === 'eligibility' && rules === damageRules
        ? { ...rules, closeThreshold: 4 } : rules;
      const result = actual.applyAttack(state, attack, impactRules);
      return mode === 'consumption' && result.ok
        ? { ...result, state: { ...result.state, shelters: state.shelters } } : result;
    },
  };
});
```

Exact mutation command below was executed with each of the literal values `missing`, `eligibility` and `consumption` in the environment argument (exit 1 each). The eligibility command was executed a second time after the setup refinement described above:

```sh
docker run --rm --init --user "$(id -u):$(id -g)" --env HOME=/tmp --env BUN_INSTALL_CACHE_DIR=/tmp/bun-cache --env P07_REREVIEW_MUTATION=missing --volume /opt/dev/tehom-brainlab-p07/poc-001-linked-formation:/app:ro --volume /tmp/p07-review-probes.0aXEmX:/probe --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 bun run --bun test:unit --config /probe/mutation-rereview.config.mts tests/abilities.test.ts --reporter=dot -t 'AC3: Shelter checks Close|AC3: installed Shelter|AC3 dispatcher'
```

Exact independent trace replay command (exit 0):

```sh
docker run --rm --init --user "$(id -u):$(id -g)" --env HOME=/tmp --env BUN_INSTALL_CACHE_DIR=/tmp/bun-cache --volume /opt/dev/tehom-brainlab-p07/poc-001-linked-formation:/app:ro --volume /tmp/p07-review-probes.0aXEmX:/probe:ro --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 bun /probe/replay-rereview.ts
```

The disposable script reads the unchanged copy of `traces.json`; verifies revision, version, fixture, boundary, explicit rule metadata and the exact six ability IDs; recursively freezes each input; calls production `applyCommand`; and asserts success, full result equality, revision + 1 and unchanged JSON input. Output reports `passed_traces:6`, `inputs_preserved:6` and rules version `p07-v1`. The copy and repository artifact share the checksum recorded above.

Only this report was edited; the re-review assignment is committed unchanged, SHA-256 `e9b504891d9404a09c3dcf3f85d51a7360daf3e5e4f885a443e1b9dd1ee22857`. All new disposable material remains in OS temporary scratch. No required check remains unrun. Browser/human playtest, balance, P08 scheduling and UI integration remain outside scope, with the same limitations as the original review. Coordinator acceptance/delivery remain separate from this approval recommendation. No merge, push, rebase or branch/worktree deletion occurred.
