#!/bin/bash

# Fix missing newlines in src/evm files
echo "Adding newlines to src/evm files..."
find src/evm -name "*.zig" -type f | while read -r file; do
    if [ -n "$(tail -c 1 "$file")" ]; then
        echo "" >> "$file"
        echo "Fixed: $file"
    fi
done

# Fix missing newline in src/Utils/utils.zig
if [ -n "$(tail -c 1 "src/Utils/utils.zig")" ]; then
    echo "" >> "src/Utils/utils.zig"
    echo "Fixed: src/Utils/utils.zig"
fi

echo "All files fixed!"