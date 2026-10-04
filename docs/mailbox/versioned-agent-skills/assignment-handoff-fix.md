# Bounded fix: skills-impl-handoff (review evidence on combined candidate 4e8d7d3)

Same worktree/branch/ownership as before (/opt/dev/tehom-brainlab/.agents/scratch/versioned-agent-skills-handoff, versioned-agent-skills-handoff at b12aa88; `.agents/skills/ruach-handoff/**`). New report: docs/mailbox/versioned-agent-skills/implementer-handoff-fix.md. Common rules in common.md apply.

Reviewer evidence: running the skill's documented `bun test` concurrently with other suites gave 22 pass / 2 fail — two multi-probe tests exceeded Bun's default 5s per-test timeout (child output interrupted); `bun test --timeout 20000` gave 24/24. Make the documented `bun test` reliable under ordinary load without weakening assertions (e.g. explicit per-test timeouts proportionate to the number of CLI probes, or splitting multi-probe tests). Do not change validator behavior unless you find a real defect (report it if so).

Verification: frozen install; full `bun test` with default settings run while another CPU-heavy process runs (e.g. run the suite 3 times concurrently) and report counts; quick validator. Commit fix, then your report (validate it with the skill's validate.ts). Handoff via ruach-handoff with fix/tested SHA; report commit SHA in terminal handoff.
