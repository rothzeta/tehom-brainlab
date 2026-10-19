task: COUNCIL-poc002
role: architect
author: sol-a
status: complete
outcome: "Independent recommendation and executable provisional combat specification; adoption remains a Coordinator/user decision."
source_baseline: c82ec3c
artifacts:
  - docs/mailbox/poc-002-council/architect-sol-a.md
verification:
  - "Inspected baseline source, assigned documents and recorded evidence; no application checks or playtests run."
  - "Python arithmetic calculator: exit 0; first-exposure and three Warden example totals checked."
  - "bun /tmp/poc002-sol-a-handoff-SRsfID/ruach-handoff/scripts/validate.ts docs/mailbox/poc-002-council/architect-sol-a.md --repo .: exit 0; schema_version 1, ok true, diagnostics []; source_baseline resolved to c82ec3c71a499760fc2bf7c40c9b162a6856d03b. Dependencies installed only in the temporary skill copy with bun install --frozen-lockfile (exit 0)."
review: not-run
discoveries:
  - "The proposed Warden loses all HP pressure when its saw is destroyed; recommend a small declared core attack."
  - "POC 001 supplies reusable patterns, but its state and record validator require formation and a fixed roster."
blockers: []

# Independent recommendation

Build **`poc-002-component-combat/`**, a deterministic battle laboratory with component selection and a three-fight attrition run. Preserve POC 001. The question is whether sacrificing life damage to remove a function, waiting for venom, and accepting Revelation produce different worthwhile decisions. A victory count cannot answer that question.

**Authority:** combat-only selection/gauntlet, Phaser/TypeScript, later C#/.NET rules plus Godot, game-owned simulation, 32×32 exploration tiles, 640×360 exploration viewport and separate combat illustrations are **user decisions** in [source 2](source-2-decisions.md). World scale is deferred. Everything numerical below is **my provisional proposal**, including changes to source 2. It is buildable tuning, not accepted balance. No other council report was read.

## 1. Source assessment against the baseline

| Source 1 claim | Assessment and evidence at `c82ec3c` |
|---|---|
| Root README understates implementation | Accurate: `README.md:29,58` says shell/not playable and combat unimplemented; `docs/CURRENT.md:175–207` records delivered P13–P17 and 581 tests. Some other summaries are stale too: `docs/prototypes/poc-001-linked-formation.md:3` still calls bosses unimplemented. |
| Existing core, forecasting and reproducibility are valuable | Accurate: public rejection/action accounting in `poc-001-linked-formation/src/core/transition.ts:100–136`; preview calls the dispatcher on a clone at `src/core/preview.ts:107–119`; replay compares per-command events and final results at `src/core/run-record.ts:250–265` (same prototype prefix). |
| Formation/fixed roster constrain reuse; Sting is immediate | Accurate: `src/core/state.ts:17–27`, `src/core/run-record.ts:117–123`, `src/core/abilities.ts:76–83,116–125`, `src/content/brood.ts:11–12`. These are not generic variable-party/poison rules. |
| Patrol targeting ignores positions | Accurate: `src/core/rounds.ts:20–37` uses roster, round cycle and HP ratios. Human observation is recorded in `docs/CURRENT.md:165`. |
| Dominant spreading and substantial verification | Accurate as **recorded evidence**, not independently reproduced: `docs/CURRENT.md:144–147,202–207`; controlled Collector results at `docs/mailbox/p17-collector/implementer.md:149–165`. That report explicitly disclaims universal optimality and human satisfaction. |
| Seven prototype emblems, not final art/audio | Accurate: `assets/manifest.json:3`; Pazuzu remains an explicit asset at `:56–62`. |

I accept source 1's independent-prototype recommendation and survival-budget reasoning. I reject its 8–12-room journey, saving, quests and engine-selection gate **for this assignment**: source 2 supersedes that scope and engine choice. I also reject hiding numerical combat information in this diagnostic build. Research citations are contextual arguments, not evidence that these kits work; I did not re-audit the literature or external engine announcements.

