task: P07-impl
status: complete
outcome: P07.C1–C4 and acceptance criteria 1–7 implemented and verified; independent review pending.
role: implementer
source_baseline: 08dc6308649f124ee4a9d5897bcb8d92438dacec
candidate_revision: 42deffc5aadeb5c1d8b77a2119a16aa6a408995c
tested_revision: 42deffc5aadeb5c1d8b77a2119a16aa6a408995c
artifacts:
  - docs/mailbox/p07-brood-abilities/assignment-implementer.md
  - docs/mailbox/p07-brood-abilities/implementer.md
  - poc-001-linked-formation/src/content/brood.ts
  - poc-001-linked-formation/src/core/abilities.ts
  - poc-001-linked-formation/src/core/commands.ts
  - poc-001-linked-formation/src/core/transition.ts
  - poc-001-linked-formation/src/core/state.ts
  - poc-001-linked-formation/src/core/intents.ts
  - poc-001-linked-formation/tests/abilities.test.ts
  - poc-001-linked-formation/README.md
verification:
  - "just poc-001-install: exit 0 after Docker escalation; frozen Bun 1.4.2, 43 packages installed."
  - "just poc-001-test tests/abilities.test.ts: exit 0 at candidate; 84 tests, 1040 executed assertions."
  - "just poc-001-test: exit 0 at candidate; 362 tests in eight files; all existing tests unedited."
  - "just poc-001-typecheck: exit 0 at candidate."
  - "just poc-001-build: exit 0 at candidate; existing Phaser bundle-size warning."
  - "git diff --check and git diff --check 08dc630..HEAD: exit 0 at candidate."
  - "git diff --exit-code 08dc630 HEAD -- all eight existing test paths: exit 0; prior test files unchanged. Exact command below."
  - "PATH=/home/metatron/.bun/bin:$PATH bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p07-brood-abilities/implementer.md --repo /opt/dev/tehom-brainlab-p07: exit 0; ok true, no diagnostics, all three revisions resolved."
review: not-run
discoveries:
  - "A combat adapter shares P03 actor guards and one accounting function with the unchanged entity-only hook API; P06 attack/lifecycle results survive without a second revision increment."
  - "P05 gained a signed turn export using its existing geometry; CombatEnemy gained optional rotatable capability, defaulting to existing facing behavior."
  - "Unregistered ability IDs and basic formation-only snapshots retain unsupported-command precedence, preserving unchanged P03/P06 tests; registered combat abilities receive normal guards."
  - "Docker access, worktree Git writes and validator dependency installation needed escalation. A transient full /tmp prevented one sandbox invocation from starting; no other session files were removed."
  - "Protected plan status passages and older README sections remain historically stale; bounded correction proposals are recorded below."
blockers: []

