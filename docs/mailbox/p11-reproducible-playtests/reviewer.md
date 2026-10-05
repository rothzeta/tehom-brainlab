task: P11-review
status: complete
outcome: PASS within the assigned human-evidence boundary; no material findings; independent Reviewer confirms HOLD
candidate_revision: 8decc8c80546f1437fbd6107215fc84b8b2cabb2
tested_revision: f9cb191d701334d3681946603d9891d666c6689d
reviewed_revision: f9cb191d701334d3681946603d9891d666c6689d
preserved_test_baseline: 83153499d4289056f07cf3b0a234b664ad0aac91
artifacts:
  - docs/mailbox/p11-reproducible-playtests/reviewer.md
  - docs/mailbox/p11-reproducible-playtests/assignment-reviewer.md
  - docs/mailbox/p11-reproducible-playtests/implementer.md
  - docs/playtests/2026-10-05-poc-001-p11-automated.md
verification:
  - "Independent Docker checks: 460 unit tests, typecheck, build and four native browser scripts / 3302 assertions passed at f9cb191."
  - "Nine committed UI records replayed successfully; five committed invalid records and eighteen hostile/malformed probes failed with specific reasons."
  - "Seven same-process safety probes found no prototype pollution or payload execution; two additional traces replayed all six abilities."
  - "Temporary changed-defaults copy: 460 unit tests, build and four browser scripts / 3278 assertions passed; an original committed record still replayed identically."
  - "Whitespace, technical-equivalence, protected-document and eighteen preserved BASE test-path checks passed."
review:
  - "PASS: zero blocking findings and zero optional findings."
discoveries:
  - "HOLD confirmed by P11 Reviewer, independent Codex session p11-review-2026-10-05; human attempts and decision explanations remain absent."
blockers: []

# Independent P11 review

Author: **P11 Reviewer, independent Codex session p11-review-2026-10-05**. Executed the unchanged [assignment](assignment-reviewer.md) in `/opt/dev/tehom-brainlab-p11`, branch `p11-reproducible-playtests`. Reviewed technical range **`8315349..8decc8c80546f1437fbd6107215fc84b8b2cabb2`** and evidence successor **`f9cb191d701334d3681946603d9891d666c6689d`**. Independent application verification ran at `f9cb191`; its entire prototype and root justfile are byte-identical to `8decc8c` according to Git. The later report commit records review only.

**Verdict: PASS within the assignment's explicit human-evidence boundary. Blocking findings: 0. Optional findings: 0. No material findings.** This accepts the implemented capture/replay behavior and honest automated evidence; it does not establish a human playtest or authorize P12.

## Acceptance and gate

1. **Criteria 1–3:** the public transitions reproduce captured final state and event order. `run-record.ts:193` replays abilities with the record's stored ability rules, and phase endings with the initial state's stored patrol rules. Per-command revision/event comparisons precede final-state/event-order comparisons. Explicit win/defeat fixtures, all three factory starts and additional traces covering all six abilities passed. The nine committed native exports and independently downloaded browser exports replayed. `patrol-session.ts:60` captures only a successful adapter confirmation; previews, stale inputs, unavailable controls and busy duplicates stay outside the record. Reset creates a new record at `patrol-session.ts:77`. Unit and native browser checks verify these boundaries.
2. **Replay safety:** schema validation uses own-property checks and exact field sets before transitions. The parsed record is data: no evaluation, generated functions, dynamic imports, data-directed filesystem paths or network calls exist in replay or its reducer dependencies. `scripts/replay-run.ts:10` reads the one CLI argument; `scripts/run.sh:59` mounts that input read-only and sets `--network none`. Eighteen hostile/malformed CLI probes failed specifically; seven same-process probes also verified unchanged `Object.prototype`, unchanged global pollution sentinel and absence of the payload's output file. Large/deep inputs were actually exercised; outcomes appear below.
3. **Tuning independence:** exact win/defeat expectations in the new unit tests use explicitly supplied test-owned HP/damage rules. Factory/browser assertions compare against actual transitions, rather than fixed provisional HP, damage or outcomes. The throwaway-copy probe changed HP, wound levels, all attack damage defaults, mitigation, Close threshold and splash radius without editing any tests. The full unit suite passed, and the original committed attack record still produced its original 14 commands / 71 events / victory at round 4 under its stored rules. Changed-defaults browser results are recorded below.
4. **Criteria 4–6, evidence honesty:** the [artifact](../../playtests/2026-10-05-poc-001-p11-automated.md) identifies build `8decc8c`, record/rules versions, exact numerical configuration, all three starts and implementing-agent attribution. All six attempts are explicitly automated. Observations, absent player explanations, defects and interpretation are distinct. There are no invented quotations or enjoyment claims. Its recorded HP, configuration and outcomes match the committed exports; all nine retained export hashes/byte counts match `browser-export-summary.json`. No final attempt is reported as defect-blocked; earlier corrected implementation/driver failures are disclosed. The template is unchanged.
5. **Independent gate decision: HOLD confirmed**, attributed to **P11 Reviewer, independent Codex session p11-review-2026-10-05**. The artifact's explicit HOLD is supported by the absence of any human playtest attempt, actual decision explanation or retry preference. Automated replay success cannot establish purposeful formation choices, useful holds, absence of rote loops/dead turns or human readability. The next bounded evidence step remains one real human attempt for each preset, retaining exports and actual explanations, then independent gate review. No boss work is authorized by this review.
6. **Criterion 7:** the artifact and prototype README explicitly state that no fair Apex/Shadow comparison or production-combat selection has been completed. I independently confirm that limitation.
7. **Scope/preservation:** all eighteen paths under BASE's prototype tests are unchanged, including existing browser scripts and fixtures. The root justfile adds only `poc-001-replay`. No dependencies, lockfile, existing core/content modules, protected documents or template changed on the branch. Source/test mutations for tuning existed exclusively under `/tmp`.

