task: P2-Q05
status: complete
outcome: Playable Phaser battle screen with real-core previews, keyboard controls, two-way part selection and recordable sessions
source_baseline: d6b7249
candidate_revision: 5dd1f795afaa0f7838d6f4717aebbdeca9a537f9
tested_revision: 5dd1f795afaa0f7838d6f4717aebbdeca9a537f9
artifacts:
  - poc-002-component-combat/src/view/battle/index.ts
  - poc-002-component-combat/src/view/battle/model.ts
  - poc-002-component-combat/src/view/session.ts
  - poc-002-component-combat/tests/q05-session-model.test.ts
  - poc-002-component-combat/tests/browser-battle.mjs
  - docs/mailbox/poc-002-q05/assignment-implementer.md
  - docs/mailbox/poc-002-q05/implementer.md
verification:
  - "Bare install, typecheck, test, build and test-browser: final exit 0"
  - "Unit suite: 8 files, 190 tests passed, including 8 Q05 tests"
  - "Browser suite: 308 assertions passed, including 302 battle assertions and 6 existing smoke assertions"
  - "All seven encounters reached a terminal outcome through visible controls; every confirmed command matched its preview events"
review: not-run
discoveries:
  - "Q08 can import createSession(content, initialState, buildRevision?) and pass the resulting BattleSession to mountBattle"
  - "The session immediately publishes its current snapshot on subscribe, publishes accepted events only, and isolates returned snapshots"
  - "Battle rendering reuses the shell Phaser game and canvas; fight creation explicitly excludes presentation objects"
blockers: []

# Implementer handoff — P2-Q05