## 2. Decisions recommended before implementation

| Decision | Recommendation |
|---|---|
| Folder | `poc-002-component-combat`: describes the experiment. Neither dungeon-combat nor linked-tactics accurately describes its scope. |
| Third Brood | **Anzû**, ID `anzu`, as a new experimental kit. Keep POC 001's Pazuzu unchanged (`docs/prototypes/poc-001-linked-formation.md:18,87`). Do not present an asset/character rename as established continuity. |
| Enemy declarations | Yes: exact action, dependency, target, base damage and conditional modifier before every player phase. Targets stay committed; previews show current outcomes. Revoke requires a named declaration. |
| Menus | Attack, Skills, Guard, Item. One shared consumable below. Defer Talk and Escape entirely; laboratory Reset/Abandon is outside combat, forfeits the gauntlet, and grants no progress. This deliberately leaves retreat design untested. |
| Reuse | Copy patterns for pure command/rejection boundaries, preview-through-resolution, records, browser verification and thin CLI wrappers. Adapt locally; import no POC 001 combat modules. Share existing licensed assets with provenance. Extract code only after equivalent behavior actually exists twice, per `README.md:45–48` and ADR-0004 `:13–15`. |
| Difficulty | Fixed enemies across party sizes; no hidden scaling. Tune ordinary encounters and the gauntlet first for duos/trios. Solos are diagnostic; only the demonstrated Ugallu/Warden route is a first solo target, not a promise for every solo. |
| Presentation | Numerical component list synchronized with generous illustration hit regions; keyboard selection and confirmation. Start with labelled anatomy diagrams. Large-art canvas sizes and a 1280×720 combat UI in source 2 remain proposals, not consequences of the settled exploration viewport. |

**Portable boundary:** prototype-local `content/combat-v1.json` uses ASCII IDs, integer parameters and a closed enum of built-in effects, never executable strings or expressions. Entity IDs differ from definition IDs; components use `(entityId, componentId)`. Presentation mappings/hit regions live separately. No content editor, plugins or generic mod loader.

Record envelope: `recordVersion`, `rulesVersion`, `contentId`, embedded `content`, `initialState`, `commands`, `expectedFinalState`. Each command entry stores `{command, expectedEvents, expectedState}`. State includes party/encounter order, HP/integrities, statuses and their source/expiry, Revelation/form/latch counters, acted IDs, declarations, round, phase, inventory and revision. Events have a command-local sequence, type, source/target IDs and relevant before/after integers. Record run transitions too. Accepted commands only; rejection fixtures are separate. No clocks, engine instances, asset paths or RNG. Integers are nonnegative signed-32-bit values; reject overflow, duplicate/unknown IDs, invalid references and unsupported versions. Compare parsed objects structurally, arrays in order, object keys unordered. Freeze each parity fixture's embedded content and rules version; tuning creates a new fixture/version rather than rewriting historical outcomes. Implement only this known version initially.

## 3. Numerical combat specification v0

### Resolution and targets

One to three unique Brood; canonical order Ugallu, Girtablilu, Anzû. Fixed damage, guaranteed hits, no criticals, movement, mana, cooldowns, regeneration or revival. Every action costs one activation; each living Brood activates once per player phase, in any order. Revelation costs **add exposure**, never spend it. All omitted costs are zero.

Start round 1 by establishing protection and declaring enemies. Player actions resolve immediately. Explicit End Phase forfeits unused activations; spending the last activation does not automatically end it. Enemy order is encounter-list order, each enemy's listed action order. Recheck source life/component and target life before each declaration resolves: missing/dead/broken/suppressed means fizzle, never substitution or retargeting. Destruction cancels that function immediately, including already declared actions. Skipped beats still advance the schedule.

After enemy actions, tick enemy poison in encounter order, stacks in application order; settle each tick. Expire Guard, interception, suppression and weaken; expire holds due this round. Then advance round, refresh activations, establish protection and declare again. Animation never advances rules.

