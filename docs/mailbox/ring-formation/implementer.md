task: RF-impl
role: implementer
status: blocked
outcome: "RF technical candidate committed; final bare browser verification fails an unchanged reset-preview assertion, invoking the assignment stop condition. Not ready for acceptance."
baseline: ef0e3b41ac7917fd4976594fdd79bcd206cb7dde
starting_revision: 05bc25c56e6540d54515be57db514f4937cec04e
bug_checkpoint_revision: 4137db12d91a5b8dda98859767d712899a585eb8
candidate_revision: e18cd0984d6f976c30c436446c46cc12319c76b0
tested_revision: e18cd0984d6f976c30c436446c46cc12319c76b0
artifacts:
  - docs/mailbox/ring-formation/implementer.md
  - docs/mailbox/ring-formation/assignment-implementer.md
  - docs/mailbox/ring-formation/screenshots/healthy-compact.png
  - docs/mailbox/ring-formation/screenshots/healthy-spread.png
  - docs/mailbox/ring-formation/screenshots/wounded-ugallu-compact.png
  - docs/mailbox/ring-formation/screenshots/wounded-girtablilu-compact.png
  - docs/mailbox/ring-formation/screenshots/lab-expand-preview.png
verification:
  - "Candidate unit suite: exit 0, 14 files, 477 tests; auxiliary matcher instrumentation counted 17960 assertions."
  - "Candidate typecheck: exit 0."
  - "Candidate bare browser command: exit 1; fresh Docker build and lab/preview probes pass, patrol reset-preview assertion fails, record probe not reached."
  - "Earlier C4 browser run: exit 0, 4963 assertions across four probes; no application exceptions. This does not replace final candidate verification."
  - "Required protected paths and unedited suites versus plan BASE: exit 0; all ownership restrictions versus assigned starting HEAD: exit 0; git diff --check: exit 0."
review: not-run
discoveries:
  - "B1, B2 and B3 causes confirmed with failing pre-fix regressions; fixes and targeted regressions pass."
  - "The final reset-preview failure did not occur in the preceding full C4 run; its cause is unconfirmed and the existing assertion was preserved."
  - "Initial Compact and Spread layouts fit 1280x800; selected controls and multiline preview can require vertical scrolling."
  - "The unchanged formation lab Expand ghost has a partially obscured Girtablilu destination label."
blockers:
  - "Final browser-patrol.mjs fails: reset removes old hover/focus preview before another pointer input. Assignment requires stopping on an existing assertion outside the enumerated updates; Coordinator disposition is required before further implementation."

# RF Implementer handoff

Author: ring-formation Implementer, 2026-10-05. Assignment: [assignment-implementer.md](assignment-implementer.md). Worktree `/opt/dev/tehom-brainlab-ring`, branch `ring-formation`. No merge, push, rebase, branch deletion or protected-document edit performed. No human playtest claimed.

## Result and stopping condition

Geometry, tile selectors, patrol content, records, renderer, public README contracts and B1–B3 changes are committed. RF.C1–C5 have implemented behavior and supporting checks. RF.C6 is **incomplete** because final browser verification fails. Do not accept this candidate as fully verified.

At candidate `e18cd098`, bare `just poc-001-test-browser` failed the existing assertion in `tests/browser-patrol.mjs:361`:

> reset removes old hover/focus preview before another pointer input

Expected ghosts `[]`; received:

```json
[{"brood":"ugallu","cell":{"q":0,"r":1}},{"brood":"girtablilu","cell":{"q":-1,"r":0}},{"brood":"pazuzu","cell":{"q":1,"r":-1}}]
```

The assertion follows selecting Claw/Warder, pressing the pointer on Confirm, focusing Restart, and activating Restart with Enter, before releasing the old pointer. The ghosts are the fresh Compact clockwise destinations. The preceding full C4 run passed this exact assertion. No cause has been confirmed: pointer re-entry after controls/layout change is a hypothesis, not a finding. I preserved the assertion and stopped implementation under the plan's stop condition, rather than editing an expectation outside BP1–BP4. Final record-browser verification was not reached. The original B1 actor-label checks had already passed in this final run.

