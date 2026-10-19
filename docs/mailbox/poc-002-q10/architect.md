task: P2-Q10
role: architect
status: complete
outcome: "Q10 delivered: docs/playtests/poc-002-human-test-protocol.md is an unexecuted human-test protocol template, with a session report section based on TEMPLATE.md and every observation tagged to the brief's H1-H6 and Q1-Q5."
source_baseline: 15c922d
candidate_revision: 051d0bc
artifacts:
  - docs/playtests/poc-002-human-test-protocol.md
  - docs/mailbox/poc-002-q10/assignment-architect.md
  - docs/mailbox/poc-002-q10/architect.md
verification:
  - "Link check (scratch checker, relative .md links and anchors) on docs/playtests/poc-002-human-test-protocol.md: 0 missing."
  - "git diff --cached --check for commit 051d0bc: clean."
  - "Handoff validator from a temporary-directory copy: result in the Validation section."
review: not-run
discoveries:
  - "Plan gap: Q08 does not say whether an unfinished attempt can be exported before Reset. The protocol needs this for H5 (restart after a death); it asks the facilitator to export first, or note the record as missing."
  - "Plan gap: the brief's human falsifiers are qualitative. The protocol reports counts and sets no threshold, leaving the falsification call to the Coordinator and user."
blockers: []

# Q10 human-test protocol: Architect report (P2-Q10)

Author: Architect (Claude Opus 5.5). Assignment: [assignment-architect.md](assignment-architect.md), committed unchanged with this report.

## Result

[`docs/playtests/poc-002-human-test-protocol.md`](../../playtests/poc-002-human-test-protocol.md) is labelled **template only, not executed**, and states that no POC 002 human test has occurred. Against the plan's Q10 list:

| Q10 requirement | Where |
| --- | --- |
| Setup: four to six external testers, build commit and conditions | "Before the session": build and conditions (clean build at one SHA, no overrides, rules and content versions), testers |
| Session order: solo Guard per Brood → trio gauntlet → duo gauntlet of choice | "Session order" table, plus a solo-order rotation and an optional retry |
| Prediction prompts before commits | "Prediction prompts": five fixed moments, prediction recorded before resolution, actual result recorded beside it |
| Brief acceptance questions and human falsifiers | "What the session tests" maps H1–H6 and Q1–Q5 to what to observe and to each falsifier quoted from the brief; the debrief questions are tagged too |
| Record export per attempt | "Record export": every attempt, naming scheme, storage with the task's mailbox, replay with the proposed `just poc-002-replay`, untrusted if replay fails |
| Observation table separating observation from interpretation, after TEMPLATE.md | "Session report" keeps TEMPLATE.md's sections (Build and conditions, Hypothesis, Observations, Player explanation, Readability and defects, Outcome, Replay question), with observation and interpretation in separate columns |
| Consent and anonymity | "Consent and anonymity": consent recorded only as yes or no, pseudonyms T1–T6, no identifying data, verbatim quotes only, right to stop and to deletion, recordings kept outside the repository |

Every `just poc-002-*` command is labelled proposed, with the checkpoint that provides it. The protocol adds no rule or tuning: it links the brief as the only rules source, and reports counts rather than declaring hypotheses falsified. Q10's acceptance does not require a `docs/playtests/README.md` entry, so none was added. No other path was touched: there is no application code, the brief, plan, ADR, CURRENT and TASK_LOGS are unchanged, and POC 001 is untouched.

## Gaps for the Coordinator (not fixed here)

1. **Exporting an unfinished attempt.** Plan Q08's acceptance 3–4 covers export and Reset, but does not say whether an attempt can be exported before Reset. H5's falsifier (restarting after a death) is best evidenced by that partial record. Suggest adding "Export is available before Reset, for an unfinished run" to Q08.
2. **Falsifier thresholds.** The brief's human falsifiers have no count threshold (for example "2 of 5 testers"). The protocol deliberately reports counts only. If a threshold is wanted, it belongs in a brief amendment.

## Validation

I used the temporary skill copy `/tmp/tmp.N1N53J4dvW/ruach-handoff`, installed earlier with `bun install --frozen-lockfile`, exit 0, with nothing installed in the repository. From the worktree root, `bun /tmp/tmp.N1N53J4dvW/ruach-handoff/scripts/validate.ts docs/mailbox/poc-002-q10/architect.md --repo .` exited 0 with `schema_version: 1`, `ok: true` and `diagnostics: []`. It resolved `/source_baseline` to `15c922d073eb8620962245178c5a2477a8dfbe88` and `/candidate_revision` to `051d0bc5b789e74ad993bda1b5dea582ea4721e8`. The run was repeated after this paragraph was added.
