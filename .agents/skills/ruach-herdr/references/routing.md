# Provisional routing v1

This is an explicitly **provisional** minimal schema. The repository's models/routing/roles files are being authored independently; no committed authoritative schema was available at implementation. Routed `resolve` and `start` are enabled against this documented shape by assignment. Only `scripts/routing.ts` knows that shape. Test YAML is confined to `tests/fixtures/routing`; this skill does not install repository-root YAML.

Three files are read from the selected repository root:

```yaml
# models.yaml
models:
  model-id:
    kind: codex
    model: native-model-id
    efforts: [high]
# routing.yaml
routes:
  route-id:
    model: model-id
    effort: high
# roles.yaml
roles:
  implementer:
    preferred_route: route-id
```

Each root has exactly its named mapping. Identifiers use `[a-z][a-z0-9_-]*`. Models require kind, nonempty native model string and a unique efforts array. Known kinds: claude, codex, pi, opencode, dsh, omp, agy. Provisional effort vocabulary: off, none, minimal, low, medium, high, xhigh, max, auto. The selected native adapter validates its narrower verified vocabulary as a second check.

Routes reference a model identifier and supply a compatible effort. Omit effort only when that model's efforts list is empty. Roles reference preferred routes and require corresponding `.agents/agents/<role>.md` sources. Validate the entire graph, including unselected entries, before any launch mutation. Reject malformed YAML, duplicate keys, aliases, missing fields/references, invalid kinds/efforts and unknown keys. Diagnostics identify the file/key without copying input values or YAML parser snippets.

Without explicit kind/model, selection uses the named role's preferred route; `--route` replaces that preference with another declared route. Coordinator selection has no code-specific harness/model rule: the fixture assigns it a Claude route, and repository data owns actual policy. Routed effort is never overridden by a CLI default. No inheritance, fallback, priority or remote model selection is implemented. Direct mode validates the canonical role and native capability but does not read routing YAML.

`--repo` wins and is anchored to invocation cwd. Otherwise Git resolves the requested cwd's worktree root. The result records `git_root` separately: an explicit canonical repository can accompany an external cwd; a non-Git fixture requires `--repo`. Native and Herdr commands run in the requested cwd, including paths with spaces. Relative native pass-through paths retain their native meaning from that cwd.

## Integration checkpoints

Before treating routed launch as integrated with the eventual repository schema, confirm:

1. YAML locations, version markers, mapping/list shapes and key names.
2. Model identifier versus native identifier; which object owns kind/provider/effort.
3. Role preferences and explicit route semantics, including any required overrides, inheritance or fallbacks.
4. Effort vocabulary and model capability metadata.
5. Canonical role paths and relative-path anchors.
6. Unknown-key, duplicate-key, alias and full-graph reference policy.
7. Root launch argv, JSON/exit contract, caller environment and Herdr context.

Adapt `routing.ts` and captured fixture YAML together to the committed schema, recording its revision. Schema mismatch fails clearly; it never silently substitutes a profile. The skill-local package version/Git identify implementation; JSON has `schema_version: 1`.

## Thin root launcher seam

A repository root command may locate its versioned `scripts/worker.ts` and Bun, delegate `resolve`/`start` plus selection/cwd/native args as an argv array, and forward stdout/stderr/exit status. It must leave route resolution, role/config preparation, pane creation and the single startup submission to this script, without retries. Creating that root command is outside this skill's scope.
