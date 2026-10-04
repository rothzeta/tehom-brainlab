# Adaptation: skills-impl-herdr — reconcile routing with the committed schema

New dependency information: repository routing (models.yaml/routing.yaml/roles.yaml and the root launch command) is now delivered and independently reviewed on local master at exactly 97752643b31cdcf8c8ec9f09204382c6766b1573. The provisional schema assumption is superseded.

Same worktree/branch as before: /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-herdr (versioned-agent-skills-herdr, at 3340659). Same ownership: `.agents/skills/ruach-herdr/**` plus a NEW report docs/mailbox/versioned-agent-skills/implementer-herdr-routing.md (do not rewrite your earlier report). Common rules in common.md still apply.

Read the committed schema and command implementation ONLY at that exact revision, read-only, e.g. `git -C /opt/dev/tehom-brainlab show 97752643:models.yaml`, `git ls-tree -r 97752643`, `git show 97752643:<path>`. Do not check out, edit, or read working files in the main checkout; do not change those YAML files or the root command.

Tasks:
1. Make routed resolve/start consume the committed models.yaml/routing.yaml/roles.yaml schema as it actually is (field names, references, role->route preferences, effort, kind). Keep resolution isolated in routing.ts; fail clearly before side effects on invalid references/values. Remove the "provisional" status where it no longer applies; keep any remaining genuine uncertainty documented. Model names stay in YAML data/fixtures only.
2. Replace provisional fixtures with fixtures following the committed schema (copy structure, not the repository's preferences as defaults in code). Keep or extend invalid-input tests.
3. Read-only check: run `resolve` and `start --dry-run` with `--repo` pointing at a temporary `git worktree add --detach <OS-temp-dir> 97752643` (creating a detached temp worktree of that revision is allowed; remove it afterwards with `git worktree remove`), for coordinator by role alone and implementer/reviewer by role alone; record effective kind/model/effort. Do not start real sessions.
4. Delegation seam: inspect the committed root launch command at 97752643 and describe precisely (in references, briefly) how it can delegate to worker.ts at integration — name the command/file and the mapping of its arguments. Do NOT edit it; integration is a later assignment.
5. Flag any mismatch between the committed command's behavior and worker.ts (e.g., role injection, workflow visibility, effort handling) as discoveries.

Verification: `bun test` (full skill suite), frozen install, portability/model-name scan, quick validator. Commit implementation, then your new report (validated with `bun .agents/skills/ruach-handoff/scripts/validate.ts` — the validator exists on the integration branch; you may run it from /opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills/.agents/skills/ruach-handoff/scripts/validate.ts with --repo pointing at your worktree). Complete via the ruach-handoff protocol with the actual implementation/tested SHA and the report commit SHA in the terminal handoff.
