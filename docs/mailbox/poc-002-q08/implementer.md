task: P2-Q08
status: complete
outcome: Selection, whole-gauntlet flow and current-attempt JSON export implemented and verified
source_baseline: e9c87a7
candidate_revision: a644871e1a268f87390bfbd86e20195f00d15281
tested_revision: a644871e1a268f87390bfbd86e20195f00d15281
artifacts:
  - docs/mailbox/poc-002-q08/assignment-implementer.md
  - docs/mailbox/poc-002-q08/implementer.md
  - poc-002-component-combat/src/view/run/index.ts
  - poc-002-component-combat/tests/q08-run.test.ts
  - poc-002-component-combat/tests/browser-run.mjs
verification:
  - "Bare install, typecheck, test, build and test-browser: final exit 0; 261 unit tests and 619 browser assertions"
  - "Five bare CLI replays of browser exports: exit 0, covering unfinished fight, between-fights, death during unfinished gauntlet, victory and defeat"
  - "Assignment SHA-256 unchanged; staged diff check and protected-path check exit 0"
review: not-run
discoveries:
  - "Coordinator authorized the narrow app.ts routing/resource/disposal exception after the initial S4 stop"
  - "Attempt toolbar arrow traversal enters battle controls, preserving the unchanged Q05 keyboard harness"
blockers: []

# Implementer handoff — P2-Q08

