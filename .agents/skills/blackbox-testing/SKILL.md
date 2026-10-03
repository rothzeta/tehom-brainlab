---
name: blackbox-testing
description: Design and review tests around observable behavior rather than implementation details.
---

# Black-box testing

Prefer tests that exercise externally observable behavior.

## Principles

- Test contracts and outcomes rather than internal call structure.
- Avoid assertions that fail merely because a valid implementation changes internally.
- Do not require identical output from fundamentally nondeterministic behavior unless determinism is part of the contract.
- Use deterministic inputs and boundaries where exact assertions are required.
- Prefer representative datasets over one happy-path case.
- Preserve useful regression coverage while removing tests that only freeze obsolete implementation details.
