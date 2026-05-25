#!/usr/bin/env bash
# Post-build script: convert VitePress .html output to directory-style URLs
# for compatibility with static hosts like GitHub Pages.
#
# Converts:  getting-started/quickstart.html
# To:        getting-started/quickstart/index.html
#
# This makes cleanUrls work on any static file server.

set -euo pipefail

DOCS_DIR="${1:-dist/docs}"

if [ ! -d "$DOCS_DIR" ]; then
  echo "Error: Directory not found: $DOCS_DIR"
  exit 1
fi

# Find all .html files except index.html and 404.html
find "$DOCS_DIR" -name "*.html" -not -name "index.html" -not -name "404.html" -print0 | while IFS= read -r -d '' file; do
  # Remove .html extension to get the directory name
  dir="${file%.html}"

  # Create the directory
  mkdir -p "$dir"

  # Move the file into the directory as index.html
  mv "$file" "$dir/index.html"

  echo "  $file → $dir/index.html"
done

echo "Done. All .html files converted to directory-style URLs."
