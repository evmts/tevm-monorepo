//! Tests for storage operations in ZigEVM
//! This module provides tests for SLOAD and SSTORE opcodes, including gas costs,
//! refunds, static mode violations, and warm/cold access tracking.

const std = @import("std");
const Interpreter = @import("../../interpreter/interpreter.zig").Interpreter;
const CallContext = @import("../../interpreter/call_frame.zig").CallContext;
const types = @import("../../util/types.zig");
const U256 = types.U256;
const Error = types.Error;
const Opcode = @import("../../opcodes/opcodes.zig").Opcode;
const StorageGasCosts = @import("../../opcodes/storage.zig").StorageGasCosts;

/// Helper to create a bytecode program for testing
fn makeProgram(program: []const u8) ![]u8 {
    const result = try std.testing.allocator.dupe(u8, program);
    return result;
}

/// Helper to create interpreter, run code, and clean up
fn runProgram(code: []const u8, context: ?CallContext) !Interpreter.ExecutionResult {
    var interpreter = try Interpreter.init(std.testing.allocator, code, 100000, 0);
    defer interpreter.deinit();

    // If a call context is provided, use it
    if (context) |ctx| {
        interpreter.call_context = ctx;
    }

    return interpreter.execute();
}

/// Tests a basic SLOAD and SSTORE sequence
test "Basic storage operations" {
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
    
    const program = try makeProgram(&bytecode);
    defer std.testing.allocator.free(program);
    
    const result = try runProgram(program, null);
    
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

/// Tests static mode violations (attempting to SSTORE in static mode)
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
    
    const program = try makeProgram(&bytecode);
    defer std.testing.allocator.free(program);
    
    // Create a call context with static mode enabled
    const context = CallContext{
        .is_static = true,
        .address = undefined,
        .caller = undefined,
        .value = U256.zero(),
        .data = &[_]u8{},
        .gas = 100000,
    };
    
    const result = try runProgram(program, context);
    
    // Check execution result - should fail with StaticStateChange
    switch (result) {
        .Success => {
            try std.testing.expect(false); // This should not happen
        },
        .Revert => {
            try std.testing.expect(false); // This should not happen
        },
        .Error => |err| {
            // StaticStateChange was renamed to StaticModeViolation in the implementation
            try std.testing.expectEqual(err.error_type, Error.StaticStateChange);
        },
    }
}

/// Tests multiple storage operations in a single execution
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
    
    const program = try makeProgram(&bytecode);
    defer std.testing.allocator.free(program);
    
    const result = try runProgram(program, null);
    
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

/// Tests storage clearing operations (storing zero)
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
    
    const program = try makeProgram(&bytecode);
    defer std.testing.allocator.free(program);
    
    const result = try runProgram(program, null);
    
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

/// Tests gas costs of SSTORE operation
test "SSTORE gas costs" {
    const gas_costs = StorageGasCosts{};
    
    // Case 1: Store a non-zero value in a previously empty slot
    // PUSH1 0xAA (value to store)
    // PUSH1 0x01 (storage slot)
    // SSTORE
    // PUSH1 0x01 (return success)
    // PUSH1 0x00 (memory offset)
    // MSTORE
    // PUSH1 0x20 (return size)
    // PUSH1 0x00 (memory offset)
    // RETURN
    const bytecode1 = [_]u8{
        @intFromEnum(Opcode.PUSH1), 0xAA,  // PUSH1 0xAA
        @intFromEnum(Opcode.PUSH1), 0x01,  // PUSH1 0x01
        @intFromEnum(Opcode.SSTORE),       // SSTORE
        @intFromEnum(Opcode.PUSH1), 0x01,  // PUSH1 0x01 (success)
        @intFromEnum(Opcode.PUSH1), 0x00,  // PUSH1 0x00
        @intFromEnum(Opcode.MSTORE),       // MSTORE
        @intFromEnum(Opcode.PUSH1), 0x20,  // PUSH1 0x20
        @intFromEnum(Opcode.PUSH1), 0x00,  // PUSH1 0x00
        @intFromEnum(Opcode.RETURN),       // RETURN
    };
    
    const program1 = try makeProgram(&bytecode1);
    defer std.testing.allocator.free(program1);
    
    const result1 = try runProgram(program1, null);
    
    switch (result1) {
        .Success => |success| {
            // Expected gas: 
            // 3 for PUSH1 0xAA
            // 3 for PUSH1 0x01
            // Cold SLOAD (2100) + SSTORE_SET (20000) for SSTORE (cold zero->nonzero)
            // + remaining operations
            // This is an approximation since there are many other factors
            const minimum_gas = gas_costs.cold_sload + gas_costs.sstore_set + 20;
            try std.testing.expect(success.gas_used >= minimum_gas);
            
            // Verify operation succeeded
            try std.testing.expect(success.return_data[31] == 1);
        },
        .Revert, .Error => |err| {
            std.debug.print("Error: {any}\n", .{err});
            try std.testing.expect(false); // This should not happen
        },
    }
    
    // Case 2: Store a different non-zero value in a non-zero slot (warm access)
    // First store 0xAA in slot 1, then store 0xBB in same slot
    const bytecode2 = [_]u8{
        @intFromEnum(Opcode.PUSH1), 0xAA,  // PUSH1 0xAA
        @intFromEnum(Opcode.PUSH1), 0x01,  // PUSH1 0x01
        @intFromEnum(Opcode.SSTORE),       // SSTORE (cold)
        @intFromEnum(Opcode.PUSH1), 0xBB,  // PUSH1 0xBB
        @intFromEnum(Opcode.PUSH1), 0x01,  // PUSH1 0x01 (same slot)
        @intFromEnum(Opcode.SSTORE),       // SSTORE (warm)
        @intFromEnum(Opcode.PUSH1), 0x01,  // PUSH1 0x01 (success)
        @intFromEnum(Opcode.PUSH1), 0x00,  // PUSH1 0x00
        @intFromEnum(Opcode.MSTORE),       // MSTORE
        @intFromEnum(Opcode.PUSH1), 0x20,  // PUSH1 0x20
        @intFromEnum(Opcode.PUSH1), 0x00,  // PUSH1 0x00
        @intFromEnum(Opcode.RETURN),       // RETURN
    };
    
    const program2 = try makeProgram(&bytecode2);
    defer std.testing.allocator.free(program2);
    
    const result2 = try runProgram(program2, null);
    
    switch (result2) {
        .Success => |success| {
            try std.testing.expect(success.gas_used > 0);
            try std.testing.expect(success.return_data[31] == 1);
        },
        .Revert, .Error => |err| {
            std.debug.print("Error: {any}\n", .{err});
            try std.testing.expect(false); // This should not happen
        },
    }
}

