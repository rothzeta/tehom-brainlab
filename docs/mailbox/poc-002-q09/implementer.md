task: P2-Q09
status: blocked
outcome: S4 stop before implementation because createAudio has no required cue-observation hook; smallest single-file exception proposed
source_baseline: 19e53365a0320209352f3b822f650479c168618d
inspected_revision: 19e53365a0320209352f3b822f650479c168618d
prior_tested_revision: f0a22439b7107fc046ba27452341ee8ef8bd2e89
artifacts:
  - docs/mailbox/poc-002-q09/assignment-implementer.md
  - docs/mailbox/poc-002-q09/implementer.md
  - docs/mailbox/poc-002-integration/merge-q08.md
  - docs/mailbox/poc-002-integration/merge-q04.md
verification:
  - "Read-only source inspection confirms no createAudio cue-request hook or app observer wiring"
  - "just --list: exit 0, all ten POC 002 recipes present"
  - "git diff --check: exit 0; required 19af724 protected-path diff empty"
  - "Prototype/recipes/READMEs identical to prior tested merge-q08 content; no new Q09 runtime checks executed"
  - "Temporary-copy handoff validator: exit 0, ok true, no diagnostics"
review: not-run
discoveries:
  - "createAudio exposes play/muted/setMuted only; app.ts calls createAudio() directly; battle dispatches committed cues without an observer"
  - "A single optional global observer at the AudioPlayer.play boundary would expose requested cues without changing app wiring or any public signature"
blockers:
  - "Assignment line 20 explicitly requires stopping under S4 if the audio hook is absent and prohibits adding it without further authority"

# Q09 implementer handoff — S4 stop

