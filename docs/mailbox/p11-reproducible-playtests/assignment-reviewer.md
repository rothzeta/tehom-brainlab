# Assignment P11-review — reproducible playtests (Reviewer)

Role: `reviewer` (follow `.agents/agents/reviewer.md`).
Coordinator: Claude Coordinator session in the main checkout.

## Change under review

- Workspace `/opt/dev/tehom-brainlab-p11`, branch `p11-reproducible-playtests`. Local `master` is `8315349`, which is also the branch BASE, so the branch itself is the combined candidate.
- Range `8315349..8decc8c80546f1437fbd6107215fc84b8b2cabb2`. Commit `f9cb191` adds the Implementer report, the assignment, exported-record evidence and, if present, the playtest artifact. Confirm exactly which paths each commit adds.
- Handoff: `docs/mailbox/p11-reproducible-playtests/implementer.md`. Playtest artifact: `docs/playtests/2026-10-05-poc-001-p11-automated.md`.

## Acceptance conditions to judge

1. Criteria 1–3 and 7 of the [P11 plan](../../plans/2026-10-02-825a6700-poc-001-reproducible-playtests.md) are met. Export and replay reproduce the final state and event order. Reset starts a fresh record. Rejected inputs and UI selections never enter a record as accepted commands. Malformed records and unsupported versions fail with specific reasons.
2. **Replay safety:** the replay path and `just poc-001-replay` must not execute supplied code (no `eval`, `Function`, dynamic import of record content, or prototype pollution through parsed JSON). They must not reach network or file paths beyond reading the named record. Probe with hostile records, such as `__proto__` keys, huge or deep inputs and wrong types, and record the outcomes.
3. **Tuning independence:** replay compares against the real transitions under the record's own stored rules. No assertion, unit or browser, may freeze provisional defaults. The P07, P09 and P10 reviews each blocked on this, so probe with changed defaults in a throwaway copy, never on the branch.
4. **Honest evidence, criteria 4–6:** the playtest artifact identifies the actual build, configuration, rules versions and all three starting conditions. It labels every run as automated rather than tester play, and keeps observations, tester explanations (none exist) and interpretation separate. It invents no quotations or enjoyment claims, and it does not overwrite `TEMPLATE.md`. The boss gate must be explicitly **HOLD** with evidence. **As the independent Reviewer, explicitly confirm or contest the HOLD gate in your report**, attributing it to yourself by role and session label. Criterion 7's statement must be present.
5. Existing P01–P10 tests are unedited. The root justfile changes only by adding `poc-001-replay`. The full suite, typecheck, build, `just poc-001-test-browser` and `just poc-001-replay` on a committed exported record all pass.

## Verification instructions

Run independently at `8decc8c`, or at `f9cb191` after confirming identical technical content:

- `just poc-001-install`, if needed;
- `just poc-001-test`, `just poc-001-typecheck` and `just poc-001-build`;
- `just poc-001-test-browser`;
- `just poc-001-replay` on a committed record and on your hostile and malformed probes;
- `git diff --check 8315349..8decc8c`;
- the unedited-tests check against `8315349`.

Use Docker for application checks, and escalate rather than switching to host mode. Do not modify source or tests; put probes in the OS temp directory. Record exact commands, exit codes, counts and the tested revision.

## Restrictions

Edit only your report. Do not edit protected documents, plans, ADRs or the playtest artifact. Do not merge, push, rebase, or delete branches or worktrees.

## Expected output

Commit this assignment unchanged together with your report at `docs/mailbox/p11-reproducible-playtests/reviewer.md`. Start the report with the `ruach-handoff` YAML block. Classify each finding as **blocking** or **optional**, with file:line, a failure scenario and evidence. Run the validator with `--repo /opt/dev/tehom-brainlab-p11` until it reports `ok: true`. Terminal handoff: report SHA, verdict, blocking and optional finding counts, and your gate confirmation (HOLD confirmed or contested).
