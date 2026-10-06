# Assignment BX-design: adopt boss-experiment plans P13–P17 (Architect)

Role: `architect` (follow `.agents/agents/architect.md`). You design and plan only; do not implement source or tests.
Coordinator: the Claude Coordinator session in the main checkout.

## Background

The user played the ring-formation (RF) build of the patrol. Their finding, 2026-10-06: "the proto is fine, the patrols and their attack pattern did not require making use of movement."

Cause, confirmed in source: patrol targeting never reads positions. `src/core/rounds.ts` `announcePatrol` says "no rule reads enemy coordinates". The Warder takes the first living Brood in roster order, the Censer cycles, and the Harrier picks the lowest HP ratio.

An external design review, delivered as draft PR #1, proposed a new continuation. It is on this branch at `71cc26c`:

- `docs/plans/README-boss-experiments.md` (draft index);
- `2026-10-06-e8cec63d-poc-001-split-maneuver-budgets.md` (P13);
- `2026-10-06-6a0ebcdc-poc-001-tactical-kit-revision.md` (P14);
- `2026-10-06-6dcd120b-poc-001-two-phase-central-boss.md` (P15, the "Crucible");
- `2026-10-06-27ca8f17-poc-001-enemy-repositioning.md` (P16);
- `2026-10-06-79371edf-poc-001-roaming-boss-and-adds.md` (P17, the "Collector" with Warder and Censer adds).

The reviewer wrote these drafts from source inspection only. They ran no build, tests or browser.

## User decisions (2026-10-06, accepted)

1. **Adopt P13–P17 as the roadmap. P12 is superseded.** The original P12 directional boss will not be built separately.
   - The user lifts the P11 boss gate by explicit decision, based on their manual RF round.
   - Record it as a user decision. Do not mark the historical gate as PASS.
2. **Build all of P13–P17 before the user's next manual round.**
3. **The drafts' numbers are provisional defaults.** Implement them as written and keep each in its owning content/core module. Tests must not freeze them. The numbers are:
   - one rotation plus one shape change per player phase, both refreshing every round;
   - Shelter reduces by 4 and may target self;
   - Impale keeps 6 damage and loses its protection bypass;
   - Impale is no longer tied to exactly two living partners;
   - phase two starts at 50% boss HP, from the next declaration;
   - plus the drafts' HP, damage, patterns, the six-slot route and the add composition.

Standing user direction from earlier rounds, still in force:

- "Darkest Dungeon rather than XCOM": positional ranks, not puzzle movement.
- The Brood never walk individually. Only the shared maneuvers move them.
- The centre is reserved for a boss.
- There is no generic reach rule. Reach is ability-specific, and only where an ability needs it.

## Task

1. **Adopt the drafts into the canonical plan set.**
   - Fold `README-boss-experiments.md` into `docs/plans/README.md`: add P13–P17 to the execution map and the defaults-ownership table, then remove the separate index file. Keep its rationale wherever it belongs.
   - Mark P12 as superseded by user decision on 2026-10-06, keeping its history. Add a dated supersession note to the P12 plan itself.
   - Update the brief (`docs/prototypes/poc-001-linked-formation.md`) with a 2026-10-06 decision-record entry. Its source is the user.
   - Amend ADR-0004 with a dated note only if its recorded scope changes. Preserve its history.
2. **Check each draft against the actual source and existing contracts.** Correct anything wrong or missing. In particular:
   - **Replay and record compatibility** for the `maneuverUsed` split, the new encounters and the rule versions (P11 `RECORD_VERSION`, rules-version strings). Decide explicitly whether old records stay replayable or are rejected with a clear error.
   - **Encounter selection.** How the player chooses the patrol, Crucible or Collector in the browser, for example a route or query parameter alongside `?play=patrol`, and in the lab and preview fixtures.
   - **The preview-equivalence invariant (P09)** for phase changes, relocation and the new shapes.
   - **Every rule cited from source**, such as the 120° claim and protection range, recomputed rather than trusted. Compute claims; do not assert them.
3. **Make each plan executable** (ADR-0002 filenames, ADR-0003 format). Each plan needs:
   - affected files and ordered checkpoints;
   - acceptance criteria;
   - an explicit, enumerated test-update exception;
   - the suites expected to pass unedited;
   - verification: `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build` and `just poc-001-test-browser`, run bare with no `POC001_CHROME` or other hand-set env, plus screenshot inspection where it is visual;
   - an explicit criterion that assertions must not freeze provisional tuning. P07, P09 and P10 reviews blocked on exactly this.
4. **Sequencing.** Confirm or correct the dependency order. For each pair, say whether it can run in parallel on separate branches without conflicting file ownership, or must be sequential. Name the shared files that force sequencing.
5. **Write a combined manual-test checklist** for the user's round after P17, as a section in the P17 plan or the index. It covers both bosses, the split allowances, the revised kit, and whether movement now matters (the user's core complaint).
6. **List genuine open questions**, each with a recommended default. Apply the default, mark it provisional, and do not block.

## Context

Read:

- `docs/CURRENT.md`, `docs/plans/README.md`, the five drafts and the draft index;
- the brief, ADR-0002, ADR-0003, ADR-0004 and ADR-0006;
- the plans for P03, P07, P08, P09, P10, P11, P12 and RF (`2026-10-05-c6399cb6-poc-001-ring-formation.md`);
- `docs/mailbox/ring-formation/architect.md`;
- the prototype `README.md`;
- source under `poc-001-linked-formation/src/` as needed.

## Restrictions

- Edit only these files, plus your report:
  - plan files;
  - the plan index;
  - the brief;
  - ADR-0004 (amendment only).
- Do not touch source, tests or tooling. Do not edit `docs/CURRENT.md` or `docs/TASK_LOGS.md`.
- Work and commit only in `/opt/dev/tehom-brainlab-boss`, on branch `boss-experiments`, from BASE `71cc26c8c2796711ef865463a2264c289b78550e`. Do not merge or push.
- Put disposable files in the OS temp directory.

## Expected output

1. Commit this assignment unchanged, together with `docs/mailbox/boss-experiments/architect.md` and the plan changes.
2. Start the report with the `ruach-handoff` YAML block. It gives the revision, the changed paths, corrections to the drafts, the sequencing and parallelism verdict, open questions with defaults, and blockers.
3. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/boss-experiments/architect.md --repo /opt/dev/tehom-brainlab-boss` until it reports `ok: true`.

Terminal handoff:

- the report SHA;
- the corrections made to the drafts;
- the record-compatibility decision;
- the encounter-selection design;
- the sequencing and parallelism verdict;
- open questions;
- blockers.
