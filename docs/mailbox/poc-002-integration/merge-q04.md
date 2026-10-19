task: P2-INT
checkpoint: Q04
status: complete
outcome: Q04 merged with the authorized test conflict resolved; sweep/probe recipes and README assembled; full bare verification passed
source_baseline: e9c87a794956b1c7e3333c54c03f5636a6a40abc
source_branch: p2-q04
candidate_revision: f00781a96bf31a0166ba4b109cfa15e18d447934
handoff_revision: 1f78fae775ccb99fa3936754767a041ead728840
merge_revision: 406e8fd839fcc82dc01623b7dbd4204da36042cf
combined_revision: 6d9801fb77feb2d9e9166279a4c3fca2820e5185
tested_revision: 6d9801fb77feb2d9e9166279a4c3fca2820e5185
destination_branch: poc-002-component-combat
conflict_resolutions:
  - "poc-002-component-combat/tests/q01-toolchain.test.ts retained Q03 replay dispatch and Q04 sweep/probe dispatch checks; removed only superseded deferred assertions"
artifacts:
  - docs/mailbox/poc-002-integration/merge-q04.md
  - docs/mailbox/poc-002-integration/assignment-implementer.md
  - docs/mailbox/poc-002-q04/implementer.md
  - justfile
  - README.md
  - poc-002-component-combat/README.md
verification:
  - "All ten recipes exercised bare with assigned sweep --quick; install/typecheck/test/build/test-browser/replay/sweep/probe exited 0; dev/preview HTTP checks and cleanup passed"
  - "273 tests across 12 files and 308 browser assertions across 2 harnesses passed"
  - "Quick sweep: 53.438 seconds wall time, 154 cells, 115 winning witnesses, 14 opening groups and 3648 distinct openings"
  - "Default probe: 60.674 seconds wall time, 14 comparison cells, 9 winning witnesses, 14 opening groups and 3648 distinct openings"
  - "just --list and git diff --check exited 0; protected-path and assets diffs empty"
  - "Temporary-copy ruach-handoff validator exited 0 with no diagnostics"
review: not-run
discoveries:
  - "The only conflict was the explicitly authorized Q01 replay/sweep/probe placeholder reconciliation; all three implemented-script checks are retained"
  - "Harness flags are diagnostic evidence, not verification failures; loss means no win was found within the reported heuristic search"
  - "Browser checks passed on default port 4273 without contention or overrides; no retry was needed"
blockers: []

# Q04 integration handoff

Author: P2-INT Implementer / integration owner, 2026-10-19. Authority: [standing assignment](assignment-implementer.md), merge-step-7 instructions including the Q01 test exception/conflict resolution, and explicit-path/shared-index staging rules. Source evidence: [Q04 handoff](../poc-002-q04/implementer.md).

## Source readiness and merge

Initial branch: `poc-002-component-combat`; working tree clean. `git rev-parse HEAD p2-q04 f00781a 1f78fae` resolved the baseline, source tip, accepted candidate and handoff above. Source tip was exactly `1f78fae`. Both `git merge-base --is-ancestor f00781a p2-q04` and `git merge-base --is-ancestor 1f78fae p2-q04` exited 0.

`git merge-base HEAD p2-q04` returned `d6b7249babf1e303dbace0be2303bc6bce1841cd`. Inspected `git diff --stat $(git merge-base HEAD p2-q04)..p2-q04` and matching `--name-only`: 12 paths, 2159 insertions and 1 deletion. Of ten implementation paths, nine are Q04-owned: two CLI entry points, six `src/harness/` modules and `tests/q04-harness.test.ts`. The tenth is the explicitly authorized sweep/probe change in `tests/q01-toolchain.test.ts`. The other two paths are Q04's required mailbox assignment/handoff, authorized by the plan and SCHEMA. No other out-of-scope path was present.

Before merging, `git diff --cached --quiet` exited 0. `git merge --no-ff p2-q04 -m "Merge Q04 sweep and probe into POC 002 integration"` initially exited 1 with exactly one content conflict, in `poc-002-component-combat/tests/q01-toolchain.test.ts`, as anticipated by the Coordinator.

Mechanical resolution under the explicit exception:

- Retained Q03's replay-dispatch test unchanged, including successful unfinished-record replay, output shape and empty stderr assertions.
- Retained Q04's sweep/probe-dispatch test unchanged, including `--help`, successful exit and named help/`--probe-width` assertions.
- Removed the superseded replay/sweep/probe deferred case table; every invalid-port and prerequisite test remained unchanged.

Staged only the resolved test path. Before the merge commit, compared the complete staged path set with `git diff --name-only d6b7249..p2-q04`: exact equality, so no unrelated or concurrent files entered the commit. `git diff --cached --check` exited 0; `git commit -m "Merge Q04 sweep and probe into POC 002 integration"` exited 0, completing the original non-fast-forward merge as `406e8fd839fcc82dc01623b7dbd4204da36042cf`. First parent is the recorded source baseline; second parent is the named handoff. No other conflict or checkpoint-code correction.

## Integration assembly

Commit `6d9801fb77feb2d9e9166279a4c3fca2820e5185` changes only:

