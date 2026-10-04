task: P06-review
status: complete
outcome: "Request changes: one blocking invalid-recipient boundary defect; required automated checks pass."
role: reviewer
source_baseline: 04bd6a28bd21f5248cd18de59cbf5efbc408b6a1
candidate_revision: 2be2d85c3395ada92f88bd4edd0f0b23d32930ea
reviewed_revision: cad6168da387ed75b200c25ee5cc5d7081f534b9
tested_revision: 42e54d4467a1dc249aa860e7e7845ec69c442704
artifacts:
  - docs/mailbox/p06-damage-and-fallen/assignment-reviewer.md
  - docs/mailbox/p06-damage-and-fallen/reviewer.md
verification:
  - "just poc-001-test: exit 0 with Docker escalation; 272 tests / seven files; 4700 instrumented assertions."
  - "just poc-001-typecheck: exit 0 with Docker escalation."
  - "just poc-001-build: exit 0 with Docker escalation; nine assets / 18 transformed modules; existing Phaser size warning."
  - "P04 headless Chrome check against Docker preview: exit 0 with local-network escalation; 136 assertions / 12 fixtures / three modes / 18 captures / zero uncaught exceptions."
  - "git diff --check 04bd6a2..2be2d85 and git diff --check: exit 0."
  - "Technical-content preservation comparisons: exit 0; tested checkout equals combined revision; P04 and P05 integration preserved."
  - "Disposable pinned-Docker boundary probe: exit 0; two sparse recipient cases throw TypeError, dense invalid ID rejects; all three preserve input state."
  - "PATH=/home/metatron/.bun/bin:$PATH bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p06-damage-and-fallen/reviewer.md --repo /opt/dev/tehom-brainlab-p06: exit 0; ok true."
review:
  - "Request changes; one blocking P2 finding (R1), zero optional findings."
discoveries:
  - "P07 accounting limitation in the Implementer report is confirmed: ActionRules.apply returns only Brood data; P06 appropriately leaves ability creation and action accounting to P07."
blockers:
  - "R1: sparse recipient arrays bypass ID validation and throw instead of returning the documented atomic rejection envelope."

Author: P06 Reviewer. Date: 2026-10-04 UTC. Branch: `p06-damage-and-fallen`, worktree `/opt/dev/tehom-brainlab-p06`. Governing [assignment](assignment-reviewer.md), [P06 plan](../../plans/2026-10-02-4c3c0d42-poc-001-damage-and-fallen.md), [testing policy](../../adr/0006-contract-invariants-and-black-box-testing.md), and [handoff skill](../../../.agents/skills/ruach-handoff/SKILL.md).

## Verdict and scope

**Request changes: one blocking finding, zero optional findings.** The review is complete; implementation acceptance remains blocked by R1. No other material correctness, integration, scope, or complexity findings were identified.

Reviewed the seven P06 technical/documentation paths in `04bd6a2..2be2d85`: damage, lifecycle, additive state/command/transition changes, damage tests, and the README's P06 section. Inspected their surrounding P03 guards, P05 targeting/protection/link selectors, and P04 LabSession consumption. P04/P05 were reviewed only for integration with P06.

The combined technical revision is `cad6168da387ed75b200c25ee5cc5d7081f534b9`. Checks ran on existing successor `42e54d4467a1dc249aa860e7e7845ec69c442704`. `git diff --stat cad6168..42e54d4` contains only the integration assignment, report, and browser evidence JSON; `git diff --exit-code cad6168 HEAD -- poc-001-linked-formation` exited 0. Source/tests were not edited. Only this report and the supplied unchanged assignment are committed by this review.

## Findings, ordered by severity

### R1 — Blocking, P2: reject sparse recipient arrays before settlement

