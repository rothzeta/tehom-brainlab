# Assignment: route selection policy — delivery and push (task ROUTE-merge)

Issued by: Coordinator, 2026-10-04. Role: implementer (integration owner). The review (`reviewer.md`, `b82fa70`) passed with no findings. The Coordinator committed its CURRENT/TASK_LOGS record on the branch at `569bc70`. Do not change content. **The user explicitly authorized pushing master to origin for this delivery.**

1. Commit this assignment unchanged on `council-fallback-policy`.
2. Confirm that the main checkout `/opt/dev/tehom-brainlab` is clean and that both local master and `origin/master` (after `git fetch origin`) are at `0b5acdf`. If either has advanced, STOP and report.
3. Confirm that `git diff --name-only b82fa70 HEAD` lists only `docs/CURRENT.md`, `docs/TASK_LOGS.md`, and this assignment.
4. `git -C /opt/dev/tehom-brainlab merge --ff-only council-fallback-policy`.
5. On delivered master, run `just test-agent-routing`.
6. Write `docs/mailbox/council-fallback-policy/delivery.md` in the main checkout, in ruach-handoff format. Cover: the reviewed revision, the delivered revision, the merge outcome, the checks, and the push target. Validate it and commit it on master.
7. `git -C /opt/dev/tehom-brainlab push origin master` (a fast-forward push; never force). Confirm afterwards that `origin/master` equals local master, and record the push result in the delivery report only if it can be done without another commit. Otherwise report the result in your reply.
8. Do no cleanup; the Coordinator handles it. Reply with a 3-line summary: the delivered SHA, the pushed SHA, the checks.
