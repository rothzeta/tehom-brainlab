task: versioned-agent-skills / main-delivery / Part 3
status: complete
outcome: Accepted skills fast-forwarded to local master; three global links installed to canonical sources; delivered smoke and preparation checks passed.
artifacts:
  - docs/mailbox/versioned-agent-skills/delivery.md
  - docs/mailbox/versioned-agent-skills/reviewer-main.md
  - docs/mailbox/versioned-agent-skills/integration-main.md
  - master
  - /home/metatron/.agents/skills/ruach-herdr
  - /home/metatron/.agents/skills/ruach-handoff
  - /home/metatron/.agents/skills/ruach-harness-eval
verification:
  - "Exact clean baseline checked; ff-only delivery succeeded from destination_before to delivered_revision."
  - "Delivered technical content equals reviewed/tested 8ea1c67; only evidence files differ."
  - "Three canonical frozen installs passed; node_modules ignored; main checkout remained clean."
  - "All three readlink realpaths match canonical sources; all 43 tracked skill files through global links match delivered Git objects."
  - "Seven global-path help/offline/preparation/report checks and real root Architect resolution passed; no panes/submissions."
  - "Delivered root smoke suite: 13 tests pass, exit 0, 4.986s."
  - "Protected P01/P02 code/contracts/evidence unchanged; whitespace check passes."
  - "Existing unrelated global skills preserved; two original skill files retain their SHA-256 values."
  - "Delivery handoff validation: exit 0, ok true, five revision references resolved, empty diagnostics."
review:
  - "Accepted independent reviewer-main report: no material, blocking or optional findings at reviewed_revision."
discoveries:
  - "Global links target the canonical master checkout, not an integration worktree."
  - "Native preparation is verified separately from live session or role/skill discovery acceptance."
blockers: []
tested_revision: 8ea1c677e88b4c0d9b96646719836cae721c3454
reviewed_revision: 8ea1c677e88b4c0d9b96646719836cae721c3454
delivered_revision: 50420314efb474122d4570beac6fe704cccb9dff
destination_before: 97752643b31cdcf8c8ec9f09204382c6766b1573
source_revision: 50420314efb474122d4570beac6fe704cccb9dff

Author: Implementer, main integration/delivery owner. Date: 2026-10-04 UTC. The Part 3 assignment explicitly authorizes local master delivery and these three global skill links. This report identifies the existing delivered commit; its own later documentation-only recording commit is returned in the terminal handoff.

## Delivery and reviewed content

Inspected the accepted [independent review](reviewer-main.md) at source `5042031`: no blocking or optional findings for exact reviewed/tested `8ea1c677e88b4c0d9b96646719836cae721c3454`. Integration successors `e4b1dd9` and `5042031` only record evidence. Before mutation, checked the main checkout was on master, HEAD/master equalled required `97752643b31cdcf8c8ec9f09204382c6766b1573`, source branch equalled `50420314efb474122d4570beac6fe704cccb9dff`, and `git status --porcelain=v1` was empty. Reasserted all four conditions immediately before delivery.

Executed `git -C /opt/dev/tehom-brainlab merge --ff-only versioned-agent-skills-main`: exit 0, fast-forward without conflicts, master/HEAD now `50420314efb474122d4570beac6fe704cccb9dff`; checkout clean. No source branch/worktree was deleted or changed, and no push/publication occurred.

Executed technical equivalence:

```sh
git -C /opt/dev/tehom-brainlab diff --exit-code 8ea1c67 master -- . ':(exclude)docs/mailbox' ':(exclude)docs/CURRENT.md' ':(exclude)docs/TASK_LOGS.md'
git -C /opt/dev/tehom-brainlab diff --name-only 8ea1c67..master
```

First command: exit 0, empty. Second: exactly `docs/CURRENT.md`, `docs/TASK_LOGS.md`, `docs/mailbox/versioned-agent-skills/integration-main.md` and `docs/mailbox/versioned-agent-skills/reviewer-main.md`. The delivered executable/test/config/skill source equals the reviewed candidate. The later recording commit changes only this report and appended CURRENT/TASK_LOGS evidence.

## Global installation

