task: P2-Q04
status: blocked
outcome: Partial Q04 implementation preserved; S4/S5 conflict with unconditional Q01 deferred-command tests requires Coordinator decision
source_baseline: d6b7249
candidate_revision: e99df773d85b2e4ef09f9d919b7482dcffcf4661
tested_revision: e99df773d85b2e4ef09f9d919b7482dcffcf4661
artifacts:
  - docs/mailbox/poc-002-q04/assignment-implementer.md
  - docs/mailbox/poc-002-q04/implementer.md
  - poc-002-component-combat/src/harness/
  - poc-002-component-combat/scripts/sweep.ts
  - poc-002-component-combat/scripts/probe.ts
  - poc-002-component-combat/tests/q04-harness.test.ts
verification:
  - "Bare install: initial sandbox exit 1, identical command with Docker access exit 0, 43 packages installed"
  - "Bare typecheck: initial sandbox exit 1; two runs with Docker access exit 0"
  - "Bare test: exit 1; 191 passed, 3 failed across 8 files"
  - "Bare probe: exit 0; complete actual stdout reproduced below"
  - "Bare build and sweep --quick: not run after mandatory stop"
  - "git diff --cached --check before implementation commit: exit 0"
review: not-run
discoveries:
  - "Q01 tests require sweep/probe to remain unimplemented even after their scripts exist; this contradicts Q04 acceptance"
  - "Q04 breakpoint scan test exceeded Vitest's 5000ms timeout and still needs correction"
  - "Existing bin/run and scripts/run.sh dispatch Q04 scripts without any launcher changes"
blockers:
  - "S4/S5: Coordinator authorization needed to update two Q01-owned obsolete deferred-command assertions"
  - "Remaining Q04 implementation review, breakpoint timeout correction, build and sweep verification are incomplete"

# Implementer handoff — P2-Q04 (blocked)

Author: Implementer. Worktree `/opt/dev/tehom-brainlab-p2-q04`, branch `p2-q04`.
Assignment: [unchanged assignment](assignment-implementer.md). Authority: [Q04 plan and stop rules](../../plans/2026-10-19-db0bad72-poc-002-component-combat.md), [brief §§1–12, hypotheses and A2-12](../../prototypes/poc-002-component-combat.md), ADR-0006/ADR-0007. Read the merged Q01 and Q02 handoffs. Used ruach-testing and ruach-handoff; no workflows or additional agents.

## Stop and requested decision

The required bare test run exposed a pre-existing contract conflict at `poc-002-component-combat/tests/q01-toolchain.test.ts:7–10`. The unconditional table includes `sweep` and `probe`; it requires both to exit 2 and name their implementing checkpoint. These assertions were appropriate before scripts existed. Q01 acceptance explicitly limits this behavior to **until its script exists**, and Q04 requires working scripts. With the Q04 scripts present, the Q01 tests invoke the normal Docker path inside the test container, where Docker is unavailable, and receive exit 1. They fail before testing any Q04 behavior.

The assignment says to stop on S1–S6 and permits edits only to Q04-owned paths. S4 says a file outside those paths needing editing is a stop; S5 addresses changing existing test expectations. I preserved all Q01 tests, stopped implementation, and asked for authorization to update only the two obsolete deferred-command assertions so they apply while their script is absent. No answer or expanded authority had arrived when this blocked report was prepared. No rule or public contract was changed.

**Question for Coordinator:** authorize a bounded Q01 test update that preserves the missing-script exit-2 contract while recognizing implemented commands, then resume Q04? Otherwise assign that update to the Q01/integration owner and provide the authorized resumption instructions. No merge/rebase is authorized by the current assignment.

## Partial change and ownership

The candidate is explicitly **WIP, not ready for acceptance or integration**. Added nine files, all within Q04 implementation ownership:

- `poc-002-component-combat/src/harness/search.ts`: deterministic command-level beam, solo exhaustive prefix through four completed phases, state deduplication, all-order opening enumeration including forfeitures, witnesses through the public dispatcher.
- `poc-002-component-combat/src/harness/policies.ts`: six deterministic fixed-priority policies.
- `poc-002-component-combat/src/harness/signals.ts`: action shares, HP/round/Salve/cleanup metrics, A2-12 signal calculations.
- `poc-002-component-combat/src/harness/report.ts`: scenario matrix, probe groups, comparison and report formatting.
- `poc-002-component-combat/src/harness/breakpoints.ts`: independent ±1/±2 numeric variants, content-validation rejections and fresh single-action breakpoint scan.
- `poc-002-component-combat/src/harness/cli.ts`: CLI flags, stdout and optional JSON output. JSON paths in the repository are rejected; `/dev/stdout` supports persistence through the unchanged Docker wrapper.
- `poc-002-component-combat/scripts/sweep.ts` and `scripts/probe.ts`: wrapper entry points.
- `poc-002-component-combat/tests/q04-harness.test.ts`: 12 test-owned-content contract tests.

No changes to root justfile, prototype README, core/content/public contracts, other checkpoints' tests, POC 001, shared, assets, generated agent files or protected documents. No dependency changes, merges, rebases or pushes. This report and the unchanged assignment are the separate evidence commit. The candidate/tested revision identifies the implementation content actually checked; checks ran on the working content subsequently committed without implementation changes.

## Exact verification and limitations

All assigned application commands were run from the worktree root without added environment variables. Docker socket access required escalation; no automatic approval rejection occurred and no alternate runtime mode was used.

| Command | Exit | Evidence |
| --- | --- | --- |
| `./poc-002-component-combat/bin/run install` (sandbox) | 1 | `Q01: Docker daemon inaccessible; check availability and socket permissions` |
| `./poc-002-component-combat/bin/run install` (Docker access) | 0 | `bun install v1.4.2`; `43 packages installed [944.00ms]` |
| `./poc-002-component-combat/bin/run typecheck` (sandbox) | 1 | Same Docker socket message |
| `./poc-002-component-combat/bin/run typecheck` (Docker access, twice) | 0 | `$ tsc --noEmit`; second run includes Q04 tests |
| `./poc-002-component-combat/bin/run test` | 1 | `Test Files 2 failed | 6 passed (8)`; `Tests 3 failed | 191 passed (194)` |
| `./poc-002-component-combat/bin/run probe > /tmp/p2-q04-probe-development.txt` | 0 | 204 lines, 58,792 bytes; actual stdout below |
| `./poc-002-component-combat/bin/run build` | Not run | Mandatory stop |
| `./poc-002-component-combat/bin/run sweep --quick` | Not run | Mandatory stop; runtime target remains unverified |
| `git diff --cached --check` | 0 | No output before implementation commit |

Failing tests: Q01 `sweep names its implementing checkpoint and exits 2`; Q01 `probe names its implementing checkpoint and exits 2`; Q04 `uses content-defined single-action exact breakpoints and scans every numeric leaf at four deltas`, which exceeded the 5000ms timeout (5438ms). Q04's other 11 tests passed. Vitest does not report assertion counts. No tests were weakened or removed. The Q04 timeout is within owned scope to fix on authorized resumption. Full breakpoint CLI verification and JSON CLI verification were not run. Default width-200 sweep and quick performance were not established. Search quality, fixed-policy interpretation, complete matrix metrics and all output paths still need final review. No-win results can describe an unfinished best candidate, never a proof of impossibility.

A development-only local `bun -e` counted trio Warden openings: 1,430 both without and with Salves (fresh round one cannot heal full-health Brood). This is not an assigned verification substitute. Enumeration includes early End Phase, hence it exceeds the tuning-check experiment's joint-opening count. No v1 count is frozen by tests.

## Numbered acceptance mapping (partial, not a completion claim)

| Q04 item | Evidence and remaining work |
| --- | --- |
| 1 | `sweep` builds 7 parties × 7 encounters × 3 starts plus 7 gauntlets; defaults width 200/depth 30, solo prefix 4; quick width 8. Metrics implemented. Full sweep and runtime not verified. |
| 2 | Probe ran all distinct fresh Warden joint openings, all orders with forfeitures and commuting-equivalent deduplication, with/without Salves. Continuation width 1 is explicitly disclosed and overridable via `--probe-width`. Per-class best/gaps and witnesses are in actual stdout below. |
| 3 | Six fixed policies implemented and run in the probe. Replayability/purity test passed. Final policy review remains. |
| 4 | Both report paths format A2-12 signals and the mandatory heuristic caveat. Probe output below supplies actual values. Sweep-specific values not obtained. Sweep opening analysis is explicitly restricted to the named probe encounter (default Warden), with other encounters sampled by beam. No balance conclusion is claimed. |
| 5 | Independent perturbation and exact/overkill scan implemented. Test timed out; CLI scan not run, so incomplete. Scan currently covers fresh untransformed initial states with declaration-time Wards. |
| 6 | Forced-win witness, dominance boundary, indifference boundary, policy threshold and input-purity tests passed with test-owned numbers replacing every shipped numeric leaf. |
| 7 | Two small sweeps compare equal human-readable output; test passed. Full v1 determinism not separately verified. |

## Actual probe signal summary

These are provisional heuristic output from the stopped candidate, not acceptance gates or validated balance findings. Best continuation width is 1, depth 30 rounds per fight. There are 14 opening groups (7 parties × 2 item modes), 3,648 openings including forfeitures. Probe also runs 14 fresh fight/gauntlet comparison cells.

| Signal | Actual value |
| --- | --- |
| Dominance | ok: 0 encounter/class groups meet six-party/10-HP rule |
| Indifference | FLAG: 1 cell, G+A Warden with Salves |
| Core best without Salves | FLAG: 1 cell, G+A Warden |
| Disabling first | ok: 0/1 winning Girtablilu comparison lines |
| Revoke every Saw | ok: 0/2 declared Saws revoked in winning Anzû lines |
| Always-disable match | FLAG: 13/14 cells |
| Always-core match | FLAG: 13/14 cells |
| Poison-then-Guard match | FLAG: 6/8 cells |
| Rapture-as-soon-as-possible match | FLAG: 12/14 cells |
| Never-use-Revelation-skills match | FLAG: 13/14 cells |
| Revoke-every-Saw policy match | FLAG: 6/8 cells |
| Rare Pincer | ok: 30/42 (71.43%) |
| Rare Hold | FLAG: 0/44 (0%) |
| Rare Anzû Guard | FLAG: 0/28 (0%) |
| More than 10 rounds | ok: no winning duo/trio comparison cells triggered |
| Cleanup >2 rounds | ok: no comparison cells triggered |
| Trio gauntlet | FLAG: no win found, candidate 52/86 HP |
| Duo gauntlet margins | ok: no wins found; candidates UG 4/64, UA 10/62, GA 28/46 |
| Solo Ugallu Warden route | FLAG: no win found by this heuristic |
| H4/H6 | Human tests required, not automated |

The named stdout file is outside the repository and may disappear with environment cleanup. Its complete human-readable contents are preserved below as durable evidence. No sweep output exists because that command was not run.

## README section proposal for integration owner

**Draft only; do not publish as delivered until Q04 is completed and accepted.**

