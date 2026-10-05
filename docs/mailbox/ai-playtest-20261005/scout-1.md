task: AIP-1
status: complete
outcome: Three AI-directed native-browser patrol attempts completed and replayed; first-time readability findings and one misleading forecast recorded.
artifacts:
  - docs/mailbox/ai-playtest-20261005/scout-1.md
  - docs/mailbox/ai-playtest-20261005/assignment-scout-1.md
  - docs/mailbox/ai-playtest-20261005/scout-1-attempt-1.json
  - docs/mailbox/ai-playtest-20261005/scout-1-attempt-2.json
  - docs/mailbox/ai-playtest-20261005/scout-1-attempt-3.json
  - docs/mailbox/ai-playtest-20261005/scout-1-initial.png
  - docs/mailbox/ai-playtest-20261005/scout-1-spread-impale-preview.png
  - docs/mailbox/ai-playtest-20261005/scout-1-rotation-lanes.png
  - docs/mailbox/ai-playtest-20261005/scout-1-end-phase-double-forecast.png
  - docs/mailbox/ai-playtest-20261005/scout-1-fallen-and-log.png
verification:
  - "Native Export attempt downloads retained for all three terminal attempts."
  - "just poc-001-replay scout-1-attempt-1.json: exit 0, 12 commands, 48 events, revision 12, round 3, victory."
  - "just poc-001-replay scout-1-attempt-2.json: exit 0, 14 commands, 73 events, revision 14, round 4, victory."
  - "just poc-001-replay scout-1-attempt-3.json: exit 0, 11 commands, 47 events, revision 11, round 3, victory."
  - "Chrome Runtime.exceptionThrown capture: zero exceptions during these attempts."
  - "ruach-handoff validator with --repo: ok true."
review: not-run
tested_revision: 552f2b11b1f52a9826de618b30a5e043c2a6bf21
discoveries:
  - "Expand plus focused Harrier damage enabled a round-one kill; both wide strategies finished round three with all Brood alive."
  - "Starting Ugallu HP changed second-round target priority and removed the need for the healthy strategy's rotation."
  - "End phase hover shows different Immediate and If end phase now HP; only Immediate matches the next committed resolution."
blockers: []

# AI playtester 1 — learnability and readability

Author: Scout / AI playtester 1, 2026-10-05. These are AI-directed decisions through the real browser UI, not human enjoyment or preference evidence. Application code, tests and shared documents were not changed.

## Conditions and evidence conventions

Played `http://localhost:5181/?play=patrol` with normal emblem art, HeadlessChrome 148.0.7778.96 / Playwright headless shell 1223, 1440 × 1100 viewport. Started the assigned Docker dev server with `POC001_PORT=5181 just poc-001-dev`; no game-rule overrides or intercepted fixtures. All exports embed the tested revision above and rules `poc-001-rules-v1/patrol-v1/p07-v1`. Initial geometry was Compact / 0. Exact HP, tuning and events are in the records.

I read the assigned brief (including its decisions), README P10/P11, playtest template and automated evidence before playing. I was unfamiliar with playing the patrol but had that briefing; this is not a blind test of what the screen alone teaches. The brief/README opening status paragraphs are historical; their later sections and the actual UI describe/show playable combat. No source investigation beyond the existing browser driver's CDP/control conventions was used. In particular, I did not import or call game core functions to plan or drive any outcome.

A disposable CDP driver lived in `/tmp/scout-1-playtest/`. It dispatched mouse inputs to native controls, read visible body text and control labels, captured screenshots, and clicked the native export. I viewed all five retained screenshots. Plans were written in scratch before each round, then compared with the UI response. The tables below preserve the reasoning at the time, including corrected expectations. Accepted-command numbers are **one-based indices** into each record's `acceptedCommands`; they are evidence locators, not rounds or revisions. Export files record actions/results, not thoughts or hovered previews; screenshot links substantiate those UI observations.

## Attempts

Final HP order throughout is Ugallu / Girtablilu / Pazuzu. Rounds means the terminal displayed round; victory happened during its player phase, before its enemy resolution.

