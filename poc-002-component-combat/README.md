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
