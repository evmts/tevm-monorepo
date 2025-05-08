//! Tests for storage operations in ZigEVM
//! This module verifies storage opcodes execution in the Interpreter

const std = @import("std");
const Interpreter = @import("../../interpreter/interpreter.zig").Interpreter;
const types = @import("../../util/types.zig");
const U256 = types.U256;
const Opcode = @import("../../opcodes/opcodes.zig").Opcode;

test "SLOAD and SSTORE operations" {
    // Create a program that stores a value then loads it back
    // PUSH1 0xAA (value to store)
    // PUSH1 0x01 (storage slot)
    // SSTORE (store value at slot)
    // PUSH1 0x01 (storage slot to load)
    // SLOAD (load value from slot)
    // PUSH1 0xAA (expected value)
    // EQ (check if loaded value matches expected)
    // PUSH1 0x00 (return offset)
    // MSTORE (store result at memory position 0)
    // PUSH1 0x20 (return size)
    // PUSH1 0x00 (return offset)
    // RETURN
    const bytecode = [_]u8{
        @intFromEnum(Opcode.PUSH1), 0xAA,  // PUSH1 0xAA
        @intFromEnum(Opcode.PUSH1), 0x01,  // PUSH1 0x01
        @intFromEnum(Opcode.SSTORE),       // SSTORE
        @intFromEnum(Opcode.PUSH1), 0x01,  // PUSH1 0x01
        @intFromEnum(Opcode.SLOAD),        // SLOAD
        @intFromEnum(Opcode.PUSH1), 0xAA,  // PUSH1 0xAA
        @intFromEnum(Opcode.EQ),           // EQ
        @intFromEnum(Opcode.PUSH1), 0x00,  // PUSH1 0x00
        @intFromEnum(Opcode.MSTORE),       // MSTORE
        @intFromEnum(Opcode.PUSH1), 0x20,  // PUSH1 0x20 (size)
        @intFromEnum(Opcode.PUSH1), 0x00,  // PUSH1 0x00 (offset)
        @intFromEnum(Opcode.RETURN),       // RETURN
    };
    
    var interpreter = try Interpreter.init(std.testing.allocator, &bytecode, 100000, 0);
    defer interpreter.deinit();
    
    const result = interpreter.execute();
    
    // Check execution result
    switch (result) {
        .Success => |success| {
            try std.testing.expect(success.gas_used > 0);
            try std.testing.expect(success.return_data.len == 32);
            
            // The return data should contain 1 (true) in the last byte position
            // because our EQ operation should have succeeded
            try std.testing.expect(success.return_data[31] == 1);
        },
        .Revert, .Error => |err| {
            std.debug.print("Error: {any}\n", .{err});
            try std.testing.expect(false); // This should not happen
        },
    }
}

test "SSTORE in static mode (should fail)" {
    // Create a program that attempts to modify storage in static mode
    // PUSH1 0xAA (value to store)
    // PUSH1 0x01 (storage slot)
    // SSTORE (store value at slot)
    const bytecode = [_]u8{
        @intFromEnum(Opcode.PUSH1), 0xAA,  // PUSH1 0xAA
        @intFromEnum(Opcode.PUSH1), 0x01,  // PUSH1 0x01
        @intFromEnum(Opcode.SSTORE),       // SSTORE
    };
    
    var interpreter = try Interpreter.init(std.testing.allocator, &bytecode, 100000, 0);
    defer interpreter.deinit();
    
    // Set static mode
    interpreter.is_static = true;
    
    const result = interpreter.execute();
    
    // Check execution result - should fail with StaticModeViolation
    switch (result) {
        .Success => {
            try std.testing.expect(false); // This should not happen
        },
        .Revert => {
            try std.testing.expect(false); // This should not happen
        },
        .Error => |err| {
            try std.testing.expectEqual(err.error_type, types.Error.StaticModeViolation);
        },
    }
}

