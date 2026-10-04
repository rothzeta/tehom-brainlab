task: P04-review
status: complete
outcome: Pass with one optional test-maintenance finding; no blocking correctness findings.
role: reviewer
source_baseline: 0d6f23368f3cf21d1d14bc9bf0e8be34c0daff12
candidate_revision: 32f07c0063bc2162965ad5d21fc26fc160fa799b
reviewed_revision: b5e7c54ebd361fd926f197d014f01f3e8e89581d
tested_revision: ed40685edf6017b24b621098cce04e1b096525cf
artifacts:
  - docs/mailbox/p04-formation-lab/assignment-reviewer.md
  - docs/mailbox/p04-formation-lab/reviewer.md
verification:
  - "just poc-001-test: exit 0; 6 files, 226 passing tests in Docker."
  - "just poc-001-typecheck: exit 0 in Docker."
  - "just poc-001-build: exit 0 in Docker; 9 prepared assets, 14 modules."
  - "Headless Chrome browser-lab.mjs: exit 0; 136 assertions, 12 fixtures, 3 modes, 18 captures, zero uncaught exceptions."
  - "git diff --check 0d6f233..b5e7c54: exit 0."
  - "Technical/scope comparisons and README composition check: exit 0; P05 preserved, P04 candidate preserved, root assets and P01–P03 unchanged."
  - "Built asset audit: exit 0; 7 SVG hashes match manifest, both attribution files match source bytes."
  - "Handoff validator with --repo: exit 0; ok true, four revisions resolved, no diagnostics."
review:
  - "Independent P04 review and P05 integration review complete: 0 blocking, 1 optional finding."
discoveries: []
blockers: []

P04 Reviewer, 2026-10-04 UTC. Authority: [assignment](assignment-reviewer.md), [P04 plan](../../plans/2026-10-02-9d81c6df-poc-001-formation-lab.md), and [ADR-0006](../../adr/0006-contract-invariants-and-black-box-testing.md). Worktree `/opt/dev/tehom-brainlab-p04`, branch `p04-formation-lab`.

## Verdict and scope

**Pass with one optional finding. No material correctness findings or blocking regressions.** The seven numbered P04 criteria and required interaction/asset contracts are supported by code inspection and independently executed checks. The optional finding concerns incidental presentation constraints in the browser assertions, rather than a failing interaction or missing behavioral coverage. Coordinator acceptance and delivery remain separate decisions.

Reviewed combined revision `b5e7c54`; executed verification at existing HEAD `ed40685`. `git diff --stat b5e7c54 HEAD` and `git diff --exit-code b5e7c54..ed40685 -- poc-001-linked-formation assets` confirm the successor adds only five integration evidence/report paths and has identical technical content. The combined revision has parents `3cfc5c2` and delivered master `04bd6a2`, in that order.

Inspected all thirteen assigned technical paths, the P04 plan, Implementer/integration reports, relevant P02/P03 exports and tests, asset manifest/credits, and P05 integration differences. P05 semantics were reviewed only for preservation and integration, as assigned. No source or tests were edited.

## Findings, ordered by severity

**Blocking: none.**

**Optional O1 — browser assertions constrain unspecified presentation details.** Location: `poc-001-linked-formation/tests/browser-lab.mjs:91` and `:93`.

The link assertion requires the exact string `${from} ↔ ${to}: ${state} (${distance})`; the availability assertion compares DOM button order with a hardcoded clockwise/anticlockwise/expand/contract array. A layout change that reorders these four labelled buttons, or a readable link readout using “distance 1” instead of “(1)”, would fail even if every required pair, state, distance and command outcome remained correct. P04 requires identifiable labels and core-equivalent link/availability information; it does not prescribe this punctuation or maneuver-control order. These extra constraints conflict with ADR-0006's intent to permit valid presentation changes and can create false regressions.

Evidence is the exact comparisons at those lines, inspected alongside the plan's required contracts and criterion 1; the current implementation passes them. Suggested direction: compare availability by maneuver identity, independently of DOM order, and verify the readout's pair/state/distance content without requiring the current sentence punctuation. Retain checks for missing/duplicate controls, labels, links and incorrect core outcomes. No production redesign is requested.

## Acceptance evidence

