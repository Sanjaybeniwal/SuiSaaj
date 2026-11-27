#!/usr/bin/env bash
set -euo pipefail

COMMIT_MESSAGE="${1:-Update SuiSaaj boutique website ($(date '+%Y-%m-%d %H:%M'))}"

echo "1/4 Running backend tests..."
npm test

echo "2/4 Verifying production build..."
npm run build

echo "3/4 Checking Git changes..."
git add -A
if git diff --cached --quiet; then
  echo "No new changes to commit."
else
  git commit -m "$COMMIT_MESSAGE"
fi

echo "4/4 Pushing to origin main (triggers automatic GitHub Pages live deployment)..."
git push -u origin main

echo "Done! Check GitHub Actions for live deployment status."
