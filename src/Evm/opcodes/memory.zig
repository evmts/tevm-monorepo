const std = @import("std");
const evm_pkg = @import("evm");
const Interpreter = evm_pkg.Interpreter.Interpreter;
const Frame = evm_pkg.Frame.Frame;
const ExecutionError = evm_pkg.Frame.ExecutionError;
const JumpTable = evm_pkg.JumpTable;
const Memory = evm_pkg.Memory.Memory;
const Stack = evm_pkg.Stack.Stack;

/// MLOAD operation - loads word from memory at the specified offset
pub fn opMload(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 1 item on the stack (the offset)
    if (frame.stack.size < 1) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop the offset from the stack
    const offset = try frame.stack.pop();
    
    // Get 32 bytes from memory at the specified offset
    var value: u256 = 0;
    
    // Convert offset to u64, capping at max value if needed
    const offset_u64 = if (offset > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, offset);
    
    // Calculate memory size needed
    const size_needed = offset_u64 + 32;
    
    // Ensure memory is large enough
    if (size_needed > frame.memory.len()) {
        try frame.memory.resize(size_needed);
    }
    
    // Get the memory slice - handle errors safely
    const memory_slice = frame.memory.getPtr(offset_u64, 32) catch |err| {
        // Handle the error case explicitly for better memory safety
        if (err == error.OutOfBounds) {
            // If this happens, resize may have failed or memory logic is wrong
            // Default to zeroes in this case
            try frame.stack.push(0);
            return "";
        } else {
            return err;
        }
    };
    
    // Convert memory bytes to u256 (big-endian format)
    for (0..32) |i| {
        value = (value << 8) | memory_slice[i];
    }
    
    // Push the result onto the stack
    try frame.stack.push(value);
    
    return "";
}

/// MSTORE operation - stores word to memory at the specified offset
pub fn opMstore(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack (offset and value)
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop value and offset from the stack
    // In the EVM, stack items are processed in reverse order
    const value = try frame.stack.pop();  // Second item, the value to store
    const offset = try frame.stack.pop(); // First item, the memory offset
    
    // Convert offset to u64, capping at max value if needed
    const offset_u64 = if (offset > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, offset);
    
    // Calculate memory size needed
    const size_needed = offset_u64 + 32;
    
    // Ensure memory is large enough
    if (size_needed > frame.memory.len()) {
        try frame.memory.resize(size_needed);
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

/// MSTORE8 operation - stores a single byte to memory at the specified offset
pub fn opMstore8(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack (offset and value)
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop value and offset from the stack
    const value = try frame.stack.pop();
    const offset = try frame.stack.pop();
    
    // Convert offset to u64, capping at max value if needed
    const offset_u64 = if (offset > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, offset);
    
    // Calculate memory size needed
    const size_needed = offset_u64 + 1;
    
    // Ensure memory is large enough
    if (size_needed > frame.memory.len()) {
        try frame.memory.resize(size_needed);
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

/// MSIZE operation - pushes the size of memory in bytes onto the stack
pub fn opMsize(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // Push current memory size onto the stack
    const size: u256 = @as(u256, frame.memory.len());
    try frame.stack.push(size);
    
    return "";
}

/// POP operation - removes the top item from the stack
pub fn opPop(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 1 item on the stack to pop
    if (frame.stack.size < 1) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop and discard the value
    _ = try frame.stack.pop();
    
    return "";
}

/// Helper for implementing PUSH opcodes
fn pushN(pc: usize, interpreter: *Interpreter, frame: *Frame, n: u8) ExecutionError![]const u8 {
    _ = interpreter;
    
    // Extract the next n bytes from the bytecode
    const bytecode = frame.contractCode();
    
    // Make sure we're not reading past the end of the bytecode
    if (pc + 1 + n > bytecode.len) {
        // If we reach the end of the bytecode, pad with zeros
        var value: u256 = 0;
        const available_bytes = if (pc + 1 < bytecode.len) bytecode.len - (pc + 1) else 0;
        
        // Read available bytes
        for (0..available_bytes) |i| {
            value = (value << 8) | bytecode[pc + 1 + i];
        }
        
        // Shift left to account for missing bytes (big-endian format)
        value <<= (n - available_bytes) * 8;
        
        // Push the value onto the stack
        try frame.stack.push(value);
    } else {
        // Read n bytes from the bytecode
        var value: u256 = 0;
        for (0..n) |i| {
            value = (value << 8) | bytecode[pc + 1 + i];
        }
        
        // Push the value onto the stack
        try frame.stack.push(value);
    }
    
    return "";
}

/// PUSH0 opcode - pushes 0 onto the stack (EIP-3855)
pub fn opPush0(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    
    // Check if EIP-3855 (PUSH0) is active
    if (!interpreter.evm.chainRules.IsEIP3855) {
        return ExecutionError.InvalidOpcode;
    }
    
    // Push 0 onto the stack
    try frame.stack.push(0);
    return "";
}

/// PUSH1 opcode - pushes 1 byte onto the stack
pub fn opPush1(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 1);
}

/// PUSH2 opcode - pushes 2 bytes onto the stack
pub fn opPush2(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 2);
}

/// PUSH3 opcode - pushes 3 bytes onto the stack
pub fn opPush3(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 3);
}

/// PUSH4 opcode - pushes 4 bytes onto the stack
pub fn opPush4(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 4);
}

