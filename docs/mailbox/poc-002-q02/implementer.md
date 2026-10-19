task: P2-Q02
status: complete
outcome: Headless rules, previews, gauntlet carry-over, fight records and both seed parity witnesses implemented against Amendment A2
source_baseline: c108445fedf9ed6a3b909253d875ae08f67f14da
candidate_revision: 80b7f912bb0e374dbec3ec823a069afd04e6a9d3
tested_revision: 80b7f912bb0e374dbec3ec823a069afd04e6a9d3
destination_before: 49b442d7e4b51ae488a88845e55dba44dfb53d8b
merged_revision: caada9d5d8547bf48308c8a77982f97ece9b67fe
artifacts:
  - docs/mailbox/poc-002-q02/assignment-implementer.md
  - docs/mailbox/poc-002-q02/implementer.md
  - poc-002-component-combat/src/core/index.ts
  - poc-002-component-combat/tests/q02-core.test.ts
  - poc-002-component-combat/tests/q02-parity.test.ts
  - poc-002-component-combat/fixtures/parity/seed-girtablilu-guard.json
  - poc-002-component-combat/fixtures/parity/seed-ugallu-warden.json
verification:
  - "Bare install, typecheck, test and build: final exit 0; 6 test files, 138 tests, including 81 Q02 tests"
  - "Both seeds replay identical serialized events and final states; Girtablilu round 4 HP 6 Revelation 2; Ugallu round 18 HP 3 Revelation 4"
  - "Staged diff and baseline diff checks: exit 0; no protected-path changes after authorized merge"
  - "Copied ruach-handoff validator with --repo .: exit 0, ok true, all revisions resolved, no diagnostics"
review: not-run
discoveries:
  - "The prior S1 stop at 49b442d was resolved by brief Amendment A2 at 835a09c and the Coordinator-authorized merge"
  - "Consumers can import all CoreApi implementations from src/core/index.ts, or commands.ts, state.ts, preview.ts and record.ts individually"
  - "No additions or changes to Q01 public types or content values were necessary"
blockers: []

# Implementer handoff — P2-Q02

