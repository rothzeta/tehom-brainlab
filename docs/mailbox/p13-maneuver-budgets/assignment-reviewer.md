# Assignment P13+P14 review (Reviewer)

Role: `reviewer` (follow `.agents/agents/reviewer.md`).
Coordinator: the Claude Coordinator session in the main checkout.

## Change under review

Review P13 (independent maneuver budgets) and P14 (tactical kit revision) together, as integrated.

- **Combined, tested revision:** `7904f9f0e13572e103cb5eb0b363e5c9fc54902f`. Its report commit is `6ebe1703c94c2bdb404fd3bcdcfa212336a18b7c`, which is your worktree HEAD.
- **Diff range:** `c596d692d6da0779213d10ff9acba7564ccad902..7904f9f0e13572e103cb5eb0b363e5c9fc54902f`. It also contains docs-only plan updates from `5c3e614` (the Crucible facing lever). Those are Architect plan text and out of scope for code review.
- **Contracts:**
  - P13 `docs/plans/2026-10-06-e8cec63d-poc-001-split-maneuver-budgets.md`;
  - P14 `docs/plans/2026-10-06-6a0ebcdc-poc-001-tactical-kit-revision.md`.
- **Handoffs:**
  - `docs/mailbox/p13-maneuver-budgets/{implementer,integration}.md`;
  - `docs/mailbox/p14-kit-revision/implementer.md`.

## User decisions (2026-10-06, accepted; values are provisional defaults)

- One rotation plus one shape change (Expand or Contract) per player phase, both refreshing every round. Expand and Contract share the shape-change allowance.
- Shelter reduces a hit by 4, may target self or a Close ally, and is a one-hit effect.
- Impale keeps 6 damage, loses its protection bypass, and needs at least one living Stretched partner.
- Claw, Sting and Gale are unchanged, as is Crosswind's behaviour.
- Old attempt records are rejected with an explicit "unsupported rules version" error, not migrated. `RECORD_VERSION` stays 1.

## Review focus

1. Every acceptance criterion in both plans is met with observable evidence.
2. **Test exceptions.** Existing-test edits stay within the enumerated exceptions:
   - P13's list plus RR1, which the Coordinator authorised. `tests/run-record.test.ts` encoded the old shared budget and now asserts the split contract.
   - P14's K1–K4.
   - Additions are fine.
3. **No frozen tuning.** Assertions must not freeze provisional values: allowance counts, cadence, damage, Shelter amount, HP. Probe this by changing a default in a scratch copy, such as `shelterReduction`, Impale damage, or a budget-related default if one exists, and checking which tests break for the wrong reason. Earlier reviews blocked on exactly this.
4. **Interleaving.** Rotation, shape change and abilities in one phase must keep previews equal to committed results (the P09 invariant). Records must replay, and Shelter and Impale eligibility must follow the link state at both cast and impact.
5. **Record versioning.** Old records are rejected clearly, and new records carry the composed v3/patrol-v2/p14-v1 version.
6. **User-facing UI.** The allowances are visible and understandable, and the second use of a category is rejected with a clear message.

## Verification (you must run these yourself on `7904f9f`, or on your HEAD, which differs only by docs)

Run every recipe from the repository root, bare: no `POC001_CHROME` or other hand-set env, and no manual build first. Run `just poc-001-install` first if dependencies are missing.

- `just poc-001-test`
- `just poc-001-typecheck`
- `just poc-001-build`
- `just poc-001-test-browser`

Also run P14's `tests/browser-p14-kit.mjs` (see that handoff for the invocation) and one replay of an exported record.

## Restrictions

- Review only; do not fix source or tests. Probes go in a scratch copy or a reverted working tree. The worktree must be clean except for your report.
- Do not edit plans, `docs/CURRENT.md` or `docs/TASK_LOGS.md`. Do not merge or push.
- Worktree `/opt/dev/tehom-brainlab-p13r`, branch `p13p14-review`.

## Expected output

1. Commit this assignment unchanged, together with `docs/mailbox/p13-maneuver-budgets/reviewer.md`.
2. The report starts with the `ruach-handoff` YAML block: the reviewed revision, blocking findings (each with file:line, a failure scenario and the required fix), optional findings, and verification with exact commands and results.
3. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p13-maneuver-budgets/reviewer.md --repo /opt/dev/tehom-brainlab-p13r` until it reports `ok: true`.

Terminal handoff: the report SHA, the verdict, blocking and optional findings, and check results.