| Attempt | Preset | Strategy | Rounds | Outcome | Final HP | Record | Replay |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Healthy | Expand, kill Harrier; rotate to open Censer lane; hold wide | 3 | Victory, all alive | 12 / 11 / 14 | [attempt 1](scout-1-attempt-1.json) | Matched; 12 commands / 48 events |
| 2 | Healthy | Stay Compact, Warder first; accept attrition to test recovery | 4 | Victory, Ugallu fallen | 0 / 5 / 5 | [attempt 2](scout-1-attempt-2.json) | Matched; 14 commands / 73 events |
| 3 | Wounded Ugallu | Expand, Harrier first; Warder second to preserve low-HP Ugallu | 3 | Victory, all alive | 4 / 11 / 11 | [attempt 3](scout-1-attempt-3.json) | Matched; 11 commands / 47 events |

Attempt 2 is **readability-defect contaminated** by the ambiguous End phase forecast described below. Its actual commands, damage and outcome reproduce. I used the correctly matching Immediate line after identifying the discrepancy. Attempts 1/3 had no observed decision-contaminating mismatch; this does not certify the UI defect absent from those routes.

## Decisions and responses

### Attempt 1 — Healthy, spread offense

| Round / evidence | Plan and reasoning recorded before acting | Response and comparison |
| --- | --- | --- |
| 1; commands 1–5 | Expand preview removed two protected Censer attack lanes and narrowed splash to Girtablilu. It also forecast Ugallu 18→8 if all enemies survived. Plan: exploit Impale and focus Harrier before its isolated hit. Confirm damage through ability previews; spend Impale, Claw, then Gale on Harrier. | Impale 6 + Claw 4 + Gale 3 exactly killed Harrier's 13 HP. Gale preview removed its intention and forecast Ugallu 15, Girtablilu 11, Pazuzu 14; those were the next round's actual HP. [Spread/Impale preview](scout-1-spread-impale-preview.png) supports the dangerous partial forecast; the record supports the completed kill and resolution. |
| 2; commands 6–10 | Censer now marked Pazuzu alone. Kill Censer with Claw 4 + Impale 6 and reserve Gale for Warder. Initially expected clockwise rotation to open Ugallu's lane. Its preview lost no protection; anticlockwise explicitly lost Ugallu→Censer and gained Girtablilu→Censer. Switch direction: Impale bypasses the newly protected Girtablilu lane. | Anticlockwise reached Spread / 5. Claw + Impale killed Censer; Gale left Warder at 9. Only Warder's 3 damage resolved: HP 12 / 11 / 14. The preview changed the direction I selected. [Rotation lanes](scout-1-rotation-lanes.png), plus commands 6–10. |
| 3; commands 11–12 | Hold Spread / 5: Warder 9 alone, no Censer protection, Impale 6 + Gale 3 already suffices. No useful reason to spend the maneuver. | Immediate victory after those two actions, same HP. Ugallu had a possible damaging action but it became unnecessary at victory. This is spare terminal capacity, not a whole turn without useful options. |

Hindsight: the useful rotation was a damage-access choice, not avoidance of following marks. The first-round kill neutralized the very threat that made Spread dangerous. Neither finding was inferred merely from the outcome; both appeared in previews before committing.

### Attempt 2 — Healthy, Compact and Warder first

