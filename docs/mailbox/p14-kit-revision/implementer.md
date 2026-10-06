task: "P14-kit-revision"
role: "implementer"
status: "complete"
outcome: "P14 implemented and verified at final candidate: self/Close one-hit Shelter, no stacking, protected one-partner Impale, shared preview eligibility and rule summaries."
baseline: "c596d692d6da0779213d10ff9acba7564ccad902"
candidate_revision: "a6cc85b218742965ae022918a80ce3ed71bce830"
tested_revision: "a6cc85b218742965ae022918a80ce3ed71bce830"
artifacts: ["docs/mailbox/p14-kit-revision/implementer.md", "docs/mailbox/p14-kit-revision/assignment-implementer.md", "p14-kit-revision"]
changed_paths: ["docs/mailbox/p14-kit-revision/assignment-implementer.md", "poc-001-linked-formation/README.md", "poc-001-linked-formation/src/content/brood.ts", "poc-001-linked-formation/src/core/abilities.ts", "poc-001-linked-formation/src/core/damage.ts", "poc-001-linked-formation/src/core/preview.ts", "poc-001-linked-formation/src/view/CombatScene.ts", "poc-001-linked-formation/tests/abilities.test.ts", "poc-001-linked-formation/tests/browser-p14-kit.mjs", "poc-001-linked-formation/tests/browser/p14-fixture.ts", "poc-001-linked-formation/tests/browser/p14-fixtures.ts", "poc-001-linked-formation/tests/p14-kit.test.ts", "poc-001-linked-formation/tests/rf-contracts.test.ts", "docs/mailbox/p14-kit-revision/implementer.md"]
verification: ["just poc-001-test: exit 0; 15 files / 500 tests (BASE 14 / 477).", "just poc-001-typecheck: exit 0.", "just poc-001-build: exit 0; existing large-bundle warning.", "just poc-001-test-browser: exit 0 with a PTY; 4 unchanged scripts / 4964 assertions (lab 178, preview 24, patrol 4570, records 192). A prior run at this SHA passed every suite but exited130 during preview shutdown; the bare PTY rerun completed cleanly.", "bun tests/browser-p14-kit.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p14-kit-evidence/final-browser http://localhost:4173/: exit 0; 51 assertions / 3 screenshots, all visually inspected.", "just poc-001-replay /tmp/p14-kit-evidence/final-browser/revised-kit.json: exit 0; 3 commands / 14 events / revision 3 / round 2 / player; build stamped with tested_revision.", "just poc-001-replay /tmp/p14-kit-evidence/final-browser/old-p07.json: expected exit 1; explicit unsupported rules version poc-001-rules-v2/patrol-v2/p07-v1.", "git diff --check c596d692d6da0779213d10ff9acba7564ccad902..HEAD: exit 0.", "git diff --exit-code c596d692d6da0779213d10ff9acba7564ccad902..HEAD -- <protected paths listed below>: exit 0.", "bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p14-kit-revision/implementer.md --repo /opt/dev/tehom-brainlab-p14: exit 0; ok: true; baseline/candidate/tested revisions resolve."]
review: "not-run"
test_edits: ["K1: protection-reduced Impale in all six orientations using supplied rules.", "K2: retain Compact/both-fallen rejection; new acceptance coverage for either one fallen partner.", "K3: retain four allied-target rejections; new self-Shelter acceptance/impact coverage.", "K4: compose PATROL_VERSION and BROOD_RULES_VERSION; retain v2 envelope until P13 integration.", "Additive P14 unit/browser tests and two test-owned fixture files; other existing tests unchanged."]
discoveries: ["P13 is absent: this branch composes v2/patrol-v2/p14-v1. Preserve P13 v3 during integration in K4 and the README version row.", "Shelter now changes patrol mitigation through the existing default owner; no enemy retuning.", "Assignment report location p14-kit-revision supersedes the plan's p14-tactical-kit-revision spelling.", "Control witness at the public attack boundary avoids a turnable area; ordinary patrol scheduler still accepts its marked-intention kinds only.", "One non-PTY final-candidate browser run returned exit 130 after all 4 scripts reported success; same bare recipe with a PTY exited 0. Shutdown cause unconfirmed; no runner/source changes made."]
blockers: []

Author: p14-implementer. Assignment: [assignment-implementer.md](assignment-implementer.md). Contract: [P14](../../plans/2026-10-06-6a0ebcdc-poc-001-tactical-kit-revision.md). Assignment unchanged; report location follows the assignment rather than the plan's older `p14-tactical-kit-revision` spelling. Branch `p14-kit-revision`; no merge or push.