Coordinator follow-up: authorize investigation/fix of this unchanged reset-preview failure within `CombatScene`, preserving the assertion. Also decide whether the no-scroll criterion includes selected-ability/expanded-preview states, and authorize a bounded P04 presentation fix if the ghost-label overlap must be corrected. No additional worker was launched.

## Changes

All paths below are relative to `poc-001-linked-formation/`:

- `src/core/formation.ts`, `hex.ts`: Compact `S[o],S[o+2],S[o+4]`, radial shape change, frozen seven-cell `ENEMY_CELLS` partition; Spread and tuning unchanged.
- `src/core/sectors.ts`, `intents.ts`: required enemy `cell`, translated/clipped `frontCells`, protection from the source tile, source-pivoted area turns without clipping; centre selectors retained.
- `src/content/patrol.ts`: `patrol-v2`, frozen inspectable `PATROL_LAYOUT`, fresh enemy cells/facings for all presets; HP, rules, protection relation and targeting unchanged.
- `src/core/run-record.ts`: rules v2, strict required enemy cells, safe integer/membership checks and coordinate-based uniqueness; explicit old-version rejection; record envelope stays version 1.
- `src/core/preview.ts`: End phase has `forecast.kind:'not-applicable'` and no further transition. Other forecasts unchanged.
- `src/view/CombatScene.ts`: enemies projected on core cells, facing arrows, rule-source front tint, off-board area drawing omitted; reset invalidates actor-controls cache; End-phase further forecast line omitted. Link/Shelter facts and the resolution log are grouped in the controls column to fit fresh states without changing protected CSS.
- `src/view/patrol-session.ts`: forfeiture feedback counts unused living actions in the pre-command state and appears only when positive.
- `README.md`: P02/P05/P08/P09/P10/P11 public RF contracts, layout, deferred ability-specific reach, record version and preview semantics.
- Existing tests changed only as itemized below. New `tests/rf-contracts.test.ts`, `tests/rf-bugs.test.ts`, `tests/browser/rf-fixture.ts` add contract coverage and controlled native bug reproductions. The browser-only fixture is compiled in memory and has no production route.

Report, unchanged assignment and five inspected screenshots form the subsequent evidence-only commit. The terminal handoff supplies its creating SHA. There is no delivered/merged revision.

## Every pre-existing test change and authority

| File | Exception | Reason and coverage retained |
| --- | --- | --- |
| `tests/formation.test.ts` | F1–F5 | Independently transcribed six RF Compact rows; all pairs distance 2; Compact radii `[1,1,1]`; links `[2,2,2]`; explicit inclusive threshold 2/1 boundary. Existing inverse/label/wrap/immutability and Spread coverage retained. |
| `tests/intents.test.ts` | I1–I7 | Centre `cell` on every enemy fixture, RF Compact and centre-recipient tables, Ugallu singleton ring-1 area/protection witness, radius-1 splash singleton, threshold-1 Close false, fallen-mark and renamed-ID area recipients updated. Other expectations unchanged. |
| `tests/damage.test.ts` | D1 | Required centre cell added to four enemy fixture declarations; no assertion changed. |
| `tests/abilities.test.ts` | A1–A2 | Required centre cells; only protected Sting/Censer AC1 row moves to Compact orientation 4, retaining damage 2 and every accounting/atomicity assertion. |
| `tests/patrol.test.ts` | P2 | View-anchor/no-cell assertions replaced with hand-written tile/facing content expectations, dynamic documented-content comparison, allowed-cell membership and distinct placement. AC7 traces and all other expectations untouched. |
| `tests/preview.test.ts` | V2–V3 | Explicit test-owned Warder cell `(1,-2)`/facing 0 prevents freezing production placement; kill loses Ugallu protection only; Crosswind loses none, gains Pazuzu; independently written pivoted area and RF mark anchors/recipients. No unrelated expectations changed. B2 lives in the new regression file (V4 authority). |
| `tests/browser-patrol.mjs` | BP1–BP4 | Forfeiture presence/count conditional on actual unused living actions; hit-test label renamed while assertion retained; Brood snapshot restricted to Brood with separate enemy identity/cell/facing/pixel checks; B1/B2 additions, Spread captures and hit-tests, fresh-layout fit checks and native B2/B3 reproduction. Existing reset-preview assertion preserved despite final failure. |

