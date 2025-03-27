#!/bin/bash
set -e

# First build the CLI
./scripts/build-cli.sh

# Then run the tests
npm run test