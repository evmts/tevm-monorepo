const std = @import("std");
const testing = std.testing;
const crypto = @import("crypto.zig");
const Frame = @import("../Frame.zig").Frame;
const Stack = @import("../Stack.zig").Stack;
const Contract = @import("../Contract.zig").Contract;
const Address = @import("../Address");
const Interpreter = @import("../interpreter.zig").Interpreter;
const JumpTable = @import("../JumpTable.zig");

/// Test bytesToUint256 conversion function
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

/// Test KECCAK256 opcode
test "KECCAK256 opcode" {
    const allocator = testing.allocator;
    
    // Create test contract
    const caller = Address.createAddress("0x1111111111111111111111111111111111111111");
    const contract_addr = Address.createAddress("0x2222222222222222222222222222222222222222");
    var contract = Contract.init(caller, contract_addr, 0, 100000, null);
    
    // Setup test frame
    var frame = try Frame.init(allocator, &contract);
    defer frame.deinit();
    
    // Create interpreter
    var dummy_evm = try allocator.create(Evm);
    defer allocator.destroy(dummy_evm);
    dummy_evm.* = Evm{};
    
    var jump_table = JumpTable.init();
    var interpreter = Interpreter.create(allocator, dummy_evm, jump_table);
    defer interpreter.deinit();
    
    // Test case 1: Empty data (should return zero)
    {
        try frame.memory.resize(64);
        try frame.stack.push(0); // offset
        try frame.stack.push(0); // size
        
        _ = try crypto.opKeccak256(0, &interpreter, &frame);
        
        const result = try frame.stack.pop();
        try testing.expectEqual(@as(u256, 0), result);
    }
    
    // Test case 2: Known value
    {
        try frame.memory.resize(64);
        const test_data = [_]u8{'a', 'b', 'c'}; // "abc"
        frame.memory.set(0, test_data.len, &test_data);
        
        try frame.stack.push(0); // offset
        try frame.stack.push(3); // size (length of "abc")
        
        _ = try crypto.opKeccak256(0, &interpreter, &frame);
        
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
        
        try frame.stack.push(16);  // offset
        try frame.stack.push(32);  // size (exceeds memory bounds)
        
        const result = crypto.opKeccak256(0, &interpreter, &frame);
        try testing.expectError(ExecutionError.OutOfOffset, result);
    }
    
    // Test case 4: Stack underflow
    {
        frame.stack = Stack{}; // Empty stack
        
        const result = crypto.opKeccak256(0, &interpreter, &frame);
        try testing.expectError(ExecutionError.StackUnderflow, result);
    }
}

/// Test memory size calculation for KECCAK256
test "KECCAK256 memory size calculation" {
    var stack = Stack{};
    
    // Test case 1: Empty stack
    {
        const result = crypto.getKeccak256MemorySize(&stack);
        try testing.expectEqual(@as(u64, 0), result.size);
        try testing.expectEqual(false, result.overflow);
    }
    
    // Test case 2: Zero size
    {
        try stack.push(100); // offset
        try stack.push(0);   // size
        
        const result = crypto.getKeccak256MemorySize(&stack);
        try testing.expectEqual(@as(u64, 0), result.size);
        try testing.expectEqual(false, result.overflow);
    }
    
    // Test case 3: Normal case
    {
        stack = Stack{};
        try stack.push(64);  // offset
        try stack.push(32);  // size
        
        const result = crypto.getKeccak256MemorySize(&stack);
        try testing.expectEqual(@as(u64, 96), result.size); // 64+32 rounded to nearest 32
        try testing.expectEqual(false, result.overflow);
    }
    
    // Test case 4: Unaligned size
    {
        stack = Stack{};
        try stack.push(100);  // offset
        try stack.push(10);   // size
        
        const result = crypto.getKeccak256MemorySize(&stack);
        try testing.expectEqual(@as(u64, 128), result.size); // 100+10=110, rounded up to 128 (4 words)
        try testing.expectEqual(false, result.overflow);
    }
}

/// Test dynamic gas calculation for KECCAK256
test "KECCAK256 dynamic gas calculation" {
    const allocator = testing.allocator;
    
    // Create test contract
    const caller = Address.createAddress("0x1111111111111111111111111111111111111111");
    const contract_addr = Address.createAddress("0x2222222222222222222222222222222222222222");
    var contract = Contract.init(caller, contract_addr, 0, 100000, null);
    
    // Setup test frame
    var frame = try Frame.init(allocator, &contract);
    defer frame.deinit();
    
    // Create interpreter
    var dummy_evm = try allocator.create(Evm);
    defer allocator.destroy(dummy_evm);
    dummy_evm.* = Evm{};
    
    var jump_table = JumpTable.init();
    var interpreter = Interpreter.create(allocator, dummy_evm, jump_table);
    defer interpreter.deinit();
    
    // Test case 1: Zero size
    {
        try frame.stack.push(0); // size
        
        const gas = try crypto.getKeccak256DynamicGas(&interpreter, &frame);
        try testing.expectEqual(@as(u64, 0), gas);
    }
    
    // Test case 2: 1 word
    {
        frame.stack = Stack{};
        try frame.stack.push(32); // size (1 word)
        
        const gas = try crypto.getKeccak256DynamicGas(&interpreter, &frame);
        try testing.expectEqual(@as(u64, 6), gas); // 1 word * 6 gas
    }
    
    // Test case 3: Unaligned size
    {
        frame.stack = Stack{};
        try frame.stack.push(33); // size (just over 1 word)
        
        const gas = try crypto.getKeccak256DynamicGas(&interpreter, &frame);
        try testing.expectEqual(@as(u64, 12), gas); // 2 words * 6 gas
    }
    
    // Test case 4: Multiple words
    {
        frame.stack = Stack{};
        try frame.stack.push(100); // size (4 words)
        
        const gas = try crypto.getKeccak256DynamicGas(&interpreter, &frame);
        try testing.expectEqual(@as(u64, 24), gas); // 4 words * 6 gas
    }
}