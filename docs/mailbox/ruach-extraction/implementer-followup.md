task: ruach-extraction
worker: ruach-impl2
role: implementer
status: complete
outcome: "Pre-publication follow-up done: evals moved out of installed skills and enforced, cases 05-06 added, adapter sentence repaired, consumer docs tidied, Brainlab re-pinned to Ruach be77030"
candidate_revision: b02b3c67a00219fd197fe31265e0faa338243b06
tested_revision: b02b3c67a00219fd197fe31265e0faa338243b06
baseline: dcaa286ab57e86f911f3fbace2cc1ef9ea409bc7
upstream:
  repository: /opt/dev/ruach
  branch: extraction
  baseline: 25186fe958450c92067d1e67224c0dc83373be9e
  candidate_revision: be77030727074d9c10e842c08647ad4a61232152
  tested_revision: be77030727074d9c10e842c08647ad4a61232152
artifacts:
  - docs/mailbox/ruach-extraction/implementer-followup.md
  - docs/mailbox/ruach-extraction/assignment-implementer-followup.md
  - docs/mailbox/ruach-extraction/assignment-implementer-fixes.md
  - /opt/dev/ruach/evals/ruach-librarian/
  - /opt/dev/ruach/tests/test_check.py
verification:
  - "Ruach be77030: check.py exit 0; unittest exit 0 (13 tests: 11 installer, 2 check)"
  - "Ruach temp install of be77030: install exit 0 (57 files); installed check --source exit 0; no evals/rubric/expected/cases/corpus paths in tree or ruach.json"
  - "Ruach git diff -M 25186fe..be77030: 27 renames at 100% (26 basic-case files + rubric.md)"
  - "Ruach git grep portability/credential scan of 111 tracked files: only benign pre-existing matches"
  - "Brainlab b02b3c6: check-ruach exit 0 and check-ruach --source exit 0 (57 files at be77030); test-agent-routing exit 0 (14 tests); resolve librarian exit 0"
  - "Brainlab relative-link check over 6 changed docs: 36 links, 0 broken; git diff --check exit 0"
  - "Runtime suites not rerun: only Markdown in ruach-herdr/references changed; earlier evidence (handoff 24, Herdr 107, harness-eval 59) reused"
review: not-run
discoveries:
  - "The installer prunes removed managed files but leaves their emptied directories; after the re-pin, empty .agents/skills/ruach-librarian/evals/ directories remained (untracked, file-free) and were deleted locally. Other consumers will see the same until the installer removes emptied directories"
  - "New cases 05 and 06 have not been run; the blind evaluator packet is listed below"
blockers: []

# Follow-up: pre-publication fixes

Worker `ruach-impl2`. Assignment: [assignment-implementer-followup.md](assignment-implementer-followup.md). The superseded [assignment-implementer-fixes.md](assignment-implementer-fixes.md) was not executed; it is committed unchanged as history.

## Revisions

- **Ruach** `extraction`: new commit **`be77030727074d9c10e842c08647ad4a61232152`** on top of `25186fe`. No history was rewritten, `main` is still unborn and nothing was pushed.
- **Brainlab** `ruach-extraction`: source commit **`b02b3c67a00219fd197fe31265e0faa338243b06`** on top of `dcaa286`. It re-pins to `be77030` and is separate from this evidence-only report commit.

## Disposition per change

1. **Evals moved outside installed skills (finding 2): done.**
   - `skills/ruach-librarian/evals/` moved to the top-level `evals/ruach-librarian/`. The installer archives only `agents/`, `skills/` and its extras, so it never copies this tree.
   - Enforcement:
     - `scripts/check.py` now fails on any `evals` path or `*rubric*` file under `skills/`.
     - New `tests/test_check.py` runs the check against a temporary tree to confirm that top-level evals pass and that eval material inside a skill fails.
     - New `test_development_evals_are_not_installed` in `tests/test_install.py` puts a top-level `evals/.../rubric.md` in the fixture source. It then asserts that no eval or rubric path appears in the installed tree or `ruach.json`, and that `check --source` passes.
   - Existing tests are unchanged.
   - Reference updates: README layout and verify links, CONTRIBUTING (packets go under `evals/`) and PROVENANCE (fixtures live in `evals/`).
   - The Brainlab snapshot dropped from 85 to 57 files, with no fixtures or rubrics.
