# Small follow-up: skills-impl-handoff (forward-test friction V2)

Same worktree/branch/ownership (versioned-agent-skills-handoff at 7b47c4d; `.agents/skills/ruach-handoff/**`). Append a short section to your existing fix report docs/mailbox/versioned-agent-skills/implementer-handoff-fix.md? NO — write a new tiny report docs/mailbox/versioned-agent-skills/implementer-handoff-doc.md.

Forward-test evidence: a report with structural (schema) mistakes plus a missing tested_revision returned only schema diagnostics; revision existence (REVISION_MISSING) appeared only after the structure was fixed, because validate.ts exits before revision probing when schema validation fails. Validation is correct; fixing a report can take two passes.

Task: document this ordering concisely in SKILL.md (one or two sentences near the diagnostics/exit contract). Optionally, only if trivially safe and testable, also probe well-typed revision fields when the rest of the schema fails; if you change behavior, add a black-box test and keep the schema/validator parity. Prefer the doc-only change unless the behavior change is clearly simple.

Verification: frozen install, full default `bun test`, quick validator, validate your new report. Commit change then report; ruach-handoff handoff with SHAs (report SHA in terminal handoff).
