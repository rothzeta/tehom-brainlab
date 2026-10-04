# Assignment: legacy scratch triage — local delivery (task CONV-triage-merge)

Issued by: Coordinator, 2026-10-04. Role: implementer (integration owner).

The triage and its R1 are accepted. The re-review (`triage-reviewer.md`, commit `b2dc4b3`) found no blocking findings. Do not change content.

1. Commit this assignment file unchanged on `agent-artifact-conventions`.
2. Confirm that the main checkout `/opt/dev/tehom-brainlab` has no tracked changes (the untracked `.agents/scratch/` is expected) and that master is still at `e70f49b1a6ca41e0aba4ff33015d9dc749439410`. If master has advanced, STOP and report.
3. `git -C /opt/dev/tehom-brainlab merge --ff-only agent-artifact-conventions`. No push.
4. On delivered master: run `just test-agent-routing`; check that `git diff --name-only b2dc4b3 master` lists only this assignment; check that all 33 assignment copies and both triage reports exist on master.
5. Append a "Triage delivery" section to `docs/mailbox/agent-artifact-conventions/delivery.md` in the main checkout. Cover: the reviewed revision, the delivered revision, the merge outcome, and the checks. Update its revision fields, validate it with `.agents/skills/ruach-handoff/scripts/validate.ts`, and commit it on master. Do NOT edit CURRENT.md or TASK_LOGS.md, and do NOT delete `.agents/scratch/` yet.
6. Reply with a 3-line summary (the delivered SHA, the report commit, the checks), then wait for the cleanup assignment.