All three requested destinations were absent, including dangling symlink checks using `os.path.lexists`, so there were no collisions or skipped installs. Created each symlink with `os.symlink(target, link, target_is_directory=True)` without overwrite. Existing `~/.agents/skills/find-skills` and `~/.agents/skills/herdr` directories were not modified; SHA-256 snapshots of their two original SKILL.md files remained identical.

| Global link | Canonical target | Result |
| --- | --- | --- |
| `/home/metatron/.agents/skills/ruach-herdr` | `/opt/dev/tehom-brainlab/.agents/skills/ruach-herdr` | installed |
| `/home/metatron/.agents/skills/ruach-handoff` | `/opt/dev/tehom-brainlab/.agents/skills/ruach-handoff` | installed |
| `/home/metatron/.agents/skills/ruach-harness-eval` | `/opt/dev/tehom-brainlab/.agents/skills/ruach-harness-eval` | installed |

Bun resolved to `/home/metatron/.bun/bin/bun` (1.4.2). Ran `/home/metatron/.bun/bin/bun install --frozen-lockfile` once in each canonical directory above:

| Skill | Result |
| --- | --- |
| ruach-herdr | exit 0; yaml 2.8.1 and ws 8.18.3 installed, 65ms |
| ruach-handoff | exit 0; ajv 8.20.0, yaml 2.9.1 and transitive dependencies installed, 122ms |
| ruach-harness-eval | exit 0; dependency-free manifest, done in 4ms |

No lockfile changed. `git -C /opt/dev/tehom-brainlab check-ignore .agents/skills/ruach-herdr/node_modules .agents/skills/ruach-handoff/node_modules .agents/skills/ruach-harness-eval/node_modules` exited 0 and returned all three paths. Evaluator node_modules is not created because it has no external dependencies. `git -C /opt/dev/tehom-brainlab status --porcelain` remained empty after installs and smoke checks.

For each link, `readlink -f LINK` returned the exact canonical target, exit 0. Enumerated all tracked files under the three skills using `git -C /opt/dev/tehom-brainlab ls-files .agents/skills/ruach-herdr/ .agents/skills/ruach-handoff/ .agents/skills/ruach-harness-eval/`. For every file, compared `git -C /opt/dev/tehom-brainlab hash-object <file-through-global-link>` against `git -C /opt/dev/tehom-brainlab rev-parse master:<canonical-repo-relative-path>`. All **43** matched, including every invoked script and its supporting files. `hash-object` was used without `-w`; no Git objects were written by those comparisons.

## Delivered smoke commands and results

The delivery helper `python3 .agents/scratch/integration-main-part3/verify-delivery.py` exited 0. It preserves exact argv/cwd/stdout/stderr in ignored scratch and exercises canonical/global public commands. All commands below ran from `/opt/dev/tehom-brainlab`; they returned the expected versioned JSON or help text, with exit 0:

| Exact argv | Exit |
| --- | --- |
| `/home/metatron/.bun/bin/bun /home/metatron/.agents/skills/ruach-herdr/scripts/worker.ts --help` | 0 |
| `/home/metatron/.bun/bin/bun /home/metatron/.agents/skills/ruach-herdr/scripts/worker.ts resolve --offline --role architect --name delivery-check --repo /opt/dev/tehom-brainlab --cwd /opt/dev/tehom-brainlab` | 0 |
| `/home/metatron/.bun/bin/bun /home/metatron/.agents/skills/ruach-herdr/scripts/worker.ts start --dry-run --permissions auto-review --role coordinator --name delivery-check-coordinator --repo /opt/dev/tehom-brainlab --cwd /opt/dev/tehom-brainlab` | 0 |
| `/home/metatron/.bun/bin/bun /home/metatron/.agents/skills/ruach-herdr/scripts/worker.ts start --dry-run --permissions auto-review --role architect --name delivery-check-architect --repo /opt/dev/tehom-brainlab --cwd /opt/dev/tehom-brainlab` | 0 |
| `/home/metatron/.bun/bin/bun /home/metatron/.agents/skills/ruach-handoff/scripts/validate.ts /opt/dev/tehom-brainlab/docs/mailbox/versioned-agent-skills/reviewer-main.md` | 0 |
| `/home/metatron/.bun/bin/bun /home/metatron/.agents/skills/ruach-harness-eval/scripts/scope-check.ts --help` | 0 |
| `/home/metatron/.bun/bin/bun /home/metatron/.agents/skills/ruach-harness-eval/scripts/acceptance.ts --help` | 0 |
| `just agent-routing resolve architect` | 0 |

