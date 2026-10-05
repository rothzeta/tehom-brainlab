# Assignment TBC-merge — deliver browser-check fix to local master (Implementer)

Role: `implementer`. You implemented this fix.

The independent review (`docs/mailbox/test-browser-chrome/reviewer.md`, committed at `47a4b27`) approved `e30cb0bf2fb579060ab9001ce330974739208279` with 0 findings, and the Coordinator accepts it.

1. Confirm that local `master` is still exactly `5b7c1913a07f9a8cfe473fafbdaa6fd9dbfb70f7` and that the main checkout is clean. If either is not true, stop and report.
2. Run `git -C /opt/dev/tehom-brainlab merge --ff-only test-browser-chrome`.
3. In the main checkout, in a shell with `POC001_CHROME` **unset**, run exactly what the user ran: `just poc-001-test-browser`. Then run `just poc-001-test` and `just poc-001-typecheck`. Confirm that `git diff --name-only e30cb0b master -- poc-001-linked-formation justfile` is empty.
4. Write `docs/mailbox/test-browser-chrome/delivery.md`, starting with the ruach-handoff YAML block: destination, destination_before, candidate_revision, reviewed_revision, delivered_revision, tested_revision, verification, outcome. Commit it on the branch together with this assignment, unchanged, then fast-forward master again with `--ff-only`. Run the validator with `--repo /opt/dev/tehom-brainlab` until it returns `ok: true`.

Do not push, delete branches or worktrees, rebase, or force. Do not edit CURRENT or TASK_LOGS.

Terminal handoff: delivered and final master revisions, check results, blockers.
