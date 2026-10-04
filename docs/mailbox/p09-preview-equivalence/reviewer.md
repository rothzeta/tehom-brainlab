task: P09-review
status: complete
outcome: Request changes; two blocking findings, zero optional findings.
baseline: '35586e8'
reviewed_revision: 63b567ba2b92262624c6cb4cf6332091b7009dea
tested_revision: d88a4d8bdb83ec5bd2461453843acec802c5d1db
artifacts:
  - docs/mailbox/p09-preview-equivalence/reviewer.md
  - docs/mailbox/p09-preview-equivalence/assignment-reviewer.md
verification:
  - "Docker full suite: exit 0, 427 tests in 10 files; 972 matrix comparisons, each repeated."
  - "Docker typecheck and build: exit 0."
  - "P04 browser: exit 0, 177 assertions, 18 captures, zero exceptions."
  - "P09 browser: exit 0, 24 assertions, two captures, zero exceptions; both screenshots inspected."
  - "Docker boundary probes: exit 0; reproduced R1 and demonstrated R2's valid tuning scenario."
  - "Technical-content identity, unchanged existing tests and candidate whitespace checks: exit 0."
  - "Handoff validator: exit 0, ok true, no diagnostics."
review:
  - "Independent source and contract review completed; request changes."
discoveries:
  - "Default fixtures pass; invalid selector tuning can throw before the real forecast rejection is returned."
blockers:
  - "R1: accepted immediate commands can throw in previewFacts instead of returning a preview with a rejected forecast."
  - "R2: a browser assertion freezes provisional default splash recipients."

Author: P09 Reviewer. Authority: unchanged [assignment](assignment-reviewer.md), [P09 plan](../../plans/2026-10-02-d28ae958-poc-001-preview-equivalence.md), [policy](../../../.agents/policy.md), [ADR-0006](../../adr/0006-contract-invariants-and-black-box-testing.md), [testing skill](../../../.agents/skills/ruach-testing/SKILL.md), and [handoff skill](../../../.agents/skills/ruach-handoff/SKILL.md).

Reviewed scope: all six technical files in `35586e8..63b567b`, plus surrounding dispatcher, abilities, damage, lifecycle, intention selectors, patrol content, round transition, formation, existing view tests and browser wiring. Tests ran at `d88a4d8`, whose application content is identical to `63b567b`; its five added files are only the Implementer assignment/report and browser evidence. No source or test was modified. The review recording commit is a later evidence-only successor; its SHA is returned in the terminal handoff.

## Findings, ordered by severity

### R1 — blocking: selector exceptions break preview/transition equivalence