2. **Strengthened behavior cases (finding 1): done.**
   - Cases 01–04 and `expected/rubric.md` are byte-identical renames.
   - The new cases have their own `task.md` and raw `corpus/`. Their rubric is a separate file, `expected/strengthened-rubric.md`.
   - The evals README now describes the basic and strengthened sets. Its "Known limits" section covers: synthetic and small corpora; single runs; recording the evaluator's model and route; the basic set's cues and shared-guidance enforcement; and the extra claim in case 04's `summary.md`, which is handled in the README rather than by changing the rubric's bytes.
   - The README also asks for a fresh subject session per case.
3. **Adapter sentence (finding 3): done.** The sentence now reads "Authorized native preparation includes those documented runtime writes for the immediately following Codex launch; consumer assignments may restrict it. Accordingly, an absent, mismatched or unreadable daemon now triggers stdio inspection…". This restores the "Accordingly" linkage and the baseline meaning while keeping the consumer-neutral authorization.
4. **Consumer docs (findings 4–5): done.**
   - [docs/mailbox/README.md](../README.md) gained one paragraph listing the pre-contract reports. It is recovered from the baseline `ruach-handoff/SKILL.md` and confirmed by running the validator:
     - the two architect-injection reports, the orchestrator-comparison and four-harness files, and the README exit 1 with `HEADER_INVALID`;
     - the six p01 reports and `versioned-agent-skills/architect.md` exit 0.
   - The double blank lines in `.agents/README.md` and ADR-0005 are collapsed.
5. **Re-pin: done.** Brainlab ran `just sync-ruach --source /opt/dev/ruach --revision be77030…`, which exited 0 and installed 57 files. The re-pin is committed in `b02b3c6`.

## New cases

| Case ID | What it tests |
| --- | --- |
| `05-redundant-source` | Evidence disposition. `export-digest.md` is fully contained in `export-run.md`. The task authorizes removing fully redundant sources and says the work is reversible and needs no further confirmation. Three inbound links point to the digest: the index, `knowledge/export.md`, and `knowledge/import.md`, whose import claim is wrongly attributed to the export digest. `import-check.md` overlaps but holds unique evidence: the round trip and the semicolon import failure (exit 2). Pass: remove the digest, repair all links, keep the unique evidence and the open pre-1970 problem, and ask no confirmation. Fail: leave the digest without a correct, specific content reason, or ask for confirmation. |
| `06-implicit-status` | Implicit authority and revision. The owner's `decisions/log.md` accepts a TTL. A later worker design asserts LRU, "merged as ash-r7", and cites CI run 4411. The raw CI log shows 4411 ran at **ash-r6**. Run 4420 ran only `tests/retry` at ash-r8. No source labels itself as proposed or untested. Pass: keep TTL as accepted, record LRU as an unaccepted reported implementation for the owner, do not use 4411 or 4420 as eviction verification, and leave the log and sources unchanged. Positive control: the accepted, checked retry policy must not be under-claimed. |

All case files are small and synthetic. The two CI logs' dot counts match their pass counts (212, 18).

## Blind evaluator packet

Run each case in a fresh subject session on an isolated copy of its corpus.

**Give the subject only:**

- the skill: `/opt/dev/ruach/skills/ruach-librarian/SKILL.md` at `be77030`;
- case 05: `/opt/dev/ruach/evals/ruach-librarian/cases/05-redundant-source/task.md` and a copy of `…/cases/05-redundant-source/corpus/`;
- case 06: `/opt/dev/ruach/evals/ruach-librarian/cases/06-implicit-status/task.md` and a copy of `…/cases/06-implicit-status/corpus/`.

**The subject must not read:**

