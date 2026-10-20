# P2-FIX1 hostile snapshots

`area-strike.json` reproduces the reviewer's single-target Strike changed to an
all-Brood attack, followed by one real `endPhase`. `enemy-strike.json` changes its
target category to an enemy. Both must fail with `intent target shape contradicts
embedded targeting rule`. `over-cap-poison.json` is a complete zero-command
snapshot with poison one above the embedded cap; it must fail with `poison
exceeds content cap`.

The records were generated through the public API before the validation fix,
then deliberately mutated. Embedded v1 content is unchanged. They live in this
subdirectory so the frozen Q03 root-fixture inventory remains intact; the new
FIX1 tests exercise these inputs, and the actual replay CLI must reject each.
