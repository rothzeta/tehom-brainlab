<!--
Source material for task COUNCIL-poc002. The user pasted this into the Coordinator session on 2026-10-19.
It is the second of two documents from the user's external design conversation (ChatGPT). It is reproduced verbatim below.
It follows source-1-critical-review.md and narrows it. Where it attributes a choice to the user ("you have chosen", "I agree with your correction"),
treat that as the user's decision. Everything else is the external assistant's recommendation.
-->

You’re right. I gave you criteria for making decisions when you had asked me to make recommendations. I also expanded POC 002 into an exploration prototype before we had designed its combat content.

**My recommendation is: native 32×32 exploration tiles, separate large combat illustrations, POC 002 in Phaser/TypeScript, then an engine-independent C#/.NET implementation with Godot handling presentation. POC 002 should contain combat—not a miniature dungeon RPG.**

## 1. Set the art specification now

I would adopt the following specification for TEHOM.

| Element | Recommended specification |
|---|---|
| **Environment grid** | **Native 32×32 pixels per tile.** |
| **Exploration viewport** | **640×360 logical pixels**, scaled by whole-number factors. |
| **Exploration character frames** | **64×96-pixel canvases.** A roughly human-sized body occupies approximately 32×64 pixels; wings, tails, and wider bodies use the remaining space. |
| **Large environmental objects** | Multi-tile artwork. Do not restrict statues, machinery, doors, or organs to one tile. |
| **Ordinary combat enemies** | Separate illustrations on **256×384-pixel canvases**. |
| **First boss** | A separate **512×512-pixel illustration**, with individually identifiable components. |
| **Character portraits** | **128×128 pixels**, separate from exploration sprites. |
| **Combat interface** | Designed at **1280×720**, with readable text and large target areas. |
| **Style** | Detailed, textured exploration pixel art; larger, rough-painted combat illustrations. No oversized heads or deliberately cute proportions. |

The exploration and combat screens do **not** need the same drawing scale. I recommend making that separation intentional: small figures moving through an immense structure, followed by close, detailed confrontation with the things inside it.

### Why 32, rather than 16, 48, or 64?

**Not 16:** I would not choose its degree of visual simplification as TEHOM’s foundation. The project needs recognizable anatomy and material differences. That is an artistic recommendation for this game, not a claim that 16×16 artwork cannot look good.

**Not 48:** it gives us an intermediate drawing scale, but I do not see a sufficient benefit for this project to choose it over 32. I would spend the extra detail on multi-tile objects and larger characters instead.

**Not 64:** it makes every ground tile four times the pixel area of a 32×32 tile. I would reserve that detail for things the player investigates, rather than making every floor and wall piece that large.

**Choose 32:** it gives us a manageable construction grid without requiring the important objects to be small. A 256×384-pixel celestial doorway occupies eight by twelve tiles. The doorway can be intricate even though the underlying grid is 32×32.

