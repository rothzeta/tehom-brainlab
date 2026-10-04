# Repository routing

Routed selection consumes the schema and reference rules committed at `97752643b31cdcf8c8ec9f09204382c6766b1573`. The selected repository contains three catalogs under `.agents/`:

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
    effort: high
# .agents/roles.yaml (all five canonical roles are required)
roles:
  coordinator:
    preferred: claude-route.id
  architect:
    preferred: claude-route.id
    alternatives: [route.id]
  scout:
    preferred: route.id
  implementer:
    preferred: route.id
    alternatives: [claude-route.id]
  reviewer:
    preferred: route.id
```

The example omits the second model/route for brevity; every referenced route/model must exist. Catalogs must be nonempty mappings with exactly their named root field. Models require `harness` (Claude or Codex) and `native_model`. Routes require a model reference and explicit `effort: high`. Roles require `preferred`; `alternatives` is an optional list. The role set is exactly coordinator, architect, scout, implementer and reviewer, with readable canonical `.agents/agents/<role>.md` files. All coordinator preferences and alternatives must use Claude. These are committed routing rules, not skill model defaults. Direct mode retains its separately verified adapter capabilities and does not load the catalogs.

Selection uses the requested role's preference unless `--route` names its preference or one of its alternatives. Other declared routes are rejected. No retries, inheritance or fallback occur. Validate the complete graph before native preparation or launch mutations, including unselected entries. Mapping/reference IDs are nonempty strings, including dotted IDs; role names retain the CLI's safe identifier rule. Reject missing/unknown fields, duplicate keys, malformed YAML, invalid values and references. The worker additionally rejects YAML aliases and multiline strings, and redacts configuration values in diagnostics. The root command permits aliases and multiline strings; these are deliberate stricter worker boundaries.

`--repo` wins and is anchored to invocation cwd. Otherwise Git resolves the requested cwd's worktree root. JSON records `git_root` separately. Canonical sources may accompany an external cwd, while native/Herdr commands run in the requested cwd. Relative native pass-through paths retain their meaning from that cwd. JSON has `schema_version: 1`.

## Root command delegation seam

At the inspected revision, `just agent-routing ...` invokes `bin/agent-routing`, which executes `scripts/agent-routing.py`. This is an independent Python launcher; it does not currently delegate to this skill. Integration can replace that implementation with an argv-based invocation of `<root>/.agents/skills/ruach-herdr/scripts/worker.ts` using Bun, preserving stdout, stderr and exit status without shell interpolation or retries:

| Existing root CLI | Worker CLI mapping |
| --- | --- |
| `resolve ROLE [--name NAME]` | `resolve --role ROLE --name NAME --repo ROOT --cwd ROOT`; current root name default is `resolved-agent` |
| `start ROLE NAME` | `start --role ROLE --name NAME --repo ROOT --cwd ROOT` |
| `--root DIR` | Resolve DIR as the root command does, then pass that absolute directory as both `--repo` and `--cwd`; root command default is its checkout |
| `--route ID` | Forward `--route ID` unchanged; do not flatten to direct kind/model or bypass role constraints |
| `--pane ID` | No current worker equivalent; extending the worker contract or deliberately retiring this option requires integration work |

The root exposes neither direct selection nor offline/dry-run/native arguments. Their addition is an integration API decision. Worker JSON/exit codes differ from the existing root response (selection object versus flattened fields/native_model/harness; failure categories 2/3/4 versus root 1), so compatibility needs an explicit wrapper if consumers rely on the old contract.

Other differences to preserve or resolve at integration:

- Root `resolve` needs no Herdr or harness executable; normal worker `resolve` performs launch preflight and needs both plus caller Herdr context. Worker `resolve --offline` omits native argv and cannot substitute the existing root response without an explicit compatibility decision.
- Both append the canonical role. Root Codex reads only user config TOML; worker composes effective layered config via an already-running matching-version daemon and passes explicit cwd. Worker fails before mutation when that read-only capability is unavailable.
- Root workers disable only the repository's feature workflow. Worker disables every discovered workflow, including external names and native file/folder aliases, and fails for sources it cannot safely exclude. Root Claude adapters expose three fixed technical skills; worker scans canonical skills and prepares a private minimal settings overlay. Coordinator native visibility settings remain preserved.
- Root Claude uses `--permission-mode auto` and root Codex `--approve-for-me`. Worker inherits permissions by default; an integration wrapper can deliberately supply supported native flags after `--` (`--permission-mode auto`, or verified Codex approval/sandbox flags). It cannot forward `--approve-for-me` under the current bounded native argument contract.
- Both routed profiles require high effort and forbid implicit fallback. Worker probes native capabilities, Herdr supported kinds and live names before writes; it forwards caller PATH/config roots when creating its sibling pane. Root optionally accepts an existing pane. Worker reports uncertain post-mutation state and private material for inspection without retry.

No root launcher edits or live paid launches are part of this adaptation. Prepared argv does not establish native role/skill acceptance or account/model availability.
