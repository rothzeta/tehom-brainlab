# Assignment RF-review — ring formation, enemies on tiles, playtest bugs (Reviewer)

Role: `reviewer` (follow `.agents/agents/reviewer.md`).
Coordinator: Claude Coordinator session in the main checkout.

## Change under review

- Workspace `/opt/dev/tehom-brainlab-ring`, branch `ring-formation`. Local `master` is `552f2b1`. The branch builds on it by fast-forward:
  - AI playtest evidence (`552f2b1..ef0e3b4`, docs only);
  - the accepted RF design (`ef0e3b4..05bc25c`, docs only);
  - the implementation `05bc25c..0d5fadcb1a4c1a9c1cec75d93a72c37d07fdd3ae`, which includes bug commit `4137db1`, the main RF commit `e18cd09` and follow-up fix `0d5fadc`. Commits `8039a02` and `0ff43d6` are evidence and reports only.
- Plan: [RF task](../../plans/2026-10-05-c6399cb6-poc-001-ring-formation.md). User decisions are in the brief's Decision record and in `architect.md` § User confirmation:
  - no generic reach rule;
  - one alternating layout;
  - no tuning.
- Handoffs: `implementer.md` (its blocked status is historical) and `fix.md`.

## Acceptance conditions to judge

1. Every RF acceptance criterion is met at `0d5fadc`, and the implementation matches the accepted design:
   - Compact `S[o],S[o+2],S[o+4]` around an always-empty centre, `[2,2,2]` Close;
   - Spread corners `[4,4,4]`;
   - radial Expand/Contract;
   - enemies on the specified tiles and facings, never on Brood cells;
   - fronts and protection derived from each enemy's tile and facing;
   - **no generic reach rule**;
   - **no numeric tuning changes**;
   - patrol-v2 and rules versions, and record validation, as specified.
2. **Test-update exception.** Existing tests may change only as enumerated in the RF plan's "Required test updates" section, using independently written expectations. Coverage must not be weakened. Suites listed as unedited must be unedited. The `browser-patrol.mjs:361` reset assertion must be unchanged.
3. **No frozen provisional tuning** (criterion 12). Probe this by changing defaults in a throwaway copy, never on the branch.
4. **Bugs B1–B3.** Each cause must be confirmed and each regression must have failed before its fix. Check the B2 fix in particular: End-phase preview no longer double-applies, and other forecasts are unaffected. Also check the stationary-pointer fix: Restart shows no stale preview, and hover and focus previews still work for real pointer movement and keyboard. Re-run the playtest reports' reproduction steps.
5. The lab ghost-label fix is bounded. Initial layouts fit at 1280×800; scrolling in expanded or preview states is allowed.
6. The prototype README contracts match the implementation, with no stale TR, sector-aligned or view-only-anchor claims.

## Verification instructions

Run these independently at `0d5fadc`, or at `0ff43d6` after confirming identical technical content:

- `just poc-001-install` if needed;
- `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build`;
- **`just poc-001-test-browser` bare, with `POC001_CHROME` unset (show it), run at least twice**;
- `git diff --check 05bc25c..0d5fadc`;
- the unedited-suites check.

Inspect the screenshots yourself: Compact, Spread and enemies on tiles for each preset. Use Docker for application checks and escalate rather than using host mode. Do not modify source or tests; put probes in the OS temp directory.

## Restrictions

Edit only your report. Do not edit protected documents, plans or ADRs. Do not merge, push or rebase, and do not delete branches or worktrees.

## Expected output

Commit this assignment unchanged with `docs/mailbox/ring-formation/reviewer.md`. Start the report with the ruach-handoff YAML block. Classify findings as **blocking** or **optional**, each with file:line, a failure scenario and evidence. Validate with `--repo /opt/dev/tehom-brainlab-ring` until `ok: true`.

Terminal handoff: report SHA, verdict, and counts of blocking and optional findings.