test "Multiple storage operations" {
    // Create a program that performs multiple storage operations
    // PUSH1 0xAA (value to store in slot 1)
    // PUSH1 0x01 (storage slot 1)
    // SSTORE
    // PUSH1 0xBB (value to store in slot 2)
    // PUSH1 0x02 (storage slot 2)
    // SSTORE
    // PUSH1 0x01 (slot 1)
    // SLOAD (should give 0xAA)
    // PUSH1 0x02 (slot 2)
    // SLOAD (should give 0xBB)
    // ADD (0xAA + 0xBB = 0x165)
    // PUSH1 0x00 (memory position)
    // MSTORE
    // PUSH1 0x20 (return size)
    // PUSH1 0x00 (return offset)
    // RETURN
    const bytecode = [_]u8{
        @intFromEnum(Opcode.PUSH1), 0xAA,  // PUSH1 0xAA
        @intFromEnum(Opcode.PUSH1), 0x01,  // PUSH1 0x01
        @intFromEnum(Opcode.SSTORE),       // SSTORE
        @intFromEnum(Opcode.PUSH1), 0xBB,  // PUSH1 0xBB
        @intFromEnum(Opcode.PUSH1), 0x02,  // PUSH1 0x02
        @intFromEnum(Opcode.SSTORE),       // SSTORE
        @intFromEnum(Opcode.PUSH1), 0x01,  // PUSH1 0x01
        @intFromEnum(Opcode.SLOAD),        // SLOAD
        @intFromEnum(Opcode.PUSH1), 0x02,  // PUSH1 0x02
        @intFromEnum(Opcode.SLOAD),        // SLOAD
        @intFromEnum(Opcode.ADD),          // ADD
        @intFromEnum(Opcode.PUSH1), 0x00,  // PUSH1 0x00
        @intFromEnum(Opcode.MSTORE),       // MSTORE
        @intFromEnum(Opcode.PUSH1), 0x20,  // PUSH1 0x20 (size)
        @intFromEnum(Opcode.PUSH1), 0x00,  // PUSH1 0x00 (offset)
        @intFromEnum(Opcode.RETURN),       // RETURN
    };
    
    var interpreter = try Interpreter.init(std.testing.allocator, &bytecode, 100000, 0);
    defer interpreter.deinit();
    
    const result = interpreter.execute();
    
    // Check execution result
    switch (result) {
        .Success => |success| {
            try std.testing.expect(success.gas_used > 0);
            try std.testing.expect(success.return_data.len == 32);
            
            // The return data should contain the sum 0xAA + 0xBB = 0x165
            // Which in the last byte position would be 0x65
            try std.testing.expect(success.return_data[31] == 0x65);
            try std.testing.expect(success.return_data[30] == 0x01); // And 0x01 in the second-to-last
        },
        .Revert, .Error => |err| {
            std.debug.print("Error: {any}\n", .{err});
            try std.testing.expect(false); // This should not happen
        },
    }
}

test "Storage clearing (store zero)" {
    // Create a program that stores a value, clears it by storing zero,
    // then tries to load it (should give zero)
    // PUSH1 0xAA (value to store)
    // PUSH1 0x01 (storage slot)
    // SSTORE (store value at slot)
    // PUSH1 0x00 (zero value to store)
    // PUSH1 0x01 (same storage slot)
    // SSTORE (should clear the slot)
    // PUSH1 0x01 (storage slot to load)
    // SLOAD (load value from slot - should be zero)
    // PUSH1 0x00 (memory position)
    // MSTORE (store result at memory position 0)
    // PUSH1 0x20 (return size)
    // PUSH1 0x00 (return offset)
    // RETURN
    const bytecode = [_]u8{
        @intFromEnum(Opcode.PUSH1), 0xAA,  // PUSH1 0xAA
        @intFromEnum(Opcode.PUSH1), 0x01,  // PUSH1 0x01
        @intFromEnum(Opcode.SSTORE),       // SSTORE
        @intFromEnum(Opcode.PUSH1), 0x00,  // PUSH1 0x00
        @intFromEnum(Opcode.PUSH1), 0x01,  // PUSH1 0x01
        @intFromEnum(Opcode.SSTORE),       // SSTORE
        @intFromEnum(Opcode.PUSH1), 0x01,  // PUSH1 0x01
        @intFromEnum(Opcode.SLOAD),        // SLOAD
        @intFromEnum(Opcode.PUSH1), 0x00,  // PUSH1 0x00
        @intFromEnum(Opcode.MSTORE),       // MSTORE
        @intFromEnum(Opcode.PUSH1), 0x20,  // PUSH1 0x20 (size)
        @intFromEnum(Opcode.PUSH1), 0x00,  // PUSH1 0x00 (offset)
        @intFromEnum(Opcode.RETURN),       // RETURN
    };
    
    var interpreter = try Interpreter.init(std.testing.allocator, &bytecode, 100000, 0);
    defer interpreter.deinit();
    
    const result = interpreter.execute();
    
    // Check execution result
    switch (result) {
        .Success => |success| {
            try std.testing.expect(success.gas_used > 0);
            try std.testing.expect(success.return_data.len == 32);
            
            // The return data should be all zeros since the storage was cleared
            for (success.return_data) |byte| {
                try std.testing.expect(byte == 0);
            }
        },
        .Revert, .Error => |err| {
            std.debug.print("Error: {any}\n", .{err});
            try std.testing.expect(false); // This should not happen
        },
    }
}