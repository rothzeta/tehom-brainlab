# Assignment P07-review — Brood abilities (Reviewer)

Role: `reviewer` (follow `.agents/agents/reviewer.md`).
Coordinator: Claude Coordinator session in the main checkout.

## Change under review

- Workspace: `/opt/dev/tehom-brainlab-p07`, branch `p07-brood-abilities`. Local `master` is `08dc6308649f124ee4a9d5897bcb8d92438dacec`, which is the branch BASE, so the branch is the combined candidate.
- Range: `08dc630..42deffc5aadeb5c1d8b77a2119a16aa6a408995c`. Commit `1b251bf` adds only the Implementer report and its assignment.
- Handoff: `docs/mailbox/p07-brood-abilities/implementer.md`, which covers the criterion mapping, resolved defaults, the accounting design and discoveries.

## Acceptance conditions to judge

1. Every numbered acceptance criterion and required contract in the [P07 plan](../../plans/2026-10-02-f8938420-poc-001-brood-abilities.md) is met. In particular, all six actions run with no adjacency-created dead turns. Tests assert observable contracts per ADR-0006, with expectations written independently of production code.
2. The accounting design is sound. P03's `ActionRules.apply` returns only Brood data, so the Implementer added a combat adapter sharing P03 actor guards and one accounting function. Check that accounting stays in one place, that there is one spend and one revision per use, that rejection is atomic, and that P06 attack and lifecycle results are preserved without double revision increments. Unregistered or basic-snapshot precedence must be preserved.
3. The additive changes to P05 (signed turn export) and P06 (`CombatEnemy` optional rotatable capability) are backward-compatible, and P01–P06 plus the two-ring tests are unedited and pass.
4. Defaults stay within P07 ownership and do not decide P08 rules (enemy order, round expiry, encounter factories). There is no generic scripting system and no rules in UI.
5. Abilities are pure and deterministic, with no input mutation.
6. The full suite, typecheck and build pass at the candidate.

## Verification instructions

Run these independently at `42deffc`, or at `1b251bf` after confirming identical technical content:

- `just poc-001-install` if needed
- `just poc-001-test`
- `just poc-001-typecheck`
- `just poc-001-build`
- `git diff --check 08dc630..42deffc`
- `git diff --exit-code 08dc630 42deffc -- poc-001-linked-formation/tests ':!poc-001-linked-formation/tests/abilities.test.ts'`, to confirm existing tests are unedited (adjust if P07 added other new test files)

Use Docker, and escalate rather than switching to host mode. Record exact commands, exit codes, counts and the tested revision. Do not modify source or tests; put any probes in the OS temp directory.

## Restrictions

Edit only your report. Do not edit protected documents, plans or ADRs. Do not merge, push, rebase, or delete branches or worktrees.

## Expected output

- Commit this assignment unchanged together with your report at `docs/mailbox/p07-brood-abilities/reviewer.md`.
- The report starts with the `ruach-handoff` YAML block. Classify each finding as **blocking** or **optional**, with file:line, a failure scenario and evidence. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p07-brood-abilities/reviewer.md --repo /opt/dev/tehom-brainlab-p07` until it returns `ok: true`.
- Terminal handoff: report path, report-creating SHA, verdict, and counts of blocking and optional findings.
