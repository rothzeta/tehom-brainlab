task: COUNCIL-poc002
role: architect
author: sol-b
status: complete
outcome: "Independent recommendation and executable first combat specification; proposals require council selection."
source_baseline: c82ec3c
artifacts:
  - docs/mailbox/poc-002-council/architect-sol-b.md
verification:
  - "Read assignment, both sources, governing documentation, relevant POC 001 source and recorded playtest findings."
  - "python3 arithmetic check: exit 0; Guard first HP 26, poison line HP 18, Warden solo 12 rounds/30 HP, duo life trace 56/42/32/18/8, trio trace 56/32/12."
  - "bun install --frozen-lockfile in /tmp/council-sol-b-handoff.sTwve3/ruach-handoff: exit 0; 6 packages installed."
  - "bun /tmp/council-sol-b-handoff.sTwve3/ruach-handoff/scripts/validate.ts docs/mailbox/poc-002-council/architect-sol-b.md --repo .: exit 0, ok true, diagnostics []; source_baseline resolved to c82ec3c71a499760fc2bf7c40c9b162a6856d03b."
review: not-run
discoveries:
  - "Component removal can make encounters harmless; preventing that universally would expand this experiment unnecessarily. Measure the resulting cleanup."
blockers: []

# Recommendation and authority

Build **`poc-002-component-combat/`**, a deterministic battle laboratory asking whether sacrificing life damage to remove enemy functions produces decisions worth repeating. Preserve POC 001. Test ordinary encounters before polishing the boss. The specification below is my new proposal and provisional tuning, not an accepted combat design or balance result.

**User decisions**, carried from [the assignment](assignment-council.md) and [source 2](source-2-decisions.md): combat selection and a three-fight gauntlet only; Phaser/TypeScript now; game-owned simulation; later C#/.NET rules with Godot presentation and recorded-battle parity; 32×32 exploration tiles, 640×360 exploration viewport, separate large combat illustrations; world scale deferred. No exploration, quests, recruitment, production saving or campaign architecture enters this implementation.

## Source assessment against c82ec3c

- Source 1's stale-entry-point finding is accurate: `README.md:29,58` still says unplayable/unimplemented, while `docs/CURRENT.md:195–207` records the Collector, eight browser harnesses and 581 unit tests. These are historical verification claims, not checks I reran. CURRENT itself retains historical/stale summaries (`docs/CURRENT.md:7,28,207`); read its later sections and source together.
- Command validation/accounting, previews and replay are real: `src/core/transition.ts:100–135`, `preview.ts:112–153`, `run-record.ts:25–36,249–266`, all under `poc-001-linked-formation/`. Source 1 correctly identifies mandatory formation (`state.ts:17–26`), fixed-roster record validation (`run-record.ts:117–123`), partner-dependent Impale (`abilities.ts:76–83`), and immediate-damage Sting (`abilities.ts:116–125`). These are copying constraints, not reasons to retrofit POC 001.
- The negative design findings are supported, with limits: `docs/mailbox/ai-playtest-20261005/scout-1.md:89–92` records the candidate Expand/Harrier routine; `docs/mailbox/p17-collector/implementer.md:151–165` compares nine controlled cases and explicitly rejects universal optimality/enjoyment claims. Position-independent patrol target selection is visible in `src/core/rounds.ts:20–37`. The human observation is recorded in `docs/adr/0004-repository-and-poc-direction.md:77`. The original automated record explicitly lacks human evidence (`docs/playtests/2026-10-05-poc-001-p11-automated.md:43–57`).
- The toolchain and seven symbolic assets are accurately described (`poc-001-linked-formation/package.json:6–25`; `assets/manifest.json:3`). Art availability beyond these emblems is unverified.

I found no substantive factual error in source 1's enumerated repository claims. I accept its independent prototype, survival-budget and information-clarity recommendations. Its exploration slice is superseded by the user's narrower decision. I disagree with delaying reproducible records until the fourth delivery: capture them with the first battle. I also reject treating six menu headings as a minimum product: unsupported commands add misleading affordances. Source 2's kits and separable integrity are useful proposals; neither its roster substitution nor its boss schedule establishes balance. Literature claims are not independently re-reviewed here and supply no numerical acceptance evidence.

