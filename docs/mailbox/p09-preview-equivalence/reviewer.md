task: P09-review
status: complete
outcome: R1 and R2 resolved at aac8068; approve with zero remaining blocking or optional findings.
baseline: '35586e8'
reviewed_revision: aac806868a211997258ca75fca52554f4ce01641
tested_revision: aac806868a211997258ca75fca52554f4ce01641
artifacts:
  - docs/mailbox/p09-preview-equivalence/reviewer.md
  - docs/mailbox/p09-preview-equivalence/assignment-reviewer.md
  - docs/mailbox/p09-preview-equivalence/assignment-rereview.md
verification:
  - "Re-review Docker full suite at aac8068: exit 0, 431 tests in 10 files; 972 matrix comparisons, each repeated."
  - "Docker typecheck and build: exit 0."
  - "P04 browser: exit 0, 177 assertions, 18 captures, zero exceptions."
  - "P09 browser: exit 0, 24 assertions, two captures, zero exceptions; both screenshots inspected."
  - "Re-review Docker boundary probes: exit 0; R1 exact immediate/forecast equality and immutability, R2 radius4 projection matches the public selector."
  - "Technical-content identity, unchanged existing tests and candidate whitespace checks: exit 0."
  - "Handoff validator: exit 0, ok true, no diagnostics."
review:
  - "Independent re-review completed; R1 and R2 resolved, approve with no remaining findings."
discoveries:
  - "Fact snapshots now expose availability; consumers must check before and after availability before interpreting change lists."
blockers: []

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

## Re-review of R1/R2 at aac8068

P09 Reviewer, 2026-10-05 UTC. Authority: unchanged [re-review assignment](assignment-rereview.md). **Verdict: approve; R1 and R2 resolved. Remaining findings: zero blocking, zero optional. No new material findings.** The preceding findings, acceptance assessment and verification describe the original review at `63b567b`; they remain historical evidence. This section and the updated leading YAML describe the fixed combined candidate.

Reviewed fix range: `61aac67..aac806868a211997258ca75fca52554f4ce01641`, exactly four technical files: core preview, its FormationLab consumer, P09 unit tests, and the P09 browser probe. The starting branch head was `eb24a939acf8022c345607de5803344f229aae05`, whose technical content is identical; it adds only the fix assignment/report. I read that handoff, inspected the complete fix and materially affected consumers, then temporarily checked out the exact `aac8068` revision for all final application, browser and probe checks. After stopping the preview server, I restored `p09-preview-equivalence` at `eb24a93` to record this re-review. No source/test edits were made.

### R1 disposition — resolved

