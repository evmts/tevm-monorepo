const std = @import("std");
const testing = std.testing;
const EvmTest = @import("EvmTestHelpers.zig").EvmTest;
const helpers = @import("EvmTestHelpers.zig");
const opcodes = @import("../opcodes.zig");
const interpreter = @import("../interpreter.zig");
const u256 = @import("../../Types/U256.ts").u256;

const Opcode = opcodes.Opcode;

/// Test basic memory operations
test "memory store and load" {
    var evm_test = try EvmTest.init(testing.allocator);
    defer evm_test.deinit();
    
    // Test: Store 0x42 at memory position 0 and then load it
    {
        // PUSH1 0x42, PUSH1 0, MSTORE, PUSH1 0, MLOAD, PUSH1 0, MSTORE, PUSH1 32, PUSH1 0, RETURN
        const code = 
            helpers.push(0x42) ++ 
            helpers.push(0) ++ 
            &[_]u8{@intFromEnum(Opcode.MSTORE)} ++
            helpers.push(0) ++
            &[_]u8{@intFromEnum(Opcode.MLOAD)} ++
            helpers.ret_top();
            
        try evm_test.execute(100, code, &[_]u8{});
        
        const result = evm_test.result.?;
        try testing.expectEqual(@as(?interpreter.InterpreterError, null), result.status);
        try testing.expectEqual(@as(u64, 32), result.output.?.len);
        
        // Check that the value 0x42 was correctly stored and loaded
        try testing.expectEqual(@as(u8, 0x42), result.output.?[31]);
    }
}

/// Test memory expansion and gas costs
test "memory expansion" {
    var evm_test = try EvmTest.init(testing.allocator);
    defer evm_test.deinit();
    
    // Test: Store to a high memory offset to trigger expansion
    {
        // Store a value at position 128 (requires memory expansion)
        const code = helpers.mstore(128, 0x42) ++ helpers.ret(128, 32);
        
        try evm_test.execute(10000, code, &[_]u8{});
        
        const result = evm_test.result.?;
        try testing.expectEqual(@as(?interpreter.InterpreterError, null), result.status);
        try testing.expectEqual(@as(u64, 32), result.output.?.len);
        
        // Check that the value 0x42 was correctly stored
        try testing.expectEqual(@as(u8, 0x42), result.output.?[31]);
        
        // Verify that gas was used for memory expansion
        // Note: Exact gas calculation depends on our implementation
        try testing.expect(result.gas_used > 20); // More than just the basic operations
    }
    
    // Test: Try to allocate too much memory with limited gas
    {
        // Attempt to store at a very high offset (would require lots of gas)
        const code = helpers.mstore(1000000, 0x42);
        
        try evm_test.execute(100, code, &[_]u8{});
        
        const result = evm_test.result.?;
        try testing.expectEqual(interpreter.InterpreterError.OutOfGas, result.status.?);
    }
}

/// Test MSTORE8 operation
test "mstore8" {
    var evm_test = try EvmTest.init(testing.allocator);
    defer evm_test.deinit();
    
    // Test: Store a single byte and read it back
    {
        // Store 0x42 at position 0 using MSTORE8, then return 32 bytes
        const code = 
            helpers.push(0x42) ++ 
            helpers.push(0) ++ 
            &[_]u8{@intFromEnum(Opcode.MSTORE8)} ++
            helpers.ret(0, 32);
            
        try evm_test.execute(100, code, &[_]u8{});
        
        const result = evm_test.result.?;
        try testing.expectEqual(@as(?interpreter.InterpreterError, null), result.status);
        try testing.expectEqual(@as(u64, 32), result.output.?.len);
        
        // Check that the value 0x42 was correctly stored as a single byte
        try testing.expectEqual(@as(u8, 0x42), result.output.?[0]);
        
        // All other bytes should be 0
        for (1..32) |i| {
            try testing.expectEqual(@as(u8, 0), result.output.?[i]);
        }
    }
    
    // Test: Store multiple bytes at different positions
    {
        // Store 0x42 at position 0, 0xAA at position 10, return 32 bytes
        const code = 
            helpers.push(0x42) ++ 
            helpers.push(0) ++ 
            &[_]u8{@intFromEnum(Opcode.MSTORE8)} ++
            helpers.push(0xAA) ++ 
            helpers.push(10) ++ 
            &[_]u8{@intFromEnum(Opcode.MSTORE8)} ++
            helpers.ret(0, 32);
            
        try evm_test.execute(100, code, &[_]u8{});
        
        const result = evm_test.result.?;
        try testing.expectEqual(@as(?interpreter.InterpreterError, null), result.status);
        try testing.expectEqual(@as(u64, 32), result.output.?.len);
        
        // Check that the values were correctly stored
        try testing.expectEqual(@as(u8, 0x42), result.output.?[0]);
        try testing.expectEqual(@as(u8, 0xAA), result.output.?[10]);
    }
}

