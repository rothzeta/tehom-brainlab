task: P2-Q06
status: complete
outcome: Six event-derived Web Audio cues implemented with gesture initialization and session mute
source_baseline: 87b1441
candidate_revision: b3fc648001edf3c2caedc49b31597056c2596680
tested_revision: b3fc648001edf3c2caedc49b31597056c2596680
artifacts:
  - poc-002-component-combat/src/audio/index.ts
  - poc-002-component-combat/tests/q06-audio.test.ts
  - docs/mailbox/poc-002-q06/assignment-implementer.md
  - docs/mailbox/poc-002-q06/implementer.md
verification:
  - "Bare install/typecheck/test/build: exit 0 using the assigned Docker mode; 81 tests passed, including 44 Q06 tests"
  - "git diff --check and git diff --cached --check: exit 0"
review: not-run
discoveries:
  - "Audio starts muted, preserving Q01 behavior; the UI should call setMuted(false) to enable playback"
  - "cuesFor maps each event independently, including applied retaliation and Revelation-burn damage; it does not deduplicate command summaries"
blockers: []

# Implementer handoff — P2-Q06

Author: Implementer. Branch `p2-q06`, worktree `/opt/dev/tehom-brainlab-p2-q06`.
Assignment: [unchanged Coordinator assignment](assignment-implementer.md).
Authority: [plan Q06](../../plans/2026-10-19-db0bad72-poc-002-component-combat.md#q06--synthesized-audio-cues), [brief §§4, 5, 7 and presentation requirements](../../prototypes/poc-002-component-combat.md), [ADR-0007](../../adr/0007-poc-002-component-combat.md), [Q01 handoff](../poc-002-q01/implementer.md). Tests follow ADR-0006 and ruach-testing.

## Changes and scope

Replaced the silent audio stub with a pure event mapper and six Web Audio oscillator/envelope sounds. Document listeners initialize/resume the context on pointer or keyboard gestures; `play` also recognizes an active user gesture before document dispatch. Initial asynchronous resume is supported. Missing Web Audio, failed construction and blocked resume are silent. A master output gain mutes current sounds and future playback. The player retains its mute value across play calls and gestures for its lifetime (the app session).

Changed implementation paths, both inside the Q06 ownership row:

- `poc-002-component-combat/src/audio/index.ts`
- `poc-002-component-combat/tests/q06-audio.test.ts`

The evidence commit adds only this report and the unchanged assignment. Assignment SHA-256: `54f76c6f7d427d051d5540f6854d99158d4e7092f43566922d11f5cf8f739f37`.

No new dependencies, versions, assets or public contracts. Existing `Cue`, `AudioPlayer`, `cuesFor` and `createAudio` names/signatures are preserved; `src/core/types.ts` is unchanged. No Q02 function is called or imported. No merge, rebase or push was performed. No S1–S6 stop condition was hit.

## Acceptance evidence

| Item | Evidence |
| --- | --- |
| 1. Pure, deterministic mapping, tested per event kind | `cuesFor` and 24 typed event-kind fixtures cover every Q01 event. Positive `damage.applied` on part/Brood/retaliation events and positive Revelation-burn `applied` yield hit; zero applied damage is silent. Armor or Ward ≥1 yields armor, including fully blocked hits; Guard/Hold/Weakened alone do not. Destruction, poison application/tick, Revelation gain/transformation start, and Brood/enemy death map to the named cues. Other kinds/statuses remain silent. Frozen input, independent output arrays and repeated equal results verify purity/determinism without browser support. |
| 2. Distinct synthesis, lazy gesture initialization, safe unsupported audio, session mute | The module header documents all six waveforms, pitch sweeps and envelopes. Web Audio boundary tests verify a nonzero output path for each cue, pairwise distinct signatures, finite positive frequencies and bounded envelopes. Tests cover no context before a gesture, pointer and keyboard initialization, direct play during activation, suspended and asynchronous resume, mute during resume, repeated mute persistence, silencing scheduled output, missing browser/API, constructor failure and rejected resume. Manual listening note below states the unverified subjective check. |
| 3. No feedback into rules; only core type imports | The audio module's only import is `import type { Event } from '../core/types'`. Inspection command `rg -n '^import' poc-002-component-combat/src/audio/index.ts` prints only that import. Mapping reads supplied events, never invokes rules, and never mutates them. Tests construct Q01 events directly; production build and strict typecheck pass. |

The tests use test-owned event values, without shipped content or assertions about v1 combat tuning. Audio frequencies and envelope timings are presentation choices, not combat tuning. Tests assert distinctness and output properties rather than exact pitches or timings.

## Verification

All application commands below ran bare from the worktree root, with no extra environment variables. Initial sandbox attempts of all four exited **1** with `Q01: Docker daemon inaccessible; check availability and socket permissions`. Diagnostic `docker info` exited **1** with `permission denied while trying to connect to the docker API at unix:///var/run/docker.sock`. The same bare commands were rerun successfully with approved sandbox escalation; no environment override or host-mode workaround was used.

| Exact command | Exit | Key result |
| --- | --- | --- |
| `./poc-002-component-combat/bin/run install` | 0 | `bun install v1.4.2 (744846f84)`; `43 packages installed [811.00ms]` |
| `./poc-002-component-combat/bin/run typecheck` | 0 | `$ tsc --noEmit`; rerun after final test changes, also exit 0 |
| `./poc-002-component-combat/bin/run test` | 0 | Final run: `Test Files 4 passed (4)`; `Tests 81 passed (81)`; Q06 `44 tests`, existing Q01 `37 tests`. Earlier run before delayed-resume coverage: 80 passed. The runner does not emit an assertion total. |
| `./poc-002-component-combat/bin/run build` | 0 | `Q01 assets: prepared 4 files in public/tehom`; `11 modules transformed`; `built in 593ms` |
| `git diff --check` | 0 | No whitespace errors |
| `git diff --cached --check` | 0 | No whitespace errors before implementation commit |

Checks ran on the implementation content committed unchanged as `candidate_revision`; the final typecheck and test run include the final test file. The build preceded only test refinements. Build emitted the existing bundled-Phaser warning that a minified chunk exceeds 500 kB; it did not fail.

Manual listening note: **subjective listening was not performed**; this worker did not hear physical speaker output. Automated tests establish distinct synthesized signal definitions and routed Web Audio output, not perceptual quality. Suggested listening pass after integration: unmute on a gesture, trigger hit/armor, destruction, poison, Revelation and death, then mute during a death sound and verify silence. No human playtest, browser integration test or independent review is claimed. Q05/Q08 UI wiring and the visible mute toggle remain their owners' work.

## README section for the integration owner

```markdown
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
```

## Handoff validation

Copied the skill without modifying generated sources:

```sh
scratch_dir=$(mktemp -d /tmp/p2-q06-handoff.XXXXXX)
cp -R .agents/skills/ruach-handoff "$scratch_dir/ruach-handoff"
cd "$scratch_dir/ruach-handoff"
bun install --frozen-lockfile
```

Resolved copy: `/tmp/p2-q06-handoff.JuMw4Y/ruach-handoff`. Install exit **0**, `6 packages installed [21.00ms]` (Bun 1.4.2, ajv 8.20.0, yaml 2.9.1).

From the worktree root:

```sh
bun /tmp/p2-q06-handoff.JuMw4Y/ruach-handoff/scripts/validate.ts docs/mailbox/poc-002-q06/implementer.md --repo .
```

Validation exit **0**. Exact stdout:

```json
{"schema_version":1,"ok":true,"report":"/opt/dev/tehom-brainlab-p2-q06/docs/mailbox/poc-002-q06/implementer.md","repo":"/opt/dev/tehom-brainlab-p2-q06","revisions":[{"path":"/source_baseline","resolved":"87b14414bde8c7610a8c3723c018f8056aa41c35"},{"path":"/candidate_revision","resolved":"b3fc648001edf3c2caedc49b31597056c2596680"},{"path":"/tested_revision","resolved":"b3fc648001edf3c2caedc49b31597056c2596680"}],"diagnostics":[]}
```

Reran the same validation after recording its output: exit **0**, same resolved revisions and no diagnostics.
