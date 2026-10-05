task: RF-review
role: reviewer
status: complete
outcome: "Approve RF at 0d5fadc; no blocking findings, one optional pre-existing README status correction."
baseline: 05bc25c56e6540d54515be57db514f4937cec04e
reviewed_revision: 0d5fadcb1a4c1a9c1cec75d93a72c37d07fdd3ae
tested_revision: 0ff43d648fcdf2fea48149c5f3507b400bb5fb06
artifacts:
  - docs/mailbox/ring-formation/assignment-reviewer.md
  - docs/mailbox/ring-formation/reviewer.md
verification:
  - "just poc-001-test: exit 0; 14 files, 477 tests."
  - "just poc-001-typecheck and just poc-001-build: each exit 0 through Docker."
  - "just poc-001-test-browser: two consecutive bare runs, each exit 0; 4964 assertions, four scripts, zero uncaught application exceptions."
  - "git diff --check 05bc25c..0d5fadc: exit 0; unedited suites, reset assertion and protected paths preserved."
  - "Independent historical reproductions confirm B1, B2, B3 and stationary-pointer causes; reviewed behavior passes."
  - "Throwaway Docker tuning probes: new RF assertions remain independent of changed defaults; preserved older dispatch tests fail when Close crosses to 1, as detailed below."
  - "Required screenshots opened and inspected; initial layouts fit 1280x800 and lab destination captions are legible."
review:
  - "No material correctness or RF acceptance findings; 0 blocking, 1 optional."
discoveries:
  - "README opening still describes the P04-only prototype; this predates RF and is optional documentation cleanup."
  - "Seventeen preserved older tests depend on production Close eligibility at dispatch; no new or edited RF assertion was responsible for the threshold-1 probe failures."
blockers: []

# RF independent review