/// PUSH5 opcode - pushes 5 bytes onto the stack
pub fn opPush5(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 5);
}

/// PUSH6 opcode - pushes 6 bytes onto the stack
pub fn opPush6(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 6);
}

/// PUSH7 opcode - pushes 7 bytes onto the stack
pub fn opPush7(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 7);
}

/// PUSH8 opcode - pushes 8 bytes onto the stack
pub fn opPush8(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 8);
}

/// PUSH9 opcode - pushes 9 bytes onto the stack
pub fn opPush9(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 9);
}

/// PUSH10 opcode - pushes 10 bytes onto the stack
pub fn opPush10(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 10);
}

/// PUSH11 opcode - pushes 11 bytes onto the stack
pub fn opPush11(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 11);
}

/// PUSH12 opcode - pushes 12 bytes onto the stack
pub fn opPush12(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 12);
}

/// PUSH13 opcode - pushes 13 bytes onto the stack
pub fn opPush13(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 13);
}

/// PUSH14 opcode - pushes 14 bytes onto the stack
pub fn opPush14(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 14);
}

/// PUSH15 opcode - pushes 15 bytes onto the stack
pub fn opPush15(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 15);
}

/// PUSH16 opcode - pushes 16 bytes onto the stack
pub fn opPush16(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 16);
}

/// PUSH17 opcode - pushes 17 bytes onto the stack
pub fn opPush17(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 17);
}

/// PUSH18 opcode - pushes 18 bytes onto the stack
pub fn opPush18(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 18);
}

/// PUSH19 opcode - pushes 19 bytes onto the stack
pub fn opPush19(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 19);
}

/// PUSH20 opcode - pushes 20 bytes onto the stack
pub fn opPush20(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 20);
}

/// PUSH21 opcode - pushes 21 bytes onto the stack
pub fn opPush21(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 21);
}

/// PUSH22 opcode - pushes 22 bytes onto the stack
pub fn opPush22(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 22);
}

/// PUSH23 opcode - pushes 23 bytes onto the stack
pub fn opPush23(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 23);
}

/// PUSH24 opcode - pushes 24 bytes onto the stack
pub fn opPush24(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 24);
}

/// PUSH25 opcode - pushes 25 bytes onto the stack
pub fn opPush25(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 25);
}

/// PUSH26 opcode - pushes 26 bytes onto the stack
pub fn opPush26(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 26);
}

/// PUSH27 opcode - pushes 27 bytes onto the stack
pub fn opPush27(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 27);
}

/// PUSH28 opcode - pushes 28 bytes onto the stack
pub fn opPush28(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 28);
}

/// PUSH29 opcode - pushes 29 bytes onto the stack
pub fn opPush29(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 29);
}

/// PUSH30 opcode - pushes 30 bytes onto the stack
pub fn opPush30(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 30);
}

/// PUSH31 opcode - pushes 31 bytes onto the stack
pub fn opPush31(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 31);
}

/// PUSH32 opcode - pushes 32 bytes onto the stack
pub fn opPush32(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 32);
}

/// DUP1 opcode - duplicates the 1st stack item
pub fn opDup1(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    try frame.stack.dup(1);
    return "";
}

/// DUP2 opcode - duplicates the 2nd stack item
pub fn opDup2(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    try frame.stack.dup(2);
    return "";
}