```markdown
## Scenario harness (Q04)

Run `./poc-002-component-combat/bin/run sweep --quick` from the repository root for the scenario matrix and policy comparisons; omit `--quick` for the default beam width 200. Depth defaults to 30 rounds per fight and the exhaustive solo prefix to 4 rounds. Override with `--width`, `--depth` and `--solo-depth`.

`./poc-002-component-combat/bin/run probe --encounter warden` enumerates distinct joint round-1 openings with and without Salves, including action-order effects and forfeitures, and searches continuations with beam width 1 by default (`--probe-width N`). Reports show winning HP, rounds, Salves, action shares, best classes and HP gaps, policy comparisons and falsification flags. Sweep's opening analysis covers the named probe encounter; other encounter lines are beam samples.

Use `probe --breakpoints` for independent ±1/±2 changes to every numeric content leaf and fresh one-action exact/overkill breakpoints. Invalid numeric variants are reported. For JSON use `--json PATH` outside the repository. Docker output files are container-local unless streamed: `./poc-002-component-combat/bin/run probe --json /dev/stdout > /tmp/poc002-probe.json` writes JSON on the host and the human report to stderr.

Every report states: heuristic search; a loss means no win was found. Flags are experiment evidence, not balance gates.
```

## Complete actual probe stdout

<details>
<summary>Candidate probe report (204 lines)</summary>

