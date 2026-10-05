task: P09-fix
status: complete
outcome: R1 and R2 corrected; committed fix passes all required verification, pending independent re-review.
fixed_revision: aac806868a211997258ca75fca52554f4ce01641
tested_revision: aac806868a211997258ca75fca52554f4ce01641
fix_baseline: 61aac67
baseline: '35586e8'
findings_addressed:
  - R1
  - R2
artifacts:
  - docs/mailbox/p09-preview-equivalence/fix.md
  - docs/mailbox/p09-preview-equivalence/assignment-fix.md
  - poc-001-linked-formation/src/core/preview.ts
  - poc-001-linked-formation/src/view/FormationLab.ts
  - poc-001-linked-formation/tests/preview.test.ts
  - poc-001-linked-formation/tests/browser-preview.mjs
verification:
  - "Focused Docker P09 tests: exit 0, 18 tests; full suite exit 0, 431 tests in 10 files."
  - "Docker typecheck and build: exit 0."
  - "Both Chrome probes: exit 0, P04 177 assertions and P09 24 assertions, zero uncaught exceptions."
  - "Reviewer R1 probe: exit 0, all three cases return accepted immediate previews and invalid-amount forecasts, with unchanged live bytes."
  - "Handoff validator: exit 0, ok true, four revisions resolved, no diagnostics."
  - "Whitespace, BASE test preservation and fix scope checks: exit 0; all 11 BASE test files unchanged."
review: not-run
discoveries:
  - "Fact snapshots now expose availability; consumers must check both before and after before interpreting protection/ability change lists."
blockers: []

Author: P09 Implementer, 2026-10-05 UTC. Worktree `/opt/dev/tehom-brainlab-p09`, branch `p09-preview-equivalence`. Authority: unchanged [fix assignment](assignment-fix.md), [independent review](reviewer.md), [P09 plan](../../plans/2026-10-02-d28ae958-poc-001-preview-equivalence.md), [consumer policy](../../../.agents/policy.md), [testing skill](../../../.agents/skills/ruach-testing/SKILL.md), and [handoff skill](../../../.agents/skills/ruach-handoff/SKILL.md).

All final technical checks ran on the committed fix `aac806868a211997258ca75fca52554f4ce01641`. This report and unchanged assignment are recorded in a later evidence-only commit; its creating SHA is returned in the terminal handoff. No technical change followed final checks. Independent re-review and Coordinator acceptance remain pending. No merge, push, rebase, protected-document edit, branch/worktree deletion or human playtest occurred.

## Findings addressed and changed files

**R1:** [preview.ts](../../../poc-001-linked-formation/src/core/preview.ts) keeps the existing selectors in `deriveFacts` and exposes their result through `previewFacts`. Success adds `available:true`. A selector's `RangeError` returns `available:false` with its diagnostic reason and no fabricated selector values. Other errors still propagate. This handles all current derived selectors at one boundary, including active links, recipient selection and Shelter eligibility, without duplicating validation, adjusting tuning or changing the real transition result.

Accepted immediate state/events and immediate deltas/explanations remain available. The forecast still invokes the sole real end-phase transition and returns its exact typed acceptance/rejection. Protection/ability change lists require both fact snapshots to be available; when unavailable they are empty and carry no claim of known absence. The necessary [FormationLab.ts](../../../poc-001-linked-formation/src/view/FormationLab.ts) consumer checks that discriminant and shows `Preview facts unavailable` instead of rendering empty facts as successful consequences. Its immediate and forecast readouts continue independently. An entire fact snapshot is unavailable if any selector rejects; this deliberately avoids combining incomplete facts into a seemingly complete result.

[preview.test.ts](../../../poc-001-linked-formation/tests/preview.test.ts) now parameterizes the previous invalid-damage forecast test over `warderDamage:-1`, `splashRadius:-1` and `closeThreshold:-1`. It compares the exact immediate result and forecast against separate real transitions, repeats the preview on deeply frozen input, checks fact availability, and checks unchanged serialized bytes. Two additional cases cover an installed Shelter with invalid `damageRules.closeThreshold`, and a protection-selector rejection from invalid facing while both real immediate and end-phase transitions accept. The latter proves that a fact failure does not invent an end-phase rejection. Original successful fixture assertions remain, with explicit availability guards; the normal matrix now also requires available facts.

