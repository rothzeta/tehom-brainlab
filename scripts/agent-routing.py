#!/usr/bin/env python3
"""Resolve portable repository routes and launch them through Herdr (Python 3.11+, PyYAML)."""
from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tomllib

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


def resolve(root, role, override):
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
    if role not in roles:
        fail(f"Unknown role: {role}")
    route_name = override if override is not None else roles[role]["preferred"]
    allowed = [roles[role]["preferred"], *roles[role].get("alternatives", [])]
    if route_name not in allowed:
        fail(f"role {role}: route {route_name} is not allowed; choose from {allowed}")
    route = routes[route_name]
    model = models[route["model"]]
    return {"role": role, "route": route_name, "harness": model["harness"],
            "native_model": model["native_model"], "effort": route["effort"]}


def toml_value(value):
    if isinstance(value, str):
        return json.dumps(value, ensure_ascii=False)
    if isinstance(value, bool):
        return str(value).lower()
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, list):
        return "[" + ",".join(toml_value(item) for item in value) + "]"
    if isinstance(value, dict):
        return "{" + ",".join(toml_value(key) + "=" + toml_value(item) for key, item in value.items()) + "}"
    fail("Codex skills.config contains an unsupported TOML value")


def launch_args(root, resolved):
    role, harness = resolved["role"], resolved["harness"]
    role_file = root / ".agents/agents" / f"{role}.md"
    skills = [*TECHNICAL_SKILLS, *([WORKFLOW] if role == "coordinator" else [])]
    for name in [*TECHNICAL_SKILLS, WORKFLOW]:
        if not (root / ".agents/skills" / name / "SKILL.md").is_file():
            fail(f"Missing canonical skill: {name}/SKILL.md")
    adapter = root / ".agents/scratch/agent-routing/claude" / role
    if harness == "claude":
        argv = ["--append-system-prompt-file", str(role_file), "--add-dir", str(adapter),
                "--permission-mode", "auto", "--model", resolved["native_model"],
                "--effort", resolved["effort"]]
    else:
        config_home = Path(os.environ.get("CODEX_HOME", str(Path.home() / ".codex")))
        config_path = config_home / "config.toml"
        try:
            config = tomllib.loads(config_path.read_text(encoding="utf-8")) if config_path.exists() else {}
        except tomllib.TOMLDecodeError:
            fail("Codex user config: invalid TOML (contents redacted)")
        prior = config.get("developer_instructions", "")
        if not isinstance(prior, str):
            fail("Codex developer_instructions must be a string (contents redacted)")
        body = role_file.read_text(encoding="utf-8")
        instructions = prior + "\n\n" + body if prior else body
        argv = ["--approve-for-me", "-m", resolved["native_model"], "-c",
                "model_reasoning_effort=" + toml_value(resolved["effort"]), "-c",
                "developer_instructions=" + toml_value(instructions)]
        if role != "coordinator":
            settings = config.get("skills", {})
            if not isinstance(settings, dict) or not isinstance(settings.get("config", []), list):
                fail("Codex skills.config must be a list (contents redacted)")
            entries = list(settings.get("config", []))
            for entry in entries:
                if (not isinstance(entry, dict) or not isinstance(entry.get("path"), str)
                        or not isinstance(entry.get("enabled"), bool)):
                    fail("Codex skills.config entries require path and enabled (contents redacted)")
            entries.append({"path": str(root / ".agents/skills" / WORKFLOW / "SKILL.md"), "enabled": False})
            argv += ["-c", "skills.config=" + toml_value(entries)]
    return argv, adapter, skills


def redacted(argv):
    # Redact whole override values, including skill paths. No instruction lengths/hashes are needed.
    return [arg.split("=", 1)[0] + "=<redacted>"
            if arg.startswith(("developer_instructions=", "skills.config=")) else arg for arg in argv]