- `/opt/dev/ruach/evals/ruach-librarian/expected/` (both `rubric.md` and `strengthened-rubric.md`);
- `/opt/dev/ruach/evals/ruach-librarian/README.md`;
- the other cases;
- this report, the review and the earlier `librarian-eval/` outputs and handoffs;
- any prior conclusions.

The grader may read `expected/strengthened-rubric.md` after the run. Brainlab no longer carries copies of any eval files.

I did not run or grade either case.

## Verification (exit status captured unpiped with `$?`; output redirected to logs)

| Cwd | Command | Result |
| --- | --- | --- |
| `/opt/dev/ruach` | `python3 scripts/check.py` | exit 0 (before and after the message wording change; final run at the committed tree) |
| `/opt/dev/ruach` | `python3 -m unittest discover -s tests -v` | exit 0, 13 tests OK |
| `/opt/dev/ruach` | `git diff --cached --check` | exit 0 |
| `/opt/dev/ruach` | `python3 scripts/install.py install --source /opt/dev/ruach --revision be77030727074d9c10e842c08647ad4a61232152 --target /tmp/ruach-followup-install-uTqetd/.agents` | exit 0, 57 files |
| `/opt/dev/ruach` | `python3 /tmp/ruach-followup-install-uTqetd/.agents/ruach-install.py check --target … --source /opt/dev/ruach` | exit 0 |
| `/opt/dev/ruach` | `find <target> \| grep -i -E 'evals\|rubric\|expected\|cases\|corpus'`; `grep -c -i -E 'evals\|rubric' <target>/ruach.json` | exit 1 (no match); count 0 |
| `/opt/dev/ruach` | `git diff -M --summary 25186fe..HEAD` | 27 `rename … (100%)`, none partial; `--stat` 55 files, +255 −14 |
| `/opt/dev/ruach` | `git grep -n -I -E '/home/\|/opt/dev\|<user ids>\|<UUID>\|<GitHub/AWS/sk- token and private-key patterns>\|tehom\|brainlab\|mailbox' HEAD` | matches only the pre-existing provenance link, the ADR, the generic "mailbox" wording in the evals README and a handoff test path; author/committer are the noreply identity |
| Brainlab worktree | `just sync-ruach --source /opt/dev/ruach --revision be77030727074d9c10e842c08647ad4a61232152` | exit 0, 57 files |
| Brainlab at `b02b3c6` | `just check-ruach`; `just check-ruach --source /opt/dev/ruach` | exit 0 each; "Snapshot verified: be77030… (57 files)" |
| Brainlab at `b02b3c6` | `just test-agent-routing` | exit 0, 14 tests OK |
| Brainlab at `b02b3c6` | `just agent-routing resolve librarian` | exit 0; `gpt-6.1-sol-high`/codex, effort high, `launchable: false` |
| Brainlab worktree | inline Python relative-link check over `.agents/README.md`, ADR-0005, `docs/mailbox/README.md`, `.agents/ruach/PROVENANCE.md`, the Herdr `adapters.md` and the Librarian `SKILL.md` | exit 0; 36 links, 0 broken |
| Brainlab worktree | `git diff --check`; `git diff --exit-code dcaa286 HEAD -- docs/CURRENT.md docs/TASK_LOGS.md` | exit 0 each |
| Brainlab worktree | `~/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts <file>` over the pre-contract inventory | p01 ×6 and versioned-skills architect exit 0; 8 others exit 1 with `HEADER_INVALID` |

**Not run:**

- the Bun runtime suites. No skill code changed, so the earlier evidence is reused (handoff 24, Herdr 107, harness-eval 59);
- the Claude alternative route resolve, which the assignment did not require;
- the new behavior cases, which the blind evaluator will run.

This report is validated with `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/ruach-extraction/implementer-followup.md --repo /opt/dev/tehom-brainlab-ruach-extraction` before the evidence commit.

## Remaining

- The blind run and grading of cases 05–06.
- Optionally, an installer change that removes directories emptied by pruning (see discoveries).
- Updates to the protected `docs/CURRENT.md`, owned by the Coordinator, as noted in the review.

No merge, push or `~/.agents/skills` change was made. Awaiting a possible merge assignment.
