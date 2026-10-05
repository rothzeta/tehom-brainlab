# Play and restart the ordinary patrol through the browser interface

## Status and authority

**P10. Implemented, independently reviewed (R1/R2 fixed and re-reviewed; no remaining findings), accepted, locally delivered.** [Implementation](../mailbox/p10-playable-patrol/implementer.md); [fix evidence](../mailbox/p10-playable-patrol/fix.md); [independent review](../mailbox/p10-playable-patrol/reviewer.md). Depends on [P04](2026-10-02-9d81c6df-poc-001-formation-lab.md), [P08](2026-10-02-dc6612ec-poc-001-patrol-round-loop.md), and [P09](2026-10-02-d28ae958-poc-001-preview-equivalence.md). Baseline: `79f9498051df0281e6e9d3c904e9eee32f014873`.

Authority: [brief Presentation requirements, Round structure, and Ordinary patrol](../../docs/prototypes/poc-001-linked-formation.md), plus [prototype rendering boundary](../../poc-001-linked-formation/README.md). Interface choices below are proposals; they do not change the six abilities or action economics. See the [index](README.md) for formatting authority.

**Amended 2026-10-04 (two-ring board):** see the TR note under Proposed implementation.

**Amended 2026-10-05 (enemies on tiles, bugs B1/B3):** see the RF note under Proposed implementation. Not yet implemented.

Delivery sequence: [P01–P12 index](README.md). Governing format: [ADR-0002](../adr/0002-plan-filenames.md) and [ADR-0003](../adr/0003-implementation-plan-writing.md).

Task `P10` owner and integration owner: POC 001 implementer, currently unassigned. This plan is one standalone task; its sequential checkpoints inherit the prerequisites, affected components, acceptance criteria, verification, and hand-back defined here. Checkpoint identifiers remain stable on edits. The Coordinator records actual execution in [TASK_LOGS](../TASK_LOGS.md) from the implementer's mailbox handoff; no execution evidence exists yet.

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

*Amendment CT (2026-10-04):* Compact now places Pazuzu on ring 2 ([P02 amendment](2026-10-02-2e228a2b-poc-001-formation-algebra.md#amendment-ct-2026-10-04--compact-triangle)). P08's proposed enemy anchors are ring-1 cells, for example Harrier `(1,0)`, which is adjacent to Compact orientation-zero Pazuzu `(1,1)`. Brood and enemy tokens must remain separately readable and selectable. Telegraphs over ring-2 cells must be visible, since P05 masks now include them.

*Amendment TR (2026-10-04, two-ring board):* this supersedes the CT note's cells. On the [19-cell board](2026-10-02-2e228a2b-poc-001-formation-algebra.md#amendment-tr-2026-10-04--two-ring-board), Compact Pazuzu is on ring 1, and P08's former ring-1 enemy cells collide with it (Harrier `(1,0)` is Compact orientation-zero Pazuzu). Per the [P08 amendment](2026-10-02-dc6612ec-poc-001-patrol-round-loop.md#amendment-tr-2026-10-04--two-ring-board), enemies share the centre `(0,0)` as a view-only anchor (accepted user decision, 2026-10-04). Render them as a compact labelled cluster centred there, using view-only pixel offsets. Keep them separately readable and selectable from each other and from an adjacent ring-1 Pazuzu; the browser check should assert pointer hit-tests for every enemy and Brood token. Telegraphs now cover ring-1 and ring-2 cells (P05's six-cell fronts) and must be visible on both. Encounter layout stays an open experiment question; this is presentation, not a placement rule.

*Amendment RF (2026-10-05, enemies on tiles; supersedes the TR note's centre cluster):* by user decision ([brief Decision record](../../docs/prototypes/poc-001-linked-formation.md#decision-record)) enemies stand on real tiles. Execution: [Ring formation task](2026-10-05-c6399cb6-poc-001-ring-formation.md).

- Draw each enemy token on its own cell (P08 RF: Warder `(1,-2)`, Censer `(-2,1)`, Harrier `(1,1)`), using the same projection as the Brood. Remove the cluster offsets and the `PATROL_VIEW_ANCHOR` import.
- Show each living enemy's facing with a mark from its tile toward the adjacent cell on its front's bisector, `cell + S[(facing+1) mod 6]`.
- Tint front cells only for enemies whose front has a rule effect (protection sources; area sources, if any), using P05 `frontCells`. The current code tints `frontMask(facing)` around the centre for every enemy, which would now be wrong.
- Show reach in text: each intention line lists the Brood currently in that enemy's reach. Every preview with a forecast lists the next round's marks ("Next marks if you end now: …"), read from the forecast state.
- Keep Brood and enemy tokens separately readable and pointer-selectable. Enemy tiles neighbour Brood cells in both shapes.
- The legend explains the front tint, the facing mark and reach.
- **B1** (scout-2 D1, scout-3): after a preset change plus Restart, the actor buttons kept the previous preset's HP until a Brood was selected. At BASE the controls cache key is `[revision, locked, actor, ability]`, which is identical across a reset at revision 0; this is a probable cause, for the implementer to confirm. Contract: after any reset, every actor button shows the fresh state's HP before any input.
- **B3** (scout-3): End phase always reported "Unused actions forfeited". Contract: the feedback mentions forfeiture only when at least one living Brood had not acted, and then states how many actions were forfeited.

Additional acceptance evidence: enemy tokens sit on their core cells in every preset; pointer hit-tests resolve every enemy and Brood token in Compact and Spread; screenshots show Compact, Spread and enemies on tiles for each preset; the B1/B3 regressions fail at BASE and pass after the fix.

## Implementation checkpoints

1. **P10.C1** — Add playable-patrol mode and preset selection using the existing factories.
2. **P10.C2** — Wire ability/target selection, previews, confirmation, maneuvers, and end phase through the session controller.
3. **P10.C3** — Add outcome/reset behavior and view-only action feedback with cancellation guards.
4. **P10.C4** — Add browser smoke/regression cases using real controls rather than directly dispatching commands from tests.
5. **P10.C5** — Review readability in both emblem and placeholder modes and capture actual screenshots.

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

Return exact executed commands, results, acceptance evidence, and limitations in the implementer's [mailbox](../mailbox/README.md) handoff; the Coordinator then records them in [TASK_LOGS](../TASK_LOGS.md), links that entry here, and updates [CURRENT](../CURRENT.md) when implementation facts change. The commands below remain proposed until their prerequisites supply them.

Run `just poc-001-typecheck`, `just poc-001-test`, `just poc-001-test-browser`, and `just poc-001-build`. Run browser tests against the actual built or served application using a documented command/setup. Record viewport/browser, tested commit, trace IDs, screenshots, and console/network failures. If the browser environment cannot run, report that check as blocked rather than equating unit tests with UI verification. Hand back a playable patrol, not claims about fun.

## Non-goals and stop conditions

No boss, mobile support, polished animation, audio pass, onboarding narrative, deployment service, accessibility certification, or strategic recommendation system. Stop when the patrol is operable and truthful. Preview discrepancies, reset leakage, or mandatory useless turns are blockers for human playtesting; do not hide them with visual polish.