## Decisions recommended for acceptance

| Decision | Recommendation |
| --- | --- |
| Folder | `poc-002-component-combat`; dungeon-combat implies excluded exploration; linked-tactics implies the old model. |
| Anzû/Pazuzu | Use **Anzû**, explicitly a different POC 002 character/content ID. POC 001 remains Pazuzu (`docs/prototypes/poc-001-linked-formation.md:83–87`). Do not silently rename its assets or records. |
| Declarations | Show exact action, component dependency, damage, target and resolution order before every player phase. Keep canceled declarations visibly crossed out. Revoke depends on this contract. |
| Item/Talk/Escape | Defer all three, omit their buttons, and supply laboratory Reset/Return to selection. No inventory or retreat outcome; Hold therefore tests attack setup rather than escape restriction. Add escape only in a separate experiment requiring it. |
| Reuse | Copy command/rejection, revision guards, shared preview/dispatch, plain event records, local toolchain and provenance patterns. No POC 001 runtime imports or shared engine. Its geometry, fixed roster and codec are unsuitable. Root just recipes delegate to prototype-local scripts. |
| Information/art | Visible exact numbers; synchronized component list/illustration targets, keyboard selection, generous hit regions and destroyed states. Use placeholders immediately, then one representative illustration before external tests. 1280×720 combat UI is a proposal, separate from the decided exploration viewport. |
| Viability | Fixed enemy numbers for all party sizes; no hidden compensation. Support all seven unique nonempty subsets of the three Brood. Establish one viable solo Warden line, not a promise that every solo clears every encounter or the gauntlet. |

This follows independent local ownership in `docs/adr/0004-repository-and-poc-direction.md:13–15,53–57`, aggregation in ADR-0005:19–23, and demonstrated reuse in `README.md:45–48`. Acceptance must settle the proposed roster, declarations, menu deferrals, solo target and Revelation rule before implementation; no further architectural investigation is blocking.

## Draft numerical specification v0.1

All quantities are integers; hits are guaranteed; no criticals, speed, random targeting, mana, cooldowns or player components. Every player action costs its actor's one activation. “+R” is Revelation gained, not a resource prerequisite. All unlisted damage, armor, gains and effects are zero.

### Turn and effect ordering

1. Encounter starts at round 1, player phase, unused living actors; a new laboratory run starts revision 0. Declare enemy actions from the current snapshot in encounter array order. Party tie order is Ugallu, Girtablilu, Anzû, omitting absent/dead members.
2. Player chooses any unused living actor and resolves immediately. Validate command, revision, actor, ability and target before spending anything. Accepted commands advance revision once. Rejections leave state, events and budgets unchanged. `EndPhase` forfeits remaining activations; using the final actor does not automatically end the phase.
3. An action uses form modifiers present **at action start**. Apply damage/status installation/consumption, then any recoil; settle deaths immediately. Apply that action's aggregated Revelation gains to survivors and check thresholds once per affected Brood. Then check terminal outcome. A newly triggered form never retroactively changes its triggering action.
4. At EndPhase, expire forms due this round. Tick every poisoned enemy body simultaneously, decrement remaining ticks and remove exhausted poison; settle deaths and check outcome before any enemy acts.
5. Resolve declarations in array order. Recheck living source, required component, suppression and living declared target. Invalid declarations fizzle without retargeting or replacement. AoE names its entire living target list at declaration; dead recipients are skipped. Resolve all recipients of one AoE simultaneously, then deaths, aggregated Revelation, surviving intercept counter, and outcome.
6. After enemy actions, expire Guard, grounding, interception, suppression, unused weaken, and holds due this round. Increment round, refresh living activations, declare anew. Never advance a terminal battle.

Death at HP/life 0 is immediate, irreversible and removes pending actions and source-dependent protection/intercepts/holds. Dead Brood lose forms, statuses and R; there is no revival. Victory requires every enemy life 0; destruction alone never wins. If both sides die in one action, defeat takes precedence. Finish the triggering action's recoil/cost accounting before the terminal check; cancel subsequent actions, ticks and counters.

