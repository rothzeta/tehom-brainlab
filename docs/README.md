# TEHOM Brainlab documentation vault

`docs/` is the Obsidian vault root. Open this directory as a vault; this note is its entry point. All notes also remain readable as ordinary Markdown in Git.

| Start here | Purpose |
| --- | --- |
| [SCHEMA](SCHEMA.md) | Vault structure, note roles, naming, and linking conventions |
| [CURRENT](CURRENT.md) | Current implementation facts and limits |
| [TASK_LOGS](TASK_LOGS.md) | Dated work and executed verification |
| [Lexicon](lexicon/README.md) | Canonical terms and distinctions |
| [ADRs](adr/README.md) | Accepted decisions and their authority |
| [Plans](plans/README.md) | Delivery sequence, bounded plans, and task specifications |
| [Exploitation](exploitation/README.md) | Operational procedures and records for delivered tools |
| [Prototype briefs](prototypes/README.md) | Experiment scope, hypotheses, and acceptance questions |
| [Playtests](playtests/README.md) | Observed outcomes tied to tested commits and conditions |
| [Mailbox](mailbox/README.md) | Durable worker findings, reviews, and handoffs |

Read relevant ADRs and current evidence before creating plans or tasks. A decision describes an obligation, a plan describes intended work, and a task log records actual execution. Setup and run instructions belong in the owning prototype README.

[Agent work artifact conventions](SCHEMA.md#agent-work-artifacts) define durable handoffs in `docs/mailbox/` and local working files in `.agents/scratch/`. Canonical designs and plans remain in this vault; handoffs reference them.

The game-design documentation comes from the TEHOM Brainlab planning conversation of 2 October 2026. It does not replace the complete TEHOM project overview, which has not been copied into this repository. POC 001 is not playable, and no playtests have been recorded.