| P04 criterion | Independent evidence and assessment |
| --- | --- |
| 1 — twelve fixtures, 37 cells, three labelled Brood and links | Pass. `drawBoard()` iterates public `boardCells()`; live anchors and links derive from core selectors. Browser checks all twelve setups against core, with three labelled tokens and three links. Screenshots show the complete neutral board. View suite covers all twelve fresh setups and all four commands' outcomes. |
| 2 — exact preview destinations, unchanged live state | Pass. `LabSession.outcome()` calls public `applyCommand()` with live revision. Preview stores the returned snapshot separately; commit calls the transition again. Deeply frozen live-state tests cover all four maneuvers. Browser expansion ghosts `(3,0)`, `(-3,3)`, `(0,-3)` equal later committed anchors while live shape/revision/allowance remain unchanged before commit. |
| 3 — one maneuver, explanation, complete reset | Pass. Successful commit spends P03 allowance and increments revision once. All four buttons disable with a visible used-maneuver explanation. Actual second pointer attempts change nothing. Reset returns `createInitialState()` and clears selection/preview; tests and browser also reset a pending preview. Fresh setup selection is explicitly labelled **Test setup — fresh lab fixture**. |
| 4 — rotation changes anchors, upright readable art | Pass. Browser focus/Enter rotation matches core destinations, and all twelve layouts have on-screen token bounds and upright images. Personally inspected fresh normal, expansion-preview, placeholder, failed-image and Compact orientations 2, 4 and 5 screenshots at 1280×800. Labels/readouts remain readable. |
| 5 — placeholder and failed runtime request | Pass. Placeholder run makes no token-image requests; labelled geometry remains selectable and maneuvers work. CDP blocks Ugallu SVG requests; live token and gallery produce two intentional failures, with fallback geometry and selectable identity retained. Failure explanation is supplied by the frame tooltip; placeholder mode has a visible label. The complete cancel/rotate/second-attempt/reset/expand sequence passes in all three modes. |
| 6 — bounded preparation, hashes, attribution, untouched masters | Pass. Preparation validates seven allowlisted source SVGs against manifest before replacing generated output, copies those plus two attribution files, and has precise missing/corrupt failures. Asset tests verify resulting membership, hashes, source-byte preservation and prior-output preservation on failure. Independently checked all seven built SVG hashes and both attribution copies. Browser fetches bundled credits/license with HTTP 200. Root `assets/` is unchanged. |
| 7 — drag and empty-cell clicks cannot move units | Pass. Actual CDP drag and empty-centre-cell click preserve anchors, live formation/revision and allowance. View exposes inspection and formation maneuvers only; no individual/translation/combat command is wired. |

P02/P03 are consumed through public exports without semantic changes. Selection and artwork do not enter legality. Cancel, successful/failed commits, reset and fixture selection clear previews. No shared engine, cross-prototype dependency, general asset pipeline or combat preview was added. Toolchain changes are bounded: local generated-output ignore, preparation before dev/build, and a read-only root-assets Docker mount. No dependency or lockfile changes.

## Executed verification

Commands ran from the assigned worktree at `ed40685`, with existing installed dependencies. `just poc-001-install` was **not needed or run**. Application checks used Docker, Bun 1.4.2 and Vitest 5.0.3; no application host-mode fallback. Docker and browser execution received sandbox escalation. The browser driver uses host Bun as documented while the application is served by Docker.

