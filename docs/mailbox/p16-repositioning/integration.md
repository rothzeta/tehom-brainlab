task: p16-repositioning-integration
status: complete
outcome: Delivered P15 fixes merged into P16; relocation, configured mitigation and replay verified together.
role: implementer
author: p16-implementer
destination: p16-repositioning
destination_before: 539566232233726a557b39d888134f134bb232a4
source_p16_revision: 539566232233726a557b39d888134f134bb232a4
source_p15_revision: 69c56adec70960511927ca308e0c824d4e17e33b
p15_fix_revision: 4523be2ef4c6b317f3b09fb26b39d126b1673641
combined_revision: d8a30c6897f09708e5c972796462ca8c0ebdc848
tested_revision: d8a30c6897f09708e5c972796462ca8c0ebdc848
conflict_resolutions: []
artifacts:
  - docs/mailbox/p16-repositioning/assignment-integration.md
  - docs/mailbox/p16-repositioning/integration.md
  - poc-001-linked-formation/tests/repositioning-integration.test.ts
  - docs/mailbox/p15-crucible/fix.md
  - docs/mailbox/p15-crucible/reviewer.md
verification:
  - "just poc-001-test: exit 0; 565 tests in 19 files."
  - "just poc-001-typecheck: exit 0."
  - "just poc-001-build: exit 0."
  - "just poc-001-test-browser: exit 0; 4,985 assertions across four harnesses."
  - "P16 repositioning harness: exit 0; 98 assertions, six screenshots."
  - "Crucible harness: exit 0; 474 assertions, eleven screenshots."
  - "CLI replay of relocating, controlled Crucible and product Crucible exports: all exit 0."
  - "Preservation comparisons and git diff --check: all exit 0."
  - "ruach-handoff validation with --repo: exit 0; ok true."
review: not-run
discoveries:
  - Valid Crucible states remain anchored; test-only mobile Crucible emits off-route without relocating.
  - Explicit encounter-derived ability rules survive real patrol relocation and serialized replay.
  - Controlled Crucible browser export intentionally records unknown build revision; product and P16 exports identify the tested SHA.
blockers: []

Implemented on 2026-10-06. Scope and restrictions: [assignment](assignment-integration.md). Prior P16 evidence remains in [implementer report](implementer.md); incoming P15 findings remain in [fix](../p15-crucible/fix.md) and [review](../p15-crucible/reviewer.md).

## Merge and changed files

Ran `git merge --no-ff master -m 'Merge delivered P15 fixes into P16 repositioning'` after confirming local master was the assigned `69c56adec70960511927ca308e0c824d4e17e33b`. Git automatically combined disjoint changes in `src/core/run-record.ts`; there were no textual conflicts or manual resolutions. Added the integration test and amended this task-owned merge commit with `git commit --amend --no-edit`. The final merge has exactly the source P16 and P15 revisions above as its two parents.

Inherited P15 implementation changes are `src/core/transition.ts` and `src/core/run-record.ts`; inherited test changes are `tests/crucible.test.ts`, `tests/browser-crucible.mjs` and `tests/browser/crucible-fixtures.ts`, all under `poc-001-linked-formation/`. Incoming master also brings its Coordinator-owned `docs/CURRENT.md`, `docs/TASK_LOGS.md`, and P13/P15 mailbox evidence. No manual edits were made to those documents or to any existing test. All P16 relocation code, view changes and existing P16 tests remain unchanged from the source P16 revision.

The only new verification file is `poc-001-linked-formation/tests/repositioning-integration.test.ts` (five cases). This report and the unchanged assignment form an evidence-only successor to the tested merge. No push or merge into master was performed.

## Behavioral interaction

The integration tests use explicit reductions of 1 and 8, with test-owned HP, harmless enemy attacks and phase threshold. Assertions derive damage from public ability rules and front geometry, avoiding fixed provisional product tuning.

- Live Crucible dispatch, preview and default record creation honor its configured self-guard. A test-only `mobile: true` on the anchored centre enemy produces the expected off-route event, without changing its cell; the combined command/event record replays exactly.
- A real moving patrol guard moves onto a fallen enemy's cell. Explicit ability rules obtained from a custom Crucible are passed to the public `applyAbility` and record APIs; damage before and after relocation uses those rules at the current cell, and the three-command record replays exactly. This tests the explicit override boundary; it does not assert that patrol dispatch selects Crucible configuration.
- Normal patrol dispatch and default record creation retain their public default mitigation after real relocation; replay reproduces the state and ordered events.

