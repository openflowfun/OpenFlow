#!/usr/bin/env bash
# Pulls the generated Flow mascot renders + portfolio images into the site.
# Run from the repo root:  bash scripts/fetch-assets.sh
set -euo pipefail
CDN="https://d2ol7oe51mr4n9.cloudfront.net/user_3CVuqPlDiV6iQxEfdAx4bQgvSSf"

for DIR in public/assets site/static/assets; do
  mkdir -p "$DIR/flow" "$DIR/work" "$DIR/content"
done

dl() { curl -fsSL "$CDN/$1" -o "$2"; echo "  ✓ $2"; }

echo "→ Flow mascot renders"
dl 88e4f14b-cc43-402b-98cf-3a4da4c8c715.webp public/assets/flow/hero.webp
dl 5b8e5de8-6127-4b18-9da8-983208c531b4.webp public/assets/flow/fly.webp
dl c319693b-5b69-4709-8c69-01879b759744.webp public/assets/flow/build.webp
dl 15db1a8b-951e-48dc-8293-42ba6df01a22.webp public/assets/flow/welcome.webp
dl f9a91da1-83da-4536-b7fc-89c841acc0bc.webp public/assets/flow/web3.webp

echo "→ Portfolio + content images"
TMP="$(mktemp -d)"
curl -fsSL "$CDN/913bdcff-55f9-49eb-a4e4-6021cb7bf157.zip" -o "$TMP/of-assets.zip"
unzip -oq "$TMP/of-assets.zip" -d public/assets
rm -rf "$TMP"

# keep the source folder in sync so future builds include them
cp -R public/assets/flow public/assets/work public/assets/content site/static/assets/
echo "✓ All assets in place"