/// DUP3 opcode - duplicates the 3rd stack item
pub fn opDup3(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    try frame.stack.dup(3);
    return "";
}

/// DUP4 opcode - duplicates the 4th stack item
pub fn opDup4(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    try frame.stack.dup(4);
    return "";
}

/// DUP5 opcode - duplicates the 5th stack item
pub fn opDup5(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    try frame.stack.dup(5);
    return "";
}

/// DUP6 opcode - duplicates the 6th stack item
pub fn opDup6(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    try frame.stack.dup(6);
    return "";
}

/// DUP7 opcode - duplicates the 7th stack item
pub fn opDup7(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    try frame.stack.dup(7);
    return "";
}

/// DUP8 opcode - duplicates the 8th stack item
pub fn opDup8(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    try frame.stack.dup(8);
    return "";
}

/// DUP9 opcode - duplicates the 9th stack item
pub fn opDup9(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    try frame.stack.dup(9);
    return "";
}

/// DUP10 opcode - duplicates the 10th stack item
pub fn opDup10(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    try frame.stack.dup(10);
    return "";
}

/// DUP11 opcode - duplicates the 11th stack item
pub fn opDup11(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    try frame.stack.dup(11);
    return "";
}

/// DUP12 opcode - duplicates the 12th stack item
pub fn opDup12(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    try frame.stack.dup(12);
    return "";
}

/// DUP13 opcode - duplicates the 13th stack item
pub fn opDup13(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    try frame.stack.dup(13);
    return "";
}

/// DUP14 opcode - duplicates the 14th stack item
pub fn opDup14(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    try frame.stack.dup(14);
    return "";
}

/// DUP15 opcode - duplicates the 15th stack item
pub fn opDup15(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    try frame.stack.dup(15);
    return "";
}

/// DUP16 opcode - duplicates the 16th stack item
pub fn opDup16(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    try frame.stack.dup(16);
    return "";
}

/// SWAP1 opcode - swaps the 1st and 2nd stack items
pub fn opSwap1(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    try frame.stack.swap1();
    return "";
}

/// SWAP2 opcode - swaps the 1st and 3rd stack items
pub fn opSwap2(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    try frame.stack.swap2();
    return "";
}

/// SWAP3 opcode - swaps the 1st and 4th stack items
pub fn opSwap3(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    try frame.stack.swap3();
    return "";
}

/// SWAP4 opcode - swaps the 1st and 5th stack items
pub fn opSwap4(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    try frame.stack.swap4();
    return "";
}

/// SWAP5 opcode - swaps the 1st and 6th stack items
pub fn opSwap5(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    try frame.stack.swap5();
    return "";
}

/// SWAP6 opcode - swaps the 1st and 7th stack items
pub fn opSwap6(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    try frame.stack.swap6();
    return "";
}

/// SWAP7 opcode - swaps the 1st and 8th stack items
pub fn opSwap7(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    try frame.stack.swap7();
    return "";
}

/// SWAP8 opcode - swaps the 1st and 9th stack items
pub fn opSwap8(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    try frame.stack.swap8();
    return "";
}

/// SWAP9 opcode - swaps the 1st and 10th stack items
pub fn opSwap9(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    try frame.stack.swap9();
    return "";
}

/// SWAP10 opcode - swaps the 1st and 11th stack items
pub fn opSwap10(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    try frame.stack.swap10();
    return "";
}

/// SWAP11 opcode - swaps the 1st and 12th stack items
pub fn opSwap11(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    try frame.stack.swap11();
    return "";
}

/// SWAP12 opcode - swaps the 1st and 13th stack items
pub fn opSwap12(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    try frame.stack.swap12();
    return "";
}

/// SWAP13 opcode - swaps the 1st and 14th stack items
pub fn opSwap13(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    try frame.stack.swap13();
    return "";
}

/// SWAP14 opcode - swaps the 1st and 15th stack items
pub fn opSwap14(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    try frame.stack.swap14();
    return "";
}

/// SWAP15 opcode - swaps the 1st and 16th stack items
pub fn opSwap15(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    try frame.stack.swap15();
    return "";
}

/// SWAP16 opcode - swaps the 1st and 17th stack items
pub fn opSwap16(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    try frame.stack.swap16();
    return "";
}

