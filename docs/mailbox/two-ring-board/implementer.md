task: TR-impl
role: implementer
status: complete
outcome: "Implemented TR.C1–TR.C4: 19-cell arena, sector-aligned Compact, corner Spread, ring-1/2 masks, readable lab and updated public contracts. All eleven acceptance criteria verified."
baseline: 0a48098ff439bc84df06f5f8e965531d69e0dba2
starting_revision: ebc26d63488c37aba6a6eb0470cde6a4a6461839
candidate_revision: 2e98a276a11c0ed7db117c34dd8374ce9d5c956d
tested_revision: 2e98a276a11c0ed7db117c34dd8374ce9d5c956d
artifacts:
  - docs/mailbox/two-ring-board/implementer.md
  - docs/mailbox/two-ring-board/assignment-implementer.md
  - docs/mailbox/two-ring-board/compact-0.png
  - docs/mailbox/two-ring-board/spread-0.png
  - branch two-ring-board
verification:
  - "Docker frozen install: exit 0, Bun 1.4.2, 43 packages."
  - "Final committed candidate focused suites: exit 0, 3 files, 217 tests, 2476 actual matcher assertions."
  - "Final committed candidate full suite: exit 0, 7 files, 278 tests, 2926 actual matcher assertions, including supplementary counters for unchanged smoke/view/assets suites."
  - "Final committed candidate typecheck and build: exit 0 each, 9 assets prepared and 18 modules transformed."
  - "Final built candidate Chrome check: exit 0, HeadlessChrome 148.0.7778.96, 1280×800, 177 assertions, all 36 token hit tests, 12 fixtures, 3 asset modes, 18 captures, zero uncaught exceptions. Required screenshots individually inspected; Compact and Spread evidence retained."
  - "BASE..candidate whitespace and protected application-path checks: exit 0. Starting revision..candidate protected design/agent paths: exit 0. RING_TWO declaration and recipient tables byte-identical to BASE."
  - "Leading ruach-handoff validator with --repo: exit 0, ok true, no diagnostics."
review: not-run
discoveries:
  - "Ugallu remains in place through Expand/Contract. In the initial expansion capture its destination caption overlapped a Close label; shifting ghost captions upward 18 px makes both texts readable. No token or link-label geometry changes."
  - "Existing large Phaser chunk warning remains."
blockers: []

Author: two-ring-board Implementer, 2026-10-04 UTC. Worktree `/opt/dev/tehom-brainlab-tworing`, branch `two-ring-board`. Governing [assignment](assignment-implementer.md), [TR plan](../../plans/2026-10-04-d005e5f4-poc-001-two-ring-board.md), accepted brief/P02/P04/P05/P06 amendments and [Architect report](architect.md). Read ADR-0006, consumer policy, role, testing and handoff skills. Technical candidate and tested revision are identical above; the later report commit contains only evidence and the unchanged assignment. Its creating SHA is returned in the terminal handoff. Independent review, Coordinator acceptance and delivery remain pending. No merge, push, rebase, branch/worktree deletion or human playtest.

## Changes and checkpoints

Nine technical paths changed, all under `poc-001-linked-formation/`:

- `src/core/hex.ts`: 19-cell board; frozen clockwise RING_ONE/S; removed OUTER_RING; RING_TWO/T declaration byte-identical to BASE.
- `src/core/formation.ts`: Compact `T[2o],T[2o+1],S[o]`; Spread `T[2o],T[(2o+4)%12],T[(2o+8)%12]`; corrected mapping and rotation comments.
- `src/core/sectors.ts`: ordered three-cell sectors, unchanged front concatenation and turn logic.
- `src/view/FormationLab.ts`: 120 px pitch, unchanged `(380,295)` origin and 760×610 stage; legend derives `boardCells().length`.
- `src/view/lab.css`: ghost-caption top changes −22 to −40 px after screenshot inspection showed overlapping preview text. This is the plan's conditional screenshot-driven CSS allowance.
- `tests/formation.test.ts`, `tests/intents.test.ts`, `tests/browser-lab.mjs`: only the enumerated exceptions below.
- `README.md`: current board/ring/mapping/link/mask/anchor and lab contracts.

