# POC 001 — bounded implementation plan index

Twelve plans for the linked-formation prototype (P01 implemented, independently verified/reviewed and accepted; P02 implemented, independently verified/reviewed at `803da5df5f34b387be3bb5ccce3cd7cbd733f90b` after R1 resolution, accepted by the Coordinator, and locally delivered at `7e964c30a29abd1fb10613713bc205ef037b1f80`; P03 independently reviewed (no blocking findings), accepted, locally delivered; P04 implemented, independently reviewed (no blocking findings; optional O1 open), accepted, locally delivered; P05 implemented, independently reviewed (no findings), accepted, locally delivered; P06 implemented, independently reviewed (blocking R1 fixed and re-reviewed; no remaining findings), accepted, locally delivered; P07–P12 draft), written on 2 October 2026 against repository baseline `79f9498051df0281e6e9d3c904e9eee32f014873`.

**This is a navigation and authority note, not a thirteenth implementation plan.** Adding these documents does not implement the prototype, approve new game rules, or constitute a playtest. No package installation, application build, unit test suite, or browser combat test was run as part of drafting.

## Authority and source limits

Plans and standalone tasks follow the local [ADR-0002 filename rule](../adr/0002-plan-filenames.md) and [ADR-0003 bounded writing format](../adr/0003-implementation-plan-writing.md). Read [CURRENT](../CURRENT.md) and actual source before execution; the Coordinator records executed evidence in [TASK_LOGS](../TASK_LOGS.md) from worker handoffs.

The drafts originally used user-supplied excerpts labelled ADR-0007 and ADR-0008 because the referenced local files were absent at their baseline. On 3 October, the user's vault instruction established local ADRs adapted from `../enoch`. These local records now replace the unavailable references. Existing filenames already comply, so their 2 October creation dates and eight-character random hexadecimal identifiers are retained. Delivery order is expressed by P01–P12 and dependency links, not filename sorting.

At drafting, each plan was a proposed standalone task with an unassigned implementer/integration-owner role and stable sequential checkpoint identifiers. The acceptance criteria and verification sections define its task contract. The index describes a proposed delivery sequence; writing a plan does not complete its prerequisites or approve its provisional game rules.

Grounding sources:

- [Repository working guidance](../../AGENTS.md).
- [POC 001 design brief](../../docs/prototypes/poc-001-linked-formation.md).
- [Direction ADR](../adr/0004-repository-and-poc-direction.md).
- [Prototype architecture and starting status](../../poc-001-linked-formation/README.md).
- [Actual shared asset manifest](../../assets/manifest.json) and [credits](../../assets/CREDITS.md).
- [Existing playtest report structure](../../docs/playtests/TEMPLATE.md).

The original fixed Apex/Shadow direction is not silently promoted back into this prototype. Conversely, these plans do not promote the new formation experiment to the production combat system.

## Reading the contracts

**Settled choices** are constraints already stated in the inspected sources or the user's instruction: the accepted POC scope, no walking/translation, shared maneuvers, engine-independent rules, existing assets, and the requested document format.

**Required contracts** describe what must be observably true to accept the bounded implementation. Some are engineering invariants proposed by the plan; those are identified locally. The draft contracts alone are not claims that an implementation satisfies them; P01–P03 now link their executed evidence and distinguish review/delivery status.

**Proposed implementation / experimental defaults** fill explicitly open implementation details such as coordinate presets, mask boundaries, damage values, targeting ties, and defeat behavior. They are recommendations for executable fixtures, not historical decisions or balanced gameplay. Resolve/amend them explicitly at implementation start; a change affecting another plan requires reconciling that dependent plan's fixtures and tests, not creating a second hidden constant.

Source/test file paths listed as proposed ownership describe planned paths at drafting; P01–P03 now have implementations. At the original planning baseline the prototype had folders and a README, not a working TypeScript application. Commands in verification sections become executable only after the prerequisite plan supplies their scripts.

The user's 3 October tooling preference supersedes the original npm proposal: use Bun with a prototype-local `bun.lock`, prefer Docker where useful, and orchestrate commands through the root justfile. Run `just poc-001-*` recipes from the repository root; P01 now supplies the install/dev/typecheck/test/build/preview recipes, with test-browser and replay supplied by their later owning plans. Keep implementations in the prototype's `scripts/` and executable entry points in its `bin/`. The current root justfile also retains repository tooling checks and the existing asset exporter.

## Execution map

| ID | Plan | Bounded outcome | Direct prerequisites |
|---|---|---|---|
| P01 | [Browser harness](2026-10-02-a87b131a-poc-001-browser-harness.md) | Independently install, run, test, and build one browser shell. Implemented, independently verified/reviewed and accepted. | None |
| P02 | [Formation algebra](2026-10-02-2e228a2b-poc-001-formation-algebra.md) | Preserve twelve labelled, reversible formations on 37 cells. Implemented, independently verified/reviewed after R1 fix, accepted, and locally delivered. | P01 |
| P03 | [Command boundary](2026-10-02-2dfffcd3-poc-001-command-boundary.md) | Reject illegal/stale commands without spending resources or mutating state. Independently reviewed (no blocking findings), accepted, locally delivered. [Review](../mailbox/p03-command-boundary/reviewer.md); O1–O3 open optional follow-ups. [Evidence](../mailbox/p03-command-boundary/implementer.md). | P01, P02 |
| P04 | [Formation lab](2026-10-02-9d81c6df-poc-001-formation-lab.md) | Inspect, preview, commit, and reset formation-only interaction. Implemented, independently reviewed (no blocking findings; optional O1 open), accepted, locally delivered. [Evidence](../mailbox/p04-formation-lab/implementer.md); [integration](../mailbox/p04-formation-lab/integration.md); [review](../mailbox/p04-formation-lab/reviewer.md). | P01, P02, P03 |
| P05 | [Intent semantics](2026-10-02-d66a7452-poc-001-intent-semantics.md) | Keep fixed areas, following marks, and explicit facing changes distinct. Implemented, independently reviewed (no findings), accepted, locally delivered. [Evidence](../mailbox/p05-intent-semantics/implementer.md); [review](../mailbox/p05-intent-semantics/reviewer.md). | P02, P03 |
| P06 | [Damage and Fallen](2026-10-02-4c3c0d42-poc-001-damage-and-fallen.md) | Settle a hit and its lifecycle consequences deterministically. Implemented, independently reviewed (blocking R1 fixed and re-reviewed; no remaining findings), accepted, locally delivered. [Implementation](../mailbox/p06-damage-and-fallen/implementer.md); [integration](../mailbox/p06-damage-and-fallen/integration.md); [R1 fix](../mailbox/p06-damage-and-fallen/fix-r1.md); [review](../mailbox/p06-damage-and-fallen/reviewer.md). | P03, P05 |
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

For each executed plan, the Coordinator records a dated [task log entry](../TASK_LOGS.md) from worker handoffs, links it from the plan, and updates [CURRENT](../CURRENT.md) when facts change. Workers return the changed paths, exact commands and results, tested commit, fixture/configuration version, observable evidence for the numbered criteria, and remaining blockers. Only mark a check passed when it ran. Browser failures are not covered by unit-test success; human playtest results are not covered by either. Preserve negative findings and distinguish a partial hand-back from a verified capability.

## Deliberately beyond this dozen

Glare/Revelation reintroduction, persistent attrition, a fair Apex/Shadow comparison, campaign structure, additional content, final art, and production-engine selection are not authorized by these plans. They require later bounded work. The boss alone cannot establish that the new combat is better or that an audience prefers it.