## Commit/path audit

Confirmed with `git show --name-status --format=fuller 8d5c4f1 64ab961 8decc8c f9cb191` (exit 0). Paths below use `poc-001-linked-formation/` unless otherwise stated.

| Commit | Added paths | Modified paths |
| --- | --- | --- |
| `8d5c4f1799ff7ba5d18f786042b3a466afcdb873` | `scripts/replay-run.ts`, `src/core/run-record.ts`, `tests/browser-run-record.mjs`, `tests/run-record.test.ts` | Root `justfile`; prototype `README.md`, `scripts/browser-checks.mjs`, `scripts/run.sh`, `scripts/toolchain.sh`, `src/view/CombatScene.ts`, `src/view/patrol-session.ts` |
| `64ab961016e2b6d27d6b2146355b50a7bb221a40` | None | `README.md`, `tests/browser-run-record.mjs` |
| `8decc8c80546f1437fbd6107215fc84b8b2cabb2` | None | `src/core/run-record.ts`, `tests/run-record.test.ts` |
| `f9cb191d701334d3681946603d9891d666c6689d` | The nineteen evidence paths listed below | `docs/playtests/README.md` only |

`f9cb191` adds `docs/playtests/2026-10-05-poc-001-p11-automated.md` and these eighteen files under `docs/mailbox/p11-reproducible-playtests/`: `assignment-implementer.md`, `browser-export-summary.json`, `browser-healthy-attack.json`, `browser-healthy-forfeit.json`, `browser-rejected-input.json`, `browser-reset-after-rejection.json`, `browser-selection-only.json`, `browser-wounded-girtablilu-attack.json`, `browser-wounded-girtablilu-forfeit.json`, `browser-wounded-ugallu-attack.json`, `browser-wounded-ugallu-forfeit.json`, `divergent-final.json`, `handoff-validation.json`, `implementer.md`, `malformed-command.json`, `unsupported-object-version.json`, `unsupported-record.json`, `unsupported-rules.json`. It adds no technical content. The reviewer assignment was untracked at review start and is committed unchanged with this report.

## Independent verification at f9cb191

Application checks used the pinned Docker image `oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895`. Native Chrome/CDP drivers and handoff tooling used installed `/home/metatron/.bun/bin/bun`. Docker escalation was granted; application verification never switched to host mode. Installation was unnecessary because the frozen-lockfile dependencies were already installed and every wrapper check enforced Bun 1.4.2.

