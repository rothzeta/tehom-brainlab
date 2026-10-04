#!/usr/bin/env python3
"""Black-box routing/launch contracts. No real harness or Herdr sessions are started."""
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import tomllib
import unittest

import yaml

ROOT = Path(__file__).resolve().parents[1]
ENTRY = ROOT / "bin/agent-routing"
GPT = "gpt-6.1-sol-high"
CLAUDE = "claude-opus-5.5-high"

STUB = '''#!/usr/bin/env python3
import json, os, pathlib, subprocess, sys
args = sys.argv[1:]
with open(os.environ['ROUTING_CALLS'], 'a') as stream:
    stream.write(json.dumps({'executable': pathlib.Path(sys.argv[0]).name, 'argv': args, 'cwd': os.getcwd()}) + '\\n')
if pathlib.Path(sys.argv[0]).name != 'herdr':
    raise SystemExit(0)
if args[:2] == ['pane', 'layout']:
    result = {'layout': {'panes': [{'pane_id': 'own-pane', 'rect': {'width': int(os.environ.get('ROUTING_WIDTH', '140'))}}]}}
elif args[:2] == ['pane', 'split']:
    result = {'pane': {'pane_id': 'new-pane'}}
elif args[:2] == ['agent', 'start']:
    if os.environ.get('ROUTING_FAIL'):
        print('private failure: ' + repr(args), file=sys.stderr)
        raise SystemExit(23)
    harness = args[args.index('--kind') + 1]
    subprocess.run([harness, *args[args.index('--') + 1:]], check=True)
    result = {'agent': {'name': args[2]}}
else:
    raise SystemExit(24)
print(json.dumps({'result': result}))
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
        for name in ("herdr", "claude", "codex"):
            path = stub_dir / name
            path.write_text(STUB)
            path.chmod(0o755)
        self.env = {**os.environ, "HOME": str(self.home), "CODEX_HOME": str(self.config_home),
                    "PATH": str(stub_dir) + os.pathsep + os.environ["PATH"],
                    "HERDR_ENV": "1", "HERDR_PANE_ID": "own-pane", "ROUTING_CALLS": str(self.calls)}
        self.env.pop("ROUTING_FAIL", None)
        self.env.pop("ROUTING_WIDTH", None)

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
                self.assertEqual(result["role"], role)
                self.assertEqual(result["route"], CLAUDE if claude else GPT)
                self.assertEqual(result["harness"], "claude" if claude else "codex")
                self.assertEqual(result["native_model"], "claude-opus-5-5" if claude else "gpt-6.1-sol")
                self.assertEqual(result["effort"], "high")
        self.assertEqual(self.recorded(), [])
        self.assertFalse((self.root / ".agents/scratch").exists())

    def test_explicit_alternatives_and_preferred_overrides(self):
        for role in ("architect", "scout", "implementer", "reviewer"):
            for route in (GPT, CLAUDE):
                with self.subTest(role=role, route=route):
                    self.assertEqual(self.run_cli("resolve", role, "--route", route)["route"], route)

    def test_disallowed_route_and_unknown_role_do_not_invoke_herdr(self):
        for args, message in ((["coordinator", "--route", GPT], "not allowed"),
                              (["scout", "--route", "unknown"], "not allowed"),
                              (["unknown"], "Unknown role")):
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

    def test_codex_start_preserves_arguments_instructions_and_skill_entries(self):
        prior = 'PRIVATE_SECRET "quoted"\nnext line with $(touch should-not-exist) and `command` \\ path'
        entries = [{"path": '/private/SECRET_SKILL "quoted"/SKILL.md', "enabled": True},
                   {"path": str(self.root / ".agents/skills/ruach-workflow-feature/SKILL.md"), "enabled": True}]
        config = self.config_home / "config.toml"
        config.write_text("developer_instructions=" + json.dumps(prior) + "\n[skills]\nconfig=[" +
                          ",".join('{path=' + json.dumps(e['path']) + ',enabled=true}' for e in entries) + "]\n")
        before = config.read_bytes()
        result = self.run_cli("start", "architect", 'worker with "quotes"', "--route", GPT, "--pane", "existing-pane")
        calls = self.recorded()
        self.assertEqual([c["executable"] for c in calls], ["herdr", "codex"])
        args = calls[1]["argv"]
        self.assertEqual(args[:5], ["--approve-for-me", "-m", "gpt-6.1-sol", "-c", 'model_reasoning_effort="high"'])
        self.assertEqual(len(args), 9)
        overrides = tomllib.loads("\n".join(args[i + 1] for i, arg in enumerate(args) if arg == "-c"))
        body = (self.root / ".agents/agents/architect.md").read_text()
        self.assertEqual(overrides["developer_instructions"], prior + "\n\n" + body)
        self.assertEqual(overrides["skills"]["config"][:-1], entries)
        self.assertEqual(overrides["skills"]["config"][-1], {"path": str(self.root / ".agents/skills/ruach-workflow-feature/SKILL.md"), "enabled": False})
        self.assertEqual(calls[0]["argv"], ["agent", "start", 'worker with "quotes"', "--kind", "codex", "--pane", "existing-pane", "--", *args])
        self.assertEqual(calls[0]["cwd"], str(self.root))
        self.assertEqual(result["pane"], "existing-pane")
        self.assertEqual(config.read_bytes(), before)
        self.assertFalse((self.base / "should-not-exist").exists())
        self.assertNotIn(prior, json.dumps(result))

    def test_claude_argv_adapter_and_workflow_boundary(self):
        for role in ("coordinator", "architect", "scout", "implementer", "reviewer"):
            with self.subTest(role=role):
                self.calls.unlink(missing_ok=True)
                result = self.run_cli("start", role, "worker", "--route", CLAUDE, "--pane", "existing-pane")
                adapter = Path(result["harness_argv"][4])
                expected = ["--append-system-prompt-file", str(self.root / ".agents/agents" / f"{role}.md"),
                            "--add-dir", str(adapter), "--permission-mode", "auto", "--model", "claude-opus-5-5", "--effort", "high"]
                self.assertEqual(self.recorded()[1]["argv"], expected)
                skill_dir = adapter / ".claude/skills"
                expected_skills = {"ruach-testing", "ruach-simplification", "ruach-handoff"}
                if role == "coordinator":
                    expected_skills.add("ruach-workflow-feature")
                self.assertEqual({p.name for p in skill_dir.iterdir()}, expected_skills)
                for path in skill_dir.iterdir():
                    self.assertTrue(path.is_symlink())
                    self.assertEqual(path.resolve(), self.root / ".agents/skills" / path.name)
                self.assertTrue(adapter.is_relative_to(self.root / ".agents/scratch"))
                self.assertFalse((self.root / ".claude").exists())

    def test_sibling_pane_uses_layout_no_focus_and_checkout(self):
        for width, direction in ((140, "right"), (80, "down")):
            with self.subTest(width=width):
                self.calls.unlink(missing_ok=True)
                self.env["ROUTING_WIDTH"] = str(width)
                result = self.run_cli("start", "reviewer", "worker")
                calls = self.recorded()
                self.assertEqual(calls[0]["argv"], ["pane", "layout", "--current"])
                self.assertEqual(calls[1]["argv"], ["pane", "split", "--current", "--direction", direction,
                                                   "--cwd", str(self.root), "--no-focus"])
                self.assertEqual(result["pane"], "new-pane")
                self.assertIn("new-pane", calls[2]["argv"])

    def test_worker_codex_skill_exclusion_all_roles(self):
        for role in ("architect", "scout", "implementer", "reviewer"):
            self.calls.unlink(missing_ok=True)
            self.run_cli("start", role, "worker", "--route", GPT, "--pane", "existing-pane")
            args = self.recorded()[1]["argv"]
            override = next(a for a in args if a.startswith("skills.config="))
            self.assertFalse(tomllib.loads(override)["skills"]["config"][-1]["enabled"])
        # Verify coordinator branch through valid Claude configuration: its adapter includes workflow.
        # GPT orchestration is forbidden, so no artificial coordinator Codex route is introduced.

    def test_dry_run_redacts_secrets_and_creates_nothing(self):
        secret = "UNIQUE_INSTRUCTION_SECRET"
        (self.config_home / "config.toml").write_text('developer_instructions="' + secret + '"\n'
                                                     '[skills]\nconfig=[{path="/SECRET_PATH/skill", enabled=false}]\n')
        result = self.run_cli("resolve", "implementer")
        output = json.dumps(result)
        self.assertNotIn(secret, output)
        self.assertNotIn("SECRET_PATH", output)
        self.assertNotIn((self.root / ".agents/agents/implementer.md").read_text(), output)
        self.assertIn("developer_instructions=<redacted>", result["harness_argv"])
        self.assertIn("skills.config=<redacted>", result["harness_argv"])
        self.assertEqual(result["harness_argv"][:6], ["codex", "--approve-for-me", "-m", "gpt-6.1-sol", "-c", 'model_reasoning_effort="high"'])
        self.assertEqual(self.recorded(), [])
        self.assertFalse((self.root / ".agents/scratch").exists())

    def test_invalid_user_config_redacts_errors_before_pane_creation(self):
        for content, message in (('developer_instructions="SECRET_UNTERMINATED', "invalid TOML"),
                                 ('developer_instructions=123', "must be a string"),
                                 ('[skills]\nconfig="SECRET_BAD_SKILLS"', "must be a list")):
            (self.config_home / "config.toml").write_text(content)
            result = self.run_cli("start", "scout", "worker", success=False)
            self.assertIn(message, result.stderr)
            self.assertNotIn("SECRET", result.stderr)
            self.assertEqual(self.recorded(), [])

    def test_user_config_default_home_when_codex_home_unset(self):
        self.env.pop("CODEX_HOME")
        folder = self.home / ".codex"
        folder.mkdir(parents=True)
        (folder / "config.toml").write_text('developer_instructions="prior guidance"\n')
        self.run_cli("start", "scout", "worker", "--pane", "existing-pane")
        args = self.recorded()[1]["argv"]
        override = next(arg for arg in args if arg.startswith("developer_instructions="))
        self.assertTrue(tomllib.loads(override)["developer_instructions"].startswith("prior guidance\n\n"))

    def test_start_failure_never_switches_route_and_redacts_herdr_output(self):
        (self.config_home / "config.toml").write_text('developer_instructions="SECRET_FAILURE_TEXT"\n')
        self.env["ROUTING_FAIL"] = "1"
        result = self.run_cli("start", "scout", "worker", "--pane", "existing-pane", success=False)
        self.assertIn("exit 23", result.stderr)
        self.assertIn("no fallback", result.stderr)
        self.assertNotIn("SECRET_FAILURE_TEXT", result.stdout + result.stderr)
        self.assertEqual(len(self.recorded()), 1)

    def test_start_requires_herdr_environment(self):
        self.env.pop("HERDR_ENV")
        self.assertIn("HERDR_ENV", self.run_cli("start", "scout", "worker", success=False).stderr)
        self.assertEqual(self.recorded(), [])

    def test_stale_worker_adapter_cannot_expose_workflow(self):
        skills = self.root / ".agents/scratch/agent-routing/claude/scout/.claude/skills"
        skills.mkdir(parents=True)
        (skills / "ruach-workflow-feature").symlink_to(self.root / ".agents/skills/ruach-workflow-feature")
        result = self.run_cli("start", "scout", "worker", "--route", CLAUDE, success=False)
        self.assertIn("unexpected skills", result.stderr)
        self.assertEqual(self.recorded(), [])

    def test_missing_skill_and_launch_prerequisites_fail_before_herdr(self):
        path = self.root / ".agents/skills/ruach-testing/SKILL.md"
        path.unlink()
        self.assertIn("Missing canonical skill", self.run_cli("start", "scout", "worker", success=False).stderr)
        self.assertEqual(self.recorded(), [])
        path.write_text("---\nname: ruach-testing\n---\n")
        (self.base / "bin/codex").unlink()
        # Remove any real codex executable from PATH while retaining the Python interpreter.
        python_link = self.base / "bin/python3"
        python_link.symlink_to(shutil.which("python3"))
        (self.base / "bin/dirname").symlink_to(shutil.which("dirname"))
        self.env["PATH"] = str(self.base / "bin")
        self.assertIn("Missing executable on PATH: codex", self.run_cli("start", "scout", "worker", success=False).stderr)
        self.assertEqual(self.recorded(), [])


if __name__ == "__main__":
    unittest.main()
