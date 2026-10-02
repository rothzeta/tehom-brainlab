# POC 001 — bounded implementation plan index

Twelve draft plans for the linked-formation prototype, written on 2 October 2026 against repository baseline `79f9498051df0281e6e9d3c904e9eee32f014873`.

**This is a navigation and authority note, not a thirteenth implementation plan.** Adding these documents does not implement the prototype, approve new game rules, or constitute a playtest. No package installation, application build, unit test suite, or browser combat test was run as part of drafting.

## Authority and source limits

The user supplied the ADR-0008 structure and instructed that each spec be an executable plan for one bounded capability or safety invariant, with numbered observable acceptance criteria. The user also supplied the ADR-0007 filename rule: `docs/plans/yyyy-mm-dd-[8 random characters]-{name}.md`.

Direct reads of `docs/adr/0008-implementation-plan-writing.md` and `docs/adr/0007-plan-filenames.md` returned Not Found at the inspected baseline. The repository tree contains no `docs/adr/` there. These plans therefore use only the supplied ADR excerpts; they do not invent the missing ADR texts or claim complete ADR compliance. Read and reconcile the actual ADRs if they become available before implementation.

The user explicitly requested `docs/plans/` for these files. Existing design material remains in `doc/`; no migration or second copy of that material is performed. The filename date is the drafting date. Eight-character tokens are randomly generated lowercase hexadecimal values, not sequence numbers. Execution order is expressed by P01–P12 and dependency links, not filename sorting.

Grounding sources:

- [Repository working guidance](../../AGENTS.md).
- [POC 001 design brief](../../doc/prototypes/poc-001-linked-formation.md).
- [Decision log](../../doc/decisions.md).
- [Prototype architecture and starting status](../../poc-001-linked-formation/README.md).
- [Actual shared asset manifest](../../assets/manifest.json) and [credits](../../assets/CREDITS.md).
- [Existing playtest report structure](../../doc/playtests/TEMPLATE.md).

The original fixed Apex/Shadow direction is not silently promoted back into this prototype. Conversely, these plans do not promote the new formation experiment to the production combat system.

## Reading the contracts

**Settled choices** are constraints already stated in the inspected sources or the user's instruction: the accepted POC scope, no walking/translation, shared maneuvers, engine-independent rules, existing assets, and the requested document format.

**Required contracts** describe what must be observably true to accept the bounded implementation. Some are engineering invariants proposed by the plan; those are identified locally. Because every plan is a draft, these are not claims that an implementation already satisfies them.

**Proposed implementation / experimental defaults** fill explicitly open implementation details such as coordinate presets, mask boundaries, damage values, targeting ties, and defeat behavior. They are recommendations for executable fixtures, not historical decisions or balanced gameplay. Resolve/amend them explicitly at implementation start; a change affecting another plan requires reconciling that dependent plan's fixtures and tests, not creating a second hidden constant.

All source/test file paths listed as proposed ownership are intended future paths. At the baseline the prototype has folders and a README, not a working TypeScript application. All commands in verification sections become executable only after the prerequisite plan supplies their scripts.

## Execution map

| ID | Plan | Bounded outcome | Direct prerequisites |
|---|---|---|---|
| P01 | [Browser harness](2026-10-02-a87b131a-poc-001-browser-harness.md) | Independently install, run, test, and build one browser shell. | None |
| P02 | [Formation algebra](2026-10-02-2e228a2b-poc-001-formation-algebra.md) | Preserve twelve labelled, reversible formations on 37 cells. | P01 |
| P03 | [Command boundary](2026-10-02-2dfffcd3-poc-001-command-boundary.md) | Reject illegal/stale commands without spending resources or mutating state. | P01, P02 |
| P04 | [Formation lab](2026-10-02-9d81c6df-poc-001-formation-lab.md) | Inspect, preview, commit, and reset formation-only interaction. | P01, P02, P03 |
| P05 | [Intent semantics](2026-10-02-d66a7452-poc-001-intent-semantics.md) | Keep fixed areas, following marks, and explicit facing changes distinct. | P02, P03 |
| P06 | [Damage and Fallen](2026-10-02-4c3c0d42-poc-001-damage-and-fallen.md) | Settle a hit and its lifecycle consequences deterministically. | P03, P05 |
| P07 | [Brood abilities](2026-10-02-f8938420-poc-001-brood-abilities.md) | Execute six actions without adjacency-created dead turns. | P03, P05, P06 |
| P08 | [Patrol round loop](2026-10-02-dc6612ec-poc-001-patrol-round-loop.md) | Run the ordinary patrol headlessly to victory or defeat. | P05, P06, P07 |
| P09 | [Preview equivalence](2026-10-02-d28ae958-poc-001-preview-equivalence.md) | Make combat previews match real transitions without mutation. | P04, P08 |
| P10 | [Playable patrol](2026-10-02-e7c77542-poc-001-playable-patrol.md) | Play all three patrol starts through the real browser interface. | P04, P08, P09 |
| P11 | [Reproducible playtests](2026-10-02-825a6700-poc-001-reproducible-playtests.md) | Replay actual attempts and record an explicit boss gate. | P10 |
| P12 | [Directional boss](2026-10-02-a18d7fe6-poc-001-directional-boss.md) | Test one boss using the same combat contracts. | P10, P11 with open gate |

P01–P04 produce the first interactive formation lab. P05–P09 complete the headless patrol rules and full preview invariant. P10 makes the patrol playable. P11 supplies actual evidence. P12 remains conditionally blocked until the recorded patrol review opens its gate. Completing documentation, compiling code, or passing unit tests does not automatically open that gate.

## Ownership of provisional defaults

| Decision family | Single owning plan |
|---|---|
| Axial convention, ring table, labelled shape mapping, Close threshold | P02 |
| Public command shape, revision checks, rejection semantics, action accounting | P03 |
| Sector masks, marks, cancellation, active-link/isolation selectors | P05 |
| Hit batching, mitigation, Shelter consumption, Fallen slots, terminal precedence | P06 |
| Six player ability effects and numeric defaults | P07 |
| Patrol HP, intention order, target ties, wounded presets, round cadence | P08 |
| Preview projection, conditional forecast, stale-session handling | P09 |
| Attempt-record schema and evidence hand-back | P11 |
| Boss HP, two-intention pattern, facing cadence | P12 |

Fixtures may use artificial values to isolate an invariant; those unit-test values are not competing encounter tuning. Put implemented defaults in local content/core owners and make the view consume them. Do not add a shared engine or cross-prototype dependency to implement this series.

## Execution and hand-back discipline

Before each plan, re-read the actual target branch and affected files. Confirm prerequisites have delivered their specified outputs; writing a predecessor plan is not completing it. Keep unrelated work intact. Record any divergence from the baseline and reconcile overlapping proposed paths with the real implementation.

For each executed plan, return the changed paths, exact commands and results, tested commit, fixture/configuration version, observable evidence for the numbered criteria, and remaining blockers. Only mark a check passed when it ran. Browser failures are not covered by unit-test success; human playtest results are not covered by either. Preserve negative findings and distinguish a partial hand-back from a verified capability.

## Deliberately beyond this dozen

Glare/Revelation reintroduction, persistent attrition, a fair Apex/Shadow comparison, campaign structure, additional content, final art, and production-engine selection are not authorized by these plans. They require later bounded work. The boss alone cannot establish that the new combat is better or that an audience prefers it.
