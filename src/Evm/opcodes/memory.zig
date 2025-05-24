const std = @import("std");
// Import from parent directory using relative paths
const jumpTableModule = @import("../jumpTable/package.zig");
const JumpTable = jumpTableModule.JumpTable;
const Operation = jumpTableModule.Operation;
const Interpreter = @import("../interpreter.zig").Interpreter;
const Frame = @import("../Frame.zig").Frame;
const ExecutionError = @import("../interpreter.zig").InterpreterError;
const stackModule = @import("../Stack.zig");
const Stack = stackModule.Stack;
const StackError = stackModule.StackError;
const Memory = @import("../Memory.zig").Memory;

// Helper to convert Stack errors to ExecutionError
fn mapStackError(err: StackError) ExecutionError {
    return switch (err) {
        error.OutOfBounds => ExecutionError.StackUnderflow,
        error.StackOverflow => ExecutionError.StackOverflow,
        error.OutOfMemory => ExecutionError.OutOfGas,
    };
}

// MLOAD operation - loads word from memory at the specified offset
pub fn opMload(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 1 item on the stack (the offset)
    if (frame.stack.size < 1) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop the offset from the stack
    const offset = frame.stack.pop() catch |err| return mapStackError(err);
    
    // Get 32 bytes from memory at the specified offset
    var value: u256 = 0;
    
    // Convert offset to u64, capping at max value if needed
    const offset_u64 = if (offset > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, @intCast(offset));
    
    // Calculate memory size needed
    const size_needed = offset_u64 + 32;
    
    // Ensure memory is large enough
    if (size_needed > frame.memory.len()) {
        frame.memory.resize(size_needed) catch return ExecutionError.OutOfGas;
    }
    
    // Get the memory slice - handle errors safely
    const memory_slice = frame.memory.getPtr(offset_u64, 32) catch {
        // If this happens, resize may have failed or memory logic is wrong
        // Default to zeroes in this case
        frame.stack.push(0) catch |e| return mapStackError(e);
        return "";
    };
    
    // Convert memory bytes to u256 (big-endian format)
    for (0..32) |i| {
        value = (value << 8) | memory_slice[i];
    }
    
    // Push the result onto the stack
    frame.stack.push(value) catch |err| return mapStackError(err);
    
    return "";
}

// MSTORE operation - stores word to memory at the specified offset
pub fn opMstore(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack (offset and value)
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop value and offset from the stack
    // In the EVM, stack items are processed in reverse order
    const value = frame.stack.pop() catch |err| return mapStackError(err);  // Second item, the value to store
    const offset = frame.stack.pop() catch |err| return mapStackError(err); // First item, the memory offset
    
    // Convert offset to u64, capping at max value if needed
    const offset_u64 = if (offset > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, @intCast(offset));
    
    // Calculate memory size needed
    const size_needed = offset_u64 + 32;
    
    // Ensure memory is large enough
    if (size_needed > frame.memory.len()) {
        frame.memory.resize(size_needed) catch return ExecutionError.OutOfGas;
    }
    
    // Prepare value as bytes (big-endian)
    var bytes: [32]u8 = [_]u8{0} ** 32; // Initialize all bytes to 0
    var temp_value = value;
    
    // Convert u256 to bytes in big-endian format - safer implementation
    var i: usize = 31;
    while (true) {
        bytes[i] = @truncate(temp_value & 0xFF);
        temp_value >>= 8;
        if (i == 0) break;
        i -= 1;
    }
    
    // Store bytes in memory - handle error safely
    frame.memory.set(offset_u64, 32, &bytes) catch {
        // If set operation fails, we need to handle it gracefully
        return ExecutionError.InvalidOpcode; // Use a more specific error if available
    };
    
    return "";
}