Global offline resolution returned Architect's canonical role path under `/opt/dev/tehom-brainlab/.agents/agents/`, canonical repo/cwd, no native argv and `launchable: false`. Global Coordinator and Architect preparations used the preferred Claude routes and auto-review policy; both returned `dry-run`, `launchable: true`, `not-submitted`, empty diagnostics and no pane/private directory. These are preparation results, not live role acceptance. The validator read the delivered reviewer report in the canonical repository and passed structure/revision resolution. The real root surface returned expected offline Architect selection with repository auto-review policy.

Before/after `herdr pane layout --current` and `herdr agent list` snapshots had identical pane IDs, named agent identities and native session metadata. No real start, pane, task prompt or model turn was requested. The unrelated global skill-file snapshots and clean checkout checks passed after all commands.

Ran `/opt/dev/tehom-brainlab/bin/test-agent-routing -v` with cwd `/opt/dev/tehom-brainlab`: exit 0, **13 tests pass in 4.986s**. Tests use temporary settings/checkouts and fake startup executables; no live harness sessions. Its log is ignored scratch `integration-main-part3/root-tests.log`.

The three full skill suites were not rerun in the canonical directories, as explicitly allowed by the assignment after technical-content equivalence. Full reviewed/tested coverage is retained from `8ea1c67` and the independent [reviewer](reviewer-main.md): Herdr 107, handoff 24 and evaluator 59 tests passed. The delivered root smoke above is an additional actual run at `delivered_revision`.

## Protected scope and recording

Executed:

```sh
git -C /opt/dev/tehom-brainlab diff --exit-code 97752643 master -- prototypes 'poc-*' shared tools assets docs/prototypes docs/plans docs/playtests docs/adr docs/mailbox/p01-browser-harness docs/mailbox/p02-formation-algebra docs/mailbox/routing-p02 docs/mailbox/agent-routing .agents/models.yaml .agents/routing.yaml .agents/roles.yaml bin justfile AGENTS.md CLAUDE.md README.md
git -C /opt/dev/tehom-brainlab diff --check 97752643..master
```

Both exit 0. Protected diff is empty; the actual prototype `poc-001-linked-formation/`, P01/P02 code/contracts/mailbox evidence, shared/tools/assets, routing catalogs and unchanged root bin/just surfaces retain baseline bytes. Generic `prototypes/` remains absent. No browser/prototype rerun or changes were needed.

This new report plus append-only entries in [CURRENT](../../CURRENT.md) and [TASK_LOGS](../../TASK_LOGS.md) are the only recording changes on master. Prior mailbox reports remain unchanged. Executed `/home/metatron/.bun/bin/bun /home/metatron/.agents/skills/ruach-handoff/scripts/validate.ts /opt/dev/tehom-brainlab/docs/mailbox/versioned-agent-skills/delivery.md`: exit 0, `ok: true`, all five supplied revisions resolved, empty diagnostics. Whitespace and the exact three-document scope are checked before commit. After commit it checks a clean main checkout and technical equivalence again, and returns the observed recording SHA. The report does not predict its own commit identifier.

## Limits

No live model session, model entitlement, task execution, native role acceptance or live skill discovery was verified. `shutil.which` confirms Pi, OpenCode and DSH executables are absent from the inspected PATH. OMP is also absent from that PATH; Agy resolves to `/home/metatron/.local/bin/agy`. OMP/Agy adapter capability remains unverified and fails preparation rather than being substituted. Complete Claude account/plugin/managed catalog visibility remains unverified and nonfatal. Codex's short-lived stdio inspection may initialize runtime state; the launcher does not write user settings. These delivery preparations selected Claude, so no Codex stdio reader was forced here.

No `~/.codex` or `~/.claude` settings were edited, no unrelated global skill was changed, and no remote push/publication or branch/worktree deletion occurred. Mechanical report validation proves structure/revision resolution, not report truth or discovery. Part 3 has no unresolved blocker.