- Root `justfile`: `poc-002-sweep` and `poc-002-probe`, preserving `*args` and `"$@"` forwarding through the prototype wrapper, matching the existing recipe pattern.
- Root README: ten available recipes and Q04 harness status.
- Prototype README: supplied Q04 section with root just commands; sweep/probe marked implemented, default/quick search limits and evidence interpretation retained.

Checked `git diff --cached --quiet`, staged only those three explicit paths, and committed using `git commit --only justfile README.md poc-002-component-combat/README.md -m "Wire Q04 sweep and probe recipes and assemble harness documentation"`. The report commit likewise stages and commits only this report. No branch movement was observed during verification. No push or master merge. The assignment is already committed unchanged with the first report. The report-creating SHA is returned separately from the combined/tested revision.

## Full bare verification

All recipes ran from `/opt/dev/tehom-brainlab-poc002` with exactly the arguments shown and no caller-supplied environment overrides. Existing Docker socket and linked-worktree Git metadata access used sandbox escalation; no automatic approval rejection occurred.

| Exact recipe/check | Result |
| --- | --- |
| `just --list` | Exit 0; ten POC 002 recipes listed. |
| `just poc-002-install` | Exit 0; Bun 1.4.2; checked 43 installs across 86 packages, no changes. |
| `just poc-002-typecheck` | Exit 0; `tsc --noEmit`. |
| `just poc-002-test` | Exit 0; 12 files, 273 tests passed, including all three dispatch replacements and 15 Q04 tests. Q04 breakpoint coverage took 3,119 ms under its existing explicit timeout. |
| `just poc-002-build` | Exit 0; 4 verified assets prepared, 19 modules transformed, built in 505 ms. |
| `just poc-002-dev` | Default port 5273; HTTP 200 with expected title; targeted stop succeeded. Expected process exit 143 after deliberate termination. |
| `just poc-002-preview` | Default port 4273; HTTP 200 with expected title; targeted stop succeeded before browser checks. Expected process exit 143 after deliberate termination. |
| `just poc-002-test-browser` | Exit 0; fresh build in 783 ms; 308 assertions (302 battle, 6 smoke); preview stopped as expected. Default port 4273, no busy-port failure or retry. |
| `just poc-002-replay poc-002-component-combat/fixtures/parity/gauntlet-win-trio-v1.json` | Exit 0; `commands=46 events=231 outcome=victory`. |
| `just poc-002-sweep --quick` | Exit 0; wall time 53.438 s; 154 cells, 115 winning witnesses, 14 opening groups/3,648 openings. |
| `just poc-002-probe` | Exit 0; wall time 60.674 s; 14 comparison cells, 9 winning witnesses, 14 opening groups/3,648 openings. |
| `git diff --check` | Exit 0, no output. |
| `git diff --check e9c87a794956b1c7e3333c54c03f5636a6a40abc..HEAD` | Exit 0, no output. |
| `git diff --stat e9c87a794956b1c7e3333c54c03f5636a6a40abc..HEAD -- poc-001-linked-formation shared docs/CURRENT.md docs/TASK_LOGS.md` | Exit 0, empty output. |
| `git diff --stat e9c87a794956b1c7e3333c54c03f5636a6a40abc..HEAD -- assets` | Exit 0, empty output. |

The assigned quick sweep uses beam 8; the default probe uses reference beam 200. Both use depth 30 rounds per fight, exhaustive solo prefix 4 completed rounds and opening continuation width 1. Sweep opening analysis covers Warden; other encounters are beam samples. Every report states `heuristic search; a loss means no win was found`. Signal flags are evidence, not balance gates. The full default-width 154-cell sweep was not run; the Coordinator explicitly requested `--quick` for this integration step.

Exact timed invocations (Bash built-in `time`; only output redirection, no application environment changes):

```sh
{ time just poc-002-sweep --quick > /tmp/p2-int-q04-verification.7DbZf7/sweep.txt 2> /tmp/p2-int-q04-verification.7DbZf7/sweep.stderr; } 2> /tmp/p2-int-q04-verification.7DbZf7/sweep.time
{ time just poc-002-probe > /tmp/p2-int-q04-verification.7DbZf7/probe.txt 2> /tmp/p2-int-q04-verification.7DbZf7/probe.stderr; } 2> /tmp/p2-int-q04-verification.7DbZf7/probe.time
```

They ran concurrently; durations are actual wall times including Docker startup, not inferred tool-session intervals. Timing files reported `real 0m53.438s` and `real 1m0.674s`. Both application stderr files were empty. Parent-shell user/system times do not measure container CPU work and are not used. Quick sweep completed below the approximately five-minute target. Raw stdout remains disposable in the temporary directory; all summary signal lines, including triggering-cell lists, are preserved below.

HTTP/readiness and targeted cleanup commands, all exit 0:

```sh
curl --fail --silent --show-error --include http://localhost:5273/
docker ps --filter publish=5273 --format '{{.ID}} {{.Names}} {{.Ports}}'
docker ps --filter publish=4273 --format '{{.ID}} {{.Names}} {{.Ports}}'
docker stop -t 5 c247137ae532
curl --fail --silent --show-error --include http://localhost:4273/
docker ps --filter publish=4273 --format '{{.ID}} {{.Names}} {{.Ports}}'
docker stop -t 5 90296592f45e
```