No trace source changed. No expected-unedited test file changed, including `run-record.test.ts`, `browser/fixtures.ts`, `browser-run-record.mjs`, `commands.test.ts`, `view.test.ts`, `smoke.test.ts`, `asset-copy.test.ts`, `patrol-session.test.ts`, `browser-lab.mjs`, `browser-preview.mjs`, `browser/patrol-fixture.ts` and `browser/outcome-fixture.ts`.

## Bug causes, failing regressions and reproductions

**B1:** actor controls were cached by `[revision,locked,actor,ability]`; changing preset at revision zero and restarting could reuse that key. Reset now clears `controlsKey` before the fresh render. Before the fix, native Healthy → Wounded Ugallu → Restart failed with actor `Ugallu 18/18`, expected fresh `Ugallu 7/18`, while the board had the fresh HP. After the fix, native sequences for both wounded presets pass before actor selection, including in final verification. These comparisons read current factory HP rather than pinning default numbers. The broader reset-preview failure above remains unresolved.

**B2:** `previewCommand` applied the requested End phase correctly, then built its forecast by applying End phase again to the resulting next-round state. The failing regression transcribes scout-1 attempt-2 commands 1–3 (Claw, Sting, Gale on Warder), with explicitly owned historical HP and rules. Immediate HP `[8,11,11]` and events matched commitment; the extra forecast resolved round 2 and produced `[0,8,8]`. Thus the cause is forecasting, not P08 settlement. Fix: End-phase preview carries `not-applicable`/empty forecast events; renderer omits the conditional line. The regression passes and live state remains unchanged. The completed C4 browser run repeated those native inputs in the explicit 100-HP test-owned encounter, hovered End phase, checked exactly one Immediate line and no further-phase line, then committed and compared state/events. This preserves historical command input without freezing today's production defaults. Exact historical arithmetic is established by the unit fixture; the UI fixture intentionally uses different HP.

**B3:** `PatrolSession.confirm` unconditionally emitted forfeiture text. Fix: count pre-command living, unacted Brood, include `Unused actions forfeited: N.` only if N > 0. Pre-fix regressions failed for unused counts 0, 1 and 3. After-fix regressions pass those cases and exclude a fallen Brood from the count. C4 also reran scout-3's Expand, Claw/Impale/Gale on Harrier, End phase sequence through native controls in the explicit encounter; all three living actors acted, so feedback contained no forfeiture claim.

## Verification ledger

All application checks used Docker; host Bun only ran CDP drivers and handoff validation. Bash PATH was extended with the already installed `/home/metatron/.bun/bin` for browser/validator commands, without changing application mode or browser selection.