[preview.ts:65](../../../poc-001-linked-formation/src/core/preview.ts#L65) wraps actual selector derivation: a selector `RangeError` yields `{available:false, reason}`. It does not validate rule values separately, substitute tuning, change the real command acceptance, or manufacture a forecast rejection. Other error classes still propagate. Immediate state/events/deltas and the real end-phase result remain independent of fact availability. Change lists are guarded by both fact snapshots' availability. [FormationLab.ts:159](../../../poc-001-linked-formation/src/view/FormationLab.ts#L159) uses the same discriminant and displays facts as unavailable rather than interpreting empty change lists as known absence; immediate HP and forecast outcome remain displayed independently. This is a small projection-boundary fix with no alternate rules path.

The original Docker probe now returns accepted immediate previews and typed `invalid-amount` forecasts for all three negative rule overrides. A strengthened independent probe compares exact immediate state/events and the entire real forecast transition against separate `applyCommand` calls, checks repeated equality on deeply frozen state/command input, recursively verifies frozen output, and verifies unchanged live bytes. All checks passed. `warderDamage:-1` retains available facts; `splashRadius:-1` and `closeThreshold:-1` expose unavailable before/after facts.

Coverage is adequate for the finding. [preview.test.ts:237](../../../poc-001-linked-formation/tests/preview.test.ts#L237) covers all three rule cases and repeated frozen input; additional tests cover an installed Shelter's invalid `damageRules.closeThreshold` and invalid facing in protection selection while the real immediate and end-phase transitions both accept. The latter confirms that selector unavailability cannot invent a rejection. Normal matrix/golden tests now explicitly require available facts, preserving their original behavior assertions. The full suite includes all 18 P09 tests, with no existing P01–P08 test edits.

### R2 disposition — resolved

[browser-preview.mjs:102](../../../poc-001-linked-formation/tests/browser-preview.mjs#L102) derives every threat's kind, anchor and recipients from the independent real committed snapshot through `selectRecipients` and stored `patrolRules.splashRadius`. It compares the whole DOM threat paragraph, so missing, extra or wrong displayed recipients fail; it never imports the preview module as its oracle. The adjacent link and ability assertions also derive expected output from public selectors/legality rather than provisional constants. The fix adds only DOM paragraph collection to the test snapshot and no production debug controls, query flags or mutable state surface.

The requested valid radius4 variation again produced all three Spread recipients. The strengthened probe also checked that the actual preview's Censer intention, cells, reason and recipients exactly match that independent public selector result. The revised browser comparator consumes this same stored-radius selector result, so it no longer requires the original radius2 recipient list. The default browser execution passed the exact whole-paragraph assertions. A rebuilt browser with changed defaults was not run; tuning independence is established here by source inspection and the headless variation, not claimed as an additional browser execution.

### Exact re-review verification

All final checks below ran with `HEAD` exactly `aac806868a211997258ca75fca52554f4ce01641`. Docker remained the application runner with pinned Bun1.4.2; browser checks used the established host Bun/Chrome tooling. Dependencies were present; no install was needed. A preliminary full suite at the starting evidence-only `eb24a93` also passed 431 tests; the full suite was then rerun at the exact assigned revision and only that final execution is used below.

| Exact command | Exit / result |
| --- | --- |
| `git diff --exit-code aac8068 eb24a93 -- poc-001-linked-formation` | 0; identical technical content. |
| `git diff --check 61aac67..aac8068` | 0. |
| `git diff --exit-code 35586e8 aac8068 -- poc-001-linked-formation/tests ':!poc-001-linked-formation/tests/preview.test.ts' ':!poc-001-linked-formation/tests/browser-preview.mjs'` | 0; all original tests unchanged. |
| `just poc-001-test` | 0; 431 tests in 10 files: preview18, patrol48, abilities87, damage48, intents77, commands37, formation92, view19, assets3, smoke2. Matrix972/666 accepted/306 rejected, each repeated. |
| `just poc-001-typecheck` | 0; `tsc --noEmit`. |
| `just poc-001-build` | 0; 9 assets, 23 modules; JS1,409.04kB/gzip368.41kB, CSS3.21kB/gzip1.27kB; existing large-bundle warning. |
| `just poc-001-preview` | Docker server ready on localhost:4173; stopped with Ctrl-C, exit130, after browser verification. |
| `/home/metatron/.bun/bin/bun poc-001-linked-formation/tests/browser-lab.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p09-rereview-p04-browser` | 0; 177 assertions, 12 fixtures, 3 modes, 18 captures, zero uncaught exceptions; two deliberately blocked image requests. |
| `/home/metatron/.bun/bin/bun poc-001-linked-formation/tests/browser-preview.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p09-rereview-preview-browser` | 0; 24 assertions, two captures, zero uncaught exceptions. |
| `docker run --rm --init --user "$(id -u):$(id -g)" --volume /opt/dev/tehom-brainlab-p09/poc-001-linked-formation:/app:ro --volume /tmp/p09-review-probe.ts:/probe.ts:ro --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 bun /probe.ts` | 0; original R1 probe and radius4 variation rerun, no preview exceptions. |
| `docker run --rm --init --user "$(id -u):$(id -g)" --volume /opt/dev/tehom-brainlab-p09/poc-001-linked-formation:/app:ro --volume /tmp/p09-rereview-probe.ts:/probe.ts:ro --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 bun /probe.ts` | 0; exact transition equality, frozen output, repeated frozen-input checks, unchanged live bytes and radius4 projection equality. |
| `docker ps --filter publish=4173 --format '{{.ID}} {{.Ports}}'` | 0; no remaining preview container. |
| `sha256sum docs/mailbox/p09-preview-equivalence/assignment-rereview.md` | 0; unchanged `b3ff849ba9640dd5e9505181feeb3ff55e72a4bc94d74077a5b41c4d834613b8`. |
| `/home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p09-preview-equivalence/reviewer.md --repo /opt/dev/tehom-brainlab-p09` | 0; `ok:true`, no diagnostics, all revision references resolved. |

Strengthened probe assertions, in addition to the original logic retained above: `preview.ok`, deep equality of immediate state/events, deep equality of the forecast transition after removing only `kind`, `condition` and `enemyEvents`, empty forecast enemy events, correct fact availability, `Object.isFrozen` recursively on every returned object, a second identical preview, and unchanged frozen-input serialization. For radius4 it deep-compares the full Censer threat to `{intention, ...selectRecipients(independentCommit, intention, storedRadius)}`. Probe output:

```json
{"field":"warderDamage","exactImmediateMatch":true,"exactForecastMatch":true,"unchangedFrozenInput":true}
{"field":"splashRadius","exactImmediateMatch":true,"exactForecastMatch":true,"unchangedFrozenInput":true}
{"field":"closeThreshold","exactImmediateMatch":true,"exactForecastMatch":true,"unchangedFrozenInput":true}
{"radius":4,"recipients":["ugallu","girtablilu","pazuzu"],"previewMatchesPublicSelector":true}
```

Both independently generated P09 screenshots were opened and visually inspected: destinations still match commit, the condition/disclosure is legible, and commit clears the preview/forecast. Browser captures and raw probes remain outside the repository in `/tmp`; this section preserves their unique review evidence. Browser execution used the default fixture; invalid-tuning DOM rendering was inspected in source rather than exercised through a new production debug surface. Other original review limitations still apply. No merge, push, rebase or protected-document change occurred. The report and unchanged re-review assignment are the only new review artifacts; the creating commit SHA is returned in the terminal handoff.