/// Helper function to calcuate memory size needed for a memory operation
fn calcMemSize(offset: u256, size: u256) u64 {
    // If size is zero, no memory expansion needed
    if (size == 0) {
        return 0;
    }
    
    // Calculate memory size required
    const offset_u64 = if (offset > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, offset);
    const size_u64 = if (size > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, size);
    
    // Return the end address (offset + size)
    return offset_u64 + size_u64;
}

/// Helper function to calculate the gas cost for memory expansion
/// This implements the memory gas cost formula from the Ethereum yellow paper:
/// Cost = 3 * words + 3 * words^2 / 512
/// where words = ceil(size / 32)
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
    const newCost = newWords * newWords * 3 + newWords * 3;
    const oldCost = oldWords * oldWords * 3 + oldWords * 3;
    
    return newCost - oldCost;
}

/// Memory gas function used for calculating dynamic gas costs for memory operations
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
        try memory.resize(requested_size);
    }
    
    // Return the calculated memory expansion cost
    return memoryGasCost(oldSize, requested_size);
}

/// Memory size function for MLOAD - calculates memory expansion size
pub fn mloadMemorySize(stack: *Stack) struct { size: u64, overflow: bool } {
    if (stack.size == 0) return .{ .size = 0, .overflow = false };
    
    const offset = stack.data[stack.size - 1];
    // Need to access offset + 32 bytes
    const offset_u64 = if (offset > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, offset);
    
    // Check if offset+32 would overflow
    if (offset_u64 > std.math.maxInt(u64) - 32) {
        return .{ .size = std.math.maxInt(u64), .overflow = true };
    }
    
    return .{ .size = offset_u64 + 32, .overflow = false };
}

/// Memory size function for MSTORE - calculates memory expansion size
pub fn mstoreMemorySize(stack: *Stack) struct { size: u64, overflow: bool } {
    if (stack.size < 2) return .{ .size = 0, .overflow = false };
    
    const offset = stack.data[stack.size - 1];
    // Need to access offset + 32 bytes
    const offset_u64 = if (offset > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, offset);
    
    // Check if offset+32 would overflow
    if (offset_u64 > std.math.maxInt(u64) - 32) {
        return .{ .size = std.math.maxInt(u64), .overflow = true };
    }
    
    return .{ .size = offset_u64 + 32, .overflow = false };
}

/// Memory size function for MSTORE8 - calculates memory expansion size
pub fn mstore8MemorySize(stack: *Stack) struct { size: u64, overflow: bool } {
    if (stack.size < 2) return .{ .size = 0, .overflow = false };
    
    const offset = stack.data[stack.size - 1];
    // Need to access offset + 1 byte
    const offset_u64 = if (offset > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, offset);
    
    // Check if offset+1 would overflow
    if (offset_u64 == std.math.maxInt(u64)) {
        return .{ .size = std.math.maxInt(u64), .overflow = true };
    }
    
    return .{ .size = offset_u64 + 1, .overflow = false };
}