/// Tests gas refunds when clearing storage
test "SSTORE gas refunds" {
    // Program that:
    // 1. Sets slot 1 to 0xAA (non-zero value)
    // 2. Sets slot 1 to 0x00 (clearing, which should generate refund)
    // 3. Returns the gas refund as part of its return data for verification
    const bytecode = [_]u8{
        @intFromEnum(Opcode.PUSH1), 0xAA,  // PUSH1 0xAA
        @intFromEnum(Opcode.PUSH1), 0x01,  // PUSH1 0x01
        @intFromEnum(Opcode.SSTORE),       // SSTORE (store non-zero)
        @intFromEnum(Opcode.PUSH1), 0x00,  // PUSH1 0x00
        @intFromEnum(Opcode.PUSH1), 0x01,  // PUSH1 0x01
        @intFromEnum(Opcode.SSTORE),       // SSTORE (clear - should generate refund)
        @intFromEnum(Opcode.PUSH1), 0x01,  // PUSH1 0x01 (success)
        @intFromEnum(Opcode.PUSH1), 0x00,  // PUSH1 0x00
        @intFromEnum(Opcode.MSTORE),       // MSTORE
        @intFromEnum(Opcode.PUSH1), 0x20,  // PUSH1 0x20
        @intFromEnum(Opcode.PUSH1), 0x00,  // PUSH1 0x00
        @intFromEnum(Opcode.RETURN),       // RETURN
    };
    
    const program = try makeProgram(&bytecode);
    defer std.testing.allocator.free(program);
    
    var interpreter = try Interpreter.init(std.testing.allocator, program, 100000, 0);
    defer interpreter.deinit();
    
    const result = interpreter.execute();
    
    // We need to check for a gas refund in the interpreter state
    switch (result) {
        .Success => |success| {
            try std.testing.expect(success.gas_used > 0);
            try std.testing.expect(success.return_data[31] == 1); // Verify execution succeeded
            
            // Check that a refund was generated (this is implicit since the execution succeeded,
            // but in a more complex test we'd verify the exact refund amount)
            const refund = interpreter.gas_refund;
            try std.testing.expect(refund > 0);
            
            // The refund should be at least sstore_clears_refund (15000)
            try std.testing.expect(refund >= StorageGasCosts{}.sstore_clears_refund);
        },
        .Revert, .Error => |err| {
            std.debug.print("Error: {any}\n", .{err});
            try std.testing.expect(false); // This should not happen
        },
    }
}