| Round / evidence | Plan and reasoning recorded before acting | Response and comparison |
| --- | --- | --- |
| 1; commands 1–4 | Deliberately compare a Compact strategy. Warder priority removes the protective source; Claw 4 + Sting 4 + Gale 3 leaves it at 1 HP. Hold because Compact avoids Harrier's isolated bonus, even though Censer splashes all three. Considered rotating/Crosswind, but neither improved damage to the chosen Warder target. | Warder survived at 1. End phase's Immediate preview said HP 8 / 11 / 11; actual next-round HP matched. Its separate If end phase now line said 0 / 8 / 8; captured rather than treating it as the actual next resolution. [Forecast screenshot](scout-1-end-phase-double-forecast.png). |
| 2; commands 5–8 | Use Gale first to finish 1-HP Warder with the smallest damaging action, suppressing its hit and protection. Put Claw + Sting into Harrier. Hold Compact; expect Ugallu 8→1 from splash 3 + Harrier 4. Considered Crosswind, but preferred a confirmed damaging kill over spending Pazuzu's action on a turn. | Warder died; Harrier remained at 5. HP became 1 / 8 / 8 as calculated. This ordering differed from round 1 because the weak remaining enemy needed a small finishing hit. Crosswind was not confirmed and is consequently absent from the record; this choice does not establish its effectiveness. |
| 3; commands 9–12 | Stay Compact to continue the comparison. Sting + Gale finish Harrier, Ugallu's Claw reduces Censer. Censer now follows Ugallu; rotation cannot remove that mark. Expect Ugallu to fall from 1, and observe whether the others can continue. Choose damage rather than spending Ugallu's action shielding an ally. | Harrier died, Censer remained at 6. Splash killed Ugallu and left both others at 5. Battle continued into round 4, with Ugallu unavailable and only the living link shown. [Fallen state and expanded log](scout-1-fallen-and-log.png). |
| 4; commands 13–14 | Censer 6, Girtablilu/Pazuzu 5 each: hold Compact and kill with Sting 4 + Gale 3 before splash. No maneuver needed. | Victory with 0 / 5 / 5 HP. No inability of the surviving Brood to contribute. A scratch hypothesis about post-fall Impale availability was not tested and is not a finding. |

Hindsight: this was an intentionally constrained comparison, not evidence that a human would choose to stay Compact while taking splash. Shape, target priority and ability choice changed together between healthy attempts; their outcomes do not isolate the causal effect of shape. I accepted an avoidable sacrifice as an investigation choice, not as a claim about optimal play.

### Attempt 3 — Wounded Ugallu, threat removal

| Round / evidence | Plan and reasoning recorded before acting | Response and comparison |
| --- | --- | --- |
| 1; commands 1–5 | Ugallu starts at 7, so leaving all three intentions alive is unacceptable in either shape. Reuse the learned Spread kill threshold: Expand, Claw + Impale + Gale on Harrier. Expect Warder's remaining 3 to leave Ugallu at 4 and Censer to hit only Girtablilu. | Harrier died; next-round HP 4 / 11 / 14 matched. Action order was Claw, Impale, Gale this time; the record does not suggest that this swap itself changed the result. |
| 2; commands 6–9 | Change priority from healthy attempt 1: remove Warder before Censer because Ugallu is at 4. Hold Spread / 0 and spend Claw 4 + Impale 6 + Gale 3 on its 12 HP. Censer marks only Pazuzu; no rotation helps the selected target. | Warder died, Ugallu stayed at 4, Pazuzu took 3, Girtablilu stayed 11. End HP 4 / 11 / 11. The extra 1 damage was overkill; target priority was the purposeful difference. |
| 3; commands 10–11 | Censer 10 alone, now marking Ugallu. Hold wide, Impale 6 then Claw 4 kills it before splash. Gale is available but unnecessary. | Victory immediately, HP unchanged. Remaining maneuver and Pazuzu action were unused because the battle ended. |

Hindsight: changing initial HP changed which enemy I removed second and whether I needed a rotation. It did not break the efficient initial Expand/Harrier pattern discovered in attempt 1.

## P11 questions

- **Situation-dependent priority/order:** yes. Healthy wide play removed Censer second; wounded Ugallu removed Warder second. Compact round 2 used Gale first to finish a 1-HP enemy and left larger hits for Harrier. Records 1–3 identify the exact sequences. There is no evidence here that action order is generally deep: several damage-only orders appear interchangeable.
- **Purposeful maneuvers/holds:** yes, within these AI plans. Expand enabled the 13-damage Harrier kill while limiting splash; anticlockwise rotation opened Claw's Censer lane; later holds preserved sufficient damage and avoided unnecessary changes. Tight versus wide changed both legal tactical damage and splash exposure. Evidence: attempt 1 commands 1–10 and its two preview screenshots, and attempt 2's Compact states/events.
- **Automatic formation loop:** no compact/attack/spread/contract loop occurred. There were no contractions. However, a potentially automatic **Expand → kill Harrier → remain Spread** opening appeared in both wide attempts (records 1/3). This is a candidate dominant pattern, not proof across presets, strategies or tuning.
- **Dead turns:** none observed for living Brood across these runs. Every nonterminal living activation either damaged an enemy or remained available for damage; spare actions occurred only when victory ended the phase. Fallen Ugallu lost its action, as explicitly shown in the screenshot/attempt 2. This is not evidence that Shelter/Crosswind are worthwhile in all situations: neither was executed, and both wide strategies favored direct damage.