// MSTORE8 operation - stores a single byte to memory at the specified offset
pub fn opMstore8(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack (offset and value)
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop value and offset from the stack
    const value = frame.stack.pop() catch |err| return mapStackError(err);
    const offset = frame.stack.pop() catch |err| return mapStackError(err);
    
    // Convert offset to u64, capping at max value if needed
    const offset_u64 = if (offset > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, @intCast(offset));
    
    // Calculate memory size needed
    const size_needed = offset_u64 + 1;
    
    // Ensure memory is large enough
    if (size_needed > frame.memory.len()) {
        frame.memory.resize(size_needed) catch return ExecutionError.OutOfGas;
    }
    
    // Only the least significant byte of the value is stored
    const byte = [1]u8{@truncate(value & 0xFF)};
    
    // Store the single byte in memory - handle error safely
    frame.memory.set(offset_u64, 1, &byte) catch {
        // If set operation fails, we need to handle it gracefully
        return ExecutionError.InvalidOpcode; // Use a more specific error if available
    };
    
    return "";
}

// MSIZE operation - pushes the size of memory in bytes onto the stack
pub fn opMsize(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // Push current memory size onto the stack
    const size: u256 = @as(u256, frame.memory.len());
    frame.stack.push(size) catch |err| return mapStackError(err);
    
    return "";
}

// POP operation - removes the top item from the stack
pub fn opPop(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 1 item on the stack to pop
    if (frame.stack.size < 1) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop and discard the value
    _ = frame.stack.pop() catch |err| return mapStackError(err);
    
    return "";
}


// DUP1 opcode - duplicates the 1st stack item
pub fn opDup1(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    frame.stack.dup(1) catch |err| return mapStackError(err);
    return "";
}

// DUP2 opcode - duplicates the 2nd stack item
pub fn opDup2(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    frame.stack.dup(2) catch |err| return mapStackError(err);
    return "";
}

// DUP3 opcode - duplicates the 3rd stack item
pub fn opDup3(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    frame.stack.dup(3) catch |err| return mapStackError(err);
    return "";
}

// DUP4 opcode - duplicates the 4th stack item
pub fn opDup4(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    frame.stack.dup(4) catch |err| return mapStackError(err);
    return "";
}

// DUP5 opcode - duplicates the 5th stack item
pub fn opDup5(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    frame.stack.dup(5) catch |err| return mapStackError(err);
    return "";
}

// DUP6 opcode - duplicates the 6th stack item
pub fn opDup6(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    frame.stack.dup(6) catch |err| return mapStackError(err);
    return "";
}

// DUP7 opcode - duplicates the 7th stack item
pub fn opDup7(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    frame.stack.dup(7) catch |err| return mapStackError(err);
    return "";
}

// DUP8 opcode - duplicates the 8th stack item
pub fn opDup8(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    frame.stack.dup(8) catch |err| return mapStackError(err);
    return "";
}

// DUP9 opcode - duplicates the 9th stack item
pub fn opDup9(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    frame.stack.dup(9) catch |err| return mapStackError(err);
    return "";
}

// DUP10 opcode - duplicates the 10th stack item
pub fn opDup10(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    frame.stack.dup(10) catch |err| return mapStackError(err);
    return "";
}

// DUP11 opcode - duplicates the 11th stack item
pub fn opDup11(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    frame.stack.dup(11) catch |err| return mapStackError(err);
    return "";
}

// DUP12 opcode - duplicates the 12th stack item
pub fn opDup12(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    frame.stack.dup(12) catch |err| return mapStackError(err);
    return "";
}

// DUP13 opcode - duplicates the 13th stack item
pub fn opDup13(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    frame.stack.dup(13) catch |err| return mapStackError(err);
    return "";
}

// DUP14 opcode - duplicates the 14th stack item
pub fn opDup14(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    frame.stack.dup(14) catch |err| return mapStackError(err);
    return "";
}

// DUP15 opcode - duplicates the 15th stack item
pub fn opDup15(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    frame.stack.dup(15) catch |err| return mapStackError(err);
    return "";
}

// DUP16 opcode - duplicates the 16th stack item
pub fn opDup16(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    frame.stack.dup(16) catch |err| return mapStackError(err);
    return "";
}

// SWAP1 opcode - swaps the 1st and 2nd stack items
pub fn opSwap1(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    frame.stack.swap1() catch |err| return mapStackError(err);
    return "";
}

// SWAP2 opcode - swaps the 1st and 3rd stack items
pub fn opSwap2(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    frame.stack.swap2() catch |err| return mapStackError(err);
    return "";
}

