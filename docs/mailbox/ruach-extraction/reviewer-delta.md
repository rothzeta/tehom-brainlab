task: ruach-extraction
worker: ruach-review
role: reviewer
status: complete
outcome: "Accept: the Ruach 25186fe..be77030 and Brainlab dcaa286..b02b3c6 deltas meet delta acceptance 1-6 with no blocking findings; strengthened cases 05 and 06 both pass"
reviewed_revision: b02b3c67a00219fd197fe31265e0faa338243b06
tested_revision: b02b3c67a00219fd197fe31265e0faa338243b06
baseline: dcaa286ab57e86f911f3fbace2cc1ef9ea409bc7
evidence_revision: 7add98c
upstream:
  repository: /opt/dev/ruach
  branch: extraction
  baseline: 25186fe958450c92067d1e67224c0dc83373be9e
  reviewed_revision: be77030727074d9c10e842c08647ad4a61232152
  tested_revision: be77030727074d9c10e842c08647ad4a61232152
artifacts:
  - docs/mailbox/ruach-extraction/reviewer-delta.md
  - docs/mailbox/ruach-extraction/assignment-reviewer-delta.md
verification:
  - "Ruach fresh clone at be77030: check.py exit 0; unittest exit 0 (13 tests OK); temp install exit 0 (57 files); installed check exit 0 with and without --source; no eval/rubric paths in install or manifest"
  - "Ruach delta: 27 renames at 100%; only Markdown changed under runtime skills; publication scan of 111 files clean"
  - "Brainlab fresh clone at b02b3c6: check-ruach exit 0 with and without --source (57 files at be77030); after frozen Herdr install, test-agent-routing exit 0 (14 OK) and resolve librarian exit 0 on GPT and Claude"
  - "Brainlab fresh clone without Herdr dependencies: test-agent-routing exit 1 (20 failures) and resolve exit 2 with dependencies_missing, the documented prerequisite"
  - "Upgrade install 25186fe to be77030 reproduces nine emptied directories under ruach-librarian/evals, with no files; installed check exit 0"
  - "Pre-contract inventory confirmed with the handoff validator: 8 named files exit 1 HEADER_INVALID; the six p01 reports and versioned-agent-skills/architect.md exit 0"
  - "Case 05/06 packets byte-identical to be77030; regenerated diffs match saved changes.diff; reports identical; protected and retained sources byte-identical"
  - "Reused, not rerun: Bun suites handoff 24, Herdr 107, harness-eval 59 (reviewer.md at 25186fe); the delta changes only adapters.md under those skills"
review:
  - "Independent delta review complete: accept; 0 blocking, 3 optional"
discoveries:
  - "Cases 05 and 06 ran on the Claude alternative route (claude-opus-5-5). The Librarian's preferred route gpt-6.1-sol-high is unevaluated on the strengthened cases, and the route for basic cases 01-04 was never recorded"
  - "Subject sessions, the implementer and this reviewer share one model family; this may bias grading"
blockers: []

# Delta review: Ruach extraction follow-up

Reviewer `ruach-review`. Assignment: [assignment-reviewer-delta.md](assignment-reviewer-delta.md). Earlier review: [reviewer.md](reviewer.md). Follow-up under review: [assignment-implementer-followup.md](assignment-implementer-followup.md) and [implementer-followup.md](implementer-followup.md).

## Reviewed revisions and scope

- **Ruach** `extraction`: `25186fe..be77030727074d9c10e842c08647ad4a61232152`. This is one new commit with no history rewrite. `main` is unborn and the working tree is clean.
- **Brainlab** `ruach-extraction`: source delta `dcaa286..b02b3c67a00219fd197fe31265e0faa338243b06`. It touches 34 files:
  - 28 snapshot deletions under `.agents/skills/ruach-librarian/evals/`;
  - `ruach.json`, PROVENANCE and `adapters.md` from the re-pin;
  - `.agents/README.md`, ADR-0005 and `docs/mailbox/README.md`.

  The later commits `91fd2aa`, `2bac128` and `7add98c` touch only `docs/mailbox/`.
- **Blind runs** [05-redundant-source](librarian-eval/05-redundant-source/) and [06-implicit-status](librarian-eval/06-implicit-status/), with handoffs [ruach-libeval5.md](ruach-libeval5.md) and [ruach-libeval6.md](ruach-libeval6.md).

