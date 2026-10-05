# Assignment RF-fix — reset-preview failure and presentation decisions (Implementer)

Role: `implementer`. You implemented RF. Continue in `/opt/dev/tehom-brainlab-ring` on `ring-formation`. HEAD `8039a02` contains your blocked handoff.

## Coordinator disposition

1. **Reset-preview failure (`tests/browser-patrol.mjs:361`). You are authorised to investigate and fix it in application code (`CombatScene`/`patrol-session` and related view files). Preserve the assertion unchanged.**
   - The assertion's contract is correct for players: after Restart, the fresh battle must show no stale preview until the player hovers or focuses a control again.
   - Find the actual cause first, for example pointer re-entry after a controls rebuild, or a hover or focus handler firing on the rebuilt DOM. Record whether it is a real application defect or test-harness nondeterminism.
   - If it is a real defect, fix the application. If it is nondeterminism in the harness, make the browser driver deterministic without weakening the assertion: same inputs, same expectation. Justify that conclusion with evidence, and show that the application behaviour is correct.
   - Run the full bare browser suite **at least three consecutive times**, all passing, to show the flake is gone.
2. **No-scroll criterion.** It applies to the initial Compact and Spread battle states and the default lab at 1280×800. Selected-ability, multiline-preview and expanded-log states may scroll vertically. Record the scrolling as a known readability item in your report. Make no layout redesign.
3. **Formation-lab ghost-label overlap.** You are authorised to make a bounded presentation fix in the lab's ghost-label placement (P04 view files) so that every destination label, including Girtablilu's, is legible for all Compact and Spread previews. Add one browser assertion or screenshot check for it. Do not change other P04 assertions.

## Verification on the committed fix

- `just poc-001-test`, `just poc-001-typecheck` and `just poc-001-build`.
- **`just poc-001-test-browser` bare, with `POC001_CHROME` unset (show `env | grep POC001` is empty), three consecutive passing runs.**
- `git diff --check`.
- The unedited-suites check against the RF plan BASE. This must confirm that `browser-patrol.mjs:361` is unchanged.
- Inspect the lab ghost labels and the patrol screenshots yourself.

## Output

Write `docs/mailbox/ring-formation/fix.md`, starting with the ruach-handoff YAML block (fixed_revision, tested_revision, cause found, verification, blockers). Commit it with this assignment unchanged and validate until `ok: true`. Do not edit earlier reports, protected documents or plans. Do not merge, push or rebase.

Terminal handoff: report SHA, fixed technical revision, the cause and fix, results of the three browser runs, and blockers.
