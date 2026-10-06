#!/bin/sh
set -eu
prototype_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
# Resolve the caller's record before changing directory; Docker mounts only this named input.
if [ "${1:-}" = replay ]; then
  if [ "$#" -ne 2 ] || [ ! -f "$2" ]; then
    printf '%s\n' 'P11: replay requires one existing record file' >&2; exit 2
  fi
  record_path=$(CDPATH= cd -- "$(dirname -- "$2")" && pwd)/$(basename -- "$2")
fi
cd "$prototype_root"
. ./runtime.env
command_name=${1:-}
case "$command_name" in
  install|dev|typecheck|test|build|preview|test-browser|replay) shift ;;
  *) printf '%s\n' 'P01: expected install/dev/typecheck/test/build/preview/test-browser/replay' >&2; exit 2 ;;
esac
if [ "$command_name" = install ] && [ ! -f bun.lock ]; then
  printf '%s\n' 'P01: committed bun.lock required for frozen install' >&2
  exit 1
fi
case "$command_name" in
  dev) port=${POC001_PORT:-5173} ;;
  preview) port=${POC001_PORT:-4173} ;;
  *) port=0 ;;
esac
case "$port" in
  ''|*[!0-9]*) printf '%s\n' 'P01: POC001_PORT must be a port number' >&2; exit 2 ;;
esac
if [ "$port" -gt 65535 ] || { [ "$port" -eq 0 ] && { [ "$command_name" = dev ] || [ "$command_name" = preview ]; }; }; then
  printf '%s\n' 'P01: POC001_PORT must be between 1 and 65535' >&2; exit 2
fi
# CDP uses locally installed Chrome. Application preview still uses the Docker wrapper.
if [ "$command_name" = test-browser ]; then
  exec sh ./scripts/toolchain.sh "$command_name" "$@"
fi
# Build metadata only; records explicitly say unknown if Git is unavailable.
VITE_POC001_BUILD_REVISION=unknown
if git diff --quiet HEAD -- . 2>/dev/null && [ -z "$(git ls-files --others --exclude-standard -- . 2>/dev/null)" ]; then
  VITE_POC001_BUILD_REVISION=$(git rev-parse HEAD 2>/dev/null || printf unknown)
fi
export VITE_POC001_BUILD_REVISION
case "${POC001_MODE:-docker}" in
  host)
    if [ "$command_name" = replay ]; then set -- "$record_path"; fi
    export POC001_PORT="$port"
    exec sh ./scripts/toolchain.sh "$command_name" "$@"
    ;;
  docker)
    if ! command -v docker >/dev/null 2>&1; then
      printf '%s\n' 'P01: Docker CLI missing; install Docker or explicitly select POC001_MODE=host' >&2
      exit 1
    fi
    if ! docker info >/dev/null 2>&1; then
      printf '%s\n' 'P01: Docker daemon inaccessible; check availability and socket permissions' >&2
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
    if [ "$command_name" = preview ] && [ -n "${POC001_CONTAINER_NAME:-}" ]; then
      set -- --name "$POC001_CONTAINER_NAME" "$@"
    fi
    exec docker run --rm --init --user "$(id -u):$(id -g)" \
      --env HOME=/tmp --env BUN_INSTALL_CACHE_DIR=/tmp/bun-cache \
      --env "POC001_PORT=$port" --env "VITE_POC001_BUILD_REVISION=$VITE_POC001_BUILD_REVISION" --volume "$prototype_root:/app" \
      --volume "$prototype_root/../assets:/assets:ro" --workdir /app "$@"
    ;;
  *) printf '%s\n' 'P01: POC001_MODE must be docker or host' >&2; exit 2 ;;
esac
