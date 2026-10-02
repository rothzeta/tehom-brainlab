# Shared code

Reserved for small utilities that at least two implemented prototypes genuinely need with the same behavior.

There is no shared runtime package yet. Do not place a universal combat engine, formation contract, or entity framework here preemptively. Prototype-local duplication is preferable to forcing different experiments to agree on unproven rules.

When extracting a utility, document its consumers and invariants, add tests, and keep the prototypes independently runnable.
