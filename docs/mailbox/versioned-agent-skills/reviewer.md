task: versioned-agent-skills / skills-reviewer
status: complete
outcome: Review completed; candidate requires one blocking Git-environment isolation fix before acceptance.
artifacts:
  - docs/mailbox/versioned-agent-skills/reviewer.md
verification:
  - 'Frozen installs: all three candidate skill copies exited 0.'
  - 'Final suites: Herdr 50 passed; handoff 24 passed with increased timeout; eval 49 passed with candidate fixture permissions.'
  - 'Independent probes: reproduced false clean scope pass and checkout mutation under inherited Git overrides; invalid worker/report probes failed correctly.'
  - 'Format validators and candidate whitespace check passed; portability grep found no prohibited workspace paths.'
review:
  - 'One blocking P1 finding and one optional test-portability improvement; no production files changed.'
discoveries:
  - 'Inherited GIT_DIR and GIT_WORK_TREE redirect eval probes away from the explicitly selected checkout.'
  - 'Installed OMP exposes read-only settings and exact model resolution APIs worth investigating; complete adapter preservation remains unverified.'
blockers:
  - 'P1: isolate evaluator Git probes from inherited repository overrides and verify the requested checkout output boundary.'
reviewed_revision: 4e8d7d30fb57a033b5c4378aeec2fae7aaf209bd
tested_revision: 4e8d7d30fb57a033b5c4378aeec2fae7aaf209bd
source_baseline: 62d7ac705b04d4e039112228775f6052a6f8da64
evidence_revision: 87e1ff0

Author: Reviewer (skills-reviewer). Date: 2026-10-04 UTC.

Reviewed exactly `62d7ac705b04d4e039112228775f6052a6f8da64..4e8d7d30fb57a033b5c4378aeec2fae7aaf209bd`: the three skills, their tests/resources, Coordinator and related workflow guidance, README/SCHEMA changes, and implementation reports. The design-only baseline follows `c6083e8`. Current HEAD `87e1ff0` differs from the candidate only by `docs/mailbox/versioned-agent-skills/implementer-integration.md`; that report is evidence, not another reviewed implementation. The initial working tree was clean.

## Findings, ordered by severity

### Blocking P1 — Git overrides defeat explicit repository selection and the no-mutation boundary

Location: `.agents/skills/ruach-harness-eval/scripts/common.ts:67`, with repository discovery at line 72 and output protection at line 113. Both evaluator entry points use this helper.

Problem: evaluator Git processes inherit all of `process.env`. `git -C REPO` does not override inherited `GIT_DIR`/`GIT_WORK_TREE`. Consequently `root()` can substitute another checkout for the requested one. Every later revision, diff, dirty-state and output-boundary probe then uses the substituted root.

Failure scenario and executed evidence: create separate repositories A and B, leave A dirty with untracked `unexpected`, and keep B clean. With an empty v1 allowance, normal `scope-check --repo A --baseline HEAD --candidate HEAD --allow allow.json` exits **1**, reports `unexpected_paths` and `dirty_worktree`, and preserves A's file contents and modification times. Repeat with `GIT_DIR=B/.git GIT_WORK_TREE=B`: the same explicit `--repo A` invocation exits **0**, reports `ok: true`, empty diagnostics and dirty records, and returns B's HEAD (`d0dc81c3de677d6840a828427e1b936477dfcbb0`) instead of A's (`b195c8b7553bcde0d05a1cff814b65f99da254d4`). Adding `--output A/forbidden-evidence.json` also exits **0** and actually creates that file inside the requested checkout. The output guard protects B, not A.

Why it matters: evaluation can certify the wrong candidate and miss scope violations. Scope-check's stated no-worktree-mutation guarantee is also broken by its own evidence writer. Git-related environment variables occur in hooks and nested repository tooling; the public interface does not require callers to clear them. Acceptance shares the defective root selection, although its corresponding false-pass scenario was not independently executed.

Suggested direction: isolate internal Git probes from inherited repository-discovery overrides, using the same principle already implemented in handoff's validator. Preserve the checks' intentionally configurable environment separately. Verify repository identity and guard output against the explicitly selected checkout and its actual Git metadata. Add a CLI regression using two different repositories, inherited Git overrides, a dirty requested checkout, and an output path inside that checkout; require correct dirty evidence, rejected output, and unchanged files/index/metadata.