Both responses contained `TEHOM — Component Combat`. The early 4273 check returned no container. Only this step's identified dev/preview containers were stopped; no other worker's container was touched. Bun/just's exit-143 messages followed intentional service termination, with readiness and cleanup successful.

Browser discovery automatically selected `/home/metatron/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`. Artifacts are under `/tmp/poc-002-browser-WVevMv/battle/` (`warden-selection.png`, `intent-panel.png`, `preview.png`) and `/tmp/poc-002-browser-WVevMv/smoke/`. The runner stopped its named container `poc-002-browser-d3b09d18-ec1d-4f47-b8c5-aec813e71995`. Battle outcomes/accepted commands: guard victory/9, scribe victory/9, beast victory/17, guard-scribe defeat/27, beast-scribe defeat/24, guard-beast defeat/24, Warden victory/15. Both builds retained the existing Vite chunk-size warning and exited 0.

Original seeds also passed unchanged in the combined unit run: Girtablilu 7 commands/48 events, victory round 4 HP 6 Revelation 2; Ugallu 35 commands/146 events, victory round 18 HP 3 Revelation 4. No human playtest, subjective audio listening or independent review was performed. All assigned integration checks ran; no blockers remain.

## Summary signal lines from the combined revision

The following lines are copied verbatim from this step's successful stdout, without the per-cell/policy/opening traces. The `ok` human-test signals still require human testing. Quick sweep and default probe use different reference beams, so their winning margins and policy comparisons can differ.

<details>
<summary>Quick sweep: 154 cells, 115 winning witnesses; 53.438 seconds</summary>