TR.C1's formation check passed 92 tests/1361 matchers. TR.C2's formation/intents/damage check passed 217 tests/2476 matchers, including unchanged damage. TR.C3 passed build/browser and visual inspection. TR.C4 updates the README and verifies everything against the final committed candidate.

No intent-selector logic/comment change was needed; `intents.ts` has no radius-three comment. No geometry abstraction, enemy placement rule, enemy token, damage/radius/threshold tuning or P07+ work was introduced. All protected application files and tests are byte-identical to BASE. Architect-owned brief/plans/ADRs and agent definitions are byte-identical to the starting revision; their pre-existing design changes are distinguished from this implementation.

## Every pre-existing test edit and its reason

All expectations are independently transcribed from the accepted TR fixture, not generated from implementation outputs. No test was deleted or weakened.

### `tests/formation.test.ts` — exception items 1–7

1. **Fixtures:** remove radius-three `ring`, add handwritten `ringOne`/S, preserve `ringTwo`/T byte-for-byte, replace the six-row Compact table with TR coordinates.
2. **C1 board case:** 37/radius-three becomes 19/radius-two; retain uniqueness/integer/bounds coverage, compare both ring subsets against T/S, and require `(0,0)`; assertion count 4 → 6.
3. **C1/C4 ring case:** replace OUTER_RING/R's 18 indices and +3 turn with RING_ONE/S's six indices and +1 turn. Require exact S, length/uniqueness, every cell at radius 1, frozen table and cells, and every axial turn; 21 → 11 assertions. The CT T-table and adjacency tests remain unchanged.
4. **Ordered board-pair distance case:** only `expect.assertions(37*37*2)` → `19*19*2`; still checks both distance formulations and integrality for every ordered pair.
5. **Twelve C2 mapping cases:** Compact reads the independent TR table; Spread reads independent T at offsets `[0,4,8]` from `2o`, mod 12; radii become `[2,2,1]` / `[2,2,2]`. Preserve roster, overlap and exact cell assertions.
6. **Twelve C4 link cases:** only Spread distances `[6,6,6]` → `[4,4,4]`; Compact `[1,1,1]`, endpoints, pair order, integer and threshold-two classification remain.
7. **Inclusive configurable-threshold case:** Spread boundary 5/6 → 3/4; Compact 1/0 remains.

C2/C5 distinct labelled states, both C3 tests, C6 immutability, invalid input/errors, arbitrary frozen-coordinate distance and invalid threshold tests are unchanged. Count remains 92 tests. Actual matchers 3385 → 1361: −2016 from the smaller all-board-pairs domain, −10 from the smaller ring plus added radius/freeze checks, +2 from board membership checks.

### `tests/intents.test.ts` — exception items 1, 3, 4; item 2 preserved

1. **Fixtures:** independent T and S tables, handwritten three-cell sectors, same ordered front construction, TR Compact slots and corner Spread indices. Existing tests consume these fixtures without other body changes.
2. **Protected tables:** `areaRecipients` and `turnedRecipients` are byte-identical to BASE; every area/protection value is preserved.
3. **CT/AC1 partition case:** 30 radius-two/three becomes 18 radius-one/two; preserve length, uniqueness and full union coverage, and add centre exclusion.
4. **CT inward-Pazuzu protection/area case:** singleton area and returned cell `(1,1)` → `(1,0)`; protection and exact singleton recipient remain unchanged.

Every other test body is unchanged, including the Close/splash boundary and orientation-two outside-sector case. Count remains 77 tests; actual matchers 809 → 810 (centre exclusion).

### `tests/browser-lab.mjs` — exception items 1–3

1. Existing board-count assertion 37 → 19.
2. Add visible `.legend` text assertion for `19 cells`.
3. Contraction assertion message `ring-two Pazuzu` → `ring-one Pazuzu`; its exact core-output comparison remains unchanged.

All other assertions, including all 36 per-token physical hit tests, remain unchanged. Total 176 → 177. Protected damage, commands, view, smoke and asset-copy suites were neither edited nor weakened and pass.

## Final-candidate verification

Commands ran from the worktree root. Application commands use default Docker mode, pinned Bun 1.4.2 and Vitest 5.0.3. Docker, Git worktree metadata writes and Chrome localhost access used sandbox escalation. Host Bun `/home/metatron/.bun/bin/bun` is version 1.4.2 and is used only for the assigned browser/validator and output probe, never as an application host-mode fallback.

