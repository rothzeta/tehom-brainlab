#!/bin/sh
# Pattern copied from poc-001-linked-formation/scripts/run.sh at c82ec3c
set -eu
prototype_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
# Unimplemented commands fail before argument/prerequisite checks.
case "${1:-}" in
  replay) checkpoint=Q03 ;;
  sweep|probe) checkpoint=Q04 ;;
  *) checkpoint= ;;
esac
if [ -n "$checkpoint" ] && [ ! -f "$prototype_root/scripts/$1.ts" ]; then
  printf 'Q01: %s is implemented by checkpoint %s (script not present)\n' "$1" "$checkpoint" >&2
  exit 2
fi
# Resolve the caller's record before changing directory.
if [ "${1:-}" = replay ]; then
  if [ "$#" -ne 2 ] || [ ! -f "$2" ]; then
    printf '%s\n' 'Q03: replay requires one existing record file' >&2; exit 2
  fi
  record_path=$(CDPATH= cd -- "$(dirname -- "$2")" && pwd)/$(basename -- "$2")
fi
cd "$prototype_root"
. ./runtime.env
command_name=${1:-}
case "$command_name" in
  install|dev|typecheck|test|build|preview|test-browser|replay|sweep|probe) shift ;;
  *) printf '%s\n' 'Q01: expected install/dev/typecheck/test/build/preview/test-browser/replay/sweep/probe' >&2; exit 2 ;;
esac
if [ "$command_name" = install ] && [ ! -f bun.lock ]; then
  printf '%s\n' 'Q01: committed bun.lock required for frozen install' >&2
  exit 1
fi
case "$command_name" in
  dev) port=${POC002_PORT:-5273} ;;
  preview) port=${POC002_PORT:-4273} ;;
  *) port=0 ;;
esac
case "$port" in
  ''|*[!0-9]*) printf '%s\n' 'Q01: POC002_PORT must be a port number' >&2; exit 2 ;;
esac
if [ "${#port}" -gt 5 ] || [ "$port" -gt 65535 ] || { [ "$port" -eq 0 ] && { [ "$command_name" = dev ] || [ "$command_name" = preview ]; }; }; then
  printf '%s\n' 'Q01: POC002_PORT must be between 1 and 65535' >&2; exit 2
fi
# CDP uses locally installed Chrome. Application preview still uses the Docker wrapper.
if [ "$command_name" = test-browser ]; then
  exec sh ./scripts/toolchain.sh "$command_name" "$@"
fi
# Build metadata only; records explicitly say unknown if Git is unavailable.
VITE_POC002_BUILD_REVISION=unknown
if git diff --quiet HEAD -- . 2>/dev/null && [ -z "$(git ls-files --others --exclude-standard -- . 2>/dev/null)" ]; then
  VITE_POC002_BUILD_REVISION=$(git rev-parse HEAD 2>/dev/null || printf unknown)
fi
export VITE_POC002_BUILD_REVISION
case "${POC002_MODE:-docker}" in
  host)
    if [ "$command_name" = replay ]; then set -- "$record_path"; fi
    export POC002_PORT="$port"
    exec sh ./scripts/toolchain.sh "$command_name" "$@"
    ;;
  docker)
    if ! command -v docker >/dev/null 2>&1; then
      printf '%s\n' 'Q01: Docker CLI missing; install Docker or explicitly select POC002_MODE=host' >&2
      exit 1
    fi
    if ! docker info >/dev/null 2>&1; then
      printf '%s\n' 'Q01: Docker daemon inaccessible; check availability and socket permissions' >&2
      exit 1
    fi
    if [ "$command_name" = replay ]; then
      set -- --network none --volume "$record_path:/run-record.json:ro" "$BUN_IMAGE" sh ./scripts/toolchain.sh replay /run-record.json
    else
      set -- "$command_name" "$@"
      if [ "$port" -ne 0 ]; then
        set -- --publish "127.0.0.1:$port:$port" "$BUN_IMAGE" sh ./scripts/toolchain.sh "$@"
      else
        set -- "$BUN_IMAGE" sh ./scripts/toolchain.sh "$@"
      fi
    fi
    # A managed browser preview gets an isolated identity for targeted cleanup.
    if [ "$command_name" = preview ] && [ -n "${POC002_CONTAINER_NAME:-}" ]; then
      set -- --name "$POC002_CONTAINER_NAME" "$@"
    fi
    exec docker run --rm --init --user "$(id -u):$(id -g)" \
      --env HOME=/tmp --env BUN_INSTALL_CACHE_DIR=/tmp/bun-cache \
      --env "POC002_PORT=$port" --env "VITE_POC002_BUILD_REVISION=$VITE_POC002_BUILD_REVISION" --volume "$prototype_root:/app" \
      --volume "$prototype_root/../assets:/assets:ro" --workdir /app "$@"
    ;;
  *) printf '%s\n' 'Q01: POC002_MODE must be docker or host' >&2; exit 2 ;;
esac
