# Assignment TBC-review — `just poc-001-test-browser` out of the box (Reviewer)

Role: `reviewer` (follow `.agents/agents/reviewer.md`).

## Change under review

- Workspace: `/opt/dev/tehom-brainlab-tbc`, branch `test-browser-chrome`. Local `master` is `5b7c191`, which is the branch BASE.
- Range: `5b7c191..e30cb0b`. It changes `poc-001-linked-formation/scripts/browser-checks.mjs` and the README. Commit `3d7e9ba` adds only the report and assignment.
- Problem and requirements: `docs/mailbox/test-browser-chrome/assignment-implementer.md`. The user ran `just poc-001-test-browser` with no `POC001_CHROME` set, and it failed.
- Handoff: `implementer.md`.

## Judge

1. The bare recipe works with no environment. Chrome discovery follows the specified precedence: explicit argument or `POC001_CHROME`, then the highest Playwright headless shell, then `PATH` candidates. Selection is deterministic and announced, and only executables are accepted.
2. The no-Chrome path fails with an actionable message and a non-zero exit. Nothing is downloaded and no dependencies are added.
3. Build freshness: running only the recipe after a code change cannot silently test a stale build. Application serving stays in the pinned Docker wrapper. A supplied `BASE_URL` skipping the build is documented.
4. The `OUTPUT_DIRECTORY` and `BASE_URL` arguments still work. Application source, test assertions and the root justfile are unchanged. The README instructions are accurate.
5. Process handling: preview servers and Chrome are cleaned up on success and on failure.

## Verify independently at `e30cb0b`

Use a shell with `POC001_CHROME` unset (show this):

- `just poc-001-test-browser` from a clean or stale `dist`;
- the override path;
- an isolated no-Chrome run;
- `just poc-001-test`, `just poc-001-typecheck`, `just poc-001-build`;
- `git diff --check 5b7c191..e30cb0b`;
- `git diff --exit-code 5b7c191 e30cb0b -- poc-001-linked-formation/src poc-001-linked-formation/tests justfile`.

Use Docker for application checks, and escalate rather than using host mode.

## Restrictions and output

Edit only your report. Do not merge, push or rebase. Commit this assignment unchanged with `docs/mailbox/test-browser-chrome/reviewer.md`. Begin the report with the ruach-handoff YAML block, and classify each finding as blocking or optional with file:line, scenario and evidence. Run the validator with `--repo /opt/dev/tehom-brainlab-tbc` until it returns `ok: true`.

Terminal handoff: report SHA, verdict, finding counts.
