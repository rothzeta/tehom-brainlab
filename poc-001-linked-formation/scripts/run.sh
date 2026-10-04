#!/bin/sh
set -eu
prototype_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$prototype_root"
. ./runtime.env
command_name=${1:-}
case "$command_name" in
  install|dev|typecheck|test|build|preview) shift ;;
  *) printf '%s\n' 'P01: expected install/dev/typecheck/test/build/preview' >&2; exit 2 ;;
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
case "${POC001_MODE:-docker}" in
  host)
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
    set -- "$command_name" "$@"
    if [ "$port" -ne 0 ]; then
      set -- --publish "127.0.0.1:$port:$port" "$BUN_IMAGE" sh ./scripts/toolchain.sh "$@"
    else
      set -- "$BUN_IMAGE" sh ./scripts/toolchain.sh "$@"
    fi
    exec docker run --rm --init --user "$(id -u):$(id -g)" \
      --env HOME=/tmp --env BUN_INSTALL_CACHE_DIR=/tmp/bun-cache \
      --env "POC001_PORT=$port" --volume "$prototype_root:/app" \
      --volume "$prototype_root/../assets:/assets:ro" --workdir /app "$@"
    ;;
  *) printf '%s\n' 'P01: POC001_MODE must be docker or host' >&2; exit 2 ;;
esac
