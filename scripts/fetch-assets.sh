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
dl 49432cfd-ee25-42be-b3c5-84be7a1d9979.webp public/assets/flow/hero.webp
dl 35c438ff-773a-47dd-bcb3-2a64fc53cdaa.webp public/assets/flow/fly.webp
dl 5c3a53ec-8310-4bf0-99d8-a3c4baf56768.webp public/assets/flow/build.webp
dl c0c7ecce-e2a3-4078-8ce0-213cd1c06a6d.webp public/assets/flow/welcome.webp
dl b99b6c87-fd87-490d-b904-3854f2ee34ce.webp public/assets/flow/web3.webp

echo "→ Portfolio + content images"
TMP="$(mktemp -d)"
curl -fsSL "$CDN/913bdcff-55f9-49eb-a4e4-6021cb7bf157.zip" -o "$TMP/of-assets.zip"
unzip -oq "$TMP/of-assets.zip" -d public/assets
rm -rf "$TMP"

# keep the source folder in sync so future builds include them
cp -R public/assets/flow public/assets/work public/assets/content site/static/assets/
echo "✓ All assets in place"