### Targets, damage and status rules

Enemy body/core targets life; other components target integrity only. Overkill never spills between them. Integrity 0 permanently removes the named function and invalidates that component target. Enemy death invalidates all its targets. Core life can end combat with components intact. Player actions require a currently valid target, not merely one that appeared valid at selection.

Physical damage = raw plus form/hold bonuses, then weaken, then subtract target physical armor and protection, floor at 0, then Guard. Magical damage bypasses physical armor but respects protection and Guard. Poison and recoil bypass all mitigation. Guard rounds remaining damage **up**: normal `ceil(d/2)`; Girtablilu's Rupture Guard `ceil(3d/4)`. Brood armor is 0. Ugallu's Rupture adds 2 to incoming physical/magical raw damage before mitigation. Damage cannot become healing.

| Status | Exact behavior |
| --- | --- |
| Poison | One packet per enemy: potency and remaining ticks. Envenom replaces it with the caster's current potency and 3 ticks, never adds stacks. First tick is the coming EndPhase. Rupture Venom removes the packet and deals `potency × remainingTicks` directly to life immediately. No poison against nonliving components or inaccessible cores. Existing packet potency does not change with forms. |
| Weaken | Next physical damage action by that enemy uses `ceil(raw/2)` after bonuses; consumed on execution, even if mitigated to 0. A canceled action does not consume it. No stacking; refresh until the coming enemy phase ends. |
| Hold/clamp | Does not remove an activation. Tags one victim for that enemy's next weapon bonus; expires after the following enemy phase, or immediately when its source clamp/restrainer dies/breaks. Multiple enemies' holds are independent. A weapon action consumes its own hold on execution. No bonus when attacking a different victim. |
| Protection | Scribe hand passively subtracts 2 from physical/magical damage to its assigned other enemy, including components. Assign first other enemy in encounter order at encounter start; no replacement beneficiary after death. No stacking, poison reduction or transfer to Scribe. Breaking hand or killing Scribe ends it immediately. |

### Brood actions

HP starts full, R starts 0; Revelation capacity/threshold is **6 for all three**. Targets below always mean living/valid targets.

| Brood / HP | Attack, +0R | Skill 1 | Skill 2 | Guard |
| --- | --- | --- | --- | --- |
| Ugallu / 42 | Claw: 8 physical to body or component | Rend: 14 physical to component, 5 to body; +1R | Hold the Threshold: choose self/ally; intercept its first physical hit this enemy phase, redirect to Ugallu, halve resulting damage, then counter attacker body for 6 physical if Ugallu and attacker survive; +1R | Self; halve all incoming physical/magical damage through coming enemy phase |
| Girtablilu / 30 | Pincer: 6 physical to body/component | Envenom: body only, poison potency 4 ×3 ticks and immediate weaken; +1R | Rupture Venom: poisoned body only, cash remaining packet; +1R | Same |
| Anzû / 28 | Talon: 5 physical to body/component | Stolen Bolt: 10 magical to body/component; +2R | Revoke: one uncanceled declared action with an intact non-body component dependency; suppress just that action for this enemy phase; +3R | Same |

Guard costs no R. Guard and Hold set their actor's **grounded** flag through enemy-phase end; Hold does not ground its beneficiary. Grounding persists after intercept consumption. Redirect before mitigation, using Ugallu's defenses and granting damage R only to Ugallu. Hold's halving never multiplies Guard; use the better reduction. Consume the intercept on the first executed physical hit even if mitigated to 0. Non-damage clamp effects stay on the original living target; magic and Revelation never redirect. Counter starts after threshold settlement, uses Ugallu's then-current form, respects armor/protection and cannot trigger another intercept. Revoke never disables passive protection, releases an existing hold, or refunds an ally's spent action.

### Revelation and six forms

Gain the listed skill R after effects; additionally +1R per executed enemy damage action causing positive HP loss, and explicit enemy Revelation below. One Choir action causing HP loss and +2R therefore grants +3R. No R from poison, recoil, counters, reading UI or component destruction.

