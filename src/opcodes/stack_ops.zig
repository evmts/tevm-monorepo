//! Stack operations for ZigEVM
//! This module implements DUP and SWAP opcodes

const std = @import("std");
const types = @import("../util/types.zig");
const U256 = types.U256;
const Error = types.Error;
const Stack = @import("../stack/stack.zig").Stack;
const Memory = @import("../memory/memory.zig").Memory;
const Opcode = @import("opcodes.zig").Opcode;

/// Basic gas cost for all stack operations
const STACK_OP_GAS_COST: u64 = 3;

/// Implement DUP opcodes (DUP1-DUP16)
/// Duplicates the nth item from the top of the stack
pub fn dup(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) !void {
    _ = memory;
    _ = gas_refund;
    // code is used to get the opcode
    
    // Get the current opcode
    const opcode = code[pc.*];
    
    // Calculate which item to duplicate (1-indexed, so DUP1 duplicates the top item)
    const n = opcode - @intFromEnum(Opcode.DUP1) + 1;
    
    // Consume gas
    if (gas_left.* < STACK_OP_GAS_COST) {
        return Error.OutOfGas;
    }
    gas_left.* -= STACK_OP_GAS_COST;
    
    // Check if the stack has enough items
    if (stack.getSize() < n) {
        return Error.StackUnderflow;
    }
    
    // Get the item to duplicate (using peek to look at items below the top)
    const item = try stack.peekAt(n - 1);
    
    // Push a copy of the item to the stack
    try stack.push(item.*);
    
    // Advance PC
    pc.* += 1;
}

/// Implement SWAP opcodes (SWAP1-SWAP16)
/// Swaps the top stack item with the nth item
pub fn swap(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) !void {
    _ = memory;
    _ = gas_refund;
    // code is used to get the opcode
    
    // Get the current opcode
    const opcode = code[pc.*];
    
    // Calculate which item to swap with the top (1-indexed, so SWAP1 swaps with the 2nd item)
    const n = opcode - @intFromEnum(Opcode.SWAP1) + 1;
    
    // Consume gas
    if (gas_left.* < STACK_OP_GAS_COST) {
        return Error.OutOfGas;
    }
    gas_left.* -= STACK_OP_GAS_COST;
    
    // Check if the stack has enough items
    if (stack.getSize() < n + 1) {
        return Error.StackUnderflow;
    }
    
    // Swap the items
    try stack.swap(0, n);
    
    // Advance PC
    pc.* += 1;
}

// Tests
test "DUP operations" {
    var stack = Stack.init();
    var memory = try Memory.init(std.testing.allocator);
    defer memory.deinit();
    
    var dummy_code = [_]u8{@intFromEnum(Opcode.DUP1)};
    var pc: usize = 0;
    var gas_left: u64 = 100;
    var gas_refund: u64 = 0;
    
    // Push some values onto the stack
    try stack.push(U256.fromU64(1));
    try stack.push(U256.fromU64(2));
    try stack.push(U256.fromU64(3));
    try stack.push(U256.fromU64(4));
    
    // Test DUP1 (duplicate the top item)
    dummy_code[0] = @intFromEnum(Opcode.DUP1);
    pc = 0;
    gas_left = 100;
    
    try dup(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund);
    
    // Stack should now be [1, 2, 3, 4, 4]
    try std.testing.expectEqual(@as(usize, 5), stack.getSize());
    try std.testing.expectEqual(U256.fromU64(4), try stack.pop());
    try std.testing.expectEqual(U256.fromU64(4), try stack.pop());
    
    // Test DUP3 (duplicate the 3rd item from the top)
    dummy_code[0] = @intFromEnum(Opcode.DUP3);
    pc = 0;
    gas_left = 100;
    
    // Stack is now [1, 2, 3]
    try dup(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund);
    
    // Stack should now be [1, 2, 3, 1]
    try std.testing.expectEqual(@as(usize, 4), stack.getSize());
    try std.testing.expectEqual(U256.fromU64(1), try stack.pop());
    try std.testing.expectEqual(U256.fromU64(3), try stack.pop());
    try std.testing.expectEqual(U256.fromU64(2), try stack.pop());
    try std.testing.expectEqual(U256.fromU64(1), try stack.pop());
    
    // Test stack underflow
    try stack.push(U256.fromU64(42));
    dummy_code[0] = @intFromEnum(Opcode.DUP2);
    pc = 0;
    gas_left = 100;
    
    try std.testing.expectError(Error.StackUnderflow, dup(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund));
}

test "SWAP operations" {
    var stack = Stack.init();
    var memory = try Memory.init(std.testing.allocator);
    defer memory.deinit();
    
    var dummy_code = [_]u8{@intFromEnum(Opcode.SWAP1)};
    var pc: usize = 0;
    var gas_left: u64 = 100;
    var gas_refund: u64 = 0;
    
    // Push some values onto the stack
    try stack.push(U256.fromU64(1));
    try stack.push(U256.fromU64(2));
    try stack.push(U256.fromU64(3));
    try stack.push(U256.fromU64(4));
    
    // Test SWAP1 (swap the top item with the 2nd item)
    dummy_code[0] = @intFromEnum(Opcode.SWAP1);
    pc = 0;
    gas_left = 100;
    
    try swap(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund);
    
    // Stack should now be [1, 2, 4, 3]
    try std.testing.expectEqual(@as(usize, 4), stack.getSize());
    try std.testing.expectEqual(U256.fromU64(3), try stack.pop());
    try std.testing.expectEqual(U256.fromU64(4), try stack.pop());
    
    // Test SWAP2 (swap the top item with the 3rd item)
    dummy_code[0] = @intFromEnum(Opcode.SWAP2);
    pc = 0;
    gas_left = 100;
    
    // Stack is now [1, 2]
    try stack.push(U256.fromU64(3));
    try stack.push(U256.fromU64(4));
    
    // Stack is [1, 2, 3, 4]
    try swap(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund);
    
    // Stack should now be [1, 4, 3, 2]
    try std.testing.expectEqual(@as(usize, 4), stack.getSize());
    try std.testing.expectEqual(U256.fromU64(2), try stack.pop());
    try std.testing.expectEqual(U256.fromU64(3), try stack.pop());
    try std.testing.expectEqual(U256.fromU64(4), try stack.pop());
    try std.testing.expectEqual(U256.fromU64(1), try stack.pop());
    
    // Test stack underflow
    try stack.push(U256.fromU64(42));
    try stack.push(U256.fromU64(43));
    dummy_code[0] = @intFromEnum(Opcode.SWAP2);
    pc = 0;
    gas_left = 100;
    
    try std.testing.expectError(Error.StackUnderflow, swap(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund));
}

test "Gas costs" {
    var stack = Stack.init();
    var memory = try Memory.init(std.testing.allocator);
    defer memory.deinit();
    
    var dummy_code = [_]u8{@intFromEnum(Opcode.DUP1)};
    var pc: usize = 0;
    var gas_left: u64 = 3; // Exactly enough gas
    var gas_refund: u64 = 0;
    
    // Push a value onto the stack
    try stack.push(U256.fromU64(42));
    
    // DUP1 should consume exactly 3 gas
    try dup(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund);
    try std.testing.expectEqual(@as(u64, 0), gas_left);
    
    // Test out of gas
    dummy_code[0] = @intFromEnum(Opcode.SWAP1);
    pc = 0;
    gas_left = 2; // Not enough gas
    
    try std.testing.expectError(Error.OutOfGas, swap(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund));
}