#!/usr/bin/env bash
# Assembles the build tree in build/src: upstream ecmr-frontend at UPSTREAM_SHA + patches/*.patch + overlay/.
# Overriding an upstream file from overlay/ is an error.
#
# Usage: scripts/assemble.sh [upstream-sha]   (defaults to UPSTREAM_SHA from upstream.lock)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# shellcheck source=/dev/null
. "$ROOT/upstream.lock"

SHA="${1:-$UPSTREAM_SHA}"
CACHE="$ROOT/.upstream/ecmr-frontend"
OUT="$ROOT/build/src"

if [ ! -d "$CACHE/.git" ]; then
  echo ">> Cloning $UPSTREAM_REPO"
  git clone --quiet --filter=blob:none --no-checkout "$UPSTREAM_REPO" "$CACHE"
fi
if ! git -C "$CACHE" cat-file -e "$SHA^{commit}" 2>/dev/null; then
  git -C "$CACHE" fetch --quiet origin
fi
git -C "$CACHE" cat-file -e "$SHA^{commit}" || { echo "Commit $SHA not found in $UPSTREAM_REPO" >&2; exit 1; }

echo ">> Exporting upstream $SHA"
# Keep node_modules between runs (npm ci replaces it anyway); everything else is rebuilt.
if [ -d "$OUT/angular-frontend/node_modules" ]; then
  mv "$OUT/angular-frontend/node_modules" "$ROOT/build/.node_modules"
fi
rm -rf "$OUT"
mkdir -p "$OUT"
# autocrlf off + eol=lf: identical LF tree on Windows and CI, so patches apply the same everywhere
# (without core.eol, Windows git writes CRLF for files that upstream's .gitattributes marks as text)
git -C "$CACHE" -c core.autocrlf=false -c core.eol=lf archive "$SHA" | tar -x -C "$OUT"
if [ -d "$ROOT/build/.node_modules" ]; then
  mv "$ROOT/build/.node_modules" "$OUT/angular-frontend/node_modules"
fi

shopt -s nullglob
patches=("$ROOT"/patches/*.patch)
for p in "${patches[@]}"; do
  echo ">> Applying patch $(basename "$p")"
  # The ceiling keeps git from treating build/src as a subdirectory of this repository:
  # inside a repo, git apply silently skips every path outside the current directory.
  (cd "$OUT" && GIT_CEILING_DIRECTORIES="$ROOT" git -c core.autocrlf=false -c core.eol=lf apply --whitespace=nowarn "$p") || {
    echo "Patch $(basename "$p") no longer applies to upstream $SHA - rebase it or drop it if merged upstream." >&2
    exit 1
  }
done

echo ">> Copying overlay"
collisions=0
while IFS= read -r f; do
  if [ -e "$OUT/$f" ]; then
    echo "Overlay file overrides an upstream file: $f (use a patch instead, or rename)" >&2
    collisions=1
  fi
done < <(cd "$ROOT/overlay" && find . -type f)
[ "$collisions" -eq 0 ] || exit 1
cp -R "$ROOT/overlay/." "$OUT/"

OVERLAY_SHA="$(git -C "$ROOT" rev-parse --verify -q HEAD || echo unknown)"
cat > "$OUT/angular-frontend/src/assets/cargotrack/build.json" <<EOF
{"upstream": "$SHA", "overlay": "$OVERLAY_SHA"}
EOF

echo ">> Done: build/src (upstream $SHA, overlay $OVERLAY_SHA, ${#patches[@]} patch(es))"
