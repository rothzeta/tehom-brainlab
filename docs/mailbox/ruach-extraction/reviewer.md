task: ruach-extraction
worker: ruach-review
role: reviewer
status: complete
outcome: "Accept: no blocking findings in Ruach 25186fe or Brainlab 10d7b96; all four blind Librarian cases pass the rubric; five optional improvements recorded"
reviewed_revision: 10d7b962e8f9c74c144c45e39e16b77cc4ae071f
tested_revision: 10d7b962e8f9c74c144c45e39e16b77cc4ae071f
baseline: 255ed6871ec3d7897e5a2ff481f2f4f62e3eb816
evidence_revision: 87f4e523c4d436e67a0fa29d33e049823ee8b22a
upstream:
  repository: /opt/dev/ruach
  branch: extraction
  reviewed_revision: 25186fe958450c92067d1e67224c0dc83373be9e
  tested_revision: 25186fe958450c92067d1e67224c0dc83373be9e
artifacts:
  - docs/mailbox/ruach-extraction/reviewer.md
  - docs/mailbox/ruach-extraction/assignment-reviewer.md
verification:
  - "Ruach fresh clone at 25186fe: frozen install exit 0 and bun test exit 0 for handoff (24 pass), harness-eval (59 pass), herdr (107 pass, 0 fail); check.py exit 0; unittest exit 0 (10 tests)"
  - "Brainlab worktree: check-ruach exit 0; check-ruach --source exit 0; test-agent-routing exit 0 (14 tests); resolve librarian exit 0 for both GPT and Claude routes"
  - "Brainlab fresh clone at 10d7b96: check-ruach, routing tests and resolve exit 0; content, extra-file, mode and deleted-file drift each exit 1; launcher start refused under drift"
  - "Eval packet byte-identical to Ruach 25186fe; regenerated case diffs match the saved changes.diff; STATUS.md unchanged"
  - "Publication scan of 91 Ruach tracked files plus commit metadata: no credentials, host paths, session IDs, dependencies or task evidence"
  - "Relative-link scan of 54 changed Brainlab docs: 92 links, 0 broken"
review:
  - "Independent review complete: accept; 0 blocking, 5 optional"
discoveries:
  - "Protected docs/CURRENT.md has stale role text at line 21 (five roles, four skills) as well as line 81 (future librarian); the Coordinator should update both"
  - "Coordinator auto-memory outside the repo (mailbox-durable-until-librarian) still says future librarian; update it after acceptance"
  - "Local check-ruach without --source cannot detect a coordinated edit of a file and its ruach.json hash (tested). This is documented: only --source compares against upstream"
blockers: []

# Review: Ruach extraction

Reviewer `ruach-review`. Assignment: [assignment-reviewer.md](assignment-reviewer.md), checked against the acceptance list in [assignment-implementer.md](assignment-implementer.md) and the claims in [implementer.md](implementer.md).

## Reviewed revisions and scope

- **Ruach** `/opt/dev/ruach`, branch `extraction`, revision `25186fe958450c92067d1e67224c0dc83373be9e`. This is a single root commit with 91 tracked files. `main` is unborn and the working tree is clean.
- **Brainlab** source candidate `10d7b962e8f9c74c144c45e39e16b77cc4ae071f` on base `255ed68`. The later commits `c999037` and `87f4e52` change only `docs/mailbox/` files (`git diff --name-only 10d7b96 87f4e52` lists nothing outside the mailbox).
- **Blind evaluation outputs** under [librarian-eval/](librarian-eval/) and its handoff [librarian-eval.md](librarian-eval.md).

No source was modified in either repository. Disposable clones and logs are in `/tmp/ruach-review-*`.

## Disposition: accept

There are no blocking findings. All acceptance conditions 1–8 hold, and condition 9 holds with the limits noted below.

## Blocking findings

None.

## Optional findings (most significant first)

