//! Control flow operations for ZigEVM
//! This module implements JUMP and JUMPI opcodes

const std = @import("std");
const types = @import("../util/types.zig");
const U256 = types.U256;
const Error = types.Error;
const Stack = @import("../stack/stack.zig").Stack;
const Memory = @import("../memory/memory.zig").Memory;
const Opcode = @import("opcodes.zig").Opcode;

/// Gas cost for JUMP and JUMPI
const JUMP_GAS_COST: u64 = 8;
const JUMPI_GAS_COST: u64 = 10;

/// Implementation of the JUMP opcode
/// Unconditionally alter program counter
pub fn jump(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Consume gas
    if (gas_left.* < JUMP_GAS_COST) {
        return Error.OutOfGas;
    }
    gas_left.* -= JUMP_GAS_COST;
    
    // Pop destination from stack
    const dest_u256 = try stack.pop();
    
    // Ensure the destination fits in usize
    if (dest_u256.words[1] != 0 or dest_u256.words[2] != 0 or dest_u256.words[3] != 0) {
        return Error.InvalidJump;
    }
    
    // Convert to usize
    const dest = @as(usize, dest_u256.words[0]);
    
    // Ensure destination is within bounds
    if (dest >= code.len) {
        return Error.InvalidJump;
    }
    
    // Ensure destination is a JUMPDEST
    // Note: This check should be done in the interpreter
    // because it requires the jump destination map
    // Here we just set the PC and return Error.InvalidJump
    // The interpreter will check if it's a valid jump destination
    
    // Set the program counter to the destination
    // Note: We do not increment PC here, as the destination should point
    // directly to the next instruction to execute
    pc.* = dest;
    
    // Signal invalid jump for the interpreter to validate
    return Error.InvalidJump;
}

/// Implementation of the JUMPI opcode
/// Conditionally alter program counter
pub fn jumpi(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Consume gas
    if (gas_left.* < JUMPI_GAS_COST) {
        return Error.OutOfGas;
    }
    gas_left.* -= JUMPI_GAS_COST;
    
    // Pop destination and condition from stack
    const condition = try stack.pop();
    const dest_u256 = try stack.pop();
    
    // If condition is zero, don't jump
    if (condition.isZero()) {
        // Just advance PC to the next instruction
        pc.* += 1;
        return;
    }
    
    // Ensure the destination fits in usize
    if (dest_u256.words[1] != 0 or dest_u256.words[2] != 0 or dest_u256.words[3] != 0) {
        return Error.InvalidJump;
    }
    
    // Convert to usize
    const dest = @as(usize, dest_u256.words[0]);
    
    // Ensure destination is within bounds
    if (dest >= code.len) {
        return Error.InvalidJump;
    }
    
    // Ensure destination is a JUMPDEST
    // Note: This check should be done in the interpreter
    // because it requires the jump destination map
    // Here we just set the PC and return Error.InvalidJump
    // The interpreter will check if it's a valid jump destination
    
    // Set the program counter to the destination
    // Note: We do not increment PC here, as the destination should point
    // directly to the next instruction to execute
    pc.* = dest;
    
    // Signal invalid jump for the interpreter to validate
    return Error.InvalidJump;
}

// Tests
test "JUMP operation" {
    var stack = Stack.init();
    var memory = try Memory.init(std.testing.allocator);
    defer memory.deinit();
    
    // Create a simple program with JUMPDEST
    // 0: PUSH1 0x03
    // 2: JUMP
    // 3: JUMPDEST
    const code = [_]u8{
        @intFromEnum(Opcode.PUSH1), 0x03,  // Push jump destination (0x03)
        @intFromEnum(Opcode.JUMP),         // Jump to 0x03
        @intFromEnum(Opcode.JUMPDEST),     // JUMPDEST (0x03)
    };
    
    var pc: usize = 0;
    var gas_left: u64 = 100;
    var gas_refund: u64 = 0;
    
    // Execute PUSH1 0x03
    pc = 0;
    try pushInstruction(&stack, &memory, &code, &pc, &gas_left, &gas_refund);
    try std.testing.expectEqual(@as(usize, 2), pc);
    try std.testing.expectEqual(@as(usize, 1), stack.getSize());
    try std.testing.expectEqual(U256.fromU64(3), try stack.peek().*);
    
    // Execute JUMP
    // Note: This will return Error.InvalidJump, which is expected
    // since the validation happens in the interpreter
    const err = jump(&stack, &memory, &code, &pc, &gas_left, &gas_refund);
    try std.testing.expectError(Error.InvalidJump, err);
    
    // PC should be updated to the jump destination
    try std.testing.expectEqual(@as(usize, 3), pc);
    
    // Stack should be empty
    try std.testing.expectEqual(@as(usize, 0), stack.getSize());
}

