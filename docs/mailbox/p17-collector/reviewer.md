task: P17-review
role: reviewer
author: p17-reviewer
status: complete
outcome: "Pass with one optional checklist clarification; no blocking correctness, regression, scope or tuning findings."
baseline: 9abd506351f9726cadd71f5d8fdb46d228f1a1dc
reviewed_revision: 7df00d020119d1c67e85df60d5628ed418cb642c
tested_revision: 7df00d020119d1c67e85df60d5628ed418cb642c
evidence_revision: 64143327c47fabb45fc2262d045000258350fc1a
artifacts:
  - docs/mailbox/p17-collector/assignment-reviewer.md
  - docs/mailbox/p17-collector/reviewer.md
  - p17-review
blocking_findings: []
optional_findings:
  - "O1 (low): docs/plans/2026-10-06-79371edf-poc-001-roaming-boss-and-adds.md:142 asks about next-round restoration after both lab and patrol checks; the lab has Reset lab but no round-advance control. Clarify that next-round restoration applies to patrol and reset applies to the lab."
verification:
  - "just poc-001-install: initial sandbox attempt exit 1 (Docker inaccessible); elevated bare retry exit 0."
  - "just poc-001-test: exit 0; 581 tests in 20 files."
  - "just poc-001-typecheck: exit 0."
  - "just poc-001-build: exit 0; existing large-bundle advisory."
  - "just poc-001-test-browser: two attempts exit 1 (other worker occupied port 4173); final bare attempt exit 0, 4985 assertions and no uncaught exceptions."
  - "Collector browser harness: exit 0, 379 assertions; product victory in round 4."
  - "Production-build manual probes: exit 0, 556 and 73 assertions; owned preview deliberately stopped with exit 130 after checks."
  - "Five bare just poc-001-replay commands: all exit 0; Collector product victory, direct boss victory, corpse relocation, patrol and Crucible."
  - "Seven isolated tuning probes: exit 0 each, 16 Collector tests each; HP, damage, range, facings, route, layout and roster/declaration order."
  - "Controlled comparison and route/ward scripts: exit 0 each; nine replayed comparisons and four eight-round route conditions."
  - "Existing-test preservation, protected-path preservation except the authorized transition condition/comment, successor source equivalence and diff whitespace checks: exit 0."
  - "Handoff validator: initial exit 2 (missing dependencies); skill dependency install exit 1 in the read-only sandbox, then elevated exit 0; validator retry exit 0, ok true."
review:
  - "No material implementation findings. Acceptance criteria and surrounding lifecycle, movement, preview, codec and UI consumers inspected; one optional manual-checklist clarification."
discoveries:
  - "The transition.ts exception changes only the Crucible-or-Collector condition and its comment; configured directional reduction is the only substituted ability-rule value."
  - "Controlled comparisons reproduce the documented favorable Spread routine; they do not establish balance or a universal opening. Subjective assessment remains for the user round."
blockers: []

# P17 independent review

Assignment: [assignment-reviewer.md](assignment-reviewer.md). Reviewed `9abd506351f9726cadd71f5d8fdb46d228f1a1dc..7df00d020119d1c67e85df60d5628ed418cb642c`, against the [P17 contract](../../plans/2026-10-06-79371edf-poc-001-roaming-boss-and-adds.md), [Architect context](../boss-experiments/architect.md) and [Implementer handoff](implementer.md). Executed checks in `/opt/dev/tehom-brainlab-p17r` at `64143327c47fabb45fc2262d045000258350fc1a`; its only difference from the candidate is the Implementer report. `git diff --exit-code 7df00d0..HEAD -- poc-001-linked-formation` exited 0 before this report. Native product exports therefore identify `6414332`; intercepted test-fixture exports explicitly identify `unknown`.

**Verdict: pass with an optional documentation clarification. No blocking findings.** No production code, existing tests, plans or protected documents were modified by this review.

## Findings, ordered by severity

