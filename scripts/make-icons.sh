#!/bin/sh
# Renders the home-screen icons from scripts/app-icon.svg (needs librsvg: brew install librsvg).
set -e
cd "$(dirname "$0")/.."
for size in 180 192 512; do
  rsvg-convert -w $size -h $size scripts/app-icon.svg -o docs/public/icons/icon-$size.png
done