Author: Implementer. Branch `p2-q05`, worktree `/opt/dev/tehom-brainlab-p2-q05`.
Assignment: [unchanged Coordinator assignment](assignment-implementer.md).
Authority: [plan Q05](../../plans/2026-10-19-db0bad72-poc-002-component-combat.md#q05--phaser-battle-ui), [brief](../../prototypes/poc-002-component-combat.md) §§2, 4, 6, 9, 11–12 and Presentation requirements, ADR-0006 and ADR-0007. Read the merged Q01, Q02, Q06 and Q07 handoffs. No dependency on parallel Q03/Q04 work.

## Changes and scope

The five implementation paths listed in the structured block are entirely within Q05 ownership. `battle/index.ts` replaces the stub with Phaser illustrations, a coordinated 1280×720 native-control overlay, Brood portraits and statuses, components, declared intents and actual enemy-phase forecast damage, Attack/Skills/Guard/Item, target validation, preview deltas/events/forecast, Confirm/Back/End Phase, committed event log, visible mute control and credits dialog. Illustration and hit-region bounds receive the same panel origin and retain their native logical sizes. Invalid action targets are disabled with core rejection codes and descriptive state annotations; parts remain inspectable in the list and diagram.

`battle/model.ts` projects state, preview results and forecast events without damage arithmetic or rule validation. `session.ts` owns live state and accepted-command evidence, calls only the real dispatcher/preview/record APIs, and protects snapshots from consumer mutation. Browser tests operate visible controls through Chrome input, with no command injection or testing API in production.

No existing tests were modified or weakened. No new dependency, version, asset, content value, core type, POC 001, shared path, generated agent source, protected document, root justfile or prototype README changed. No merge, rebase or push was performed. No S1–S6 stop condition was hit.

The later evidence commit contains only this report and the unchanged assignment. Assignment SHA-256: `7bec51a81bce35cd41806038c098c4d596d1625753b872b9a7b07089816de9f3`.

## Numbered acceptance mapping

| Q05 item | Evidence |
| --- | --- |
| 1 | The existing query route now creates a live session for null-session mounts. All seven encounter URLs render Brood panels/portraits, Phaser diagrams, component list, intent panel, the four required menu entries and event log. Existing smoke checks still verify URL party normalization, start preset, logical canvas size and Scale.FIT resizing. |
| 2 | `browser-battle.mjs` checks list → illustration and illustration → list for **every** Warden and Scribe part, including tongue and inscription hand. Before each reverse check it selects another part, so stale highlighting cannot pass. It also checks each region is at least 48×48 logical pixels. Diagram and list share one selection. |
| 3 | The model copies party HP/max/Revelation/cap/statuses/forms, enemy pools/max/armor/poison/Weakened/Wards, round/revision/Salves and intent data. Intent rows show enemy/source part, kind, declared target, type, base, conditional modifiers, riders and forecast recipients with all emitted damage components and amounts. Cancelled/revoked rows retain reason text and line-through styling. Model tests preserve revoked reasons and exact source data; browser tests commit Revoke and check its retained row/reason/style class. |
| 4 | Target/action selection obtains a real session preview, displaying deltas, selected events and the following enemy-phase/end-round result before Confirm. End Phase uses its own result and a null additional forecast. The session test compares every legal command in a test-owned state against the core and verifies preview purity. The browser compares the complete ordered rendered preview events with the committed log after **every** command in all seven full fights, plus selected keyboard/skill/item flows. |
| 5 | Target controls use only preview acceptance to decide disabled state; invalid labels expose the core code and applicable shielded/destroyed/dead/Pinned/not-a-component/full-HP/no-poison annotations. Browser checks the shielded Beast core is disabled with its reason, then inspects that invalid part while a valid attack is pending and verifies Confirm becomes disabled, the rejection code is shown, and the live revision is unchanged. It cannot silently confirm the previous target. The session test proves invalid-target, duplicate/stale and terminal commands preserve state, return empty events, and do not enter records. The view displays a rejected preview code and displays the returned commit error code in its alert if a commit is rejected. |
| 6 | Native Tab, arrow focus traversal, Enter/Space activation and Escape Back are supported. Browser keyboard-only routes select actors, Skills/Stolen Bolt, an alternate target, Guard, Attack, Item/Salve, Confirm, Back and End Phase. The focus/hover regression focuses Confirm, hovers a different actor, presses Enter and checks the exact expected events. Hover never changes selection. |
| 7 | `q05-session-model.test.ts` supplies test-owned content with every numeric topology leaf replaced. Projection tests use deliberately independent damage components and assert exact copied values, recipients, intent event boundaries, cancellation reason, deltas and forecast; no damage formula exists in the model. The model imports only core types. Rules stay in Q02, and all target acceptance/forecasting uses its real preview API. |
| 8 | `browser-battle.mjs` plays a fresh trio through each of the seven encounters to victory or defeat using only actor/menu/Confirm/End Phase controls. Final run outcomes and command counts are recorded below. Screenshots cover Warden selection, intents and an action preview. |

## Verification

Every required application command ran bare from the worktree root, without added environment variables or alternate toolchain modes. Initial install in the filesystem sandbox exited **1**, `Q01: Docker daemon inaccessible; check availability and socket permissions`. Rerunning that same command with access to the existing local Docker socket succeeded. Subsequent Docker checks used sandbox escalation; no automatic approval rejection occurred.

| Exact command | Final exit | Key output |
| --- | --- | --- |
| `./poc-002-component-combat/bin/run install` | 0 | `bun install v1.4.2 (744846f84)`; `43 packages installed [884.00ms]` |
| `./poc-002-component-combat/bin/run typecheck` | 0 | `$ tsc --noEmit` |
| `./poc-002-component-combat/bin/run test` | 0 | `Test Files 8 passed (8)`; `Tests 190 passed (190)`; Q05 `8 tests`. Vitest does not emit an assertion total. |
| `./poc-002-component-combat/bin/run build` | 0 | `Q01 assets: prepared 4 files in public/tehom`; `19 modules transformed`; final `built in 782ms` |
| `./poc-002-component-combat/bin/run test-browser` | 0 | `Browser total: 308 assertions passed across 2 harnesses`; battle 302, smoke 6; `Preview stopped (expected)` |
| `git diff --check` | 0 | No whitespace errors |
| `git diff --cached --check` before implementation commit | 0 | No whitespace errors; only the five Q05 implementation paths staged |

Final checks exercised the working content committed unchanged as `candidate_revision`/`tested_revision`. The later evidence commit changes no implementation or test content. The build emits the existing informational Phaser chunk-size warning and succeeds.

Development checks: three typechecks exited **1** for an optional DOM sibling without a null fallback, a test's union-event narrowing, and the final part-target assignment's narrowing; each was fixed, and four typechecks exited **0**. All five unit runs exited **0**, with 190 tests each. All five direct build invocations exited **0**. Eight browser invocations ran: the first two exited **1** during startup because the view initially passed presentation objects in factory options; the next two exited **1** because the CDP driver's Enter event omitted its text character; the fifth passed **302** assertions; the sixth exited **1** when a tightened navigation readiness check read a temporarily absent document element; the seventh passed **305**; the final invocation passed **308**, adding the invalid-part confirmation regression. The final selection correction makes action defaults and diagram selection agree, and disables confirmation when a newly inspected part is invalid. These fixes preserve all existing assertions and improve the new driver's input/navigation correctness.

Final full-fight evidence (trio, fresh; simple direct-attack UI policy, **not** a balance or optimal-play claim):

| Encounter | Outcome | Accepted UI commands |
| --- | --- | --- |
| guard | victory | 9 |
| scribe | victory | 9 |
| beast | victory | 17 |
| guard-scribe | defeat | 27 |
| beast-scribe | defeat | 24 |
| guard-beast | defeat | 24 |
| warden | victory | 15 |

Browser output directory: `/tmp/poc-002-browser-G4Zx0P`. Required screenshots, captured by the harness and visually inspected:

- `/tmp/poc-002-browser-G4Zx0P/battle/warden-selection.png`
- `/tmp/poc-002-browser-G4Zx0P/battle/intent-panel.png`
- `/tmp/poc-002-browser-G4Zx0P/battle/preview.png`

Disposable screenshots remain outside the repository. The harness uses the installed Playwright Chrome headless shell, default preview port 4273, and stops only its own named Docker preview container.

## Public API and Q08 integration

No addition, rename or removal in Q01 `src/core/types.ts`; `BattleSession` and `BattleMountOptions` signatures remain unchanged. Presentation-only additions:

- `createSession(content: Content, initialState: BattleState, buildRevision = 'unknown'): BattleSession`, exported from `src/view/session.ts`. Q08 can construct the initial state with `createFight` or `createGauntlet` and supply this session to `mountBattle`. `commit` accepts every declared command, including `continue`, through `applyCommand`.
- `subscribe` immediately receives current state and empty events, then receives accepted command state/events; its returned function unsubscribes. Rejections do not publish. Returned content/state/result/record snapshots are independent of live session state. Only accepted commands enter `exportRecord()`; unfinished fight exports replay in the unit test. Full gauntlet-record hardening remains Q03's responsibility.
- `battleModel(state, forecastEvents, preview?)` is a pure display projection, exported from `src/view/battle/model.ts`.

`mountBattle` honors a supplied session's content/state. When passed null by Q01's app, it constructs a fight using only `{encounterId, party, start}`. It reuses the supplied Phaser game, stops the prior active scenes, temporarily reparents the existing canvas stage into its coordinated surface, and removes its scene/subscription/observer/controls on disposal while restoring the stage. Q08 can own the outer screen/continue/export flow without changes to this interface. Audio receives committed events only; its initial mute choice is retained in the shared audio player, and the visible Unmute/Mute button changes it.

Limitations: diagnostics use scrollable panels and literal event details; they are a prototype presentation. Default selection and gauntlet UI remain Q08's scope. No subjective speaker listening, human usability test, external playtest or independent review was performed or claimed. No required assigned check remains unrun, and no blocker remains.

## README section text for the integration owner

```markdown
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
```

## Handoff validation

Copied the unchanged `.agents/skills/ruach-handoff` into `/tmp/p2-q05-handoff.m8Q2N6/ruach-handoff` with:

```sh
cp -R .agents/skills/ruach-handoff /tmp/p2-q05-handoff.m8Q2N6/ruach-handoff
```

Ran `bun install --frozen-lockfile` in that copied directory: exit **0**, Bun 1.4.2, `6 packages installed [22.00ms]` (ajv 8.20.0 and yaml 2.9.1).

Validation command and exact result follow below.

From the worktree root:

```sh
bun /tmp/p2-q05-handoff.m8Q2N6/ruach-handoff/scripts/validate.ts docs/mailbox/poc-002-q05/implementer.md --repo .
```

Exit **0**. Exact stdout:

```json
{"schema_version":1,"ok":true,"report":"/opt/dev/tehom-brainlab-p2-q05/docs/mailbox/poc-002-q05/implementer.md","repo":"/opt/dev/tehom-brainlab-p2-q05","revisions":[{"path":"/source_baseline","resolved":"d6b7249babf1e303dbace0be2303bc6bce1841cd"},{"path":"/candidate_revision","resolved":"5dd1f795afaa0f7838d6f4717aebbdeca9a537f9"},{"path":"/tested_revision","resolved":"5dd1f795afaa0f7838d6f4717aebbdeca9a537f9"}],"diagnostics":[]}
```

Reran after recording the output: exit **0**, same resolved revisions and no diagnostics. Structural validation does not imply independent review or acceptance.
