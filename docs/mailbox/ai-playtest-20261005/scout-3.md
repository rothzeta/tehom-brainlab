task: AIP-3
status: complete
outcome: Three UI-driven attempts completed and replayed; formation changed survival and damage, but Expand-and-hold repeated across both wound presets.
artifacts:
  - docs/mailbox/ai-playtest-20261005/scout-3.md
  - docs/mailbox/ai-playtest-20261005/assignment-scout-3.md
  - docs/mailbox/ai-playtest-20261005/scout-3-attempt-1.json
  - docs/mailbox/ai-playtest-20261005/scout-3-attempt-2.json
  - docs/mailbox/ai-playtest-20261005/scout-3-attempt-3.json
  - docs/mailbox/ai-playtest-20261005/scout-3-compact-start.png
  - docs/mailbox/ai-playtest-20261005/scout-3-compact-victory.png
  - docs/mailbox/ai-playtest-20261005/scout-3-spread-preview.png
  - docs/mailbox/ai-playtest-20261005/scout-3-censer-finish-preview.png
  - docs/mailbox/ai-playtest-20261005/scout-3-spread-victory.png
  - docs/mailbox/ai-playtest-20261005/scout-3-contract-risk.png
  - docs/mailbox/ai-playtest-20261005/scout-3-wounded-ugallu-victory.png
verification:
  - "Native browser UI: three terminal attempts exported; no Runtime.exceptionThrown events observed."
  - "Attempt 1 replay: exit 0, ok true, 16 commands, 72 events, round 5 victory."
  - "Attempt 2 replay: exit 0, ok true, 12 commands, 50 events, round 3 victory."
  - "Attempt 3 replay: exit 0, ok true, 12 commands, 50 events, round 3 victory."
  - "Handoff validator with --repo: exit 0, ok true."
review: not-run
tested_revision: 552f2b11b1f52a9826de618b30a5e043c2a6bf21
discoveries:
  - Spread enabled the exact Harrier kill in round 1 and removed splash exposure from the other two Brood.
  - Both wounded starts supported Expand once, then hold Spread and focus Harrier, Censer, Warder.
  - Restart displayed stale HP in an actor button until selection refreshed it.
blockers: []

# AI playtester 3 — formation lens — 2026-10-05

Author: Scout 3, AI agent driving headless Chrome. This is independent AI decision evidence through the real UI, not human playtest or enjoyment evidence. Assignment: [AIP-3](assignment-scout-3.md).

## Conditions and method

Played the real `http://localhost:5183/?play=patrol` route with normal emblem art, 1440×1100 viewport, the installed Chromium headless shell 1223 (the newest available path). The private server used `POC001_PORT=5183 just poc-001-dev`; Docker access and the Chrome/CDP driver required approved sandbox escalation. Temporary driver and profile stayed under `/tmp`; input used native CDP mouse/key events to select presets, restart, hover previews, select abilities/targets, confirm, end phases, open the log, and export downloads. Screenshots were captured and visually inspected. No core functions, fixture injection, historical command traces, or exported internals were used to choose commands. Exports were inspected after play for evidence indexing and replay checks.

