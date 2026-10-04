# Assignment A-merge — deliver reviewed routing setup to local master (role: implementer)

Continue as the Implementer for routing. Independent review is complete: `docs/mailbox/agent-routing/reviewer.md` (currently uncommitted in the main checkout) reports reviewed_revision `70f96579d725dbe2505842d0d6b2aa9016aabe40`, no material/blocking findings, all 8 criteria pass. The Coordinator accepts the routing setup on that evidence.

Tasks:
1. Confirm local `master` is still `c6083e892285b43c297c742ff28553ae3e2e7310` (destination not advanced). If it advanced, stop and report `blocked`.
2. On `routing-setup`, make one documentation-only commit adding the Reviewer report unchanged and factual CURRENT/TASK_LOGS status updates (reviewed at 70f9657, accepted by Coordinator, local delivery). Do not modify executable/config/test content.
3. Fast-forward local `master` to that commit (no push/publication). Leave the main checkout on `master`, clean. Preserve the unrelated `versioned-agent-skills-20261004` worktree/branch and other branches.
4. Confirm delivered content: `git diff --exit-code 70f9657 <delivered> -- . ':(exclude)docs'` (or equivalent) shows technical content identical to the reviewed revision; rerun `just test-agent-routing` on delivered master and record result.
5. Write delivery evidence `docs/mailbox/agent-routing/delivery.md` (you own it; ruach-handoff fields: reviewed_revision, delivered_revision = an existing SHA, destination, merge outcome, relation to reviewed candidate, commands/results). Commit it as a documentation-only commit on master (do not name the SHA of that same commit inside it).
6. In your terminal handoff also give, for the Coordinator's next launches, the exact command to start a worker for a given role with explicit route `gpt-6.1-sol-high`, a given checkout path, and a given worker name (e.g. `just agent-routing start ...`), and whether it must be run from that checkout and requires HERDR_ENV/HERDR_PANE_ID. Also give the matching `resolve` dry-run command.

End with a concise ruach-handoff summary including final master SHA.