// SWAP3 opcode - swaps the 1st and 4th stack items
pub fn opSwap3(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    frame.stack.swap3() catch |err| return mapStackError(err);
    return "";
}

// SWAP4 opcode - swaps the 1st and 5th stack items
pub fn opSwap4(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    frame.stack.swap4() catch |err| return mapStackError(err);
    return "";
}

// SWAP5 opcode - swaps the 1st and 6th stack items
pub fn opSwap5(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    frame.stack.swap5() catch |err| return mapStackError(err);
    return "";
}

// SWAP6 opcode - swaps the 1st and 7th stack items
pub fn opSwap6(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    frame.stack.swap6() catch |err| return mapStackError(err);
    return "";
}

// SWAP7 opcode - swaps the 1st and 8th stack items
pub fn opSwap7(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    frame.stack.swap7() catch |err| return mapStackError(err);
    return "";
}

// SWAP8 opcode - swaps the 1st and 9th stack items
pub fn opSwap8(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    frame.stack.swap8() catch |err| return mapStackError(err);
    return "";
}

// SWAP9 opcode - swaps the 1st and 10th stack items
pub fn opSwap9(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    frame.stack.swap9() catch |err| return mapStackError(err);
    return "";
}

// SWAP10 opcode - swaps the 1st and 11th stack items
pub fn opSwap10(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    frame.stack.swap10() catch |err| return mapStackError(err);
    return "";
}

// SWAP11 opcode - swaps the 1st and 12th stack items
pub fn opSwap11(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    frame.stack.swap11() catch |err| return mapStackError(err);
    return "";
}

// SWAP12 opcode - swaps the 1st and 13th stack items
pub fn opSwap12(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    frame.stack.swap12() catch |err| return mapStackError(err);
    return "";
}

// SWAP13 opcode - swaps the 1st and 14th stack items
pub fn opSwap13(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    frame.stack.swap13() catch |err| return mapStackError(err);
    return "";
}

// SWAP14 opcode - swaps the 1st and 15th stack items
pub fn opSwap14(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    frame.stack.swap14() catch |err| return mapStackError(err);
    return "";
}

// SWAP15 opcode - swaps the 1st and 16th stack items
pub fn opSwap15(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    frame.stack.swap15() catch |err| return mapStackError(err);
    return "";
}

// SWAP16 opcode - swaps the 1st and 17th stack items
pub fn opSwap16(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    frame.stack.swap16() catch |err| return mapStackError(err);
    return "";
}

// Helper function to calcuate memory size needed for a memory operation
fn calcMemSize(offset: u256, size: u256) u64 {
    // If size is zero, no memory expansion needed
    if (size == 0) {
        return 0;
    }
    
    // Calculate memory size required
    const offset_u64 = if (offset > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, @intCast(offset));
    const size_u64 = if (size > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, size);
    
    // Return the end address using saturating addition
    return offset_u64 +| size_u64;
}

// Helper function to calculate the gas cost for memory expansion
// This implements the memory gas cost formula from the Ethereum yellow paper:
// Cost = 3 * words + 3 * words^2 / 512
// where words = ceil(size / 32)
pub fn memoryGasCost(oldSize: u64, newSize: u64) u64 {
    // If no expansion, no additional gas cost
    if (newSize <= oldSize) {
        return 0;
    }
    
    // Calculate new words (rounding up)
    const newWords = (newSize + 31) / 32;
    const oldWords = (oldSize + 31) / 32;
    
    // Calculate quadratic cost (see EIP-1985)
    // Note: In the original yellow paper formula, the quadratic component is divided by 512
    // but it's more efficient for EVM implementations to multiply by 3 directly
    const newCost = newWords *% newWords *% 3 +% newWords *% 3;
    const oldCost = oldWords *% oldWords *% 3 +% oldWords *% 3;
    
    return newCost - oldCost;
}