| Exact command | Revision/condition | Exit and evidence |
| --- | --- | --- |
| `just poc-001-test` | Initial assigned HEAD, dependencies absent | 127, Vitest missing; no baseline result claimed. |
| `just poc-001-install` | Initial assigned HEAD | 0, frozen committed lockfile, 43 packages installed with Bun 1.4.2. |
| `just poc-001-test` | Initial assigned HEAD, installed | 0, 12 files / 460 tests. |
| `just poc-001-test tests/rf-bugs.test.ts` | Pre-fix source at initial HEAD plus new tests | 1, four tests failed: B2 plus B3 unused 0/1/3. Scratch log `/tmp/rf-bugs-before.log`. |
| `just poc-001-test-browser` | First pre-fix attempt, installed Bun absent from PATH | 1, toolchain rejected missing host Bun before application checks. |
| `just poc-001-test-browser` | Pre-fix source, installed Bun on PATH | 1, B1 native actor-label failure; lab 177 / preview 24 assertions passed. Scratch `/tmp/rf-b1-before.log`, browser `/tmp/p10-browser-cQutiJ`. |
| `just poc-001-test tests/rf-bugs.test.ts tests/preview.test.ts tests/patrol-session.test.ts` | Bug fixes, before RF geometry | 0, 3 files / 31 tests. |
| `just poc-001-test-browser` | Bug fixes, before RF geometry | 0, lab 177 / preview 24 / patrol 2929 / records 192 assertions; all four probes, no application exceptions. `/tmp/p10-browser-1T9yBN`. |
| `just poc-001-test tests/formation.test.ts` | RF.C1 working tree | 0, 92 tests / 1361 assertions. |
| `just poc-001-test tests/intents.test.ts tests/formation.test.ts tests/damage.test.ts tests/abilities.test.ts` | RF.C2 | First exit 1, six AC4 fixtures lacked the permitted required cell addition; completed I1, reran exit 0, 304 tests. Counts: P02 1361, P05 810, P06 305, P07 1072. No assertion weakened. |
| `just poc-001-test` | RF.C3 working tree | 0, 13 files / 464 tests, including unchanged P08 AC7 traces. |
| `just poc-001-typecheck` | RF.C3 first pass | 1, unknown cell narrowing and regression-state extension typing; corrected within owned files. |
| `just poc-001-test tests/rf-contracts.test.ts tests/rf-bugs.test.ts && just poc-001-typecheck` | RF working tree | Initial typecheck found test-only union narrowing; corrected; final exit 0, 17 tests, RF contract suite 583 assertions; typecheck 0. |
| `just poc-001-typecheck && just poc-001-build` | RF.C4 working tree | 0; Docker build transformed 27 modules; expected large Phaser chunk warning. |
| `just poc-001-test-browser` | RF.C4 iterative rendering verification | Initial exit 1 on the new exact pixel check (CSS subpixel serialization); corrected the new assertion to <0.01 px. Subsequent new fit checks exposed legend/readout overflow; scoped markup fixes, no protected CSS changes. Final exit 0: 177 + 24 + 4570 + 192 = 4963 assertions, 12 patrol traces / 132 commands, 31 screenshots, zero uncaught application exceptions. `/tmp/p10-browser-rMselR`. |
| `just poc-001-test` | **Candidate e18cd098** | **0, 14 files / 477 tests.** `/tmp/rf-final-unit.log`. |
| `just poc-001-typecheck` | **Candidate e18cd098** | **0.** |
| `just poc-001-test-browser` | **Candidate e18cd098; bare, no manual preceding build** | **1**, unchanged reset-preview assertion above. `/tmp/rf-final-browser.log`; lab 177 / preview 24 passed; patrol's final assertion/exception totals unavailable; record probe not reached. Fresh automatic Docker production build succeeded (27 modules). |
| `just poc-001-build` | Candidate final verification | **Not run separately after stop.** Earlier standalone RF.C4 build and final runner's automatic production build succeeded; neither is claimed as this missing command. |
| `git diff --check ef0e3b4..HEAD` | Candidate | 0. |
| Protected/unedited Git comparison below | Candidate | 0 against plan BASE; broader ownership comparison against assigned starting HEAD also 0. |

For the final bare browser run, this shell sequence actually executed:

```sh
export PATH=/home/metatron/.bun/bin:$PATH
env | grep POC001
env | grep CHROME_PATH
mv poc-001-linked-formation/dist /tmp/rf-prior-dist-20261005
just poc-001-test-browser
```

