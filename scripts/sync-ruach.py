#!/usr/bin/env python3
"""Expose the installed Ruach snapshot tool for this consumer checkout."""
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
raise SystemExit(subprocess.run([
    sys.executable, str(ROOT / ".agents/ruach-install.py"), *sys.argv[1:],
    "--target", str(ROOT / ".agents"),
]).returncode)