**R2:** [browser-preview.mjs](../../../poc-001-linked-formation/tests/browser-preview.mjs) independently calls `selectRecipients` on the committed fixture using its stored `patrolRules.splashRadius`, and compares the entire rendered threat paragraph. This covers all intention IDs, kind labels, cells, recipient identities, multiplicity/order and cancellation reason. Exact comparison rejects missing, extra or incorrect displayed recipients; there is no hard-coded default recipient set. Adjacent link and enabled-ability assertions were also made independent of provisional defaults: links use the public selector and stored threshold, while ability changes use the public legality boundary for before/after fixture states. Their whole rendered paragraphs are compared exactly. No production default or debug surface was introduced or changed.

Only these four technical files changed. All other existing tests, including the P04 browser probe, remain unedited. The README, prior Implementer report/evidence, Reviewer report, generated agent sources, protected documents and plans remain unchanged. The new fact-availability contract is described here and in the source types/comments for P10 consumers.

## Reproduction and final verification

Before the source fix, `just poc-001-test tests/preview.test.ts -t 'invalid .*preserves|invalid Shelter'` exited1: three failures (`splashRadius`, `closeThreshold`, installed-Shelter threshold) threw the reported RangeErrors; the invalid-damage case passed; 13 unrelated cases were skipped. This reproduced R1, including its additional Shelter path. The same regression cases pass in the final committed suite. Subsequent precommit focused runs passed 17 and then 18 tests after the protection case was added; only the final committed checks below are the final verification claim.

Application commands used the default Docker runner with pinned Bun1.4.2; dependencies from the original task were present, so no install or host application-mode fallback was needed. Browser probes and the skill validator used the established standalone host Bun tooling. Chrome ran with its sandbox enabled and temporary profiles, without safeguard-bypass flags.

| Exact command | Exit / result on fixed revision |
| --- | --- |
| `just poc-001-test tests/preview.test.ts` | 0; 18 tests, one file. Matrix unchanged: 324 comparisons per healthy/wounded preset, 222 accepted and 102 rejected, each preview repeated; totals972/666/306. |
| `just poc-001-test` | 0; 431 tests, ten files: preview18, patrol48, abilities87, damage48, intents77, commands37, formation92, view19, assets3, smoke2. |
| `just poc-001-typecheck` | 0; `tsc --noEmit`. |
| `just poc-001-build` | 0; 9 prepared assets, 23 transformed modules; JS1,409.04kB/gzip368.41kB, CSS3.21kB/gzip1.27kB. Existing large-bundle warning remains. |
| `just poc-001-preview` | Docker server ready on localhost:4173 for both final probes; stopped with Ctrl-C, exit130. |
| `/home/metatron/.bun/bin/bun poc-001-linked-formation/tests/browser-lab.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p09-fix-p04-browser` | 0; 177 assertions, twelve fixtures, three modes, eighteen captures, zero uncaught exceptions, two intentionally blocked image requests. |
| `/home/metatron/.bun/bin/bun poc-001-linked-formation/tests/browser-preview.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p09-fix-preview-browser` | 0; 24 assertions, two captures, zero uncaught exceptions. Both probes used HeadlessChrome148.0.7778.96, viewport1280×800. |
| `docker run --rm --init --user "$(id -u):$(id -g)" --volume /opt/dev/tehom-brainlab-p09/poc-001-linked-formation:/app:ro --volume /tmp/p09-fix-probe.ts:/probe.ts:ro --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 bun /probe.ts` | 0; Reviewer's R1 probe idea re-run with strengthened immediate/forecast comparisons and frozen inputs; all three cases returned previews and real typed rejected forecasts. Explicit radius4 selector variation also returned all three recipients. Essential logic below. |
| `git diff --check` | 0; repeated for the recording commit. |
| `git diff --check 35586e8..HEAD` | 0; repeated after the recording commit. |
| Preservation/scope script below | 0; all eleven BASE test files byte-identical, and all fix-baseline test changes restricted to the two permitted P09 files. Prior reports, README and protected paths unchanged. |
| `sha256sum docs/mailbox/p09-preview-equivalence/assignment-fix.md` | 0; unchanged `051048233cdb8237d33a21dc2abf7be21f1127006e65d30b1effe626d92c9ac7`, matching initial read. |
| `docker ps --filter publish=4173 --format '{{.ID}} {{.Ports}}'` | 0; no remaining preview container. |
| `/home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p09-preview-equivalence/fix.md --repo /opt/dev/tehom-brainlab-p09` | 0; `ok:true`, four revision references resolved, no diagnostics. |

Actual R1 probe outcomes:

