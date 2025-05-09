//! Tests for environment information operations
//! Verifies the implementation of environment access opcodes

const std = @import("std");
const testing = std.testing;
const Interpreter = @import("../../interpreter/interpreter.zig").Interpreter;
const Opcode = @import("../../opcodes/opcodes.zig").Opcode;
const ExecutionResult = @import("../../util/types.zig").ExecutionResult;
const U256 = @import("../../util/types.zig").U256;
const Address = @import("../../util/types.zig").Address;
const Hash = @import("../../util/types.zig").Hash;
const EvmEnvironment = @import("../../opcodes/environment.zig").EvmEnvironment;

/// Test a simple bytecode that accesses block information
test "Block information bytecode execution" {
    // Create bytecode that accesses block information:
    // 1. NUMBER (returns current block number)
    // 2. TIMESTAMP (returns current block timestamp)
    // 3. CHAINID (returns current chain ID)
    
    const bytecode = [_]u8{
        @intFromEnum(Opcode.NUMBER),     // Push block number to stack
        @intFromEnum(Opcode.TIMESTAMP),  // Push timestamp to stack
        @intFromEnum(Opcode.CHAINID),    // Push chain ID to stack
    };
    
    // Create interpreter with a modified block environment
    var interpreter = try Interpreter.init(testing.allocator, &bytecode, 100000, 0);
    defer interpreter.deinit();
    
    // Create test environment
    var env = EvmEnvironment.init(testing.allocator);
    defer env.deinit();
    
    // Set test values
    env.block_number = 12345;
    env.timestamp = 1616161616;
    env.chain_id = 42; // Arbitrary test chain
    
    // Set environment in interpreter
    interpreter.environment = &env;
    
    // Execute the bytecode
    const result = interpreter.execute();
    
    // Verify the result
    switch (result) {
        .Success => |success| {
            // The stack should have three values: number, timestamp, chainid
            try testing.expectEqual(@as(usize, 3), interpreter.stack.getSize());
            
            // Check chain ID (top of stack)
            const chain_id = try interpreter.stack.pop();
            try testing.expectEqual(U256.fromU64(42), chain_id);
            
            // Check timestamp (middle of stack)
            const timestamp = try interpreter.stack.pop();
            try testing.expectEqual(U256.fromU64(1616161616), timestamp);
            
            // Check block number (bottom of stack)
            const block_number = try interpreter.stack.pop();
            try testing.expectEqual(U256.fromU64(12345), block_number);
        },
        else => {
            try testing.expect(false); // This should not happen
        },
    }
}

/// Test accessing contract information through the environment
test "Contract information bytecode execution" {
    // Create bytecode that accesses contract information:
    // 1. ADDRESS (gets this contract's address)
    // 2. CALLER (gets the caller's address)
    // 3. CALLVALUE (gets the value sent with the call)
    
    const bytecode = [_]u8{
        @intFromEnum(Opcode.ADDRESS),    // Push contract address to stack
        @intFromEnum(Opcode.CALLER),     // Push caller address to stack
        @intFromEnum(Opcode.CALLVALUE),  // Push call value to stack
    };
    
    // Create interpreter
    var interpreter = try Interpreter.init(testing.allocator, &bytecode, 100000, 0);
    defer interpreter.deinit();
    
    // Create test environment
    var env = EvmEnvironment.init(testing.allocator);
    defer env.deinit();
    
    // Set test addresses
    var contract_addr = Address.zero();
    contract_addr.bytes[19] = 0xAA;
    
    var caller_addr = Address.zero();
    caller_addr.bytes[19] = 0xBB;
    
    env.address = contract_addr;
    env.caller = caller_addr;
    env.value = U256.fromU64(1234); // Wei sent with call
    
    // Set environment in interpreter
    interpreter.environment = &env;
    
    // Execute the bytecode
    const result = interpreter.execute();
    
    // Verify the result
    switch (result) {
        .Success => |success| {
            // The stack should have three values: address, caller, value
            try testing.expectEqual(@as(usize, 3), interpreter.stack.getSize());
            
            // Check call value (top of stack)
            const value = try interpreter.stack.pop();
            try testing.expectEqual(U256.fromU64(1234), value);
            
            // Check caller address (middle of stack)
            const caller = try interpreter.stack.pop();
            try testing.expectEqual(@as(u64, 0xBB), caller.words[0] & 0xFF);
            
            // Check contract address (bottom of stack)
            const address = try interpreter.stack.pop();
            try testing.expectEqual(@as(u64, 0xAA), address.words[0] & 0xFF);
        },
        else => {
            try testing.expect(false); // This should not happen
        },
    }
}

