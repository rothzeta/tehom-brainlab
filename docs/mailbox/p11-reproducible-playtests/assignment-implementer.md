# Assignment P11-impl — reproducible playtests (Implementer)

Role: `implementer` (follow `.agents/agents/implementer.md`).
Coordinator: Claude Coordinator session in the main checkout.

## Task and scope

Implement plan P11, [reproducible playtests](../../plans/2026-10-02-825a6700-poc-001-reproducible-playtests.md). It covers all checkpoints, required contracts, and numbered acceptance criteria 1–7. P11 owns the attempt-record schema and the evidence hand-back defaults. Resolve each default explicitly and record its value, source and reason.

- Workspace: `/opt/dev/tehom-brainlab-p11`, branch `p11-reproducible-playtests`, BASE `8315349` (local `master`). Work and commit only here.
- File ownership:
  - `poc-001-linked-formation/src/core/run-record.ts`;
  - a local export control in the P10 combat UI;
  - `scripts/replay-run.ts` or equivalent, wired through the prototype's wrapper pattern;
  - a thin root recipe `just poc-001-replay`, matching the existing `poc-001-*` recipes (plans index: "test-browser and replay supplied by their later owning plans"). Change only that recipe in the root justfile;
  - `tests/run-record.test.ts`, plus P11 browser checks added to the `test-browser` aggregate;
  - the P11 section of the prototype README;
  - one new review artifact under `docs/playtests/`, based on `docs/playtests/TEMPLATE.md`. Do not overwrite the template. Update `docs/playtests/README.md` navigation if it lists reports.
- Use P10's accepted-command stream and P08's factories. Add no analytics or telemetry. Replay must never execute supplied code or perform file or network access beyond reading the named record. Malformed records and unsupported versions must fail with a specific reason.
- Existing P01–P10 tests, including all browser scripts, must pass **unedited**.

## Human-evidence boundary (important)

Agents can build and verify criteria 1–3 and 7 fully. Criteria 4–6 concern evidence from real tester attempts, and **no human playtest has occurred**. Do not simulate one. For the review artifact:

- Identify the actual build (revision), configuration and rules versions, and all three starting conditions.
- Record only automated and agent-executed runs. Label them explicitly as automated, not tester play. Mark any run blocked by a defect.
- Keep the sections for observed choices, tester explanations and interpretation separate. Where no tester data exists, say so plainly. Never invent player quotations, enjoyment claims or decisions.
- Set the boss gate explicitly to **HOLD**, with the evidence: no human playtest attempts recorded. Attribute it by role and session label (for example "P11 Implementer, automated session"), noting that the independent Reviewer will confirm or contest it. The plan states that absent or inconclusive evidence cannot open the gate.
- State that no fair Apex/Shadow comparison or production-combat selection has been completed (criterion 7).
- Add a short "how to run a real attempt" section: start a preset, export the record, replay it with `just poc-001-replay`, and fill in this artifact. This lets the user run human attempts later.

## Context

- `docs/CURRENT.md` (current through P10) and `docs/plans/README.md`.
- The P11 plan, `docs/playtests/TEMPLATE.md` and `README.md`, and the prototype README contracts.
- Handoffs `docs/mailbox/p10-playable-patrol/implementer.md` and `fix.md` (UI, command stream, browser scripts and `test-browser`), and `docs/mailbox/p08-patrol-round-loop/implementer.md` (transcripts, replay).
- Tooling: Bun, Docker by default. Request escalation; do not use host mode for application checks.
- Testing follows ADR-0006 and `ruach-testing`. **Do not freeze provisional defaults in any assertion, unit or browser.** Replay equality should compare a record against the real transitions under the record's own stored rules and version. Use explicit test-owned inputs for exact arithmetic. Reviews of P07, P09 and P10 each blocked on this, and the Reviewer will probe by changing defaults.

## Acceptance

1. Criteria 1–3 and 7 are met with executed evidence:
   - export and replay of each deterministic fixture trace reproduce the final state and event order;
   - reset starts a new record;
   - rejected inputs are never replayed as successes;
   - malformed or unsupported records fail specifically and safely.
2. Criteria 4–6 are met within the human-evidence boundary above: an honest artifact and an explicit HOLD gate.
3. The full suite, typecheck, build, `just poc-001-test-browser` (including the P11 browser export check) and a `just poc-001-replay` run on an exported record all pass. Existing tests are unedited.

## Verification

On the final committed candidate, run:

- `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build`;
- `just poc-001-test-browser`;
- `just poc-001-replay` on at least one record exported through the real browser UI;
- one malformed record and one unsupported-version record, each showing its specific failure;
- `git diff --check`;
- the unedited-tests check against BASE.

Record exact commands, exit codes, counts and the tested revision. Keep the exported records you used as small durable evidence under `docs/mailbox/p11-reproducible-playtests/`.

## Restrictions

- Do not edit `docs/CURRENT.md`, `docs/TASK_LOGS.md`, ADRs, the brief, plans, the index or `docs/playtests/TEMPLATE.md`. Propose corrections in your report.
- Do not merge, push, rebase, or delete branches or worktrees. Disposable files go in the OS temp directory.

## Expected output

Commit this assignment unchanged with your report at `docs/mailbox/p11-reproducible-playtests/implementer.md`. Start the report with the `ruach-handoff` YAML block. Run the validator with `--repo /opt/dev/tehom-brainlab-p11` until it returns `ok: true`. Terminal handoff: report path, report SHA, technical candidate SHA, pass/fail summary, the playtest artifact path and gate status, and blockers.
