task: versioned-agent-skills / skills-reviewer / round-2
status: complete
outcome: No material findings in round-two changes; previous P1 and P3 findings are resolved.
artifacts:
  - docs/mailbox/versioned-agent-skills/reviewer-2.md
verification:
  - 'Frozen installs: all three candidate scratch copies exited 0.'
  - 'Default Bun suites with required socket access: Herdr 77 passed, handoff 24 passed, eval 59 passed; 160 total, no failures.'
  - 'Original P1 reproduction now reports the requested dirty checkout, rejects checkout output, and preserves both repositories; intentional acceptance-check Git overrides remain effective.'
  - 'Committed catalogs: eight live role-only resolve/dry-run preparations passed; two Architect preparations failed at the documented Claude customization gate; all role preferences and allowed alternatives resolved offline.'
  - 'Independent portable catalogs, diagnostic ordering, socket prerequisite, format, portability and whitespace checks behaved as documented.'
review:
  - 'No blocking or optional findings established in the assigned round-two scope.'
discoveries:
  - 'This caller environment prevents Claude worker preparation for Architect through the existing managed/account-synced customization gate; no fallback occurred.'
  - 'The informational README merge conflict and root-command/catalog integration remain separate integration work, as documented.'
blockers: []
reviewed_revision: 618ee9bb858e7e1e1941f4571facfbb93d0d547b
tested_revision: 618ee9bb858e7e1e1941f4571facfbb93d0d547b
source_baseline: 4e8d7d30fb57a033b5c4378aeec2fae7aaf209bd
catalog_revision: 97752643b31cdcf8c8ec9f09204382c6766b1573
evidence_revision: d550db9aa9f0594c51d2ac5d1cada4d72915cb97

Author: Reviewer (skills-reviewer). Date: 2026-10-04 UTC.

Reviewed exactly `4e8d7d3..618ee9bb858e7e1e1941f4571facfbb93d0d547b`, focusing on evaluator isolation/regression coverage, committed-catalog routing and portable policy boundaries, Herdr/handoff friction fixes, and related documentation. The later `d550db9` changes only `docs/mailbox/versioned-agent-skills/implementer-integration-2.md`; it is evidence, not another reviewed implementation. The first [review report](reviewer.md) remains unchanged.

## Findings and disposition

**No material findings. No new blocking or optional improvements are required by this re-review.**

The previous **P1 is resolved** at `.agents/skills/ruach-harness-eval/scripts/common.ts:69`: private Git probes remove inherited `GIT_*` variables, then set `GIT_OPTIONAL_LOCKS=0`. Root discovery canonicalizes the explicitly requested directory and rejects a worktree that does not contain it. Output protection consequently uses the requested worktree and its actual Git metadata. Acceptance commands retain their inherited/configured environment independently.

I recreated the original two-repository failure rather than relying only on the added tests. Repository A was dirty with untracked `unexpected`; B was clean and had a distinct HEAD. With `GIT_DIR=B/.git GIT_WORK_TREE=B`, `scope-check --repo A --baseline HEAD --candidate HEAD` now exits **1**, returns A's HEAD `978ddede002ed62e1a6a060e3ee1d58b9bfffa6d`, and reports both `unexpected_paths` and `dirty_worktree`. Output inside A is rejected with exit **2**, `invalid_output`, without creating the file. File contents and modification times, including Git files, remain unchanged in both repositories.

Acceptance likewise records A's HEAD and dirtiness, exits **1**, and rejects output inside A with exit **2**. Its intentionally configured Git check still reads B's HEAD `5eb3f5027d1b8fc94f39b99d5a7ba44dcca843a8`, demonstrating that internal isolation does not erase check configuration. After removing A's known untracked fixture file, acceptance exits **0**, retains A as candidate/tested HEAD and B as the check's observed HEAD, and preserves both repositories. The new suite additionally exercises inherited index, common-directory, object-storage, discovery and injected-config overrides, subdirectory/symlink selection, persistent `core.worktree` redirection, and metadata preservation.

The previous **P3 is resolved** at `.agents/skills/ruach-harness-eval/tests/eval.test.ts:63`: compared test fixtures receive an explicit identical mode in both repositories. A separate behavior test verifies that real permission differences change fixture hashes/fingerprints while assignment and acceptance hashes stay equal. The archived scratch copy passed its default suite without reviewer permission adjustments.

