task: COUNCIL-poc002
role: architect
member: opus
status: complete
outcome: Recommends POC 002 as `poc-002-component-combat`, a headless-first TypeScript combat core with declared intents, Anzû, Item only, copied (not shared) POC 001 patterns, and a JSON content+record corpus for C# parity; supplies a complete provisional numerical spec checked by a throwaway deterministic search.
source_baseline: c82ec3c
artifacts:
  - docs/mailbox/poc-002-council/architect-opus.md
verification:
  - "Repository claims checked by reading source and docs at c82ec3c (file:line cited in section 1); no repository tests or builds were run."
  - "Spec arithmetic checked with a disposable Python simulator and beam search (width 100-200) outside the repository; heuristic search, not proof of optimality or impossibility."
  - "Handoff validator (skill copied to session scratch; dependencies installed there with bun install --frozen-lockfile, not in the repository): bun <copy>/scripts/validate.ts docs/mailbox/poc-002-council/architect-opus.md --repo . -> exit 0, ok true, no diagnostics, source_baseline resolved to c82ec3c71a499760fc2bf7c40c9b162a6856d03b."
review: not-run
discoveries:
  - "Under source 2's one-step Warden pattern, Revoke and full dismantling trivialise the boss; a staggered schedule is proposed."
  - "Exact single-action breakpoints recur (POC 001 Harrier 13; a 9-integrity Guard arm against Rend 10); the arm was raised to 11, which reduced but did not remove Rend-arm's lead."
  - "A Revelation cost is only a cost if Rapture has a price; proposed - while transformed, Revelation gains are lost as HP."
  - "No `poc-002-linked-tactics` reference exists in the repository outside this council folder."
blockers:
  - "User decisions required before implementation: D1-D8 in section 2."

# POC 002 council report — opus

Labels used throughout: **[repo]** verified repository fact, **[user]** user decision recorded in source 2, **[accept]** source proposal I accept, **[new]** my own proposal.

## 1. Assessment of the sources against the repository

**Accurate repository claims (source 1 §2):**

| Claim | Evidence |
|---|---|
| Root README is stale (says combat is unimplemented) | `README.md:29`, `README.md:58` against `docs/CURRENT.md:120-124` (P10 playable) |
| Prototype-local Phaser, TypeScript, Vite, Vitest and Bun | `poc-001-linked-formation/package.json` (phaser 4.2.1, typescript 7.0.2, vite 8.3.2, vitest 5.0.3, bun 1.4.2) |
| 581 unit tests and eight browser harnesses (as reported, not reproduced) | `docs/CURRENT.md:202`, `docs/CURRENT.md:207` |
| Seven SVG emblems | `assets/manifest.json:6-162` (seven entries) |
| Patrol targeting ignores positions | `poc-001-linked-formation/src/core/rounds.ts:20-40` |
| Dominant AI opening; Spread favoured against the Collector | `docs/mailbox/ai-playtest-20261005/scout-2.md:95`; `docs/CURRENT.md` P17 entry (R-H4) |
| Formation is mandatory state | `src/core/state.ts:21` |
| Record validator requires the fixed roster | `src/core/run-record.ts:117`, `:123`; `src/core/formation.ts:4` |
| An ability requires living formation partners | `src/core/abilities.ts:76-84` (Impale) |
| `Sting` is immediate damage | `src/content/brood.ts:11`; `src/core/abilities.ts:116-125` |
| Previews run the real command path | `src/core/preview.ts:12`; CURRENT P09 |
| Replay is an attempt record, not a save | `src/core/run-record.ts:25-37` |

**Stale or inaccurate:** source 1 talks about "Anzû's death" as if Anzû were in the roster. The repository roster is Pazuzu (`formation.ts:4`, brief `docs/prototypes/poc-001-linked-formation.md:18`, lexicon `docs/lexicon/README.md:8`). `poc-002-linked-tactics` appears nowhere in the repository. The literature claims are not assessed here.

