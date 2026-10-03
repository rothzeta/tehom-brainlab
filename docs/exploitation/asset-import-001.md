# Asset import 001 — symbolic POC tokens

Date: 2 October 2026

## Delivered scope

Seven transparent SVG emblems sourced from a single artist, Lorc, through Game-icons.net. They represent the three Brood, the ordinary patrol, and the Foundry Mechanism during combat testing. Source blob hashes, exported-file hashes, creator, source URL, license, and modifications are recorded in `assets/manifest.json`.

The emblems are not final character illustrations or historically authenticated portraits. A lion, scorpion, and daemon skull are stand-ins for the Brood; the enemy symbols are a gate, smoke, winged sword, and cog. This does not revise the game's intended visual direction.

The repository also includes full attribution, the upstream license notice, and an optional PNG export tool. PNGs were rendered locally and reviewed; committed source assets are SVG. No game code or combat rules changed.

## Validation

Original path data was checked against each upstream Git blob SHA before export. SVGs were parsed and rasterized locally. PNG exports were checked for dimensions, nonempty alpha, transparent corners, and absence of fully opaque backgrounds. A local review layout was tested in Chromium using in-memory SVG data URLs; local HTTP navigation was blocked by the test environment. These are asset checks, not combat playtest results.

## Not delivered

No final illustrated creatures, animation sheets, background painting, font files, music, or sound clips. Official CC0 sound candidates are listed in `assets/audio/SOURCES.md`; their pack downloads failed, so none are marked available. A preview-page repository write was blocked by the connector, so no preview HTML file is included or linked as available. No browser deployment or prototype asset-copy pipeline has been added.
