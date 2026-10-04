# Assignment P04-review — formation lab (Reviewer)

Role: `reviewer` (follow `.agents/agents/reviewer.md`).
Coordinator: Claude Coordinator session in the main checkout.

## Change under review

- Workspace: `/opt/dev/tehom-brainlab-p04`, branch `p04-formation-lab`.
- P04 technical candidate: `0d6f23368f3cf21d1d14bc9bf0e8be34c0daff12` .. `32f07c0063bc2162965ad5d21fc26fc160fa799b`.
- Combined revision to review: `b5e7c54ebd361fd926f197d014f01f3e8e89581d` = merge of P04 (`3cfc5c2`) with delivered master `04bd6a28bd21f5248cd18de59cbf5efbc408b6a1` (P05, already reviewed and delivered — not under review here except for integration correctness). Commit `ed40685` adds only the integration report/evidence.
- Changed technical paths (P04): `poc-001-linked-formation/.gitignore`, `README.md`, `package.json`, `scripts/run.sh`, `scripts/prepare-assets.mjs`, `src/main.ts`, `src/view/FormationLab.ts`, `src/view/lab-state.ts`, `src/view/projection.ts`, `src/view/lab.css`, `tests/view.test.ts`, `tests/asset-copy.test.ts`, `tests/browser-lab.mjs`.
- Handoffs: `docs/mailbox/p04-formation-lab/implementer.md` (criterion mapping, defaults, browser evidence, screenshots) and `integration.md`.

## Acceptance conditions to judge

1. Every numbered acceptance criterion and required contract in the [P04 plan](../../plans/2026-10-02-9d81c6df-poc-001-formation-lab.md) is met by the code at the combined revision, with tests asserting observable contracts per `docs/adr/0006-contract-invariants-and-black-box-testing.md`.
2. The lab consumes P02/P03 through their public exports without changing core semantics; preview never mutates state; commit spends through P03's real transition; reset works; fixture selection is labelled as test setup, not a game action.
3. Placeholder mode and a failed image request are handled and explained; the interface remains understandable when art is replaced by labels.
4. Root `assets/` (SVGs, manifest, license, credits) unchanged; no shared engine, cross-prototype code, or general asset pipeline; no combat previews (P09). Toolchain changes (`package.json`, `scripts/run.sh` read-only `/assets` mount, `.gitignore`) are minimal and justified.
5. Integration with P05 is correct: no lost content, P05 files identical to master.
6. Full suite, typecheck, build and the browser check pass at the combined revision.

## Verification instructions

Independently run at `b5e7c54` (or `ed40685`, after confirming identical technical content): `just poc-001-install` if needed, `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build`, the headless Chrome `tests/browser-lab.mjs` check as documented in the Implementer report, and `git diff --check 0d6f233..b5e7c54`. Inspect at least one captured screenshot yourself. Use Docker mode; request sandbox escalation rather than switching to host mode. Record exact commands, exit codes, counts and the tested revision. Do not modify source or tests; disposable probes go in the OS temp dir.

## Restrictions

- Edit only your report. Do not edit `docs/CURRENT.md`, `docs/TASK_LOGS.md`, plans or index.
- Do not merge, push, rebase, or delete branches/worktrees.

## Expected output

- Commit this assignment unchanged together with your report at `docs/mailbox/p04-formation-lab/reviewer.md` on this branch.
- The report starts with the `ruach-handoff` YAML block: reviewed revision, tested revision, verification, review outcome. List findings classified **blocking** vs **optional**, each with file:line, concrete failure scenario and evidence. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p04-formation-lab/reviewer.md --repo /opt/dev/tehom-brainlab-p04` until `ok: true`.
- Reply with a concise terminal handoff: report path, report-creating SHA, verdict, count of blocking/optional findings.
