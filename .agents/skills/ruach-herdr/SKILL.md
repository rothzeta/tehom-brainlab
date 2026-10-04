---
name: ruach-herdr
description: Resolve a repository role and model route, prepare native harness instructions, and start one named worker in a sibling Herdr pane. Use for an authorized worker launch; excludes assignments, monitoring, prompts, evaluation, and benchmarks.
---

# Ruach Herdr

Run with Bun. Install the skill's pinned dependencies from this directory once:

```sh
bun install --frozen-lockfile
bun test
```

Resolve effective selection or prepare a launch without creating files or panes:

```sh
bun scripts/worker.ts resolve --name task-worker --role implementer --cwd /path/to/worktree
bun scripts/worker.ts start --dry-run --name task-worker --role implementer --cwd /path/to/worktree
```

For direct selection, supply `--kind KIND --model NATIVE_MODEL [--effort LEVEL]` instead of a route. Otherwise the role's preferred route comes from `.agents/models.yaml`, `.agents/routing.yaml`, and `.agents/roles.yaml`; `--route ID` selects a declared alternative. There are no model defaults or harness fallbacks. Supply `--repo DIR` if Git cannot infer the intended canonical repository from cwd. Relative launcher paths resolve from invocation cwd. See [routing schema and root delegation](references/routing.md).

Start only after authorization to create the named worker:

```sh
bun scripts/worker.ts start --name task-worker --role implementer --cwd /path/to/worktree
```

`start` requires `HERDR_ENV=1` and the caller's `HERDR_PANE_ID`; preflight reads that pane and live names. It splits that pane once with `--no-focus`, preserves the requested cwd and executable PATH, and submits one `herdr agent start`. It never sends a task prompt or retries. Coordinator workflow skills remain visible according to existing native settings; workers have every discovered `ruach-workflow-*` skill disabled. Existing developer and technical skill configuration is preserved.

Claude and Codex have launch preparation enabled. Codex requires an already-running matching-version local daemon for read-only effective config discovery; this skill never starts a daemon. Pi, OpenCode, DSH, OMP, and Agy currently fail before mutation for missing or unverified capabilities. Read [adapter evidence and limits](references/adapters.md) before selecting a harness. A prepared argv does not establish account access, model availability, native acceptance, or a successful paid session.

`resolve --offline` reads selection and canonical role only; it returns `launchable: false` and no native argv. It cannot authorize a start.

One versioned JSON result goes to stdout; concise diagnostics go to stderr. Exit codes: `0` resolved/prepared/started; `2` usage or invalid data/config; `3` unavailable executable, Herdr context/kind, or native capability; `4` preparation failure or uncertain post-mutation state. Developer text and native pass-through values are redacted in results. Never treat a failed startup as proof that submission did not occur: inspect the reported pane before launching again.

Private generated material uses the OS temporary root, or existing `--temp-dir DIR`, with restricted permissions. Successful or uncertain launches retain it; the caller removes it after the session ends and state is known. Read-only commands create no launch material. Do not change persistent user harness settings or install global symlinks.

Pass native arguments after `--`. The bounded supported flags are Codex `--no-alt-screen`, `--sandbox`/`-s`, `--ask-for-approval`/`-a`, `--add-dir`; Claude `--verbose`, `--permission-mode`, `--add-dir`. Value flags accept one value each (repeat `--add-dir` for multiple directories) or `--flag=value`. Accepted argv elements retain their bytes and ordering. Model, effort, role/config, resume, prompt, print, credential, and unknown flags are rejected before mutation. Permission policy is inherited unless explicitly supplied.
