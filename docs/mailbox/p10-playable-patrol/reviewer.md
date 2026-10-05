task: P10-review
role: reviewer
status: complete
outcome: "Request changes: two blocking findings; zero optional findings. Required default checks pass."
baseline: 767f46c4352fd3f2181550214e887a58f0df30a1
candidate_revision: 353dac7e134972e6e69b02914af10cbf1f2d34bb
reviewed_revision: 353dac7e134972e6e69b02914af10cbf1f2d34bb
tested_revision: ca051f7ad0c4867d6dd7c84a2610dbc6bb2ff689
evidence_revision: ca051f7ad0c4867d6dd7c84a2610dbc6bb2ff689
artifacts:
  - docs/mailbox/p10-playable-patrol/assignment-reviewer.md
  - docs/mailbox/p10-playable-patrol/reviewer.md
verification:
  - "Docker full suite: exit 0; 11 files, 434 tests."
  - "Docker typecheck and build: each exit 0."
  - "just poc-001-test-browser: exit 0; 3 scripts, 2419 assertions, eight trace replays / 96 commands."
  - "Independent native focused-control probe: exit 1; Enter on clockwise executes Expand after another control is hovered."
  - "Independent valid Censer-damage-2 browser fixture: exit 1 at the historical HP assertion; browser and current core agree."
  - "Production fixture-boundary browser probe: exit 0; five assertions, zero uncaught exceptions."
  - "Candidate whitespace, technical-content identity, unchanged existing tests and protected-content checks: exit 0."
  - "All seven committed screenshots opened and inspected."
  - "Handoff validator with --repo: exit 0; ok true, no diagnostics."
review:
  - "Independent review complete; request changes for R1 and R2."
discoveries:
  - "The fixed-area document exists only through test-driver interception; its URL otherwise loads the ordinary lab."
blockers:
  - "R1: maneuver activation can confirm another control's cached maneuver."
  - "R2: browser historical-result comparisons freeze uncontrolled provisional patrol defaults."

P10 Reviewer. Authority: unchanged [assignment](assignment-reviewer.md), [P10 plan including Amendment TR](../../plans/2026-10-02-e7c77542-poc-001-playable-patrol.md), [repository policy](../../../.agents/policy.md), [ADR-0006](../../adr/0006-contract-invariants-and-black-box-testing.md), and the ruach-testing and ruach-handoff skills. **Verdict: request changes; 2 blocking, 0 optional findings.**

Reviewed the complete fourteen-file technical range `767f46c..353dac7`, the Implementer handoff, surrounding P03 dispatcher/P08 factories and rounds/P09 projections and session adapter, and both existing browser routes. All required execution took place at `ca051f7ad0c4867d6dd7c84a2610dbc6bb2ff689`. The technical-content identity check passed: `353dac7..ca051f7` adds only the Implementer assignment/report, browser evidence and screenshots. The later Reviewer recording commit is evidence-only and its SHA is returned in the terminal handoff.

## Findings, ordered by severity

### R1 — blocking: Enter on a maneuver can execute a different maneuver

