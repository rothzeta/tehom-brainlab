---
name: ruach-handoff
description: Produce or consume the canonical structured handoff between engineering workers and coordinators. Use when returning delegated work or receiving a worker's result.
---

# Ruach handoff

Use this protocol when returning delegated work. Put the named fields at the start of the durable report; reference detailed evidence below or in separate artifacts. Return a concise handoff including the report reference.

## Required fields

- `task`: task identifier
- `status`: `complete`, `blocked`, `needs-decision`, or `failed`
- `outcome`: concise result
- `artifacts`: relevant files, reports, branches, commits, or other durable references, including the handoff report
- `verification`: checks actually performed and their results, or `not-run`
- `discoveries`: information affecting other work
- `blockers`: unresolved blockers or decisions required

Use an empty list for fields with no entries. Include the additional evidence required by the role and assignment.

Where relevant also report:

- `candidate_revision`
- `tested_revision`
- `reviewed_revision`
- `delivered_revision`

Only report revisions that already exist and can be resolved. The responsible worker confirms revision references; distinguish the revision checked from later commits that only record evidence.

## Rules

- Keep the handoff concise.
- Reference detailed evidence rather than reproducing it.
- Do not report verification that was not actually performed.
- Do not infer review or acceptance from implementation completion.
- Do not prefill successful outcomes for another worker.
- Do not require an artifact to contain the identifier of the commit that creates that artifact.
- Write the durable handoff before reporting `complete`.

## Consumption

When receiving a handoff:

- use it for coordination rather than reconstructing state from the worker transcript;
- request correction from the responsible worker if required fields are missing or inconsistent;
- do not independently perform the worker's technical validation merely to repair an incomplete handoff.