Implementation gives Shelter one shared eligibility function for cast, impact and preview: living self works without a link; an ally must be Close. The one-hit lifecycle stays intact, and duplicate casts reject `illegal-target` after identity collision validation. Impale requires at least one living partner with all active partner links Stretched and respects directional protection. Claw/Sting/Gale and Crosswind effects keep their previous rules. Content owns nonnumeric summaries; the scene reads content damage and live patrol Shelter rules and shows mitigation/facing events in previews. The kit version is `p14-v1`.

Changed paths are listed in the leading block. No generated shared resources, protected runtime components, encounter tuning/layout, plans, ADRs, brief, CURRENT or TASK_LOGS were edited.

BASE evidence (P14.C1)

Executed before editing at `c596d692d6da0779213d10ff9acba7564ccad902`: `just poc-001-install` (exit 0 after missing dependencies), `just poc-001-test` (exit 0; 14 files / 477 tests), and `/home/metatron/.bun/bin/bun /tmp/p14-kit-evidence/baseline.ts` (exit 0). The disposable script and raw output remain under `/tmp/p14-kit-evidence/`; this report preserves their useful evidence.

Controlled state: player phase, revision 0, no spent actions/maneuver, Brood HP/max HP 20, guard and target HP/max HP 40 at `(0,0)`, guard facing 2, guard protects target, no intentions or existing effects. Each ability starts independently from this state, Spread0 for attacks/Crosswind, Compact0 for the legal allied Shelter cast, with production defaults at BASE. These are artificial inputs, not patrol tuning.

| BASE ability | Executed outcome |
| --- | --- |
| Claw / Ugallu → target | Target 40 → 36; raw 4, no directional reduction at Ugallu's current cell. |
| Shelter / Ugallu → Girtablilu | One Shelter installed. Follow-up guard raw hit 9: Girtablilu 20 → 13; Shelter reduction 2; consumed once. Self cast in Spread rejected `illegal-target`. |
| Sting / Girtablilu → target | Target 40 → 38; raw 4, directional reduction 2. |
| Impale / Girtablilu → target | Target 40 → 34; raw 6, bypass gave directional reduction 0. |
| Gale / Pazuzu → target | Target 40 → 37; raw 3, directional reduction 0. |
| Crosswind / Pazuzu → guard, clockwise | Facing 2 → 3; cells and HP unchanged; no turnable areas in this baseline fixture. |

BASE source confirmed `isCloseLinked` rejects self, every positive hit consumes its target's Shelters, zero hits preserve them, and lifecycle removes/ expires effects. P14 reused those consumption and lifecycle paths.

Existing-test edits (enumerated exception)

- K1, `tests/abilities.test.ts`: all six protected Spread orientations now assert `impaleDamage − directionalReduction` with the supplied `rules`; events carry that same supplied reduction.
- K2, same file: retain Compact and both-fallen rejections. Ugallu-fallen/Pazuzu-fallen acceptance moved to new `tests/p14-kit.test.ts`, with real immediate/end-phase preview equivalence and Sting availability.
- K3, same file: remove self from obsolete rejection parameters; the other four remain. New self-Shelter tests cover all twelve formations, zero-hit preservation, clamping, one-hit consumption and phase expiry.
- K4, `tests/rf-contracts.test.ts`: compose patrol/brood version segments from `PATROL_VERSION`/`BROOD_RULES_VERSION` while retaining the baseline v2 semantic envelope. P13 must retain its v3 envelope during integration.
- Additive coverage only: `tests/p14-kit.test.ts`, `tests/browser-p14-kit.mjs`, `tests/browser/p14-fixtures.ts`, `tests/browser/p14-fixture.ts`. No other existing assertions or browser suites changed. The browser test is run separately because the existing runner is protected by P14.

New arithmetic tests supply independent explicit damage/mitigation values (8/9/11/7, reductions 3/5). Default-based browser assertions read `ABILITIES`, `DEFAULT_ABILITY_RULES` and the encounter rules. No new/edited assertion freezes provisional damage, Shelter reduction, patrol HP, cells or facings. Explicit off-centre test coordinates protect the required pivot transform.