| Exact command | Exit / result |
| --- | --- |
| `just poc-001-test` | 0 after Docker escalation; **12 files / 460 tests**, including **20 P11 tests**. Initial sandbox attempt exited 1 because Docker socket access was unavailable. |
| `just poc-001-typecheck` | 0. |
| `just poc-001-build` | 0; 27 modules; existing large-bundle advisory only. |
| `PATH=/home/metatron/.bun/bin:$PATH just poc-001-test-browser /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p11-review-browser-retry` | 0; **4 scripts / 3302 assertions**: lab 177, preview 24, patrol 2909, records 192. P10: 12 traces / 132 commands, no exceptions or failures. P11: six automated preset/strategy attempts / 56 accepted commands plus native selection, unavailable/busy input and reset checks. All downloads identify `f9cb191`. Lab's two failed requests are deliberate image-fallback checks. |
| `git diff --check 8315349..8decc8c` | 0; no output. |
| `git diff --exit-code 8315349..f9cb191 -- $(git ls-tree -r --name-only 8315349 -- poc-001-linked-formation/tests)` | 0; eighteen BASE test paths preserved. Repeated independently by passing each `ls-tree` path as a separate subprocess argument, also exit 0. |
| `git diff --exit-code 8decc8c..f9cb191 -- justfile poc-001-linked-formation` | 0; identical technical content. |
| `git diff --exit-code 8315349..f9cb191 -- .agents docs/CURRENT.md docs/TASK_LOGS.md docs/adr docs/plans docs/prototypes docs/playtests/TEMPLATE.md` | 0; protected/generated documents and template unchanged. |

All nine committed UI exports were independently invoked as `just poc-001-replay docs/mailbox/p11-reproducible-playtests/<file>` using Docker. Each invocation exited **0**. Exact arguments and results:

| `<file>` | Commands / events | Final revision / round / phase |
| --- | --- | --- |
| `browser-healthy-attack.json` | 14 / 71 | 14 / 4 / victory |
| `browser-healthy-forfeit.json` | 4 / 53 | 4 / 4 / defeat |
| `browser-wounded-ugallu-attack.json` | 14 / 77 | 14 / 5 / defeat |
| `browser-wounded-ugallu-forfeit.json` | 4 / 49 | 4 / 4 / defeat |
| `browser-wounded-girtablilu-attack.json` | 16 / 85 | 16 / 6 / victory |
| `browser-wounded-girtablilu-forfeit.json` | 4 / 49 | 4 / 4 / defeat |
| `browser-selection-only.json` | 0 / 0 | 0 / 1 / player |
| `browser-rejected-input.json` | 1 / 1 | 1 / 1 / player |
| `browser-reset-after-rejection.json` | 0 / 0 | 0 / 1 / player |

Executed the same exact recipe prefix for these committed probes; each invocation exited **1**, as expected:

| `<file>` | Specific error, before just's propagated failure |
| --- | --- |
| `malformed-command.json` | `Run record: malformed acceptedCommands[0].command.expectedRevision` |
| `unsupported-record.json` | `Run record: unsupported record version: 99` |
| `unsupported-rules.json` | `Run record: unsupported rules version: future` |
| `unsupported-object-version.json` | `Run record: unsupported record version: {"toString":"supplied data"}` |
| `divergent-final.json` | `Run record: final state divergence` |

The first browser aggregate used `/tmp/p11-review-browser` and exited 1 during the P10 driver with `ENOSPC`. This was caused by my attempted temporary dependency copy exhausting `/tmp`, after lab/preview passed. I removed only that incomplete copy, used read-only dependency mounts with disposable caches instead, and repeated the entire aggregate successfully as recorded above. This was a review-environment failure, not an application finding.

## Hostile/malformed replay probes

Created each probe under `/tmp/p11-review-probes` from a fresh JSON clone of the committed `browser-reset-after-rejection.json`, except the explicit null/array/invalid-JSON inputs. Ran **`just poc-001-replay /tmp/p11-review-probes/<file>`** for each filename below, independently through the ordinary Docker recipe. All eighteen invocations exited **1** with the indicated reason; the final batch exited **0**. Each completed in 0.61–0.78 seconds in the final batch. The first batch ran all eighteen successfully but failed to save its summary during temporary disk exhaustion; the final batch repeated all eighteen and saved its disposable summary.

