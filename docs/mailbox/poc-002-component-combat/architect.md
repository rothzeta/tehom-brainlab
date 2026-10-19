task: P2-DESIGN
role: architect
status: complete
outcome: "ADR-0007, the POC 002 brief with a complete numerical specification v1 (tuning checked by a disposable simulator) and a Q01-Q10 plan with disjoint ownership are committed; entry points are corrected. Ready for Q01."
source_baseline: 19af724
candidate_revision: 6ae41af
amendment_revision: dcd4b44
amendment_2_revision: 835a09c
amendment_3_revision: d887a98
artifacts:
  - docs/adr/0007-poc-002-component-combat.md
  - docs/adr/README.md
  - docs/adr/0004-repository-and-poc-direction.md
  - docs/prototypes/poc-002-component-combat.md
  - docs/prototypes/README.md
  - docs/plans/2026-10-19-db0bad72-poc-002-component-combat.md
  - docs/plans/README.md
  - README.md
  - docs/README.md
  - docs/mailbox/poc-002-component-combat/assignment-architect.md
  - docs/mailbox/poc-002-component-combat/architect.md
verification:
  - "Tuning check: disposable Bun simulator and multi-heuristic beam search outside the repository (session scratch); results and limits in the Tuning check section. Heuristic, not proof."
  - "Relative Markdown links and anchors in the nine changed or new documents: checked with a scratch link checker; 0 missing after fixing two. The brief's link to this report resolves once this report is committed."
  - "git diff --cached --check on the artifact commit 6ae41af: clean."
  - "git diff --stat 19af724..6ae41af -- poc-001-linked-formation shared docs/CURRENT.md docs/TASK_LOGS.md: empty."
  - "Handoff validator (skill copied to the OS temp dir, bun install --frozen-lockfile there): result recorded in the Validation section."
review: not-run
discoveries:
  - "Fixed enemy stats make a solo Ugallu Warden route [P4] and a tense fresh duo Warden fight mutually exclusive; with P4 honoured, the fresh duo/trio Warden is forgiving and its openings nearly indifferent with Salves. The gauntlet carries the duo tension (duos end at 9-63% HP)."
  - "Opus's Hold (-2 to every hit) makes the 1-point pulse harmless and permits an indefinite stall; v1 limits Hold's reduction to physical hits."
  - "The solo Ugallu route needed Rend to ignore component armor and Ugallu at 40 HP; both also strengthen the Ugallu duos."
  - "Parallel browser runs contend for one port (TASK_LOGS 2026-10-06); the plan gives POC 002 its own ports (5273/4273) and container prefix."
  - "CURRENT corrections are proposed below; the POC 001 brief status line (docs/prototypes/poc-001-linked-formation.md:3) and the lexicon Brood row are also stale but were outside this assignment."
blockers: []

# POC 002 design: Architect report (P2-DESIGN)

Author: Architect (Claude Opus 5.5), worktree `/opt/dev/tehom-brainlab-poc002`, branch `poc-002-component-combat`. Assignment: [assignment-architect.md](assignment-architect.md), committed unchanged with this report.

## Proposed design and rationale

- **[ADR-0007](../../adr/0007-poc-002-component-combat.md)** records the following, without amending ADR-0004 silently:
  - the user's direction: combat only; Phaser/TypeScript → C#/.NET + Godot; recorded-battle parity as the migration gate; the simulation boundary; the art specification (32×32 tiles, 640×360, separate combat illustrations);
  - the seven council decisions;
  - the four provisional decisions P1–P4;
  - two Architect delivery decisions: synthesized Web Audio cues, and placeholder art from the two registered emblems plus labelled shapes.

  ADR-0004 gains a dated cross-reference amendment. Its POC 001 TypeScript target and asset parameters are unchanged.
- **[The brief](../../prototypes/poc-002-component-combat.md)** holds the question, six hypotheses with automated and human falsifiers, scope and non-goals, and the decision record. Its council-disagreement table resolves the poison model, the Warden schedule, the gauntlet order, the Scribe and Beast, the Item, Hold, Rend, Ugallu and phase ending. It then gives the **numerical specification v1** in 13 sections: conventions, commands and rejection codes, exact round ordering, damage, statuses, kits, Revelation and forms, enemies, the Item, encounters and gauntlet, display and previews, the portable record and content format, and edge cases E01–E50. Every council edge case is answered.
- **[The plan](../../plans/2026-10-19-db0bad72-poc-002-component-combat.md)** defines checkpoints Q01–Q10 with dependencies, an ownership table that keeps parallel checkpoints disjoint, a numbered acceptance list per checkpoint, proposed verification commands, an integration owner role, and stop conditions S1–S6. The plan never restates rules; it cites brief sections.

