task: versioned-agent-skills / skills-reviewer / round-3
status: complete
outcome: No material findings; Claude gate conditions remain intact and diagnostics provide an explicit declared-route remedy.
artifacts:
  - docs/mailbox/versioned-agent-skills/reviewer-3.md
verification:
  - 'Herdr candidate scratch copy: frozen install exit 0; default Bun suite 81 passed, 0 failed, 485 assertions.'
  - 'Architect preferred resolve/dry-run both fail closed with a source-specific diagnostic; explicit declared Codex alternative resolves and prepares successfully without submission.'
  - 'Installed Claude help/version and primary documentation inspected; no selective mechanism meeting the full visibility/preservation contract verified.'
  - 'Portability, format, whitespace and unchanged-file checks passed; handoff validator exit 0.'
review:
  - 'No blocking or optional findings established in the assigned round-three scope.'
discoveries:
  - 'Preferred Architect preparation remains gated by account-synced skills; the existing declared alternative is an explicit operator choice, not automatic fallback.'
blockers: []
reviewed_revision: 46689c1ea4084b5e91dd2c7c7e6ac3d11e37e866
tested_revision: 46689c1ea4084b5e91dd2c7c7e6ac3d11e37e866
source_baseline: 618ee9bb858e7e1e1941f4571facfbb93d0d547b
catalog_revision: 97752643b31cdcf8c8ec9f09204382c6766b1573
evidence_revision: 6faa3bf

Author: Reviewer (skills-reviewer). Date: 2026-10-04 UTC.

Reviewed exactly `618ee9b..46689c1ea4084b5e91dd2c7c7e6ac3d11e37e866`: Claude adapter gate explanations, their black-box tests, skill/reference documentation and the README coverage note. Only the Claude adapter changed among runtime scripts. The later `6faa3bf` changes only `implementer-integration-3.md` and is evidence, not another implementation revision. The [first review](reviewer.md) and [round-two review](reviewer-2.md) remain unchanged.

## Findings and assessment

**No material findings. No blocking or optional changes are required by this review.**

At `.agents/skills/ruach-herdr/scripts/adapters/claude.ts:28`, the worker/coordinator boundary and every existing managed-file, managed-fragment, enterprise-skill, synced-cache and linked-worktree condition remain the same. The legacy-command condition at line 59 still rejects any detected workflow command; the plugin conditions at lines 73–77 still reject uninspectable installations, unavailable paths and workflow-bearing plugins. Diagnostic helper calls replace the previous failures without introducing a successful path, suppressing a source, or changing native launch preparation.

The helper at line 13 identifies a source category and local path without copying settings, skill bodies, command text, plugin identifiers or native output. Its reasons are fixed strings. Legacy diagnostics identify the containing directory rather than the private command's filename or body; plugin diagnostics use the `enabledPlugins` field without exposing an installation ID. These path disclosures support the requested source identification. The route remedy at line 12 asks for an explicitly allowed route through another supported harness or a separately verified environment. It neither invents an alternative ID nor bypasses the existing role preference/alternative validation. Offline selection remains explicitly nonlaunchable. No automatic fallback, suppression flag, sync-setting override or persistent configuration write was added.

The added CLI-boundary tests protect observable behavior: empty and technical-only synced caches still fail for both resolve and dry-run; diagnostics identify the source and remedy; existing settings/cache bytes remain unchanged; a declared Codex alternative resolves without modifying the cache; and a private legacy instruction sentinel is absent from stdout/stderr. Existing tests continue to cover other gates, preserved native configuration, Coordinator visibility, no mutation and uncertain startup. Assertions on diagnostic category/path and remedy fragments are relevant public contracts, not private helper-call expectations. These are fake-native coverage, not proof of native launched-session catalog acceptance.

README's new coverage note matches the actual refusal behavior and explicit-route remedy. It retains the daemon prerequisite, unsupported-adapter and unperformed live-session acceptance limitations. Coordinator is unchanged and still contains no native flags or model names. Scope is limited to the assigned skill/docs and evidence reports.

## Selective per-launch mechanism assessment

I independently checked installed **Claude 2.1.289** help and the primary documentation. No verified mechanism satisfying the full assignment contract was established. This is a bounded evidence conclusion, not proof that no possible mechanism exists.