No source was modified. Disposable clones are in `/tmp/ruach-delta-*`.

## Disposition: accept

There are no blocking findings.

## Blocking findings

None.

## Optional findings

1. **The installer leaves emptied directories behind after pruning (delta acceptance 6: optional, not blocking).**
   - *Location:* Ruach `scripts/install.py:128-130`. Pruning unlinks files that were removed upstream but never removes their parent directories.
   - *Scenario:* installing `25186fe` and then upgrading to `be77030` leaves nine empty directories under `.agents/skills/ruach-librarian/evals/`, and `check` exits 0.
   - *Why this is not blocking:*
     - Git does not track empty directories, so committed snapshots and fresh clones never contain them.
     - The directories hold no files, so no eval content leaks.
     - Drift checks are file-based.
     - Harness discovery needs a `SKILL.md`, so an emptied skill directory is inert.

     The effect is local clutter in the checkout that ran the sync.
   - *Suggested direction:* after unlinking pruned files, remove parent directories that are now empty, stopping at `agents/`, `skills/` or `ruach/`. Add an assertion to `test_update_prunes_only_previously_managed_files`.
2. **The eval-placement guard matches names, not content.**
   - *Location:* Ruach `scripts/check.py:21-25`.
   - *Problem:* it flags only paths named `evals` or file names containing `rubric`. Material such as `skills/x/expected/answers.md` or `skills/x/cases/` would pass.
   - *Why it matters:* this is low impact. The README, CONTRIBUTING and the check comment state the convention, and the installer test covers the top-level location.
   - *Suggested direction:* optionally also flag `expected` and `cases` directories under `skills/`, or accept the guard as a convention check.
3. **Behavioral coverage was evaluated only on the alternative route.**
   - *Location:* evaluation records, not code. Both strengthened runs used `claude-opus-5-5`, but `.agents/roles.yaml` prefers `gpt-6.1-sol-high` for the Librarian.
   - *Why it matters:* the passes say nothing about behavior on the route Brainlab will actually launch by default.
   - *Suggested direction:* if route-level confidence is wanted, run 05 and 06 (and optionally 01–04) once on the preferred route, recording the route as the evals README already asks.

## Delta acceptance

1. **Eval placement: met.**
   - Evals now live in `evals/ruach-librarian/`.
   - `git diff -M --summary` shows 27 renames at 100%: the 26 basic-case files plus `rubric.md`. The old in-skill README was replaced by the top-level one.
   - `skills/ruach-librarian/` now holds only `SKILL.md`, and no installed file links into `evals/`.
   - The installed tree has 57 files with no eval or rubric paths. The only name matches are the unrelated `ruach-harness-eval` skill and its `tests/eval.test.ts`.
   - Enforcement:
     - `check.py` gains a name-based guard (optional finding 2).
     - New `tests/test_check.py` covers top-level evals passing and in-skill evals or rubrics failing.
     - `test_development_evals_are_not_installed` puts a source rubric at top level and asserts it is not installed or recorded.
   - Existing tests are unchanged.
2. **Strengthened cases: realistic and fair, and they exercise the target behaviors.**
   - *Case 05:*
     - The digest's product claims are a strict subset of `export-run.md`.
     - Three inbound links point to it. One is a misattribution: `knowledge/import.md` cites the digest for an import claim the digest does not contain.
     - The overlapping `import-check.md` holds unique evidence.
     - So the subject must choose the correct source, repair every link and re-cite the import claim.

     The task text itself grants authority "without further confirmation". That is how real authorization reads, but it weakens the case as a test of the skill's own no-needless-gate guidance.
   - *Case 06:*
     - No source labels its own status.
     - Acceptance must come from the owner log, and the tested revision and scope from raw CI headers, cross-checked against the GUIDANCE rule that revision labels increase with each merge.
     - The retry positive control penalizes over-caution.

     One residual ambiguity: run 4411 could be read as a pre-merge build. The rubric handles this fairly, because it only forbids citing 4411 as verifying LRU or ash-r7, which holds either way.
   - *Evals README:* it describes the basic and strengthened sets accurately. Its Known limits cover the synthetic, small corpora, single runs, recording model and route, the basic-case cues, and the redundancy gap in case 04.
