task: P10-review
role: reviewer
status: complete
outcome: "R1 and R2 resolved at dfeaade; approve with zero remaining blocking or optional findings."
baseline: 767f46c4352fd3f2181550214e887a58f0df30a1
candidate_revision: dfeaadeb56250d4f21168efa2950c09606e8d5e1
reviewed_revision: dfeaadeb56250d4f21168efa2950c09606e8d5e1
tested_revision: dfeaadeb56250d4f21168efa2950c09606e8d5e1
evidence_revision: 67b847ff233d9eded55c3e042c52fbeab19905fc
artifacts:
  - docs/mailbox/p10-playable-patrol/assignment-reviewer.md
  - docs/mailbox/p10-playable-patrol/reviewer.md
  - docs/mailbox/p10-playable-patrol/assignment-rereview.md
verification:
  - "At exact dfeaade, Docker full suite: exit 0; 11 files, 440 tests; typecheck and build each exit 0."
  - "just poc-001-test-browser: exit 0; three scripts, 3110 assertions; 12 sequences / 132 input attempts, 12 focus/hover regressions."
  - "Exact original R1 native focused-control probe: exit 0; Enter commits the focused clockwise command."
  - "Throwaway Censer-damage-2 Docker build and unchanged aggregate browser: exit 0; 3086 assertions, changed final HP and nonterminal sequences correctly accepted."
  - "New production fixture-boundary browser probe: exit 0; five assertions, zero uncaught exceptions."
  - "Candidate whitespace, technical-content identity, unchanged existing tests and protected-content checks: exit 0."
  - "Both committed fix outcome screenshots opened and inspected; original seven captures remain reviewed historical evidence."
  - "Handoff validator with --repo: exit 0; ok true, no diagnostics."
review:
  - "Independent re-review complete; approve dfeaade with no remaining material findings."
discoveries:
  - "Both outcome and fixed-area entries are test-driver-owned documents, absent from production routing/build."
  - "With Censer damage 2, two historical command sequences remain in player phase; ordinary replay assertions now permit that variation."
blockers: []

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

## Re-review of R1/R2 at dfeaade

P10 Reviewer, 2026-10-05 UTC. Authority: unchanged [re-review assignment](assignment-rereview.md). **Verdict: approve. R1 and R2 resolved; remaining findings: 0 blocking, 0 optional. No new material findings.** The original findings and verification above remain historical evidence for `353dac7`; this section and the updated leading YAML describe the fixed combined candidate.

Reviewed the complete seven-file fix range `7580a67..dfeaadeb56250d4f21168efa2950c09606e8d5e1`: combat scene, session adapter, browser driver, test fixtures/new outcome entry, controller tests, and the P10 README section. Inspected surrounding control selection, P09 stale guards, P03/P08 command submission, browser interception, production routing and the [fix handoff](fix.md). The starting branch head `67b847ff233d9eded55c3e042c52fbeab19905fc` adds only fix evidence/report/assignment; technical-content identity passed. I temporarily checked out **exact `dfeaade`** for all final application checks and independent probes, then restored the task branch at `67b847f` to record this report. No source or test on the branch was changed.

### R1 disposition — resolved

