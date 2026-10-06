# A central two-phase boss with trustworthy radial and angular threats

## Status and authority

**P15. Accepted for implementation; not implemented.** Written 2026-10-06 as a draft by an external design review (draft PR #1, commit `71cc26c`), then checked against source and made executable by the Architect on 2026-10-06 ([design report](../mailbox/boss-experiments/architect.md)). Sequence: [plan index](README.md#boss-experiments-p13p17). Format: [ADR-0002](../adr/0002-plan-filenames.md), [ADR-0003](../adr/0003-implementation-plan-writing.md). Testing: [ADR-0006](../adr/0006-contract-invariants-and-black-box-testing.md).

Authority: the user's decisions of 2026-10-06 ([brief Decision record](../prototypes/poc-001-linked-formation.md#decision-record)):

- This encounter replaces the unimplemented [P12 directional boss](2026-10-02-a18d7fe6-poc-001-directional-boss.md), which is superseded.
- The user lifted the P11 boss gate by explicit decision. The historical P11 gate stays **HOLD**; it is not marked PASS.
- HP, damage, patterns, the phase threshold ("phase two starts at 50% boss HP, from the next declaration") and the names are **provisional defaults, implemented as written**.
- **Facing cadence (user decision, 2026-10-06, answering the Architect's Q1):** apply the lever. The facing advances only on beat-B (directional) declarations, so the safe orientation keeps shifting within a phase. This replaces the drafted one-step-per-announcement cadence.

Standing direction: the centre is reserved for a boss; the Brood never walk.

Task `P15`. Owner: a POC 001 Implementer, who also owns integration unless assigned otherwise. Prerequisites: delivered P13 and P14. Durable report: `docs/mailbox/p15-central-boss/implementer.md`.

## Smallest useful outcome

A separately selectable, playable encounter places one boss, the Crucible, on `(0,0)`. It changes its attack language in phase two, and ring choice and angle observably change who is hit. The patrol stays playable and unchanged.

A result fails acceptance if it:

- adds more HP or a new sprite to the patrol's marked-hit pattern;
- moves the boss, or adds a generic scripting system or second combat engine;
- changes patrol behaviour, events or records;
- edits an existing test (none are excepted; see below), or freezes provisional tuning in a new assertion.

## Starting source and ownership

Inspected at `71cc26c`, within `poc-001-linked-formation/`. Every source fact below was read from code:

| File | Current behaviour | Change |
|---|---|---|
| `src/core/transition.ts` | `endPhase` reaches `endPatrolPhase` only if the state has `patrolVersion` and `patrolRules`; other combat snapshots get `unsupported-command` | Dispatch `endPhase` through the encounter registry; non-encounter snapshots keep `unsupported-command` |
| `src/core/rounds.ts` | `endPatrolPhase` rejects more than one declaration per source and any source outside `PATROL_ORDER`, then resolves by `PATROL_ORDER` | Extract one shared end-phase skeleton (below); patrol keeps its validation, order, damage and announcement |
| new `src/core/encounters.ts` | — | An explicit registry keyed by encounter ID: factory and presets, state recognition, end phase, the rules the preview needs, and the record codec |
| new `src/content/crucible.ts` | — | `CRUCIBLE_VERSION = 'crucible-v1'`, HP, rules, pattern table, factory, announcement, `phaseTwoPending` |
| `src/core/preview.ts` | The forecast runs only for `patrol(state)`. Facts read `state.patrolRules` for splash radius and Close threshold | Use the registry for both. Exclude `boss-phase-changed` from `enemyEvents`, like `intentions-announced` |
| `src/core/run-record.ts` | Patrol-only: `fixtureId` is a patrol preset, `configuration` has `patrolRules`, the state validator demands `patrolVersion`/`patrolRules` | Choose the encounter codec by `rulesVersion`; the patrol codec is unchanged |
| `src/main.ts` | `?play=patrol` opens combat; anything else opens the lab | `?play=patrol` or `?play=crucible` opens combat for that encounter |
| `src/view/patrol-session.ts` | Fixed `createPatrol` factory and patrol preset | Encounter-aware factory and record; the patrol constructor and behaviour are unchanged |
| `src/view/CombatScene.ts` | Title "TEHOM — Patrol"; patrol-only presets; the protection line reads `enemies.find(id === 'warder')!`, which would crash with no Warder; token image path is `tokens/${entity id}.svg` | Per-encounter title, presets and links; protection line per protection source; emblem lookup through content; boss phase indicator; turnability labels |
| `README.md` (prototype) | No boss | A Crucible section; P08/P09/P10/P11 notes on the registry, forecast and records |

Unchanged and protected: `src/core/{hex,formation,sectors,intents,damage,lifecycle,abilities,state,commands,smoke}.ts`, `src/content/{patrol,brood}.ts` (patrol content and the kit), `src/view/{FormationLab,lab-state,projection}.ts`, `scripts/`, `bin/`, `package.json`, `bun.lock`, configs, `justfile`, `assets/`, `docs/` outside this task's report. If one must change, stop and report why.

## Fixture and inputs

Working name **the Crucible**. Entity ID `crucible`, displayed "Crucible", drawn with the existing `foundry-mechanism` emblem through a content emblem map. No new art.

| Item | Provisional default (as written) |
|---|---|
| Boss | HP 60, cell `(0,0)`, facing 0, rotatable (Crosswind may turn it), never mobile |
| Self-guard | Protection relation `crucible → crucible`, using the encounter's `damageRules.directionalReduction` (default 2) |
| Phase two | When the boss is living with `hp ≤ 30` (`phaseTwoAt`) at an announcement |
| Brood | The P08 Brood HP (`PATROL_HP`: Ugallu 18, Girtablilu 14, Pazuzu 14), imported, not copied; Compact orientation 0 |
| Presets | `phase-one` (fresh); `phase-two-diagnostic`: boss at `phaseTwoAt` HP, already in phase two, round 1, labelled "Phase two — diagnostic start", not a completed phase one |
| Splash radius, Close threshold | P05/P02 defaults, copied into `crucibleRules` at creation, like `patrolRules` |

Pattern: two declarations per announcement, primary (fixed area) before secondary (mark). Beats alternate A, B, A, B.

| Phase, beat | Primary | Secondary |
|---|---|---|
| 1 A | Inner pulse: all ring-1 cells (`RING_ONE`), 5, not turnable | Marked hit, 3 |
| 1 B | `sectorCells(f)`, 5, turnable | Marked hit, 3 |
| 2 A | Outer pulse: all ring-2 cells (`RING_TWO`), 5, not turnable | Marked splash, 2, radius 2 |
| 2 B | `sectorCells(f)` and `sectorCells((f+2)%6)`, 4, turnable | Marked hit, 3 |

- Marks pick the lowest living HP fraction at declaration, with roster-order ties. This is the Harrier's existing rule (exact integer cross products).
- **Facing (user decision, 2026-10-06):** the creation announcement uses facing 0. A beat-A announcement leaves the current facing unchanged. A beat-B announcement first advances the current facing (including any Crosswind turn) one clockwise step, then declares. Without Crosswind, beat-B facings in phase one are therefore 1, 2, 3, 4, 5, 0, … (announcements 2, 4, 6, …), and their parity alternates.
- **Beat:** it alternates each announcement and resets to A at phase entry.

## Contracts and decisions

### Required contracts

- The boss's cell never changes. Each declaration has one source, a unique event ID (`crucible:<round>:primary` and `crucible:<round>:secondary`) and ordered resolution: primary, then secondary.
- Fixed areas stay on their cells through maneuvers. Marks follow their creature. A fallen mark fizzles and is never retargeted. A fallen boss resolves nothing.
- Crosswind turns the boss's facing (which changes its self-guard front) and its turnable sector cells about `(0,0)`. Pulses and marks do not change.
- **Phase boundary:** an HP drop to `phaseTwoAt` or below during the player phase changes nothing until the next announcement. The current declarations resolve unchanged. At that announcement the boss enters phase two once, emits one `boss-phase-changed` event, resets the beat to A, and keeps its current facing; the next beat-B declaration advances it from there. There is no bonus turn, discarded attack, HP refill, damage cap or return to phase one. Death first means victory with no further attack.
- `phaseTwoPending(state)` (phase one, boss living, HP at or below `phaseTwoAt`) is one exported content selector, used by the announcement and by the view.
- Both P13 allowances and the P14 kit apply unchanged.
- Patrol behaviour, events, records and UI text stay identical.

### Encounter selection (decision)

- **Routes:** `?play=patrol` (unchanged) and `?play=crucible`; P17 adds `?play=collector`. Any other `play` value, or none, opens the formation lab, as today. `?placeholder=1` composes with each.
- The combat header links to the other encounters and to the lab, keeping `placeholder=1`. Switching encounter is a full navigation, so a scene's tokens never change set.
- The preset selector lists only the current encounter's presets. Restart recreates the same encounter and preset.
- The lab keeps its twelve fixtures and `?preview=patrol`. No new `?preview=` value is added: the lab renders no enemies, so boss previews live on the combat route.
- Browser tests reach diagnostic boss states through intercepted test pages under `tests/browser/`, as P10 does for the patrol, never through product routes.

### Proposed implementation (Architect)

- **State.** `CrucibleState` is `CombatState` plus `crucibleVersion`, `crucibleRules`, `bossPhase: 1 | 2`, and `beat`. `beat` is the beat of the current declarations. Resolution looks up damage by `(bossPhase, beat)` and the declaration's kind: fixed area is primary, a mark is secondary. `Intention` needs no damage field.
- **Shared end-phase skeleton** in `rounds.ts`, used by patrol and Crucible:
  1. Guards (revision, phase, version, rules, declarations), each delegated to the encounter.
  2. `enemy-phase-started`, then lifecycle.
  3. Resolve declarations in the encounter's order, stopping at a terminal outcome. Damage comes from the encounter.
  4. Shelter expiry, then `enemy-phase-ended`.
  5. If nonterminal: reset `actedIds` and both P13 flags, advance the round, announce, emit `round-started`, the encounter's announcement events (`boss-phase-changed`), then `intentions-announced`.
  6. One public revision.

  Patrol keeps `PATROL_ORDER` lookup and its existing checks. **The skeleton is acceptable only if every patrol suite passes unedited.**
- **Registry.** A plain object keyed by `'patrol' | 'crucible'`, consulted by `transition.ts`, `preview.ts`, `run-record.ts`, the session and the view. No plugin loading, no generic intention scripting.
- **View.** The protection line becomes one `· <Source> facing N` entry per protection source, so the patrol text stays exactly `· Warder facing N`. The `#intentions` list adds "turnable" or "not turnable" to fixed-area entries and keeps the existing "fixed cells" / "follows creature" words. The preview panel's `Threats:` line format is unchanged. A phase indicator shows "Phase 1", "Phase 2", or "Phase two begins at the next announcement" from `phaseTwoPending`.

### Record compatibility (decision)

- `RECORD_VERSION` stays `1`, and the envelope keys are unchanged. `rulesVersion` selects the encounter codec:
  - `poc-001-rules-v3/patrol-v2/p14-v1`: patrol, unchanged from P14, so P14 patrol records stay replayable;
  - `poc-001-rules-v3/crucible-v1/p14-v1`: Crucible, with `fixtureId` `phase-one` or `phase-two-diagnostic`, `configuration` `{ crucibleRules, abilityRules }`, and state fields `crucibleVersion`, `crucibleRules`, `bossPhase`, `beat`.
- Keep the `RUN_RULES_VERSION` export as the patrol string. Add the Crucible string beside it.
- `createRunRecord(initialState, fixtureId, buildRevision?, rules?)` keeps its signature and infers the encounter from the state.
- Unknown rules versions keep the existing `unsupported rules version: …` error. Nothing is migrated.

## Implementation checkpoints

1. **P15.C1 — Skeleton and registry.** Extract the shared end-phase skeleton, add the registry, and route `transition.ts` and `preview.ts` through it, with patrol only. Run the full unit suite. Every patrol, preview and record test passes unedited before any Crucible code.
2. **P15.C2 — Crucible headless.** Content, factory, announcement, phase boundary, end phase, records. New focused tests over all twelve formations and six facings, with explicit test-local rules.
3. **P15.C3 — Browser.** Route, header links, presets, title, emblem map, phase indicator, turnability labels, the per-source protection line. Intercepted fixtures for the threshold and kill cases. Build, run the browser suite, inspect screenshots.
4. **P15.C4 — Contracts and full verification.** README; export and replay a phase-crossing attempt and a phase-two-diagnostic attempt; run all verification bare at one candidate revision.

## Required test updates (explicit exception)

**None.** The encounter is additive. Every existing test file is expected to pass unedited, including `tests/patrol-session.test.ts` (the patrol constructor is unchanged), `tests/browser-patrol.mjs` (the patrol header, presets, intention text, `Threats:` line and `Warder facing` text are unchanged) and `tests/rf-contracts.test.ts` (the patrol rules version is unchanged in P15). If an existing test fails, stop and report the assertion and its cause. Do not edit it.

## Acceptance criteria

1. Across every legal player action, Crosswind and reset, the living boss stays at `(0,0)`. Crosswind turns its facing and turnable sectors but never its cell.
2. Over all twelve labelled formations, the inner pulse hits all three living Brood in Compact and none in Spread, and the outer pulse is the reverse. `sectorCells(f)` hits one Brood in formations whose orientation parity matches `f` and none otherwise; the `f, f+2` fork hits two or none by the same parity. Assert these as relations derived from the formation and pulse geometry (P02/P05 selectors), not as a copied table.
3. Crossing `phaseTwoAt` during the player phase keeps the current declarations, enters phase two at the next announcement with one `boss-phase-changed`, and changes the pattern once. Killing the boss instead ends combat with no further attack, and no phase event is emitted.
4. Both declarations resolve in order. Secondary marks, Shelter consumption and terminal interruption match the "If end phase now" forecast exactly. The forecast's `enemyEvents` excludes the next announcement and `boss-phase-changed`.
5. Each phase has a reachable mechanical trace using both maneuver categories in one round, and another using Shelter or Crosswind instead of only damage. These are traces, not human evidence.
6. The patrol still launches, plays, exports and replays unchanged. A Crucible reset creates clean state. Exported phase-crossing and phase-two-diagnostic attempts replay exactly with `just poc-001-replay`.
7. The browser distinguishes non-turnable pulses, turnable sectors, creature-following marks, and pending versus active phase, without depending on animation timing. `?play=crucible` and the header links work with and without `placeholder=1`. Unknown `play` values open the lab.
8. **Facing cadence (user decision).** A beat-A announcement leaves the facing unchanged; a beat-B announcement advances the current facing one clockwise step before declaring. Assert this as a relation from controlled starting facings: after a Crosswind in either direction, across phase entry, and from the phase-two diagnostic start. Do not assert absolute facings copied from a default run.
9. **Tuning is not frozen.** No new assertion pins a provisional value: 60, 30, 5, 4, 3, 2 or the beat table. Tests use explicit test-local rules or derive expectations from the encounter's own exported content. A content test may check that content exposes its documented values.
10. All existing suites pass unedited.

## Verification and hand-back

Run from the repository root at one candidate revision, **bare** (no `POC001_CHROME`, `CHROME_PATH` or other override):

- `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build`
- `just poc-001-test-browser` (report the selected Chrome binary and why)
- `just poc-001-replay` on a phase-crossing Crucible export, a phase-two-diagnostic export and a patrol export
- `git diff --check <BASE>..HEAD` and `git diff --exit-code <BASE>..HEAD --` over the protected paths

Screenshot inspection:

- Crucible start, with the inner pulse shown as not turnable and the mark;
- phase-one beat B sector, with the turnable label;
- the pending-phase indicator after a threshold-crossing hit;
- phase-two outer pulse and fork;
- the patrol start, unchanged;
- one placeholder-mode capture.

Durable report: as in [P13](2026-10-06-e8cec63d-poc-001-split-maneuver-budgets.md#verification-and-hand-back), plus the computed mask table, actual tuning, and both phases' captures. Record human observations separately.

## Balance hypotheses (computed; for the manual round)

Computed by the Architect with a disposable script over all 12 formations, 6 facings and phase entry at announcements 2–7, with the user's cadence (facing advances only on beat-B declarations). They describe the pattern as specified; they are not decisions.

- **X-H1 — Phase one no longer has a static answer.** Both shapes put one Brood in each of sectors `o`, `o+2`, `o+4`, so a single sector holds a Brood exactly when its parity matches the orientation. Beat-B facings are 1, 2, 3, 4, 5, 0, …, so their parity alternates, and every formation is hit by every other beat-B sector. No formation dodges all phase-one primaries (checked over 16 announcements). A player can still avoid every primary: Spread for the inner pulse, plus a rotation (or a Crosswind on the boss) before each beat-B attack after the first, so roughly every second round. From the Compact 0 start, 12 announcements need 1 shape change and 5 rotations. *(Before the user's decision, with one step per announcement, all beat-B facings were odd and Spread at an even orientation dodged the whole phase.)*
- **X-H2 — Phase two forces rotation too.** The outer pulse forces Compact. The fork (`f` and `f+2`) hits two Brood or none by parity, and its parity alternates with each beat-B declaration as in phase one. Whatever announcement phase two begins at (2–7 checked, plus the diagnostic start), no formation dodges every phase-two primary. Over a whole fight with phase two entered at announcements 3–6, zero primary damage takes 2 shape changes and 6–7 rotations in 14–17 rounds.
- **X-H2a — The split allowance is convenient, not required here.** In every case checked, a zero-damage path exists using only one maneuver category per round; the phase-entry Contract and the next rotation can fall in different rounds. Whether players use both in one round is a manual-round observation.
- **X-H3 — Phase two beat A trades pulse for splash.** In Compact the radius-2 splash hits all three Brood (2 each); in Spread the pulse hits all three (5 each). Compact is clearly better.
- **X-H4 — The self-guard always covers one Brood.** The front `frontCells((0,0), f)` holds exactly one Brood in every formation and facing (all 72 cases). Rotation or Crosswind chooses whose Claw, Sting or Impale is reduced; Gale bypasses. The guard front now changes only on beat-B declarations, so it holds for two rounds at a time.
- **X-H5 — Crosswind competes with rotation.** Turning the boss one step moves a declared sector or fork by one sector, flipping its parity. That dodges it for Pazuzu's action instead of a rotation, and it also shifts every later beat-B facing.

## Review corrections to the draft (2026-10-06)

- Computed X-H1/X-H2: with the drafted cadence, a static formation dodged every primary attack in each phase. **2026-10-06, user decision:** apply the lever (facing advances only on beat-B declarations). Recomputed: no formation now dodges everything in either phase.
- Added the consumers the draft missed, all of which would fail for a non-patrol encounter: the preview's patrol-only forecast and `patrolRules` facts, `transition.ts` dispatch on `patrolVersion`, the view's hard-coded `warder` lookup, and token images keyed by entity ID.
- Decided encounter selection (`?play=`), the record codec chosen by rules version with no envelope change, Brood HP owned by P08, and the role-by-kind damage lookup.
- The phase event is excluded from `enemyEvents`, so a forecast never reports next-round content as resolved damage.

## Non-goals and stop conditions

Out of scope: adds, enemy movement, arena changes, boss invulnerability, a third phase, new art, and patrol retuning.

Stop and report when:

- any existing test fails;
- the shared skeleton cannot preserve patrol events exactly (then keep patrol's end phase separate and report);
- a phase transition or replay invalidates a visible telegraph (stop before P16).

If every beat has one effortless universal answer in automated traces, record it as a design result. Do not silently restrict maneuvers.