## Routing and portability assessment

The catalogs read from committed `97752643` have the implemented shape: `.agents/models.yaml` contains `harness`/`native_model`, `.agents/routing.yaml` contains model references and effort, and `.agents/roles.yaml` contains preferred routes and optional alternatives. I inspected those three files and the root launcher's selection logic using read-only `git -C /opt/dev/tehom-brainlab show 97752643:<path>` commands. Preference/explicit-alternative selection matches that launcher's semantics. An explicit route outside a role's allowed set is rejected; there is no error fallback.

The portable skill deliberately excludes repository policy: it does not require the repository's five-role set, Claude/Codex-only catalog, high effort or Claude coordinator preference. Its adapter registry validates harness identities, the selected native adapter validates effort, and the selected role requires its canonical instruction file. All catalogs still undergo complete structural/reference validation. Other declared roles need not have local instruction files until selected; this is documented and covered by tests. Root repository policy remains the root validator's responsibility at later integration. The routing reference accurately distinguishes those boundaries and the root command's unresolved API/permission/preflight compatibility.

An independent fixture used a non-canonical `researcher` role with a Codex medium preference and Claude low alternative, plus a coordinator whose preference was Codex medium. Researcher `resolve`, `start --dry-run`, and explicit alternative preparation all passed with the expected native values. The coordinator also prepared Codex from data. A declared but disallowed route returned **2**, `disallowed_route`; an unsupported selected Codex effort returned **2**, `unsupported_effort`. No fake startup submissions, pane mutations or private launch material occurred. These results support policy portability without claiming support for the gated adapters.

Against a temporary detached worktree at the exact committed catalog revision, I exercised both live `resolve` and `start --dry-run` by role alone for all five repository roles. No kind, model, effort or route override was supplied:

| Role | Preferred route | Live preparation results |
| --- | --- | --- |
| coordinator | claude-opus-5.5-high | Resolve and dry-run exit 0; Claude/high from data. |
| architect | claude-opus-5.5-high | Both exit 3, `unverified_workflow_source`, through the existing Claude managed/account-synced customization gate. |
| scout | gpt-6.1-sol-high | Resolve and dry-run exit 0; Codex/high from data. |
| implementer | gpt-6.1-sol-high | Resolve and dry-run exit 0; Codex/high from data. |
| reviewer | gpt-6.1-sol-high | Resolve and dry-run exit 0; Codex/high from data. |

The eight successful preparations reported `launchable: true`, empty diagnostics, and `submission_state: not-submitted`. Canonical/native values matched the committed catalogs. Architect's two failures are accurate, documented environment limitations of the unchanged Claude adapter, not catalog-selection defects. They did not silently switch to its available Codex alternative. Offline checks independently verified all five preferences, four permitted alternatives, and rejection of coordinator's undeclared Codex override. Architect's preferred live native argv remains unverified in this caller environment.

The detached checkout remained clean, and its file contents/modification times matched the pre-probe snapshot. It was removed successfully after verification. No real pane, agent, daemon or paid turn was started.

## Friction fixes, documentation and integration boundary

Herdr's SKILL.md now explicitly states the live Herdr/native prerequisites for ordinary resolve, dry-run and start, and provides the offline selection command. The socket prerequisite fails at module setup before per-test fixtures: intentionally running default `bun test` in the restricted sandbox exited **1** in **45ms**, with `local Unix-domain socket binding is required (EPERM)` and no silent skips. With socket access, the default suite passed. The grouped handoff tests now have proportional per-probe timeout budgets without changing their behavioral assertions; the default handoff suite passed under concurrent load.

Handoff's diagnostic ordering documentation matches its unchanged validator. A report containing both an invalid status and a missing revision first returned **1**, only `FIELD_ENUM`; after correcting the status, it returned **1**, `REVISION_MISSING`. Structural validity, revision existence, evidence-only successors and report-creating commits remain distinct contracts.

