# Assignment: delivery merge and global-link migration

Role: Implementer. Task: `ruach-extraction`. Worker name: `ruach-impl2`.

Independent review accepted the combined candidates with no blocking findings (`reviewer.md`, `reviewer-delta.md`; strengthened cases 05/06 pass). Deliver them locally. **Never push**; the user's launching parent publishes Ruach to GitHub afterwards.

## Accepted candidates

- Ruach `/opt/dev/ruach`, branch `extraction`, reviewed revision **`be77030727074d9c10e842c08647ad4a61232152`**.
- Brainlab branch `ruach-extraction`, reviewed source revision **`b02b3c67a00219fd197fe31265e0faa338243b06`**; branch head `0953148` (later commits are mailbox evidence only). Destination: `master` in the main checkout `/opt/dev/tehom-brainlab`, expected at `255ed6871ec3d7897e5a2ff481f2f4f62e3eb816`.

## Steps

1. **Ruach.** Confirm `extraction` still equals `be77030` and the tree is clean. Create `main` at exactly that commit (no new commits, no rewrite) and check `main` out so the working tree is on `main`. Keep `extraction` as is. Do not push or change the remote.
2. **Brainlab main checkout.** It has pre-existing uncommitted Librarian drafts that this task incorporated: modified `.agents/README.md`, untracked `.agents/agents/librarian.md` and `.agents/skills/ruach-librarian/`. Also untracked: `docs/mailbox/ruach-extraction/assignment-coordinator.md` — **do not touch, stage or commit it**; it belongs to the Coordinator.
   - Preserve the original drafts before anything else: write them as a patch, e.g. `git diff -- .agents/README.md` plus `git diff --no-index /dev/null <file>` for each untracked draft file, into `docs/mailbox/ruach-extraction/librarian-drafts.patch` in the **worktree** and commit it there (evidence-only) together with this assignment, before merging. Verify the patch reproduces the drafts byte-for-byte (e.g. apply to a temp copy of `255ed68` and compare).
   - Confirm `master` has not advanced from `255ed68`. If it has, stop and report.
   - Then restore `.agents/README.md` and remove the untracked draft files (only those three paths) in the main checkout, and fast-forward: `git merge --ff-only ruach-extraction`. If fast-forward is impossible, stop and report.
   - Confirm `git diff b02b3c6 master -- . ':!docs/mailbox'` is empty (delivered source equals reviewed source) and the main checkout status shows only the Coordinator's untracked assignment file.
3. **Post-merge checks on `master`** (record actual exit statuses): `just check-ruach`, `just check-ruach --source /opt/dev/ruach`, `just test-agent-routing`, `just agent-routing resolve librarian`. Install frozen Bun dependencies where the snapshot needs them (`bun install --frozen-lockfile` in `.agents/skills/ruach-herdr` etc.; Bun may be at `~/.bun/bin/bun`).
4. **Global-link migration (user-authorized; request native escalation for writes under the home directory).** In `~/.agents/skills/`, exactly three symlinks currently point into Brainlab: `ruach-handoff`, `ruach-harness-eval`, `ruach-herdr` → `/opt/dev/tehom-brainlab/.agents/skills/<name>`. Repoint each to `/opt/dev/ruach/skills/<name>` (same name). Do not create, remove or modify any other entry (e.g. `find-skills`, `herdr` are user-owned). Before repointing, run `bun install --frozen-lockfile` in each of the three `/opt/dev/ruach/skills/<name>` directories that has a lockfile (node_modules is gitignored). Verify: `readlink` of each link; each resolves to a `SKILL.md` with matching `name:`; `bun ~/.agents/skills/ruach-handoff/scripts/validate.ts <some valid Brainlab report> --repo /opt/dev/tehom-brainlab` exits 0; `bun ~/.agents/skills/ruach-herdr/scripts/worker.ts resolve --offline --name link-check --role reviewer --cwd /opt/dev/tehom-brainlab` exits 0; `git -C /opt/dev/ruach status --short` remains clean. Record the before/after link targets.
5. Do not edit `docs/CURRENT.md`/`docs/TASK_LOGS.md` (Coordinator-owned; it updates them next).

## Handoff

Write `docs/mailbox/ruach-extraction/implementer-merge.md` (ruach-handoff format; validate with `scripts/validate.ts`) in the **main checkout** after the merge, and commit it on `master` together with this assignment (it arrives in master via the merge if you committed it in the worktree first — then only add the report). Use an explicit pathspec so the Coordinator's untracked file is never committed. Report: Ruach `main` SHA; Brainlab `master` pre-merge and post-merge SHAs and the report commit SHA; relation of delivered content to the reviewed revisions; draft-preservation patch path/commit and its verification; check commands with exit statuses; global link before/after; anything left untouched; blockers. Then stop; the Coordinator removes the worktree.
