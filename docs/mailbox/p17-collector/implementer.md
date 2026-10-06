task: P17
role: implementer
author: p17-implementer
status: blocked
outcome: "Stopped before implementation under the plan's protected-file rule; configured Collector ward mitigation requires a bounded transition.ts exception."
baseline: 9abd506351f9726cadd71f5d8fdb46d228f1a1dc
revision: 9abd506351f9726cadd71f5d8fdb46d228f1a1dc
tested_revision: 9abd506351f9726cadd71f5d8fdb46d228f1a1dc
artifacts:
  - docs/mailbox/p17-collector/assignment-implementer.md
  - docs/mailbox/p17-collector/implementer.md
changed_paths:
  - docs/mailbox/p17-collector/assignment-implementer.md
  - docs/mailbox/p17-collector/implementer.md
verification:
  - "bun /tmp/p17-configured-ward-probe.ts: exit 0; reproduced configured reduction 1 being replaced by 2 in live dispatch, preview and default exported ability rules. Explicit applyAbility uses reduction 1 correctly."
  - "git diff --check: exit 0 before report creation."
  - "git diff --exit-code: exit 0 before report creation; all tracked source and tests untouched."
  - "bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p17-collector/implementer.md --repo /opt/dev/tehom-brainlab-p17: exit 0; ok true."
  - "Required full recipes, Collector browser harness, gameplay, exports/CLI replay, screenshots and manual-checklist verification: not run because implementation stopped before source edits."
review: not-run
discoveries:
  - "P15's configured-mitigation fix hard-codes the Crucible encounter in commandAbilityRules; adding Collector content and its codec does not activate its configured directional reduction."
  - "Assignment report destination p17-collector supersedes the plan's p17-roaming-boss-and-adds spelling; no plan edited."
blockers:
  - "P17 protects src/core/transition.ts and requires stopping if it must change. Coordinator authority is needed to include Collector in commandAbilityRules while retaining patrol behavior and all existing tests."

Assignment: [assignment-implementer.md](assignment-implementer.md). Contract: [P17 plan](../../plans/2026-10-06-79371edf-poc-001-roaming-boss-and-adds.md). Branch `p17-collector`. No product implementation, existing-test edits, merge or push. The tested SHA above identifies the baseline inspected and probed; it does **not** claim completed P17 verification. The report-creating commit is returned in the terminal handoff.

## Scope conflict and concrete proposed exception

The plan's fixture specifies: “The reduction is the encounter's `damageRules.directionalReduction` (default 2).” Its protected-path paragraph names `src/core/transition.ts` and says: “If one must change, stop and report why.” These are explicit assignment requirements, rather than an inferred approval policy.

At [transition.ts:17](../../../poc-001-linked-formation/src/core/transition.ts#L17), `commandAbilityRules` selects configured directional reduction only when `encounter?.id === 'crucible'`. Collector has a distinct encounter identity and its own configuration. With that identity registered, the function still supplies `DEFAULT_ABILITY_RULES` to live `applyAbility`; `previewCommand` uses the same dispatcher, and `createRunRecord` takes its default ability configuration from the same function. A custom Collector ward reduction therefore silently loses its effect everywhere. The provisional default of 2 conceals this defect.

The minimal proposed exception is to allow `src/core/transition.ts`'s `commandAbilityRules` condition to include `collector`, together with its explanatory comment. Proposed condition after the Collector registry entry exists:

```ts
return encounter?.id === 'crucible' || encounter?.id === 'collector'
  ? { ...DEFAULT_ABILITY_RULES,
      damageRules: { ...DEFAULT_ABILITY_RULES.damageRules,
        directionalReduction: encounter.rules(state as EncounterState).damageRules.directionalReduction } }
  : DEFAULT_ABILITY_RULES;
```

This preserves patrol's delivered default behavior, the remaining P14 ability amounts and rules, explicit replay overrides, and the existing Crucible fix. Additive Collector tests should exercise a test-owned reduction that differs from the default across live commands, preview and export/replay. No existing-test edit is needed or requested. Moving this dispatch policy into the allowed selector/content/codec paths would couple unrelated owners or misidentify the encounter; the proposed bounded change belongs at its existing owner.

## Reproducer and results

Ran `bun /tmp/p17-configured-ward-probe.ts` from the repository root at the baseline; exit **0**, all diagnostic assertions passed. The disposable script registered an in-memory `collector` entry in the public `ENCOUNTERS` registry, with the planned `collector-v1` codec identity and rules accessor. No repository file changed. It supplied test-owned HP 90, a ward at the centre facing 0, Compact orientation 0, Ugallu's Claw, and configured directional reduction 1. These are diagnostic inputs, not assertions about product composition, cells, facings, HP or tuning. A rejected test-only end-phase stub allowed immediate preview inspection; no forecast or Collector end-phase behavior was claimed.

Observed public outputs:

| Boundary | Configured reduction | Applied/serialized reduction | Damage |
| --- | ---: | ---: | ---: |
| Registry rules accessor | 1 | 1 | — |
| `commandAbilityRules` / `applyCommand` | 1 | 2 | 2 |
| Immediate `previewCommand` | 1 | 2 | 2 |
| `createRunRecord().configuration.abilityRules` | 1 | 2 | — |
| `applyAbility` with explicit rules and raw Claw 4 | 1 | 1 | 3 |

Preview state and ordered events matched the live dispatcher exactly, confirming that both reproduce the same incorrect configured amount. The script asserted this mismatch to establish the diagnosis and returned exit 0; no existing test was run or failed. Scratch script: `/tmp/p17-configured-ward-probe.ts`. The durable table above preserves its evidence.

## Verification not run

No completed implementation candidate exists, so these mandated checks remain **not run**, with no exit code claimed:

- `just poc-001-test`
- `just poc-001-typecheck`
- `just poc-001-build`
- `just poc-001-test-browser` (no Chrome selected)
- Collector browser harness and gameplay through an outcome
- Export and `just poc-001-replay` for patrol, Crucible and Collector
- Preview/commit comparison across relocation and ward eligibility
- Six requested screenshot inspections and the combined manual checklist against a real P17 build

No comparison traces or observed route/ward tables exist yet. There was no prototype dependency installation, server launch, port collision or process cleanup. The source conflict was found during the required pre-edit inspection, and the explicit stop rule applies to the whole implementation assignment.

Initial handoff validation exited **2** with `DEPENDENCY_UNAVAILABLE`. `bun install --frozen-lockfile` from `.agents/skills/ruach-handoff` initially exited **1** because the sandbox makes `.agents` read-only; repeating that command with approved sandbox escalation exited **0**, installing only ignored validator dependencies. No generated tracked file changed. Final validation uses the exact assigned command and succeeds.

Assignment SHA-256: `f5999d45943c3fbfdbe79fec774c09aa9b410d5797f774e8b605bb122b7cd988`; committed unchanged. Protected source, all existing tests, generated agent files, plans, ADRs, brief, CURRENT and TASK_LOGS remain untouched. Resume requires the Coordinator's bounded exception above; after it, implementation and all final-candidate checks remain to be completed.
