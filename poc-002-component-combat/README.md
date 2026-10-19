# POC 002 — Component combat

Prototype for the [component-combat experiment](../docs/prototypes/poc-002-component-combat.md): choosing which enemy function to remove, poison and Revelation, with parties of one to three and a three-fight gauntlet. Q01 delivers validated content, public contracts and a visible shell; Q02 adds headless rules, previews and fight records. Q05 supplies playable battles; Q08 adds party/encounter selection, the complete gauntlet flow and JSON export of the current attempt.

## Run from the repository root

Docker is the default. The wrapper checks the daemon and uses the pinned Bun image. No host dependency install is needed for application commands. `test-browser` additionally needs Bun 1.4.2 and a separately installed executable Chrome on the host.

| Command | Checkpoint | Current behaviour |
| --- | --- | --- |
| `just poc-002-install` | Q01 | `bun install --frozen-lockfile` |
| `just poc-002-dev` | Q01 | Development server at http://localhost:5273 |
| `just poc-002-typecheck` | Q01 | Strict TypeScript check |
| `just poc-002-test` | Q01–Q08 | Content, core, records, harness, session/model, assets, wrapper, audio and art contract tests |
| `just poc-002-build` | Q01 | Verify/copy assets and build `dist/` |
| `just poc-002-preview` | Q01 | Built prototype at http://localhost:4273 |
| `just poc-002-test-browser` | Q01 | Fresh Docker build/preview, battle, run and smoke harnesses, temporary artifacts |
| `just poc-002-replay FILE` | Q03 | Validate and replay a fight or gauntlet record |
| `just poc-002-sweep --quick` | Q04 | Search all 154 scenario cells and report signals |
| `just poc-002-probe` | Q04 | Search Warden openings and compare fixed policies |

All ten root recipes are available. Sweep and probe report heuristic search evidence; their flags are not balance gates.

`POC002_MODE=host` explicitly selects host Bun; its version must match `.bun-version`. `POC002_PORT` overrides the dev/preview port. `POC002_BROWSER_PORT` overrides the browser preview port (default 4273); ports must be 1–65535. Browser containers use `poc-002-browser-` identities and are stopped after the check. POC 001 uses separate application ports. Concurrent POC 002 browser checks must wait for the shared default port.

Chrome discovery checks the highest executable Playwright headless-shell cache version, then Chrome/Chromium on `PATH`. `POC002_CHROME` or the first `test-browser` argument can specify an executable; optional following arguments select an output directory and an existing base URL. No browser is downloaded automatically. The smoke harness uses a private Chrome profile and dynamic CDP port.

The default page opens party/encounter/start selection and gauntlet launch. Direct battle URLs use the same attempt, export and reset controls:

```text
http://localhost:5273/?screen=battle&encounter=warden&party=ugallu,girtablilu,anzu&start=primed
```

Parties are kept in roster order. The canvas has a 1280×720 logical size and Phaser `Scale.FIT`.

## Stack and boundaries

Bun **1.4.2**, Phaser **4.2.1**, TypeScript **7.0.2**, Vite **8.3.2**, Vitest **5.0.3**, `@types/node` **26.6.4**. Docker: `oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895`. `bun.lock` is committed and frozen installs are required. No additional dependencies.

`src/core/types.ts` fixes the portable content, state, command, event, preview, record, session and `CoreApi` signatures. Q02 implements the rules against these signatures. The core has no Phaser or DOM types; presentation owns browser objects. Nothing imports POC 001, and nothing is added to `shared/`.

`src/core/content.ts` exports `loadContent(unknown): Content`, accepting parsed JSON or a JSON string. It rejects extra/missing fields, unknown closed kinds/IDs, duplicate IDs, dangling references and numbers outside the nonnegative integer range 0–2147483647. It returns an independent copy. Content lives in `content/combat-content.v1.json`; the brief is the sole rules authority. Validation tests use their own miniature content and numbers. Only the shipped-content acceptance test loads v1, without tuning snapshots.