test "JUMPI operation (condition true)" {
    var stack = Stack.init();
    var memory = try Memory.init(std.testing.allocator);
    defer memory.deinit();
    
    // Create a simple program with JUMPDEST
    // 0: PUSH1 0x01  (non-zero condition)
    // 2: PUSH1 0x05  (jump destination)
    // 4: JUMPI
    // 5: JUMPDEST
    const code = [_]u8{
        @intFromEnum(Opcode.PUSH1), 0x01,  // Push non-zero condition
        @intFromEnum(Opcode.PUSH1), 0x05,  // Push jump destination (0x05)
        @intFromEnum(Opcode.JUMPI),        // Conditional jump to 0x05
        @intFromEnum(Opcode.JUMPDEST),     // JUMPDEST (0x05)
    };
    
    var pc: usize = 0;
    var gas_left: u64 = 100;
    var gas_refund: u64 = 0;
    
    // Execute PUSH1 0x01
    pc = 0;
    try pushInstruction(&stack, &memory, &code, &pc, &gas_left, &gas_refund);
    try std.testing.expectEqual(@as(usize, 2), pc);
    
    // Execute PUSH1 0x05
    try pushInstruction(&stack, &memory, &code, &pc, &gas_left, &gas_refund);
    try std.testing.expectEqual(@as(usize, 4), pc);
    
    // Execute JUMPI
    // Note: This will return Error.InvalidJump, which is expected
    // since the validation happens in the interpreter
    const err = jumpi(&stack, &memory, &code, &pc, &gas_left, &gas_refund);
    try std.testing.expectError(Error.InvalidJump, err);
    
    // PC should be updated to the jump destination
    try std.testing.expectEqual(@as(usize, 5), pc);
    
    // Stack should be empty
    try std.testing.expectEqual(@as(usize, 0), stack.getSize());
}

test "JUMPI operation (condition false)" {
    var stack = Stack.init();
    var memory = try Memory.init(std.testing.allocator);
    defer memory.deinit();
    
    // Create a simple program with JUMPDEST
    // 0: PUSH1 0x00  (zero condition)
    // 2: PUSH1 0x05  (jump destination)
    // 4: JUMPI
    // 5: JUMPDEST
    const code = [_]u8{
        @intFromEnum(Opcode.PUSH1), 0x00,  // Push zero condition
        @intFromEnum(Opcode.PUSH1), 0x05,  // Push jump destination (0x05)
        @intFromEnum(Opcode.JUMPI),        // Conditional jump to 0x05
        @intFromEnum(Opcode.JUMPDEST),     // JUMPDEST (0x05)
    };
    
    var pc: usize = 0;
    var gas_left: u64 = 100;
    var gas_refund: u64 = 0;
    
    // Execute PUSH1 0x00
    pc = 0;
    try pushInstruction(&stack, &memory, &code, &pc, &gas_left, &gas_refund);
    try std.testing.expectEqual(@as(usize, 2), pc);
    
    // Execute PUSH1 0x05
    try pushInstruction(&stack, &memory, &code, &pc, &gas_left, &gas_refund);
    try std.testing.expectEqual(@as(usize, 4), pc);
    
    // Execute JUMPI with zero condition
    try jumpi(&stack, &memory, &code, &pc, &gas_left, &gas_refund);
    
    // PC should advance to the next instruction (not jump)
    try std.testing.expectEqual(@as(usize, 5), pc);
    
    // Stack should be empty
    try std.testing.expectEqual(@as(usize, 0), stack.getSize());
}

/// Implementation of PUSH opcodes (PUSH1-PUSH32) for test purposes
fn pushInstruction(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) !void {
    _ = memory;
    _ = gas_refund;
    
    // Get the opcode
    const opcode = code[pc.*];
    
    // Consume gas
    if (gas_left.* < 3) {
        return Error.OutOfGas;
    }
    gas_left.* -= 3;
    
    // Determine number of bytes to push
    const n = opcode - (@intFromEnum(Opcode.PUSH1) - 1);
    
    // Build value to push
    var value = U256.zero();
    
    // Check if we have enough bytes left
    if (pc.* + n >= code.len) {
        // Not enough bytes left, pad with zeros
        const available = code.len - (pc.* + 1);
        for (0..available) |i| {
            if (pc.* + 1 + i < code.len) {
                value = value.shl(8);
                value = value.add(U256.fromU64(code[pc.* + 1 + i]));
            }
        }
    } else {
        // Read n bytes
        for (0..n) |i| {
            value = value.shl(8);
            value = value.add(U256.fromU64(code[pc.* + 1 + i]));
        }
    }
    
    // Push value to stack
    try stack.push(value);
    
    // Advance PC
    pc.* += 1 + n;
}