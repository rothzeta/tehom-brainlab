<!--
Source material for task COUNCIL-poc002. The user pasted this into the Coordinator session on 2026-10-19.
It is the first of two documents from the user's external design conversation (ChatGPT). It is reproduced verbatim below.
The linked backlog file is a sandbox path in that conversation; it is not available in this repository.
Proposals in this document are not accepted decisions; see source-2-decisions.md for the later, narrower direction.
-->

# TEHOM: critical review and implementation plan

**My conclusion is to keep the change in direction, but reduce the number of promises attached to it.**

The strongest version of TEHOM is now a **knowledge-driven dungeon RPG with dangerous, function-targeting combat and lasting consequences for its characters**. Its distinction is not simply that it is difficult, obscure, or inspired by *Fear & Hunger*. It is that the player gradually understands a world built to conceal what happened to their own kind.

That is a strong relationship between setting and play.

The main risk is that we have repeatedly added a plausible mechanic to solve the problem created by another plausible mechanic. Permanent death needs replacement companions. Replacement companions create party-size problems. Long attempts need persistent progress. Persistent progress weakens danger. Hidden information creates atmosphere but complicates tactical learning. Revelation rewards knowledge but can also punish the act of acquiring it.

**Those systems can coexist, but they will not reinforce one another automatically.**

I reviewed the conversation, the accessible GitHub repository, selected implementation files and verification records, and the research discussed below. The repository audit covers remote `master` at **`c82ec3c71a499760fc2bf7c40c9b162a6856d03b`**. I could inspect the source, but I did not independently run its application or reported test suite. Unpushed local work was not visible.

The ten implementation steps are also available as an issue-ready document:

:chatgpt-content-reference{index="34"}[Download the implementation backlog](sandbox:/mnt/data/tehom_audit/TEHOM_Next_Ten_Implementation_Steps.md)

---

## 1. What changed—and whether the change makes sense

The change is larger than replacing a formation system with limb targeting.

| Area | Earlier direction | Current direction |
|---|---|---|
| Main activity | Repeated party-tactics expeditions | Exploring and understanding an interconnected dungeon |
| Character structure | Choose three from a roster at the Heart | Begin with a character and assemble a party through exploration |
| Death | Recovery or reconstruction, with a separate permanent-death option | A companion can be permanently lost during an attempt |
| Progression | Builds, mutations, roster recovery, campaign pressure | Player knowledge, character development, and selected persistent world changes |
| Combat | Formation, exposure, protection, rotation | Player-first team turns, enemy functions, limited commands, Revelation |
| Narrative delivery | Hub events and expedition encounters | Geography, NPC trajectories, discoveries, choices, and surviving characters |
| Production emphasis | Combat systems and encounter composition | Combat **plus** authored rooms, navigation, quests, persistence, and environmental storytelling |

### The change is creatively coherent

You have repeatedly expressed enthusiasm for making locations, writing encounters, discovering the story through the world, and creating a place worth investigating. The new direction makes those activities central rather than supplementary.

The Panopticon also becomes more than a backdrop. An archive that changes what is recorded, a sanctuary hidden inside conquered flesh, or a shortcut that admits a celestial patrol can express the fiction through something the player does.

### The change is not a reduction in total production difficulty

It probably reduces the difficulty of getting a recognizable dungeon-RPG experience on screen. It does **not** necessarily reduce the difficulty of finishing the game.

You are trading some formation-system complexity for:

- More authored locations and interactions.
- More combinations of quest, companion, and world states.
- More navigation and save-system requirements.
- More audiovisual content.
- More opportunities for players to miss the information needed to understand their situation.

The distinction matters: **“I will enjoy producing this content more” is a sound reason to change direction. “This will be much easier to finish” is not yet supported.**

### I need to correct some of my earlier advice

I was too categorical about 16×16 artwork. Tile dimensions do not determine the size of characters, the scale of architecture, or the quality of the composition. We should evaluate actual scenes, not declare a resolution inadequate in isolation.