The first working-tree run found two errors in newly authored tests (a wrong lifecycle event shape and a turn direction that retained protection); both were corrected after inspecting their public results. Typecheck also found a wrong new preview parameter type, corrected to its numeric session-generation contract. Expected-unedited suites passed throughout. The first additive browser fixture omitted UTF-8 metadata, causing its text assertion to fail; the corrected test document matches existing fixture conventions and stores selection diagnostics in scratch. No production rule was changed to accommodate these test failures.

Observable patrol evidence and limitations

- Self-Shelter screenshot: ordinary healthy playable patrol, Expand to Spread0, select Ugallu / Shelter / Ugallu. Allies show `illegal-target`, self and confirmation enabled, rule line reads the runtime reduction, immediate preview reports `ugallu → ugallu: eligible`. Forecast and committed enemy phase agree: Warder's raw 3 is fully absorbed and consumes Shelter; Harrier's later isolated hit 7 still applies. Ugallu finishes 11/18 instead of 8/18 in the matching unsheltered Spread opening. These numbers describe observed defaults, not frozen assertions.
- Protected Impale screenshot: test-owned Spread formation chosen through the real selector using ordinary patrol tuning/layout. Censer live HP 10, preview HP 6, explicit `4 damage; protection −2`. Confirmation and following end phase match the core preview.
- One-partner screenshot: the same patrol fixture with Ugallu fallen and marks reannounced. Only Girtablilu–Pazuzu's Stretched link remains; Impale and its confirmation stay enabled. The protected hit and forecast agree with resolution. A lone Girtablilu retains Sting and rejects Impale (retained K2 regression).
- New native export records Expand, self-Shelter, End phase, including the configured Shelter reduction and kit rules version; replay reproduces state and ordered events. The additive unit record includes both Shelter and Impale before enemy resolution.
- Crosswind remains mechanically consequential in a controlled case: turning removes the real selector's protection, so a subsequent Impale gains exactly the supplied directional reduction. Separate clockwise/anticlockwise tests prove pivoted off-centre area movement, fixed marks/other areas, unchanged enemy cells, and one facing step.
- Reliable attacks remain legal against every living tiled enemy in all twelve formations (existing RF coverage passed unedited), including fallen-partner fixtures (existing P07 coverage).

No enemy HP/damage/layout changes were made. The Harrier opening still uses the same unprotected Impale damage. Shelter is stronger in patrol because patrol rules inherit `DEFAULT_DAMAGE_RULES`; it can fully absorb a default Warder/Censer/ordinary Harrier hit, but remains one-hit and may be consumed before a later major hit. Impale now loses damage in a protected front and remains usable with one ally left. These are intentional kit differences, not hidden encounter retuning.

Additional executed control witness (`bun /tmp/p14-kit-evidence/control-witness.ts`, exit 0): a test-owned turnable area at Ugallu's Spread cell, source Warder on its normal off-centre tile, explicit raw hit 9, Brood HP 40 and enemy HP 100. Through `selectRecipients` and `applyAttack`, Gale leaves Ugallu at 31 and Warder at 97; Crosswind rotates the area away and leaves Ugallu at 40 and Warder at 100. This shows a defensive control tradeoff at the attack boundary. An initial attempt to end that artificial phase returned `invalid-command`: ordinary patrol supports only its fixed marked-intention kinds. P14 changes no scheduler; fixed-area resolution belongs to later encounter work.

Open usefulness questions for the human round: whether spending Ugallu's action on one-hit protection feels worthwhile; whether the stronger Shelter makes patrol too easy; whether protection/facing control feels consequential in sustained play. Controlled witnesses establish mechanics and changed legal outcomes, not enjoyment or final balance. No human playtest or independent review is claimed.

Integration notes

P13 is absent here; the record version is therefore `poc-001-rules-v2/patrol-v2/p14-v1`. With P13, it must compose to `poc-001-rules-v3/patrol-v2/p14-v1` without an edit to `run-record.ts` on this branch. Preserve P13's v3 envelope in K4 and the prototype README's version row, while retaining P14's brood segment; CombatScene and abilities-test edits are local to separate kit hunks. No P13-owned budget files were touched. Coordinator should correct the plan's report-directory spelling in any future authorized plan maintenance; no protected-document edit was made here.

Final-candidate verification details