Location: [src/core/preview.ts:112](../../../poc-001-linked-formation/src/core/preview.ts#L112), with throwing selector calls at lines 50 and 60.

Failure scenario: create a healthy patrol with otherwise unchanged rules and either `splashRadius: -1` or `closeThreshold: -1`; preview `expand` at revision 0. The real `applyCommand` accepts that maneuver and returns revision 1. Ending from its candidate returns `ok:false`, `error.code:'invalid-amount'`, and empty events. `previewCommand` instead throws `RangeError` while gathering before/after facts, before reaching the real end-phase transition. This contrasts with `warderDamage: -1`, which correctly returns the accepted immediate preview and rejected forecast.

Why it matters: the public preview contract promises the real immediate transition plus an honest conditional forecast. Invalid forecast tuning must not convert an accepted immediate command into an uncaught presentation failure. The new test at `tests/preview.test.ts:225` covers invalid damage only, missing invalid selector parameters. No factory validation or dispatcher precondition excludes these inputs: `createPatrol` accepts the supplied rules, and the shared end-phase boundary deliberately returns a typed rejection.

Evidence: the read-only Docker probe below executed twice with exit 0. Both failing cases left live serialized bytes unchanged, but returned no preview. Exact output summaries:

| Rule override | Real immediate result | Real end-phase result | Preview result |
| --- | --- | --- | --- |
| `warderDamage: -1` | accepted | `invalid-amount` | accepted immediate preview, rejected forecast |
| `splashRadius: -1` | accepted | `invalid-amount` | `RangeError: Splash radius must be a nonnegative safe integer` |
| `closeThreshold: -1` | accepted | `invalid-amount` | `RangeError: Close threshold must be a nonnegative safe integer` |

Suggested direction: preserve the real immediate result and real forecast rejection when selector facts cannot be obtained; expose unavailable facts explicitly rather than inventing fallback rule values or rejecting an otherwise accepted immediate command. Add focused contract coverage for invalid selector tuning, including any Shelter threshold path. Leave validation/resolution ownership in the existing core boundaries.

### R2 — blocking: browser test freezes default splash tuning

Location: [tests/browser-preview.mjs:95](../../../poc-001-linked-formation/tests/browser-preview.mjs#L95); its fixture is `createPatrol()` at line 79.

Failure scenario: a permitted change of default patrol splash radius from 2 to 4 makes Censer's Spread splash correctly hit all three living Brood. The view consumes the stored radius and displays `→ ugallu, girtablilu, pazuzu`. The hard-coded assertion requires `Mark patrol:1:censer at (-2,2) → girtablilu`, so it fails even though preview, real impact and the displayed recipients agree.

Why it matters: assignment acceptance condition 1 explicitly prohibits freezing provisional defaults. ADR-0006 and the [ownership table](../../plans/README.md#ownership-of-provisional-defaults) keep encounter tuning in P08. This test uses uncontrolled default content while asserting a literal recipient list. The focused unit fixtures correctly supply explicit radius 2; the browser assertion should protect rendering correctness across allowed tuning too.

Evidence: the Docker probe supplied valid `splashRadius: 4`, applied the real maneuver, then independently used `selectRecipients` with the stored radius. It returned `['ugallu','girtablilu','pazuzu']`, while line 95 requires Girtablilu as the sole displayed recipient. This is a demonstrated core variation and a source-verified browser assertion failure scenario; a rebuilt browser with changed defaults was **not** run, and no production defaults were edited.

Suggested direction: derive browser expected anchors and recipient lists from the independent committed snapshot and existing public selectors, or explicitly control the browser fixture's tuning. Preserve the controlled golden recipient cases in unit tests. Review adjacent literal availability/link expectations against the same rule; this finding is specifically demonstrated for splash recipients.

No optional findings. No alternate damage, targeting, mitigation or legality calculation was found in `preview.ts`: transitions use real `applyCommand`, facts delegate to existing selectors, and deltas/change sets summarize their results. The overall implementation is appropriately bounded; these findings do not call for a redesign.

## Acceptance assessment

| Condition | Assessment |
| --- | --- |
| P09 AC1 — immediate equivalence | Passed for the executed matrix and rejection fixtures; R1 prevents full acceptance at the invalid-forecast boundary. |
| AC2 — immutable ownership and cancellation | Passed. `structuredClone` owns snapshot/command data before transition and recursive freezing; the forecast gets another clone. Tests exercise frozen inputs, repeated calls, external input mutation and cancellation. No live reference is frozen through `previewCommand`. |
| AC3 — Shelter expansion and Warder kill | Passed controlled golden fixtures and real transition comparisons. |
| AC4 — positions, recipients and legality | Passed controlled Impale, Crosswind, area/mark and fallen-target fixtures; R2 violates the separate test-contract requirement. |
| AC5 — conditional end-now result | Passed default/controlled fixtures, defeat, and invalid damage; R1 leaves invalid selector tuning unhandled. Forecast label and excluded-choices disclosure are present; next-round announcement/start events are excluded from `enemyEvents`. |
| AC6 — illegal/stale confirmation | Passed. Generation rejects reset/fresh-fixture handles; revision rejects intervening accepted commands; confirmation submits the original cloned command. `commit` retains `CommandResult`; default P04 checks pass unchanged. |
| AC7 — terminal and duplicate-live-event protection | Passed final-enemy kill, repeated preview/cancellation and single real confirmation tests. No audio consumer exists, so no future audio integration is claimed. |

The opt-in `?preview=patrol` panel is visibly labelled a patrol preview fixture, uses existing maneuver controls, and does not implement P10 combat controls. Default P04 remains covered by its unchanged browser test. Both Implementer screenshots and both independently generated P09 screenshots were opened and inspected: ghost destinations match committed positions; preview HP remains live until commit; the conditional label/disclosure is legible and disappears after commit. The summary extends below the initial viewport; full-page captures show it. Area/mark distinctions are tested at the public model boundary; this browser fixture shows ordinary marks only.

## Independent verification

All commands ran from `/opt/dev/tehom-brainlab-p09`. Existing dependencies were present, so install was not needed. Application checks used Docker with pinned Bun 1.4.2; browser probes and the handoff validator used the existing host Bun tooling. Initial un-escalated `just poc-001-test` exited 1 because the sandbox could not access Docker; the same command was rerun with escalation and passed. No host application-mode fallback or automatic approval rejection occurred.

| Exact command | Exit and evidence |
| --- | --- |
| `git diff --exit-code 63b567b d88a4d8 -- poc-001-linked-formation` | 0; identical technical content. |
| `git diff --check 35586e8..63b567b` | 0. |
| `git diff --exit-code 35586e8 63b567b -- poc-001-linked-formation/tests ':!poc-001-linked-formation/tests/preview.test.ts' ':!poc-001-linked-formation/tests/browser-preview.mjs'` | 0; existing tests unchanged. |
| `just poc-001-test` (escalated Docker) | 0; 427/427 tests in 10 files. Preview14, patrol48, abilities87, damage48, intents77, commands37, formation92, view19, assets3, smoke2. Matrix324 per preset; total972, accepted666, rejected306, each repeated. |
| `just poc-001-typecheck` (Docker) | 0; `tsc --noEmit`. |
| `just poc-001-build` (Docker) | 0; 9 assets, 23 modules; JS1,408.69kB/gzip368.29kB; existing large-bundle warning. |
| `just poc-001-preview` (Docker) | Server ready at localhost:4173; stopped with Ctrl-C, exit130 after both probes. |
| `docker ps --filter publish=4173 --format '{{.ID}} {{.Ports}}'` | 0; no remaining preview container. |
| `/home/metatron/.bun/bin/bun poc-001-linked-formation/tests/browser-lab.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p09-review-p04-browser` | 0; 177 assertions, 12 fixtures, 3 modes, 18 captures, zero uncaught exceptions; two intentionally blocked image requests. |
| `/home/metatron/.bun/bin/bun poc-001-linked-formation/tests/browser-preview.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p09-review-preview-browser` | 0; 24 assertions, two captures, zero uncaught exceptions. Both browser checks used HeadlessChrome148.0.7778.96 at 1280×800. |
| `docker run --rm --init --user "$(id -u):$(id -g)" --volume /opt/dev/tehom-brainlab-p09/poc-001-linked-formation:/app:ro --volume /tmp/p09-review-probe.ts:/probe.ts:ro --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 bun /probe.ts` | 0 on two runs; first exercised R1, second repeated R1 plus R2's radius4 variation. |
| `/home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p09-preview-equivalence/reviewer.md --repo /opt/dev/tehom-brainlab-p09` | 0; `ok:true`, no diagnostics; baseline/reviewed/tested revisions resolved. |

Essential disposable probe logic, retained here for reproducibility (imports are from `/app/src/content/patrol.ts`, `/app/src/core/transition.ts`, `/app/src/core/preview.ts`, and `/app/src/core/intents.ts`):

```ts
const command = { kind: 'maneuver', maneuver: 'expand', expectedRevision: 0 };
for (const field of ['warderDamage', 'splashRadius', 'closeThreshold']) {
  const state = createPatrol('healthy', { ...DEFAULT_PATROL_RULES, [field]: -1 });
  const bytes = JSON.stringify(state);
  const immediate = applyCommand(structuredClone(state), command);
  assert(immediate.ok);
  const ended = applyCommand(structuredClone(immediate.state), {
    kind: 'endPhase', expectedRevision: immediate.state.revision });
  assert(!ended.ok && ended.error.code === 'invalid-amount');
  try { console.log(field, previewCommand(state, command, 0)); }
  catch (error) { console.log(field, String(error)); }
  assert.equal(JSON.stringify(state), bytes);
}
const varied = createPatrol('healthy', { ...DEFAULT_PATROL_RULES, splashRadius: 4 });
const commit = applyCommand(varied, command);
assert(commit.ok);
const censer = commit.state.declaredIntentions.find(i => i.sourceId === 'censer');
assert.deepEqual(selectRecipients(commit.state, censer,
  commit.state.patrolRules.splashRadius).recipientIds,
  ['ugallu', 'girtablilu', 'pazuzu']);
```

Report validation establishes only schema/revision correctness. No human playtest, browser matrix, mobile verification, audio integration, P10 controls or rebuilt browser tuning variation was performed. Disposable probe/browser outputs remain in `/tmp`; all durable unique finding evidence is in this report. Assignment SHA-256 before/after: `9078e37a7bd414a9052c0fc8fb8bf75c043ed139fe4608f2a97a074429e408fc`. No protected documents, generated agent resources, plans or ADRs were edited; no merge, push, rebase, branch or worktree deletion occurred.
