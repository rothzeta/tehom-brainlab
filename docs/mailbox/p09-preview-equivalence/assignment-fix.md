# Assignment P09-fix — review findings R1 and R2 (Implementer)

Role: `implementer`. You implemented P09. Continue in `/opt/dev/tehom-brainlab-p09` on `p09-preview-equivalence`. HEAD `61aac67` includes the review.

Read `docs/mailbox/p09-preview-equivalence/reviewer.md`. Fix both blocking findings:

- **R1:** `previewFacts` (`src/core/preview.ts` ~lines 50, 60, 112) throws `RangeError` when selector tuning is invalid, for example `splashRadius: -1` or `closeThreshold: -1`. It throws before the real end-phase forecast runs. Whenever the real `applyCommand` accepts the immediate command, `previewCommand` must return the accepted immediate preview. The forecast must carry the real typed rejection from `endPhase`. The same applies to any other derived fact whose selector can throw on caller-supplied tuning. Do not add a parallel validator that could diverge from the real boundary. Prefer deriving facts so that selector failure becomes an explicit unavailable or rejected forecast. Keep live state unmutated. Add regression tests for both of the Reviewer's cases, plus the existing `warderDamage: -1` style case. Assert the immediate result, the forecast rejection code and unchanged live bytes.
- **R2:** `tests/browser-preview.mjs:95` hard-codes the recipients of the provisional default splash. Make the browser assertion independent of provisional tuning. Either construct the fixture with explicit, test-owned rules (if the page fixture allows it, without adding a production debug surface beyond the existing bounded `?preview=patrol` fixture), or compute the expected recipients from the stored fixture rules through the public selector. Keep the assertion strong enough to catch wrong rendering.

Leave all other existing tests unedited. Only `preview.test.ts` and `browser-preview.mjs`, which are yours, may change.

## Verification on the committed fix

- focused P09 tests;
- full `just poc-001-test`, `just poc-001-typecheck` and `just poc-001-build`;
- both browser checks;
- `git diff --check`;
- the unedited-tests check against `35586e8`;
- the Reviewer's R1 probe idea, re-run to show a preview is returned with a rejected forecast.

## Output

Write `docs/mailbox/p09-preview-equivalence/fix.md`. It starts with the ruach-handoff YAML block (fixed_revision, tested_revision, findings addressed, verification, blockers). Commit it with this assignment unchanged and run the validator until it reports `ok: true`. Do not edit the Reviewer's report, protected documents or plans. Do not merge, push or rebase.

Terminal handoff: report path, report SHA, fixed technical revision, results, blockers.
