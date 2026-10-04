task: skills-reviewer-main
role: reviewer
status: complete
outcome: Independent review completed with no material findings against the assigned combined revision.
artifacts:
  - docs/mailbox/versioned-agent-skills/reviewer-main.md
reviewed_revision: 8ea1c677e88b4c0d9b96646719836cae721c3454
tested_revision: 8ea1c677e88b4c0d9b96646719836cae721c3454
baseline: 97752643b31cdcf8c8ec9f09204382c6766b1573
evidence_revision: e4b1dd9
verification:
  - "Frozen installs: all three skills passed in an exact candidate export under OS temp."
  - "Default suites: root 13, Herdr 107, handoff 24, evaluator 59 passed; 203 total, zero failures in final runs."
  - "Root probes: 16 passed; native resolve/dry-run matrix: 18 passed with no submissions."
  - "Temporary-HOME links: six probes passed; independent adversarial preparation and positive/negative scope probes passed."
  - "Protected-path and historical-report comparisons passed; CURRENT/TASK_LOGS preserve baseline bytes as a prefix."
  - "Own handoff validator: exit 0, ok true, four revisions resolved, empty diagnostics."
review:
  - No material findings; no blocking or optional findings requiring an implementation change.
discoveries:
  - "Native Codex no-daemon preparation succeeded through stdio with temporary HOME/CODEX_HOME; user configuration was isolated from this review."
  - "Restricted sandbox denies local sockets and Bun subprocess stdin flush; approved verification runs enabled those capabilities."
blockers: []

# Independent review of combined versioned skills

Reviewed exactly `git diff 97752643b31cdcf8c8ec9f09204382c6766b1573..8ea1c677e88b4c0d9b96646719836cae721c3454`: three portable skills, root routing delegation and policy checks/tests, Coordinator guidance and related documentation/evidence. Inspected relevant routing catalogs, canonical roles, adapters, native readers, validators, evaluation scripts and their tests. Also consumed the [integration handoff](integration-main.md), [Claude contract evidence](implementer-herdr-contract.md), [Codex permission evidence](implementer-herdr-codex-permissions.md), and prior review reports for context; their claims were not substituted for independent runs.

The assigned worktree initially had clean tracked state at evidence-only successor `e4b1dd9`. That successor changes only CURRENT, TASK_LOGS and integration-main.md. All 45 tracked files belonging to the three new skills and root implementation/tests were byte-compared with both the reviewed commit and its temporary export: identical. Skill suites therefore exercised the exact assigned revision; the root suite exercised identical executable/test content in the assigned worktree. This report does not claim to review implementation changes after the assigned revision.

## Findings

**No material findings.** No blocking findings or optional code changes are requested.

The root surface remains `justfile → bin → scripts`; its Python wrapper validates repository policy, delegates once using subprocess argv and preserves worker streams/exits. Routing selection, native flags, role composition, capability checks and pane operations have one owner inside ruach-herdr. Root launches pass portable auto-review policy; adapter mappings use Claude automatic review and Codex approve-for-me, and conflicting native permission flags fail. Deliberate compatibility changes (offline root resolve, JSON shape, retired pane selection and safe names) are documented.

Claude preparation appends the canonical role, supplies targeted known-workflow overrides and preserves unrelated settings. The preferred Architect route prepares successfully. Neither adapter injects workflow bodies into worker instructions. Codex uses native effective configuration and retains prior developer text and unrelated skill overrides; both the fixture suite and this review's real isolated native preparation exercised the no-daemon stdio fallback. Missing/unverified adapters fail before launch mutation. The validator uses its shipped schema, retains neutral defaults and checks existing revision references; default tests cover parity and revision distinctions. Evaluation is explicit-only and absent from daily Coordinator guidance. Its scope script rejects negative evidence and protected changes without altering the worktree/index.

## Independent verification

Bun resolved to `/home/metatron/.bun/bin/bun`, version 1.4.2. OS-temp scratch root was `/tmp/ruach-reviewer-main-r8zho6z0` (abbreviated `S` below); `R` is the assigned worktree. Created `S/candidate` using `git archive 8ea1c677e88b4c0d9b96646719836cae721c3454`, preserving committed source bytes. No root Bun package/workspace exists; the root's default verification is its Python suite.