| `<file>` / supplied mutation | Specific rejection |
| --- | --- |
| `proto-top.json`: own top-level `__proto__: {polluted: true}` | `malformed record` |
| `proto-nested.json`: own `configuration.abilityRules.__proto__` | `malformed configuration.abilityRules` |
| `constructor-top.json`: own `constructor.prototype.polluted` | `malformed record` |
| `code-field.json`: extra code containing filesystem write and fetch expressions | `malformed record` |
| `command-code.json`: command kind `eval`, expected revision 0 and executable-looking code text | `malformed acceptedCommands[0].command.kind (only player commands supported)` |
| `event-code.json`: final event with own `__proto__`, `type: eval` and code text | `final event order divergence` |
| `version-object.json`: `recordVersion: {toString: "supplied data"}` | `unsupported record version: {"toString":"supplied data"}` |
| `huge-number.json`: record version `10^200` | `unsupported record version: 1e+200` |
| `deep-version.json`: 20,000 nested arrays replacing record version | `unsupported record version: ...`; serialized array data, no stack error; total stderr 40,108 bytes including just's failure line |
| `deep-extra.json`: extra field with 20,000 nested arrays | `malformed record` |
| `million-statuses.json`: one million repeated status strings, 4,003,217-byte JSON | `malformed initialState.brood.statuses` |
| `negative-hp.json`: initial Brood HP -1 | `malformed initialState.entity HP` |
| `proto-id-mismatch.json`: initial/final Ugallu ID `__proto__` with original intention references | `malformed initialState.declaredIntention target/kind` |
| `revision-type.json`: accepted end-phase command with string expected revision `"0"` | `malformed acceptedCommands[0].command.expectedRevision` |
| `wrong-commands.json`: object instead of accepted-command array | `malformed acceptedCommands` |
| `null.json`: JSON null | `malformed record` |
| `wrong-array.json`: JSON array | `malformed record` |
| `invalid-json.json`: `{` | `invalid JSON` |

Additional executed safety/ability commands (both exit **0**):

```sh
docker run --rm --init --user "$(id -u):$(id -g)" --network none --volume /opt/dev/tehom-brainlab-p11/poc-001-linked-formation:/app:ro --volume /tmp/p11-review-probes:/probes:ro --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 bun /probes/check-safety.ts
docker run --rm --init --user "$(id -u):$(id -g)" --network none --volume /opt/dev/tehom-brainlab-p11/poc-001-linked-formation:/app:ro --volume /tmp/p11-review-probes:/probes:ro --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 bun /probes/check-abilities.ts
```

The safety script statically imports `replayRun`, reads the seven named prototype/constructor/code/version-object probes and requires a `Run record:` failure for each. After each replay it checks absence of `Object.prototype.polluted`, `({}).polluted` and `globalThis.polluted`; it also checks that `/tmp/p11-executed`, named in the malicious text, does not exist. Result: `{"ok":true,"probes":7,"prototypePolluted":false,"codeExecuted":false}`. Static source inspection establishes the absence of data-directed IO; no syscall tracer was run. These finite probes establish their actual outcomes, not a universal memory/CPU limit for arbitrary input sizes.

The ability script uses two actual public-reducer traces: (1) expand, Impale on Warder, anticlockwise Crosswind on Warder, Claw on Harrier, end phase; (2) Shelter on Girtablilu, Sting on Warder, Gale on Harrier, end phase. It records each accepted result and compares replayed state/events with the captured state/events. Result: `{"ok":true,"traces":2,"accepted":9,"abilities":6}`.

## Changed-defaults probe

Used `git archive f9cb191` extracted by Python's tarfile reader to **`/tmp/p11-review-tuning`**. No branch source or test was edited. Compared every archived tracked path against `git show f9cb191:<path>` afterward: only the following five source files differed, with tests unchanged:

| Temporary file | Changed defaults |
| --- | --- |
| `src/content/patrol.ts` | Brood HP 18/14/14 → 21/17/16; enemy HP 12/10/13 → 15/12/16; wound HP 7/5 → 8/6; Warder/Censer/Harrier/isolated damage 3/3/4/7 → 2/2/3/5 |
| `src/content/brood.ts` | Claw/Sting/Impale/Gale damage 4/4/6/3 → 5/5/7/4 |
| `src/core/damage.ts` | Directional/Shelter reduction 2/2 → 1/3 |
| `src/core/formation.ts` | Close threshold 2 → 1 |
| `src/core/intents.ts` | Splash radius 2 → 1 |

Exact Docker command used for the temporary unit suite:

