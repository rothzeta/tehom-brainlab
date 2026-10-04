task: P08-review
status: complete
outcome: Approved; no material findings, zero blocking and zero optional findings.
role: reviewer
source_baseline: 9976e9a22631e5af913fe80af87f8c9e49044def
candidate_revision: 864e3d0b1b5bba68495bcdb2141f1892c9d75b2e
reviewed_revision: 864e3d0b1b5bba68495bcdb2141f1892c9d75b2e
tested_revision: ac8d0a205bb0c61ba63a44b375960b32952396e4
evidence_revision: ac8d0a205bb0c61ba63a44b375960b32952396e4
artifacts:
  - docs/mailbox/p08-patrol-round-loop/assignment-reviewer.md
  - docs/mailbox/p08-patrol-round-loop/reviewer.md
  - docs/mailbox/p08-patrol-round-loop/implementer.md
  - docs/mailbox/p08-patrol-round-loop/traces.json
verification:
  - "Technical equality of candidate and tested evidence successor: exit 0."
  - "just poc-001-test: Docker, exit 0; 413 tests in nine files; 4293 instrumented assertions, including 48 P08 tests / 492 assertions."
  - "just poc-001-typecheck: Docker, exit 0."
  - "just poc-001-build: Docker, exit 0; nine prepared assets and 22 transformed modules; existing bundle-size warning."
  - "Range whitespace check and unchanged-existing-tests check: exit 0 each."
  - "Alternate patrol, ability and mitigation defaults: Docker, exit 0; all 48 P08 tests / 482 assertions pass."
  - "Independent stored transcript replay: Docker, exit 0; four traces, 48 commands and complete outputs/final states match; frozen and serialized inputs checked."
  - "Independent compatibility/version/ordering probes: Docker, exit 0; three cases pass."
  - "Handoff validator with --repo: exit 0, ok true, no diagnostics; all revision fields resolve."
review:
  - "Approved technical candidate 864e3d0; zero blocking and zero optional findings."
discoveries:
  - "The wounded-Ugallu attack transcript demonstrates one defeat, not preset unwinnability; the Implementer expressly limits that claim."
  - "P09 previews and P10 presentation remain unimplemented and outside this review."
blockers: []

P08 Reviewer, 2026-10-04 UTC. Authority: unchanged [assignment](assignment-reviewer.md), [repository policy](../../../.agents/policy.md), [Reviewer role](../../../.agents/agents/reviewer.md), [handoff skill](../../../.agents/skills/ruach-handoff/SKILL.md), [testing skill](../../../.agents/skills/ruach-testing/SKILL.md), [P08 plan including Amendment TR](../../plans/2026-10-02-dc6612ec-poc-001-patrol-round-loop.md), and [ADR-0006](../../adr/0006-contract-invariants-and-black-box-testing.md).

**Verdict: approved. Findings: 0 blocking, 0 optional. No material findings.**

Reviewed the entire six-file technical range `9976e9a..864e3d0`: patrol content, round scheduling/resolution, dispatcher registration, additive event types, new patrol tests, and README. Inspected surrounding P03 state/accounting, P05 selectors, P06 damage/lifecycle/expiry, P07 abilities, and the Implementer handoff and stored traces. All independent execution occurred at HEAD `ac8d0a205bb0c61ba63a44b375960b32952396e4`; before verification, `git diff --exit-code 864e3d0 ac8d0a2 -- poc-001-linked-formation` established identical technical content. The successor adds only the Implementer assignment/report/transcripts. No source or test file was edited during review.

**Acceptance assessment**