**Location:** [CombatScene.ts:86](../../../poc-001-linked-formation/src/view/CombatScene.ts#L86), with hover/focus replacement of the shared pending preview at line 114.

**Failure scenario:** start a healthy patrol; keyboard-focus **Rotate clockwise**; move the pointer over **Expand** without clicking; press Enter. Focus remains on clockwise, so the native button activation is clockwise. The handler nevertheless confirms the pending expansion because it checks only `command.kind === 'maneuver'`, not the maneuver identity.

**Why it matters:** a visible, labelled gameplay control executes a different action and spends the once-per-round shared maneuver. This violates truthful control behavior and the required UI-to-core command contract, even though accounting still correctly prevents double spending. The README explicitly promises that click/Enter commits the selected shared maneuver. P04's existing `LabSession.commit` already distinguishes maneuver identities; P10's new handler drops that distinction.

**Evidence:** the independent CDP probe used the unchanged Docker-served production application. Evaluation only focused the native clockwise button and inspected DOM; pointer movement and Enter used native CDP input. Before Enter, `document.activeElement.dataset.maneuver` was `clockwise` while the preview said `Pending: Expand`. After Enter, revision was **1**, the shared maneuver was spent, and status was **Player · Round 1 · Spread / 0**. Actual Brood coordinates were `[(2,0),(-2,2),(0,-2)]`; independently applying clockwise to the same fresh patrol yields Compact orientation 1 and `[(0,2),(-1,2),(0,1)]`. The contract assertion failed, exit **1**. Existing browser tests always activate the same maneuver they just previewed, so the passing suite misses this case.

**Suggested direction:** bind activation to the button's maneuver. Reuse a cached preview only when it belongs to that same maneuver, preserving P09 stale-preview rejection; otherwise project the activated command through the existing adapter. Add a browser regression combining focused and hovered controls, including native Enter/Space activation. No rules change is needed.

### R2 — blocking: recorded-trace assertions freeze provisional defaults

**Location:** [browser-patrol.mjs:182](../../../poc-001-linked-formation/tests/browser-patrol.mjs#L182), especially the historical outcome/HP comparisons at lines 186–187.

**Failure scenario:** a permitted default Censer damage change from **3 to 2** leaves a healthy attack trace victorious with final Brood HP `[0,10,10]`. The view, previews and real core agree. The browser test starts `createPatrol(trace.preset)` with uncontrolled current defaults but requires the historical damage-3 transcript's `[0,8,8]`. It never supplies `trace.initial` or its explicit rules to the page. The comment about avoiding frozen default arithmetic does not make these final comparisons controlled.

**Why it matters:** assignment condition 1 expressly requires browser assertions not to freeze provisional defaults. ADR-0006 permits tuning evolution. Historical trace equality is appropriate under the recorded inputs; it does not establish that future default sessions must reproduce those inputs' exact final HP. The current-default trace sequence also assumes historical commands remain legal and terminate after the same number of steps, so merely removing the last HP comparison would not fully resolve the dependency.

**Evidence:** an isolated temporary fixture used the production `CombatScene`, stylesheet and `PatrolSession`, with a factory forwarding to the real `createPatrol(preset, {...DEFAULT_PATROL_RULES, censerDamage:2})`. The test document was supplied through CDP interception, following the committed test-owned fixture pattern. Repository source/tests were unchanged; no commands were dispatched into the page. A temporary copy of the existing driver used the same explicit rules for its independent core oracle and replayed the fourteen healthy attack commands through native visible controls. Every per-step preview and committed-state comparison passed. Browser and current headless final HP both were **`[0,10,10,0,0,0]`**, both outcomes were **victory**; the historical array was **`[0,8,8,0,0,0]`**. The existing historical-HP comparator then failed, exit **1**.

**Suggested direction:** control the recorded-trace scenarios with their recorded tuning through a bounded test-owned entry/fixture, or separate controlled historical replay from current-default browser/core equivalence. Keep the historical regression evidence and real-control coverage, while allowing valid default variations. Do not introduce a production debug surface or update historical evidence to conceal the dependency. Re-run a valid tuning variation against the revised browser checks.

No optional findings. No alternate damage, targeting, legality or settlement implementation was found. The production adapter correctly uses P09 `confirmPreview`; state changes and event production remain in P03/P08. R1 is command selection in the UI, not a second core rules path.

## Acceptance assessment and test-only surface

| P10 criterion | Independent assessment |
| --- | --- |
| 1: three preset starts | Pass at current defaults in both artwork modes; displayed HP, intentions, positions and phase match P08/P09. All six tokens are independently pointer-hit-tested and selected for each preset start. |
| 2: winning/losing traces | Pass at the reviewed default inputs: all four recorded traces replayed in both modes; per-step and final browser/core results match. R2 blocks the separate requirement for tuning-independent assertions. |
| 3: previews and committed results | Default scenarios pass, including Shelter loss, Crosswind protection changes, and fixed-area versus following rendering. R1 shows that a different control can commit the shared pending maneuver. |
| 4: action/maneuver reasons and serialized input | Default double, used-resource and stale/reset probes pass; public session tests cover stale revision and generation. R1 remains a wrong-command activation blocker. |
| 5: early end and order | Pass: unused living actions are disclosed, early end forfeits them, and the visible ordered resolution log matches core events before the next phase. |
| 6: reset during presentation | Pass in both modes: reset cancels the timeout and changes generation; complete readouts remain fresh after the old callback deadline. |
| 7: terminal/restart/errors | Pass in both modes: terminal combat commands do not change HP, restart restores the preset, no application-origin uncaught exceptions observed. |
| 8: bounded playable controls | Pass: only six declared abilities, four shared maneuvers and End phase are exposed; dragging does not move Brood; preset changes create fresh sessions. No free fixture selector exists on the playable route. |

The fixed-area entry under `tests/browser/` has no production import, route, emitted document or bundle. Its factory changes only test-owned declarations, and its controls remain the production controls through the existing command adapter. It introduces no movement, teleport or unplanned ability. A search of `dist` for `owned-area`, `owned-mark` and `p10-owned-fixture` returned no matches. Independently navigating to `/p10-owned-fixture` without interception produced the ordinary Formation lab, not the fixed-area scene. Its synthetic End phase is visibly unavailable with the actual core `invalid-command` reason; the fixture does not invent a forecast or bypass settlement.

The pre-existing `?preview=patrol` route **is shipped and can be opened**. It remains visibly labelled a **Patrol preview fixture**, with **Test setup — fresh lab fixture**, no playable actor/ability/End phase controls, and a separate `LabSession`. Its fixture selector resets that lab session before setting its formation. The playable page's Formation lab link navigates to a separate lab page; it cannot teleport or change the existing playable session. `?play=patrol&preview=patrol` still selects only the playable scene with no fixture controls. This separation is acceptable under the plan's explicit permission for the clearly separated early lab configuration selector, and preserves assigned P04/P09 behavior. The independent boundary probe passed five assertions with zero exceptions.

All seven committed captures were opened and visually inspected: [healthy start](healthy-start.png), [wounded Ugallu](wounded-ugallu-start.png), [wounded Girtablilu](wounded-girtablilu-start.png), [victory](victory.png), [defeat](defeat.png), [placeholder](placeholder.png), and [fixed area](fixed-area.png). The centre enemy cluster and adjacent Brood labels remain separate; emblems stay upright; labels remain meaningful in placeholder mode; terminal reasons and fresh-preset controls are visible. Fixed-area telegraphs visibly cover both rings and the moved creature mark. Expanded projections/history can scroll beyond the desktop viewport, as documented.

Independent default replay results, reproduced in both modes:

| Preset / strategy | Commands | Outcome / round | Brood HP U/G/P | Enemy HP W/C/H |
| --- | --- | --- | --- | --- |
| Healthy / attack | 14 | victory / 4 | 0/8/8 | 0/0/0 |
| Wounded Ugallu / attack | 14 | defeat / 5 | 0/0/0 | 0/0/7 |
| Wounded Girtablilu / attack | 16 | victory / 6 | 0/0/1 | 0/0/0 |
| Healthy / forfeit | 4 | defeat / 4 | 0/0/0 | 12/10/13 |

The just recipe and wrapper follow the existing prototype-local command pattern, forwarding browser arguments to the local script. The driver runs host Chrome/Bun while starting and stopping Docker preview. Package changes add only `test:browser`; no dependency or lockfile changes. Existing tests, core/content, assets, generated definitions and protected documents are unchanged.

## Exact independent verification

Commands ran from `/opt/dev/tehom-brainlab-p10` at the evidence-only successor identified above. Existing dependencies were usable, so install was not needed. The initial sandboxed `just poc-001-test` exited **1** before tests because Docker was inaccessible. The escalated retry and all subsequent Docker application checks succeeded. No host-mode application fallback or automatic approval rejection occurred. Browser tooling follows the existing host Bun/Chrome pattern; Docker served the application. Browser version was **HeadlessChrome 148.0.7778.96**, viewport **1280×800**, device scale 1.

| Exact command | Exit / result |
| --- | --- |
| `git diff --exit-code 353dac7 ca051f7 -- poc-001-linked-formation justfile` | 0; identical technical content. |
| `just poc-001-test` (escalated Docker retry) | 0; **434 tests in 11 files**. P02/P03/P05/P06/P07/P08 instrumented counts 1361/253/810/305/1072/492; P09 324 comparisons per preset, each repeated; three new controller tests pass. |
| `just poc-001-typecheck` | 0; `tsc --noEmit`. |
| `just poc-001-build` | 0; 9 prepared assets, 26 modules; JS 1424.64 kB / gzip 372.08 kB; CSS 4.48 kB / gzip 1.58 kB; existing large-bundle warning. |
| `PATH=/home/metatron/.bun/bin:$PATH just poc-001-test-browser /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p10-review-browser` | 0; **3 scripts / 2419 assertions**: lab177, preview24, patrol2218; 18+2+7 captures. Eight traces / 96 commands. All report zero uncaught exceptions; patrol zero failed requests; lab's two image failures are deliberate fallback cases. Wrapper stopped its Docker preview. |
| `git diff --check 767f46c..353dac7` | 0; repeated at review end. |
| `git diff --exit-code 767f46c 353dac7 -- $(git ls-tree -r --name-only 767f46c -- poc-001-linked-formation/tests)` | 0; every existing test unchanged; repeated at review end. |
| `git diff --exit-code 767f46c 353dac7 -- poc-001-linked-formation/src/core poc-001-linked-formation/src/content poc-001-linked-formation/bun.lock assets .agents docs/CURRENT.md docs/TASK_LOGS.md docs/adr docs/plans` | 0. |
| `just poc-001-preview` | Docker server ready at localhost:4173 for independent probes; stopped with Ctrl-C, exit130. |
| `/home/metatron/.bun/bin/bun /tmp/p10-review-probes/focus-browser.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p10-review-focus-browser` | 1; R1 native focused-control mismatch reproduced. |
| `/home/metatron/.bun/bin/bun /tmp/p10-review-probes/tuning-browser.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p10-review-censer-tuning-browser` | 1; R2 valid Censer damage2 variation, all fourteen healthy attack steps match current core, historical HP assertion fails. |
| `/home/metatron/.bun/bin/bun /tmp/p10-review-probes/boundary-browser.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p10-review-boundary-browser` | 0; five assertions, zero exceptions, shipped fixture boundaries confirmed. |
| `rg -n 'owned-area\|owned-mark\|p10-owned-fixture' poc-001-linked-formation/dist` | 1; no matches (absence check). |
| `docker ps --filter publish=4173 --format '{{.ID}} {{.Ports}}'` | 0; no preview container remains on port4173. |
| `sha256sum docs/mailbox/p10-playable-patrol/assignment-reviewer.md` | 0; before/after `dc70bcd69e77c96b963a0ce6d051b6dc3483815a00a84fada6ad1151c05afbff`. |
| `cp -a .agents/skills/ruach-handoff /tmp/p10-review-handoff` | 0; unchanged temporary skill copy. |
| `/home/metatron/.bun/bin/bun install --cwd /tmp/p10-review-handoff --frozen-lockfile` | 0; six pinned tool packages, no repository install writes. |
| `/home/metatron/.bun/bin/bun /tmp/p10-review-handoff/scripts/validate.ts docs/mailbox/p10-playable-patrol/reviewer.md --repo /opt/dev/tehom-brainlab-p10` | 0; `ok:true`, no diagnostics; all revision references resolve. |

The disposable native-input probes reuse the committed driver's CDP helpers in `/tmp`, redirecting imports to the reviewed source. R1's essential added sequence is `navigate(); focus(clockwise); hover(expand); key(Enter); settled();` then compare visible coordinates with `formationPositions(applyCommand(createPatrol(), clockwise).state)`. The boundary probe navigates, without interception, to `/p10-owned-fixture`, `?preview=patrol`, and `?play=patrol&preview=patrol`, checking the page identities and controls described above.

R2's test-owned entry creates the real shell and `new CombatScene(preset => createPatrol(preset, {...DEFAULT_PATROL_RULES, censerDamage:2}))`. Bun bundles it only in memory using the installed Phaser ESM entry, the committed fixture's CSS omission plugin and `import.meta.env.BASE_URL='./'`; CDP fulfills only the test browser's patrol documents with that bundle plus the production stylesheet. The temporary driver supplies the same rules to its independent factory; all command dispatch remains native controls. The distinct browser/core/historical arrays above are retained here as durable evidence.

Preliminary disposable-probe failures are not production failures: the first tuning-entry compile used Phaser's CommonJS source and failed on an optional `phaser3spectorjs` import, exit1; selecting the package's ESM distribution corrected setup. An initial Warder damage2 variation reproduced all eight historical outcomes/HP and then exited1 because the copied driver's unrelated fixed-area entry used a relative `/tmp` path. That variation did not demonstrate a default dependency. The corrected Censer damage2 probe subsequently reproduced R2 before reaching that unrelated trailing fixture. Repository source and tests were never edited.

## Limits and handoff

All assigned default commands and screenshot inspection are complete. The independent failing probes establish the two blockers beyond the passing suite. Browser observations are automated, not a human playtest; no mobile/browser matrix, exhaustive strategy search, accessibility certification, balance judgment or full console-message audit was performed. The existing Chrome software-WebGL warning remains; Phaser uses Canvas. Historical winning/losing traces were verified at the current default revision; R2 does not dispute that present evidence.

Only this Reviewer-owned report was authored; the Coordinator's assignment is committed unchanged alongside it. Temporary bundles, profiles, probe scripts and browser output remain outside Git under `/tmp`. No production/test/protected-document edits, merge, push, rebase, or branch/worktree deletion occurred. Fixes belong to the Implementer; Coordinator acceptance remains pending.
