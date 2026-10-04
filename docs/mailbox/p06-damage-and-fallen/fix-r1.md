task: P06-fix-R1
status: complete
outcome: R1 reproduced and fixed; sparse attack recipient arrays return atomic invalid-command rejections.
role: implementer
source_baseline: 2c0612cabf063e792e77654cbac670a7d1bd6560
fixed_revision: 475823063a72c40bcb16115a53efe9a5d2712c7f
tested_revision: 475823063a72c40bcb16115a53efe9a5d2712c7f
finding_addressed: R1
artifacts:
  - docs/mailbox/p06-damage-and-fallen/assignment-fix-r1.md
  - docs/mailbox/p06-damage-and-fallen/fix-r1.md
  - poc-001-linked-formation/src/core/damage.ts
  - poc-001-linked-formation/tests/damage.test.ts
verification:
  - "Pre-fix just poc-001-test tests/damage.test.ts -t 'sparse recipients': exit 1; both new cases reproduced TypeError at target.maxHp, 46 other cases skipped."
  - "just poc-001-test tests/damage.test.ts: exit 0 at fix; 48 tests / 305 executed assertions."
  - "just poc-001-test: exit 0 at fix; 274 tests / seven files; 4710 instrumented assertions."
  - "just poc-001-typecheck: exit 0 at fix."
  - "just poc-001-build: exit 0 at fix; nine prepared assets / 18 modules; existing Phaser chunk-size warning."
  - "P04 headless Chrome browser-lab.mjs: exit 0 at fix; 136 assertions / 12 fixtures / three modes / 18 temporary captures / zero uncaught exceptions."
  - "git diff --check and git diff --check 2c0612cabf063e792e77654cbac670a7d1bd6560..HEAD: exit 0."
  - "Preservation git diff --exit-code against source baseline: exit 0 for prior reports, P01–P05 tests, P04 code/tooling, and protected documents."
  - "PATH=/home/metatron/.bun/bin:$PATH bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p06-damage-and-fallen/fix-r1.md --repo /opt/dev/tehom-brainlab-p06: exit 0; ok true, three revisions resolved, no diagnostics."
review: not-run
discoveries:
  - "recipientIds is the only array-valued P06 attack command input. Numeric tuning validation uses a dense literal of scalar fields; state/lifecycle arrays are valid-snapshot inputs, not command payload arrays. No second boundary fix needed."
blockers: []

