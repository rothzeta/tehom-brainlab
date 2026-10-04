task: ruach-extraction
author: launching-parent
status: complete
outcome: Verified public Ruach publication and all three migrated global skill links with direct read-only checks
tested_revision: 90908967cd089a826d1e0efa947c785fb9b5d8a1
upstream:
  repository: https://github.com/rothzeta/ruach
  delivered_revision: be77030727074d9c10e842c08647ad4a61232152
artifacts:
  - docs/mailbox/ruach-extraction/parent-verification.md
verification:
  - "Git push of Ruach main: exit 0; GitHub API reports public repository, default branch main, and commit be77030727074d9c10e842c08647ad4a61232152."
  - "Direct Python inspection of the three exact global symlinks: exit 0; all targets and SKILL.md identities match /opt/dev/ruach/skills/<name>."
  - "Global ruach-handoff validator on implementer-merge.md: exit 0, ok true, no diagnostics; revision references resolve."
  - "Global ruach-herdr offline Librarian resolution: exit 0, requested GPT route resolves, no submission or temporary writes."
  - "Global ruach-harness-eval scope-check help: exit 0 with expected CLI usage."
review: not-run
discoveries:
  - "Worker-native automatic permission review refused final global verification. Parent tools completed the narrower read-only checks without changing permission rules."
blockers: []

# Parent verification

These checks were executed by the launching parent after the Implementer merged Brainlab and repointed the links. They are parent evidence, not claims that the worker's refused commands ran. They supplement the Implementer and independent Reviewer reports; they do not replace their source, regression, or behavioral verification.

## Publication

From `/opt/dev/tehom-brainlab`, the parent executed:

```sh
git -C /opt/dev/ruach push --set-upstream origin main
gh repo view rothzeta/ruach --json url,isPrivate,defaultBranchRef
gh api repos/rothzeta/ruach/commits/main --jq .sha
```

All exited 0. Git reported a new `main` branch tracking `origin/main`. GitHub reported `isPrivate: false`, default branch `main`, and SHA `be77030727074d9c10e842c08647ad4a61232152` at [rothzeta/ruach](https://github.com/rothzeta/ruach).

## Global link targets and identities

A direct Python check inspected only the three exact named paths. For each, it required `Path.is_symlink()`, required `Path.readlink()` to equal the corresponding `/opt/dev/ruach/skills/<name>` path, and read `SKILL.md` to require its matching frontmatter name. It exited 0 for `ruach-handoff`, `ruach-harness-eval`, and `ruach-herdr`. No broad home-directory listing was used and no global file was changed by these checks.

## Read-only commands through the migrated links

From `/opt/dev/tehom-brainlab`:

```sh
/home/metatron/.bun/bin/bun /home/metatron/.agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/ruach-extraction/implementer-merge.md --repo /opt/dev/tehom-brainlab
/home/metatron/.bun/bin/bun /home/metatron/.agents/skills/ruach-herdr/scripts/worker.ts resolve --offline --name global-link-check --role librarian --repo /opt/dev/tehom-brainlab --cwd /opt/dev/tehom-brainlab
/home/metatron/.bun/bin/bun /home/metatron/.agents/skills/ruach-harness-eval/scripts/scope-check.ts --help
```

Each underlying command exited 0. The handoff validator returned `ok: true`, no diagnostics, and resolved the before/delivered/tested/reviewed revisions. Its structural success does not certify report truth or remove a `blocked` status automatically. The worker must correct its report using this explicitly attributed evidence.

The offline resolver returned `resolved-offline`, route `gpt-6.1-sol-high`, role `librarian`, `launchable: false`, no native argv or temporary operations, and `submission_state: not-submitted`. Its expected `offline_unverified` diagnostic means live native capability/account/model acceptance was not checked. Scope-check returned its expected help usage; this is a link/CLI smoke check, not another evaluation run.

The parent's report validator result is supplied to the Coordinator separately. Actual home paths appear only in Brainlab execution evidence, not the public Ruach source.
