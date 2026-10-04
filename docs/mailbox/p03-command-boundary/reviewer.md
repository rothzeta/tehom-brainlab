task: P03-review
status: complete
outcome: "Independent review of P03 command boundary: acceptance criteria 1–6 pass; no blocking findings; three optional findings."
role: reviewer
source_baseline: ab37525587b7739e3cf28b738f5bad5bece7965a
candidate_revision: b2d25339149b76f7a994da798f5f688449b3668c
reviewed_revision: 6e0f797b31b0e89830ed2e7579ce40eb6feb82c5
tested_revision: 6e0f797b31b0e89830ed2e7579ce40eb6feb82c5
artifacts:
  - docs/mailbox/p03-command-boundary/reviewer.md
  - docs/mailbox/p03-command-boundary/implementer.md
verification:
  - "just poc-001-test tests/commands.test.ts tests/formation.test.ts: exit 0; 2 files, 127 tests; P03 253 and P02 3349 assertions."
  - "just poc-001-test: exit 0; 3 files, 129 tests."
  - "just poc-001-typecheck: exit 0 (tsconfig includes src and tests)."
  - "just poc-001-build: exit 0; existing >500 kB Phaser chunk warning only."
  - "git diff --stat ab37525..b2d2533: 4 files (state.ts, commands.ts, transition.ts, tests/commands.test.ts), +443."
  - "git diff --name-only b2d2533..6e0f797 filtered to non-.md files: empty; 6e0f797 is documentation-only."
  - "Host Bun 1.4.2 edge-case probe of production modules (scratch only): exit 0; results under Evidence."
  - "Handoff validator on this report with --repo: exit 0; ok true, four revisions resolved, diagnostics empty."
review:
  - "Independent review of ab37525..6e0f797: no blocking findings; optional findings O1–O3."
discoveries:
  - "ActionRules.apply may return any BroodState list (drop, add, re-own entities); safety rests on the documented trusted-hook precondition until P07."
blockers: []

# P03 command boundary — independent review

Author: Reviewer (task `P03-review`). Date: 2026-10-04. Worktree `/opt/dev/tehom-brainlab-p03`, branch `p03-command-boundary`.

## Scope and revisions

- I reviewed the full range `ab37525..6e0f797`. The technical candidate is `b2d2533`, which touches four files. Its documentation-only successor is `6e0f797`, which changes six Markdown files and no executable, test, or configuration content.
- All verification ran with the worktree at `6e0f797`. Its executable and test content is byte-identical to `b2d2533`.
- I inspected `src/core/{state,commands,transition}.ts` and `tests/commands.test.ts`, and checked them against the P02 module `src/core/formation.ts`.
- I also read the [plan](../../plans/2026-10-02-2dfffcd3-poc-001-command-boundary.md), the [Implementer report](implementer.md), the TASK_LOGS entry, CURRENT, `plans/README.md`, and the prototype README section.
- No source or test file was modified.

## Verdict per acceptance criterion

| # | Verdict | Evidence |
| --- | --- | --- |
| 1 | Pass | `tests/commands.test.ts:39` checks full successor-state equality: formation Compact 0→1, `maneuverUsed` set, revision 0→1, `actedIds` empty, exactly one event. The input and command are both deep-frozen. |
| 2 | Pass | The following cases all go through the shared `rejected()` helper (`:27`), which asserts the code, `state` equal to the input, and `events: []`. Second maneuver → `maneuver-used` and replayed command → `stale-revision` (`:75`). Same-shape cases → `same-shape`, and the allowance is still usable afterwards (`:85`). Enemy, victory, and defeat phases → `wrong-phase` (`:97`). Stale revision → `stale-revision` (`:104`). |
| 3 | Pass | One legal action is accepted. The same actor is then rejected with `already-acted`, and a different actor is still accepted (`:153`). Unknown, phase, and stale cases are rejected before the hooks run, using throwing hooks (`:180`). Fallen and foreign actors are rejected, and another eligible actor is accepted afterwards (`:194`). Accounting order is in `transition.ts:63-76`. |
| 4 | Pass | `transition.ts:21-23` returns `unsupported-command` for both kinds before any other check. Tested in all four phases with a stale revision (`:109`). |
| 5 | Pass | Inputs, commands, and successor states are recursively frozen throughout the tests, both for accepted and rejected commands. The object-identity traversal (`:250-265`) finds no shared objects between two `createInitialState()` calls. |
| 6 | Pass | All four maneuvers are replayed from a JSON round-trip of both the state and the command. The resulting state and the ordered events are equal (`:271`). |

