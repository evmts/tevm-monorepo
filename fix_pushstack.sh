#!/bin/bash

# Fix all pushStack calls to use array syntax
echo "Fixing pushStack API calls in comprehensive tests..."

# Find all test files and replace pushStack calls
find test/evm/opcodes -name "*comprehensive_test.zig" -o -name "*test.zig" | while read file; do
    echo "Processing $file..."
    
    # Replace pushStack calls with single values to use array syntax
    # Handle various patterns:
    # 1. Simple numeric literals: pushStack(5) -> pushStack(&[_]u256{5})
    sed -i '' -E 's/\.pushStack\(([0-9]+)\)/\.pushStack(\&[_]u256{\1})/g' "$file"
    
    # 2. Hex literals: pushStack(0x42) -> pushStack(&[_]u256{0x42})
    sed -i '' -E 's/\.pushStack\((0x[0-9a-fA-F]+)\)/\.pushStack(\&[_]u256{\1})/g' "$file"
    
    # 3. Variables without cast: pushStack(var) -> pushStack(&[_]u256{var})
    sed -i '' -E 's/\.pushStack\(([a-zA-Z_][a-zA-Z0-9_]*)\)([^;])/\.pushStack(\&[_]u256{\1})\2/g' "$file"
    
    # 4. @as(u256, value) patterns: pushStack(@as(u256, value)) -> pushStack(&[_]u256{value})
    sed -i '' -E 's/\.pushStack\(@as\(u256, ([^)]+)\)\)/\.pushStack(\&[_]u256{\1})/g' "$file"
    
    # 5. @intCast patterns need special handling
    sed -i '' -E 's/\.pushStack\(@intCast\(([^)]+)\)\)/\.pushStack(\&[_]u256{@as(u256, @intCast(\1))})/g' "$file"
    
    # 6. Fix any double-wrapped cases that might have been created
    sed -i '' -E 's/\.pushStack\(\&\[_\]u256\{\&\[_\]u256\{([^}]+)\}\}\)/\.pushStack(\&[_]u256{\1})/g' "$file"
done

echo "Done! Now let's check if there are any remaining issues..."

# Check for any remaining bare pushStack calls that might have been missed
echo ""
echo "Checking for any remaining bare pushStack calls:"
grep -n "\.pushStack(" test/evm/opcodes/*test.zig | grep -v "&\[_\]u256{" | head -20 || echo "All pushStack calls appear to be fixed!"