The required four recipes ran bare from the repository root with the normal inherited environment, no Chrome/toolchain override and no manual build before the browser recipe. Sandbox-only attempts could not access Docker or the worktree's Git metadata; the authorized commands succeeded with host access. Commands used the non-login shell's existing Bun PATH, without hand-set environment variables. The browser recipe built its own fresh production bundle and selected `/home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell` because it was the highest executable cached Playwright version. Observed browser: `HeadlessChrome/148.0.7778.96`. Passing final browser outputs are under `/tmp/p10-browser-9aMa8b/`; the final-candidate run with shutdown exit130 is under `/tmp/p10-browser-Tixp1m/`; earlier-candidate outputs are under `/tmp/p10-browser-1OvM0Y/`.

The additive browser command in the header ran from `poc-001-linked-formation/` against that same ordinary preview. Native export `buildRevision` is `a6cc85b218742965ae022918a80ce3ed71bce830`; its rules version is `poc-001-rules-v2/patrol-v2/p14-v1`. The record configuration includes both patrol and ability damage rules, each inheriting the owner’s Shelter default. Final screenshot inspection used all three images under `/tmp/p14-kit-evidence/final-browser/` (1280px browser viewport, full-page captures). SHA-256:

| Capture | SHA-256 |
| --- | --- |
| self-shelter-spread.png | `19a8412196320d75c74594b2fd369f4016dc80971de4809fad47e91a54ce3a92` |
| protected-impale.png | `26c8eac701c94ce6d33f3051f5f5677fbfd5e5333b76611990bc7c1c1bc7959c` |
| one-partner-impale.png | `714204359be68de5d4ef1acfaa6963ab94a94729e9041fdfc7b3d3dcf25d4959` |

Scratch files are uncommitted, as assigned; baseline outcomes, observed kit behaviour, screenshot observations and hashes are preserved here. The tests/fixtures are committed and reproduce the cases.

Exact protected-path comparison (exit 0; no differences):

```sh
git diff --exit-code c596d692d6da0779213d10ff9acba7564ccad902..HEAD -- poc-001-linked-formation/src/core/hex.ts poc-001-linked-formation/src/core/formation.ts poc-001-linked-formation/src/core/sectors.ts poc-001-linked-formation/src/core/intents.ts poc-001-linked-formation/src/core/lifecycle.ts poc-001-linked-formation/src/core/rounds.ts poc-001-linked-formation/src/core/transition.ts poc-001-linked-formation/src/core/commands.ts poc-001-linked-formation/src/core/state.ts poc-001-linked-formation/src/core/run-record.ts poc-001-linked-formation/src/core/smoke.ts poc-001-linked-formation/src/content/patrol.ts poc-001-linked-formation/src/view/FormationLab.ts poc-001-linked-formation/src/view/lab-state.ts poc-001-linked-formation/src/view/patrol-session.ts poc-001-linked-formation/src/view/projection.ts poc-001-linked-formation/src/main.ts poc-001-linked-formation/scripts poc-001-linked-formation/bin poc-001-linked-formation/package.json poc-001-linked-formation/bun.lock poc-001-linked-formation/runtime.env poc-001-linked-formation/tsconfig.json poc-001-linked-formation/vite.config.ts poc-001-linked-formation/vitest.config.ts justfile assets bin scripts docs ':!docs/mailbox/p14-kit-revision/**'
```

The handoff validator initially reported missing dependencies. `bun install --frozen-lockfile` in `.agents/skills/ruach-handoff/` exited 0 and installed only ignored dependencies; generated source was unchanged. The report validator subsequently returned `ok: true` and resolved the baseline and candidate/tested revisions. Final validation uses the assigned exact command, recorded in the leading block after completion.

All required final-candidate recipes completed successfully at `a6cc85b218742965ae022918a80ce3ed71bce830`. Unit count increased from 477 to 500 (three obsolete rejection parameters removed, 26 additive tests). The final browser recipe's unchanged suites executed 4964 assertions; the additive P14 check executed 51. Lab's two failed image requests are intentional coverage of image fallback, not suite failures. No expected-unedited suite failed.

One final-candidate run printed success for all four scripts and then returned 130 at preview cleanup. The same bare `just poc-001-test-browser` command, executed with a terminal/PTY and unchanged inherited environment, subsequently returned 0. Its fresh build and all exported traces identify the final tested SHA. The cause of the initial shutdown signal was not established; it is recorded as an execution limitation, with a successful rerun and no code change.

The eventual report commit is an evidence-only successor: implementation and test code match the tested candidate exactly. The assignment was committed unchanged with the implementation. No merge/push or independent review was performed; no remaining acceptance blocker.

Final validator command: `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p14-kit-revision/implementer.md --repo /opt/dev/tehom-brainlab-p14`; exit 0, `ok: true`, no diagnostics.
