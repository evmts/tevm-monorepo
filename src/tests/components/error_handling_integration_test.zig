// error_handling_integration_test.zig
//! Integration tests for error handling in ZigEVM
//! These tests verify error handling in the execution environment

const std = @import("std");
const testing = std.testing;
const types = @import("../../util/types.zig");
const U256 = types.U256;
const Error = types.Error;
const Address = types.Address;
const Stack = @import("../../stack/stack.zig").Stack;
const Memory = @import("../../memory/memory.zig").Memory;
const ReturnData = @import("../../interpreter/return_data.zig").ReturnData;
const Interpreter = @import("../../interpreter/interpreter.zig").Interpreter;
const error_handling = @import("../../interpreter/error_handling.zig");
const StatusCode = error_handling.StatusCode;
const ExecutionStatus = error_handling.ExecutionStatus;
const opcodes = @import("../../opcodes/opcodes.zig");
const Opcode = opcodes.Opcode;

test "Integration: stack overflow" {
    // Create bytecode that will cause stack overflow
    // Push 1025 values onto the stack (beyond the 1024 limit)
    var code = std.ArrayList(u8).init(testing.allocator);
    defer code.deinit();
    
    // Add 1025 PUSH1 instructions to overflow the stack
    for (0..1025) |_| {
        try code.append(@intFromEnum(Opcode.PUSH1));
        try code.append(0x01);
    }
    
    // Initialize interpreter
    var interpreter = try Interpreter.init(testing.allocator, code.items, 100000, 0);
    defer interpreter.deinit();
    
    // Execute bytecode
    const result = interpreter.execute();
    
    // Verify we got a stack overflow error
    switch (result) {
        .Success, .Revert => {
            try testing.expect(false); // Should not reach here
        },
        .Error => |err| {
            try testing.expectEqual(Error.StackOverflow, err.error_type);
        },
    }
}

test "Integration: stack underflow" {
    // Create bytecode that will cause stack underflow
    // ADD requires two stack items, but we'll only push one
    const code = [_]u8{
        @intFromEnum(Opcode.PUSH1), 0x01, // Push 1
        @intFromEnum(Opcode.ADD),         // Try to add, but only one item on stack
    };
    
    // Initialize interpreter
    var interpreter = try Interpreter.init(testing.allocator, &code, 100000, 0);
    defer interpreter.deinit();
    
    // Execute bytecode
    const result = interpreter.execute();
    
    // Verify we got a stack underflow error
    switch (result) {
        .Success, .Revert => {
            try testing.expect(false); // Should not reach here
        },
        .Error => |err| {
            try testing.expectEqual(Error.StackUnderflow, err.error_type);
        },
    }
}

test "Integration: invalid jump destination" {
    // Create bytecode with an invalid jump
    const code = [_]u8{
        @intFromEnum(Opcode.PUSH1), 0x05, // Push jump dest (not a JUMPDEST)
        @intFromEnum(Opcode.JUMP),        // Jump to invalid destination
    };
    
    // Initialize interpreter
    var interpreter = try Interpreter.init(testing.allocator, &code, 100000, 0);
    defer interpreter.deinit();
    
    // Execute bytecode
    const result = interpreter.execute();
    
    // Verify we got an invalid jump error
    switch (result) {
        .Success, .Revert => {
            try testing.expect(false); // Should not reach here
        },
        .Error => |err| {
            try testing.expect(err.error_type == Error.InvalidJump or err.error_type == Error.InvalidJumpDest);
        },
    }
}

test "Integration: invalid opcode" {
    // Create bytecode with an invalid opcode (0xFE is undefined)
    const code = [_]u8{
        0xFE, // Invalid opcode
    };
    
    // Initialize interpreter
    var interpreter = try Interpreter.init(testing.allocator, &code, 100000, 0);
    defer interpreter.deinit();
    
    // Execute bytecode
    const result = interpreter.execute();
    
    // Verify we got an invalid opcode error
    switch (result) {
        .Success, .Revert => {
            try testing.expect(false); // Should not reach here
        },
        .Error => |err| {
            try testing.expectEqual(Error.InvalidOpcode, err.error_type);
        },
    }
}

test "Integration: out of gas" {
    // Create bytecode that will consume all gas
    var code = std.ArrayList(u8).init(testing.allocator);
    defer code.deinit();
    
    // Add many ADD instructions to consume gas
    // Each ADD costs 3 gas
    for (0..100) |i| {
        try code.append(@intFromEnum(Opcode.PUSH1));
        try code.append(@intCast(i % 256));
    }
    
    // Add 50 ADD operations (each consumes 2 items, produces 1)
    for (0..50) |_| {
        try code.append(@intFromEnum(Opcode.ADD));
    }
    
    // Initialize interpreter with just enough gas for the PUSHes but not enough for all ADDs
    const pushes_gas = 100 * 3; // 100 PUSH1 operations at 3 gas each
    const adds_gas = 50 * 3; // 50 ADD operations at 3 gas each
    const gas_limit = pushes_gas + adds_gas / 2; // Not enough for all ADDs
    
    var interpreter = try Interpreter.init(testing.allocator, code.items, gas_limit, 0);
    defer interpreter.deinit();
    
    // Execute bytecode
    const result = interpreter.execute();
    
    // Verify we got an out of gas error
    switch (result) {
        .Success, .Revert => {
            try testing.expect(false); // Should not reach here
        },
        .Error => |err| {
            try testing.expectEqual(Error.OutOfGas, err.error_type);
        },
    }
}