I also drew too sharp a line between Phaser as a disposable prototype tool and Godot as the “real game” tool. Phaser supports the scenes, tilemaps, animation, input, and audio needed for this kind of 2D game. The choice should follow your production workflow and target platforms, not that distinction. [Phaser](https://phaser.io/why-phaser)

The proposed completion times, the feasibility of every Brood finishing alone, and the benefit of multiple mandatory completions remain hypotheses. Our earlier enthusiasm did not establish them.

---

## 2. What the repository actually contains

### It is substantially further along than its root README suggests

The root README still describes the initial browser shell and says combat is unimplemented. Later state records and the actual source describe and implement considerably more. That discrepancy is itself worth fixing: a new contributor could make the wrong architectural decision after reading the supposed entry point.  

The inspected repository contains:

| Area | Verified in source or recorded evidence | Assessment |
|---|---|---|
| Toolchain | A prototype-local Phaser, TypeScript, Vite, Vitest, and Bun setup | A usable starting point; not a reason to upgrade or replace everything |
| Simulation | Explicit state, commands, validation, phases, effects, and lifecycle handling | Strong architectural foundation |
| Combat | Linked formations, protection, abilities, patrol combat, and boss encounters | Real implementation, but aimed at the earlier design |
| Forecasting | Previews use the command-resolution path | A valuable pattern to preserve |
| Reproducibility | Versioned battle records, configurations, commands, and replay validation | Useful for balancing and regression analysis |
| Verification | Records report 581 unit tests and eight browser harnesses | Correctness evidence, not proof of enjoyable play |
| Assets | Seven attributed SVG prototype emblems | Enough for functional testing, not a finished RPG art or audio foundation |

The toolchain and simulation findings come from the package manifest and core modules. The reported test counts come from delivery records; I did not reproduce them here.    

### The most useful repository finding is a negative result

The recorded AI trials found a dominant opening: expand, kill the Harrier at the damage breakpoint, and remain spread. Later controlled Collector comparisons also favored spreading on incoming damage. The Collector report correctly limits that finding: it is not proof of a universally optimal strategy or of human enjoyment.  

There is also a recorded human observation that patrol attacks did not require meaningful movement. The source explains why: `announcePatrol` selects targets by roster position, a round-based cycle, and health ratio—not enemy coordinates.  

This gives us a concrete lesson:

**A mechanic does not become important because it has been implemented thoroughly. The encounters must create reasons to use it.**

The same could happen to body parts, poison, Guard, Talk, or Revelation.

### What should survive the change

Preserve the principles behind the command boundary, deterministic events, replay records, and shared preview/execution logic. They let you investigate the design without wondering whether the presentation secretly uses different rules.  

Do **not** assume the existing combat model is a generic RPG foundation:

- Formation is mandatory in the current state.
- The record validator expects the fixed roster.
- Some abilities explicitly require living formation partners.
- `Sting` currently applies immediate damage; it is not a developed poison system.
- Battle replay is not an attempt/profile save system.   

**Recommendation: preserve POC 001 and start an independent POC 002.** Reuse patterns and selected infrastructure. Do not contort formation-specific code into the new design merely to preserve implementation effort.

That also follows the repository’s own rule that experiments remain independent and shared code should emerge from demonstrated reuse. 

---

## 3. What the literature supports—and what it does not

I used several kinds of evidence. The motivation research provides empirical findings. Developer articles provide experience from particular games. Design essays provide analytical frameworks. The GDC material below was reviewed through published session summaries, not treated as fully watched talks.

None establishes a universal formula for enjoyable turn-based combat.

| Source | Relevant finding or argument | Implication for TEHOM |
|---|---|---|
| **Ryan, Rigby, and Przybylski: player motivation** | Their studies associate perceived competence and autonomy with enjoyment and preferences. | Let players develop a reliable sense that their understanding and choices matter. This does not imply making the game easy. [Ewha Womans University](https://pure.ewha.ac.kr/en/publications/the-motivational-pull-of-video-games-a-self-determination-theory-/) |
| **Costikyan: *Uncertainty in Games*** | Uncertainty includes analytical complexity and narrative anticipation, not only randomness. | TEHOM can retain uncertainty without making basic combat results unreliable. [MIT Press](https://mitpress.mit.edu/9780262018968/uncertainty-in-games/) |
| **Giovannetti: *Slay the Spire* balancing** | The development approach combined metrics with community feedback and attention to game feel. | Record what players do, but do not replace observation with win rates or ability-use percentages. [GDC Vault](https://www.gdcvault.com/play/1025731/-Slay-the-Spire-Metrics) |
| **Davis: *Into the Breach* postmortem** | The project required extensive iteration, cuts, and balancing despite its compact presentation. | A small-looking combat system can still require substantial design work. Simplicity is a goal, not evidence that development will be short. [GDC Vault](https://www.gdcvault.com/play/1026333/-Into-the-Breach-Design) |
| **Beachum: *Outer Wilds* exploration** | Narrative was designed to motivate player-directed curiosity rather than rely on assigned missions. | Removing markers is insufficient. The world must produce questions the player wants to answer. [GDC Vault](https://www.gdcvault.com/play/1027368/Independent-Games-Summit-Sparking-Curiosity) |
| **Jenkins: narrative architecture** | Spatial organization and embedded evidence can carry narrative. Essential information needs redundancy in exploratory structures. | Design important revelations into rooms, routes, objects, and encounters—not only dialogue. [Massachusetts Institute of Technology](https://web.mit.edu/~21fms/People/henry3/games%26narrative.html) |
| **Frictional Games: horror and failure** | The studio identifies both combat enjoyment and repeated failure as potential threats to fear. Its *Rebirth* postmortem also records mixed responses to softer failure consequences. | Neither lethal repetition nor forgiving failure automatically preserves horror. Consequences must be understood and emotionally meaningful. [frictionalgames.com](https://frictionalgames.com/2009-11-why-horror-games-suck/) |

A particularly useful counterexample to our earlier discussion is **Crystal Project**. Its developer explicitly combines exploration with visible turn order, damage, probabilities, and threat targeting. This disproves the simple proposition that an exploration RPG needs hidden combat information to retain discovery. It does not prove that full disclosure is the right aesthetic for TEHOM. [Steam Store](https://store.steampowered.com/app/1637730/Crystal_Project/)

Conversely, **Heaven’s Vault** demonstrates a different use of uncertainty: the player’s interpretation can be wrong and still move the narrative forward. That supports experimenting with an almanac of hypotheses—but not necessarily making the player transcribe damage numbers. [inklestudios.com](https://www.inklestudios.com/heavensvault/)

The literature leaves us with a better question than “Which game should we copy?”:

> **Which uncertainty should remain interesting after the player understands the rules?**

For TEHOM, my answer is: unfamiliar places, conflicting testimony, changing circumstances, and the future cost of a decision—not permanent uncertainty about whether a button does what it says.

---

## 4. The main design risks

### 4.1 We should stop trying to make every battle remain a puzzle forever

Our conversation improved when we accepted that an individual enemy can become solved.

A familiar guard can become a quick, reliable encounter. That is part of the reward for learning. The mistake would be making the same solution dominate the whole game.

There are three different experiences to support:

| Stage | Player’s main question |
|---|---|
| First encounter | What can this creature do? |
| Familiar enemy in a changed situation | Which of its capabilities matters here? |
| Mastered route | Is this encounter worth fighting at all? |

These stages should not require the same amount of thought.

**The pitfall:** responding to every dominant tactic by adding armor, regeneration, retaliation, or a new immunity. That can create enemies that appear designed to negate the player rather than obey the world.

**Safeguard:** preserve the learned rule while changing its value. Cutting off an arm should continue to remove the same capability. What changes is whether that capability is the most urgent threat, whether the player can afford the action, and what another enemy is doing.

**What would falsify my recommendation:** players may enjoy rapidly executing a learned sequence more than continually reconsidering familiar enemies. If so, allow more solved encounters and put the challenge at meaningful junctions. Do not force “variety” into every corridor.

Also, frequent use of a basic attack is not inherently a failure. An ability is a problem when it never becomes worthwhile in the circumstances it was designed for—not merely because another action is more common.

### 4.2 Player-first team turns have a specific structural bias

The selected baseline is sensible. It is easy to understand and inexpensive to compare against alternatives later.

But a successful opening attack can have two benefits at once:

1. It advances the enemy toward defeat.
2. It removes damage or disruption the enemy would otherwise inflict.

A limb-disabling attack can be even stronger because it removes future capability without needing to kill the whole enemy.

Therefore, **damage, disabling, and acting first can reinforce one another**. Guard and slower strategies must compete against the entire value of prevention, not just against the damage number.

I would initially test:

- A cheap attack that deals damage but does not disable.
- A more expensive commitment that disables a dangerous function.
- A defensive action that buys time efficiently.
- A delayed effect that creates value while the character takes other actions.

Do not automatically make the disabling option do everything well.

### 4.3 The poison example is still our best test

A poison build is not viable merely because poison eventually deals enough damage.

It must survive until that damage matters.

If a character spends its first action applying poison and the enemy then kills it, the existence of Guard does not solve the problem. Guard on the second turn arrives too late.

This requires a **survival budget** for each intended archetype.

| Archetype | How it wins | What must let it survive |
|---|---|---|
| Direct physical | Removes critical functions or kills quickly | Reliable access to its target and manageable exposure |
| Poison or delayed damage | Gains value over several timing points | Mitigation, impairment, preparation, or another credible way to buy time |
| Committed magic | Converts preparation or a resource into a decisive effect | Protection during setup, a fast alternative, or a safe opening |
| Revelation-focused | Uses dangerous power to change an unfavorable situation | Enough control over the cost that using the system is a decision |

These need not become four mandatory classes. They are tests of the rules.

**Safeguard:** evaluate the first exposed turn, not only total damage over a hypothetical five-round battle.

**Falsification test:** give the poison character a favorable situation, a neutral situation, and an unfavorable but mandatory situation. If all successful solutions begin with the same melee disable, the poison identity is not doing meaningful work.

### 4.4 Solo viability and meaningful recruitment pull in opposite directions

You want companions to matter, and you want continued play after losing them. Both are reasonable.

But a third character can add an action, another health pool, another kit, and more ways to protect the other two. Losing one removes all of those at once.

I would **not** promise that every possible solo build defeats every mandatory encounter. That would force either extensive universal tools or narrow encounter requirements.

A more useful target is:

> **Each supported protagonist has a viable route through the game, but not every build or route is equally suitable.**

That allows knowledge to influence recruitment, equipment, preparation, and route choice.

For the first slice, balance around a credible two-character journey, test a more forgiving trio, and deliberately construct at least one viable solo route. Extend that evidence character by character.

**The crucial test is not whether an expert can win alone. It is whether an ordinary player wants to continue after an unexpected loss.**

If the rational response to Anzû’s death is always “restart,” then the intended death system has failed even though a theoretical solo victory exists.

The response should then be better escape access, reachable recruitment, less punishing attrition, or shorter distances to a meaningful recovery decision—not necessarily a secret damage bonus for reduced parties.

### 4.5 Revelation could accidentally discourage the game’s main activity

This is the most important change I would make to our current thinking.

We have treated all these as related:

- Learning the truth.
- Reading forbidden information.
- Absorbing celestial knowledge.
- Using divine authority.
- Being overwritten by Heaven.

They are thematically related, but they should not always be the same mechanical action.

Otherwise, the player who cares about the story receives more penalties than the player who ignores it.

**Separate understanding from dangerous participation.**

Reading an account might explain a ritual. Performing the ritual might increase Revelation. Learning an enemy’s true name might be safe; speaking it as a weapon might not be.

Some texts can still be dangerous to read. Their danger should be a particular property of those texts, not a tax on all curiosity.

For Rapture and Rupture, begin with a minimal, readable rule. Do not initially combine random outcomes, hidden exposure categories, permanent mutations, lost control, and branching transformations.

The system earns expansion only when it changes decisions.

**Failure signs:** players always avoid Revelation, always rush the threshold, or deliberately keep a harmless enemy alive to farm its benefits.

**Safeguard:** test all three behaviors explicitly. Fix the incentives before writing twenty transformations.

### 4.6 Long attempts magnify small failure risks

Earlier we considered two-hour, eight-hour, and much longer first-completion experiences. None of those durations has been validated.

A simple illustration shows the problem. Suppose forty encounters each carry an independent 1% chance of ending the attempt. The chance of surviving all forty is about 67%. At 2% per encounter, it is about 45%.

That is not a prediction for TEHOM. Real encounters are not independent, and losing a companion is not the same as losing the attempt. It shows why a seemingly small irreducible risk can become severe across a long journey.

I would therefore measure **time back to unfamiliar content** before choosing total run length.

After a death, how much of the next session contains:

- New decisions?
- Faster execution of understood decisions?
- Merely repeated travel and dialogue?

The third category is the dangerous one.

The *Rebirth* postmortem is useful here because it explicitly discusses the shift from fear into frustrating trial and error. It also warns against the opposite mistake: failure consequences can become so unclear that players interpret them as benefits. [frictionalgames.com](https://frictionalgames.com/2021-03-amnesia-rebirth-five-months-later-and-soma-sells-1m-copies/)

**Safeguard:** make familiar regions reliably traversable, keep compulsory repetition short, and make losses legible.

**Fallback:** if long ironman attempts consistently cause abandonment, shorten attempts or make more of the world persistent before weakening every enemy. Companion death can remain consequential without repeatedly erasing hours of already-understood travel.

### 4.7 Shortcuts must change the world without invalidating its rules

Your shortcut idea is one of the best additions in the conversation.

Opening a passage can make it useful to enemies as well as to the player. But that needs a bounded, understandable implementation.

A good version:

> The gate connects two previously separate patrol routes. The player hears machinery beyond it, later finds tracks, and encounters a known enemy in a new location.

A poor version:

> The player opens a shortcut. Several familiar rooms silently acquire stronger enemies.

The first teaches the player how the world works. The second can teach them that progress is punished.

I would preserve three guarantees: recognizable landmarks, visible or audible evidence of consequential changes, and an understandable alternative route when a previously safe route becomes dangerous.

Persistent changes need additional care. A temporary bad decision can become a story. A permanently damaged profile with no viable route forward can become a reason to delete the save.

### 4.8 The map and almanac can become work rather than play

I still like both ideas. I no longer think making them maximally manual is the best starting point.

The valuable distinction is:

**Record observations automatically; let the player interpret them.**

For example, the game can retain the name of a visited hall, a quoted inscription, and the fact that an attack failed. The player can mark a suspected passage, connect two clues, or record an estimated component strength.

That preserves ownership without requiring transcription.

For the almanac, an estimate must remain visibly an estimate. It must not silently become authoritative UI. It should also retain context: enemy variant, attack type, armor state, and relevant conditions.

**Falsification test:** after a break, can the player resume their investigation from their records? If the notes do not help, or players spend more time maintaining them than using them, simplify.

And test the absence of a player-position marker rather than treating it as essential. Being lost in an interesting place and being unable to identify which identical corridor contains you are different experiences.

---

## 5. Story: preserve the mystery, establish the drama

The premise is strong. It is not yet a story.

“Heaven replaced an older creation” establishes a conflict. It does not yet establish what the player wants in the next ten minutes, what a particular NPC wants, or what a difficult choice costs.

### Write the local story before the complete cosmology

For the first area, I would require:

**An immediate objective.** Reach a sealed chamber, rescue someone, or restore a passage.

**A conflicting person.** Someone wants the same mechanism preserved, destroyed, or used differently.

**A discoverable contradiction.** What the institution claims does not fit the physical evidence.

**A consequential choice.** The player changes access, a relationship, a companion’s fate, or the state of a sanctuary.

**A local conclusion.** Something is resolved even though the broader mystery remains.

This matches the useful part of Jenkins’s narrative-architecture argument: space and evidence can carry the story, but important information needs more than one opportunity to reach the player. [Massachusetts Institute of Technology](https://web.mit.edu/~21fms/People/henry3/games%26narrative.html)

### Keep three records in the writing documents

Separate **what actually happened**, **what Heaven claims happened**, and **what each character believes happened**.

Without that separation, deliberate ambiguity can turn into accidental inconsistency.

The game can withhold answers from the player. The writer still needs enough causal understanding to make discoveries fit together.

Also, do not let the premise collapse into “all ancient beings good, all angels evil.” A prisoner can oppose Heaven and still want something terrible. A divine servant can care for someone while maintaining a destructive institution. Those conflicts offer more playable decisions than merely revealing that every official statement is false.

### Permanent death requires narrative fallback design

Anzû’s death should remove Anzû’s particular perspective and possibilities. It should not accidentally remove the only clue needed to understand the ending.

A witness, object, or alternate encounter can preserve essential access without reproducing the lost character’s personal story.

This is where scope can expand quickly. Six characters produce **41 nonempty party combinations of one to three characters**, even before tracking deaths, quest states, and recruitment order.

Do not write forty-one separate narratives. Write a small number of meaningful conditional responses around a shared progression structure.

For temporary NPC companions, start with a tightly scoped role: a guide, one ritual, one encounter, or one assistance action. A fourth fully customizable combatant would reopen the party-size problem.

### Do not make ten completions the admission price for the real story

Multiple perspectives can be excellent. Mandatory repeated victories are a separate proposition.

The first ending should resolve a meaningful conflict. Further attempts can expose contradictions, character-specific outcomes, or a deeper conclusion.

If those attempts mostly repeat traversal and mandatory scenes, the problem is not solved by placing the “true” ending behind them.

Likewise, future Wings and downloadable content remain plausible, but they should not drive the first build. Stable room identifiers and explicit campaign objectives are enough preparation. Do not build an expansion framework before one area works.

---

## 6. Art and music are part of the test, not finishing touches

### Art: choose a visual system, not a pile of attractive packs

The verified repository manifest contains seven symbolic prototype emblems. It explicitly does not claim final character art or audio. The packs previously discussed may be available elsewhere, but I could not verify their import through this repository. 

Use those emblems for rules testing. Then make one representative scene with the actual candidate assets.

I would evaluate:

| Question | What it determines |
|---|---|
| How large is a character on screen? | Whether its silhouette and bodily identity are readable |
| How many rooms fit on screen? | Whether exploration feels intimate, exposed, or map-like |
| Are materials and perspective consistent? | Whether stock assets form one world |
| Can a combat target be selected clearly? | Whether detailed art supports the mechanic |
| What does one finished room cost to produce? | Whether the intended campaign is affordable in effort |

A 32×32 exploration grid is a reasonable **candidate**, not a settled answer. Large combat illustrations can coexist with smaller exploration sprites when the transition is deliberate.

For the first art investment, I would prioritize **one recognizable Brood, one celestial enemy or mechanism, and one signature location**.

That is a correction to our earlier emphasis on only customizing bosses. The playable creatures are central to TEHOM’s identity and appear repeatedly. Generic human substitutes risk changing the emotional meaning of the game.

Limb targeting does not initially require a fully animated dismemberment system. Separate component masks, a few damaged states, and clear target anchors are sufficient to test it. Avoid committing to every possible limb combination as a separate illustration.

Retain the existing provenance discipline: source, creator, license, modifications, native dimensions, credits, and whether source files may be distributed through the repository. Buying a pack and integrating it are separate production tasks.

### Music: do not equate darkness with uninterrupted ominous ambience

Music should help shape the movement between curiosity, tension, competence, loss, and temporary safety.

Ben Prunty’s writing provides two useful counterpoints. He describes how the presence or absence of music changes the player’s interpretation of a scene. He also explains that *Into the Breach* moved away from his initial assumption that turn-based strategy music should be quiet and unobtrusive. Neither constant music nor subdued music is automatically correct. [PC Gamer](https://www.pcgamer.com/sometimes-games-are-better-without-music/)

For TEHOM, I would test this small palette:

| Layer | Proposed function |
|---|---|
| Environmental sound | Establish place: machinery, pressure, distant creatures, water, breath |
| Exploration music | Suggest curiosity or unease without explaining every threat |
| Combat treatment | Support commitment and consequence without rushing the player’s decision |
| Revelation cue | Make an important change perceptible and distinct |
| Sanctuary motif | Establish a recognizable change in emotional state |
| Death aftermath | Give loss space rather than immediately resetting into the usual loop |

The celestial and primordial sides can have contrasting sonic identities, but those should be original fictional choices—not claims of historical authenticity.

A repeated mechanical rhythm could identify a room before it is visible. Opening the shortcut could change where that rhythm is heard. The sanctuary theme could gain a missing voice after a quest is resolved.

Those are small ways for sound to participate in knowledge progression.

**Falsification test:** play the same sequence repeatedly with different audio treatments. Does the music sustain interest, reveal too much, become tiring, or make every encounter feel equally important?

Critical information must also have a visual equivalent. Sound can enrich orientation without becoming the sole way to detect danger.

---

## 7. The technical direction I recommend

**Keep Phaser for the next experiment unless a demonstrated production problem justifies changing it.**

The repository already has the surrounding workflow. Phaser’s documented scene, tilemap, input, animation, and audio capabilities cover the immediate prototype requirements. This is not a commitment to shipping the entire game in it. [Phaser](https://phaser.io/why-phaser)

Godot remains credible, especially if its editor makes your room-building and scene-authoring work substantially easier. The current stable documentation still states that Godot 4 C# projects cannot export to the web, which matters if effortless browser testing remains a requirement. [Godot Engine documentation](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html)

The engine decision should eventually compare concrete operations: create a room, place interactions, revise dialogue, change an encounter, trigger audio, inspect state, and produce a tester build.

Do not compare engines through an imagined finished game.

### Keep three technical boundaries clear

**Simulation:** what actually happens.

**Presentation:** how events look and sound.

**Knowledge display:** what the player is allowed to know, and what they have recorded.

Hidden enemy information belongs in the third boundary. It must not make the simulation opaque to tests or cause the interface to calculate different outcomes.

Also separate the attempt save from persistent profile changes. Browser storage is not inherently permanent: browsers apply quotas and eviction policies, and persistence requests do not remove every possible loss mechanism. Export, recovery, and correct write behavior matter particularly in an ironman game. [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)

The most damaging “death” in this design would be a corrupted save.

---

# 8. The next ten implementation steps

These are sequential decision gates, not authorization to build ten features without feedback. **The first human test happens in step 3.**

The deliverable is a short, complete journey—not three Wings, six finished campaigns, or a production-ready content platform.

## Step 1 — Record the pivot and define the first experiment

**Implement:** a new direction record, an updated current-state page, and a POC 002 brief. Preserve the historical POC 001 evidence while removing contradictions from the current entry points.

Use the existing `docs/adr/`, `docs/prototypes/`, and `docs/CURRENT.md` structure.

Write the local story described above. Define the first slice as approximately 8–12 rooms, three test characters, three ordinary enemy types, one elite encounter, a recruit, a quest, sanctuaries, and a consequential shortcut. These are scope limits, not final campaign specifications.

**Acceptance:** another reader can distinguish selected decisions, experimental hypotheses, implemented features, and deferred ideas.

**Stop condition:** the brief requires multiple Wings, six complete solo routes, or repeated full campaigns to demonstrate the core experience. Reduce it before coding.

## Step 2 — Build an independent team-turn combat core

**Implement:** `poc-002-dungeon-combat/` with pure TypeScript state, commands, resolution, and lifecycle modules.

Support one to three actors through dynamic IDs. During the player phase, choose an unused actor, resolve its action immediately, then choose another. This is team-based combat, not simultaneous commitment.

Specify component destruction, enemy ordering, guarding, poison timing, terminal outcomes, and escape. Start with deterministic damage.

Begin with Attack, a character skill, and Guard. Do not display nonfunctional menu categories as completed systems.

**Acceptance:** tests prove that dead actors do not act, broken components lose the correct function, invalid commands consume nothing, duplicate execution is prevented, and one surviving companion does not cause automatic defeat.

**Stop condition:** implementing variable parties still requires geometry or the old fixed-roster assumptions. Remove those dependencies rather than adding exceptions.

## Step 3 — Deliver a playable battle laboratory

**Implement:** readable target areas, action feedback, keyboard controls, scenario selection, fast resolution, reset, and battle-record export.

Add physical, delayed-poison, and magical test kits. Add the guard, scribe, and a threat that is not solved by cutting an arm. Provide several combinations rather than only one isolated encounter per enemy.

Add one consumable and a clearly specified retreat action. Keep numerical information visible in this diagnostic build.

Use labelled shapes or current emblems. The player must understand the consequences before we evaluate an obscure presentation.

**Acceptance:** a person who did not implement the system can finish a battle without continuous explanation.

**Stop condition:** players cannot explain why a target was invalid or why an enemy still acted. Fix feedback or rules before increasing lethality.

## Step 4 — Add the smallest useful Revelation system

**Implement:** one threshold, a minimal Rapture/Rupture pair, explicit duration, explicit trigger ordering, and one meaningful interaction with a skill.

Initially use a deterministic rule. Separate learning information from choosing to invoke dangerous authority.

Run the same encounters with Revelation enabled and disabled.

**Acceptance:** there are observable situations where accepting Revelation is useful and others where avoiding it is useful. A transformation changes decisions rather than adding a second damage meter.

Test repeated threshold crossings, defeat during transformation, expiration, and attempts to farm a disabled enemy.

**Stop condition:** the system adds management without changing choices. Revise or temporarily remove it; do not compensate by adding more transformations.

## Step 5 — Test the build and casualty problems directly

**Implement:** a scenario matrix covering three solos, three duos, and a trio, with healthy, injured, and highly Revealed starting conditions.

Record actions, incoming damage, resource expenditure, component choices, deaths, and reasons for retreat. Test numerical changes around important breakpoints.

Search for simple policies: always disable the weapon, always attack the core, always poison then guard, or always trigger Rapture.

Use automated searches to find counterexamples. Use people to determine whether the remaining choices are understandable and satisfying.

**Acceptance:** intended archetypes have credible solutions to representative mandatory threats. A tested companion loss leaves a continuation that someone actually chooses.

**Stop condition:** every successful build needs the same opening, or every casualty makes restarting preferable. Change the pressure, kits, or recovery possibilities before adding enemies.

## Step 6 — Prove one art and audio treatment

**Implement:** one complete room and one battle screen using the actual available asset files.

Establish the native pixel scale, display scale, character proportions, materials, target presentation, and interface legibility. Integrate one distinctive Brood silhouette and one divine mechanism.

Add essential effects, room ambience, a combat treatment, a sanctuary motif, and a Revelation cue. Record actual production effort.

Extend the asset manifest and credits. Confirm which files belong in the repository.

**Acceptance:** the scene looks coherent, targets remain readable, and repeated play does not produce duplicated audio loops or presentation fatigue.

**Stop condition:** the scene only looks good as a large screenshot, or each ordinary enemy requires unaffordable illustration variants. Simplify presentation before expanding content.

## Step 7 — Build the interconnected exploration area

**Implement:** the small room network with stable identifiers, two route loops, visible encounters, a sanctuary, a conditionally safe location, and a shortcut.

Make one shortcut change an enemy’s reachable route. Give that change evidence.

Include a knowledge-based passage usable on a fresh profile. This is essential for testing whether understanding—not only persistent unlocks—shortens the journey.

Add automatic observations and editable map annotations. Keep the position marker configurable for testing.

**Acceptance:** returning players choose better routes because they understand the place. Required access remains possible across allowed world states.

**Stop condition:** returning players repeat the same tasks at the same pace, or get lost because the rooms are visually indistinguishable. Fix the geography and prerequisites before adding permanent upgrades.

## Step 8 — Implement trustworthy saving and persistence

**Implement:** distinct attempt and profile schemas, versioning, recovery, and export/import.

Save committed logical state, including during combat, without depending on an animation finishing. Record deaths and persistent changes exactly once.

Use transactions or equivalent journaled writes for changes spanning the attempt and profile. Handle multiple tabs, interrupted writes, unsupported versions, and failed storage operations.

Keep battle replay records separate from campaign saves.

**Acceptance:** interruption after a death, sanctuary change, scene transition, or reward grant resumes the correct state without duplicated rewards or erased consequences.

**Stop condition:** the game can report success while the state was not saved, or it silently resets incompatible data. Do not expose the ironman experience to longer testing until this is resolved.

## Step 9 — Author one complete quest and its consequences

**Implement:** one quest with at least two inferable resolutions, one recruitment, a response to a companion’s death, and a local ending.

Introduce Talk through meaningful encounter-specific behavior. Use explicit flags and converging branches rather than a general-purpose narrative engine.

Place essential clues in more than one location or medium. A dead or absent character can remove a personal outcome without removing necessary progression.

A temporary non-Brood companion can provide one scoped assistance function. Do not add a fourth fully configurable party slot in this slice.

**Acceptance:** players can describe their immediate objective, an NPC’s motive, and why their choice produced its outcome.

**Stop condition:** progression depends on an invisible visit order, or a missing companion silently breaks the quest. Make the condition discoverable or provide an alternate resolution.

## Step 10 — Run the integrated falsification test

**Implement:** a repeatable human-test protocol and an evidence report.

A small pilot—for example six to eight people—can expose usability and design failures. It is not a representative market sample.

Observe a blind visit, a return visit, and experienced traversal on a fresh profile. Compare that with traversal on a profile containing persistent changes. This separates learning from mechanical metaprogression.

Measure time to the first meaningful decision, time back to unfamiliar content, repeated travel, causal understanding, continuation after loss, use of notes, narrative comprehension, and audiovisual fatigue.

Test information-display alternatives on unfamiliar content: a player cannot unlearn an enemy statistic.

**Acceptance:** make separate decisions about Revelation, attrition, hidden information, annotations, and permanent changes. Publish negative findings as clearly as successful tests.

**Stop condition:** the slice requires substantial new content to conceal a weak core loop. Stop expansion and revise the loop.

Choose the production engine and campaign scope from this evidence and the measured authoring workflow—not from the number of systems already implemented.

---

## 9. What would make me change this plan?

A critique is incomplete if its recommendations cannot also fail.

| My current recommendation | Evidence that would make me revise it |
|---|---|
| Make combat mechanically readable | Limited enemy information produces stronger engagement without reducing causal understanding |
| Keep some encounters solved and fast | Players consistently find those encounters tedious even when traversal is brief |
| Continue after permanent companion loss | Players understand their options but still find continuation unappealing or effectively unwinnable |
| Separate knowledge from Revelation costs | Carefully signaled dangerous discoveries create better decisions without suppressing investigation |
| Use selective persistent world changes | Players intentionally farm failures, or the altered world removes meaningful route decisions |
| Keep manual annotations optional and useful | Players actively enjoy detailed cartography and use it to solve problems rather than merely record facts |
| Stay in Phaser for the experiment | Representative content work exposes substantial tooling or platform friction that another engine demonstrably resolves |
| Build only a small slice | The slice omits the very relationship between discovery, consequence, and return that it is supposed to test |

The point is not to protect the proposed plan. It is to make the cost of learning that it is wrong small.

There is a corresponding safeguard against excessive iteration: **do not redesign the system because one person prefers a different genre.** Look for repeated misunderstandings, structurally dominant solutions, failed continuation, and production bottlenecks. Those are more actionable than general approval or dislike.

---

## Final assessment

The direction has improved in one important respect: **TEHOM now has a clearer relationship between what its world means and what the player does.**

Its strongest elements are the forgotten cast, the occupied primordial world, knowledge that changes routes and choices, bodily consequences, and a dungeon whose institutions can be understood and disrupted.

Its weakest current elements are the promises we have not yet earned: every character solo-viable, long ironman attempts, highly obscure quests, manual combat statistics, persistent world mutation, and multiple required completions—all operating together.

I would keep the ambition, but change the immediate question.

Not:

> Can we build all the systems that belong in this imagined RPG?

Instead:

> **Can one small part of the Panopticon make the player curious on the first visit, competent on the second, and willing to continue after something goes wrong?**

The next build should answer that with one memorable place, a few genuinely different combat approaches, one consequential relationship, and enough art and sound to express the intended atmosphere.

If that works, expanding TEHOM becomes a production problem. Until it works, adding more features mostly expands the uncertainty.
