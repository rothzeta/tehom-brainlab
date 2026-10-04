task: P09-impl
status: complete
outcome: Immutable combat previews and conditional forecasts use real transitions; all seven P09 criteria verified.
candidate_revision: 63b567ba2b92262624c6cb4cf6332091b7009dea
tested_revision: 63b567ba2b92262624c6cb4cf6332091b7009dea
baseline: '35586e8'
artifacts:
  - docs/mailbox/p09-preview-equivalence/implementer.md
  - docs/mailbox/p09-preview-equivalence/assignment-implementer.md
  - docs/mailbox/p09-preview-equivalence/browser-evidence.json
  - docs/mailbox/p09-preview-equivalence/preview.png
  - docs/mailbox/p09-preview-equivalence/commit.png
  - poc-001-linked-formation/src/core/preview.ts
  - poc-001-linked-formation/src/view/lab-state.ts
  - poc-001-linked-formation/src/view/FormationLab.ts
  - poc-001-linked-formation/tests/preview.test.ts
  - poc-001-linked-formation/tests/browser-preview.mjs
  - poc-001-linked-formation/README.md
verification:
  - "Focused Docker suite: exit 0, 139 tests in 3 files, including 14 P09 cases."
  - "Full Docker suite: exit 0, 427 tests in 10 files; typecheck and build exit 0."
  - "Browser: unchanged P04 probe exit 0, 177 assertions; additive P09 probe exit 0, 24 assertions; zero uncaught exceptions."
  - "Equivalence matrix: 972 command/state comparisons, 666 accepted and 306 rejected, each preview repeated."
  - "Handoff validator: exit 0, ok true, three revision references resolved, no diagnostics."
  - "Whitespace and BASE checks: exit 0; all 11 existing test files and 13 existing core files unchanged."
review: not-run
discoveries:
  - "P10 can consume the projection and confirmPreview boundary; synthetic fixed areas remain non-patrol fixtures because P08 rejects them."
  - "The P09 browser fixture scrolls to the conditional summary; the default P04 layout still passes its 1280x800 fit checks."
blockers: []