/// Test BLOCKHASH operation
test "BLOCKHASH bytecode execution" {
    // Create bytecode that gets a block hash:
    // 1. PUSH1 5 (block offset from current)
    // 2. NUMBER (get current block number)
    // 3. SUB (current - 5 = target block number)
    // 4. BLOCKHASH (get hash of target block)
    
    const bytecode = [_]u8{
        @intFromEnum(Opcode.PUSH1), 5,         // Push offset 5
        @intFromEnum(Opcode.NUMBER),           // Push current block number
        @intFromEnum(Opcode.SUB),              // Subtract to get target block
        @intFromEnum(Opcode.BLOCKHASH),        // Get hash of target block
    };
    
    // Create interpreter
    var interpreter = try Interpreter.init(testing.allocator, &bytecode, 100000, 0);
    defer interpreter.deinit();
    
    // Create test environment
    var env = EvmEnvironment.init(testing.allocator);
    defer env.deinit();
    
    // Set block number
    env.block_number = 1000;
    
    // Create a test hash
    var test_hash = Hash.zero();
    test_hash.bytes[0] = 0xCC;
    test_hash.bytes[31] = 0xDD;
    
    // Store the hash for block 995 (current - 5)
    try env.setBlockHash(995, test_hash);
    
    // Set environment in interpreter
    interpreter.environment = &env;
    
    // Execute the bytecode
    const result = interpreter.execute();
    
    // Verify the result
    switch (result) {
        .Success => |success| {
            // The stack should have one value: the block hash
            try testing.expectEqual(@as(usize, 1), interpreter.stack.getSize());
            
            // Check the hash
            const hash_result = try interpreter.stack.pop();
            
            // Verify first and last bytes
            var expected_high_byte: u64 = 0;
            expected_high_byte = expected_high_byte | (@as(u64, 0xCC) << 56);
            
            var expected_low_byte: u64 = 0xDD;
            
            try testing.expectEqual(expected_high_byte, hash_result.words[3] & (0xFF << 56));
            try testing.expectEqual(expected_low_byte, hash_result.words[0] & 0xFF);
        },
        else => {
            try testing.expect(false); // This should not happen
        },
    }
}

/// Test that memory operations for calldata work correctly
test "Calldata operations bytecode execution" {
    // Create bytecode that manipulates calldata:
    // 1. CALLDATASIZE (get size of calldata)
    // 2. PUSH1 0 (offset in calldata)
    // 3. CALLDATALOAD (load 32 bytes from calldata)
    // 4. PUSH1 0 (destination in memory)
    // 5. PUSH1 0 (offset in calldata)
    // 6. PUSH1 5 (bytes to copy)
    // 7. CALLDATACOPY (copy 5 bytes from calldata to memory)
    
    const bytecode = [_]u8{
        @intFromEnum(Opcode.CALLDATASIZE),     // Push calldata size
        @intFromEnum(Opcode.PUSH1), 0,         // Push offset 0
        @intFromEnum(Opcode.CALLDATALOAD),     // Load 32 bytes from calldata
        @intFromEnum(Opcode.PUSH1), 0,         // Push memory destination
        @intFromEnum(Opcode.PUSH1), 0,         // Push calldata offset
        @intFromEnum(Opcode.PUSH1), 5,         // Push size to copy
        @intFromEnum(Opcode.CALLDATACOPY),     // Copy calldata to memory
    };
    
    // Create interpreter
    var interpreter = try Interpreter.init(testing.allocator, &bytecode, 100000, 0);
    defer interpreter.deinit();
    
    // Test calldata
    const calldata = [_]u8{0xA1, 0xB2, 0xC3, 0xD4, 0xE5};
    
    // Set calldata in interpreter
    interpreter.calldata = &calldata;
    
    // Execute the bytecode
    const result = interpreter.execute();
    
    // Verify the result
    switch (result) {
        .Success => |success| {
            // The stack should have three values: size, loaded data
            try testing.expectEqual(@as(usize, 2), interpreter.stack.getSize());
            
            // Check loaded data (top of stack)
            const loaded_data = try interpreter.stack.pop();
            
            // Expected: 0xA1B2C3D4E5000...000 (32 bytes, first 5 from calldata)
            var expected = U256.zero();
            expected = expected.shl(8).add(U256.fromU64(0xA1));
            expected = expected.shl(8).add(U256.fromU64(0xB2));
            expected = expected.shl(8).add(U256.fromU64(0xC3));
            expected = expected.shl(8).add(U256.fromU64(0xD4));
            expected = expected.shl(8).add(U256.fromU64(0xE5));
            expected = expected.shl(8 * 27); // Shift left for padding
            
            try testing.expectEqual(expected, loaded_data);
            
            // Check calldata size (bottom of stack)
            const size = try interpreter.stack.pop();
            try testing.expectEqual(U256.fromU64(5), size);
            
            // Check memory after CALLDATACOPY
            try testing.expectEqual(@as(u8, 0xA1), interpreter.memory.page.buffer[0]);
            try testing.expectEqual(@as(u8, 0xB2), interpreter.memory.page.buffer[1]);
            try testing.expectEqual(@as(u8, 0xC3), interpreter.memory.page.buffer[2]);
            try testing.expectEqual(@as(u8, 0xD4), interpreter.memory.page.buffer[3]);
            try testing.expectEqual(@as(u8, 0xE5), interpreter.memory.page.buffer[4]);
        },
        else => {
            try testing.expect(false); // This should not happen
        },
    }
}