# Assignment CT-design — Compact formation as a true triangle (Architect)

Role: `architect` (follow `.agents/agents/architect.md`). Design and plan only; do not implement source or tests.
Coordinator: Claude Coordinator session in the main checkout.

## Problem and user decision

The user observed that the Compact formation is not a triangle. Cause: the design brief (`docs/prototypes/poc-001-linked-formation.md`, "Compact: three consecutive outer-ring cells") and P02 ([plan](../../plans/2026-10-02-2e228a2b-poc-001-formation-algebra.md): Compact = ring indices `3o + [0,1,2]`, orientation 0 at `(3,0)`, `(2,1)`, `(1,2)`, distances 1, 2, 1) put the three Brood collinear on one ring edge.

**User decision (2026-10-04):** Compact becomes a true triangle of three mutually adjacent cells: **two Brood on the outer ring (radius 3) and one on ring 2, just inside them**. All three links are distance 1. The user's sketch:

```
   outer ring
  ⬡ U ⬡ G ⬡
     ⬡ P ⬡     <- ring 2
U-G 1, G-P 1, U-P 1
```

The sketch suggests Ugallu and Girtablilu on the outer ring and Pazuzu inward. Treat that slot assignment as the user's preference unless it breaks a contract; if so, propose an alternative and flag it.

## Task

Produce the design and plan amendments needed to implement this decision across the delivered code, without implementing it:

1. Amend the design brief's Compact definition and anything there that assumes all Brood stay on the outer ring. Record the decision with date and source (user, 2026-10-04) so it reads as an accepted decision, distinct from provisional defaults.
2. Amend the P02 plan's settled choices, proposed mapping, fixtures and acceptance criteria. Decide and justify: the exact Compact cell mapping for all orientations (how many orientations, and which ring-2 cell), how rotation, Expand/Contract to and from Spread stay reversible and labelled, link distances and Close/Stretched classification (Spread unchanged unless necessary), and slot/roster assignment.
3. Assess and amend the downstream contracts already delivered: P04 formation lab (rendering, previews, view/browser tests that assume outer-ring positions), P05 intent semantics (sector masks and player eligibility currently evaluated on the outer ring only — decide how an inward Brood is affected by areas, marks/splash, protection fronts, isolation), and P06 damage/Fallen fixtures. Also check P07–P12 plans for assumptions that now break, and list the needed edits (amend directly where small; otherwise list them).
4. Write a bounded implementation task: affected files, ordered checkpoints, acceptance criteria, which existing P02/P04/P05/P06 tests must change (the task will need an explicit exception allowing those test updates) and why, and the verification commands (`just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build`, P04 headless Chrome `poc-001-linked-formation/tests/browser-lab.mjs`). Follow ADR-0002 (filename) and ADR-0003 (format) for any new plan in `docs/plans/`; a plan amendment section is acceptable if simpler.
5. List any open question that genuinely needs the user's decision (e.g. inward Brood's attack exposure), with your recommended default. Do not block on them: use the default and mark it provisional.

## Context

Read `docs/CURRENT.md` (P01–P06 delivered), `docs/plans/README.md` (ownership of provisional defaults), the brief, P02/P04/P05/P06 plans, prototype `README.md` public contract sections, and source under `poc-001-linked-formation/src/core/` and `src/view/` as needed. Implementer/review reports are in `docs/mailbox/p02-*`, `p04-*`, `p05-*`, `p06-*`.

## Restrictions

- Edit only the design brief, plan files, plan index and your report. No source, test, tooling or asset changes. Do not edit `docs/CURRENT.md` or `docs/TASK_LOGS.md`.
- Work and commit only in `/opt/dev/tehom-brainlab-compact`, branch `compact-triangle` (BASE `0f9c1b7`). No merge into master, push, or branch/worktree deletion.
- Disposable files go in the OS temp directory.

## Expected output

- Commit this assignment unchanged with your report at `docs/mailbox/compact-triangle/architect.md` and the doc amendments.
- Report starts with the `ruach-handoff` YAML block (revision, changed paths, discoveries, open questions with defaults, blockers). Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/compact-triangle/architect.md --repo /opt/dev/tehom-brainlab-compact` until `ok: true`.
- Terminal handoff: report path, report-creating SHA, summary of the chosen mapping, open questions, blockers.
