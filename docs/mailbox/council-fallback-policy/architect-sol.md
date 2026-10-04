task: COUNCIL-fallback
author: sol
role: architect
status: complete
outcome: Recommend user-confirmed route changes with bounded recovery and optional explicit advance authorization.
source_baseline: 0b5acdf
artifacts:
  - docs/mailbox/council-fallback-policy/architect-sol.md
verification:
  - Inspected routing catalogs, launcher implementation, adapter evidence, Coordinator and reviewer roles, feature workflow for context only, and handoff contract.
  - Installed Herdr help confirms agent get, agent read, and pane list inspection commands.
  - 'Repository validator: /home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/council-fallback-policy/architect-sol.md --repo . exited 2, DEPENDENCY_UNAVAILABLE; no repository dependencies installed.'
  - 'Scratch validator: /home/metatron/.bun/bin/bun /tmp/sol-handoff-guvej6iu/ruach-handoff/scripts/validate.ts docs/mailbox/council-fallback-policy/architect-sol.md --repo . exited 0, ok true, no diagnostics; source_baseline resolved. Unchanged skill copy used existing matching ajv 8.20.0 and yaml 2.9.1 dependencies.'
  - No live quota, fallback, worker-death, or paid-session behavior was reproduced.
review: not-run
discoveries:
  - Startup success does not establish quota or model access; uncertain submission requires inspection before replacement.
blockers: []

## Recommendation and verified baseline

Adopt **user-confirmed fallback in Coordinator guidance**, retaining a launcher that performs one explicitly selected launch. Route choice belongs to the user. Explicit advance authorization may cover named roles, triggers, routes, and task duration; general delegation permission does not authorize changing models. With such authorization, notify and act within its bounds without asking again.

This formalizes existing routing intent: alternatives are operator choices (`.agents/roles.yaml:2`). Architect prefers Claude with Sol available; scout, implementer, and reviewer prefer Sol with Claude available; Coordinator has only Claude (`.agents/roles.yaml:4–17`). Profiles specify high effort, and the catalog supplies native identities (`.agents/routing.yaml:3–8`; `.agents/models.yaml:3–8`). Only Claude/Codex have launch-capable preparation; this does not prove account access (`.agents/skills/ruach-herdr/SKILL.md:40`). The wrapper delegates once, forwarding an explicit route (`scripts/agent-routing.py:156–164`).

The quota percentages, unauthorized substitutions, and vanished pane are assignment-supplied observations, not independently reproduced. They justify a recovery procedure, not inferred entitlement telemetry or an automatic substitution engine.

## Triggers and detection

Use launcher JSON diagnostics, phase, pane, and submission state together with fresh `herdr agent list`, `agent get NAME`, `agent read NAME --source recent-unwrapped --lines 120`, and pane inventory/output. These are evidence channels, not a universal failure classifier. Coordinator monitoring already covers working/blocked/done states (`.agents/agents/coordinator.md:35`).

| Condition | Evidence and response |
| --- | --- |
| Quota exhausted | A fresh native quota-exhaustion refusal blocking a turn, or explicit operator confirmation, supports proposing a switch. A declining percentage does not. Preflight does not establish entitlement (`.agents/skills/ruach-herdr/scripts/worker.ts:82`). |
| Harness unavailable | Exit 3 plus diagnostic identifying the selected executable/capability supports proposing its declared alternative. Missing Herdr/context or shared prerequisites requires repair; changing models does not fix it (`.agents/skills/ruach-herdr/scripts/worker.ts:63–79`). |
| Model/access error | Fresh native output explicitly refusing the selected model supports proposing a switch. Authentication problems require user action. A generic timeout or one transient service error supports investigation, not an inferred permanent failure. |
| Worker death | Compare agent and pane inventory, read surviving output, and seek confirmation the prior process ended. Missing recognition or a vanished pane establishes lost visibility, not quota exhaustion or task completion. Prefer recovery on the selected route. |
| Slow progress | Request a status/checkpoint and inspect blocking UI. Elapsed time, silence, or working/unknown state alone never authorizes a model switch. |
| Invalid/uncertain launch | Root exit 1 and launcher exit 2 indicate setup/data errors; repair them. Exit 4 requires inspecting submission state and reported pane before any replacement (`docs/exploitation/agent-routing.md:30`; `.agents/skills/ruach-herdr/scripts/worker.ts:91–112`). |

