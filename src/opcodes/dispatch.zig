//! Dispatch module for ZigEVM
//! This module handles the dispatch of opcodes to their implementations

const std = @import("std");
const types = @import("../util/types.zig");
const U256 = types.U256;
const Error = types.Error;
const Stack = @import("../stack/stack.zig").Stack;
const Memory = @import("../memory/memory.zig").Memory;
const ReturnData = @import("../interpreter/return_data.zig").ReturnData;
const arithmetic = @import("arithmetic.zig");
const bitwise = @import("bitwise.zig");
const memory_ops = @import("memory.zig");
const return_data_ops = @import("return_data.zig");
const Opcode = @import("opcodes.zig").Opcode;

/// Instruction handler function type
pub const InstructionFn = fn (
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) Error!void;

/// Execute the current instruction
/// This function is called by the interpreter to execute the current opcode
pub fn executeInstruction(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) Error!void {
    // Get the current opcode
    const opcode = code[pc.*];
    
    // Dispatch based on opcode
    switch (opcode) {
        // 0x0* - Stop and arithmetic
        @intFromEnum(Opcode.STOP) => {
            // STOP is handled in the interpreter
            pc.* += 1;
            return;
        },
        @intFromEnum(Opcode.ADD) => {
            try arithmetic.add(stack, memory, code, pc, gas_left, gas_refund);
        },
        @intFromEnum(Opcode.MUL) => {
            try arithmetic.mul(stack, memory, code, pc, gas_left, gas_refund);
        },
        @intFromEnum(Opcode.SUB) => {
            try arithmetic.sub(stack, memory, code, pc, gas_left, gas_refund);
        },
        // More arithmetic opcodes here...
        
        // 0x1* - Comparison and bitwise
        @intFromEnum(Opcode.LT) => {
            try bitwise.lt(stack, memory, code, pc, gas_left, gas_refund);
        },
        // More comparison opcodes here...
        
        // 0x5* - Memory and storage
        @intFromEnum(Opcode.MLOAD) => {
            try memory_ops.mload(stack, memory, code, pc, gas_left, gas_refund);
        },
        @intFromEnum(Opcode.MSTORE) => {
            try memory_ops.mstore(stack, memory, code, pc, gas_left, gas_refund);
        },
        @intFromEnum(Opcode.MSTORE8) => {
            try memory_ops.mstore8(stack, memory, code, pc, gas_left, gas_refund);
        },
        
        // Return data opcodes
        @intFromEnum(Opcode.RETURNDATASIZE) => {
            try returndatasizeInstruction(stack, memory, code, pc, gas_left, gas_refund);
        },
        @intFromEnum(Opcode.RETURNDATACOPY) => {
            try returndatacopyInstruction(stack, memory, code, pc, gas_left, gas_refund);
        },
        
        // More opcodes here...
        
        // 0x60-0x7F - PUSH opcodes
        @intFromEnum(Opcode.PUSH1)...@intFromEnum(Opcode.PUSH32) => {
            try pushInstruction(stack, memory, code, pc, gas_left, gas_refund);
        },
        
        // Other opcodes would be implemented here
        
        else => {
            return Error.InvalidOpcode;
        }
    }
}

/// Implementation of the RETURNDATASIZE opcode
fn returndatasizeInstruction(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) Error!void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Placeholder - in a real implementation, this would access the actual return data buffer
    // Since we don't have access to the return data buffer here, we'll just
    // throw an error for now. The actual implementation would need the interpreter
    // to provide access to the return data buffer.
    
    // Consume gas (same as most simple opcodes)
    if (gas_left.* < 2) {
        return Error.OutOfGas;
    }
    gas_left.* -= 2;
    
    // For now, just push a zero size
    try stack.push(U256.zero());
    
    // Advance PC
    pc.* += 1;
}

