#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
"$ROOT_DIR/scripts/setup_dart_sass.sh"

export PATH="$ROOT_DIR/.tooling/dart-sass:$PATH"

TMP_PUBLIC="$(mktemp -d "$ROOT_DIR/.public-tmp.XXXXXX")"
trap 'rm -rf "$TMP_PUBLIC"' EXIT

# Build to a fresh destination first to avoid local filesystem timeouts
# when Hugo touches existing files in ./public.
hugo --gc --minify --destination "$TMP_PUBLIC"
mkdir -p "$ROOT_DIR/public"
rsync -a --delete "$TMP_PUBLIC"/ "$ROOT_DIR/public"/
