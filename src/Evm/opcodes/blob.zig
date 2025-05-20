const std = @import("std");
const Interpreter = @import("../interpreter.zig").Interpreter;
const Frame = @import("../Frame.zig").Frame;
const ExecutionError = @import("../Frame.zig").ExecutionError;
const JumpTable = @import("../JumpTable.zig");
const Stack = @import("../Stack.zig").Stack;
const Memory = @import("../Memory.zig").Memory;

// EIP-4844: Shard Blob Transactions (Blob opcode gas prices)
pub const BlobHashGas: u64 = 3;
pub const BlobBaseFeeGas: u64 = 2;

/// BLOBHASH opcode (EIP-4844)
/// Returns the versioned hash of the shard blob at the given index
pub fn opBlobHash(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    
    // Check if EIP-4844 is enabled
    if (!interpreter.evm.chainRules.IsEIP4844) {
        return ExecutionError.InvalidOpcode;
    }
    
    // We need at least 1 item on the stack
    if (frame.stack.size < 1) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop the blob index from the stack
    const index = try frame.stack.pop();
    
    // Get blob versioned hash for the given index
    // Note: In a full implementation, we would check if the index is valid
    // and get the actual blob hash from the transaction
    // For now, we'll return a placeholder value
    var placeholder_hash: u256 = 0;
    
    // If we have a valid blob index in a full implementation,
    // we would get the hash from evm.blobs[index]
    
    // Push the blob hash onto the stack
    try frame.stack.push(placeholder_hash);
    
    return "";
}

/// BLOBBASEFEE opcode (EIP-4844)
/// Returns the current blob base fee
pub fn opBlobBaseFee(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    
    // Check if EIP-4844 is enabled
    if (!interpreter.evm.chainRules.IsEIP4844) {
        return ExecutionError.InvalidOpcode;
    }
    
    // Get the current blob base fee
    // Note: In a full implementation, we would get the actual blob base fee
    // from the block header or environment
    var blob_base_fee: u256 = 1000000; // Placeholder value
    
    // Push the blob base fee onto the stack
    try frame.stack.push(blob_base_fee);
    
    return "";
}

/// MCOPY opcode (EIP-5656)
/// Memory copy operation - copies a chunk of memory from one location to another
pub fn opMcopy(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    
    // Check if EIP-5656 is enabled
    if (!interpreter.evm.chainRules.IsEIP5656) {
        return ExecutionError.InvalidOpcode;
    }
    
    // We need at least 3 items on the stack
    if (frame.stack.size < 3) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop length, source offset, and destination offset from the stack
    const length = try frame.stack.pop();
    const source_offset = try frame.stack.pop();
    const destination_offset = try frame.stack.pop();
    
    // Convert to u64 values
    const mem_length = @as(u64, @truncate(length));
    const mem_source = @as(u64, @truncate(source_offset));
    const mem_dest = @as(u64, @truncate(destination_offset));
    
    // Check for zero length
    if (mem_length == 0) {
        return "";
    }
    
    // Check memory bounds
    if (mem_source + mem_length > frame.memory.data().len || 
        mem_dest + mem_length > frame.memory.data().len) {
        return ExecutionError.OutOfOffset;
    }
    
    // Handle potential overlap by using memmove
    const source_slice = frame.memory.data()[mem_source..mem_source + mem_length];
    const dest_slice = frame.memory.data()[mem_dest..mem_dest + mem_length];
    
    // Create a temporary buffer for the copy
    var temp_buffer = try std.heap.page_allocator.alloc(u8, mem_length);
    defer std.heap.page_allocator.free(temp_buffer);
    
    // Copy data to temp buffer
    @memcpy(temp_buffer, source_slice);
    
    // Copy from temp buffer to destination
    @memcpy(dest_slice, temp_buffer);
    
    return "";
}

