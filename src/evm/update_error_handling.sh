#!/bin/bash

# Script to update error handling in all opcode files

echo "Updating error handling in opcode files..."

# List of opcode files to update
FILES=(
    "bitwise.zig"
    "block.zig"
    "comparison.zig"
    "control.zig"
    "crypto.zig"
    "environment.zig"
    "log.zig"
    "memory.zig"
    "stack.zig"
    "system.zig"
)

cd opcodes

for file in "${FILES[@]}"; do
    echo "Processing $file..."
    
    # Check if file has local error helpers
    if grep -q "fn stack_pop" "$file" || grep -q "fn stack_push" "$file"; then
        echo "  Found local error helpers in $file - needs update"
        
        # Add error_mapping import if not present
        if ! grep -q "error_mapping" "$file"; then
            # Add import after other imports
            sed -i '' '/const Vm = @import/a\
const error_mapping = @import("../error_mapping.zig");' "$file"
        fi
        
        # Remove local helper functions
        sed -i '' '/^\/\/ Helper to convert Stack errors/,/^}$/d' "$file"
        sed -i '' '/^fn stack_pop/,/^}$/d' "$file"
        sed -i '' '/^fn stack_push/,/^}$/d' "$file"
        
        # Replace stack_pop calls
        sed -i '' 's/stack_pop(/error_mapping.stack_pop(/g' "$file"
        
        # Replace stack_push calls
        sed -i '' 's/stack_push(/error_mapping.stack_push(/g' "$file"
        
        echo "  Updated $file"
    fi
done

echo "Error handling update complete!"