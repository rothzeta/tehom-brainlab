# Assignment RF-design-confirm — record user answers (Architect)

Role: `architect`. Continue in `/opt/dev/tehom-brainlab-ring` on `ring-formation`, after your commit `bd320d3`.

On 2026-10-05 the user answered your open questions:

- **RF-Q1 reach:** the user did **not** accept the reach-2 default. They said: "its all dependent of the abilities which we'll focus on later." So add **no generic enemy targeting reach rule** in this round. Enemy targeting and marking keep their delivered behavior. Record in the brief and plans that reach will be **ability-specific**, designed later together with the abilities. Remove the reach rule from P05 and P08 Amendment RF, from the RF task's contracts, checkpoints, acceptance criteria and test-update list, and from the manual checklist. Make sure nothing else depended on it. In particular, check that the round-one marks remain equal to `patrol-v1` without reach, and recompute that if needed. If removing reach changes your placement argument (the "in-reach" statistics), restate the argument using the remaining measures: distance, adjacency and front membership. Recompute the numbers; do not assert them.
- **RF-Q2 second layout:** accepted, not now. Record the clustered "flank" layout as the next scenario.
- **RF-Q3 tuning:** accepted, no numeric change in this round.

## Task

Update the brief, the amended plans, the RF task plan and the index so that these read as **accepted user decisions dated 2026-10-05**. Apply the reach removal consistently. Change no other content.

Append a `## User confirmation` section to `docs/mailbox/ring-formation/architect.md`. Update its YAML block: resolve the open questions, set the new revision, and update `recommended_placement`/`placement_argument` if they changed.

Commit only your files, together with this assignment unchanged. Run the handoff validator until it reports `ok: true`. Reply with the report SHA and a one-paragraph summary of what changed, including any placement-argument changes. Do not edit source or tests, and do not merge or push.
