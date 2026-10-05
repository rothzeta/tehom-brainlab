---
task: P10-fix
role: implementer
status: complete
outcome: R1 and R2 addressed; control activation owns its command and browser traces tolerate provisional patrol tuning.
baseline: 7580a67692d490082ff0de42be06d53e8f43cc44
fixed_revision: dfeaadeb56250d4f21168efa2950c09606e8d5e1
tested_revision: dfeaadeb56250d4f21168efa2950c09606e8d5e1
preserved_test_baseline: 767f46c4352fd3f2181550214e887a58f0df30a1
findings_addressed:
  - R1
  - R2
artifacts:
  - docs/mailbox/p10-playable-patrol/assignment-fix.md
  - docs/mailbox/p10-playable-patrol/fix.md
  - docs/mailbox/p10-playable-patrol/fix-browser-evidence.json
  - docs/mailbox/p10-playable-patrol/fix-tuning-evidence.json
  - docs/mailbox/p10-playable-patrol/fix-victory.png
  - docs/mailbox/p10-playable-patrol/fix-defeat.png
verification:
  - "Committed fix: full suite exit 0, 11 files / 440 tests; typecheck and build each exit 0."
  - "Committed fix: aggregate browser exit 0, 3110 assertions; P10 2909 assertions / 12 sequences / 132 input attempts."
  - "Exact reviewer R1 native probe: reproduced exit 1 before fix, exit 0 on committed fix."
  - "Throwaway Censer-damage-2 rebuild and aggregate browser: exit 0, 3086 assertions; P10 2885 assertions / 12 sequences / 132 input attempts."
  - "Production fixture-boundary probe: exit 0, five assertions, zero uncaught exceptions."
  - "Whitespace, baseline existing-test preservation and core/content/protected-document preservation checks: exit 0."
  - "Handoff validator with --repo: exit 0, ok true, all four revision references resolve."
review: not-run
discoveries:
  - "Censer damage 2 changes healthy attack HP to 0/10/10 and leaves two historical sequences in player phase; the revised oracle permits both changes."
  - "Controlled win/loss witnesses reuse the historical command sequences under independent encounter inputs, outside the production route."
blockers: []
---

# P10 Implementer — review fix

Executed the unchanged [fix assignment](assignment-fix.md) for the two blocking findings in [the review](reviewer.md). Fixed and tested technical revision: **`dfeaadeb56250d4f21168efa2950c09606e8d5e1`** on `p10-playable-patrol`. This report/evidence successor changes no technical content. Re-review and Coordinator acceptance remain pending; no merge, push or rebase occurred.

## R1 — activation belongs to its control

`PatrolSession.activate` compares the complete control identity: maneuver; or ability actor, ability, target and direction; or End phase. It confirms a matching cached preview through the existing P09 `confirmPreview`. When the cached preview belongs to a different control, it projects and confirms the activated control's own command through that same boundary. Revision is deliberately excluded from identity matching so a matching stale preview is **rejected**, rather than silently refreshed.

`CombatScene` uses this method for all committing controls. Confirm now constructs the selected ability/target/direction command, derives its availability from that command, and labels the selected action. Hovering a different target, Crosswind direction or End phase can change the preview without changing the confirmation's action. Actor/ability controls clear dependent selections without submitting anything; target buttons capture their own target/direction in their selection handler; token target selection also constructs the selected request. End phase has its own identity and cannot commit a maneuver preview. No damage, legality or other gameplay rule was added to UI handlers.

The exact Reviewer native probe reproduced the bug **before** this fix (exit 1: focused clockwise committed Spread / 0). At the committed fix it passes (exit 0): focus remains clockwise, preview is Expand, and native Enter commits **Compact / 1**, revision 1, with coordinates `[(0,2),(-1,2),(0,1)]`, equal to the independently executed clockwise core command.

Regression coverage runs in normal and placeholder modes:

- Focus clockwise, hover Expand, activate clockwise with native Enter **and Space**.
- Select Claw → Warder, focus Confirm, hover Censer, activate Confirm: Warder remains the actual target.
- Select clockwise Crosswind → Warder, focus Confirm, hover anticlockwise: facing/protection follow the selected clockwise command.
- Select Claw → Warder, focus Confirm, hover End phase: confirmation still executes Claw.
- Focus End phase, hover Expand, press Enter: End phase executes.

These are **12 native browser scenarios**, preserved in [fix-browser-evidence.json](fix-browser-evidence.json). Public-controller tests cover each identity mismatch and matching stale revision/session rejection. The controller suite increased from 3 to 9 tests.

## R2 — option (b), runtime expectation plus controlled outcomes

Historical P08 transcripts now supply **command sequences only** to ordinary patrol checks. For every step the test executes the requested command headlessly with the same current production rules and current revision the page uses. Accepted steps must produce the same displayed HP, formation, phase, round, revision and ordered event types/sources. Rejected steps must expose an unavailable control with the corresponding core reason; native pointer attempts must preserve state and emit no additional effects. Final state equals this runtime headless replay. The test no longer compares ordinary sessions with historical final HP/outcomes or assumes every historical command is accepted or the sequence necessarily ends combat.

