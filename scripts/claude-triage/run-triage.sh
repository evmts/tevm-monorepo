#!/bin/bash
# Run Claude Issue Triage Automation
# Usage: ./scripts/claude-triage/run-triage.sh [options]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Change to repo root
cd "$REPO_ROOT"

# Check for Python 3
if ! command -v python3 &> /dev/null; then
    echo "Error: python3 is required"
    exit 1
fi

# Check for required Python packages
if ! python3 -c "import asyncio" 2>/dev/null; then
    echo "Error: Python asyncio module not found"
    exit 1
fi

# Check for gh CLI
if ! command -v gh &> /dev/null; then
    echo "Warning: gh CLI not found, issue fetching may fail"
fi

# Create reports directory
mkdir -p .claude/triage-reports

# Run the automation
python3 "$SCRIPT_DIR/triage-loop.py" "$@"