```text
Q04 probe content=poc-002-content-v1
heuristic search; a loss means no win was found
beam width=200, depth=30 rounds per fight; exhaustive solo prefix=4 completed rounds; probe continuation width=1
Objective: winning surviving HP, then fewer rounds. Beam priority: fight progress, HP, retained Salves and damage. Stable generation order breaks ties.
Every distinct joint round-1 opening for warden, fresh, with/without Salves. All action orders and forfeitures; commuting equivalents collapsed.
CELL ugallu/warden/fresh no-win-found rounds=1 fight-rounds=1 hp=40/40 surviving={"ugallu":40} salves-used=0 actions={"ugallu/claw":1}
POLICY ugallu/warden/fresh always-disable no-win-found rounds=7 fight-rounds=7 hp=0/40 surviving={"ugallu":0} salves-used=2 actions={"ugallu/claw":0.7142857142857143,"ugallu/salve":0.2857142857142857}
POLICY ugallu/warden/fresh always-core no-win-found rounds=6 fight-rounds=6 hp=0/40 surviving={"ugallu":0} salves-used=2 actions={"ugallu/claw":0.6666666666666666,"ugallu/salve":0.3333333333333333}
POLICY ugallu/warden/fresh Rapture-as-soon-as-possible no-win-found rounds=6 fight-rounds=6 hp=0/40 surviving={"ugallu":0} salves-used=2 actions={"ugallu/rend":0.6666666666666666,"ugallu/salve":0.3333333333333333}
POLICY ugallu/warden/fresh never-use-Revelation-skills no-win-found rounds=6 fight-rounds=6 hp=0/40 surviving={"ugallu":0} salves-used=2 actions={"ugallu/claw":0.6666666666666666,"ugallu/salve":0.3333333333333333}
CELL ugallu/gauntlet/fresh no-win-found rounds=1 fight-rounds=1 hp=40/40 surviving={"ugallu":40} salves-used=0 actions={"ugallu/rend":1}
POLICY ugallu/gauntlet/fresh always-disable no-win-found rounds=5 fight-rounds=5 hp=0/40 surviving={"ugallu":0} salves-used=2 actions={"ugallu/claw":0.6,"ugallu/salve":0.4}
POLICY ugallu/gauntlet/fresh always-core no-win-found rounds=5 fight-rounds=5 hp=0/40 surviving={"ugallu":0} salves-used=2 actions={"ugallu/claw":0.6,"ugallu/salve":0.4}
POLICY ugallu/gauntlet/fresh Rapture-as-soon-as-possible no-win-found rounds=5 fight-rounds=5 hp=0/40 surviving={"ugallu":0} salves-used=2 actions={"ugallu/rend":0.6,"ugallu/salve":0.4}
POLICY ugallu/gauntlet/fresh never-use-Revelation-skills no-win-found rounds=5 fight-rounds=5 hp=0/40 surviving={"ugallu":0} salves-used=2 actions={"ugallu/claw":0.6,"ugallu/salve":0.4}
CELL girtablilu/warden/fresh no-win-found rounds=1 fight-rounds=1 hp=24/24 surviving={"girtablilu":24} salves-used=0 actions={"girtablilu/pincer":1}
POLICY girtablilu/warden/fresh always-disable no-win-found rounds=2 fight-rounds=2 hp=0/24 surviving={"girtablilu":0} salves-used=0 actions={"girtablilu/pincer":1}
POLICY girtablilu/warden/fresh always-core no-win-found rounds=2 fight-rounds=2 hp=0/24 surviving={"girtablilu":0} salves-used=0 actions={"girtablilu/pincer":1}
POLICY girtablilu/warden/fresh poison-then-Guard no-win-found rounds=8 fight-rounds=8 hp=0/24 surviving={"girtablilu":0} salves-used=2 actions={"girtablilu/envenom":0.375,"girtablilu/guard":0.375,"girtablilu/salve":0.25}
POLICY girtablilu/warden/fresh Rapture-as-soon-as-possible no-win-found rounds=2 fight-rounds=2 hp=0/24 surviving={"girtablilu":0} salves-used=0 actions={"girtablilu/pincer":1}
POLICY girtablilu/warden/fresh never-use-Revelation-skills no-win-found rounds=2 fight-rounds=2 hp=0/24 surviving={"girtablilu":0} salves-used=0 actions={"girtablilu/pincer":1}
CELL girtablilu/gauntlet/fresh no-win-found rounds=1 fight-rounds=1 hp=24/24 surviving={"girtablilu":24} salves-used=0 actions={"girtablilu/pincer":1}
POLICY girtablilu/gauntlet/fresh always-disable no-win-found rounds=4 fight-rounds=4 hp=0/24 surviving={"girtablilu":0} salves-used=2 actions={"girtablilu/pincer":0.5,"girtablilu/salve":0.5}
POLICY girtablilu/gauntlet/fresh always-core no-win-found rounds=4 fight-rounds=4 hp=0/24 surviving={"girtablilu":0} salves-used=2 actions={"girtablilu/pincer":0.5,"girtablilu/salve":0.5}
POLICY girtablilu/gauntlet/fresh poison-then-Guard no-win-found rounds=3 fight-rounds=3 hp=0/24 surviving={"girtablilu":0} salves-used=1 actions={"girtablilu/envenom":0.6666666666666666,"girtablilu/salve":0.3333333333333333}
POLICY girtablilu/gauntlet/fresh Rapture-as-soon-as-possible no-win-found rounds=4 fight-rounds=4 hp=0/24 surviving={"girtablilu":0} salves-used=2 actions={"girtablilu/pincer":0.5,"girtablilu/salve":0.5}
POLICY girtablilu/gauntlet/fresh never-use-Revelation-skills no-win-found rounds=4 fight-rounds=4 hp=0/24 surviving={"girtablilu":0} salves-used=2 actions={"girtablilu/pincer":0.5,"girtablilu/salve":0.5}
CELL ugallu+girtablilu/warden/fresh no-win-found rounds=2 fight-rounds=2 hp=58/64 surviving={"ugallu":39,"girtablilu":19} salves-used=0 actions={"ugallu/claw":1,"girtablilu/pincer":1}
POLICY ugallu+girtablilu/warden/fresh always-disable no-win-found rounds=10 fight-rounds=10 hp=0/64 surviving={"ugallu":0,"girtablilu":0} salves-used=2 actions={"ugallu/claw":0.8,"ugallu/salve":0.2,"girtablilu/pincer":1}
POLICY ugallu+girtablilu/warden/fresh always-core no-win-found rounds=8 fight-rounds=8 hp=0/64 surviving={"ugallu":0,"girtablilu":0} salves-used=2 actions={"ugallu/claw":0.75,"ugallu/salve":0.25,"girtablilu/pincer":1}
POLICY ugallu+girtablilu/warden/fresh poison-then-Guard victory rounds=9 fight-rounds=9 hp=24/64 surviving={"ugallu":24,"girtablilu":0} salves-used=2 actions={"ugallu/claw":0.7777777777777778,"ugallu/salve":0.2222222222222222,"girtablilu/envenom":0.375,"girtablilu/guard":0.625}
POLICY ugallu+girtablilu/warden/fresh Rapture-as-soon-as-possible no-win-found rounds=8 fight-rounds=8 hp=0/64 surviving={"ugallu":0,"girtablilu":0} salves-used=2 actions={"ugallu/rend":0.75,"ugallu/salve":0.25,"girtablilu/pincer":1}
POLICY ugallu+girtablilu/warden/fresh never-use-Revelation-skills no-win-found rounds=8 fight-rounds=8 hp=0/64 surviving={"ugallu":0,"girtablilu":0} salves-used=2 actions={"ugallu/claw":0.75,"ugallu/salve":0.25,"girtablilu/pincer":1}
CELL ugallu+girtablilu/gauntlet/fresh no-win-found rounds=17 fight-rounds=7,9,1 hp=4/64 surviving={"ugallu":0,"girtablilu":4} salves-used=2 actions={"ugallu/rend":0.5454545454545454,"ugallu/salve":0.09090909090909091,"ugallu/claw":0.36363636363636365,"girtablilu/pincer":0.6875,"girtablilu/salve":0.0625,"girtablilu/envenom":0.1875,"girtablilu/rupture-venom":0.0625}
POLICY ugallu+girtablilu/gauntlet/fresh always-disable no-win-found rounds=14 fight-rounds=12,2 hp=0/64 surviving={"ugallu":0,"girtablilu":0} salves-used=2 actions={"ugallu/claw":0.8571428571428571,"ugallu/salve":0.14285714285714285,"girtablilu/pincer":1}
POLICY ugallu+girtablilu/gauntlet/fresh always-core no-win-found rounds=8 fight-rounds=8 hp=0/64 surviving={"ugallu":0,"girtablilu":0} salves-used=2 actions={"ugallu/claw":0.6666666666666666,"ugallu/salve":0.3333333333333333,"girtablilu/pincer":1}
POLICY ugallu+girtablilu/gauntlet/fresh poison-then-Guard no-win-found rounds=10 fight-rounds=8,2 hp=0/64 surviving={"ugallu":0,"girtablilu":0} salves-used=2 actions={"ugallu/claw":0.7777777777777778,"ugallu/salve":0.2222222222222222,"girtablilu/envenom":0.7777777777777778,"girtablilu/pincer":0.1111111111111111,"girtablilu/guard":0.1111111111111111}
POLICY ugallu+girtablilu/gauntlet/fresh Rapture-as-soon-as-possible no-win-found rounds=7 fight-rounds=7 hp=0/64 surviving={"ugallu":0,"girtablilu":0} salves-used=2 actions={"ugallu/rend":0.7142857142857143,"ugallu/salve":0.2857142857142857,"girtablilu/pincer":1}
POLICY ugallu+girtablilu/gauntlet/fresh never-use-Revelation-skills no-win-found rounds=8 fight-rounds=8 hp=0/64 surviving={"ugallu":0,"girtablilu":0} salves-used=2 actions={"ugallu/claw":0.6666666666666666,"ugallu/salve":0.3333333333333333,"girtablilu/pincer":1}
CELL anzu/warden/fresh no-win-found rounds=2 fight-rounds=2 hp=17/22 surviving={"anzu":17} salves-used=0 actions={"anzu/stolen-bolt":1}
POLICY anzu/warden/fresh always-disable no-win-found rounds=2 fight-rounds=2 hp=0/22 surviving={"anzu":0} salves-used=0 actions={"anzu/talon":1}
POLICY anzu/warden/fresh always-core no-win-found rounds=2 fight-rounds=2 hp=0/22 surviving={"anzu":0} salves-used=0 actions={"anzu/talon":1}
POLICY anzu/warden/fresh Rapture-as-soon-as-possible no-win-found rounds=17 fight-rounds=17 hp=0/22 surviving={"anzu":0} salves-used=2 actions={"anzu/revoke":0.8823529411764706,"anzu/salve":0.11764705882352941}
POLICY anzu/warden/fresh never-use-Revelation-skills no-win-found rounds=2 fight-rounds=2 hp=0/22 surviving={"anzu":0} salves-used=0 actions={"anzu/talon":1}
POLICY anzu/warden/fresh Revoke-every-Saw no-win-found rounds=12 fight-rounds=12 hp=0/22 surviving={"anzu":0} salves-used=2 actions={"anzu/talon":0.5,"anzu/revoke":0.3333333333333333,"anzu/salve":0.16666666666666666}
CELL anzu/gauntlet/fresh no-win-found rounds=2 fight-rounds=2 hp=11/22 surviving={"anzu":11} salves-used=0 actions={"anzu/stolen-bolt":1}
POLICY anzu/gauntlet/fresh always-disable no-win-found rounds=4 fight-rounds=4 hp=0/22 surviving={"anzu":0} salves-used=2 actions={"anzu/talon":0.5,"anzu/salve":0.5}
POLICY anzu/gauntlet/fresh always-core no-win-found rounds=4 fight-rounds=4 hp=0/22 surviving={"anzu":0} salves-used=2 actions={"anzu/talon":0.5,"anzu/salve":0.5}
POLICY anzu/gauntlet/fresh Rapture-as-soon-as-possible no-win-found rounds=5 fight-rounds=5 hp=0/22 surviving={"anzu":0} salves-used=2 actions={"anzu/revoke":0.6,"anzu/salve":0.4}
POLICY anzu/gauntlet/fresh never-use-Revelation-skills no-win-found rounds=4 fight-rounds=4 hp=0/22 surviving={"anzu":0} salves-used=2 actions={"anzu/talon":0.5,"anzu/salve":0.5}
POLICY anzu/gauntlet/fresh Revoke-every-Saw no-win-found rounds=4 fight-rounds=4 hp=0/22 surviving={"anzu":0} salves-used=2 actions={"anzu/talon":0.5,"anzu/salve":0.5}
CELL ugallu+anzu/warden/fresh no-win-found rounds=2 fight-rounds=2 hp=56/62 surviving={"ugallu":39,"anzu":17} salves-used=0 actions={"anzu/stolen-bolt":1,"ugallu/claw":1}
POLICY ugallu+anzu/warden/fresh always-disable no-win-found rounds=10 fight-rounds=10 hp=0/62 surviving={"ugallu":0,"anzu":0} salves-used=2 actions={"ugallu/claw":0.8,"ugallu/salve":0.2,"anzu/talon":1}
POLICY ugallu+anzu/warden/fresh always-core no-win-found rounds=8 fight-rounds=8 hp=0/62 surviving={"ugallu":0,"anzu":0} salves-used=2 actions={"ugallu/claw":0.75,"ugallu/salve":0.25,"anzu/talon":1}
POLICY ugallu+anzu/warden/fresh Rapture-as-soon-as-possible victory rounds=18 fight-rounds=18 hp=19/62 surviving={"ugallu":19,"anzu":0} salves-used=2 actions={"ugallu/rend":0.8888888888888888,"ugallu/salve":0.1111111111111111,"anzu/revoke":1}
POLICY ugallu+anzu/warden/fresh never-use-Revelation-skills no-win-found rounds=8 fight-rounds=8 hp=0/62 surviving={"ugallu":0,"anzu":0} salves-used=2 actions={"ugallu/claw":0.75,"ugallu/salve":0.25,"anzu/talon":1}
POLICY ugallu+anzu/warden/fresh Revoke-every-Saw victory rounds=8 fight-rounds=8 hp=37/62 surviving={"ugallu":20,"anzu":17} salves-used=2 actions={"ugallu/claw":0.75,"ugallu/salve":0.25,"anzu/talon":0.7142857142857143,"anzu/revoke":0.2857142857142857}
CELL ugallu+anzu/gauntlet/fresh no-win-found rounds=13 fight-rounds=5,7,1 hp=10/62 surviving={"ugallu":10,"anzu":0} salves-used=2 actions={"anzu/stolen-bolt":1,"ugallu/rend":0.3333333333333333,"ugallu/salve":0.16666666666666666,"ugallu/claw":0.5}
POLICY ugallu+anzu/gauntlet/fresh always-disable no-win-found rounds=18 fight-rounds=17,1 hp=0/62 surviving={"ugallu":0,"anzu":0} salves-used=2 actions={"ugallu/claw":0.8888888888888888,"ugallu/salve":0.1111111111111111,"anzu/talon":1}
POLICY ugallu+anzu/gauntlet/fresh always-core no-win-found rounds=8 fight-rounds=8 hp=0/62 surviving={"ugallu":0,"anzu":0} salves-used=2 actions={"ugallu/claw":0.6666666666666666,"ugallu/salve":0.3333333333333333,"anzu/talon":1}
POLICY ugallu+anzu/gauntlet/fresh Rapture-as-soon-as-possible no-win-found rounds=14 fight-rounds=14 hp=0/62 surviving={"ugallu":0,"anzu":0} salves-used=2 actions={"ugallu/rend":0.8333333333333334,"ugallu/salve":0.16666666666666666,"anzu/revoke":0.6428571428571429,"anzu/talon":0.35714285714285715}
POLICY ugallu+anzu/gauntlet/fresh never-use-Revelation-skills no-win-found rounds=8 fight-rounds=8 hp=0/62 surviving={"ugallu":0,"anzu":0} salves-used=2 actions={"ugallu/claw":0.6666666666666666,"ugallu/salve":0.3333333333333333,"anzu/talon":1}
POLICY ugallu+anzu/gauntlet/fresh Revoke-every-Saw no-win-found rounds=8 fight-rounds=8 hp=0/62 surviving={"ugallu":0,"anzu":0} salves-used=2 actions={"ugallu/claw":0.6666666666666666,"ugallu/salve":0.3333333333333333,"anzu/talon":1}
CELL girtablilu+anzu/warden/fresh no-win-found rounds=2 fight-rounds=2 hp=40/46 surviving={"girtablilu":23,"anzu":17} salves-used=0 actions={"anzu/stolen-bolt":1,"girtablilu/pincer":1}
POLICY girtablilu+anzu/warden/fresh always-disable no-win-found rounds=5 fight-rounds=5 hp=0/46 surviving={"girtablilu":0,"anzu":0} salves-used=0 actions={"girtablilu/pincer":1,"anzu/talon":1}
POLICY girtablilu+anzu/warden/fresh always-core no-win-found rounds=7 fight-rounds=7 hp=0/46 surviving={"girtablilu":0,"anzu":0} salves-used=2 actions={"girtablilu/pincer":0.7142857142857143,"girtablilu/salve":0.2857142857142857,"anzu/talon":1}
POLICY girtablilu+anzu/warden/fresh poison-then-Guard no-win-found rounds=8 fight-rounds=8 hp=0/46 surviving={"girtablilu":0,"anzu":0} salves-used=2 actions={"girtablilu/envenom":0.375,"girtablilu/guard":0.375,"girtablilu/salve":0.25,"anzu/talon":1}
POLICY girtablilu+anzu/warden/fresh Rapture-as-soon-as-possible victory rounds=14 fight-rounds=14 hp=24/46 surviving={"girtablilu":11,"anzu":13} salves-used=2 actions={"girtablilu/pincer":0.8571428571428571,"girtablilu/salve":0.14285714285714285,"anzu/revoke":1}
POLICY girtablilu+anzu/warden/fresh never-use-Revelation-skills no-win-found rounds=7 fight-rounds=7 hp=0/46 surviving={"girtablilu":0,"anzu":0} salves-used=2 actions={"girtablilu/pincer":0.7142857142857143,"girtablilu/salve":0.2857142857142857,"anzu/talon":1}
POLICY girtablilu+anzu/warden/fresh Revoke-every-Saw victory rounds=9 fight-rounds=9 hp=16/46 surviving={"girtablilu":10,"anzu":6} salves-used=2 actions={"girtablilu/pincer":0.7777777777777778,"girtablilu/salve":0.2222222222222222,"anzu/talon":0.625,"anzu/revoke":0.375}
CELL girtablilu+anzu/gauntlet/fresh no-win-found rounds=6 fight-rounds=5,1 hp=28/46 surviving={"girtablilu":12,"anzu":16} salves-used=2 actions={"anzu/stolen-bolt":0.8,"anzu/salve":0.2,"girtablilu/pincer":0.5,"girtablilu/salve":0.16666666666666666,"girtablilu/envenom":0.3333333333333333}
POLICY girtablilu+anzu/gauntlet/fresh always-disable no-win-found rounds=20 fight-rounds=19,1 hp=0/46 surviving={"girtablilu":0,"anzu":0} salves-used=2 actions={"girtablilu/pincer":0.9,"girtablilu/salve":0.1,"anzu/talon":1}
POLICY girtablilu+anzu/gauntlet/fresh always-core no-win-found rounds=6 fight-rounds=6 hp=0/46 surviving={"girtablilu":0,"anzu":0} salves-used=2 actions={"girtablilu/pincer":0.6,"girtablilu/salve":0.4,"anzu/talon":1}
POLICY girtablilu+anzu/gauntlet/fresh poison-then-Guard no-win-found rounds=6 fight-rounds=6 hp=0/46 surviving={"girtablilu":0,"anzu":0} salves-used=2 actions={"girtablilu/envenom":0.6666666666666666,"girtablilu/salve":0.3333333333333333,"anzu/talon":1}
POLICY girtablilu+anzu/gauntlet/fresh Rapture-as-soon-as-possible no-win-found rounds=10 fight-rounds=10 hp=0/46 surviving={"girtablilu":0,"anzu":0} salves-used=2 actions={"girtablilu/pincer":0.8,"girtablilu/salve":0.2,"anzu/revoke":0.8888888888888888,"anzu/talon":0.1111111111111111}
POLICY girtablilu+anzu/gauntlet/fresh never-use-Revelation-skills no-win-found rounds=6 fight-rounds=6 hp=0/46 surviving={"girtablilu":0,"anzu":0} salves-used=2 actions={"girtablilu/pincer":0.6,"girtablilu/salve":0.4,"anzu/talon":1}
POLICY girtablilu+anzu/gauntlet/fresh Revoke-every-Saw no-win-found rounds=6 fight-rounds=6 hp=0/46 surviving={"girtablilu":0,"anzu":0} salves-used=2 actions={"girtablilu/pincer":0.6,"girtablilu/salve":0.4,"anzu/talon":1}
CELL ugallu+girtablilu+anzu/warden/fresh victory rounds=5 fight-rounds=5 hp=62/86 surviving={"ugallu":39,"girtablilu":23,"anzu":0} salves-used=2 actions={"anzu/stolen-bolt":1,"ugallu/claw":0.8,"ugallu/salve":0.2,"girtablilu/pincer":0.8,"girtablilu/salve":0.2}
POLICY ugallu+girtablilu+anzu/warden/fresh always-disable victory rounds=28 fight-rounds=28 hp=9/86 surviving={"ugallu":9,"girtablilu":0,"anzu":0} salves-used=2 actions={"ugallu/claw":0.9285714285714286,"ugallu/salve":0.07142857142857142,"girtablilu/pincer":1,"anzu/talon":1}
POLICY ugallu+girtablilu+anzu/warden/fresh always-core victory rounds=6 fight-rounds=6 hp=44/86 surviving={"ugallu":32,"girtablilu":12,"anzu":0} salves-used=2 actions={"ugallu/claw":0.6666666666666666,"ugallu/salve":0.3333333333333333,"girtablilu/pincer":1,"anzu/talon":1}
POLICY ugallu+girtablilu+anzu/warden/fresh poison-then-Guard victory rounds=8 fight-rounds=8 hp=39/86 surviving={"ugallu":25,"girtablilu":14,"anzu":0} salves-used=2 actions={"ugallu/claw":0.75,"ugallu/salve":0.25,"girtablilu/envenom":0.2857142857142857,"girtablilu/guard":0.7142857142857143,"anzu/talon":1}
POLICY ugallu+girtablilu+anzu/warden/fresh Rapture-as-soon-as-possible victory rounds=8 fight-rounds=8 hp=65/86 surviving={"ugallu":31,"girtablilu":17,"anzu":17} salves-used=1 actions={"ugallu/rend":0.875,"ugallu/salve":0.125,"girtablilu/pincer":1,"anzu/revoke":1}
POLICY ugallu+girtablilu+anzu/warden/fresh never-use-Revelation-skills victory rounds=6 fight-rounds=6 hp=44/86 surviving={"ugallu":32,"girtablilu":12,"anzu":0} salves-used=2 actions={"ugallu/claw":0.6666666666666666,"ugallu/salve":0.3333333333333333,"girtablilu/pincer":1,"anzu/talon":1}
POLICY ugallu+girtablilu+anzu/warden/fresh Revoke-every-Saw victory rounds=5 fight-rounds=5 hp=67/86 surviving={"ugallu":33,"girtablilu":17,"anzu":17} salves-used=1 actions={"ugallu/claw":0.8,"ugallu/salve":0.2,"girtablilu/pincer":1,"anzu/talon":0.75,"anzu/revoke":0.25}
CELL ugallu+girtablilu+anzu/gauntlet/fresh no-win-found rounds=10 fight-rounds=4,4,2 hp=52/86 surviving={"ugallu":29,"girtablilu":23,"anzu":0} salves-used=2 actions={"anzu/stolen-bolt":1,"ugallu/rend":0.2,"ugallu/claw":0.7,"ugallu/salve":0.1,"girtablilu/pincer":0.6666666666666666,"girtablilu/salve":0.1111111111111111,"girtablilu/envenom":0.2222222222222222}
POLICY ugallu+girtablilu+anzu/gauntlet/fresh always-disable no-win-found rounds=19 fight-rounds=8,11 hp=0/86 surviving={"ugallu":0,"girtablilu":0,"anzu":0} salves-used=2 actions={"ugallu/claw":0.8461538461538461,"ugallu/salve":0.15384615384615385,"girtablilu/pincer":1,"anzu/talon":1}
POLICY ugallu+girtablilu+anzu/gauntlet/fresh always-core no-win-found rounds=10 fight-rounds=10 hp=0/86 surviving={"ugallu":0,"girtablilu":0,"anzu":0} salves-used=2 actions={"ugallu/claw":0.6666666666666666,"ugallu/salve":0.3333333333333333,"girtablilu/pincer":1,"anzu/talon":1}
POLICY ugallu+girtablilu+anzu/gauntlet/fresh poison-then-Guard no-win-found rounds=11 fight-rounds=8,3 hp=0/86 surviving={"ugallu":0,"girtablilu":0,"anzu":0} salves-used=2 actions={"ugallu/claw":0.7777777777777778,"ugallu/salve":0.2222222222222222,"girtablilu/envenom":0.8,"girtablilu/guard":0.2,"anzu/talon":1}
POLICY ugallu+girtablilu+anzu/gauntlet/fresh Rapture-as-soon-as-possible no-win-found rounds=15 fight-rounds=15 hp=0/86 surviving={"ugallu":0,"girtablilu":0,"anzu":0} salves-used=2 actions={"ugallu/rend":0.8571428571428571,"ugallu/salve":0.14285714285714285,"girtablilu/pincer":1,"anzu/revoke":0.6428571428571429,"anzu/talon":0.35714285714285715}
POLICY ugallu+girtablilu+anzu/gauntlet/fresh never-use-Revelation-skills no-win-found rounds=10 fight-rounds=10 hp=0/86 surviving={"ugallu":0,"girtablilu":0,"anzu":0} salves-used=2 actions={"ugallu/claw":0.6666666666666666,"ugallu/salve":0.3333333333333333,"girtablilu/pincer":1,"anzu/talon":1}
POLICY ugallu+girtablilu+anzu/gauntlet/fresh Revoke-every-Saw no-win-found rounds=10 fight-rounds=10 hp=0/86 surviving={"ugallu":0,"girtablilu":0,"anzu":0} salves-used=2 actions={"ugallu/claw":0.6666666666666666,"ugallu/salve":0.3333333333333333,"girtablilu/pincer":1,"anzu/talon":1}
OPENINGS ugallu/warden/fresh/salves=false count=11 wins=0 best=no win found
CLASS ugallu/warden/fresh/salves=false control hp-gap=lost no win found
CLASS ugallu/warden/fresh/salves=false warden-of-correct-form#1/choir hp-gap=lost no win found
CLASS ugallu/warden/fresh/salves=false warden-of-correct-form#1/clamp hp-gap=lost no win found
CLASS ugallu/warden/fresh/salves=false warden-of-correct-form#1/core hp-gap=lost no win found
CLASS ugallu/warden/fresh/salves=false warden-of-correct-form#1/saw hp-gap=lost no win found
OPENINGS ugallu/warden/fresh/salves=true count=11 wins=0 best=no win found
CLASS ugallu/warden/fresh/salves=true control hp-gap=lost no win found
CLASS ugallu/warden/fresh/salves=true warden-of-correct-form#1/choir hp-gap=lost no win found
CLASS ugallu/warden/fresh/salves=true warden-of-correct-form#1/clamp hp-gap=lost no win found
CLASS ugallu/warden/fresh/salves=true warden-of-correct-form#1/core hp-gap=lost no win found
CLASS ugallu/warden/fresh/salves=true warden-of-correct-form#1/saw hp-gap=lost no win found
OPENINGS girtablilu/warden/fresh/salves=false count=10 wins=0 best=no win found
CLASS girtablilu/warden/fresh/salves=false control hp-gap=lost no win found
CLASS girtablilu/warden/fresh/salves=false warden-of-correct-form#1/choir hp-gap=lost no win found
CLASS girtablilu/warden/fresh/salves=false warden-of-correct-form#1/clamp hp-gap=lost no win found
CLASS girtablilu/warden/fresh/salves=false warden-of-correct-form#1/core hp-gap=lost no win found
CLASS girtablilu/warden/fresh/salves=false warden-of-correct-form#1/saw hp-gap=lost no win found
OPENINGS girtablilu/warden/fresh/salves=true count=10 wins=0 best=no win found
CLASS girtablilu/warden/fresh/salves=true control hp-gap=lost no win found
CLASS girtablilu/warden/fresh/salves=true warden-of-correct-form#1/choir hp-gap=lost no win found
CLASS girtablilu/warden/fresh/salves=true warden-of-correct-form#1/clamp hp-gap=lost no win found
CLASS girtablilu/warden/fresh/salves=true warden-of-correct-form#1/core hp-gap=lost no win found
CLASS girtablilu/warden/fresh/salves=true warden-of-correct-form#1/saw hp-gap=lost no win found
OPENINGS ugallu+girtablilu/warden/fresh/salves=false count=120 wins=21 best=victory rounds=7 fight-rounds=7 hp=21/64 surviving={"ugallu":19,"girtablilu":2} salves-used=0 actions={"ugallu/rend":0.2857142857142857,"ugallu/claw":0.7142857142857143,"girtablilu/envenom":0.16666666666666666,"girtablilu/pincer":0.8333333333333334} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"rend","target":{"enemy":"warden-of-correct-form#1","part":"clamp"}},{"kind":"act","expectedRevision":1,"actor":"girtablilu","action":"envenom","target":{"enemy":"warden-of-correct-form#1","part":"core"}},{"kind":"endPhase","expectedRevision":2}]
CLASS ugallu+girtablilu/warden/fresh/salves=false control hp-gap=20 victory rounds=8 fight-rounds=8 hp=1/64 surviving={"ugallu":0,"girtablilu":1} salves-used=0 actions={"ugallu/hold-the-threshold":0.2,"ugallu/claw":0.8,"girtablilu/pincer":1} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"hold-the-threshold","target":{"brood":"girtablilu"}},{"kind":"endPhase","expectedRevision":1}]
CLASS ugallu+girtablilu/warden/fresh/salves=false mixed hp-gap=0 victory rounds=7 fight-rounds=7 hp=21/64 surviving={"ugallu":19,"girtablilu":2} salves-used=0 actions={"ugallu/rend":0.2857142857142857,"ugallu/claw":0.7142857142857143,"girtablilu/envenom":0.16666666666666666,"girtablilu/pincer":0.8333333333333334} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"rend","target":{"enemy":"warden-of-correct-form#1","part":"clamp"}},{"kind":"act","expectedRevision":1,"actor":"girtablilu","action":"envenom","target":{"enemy":"warden-of-correct-form#1","part":"core"}},{"kind":"endPhase","expectedRevision":2}]
CLASS ugallu+girtablilu/warden/fresh/salves=false warden-of-correct-form#1/choir hp-gap=12 victory rounds=7 fight-rounds=7 hp=9/64 surviving={"ugallu":0,"girtablilu":9} salves-used=0 actions={"ugallu/hold-the-threshold":0.2,"ugallu/claw":0.8,"girtablilu/envenom":0.14285714285714285,"girtablilu/pincer":0.8571428571428571} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"hold-the-threshold","target":{"brood":"girtablilu"}},{"kind":"act","expectedRevision":1,"actor":"girtablilu","action":"envenom","target":{"enemy":"warden-of-correct-form#1","part":"choir"}},{"kind":"endPhase","expectedRevision":2}]
CLASS ugallu+girtablilu/warden/fresh/salves=false warden-of-correct-form#1/clamp hp-gap=1 victory rounds=7 fight-rounds=7 hp=20/64 surviving={"ugallu":19,"girtablilu":1} salves-used=0 actions={"ugallu/rend":0.2857142857142857,"ugallu/claw":0.7142857142857143,"girtablilu/guard":0.14285714285714285,"girtablilu/pincer":0.8571428571428571} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"rend","target":{"enemy":"warden-of-correct-form#1","part":"clamp"}},{"kind":"act","expectedRevision":1,"actor":"girtablilu","action":"guard","target":null},{"kind":"endPhase","expectedRevision":2}]
CLASS ugallu+girtablilu/warden/fresh/salves=false warden-of-correct-form#1/core hp-gap=5 victory rounds=6 fight-rounds=6 hp=16/64 surviving={"ugallu":0,"girtablilu":16} salves-used=0 actions={"ugallu/hold-the-threshold":0.2,"ugallu/claw":0.8,"girtablilu/envenom":0.16666666666666666,"girtablilu/pincer":0.8333333333333334} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"hold-the-threshold","target":{"brood":"girtablilu"}},{"kind":"act","expectedRevision":1,"actor":"girtablilu","action":"envenom","target":{"enemy":"warden-of-correct-form#1","part":"core"}},{"kind":"endPhase","expectedRevision":2}]
CLASS ugallu+girtablilu/warden/fresh/salves=false warden-of-correct-form#1/saw hp-gap=20 victory rounds=8 fight-rounds=8 hp=1/64 surviving={"ugallu":0,"girtablilu":1} salves-used=0 actions={"ugallu/hold-the-threshold":0.2,"ugallu/claw":0.8,"girtablilu/pincer":1} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"hold-the-threshold","target":{"brood":"girtablilu"}},{"kind":"act","expectedRevision":1,"actor":"girtablilu","action":"pincer","target":{"enemy":"warden-of-correct-form#1","part":"saw"}},{"kind":"endPhase","expectedRevision":2}]
OPENINGS ugallu+girtablilu/warden/fresh/salves=true count=120 wins=24 best=victory rounds=8 fight-rounds=8 hp=31/64 surviving={"ugallu":24,"girtablilu":7} salves-used=2 actions={"ugallu/rend":0.25,"ugallu/salve":0.25,"ugallu/claw":0.5,"girtablilu/envenom":0.14285714285714285,"girtablilu/pincer":0.8571428571428571} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"rend","target":{"enemy":"warden-of-correct-form#1","part":"clamp"}},{"kind":"act","expectedRevision":1,"actor":"girtablilu","action":"envenom","target":{"enemy":"warden-of-correct-form#1","part":"core"}},{"kind":"endPhase","expectedRevision":2}]
CLASS ugallu+girtablilu/warden/fresh/salves=true control hp-gap=lost no win found
CLASS ugallu+girtablilu/warden/fresh/salves=true mixed hp-gap=0 victory rounds=8 fight-rounds=8 hp=31/64 surviving={"ugallu":24,"girtablilu":7} salves-used=2 actions={"ugallu/rend":0.25,"ugallu/salve":0.25,"ugallu/claw":0.5,"girtablilu/envenom":0.14285714285714285,"girtablilu/pincer":0.8571428571428571} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"rend","target":{"enemy":"warden-of-correct-form#1","part":"clamp"}},{"kind":"act","expectedRevision":1,"actor":"girtablilu","action":"envenom","target":{"enemy":"warden-of-correct-form#1","part":"core"}},{"kind":"endPhase","expectedRevision":2}]
CLASS ugallu+girtablilu/warden/fresh/salves=true warden-of-correct-form#1/choir hp-gap=10 victory rounds=8 fight-rounds=8 hp=21/64 surviving={"ugallu":5,"girtablilu":16} salves-used=2 actions={"ugallu/claw":0.75,"ugallu/rend":0.125,"ugallu/salve":0.125,"girtablilu/envenom":0.14285714285714285,"girtablilu/pincer":0.7142857142857143,"girtablilu/salve":0.14285714285714285} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"claw","target":{"enemy":"warden-of-correct-form#1","part":"choir"}},{"kind":"act","expectedRevision":1,"actor":"girtablilu","action":"envenom","target":{"enemy":"warden-of-correct-form#1","part":"choir"}},{"kind":"endPhase","expectedRevision":2}]
CLASS ugallu+girtablilu/warden/fresh/salves=true warden-of-correct-form#1/clamp hp-gap=8 victory rounds=9 fight-rounds=9 hp=23/64 surviving={"ugallu":17,"girtablilu":6} salves-used=2 actions={"ugallu/rend":0.2222222222222222,"ugallu/salve":0.2222222222222222,"ugallu/claw":0.5555555555555556,"girtablilu/guard":0.125,"girtablilu/pincer":0.875} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"rend","target":{"enemy":"warden-of-correct-form#1","part":"clamp"}},{"kind":"act","expectedRevision":1,"actor":"girtablilu","action":"guard","target":null},{"kind":"endPhase","expectedRevision":2}]
CLASS ugallu+girtablilu/warden/fresh/salves=true warden-of-correct-form#1/core hp-gap=11 victory rounds=8 fight-rounds=8 hp=20/64 surviving={"ugallu":20,"girtablilu":0} salves-used=2 actions={"ugallu/claw":0.875,"ugallu/salve":0.125,"girtablilu/envenom":0.2,"girtablilu/pincer":0.6,"girtablilu/salve":0.2} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"claw","target":{"enemy":"warden-of-correct-form#1","part":"core"}},{"kind":"act","expectedRevision":1,"actor":"girtablilu","action":"envenom","target":{"enemy":"warden-of-correct-form#1","part":"core"}},{"kind":"endPhase","expectedRevision":2}]
CLASS ugallu+girtablilu/warden/fresh/salves=true warden-of-correct-form#1/saw hp-gap=lost no win found
OPENINGS anzu/warden/fresh/salves=false count=11 wins=0 best=no win found
CLASS anzu/warden/fresh/salves=false control hp-gap=lost no win found
CLASS anzu/warden/fresh/salves=false warden-of-correct-form#1/choir hp-gap=lost no win found
CLASS anzu/warden/fresh/salves=false warden-of-correct-form#1/clamp hp-gap=lost no win found
CLASS anzu/warden/fresh/salves=false warden-of-correct-form#1/core hp-gap=lost no win found
CLASS anzu/warden/fresh/salves=false warden-of-correct-form#1/saw hp-gap=lost no win found
OPENINGS anzu/warden/fresh/salves=true count=11 wins=0 best=no win found
CLASS anzu/warden/fresh/salves=true control hp-gap=lost no win found
CLASS anzu/warden/fresh/salves=true warden-of-correct-form#1/choir hp-gap=lost no win found
CLASS anzu/warden/fresh/salves=true warden-of-correct-form#1/clamp hp-gap=lost no win found
CLASS anzu/warden/fresh/salves=true warden-of-correct-form#1/core hp-gap=lost no win found
CLASS anzu/warden/fresh/salves=true warden-of-correct-form#1/saw hp-gap=lost no win found
OPENINGS ugallu+anzu/warden/fresh/salves=false count=132 wins=32 best=victory rounds=6 fight-rounds=6 hp=34/62 surviving={"ugallu":29,"anzu":5} salves-used=0 actions={"ugallu/rend":0.5,"ugallu/claw":0.5,"anzu/stolen-bolt":1} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"rend","target":{"enemy":"warden-of-correct-form#1","part":"clamp"}},{"kind":"act","expectedRevision":1,"actor":"anzu","action":"stolen-bolt","target":{"enemy":"warden-of-correct-form#1","part":"choir"}},{"kind":"endPhase","expectedRevision":2}]
CLASS ugallu+anzu/warden/fresh/salves=false control hp-gap=8 victory rounds=6 fight-rounds=6 hp=26/62 surviving={"ugallu":26,"anzu":0} salves-used=0 actions={"ugallu/hold-the-threshold":0.16666666666666666,"ugallu/claw":0.8333333333333334,"anzu/revoke":0.2,"anzu/stolen-bolt":0.6,"anzu/talon":0.2} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"hold-the-threshold","target":{"brood":"ugallu"}},{"kind":"act","expectedRevision":1,"actor":"anzu","action":"revoke","target":{"intent":"r1.warden-of-correct-form#1.clamp"}},{"kind":"endPhase","expectedRevision":2}]
CLASS ugallu+anzu/warden/fresh/salves=false mixed hp-gap=0 victory rounds=6 fight-rounds=6 hp=34/62 surviving={"ugallu":29,"anzu":5} salves-used=0 actions={"ugallu/rend":0.5,"ugallu/claw":0.5,"anzu/stolen-bolt":1} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"rend","target":{"enemy":"warden-of-correct-form#1","part":"clamp"}},{"kind":"act","expectedRevision":1,"actor":"anzu","action":"stolen-bolt","target":{"enemy":"warden-of-correct-form#1","part":"choir"}},{"kind":"endPhase","expectedRevision":2}]
CLASS ugallu+anzu/warden/fresh/salves=false warden-of-correct-form#1/choir hp-gap=5 victory rounds=6 fight-rounds=6 hp=29/62 surviving={"ugallu":29,"anzu":0} salves-used=0 actions={"ugallu/rend":0.3333333333333333,"ugallu/claw":0.6666666666666666,"anzu/revoke":0.2,"anzu/stolen-bolt":0.8} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"rend","target":{"enemy":"warden-of-correct-form#1","part":"choir"}},{"kind":"act","expectedRevision":1,"actor":"anzu","action":"revoke","target":{"intent":"r1.warden-of-correct-form#1.clamp"}},{"kind":"endPhase","expectedRevision":2}]
CLASS ugallu+anzu/warden/fresh/salves=false warden-of-correct-form#1/clamp hp-gap=2 victory rounds=6 fight-rounds=6 hp=32/62 surviving={"ugallu":18,"anzu":14} salves-used=0 actions={"ugallu/rend":0.3333333333333333,"ugallu/claw":0.6666666666666666,"anzu/revoke":0.16666666666666666,"anzu/stolen-bolt":0.6666666666666666,"anzu/talon":0.16666666666666666} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"rend","target":{"enemy":"warden-of-correct-form#1","part":"clamp"}},{"kind":"act","expectedRevision":1,"actor":"anzu","action":"revoke","target":{"intent":"r1.warden-of-correct-form#1.clamp"}},{"kind":"endPhase","expectedRevision":2}]
CLASS ugallu+anzu/warden/fresh/salves=false warden-of-correct-form#1/core hp-gap=8 victory rounds=6 fight-rounds=6 hp=26/62 surviving={"ugallu":26,"anzu":0} salves-used=0 actions={"ugallu/claw":1,"anzu/revoke":0.2,"anzu/stolen-bolt":0.6,"anzu/talon":0.2} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"claw","target":{"enemy":"warden-of-correct-form#1","part":"core"}},{"kind":"act","expectedRevision":1,"actor":"anzu","action":"revoke","target":{"intent":"r1.warden-of-correct-form#1.clamp"}},{"kind":"endPhase","expectedRevision":2}]
CLASS ugallu+anzu/warden/fresh/salves=false warden-of-correct-form#1/saw hp-gap=13 victory rounds=7 fight-rounds=7 hp=21/62 surviving={"ugallu":21,"anzu":0} salves-used=0 actions={"ugallu/claw":1,"anzu/revoke":0.2,"anzu/stolen-bolt":0.6,"anzu/talon":0.2} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"claw","target":{"enemy":"warden-of-correct-form#1","part":"saw"}},{"kind":"act","expectedRevision":1,"actor":"anzu","action":"revoke","target":{"intent":"r1.warden-of-correct-form#1.clamp"}},{"kind":"endPhase","expectedRevision":2}]
OPENINGS ugallu+anzu/warden/fresh/salves=true count=132 wins=32 best=victory rounds=6 fight-rounds=6 hp=43/62 surviving={"ugallu":31,"anzu":12} salves-used=2 actions={"ugallu/rend":0.3333333333333333,"ugallu/salve":0.3333333333333333,"ugallu/claw":0.3333333333333333,"anzu/talon":0.16666666666666666,"anzu/stolen-bolt":0.8333333333333334} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"rend","target":{"enemy":"warden-of-correct-form#1","part":"clamp"}},{"kind":"act","expectedRevision":1,"actor":"anzu","action":"talon","target":{"enemy":"warden-of-correct-form#1","part":"core"}},{"kind":"endPhase","expectedRevision":2}]
CLASS ugallu+anzu/warden/fresh/salves=true control hp-gap=21 victory rounds=8 fight-rounds=8 hp=22/62 surviving={"ugallu":22,"anzu":0} salves-used=2 actions={"ugallu/hold-the-threshold":0.125,"ugallu/claw":0.75,"ugallu/salve":0.125,"anzu/revoke":0.2,"anzu/stolen-bolt":0.6,"anzu/salve":0.2} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"hold-the-threshold","target":{"brood":"ugallu"}},{"kind":"act","expectedRevision":1,"actor":"anzu","action":"revoke","target":{"intent":"r1.warden-of-correct-form#1.clamp"}},{"kind":"endPhase","expectedRevision":2}]
CLASS ugallu+anzu/warden/fresh/salves=true mixed hp-gap=0 victory rounds=6 fight-rounds=6 hp=43/62 surviving={"ugallu":31,"anzu":12} salves-used=2 actions={"ugallu/rend":0.3333333333333333,"ugallu/salve":0.3333333333333333,"ugallu/claw":0.3333333333333333,"anzu/talon":0.16666666666666666,"anzu/stolen-bolt":0.8333333333333334} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"rend","target":{"enemy":"warden-of-correct-form#1","part":"clamp"}},{"kind":"act","expectedRevision":1,"actor":"anzu","action":"talon","target":{"enemy":"warden-of-correct-form#1","part":"core"}},{"kind":"endPhase","expectedRevision":2}]
CLASS ugallu+anzu/warden/fresh/salves=true warden-of-correct-form#1/choir hp-gap=12 victory rounds=8 fight-rounds=8 hp=31/62 surviving={"ugallu":31,"anzu":0} salves-used=2 actions={"ugallu/rend":0.25,"ugallu/salve":0.25,"ugallu/claw":0.5,"anzu/revoke":0.2,"anzu/stolen-bolt":0.8} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"rend","target":{"enemy":"warden-of-correct-form#1","part":"choir"}},{"kind":"act","expectedRevision":1,"actor":"anzu","action":"revoke","target":{"intent":"r1.warden-of-correct-form#1.clamp"}},{"kind":"endPhase","expectedRevision":2}]
CLASS ugallu+anzu/warden/fresh/salves=true warden-of-correct-form#1/clamp hp-gap=6 victory rounds=7 fight-rounds=7 hp=37/62 surviving={"ugallu":27,"anzu":10} salves-used=2 actions={"ugallu/claw":0.7142857142857143,"ugallu/rend":0.14285714285714285,"ugallu/salve":0.14285714285714285,"anzu/stolen-bolt":0.7142857142857143,"anzu/salve":0.14285714285714285,"anzu/talon":0.14285714285714285} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"claw","target":{"enemy":"warden-of-correct-form#1","part":"clamp"}},{"kind":"act","expectedRevision":1,"actor":"anzu","action":"stolen-bolt","target":{"enemy":"warden-of-correct-form#1","part":"clamp"}},{"kind":"endPhase","expectedRevision":2}]
CLASS ugallu+anzu/warden/fresh/salves=true warden-of-correct-form#1/core hp-gap=13 victory rounds=6 fight-rounds=6 hp=30/62 surviving={"ugallu":30,"anzu":0} salves-used=2 actions={"ugallu/hold-the-threshold":0.16666666666666666,"ugallu/claw":0.6666666666666666,"ugallu/salve":0.16666666666666666,"anzu/stolen-bolt":0.8,"anzu/salve":0.2} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"hold-the-threshold","target":{"brood":"anzu"}},{"kind":"act","expectedRevision":1,"actor":"anzu","action":"stolen-bolt","target":{"enemy":"warden-of-correct-form#1","part":"core"}},{"kind":"endPhase","expectedRevision":2}]
CLASS ugallu+anzu/warden/fresh/salves=true warden-of-correct-form#1/saw hp-gap=18 victory rounds=7 fight-rounds=7 hp=25/62 surviving={"ugallu":25,"anzu":0} salves-used=2 actions={"ugallu/hold-the-threshold":0.14285714285714285,"ugallu/claw":0.7142857142857143,"ugallu/salve":0.14285714285714285,"anzu/stolen-bolt":0.8,"anzu/salve":0.2} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"hold-the-threshold","target":{"brood":"anzu"}},{"kind":"act","expectedRevision":1,"actor":"anzu","action":"stolen-bolt","target":{"enemy":"warden-of-correct-form#1","part":"saw"}},{"kind":"endPhase","expectedRevision":2}]
OPENINGS girtablilu+anzu/warden/fresh/salves=false count=110 wins=3 best=victory rounds=6 fight-rounds=6 hp=10/46 surviving={"girtablilu":10,"anzu":0} salves-used=0 actions={"girtablilu/envenom":0.16666666666666666,"girtablilu/pincer":0.8333333333333334,"anzu/revoke":0.2,"anzu/stolen-bolt":0.6,"anzu/talon":0.2} opening=[{"kind":"act","expectedRevision":0,"actor":"girtablilu","action":"envenom","target":{"enemy":"warden-of-correct-form#1","part":"core"}},{"kind":"act","expectedRevision":1,"actor":"anzu","action":"revoke","target":{"intent":"r1.warden-of-correct-form#1.clamp"}},{"kind":"endPhase","expectedRevision":2}]
CLASS girtablilu+anzu/warden/fresh/salves=false control hp-gap=lost no win found
CLASS girtablilu+anzu/warden/fresh/salves=false mixed hp-gap=lost no win found
CLASS girtablilu+anzu/warden/fresh/salves=false warden-of-correct-form#1/choir hp-gap=0 victory rounds=6 fight-rounds=6 hp=10/46 surviving={"girtablilu":10,"anzu":0} salves-used=0 actions={"girtablilu/envenom":0.16666666666666666,"girtablilu/pincer":0.8333333333333334,"anzu/revoke":0.2,"anzu/stolen-bolt":0.6,"anzu/talon":0.2} opening=[{"kind":"act","expectedRevision":0,"actor":"girtablilu","action":"envenom","target":{"enemy":"warden-of-correct-form#1","part":"choir"}},{"kind":"act","expectedRevision":1,"actor":"anzu","action":"revoke","target":{"intent":"r1.warden-of-correct-form#1.clamp"}},{"kind":"endPhase","expectedRevision":2}]
CLASS girtablilu+anzu/warden/fresh/salves=false warden-of-correct-form#1/clamp hp-gap=lost no win found
CLASS girtablilu+anzu/warden/fresh/salves=false warden-of-correct-form#1/core hp-gap=0 victory rounds=6 fight-rounds=6 hp=10/46 surviving={"girtablilu":10,"anzu":0} salves-used=0 actions={"girtablilu/envenom":0.16666666666666666,"girtablilu/pincer":0.8333333333333334,"anzu/revoke":0.2,"anzu/stolen-bolt":0.6,"anzu/talon":0.2} opening=[{"kind":"act","expectedRevision":0,"actor":"girtablilu","action":"envenom","target":{"enemy":"warden-of-correct-form#1","part":"core"}},{"kind":"act","expectedRevision":1,"actor":"anzu","action":"revoke","target":{"intent":"r1.warden-of-correct-form#1.clamp"}},{"kind":"endPhase","expectedRevision":2}]
CLASS girtablilu+anzu/warden/fresh/salves=false warden-of-correct-form#1/saw hp-gap=lost no win found
OPENINGS girtablilu+anzu/warden/fresh/salves=true count=110 wins=2 best=victory rounds=8 fight-rounds=8 hp=3/46 surviving={"girtablilu":3,"anzu":0} salves-used=2 actions={"girtablilu/envenom":0.125,"girtablilu/pincer":0.625,"girtablilu/salve":0.25,"anzu/revoke":0.2,"anzu/stolen-bolt":0.6,"anzu/talon":0.2} opening=[{"kind":"act","expectedRevision":0,"actor":"girtablilu","action":"envenom","target":{"enemy":"warden-of-correct-form#1","part":"core"}},{"kind":"act","expectedRevision":1,"actor":"anzu","action":"revoke","target":{"intent":"r1.warden-of-correct-form#1.clamp"}},{"kind":"endPhase","expectedRevision":2}]
CLASS girtablilu+anzu/warden/fresh/salves=true control hp-gap=lost no win found
CLASS girtablilu+anzu/warden/fresh/salves=true mixed hp-gap=lost no win found
CLASS girtablilu+anzu/warden/fresh/salves=true warden-of-correct-form#1/choir hp-gap=0 victory rounds=8 fight-rounds=8 hp=3/46 surviving={"girtablilu":3,"anzu":0} salves-used=2 actions={"girtablilu/envenom":0.125,"girtablilu/pincer":0.625,"girtablilu/salve":0.25,"anzu/revoke":0.2,"anzu/stolen-bolt":0.6,"anzu/talon":0.2} opening=[{"kind":"act","expectedRevision":0,"actor":"girtablilu","action":"envenom","target":{"enemy":"warden-of-correct-form#1","part":"choir"}},{"kind":"act","expectedRevision":1,"actor":"anzu","action":"revoke","target":{"intent":"r1.warden-of-correct-form#1.clamp"}},{"kind":"endPhase","expectedRevision":2}]
CLASS girtablilu+anzu/warden/fresh/salves=true warden-of-correct-form#1/clamp hp-gap=lost no win found
CLASS girtablilu+anzu/warden/fresh/salves=true warden-of-correct-form#1/core hp-gap=0 victory rounds=8 fight-rounds=8 hp=3/46 surviving={"girtablilu":3,"anzu":0} salves-used=2 actions={"girtablilu/envenom":0.125,"girtablilu/pincer":0.625,"girtablilu/salve":0.25,"anzu/revoke":0.2,"anzu/stolen-bolt":0.6,"anzu/talon":0.2} opening=[{"kind":"act","expectedRevision":0,"actor":"girtablilu","action":"envenom","target":{"enemy":"warden-of-correct-form#1","part":"core"}},{"kind":"act","expectedRevision":1,"actor":"anzu","action":"revoke","target":{"intent":"r1.warden-of-correct-form#1.clamp"}},{"kind":"endPhase","expectedRevision":2}]
CLASS girtablilu+anzu/warden/fresh/salves=true warden-of-correct-form#1/saw hp-gap=lost no win found
OPENINGS ugallu+girtablilu+anzu/warden/fresh/salves=false count=1430 wins=1430 best=victory rounds=5 fight-rounds=5 hp=67/86 surviving={"ugallu":36,"girtablilu":20,"anzu":11} salves-used=0 actions={"ugallu/rend":0.75,"ugallu/claw":0.25,"girtablilu/envenom":0.25,"girtablilu/pincer":0.75,"anzu/stolen-bolt":1} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"rend","target":{"enemy":"warden-of-correct-form#1","part":"clamp"}},{"kind":"act","expectedRevision":1,"actor":"girtablilu","action":"envenom","target":{"enemy":"warden-of-correct-form#1","part":"core"}},{"kind":"act","expectedRevision":2,"actor":"anzu","action":"stolen-bolt","target":{"enemy":"warden-of-correct-form#1","part":"choir"}},{"kind":"endPhase","expectedRevision":3}]
CLASS ugallu+girtablilu+anzu/warden/fresh/salves=false control hp-gap=12 victory rounds=5 fight-rounds=5 hp=55/86 surviving={"ugallu":27,"girtablilu":17,"anzu":11} salves-used=0 actions={"ugallu/hold-the-threshold":0.2,"ugallu/claw":0.8,"girtablilu/envenom":0.25,"girtablilu/pincer":0.75,"anzu/revoke":0.25,"anzu/stolen-bolt":0.5,"anzu/talon":0.25} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"hold-the-threshold","target":{"brood":"ugallu"}},{"kind":"act","expectedRevision":1,"actor":"girtablilu","action":"envenom","target":{"enemy":"warden-of-correct-form#1","part":"clamp"}},{"kind":"act","expectedRevision":2,"actor":"anzu","action":"revoke","target":{"intent":"r1.warden-of-correct-form#1.clamp"}},{"kind":"endPhase","expectedRevision":3}]
CLASS ugallu+girtablilu+anzu/warden/fresh/salves=false mixed hp-gap=0 victory rounds=5 fight-rounds=5 hp=67/86 surviving={"ugallu":36,"girtablilu":20,"anzu":11} salves-used=0 actions={"ugallu/rend":0.75,"ugallu/claw":0.25,"girtablilu/envenom":0.25,"girtablilu/pincer":0.75,"anzu/stolen-bolt":1} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"rend","target":{"enemy":"warden-of-correct-form#1","part":"clamp"}},{"kind":"act","expectedRevision":1,"actor":"girtablilu","action":"envenom","target":{"enemy":"warden-of-correct-form#1","part":"core"}},{"kind":"act","expectedRevision":2,"actor":"anzu","action":"stolen-bolt","target":{"enemy":"warden-of-correct-form#1","part":"choir"}},{"kind":"endPhase","expectedRevision":3}]
CLASS ugallu+girtablilu+anzu/warden/fresh/salves=false warden-of-correct-form#1/choir hp-gap=3 victory rounds=5 fight-rounds=5 hp=64/86 surviving={"ugallu":30,"girtablilu":20,"anzu":14} salves-used=0 actions={"ugallu/claw":0.8,"ugallu/rend":0.2,"girtablilu/pincer":1,"anzu/revoke":0.25,"anzu/stolen-bolt":0.75} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"claw","target":{"enemy":"warden-of-correct-form#1","part":"choir"}},{"kind":"act","expectedRevision":1,"actor":"girtablilu","action":"pincer","target":{"enemy":"warden-of-correct-form#1","part":"choir"}},{"kind":"act","expectedRevision":2,"actor":"anzu","action":"revoke","target":{"intent":"r1.warden-of-correct-form#1.clamp"}},{"kind":"endPhase","expectedRevision":3}]
CLASS ugallu+girtablilu+anzu/warden/fresh/salves=false warden-of-correct-form#1/clamp hp-gap=8 victory rounds=5 fight-rounds=5 hp=59/86 surviving={"ugallu":27,"girtablilu":17,"anzu":15} salves-used=0 actions={"ugallu/rend":0.2,"ugallu/claw":0.8,"girtablilu/pincer":1,"anzu/stolen-bolt":0.75,"anzu/talon":0.25} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"rend","target":{"enemy":"warden-of-correct-form#1","part":"clamp"}},{"kind":"act","expectedRevision":1,"actor":"girtablilu","action":"pincer","target":{"enemy":"warden-of-correct-form#1","part":"clamp"}},{"kind":"act","expectedRevision":2,"actor":"anzu","action":"stolen-bolt","target":{"enemy":"warden-of-correct-form#1","part":"clamp"}},{"kind":"endPhase","expectedRevision":3}]
CLASS ugallu+girtablilu+anzu/warden/fresh/salves=false warden-of-correct-form#1/core hp-gap=5 victory rounds=4 fight-rounds=4 hp=62/86 surviving={"ugallu":28,"girtablilu":18,"anzu":16} salves-used=0 actions={"ugallu/claw":1,"girtablilu/pincer":1,"anzu/revoke":0.3333333333333333,"anzu/stolen-bolt":0.6666666666666666} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"claw","target":{"enemy":"warden-of-correct-form#1","part":"core"}},{"kind":"act","expectedRevision":1,"actor":"girtablilu","action":"pincer","target":{"enemy":"warden-of-correct-form#1","part":"core"}},{"kind":"act","expectedRevision":2,"actor":"anzu","action":"revoke","target":{"intent":"r1.warden-of-correct-form#1.clamp"}},{"kind":"endPhase","expectedRevision":3}]
CLASS ugallu+girtablilu+anzu/warden/fresh/salves=false warden-of-correct-form#1/saw hp-gap=12 victory rounds=5 fight-rounds=5 hp=55/86 surviving={"ugallu":27,"girtablilu":17,"anzu":11} salves-used=0 actions={"ugallu/claw":1,"girtablilu/pincer":1,"anzu/revoke":0.25,"anzu/stolen-bolt":0.5,"anzu/talon":0.25} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"claw","target":{"enemy":"warden-of-correct-form#1","part":"saw"}},{"kind":"act","expectedRevision":1,"actor":"girtablilu","action":"pincer","target":{"enemy":"warden-of-correct-form#1","part":"saw"}},{"kind":"act","expectedRevision":2,"actor":"anzu","action":"revoke","target":{"intent":"r1.warden-of-correct-form#1.clamp"}},{"kind":"endPhase","expectedRevision":3}]
OPENINGS ugallu+girtablilu+anzu/warden/fresh/salves=true count=1430 wins=1430 best=victory rounds=5 fight-rounds=5 hp=80/86 surviving={"ugallu":38,"girtablilu":20,"anzu":22} salves-used=2 actions={"ugallu/claw":0.4,"ugallu/rend":0.2,"ugallu/salve":0.4,"girtablilu/envenom":0.2,"girtablilu/pincer":0.8,"anzu/revoke":0.2,"anzu/stolen-bolt":0.6,"anzu/talon":0.2} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"claw","target":{"enemy":"warden-of-correct-form#1","part":"choir"}},{"kind":"act","expectedRevision":1,"actor":"girtablilu","action":"envenom","target":{"enemy":"warden-of-correct-form#1","part":"choir"}},{"kind":"act","expectedRevision":2,"actor":"anzu","action":"revoke","target":{"intent":"r1.warden-of-correct-form#1.clamp"}},{"kind":"endPhase","expectedRevision":3}]
CLASS ugallu+girtablilu+anzu/warden/fresh/salves=true control hp-gap=11 victory rounds=5 fight-rounds=5 hp=69/86 surviving={"ugallu":35,"girtablilu":23,"anzu":11} salves-used=2 actions={"ugallu/hold-the-threshold":0.2,"ugallu/claw":0.6,"ugallu/salve":0.2,"girtablilu/envenom":0.25,"girtablilu/pincer":0.5,"girtablilu/salve":0.25,"anzu/revoke":0.2,"anzu/stolen-bolt":0.6,"anzu/talon":0.2} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"hold-the-threshold","target":{"brood":"ugallu"}},{"kind":"act","expectedRevision":1,"actor":"girtablilu","action":"envenom","target":{"enemy":"warden-of-correct-form#1","part":"clamp"}},{"kind":"act","expectedRevision":2,"actor":"anzu","action":"revoke","target":{"intent":"r1.warden-of-correct-form#1.clamp"}},{"kind":"endPhase","expectedRevision":3}]
CLASS ugallu+girtablilu+anzu/warden/fresh/salves=true mixed hp-gap=0 victory rounds=5 fight-rounds=5 hp=80/86 surviving={"ugallu":38,"girtablilu":20,"anzu":22} salves-used=2 actions={"ugallu/rend":0.4,"ugallu/salve":0.4,"ugallu/claw":0.2,"girtablilu/pincer":1,"anzu/revoke":0.2,"anzu/stolen-bolt":0.6,"anzu/talon":0.2} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"rend","target":{"enemy":"warden-of-correct-form#1","part":"choir"}},{"kind":"act","expectedRevision":1,"actor":"girtablilu","action":"pincer","target":{"enemy":"warden-of-correct-form#1","part":"core"}},{"kind":"act","expectedRevision":2,"actor":"anzu","action":"revoke","target":{"intent":"r1.warden-of-correct-form#1.clamp"}},{"kind":"endPhase","expectedRevision":3}]
CLASS ugallu+girtablilu+anzu/warden/fresh/salves=true warden-of-correct-form#1/choir hp-gap=0 victory rounds=5 fight-rounds=5 hp=80/86 surviving={"ugallu":38,"girtablilu":20,"anzu":22} salves-used=2 actions={"ugallu/claw":0.4,"ugallu/rend":0.2,"ugallu/salve":0.4,"girtablilu/envenom":0.2,"girtablilu/pincer":0.8,"anzu/revoke":0.2,"anzu/stolen-bolt":0.6,"anzu/talon":0.2} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"claw","target":{"enemy":"warden-of-correct-form#1","part":"choir"}},{"kind":"act","expectedRevision":1,"actor":"girtablilu","action":"envenom","target":{"enemy":"warden-of-correct-form#1","part":"choir"}},{"kind":"act","expectedRevision":2,"actor":"anzu","action":"revoke","target":{"intent":"r1.warden-of-correct-form#1.clamp"}},{"kind":"endPhase","expectedRevision":3}]
CLASS ugallu+girtablilu+anzu/warden/fresh/salves=true warden-of-correct-form#1/clamp hp-gap=7 victory rounds=5 fight-rounds=5 hp=73/86 surviving={"ugallu":35,"girtablilu":23,"anzu":15} salves-used=2 actions={"ugallu/rend":0.2,"ugallu/claw":0.6,"ugallu/salve":0.2,"girtablilu/pincer":0.8,"girtablilu/salve":0.2,"anzu/stolen-bolt":0.8,"anzu/talon":0.2} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"rend","target":{"enemy":"warden-of-correct-form#1","part":"clamp"}},{"kind":"act","expectedRevision":1,"actor":"girtablilu","action":"pincer","target":{"enemy":"warden-of-correct-form#1","part":"clamp"}},{"kind":"act","expectedRevision":2,"actor":"anzu","action":"stolen-bolt","target":{"enemy":"warden-of-correct-form#1","part":"clamp"}},{"kind":"endPhase","expectedRevision":3}]
CLASS ugallu+girtablilu+anzu/warden/fresh/salves=true warden-of-correct-form#1/core hp-gap=11 victory rounds=5 fight-rounds=5 hp=69/86 surviving={"ugallu":35,"girtablilu":23,"anzu":11} salves-used=2 actions={"ugallu/claw":0.8,"ugallu/salve":0.2,"girtablilu/pincer":0.75,"girtablilu/salve":0.25,"anzu/revoke":0.25,"anzu/stolen-bolt":0.5,"anzu/talon":0.25} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"claw","target":{"enemy":"warden-of-correct-form#1","part":"core"}},{"kind":"act","expectedRevision":1,"actor":"girtablilu","action":"pincer","target":{"enemy":"warden-of-correct-form#1","part":"core"}},{"kind":"act","expectedRevision":2,"actor":"anzu","action":"revoke","target":{"intent":"r1.warden-of-correct-form#1.clamp"}},{"kind":"endPhase","expectedRevision":3}]
CLASS ugallu+girtablilu+anzu/warden/fresh/salves=true warden-of-correct-form#1/saw hp-gap=11 victory rounds=5 fight-rounds=5 hp=69/86 surviving={"ugallu":35,"girtablilu":23,"anzu":11} salves-used=2 actions={"ugallu/claw":0.8,"ugallu/salve":0.2,"girtablilu/pincer":0.8,"girtablilu/salve":0.2,"anzu/revoke":0.2,"anzu/stolen-bolt":0.6,"anzu/talon":0.2} opening=[{"kind":"act","expectedRevision":0,"actor":"ugallu","action":"claw","target":{"enemy":"warden-of-correct-form#1","part":"saw"}},{"kind":"act","expectedRevision":1,"actor":"girtablilu","action":"pincer","target":{"enemy":"warden-of-correct-form#1","part":"saw"}},{"kind":"act","expectedRevision":2,"actor":"anzu","action":"revoke","target":{"intent":"r1.warden-of-correct-form#1.clamp"}},{"kind":"endPhase","expectedRevision":3}]
ok dominance: 0 encounter/class groups meet 6-of-7 and 10-HP gap; cells=none
FLAG indifference: 1 cells: every winning opening within 2 HP; cells=girtablilu+anzu/warden/fresh/salves=true
FLAG core-best-without-Salves: 1 multi-Brood cells have a core class tied for best; cells=girtablilu+anzu/warden/fresh/salves=false
ok disabling-first: 0/1 winning Girtablilu lines open with component Pincer; cells=none
ok Revoke-every-Saw: 0/2 declared Saws revoked in winning Anzu lines; cells=none
FLAG policy-matches-search/always-disable: 13/14 cells match (threshold 75%); cells=ugallu/warden/fresh; ugallu/gauntlet/fresh; girtablilu/warden/fresh; girtablilu/gauntlet/fresh; ugallu+girtablilu/warden/fresh; ugallu+girtablilu/gauntlet/fresh; anzu/warden/fresh; anzu/gauntlet/fresh; ugallu+anzu/warden/fresh; ugallu+anzu/gauntlet/fresh; girtablilu+anzu/warden/fresh; girtablilu+anzu/gauntlet/fresh; ugallu+girtablilu+anzu/gauntlet/fresh
FLAG policy-matches-search/always-core: 13/14 cells match (threshold 75%); cells=ugallu/warden/fresh; ugallu/gauntlet/fresh; girtablilu/warden/fresh; girtablilu/gauntlet/fresh; ugallu+girtablilu/warden/fresh; ugallu+girtablilu/gauntlet/fresh; anzu/warden/fresh; anzu/gauntlet/fresh; ugallu+anzu/warden/fresh; ugallu+anzu/gauntlet/fresh; girtablilu+anzu/warden/fresh; girtablilu+anzu/gauntlet/fresh; ugallu+girtablilu+anzu/gauntlet/fresh
FLAG policy-matches-search/poison-then-Guard: 6/8 cells match (threshold 75%); cells=girtablilu/warden/fresh; girtablilu/gauntlet/fresh; ugallu+girtablilu/gauntlet/fresh; girtablilu+anzu/warden/fresh; girtablilu+anzu/gauntlet/fresh; ugallu+girtablilu+anzu/gauntlet/fresh
FLAG policy-matches-search/Rapture-as-soon-as-possible: 12/14 cells match (threshold 75%); cells=ugallu/warden/fresh; ugallu/gauntlet/fresh; girtablilu/warden/fresh; girtablilu/gauntlet/fresh; ugallu+girtablilu/warden/fresh; ugallu+girtablilu/gauntlet/fresh; anzu/warden/fresh; anzu/gauntlet/fresh; ugallu+anzu/gauntlet/fresh; girtablilu+anzu/gauntlet/fresh; ugallu+girtablilu+anzu/warden/fresh; ugallu+girtablilu+anzu/gauntlet/fresh
FLAG policy-matches-search/never-use-Revelation-skills: 13/14 cells match (threshold 75%); cells=ugallu/warden/fresh; ugallu/gauntlet/fresh; girtablilu/warden/fresh; girtablilu/gauntlet/fresh; ugallu+girtablilu/warden/fresh; ugallu+girtablilu/gauntlet/fresh; anzu/warden/fresh; anzu/gauntlet/fresh; ugallu+anzu/warden/fresh; ugallu+anzu/gauntlet/fresh; girtablilu+anzu/warden/fresh; girtablilu+anzu/gauntlet/fresh; ugallu+girtablilu+anzu/gauntlet/fresh
FLAG policy-matches-search/Revoke-every-Saw: 6/8 cells match (threshold 75%); cells=anzu/warden/fresh; anzu/gauntlet/fresh; ugallu+anzu/gauntlet/fresh; girtablilu+anzu/gauntlet/fresh; ugallu+girtablilu+anzu/warden/fresh; ugallu+girtablilu+anzu/gauntlet/fresh
ok rare-action/girtablilu/pincer: 30/42 actions (71.43%; threshold <5%); cells=girtablilu/warden/fresh; girtablilu/gauntlet/fresh; ugallu+girtablilu/warden/fresh; ugallu+girtablilu/gauntlet/fresh; girtablilu+anzu/warden/fresh; girtablilu+anzu/gauntlet/fresh; ugallu+girtablilu+anzu/warden/fresh; ugallu+girtablilu+anzu/gauntlet/fresh
FLAG rare-action/ugallu/hold-the-threshold: 0/44 actions (0.00%; threshold <5%); cells=ugallu/warden/fresh; ugallu/gauntlet/fresh; ugallu+girtablilu/warden/fresh; ugallu+girtablilu/gauntlet/fresh; ugallu+anzu/warden/fresh; ugallu+anzu/gauntlet/fresh; ugallu+girtablilu+anzu/warden/fresh; ugallu+girtablilu+anzu/gauntlet/fresh
FLAG rare-action/anzu/guard: 0/28 actions (0.00%; threshold <5%); cells=anzu/warden/fresh; anzu/gauntlet/fresh; ugallu+anzu/warden/fresh; ugallu+anzu/gauntlet/fresh; girtablilu+anzu/warden/fresh; girtablilu+anzu/gauntlet/fresh; ugallu+girtablilu+anzu/warden/fresh; ugallu+girtablilu+anzu/gauntlet/fresh
ok more-than-10-rounds: winning duo/trio fights longer than 10 rounds; cells=none
ok cleanup: winning lines with cleanup >2 rounds; cells=none
FLAG trio-gauntlet-loses: ugallu+girtablilu+anzu/gauntlet/fresh=52/86, no-win-found; cells=ugallu+girtablilu+anzu/gauntlet/fresh
ok duo-gauntlet-margins: ugallu+girtablilu/gauntlet/fresh=4/64, no-win-found; ugallu+anzu/gauntlet/fresh=10/62, no-win-found; girtablilu+anzu/gauntlet/fresh=28/46, no-win-found; cells=none
FLAG solo-Ugallu-Warden-route: ugallu/warden/fresh=no-win-found; cells=ugallu/warden/fresh
ok H4-intent-predictability: human test required; cells=none
ok H6-component-usability: human test required; cells=none
```

