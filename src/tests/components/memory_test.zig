//! Tests for memory opcodes
//! Verifies the proper implementation of memory operations in the ZigEVM

const std = @import("std");
const testing = std.testing;
const Interpreter = @import("../../interpreter/interpreter.zig").Interpreter;
const Opcode = @import("../../opcodes/opcodes.zig").Opcode;
const ExecutionResult = @import("../../util/types.zig").ExecutionResult;
const U256 = @import("../../util/types.zig").U256;

/// Test executing bytecode containing MLOAD and MSTORE operations
test "MLOAD and MSTORE bytecode execution" {
    // Create bytecode for testing MSTORE then MLOAD
    // 1. PUSH 0xDEADBEEF (value to store)
    // 2. PUSH 0 (memory offset)
    // 3. MSTORE (store 0xDEADBEEF at offset 0)
    // 4. PUSH 0 (memory offset)
    // 5. MLOAD (load from offset 0)
    // Result should be 0xDEADBEEF on the stack
    const mstore_mload_bytecode = [_]u8{
        @intFromEnum(Opcode.PUSH4), 0xDE, 0xAD, 0xBE, 0xEF, // Push 0xDEADBEEF
        @intFromEnum(Opcode.PUSH1), 0x00,                   // Push offset 0
        @intFromEnum(Opcode.MSTORE),                        // Store value at offset
        @intFromEnum(Opcode.PUSH1), 0x00,                   // Push offset 0
        @intFromEnum(Opcode.MLOAD),                         // Load from offset
    };
    
    // Create interpreter and execute the bytecode
    var interpreter = try Interpreter.init(testing.allocator, &mstore_mload_bytecode, 100000, 0);
    defer interpreter.deinit();
    
    const result = interpreter.execute();
    
    // Verify the result
    switch (result) {
        .Success => |success| {
            // The stack should have one value: 0xDEADBEEF
            try testing.expectEqual(@as(usize, 1), interpreter.stack.getSize());
            
            const expected = U256{ .words = .{ 0xDEADBEEF, 0, 0, 0 } };
            try testing.expectEqual(expected, try interpreter.stack.peek().*);
        },
        else => {
            try testing.expect(false); // This should not happen
        },
    }
}

/// Test executing bytecode containing MSTORE8 operation
test "MSTORE8 bytecode execution" {
    // Create bytecode for testing MSTORE8
    // 1. PUSH 0xAB (byte to store)
    // 2. PUSH 0x10 (memory offset)
    // 3. MSTORE8 (store 0xAB at offset 0x10)
    // 4. PUSH 0x10 (memory offset)
    // 5. MLOAD (load from offset 0x10)
    // Result should have 0xAB as the first byte followed by zeros
    const mstore8_bytecode = [_]u8{
        @intFromEnum(Opcode.PUSH1), 0xAB,                   // Push 0xAB
        @intFromEnum(Opcode.PUSH1), 0x10,                   // Push offset 0x10
        @intFromEnum(Opcode.MSTORE8),                       // Store byte at offset
        @intFromEnum(Opcode.PUSH1), 0x10,                   // Push offset 0x10
        @intFromEnum(Opcode.MLOAD),                         // Load from offset
    };
    
    // Create interpreter and execute the bytecode
    var interpreter = try Interpreter.init(testing.allocator, &mstore8_bytecode, 100000, 0);
    defer interpreter.deinit();
    
    const result = interpreter.execute();
    
    // Verify the result
    switch (result) {
        .Success => |success| {
            // The stack should have one value: 0xAB00000000000000000000000000000000000000000000000000000000000000
            try testing.expectEqual(@as(usize, 1), interpreter.stack.getSize());
            
            const expected = U256{ .words = .{ 0xAB00000000000000, 0, 0, 0 } };
            try testing.expectEqual(expected, try interpreter.stack.peek().*);
        },
        else => {
            try testing.expect(false); // This should not happen
        },
    }
}

/// Test executing bytecode containing MSIZE operation
test "MSIZE bytecode execution" {
    // Create bytecode for testing MSIZE
    // 1. PUSH 0xDEADBEEF (value to store)
    // 2. PUSH 0x20 (memory offset = 32 bytes)
    // 3. MSTORE (store 0xDEADBEEF at offset 0x20)
    // 4. MSIZE (get memory size)
    // Result should be 0x40 (64 bytes) since MSTORE writes 32 bytes starting at offset 32
    const msize_bytecode = [_]u8{
        @intFromEnum(Opcode.PUSH4), 0xDE, 0xAD, 0xBE, 0xEF, // Push 0xDEADBEEF
        @intFromEnum(Opcode.PUSH1), 0x20,                   // Push offset 0x20 (32)
        @intFromEnum(Opcode.MSTORE),                        // Store value at offset
        @intFromEnum(Opcode.MSIZE),                         // Get memory size
    };
    
    // Create interpreter and execute the bytecode
    var interpreter = try Interpreter.init(testing.allocator, &msize_bytecode, 100000, 0);
    defer interpreter.deinit();
    
    const result = interpreter.execute();
    
    // Verify the result
    switch (result) {
        .Success => |success| {
            // The stack should have one value: 0x40 (64)
            try testing.expectEqual(@as(usize, 1), interpreter.stack.getSize());
            try testing.expectEqual(U256.fromU64(64), try interpreter.stack.peek().*);
        },
        else => {
            try testing.expect(false); // This should not happen
        },
    }
}