```sh
docker run --rm --init --user "$(id -u):$(id -g)" --network none --env HOME=/tmp --env BUN_INSTALL_CACHE_DIR=/tmp/bun-cache --volume /tmp/p11-review-tuning/poc-001-linked-formation:/app --volume /opt/dev/tehom-brainlab-p11/poc-001-linked-formation/node_modules:/app/node_modules:ro --tmpfs /app/node_modules/.vite-temp:mode=1777 --tmpfs /app/node_modules/.vite:mode=1777 --volume /tmp/p11-review-tuning/assets:/assets:ro --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 sh ./scripts/toolchain.sh test
```

Exit **0**, **12 files / 460 tests**. Ran the same exact Docker command with final argument `build`: exit **0**, 27 modules. The initial attempt without the two temporary Vite cache mounts exited 1 with `EROFS` while writing its bundled config; adding disposable caches resolved the harness setup.

Original committed-record replay under changed defaults:

```sh
docker run --rm --init --user "$(id -u):$(id -g)" --network none --env HOME=/tmp --volume /tmp/p11-review-tuning/poc-001-linked-formation:/app:ro --volume /opt/dev/tehom-brainlab-p11/docs/mailbox/p11-reproducible-playtests/browser-healthy-attack.json:/run-record.json:ro --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 sh ./scripts/toolchain.sh replay /run-record.json
```

Exit **0**: `{"ok":true,"commands":14,"events":71,"revision":14,"round":4,"phase":"victory"}`. The record's HP/configuration, rather than new defaults, controlled replay.

Started the temporary Docker preview using this exact command:

```sh
docker run --rm --init --user "$(id -u):$(id -g)" --env HOME=/tmp --env POC001_PORT=4175 --volume /tmp/p11-review-tuning/poc-001-linked-formation:/app --volume /opt/dev/tehom-brainlab-p11/poc-001-linked-formation/node_modules:/app/node_modules:ro --tmpfs /app/node_modules/.vite-temp:mode=1777 --tmpfs /app/node_modules/.vite:mode=1777 --volume /tmp/p11-review-tuning/assets:/assets:ro --publish 127.0.0.1:4175:4175 --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 sh ./scripts/toolchain.sh preview
```

From `/tmp/p11-review-tuning/poc-001-linked-formation`, executed:

```sh
/home/metatron/.bun/bin/bun scripts/browser-checks.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p11-review-tuning-browser-retry http://localhost:4175/
```

Changed-defaults browser result: exit **0**, **4 scripts / 3278 assertions**: lab 177, preview 24, patrol 2885, records 192. P10: 12 traces / 132 commands, zero exceptions/failures. P11: the same 56 accepted inputs across six runs, all replaying actual changed-rule outcomes. Healthy attack and wounded-Girtablilu attack remained victories; wounded-Ugallu attack now ended in player phase at round 6, and all three forfeit traces ended in player phase at round 5. These outcome changes passed the unedited assertions, demonstrating that those assertions do not freeze the earlier victory/defeat defaults. The temporary archive has no Git checkout, so exports correctly use build `unknown`. The initial aggregate with output `/tmp/p11-review-tuning-browser` passed lab/preview but exited 1 because the host P10 fixture loader could not resolve Phaser in the temporary copy. Linked only the already installed Phaser package into that copy for the CDP driver, kept Docker dependency mounts read-only and reran all four scripts. No test was edited.

## Boundaries and handoff validation

Only this report was authored in the repository; the unchanged assignment is included in its commit. No source, tests, playtest artifact, template, protected/generated documents or other worker reports were edited. No merge, push, rebase, branch deletion or worktree deletion occurred. Disposable probes/builds/browser output stay under `/tmp`. Human testing, design explanations, enjoyment, preference and comparative combat selection remain unverified; they are the reason for HOLD, not implementation defects within this assignment.

Assignment SHA-256 before and after review: `a15cca77b63b3a5e678d3cd36c7d2d6ef435f08095379093a80eff281a80b2be`.

Used the already bootstrapped disposable `/tmp/p11-handoff-validator` after independently checking that its `SKILL.md`, schema, validator, package manifest and lockfile match the pinned skill. Validation command:

```sh
/home/metatron/.bun/bin/bun /tmp/p11-handoff-validator/scripts/validate.ts docs/mailbox/p11-reproducible-playtests/reviewer.md --repo /opt/dev/tehom-brainlab-p11
```

Validation: **exit 0, `ok: true`, zero diagnostics**; all four revision fields resolve. Repeated after final report edits before committing. The temporary Docker preview was stopped after checking its source mount and port; Docker stop exited 0. Scratch files remain disposable and are not handoff artifacts.