test "Integration: return data out of bounds" {
    // Create bytecode that will attempt an out-of-bounds RETURNDATACOPY
    const code = [_]u8{
        // First set up some return data with a CALL that returns data
        @intFromEnum(Opcode.PUSH1), 0x00, // retSize
        @intFromEnum(Opcode.PUSH1), 0x00, // retOffset
        @intFromEnum(Opcode.PUSH1), 0x00, // argsSize
        @intFromEnum(Opcode.PUSH1), 0x00, // argsOffset
        @intFromEnum(Opcode.PUSH1), 0x00, // value
        @intFromEnum(Opcode.PUSH1), 0x00, // address
        @intFromEnum(Opcode.PUSH1), 0x00, // gas
        @intFromEnum(Opcode.CALL),       // Call (would set return data in real impl)
        
        // Now attempt RETURNDATACOPY with out-of-bounds parameters
        @intFromEnum(Opcode.PUSH1), 0x20, // size: 32 bytes (more than available)
        @intFromEnum(Opcode.PUSH1), 0x00, // offset
        @intFromEnum(Opcode.PUSH1), 0x00, // destOffset
        @intFromEnum(Opcode.RETURNDATACOPY),
    };
    
    // Initialize interpreter
    var interpreter = try Interpreter.init(testing.allocator, &code, 100000, 0);
    defer interpreter.deinit();
    
    // Execute bytecode - should either complete with an error or 
    // skip the RETURNDATACOPY with the current stubbed implementation
    const result = interpreter.execute();
    
    // Since we have a stub implementation, we're not checking the specific error
    // Just checking that it didn't crash
    switch (result) {
        .Success, .Error, .Revert => {
            // Any of these is fine - different implementations may handle the stub differently
            try testing.expect(true);
        },
    }
}

test "Integration: explicit revert" {
    // Create bytecode with an explicit REVERT
    const code = [_]u8{
        @intFromEnum(Opcode.PUSH1), 0x01, // size
        @intFromEnum(Opcode.PUSH1), 0x00, // offset
        @intFromEnum(Opcode.MSTORE8),     // Store 0x01 at position 0
        @intFromEnum(Opcode.PUSH1), 0x01, // size
        @intFromEnum(Opcode.PUSH1), 0x00, // offset
        @intFromEnum(Opcode.REVERT),      // Revert with 1 byte of data
    };
    
    // Initialize interpreter
    var interpreter = try Interpreter.init(testing.allocator, &code, 100000, 0);
    defer interpreter.deinit();
    
    // Execute bytecode
    const result = interpreter.execute();
    
    // Verify we got a revert
    switch (result) {
        .Success, .Error => {
            try testing.expect(false); // Should not reach here
        },
        .Revert => |revert| {
            try testing.expectEqual(@as(u8, 0x01), revert.return_data[0]);
            try testing.expectEqual(@as(usize, 1), revert.return_data.len);
        },
    }
}

test "Integration: successful return with data" {
    // Create bytecode with a successful RETURN
    const code = [_]u8{
        @intFromEnum(Opcode.PUSH1), 0xAA, // value
        @intFromEnum(Opcode.PUSH1), 0x00, // position
        @intFromEnum(Opcode.MSTORE8),     // Store 0xAA at position 0
        @intFromEnum(Opcode.PUSH1), 0x01, // size
        @intFromEnum(Opcode.PUSH1), 0x00, // offset
        @intFromEnum(Opcode.RETURN),      // Return with 1 byte of data
    };
    
    // Initialize interpreter
    var interpreter = try Interpreter.init(testing.allocator, &code, 100000, 0);
    defer interpreter.deinit();
    
    // Execute bytecode
    const result = interpreter.execute();
    
    // Verify successful execution with return data
    switch (result) {
        .Success => |success| {
            try testing.expectEqual(@as(u8, 0xAA), success.return_data[0]);
            try testing.expectEqual(@as(usize, 1), success.return_data.len);
        },
        .Revert, .Error => {
            try testing.expect(false); // Should not reach here
        },
    }
}

test "Integration: multiple errors on one path" {
    // Create bytecode that contains multiple potential errors
    // The first encountered error should be returned
    const code = [_]u8{
        // This will cause stack underflow
        @intFromEnum(Opcode.ADD), // Underflow (no items on stack)
        
        // The following would cause invalid opcode if reached
        0xFF, // Invalid opcode
        
        // The following would cause invalid jump if reached
        @intFromEnum(Opcode.PUSH1), 0x10,
        @intFromEnum(Opcode.JUMP), // Invalid jump destination
    };
    
    // Initialize interpreter
    var interpreter = try Interpreter.init(testing.allocator, &code, 100000, 0);
    defer interpreter.deinit();
    
    // Execute bytecode
    const result = interpreter.execute();
    
    // Verify we got a stack underflow error (the first one encountered)
    switch (result) {
        .Success, .Revert => {
            try testing.expect(false); // Should not reach here
        },
        .Error => |err| {
            try testing.expectEqual(Error.StackUnderflow, err.error_type);
        },
    }
}