At R≥6 without a form: reset R to 0, discard overflow, enter **Rapture if grounded, otherwise Rupture**. No randomness or choice prompt. Form lasts until EndPhase of round `triggerRound+1`; it modifies subsequent actions only. While transformed, gains accumulate to at most 5 and cannot retrigger; expiry clears the form but preserves that meter. The next positive gain may cross again. No automatic threshold check on expiry and no resurrection through transformation.

| Brood | Rapture | Rupture |
| --- | --- | --- |
| Ugallu | Unbroken Threshold: +3 raw physical to Claw, either Rend target and Hold counter | Misgrown Carapace: +2 incoming physical/magical raw; no outgoing bonus |
| Girtablilu | Crowned Venom: Pincer 8, new Envenom potency 5; cash-out uses captured packet normally | Split Reservoir: new Envenom potency 3; Guard reduces only 25%; cash-out unchanged |
| Anzû | Borrowed Edict: Bolt 13; Revoke +2R instead of +3R | Overwritten Voice: Bolt/Revoke each inflict 4 recoil HP after their normal effect; Talon/Guard remain safe |

Form expiry removes no already-applied poison or hold. Defeat ends the form before threshold gains. Grounding gives controllable Rapture but costs an activation; it is not protection from Revelation itself.

### Enemy definitions and schedules

Numbers `integrity/armor` below refer to physical armor. All cores are accessible from the start except Beast's. Schedules use global battle round, never speed up after destruction. Component loss skips its slot without substitution.

| Enemy | Life; body armor | Components and destruction effects | Declared schedule |
| --- | --- | --- | --- |
| Celestial Guard | 24; 2 | Weapon arm 12/1 removes Slash; restraining limb 8/0 removes Clasp and releases its hold | Odd rounds: arm Slash 8 physical, +4 against its held victim. Even: limb Clasp 2 physical and hold. Target lowest HP ratio at declaration. |
| Naming Scribe | 18; 0 | Tongue 8/0 removes Naming; hand 10/0 removes Ink and passive protection | Odd: Naming +2R to every living Brood, no damage. Even: Ink 4 magical to lowest HP ratio. Hand ward is active from battle start, including before its first action. |
| Corrected Beast | 30; 0 once exposed | Shell 16/3 blocks every core-targeting action until destroyed; locomotion organ 10/1 removes Pounce | Every round: Pounce 10 physical, lowest HP ratio. Shell loss exposes core; locomotion loss does not break shell. |
| Warden of Correct Form | 60; 2 | Saw 20/1 removes Saw; clamp 10/0 removes Clamp/releases hold; choir 12/0 removes Choir | Rounds 1/4/7… Clamp: hold lowest HP ratio, no HP damage. Rounds 2/5/8… Saw: 12 physical, 18 if held; declare held living victim if present, otherwise lowest ratio. Rounds 3/6/9… Choir: 4 magical and +2R to all living Brood. |

Ratio comparisons use integer cross multiplication; ties use party order. Warden has one scheduled action per round, no adds, retaliation, phase change or hidden core action. The proposed damaging Choir keeps saw removal from making it immediately harmless. If every offensive component is removed, enemies may become harmless: record cleanup time rather than invent a fallback attack.

### Selection, gauntlet and arithmetic

Selection offers the three isolated ordinary enemies, all three distinct ordinary pairs, Warden, and gauntlet; every scenario permits any unique solo/duo/trio. Pair order is Guard, Scribe, Beast. Healthy and wounded presets start at full HP or `ceil(70% maxHP)`, respectively; both start R0. Gauntlet: **Guard → Scribe + Beast → Warden**, initially healthy. Carry exact HP, deaths and R; no healing, items, replacements or rewards. Clear all temporary statuses/forms between encounters, retain living R, reset round/budgets and enemy state. Dead actors stay absent; zero survivors ends gauntlet. Transitions require a recorded Continue command, valid only after victory with another gauntlet fight remaining; revision stays monotonic.

