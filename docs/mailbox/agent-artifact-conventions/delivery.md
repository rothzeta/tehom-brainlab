task: CONV-merge
status: needs-decision
outcome: "Reviewed agent artifact conventions fast-forwarded to local master; the delivered content matches the reviewed revision apart from mailbox-only records, and routing tests pass. Ignored local working folders left in the main checkout's .agents/scratch/ are now untracked and need a decision."
role: implementer
source_baseline: ec32b59d2cd34c272bed3e1d3aed50a14ad25c45
destination_before: ec32b59d2cd34c272bed3e1d3aed50a14ad25c45
candidate_revision: ef06976c57a2510c0a098f287fb627309b816d7b
reviewed_revision: a9a52e6618f365304049983965547c21e9722a54
tested_revision: ab0e5bb88e3ced788301218a3bc2fdbdb339c592
delivered_revision: ab0e5bb88e3ced788301218a3bc2fdbdb339c592
destination: local master in /opt/dev/tehom-brainlab
merge_outcome: "fast-forward from ec32b59 to ab0e5bb; no conflicts; no push"
artifacts:
  - docs/mailbox/agent-artifact-conventions/delivery.md
  - docs/mailbox/agent-artifact-conventions/assignment-delivery.md
  - docs/mailbox/agent-artifact-conventions/reviewer.md
  - docs/mailbox/agent-artifact-conventions/implementer.md
  - master
  - agent-artifact-conventions
verification:
  - "Before merge: main checkout status clean; master and HEAD at ec32b59 (BASE); master is an ancestor of agent-artifact-conventions."
  - "git -C /opt/dev/tehom-brainlab merge --ff-only agent-artifact-conventions: fast-forward to ab0e5bb; master equals the branch tip."
  - "just test-agent-routing on delivered master: 13 tests OK."
  - "git diff --name-only a9a52e6 master: only assignment-delivery.md, assignment-reviewer.md and reviewer.md under docs/mailbox/agent-artifact-conventions/."
  - "git ls-files .agents/scratch on master: 0 tracked files; the README and the ignore rule are gone."
  - "FAILED condition: .agents/scratch/ is not absent in the main checkout; it still holds the pre-existing local folders p02/, routing-p02/ and worktree-cleanup-20261004/ (50 files, about 800K), now untracked."
  - "bun .agents/skills/ruach-handoff/scripts/validate.ts on this report with --repo .: exit 0."
review:
  - "Independent review (reviewer.md, commit 1de8404) at a9a52e6: all seven conditions pass; zero blocking and zero optional findings. Disposition: accepted by the Coordinator; nothing to fix."
discoveries:
  - "The main checkout's .agents/scratch/ held ignored local working files from earlier tasks, including cleanup evidence and tar.gz archives of earlier worktrees' scratch. Removing the ignore rule makes them appear as untracked '?? .agents/scratch/'. They were not inspected beyond listing and not moved or deleted."
blockers:
  - "Decision needed: what to do with the main checkout's untracked .agents/scratch/{p02,routing-p02,worktree-cleanup-20261004}/. Options include moving them outside the repository (for example, the OS temporary directory) or promoting anything worth keeping to docs/mailbox/, then removing the folder."

# Agent artifact conventions — delivery

Author: Implementer (task `CONV-merge`). Date: 2026-10-04. Assignment: [assignment-delivery.md](assignment-delivery.md), committed unchanged as `ab0e5bb` on `agent-artifact-conventions`.

## Revisions and merge

| Item | Revision |
| --- | --- |
| BASE / master before | `ec32b59` |
| Final convention candidate | `ef06976` |
| Reviewed and tested by Reviewer | `a9a52e6` |
| Review report commit | `1de8404` |
| Delivered master (branch tip) | `ab0e5bb` |

The delivery was a fast-forward of local master from `ec32b59` to `ab0e5bb`, with no conflicts, and nothing was pushed. Relative to the reviewed revision `a9a52e6`, the delivered master adds only three files under `docs/mailbox/agent-artifact-conventions/`: the reviewer's assignment and report, and this delivery assignment. All guidance, code, and test content is identical to the reviewed revision. This delivery report is committed afterwards on master and is a record only.

## Delivered-master checks

- `just test-agent-routing`: 13 tests OK.
- The scoped diff from `a9a52e6` to master contains only mailbox files, as listed above.
- `.agents/scratch/` has no tracked content left. However, the directory itself is **not absent** in the main checkout. Earlier tasks left ignored local files there (`p02/`, `routing-p02/`, and `worktree-cleanup-20261004/`, which includes tar.gz archives of earlier worktrees' scratch folders). Now that the ignore rule is gone, `git status` shows them as untracked. I left them untouched because they may hold evidence that earlier cleanup preserved. The Coordinator or user should decide whether to move them outside the repository or promote any of them into `docs/mailbox/`.

I did not edit `docs/CURRENT.md` or `docs/TASK_LOGS.md`. Worktree cleanup is a separate assignment.