The documented sync lifecycle allows the running account inventory to change and describes cache movement when syncing is disabled; a snapshot of current cache names cannot establish future visibility. Exact-name `skillOverrides` controls visibility but excludes plugin skills. Documented Skill permission rules offer selective invocation controls, yet do not establish the complete catalog/command visibility behavior needed here for future synced names and all gated source categories. I therefore do not classify them as a verified replacement for these gates. See [synced skills](https://code.claude.com/docs/en/skills#where-synced-skills-load), [visibility](https://code.claude.com/docs/en/skills#override-skill-visibility-from-settings), and [skill access rules](https://code.claude.com/docs/en/skills#restrict-claudes-skill-access).

`--settings` can supply a per-launch sync setting, including an effective false value under documented precedence exceptions; that does not verify selective preservation or absence of cache side effects. Broad disabling/source switches also remove unrelated customizations. See [settings precedence exceptions](https://code.claude.com/docs/en/settings#exceptions-to-managed-settings-precedence) and [CLI flags](https://code.claude.com/docs/en/cli-reference). Installed help independently confirms the relevant settings/source/suppression options. None was emitted by the candidate.

The implementer's formulation, “No verified mechanism meeting all constraints was established,” is appropriately limited. No decision finding for an already verified alternative is warranted from this evidence. Native visibility experiments or an implementation change would require a separate assignment; I did not run paid turns, mutate the synced cache or modify user/managed settings.

## Live preparation evidence

A temporary detached worktree at exact catalog revision `97752643` began clean. Using the archived candidate worker and installed CLIs, Architect was selected by role alone:

- Preferred `resolve` and `start --dry-run` both exited **3**, `unverified_workflow_source`, naming **account-synced skills** and the cache directory in `diagnostics[0].field`. Both included the explicit allowed-route remedy and offline limitation, with `submission_state: not-submitted`.
- Explicit `--route gpt-6.1-sol-high` made both resolve and dry-run exit **0**, select the declared Codex/high alternative, report `launchable: true` with empty diagnostics, and remain `not-submitted`.
- `resolve --offline` exited **0**, retained the preferred Claude route, and reported `launchable: false` with the offline-unverified diagnostic.

No command automatically tried the alternative after the preferred failure. The checkout remained clean and its file contents/modification times matched the initial snapshot. The detached worktree was removed successfully. These observations verify preparation and diagnostics, not native role/skill consumption or model availability after startup.

## Commands run and results

Candidate skill blobs were extracted with `git archive 46689c1 .agents/skills/ruach-herdr` into `.agents/scratch/versioned-agent-skills/reviewer/round-3/ruach-herdr`. No source/test edits were made. Bun is `/home/metatron/.bun/bin/bun`, version **1.4.2**.

| Command/check actually executed | Result |
| --- | --- |
| `bun install --frozen-lockfile` in scratch Herdr | Exit 0; two skill-local packages installed. |
| Default `bun test` there, with required local socket access | Exit 0; **81 pass, 0 fail**, 485 assertions, 71.25s; no timeout override. |
| `claude --help`; `claude --version` | Both exit 0; installed version 2.1.289 and relevant flags inspected. Help inspection only. |
| Primary skills/settings/CLI/permissions pages | Read-only documentation inspection; no native selective replacement verified. |
| `git worktree add --detach .../round-3/catalog-worktree 97752643` | Exit 0; exact catalog revision, initially clean. |
| `python3 .agents/scratch/versioned-agent-skills/reviewer/round-3/live-checks.py` | Exit 0; all five expected preparation/diagnostic/snapshot outcomes above verified. Child forms: `bun WORKER resolve --name r3-architect --role architect --cwd D --repo D [--route gpt-6.1-sol-high]`, corresponding `start --dry-run`, and `resolve --offline`. |
| `git -C D status --porcelain`; `git worktree remove D` | Clean status; removal exit 0. |
| `rg -n -i '/tmp/brainlab\|/opt/dev\|/home/metatron\|tehom\|brainlab' .agents/skills/ruach-herdr` | Exit 1, no matches. |
| Model/native-flag scan over `.agents/agents/coordinator.md` | Exit 1, no matches. |
| `python3 .../skill-creator/scripts/quick_validate.py .agents/skills/ruach-herdr` | Exit 0, “Skill is valid!”; format evidence only. |
| `git diff --check 618ee9b..46689c1` | Exit 0. |
| `git diff --exit-code 618ee9b HEAD -- .agents/agents/coordinator.md .agents/skills/ruach-handoff .agents/skills/ruach-harness-eval` | Exit 0; unchanged. Their suites were not rerun, as assigned. |
| `git diff --exit-code e618c79 HEAD -- docs/mailbox/versioned-agent-skills/reviewer.md docs/mailbox/versioned-agent-skills/reviewer-2.md` | Exit 0; earlier review reports preserved. |
| `git diff 46689c1..HEAD --name-only` before this report | Only the integration-3 evidence report. |
| `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/versioned-agent-skills/reviewer-3.md` | Exit 0; required fields and existing revision references validated before report commit. |

Full suite output and live-probe JSON remain in reviewer-owned round-three scratch. Only this new report is committed. No production fixes, user/managed setting changes, real agent/daemon starts, paid turns, merges, pushes or global installs were performed. Preferred Claude Architect startup and a native selective visibility mechanism remain unverified; the retained fail-closed behavior is the reviewed outcome.