/// Test calldata access
test "calldata access" {
    var evm_test = try EvmTest.init(testing.allocator);
    defer evm_test.deinit();
    
    // Test: Load data from calldata
    {
        // Load calldata at position 0, store to memory, return it
        const code = 
            helpers.push(0) ++ // offset in calldata 
            &[_]u8{@intFromEnum(Opcode.CALLDATALOAD)} ++
            helpers.ret_top();
            
        // Input: 0x123456...
        const input = "\x12\x34\x56\x78\x9a\xbc\xde\xf0".*;
        
        try evm_test.execute(100, code, &input);
        
        const result = evm_test.result.?;
        try testing.expectEqual(@as(?interpreter.InterpreterError, null), result.status);
        try testing.expectEqual(@as(u64, 32), result.output.?.len);
        
        // Check that input was correctly loaded (padded to 32 bytes)
        try testing.expectEqual(@as(u8, 0x12), result.output.?[0]);
        try testing.expectEqual(@as(u8, 0x34), result.output.?[1]);
        try testing.expectEqual(@as(u8, 0x56), result.output.?[2]);
        
        // Check that all bytes beyond input are zero
        for (input.len..32) |i| {
            try testing.expectEqual(@as(u8, 0), result.output.?[i]);
        }
    }
    
    // Test: Copy data from calldata to memory
    {
        // Copy 4 bytes from calldata at position 2 to memory at position 0
        const code = 
            helpers.push(4) ++ // size 
            helpers.push(2) ++ // offset in calldata
            helpers.push(0) ++ // destination in memory
            &[_]u8{@intFromEnum(Opcode.CALLDATACOPY)} ++
            helpers.ret(0, 32);
            
        // Input: 0x123456789a
        const input = "\x12\x34\x56\x78\x9a".*;
        
        try evm_test.execute(100, code, &input);
        
        const result = evm_test.result.?;
        try testing.expectEqual(@as(?interpreter.InterpreterError, null), result.status);
        try testing.expectEqual(@as(u64, 32), result.output.?.len);
        
        // Check that input was correctly copied (4 bytes starting at offset 2)
        try testing.expectEqual(@as(u8, 0x56), result.output.?[0]); // input[2]
        try testing.expectEqual(@as(u8, 0x78), result.output.?[1]); // input[3]
        try testing.expectEqual(@as(u8, 0x9a), result.output.?[2]); // input[4]
        try testing.expectEqual(@as(u8, 0x00), result.output.?[3]); // Beyond input bounds, padded with 0
    }
}

/// Test MSIZE operation
test "msize" {
    var evm_test = try EvmTest.init(testing.allocator);
    defer evm_test.deinit();
    
    // Test: Get memory size after allocating memory
    {
        // Store value at offset 64, then get memory size
        const code = 
            helpers.mstore(64, 0x42) ++ // This expands memory to 96 bytes (64+32)
            &[_]u8{@intFromEnum(Opcode.MSIZE)} ++ // Get memory size in bytes
            helpers.ret_top();
            
        try evm_test.execute(1000, code, &[_]u8{});
        
        const result = evm_test.result.?;
        try testing.expectEqual(@as(?interpreter.InterpreterError, null), result.status);
        try testing.expectEqual(@as(u64, 32), result.output.?.len);
        
        // Memory size should be 96 bytes (0x60)
        try testing.expectEqual(@as(u8, 0x60), result.output.?[31]);
    }
    
    // Test: Memory size is word-aligned (multiples of 32 bytes)
    {
        // Store a single byte at offset 65 using MSTORE8
        const code = 
            helpers.push(0x42) ++ 
            helpers.push(65) ++ 
            &[_]u8{@intFromEnum(Opcode.MSTORE8)} ++
            &[_]u8{@intFromEnum(Opcode.MSIZE)} ++
            helpers.ret_top();
            
        try evm_test.execute(1000, code, &[_]u8{});
        
        const result = evm_test.result.?;
        try testing.expectEqual(@as(?interpreter.InterpreterError, null), result.status);
        try testing.expectEqual(@as(u64, 32), result.output.?.len);
        
        // Memory size should be 96 bytes (0x60) - rounded up to the next word
        try testing.expectEqual(@as(u8, 0x60), result.output.?[31]);
    }
}