/// Calculate memory size for MCOPY operation
pub fn mcopyMemorySize(stack: *Stack) struct { size: u64, overflow: bool } {
    // We need at least 3 items on the stack for MCOPY
    if (stack.size < 3) {
        return .{ .size = 0, .overflow = false };
    }
    
    // Get stack values
    const length = stack.data[stack.size - 1];
    const source_offset = stack.data[stack.size - 2];
    const destination_offset = stack.data[stack.size - 3];
    
    // Convert to u64
    const mem_length = @as(u64, @truncate(length));
    const mem_source = @as(u64, @truncate(source_offset));
    const mem_dest = @as(u64, @truncate(destination_offset));
    
    // Calculate max memory size needed
    var max_size: u64 = 0;
    
    // Check potential overflow for source_offset + length
    if (mem_length > std.math.maxInt(u64) - mem_source) {
        return .{ .size = 0, .overflow = true };
    }
    max_size = @max(max_size, mem_source + mem_length);
    
    // Check potential overflow for destination_offset + length
    if (mem_length > std.math.maxInt(u64) - mem_dest) {
        return .{ .size = 0, .overflow = true };
    }
    max_size = @max(max_size, mem_dest + mem_length);
    
    return .{ .size = max_size, .overflow = false };
}

/// Dynamic gas calculation for MCOPY
pub fn mcopyDynamicGas(interpreter: *Interpreter, frame: *Frame, stack: *Stack, memory: *Memory, requested_size: u64) error{OutOfGas}!u64 {
    _ = interpreter;
    _ = frame;
    _ = requested_size;
    
    // We need at least 3 items on the stack
    if (stack.size < 3) {
        return error.OutOfGas;
    }
    
    // Calculate memory size and expansion cost
    const mem_result = mcopyMemorySize(stack);
    if (mem_result.overflow) {
        return error.OutOfGas;
    }
    
    // Calculate memory expansion cost if any
    var gas: u64 = 0;
    if (mem_result.size > memory.size()) {
        gas = try JumpTable.memoryGasCost(memory, mem_result.size);
    }
    
    // Add MCOPY operation gas (using CopyGas as defined in geth)
    gas += JumpTable.CopyGas;
    
    // Add cost for each word copied (rounded up)
    const length = stack.data[stack.size - 1];
    const mem_length = @as(u64, @truncate(length));
    
    // Calculate word cost - 1 gas per 32-byte word (rounded up)
    const words = (mem_length + 31) / 32;
    gas += words;
    
    return gas;
}

/// Register blob opcodes in the jump table
pub fn registerBlobOpcodes(allocator: std.mem.Allocator, jump_table: *JumpTable.JumpTable) !void {
    // BLOBHASH (0x49)
    const blobhash_op = try allocator.create(JumpTable.Operation);
    blobhash_op.* = JumpTable.Operation{
        .execute = opBlobHash,
        .constant_gas = BlobHashGas,
        .min_stack = JumpTable.minStack(1, 1),
        .max_stack = JumpTable.maxStack(1, 1),
    };
    jump_table.table[0x49] = blobhash_op;
    
    // BLOBBASEFEE (0x4A)
    const blobbasefee_op = try allocator.create(JumpTable.Operation);
    blobbasefee_op.* = JumpTable.Operation{
        .execute = opBlobBaseFee,
        .constant_gas = BlobBaseFeeGas,
        .min_stack = JumpTable.minStack(0, 1),
        .max_stack = JumpTable.maxStack(0, 1),
    };
    jump_table.table[0x4A] = blobbasefee_op;
    
    // MCOPY (0x5E)
    const mcopy_op = try allocator.create(JumpTable.Operation);
    mcopy_op.* = JumpTable.Operation{
        .execute = opMcopy,
        .constant_gas = 0, // Dynamic gas calculation
        .dynamic_gas = mcopyDynamicGas,
        .min_stack = JumpTable.minStack(3, 0),
        .max_stack = JumpTable.maxStack(3, 0),
        .memory_size = mcopyMemorySize,
    };
    jump_table.table[0x5E] = mcopy_op;
}