**Starting point and changes from Opus's spec.** I started from Opus's spec, the only one checked by search, and changed it where the user's provisional decisions or the search required:

- Warden: source 2's one-beat Clamp → Saw → Choir cycle, plus a 1-point pulse to every Brood every round [P2]. The Saw deals 6, or 20 against a Clamped recipient. The core has 60 life.
- Ugallu: 40 HP; Rend ignores component armor; Rupture adds +1 per hit instead of +2.
- Hold's −2 now applies to physical hits only.
- The ordinary enemies were hardened slightly: the Guard's arm 12, limb 8 and Strike 9; the Scribe's hand and tongue 8; the Beast's locomotion organ 9.
- The gauntlet is Guard+Scribe → Guard+Beast → Warden.

## Checkpoints and parallelism

| ID | Checkpoint | Depends on | Parallel with |
| --- | --- | --- | --- |
| Q01 | Scaffold, toolchain, content v1, contracts | — | Q10 |
| Q02 | Headless rules core (all content, previews, gauntlet, fight records) | Q01 | Q06, Q07, Q10 |
| Q03 | Records corpus, replay CLI, parity and hostile fixtures | Q02 | Q04, Q05 (Q06, Q07, Q10) |
| Q04 | Scenario sweep and policy probe harness | Q02 | Q03, Q05 (Q06, Q07, Q10) |
| Q05 | Phaser battle UI | Q02 | Q03, Q04 (Q06, Q07, Q10) |
| Q06 | Synthesized audio cues | Q01 | Q02–Q05, Q07, Q10 |
| Q07 | Placeholder art and hit regions | Q01 | Q02–Q06, Q10 |
| Q08 | Selection screen, gauntlet flow, record export | Q02, Q05 | Q03, Q04, Q06, Q07, Q10 |
| Q09 | Integrated verification, end-to-end browser harness | Q01–Q08 | Q10 |
| Q10 | Human-test protocol template (docs) | — | any |

The integration owner is an Implementer assigned by the Coordinator. It merges checkpoints in dependency order, owns the root `justfile` `poc-002-*` recipes and the prototype README assembly, and reruns bare verification after each merge.

## Affected components

These documents only: ADR-0007; the ADR index; ADR-0004 (amendment only); the brief; the prototypes index; the plan; the plans index (title generalised, POC 001 content unchanged, POC 002 section added); root `README.md` (layout, prototype table, stack and recipe text, start-here text); `docs/README.md`. No application code, nothing under `poc-001-linked-formation/` or `shared/`, and no CURRENT or TASK_LOGS edits.

## Constraints, dependencies and risks

- **Lanchester constraint [P4].** With fixed stats, n Brood have n times the actions and the HP. The isolated fresh Warden that one Ugallu can beat is mild for two or three, and its openings are close to indifferent once Salves heal the differences. The gauntlet supplies the duo tension instead.
- **Long solo route.** The solo Ugallu route takes 18 rounds and depends on fully dismantling the Warden: tedium risk for a diagnostic route.
- **Fixation.** Hold redirects concentrate damage on Ugallu, so the Ugallu duos are comfortable (U+G 63%) while G+A ends at 9%. The spread between duos is a kit property to watch.
- **Breakpoints:** Stolen Bolt 8 destroys the Scribe's hand or tongue (8) in one action, and Rend 10 destroys the locomotion organ (9).
- **Narrow core-race lead.** Without Salves, core-focused openings lead by 0–2 HP in every multi-Brood Warden fight.
- **Search limits.** All tuning is heuristic search. A "loss" means no win was found, and the gauntlet search is myopic per fight.
- **C# parity hazards:** integer rounding (only ⌈d/2⌉ and ⌊cap/2⌋ exist), code-point ordering and event granularity. The brief §12 fixes these as contract.

## Unresolved questions and decisions

None blocks Q01. For the user, each is optional and has a default already in the spec:

1. **Keep the solo promise [P4]** at the price of a mild fresh duo/trio Warden? The default is yes, as decided. The alternative, if human tests find the isolated Warden indifferent, is to drop P4 and restore Opus's harder Warden (a staggered schedule).
2. **Accept the Architect's kit changes needed for P4:** Rend ignoring component armor, Ugallu at 40 HP, Hold −2 for physical hits only. The default is accepted.
3. **Synthesized audio instead of imported packs** (ADR-0007). The default is synthesized.

## Implementation boundaries and readiness

