#!/bin/sh
set -eu

for tool in bun docker just python3; do
  if command -v "$tool" >/dev/null 2>&1; then
    "$tool" --version
  else
    printf '%s: unavailable on PATH\n' "$tool"
  fi
done

if command -v docker >/dev/null 2>&1; then
  if docker_version=$(docker info --format '{{.ServerVersion}}' 2>/dev/null); then
    printf 'Docker daemon: %s\n' "$docker_version"
  else
    printf 'Docker daemon: inaccessible; check daemon availability and socket permissions\n'
  fi
fi

printf 'POC 001: application scaffold and browser verification are still pending\n'
