# Shared assets

## Available now

Seven consistent, transparent **SVG emblems** for POC 001 are in `tokens/`. Original icons are by Lorc / Game-icons.net under CC BY 3.0. See [credits](CREDITS.md), [manifest](manifest.json), and the retained upstream [license notice](licenses/game-icons-license.txt).

These are symbolic placeholders, not final creature illustrations. They do not replace the planned character-art direction. The white foreground is suitable for runtime tinting; there are no baked faction colors, hexes, facing arrows, links, or status badges. View the white SVGs against a dark surface.

## PNG exports (optional)

SVGs are the committed source assets. Generate transparent PNGs when the prototype needs them:

```sh
python -m pip install cairosvg
python tools/export-token-pngs.py
```

This creates six 256 x 256 PNGs and one 512 x 512 boss PNG in `assets/exports/tokens/`. CairoSVG also needs the native Cairo runtime on platforms that do not already provide it. The exporter supports `--output` to choose another directory. It verifies input hashes before rendering. Exported PNGs keep the same credit requirement.

## Integration contract

- Manifest paths are relative to the repository root, not a prototype's web root.
- No automatic public-folder copy or asset loader is installed yet.
- Keep token artwork upright. Facing, selection, health, and links belong to the renderer.
- Continue to support labelled placeholders if an asset is missing.
- Keep text labels visible; the emblems do not establish final character silhouettes.
- No preview web page has been committed.
- `backgrounds/` and `audio/` still contain no production assets. No fonts, music, tile sets, or animation sheets are included.

Register every future import in `manifest.json`, including its actual file, original creator, source, license, and modifications. Do not register planned downloads as available.