At 640×360, a 32-pixel grid shows about twenty tiles across. That is my intended exploration framing: close enough to inspect the environment, rather than viewing an entire district at once. The viewport scales exactly to 720p, 1080p, 1440p, and 4K. Godot’s documentation specifically identifies 640×360 and integer scaling as a useful pixel-art baseline. [Godot Engine documentation](https://docs.godotengine.org/en/stable/tutorials/rendering/multiple_resolutions.html)

**New environment purchases should therefore be native 32×32 packs.** Existing assets can remain placeholders. A pack advertised as 32×32 because it doubles a 16×16 original does not meet the intended detail target.

For POC 002, however, **combat art matters first**. We do not need to purchase a complete environment collection before testing a battle.

## 2. Your Phaser → .NET → Godot sequence makes sense

I would follow the sequence you have chosen rather than reopen the engine debate:

**POC 002 in Phaser and TypeScript → tester feedback → C#/.NET rules implementation → Godot presentation.**

Your RimWorld example is relevant. Ludeon’s October 12 announcement describes the move from Unity to Waylith in the 1.7 beta, compatibility between 1.6 and 1.7 saves, and continued operation of the vast majority of mods. The announcement establishes those compatibility results, although it does not document the full architecture that produced them. [Ludeon Studios](https://ludeon.com/blog/2026/10/announcing-the-waylith-engine-and-update-1-7/?utm_source=chatgpt.com)

For TEHOM, I would turn the separation you describe into these concrete rules:

| TEHOM owns | Phaser now / Godot later owns |
|---|---|
| Characters, body parts, abilities, damage, statuses, Revelation | Sprites, illustrations, target highlighting, animation |
| Turn order and enemy decisions | Input collection and interface layout |
| Encounter state and victory conditions | Camera, particles, lighting, audio playback |
| Content identifiers and save schemas | Asset loading and platform-specific file access |
| The meaning of a command | The visual and audible response to that command |

**No Phaser object enters the TypeScript combat state. No Godot node or resource becomes part of the future authoritative game state.**

An animation finishing must not decide whether poison ticks, an arm breaks, or somebody dies. The rules decide; the presentation shows the resulting events.

### What should survive the TypeScript rewrite

The portable deliverables should be:

- JSON content definitions with stable character, ability, enemy, and component IDs.
- Recorded initial states and command sequences.
- Expected resulting states and ordered events.
- The art and audio assets, with presentation metadata kept separate from combat rules.

The C# implementation must reproduce those recorded outcomes before the Godot version replaces the browser prototype.

That is the migration acceptance test: **the same battle, with the same commands and rules, produces the same outcome in both implementations.**

We should prepare that boundary now. We should not build a public mod framework now, or promise indefinite compatibility for experimental POC saves.

## 3. The world should feel extensive—not be limited to twelve rooms

I agree with your correction. A small test area was supposed to be a later production exercise, not the intended scale of the game.

The world target is **large-feeling, interconnected regions within the Panopticon**. That remains compatible with relatively confined rooms.

The useful distinction is between:

**World connections:** how Wings, districts, elevations, lifts, gates, and shortcuts connect.

**Local spaces:** whether an individual place is a cramped prison, an open machine hall, a garden, or a sequence of chambers.

Those are different decisions. We can pursue the interconnectedness you want without making every local area open and spacious. A huge chamber can contain a compact network of traversable structures; a dense dungeon can connect into a much larger vertical world.

**We will decide that through exploration prototypes after combat works. POC 002 will not establish the final map size or room structure.**

## 4. POC 002 needs new combat content, not renamed formation abilities

Here is the content direction I would commit to for the second prototype.

### The three playable Brood

Use **Ugallu, Girtablilu, and Anzû**. They test three distinct approaches to the same encounter.

| Brood | Combat identity | Actions I would design |
|---|---|---|
| **Ugallu** | Survives exposure and physically dismantles threats | **Claw:** reliable direct damage. **Rend:** greater component damage, weaker value against the main body. **Hold the Threshold:** protect itself or intercept for an ally, then retaliate if struck. |
| **Girtablilu** | Impairs an enemy, then wins through venom | **Pincer:** reliable direct damage. **Envenom:** applies delayed bodily damage and immediately weakens the victim’s next physical attack. **Rupture Venom:** consumes the remaining poison to deliver its damage immediately. |
| **Anzû** | Uses stolen authority to bypass or temporarily suppress enemy functions | **Talon:** reliable direct damage. **Stolen Bolt:** magical damage that bypasses physical armor but adds Revelation. **Revoke:** suppresses one declared component-dependent action for the coming enemy phase, at a greater Revelation cost. |

These are proposed mechanics, not claims of established balance. But they make specific design commitments:

Ugallu purchases safety by destroying capabilities or bearing attacks. Girtablilu purchases time through impairment and then chooses between waiting and cashing in poison. Anzû purchases immediate control with Revelation.

**None should require the same universal “cut the arm first” opening.**

I would also give every character **Guard**, reducing incoming HP damage by 50% for the next enemy phase. It would not reduce Revelation. That is a starting rule to implement, not a number we must defend after testing.

The menus should be **Attack, Skills, Guard, Item, Talk, Escape**. “Skills” contains the two distinctive actions above initially. Six menu entries should not quietly become thirty abilities.

### The three ordinary enemy types

| Enemy | Targetable functions | Why it belongs in POC 002 |
|---|---|---|
| **Celestial Guard** | Weapon arm, restraining limb, main body | Tests whether physical disabling competes with killing, poison, and temporary suppression. Destroying its weapon does not remove its ability to restrain escape. |
| **Naming Scribe** | Tongue, inscription hand, main body | Tongue applies Revelation; the hand maintains protection on another enemy. Tests target priority and cooperation between enemies. |
| **Corrected Beast** | Armored shell, locomotion organ, living core | Breaking the shell exposes the core. Damaging locomotion reduces its physical pressure. Tests an enemy that does not present the Guard’s anatomical solution. |

For this prototype, use a clear component rule:

> **Component damage reduces that component’s integrity. Main-body damage reduces the enemy’s life. Component destruction removes its defined function.**

Do not automatically count every hit twice against both component integrity and main HP. That would make component attacks harder to balance against direct attacks. Poison affects the living body; it does not conveniently dissolve every weapon, seal, and armor plate.

### The first boss: the Warden of Correct Form

I would build a **celestial surgical mechanism containing living material**, not a large Guard with more health.

Its components:

| Component | Function |
|---|---|
| **Saw** | Performs its heavy physical attack. |
| **Clamp** | Holds a named target for a stronger subsequent saw attack. |
| **Choir** | Applies Revelation while the physical machinery operates. |
| **Core** | Sustains the boss and determines victory. |

Its initial pattern should be explicit: **Clamp → Saw → Choir**, then repeat. Destroyed components skip their associated action; they do not silently receive new attacks.

The decision is whether to remove the saw, prevent the clamp’s setup, silence Revelation, or attack the core while accepting consequences.

That tests all three characters without requiring a second-phase transformation, summons, a movement system, and six additional boss mechanics.

### Revelation belongs in that same content specification

Before implementation, specify **one Rapture and one Rupture for each of the three Brood**, including the exact trigger, duration, and affected actions.

Do not put “Revelation system” on the task list as though it were already a complete rule. Its threshold ordering must be explicit: whether a transformation occurs before an ability, after its effects, or at phase end changes the battle.

The next design document must contain the actual numbers, targets, durations, enemy schedules, and edge cases. The tables above establish what those definitions must accomplish. They are not a substitute for them.

## 5. What POC 002 should actually deliver

I would make the prototype a **combat selection screen plus a short encounter gauntlet**.

The selection screen offers isolated enemies, enemy pairs, the boss, and solo/duo/trio parties. The gauntlet carries HP, items, deaths, and Revelation between three fights. That tests attrition without requiring exploration code.

Limb selection must be present from the first playable version: selecting a component in the list highlights it on the illustration, and selecting it on the illustration highlights the list entry. Small tongues and seals need generous selectable regions, not pixel-perfect clicking.

The first presentation package should contain **three Brood portraits, three ordinary enemy images, one boss image, one battle background, and distinct sound cues for a hit, armor, component destruction, poison, Revelation, and death**. Existing art can supply the images; targeting masks can be authored separately.

Full character animation is not required to judge this system. Correct target selection and understandable consequences are.

### The implementation order

| Order | Deliverable |
|---|---|
| **1** | Finalize the three character kits, three enemies, boss, and six transformation definitions in one numerical combat specification. |
| **2** | Implement the engine-independent TypeScript rules, component targeting, timing, and tests. |
| **3** | Build the Phaser combat interface with real limb selection and the specified content. |
| **4** | Add the encounter gauntlet, audiovisual feedback, and reproducible battle records. |
| **5** | Run external tests and revise the actual kits and encounters. |
| **6** | Port the validated rules to C#/.NET and prove parity against the recorded battles. |
| **7** | Connect Godot to the C# core; then begin the interconnected-world prototype. |

**So the decisions are: 32×32 for exploration, large separate combat art, Phaser for POC 002, a game-owned simulation, and Godot after the C# port. The immediate design work is the combat content specification—not map scope, engine selection, or another broad design review.**
