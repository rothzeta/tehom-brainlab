# Assignment P15 review (Reviewer)

Role: `reviewer` (follow `.agents/agents/reviewer.md`).
Coordinator: the Claude Coordinator session in the main checkout.

## Change under review

P15, the two-phase central boss ("Crucible").

- **Candidate and tested revision:** `e685c3cf24f1b997fcc2cd71cad76bdada4f95f0`. Your worktree HEAD `7537d0bddc5d5409b116a3ad4919bf02cb1e7a36` adds only the report.
- **Diff range:** `6ebe1703c94c2bdb404fd3bcdcfa212336a18b7c..e685c3cf24f1b997fcc2cd71cad76bdada4f95f0`. The base is the delivered P13+P14 line, already reviewed.
- **Contract:** `docs/plans/2026-10-06-6dcd120b-poc-001-two-phase-central-boss.md`.
- **Context:** the Architect report `docs/mailbox/boss-experiments/architect.md`, including "Follow-up: Q1 lever".
- **Handoff:** `docs/mailbox/p15-crucible/implementer.md`. It covers a blocked episode and the authorised one-line fix that restored the patrol `Threats:` preview format.

## User decisions (2026-10-06, accepted; numbers are provisional defaults)

- The Crucible is anchored at the centre, with two phases. Phase two starts at the next declaration after the threshold is crossed and never replaces attacks already shown.
- **Facing lever:** the facing advances one clockwise step from the current facing (including after a Crosswind turn) only before sector (beat-B) declarations. Ring-pulse declarations leave it unchanged.
- The encounter is selected with `?play=crucible`. The patrol stays at `?play=patrol`.
- Old records are rejected; `RECORD_VERSION` stays 1.

## Review focus

1. Every acceptance criterion is met with observable evidence. **Criterion 8:** the cadence is tested as a rule from controlled starting facings, not as copied facing values.
2. **No existing test edited.** P15 has no test-edit exception. Check against base.
3. **No frozen tuning.** Probe by changing provisional defaults in a scratch copy: boss HP, threshold, damage, a pattern entry. Check which tests break for the wrong reason.
4. **Preview equivalence (P09).** Previews equal committed results, including around the phase transition and after Crosswind on the boss. Records replay.
5. **The patrol is unchanged.** Its behaviour, text and record version must not regress under the shared end-phase skeleton.
6. **User-facing:** the phase indicator, the telegraphs and whether the turnable label is readable; encounter links and presets; unknown `?play=` values open the lab.

## Verification (run yourself, bare)

Run every recipe from the repository root: no `POC001_CHROME` or other hand-set env, and no manual build first. Run `just poc-001-install` first if dependencies are missing.

- `just poc-001-test`
- `just poc-001-typecheck`
- `just poc-001-build`
- `just poc-001-test-browser`

P14 and P15 each saw one non-PTY run exit 130 during preview shutdown after all suites passed. Report the exit code of every run you make. This is a known, tracked issue to be handled separately; it is not a P15 finding unless P15 caused it.

Also run the Crucible browser harness `tests/browser-crucible.mjs` (see the handoff for the invocation) and replay an exported Crucible attempt.

## Restrictions

- Review only; do not fix. Probes go in scratch copies. The worktree must be clean except for your report.
- Do not edit plans, `docs/CURRENT.md` or `docs/TASK_LOGS.md`. Do not merge or push.
- Worktree `/opt/dev/tehom-brainlab-p15r`, branch `p15-review`.

## Expected output

1. Commit this assignment unchanged, together with `docs/mailbox/p15-crucible/reviewer.md`.
2. The report starts with the `ruach-handoff` YAML block: the reviewed revision, blocking findings (each with file:line, a failure scenario and the required fix), optional findings, and verification with exact commands and results.
3. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p15-crucible/reviewer.md --repo /opt/dev/tehom-brainlab-p15r` until it reports `ok: true`.

Terminal handoff: the report SHA, the verdict, the findings and check results.