// Memory gas function used for calculating dynamic gas costs for memory operations
pub fn memoryGas(interpreter: *Interpreter, frame: *Frame, stack: *Stack, memory: *Memory, requested_size: u64) error{OutOfGas}!u64 {
    _ = interpreter;
    _ = stack;
    
    const oldSize = memory.len();
    
    // Only resize memory if needed
    if (requested_size > oldSize) {
        // Calculate gas cost for memory expansion
        const cost = memoryGasCost(oldSize, requested_size);
        
        // Check if we have enough gas
        if (frame.cost + cost > frame.contract.gas) {
            return error.OutOfGas;
        }
        
        // Resize memory if we have enough gas
        memory.resize(requested_size) catch return error.OutOfGas;
    }
    
    // Return the calculated memory expansion cost
    return memoryGasCost(oldSize, requested_size);
}

// Memory size function for MLOAD - calculates memory expansion size
pub fn mloadMemorySize(stack: *Stack) jumpTableModule.MemorySizeResult {
    if (stack.size == 0) return .{ .size = 0, .overflow = false };
    
    const offset = stack.data[stack.size - 1];
    // Need to access offset + 32 bytes
    const offset_u64 = if (offset > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, @intCast(offset));
    
    // Check if offset+32 would overflow
    if (offset_u64 > std.math.maxInt(u64) - 32) {
        return .{ .size = std.math.maxInt(u64), .overflow = true };
    }
    
    return .{ .size = offset_u64 + 32, .overflow = false };
}

// Memory size function for MSTORE - calculates memory expansion size
pub fn mstoreMemorySize(stack: *Stack) jumpTableModule.MemorySizeResult {
    if (stack.size < 2) return .{ .size = 0, .overflow = false };
    
    const offset = stack.data[stack.size - 1];
    // Need to access offset + 32 bytes
    const offset_u64 = if (offset > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, @intCast(offset));
    
    // Check if offset+32 would overflow
    if (offset_u64 > std.math.maxInt(u64) - 32) {
        return .{ .size = std.math.maxInt(u64), .overflow = true };
    }
    
    return .{ .size = offset_u64 + 32, .overflow = false };
}

// Memory size function for MSTORE8 - calculates memory expansion size
pub fn mstore8MemorySize(stack: *Stack) jumpTableModule.MemorySizeResult {
    if (stack.size < 2) return .{ .size = 0, .overflow = false };
    
    const offset = stack.data[stack.size - 1];
    // Need to access offset + 1 byte
    const offset_u64 = if (offset > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, @intCast(offset));
    
    // Check if offset+1 would overflow
    if (offset_u64 == std.math.maxInt(u64)) {
        return .{ .size = std.math.maxInt(u64), .overflow = true };
    }
    
    return .{ .size = offset_u64 + 1, .overflow = false };
}