Reproducer and full JSON are retained locally at `.agents/scratch/versioned-agent-skills/reviewer/probes.py`, `probes.json`, and `scope-output-redirect.json`; all repositories in this reproduction are reviewer-owned scratch fixtures. The report above preserves the durable evidence.

### Optional P3 — Cross-checkout fingerprint test assumes matching permission masks

Location: `.agents/skills/ruach-harness-eval/tests/eval.test.ts:22` and line 67.

Problem and scenario: the test copies the source fixture into one repository, clones that repository into another, and assumes the fixture hashes match. The evaluator deliberately hashes full permission modes, but Git preserves only executable versus non-executable mode. A source copied as `0644` and a clone created under this session's `0002` umask as `0664` are different evaluator fixtures despite identical Git content.

Evidence: exact candidate archives extracted with the fixture at `0644` produced **48 passed, 1 failed** twice, specifically the fingerprint assertion; both evaluations themselves passed. Matching the scratch fixture to the candidate checkout's actual `0664` mode produced **49 passed, 0 failed**. No evaluator logic or test source was changed. This is an incidental test assumption, not evidence that mode-sensitive hashing is wrong; the reference contract explicitly says modes affect fingerprints.

Why it matters: a copied skill's documented `bun test` can fail depending on extraction and checkout umasks, without a behavior regression.

Suggested direction: make both test input fixtures use the same explicitly chosen mode before asserting equal fingerprints. Keep separate coverage that different modes produce different hashes; preserve runtime mode evidence.

No additional blocking findings were established.

## Answers to the assigned questions

