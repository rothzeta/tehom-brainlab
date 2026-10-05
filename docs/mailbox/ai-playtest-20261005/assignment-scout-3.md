# Assignment AIP-3 — AI playtester 3 (Scout)

Role: `scout` (follow `.agents/agents/scout.md`). You are acting as an **AI playtester**: you play the game and report evidence-based findings. You do not modify the game.
Coordinator: the Claude Coordinator session in the main checkout.

## Goal

The user wants playtest feedback on POC 001, the linked-formation combat prototype, before sharing their own thoughts. Play the real game through its real browser UI. Report what you decided, why, and how the game responded. Tie every claim to an exported attempt record or a screenshot.

## What the game is

Read these first, and do not read source code beyond what you need to drive the UI:

- `docs/prototypes/poc-001-linked-formation.md`, the design brief, including the Decision record;
- the prototype `poc-001-linked-formation/README.md`, sections "Playable patrol (P10)" and "Reproducible attempts (P11)";
- `docs/playtests/TEMPLATE.md` and `docs/playtests/2026-10-05-poc-001-p11-automated.md`, the automated evidence and the "How to run a real attempt" section.

In short: three Brood (Ugallu, Girtablilu, Pazuzu) are linked in a formation on a 19-cell, two-ring board around an enemy patrol at the centre. Each round you get one shared maneuver (rotate, expand, contract) and actions with each Brood's two abilities, against enemy intentions announced in advance.

## How to play

- Workspace: `/opt/dev/tehom-brainlab-aiplay`, branch `ai-playtest-20261005`. Dependencies are already installed. Two other playtesters share this checkout; do not touch their files or servers.
- Start your own dev server on **port 5183**: `POC001_PORT=5183 just poc-001-dev`, running in the background. Request Docker escalation if needed. Open `http://localhost:5183/?play=patrol`. Stop your server when you finish.
- Drive the UI the way a player would: visible controls, hover or keyboard previews, confirm, end phase, restart, export. Use headless Chrome through CDP, as the existing `tests/browser-*.mjs` scripts do. The Chrome binary is the newest under `~/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell`. Read the visible text and readouts, and take screenshots and look at them so you see what a player sees. Write any driver scripts in the OS temp directory, never in the repository. **Do not call core functions to make decisions or to "cheat" outcomes.** Decide from what the UI shows.
- Play **at least three complete attempts** to victory or defeat. Primary preset: **wounded-girtablilu**. Play it at least twice, with different strategies, and at least one other preset once. Before each round, write down your plan and reasoning from the visible information, then compare it with what happened.
- After each attempt, use **Export attempt (JSON)**. Save the file as `docs/mailbox/ai-playtest-20261005/scout-3-attempt-<k>.json` and verify it with `just poc-001-replay <file>`.

## Lens

**Formation-focused.** Concentrate on the core experiment: does choosing Compact (tight against the middle) or Spread (wide around it), and rotating, create meaningful positional decisions against the enemy intentions? Deliberately try strategies that favour each shape. Report whether position ever mattered, or whether the abilities dominated.

## What to report

Write `docs/mailbox/ai-playtest-20261005/scout-3.md`, starting with the `ruach-handoff` YAML block. Cover:

1. **Attempts table:** preset, strategy, rounds, outcome, final HP, record file, and whether the replay matched.
2. **Decisions per attempt:** a round-by-round summary of what you chose and why, from the visible information. Separate your actual reasoning at the time from hindsight.
3. **The P11 questions:**
   - Did target priority or ability order change with the situation?
   - Were maneuver or hold decisions purposeful? Did "tight against" versus "wide around" matter?
   - Did you fall into an automatic formation loop?
   - Were there turns with no worthwhile contribution (dead turns)?
4. **Readability:** what was clear or confusing in the board, links, intentions, previews, forecast, logs and labels. Include screenshots, saved as `scout-3-*.png` and only those that support a point.
5. **Defects:** any bug or mismatch, with exact reproduction steps and evidence. Mark any attempt a defect contaminated.
6. **Interpretation and suggestions,** clearly separated from observations. What felt like an interesting decision, what felt flat, and the top three changes you would try.
7. **Limits:** you are an AI agent driving a headless browser, not a human player. State what this evidence can and cannot tell the user. Never present your output as human enjoyment or preference.

## Restrictions

- Do not modify application source, tests, scripts, plans, ADRs, `docs/playtests/`, `docs/CURRENT.md` or `docs/TASK_LOGS.md`. Write only your own `scout-3*` files.
- Commit **only your own files**, together with this assignment unchanged: `git add docs/mailbox/ai-playtest-20261005/scout-3* docs/mailbox/ai-playtest-20261005/assignment-scout-3.md && git commit -m "..."`. Another tester may hold the git index lock; if so, wait and retry. Do not merge, push or rebase.
- Run `bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/ai-playtest-20261005/scout-3.md --repo /opt/dev/tehom-brainlab-aiplay` until it reports `ok: true`.

## Terminal handoff

Report path, report-creating SHA, attempts and outcomes, your three most important findings, and any defects.
