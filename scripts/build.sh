#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
"$ROOT_DIR/scripts/setup_dart_sass.sh"

export PATH="$ROOT_DIR/.tooling/dart-sass:$PATH"

hugo --gc --minify
