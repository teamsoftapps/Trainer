#!/bin/sh

# ci_post_clone.sh
# Xcode Cloud post-clone script — installs dependencies before the build.

set -e

echo "▸ Installing Node.js dependencies..."
# Xcode Cloud provides Homebrew; install Node if not available
if ! command -v node &> /dev/null; then
  echo "▸ Node.js not found, installing via Homebrew..."
  brew install node
fi

echo "▸ Node version: $(node --version)"
echo "▸ npm version: $(npm --version)"

# Navigate to the project root (Xcode Cloud clones into /Volumes/workspace/repository)
cd "$CI_PRIMARY_REPOSITORY_PATH"

echo "▸ Running npm install..."
npm install

echo "▸ Installing CocoaPods dependencies..."
cd ios
pod install

echo "▸ ci_post_clone.sh complete!"
