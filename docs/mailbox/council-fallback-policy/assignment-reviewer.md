# Assignment: route selection policy — independent review (task ROUTE-review)

Issued by: Coordinator, 2026-10-04. Role: reviewer. Modify nothing except your report. Commit this assignment unchanged with your report.

## Change under review
Worktree `/opt/dev/tehom-brainlab-council`, branch `council-fallback-policy`. BASE `0b5acdf`, candidate `905f545`, evidence head `53629c9`. Review `0b5acdf..53629c9`. Inputs: `implementer.md` and `assignment-implementer.md` in `docs/mailbox/council-fallback-policy/`. The assignment holds the exact approved text. The council reports `architect-opus.md` and `architect-sol.md` are background.

## Acceptance conditions (user-approved policy, 2026-10-04)
1. `coordinator.md` contains the approved "Route selection" section, faithful to the assignment text, with no contradicting wording elsewhere in the role:
   - the preferred route by default;
   - changes only with user approval, an applicable task-scoped instruction, or the low-allowance rule;
   - under 2% harness-reported allowance: new launches only, user notified, the figure recorded;
   - no inferring exhaustion otherwise;
   - an ownership check before replacing a worker, with partial work preserved;
   - unrelated work continues, and silence authorizes nothing.
2. The `ruach-herdr` SKILL.md recovery guidance is accurate against the launcher's documented exit codes (`SKILL.md`, `references/adapters.md`, `references/routing.md`, and `scripts/worker.ts` if needed):
   - exit 2: fix usage or config;
   - exit 3: read the diagnostic; prerequisites may be fixable and the same route relaunched; exit 3 does not prove the model or account is unavailable;
   - exit 4: inspect the pane and `submission_state`;
   - never send a new assignment into a session that is still working or waiting for input;
   - the launcher never falls back.
   The skill stays self-contained.
3. Only the `roles.yaml` header comment changed, and it matches the policy. The catalogs still parse.
4. No current guidance contradicts the policy (check `.agents/README.md`, `docs/exploitation/agent-routing.md`, `references/routing.md`, AGENTS, and the workflow skill). Policy lives in the role and mechanics in the skill.
5. No scripts, tests, CURRENT, TASK_LOGS, or historical reports changed. The council reports are committed unchanged.

## Verification to run yourself
`just test-agent-routing`; `bun test` in `.agents/skills/ruach-herdr` and in `.agents/skills/ruach-handoff`; the skill format check (`python3 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/ruach-herdr`); `git diff --check 0b5acdf..53629c9`; `git diff --stat`.

## Output
Report: `docs/mailbox/council-fallback-policy/reviewer.md`, in ruach-handoff format, with a verdict per condition and each finding classified as blocking or optional. Validate it, then commit only the report and this assignment. Reply with a 3-line summary: the verdict, the blocking count, the commit SHA.
