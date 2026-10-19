# Human-test protocol — POC 002 — template

**Template only. Not executed. No human test of POC 002 has taken place, and nothing in this document is an observation.** Copy the session report part to a new dated file for each session, such as `docs/playtests/<yyyy-mm-dd>-poc-002-human-test.md`. Do not fill in this file.

**Authority.** This document is checkpoint Q10 of the [POC 002 plan](../plans/2026-10-19-db0bad72-poc-002-component-combat.md#q10--human-test-protocol-template). It tests the hypotheses, falsifiers and acceptance questions of the [POC 002 brief](../prototypes/poc-002-component-combat.md). The [numerical specification v1](../prototypes/poc-002-component-combat.md#numerical-specification-v1) is the only rules source; this protocol adds no rule and no tuning. The structure follows the [playtest template](TEMPLATE.md).

**Commands.** Commands written as `just poc-002-*` are **proposed**: they will exist only after their plan checkpoints merge (Q01 for the build and preview commands, Q03 for replay, Q08 for record export in the UI). Check `just --list` before the session.

## What the session tests

The first external test is diagnostic. It checks whether the decisions the brief predicts appear in play and can be explained. It does not measure audience preference. Each observation in the session report is tagged with one of these hypotheses or acceptance questions:

| Tag | Brief hypothesis or question | Observe | Human falsifier (from the brief) |
| --- | --- | --- | --- |
| H1 | Component targeting competes with killing and with poison | First target per fight; whether openings change between attempts and encounters | The tester repeats one identical opening after learning, across encounters |
| H2 | Each Brood plays differently | Actions chosen in the three solo Guard fights; the tester's description of each kit | The tester cannot describe a kit difference |
| H3 | Revelation is a real cost with a real reward | Use of Revelation skills near a crossing; the tester's account of each transformation | The tester cannot say whether a transformation was their own doing |
| H4 | Declared intents make enemy consequences predictable | Predictions before commits against the actual result; Guard and Hold use against declared intents | The tester cannot say why a target was invalid or why an enemy still acted; ignores intents when choosing Guard or Hold |
| H5 | Attrition creates continue-or-retry decisions | The choice after a Brood dies in a gauntlet: continue, or reset | The tester restarts after a death rather than continue |
| H6 | Component selection is usable at 1280×720 | Selection errors on small parts (tongue, hand), list against illustration use, keyboard use | Small parts are mis-selected |
| Q1–Q5 | The brief's [acceptance questions](../prototypes/poc-002-component-combat.md#acceptance-questions-for-the-first-human-test) | Answered from the H1–H6 evidence and the debrief | — |

This protocol **reports counts** (for example "3 of 5 testers") with the supporting observations. It sets no pass or fail threshold. Deciding whether a hypothesis is falsified, and any change to the provisional decisions P1–P4 of [ADR-0007](../adr/0007-poc-002-component-combat.md), belongs to the Coordinator and the user.

## Before the session

### Build and conditions

- Build from one committed revision of the POC 002 integration branch, with no uncommitted changes. Record the full SHA. Exported records embed it as `buildRevision`; a record showing `unknown` means the build was dirty, and quantitative claims from it cannot be trusted.
- Record the rules version and content version shown in an exported record (v1: `poc-002-rules-v1`, `poc-002-content-v1`).
- Use **no overrides**: no edited content, no environment variables, no debug start states. Run the proposed `just poc-002-build` then `just poc-002-preview`, bare, and open the printed URL.
- Display: a browser window at least 1280×720 logical pixels, mouse and keyboard available. Record the browser and window size.
- Audio: on by default. Record whether the tester muted it.
- Facilitator copy of the brief's [Brood](../prototypes/poc-002-component-combat.md#6-the-brood) and [enemy](../prototypes/poc-002-component-combat.md#8-enemies) tables, used only to check observations, not to coach.

### Testers

- Four to six external testers: people who did not design, build or review POC 002. Record prior familiarity with POC 001, with turn-based tactics games, and with Darkest Dungeon or Fear & Hunger, each as none, some or much.
- One tester at a time, with one facilitator and an optional note-taker.

### Consent and anonymity

- Before starting, explain: what the session is (a prototype test, not an assessment of the tester), what is recorded (exported game records, written notes and, only if agreed, audio or screen recording), where it is stored and who can read it. Obtain consent, and record only that it was given: yes or no, and for which recordings.
- Testers may stop at any time without giving a reason, and may ask for their records and notes to be deleted.
- Use pseudonymous identifiers (T1, T2, …) everywhere. Do not record names, contact details, ages or other identifying information in the repository, the session report, record filenames or quotations.
- Quote testers only from words actually recorded at the time. Paraphrases are marked as paraphrases.
- Screen or audio recordings, if agreed, are kept outside the repository and deleted after the session report is written, unless the tester agreed otherwise.

## Session order

Allow about 60–75 minutes per tester. All fights start from the `fresh` preset.

| Step | Mode | Party | Encounter | Notes |
| --- | --- | --- | --- | --- |
| 0 | Briefing | — | — | Read the briefing script below; 5 minutes |
| 1a–1c | Selection screen | Ugallu, then Girtablilu, then Anzû, each solo | `guard` | Rotate the Brood order across testers (see below). One attempt each; a lost fight is not replayed here |
| 2 | Gauntlet | Ugallu + Girtablilu + Anzû | `gauntlet-v1` | Play to the end of the run, victory or defeat |
| 3 | Gauntlet | A duo of the tester's choice | `gauntlet-v1` | Record which duo and the stated reason |
| 4 | Optional retry | The tester's choice | The tester's choice | Only if time remains; record what the tester wants to try differently |
| 5 | Debrief | — | — | Questions below |

Solo order rotation, by tester: T1 U-G-A, T2 G-A-U, T3 A-U-G, T4 U-A-G, T5 G-U-A, T6 A-G-U.

### Briefing script

Read aloud, without additions:

> This is an early combat prototype. Every number in it is visible on screen. Enemies show what they will do before you act. There are no wrong answers; we are testing the game, not you. Please think aloud when you can. I may sometimes ask you to tell me what you expect to happen before you confirm an action. I can explain controls, but I won't give advice on tactics.

The facilitator may answer questions about controls and about where information is displayed. The facilitator does not explain rules beyond what is on screen, suggest targets, or confirm whether a plan is good. Every intervention is recorded.

### Prediction prompts

Ask before the tester confirms, and write down the answer before the action resolves. Ask only at these moments, so that prompting does not dominate play:

1. The **first action of every fight**: "What do you expect this to change?"
2. Before **End Phase in round 1 of every fight** and in the **first two Warden rounds**: "What will the enemies do this phase, to whom, and roughly how much?"
3. When a Brood's Revelation is **within one gain of its cap** and the tester is about to act with it or end the phase: "Will anyone transform? Which kind, and why?"
4. When the tester **chooses an invalid target** or an intent is **cancelled, skipped or redirected**: "Why did that happen?" Ask after it happens; this records an explanation, not a prediction.
5. Right after **a Brood dies in a gauntlet**: "What will you do now: continue or start again? Why?"

Then record the actual result from the screen or the event log next to the prediction.

### Record export

- Export the record after **every attempt**: each solo fight, each gauntlet run, and any retry, including an attempt that ended in defeat. Use the in-game export (proposed, plan Q08).
- If the tester resets before the attempt ends, export first if the build allows it, and note the reset. If the build cannot export an unfinished attempt, note that the record is missing.
- Name files `<session-date>-T<n>-<step>-<mode>-<encounter-or-gauntlet>.json`, for example `2026-11-02-T3-1b-fight-guard.json`. Store them with the session's durable task report (for example `docs/mailbox/<task>/records/`), not in this directory.
- After the session, replay each record with the proposed `just poc-002-replay <file>`. Record the exit code and outcome. Any claim about an attempt whose record does not replay is marked untrusted.

## Debrief questions

Ask in this order; record answers verbatim where possible:

1. Describe what each of the three Brood is good at. (H2)
2. In the gauntlet, how did you choose your first target in each fight? Would you choose differently now? (H1, Q2)
3. Did anyone transform? What caused it, and was it good or bad for you? (H3, Q3)
4. Was there a moment when an enemy did something you didn't expect? What was it? (H4, Q1)
5. When one of your Brood died, why did you continue, or why did you start again? (H5, Q4)
6. Was anything hard to select or to read? (H6, Q5)
7. Would you play this encounter again, and what would you try differently? (Replay question)

## Facilitator checklist

- [ ] Clean build at one recorded SHA; no overrides; proposed commands confirmed to exist
- [ ] Consent recorded; pseudonym assigned
- [ ] Solo order taken from the rotation
- [ ] Prediction prompts asked only at the listed moments
- [ ] Every intervention noted
- [ ] A record exported (or noted missing) for every attempt
- [ ] Every record replayed, with its result noted
- [ ] Session report written within a day; recordings deleted as agreed

---

## Session report (copy from here into a new file)

# Playtest — POC 002 — <yyyy-mm-dd> — T<n>

**Human test of POC 002, executed with this protocol: [human-test protocol](poc-002-human-test-protocol.md).** Fill in only what was observed.

## Build and conditions

- Prototype: POC 002 component combat
- Commit SHA:
- Rules version / content version:
- Encounter and starting conditions: solo `guard` ×3 (fresh, order: ), trio `gauntlet-v1`, duo `gauntlet-v1` (duo: ), retry:
- Rules/configuration overrides: none (state any deviation)
- Browser, window size, audio muted (yes/no):
- Player identifier (pseudonym only): T<n>
- Prior familiarity (none / some / much): POC 001: · turn-based tactics: · Darkest Dungeon or Fear & Hunger:
- Consent: given (yes/no); recordings agreed:
- Facilitator interventions (count and summary):

## Hypothesis

This session tests the brief's hypotheses H1–H6 and acceptance questions Q1–Q5 (see the protocol's [tag table](poc-002-human-test-protocol.md#what-the-session-tests)).

## Observations

One row per prompted moment or notable event. Observation columns record only what happened on screen or was said. Interpretation goes in its own column.

| Step | Round | Tag | Prompt or event | Tester prediction or statement (as recorded) | Actual result (screen or event log) | Interpretation (observer) |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

First targets per fight (H1):

| Step | Encounter | First action(s) | Different from the tester's previous attempt? |
| --- | --- | --- | --- |
| | | | |

Gauntlet deaths and choices (H5):

| Step | Fight | Brood died (round) | Continued or reset | Reason given |
| --- | --- | --- | --- | --- |
| | | | | |

Selection errors (H6): part intended → part selected, input used (list, illustration, keyboard):

## Player explanation

Debrief answers 1–7, in order. Quote only words actually recorded, and mark paraphrases.

## Readability and defects

Did previews match resolution? Was any marker, number or intent unclear? List defects found, the attempt affected, and whether that attempt's evidence can be trusted.

| Record file | Replay exit code / outcome | Trusted? |
| --- | --- | --- |
| | | |

## Outcome

Report counts; do not declare a hypothesis falsified (the protocol's [scope](poc-002-human-test-protocol.md#what-the-session-tests)).

| Tag | Falsifier observed in this session? (yes / no / not observable) | Supporting rows |
| --- | --- | --- |
| H1 | | |
| H2 | | |
| H3 | | |
| H4 | | |
| H5 | | |
| H6 | | |

- Evidence supporting the hypotheses:
- Evidence against them:
- Unresolved questions:
- Next change to test (a proposal, not a decision):

## Replay question

Would the tester play this encounter again, and what would they try differently?
