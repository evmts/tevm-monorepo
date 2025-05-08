//! Test for stack and control flow operations in ZigEVM
//! Tests DUP, SWAP, JUMP, and JUMPI opcodes

const std = @import("std");
const types = @import("../../util/types.zig");
const U256 = types.U256;
const Error = types.Error;
const ExecutionResult = types.ExecutionResult;
const interpreter_mod = @import("../../interpreter/interpreter.zig");
const Interpreter = interpreter_mod.Interpreter;
const Opcode = @import("../../opcodes/opcodes.zig").Opcode;

test "Stack operations in EVM" {
    const allocator = std.testing.allocator;
    
    // Create a program that:
    // 1. Pushes several values onto the stack
    // 2. Uses DUP to duplicate items
    // 3. Uses SWAP to swap items
    // 4. Returns the final top item
    const bytecode = [_]u8{
        @intFromEnum(Opcode.PUSH1), 0x01,     // Push 0x01
        @intFromEnum(Opcode.PUSH1), 0x02,     // Push 0x02
        @intFromEnum(Opcode.PUSH1), 0x03,     // Push 0x03
        @intFromEnum(Opcode.PUSH1), 0x04,     // Push 0x04
        
        @intFromEnum(Opcode.DUP2),            // Duplicate 3rd item (0x02)
        @intFromEnum(Opcode.SWAP3),           // Swap top item with 4th item (0x01)
        
        @intFromEnum(Opcode.PUSH1), 0x00,     // Push 0x00 (memory offset)
        @intFromEnum(Opcode.MSTORE),          // Store value in memory
        
        @intFromEnum(Opcode.PUSH1), 0x20,     // Push 0x20 (size = 32 bytes)
        @intFromEnum(Opcode.PUSH1), 0x00,     // Push 0x00 (offset)
        @intFromEnum(Opcode.RETURN),          // Return the value
    };
    
    // Create an interpreter instance
    var interpreter = try Interpreter.init(allocator, &bytecode, 1000000, 0);
    defer interpreter.deinit();
    
    // Execute the program
    const result = interpreter.execute();
    
    // Check for successful execution
    switch (result) {
        .Success => |success| {
            // Verify return data size (should be 32 bytes)
            try std.testing.expectEqual(@as(usize, 32), success.return_data.len);
            
            // Verify return data contains 0x02 at the right position
            // In a U256, 0x02 should be located at byte offset 31
            try std.testing.expectEqual(@as(u8, 0x02), success.return_data[31]);
            
            // Verify gas usage is correct (should consume some gas)
            try std.testing.expect(success.gas_used > 0);
        },
        .Revert, .Error => {
            try std.testing.expect(false); // This should not happen
        },
    }
}

test "Control flow operations in EVM" {
    const allocator = std.testing.allocator;
    
    // Create a program that:
    // 0: PUSH1 0x01  (condition)
    // 2: PUSH1 0x0A  (destination)
    // 4: JUMPI       (jump if condition is non-zero)
    // 5: PUSH1 0xFF  (this will be skipped)
    // 7: PUSH1 0xFF  (this will be skipped)
    // 9: STOP
    // A: JUMPDEST    (jump target)
    // B: PUSH1 0x42  (value to return)
    // D: PUSH1 0x00  (memory position)
    // F: MSTORE      (store in memory)
    // 10: PUSH1 0x20 (size)
    // 12: PUSH1 0x00 (offset)
    // 14: RETURN
    const bytecode = [_]u8{
        @intFromEnum(Opcode.PUSH1), 0x01,     // Push 0x01 (true condition)
        @intFromEnum(Opcode.PUSH1), 0x0A,     // Push 0x0A (jump destination)
        @intFromEnum(Opcode.JUMPI),           // Jump if condition is non-zero
        @intFromEnum(Opcode.PUSH1), 0xFF,     // Push 0xFF (should be skipped)
        @intFromEnum(Opcode.PUSH1), 0xFF,     // Push 0xFF (should be skipped)
        @intFromEnum(Opcode.STOP),            // Stop (should be skipped)
        @intFromEnum(Opcode.JUMPDEST),        // Jump destination (0x0A)
        @intFromEnum(Opcode.PUSH1), 0x42,     // Push 0x42 (value to return)
        @intFromEnum(Opcode.PUSH1), 0x00,     // Push 0x00 (memory position)
        @intFromEnum(Opcode.MSTORE),          // Store 0x42 at position 0
        @intFromEnum(Opcode.PUSH1), 0x20,     // Push 0x20 (size = 32 bytes)
        @intFromEnum(Opcode.PUSH1), 0x00,     // Push 0x00 (offset)
        @intFromEnum(Opcode.RETURN),          // Return 0x42
    };
    
    // Create an interpreter instance
    var interpreter = try Interpreter.init(allocator, &bytecode, 1000000, 0);
    defer interpreter.deinit();
    
    // Execute the program
    const result = interpreter.execute();
    
    // Check for successful execution
    switch (result) {
        .Success => |success| {
            // Verify return data size (should be 32 bytes)
            try std.testing.expectEqual(@as(usize, 32), success.return_data.len);
            
            // Verify return data contains 0x42 at the right position
            // In a U256, 0x42 should be located at byte offset 31
            try std.testing.expectEqual(@as(u8, 0x42), success.return_data[31]);
            
            // Verify gas usage is correct (should consume some gas)
            try std.testing.expect(success.gas_used > 0);
        },
        .Revert, .Error => |err| {
            std.debug.print("Error: {}\n", .{err.error_type});
            try std.testing.expect(false); // This should not happen
        },
    }
}

