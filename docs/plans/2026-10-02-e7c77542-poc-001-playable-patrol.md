# Play and restart the ordinary patrol through the browser interface

## Status and authority

**P10. Draft; not implemented or verified.** Depends on [P04](2026-10-02-9d81c6df-poc-001-formation-lab.md), [P08](2026-10-02-dc6612ec-poc-001-patrol-round-loop.md), and [P09](2026-10-02-d28ae958-poc-001-preview-equivalence.md). Baseline: `79f9498051df0281e6e9d3c904e9eee32f014873`.

Authority: [brief Presentation requirements, Round structure, and Ordinary patrol](../../doc/prototypes/poc-001-linked-formation.md), plus [prototype rendering boundary](../../poc-001-linked-formation/README.md). Interface choices below are proposals; they do not change the six abilities or action economics. See the [index](README.md) for formatting authority.

## Smallest useful outcome

A person can choose any of the three patrol starts, inspect enemy intentions, select abilities and targets, maneuver, end phases, reach victory/defeat, and restart without a developer console. What they see matches core decisions.

## Starting source and ownership

Own proposed `src/view/CombatScene.ts`, a thin input/session controller, text controls/readouts, and browser tests under `tests/browser/`. Reuse P04 rendering/assets, P08 factories, and P09 projections. Add a prototype-local `test:browser` script and browser driver dependency if needed; Playwright is a proposed dev-only choice, not a new application framework. No root test infrastructure is required.

## Fixture and inputs

Use healthy, wounded-Ugallu, and wounded-Girtablilu patrol presets and the actual regression traces produced by P08. Test the 1280 by 800 desktop viewport, normal tokens, and placeholders. Include double clicks, a stale preview, reset while effects are playing, early end phase, and terminal-state input.

## Contracts and decisions

### Required contracts

Selecting a unit/ability/target changes only UI selection until confirmation. Every gameplay action goes through the core command boundary. Controls expose legal choices and a reason for unavailable choices. The displayed HP, action use, links, target marks, area masks, and conditional forecast come from the current core projection.

Input is serialized while a command's presentation is playing. Animation callbacks never apply damage or modify core state. Reset cancels old presentation work, clears previews and selection, and creates a fresh session; stale callbacks cannot alter the new screen or battle.

### Settled choices

One screen; individual attacks, shared rotate/expand/contract; no walking or translation. Enemy intents appear before player actions. Token art stays upright, facing is separate, and meaningful play remains possible with labelled shapes. No final art or audio is needed.

### Proposed implementation

Keep the authoritative state outside scene objects and let the view consume state plus ordered events. Use one command-at-a-time controller, a UI session-generation counter, and the P03 expected revision. Stop/cancel tweens on reset; discard completion callbacks belonging to an older generation.

Show actor HP/actions, selected ability and target, maneuver availability, numbered enemy resolution order, and labels distinguishing `follows creature` from `fixed cells`. Show `If end phase now` as conditional, not guaranteed damage after unspecified actions. Provide text-labelled controls, a visible credits entry, and `End phase (N actions unused)` without an obligatory confirmation modal. A terminal result disables combat controls and offers reset/preset selection. Simple instant effects or short token motions are sufficient.

The early lab-only configuration selector must be clearly separated from the playable patrol; it cannot change formation for free during a battle.

## Implementation checkpoints

1. Add playable-patrol mode and preset selection using the existing factories.
2. Wire ability/target selection, previews, confirmation, maneuvers, and end phase through the session controller.
3. Add outcome/reset behavior and view-only action feedback with cancellation guards.
4. Add browser smoke/regression cases using real controls rather than directly dispatching commands from tests.
5. Review readability in both emblem and placeholder modes and capture actual screenshots.

## Acceptance criteria

1. All three presets can be started and their initial HP/intentions match P08 without console intervention.
2. A user can complete a recorded winning and losing patrol trace using visible controls; final HP and outcome match the headless results.
3. Hover/focus previews and committed results match P09, including Shelter loss, protection changes, and fixed-area versus following marks.
4. A used action or maneuver is unavailable with a reason; invalid/double/stale input cannot consume extra resources or execute the same effect twice.
5. Ending with unused actions visibly forfeits them and resolves the announced enemy order before the next player phase.
6. Reset during a presentation sequence restores the selected preset completely; old callbacks do not change its units, labels, or previews.
7. Terminal battles reject further combat input, and restarting works in normal and placeholder modes with no application-origin unhandled errors.
8. The playable UI exposes no individual movement, free fixture teleport, or unplanned ability.

## Verification and hand-back

Run `npm run typecheck`, `npm run test:unit`, `npm run test:browser`, and `npm run build`. Run browser tests against the actual built or served application using a documented command/setup. Record viewport/browser, tested commit, trace IDs, screenshots, and console/network failures. If the browser environment cannot run, report that check as blocked rather than equating unit tests with UI verification. Hand back a playable patrol, not claims about fun.

## Non-goals and stop conditions

No boss, mobile support, polished animation, audio pass, onboarding narrative, deployment service, accessibility certification, or strategic recommendation system. Stop when the patrol is operable and truthful. Preview discrepancies, reset leakage, or mandatory useless turns are blockers for human playtesting; do not hide them with visual polish.
