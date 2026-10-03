set positional-arguments

# List repository commands.
default:
    @just --list

# Inspect development tools and Docker daemon access.
doctor:
    @./bin/doctor

# Export registered SVG tokens as PNGs (requires Python and CairoSVG).
export-tokens *args:
    @./bin/export-token-pngs "$@"