def herdr_call(argv, root):
    result = subprocess.run(["herdr", *argv], cwd=root, text=True, capture_output=True)
    if result.returncode:
        # Herdr can echo the launch command (including secrets) on failure.
        fail(f"herdr {argv[0]} {argv[1]} failed (exit {result.returncode}; output redacted); no fallback attempted")
    try:
        return json.loads(result.stdout)["result"]
    except (ValueError, KeyError, TypeError):
        fail(f"herdr {argv[0]} {argv[1]} returned an invalid response (output redacted)")


def start(root, resolved, argv, adapter, skills, name, pane):
    if os.environ.get("HERDR_ENV") != "1":
        fail("start requires HERDR_ENV=1 inside Herdr")
    for executable in ("herdr", resolved["harness"]):
        if shutil.which(executable) is None:
            fail(f"Missing executable on PATH: {executable}")
    if resolved["harness"] == "claude":
        target = adapter / ".claude/skills"
        target.mkdir(parents=True, exist_ok=True)
        unexpected = {path.name for path in target.iterdir()} - set(skills)
        if unexpected:
            fail(f"Adapter contains unexpected skills: {sorted(unexpected)}")
        for skill in skills:
            link = target / skill
            source = root / ".agents/skills" / skill
            if link.is_symlink() and link.resolve() == source.resolve():
                continue
            if link.exists() or link.is_symlink():
                fail(f"Adapter path already occupied: {link}")
            link.symlink_to(source, target_is_directory=True)
    if pane is None:
        own_id = os.environ.get("HERDR_PANE_ID")
        if not own_id:
            fail("start without --pane requires HERDR_PANE_ID")
        layout = herdr_call(["pane", "layout", "--current"], root)["layout"]
        own = next((p for p in layout["panes"] if p["pane_id"] == own_id), None)
        if own is None:
            fail("Current Herdr pane is absent from layout")
        direction = "right" if own["rect"]["width"] >= 120 else "down"
        pane = herdr_call(["pane", "split", "--current", "--direction", direction,
                           "--cwd", str(root), "--no-focus"], root)["pane"]["pane_id"]
    # An existing pane must already be at a shell prompt in this checkout (documented contract).
    herdr_call(["agent", "start", name, "--kind", resolved["harness"], "--pane", pane, "--", *argv], root)
    return pane


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    subcommands = parser.add_subparsers(dest="command", required=True)
    for command in ("resolve", "start"):
        sub = subcommands.add_parser(command)
        sub.add_argument("role")
        if command == "start":
            sub.add_argument("name")
        else:
            sub.add_argument("--name", default="resolved-agent")
        sub.add_argument("--route", help="Explicit allowed route; never automatically retried")
        sub.add_argument("--pane", help="Existing pane at a shell prompt in the selected checkout")
        sub.add_argument("--root", type=Path, default=ROOT, help="Checkout containing the portable configuration")
    args = parser.parse_args()
    try:
        root = args.root.resolve()
        string(args.name, "agent name")
        if args.name.startswith("-"):
            fail("agent name must not start with '-'")
        if args.pane is not None:
            string(args.pane, "pane")
            if args.pane.startswith("-"):
                fail("pane must not start with '-'")
        resolved = resolve(root, args.role, args.route)
        argv, adapter, skills = launch_args(root, resolved)
        pane = args.pane
        if args.command == "start":
            pane = start(root, resolved, argv, adapter, skills, args.name, pane)
        print(json.dumps({**resolved, "name": args.name, "pane": pane,
                          "harness_argv": [resolved["harness"], *redacted(argv)],
                          "herdr_argv": ["herdr", "agent", "start", args.name, "--kind", resolved["harness"],
                                         "--pane", pane or "<new-pane>", "--", *redacted(argv)],
                          "redacted_fields": ["developer_instructions", "skills.config"]}, indent=2))
        return 0
    except (OSError, ValueError, KeyError, TypeError) as error:
        print(f"Routing failed: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
