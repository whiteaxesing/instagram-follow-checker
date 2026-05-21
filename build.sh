#!/usr/bin/env bash
set -e

FILES="content.js popup.html popup.js icons/"

mkdir -p dist

# Chrome
cp manifest.chrome.json manifest.json
zip -r dist/insta-follow-checker-chrome.zip $FILES manifest.json
echo "✓ dist/insta-follow-checker-chrome.zip"

# Firefox
cp manifest.firefox.json manifest.json
zip -r dist/insta-follow-checker-firefox.zip $FILES manifest.json
echo "✓ dist/insta-follow-checker-firefox.zip"

# Restore chrome manifest as default (used when loading unpacked)
cp manifest.chrome.json manifest.json
echo "Done. Zips are in ./dist/"