## Readability observations

The [initial screen](scout-1-initial.png) made current HP, the three linked positions, Close distances, ordered intentions, unused-action count and selection/confirmation separation visible. Emblem art stayed readable with HP labels. The screen's instruction to select Brood/ability/target and confirm was enough to operate the controls after the briefing. End phase's unused-action label made forfeiting explicit. These are specific observations, not a general accessibility verdict.

I relied on the intention text more than the board: the initial legend uses red for both enemy front and mark, while the board also shows multiple red circles and filled cells without an on-board source/damage explanation. From that image alone I could not confidently distinguish which tint belonged to which threat. The text listed affected Brood and resolution order and resolved much of that uncertainty. Orientation was presented as a number (`Compact / 0`, later `Spread / 5`); it did not explain sector numbers spatially. Evidence: initial and rotation screenshots.

`Protection: ugallu → censer` needed interpretation: it means Ugallu's attack lane into Censer is protected, not that Ugallu provides a buff. The initial label does not spell that out. The rotation preview's gained/lost lanes and the Impale/Claw HP changes allowed me to use it correctly. I first chose the wrong rotation direction in my plan, then changed it from the visible lane preview. Evidence: rotation screenshot and attempt 1 commands 6–8.

Ability buttons show names, rather than the numeric damage or a short rule description in the captured screen. Impale's 6 damage and its useful condition became tangible through selection/target preview and changed HP. Unavailable actions use technical labels such as `illegal-target` or `same-shape`; they identify a rejection but do not teach its specific cause. Initial Contract says same-shape; the fallen/log screenshot repeats fallen-actor across several controls. The brief had already taught me Shelter/Impale conditions, so I cannot claim to have learned those fully from the screen.

The preview has useful immediate HP and hypothetical enemy-resolution HP, but repeats all six entities, links, protection and threats in small text. In the [Spread preview](scout-1-spread-impale-preview.png), the lower box is the important decision surface; the partial attack still forecasts Ugallu 8 until subsequent kills are included. The sentence excluding remaining choices prevented me from mistaking that forecast for the result of my whole round plan. Numerical comparison was effective for this AI agent; human scanning effort is unmeasured.

The expandable log explained exact HP transitions and mitigation, making it possible to see Ugallu's loss and surviving allies' damage. Generic lines `fallen` and `intention cancelled` omit subjects in the visible log; neighboring HP lines give context but do not fully explain every cancellation. Evidence: fallen/log screenshot. I did not exercise keyboard operation, placeholder mode, or canvas token hit-testing beyond using the native controls.

## Defect D1 — End phase forecast describes a further resolution without saying so

**Observed presentation mismatch; rules implementation cause uninvestigated.** In attempt 2, round 1 after Claw/Sting/Gale on Warder, hover End phase. The pending command is End phase. Its Immediate line shows Ugallu 8, Girtablilu 11, Pazuzu 11. Its If end phase now line shows Ugallu 0, Girtablilu 8, Pazuzu 8. Click End phase once: round 2 starts at **8 / 11 / 11**, not **0 / 8 / 8**.

Reproduction on this revision:

1. Restart Healthy; leave Compact / 0 and all maneuvers unused.
2. Confirm Ugallu Claw → Warder; Girtablilu Sting → Warder; Pazuzu Gale → Warder.
3. Hover or focus End phase (0 actions unused), and compare its two HP lines.
4. Click End phase once; inspect round 2 HP or export/replay that state.

