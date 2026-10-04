# Assignment B-fix-R1 — resolve blocking review finding R1 (role: implementer)

Continue as the P02 Implementer on branch `p02-formation-algebra` (head `fb0a352`). Independent review (`docs/mailbox/p02-formation-algebra/reviewer.md`, uncommitted, owned by the Reviewer — do NOT edit, stage, or commit it) reports one blocking finding:

R1 (blocking): `poc-001-linked-formation/tests/formation.test.ts` lines ~67–68 compare sets of `JSON.stringify(state)` for enumeration membership, freezing noncontractual Formation property insertion order (`{orientation, shape}` would falsely fail). Violates ADR-0006. Read R1 in the report for full evidence and suggested direction.

Tasks:
1. Bounded fix: make the enumeration membership assertion compare contractual content (e.g. shape/orientation values or canonical keys) independent of property insertion order, while keeping the exhaustive coverage and all other contracts intact. Do not change production geometry/API behavior unless strictly necessary (justify if so). The plan's byte-equivalent serialized *positions* requirement for inverse operations stays as is.
2. Check for any other assertion with the same incidental-ordering dependency and fix it in the same bounded way if found (report what you checked).
3. Commit the fix on `p02-formation-algebra`. Rerun on that committed revision: `just poc-001-test tests/formation.test.ts`, `just poc-001-typecheck`, full `just poc-001-test`, `just poc-001-build`, `git diff --check`. Optionally show the assertion now tolerates reordered properties (e.g. a scratch probe), without committing probes.
4. Update your own reports (`docs/mailbox/p02-formation-algebra/implementer.md`, `verification.md`) and TASK_LOGS factually with the R1 fix, new `candidate_revision`/`tested_revision` (existing SHAs), commands/results and updated assertion counts; commit as a documentation-only successor. Do not claim review acceptance or delivery.

End with a concise ruach-handoff summary including the new tested SHA and branch head.
