task: versioned-agent-skills / skills-impl-handoff
status: complete
outcome: Portable schema-driven Bun handoff validator implemented and verified; historical leading YAML preserved and historical Markdown boundary documented.
artifacts:
  - docs/mailbox/versioned-agent-skills/implementer-handoff.md
  - .agents/skills/ruach-handoff/SKILL.md
  - .agents/skills/ruach-handoff/handoff.schema.json
  - .agents/skills/ruach-handoff/scripts/validate.ts
  - .agents/skills/ruach-handoff/tests/validate.test.ts
  - .agents/skills/ruach-handoff/package.json
  - .agents/skills/ruach-handoff/bun.lock
  - versioned-agent-skills-handoff
verification:
  - "bun test at tested_revision: exit 0; 24 tests pass, 0 fail, 216 assertions."
  - "Mailbox corpus: 15 pre-existing Markdown files checked (7 valid, 8 expected HEADER_INVALID); repeated including this report (16 checked, 8 valid, 8 expected historical failures). Full table below."
  - "Copied skill without node_modules: frozen offline install and CLI validation exit 0; lock SHA256 unchanged."
  - "Skill quick validator: exit 0, format evidence only. Scope, whitespace and portability checks passed as detailed below."
review: not-run
discoveries:
  - Bun may auto-install bare imports from its cache; the validator explicitly requires skill-local dependencies before importing them.
  - Existing leading YAML reports contain single-key string mappings in narrative lists; the schema intentionally preserves this compatibility.
  - Earlier experiment documents start with Markdown headings and are outside the leading-block format; they were not rewritten.
blockers: []
implementation_revision: 0dfb52f320ad01ee86af3d0f4b76a587a3f2237b
tested_revision: 0dfb52f320ad01ee86af3d0f4b76a587a3f2237b
source_baseline: 62d7ac705b04d4e039112228775f6052a6f8da64

Author: Implementer. Date: 2026-10-04 UTC. Implementation is committed on the assigned branch. This report is written against the existing implementation/tested revision before its own evidence-only recording commit; the recording SHA is returned in the terminal handoff. No independent review, integration, merge, remote push, global installation, or semantic acceptance is claimed.

## Changes and decisions

Extended the existing [handoff skill](../../../.agents/skills/ruach-handoff/SKILL.md) compatibly with the CLI, neutral starting template, format boundary, revision roles, stable diagnostic codes and exit contract. Added [validator](../../../.agents/skills/ruach-handoff/scripts/validate.ts), [schema](../../../.agents/skills/ruach-handoff/handoff.schema.json), [CLI tests](../../../.agents/skills/ruach-handoff/tests/validate.test.ts), and skill-local package/lock files. YAML 2.9.1 provides strict parsing and duplicate-key detection; Ajv 8.20.0 directly applies the shipped schema. All transitive versions/integrities are locked. There are no imports across skill directories.

The required task/status/outcome/artifacts/verification/discoveries/blockers fields retain the existing statuses: `complete`, `blocked`, `needs-decision`, `failed`. Narrative arrays also accept existing single-key string mappings; artifacts remain strings. Additional role metadata is accepted. Bare leading YAML ends at the first blank line; delimited `---` YAML, BOM and CRLF are additive compatibility options. Malformed headers/YAML, duplicate keys, unsupported tags and invalid field types produce stable field/path diagnostics and nonzero exits. JSON output uses `schema_version: 1`; report claims and supplied values are not echoed in diagnostics.

Git checks all top-level revision/baseline fields (suffix `_revision`/`_baseline`, bare `revision`/`baseline`, plus historical `destination_before`). Explicit `--repo` wins; otherwise discovery starts at the real report directory, including linked worktrees, and ignores inherited Git environment selectors. Commit-resolving refs/tags are accepted; noncommit objects and missing references fail. The CLI uses argv arrays without shell interpolation. Revisions embedded only in prose/artifact strings are not interpreted; writers must use revision fields.