Author: P07 Implementer. Date: 2026-10-04 UTC. Worktree `/opt/dev/tehom-brainlab-p07`, branch `p07-brood-abilities`. The assigned BASE matches the starting commit. Governing [assignment](assignment-implementer.md), [P07 plan](../../plans/2026-10-02-f8938420-poc-001-brood-abilities.md), [defaults ownership](../../plans/README.md#ownership-of-provisional-defaults), [ADR-0006](../../adr/0006-contract-invariants-and-black-box-testing.md), [testing skill](../../../.agents/skills/ruach-testing/SKILL.md), and [handoff protocol](../../../.agents/skills/ruach-handoff/SKILL.md).

The assignment is committed unchanged with this report in a later evidence-only commit, whose SHA is returned in the terminal handoff. The technical candidate and tested revision are identical; no technical change followed final verification. No merge, push, rebase, branch/worktree deletion, browser check, human playtest, independent review or Coordinator acceptance occurred.

## Changes and checkpoints

| Changed file | Scope and result |
| --- | --- |
| [content/brood.ts](../../../poc-001-linked-formation/src/content/brood.ts) | C1: six frozen named definitions, owner/target semantics, numeric defaults, `AbilityId`, rules version `p07-v1`. |
| [abilities.ts](../../../poc-001-linked-formation/src/core/abilities.ts) | C1/C2: typed commands/directions, explicit tunable attack amounts, shared legality, six explicit pure effects. All hits use P06; links and signed facing use P05. |
| [commands.ts](../../../poc-001-linked-formation/src/core/commands.ts) | C3: additive typed ability command and facing/Shelter events; existing command/error/result shapes retained. |
| [transition.ts](../../../poc-001-linked-formation/src/core/transition.ts) | C3: dispatch registered combat abilities and extend accounting through a combat adapter; keep old entity-only hook interface and observable behavior. |
| [state.ts](../../../poc-001-linked-formation/src/core/state.ts) | C2: optional `CombatEnemy.rotatable`, without changing P05 enemy inputs or encounter construction. |
| [intents.ts](../../../poc-001-linked-formation/src/core/intents.ts) | C2: additive `turnEnemy(enemy,intentions,direction)`; existing clockwise export delegates with unchanged results. |
| [abilities.test.ts](../../../poc-001-linked-formation/tests/abilities.test.ts) | C4: 84 contract tests / 1,040 assertions, frozen states/commands, independent arithmetic and signed-area cells, all twelve formations, sequences and atomic failures. |
| [README P07 contracts](../../../poc-001-linked-formation/README.md#brood-abilities-p07) | Public commands, legality/configuration, default effects, accounting, event order, input assumptions and P08 obligations. Only the assigned new section added. |

No existing tests, protected documents, plans/index, ADRs, brief, UI, encounter factories, round logic, previews, dependencies, lockfile, geometry masks, damage math or generated tracked agent resources were edited. The optional P03 cleanup findings are not expanded into separate work.

### Smallest accounting extension

P03's `ActionRules.apply` cannot return enemy/effect data. Its public interface is retained, with an adapter converting its Brood-only result into an effect result. The additive `CombatActionRules` adapter can return `CommandResult<CombatState>`. Both call one internal `accountActorAction` function, sharing the exported `actorActionError` guard. This avoids duplicated actor validation/spending and preserves every unchanged P03 accounting test.

Accounting validates revision, player phase, actor identity, ownership, positive HP and unused action before any effects. Ability-specific legality follows. A failed effect returns the original state object with empty events and no cost. Success restores input round/formation/maneuver, appends only the actor to the input acted IDs, and sets revision to input + 1. The combat effect's phase and collections survive, including P06 terminal lifecycle outcomes. P06 already sets that same new revision, so the adapter assigns rather than increments it again. No shared maneuver or round reset occurs.

`abilityLegality` reuses the actor guard and is consumed by the dispatcher effect validation. `applyAbility` exposes the same accounting boundary with explicit tuning. `applyCommand` registers only known ability IDs on combat snapshots: unknown IDs and basic lab snapshots retain P03's historical `unsupported-command`, including terminal/stale precedence. Direct ability queries reject unknown IDs as `illegal-ability`. Registered abilities in combat reject stale/terminal commands through normal guards. This compatibility distinction is documented and tested; the old P06 terminal test's unregistered `fixture` ability still returns its expected error.

`AbilityCommand` enforces a selected direction for Crosswind and forbids it on other typed cases. The broad P03 string-based command variant remains for compatibility; runtime checks enforce the same direction requirements. Combat snapshots retain P05/P06 assumptions of valid formations, unique entity IDs, one Brood per roster label and bounded safe-integer HP; this slice does not introduce a serialized-state parser.

### Existing operations reused

- `activeLinks` supplies Impale's two actual stretched links; two other living player Brood are also required. `isCloseLinked` supplies Shelter eligibility. No masks, link thresholds or distance calculations are reimplemented.
- `applyAttack` supplies guaranteed damage, protection, HP clamp, attack identity, status consumption and `settleLifecycle` indirectly. No second damage/death implementation exists.
- `turnEnemy` uses the existing P05 clockwise area transform. The anticlockwise result composes it five times, but emits one final facing event and one event per affected intention. Marks, unrelated/fixed areas and enemy HP/capability data survive.
- P06 `expireShelters` remains the sole expiry operation; tests exercise it on a P07-installed status. P08 must schedule it.

Success events begin with `action-applied`, followed by existing P06 attack/damage/lifecycle events, `shelter-installed`, or P05 facing/area events. Effect identities use revision/actor/ability with JSON tuple encoding, without clock/randomness. Attack identity collisions reject as `duplicate-attack`; Shelter collisions reject as `invalid-command`, before installation or spending. Future round resets must keep revision monotonic.

## Explicit default resolutions

All P07 defaults adopt the plan's proposed behavior. Values below are experimental defaults, not balanced gameplay conclusions. Numeric definitions live once in `content/brood.ts`; inherited mitigation/Close values reference existing owners.

| Choice / value | Source | Reason |
| --- | --- | --- |
| Ugallu Claw: raw 4, any living enemy, no protection bypass | P07 Fixture/default table; AC1; brief test kit | Reliable attack in either shape; directional protection reduces effectiveness without blocking reach. |
| Ugallu Shelter: one status on another living Close ally; no self target | P07 default table, Proposed implementation, AC3; brief Shelter | Formation-dependent protection without a wasted cast on self, enemy, Fallen or Stretched targets. |
| Shelter reduction 2, positive-hit consumption, current Close eligibility at impact, expiry after enemy phase | Existing P06 `DEFAULT_DAMAGE_RULES` / operations and P07 table/AC3 | Reuses delivered status semantics; installation promises no benefit after expansion or source death. No independent P07 mitigation constant. |
| Girtablilu Sting: raw 4, any living enemy, no protection bypass | P07 default table / AC1; brief test kit | Reliable contact attack remains legal after a partner falls. |
| Girtablilu Impale: raw 6, bypass directional protection, exactly two living partners and two Stretched active links | P07 default table, Proposed implementation, AC2 | Rewards Spread with the complete living formation; inert geometric slots cannot supply eligibility. |
| Pazuzu Gale: raw 3, any living enemy, bypass directional protection | P07 default table / AC1; brief test kit | Reliable modest attack through protection, without adjacency or facing dependence. |
| Pazuzu Crosswind: one signed step, clockwise or anticlockwise, raw damage none | P07 default table, required direction input, Proposed implementation, AC4 | Gives an explicit choice of orientation change without silently wasting the Brood's action. |
| Crosswind target: living enemy with valid facing; `rotatable:false` rejects; omitted capability defaults to true | P07 invalid/non-rotatable-target proposal; existing P05 mandatory facing API | Supplies a non-rotatable target representation through a two-line additive type change; existing P05/P06 enemies retain behavior. Missing/invalid facing rejects rather than throwing in ability use. |
| Invalid eligibility/target/direction: atomic explicit error; no spend | P07 Required contracts / AC2–4,6; P03 public envelope | Illegal ability or impersonation → `illegal-ability`; illegal/dead target → `illegal-target`; malformed direction → `invalid-command`. |
| Directional reduction 2; Close threshold 2 | Existing P06 and P02 owners, referenced via `DEFAULT_DAMAGE_RULES` | Avoids competing constants; Compact distance 1 is Close, Spread distance 4 Stretched on the delivered two-ring board. |
| Post-action phase: remain player unless P06 settlement ends combat; maneuver stays unchanged | P07 Proposed implementation / AC7; P03 settled economics | Allows maneuver before, between or after Brood actions; terminal victory correctly retains the one action/revision cost. |
| Rules version `p07-v1`; explicit experimental `AbilityRules` supported | P07 proposed versioned content/shared legality | Makes configuration identifiable for downstream fixtures/previews without a generic ability scripting system. |

Tests supply independent controlled AC tuning: attack amounts 4/4/6/3, reductions 2/2, Close threshold 2; a separate nondefault case supplies Claw 9 and directional reduction 3, yielding damage 6. This protects the specified arithmetic without permanently freezing provisional defaults. Artificial unit HP is Brood 10/max 10, enemies 20/max 20, with explicit wounded/dead variations. P08 still owns encounter HP and enemy turns.

## Numbered acceptance evidence

All cases are in the new [abilities.test.ts](../../../poc-001-linked-formation/tests/abilities.test.ts) and passed on the committed candidate. Exact numeric and area expectations use independent literals, not results from production selectors.

| Criterion | Observable evidence |
| --- | --- |
| 1 | Six `AC1: … deals configured …` cases: Claw/Sting damage 4 to unprotected HP20 → 16, damage 2 through a facing-zero living Warder → 18; Gale damage 3 to either → 17. State/action/revision and damage events are asserted. |
| 2 | Six `AC2: protected Impale … Spread orientation` cases align the protecting Warder with Girtablilu and get raw/final 6, reduction 0, HP20 → 14 at every orientation. Compact and either/both fallen-partner cases reject unchanged with `illegal-ability`; Sting remains legal. The expansion sequence changes rejected Impale to accepted using current links. |
| 3 | `AC3: Shelter installs …` creates one status/event with one action/revision. Five rejection cases cover self, Fallen, enemy, Stretched and missing target. Later raw5 hit leaves HP7 while Close and HP5 after a legal expansion, consuming the status both times. The same-blast case fells Ugallu but leaves Girtablilu HP9 / Pazuzu HP7; expiry is delegated and idempotent. |
| 4 | Four signed/wrap cases assert facing 0→1, 0→5, 5→0, 5→4; independent area coordinates rotate exactly one signed step. Marks, unrelated/non-turnable areas, HP and max HP remain intact. One facing event and one turned-area event are emitted. A later Claw immediately loses Warder mitigation. Non-rotatable, missing, Brood, Fallen, missing/invalid-facing targets and invalid directions reject unchanged. |
| 5 | Twelve `AC5: every living Brood …` cases each exercise the intact roster and each possible Fallen partner: 108 accepted reliable attack uses across the matrix. All available actors pass legality/dispatch, lower enemy HP, and retain Brood data/formation. No adjacency or hidden movement appears. |
| 6 | Twelve `AC6: … legality agrees` cases cover acted actor, impersonation, defeated enemy, unknown/foreign/Fallen actor, stale revision, enemy/victory/defeat phase, Brood/missing target. Query and dispatch errors agree for registered abilities; result state is the input object, budgets/events unchanged. Separate unknown-ID compatibility, arbitrary actor IDs and identity collisions are tested. |
| 7 | `AC7/C4: attack, maneuver, attack` starts Compact1: Claw loses 2 through protection, clockwise moves to Compact2, Sting loses 4 with current unprotected access; final revision3, acted U/G, one maneuver. A second sequence enables Impale by expansion. Another uses all three actions before a still-legal maneuver. Each of the six serializable replay cases asserts one action event, revision1 and frozen input purity; lethal ability adds victory with the same one action/revision. |

Checkpoint C1 is covered by content membership and typed command definitions; C2 by six isolated effect tests and legality rejection coverage; C3 by public dispatch plus the unchanged P03/P06 regressions; C4 by the two attack/maneuver/attack sequences and all six deterministic serializable replays.

## Exact verification and limitations

All application checks used the repository-root `just` recipes in default Docker mode (Bun 1.4.2). Required final checks ran after committing the technical candidate above. The later commit contains only this report and the unchanged assignment.

| Exact command | Result |
| --- | --- |
| `just poc-001-install` | Initial sandbox exit 1, Docker inaccessible; escalated retry exit 0, frozen lockfile, 43 packages installed. |
| `just poc-001-test tests/abilities.test.ts tests/commands.test.ts tests/intents.test.ts tests/damage.test.ts` | Exit 0 before commit; 244 tests then (82 initial P07 cases, 37 P03, 77 P05, 48 P06), P07 1,018 assertions. |
| `just poc-001-test tests/abilities.test.ts` | Exit 0 on final candidate; 84 tests, 1,040 assertions in one file. An intermediate precommit run passed 83/1,030 before the arbitrary-ID case was added. |
| `just poc-001-test` | Exit 0 on final candidate; 362 tests across eight files: 84 P07, 92 formation, 37 commands, 77 intents, 48 damage, 19 view, 3 assets, 2 smoke. Existing instrumented counters plus P07 total 3,769; view/assets/smoke are not instrumented for that sum. |
| `just poc-001-typecheck` | Exit 0 on final candidate; also passed precommit with the ability source/tests. One sandbox attempt could not start (exit101, full `/tmp`); a later ordinary attempt exited1 for Docker access. Escalated Docker execution passed. |
| `just poc-001-build` | Exit 0 on final candidate; 20 modules transformed, prepared nine asset/attribution files, existing >500 kB Phaser chunk warning. |
| `git diff --check` | Exit 0 on final candidate. |
| `git diff --check 08dc630..HEAD` | Exit 0 on final candidate, including all committed technical changes. |
| `git diff --exit-code 08dc630 HEAD -- poc-001-linked-formation/tests/commands.test.ts poc-001-linked-formation/tests/damage.test.ts poc-001-linked-formation/tests/intents.test.ts poc-001-linked-formation/tests/formation.test.ts poc-001-linked-formation/tests/view.test.ts poc-001-linked-formation/tests/asset-copy.test.ts poc-001-linked-formation/tests/smoke.test.ts poc-001-linked-formation/tests/browser-lab.mjs` | Exit 0; all prior test files unedited. |
| `PATH=/home/metatron/.bun/bin:$PATH bun install --frozen-lockfile` in `.agents/skills/ruach-handoff` | Exit 0 with escalation; six ignored validator dependencies installed. No generated tracked skill file changed. |
| `PATH=/home/metatron/.bun/bin:$PATH bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p07-brood-abilities/implementer.md --repo /opt/dev/tehom-brainlab-p07` | Exit 0; `ok: true`, empty diagnostics, baseline/candidate/tested revisions resolve. Validates structure/references, not implementation acceptance. |

The transient full `/tmp` blocked one tool invocation before its file writes or typecheck started; scoped writes and checks continued with escalation until the sandbox recovered. No unrelated cleanup was performed. Docker, worktree Git-index access and ignored validator dependency writes also required escalation. No approval review rejection occurred.

No browser check was required or run. Unit tests/build do not establish a playable encounter, preview equivalence, balance or human playtest results. Independent review, Coordinator acceptance and main-checkout delivery remain outside this assignment. No blockers remain for the implementation handoff.

## Proposed protected-document corrections

For the Coordinator after review/acceptance: update P07 draft/unimplemented and unassigned-owner status, record this candidate/check evidence in CURRENT/TASK_LOGS and the plan index, and link this report. P05's Amendment TR status still says not yet implemented despite delivered TR code at the supplied baseline; reconcile it with the existing two-ring-board handoffs. Older P03/P06 README paragraphs describe every ability as unsupported; the added P07 section explicitly supersedes those statements while preserving unsupported unknown IDs/basic states. Older P02 README evidence and brief acceptance prose also retain historical pre-combat status. These are correction proposals only; protected documents and unassigned README sections were not edited.