| Assigned condition | Assessment and evidence |
| --- | --- |
| 1: numbered plan criteria, TR, contract tests | All seven numbered criteria are covered by the independently passing 48 P08 tests. Factories supply independent state and the documented HP relationships; scheduling tests cover round-one marks, roster ties, exact cross products, fallen candidates and shuffled arrays. Explicit impact fixtures distinguish Compact splash and Spread isolation, locked marks, immediate protection/cancellation, round resets, early forfeiture and stale rejection. Win/defeat regressions use explicit HP, PatrolRules and AbilityRules. The alternate-default probe below passes. Enemy objects have no board cell; `PATROL_VIEW_ANCHOR` is view-only. Inspected selectors do not read enemy cells or this anchor. |
| 2: deterministic atomic loop and P05/P06/P07 reuse | `rounds.ts:19` announces in fixed roster/enemy order; `rounds.ts:41` resolves one atomic command, resets provisional P06 revisions and publishes input revision+1. Ordered P06 hits settle death/cancellation before the next source; late duplicate-hit rejection returns original state and no events. Terminal outcomes stop attacks and do not reset budgets/announce; Shelter expiry precedes new intentions. Existing selectors, damage, lifecycle and ability implementations supply the rules. Frozen and serialized transcript replay matches all outputs. Independent shuffled resolution also preserves Warder/Censer/Harrier order and one revision. |
| 3: additive compatibility and unchanged existing tests | Only three added/import-adjusted lines in commands.ts and ten in transition.ts integrate RoundEvent and PatrolState/endPhase. Existing CombatState/GameState contracts and error variants are unchanged. The eight earlier test files are byte-identical to BASE and pass. The existing lab case and independent non-patrol CombatState probe retain unsupported-command with unchanged state and no events. |
| 4: bounded ownership | The changes own P08 factories, scheduling, events and provisional inputs. Radius/Close/mitigation defaults reference their P05/P02/P06 owners. No preview or UI rule was added. The centre anchor leaves pixel offsets to P10 and does not choose board placement. |
| 5: genuine transcripts and bounded interpretation | All four initial snapshots equal fresh production presets, stored ability rules equal the production rules, and all 48 actual commands reproduce complete stored results/events and final states. The healthy attack wins, healthy forfeit loses, wounded Girtablilu attack wins, and wounded Ugallu attack loses. The handoff expressly states that the latter does not establish unwinnability, balance, tactical interest or human playtest success. |
| 6: full suite, typecheck, build | All required checks pass independently at the technically identical evidence successor; exact commands and results follow. |

**Verification record**

All application executions used Docker and pinned Bun 1.4.2. The initial sandboxed `just poc-001-test` exited 1 before running tests because Docker was inaccessible. The escalated retry and subsequent Docker executions succeeded; no host-mode fallback or automatic approval rejection occurred. Dependencies were already installed and usable, so `just poc-001-install` was not needed or run.

| Exact command | Exit and result |
| --- | --- |
| `git diff --exit-code 864e3d0 ac8d0a2 -- poc-001-linked-formation` | 0; no technical differences. |
| `just poc-001-test` (escalated Docker retry) | 0; 413 tests, nine files: formation92, intents77, damage48, abilities87, patrol48, commands37, view19, assets3, smoke2. Instrumented assertion counts respectively1361/810/305/1072/492/253, sum4293; view/assets/smoke do not publish assertion totals. |
| `just poc-001-typecheck` | 0; `tsc --noEmit`. |
| `just poc-001-build` | 0; nine prepared assets, 22 modules, existing >500kB chunk warning. |
| `git diff --check 9976e9a..864e3d0` | 0; no whitespace errors. |
| `git diff --exit-code 9976e9a 864e3d0 -- poc-001-linked-formation/tests ':!poc-001-linked-formation/tests/patrol.test.ts'` | 0; all eight earlier test files unchanged. |
| `sha256sum docs/mailbox/p08-patrol-round-loop/traces.json` | 0; `4395c5a17655336c75f30b3fae091e7b64d1764d2cde60ae0afd5348a02aa3de`. |
| `/home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p08-patrol-round-loop/reviewer.md --repo /opt/dev/tehom-brainlab-p08` | 0; `ok:true`, empty diagnostics, all five revision fields resolve. |

**Alternate-default probe**

Disposable setup/configuration lived only in `/tmp/p08-review-probes`; production and tests were mounted read-only. Mocks changed only exported/default-argument tuning and forwarded settlement/factory calls to the actual implementation, preserving explicitly supplied rules. The probe changes patrol raw damage 3/3/4/7 to2/4/5/8, ability raw damage 4/4/6/3 to5/5/7/2, and both default mitigation reductions from2 to1. Geometry is unchanged. All 48 P08 tests pass, with 482 instrumented assertions; the changed default smoke outcomes use fewer commands than the original 492-assertion run. Explicit arithmetic regressions continue to pass.

Exact temporary `tuning.config.mts`:

```ts
export default {
  root: '/app', cacheDir: '/tmp/p08-review-vite-cache',
  test: { environment: 'node', globals: true,
    include: ['tests/patrol.test.ts'], setupFiles: ['/probe/tuning.setup.ts'] },
};
```

Exact temporary `tuning.setup.ts`:

