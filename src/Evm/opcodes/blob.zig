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

// Helper to convert Stack errors to ExecutionError
fn mapStackError(err: StackError) ExecutionError {
    return switch (err) {
        error.OutOfBounds => ExecutionError.StackUnderflow,
        error.StackOverflow => ExecutionError.StackOverflow,
        error.OutOfMemory => ExecutionError.OutOfGas,
    };
}
const Memory = @import("../Memory.zig").Memory;

// EIP-4844: Shard Blob Transactions (Blob opcode gas prices)
pub const BlobHashGas: u64 = 3;
pub const BlobBaseFeeGas: u64 = 2;

// BLOBHASH opcode (EIP-4844)
// Returns the versioned hash of the shard blob at the given index
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
    const index = frame.stack.pop() catch |err| return mapStackError(err);
    
    // Convert index to usize, checking for overflow
    const index_usize = std.math.cast(usize, index) orelse {
        // Index too large, push 0
        frame.stack.push(0);
        return "";
    };
    
    // Get blob versioned hash for the given index
    var hash_value: u256 = 0;
    
    // Check if index is within bounds of available blob hashes
    if (index_usize < interpreter.evm.blobHashes.len) {
        // Convert the 32-byte hash to u256
        const hash_bytes = interpreter.evm.blobHashes[index_usize];
        for (hash_bytes) |byte| {
            hash_value = (hash_value << 8) | byte;
        }
    }
    // If index is out of bounds, hash_value remains 0
    
    // Push the blob hash onto the stack
    frame.stack.push(hash_value);
    
    return "";
}

// BLOBBASEFEE opcode (EIP-4844)
// Returns the current blob base fee
pub fn opBlobBaseFee(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    
    // Check if EIP-4844 is enabled
    if (!interpreter.evm.chainRules.IsEIP4844) {
        return ExecutionError.InvalidOpcode;
    }
    
    // Get the current blob base fee from the EVM context
    const blob_base_fee = interpreter.evm.blobBaseFee;
    
    // Push the blob base fee onto the stack
    frame.stack.push(blob_base_fee);
    
    return "";
}

// MCOPY opcode (EIP-5656)
// Memory copy operation - copies a chunk of memory from one location to another
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
    const length = frame.stack.pop() catch |err| return mapStackError(err);
    const source_offset = frame.stack.pop() catch |err| return mapStackError(err);
    const destination_offset = frame.stack.pop() catch |err| return mapStackError(err);
    
    // Convert to u64 values
    const mem_length = @as(u64, @truncate(length));
    const mem_source = @as(u64, @truncate(source_offset));
    const mem_dest = @as(u64, @truncate(destination_offset));
    
    // Check for zero length
    if (mem_length == 0) {
        return "";
    }
    
    // Ensure memory has enough capacity for both source and destination
    const required_size = @max(mem_source + mem_length, mem_dest + mem_length);
    if (required_size > frame.memory.len()) {
        try frame.memory.resize(required_size);
    }
    
    // Use memory's built-in copy method which safely handles overlapping regions
    frame.memory.copy(mem_dest, mem_source, mem_length);
    
    return "";
}

// Calculate memory size for MCOPY operation
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

// Dynamic gas calculation for MCOPY
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

// Register blob opcodes in the jump table
pub fn registerBlobOpcodes(allocator: std.mem.Allocator, jump_table: *JumpTable) !void {
    // BLOBHASH (0x49)
    const blobhash_op = try allocator.create(Operation);
    blobhash_op.* = Operation{
        .execute = opBlobHash,
        .constant_gas = BlobHashGas,
        .min_stack = jumpTableModule.minStack(1, 1),
        .max_stack = jumpTableModule.maxStack(1, 1),
    };
    jump_table.table[0x49] = blobhash_op;
    
    // BLOBBASEFEE (0x4A)
    const blobbasefee_op = try allocator.create(Operation);
    blobbasefee_op.* = Operation{
        .execute = opBlobBaseFee,
        .constant_gas = BlobBaseFeeGas,
        .min_stack = jumpTableModule.minStack(0, 1),
        .max_stack = jumpTableModule.maxStack(0, 1),
    };
    jump_table.table[0x4A] = blobbasefee_op;
    
    // MCOPY (0x5E)
    const mcopy_op = try allocator.create(Operation);
    mcopy_op.* = Operation{
        .execute = opMcopy,
        .constant_gas = 0, // Dynamic gas calculation
        .dynamic_gas = mcopyDynamicGas,
        .min_stack = jumpTableModule.minStack(3, 0),
        .max_stack = jumpTableModule.maxStack(3, 0),
        .memory_size = mcopyMemorySize,
    };
    jump_table.table[0x5E] = mcopy_op;
}