Exit codes follow the Architect design: 0 valid and references resolved; 1 invalid report/missing commit; 2 usage/input/dependency/schema/repository/Git setup error. No revision role equality or ancestry requirement is imposed. Existing evidence-only successors are legitimate, and an uncommitted report can reference its existing tested revision without predicting its own creating SHA. Mechanical validation neither executes checks nor verifies semantic truth, artifact existence, review, or acceptance.

No material design deviation. Optional delimited YAML and the documented narrative mapping compatibility extend syntax without rewriting existing reports. Existing status semantics and handoff rules remain intact.

## Exact verification

Commands below ran with Bun 1.4.2. Root is the assigned worktree; skill cwd is `.agents/skills/ruach-handoff` where specified.

| Command | Cwd | Actual result |
| --- | --- | --- |
| `/home/metatron/.bun/bin/bun install --cache-dir ../../scratch/handoff-bun-cache` | Skill | Exit 0; pinned YAML/Ajv and four transitive packages installed; lockfile generated. |
| `/home/metatron/.bun/bin/bun install --frozen-lockfile --offline --cache-dir ../../scratch/handoff-bun-cache` | Skill | Exit 0; six installs checked, no changes. |
| `/home/metatron/.bun/bin/bun test` | Skill | Final run at `tested_revision` exit 0; 24 pass, 0 fail, 216 assertions, 17.96 seconds. |
| `/home/metatron/.bun/bin/bun .agents/scratch/handoff-corpus.ts` | Root | Exit 0 for driver on both runs (15 pre-existing files, then 16 including this report); each report's separate validator exit and diagnostic tabulated below. Driver enumerates with `rg --files docs/mailbox -g '*.md'` and invokes `bun .agents/skills/ruach-handoff/scripts/validate.ts REPORT`. |
| `/home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/versioned-agent-skills/implementer-handoff.md` | Root | Exit 0; required fields valid and all three existing implementation/tested/baseline references resolve before the report's creating commit exists. |
| `PATH=/home/metatron/.bun/bin:$PATH python3 .agents/scratch/handoff-portability.py` | Root | Exit 0; dependency-free copy in isolated temporary directory, frozen offline install exit 0, copied CLI from unrelated `/tmp` cwd exit 0, copied lock unchanged; temporary copy removed. |
| `python3 /home/metatron/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/ruach-handoff` | Root | Exit 0, `Skill is valid!`; format evidence only. |
| `git diff --check 62d7ac7..HEAD` | Root | Exit 0 at implementation revision; no whitespace errors. |
| `git diff --exit-code 62d7ac7..HEAD -- docs/mailbox` | Root | Exit 0 before this report; every existing report unchanged. |
| `rg -n -e /tmp/brainlab -e tehom -e brainlab -e /home/metatron -e /opt/dev .agents/skills/ruach-handoff` | Root | Exit 1, no matches (successful absence check); no caller-specific/repository-name paths in reusable skill. |
| `git diff --stat 62d7ac7..HEAD` | Root | At implementation revision, exactly the six owned skill files, 504 insertions; full output below. |

Scratch drivers/results are retained locally in `.agents/scratch/handoff-corpus.{ts,json}`, `.agents/scratch/handoff-portability.{py,json}`, and the isolated dependency cache; durable findings are reproduced here. Initial sandboxed dependency installation failed with EROFS, and the first cache-only attempt lacked manifest metadata. Installation succeeded with a workspace-local cache under authorized escalation. The first test run exposed Bun's cached import behavior (23 pass/1 fail); the local-dependency prerequisite fixed it, followed by a 24/0 run and the final committed 24/0 run. No auto-review rejection or unresolved setup failure remains.

