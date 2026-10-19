task: P2-Q01
status: complete
outcome: Q01 scaffold, toolchain, content v1 and public contracts implemented and verified
source_baseline: 15c922d
candidate_revision: ed7c8e1be24eb681ef76c8a28e9d363da6b1eefc
tested_revision: ed7c8e1be24eb681ef76c8a28e9d363da6b1eefc
artifacts:
  - poc-002-component-combat/README.md
  - poc-002-component-combat/src/core/types.ts
  - docs/mailbox/poc-002-q01/assignment-implementer.md
  - docs/mailbox/poc-002-q01/implementer.md
verification:
  - "Bare install/typecheck/test/build/test-browser: exit 0; 37 unit tests and 6 browser assertions passed"
  - "Bare replay/sweep/probe: each exit 2 naming Q03/Q04"
  - "Staged diff check and baseline diff check: exit 0"
review: not-run
discoveries:
  - "CoreApi in types.ts declares all nine API signatures; implementations other than loadContent belong to later checkpoints"
  - "Public BattleSession is browser-free; mountBattle accepts null for scaffold/loading"
  - "Form and restraint durationRounds includes the application round"
blockers: []

# Implementer handoff — P2-Q01

Author: Implementer. Worktree `/opt/dev/tehom-brainlab-p2-q01`, branch `p2-q01`.
Assignment: [unchanged Coordinator assignment](assignment-implementer.md).
Authority: [plan Q01](../../plans/2026-10-19-db0bad72-poc-002-component-combat.md#q01--scaffold-toolchain-content-v1-and-contracts), [brief](../../prototypes/poc-002-component-combat.md), ADR-0006 and ADR-0007.

## Changes and scope

Created an independent POC 002 toolchain and Phaser shell, versioned content with strict closed validation, browser-free core contracts, presentation stubs, user documentation and contract tests. All 29 implementation files are inside the assigned Q01 ownership row. No root recipes, existing prototype, shared code, assets or other documents changed. No merges, rebases or pushes performed. The later evidence commit contains only this report and the unchanged assignment.

Changed implementation paths:

- `poc-002-component-combat/.bun-version`
- `poc-002-component-combat/.gitignore`
- `poc-002-component-combat/README.md`
- `poc-002-component-combat/bin/run`
- `poc-002-component-combat/bun.lock`
- `poc-002-component-combat/content/combat-content.v1.json`
- `poc-002-component-combat/index.html`
- `poc-002-component-combat/package.json`
- `poc-002-component-combat/public/.gitkeep`
- `poc-002-component-combat/runtime.env`
- `poc-002-component-combat/scripts/browser-checks.mjs`
- `poc-002-component-combat/scripts/prepare-assets.mjs`
- `poc-002-component-combat/scripts/run.sh`
- `poc-002-component-combat/scripts/toolchain.sh`
- `poc-002-component-combat/src/audio/index.ts`
- `poc-002-component-combat/src/core/content.ts`
- `poc-002-component-combat/src/core/types.ts`
- `poc-002-component-combat/src/main.ts`
- `poc-002-component-combat/src/view/app.ts`
- `poc-002-component-combat/src/view/art/index.ts`
- `poc-002-component-combat/src/view/battle/index.ts`
- `poc-002-component-combat/src/view/select/index.ts`
- `poc-002-component-combat/tests/browser-smoke.mjs`
- `poc-002-component-combat/tests/q01-assets.test.ts`
- `poc-002-component-combat/tests/q01-content.test.ts`
- `poc-002-component-combat/tests/q01-toolchain.test.ts`
- `poc-002-component-combat/tsconfig.json`
- `poc-002-component-combat/vite.config.ts`
- `poc-002-component-combat/vitest.config.ts`

## Required verification

Commands were invoked from the worktree root exactly as shown, without additional environment variables. The host has Bun 1.4.2. Docker commands used the pinned image; access to the daemon required running outside the filesystem sandbox, without changing the command or its environment. No automatic approval rejection occurred. A preliminary sandboxed `docker info --format '{{.ServerVersion}}'` could not access the socket; all required wrapper commands subsequently succeeded with daemon access. A preliminary sandboxed `git add` could not create the linked-worktree index lock; authorized commits succeeded with access to the existing Git metadata.

| Exact command | Exit | Key output |
| --- | --- | --- |
| `./poc-002-component-combat/bin/run install` | 0 | `43 packages installed`; Bun 1.4.2, all required direct pins |
| `./poc-002-component-combat/bin/run typecheck` | 0 | `$ tsc --noEmit`; repeated successfully after final LegalAction type adjustment |
| `./poc-002-component-combat/bin/run test` | 0 | `Test Files 3 passed (3)`; `Tests 37 passed (37)` |
| `./poc-002-component-combat/bin/run build` | 0 | `Q01 assets: prepared 4 files in public/tehom`; `built in 598ms` |
| `./poc-002-component-combat/bin/run test-browser` | 0 | `Browser total: 6 assertions passed across 1 harnesses`; `Preview stopped (expected)` |
| `./poc-002-component-combat/bin/run replay` | 2 | `Q01: replay is implemented by checkpoint Q03 (script not present)` |
| `./poc-002-component-combat/bin/run sweep` | 2 | `Q01: sweep is implemented by checkpoint Q04 (script not present)` |
| `./poc-002-component-combat/bin/run probe` | 2 | `Q01: probe is implemented by checkpoint Q04 (script not present)` |
| `git diff --cached --check` (before implementation commit) | 0 | No output |
| `git diff --check 15c922d..HEAD` (at candidate) | 0 | No output |
| `git diff --stat 15c922d..HEAD -- poc-001-linked-formation shared assets docs/CURRENT.md docs/TASK_LOGS.md justfile` (at candidate) | 0 | No output; protected paths unchanged |

Tests ran on the implementation working content committed as `ed7c8e1be24eb681ef76c8a28e9d363da6b1eefc`; the later report commit does not alter it. Browser discovery selected `/home/metatron/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell` automatically. The runner built fresh content, served port 4273, and stopped only its named container. Disposable screenshot/profile artifacts were under `/tmp/poc-002-browser-AsnfrL`; no generated files were committed. The production build emits Vite's informational warning for the Phaser bundle exceeding 500 kB; it exits 0.

## Acceptance evidence (1–9)

| Item | Evidence |
| --- | --- |
| 1 | Correct prototype directory; copied toolchain, direct pins and Docker digest; committed lockfile; frozen install passed. Copied scripts/configs carry provenance comments. Strict JSON package metadata carries `_provenance`; machine-readable `.bun-version` and `bun.lock` provenance is recorded in README to preserve their formats. |
| 2 | `bin/run` dispatches all ten commands; deferred commands exit 2 before prerequisite/argument checks, then dispatch to their named scripts when present. Ten wrapper tests cover deferred commands, invalid ports (including overflow), missing Docker and mismatched Bun. Dev/preview defaults are 5273/4273, browser default 4273, container prefix `poc-002-browser-`. |
| 3 | JSON contains three Brood, all eleven actions including Guard/Salve, six forms, four enemies with ordered parts/intents, seven encounters, three presets and gauntlet-v1. Numbers from brief §§6–10 include conditional amounts, Revelation costs, Ward, poison/Weakened, Hold, form modifiers/durations, schedules, riders, healing and uses. `loadContent` accepts v1. Twenty-five boundary tests use test-owned content for configurable validation, including every required rejection class, dangling references, extra fields, nested kinds, independent copies and numeric boundaries. No v1 tuning snapshots. |
| 4 | `types.ts` defines complete state/run/carry/ledger/status/intent contracts, three commands, all ten rejection codes in brief order, 24 event kinds and all nine CoreApi signatures. DamageBreakdown exposes all required mitigation components plus Rupture and applied damage. No imports or DOM/Phaser types in this file. |
| 5 | Battle/select/art/audio stubs export final named signatures; mounts return disposers; audio is silent and enemy art empty until their checkpoints. Portrait metadata uses registered emblems or a labelled Anzû shape. Strict typecheck and production build pass. |
| 6 | `main.ts` boots `mountApp`; query routing invokes battle with the requested encounter/party/start, while default invokes select. Browser verifies the battle route and roster-order normalization. Shared Phaser canvas uses 1280×720 and Scale.FIT; resize assertion passes. |
| 7 | Asset preparation copies only two allowlisted emblems plus credits/license, verifies manifest hashes before output replacement and fails on mismatch. Two asset tests verify copied bytes/output bounds and corruption rejection with prior-output preservation. Build successfully prepares four files. |
| 8 | Production-preview smoke checks page title, logical dimensions, visible canvas, battle routing, smaller-viewport FIT and absence of runtime exceptions: six assertions passed. Chrome/CDP uses a temporary profile and dynamic debug port. |
| 9 | Initial README includes purpose/current checkpoint, command/checkpoint table, modes/ports, exact pins, core/presentation boundaries, schema/API conventions, asset credits and copied-pattern provenance. Exact text is supplied below for integration. |

## Public contract inventory

All 71 exported names in `src/core/types.ts` (in source order):

`BroodId`, `ActionId`, `EnemyId`, `PartId`, `EncounterId`, `GauntletId`, `EnemyInstanceId`, `IntentKind`, `IntentId`, `FormKind`, `FormId`, `StartPreset`, `DamageType`, `TargetKind`, `TargetingRule`, `Schedule`, `ActionEffect`, `ActionDefinition`, `FormModifier`, `FormDefinition`, `BroodDefinition`, `PartDefinition`, `IntentModifier`, `IntentRider`, `IntentDefinition`, `EnemyDefinition`, `EncounterDefinition`, `GauntletDefinition`, `StartDefinition`, `Content`, `Phase`, `StatusKind`, `PartTarget`, `Target`, `Transformation`, `Restraint`, `BroodStatuses`, `BroodState`, `PartState`, `Ward`, `EnemyState`, `IntentTarget`, `CancellationReason`, `DeclaredIntent`, `LedgerEntry`, `FightOptions`, `GauntletOptions`, `RunDescriptor`, `CarriedBrood`, `BattleState`, `Command`, `REJECTION_CODES`, `RejectionCode`, `CommandError`, `DamageBreakdown`, `DamageSource`, `RevelationSource`, `StatusTarget`, `StatusRemovalReason`, `Event`, `EventKind`, `CommandResult`, `StateDelta`, `Preview`, `LegalAction`, `RecordedCommand`, `CombatRecord`, `RecordOptions`, `ReplayResult`, `CoreApi`, `BattleSession`.

The nine public method signatures are declared on `CoreApi`: `loadContent`, `createFight`, `createGauntlet`, `applyCommand`, `previewCommand`, `legalActions`, `recordOf`, `parseRecord`, `replayRecord`. Q01 implements only `loadContent` in `content.ts`; Q02/Q03 implement the remaining methods. Consumers may type implementations as `CoreApi['methodName']`.

`BattleSession` exposes `content`, `state`, `subscribe`, `preview`, `commit`, `exportRecord`. View/audio module exports: `mountBattle`, `BattleMountOptions`; `mountSelect`, `StartRequest`, `StartHandler`; `enemyArt`, `broodPortrait`, `HitRegion`, `DrawDescription`, `PartArt`, `EnemyArt`, `Portrait`; `cuesFor`, `createAudio`, `Cue`, `AudioPlayer`.

Rejection order: `invalid-command` → `stale-revision` → `wrong-phase` → `unknown-actor` → `actor-dead` → `already-acted` → `unknown-action` → `action-unavailable` → `no-item-uses` → `illegal-target`.

Event kinds: `round-started`, `intent-declared`, `action-used`, `part-damaged`, `part-destroyed`, `enemy-died`, `intent-cancelled`, `intent-skipped`, `intent-redirected`, `intent-resolved`, `brood-damaged`, `brood-healed`, `brood-died`, `status-applied`, `status-removed`, `poison-ticked`, `revelation-gained`, `revelation-burned`, `transformation-started`, `transformation-ended`, `retaliated`, `item-used`, `combat-ended`, `fight-continued`.

## Integration notes, limitations and stop conditions

- Q02 must use these fixed names and schema. `durationRounds` includes the application round; last round is `round + durationRounds - 1`. Modulo schedules support both matches and non-matches (Gore). Actions separate body damage from component damage, and form modifiers carry every form-specific amount/restriction.
- `LegalAction.command` permits every command kind, so the UI/harness can include endPhase and continue. `applyCommand`/`previewCommand` accept unknown input for malformed-command rejection. Rejected CommandResult carries exactly `events: []`.
- `Preview` carries the selected transition's `result`, `state`, `events`, numeric deltas, and the subsequent real endPhase `forecast` (null after an ending command). The live Q05 session contract lives in types.ts so it can be used before session.ts exists.
- `mountBattle` receives the shared Phaser game/audio plus fight options; null session is explicitly supported for scaffold/loading. `mountSelect` receives a fight-or-gauntlet StartRequest callback. App currently passes null and renders placeholders. The session, battle interactions and gauntlet selection flow remain their assigned Q02/Q05/Q08 work.
- Content validation allows closed-ID subsets for test-owned variants and rejects missing references. The shipped v1 has the complete specified set. Version changes and replay validation/size limits remain Q02/Q03 work; this checkpoint does not claim playable rules or replay support.
- No rule ambiguity or other S1–S6 stop condition was hit. No new dependency, version, asset, rule or out-of-scope implementation change was needed. No independent review or human test was run. No integration/merge was assigned.

## Handoff validation

Copied `.agents/skills/ruach-handoff` to `/tmp/p2-q01-handoff.dCcuZT/ruach-handoff` without editing the generated skill. Ran `bun install --frozen-lockfile` with that directory as cwd: exit 0, `Checked 6 installs across 7 packages (no changes)` (the initial install added six packages).

From the worktree root:

```sh
bun /tmp/p2-q01-handoff.dCcuZT/ruach-handoff/scripts/validate.ts docs/mailbox/poc-002-q01/implementer.md --repo .
```

Validation exit: **0**. Exact stdout:

```json
{"schema_version":1,"ok":true,"report":"/opt/dev/tehom-brainlab-p2-q01/docs/mailbox/poc-002-q01/implementer.md","repo":"/opt/dev/tehom-brainlab-p2-q01","revisions":[{"path":"/source_baseline","resolved":"15c922d073eb8620962245178c5a2477a8dfbe88"},{"path":"/candidate_revision","resolved":"ed7c8e1be24eb681ef76c8a28e9d363da6b1eefc"},{"path":"/tested_revision","resolved":"ed7c8e1be24eb681ef76c8a28e9d363da6b1eefc"}],"diagnostics":[]}
```

Reran the same command after recording its output: exit 0 with the same resolved revisions and no diagnostics.

## README text for the integration owner

The following is the exact initial README; merge later checkpoint sections into it when integrating. Root just recipes remain the integration owner's responsibility.

````markdown
# POC 002 — Component combat

Q01 scaffold for the [component-combat experiment](../docs/prototypes/poc-002-component-combat.md): choosing which enemy function to remove, poison and Revelation, with parties of one to three and a three-fight gauntlet. Q01 delivers validated content, public contracts and a visible shell. Playable rules and screens arrive in later checkpoints; the current canvas and screen labels are placeholders.

## Run from the repository root

Docker is the default. The wrapper checks the daemon and uses the pinned Bun image. No host dependency install is needed for application commands. `test-browser` additionally needs Bun 1.4.2 and a separately installed executable Chrome on the host.

| Command | Checkpoint | Current behaviour |
| --- | --- | --- |
| `./poc-002-component-combat/bin/run install` | Q01 | `bun install --frozen-lockfile` |
| `./poc-002-component-combat/bin/run dev` | Q01 | Development shell at http://localhost:5273 |
| `./poc-002-component-combat/bin/run typecheck` | Q01 | Strict TypeScript check |
| `./poc-002-component-combat/bin/run test` | Q01 | Content, assets and wrapper contract tests |
| `./poc-002-component-combat/bin/run build` | Q01 | Verify/copy assets and build `dist/` |
| `./poc-002-component-combat/bin/run preview` | Q01 | Built shell at http://localhost:4273 |
| `./poc-002-component-combat/bin/run test-browser` | Q01 | Fresh Docker build/preview, host Chrome smoke check, temporary artifacts |
| `./poc-002-component-combat/bin/run replay FILE` | Q03 | Exit 2 naming Q03 until `scripts/replay.ts` exists |
| `./poc-002-component-combat/bin/run sweep` | Q04 | Exit 2 naming Q04 until `scripts/sweep.ts` exists |
| `./poc-002-component-combat/bin/run probe` | Q04 | Exit 2 naming Q04 until `scripts/probe.ts` exists |

The integration owner adds the root `just poc-002-*` recipes after merging the corresponding checkpoint. Until then use the wrapper directly.

`POC002_MODE=host` explicitly selects host Bun; its version must match `.bun-version`. `POC002_PORT` overrides the dev/preview port. `POC002_BROWSER_PORT` overrides the browser preview port (default 4273); ports must be 1–65535. Browser containers use `poc-002-browser-` identities and are stopped after the check. POC 001 uses separate application ports. Concurrent POC 002 browser checks must wait for the shared default port.

Chrome discovery checks the highest executable Playwright headless-shell cache version, then Chrome/Chromium on `PATH`. `POC002_CHROME` or the first `test-browser` argument can specify an executable; optional following arguments select an output directory and an existing base URL. No browser is downloaded automatically. The smoke harness uses a private Chrome profile and dynamic CDP port.

Default URL: the Q08 selection placeholder. Example battle placeholder:

```text
http://localhost:5273/?screen=battle&encounter=warden&party=ugallu,girtablilu,anzu&start=primed
```

Parties are kept in roster order. The canvas has a 1280×720 logical size and Phaser `Scale.FIT`.

## Stack and boundaries

Bun **1.4.2**, Phaser **4.2.1**, TypeScript **7.0.2**, Vite **8.3.2**, Vitest **5.0.3**, `@types/node` **26.6.4**. Docker: `oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895`. `bun.lock` is committed and frozen installs are required. No additional dependencies.

`src/core/types.ts` fixes the portable content, state, command, event, preview, record, session and `CoreApi` signatures. Q02 implements the rules against these signatures. The core has no Phaser or DOM types; presentation owns browser objects. Nothing imports POC 001, and nothing is added to `shared/`.

`src/core/content.ts` exports `loadContent(unknown): Content`, accepting parsed JSON or a JSON string. It rejects extra/missing fields, unknown closed kinds/IDs, duplicate IDs, dangling references and numbers outside the nonnegative integer range 0–2147483647. It returns an independent copy. Content lives in `content/combat-content.v1.json`; the brief is the sole rules authority. Validation tests use their own miniature content and numbers. Only the shipped-content acceptance test loads v1, without tuning snapshots.

Content is structured as `brood`, `actions` (closed effects), `forms` (closed modifiers), `enemies` (parts and ordered intents), `encounters`, `gauntlets`, `starts` and `fightSalveUses`. Schedules use `every-round` or `modulo` with divisor/remainder and a match flag. Form/restraint durations count the application round: `untilRound = round + durationRounds - 1`. Array order preserves roster, encounter and declaration order. No expressions or executable content are accepted.

Public implementations planned for Q02/Q03: `createFight`, `createGauntlet`, `applyCommand`, `previewCommand`, `legalActions`, `recordOf`, `parseRecord`, `replayRecord`. `CoreApi` gives their exact signatures. `applyCommand` accepts `unknown` so malformed commands can be rejected atomically. Damage event breakdowns carry raw, armor, Ward, Weakened, Rupture, Guard, Hold and actual pool removed. Rejection precedence is exported as `REJECTION_CODES`. `Preview.events` belongs to the selected command; `forecast` is the following `endPhase` result, or null after an ending command.

View stubs export final mount/art/audio signatures. `BattleSession` is the browser-free contract for Q05's future `src/view/session.ts`; `mountBattle` accepts null during scaffold/loading. Its options contain the shared Phaser game, audio, fight options and exit callback. `mountSelect` receives a `StartHandler` accepting a fight or gauntlet request. Q06 replaces silent audio; Q07 replaces empty enemy art with labelled shapes and hit regions; Q08 replaces selection and supplies gauntlet flow.

## Assets and copied patterns

Only the registered Ugallu and Girtablilu emblems are copied from root `assets/`, with SHA-256 verification against its manifest. Credits and the license accompany them in generated `public/tehom/`. A failed hash prevents replacing prepared output and fails the build. Emblems are prototype symbols, not final illustrations. See the generated `tehom/CREDITS.md` and `tehom/licenses/game-icons-license.txt`. No audio files are imported.

Patterns copied from `poc-001-linked-formation/` at **c82ec3c**:

- `bin/run`, `scripts/run.sh`, `scripts/toolchain.sh`, `runtime.env` and `.bun-version`: pinned Docker/host dispatch, prerequisite checks, ports and build revision metadata.
- `package.json`, `bun.lock`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts` and `.gitignore`: exact dependency pins, resolved lockfile graph, strict checking, build/test setup and generated-asset ignore. JSON package metadata records provenance; the version file and lockfile retain their machine-readable formats, with provenance here.
- `scripts/prepare-assets.mjs` and `tests/asset-copy.test.ts`: bounded, hash-verified asset preparation and public-boundary verification (Q01 test name `q01-assets.test.ts`).
- `scripts/browser-checks.mjs` and `tests/browser-lab.mjs`: Chrome discovery, production preview lifecycle and CDP harness pattern (Q01 test name `browser-smoke.mjs`).
- `src/core/commands.ts`: atomic rejection result envelope, empty rejected events and expected revision seam, declared here in `types.ts` for Q02 implementation.

These are independent copies; no POC 001 runtime imports or formation content are used.
````