Coordinator names the three canonical catalog paths and keeps selection to role/optional route/cwd/name, with no native flags or model names. README accurately states the matching-daemon/gated-adapter limitations and that catalogs/root delegation are not yet integrated on this branch. SCHEMA and workflow sequencing are unchanged since the first review and retain their report ownership/validation and Coordinator-only workflow rules. No unrelated source/configuration scope expansion was found.

The reported informational trial merge's `.agents/README.md` conflict is a future integration reconciliation of competing documentation edits, not a defect in this candidate. I inspected the integration evidence; I did not repeat the merge or resolve it. Root-launcher delegation and native launched-session acceptance remain outside this review's delivered scope. The conservative Codex daemon and unsupported-adapter limitations assessed in round one are unchanged.

## Executed verification

Exact candidate skill blobs were extracted with `git archive 618ee9b .agents/skills/NAME` into `.agents/scratch/versioned-agent-skills/reviewer/round-2/NAME`. No skill/test source or fixture permission was changed. Bun is `/home/metatron/.bun/bin/bun`, version **1.4.2**.

| Command/check | Observed result |
| --- | --- |
| `bun install --frozen-lockfile` in each scratch skill | All three exit 0; skill-local dependencies only. |
| Default `bun test` in the three scratch skills, concurrently with socket access | Herdr **77 pass, 0 fail**, 428 assertions, 65.63s; handoff **24 pass, 0 fail**, 216 assertions, 13.69s; eval **59 pass, 0 fail**, 637 assertions, 11.46s. All exit 0, no timeout overrides. |
| Intentional default Herdr `bun test` without socket access | Exit 1, explicit prerequisite error in 45ms; 0 pass/1 fail/1 setup error. This negative environment check is separate from the passing suite. |
| `python3 .agents/scratch/versioned-agent-skills/reviewer/round-2/probes.py` | Exit 0; all original P1, acceptance identity/check-env, output rejection and snapshot assertions passed. |
| `git worktree add --detach .../round-2/catalog-worktree 97752643` | Exit 0; exact dependency HEAD, initially clean. |
| `python3 .../round-2/catalog-checks.py` | Exit 0; ten live role-only preparation attempts, eight pass/two documented Architect prerequisite failures; checkout snapshot unchanged. Child forms: `bun WORKER resolve --name r2check-ROLE --role ROLE --cwd D --repo D` and `bun WORKER start --name r2check-ROLE --role ROLE --cwd D --repo D --dry-run`. |
| Offline committed-catalog probes: `bun WORKER resolve --offline --name offline-r2 --role ROLE --cwd D --repo D [--route ALTERNATIVE]` | Nine exit-0 selections with `launchable: false`; coordinator undeclared override exit 2, `disallowed_route`. |
| `bun .../round-2/portable-probes.ts` | Exit 0; four expected successful preparations, two expected invalid-input failures, no launch mutations/material. Fake native config socket removed. |
| Independent handoff diagnostic-order probes | Structural error first, then missing revision after structural correction, as documented. |
| `git -C D status --porcelain`; `git worktree remove D` | Clean status; removal exit 0. No temporary catalog worktree remains. |
| `python3 .../skill-creator/scripts/quick_validate.py .agents/skills/NAME` for the three skills | Three exit-0 format validations. |
| `rg -n -i '/tmp/brainlab\|/opt/dev\|/home/metatron\|tehom\|brainlab'` over the three skills | Exit 1, no matches. |
| Model-identifier scan over the three SKILL.md/scripts; model/native-flag scan over coordinator/workflow | Each exit 1, no matches. These are bounded pattern checks. |
| `git diff --check 4e8d7d3..618ee9b` | Exit 0. |
| `git diff --exit-code d8b67cc HEAD -- docs/mailbox/versioned-agent-skills/reviewer.md` | Exit 0; first review preserved. |
| `git diff 618ee9b..HEAD --name-only` before writing this report | Only the integration-2 evidence report. |
| `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/versioned-agent-skills/reviewer-2.md` | Exit 0; required fields and all existing revision references validate before the report commit. |

Probe scripts, full JSON and logs remain in reviewer-owned round-two scratch; durable conclusions and negative evidence are recorded above. Only this new review report is committed. No source fixes, shared-document/config edits, other worker report edits, real launches, paid turns, merges, pushes or global installs were performed. Native role/skill consumption after real startup and eventual root-command integration remain unverified.
