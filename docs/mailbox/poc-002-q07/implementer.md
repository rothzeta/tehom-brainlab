task: P2-Q07
status: complete
outcome: Labelled enemy art, non-overlapping hit regions, portraits, state styling, background and UI credits implemented
source_baseline: 87b1441
candidate_revision: ccd1abc343631e717bf3f6d70b73e4bab845e8a8
tested_revision: ccd1abc343631e717bf3f6d70b73e4bab845e8a8
artifacts:
  - poc-002-component-combat/src/view/art/index.ts
  - poc-002-component-combat/tests/q07-art.test.ts
  - docs/mailbox/poc-002-q07/assignment-implementer.md
  - docs/mailbox/poc-002-q07/implementer.md
verification:
  - "Bare install, typecheck, test, build and test-browser: exit 0; 57 unit tests, including 20 Q07 tests; 6 browser assertions"
  - "git diff --check 87b1441..HEAD at implementation commit: exit 0"
  - "Copied ruach-handoff validator with --repo .: exit 0, ok true, no diagnostics"
review: not-run
discoveries:
  - "Q05 must translate panel-local draw bounds and hit regions together and keep native logical panel sizes"
  - "Art adds presentation-only exports; the Q01 enemyArt and broodPortrait signatures and core contracts remain unchanged"
blockers: []

# Implementer handoff — P2-Q07

