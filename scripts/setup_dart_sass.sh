#!/usr/bin/env bash
set -euo pipefail

VERSION="1.77.8"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
INSTALL_DIR="$ROOT_DIR/.tooling/dart-sass"
BIN="$INSTALL_DIR/sass"

if [[ -x "$BIN" ]]; then
  exit 0
fi

mkdir -p "$INSTALL_DIR"

UNAME_S="$(uname -s)"
UNAME_M="$(uname -m)"

if [[ "$UNAME_S" == "Darwin" ]]; then
  if [[ "$UNAME_M" == "arm64" ]]; then
    ARCH="macos-arm64"
  else
    ARCH="macos-x64"
  fi
elif [[ "$UNAME_S" == "Linux" ]]; then
  if [[ "$UNAME_M" == "aarch64" || "$UNAME_M" == "arm64" ]]; then
    ARCH="linux-arm64"
  else
    ARCH="linux-x64"
  fi
else
  echo "Unsupported OS: $UNAME_S" >&2
  exit 1
fi

TARBALL="dart-sass-$VERSION-$ARCH.tar.gz"
URL="https://github.com/sass/dart-sass/releases/download/$VERSION/$TARBALL"

curl -L "$URL" -o "/tmp/$TARBALL"
tar -xzf "/tmp/$TARBALL" -C "$INSTALL_DIR" --strip-components=1

if [[ ! -x "$BIN" ]]; then
  echo "Failed to install dart-sass" >&2
  exit 1
fi