Both `env` filters printed nothing (grep's empty-match status 1); no POC001/Chrome command-line or environment override was used. The old generated `dist` was moved outside the repository so the runner started without a bundle. It selected `/home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell`, reason **highest executable Playwright version (chromium_headless_shell-1223)**, reporting HeadlessChrome `148.0.7778.96`. Output directory `/tmp/p10-browser-Fg5PN4`. Application build/preview used the pinned Docker wrapper.

Actual matcher counts were collected separately without changing repository tests/config: a disposable Git archive of BASE and the candidate each ran in Docker with `/instrument/config.ts` extending the unchanged Vitest config with `/instrument/count.ts`. That hook is `afterEach(() => console.log('RF_MATCHERS ' + expect.getState().assertionCalls))`. The sums were **BASE 17,516 over 460 tests; candidate 17,960 over 477 tests** (+444 matchers, +17 tests, +2 files). The B2 fix removes second-phase forecast assertions from the broad equivalence loop, so the matcher increase is smaller than the new suites' count. Both instrumented runs exited 0. Exact candidate command:

```sh
. poc-001-linked-formation/runtime.env
docker run --rm --init --user "$(id -u):$(id -g)" --env HOME=/tmp \
  --volume /opt/dev/tehom-brainlab-ring/poc-001-linked-formation:/app \
  --volume /opt/dev/tehom-brainlab-ring/assets:/assets:ro \
  --volume /tmp/rf-instrumentation:/instrument:ro --workdir /app "$BUN_IMAGE" \
  bun run --bun test:unit --config /instrument/config.ts
```

The BASE command mounted `/tmp/rf-baseline-counts/poc-001-linked-formation:/app`, its archived assets at `/assets:ro`, and the installed candidate `node_modules` read-only at `/app/node_modules`; image `oven/bun:1.4.2`. Archive command: `git archive ef0e3b4 poc-001-linked-formation assets | tar -x -C /tmp/rf-baseline-counts`. Instrumentation stayed entirely in OS temporary directories. Candidate ordinary tests remained bare.

The protected-path check invokes `git diff --exit-code ef0e3b4..HEAD --` with all BASE-tracked tests except the seven allowed files, all protected source/config/scripts/assets paths from the assignment (plus unchanged `rounds.ts` and CSS), `docs/CURRENT.md`, `docs/TASK_LOGS.md`, `docs/adr`, `.agents`, `docs/mailbox` and `:(exclude)docs/mailbox/ring-formation`. Exit 0 over 43 pathspecs. Additionally, `git diff --exit-code 05bc25c..HEAD --` including plans and brief proved no worker changes to any ownership restriction. An initial overly broad BASE comparison included plans/brief and exited 1 on **pre-assignment Architect amendments**, not worker edits; corrected comparisons distinguish the plan BASE from assigned starting HEAD. No unexpected protected change remains.

## Criterion-by-criterion evidence

| RF criterion | Observable evidence and current status |
| --- | --- |
| 1 | Formation suite's independently written twelve-state positions, distances, explicit thresholds 1/2/3/4; Close/Splash/damage defaults unchanged in Git. Pass. |
| 2 | Existing serialized inverse/six-turn/shape tests, axial turn assertions; new RF radial doubling and distance-one step tests. Pass. |
| 3 | New frozen exact seven-cell table, disjointness and full 19-cell partition; no Brood centre occupancy. Pass. |
| 4 | New centre equivalence for six facings, three ordered `(1,-2)` fixtures, no origins/off-board fronts for all allowed enemy cells. Pass. |
| 5 | Updated independent centre tables plus explicit RF-2 protected-ID tables for all twelve states and both signed turns. Pass. |
| 6 | New source-pivot turn `(2,0)` → `(-1,1)`, inverse, nonturnable/other-source/mark preservation and off-board retention; centre tests preserved. Pass. |
| 7 | Unchanged patrol mark/round tests and `rounds.ts`; new announcement relocation witness and locked marks across all states/maneuvers. Pass. |
| 8 | P2 content test independently checks all three cells/facings and unique ENEMY_CELLS placement; unchanged HP/rules/presets/protection. Pass. |
| 9 | New missing/fractional/off-board/Brood/duplicate-cell rejection tests, centre placement, v2 exact replay and old-version error; unchanged run-record suite passes. Pass in units; final browser replay not reached. |
| 10 | Final fresh Compact/Spread screenshots for all presets inspected, exact core cells/facings and subpixel projection checked, pointer hit-tests and initial 1280×800 fit passed; C4 full run had zero exceptions. **Final browser pass unavailable; selected-control/preview scrolling remains a limitation.** |
| 11 | Original B1/B2/B3 failing-before and passing-after evidence above. **Final broader reset-preview contract fails, so overall browser acceptance is blocked.** |
| 12 | New arithmetic uses explicit local rules/HP; V2/V3 explicitly own placement/facing; content tests expose documented values; browser comparisons use current factories/oracle. No production tuning changed. **No deliberate default-mutation sweep run.** |
| 13 | All expected-unedited files unchanged versus BASE; full unit suite passes; lab/preview browsers pass unedited. Record browser passed C4 but was not reached in final verification. **Overall final browser verification incomplete.** |
| 14 | README replaces TR Compact, centre anchor and old current rules claims with RF contracts. The only v1 reference explains historical rejection. Pass. |

Orientation-zero serialized positions in roster order:

```json
{"compact":[{"brood":"ugallu","cell":{"q":1,"r":0}},{"brood":"girtablilu","cell":{"q":-1,"r":1}},{"brood":"pazuzu","cell":{"q":0,"r":-1}}],"spread":[{"brood":"ugallu","cell":{"q":2,"r":0}},{"brood":"girtablilu","cell":{"q":-2,"r":2}},{"brood":"pazuzu","cell":{"q":0,"r":-2}}],"compactLinks":[{"distance":2,"state":"close"},{"distance":2,"state":"close"},{"distance":2,"state":"close"}],"spreadLinks":[{"distance":4,"state":"stretched"},{"distance":4,"state":"stretched"},{"distance":4,"state":"stretched"}]}
```

Round-one marks (Warder / Censer / Harrier), at unchanged content HP:

- Healthy: Ugallu / Girtablilu / Ugallu.
- Wounded Ugallu: Ugallu / Girtablilu / Ugallu.
- Wounded Girtablilu: Ugallu / Girtablilu / Girtablilu.

## Screenshots and remaining limits

I opened and visually inspected all six final-candidate patrol start/Spread images in `/tmp/p10-browser-Fg5PN4/patrol/`, six Compact lab fixtures `fixture-0.png` through `fixture-5.png`, and `lab/expand-preview.png`. The ring-one triangle, empty centre, radial outer corners, separated enemy tiles, upright art, visible facing arrows and correct wounded actor HP are clear. The five retained [screenshots](screenshots/healthy-compact.png) include [Spread](screenshots/healthy-spread.png), [wounded Ugallu](screenshots/wounded-ugallu-compact.png), [wounded Girtablilu](screenshots/wounded-girtablilu-compact.png) and the [lab Expand ghost](screenshots/lab-expand-preview.png).

I also opened C4's `/tmp/p10-browser-rMselR/patrol/end-phase-preview.png`. Its selected-control state requires vertical scrolling and the captured viewport does not expose the textual preview below the fold. The native driver verified the B2 text, but this image alone does not visually establish that text. In the lab Expand image, Girtablilu's destination label is partially obscured by its live label; the unchanged protected lab renderer needs a separately authorized presentation decision if that must be fixed.

The candidate is committed and source working tree is clean. Disposable logs, drivers, archives and generated old bundle stay under `/tmp`; they are not committed. Numeric balance, ability-specific reach, a flank scenario, boss work and human evidence remain outside this assignment. Only the Coordinator may update canonical plans/current/task logs after disposition.

`bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/ring-formation/implementer.md --repo /opt/dev/tehom-brainlab-ring` executed with installed Bun on PATH: exit 0, `ok: true`, no diagnostics, all five revision fields resolved. Revalidated after recording this result.
