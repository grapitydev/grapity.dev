#!/usr/bin/env bash
# Preview script: build docs + landing page and serve locally

set -euo pipefail

PORT="${1:-8080}"

echo "Building docs..."
bun run docs:build

echo "Post-processing docs for clean URLs..."
bash scripts/post-build.sh dist/docs

echo "Copying landing page files..."
cp index.html dist/
mkdir -p dist/philosophy
cp philosophy.html dist/philosophy/index.html
cp -r css dist/
cp -r assets dist/

echo "Starting preview server on http://localhost:$PORT"
echo "  Landing page: http://localhost:$PORT/"
echo "  Docs:          http://localhost:$PORT/docs/getting-started/quickstart"
echo ""
echo "Press Ctrl+C to stop"
cd dist && python3 -m http.server "$PORT"
