#!/bin/sh
set -eu
# Invoked in the prototype by the host/container wrapper.
. ./runtime.env
if ! command -v bun >/dev/null 2>&1; then
  printf 'P01: Bun %s required on PATH in host mode\n' "$BUN_VERSION" >&2
  exit 1
fi
actual_version=$(bun --version)
if [ "$actual_version" != "$BUN_VERSION" ]; then
  printf 'P01: Bun %s required; found %s\n' "$BUN_VERSION" "$actual_version" >&2
  exit 1
fi
command_name=$1
shift
case "$command_name" in
  install) exec bun install --frozen-lockfile "$@" ;;
  dev|preview) exec bun run --bun "$command_name" --port "$POC001_PORT" "$@" ;;
  test-browser) exec bun run --bun test:browser "$@" ;;
  replay) exec bun ./scripts/replay-run.ts "$@" ;;
  test) exec bun run --bun test:unit "$@" ;;
  typecheck|build) exec bun run --bun "$command_name" "$@" ;;
esac
