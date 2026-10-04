task: P06-impl
status: complete
outcome: P06.C1–C4 and acceptance criteria 1–7 implemented and verified; independent review pending.
role: implementer
source_baseline: 04bd6a28bd21f5248cd18de59cbf5efbc408b6a1
candidate_revision: 2be2d85c3395ada92f88bd4edd0f0b23d32930ea
tested_revision: 2be2d85c3395ada92f88bd4edd0f0b23d32930ea
artifacts:
  - docs/mailbox/p06-damage-and-fallen/assignment-implementer.md
  - docs/mailbox/p06-damage-and-fallen/implementer.md
  - poc-001-linked-formation/src/core/damage.ts
  - poc-001-linked-formation/src/core/lifecycle.ts
  - poc-001-linked-formation/src/core/state.ts
  - poc-001-linked-formation/src/core/commands.ts
  - poc-001-linked-formation/src/core/transition.ts
  - poc-001-linked-formation/tests/damage.test.ts
  - poc-001-linked-formation/README.md
verification:
  - "just poc-001-install: exit 0 after Docker sandbox escalation; frozen Bun 1.4.2 install."
  - "just poc-001-test tests/damage.test.ts tests/intents.test.ts tests/commands.test.ts: exit 0 at candidate; 158 tests / 1351 instrumented assertions (P06 46/295, P05 75/803, P03 37/253)."
  - "just poc-001-test: exit 0 at candidate; 250 tests across five files; 4700 instrumented assertions plus two uninstrumented P01 expectations."
  - "just poc-001-typecheck: exit 0 at candidate."
  - "just poc-001-build: exit 0 at candidate; existing large Phaser chunk warning."
  - "git diff --check and git diff --check 04bd6a28bd21f5248cd18de59cbf5efbc408b6a1..HEAD: exit 0 at candidate."
  - "PATH=/home/metatron/.bun/bin:$PATH bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p06-damage-and-fallen/implementer.md --repo /opt/dev/tehom-brainlab-p06: exit 0; ok true, three revisions resolved, no diagnostics."
review: not-run
discoveries:
  - "P06 adds CombatState, attack command dispatch, generic CommandResult and event/error variants to P03; P05 selectors/types and all P01–P05 tests remain unchanged."
  - "P07 must integrate combat-state ability effects with P03 accounting: existing ActionRules.apply returns only Brood data and cannot return enemy/effect collections. P06 attack settlement deliberately preserves action budgets."
  - "Docker daemon access, linked-worktree Git-index writes, and ignored handoff-validator dependency installation required sandbox escalation; all application checks stayed in default Docker mode."
  - "CURRENT still describes P05 as future work in several passages; prototype README retains stale P02 evidence. Proposed protected-document corrections are listed below."
blockers: []