| Exact command | Exit and result |
| --- | --- |
| `just poc-001-test` | Initial sandbox attempt: 1, Docker daemon inaccessible. Escalated run: **0; 6 files, 226 tests** (smoke 2, formation 90, commands 37, view 19, assets 3, intents 75). Existing suites report P02 3,349, P03 253 and P05 803 matcher assertions. |
| `just poc-001-typecheck` | **0**; strict TypeScript check. |
| `just poc-001-build` | **0**; nine prepared assets, 14 transformed modules; CSS 3.21 kB, JS 1,388.08 kB. Existing large Phaser chunk warning. |
| `just poc-001-preview` | Docker server ready on localhost:4173; stopped after checks with Ctrl-C, **130**. |
| `/home/metatron/.bun/bin/bun poc-001-linked-formation/tests/browser-lab.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p04-review-browser` | Escalated run: **0; 136 assertions, twelve fixtures, three modes, 18 PNG captures, zero uncaught exceptions**; 45 requests, two intentional image failures. HeadlessChrome 148.0.7778.96, viewport 1280×800, scale 1. Initial restricted-sandbox run produced no captures/result and was interrupted with Ctrl-C (130); no success is claimed for it. Chrome's own sandbox remained enabled. |
| `git diff --check 0d6f233..b5e7c54` | **0**. |
| `git diff --stat` | **0**; no tracked modifications before report creation. |
| `docker ps --filter publish=4173 --format '{{.ID}} {{.Ports}}'` | **0**, empty; task-owned preview stopped. |
| `/home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p04-formation-lab/reviewer.md --repo /opt/dev/tehom-brainlab-p04` | **0; `ok: true`**, four revisions resolve, diagnostics empty. Bun is not on this shell's PATH, so its existing absolute executable is used. |

Scope comparisons below each exited **0**:

```sh
git diff --exit-code b5e7c54..ed40685 -- poc-001-linked-formation assets
git diff --exit-code 0d6f233..32f07c0 -- assets poc-001-linked-formation/src/core
git diff --exit-code 04bd6a2 ed40685 -- poc-001-linked-formation/src/core poc-001-linked-formation/tests/intents.test.ts docs/mailbox/p05-intent-semantics docs/plans docs/CURRENT.md docs/TASK_LOGS.md
git diff --exit-code 32f07c0 ed40685 -- poc-001-linked-formation/.gitignore poc-001-linked-formation/package.json poc-001-linked-formation/bun.lock poc-001-linked-formation/scripts poc-001-linked-formation/src/main.ts poc-001-linked-formation/src/view poc-001-linked-formation/tests/view.test.ts poc-001-linked-formation/tests/asset-copy.test.ts poc-001-linked-formation/tests/browser-lab.mjs
git diff --exit-code 0d6f233 ed40685 -- assets poc-001-linked-formation/src/core/hex.ts poc-001-linked-formation/src/core/formation.ts poc-001-linked-formation/src/core/commands.ts poc-001-linked-formation/src/core/transition.ts poc-001-linked-formation/src/core/state.ts poc-001-linked-formation/tests/smoke.test.ts poc-001-linked-formation/tests/formation.test.ts poc-001-linked-formation/tests/commands.test.ts
```

An independently executed `python3 - <<'PY'` comparison read the three READMEs using `git show`, extracted master's `## Intent semantics (P05)` section up to `## Evidence and limitations`, and asserted that removing that unchanged section once from `ed40685` yields exactly `32f07c0`'s README. Exit **0**, output `README: exact P04 text plus unchanged P05 section`. Another Python audit used `hashlib.sha256` on `dist/tehom/tokens/<id>.svg` against the seven manifest entries and compared credits/license bytes with root sources; exit **0**, all nine copies match.

Fresh captures and raw browser JSON/logs remain disposable under `/tmp/p04-review-browser`. Five primary captures were independently hash-compared and are byte-identical to retained [normal](normal.png), [expansion preview](expand-preview.png), [spread](spread.png), [placeholder](placeholder.png) and [credits](credits.png) evidence. Fresh failed-image capture differs from retained captures but was personally inspected: failed Ugallu remains labelled and selectable, with the full sequence passing. The durable reports [implementer.md](implementer.md) and [integration.md](integration.md) retain original revision-specific evidence; none was replaced.

## Limits and hand-back

No human playtest, mobile layout, browser matrix, mutation-testing run, combat interaction or P05 browser consumer was verified. Browser commits clockwise and expansion; contraction and anticlockwise are verified at the public session boundary and browser availability is checked for all four across every fixture. The board-count assertion observes a count attribute; source inspection and actual screenshots additionally establish the rendered board. Browser exceptions were checked, not a complete console-message audit. These limits do not leave required P04 checks outstanding.

Assignment SHA-256 before and after review: `1bcdfc12b90489664c64f4e64a7ccf786e97283e608e69ed5dcb6944df850e52`. Commit the unchanged assignment with this report only. No merge, push, rebase, branch/worktree deletion or protected-document edit was performed.
