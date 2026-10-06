# Independent rotation and shape-change allowances

## Status and authority

**P13. Accepted for implementation; not implemented.** Written 2026-10-06 as a draft by an external design review (draft PR #1, commit `71cc26c`), then checked against source and made executable by the Architect on 2026-10-06 ([design report](../mailbox/boss-experiments/architect.md)). Sequence: [plan index](README.md#boss-experiments-p13p17). Format: [ADR-0002](../adr/0002-plan-filenames.md), [ADR-0003](../adr/0003-implementation-plan-writing.md). Testing: [ADR-0006](../adr/0006-contract-invariants-and-black-box-testing.md).

Authority: the user's decisions of 2026-10-06, recorded in the [brief's Decision record](../prototypes/poc-001-linked-formation.md#decision-record):

- P13–P17 are the roadmap, and all of them are built before the user's next manual round.
- Rotation and changing shape are no longer mutually exclusive. One rotation and one shape change per player phase, both refreshing every round, is a **provisional default** to implement as written.

Standing direction still applies: the Brood never walk individually, and only the shared maneuvers move them.

Task `P13`. Owner: a POC 001 Implementer, who also owns local integration unless the Coordinator assigns otherwise. Prerequisites: delivered P03, P04, P08–P11 and RF. Durable report: `docs/mailbox/p13-split-maneuver-budgets/implementer.md`.

## Smallest useful outcome

In the playable patrol and the formation lab, the player may rotate once and expand or contract once in the same player phase. Either may come first, and Brood actions may come before, between or after them.

A result fails acceptance if it:

- only enables both buttons while the command layer still has one shared allowance;
- keeps `maneuverUsed` as a second authority beside the new flags;
- infers either allowance from the current shape or orientation;
- changes formation geometry, Brood actions or any numeric tuning;
- edits a test outside the enumerated exception, or freezes provisional tuning in a new assertion.

## Starting source and ownership

Inspected at `71cc26c` (prototype source identical to the RF delivery `70b6ede`), within `poc-001-linked-formation/`:

| File | Current behaviour | Change |
|---|---|---|
| `src/core/state.ts` | `GameState.maneuverUsed: boolean`; `createInitialState` sets `false` | Replace it with `rotationUsed: boolean` and `shapeChangeUsed: boolean`, both `false` initially |
| `src/core/transition.ts` | `applyCommand` rejects any maneuver once `maneuverUsed`; success sets `maneuverUsed: true`. `accountActorAction` copies `maneuverUsed` from the input | Check and spend only the command's category; `accountActorAction` preserves both flags |
| `src/core/rounds.ts` | `endPatrolPhase` resets `maneuverUsed: false` for the next round | Reset both flags |
| `src/core/run-record.ts` | State validator requires the exact field `maneuverUsed`; `RUN_RULES_VERSION` `poc-001-rules-v2/patrol-v2/p07-v1` | Require both booleans instead; core segment becomes `poc-001-rules-v3` |
| `src/view/lab-state.ts`, `src/view/FormationLab.ts` | Lab readout "Shared maneuver remaining: 1" / "Maneuver used…"; root `data-maneuver-used` | Show each category's state; expose `data-rotation-used` and `data-shape-change-used` |
| `src/view/CombatScene.ts` | Heading "Shared maneuver"; `#allowance` "One shared maneuver available" / "Shared maneuver used for this round" | Heading "Maneuvers"; `#allowance` states rotation and shape change separately |
| `README.md` (prototype) | P03, P04, P07, P08, P10 and P11 sections describe one shared allowance | Update those sections |
| Tests | See [Required test updates](#required-test-updates-explicit-exception) | Exactly as enumerated |

`src/core/commands.ts` keeps its error codes: a second use of a spent category returns the existing `maneuver-used`. `src/core/preview.ts` needs no change, because previews run the real transition.

Unchanged and protected: `src/core/{hex,formation,sectors,intents,damage,lifecycle,abilities,preview,commands,smoke}.ts`, `src/content/`, `src/view/{patrol-session,projection}.ts`, `src/main.ts`, `scripts/`, `bin/`, `package.json`, `bun.lock`, `vite.config.ts`, `vitest.config.ts`, root `justfile`, `assets/`, `docs/` outside this task's own mailbox report. If one of these must change, stop and report why.

## Fixture and inputs

Use the existing healthy patrol, all twelve labelled formations, and these hand-written phases: fresh; two Brood already acted; one category spent; both spent; stale revision; victory and defeat. Reuse the existing buttons and tokens.

## Contracts and decisions

### Required contracts

- A maneuver has a category: `clockwise` and `anticlockwise` are **rotation**; `expand` and `contract` are **shape change**.
- A successful maneuver spends only its own category, publishes one revision and one `maneuver-applied` event, and leaves actor budgets unchanged.
- A rejected maneuver leaves state, events and both allowances unchanged. Rejection order is unchanged: `stale-revision`, `wrong-phase`, then `maneuver-used` if the command's own category is spent, then `same-shape`.
- An ability action never spends or restores either allowance.
- Only the next player phase restores both allowances, exactly once, including after an early End phase. Terminal states keep their flags and expose no executable maneuver.
- Holding either allowance is legal; unused allowances are not banked.
- Geometry still changes only through the four existing maneuver commands.

### Settled choices (user, 2026-10-06)

Both categories are available in the same phase. No player walking.

### Provisional defaults (implement as written)

One rotation (either direction) and one shape change per player phase, with no banking, cooldown or action cost. Expand, attack, contract in one phase stays impossible, because the second shape change is rejected. Every-round refresh may make evasion easy. Record that in the manual round; do not add cooldowns or restore the shared rule to prevent it.

### Proposed implementation (Architect)

- Two booleans, `rotationUsed` and `shapeChangeUsed`, are the smallest explicit representation. Both are serialized state.
- Keep the error code `maneuver-used` for a spent category, so existing rejection consumers and disabled-reason labels still apply. The `#allowance` text names which category is spent.
- No new event type.

### Record compatibility (decision)

- The serialized state changes, so bump `RUN_RULES_VERSION` to `poc-001-rules-v3/patrol-v2/p07-v1` by changing only the core segment. `RECORD_VERSION` stays `1`: the envelope fields are unchanged, and the rules version identifies state semantics, as in [P11 Amendment RF](2026-10-02-825a6700-poc-001-reproducible-playtests.md#amendment-rf-2026-10-05--rules-version-and-enemy-cells).
- **Old records are rejected, not migrated.** A `poc-001-rules-v2/…` record, including any export from the user's RF manual round, fails with the existing `unsupported rules version: …` error before any command replays. It stays replayable at its embedded build revision.
- `PATROL_VERSION` stays `patrol-v2`; patrol content is unchanged.

## Implementation checkpoints

1. **P13.C1 — Map consumers.** Confirm the consumer list above against the target branch. Report any additional `maneuverUsed` consumer before editing.
2. **P13.C2 — Core accounting.** State, transition, round reset and record validator/version. Apply test edits C1–C9, A1, D1, P1, V1 and R1, add new budget tests, then run `just poc-001-test` and `just poc-001-typecheck`.
3. **P13.C3 — Views.** Update the lab and combat allowance readouts and data attributes, and apply browser edits BL1–BL5 and BP1. Build, run the browser suite, then capture and inspect the screenshots listed under Verification.
4. **P13.C4 — Contracts and full verification.** Update the prototype README sections, export one attempt that uses both categories in one phase, replay it, and run every verification command bare at one candidate revision.

## Required test updates (explicit exception)

The assignment must grant an exception permitting exactly these edits to existing tests. Each is required because the assertion encodes the single shared allowance or the old rules-version literal. Each edit must keep or strengthen the coverage it replaces. New tests and new assertions are always allowed, subject to criterion 9.

**Mechanical rule M.** Where a fixture sets `maneuverUsed: X`, set `rotationUsed: X, shapeChangeUsed: X`. Where an assertion reads `maneuverUsed`, assert both flags with the values the test's own commands imply: both `false` after no maneuver; after one rotation `rotationUsed: true, shapeChangeUsed: false`; after one shape change the reverse; `toBe(current.maneuverUsed)` becomes equality of both flags with `current`. Line numbers are at `71cc26c`.

- **C1** `tests/commands.test.ts:45`, `:68`: the expected state sets only the category flag of the tested maneuver.
- **C2** `tests/commands.test.ts:76–82` (AC2): after the first `clockwise`, `expand` is now legal. Rewrite as: a second rotation (either direction) is rejected `maneuver-used` without mutation; `expand` is accepted and spends only `shapeChangeUsed`; then `contract` and `expand` are rejected `maneuver-used`. Keep the stale-replay rejection and the serialized-input check.
- **C3** `tests/commands.test.ts:111`, `:154`, `:172`, `:236`, `:242`, `:255`: rule M.
- **A1** `tests/abilities.test.ts:90`, `:141`, `:200`, `:219`, `:257`, `:311`, `:353`, `:362`, `:381`: rule M (`:362` follows one `clockwise`).
- **D1** `tests/damage.test.ts:65`, `:139`, `:231`, `:237`, `:307`: rule M.
- **P1** `tests/patrol.test.ts:62`, `:145`, `:191`, `:193`, `:231`, `:233`: rule M. `:239` (a second `clockwise` is `maneuver-used`) stays unchanged.
- **V1** `tests/preview.test.ts:94`: rule M (both spent).
- **W1** `tests/view.test.ts:39–45`: assert the committed category flag. In the second-maneuver loop, a maneuver of the same category is rejected `maneuver-used` without mutation. A maneuver of the other category gives the result of `applyCommand` on the committed state (accepted, or `same-shape`). Restore the lab before each accepted probe.
- **R1** `tests/rf-contracts.test.ts:121–136`: replace the literal with `` `poc-001-rules-v3/${PATROL_VERSION}/${BROOD_RULES_VERSION}` ``, so later kit versions do not edit this line. In the loop, test the flag of the next maneuver's category instead of `maneuverUsed`; then `expand` and `clockwise` share one phase, so append one `endPhase` afterwards to keep a round boundary in the replayed record. Keep the `poc-001-rules-v1` rejection and add a `poc-001-rules-v2/patrol-v2/p07-v1` rejection.
- **BL1** `tests/browser-lab.mjs:69`: the snapshot reads `rotationUsed` and `shapeChangeUsed` from the new data attributes instead of `used`.
- **BL2** `:93`, `:105`, `:152`: both flags `false`.
- **BL3** `:112`, `:158–159`: after a rotation, `rotationUsed` is true and `shapeChangeUsed` false. The disabled count is the number of maneuvers `applyCommand` rejects on that state (3 at Compact: both rotations `maneuver-used`, `contract` `same-shape`), not a literal 4. The allowance text check names the spent rotation.
- **BL4** `:113`, `:160`: the "disabled second click changes nothing" probe clicks `anticlockwise` instead of `expand`. Add: `expand` after the rotation previews and commits to the Spread ghosts, after which every maneuver is disabled.
- **BL5** `:139`: compare both flags before and after the drag.
- **BP1** `tests/browser-patrol.mjs:341–343`: after `expand`, check that `contract` (not `clockwise`) reports `maneuver-used` and that the pointer click on it changes nothing; add that `clockwise` is enabled.

**Expected to pass unedited:** `tests/{formation,intents,run-record,patrol-session,rf-bugs,smoke,asset-copy}.test.ts`, `tests/browser-preview.mjs`, `tests/browser-run-record.mjs` (its second maneuver repeats the spent rotation), `tests/browser/*.ts`, and every assertion not listed above. If one fails, stop and report the assertion. Do not edit it.

## Acceptance criteria

1. In a fresh player phase, rotate then expand, and expand then rotate, both succeed with the expected labelled destination. Actor availability is unchanged and each command uses one revision.
2. A second rotation, or a second shape change, is rejected `maneuver-used` without mutation. Rejecting one category never spends the other.
3. A same-shape or stale maneuver spends nothing and emits no event.
4. Abilities can occur before, between and after the two maneuvers. The next player phase restores both allowances exactly once, including after an early End phase with unused actions. A terminal state exposes no executable maneuver.
5. Previews and commits agree on both flags. Lab and combat readouts show each category's state from live core state, without separate UI arithmetic.
6. A new exported attempt that uses both categories in one phase replays to the identical final state and events with `just poc-001-replay`. A `poc-001-rules-v2` record exits 1 with `unsupported rules version: poc-001-rules-v2/patrol-v2/p07-v1`.
7. `maneuverUsed` no longer exists in source, serialized state or the README.
8. The suites listed as expected to pass unedited pass unedited. Delivered P03 rejection precedence, P06 settlement and P07 legality are otherwise unchanged.
9. **Tuning is not frozen.** No new or edited assertion pins a provisional value: HP, damage, reductions, splash radius, Close threshold, enemy cells or facings, or the one-per-category cadence beyond what the controlled inputs require. Rule tests use explicit test-local inputs. The cadence is asserted as a contract for the controlled inputs ("a second same-category maneuver in one phase is rejected"), so changing it later means editing this plan and its tests together.
10. The prototype README describes the two allowances, the error code and the rules version.

## Verification and hand-back

Run from the repository root at one candidate revision, **bare**: no `POC001_CHROME`, `CHROME_PATH` or other override in the environment or on the command line.

- `just poc-001-test` (report file, test and assertion counts against BASE)
- `just poc-001-typecheck`
- `just poc-001-build`
- `just poc-001-test-browser` (report the Chrome binary the runner selected and why, plus assertion and exception counts)
- `just poc-001-replay <export>` for a new attempt using both categories, and for one `poc-001-rules-v2` record (expected exit 1)
- `git diff --check <BASE>..HEAD` and `git diff --exit-code <BASE>..HEAD --` over the protected paths

Screenshot inspection (open each one; keep the images outside the repository):

- the lab after one rotation, with the shape-change allowance still shown as available;
- the patrol after rotate plus expand in one phase, with both categories shown as used;
- the patrol at the start of round two, with both restored.

Return the durable report with a leading ruach-handoff block, validated with `bun .agents/skills/ruach-handoff/scripts/validate.ts <report> --repo <worktree>`. Include the tested revision, changed paths, exact commands and results, the edit list mapped to C1–BP1, the acceptance mapping and the screenshots inspected. Do not edit `docs/CURRENT.md`, `docs/TASK_LOGS.md`, ADRs or plan files.

## Review corrections to the draft (2026-10-06)

- The draft omitted `src/core/transition.ts`, which owns the check, the spend and the actor-accounting copy. It is now the main change.
- Decided: keep `maneuver-used` and `RECORD_VERSION` 1, and bump only the rules version's core segment.
- The draft's "fails visibly before any live-state replacement" assumed an import UI, which does not exist. Replay is the CLI; the criterion is now its explicit error.
- Added the enumerated test exception, the protected paths and the bare verification.

## Non-goals and stop conditions

Out of scope: cooldown experiments, extra movement, geometry changes, retuning, new abilities, and banking.

Stop and report before proceeding when:

- a consumer of `maneuverUsed` exists outside the mapped list;
- an expected-unedited suite fails;
- a forecast or replay mismatch appears (report it before any boss content);
- a protected path must change.

Effortless evasion is a finding for the manual round, not permission to restore the shared allowance.
