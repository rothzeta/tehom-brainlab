# POC 001 — proposed boss-experiment continuation

Date: 2026-10-06. Inspected baseline: `70b6ede002e6a09e31522d1343d29796672dfb28`.

This navigation note proposes the next segment of the [existing delivery sequence](README.md); it is not a sixth implementation plan or a second prototype. These five plans are drafts. No gameplay implementation, acceptance, independent review, or human playtest is claimed by adding them.

## Authority and changed scope

The user's latest direction requests two separate boss encounters: an anchored, central two-phase boss and an off-centre roaming boss with adds. Only enemies may relocate independently. The Brood retain rotation and expansion/contraction only. Rotation and changing shape must no longer compete for a single allowance; the exact refresh cadence was left open. The user also requests a focused tactical ability review without an elaborate kit.

The preceding P12 gate remains a historical evidence record, not evidence that the combat failed or passed. This continuation proposes replacing the unimplemented P12 scope under the new user direction, rather than requiring a successful patrol to authorize boss experimentation. Do not mark that historical evidence gate PASS. Before implementation is assigned, the Coordinator should reconcile the canonical index and protected status notes to this scope amendment. P01–P11 and RF remain the starting implementation, not work to redo. The original P12 and this continuation must not both be implemented as separate versions of the same boss.

## Settled versus proposed

**User direction:** two boss encounters, only one central and two-phase; enemy-only independent movement; both maneuver categories available independently; a small but tactically useful ability set.

**Inspected implementation:** 19 cells, not the old 37-cell draft; Compact uses alternating ring-1 cells, Spread ring-2 corners; six reserved outer-edge enemy cells plus the centre; one `maneuverUsed` flag; six player abilities; patrol declarations use marks; fronts already originate at an enemy's actual cell; strict patrol-specific attempt records. See the [prototype README](../../poc-001-linked-formation/README.md), [rounds](../../poc-001-linked-formation/src/core/rounds.ts), [sectors](../../poc-001-linked-formation/src/core/sectors.ts), and [records](../../poc-001-linked-formation/src/core/run-record.ts).

**Designer proposals, not approved balance:** one rotation plus one shape change every player phase; enemies reposition between rounds before declaring fresh attacks; a six-slot enemy route; the revised six-ability kit; names, HP, damage, phase threshold, patterns and the particular adds below. Each owning plan makes these executable defaults and labels them experimental. Resolve changes explicitly before implementation, then update affected fixtures together.

## Delivery order

| ID | Plan | Smallest result | Prerequisites |
| --- | --- | --- | --- |
| P13 | [Independent maneuver budgets](2026-10-06-e8cec63d-poc-001-split-maneuver-budgets.md) | Rotate and change shape in one phase, without double-spending either category. | Existing P03/P09/P10/P11/RF |
| P14 | [Tactical kit revision](2026-10-06-6a0ebcdc-poc-001-tactical-kit-revision.md) | Six abilities with clearer protection, damage and control responsibilities. | P13 |
| P15 | [Two-phase central boss](2026-10-06-6dcd120b-poc-001-two-phase-central-boss.md) | A playable anchored boss testing radius and angle with stable telegraphs. | P13, P14 |
| P16 | [Enemy repositioning](2026-10-06-27ca8f17-poc-001-enemy-repositioning.md) | A relocating enemy changes its real threat origin without blocking Brood maneuvers. | P15 encounter integration |
| P17 | [Roaming boss and adds](2026-10-06-79371edf-poc-001-roaming-boss-and-adds.md) | A second encounter combining relocation, local protection and target priority. | P14, P15, P16 |

Preserve a baseline patrol configuration and export records before changing behavior. Integrate and inspect each stage rather than changing every rule at once. P16/P17 need not wait for a claim that P15 is fun; they do need a readable, verified common combat boundary. Adding bosses tests another part of the hypothesis, not an audience verdict or a campaign decision.

## Design rationale and failure probes

The current equilateral formations occupy alternating angular sectors. A centre-origin front covering two adjacent sectors therefore always catches exactly one living Brood when all three are alive. Rotation may change its identity rather than reduce the count. Use narrow sectors, same-parity forks and radial masks for different questions; do not assume a visually wider sweep creates more choices.

The current Impale combines 6 damage and protection bypass while Gale also bypasses protection. P14 removes the former bypass before adding further ability systems. Shelter is strengthened as a test, not declared balanced. All effects stay previewable. If one Brood falls, a signature ability should not disappear merely because code requires exactly two surviving partners.

Every-round independent budgets could make evasion effortless. Do not restore the shared budget or add cooldowns before observing that problem. Each category is still limited to one use; expanding, attacking and contracting again in the same phase remains illegal. Damage can still follow a marked creature, making protection and accepting some damage relevant.

## Evidence and boundaries

Plans follow [ADR-0002](../adr/0002-plan-filenames.md) and [ADR-0003](../adr/0003-implementation-plan-writing.md). Canonical implementation evidence goes to assigned `docs/mailbox/` handoffs; the Coordinator alone updates CURRENT/TASK_LOGS after actual delivery. Do not edit generated Ruach instructions.

This drafting pass inspected source and performed an independent arithmetic check of the 72 centre-front/formation combinations. It did not run the repository's application, test suite, build or browser. A container clone failed because GitHub DNS was unavailable; source inspection used the connected GitHub reader instead. No claim of playable bosses follows from this design review.

No extra Brood, grid enlargement, player walking, forced pursuit, generic movement engine, procedural encounter system, campaign, Revelation, new asset purchase, or final-art production is included.
