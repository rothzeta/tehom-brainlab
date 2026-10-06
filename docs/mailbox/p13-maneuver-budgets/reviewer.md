task: P13-P14-review
role: reviewer
worker: p13p14-reviewer
status: complete
outcome: "Pass: no blocking or optional findings in the integrated P13/P14 change."
reviewed_revision: 7904f9f0e13572e103cb5eb0b363e5c9fc54902f
review_baseline: c596d692d6da0779213d10ff9acba7564ccad902
tested_revision: 6ebe1703c94c2bdb404fd3bcdcfa212336a18b7c
artifacts:
  - docs/mailbox/p13-maneuver-budgets/assignment-reviewer.md
  - docs/mailbox/p13-maneuver-budgets/reviewer.md
  - /tmp/p10-browser-OWjgnv
  - /tmp/p13p14-review-4dc2zm9i
blocking_findings: []
optional_findings: []
verification:
  - "just poc-001-install: exit 0; installed 43 pinned packages after missing vitest."
  - "just poc-001-test: exit 0; 16 files, 517 tests; 7460 assertions reported by instrumented suites."
  - "just poc-001-typecheck: exit 0."
  - "just poc-001-build: exit 0; existing large-bundle warning."
  - "just poc-001-test-browser: exit 0; lab 197, preview 24, patrol 4572, records 192 assertions; total 4985; zero uncaught browser exceptions."
  - "bun tests/browser-p14-kit.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p13p14-review-4dc2zm9i/p14-kit http://localhost:4173/ (prototype cwd): exit 0; 51 assertions, three screenshots, zero uncaught browser exceptions."
  - "bun /tmp/p13p14-review-4dc2zm9i/capture.mjs: exit 0; 90 native interleaving/export assertions, zero browser exceptions."
  - "just poc-001-replay /tmp/p13p14-review-4dc2zm9i/interleaving/combined-attempt.json: exit 0; 6 commands, 20 events, revision 6, round 2, player."
  - "just poc-001-replay /tmp/p13p14-review-4dc2zm9i/interleaving/old-v2.json: expected exit 1; unsupported rules version: poc-001-rules-v2/patrol-v2/p07-v1."
  - "just poc-001-replay /tmp/p13p14-review-4dc2zm9i/p14-kit/old-p07.json: expected exit 1; unsupported rules version: poc-001-rules-v3/patrol-v2/p07-v1."
  - "bun run test:unit --testTimeout 30000 (scratch prototype cwd), Shelter default 4 to 5 only: exit 0; 16 files, 517 tests."
  - "bun run test:unit --testTimeout 30000 (scratch prototype cwd), Impale default 6 to 7 only: exit 0; 16 files, 517 tests."
  - "bun /tmp/p13p14-review-4dc2zm9i/control-witness.ts: exit 0; public selector/attack witness confirms defensive value of Crosswind."
  - "git diff --check c596d692d6da0779213d10ff9acba7564ccad902..7904f9f0e13572e103cb5eb0b363e5c9fc54902f: exit 0."
  - "git diff --exit-code 7904f9f0e13572e103cb5eb0b363e5c9fc54902f..HEAD -- poc-001-linked-formation: exit 0 before report commit; tested prototype identical to reviewed revision."
  - "Protected-source and expected-unedited-test comparison reproduced below: exit 0."
  - "Opened and inspected all six required P13/P14 screenshots."
  - "bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p13-maneuver-budgets/reviewer.md --repo /opt/dev/tehom-brainlab-p13r: exit 0; ok true, no diagnostics, all three revision fields resolve."
review:
  - "Pass; no material findings."
discoveries:
  - "No numeric budget default exists to mutate; one same-category use and next-phase refresh are explicit controlled contracts in P13."
  - "The initial sandbox test could not access Docker; after host access the recipe exposed missing dependencies. Both were resolved without source changes."
  - "Initial scratch probes encountered worker-start or test-timeout failures. Final isolated probes passed with normal process access and a supplemental 30-second timeout; required bare recipes passed unchanged."
blockers: []

Author: p13p14-reviewer. Assignment: [assignment-reviewer.md](assignment-reviewer.md), committed unchanged. Verdict: **pass**. There are no blocking findings and no optional findings.

Reviewed the integrated source/test/README changes in `c596d692d6da0779213d10ff9acba7564ccad902..7904f9f0e13572e103cb5eb0b363e5c9fc54902f`, relevant surrounding command, preview, damage, lifecycle, selector, view and record code, and both plans and implementer/integration handoffs. The imported Architect plan edits are out of code-review scope. Tests ran on `6ebe1703c94c2bdb404fd3bcdcfa212336a18b7c`; its prototype is byte-identical to the reviewed implementation. Browser exports identify that tested HEAD. No source or test fix was made, and no merge or push was performed.

