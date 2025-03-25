#!/bin/bash

if [ $# -ne 1 ]; then
  echo "Usage: $0 <solc-version>"
  echo "Example: $0 0.8.28"
  exit 1
fi

VERSION=$1

# Download the solc version
TEMP_FILE=$(mktemp)
URL="https://binaries.soliditylang.org/bin/soljson-v${VERSION}+commit.*.js"

# Get the real URL with the commit hash
REAL_URL=$(curl -sSL "https://binaries.soliditylang.org/bin/" | grep -o "soljson-v${VERSION}+commit\.[a-f0-9]\+\.js" | head -1)

if [ -z "$REAL_URL" ]; then
  echo "Error: Could not find solc version $VERSION"
  exit 1
fi

# Extract the commit hash
COMMIT_HASH=$(echo $REAL_URL | grep -o "commit\.[a-f0-9]\+" | cut -d'.' -f2)

echo "v${VERSION}+commit.${COMMIT_HASH}"