Criterion 2 is checked separately in `tests/browser/outcome-fixture.ts` and `outcomeFixture` using **explicit test-owned encounter inputs**: Brood HP/max HP 20; enemies HP/max HP 1 for victory or 20 for defeat; all enemy damage 0 for victory or 50 for defeat; radius/Close thresholds 2; mitigation reductions 0; no protection relations; Compact / 0. The test uses the stored healthy attack and forfeit command sequences through the real controls and the same runtime core oracle. Player abilities retain the same current public rules in both page and oracle. Assertions require the controlled victory/defeat outcomes, while their HP and event expectations remain derived from the actual core result.

The separately compiled document is supplied **only by CDP interception**, following the existing fixed-area test entry pattern. It imports the actual scene/adapter and invokes the existing injectable factory at test startup; tests never dispatch gameplay commands into the page. Neither test entry is imported by `main.ts`, emitted in `dist`, selected by the playable route or exposed through player controls. This extra entry is necessary to prove win/loss independently of provisional patrol defaults without adding a production fixture/debug path. The direct production URL `/p10-outcome-fixture?outcome=victory`, without interception, opens the ordinary lab; the production boundary probe also preserves the P09/played-patrol separation.

Both final browser runs execute eight ordinary sequence replays and four controlled witnesses: **132 planned input attempts, 108 accepted and 24 unavailable**, with each step checked against its core result. Controlled victory and defeat each run in both artwork modes. Their browser-observed final states equal headless: victory HP `[20,20,20,0,0,0]`, defeat HP `[0,0,0,20,20,20]`. I opened and inspected the retained [controlled victory](fix-victory.png) and [controlled defeat](fix-defeat.png) screenshots from the final committed-candidate run. These are automated browser checks, **not a human playtest**.

## Temporary default-change evidence

Created a throwaway copy at `/tmp/p10-fix-default-change` from the committed fix, copied its assets/justfile/P08 transcript, and changed only `src/content/patrol.ts` from **`censerDamage: 3` to `censerDamage: 2`**. A byte comparison of all source, test and wrapper files found precisely that one differing file. The branch's content/core and defaults remain unchanged. Original source SHA-256 `feac9843e18007902a6be656d159ed8bb07df21013869bc343473ab6178a1327`; temporary changed source `cea1b0e0042392cacd7c4b843e11346798989be1d4c56b9c46ebf24d38454342`.

The copy was rebuilt and served by its normal **Docker** wrapper on port 4174, and the same revised browser scripts passed without editing assertions. [fix-tuning-evidence.json](fix-tuning-evidence.json) preserves actual outputs and initial rules, separate from the committed-candidate evidence. It is evidence for `dfeaade` **plus the stated temporary edit**, not a claim that the modified defaults exist in that commit.

| Ordinary sequence | Damage-3 final Brood HP / phase | Damage-2 final Brood HP / phase |
| --- | --- | --- |
| healthy / attack | `[0,8,8]` / victory | `[0,10,10]` / victory |
| wounded-ugallu / attack | `[0,0,0]` / defeat | `[0,0,3]` / player |
| wounded-girtablilu / attack | `[0,0,1]` / victory | `[0,0,3]` / victory |
| healthy / forfeit | `[0,0,0]` / defeat | `[0,0,8]` / player |

Every row is observed in normal **and** placeholder mode, with matching runtime core outcomes/events. The two nonterminal results demonstrate that removing only the old final-HP assertion would have been insufficient. Controlled witnesses remain victorious/defeated under both builds.

## Changed files and scope

Changed seven technical files: `src/view/CombatScene.ts`, `src/view/patrol-session.ts`, `tests/browser-patrol.mjs`, `tests/browser/fixtures.ts`, new `tests/browser/outcome-fixture.ts`, `tests/patrol-session.test.ts`, and only the P10 section of the prototype `README.md`. All are within the original P10 view/test/documentation scope. The README now documents selected-command confirmation and separates current-rule replay from controlled win/loss witnesses.

No new dependency, package/lockfile change, core/content modification, original test edit, reviewer-report edit, protected-document update, or plan change occurred. The assignment is preserved unchanged (SHA-256 `a4c4843fedd9994e6aaee74320b0c886f935900b0ca88731f802adf3efb5d832`). Previous implementation/review reports and evidence remain untouched.

## Exact verification on the committed fix

Commands ran from `/opt/dev/tehom-brainlab-p10` after commit `dfeaade`, unless explicitly identified as the pre-fix reproduction or throwaway variant. Bun 1.4.2; pinned Docker toolchain; HeadlessChrome **148.0.7778.96**, **1280×800**, scale 1. Browser tooling uses the existing host Bun/Chrome CDP pattern; application build/serving/checks retain Docker, with bounded Docker/local-network escalations. No application host-mode fallback or browser dependency was introduced.