| Exact command / cwd | Final result |
| --- | --- |
| `/home/metatron/.bun/bin/bun install --frozen-lockfile`, in each `S/candidate/.agents/skills/{ruach-herdr,ruach-handoff,ruach-harness-eval}` | All exit 0; pinned skill-local dependencies installed, evaluator has no external dependencies |
| `bin/test-agent-routing -v`, in `R` | Exit 0; 13 tests, 6.566s |
| `/home/metatron/.bun/bin/bun test`, in exported ruach-herdr | Exit 0; 107 pass, 753 assertions, 109.51s |
| `/home/metatron/.bun/bin/bun test`, in exported ruach-handoff | Exit 0; 24 pass, 216 assertions, 13.06s |
| `/home/metatron/.bun/bin/bun test`, in exported ruach-harness-eval | Exit 0; 59 pass, 637 assertions, 15.20s |
| `python3 S/probes.py`, in `R` | Exit 0; 16 root probes and six temporary-HOME link probes |
| `python3 S/native-probes.py`, in `R` | Final exit 0; 18 real native preparations, unchanged Herdr pane/agent identities |
| `/home/metatron/.bun/bin/bun S/adversarial.ts`, with external temporary fixture environment | Final exit 0; argv/config/workflow/permission checks described below |
| Exported `scripts/scope-check.ts --repo . --baseline 97752643 --candidate 8ea1c677e88b4c0d9b96646719836cae721c3454 --allow S/scope-allow.json` | Exit 0; 74 changed paths, clean worktree, expected branch, no unexpected/protected paths or diagnostics |
| Same scope command with `S/scope-negative-allow.json` additionally protecting `scripts/agent-routing.py` | Expected exit 1; `protected_changes` diagnostic |
| `git diff --check 97752643..8ea1c67` | Exit 0 |

Initial environment/setup failures were investigated separately from candidate correctness. `.agents` was mounted read-only: scratch creation failed and in-place Herdr/handoff installs failed to link YAML (`EEXIST`); a clean exact export under OS temp installed successfully. An initial test orchestration could not save its logs in that read-only scratch location and is not counted as verification. Restricted Herdr testing failed immediately on its socket prerequisite (`EPERM`); the approved socket-capable run passed without skips. Independent fake stdio probes also encountered restricted Bun stdin flush (`EPERM`), then passed in the approved environment. Early helper attempts needed externally supplied fixture environment and a fresh private materialization directory. The first real native matrix stopped because the temporary CODEX_HOME directory did not yet exist; creating that fixture prerequisite and rerunning all 18 cases succeeded. No production fix or test assertion change was made for these setup issues.

### Root and native matrix

Root probes used `just agent-routing resolve ROLE` for all five preferences and each of four declared alternatives. All nine returned the catalog-selected kind/model/effort, `permissions: auto-review`, offline action, empty argv and `launchable: false`. Negative commands and observed exits:

```sh
bin/agent-routing resolve unknown                                      # 2
bin/agent-routing resolve coordinator --route gpt-6.1-sol-high          # 2
bin/agent-routing resolve scout --unknown-option                       # 2
bin/agent-routing start scout check-worker --pane existing-pane         # 1, rejected before start
BUN_BIN=S/missing-bun bin/agent-routing resolve scout                    # 1, no fallback
```

Also resolved through the real root entrypoint from `/tmp` using `--root R`, and with `--root` pointing to a symlink whose name contained spaces, quotes and literal shell metacharacters. Both passed, with canonical checkout realpath. The root suite separately verifies exact startup delegation, stream/exit propagation and one call/no retry using a fake Bun; no real root start was performed.

The native helper used the copied exact worker with canonical `--repo R --cwd R`, unchanged Herdr context/socket, and temporary HOME, CODEX_HOME and CLAUDE_CONFIG_DIR. Native runtime initialization remained under `S/native-home`; no account settings or global links were changed. Each row ran both:

```sh
bun S/candidate/.agents/skills/ruach-herdr/scripts/worker.ts resolve --name review-check-ROLE --role ROLE --repo R --cwd R --permissions auto-review
bun S/candidate/.agents/skills/ruach-herdr/scripts/worker.ts start --dry-run --name review-check-ROLE --role ROLE --repo R --cwd R --permissions auto-review
# Alternative rows add --route ROUTE.
```

| Role | Route | Kind / reader | Resolve / dry-run |
| --- | --- | --- | --- |
| coordinator | preferred claude-opus-5.5-high | Claude / n/a | 0 / 0 |
| architect | preferred claude-opus-5.5-high | Claude / n/a | 0 / 0 |
| architect | alternative gpt-6.1-sol-high | Codex / stdio | 0 / 0 |
| scout | preferred gpt-6.1-sol-high | Codex / stdio | 0 / 0 |
| scout | alternative claude-opus-5.5-high | Claude / n/a | 0 / 0 |
| implementer | preferred gpt-6.1-sol-high | Codex / stdio | 0 / 0 |
| implementer | alternative claude-opus-5.5-high | Claude / n/a | 0 / 0 |
| reviewer | preferred gpt-6.1-sol-high | Codex / stdio | 0 / 0 |
| reviewer | alternative claude-opus-5.5-high | Claude / n/a | 0 / 0 |