Ready for Q01, with no blockers. Stop conditions S1–S6 in the plan route any rule gap back to the Architect as a brief amendment, so that Implementers never invent rules. Excluded: source 2 steps 5–7 and any POC 001 change.

## Tuning check

**Method.** I wrote a disposable deterministic simulator of brief §1–§10 in JavaScript, run with Bun, in the session scratch directory (not committed). It drove four searches:

- **Search:** per-action beam search with state de-duplication, run under five heuristic weightings, keeping the best terminal result. Widths: 100 for each probed opening's continuation; 150–250 for duo and trio fights and gauntlet fights; 800–6,000 for solo searches. The limit is 160 search steps and round 25.
- **Openings:** exhaustive enumeration of distinct round-1 joint openings (1,408 in total), each continuation searched.
- **Gauntlet:** fight by fight, keeping carry-over. This is myopic: intermediate fights maximise survivors, then HP, then unused Salves valued at 12 HP each.
- **Sweep:** 7 parties × 7 encounters, fresh start, with 0 and 2 Salves.

Search is heuristic. A found line is a witness under the brief's rules. A "loss" means that no win was found. The simulator was revised during tuning: it fixed a ledger tie-break order and limited Hold's reduction to physical hits after a stall exploit appeared. The brief's two seed traces were checked round by round by hand against the spec.

**Results (v1).** The brief's [tuning check](../../prototypes/poc-002-component-combat.md#tuning-check-v1) holds the full tables:

- **(a)** Solo Ugallu beats a fresh Warden: round 18 with 3/40 HP and no Salves; 12 HP with one Salve; 21 HP with two. The line is in the brief.
- **(b)** No opening class meets the dominance rule (best in ≥ 6 of 7 parties, with the others lost or ≥ 10 HP worse). With 2 Salves the best classes are: U clamp-first; A choir-first; UG and UA mixed; GA core; UGA mixed. Runner-up gaps are 0–5 HP; G cannot win solo. Without Salves, a core focus is best in all four multi-Brood parties, by 0–2 HP. Indifference with Salves: 797 of 1,080 trio openings end within 2 HP of the best; without Salves, 27 of 1,080.
- **(c)** Girtablilu's first exposed turn against the Guard, solo, no Salves:
  - Envenom: win in round 4 with 6 HP.
  - Pincer on the arm: win in round 6 with 9 HP.
  - Guard: win in round 5 with 1 HP.
  - Pincer on the body or limb: loss.

  Envenom costs 6 HP against Guard's 5 and adds delayed damage.
- **(d)** Gauntlet: the trio wins with 87% of HP; U+G 63%; U+A 48%; G+A 9%. The solos lose (U in fight 2; G and A in fight 1).

**Selection sweep, fresh (HP left with 0 / 2 Salves; L = no win found).** Solo results:

| Encounter | U (40) | G (24) | A (22) |
| --- | --- | --- | --- |
| guard | 31 / 40 | 9 / 24 | 16 / 22 |
| scribe | 38 / 40 | 20 / 22 | 20 / 22 |
| beast | 22 / 32 | 12 / 23 | L / 7 |
| guard-scribe | 23 / 40 | L / L | L / L |
| beast-scribe | 6 / 26 | L / L | L / L |
| guard-beast | L / 15 | L / L | L / L |
| warden | 3 / 21 | L / L | L / 2 |

Duos and trio, with 0 Salves:

- **Single ordinary enemies:** every duo and the trio win at or near full HP.
- **guard-scribe:** U+G 54/64, U+A 58/62, G+A 34/46, trio 84/86.
- **beast-scribe:** U+G 52, U+A 45, G+A 34, trio 77.
- **guard-beast:** U+G 51, U+A 42, G+A 30, trio 77.
- **warden:** U+G 49, U+A 46, G+A 36, trio 78.

Single-enemy selection fights are diagnostics and are trivial for groups. The gauntlet pairs carry the attrition.

## Proposed CURRENT corrections (Coordinator only)