3. **Adapter sentence: met.** `skills/ruach-herdr/references/adapters.md:33` now reads "Authorized native preparation includes those documented runtime writes for the immediately following Codex launch; consumer assignments may restrict it. Accordingly, an absent, mismatched or unreadable daemon now triggers stdio inspection…". This restores the baseline linkage and meaning while staying consumer-neutral.
4. **Brainlab: met.**
   - The pin is at `be77030` with 57 files, and both checks pass.
   - The `docs/mailbox/README.md:13` pre-contract list is accurate. I validated every named file:
     - the Claude and Codex architect-injection reports, the orchestrator-comparison `assignment`/`results`, the four-harness `assignment`/`observer-source`/`results`, and the README all exit 1 with `HEADER_INVALID`;
     - p01 ×6 and `versioned-agent-skills/architect.md` exit 0.
   - The double blank lines are collapsed.
   - `git diff --exit-code dcaa286 b02b3c6` over CURRENT, TASK_LOGS, catalogs, `policy.md`, AGENTS, SCHEMA, `justfile`, `scripts/` and `bin/` exits 0. No behavior changed, and the accepted implementation is preserved.
5. **Publication scope: clean.** I scanned all 111 tracked Ruach files at `be77030`. The matches are the pre-existing provenance link, generic "mailbox" wording in the ADR and evals README, and a handoff test fixture path. There are no symlinks, and the author is the noreply identity. The new eval files contain only synthetic names (slate, ash, dana, lee, kai).
6. **Emptied directories:** optional finding 1.

## Verification (exit status captured unpiped via `$?`; output redirected to logs)

| Cwd | Command | Result |
| --- | --- | --- |
| `/tmp/ruach-delta-rv1Q` | `git clone -q --no-hardlinks /opt/dev/ruach ruach`; `git -C ruach checkout -q be77030727074d9c10e842c08647ad4a61232152` | HEAD = candidate |
| clone | `python3 scripts/check.py` | exit 0 |
| clone | `python3 -m unittest discover -s tests -v` | exit 0; 13 tests OK (2 check, 11 installer) |
| clone | `python3 scripts/install.py install --source <clone> --revision be77030… --target <tmp>/inst/.agents` | exit 0; 57 files |
| clone | `python3 <tmp>/inst/.agents/ruach-install.py check --target <tmp>/inst/.agents` (also with `--source <clone>`) | exit 0 each |
| clone | `find <tmp>/inst` for `*eval*`, `*rubric*`, `expected`, `corpus`, `cases`; `grep -ciE 'evals\|rubric' ruach.json` | only the `ruach-harness-eval` dir and its `tests/eval.test.ts`; count 0 |
| clone | install `25186fe` to `<tmp>/up/.agents`, then `ruach-install.py install … --revision be77030…`, then `find -type d -empty`, then `check --source` | install exit 0; upgrade exit 0; 9 empty dirs, 0 files under `evals/`; check exit 0 |
| `/opt/dev/ruach` | `git diff -M --summary 25186fe be77030` | 27 `rename (100%)`; adds 05/06, `strengthened-rubric.md`, `test_check.py` |
| `/opt/dev/ruach` | `git diff --name-only 25186fe be77030 -- skills/ruach-handoff skills/ruach-herdr skills/ruach-harness-eval` | only `skills/ruach-herdr/references/adapters.md` |
| `/opt/dev/ruach` | `git grep -nIE '<home/opt/tmp paths, user identifiers, UUID, token/key patterns, tehom/brainlab, mailbox, CURRENT/TASK_LOGS, route IDs>' be77030` (lockfiles and previously reviewed, unchanged Herdr tests and harness-eval excluded) | benign matches only (see acceptance 5) |
| `/tmp/ruach-delta-rv1Q` | `git clone … --branch ruach-extraction <worktree> bl`; checkout `b02b3c6…` | HEAD = candidate |
| fresh `bl` | `just check-ruach`; `just check-ruach --source /opt/dev/ruach` | exit 0 each; "Snapshot verified: be77030… (57 files)" |
| fresh `bl`, no deps | `just test-agent-routing`; `just agent-routing resolve librarian` | exit 1 (20 failures); exit 2 `dependencies_missing`, the documented post-clone prerequisite (`.agents/README.md`) |
| fresh `bl` `.agents/skills/ruach-herdr` | `~/.bun/bin/bun install --frozen-lockfile` | exit 0 |
| fresh `bl` | `just check-ruach`; `just test-agent-routing`; `just agent-routing resolve librarian`; `… --route claude-opus-5.5-high` | exit 0; exit 0 (14 OK); exit 0 (`gpt-6.1-sol-high`/codex/high); exit 0 (`claude-opus-5.5-high`/claude/high) |
| fresh `bl` | `git ls-files \| grep -ciE 'ruach-librarian/evals\|rubric'`; `ruach.json` revision and count | 0; `be77030…`, 57 |
| fresh `bl` | `git diff --exit-code dcaa286 b02b3c6 -- docs/CURRENT.md docs/TASK_LOGS.md .agents/{models,routing,roles}.yaml .agents/policy.md AGENTS.md docs/SCHEMA.md justfile scripts bin` | exit 0 |
| worktree | `just check-ruach` | exit 0 (57 files) |
| worktree | `~/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts <file>` for each file in the pre-contract list plus the remaining `versioned-agent-skills` files | as stated in acceptance 4 |
| worktree | `cmp`/`diff -r` of each packet's pristine and working `SKILL.md`, `task.md` and corpus against `git archive be77030`; regenerate `diff -ruN <pristine>/corpus <work>/corpus` and compare it with the saved `changes.diff` (excluding header lines); `cmp` working `report.md` with the saved copy | all identical or matching |