/// Test executing bytecode containing MCOPY operation
test "MCOPY bytecode execution" {
    // Create bytecode for testing MCOPY
    // 1. PUSH 0xCAFEBABE (value to store at source)
    // 2. PUSH 0x00 (source offset)
    // 3. MSTORE (store 0xCAFEBABE at offset 0)
    // 4. PUSH 0x10 (length to copy = 16 bytes)
    // 5. PUSH 0x00 (source offset)
    // 6. PUSH 0x40 (destination offset = 64)
    // 7. MCOPY (copy from offset 0 to offset 64, length 16)
    // 8. PUSH 0x40 (offset to load from)
    // 9. MLOAD (load from offset 64)
    // Result should be first 16 bytes of 0xCAFEBABE (0xCAFEBABE000000000000000000000000)
    const mcopy_bytecode = [_]u8{
        @intFromEnum(Opcode.PUSH4), 0xCA, 0xFE, 0xBA, 0xBE, // Push 0xCAFEBABE
        @intFromEnum(Opcode.PUSH1), 0x00,                   // Push source offset 0
        @intFromEnum(Opcode.MSTORE),                        // Store value at offset
        @intFromEnum(Opcode.PUSH1), 0x10,                   // Push length 16
        @intFromEnum(Opcode.PUSH1), 0x00,                   // Push source offset 0
        @intFromEnum(Opcode.PUSH1), 0x40,                   // Push destination offset 64
        @intFromEnum(Opcode.MCOPY),                         // Copy memory
        @intFromEnum(Opcode.PUSH1), 0x40,                   // Push offset 64
        @intFromEnum(Opcode.MLOAD),                         // Load from offset
    };
    
    // Create interpreter and execute the bytecode
    var interpreter = try Interpreter.init(testing.allocator, &mcopy_bytecode, 100000, 0);
    defer interpreter.deinit();
    
    const result = interpreter.execute();
    
    // Verify the result
    switch (result) {
        .Success => |success| {
            // The stack should have one value with the copied data
            try testing.expectEqual(@as(usize, 1), interpreter.stack.getSize());
            
            // First 16 bytes of 0xCAFEBABE00000000 followed by zeros
            const expected = U256{ .words = .{ 0xCAFEBABE00000000, 0, 0, 0 } };
            try testing.expectEqual(expected, try interpreter.stack.peek().*);
        },
        else => {
            try testing.expect(false); // This should not happen
        },
    }
}

/// Test executing bytecode with gas costs for memory expansion
test "Memory expansion gas cost" {
    // Create bytecode that gradually expands memory with multiple MSTORE operations
    // 1. First store at offset 0x00 (expands to 32 bytes)
    // 2. Then store at offset 0x20 (expands to 64 bytes)
    // 3. Then store at offset 0x1000 (expands to 4128 bytes - significant gas increase)
    const memory_expansion_bytecode = [_]u8{
        // Store at offset 0
        @intFromEnum(Opcode.PUSH1), 0xFF,                   // Push dummy value
        @intFromEnum(Opcode.PUSH1), 0x00,                   // Push offset 0
        @intFromEnum(Opcode.MSTORE),                        // First memory expansion
        
        // Store at offset 32 (0x20)
        @intFromEnum(Opcode.PUSH1), 0xFF,                   // Push dummy value
        @intFromEnum(Opcode.PUSH1), 0x20,                   // Push offset 32
        @intFromEnum(Opcode.MSTORE),                        // Minor memory expansion
        
        // Store at offset 4096 (0x1000)
        @intFromEnum(Opcode.PUSH1), 0xFF,                   // Push dummy value
        @intFromEnum(Opcode.PUSH2), 0x10, 0x00,             // Push offset 4096
        @intFromEnum(Opcode.MSTORE),                        // Major memory expansion
        
        // Get final memory size
        @intFromEnum(Opcode.MSIZE),                         // Get memory size
    };
    
    // Create interpreter and execute the bytecode
    var interpreter = try Interpreter.init(testing.allocator, &memory_expansion_bytecode, 100000, 0);
    defer interpreter.deinit();
    
    const result = interpreter.execute();
    
    // Verify the result
    switch (result) {
        .Success => |success| {
            // The stack should have one value: 0x1020 (4128)
            try testing.expectEqual(@as(usize, 1), interpreter.stack.getSize());
            try testing.expectEqual(U256.fromU64(4128), try interpreter.stack.peek().*);
            
            // Gas usage should be significant due to memory expansion
            try testing.expect(success.gasUsed > 10000);
        },
        else => {
            try testing.expect(false); // This should not happen
        },
    }
}

/// Test for out-of-gas errors with excessive memory expansion
test "Memory expansion out of gas" {
    // Create bytecode that attempts a massive memory expansion that should trigger OOG
    // 1. Store at a very large offset like 0x7FFFFFF0
    // This would require expanding memory to almost 2^31 bytes
    // The quadratic gas cost formula should make this prohibitively expensive
    const oog_bytecode = [_]u8{
        @intFromEnum(Opcode.PUSH1), 0xFF,                   // Push dummy value
        @intFromEnum(Opcode.PUSH4), 0x7F, 0xFF, 0xFF, 0xF0, // Push large offset near 2^31
        @intFromEnum(Opcode.MSTORE),                        // Attempt large memory expansion
    };
    
    // Create interpreter with a low gas limit
    var interpreter = try Interpreter.init(testing.allocator, &oog_bytecode, 10000, 0);
    defer interpreter.deinit();
    
    const result = interpreter.execute();
    
    // Verify we got out of gas error
    switch (result) {
        .OutOfGas => {
            // This is the expected outcome
        },
        else => {
            try testing.expect(false); // Should have been OutOfGas
        },
    }
}