| Rule override | Immediate preview | Forecast | Before/after facts | Live bytes |
| --- | --- | --- | --- | --- |
| `warderDamage:-1` | Accepted, matches real state/events | Rejected `invalid-amount`, matches real endPhase | Available / available | Unchanged |
| `splashRadius:-1` | Accepted, matches real state/events | Rejected `invalid-amount`, matches real endPhase | Unavailable / unavailable | Unchanged |
| `closeThreshold:-1` | Accepted, matches real state/events | Rejected `invalid-amount`, matches real endPhase | Unavailable / unavailable | Unchanged |

Essential disposable probe logic (imports from `/app/src/content/patrol.ts`, `/app/src/core/transition.ts`, `/app/src/core/preview.ts`, `/app/src/core/intents.ts`, and Node assert):

```ts
function frozen(value) {
  if (value && typeof value === 'object') { Object.values(value).forEach(frozen); Object.freeze(value); }
  return value;
}
const command = { kind: 'maneuver', maneuver: 'expand', expectedRevision: 0 };
for (const field of ['warderDamage', 'splashRadius', 'closeThreshold']) {
  const state = frozen(createPatrol('healthy', { ...DEFAULT_PATROL_RULES, [field]: -1 }));
  const bytes = JSON.stringify(state);
  const immediate = applyCommand(structuredClone(state), command);
  assert(immediate.ok);
  const ended = applyCommand(structuredClone(immediate.state), {
    kind: 'endPhase', expectedRevision: immediate.state.revision });
  assert(!ended.ok && ended.error.code === 'invalid-amount');
  const preview = previewCommand(state, command, 0);
  assert(preview.ok);
  assert.deepEqual(preview.state, immediate.state);
  assert.deepEqual(preview.events, immediate.events);
  assert(preview.forecast.kind === 'transition');
  assert(!preview.forecast.ok && preview.forecast.error.code === 'invalid-amount');
  assert.deepEqual(preview.forecast.state, ended.state);
  assert.deepEqual(preview.forecast.events, ended.events);
  assert.equal(JSON.stringify(state), bytes);
}
const varied = createPatrol('healthy', { ...DEFAULT_PATROL_RULES, splashRadius: 4 });
const commit = applyCommand(varied, command);
assert(commit.ok);
const censer = commit.state.declaredIntentions.find(i => i.sourceId === 'censer');
assert.deepEqual(selectRecipients(commit.state, censer,
  commit.state.patrolRules.splashRadius).recipientIds, ['ugallu', 'girtablilu', 'pazuzu']);
```

Exact preservation/scope script (invoked with `python3 - <<'PY'`, exit0 at fixed revision):

```python
from pathlib import Path
import subprocess
base='35586e8'
paths=subprocess.check_output(['git','ls-tree','-r','--name-only',base,'--','poc-001-linked-formation/tests'],text=True).splitlines()
subprocess.run(['git','diff','--exit-code',base,'HEAD','--',*paths],check=True)
for path in paths:
    assert Path(path).read_bytes()==subprocess.check_output(['git','show',f'{base}:{path}']),path
print(f'BASE test check: {len(paths)} existing test files byte-identical')
subprocess.run(['git','diff','--exit-code','61aac67','HEAD','--','poc-001-linked-formation/tests',':!poc-001-linked-formation/tests/preview.test.ts',':!poc-001-linked-formation/tests/browser-preview.mjs','docs','.agents','assets','poc-001-linked-formation/README.md'],check=True)
print('Fix scope check: only the two permitted tests changed; existing reports, README and protected paths unchanged')
```

Both final P09 preview/commit screenshots were opened and inspected: ghost destinations match committed anchors; the condition and HP descriptions are legible, and the forecast clears on commit. Browser outputs and raw diagnostics remain in `/tmp`; the unique fix evidence, exact commands and outcome table are preserved here. Browser rendering used the ordinary default patrol fixture. The radius4 variation was verified headlessly through the public selector; a rebuilt browser with changed defaults and an invalid-tuning browser fixture were not run or added. No future audio subsystem, mobile/browser matrix, human playtest or P10 controls were tested.

## Approval review and remaining work

Automatic approval review rejected one proposed edit batch before execution, reasoning that the assignment limited all file changes to the two named tests. The batch also included an optional README update. A read-only recheck confirmed that R1 explicitly assigns the production `previewFacts` fix and that the two-file restriction follows the instruction to preserve other tests; the original assignment also owns the necessary view consumer. The narrowed correction omitted the README update and changed only the source, necessary consumer and two permitted tests. Those changes, Docker verification and Git commits then succeeded. No approval blocker remains.

R1 and R2 are addressed, with independent re-review pending. P10 must consume the new fact availability discriminant; this is a truthful projection contract, not a new validator or rules implementation. No additional decisions or blockers are required.