CLI coverage includes all four statuses, missing/invalid status and each required field, malformed/missing headers, syntax/type/duplicate-key failures, unsupported tags, schema parity and optional metadata, neutral verification/review defaults, actual temporary Git repos, report-directory inference with unrelated caller/Git environment, a linked worktree with distinct HEAD, explicit repository selection, missing commits/noncommit objects, all revision roles, evidence-only successor, and report-before-creating-commit. Help/usage, unreadable input, missing Git, absent local dependencies and copied-skill execution are also exercised.

## Existing mailbox corpus

All 15 pre-existing `docs/mailbox/**/*.md` files (including the directory README) were checked; 7 pass and 8 fail exactly at the intentional leading-block boundary. The historical failures are expected format results, not unresolved new-handoff failures. No historical report was changed.

The repeated corpus run also includes this new handoff, for 16 files: 8 valid and 8 expected historical-format failures.

| Report | Validator exit | Result |
| --- | --- | --- |
| `docs/mailbox/README.md` | 1 | `HEADER_INVALID`; Markdown directory index |
| `docs/mailbox/claude-architect-injection/architect.md` | 1 | `HEADER_INVALID`; historical Markdown experiment |
| `docs/mailbox/codex-architect-injection/architect.md` | 1 | `HEADER_INVALID`; historical Markdown experiment |
| `docs/mailbox/orchestrator-comparison/assignment.md` | 1 | `HEADER_INVALID`; historical Markdown assignment |
| `docs/mailbox/orchestrator-comparison/results.md` | 1 | `HEADER_INVALID`; historical Markdown results |
| `docs/mailbox/orchestrator-four-harness/assignment.md` | 1 | `HEADER_INVALID`; historical Markdown assignment |
| `docs/mailbox/orchestrator-four-harness/observer-source.md` | 1 | `HEADER_INVALID`; historical Markdown observer note |
| `docs/mailbox/orchestrator-four-harness/results.md` | 1 | `HEADER_INVALID`; historical Markdown results |
| `docs/mailbox/p01-browser-harness/coordinator.md` | 0 | Valid; eight supplied revision fields resolve |
| `docs/mailbox/p01-browser-harness/delivery.md` | 0 | Valid; nine supplied revision/baseline fields resolve |
| `docs/mailbox/p01-browser-harness/implementer.md` | 0 | Valid; three supplied revision/baseline fields resolve |
| `docs/mailbox/p01-browser-harness/reviewer.md` | 0 | Valid; six supplied revision/baseline fields resolve |
| `docs/mailbox/p01-browser-harness/scout.md` | 0 | Valid; no declared revision fields |
| `docs/mailbox/p01-browser-harness/verification.md` | 0 | Valid; one tested revision resolves |
| `docs/mailbox/versioned-agent-skills/architect.md` | 0 | Valid; one baseline resolves |
| `docs/mailbox/versioned-agent-skills/implementer-handoff.md` | 0 | Valid; implementation/tested/baseline references resolve |

## Scope evidence and limits

`git diff --stat 62d7ac7..HEAD` at `implementation_revision`:

```text
 .agents/skills/ruach-handoff/SKILL.md              |  86 ++++++++
 .agents/skills/ruach-handoff/bun.lock              |  26 +++
 .agents/skills/ruach-handoff/handoff.schema.json   |  42 ++++
 .agents/skills/ruach-handoff/package.json          |   8 +
 .agents/skills/ruach-handoff/scripts/validate.ts   | 122 ++++++++++++
 .../skills/ruach-handoff/tests/validate.test.ts    | 220 +++++++++++++++++++++
 6 files changed, 504 insertions(+)
```

The subsequent recording commit adds only this assigned report. No changes to other skills, roles, workflows, root commands/configuration, routing files, shared docs, earlier reports, main checkout or other worktrees. No integration/merge assigned or performed.

Coverage is actual Bun/Git CLI execution on Linux with fixture repositories and this historical corpus, plus the copied-skill frozen install. Other operating systems/Bun versions and independent review are not-run. No live harness, model request, paid evaluation, report-truth check, or automatic check execution is claimed. Required checks passed; no blocker remains.