Author: Implementer. Worktree `/opt/dev/tehom-brainlab-p2-q08`, branch `p2-q08`.
Assignment: [unchanged Coordinator assignment](assignment-implementer.md).
Authority: [plan Q08](../../plans/2026-10-19-db0bad72-poc-002-component-combat.md#q08--selection-screen-gauntlet-flow-and-record-export), [brief §§10–12](../../prototypes/poc-002-component-combat.md), ADR-0006 and ADR-0007. Used ruach-testing and ruach-handoff and read merged Q01/Q02/Q03/Q05/Q06/Q07 handoffs. No workflows loaded or agents launched.

## Changes and authorized exception

Implemented native party/encounter/start controls, empty-party prevention, selection credits, a fresh session per attempt, an export/Reset/Return toolbar, explicit gauntlet continuation, carried HP/Revelation/deaths/Salve summary and victory/defeat results. Battles use `mountBattle` with the existing single Phaser game/audio player. Every transition, including `continue`, uses the session/core (§§10–12).

One session retains the entire gauntlet history. Export downloads complete JSON at any point: before the first command, during combat, after death, between fights and at either final result. Download URLs are revoked on disposal. Reset/Return dispose the battle and attempt; the next launch has fresh state, empty history and no prior preview. No rules or tuning arithmetic is implemented in the run UI.

Implementation commit: `a644871e1a268f87390bfbd86e20195f00d15281`. Changed implementation paths:

- `poc-002-component-combat/src/view/select/index.ts`
- `poc-002-component-combat/src/view/run/session.ts`
- `poc-002-component-combat/src/view/run/index.ts`
- `poc-002-component-combat/tests/q08-run.test.ts`
- `poc-002-component-combat/tests/browser-run.mjs`
- `poc-002-component-combat/src/view/app.ts` — Coordinator-authorized exception below.

The initial S4 stop and unchanged assignment were committed at `1405cce5b0883db94115c37f34caed74c32130c0`: `app.ts` owned the required resources, ignored gauntlets and bypassed Q08 modules for direct battles. The Coordinator explicitly authorized exactly the proposed wiring exception, requiring preservation of the direct route and Q05 harness. This final handoff supersedes that stop report; its historical evidence remains in the earlier commit.

Exact `app.ts` change:

1. Replace the battle mount import with `mountRun` and update the shell comment.
2. Retain an active disposer. The start callback disposes selection and calls `mountRun(panel, request, {content, game, audio, onExit})` for either fight or gauntlet.
3. The exit callback disposes the attempt, clears the query with `history.replaceState`, and mounts a fresh selection screen.
4. For a valid `?screen=battle` URL, replace the null-session battle mount with the same run mount and `{kind: 'fight', ...options}`. Existing URL validation, roster normalization, game/audio creation, canvas dimensions, Scale.FIT and final app teardown remain in place.

No other out-of-scope implementation file changed. Q05's `tests/browser-battle.mjs` is unchanged and passed. No core contracts/content, Q05 implementation, root justfile, prototype README, POC 001, shared code, assets, protected documents or generated agent resources changed. No dependency/version/asset addition, merge, rebase or push. The evidence successor changes only this report; the unchanged assignment is already tracked from the initial stop commit and retained in the final tree.

## Required verification

Commands ran from the worktree root exactly as listed, without extra environment variables. The first sandboxed install exited **1**, `Q01: Docker daemon inaccessible; check availability and socket permissions`. The same bare command and later checks passed using access to the existing Docker socket. No automatic approval rejection, environment override or toolchain workaround occurred. Commits used access to the existing linked-worktree Git metadata.

Checks exercised working content subsequently committed unchanged as the candidate/tested revision. The report successor changes no implementation.

| Exact command | Exit | Key output |
| --- | --- | --- |
| `./poc-002-component-combat/bin/run install` | 0 | Bun 1.4.2; `43 packages installed [1207.00ms]` |
| `./poc-002-component-combat/bin/run typecheck` | 0 | `$ tsc --noEmit` |
| `./poc-002-component-combat/bin/run test` | 0 | `Test Files 12 passed (12)`; `Tests 261 passed (261)`; Q08: 3 tests |
| `./poc-002-component-combat/bin/run build` | 0 | `Q01 assets: prepared 4 files in public/tehom`; `21 modules transformed`; `built in 813ms` |
| `./poc-002-component-combat/bin/run test-browser` | 0 | `Browser total: 619 assertions passed across 3 harnesses`; `Preview stopped (expected)` |
| `./poc-002-component-combat/bin/run replay /tmp/poc-002-browser-aGWkjP/run/gauntlet-after-death-unfinished.json` | 0 | `commands=7 events=104 outcome=player` |
| `./poc-002-component-combat/bin/run replay /tmp/poc-002-browser-aGWkjP/run/gauntlet-between-1.json` | 0 | `commands=16 events=76 outcome=between-fights` |
| `./poc-002-component-combat/bin/run replay /tmp/poc-002-browser-aGWkjP/run/gauntlet-victory.json` | 0 | `commands=46 events=231 outcome=victory` |
| `./poc-002-component-combat/bin/run replay /tmp/poc-002-browser-aGWkjP/run/direct-fight-mid-combat.json` | 0 | `commands=1 events=5 outcome=player` |
| `./poc-002-component-combat/bin/run replay /tmp/poc-002-browser-aGWkjP/run/gauntlet-defeat.json` | 0 | `commands=8 events=111 outcome=defeat` |
| `git diff --check` and `git diff --cached --check` before implementation commit | 0 | No whitespace errors |
| `sha256sum docs/mailbox/poc-002-q08/assignment-implementer.md` | 0 | `f42841b3c5b1dba943dd826934159ca5d70466f352562f1ed4cac38f44a6bda4`, unchanged |

The first development browser invocation exited **1**: initial native Tab focused the attempt toolbar, whose arrows did not enter battle controls. Added toolbar arrow traversal, retaining the battle handler and native Tab behavior. The second invocation passed: unchanged Q05 **302** assertions, Q08 **311**, smoke **6**. Chrome was automatically discovered from the Playwright headless-shell cache; default preview port **4273** was used without a collision or override. No existing test changed or was weakened. Initial and final typecheck/unit/build invocations passed. Vitest does not emit unit assertion totals; none is claimed. The existing informational Phaser chunk-size warning remains; build exits 0.

Browser artifacts are disposable under `/tmp/poc-002-browser-aGWkjP/`. The harness enables actual Chrome downloads, reads the saved JSON, compares full finalState with independently applied public-core commands and replays every export through `replayRecord`. Named JSON copies supply the CLI inputs above; original downloads are under `run/downloads/`. Victory and post-death screenshots are under `run/`; the victory screenshot was visually inspected.

Protected-path check: exit **0**, no output:

```sh
git diff --name-only e9c87a7 -- poc-001-linked-formation shared assets justfile docs/CURRENT.md docs/TASK_LOGS.md poc-002-component-combat/README.md poc-002-component-combat/tests/browser-battle.mjs poc-002-component-combat/src/core
```

## Numbered acceptance evidence

| Q08 item | Evidence |
| --- | --- |
| 1. Party × encounter × preset | `q08-run.test.ts` launches and replays all 147 combinations using test-owned tuning. `browser-run.mjs` selects every one of the seven parties and encounters through the form, samples all three presets and checks launched party/encounter/start. Empty parties disable both launch buttons (§10). |
| 2. Gauntlet order, carry and explicit continue | Browser plays the entire versioned gauntlet witness through visible actor/action/target/Confirm/Continue controls. Both boundaries show exact carried summary values and require an explicit Continue; final victory has no Continue. A separate idle run ends in defeat without Continue. The test-owned unit scenario consumes a Salve, loses Anzû, exports mid-fight, wins all fights and checks carried HP/Revelation/permanent death/remaining uses and recorded continues (§10). |
| 3. JSON export at any point and replay | Actual browser downloads cover a fight before commands, fresh fight after Reset, gauntlet before commands, both between-fights boundaries, victory, an unfinished gauntlet after Girtablilu's death with survivors, defeat and a direct-route fight after an accepted command. Every export checks full finalState equality, accepted-command count and replay to the exported state. Five bare CLI checks above cover unfinished/death/boundary/result cases (§12 amendment). |
| 4. Reset/Return and fresh record | Browser creates a live action preview after a command, clicks Reset, checks selection and absence of a run mount, launches again, checks null pending command and empty committed events, then exports a fresh zero-command state. Return after gauntlet victory also restores selection. The test-owned case proves a defeated attempt cannot affect the next launch (§§11–12). |
| 5. Selection credits | Browser opens the native Credits disclosure and checks CC BY 3.0 attribution and the prepared full-credits link. Uses existing Q07 attribution and no new asset (brief presentation requirements). |

Rule tests replace every numeric leaf of the topology before configuring explicit test-owned values. Browser expectations use public transitions with loaded content; the versioned play line comes from the existing parity fixture, without duplicating v1 tuning assertions (ADR-0006).

## Public additions and limitations

No Q01 public contract was changed, renamed or removed. New Q08 exports:

- `createRunSession(content, request, buildRevision = 'unknown')` from `src/view/run/session.ts`, returning the existing BattleSession.
- `mountRun(root, request, options)` and `RunMountOptions` from `src/view/run/index.ts`; options carry content, existing game/audio, onExit and optional buildRevision. Returns a disposer.

`mountSelect(root, start)`, StartRequest and StartHandler signatures are unchanged. Build revision defaults to the permitted literal `unknown`. Results retain the battle surface for diagnostics beside the result/carried summary, preserving Q05 terminal event-log checks. All required checks completed. No unresolved S1–S6 condition or blocker remains. No independent review, physical audio listening or human playtest is claimed. Root recipes and README assembly remain the integration owner's work.

## README section text for the integration owner

```markdown
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

    ./poc-002-component-combat/bin/run replay /path/to/download.json

Reset and Return to selection discard the attempt. The next launch has fresh
state, no prior commands and no pending preview. Export first to retain a record.
Direct `?screen=battle&encounter=…&party=…&start=…` URLs use the same export and reset
controls.
```

## Handoff validation

Copied `.agents/skills/ruach-handoff` unchanged to `/tmp/p2-q08-handoff.1KT2Bz/ruach-handoff` during the initial stop. Reran `bun install --frozen-lockfile` in that copy for this report: exit **0**, `Checked 6 installs across 7 packages (no changes) [1.00ms]`, Bun 1.4.2.

From the worktree root:

```sh
bun /tmp/p2-q08-handoff.1KT2Bz/ruach-handoff/scripts/validate.ts docs/mailbox/poc-002-q08/implementer.md --repo .
```

Exit **0**, exact stdout:

```json
{"schema_version":1,"ok":true,"report":"/opt/dev/tehom-brainlab-p2-q08/docs/mailbox/poc-002-q08/implementer.md","repo":"/opt/dev/tehom-brainlab-p2-q08","revisions":[{"path":"/source_baseline","resolved":"e9c87a794956b1c7e3333c54c03f5636a6a40abc"},{"path":"/candidate_revision","resolved":"a644871e1a268f87390bfbd86e20195f00d15281"},{"path":"/tested_revision","resolved":"a644871e1a268f87390bfbd86e20195f00d15281"}],"diagnostics":[]}
```

Reran after recording the output: exit **0**, the same three revisions resolved and no diagnostics. Structural validation is not independent implementation review or acceptance.
