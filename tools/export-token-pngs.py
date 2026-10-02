#!/usr/bin/env python3
"""Rasterize the registered SVG tokens. Run from any directory.

Optional dependency: pip install cairosvg (plus native Cairo where needed).
This is an asset utility, not a shared game engine or root application.
"""
from __future__ import annotations
import argparse
import hashlib
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]

def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=ROOT / "assets/exports/tokens")
    args = parser.parse_args()
    try:
        import cairosvg
    except (ImportError, OSError) as error:
        print(f"CairoSVG/Cairo unavailable: {error}", file=sys.stderr)
        return 2
    try:
        manifest = json.loads((ROOT / "assets/manifest.json").read_text(encoding="utf-8"))
        jobs = []
        for asset in manifest["assets"]:
            if asset.get("category") != "token" or not asset.get("file", "").endswith(".svg"):
                continue
            source = (ROOT / asset["file"]).resolve()
            if ROOT not in source.parents:
                raise ValueError(f"Asset path escapes repository: {source}")
            data = source.read_bytes()
            if hashlib.sha256(data).hexdigest() != asset["sha256"]:
                raise ValueError(f"Source hash mismatch: {source}")
            settings = asset["pngExport"]
            width, height = int(settings["width"]), int(settings["height"])
            if not 1 <= width <= 4096 or not 1 <= height <= 4096:
                raise ValueError(f"Invalid export dimensions: {asset['id']}")
            jobs.append((source.stem, data, width, height))
        if not jobs:
            raise ValueError("No SVG tokens found in manifest")
        args.output.mkdir(parents=True, exist_ok=True)
        for stem, data, width, height in jobs:
            output = args.output / f"{stem}.png"
            # CairoSVG keeps unsafe XML processing disabled by default.
            rendered = cairosvg.svg2png(bytestring=data, output_width=width, output_height=height)
            temporary = output.with_suffix(".png.tmp")
            temporary.write_bytes(rendered)
            temporary.replace(output)
            print(f"{output} ({width} x {height})")
    except (OSError, ValueError, KeyError, TypeError) as error:
        print(f"Export failed: {error}", file=sys.stderr)
        return 1
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