Native error wording and Herdr recognition can vary; there is no verified machine-readable quota detector in this launcher. Never interpret `done` as an accepted handoff (`.agents/agents/coordinator.md:50–56`).

## Decision and recovery procedure

1. Pause only affected work. Preserve launch diagnostics and a concise, sanitized symptom record. For uncertain startup, inspect before resubmission: the launcher deliberately retains material and never retries (`.agents/skills/ruach-herdr/references/adapters.md:43`).
2. Recommend a concrete original → replacement route, evidence, partial-work disposition, and task scope. Ask the user unless an existing explicit authorization covers this incident. While awaiting a decision, continue independent work. No reply means no route change.
3. Alternatives remain eligible choices, not an automatic chain. Propose the role's declared alternatives in listed order, excluding the failed route; explicit user selection takes precedence. Currently each worker role has one alternative. Coordinator has none: stop and seek operator recovery; do not bypass the Claude-only root policy (`scripts/agent-routing.py:106–107`).
4. Allow at most one same-route recovery attempt per incident, after a diagnosed transient condition has cleared and prior submission/process state is reconciled. Do not retry known exhausted quota or unsupported capability. An authorized switch gets one replacement start; further failure returns to the user. No cycling through models.
5. Before another worker writes, establish exclusive ownership. Request a checkpoint if the old worker responds; otherwise delegate inspection of retained HEAD, tracked changes, untracked files, and available evidence to a recovery worker. Preserve the original worktree and branch; never reset, clean, stash indiscriminately, or delete partial work. Reuse the worktree only after confirming the old writer ended. If that cannot be established, retain it and pause recovery writes rather than creating competing owners.
6. Launch a uniquely named replacement with `--route` and the retained worktree. Supply the original assignment plus a bounded recovery supplement recording approved route and inherited work. The replacement verifies inherited changes, identifies surviving commits, and produces its own validated handoff; prior verification applies only to its reported revision. Coordinator collects evidence without taking over technical inspection (`.agents/agents/coordinator.md:48–56`).

## Review, records, and minimal changes

Reviewer independence means a separate worker reviewing the exact candidate against acceptance conditions, not a mandatory different model. The current workflow requires an independent Reviewer (`.agents/skills/ruach-workflow-feature/SKILL.md:78–84`), while implementer and reviewer share a preferred route. Model diversity may be explicitly requested; it never independently authorizes substitution. Preserve review requirements after recovery.

Proposed changes: add the procedure to `.agents/agents/coordinator.md`; link it from `docs/exploitation/agent-routing.md`. No schema, catalog values, launcher code, wrapper, or workflow changes are needed. Keep `.agents/roles.yaml:2` intact. Proposed core rule:

> Use the selected route. Change it only on the user's explicit instruction or advance authorization covering the role, trigger, replacement, and task. Low quota, slow progress, and review diversity do not authorize substitution. Reconcile uncertain submission and preserve partial work before recovery. Record evidence and authority for every replacement.

Coordinator alone records incident, routes, authority, attempts, pane/worktree disposition, recovered revision, and handoff links in TASK_LOGS; CURRENT summarizes actual active/delivered state and blockers, never expected success (`.agents/agents/coordinator.md:70–72`). Cleanup remains governed by preservation requirements.

## Risks, decisions, and readiness

Confirmation can delay recovery; explicit bounded advance authorization can reduce that delay. Switching changes cost, quality, and available session context; it cannot transfer an unrecorded conversation. False failure classification and overlapping writers are the main operational risks. User decisions: accept this default, optionally authorize particular fallback routes for a task, and optionally request model diversity for review. Guidance is ready for implementation after policy acceptance. No automatic detector or unsupported-harness work is proposed.
