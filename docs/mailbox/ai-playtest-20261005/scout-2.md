---
task: AIP-2
status: complete
outcome: Three native-UI attempts won and replayed exactly; wounded Ugallu is winnable with distinct priorities, with a strong Spread damage sequence and one reproducible HP-label defect.
tested_revision: 552f2b11b1f52a9826de618b30a5e043c2a6bf21
artifacts:
  - docs/mailbox/ai-playtest-20261005/scout-2.md
  - docs/mailbox/ai-playtest-20261005/assignment-scout-2.md
  - docs/mailbox/ai-playtest-20261005/scout-2-attempt-1.json
  - docs/mailbox/ai-playtest-20261005/scout-2-attempt-2.json
  - docs/mailbox/ai-playtest-20261005/scout-2-attempt-3.json
  - docs/mailbox/ai-playtest-20261005/scout-2-wounded-start.png
  - docs/mailbox/ai-playtest-20261005/scout-2-harrier-kill-forecast.png
  - docs/mailbox/ai-playtest-20261005/scout-2-fallen-link-impale.png
  - docs/mailbox/ai-playtest-20261005/scout-2-shelter-resolution.png
verification:
  - "Native Chrome/CDP UI: three complete victories, normal artwork, real local exports; no core functions used for decisions."
  - "Attempt 1 replay: exit 0, ok true, 12 commands, 48 events, revision 12, round 3, victory."
  - "Attempt 2 replay: exit 0, ok true, 17 commands, 74 events, revision 17, round 5, victory."
  - "Attempt 3 replay: exit 0, ok true, 14 commands, 64 events, revision 14, round 4, victory."
  - "Handoff validator: ok true; structural/revision validation only."
review: not-run
discoveries:
  - "Wounded Ugallu won in round 3 with all Brood alive, and round 5 after sacrificing Ugallu to kill Censer first."
  - "Spread Impale 6 + Claw 4 + Gale 3 exactly removes Harrier 13 before its isolation penalty resolves."
  - "Healthy-to-wounded preset/reset can retain Ugallu 18/18 on the actor button while board/export show 7/18."
blockers: []
---

# AI playtester 2 — optimizer observations

Author: Scout 2, AI playtester, 2026-10-05. These are agent decisions through the real browser UI, not human enjoyment or preference evidence.

## Conditions and evidence boundary

