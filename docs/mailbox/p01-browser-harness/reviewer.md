task: P01 independent review
status: complete
outcome: No material findings. Evidence supports criteria 1–7 for the scoped candidate; recommend acceptance of P01. Review completion does not establish acceptance, merge, or delivery.
artifacts:
  - docs/mailbox/p01-browser-harness/reviewer.md
  - docs/mailbox/p01-browser-harness/implementer.md
  - docs/mailbox/p01-browser-harness/verification.md
  - .agents/scratch/p01-review/browser.json
  - .agents/scratch/p01-review/dev.png
  - .agents/scratch/p01-review/preview.png
  - .agents/scratch/p01-review/cli.json
verification:
  - Independently executed root Docker install/typecheck/test/build on exact candidate: all exit 0; two Vitest tests pass.
  - Independent sandbox-enabled Chrome dev/preview checks and visual screenshot inspection passed; no application errors, exceptions/rejections, backend requests, or missing local assets.
  - Independent filters, pure import, prerequisite failures, six-recipe argument/exit probes, runtime/port/mount/ownership and scope checks passed.
  - Reused inspected clean-reinstall and deliberate false-assertion evidence at unchanged application predecessor; did not edit tests.
discoveries:
  - Candidate successor changes only evidence and factual documentation; executable/configuration/test/runtime content equals the Implementer's tested revision.
  - Actual Vitest worker and dev/preview server processes execute Bun; no separate Node compatibility exception is needed.
blockers: []
candidate_revision: a359fc53e9b77e6236943fd9667f4c0260d78601
reviewed_revision: a359fc53e9b77e6236943fd9667f4c0260d78601
independently_tested_revision: a359fc53e9b77e6236943fd9667f4c0260d78601
tested_revision: a359fc53e9b77e6236943fd9667f4c0260d78601
source_baseline: 656dd6a76d0bb4fedf74a96e9fcdce412becbd51
reused_evidence_revision: fce94b20cf69eae8030b20282a2f3ad82099d418

Author: Reviewer. Date: 2026-10-04 UTC. Branch: `candidate/p01-browser-harness-20261004-impl`. Destination `master` resolves to the source baseline and remains unmerged. No commit, merge, remote action, production fix, configuration edit, or test edit was performed. Writes are this report and Reviewer scratch, plus ignored dependencies/build output from the assigned verification commands.

## Review scope and findings

Inspected the baseline-to-candidate diff, prototype source/configuration/lockfile/tests, local wrappers, root justfile and existing delegation conventions, root/prototype READMEs, CURRENT/TASK_LOGS, P01 and plan-index updates. Read the canonical Reviewer, handoff/testing skills, SCHEMA, ADR-0006 and applicable tooling ADRs. Consumed [Implementer](implementer.md) and [verification](verification.md) first, then the relevant structured evidence and [Scout](scout.md). No workflow documents or reasoning transcript were requested/read.

**Blocking findings: none. Optional findings: none. No material findings or outstanding blockers.** The implementation is appropriately small: one presentation scene, import-free pure fixture, explicit literal assertion, strict compiler configuration, two small local shell layers plus entry point, six thin root recipes, and pinned local dependencies/runtime. No P02/gameplay/backend/deployment or unrelated/protected-path work was introduced.

The literal expectation protects the documented fixture contract rather than provisional combat tuning. Throwing browser-global guards cover the public import/call boundary; the independent runtime assertion protects the selected Bun contract. Tests use Vitest's node environment and nonwatch `run`, with no DOM emulator or Phaser/view import. Core has no imports at all; game initialization exists only in the browser entry.

## Acceptance disposition 1–7

The authority is the existing [P01 plan](../../plans/2026-10-02-a87b131a-poc-001-browser-harness.md). These dispositions are evidence assessments and an acceptance recommendation, not a delivery record.