Author: Implementer. Branch `p2-q07`, worktree `/opt/dev/tehom-brainlab-p2-q07`.
Assignment: [unchanged Coordinator assignment](assignment-implementer.md).
Authority: [plan Q07](../../plans/2026-10-19-db0bad72-poc-002-component-combat.md#q07--placeholder-art-and-hit-regions), [brief](../../prototypes/poc-002-component-combat.md) §8 (parts), §4.1 (shielding), §11 (invalid target information), and its presentation requirements; ADR-0006 and ADR-0007.
Read the merged [Q01 handoff](../poc-002-q01/implementer.md); Q01 is this checkpoint's sole dependency.

## Changes and ownership

Implementation commit: `ccd1abc343631e717bf3f6d70b73e4bab845e8a8`.
Changed implementation paths, both within Q07 ownership:

- `poc-002-component-combat/src/view/art/index.ts`
- `poc-002-component-combat/tests/q07-art.test.ts`

Implemented data-only, code-drawn diagrams for all four enemies, with ordinary 256×384 panels and a 512×512 Warden panel. Every content part has labelled drawing geometry and a separate rectangular hit region. The Scribe's tongue and hand have enlarged regions. Added destroyed/shielded appearance descriptions, arena background layers, verified-copy emblem URLs and UI attribution. No rule implementation or tuning is present in art.

The evidence commit adds only this report and the unchanged assignment. No core/content, assets, generated agent definitions, other checkpoint implementation paths, root justfile, prototype README, protected documents, POC 001 or shared files changed. No merge, rebase or push was performed.

## Verification

Required commands ran from the worktree root exactly as shown, without extra environment variables. Checks ran against the implementation working content subsequently committed unchanged as the candidate/tested revision above. The later evidence commit does not alter that content.

| Exact command | Exit | Key output |
| --- | --- | --- |
| `./poc-002-component-combat/bin/run install` (initial sandbox attempt) | 1 | `Q01: Docker daemon inaccessible; check availability and socket permissions` |
| `./poc-002-component-combat/bin/run install` (with Docker socket access) | 0 | `bun install v1.4.2`; `43 packages installed [758.00ms]` |
| `./poc-002-component-combat/bin/run typecheck` | 0 | `$ tsc --noEmit` |
| `./poc-002-component-combat/bin/run test` | 0 | `Test Files 4 passed (4)`; `Tests 57 passed (57)`; `tests/q07-art.test.ts (20 tests)` |
| `./poc-002-component-combat/bin/run build` | 0 | `Q01 assets: prepared 4 files in public/tehom`; `11 modules transformed`; `built in 603ms` |
| `./poc-002-component-combat/bin/run test-browser` | 0 | `Browser total: 6 assertions passed across 1 harnesses`; `Preview stopped (expected)` |
| `git diff --cached --check` (before implementation commit) | 0 | No output |
| `git diff --check 87b1441..HEAD` (at implementation commit) | 0 | No output |
| `git diff --name-only 87b1441..HEAD` (at implementation commit) | 0 | Only the two Q07 implementation paths listed above |

All Docker-based checks after the initial install attempt used the same bare commands with sandbox escalation for the existing local socket; no automatic approval rejection occurred. No environment override or alternate toolchain was used. Build emitted the existing informational Phaser chunk-size warning and succeeded. The browser runner selected the installed Playwright headless Chrome, built afresh, served default port 4273, and stopped its named preview container. Disposable browser output: `/tmp/poc-002-browser-P4sM0v`.

The 20 Q07 tests exercise the public art boundary and real Q01 asset copier. They check content-derived part membership/names, minimum dimensions, containment, pairwise non-overlap, small-part enlargement, panel sizes, all three presentation states with test-owned geometry, independent enemy instances, each Brood portrait, generated emblem/credits paths and background coverage. Tests assert no v1 combat tuning values and permit different valid layouts and colors. Unit assertion totals are not emitted by Vitest; the browser runner reported 6 assertions.

## Numbered acceptance mapping

| Q07 item | Evidence |
| --- | --- |
| 1 | `enemyArt` supplies every part of all four content enemies (13 enemy/part entries), including a draw description and hit region at least 48×48. Content-driven tests check exact membership, labels, finite positive bounds, containment and minimum size. Separate tests require tongue/hand hit-region width and height to exceed their drawn shape. |
| 2 | Pairwise rectangle-intersection tests cover every pair of parts on each enemy; all pass. Layouts also leave visible gaps between regions. |
| 3 | `broodPortrait` preserves Ugallu/Girtablilu emblem keys and Anzû's labelled shape. `EMBLEM_SOURCES` maps only those two keys to `/tehom/tokens/*.svg`. Tests invoke the unmodified Q01 SHA-verifying copier, then resolve each exported path and compare bytes with the registered sources. All enemy drawings have content labels. The implementation diff adds no asset files. |
| 4 | `EMBLEM_CREDITS` exports readable Lorc/Game-icons.net/CC BY 3.0 attribution, modification notice, artist/source/license links and `/tehom/CREDITS.md`. Tests verify attribution and the generated credits file. README text below links the canonical `assets/CREDITS.md` for the integration owner. |

Additional checkpoint scope: `partAppearance` provides faded/crossed-out destroyed parts and labelled/outlined shielded parts, without changing geometry or selecting legality; tests cover each state. `battleBackground` provides back-to-front shape layers covering 1280×720, with no texture asset; a test checks coverage and valid shape bounds.

## Public presentation additions and integration notes

No change to `src/core/types.ts`, content, `enemyArt(enemyId): EnemyArt`, `broodPortrait(broodId): Portrait` or their existing required output fields.

Additions in `src/view/art/index.ts`:

- `enemyPanel(enemyId: EnemyId): HitRegion`: panel-local bounds, 256×384 for ordinary enemies and 512×512 for the Warden.
- `PartVisualState = 'intact' | 'destroyed' | 'shielded'` and `partAppearance(art: PartArt, state: PartVisualState): DrawDescription`.
- Optional `DrawDescription.alpha`, `outline: {color, width}` and `crossedOut` fields. Apply alpha to the shape; draw its label legibly, its outline when supplied, and a cross when requested. State labels also name destroyed/shielded status, so color is not the sole distinction.
- `battleBackground(): DrawDescription[]`: back-to-front rectangle/ellipse layers; empty labels mean no text.
- `EMBLEM_SOURCES`: fixed texture-key-to-generated-URL map.
- `EMBLEM_CREDITS`: `text`, `artistUrl`, `sourceUrl`, `licenseUrl`, `creditsUrl`.

Q05 should draw each part at a panel origin and translate its hit region by that same origin; keep native panel sizes within the 1280×720 logical canvas so targets remain at least 48×48. Phaser Scale.FIT can scale the complete canvas. The Warden has its own encounter and larger panel. Keep the Scribe's full part names legible beside its small shapes. Use the same part IDs for list/diagram selection. Styling receives the caller's authoritative state; it adds no legality or combat rule and leaves invalid parts inspectable (brief §11). Preload emblem textures using `EMBLEM_SOURCES` and `Portrait.key`; expose `EMBLEM_CREDITS` through the UI's credits control.

Limitations: the current Q01 app/battle placeholders do not consume the art descriptors. This checkpoint supplies the agreed data contract; Q05 owns rendering, input and two-way selection. The passing browser run verifies the existing scaffold only, not rendered Q07 selection behavior. No human usability/playtest or independent review was run. No required check remains unrun. No S1–S6 stop condition was hit and no blocker remains.

## README section text for the integration owner

```markdown
## Placeholder art (Q07)

`src/view/art/index.ts` supplies labelled enemy diagrams, non-overlapping part hit regions of at least 48×48 logical pixels, Brood portrait metadata, destroyed/shielded appearance descriptions and a code-drawn battle background. Ordinary enemy panels are 256×384; the Warden panel is 512×512. Draw and hit-region coordinates share a panel-local origin on the 1280×720 combat canvas. The Scribe's tongue and hand have regions larger than their shapes.

Ugallu and Girtablilu use only the registered emblems prepared under `public/tehom/` by the SHA-verifying asset script. Anzû and enemies use labelled shapes. The art module exports `EMBLEM_SOURCES` for texture loading and `EMBLEM_CREDITS` for UI attribution. See [asset credits](../assets/CREDITS.md) and the [CC BY 3.0 license](../assets/licenses/game-icons-license.txt). No art asset or dependency was added. Q05 consumes these descriptions for rendering and part selection.
```

## Handoff validation

Copied the unchanged `.agents/skills/ruach-handoff` into `/tmp/p2-q07-handoff.Hf2HOT/ruach-handoff`. Ran `bun install --frozen-lockfile` with that copied directory as cwd: exit 0, `6 packages installed [20.00ms]` (ajv 8.20.0, yaml 2.9.1).

From the worktree root:

```sh
bun /tmp/p2-q07-handoff.Hf2HOT/ruach-handoff/scripts/validate.ts docs/mailbox/poc-002-q07/implementer.md --repo .
```

Exit **0**. Exact stdout:

```json
{"schema_version":1,"ok":true,"report":"/opt/dev/tehom-brainlab-p2-q07/docs/mailbox/poc-002-q07/implementer.md","repo":"/opt/dev/tehom-brainlab-p2-q07","revisions":[{"path":"/source_baseline","resolved":"87b14414bde8c7610a8c3723c018f8056aa41c35"},{"path":"/candidate_revision","resolved":"ccd1abc343631e717bf3f6d70b73e4bab845e8a8"},{"path":"/tested_revision","resolved":"ccd1abc343631e717bf3f6d70b73e4bab845e8a8"}],"diagnostics":[]}
```

Reran the same command after recording its result: exit 0, with the same revisions and no diagnostics. Assignment SHA-256 before and after work: `cf36da869299e482f3e2353b7f9f486e0cff38a3fe2f024a3846ad1ed3a64107`.