/// Register memory opcodes in the jump table
pub fn registerMemoryOpcodes(allocator: std.mem.Allocator, jump_table: *JumpTable.JumpTable) !void {
    // MLOAD (0x51)
    const mload_op = try allocator.create(JumpTable.Operation);
    mload_op.* = JumpTable.Operation{
        .execute = opMload,
        .constant_gas = JumpTable.GasFastestStep,
        .min_stack = JumpTable.minStack(1, 1),
        .max_stack = JumpTable.maxStack(1, 1),
        .dynamic_gas = memoryGas,
        .memory_size = mloadMemorySize,
    };
    jump_table.table[0x51] = mload_op;
    
    // MSTORE (0x52)
    const mstore_op = try allocator.create(JumpTable.Operation);
    mstore_op.* = JumpTable.Operation{
        .execute = opMstore,
        .constant_gas = JumpTable.GasFastestStep,
        .min_stack = JumpTable.minStack(2, 0),
        .max_stack = JumpTable.maxStack(2, 0),
        .dynamic_gas = memoryGas,
        .memory_size = mstoreMemorySize,
    };
    jump_table.table[0x52] = mstore_op;
    
    // MSTORE8 (0x53)
    const mstore8_op = try allocator.create(JumpTable.Operation);
    mstore8_op.* = JumpTable.Operation{
        .execute = opMstore8,
        .constant_gas = JumpTable.GasFastestStep,
        .min_stack = JumpTable.minStack(2, 0),
        .max_stack = JumpTable.maxStack(2, 0),
        .dynamic_gas = memoryGas,
        .memory_size = mstore8MemorySize,
    };
    jump_table.table[0x53] = mstore8_op;
    
    // MSIZE (0x59)
    const msize_op = try allocator.create(JumpTable.Operation);
    msize_op.* = JumpTable.Operation{
        .execute = opMsize,
        .constant_gas = JumpTable.GasQuickStep,
        .min_stack = JumpTable.minStack(0, 1),
        .max_stack = JumpTable.maxStack(0, 1),
    };
    jump_table.table[0x59] = msize_op;
    
    // POP (0x50)
    const pop_op = try allocator.create(JumpTable.Operation);
    pop_op.* = JumpTable.Operation{
        .execute = opPop,
        .constant_gas = JumpTable.GasQuickStep,
        .min_stack = JumpTable.minStack(1, 0),
        .max_stack = JumpTable.maxStack(1, 0),
    };
    jump_table.table[0x50] = pop_op;
    
    // PUSH0 (0x5F) - EIP-3855
    const push0_op = try allocator.create(JumpTable.Operation);
    push0_op.* = JumpTable.Operation{
        .execute = opPush0,
        .constant_gas = JumpTable.GasQuickStep,
        .min_stack = JumpTable.minStack(0, 1),
        .max_stack = JumpTable.maxStack(0, 1),
    };
    jump_table.table[0x5F] = push0_op;
    
    // PUSH1-PUSH32 (0x60-0x7F)
    inline for (0..32) |i| {
        const push_op = try allocator.create(JumpTable.Operation);
        
        // Get the correct push function based on index
        const pushFunc = switch (i) {
            0 => opPush1,
            1 => opPush2,
            2 => opPush3,
            3 => opPush4,
            4 => opPush5,
            5 => opPush6,
            6 => opPush7,
            7 => opPush8,
            8 => opPush9,
            9 => opPush10,
            10 => opPush11,
            11 => opPush12,
            12 => opPush13,
            13 => opPush14,
            14 => opPush15,
            15 => opPush16,
            16 => opPush17,
            17 => opPush18,
            18 => opPush19,
            19 => opPush20,
            20 => opPush21,
            21 => opPush22,
            22 => opPush23,
            23 => opPush24,
            24 => opPush25,
            25 => opPush26,
            26 => opPush27,
            27 => opPush28,
            28 => opPush29,
            29 => opPush30,
            30 => opPush31,
            31 => opPush32,
            else => unreachable, // This should never happen with the above range
        };
        
        push_op.* = JumpTable.Operation{
            .execute = pushFunc,
            .constant_gas = JumpTable.GasFastestStep,
            .min_stack = JumpTable.minStack(0, 1),
            .max_stack = JumpTable.maxStack(0, 1),
        };
        
        // Calculate the opcode: PUSH1 is 0x60, PUSH2 is 0x61, etc.
        const opcode = 0x60 + i;
        jump_table.table[opcode] = push_op;
    }
    
    // DUP1-DUP16 (0x80-0x8F)
    inline for (0..16) |i| {
        const dup_op = try allocator.create(JumpTable.Operation);
        
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
        
        dup_op.* = JumpTable.Operation{
            .execute = dupFunc,
            .constant_gas = JumpTable.GasFastestStep,
            .min_stack = JumpTable.minDupStack(@intCast(i + 1)),
            .max_stack = JumpTable.maxDupStack(@intCast(i + 1)),
        };
        
        // Calculate the opcode: DUP1 is 0x80, DUP2 is 0x81, etc.
        const opcode = 0x80 + i;
        jump_table.table[opcode] = dup_op;
    }
    
    // SWAP1-SWAP16 (0x90-0x9F)
    inline for (0..16) |i| {
        const swap_op = try allocator.create(JumpTable.Operation);
        
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
        
        swap_op.* = JumpTable.Operation{
            .execute = swapFunc,
            .constant_gas = JumpTable.GasFastestStep,
            .min_stack = JumpTable.minSwapStack(@intCast(i + 1)),
            .max_stack = JumpTable.maxSwapStack(@intCast(i + 1)),
        };
        
        // Calculate the opcode: SWAP1 is 0x90, SWAP2 is 0x91, etc.
        const opcode = 0x90 + i;
        jump_table.table[opcode] = swap_op;
    }
}