For each player action: validate everything; snapshot current form modifiers; reserve activation and item; resolve effects; settle deaths and remove their dependent effects; decrement a form present at action start if its owner survives; process its expiry; apply queued Revelation gains to survivors; check thresholds; check terminal outcome. New forms get their full duration. Enemy effects use the same settlement/gain/threshold/terminal ordering without decrementing form duration. A physical-hit/retaliation sequence checks death and terminal state between hits. Stop immediately on terminal outcome; no subsequent poison or declarations. Defeat if no Brood lives, otherwise victory if all enemies' life is zero; simultaneous elimination is defeat.

**Damage:** normal body/core hits reduce life only; component hits reduce integrity only, with no overflow into life. Zero integrity removes only the named function. Dead enemies and broken components are invalid targets; an enemy's body remains valid while alive. Brood have HP only, armor 0. Physical damage is `max(0, raw + hold bonus - weaken - target armor - protection - intercept reduction)`, then Guard rounds half **up**. Magical damage ignores armor/protection/interception; Guard still halves it. Poison ignores all mitigation. Minimum damage is 0; no hidden minimum 1.

### Brood actions

`B/C` means a living enemy body or intact component; `B` means its living body/core. All damage is physical except where stated.

| Brood / HP / Revelation cap | Attack | Skill 1 | Skill 2 |
|---|---|---|---|
| Ugallu / 40 / 100 | Claw: 8, B/C | Rend: 12 against C, 4 against B | Hold the Threshold: self or living ally; intercept its first direct physical hit this enemy phase, subtract 4, then retaliate 4 against attacker's body if Ugallu survives and actually loses HP. Store retaliation power when cast. |
| Girtablilu / 34 / 100 | Pincer: 6, B/C | Envenom: B; no immediate damage; add one poison stack, power 3 for 3 ticks; apply weaken 4 | Rupture Venom: B with poison; consume every stack, deal the sum of all remaining tick damage immediately as poison damage. |
| Anzû / 28 / 100 | Talon: 6, B/C | Stolen Bolt: 9 magical, B/C; +15 Revelation after effects | Revoke: choose one currently declared, intact-component-dependent enemy action; suppress only that declaration this phase; +25 Revelation. Cannot suppress a passive or core action. |

**Guard**, all Brood: self, halve every physical/magical HP hit in the coming enemy phase, no Revelation reduction. **Item:** shared pool of two Dressings per fresh battle/run; one activation restores 10 HP to a living self/ally, capped at maximum. Full-HP/dead targets are invalid. No between-fight free item use.

Only one interception per ward; duplicate placement invalid. For an intercepted Saw/strike, compute and consume the original victim’s hold bonus before redirection; apply mitigation and HP loss to Ugallu. Status-only restraint is not a physical hit and cannot be intercepted. It redirects one hit, including its target-dependent effects; no interception chains. Guard on the original ward does not transfer. Hold's retaliation cannot trigger retaliation. Unused interception expires even if its source lives. Guard never stacks. Held targets can still act normally: hold is a damage setup, not a skipped activation.

### Revelation and transformations

Gain +5 to the **actual recipient** of each positive enemy HP hit, plus listed Scribe/Choir gains and spell costs. No gain from reading UI, component destruction, poison damage, retaliation or zero-damage hits. Clamp to 100; no queued overflow.

Crossing 50 upward triggers Rapture once per cycle; reaching 100 triggers Rupture, overriding Rapture. A jump straight to 100 triggers only Rupture. Each lasts two completed own activations, including Guard/Item; triggering action uses its old form and does not consume the new duration. Rapture expiry retains meter and crossing latch. Rupture expiry resets meter to 0 and clears latches **before** that action's queued gains. Further gains at 100 do not retrigger or extend it. Death cancels forms and leaves a corpse; no resurrection through expiry.

