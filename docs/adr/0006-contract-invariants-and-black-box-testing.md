# ADR-0006 — Contract invariants and black-box testing

Status: accepted by user instruction, 2026-10-03.

## Decision

**Tests must assert required contract invariants. They must not freeze incidental outcomes or implementation choices that are allowed to evolve. The testing strategy prioritizes black-box testing.**

An invariant is a requirement that must remain true across the inputs, implementations, and variations permitted by the declared contract. A value is not an invariant merely because the current implementation produces it consistently. Current output, provisional tuning, internal structure, and fixture coincidences do not establish requirements.

Every assertion must protect an identifiable requirement. A change that preserves that requirement must not fail the test merely because it changes an incidental detail. A change that violates the requirement must fail. Stable assertions must remain strong enough to detect incorrect behavior; vague checks are not a substitute for testing the contract.

### Prioritize black-box testing

- Exercise observable inputs, outputs, errors, and state transitions through the relevant public boundary.
- Prefer contract and outcome assertions over private fields, helper calls, mock call sequences, or internal representations.
- Black-box tests can exercise a small public function or a whole application. Choose the smallest boundary that exposes the required behavior; this decision does not require every test to be an end-to-end test.
- Assertions about internal behavior require a stated invariant that cannot be adequately verified at an observable boundary. They must not freeze a preferred implementation.

### Test behavior that can evolve

- Assert required properties, relationships, validity rules, and documented bounds when multiple outcomes are legitimate.
- Assert exact values, ordering, formatting, or snapshots only when those details are required by the contract for the controlled inputs. Determinism alone does not make the current output contractual.
- Test configurable behavior with explicit representative inputs. Do not make provisional defaults permanent by copying them into expected results.
- For nondeterministic behavior, test guaranteed properties and use controlled inputs where appropriate. Require identical results only when reproducibility is part of the contract.
- Keep snapshots focused on contractual details. Review them as assertions, and never accept updated snapshots solely because the implementation changed.

| Contract | Appropriate assertion | Incidental detail to avoid freezing |
| --- | --- | --- |
| A collection contains the required members; order is unspecified | Compare membership and required multiplicity | The current iteration order |
| A command applies the configured damage amount | Supply a known amount and verify the required state transition | The current provisional default damage value |
| A generated result must satisfy documented validity constraints | Verify those constraints over representative inputs | One currently produced arrangement when alternatives are valid |

## Rationale

Tests protect agreed behavior while allowing legitimate evolution. Freezing incidental output makes refactoring, tuning, and valid alternative implementations appear to be regressions. Black-box assertions keep verification connected to observable requirements and provide confidence that behavior survives internal changes.

## Consequences

Test authors and reviewers must identify the requirement behind each assertion and distinguish genuine regressions from permitted variation. Rewrite assertions that only preserve obsolete or incidental details while retaining useful regression coverage. Do not weaken a real invariant to make failing tests pass.

Contracts can change through an explicitly authorized requirement or design change. Update the relevant specification and tests together when that happens. A failing test is evidence to investigate; neither the test nor the implementation automatically defines the intended contract.

Apply this decision when implementing the verification guidance in [ADR-0003](0003-implementation-plan-writing.md) and using the [ruach-testing skill](../../.agents/skills/ruach-testing/SKILL.md). This ADR establishes testing policy; it does not claim an existing test suite has been audited or executed.