| Exact command | Exit and result |
|---|---|
| `just poc-001-install` | 0; frozen lock, 43 packages. Before technical commits; no lockfile change. |
| `just poc-001-test tests/formation.test.ts tests/intents.test.ts tests/damage.test.ts` | 0; 3 files / 217 tests / 2476 matchers at final candidate. |
| `just poc-001-test` | 0; 7 files / 278 tests, unchanged from delivered 278. Suite counters: formation 1361, commands 253, intents 810, damage 305. |
| `just poc-001-typecheck` | 0; `tsc --noEmit`. |
| `just poc-001-build` | 0; 9 files prepared, 18 modules transformed. Existing >500 kB Phaser chunk warning; output succeeds. |
| `just poc-001-preview` | Served localhost:4173; remained up through final rebuild. Cache-disabled Chrome navigation loaded final assets. Stopped with Ctrl-C, exit 130. |
| `/home/metatron/.bun/bin/bun poc-001-linked-formation/tests/browser-lab.mjs /home/metatron/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell /tmp/tr-browser-caption-final` | 0; HeadlessChrome/148.0.7778.96, CDP 1.3, 1280×800, scale 1; 177 assertions, 12 fixtures, three modes, 18 captures, zero exceptions, two intentionally blocked image failures. |
| `git diff --check 0a48098ff439bc84df06f5f8e965531d69e0dba2..HEAD` | 0; clean at candidate. |
| Protected-path commands below | 0 each; no implementation edits to protected paths. |
| `/home/metatron/.bun/bin/bun .agents/skills/ruach-handoff/scripts/validate.ts docs/mailbox/two-ring-board/implementer.md --repo /opt/dev/tehom-brainlab-tworing` | 0; `ok: true`, no diagnostics, all four revision fields resolved. |
| `docker ps --filter publish=4173 --format '{{.ID}} {{.Ports}}'` | 0; no preview container after shutdown. |

Actual full-suite matcher total is **2926**: 2729 from existing suite counters plus 197 from the unchanged uninstrumented suites. Compared with delivered 4949, the reduction is 2023 matchers, fully explained by the board-domain/ring changes and the additional centre assertion above. The supplementary command below passed at the final candidate (3 files / 24 tests: smoke 2, view 180, asset-copy 15 matchers):

```sh
docker run --rm --init --user "$(id -u):$(id -g)" --env HOME=/tmp --env BUN_INSTALL_CACHE_DIR=/tmp/bun-cache --env POC001_PORT=0 --volume /opt/dev/tehom-brainlab-tworing/poc-001-linked-formation:/app --volume /opt/dev/tehom-brainlab-tworing/assets:/assets:ro --volume /tmp/tr-assertions:/tr-evidence --workdir /app oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 sh ./scripts/toolchain.sh test tests/view.test.ts tests/smoke.test.ts tests/asset-copy.test.ts --config /tr-evidence/vitest.config.mjs
```

Disposable `/tmp/tr-assertions/vitest.config.mjs` spreads `/app/vitest.config.ts` and adds only `/tr-evidence/count.mjs` as a setup file. That setup imports Vitest `afterEach`, `afterAll`, `expect`, sums `expect.getState().assertionCalls` after each test and prints the total per file. Repository test/config files were not changed.

Protected-path verification commands (HEAD was the final candidate):

```sh
git diff --exit-code 0a48098ff439bc84df06f5f8e965531d69e0dba2..HEAD -- poc-001-linked-formation/src/core/damage.ts poc-001-linked-formation/src/core/lifecycle.ts poc-001-linked-formation/src/core/transition.ts poc-001-linked-formation/src/core/commands.ts poc-001-linked-formation/src/core/state.ts poc-001-linked-formation/src/core/smoke.ts poc-001-linked-formation/src/view/projection.ts poc-001-linked-formation/src/view/lab-state.ts poc-001-linked-formation/src/main.ts poc-001-linked-formation/tests/damage.test.ts poc-001-linked-formation/tests/commands.test.ts poc-001-linked-formation/tests/view.test.ts poc-001-linked-formation/tests/smoke.test.ts poc-001-linked-formation/tests/asset-copy.test.ts poc-001-linked-formation/package.json poc-001-linked-formation/bun.lock poc-001-linked-formation/vite.config.ts poc-001-linked-formation/scripts poc-001-linked-formation/bin justfile assets docs/CURRENT.md docs/TASK_LOGS.md
git diff --exit-code ebc26d63488c37aba6a6eb0470cde6a4a6461839..HEAD -- docs/plans docs/prototypes docs/adr .agents
```