| Brood | Rapture: exact modified actions | Rupture: exact modified actions |
|---|---|---|
| Ugallu | Claw, Rend and stored Hold retaliation gain +2 raw damage | Same actions lose 2 raw damage, minimum 0 |
| Girtablilu | Pincer +2 raw; new Envenom stacks power 4 | Pincer −2 raw; new Envenom stacks power 2 |
| Anzû | Bolt deals 12; Revoke adds 15 Revelation | Bolt deals 6; Revoke unavailable; Talon remains usable |

Existing poison retains its applied power regardless of later transformation/death. Rupture Venom always cashes actual remaining ticks. Other actions remain unchanged. Rapture also ends at victory without resetting meter/latches; Rupture's remaining penalty activations carry across fights. Explain this distinction on the run transition screen: beneficial power cannot be banked from a safely disabled Scribe. Diagnostic starts at 50/100 begin with the corresponding form/latch initialized; normal starts are 0.

### Enemies and statuses

Target `cycle(r)` is living canonical party order indexed `(round−1) mod living count` at declaration; store its ID. HP-ratio ties and Revelation ties use canonical order. All listed component armor defaults to 0. Body armor and shell modifiers never protect unrelated components.

| Enemy | Life; body armor; components | Declared actions and destruction consequences |
|---|---|---|
| Celestial Guard | 30; 2; weapon arm 10, restraining limb 8 | Every round: on even rounds first restrain `cycle(r)`; then weapon strike 10 physical against that target. Weapon removal removes strike; limb removal removes restrain and its holds. |
| Naming Scribe | 20; 0; tongue 8, inscription hand 8 | Every round tongue names highest-Revelation living Brood for +20 Revelation, no HP damage. Hand passively protects one other living enemy: highest life at declaration, encounter-order tie. Removal silences naming or immediately removes protection respectively. Alone, hand does nothing. |
| Corrected Beast | 36; 0; shell 12 (armor 2), locomotion organ 8 | Every round core-driven physical charge 6 +6 while locomotion intact, targeting `cycle(r)`. Shell adds 6 physical armor to body only; destroying it removes that armor. Locomotion removal removes the +6 contribution. Both contributions are disclosed from the first declaration. Magic/poison can reach the living core through an intact shell. |
| Warden of Correct Form | 60; 1; saw 16, clamp 10, choir 12 | Repeat Clamp → Saw → Choir on rounds 1/2/3. Clamp holds `cycle(r)`. Saw hits a currently held victim, otherwise `cycle(r)`, for 16 physical, +4 if held. Choir adds 15 Revelation to every living Brood, canonical order. **After the beat, core pulse deals 3 magical to `cycle(r)` every round.** Removal cancels the associated beat, never the pulse. |

Beast Charge is a core action: Revoke cannot suppress it or its locomotion bonus. Its declaration shows the bonus condition; destruction changes the amount, not the target. A held Warden victim is chosen at Saw declaration; if that hold is cleared afterward, keep the target but remove the bonus. Multiple held victims use canonical order.

The Warden pulse is my explicit addition to source 2, not an emergency fallback attack. Without it, saw removal eliminates HP pressure and makes neutralization/farming too cheap. There are no phases, summons, healing or replacement components.

**Poison:** maximum two stacks per enemy, independent 3-tick lifetimes; reject a third application, spending nothing. Tick after enemy attacks, including on the application round. Expire each stack after its third tick. Poison persists if Girtablilu dies, but cannot rescue an already terminal defeat.

**Weaken:** nonstacking −4 on that enemy's next physical hit this enemy phase; consume even if final damage is 0. Reapplication refreshes. Magical actions do not consume it; unconsumed weaken expires after this enemy phase.

**Hold/clamp:** at most one hold per source/target; refresh, no stacking. Adds 4 only to that source's named weapon strike/saw against the held victim, then consumes. It does not amplify core pulse. Expires after the following enemy phase; broken restraining limb/clamp or source death clears it immediately. Saw destruction alone does not destroy clamp. No action lock, escape rule or damage at expiry.