Content is structured as `brood`, `actions` (closed effects), `forms` (closed modifiers), `enemies` (parts and ordered intents), `encounters`, `gauntlets`, `starts` and `fightSalveUses`. Schedules use `every-round` or `modulo` with divisor/remainder and a match flag. Form/restraint durations count the application round: `untilRound = round + durationRounds - 1`. Array order preserves roster, encounter and declaration order. No expressions or executable content are accepted.

Public implementations available from Q02: `createFight`, `createGauntlet`, `applyCommand`, `previewCommand`, `legalActions`, `recordOf`, `parseRecord`, `replayRecord`. `CoreApi` gives their exact signatures. `applyCommand` accepts `unknown` so malformed commands can be rejected atomically. Damage event breakdowns carry raw, armor, Ward, Weakened, Rupture, Guard, Hold and actual pool removed. Rejection precedence is exported as `REJECTION_CODES`. `Preview.events` belongs to the selected command; `forecast` is the following `endPhase` result, or null after an ending command.

View modules export final mount/art/audio signatures. `src/view/session.ts` implements the browser-free `BattleSession` contract; `mountBattle` accepts null to create a session for direct battle URLs. Its options contain the shared Phaser game, audio, fight options and exit callback. `mountSelect` receives a `StartHandler` accepting a fight or gauntlet request. Q06 supplies synthesized audio cues; Q07 supplies labelled art descriptions and hit regions for Q05 to render; Q08 supplies selection, gauntlet flow and export controls.

## Headless combat core (Q02)

The deterministic combat API is exported from `src/core/index.ts`: `loadContent`, `createFight`, `createGauntlet`, `applyCommand`, `legalActions`, `previewCommand`, `recordOf`, `parseRecord` and `replayRecord`. The core implements all Brood actions, Salves, components, declared enemy intents, statuses and six Revelation forms from the brief, including Amendment A2. It has no renderer, audio, browser, clock, random or I/O dependencies.

Commands carry `expectedRevision`. Rejections preserve state and return empty events; accepted commands return a new state, ordered events and one revision increment. Gauntlet revisions continue across fights. Between victories, `continue` builds the next fight using surviving HP/Revelation, permanent deaths and remaining Salves. Round-scoped state resets for the next fight.

`previewCommand` uses the real dispatcher on a clone and forecasts the following `endPhase`; committing the same command produces identical events. An `endPhase` preview or a terminal result has no further forecast. `legalActions` shares the dispatcher validation.

`recordOf` embeds the content, complete initial state, accepted commands with events/revisions, and final state. `parseRecord` checks the supported data format; `replayRecord` re-executes and compares ordered events, revisions and final state. Unfinished fights can be exported. Q03 supplies the replay CLI, full run/hostile corpus and size limits.

Run `just poc-002-test` from the repository root for contract and seed parity checks. Contract tests use their own tuning; `fixtures/parity/seed-girtablilu-guard.json` and `seed-ugallu-warden.json` pin the brief's v1 witnesses with embedded content. Their events and final states replay exactly. Q02 supplies headless behavior; Q05 supplies battle/session wiring; Q08 supplies selection and gauntlet screens.

## Records and replay (Q03)

Exported records embed their content, complete initial state, accepted commands
with ordered events/revisions, and expected final state. Fight and whole-gauntlet
records replay through the same rules API, including `continue` commands and
run-wide revisions. Unfinished attempts in `player` or `between-fights` also export
and replay; their outcome is the final phase.

From the repository root:

    just poc-002-replay poc-002-component-combat/fixtures/parity/gauntlet-win-trio-v1.json

Input paths are relative to the caller's directory. Docker mounts the named input
read-only and disables networking. Replay reads no files named by record content
and executes no record text. The input cap is **8,388,608 UTF-8 bytes (8 MiB)**,
including whitespace. Oversized inputs, unknown fields/versions/kinds/IDs, invalid
integers, impossible states and rejected commands fail with a specific reason and
exit 1. Success exits 0 and prints `commands`, `events` and `outcome`. Divergence
identifies the first zero-based `commandIndex` and `events`, `revision` or
`final-state`; a final-state mismatch uses the command count.