Read the [design brief and Decision record](../../prototypes/poc-001-linked-formation.md), prototype [P10/P11 README sections](../../../poc-001-linked-formation/README.md#playable-patrol-p10), [playtest template](../../playtests/TEMPLATE.md), and [earlier automated evidence](../../playtests/2026-10-05-poc-001-p11-automated.md). Used only the CDP/input/download patterns in `tests/browser-run-record.mjs` and the opening CDP/readout portion of `tests/browser-patrol.mjs`; did not inspect gameplay implementation or call its functions. Earlier evidence supplied initial tuning/familiarity, not a winning command script for these attempts.

Build in every export: `552f2b11b1f52a9826de618b30a5e043c2a6bf21`, rules `poc-001-rules-v1/patrol-v1/p07-v1`, record v1. No tuning overrides. Started `POC001_PORT=5182 just poc-001-dev` with Docker escalation, navigated to `http://localhost:5182/?play=patrol`, normal emblems, Chrome headless shell Playwright build 1223, 1280×1000 viewport. Temporary driver scripts and scratch notes lived under `/tmp`. Used native mouse controls, hover previews, keyboard preset selection, Confirm, End phase, Restart and Export. Read visible text, inspected screenshots, and decided without a runtime oracle.

In tables below, U/G/P means Ugallu/Girtablilu/Pazuzu. Step numbers are one-based entries in each JSON's `acceptedCommands`; they provide exact command/revision/event anchors. Plans record reasoning written in commentary or scratch before the round; hindsight is separately labelled. Casualty at 0 HP is a tactical result, not a defect.

## Completed attempts

| Attempt | Preset | Strategy | Terminal round | Outcome | Final HP U/G/P | Record | Replay matched |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | wounded-ugallu | Expand; kill Harrier; rotate away from protection; kill Censer; finish Warder | 3 | Victory | 1 / 11 / 14 | [Attempt 1](scout-2-attempt-1.json) | Yes, 12 commands / 48 events |
| 2 | wounded-ugallu | Compact Censer-first; accept Ugallu loss; keep duo Close against Harrier | 5 | Victory | 0 / 1 / 14 | [Attempt 2](scout-2-attempt-2.json) | Yes, 17 commands / 74 events |
| 3 | healthy | Compact Crosswind/Shelter opening; switch to Spread damage and efficient kills | 4 | Victory | 2 / 13 / 8 | [Attempt 3](scout-2-attempt-3.json) | Yes, 14 commands / 64 events |

All enemies finished at 0 HP. Presentation-defect exposure: attempt 1 began with the stale actor HP label described below, so its initial readability evidence is **defect contaminated**. Decisions used board HP and forecasts; the exported transitions/outcome replay exactly. Attempt 2's fresh same-preset restart showed matching HP. No known gameplay defect contaminated attempts 2 or 3.

One additional Healthy partial run reached round 3 before the browser driver received SIGTERM (cause unestablished). It was not exported or counted as a completed attempt. Restarted and repeated its opening through the UI with identical visible round-2/round-3 HP, then completed attempt 3. The Shelter screenshot was captured in that interrupted opening; attempt 3 steps 1–4 independently reproduce the same state/events. No recovered state or core command injection was used.

## Decisions and responses

### Attempt 1 — keep the wounded attacker alive

| Round / steps | Plan and reasoning before acting | Actual choices and response |
| --- | --- | --- |
| 1 / 1–5 | U7 faces Warder and Harrier; Censer splashes all three in Compact. Spread unlocks Impale and separates splash. Prioritize Harrier: 6+4+3 exactly fits its 13 HP. Expansion forecast alone kills U, so the kill must precede End phase. | Expand; G Impale, U Claw, P Gale, all on Harrier. Gale preview removes Harrier and forecasts U4/G11/P14. End phase produces exactly that. |
| 2 / 6–10 | U4 cannot withstand another long exchange. U remains protected against Censer at Spread0. Anticlockwise rotation removes that penalty; G can bypass its new protection with Impale. Two attacks should kill Censer and free Gale to damage Warder. | Rotate anticlockwise to Spread5; G Impale6 + U Claw4 kill Censer10. P Gale chips Warder to9. End phase leaves U1/G11/P14; Censer's newly announced mark on P never resolves. |
| 3 / 11–12 | Only Warder9 remains; U1 cannot survive its hit. Hold Spread to retain Impale and kill before enemy phase. | U Claw4, G Impale6; immediate victory. P has no action because combat has already ended. |

Evidence: [record 1](scout-2-attempt-1.json), [Harrier kill forecast](scout-2-harrier-kill-forecast.png). Hindsight: this is a compact three-round elimination sequence; the opening that appeared dangerous in the maneuver-only forecast becomes safe only after a complete focus-fire plan. Rotation was useful for damage access, not escaping following marks.

### Attempt 2 — Censer first, with a casualty

| Round / steps | Plan and reasoning before acting | Actual choices and response |
| --- | --- | --- |
| 1 / 1–5 | Try a distinct Compact route: rotate out of Censer's protection and remove splash first. Know W3+H4 will kill U7 even after Censer dies, but preserve G/P at14 to attempt a duo win. | Anticlockwise to Compact5; U Claw4, G Sting4, P Gale3 kill Censer. End phase kills U; G/P remain14. Both surviving enemy marks next target G. |
| 2 / 6–8 | Keep G/P Close so Harrier hits for4 rather than isolated7. With only two actions, Sting4+Gale3 cannot kill Harrier13 this phase, but G14 can survive W3+H4. No useful rotation once Censer is gone. | Hold Compact; G Sting and P Gale on Harrier. Harrier6, G7/P14 after enemy phase. |
| 3 / 9–11 | Harrier6 now fits Sting+Gale. Kill it before its hit; Warder3 should leave G4. Maintain Close links until the kill. | Hold; P Gale then G Sting kill Harrier. End phase leaves G4/P14. Reversing the pair's order had no observed consequence here. |
| 4 / 12–15 | Warder12 remains, G4 can take one hit. With Harrier gone, expansion has no isolation cost. Probe whether Spread unlocks Impale after U's death; if unavailable, use Sting/Gale and finish next phase. Preview showed one stretched destination link but did not explain future ability eligibility. | Expand; G Impale remains `illegal-ability` despite Spread. G Sting + P Gale reduce Warder to5. End phase leaves G1/P14. |
| 5 / 16–17 | Hold Spread: contracting provides no visible mitigation for Warder's following mark. Gale+Sting will kill before G1 takes its next hit. | P Gale, G Sting; victory with U0/G1/P14. |

Evidence: [record 2](scout-2-attempt-2.json), [post-casualty Impale screen](scout-2-fallen-link-impale.png). Hindsight: the second victory establishes that losing Ugallu need not lose the encounter, but costs two rounds and permanently removes the observed Impale option. Expansion in round 4 was an information probe, not an effective damage maneuver. Do not infer Impale is bugged; the missing second living link is a plausible intended requirement, inadequately explained by the UI.

### Attempt 3 — tactical opening, then damage efficiency

| Round / steps | Plan and reasoning before acting | Actual choices and response |
| --- | --- | --- |
| 1 / 1–4 | Test both tactical actions. Crosswind Warder clockwise should move its front away from Compact0 before Sting hits Censer. Shelter G should reduce Censer's first hit against G. Hold Compact for Shelter eligibility and to avoid Harrier's isolation penalty. Expected U8/G13/P11. | P Crosswind clockwise, G Sting Censer4, U Shelter G. Warder facing1; protection becomes none. Ordered resolution gives U18→15→12→8, G14→13 with Shelter−2, P14→11, then Shelter consumed. Exactly expected. |
| 2 / 5–9 | U8 is now vulnerable. Expand, separate Censer's splash marked on P, and kill Harrier13 with Impale6+Claw4+Gale3 before isolated hit7. Shelter has already been consumed. | Expand and focus Harrier; End phase leaves U5/G13/P8. |
| 3 / 10–13 | Censer6 now marks U5: W3+C3 would be lethal. G's Impale6 bypasses its protection and kills Censer with one action. Spend U/P on Warder; retain Spread. | G Impale Censer, U Claw/P Gale Warder. Warder5; End phase leaves U2/G13/P8. |
| 4 / 14 | Warder5 fits Impale6 alone. Activate G first, hold Spread, and end combat before U2 receives its next hit. | G Impale Warder; immediate victory with two actor actions unused. |

Evidence: [record 3](scout-2-attempt-3.json), [Shelter resolution screenshot](scout-2-shelter-resolution.png). Hindsight: Crosswind-before-Sting was a real order-dependent effect; Shelter saved 2 HP on G. Neither establishes that these actions were optimal. They consumed two damage actions and left all three enemies alive in round 1. This was an intentional ability probe followed by attempts to finish efficiently.

## P11 decision questions

**Target priority and ability order:** priorities changed across attempts and with remaining HP: Harrier-first preserved U in attempt 1; Censer-first deliberately traded U for splash removal in attempt 2; attempt 3 needed Censer's one-action kill when its mark moved to U5. Crosswind preceded Sting to remove protection; a final Impale alone was preferable to spending two actors on Warder5. Evidence: records 1–3, round tables above. Order among ordinary damage attacks was usually interchangeable when all were required for a kill, as the two Harrier rounds in attempt 2 illustrate.

**Purposeful maneuver/hold; tight versus wide:** Compact kept the surviving duo Close while Harrier lived (record 2, steps 6–11); Spread split splash and enabled Impale with three living Brood (record 1, steps 1–5; record 3, steps 5–9). Anticlockwise rotation gave U full Censer damage (record 1, steps 6–8). Holding Compact protected the Shelter condition (record 3, steps 1–4). Holding Spread retained Impale after Harrier died. The actual differences were link/ability/recipient changes; ordinary contact attacks reached enemies from either shape.

**Automatic loop:** no Compact/attack/Spread/contract cycle occurred. No completed attempt contracted. A stronger potential routine emerged: expand, kill Harrier with 13 damage, remain Spread, rotate only if required for Censer access, then kill remaining enemies. Evidence: record 1 and record 3 after its tactical opening. This is a candidate dominant sequence, not proof across all presets/strategies. Wounded Girtablilu was not tested here.

**Dead turns:** no living Brood had a round in which no worthwhile action was available in the chosen states. G could Sting after U fell even though Impale was disabled (record 2, steps 13/17). Terminal unused actions in records 1 and 3 followed immediate victory and should not count as dead turns. Ugallu's missing later actions in record 2 were due to death. Maneuvers frequently had no worthwhile combat contribution once Censer/Harrier were eliminated; that made holding obvious rather than a close choice.

## Readability and defects

The board, upright emblems, names/HP and line styles were readable at this viewport; Compact's triangle and Spread's separation were visually distinct ([start](scout-2-wounded-start.png), [Spread preview](scout-2-harrier-kill-forecast.png)). The centre cluster did not prevent these tests from selecting any target, though this used DOM-located native input and cannot establish human hit-target usability. Textual links and explicit recipient lists supplied the strongest decision information. All actual patrol intentions observed were following marks; committed-area readability was not exercised.

Previews distinguished immediate HP from **If end phase now**, explicitly excluding remaining choices. This mattered: expansion alone forecast U's death, whereas the final Harrier-kill preview forecast U4; actual resolution matched ([forecast screenshot](scout-2-harrier-kill-forecast.png), record 1 step5). Long preview prose nearly filled the 1000-pixel viewport; human scanning at the documented 800-pixel desktop height remains untested. Enemy-front dots and marked-creature rings share a red treatment, so the written protection/recipient text carried distinctions more reliably for this agent than color alone (same screenshot).

The expanded log clearly showed damage order and Shelter mitigation ([Shelter screenshot](scout-2-shelter-resolution.png); record 3 step4). It includes terse entries such as `shelter consumed` and `intentions announced`, with no actor detail in those labels. Post-casualty `Impale (illegal-ability)` explains no condition ([fallen-link screenshot](scout-2-fallen-link-impale.png)); the expansion preview displayed the one destination link but did not state whether Impale would become available. This is a readability gap against the brief's enabled/disabled-ability presentation requirement, not a verified core-rule defect.

**D1 — reproducible stale actor HP after fresh wounded start.**

1. Open real patrol in Healthy, where Ugallu is18/18.
2. Select Wounded Ugallu through the native preset dropdown, then click Restart patrol (the exact helper sequence used for attempt 1).
3. Before selecting an actor, compare board Ugallu and the Player actions button.
4. Board reads7/18, while the actor button reads18/18. [Screenshot](scout-2-wounded-start.png); [attempt 1 initialState](scout-2-attempt-1.json) contains actual HP7.
5. Clicking a Brood refreshed the actor label to7/18 in the observed opening. After all completed attempts, repeating Healthy → Wounded Ugallu with Restart again reproduced the same mismatch.

Impact: misleading starting survivability in the exact primary preset. Attempt 1 is presentation-defect contaminated, but board/forecast/export were consistent and guided its decisions. No gameplay mismatch was found. Cause was not investigated in source, per scope. No application exception was observed in the final driver session; this is not an exhaustive defect audit.

## Interpretation and suggestions — proposals, not observations

The interesting optimizer decisions were matching damage to kill thresholds before announced retaliation, moving outside a protection front while assigning the newly protected attacker a bypass attack, and deciding to preserve or sacrifice a wounded Brood. Evidence anchors: record 1 rounds1–2, record 2 round1, record 3 rounds1/3/4. Shape mattered, but much of its value was numerical: 6-damage Impale and splash separation rather than varied geographic target access.

The tail of the encounter became flat for this agent: once Censer and Harrier died, Warder's single following hit and unprotected HP made a damage race with obvious holds (records 1–3 final rounds). Crosswind and Shelter produced observable effects, yet neither was necessary in either wounded-Ugallu victory. I cannot call either universally useless: Crosswind preserved the shared maneuver budget in attempt 3, and Shelter demonstrably mitigated2. There was no observed later reason to use that preserved budget, and no counterfactual replay of alternative strategies was performed.

Top three changes to try, in order:

1. **Repair/explain player information:** refresh actor HP on reset; replace generic illegality with the missing condition, and show ability eligibility changes in maneuver previews. Screenshots above establish the information gaps.
2. **Test a stronger counterweight to persistent Spread after focus fire:** vary the current patrol's provisional damage/HP or targeting so Harrier's isolation pressure survives long enough to compete with Impale's 13-damage team kill. Then compare all three starting presets. Preserve the small experiment scope; this report does not prescribe implementation.
3. **Test the opportunity cost of tactical actions:** tune Shelter/Crosswind or patrol pressure so spending an actor action can compete with preventing an entire enemy intention by killing its source. Measure casualties/rounds/decisions rather than assuming the two abilities are pointless. Attempt 3 provides a real tactical-use baseline.

## Verification, dependencies, limits and cleanup

Executed separately, all exit0:

- `just poc-001-replay docs/mailbox/ai-playtest-20261005/scout-2-attempt-1.json`: `ok:true`, commands12/events48, revision12, round3/victory.
- Same command for attempt2: commands17/events74, revision17, round5/victory.
- Same command for attempt3: commands14/events64, revision14, round4/victory.
- `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/ai-playtest-20261005/scout-2.md --repo /opt/dev/tehom-brainlab-aiplay`: `ok:true` (Bun from `/home/metatron/.bun/bin`). This validates report structure/revision resolution, not truth or acceptance.

Dependencies: installed prototype packages, pinned Docker wrapper, local Bun, available Chrome/CDP, UI preview/forecast and native export. Docker/Chrome/local-driver access required approved sandbox escalation. Native downloads were retained first under `/tmp` and copied to owned mailbox files; cross-filesystem rename failed in the driver and was corrected by copying the already completed download. This tooling error did not change game state.

Stopped only the private port5182 server with Ctrl-C, and stopped the private driver/Chrome at9282/9382. No other tester's files/server were changed. No unit suite, aggregate browser suite or human playtest was run; scope was three decision-driven attempts and exact replay. No application source/test/configuration or protected document was changed.

These attempts establish reproducible agent victories, particular causal choices, and a reproducible presentation defect at the stated revision. They cannot establish human enjoyment, intuitive first-time readability, reaction speed, accessibility, replay desire, global balance, optimality or a fair Apex/Shadow comparison. Prior reading of numeric tuning and systematic forecast access favor this optimizer. Only Healthy and wounded Ugallu were covered, only normal emblems at one viewport, no boss or fixed-area encounter. The interrupted partial run's cause remains unknown. Boss gate remains HOLD under the existing human-evidence requirement; this report grants no gate-opening authority. Return the creating commit SHA in the terminal handoff, not in this report.