/// Implementation of the RETURNDATACOPY opcode
fn returndatacopyInstruction(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) Error!void {
    _ = code;
    _ = gas_refund;
    
    // Placeholder - in a real implementation, this would access the actual return data buffer
    // Since we don't have access to the return data buffer here, we'll just
    // throw an error for now. The actual implementation would need the interpreter
    // to provide access to the return data buffer.
    
    // Pop values from stack (even though we're not using them yet)
    const size = try stack.pop();
    const offset = try stack.pop();
    const dest_offset = try stack.pop();
    
    // Basic gas cost (3 gas) plus memory expansion cost
    if (gas_left.* < 3) {
        return Error.OutOfGas;
    }
    gas_left.* -= 3;
    
    // Ensure the parameters fit in usize
    if (size.words[1] != 0 or size.words[2] != 0 or size.words[3] != 0 or
        offset.words[1] != 0 or offset.words[2] != 0 or offset.words[3] != 0 or
        dest_offset.words[1] != 0 or dest_offset.words[2] != 0 or dest_offset.words[3] != 0) {
        return Error.InvalidOffset;
    }
    
    // Convert to usize
    const mem_size = @as(usize, size.words[0]);
    // We ignore mem_offset because we're not using return data buffer in this placeholder
    // const mem_offset = @as(usize, offset.words[0]);
    const mem_dest = @as(usize, dest_offset.words[0]);
    
    // Skip operation for zero size
    if (mem_size == 0) {
        pc.* += 1;
        return;
    }
    
    // This is just a placeholder that doesn't actually copy any data
    // In a full implementation, it would copy from the return data buffer to memory
    
    // Calculate memory expansion gas cost
    const mem_gas = memory.expand(mem_dest + mem_size);
    if (gas_left.* < mem_gas) {
        return Error.OutOfGas;
    }
    gas_left.* -= mem_gas;
    
    // For now, just write zeros to the destination
    const zeros = [_]u8{0} ** 32;
    const write_size = std.math.min(mem_size, 32);
    memory.store(mem_dest, zeros[0..write_size]);
    
    // Advance PC
    pc.* += 1;
}

/// Implementation of PUSH opcodes (PUSH1-PUSH32)
fn pushInstruction(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) Error!void {
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

/// Enhanced implementation of the RETURNDATASIZE opcode that integrates with the interpreter
/// This is a prototype for how the opcode should be implemented
pub fn executeReturndatasize(
    stack: *Stack,
    return_data: *const ReturnData,
) Error!void {
    // This is the implementation that would be used when the interpreter model is updated
    // to pass the return data buffer to the dispatch system
    try return_data_ops.returndatasize(stack, return_data);
}

/// Enhanced implementation of the RETURNDATACOPY opcode that integrates with the interpreter
/// This is a prototype for how the opcode should be implemented
pub fn executeReturndatacopy(
    stack: *Stack,
    memory: *Memory,
    return_data: *const ReturnData,
) Error!void {
    // This is the implementation that would be used when the interpreter model is updated
    // to pass the return data buffer to the dispatch system
    try return_data_ops.returndatacopy(stack, memory, return_data);
}

// Tests go here
test "dispatch basic" {
    // Test setup
    var stack = Stack.init();
    var memory = try Memory.init(std.testing.allocator);
    defer memory.deinit();
    
    // Simple test bytecode
    const code = [_]u8{
        @intFromEnum(Opcode.PUSH1), 0x10, // Push 16
        @intFromEnum(Opcode.PUSH1), 0x20, // Push 32
        @intFromEnum(Opcode.ADD),        // Add: 16 + 32 = 48
    };
    
    var pc: usize = 0;
    var gas_left: u64 = 1000;
    var gas_refund: u64 = 0;
    
    // Execute PUSH1 0x10
    try executeInstruction(&stack, &memory, &code, &pc, &gas_left, &gas_refund);
    // PC should point to next instruction
    try std.testing.expectEqual(@as(usize, 2), pc);
    // Stack should have one item: 16
    try std.testing.expectEqual(@as(usize, 1), stack.getSize());
    try std.testing.expectEqual(U256.fromU64(16), try stack.peek().*);
    
    // Execute PUSH1 0x20
    try executeInstruction(&stack, &memory, &code, &pc, &gas_left, &gas_refund);
    // PC should point to next instruction
    try std.testing.expectEqual(@as(usize, 4), pc);
    // Stack should have two items: 16, 32 (top)
    try std.testing.expectEqual(@as(usize, 2), stack.getSize());
    try std.testing.expectEqual(U256.fromU64(32), try stack.peek().*);
    
    // Execute ADD
    try executeInstruction(&stack, &memory, &code, &pc, &gas_left, &gas_refund);
    // PC should point to next instruction
    try std.testing.expectEqual(@as(usize, 5), pc);
    // Stack should have one item: 48
    try std.testing.expectEqual(@as(usize, 1), stack.getSize());
    try std.testing.expectEqual(U256.fromU64(48), try stack.peek().*);
}