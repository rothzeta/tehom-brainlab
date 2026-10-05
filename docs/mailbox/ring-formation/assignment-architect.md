# Assignment RF-design — ring formation and enemies on tiles (Architect)

Role: `architect` (follow `.agents/agents/architect.md`). Design and plan only. Do not implement source or tests.
Coordinator: Claude Coordinator session in the main checkout.

## Background

Three AI playtesters ran 9 attempts and won every one; their reports are in `docs/mailbox/ai-playtest-20261005/scout-{1,2,3}.md`. They agreed on these findings:

- The patrol is too easy.
- One opening dominates: Expand, kill Harrier (Impale 6 + Claw 4 + Gale 3 = Harrier's 13 HP), then hold Spread.
- Shape mattered mainly through numbers (Impale availability, splash recipients), not through position.
- Shelter and Crosswind rarely earned a place.

The user agrees and has added their own findings and decisions.

## User decisions (2026-10-05, accepted)

The user's words (lightly cleaned transcript):

> The triangle should be spread on one ring, and extend should mean going to the other ring. So compact should be on the first ring, extend on the other ring. … It would mean that they would always be around the rotation point, because in their compact stance there would be the center tile that is always unoccupied, which would work well if we put a boss type enemy in there from time to time. The second problem I found is why are the enemies not on tiles but seemingly floating around? So in my heart, this is still mostly a Darkest Dungeon game rather than an XCOM game, which is why it's not a puzzle movement game, although I do want a little bit of movement impacting the game.

The user confirmed these answers:

1. **Formation (confirmed exactly):**
   - Compact puts the Brood on alternating ring-1 cells (`S[o], S[o+2], S[o+4]` or equivalent). That is a triangle around the centre with every pair at distance 2.
   - Expand moves each Brood one radial step outward to the ring-2 corner behind it, giving the corner triangle at distance 4. Contract reverses this.
   - Rotation turns the triangle around the centre.
   - The centre tile is **never occupied by Brood**. It is reserved for an occasional boss-type enemy.

   This supersedes the TR sector-aligned Compact (`T[2o], T[2o+1], S[o]`). Spread stays on the ring-2 corners. Keep Close threshold 2 unless you show a reason to change it. Compact pairs at distance 2 are Close, and Spread pairs at distance 4 are Stretched.
2. **Enemies stand on real tiles** instead of floating at a view-only centre anchor.
3. **Rules follow tiles (chosen):** each enemy's front, protection and reach derive from its own tile and facing. The formation's position relative to each enemy therefore matters. This means "a little bit of movement impacting the game" through the shared maneuvers only, with no individual movement and no XCOM-style puzzle movement.
4. **Enemy placement: the user asked you to propose it.** They suggested two directions: "maybe multiple scenarios with different positions? or maybe there is a mathematical argument for avg distribution". Evaluate both, recommend one, and justify it.
   - Constraints to weigh:
     - Brood use every ring-1 cell (across rotations) and the six ring-2 corners.
     - The ring-2 edge cells (`T` odd indices) and the centre are never Brood cells.
     - Enemies on cells Brood can enter would block or interact with maneuvers. Decide whether to allow that; it is a real design trade-off, so explain it.
   - The centre is the boss tile; the patrol might not use it.
   - Consider whether the three P08 presets (healthy, wounded-Ugallu, wounded-Girtablilu) should become, or gain, distinct enemy layouts, for example evenly distributed versus clustered on one side.
   - A distribution argument could balance, across orientations and stances, each Brood's exposure or average distance to enemies. Any such argument must be computed, not asserted.

## Task

1. **Brief.** Update the Arena, Brood placement, formation and enemy sections, and add a Decision record entry dated 2026-10-05 with the user as source. State that Darkest-Dungeon-style positional ranks, not tactical movement, are the intent.
2. **Plan amendments (Amendment RF).** Amend P02 (Compact/Spread mapping tables for all orientations, reversibility, links). Amend P05: enemy-tile-based fronts, protection, reach and areas replace the encounter-centred sectors where the rule now follows the tile. State what remains centre-based, if anything. Amend P08 (enemy tiles, facing, presets and layouts, initial intentions), and amend P04/P09/P10 (rendering enemies on tiles, previews) where affected. Check P06, P07 and P11 for broken assumptions. P07 Impale/Shelter conditions depend on Close/links and P11 records carry rules versions, which is probably a version bump. Check P12 (boss at centre) for consistency.
3. **Balance hypotheses.** You own no tuning, so propose and do not decide. The playtests found a 13-damage/13-HP Harrier breakpoint and a dominant Spread opening. State how the new geometry and tile-based rules are expected to change that, and which provisional values (P07/P08 owners) the implementation should revisit. Mark each as provisional, to be checked by the user's manual test.
4. **Bugs to include in the implementation task.** All three are from the playtest reports:
   - **B1:** stale actor-button HP after a preset change plus Restart (scout-2 D1, scout-3).
   - **B2:** End phase's "If end phase now" forecast appears to include an extra resolution (scout-1 D1). The implementer must investigate the cause first.
   - **B3:** "Unused actions forfeited" is shown when no actions were unused (scout-3).
5. **Bounded implementation task.** Write it in `docs/plans/` (ADR-0002 filename, ADR-0003 format). If one task would be too large, split it into ordered tasks. Include:
   - affected files and ordered checkpoints;
   - acceptance criteria;
   - an explicit, enumerated test-update exception (which existing tests change and why);
   - suites expected to pass unedited;
   - verification: `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build`, and `just poc-001-test-browser` run bare (no `POC001_CHROME` set), plus screenshot inspection of Compact, Spread and enemies on tiles for each preset;
   - an explicit criterion that assertions must not freeze provisional tuning (P07, P09 and P10 reviews each blocked on this);
   - a short "manual test checklist" section for the user's next manual round.
6. **Open questions.** List any that genuinely need the user, each with a recommended default. Apply the default and mark it provisional; do not block.

## Context

Read:

- `docs/CURRENT.md`, `docs/plans/README.md`, the brief, and ADR-0004 with its amendments;
- the TR plan `docs/plans/2026-10-04-d005e5f4-poc-001-two-ring-board.md`;
- the P02, P04, P05, P06, P07, P08, P09, P10, P11 and P12 plans and their amendments;
- the prototype `README.md` public contracts;
- the playtest reports above;
- source under `poc-001-linked-formation/src/` as needed.

## Restrictions

- Edit only the brief, plan files, the plan index, ADR-0004 (only if the arena or enemy decision changes its recorded scope: add a dated amendment and preserve history), and your report. Do not touch source, tests or tooling. Do not edit `docs/CURRENT.md` or `docs/TASK_LOGS.md`.
- Work and commit only in `/opt/dev/tehom-brainlab-ring`, branch `ring-formation`, from BASE `ef0e3b4`. That base already contains the playtest evidence. Commit only your files; leave any other untracked mailbox file alone. Do not merge or push.
- Disposable files go in the OS temp directory.

## Expected output

Commit this assignment unchanged together with `docs/mailbox/ring-formation/architect.md` and the amendments. The report starts with the `ruach-handoff` YAML block: revision, changed paths, the recommended enemy placement and its argument, open questions with defaults, and blockers. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/ring-formation/architect.md --repo /opt/dev/tehom-brainlab-ring` until it reports `ok: true`.

Terminal handoff:
- report SHA;
- a summary of the mappings;
- the enemy placement recommendation with its argument;
- the rule changes;
- the task split;
- open questions;
- blockers.