**Protection:** hand grants flat 2 physical reduction to every body/component of its chosen ally while source, hand and ally live. Multiple hands do not stack. Re-evaluate its beneficiary only at declaration; no mid-phase replacement. Magic and poison bypass it; Revoke cannot switch it off.

### Encounters and arithmetic

Selection offers Guard, Scribe, Beast, Guard+Scribe, Beast+Scribe, Guard+Beast and Warden, each with all seven nonempty parties. Offer healthy, half-HP (round up), Revelation-50 and Revelation-100 diagnostic starts. Gauntlet: **Guard → Beast+Scribe → Warden**, fixed order, default trio with party selection allowed. Carry HP, deaths, Dressings, Revelation/latches and remaining Rupture activations. Clear enemy statuses, holds, Guard/interception, activations and Rapture; reset round/declarations. No healing, refill, recruits or party substitutions. Enemy stats never scale. A gauntlet death is permanent within that run only.

(a) Healthy solo Girtablilu, Guard round 1: Envenom weakens strike from 10 to 6, leaving `34−6=28 HP`; poison then leaves Guard `30−3=27 life`. Pincer against weapon leaves 4 integrity and takes 10; against body deals `6−2=4` and takes 10. Poison buys four HP immediately, at the cost of one less immediate life damage. At 6 starting HP, Envenom dies before its tick; Guard survives at 1, while Item survives at 6. The archetype has a budget, not universal safety.

(b) Fresh Warden, no items, U/G/A abbreviations:

| Party | Legal witness and totals |
|---|---|
| U solo | R1–2 Rend saw, breaking it before R2 Saw; nine pulses cost 27 HP. R3–10 Claw core: damage `7,7,7,7,9,9,7,7 = 60`. After R6 Choir/pulse Revelation reaches 60, so R7–8 receive Rapture. Victory R10 before enemies, **13 HP / 90 Revelation**. |
| U+G | R1 Rend+Pincer breaks saw. R2 U Claw/G Envenom; R3 repeat; R4 Claw/Rupture Venom (remaining `3+6=9`); R5–6 Claw/Pincer. Per-round life damage `0,10,13,16,12,12 = 63`; victory R6, **31/28 HP**, no transformation. |
| U+G+A | R1 Claw/Pincer/Bolt: 21 life damage. R2 Claw/Envenom/Bolt plus tick: 19; weakened held Saw is `16+4−4=16`. R3 Claw/Rupture Venom/Bolt: 22, victory before Choir. **21/31/28 HP**; pulses hit U then G. |

These are calculator-checked hand traces, not executed battles. The solo invests in disassembly; the trio accepts machinery damage to finish quickly. No assertion that solo Girtablilu wins Warden is established. As a separate poison-survival witness against Guard, Girtablilu can Envenom, Envenom, Dress, Envenom, Envenom, then cash 9: end-of-round HP `28,18,18,8,2`, Guard life `27,21,15,9,3`, then victory before R6 enemies. This costs one Dressing and never disables a limb; weapon-first can instead conserve resources at the cost of extra rounds.

(c) No universal opening is established. Counterexamples to obvious candidates: Ugallu Rend removes Guard's strike in one action, but Rend on Beast shell deals only `12−2=10`, leaving 2 integrity and preventing no opening charge. Anzû Bolt bypasses Beast body armor for 9 where Talon deals 0. Against a lone Scribe, all three basic attacks total `8+6+6=20`, killing it before naming without spell exposure; component removal is slower. Guard/Item beat poison's first-turn survival at the wounded breakpoint above. Within Guard encounters, arm-first may still dominate healthy trio survival; search must assess HP **and** exposure, items and duration, not pretend these examples prove global diversity.

## 4. Falsification, risks and handoff

