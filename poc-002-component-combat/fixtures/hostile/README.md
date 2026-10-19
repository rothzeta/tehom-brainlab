# Hostile replay inputs (E45)

These are intentionally invalid mutations of the API-generated Girtablilu seed.
They must exit 1 with the failing field or rejection code, never run record text.
`generate.ts` regenerates these negative JSON inputs; it never changes parity.
Tests additionally create oversized UTF-8 input and malformed JSON under `/tmp`.
The replay limit is 8,388,608 bytes; see `../parity/README.md` for the CLI contract.

`invalid-gauntlet` has a truncated encounter descriptor. `rejected-command` is
structurally valid but requests a stale revision. Other filenames name their
structural or state-invariant violation.