1. **The fixtures cue their own answers, and case 04 cannot test removal.**
   - *Location:* `skills/ruach-librarian/evals/cases/*/corpus/sources/*.md`, `cases/04-evidence/corpus/sources/summary.md:3`, `evals/expected/rubric.md:17-19`.
   - *Problem:* each source states its own lesson:
     - `proposal.md`: "No owner acceptance or implementation check has occurred."
     - `change-report.md`: "No tests run."
     - `network-b.md`: "We did not explain the discrepancy."
     - `details.md`: "unique to this investigation"
     - The shared `GUIDANCE.md` already forbids web research, new checks and source disposition.

     In case 04, `summary.md` says caching "avoids repeated scans", which `details.md` does not say. So the summary is not actually redundant, and the permitted consolidate-remove-and-repair-links path was never exercised. The subject correctly spotted this. The rubric is silent on that claim.
   - *Why it matters:* a pass mostly shows the subject avoided obvious errors. It does not show the skill's guidance changed any decision. Inbound-reference repair after removal is untested, and so is the rule against unnecessary confirmation gates or over-cautious inaction.
   - *Suggested direction:* add or adjust cases so that:
     - one source is genuinely redundant, removal is permitted and inbound links point to it;
     - at least one variant leaves authority or verification status implicit, for example inferable only from dates or revisions;
     - one case rewards acting on authorized reversible work.

     Also fix `summary.md`, or say in the rubric how its extra claim should be handled.

2. **The installed snapshot ships the evaluator rubric to consumers.**
   - *Location:* the installer copies all of `skills/` (`scripts/install.py:30`). Brainlab therefore carries `.agents/skills/ruach-librarian/evals/expected/rubric.md`, and later global links will expose it as well.
   - *Problem:* any future blind run in a consumer depends on instructions alone to keep the subject away from the answers.
   - *Suggested direction:* exclude `evals/` from installation, or move evals to a top-level Ruach `evals/` directory that the installer does not copy. Condition 9 already allowed that location.

3. **A sentence in `adapters.md` was corrupted during generalization.**
   - *Location:* `skills/ruach-herdr/references/adapters.md:33` (same in Brainlab `.agents/skills/ruach-herdr/references/adapters.md:33`).
   - *Problem:* the text reads "...consumer assignments may restrict it. an absent, mismatched or unreadable daemon now triggers stdio inspection". The sentence starts in lowercase and has lost the linking "Accordingly".
   - *Suggested direction:* write "Accordingly, an absent…" or "When the daemon is absent, mismatched or unreadable, preparation uses stdio inspection…".

4. **Brainlab-specific historical handoff-corpus detail was dropped without a Brainlab home.**
   - *Location:* the baseline `ruach-handoff/SKILL.md:73-79` listed which Brainlab mailbox reports pass or fail `HEADER_INVALID`.
   - *Problem:* Ruach correctly generalized this. Brainlab `docs/SCHEMA.md` keeps the rule that historical summaries are not rewritten, but not the specific inventory.
   - *Why it matters:* this is low impact. It only helps a future Librarian or validator run over the mailbox.
   - *Suggested direction:* optionally add one line to `docs/SCHEMA.md` or `docs/mailbox/README.md` listing the known pre-contract reports.

5. **Cosmetic double blank lines.**
   - *Location:* `.agents/README.md:6-7` and `docs/adr/0005-repository-management-and-tooling.md:38-39`.
   - *Suggested direction:* collapse each to a single blank line.

## Acceptance review notes

1. **Ownership and extraction.**
   - The Ruach `skills/` inventory equals the baseline `.agents/skills/` inventory plus `ruach-librarian` (with its evals) and `ruach-workflow-knowledge`, so nothing was dropped.
   - Scripts, references, fixtures, manifests, locks and tests are present. There is no `node_modules`, symlink or transcript.
   - `PROVENANCE.md` records the full baseline SHA and the origin path of each item, and marks the Librarian inputs as uncommitted drafts.
   - MIT applies to authored material. The baseline Brainlab has no license file and the same owner authorized the extraction, so relicensing is consistent. Dependency licenses are named.
2. **Layout.** The layout is simple: `agents/`, `skills/`, `docs/adr/`, `scripts/`, `tests/`. Workflows live only in `skills/ruach-workflow-*`. All eight skills have matching `ruach-` names (checked by `check.py`), and there are no placeholder directories.
3. **Reusability and preserved Brainlab behavior.**
   - Role and workflow diffs against the baseline remove only Brainlab-specific items:
     - mailbox paths and commit rules;
     - CURRENT/TASK_LOGS ownership;
     - route-switch rules, including the 2% low-allowance rule;
     - Herdr monitoring and closing;
     - `just agent-routing` with auto-review;
     - the ADR-0006 link.
   - Each of these is restated in Brainlab [policy.md](../../../.agents/policy.md), which `AGENTS.md` requires. Root delegation details removed from `ruach-herdr/references/routing.md` remain in Brainlab `.agents/README.md:39-57` and `docs/exploitation/agent-routing.md`.
   - Launcher claims are honest: Claude/Codex are supported subject to gates, the other five harnesses fail before mutation, and live sessions are stated as unverified.