The 24-record corpus in `fixtures/parity/` is the future C# parity gate: the two
brief seeds, every encounter, every form, gauntlet win/defeat, five edge witnesses,
and unfinished exports. Every record embeds frozen v1 content. Read
`fixtures/parity/README.md` before intentionally authoring a new version; never
edit parity JSON by hand. Negative fixtures live separately in `fixtures/hostile/`.
Run `just poc-002-test` for all contract/parity/hostile checks.

## Scenario sweep and policy probe (Q04)

From the repository root run `just poc-002-sweep --quick` for all 147 party/encounter/start cells and seven gauntlets. Omit `--quick` for the default beam width 200; quick uses width 8. Both use depth 30 rounds per fight and an exhaustive solo opening prefix of four rounds. Override with `--width N`, `--depth N` and `--solo-depth 0..4`.

`just poc-002-probe --encounter warden` enumerates distinct round-1 joint openings for all seven parties, with and without Salves, including action-order effects and forfeitures. Commuting equivalent openings are collapsed. Every opening continuation is searched with width 1 by default (`--probe-width N`); independent policy-reference fight/gauntlet searches use the main beam. Reports show best openings/classes and HP gaps, per-cell outcome/rounds/HP/Salves/action shares, six fixed-policy comparisons, and all falsification signals with triggering cells.

Sweep's opening dominance/indifference analysis covers the named probe encounter; other encounters are beam samples. Every report states: heuristic search; a loss means no win was found. A best opening is relative to its continuation search, and flags are evidence rather than balance gates.

`probe --breakpoints` independently applies ±1 and ±2 to every numeric content field and reports validation rejections plus fresh single-action exact/overkill breakpoints. Use `--json PATH` outside the repository for JSON. To persist JSON through Docker: `just poc-002-probe --json /dev/stdout > /tmp/poc002-probe.json`; the human report goes to stderr. Human reports can be captured with ordinary stdout redirection. No dependency or environment override is needed.

## Battle screen and sessions (Q05)

Open a direct battle URL, for example:
http://localhost:5273/?screen=battle&encounter=warden&party=ugallu,girtablilu,anzu&start=primed

Choose an actor and Attack, Skills, Guard or Item, then a valid target. Preview
shows command events, HP/Revelation/pool/Salve deltas and the following enemy
phase/end of round through the real rules. Confirm commits exactly that command;
End Phase also previews before Confirm. Invalid targets display a reason and
cannot be confirmed. The event log contains committed events only.

Select a component in its list or directly on the illustration; both highlight
the same part. Invalid parts remain inspectable. Tab or arrows move focus,
Enter/Space activates the focused control, and Escape goes Back. Hover does not
change the keyboard selection. The surface uses 1280×720 logical geometry and
scales with the Phaser canvas. Diagnostic panels scroll to expose all details.

Audio starts muted. Unmute/Mute changes the shared player's setting; Credits
opens the registered emblem attribution and source/license links. No imported
audio or new assets are needed.

`createSession(content, initialState, buildRevision?)` in `src/view/session.ts`
implements the browser-free `BattleSession` contract. It supports immediate
subscription, pure previews, real command commits and accepted-command records,
including unfinished fights. Q08 supplies selection, gauntlet flow and download
controls. `test-browser` includes two-way Warden/Scribe targeting, keyboard and
focus/hover regression checks, preview/commit event parity and all seven fights.

## Synthesized audio (Q06)

The six event-derived cues are hit, armor/Ward mitigation, component destruction,
poison, Revelation and death. They use runtime Web Audio synthesis; no audio files
or new licensed assets are loaded. The sound table is in `src/audio/index.ts`.

Use one `createAudio()` player for the app session. It starts muted. Bind the mute
control to `audio.setMuted(value)` and display `audio.muted`; the choice remains
in effect across playback calls for that session. A pointer or keyboard gesture
initializes/resumes Web Audio. Missing or blocked audio stays silent.

