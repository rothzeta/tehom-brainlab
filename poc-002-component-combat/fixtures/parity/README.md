# POC 002 parity records

These frozen records are the C# parity gate required by ADR-0007 and brief §12.
Each embeds its versioned content, complete initial state, accepted commands,
ordered per-command events/revisions and expected final state. Object key order
is irrelevant; array order and integer values are contractual. No factory default
or expected output is used as simulation input during replay.

`seed-*` are Q02's two brief tuning witnesses. `fight-<encounter>-v1` covers each
of the seven encounters; `form-<brood>-<kind>-v1` witnesses each transformation
and a subsequent action. `gauntlet-win-trio-v1` covers all three fights and both
`continue` transitions; `gauntlet-defeat-v1` covers a terminal loss. `edge-*`
cover Revoke of Inscribe, Hold redirecting Clamp, lethal retaliation, victory
ending a form, and poison-tick victory. `unfinished-*` cover export in the player
and between-fights phases (§12 amendment). Several names intentionally share a
trace because one real play line witnesses multiple requirements.

From the repository root, replay a record with:

```sh
./poc-002-component-combat/bin/run replay poc-002-component-combat/fixtures/parity/gauntlet-win-trio-v1.json
```

The input filename is relative to the caller's directory, resolved before the
launcher changes directory. Docker replay disables networking and mounts that
input read-only. It reads no additional files named by the record. Success prints
`commands`, `events`, and `outcome` (the final phase for unfinished attempts).
Divergence reports the zero-based first `commandIndex` and kind; a final-state
mismatch uses the command count. Rejected commands report their rejection code.

Replay input is limited to **8,388,608 bytes (8 MiB), in UTF-8**, including JSON
whitespace. The CLI reads at most the limit plus one byte before rejecting an
oversized file; the string parser enforces the same byte limit. Unknown fields,
versions, kinds and IDs, invalid integers and impossible states are rejected.
The hostile corpus lives in `../hostile/`; oversized inputs are generated in the
OS temporary directory by tests rather than stored in Git.

## Intentional authoring

Never edit parity JSON by hand or refresh it to make a failing test pass. First
resolve the rule against the brief. A tuning change needs a new content version;
a behavior/event/order change needs a new rules version (§12). Preserve historical
fixtures and their embedded content. The current parser accepts rules v1 only;
new rules versions require an explicitly authorized parser/core change.

The checked-in `generate.ts` documents every Q03 line through `createFight`,
`createGauntlet`, `applyCommand` and `recordOf`; it also replays each result before
writing. For an intentional new version, update the content/rules support under
its owning checkpoint, copy/adapt this authoring tool with new versioned filenames,
and inspect the resulting diff and requirement witnesses. Under the current v1,
the following command deterministically reproduces the Q03 files byte-for-byte:

```sh
bun poc-002-component-combat/fixtures/parity/generate.ts
```

This requires the repository's pinned host Bun. It does not rewrite the Q02-owned
seeds; the retaliation witness consumes the Ugallu seed's command prefix through
the API. `buildRevision: unknown` is intentional for reproducible authoring without
embedding the commit that has yet to be created. Run the full test suite and every
fixture through the bare replay launcher before accepting a newly authored corpus.