// Tests
test "BLOBHASH basic operation" {
    const allocator = std.testing.allocator;
    
    // Create a mock EVM with blob support
    var test_evm = Interpreter.Evm{
        .depth = 0,
        .readOnly = false,
        .chainRules = .{
            .IsEIP4844 = true,
            .IsEIP5656 = true,
        },
        .state_manager = null,
        .gas_used = 0,
        .remaining_gas = 1000000,
        .refund = 0,
        .context = null,
    };
    
    // Create an allocator-based array list for blob hashes
    var blob_hashes = std.ArrayList([32]u8).init(allocator);
    defer blob_hashes.deinit();
    
    // Add test blob hashes
    try blob_hashes.append([_]u8{0x11} ** 32);
    try blob_hashes.append([_]u8{0x22} ** 32);
    try blob_hashes.append([_]u8{0x33} ** 32);
    
    // Set blob hashes on the EVM context
    if (test_evm.context) |ctx| {
        ctx.blobHashes = blob_hashes.items;
    } else {
        // Create a simple context with blob hashes
        var context = struct {
            blobHashes: []const [32]u8,
        }{
            .blobHashes = blob_hashes.items,
        };
        test_evm.context = &context;
    }
    
    // Create interpreter
    var interpreter = Interpreter{
        .pc = 0,
        .gas = 1000000,
        .gas_refund = 0,
        .valid_jump_destinations = std.AutoHashMap(u24, void).init(allocator),
        .allocator = allocator,
        .evm = &test_evm,
    };
    defer interpreter.valid_jump_destinations.deinit();
    
    // Create frame
    var frame = Frame{
        .stack = Stack{},
        .memory = Memory.init(allocator, null) catch unreachable,
        .gas = 1000000,
        .contract = null,
        .returndata = &[_]u8{},
    };
    // Stack no longer needs deinit
    defer frame.memory.deinit();
    
    // Test index 0
    try frame.stack.push(0);
    _ = try opBlobHash(0, &interpreter, &frame);
    try std.testing.expectEqual(@as(usize, 1), frame.stack.size);
    const hash0 = try frame.stack.pop();
    // Expected: 0x1111...1111 (32 bytes of 0x11)
    const expected0: u256 = 0x1111111111111111111111111111111111111111111111111111111111111111;
    try std.testing.expectEqual(expected0, hash0);
    
    // Test index 1
    try frame.stack.push(1);
    _ = try opBlobHash(0, &interpreter, &frame);
    const hash1 = try frame.stack.pop();
    const expected1: u256 = 0x2222222222222222222222222222222222222222222222222222222222222222;
    try std.testing.expectEqual(expected1, hash1);
    
    // Test out of bounds index (should return 0)
    try frame.stack.push(5);
    _ = try opBlobHash(0, &interpreter, &frame);
    const hash_oob = try frame.stack.pop();
    try std.testing.expectEqual(@as(u256, 0), hash_oob);
}

test "BLOBBASEFEE basic operation" {
    const allocator = std.testing.allocator;
    
    // Create a mock EVM with blob support
    var test_evm = Interpreter.Evm{
        .depth = 0,
        .readOnly = false,
        .chainRules = .{
            .IsEIP4844 = true,
            .IsEIP5656 = true,
        },
        .state_manager = null,
        .gas_used = 0,
        .remaining_gas = 1000000,
        .refund = 0,
        .context = null,
    };
    
    // Set blob base fee
    const test_blob_base_fee: u256 = 123456789;
    
    // Create a simple context with blob base fee
    var context = struct {
        blobBaseFee: u256,
    }{
        .blobBaseFee = test_blob_base_fee,
    };
    test_evm.context = &context;
    
    // Create interpreter
    var interpreter = Interpreter{
        .pc = 0,
        .gas = 1000000,
        .gas_refund = 0,
        .valid_jump_destinations = std.AutoHashMap(u24, void).init(allocator),
        .allocator = allocator,
        .evm = &test_evm,
    };
    defer interpreter.valid_jump_destinations.deinit();
    
    // Create frame
    var frame = Frame{
        .stack = Stack{},
        .memory = Memory.init(allocator, null) catch unreachable,
        .gas = 1000000,
        .contract = null,
        .returndata = &[_]u8{},
    };
    // Stack no longer needs deinit
    defer frame.memory.deinit();
    
    // Execute BLOBBASEFEE operation
    _ = try opBlobBaseFee(0, &interpreter, &frame);
    
    // Check result - should have one item on stack
    try std.testing.expectEqual(@as(usize, 1), frame.stack.size);
    try std.testing.expectEqual(test_blob_base_fee, frame.stack.data[0]);
}

