const std = @import("std");
const testing = std.testing;

// Import using package_test approach with relative imports
const package_test = @import("package_test.zig");
const crypto = @import("crypto.zig");

// Use types from package_test
const Frame = package_test.Frame;
const Stack = package_test.Stack;
const Contract = package_test.Contract;
const Interpreter = package_test.Interpreter;
const JumpTable = package_test.JumpTable;
const ExecutionError = package_test.InterpreterError;
const u256_native = u256;

// Use Address from package_test
const Address = package_test.Address;

// Helper function to convert hex string to Address
fn hexToAddress(_: std.mem.Allocator, comptime hex_str: []const u8) !Address {
    if (!std.mem.startsWith(u8, hex_str, "0x") or hex_str.len != 42) {
        return error.InvalidAddressFormat;
    }
    var addr: Address = undefined;
    try std.fmt.hexToBytes(&addr, hex_str[2..]);
    return addr;
}

// Test bytesToUint256 conversion function
test "bytesToUint256 conversion" {
    // Test case 1: All zeros
    {
        const bytes = [_]u8{0} ** 32;
        const result = crypto.bytesToUint256(bytes);
        try testing.expectEqual(@as(u256, 0), result);
    }

    // Test case 2: All ones (max u256 value)
    {
        const bytes = [_]u8{0xFF} ** 32;
        const result = crypto.bytesToUint256(bytes);
        const expected: u256 = ~@as(u256, 0); // All bits set to 1
        try testing.expectEqual(expected, result);
    }

    // Test case 3: Single byte set
    {
        var bytes = [_]u8{0} ** 32;
        bytes[31] = 0x42; // Set least significant byte
        const result = crypto.bytesToUint256(bytes);
        try testing.expectEqual(@as(u256, 0x42), result);
    }

    // Test case 4: Multiple bytes set
    {
        var bytes = [_]u8{0} ** 32;
        bytes[30] = 0x12;
        bytes[31] = 0x34;
        const result = crypto.bytesToUint256(bytes);
        try testing.expectEqual(@as(u256, 0x1234), result);
    }
}

// Test KECCAK256 opcode
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
    
    var evm_instance = package_test.Evm{
        .logs = std.ArrayList(package_test.Evm.Log).init(allocator),
    };
    
    var interpreter_instance = Interpreter{
        .evm = &evm_instance,
    };

    // Test case 1: Empty data (should return zero)
    {
        try frame.memory.resize(64);
        try frame.stack.push(u256_native, 0); // offset
        try frame.stack.push(u256_native, 0); // size

        _ = try crypto.opKeccak256(0, &interpreter_instance, &frame);

        const result = try frame.stack.pop();
        try testing.expectEqual(@as(u256, 0), result);
    }

    // Test case 2: Known value
    {
        try frame.memory.resize(64);
        const test_data = [_]u8{ 'a', 'b', 'c' }; // "abc"
        frame.memory.set(0, test_data.len, &test_data);

        try frame.stack.push(u256_native, 0); // offset
        try frame.stack.push(u256_native, 3); // size (length of "abc")

        _ = try crypto.opKeccak256(0, &interpreter_instance, &frame);

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

        try frame.stack.push(u256_native, 16); // offset
        try frame.stack.push(u256_native, 32); // size (exceeds memory bounds)

        const result = crypto.opKeccak256(0, &interpreter_instance, &frame);
        try testing.expectError(ExecutionError.OutOfOffset, result); // Use EvmModule.InterpreterError
    }

    // Test case 4: Stack underflow
    {
        // frame.stack = Stack{}; // This direct assignment is problematic if Stack needs init
        // Re-init or clear stack properly
        frame.stack.size = 0; // Assuming Stack has a size field and can be cleared this way for test

        const result = crypto.opKeccak256(0, &interpreter_instance, &frame);
        try testing.expectError(ExecutionError.StackUnderflow, result); // Use EvmModule.InterpreterError
    }
}

// Test memory size calculation for KECCAK256
test "KECCAK256 memory size calculation" {
    const allocator = testing.allocator;
    const stack_data = try allocator.alloc(u64, 1024);
    defer allocator.free(stack_data);
    
    @memset(stack_data, 0);
    var stack_instance = Stack{
        .data = stack_data,
        .size = 0,
        .capacity = 1024,
    };

    // Test case 1: Empty stack
    {
        const result = crypto.getKeccak256MemorySize(&stack_instance);
        try testing.expectEqual(@as(u64, 0), result.size);
        try testing.expectEqual(false, result.overflow);
    }

    // Test case 2: Zero size
    {
        try stack_instance.push(u256_native, 100); // offset
        try stack_instance.push(u256_native, 0); // size

        const result = crypto.getKeccak256MemorySize(&stack_instance);
        try testing.expectEqual(@as(u64, 0), result.size);
        try testing.expectEqual(false, result.overflow);
    }

    // Test case 3: Normal case
    {
        stack_instance.size = 0; // Clear stack_instance
        try stack_instance.push(64); // offset
        try stack_instance.push(32); // size

        const result = crypto.getKeccak256MemorySize(&stack_instance);
        try testing.expectEqual(@as(u64, 96), result.size); // 64+32 rounded to nearest 32
        try testing.expectEqual(false, result.overflow);
    }

    // Test case 4: Unaligned size
    {
        stack_instance.size = 0; // Clear stack_instance
        try stack_instance.push(100); // offset
        try stack_instance.push(10); // size
        const result = crypto.getKeccak256MemorySize(&stack_instance);
        try testing.expectEqual(@as(u64, 128), result.size); // 100+10=110, rounded up to 128 (4 words)
        try testing.expectEqual(false, result.overflow);
    }
}

// Test dynamic gas calculation for KECCAK256
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
    
    var evm_instance = package_test.Evm{
        .logs = std.ArrayList(package_test.Evm.Log).init(allocator),
    };
    defer evm_instance.logs.deinit();
    
    var interpreter_instance = Interpreter{
        .evm = &evm_instance,
    };

    // Test case 1: Zero size
    {
        try frame.stack.push(0); // size

        const gas = try crypto.getKeccak256DynamicGas(&interpreter_instance, &frame);
        try testing.expectEqual(@as(u64, 0), gas);
    }

    // Test case 2: 1 word
    {
        frame.stack.size = 0;
        try frame.stack.push(32); // size (1 word)

        const gas = try crypto.getKeccak256DynamicGas(&interpreter_instance, &frame);
        try testing.expectEqual(@as(u64, 6), gas); // 1 word * 6 gas
    }

    // Test case 3: Unaligned size
    {
        frame.stack.size = 0;
        try frame.stack.push(33); // size (just over 1 word)

        const gas = try crypto.getKeccak256DynamicGas(&interpreter_instance, &frame);
        try testing.expectEqual(@as(u64, 12), gas); // 2 words * 6 gas
    }

    // Test case 4: Multiple words
    {
        frame.stack.size = 0;
        try frame.stack.push(100); // size (4 words)

        const gas = try crypto.getKeccak256DynamicGas(&interpreter_instance, &frame);
        try testing.expectEqual(@as(u64, 24), gas); // 4 words * 6 gas
    }
}
