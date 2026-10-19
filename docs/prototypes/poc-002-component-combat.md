# POC 002 — Component combat

**Status:** specified experiment; not implemented. Delivery is planned in [the POC 002 plan](../plans/2026-10-19-db0bad72-poc-002-component-combat.md). Delivered state will be recorded in [CURRENT](../CURRENT.md); this brief does not restate it.

**Authority:** [ADR-0007](../adr/0007-poc-002-component-combat.md) records the direction and decisions. This brief owns the question, hypotheses, scope and the **numerical specification v1**, which is the decision record for rules and tuning. It was consolidated by the Architect (task P2-DESIGN, 2026-10-19) from [source 2](../mailbox/poc-002-council/source-2-decisions.md) and the three council reports ([opus](../mailbox/poc-002-council/architect-opus.md), [sol-a](../mailbox/poc-002-council/architect-sol-a.md), [sol-b](../mailbox/poc-002-council/architect-sol-b.md)). It starts from Opus's specification, the only one checked by search, and resolves every disagreement explicitly.

**Labels used in this brief:**

| Label | Meaning |
| --- | --- |
| **[U]** | User decision (source 2, recorded in ADR-0007) |
| **[C]** | Council decision, accepted by the user's "go" |
| **[P1]–[P4]** | Provisional decision adopted by the user's "go"; open to change after the first human test |
| **[A]** | Architect resolution of an open or disputed rule; a settled default unless the user overrides it |
| **[T]** | Provisional tuning v1: a test parameter, not a balance claim |
| **[D]** | Deferred idea; not built in POC 002 |