Author: P06 Implementer. Date: 2026-10-04 UTC. Worktree `/opt/dev/tehom-brainlab-p06`, branch `p06-damage-and-fallen`. Governing [assignment](assignment-fix-r1.md), [blocking review finding R1](reviewer.md#r1--blocking-p2-reject-sparse-recipient-arrays-before-settlement), [testing policy](../../adr/0006-contract-invariants-and-black-box-testing.md) and [handoff skill](../../../.agents/skills/ruach-handoff/SKILL.md). Independent re-review remains pending. Report-creating SHA is returned separately; the fixed/tested revision above contains only the two technical changes.

## Fix and regression evidence

[`damage.ts`](../../../poc-001-linked-formation/src/core/damage.ts) now validates `[...attack.recipientIds].every(validId)` after the existing `Array.isArray` guard. Spreading materializes each sparse position as `undefined`, which fails the existing ID check before damage computation. This rejects the malformed packet as `invalid-command` through the ordinary P03 `applyCommand` envelope. Duplicate-recipient and living-target checks, precedence, mitigation, batching, event identity and all other behavior remain unchanged. One explanatory comment accompanies the one-line change.

[`damage.test.ts`](../../../poc-001-linked-formation/tests/damage.test.ts) adds two cases through `applyCommand`:

- `new Array<string>(1)` (hole-only).
- `Object.assign(new Array<string>(2), {0:'ugallu'})` (valid ID plus a trailing hole).

Each case asserts five contractual facts: `ok:false`, error `invalid-command`, exact same state identity, empty events, and state contents equal the pre-call clone. Fixtures/commands are deeply frozen. The cases do not normalize holes into dense arrays before passing them to the boundary. Existing tests were retained unchanged.

The new regressions ran before the production fix and both failed with `TypeError: undefined is not an object (evaluating 'target.maxHp')`, reproducing R1 at the reviewed implementation. They then passed as part of the focused/full checks on the committed fix. The pre-fix run recorded zero matcher assertions because evaluating the `applyCommand` argument threw before the rejection helper could execute.

Checked the P06 `AttackCommand`, `DamageRules`, attack validation/eligibility, and surrounding `Command`/transition/lifecycle/state declarations with `rg` and source inspection. `recipientIds` is the only P06 array-valued command input. The later `recipientIds.some` is now reached only after every logical position has passed ID validation. The tuning `every` processes a newly constructed dense three-element array of scalar rule fields. Other arrays (`brood`, `enemies`, protections, Shelters, typed intentions, resolved IDs and event results) belong to trusted valid snapshots or outputs. No additional command-boundary array had the same uncovered hole-skipping pattern; no state-validation or unrelated P03 work was added.

## Exact verification on the committed fix

Commands ran from the worktree root. Application checks used existing default Docker wrappers with authorized sandbox escalation, Bun 1.4.2 and Vitest 5.0.3. No installation, runtime switch or dependency change was needed.

| Exact command | Exit / result |
| --- | --- |
| `just poc-001-test tests/damage.test.ts -t 'sparse recipients'` (before production fix) | 1; two selected regressions failed with the reported TypeError, 46 other tests skipped, zero matcher assertions reached. |
| `just poc-001-test tests/damage.test.ts` | 0; 48 tests / 305 executed assertions on `475823063a72c40bcb16115a53efe9a5d2712c7f`. |
| `just poc-001-test` | 0; 274 tests / seven files: P01 smoke 2, P02 formation 90, P03 commands 37, P04 view 19/assets 3, P05 intents 75, P06 damage 48. Instrumented assertions: P02 3349 + P03 253 + P05 803 + P06 305 = 4710; P01/P04 suites have no assertion counters. |
| `just poc-001-typecheck` | 0; strict `tsc --noEmit`. |
| `just poc-001-build` | 0; nine prepared assets / 18 modules; JS 1394.31 kB (gzip 364.45), CSS 3.21 kB (gzip 1.27). Existing large Phaser chunk warning remains. |
| `git diff --check` | 0. |
| `git diff --check 2c0612cabf063e792e77654cbac670a7d1bd6560..HEAD` | 0. |
| `just poc-001-preview` | Docker preview successfully served this fixed build on localhost:4173; stopped after Chrome success with Ctrl-C, expected service termination exit 130. |
| `/home/metatron/.bun/bin/bun poc-001-linked-formation/tests/browser-lab.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p06-fix-r1-browser-4758230` | 0; unchanged P04 probe: 136 assertions, 12 fixtures, normal/placeholder/failed-image modes, 18 temporary captures, zero uncaught exceptions. |

Chrome was HeadlessChrome 148.0.7778.96 at 1280×800. The probe made 45 requests; its two deliberate Ugallu image failures had blocked reason `inspector`. Its existing sandbox-enabled browser flags were unchanged. Temporary browser profile cleanup completed in the probe. Screenshots, JSON traces and Chrome stderr remain disposable under `/tmp/p06-fix-r1-browser-4758230`; none is committed. The actual lab still passes P04's geometry, preview/commit, second-maneuver rejection, cancel/reset, inspection, keyboard/pointer, placeholder and failed-image contracts. No human playtest is claimed.

Preservation check (exit 0):

```sh
git diff --exit-code 2c0612cabf063e792e77654cbac670a7d1bd6560 HEAD -- docs/mailbox/p06-damage-and-fallen/reviewer.md docs/mailbox/p06-damage-and-fallen/implementer.md docs/mailbox/p06-damage-and-fallen/integration.md docs/CURRENT.md docs/TASK_LOGS.md docs/plans poc-001-linked-formation/tests/commands.test.ts poc-001-linked-formation/tests/intents.test.ts poc-001-linked-formation/tests/formation.test.ts poc-001-linked-formation/tests/smoke.test.ts poc-001-linked-formation/src/view poc-001-linked-formation/src/main.ts poc-001-linked-formation/scripts poc-001-linked-formation/package.json
```

`PATH=/home/metatron/.bun/bin:$PATH bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p06-damage-and-fallen/fix-r1.md --repo /opt/dev/tehom-brainlab-p06` exited 0: `schema_version:1`, `ok:true`, three existing revision references resolved, `diagnostics:[]`. This is report structure/revision validation, not independent re-review. The assignment remains unchanged, SHA-256 `e2711bdd0d20801eaed9ea58b50f391819838a6f5a6a2fc45a43e3c29ef8951d`, and is committed with this report.

No implementation or verification blocker remains. Independent re-review of R1 and Coordinator acceptance remain separate work; this report does not edit or supersede the Reviewer's verdict. Local master remained `8f8c9e47859262401c189dd0d623bed09a5aeb30`. No merge, push, rebase, branch/worktree deletion, earlier-report edit, or protected-document edit occurred.
