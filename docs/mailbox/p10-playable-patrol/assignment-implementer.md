# Assignment P10-impl — playable patrol (Implementer)

Role: `implementer` (follow `.agents/agents/implementer.md`).
Coordinator: the Claude Coordinator session in the main checkout.

## Task and scope

Implement plan P10, [playable patrol](../../plans/2026-10-02-e7c77542-poc-001-playable-patrol.md), including its **Amendment TR**: ring-2 tokens, view-only enemies at the centre, and cluster offsets owned by P10. Cover all of its checkpoints, required contracts and the eight numbered acceptance criteria. The outcome is that all three patrol starts can be played through the real browser interface.

- Workspace: `/opt/dev/tehom-brainlab-p10`, branch `p10-playable-patrol`, BASE `767f46c` (local `master`). Work and commit only here.
- File ownership:
  - `poc-001-linked-formation/src/view/CombatScene.ts`, a thin input/session controller;
  - text controls and readouts;
  - browser tests;
  - the minimal `src/main.ts` routing;
  - the P10 section of the prototype `README.md`.
- Reuse P04 rendering and assets, P08 factories and round loop, and P09 projections and `confirmPreview`. **P03/P08 remain the only command path**: no rules in UI handlers, and no alternate calculations.
- **Browser tests:** prefer the existing dependency-free headless Chrome/CDP approach (`tests/browser-lab.mjs`, `tests/browser-preview.mjs`). Add Playwright or another browser driver only if it is genuinely necessary, and justify it in your report. Any new dependency must be dev-only and pinned in the prototype-local `package.json`/`bun.lock`, which is frozen.
- The plan index says P10 supplies the `test-browser` command. Add a prototype-local script that runs all browser checks (`browser-lab`, `browser-preview` and the new P10 checks), and wire it through the prototype's existing wrapper pattern (`scripts/`/`bin/`). Then add a thin root `just poc-001-test-browser` recipe matching the existing `poc-001-*` recipes. Keep the root justfile change to that one recipe.
- Keep the P04 lab (default route) and the P09 `?preview=patrol` fixture working. The combat UI must expose no individual movement, free fixture teleport, or unplanned ability (criterion 8).
- Existing P01–P09 and two-ring tests, including both existing browser scripts, must pass **unedited**.

## Context

- `docs/CURRENT.md` (current through P09) and `docs/plans/README.md`.
- The P10 plan and its amendment, and the prototype `README.md` public contracts.
- Handoffs:
  - `docs/mailbox/p08-patrol-round-loop/implementer.md`: presets and the executed win/loss transcripts. Criterion 2 needs a recorded winning and losing trace played through visible controls whose final HP and outcome match headless.
  - `docs/mailbox/p09-preview-equivalence/implementer.md` and `fix.md`.
  - `docs/mailbox/p04-formation-lab/implementer.md`: browser command and placeholder mode.
- Tooling: Bun, Docker by default. Request escalation for Docker and local network rather than using host mode for application checks.
- Testing follows ADR-0006 and `ruach-testing`. Do not freeze provisional defaults in browser assertions. Derive expected values from the stored fixture rules through public core functions, or from explicit test-owned inputs. The P09 review blocked on exactly this.

## Acceptance conditions

1. All eight P10 acceptance criteria are met, mapped criterion by criterion to observable browser evidence. This includes normal and placeholder modes, and no application-origin unhandled errors.
2. Browser play of the recorded winning and losing traces reaches the same final HP and outcome as the headless P08 results.
3. The full suite, typecheck, build and `just poc-001-test-browser` all pass. Existing tests are unedited.

## Verification

On your final committed candidate, run:

- `just poc-001-test`, `just poc-001-typecheck` and `just poc-001-build`;
- `just poc-001-test-browser`, plus each browser script it aggregates;
- `git diff --check`;
- the unedited-tests check against BASE.

Inspect screenshots of each preset start, a terminal win, a terminal loss and placeholder mode yourself. Keep a few as evidence under `docs/mailbox/p10-playable-patrol/`. Record exact commands, exit codes, counts and the tested revision. **Do not claim a human playtest.** Automated browser play is not one.

## Restrictions

- Do not edit `docs/CURRENT.md`, `docs/TASK_LOGS.md`, ADRs, the brief, plans or the index. Propose corrections in your report.
- Do not merge, push, rebase, or delete branches or worktrees. Keep disposable files in the OS temp directory.

## Expected output

Commit this assignment unchanged with your report at `docs/mailbox/p10-playable-patrol/implementer.md`. The report starts with the `ruach-handoff` YAML block. Run the validator with `--repo /opt/dev/tehom-brainlab-p10` until it returns `ok: true`.

Terminal handoff: report path, report-creating SHA, technical candidate SHA, pass/fail summary, any new dependency with justification, and blockers.
