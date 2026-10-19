task: P2-Q02
status: needs-decision
outcome: Stopped before implementation under S1; poison victory versus transformation HP loss requires a brief amendment
source_baseline: 87b1441
artifacts:
  - docs/mailbox/poc-002-q02/assignment-implementer.md
  - docs/mailbox/poc-002-q02/implementer.md
verification:
  - "Source inspection only; application install/typecheck/test/build not run because S1 requires stopping"
  - "Handoff validator: exit 0; ok true; baseline resolved; no diagnostics"
review: not-run
discoveries:
  - "Brief §3.4 orders E1 poison, E2 transformation HP loss, E3 outcome; §13 E02 instead specifies immediate poison victory with E1 → E3"
blockers:
  - "S1: Coordinator must route the end-of-round outcome timing question below to the Architect for a brief amendment"

# Implementer handoff — P2-Q02

Author: Implementer. Worktree `/opt/dev/tehom-brainlab-p2-q02`, branch `p2-q02`.
Assignment: [unchanged Coordinator assignment](assignment-implementer.md).
Inspected source baseline: `87b14414bde8c7610a8c3723c018f8056aa41c35`.

## Stop condition and exact question

Stopped before editing implementation files, as required by assignment Notes for Q02 and [plan S1](../../plans/2026-10-19-db0bad72-poc-002-component-combat.md#non-goals-and-stop-conditions): “the brief is ambiguous, contradictory or silent on a rule. Do not invent the rule.”

The [brief §3.4](../../prototypes/poc-002-component-combat.md#3-round-structure), lines 121–123, orders the end of round as E1 poison ticks, E2 Girtablilu's transformation HP loss, then E3 outcome check. The same brief's [§13 E02](../../prototypes/poc-002-component-combat.md#13-edge-cases-an-implementer-must-not-guess), line 306, states that the last enemy killed by a poison tick produces “Immediate victory at the end of that unit (E1 → E3 for ticks).” These permit different outcomes when E2 could kill the last living Brood.

**Question for the Architect:** At the start of E1, suppose Girtablilu is the only living Brood, is transformed, and has HP no greater than its configured E2 HP loss. The last living enemy has life no greater than its poison P. Poison kills that enemy at E1. Must the core immediately check the outcome, grant victory, end the transformation and reset Revelation, skipping E2 (the apparent §13 E02 reading)? Or must it still apply E2 HP loss, kill Girtablilu, and return defeat at E3 under §3.4–§3.5?

No interpretation has been implemented or asserted in tests.

The Coordinator should route this question for an authoritative brief amendment, then reassign/resume Q02. This report proposes no replacement rule or tuning change.

## Work and scope

Read the assignment, consumer policy, Implementer role, testing and handoff skills, plan and stop conditions, brief, ADR-0006/ADR-0007, Q01 handoff, existing core contracts/content loader, shipped content and representative existing tests. Confirmed the assigned branch and baseline. No application code, content, tests, fixtures, dependency pins, public contracts or protected documents changed. No merge, rebase or push performed.

Changed paths are only this report and the unchanged assignment. Assignment SHA-256 before recording: `abb181195712adaf034abc1eed4d02d50fd578a9e7b0bffa26f086a7ff195476`.

There is **no implementation commit or tested implementation revision**. Accordingly `candidate_revision` and `tested_revision` are omitted rather than misidentifying the baseline or the evidence-only report commit as an implementation. The report-creating commit is returned in the terminal handoff.

## Acceptance and verification status

| Q02 acceptance | Evidence/status |
| --- | --- |
| 1–2: atomic commands, revisions and enemy phase | Not implemented or tested; S1 stop. |
| 3: exact round/unit ordering and E1–E6 | Blocked by the question above. |
| 4–6: components, damage, statuses, actions and forms | Not implemented or tested; S1 stop. |
| 7: named E01–E50 tests except E45 | Not implemented; E02 conflicts with one reading of §3.4. |
| 8–10: targeting, gauntlet and previews | Not implemented or tested; S1 stop. |
| 11: seed parity records and replay | Not generated or tested; S1 stop. |
| 12: simulation boundary test | Not implemented or tested; S1 stop. |
| 13: content-driven rules and test tuning | No implementation or test assertions added. |

Required bare application checks were not run; stopping on S1 takes precedence over proceeding with implementation/verification. No prerequisite workaround or environment override was attempted.

| Exact command | Exit | Result |
| --- | --- | --- |
| `./poc-002-component-combat/bin/run install` | Not run | S1 stop before implementation. |
| `./poc-002-component-combat/bin/run typecheck` | Not run | S1 stop; no new implementation to check. |
| `./poc-002-component-combat/bin/run test` | Not run | S1 stop; no test/assertion count or seed replay output claimed. |
| `./poc-002-component-combat/bin/run build` | Not run | S1 stop; no new implementation to build. |

README section text: none supplied, because Q02 delivers no new application behavior in this handoff. Public contract additions/content corrections: none. Integration/merge outcomes: not assigned and not performed.

## Handoff validation

Copied `.agents/skills/ruach-handoff` to `/tmp/p2-q02-handoff.X4Wu9e/ruach-handoff`, then ran `bun install --frozen-lockfile` in the copied directory: exit 0, `6 packages installed [28.00ms]`.

From the worktree root:

```sh
bun /tmp/p2-q02-handoff.X4Wu9e/ruach-handoff/scripts/validate.ts docs/mailbox/poc-002-q02/implementer.md --repo .
```

Exit 0. Exact stdout:

```json
{"schema_version":1,"ok":true,"report":"/opt/dev/tehom-brainlab-p2-q02/docs/mailbox/poc-002-q02/implementer.md","repo":"/opt/dev/tehom-brainlab-p2-q02","revisions":[{"path":"/source_baseline","resolved":"87b14414bde8c7610a8c3723c018f8056aa41c35"}],"diagnostics":[]}
```

Reran validation after recording this evidence: exit 0, same resolved baseline and no diagnostics. No implementation verification or review is implied by handoff validation.