test "Conditional jump taken and not taken" {
    const allocator = std.testing.allocator;
    
    // Create a program that:
    // First conditional jump with condition=0 (not taken)
    // 0: PUSH1 0x00  (false condition)
    // 2: PUSH1 0x0D  (destination to error path)
    // 4: JUMPI       (jump if condition is non-zero - should not jump)
    // 5: PUSH1 0x01  (true condition)
    // 7: PUSH1 0x12  (destination to success path)
    // 9: JUMPI       (jump if condition is non-zero - should jump)
    // A: PUSH1 0x00  (this should be skipped)
    // C: RETURN      (this should be skipped)
    // D: JUMPDEST    (error path)
    // E: PUSH1 0x00
    // 10: PUSH1 0x00
    // 12: REVERT     (this should be skipped)
    // 13: JUMPDEST   (success path)
    // 14: PUSH1 0x42 (success value)
    // 16: PUSH1 0x00 (memory position)
    // 18: MSTORE     (store in memory)
    // 19: PUSH1 0x20 (size)
    // 1B: PUSH1 0x00 (offset)
    // 1D: RETURN     (return success)
    const bytecode = [_]u8{
        // First conditional jump (not taken)
        @intFromEnum(Opcode.PUSH1), 0x00,     // 0: Push 0x00 (false condition)
        @intFromEnum(Opcode.PUSH1), 0x0D,     // 2: Push 0x0D (error path)
        @intFromEnum(Opcode.JUMPI),           // 4: Jump if condition - should not jump
        
        // Second conditional jump (taken)
        @intFromEnum(Opcode.PUSH1), 0x01,     // 5: Push 0x01 (true condition)
        @intFromEnum(Opcode.PUSH1), 0x13,     // 7: Push 0x13 (success path)
        @intFromEnum(Opcode.JUMPI),           // 9: Jump if condition - should jump
        
        // This code should be skipped by the jump
        @intFromEnum(Opcode.PUSH1), 0x00,     // A: Push 0x00
        @intFromEnum(Opcode.RETURN),          // C: Return (skipped)
        
        // Error path (should not be executed)
        @intFromEnum(Opcode.JUMPDEST),        // D: JUMPDEST for error path
        @intFromEnum(Opcode.PUSH1), 0x00,     // E: Push 0x00
        @intFromEnum(Opcode.PUSH1), 0x00,     // 10: Push 0x00
        @intFromEnum(Opcode.REVERT),          // 12: Revert (should not happen)
        
        // Success path
        @intFromEnum(Opcode.JUMPDEST),        // 13: JUMPDEST for success path
        @intFromEnum(Opcode.PUSH1), 0x42,     // 14: Push 0x42 (success value)
        @intFromEnum(Opcode.PUSH1), 0x00,     // 16: Push 0x00 (memory position)
        @intFromEnum(Opcode.MSTORE),          // 18: Store 0x42 at position 0
        @intFromEnum(Opcode.PUSH1), 0x20,     // 19: Push 0x20 (size = 32 bytes)
        @intFromEnum(Opcode.PUSH1), 0x00,     // 1B: Push 0x00 (offset)
        @intFromEnum(Opcode.RETURN),          // 1D: Return 0x42
    };
    
    // Create an interpreter instance
    var interpreter = try Interpreter.init(allocator, &bytecode, 1000000, 0);
    defer interpreter.deinit();
    
    // Execute the program
    const result = interpreter.execute();
    
    // Check for successful execution
    switch (result) {
        .Success => |success| {
            // Verify return data size (should be 32 bytes)
            try std.testing.expectEqual(@as(usize, 32), success.return_data.len);
            
            // Verify return data contains 0x42 at the right position
            // In a U256, 0x42 should be located at byte offset 31
            try std.testing.expectEqual(@as(u8, 0x42), success.return_data[31]);
            
            // Verify gas usage is correct (should consume some gas)
            try std.testing.expect(success.gas_used > 0);
        },
        .Revert => {
            try std.testing.expect(false); // This should not happen
        },
        .Error => |err| {
            std.debug.print("Error: {}\n", .{err.error_type});
            try std.testing.expect(false); // This should not happen
        },
    }
}