```text
ok dominance: 0 encounter/class groups meet 6-of-7 and 10-HP gap; cells=none
FLAG indifference: 1 cells: every winning opening within 2 HP; cells=girtablilu+anzu/warden/fresh/salves=true
FLAG core-best-without-Salves: 1 multi-Brood cells have a core class tied for best; cells=girtablilu+anzu/warden/fresh/salves=false
ok disabling-first: 6/70 winning Girtablilu lines open with component Pincer; cells=none
ok Revoke-every-Saw: 0/17 declared Saws revoked in winning Anzu lines; cells=none
ok policy-matches-search/always-disable: 51/154 cells match (threshold 75%); cells=ugallu/scribe/fresh; ugallu/beast-scribe/wounded; ugallu/guard-beast/fresh; ugallu/guard-beast/wounded; ugallu/warden/wounded; ugallu/gauntlet/fresh; girtablilu/guard/wounded; girtablilu/guard-scribe/fresh; girtablilu/guard-scribe/wounded; girtablilu/guard-scribe/primed; girtablilu/beast-scribe/fresh; girtablilu/beast-scribe/wounded; girtablilu/beast-scribe/primed; girtablilu/guard-beast/fresh; girtablilu/guard-beast/wounded; girtablilu/guard-beast/primed; girtablilu/warden/fresh; girtablilu/warden/wounded; girtablilu/warden/primed; girtablilu/gauntlet/fresh; ugallu+girtablilu/scribe/fresh; ugallu+girtablilu/scribe/wounded; ugallu+girtablilu/guard-beast/wounded; anzu/beast/wounded; anzu/guard-scribe/fresh; anzu/guard-scribe/wounded; anzu/guard-scribe/primed; anzu/beast-scribe/fresh; anzu/beast-scribe/wounded; anzu/beast-scribe/primed; anzu/guard-beast/fresh; anzu/guard-beast/wounded; anzu/guard-beast/primed; anzu/warden/fresh; anzu/warden/wounded; anzu/warden/primed; anzu/gauntlet/fresh; ugallu+anzu/scribe/fresh; ugallu+anzu/scribe/wounded; ugallu+anzu/scribe/primed; ugallu+anzu/guard-beast/wounded; ugallu+anzu/gauntlet/fresh; girtablilu+anzu/scribe/fresh; girtablilu+anzu/guard-beast/wounded; girtablilu+anzu/warden/wounded; girtablilu+anzu/gauntlet/fresh; ugallu+girtablilu+anzu/scribe/fresh; ugallu+girtablilu+anzu/scribe/wounded; ugallu+girtablilu+anzu/scribe/primed; ugallu+girtablilu+anzu/beast/fresh; ugallu+girtablilu+anzu/beast/primed
ok policy-matches-search/always-core: 48/154 cells match (threshold 75%); cells=ugallu/scribe/primed; ugallu/beast-scribe/wounded; ugallu/guard-beast/fresh; ugallu/guard-beast/wounded; ugallu/warden/wounded; ugallu/gauntlet/fresh; girtablilu/guard/wounded; girtablilu/guard-scribe/fresh; girtablilu/guard-scribe/wounded; girtablilu/guard-scribe/primed; girtablilu/beast-scribe/fresh; girtablilu/beast-scribe/wounded; girtablilu/beast-scribe/primed; girtablilu/guard-beast/fresh; girtablilu/guard-beast/wounded; girtablilu/guard-beast/primed; girtablilu/warden/fresh; girtablilu/warden/wounded; girtablilu/warden/primed; girtablilu/gauntlet/fresh; ugallu+girtablilu/scribe/fresh; ugallu+girtablilu/scribe/wounded; ugallu+girtablilu/guard-beast/wounded; anzu/beast/wounded; anzu/guard-scribe/fresh; anzu/guard-scribe/wounded; anzu/guard-scribe/primed; anzu/beast-scribe/fresh; anzu/beast-scribe/wounded; anzu/beast-scribe/primed; anzu/guard-beast/fresh; anzu/guard-beast/wounded; anzu/guard-beast/primed; anzu/warden/fresh; anzu/warden/wounded; anzu/warden/primed; anzu/gauntlet/fresh; ugallu+anzu/scribe/fresh; ugallu+anzu/scribe/wounded; ugallu+anzu/scribe/primed; ugallu+anzu/guard-beast/wounded; ugallu+anzu/gauntlet/fresh; girtablilu+anzu/guard-beast/wounded; girtablilu+anzu/warden/wounded; girtablilu+anzu/gauntlet/fresh; ugallu+girtablilu+anzu/scribe/fresh; ugallu+girtablilu+anzu/scribe/wounded; ugallu+girtablilu+anzu/scribe/primed
ok policy-matches-search/poison-then-Guard: 26/88 cells match (threshold 75%); cells=girtablilu/guard/wounded; girtablilu/guard-scribe/fresh; girtablilu/guard-scribe/wounded; girtablilu/guard-scribe/primed; girtablilu/beast-scribe/fresh; girtablilu/beast-scribe/wounded; girtablilu/beast-scribe/primed; girtablilu/guard-beast/fresh; girtablilu/guard-beast/wounded; girtablilu/guard-beast/primed; girtablilu/warden/fresh; girtablilu/warden/wounded; girtablilu/warden/primed; girtablilu/gauntlet/fresh; ugallu+girtablilu/scribe/fresh; ugallu+girtablilu/scribe/wounded; ugallu+girtablilu/guard-beast/wounded; girtablilu+anzu/scribe/fresh; girtablilu+anzu/guard-beast/wounded; girtablilu+anzu/warden/wounded; girtablilu+anzu/gauntlet/fresh; ugallu+girtablilu+anzu/guard/fresh; ugallu+girtablilu+anzu/guard/primed; ugallu+girtablilu+anzu/scribe/fresh; ugallu+girtablilu+anzu/scribe/wounded; ugallu+girtablilu+anzu/scribe/primed
ok policy-matches-search/Rapture-as-soon-as-possible: 51/154 cells match (threshold 75%); cells=ugallu/beast-scribe/wounded; ugallu/guard-beast/fresh; ugallu/guard-beast/wounded; ugallu/warden/wounded; ugallu/gauntlet/fresh; girtablilu/guard/wounded; girtablilu/guard-scribe/fresh; girtablilu/guard-scribe/wounded; girtablilu/guard-scribe/primed; girtablilu/beast-scribe/fresh; girtablilu/beast-scribe/wounded; girtablilu/beast-scribe/primed; girtablilu/guard-beast/fresh; girtablilu/guard-beast/wounded; girtablilu/guard-beast/primed; girtablilu/warden/fresh; girtablilu/warden/wounded; girtablilu/warden/primed; girtablilu/gauntlet/fresh; ugallu+girtablilu/guard-beast/wounded; anzu/beast/wounded; anzu/guard-scribe/fresh; anzu/guard-scribe/wounded; anzu/guard-scribe/primed; anzu/beast-scribe/fresh; anzu/beast-scribe/wounded; anzu/beast-scribe/primed; anzu/guard-beast/fresh; anzu/guard-beast/wounded; anzu/guard-beast/primed; anzu/warden/fresh; anzu/warden/wounded; anzu/warden/primed; anzu/gauntlet/fresh; ugallu+anzu/scribe/fresh; ugallu+anzu/guard-beast/wounded; ugallu+anzu/warden/fresh; ugallu+anzu/warden/primed; ugallu+anzu/gauntlet/fresh; girtablilu+anzu/guard/fresh; girtablilu+anzu/guard/primed; girtablilu+anzu/guard-beast/wounded; girtablilu+anzu/warden/fresh; girtablilu+anzu/warden/primed; girtablilu+anzu/gauntlet/fresh; ugallu+girtablilu+anzu/guard/wounded; ugallu+girtablilu+anzu/beast/fresh; ugallu+girtablilu+anzu/beast/wounded; ugallu+girtablilu+anzu/warden/fresh; ugallu+girtablilu+anzu/warden/wounded; ugallu+girtablilu+anzu/warden/primed
ok policy-matches-search/never-use-Revelation-skills: 48/154 cells match (threshold 75%); cells=ugallu/scribe/primed; ugallu/beast-scribe/wounded; ugallu/guard-beast/fresh; ugallu/guard-beast/wounded; ugallu/warden/wounded; ugallu/gauntlet/fresh; girtablilu/guard/wounded; girtablilu/guard-scribe/fresh; girtablilu/guard-scribe/wounded; girtablilu/guard-scribe/primed; girtablilu/beast-scribe/fresh; girtablilu/beast-scribe/wounded; girtablilu/beast-scribe/primed; girtablilu/guard-beast/fresh; girtablilu/guard-beast/wounded; girtablilu/guard-beast/primed; girtablilu/warden/fresh; girtablilu/warden/wounded; girtablilu/warden/primed; girtablilu/gauntlet/fresh; ugallu+girtablilu/scribe/fresh; ugallu+girtablilu/scribe/wounded; ugallu+girtablilu/guard-beast/wounded; anzu/beast/wounded; anzu/guard-scribe/fresh; anzu/guard-scribe/wounded; anzu/guard-scribe/primed; anzu/beast-scribe/fresh; anzu/beast-scribe/wounded; anzu/beast-scribe/primed; anzu/guard-beast/fresh; anzu/guard-beast/wounded; anzu/guard-beast/primed; anzu/warden/fresh; anzu/warden/wounded; anzu/warden/primed; anzu/gauntlet/fresh; ugallu+anzu/scribe/fresh; ugallu+anzu/scribe/wounded; ugallu+anzu/scribe/primed; ugallu+anzu/guard-beast/wounded; ugallu+anzu/gauntlet/fresh; girtablilu+anzu/guard-beast/wounded; girtablilu+anzu/warden/wounded; girtablilu+anzu/gauntlet/fresh; ugallu+girtablilu+anzu/scribe/fresh; ugallu+girtablilu+anzu/scribe/wounded; ugallu+girtablilu+anzu/scribe/primed
ok policy-matches-search/Revoke-every-Saw: 10/16 cells match (threshold 75%); cells=anzu/warden/fresh; anzu/warden/wounded; anzu/warden/primed; anzu/gauntlet/fresh; ugallu+anzu/warden/primed; ugallu+anzu/gauntlet/fresh; girtablilu+anzu/warden/wounded; girtablilu+anzu/warden/primed; girtablilu+anzu/gauntlet/fresh; ugallu+girtablilu+anzu/warden/primed
ok rare-action/girtablilu/pincer: 52/321 actions (16.20%; threshold <5%); cells=girtablilu/guard/fresh; girtablilu/guard/wounded; girtablilu/guard/primed; girtablilu/scribe/fresh; girtablilu/scribe/wounded; girtablilu/scribe/primed; girtablilu/beast/fresh; girtablilu/beast/wounded; girtablilu/beast/primed; girtablilu/guard-scribe/fresh; girtablilu/guard-scribe/wounded; girtablilu/guard-scribe/primed; girtablilu/beast-scribe/fresh; girtablilu/beast-scribe/wounded; girtablilu/beast-scribe/primed; girtablilu/guard-beast/fresh; girtablilu/guard-beast/wounded; girtablilu/guard-beast/primed; girtablilu/warden/fresh; girtablilu/warden/wounded; girtablilu/warden/primed; girtablilu/gauntlet/fresh; ugallu+girtablilu/guard/fresh; ugallu+girtablilu/guard/wounded; ugallu+girtablilu/guard/primed; ugallu+girtablilu/scribe/fresh; ugallu+girtablilu/scribe/wounded; ugallu+girtablilu/scribe/primed; ugallu+girtablilu/beast/fresh; ugallu+girtablilu/beast/wounded; ugallu+girtablilu/beast/primed; ugallu+girtablilu/guard-scribe/fresh; ugallu+girtablilu/guard-scribe/wounded; ugallu+girtablilu/guard-scribe/primed; ugallu+girtablilu/beast-scribe/fresh; ugallu+girtablilu/beast-scribe/wounded; ugallu+girtablilu/beast-scribe/primed; ugallu+girtablilu/guard-beast/fresh; ugallu+girtablilu/guard-beast/wounded; ugallu+girtablilu/guard-beast/primed; ugallu+girtablilu/warden/fresh; ugallu+girtablilu/warden/wounded; ugallu+girtablilu/warden/primed; ugallu+girtablilu/gauntlet/fresh; girtablilu+anzu/guard/fresh; girtablilu+anzu/guard/wounded; girtablilu+anzu/guard/primed; girtablilu+anzu/scribe/fresh; girtablilu+anzu/scribe/wounded; girtablilu+anzu/scribe/primed; girtablilu+anzu/beast/fresh; girtablilu+anzu/beast/wounded; girtablilu+anzu/beast/primed; girtablilu+anzu/guard-scribe/fresh; girtablilu+anzu/guard-scribe/wounded; girtablilu+anzu/guard-scribe/primed; girtablilu+anzu/beast-scribe/fresh; girtablilu+anzu/beast-scribe/wounded; girtablilu+anzu/beast-scribe/primed; girtablilu+anzu/guard-beast/fresh; girtablilu+anzu/guard-beast/wounded; girtablilu+anzu/guard-beast/primed; girtablilu+anzu/warden/fresh; girtablilu+anzu/warden/wounded; girtablilu+anzu/warden/primed; girtablilu+anzu/gauntlet/fresh; ugallu+girtablilu+anzu/guard/fresh; ugallu+girtablilu+anzu/guard/wounded; ugallu+girtablilu+anzu/guard/primed; ugallu+girtablilu+anzu/scribe/fresh; ugallu+girtablilu+anzu/scribe/wounded; ugallu+girtablilu+anzu/scribe/primed; ugallu+girtablilu+anzu/beast/fresh; ugallu+girtablilu+anzu/beast/wounded; ugallu+girtablilu+anzu/beast/primed; ugallu+girtablilu+anzu/guard-scribe/fresh; ugallu+girtablilu+anzu/guard-scribe/wounded; ugallu+girtablilu+anzu/guard-scribe/primed; ugallu+girtablilu+anzu/beast-scribe/fresh; ugallu+girtablilu+anzu/beast-scribe/wounded; ugallu+girtablilu+anzu/beast-scribe/primed; ugallu+girtablilu+anzu/guard-beast/fresh; ugallu+girtablilu+anzu/guard-beast/wounded; ugallu+girtablilu+anzu/guard-beast/primed; ugallu+girtablilu+anzu/warden/fresh; ugallu+girtablilu+anzu/warden/wounded; ugallu+girtablilu+anzu/warden/primed; ugallu+girtablilu+anzu/gauntlet/fresh
FLAG rare-action/ugallu/hold-the-threshold: 12/563 actions (2.13%; threshold <5%); cells=ugallu/guard/fresh; ugallu/guard/wounded; ugallu/guard/primed; ugallu/scribe/fresh; ugallu/scribe/wounded; ugallu/scribe/primed; ugallu/beast/fresh; ugallu/beast/wounded; ugallu/beast/primed; ugallu/guard-scribe/fresh; ugallu/guard-scribe/wounded; ugallu/guard-scribe/primed; ugallu/beast-scribe/fresh; ugallu/beast-scribe/wounded; ugallu/beast-scribe/primed; ugallu/guard-beast/fresh; ugallu/guard-beast/wounded; ugallu/guard-beast/primed; ugallu/warden/fresh; ugallu/warden/wounded; ugallu/warden/primed; ugallu/gauntlet/fresh; ugallu+girtablilu/guard/fresh; ugallu+girtablilu/guard/wounded; ugallu+girtablilu/guard/primed; ugallu+girtablilu/scribe/fresh; ugallu+girtablilu/scribe/wounded; ugallu+girtablilu/scribe/primed; ugallu+girtablilu/beast/fresh; ugallu+girtablilu/beast/wounded; ugallu+girtablilu/beast/primed; ugallu+girtablilu/guard-scribe/fresh; ugallu+girtablilu/guard-scribe/wounded; ugallu+girtablilu/guard-scribe/primed; ugallu+girtablilu/beast-scribe/fresh; ugallu+girtablilu/beast-scribe/wounded; ugallu+girtablilu/beast-scribe/primed; ugallu+girtablilu/guard-beast/fresh; ugallu+girtablilu/guard-beast/wounded; ugallu+girtablilu/guard-beast/primed; ugallu+girtablilu/warden/fresh; ugallu+girtablilu/warden/wounded; ugallu+girtablilu/warden/primed; ugallu+girtablilu/gauntlet/fresh; ugallu+anzu/guard/fresh; ugallu+anzu/guard/wounded; ugallu+anzu/guard/primed; ugallu+anzu/scribe/fresh; ugallu+anzu/scribe/wounded; ugallu+anzu/scribe/primed; ugallu+anzu/beast/fresh; ugallu+anzu/beast/wounded; ugallu+anzu/beast/primed; ugallu+anzu/guard-scribe/fresh; ugallu+anzu/guard-scribe/wounded; ugallu+anzu/guard-scribe/primed; ugallu+anzu/beast-scribe/fresh; ugallu+anzu/beast-scribe/wounded; ugallu+anzu/beast-scribe/primed; ugallu+anzu/guard-beast/fresh; ugallu+anzu/guard-beast/wounded; ugallu+anzu/guard-beast/primed; ugallu+anzu/warden/fresh; ugallu+anzu/warden/wounded; ugallu+anzu/warden/primed; ugallu+anzu/gauntlet/fresh; ugallu+girtablilu+anzu/guard/fresh; ugallu+girtablilu+anzu/guard/wounded; ugallu+girtablilu+anzu/guard/primed; ugallu+girtablilu+anzu/scribe/fresh; ugallu+girtablilu+anzu/scribe/wounded; ugallu+girtablilu+anzu/scribe/primed; ugallu+girtablilu+anzu/beast/fresh; ugallu+girtablilu+anzu/beast/wounded; ugallu+girtablilu+anzu/beast/primed; ugallu+girtablilu+anzu/guard-scribe/fresh; ugallu+girtablilu+anzu/guard-scribe/wounded; ugallu+girtablilu+anzu/guard-scribe/primed; ugallu+girtablilu+anzu/beast-scribe/fresh; ugallu+girtablilu+anzu/beast-scribe/wounded; ugallu+girtablilu+anzu/beast-scribe/primed; ugallu+girtablilu+anzu/guard-beast/fresh; ugallu+girtablilu+anzu/guard-beast/wounded; ugallu+girtablilu+anzu/guard-beast/primed; ugallu+girtablilu+anzu/warden/fresh; ugallu+girtablilu+anzu/warden/wounded; ugallu+girtablilu+anzu/warden/primed; ugallu+girtablilu+anzu/gauntlet/fresh
FLAG rare-action/anzu/guard: 6/351 actions (1.71%; threshold <5%); cells=anzu/guard/fresh; anzu/guard/wounded; anzu/guard/primed; anzu/scribe/fresh; anzu/scribe/wounded; anzu/scribe/primed; anzu/beast/fresh; anzu/beast/wounded; anzu/beast/primed; anzu/guard-scribe/fresh; anzu/guard-scribe/wounded; anzu/guard-scribe/primed; anzu/beast-scribe/fresh; anzu/beast-scribe/wounded; anzu/beast-scribe/primed; anzu/guard-beast/fresh; anzu/guard-beast/wounded; anzu/guard-beast/primed; anzu/warden/fresh; anzu/warden/wounded; anzu/warden/primed; anzu/gauntlet/fresh; ugallu+anzu/guard/fresh; ugallu+anzu/guard/wounded; ugallu+anzu/guard/primed; ugallu+anzu/scribe/fresh; ugallu+anzu/scribe/wounded; ugallu+anzu/scribe/primed; ugallu+anzu/beast/fresh; ugallu+anzu/beast/wounded; ugallu+anzu/beast/primed; ugallu+anzu/guard-scribe/fresh; ugallu+anzu/guard-scribe/wounded; ugallu+anzu/guard-scribe/primed; ugallu+anzu/beast-scribe/fresh; ugallu+anzu/beast-scribe/wounded; ugallu+anzu/beast-scribe/primed; ugallu+anzu/guard-beast/fresh; ugallu+anzu/guard-beast/wounded; ugallu+anzu/guard-beast/primed; ugallu+anzu/warden/fresh; ugallu+anzu/warden/wounded; ugallu+anzu/warden/primed; ugallu+anzu/gauntlet/fresh; girtablilu+anzu/guard/fresh; girtablilu+anzu/guard/wounded; girtablilu+anzu/guard/primed; girtablilu+anzu/scribe/fresh; girtablilu+anzu/scribe/wounded; girtablilu+anzu/scribe/primed; girtablilu+anzu/beast/fresh; girtablilu+anzu/beast/wounded; girtablilu+anzu/beast/primed; girtablilu+anzu/guard-scribe/fresh; girtablilu+anzu/guard-scribe/wounded; girtablilu+anzu/guard-scribe/primed; girtablilu+anzu/beast-scribe/fresh; girtablilu+anzu/beast-scribe/wounded; girtablilu+anzu/beast-scribe/primed; girtablilu+anzu/guard-beast/fresh; girtablilu+anzu/guard-beast/wounded; girtablilu+anzu/guard-beast/primed; girtablilu+anzu/warden/fresh; girtablilu+anzu/warden/wounded; girtablilu+anzu/warden/primed; girtablilu+anzu/gauntlet/fresh; ugallu+girtablilu+anzu/guard/fresh; ugallu+girtablilu+anzu/guard/wounded; ugallu+girtablilu+anzu/guard/primed; ugallu+girtablilu+anzu/scribe/fresh; ugallu+girtablilu+anzu/scribe/wounded; ugallu+girtablilu+anzu/scribe/primed; ugallu+girtablilu+anzu/beast/fresh; ugallu+girtablilu+anzu/beast/wounded; ugallu+girtablilu+anzu/beast/primed; ugallu+girtablilu+anzu/guard-scribe/fresh; ugallu+girtablilu+anzu/guard-scribe/wounded; ugallu+girtablilu+anzu/guard-scribe/primed; ugallu+girtablilu+anzu/beast-scribe/fresh; ugallu+girtablilu+anzu/beast-scribe/wounded; ugallu+girtablilu+anzu/beast-scribe/primed; ugallu+girtablilu+anzu/guard-beast/fresh; ugallu+girtablilu+anzu/guard-beast/wounded; ugallu+girtablilu+anzu/guard-beast/primed; ugallu+girtablilu+anzu/warden/fresh; ugallu+girtablilu+anzu/warden/wounded; ugallu+girtablilu+anzu/warden/primed; ugallu+girtablilu+anzu/gauntlet/fresh
FLAG more-than-10-rounds: winning duo/trio fights longer than 10 rounds; cells=ugallu+girtablilu/beast-scribe/wounded; ugallu+girtablilu/warden/wounded; ugallu+anzu/warden/wounded
FLAG cleanup: winning lines with cleanup >2 rounds; cells=ugallu/guard/fresh; ugallu/guard/wounded; ugallu/guard/primed; ugallu/scribe/fresh; ugallu/scribe/wounded; ugallu/scribe/primed; ugallu/beast/fresh; ugallu/beast/wounded; ugallu/beast/primed; ugallu/guard-scribe/fresh; ugallu/guard-scribe/wounded; ugallu/guard-scribe/primed; ugallu/beast-scribe/fresh; ugallu/beast-scribe/primed; ugallu/guard-beast/primed; girtablilu/guard/fresh; girtablilu/guard/primed; ugallu+girtablilu/beast-scribe/wounded; ugallu+girtablilu/gauntlet/fresh; anzu/guard/fresh; anzu/guard/wounded; anzu/guard/primed; anzu/scribe/wounded; anzu/scribe/primed; anzu/beast/fresh; anzu/beast/primed; ugallu+anzu/beast-scribe/fresh; ugallu+anzu/guard-beast/primed
ok trio-gauntlet-loses: ugallu+girtablilu+anzu/gauntlet/fresh=50/86, victory; cells=none
ok duo-gauntlet-margins: ugallu+girtablilu/gauntlet/fresh=3/64, victory; ugallu+anzu/gauntlet/fresh=8/62, no-win-found; girtablilu+anzu/gauntlet/fresh=8/46, no-win-found; cells=none
ok solo-Ugallu-Warden-route: ugallu/warden/fresh=victory; cells=none
ok H4-intent-predictability: human test required; cells=none
ok H6-component-usability: human test required; cells=none
```

