# P02 formation algebra verification

Author: B-impl / B-fix-R1 Implementer. Date: 2026-10-04 UTC.

Current corrected candidate/tested revision: `29d9616f2ebdb69c83d12f66089495bca6f7f723`; see [R1 checks](#r1-corrected-candidate-verification). Local branch: `p02-formation-algebra`. Source BASE: `e3f60372a5fef279f92ed14caead48271247405f`. Its successor updates only the Implementer's reports and task log. Original combined application candidate: `3570610406886f18ca08c51effc79b3e8f3ddd34`; the initial-phase evidence below is retained as history, followed by fresh R1 verification.

## Prerequisite at BASE

From repository root, initial sandboxed `just poc-001-test` and `just poc-001-typecheck` each exited 1 with `P01: Docker daemon inaccessible; check availability and socket permissions`. Retried both unchanged commands with approved Docker access at BASE: test exit 0, two P01 smoke tests pass; typecheck exit 0. The harness works; no prerequisite implementation was changed. All application checks below used approved Docker access, the committed P01 wrapper, and pinned Bun 1.4.2 / Vitest 5.0.3.

## Required commands at initial candidate

All commands in this initial section ran from repository root with clean tracked application content at `3570610406886f18ca08c51effc79b3e8f3ddd34`.

### `just poc-001-test tests/formation.test.ts`

Exit 0.

```text
$ vitest run tests/formation.test.ts

 RUN  v5.0.3 /app

stdout | tests/formation.test.ts
P02 formation assertions executed: 3349

 ✓ tests/formation.test.ts (90 tests) 91ms

 Test Files  1 passed (1)
      Tests  90 passed (90)
   Start at  03:11:19
   Duration  362ms (transform 41%, tests 41%, import 13%, worker 6%)
```

### `just poc-001-typecheck`

Exit 0.

```text
$ tsc --noEmit
```

### `just poc-001-test`

Exit 0.

```text
$ vitest run

 RUN  v5.0.3 /app

 ✓ tests/smoke.test.ts (2 tests) 20ms
stdout | tests/formation.test.ts
P02 formation assertions executed: 3349

 ✓ tests/formation.test.ts (90 tests) 81ms

 Test Files  2 passed (2)
      Tests  92 passed (92)
   Start at  03:11:20
   Duration  328ms (transform 46%, tests 34%, import 14%, worker 5%)
```

### `just poc-001-build`

Exit 0.

```text
$ vite build
vite v8.3.2 building client environment for production...
transforming...
✓ 7 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                     0.48 kB │ gzip:   0.30 kB
dist/assets/index-CXVwlNtD.css      0.11 kB │ gzip:   0.10 kB
dist/assets/index-Dsr-fa2K.js   1,375.84 kB │ gzip: 358.19 kB

✓ built in 1.25s
[plugin builtin:vite-reporter]
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
```

### `git diff --check`

Exit 0.

No output.

## Actual orientation-zero capture and guarded import

Command at initial candidate `3570610406886f18ca08c51effc79b3e8f3ddd34` (read-only mount; no network; not rerun for R1):

```sh
docker run --rm --network none --user "$(id -u):$(id -g)" -v "$PWD/poc-001-linked-formation:/app:ro" -w /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 bun -e 'for (const name of ["window", "document", "Phaser"]) Object.defineProperty(globalThis, name, { get() { throw new Error("Browser global accessed: " + name); } }); const { formationPositions, formationLinks } = await import("./src/core/formation.ts"); for (const shape of ["compact", "spread"]) { const formation = { shape, orientation: 0 }; console.log(JSON.stringify({ formation, positions: formationPositions(formation), links: formationLinks(formation) })); }'
```

Exit 0; both outputs are reproduced verbatim in the [handoff](implementer.md#serialized-orientation-zero-examples). Guards threw on access to `window`, `document`, or `Phaser`; import and derivation completed without triggering them. The provisional default Close threshold was used in this capture.

## Test-development findings and limits

The first uncommitted focused test run exited 1 (81 pass, 9 fail) because transform expectations produced JavaScript `-0` while ring coordinates used `0`. Signed zero does not distinguish axial cells. Expectations now add zero to the negated component and still assert every exact clockwise transformed coordinate. A restored focused run passed all 90 tests/3,349 assertions before committing; the final committed runs above passed independently. Typecheck passed before and after the candidate commit.

Every formation test declares its expected matcher count with `expect.assertions`. The after-each hook sums Vitest's actual `assertionCalls`, and runner stdout reports 3,349. This count covers P02 only; full regression additionally executes the two unchanged P01 tests. No deliberately corrupted assertion sanity check was run.

Vite emitted its existing large Phaser chunk warning. No new browser session, clean reinstall, host-mode validation, human playtest, deployment, push, merge, or independent review was performed by the Implementer during the initial assignment. The subsequent Reviewer report identified R1; re-review after correction remains pending. Source/runtime/lock/P01 tests and rendering remain unchanged; the build still produces the P01 shell.

## Initial evidence-only documentation and scope audit

`git diff --check` after recording evidence: exit 0. Inline Python checked eight changed Markdown documents and 144 local links/fragments, rejected trailing whitespace, confirmed all required handoff fields and both existing candidate/tested SHAs with `git cat-file -e <revision>^{commit}`, and compared the P02 acceptance section byte-for-byte with BASE: exit 0. The first whitespace audit caught trailing spaces inherited from captured runner output; formatting them away preserved the command results and made the audit pass.

`git diff --exit-code e3f60372a5fef279f92ed14caead48271247405f -- .agents .codex .claude .aws AGENTS.md CLAUDE.md bin scripts assets shared tools justfile .gitignore docs/mailbox/p01-browser-harness docs/mailbox/agent-routing poc-001-linked-formation/src/main.ts poc-001-linked-formation/src/view poc-001-linked-formation/src/core/smoke.ts poc-001-linked-formation/tests/smoke.test.ts poc-001-linked-formation/package.json poc-001-linked-formation/bun.lock poc-001-linked-formation/tsconfig.json poc-001-linked-formation/runtime.env poc-001-linked-formation/bin poc-001-linked-formation/scripts`: exit 0, protected content unchanged.

`git diff --exit-code 3570610406886f18ca08c51effc79b3e8f3ddd34 -- poc-001-linked-formation/src poc-001-linked-formation/tests`: exit 0, application and tests equal the tested candidate. `git rev-parse master` returns unchanged BASE. `git worktree list` confirms unrelated worktrees remain present; the separately advancing handoff worktree is documented in the handoff/task log.

## R1 corrected candidate verification

Assignment B-fix-R1, checked committed candidate `29d9616f2ebdb69c83d12f66089495bca6f7f723` on `p02-formation-algebra`, a successor of initial evidence head `fb0a352929e38dab21c9092a8d45246a2a81764d`. Only the two enumeration-membership assertion lines changed. Production modules/API/runtime/configuration are unchanged. All commands below ran from repository root after committing the fix; application checks used approved Docker access, pinned Bun 1.4.2, and Vitest 5.0.3.

### R1: `just poc-001-test tests/formation.test.ts`

Exit 0.

```text
$ vitest run tests/formation.test.ts

 RUN  v5.0.3 /app

stdout | tests/formation.test.ts
P02 formation assertions executed: 3349

 ✓ tests/formation.test.ts (90 tests) 246ms

 Test Files  1 passed (1)
      Tests  90 passed (90)
   Start at  03:26:56
   Duration  802ms (transform 46%, tests 40%, import 12%, worker 2%)
```

### R1: `just poc-001-typecheck`

Exit 0.

```text
$ tsc --noEmit
```

### R1: `just poc-001-test`

Exit 0.

```text
$ vitest run

 RUN  v5.0.3 /app

 ✓ tests/smoke.test.ts (2 tests) 54ms
stdout | tests/formation.test.ts
P02 formation assertions executed: 3349

 ✓ tests/formation.test.ts (90 tests) 106ms

 Test Files  2 passed (2)
      Tests  92 passed (92)
   Start at  03:26:58
   Duration  438ms (tests 44%, transform 34%, import 18%, worker 4%)
```

### R1: `just poc-001-build`

Exit 0.

```text
$ vite build
vite v8.3.2 building client environment for production...
transforming...
✓ 7 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                     0.48 kB │ gzip:   0.30 kB
dist/assets/index-CXVwlNtD.css      0.11 kB │ gzip:   0.10 kB
dist/assets/index-Dsr-fa2K.js   1,375.84 kB │ gzip: 358.19 kB

✓ built in 1.44s
[plugin builtin:vite-reporter]
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
```

### R1: `git diff --check`

Exit 0.

No output.

Focused and full P02 assertion counts both remain **3,349**; focused **90 tests**, full **92 tests** including the unchanged two P01 tests. Build retains the existing large Phaser chunk warning. R1 adds no production behavior or new default.

### Property-order variation probe

Scratch source: `.agents/scratch/p02/r1/formation-reordered.ts`, copied from the unchanged production module with exactly one replacement:

```text
states.push({ shape, orientation: orientation as Orientation });
-> states.push({ orientation: orientation as Orientation, shape });
```

The copy is mounted read-only over `/app/src/core/formation.ts`; the actual test file is exercised unchanged except for the committed R1 assertion fix. Probe files were not committed. Temporary writable caches are isolated tmpfs mounts; both source mounts are read-only and networking is disabled.

Exact command, used before and after the fix:

```sh
docker run --rm --network none --tmpfs /app/node_modules/.vite-temp:rw,mode=1777 --tmpfs /app/node_modules/.vite:rw,mode=1777 --user "$(id -u):$(id -g)" --volume "$PWD/poc-001-linked-formation:/app:ro" --volume "$PWD/.agents/scratch/p02/r1/formation-reordered.ts:/app/src/core/formation.ts:ro" --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 bun run --bun test:unit tests/formation.test.ts
```

Before the fix at `fb0a352`: exit 1, **89 passing tests / one failure**, with failure at enumeration membership line 68 comparing serialized Formation sets. Runner reported 3,345 executed assertions because the failed test stopped after its second matcher. This reproduces R1 without editing production source on disk.

After the committed fix at `29d9616f2ebdb69c83d12f66089495bca6f7f723`: exit 0:

```text
$ vitest run tests/formation.test.ts

 RUN  v5.0.3 /app

stdout | tests/formation.test.ts
P02 formation assertions executed: 3349

 ✓ tests/formation.test.ts (90 tests) 85ms

 Test Files  1 passed (1)
      Tests  90 passed (90)
   Start at  03:27:03
   Duration  459ms (transform 49%, tests 33%, import 13%, worker 5%)
```

The first probe invocation omitted tmpfs caches and exited 1 at startup with `EROFS` writing Vite's bundled configuration into `node_modules/.vite-temp`; no tests ran in that attempt. The command above supplies only disposable writable cache mounts and then executes the intended before/after assertion probe.

### Assertion audit and limits

`rg -n 'JSON\\.stringify|serializePositions' poc-001-linked-formation/tests` plus direct inspection covered all remaining serialization assertions. No other assertion compares independently constructed Formation JSON or shares the incidental-property-order dependency. Position serialization is retained for the plan's byte-equivalent inverse requirement and labelled uniqueness; frozen-input serialization checks the same object before/after. Other object assertions use structural equality. State length, exact canonical membership, all twelve mappings, operation coverage, and all assertion counts are intact.

The Reviewer-owned report remains uncommitted and was not edited, staged, or committed. SHA256 before/after: `fed11f8aed7e97730199aa8792faccc69bd2697e1026d488d5b905695a840bd7`. Master remains BASE. No browser session, clean reinstall, host-mode rerun, human playtest, push, deployment, or merge was run for this correction. Re-review, Coordinator acceptance, and delivery remain pending.

R1 evidence audit: inline Python checked the three changed Markdown documents and 44 local links/fragments, whitespace, required handoff fields, existing corrected candidate/tested SHAs, unchanged Reviewer bytes/untracked status, and unchanged master: exit 0. `git diff --check`, `git diff --exit-code fb0a352929e38dab21c9092a8d45246a2a81764d -- poc-001-linked-formation/src`, and `git diff --exit-code 29d9616f2ebdb69c83d12f66089495bca6f7f723 -- . ':(exclude)docs'` each exited 0: production source unchanged and no technical change after the tested fix.