Evidence: [end-phase-double-forecast screenshot](scout-1-end-phase-double-forecast.png) and [attempt 2](scout-1-attempt-2.json), commands 1–4 and ordered damage events. The lower numbers are consistent with ending another phase after the immediate result, but that is an **inference**, not a verified code diagnosis. If intentionally forecasting the next round, label it accordingly; the present text reads like the next single resolution. Attempt 2 is marked contaminated for readability, while replay confirms actual state/events. No other confirmed application defect, crash or export/replay divergence was observed.

The temporary driver's initial file rename failed because `/tmp` and the worktree are different filesystems. The native downloads were present and then moved with the shell into their assigned filenames before any later export. This was a driver bookkeeping issue, not a game export defect; no attempt was lost or reconstructed.

## Interpretation and suggestions

The strongest decision evidence was solving a dangerous Spread forecast by removing Harrier, then choosing between stopping splash and stopping direct pressure on Ugallu. The rotation-lane correction also shows a preview changing a decision. After the first kill, both wide games became straightforward damage thresholds and purposeful holds. These observations support a narrow claim that formation can change tactical choices under the current numbers; they do not establish enjoyment or superiority to Apex/Shadow.

The Compact comparison shows that low isolated damage alone did not compensate for leaving splash and Warder pressure alive. It also shows survivable casualty recovery. Because the comparison deliberately changed target priority and shape together, I would not use its lower final HP as a balance verdict about Compact alone.

My top three proposed experiments, in order:

1. **Fix or relabel End phase's second forecast.** Show only the upcoming resolution for that pending command, or explicitly name a further round. D1 provides an exact checkable case.
2. **Teach rules at the choice point.** Add short ability conditions/damage and explain protected attack lanes; replace generic illegal-target text with the relevant reason. Distinguish front shading from following marks and associate them with named sources. Initial/preview screenshots identify the current ambiguity.
3. **Test the efficient wide opening against more starts and defensive alternatives.** Compare Harrier-first Spread with Compact strategies that actually use Shelter/Crosswind and vary provisional numbers if the opening remains automatic. The present three runs do not justify implementing a boss or declaring either defense redundant.

If conducting another attempt, I would try a wounded-Girtablilu start with Shelter/Crosswind deliberately considered in the round plan, rather than assume that direct damage remains best. This is a proposed investigation, not a human desire to replay.

## Verification, dependencies, cleanup and limits

Each native terminal download was verified with the exact repository command `just poc-001-replay docs/mailbox/ai-playtest-20261005/scout-1-attempt-<k>.json`. All three commands exited 0 and returned `ok: true`, with the counts shown in the leading block/table. Replay establishes final-state and ordered-event agreement, not screenshot correctness or player comprehension. No application test suite, build, or independent review was run for this report; none was needed to change code because no code was changed. The validator initially reported `DEPENDENCY_UNAVAILABLE`. Its required frozen-lockfile runtime installation needed escalation because the skill directory is read-only in the sandbox. Installation succeeded without changing tracked skill files; node_modules is ignored. The report's leading block was then checked with the assigned Bun handoff validator and `--repo`; result `ok: true`.

Runtime dependencies were the existing prototype installation, the repository Docker wrapper and host Chrome/Bun. Docker serving/replay and Chrome startup needed sandbox escalation; those actions succeeded. Only my port-5181 dev process, Chrome CDP port 9241 and disposable driver port 9242 were used. Chrome/driver were stopped and the dev session exited 130 after Ctrl-C. No other tester server was stopped, and no application source, protected document, shared test or configuration was edited. No unresolved execution blocker remains.

This evidence can establish actual AI-selected UI inputs, visible previews, explainable numerical decisions and reproducible outcomes on the embedded revision. It cannot measure human enjoyment, preference, hesitation time, visual attention, accessibility, or whether an unbriefed person learns these rules. Body-text extraction and exact arithmetic favor this agent's strengths, and my intentional Compact constraint is artificial. Only two presets were played, with one run of wounded Ugallu; neither defensive ability was committed. No boss, independent-link system, fair Apex/Shadow reference, or production-combat comparison was tested. These AI attempts do not meet the documented human-playtest gate and do not authorize opening it.
