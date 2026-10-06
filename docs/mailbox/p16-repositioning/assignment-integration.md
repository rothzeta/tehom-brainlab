# Assignment P16 integration with delivered P15 (Implementer)

Role: `implementer` (follow `.agents/agents/implementer.md`). You own P16 integration.
Coordinator: the Claude Coordinator session in the main checkout.

## Task

P15 was delivered to local `master` at `69c56adec70960511927ca308e0c824d4e17e33b`. Since your BASE `7537d0b`, it added the reviewed R1/R2 fixes (`4523be2`):

- the Crucible self-guard reduction is honoured in `src/core/transition.ts` and `src/core/run-record.ts`;
- the Crucible tests now use controlled, test-owned rules.

See `docs/mailbox/p15-crucible/fix.md` and `reviewer.md` on master.

In `/opt/dev/tehom-brainlab-p16`, on branch `p16-repositioning`, merge `master` (`69c56adec70960511927ca308e0c824d4e17e33b`) with a merge commit. Resolve conflicts so that both are preserved:

- P15's fixed behaviour, including the configured self-guard in dispatch and in records;
- P16's relocation behaviour.

Check the behavioural interaction, not only textual conflicts. Relocation must not bypass the encounter-configured mitigation, and records must replay with both.

## Restrictions

- **Test edits:** none to existing tests beyond mechanical conflict resolution that keeps both sides' assertions. If a semantic change is needed, stop and report it as blocked.
- **Assertions must not freeze provisional tuning.**
- **Do not edit** plans, `docs/CURRENT.md` or `docs/TASK_LOGS.md`. Do not push. Do not merge into master.
- Port 4173 may be used by other workers. Wait for it to be free; never stop another worker's process.

## Verification (on the merged commit)

Run every recipe from the repository root, bare: no `POC001_CHROME` or other hand-set env. Report every exit code.

- `just poc-001-test`
- `just poc-001-typecheck`
- `just poc-001-build`
- `just poc-001-test-browser`

Also run:

- the P16 repositioning harness and the Crucible harness `tests/browser-crucible.mjs`;
- replays of a relocating and a Crucible export.

## Expected output

1. Commit this assignment unchanged, together with `docs/mailbox/p16-repositioning/integration.md`.
2. The report starts with the `ruach-handoff` YAML block: source revisions, the combined and tested SHA, conflict resolutions and verification.
3. Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/p16-repositioning/integration.md --repo /opt/dev/tehom-brainlab-p16` until it reports `ok: true`.

Terminal handoff: the report SHA, the combined and tested SHA, check results, resolutions and blockers.