**Recommendations I disagree with:**
- *Source 2's Warden pattern of one Clamp → Saw → Choir step per round.* That gives a single intent against three actors. Under my numbers it is weak: in search, Anzû alone grinds it down over 22 rounds, and in the Ugallu+Anzû duo Ugallu is never hit while Anzû loses 2 HP. I propose a staggered schedule (§3.5).
- *Six menu entries.* Talk and Escape have no consequence in a gauntlet with no world. I defer them (§2, D4).
- *Rupture Venom "delivers the remaining poison".* Remaining poison is triangular (P + (P−1) + …), which rewards unbounded stacking. I use a linear 2×P instead.
- *Reproducible records at implementation step 4.* The parity corpus has to exist from the first rules checkpoint; recording cannot be added late (§5).
- *Source 1 steps 1, 6–10 (rooms, saves, quests).* These are superseded by the user's combat-only decision **[user]**. Source 1's steps 2–5 remain sound and are folded into §5 **[accept]**.

## 2. Open decisions

| # | Decision | Recommendation |
|---|---|---|
| D1 | Folder name | **`poc-002-component-combat`** **[new]**. `dungeon-combat` promises a dungeon that is out of scope **[user]**. `linked-tactics` reuses POC 001's formation-link vocabulary for a design with no links. The name follows the `poc-NNN-short-name` rule (`docs/adr/0004-repository-and-poc-direction.md:13`). |
| D2 | Anzû vs Pazuzu | **Anzû in POC 002, stable ID `anzu`; Pazuzu stays untouched in POC 001** **[accept]**. Anzû is the thief of the Tablet of Destinies, which suits "stolen authority" (Stolen Bolt, Revoke). Pazuzu's kit is about wind and facing (Gale, Crosswind) and is tied to the formation. Renaming inside POC 001 would invalidate its records (`run-record.ts:117-123`). Whether Anzû replaces Pazuzu in the game's canon is the user's lore call. The lexicon should scope "Brood" per prototype. |
| D3 | Do enemies declare actions in advance? | **Yes. Every intent is declared at round start with its source part, function, target and number** **[new]**. Revoke, Guard, Hold the Threshold and Weaken all act on declared intents. P05 established the pattern, and the AI testers' decisions came from forecasts (`scout-1.md:125`). Hiding intents later is a knowledge-display experiment in the presentation layer, not a simulation change. |
| D4 | Item, Talk, Escape | **Item: one consumable (Salve) in scope. Talk and Escape deferred and not shown in the menu** **[new]**. The menu is Attack, Skills, Guard, Item. This follows source 1 step 2: "Do not display nonfunctional menu categories." Escape needs somewhere to escape to, and Talk needs authored encounters; both arrive with exploration. |
| D5 | Reuse from POC 001 | **Copy patterns into POC 002; nothing goes into `shared/`** **[new]**, per `README.md:45-47` and `ADR-0004:15`. Copy: the command envelope with atomic rejection and empty events (`commands.ts:43-47`), the `expectedRevision` stale guard, event-ID duplicate prevention (`state.ts:51-52`), cloning previews through the real command (`preview.ts`), versioned strict records (`run-record.ts:18-37`), defeat precedence (`lifecycle.ts:49-51`), code-point ID ordering (`lifecycle.ts:71-73`), the Docker/Bun wrappers and `just poc-002-*` recipes, and the CDP browser-harness approach. Do not copy formation, sectors, geometry, `ROSTER` or patrol targeting. Each copied file gets a provenance comment. The C# port re-implements rather than shares code, so TypeScript sharing buys nothing. |
| D6 | Portable format | **One content JSON plus self-contained battle records** **[new]** (details below). |
| D7 | Rapture vs Rupture selector | **The source of the crossing decides** **[new]** (§3.4). This is the most consequential rule in the spec and needs explicit user approval. |
| D8 | Balance target | **Balance the gauntlet around a duo; the trio is deliberately forgiving; no solo route against the Warden in this tuning** **[new, from source 1 §4.4]**. The user should confirm whether a solo Warden route is required. |