Reviewed the implementation range `05bc25c..0d5fadc`, including bug checkpoint `4137db1`, RF implementation `e18cd09`, and follow-up `0d5fadc`, against the [assignment](assignment-reviewer.md), [accepted RF task](../../plans/2026-10-05-c6399cb6-poc-001-ring-formation.md), [Architect confirmation](architect.md#user-confirmation), and [follow-up authority](assignment-fix.md). Inspected affected source/tests and surrounding geometry, abilities, resolution, session, rendering and record code. The later `0ff43d6` contains evidence only: `git diff --exit-code 0d5fadc..0ff43d6 -- poc-001-linked-formation` passes, so checks at that HEAD exercise the reviewed technical content. No production source or repository tests were modified.

Verdict: **approve**, with **0 blocking and 1 optional finding**. No material correctness or acceptance findings.

## Finding, ordered by severity

**O1 — optional, pre-existing documentation contradiction.** Location: `poc-001-linked-formation/README.md:3` (also line 5). A reader opening the README is told “Not a playable patrol” and that combat is later work, despite `src/main.ts:6` selecting the implemented combat route and the README's P10 section describing how to play it. The contradiction can hide the playable prototype from a reader who stops at the opening status. Evidence: both opening statements are unchanged from `05bc25c`; both bare browser runs exercised the patrol successfully. Suggested direction: update the opening status and introductory scope to acknowledge the playable patrol while retaining historical delivery references. This does not invalidate the correctly updated RF contract sections.

## Acceptance assessment

| Criteria / assignment condition | Evidence and result |
| --- | --- |
| RF 1–3: formation, reversibility, cell partition | Independent coordinate tables match all twelve labelled states; Compact links are `[2,2,2]` and Spread `[4,4,4]` at explicit threshold 2. Existing inverse/six-turn/shape checks remain. New radial and frozen/disjoint 19-cell partition checks pass. The centre remains empty of Brood. |
| RF 4–6: fronts, protection, turns | `frontCells` translates the existing wedge and clips to the board; centre equivalence, ordered examples and all allowed origins/facings pass. Protection reads source tile/facing. Pivoted area turns preserve other sources, marks and nonturnable areas; inverse and off-board retention checks pass. |
| RF 7–8: unchanged targeting and one layout | `rounds.ts` is unchanged and reads no enemy coordinate. The required round-one marks and historical AC7 traces pass. Every preset uses Warder `(1,-2)/0`, Censer `(-2,1)/4`, Harrier `(1,1)/2`, on distinct enemy cells. No maneuver blocking or generic reach rule was added. |
| No numeric tuning | `damage.ts`, `abilities.ts`, `brood.ts`, resolution and transition are unchanged; patrol diff retains HP, wounded HP, damage and rule defaults. Close and splash declarations are unchanged. No second layout or selector was introduced. |
| RF 9: records | Rules version is `poc-001-rules-v2/patrol-v2/p07-v1`; envelope remains 1. Required cells have exact coordinate fields, safe integers, allowed membership and coordinate-based uniqueness. Missing/fractional/off-board/Brood/duplicate cells reject; centre placement accepts; old rules reject explicitly; new unit and browser records replay. |
| RF 10–11: presentation and bugs | Both complete browser runs pass enemy coordinate/projection and Compact/Spread hit tests for every preset, initial viewport fit, hover/focus behavior and regressions. Independently inspected the images and reproduced causes as below. |
| RF 12: no new frozen tuning | Throwaway mutations described below leave the new RF assertions passing. Updated V2/V3 explicitly own the Warder tile/facing; geometry assertions encode accepted geometry; P08 AC1's exact documented content expectations are the authorized exception. |
| RF 13: tests and previous contracts | Twelve BASE-tracked test/fixture paths outside the authorized changes are byte-identical, including `.gitkeep`. P03/P06/P07 checks pass. The permitted existing edits match F1–F5, I1–I7, D1, A1–A2, P2, V2–V3 and BP1–BP4; AC7 and trace sources remain unchanged. |
| RF 14 / README | P02/P05/P08/P09/P10/P11 correctly state RF geometry, tile fronts, protection, deferred ability-specific reach, versions and single End-phase resolution. No stale TR, sector-aligned enemy or view-only enemy-anchor contract remains. O1 concerns the older opening status. |
| Bounded lab follow-up | Only ghost-caption CSS placement changed; original P04 assertions remain, with exactly one legibility assertion added over 36 previews. The unchanged reset assertion appears once in BASE, `8039a02` and `0d5fadc`; the entire patrol driver is unchanged by the follow-up. |

## Independent verification

Dependencies were already installed; `just poc-001-install` was unnecessary and not run. The initial sandboxed unit invocation exited 1 because Docker was inaccessible; escalated Docker execution then succeeded. Application checks used Docker, never host application mode. Host Bun ran browser drivers and handoff validation.

| Command | Result / scratch evidence |
| --- | --- |
| `just poc-001-test` | Exit 0, 14 files / 477 tests; `/tmp/rf-review-unit.log`. |
| `just poc-001-typecheck` | Exit 0. |
| `just poc-001-build` | Exit 0, 27 modules; `/tmp/rf-review-build.log`. Existing large Phaser bundle warning only. |
| `just poc-001-test-browser`, run 1 | Exit 0; `/tmp/rf-review-browser-1.log`, output `/tmp/p10-browser-ohKkzQ`. |
| `just poc-001-test-browser`, run 2 | Exit 0; `/tmp/rf-review-browser-2.log`, output `/tmp/p10-browser-p0K7Pk`. |
| `git diff --check 05bc25c..0d5fadc` | Exit 0. |
| `git diff --exit-code 05bc25c..0d5fadc -- <unedited test paths>` | Exit 0 across 12 paths, discovered from `git ls-tree`; eight authorized existing files excluded, including the separately authorized lab driver. |
| `git diff --exit-code 8039a02..0d5fadc -- poc-001-linked-formation/tests/browser-patrol.mjs` | Exit 0; original reset assertion retained verbatim. Python comparison also retained every original lab assertion line. |
| Protected source/tooling/docs comparison against `05bc25c` | Exit 0 for damage/lifecycle/transition/commands/state/abilities/rounds, Brood content, scripts/bin, justfile, plans/ADRs/current/task logs and `.agents`. Other changed paths were inspected against the authorized list. |

Before **each** bare browser invocation, executed:

```sh
export PATH=/home/metatron/.bun/bin:$PATH
if env | rg '^(POC001|CHROME_PATH)'; then exit 2; else echo 'POC001_CHROME and all POC001/CHROME_PATH overrides are unset'; fi
just poc-001-test-browser
```

The environment check printed the unset confirmation on both runs; no arguments were passed. The runner selected `/home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell`, the highest executable Playwright version (Chrome `148.0.7778.96`). Each run rebuilt and served through pinned Docker. Each recorded 178 lab + 24 preview + 4570 patrol + 192 record assertions = **4964**; 12 patrol traces / 132 commands. All scripts report zero uncaught exceptions; patrol reports zero failed requests. The lab's two failed requests intentionally test image fallback. Exported build revision is `0ff43d6`.

## Cause and regression checks

- **B1:** independently ran native Healthy → wounded preset → Restart, before actor selection, against a Docker archive of `05bc25c` and the reviewed build. BASE showed actor Ugallu `18/18` while its token had `7/18`, and actor Girtablilu `14/14` while its token had `5/14`. Reviewed labels match tokens for both presets. The reset cache key stayed at revision zero before the fix; clearing `controlsKey` forces fresh controls. Scratch driver `/tmp/rf-review-b1.mjs`, results `/tmp/rf-review-b1-before-ready/b1.json` and `/tmp/rf-review-b1-current/b1.json`.
- **B2:** copied the unchanged candidate regression into a temporary `05bc25c` archive and ran it in Docker. Scout-1 attempt-2's three Warder attacks produce immediate `[8,11,11]`, matching commit, but BASE supplies a second transition with round-2 attacks and Ugallu death. The reviewed regression passes with empty `not-applicable` forecast. The diff changes only the End-phase branch; other forecast equivalence tests pass. Both browser runs repeat those native inputs in the explicit test-owned encounter, verify one Immediate line and no further-phase line, then commit matching state/events.
- **B3:** the same pre-fix run fails all four forfeiture cases: unused 0/1/3 and fallen exclusion. Reviewed cases pass; native Scout-3 Expand → Claw/Impale/Gale → End phase also produces no false forfeiture message. The cause was unconditional text; the fix counts living unacted Brood before resolution.
- **Stationary-pointer Restart:** independently ran the ten-repeat native reproducer against a Docker archive of `e18cd09` and the reviewed build. Before: 0/10 ghosts immediately, **10/10 after two animation frames**, with zero new pointermoves. The trace records layout-generated `pointerenter` on Clockwise after Restart removes selected controls. After: **0/10 ghosts both immediately and after frames**, zero new pointermoves. `pointermove` and `focus` still preview through the full browser suites. Results are `/tmp/rf-review-reset-before/reset-events.json` and `/tmp/rf-review-reset-current/reset-events.json`.

Historical unit command used `bun run --bun test:unit tests/rf-bugs.test.ts` inside Docker: exit 1, five expected regression failures; `/tmp/rf-review-before-bugs.log`. The unmodified reviewed suite passes these five. Initial scratch runs with read-only dependency mounts failed on Vite cache writes, before tests; copying dependencies into scratch resolved this. Initial historical browser servers lacked `POC001_PORT` and exited before serving; corrected Docker servers produced the successful reproductions above. Only the two task-owned diagnostic servers were stopped afterward.

## Criterion 12 probes

All mutations stayed in `/tmp/rf-review-2x3hqhzp`, archived from `0d5fadc`; repository source/tests remained unchanged. Docker mounted that prototype at `/app`, archived assets read-only at `/assets`, and copied dependencies at `/app/node_modules`, with caller UID/GID and temporary HOME. Commands used `bun run --bun test:unit <listed suites>` inside Docker; final boundary run used the image digest from `runtime.env` (earlier scratch runs used the same installed `oven/bun:1.4.2` tag).

| Scratch-only default changes | Suites / result |
| --- | --- |
| Girtablilu healthy HP 14 → 20 | `rf-bugs`, `rf-contracts`: 17/17 pass. |
| Above, plus Claw/Sting 4 → 5, Warder damage 3 → 2, directional reduction 2 → 1, Shelter reduction 2 → 3, splash 2 → 1, Close 2 → 3 | All eight new/edited unit suites: 387/387 pass. |
| Above, plus alternate allowed enemy tiles/facings: Warder `(-1,2)/3`, Censer `(-1,-1)/1`, Harrier `(2,-1)/5` | `rf-bugs`, `rf-contracts`, `preview`: 35/35 pass. Sanctioned exact content assertions in P08 AC1 were excluded from this layout probe. |
| Original layout restored, Close further changed 3 → 1 | 370/387 pass. All new RF tests and all altered RF assertions pass; 17 preserved tests fail in unchanged Shelter/Impale dispatch assertions (10 abilities, 5 patrol, 2 preview). Those call production-default dispatch while assuming Compact eligibility. This inherited dependence is outside the narrowly authorized test changes, not a new frozen RF assertion. |

Logs: `/tmp/rf-review-tuning-hp.log`, `rf-review-tuning-rules.log`, `rf-review-tuning-layout.log`, `rf-review-tuning-close-boundary.log`. The probes sample defaults rather than exhaust all possible tuning combinations. No source or test fix is proposed outside assignment authority.

## Visual evidence and limits

Opened run 1's patrol `healthy-start.png`, `healthy-spread.png`, `wounded-ugallu-start.png`, `wounded-ugallu-spread.png`, `wounded-girtablilu-start.png`, `wounded-girtablilu-spread.png`, and `end-phase-preview.png`; also lab `normal.png`, `fixture-0.png` through `fixture-5.png`, and `ghost-labels.png`. Geometry, radial Spread destinations, enemy tiles/arrows, correct wounded labels, and initial viewport fit are visible. Lab captions, including Girtablilu, are readable. The End-phase screenshot requires scrolling and does not itself expose the preview text; native assertions verify the text. Expanded/preview states may scroll under the follow-up's explicit scope decision.

All required automated checks and image inspection were completed. No human playtest, numeric balance assessment, future ability-specific reach, flank scenario or boss acceptance is claimed. No merge, push, rebase, branch/worktree deletion or protected-document edit performed. Assignment SHA-256 remains `4d8a22a2e93180b56a81b823a2089952b60fb9b07f388761a6981bec3524d4ed`.

Mechanical validation: `/home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/ring-formation/reviewer.md --repo /opt/dev/tehom-brainlab-ring`; exit 0, `ok: true`, empty diagnostics, and all three revision fields resolved. Revalidated after recording the result.
