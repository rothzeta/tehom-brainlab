---
task: routing-p02 — Slice A repository model routing, then Slice B P02 formation algebra
status: complete
outcome: Both slices implemented, verified on combined revisions, independently reviewed, accepted, and fast-forwarded to local master. No push, publication or deployment.
artifacts:
  - docs/mailbox/agent-routing/implementer.md
  - docs/mailbox/agent-routing/reviewer.md
  - docs/mailbox/agent-routing/delivery.md
  - docs/mailbox/p02-formation-algebra/implementer.md
  - docs/mailbox/p02-formation-algebra/verification.md
  - docs/mailbox/p02-formation-algebra/reviewer.md
  - docs/mailbox/p02-formation-algebra/delivery.md
  - docs/mailbox/routing-p02/coordinator.md
  - master
verification:
  - "Slice A (worker evidence): just test-agent-routing 16/16 pass at 23decc2 (Implementer), at 70f9657 (Reviewer) and on delivered master 28ae38b, and again on P02-delivered master 7e964c3; resolver probes and invalid-config failures as expected."
  - "Slice B (worker evidence): just poc-001-test tests/formation.test.ts exit 0 (90 tests, 3349 assertions), just poc-001-typecheck exit 0, full just poc-001-test exit 0 (92 tests), just poc-001-build exit 0 (existing Phaser chunk-size warning) at 29d9616/803da5d; formation test + typecheck repeated on delivered 7e964c3."
  - "The Coordinator ran no checks, reviews, integration or merges itself; it ran only routing resolve/start launch commands and herdr prompt waits."
discoveries:
  - "Docker is inaccessible inside the Codex worker filesystem sandbox; P01/P02 Docker-backed checks ran after Codex automatic approval review granted daemon access (route uses --approve-for-me). No dialog was approved by the Coordinator or user."
  - "Unrelated versioned-agent-skills* branches/worktrees advanced independently during the run and were left untouched."
blockers: []
---

Author: Coordinator (Claude, profile `claude-opus-5.5-high`, native `claude-opus-5-5`, effort high, launched by the parent bootstrap). Date: 2026-10-04 UTC. Baseline `c6083e892285b43c297c742ff28553ae3e2e7310`. Workflow: ruach-workflow-feature (Coordinator only; workers received self-contained assignments, kept in ignored `.agents/scratch/routing-p02/assignments/`). Scout/Architect not used: the assignment and the existing P02 plan were adequate. A worker-owned documentation-only commit saves this report; its SHA is returned in the terminal handoff, not here.

## Slice A — repository model routing

| Item | Reference |
| --- | --- |
| Candidate / tested technical revision | `23decc2acef5793777c408b908fc69d3e55aee7d` |
| Reviewed revision | `70f96579d725dbe2505842d0d6b2aa9016aabe40` (docs-only successor of 23decc2) |
| Delivered revision (local master, fast-forward from c6083e8) | `28ae38beabfd0150011988326f9bb87db865db60`; delivery evidence `e3f60372a5fef279f92ed14caead48271247405f` |
| Review findings | None material, none blocking, no optional changes; 8/8 criteria pass ([reviewer](../agent-routing/reviewer.md)) |

Delivered: `.agents/{models,routing,roles}.yaml` (catalog keys `gpt-6.1-sol` → codex/`gpt-6.1-sol`, `claude-opus-5.5` → claude/`claude-opus-5-5`; routes `gpt-6.1-sol-high`, `claude-opus-5.5-high`, effort high; Coordinator Claude-only, Architect Claude/alt GPT, Scout/Implementer/Reviewer GPT/alt Claude), `just agent-routing resolve|start` via justfile → bin → scripts, `just test-agent-routing`, schema/prereq docs (Python 3.11+, PyYAML). No optional Coordinator-role edit was made. Details: [implementer](../agent-routing/implementer.md), [delivery](../agent-routing/delivery.md).

## Slice B — P02 formation algebra

