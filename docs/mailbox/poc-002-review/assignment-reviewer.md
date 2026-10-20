# Assignment: independent review of POC 002 (task P2-REVIEW)

Issued by: Coordinator, 2026-10-19. Role: **reviewer**. Task ID: `P2-REVIEW`.

## Workspace

- Worktree `/opt/dev/tehom-brainlab-p2-review`, branch `p2-review`, at `28d68ad`. That is the integration branch `poc-002-component-combat` evidence head.
- **Review range:** `19af724..28d68ad`, where `19af724` is master `c82ec3c` plus the council commit.
- **Reviewed implementation revision:** `1b57b0f`. The commits after it record evidence only; confirm this with `git diff --stat 1b57b0f 28d68ad`.
- Write only your report. Commit it with this assignment, unchanged, on `p2-review`. Do not push or merge.
- Disposable files go under the OS temporary directory.
- Do not load any `ruach-workflow-*` skill.

## What to review

POC 002 component combat was built from:
- a decision record: `docs/adr/0007-poc-002-component-combat.md`;
- a brief holding the complete numerical rules: `docs/prototypes/poc-002-component-combat.md`, including Amendment A2 and the §12 amendment for unfinished records;
- a plan with checkpoints Q01–Q10: `docs/plans/2026-10-19-db0bad72-poc-002-component-combat.md`.

The work was implemented by separate Implementers and integrated by an integration owner. Inputs:
- checkpoint handoffs: `docs/mailbox/poc-002-q01/` … `poc-002-q10/`;
- merge reports: `docs/mailbox/poc-002-integration/merge-*.md`;
- the final integrated verification: `docs/mailbox/poc-002-q09/implementer.md`.

Coordinator-granted ownership exceptions, each recorded in its handoff:
- **Q03:** replaced only the Q01 replay-deferred test assertion.
- **Q04:** replaced only the Q01 sweep/probe-deferred assertions.
- **Q08:** a narrow routing, resource and disposal change in `src/view/app.ts`.
- **Q09:** an opt-in cue-request observer in `src/audio/index.ts`.
Verify that each stayed within its stated bounds.

## Acceptance conditions

1. **Rules conformance.** The core implements the brief's §1–§13 and Amendment A2: round ordering E1–E6, damage, statuses, the six forms, enemy schedules, the Warden pulse, the Salve, rejection precedence, and the E01–E51 edge cases. All tuning comes from content, not code. Sample the highest-risk rules yourself and probe them with your own black-box checks. Don't rely only on the existing tests.
2. **Plan acceptance.** Every checkpoint's numbered acceptance list and the whole-plan criteria 1–5 are met on `1b57b0f`.
3. **Boundaries.**
   - `src/core/**` and `src/harness/**` do not import Phaser, view, audio or browser globals.
   - Previews go through the real `applyCommand`, and the UI never computes rules itself.
   - Nothing under `poc-001-linked-formation/`, `shared/`, `assets/`, `docs/CURRENT.md` or `docs/TASK_LOGS.md` changed in the range.
   - No new dependencies beyond POC 001's pins.
4. **Records and parity.** Records embed content, the full initial state, commands with per-command expected events, and the final state. The parity corpus replays. Hostile records are rejected without unsafe behaviour. Unfinished-attempt exports replay to the exported state. Integer-only content and records hold up for the later C# port.
5. **Tests.** Tests follow ADR-0006: black-box first, using test-owned content variants. Exact v1 numbers appear only in versioned parity fixtures. No test was weakened. Exceptions Q03, Q04 and Q09 left Q06's tests and the Q05 battle harness intact.
6. **Documentation.** The root `README.md`, `docs/README.md` and the prototype README match the actual commands and behaviour.
7. **Bare verification passes when you run it yourself**, from the repository root, with no `POC002_*` or Chrome overrides:
   - `just poc-002-install`
   - `just poc-002-typecheck`
   - `just poc-002-test`
   - `just poc-002-build`
   - `just poc-002-test-browser`
   - `just poc-002-replay poc-002-component-combat/fixtures/parity/seed-ugallu-warden.json`
   - `just poc-002-sweep --quick`
   - `just poc-002-probe`

   Also smoke-test `just poc-002-dev`: start it, check that the server answers, then stop it.

Out of scope: balance quality. The sweep and probe flags are evidence for the user, not defects. Also out of scope: human playtesting, C#/Godot work, and changes to the brief's design decisions. Report a design concern as optional unless it breaks a stated rule or contract.

## Report

Write `docs/mailbox/poc-002-review/reviewer.md` with a ruach-handoff block:
- `source_baseline: 19af724`
- `reviewed_revision: 1b57b0f`
- `evidence_revision: 28d68ad`

Include:
- a pass or fail verdict for each acceptance condition 1–7, with evidence;
- each finding classified **blocking** or **optional**, with file:line and a reproduction;
- the exact commands you ran and their results.

Validate the report with a copy of `.agents/skills/ruach-handoff` in the OS temporary directory: run `bun install --frozen-lockfile` there, then `bun <copy>/scripts/validate.ts <report> --repo .`. Commit the report and this assignment. Reply with the verdict and the number of blocking and optional findings.
