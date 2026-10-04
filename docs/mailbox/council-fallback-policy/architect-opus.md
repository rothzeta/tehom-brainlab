task: COUNCIL-fallback
role: architect
member: opus
status: complete
outcome: "Recommend user-confirmed route changes only: no automatic fallback, a single same-route relaunch after worker death, and a guidance-only change in coordinator.md"
source_baseline: 0b5acdf
artifacts:
  - docs/mailbox/council-fallback-policy/architect-opus.md
  - docs/mailbox/council-fallback-policy/assignment-council.md
verification:
  - "Read routing catalogs, ruach-herdr SKILL/routing/adapters, agent-routing doc, .agents/README.md, coordinator.md, reviewer.md, ruach-workflow-feature"
  - "Inspected live Herdr 0.9 CLI: agent states are idle, working, blocked, done, unknown (herdr agent wait --help); agent list/get/read exist"
  - "Handoff validator (skill copied to session scratch and installed there with --frozen-lockfile, so the worktree has no node_modules): bun validate.ts <report> --repo . exited 0, ok true, source_baseline resolved to 0b5acdf0a4e9"
discoveries:
  - "Herdr has no quota or model-error state; those failures appear only as pane text, so detection is a judgment call that should be shown to the user"
  - "'Independent' review in reviewer.md:3 and ruach-workflow-feature:78 means a separate worker, not a different model"
blockers:
  - "User decision: adopt user-confirmed policy (recommended) and whether standing per-task pre-authorization is allowed"

# Council report (opus): model-fallback policy

## 1. Recommendation

Use **user-confirmed fallback**. Do not add automatic fallback. The Coordinator detects a failure, gathers the evidence, and proposes the declared alternative. It switches routes only after the user approves, or under a standing instruction the user gave for the current task. The one exception is a relaunch on the *same* route after a worker dies. That is not a route change, so the Coordinator may do it once without asking, and it tells the user afterwards.

Reasons:
- **The user has already decided this.** The user rejected the Coordinator's switch of 5 of 9 workers. The catalog already says "Alternatives are explicit operator choices via --route, never error fallbacks" (`.agents/roles.yaml:2`), and `.agents/README.md:35` says "Alternatives never trigger automatically, including after a start failure." Automatic fallback would reverse a stated policy to save one confirmation per incident.
- **Automatic fallback could not be reliable.** The failures that matter (quota, model error) are not visible at launch (`.agents/skills/ruach-herdr/SKILL.md:40`), and Herdr has no state for them. The only states are `idle|working|blocked|done|unknown` (`herdr agent wait --help`). Any automatic trigger would depend on scraping pane text, and a wrong match would quietly spend the other provider's quota.
- **The cost of a switch is large.** Switching changes which provider and quota are spent and can change review diversity. Both are the user's call.
- **"No fallback at all" goes too far.** A clear rule for detection, proposal and relaunch stops the Coordinator from improvising, which is what went wrong on 2026-10-04.

## 2. Triggers and detection

| Condition | Switch route? | Reliable detection with existing tools |
|---|---|---|
| Harness or model unavailable at launch | Propose | Launcher exit `3` (`SKILL.md:46`; `docs/exploitation/agent-routing.md:30`). The diagnostics are deterministic. |
| Uncertain start | No, inspect first | Exit `4`, `submission_state: unknown`. Inspect the reported pane before any relaunch (`SKILL.md:46`; `references/adapters.md:43`). |
| Quota exhausted mid-session | Propose | The worker goes `idle`/`done` with no committed handoff, and `herdr agent read <name>` shows a limit or usage error. This is a heuristic, so quote the text to the user. |
| A low quota footer (e.g. 11%) | No | Mention it to the user when planning new launches. It is a warning, not a failure. |
| Model or API error | Propose only if it persists | Same as quota: pane text. Nudge the worker once via Herdr first, because transient errors often recover. |
| Worker death (pane gone) | No: one same-route relaunch | The name is missing from `herdr agent list` or `herdr agent get` fails. Then check `git log`/`git status` in its worktree. |
| Slow progress | Never | There is no reliable signal. Message the worker. If it is truly stuck, ask the user. |
| "Use a different model for review" | Never on Coordinator judgment | Not a failure. See §4. |

## 3. Procedure