Other decisions the user should make before implementation:
- **Combat screen size.** I recommend 1280×720 logical, an exact 2× of the decided 640×360 viewport **[user]**.
- **Numbers visible.** Show all numbers in the POC 002 diagnostic build; hidden information is a later experiment.
- **ADR.** Record these decisions in a new ADR rather than amending ADR-0004 (`ADR-0004:71`).

**D6, portable format.** No mod framework: content can set numbers and compose named behaviours, but cannot define new behaviours or scripts.
- `content/combat-content.json` contains `schema: "tehom-combat-content/1"`, `contentVersion`, and `brood[]` (`id`, `hp`, `revCap`, `actions[]`). It also contains `actions[]` (`id`, `kind`, `targeting`, damage by part role and type, `revCost`, named `effect` rule IDs with parameters) and `enemies[]` (`parts[]` with `id`, `role: body|component`, `pool`, `armor`, `living`, `shieldedBy`, `function`, and a `schedule`). Finally it holds `encounters[]` and `gauntlet`. IDs are stable kebab-case strings; enemy instances are `<enemyId>#<index>`.
- **Record** (`schema: "tehom-combat-record/1"`): `rulesVersion`, `contentVersion`, `contentSha256` over the canonical content, and `producer {impl, build}`. A `scenario` holds `encounterId`, `party[]` and a **complete `initialState`** with no reliance on factory defaults. `commands[]` holds `{seq, expectedRevision, kind, actor, action, target}`, where the target is `{enemy, part}`, `{intent}` or `{brood}`. `expected` holds `events[]`, `finalState`, `outcome`, and `rejections[]` with error codes. A gauntlet record is an ordered list of fight records plus the carried state.
- **Canonical rules:** integers only (no floats anywhere, including Guard), ordinal string comparison (`string.CompareOrdinal` in C#), explicit floor/ceil helpers with no negative division, ordered arrays treated as contractual, and objects compared after parsing.
- **Parity test** **[user]**: for every record in the corpus, the C# implementation produces an identical event list, final state and rejection codes.

## 3. Draft numerical combat specification (provisional first tuning)

### 3.1 Turn structure (round r, starting at 1)

1. **Declare.** Enemies in encounter order, and parts in content order, declare their scheduled intents. Targets are computed from the state at that moment and are never recomputed. A Ward takes effect on declaration.
2. **Player phase.** The player picks any living Brood that has not acted, an action and a target. Validation is atomic; a rejection consumes nothing. Resolution runs in this order: (a) effects in the listed order, with destruction and intent cancellation happening immediately; (b) the action's Revelation cost; (c) any pending transformation starts; (d) deaths; (e) the outcome check. The phase ends when every living Brood has acted or the player ends it, forfeiting unused actions.
3. **Enemy phase.** Intents resolve in declaration order. Skip an intent that was revoked, whose source part is destroyed, or whose enemy is dead. Skip a single-target intent whose declared target is dead; it does not retarget. Otherwise: determine the recipient (Hold redirect); compute and apply damage; then, if the recipient is alive, apply riders (Revelation, Pinned, Clamped, clamp consumption); then retaliation; then pending transformations, deaths and the outcome check. Resolution stops at the first outcome.
4. **End of round.** E1: poison ticks in encounter order. E2: Girtablilu's transformation HP loss. E3: deaths and outcome, with **defeat taking precedence** if both occur. E4: expire round-scoped effects (Guard, Hold, Weakened, Ward, and Pinned or Clamped whose last round is r). E5: transformations whose end round is r end, and Revelation becomes ⌊cap/2⌋. E6: the damage ledger rolls over.

**Victory** comes the moment the last enemy's life reaches 0, even mid-phase; everything remaining is skipped. **Defeat** comes when every Brood is dead. Destroying components never wins on its own.

### 3.2 Components, damage and targeting

- An enemy has one **body**, whose pool is life, and named **components**, whose pools are integrity. A hit damages only the part it strikes, and **excess never overflows** from a component to life **[accept]**. A component at 0 integrity is destroyed until combat ends. That cancels its declared intents and removes its functions, and it stops being a target. The enemy dies when its body life reaches 0.
- **Valid target:** a part with a pool above 0, on a living enemy, that is not shielded. The Beast's core is shielded while its Shell is intact. Rupture Venom and retaliation ignore shielding.
- **Damage to an enemy part:** max(0, raw − Ward 3 (if warded) − armor (physical only)). Magical damage ignores armor. Poison and Rupture Venom ignore armor, Ward and shielding.
- **Damage to a Brood:** base (+10 for a Saw on a Clamped recipient) → −3 if the source is Weakened and the hit is physical → +2 if the recipient is Ugallu in Rupture → Guard (take ⌈d/2⌉) or Hold (−2) → floor at 0. Riders such as Revelation are never reduced by Guard **[accept]**.
- **Living parts.** Poison and Weaken apply only when the struck part is living, even if the hit deals 0.
- **Ties.** Every ranking breaks ties by its stated keys, then roster order (Ugallu, Girtablilu, Anzû).

### 3.3 The three Brood

Guard (all Brood): until the round ends, each hit deals ⌈d/2⌉. It cannot be used while Pinned. Salve (Item): +10 HP to any living Brood, uses the actor's action; two per gauntlet (two per selection-screen fight).

| Brood | HP | Rev cap | Attack | Skill 1 | Skill 2 |
|---|---|---|---|---|---|
| Ugallu | 30 | 8 | **Claw** 6 physical | **Rend**: 10 physical to a component, 3 to a body; +2 Rev | **Hold the Threshold**: self or one non-Pinned ally, until the round ends. Single-target intents on that ally are redirected to Ugallu. Each hit on Ugallu −2. After each damaging hit, if Ugallu is alive, 4 physical to the intent's source part. Not usable while Pinned. |
| Girtablilu | 24 | 8 | **Pincer** 5 physical | **Envenom**: 2 physical. If the struck part is living: poison +3 (cap 6) and the enemy is **Weakened** this round. | **Rupture Venom**: needs poison ≥ 1. Deals 2×P to the body, then P = 0; +2 Rev. |
| Anzû | 22 | 10 | **Talon** 5 physical | **Stolen Bolt** 8 magical; +2 Rev | **Revoke**: cancel one active, unresolved intent this round whose source is a component; +4 Rev. A Revoked Inscribe ends the Ward. Schedules do not shift. |

### 3.4 Revelation, Rapture and Rupture [new]

- **Sources:** Rend +2, Rupture Venom +2, Stolen Bolt +2, Revoke +4, Utter +3, Hymn +4. Values clamp to the cap. Revelation is never reduced. Learning has no Revelation cost in POC 002 (source 1 §4.5).
- **Single threshold = cap.** A crossing is reaching the cap from below. The **kind is set by the gain that crossed**: the Brood's own action cost gives **Rapture**; an enemy effect gives **Rupture**. The transformation starts after the causing action or intent has fully resolved, so it never boosts its own trigger. When an area effect crosses several Brood, each transforms, in roster order.
- **Duration:** until the E5 step of the round after the round it began.
- **While transformed:** Revelation is locked at cap, and **each point the Brood would gain is lost as HP instead**. This applies to its own costs and to enemy riders, and it can kill.
- **Expiry:** Revelation becomes ⌊cap/2⌋ (U 4, G 4, A 5). Crossing again is allowed and unlimited; it means reaching the cap again from there. **Death during a transformation:** it ends with no expiry processing. **Victory during a transformation:** it ends and expiry applies, so the transformation never carries into the next fight.

| Brood | Rapture (own crossing) | Rupture (imposed crossing) |
|---|---|---|
| Ugallu | Claw and Rend +3 and ignore armor; cannot Guard or Hold | Cannot Hold; each enemy hit on Ugallu +2 |
| Girtablilu | Envenom sets poison to 6; Rupture Venom deals 3×P; loses 2 HP at E2 | Envenom and Rupture Venom unavailable; loses 3 HP at E2 |
| Anzû | Stolen Bolt 12; Revoke may target body-sourced intents; cannot Guard | Stolen Bolt and Revoke unavailable |

The decision this creates: when the Choir or a Tongue is about to cross you, spend your own Revelation first and take Rapture. The cost is a half-full meter for the rest of the gauntlet.

### 3.5 Enemies

| Enemy | Part | Pool | Armor | Living | Function |
|---|---|---|---|---|---|
| **Celestial Guard** | Body | life 22 | 2 | yes | — |
| | Weapon arm | 11 | 0 | yes | **Strike**, every round: 8 physical to the Brood that removed the most of this enemy's pools last round (any part; direct hits, retaliation and Rupture Venom count, poison ticks do not); otherwise the highest current HP |
| | Restraining limb | 7 | 0 | yes | **Pin**, even rounds: 2 physical + **Pinned** to the lowest current HP. Pinned lasts the next round: no Guard, no Hold, and Ugallu cannot Hold for that Brood. |
| **Naming Scribe** | Body | life 16 | 0 | yes | — |
| | Inscription hand | 6 | 0 | yes | **Inscribe**, every round: **Ward** on the first other living enemy in encounter order (else itself). Ward: −3 to every direct damage instance on any of that enemy's parts. |
| | Tongue | 6 | 0 | yes | **Utter**, every round: 2 magical + 3 Rev to the non-transformed Brood with the highest Revelation (if none, the lowest HP) |
| **Corrected Beast** | Core (body) | life 18 | 0 | yes | Shielded while the Shell is intact. **Gore**, rounds not divisible by 3: 6 physical (+3 while Locomotion is intact) to the lowest current HP. Not Revokable outside Anzû's Rapture. |
| | Shell | 12 | 4 | no | Shields the core; no poison through the Shell |
| | Locomotion organ | 8 | 0 | yes | **Trample**, rounds divisible by 3: 5 physical to every Brood. Also powers Gore's +3. Envenom here poisons the core through the Shell. |
| **Warden of Correct Form** | Core (body) | life 72 | 0 | yes | Always targetable |
| | Saw | 30 | 3 | no | **Saw**, even rounds: 14 physical to the Clamped Brood (else the highest current HP). +10 if the *actual* recipient is Clamped. A Saw hit consumes Clamped. |
| | Clamp | 20 | 3 | no | **Clamp**, odd rounds: 6 physical + **Clamped** (lasts until the end of the next round) to the Brood with the highest Revelation, ties broken by lowest HP |
| | Choir | 18 | 0 | yes | **Hymn**, rounds divisible by 3: 3 magical to every Brood, then +4 Rev each |

A destroyed part removes exactly its listed function; slots are skipped, never filled with other attacks **[accept]**. A fully dismantled enemy is harmless but still alive. Stalling gains nothing, because nothing regenerates, decays or heals.

### 3.6 Statuses

- **Poison:** a value P per enemy, cap 6, added by Envenom. At E1 the body loses P, then P−1.
- **Weakened:** −3 to each of that enemy's physical intents this round. It does not stack.
- **Pinned and Clamped:** applied only if the recipient survives the hit.
- **Ward:** continuous while Inscribe is active and the hand is intact. Several Wards do not stack.
- **Guard and Hold:** last until the round ends.

None of these carry between fights.

### 3.7 Encounters and gauntlet

- **Selection screen:** any of the seven non-empty parties against: Guard; Scribe; Beast; Guard+Scribe (the Scribe wards the Guard); Beast+Scribe (shell armor 4 + Ward 3); Guard+Beast; Warden.
- **Gauntlet:** fight 1 Guard+Scribe, fight 2 Beast+Guard, fight 3 Warden. **Carried:** HP, Revelation (after expiry resets), deaths and Salves. **Not carried:** statuses, poison and transformations. There is no other healing, dead Brood stay dead, and losing any fight ends the gauntlet.

### 3.8 Edge cases the Implementer must not guess

- **Retaliation:** it strikes the intent's source part, ignoring shielding but not armor or Ward, and only after a damaging hit that Ugallu survives. If it kills the last enemy, that is immediate victory.
- **Redirect:** a Hold redirect makes Ugallu the recipient of Clamp and Pin riders, and the Saw bonus checks Ugallu's own Clamped state. Area intents are never redirected, but Hold's −2 and retaliation still apply to Ugallu's share.
- **Overkill and poison:** overkill does not carry over. Envenom that deals 0 damage to a living part still poisons. Rupture Venom on an enemy with P = 0 is an illegal target.
- **Ledger:** the Celestial Guard's "most damage" ledger counts pool actually removed.
- **Saw targets:** at most one Brood can be Clamped at a time, because Clamp lands on odd rounds and Clamped expires a round later.
- **Rapture and Rupture:** Revelation burn is ordinary damage for death checks. In Ugallu's Rapture, armor is ignored but Ward is not.

### 3.9 Arithmetic

All lines below are reproduced by the simulator, and the beam search chose them. Selection-screen results were computed without Salves.

**(a) Girtablilu's first exposed turn against the Celestial Guard (solo; in a trio, R1 Strike falls on Ugallu, the highest HP).**
- R1 intent: Strike → G, 8. The options are Guard (take 4, no progress), Pincer the arm (take 8; arm 11→6), or **Envenom the arm**: arm 11→9, P 3, Weakened, so Strike 8−3 = 5 and G is at 19. E1: body 22→19, P 2.
- R2: Envenom (arm 7, P 5); Strike 5 → G 14; Pin 2−3 → 0 damage, but G is Pinned. E1: body 14, P 4.
- R3 (Pinned, so no Guard): Envenom (arm 5, P 6); Strike 5 → G 9. E1: body 8, P 5.
- R4: **Rupture Venom** 2×5 = 10 ≥ 8. Victory with G at 9/24.

Envenom is a partial Guard (5 taken against 4) that also buys 6+ delayed damage, so the poison identity survives its first exposed turn. Pincer-only play wins later and with less HP.

**(b) The Warden, fresh party.**

Trio (U30 G24 A22; core 72):

| Round | Intents | Actions | Core / P after the round | Brood |
|---|---|---|---|---|
| R1 | Clamp→A | A Bolt 8; U Claw 6; G Envenom 2 (Weakened) | 56→53, P2 | A 22−3 = 19, Clamped |
| R2 | Saw→A (24) | G Envenom; U Rend Choir 18→8; A Revoke Saw (rev 6) | 51→46, P4 | — |
| R3 | Clamp→A, Hymn | A Bolt (rev 8); G Envenom (P6); U Rend Choir → destroyed, Hymn cancelled | 30, P5 | A 16 |
| R4 | Saw→A | U Claw; G Pincer; A Revoke (8+4 → cap, **Rapture**) | 14, P4 | — |
| R5 | Clamp→A | U Claw → 8; G Rupture Venom 2×4 = 8 | 0 | Victory 30/24/16 |

Duo G+A:
- R1: G Envenom, A Talon → core 62 (P2); Clamp 3 → A 19.
- R2: Envenom; A Revokes the Saw (rev 4) → 55.
- R3: Envenom (P6); A Revokes the Hymn (rev 8); Clamp 3 → A 16 → core 47.
- R4: Pincer; A Revokes the Saw → **Rapture** → 37.
- R5: Bolt 12 (2 Revelation burned → A 14); Envenom; Clamp 3 → A 11 → 17.
- R6: Bolt 8, Rupture Venom 10. Victory at 24/11.

Duo U+G wins in R8 only after Ugallu dies (the clamped Saw in R6). Duo U+A wins in R10 with A at 8.

Solo (structural): the Warden alternates Clamp 6 and Saw 24 on the only Brood.
- Ugallu: R1 → 24, R2 Guard → 12, R3 Clamp+Hymn while Guarding → 7, R4 Saw → dead. Rend 7 against the Saw's 30 integrity needs 5 actions, so the Saw cannot be removed in time.
- Anzû: Revoking every Saw leaves it dealing 10 damage in 9 rounds before it dies; R6's Hymn crosses Revoke-raised Revelation into a **Rupture**.
- No solo win was found (beam width 150–200).

**(c) Does a single opening dominate?** Round 1 was forced, then searched:

| R1 opening | Trio | U+G | U+A | G+A |
|---|---|---|---|---|
| Core race | **W R5, 70 HP** | W, U dead, 15 | W R10, 38 | W R6, 33 |
| Saw first | W R6, 64 | L | W, 38 | W, 22 |
| Clamp first | W R6, 65 | L | **W, 44** | W, 22 |
| Choir first | — | **W, U dead, 18** | **W, 44** | **W R7, 35** |

The best opening differs by composition, and the runner-up is 0–5 HP behind, so **no opening dominates the Warden** in this tuning. Two near-dominances were found. With Clamp integrity at 16, a trio destroyed it in R1, and clamp-first was best in 3 of 4 compositions; raising it to 20 removed that. With the Guard's arm at 9, Rend 10 killed it in one action, so Rend-arm was best or tied-best in every Ugallu party against Guard+Scribe, and uniquely best for U+G by 5 HP. Raising the arm to 11 only *reduced* that: Rend-arm is still best or tied (U+G openings now span 41–45 HP), so it stays a watch item. What *does* persist is kit-level habit: **every Anzû win Revokes every Saw**, and **Girtablilu keeps Envenom up on the core**. These are the first things to falsify (§4).

Gauntlet (searched fight by fight, no Salves): the trio wins at 20/24/7. U+A wins fight 3 at 12/2. G+A wins at 3/2. U+G loses the Warden. This is duo-tense and trio-forgiving, as intended (D8).

## 4. Falsification and test plan

**Automated (headless, deterministic):**
1. **Contract tests (ADR-0006),** using explicit content fixtures, never defaults:
   - dead actors never act;
   - a destroyed part cancels exactly its intents;
   - a rejected command changes nothing;
   - duplicate commands are refused;
   - one surviving Brood is not defeat;
   - victory happens mid-phase;
   - defeat takes precedence;
   - crossing kind follows the gain's source;
   - transformation expiry resets Revelation to ⌊cap/2⌋;
   - preview equals commit.
2. **Golden records:** the lines in §3.9(a) and (b) serve as parity corpus seeds, pinned to a content version, not as balance assertions.
3. **Scenario sweep:** seven parties × seven encounters × three starts (fresh, 50% HP, Revelation = cap−2). Use beam search (width ≥ 200) and exhaustive solo search to depth 4. Report win/loss, rounds, HP left and action-use shares.
4. **Opening and policy probes:** enumerate every round-1 joint action. Fixed policies: always disable, always core, poison then Guard, Rapture as soon as possible, never use Revelation skills, Revoke every Saw.
5. **Breakpoint scan:** ±1 and ±2 on every number, flagging any part that a single action exactly destroys.

**Failure signals:**
- One opening is best in ≥ 75% of cells, with the runner-up ≥ 10 HP worse or lost.
- A fixed policy comes within 10% of search in ≥ 75% of cells.
- "Never Revelation" matches search, meaning Revelation is decorative.
- "Rapture as soon as possible" matches search, meaning the cost is not a cost.
- Revoke is used on 100% of Warden Saws.
- An action is used less than 5% of the time where it was designed to matter (Pincer, Hold, Anzû's Guard).
- A winning line needs more than 10 rounds (tedium).
- Every opening ties, meaning the decision is indifferent.

**First human tests:**
- **Setup:** four to six testers on the diagnostic build. Each plays the solo Guard fight with each Brood, a trio gauntlet, then a duo gauntlet of their choice. Every attempt exports a record.
- **Failure signals:**
  - testers cannot say why a target was invalid or why an enemy still acted;
  - they ignore declared intents when choosing Guard or Hold;
  - they cannot say whether a transformation was their doing;
  - they restart after a mid-gauntlet death rather than continue (source 1 §4.4);
  - small parts (Tongue, hand) are mis-selected.

## 5. Recommended next steps

1. **ADR-0007** (`docs/adr/0007-poc-002-component-combat.md`). Record the user decisions **[user]**: combat-only, Phaser/TypeScript → C#/.NET with Godot, a game-owned simulation, parity as the migration test, the art specification, and world scale deferred. Add D1–D8 once accepted.
2. **Brief** (`docs/prototypes/poc-002-component-combat.md`). The question, hypotheses, scope, and §3 as its decision record, with numbers as test parameters (the POC 001 brief pattern).
3. **Plans** in `docs/plans/` under ADR-0002 names (`2026-10-xx-<rand8>-poc-002-…`), plus a POC 002 section in `docs/plans/README.md`. Update the lexicon and the root README (the stale prototype row is `README.md:29`).

**Smallest first checkpoint, Q01:**
- **Build:** a headless TypeScript core in `poc-002-component-combat/` with the copied toolchain and the content JSON. Scope: the turn structure of §3.1, components, the Celestial Guard, all three kits with Revelation accounting (transformations off), the record format and replay, and `just poc-002-test`.
- **Acceptance:** the contract tests, plus the §3.9(a) line replayed byte-identically from its record.

Then:
- **Q02:** transformations, the Scribe and the Beast.
- **Q03:** the Warden and the sweep/probe harness, *before* any UI.
- **Q04:** the Phaser battle UI with two-way limb selection.
- **Q05:** gauntlet, Salve and export.
- **Q06:** human tests.

## 6. Risks and open questions

- **Search artifacts.** The tuning comes from a heuristic beam search. A "loss" means no win was found, not that none exists, and the gauntlet search is myopic across fights.
- **Warden fixation.** Clamp targets the highest Revelation, which is usually Anzû, so Ugallu is untouched in the trio and U+A lines. Do players find that legible, or unfair?
- **Crossing-source rule (D7)** may feel arbitrary when an enemy rider lands one point short of a self-crossing. The HP burn during transformation may be hard to read.
- **Trio too forgiving, no solo Warden route.** The levers are a solo encounter variant shown openly, or Saw every third round. A hidden scaling bonus is not one.
- **C# parity hazards:** integer division and rounding, ordinal ordering, event granularity. Source 1 also states that Godot 4 C# cannot export to the web (unverified here), so tester builds may stop being browser builds after the port.
- **Content art.** Small components need generous hit regions. Three ordinary illustrations, one boss and masks have to come from existing art (source 2 §5).

**Validation note:** the handoff block validated with exit 0 and no diagnostics, using a scratch copy of the validator (details in `verification`). The simulator and search scripts used for §3.9 are disposable and live in the session scratch directory, `/tmp/claude-1000/-opt-dev-tehom-brainlab-poc002-council/c60c2233-c59d-414a-ab34-51bf2f4e5ca9/scratchpad/` (`sim.py`, `trace.py`, `openings.py`, `gauntlet.py`). They are not repository artifacts.
