#!/bin/sh
set -e

# Create bin directory if it doesn't exist
mkdir -p ../resolutions-go/bin

# Build the CLI
cd ../resolutions-go
go build -o bin/cli cmd/cli/main.go

echo "CLI built successfully at resolutions-go/bin/cli"