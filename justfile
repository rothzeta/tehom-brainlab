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

# Resolve or launch a portable role with an explicit model route.
agent-routing *args:
    @./bin/agent-routing "$@"

# Test routing and launch boundaries with stub executables.
test-agent-routing *args:
    @./bin/test-agent-routing "$@"

# Explicitly refresh the generated Ruach snapshot from a local committed source.
sync-ruach *args:
    @python3 scripts/sync-ruach.py install "$@"

# Check installed snapshot integrity; optionally compare with --source DIR.
check-ruach *args:
    @python3 scripts/sync-ruach.py check "$@"

# POC 001: install.
poc-001-install *args:
    @./poc-001-linked-formation/bin/run install "$@"

# POC 001: dev.
poc-001-dev *args:
    @./poc-001-linked-formation/bin/run dev "$@"

# POC 001: typecheck.
poc-001-typecheck *args:
    @./poc-001-linked-formation/bin/run typecheck "$@"

# POC 001: test.
poc-001-test *args:
    @./poc-001-linked-formation/bin/run test "$@"

# POC 001: build.
poc-001-build *args:
    @./poc-001-linked-formation/bin/run build "$@"

# POC 001: preview.
poc-001-preview *args:
    @./poc-001-linked-formation/bin/run preview "$@"

# POC 001: browser checks.
poc-001-test-browser *args:
    @./poc-001-linked-formation/bin/run test-browser "$@"

# POC 001: replay a locally exported attempt.
poc-001-replay *args:
    @./poc-001-linked-formation/bin/run replay "$@"

# POC 002: install.
poc-002-install *args:
    @./poc-002-component-combat/bin/run install "$@"

# POC 002: dev.
poc-002-dev *args:
    @./poc-002-component-combat/bin/run dev "$@"

# POC 002: typecheck.
poc-002-typecheck *args:
    @./poc-002-component-combat/bin/run typecheck "$@"

# POC 002: test.
poc-002-test *args:
    @./poc-002-component-combat/bin/run test "$@"

# POC 002: build.
poc-002-build *args:
    @./poc-002-component-combat/bin/run build "$@"

# POC 002: preview.
poc-002-preview *args:
    @./poc-002-component-combat/bin/run preview "$@"

# POC 002: browser checks.
poc-002-test-browser *args:
    @./poc-002-component-combat/bin/run test-browser "$@"

# POC 002: replay a locally exported attempt.
poc-002-replay *args:
    @./poc-002-component-combat/bin/run replay "$@"

# POC 002: sweep combat scenarios.
poc-002-sweep *args:
    @./poc-002-component-combat/bin/run sweep "$@"

# POC 002: probe combat policies.
poc-002-probe *args:
    @./poc-002-component-combat/bin/run probe "$@"
