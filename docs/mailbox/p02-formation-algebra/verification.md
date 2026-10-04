# P02 formation algebra verification

Author: B-impl Implementer. Date: 2026-10-04 UTC.

Tested combined application candidate: `3570610406886f18ca08c51effc79b3e8f3ddd34`. Local branch: `p02-formation-algebra`. Source BASE: `e3f60372a5fef279f92ed14caead48271247405f`. The successor records evidence/status only; no code, test, runtime, configuration, or CLI changes follow this tested candidate.

## Prerequisite at BASE

From repository root, initial sandboxed `just poc-001-test` and `just poc-001-typecheck` each exited 1 with `P01: Docker daemon inaccessible; check availability and socket permissions`. Retried both unchanged commands with approved Docker access at BASE: test exit 0, two P01 smoke tests pass; typecheck exit 0. The harness works; no prerequisite implementation was changed. All application checks below used approved Docker access, the committed P01 wrapper, and pinned Bun 1.4.2 / Vitest 5.0.3.

## Required commands at tested_revision

All commands ran from repository root with clean tracked application content at the committed revision above.

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

Command at the same revision (read-only mount; no network):

```sh
docker run --rm --network none --user "$(id -u):$(id -g)" -v "$PWD/poc-001-linked-formation:/app:ro" -w /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 bun -e 'for (const name of ["window", "document", "Phaser"]) Object.defineProperty(globalThis, name, { get() { throw new Error("Browser global accessed: " + name); } }); const { formationPositions, formationLinks } = await import("./src/core/formation.ts"); for (const shape of ["compact", "spread"]) { const formation = { shape, orientation: 0 }; console.log(JSON.stringify({ formation, positions: formationPositions(formation), links: formationLinks(formation) })); }'
```

Exit 0; both outputs are reproduced verbatim in the [handoff](implementer.md#serialized-orientation-zero-examples). Guards threw on access to `window`, `document`, or `Phaser`; import and derivation completed without triggering them. The provisional default Close threshold was used in this capture.

## Test-development findings and limits

The first uncommitted focused test run exited 1 (81 pass, 9 fail) because transform expectations produced JavaScript `-0` while ring coordinates used `0`. Signed zero does not distinguish axial cells. Expectations now add zero to the negated component and still assert every exact clockwise transformed coordinate. A restored focused run passed all 90 tests/3,349 assertions before committing; the final committed runs above passed independently. Typecheck passed before and after the candidate commit.

Every formation test declares its expected matcher count with `expect.assertions`. The after-each hook sums Vitest's actual `assertionCalls`, and runner stdout reports 3,349. This count covers P02 only; full regression additionally executes the two unchanged P01 tests. No deliberately corrupted assertion sanity check was run.

Vite emitted its existing large Phaser chunk warning. No new browser session, clean reinstall, host-mode validation, human playtest, deployment, push, merge, or independent review was performed for P02. Source/runtime/lock/P01 tests and rendering remain unchanged; the build still produces the P01 shell.

## Evidence-only documentation and scope audit

`git diff --check` after recording evidence: exit 0. Inline Python checked eight changed Markdown documents and 144 local links/fragments, rejected trailing whitespace, confirmed all required handoff fields and both existing candidate/tested SHAs with `git cat-file -e <revision>^{commit}`, and compared the P02 acceptance section byte-for-byte with BASE: exit 0. The first whitespace audit caught trailing spaces inherited from captured runner output; formatting them away preserved the command results and made the audit pass.

`git diff --exit-code e3f60372a5fef279f92ed14caead48271247405f -- .agents .codex .claude .aws AGENTS.md CLAUDE.md bin scripts assets shared tools justfile .gitignore docs/mailbox/p01-browser-harness docs/mailbox/agent-routing poc-001-linked-formation/src/main.ts poc-001-linked-formation/src/view poc-001-linked-formation/src/core/smoke.ts poc-001-linked-formation/tests/smoke.test.ts poc-001-linked-formation/package.json poc-001-linked-formation/bun.lock poc-001-linked-formation/tsconfig.json poc-001-linked-formation/runtime.env poc-001-linked-formation/bin poc-001-linked-formation/scripts`: exit 0, protected content unchanged.

`git diff --exit-code 3570610406886f18ca08c51effc79b3e8f3ddd34 -- poc-001-linked-formation/src poc-001-linked-formation/tests`: exit 0, application and tests equal the tested candidate. `git rev-parse master` returns unchanged BASE. `git worktree list` confirms unrelated worktrees remain present; the separately advancing handoff worktree is documented in the handoff/task log.