1. **Who decides.** The user decides route changes. The Coordinator may only (a) inspect, (b) nudge the worker once through Herdr, (c) relaunch once on the same route after a confirmed death, and (d) propose.
2. **Ask.** The proposal names the worker, role, current route, the evidence (exit code, or a short pane excerpt), the state of the worktree, and the declared alternative from `roles.yaml`. It never proposes an undeclared route.
3. **Standing authorization.** The user may say something like "if Codex quota runs out during task X, use Claude for remaining workers." The Coordinator records that instruction and applies it only within that task. It does not extend to later tasks.
4. **Order of alternatives.** Use the role's `alternatives` list in its declared order. Each role currently has exactly one alternative (`.agents/roles.yaml:8-17`), and the coordinator role has none.
5. **Retry limits.** Same route: at most one relaunch per worker after a death. Never relaunch after exit 3, because an identical retry cannot succeed. Alternative route: one attempt per approval. After a second failure, stop and report a blocker.
6. **Partial uncommitted work.** The Coordinator never discards it (`.agents/agents/coordinator.md:70`) and never commits it, because it must not implement (`coordinator.md:48`). Before relaunching, close the old pane only if it is dead or the user approved. The replacement worker gets the **same worktree**. Its assignment states the predecessor's last commit and says the uncommitted changes are an unreviewed draft: inspect them, then keep and finish them, or report. Discarding them needs user approval.
7. **Notification.** Tell the user about every relaunch and every route change in the next status message, even when a standing instruction covered it.

## 4. Interactions

- **Reviewer independence is not a model policy.** The repository requires an *independent reviewer* (`.agents/agents/reviewer.md:3`; `.agents/skills/ruach-workflow-feature/SKILL.md:78`). That means a separate worker and context, with no access to the implementer's transcript except when needed (`coordinator.md:33`). If the user wants model diversity for review, they should put it in routing data, for example reviewer preferring Claude. It must not come from Coordinator judgment at launch time. Today implementer and reviewer share a preferred route (`roles.yaml:12-17`), so same-model review is the configured default.
- **Worktrees and handoff.** A replacement inherits the predecessor's worktree, branch and assignment file. The Coordinator writes a new `assignment-<worker>.md` for the replacement and leaves the original in place, keeping it durable as `docs/mailbox/` requires. The replacement's handoff records the route it actually ran on, and `outcome` or `discoveries` note that it replaced another worker. The handoff schema needs no change, since extra metadata is allowed.
- **CURRENT/TASK_LOGS.** Only the Coordinator records these (`coordinator.md:72`). Each incident gets a TASK_LOGS line with the worker, original route, trigger, evidence, user decision or standing instruction, and replacement route. CURRENT changes only if a route change outlives the task, which would be a `roles.yaml` edit.

## 5. Minimal change set

**Guidance only.** No changes to the `roles.yaml` schema, `scripts/agent-routing.py`, or ruach-herdr code. The launcher's no-retry, no-fallback contract (`SKILL.md:30,38`; `references/routing.md:27`) stays correct. Fallback is a Coordinator decision, not something the launcher does. `roles.yaml:2` and `.agents/README.md:35` stay true as written.

**One file:** `.agents/agents/coordinator.md`. Add this after the Delegation paragraph at line 16:

> ### Route changes
>
> Launch each worker on its role's preferred route. Choosing a different route is the user's decision. Never switch to an alternative on your own judgment, including for quota pressure or model diversity in review.
>
> When a launch exits 3, or a worker stops with harness quota or model errors visible in its pane output, inspect the pane and worktree, nudge the worker once if the error may be transient, then ask the user. Report the evidence and the declared alternative from `roles.yaml`. Apply a standing user instruction only within the task it was given for. Never relaunch after exit 3 on the same route. After exit 4, inspect the reported pane before any relaunch.
>
> If a worker's pane dies, you may relaunch it once on the same route in the same worktree, then tell the user. A second failure is a blocker.
>
> A replacement worker gets a new assignment naming the predecessor's last commit and any uncommitted changes as an unreviewed draft to inspect and finish or report. Never discard or commit that work yourself.
>
> Record every relaunch and route change in TASK_LOGS with trigger, evidence, decision, and routes.

No change to `ruach-workflow-feature`. The rule lives in the role, so it applies under every workflow.

## 6. Risks and open questions

- **Detecting quota from pane text is a heuristic.** Error messages change between harness versions. Because the user confirms, a misread costs one question rather than a wrong switch.
- **Confirmation delay.** An unattended run stalls until the user answers. Standing per-task instructions reduce this. *Question:* should standing instructions be allowed at all, or should every switch be asked individually?
- **Same-route relaunch without asking.** *Question:* is one automatic same-route relaunch acceptable, or should that also be confirmed?
- **Review diversity.** *Question:* does the user want reviewer model diversity? If yes, change the reviewer's preferred route in `roles.yaml`. It should not be a runtime rule.
- **Proactive quota planning.** When the footer shows low quota, should the Coordinator warn before launching new Codex workers? This report recommends a warning only, never a pre-emptive switch.
- **Uncertain cause of pane death.** The vanished pane's cause is unknown. If deaths turn out to correlate with quota exhaustion, the same-route relaunch will fail predictably, and the retry limit of 1 caps that waste.

## Validation

I ran the ruach-handoff validator against a scratch copy of the skill so that no dependency install landed in the worktree. It exited 0 and resolved `source_baseline` 0b5acdf. That checks the report's structure only, not the claims in it.