</details>

<details>
<summary>Default probe: 14 cells, 9 winning witnesses; 60.674 seconds</summary>

```text
ok dominance: 0 encounter/class groups meet 6-of-7 and 10-HP gap; cells=none
FLAG indifference: 1 cells: every winning opening within 2 HP; cells=girtablilu+anzu/warden/fresh/salves=true
FLAG core-best-without-Salves: 1 multi-Brood cells have a core class tied for best; cells=girtablilu+anzu/warden/fresh/salves=false
ok disabling-first: 0/6 winning Girtablilu lines open with component Pincer; cells=none
ok Revoke-every-Saw: 6/12 declared Saws revoked in winning Anzu lines; cells=none
ok policy-matches-search/always-disable: 5/14 cells match (threshold 75%); cells=ugallu/gauntlet/fresh; girtablilu/warden/fresh; girtablilu/gauntlet/fresh; anzu/warden/fresh; anzu/gauntlet/fresh
ok policy-matches-search/always-core: 5/14 cells match (threshold 75%); cells=ugallu/gauntlet/fresh; girtablilu/warden/fresh; girtablilu/gauntlet/fresh; anzu/warden/fresh; anzu/gauntlet/fresh
ok policy-matches-search/poison-then-Guard: 2/8 cells match (threshold 75%); cells=girtablilu/warden/fresh; girtablilu/gauntlet/fresh
ok policy-matches-search/Rapture-as-soon-as-possible: 6/14 cells match (threshold 75%); cells=ugallu/gauntlet/fresh; girtablilu/warden/fresh; girtablilu/gauntlet/fresh; anzu/warden/fresh; anzu/gauntlet/fresh; ugallu+girtablilu+anzu/warden/fresh
ok policy-matches-search/never-use-Revelation-skills: 5/14 cells match (threshold 75%); cells=ugallu/gauntlet/fresh; girtablilu/warden/fresh; girtablilu/gauntlet/fresh; anzu/warden/fresh; anzu/gauntlet/fresh
ok policy-matches-search/Revoke-every-Saw: 2/8 cells match (threshold 75%); cells=anzu/warden/fresh; anzu/gauntlet/fresh
ok rare-action/girtablilu/pincer: 8/61 actions (13.11%; threshold <5%); cells=girtablilu/warden/fresh; girtablilu/gauntlet/fresh; ugallu+girtablilu/warden/fresh; ugallu+girtablilu/gauntlet/fresh; girtablilu+anzu/warden/fresh; girtablilu+anzu/gauntlet/fresh; ugallu+girtablilu+anzu/warden/fresh; ugallu+girtablilu+anzu/gauntlet/fresh
FLAG rare-action/ugallu/hold-the-threshold: 2/111 actions (1.80%; threshold <5%); cells=ugallu/warden/fresh; ugallu/gauntlet/fresh; ugallu+girtablilu/warden/fresh; ugallu+girtablilu/gauntlet/fresh; ugallu+anzu/warden/fresh; ugallu+anzu/gauntlet/fresh; ugallu+girtablilu+anzu/warden/fresh; ugallu+girtablilu+anzu/gauntlet/fresh
FLAG rare-action/anzu/guard: 0/82 actions (0.00%; threshold <5%); cells=anzu/warden/fresh; anzu/gauntlet/fresh; ugallu+anzu/warden/fresh; ugallu+anzu/gauntlet/fresh; girtablilu+anzu/warden/fresh; girtablilu+anzu/gauntlet/fresh; ugallu+girtablilu+anzu/warden/fresh; ugallu+girtablilu+anzu/gauntlet/fresh
ok more-than-10-rounds: winning duo/trio fights longer than 10 rounds; cells=none
FLAG cleanup: winning lines with cleanup >2 rounds; cells=ugallu+girtablilu/gauntlet/fresh
ok trio-gauntlet-loses: ugallu+girtablilu+anzu/gauntlet/fresh=62/86, victory; cells=none
ok duo-gauntlet-margins: ugallu+girtablilu/gauntlet/fresh=29/64, victory; ugallu+anzu/gauntlet/fresh=20/62, victory; girtablilu+anzu/gauntlet/fresh=4/46, victory; cells=none
ok solo-Ugallu-Warden-route: ugallu/warden/fresh=victory; cells=none
ok H4-intent-predictability: human test required; cells=none
ok H6-component-usability: human test required; cells=none
```

</details>

## Handoff validation

Reused the unchanged copy of `.agents/skills/ruach-handoff` at `/tmp/p2-int-q01-handoff.KC0xMI/ruach-handoff`. Ran `bun install --frozen-lockfile` there: exit 0, checked 6 installs across 7 packages with no changes. From the repository root:

```sh
bun /tmp/p2-int-q01-handoff.KC0xMI/ruach-handoff/scripts/validate.ts docs/mailbox/poc-002-integration/merge-q04.md --repo .
```

Exit 0; `ok: true`, `diagnostics: []`; all six revision fields resolved. Structural validation does not imply independent review or acceptance.