**Location:** [`src/core/damage.ts:49`](../../../poc-001-linked-formation/src/core/damage.ts#L49), also recipient eligibility at line 60 and dereference at line 81.

**Problem and concrete scenario:** Call the public P03 `applyCommand` boundary with a valid CombatState and attack packet whose `recipientIds` is `new Array<string>(1)`, or a two-entry array containing `'ugallu'` followed by a hole. `Array.every` and `Array.some` skip holes, while `new Set` and the later `for...of` visit a hole as `undefined`. A single hole therefore passes both ID validation and living-target validation. Settlement eventually dereferences `target.maxHp` with `target === undefined` and throws.

**Why it matters:** The assignment's acceptance condition 2 and P06 input contract require invalid IDs to reject at the command boundary. The README explicitly promises the `{ok:false,state,error,events:[]}` envelope for malformed IDs. This malformed direct JavaScript/TypeScript command escapes that boundary and can interrupt its caller. Input state stays unchanged; the finding is a rejection-contract failure, not partial state mutation. Dense arrays containing explicit `undefined` correctly reject, so current malformed-input tests miss this distinction.

**Executed evidence:** The disposable probe below ran in pinned Docker at the tested revision, with source mounted read-only. It produced:

```text
dense-invalid: ok=false, code=invalid-command, sameState=true, events=[], unchanged=true
sparse-only: TypeError: undefined is not an object (evaluating 'target.maxHp'); unchanged=true
valid-plus-hole: TypeError: undefined is not an object (evaluating 'target.maxHp'); unchanged=true
```

**Suggested direction:** Validate every logical array position, including holes, before computing damage; for example, validate a dense copy that exposes holes as `undefined`. Keep duplicate and living-target checks. Add boundary regression cases for both a hole-only array and valid IDs mixed with one hole, asserting the ordinary rejection envelope, same state identity, empty events, and unchanged contents. No fix was made by the Reviewer.

Optional findings: **none**.

## Acceptance assessment

| P06 criterion / contract | Review evidence and result |
| --- | --- |
| AC1: raw 5, directional 2, bypass | Independently specified expected HP 5/7/5; executed tests pass. P05 protection is consumed through `selectProtection`, without duplicated masks. |
| AC2: living Close Shelter, impact expansion, consumption | Explicit reduction/Close inputs; zero/positive packets, expansion, unavailable source and bypass cases pass. Eligibility comes from P05 `isCloseLinked`. Creation remains P07-owned. |
| AC3: same-blast guardian death | All six recipient permutations yield Ugallu 0, Girtablilu 9, Pazuzu 7. Later hit receives no guardian protection. Directional-source same-batch coverage also passes. |
| AC4: overkill and single Fallen event | HP 2 minus raw 9 clamps to zero; positive-to-zero comparison emits one event. Repeated settlement against the resulting snapshot emits none. |
| AC5: inert slots, no actions/effects, mark cancellation | Formation/roster/budgets retained; P03 actor guard rejects Fallen; P05 excludes dead active links and recipients; lifecycle removes source/target effects and cancels intentions using P05 reasons. Tests pass. |
| AC6: terminal outcomes and rejection | Final enemy yields victory; final Brood yields defeat; all-dead synthetic batch chooses defeat. Supported commands reject unchanged in terminal state, preserving P03 unsupported-command precedence. Tests pass. |
| AC7 / C4: expiry | Unused Shelter expiry changes revision once and leaves phase/round/budgets alone; repeated call returns identical state with no events. Tests pass. |
| Determinism, purity, replay protection | Frozen-input and serialized-replay tests, batch permutations, lexical event ordering, and event-ID replay rejection pass. Inspection confirms functions do not mutate inputs. |
| Invalid IDs/amounts and rejection envelope | Existing invalid-amount/ID tests pass; **R1 leaves this required contract incomplete** for sparse recipient arrays. |

P03's existing command logic, initial fixture, actor hooks, events, and error precedence remain unchanged for existing commands. State extensions, generic CommandResult default, event/error variants, and attack dispatch are additive. P01–P05 regression tests remain byte-identical to the P06 baseline; P04 source/tests/scripts/metadata match delivered master. Full suite, strict typecheck, and the actual browser maneuver probe corroborate compatibility.

Tests use public state/event/error boundaries and independent fixture arithmetic. Selector calls supply attack recipients or inspect public eligibility; expected damage is not derived from production damage calculations. Mitigation cases supply explicit tuning. Exact event assertions match the documented P06 event contract. No out-of-scope ability creation, enemy ordering, expiry scheduling, round loop, or renderer callbacks were added. The small damage/lifecycle split is appropriate; no simplification finding is warranted.

## Independent verification

Commands ran from the worktree root on `42e54d4`, before this report's commit. Default application mode remained Docker, pinned Bun 1.4.2 / Vitest 5.0.3. Installation was not needed: existing dependencies successfully supported all checks. No host-mode application fallback was used.

| Exact command | Exit and result |
| --- | --- |
| `just poc-001-test` (initial sandbox attempt) | 1; Docker daemon inaccessible. Repeated with sandbox escalation as instructed. |
| `just poc-001-test` (escalated) | 0; seven files / 272 tests: smoke 2, formation 90, commands 37, view 19, assets 3, intents 75, damage 46. Instrumented assertions: P02 3349 + P03 253 + P05 803 + P06 295 = 4700; smoke/view/assets suites have no counter instrumentation. |
| `just poc-001-typecheck` (escalated) | 0; `tsc --noEmit`. |
| `just poc-001-build` (escalated) | 0; nine prepared assets / 18 modules; JS 1394.30 kB (gzip 364.44), CSS 3.21 kB (gzip 1.27). Existing Phaser >500 kB chunk warning. |
| `git diff --check 04bd6a2..2be2d85` | 0. |
| `git diff --check` | 0. |
| `just poc-001-preview` (escalated) | Docker preview started on localhost:4173; stopped after browser success with Ctrl-C, expected exit 130. |
| `/home/metatron/.bun/bin/bun poc-001-linked-formation/tests/browser-lab.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p06-review-browser-42e54d4` (sandbox attempt) | Aborted with Ctrl-C, exit 130; sandbox could not access the host preview (`curl --max-time 5 -I http://localhost:4173/` exited 7). No passing browser evidence claimed for this attempt. |
| `/home/metatron/.bun/bin/bun poc-001-linked-formation/tests/browser-lab.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/p06-review-browser-42e54d4-escalated` (escalated) | 0; HeadlessChrome 148.0.7778.96, 1280×800; 136 assertions, 12 fixtures, three modes, 18 captures, zero uncaught exceptions, two intentionally blocked image requests. Browser executable/flags unchanged from P04. |

Technical preservation commands each exited 0:

```sh
git diff --exit-code cad6168 HEAD -- poc-001-linked-formation
git diff --exit-code 8f8c9e47859262401c189dd0d623bed09a5aeb30 HEAD -- poc-001-linked-formation/src/view poc-001-linked-formation/src/main.ts poc-001-linked-formation/scripts poc-001-linked-formation/package.json poc-001-linked-formation/.gitignore poc-001-linked-formation/tests/view.test.ts poc-001-linked-formation/tests/asset-copy.test.ts poc-001-linked-formation/tests/browser-lab.mjs
git diff --exit-code 2be2d85c3395ada92f88bd4edd0f0b23d32930ea HEAD -- poc-001-linked-formation/src/core poc-001-linked-formation/tests/damage.test.ts
git diff --exit-code 04bd6a2 HEAD -- poc-001-linked-formation/tests/commands.test.ts poc-001-linked-formation/tests/intents.test.ts poc-001-linked-formation/tests/formation.test.ts poc-001-linked-formation/tests/smoke.test.ts
```

A Python committed-blob comparison also exited 0: extracted the P06 README section between `## Damage and Fallen (P06)` and `## Evidence and limitations` from `2be2d85`, asserted that it exists unchanged in `42e54d4`, and asserted that removing it makes the combined README equal delivered master's `8f8c9e4` README.

The additional boundary probe command exited 0 (it catches exceptions to report observed behavior):

```sh
docker run --rm --init --user 1000:1000 --volume /opt/dev/tehom-brainlab-p06/poc-001-linked-formation:/app:ro --volume /tmp/p06-review-boundary-probe.ts:/tmp/p06-review-boundary-probe.ts:ro --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 bun /tmp/p06-review-boundary-probe.ts
```

Its relevant standalone reproduction, preserving the fixture and inputs independently of the disposable file:

```ts
import { createInitialState } from '/app/src/core/state.ts';
import { applyCommand } from '/app/src/core/transition.ts';
const state = {
  ...createInitialState(),
  brood: createInitialState().brood.map(e => ({ ...e, hp: 10, maxHp: 10 })),
  enemies: [{ id: 'censer', hp: 10, maxHp: 10, facing: 0 as const }],
  declaredIntentions: [], protections: [], shelters: [], resolvedAttackIds: [],
};
const base = { kind: 'attack' as const, expectedRevision: 0, eventId: 'probe',
  sourceId: 'censer', rawDamage: 5, bypassProtection: false };
// Each call uses the original state. Catch exceptions to inspect all three cases.
applyCommand(state, { ...base, recipientIds: [undefined] as unknown as string[] });
applyCommand(state, { ...base, recipientIds: new Array<string>(1) });
applyCommand(state, { ...base,
  recipientIds: Object.assign(new Array<string>(2), { 0: 'ugallu' }) });
```

The executed probe compared serialized input state to its pre-call value after each case and asserted equality; dense-invalid additionally returned the same state object and empty events. Full browser output/screenshots remain disposable under `/tmp/p06-review-browser-42e54d4-escalated`; the durable summary is recorded above.

Handoff validation: the bare `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p06-damage-and-fallen/reviewer.md --repo /opt/dev/tehom-brainlab-p06` invocation first exited 127 because Bun was absent from shell PATH. `PATH=/home/metatron/.bun/bin:$PATH bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p06-damage-and-fallen/reviewer.md --repo /opt/dev/tehom-brainlab-p06` then exited 0, `ok: true`, no diagnostics, four revision fields resolved. This verifies report structure/references, not implementation acceptance.

The unchanged assignment SHA-256 is `22568a5f0797bd16296885bdb19738595cae1248afcf9c136c96bbd0070b064d`. No merge, push, rebase, branch/worktree deletion, protected-document edit, source fix, or test edit occurred. No human playtest, browser matrix, mutation testing, or future P07/P08 gameplay verification was performed. Those remain outside this review's scope. The report-creating SHA is returned in the terminal handoff.