Author: P09 Implementer. Worktree `/opt/dev/tehom-brainlab-p09`, branch `p09-preview-equivalence`. BASE matches the assignment and starting revision. Authority: unchanged [assignment](assignment-implementer.md), [P09 plan](../../plans/2026-10-02-d28ae958-poc-001-preview-equivalence.md), [ownership table](../../plans/README.md#ownership-of-provisional-defaults), [consumer policy](../../../.agents/policy.md), [ADR-0006](../../adr/0006-contract-invariants-and-black-box-testing.md), [testing skill](../../../.agents/skills/ruach-testing/SKILL.md), and [handoff skill](../../../.agents/skills/ruach-handoff/SKILL.md). P04/P07/P08 handoffs and the existing implementations/tests were inspected before editing.

Technical candidate and tested revision are identical. This report, unchanged assignment and retained browser evidence are committed in a later evidence-only commit; its creating SHA is returned in the terminal handoff. No technical change followed final checks. No merge, push, rebase, branch/worktree deletion, independent review, Coordinator acceptance or human playtest occurred.

## Changes and checkpoints

| File | Result |
| --- | --- |
| [core/preview.ts](../../../poc-001-linked-formation/src/core/preview.ts) | C1/C2: clone plain snapshots/commands, run `applyCommand`, return deeply frozen immediate state/events or unchanged rejection; derive positions, active links, protection, Shelter eligibility, area/mark recipients, per-ability/target/direction legality, HP/status deltas and actual event explanations. Run real patrol `endPhase` on a separate candidate copy. No damage formula or alternate resolution. |
| [view/lab-state.ts](../../../poc-001-linked-formation/src/view/lab-state.ts) | C4: pending maneuvers consume the core projection; optional snapshot factory preserves default P04 behavior. Generation increments on reset/fresh fixture. New `confirmPreview` validates generation/revision and submits the original command; accepted commands clear pending previews. Existing `commit` retains its result type and also checks pending validity. |
| [view/FormationLab.ts](../../../poc-001-linked-formation/src/view/FormationLab.ts) | Bounded `?preview=patrol` fixture uses the existing maneuver controls and shows immediate HP, destination links, protection changes, distinct mark/area recipient descriptions, enabled/disabled abilities and conditional HP/phase. Default formation-only layout remains unchanged. Full combat controls remain P10. |
| [preview.test.ts](../../../poc-001-linked-formation/tests/preview.test.ts) | C3/C4: 14 new public-boundary cases, command matrix, rejection/state boundaries, independent geometry/impact fixtures, repeated frozen-input checks, output ownership/immutability, forecast failure/defeat/victory and stale-session confirmations. |
| [browser-preview.mjs](../../../poc-001-linked-formation/tests/browser-preview.mjs) | Additive Chrome probe over the production build: independent real transition expectations, native hover/click, keyboard focus, cancel/reset, preview/commit captures and forecast invalidation. |
| [README P09 section](../../../poc-001-linked-formation/README.md#preview-equivalence-p09) | Public contracts, resolved defaults, lab fixture and verification instructions. Only P09 prose added. |

Existing P01–P08 tests, two-ring tests and `browser-lab.mjs` were preserved byte-for-byte. All existing core files, packages/lockfile, assets, generated agent sources, protected documents, plans/index, ADRs and brief remain unchanged. Type changes outside assigned files were unnecessary. Disposable files and Chrome profiles stayed in `/tmp`; only selected durable evidence was copied into the mailbox.

## Explicit provisional-default resolutions

| Decision / value | Source and reason |
| --- | --- |
| Preview projection: isolated `structuredClone` of snapshot and original command, real `applyCommand`, selector-derived before/after facts, recursively frozen output | P09 Proposed implementation and required contracts. Adopted to guarantee transition/rejection equivalence and prevent reference-sharing mutation. Uses P02 geometry, P05 selectors and P07 legality. HP/status comparisons summarize results without calculating damage. |
| Conditional forecast: literal `If end phase now`, real `endPhase` on another candidate copy; `kind:'transition'` with complete real result, plus `enemyEvents` excluding next-round announcement/round-start | P09 C2/AC5 and P08 public transition. Separates immediate events from conditional resolution and exposes actual HP/terminal result without simulating remaining player choices. |
| Terminal forecast: `kind:'terminal'`, empty events; non-patrol forecast: `kind:'unavailable'`, empty events; invalid end-phase forecast: explicit failed result/error with empty events | P09 terminal contract and actual P03/P08 capability boundary. No fabricated fallback resolution for basic lab, plain combat or unsupported synthetic patrol declarations. |
| Stale handling: UI-held monotonically increasing integer generation on reset/fresh fixture, command's original expected revision, generation-first validity rejection | P09 Proposed implementation / C4 / AC6. Revision catches another accepted action; generation catches previous reset at the same revision. Adapter exposes `stale-session` or `stale-revision`, with no live effects. |
| Confirmation: rerun stored original command against live state; never assign cached candidate; cancellation clears pending maneuver only | P09 required contracts and P04 semantics. Core revalidates legality, revision and budgets, and live events exist only on real submission. Brood inspection remains independent. |
| Browser fixture: opt-in healthy patrol, existing maneuvers only, textual summary below the board | P09 verification asks for an actual preview/commit pair and condition label; P10 owns full combat controls. Minimizes changes to P04 and keeps its existing browser regression unedited. Healthy HP/tuning remains owned by P08, and no P09 balance constant is introduced. |

Patrol recipient/link facts consume stored P08 radius/threshold; Shelter eligibility consumes stored damage threshold. Ability legality consumes the same default rules used by dispatcher abilities. Protection facts describe ordinary non-bypassing attacks; each ability's actual bypass effects remain in the real immediate transition. Synthetic Crosswind areas are tested on plain CombatState, with no patrol forecast; P08 intentionally accepts its ordinary marked patrol declarations only.

## Acceptance evidence (all seven criteria)

| # | Observable evidence |
| --- | --- |
| 1 | `compares every maneuver and ability/target/direction...` runs all twelve formations for healthy and both wounded presets. For each command, compares `ok`, exact immediate state/events, and rejection error with an independent `applyCommand` on a separate copy. Matrix includes all six owner abilities, every allied/enemy target, both Crosswind directions, four maneuvers, an explicit attack and `endPhase`. 324 comparisons per preset: 222 accepted, 102 rejected; totals 972 / 666 / 306. Additional fixtures cover spent/fallen/terminal states. |
| 2 | Matrix recursively freezes live input and command; repeated previews/forecasts leave serialized live bytes unchanged. `owns deeply immutable results...` recursively checks all returned objects, confirms live input is not frozen, and mutates input statuses/command recipients without altering cached output. `cancellation never spends budgets...` and terminal repetition preserve frozen live snapshots through cancellation. |
| 3 | `Shelter then expansion...` actually installs Shelter, then uses explicit Warder raw damage 5, Shelter reduction 2, Close threshold 2 and HP20. Compact impact gives damage3/HP17; expanded forecast gives damage5/HP15 and ineligible Shelter. `a Warder kill...` uses explicit HP2/raw2, removes protection, emits cancellation of its pending intention, and forecasts no Warder attack. |
| 4 | Explicit Spread0 destinations are Ugallu `(2,0)`, Girtablilu `(-2,2)`, Pazuzu `(0,-2)`; expansion enables Impale, previously `illegal-ability`, and real commit validates the enabled request. Crosswind clockwise turns Warder0→1, loses protection, turns area `(2,0)`→`(0,2)` with no recipient; a nonturnable area and mark stay at `(2,0)` with Ugallu. A fallen Girtablilu splash mark returns no cells/recipients and `target-fallen`, never retargets, and its actor abilities are illegal. |
| 5 | Every transition forecast in the matrix equals independently ending from the immediate candidate, including full events/state. Its label is exactly `If end phase now`; enemy summary excludes next-round announcements. Explicit end-now defeat is tested while player actions remain unused; an invalid rule produces failed forecast/empty events. Browser independently computes real commit/endPhase and compares displayed immediate/forecast HP and phase plus the excluded-choices disclosure. |
| 6 | Rejected previews have matching core error and empty events, with no projection/forecast. Adapter tests save a handle, submit another accepted command, then reject it as `stale-revision`; reset to revision0 or select a fresh fixture rejects it as `stale-session`. State/events stay unchanged on invalid confirmations. Native browser commit/cancel/reset clears cached forecast. |
| 7 | Explicit final Warder kill shows victory and `kind:'terminal'` with no forecast events. Five repeated previews plus cancellation preserve live bytes; one confirmation produces exactly one combat-ended event, and repeated confirmation rejects with empty events. No audio consumer exists at this milestone, and preview has no event-delivery callback. This proves no duplicate live transitions/events, not a test of a future audio subsystem. |

## Final candidate verification

All application install/test/typecheck/build/preview commands used default Docker mode, pinned Bun1.4.2; no host application-mode fallback occurred. Browser probes and the skill validator use host Bun as their existing standalone tooling requires. Docker, Chrome execution and linked-worktree Git metadata writes received sandbox escalation; no automatic approval rejection occurred.

| Exact command | Exit / result |
| --- | --- |
| `just poc-001-install` | 0 before implementation; 43 packages, frozen lockfile unchanged. |
| `just poc-001-test tests/preview.test.ts tests/patrol.test.ts tests/intents.test.ts` | 0 on candidate; 139 tests, 3 files: preview14, patrol48, intents77. Matrix logged 324/222/102 for each preset. |
| `just poc-001-test` | 0 on candidate; 427 tests, 10 files: preview14, patrol48, abilities87, damage48, intents77, commands37, formation92, view19, assets3, smoke2. |
| `just poc-001-typecheck` | 0 on candidate; strict source/test check. |
| `just poc-001-build` | 0 on candidate; 9 prepared assets, 23 transformed modules; JS1,408.69kB/gzip368.29kB, CSS3.21kB/gzip1.27kB. Existing >500kB bundle warning remains. |
| `just poc-001-preview` | Docker server ready on localhost:4173. It remained running through final rebuild; both final browser probes disabled cache. |
| `/home/metatron/.bun/bin/bun poc-001-linked-formation/tests/browser-lab.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p09-p04-browser-final` | 0 on final build; HeadlessChrome148.0.7778.96, 1280×800; 177 assertions, 12 fixtures, 3 modes, 18 captures, zero uncaught exceptions and two deliberately blocked image requests. |
| `/home/metatron/.bun/bin/bun poc-001-linked-formation/tests/browser-preview.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p09-browser-final` | 0 on final build; same Chrome/version/viewport; 24 assertions, two full-page captures, zero uncaught exceptions. |
| `git diff --check` | 0 on candidate; repeated for report successor. |
| `git diff --check 35586e8..HEAD` | 0 on candidate; repeated for report successor. |
| Unedited-tests and protected-scope script below | 0 on candidate; 11 existing test files including `.gitkeep`/browser probe are byte-identical to BASE; 13 existing core files and protected paths unchanged. |
| `sha256sum docs/mailbox/p09-preview-equivalence/assignment-implementer.md` | 0; unchanged `8d618cb64ca55583db390900ea679b07eb10a0f64522a34f13fbf538fbd95986`, matching initial read. |
| `/home/metatron/.bun/bin/bun install --frozen-lockfile` in `.agents/skills/ruach-handoff` | 0; six locked packages installed into ignored node_modules; generated sources/lockfile unchanged. |
| `/home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p09-preview-equivalence/implementer.md --repo /opt/dev/tehom-brainlab-p09` | 0; `ok:true`, candidate/tested/BASE revisions resolved, no diagnostics. |

Exact BASE verification script (invoked with `python3 - <<'PY'`, exit0):

```python
import pathlib, subprocess
base='35586e8'
def paths(directory):
    return subprocess.check_output(['git','ls-tree','-r','--name-only',base,'--',directory],text=True).splitlines()
tests=paths('poc-001-linked-formation/tests')
subprocess.run(['git','diff','--exit-code',base,'HEAD','--',*tests],check=True)
for path in tests:
    assert pathlib.Path(path).read_bytes()==subprocess.check_output(['git','show',f'{base}:{path}']), path
print(f'Unedited-tests check: {len(tests)} existing files byte-identical to BASE, including browser-lab.mjs')
owned_core=paths('poc-001-linked-formation/src/core')
subprocess.run(['git','diff','--exit-code',base,'HEAD','--',*owned_core,'assets','.agents','docs/CURRENT.md','docs/TASK_LOGS.md','docs/plans','docs/adr','docs/prototypes'],check=True)
print(f'Scope check: {len(owned_core)} existing core files and protected paths unchanged')
```

[Browser evidence](browser-evidence.json) retains actual candidate-specific DOM preview/commit snapshots and browser counts/version. Both final [preview](preview.png) and [commit](commit.png) images were opened and visually inspected by the Implementer. Ghost destinations match committed anchors; the condition, HP and change descriptions are legible. The patrol summary extends below the initial viewport and intentionally scrolls; the unchanged default P04 probe still proves its original viewport fit. Chrome ran with its sandbox enabled and temporary profiles, without safeguard-bypass flags. Raw Chrome stderr, extra P04 captures and temporary browser outputs remain outside Git.

Initial handoff validation exit1 interpreted the unquoted BASE abbreviation `35586e8` as a YAML number; quoting it restored the revision-string contract.

Precommit iterations: initial typecheck exit1 found generic forecast-result casting and adapter rejection-union typing issues; corrected before the final candidate. Subsequent focused suite/typecheck and draft P04/P09 browser probes passed. No behavior test or existing expectation was weakened. Final checks above are the candidate verification claims.

## Limits and Coordinator hand-back

Task-owned preview server stopped with Ctrl-C (exit130). `docker ps --filter publish=4173 --format '{{.ID}} {{.Ports}}'` exited0 with no containers. No blockers. P10 remains responsible for full combat controls, integrated display and future audio/event delivery. This milestone does not establish balance, tactical interest, mobile support, a browser matrix, human playtest, independent review or acceptance. Synthetic area rendering is covered at the public projection boundary; the browser fixture exercises ordinary patrol marks. Ordinary ability commits are covered headlessly; the actual native browser preview/commit pair is a maneuver.

Protected-document proposals after acceptance: update P09 plan/index status and CURRENT/TASK_LOGS from this handoff, keeping provisional choices distinct from balance claims. Older README introduction/P03 passages still describe combat as pending; the assigned P09 section documents the current preview boundary without changing those unrelated passages. No protected-document correction was made.