[patrol-session.ts:41](../../../poc-001-linked-formation/src/view/patrol-session.ts#L41) chooses the activated command's projection unless the cached command has the same complete control identity. Identity includes maneuver, or actor/ability/target/direction, or End phase. It deliberately excludes revision, so a matching stale cached preview is still rejected by P09 `confirmPreview`, rather than silently recomputed. Both paths retain that same command boundary, busy lock and reset generation guard; no gameplay calculation was added.

[CombatScene.ts:86](../../../poc-001-linked-formation/src/view/CombatScene.ts#L86) binds maneuver and End phase activation to their closures. Confirm constructs the selected actor/ability/target/direction command and labels it explicitly. Its legality is projected from that selected command, so hovering a different target or command cannot replace confirmation. Actor/ability selection clears dependent selections without submitting; target/direction handlers capture the clicked option and update the selection. Source inspection found no remaining alternate activation path that substitutes an unrelated pending command.

The **exact original independent native-input probe passes**, exit0. With clockwise still focused and `Pending: Expand` visible after pointer hover, native Enter commits **Compact / 1**, revision1, positions `[(0,2),(-1,2),(0,1)]`, equal to an independent clockwise core command. The former failure produced Spread / 0.

Regression coverage is present and passed. The browser now runs six focus/hover scenarios in each artwork mode: clockwise activated by Enter and Space despite an expansion preview; selected Claw/Warder despite a Censer preview; selected clockwise Crosswind despite anticlockwise preview; selected ability despite End phase preview; and focused End phase despite maneuver preview. It checks live isolation, exact resulting HP/revision/phase/formation, and Crosswind facing/protection. The nine public controller tests include five identity-mismatch cases and matching stale-revision/stale-session rejection. Earlier reset/double/terminal cases continue to pass. Actor/ability controls themselves remain selection-only and are also exercised across the ordinary trace sequences.

### R2 disposition — resolved

[browser-patrol.mjs:266](../../../poc-001-linked-formation/tests/browser-patrol.mjs#L266) now treats historical commands as input sequences. Each expected accepted or rejected result comes from the actual current-rule `applyCommand` replay. The driver checks disabled controls and corresponding reasons for rejected steps, unchanged state/events after attempted activation, and core-equivalent state and ordered events for accepted steps. Its final assertion compares with that runtime replay; terminal-only checks run only when the current result is terminal. The historical final HP/outcome and always-accepted assumptions were removed without changing the stored transcript or existing tests.

The independent requested default-change probe **passed against a rebuilt throwaway copy**, not an injected production fixture or modified branch. `/tmp/p10-rereview-tuning` was populated by `git archive dfeaade` with the prototype, assets, justfile and P08 transcript. Only `src/content/patrol.ts` changed, from `censerDamage: 3` to `censerDamage: 2`; byte comparisons of all source/test/script/bin files before and after verification confirmed exactly that one difference. Original SHA-256 is `feac9843e18007902a6be656d159ed8bb07df21013869bc343473ab6178a1327`; variant is `cea1b0e0042392cacd7c4b843e11346798989be1d4c56b9c46ebf24d38454342`.

The copy was independently built and served with pinned Docker, then the **unchanged aggregate browser scripts** ran against it. All three passed: **3086 assertions**, including **2885 patrol assertions**, 12 sequences / 132 attempted inputs, and all 12 identity regressions. Browser and headless results agree at every step in both artwork modes. Observed ordinary results:

| Sequence | Exact dfeaade Brood HP / phase | Censer-damage-2 copy Brood HP / phase |
| --- | --- | --- |
| Healthy / attack | `[0,8,8]` / victory | `[0,10,10]` / victory |
| Wounded Ugallu / attack | `[0,0,0]` / defeat | `[0,0,3]` / player |
| Wounded Girtablilu / attack | `[0,0,1]` / victory | `[0,0,3]` / victory |
| Healthy / forfeit | `[0,0,0]` / defeat | `[0,0,8]` / player |

The changed nonterminal results are material evidence: this probe tests removal of the old legality/termination assumptions as well as the final-HP constant. No assertion or command sequence was edited for the variant. The lower assertion total reflects terminal-only checks correctly skipped for nonterminal outcomes.

Criterion2 still has real visible-control evidence. Ordinary default sessions continue to reproduce the original winning/losing trace outcomes, HP and core transitions. Additional controlled witnesses at [fixtures.ts:15](../../../poc-001-linked-formation/tests/browser/fixtures.ts#L15) explicitly own encounter damage, HP, mitigation, thresholds and formation; they run the recorded healthy attack/forfeit sequences through the same scene and adapter. In **both builds and both modes**, the victory witness finishes at HP **`[20,20,20,0,0,0]`**, and defeat at **`[0,0,0,20,20,20]`**, exactly matching runtime headless results. Assertions check required victory/defeat while deriving HP and events from core. Twelve sequences / 132 input attempts comprise eight ordinary replays plus four controlled witnesses; observed accepted/unavailable totals are **108/24** in each build. Controlled values are fixture inputs, not new gameplay defaults.

### Test-only boundary and affected behavior

The new `tests/browser/outcome-fixture.ts` entry is compiled in memory by the host driver and supplied solely through CDP document interception, using the production stylesheet/scene/adapter. No application source imports it; no bundle, HTML entry or player control was added to production. It uses the existing test-boundary factory injection rather than a browser gameplay API. The driver never dispatches gameplay into the page. Production `main.ts` and routing are unchanged.

The independent boundary probe navigated to **`/p10-outcome-fixture?outcome=victory` without interception** and found only the ordinary Formation lab. The existing P09 fixture remains labelled a fresh lab setup with no playable ability/End phase controls; `?play=patrol&preview=patrol` remains playable with no lab fixture selector. Five boundary assertions passed with zero uncaught exceptions. A production-bundle search found no outcome/fixed-area entry markers. Thus no player-reachable fixture injection, teleport, individual movement or unplanned ability was introduced; criterion8 remains satisfied.

The original lab/preview scripts remain byte-identical and pass in both builds. The full patrol driver still checks initial preset HP/intentions and all token pointer centres, six declared abilities, shared maneuvers, Shelter eligibility loss, Crosswind protection changes, ordered early-end feedback, reset during presentation, double/stale input, terminal rejection/restart, placeholder mode and fixed-area/following rendering. P03/P08 remain the command path, P09 projections/confirmation are reused, and no new dependency or production core/content edit accompanies the fix.

Both committed outcome captures, [fix victory](fix-victory.png) and [fix defeat](fix-defeat.png), were extracted from evidence commit `67b847f`, opened and visually inspected. Selected confirmation labels identify the actual ability/target, terminal status and disabled reasons are visible, and the separate centre cluster remains readable. These screenshots represent controlled witnesses; they do not replace ordinary-patrol evidence or establish human playtest quality.

### Exact re-review verification

All default checks and native probes below executed with HEAD exactly `dfeaadeb56250d4f21168efa2950c09606e8d5e1`. The tuning copy is that revision **plus the stated temporary Censer edit**, not a different branch revision. Docker remains the application runner; host Bun/Chrome are used for the established CDP driver and validator. No install was needed. Browser is HeadlessChrome148.0.7778.96 at 1280×800, scale1. Escalations succeeded; no approval rejection or host-mode application fallback occurred.

| Exact command | Exit / result |
| --- | --- |
| `git diff --exit-code dfeaade 67b847f -- poc-001-linked-formation justfile` | 0; technical identity. |
| `git switch --detach dfeaadeb56250d4f21168efa2950c09606e8d5e1` | 0; exact tested revision. |
| `just poc-001-test` | 0; **440 tests / 11 files**, including nine controller tests; P09 324 comparisons per preset, each repeated. Earlier instrumented counts unchanged. |
| `just poc-001-typecheck` | 0; `tsc --noEmit`. |
| `just poc-001-build` | 0; nine assets, 26 modules; JS1425.08kB/gzip372.25kB; CSS4.48kB/gzip1.58kB; existing large-bundle warning. |
| `PATH=/home/metatron/.bun/bin:$PATH just poc-001-test-browser /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p10-rereview-browser` | 0; **3110 assertions**: lab177, preview24, patrol2909. Twelve sequences / 132 attempts; 12 focus/hover regressions. All scripts zero uncaught exceptions; patrol zero failed requests. Lab's two blocked-image failures remain intentional. Wrapper stopped preview. |
| `just poc-001-preview` | Docker ready on4173 for independent native probes; stopped with Ctrl-C, exit130. |
| `/home/metatron/.bun/bin/bun /tmp/p10-review-probes/focus-browser.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p10-rereview-r1` | 0; exact original R1 reproducer now passes. |
| `/home/metatron/.bun/bin/bun /tmp/p10-review-probes/rereview-boundary-browser.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p10-rereview-boundary` | 0; new fixture URL boundary, five assertions, zero exceptions. |
| `git diff --check 7580a67..dfeaade` | 0; repeated during final checks. |
| `git diff --exit-code 767f46c dfeaade -- $(git ls-tree -r --name-only 767f46c -- poc-001-linked-formation/tests)` | 0; every baseline existing test unchanged, repeated during final checks. |
| `git diff --exit-code 7580a67 dfeaade -- poc-001-linked-formation/src/core poc-001-linked-formation/src/content poc-001-linked-formation/bun.lock assets .agents docs/CURRENT.md docs/TASK_LOGS.md docs/adr docs/plans` | 0. |
| `rg -n 'p10-outcome-fixture\|p10-owned-fixture\|owned-area\|owned-mark\|Test outcome required' poc-001-linked-formation/dist` | 1; expected no matches. Application-source outcome-entry search also had no matches. |
| Docker variant build and preview commands below | Build0; preview ready on4174, stopped with Ctrl-C/exit130 after the variant browser run. |
| `/home/metatron/.bun/bin/bun scripts/browser-checks.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p10-rereview-tuning-browser http://localhost:4174/` (cwd `/tmp/p10-rereview-tuning/poc-001-linked-formation`) | 0; **3086 assertions**: lab177, preview24, patrol2885; same sequences/regressions; patrol zero exceptions/failed requests. |
| `docker ps --filter publish=4173 --filter publish=4174 --format '{{.ID}} {{.Ports}}'` | 0; neither preview remains. |
| `git switch p10-playable-patrol` | 0; restored evidence successor `67b847ff233d9eded55c3e042c52fbeab19905fc`. |
| `sha256sum docs/mailbox/p10-playable-patrol/assignment-rereview.md` | 0; unchanged `28f7dc4a939a852068bfb89091056693bfd9deaacd54c76aed62e5cf894f6699`. |
| `/home/metatron/.bun/bin/bun /tmp/p10-review-handoff/scripts/validate.ts docs/mailbox/p10-playable-patrol/reviewer.md --repo /opt/dev/tehom-brainlab-p10` | 0; `ok:true`, no diagnostics, all revision references resolve. |

Exact variant Docker build command:

```sh
docker run --rm --init --user "$(id -u):$(id -g)" --env HOME=/tmp --env BUN_INSTALL_CACHE_DIR=/tmp/bun-cache --volume /tmp/p10-rereview-tuning/poc-001-linked-formation:/app --volume /tmp/p10-rereview-tuning/assets:/assets:ro --volume /opt/dev/tehom-brainlab-p10/poc-001-linked-formation/node_modules:/opt/dev/tehom-brainlab-p10/poc-001-linked-formation/node_modules:ro --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 sh ./scripts/toolchain.sh build --configLoader native
```

Exact variant Docker preview command:

```sh
docker run --rm --init --user "$(id -u):$(id -g)" --env HOME=/tmp --env BUN_INSTALL_CACHE_DIR=/tmp/bun-cache --env POC001_PORT=4174 --publish 127.0.0.1:4174:4174 --volume /tmp/p10-rereview-tuning/poc-001-linked-formation:/app --volume /tmp/p10-rereview-tuning/assets:/assets:ro --volume /opt/dev/tehom-brainlab-p10/poc-001-linked-formation/node_modules:/opt/dev/tehom-brainlab-p10/poc-001-linked-formation/node_modules:ro --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 sh ./scripts/toolchain.sh preview --configLoader native
```

Variant setup was `mkdir -p /tmp/p10-rereview-tuning` and `git archive dfeaade -- poc-001-linked-formation assets justfile docs/mailbox/p08-patrol-round-loop/traces.json | tar -x -C /tmp/p10-rereview-tuning`, followed by the single asserted literal replacement in the temporary `patrol.ts`. Initial dependency copying with `cp -a` failed with **No space left on device** in `/tmp`; only that partial Reviewer-owned dependency copy was removed. A symlink to existing dependencies and the read-only Docker mount above replaced copying. The first variant Docker build then exited1 because Vite's default config bundler attempted a write into read-only dependencies. Re-running with the supported **`--configLoader native`** option passed; build/preview use the same prototype toolchain/package scripts and source, without changing their files. The variant browser assertions remained unchanged. These were setup failures, not candidate failures.

The original R1 probe was reused unchanged. The new boundary probe is the earlier temporary probe with only its first navigation changed to the new outcome-fixture URL; it retains the P09/playable separation assertions. Temporary browser JSON outputs were inspected to confirm counts, accepted/unavailable totals and the final arrays reported here; raw output and profiles remain outside the repository.

All assigned checks and materially affected areas are verified. No human playtest, mobile/browser matrix, full console audit, exhaustive strategy search or balance assessment is claimed. Only this report was edited, with the re-review assignment preserved unchanged and committed alongside it. Original findings remain intact below the updated leading block. No production/test/protected-document changes, merge, push or rebase occurred. Coordinator acceptance/delivery remains separate; the report-creating SHA is returned in the terminal handoff.