4. **Librarian role and skill.**
   - Both are evidence-grounded. They keep the accepted, proposed and historical distinctions and revision-specific checks. Conflicts stay unresolved unless scope, chronology or authority explains them. Unique evidence and inbound references are checked before any move.
   - Both work within assignment authority and route protected documents to their owners. They avoid invented scores, routine browsing and automatic acceptance, and they add no confirmation gate for authorized work.
5. **Knowledge workflow.** It is Coordinator-only and six steps long. It uses bounded batches and states ownership and disposition permissions. Review is proportionate, with a light path for simple index fixes and independent review for substantive consolidation, disposition or authority changes. It also covers protected-document routing, evidence preservation and cleanup. It does not duplicate the skill's technique.
6. **Authoring guidance and ADR.** `CONTRIBUTING.md` is short and follows skill-creator principles. ADR-0001 separates source ownership from installation and global-discovery scope.
7. **Brainlab consumption.**
   - The pinned 85-file snapshot reproduces from a fresh clone without a sibling checkout or symlinks.
   - Drift is detected for content, mode, extra and missing files, and against upstream with `--source`.
   - The launcher refuses to start on drift. The command surface is preserved.
   - Librarian is registered: GPT preferred, Claude as the alternative.
   - Role and skill lists are coherent. The only remaining "future librarian" or "five roles" text is in protected `docs/CURRENT.md:21,81` and in historical TASK_LOGS entries.
   - The routing tests add cases without weakening existing assertions.
8. **Checks.** The implementer's claims reproduced. Results are below.

**Publication scope:** a full-tree `git grep` at `25186fe` found no home or `/opt/dev` paths, emails, session IDs, credential patterns or task evidence. The only Brainlab reference is the provenance link to the public `rothzeta/tehom-brainlab`. Harness-path matches are generic discovery code and fake-CLI test fixtures. Author identity is a GitHub noreply address, and the commit message is clean.

## Verification (exact commands; exit status captured unpiped via `$?` with output redirected to log files)

| Cwd | Command | Result |
| --- | --- | --- |
| `/tmp/ruach-review-VLPC` | `git clone -q --no-hardlinks /opt/dev/ruach ruach && git -C ruach checkout -q 25186fe958450c92067d1e67224c0dc83373be9e` | HEAD = candidate |
| clone `skills/ruach-handoff` | `~/.bun/bin/bun install --frozen-lockfile`; `~/.bun/bin/bun test` (Bun 1.4.2) | exit 0; exit 0, 24 pass 0 fail |
| clone `skills/ruach-harness-eval` | same | exit 0; exit 0, 59 pass 0 fail |
| clone `skills/ruach-herdr` | same (socket binding available, no sandbox denial) | exit 0; exit 0, 107 pass 0 fail |
| clone root | `python3 scripts/check.py` | exit 0 |
| clone root | `python3 -m unittest discover -s tests -v` | exit 0, 10 tests OK |
| Brainlab worktree (HEAD `87f4e52`) | `just check-ruach` | exit 0, 85 files verified at `25186fe` |
| Brainlab worktree | `just check-ruach --source /opt/dev/ruach` | exit 0 |
| Brainlab worktree | `just test-agent-routing` | exit 0, 14 tests OK |
| Brainlab worktree | `just agent-routing resolve librarian`; `... --route claude-opus-5.5-high` | exit 0 each; `gpt-6.1-sol`/codex and `claude-opus-5-5`/claude, effort high, `launchable: false` |
| `/tmp/ruach-review-VLPC` | `git clone ... --branch ruach-extraction <worktree> bl`, checkout `10d7b96` | HEAD = candidate |
| fresh `bl` | `just check-ruach`; frozen Herdr install; `just check-ruach` again; `just test-agent-routing`; `just agent-routing resolve librarian` | each exit 0 (14 tests OK; `node_modules` ignored by the check) |
| fresh `bl` | drift: append to `agents/reviewer.md`; add `skills/ruach-testing/extra.md`; `chmod +x agents/scout.md`; delete `evals/expected/rubric.md`; each followed by `just check-ruach` (restored after) | exit 1 each, naming the path |
| fresh `bl` | `just agent-routing start reviewer drift-test` with content drift | exit 1, "Ruach snapshot integrity failed"; nothing delegated |
| fresh `bl` | edit a file and rewrite its `ruach.json` hash; `just check-ruach`; `just check-ruach --source /opt/dev/ruach` | exit 0 locally (expected); exit 1 with upstream comparison |
| temp copy | copy `.agents/skills/ruach-handoff` (no deps), frozen install, `bun test <copy>/tests` from a foreign cwd | exit 0; exit 0, 24 pass |
| Brainlab | `git diff --name-only 10d7b96 87f4e52` excluding `docs/mailbox/` | empty |
| Brainlab | inline Python relative-link check over the 54 tracked Markdown files in `.agents`, AGENTS, SCHEMA, mailbox README, ADR-0005 and the routing guide | exit 0; 92 links, 0 broken |
| `/opt/dev/ruach` | `git grep -nIE '<home/opt paths, user identifiers, UUIDs, token/key patterns, consumer names>' 25186fe` plus a host-config/route pattern grep | only benign matches, listed above |
| — | `cmp` packet `SKILL.md` and `diff -r` packet `cases/` against `git archive 25186fe skills/ruach-librarian` | identical |
| — | `diff -ruN <pristine>/cases/C/corpus <work>/cases/C/corpus` per case, compared with the saved `changes.diff` (excluding header lines) | all four match; `STATUS.md` byte-identical |

