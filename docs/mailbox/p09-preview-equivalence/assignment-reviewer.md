# Assignment P09-review — preview equivalence (Reviewer)

Role: `reviewer` (follow `.agents/agents/reviewer.md`).
Coordinator: Claude Coordinator session in the main checkout.

## Change under review

- Workspace `/opt/dev/tehom-brainlab-p09`, branch `p09-preview-equivalence`. Local `master` is `35586e8`, which is also the branch BASE, so the branch is the combined candidate.
- Range: `35586e8..63b567ba2b92262624c6cb4cf6332091b7009dea`. Commit `d88a4d8` adds only the Implementer report, assignment and browser evidence.
- Handoff: `docs/mailbox/p09-preview-equivalence/implementer.md`.

## Acceptance conditions to judge

1. Every numbered acceptance criterion and required contract in the [P09 plan](../../plans/2026-10-02-d28ae958-poc-001-preview-equivalence.md) is met. Tests must assert observable contracts per ADR-0006. Equivalence tests must compare against the real transition, not against hand-copied numbers, and must not freeze provisional defaults.
2. **No alternate rules path.** The preview runs the real `applyCommand` or `endPhase` on isolated clones. Check that `preview.ts` contains no damage, mitigation, targeting or legality calculation that could diverge from P03, P05, P06, P07 or P08. Check that `structuredClone` plus deep freeze cannot leak mutation into live state, including through frozen outputs shared with callers.
3. Stale-session handling works: the generation and revision checks in `confirmPreview` hold, reset and fresh fixture invalidate previews, and confirming submits the original command. P04's default lab behaviour and its `commit` result type are preserved.
4. The `?preview=patrol` lab fixture is bounded and labelled as a test or lab fixture. It does not pre-empt P10's full combat controls.
5. Existing tests are unedited and pass, including P04 `browser-lab.mjs`. The full suite, typecheck, build and both browser checks pass. Inspect the preview and commit screenshots yourself.

## Verification instructions

Run these independently at `63b567b`, or at `d88a4d8` after confirming identical technical content:

- `just poc-001-install` if needed;
- `just poc-001-test`, `just poc-001-typecheck` and `just poc-001-build`;
- the headless Chrome `tests/browser-lab.mjs` and `tests/browser-preview.mjs` checks (commands are in the implementer report);
- `git diff --check 35586e8..63b567b`;
- `git diff --exit-code 35586e8 63b567b -- poc-001-linked-formation/tests ':!poc-001-linked-formation/tests/preview.test.ts' ':!poc-001-linked-formation/tests/browser-preview.mjs'`.

Use Docker, and escalate rather than switching to host mode. Do not modify source or tests; put any probes in the OS temp directory. Record exact commands, exit codes, counts and the tested revision.

## Restrictions

Edit only your report. Do not edit protected documents, plans or ADRs. Do not merge, push or rebase, and do not delete branches or worktrees.

## Expected output

Commit this assignment unchanged with your report at `docs/mailbox/p09-preview-equivalence/reviewer.md`. Start the report with the `ruach-handoff` YAML block. Classify each finding as **blocking** or **optional**, with file:line, a failure scenario and evidence. Run the validator with `--repo /opt/dev/tehom-brainlab-p09` until it reports `ok: true`. Terminal handoff: report-creating SHA, verdict, and counts of blocking and optional findings.