**Girtablilu's first exposure, solo Guard:** Envenom deals no immediate life damage; EndPhase poison deals 4, Guard life 24→20. Slash becomes `ceil(8/2)=4`, leaving Girtablilu **26 HP**, R `1+1=2`. Guarding instead leaves 26 HP too but Guard still has 24 life and no poison. Poison thus purchases immediate safety as well as delayed progress. A full Envenom/cash/Envenom/cash line deals `4+8+4+8=24` in four rounds. Incoming damage is `4+2+ceil((8+4)/2)=12`, leaving **18 HP**. The third-round hit triggers Rupture; its penalty does not change the already-captured poison or final cash-out.

**Warden, healthy, no items; constructive lines, not optimality proofs:**

| Party | Actions and arithmetic | Result |
| --- | --- | --- |
| Solo Ugallu | Rend saw twice: `13+13≥20`, before first Saw. Then ten Claws: `10×(8−2)=60`, rounds 3–12. Choir resolves rounds 3/6/9. | Win round 12; `42−3×4=30` HP. Round-6 Rupture expires before the next Choir. |
| Ugallu + Girtablilu | R1 Rend saw 13 + Pincer saw 5; R2 Rend finishes, Envenom ticks 4. R3 Claw 6 + cash 8; alternate Envenom/cash alongside Claw. Remaining life after rounds 2–6: **56,42,32,18,8**. | R7 Claw + cash wins; two Choirs leave **34/22 HP**. R4 Envenom captures potency 4 before triggering Rupture; no later new packet is reduced. |
| Trio, dismantle | R1 Rend saw13 + Bolt saw10 breaks it; Envenom ticks4: life56. R2 Claw6 + cash8 + Bolt10: life32. R3 Claw6 + Envenom tick4 + Bolt10: life12; Choir4 each. | R4 Claw6 + cash8 wins before Anzû acts; **38/26/24 HP**. Anzû's R3 transformation does not recoil on the triggering Bolt. |

**Opening dominance check:** Trio direct-core opening instead deals `6+10+4=20` on R1 and `6+10+8=24` on R2. Warden has 16 life; its held Saw hits Ugallu for18. R3 Claw6 + Bolt10 wins **before Choir**, leaving **24/30/28 HP**. Dismantling trades one extra round and Choir Revelation for 6 more total HP, differently distributed; direct aggression preserves more Anzû/Girtablilu HP and less R. Neither dominates these outcomes. Against solo Guard, Girtablilu's arm-cut line needs three Pincers (`3×5≥12`) plus six body Pincers (`6×4=24`): nine rounds, 14 HP remaining. Poison is better there; Beast's locked core makes poison-first illegal. These examples reject a universal opening across these situations, not all possible dominant policies. Saw-first may still dominate the solo Warden and is an intended falsification target.

## Portable records, tests and delivery

Use prototype-local JSON with stable IDs (`brood.anzu`, `skill.revoke`, `enemy.warden`, `component.warden.saw`), distinct instance IDs and explicit ordered entity arrays. JSON content contains numbers, dependencies and schedule IDs; TypeScript implements a closed set of effect kinds. No scripts, arbitrary expressions, plugin loading or mod API.

Record v1 contains `prototypeId`, `recordVersion`, `rulesVersion`, `contentVersion`, build revision, embedded content/configuration, full initial state, ordered accepted commands with expected revisions and ordered expected events per command, and expected final state. Include gauntlet Continue commands and carried state. Initial state includes meters, forms/expiry, packets, holds, declarations and budgets; imports validate references/invariants. Reject unknown versions and malformed/impossible states atomically. Strings, booleans, null, arrays and bounded integers only; absent optionals use null. Compare parsed objects, ordered arrays/events and integer values, not JSON property order. Record all authoritative transitions, no animation timings, previews, rejected inputs or UI selections. Replay never trusts expected output as input. C# must reproduce every command's ordered events and final state from frozen fixtures; add cross-language encoding fixtures before porting.

Following ADR-0006:7–25 and ruach-testing, automate public-command invariants with explicit test-owned numbers: no invalid spending, preview/commit equality, one activation, simultaneous AoE deaths, canceled/dead-source actions, shell access, no component spill, poison refresh/cash/tick death, intercept death/counter ordering, integer mitigation, all six forms at R5/R6, grounding, active overflow, expiry, recoil mutual death and gauntlet carry. Exact numerical goldens belong to explicitly versioned parity fixtures; tuning changes produce a new content version rather than freeze live defaults in generic tests.