**O1 — low, checklist wording only.** Location: [P17 plan, item 1](../../plans/2026-10-06-79371edf-poc-001-roaming-boss-and-adds.md#combined-manual-test-checklist-user-round-after-p17), line 142. After asking for both maneuver orders in the lab and patrol, the item asks whether both allowances return “next round.” A reader applying that clause to the lab cannot complete it: [FormationLab.ts:31](../../../poc-001-linked-formation/src/view/FormationLab.ts#L31) offers Reset lab, and [lab-state.ts:73](../../../poc-001-linked-formation/src/view/lab-state.ts#L73) resets the session; there is no round-advance control. The independent browser probe confirmed `#end-phase` is absent, both orders spend both allowances, and Reset lab restores them. The same probe confirmed patrol restores both at the next round. Suggested direction: the Coordinator can qualify the next-round question as patrol-only and ask about Reset lab separately. This is preexisting plan wording within the assigned checklist review, not a Collector implementation defect; no feature change is required.

## Acceptance evidence

| Criterion | Observed evidence |
| --- | --- |
| 1 — composition and movement | Factory uses exported layout/order; three distinct off-centre enemies, empty centre, only the boss mobile. Unit and browser traces preserve stationary add cells through relocation. |
| 2 — committed local sweep and Crosswind | Exhaustive unit coverage over route origins, formations, facings and a casualty compares actual-tile coverage and tie order. Maneuvers preserve declarations; source-selected Crosswind turns the sweep about the boss tile without movement. |
| 3 — ward range and exposure | Inclusive source-to-target range, missing-range compatibility, bypass and fallen/missing-source precedence tested. Product round 1 shows out-of-range (3/2), round 2 in range (2/2); previews show destination support. Controlled formation comparisons use selector geometry. |
| 4 — add deaths and immediate victory | Censer death removes splash; Warder death removes support. Direct `applyAbility` boss death wins in lifecycle, retains add HP and emits no add deaths or later attacks. Browser victory disables enemy tokens and End phase; terminal export replays through the CLI. |
| 5 — no spawns and reliable access | Enemy count remains invariant through rounds; every living Brood's reliable attack stays legal on all living enemies across formations and single casualties. |
| 6 — old encounters and exact records | Unchanged patrol/Crucible suites pass. Real routes, presets and reset checked; both existing encounters' native exports replay via the CLI. Collector exports cover turns, relocation, ward reduction, corpse reuse and victory. |
| 7 — controlled comparisons | Nine two-round hold/clockwise/expand × boss/Warder/Censer-first traces rerun against this worktree; each record replayed exactly. Summary below records consequences without claiming tactical diversity. |
| 8 — tuning | Seven independently changed scratch copies each pass all 16 Collector tests. Assertions use exported product inputs or explicit controlled fixtures; mutation details below. |
| 9 — unchanged regression tests | `git diff --name-only --diff-filter=MDR 9abd506..7df00d0 -- poc-001-linked-formation/tests` exited 0 with no output: four files added, none edited/deleted/renamed. Full suite passes 581 tests, including the existing 565. |

The protected-path comparison exited 0 over the plan's protected core/content/view files, scripts, wrappers, dependencies, configs, justfile, assets and canonical documents, excluding the expressly authorized `transition.ts`. That file's complete diff is only the condition at [transition.ts:19](../../../poc-001-linked-formation/src/core/transition.ts#L19) and its comment. The controlled reduction-1 test and browser export verify live commands, immediate preview, record configuration and replay agree. All other P14 ability defaults and patrol dispatch remain as before.

P09 evidence includes every legal command/forecast over controlled route slots and formations, end-phase preview equality, no input mutation, ward changes, Shelter consumption and terminal victory. No generic reach, party-following sweep, spawning, phase-two Collector mechanic or unrelated refactor was added.

## Executed verification

All `just` recipes ran bare from the repository root, without hand-set environment variables or a Chrome override. Docker/Chrome/worker IPC required sandbox escalation. The browser recipe selected `/home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell` because it was the highest executable Playwright version. Every browser attempt built its own fresh production bundle.

| Command | Exit | Result |
| --- | ---: | --- |
| `just poc-001-install` | 1, then 0 | Sandbox Docker denial, then successful elevated frozen install. |
| `just poc-001-test` | 0 | 581/581 tests, 20/20 files. |
| `just poc-001-typecheck` | 0 | TypeScript passed. |
| `just poc-001-build` | 0 | Production bundle built; existing bundle-size advisory. |
| `just poc-001-test-browser` | 1, 1, 0 | First two attempts could not bind port 4173 (nested preview exit 125). Waited for the other worker; stopped none of its processes. Final result: lab 197 + preview 24 + patrol 4572 + records 192 = 4985 assertions, no uncaught exceptions; `/tmp/p10-browser-G2HFws`. |
| `python3 /tmp/p17-review-browser-checks.py` | 0 | Owned preview; Collector 379 assertions, manual mechanics 556, real Warder-first corpse trace 73. Every child harness exited 0. Preview shutdown intentionally returned 130 after success. |
| `python3 /tmp/p17-review-probes.py` | 0 | Seven isolated mutation runs, all child exits 0. |
| `bun /tmp/p17-review-comparison.ts` | 0 | Nine controlled comparisons, all records replayed. |
| `bun /tmp/p17-review-route-ward.ts` | 0 | Four eight-round route conditions and all 12 formation/front combinations. |
| `git diff --check 9abd506..7df00d0` | 0 | No whitespace defects. |

The Collector child command, run from the prototype directory, was `bun tests/browser-collector.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p17-review-browser/collector http://localhost:4173/`. Supplemental manual drivers were reviewed copies of the Implementer's disposable drivers with imports redirected to this worktree; the reviewer added real lab/both-order checks and patrol restoration checks. Exact child commands/results are in `/tmp/p17-review-browser/checks.json`; each driver uses ordinary production routes, not intercepted states. The Collector harness separately uses explicit fixtures for diagnostic cases.

Five CLI commands ran from the repository root, all exit **0**: `just poc-001-replay /tmp/p17-review-browser/collector/FILE`, with:

| FILE | Commands | Events | Round / outcome |
| --- | ---: | ---: | --- |
| `product-playthrough.json` | 18 | 71 | 4 / victory |
| `boss-victory.json` | 1 | 7 | 1 / victory |
| `corpse-relocation.json` | 1 | 12 | 2 / player |
| `patrol.json` | 2 | 11 | 2 / player |
| `crucible.json` | 2 | 8 | 2 / player |

Opened and inspected all six required screenshot types from `/tmp/p17-review-browser/collector`: `collector-start.png`, `collector-round-two.png`, `end-destination-preview.png`, `corpse-after.png`, `victory-adds-disabled.png`, `collector-placeholder.png`. Actual placements, support labels, ghost destination and disabled surviving adds agree with the core; living boss receives pointer selection above the corpse. Product Warder-first trace separately reaches the Warder's original `(-2,1)` tile in round 3.

## Tuning and comparison probes

Fresh copies under `/tmp/p17-review-probes/` changed only the named scratch inputs; tests were copied unchanged, with installed dependencies linked. Each ran `bun run --bun test:unit tests/collector.test.ts`: exit **0**, 16/16 tests.

| Probe | Scratch change |
| --- | --- |
| HP | Boss/Warder/Censer 36/10/10 → 53/17/23. |
| Damage | Warder/Censer/sweep 2/3/5 → 0/7/9. |
| Support range | 2 → 0. |
| Facings | Both initial 0 facings → 3; Warder 4 → 1. |
| Route | Reverse the exported six-slot order, rather than merely rotate its starting index. |
| Layout | Boss `(2,-1)`, Warder `(-1,2)`, Censer `(-1,-1)`. |
| Composition order | Reverse the default roster/declaration order to Collector/Censer/Warder. Membership remains the three entities required by the current user direction; living/dead add subsets are independently covered by lifecycle/route tests. |

None of these probes broke tests for incidental tuning. Different add archetypes/counts were not invented: the current contract requires the Collector, Warder and Censer at start. This evidence covers the bounded tunable inputs and ordering, not arbitrary future encounter designs.

The comparison scripts use explicit test-owned HP/damage/range and are independent of product pacing. Holding incurred 42/38/24 total damage for boss/Warder/Censer-first; clockwise rotation incurred the same totals but redistributed HP and changed frontal mitigation; expanding incurred 15/11/9. Boss-first deals more objective damage, Censer-first reduces incoming splash, and Warder-first removes guard and opens its corpse tile. Route probes reproduce the documented two-slot oscillation with Warder alive, the next oscillation with only Censer alive, and the six-slot circuit with both adds fallen. These are sampled consequences, not evidence of a universal opening or satisfying balance.

## Manual-checklist readiness and limits

The production browser probes exercised both maneuver orders in the lab, both spent readouts, lab reset, and patrol round restoration; Spread self-Shelter; frontal/outside Impale (reduction 2 versus 0); Impale with Ugallu fallen; Shelter and Crosswind in all three encounters; Crucible threshold/pending indicator with unchanged current declarations followed by phase two, pulse/fork and boss turns; Collector preview, ward switching, add-first corpse movement and terminal controls. O1 is the only wording clarification. The subjective questions about routines, useful decisions and next design priority remain for the user's round; this review does not supply human playtest conclusions.

Assignment SHA-256 remains `87b6240f89e8f73d9101b3eddc7627aa0928246cc057904ffacb89a08d70e2ee`. Mechanical handoff validation: `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p17-collector/reviewer.md --repo /opt/dev/tehom-brainlab-p17r`, initial exit **2** because dependencies were missing. `bun install --frozen-lockfile` in the skill directory exited **1** in the read-only sandbox, then **0** with escalation; no pinned source/lockfile changed. Validator retry exited **0**, `ok: true`. The report commit contains only this report and the unchanged assignment; no merge or push performed.
