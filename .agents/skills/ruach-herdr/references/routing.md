# Portable repository routing

Routed selection consumes the catalog shape delivered at `97752643b31cdcf8c8ec9f09204382c6766b1573`, without copying that repository's launch policies. Each selected repository owns three catalogs under `.agents/`:

```yaml
# .agents/models.yaml
models:
  model.id:
    harness: codex
    native_model: native-model-id
# .agents/routing.yaml
routes:
  route.id:
    model: model.id
    effort: medium
# .agents/roles.yaml
roles:
  builder:
    preferred: route.id
    alternatives: []
```

Catalogs must be nonempty mappings with exactly their named root field. Models require a registered `harness` and nonempty `native_model`. Routes require a model reference and a nonempty string `effort`; the selected adapter validates its verified effort vocabulary. Known gated adapters remain declared selections and fail preparation accurately with exit 3 when unavailable or unsupported; they are never substituted. Roles are the entries declared in `roles.yaml`, each with `preferred` and optional list `alternatives`. Only the selected role requires a readable `.agents/agents/<role>.md` source. Other role entries still undergo complete structure/reference validation. Direct mode retains its independently verified adapter capabilities and does not load the catalogs.

The repository root validator at the inspected revision additionally requires five particular roles, Claude/Codex harnesses, high effort and Claude coordinator routes. Those are repository policies: its validator/tests must retain them at integration. This portable skill does not duplicate them. A coordinator's routed harness comes from preference data, while the worker/coordinator workflow visibility contract remains enforced by native adapters.

Selection uses the requested role's preference unless `--route` names its preference or one of its alternatives. Other declared routes are rejected. No retries, inheritance or fallback occur. Validate the complete graph before native preparation or launch mutations, including unselected entries. Mapping/reference IDs are nonempty strings, including dotted IDs; role names retain the CLI's safe identifier rule. Reject missing/unknown fields, duplicate keys, malformed YAML, invalid values and references. The worker additionally rejects YAML aliases and multiline strings, and redacts configuration values in diagnostics. The root policy parser permits aliases and multiline strings, but delegated selection rejects them at the worker boundary.

`--repo` wins and is anchored to invocation cwd. Otherwise Git resolves the requested cwd's worktree root. JSON records `git_root` separately. Canonical sources may accompany an external cwd, while native/Herdr commands run in the requested cwd. Relative native pass-through paths retain their meaning from that cwd. JSON has `schema_version: 1`.

## Root command delegation seam

`just agent-routing ...` invokes `bin/agent-routing`, which executes `scripts/agent-routing.py`. The Python wrapper validates repository catalog policy and delegates once to its versioned `scripts/worker.ts` using a subprocess argv array. It owns no selection resolution, native flags, role injection, pane operations or retries. Bun comes from `$BUN_BIN`, then `~/.bun/bin/bun`, then PATH.

| Root CLI | Worker CLI mapping |
| --- | --- |
| `resolve ROLE [--name NAME]` | `resolve --offline --role ROLE --name NAME --repo ROOT --cwd ROOT --permissions auto-review`; default name is `resolved-agent` |
| `start ROLE NAME` | `start --role ROLE --name NAME --repo ROOT --cwd ROOT --permissions auto-review` |
| `--root DIR` | Absolute DIR supplies both `--repo` and `--cwd`; launcher code comes from the root surface's own skill directory |
| `--route ID` | Forward unchanged; worker enforces preference/alternative selection |
| `--pane ID` | Retired with a diagnostic; start creates a sibling pane |

Root resolve retains its no-Herdr prerequisite through offline selection. It returns the worker's schema_version 1 JSON, with selection nested under `selection`, no native argv and `launchable: false`. Worker stdout, stderr and exit status are forwarded unchanged. Root policy/setup errors use 1; argument errors use 2. Names use the worker's safe identifier rule. Automatic approval review is the repository root's launch policy, passed through the portable permission option.

Use the skill directly for live resolve, dry-run, direct selection, an external cwd with separate canonical repo, or supported native flags. The root wrapper passes `--permissions auto-review` as repository launch policy; selected adapters own the native mapping and reject conflicting native permission flags. The skill defaults to inherit when invoked directly.

Codex composes effective layered config through a matching existing daemon or short-lived native stdio reader and passes explicit cwd. The fallback may initialize Codex runtime state; user setting files remain untouched. Preparation fails when neither inspection transport works.

Workers receive canonical role instructions and the Coordinator's self-contained assignment; the launcher never supplies workflow bodies. Claude uses targeted known local workflow suppression. Unverified complete account/plugin/managed catalog visibility does not prohibit preparation. Codex suppresses known workflows through native file/folder aliases. Existing developer and technical skill configuration and Coordinator visibility settings are preserved.

The worker probes native capabilities, Herdr supported kinds and live names, forwards caller PATH/config roots to its sibling pane, and reports private material and uncertain submission state without retry. See [adapter evidence](adapters.md) for prerequisites and coverage limits. Prepared argv does not establish native role/skill acceptance or account/model availability.