Acceptance evidence

| Contract | Observed evidence |
| --- | --- |
| P13.1–3: independent orders, category spend, rejection atomicity/precedence | `maneuver-budgets.test.ts` covers twelve formations, both directions and both orders; checks revision/events, actor preservation and all flag combinations. `commands.test.ts` retains stale, wrong-phase, spent-category and same-shape precedence. |
| P13.4: abilities interleave, early refresh, terminal preservation | Budget tests cover abilities before/between/after both orders and all initial flag combinations at early End phase. Terminal endings retain flags and reject maneuvers. Native phase executed Clockwise → self-Shelter → Expand → Impale → Crosswind → End phase. |
| P13.5: live readouts and P09 equivalence | Unit preview and lab/session tests passed; browser lab/patrol and native probe compare preview states/events to commits. Rotation leaves shape available; both spent and round-two restored readouts were inspected. |
| P13.6 and P14.6: records and compatibility | Native interleaved export reproduces final state and ordered events via pure replay and the bare CLI. Native P14 export also replays inside its browser check. Export rules version is `poc-001-rules-v3/patrol-v2/p14-v1`, envelope version 1. Old core and old kit errors were independently reproduced through CLI. Version checks precede changed state-schema validation. |
| P13.7,10: consumer replacement/documentation | Source and README scan found no `maneuverUsed`; exact record schema requires both booleans. README explains category allowances, `maneuver-used`, rules version and old-record rejection. |
| P13.8 and P14.8: retained regressions/edit scope | All suites pass. Reviewed every existing-test diff against the enumerated exceptions; protected and expected-unedited paths compare unchanged as shown below. |
| P13.9 and P14.9: tuning flexibility | Independently changed Shelter and Impale defaults in scratch; each final full unit run passed all 517 tests. Arithmetic tests use explicit rules; browser checks read current owners/core outcomes. Boolean budget assertions protect the expressly stated controlled cadence rather than copying a numeric tuning default. |
| P14.1,4: attacks, protection, one partner | P14 tests exercise protected Claw/Sting/Impale and bypassing Gale with supplied damage/mitigation; Crosswind changes subsequent Impale protection through the real selector. Existing RF/P07 coverage retains reliable attacks across all formations. One-fallen-partner Impale passes for either partner; Compact/both-fallen rejection and Sting availability remain. |
| P14.2,3: Shelter cast/impact lifecycle | Shared `shelterEligible` serves cast, impact, consumption facts and previews. All twelve self-Shelter formations, supplied reduction/clamping, zero-hit retention, one-hit consumption, phase expiry, no stacking/identity precedence, stretched ally impact and source death pass. Existing P06 regressions remain intact. |
| P14.5: unchanged Crosswind geometry | New clockwise/anticlockwise off-centre tests verify cell preservation, facing, owned turnable-area pivot and unchanged marks/non-turnable/other-source areas. Existing geometry/intention source and tests are unchanged. |
| P14.6,7: UI legality/rules/forecast | Separate browser check verifies self-Shelter, protected Impale and one-partner Impale using native controls, owner-derived rule text, immediate HP and conditional enemy forecast, then committed ability and phase results. Default Shelter amount remains owned by `DEFAULT_DAMAGE_RULES`; content and view consume it. |
| P14.10: baseline/outcome reporting | P14 implementer handoff records all six BASE outcomes; integration handoff documents changed kit outcomes with unchanged enemy tuning/layout. Source comparison confirms patrol content unchanged. Baseline observations were read as prior evidence, not independently rerun here. |

Test-edit audit

- P13 C1–C3, A1, D1, P1 and V1: category flags replace the old shared flag with command-implied values; C2 now accepts the other category and retains spent-category and stale rejection coverage.
- W1: independent second probes restore the committed lab state and compare the other category with the public transition; same-category rejection remains explicit.
- R1: owner-composed v3 version, category-aware loop, retained round boundary and old v1/v2 rejection. RR1: authorized session/export test now records both categories and checks subsequent rejection without record/state/event changes.
- BL1–BL5 and BP1: separate flags/readouts, runtime-derived disabled counts, other-category preview/commit, same-category disabled clicks and drag preservation. Extra screenshot/count bookkeeping is additive evidence.
- P14 K1–K3: supplied-rule protection reduction across six orientations; Compact/both-fallen rejection retained, each one-fallen acceptance added; self rejection replaced by acceptance while the other four target rejections remain. K4 composes the version owners with P13's v3 envelope retained.
- New budget/kit/browser tests and fixture files are additive. No unrelated existing assertion was removed or weakened.

Verification details and limitations