test "MCOPY basic operation" {
    const allocator = std.testing.allocator;
    
    // Create a mock EVM with blob support
    var test_evm = Interpreter.Evm{
        .depth = 0,
        .readOnly = false,
        .chainRules = .{
            .IsEIP4844 = true,
            .IsEIP5656 = true,
        },
        .state_manager = null,
        .gas_used = 0,
        .remaining_gas = 1000000,
        .refund = 0,
        .context = null,
    };
    
    // Create interpreter
    var interpreter = Interpreter{
        .pc = 0,
        .gas = 1000000,
        .gas_refund = 0,
        .valid_jump_destinations = std.AutoHashMap(u24, void).init(allocator),
        .allocator = allocator,
        .evm = &test_evm,
    };
    defer interpreter.valid_jump_destinations.deinit();
    
    // Create frame
    var frame = Frame{
        .stack = Stack{},
        .memory = Memory.init(allocator, null) catch unreachable,
        .gas = 1000000,
        .contract = null,
        .returndata = &[_]u8{},
    };
    // Stack no longer needs deinit
    defer frame.memory.deinit();
    
    // Prepare memory with test data
    try frame.memory.resize(128);
    // Set memory data
    for (0..64) |i| {
        frame.memory.data[i] = @truncate(i);
    }
    
    // Setup stack for MCOPY operation test
    try frame.stack.push(64); // destination offset
    try frame.stack.push(0); // source offset
    try frame.stack.push(32); // length
    
    // Execute MCOPY operation
    _ = try opMcopy(0, &interpreter, &frame);
    
    // Check result - memory should be copied correctly
    for (0..32) |i| {
        try std.testing.expectEqual(@as(u8, @truncate(i)), frame.memory.data[64 + i]);
    }
}

test "MCOPY memory size calculation" {
    const allocator = std.testing.allocator;
    
    // Create frame
    var frame = Frame{
        .stack = Stack{},
        .memory = Memory.init(allocator, null) catch unreachable,
        .gas = 1000000,
        .contract = null,
        .returndata = &[_]u8{},
    };
    // Stack no longer needs deinit
    defer frame.memory.deinit();
    
    // Setup stack for MCOPY memory size test
    try frame.stack.push(64); // destination offset
    try frame.stack.push(0); // source offset
    try frame.stack.push(32); // length
    
    // Test memory size calculation
    const mem_size = mcopyMemorySize(&frame.stack);
    try std.testing.expectEqual(@as(u64, 96), mem_size.size); // 64 + 32 = 96
    try std.testing.expect(!mem_size.overflow);
    
    // Test with extreme values to trigger overflow
    _ = try frame.stack.pop();
    _ = try frame.stack.pop();
    _ = try frame.stack.pop();
    
    try frame.stack.push(0xFFFFFFFFFFFFFFFF); // dest - max u64
    try frame.stack.push(0); // source
    try frame.stack.push(1); // length - adding 1 would overflow
    
    const overflow_mem_size = mcopyMemorySize(&frame.stack);
    try std.testing.expect(overflow_mem_size.overflow);
}

test "MCOPY dynamic gas calculation" {
    const allocator = std.testing.allocator;
    
    // Create a mock EVM with blob support
    var test_evm = Interpreter.Evm{
        .depth = 0,
        .readOnly = false,
        .chainRules = .{
            .IsEIP4844 = true,
            .IsEIP5656 = true,
        },
        .state_manager = null,
        .gas_used = 0,
        .remaining_gas = 1000000,
        .refund = 0,
        .context = null,
    };
    
    // Create interpreter
    var interpreter = Interpreter{
        .pc = 0,
        .gas = 1000000,
        .gas_refund = 0,
        .valid_jump_destinations = std.AutoHashMap(u24, void).init(allocator),
        .allocator = allocator,
        .evm = &test_evm,
    };
    defer interpreter.valid_jump_destinations.deinit();
    
    // Create frame
    var frame = Frame{
        .stack = Stack{},
        .memory = Memory.init(allocator, null) catch unreachable,
        .gas = 1000000,
        .contract = null,
        .returndata = &[_]u8{},
    };
    // Stack no longer needs deinit
    defer frame.memory.deinit();
    
    // Prepare memory with enough capacity for test
    try frame.memory.resize(64);
    
    // Setup stack for MCOPY gas calculation test
    try frame.stack.push(0); // destination offset
    try frame.stack.push(0); // source offset
    try frame.stack.push(32); // length
    
    // Calculate MCOPY gas
    // Base cost: CopyGas (3) + 1 word cost (1) = 4
    const mcopy_gas = try mcopyDynamicGas(&interpreter, &frame, &frame.stack, &frame.memory, 0);
    try std.testing.expectEqual(@as(u64, 4), mcopy_gas);
    
    // Test with larger memory expansion
    _ = try frame.stack.pop();
    _ = try frame.stack.pop();
    _ = try frame.stack.pop();
    
    try frame.stack.push(100); // destination offset
    try frame.stack.push(0); // source offset
    try frame.stack.push(32); // length
    
    // Calculate MCOPY gas with memory expansion
    // Base cost: CopyGas (3) + 1 word cost (1) = 4
    // Plus memory expansion cost
    const mcopy_gas_with_expansion = try mcopyDynamicGas(&interpreter, &frame, &frame.stack, &frame.memory, 0);
    try std.testing.expect(mcopy_gas_with_expansion > 4); // Should be more due to memory expansion
}