task: versioned-agent-skills / delivery-coordinator
status: complete
outcome: The three versioned Ruach skills, corrected Claude/Codex launch contracts and root delegation are delivered to local master after combined verification and independent review, and are installed globally as links to the canonical sources.
artifacts:
  - docs/mailbox/versioned-agent-skills/delivery-coordinator.md
  - docs/mailbox/versioned-agent-skills/delivery.md
  - docs/mailbox/versioned-agent-skills/reviewer-main.md
  - docs/mailbox/versioned-agent-skills/integration-main.md
  - docs/mailbox/versioned-agent-skills/implementer-herdr-contract.md
  - docs/mailbox/versioned-agent-skills/implementer-herdr-codex-permissions.md
  - .agents/skills/ruach-herdr/
  - .agents/skills/ruach-handoff/
  - .agents/skills/ruach-harness-eval/
  - scripts/agent-routing.py
  - .agents/agents/coordinator.md
  - master
verification:
  - "Worker-run combined verification at tested_revision (integration-main.md): frozen installs; root 13, herdr 107, handoff 24, harness-eval 59 tests passed; real root surface resolve/rejection probes for all five roles and declared alternatives; 18 worker resolve and start --dry-run --permissions auto-review preparations with no panes or submissions, including the preferred Claude Architect; skill format checks; handoff validation of task reports; read-only scope-check; temporary-HOME global-link portability; P01/P02 protected-path diff empty."
  - "Independent Reviewer reran the suites (203 tests), 16 root probes, the 18-preparation matrix and adversarial/portability probes at reviewed_revision (reviewer-main.md)."
  - "Delivery (delivery.md): fast-forward-only from destination_before to delivered_revision; technical content equal to reviewed_revision with only evidence files differing; frozen installs in canonical skill directories; global links resolve to canonical files matching delivered Git objects; global-path help/offline/dry-run/validation checks and root Architect resolution passed; delivered root suite 13 passed; main checkout clean."
  - "Not run: live harness sessions, paid model turns, live role/skill discovery, workflow catalog visibility inside launched sessions, browser checks (P01/P02 content unchanged). The fresh discovery evaluation remains the parent's separate action. The Coordinator ran no checks itself."
review:
  - "Independent Reviewer: no blocking or optional findings at reviewed_revision (reviewer-main.md). Earlier skill-only reviews reviewer.md, reviewer-2.md and reviewer-3.md apply to the superseded candidate."
discoveries:
  - "Corrected Claude contract: blanket refusals for account-synced, managed, enterprise, plugin, legacy and linked-worktree sources were removed; workers get the canonical role and a self-contained assignment; the launcher never supplies workflow bodies; known repository workflows get a per-launch suppression overlay; full native catalog visibility is a documented, unverified, nonfatal limitation."
  - "Codex: a matching running app-server daemon is preferred; otherwise a short-lived stdio app-server reads effective layered config and the skill catalog. That fallback may initialize Codex runtime state (state database, installation_id, bundled system skills) but never writes user config. Only resolve --offline is fully write-free."
  - "Integration found that delegation had dropped the root launcher's automatic approval review. It was restored through the portable --permissions auto-review option, which adapters map to verified native flags; root code holds no native flags."
  - "Compatibility changes in the root command: resolve uses offline selection and returns worker JSON; --pane is retired with a diagnostic; Bun comes from BUN_BIN, then ~/.bun/bin/bun, then PATH."
  - "Adapter limits: pi, opencode and dsh are not installed, and dsh is not a Herdr kind; omp and agy role-contribution and workflow-exclusion mechanisms are unverified. All five fail before mutation and have fixture-only coverage."
  - "Global links: ~/.agents/skills/ruach-herdr, ruach-handoff and ruach-harness-eval point to /opt/dev/tehom-brainlab/.agents/skills/ with the same names. No collision occurred; the existing unrelated find-skills and herdr skills were preserved."
blockers: []
tested_revision: 8ea1c677e88b4c0d9b96646719836cae721c3454
reviewed_revision: 8ea1c677e88b4c0d9b96646719836cae721c3454
delivered_revision: 50420314efb474122d4570beac6fe704cccb9dff
destination_before: 97752643b31cdcf8c8ec9f09204382c6766b1573
delivery_record_revision: fa1221d

Author: Coordinator (Claude). Date: 2026-10-04 UTC. Workflow: ruach-workflow-feature. Workers ran GPT-6.1-Sol/high through the temporary bootstrap bridge. The documentation-only commit that adds this report is reported in the terminal handoff; this report does not state that commit's SHA. No push, publication, branch/worktree cleanup, prototype change or harness-settings change was made.

## Sequence

1. Contract corrections in `ruach-herdr`: Claude correction `97e7c09`; Codex stdio fallback and portable permission policy `97ced69`. Evidence is in [implementer-herdr-contract.md](implementer-herdr-contract.md) and [implementer-herdr-codex-permissions.md](implementer-herdr-codex-permissions.md).
2. Main integration on `versioned-agent-skills-main`, based on `destination_before`. It merged the reviewed skills branch `90ac37b` (resolving the `.agents/README.md` conflict), made the root launch command a thin delegation to the skill, merged the corrections, and restored root auto-review. See [integration-main.md](integration-main.md).
3. Independent review of `8ea1c67`: no findings. See [reviewer-main.md](reviewer-main.md).
4. Fast-forward delivery to master and global installation. See [delivery.md](delivery.md).

## Remaining for the parent

- The fresh neutral discovery evaluation; it was not launched or coached here.
- Live session confirmation of role injection, workflow suppression and model identity for Claude and Codex routes.
