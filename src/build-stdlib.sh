#!/bin/bash
set -e

# Build the standard library version of the WASM file
zig build-exe -fno-entry -OReleaseSmall -target wasm32-freestanding ./stdlib3.zig -femit-bin=../dist/stdlib.wasm

echo "WASM build completed"
echo "WASM size: $(ls -lh ../dist/stdlib.wasm | awk '{print $5}')"
echo "WASM path: $(realpath ../dist/stdlib.wasm)"