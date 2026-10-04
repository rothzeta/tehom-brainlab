#!/usr/bin/env python3
"""Black-box routing/launch contracts. No real harness or Herdr sessions are started."""
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest

import yaml

ROOT = Path(__file__).resolve().parents[1]
ENTRY = ROOT / "bin/agent-routing"
GPT = "gpt-6.1-sol-high"
CLAUDE = "claude-opus-5.5-high"

BUN = os.environ.get("BUN_BIN") or (str(Path.home() / ".bun/bin/bun")
      if (Path.home() / ".bun/bin/bun").is_file() else shutil.which("bun"))
DELEGATE_STUB = '''#!/usr/bin/env python3
import json, os, sys
with open(os.environ['ROUTING_CALLS'], 'a') as stream:
    stream.write(json.dumps({'argv': sys.argv[1:], 'cwd': os.getcwd()}) + '\\n')
print(os.environ.get('ROUTING_STDOUT', '{"schema_version":1,"ok":true,"action":"started"}'))
print(os.environ.get('ROUTING_STDERR', 'delegate diagnostic'), file=sys.stderr)
raise SystemExit(int(os.environ.get('ROUTING_EXIT', '0')))
'''


class RoutingContracts(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="brainlab-routing-")
        self.addCleanup(self.temp.cleanup)
        self.base = Path(self.temp.name)
        self.root = self.base / 'checkout with "quotes" and spaces'
        agents = self.root / ".agents"
        agents.mkdir(parents=True)
        for name in ("models.yaml", "routing.yaml", "roles.yaml"):
            shutil.copyfile(ROOT / ".agents" / name, agents / name)
        shutil.copytree(ROOT / ".agents/agents", agents / "agents")
        # Fixtures provide skill identity only: workers do not read workflow bodies.
        for name in ("ruach-testing", "ruach-simplification", "ruach-handoff", "ruach-workflow-feature"):
            directory = agents / "skills" / name
            directory.mkdir(parents=True)
            (directory / "SKILL.md").write_text("---\nname: " + name + "\n---\n")
        self.home = self.base / "home"
        self.config_home = self.base / "codex config"
        self.config_home.mkdir()
        self.calls = self.base / "calls.jsonl"
        stub_dir = self.base / "bin"
        stub_dir.mkdir()
        self.stub = stub_dir / "bun"
        self.stub.write_text(DELEGATE_STUB)
        self.stub.chmod(0o755)
        herdr = stub_dir / "herdr"
        herdr.write_text(DELEGATE_STUB)
        herdr.chmod(0o755)
        self.env = {**os.environ, "HOME": str(self.home), "CODEX_HOME": str(self.config_home),
                    "BUN_BIN": BUN, "ROUTING_CALLS": str(self.calls),
                    "PATH": str(stub_dir) + os.pathsep + os.environ["PATH"]}
        for key in ("HERDR_ENV", "HERDR_PANE_ID", "ROUTING_EXIT", "ROUTING_STDOUT", "ROUTING_STDERR"):
            self.env.pop(key, None)

    def run_cli(self, *args, success=True):
        result = subprocess.run([str(ENTRY), *args, "--root", str(self.root)],
                                cwd=self.base, env=self.env, text=True, capture_output=True)
        if success:
            self.assertEqual(result.returncode, 0, result.stderr)
            return json.loads(result.stdout)
        self.assertNotEqual(result.returncode, 0)
        return result

    def recorded(self):
        return [json.loads(line) for line in self.calls.read_text().splitlines()] if self.calls.exists() else []

    def edit(self, filename, modify):
        path = self.root / ".agents" / filename
        doc = yaml.safe_load(path.read_text())
        modify(doc)
        path.write_text(yaml.safe_dump(doc))

    def test_preferred_resolution_all_roles_without_side_effects(self):
        for role in ("coordinator", "architect", "scout", "implementer", "reviewer"):
            with self.subTest(role=role):
                result = self.run_cli("resolve", role)
                claude = role in ("coordinator", "architect")
                self.assertEqual(result["selection"]["role"], role)
                self.assertEqual(result["selection"]["route"], CLAUDE if claude else GPT)
                self.assertEqual(result["selection"]["kind"], "claude" if claude else "codex")
                self.assertEqual(result["selection"]["model"], "claude-opus-5-5" if claude else "gpt-6.1-sol")
                self.assertEqual(result["selection"]["effort"], "high")
        self.assertEqual(self.recorded(), [])
        self.assertFalse((self.root / ".agents/scratch").exists())

    def test_explicit_alternatives_and_preferred_overrides(self):
        for role in ("architect", "scout", "implementer", "reviewer"):
            for route in (GPT, CLAUDE):
                with self.subTest(role=role, route=route):
                    self.assertEqual(self.run_cli("resolve", role, "--route", route)["selection"]["route"], route)

    def test_disallowed_route_and_unknown_role_do_not_invoke_herdr(self):
        for args, message in ((["coordinator", "--route", GPT], "disallowed_route"),
                              (["scout", "--route", "unknown"], "disallowed_route"),
                              (["unknown"], "unreadable_file")):
            with self.subTest(args=args):
                result = self.run_cli("start", args[0], "worker", *args[1:], success=False)
                self.assertIn(message, result.stderr)
        self.assertEqual(self.recorded(), [])

    def test_invalid_catalogs_fail_before_herdr(self):
        # Each case protects a schema or reference invariant, including unselected entries.
        cases = [
            ("models.yaml", lambda d: d["models"]["gpt-6.1-sol"].pop("harness"), "missing fields"),
            ("models.yaml", lambda d: d["models"]["gpt-6.1-sol"].pop("native_model"), "missing fields"),
            ("models.yaml", lambda d: d["models"]["gpt-6.1-sol"].update(harness="pi"), "harness must"),
            ("models.yaml", lambda d: d["models"]["gpt-6.1-sol"].update(native_model=""), "non-empty string"),
            ("models.yaml", lambda d: d["models"]["gpt-6.1-sol"].update(effort="high"), "unknown fields"),
            ("routing.yaml", lambda d: d["routes"][CLAUDE].update(model="unknown"), "unknown model"),
            ("routing.yaml", lambda d: d["routes"][GPT].pop("model"), "missing fields"),
            ("routing.yaml", lambda d: d["routes"][GPT].pop("effort"), "missing fields"),
            ("routing.yaml", lambda d: d["routes"][GPT].update(effort="medium"), "effort must"),
            ("roles.yaml", lambda d: d["roles"]["scout"].update(preferred="unknown"), "unknown route"),
            ("roles.yaml", lambda d: d["roles"]["scout"].pop("preferred"), "missing fields"),
            ("roles.yaml", lambda d: d["roles"]["scout"].update(preferred=""), "non-empty string"),
            ("roles.yaml", lambda d: d["roles"]["scout"].update(alternatives=["unknown"]), "unknown route"),
            ("roles.yaml", lambda d: d["roles"]["scout"].update(alternatives=GPT), "must be a list"),
            ("roles.yaml", lambda d: d["roles"].update(unknown={"preferred": GPT}), "unknown roles"),
            ("roles.yaml", lambda d: d["roles"].pop("reviewer"), "missing roles"),
            ("roles.yaml", lambda d: d["roles"]["coordinator"].update(alternatives=[GPT]), "only Claude"),
        ]
        originals = {name: (self.root / ".agents" / name).read_bytes() for name, _, _ in cases}
        for filename, modify, message in cases:
            with self.subTest(filename=filename, message=message):
                for name, body in originals.items():
                    (self.root / ".agents" / name).write_bytes(body)
                self.edit(filename, modify)
                self.assertIn(message, self.run_cli("start", "scout", "worker", success=False).stderr)
                self.assertEqual(self.recorded(), [])

    def test_missing_files_and_ambiguous_yaml(self):
        path = self.root / ".agents/models.yaml"
        original = path.read_bytes()
        for content, message in ((None, "models.yaml"), ("models: [", "invalid YAML"),
                                 ("models: {}\n", "non-empty mapping"),
                                 ("models: {}\nmodels: {}\n", "Duplicate YAML key")):
            with self.subTest(message=message):
                if content is None:
                    path.unlink()
                else:
                    path.write_text(content)
                self.assertIn(message, self.run_cli("start", "scout", "worker", success=False).stderr)
                self.assertEqual(self.recorded(), [])
        path.write_bytes(original)
        (self.root / ".agents/agents/reviewer.md").unlink()
        self.assertIn("missing canonical role file", self.run_cli("start", "scout", "worker", success=False).stderr)
        self.assertEqual(self.recorded(), [])

    def test_start_delegates_exact_role_name_route_root_once(self):
        self.env["BUN_BIN"] = str(self.stub)
        result = self.run_cli("start", "architect", "worker-a", "--route", GPT)
        self.assertEqual(result, {"schema_version": 1, "ok": True, "action": "started"})
        self.assertEqual(self.recorded(), [{"argv": [
            str(ROOT / ".agents/skills/ruach-herdr/scripts/worker.ts"), "start",
            "--role", "architect", "--name", "worker-a", "--repo", str(self.root),
            "--cwd", str(self.root), "--permissions", "auto-review", "--route", GPT], "cwd": str(self.root)}])

    def test_delegate_streams_and_exit_status_are_preserved_without_retry(self):
        self.env["BUN_BIN"] = str(self.stub)
        for code in (2, 3, 4):
            with self.subTest(code=code):
                self.calls.unlink(missing_ok=True)
                self.env.update(ROUTING_EXIT=str(code), ROUTING_STDOUT='{"ok":false,"submission_state":"unknown"}',
                                ROUTING_STDERR="uncertain startup; inspect pane")
                result = self.run_cli("start", "scout", "worker", success=False)
                self.assertEqual(result.returncode, code)
                self.assertEqual(result.stdout, self.env["ROUTING_STDOUT"] + "\n")
                self.assertEqual(result.stderr, self.env["ROUTING_STDERR"] + "\n")
                self.assertEqual(len(self.recorded()), 1)

    def test_resolve_is_offline_no_config_read_or_native_argv(self):
        (self.config_home / "config.toml").write_text('developer_instructions="SECRET_UNTERMINATED')
        result = self.run_cli("resolve", "implementer", "--name", "custom-name")
        self.assertEqual(result["action"], "resolved-offline")
        self.assertEqual(result["selection"]["name"], "custom-name")
        self.assertEqual(result["permissions"], "auto-review")
        self.assertEqual(result["selection"]["permissions"], "auto-review")
        self.assertFalse(result["launchable"])
        self.assertEqual(result["argv"], [])
        self.assertNotIn("SECRET", json.dumps(result))
        self.assertEqual(self.recorded(), [])
        self.assertFalse((self.root / ".agents/scratch").exists())

    def test_retired_pane_option_fails_before_delegation(self):
        self.env["BUN_BIN"] = str(self.stub)
        result = self.run_cli("start", "scout", "worker", "--pane", "existing-pane", success=False)
        self.assertIn("--pane is retired", result.stderr)
        self.assertEqual(self.recorded(), [])

    def test_missing_skill_fails_before_delegation(self):
        self.env["BUN_BIN"] = str(self.stub)
        (self.root / ".agents/skills/ruach-testing/SKILL.md").unlink()
        self.assertIn("Missing canonical skill", self.run_cli("start", "scout", "worker", success=False).stderr)
        self.assertEqual(self.recorded(), [])

    def test_bun_resolution_user_install_then_path(self):
        self.env.pop("BUN_BIN")
        user_bun = self.home / ".bun/bin/bun"
        user_bun.parent.mkdir(parents=True)
        shutil.copyfile(self.stub, user_bun)
        user_bun.chmod(0o755)
        # A failing PATH stub proves the standard user install wins.
        self.stub.write_text("#!/bin/sh\nexit 99\n")
        self.env["PATH"] = str(self.stub.parent) + os.pathsep + os.environ["PATH"]
        self.run_cli("resolve", "scout")
        self.assertEqual(len(self.recorded()), 1)
        user_bun.unlink()
        self.stub.write_text(DELEGATE_STUB)
        self.run_cli("resolve", "scout")
        self.assertEqual(len(self.recorded()), 2)
        self.assertIn("--offline", self.recorded()[1]["argv"])

    def test_explicit_missing_bun_fails_without_fallback(self):
        self.env["BUN_BIN"] = str(self.base / "missing bun")
        result = self.run_cli("resolve", "scout", success=False)
        self.assertEqual(result.returncode, 1)
        self.assertIn("missing bun", result.stderr)
        self.assertEqual(self.recorded(), [])

    def test_invalid_name_is_rejected_by_worker_before_herdr(self):
        result = self.run_cli("start", "scout", 'worker with "quotes"', success=False)
        self.assertIn("invalid_name", result.stderr)
        self.assertEqual(self.recorded(), [])


if __name__ == "__main__":
    unittest.main()
