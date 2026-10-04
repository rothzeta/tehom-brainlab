task: P07-review
status: complete
outcome: Request changes for one blocking ADR-0006 test-contract finding; production behavior and required candidate checks pass.
role: reviewer
source_baseline: 08dc6308649f124ee4a9d5897bcb8d92438dacec
candidate_revision: 42deffc5aadeb5c1d8b77a2119a16aa6a408995c
reviewed_revision: 42deffc5aadeb5c1d8b77a2119a16aa6a408995c
tested_revision: 1b251bf1b1e5d38485874eb2fed5c1d5aae91f31
evidence_revision: 1b251bf1b1e5d38485874eb2fed5c1d5aae91f31
artifacts:
  - docs/mailbox/p07-brood-abilities/assignment-reviewer.md
  - docs/mailbox/p07-brood-abilities/reviewer.md
verification:
  - "Candidate/application equality: git diff --exit-code 42deffc 1b251bf -- poc-001-linked-formation; exit 0."
  - "just poc-001-test: initial sandbox exit 1 for Docker access; escalated Docker retry exit 0, 362 tests in eight files, including 84 P07 tests and 1040 P07 assertions."
  - "just poc-001-typecheck: escalated Docker execution, exit 0."
  - "just poc-001-build: escalated Docker execution, exit 0; 20 modules, nine prepared asset files, existing bundle-size warning."
  - "git diff --check 08dc630..42deffc: exit 0."
  - "Existing-test preservation command specified by assignment: exit 0, all earlier tests unchanged."
  - "Temporary Docker tuning probe: final exit 1 as expected, two assertion failures, one passing case, 81 skipped; details and setup below."
  - "Handoff validator: exit 0, ok true, empty diagnostics; all five revision fields resolve."
review:
  - "Request changes: one blocking finding (R1), one optional finding (R2). No material production correctness or accounting findings."
discoveries:
  - "Shared accounting preserves P06 settlement, including victory, with one actor spend and one revision. P05/P06 additive changes preserve existing tests."
  - "Two P07 Shelter tests omit explicit mitigation at impact and therefore freeze a provisional P06 default."
  - "The Implementer handoff does not include the six serialized input/result traces requested by the P07 plan."
blockers:
  - "R1: make exact Shelter damage assertions use explicit test-owned impact tuning before accepting the ADR-0006 condition."

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