- **Codex daemon prerequisite:** acceptable as a clearly documented, fail-closed prerequisite for this bounded candidate, with a practical usability cost. It is stated in SKILL.md and adapter references. An independent fake-native `resolve` probe with no daemon returned exit **3**, `codex_config_unavailable`, `submission_state: not-submitted`, no pane and no launch files. The reader checks running status, version equality and local socket shape, and only initializes the connection and calls config/catalog reads. Composing effective developer text and skill overrides avoids manually approximating layered TOML. Installed help and the [primary app-server contract](https://developers.openai.com/codex/app-server/) support the native read approach; I did not establish a simpler non-mutating standalone alternative. This is not evidence that ordinary machines already have the daemon or that its native launch behavior is accepted. No real daemon was started.
- **OMP/Agy gating:** current failure-only behavior is explicit and truthful, and no speculative argv or substitute harness is emitted. Agy's installed help has agent/model/effort options but does not establish additive role injection and selective workflow hiding. OMP's installed `18.1.18` `src/cli/config-cli.ts:244` does initialize normal persistent settings, supporting the CLI-reader concern. However `src/config/settings.ts:594` exposes `Settings.loadReadOnly`, and `src/config/model-resolver.ts:1992` attempts exact model selection before fuzzy matching. Thus the capability investigation is incomplete; these APIs are concrete leads, not evidence of a finished safe adapter. Their imports, effective catalog discovery, legacy settings behavior, APPEND_SYSTEM preservation, overlay semantics and exact route identity have not been verified together. Keep gating until that contract is established; describe it as incomplete verification rather than impossibility. I do not classify conservative gating as a blocker under the permitted, honestly documented fixture-only coverage.
- **Size/complexity:** proportional to the requested contracts. Added runtime is approximately 1,190 lines across three independent skills, with tests and reports contributing substantially to the 2,573-line diff. There is no shared orchestration runtime, launcher in handoff/eval, retry loop, watcher or benchmark service. Routing knowledge stays in one file; adapter stubs only enforce unsupported capability results. Skill entry points are short and resources have concrete uses. No material removable framework machinery was found.
- **Schema/validator and revision semantics:** the JSON schema is actually compiled and used as the structural oracle, so accepted parsed data follows that schema. Git resolvability is an intentionally separate operational constraint, not expressible as ordinary JSON Schema. Required fields, enums, non-whitespace narratives, compatible legacy mappings, duplicates/tags, report-local worktree discovery and explicit repository override are covered. All matching revision fields resolve existing commits without equality/ancestry requirements. Evidence-only successors are correctly distinct from tested/reviewed revisions, and reports need not predict their creating SHA. The historical Markdown-first boundary is documented and historical reports remain unchanged. No material finding here.
- **Scope no-mutation / acceptance negative evidence:** normal scope probes preserved scratch checkout bytes and modification times; the suite also covers index, metadata and submodules. The inherited-Git case violates the guarantee as demonstrated above and must be fixed. Acceptance retains check output, failure diagnostics, timeouts, truncated-output failures and later checks after earlier failure; fresh output paths use exclusive creation and preserve previous evidence. Those suite checks passed. This is mechanical evidence validation, not certification of report truth or actual model use.

The [primary Claude skills contract](https://code.claude.com/docs/en/skills#override-skill-visibility-from-settings) confirms name-based visibility settings and the plugin exception reflected by the adapter's gates. Native prompt/catalog acceptance after real startup remains unverified.

## Verification commands and results

All candidate blobs came from `git archive 4e8d7d30fb57a033b5c4378aeec2fae7aaf209bd .agents/skills/NAME`, extracted beneath `.agents/scratch/versioned-agent-skills/reviewer/NAME`. This obeyed source ownership and avoided dependency writes in production skill directories. Scratch permissions were the only adjustments; the final eval fixture used the actual candidate checkout's `0664` permissions. Bun: `/home/metatron/.bun/bin/bun`, version **1.4.2**.

| Commands actually executed | Result |
| --- | --- |
| `bun install --frozen-lockfile` in each of the three scratch skills | All exit 0; Herdr yaml/ws and handoff ajv/yaml installed locally; eval has no dependencies. |
| `bun test` in scratch Herdr | **50 pass, 0 fail**, 266 assertions; exit 0, 85.44s. Includes a real wall-clock timeout against fake startup. |
| Initial `bun test` in scratch handoff, alongside the other suites | **22 pass, 2 fail**, exit 1; two multi-probe tests exceeded Bun's default 5s timeout and their child output was interrupted. Negative evidence retained. |
| `bun test --timeout 20000` in scratch handoff | **24 pass, 0 fail**, 216 assertions; exit 0, 23.63s. |
| Initial `bun test` and repeat with `0644` fixture in scratch eval | Both **48 pass, 1 fail**, exit 1; permission-dependent fingerprint assertion described in P3. |
| `chmod 664 tests/fixtures/task.ts` in scratch eval, then `bun test` | **49 pass, 0 fail**, 436 assertions; exit 0, 8.16s. Candidate source left untouched. |
| `python3 .agents/scratch/versioned-agent-skills/reviewer/probes.py` | Exit 0; dirty scope exit 1 without mutation; redirected scope false pass exit 0; malformed/missing-field/missing-revision handoffs exit 1 with specific diagnostic paths; present DSH unsupported-kind and missing DSH executable both exit 3 without worker mutation. |
| Independent fake-native no-daemon Codex `worker.ts resolve` | Exit 3, `codex_config_unavailable`, no mutation. |
| Independent redirected `scope-check` with output inside requested checkout | Exit 0 and creates output inside checkout, reproducing P1's no-mutation violation. |
| `python3 .../skill-creator/scripts/quick_validate.py .agents/skills/NAME` for all three names | Three exit-0 “Skill is valid!” results; format evidence only. |
| `rg -n '/tmp/brainlab\|/opt/dev\|/home/metatron\|tehom\|brainlab' .agents/skills/ruach-{herdr,handoff,harness-eval}` | Exit 1, no matches. No prohibited workspace assumptions found in the skills. |
| `git diff --check 62d7ac7..4e8d7d3` | Exit 0. |
| `git diff --stat 62d7ac7..4e8d7d3`; inspected related docs diffs and `git diff 4e8d7d3..HEAD --name-only` | Candidate scope is confined to the requested skills, related role/workflow/docs and reports; later commit is evidence only. Coordinator has no native flags or model names; role boundaries and workflow sequencing are preserved. Eval has explicit-only invocation metadata. |
| Installed `codex app-server --help`, `codex app-server daemon --help`, and `agy --help`; read installed OMP sources | Help/source inspection only. Codex commands warned of blocked PATH-alias writes. Attempted `codex app-server daemon version` could not access the existing socket under sandbox and exited 1; no live daemon result is claimed. |
| `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/versioned-agent-skills/reviewer.md` | Exit 0; leading fields and existing revision references validated before report commit. |

Logs and probe JSON are retained only under reviewer scratch. No real Herdr agent starts, paid turns, native launched-session acceptance, merges, pushes or global installs were performed. No source, skill, test, shared documentation, YAML configuration, main checkout or other worktree was edited. Only this durable report will be committed. The remaining native behavior and eventual canonical YAML integration are unverified, as documented by the candidate.
