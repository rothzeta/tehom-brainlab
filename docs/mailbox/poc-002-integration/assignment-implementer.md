# Assignment: POC 002 integration owner (task P2-INT)

Issued by: Coordinator, 2026-10-19. Role: **implementer**, acting as the **POC 002 integration owner** defined in the plan `docs/plans/2026-10-19-db0bad72-poc-002-component-combat.md` (sections "Starting source and ownership" and "Implementation checkpoints"). Task ID: `P2-INT`.

## Workspace

- Worktree `/opt/dev/tehom-brainlab-poc002`, the integration branch `poc-002-component-combat`.
- Commit there only. Never push. Never merge into `master`; delivery is a separate, later assignment.
- Disposable files go in the OS temporary directory.
- Do not load any `ruach-workflow-*` skill.

## Standing role

You stay for the whole build. The Coordinator sends you one **merge step** at a time, naming a checkpoint branch and its accepted candidate revision. For each step:

1. **Confirm the branch is ready.** The named branch tip must contain the named candidate revision and its committed checkpoint handoff, and the branch's changed paths must stay inside that checkpoint's owned paths in the plan's ownership table. Check this with `git diff --stat <merge-base>..<tip>`. If a path is outside the owned paths, stop and report it.
2. **Merge.** Use `git merge --no-ff <branch>` into `poc-002-component-combat`. Resolve conflicts only where the resolution is mechanical and within the owned paths. Report any other conflict without resolving it.
3. **Add root just recipes** for commands whose implementation now exists. The root `justfile` POC 002 recipes are yours (ADR-0005; follow the existing `poc-001-*` recipe pattern exactly):
   - after Q01: `poc-002-install`, `-dev`, `-typecheck`, `-test`, `-build`, `-preview` and `-test-browser`;
   - after Q03: `poc-002-replay`;
   - after Q04: `poc-002-sweep` and `poc-002-probe`.
   Never add a recipe before its implementation exists. Update the root `README.md` recipe line and the POC 002 row status to match, keeping the wording minimal.
4. **Assemble the prototype README.** `poc-002-component-combat/README.md` belongs to you after Q01. Fold in the README section text from each checkpoint handoff.
5. **Run the full bare verification** from the repository root, exactly as a user would and without environment overrides: every `just poc-002-*` recipe that exists so far, with `just poc-002-dev` excepted because it is long-running. Smoke `just poc-002-dev` by starting it, confirming the server answers, then stopping it. Also run `just --list` and `git diff --check`, and confirm that `git diff --stat <step-base>..HEAD -- poc-001-linked-formation shared docs/CURRENT.md docs/TASK_LOGS.md` is empty.
6. **Report.** Write `docs/mailbox/poc-002-integration/merge-<qNN>.md` with a ruach-handoff block. Include:
   - `source_baseline`: the integration tip before the merge;
   - the merged branch and its candidate revision;
   - the merge commit and `combined_revision`;
   - the conflict resolutions;
   - the exact commands and results;
   - `tested_revision`;
   - any blockers.

   Validate the report with a copy of `.agents/skills/ruach-handoff` in the OS temporary directory: run `bun install --frozen-lockfile` there, then `bun <copy>/scripts/validate.ts <report> --repo .`. Commit the report, plus this assignment unchanged with your first report.
7. **Reply** with the combined revision, the report SHA, and a pass/fail line.

If verification fails after a merge, do not fix checkpoint code. Report the failing command and its output, and leave the merge commit in place unless the Coordinator says otherwise. Integration-only fixes need explicit Coordinator authorization (plan Q09 row).

## Restrictions

- No edits to POC 001, `shared/`, `assets/`, `docs/CURRENT.md` or `docs/TASK_LOGS.md`.
- No edits to the brief, the plan or ADRs.
- Plan stop conditions S1–S6 apply.