Additional conditions:

- **Production boundary: pass.** Tests import `applyCommand` and `applyActorAction` directly. The test `rules` object is a caller-supplied effect, as the plan prescribes; it does not reimplement maneuver or accounting rules.
- **P02 reuse: pass.** `transition.ts` calls the P02 `rotate*`, `expandFormation`, and `contractFormation` functions and adds no geometry of its own.
- **Scope and non-goals: pass.** There is no command bus, registry, undo, DSL, store, ability, or round driver. P01 runtime and rendering, and P02 source and tests, are unchanged: the BASE diff touches only the four new files.
- **Documentation: pass.** Test counts (37 P03 tests, 90 P02, 127 focused, 129 full) match my runs. Contract descriptions in the README and the Implementer report match the code. Status wording correctly leaves independent review as pending.

## Findings

**Blocking:** none.

### O1 (optional): the effect hook can change any entity data

- **Location:** `poc-001-linked-formation/src/core/transition.ts:57-58` and `:73`.
- **Problem:** `rules.apply` returns a full replacement `brood` array, which is used without any check. A hook can drop, add, re-own, or re-identify entities. For example, it could resurrect a fallen Brood or change an `id` so that `actedIds` no longer matches.
- **Why it matters:** the accounting invariant depends on actor identity staying stable. Today it holds only because the hooks are trusted, and that precondition is documented in the code comment and in the Implementer report.
- **Evidence:** my probe used `apply: st => st.brood.filter(b => b.id !== 'pazuzu')`. The call was accepted and returned 2 entities.
- **Direction:** for P07, consider asserting that the entity IDs and their order are preserved, or narrowing the hook to per-entity patches. No change is needed in P03.

### O2 (optional): a malformed maneuver payload can be reported with a budget or revision code

- **Location:** `poc-001-linked-formation/src/core/transition.ts:25-27` and `:42`.
- **Problem:** an unrecognized `maneuver` value reaches `invalid-command` only after the revision, phase, and `maneuverUsed` checks pass.
- **Evidence:** in my probe, `{kind:'maneuver', expectedRevision:1, maneuver:'translate'}` against a spent state returns `maneuver-used`. A command with no `expectedRevision` returns `stale-revision`.
- **Why it matters:** the result is still atomic, so there is no correctness impact. However, the report's error table describes `invalid-command` as covering an "unrecognized … maneuver payload", and a serialized caller could get a misleading code.
- **Direction:** either validate the payload before `guard()`, or state in the precedence note that payload validation comes after the budget checks.

### O3 (optional): one assertion in the AC5 test is tautological

- **Location:** `poc-001-linked-formation/tests/commands.test.ts:266-268`.
- **Problem:** the test runs `applyCommand(second, …)` and then asserts `first` equals `second`. `applyCommand` never modifies its input, so this would pass whether or not the two objects share structure.
- **Why it matters:** none for coverage, because the identity traversal at `:264-265` already establishes criterion 5. These lines add noise only.
- **Direction:** remove them, or instead apply the command to `second`, mutate an unfrozen copy, and check that `first` is unaffected.

## Evidence

Logs are in `.agents/scratch/p03/review/{focused,full,typecheck,build}.log` (scratch, ignored by Git). Exit codes and counts are in the YAML `verification` field above.

The edge-case probe is `.agents/scratch/p03/review/probe.ts`, run with `/home/metatron/.bun/bin/bun` (exit 0). It printed:

```
invalid payload after spend: maneuver-used
missing expectedRevision: stale-revision
event formation shares state ref: true
effect may drop entities: true 2
null command throws: TypeError
```

On the remaining lines:

- The event and the successor state share the same `formation` object. Both are readonly-typed, so this is benign.
- A null command throws instead of returning an error. This is outside the documented typed-input domain, so it is not a finding.

## Not verified

- No mutation-testing run.
- No browser or runtime session; P01 runtime is unchanged by diff.
- No routing suite.
- I did not rerun the Implementer's supplementary host trace verbatim; my probe covers overlapping cases.
- Review does not constitute Coordinator acceptance.
