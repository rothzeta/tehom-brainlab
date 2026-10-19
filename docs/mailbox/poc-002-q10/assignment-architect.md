# Assignment: POC 002 checkpoint Q10 (human-test protocol template)

Issued by: Coordinator, 2026-10-19. Role: **architect**. Task ID: `P2-Q10`.

## Workspace

- Worktree `/opt/dev/tehom-brainlab-poc002`, branch `poc-002-component-combat`, at `15c922d`. This is the integration branch.
- Commit only the files below. Do not push.
- Do not load any `ruach-workflow-*` skill.

## Scope

Write checkpoint **Q10** exactly as defined in `docs/plans/2026-10-19-db0bad72-poc-002-component-combat.md`, section "Q10 — Human-test protocol template". The owned file is `docs/playtests/poc-002-human-test-protocol.md`. Add an entry to `docs/playtests/README.md` only if the plan's Q10 acceptance requires one; if you need any other path, stop and ask (S4).

The template is **not executed**. It must:
- describe how the first external test is run and recorded;
- tie each observation to the brief's hypotheses and falsifiers;
- follow the existing playtest structure (`docs/playtests/TEMPLATE.md`).

Label commands that do not exist yet as proposed. They are delivered by later checkpoints.

## Restrictions

- No application code.
- No CURRENT or TASK_LOGS edits.
- No changes to the brief, plan or ADR. If Q10 exposes a gap in them, report it instead.

## Hand-back

- **Report:** `docs/mailbox/poc-002-q10/architect.md` with the ruach-handoff block. Use `source_baseline: 15c922d` and give the `candidate_revision` of your commit.
- **Checks:** run the link check and `git diff --check`.
- **Validation:** validate the report with your temporary-directory copy of the validator, and record the result.
- **Commit:** commit the template, this assignment unchanged, and the report.
- **Reply:** the SHA and a one-line summary.