ADRs already differ from BASE because of the Architect's authorized amendment. Comparing protected design/agent documents against the starting revision verifies that this worker did not edit them. A read-only `python3` heredoc also compared `hex.ts` from its `/** P02 ring T:` marker to EOF with `git show BASE:path`, and the intents-test text from `const areaRecipients` through `const states:` with BASE: both byte-identical. It checked the `CLOSE_THRESHOLD = 2` and `SPLASH_RADIUS = 2` declarations; exit 0, four checks. DEFAULT_DAMAGE_RULES is in the protected unchanged damage module.

Exact byte/constant probe, repeated at final candidate, exit 0:

```sh
python3 - <<'PYPROBE'
from pathlib import Path
import subprocess
base='0a48098ff439bc84df06f5f8e965531d69e0dba2'
path='poc-001-linked-formation/src/core/hex.ts'
old=subprocess.check_output(['git','show',f'{base}:{path}'],text=True)
new=Path(path).read_text()
assert old[old.index('/** P02 ring T:'):]==new[new.index('/** P02 ring T:'):]
path='poc-001-linked-formation/tests/intents.test.ts'
old=subprocess.check_output(['git','show',f'{base}:{path}'],text=True);new=Path(path).read_text()
assert old[old.index('const areaRecipients'):old.index('const states:')]==new[new.index('const areaRecipients'):new.index('const states:')]
assert 'export const CLOSE_THRESHOLD = 2;' in Path('poc-001-linked-formation/src/core/formation.ts').read_text()
assert 'export const SPLASH_RADIUS = 2;' in Path('poc-001-linked-formation/src/core/intents.ts').read_text()
print('Byte-identical RING_TWO declaration and recipient tables; unchanged threshold/radius: 4 checks passed')
PYPROBE
```

Earlier checks at `614e3b256383e4a5386baea0ecf011f986a9b400` passed full/focused/typecheck/build/browser (177 assertions, zero exceptions); screenshots then identified the caption overlap. These are preliminary evidence only. All required candidate checks were repeated after the CSS commit. No failing assertion, stop condition, permission rejection or unresolved blocker occurred.

## Orientation-zero serialized output

Executed at final candidate, exit 0:

```sh
/home/metatron/.bun/bin/bun -e 'import { formationPositions, formationLinks } from "./poc-001-linked-formation/src/core/formation.ts"; for (const shape of ["compact", "spread"] as const) { const formation = { shape, orientation: 0 as const }; console.log(JSON.stringify({ formation, positions: formationPositions(formation), links: formationLinks(formation) })); }'
```

```json
{"formation":{"shape":"compact","orientation":0},"positions":[{"brood":"ugallu","cell":{"q":2,"r":0}},{"brood":"girtablilu","cell":{"q":1,"r":1}},{"brood":"pazuzu","cell":{"q":1,"r":0}}],"links":[{"from":{"brood":"ugallu","cell":{"q":2,"r":0}},"to":{"brood":"girtablilu","cell":{"q":1,"r":1}},"distance":1,"state":"close"},{"from":{"brood":"ugallu","cell":{"q":2,"r":0}},"to":{"brood":"pazuzu","cell":{"q":1,"r":0}},"distance":1,"state":"close"},{"from":{"brood":"girtablilu","cell":{"q":1,"r":1}},"to":{"brood":"pazuzu","cell":{"q":1,"r":0}},"distance":1,"state":"close"}]}
{"formation":{"shape":"spread","orientation":0},"positions":[{"brood":"ugallu","cell":{"q":2,"r":0}},{"brood":"girtablilu","cell":{"q":-2,"r":2}},{"brood":"pazuzu","cell":{"q":0,"r":-2}}],"links":[{"from":{"brood":"ugallu","cell":{"q":2,"r":0}},"to":{"brood":"girtablilu","cell":{"q":-2,"r":2}},"distance":4,"state":"stretched"},{"from":{"brood":"ugallu","cell":{"q":2,"r":0}},"to":{"brood":"pazuzu","cell":{"q":0,"r":-2}},"distance":4,"state":"stretched"},{"from":{"brood":"girtablilu","cell":{"q":-2,"r":2}},"to":{"brood":"pazuzu","cell":{"q":0,"r":-2}},"distance":4,"state":"stretched"}]}
```