Required recipes ran from the repository root, bare, with normal inherited environment and no hand-set Chrome/toolchain environment or manual build needed by the browser recipe. Docker/Chrome required host access. Initial `just poc-001-test` exited 1 for sandbox Docker access, then exited 127 for missing vitest; `just poc-001-install` resolved dependencies, after which the required checks passed. The independent browser recipe built its own fresh bundle and exited 0 without a PTY. The previously reported shutdown exit 130 did not recur.

Chrome selection: `/home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell`, selected as the highest executable cached Playwright version. Observed browser `HeadlessChrome/148.0.7778.96`. Lab's two deliberate failed image requests test fallback; they are not uncaught exceptions. Unit total is 517 across 16 files, compared with the implementers' recorded BASE of 477 across 14; BASE was not independently rerun. The 7460 instrumented assertions do not include uninstrumented suites. Build warning concerns the existing large JavaScript bundle.

Scratch prototype: `/tmp/p13p14-review-4dc2zm9i/poc-001-linked-formation`, independent source and assets with installed dependencies shared. Each final mutation changes only its named default, with the other restored. Commands were `bun run test:unit --testTimeout 30000` from that scratch prototype; logs `shelter-5-retry.log` and `impale-7.log` record 16/16 files and 517/517 tests passing. No frozen-tuning assertion failure appeared. Initial sandbox attempt (`bun run test:unit`, `shelter-5.log`) exited 1 with 16 worker-start timeouts and no tests; first host attempt (`shelter-5-host.log`) passed 515 tests and timed out two exhaustive P09 cases at five seconds, without an assertion mismatch. The final supplemental timeout accommodates host execution; required bare recipes were not altered. The initial asset symlink was followed by a disposable asset-copy test; repository `ugallu.svg` was restored from exact HEAD bytes, independently copied assets replaced the symlink, and `git diff --exit-code -- assets` verified restoration. No tracked source/test/asset change remains.

`capture.mjs` adapts the existing integration probe only for this worktree, scratch output path and expected documentation-only HEAD. It passed 90 assertions and exported Clockwise/self-Shelter/Expand/Impale/Crosswind/End phase, six commands and 20 events. Disabled second-category-use controls and their `maneuver-used` reasons match the public rejection; accepted abilities preserve maneuver flags, and maneuvers preserve actor actions. All exported events/state agree with replay. The separate control witness was executed against this worktree: with explicit raw hit 9, Brood HP 40 and enemy HP 100, Gale leaves Ugallu 31/Warder 97 while Crosswind pivots the threat away and leaves Ugallu 40/Warder 100. This demonstrates mechanical defensive value at the public selector/attack boundary; the ordinary patrol scheduler does not support that artificial fixed-area fixture as a scheduled enemy phase.

Opened all six requested screenshots: `/tmp/p10-browser-OWjgnv/lab/rotation-shape-available.png`; `interleaving/patrol-both-used.png` and `interleaving/patrol-round-two.png`; `p14-kit/self-shelter-spread.png`, `p14-kit/protected-impale.png`, and `p14-kit/one-partner-impale.png` under `/tmp/p13p14-review-4dc2zm9i`. The lab shows spent rotation with Expand available; patrol shows both used, then both available in round two. Shelter text/eligible preview, protection reduction and one surviving Stretched partner are readable. Numeric screenshot outcomes are observations, not asserted tuning contracts.

Protected comparison executed from repository root, exit 0:

```sh
git diff --exit-code c596d69..7904f9f -- poc-001-linked-formation/src/core/{hex,formation,sectors,intents,lifecycle,commands,smoke}.ts poc-001-linked-formation/src/content/patrol.ts poc-001-linked-formation/src/view/{lab-state,patrol-session,projection}.ts poc-001-linked-formation/src/main.ts poc-001-linked-formation/scripts poc-001-linked-formation/bin poc-001-linked-formation/{package.json,bun.lock,runtime.env,tsconfig.json,vite.config.ts,vitest.config.ts} justfile assets bin scripts poc-001-linked-formation/tests/{formation,intents,patrol-session,rf-bugs,smoke,asset-copy}.test.ts poc-001-linked-formation/tests/browser-{preview,run-record}.mjs poc-001-linked-formation/tests/browser/{fixtures,outcome-fixture,patrol-fixture,rf-fixture}.ts
```

No human playtest, final balance/usefulness judgement, or later boss-content verification is claimed. Two default probes establish the tested tuning variations; they are not proof against every possible future tuning change. No required acceptance area remains unverified within this assignment's scope.

Handoff validation initially needed pinned skill dependencies; `bun install --frozen-lockfile` in `.agents/skills/ruach-handoff` exited 0 and installed only ignored dependencies. After correcting this report's `review` field to the schema's list type, the exact assigned validator command returned `ok: true`, exit 0, with no diagnostics and all revision fields resolved. The report-creating commit is returned in the terminal handoff; it contains only this report and the unchanged assignment.
