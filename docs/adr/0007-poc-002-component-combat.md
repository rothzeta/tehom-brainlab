# ADR-0007 — POC 002 component combat and the TEHOM engine path

Status: accepted by user decision, 2026-10-19. The user said "go" to the Coordinator's recommendations after the POC 002 council. Four decisions are **provisional, open to change after the first human test**; they are marked below. Tuning numbers are not decided here: they are provisional test parameters owned by the [brief's numerical specification](../prototypes/poc-002-component-combat.md#numerical-specification-v1).

## Context

The user's external design conversation produced two documents: a critical review and a narrower follow-up that records the user's choices ([source 1](../mailbox/poc-002-council/source-1-critical-review.md), [source 2](../mailbox/poc-002-council/source-2-decisions.md)). A three-member council of Architects (Opus, Sol-a, Sol-b) then assessed them against the repository independently ([assignment](../mailbox/poc-002-council/assignment-council.md); reports [opus](../mailbox/poc-002-council/architect-opus.md), [sol-a](../mailbox/poc-002-council/architect-sol-a.md), [sol-b](../mailbox/poc-002-council/architect-sol-b.md)). The Coordinator recommended a consolidated set of decisions, and the user accepted them. This record states the result. [ADR-0004](0004-repository-and-poc-direction.md) still governs POC 001 and the repository layout.

## Decision

### TEHOM direction (user, source 2)

| Decision | Content |
| --- | --- |
| POC 002 is combat only | A combat selection screen plus a three-fight gauntlet. No exploration, saving, quests or recruitment. World scale is deferred to later exploration prototypes. |
| Engine path | POC 002 in **Phaser + TypeScript** now. After tester feedback, the rules move to a **C#/.NET** implementation and presentation moves to **Godot**. |
| Migration gate | **Parity against recorded battles.** For every recorded battle, the C# implementation reproduces the same accepted commands, the same ordered events and the same final state. The Godot version does not replace the browser prototype until this holds. |
| Simulation boundary | The game owns the simulation. No Phaser object, and later no Godot node or resource, enters combat state. An animation never decides a rule: the rules emit events and the presentation shows them. |
| Art specification | Exploration uses native **32×32 tiles** and a **640×360** logical viewport scaled by whole numbers. Combat uses **separate large illustrations**, not scaled-up exploration sprites. |

The rest of source 2's art table is recorded as the recommended specification, not as a user decision: 64×96 exploration character frames, multi-tile large objects, 256×384 ordinary-enemy illustrations, a 512×512 first-boss illustration, 128×128 portraits, and rough-painted combat style. POC 002 adopts one row, a combat interface designed at **1280×720** (an exact 2× of 640×360), because its UI must be built at some size. No art is purchased for POC 002.

### POC 002 decisions (council unanimous; accepted by the user's "go")

1. The folder is `poc-002-component-combat/`, and the root just recipes are named `poc-002-*`.
2. **Anzû** (content ID `anzu`) is a new POC 002 Brood. POC 001 and its Pazuzu stay unchanged. Whether Anzû replaces Pazuzu in TEHOM's canon is not decided.
3. Before each player phase, enemies **declare** the exact action, source component, target and damage. A declared target never changes. Destroying a component cancels the actions it declared.
4. Talk and Escape are deferred and not shown. The combat menu is **Attack, Skills, Guard, Item**.
5. POC 001 patterns are copied, with a provenance comment. Nothing goes into `shared/`, and POC 002 has no runtime import from POC 001.
6. Battle records exist from the first rules checkpoint. They are integer-only and use a closed effect-kind enum, with no mod framework. Each record embeds the content, the full initial state, the accepted commands with each command's expected events, and the expected final state.
7. Component damage never overflows into life. The diagnostic build shows every number. Enemy stats never scale with party size.

### Provisional decisions (adopted by the user's "go"; open to change after the first human test)

| # | Decision | Specification |
| --- | --- | --- |
| P1 | **Revelation crossing-source rule** (Opus) | The kind of transformation depends on what caused the crossing. If the Brood's own action cost crosses its threshold, it gets **Rapture**; if an enemy effect crosses it, it gets **Rupture**. While transformed, further Revelation gains are lost as HP. On expiry, Revelation becomes ⌊cap/2⌋. |
| P2 | **Warden core pulse** (Sol-a) | A non-removable core action deals a small magical hit every round, so that dismantling never makes the Warden harmless. It is integrated with source 2's Clamp → Saw → Choir schedule. |
| P3 | **One healing consumable** | The Salve, under Item, has two uses per gauntlet. |
| P4 | **Solo target** | At least one solo Ugallu route against the Warden from full health is demonstrated. No other Brood or encounter has a solo promise. Duo and trio are the gauntlet balance targets: the duo should be tense, the trio forgiving. |

### Delivery decisions (Architect, task P2-DESIGN; settled for POC 002 unless the user overrides them)

- **Audio:** the six required cues (hit, armor, component destroyed, poison, Revelation, death) are synthesized with the Web Audio API at runtime. No audio files are imported, so POC 002 adds no audio licensing or provenance entries. A mute control is required. The presentation derives each cue from rule events, and cues never affect rules.
- **Placeholder art:** POC 002 uses code-drawn labelled shapes plus the existing registered Ugallu and Girtablilu emblems ([manifest](../../assets/manifest.json), [credits](../../assets/CREDITS.md)). Anzû has no emblem and is drawn as a labelled shape. No asset is added to `assets/`.

## Rationale

Combat is the unresolved question, and an exploration slice would delay it. Owning the simulation, keeping records portable and integer-only, and making parity the migration gate turn the engine change into a verifiable port rather than a rewrite. POC 001 records require its fixed roster and formation. Copying the useful patterns keeps both prototypes independent, which the "shared code only when reuse is demonstrated" rule requires (root `README.md`, working rules). The provisional rules each answer a defect found by the council. Rapture needs a price, or the Revelation cost is decorative. A dismantled boss must stay dangerous. Attrition needs one recovery lever. A solo route is a diagnostic, not a balance target.

## Consequences

- The brief owns the question, hypotheses and the complete numerical specification. The [plan](../plans/2026-10-19-db0bad72-poc-002-component-combat.md) owns delivery checkpoints. Neither establishes balance or playtest results.
- Records and content are versioned from the first checkpoint. Changing tuning creates a new content version; it does not rewrite historical records.
- The C# port and Godot work (source 2 steps 6–7) and external testing (step 5) are outside the POC 002 plan, and need later bounded work.
- POC 001 is not modified. Its TypeScript/Phaser target in ADR-0004 remains an experiment target, and [ADR-0004](0004-repository-and-poc-direction.md#amendments) carries a cross-reference to this record.
- After the first human test, the provisional decisions P1–P4 are re-decided explicitly, with the evidence recorded in `docs/playtests/`.
