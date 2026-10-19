# Assignment: council on POC 002 direction and combat specification (task COUNCIL-poc002)

Issued by: Coordinator, 2026-10-19. Role: architect (design and recommendation only; no implementation). The user asked for a three-member council: Claude Opus 5.5 high (`opus`), GPT-6.1-Sol high (`sol-a`), and GPT-6.1-Sol high (`sol-b`). Each member receives this same assignment and works **independently**: do not read the other members' reports (`architect-*.md` in this folder other than your own) while working.

## Workspace

Worktree `/opt/dev/tehom-brainlab-poc002-council` (branch `poc-002-council`, from master `c82ec3c`). Write ONLY your report file. **Do not commit, stage, or edit any other file**; the Coordinator arranges committing. Do not load or follow any `ruach-workflow-*` skill. Disposable working files go in the OS temporary directory, never in the repository.

## Inputs

- [source-1-critical-review.md](source-1-critical-review.md): an external critique of the TEHOM pivot and a ten-step plan, written against remote master `c82ec3c`.
- [source-2-decisions.md](source-2-decisions.md): the later, narrower follow-up. It records the user's choices and the external assistant's proposed POC 002 content.

Both come from the user's design conversation with another assistant, and the user pasted both into this session. Where source 2 attributes a choice to the user, treat it as decided:
- POC 002 is **combat only**: a combat selection screen plus a short encounter gauntlet. It is not a miniature dungeon RPG, so the 8–12 room slice and the exploration, save, and quest steps of source 1 are out of POC 002's scope.
- POC 002 uses Phaser and TypeScript. After tester feedback, the rules move to a C#/.NET implementation with Godot presentation. Parity against recorded battles is the migration acceptance test.
- The simulation is owned by the game. No Phaser object enters the combat state.
- Art: 32×32 exploration tiles, a 640×360 viewport, and separate large combat illustrations.
- World scale will be decided later by exploration prototypes.

Everything else, including the kits, enemies, boss, Guard 50%, menus, the gauntlet, and source 1's research claims, is a **proposal**. Assess it; don't assume it.

Repository context to inspect (POC 001 is preserved and independent):
- `docs/prototypes/poc-001-linked-formation.md`: the POC 001 brief. Its roster is Ugallu, Girtablilu and **Pazuzu**; source 2 uses **Anzû**.
- `docs/CURRENT.md`, `docs/adr/0004-repository-and-poc-direction.md`, `docs/adr/0005-repository-management-and-tooling.md`, `docs/adr/0006-contract-invariants-and-black-box-testing.md`, `docs/SCHEMA.md`, `docs/plans/README.md`, and root `README.md`.
- `poc-001-linked-formation/src/`: the command boundary, intents (P05), previews (P09), replay records (P11), and the abilities, including `Sting`. Read these for patterns worth reusing, not to extend them.
- Recorded findings: `docs/playtests/`, `docs/mailbox/ai-playtest-20261005/`, `docs/mailbox/p17-collector/`.

## Question

What should POC 002 be in concrete, buildable terms, and what is a first numerical combat specification that an Implementer could build without inventing rules?

## Your report must cover

1. **Assessment of the sources against the repository.** Which repository claims in source 1 are accurate, inaccurate, or stale? Cite file:line. Which recommendations do you disagree with, and why? Keep this short; don't re-review the literature.
2. **Open decisions, with a recommendation on each:**
   - The prototype folder name. Source 1 proposes `poc-002-dungeon-combat`, and an earlier repository check referenced `poc-002-linked-tactics`.
   - Anzû versus Pazuzu.
   - Whether enemies declare their actions in advance. Revoke presupposes this, and POC 001 has intents (P05).
   - The minimum scope for Item, Talk and Escape, or whether to defer them.
   - What to reuse from POC 001, as a copied pattern or as shared code, consistent with ADR-0004/0005 and the "shared code only when reuse is demonstrated" rule.
   - The portable content and record format (JSON content IDs, initial state, command log, expected events) that supports the later C# parity test without building a mod framework.
   - Any other decision you think the user must make before implementation.
3. **Draft numerical combat specification.** Concrete numbers and rules, not tables of intent:
   - Turn structure and exact ordering: player phase, enemy phase, status ticks, Guard expiry, intercepts, Revelation threshold checks, deaths, and victory and defeat checks.
   - Component model: integrity versus life, what destruction removes, how targets are made valid or invalid, and how armor interacts with physical and magical damage.
   - The three Brood: HP, Revelation capacity, and each action (Attack, two Skills, Guard) with costs, numbers, targets and timing.
   - Revelation: gain sources, threshold(s), and **one Rapture and one Rupture per Brood**, each with its trigger, duration and affected actions. Cover repeated crossings, defeat during transformation, and expiry.
   - The three ordinary enemies and the Warden of Correct Form: life, components and integrity, action schedules, targeting rules, and what each destroyed component removes.
   - Status rules: poison stacking and timing, weaken, clamp/hold, and protection.
   - Encounter list for the selection screen and the three-fight gauntlet, including what carries between fights.
   - Edge cases an Implementer must not guess.
   Your numbers are a provisional first tuning. Show your arithmetic for at least: (a) Girtablilu's first exposed turn against the Celestial Guard; (b) a solo, a duo and a trio against the Warden; (c) whether any single opening dominates, and why or why not.
4. **Falsification and test plan:** what automated checks (deterministic scenario sweeps, simple policy searches) and first human tests would show your specification is wrong. Name the failure signals.
5. **Recommended next steps:** the ordered artifacts to produce (ADR, brief, plan) and where they belong in `docs/`, with the smallest first implementation checkpoint.
6. **Risks and open questions** for the user.

Distinguish verified repository facts (with file:line), user decisions, source proposals you accept, and your own new proposals. Keep the report under about 4,000 words. Put long tables in the spec section, and don't repeat the sources.

## Output

Report: `docs/mailbox/poc-002-council/architect-<member>.md`, where `<member>` is `opus`, `sol-a`, or `sol-b` as given in your prompt. Start with the ruach-handoff field block (`.agents/skills/ruach-handoff/SKILL.md`). Set `source_baseline: c82ec3c` and give no candidate revision, since nothing is committed. If Bun and the skill's dependencies are available, run `bun .agents/skills/ruach-handoff/scripts/validate.ts <report> --repo .` and record the exact result. If dependencies are missing, do not install them into the repository; say so, or validate with a copy in the OS temporary directory and record that. When done, reply with a three-line summary: your top recommendation in one sentence, the biggest risk you found, and the report path.