/// Tests warm vs cold storage access gas costs
test "Warm vs cold storage access" {
    // Program that:
    // 1. Loads from slot 1 (cold access)
    // 2. Loads from slot 1 again (warm access)
    // 3. Loads from slot 2 (cold access)
    // We'll measure gas consumption to verify warm/cold costs are applied correctly
    const bytecode = [_]u8{
        @intFromEnum(Opcode.PUSH1), 0x01,  // PUSH1 0x01 (slot 1)
        @intFromEnum(Opcode.SLOAD),        // SLOAD (cold access)
        @intFromEnum(Opcode.POP),          // POP (discard result)
        @intFromEnum(Opcode.PUSH1), 0x01,  // PUSH1 0x01 (slot 1 again)
        @intFromEnum(Opcode.SLOAD),        // SLOAD (warm access)
        @intFromEnum(Opcode.POP),          // POP (discard result)
        @intFromEnum(Opcode.PUSH1), 0x02,  // PUSH1 0x02 (slot 2)
        @intFromEnum(Opcode.SLOAD),        // SLOAD (cold access)
        @intFromEnum(Opcode.POP),          // POP (discard result)
        @intFromEnum(Opcode.PUSH1), 0x01,  // PUSH1 0x01 (success)
        @intFromEnum(Opcode.PUSH1), 0x00,  // PUSH1 0x00
        @intFromEnum(Opcode.MSTORE),       // MSTORE
        @intFromEnum(Opcode.PUSH1), 0x20,  // PUSH1 0x20
        @intFromEnum(Opcode.PUSH1), 0x00,  // PUSH1 0x00
        @intFromEnum(Opcode.RETURN),       // RETURN
    };
    
    const program = try makeProgram(&bytecode);
    defer std.testing.allocator.free(program);
    
    var interpreter = try Interpreter.init(std.testing.allocator, program, 100000, 0);
    defer interpreter.deinit();
    
    // Gas checkpoints for analyzing warm/cold costs
    const starting_gas = interpreter.gas_left;
    
    // Execute first instruction (PUSH1 0x01)
    _ = try interpreter.executeNextInstruction();
    
    // Execute SLOAD (first access to slot 1 - should be cold)
    _ = try interpreter.executeNextInstruction();
    const after_first_sload = interpreter.gas_left;
    const first_sload_cost = starting_gas - (after_first_sload + 3); // 3 gas for the PUSH1
    
    // Execute POP
    _ = try interpreter.executeNextInstruction();
    
    // Execute PUSH1 0x01 again
    _ = try interpreter.executeNextInstruction();
    
    // Execute SLOAD again (second access to slot 1 - should be warm)
    _ = try interpreter.executeNextInstruction();
    const after_second_sload = interpreter.gas_left;
    const second_sload_cost = after_first_sload - (after_second_sload + 3 + 3); // 3 for POP, 3 for PUSH1
    
    // The first SLOAD should be cold (2100 gas)
    // The second SLOAD should be warm (100 gas)
    try std.testing.expect(first_sload_cost == StorageGasCosts{}.cold_sload);
    try std.testing.expect(second_sload_cost == StorageGasCosts{}.warm_sload);
    
    // Continue execution to verify the program completes successfully
    const result = interpreter.execute();
    switch (result) {
        .Success => |success| {
            try std.testing.expect(success.return_data[31] == 1); // Verify execution succeeded
        },
        .Revert, .Error => |err| {
            std.debug.print("Error: {any}\n", .{err});
            try std.testing.expect(false); // This should not happen
        },
    }
}

/// Tests out of gas scenarios for storage operations
test "Storage operations out of gas" {
    // Program with minimal gas that should run out during storage operations
    
    // First test SLOAD out of gas
    const sload_bytecode = [_]u8{
        @intFromEnum(Opcode.PUSH1), 0x01,  // PUSH1 0x01 (slot)
        @intFromEnum(Opcode.SLOAD),        // SLOAD (requires 2100 gas for cold access)
    };
    
    const sload_program = try makeProgram(&sload_bytecode);
    defer std.testing.allocator.free(sload_program);
    
    // Initialize with just enough gas for the PUSH but not enough for cold SLOAD
    var interpreter_sload = try Interpreter.init(std.testing.allocator, sload_program, 2000, 0);
    defer interpreter_sload.deinit();
    
    const sload_result = interpreter_sload.execute();
    
    // Should fail with OutOfGas
    switch (sload_result) {
        .Success => {
            try std.testing.expect(false); // This should not happen
        },
        .Revert => {
            try std.testing.expect(false); // This should not happen
        },
        .Error => |err| {
            try std.testing.expectEqual(err.error_type, Error.OutOfGas);
        },
    }
    
    // Now test SSTORE out of gas
    const sstore_bytecode = [_]u8{
        @intFromEnum(Opcode.PUSH1), 0xAA,  // PUSH1 0xAA (value)
        @intFromEnum(Opcode.PUSH1), 0x01,  // PUSH1 0x01 (slot)
        @intFromEnum(Opcode.SSTORE),       // SSTORE (requires ~22100 gas for cold access, zero->nonzero)
    };
    
    const sstore_program = try makeProgram(&sstore_bytecode);
    defer std.testing.allocator.free(sstore_program);
    
    // Initialize with enough gas for the PUSHes but not enough for SSTORE
    var interpreter_sstore = try Interpreter.init(std.testing.allocator, sstore_program, 10000, 0);
    defer interpreter_sstore.deinit();
    
    const sstore_result = interpreter_sstore.execute();
    
    // Should fail with OutOfGas
    switch (sstore_result) {
        .Success => {
            try std.testing.expect(false); // This should not happen
        },
        .Revert => {
            try std.testing.expect(false); // This should not happen
        },
        .Error => |err| {
            try std.testing.expectEqual(err.error_type, Error.OutOfGas);
        },
    }
}

