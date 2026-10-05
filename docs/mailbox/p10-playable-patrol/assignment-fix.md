# Assignment P10-fix — review findings R1 and R2 (Implementer)

Role: `implementer`. You implemented P10. Continue in `/opt/dev/tehom-brainlab-p10` on `p10-playable-patrol`. HEAD `7580a67` includes the review.

Read `docs/mailbox/p10-playable-patrol/reviewer.md`. Fix both blocking findings.

- **R1:** `CombatScene.ts:86` confirms whatever maneuver is pending, checking only `command.kind === 'maneuver'`. Example: focus Rotate clockwise, hover Expand, press Enter, and Expand executes. Activating a control must execute exactly that control's command. Confirm the cached preview only if it matches the activated control's identity. Otherwise, preview and confirm the activated control's own command through the same P09 `confirmPreview` boundary. Check every other control type (abilities, targets, directions, end phase) for the same shared-pending-preview pattern and fix it the same way. Add a browser regression test for the reviewer's focus-plus-hover scenario, and for at least one ability case if the pattern applied there.
- **R2:** `browser-patrol.mjs:182-187` replays historical traces against current uncontrolled defaults and compares the historical final HP. Make the browser trace assertions independent of provisional tuning. Use either of these two approaches; do not mix them ad hoc:
  - (a) Run each trace in the page from its recorded initial state and rules. Do this only through a test-owned mechanism that adds no player-reachable debug, teleport or fixture-injection path to the playable UI (criterion 8). If this needs a test-only entry, it must sit outside the playable route, in the same way as your existing isolated test page. Justify this in the report.
  - (b) Compute the expectation in the test at run time. Replay the same visible command sequence headlessly through public core functions with the identical current rules the page uses. Assert that the UI final state, outcome and event order equal that headless result, and that each step is accepted or rejected identically. Then add a separate check, under explicit test-owned rules, that the recorded win and loss outcomes are reachable through the UI.

  Criterion 2 must still be demonstrated: a winning and a losing trace played through visible controls, matching headless.

Leave existing tests other than your own P10 browser and test files unedited.

## Verification on the committed fix

- `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build`
- `just poc-001-test-browser`
- `git diff --check`
- the unedited-tests check against `767f46c`
- a rerun of the reviewer's R1 scenario
- a temporary default-change probe for R2, for example Censer damage 3 to 2. Rebuild in a throwaway copy or temp directory if needed, never on the branch. The fixed assertions must still pass.

## Output

Write `docs/mailbox/p10-playable-patrol/fix.md`. Start it with the ruach-handoff YAML block (fixed_revision, tested_revision, findings addressed, verification, blockers). Commit it with this assignment unchanged, and run the validator until it reports `ok: true`. Do not edit the reviewer report, protected documents or plans. Do not merge, push or rebase.

Terminal handoff: report path, report SHA, fixed technical revision, results, blockers.