The valid Crucible record contract requires the boss at the centre, outside the relocation route. There is therefore no valid product trace of a relocating Crucible. The tests cover both that boundary and actual moving records with configured mitigation, without relaxing the anchor constraint.

## Verification on the merged commit

All four required recipes ran bare from `/opt/dev/tehom-brainlab-p16`, without hand-set environment variables or a Chrome override. Port 4173 was free when checked before launch; integration port wait was **0 minutes**. No other worker's process or container was stopped. The standard browser runner selected executable Playwright Chromium 1223 automatically and built its own fresh production bundle.

| Command | Exit | Result |
| --- | --- | --- |
| `just poc-001-test` | 0 | 565 tests, 19 files |
| `just poc-001-typecheck` | 0 | Typecheck passed |
| `just poc-001-build` | 0 | Production build passed; existing large-chunk advisory |
| `just poc-001-test-browser` | 0 | Lab 197, preview 24, patrol 4,572, records 192 assertions; output `/tmp/p10-browser-TATAxH` |
| `just poc-001-test tests/repositioning-integration.test.ts` | 0 | Preliminary focused check: five tests |
| `just poc-001-typecheck` | 0 | Preliminary typecheck, before final bare checks |
| `just poc-001-replay /tmp/p16-integration-repositioning/relocating.json` | 0 | 5 commands, 24 events, revision 5, round 3, player |
| `just poc-001-replay /tmp/p16-integration-crucible/phase-crossing.json` | 0 | 14 commands, 51 events, revision 14, round 5, player |
| `just poc-001-replay /tmp/p16-integration-crucible/product-attempt.json` | 0 | 9 commands, 33 events, revision 9, round 3, player |

After the bare browser recipe and build finished, ran an additional private host preview from `poc-001-linked-formation/`:

```sh
bun node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4186 --strictPort
bun tests/browser-repositioning.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p16-integration-repositioning http://localhost:4186/
bun tests/browser-crucible.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p16-integration-crucible http://localhost:4186/
```

Both harnesses exited 0, sequentially. The private preview started successfully and was stopped with Ctrl-C after both checks (intentional exit 130). P16 produced 98 assertions and six screenshots; Crucible produced 474 assertions and eleven screenshots. Native exports were replayed inside both harnesses as well as through the CLI commands above. P16 exports and product/diagnostic Crucible exports embed `d8a30c6897f09708e5c972796462ca8c0ebdc848`. The controlled `phase-crossing.json` uses the inherited fixture's `unknown` build metadata; its rules, commands, events and replay were verified.

Inspected `corpse-destination-preview.png`, `corpse-after.png`, and `phase-two-fork.png`: the relocation destination preview is visible, the moved live token remains visible over the fallen token, and Crucible phase-two fork/secondary declarations remain visible. Evidence and summary JSON remain in the temporary directories above; no raw browser artifacts were committed.

Preservation checks, all exit 0:

```sh
git diff --exit-code 69c56adec70960511927ca308e0c824d4e17e33b..HEAD -- docs/plans docs/CURRENT.md docs/TASK_LOGS.md poc-001-linked-formation/src/core/transition.ts poc-001-linked-formation/tests/browser-crucible.mjs poc-001-linked-formation/tests/browser/crucible-fixtures.ts poc-001-linked-formation/tests/crucible.test.ts
git diff --exit-code 539566232233726a557b39d888134f134bb232a4..HEAD -- poc-001-linked-formation/src/core/enemy-movement.ts poc-001-linked-formation/src/core/state.ts poc-001-linked-formation/src/core/commands.ts poc-001-linked-formation/src/core/rounds.ts poc-001-linked-formation/src/view/CombatScene.ts poc-001-linked-formation/tests/enemy-movement.test.ts poc-001-linked-formation/tests/browser-repositioning.mjs poc-001-linked-formation/tests/browser/repositioning-fixture.ts poc-001-linked-formation/tests/browser/repositioning-fixtures.ts
git diff --check
```

The `run-record.ts` diff against incoming master contains only P16's optional boolean `mobile` validation and living-only distinct-cell validation. Its P15 configured-rule selection remains intact. Listing test changes against source P16 yields only the three incoming P15 test files and the new integration test.

Assignment SHA-256 remains `ba47dde153c76df8521fdfbf1cee82805d249b09ebf73bf1ffdbbc7eeecf040b`. Report validation: `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p16-repositioning/integration.md --repo /opt/dev/tehom-brainlab-p16`, exit 0, `ok: true`. Independent review of this combined revision was not assigned or run; no required verification remains unrun and no blockers remain.