Read the [design brief and Decision record](../../prototypes/poc-001-linked-formation.md), [P10/P11 README](../../../poc-001-linked-formation/README.md#playable-patrol-p10), [playtest template](../../playtests/TEMPLATE.md), and [automated P11 evidence](../../playtests/2026-10-05-poc-001-p11-automated.md). Read the existing browser scripts for CDP/control/download mechanics only; did not execute their scripted combat. Familiarity was therefore informed by the brief and documented tuning, not a blind first encounter.

All exports embed build `552f2b11b1f52a9826de618b30a5e043c2a6bf21`, record version 1 and rules version `poc-001-rules-v1/patrol-v1/p07-v1`. No configuration overrides. The authoritative conditions are each record's `configuration` and `initialState`: Claw/Sting 4, Impale 6, Gale 3; directional/Shelter reductions 2; Warder 3, Censer 3, Harrier 4 or isolated 7; splash and Close thresholds 2. Every attempt began Compact/0 with enemies 12/10/13 HP. Wounded Girtablilu starts 18/5/14 party HP; wounded Ugallu starts 7/14/14. Numeric observations below describe this build, not accepted balance targets.

Hypothesis: Compact/Spread and orientation change which threats to remove and which attacks are available; meaningful formation choice should persist beyond selecting a stronger damage stance.

## Attempts

HP order throughout: Ugallu / Girtablilu / Pazuzu. “Rounds” is the terminal round; victories ended during the player phase. No living action was forfeited through End phase in these records.

| Attempt | Preset | Strategy | Rounds | Outcome | Final HP | Record | Replay |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | wounded-girtablilu | Stay Compact; rotate off Censer protection; remove splash first | 5 | Victory, Girtablilu fallen | 6 / 0 / 14 | [attempt 1](scout-3-attempt-1.json) | Matched, 16 commands / 72 events |
| 2 | wounded-girtablilu | Expand; kill Harrier before isolated hit; hold Spread | 3 | Victory, all living | 12 / 2 / 14 | [attempt 2](scout-3-attempt-2.json) | Matched, 12 commands / 50 events |
| 3 | wounded-ugallu | Repeat Spread strategy to protect the other wounded start | 3 | Victory, all living | 1 / 11 / 14 | [attempt 3](scout-3-attempt-3.json) | Matched, 12 commands / 50 events |

Terminal evidence: [Compact victory](scout-3-compact-victory.png), [Spread victory](scout-3-spread-victory.png), [wounded Ugallu victory](scout-3-wounded-ugallu-victory.png). Attempt 1 is **presentation-defect contaminated** by stale actor-button HP at restart, described below. Its exported combat result remains reproducible, and decisions used the correct board HP. Attempts 2–3 had no observed decision-contaminating defect.

## Decisions, recorded before committing each round's combat

These are paraphrases of actual contemporaneous agent plans recorded in the session, not invented player quotations. The second opening's intention to expand/compare Impale was recorded before restart; its detailed arithmetic was recorded after committing Expand and inspecting Impale, before confirming any ability. Later-round reasoning was recorded before any command in that round. Hindsight is separated below. Command numbers are one-based positions in each record's `acceptedCommands`; step-local events and the overall `events` show the response.

### Attempt 1: Compact emphasis

| Round / commands | Reasoning at the time | What I chose | Response |
| --- | --- | --- | --- |
| 1 / 1–5 | Girtablilu has only 5 HP and two incoming sources. Remove Censer's splash first while retaining Close links. Clockwise preview removed no protection; anticlockwise removed all three actors' protection against Censer. | Rotate anticlockwise to Compact/5; Ugallu Claw Censer, Girtablilu Sting Censer, Pazuzu Gale Censer; End phase. | Censer died from 4+4+3. Warder hit Ugallu for 3; Harrier hit Girtablilu for 4. Party 15/1/14. |
| 2 / 6–9 | Harrier still has 13 HP. The observed three basic attacks total 11, so retaining Compact means I cannot kill it this round. Accept that cost to finish the Compact experiment rather than silently switch to the stronger shape. | Hold; Sting, Claw, Gale all on Harrier; End phase. | Harrier 2 HP; Warder reduced Ugallu to 12; Harrier killed Girtablilu. Party 12/0/14. |
| 3 / 10–12 | Harrier at 2 now marks Ugallu. Use Gale to remove it first, then start Warder. No Censer remains to motivate spreading. | Hold; Pazuzu Gale Harrier; Ugallu Claw Warder; End phase. | Harrier died; Warder 8. Ugallu took 3. Party 9/0/14. |
| 4 / 13–15 | Warder 8 cannot die to the remaining 4+3 actions this round. Ugallu can survive another announced 3. Prefer damage to delaying the kill. | Hold; Claw and Gale Warder; End phase. | Warder 1; Ugallu 6. Party 6/0/14. |
| 5 / 16 | Gale alone finishes the last HP; no maneuver has a useful purpose. | Hold; Pazuzu Gale Warder. | Immediate victory at 6/0/14; Ugallu's final action unused because combat ended. |

Hindsight: this was a deliberately constrained Compact run, not an optimized claim that losing Girtablilu was unavoidable. Its round-1 anticlockwise choice directly changed access to Censer, whereas rotating did not avoid the creature-following splash or Harrier mark. The subsequent wounded-Girtablilu Spread run is an observed alternative with better survival, but does not exhaust Compact strategies. Evidence: [attempt 1](scout-3-attempt-1.json), especially commands 1–5 and the `damage-applied` events.

### Attempt 2: Spread emphasis

| Round / commands | Reasoning at the time | What I chose | Response |
| --- | --- | --- | --- |
| 1 / 1–5 | Expand's preview reduces Censer recipients from three to Girtablilu alone. Impale previews 6 damage; together with Claw 4 and Gale 3 it exactly removes Harrier's 13 before isolation can hurt the wounded target. Accept one Censer hit. | Expand to Spread/0; Impale, Claw, Gale Harrier; End phase. | Harrier died before resolution. Ugallu took Warder 3; only Girtablilu took Censer 3. Party 15/2/14. |
| 2 / 6–9 | Censer now marks Pazuzu. Only Ugallu is listed as protected against Censer. Impale 6 + Gale 3 + even reduced Claw 2 kills it; maneuver adds no needed benefit. Contract loses Impale and adds splash exposure. | Hold Spread; Impale Censer, Gale Censer, Claw Censer; End phase. | Censer fell from 1 HP on Claw. Only Warder resolved; party 12/2/14. |
| 3 / 10–12 | Warder 12 dies to 4+6+3 while everyone remains Spread. No need to rotate or contract. | Hold; Claw, Impale, Gale Warder. | Immediate victory at 12/2/14. |

Evidence: [attempt 2](scout-3-attempt-2.json); [Expand preview](scout-3-spread-preview.png) shows recipient/link/protection changes; [Censer finish preview](scout-3-censer-finish-preview.png) shows the remaining 1 HP, Claw finish and conditional forecast. That forecast predicted Ugallu 12, Girtablilu 2, Pazuzu 14 after ending; actual command 9 matches it.

Hindsight: choosing shape did matter, but once Harrier was removed, holding Spread preserved both the stronger attack and splash separation. No later intention forced a new positional response in this attempt.

### Attempt 3: wounded Ugallu

| Round / commands | Reasoning at the time | What I chose | Response |
| --- | --- | --- | --- |
| 1 / 1–5 | Ugallu 7 is marked by both Warder and Harrier. Repeat Expand and kill Harrier; widening also takes Ugallu outside Censer's splash. End-phase forecast after Expand alone is lethal, so widening without threat removal is insufficient. | Expand; Gale, Claw, Impale Harrier; End phase. | Harrier died; Warder hit Ugallu 7→4; Censer hit Girtablilu 14→11. Party 4/11/14. |
| 2 / 6–9 | Censer marks Pazuzu. Keep spread and remove it, accepting Warder 3. Inspect Contract before proceeding: its immediate-end forecast brings splash onto all three and kills Ugallu. | Preview Contract, do not commit; hold; Impale, Gale, Claw Censer; End phase. | Censer died; Ugallu 4→1. Party 1/11/14. |
| 3 / 10–12 | Ugallu 1 cannot survive another Warder hit. Stay Spread for the full 13 damage and kill Warder before resolution. | Hold; Claw, Gale, Impale Warder. | Immediate victory at 1/11/14. |

Evidence: [attempt 3](scout-3-attempt-3.json) and [Contract risk preview](scout-3-contract-risk.png). The Contract screenshot is a conditional forecast with all remaining choices excluded, **not** a completed alternative attempt proving every Compact line lethal. It shows Compact's splash recipients and gained protection against Censer; I rejected it before spending the maneuver.

Hindsight: switching the wound changed which HP margin concerned me, but not my target priority or shape sequence. Reordering the round-1 and final attacks also succeeded; there was no observed need for one precise actor order in the Spread kills.

## P11 questions — observations and interpretation

**Target priority/ability order:** The Compact attempt removed Censer first to prevent three-person splash; both Spread attempts removed Harrier first to prevent its isolation attack, then Censer, then Warder. Girtablilu used Sting in Compact and Impale in Spread. I put Gale first when finishing Harrier's 2 HP in attempt 1, then put Claw into the next target. Spread opening/final actor orders varied without changing the kills. Formation changed target priority and ability choice; these records do not establish a consequential sequencing puzzle beyond allocating finishing blows. Evidence: all three command lists, especially attempt 1 commands 6–11 versus attempt 2 commands 1–8.

**Purposeful maneuver/hold:** Anticlockwise rotation removed all three Censer protection relationships in the Compact opening; its attacks then dealt unreduced 4/4/3. Expand put the party four steps apart, reduced Censer splash from three recipients to one, and enabled 6-damage Impale. Holding preserved those advantages. The third attempt's rejected Contract preview would reintroduce both enemy protection and splash. Position materially mattered through attack access, link gating and recipients. Its effect was also tightly coupled to the ability kit rather than independent movement tactics. Evidence: attempt 1 commands 1–5, attempt 2 commands 1–5, [Expand](scout-3-spread-preview.png), [Contract](scout-3-contract-risk.png).

**Automatic loop:** No expand/contract oscillation occurred. A simpler repeatable pattern appeared: Expand once; hold; kill Harrier, Censer, Warder with Claw/Impale/Gale. Both wounded starts won in three rounds that way. This supports investigating an automatic *opening and stance*, not claiming a universal optimal policy. Evidence: attempts 2–3, all commands.

**Dead turns:** No living Brood lacked a damage contribution in either shape while enemies remained. All living actions were spent before each End phase. Fallen Girtablilu lost subsequent contributions in attempt 1; Ugallu's unused round-5 action came from victory already being reached, not lack of a target. I did not use Shelter or Crosswind, so these three attempts cannot establish their usefulness or an absence of dead turns under other tactical lines. Compact's extra rounds became repeated damage into the remaining enemies with no new maneuver need. Evidence: attempt 1 commands 9–16; attempts 2–3; [Compact terminal controls and fallen token](scout-3-compact-victory.png).

## Readability

- The board visibly distinguished tight adjacent links from wide dashed links, and displayed textual distances 1 versus 4. Names and HP made normal-art entities identifiable. The central enemy cluster was separately labelled and reachable without confusing it with inward Pazuzu in these captures. Evidence: [Compact start](scout-3-compact-start.png), [Spread finish preview](scout-3-censer-finish-preview.png).
- Intentions explicitly said “follows creature,” listed recipients, and listed resolution order. Expand's text made it clear that the mark followed Girtablilu while its splash stopped reaching the others. The Contract preview showed the reverse. These readouts supported decisions more directly than the board's red geometry. Evidence: [Expand](scout-3-spread-preview.png), [Contract](scout-3-contract-risk.png).
- Preview separates Immediate from “If end phase now” and says remaining choices are excluded. This prevented interpreting Expand's lethal forecast as proof that the full planned attack sequence must fail. The Censer-finishing forecast then agreed with the actually committed round. Evidence: [Expand](scout-3-spread-preview.png), [Censer finish](scout-3-censer-finish-preview.png), attempt 2 command 9.
- Ghost destination circles have no Brood labels. For Girtablilu and Pazuzu I had to map ghosts using the documented order and textual coordinate recipients; Ugallu's overlapping ghost is easier to identify. The preview gives lowercase entity IDs and coordinate lists across long lines. This is a concrete visual/reading burden, not measured human confusion. Evidence: [Expand](scout-3-spread-preview.png).
- Red uses the combined legend “enemy front / mark.” The intention list was needed to disambiguate what the geometry represented. Also, the inspected Contract preview gives links and protection but no explicit “Impale becomes unavailable” line even though I knew Compact's kit restriction from the brief and earlier selection. Evidence: [Contract](scout-3-contract-risk.png).
- The visible ability buttons are names without a brief rule/damage description in these captures. `illegal-target` on Shelter provides less explanation than “needs a Close ally.” This matters when comparing Compact's defensive promise against Spread damage. Evidence: [Censer finish controls](scout-3-censer-finish-preview.png).
- The expandable log shows actor, target, before/after HP, damage and mitigation. It explains how an apparently protected Claw still finished Censer and shows final kill cancellation. It is labelled “Last action and enemy resolution”; retained captures show only that current segment, so I used exports for the whole attempt. Evidence: [Censer finish](scout-3-censer-finish-preview.png), [Ugallu victory](scout-3-wounded-ugallu-victory.png).

## Defects and contamination

**Observed defect: stale HP in Player actions after reset.** Reproduction from this session:

1. Load the normal healthy patrol route.
2. Select Wounded Girtablilu using the preset control, then click Restart patrol.
3. Before selecting an actor, compare Girtablilu's board label against its Player actions button.
4. Select the Girtablilu action button; it refreshes to the correct HP.

The retained [start screenshot](scout-3-compact-start.png) shows board Girtablilu **5/14** and action button **14/14**, after preset selection and restart. Attempt 1 `initialState.brood` stores 5 HP, consistent with the board and actual Harrier resolution. After selection, the visible button refreshed to 5/14 in the session. **Attempt 1 is presentation-defect contaminated**; no combat-result divergence was observed, and I used the correct board value. I have not traced the root cause or established every reset path that triggers it. Do not turn this into a claim that underlying HP resets incorrectly.

No observed preview/commit combat mismatch, export/replay mismatch, or uncaught browser exception occurred in these three attempts. This is bounded observation, not a general defect-free claim. The generic End phase feedback says “Unused actions forfeited” even after all actions were spent; this wording appears in [Contract risk's preceding round feedback](scout-3-contract-risk.png) while attempt 3 commands 2–4 show all three actions were used. Treat this as a minor wording issue, not recorded evidence of actual lost actions.

## Interpretation and top three changes to try

The interesting agent decision was whether to solve splash with distance or remove Censer while Compact, and whether to remove Harrier before becoming isolated. Compact rotation also changed directional access without moving the mark off its creature. The flattening occurred after the Spread opening: a Harrier kill removed Spread's main stated drawback, and the remaining opponents did not dislodge the stronger stance. These are interpretations of the observed choices above, not human preference statements.

1. **Retest the patrol tuning so the isolated-target threat competes with Spread's exact round-1 Harrier kill.** Try a bounded Harrier HP/damage or opening-timing variation and repeat the same two wounded starts. Success criterion: at least one credible reason to remain/return Compact, rather than merely making the currently wounded Brood die. Current evidence identifies a 13-damage/13-HP breakpoint; it does not select the right new value.
2. **Test a Compact defense line that can preserve the currently threatened Brood while still progressing.** Examine Shelter's target coverage, mitigation/attack ordering and the cost of replacing Claw, then run actual alternate strategies. These attempts never used Shelter, so this is a proposed investigation rather than a verified redesign. Preserve worthwhile basic attacks in both shapes.
3. **Improve decision readouts before further balance conclusions.** Refresh actor HP on reset; show short ability conditions/damage and plain rejection reasons; label ghost destinations and explicitly list destination ability availability. Keep the conditional forecast and ordered HP log, which supported the tested decisions.

No boss-gate change is requested. The [P11 human-evidence gate](../../playtests/2026-10-05-poc-001-p11-automated.md#boss-gate) remains applicable; independent AI attempts do not satisfy a requirement for actual human attempts.

## Verification, cleanup and limits

Executed the assigned `just poc-001-replay docs/mailbox/ai-playtest-20261005/scout-3-attempt-<k>.json` separately for k=1,2,3 through the ordinary Docker wrapper. Each exited 0 with `ok: true`: (16 commands, 72 events, revision 16, round 5, victory), (12, 50, revision 12, round 3, victory), (12, 50, revision 12, round 3, victory). Replay supports exact stored final state and event reproduction; it does not certify the observational interpretation. Exports plus screenshots are the durable evidence; the UI-only driver is disposable. Full unit/browser regression suites were not run because no implementation was changed.

Ran `/home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/ai-playtest-20261005/scout-3.md --repo /opt/dev/tehom-brainlab-aiplay`; final result `ok: true`. This validates handoff structure and revision resolution, not game behavior or reviewer acceptance.

Stopped the private Chrome driver (which reported no uncaught Runtime exceptions) and interrupted the private port-5183 dev-server session. Other testers' files and servers were untouched. Only scout-3 evidence and the unchanged assignment are included in this worker's commit. Application code, tests and protected documentation were not modified.

Limits: I am an AI agent operating a headless browser with exact text extraction and time to compare arithmetic. This can establish that visible formation facts informed agent decisions, that particular legal lines reached terminal outcomes, and that their records reproduce. It cannot establish human enjoyment, intuitive readability, cognitive load, willingness to retry, a fair Apex/Shadow comparison, overall balance, or universal strategy dominance. Three attempts omitted Healthy, Shelter/Crosswind commits, defeat outcomes and mixed-shape strategies. The constrained Compact run is not an exhaustive optimization comparison. Ghost/readout suggestions need human validation. Root causes of the UI defect and alternate tactical viability remain unresolved; no blocker prevented this assignment's evidence delivery.
