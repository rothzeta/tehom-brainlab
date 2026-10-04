# Assignment: council on a model-fallback policy (task COUNCIL-fallback)

Issued by: Coordinator, 2026-10-04. Role: architect (design and recommendation only; no implementation). The user asked for a three-member council: Claude Opus 5.5 high, GPT-6.1-Sol high, and Gemini 3.8 Flash high. Each member receives this same assignment and works **independently**: do not read the other members' reports (`architect-*.md` in this folder other than your own) while working.

## Workspace
Worktree `/opt/dev/tehom-brainlab-council` (branch `council-fallback-policy`, master `0b5acdf`). Write ONLY your report file. **Do not commit, stage, or edit any other file**; the Coordinator arranges committing. Do not load or follow any `ruach-workflow-*` skill.

## Question
Should the repository's agent launching gain a **model-fallback policy**, and if so, what exactly should it be?

## Current facts (verify against the sources)
- Routing data: `.agents/roles.yaml`, `.agents/routing.yaml`, `.agents/models.yaml`. Implementer, reviewer and scout prefer `gpt-6.1-sol-high` with alternative `claude-opus-5.5-high`. Architect is the reverse. Coordinator is Claude only. The roles.yaml header says: "Alternatives are explicit operator choices via --route, never error fallbacks."
- Launcher: the `ruach-herdr` skill (`.agents/skills/ruach-herdr/SKILL.md`, `references/routing.md`, `references/adapters.md`) and the root wrapper `just agent-routing` (`docs/exploitation/agent-routing.md`). They do no retries and no fallback. A prepared launch does not establish account access or model availability.
- Coordinator guidance: `.agents/agents/coordinator.md` and `.agents/skills/ruach-workflow-feature/SKILL.md` (read for context only).
- Observations from 2026-10-04:
  - The Codex pane footer showed the weekly limit dropping (17%, then 11%). Quota exhaustion is not detectable at launch time; it would surface mid-session.
  - The Coordinator switched 5 of 9 workers to the Claude alternative on its own, citing quota and "use a different model for review". The user rejected that: route choice belongs to the user unless policy says otherwise.
  - A worker pane once vanished mid-task without explanation; its committed work survived.
  - Only Claude and Codex adapters are launch-capable. Agy, OMP, Pi and OpenCode fail as unsupported.

## Your report must cover
1. **Recommendation:** no fallback / user-confirmed fallback / automatic fallback / another option. Give your reasons.
2. **Triggers and detection:** what conditions justify switching (quota exhausted, harness unavailable, model error, worker death, slow progress), and how the Coordinator can detect each reliably with the tools that exist (launcher exit codes, Herdr agent states, pane output).
3. **Procedure:** who decides, whether the user is notified or asked, the order of alternatives, retry limits, and what happens to a worker's partial uncommitted work.
4. **Interactions:** reviewer independence (should the reviewer differ from the implementer's model, and is that a policy at all?), worktrees and the handoff protocol, and recording in CURRENT/TASK_LOGS (Coordinator only).
5. **Minimal change set:** which files change (guidance versus `roles.yaml` schema versus launcher code), with proposed rule text. Prefer the simplest design. Do not anticipate harnesses that are not launch-capable.
6. **Risks and open questions** for the user.

Keep it under about 1,200 words. Cite file:line for claims about existing behavior.

## Output
Report: `docs/mailbox/council-fallback-policy/architect-<member>.md`, where `<member>` is `opus`, `sol`, or `gemini` as given in your prompt. Start with the ruach-handoff field block (`.agents/skills/ruach-handoff/SKILL.md`). Set `source_baseline: 0b5acdf` and give no candidate revision, since nothing is committed. If Bun is available, run `bun .agents/skills/ruach-handoff/scripts/validate.ts <report> --repo .` and record the result; otherwise say so. When done, reply with a 3-line summary: your recommendation in one sentence, and the report path.