Then sweep seven parties, eight scenarios including gauntlet, two HP presets and starting R0/5. Compare body-rush, disable-first, poison/cash, Guard-before-threshold and Revoke policies; bounded exhaustive search for solo and beam search for duos/trios through 15 rounds. Report wins, casualties, remaining HP/R, action count, first action, harmless cleanup rounds and Pareto outcomes. Repeat key comparisons with ±20% life/damage/integrity; do not silently retune rules to satisfy a script.

Failure signals: no solo winning line; venom dies on first exposure; every successful Girtablilu line first copies melee disabling; the same opening dominates every ordinary pairing; Guard/Revoke never improve a Pareto outcome; harmless-enemy farming improves later gauntlet outcomes; over two mandatory cleanup rounds after the last threat; threshold behavior cannot be predicted; losses make testers immediately reset. Search bounds cannot establish impossibility.

First human test: five external testers, visible rules, isolated Guard then mixed pair and Warden, followed by gauntlet if understood. Record actual commands and separate explanations: predicted first damage, intended component consequence, anticipated transformation, and whether they continue after a death. Fail readability if two testers cannot explain a canceled attack/threshold after one demonstration. Observe unprompted second-attempt changes; ability-use frequency alone is not success.

Recommended ordered artifacts: next unused ADR in `docs/adr/` for combat-only direction and ownership; `docs/prototypes/poc-002-component-combat.md` for question, accepted numeric spec and falsifiers; a schema-named `docs/plans/2026-10-19-<rand8>-poc-002-component-combat.md` for delivery. Coordinator updates catalogs, stale README and protected CURRENT/TASK_LOGS after acceptance. Smallest checkpoint: one **Girtablilu–Guard battle**, component targets, poison/Guard timing, event log, export/replay and same-path preview; no full UI polish. Add other kits/forms and mixed enemies, then Warden/gauntlet and external tests. No POC 001 changes, shared engine, C# port or final asset production in that checkpoint.

## Risks, readiness and verification limits

Biggest risk is **permanent function removal producing a long, harmless finishing sequence**, with party-size action economy exaggerating it. Revelation adds another timing system before the base targeting loop earns its complexity; measure it explicitly and consider a separate comparison with it disabled. Deterministic Rapture/Rupture is a new design decision, not established lore. Anzû, deferred escape/items, no inter-fight healing, full intent disclosure and limited solo promises need user/council acceptance. Browser combat cannot establish world scale, narrative loss, long-run attrition or production engine suitability.

Design is ready for council selection and bounded implementation after those decisions. No other architect report was read; only this report was written, with no staging or commit. No application build/tests, search sweep, C# parity or human session was run. The arithmetic is a design calculation, not simulation evidence.

Initial mechanical check: `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/poc-002-council/architect-sol-b.md --repo .` exited **2**, returning `ok:false`, diagnostic `DEPENDENCY_UNAVAILABLE` at `/dependencies`. On Coordinator correction, copied the skill to `/tmp/council-sol-b-handoff.sTwve3/ruach-handoff` and ran `bun install --frozen-lockfile` there: exit **0**, 6 packages installed. From the worktree root, `bun /tmp/council-sol-b-handoff.sTwve3/ruach-handoff/scripts/validate.ts docs/mailbox/poc-002-council/architect-sol-b.md --repo .` exited **0**, returning `schema_version:1`, `ok:true`, `diagnostics:[]`; `/source_baseline` resolved to `c82ec3c71a499760fc2bf7c40c9b162a6856d03b`. No handoff-structure corrections were needed; no dependencies were installed into the repository. `git diff --check` emitted no diagnostics; it excludes this untracked report. `git diff --no-index --check /dev/null docs/mailbox/poc-002-council/architect-sol-b.md` exited 1 with no whitespace diagnostics (the new file differs from `/dev/null`). Arithmetic was checked with Python expressions, not an implemented combat engine. Report word count remains below 4,000.
