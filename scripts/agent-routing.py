#!/usr/bin/env python3
"""Validate repository catalog policy and delegate to the portable ruach-herdr worker."""
from __future__ import annotations

import argparse
import os
from pathlib import Path
import shutil
import subprocess
import sys

try:
    import yaml
except ImportError:
    print("Routing failed: PyYAML is required (python3 -m pip install PyYAML)", file=sys.stderr)
    raise SystemExit(2)

ROOT = Path(__file__).resolve().parents[1]
ROLES = {"coordinator", "architect", "scout", "implementer", "reviewer"}
TECHNICAL_SKILLS = ("ruach-testing", "ruach-simplification", "ruach-handoff")
WORKFLOW = "ruach-workflow-feature"


def fail(message):
    raise ValueError(message)


def fields(value, required, optional, label):
    if not isinstance(value, dict):
        fail(f"{label}: expected a mapping")
    missing = set(required) - value.keys()
    unknown = value.keys() - set(required) - set(optional)
    if missing or unknown:
        fail(f"{label}: missing fields {sorted(missing)}; unknown fields {sorted(unknown, key=str)}")


def string(value, label):
    if not isinstance(value, str) or not value.strip() or "\x00" in value:
        fail(f"{label}: expected a non-empty string without NUL")
    return value


class UniqueLoader(yaml.SafeLoader):
    """Reject ambiguous duplicate routing keys rather than silently overwriting them."""


def unique_mapping(loader, node):
    result = {}
    for key_node, value_node in node.value:
        key = loader.construct_object(key_node)
        if not isinstance(key, str):
            fail("YAML mapping keys must be strings")
        if key in result:
            fail(f"Duplicate YAML key: {key}")
        result[key] = loader.construct_object(value_node)
    return result


UniqueLoader.add_constructor(yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG, unique_mapping)


def catalog(root, filename, section):
    path = root / ".agents" / filename
    try:
        doc = yaml.load(path.read_text(encoding="utf-8"), Loader=UniqueLoader)
    except yaml.YAMLError:
        # Parser diagnostics can contain entire source lines. Do not echo them.
        fail(f"{filename}: invalid YAML")
    fields(doc, {section}, {}, filename)
    result = doc[section]
    if not isinstance(result, dict) or not result:
        fail(f"{filename}: {section} must be a non-empty mapping")
    return result


def validate_policy(root):
    models = catalog(root, "models.yaml", "models")
    routes = catalog(root, "routing.yaml", "routes")
    roles = catalog(root, "roles.yaml", "roles")
    for key, model in models.items():
        string(key, "model key")
        fields(model, {"harness", "native_model"}, {}, f"model {key}")
        if model["harness"] not in ("claude", "codex"):
            fail(f"model {key}: harness must be claude or codex")
        string(model["native_model"], f"model {key}: native_model")
    for key, route in routes.items():
        string(key, "route key")
        fields(route, {"model", "effort"}, {}, f"route {key}")
        reference = string(route["model"], f"route {key}: model")
        if reference not in models:
            fail(f"route {key}: unknown model {reference}")
        if route["effort"] != "high":
            fail(f"route {key}: effort must be high")
    if roles.keys() != ROLES:
        fail(f"roles.yaml: missing roles {sorted(ROLES - roles.keys())}; unknown roles {sorted(roles.keys() - ROLES)}")
    for key, entry in roles.items():
        fields(entry, {"preferred"}, {"alternatives"}, f"role {key}")
        preferred = string(entry["preferred"], f"role {key}: preferred")
        alternatives = entry.get("alternatives", [])
        if not isinstance(alternatives, list):
            fail(f"role {key}: alternatives must be a list")
        for reference in [preferred, *alternatives]:
            string(reference, f"role {key}: route")
            if reference not in routes:
                fail(f"role {key}: unknown route {reference}")
            if key == "coordinator" and models[routes[reference]["model"]]["harness"] != "claude":
                fail("role coordinator: only Claude routes are allowed")
        role_file = root / ".agents/agents" / f"{key}.md"
        if not role_file.is_file():
            fail(f"role {key}: missing canonical role file {role_file}")
    for name in [*TECHNICAL_SKILLS, WORKFLOW]:
        if not (root / ".agents/skills" / name / "SKILL.md").is_file():
            fail(f"Missing canonical skill: {name}/SKILL.md")


def bun_executable():
    configured = os.environ.get("BUN_BIN")
    if configured:
        return configured
    installed = Path.home() / ".bun/bin/bun"
    if installed.is_file() and os.access(installed, os.X_OK):
        return str(installed)
    found = shutil.which("bun")
    if found:
        return found
    fail("Bun is required: set BUN_BIN, install ~/.bun/bin/bun, or put bun on PATH")


def main():
    parser = argparse.ArgumentParser(
        description=__doc__,
        epilog="resolve uses offline selection (no native argv or Herdr prerequisite). "
               "Output is worker schema_version 1 JSON; worker exit codes 2/3/4 are preserved. "
               "--pane is retired: start creates one sibling pane. Root launches use "
               "portable --permissions auto-review; use the skill directly for dry-run.")
    subcommands = parser.add_subparsers(dest="command", required=True)
    for command in ("resolve", "start"):
        sub = subcommands.add_parser(command, description=parser.epilog)
        sub.add_argument("role")
        if command == "start":
            sub.add_argument("name")
        else:
            sub.add_argument("--name", default="resolved-agent")
        sub.add_argument("--route", help="Explicit allowed route; never automatically retried")
        sub.add_argument("--pane", help="Retired: worker start always creates a sibling pane")
        sub.add_argument("--root", type=Path, default=ROOT,
                         help="Checkout for canonical catalogs, roles, skills and worker cwd")
    args = parser.parse_args()
    try:
        if args.pane is not None:
            fail("--pane is retired; omit it to create one sibling pane through ruach-herdr")
        root = args.root.resolve()
        validate_policy(root)
        # The installed root surface owns the launcher; --root selects its input checkout.
        worker = ROOT / ".agents/skills/ruach-herdr/scripts/worker.ts"
        argv = [bun_executable(), str(worker), args.command, "--role", args.role,
                "--name", args.name, "--repo", str(root), "--cwd", str(root),
                "--permissions", "auto-review"]
        if args.command == "resolve":
            argv.append("--offline")
        if args.route is not None:
            argv.extend(["--route", args.route])
        # Inherit streams so versioned results, diagnostics and exit codes remain authoritative.
        return subprocess.run(argv, cwd=root).returncode
    except (OSError, ValueError, KeyError, TypeError) as error:
        print(f"Routing failed: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
