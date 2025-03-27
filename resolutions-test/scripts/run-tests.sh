#!/bin/sh
set -e

# First build the CLI
sh ./scripts/build-cli.sh

# Then run the tests
npm run test