Pass committed events to `audio.play(cuesFor(events))`. Each qualifying event
contributes its cues, including hit plus armor for a partially mitigated hit.
Previews must not play cues. Audio never calls rules or changes combat state.

## Placeholder art (Q07)

`src/view/art/index.ts` supplies labelled enemy diagrams, non-overlapping part hit regions of at least 48×48 logical pixels, Brood portrait metadata, destroyed/shielded appearance descriptions and a code-drawn battle background. Ordinary enemy panels are 256×384; the Warden panel is 512×512. Draw and hit-region coordinates share a panel-local origin on the 1280×720 combat canvas. The Scribe's tongue and hand have regions larger than their shapes.

Ugallu and Girtablilu use only the registered emblems prepared under `public/tehom/` by the SHA-verifying asset script. Anzû and enemies use labelled shapes. The art module exports `EMBLEM_SOURCES` for texture loading and `EMBLEM_CREDITS` for UI attribution. See [asset credits](../assets/CREDITS.md) and the [CC BY 3.0 license](../assets/licenses/game-icons-license.txt). No art asset or dependency was added. Q05 consumes these descriptions for rendering and part selection.

## Selection, gauntlet and export (Q08)

Open the default page to choose any party of one to three, one of seven encounters
and a fresh, wounded or primed fight start. Start gauntlet uses a fresh party and
the guard-scribe → guard-beast → warden sequence. Credits are reachable on selection
and in battle. Native Tab/Enter controls work throughout; arrow keys traverse the
attempt toolbar and battle controls.

After each gauntlet victory, the summary shows carried HP, Revelation, permanent
deaths and remaining Salves. Choose Continue to advance. Defeat ends the attempt;
winning the last fight shows victory. One recording session covers the entire run.

Export record downloads the complete current attempt as JSON at any time before
Reset or Return to selection: before commands, during combat, after a death,
between fights and at either final result. It embeds content, initial state,
accepted commands/events/revisions including Continue, and the state at export.
Replay unfinished exports the same way as completed ones:

    just poc-002-replay /path/to/download.json

Reset and Return to selection discard the attempt. The next launch has fresh
state, no prior commands and no pending preview. Export first to retain a record.
Direct `?screen=battle&encounter=…&party=…&start=…` URLs use the same export and reset
controls.

## Assets and copied patterns

Only the registered Ugallu and Girtablilu emblems are copied from root `assets/`, with SHA-256 verification against its manifest. Credits and the license accompany them in generated `public/tehom/`. A failed hash prevents replacing prepared output and fails the build. Emblems are prototype symbols, not final illustrations. See the generated `tehom/CREDITS.md` and `tehom/licenses/game-icons-license.txt`. No audio files are imported.

Patterns copied from `poc-001-linked-formation/` at **c82ec3c**:

- `bin/run`, `scripts/run.sh`, `scripts/toolchain.sh`, `runtime.env` and `.bun-version`: pinned Docker/host dispatch, prerequisite checks, ports and build revision metadata.
- `package.json`, `bun.lock`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts` and `.gitignore`: exact dependency pins, resolved lockfile graph, strict checking, build/test setup and generated-asset ignore. JSON package metadata records provenance; the version file and lockfile retain their machine-readable formats, with provenance here.
- `scripts/prepare-assets.mjs` and `tests/asset-copy.test.ts`: bounded, hash-verified asset preparation and public-boundary verification (Q01 test name `q01-assets.test.ts`).
- `scripts/browser-checks.mjs` and `tests/browser-lab.mjs`: Chrome discovery, production preview lifecycle and CDP harness pattern (Q01 test name `browser-smoke.mjs`).
- `src/core/commands.ts`: atomic rejection result envelope, empty rejected events and expected revision seam, declared in `types.ts` and implemented independently by Q02.

These are independent copies; no POC 001 runtime imports or formation content are used.
