const std = @import("std");

const evm = @import("evm");
const jumpTableModule = evm.jumpTable;
const JumpTable = jumpTableModule.JumpTable;
const Operation = jumpTableModule.Operation;
const Interpreter = evm.Interpreter;
const Frame = evm.Frame;
const ExecutionError = evm.InterpreterError;
const Stack = evm.Stack;
const StackError = evm.StackError;

// Helper to convert Stack errors to ExecutionError
fn mapStackError(err: StackError) ExecutionError {
    return switch (err) {
        error.OutOfBounds => ExecutionError.StackUnderflow,
        error.StackOverflow => ExecutionError.StackOverflow,
        error.OutOfMemory => ExecutionError.OutOfGas,
    };
}

// KECCAK256 operation - computes Keccak-256 hash of a region of memory
pub fn opKeccak256(pc: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;

    // Pop offset and size from stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }

    const size = frame.stack.pop() catch |err| return mapStackError(err);
    const offset = frame.stack.pop() catch |err| return mapStackError(err);

    // If size is 0, return empty hash (all zeros)
    if (size == 0) {
        frame.stack.push(0) catch |err| return mapStackError(err);
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
    frame.stack.push(hash_value) catch |err| return mapStackError(err);

    return "";
}

// Helper function to calculate memory size for KECCAK256
pub fn getKeccak256MemorySize(stack: *const Stack) struct { size: u64, overflow: bool } {
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

// Helper function to convert bytes to u256
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

// Calculate dynamic gas for KECCAK256 operation
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

// Register cryptographic opcodes in the jump table
pub fn registerCryptoOpcodes(allocator: std.mem.Allocator, jump_table: *JumpTable) !void {
    // KECCAK256 (0x20)
    const keccak256_op = try allocator.create(Operation);
    keccak256_op.* = Operation{
        .execute = opKeccak256,
        .constant_gas = 30, // Keccak256Gas
        .dynamic_gas = getKeccak256DynamicGas,
        .min_stack = jumpTableModule.minStack(2, 1),
        .max_stack = jumpTableModule.maxStack(2, 1),
        .memory_size = getKeccak256MemorySize,
    };
    jump_table.table[0x20] = keccak256_op;
}

// ===== Tests =====

const testing = std.testing;
const Contract = @import("../Contract.zig").Contract;
const Address = @import("../../Types/B256.zig").Address;
const Evm = @import("../evm.zig").Evm;

test "bytesToUint256 conversion" {
    // Test case 1: All zeros
    {
        const bytes = [_]u8{0} ** 32;
        const result = bytesToUint256(bytes);
        try testing.expectEqual(@as(u256, 0), result);
    }

    // Test case 2: All ones (max u256 value)
    {
        const bytes = [_]u8{0xFF} ** 32;
        const result = bytesToUint256(bytes);
        const expected: u256 = ~@as(u256, 0); // All bits set to 1
        try testing.expectEqual(expected, result);
    }

    // Test case 3: Single byte set
    {
        var bytes = [_]u8{0} ** 32;
        bytes[31] = 0x42; // Set least significant byte
        const result = bytesToUint256(bytes);
        try testing.expectEqual(@as(u256, 0x42), result);
    }

    // Test case 4: Multiple bytes set
    {
        var bytes = [_]u8{0} ** 32;
        bytes[30] = 0x12;
        bytes[31] = 0x34;
        const result = bytesToUint256(bytes);
        try testing.expectEqual(@as(u256, 0x1234), result);
    }
}

test "KECCAK256 opcode" {
    const allocator = testing.allocator;
    
    var caller: Address = undefined;
    try std.fmt.hexToBytes(&caller.data, "1111111111111111111111111111111111111111");
    
    var contract_addr: Address = undefined;
    try std.fmt.hexToBytes(&contract_addr.data, "2222222222222222222222222222222222222222");
    
    var contract = Contract{
        .code = &[_]u8{},
        .address = caller,
        .code_address = contract_addr,
        .gas = 100000,
    };

    var frame = try Frame.init(allocator, &contract);
    defer frame.deinit();
    
    var evm_instance = Evm{
        .logs = std.ArrayList(Evm.Log).init(allocator),
    };
    defer evm_instance.logs.deinit();
    
    var interpreter_instance = Interpreter{
        .evm = &evm_instance,
    };

    // Test case 1: Empty data (should return zero)
    {
        try frame.memory.resize(64);
        try frame.stack.push(0); // size
        try frame.stack.push(0); // offset

        _ = try opKeccak256(0, &interpreter_instance, &frame);

        const result = try frame.stack.pop();
        try testing.expectEqual(@as(u256, 0), result);
    }

    // Test case 2: Known value
    {
        try frame.memory.resize(64);
        const test_data = [_]u8{ 'a', 'b', 'c' }; // "abc"
        frame.memory.set(0, test_data.len, &test_data);

        try frame.stack.push(3); // size (length of "abc")
        try frame.stack.push(0); // offset

        _ = try opKeccak256(0, &interpreter_instance, &frame);

        // Expected: keccak256("abc")
        // We'll verify the first 8 bytes of the hash to avoid hardcoding the full hash
        const result = try frame.stack.pop();

        // Expected hash: 0x4e03657aea45a94fc7d47ba826c8d667c0d1e6e33a64a036ec44f58fa12d6c45
        const expected_high_bytes: u64 = 0x4e03657aea45a94f;
        const result_high_bytes = @as(u64, @truncate(result >> 192));

        try testing.expectEqual(expected_high_bytes, result_high_bytes);
    }

    // Test case 3: Memory bounds check
    {
        try frame.memory.resize(32);

        try frame.stack.push(32); // size (exceeds memory bounds)
        try frame.stack.push(16); // offset

        const result = opKeccak256(0, &interpreter_instance, &frame);
        try testing.expectError(ExecutionError.OutOfOffset, result);
    }

    // Test case 4: Stack underflow
    {
        frame.stack.size = 0; // Clear stack

        const result = opKeccak256(0, &interpreter_instance, &frame);
        try testing.expectError(ExecutionError.StackUnderflow, result);
    }
}

test "KECCAK256 memory size calculation" {
    const allocator = testing.allocator;
    const stack_data = try allocator.alloc(u256, 1024);
    defer allocator.free(stack_data);
    
    @memset(stack_data, 0);
    var stack_instance = Stack{
        .data = stack_data,
        .size = 0,
        .capacity = 1024,
    };

    // Test case 1: Empty stack
    {
        const result = getKeccak256MemorySize(&stack_instance);
        try testing.expectEqual(@as(u64, 0), result.size);
        try testing.expectEqual(false, result.overflow);
    }

    // Test case 2: Zero size
    {
        try stack_instance.push(0); // size
        try stack_instance.push(100); // offset

        const result = getKeccak256MemorySize(&stack_instance);
        try testing.expectEqual(@as(u64, 0), result.size);
        try testing.expectEqual(false, result.overflow);
    }

    // Test case 3: Normal case
    {
        stack_instance.size = 0; // Clear stack
        try stack_instance.push(32); // size
        try stack_instance.push(64); // offset

        const result = getKeccak256MemorySize(&stack_instance);
        try testing.expectEqual(@as(u64, 96), result.size); // 64+32 rounded to nearest 32
        try testing.expectEqual(false, result.overflow);
    }

    // Test case 4: Unaligned size
    {
        stack_instance.size = 0; // Clear stack
        try stack_instance.push(10); // size
        try stack_instance.push(100); // offset
        
        const result = getKeccak256MemorySize(&stack_instance);
        try testing.expectEqual(@as(u64, 128), result.size); // 100+10=110, rounded up to 128 (4 words)
        try testing.expectEqual(false, result.overflow);
    }
}

test "KECCAK256 dynamic gas calculation" {
    const allocator = testing.allocator;
    
    var caller: Address = undefined;
    try std.fmt.hexToBytes(&caller.data, "1111111111111111111111111111111111111111");
    
    var contract_addr: Address = undefined;
    try std.fmt.hexToBytes(&contract_addr.data, "2222222222222222222222222222222222222222");
    
    var contract = Contract{
        .code = &[_]u8{},
        .address = caller,
        .code_address = contract_addr,
        .gas = 100000,
    };

    var frame = try Frame.init(allocator, &contract);
    defer frame.deinit();
    
    var evm_instance = Evm{
        .logs = std.ArrayList(Evm.Log).init(allocator),
    };
    defer evm_instance.logs.deinit();
    
    var interpreter_instance = Interpreter{
        .evm = &evm_instance,
    };

    // Test case 1: Zero size
    {
        try frame.stack.push(0); // size

        const gas = try getKeccak256DynamicGas(&interpreter_instance, &frame);
        try testing.expectEqual(@as(u64, 0), gas);
    }

    // Test case 2: 1 word
    {
        frame.stack.size = 0;
        try frame.stack.push(32); // size (1 word)

        const gas = try getKeccak256DynamicGas(&interpreter_instance, &frame);
        try testing.expectEqual(@as(u64, 6), gas); // 1 word * 6 gas
    }

    // Test case 3: Unaligned size
    {
        frame.stack.size = 0;
        try frame.stack.push(33); // size (just over 1 word)

        const gas = try getKeccak256DynamicGas(&interpreter_instance, &frame);
        try testing.expectEqual(@as(u64, 12), gas); // 2 words * 6 gas
    }

    // Test case 4: Multiple words
    {
        frame.stack.size = 0;
        try frame.stack.push(100); // size (4 words)

        const gas = try getKeccak256DynamicGas(&interpreter_instance, &frame);
        try testing.expectEqual(@as(u64, 24), gas); // 4 words * 6 gas
    }
}