| Criterion | Disposition and evidence |
| --- | --- |
| 1. Clean committed-lock install | Satisfied. Independently ran the default frozen install, exit 0. Reused [clean-install.json](clean-install.json): initially empty dependency directory, 43 packages, frozen reinstall/typecheck/test/build exit 0 at `fce94b2`. Independently resolved the retained checkout to that revision, confirmed clean status and identical lock hash. Application/lock/wrappers equal the candidate. |
| 2. Dev rendered named scene | Satisfied. Independently started the actual root Docker dev recipe and sandbox-enabled Chrome; required title and placeholder visible in screenshot, visually inspected using `view_image`. Zero application console errors, runtime exceptions/rejections or network failures. Also inspected committed [dev.png](dev.png) and [browser.json](browser.json). |
| 3. Strict typecheck, real test, meaningful failure | Satisfied. Independent typecheck and unchanged two-test suite exit 0. Explicit file/name selection passes one test; nonexistent file filter exits 1. Reused [commands.json](commands.json) false-literal evidence: assertion fails with expected/received mismatch, exit 1; restored exact test passes and test diff exits 0. Tests were not altered during review. |
| 4. Static build and preview | Satisfied. Independent build exit 0, relative `./assets/` JS/CSS in dist HTML. Actual root Docker preview and independent Chrome render pass; all local assets respond 200, no backend/external page requests or missing assets. Visually inspected independent and committed [preview.png](preview.png). |
| 5. Pure core import | Satisfied. Independent guarded bare-Bun import exits 0, returns `formation-lab-ready`, counts zero window/document/Phaser accesses. Unchanged Vitest guarded import passes. Import-free core cannot initialize Phaser through an imported dependency. |
| 6. Isolation and scope | Satisfied. No tracked node_modules/dist, root manifest/lock/workspace, or cross-prototype import. Generated output is ignored and caller-owned. Baseline protected-path diff is empty; P02–P12 files and existing root tools/assets are untouched. |
| 7. Local CLI, pins, forwarding, failures | Satisfied. Independently ran documented default Docker checks, inspected actual Bun processes and caller UID/GID/prototype-only mounts/localhost ports. All six recipes preserve exact argument boundaries and exit 37 with a recording Bun stub. Missing host Bun and inaccessible daemon clearly exit 1. Reviewed missing Docker, mismatched Bun, absent lock, direct entry point and Docker-argv probes in [commands.json](commands.json); shell quoting/exec paths substantiate them. |

## Independently executed commands and results

Working directory `/opt/dev/tehom-brainlab`, HEAD exact candidate above. Default Docker image is `oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895`; actual install reports Bun 1.4.2 (`744846f84`). No automatic fallback mode was used.

