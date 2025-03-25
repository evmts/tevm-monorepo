#!/bin/bash

# This is a simple shell wrapper around the Node.js script
# It ensures the script is executed with the correct Node.js environment

# Find the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Execute the Node.js script with the provided arguments
node "$SCRIPT_DIR/index.cjs" "$@"