## Acceptance mapping

| TR criterion | Observable evidence |
|---|---|
| 1 — exact 19-cell board | C1 membership/uniqueness/integer/radius test against independent T/S and centre. |
| 2 — frozen rings, steps, removal | S and unchanged CT T tests check exact cells, freezing and every axial step; byte comparison above; successful typecheck; no OUTER_RING consumer in source or current README. |
| 3 — exact twelve mappings/distances/no centre | Twelve C2 mapping/radius/uniqueness cases, six Compact adjacency cases, C4 links. Declared positive radii exclude centre. |
| 4 — labels/order/reversibility | Unedited C2/C5 twelve-distinct-state and Spread 0/2 label checks, all C3 inverse/six-turn/shape-roundtrip/axial-turn tests. |
| 5 — default and configurable links | C4 threshold-two values, configurable 0/1/3/4 boundaries, browser default-core links in all twelve fixtures, serialized output; protected unchanged constants/rules. |
| 6 — ordered sectors/fronts/partition | Six AC1 independent exact-sector/front checks, partition plus centre exclusion, six AC4 turned-front/wrap checks. |
| 7 — recipients/marks/protection/isolation | Unedited outcomes across all twelve states/every legal maneuver, source turn, living/fallen Girtablilu, singleton inward Pazuzu area/protection; recipient tables byte-identical. |
| 8 — unedited P06/P03/P04 suites | Full suite passes; protected damage/commands/view/smoke/asset-copy diffs empty. |
| 9 — lab/preview/hit tests/layout | Final Chrome 177 assertions, all twelve fixtures, all 36 token hit tests, 19-cell DOM and legend, exact expand/contract ghosts and commits, zero exceptions, 1280×800 fit; required visual inspections below. |
| 10 — README contracts | Updated P02/P05/P04 paragraphs specify 19 cells, T/S, Compact/Spread, 1/4 distances, rings 1–2, sole unmasked centre and view-only enemy cluster. Read inspection and search found no obsolete geometry claim. Historical test-count 37 refers to P03 tests, not board cells. |
| 11 — errors/immutable inputs | Unedited formation/coordinate/threshold errors and C6 frozen inputs; unchanged commands/intents/damage/view invalid/frozen contract cases all pass. |

## Visual evidence and limits

Final `/tmp/tr-browser-caption-final/normal.png`, every `fixture-0.png` through `fixture-5.png`, `fixture-6.png` (Spread zero) and `expand-preview.png` were individually opened and inspected after the final build. At 120 px pitch the complete board fits the 760×610 stage; all three tokens and their names are separated in every Compact orientation. Close captions lie outside each triangle and cover no token. The top/bottom orientations remain on screen with readable labels. Spread's three tokens, dashed links and captions are readable. Expansion ghosts and their captions fit the viewport, and the adjusted destination text and Close text remain readable. Chrome asserts contraction's ring-1 destination and committed equality as well as expansion's exact ghosts. No CSS token sizing, link-label offset, stage size or origin change was needed.

Retained as required: [Compact zero](compact-0.png), [Spread zero](spread-0.png). SHA-256:

- Compact: `e1ffffe275742f515c720489ce71a1411f16223a9d58e0a23a05bac5c088f746`.
- Spread: `dca82933821c30763aa46dcc934c1d2dc027bb84e13c7b6f0d321e1b86d175aa`.
- Unchanged assignment: `1b8f2c0c6309c16cd6a225f1cf7174f7ff5dc041df3260d790978703231a03f9`.

Other captures, browser JSON/stderr and supplementary counter configuration remain disposable under `/tmp`. Chrome uses its own sandbox, the original script flags and a temporary profile; no sandbox-bypass flags. No human playtest, mobile/browser matrix, combat balance, independent review or delivery acceptance is claimed. Protected-document changes are unnecessary beyond the Coordinator's ordinary implementation/acceptance status updates.