**Reused, not rerun:** the Bun suites for handoff (24), Herdr (107) and harness-eval (59), all exit 0 at `25186fe` per [reviewer.md](reviewer.md). The delta changes no code in those skills. **Not verified:** live harness sessions; preferred-route behavior on cases 05 and 06.

## Strengthened case grades

Graded against `/opt/dev/ruach/evals/ruach-librarian/expected/strengthened-rubric.md` at `be77030`, using the working corpora in `/tmp/ruach-libeval-*` and the saved outputs.

| Case | Grade | Justification |
| --- | --- | --- |
| 05-redundant-source | **Pass** | `sources/export-digest.md` is removed with a content-based reason in [report.md](librarian-eval/05-redundant-source/report.md) (line 10: "every claim lives in the export run"), and no confirmation was asked. No link targets the digest; the remaining mention is a code-formatted path in the report, which the rubric allows. The export claims, the 48 passed and the open pre-1970 problem are cited to `export-run.md`. The import claim was re-cited to `import-check.md`, and the semicolon exit-2 failure is now on `knowledge/import.md`. Both retained sources are byte-identical. It does not claim that semicolon import works or that pre-1970 is fixed. |
| 06-implicit-status | **Pass** | `knowledge/cache.md` records TTL as accepted (dana, 2026-09-02) and LRU as lee's reported ash-r7 merge with no owner decision. The conflict is unresolved, and a decision is proposed to dana (accept LRU or reaffirm TTL). Run 4411 is labelled ash-r6, `make test`, 212 passed, and explicitly does not verify LRU. Run 4420 is described as retry-only. The positive control is met: `network.md` states the accepted backoff (200 ms, 5 attempts), links the log, records the ash-r8 merge and the 18-passed retry run, and marks the old "sent once" text as superseded history with a reason. `decisions/log.md` and all `sources/` files are byte-identical. |

Common requirements were met in both cases:

- edits stayed inside permitted files;
- each report gives the source inventory, dispositions, destinations, unresolved findings, owner proposals and the actual checks;
- there was no web research, no new application check and no fabricated acceptance.

The original 01–04 results stand as basic-case coverage.

**Limits.**
- Each case is a single fresh session on small synthetic corpora, with no variance estimate.
- Both runs used `claude-opus-5-5`, the Librarian's alternative route (optional finding 3).
- In case 05, the task text grants explicit no-confirmation authority, so the absence of a confirmation request reflects that instruction as much as the skill.
- Isolation relied on instructions plus packet copies. Nothing technically prevented a subject from reading `/opt/dev/ruach/evals`, and each handoff self-reports compliance.
- The subjects, the implementer and this reviewer share one model family.

These passes show that the skill guided correct disposition, link repair and evidence-based status inference on these fixtures. They do not establish robustness on real mailboxes or on the preferred route.

## Remaining

Optional findings 1–3 are at the Coordinator's discretion. Protected `docs/CURRENT.md` (lines 21 and 81) still needs its owner update, as noted in [reviewer.md](reviewer.md). Merge, publication and global-link migration remain separate assignments.
