task: P2-Q08
status: needs-decision
outcome: Stopped before implementation at S4 because app routing and shared presentation resources are outside Q08 ownership
source_baseline: e9c87a7
artifacts:
  - docs/mailbox/poc-002-q08/assignment-implementer.md
  - docs/mailbox/poc-002-q08/implementer.md
verification: not-run
review: not-run
discoveries:
  - "The app start callback ignores gauntlet requests and does not expose its Phaser game or audio player to selection"
  - "The direct battle route bypasses Q08-owned modules, so Q08 cannot add attempt export to that route through the assigned mounting interfaces"
blockers:
  - "S4: authorize a narrow src/view/app.ts wiring change or assign that wiring to its owner before resuming Q08"

# Implementer handoff — P2-Q08

Author: Implementer. Worktree `/opt/dev/tehom-brainlab-p2-q08`, branch `p2-q08`.
Assignment: [unchanged Coordinator assignment](assignment-implementer.md).
Inspected baseline: `e9c87a794956b1c7e3333c54c03f5636a6a40abc`.

## Stop condition and concrete decision

The [plan](../../plans/2026-10-19-db0bad72-poc-002-component-combat.md#non-goals-and-stop-conditions) requires stopping at **S4: “a file outside the checkpoint's owned paths needs editing.”** The assignment repeats that requirement. No application or test code was changed before stopping.

At this baseline, [app.ts](../../../poc-002-component-combat/src/view/app.ts) owns the Phaser game and shared audio player (lines 18–23). Its `start` callback handles only fights (lines 26–29); a gauntlet request is ignored. Its battle route calls `mountBattle` directly with a null session (line 41), bypassing both Q08-owned directories. Its default route calls `mountSelect(panel, start)` (line 43), passing neither the game nor audio.

The fixed [selection interface](../../../poc-002-component-combat/src/view/select/index.ts) supplies only a root and start callback. [mountBattle](../../../poc-002-component-combat/src/view/battle/index.ts) requires the existing game/audio resources. The [Q05 handoff](../poc-002-q05/implementer.md#public-api-and-q08-integration) confirms that Q08 should construct a session and supply it to `mountBattle`, reusing the shell game/canvas. There is no existing caller for a Q08 run controller. Implementing that controller under `src/view/run/` alone cannot connect it to these app routes.

**Question for the Coordinator:** May Q08 make the following narrowly bounded change to `poc-002-component-combat/src/view/app.ts`, or will its owner supply equivalent wiring?

1. Import the Q08 run mount/controller and route both selected fight and gauntlet requests through it, passing the existing content, Phaser game, audio player and return-to-selection callback.
2. Route valid direct battle URLs through the same run mount, preserving current encounter/party/start validation and roster normalization. This lets current-attempt export and Reset also cover fights launched through those URLs.
3. Dispose the previous selection/run mount when switching screens and dispose the active mount during app teardown. Keep the existing single canvas, logical size and Scale.FIT configuration.

All selection controls, session creation, continuation, carry summary, results, export/download, reset behavior and new tests would remain inside Q08-owned paths. The proposed exception needs no core contract change, tuning, dependency, asset, battle implementation change, README change or root recipe change. It has **not** been implemented. No other stop condition was identified.

## Acceptance status and verification

Read the assignment, policy, Implementer role, SCHEMA, ruach-testing and ruach-handoff skills, plan/contracts/ownership/stop conditions, brief, ADR-0007, and merged Q01/Q02/Q03/Q05/Q06/Q07 handoffs. Inspected the selection stub, app, session, battle mounting/teardown and existing browser checks. Loaded no workflow and launched no agents.

| Q08 acceptance item | Status/evidence |
| --- | --- |
| 1. Party × encounter × start launches | Not implemented or verified; app routing wiring needs the S4 decision above. |
| 2. Gauntlet order, carry and explicit continue | Not implemented or verified; the existing app callback ignores gauntlets. Core support already exists, but no Q08 UI evidence is claimed. |
| 3. Export at any point, including deaths and between fights; browser replay | Not implemented or verified; no browser-exported record exists for this task. |
| 4. Reset and fresh record without stale preview/state | Not implemented or verified. Proposed disposal/wiring supports implementing this after authorization. |
| 5. Selection credits | Not implemented or verified. |

Required application checks were **not run**, because the assignment requires stopping before implementation at S4. No application command exit codes, test counts or browser assertions are claimed:

- `./poc-002-component-combat/bin/run install`
- `./poc-002-component-combat/bin/run typecheck`
- `./poc-002-component-combat/bin/run test`
- `./poc-002-component-combat/bin/run build`
- `./poc-002-component-combat/bin/run test-browser`
- `./poc-002-component-combat/bin/run replay <a record exported by your browser harness>`

There is no implementation commit or tested implementation revision; `candidate_revision` and `tested_revision` are intentionally omitted rather than assigning the unchanged baseline as a completed implementation. This evidence-only handoff and unchanged assignment are committed on `p2-q08`. No merge, rebase or push was performed. No public contracts were added. README section text is deferred until there is implemented behavior to document.

## Artifact checks

Only changed paths: this report and the unchanged assignment, both in the assigned mailbox. Assignment SHA-256 before work: `f42841b3c5b1dba943dd826934159ca5d70466f352562f1ed4cac38f44a6bda4`.

Copied `.agents/skills/ruach-handoff` unchanged to `/tmp/p2-q08-handoff.1KT2Bz/ruach-handoff`. Ran `bun install --frozen-lockfile` there: exit **0**, `6 packages installed [23.00ms]` with Bun 1.4.2.

From the worktree root:

```sh
bun /tmp/p2-q08-handoff.1KT2Bz/ruach-handoff/scripts/validate.ts docs/mailbox/poc-002-q08/implementer.md --repo .
```

Exit **0**, exact stdout:

```json
{"schema_version":1,"ok":true,"report":"/opt/dev/tehom-brainlab-p2-q08/docs/mailbox/poc-002-q08/implementer.md","repo":"/opt/dev/tehom-brainlab-p2-q08","revisions":[{"path":"/source_baseline","resolved":"e9c87a794956b1c7e3333c54c03f5636a6a40abc"}],"diagnostics":[]}
```

`git diff --check`: exit **0**, no output. `sha256sum docs/mailbox/poc-002-q08/assignment-implementer.md`: exit **0**, hash matches the pre-work value above. `git status --short --branch`: exit **0**, branch `p2-q08`, only the assigned mailbox directory untracked before staging. Validation checks the report structure and baseline resolution, not Q08 implementation or acceptance.
