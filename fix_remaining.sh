#!/bin/bash

# Fix remaining pushStack calls that the first script missed
echo "Fixing remaining pushStack calls..."

# Variables that need wrapping
sed -i '' 's/\.pushStack(max_u256);/.pushStack(\&[_]u256{max_u256});/g' test/evm/opcodes/arithmetic_comprehensive_test.zig
sed -i '' 's/\.pushStack(large1);/.pushStack(\&[_]u256{large1});/g' test/evm/opcodes/arithmetic_comprehensive_test.zig
sed -i '' 's/\.pushStack(large2);/.pushStack(\&[_]u256{large2});/g' test/evm/opcodes/arithmetic_comprehensive_test.zig
sed -i '' 's/\.pushStack(half_max);/.pushStack(\&[_]u256{half_max});/g' test/evm/opcodes/arithmetic_comprehensive_test.zig
sed -i '' 's/\.pushStack(neg_20);/.pushStack(\&[_]u256{neg_20});/g' test/evm/opcodes/arithmetic_comprehensive_test.zig
sed -i '' 's/\.pushStack(min_i256);/.pushStack(\&[_]u256{min_i256});/g' test/evm/opcodes/arithmetic_comprehensive_test.zig
sed -i '' 's/\.pushStack(neg_1);/.pushStack(\&[_]u256{neg_1});/g' test/evm/opcodes/arithmetic_comprehensive_test.zig
sed -i '' 's/\.pushStack(neg_17);/.pushStack(\&[_]u256{neg_17});/g' test/evm/opcodes/arithmetic_comprehensive_test.zig
sed -i '' 's/\.pushStack(max);/.pushStack(\&[_]u256{max});/g' test/evm/opcodes/arithmetic_comprehensive_test.zig
sed -i '' 's/\.pushStack(large);/.pushStack(\&[_]u256{large});/g' test/evm/opcodes/arithmetic_comprehensive_test.zig
sed -i '' 's/\.pushStack(test_value);/.pushStack(\&[_]u256{test_value});/g' test/evm/opcodes/arithmetic_comprehensive_test.zig

# Bitwise test fixes
sed -i '' 's/\.pushStack(max);/.pushStack(\&[_]u256{max});/g' test/evm/opcodes/bitwise_comprehensive_test.zig
sed -i '' 's/\.pushStack(0b1010);/.pushStack(\&[_]u256{0b1010});/g' test/evm/opcodes/bitwise_comprehensive_test.zig
sed -i '' 's/\.pushStack(0b1100);/.pushStack(\&[_]u256{0b1100});/g' test/evm/opcodes/bitwise_comprehensive_test.zig
sed -i '' 's/\.pushStack(std\.math\.maxInt(u256));/.pushStack(\&[_]u256{std.math.maxInt(u256)});/g' test/evm/opcodes/bitwise_comprehensive_test.zig
sed -i '' 's/\.pushStack(original);/.pushStack(\&[_]u256{original});/g' test/evm/opcodes/bitwise_comprehensive_test.zig

echo "Done!"