Author: Implementer. Branch `p2-q02`, worktree `/opt/dev/tehom-brainlab-p2-q02`.
Assignment: [unchanged Coordinator assignment](assignment-implementer.md), supplemented by the Coordinator's resume instruction authorizing one merge and adopting the amended brief.
Authority: [Q02 plan](../../plans/2026-10-19-db0bad72-poc-002-component-combat.md#q02--headless-rules-core), [brief §§1–13 and A2](../../prototypes/poc-002-component-combat.md#amendment-a2-2026-10-19-consistency-rulings), ADR-0006/ADR-0007. Read the merged Q01 and Q07 handoffs.

## Result and changed paths

Implemented deterministic, pure commands with atomic rejection, declarations and targeting, components and shielding, damage and mitigation, statuses, every Brood action and Salve, Revelation and all six forms, enemy phases and E1–E6, starts/encounters, gauntlet continuation and permanent deaths, legal actions, real-dispatch previews, and embedded-content fight records with parsing and replay. All rule numbers come from content. No runtime dependency, tuning, renderer or browser coupling was added.

Implementation commit: `80b7f912bb0e374dbec3ec823a069afd04e6a9d3`. Its ten added files are all within Q02 ownership:

- `poc-002-component-combat/src/core/engine.ts`: rules, factories, validation, dispatcher and legal actions.
- `poc-002-component-combat/src/core/commands.ts`: command API exports.
- `poc-002-component-combat/src/core/state.ts`: factory API exports.
- `poc-002-component-combat/src/core/preview.ts`: selected-command and end-phase previews, numeric deltas.
- `poc-002-component-combat/src/core/record.ts`: data-only record schema checks, invariant checks and replay.
- `poc-002-component-combat/src/core/index.ts`: public barrel including Q01 content/types.
- `poc-002-component-combat/tests/q02-core.test.ts`: 79 contract tests using content whose every numeric leaf is replaced before test configuration.
- `poc-002-component-combat/tests/q02-parity.test.ts`: two versioned seed replay tests.
- `poc-002-component-combat/fixtures/parity/seed-girtablilu-guard.json`.
- `poc-002-component-combat/fixtures/parity/seed-ugallu-warden.json`.

The final evidence commit overwrites only this report. The assignment remains unchanged, retained in Git from the earlier S1 evidence commit; SHA-256 `abb181195712adaf034abc1eed4d02d50fd578a9e7b0bffa26f086a7ff195476`.

No edits to `src/core/types.ts`, `src/core/content.ts` or content JSON. Public-contract optional-field additions: **none**. Content-value corrections: **none**. No POC 001, shared, assets, root justfile, prototype README, protected documents or other checkpoint paths were edited by Q02. The authorized merge brings their already-committed upstream changes; these are distinct from this checkpoint's implementation.

## S1 history and authorized merge

The earlier report is preserved at `49b442d7e4b51ae488a88845e55dba44dfb53d8b:docs/mailbox/poc-002-q02/implementer.md`. It stopped before implementation because §3.4 and E02 disagreed about poison victory preceding E2. The Architect resolved this in Amendment A2, commit `835a09c74da7ce94f1458e08ee6e706ae9371bbb`. E1 and E2 now form one unit before E3, including defeat precedence. The new regression test `E02 retaliation wins at the intent unit; poison and E2 share one unit (A2-1)` verifies that poison killing the last enemy followed by E2 killing the last Brood produces defeat.

The Coordinator explicitly authorized one `git merge --no-ff poc-002-component-combat` into `p2-q02` and replacement of the earlier report. Source integration tip: `c108445fedf9ed6a3b909253d875ae08f67f14da`; destination before merge: `49b442d7e4b51ae488a88845e55dba44dfb53d8b`; merge result: `caada9d5d8547bf48308c8a77982f97ece9b67fe`. The merge succeeded without conflicts and included A2 and Q07. `source_baseline` above is the integration tip merged, per the resume instruction. No other merge, rebase or push was performed.

The initial sandbox merge attempt exited 128 before merging because the linked-worktree `ORIG_HEAD.lock` was outside the writable root. The exact same merge succeeded with metadata access. The first bare install exited 1 because Docker's socket was inaccessible inside the sandbox; the same bare command succeeded with socket access. No automatic approval rejection occurred and no environment override or alternate toolchain was used.

## Verification

All application checks ran from the worktree root exactly as shown, with no added environment variables. The final checks ran on working content committed unchanged as the implementation/tested revision. The later report commit does not modify implementation content.

| Exact command | Exit | Key output |
| --- | --- | --- |
| `./poc-002-component-combat/bin/run install` (sandbox attempt) | 1 | `Q01: Docker daemon inaccessible; check availability and socket permissions` |
| `./poc-002-component-combat/bin/run install` (Docker socket access) | 0 | `bun install v1.4.2`; `43 packages installed [742.00ms]` |
| `./poc-002-component-combat/bin/run typecheck` (final) | 0 | `$ tsc --noEmit` |
| `./poc-002-component-combat/bin/run test` (final) | 0 | `Test Files 6 passed (6)`; `Tests 138 passed (138)`; Q02: 79 contract tests plus 2 parity tests |
| `./poc-002-component-combat/bin/run build` | 0 | `Q01 assets: prepared 4 files in public/tehom`; `11 modules transformed`; `built in 515ms` |
| `git diff --cached --check` (before implementation commit) | 0 | No output |
| `git diff --check c108445..HEAD` (at implementation commit) | 0 | No output |
| `git diff --name-only caada9d..HEAD -- poc-001-linked-formation shared assets justfile docs/CURRENT.md docs/TASK_LOGS.md poc-002-component-combat/README.md poc-002-component-combat/content/combat-content.v1.json poc-002-component-combat/src/core/types.ts` | 0 | No output; these paths unchanged after merge |

Development checks also ran the same exact typecheck/test commands while completing coverage. Earlier typechecks exited 1 for a nullable lookup in record validation, then a test event-union narrowing, then an attempted compiler-API boundary checker (the pinned TypeScript 7 package exposes no JavaScript compiler API). Corrected the lookup/narrowing and implemented the dependency boundary check without that API or any new dependency. The first development test run exited 1 with 130 passed/2 failed: a test's nominal lethal physical hit was fully mitigated by its explicit armor/Ward, and the boundary checker matched a provenance comment. Corrected the test setup to use a lethal magical hit and excluded comments when scanning code. The next run exited 1 with 133 passed/1 failed due to the unavailable compiler API. Subsequent runs passed, and the final added ordering/repeated-crossing coverage raised the suite to 138 passing tests. No existing tests were changed or weakened.

Vitest does not print unit assertion totals; none is claimed. Build emits the existing informational Phaser chunk-size warning and exits 0. Browser tests and human playtests were not assigned or run; this is a headless checkpoint. No required check remains unrun.

Seed tests emit:

```text
seed-girtablilu-guard: commands=7 events=48 outcome=victory round=4 hp=6 revelation=2
seed-ugallu-warden: commands=35 events=146 outcome=victory round=18 hp=3 revelation=4
```

Both seed files embed v1 content and the complete initial state, accepted commands with ordered events, and final state. Generated through the public API using the brief's exact action lines. During generation, every round's HP/Revelation pair was checked against the tuning trace; both matched. The temporary generator was `/tmp/p2-q02-seeds.ts`. Committed parity tests compare serialized per-command events and serialized final state byte-for-byte, then run `replayRecord`. Expected tuning remains in the versioned fixtures; ordinary rule assertions use test-owned numbers.

## Numbered acceptance evidence

All test references below are in [q02-core.test.ts](../../../poc-002-component-combat/tests/q02-core.test.ts), except the explicit parity reference.

| Item | Evidence |
| --- | --- |
| 1 | `rejects in all ten precedence positions`, malformed-input cases and E37 assert full state equality, empty events and exact error codes; duplicate accepted commands are stale. Validation uses one shared path for dispatcher and legal actions (§2/A2-3). |
| 2 | E37 checks revision +1 and input purity; E47/E43 reject dead actors; E36 checks action forfeiture, the complete enemy/end-round transition and next declaration. |
| 3 | Declaration order asserted in E36; E01/E31 verify effects before cost before transformation/outcome; `intent damage → riders → retaliation → pending transformation → outcome is one unit` checks the intent order. `E1 poison precedes E2 loss, E4 statuses, E5 expiry, E6 ledger and next declaration` covers round ordering; E39 checks rolled/reset ledger. E02 explicitly covers A2-1 defeat after poison and E2. |
| 4 | E03/E04: bounded pool damage and selective cancellation; E13/E17: destruction and shielding; hand/limb destruction test: Ward/restraint release; E11/E16/E19/E41 and physical/magical attack test: Ward, armor and bypasses (§4). |
| 5 | E06/E08/E21/E22/E33/E46 cover physical-only Hold, magical Weakened bypass, floor/zero damage riders, Rupture before Guard, actual-recipient Saw bonus and recipient-specific mitigation (§4.3). |
| 6 | Every §5 status row is exercised by status, Hold and ordering tests. Every §6 action and Salve is used through `applyCommand`. §7: own crossings for all three Brood, repeated crossing after expiry, imposed area crossings in roster order, discarded excess, burn, death/victory reset, all six form modifiers/blocked actions, expiry and unmodified causing action. |
| 7 | Tests are named E01–E51, except E45 reserved for Q03. Mechanical source-name check found no missing required edge ID. The tests assert the relevant behavior, including new E51 dead-target check before Hold redirect; E23 uses controlled schedules/durations to check the single target and restraint expiry. |
| 8 | E24/E39 and dedicated Utter/Clamp/Gore tests exercise constructed states, ledger ties/current HP/roster/dead actor filtering, Utter untransformed eligibility/fallback and conditional damage (§8). |
| 9 | E43 checks continue-only-between-fights, run-wide revision, carried HP/Revelation/deaths/uses and reset fields. Separate test checks run defeat and final-fight victory (§10/A2-4/A2-9). |
| 10 | For every legal action across all seven encounters plus transformed/poisoned states, preview result/events/state equal commit, forecast equals actual endPhase, and the live input remains deep-equal. Terminal/endPhase previews have null forecast (A2-8). |
| 11 | [q02-parity.test.ts](../../../poc-002-component-combat/tests/q02-parity.test.ts) replays both embedded-content seeds byte-for-byte in events/final state; output above matches the brief's terminal values and rounds. Record tests additionally exercise unfinished fights, independence, object key order and divergence categories (§12). |
| 12 | Boundary test recursively checks all `src/core` source, requires static dependencies to remain in the scanned tree, and rejects browser globals, runtime dynamic imports, randomness and clocks. All core modules execute under the Node test environment. |
| 13 | `fixture()` replaces every numeric leaf from the closed topology before explicit test configuration and calls `loadContent`; changed content is loaded again in the retuning test and controls damage/cost. No shipped tuning numbers are hard-coded in engine code or asserted from v1 in contract tests. Only parity seeds freeze v1. |

## Consumer API and remaining scope

All Q01 `CoreApi` signatures are implemented without contract changes. Import from `src/core/index.ts`, or use `state.ts` for factories, `commands.ts` for `applyCommand`/`legalActions`, `preview.ts`, and `record.ts`. `loadContent` remains Q01's implementation. `engine.ts` additionally exports the structural `parseCommand` helper used by the record parser; consumers need only the fixed public API.

`createFight` creates round 1 with declared intents and declaration-time Wards already applied. Factories return state rather than events, as specified. Accepted `continue` returns `fight-continued`, round-start and declaration/status events once, with the run revision retained. The live `party`, run descriptor and area recipients follow roster order. Per-Guard ledger records actual direct/retaliation/Rupture Venom removal, excluding poison ticks.

Previews dispatch on a clone and use actual `endPhase` for the forecast, without changing the live state. E2 is emitted as a `brood-damaged` event with `form` source and an unmitigated damage breakdown; intent-hit mitigation is separate (A2-5). No status or transformation carries into the next gauntlet fight; surviving active forms reset Revelation at victory before carried values are captured. Dead Brood retain death and Revelation without a form reset.

Records perform closed structural validation and initial/final pool/Revelation checks, embed content, and re-execute commands without using expected output as input. The generic replay path can dispatch `continue`; Q03 still owns full gauntlet-record validation/corpus, hostile-input hardening and input-size caps, CLI dispatch and its tests, including E45. This checkpoint does not claim that Q03's hostile corpus or CLI is delivered. Q04–Q09 presentation/harness/integration work remains with its owners. No unresolved S1–S6 condition remains. No independent review or acceptance is claimed.

## README section text for integration owner

```markdown
## Headless combat core (Q02)

The deterministic combat API is exported from `src/core/index.ts`: `loadContent`, `createFight`, `createGauntlet`, `applyCommand`, `legalActions`, `previewCommand`, `recordOf`, `parseRecord` and `replayRecord`. The core implements all Brood actions, Salves, components, declared enemy intents, statuses and six Revelation forms from the brief, including Amendment A2. It has no renderer, audio, browser, clock, random or I/O dependencies.

Commands carry `expectedRevision`. Rejections preserve state and return empty events; accepted commands return a new state, ordered events and one revision increment. Gauntlet revisions continue across fights. Between victories, `continue` builds the next fight using surviving HP/Revelation, permanent deaths and remaining Salves. Round-scoped state resets for the next fight.

`previewCommand` uses the real dispatcher on a clone and forecasts the following `endPhase`; committing the same command produces identical events. An `endPhase` preview or a terminal result has no further forecast. `legalActions` shares the dispatcher validation.

`recordOf` embeds the content, complete initial state, accepted commands with events/revisions, and final state. `parseRecord` checks the supported data format; `replayRecord` re-executes and compares ordered events, revisions and final state. Unfinished fights can be exported. Q03 supplies the replay CLI, full run/hostile corpus and size limits.

Run `./poc-002-component-combat/bin/run test` from the repository root for contract and seed parity checks. Contract tests use their own tuning; `fixtures/parity/seed-girtablilu-guard.json` and `seed-ugallu-warden.json` pin the brief's v1 witnesses with embedded content. Their events and final states replay exactly. This checkpoint supplies headless behavior; battle/selection/session wiring belongs to its UI checkpoints.
```

## Handoff validation

Copied `.agents/skills/ruach-handoff` to `/tmp/p2-q02-final-handoff.qgkgGz/ruach-handoff`, without changing generated sources. Ran `bun install --frozen-lockfile` in that copied directory: exit 0, `6 packages installed [20.00ms]`.

From the worktree root:

```sh
bun /tmp/p2-q02-final-handoff.qgkgGz/ruach-handoff/scripts/validate.ts docs/mailbox/poc-002-q02/implementer.md --repo .
```

Exit 0. Exact stdout:

```json
{"schema_version":1,"ok":true,"report":"/opt/dev/tehom-brainlab-p2-q02/docs/mailbox/poc-002-q02/implementer.md","repo":"/opt/dev/tehom-brainlab-p2-q02","revisions":[{"path":"/source_baseline","resolved":"c108445fedf9ed6a3b909253d875ae08f67f14da"},{"path":"/candidate_revision","resolved":"80b7f912bb0e374dbec3ec823a069afd04e6a9d3"},{"path":"/tested_revision","resolved":"80b7f912bb0e374dbec3ec823a069afd04e6a9d3"},{"path":"/destination_before","resolved":"49b442d7e4b51ae488a88845e55dba44dfb53d8b"},{"path":"/merged_revision","resolved":"caada9d5d8547bf48308c8a77982f97ece9b67fe"}],"diagnostics":[]}
```

Reran the same command after recording this result: exit 0, same resolved revisions and no diagnostics. The report-creating SHA is returned separately; validation implies no independent review or acceptance.