Author: P06 Implementer. Date: 2026-10-04 UTC. Workspace `/opt/dev/tehom-brainlab-p06`, branch `p06-damage-and-fallen`. Governing [assignment](assignment-implementer.md), [P06 plan](../../plans/2026-10-02-4c3c0d42-poc-001-damage-and-fallen.md), [defaults ownership](../../plans/README.md#ownership-of-provisional-defaults), [testing policy](../../adr/0006-contract-invariants-and-black-box-testing.md), and [handoff protocol](../../../.agents/skills/ruach-handoff/SKILL.md). The supplied BASE matches the actual starting revision. The assignment is included unchanged with this report; its recording commit is returned separately in the terminal handoff.

The candidate contains seven technical/documentation paths. No merge, push, browser check, or human playtest was performed. Independent review, Coordinator acceptance and delivery remain separate work.

## Changes and checkpoints

| Changed path | Result |
| --- | --- |
| [`damage.ts`](../../../poc-001-linked-formation/src/core/damage.ts) | C1/C2: validates the entire packet before effects, calculates per-recipient mitigation from one pre-hit snapshot, batches HP, consumes Shelter, records attack identity, advances revision once, and invokes lifecycle settlement. |
| [`lifecycle.ts`](../../../poc-001-linked-formation/src/core/lifecycle.ts) | C2/C3: positive-to-zero Fallen events, source/target effect cleanup, P05 intention cancellation, inert slots and terminal outcome. C4: explicit idempotent Shelter expiry. |
| [`state.ts`](../../../poc-001-linked-formation/src/core/state.ts) | Additive `CombatEnemy`, `Shelter`, `CombatState`: typed P05 declarations/protection relations, enemy max HP and processed attack IDs; base `GameState` and initial fixture unchanged. |
| [`commands.ts`](../../../poc-001-linked-formation/src/core/commands.ts) | Additive attack command, damage/lifecycle event variants, two error codes and optional generic result-state parameter; existing commands/events/errors retain behavior. |
| [`transition.ts`](../../../poc-001-linked-formation/src/core/transition.ts) | Dispatches attack settlement through the existing `applyCommand` boundary and preserves CombatState result typing; basic snapshots reject attacks. Existing P03 guards and actor hooks unchanged. |
| [`damage.test.ts`](../../../poc-001-linked-formation/tests/damage.test.ts) | 46 observable contract cases / 295 executed assertions, with explicit mitigation tuning and independent numeric expectations. |
| [`README.md`](../../../poc-001-linked-formation/README.md#damage-and-fallen-p06) | P06 public shapes, validation, accounting, event ordering, defaults, caller responsibilities and expiry contract. Only the assigned P06 section added. |

P05 `selectProtection`, `isCloseLinked` and `selectRecipients` supply eligibility and cancellation. There is no duplicate mask, targeting geometry, or Close-link algorithm. Enemy attacks receive recipient IDs selected by P05 at impact; player ability legality/creation remains P07. An attack's source and all recipients must be living known entities; recipients are unique, and the entire batch rejects if any recipient is invalid. No actor allowance is spent by this settlement seam.

## Explicit provisional defaults

All five P06-owned families adopt the plan's proposed policies. These choices implement experimental fixtures, not balanced combat rules.

| Family / value | Source | Reason |
| --- | --- | --- |
| Hit batching: one pre-hit snapshot for every recipient; apply all HP, then settle deaths/effects; separate attacks sequential | P06 Proposed implementation and experimental defaults; Required contracts | Same blast can fell a guardian without invalidating its protection mid-batch; recipient iteration order cannot change outcomes. |
| Mitigation: directional 2 once, then Shelter 2 once; each subtraction and final damage clamp at zero; HP clamps to `[0,maxHp]` | P06 proposed defaults and AC1–3 | Implements the specified fixtures without introducing resistances, randomness or stacking. `DamageRules` exposes explicit nonnegative safe integer amounts and Close threshold for tuning. |
| Directional sources / Shelter statuses do not stack within each category | P05 exposes boolean eligibility and unique sources; P06 owns the amount/stacking decision | Multiple eligible sources still grant the documented two-point protection, rather than silently multiplying it. |
| Bypass skips directional mitigation; Shelter remains independent | P05 public protection contract and P06 directional-bypass wording | Preserves the delivered P05 meaning of bypass. |
| Shelter: living player source and target, current Close link at impact; consume every status on a positive-raw hit target, including ineligible statuses; zero raw consumes none | P06 proposed defaults and AC2–3; P05 `isCloseLinked`; P02 `CLOSE_THRESHOLD` currently 2 | Expansion/death removes eligibility without refunding the action; eligible protection can survive guardian death within the same batch. Close tuning stays owned by P02. |
| Shelter expiry: remove all remaining statuses when P08 invokes `expireShelters`; one revision if changed, no revision/events on repeat | P06.C4, AC7 and P03 revision accounting convention | Makes an externally observable status change invalidate stale commands while preserving idempotence; P08 owns scheduling/round resets. |
| Fallen slots: preserve formation, roster identity, labelled position and existing budgets; zero HP defines Fallen | P06 proposed defaults, settled formation choices and AC4–5 | Retains inert markers and geometric dead links; P03/P05 already exclude them from actions and active effects. No compaction, refill, revival or extra Fallen flag. |
| Terminal: all player Brood fallen → defeat; otherwise all enemies fallen → victory; all-dead → defeat | P06 proposed defaults and AC6 | Gives simultaneous deaths one deterministic precedence and rejects later gameplay at the P03 boundary. Empty living sets count as fallen; valid encounter construction is the caller's responsibility. |
| Stable attack identity: encounter-wide `resolvedAttackIds`; reject reuse even with a fresh revision | P06 Required contracts (no repeated animation damage); P03 atomic rejection/revision convention | Revision guards block ordinary replay; the identity ledger also blocks callbacks that refresh the revision. IDs must identify individual attack occurrences, including round when a declaration repeats. |
| Events: attack header, recipient damage, consumption, Fallen, protection removal, Shelter removal, intention cancellation, terminal outcome; IDs sorted by code points | P06 deterministic/order-independent required contracts; local P06 event schema | Reproducible traces do not depend on recipient, effect or entity input-array order, runtime locale, or animation timing. Stored entity/declaration arrays keep their original order. |

## Numbered acceptance evidence

All references below are tests in [`damage.test.ts`](../../../poc-001-linked-formation/tests/damage.test.ts), executed on the candidate. Required values are independent arithmetic/fixtures, not expected results calculated through production selectors.

| Criterion | Observable evidence |
| --- | --- |
| 1 | `ordinary raw five hit` produces HP 5 from HP 10 through `applyCommand`, exact events and one revision with budgets preserved. `eligible directional protection` explicitly supplies two-point reduction: HP 7; bypass: HP 5. Facing/living-source/nonstacking tests additionally verify P05 eligibility consumption. |
| 2 | `Shelter mitigates positive raw` tests zero and positive hits, including damage fully absorbed and consumption only on positive raw. `expansion before impact` executes a P03 maneuver before hitting Girtablilu: HP 5 from raw 5, Shelter consumed, Ugallu's spent action retained. Fallen/missing source tests yield no mitigation. Bypass and stretched-zero tests verify independent Shelter eligibility and zero consumption. |
| 3 | `same-blast guardian death` obtains the three recipient IDs through P05 splash selection, explicitly supplies raw 3/Shelter 2, and gets Ugallu 0 (from 2), Girtablilu 9, Pazuzu 7 (both from 10). All six recipient permutations produce exactly the same result/events. A later raw-3 hit leaves Girtablilu at 6. A guardian-only death removes both unused source-dependent Shelters. A parallel Warder batch test verifies directional protection survives source death in the batch and disappears for the next hit. |
| 4 | `overkill nine against HP two` clamps HP to 0 and yields exactly one `fallen`; `settleLifecycle(result.state,result.state)` returns the same snapshot with no events. A later hit on that Fallen target rejects unchanged. |
| 5 | `Fallen keeps its labelled slot` preserves shape/orientation, all IDs and Brood labels, P02 positions and budgets. P05 active links retain only Girtablilu–Pazuzu; Close eligibility with Ugallu is false. The P03 actor boundary rejects Ugallu before any hook executes. Marked hit/splash on Ugallu cancel, while a fixed area remains declared. `dead Warder cancels` removes its area and mark, removes its protection, preserves another source's splash, and demonstrates no protection on the subsequent hit. |
| 6 | Both `final death yields` variants use raw 9 on final HP 2: final enemy → victory; final Brood → defeat. Every existing command kind plus attack and actor-hook actions rejects afterward with exact unchanged state and empty events. Existing unsupported-command precedence remains intact. The synthetic batch killing all three Brood plus final enemy emits only defeat. Repeated terminal settlement emits nothing. |
| 7 | `expiry removes unused Shelter once` removes two remaining Shelters in enemy phase, emits one expiry per ID, increments revision once and preserves round/phase/budgets. The repeated call has no events or revision change and returns the same state object. |

Additional boundary coverage: negative/fractional/nonfinite/unsafe/nonnumeric/missing raw amounts; blank IDs, duplicate recipients, malformed recipient collection/bypass; missing source/recipient and a partly invalid batch; stale revision; Fallen source; invalid tuning; duplicate attack ID with refreshed revision; and basic P03 state without combat fields. Every rejection returns its input state object and empty events. Deeply frozen inputs and serialized replay verify purity and deterministic results. An empty P05 fixed area settles exactly once with no damage.

## Ordered event traces

These traces show the ordered events from the executed fixtures; exact assertion scope is stated below. The event schema is exported by the candidate.

Ordinary raw-5 hit, HP 10:

```json
[
  {"type":"attack-settled","eventId":"hit-1","sourceId":"censer","revision":1},
  {"type":"damage-applied","eventId":"hit-1","targetId":"ugallu","rawDamage":5,"directionalReduction":0,"shelterReduction":0,"damage":5,"hpBefore":10,"hpAfter":5}
]
```

Raw-3 splash; Ugallu HP 2, others HP 10, Shelter Ugallu→Girtablilu; a separate marked hit on Ugallu is cancelled:

```json
[
  {"type":"attack-settled","eventId":"hit-1","sourceId":"censer","revision":1},
  {"type":"damage-applied","eventId":"hit-1","targetId":"girtablilu","rawDamage":3,"directionalReduction":0,"shelterReduction":2,"damage":1,"hpBefore":10,"hpAfter":9},
  {"type":"damage-applied","eventId":"hit-1","targetId":"pazuzu","rawDamage":3,"directionalReduction":0,"shelterReduction":0,"damage":3,"hpBefore":10,"hpAfter":7},
  {"type":"damage-applied","eventId":"hit-1","targetId":"ugallu","rawDamage":3,"directionalReduction":0,"shelterReduction":0,"damage":3,"hpBefore":2,"hpAfter":0},
  {"type":"shelter-consumed","shelterId":"shelter-g","targetId":"girtablilu","eligible":true},
  {"type":"fallen","entityId":"ugallu","owner":"player"},
  {"type":"intention-cancelled","intentionId":"mark-u","reason":"target-fallen"}
]
```

Final enemy, raw 9 against HP 2 (Ugallu source):

```json
[
  {"type":"attack-settled","eventId":"hit-1","sourceId":"ugallu","revision":1},
  {"type":"damage-applied","eventId":"hit-1","targetId":"last","rawDamage":9,"directionalReduction":0,"shelterReduction":0,"damage":9,"hpBefore":2,"hpAfter":0},
  {"type":"fallen","entityId":"last","owner":"enemy"},
  {"type":"combat-ended","outcome":"victory"}
]
```

Final Brood, raw 9 against HP 2 (Censer source):

```json
[
  {"type":"attack-settled","eventId":"hit-1","sourceId":"censer","revision":1},
  {"type":"damage-applied","eventId":"hit-1","targetId":"ugallu","rawDamage":9,"directionalReduction":0,"shelterReduction":0,"damage":9,"hpBefore":2,"hpAfter":0},
  {"type":"fallen","entityId":"ugallu","owner":"player"},
  {"type":"combat-ended","outcome":"defeat"}
]
```

The terminal tests assert phase and the exact Fallen/terminal suffix; the ordinary/splash tests assert full sequences. This report expands the shared attack header/damage schema into the terminal traces above. No renderer/animation execution is claimed.

## Verification and environment

Final checks executed after committing `2be2d85c3395ada92f88bd4edd0f0b23d32930ea`:

| Exact command (worktree root) | Exit / result |
| --- | --- |
| `just poc-001-test tests/damage.test.ts tests/intents.test.ts tests/commands.test.ts` | 0; 158 tests in 3 files; P06 46/295, P05 75/803, P03 37/253 tests/assertions; total 1351 instrumented assertions. |
| `just poc-001-test` | 0; 250 tests in 5 files; prior three plus unchanged P02 90/3349 and P01 2 tests. Total 4700 instrumented assertions; P01 contains one expectation per test without assertion-counter instrumentation. |
| `just poc-001-typecheck` | 0; `tsc --noEmit`. |
| `just poc-001-build` | 0; Vite 8.3.2 static build; 7 modules, existing large Phaser chunk warning. Browser consumer remains the existing shell. |
| `git diff --check` | 0. |
| `git diff --check 04bd6a28bd21f5248cd18de59cbf5efbc408b6a1..HEAD` | 0. |

Setup: initial sandboxed `just poc-001-install` exited 1 (`Docker daemon inaccessible`). The same command with sandbox escalation exited 0, frozen lockfile install: Bun 1.4.2, 43 packages. Application verification used the default Docker wrapper with escalation and Vitest 5.0.3; no host-mode application run occurred. Development focused tests/typecheck also passed before commit (first 44 P06 cases/282 assertions, then final 46/295); final results above supersede those preliminary runs.

The first sandboxed Git staging attempt exited 128 because the linked worktree index lives under `/opt/dev/tehom-brainlab/.git/worktrees/tehom-brainlab-p06`. Escalation allowed staging/committing only this task's paths. Validator dependency setup ran `/home/metatron/.bun/bin/bun install --frozen-lockfile` in `.agents/skills/ruach-handoff` with escalation: exit 0, 6 pinned packages in ignored `node_modules`; no generated tracked skill definition changed.

`PATH=/home/metatron/.bun/bin:$PATH bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p06-damage-and-fallen/implementer.md --repo /opt/dev/tehom-brainlab-p06` exited 0: `schema_version:1`, `ok:true`, all three revision references resolved, `diagnostics:[]`. This establishes report structure/revision resolution, not independent review.

No independent review, browser session, human playtest, routing regression, or deliberate mutation-testing tool was run; none is required for this headless assignment. Existing P01–P05 tests, selectors, assets, view/main, protected documents and plan files remain unchanged.

## Discoveries and proposed follow-up

P03's existing `ActionRules.apply` returns only Brood data. P07 needs a bounded additive dispatcher/effect seam for enemy HP and typed combat effects while preserving the one-action/one-revision contract. P06 exposes the trusted `settleLifecycle(before,after)` seam without revision changes and a complete independently usable attack boundary; it does not implement P07 action legality or application. P08 must build valid enemy/max-HP data, resolve declarations at impact, use occurrence-unique event IDs, and schedule `expireShelters`. No enemy order, attacks, Shelter creation, round resets or rendering was added.

Proposed Coordinator-owned corrections: CURRENT's delivered-repository paragraph, sequence/status paragraphs and combat-future statements lag accepted/delivered P05; reconcile with [P05 handoff](../p05-intent-semantics/implementer.md), [plan index](../../plans/README.md) and BASE `04bd6a28bd21f5248cd18de59cbf5efbc408b6a1`. On acceptance, record P06's actual checks and update its draft/unassigned status from this evidence. The prototype README also retains stale P02 review/delivery claims outside the assigned section; prior handoffs already identify those. No protected-document or unrelated status edits were made. P03 optional O1–O3 remain open and unchanged.

No implementation or verification blocker remains. Technical content is isolated in the candidate above; the later report commit only records the unchanged assignment and this evidence.