| Exact command | Exit / result |
| --- | --- |
| `just poc-001-test` | 0; **11 files / 440 tests**, including 9 controller tests. All existing suites pass unedited. |
| `just poc-001-typecheck` | 0; strict TypeScript source/tests. |
| `just poc-001-build` | 0; 9 assets prepared, 26 modules; JS 1425.08 kB / gzip 372.25 kB, CSS 4.48 kB / gzip 1.58 kB. Existing large Phaser bundle warning remains. |
| `PATH=/home/metatron/.bun/bin:$PATH just poc-001-test-browser /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p10-fix-final-browser` | 0; **3 scripts / 3110 assertions**: lab177, preview24, patrol2909. P10 12 sequences / 132 attempts, 12 focus/hover cases, zero uncaught exceptions and failed requests. Wrapper starts/stops Docker preview on 4173. |
| `just poc-001-preview` | Docker preview used for the R1 reproducer and exact post-fix rerun; stopped with Ctrl-C, exit130. |
| `/home/metatron/.bun/bin/bun /tmp/p10-review-probes/focus-browser.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p10-fix-before-r1` | **1**, pre-fix R1 reproduced at review successor `7580a67`. |
| `/home/metatron/.bun/bin/bun /tmp/p10-review-probes/focus-browser.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p10-fix-final-r1` | **0**, exact reviewer R1 scenario passes at committed fix. |
| `just --justfile /tmp/p10-fix-default-change/justfile --working-directory /tmp/p10-fix-default-change poc-001-build` | 0 on corrected copy setup; Censer-damage-2 variant rebuilt by Docker, 26 modules. |
| `PATH=/home/metatron/.bun/bin:$PATH POC001_BROWSER_PORT=4174 just --justfile /tmp/p10-fix-default-change/justfile --working-directory /tmp/p10-fix-default-change poc-001-test-browser /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p10-fix-default-change-browser` | 0; **3 scripts / 3086 assertions**: lab177, preview24, patrol2885. Same 12 sequences / 132 attempts, controlled witnesses and focus/hover cases; P10 zero uncaught exceptions and failed requests. Fewer assertions reflect correctly skipped terminal-only checks for changed nonterminal ordinary sequences. Wrapper stops its 4174 preview. |
| `/home/metatron/.bun/bin/bun /tmp/p10-fix-boundary-browser.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p10-fix-boundary-browser http://localhost:4174/` | 0; 5 assertions, zero exceptions; new fixture URL has only ordinary lab fallback without interception. Probe derives from the reviewer boundary probe with the new URL and a distinct CDP port. |
| `rg -n 'p10-outcome-fixture\|p10-owned-fixture\|owned-area\|owned-mark\|Test outcome required' poc-001-linked-formation/dist` | 1, expected no matches: test-owned entries absent from production bundle. |
| `git diff --check` and `git diff --check dfeaade^..dfeaade` | Each 0; whitespace check repeated after recording evidence/report. |
| `git diff --exit-code 767f46c..HEAD -- $(git ls-tree -r --name-only 767f46c -- poc-001-linked-formation/tests)` | 0; every original test, including existing browser scripts, unchanged. |
| `git diff --exit-code 7580a67..HEAD -- poc-001-linked-formation/src/core poc-001-linked-formation/src/content poc-001-linked-formation/bun.lock assets .agents docs/CURRENT.md docs/TASK_LOGS.md docs/adr docs/plans docs/mailbox/p10-playable-patrol/reviewer.md` | 0; original core/defaults, assets, generated resources, lockfile, protected documents and reviewer report unchanged. |
| `docker ps --filter publish=4173 --filter publish=4174 --format '{{.ID}} {{.Ports}}'` | 0; neither preview remains. |
| `/home/metatron/.bun/bin/bun /tmp/p10-handoff-skill/scripts/validate.ts docs/mailbox/p10-playable-patrol/fix.md --repo /opt/dev/tehom-brainlab-p10` | 0; `ok:true`, no diagnostics, all four revision references resolve. |

The temporary copy's first build failed before compilation because Python had dereferenced dependency executable symlinks. Re-copying only its disposable `node_modules` with `symlinks=True` restored the normal Vite executable layout; rebuilding and all variant browser checks then passed. No repository source or assertion changed to address that setup error. The existing unchanged P04 failed-image cases intentionally produce two blocked-image request failures; all scripts report zero uncaught application exceptions. P10 records runtime exceptions/network failures rather than claiming an exhaustive console audit.

No required check remains unexecuted. The validator uses the unchanged temporary skill copy and pinned tool dependencies retained from the original P10 handoff; no generated skill source was modified. No implementation blocker remains. Independent re-review and Coordinator acceptance/delivery are pending. Temporary copies/profiles/logs/duplicate screenshots remain outside Git.
