#!/bin/bash

# Fix pushStack calls to use array syntax
files=(
    "/Users/williamcory/tevm/main/g/fix-array-formatting/test/evm/opcodes/bitwise_comprehensive_test.zig"
    "/Users/williamcory/tevm/main/g/fix-array-formatting/test/evm/opcodes/push14_push32_comprehensive_test.zig"
    "/Users/williamcory/tevm/main/g/fix-array-formatting/test/evm/opcodes/arithmetic_comprehensive_test.zig"
    "/Users/williamcory/tevm/main/g/fix-array-formatting/test/evm/opcodes/storage_comprehensive_test.zig"
    "/Users/williamcory/tevm/main/g/fix-array-formatting/test/evm/opcodes/dup1_dup16_comprehensive_test.zig"
    "/Users/williamcory/tevm/main/g/fix-array-formatting/test/evm/opcodes/control_system_comprehensive_test.zig"
    "/Users/williamcory/tevm/main/g/fix-array-formatting/test/evm/opcodes/create_call_comprehensive_test.zig"
    "/Users/williamcory/tevm/main/g/fix-array-formatting/test/evm/opcodes/swap1_swap16_comprehensive_test.zig"
    "/Users/williamcory/tevm/main/g/fix-array-formatting/test/evm/opcodes/log0_log4_comprehensive_test.zig"
)

for file in "${files[@]}"; do
    echo "Processing $file"
    # Replace pushStack(number) with pushStack(&[_]u256{number})
    sed -i '' -E 's/pushStack\(([0-9]+)\)/pushStack(\&[_]u256{\1})/g' "$file"
    
    # Replace pushStack(0x...) with pushStack(&[_]u256{0x...})
    sed -i '' -E 's/pushStack\((0x[0-9a-fA-F]+)\)/pushStack(\&[_]u256{\1})/g' "$file"
    
    # Replace pushStack(variable) with pushStack(&[_]u256{variable}) where variable starts with a letter
    sed -i '' -E 's/pushStack\(([a-zA-Z][a-zA-Z0-9_]*)\)/pushStack(\&[_]u256{\1})/g' "$file"
done

echo "Done processing all files"