| Item | Reference |
| --- | --- |
| P01 prerequisite | Verified at base `e3f6037` by the Implementer (P01 tests and typecheck exit 0) |
| Initial candidate / tested | `3570610406886f18ca08c51effc79b3e8f3ddd34`; reviewed at `fb0a352` |
| Review finding R1 (blocking) | Enumeration test compared `JSON.stringify` of Formation objects, freezing noncontractual property order (ADR-0006). Fixed at `29d9616f2ebdb69c83d12f66089495bca6f7f723` (tests only; production geometry unchanged) |
| Final candidate / tested | `29d9616f2ebdb69c83d12f66089495bca6f7f723` |
| Re-reviewed revision | `803da5df5f34b387be3bb5ccce3cd7cbd733f90b`; R1 resolved, criteria 1–10 pass, no remaining findings |
| Delivered revision (local master, fast-forward from e3f6037) | `7e964c30a29abd1fb10613713bc205ef037b1f80`; delivery evidence `f0e5c41` |

Ring table, numbered acceptance evidence for plan criteria 1–6, exhaustive coverage (90 tests / 3349 assertions) and serialized orientation-zero Compact/Spread examples: [implementer](../p02-formation-algebra/implementer.md), [verification](../p02-formation-algebra/verification.md); independent check of that evidence: [reviewer](../p02-formation-algebra/reviewer.md); delivery: [delivery](../p02-formation-algebra/delivery.md).

## Actual routes and live launch evidence

| Worker | Role | Launch path | Profile → harness / native model / effort | Herdr pane | Codex session |
| --- | --- | --- | --- | --- | --- |
| routing-p02-a-impl | implementer (Slice A impl + merge) | parent bootstrap (`/tmp/brainlab-routing-p02-bootstrap.py codex`) | gpt-6.1-sol-high → codex / gpt-6.1-sol / high | w2G:pM | 01a104c3-de57-7d01-965f-05530b4768c3 |
| routing-p02-a-review | reviewer (Slice A) | parent bootstrap | gpt-6.1-sol-high → codex / gpt-6.1-sol / high | w2G:pQ | 01a104d2-a2ab-7022-a9d9-5ee735778ff7 |
| routing-p02-b-impl | implementer (P02 impl, R1 fix, merge, final commit) | `just agent-routing start implementer routing-p02-b-impl --route gpt-6.1-sol-high` (delivered routing) | gpt-6.1-sol-high → codex / gpt-6.1-sol / high | w2G:pV | 01a104df-3122-73b2-a8d5-638c955ceec0 |
| routing-p02-b-review | reviewer (P02 review + re-review) | `just agent-routing start reviewer routing-p02-b-review --route gpt-6.1-sol-high` | gpt-6.1-sol-high → codex / gpt-6.1-sol / high | w2G:pW | 01a104ec-9f39-75e1-803b-f3fef0a8fa4d |

Slice B launches used the delivered routing tooling; `start` exited 0 and emitted the resolved argv (`codex --approve-for-me -m gpt-6.1-sol -c model_reasoning_effort="high" -c developer_instructions=<redacted> -c skills.config=<redacted>`). The live evidence is that Herdr started Codex sessions with these arguments and each completed its assignment; model availability is not otherwise asserted. Session IDs come from the `herdr agent prompt --wait` results.

## Lifecycle

Each of the 8 assignments (A-impl, A-review, A-merge, B-impl, B-review, B-fix-R1, B-rereview, B-merge), plus the final recording prompt to routing-p02-b-impl, was delivered once with `herdr agent prompt <worker> <text> --wait` inside a Claude background Bash task with no timeout; the task completion notification woke the Coordinator. All waits exited 0 (agent status `done`/`idle`). No `agent get/read`, TaskOutput, sleeps or timed retries were used; no blocked/stalled/error event occurred, so no lifecycle read was needed; no prompt was resubmitted. After each completion the Coordinator read only the durable handoff header plus `git status/log`.

Deviations: the Coordinator itself ran the routing `resolve`/`start` launch commands (launch coordination, not technical work). Slice A workers used the parent bootstrap because routing was not yet verified. Codex automatic approval review (route flag `--approve-for-me`) granted Docker daemon access for P01/P02 checks inside worker sandboxes; neither the user nor the Coordinator approved any dialog.

## Limitations

- Live evidence covers only the GPT route; the `claude-opus-5.5-high` worker route and the Claude-route Coordinator launch through `just agent-routing start coordinator` were exercised only by stub tests (the Coordinator itself was started by the parent bootstrap).
- Codex `skills.config` disabling uses SKILL.md paths (reviewer found official examples supporting this); live workflow-skill invisibility in Codex workers was not separately probed.
- P02 geometry is the plan's proposed experimental mapping; defaults are documented as experimental in the prototype README.
- No push, publication or deployment.