All rules in the [numerical specification](#numerical-specification-v1) are **[A]** unless labelled otherwise. All numbers are **[T]**.

## Question

Does choosing **which enemy function to remove**, against waiting for venom or spending Revelation, produce different and worthwhile decisions? The decisions are made against declared enemy actions, across one to three Brood and a three-fight attrition run.

A victory count cannot answer this. The evidence must show that the best choice changes with party, encounter and state, and that players can explain why.

## Hypotheses and falsifiers

| # | Hypothesis | Falsified if (automated, Q04 harness) | Falsified if (first human test) |
| --- | --- | --- | --- |
| H1 | Component targeting competes with killing and with poison; no universal "cut X first" opening | One round-1 opening class is best in ≥ 6 of 7 parties for an encounter, with every other class lost or ≥ 10 HP worse | Testers repeat one identical opening after learning, across encounters |
| H2 | Each Brood plays differently against the same encounter | Every successful Girtablilu line opens by disabling with Pincer; or Anzû's winning lines Revoke 100% of Saw intents | Testers cannot describe a kit difference |
| H3 | Revelation is a real cost with a real reward | A "never use Revelation skills" policy matches search; or "Rapture as soon as possible" matches search | Testers cannot say whether a transformation was their doing |
| H4 | Declared intents make enemy consequences predictable | Not automated | Testers cannot say why a target was invalid or why an enemy still acted; they ignore intents when choosing Guard or Hold |
| H5 | Attrition creates continue-or-retry decisions | Gauntlet search: the trio loses, or every duo wins with more than 60% HP left | Testers restart after a death in the gauntlet rather than continue |
| H6 | Component selection is usable at 1280×720 | Not automated (the browser harness checks that hit regions exist) | Small parts (tongue, hand) are mis-selected |

Other automated warning signals: an action is used in fewer than 5% of searched decisions where it was designed to matter (Pincer, Hold, Anzû's Guard); a winning duo or trio line needs more than 10 rounds; every round-1 opening ties within 2 HP (the decision is indifferent); harmless-enemy cleanup lasts more than 2 rounds after the last threat is removed. Search is heuristic: a "loss" means no win was found, never that none exists.

## Scope and non-goals

| In scope | Detail |
| --- | --- |
| Content | Three Brood (Ugallu, Girtablilu, Anzû), three ordinary enemies, the Warden of Correct Form, six transformations, statuses and one Item |
| Modes | A selection screen (any party of one to three × seven encounters × three starts) and a three-fight gauntlet with carry-over **[U]** |
| Rules | A headless TypeScript core with no Phaser types, game-owned state, declared intents, atomic commands, previews through the real rules, and integer-only records with replay **[U][C]** |
| Evidence | A parity fixture corpus, an automated scenario sweep and policy probe harness, browser harnesses, and a human-test protocol template |
| Presentation | A Phaser battle UI at 1280×720, two-way component selection, placeholder labelled art, and synthesized audio cues **[U][A]** |

Non-goals: exploration, maps, saving, quests, recruitment, Talk, Escape **[U][C]**; running the external tests, the C# port and Godot (source 2 steps 5–7); purchased art; hidden information (every number is shown **[C]**); any change to POC 001; `shared/` code **[C]**; a mod framework or content editor **[C]**; party-size scaling **[C]**.

## Decision record

User and council decisions are recorded in [ADR-0007](../adr/0007-poc-002-component-combat.md). Council disagreements are resolved here:

| Topic | Council positions | Resolution v1 | Why |
| --- | --- | --- | --- |
| Poison model | Opus: one value P per enemy, cap 6, ticks P then decays by 1; Rupture Venom 2×P. Sol-a: two stacks of 3 for 3 ticks. Sol-b: one packet, potency × ticks | **Opus** | Linear and readable; Rupture Venom stays bounded (2×6 = 12); one number per enemy is easy to show |
| Warden schedule | Source 2: Clamp → Saw → Choir. Opus: staggered (Clamp odd, Saw even, Hymn every third). Sol-b: one beat per round | **Source 2's one-beat cycle, plus [P2] the core pulse every round**; Saw base 6, +14 against a Clamped recipient | The [tuning check](#tuning-check-v1) found that only this family leaves a solo Ugallu route [P4]. The pulse supplies the pressure that the single beat lacks. A low Saw base makes the Clamp the component that matters |
| Gauntlet order | Opus: Guard+Scribe → Beast+Guard → Warden. Sol-a: Guard → Beast+Scribe → Warden. Sol-b: Guard → Scribe+Beast → Warden | **Guard+Scribe → Guard+Beast → Warden** (Opus's composition) | Only this order produced duo attrition in search; the single-Guard openings left duos near full HP for the Warden |
| Scribe details | Opus: Ward −3 on another enemy every round; Utter 2 magical + 3 Revelation. Sol-a: −2 protection, +20 Revelation. Sol-b: alternating actions | **Opus**, with hand and tongue integrity raised to 8 | One Claw no longer removes a function; searched |
| Beast details | Opus: core shielded while the shell is intact; Gore; Trample every third round. Sol-a: shell adds armor. Sol-b: shell blocks core actions | **Opus**, locomotion integrity 9 | Shielding gives an anatomical problem that differs from the Guard's; poison through the locomotion organ is Girtablilu's answer |
| Item | Opus: Salve +10, two per gauntlet. Sol-a: Dressing +10, two per battle or run. Sol-b: none | **Salve +10, two uses per gauntlet and per selection-screen fight** [P3] | — |
| Hold the Threshold | Opus: −2 to every hit on Ugallu. Sol-a/b: one intercept, halving | **Opus, but −2 applies to physical hits only** | Otherwise Hold makes the 1-point pulse harmless and permits an indefinite stall (found in search) |
| Rend | Opus: 10 to a component, armor applies | **Rend ignores component armor** | Ugallu's identity is dismantling; this is what makes the solo Warden route exist |
| Ugallu HP, Rupture | Opus: 30 HP; Rupture +2 incoming | **40 HP; Rupture +1 incoming** | Needed for [P4]; with the pulse, +2 per hit was a tax on every round |
| Ending a phase | Opus: phase ends when all have acted. Sol-a/b: explicit End Phase | **Explicit `endPhase` command**; spending the last action does not end the phase | Records stay explicit; the UI may highlight End Phase |

## Numerical specification v1

Every number in §6–§10 is provisional tuning **[T]** and lives in content (§12). The rules hard-code only the closed behaviours named here.

### 1. Conventions

- **Integers only.** No floats anywhere. Halving uses ⌈d/2⌉ = d − ⌊d/2⌋. Revelation reset uses ⌊cap/2⌋. No other division exists.
- **Roster order** is Ugallu, Girtablilu, Anzû. A party is one to three distinct Brood, kept in roster order. Every tie in this spec is broken by its stated keys, then by roster order.
- **Encounter order** is the enemy list order of the encounter. Enemy instance IDs are `<enemyId>#<n>`, with n the 1-based position in the encounter. Part IDs come from the enemy definition.
- **Declaration order:** enemies in encounter order, and each enemy's intents in the order listed in §8.
- **Pools:** each Brood has HP. Each enemy part has a pool: life for the body, integrity for components. Pools never go below 0. Damage beyond a pool is discarded.
- **Comparisons** of IDs use code-point order (`string.CompareOrdinal` in the later C# port).

### 2. State, commands and rejection

A battle state contains the round, phase (`player`, `between-fights`, `victory`, `defeat`), revision, party, enemies and parts, statuses, poison values, declared intents, transformations, Salve uses, the ledger (§8.1), gauntlet position and carried state. Initial states are complete; no factory default is assumed by replay.

Commands, each carrying `expectedRevision`:

| Command | Payload | Valid in |
| --- | --- | --- |
| `act` | `actor` (Brood ID), `action` (action ID or `salve`), `target` | `player` |
| `endPhase` | — | `player` |
| `continue` | — | `between-fights` |

Target forms: a part `{enemy, part}`; an enemy `{enemy}` (Rupture Venom); an intent `{intent}` (Revoke); a Brood `{brood}` (Hold, Salve); none (Guard).

Each accepted command increments the revision by exactly 1 and returns its ordered events. A rejected command changes nothing, consumes nothing and returns no events. The rejection codes form a closed set, checked in this order:

`invalid-command` (malformed) → `stale-revision` → `wrong-phase` → `unknown-actor` → `actor-dead` → `already-acted` → `unknown-action` → `action-unavailable` (not in the kit, blocked by a form or Pinned) → `no-item-uses` → `illegal-target`.

`endPhase` forfeits the unused actions of living Brood. It then resolves the enemy phase and the end of the round, and declares the next round, all within that one command.

### 3. Round structure

Round r starts at 1.

1. **Declare.** For each living enemy in declaration order, each intent scheduled for round r whose source part is intact is declared, with its target computed from the state at this moment (§8). A declared target is never recomputed **[C]**. Intent ID: `r<round>.<instanceId>.<intentKind>`. A Ward takes effect on declaration.
2. **Player phase.** The player acts with each living Brood at most once, in any order, and then issues `endPhase`. One action resolves as a unit:
   a. Validate atomically (§2).
   b. Apply the action's effects in their listed order. Destruction, cancellation and release (§4) happen immediately.
   c. Apply the action's Revelation cost (§7).
   d. Start any pending transformation for a living Brood (§7).
   e. Check the outcome (§3.5).
3. **Enemy phase.** Intents resolve in declaration order. For each intent, as a unit:
   a. Skip it if it was cancelled or revoked, or if its source part or enemy is gone. Skip a single-target intent whose declared target is dead; it never retargets (event `intent-skipped`, reason `target-dead`).
   b. Determine the recipients. Area intents (Hymn, Trample, Pulse) hit every Brood alive at resolution, in roster order. A single-target intent hits its declared target, or Ugallu if Ugallu is alive and holding that target (§6.1).
   c. Apply damage to each recipient (§4.3).
   d. For each recipient still alive, apply riders: statuses, then Revelation.
   e. Apply retaliation (§6.1).
   f. Start pending transformations (§7).
   g. Check the outcome; if it ends the battle, stop resolving.
4. **End of round.**
   - E1: poison ticks, in encounter order (§5).
   - E2: Girtablilu's transformation HP loss (§7).
   - E3: outcome check.
   - E4: round-scoped statuses expire: Guard, Hold, Weakened, Ward, and Pinned or Clamped whose last round is r.
   - E5: transformations whose last round is r end; Revelation becomes ⌊cap/2⌋.
   - E6: the ledger rolls over.

   Then round r+1 is declared.
5. **Outcome check.** Defeat if no Brood is alive. Otherwise victory if no enemy is alive. Defeat takes precedence when both hold. Destroying components never wins on its own. The outcome is checked at the end of each unit above, so a battle can end mid-phase. Nothing after the ending unit resolves: no further intents, ticks or declarations.

### 4. Targets, damage and components

#### 4.1 Parts and validity

An enemy has one **body** part (life) and named **component** parts (integrity). A hit damages only the part it strikes, and **never overflows** from a component to life **[C]**. A part is a **valid direct target** if its pool is above 0, its enemy is alive, and it is not shielded. The Beast's core is shielded while its shell is intact. Rupture Venom, poison ticks and retaliation ignore shielding. A player action needs a target that is valid when the action resolves.

#### 4.2 Damage to an enemy part

- **Physical:** max(0, raw − part armor − Ward).
- **Magical:** max(0, raw − Ward). Armor does not apply.
- **Poison ticks and Rupture Venom:** raw. They ignore armor, Ward and shielding.

Ward is 3 when the enemy is warded (§8.2), otherwise 0. Rend ignores the armor of components, and Ugallu's Rapture ignores all armor; neither ignores Ward.

**Destruction.** A part that reaches 0 is destroyed until the battle ends, with these immediate effects:

- Every unresolved intent declared by that part is cancelled (`intent-cancelled`, reason `source-destroyed`).
- Its function ends. Destroying the hand ends the Ward. Destroying the shell removes the core's shielding. Destroying the locomotion organ removes Gore's bonus.
- A restraint it applied is released. Destroying the restraining limb removes Pinned, and destroying the clamp removes Clamped.

When the body reaches 0 the enemy dies. All of its intents are cancelled (reason `enemy-died`), its Ward, Pinned and Clamped effects end, its poison is cleared, and none of its parts are targets any longer.

#### 4.3 Damage to a Brood

Apply these steps in order:

1. **Base:** the intent's amount at resolution, including conditional bonuses: Gore +3 while the locomotion organ is intact; Saw +14 if the actual recipient is Clamped.
2. **Weakened:** −3 if the intent is physical and its enemy is Weakened.
3. **Ugallu's Rupture:** +1 if the recipient is Ugallu in Rupture.
4. **Floor:** d = max(0, d).
5. **Mitigation:** if the recipient is Guarding, d = ⌈d/2⌉. Otherwise, if the recipient is Ugallu with Hold active and the hit is physical, d = max(0, d − 2).

Riders (Revelation, Pinned, Clamped) apply only if the recipient survives the hit. Guard and Hold never reduce them **[A, from source 2]**. HP never goes below 0, and a Brood at 0 HP is dead.

### 5. Statuses

| Status | On | Applied by | Effect | Ends |
| --- | --- | --- | --- | --- |
| Poison P | Enemy | Envenom | At E1: the body loses P, then P decreases by 1. P ≤ 6 | P reaches 0; enemy death; Rupture Venom sets P = 0 |
| Weakened | Enemy | Envenom on a living part | −3 to each of that enemy's physical hits this round (all its physical intents). Reapplying does not stack | E4 of the round it was applied |
| Ward | Enemy | Scribe's Inscribe | −3 to every direct physical or magical hit on any of its parts, retaliation included | Next declaration (the next Inscribe re-declares). Ends at once if the hand is destroyed, the Scribe dies or Inscribe is revoked. Wards never stack |
| Guard | Brood | Guard | Each hit: d = ⌈d/2⌉ | E4 |
| Hold | Ugallu | Hold the Threshold | §6.1 | E4 |
| Pinned | Brood | Guard's Pin, applied in round r | Through round r+1: cannot Guard and cannot use Hold; Ugallu cannot Hold for a Pinned ally | E4 of r+1; at once if the limb is destroyed or the Guard dies |
| Clamped | Brood | Warden's Clamp, applied in round r | The Saw targets it; Saw +14 against it | E4 of r+1; consumed by a Saw hit on that Brood; at once if the clamp is destroyed or the Warden dies |

No status, poison, Ward or transformation carries between fights.

### 6. The Brood

| Brood | HP | Revelation cap | Attack | Skill 1 | Skill 2 |
| --- | --- | --- | --- | --- | --- |
| Ugallu `ugallu` | 40 | 8 | **Claw** `claw`: 6 physical to a part | **Rend** `rend`: 10 physical to a component, ignoring its armor; 3 physical to a body. +2 Revelation | **Hold the Threshold** `hold-the-threshold` (§6.1) |
| Girtablilu `girtablilu` | 24 | 8 | **Pincer** `pincer`: 5 physical to a part | **Envenom** `envenom`: 2 physical to a part. If the struck part is living and the enemy is still alive, poison P = min(6, P+3) and the enemy is Weakened | **Rupture Venom** `rupture-venom`: target an enemy with P ≥ 1. Its body takes 2×P (ignores armor, Ward and shielding), then P = 0. +2 Revelation |
| Anzû `anzu` | 22 | 10 | **Talon** `talon`: 5 physical to a part | **Stolen Bolt** `stolen-bolt`: 8 magical to a part. +2 Revelation | **Revoke** `revoke`: cancel one declared, unresolved intent this round whose source part is a component. +4 Revelation. Revoking Inscribe ends the Ward at once. Schedules do not shift |

Every Brood also has **Guard** `guard`: until E4, each hit on it deals ⌈d/2⌉. It cannot be used while Pinned. Every Brood can use the **Item** (§9). The menus are Attack, Skills, Guard, Item **[C]**. Envenom poisons and Weakens even when its hit deals 0, for example against body armor or a Ward.

#### 6.1 Hold the Threshold

- **Who:** Ugallu, when not Pinned and not transformed. **Target:** Ugallu itself, or a living ally that is not Pinned.
- **Duration:** until E4.
- **Redirect:** while Hold is active on an ally, a single-target intent whose declared target is that ally hits Ugallu instead, if Ugallu is alive (`intent-redirected`). Ugallu becomes the recipient for every purpose: the damage formula, Clamped and Pinned riders, and Revelation from Utter. The Saw's +14 checks Ugallu's own Clamped state; the original target keeps its Clamped status. Area intents are never redirected.
- **Reduction:** while Hold is active, with any target, each physical hit on Ugallu deals 2 less (§4.3).
- **Retaliation:** after each intent that dealt more than 0 damage to a holding Ugallu, if Ugallu is still alive, Ugallu deals 4 physical to that intent's source part. This happens once per intent, area intents included. Armor and Ward apply; shielding does not. If the source part is already destroyed, nothing happens. Retaliation counts in the ledger and can destroy parts, kill enemies and end the battle. It never triggers further retaliation.

### 7. Revelation, Rapture and Rupture [P1]

**Gains.** Own action costs: Rend +2, Rupture Venom +2, Stolen Bolt +2, Revoke +4. Enemy effects: Utter +3, Hymn +4. No other source exists: there is no gain from learning, reading the UI, destroying components, poison, retaliation or taking damage. Revelation never decreases except at expiry, and does not decay.

**Gaining n Revelation:**

- If the Brood is transformed, it loses n HP instead (`revelation-burned`). This applies to its own costs and to enemy riders alike, can kill it, and counts as damage for the death check. Guard does not reduce it.
- Otherwise its Revelation becomes min(cap, R + n), and any excess is discarded. If R was below the cap and is now at it, a **crossing** is pending. Its kind is set by the gain that caused it: the Brood's own action cost gives **Rapture**; an enemy effect gives **Rupture**.

**Start.** Pending crossings start after the causing action or intent has fully resolved, at step 2d or 3f of §3. They apply to living Brood in roster order, and are discarded for a Brood that died in that unit. A transformation therefore never modifies the action that caused it. A transformation starting in round r lasts until E5 of round r+1 (`untilRound = r+1`). While transformed, Revelation stays at the cap.

**End.** At E5 of its last round, the transformation ends and Revelation becomes ⌊cap/2⌋: Ugallu 4, Girtablilu 4, Anzû 5. On **victory**, every active transformation ends and the same reset applies, so a form never carries into the next fight. On **death**, the transformation ends without any reset. A Brood may cross again any number of times; each crossing means reaching the cap again from below.

**Invariant:** a living Brood that is not transformed has R < cap; a transformed Brood has R = cap. A record whose initial state breaks this is rejected.

| Brood | Rapture (own crossing) | Rupture (imposed crossing) |
| --- | --- | --- |
| Ugallu | Claw and Rend +3 and ignore all armor (not Ward). Cannot Guard or use Hold | Cannot use Hold. Each enemy hit on Ugallu +1 |
| Girtablilu | Envenom sets P = 6. Rupture Venom deals 3×P. Loses 2 HP at E2 | Envenom and Rupture Venom unavailable. Loses 3 HP at E2 |
| Anzû | Stolen Bolt deals 12. Revoke may target any declared intent, body-sourced ones included. Cannot Guard | Stolen Bolt and Revoke unavailable |

A Guard or Hold already active when a form starts stays active until E4. "Cannot" restricts only choosing the action.

The decision this creates: when Hymn or Utter is about to cross a Brood, spend Revelation first and take Rapture, at the price of a meter that stays half full, or accept Rupture.

### 8. Enemies

A destroyed part removes exactly its listed function. Its slots are skipped, never refilled with other attacks **[C, from source 2]**. Nothing regenerates or heals. A fully dismantled ordinary enemy is harmless but still alive. The Warden never becomes harmless [P2].

#### 8.1 Celestial Guard `celestial-guard`

| Part | Pool | Armor | Living | Function |
| --- | --- | --- | --- | --- |
| `body` | life 22 | 2 | yes | — |
| `weapon-arm` | 12 | 0 | yes | **Strike** `strike`, every round: 9 physical. Target: the living Brood that removed the most of this Guard's pools during the previous round (ties: higher current HP); if none, the highest current HP |
| `restraining-limb` | 8 | 0 | yes | **Pin** `pin`, even rounds, declared after Strike: 2 physical + Pinned to the lowest current HP |

**Ledger:** for each Guard, the pool actually removed by each Brood in the current round. Direct hits, retaliation and Rupture Venom count; poison ticks do not. It rolls over at E6.

#### 8.2 Naming Scribe `naming-scribe`

| Part | Pool | Armor | Living | Function |
| --- | --- | --- | --- | --- |
| `body` | life 16 | 0 | yes | — |
| `inscription-hand` | 8 | 0 | yes | **Inscribe** `inscribe`, every round, declared first: Ward on the first other living enemy in encounter order, or on the Scribe itself if alone. Inscribe deals no damage, and its resolution step does nothing |
| `tongue` | 8 | 0 | yes | **Utter** `utter`, every round: 2 magical + 3 Revelation. Target: the highest Revelation among living, non-transformed Brood; if all are transformed, the lowest current HP |

#### 8.3 Corrected Beast `corrected-beast`

| Part | Pool | Armor | Living | Function |
| --- | --- | --- | --- | --- |
| `core` (body) | life 18 | 0 | yes | Shielded while the shell is intact. **Gore** `gore`, in rounds not divisible by 3: 6 physical, +3 while the locomotion organ is intact, to the lowest current HP. Gore is body-sourced, so only Anzû's Rapture can Revoke it |
| `shell` | 12 | 4 | no | Shields the core. Envenom on it neither poisons nor Weakens |
| `locomotion-organ` | 9 | 0 | yes | **Trample** `trample`, in rounds divisible by 3: 5 physical to every Brood. It also powers Gore's +3. Envenom here poisons the Beast while the core is shielded |

#### 8.4 Warden of Correct Form `warden-of-correct-form`

| Part | Pool | Armor | Living | Function |
| --- | --- | --- | --- | --- |
| `core` (body) | life 60 | 0 | yes | Always targetable. **Pulse** `pulse`, every round, declared last: 1 magical to every Brood. Non-removable [P2]; only Anzû's Rapture can Revoke it for one round |
| `clamp` | 20 | 3 | no | **Clamp** `clamp`, rounds with r mod 3 = 1: 4 physical + Clamped. Target: the highest Revelation (ties: the lowest current HP) |
| `saw` | 30 | 3 | no | **Saw** `saw`, rounds with r mod 3 = 2: 6 physical, +14 if the actual recipient is Clamped. Target: the Clamped living Brood, else the highest current HP. A Saw hit consumes the recipient's Clamped status |
| `choir` | 18 | 0 | yes | **Hymn** `hymn`, rounds with r mod 3 = 0: 3 magical to every Brood, then +4 Revelation each |

This is source 2's Clamp → Saw → Choir cycle with the [P2] pulse. Destroying the clamp also defuses the Saw, because it can no longer find a Clamped target or get the +14.

### 9. Item [P3]

**Salve** `salve`: the actor restores min(10, max HP − HP) to a living Brood below its max HP (itself or an ally). It uses the actor's action and one Salve use. Pinned and transformations do not block it. Uses: 2 per gauntlet run, shared by the party and carried between fights; 2 per selection-screen fight. A target at full HP or dead is an `illegal-target`.

### 10. Encounters, selection screen and gauntlet

| Encounter ID | Enemies, in encounter order |
| --- | --- |
| `guard` | Celestial Guard |
| `scribe` | Naming Scribe |
| `beast` | Corrected Beast |
| `guard-scribe` | Celestial Guard, Naming Scribe (the Scribe wards the Guard) |
| `beast-scribe` | Corrected Beast, Naming Scribe (the Scribe wards the Beast) |
| `guard-beast` | Celestial Guard, Corrected Beast |
| `warden` | Warden of Correct Form |

- **Selection screen:** any of the 7 non-empty parties × any encounter × a start preset. The presets are `fresh` (full HP, Revelation 0), `wounded` (HP = ⌈max/2⌉, Revelation 0) and `primed` (full HP, Revelation = cap − 2). Each fight has 2 Salve uses. Enemy stats never change with the party **[C]**.
- **Gauntlet** `gauntlet-v1`: fresh start, any party of one to three. The fights are `guard-scribe` → `guard-beast` → `warden`.
  - **Carried** between fights: each surviving Brood's HP and Revelation (after the victory reset of §7), deaths and remaining Salve uses.
  - **Reset** for each fight: round 1, statuses, poison, Wards, transformations, the ledger, intents and actions.
  - After a victory with fights remaining, the phase is `between-fights` until a recorded `continue`. Dead Brood stay dead, and the fallen are shown but cannot act. There is no healing other than Salves.
  - A defeat in any fight ends the run in `defeat`. Winning fight 3 ends it in `victory`.

### 11. Information display and previews

- **All numbers are visible** **[C]**: HP and max, Revelation and cap, part pools and armor, poison P, every status with its last round, Ward, transformations with `untilRound`, Salve uses and the round.
- **Declared intents** are listed in resolution order, each with its source part, kind, target (or "all Brood"), damage type, base amount and conditional modifiers. Each also shows the expected damage computed through the real rules: the forecast below. Cancelled and revoked intents stay listed, struck through, with the reason.
- **Preview:** selecting an action and target previews it by running the real transition on a cloned state. The preview shows the resulting events and deltas, and a forecast of the following enemy phase and end of round, run as `endPhase` on the clone. A preview never mutates live state. Committing the same command produces exactly the previewed events.
- Invalid targets are shown as invalid, with the reason (shielded, destroyed, not a component, dead, Pinned).

### 12. Records and content (portable format) [C]

- **Content** `combat-content.v1.json` (`schema: tehom-combat-content/1`, `contentVersion: poc-002-content-v1`) holds every number in §6–§10. It refers to the Brood, actions, forms, enemies, parts, intents with their schedules and targeting rules, encounters and the gauntlet by stable kebab-case IDs. Behaviours are a **closed enum** of kinds implemented by the rules: the action effects, intent kinds, targeting rules and form modifiers named in this specification. There are no scripts, expressions or plugins, and an unknown kind is a validation error. The exact field layout is fixed in plan checkpoint Q01 and frozen per content version.
- **Record** (`schema: tehom-combat-record/1`): `prototypeId`, `rulesVersion` (`poc-002-rules-v1`), `contentVersion`, `buildRevision` (a commit, or the literal `unknown`), the **embedded content**, the run descriptor (fight or gauntlet, encounters, party, start preset), a **complete `initialState`**, and `commands[]`, each `{command, revision, events[]}`. It ends with the expected **`finalState`**. Only accepted commands are recorded; rejection fixtures are separate test fixtures. Gauntlet records hold the whole run, `continue` commands included.
- **Canonical rules for parity:** integers are nonnegative, safe and below 2³¹. Arrays are ordered and contractual: the events, the intents and the party. Objects are compared after parsing, with key order irrelevant. Strings are compared by code point. Replay never trusts expected output as input: it re-executes and compares each command's events, then the final state, and reports the first divergence.
- **Versioning:** changing a number creates a new content version. Changing a rule, its ordering or event semantics creates a new rules version. Replay rejects an unsupported rules version with an explicit error and never migrates. A parity fixture is frozen with its embedded content.

### 13. Edge cases an Implementer must not guess

| # | Case | Rule |
| --- | --- | --- |
| E01 | Enemy and party both reach 0 in one unit (e.g. Rupture Venom kills the last enemy, then a Revelation burn kills the last Brood) | Defeat |
| E02 | Last enemy killed by retaliation or a poison tick | Immediate victory at the end of that unit (E1 → E3 for ticks) |
| E03 | Overkill | Discarded. It never carries to another part, enemy or fight |
| E04 | Component destroyed during the player phase | Its declared intents are cancelled before the enemy phase; the schedule does not shift; no substitute attack |
| E05 | Declared target dies before its intent resolves | Intent skipped; no retargeting |
| E06 | Hold on an ally who is the target of an area intent | No redirect. Ugallu's own share is still reduced (if physical) and still retaliates |
| E07 | Hold redirect of Clamp, Pin or Utter | Ugallu becomes Clamped or Pinned, or gains the Revelation |
| E08 | Hold redirect of the Saw against a Clamped ally | Ugallu takes 6 − 2 = 4 (20 − 2 = 18 if Ugallu is itself Clamped); the ally keeps Clamped until E4 |
| E09 | Retaliation when the intent's source part was destroyed during that intent (not possible in v1) or the enemy died | No retaliation |
| E10 | Pulse damages a holding Ugallu | Retaliation against the Warden core (the pulse's source) |
| E11 | Retaliation against a warded enemy | Ward applies |
| E12 | Envenom deals 0 (body armor or Ward) on a living part | Still poisons and Weakens |
| E13 | Envenom destroys the living part it hits | Still poisons and Weakens if the enemy lives |
| E14 | Envenom on a non-living part (shell, saw, clamp) | Damage only; no poison, no Weakened |
| E15 | Rupture Venom on an enemy with P = 0 | `illegal-target` |
| E16 | Rupture Venom against the shielded Beast | Allowed; hits the core |
| E17 | Direct attack on the shielded core | `illegal-target` until the shell is destroyed; becomes valid immediately after, even in the same phase |
| E18 | Revoke a body-sourced intent (Gore, Pulse) outside Rapture | `illegal-target` |
| E19 | Revoke Inscribe | Ward ends immediately; the next round re-declares it if the hand is intact |
| E20 | Revoke an already cancelled or revoked intent | `illegal-target` |
| E21 | Weakened enemy uses a magical intent | No effect; magical intents ignore Weakened |
| E22 | Weakened on Pin (2 − 3) | 0 damage; Pinned still applies if the recipient survives |
| E23 | Two Pinned or Clamped Brood | Impossible: one Guard or Warden per encounter, Clamp only in r mod 3 = 1, expiring E4 of r+1 |
| E24 | Clamp recipient dies before the Saw | The Saw targets the highest current HP at its declaration |
| E25 | Clamp destroyed between Clamp and Saw | Clamped released at once; the Saw keeps its declared target but gets no +14 |
| E26 | Revelation crossing and death in the same unit | No transformation |
| E27 | Area Revelation crosses several Brood | Each transforms, in roster order, after the intent resolves |
| E28 | Revelation gain while transformed | HP loss equal to the gain; can kill; Guard does not reduce it |
| E29 | A Brood transformed at victory | Transformation ends; Revelation = ⌊cap/2⌋, carried in the gauntlet |
| E30 | Death while transformed | Transformation ends; no reset; the Brood stays dead for the run |
| E31 | Revelation gain larger than the gap to the cap | Clamped to the cap; the excess is discarded (not burned) |
| E32 | Guard or Hold active when a form forbids it | Stays active until E4 |
| E33 | Ugallu Rupture with Guard | +1 is added before halving |
| E34 | Hold the Threshold on a Pinned ally, or while Ugallu is Pinned | `illegal-target` / `action-unavailable` |
| E35 | Salve on full-HP or dead Brood; no uses left | `illegal-target` / `no-item-uses` |
| E36 | `endPhase` with Brood that have not acted | Their actions are forfeited; no penalty or default action |
| E37 | Duplicate or stale command (wrong `expectedRevision`) | `stale-revision`; nothing changes |
| E38 | Command after the battle has ended | `wrong-phase` |
| E39 | Ledger tie, or a Brood that dealt damage then died | Ties go to the higher current HP, then roster order; dead Brood are ignored |
| E40 | Scribe alone | Wards itself |
| E41 | Inscribe target dies | The Ward lapses; the next declaration picks a new target |
| E42 | Every enemy component destroyed | The enemy remains and is harmless (ordinary) or keeps pulsing (Warden); it must still be killed |
| E43 | Gauntlet death | Permanent for the run; the remaining Brood continue |
| E44 | Wounded preset | HP = ⌈max/2⌉ (Ugallu 20, Girtablilu 12, Anzû 11) |
| E45 | Hostile records (unknown kinds, non-integers, overflow, unknown IDs, unsupported versions) | Rejected with a specific reason; no code execution and no file or network access |
| E46 | Mitigation on a redirected hit | Ugallu's own Guard, Hold and Rupture apply; the original target's Guard does not |
| E47 | Girtablilu dies with poison on an enemy | The poison keeps ticking; Rupture Venom is unavailable |
| E48 | A Pinned or Clamped Brood | Still acts normally; Pinned only blocks Guard and Hold |
| E49 | Revoke the Saw, or the Clamp intent | Revoking the Saw leaves Clamped in place until it expires; revoking the Clamp means no Clamped is applied |
| E50 | Ugallu dies while holding an ally | Later intents are not redirected; Hold ends with Ugallu |

## Tuning check (v1)

A disposable deterministic simulator with heuristic search ran outside the repository. Its method, limits and raw results are in the [Architect report](../mailbox/poc-002-component-combat/architect.md#tuning-check). Search is a heuristic: a found line is a witness under these rules; a "loss" means none was found.

**(a) A solo Ugallu route against the Warden from full health [P4]: found.** With no Salves, Ugallu wins in round 18 with 3/40 HP. With one Salve the end is 12 HP in round 19; with both, 21 HP in round 20. The no-item line, which Q02 encodes as parity seed `seed-ugallu-warden`:

| Round | Ugallu acts | Warden resolves | Ugallu HP / Revelation after the round |
| --- | --- | --- | --- |
| 1 | Rend clamp: 20 → 10 (ignores armor 3) | Clamp 4 + Clamped; Pulse 1 | 35 / 2 |
| 2 | Rend clamp: 10 → 0, destroyed, Clamped released | Saw declared at Ugallu: 6, no +14; Pulse 1 | 28 / 4 |
| 3 | Rend saw: 30 → 20 | Hymn 3, +4 → 8 by an enemy effect → **Rupture**; Pulse 1 + 1 | 23 / 8 |
| 4 | Rend saw: 20 → 10; the +2 cost burns 2 HP | (Clamp destroyed); Pulse 1 + 1 | 19 / 4 (expiry) |
| 5 | Rend saw: 10 → 0, destroyed, the round's Saw cancelled | Pulse 1 | 18 / 6 |
| 6 | Guard | Hymn ⌈3/2⌉ = 2, +4 → **Rupture**; Pulse ⌈2/2⌉ = 1 | 15 / 8 |
| 7 | Claw core: 60 → 54 | Pulse 1 + 1 | 13 / 4 (expiry) |
| 8 | Rend choir: 18 → 8 | Pulse 1 | 12 / 6 |
| 9 | Rend choir: 8 → 0, Hymn cancelled; own cost → 8 → **Rapture** | Pulse 1 | 11 / 8 |
| 10 | Claw (Rapture) 9 → 45 | Pulse 1 | 10 / 4 (expiry) |
| 11–17 | Claw 6 each → 3 | Pulse 1 each | 3 / 4 |
| 18 | Claw → 0: victory before the pulse | — | 3 / 4 |

The route is long, and dismantling the Warden fully is what makes it possible. That is a watch item for tedium; the solo route is a diagnostic, not a balance target.

**(b) No single round-1 opening dominates the Warden across the seven parties.** The probe enumerated every distinct round-1 joint opening for a fresh Warden fight: U 10, G 9, A 10, UG 99, UA 110, GA 90 and UGA 1,080, 1,408 in total. Each continuation was searched. Openings are classed by the part that receives their direct damage: core, a single component, mixed, or control (no damage).

| Party | Best class (HP left, 2 Salves) | Runner-up gap | Best class without Salves (HP) | Runner-up gap |
| --- | --- | --- | --- | --- |
| U | clamp (20/40) | 5 (control) | — | — |
| G | none wins | — | — | — |
| A | choir (2/22); 3 of 10 openings win | 0 | — | — |
| UG | mixed (63/64) | 0 | core (49) | 0 |
| UA | mixed (58/62) | 0 | core (46) | 0 |
| GA | core (45/46) | 0 | core (36) | 2 |
| UGA | mixed (83/86) | 0 | core (78) | 1 |

The dominance rule needs one class to be best in at least 6 of 7 parties, with every other class lost or at least 10 HP worse. No class meets it. Two watch items remain for the Q04 harness and the human test:

- **Without Salves, a core-focused opening is narrowly best in every multi-Brood party.**
- **The fresh duo and trio Warden fights are forgiving, and their openings are nearly indifferent with Salves.** In the trio, 797 of 1,080 openings end within 2 HP of the best; without Salves, 27 do. This is the expected cost of [P4]: with fixed enemy stats, a party of n Brood has n times the actions and the HP, so a Warden that one Ugallu can beat is mild for three. The gauntlet, not the isolated Warden, carries the duo tension.

**(c) Girtablilu's first exposed turn against the Celestial Guard (solo, fresh).** Round 1 declares Strike 9 at Girtablilu, the highest HP. Each option, with the rest of the fight searched:

| Round 1 action | Immediate | Searched result, no Salves | With 2 Salves |
| --- | --- | --- | --- |
| Envenom (arm, limb or body) | 2 damage (0 on body armor); P = 3; Weakened, so Strike 9 − 3 = 6 → 18 HP | Win in round 4, 6 HP | Win in round 7 or 8, 21–24 HP |
| Pincer weapon arm | Arm 12 → 7; takes 9 → 15 HP | Win in round 6, 9 HP | Win in round 7, 24 HP |
| Guard | Takes ⌈9/2⌉ = 5 → 19 HP, no progress | Win in round 5, 1 HP | Win in round 9, 22 HP |
| Pincer body or limb | — | Loss | Body: win in round 6, 3 HP; limb: loss |

The poison line, which Q02 encodes as parity seed `seed-girtablilu-guard`, runs as follows:

- **Round 1:** Envenom arm (12 → 10, P 3, Weakened); Strike 6 → 18 HP; tick 3 → life 19, P 2.
- **Round 2:** Envenom arm (→ 8, P 5); Strike 6 → 12; Pin 2 − 3 = 0, but Pinned; tick 5 → 14, P 4.
- **Round 3** (Pinned, so no Guard): Envenom arm (→ 6, P 6); Strike 6 → 6; tick 6 → 8, P 5.
- **Round 4:** Rupture Venom 2 × 5 = 10 ≥ 8. Victory with 6/24 HP and Revelation 2.

Envenom is a partial Guard, taking 6 instead of 5, that also buys delayed damage: the poison identity survives its first exposed turn. Disabling the arm first wins later but with more HP, so neither line dominates.

**(d) Gauntlet outcomes** (guard-scribe → guard-beast → warden), with surviving HP after each fight:

| Party | Fight 1 | Fight 2 | Fight 3 (Warden) | End | Share of max HP |
| --- | --- | --- | --- | --- | --- |
| U+G+A | won in round 3; 40/24/22; 1 Salve left | won in round 4; 40/24/21; 0 left | won in round 3; 37/22/16 | **win** | 87% (forgiving) |
| U+G | won in round 5; 38/24 | won in round 6; 34/23 | won in round 7; 23/17 | **win** | 63% |
| U+A | won in round 5; 40/22 | won in round 6; 36/12 | won in round 7; 28/2 | **win** | 48% (tense) |
| G+A | won in round 4; 18/16 | won in round 6; 18/6 | won in round 5; 3/1 | **win** | 9% (very tense) |
| U, G, A solo | U loses fight 2 (round 8); G and A lose fight 1 | — | — | loss | no solo promise |

Duos are tense, and the trio is forgiving. The Ugallu duos are the most comfortable, because Hold redirects most single-target damage onto Ugallu's 40 HP. Exact-breakpoint watch items for Q04's scan:

- Stolen Bolt 8 destroys the Scribe's hand or tongue (8) in one action.
- Rend 10 destroys the locomotion organ (9) in one action.
- No v1 component is destroyed by a single basic attack.

## Presentation requirements

- A **1280×720** combat screen. The Brood panel shows a portrait (emblem or labelled shape), HP, Revelation and statuses. Enemy illustrations are drawn as labelled component diagrams. A declared-intent panel, a command menu and an event log complete the screen.
- **Two-way selection [U]:** selecting a part in the component list highlights it on the illustration, and selecting it on the illustration highlights the list entry. Hit regions are generous: at least 48×48 logical pixels, and larger than the drawn shape for small parts such as the tongue and hand.
- **Keyboard:** every command is reachable without a pointer. Arrow keys or Tab move through actors, actions and targets, Enter confirms and Escape backs out. A focused control never executes a different, hovered one; that was a POC 001 regression.
- **Audio [A]:** six synthesized Web Audio cues, derived from events: hit, armor (a hit mitigated by armor or Ward), component destroyed, poison, Revelation and death. A mute toggle is provided.
- **Credits:** the existing emblem attribution must be reachable from the UI ([credits](../../assets/CREDITS.md)).

## Acceptance questions for the first human test

The [protocol template](../plans/2026-10-19-db0bad72-poc-002-component-combat.md#q10--human-test-protocol-template) is planned as Q10.

1. Can testers predict the enemy phase from the declared intents before committing?
2. Do different testers, or the same tester on a second attempt, choose different first targets for the same encounter?
3. Can testers explain whether a transformation was Rapture or Rupture, and why?
4. After a death in the gauntlet, do they continue or restart?
5. Do they mis-select small parts?

## Deferred ideas [D]

Talk, Escape, retreat; exploration and world scale; hidden or partial information; more skills per Brood; enemy variants or a solo encounter variant; party-size scaling; second boss phases, summons and movement; final art and audio; the C# port and Godot presentation; a lore decision on Anzû versus Pazuzu.