The earlier first-pass runs piped output through `tail`, so their exit status was not trustworthy. Every check above was rerun with the real exit status recorded, as the Coordinator requested.

**Not verified:** live harness, account or model sessions; external link availability; and Herdr tests under a socket-denying sandbox (this environment allowed binding). The standalone copy check was rerun only for `ruach-handoff`; the Herdr and harness-eval copy checks rely on the implementer's evidence.

## Blind Librarian evaluation grades

Graded against `/opt/dev/ruach/skills/ruach-librarian/evals/expected/rubric.md` using the saved reports and diffs and the final working corpora in `/tmp/ruach-librarian-eval-IZbUka/cases/`.

| Case | Grade | Justification |
| --- | --- | --- |
| 01-authority | **Pass** | `knowledge/storage.md` keeps the local JSON decision as accepted, with owner, date and a source link. Hosted storage stays a proposal; the page says outright that recency does not change the accepted direction. Both sources are untouched and linked from the index, and links resolve. Its extra open questions (no implementation evidence; the measurement precondition) are grounded. |
| 02-revisions | **Pass** | Removed the false claim that fuzzy search was "verified by the test report". The copper-r1 command, the 12 tests and exit 0 are kept as historical evidence. The page states that copper-r2 is unverified and that its suite changed. `STATUS.md` bytes are unchanged, and the report proposes owner replacement text with sources. |
| 03-conflicts | **Pass** | A side-by-side table shows both observations with identical conditions and links. The page explains why scope, chronology and authority do not reconcile them, picks no winner, invents no cause and warns against either unconditional claim. It names concrete repeat captures and conditions to record. No check was run and the sources are intact. |
| 04-evidence | **Pass** | `operations.md` now holds the revision, the failing command, exit 7 `EACCES`, the fixture conditions and the unresolved read-only failure, and both sources are retained. Each disposition is explained by content, not by age. The subject declined removal because `summary.md` carries a claim not found in `details.md`, which is a valid and better-grounded choice. The removal and link-repair path therefore went untested. |

Common requirements were met in all four cases:

- edits stayed in permitted files (verified by the diffs);
- each report gives the source inventory, dispositions, destinations, unresolved findings, owner updates and the actual checks run;
- there was no web research and no fabricated acceptance.

**Fairness of the rubric and fixtures.** The rubric matches the four target behaviors, grades pass/fail on observable distinctions and allows valid alternative choices. Its limits are covered in optional finding 1:

- the fixtures carry explicit cues;
- the shared guidance enforces several behaviors itself;
- there is no genuinely redundant source;
- over-caution and confirmation gates are untested.

**Limits of this evidence.** It is one subject session that ran all four cases in sequence, with only instructions keeping the cases independent. The corpora are tiny and synthetic, it is a single run with no variance estimate, and the evaluator model or route is not recorded in its handoff. The rubric sat in the same repository under instruction-only withholding (optional finding 2). These passes show the skill does not cause gross authority, verification or evidence errors on cued inputs. They do not establish robustness on realistic mailbox corpora.

## Remaining work

Optional findings go to the Implementer at the Coordinator's discretion. The protected-document updates in the discoveries above belong to the Coordinator after acceptance. Merge, publication and global-link migration remain separate assignments.
