# Assignment: POC 002 decision record, brief, and implementation plan (task P2-DESIGN)

Issued by: Coordinator, 2026-10-19. Role: **architect**. You write design and planning artifacts only. Never implement, scaffold, or edit application code.

## Workspace

- Worktree `/opt/dev/tehom-brainlab-poc002`, branch `poc-002-component-combat`, BASE `19af724`. That branch is master `c82ec3c` plus the council commit.
- Commit your artifacts, this assignment unchanged, and your report on this branch. Do not push.
- Disposable files, such as a tuning simulator, go under the OS temporary directory, never in the repository.
- Do not load or follow any `ruach-workflow-*` skill.
- Do not edit `docs/CURRENT.md` or `docs/TASK_LOGS.md`. Those belong to the Coordinator; return any proposed corrections to them in your report.

## Goal

The user asked the Coordinator to build the full POC 002. Turn the council's work into the canonical documents that Implementers will build from. The outcome must be a decision record, a brief containing one complete numerical combat specification, and a bounded checkpoint plan. Together they must let several Implementers build the whole prototype without inventing rules.

## Inputs (read them all)

- `docs/mailbox/poc-002-council/source-1-critical-review.md` and `source-2-decisions.md`: the user's external design conversation, quoted verbatim.
- `docs/mailbox/poc-002-council/architect-opus.md`, `architect-sol-a.md`, `architect-sol-b.md`: three independent council reports.
- `docs/adr/0002`–`0006`, `docs/SCHEMA.md`, `docs/plans/README.md`, `docs/prototypes/poc-001-linked-formation.md` (the brief pattern), `README.md`, `justfile`, `bin/`, `scripts/`, and `assets/manifest.json` with `assets/CREDITS.md`.
- `poc-001-linked-formation/`: package.json, README, `src/core/*`, and the Docker/Bun/just wiring and `tests/browser-*.mjs`. These are patterns to copy. Do not import them.

## Decisions (authority: user, 2026-10-19)

The user said "go" to the Coordinator's recommendations. Record these as user decisions, and mark the four the user didn't choose individually as **provisional, open to change after the first human test**.

User-decided in source 2:
- POC 002 is **combat only**: a selection screen plus a three-fight gauntlet. There is no exploration, saving, quest, or recruitment.
- **Phaser + TypeScript now.** After tester feedback come C#/.NET rules and Godot presentation. Parity against recorded battles is the migration gate.
- The simulation is owned by the game. No Phaser object enters combat state, and animation never decides rules.
- Art: 32×32 exploration tiles and a 640×360 viewport, with separate large combat illustrations. World scale is deferred.

The council agreed unanimously, and the user accepted by saying go:
- Folder `poc-002-component-combat/`, with root just recipes `poc-002-*`.
- **Anzû** (ID `anzu`) is new to POC 002. POC 001 and its Pazuzu stay untouched.
- Enemies **declare** exact action, source component, target and damage before each player phase. A declared target is never changed. Destroying a component cancels its declared actions.
- Talk and Escape are deferred and not shown. The menu is **Attack, Skills, Guard, Item**.
- POC 001 patterns are copied. Nothing goes into `shared/`, and there are no runtime imports from POC 001.
- Records exist from the first checkpoint. They are integer-only, use a closed effect-kind enum, have no mod framework, and contain embedded content, the full initial state, accepted commands with expected events per command, and the expected final state.
- Component damage never overflows into life. All numbers are visible in this diagnostic build. Enemy stats never scale with party size.