| Command/check | Exit and observed result |
| --- | --- |
| `just poc-001-install` | Initial sandbox attempt 1, explicit inaccessible-daemon message; bounded approved execution 0, frozen lock, 43 existing installs checked. This independent run used existing node_modules; clean-install evidence is separately identified above. |
| `just poc-001-typecheck` | 0; `tsc --noEmit`, strict source/tests/config coverage. |
| `just poc-001-test` | 0; Vitest 5.0.3, one file/two tests pass, including actual Bun worker version. |
| `just poc-001-build` | 0; Vite 8.3.2, static dist, relative assets; Phaser size warning retained. |
| `just poc-001-test tests/smoke.test.ts -t 'declared literal'` | 0; one selected test passes, runtime test skipped by requested filter. |
| `just poc-001-test tests/does-not-exist.test.ts` | 1; explicit no-test-files failure. |
| `POC001_MODE=host PATH=/usr/bin:/bin just poc-001-test` | 1; Bun 1.4.2 required on PATH. |
| `DOCKER_HOST=unix:///tmp/p01-review-no-daemon.sock just poc-001-test` | 1; Docker daemon inaccessible. |
| Six `just poc-001-{install,dev,typecheck,test,build,preview}` invocations with argv `['value with spaces', 'literal;$(echo unsafe)', '--example']` and explicit-host scratch recording Bun | Each child/root exit 37, exact argv and prototype cwd verified; aggregate inline Python probe exit 0. Records in `.agents/scratch/p01-review/cli.json`. No shell metacharacter execution. |
| Guarded pure-import argv replay from [scope-runtime.json](scope-runtime.json), using `/home/metatron/.bun/bin/bun --eval …` in the prototype | 0; `{"bun":"1.4.2","fixture":"formation-lab-ready","browserGlobalAccesses":0}`. The exact unchanged eval argv is retained in the linked record. |
| `just poc-001-dev`; `just poc-001-preview` | Both ready on 5173/4173; normal Ctrl-C cleanup exits 130. |
| `/home/metatron/.bun/bin/bun .agents/scratch/p01-review/browser.ts` | 0; HeadlessChrome/148.0.7778.96, dev 12 requests, preview 8; title, 960×600 painted canvas, zero errors/exceptions/failures/backend requests. |
| `docker ps --filter ancestor=<pinned image> --format '{{.ID}}'`; `docker inspect <each server ID>`; `docker exec <ID> sh -c 'for p in /proc/[0-9]*/exe; do readlink "$p"; done'` | 0; user `1000:1000`, sole prototype mount at `/app`, published ports `127.0.0.1`, actual executables bun/docker-init/dash. After cleanup, image-filtered Docker ps returns no containers. |
| `git diff --exit-code fce94b2 a359fc5 -- poc-001-linked-formation justfile README.md` | 0; executable/test/runtime and run documentation unchanged since reused tested application. |
| `git diff --name-status fce94b2 a359fc5`; baseline `git diff --stat` and full relevant diffs | 0; successor adds evidence and factual vault/P01/index status only; numbered criteria unchanged. |
| Protected baseline diff over `.agents .codex .claude .aws AGENTS.md CLAUDE.md bin scripts assets tools shared .gitignore`; Scout diff from `aaaca78` | 0; both empty. |
| `git diff --check 656dd6a a359fc5`; `git diff --exit-code HEAD -- poc-001-linked-formation justfile` | 0; no whitespace or local tracked application changes. |
| Git tracked/ignored inspection, Python ownership scan of node_modules/dist, lock SHA256 and dist HTML inspection | 0; no tracked generated dependencies/build, no root app/workspace, zero non-caller-owned entries, relative assets. Lock SHA256 `97cf0bb58eea9ea8b98751e06d83bd64d8ea8df1660cae2ba135bddda9f9477a`. |

## Evidence and limits

Independent browser scratch uses the inspected Implementer CDP driver with only output/profile/debug-port paths changed to Reviewer ownership. Chrome sandbox remains enabled; no `--no-sandbox`, unsafe software-rendering flag or host-security change. Event listeners attach before navigation and cover console, exceptions (including unhandled rejections), local responses, failures and request types during startup observation. Both independent screenshots were opened with `view_image`; all required text is visible. Their SHA256 equals both committed screenshots: `7073cf3b307729c097573dc956677470ea8ee1a7357b34e22b59d411a3bdc11a`. Scratch is ignored local evidence; committed browser evidence remains the portable artifact.

Reused deliberate-test-failure, second clean install, full successful host-mode checks and some negative/direct/Docker-boundary probes were inspected rather than rerun. Their relevant content equals this candidate; the second clean checkout's revision/status/hash were independently confirmed. Dependency pin provenance is the dated Scout/official-registry evidence, not a new registry lookup. Actual toolchain execution, worker pin assertion and server executable inspection confirm this selected Bun stack. No runtime/trust exception was necessary.

Verification is Linux amd64 and cached Chrome headless only. No human playtest, browser matrix, deployment, backend, combat or later-plan behavior was tested or claimed. Static subdirectory support is supported by relative built URLs; no separate deployed-subdirectory test was run. Build warns about the 1,375.84 kB Phaser chunk (358.19 kB gzip); Chrome reports a software-WebGL capability-probing warning despite Canvas rendering. Screenshots show scrollbars with the complete title/placeholder visible. None presents a concrete P01 acceptance failure; optimization/polish remain outside this slice.

All seven criteria have affirmative evidence under the assigned automated-browser substitution. No blockers need routing to the Implementer. Acceptance, report integration, destination merge and delivery belong to the responsible Coordinator/integration worker; this report does not prefill their outcomes.
