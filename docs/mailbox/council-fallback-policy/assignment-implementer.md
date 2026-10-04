# Assignment: route selection policy — Implementer (task ROUTE-impl)

Issued by: Coordinator, 2026-10-04. Role: implementer. Commit this file unchanged with your work.

## Workspace
Worktree `/opt/dev/tehom-brainlab-council`, branch `council-fallback-policy`, BASE `0b5acdf` (equal to master and origin/master). Untracked files already present: `assignment-council.md`, `architect-opus.md`, and `architect-sol.md` in `docs/mailbox/council-fallback-policy/`. These are the council's durable reports, and you commit them unchanged. No merge or push yet.

## Context
The user approved this policy after a council (the Opus and Sol reports above). The user decisions are final; implement them as written.

## Edits (exact text; adjust only for surrounding Markdown style)
1. **`.agents/agents/coordinator.md`.** Add this section after the Delegation section:

```markdown
## Route selection

- Launch each worker on its role's preferred route unless the user selects a declared alternative.
- Change routes only with explicit user approval, an applicable task-scoped instruction, or the low-allowance rule below. Never switch on your own judgment for review diversity, speed, or cost.
- Low-allowance rule: when the preferred route's harness reports less than 2% of its subscription allowance remaining, you may launch new workers on the role's declared alternative. Leave active workers on their route. Tell the user, quoting the reported figure, and record the switch in TASK_LOGS.
- Otherwise, report the observed problem and propose the declared alternative. Do not infer exhaustion from low quota above that threshold, slow progress, or lifecycle state alone.
- Follow `ruach-herdr` for launch recovery. Before replacing a worker, confirm its previous execution has ended and its workspace is free; preserve partial work for the replacement to assess.
- Continue unrelated authorized work while awaiting a decision. Silence authorizes neither a route switch nor repeated attempts.
```

   Also check the Delegation section's existing route wording and remove anything that contradicts this section.

2. **`.agents/skills/ruach-herdr/SKILL.md`.** Next to the existing exit-code/"inspect the reported pane before launching again" text, add a concise launch-recovery paragraph:
   - Exit 2: fix the usage or config error.
   - Exit 3: read the diagnostic. A missing executable, Herdr context/kind, or native capability can be fixed, after which the same route can be relaunched. Exit 3 does not prove the model or account is unavailable.
   - Exit 4: inspect the reported pane and its `submission_state` before any relaunch.
   - Never send a new assignment into a session that is still working or waiting for input.
   - Route changes follow the caller's route policy; the launcher itself never falls back.
   Keep the skill self-contained. Do not change its scripts or tests.

3. **`.agents/roles.yaml` header comment.** Replace "Alternatives are explicit operator choices via --route, never error fallbacks." with "Alternatives are explicit choices via --route (user selection or Coordinator route policy), never automatic error fallbacks." Change only the comment. Then check that `.agents/README.md`, `docs/exploitation/agent-routing.md`, and `.agents/skills/ruach-herdr/references/routing.md` do not contradict the new policy. Fix any contradiction with minimal wording; leave statements that are still true (for example "alternatives never trigger automatically") unchanged.

Do NOT edit `docs/CURRENT.md` or `docs/TASK_LOGS.md` (they are Coordinator-only), historical reports, code, or tests.

## Verification
- `just test-agent-routing`, and `bun test` in `.agents/skills/ruach-herdr` and in `.agents/skills/ruach-handoff` (run `bun install --frozen-lockfile` first if needed). Confirm that `roles.yaml` still parses and validates.
- The skill format check on `ruach-herdr` (`python3 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py <dir>`).
- `git diff --check 0b5acdf..HEAD`.

## Handoff
Report: `docs/mailbox/council-fallback-policy/implementer.md`, in ruach-handoff format. Validate it with `.agents/skills/ruach-handoff/scripts/validate.ts`. Commit the edits, the council files, this assignment, and the report. Reply with a 3-line summary that includes the candidate SHA.