</details>

## Handoff validation

Copied `.agents/skills/ruach-handoff` to `/tmp/p2-q04-handoff.29aEeo/ruach-handoff`. Ran `bun install --frozen-lockfile` there: exit 0, `6 packages installed [32.00ms]`. Generated sources unchanged.

From the worktree root:

```sh
bun /tmp/p2-q04-handoff.29aEeo/ruach-handoff/scripts/validate.ts docs/mailbox/poc-002-q04/implementer.md --repo .
```

Exit 0. Exact stdout:

```json
{"schema_version":1,"ok":true,"report":"/opt/dev/tehom-brainlab-p2-q04/docs/mailbox/poc-002-q04/implementer.md","repo":"/opt/dev/tehom-brainlab-p2-q04","revisions":[{"path":"/source_baseline","resolved":"d6b7249babf1e303dbace0be2303bc6bce1841cd"},{"path":"/candidate_revision","resolved":"e99df773d85b2e4ef09f9d919b7482dcffcf4661"},{"path":"/tested_revision","resolved":"e99df773d85b2e4ef09f9d919b7482dcffcf4661"}],"diagnostics":[]}
```

Reran after recording the result: exit 0, same resolved revisions and no diagnostics. Mechanical validation does not imply implementation completion or acceptance. Assignment SHA-256: `60aafade469fd322b6058387fd9f0f0bbcfecb8a4872d995bf8d4702ced90103`.


The initial evidence `git add`/`git commit` attempt could not create the linked-worktree index lock outside the writable root (read-only filesystem). Retried the authorized evidence commit with Git metadata access; no implementation changes or automatic approval rejection.