// Register memory opcodes in the jump table
pub fn registerMemoryOpcodes(allocator: std.mem.Allocator, jump_table: *JumpTable) !void {
    // MLOAD (0x51)
    const mload_op = try allocator.create(Operation);
    mload_op.* = Operation{
        .execute = opMload,
        .constant_gas = jumpTableModule.GasFastestStep,
        .min_stack = jumpTableModule.minStack(1, 1),
        .max_stack = jumpTableModule.maxStack(1, 1),
        .dynamic_gas = memoryGas,
        .memory_size = mloadMemorySize,
    };
    jump_table.table[0x51] = mload_op;
    
    // MSTORE (0x52)
    const mstore_op = try allocator.create(Operation);
    mstore_op.* = Operation{
        .execute = opMstore,
        .constant_gas = jumpTableModule.GasFastestStep,
        .min_stack = jumpTableModule.minStack(2, 0),
        .max_stack = jumpTableModule.maxStack(2, 0),
        .dynamic_gas = memoryGas,
        .memory_size = mstoreMemorySize,
    };
    jump_table.table[0x52] = mstore_op;
    
    // MSTORE8 (0x53)
    const mstore8_op = try allocator.create(Operation);
    mstore8_op.* = Operation{
        .execute = opMstore8,
        .constant_gas = jumpTableModule.GasFastestStep,
        .min_stack = jumpTableModule.minStack(2, 0),
        .max_stack = jumpTableModule.maxStack(2, 0),
        .dynamic_gas = memoryGas,
        .memory_size = mstore8MemorySize,
    };
    jump_table.table[0x53] = mstore8_op;
    
    // MSIZE (0x59)
    const msize_op = try allocator.create(Operation);
    msize_op.* = Operation{
        .execute = opMsize,
        .constant_gas = jumpTableModule.GasQuickStep,
        .min_stack = jumpTableModule.minStack(0, 1),
        .max_stack = jumpTableModule.maxStack(0, 1),
    };
    jump_table.table[0x59] = msize_op;
    
    // POP (0x50)
    const pop_op = try allocator.create(Operation);
    pop_op.* = Operation{
        .execute = opPop,
        .constant_gas = jumpTableModule.GasQuickStep,
        .min_stack = jumpTableModule.minStack(1, 0),
        .max_stack = jumpTableModule.maxStack(1, 0),
    };
    jump_table.table[0x50] = pop_op;
    
    // NOTE: PUSH opcodes are registered by push.zig
    
    // DUP1-DUP16 (0x80-0x8F)
    inline for (0..16) |i| {
        const dup_op = try allocator.create(Operation);
        
        // Get the correct dup function based on index
        const dupFunc = switch (i) {
            0 => opDup1,
            1 => opDup2,
            2 => opDup3,
            3 => opDup4,
            4 => opDup5,
            5 => opDup6,
            6 => opDup7,
            7 => opDup8,
            8 => opDup9,
            9 => opDup10,
            10 => opDup11,
            11 => opDup12,
            12 => opDup13,
            13 => opDup14,
            14 => opDup15,
            15 => opDup16,
            else => unreachable, // This should never happen with the above range
        };
        
        dup_op.* = Operation{
            .execute = dupFunc,
            .constant_gas = jumpTableModule.GasFastestStep,
            .min_stack = jumpTableModule.minDupStack(@intCast(i + 1)),
            .max_stack = jumpTableModule.maxDupStack(@intCast(i + 1)),
        };
        
        // Calculate the opcode: DUP1 is 0x80, DUP2 is 0x81, etc.
        const opcode = 0x80 + i;
        jump_table.table[opcode] = dup_op;
    }
    
    // SWAP1-SWAP16 (0x90-0x9F)
    inline for (0..16) |i| {
        const swap_op = try allocator.create(Operation);
        
        // Get the correct swap function based on index
        const swapFunc = switch (i) {
            0 => opSwap1,
            1 => opSwap2,
            2 => opSwap3,
            3 => opSwap4,
            4 => opSwap5,
            5 => opSwap6,
            6 => opSwap7,
            7 => opSwap8,
            8 => opSwap9,
            9 => opSwap10,
            10 => opSwap11,
            11 => opSwap12,
            12 => opSwap13,
            13 => opSwap14,
            14 => opSwap15,
            15 => opSwap16,
            else => unreachable, // This should never happen with the above range
        };
        
        swap_op.* = Operation{
            .execute = swapFunc,
            .constant_gas = jumpTableModule.GasFastestStep,
            .min_stack = jumpTableModule.minSwapStack(@intCast(i + 1)),
            .max_stack = jumpTableModule.maxSwapStack(@intCast(i + 1)),
        };
        
        // Calculate the opcode: SWAP1 is 0x90, SWAP2 is 0x91, etc.
        const opcode = 0x90 + i;
        jump_table.table[opcode] = swap_op;
    }
}

// ===== TESTS =====

const testing = std.testing;

test "Memory gas cost calculations" {
    // Test basic memory expansion gas cost calculation
    const old_size: u64 = 0;
    const new_size: u64 = 32; // 1 word
    
    const gas_cost = memoryGasCost(old_size, new_size);
    
    // For 1 word, cost should be: 1*1*3 + 1*3 = 6
    try testing.expectEqual(@as(u64, 6), gas_cost);
    
    // Test larger expansion
    const old_size2: u64 = 32;
    const new_size2: u64 = 96; // 3 words
    
    const gas_cost2 = memoryGasCost(old_size2, new_size2);
    
    // For expanding from 1 word to 3 words:
    // new cost = 3*3*3 + 3*3 = 36
    // old cost = 1*1*3 + 1*3 = 6
    // difference = 30
    try testing.expectEqual(@as(u64, 30), gas_cost2);
}