# Assignment A-review — independent review of repository model routing (role: reviewer)

You are the Reviewer (canonical role `.agents/agents/reviewer.md`, already injected). Coordinator: Claude. Do not load or follow any workflow skill. Use `.agents/skills/ruach-handoff/SKILL.md` for your result and `.agents/skills/ruach-testing/SKILL.md` / ADR-0006 when judging tests.

## Exact change
- Repo `/opt/dev/tehom-brainlab`, local branch `routing-setup`.
- Base: master `c6083e892285b43c297c742ff28553ae3e2e7310`.
- Candidate/tested technical revision: `23decc2acef5793777c408b908fc69d3e55aee7d`; branch head `70f9657` adds the Implementer's documentation-only report. Review the range `c6083e8..70f9657` and confirm 70f9657 changes no executable/config/test content relative to 23decc2.
- Implementer report: `docs/mailbox/agent-routing/implementer.md` (on the branch).
- The main checkout is currently on `routing-setup`. Do not modify tracked files or commit. If you want an isolated checkout for running checks, create a detached worktree under `.agents/scratch/routing-p02/review-wt` and remove it when done.

## Acceptance conditions (judge each)
1. `.agents/models.yaml` holds model identity/harness centrally: `gpt-6.1-sol` -> harness codex, native ID `gpt-6.1-sol`; `claude-opus-5.5` -> harness claude, native ID `claude-opus-5-5`. No other providers/routes (no Pi/Kimi, no medium).
2. `.agents/routing.yaml` route names exactly `gpt-6.1-sol-high` and `claude-opus-5.5-high`, explicit documented model references, effort high; the `-high` suffix never enters an API model ID.
3. `.agents/roles.yaml`: coordinator Claude-only (no GPT/Codex fallback); architect preferred Claude / alternative GPT; scout, implementer, reviewer preferred GPT / alternative Claude. No duplicated role instruction bodies. Alternatives are only explicit operator choices; tooling never silently switches route/model after errors.
4. Small documented schema; prerequisites (Python/PyYAML) documented; `.agents/README`, CLI docs, CURRENT/TASK_LOGS updated factually without claiming review/delivery prematurely.
5. Tooling follows ADR-0005 (root justfile -> bin -> scripts) and existing idiom. Resolve/dry-run exposes effective role/route/harness/model/effort and CLI argv without leaking config secrets. Start uses Herdr (sibling no-focus pane, `herdr agent start --kind`), injects canonical role, preserves argument boundaries and prior Codex developer_instructions and skills.config overrides; Claude adapter exposes the workflow skill only to coordinator; Codex workers get the repo `ruach-workflow-feature` disabled.
6. Harness flags are correct for the installed CLIs (check `claude --help`, `codex --help`, `herdr agent start --help`; Codex config reference https://learn.chatgpt.com/docs/config-file/config-reference for model_reasoning_effort / developer_instructions). Compare against the currently used bootstrap `/tmp/brainlab-routing-p02-bootstrap.py` — the new tooling should be at least behaviorally equivalent for both harnesses. Note the Implementer's discovery about Codex skills.config path form (folder vs SKILL.md) and assess whether it is a defect.
7. Validation of bad role/route/model/fields/references fails clearly with non-zero exit before any pane creation.
8. Tests are focused, at observable boundaries (stub herdr/harness), cover the above, and pass. No scheduling framework, root JS app, persistent harness config, or out-of-scope edits; canonical roles/skills/P01 evidence unchanged.

## Verification
Run `just test-agent-routing -v` and representative `just agent-routing resolve ...` probes (each role default, explicit `--route` overrides, a disallowed route, a broken config in a temp copy) yourself and record exact commands/results. Do NOT launch real agents/panes (no `start` against the live Herdr). Do not claim model availability.

## Handoff
Write your report (you own it) to `docs/mailbox/agent-routing/reviewer.md` in the main checkout working tree, uncommitted (a later worker will commit it). Include ruach-handoff fields, `reviewed_revision` (existing SHA), commands/results, per-criterion verdicts, findings ordered by severity with location/problem/why/evidence/direction, clearly marked blocking vs optional, or an explicit statement of no material findings. End your turn with a concise handoff summary.
