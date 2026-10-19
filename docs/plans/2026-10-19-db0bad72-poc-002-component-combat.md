# POC 002 component combat: rules core, records, harness, battle UI and gauntlet

## Status and authority

**Proposed; not implemented.** Written 2026-10-19 by the Architect (task P2-DESIGN). Format: [ADR-0002](../adr/0002-plan-filenames.md), [ADR-0003](../adr/0003-implementation-plan-writing.md). Testing: [ADR-0006](../adr/0006-contract-invariants-and-black-box-testing.md) and [ruach-testing](../../.agents/skills/ruach-testing/SKILL.md). Sequence: [plan index](README.md#poc-002--component-combat-q01q10).

Authority:

- [ADR-0007](../adr/0007-poc-002-component-combat.md): direction, user and council decisions, and provisional decisions P1–P4.
- The [POC 002 brief](../prototypes/poc-002-component-combat.md): question, scope and the **numerical specification v1**. The brief is the single rules source. This plan never restates or changes a rule; it cites brief sections as `§n`.
- [ADR-0004](../adr/0004-repository-and-poc-direction.md) and [ADR-0005](../adr/0005-repository-management-and-tooling.md): folder, Bun, Docker and just conventions.

"Full POC" means source 2's implementation steps 1–4. Steps 5–7 (running the external tests, the C# port, Godot) and any change to POC 001 are excluded. Executed work is recorded by the Coordinator in [TASK_LOGS](../TASK_LOGS.md), not here.

## Smallest useful outcome

A tester can open `just poc-002-dev`, choose any party of one to three and any encounter, or the gauntlet, and play to victory or defeat. Every number is visible, enemy intents are declared, and parts can be selected in the list or on the illustration, by mouse or keyboard. Previews match commits. Every run can be exported as a record that `just poc-002-replay` reproduces exactly. `just poc-002-sweep` and `just poc-002-probe` report the brief's falsification signals.

Each of these is insufficient on its own: a UI whose previews do not use the real transition; records that omit the embedded content or per-command events; rules that read tuning numbers from code rather than content; tests that freeze v1 tuning outside versioned parity fixtures.

## Starting source and ownership

- **Inspected baseline:** `19af724` (master `c82ec3c` plus the council commit). `poc-002-component-combat/` does not exist yet.
- **Patterns to copy, not import** (copied files carry a provenance comment such as `// Pattern copied from poc-001-linked-formation/<path> at c82ec3c`):
  - the toolchain: `poc-001-linked-formation/bin/run`, `scripts/run.sh`, `scripts/toolchain.sh`, `runtime.env`, `.bun-version`, `package.json` pins, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`;
  - the CDP browser runner `scripts/browser-checks.mjs`;
  - the command envelope with atomic rejection and empty events (`src/core/commands.ts:43-47`);
  - the revision guard and accounting seam (`src/core/transition.ts:100-136`);
  - previews through the real dispatcher on a clone (`src/core/preview.ts:107-153`);
  - strict versioned records and pure replay (`src/core/run-record.ts:18-37`, `:249-266`);
  - defeat precedence and code-point ID ordering (`src/core/lifecycle.ts:49-73`).
- **Do not copy:** formation, hex geometry, sectors, `ROSTER`, patrol targeting, or POC 001 content.
- **Integration owner:** an Implementer assigned by the Coordinator as **POC 002 integration owner**. It merges accepted checkpoint branches into the integration branch in dependency order, and owns the root `justfile` POC 002 recipes and the assembly of `poc-002-component-combat/README.md` from checkpoint-supplied sections. It reruns the full bare verification after each merge and reports in `docs/mailbox/poc-002-integration/integration.md`.
- **Checkpoint owners:** an Implementer per checkpoint, except Q10, which is owned by the Architect. Durable reports go to `docs/mailbox/poc-002-qNN/implementer.md`, with a validated ruach-handoff block.

### Proposed file layout and ownership

All paths are under `poc-002-component-combat/` unless rooted. Paths are **proposed**. A checkpoint may add files only inside its owned paths.

| Owner | Owned paths |
| --- | --- |
| Q01 | `package.json`, `bun.lock`, `.bun-version`, `runtime.env`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, `index.html`, `.gitignore`, `public/.gitkeep`, `bin/run`, `scripts/run.sh`, `scripts/toolchain.sh`, `scripts/prepare-assets.mjs`, `scripts/browser-checks.mjs`, `content/combat-content.v1.json`, `src/core/types.ts`, `src/core/content.ts`, `src/main.ts`, `src/view/app.ts`, the initial stubs `src/view/battle/index.ts`, `src/view/select/index.ts`, `src/view/art/index.ts`, `src/audio/index.ts`, `tests/q01-*.test.ts`, `tests/browser-smoke.mjs`, initial `README.md` |
| Q02 | `src/core/**` except `content.ts`; may extend (never rename or remove) `src/core/types.ts` and correct `content/combat-content.v1.json` against the brief, per stop condition S3; `tests/q02-*.test.ts`; `fixtures/parity/seed-*.json` |
| Q03 | `src/core/record.ts` (extends the Q02 file), `scripts/replay.ts`, `fixtures/parity/**` except `seed-*`, `fixtures/hostile/**`, `tests/q03-*.test.ts` |
| Q04 | `src/harness/**`, `scripts/sweep.ts`, `scripts/probe.ts`, `tests/q04-*.test.ts` |
| Q05 | `src/view/battle/**` (replaces the stub), `src/view/session.ts`, `tests/q05-*.test.ts`, `tests/browser-battle.mjs` |
| Q06 | `src/audio/**` (replaces the stub), `tests/q06-*.test.ts` |
| Q07 | `src/view/art/**` (replaces the stub), `tests/q07-*.test.ts` |
| Q08 | `src/view/select/**` (replaces the stub), `src/view/run/**`, `tests/q08-*.test.ts`, `tests/browser-run.mjs` |
| Q09 | `tests/browser-gauntlet-e2e.mjs`, `tests/q09-*.test.ts`; integration-only fixes need explicit Coordinator authorization |
| Q10 | `docs/playtests/poc-002-human-test-protocol.md` (repository root) |
| Integration owner | Root `justfile` (POC 002 recipes), `poc-002-component-combat/README.md` after Q01 |
| Coordinator only | `docs/CURRENT.md`, `docs/TASK_LOGS.md` |

Files that are shared by design: `src/core/types.ts` and the content JSON. Q01 creates them. Only Q02 may change them afterwards, by addition or by correction against the brief; Q03–Q08 only import them. The stubs that Q01 creates in Q05–Q07 paths export the final interface signatures (below), so that parallel checkpoints compile against each other before integration.

## Fixture and inputs

- **Content** is `content/combat-content.v1.json` (brief §12): every number in brief §6–§10. It is the only source of tuning.
- **Tests** that check rules use **test-owned content variants** with explicit numbers, never the v1 defaults (ADR-0006). Exact v1 values appear only in versioned parity fixtures that embed their content.
- **Assets:** the registered emblems `assets/tokens/ugallu.svg` and `assets/tokens/girtablilu.svg`, with `assets/CREDITS.md` and `assets/licenses/game-icons-license.txt`. They are copied into `public/tehom/` by `scripts/prepare-assets.mjs` with SHA-256 checks against `assets/manifest.json` (the pattern of POC 001's `scripts/prepare-assets.mjs`). Anzû and the enemies use code-drawn labelled shapes. No asset is added to `assets/`, and no audio file is imported (ADR-0007).
- **Seed lines** for parity fixtures are the [tuning check](../prototypes/poc-002-component-combat.md#tuning-check-v1) traces in the brief: Girtablilu solo against the Guard, and Ugallu solo against the Warden.

## Contracts and decisions

### Public core API (fixed in Q01, implemented by Q02/Q03)

Proposed names; Q01 fixes the exact signatures in `src/core/types.ts`, and later checkpoints must not rename them (stop condition S3).

- `loadContent(json): Content`: strict validation; closed enums; rejects unknown kinds and IDs, non-integers and overflow.
- `createFight(content, {encounterId, party, start}): BattleState` and `createGauntlet(content, {party}): BattleState`: complete initial states.
- `applyCommand(content, state, command): CommandResult`: `{ok: true, state, events}` or `{ok: false, state, events: [], error: {code}}`. It is pure and never mutates its input.
- `previewCommand(content, state, command): Preview`: the result of `applyCommand` on a clone, plus a forecast of `endPhase` on the result (brief §11).
- `legalActions(content, state): LegalAction[]`: for the UI and the harness. It is derived from the same validation as `applyCommand`.
- `recordOf(...)`, `parseRecord(json)` and `replayRecord(record)`: brief §12.
- Events and error codes are closed unions in `types.ts`. Event kinds, at minimum: `round-started`, `intent-declared`, `action-used`, `part-damaged`, `part-destroyed`, `enemy-died`, `intent-cancelled`, `intent-skipped`, `intent-redirected`, `brood-damaged`, `brood-healed`, `brood-died`, `status-applied`, `status-removed`, `poison-ticked`, `revelation-gained`, `revelation-burned`, `transformation-started`, `transformation-ended`, `retaliated`, `item-used`, `combat-ended`, `fight-continued`. A damage event carries raw, armor, Ward, Weakened, Guard and Hold components and the applied amount, so the UI and audio need no rule logic.

### View and presentation interfaces (fixed in Q01 stubs)

- `src/view/battle/index.ts`: `mountBattle(root, session, options)`. It returns a disposer.
- `src/view/session.ts` (Q05): holds the live state and applies commands only through `applyCommand`. It exposes `subscribe`, `preview`, `commit` and `exportRecord`.
- `src/view/art/index.ts`: `enemyArt(enemyId)` returns, per part ID, a draw description and a hit region (≥ 48×48 logical pixels) at 1280×720; `broodPortrait(broodId)` returns an emblem key or a labelled shape.
- `src/audio/index.ts`: `cuesFor(events): Cue[]`, a pure mapping to `hit | armor | component-destroyed | poison | revelation | death`, and `createAudio(): {play(cues), muted, setMuted}`.
- `src/view/select/index.ts`: `mountSelect(root, start)`, where `start` launches a fight or a gauntlet.

### Settled choices

- Simulation boundary **[U]:** `src/core/**` and `src/harness/**` import nothing from `phaser`, `src/view/**`, `src/audio/**` or browser globals. A test enforces this (Q02, Q04).
- Determinism: no randomness, clocks or I/O in the core. The same content, initial state and commands produce identical events and states.
- Ports: dev `POC002_PORT` default 5273; preview 4273; browser runner `POC002_BROWSER_PORT` default 4273; container name prefix `poc-002-browser-`. These are distinct from POC 001's 5173 and 4173, so the two prototypes can be checked at the same time. Parallel POC 002 browser runs still contend for one port: wait rather than override it (process note in TASK_LOGS 2026-10-06).
- Toolchain: the same pins as POC 001 (Bun 1.4.2, Phaser 4.2.1, TypeScript 7.0.2, Vite 8.3.2, Vitest 5.0.3, @types/node 26.6.4) and the same Docker image digest. Docker is the default mode, and `POC002_MODE=host` is the explicit alternative. A new dependency is stop condition S2.
- The root justfile recipes delegate to `poc-002-component-combat/bin/run <command>`, per ADR-0005. The integration owner adds each recipe when the implementing checkpoint merges. Until then, a checkpoint verifies with `./poc-002-component-combat/bin/run <command>`.

## Implementation checkpoints

| ID | Checkpoint | Depends on | May run in parallel with |
| --- | --- | --- | --- |
| Q01 | Scaffold, toolchain, content v1 and contracts | — | Q10 |
| Q02 | Headless rules core: all content, commands, previews, gauntlet run, fight records | Q01 | Q06, Q07, Q10 |
| Q03 | Records corpus, replay CLI, parity and hostile fixtures | Q02 | Q04, Q05, Q06, Q07, Q10 |
| Q04 | Scenario sweep and policy probe harness | Q02 | Q03, Q05, Q06, Q07, Q10 |
| Q05 | Phaser battle UI | Q02 | Q03, Q04, Q06, Q07, Q10 |
| Q06 | Synthesized audio cues | Q01 | Q02–Q05, Q07, Q10 |
| Q07 | Placeholder art and hit regions | Q01 | Q02–Q06, Q10 |
| Q08 | Selection screen, gauntlet flow and record export | Q02, Q05 | Q03, Q04, Q06, Q07, Q10 |
| Q09 | Integrated verification and end-to-end browser harness | Q01–Q08 | Q10 |
| Q10 | Human-test protocol template (docs only) | — | any |

**Integration order:** Q01 → Q02 → (Q06, Q07, Q03, Q04, Q05 in the order they are accepted) → Q08 → Q09. Q10 can merge at any point. After each merge, the integration owner reruns the full verification on the combined revision.

### Q01 — Scaffold, toolchain, content v1 and contracts

Owner: Implementer. Owned paths: see the table. Outcome: an installable, testable, buildable prototype whose content and public types encode the brief.

Acceptance:

1. `poc-002-component-combat/` follows `poc-NNN-short-name` and contains the copied toolchain, with provenance comments and the pins above. `bun.lock` is committed, and install is `bun install --frozen-lockfile`.
2. `bin/run` supports `install|dev|typecheck|test|build|preview|test-browser`, plus `replay`, `sweep` and `probe`. Each of the last three fails with exit 2 and a message naming the checkpoint that implements it until its script exists. Missing Docker, a mismatched Bun or an invalid port fail clearly, as in POC 001.
3. `content/combat-content.v1.json` contains every brief §6–§10 number and ID: the three Brood, every action and Salve, six forms, four enemies with parts and intents, seven encounters and `gauntlet-v1`. `loadContent` accepts it. Tests with test-owned variants show rejection of: an unknown kind, an unknown or duplicate ID, a non-integer, a negative, an overflow above 2³¹ − 1, a missing field and an unsupported schema.
4. `src/core/types.ts` declares the state, commands, the closed rejection codes (brief §2, in that precedence), the closed event kinds and the public API signatures listed above. It has no Phaser or DOM types.
5. The stubs `src/view/battle/index.ts`, `select/index.ts`, `art/index.ts` and `src/audio/index.ts` compile with the final signatures and render or do nothing visibly.
6. `src/main.ts` boots `src/view/app.ts`, which routes `?screen=battle&encounter=…&party=…&start=…` to `mountBattle` and the default to `mountSelect`. The canvas is designed at 1280×720 with Phaser `Scale.FIT`.
7. `scripts/prepare-assets.mjs` copies only the Ugallu and Girtablilu emblems, credits and license, with SHA-256 verification against the manifest. A mismatch fails the build.
8. `tests/browser-smoke.mjs` runs under `test-browser` against the built preview, and asserts that the page title and the canvas at 1280×720 logical size render.
9. Initial `README.md`: purpose, run commands (labelled with their checkpoint), stack, boundaries, and a "copied patterns" provenance list.

Verification:

- `./poc-002-component-combat/bin/run install`
- `… typecheck`
- `… test`
- `… build`
- `… test-browser`

After integration, the integration owner runs `just poc-002-install`, `just poc-002-typecheck`, `just poc-002-test`, `just poc-002-build` and `just poc-002-test-browser` bare.

### Q02 — Headless rules core

Owner: Implementer. Implements brief §1–§11 completely: all Brood actions, the Item, statuses, Revelation and the six forms, all four enemies, the seven encounters, the start presets, the gauntlet run with `continue` and carry-over, and previews. It also records fights: `recordOf`, `parseRecord` and `replayRecord` work for fight records from this checkpoint on [C].

Acceptance (contract tests with test-owned content, black-box through `applyCommand`/`previewCommand`):

1. Rejected commands leave the state deep-equal, return no events, and use the brief §2 codes in precedence order, including `stale-revision` for a duplicate command.
2. Accepted commands increment the revision by exactly 1. Dead actors never act. `endPhase` forfeits unused actions and resolves the enemy phase, the end of round and the next declaration.
3. Round ordering follows brief §3 exactly. Tests cover the declaration order, the action unit (effects → cost → transformation → outcome), the intent unit (skip → recipients → damage → riders → retaliation → transformation → outcome), and E1–E6.
4. Components (brief §4): no overflow into life; destruction cancels exactly that part's unresolved intents and releases its restraint; shielding and its removal; Ward; armor; magical and poison bypasses.
5. Brood damage follows brief §4.3's order, including Guard ⌈d/2⌉, physical-only Hold −2, Weakened, Ugallu's Rupture +1 and the Saw's +14 on the actual recipient.
6. Every row of brief §5, every action in §6 and §6.1, and every rule in §7 has at least one passing test, including crossing kind by gain source, the burn while transformed, expiry to ⌊cap/2⌋, victory reset, death without reset, and multiple crossings in roster order.
7. Every edge case E01–E51 (brief §13; E51 added 2026-10-19 by brief amendment A2) has a named test, except E45, which is tested in Q03.
8. Enemy targeting rules (brief §8), including ledger ties and the Utter fallback, are tested with constructed states.
9. Gauntlet: `continue` is valid only in `between-fights`; carried and reset fields follow brief §10; a defeat ends the run; a dead Brood stays dead.
10. Preview equivalence: for every legal action in a representative set of states, `previewCommand(...).events` equals the `applyCommand` events, and the live state is unchanged.
11. Records: `fixtures/parity/seed-girtablilu-guard.json` and `seed-ugallu-warden.json` encode the brief's two seed lines with embedded v1 content. They replay byte-for-byte in events and final state, and their final values match the brief's traces.
12. The boundary test: no file under `src/core/` imports `phaser`, `src/view`, `src/audio` or a browser global.
13. No v1 tuning value appears in a non-parity test assertion, and none is hard-coded in `src/core/`. A test that loads a modified content file with different numbers still passes the contract suite.

Verification: `… test`, `… typecheck`, `… build`. Report the test count and the seed replay output.

### Q03 — Records corpus, replay CLI, parity and hostile fixtures

Owner: Implementer. Extends records to gauntlet runs, and adds `scripts/replay.ts` behind `bin/run replay FILE`. The FILE path is resolved before the change of directory, and in Docker mode only that file is mounted, read-only, with `--network none` (the POC 001 pattern). Q03 also builds the **parity fixture corpus**.

Acceptance:

1. `replay FILE` exits 0 and prints `commands`, `events` and `outcome` for a valid fight or gauntlet record. On a divergence it exits 1 with the first divergent command index and kind (`events`, `revision` or `final-state`).
2. Hostile records are rejected with a specific reason and exit 1: unknown schema or rules version, unknown kinds or IDs, non-integers, overflow, extra or missing fields, an impossible initial state (for example Revelation at the cap without a transformation), a command rejected during replay, and oversized input (a cap is stated in the README). Replay runs no code from records and reads only the named file.
3. The corpus `fixtures/parity/` contains at least:
   - the seeds;
   - one fight per encounter (7), with a party chosen to exercise each encounter's mechanics;
   - one record per transformation (6);
   - one gauntlet win (trio);
   - one gauntlet defeat;
   - records exercising Revoke of Inscribe, a Hold redirect of the Clamp, retaliation that kills, victory during a transformation, and a poison-tick victory.
   Each embeds its content and is generated through the real API, not hand-written.
4. A test replays every corpus record. A test also proves that changing one embedded content number in a corpus record makes its replay diverge, so the fixtures really pin content.
5. `fixtures/parity/README.md` explains the corpus purpose (the C# parity gate, ADR-0007), the naming, how to regenerate a record intentionally (a new content or rules version), and that fixtures are never edited by hand.

Verification:

- `… test`
- `./poc-002-component-combat/bin/run replay fixtures/parity/seed-ugallu-warden.json`
- a hostile record from `fixtures/hostile/`, with its exit code recorded

After integration: `just poc-002-replay <file>`, bare.

### Q04 — Scenario sweep and policy probe harness

Owner: Implementer. A headless harness in `src/harness/` uses only the public core API and is run by `bin/run sweep` and `bin/run probe`. Its output is a human-readable report on stdout and optional JSON (`--json PATH`, outside the repository). It **reports** falsification signals; it does not assert balance.

Acceptance:

1. `sweep` runs the 7 parties × 7 encounters × 3 starts, plus the gauntlet for the 7 parties. It uses deterministic beam search with stated width and depth (defaults ≥ 200 and 30 rounds, overridable by flags) and a bounded exhaustive search for solo openings to depth 4. Per cell, it reports the outcome, rounds, surviving HP, Salves used, and action-use shares.
2. `probe` enumerates every distinct round-1 joint opening for each party against a named encounter (default `warden`), with and without Salves, and searches each continuation. It reports, per party, the best opening, the best per class (core, each component, mixed, control) and the HP gaps.
3. Fixed policies are run and compared with search: always-disable, always-core, poison-then-Guard, Rapture-as-soon-as-possible, never-use-Revelation-skills, Revoke-every-Saw.
4. The report prints every signal listed in the brief's [hypotheses and falsifiers](../prototypes/poc-002-component-combat.md#hypotheses-and-falsifiers) and [tuning check](../prototypes/poc-002-component-combat.md#tuning-check-v1) as `FLAG` or `ok`, with the cells that triggered it. These are the dominance rule, the indifference rule, rare actions, more than 10 rounds, the cleanup length, and duo and trio gauntlet margins. Every report states "heuristic search; a loss means no win was found".
5. A breakpoint scan (`probe --breakpoints`) applies ±1 and ±2 to every content number and flags any part that a single action exactly destroys at v1.
6. Tests use small test-owned content to prove that the search finds a known forced win, that the dominance and indifference calculations flag constructed cases, and that the harness never mutates states it receives.
7. The report is deterministic for fixed flags. A test runs the same small sweep twice and compares the output.

Verification:

- `./poc-002-component-combat/bin/run sweep --quick`
- `./poc-002-component-combat/bin/run probe --encounter warden`

Paste the report summary into the handoff. After integration: `just poc-002-sweep` and `just poc-002-probe`, bare.

### Q05 — Phaser battle UI

Owner: Implementer. Builds the 1280×720 battle screen (brief §11, Presentation requirements) against `session.ts`, the core API, and the art and audio interfaces. With the stubs it renders labelled rectangles and silence. With Q06 and Q07 merged it uses them unchanged.

Acceptance:

1. `?screen=battle&encounter=<id>&party=<ids>&start=<preset>` shows the Brood panels, the enemy illustrations, the component list, the intent panel, the command menu (Attack, Skills, Guard, Item) and the event log.
2. **Two-way selection:** choosing a part in the list highlights it on the illustration, and clicking its hit region highlights the list entry. A browser test checks both directions for every part of the Warden and the Scribe, including the tongue and hand.
3. Every displayed number comes from the state or the preview. The intent panel shows source part, kind, target, type, base, modifiers and the forecast amount. Cancelled and revoked intents are struck through, with the reason.
4. Before Confirm, the preview shows deltas and the enemy-phase forecast. A browser test asserts that the confirmed events equal the previewed events.
5. Invalid targets are disabled, with a reason. Rejected commands show their error code, and the state is unchanged.
6. Keyboard: actor, action and target selection, Confirm, Back and End Phase all work without a pointer. A focused control never executes a hovered one (regression from POC 001 P10, R1).
7. The view never computes rules. A unit test of the view model (`src/view/battle/model.ts`) derives every displayed value from state and events only.
8. `tests/browser-battle.mjs` plays one full fight per encounter for one party through the UI, to an end state.

Verification: `… test`, `… build`, `… test-browser`, with screenshots named in the handoff (Warden selection, intent panel, preview).

### Q06 — Synthesized audio cues

Owner: Implementer. Implements `src/audio/` per ADR-0007: Web Audio synthesis, with no audio files.

Acceptance:

1. `cuesFor(events)` maps events to the six cues. It is pure and deterministic, and tested per event kind:
   - **hit:** applied damage > 0;
   - **armor:** armor or Ward mitigated ≥ 1 point;
   - **component-destroyed:** `part-destroyed`;
   - **poison:** poison applied, or `poison-ticked`;
   - **revelation:** `revelation-gained` or `transformation-started`;
   - **death:** `brood-died` or `enemy-died`.
2. Each cue is a distinct synthesized sound: distinct waveform, envelope or pitch, documented in a table in its module header. `createAudio` creates its context lazily on the first user gesture, and never throws without audio support. Mute works and persists for the session.
3. Audio never feeds back into rules. `src/audio/` imports only types from the core.

Verification: `… test`, `… typecheck`; a manual listening note in the handoff (not a claim of human testing).

### Q07 — Placeholder art and hit regions

Owner: Implementer. Implements `src/view/art/`: labelled component diagrams for the four enemies (one 256×384-proportioned panel each, and a larger Warden panel), Brood portraits (the Ugallu and Girtablilu emblems, and an Anzû labelled shape), destroyed and shielded states, and a battle background drawn in code.

Acceptance:

1. Every part ID in content v1 has a draw description and a hit region of at least 48×48 logical pixels at 1280×720. Small parts (tongue, hand) have regions larger than their drawn shape. A test checks this against content.
2. No two hit regions on one enemy overlap. A test checks this.
3. Portraits use only registered emblems via `public/tehom/`. Anzû and the enemies use text labels. No new asset file is added.
4. The credits text for the emblems is exported for the UI (the README links `assets/CREDITS.md`).

Verification: `… test`, `… typecheck`.

### Q08 — Selection screen, gauntlet flow and record export

Owner: Implementer. The default screen offers a party (any of the 7 non-empty subsets), an encounter (7) and a start preset (3), or the gauntlet. It runs fights through `mountBattle`, handles `between-fights` with a summary of the carried state and a Continue button, shows the result screens, and offers record export.

Acceptance:

1. Every party × encounter × start combination can be launched; a browser test samples all 7 parties and all 7 encounters.
2. Gauntlet: three fights in brief §10 order. After each victory, HP, Revelation, deaths and Salve uses carry over, and the run proceeds only by `continue`. A defeat ends the run.
3. Export saves the full record (fight or gauntlet) as JSON. A browser test exports a record after a short scripted gauntlet fight, and replays it with the core `replayRecord`.
   *Amended 2026-10-19 (P2-DESIGN, Coordinator-authorized, from the Q10 report):* export is available **at any time** during the current attempt, until Reset or Return to selection. That covers a fight or a gauntlet, finished or unfinished, including after a Brood's death and in `between-fights`. The record contains every command accepted so far, and its `finalState` is the state at export (brief §12). Browser tests export an unfinished attempt after a Brood's death mid-gauntlet and in mid-fight, then replay each with `replayRecord`; the replayed state must equal the exported state.
4. Reset returns to selection and starts a fresh record. No stale preview or state survives the reset (regression from POC 001 RF, B1).
5. The credits are reachable from the selection screen.

Verification: `… test`, `… build`, `… test-browser`.

### Q09 — Integrated verification and end-to-end harness

Owner: the integration owner. On the integrated branch after Q01–Q08:

1. `tests/browser-gauntlet-e2e.mjs` plays a trio gauntlet to victory through the UI with keyboard-only input, exports the record, replays it through `bin/run replay`, and asserts that audio cues were requested for each of the six cue kinds (via a test hook on `createAudio`, not real sound).
2. The root justfile has `poc-002-install`, `-dev`, `-typecheck`, `-test`, `-build`, `-preview`, `-test-browser`, `-replay`, `-sweep` and `-probe`, each delegating to `poc-002-component-combat/bin/run`.
3. The README is complete: commands, ports, modes, records, harness and credits.
4. Full bare verification passes at one revision, with no `POC002_*` or Chrome overrides:
   - `just poc-002-install`
   - `just poc-002-typecheck`
   - `just poc-002-test`
   - `just poc-002-build`
   - `just poc-002-test-browser`
   - `just poc-002-replay poc-002-component-combat/fixtures/parity/seed-ugallu-warden.json`
   - `just poc-002-sweep --quick`
   - `just poc-002-probe`
5. `git diff --stat <base>..HEAD -- poc-001-linked-formation shared` is empty.

### Q10 — Human-test protocol template

Owner: Architect (documentation). Deliverable: `docs/playtests/poc-002-human-test-protocol.md`, a **template, not executed**. It covers:

- the setup: four to six external testers, the build commit and conditions;
- the session order: the solo Guard fight with each Brood, then a trio gauntlet, then a duo gauntlet of the tester's choice;
- prompts that record predictions before commits;
- the brief's acceptance questions and human falsifiers;
- record export per attempt;
- an observation table that separates observation from interpretation, after `docs/playtests/TEMPLATE.md`;
- consent and anonymity notes.

Acceptance: links resolve; it states that it is unexecuted; it adds nothing to the brief's rules. Verification: link check and `git diff --check`.

## Acceptance criteria (whole plan)

1. Every checkpoint Q01–Q10 meets its numbered list on the integrated revision.
2. The brief is the only source of rules. Every rule question found during implementation was resolved by a brief amendment from the Architect (S1), not by a code choice.
3. Records produced by the UI replay with the CLI. The parity corpus replays in full.
4. The sweep and probe reports exist for the integrated revision and are linked from the integration handoff.
5. POC 001 and `shared/` are unchanged. No CURRENT or TASK_LOGS edits by workers.

## Verification and hand-back

Each checkpoint handoff records:

- the base and candidate revisions;
- the changed paths, which must stay within its owned paths;
- the exact commands and their results;
- the numbered acceptance mapping;
- the README section text for the integration owner;
- limitations, and any stop condition hit.

Run user-facing commands **bare**, exactly as a user would. The integration handoff records the combined revision and the full Q09 command list results. Unit tests, browser checks, harness reports and human tests are different evidence: none implies another.

## Non-goals and stop conditions

Non-goals: everything excluded in the brief's [scope](../prototypes/poc-002-component-combat.md#scope-and-non-goals); retuning (numbers change only by a brief amendment); performance work beyond keeping `just poc-002-sweep --quick` under about five minutes on the development machine.

Stop and report to the Coordinator before proceeding if:

- **S1:** the brief is ambiguous, contradictory or silent on a rule. Do not invent the rule.
- **S2:** a new dependency, toolchain version or asset seems necessary.
- **S3:** a public contract in `types.ts` (an event kind, error code, interface or API signature) or the content schema would be renamed or removed after Q01, or changed by anyone other than Q02. Q02 may only add optional fields and correct content values against the brief, and must list every such change in its handoff, because Q05–Q07 compile against the Q01 contracts in parallel.
- **S4:** a file outside the checkpoint's owned paths needs editing.
- **S5:** an existing test must be weakened, or a test must freeze v1 tuning outside the parity fixtures.
- **S6:** POC 001 or `shared/` would change.