Apply ADR-0006 `:7–25` and [ruach-testing](../../../.agents/skills/ruach-testing/SKILL.md). Public-boundary contracts: rejection changes nothing; dead actors never act; component damage never leaks into life; canceled declarations do not retarget; poison ticks/cashout conserve remaining damage; protection disappears immediately; preview and live events/state agree; replay reproduces a frozen fixture. Test exact arithmetic with explicit supplied tuning, and separately preserve versioned parity battles. Ordinary tuning changes must not break generic rule tests.

Implementer sweeps: seven parties × seven encounters × four diagnostic starts; threshold starts 49/50/99/100; HP 1 and exact lethal damage; broken-source interception; duplicate/stale commands; overkill; source death during retaliation; final poison kill; form expiry plus spell cost; victory during Rapture/Rupture; overflow and hostile records. Search bounded policies through 15 rounds: body rush, component-first, venom/wait, venom/cashout, repeated suppression, Guard stall and threshold farming. Retain Pareto outcomes (survivors, HP loss, items, exposure, rounds), sequences and search limits. A timeout is unresolved, not proof of impossibility.

Failure signals: one opening Pareto-dominates across ordinary compositions; Girtablilu's favorable poison cases still require weapon-first; full disabling creates unlimited healing/power; all good Anzû policies spam Revoke; every casualty makes the remaining gauntlet mechanically hopeless. None of these searches ran here.

First human pilot: 4–6 external testers, first unfamiliar ordinary battle, a pair, then gauntlet/retry; counterbalance starting kit. Ask for predicted enemy consequences before committing, then observe actual explanations, target errors, first-turn survival, intended choices and willingness to continue after a loss. Repeated wrong causal explanations, inability to select components, identical openings after learning, or universal restart after casualty falsify readiness. Small samples diagnose problems, not audience preference.

**Main risks:** trio action economy may compress battles into alpha strikes; the fixed gauntlet may be too punishing without recovery; disabling can turn remaining turns into chores; transformation modifiers may feel like bookkeeping. Ending Rapture at victory prevents direct banking but does not prove farming unprofitable. Full information and permanent-in-run death are experiment parameters, not final-game promises.

**Ordered proposed artifacts:** next unused `docs/adr/NNNN-poc-002-component-combat.md` records accepted scope, roster, boundaries and port gate; `docs/prototypes/poc-002-component-combat.md` owns the adopted numerical spec and hypotheses; a new `docs/plans/yyyy-mm-dd-<8hex>-poc-002-component-combat.md` owns checkpoints and acceptance, linked from the plan index. Coordinator separately corrects stale entry points. First checkpoint: headless Ugallu versus Guard with life/integrity, declarations, rejection, preview and record round-trip; first playable adds synchronized component list/diagram. Then all kits/statuses/Revelation, enemy combinations, gauntlet and human evidence. Keep rules/content/view/records prototype-local; expose runnable CLI through ADR-0005 `:19–23` conventions. C# parity/Godot work follows feedback, outside this implementation plan.

Only this report was created; no staging, commit, implementation or protected-document edit. Detailed recommendation is ready for consolidation. User/Coordinator decisions still needed: Anzû, folder, deferred retreat/Talk, fixed-party-size balance target, pulse addition and transformation semantics. They are product choices, not execution blockers to completing this council assignment.

Mechanical handoff validation: the initial repository-skill invocation exited **2** with `DEPENDENCY_UNAVAILABLE /dependencies`. On Coordinator correction, copied the skill to `/tmp/poc002-sol-a-handoff-SRsfID/ruach-handoff` and ran `bun install --frozen-lockfile` there: exit **0**, six packages installed. From the worktree root, `bun /tmp/poc002-sol-a-handoff-SRsfID/ruach-handoff/scripts/validate.ts docs/mailbox/poc-002-council/architect-sol-a.md --repo .` exited **0** with `schema_version: 1`, `ok: true`, `diagnostics: []`; `/source_baseline` resolved to `c82ec3c71a499760fc2bf7c40c9b162a6856d03b`. No handoff-structure corrections were needed. Dependencies were installed only in the temporary copy; report substance is unchanged.
