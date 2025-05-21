const std = @import("std");

// Use package imports instead of relative imports
const evm = @import("evm");

// Try using package_test if available, otherwise use evm module
const package_test = @cImport({
    @cDefine("PACKAGE_TEST_AVAILABLE", "1");
    _ = @import("package_test.zig");
});

// Use the appropriate types based on what's available
const Frame = if (@hasDecl(package_test, "Frame")) package_test.Frame else evm.Frame;
const ExecutionError = if (@hasDecl(package_test, "ExecutionError")) package_test.ExecutionError else evm.ExecutionError;
const Interpreter = if (@hasDecl(package_test, "Interpreter")) package_test.Interpreter else evm.Interpreter;
const JumpTable = if (@hasDecl(package_test, "JumpTable")) package_test.JumpTable else evm.JumpTable;
const Stack = if (@hasDecl(package_test, "Stack")) package_test.Stack else evm.Stack;

/// KECCAK256 operation - computes Keccak-256 hash of a region of memory
pub fn opKeccak256(pc: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;

    // Pop offset and size from stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }

    const size = try frame.stack.pop();
    const offset = try frame.stack.pop();

    // If size is 0, return empty hash (all zeros)
    if (size == 0) {
        try frame.stack.push(0);
        return "";
    }

    // Get memory range to hash
    const mem_offset = @as(u64, @truncate(offset)); // Convert to u64
    const mem_size = @as(u64, @truncate(size)); // Convert to u64

    // Make sure the memory access is valid
    if (mem_offset + mem_size > frame.memory.data().len) {
        return ExecutionError.OutOfOffset;
    }

    // Get memory slice to hash
    const data = frame.memory.data()[mem_offset .. mem_offset + mem_size];

    // Calculate keccak256 hash
    var hash: [32]u8 = undefined;
    std.crypto.hash.sha3.Keccak256.hash(data, &hash, .{});

    // Convert hash to u256 and push to stack
    const hash_value = bytesToUint256(hash);
    try frame.stack.push(hash_value);

    return "";
}

/// Helper function to calculate memory size for KECCAK256
pub fn getKeccak256MemorySize(stack: *const Frame.Stack) struct { size: u64, overflow: bool } {
    if (stack.size < 2) {
        return .{ .size = 0, .overflow = false };
    }

    // Stack has [offset, size]
    const offset = stack.data[stack.size - 2];
    const size = stack.data[stack.size - 1];

    // If size is 0, no memory expansion is needed
    if (size == 0) {
        return .{ .size = 0, .overflow = false };
    }

    // Calculate the memory size required (offset + size, rounded up to next multiple of 32)
    const offset_u64 = @as(u64, @truncate(offset));
    const size_u64 = @as(u64, @truncate(size));

    // Check for overflow when adding offset and size
    if (offset_u64 > std.math.maxInt(u64) - size_u64) {
        return .{ .size = 0, .overflow = true };
    }
    const total_size = offset_u64 + size_u64;

    // Calculate memory size with proper alignment (32 bytes)
    const words = (total_size + 31) / 32;
    const memory_size = words * 32;

    return .{ .size = memory_size, .overflow = false };
}

/// Helper function to convert bytes to u256
pub fn bytesToUint256(bytes: [32]u8) u256 {
    var result: u256 = 0;

    // For big-endian, start with most significant byte (index 0)
    // Process 32 bytes (256 bits) in a safe way
    for (bytes, 0..) |byte, i| {
        // Use safe bit manipulation to avoid overflow in shift amount
        if (i < 32) {
            const shift_amount = (31 - i) * 8;
            // Only shift if it's within the safe range for the platform's u256 type
            if (shift_amount < 256) {
                result |= @as(u256, byte) << @intCast(shift_amount);
            }
        }
    }

    return result;
}

/// Calculate dynamic gas for KECCAK256 operation
pub fn getKeccak256DynamicGas(interpreter: *Interpreter, frame: *Frame) !u64 {
    _ = interpreter;

    // Safe access to stack size
    if (frame.stack.size < 1) {
        return 0; // Not enough stack items, will fail later
    }

    // Access stack data directly for more reliable behavior
    // across different implementations
    var size: u64 = 0;
    if (@hasField(@TypeOf(frame.stack), "data") and frame.stack.size > 0) {
        // Direct array access if possible
        size = @as(u64, @truncate(frame.stack.data[frame.stack.size - 1]));
    } else {
        // Otherwise try to peek
        if (@hasDecl(@TypeOf(frame.stack), "peek_n")) {
            size = @as(u64, @truncate(try frame.stack.peek_n(0)));
        }
    }
    
    // If size is 0, only pay for the base cost
    if (size == 0) {
        return 0;
    }

    // Calculate number of words (rounded up)
    const words = (size + 31) / 32;

    // Keccak256 costs 6 gas per word
    return words * 6;
}

/// Register cryptographic opcodes in the jump table
pub fn registerCryptoOpcodes(allocator: std.mem.Allocator, jump_table: *JumpTable.JumpTable) !void {
    // KECCAK256 (0x20)
    const keccak256_op = try allocator.create(JumpTable.Operation);
    keccak256_op.* = JumpTable.Operation{
        .execute = opKeccak256,
        .constant_gas = 30, // Keccak256Gas
        .dynamic_gas = getKeccak256DynamicGas,
        .min_stack = JumpTable.minStack(2, 1),
        .max_stack = JumpTable.maxStack(2, 1),
        .memory_size = getKeccak256MemorySize,
    };
    jump_table.table[0x20] = keccak256_op;
}