Evidence: [CURRENT P10](../../CURRENT.md#p10-playable-patrol), [Boss experiments](../../CURRENT.md#boss-experiments-p13p17), [TASK_LOGS 2026-10-06](../../TASK_LOGS.md#2026-10-06-boss-experiments-p15-p16-p17-and-browser-runner), `git log master` (`c82ec3c` follows `51bf5d2`).

1. `docs/CURRENT.md:3`: "As of 2026-10-04" understates the later sections. Restate the date, or mark the paragraph as historical.
2. `docs/CURRENT.md:7` is stale in three places:
   - "twelve implementation plans": there are now 20 POC 001 plans plus the POC 002 plan;
   - "P13–P17 accepted for implementation, P13–P14 delivered": P13–P17 are all delivered (CURRENT:175-200);
   - "Combat remains unimplemented": combat is delivered (CURRENT:121-130).
3. `docs/CURRENT.md:28`: "The P01–P12 sequence is proposed work" contradicts the delivered P01–P11 and P13–P17 recorded in the same file.
4. `docs/CURRENT.md:207`: "Local master is at `51bf5d2`". Master is now `c82ec3c`, a documentation-only successor.
5. `docs/CURRENT.md:211`: "Playtests currently contains navigation and a template only". It also holds the [P11 automated evidence](../../playtests/2026-10-05-poc-001-p11-automated.md).
6. Add a POC 002 entry after acceptance: ADR-0007, the brief and plan Q01–Q10 (proposed, not implemented), the council reports and this report.

Also stale, but neither protected nor assigned: `docs/prototypes/poc-001-linked-formation.md:3` says P13–P17 are not yet implemented, and `docs/lexicon/README.md:8` defines Brood as the POC 001 roster only. Both are left for a Librarian or a later assignment.

## Validation

The skill directory was copied to `/tmp/tmp.N1N53J4dvW/ruach-handoff`, and `bun install --frozen-lockfile` ran there: exit 0, 6 packages installed. Nothing was installed in the repository. From the worktree root, `bun /tmp/tmp.N1N53J4dvW/ruach-handoff/scripts/validate.ts docs/mailbox/poc-002-component-combat/architect.md --repo .` exited 0 with `schema_version: 1`, `ok: true` and `diagnostics: []`. It resolved `/source_baseline` to `19af7248b20fb7e97d9176370aeac01aab22fbfc` and `/candidate_revision` to `6ae41af6576e40f48a42450ad032c331f03e440a`. The run was repeated after this paragraph was inserted (below the YAML block).

## Amendment (2026-10-19): unfinished-attempt export

Coordinator-authorized follow-up, resolving the first discovery of the [Q10 report](../poc-002-q10/architect.md). Commit `dcd4b44` (`amendment_revision` above) changes two documents:

- **Plan, Q08 acceptance 3:** export is available at any time during the current attempt, until Reset or Return to selection. This covers a fight or a gauntlet, finished or unfinished, after a Brood's death and in `between-fights`. Browser tests export unfinished attempts (mid-fight, and mid-gauntlet after a death) and replay each to the exported state.
- **Brief §12:** a dated note that a record may be unfinished. Its `finalState` is the state at export, in `player` or `between-fights`, and replay reports the final phase in place of an outcome.

No rule, number or other checkpoint changes. The Q10 protocol's export instruction ("export first if the build allows it") still holds. Links and anchors in both edited files resolve (0 missing), and `git diff --cached --check` is clean. The handoff block, with `amendment_revision` added, was revalidated with the temporary-copy validator: exit 0, `ok: true`, `diagnostics: []`, and all three revisions resolved.

## Amendment 2 (2026-10-19): end-of-round unit and consistency sweep

This is a Coordinator-authorized brief amendment after the Q02 S1 stop (`docs/mailbox/poc-002-q02/implementer.md`, branch `p2-q02` at `49b442d`, read-only). Commit `835a09c` (`amendment_2_revision`) changes the brief, adding [Amendment A2](../../prototypes/poc-002-component-combat.md#amendment-a2-2026-10-19-consistency-rulings) with tags inline. It also updates plan Q02 acceptance 7 to cover E01–E51.

**The Q02 question.** E1 poison and E2 Girtablilu's transformation HP loss are **one unit**, followed by a single outcome check at E3 with defeat precedence. A tick that kills the last enemy therefore does not pre-empt E2. If E2 kills the last Brood, the result is defeat. §3.4 stands and E02 was corrected. This is what the tuning simulator implemented, so no tuning changes and the simulator did not need rerunning.

**Sweep.** I cross-checked §3 against §6–§10, the rules against E01–E50, the brief against plan Q02–Q08, and the brief against the Q01 contracts in `src/core/types.ts`, which already provide a `form` damage source and a null forecast. The remaining rulings:

- **A2-2:** the Ward ends at E4, in agreement with §3.4.
- **A2-3:** the scope of each rejection code for targets and actions.
- **A2-4:** the revision runs for the whole gauntlet; intent IDs are unique within a fight.
- **A2-5:** Guard, Hold, Weakened and Rupture +1 apply only to enemy intent hits, not to burns or E2 loss. E2 loss is emitted as `brood-damaged` with a `form` source.
- **A2-6:** Girtablilu's Rapture Envenom keeps the living-part condition.
- **A2-7:** a transformed Brood is eligible for the Clamp, counted at its cap.
- **A2-8:** previewing `endPhase`, or a battle-ending command, gives a null forecast.
- **A2-9:** the gauntlet reset timing; no `act` between fights.
- **A2-10:** E24 is split by timing, and E31's wording is fixed.
- **A2-11:** new E51: a held ally that dies before an intent targeting it means the intent is skipped, not redirected.
- **A2-12:** definitions of the Q04 harness signals: opening class, dominance, indifference, policy match, rare action, disabling first, Revoke every Saw, and cleanup.

**Checks.** The link check found 0 missing links in the brief and plan; the reference to the Q02 report is given as a path because that branch is not merged. `git diff --check` was clean. Only these two files were staged, by name, after confirming that no merge was in progress. The handoff block, with `amendment_2_revision` added, was revalidated with the temporary-copy validator: exit 0, `ok: true`, `diagnostics: []`, all four revisions resolved.

## Amendment 3 (2026-10-19): portable integer range

This is a Coordinator-authorized brief amendment after review finding F2 (`docs/mailbox/poc-002-review/reviewer.md`, branch `p2-review`) and the P2-FIX1 S1 stop (`docs/mailbox/poc-002-fix1/implementer.md`, section "F2 — S1 stop", fix worktree at `cbcca91`). I read both and edited neither. Commit `d887a98` (`amendment_3_revision`) adds [Amendment A3](../../prototypes/poc-002-component-combat.md#amendment-a3-2026-10-19-portable-integer-range) to the brief, with tags inline in §2, §12 and §13.

- **A3-1, content bounds (§12, new E52).** `loadContent` keeps its per-field range check. It now also rejects content unless six derived values are each at most 2³¹ − 1:
  - B1: action raw, as the largest base or bolt amount plus every attack bonus listing the action.
  - B2: the largest poison times the largest multiplier, and the largest poison plus the largest Envenom gain.
  - B3: intent amount plus its modifiers plus every incoming bonus.
  - B4: Revelation cap plus the largest single gain.
  - B5: the sum of each enemy's pools, which bounds the ledger.
  - B6: every duration is at least 1.

  The bounds are conservative: no reduction is subtracted. They bound intermediate values as well as emitted ones, so a 32-bit C# port cannot overflow. Replay applies the same check to the embedded content. The reviewer's multiplier of 2147483647 fails B2. Computed on the committed v1 content with a scratch script, the largest value is 128 (B5, the Warden) and every duration is 2.
- **A3-2, run counters (§2, new E53).** These counters have no content bound: the implementer showed that a fight against harmless dismantled enemies has no end. So an otherwise legal `act`, `endPhase` or `continue` that would set the revision, the round or a new expiry (round + duration − 1) above 2³¹ − 1 is rejected atomically with the new closed code **`limit-reached`**.
  - **Precedence:** checked last, after `illegal-target`, and only against the command's actual result. A command that ends the battle before the next round is declared is therefore accepted.
  - **Implementation and types:** implementations test the limit without 32-bit overflow. The code is appended to the end of `REJECTION_CODES`, an addition-only change under plan S3.
  - **Previews:** a preview of such a command shows the rejection, and a forecast `endPhase` that would be rejected is returned as that rejection. This needs no new forecast case, because `Preview.forecast` is already a `CommandResult`.
- **A3-3, snapshots (§2).** There is no new invariant and no headroom requirement. Any revision, round or expiry up to 2³¹ − 1 is valid in a complete initial state, and its commands stop where `limit-reached` applies. So a snapshot at revision 2³¹ − 1 has a valid record only with zero commands.

Not chosen: wrapping, saturation, a round ceiling and ending combat automatically. Each would change play or event semantics. The rejection keeps §2's rule that an accepted command increments the revision exactly once, and changes nothing that v1 can reach in practice.

**Plan.** Q01 acceptance 3 now requires a test-owned rejection for each of B1–B6, plus acceptance of v1. Q02 acceptance 7 now covers E01–E53. Q02 acceptance 1 already requires the §2 codes in precedence order, which includes `limit-reached`. Implementing these rules belongs to P2-FIX1. This amendment changes no code.

**Checks.** The link check found 0 missing links in the brief and plan, and `git diff --check` was clean. The brief and plan were staged by name, then this report in a separate commit, each after confirming that no merge was in progress. The handoff block, with `amendment_3_revision` added, was revalidated with the temporary-copy validator.