Author: P2-Q09 Implementer / POC 002 integration owner, 2026-10-19. Assignment: [unchanged Coordinator assignment](assignment-implementer.md). Scope: [plan Q09](../../plans/2026-10-19-db0bad72-poc-002-component-combat.md#q09--integrated-verification-and-end-to-end-harness).

## Blocking finding and requested exception

Confirmed the integration branch starts at merge-q08 tip `19e53365a0320209352f3b822f650479c168618d`. The only initial untracked file was this task's assignment.

The assignment explicitly says: **“If that hook does not already exist in `src/audio/**` or the app wiring, stop (S4) and report the smallest change you need. Do not add it yourself.”** (`assignment-implementer.md:20`). The required hook is absent:

- `src/audio/index.ts:60` declares `createAudio(): AudioPlayer` without options or observer registration. Its returned object exposes only `play`, `muted` and `setMuted`. `play` returns immediately when muted or given no cues, otherwise synthesizes or queues sound.
- `src/view/app.ts:23` calls `createAudio()` directly. It supplies that player to the run UI, with no testing observer.
- `src/view/battle/index.ts:291` calls `options.audio.play(cuesFor(events))` for committed events. No cue requests are exposed to the browser harness.
- Existing Q06 tests inspect a substituted Web Audio boundary. They do not provide the required browser hook on the actual `createAudio` player.

Stopped before adding Q09 tests or editing application code, as required. No checkpoint defect or failing runtime command was observed; this is a missing prerequisite outside the assigned ownership.

**Smallest requested change:** authorize an opt-in cue-request observer in **only** `poc-002-component-combat/src/audio/index.ts`. At the beginning of the returned `play(cues)` method, before the mute early return, notify an optional browser-global test callback with an independent copy of nonempty requested cues. Ignore observer exceptions so observation cannot interrupt gameplay. Leave the `createAudio` and `AudioPlayer` signatures, app wiring, mute/playback behavior, rules and assets unchanged.

Concrete proposed insertion (not applied):

```ts
try {
  const observe = (globalThis as typeof globalThis & {
    __POC002_AUDIO_TEST_OBSERVER__?: (cues: readonly Cue[]) => void;
  }).__POC002_AUDIO_TEST_OBSERVER__;
  if (cues.length && typeof observe === 'function') observe([...cues]);
} catch { /* Test observation must not interrupt a committed action. */ }
```

The Q09 browser harness can install that callback before page scripts run through CDP `Page.addScriptToEvaluateOnNewDocument`, collect the actual requested cue kinds, and drive the UI using keyboard input. It would not infer sound requests from combat events or inject commands. Observing before the mute return measures requests rather than physical sound, as Q09 requires. No callback installed means no observation. Q09-owned tests would cover request-copy isolation, muted requests and throwing observers; existing Q06 tests would be preserved.

No exception has yet been granted for this proposed hook. No candidate or tested **Q09 implementation** revision exists; those fields are intentionally omitted rather than labelling the baseline as a completed/tested Q09. The creating commit of this blocked report and unchanged assignment is returned separately.

## Q09 acceptance mapping (current stop)

| Item | Status and evidence |
| --- | --- |
| 1. Keyboard-only trio gauntlet → victory → export → CLI replay; all six requested cues via hook | **Blocked.** Hook absent; no `browser-gauntlet-e2e.mjs` created or executed. Prior Q08 browser evidence covers a mouse-driven complete gauntlet and downloads, and Q05 covers keyboard actions; neither establishes this combined Q09 requirement. |
| 2. Ten root recipes delegate to the prototype wrapper | Present in root `justfile`; `just --list` rerun successfully. All ten were exercised in [merge-q08](../poc-002-integration/merge-q08.md#full-bare-verification). |
| 3. Complete README: commands, ports, modes, records, harness, credits | Existing assembled prototype README includes these sections after Q01–Q08; root README links it. Q09 end-to-end coverage documentation is not added while item 1 is blocked. |
| 4. Full required bare verification at one final Q09 revision | **Not run for Q09.** Explicit S4 stop precedes implementation/final verification. Prior merge-q08 checks are cited below as historical evidence, not a replacement. |
| 5. POC 001 and shared unchanged | Required `git diff --stat 19af724..HEAD -- poc-001-linked-formation shared docs/CURRENT.md docs/TASK_LOGS.md` exited 0 with empty output at the inspected baseline. No implementation file changed in this task. |

## Whole-plan acceptance mapping

| Criterion | Evidence and limit |
| --- | --- |
| 1. Q01–Q10 meet every numbered list on the integrated revision | **Not yet established: Q09 is blocked.** Q01–Q08 integration evidence: [Q01](../poc-002-integration/merge-q01.md), [Q02](../poc-002-integration/merge-q02.md), [Q03](../poc-002-integration/merge-q03.md), [Q04](../poc-002-integration/merge-q04.md), [Q05](../poc-002-integration/merge-q05.md), [Q06](../poc-002-integration/merge-q06.md), [Q07](../poc-002-integration/merge-q07.md), [Q08](../poc-002-integration/merge-q08.md). Per-checkpoint numbered mappings remain in their source handoffs. [Q10 Architect handoff](../poc-002-q10/architect.md) records the unexecuted human-test protocol, already present in HEAD. No blanket final acceptance is claimed. |
| 2. Brief is the sole rules source; ambiguities resolved by Architect amendments | [Design/Architect report](../poc-002-component-combat/architect.md) records unfinished-export amendment `dcd4b44` and consistency amendment A2 `835a09c`. [Q02 handoff](../poc-002-q02/implementer.md#s1-history-and-authorized-merge) preserves the S1 stop and its resolution through A2. Integration made no rule/tuning changes. This is provenance evidence, not a new independent rules audit. |
| 3. UI records replay through CLI; complete parity corpus replays | [Merge-q08](../poc-002-integration/merge-q08.md#full-bare-verification) records actual downloaded unfinished post-death and complete gauntlet exports replaying through bare CLI, plus the combined parity tests. [Merge-q03](../poc-002-integration/merge-q03.md) and its [source handoff](../poc-002-q03/implementer.md) preserve the 24-record corpus, full corpus tests and hostile rejection. Q09's new keyboard-only export chain remains blocked. |
| 4. Integrated sweep/probe reports exist and are linked | Most recent completed runs are [merge-q08](../poc-002-integration/merge-q08.md#full-bare-verification) at `f0a2243`, with complete stdout verified identical to [merge-q04's durable signal lines](../poc-002-integration/merge-q04.md#summary-signal-lines-from-the-combined-revision). They are historical integrated evidence; final Q09 reruns are pending. |
| 5. POC 001/shared unchanged; no worker CURRENT/TASK_LOGS edits | Current baseline diff from `19af724` is empty for all four protected path groups. Each merge report also records its step-baseline check. This task adds evidence only. |

## Last completed sweep/probe evidence; final Q09 runs pending

No Q09 sweep or probe was executed after the S4 stop. The latest completed integrated runs at `f0a22439b7107fc046ba27452341ee8ef8bd2e89` are preserved in [merge-q08](../poc-002-integration/merge-q08.md), with all 42 exact summary lines and triggering-cell lists available in [merge-q04](../poc-002-integration/merge-q04.md#summary-signal-lines-from-the-combined-revision). Both reports explicitly state `heuristic search; a loss means no win was found`; flags are diagnostic evidence rather than balance gates.

| Signal/coverage | Prior quick sweep | Prior default probe |
| --- | --- | --- |
| Wall time; cells / winning witnesses | 52.813 s; 154 / 115 | 59.300 s; 14 / 9 |
| Opening groups / openings | 14 / 3,648 | 14 / 3,648 |
| Dominance | ok, 0 groups | ok, 0 groups |
| Indifference | FLAG, 1 cell | FLAG, 1 cell |
| Core-best-without-Salves | FLAG, 1 multi-Brood cell | FLAG, 1 multi-Brood cell |
| Disabling-first | ok, 6/70 | ok, 0/6 |
| Revoke-every-Saw | ok, 0/17 | ok, 6/12 |
| Policy matches: disable / core / poison-Guard / Rapture / never-Revelation / Revoke-Saw | All below 75%: 51/154, 48/154, 26/88, 51/154, 48/154, 10/16 | All below 75%: 5/14, 5/14, 2/8, 6/14, 5/14, 2/8 |
| Rare Pincer | ok, 52/321 (16.20%) | ok, 8/61 (13.11%) |
| Rare Hold | FLAG, 12/563 (2.13%) | FLAG, 2/111 (1.80%) |
| Rare Anzu Guard | FLAG, 6/351 (1.71%) | FLAG, 0/82 (0%) |
| Winning duo/trio fights over 10 rounds | FLAG | ok |
| Cleanup over 2 rounds | FLAG | FLAG |
| Trio gauntlet loss | ok, victory 50/86 HP | ok, victory 62/86 HP |
| Duo gauntlet margins | ok; UG victory 3/64, UA no win found 8/62, GA no win found 8/46 | ok; UG victory 29/64, UA victory 20/62, GA victory 4/46 |
| Solo Ugallu Warden route | ok, victory | ok, victory |
| H4 intent predictability / H6 component usability | Human tests required | Human tests required |

Read-only `git diff --stat f0a22439b7107fc046ba27452341ee8ef8bd2e89..HEAD -- poc-002-component-combat justfile README.md` exited 0 with empty output. Thus the current starting application's content is identical to that last tested implementation, but no Q09 success is inferred.

## Coordinator-granted ownership exceptions already integrated

| Checkpoint | Narrow exception | Durable authority/evidence |
| --- | --- | --- |
| Q03 | In Q01-owned `tests/q01-toolchain.test.ts`, replace only replay-deferred assertion with implemented replay dispatch; retain sweep/probe assertions. | [Q03 source handoff](../poc-002-q03/implementer.md#coordinator-authorized-q01-exception); [merge-q03 scope and resolution](../poc-002-integration/merge-q03.md#source-readiness-and-integration). Explicitly confirmed again by merge-step-5 instructions. |
| Q04 | In the same Q01 test, replace only sweep/probe deferral with implemented-script dispatch, retaining Q03 replay dispatch when merged. | [Q04 source exception](../poc-002-q04/implementer.md#s4s5-stop-and-exact-coordinator-exception); [merge-q04 mechanical resolution](../poc-002-integration/merge-q04.md#source-readiness-and-merge). Explicitly authorized in merge step 7. |
| Q08 | Narrow `src/view/app.ts` exception for `mountRun` import, selection/direct-route wiring, existing shared resources and active disposal/reset, preserving URL validation and Q05 harness. | [Q08 source handoff](../poc-002-q08/implementer.md#changes-and-authorized-exception); [merge-q08](../poc-002-integration/merge-q08.md#source-readiness-and-integration). Explicitly confirmed in merge step 8. |

The Q09 audio-hook proposal above is **not** an already-granted exception.

## Checks actually run for this stop report

| Command/action | Exit/result |
| --- | --- |
| `git status --short`, `git branch --show-current`, `git rev-parse HEAD` | Exit 0; expected branch and `19e5336`; only untracked Q09 assignment initially. |
| `cat docs/mailbox/poc-002-q09/assignment-implementer.md` | Exit 0; read the assignment and explicit S4 precondition before implementation. |
| `sed -n '268,340p' docs/plans/2026-10-19-db0bad72-poc-002-component-combat.md` | Exit 0; read Q09, whole-plan acceptance and S1–S6. |
| `cat poc-002-component-combat/src/audio/index.ts` and `cat poc-002-component-combat/src/view/app.ts` | Exit 0; inspected actual player and app wiring. |
| `rg -n 'createAudio|cuesFor|test.?hook|onCue|observe|audio.*hook|requested.*cue' poc-002-component-combat/src poc-002-component-combat/tests` | Exit 0 with matching call sites; inspected matches and confirmed no hook. Expression used alternation, as shown. |
| `just --list` | Exit 0; ten POC 002 recipes, including replay/sweep/probe. |
| `git diff --check` | Exit 0; no output. |
| `git diff --stat 19af724..HEAD -- poc-001-linked-formation shared docs/CURRENT.md docs/TASK_LOGS.md` | Exit 0; empty output. |
| `git diff --stat f0a22439b7107fc046ba27452341ee8ef8bd2e89..HEAD -- poc-002-component-combat justfile README.md` | Exit 0; empty output. |
| `git ls-tree --name-only HEAD docs/playtests/poc-002-human-test-protocol.md` | Exit 0; Q10 template tracked at HEAD. |
| `git diff --cached --quiet` | Exit 0; index empty before this report's staging. |
| `sha256sum docs/mailbox/poc-002-q09/assignment-implementer.md` | Exit 0; `fac041e98fe9489eff51426abf01d359b1786c02bc63ed1ad215eae439e80f70`, unchanged before/after inspection. |

No Q09 tests or assertions were run: **0 new tests, 0 new browser assertions**. The full Q09 install/typecheck/test/build/test-browser/seed replay/sweep/probe list and dev smoke are **not run for this task** because the assignment requires stopping when the prerequisite is absent. Prior merge-q08's 276 tests and 619 browser assertions are historical, not new Q09 verification. No source/test/README/recipe changes, no push or merge into master. Only this report and the unchanged assignment are committed.

## Handoff validation

Reused the unchanged temporary skill copy at `/tmp/p2-int-q01-handoff.KC0xMI/ruach-handoff`; `bun install --frozen-lockfile` there exited 0 (6 installs across 7 packages checked, no changes). From the repository root:

```sh
bun /tmp/p2-int-q01-handoff.KC0xMI/ruach-handoff/scripts/validate.ts docs/mailbox/poc-002-q09/implementer.md --repo .
```

Exit 0; `ok: true`, `diagnostics: []`; all three supplied revision fields resolved. This validates the blocked evidence structure, not Q09 implementation success.