Native versions reported were Claude 2.1.289 and Codex 0.160.0. All 18 final results were launchable, `not-submitted`, with empty diagnostics and no private launch directory. Both automatic-review mappings appeared in their adapter argv. Known repository workflow suppression appeared for workers and not Coordinator. Before/after `herdr pane layout --current` and `herdr agent list` snapshots had identical pane IDs and agent name/pane identities. No pane, real agent, prompt, model turn or paid session was created.

### Adversarial and portability checks

Independent adapter preparation used fake CLIs, a temporary checkout and extra directory containing spaces, Unicode and literal `$()`/backticks, and seven protected fixture files. Claude materialized only its technical skill link and workflow visibility overlay; traversing every generated file, including linked technical content, found no workflow-body sentinel. Its appended role path and trailing pass-through argv retained exact bytes. Codex fake stdio preserved project-layer developer instructions followed by canonical role and a disabled unrelated skill entry. Both adapters rejected conflicting native permission flags under auto-review. The seven canonical role/config/skill files had identical bytes before/after. Recorded RPCs were exclusively initialize, initialized, config/read and skills/list. Default Herdr tests additionally cover reader cleanup/deadlines, daemon preference/fallback, malformed catalogs, unavailable adapters, native argument rejection, private modes, uncertainty and one submission with fakes.

Created links for all three exported skills under a fresh `S/link-home/.agents/skills`. Through those links, ran worker help, validator help, both evaluator helps, offline Architect resolution and integration-handoff validation from the unrelated temporary HOME. All six passed; offline output remained unlaunchable. No actual global installation occurred.

### Scope, docs and evidence preservation

The explicit positive scope allow-list covered only the three new skill directories, versioned-agent-skills mailbox, the two root Python files, Coordinator/agent README/workflow guidance, SCHEMA/navigation, routing operations and appended status documents. Protected entries covered P01/P02/prototypes, shared/tools/assets, plans/playtests/ADRs, earlier routing/P01/P02 mailboxes, routing catalogs, bin/justfile, root README and harness guidance. Scope was run before creating this report, and did not alter the worktree/index. The negative run confirmed protection overrides an allowance.

Executed `git diff --exit-code 97752643 8ea1c67 -- 'poc-*' shared tools assets docs/prototypes docs/plans docs/playtests docs/adr docs/mailbox/p01-browser-harness docs/mailbox/p02-formation-algebra docs/mailbox/routing-p02 docs/mailbox/agent-routing .agents/models.yaml .agents/routing.yaml .agents/roles.yaml bin justfile AGENTS.md CLAUDE.md README.md`: exit 0, empty diff. Independently enumerated all 33 mailbox files existing in baseline `97752643` and compared each against the candidate; none changed. CURRENT and TASK_LOGS candidate bytes begin with their entire baseline contents. This establishes append-only preservation, not correctness of unexecuted historical claims.

Executed `rg -n` scans for native flag/config/model construction in `scripts/agent-routing.py`, and model names/native flags in `.agents/agents/coordinator.md`; no matches (exit 1). Scanned the three new skills, excluding node_modules and lockfiles, for hard-coded repository/user paths and repository model names; no matches (exit 1). Root policy constants are confined to the repository wrapper; portable runtime routing reads catalog data. Documentation preserves Coordinator-only workflow execution, separates mechanical validation from acceptance, and links the skill/navigation/schema consistently. The evaluator remains explicitly excluded from daily launch/coordination guidance.

## Limits and handoff

No live startup, model entitlement, paid turn, task execution, native role acceptance, or complete account/plugin/managed/legacy skill-catalog visibility was tested. Those remain the documented limits rather than startup prohibitions. Native preparation here used isolated harness settings; preservation of customized layered configuration and the daemon path are independently established by fake-boundary tests, not a live customized-account session. No P01/P02 browser/full prototype rerun was performed because those protected bytes did not change. No benchmark or multi-run acceptance evaluation was requested; evaluator default suites and direct positive/negative scope invocations were run.

Executed `/home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/versioned-agent-skills/reviewer-main.md --repo .`: exit 0, `ok: true`, all four revision references resolved and empty diagnostics. `git diff --check` passed; pre-commit status contained only this untracked report.

Only this assigned report is changed/committed by the reviewer. Master, other worktrees, source/tests/config, historical reports, account settings and persistent global links are unchanged; no push occurred. Mechanical validation checks this report's schema and existing revision references, not review acceptance. The report-creating commit is returned after it exists, separately from the reviewed/tested implementation revision.
