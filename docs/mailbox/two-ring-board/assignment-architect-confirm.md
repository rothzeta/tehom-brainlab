# Assignment TR-design-confirm — record user answers (Architect)

Role: `architect`. Continue in `/opt/dev/tehom-brainlab-tworing`, branch `two-ring-board`, after your commit `0d911ce`.

On 2026-10-04 the user answered your three open questions. They chose your default each time:

- **Q1 Compact placement:** A, sector-aligned: U `T[2o]` corner, G `T[2o+1]`, P `S[o]`. This replaces the earlier CT "mid-side" decision, which has no radius-2 equivalent.
- **Q2 Spread:** outer corners `T[2o]`, `T[2o+4]`, `T[2o+8]`, distance 4.
- **Q3 Enemy anchor:** view-only at the centre cell, drawn as a cluster, with no rule meaning. Encounter layout, including off-centre bosses, stays an open experiment question.

## Task

1. Update the brief's Decision record, the amended plans, the TR task plan and the plan index so these three read as **accepted user decisions (2026-10-04)**, no longer provisional. Record that Q1 supersedes the CT mid-side decision.
2. ADR-0004 still states "a centre hex plus three rings (37 cells)". You are authorised to amend `docs/adr/0004-repository-and-poc-direction.md` for this point only. Add a dated amendment note stating the two-ring (19-cell) arena decision with its source. Preserve the original text as history, following the local ADR conventions (`docs/adr/README.md`, ADR-0001).
3. Change no other content. Append a `## User confirmation` section to `docs/mailbox/two-ring-board/architect.md` and update its YAML block (open questions resolved, new `revision`, ADR path added to artifacts).
4. Commit only your files, together with this assignment unchanged. Leave any other untracked mailbox file alone. Run the handoff validator until it returns `ok: true`, then reply with the report-creating SHA. Make no source or test edits, and do not merge or push.