Provisional, adopted by the user's "go":
1. **Revelation rule: Opus's crossing-source rule.** If the Brood's own action cost causes the crossing, it gets Rapture. If an enemy effect causes it, it gets Rupture. While transformed, further Revelation gains are lost as HP. On expiry, Revelation becomes ⌊cap/2⌋.
2. **Warden: add a non-removable core pulse**, a small magical hit every round (Sol-a's proposal), so dismantling never makes it harmless. Integrate this with whichever schedule you choose, and retune.
3. **One healing consumable** with two uses per gauntlet, under Item.
4. **Solo target:** at least one demonstrated solo Ugallu route against the Warden from full health. There is no solo promise for any other Brood or encounter. Duo and trio are the gauntlet balance targets: duo tense, trio forgiving.

## Required artifacts

1. **`docs/adr/0007-poc-002-component-combat.md`**, plus a row in `docs/adr/README.md`. Record the direction (combat only, the engine path, the parity gate, the simulation boundary, the art specification as a TEHOM decision), the decisions above, and their status. Do not amend ADR-0004 silently. If ADR-0004's statement that POC 001 is the TypeScript target needs a note, add a dated cross-reference amendment.
2. **`docs/prototypes/poc-002-component-combat.md`**, plus a row in `docs/prototypes/README.md`. It holds the question, hypotheses, falsifiers, scope and non-goals, and the **complete numerical specification v1** as its decision record, with provisional tuning labelled as such. Start from the strongest council spec; Opus's is the only one checked by search. Fold in decisions 1–4, and resolve every disagreement explicitly: poison model, Warden schedule, gauntlet order, Scribe and Beast details, and Item numbers. The spec must cover everything the council's edge-case sections list, so that no Implementer has to guess.
3. **Tuning check.** With a disposable simulator outside the repository, show:
   - (a) a solo Ugallu Warden win from full health;
   - (b) no single round-1 opening dominating the Warden across the seven parties, using the council's dominance criteria;
   - (c) Girtablilu's first exposed turn against the Celestial Guard;
   - (d) gauntlet outcomes for the trio and the three duos.
   Put the arithmetic and search limits in the brief or in your report. Search results are heuristic, not proof.
4. **Plan** at `docs/plans/2026-10-19-<rand8>-poc-002-component-combat.md`, in ADR-0002/0003 format, plus a new POC 002 section in `docs/plans/README.md`. It must define checkpoints with stable IDs (Q01…), dependencies, **disjoint file ownership** so that independent checkpoints can run concurrently in separate worktrees, acceptance criteria, and verification commands, labelled proposed until they exist. "Full POC" means source 2's implementation steps 1–4:
   - a headless rules core with all content: three Brood, three enemies, the Warden, six transformations, statuses and the Item;
   - battle records, replay and a parity fixture corpus;
   - an automated scenario sweep and policy probe harness, runnable via just, which reports the falsification signals;
   - a Phaser battle UI at 1280×720 with two-way component selection (list ↔ illustration), generous hit regions, declared-intent display, numbers, previews through the real rules, and keyboard support;
   - the selection screen (any party of one to three × each encounter) and the three-fight gauntlet with carry-over;
   - placeholder art that needs no purchased assets (labelled shapes and the existing emblems, with provenance; Anzû has no emblem);
   - distinct audio cues for hit, armor, component destruction, poison, Revelation and death. Synthesized Web Audio is acceptable and avoids licensing. Decide this and record it.
   - browser harness tests via just;
   - a human-test protocol document for the first external test, as a template that is not executed.
   Excluded: source 2's steps 5–7 (running external tests, the C# port, Godot) and any change to POC 001.
   The plan must name an integration owner role, say which checkpoints may run in parallel, and give each checkpoint a self-contained contract an Implementer can execute alone.
5. **Entry-point corrections that are not protected documents:** fix the stale root `README.md` prototype table and text (`README.md:29,58`), the stale lines in `docs/README.md`, and the POC 001 status row in `docs/prototypes/README.md`. Cite the CURRENT/TASK_LOGS evidence. Propose CURRENT corrections in your report; don't make them.

## Acceptance conditions

- A reader can tell user decisions, provisional decisions, proposed tuning, and deferred ideas apart.
- The spec answers every ordering and edge-case question raised in the three council reports, or explicitly defers it with a default.
- Every checkpoint has a numbered acceptance list, owned paths, verification, and dependencies. Parallel checkpoints share no owned files.
- The links resolve: relative `.md` links, with anchors where they are used.
- `git diff --check` is clean.
- No application code, no CURRENT/TASK_LOGS edits, and no changes under `poc-001-linked-formation/`.

## Output

- **Report:** `docs/mailbox/poc-002-component-combat/architect.md`, beginning with the ruach-handoff block (`.agents/skills/ruach-handoff/SKILL.md`). Set `source_baseline: 19af724` and give a `candidate_revision` for your commit.
- **Validation:** validate the report with a copy of the skill under the OS temporary directory: run `bun install --frozen-lockfile` in the copy, then `bun <copy>/scripts/validate.ts <report> --repo .` from the worktree root, and record the exact result.
- **Commit:** commit everything.
- **Reply:** your commit SHA, the plan path, the list of checkpoints showing which can run in parallel, and any decision you need from the user.
