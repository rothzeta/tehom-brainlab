---
name: simplification
description: Reduce unnecessary complexity while preserving required behavior.
---

# Simplification

Prefer the smallest design that clearly satisfies current requirements.

Look for:

- unnecessary abstractions;
- premature generalization;
- duplicate layers;
- dead or obsolete code;
- indirection without meaningful separation;
- configuration that exists only for hypothetical future needs.

Do not simplify by hiding complexity or weakening behavior.

After simplifying, run the relevant verification.