```ts
vi.mock('/app/src/core/damage.ts', async (importOriginal) => {
  const actual = await importOriginal();
  const defaults = { ...actual.DEFAULT_DAMAGE_RULES, directionalReduction: 1, shelterReduction: 1 };
  return { ...actual, DEFAULT_DAMAGE_RULES: defaults,
    applyAttack: (state, command, rules = defaults) => actual.applyAttack(state, command, rules) };
});
vi.mock('/app/src/core/abilities.ts', async (importOriginal) => {
  const actual = await importOriginal();
  const defaults = { ...actual.DEFAULT_ABILITY_RULES,
    clawDamage: 5, stingDamage: 5, impaleDamage: 7, galeDamage: 2 };
  return { ...actual, DEFAULT_ABILITY_RULES: defaults,
    applyAbility: (state, command, rules = defaults) => actual.applyAbility(state, command, rules),
    abilityLegality: (state, command, rules = defaults) => actual.abilityLegality(state, command, rules) };
});
vi.mock('/app/src/content/patrol.ts', async (importOriginal) => {
  const actual = await importOriginal();
  const defaults = Object.freeze({ ...actual.DEFAULT_PATROL_RULES,
    warderDamage: 2, censerDamage: 4, harrierDamage: 5, isolatedHarrierDamage: 8 });
  return { ...actual, DEFAULT_PATROL_RULES: defaults,
    createPatrol: (preset = 'healthy', rules = defaults) => actual.createPatrol(preset, rules),
    createHealthyPatrol: (rules = defaults) => actual.createPatrol('healthy', rules),
    createWoundedUgalluPatrol: (rules = defaults) => actual.createPatrol('wounded-ugallu', rules),
    createWoundedGirtabliluPatrol: (rules = defaults) => actual.createPatrol('wounded-girtablilu', rules) };
});
```

Exact command, exit 0:

```sh
docker run --rm --init --user "$(id -u):$(id -g)" --env HOME=/tmp --env BUN_INSTALL_CACHE_DIR=/tmp/bun-cache --volume /opt/dev/tehom-brainlab-p08/poc-001-linked-formation:/app:ro --volume /tmp/p08-review-probes:/probe --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 bun run --bun test:unit --config /probe/tuning.config.mts tests/patrol.test.ts --reporter=dot
```

**Independent stored replay**

The temporary replay checks artifact revision, fresh-factory equality and stored ability rules; deeply freezes each snapshot/command; executes each command through applyCommand; compares the entire result against the stored result; reruns from serialized copies; checks unchanged inputs and one public revision; and compares each full final snapshot and terminal outcome. It matched four traces and 48 commands. These checks establish replay of the retained executions, without inferring how their historical generator was run.

| Preset / strategy | Outcome / round / revision / commands | Brood HP U/G/P | Enemy HP W/C/H |
| --- | --- | --- | --- |
| Healthy / attack | Victory / 4 / 14 / 14 | 0/8/8 | 0/0/0 |
| Wounded Ugallu / attack | Defeat / 5 / 14 / 14 | 0/0/0 | 0/0/7 |
| Wounded Girtablilu / attack | Victory / 6 / 16 / 16 | 0/0/1 | 0/0/0 |
| Healthy / forfeit | Defeat / 4 / 4 / 4 | 0/0/0 | 12/10/13 |

Exact replay command, exit 0:

```sh
docker run --rm --init --user "$(id -u):$(id -g)" --env HOME=/tmp --volume /opt/dev/tehom-brainlab-p08/poc-001-linked-formation:/app:ro --volume /tmp/p08-review-probes:/probe:ro --volume /opt/dev/tehom-brainlab-p08/docs/mailbox/p08-patrol-round-loop:/evidence:ro --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 bun /probe/replay.ts
```

**Additional independent contracts**

Temporary `contracts.ts` removes the PatrolState extension from a production preset and verifies non-patrol unsupported-command, changes its version to unknown and verifies atomic invalid-command, then reverses both entity arrays in a test-owned HP30/rules3/3/4/7 fixture and verifies resolved source order Warder/Censer/Harrier, player round2, state revision1 and every attack event revision1. All three cases pass.

Exact command, exit 0:

```sh
docker run --rm --init --user "$(id -u):$(id -g)" --env HOME=/tmp --volume /opt/dev/tehom-brainlab-p08/poc-001-linked-formation:/app:ro --volume /tmp/p08-review-probes:/probe:ro --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 bun /probe/contracts.ts
```

**Limits and delivery**

No browser check, human playtest, exhaustive strategy search, balance assessment, P09/P10 validation or hostile serialized-state parsing audit was performed. P06/P07 valid-snapshot assumptions remain; the P08 README explicitly documents them. These are outside the assigned headless review. This review approves the technical candidate; Coordinator acceptance/integration remains separate.

Only this report was authored. The assignment is committed unchanged alongside it: SHA-256 `fba8062cbaa926998e1ebfb191e2220f2c9bb64391e95ac58eb6e7245d7ecd66`, matching the initial read. Protected documents, plans, ADRs, production, tests and generated agent definitions were not edited; disposable probe files remain outside the repository. No merge, push, rebase, branch/worktree deletion or resource cleanup occurred. The terminal handoff supplies the report-creating commit, distinct from the reviewed/tested revisions above.
