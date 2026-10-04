# Assignment: non-destructive delivery retry

Role: Implementer. Task: `ruach-extraction`. Worker name: `ruach-impl2`.

This revises steps 2 and 4 of `assignment-implementer-merge.md` after native review refused (a) deleting the untracked draft files as irreversible and (b) a broad listing of the home skills directory. Use the lower-risk methods below. All other steps, checks, restrictions and the handoff from that assignment still apply. Never push.

## Authorization context

The user's instruction was "use gh to create the public repo in /opt/dev and do what we agreed to", following agreement to move reusable skills to Ruach and repoint selected global installations to it. This retry stays within that authorization; it does not bypass policy or change approval settings.

## Before merging

Commit this assignment unchanged in the worktree (evidence-only, like `9137038`) so it reaches `master` with the fast-forward.

## Step 2 (revised): archive instead of delete

1. Re-verify the committed `docs/mailbox/ruach-extraction/librarian-drafts.patch` (commit `9137038`) still reproduces the three draft paths in the main checkout byte-for-byte.
2. Create a fresh task directory with `mktemp -d` under the OS temp root (e.g. `/tmp/ruach-extraction-drafts-XXXXXX`) and archive the exact three draft paths there, preserving relative paths:
   - copy the bytes of the modified `.agents/README.md` into the archive, then restore its tracked baseline with `git restore -- .agents/README.md`;
   - **move** (not delete) `.agents/agents/librarian.md` and the directory `.agents/skills/ruach-librarian/` into the archive.
   Compare archive contents with the patch-reproduced drafts. Touch nothing else; leave `docs/mailbox/ruach-extraction/assignment-coordinator.md` alone.
3. Confirm `master` is still `255ed68`, then `git merge --ff-only ruach-extraction`. Confirm delivered source equals reviewed `b02b3c6` outside `docs/mailbox`.
4. Keep the archive until delivery is verified; report its path. Do not remove it — the Coordinator will release it after recording delivery.

## Step 4 (revised): exact known symlinks only

- Do **not** list `~/.agents/skills/`. Inspect only these exact paths: `/home/metatron/.agents/skills/ruach-handoff`, `/home/metatron/.agents/skills/ruach-harness-eval`, `/home/metatron/.agents/skills/ruach-herdr` (`test -L` and `readlink` each). Each is expected to be a symlink to `/opt/dev/tehom-brainlab/.agents/skills/<name>`; if any differs, stop and report.
- Save the old targets first (e.g. to `old-link-targets.txt` in the archive directory and in your report) so the change is reversible.
- Install frozen Bun dependencies in each `/opt/dev/ruach/skills/<name>` that has a lockfile, then repoint only those three symlinks to `/opt/dev/ruach/skills/<name>` (`ln -sfn`). Preserve every other path.
- Verify as in the original step 4, without listing the directory.

## If refused again

If any of these specific actions is refused, stop and report the exact stated reason for each refused action and what remains undone. Do not suggest that the user run commands in your pane and do not try another route. Never claim an operation occurred without verified evidence.