/// Tests storage access tracking reset between transactions
test "Storage access tracking reset" {
    // First transaction: access slot 1 (making it warm)
    const tx1_bytecode = [_]u8{
        @intFromEnum(Opcode.PUSH1), 0x01,  // PUSH1 0x01 (slot)
        @intFromEnum(Opcode.SLOAD),        // SLOAD (cold access)
        @intFromEnum(Opcode.POP),          // POP (discard result)
        @intFromEnum(Opcode.PUSH1), 0x01,  // PUSH1 0x01 (success)
        @intFromEnum(Opcode.PUSH1), 0x00,  // PUSH1 0x00
        @intFromEnum(Opcode.MSTORE),       // MSTORE
        @intFromEnum(Opcode.PUSH1), 0x20,  // PUSH1 0x20
        @intFromEnum(Opcode.PUSH1), 0x00,  // PUSH1 0x00
        @intFromEnum(Opcode.RETURN),       // RETURN
    };
    
    const tx1_program = try makeProgram(&tx1_bytecode);
    defer std.testing.allocator.free(tx1_program);
    
    // Execute first transaction
    var interpreter = try Interpreter.init(std.testing.allocator, tx1_program, 100000, 0);
    defer interpreter.deinit();
    
    const gas_before_tx1 = interpreter.gas_left;
    const tx1_result = interpreter.execute();
    
    // Verify tx1 completed successfully
    switch (tx1_result) {
        .Success => |success| {
            try std.testing.expect(success.return_data[31] == 1);
        },
        .Revert, .Error => |err| {
            std.debug.print("Error: {any}\n", .{err});
            try std.testing.expect(false); // This should not happen
        },
    }
    
    // Record gas used in tx1
    const tx1_gas_used = gas_before_tx1 - interpreter.gas_left;
    
    // Now reset interpreter and simulate a new transaction
    // This should reset warm access tracking, making slot 1 cold again
    interpreter.resetState();
    
    // Second transaction: access the same slot again, should be cold
    const tx2_bytecode = [_]u8{
        @intFromEnum(Opcode.PUSH1), 0x01,  // PUSH1 0x01 (same slot)
        @intFromEnum(Opcode.SLOAD),        // SLOAD (should be cold again)
        @intFromEnum(Opcode.POP),          // POP (discard result)
        @intFromEnum(Opcode.PUSH1), 0x01,  // PUSH1 0x01 (success)
        @intFromEnum(Opcode.PUSH1), 0x00,  // PUSH1 0x00
        @intFromEnum(Opcode.MSTORE),       // MSTORE
        @intFromEnum(Opcode.PUSH1), 0x20,  // PUSH1 0x20
        @intFromEnum(Opcode.PUSH1), 0x00,  // PUSH1 0x00
        @intFromEnum(Opcode.RETURN),       // RETURN
    };
    
    // Update bytecode (keep the same interpreter for comparison)
    interpreter.updateBytecode(tx2_bytecode);
    
    // Reset gas to initial value
    interpreter.gas_left = 100000;
    
    const gas_before_tx2 = interpreter.gas_left;
    const tx2_result = interpreter.execute();
    
    // Verify tx2 completed successfully
    switch (tx2_result) {
        .Success => |success| {
            try std.testing.expect(success.return_data[31] == 1);
        },
        .Revert, .Error => |err| {
            std.debug.print("Error: {any}\n", .{err});
            try std.testing.expect(false); // This should not happen
        },
    }
    
    // Record gas used in tx2
    const tx2_gas_used = gas_before_tx2 - interpreter.gas_left;
    
    // Verify gas usage is similar between tx1 and tx2
    // This indicates both had cold accesses to storage
    const tx_gas_diff = if (tx1_gas_used > tx2_gas_used) tx1_gas_used - tx2_gas_used else tx2_gas_used - tx1_gas_used;
    try std.testing.expect(tx_gas_diff < 100); // Allow small variations in gas usage
}