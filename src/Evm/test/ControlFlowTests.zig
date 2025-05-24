const std = @import("std");
const testing = std.testing;
const EvmTest = @import("EvmTestHelpers.zig").EvmTest;
const helpers = @import("EvmTestHelpers.zig");
const opcodes = @import("../opcodes.zig");
const interpreter = @import("../interpreter.zig");

const Opcode = opcodes.Opcode;

// Test basic control flow operations
test "simple jump" {
    var evm_test = try EvmTest.init(testing.allocator);
    defer evm_test.deinit();
    
    // Test: JUMP to a valid destination
    {
        // Code: PUSH1 0x05, JUMP, PUSH1 0xFF, JUMPDEST, PUSH1 0x42, PUSH1 0x00, MSTORE, PUSH1 0x20, PUSH1 0x00, RETURN
        // This jumps past the 0xFF push directly to the 0x42 push
        const code = 
            helpers.push(5) ++ // Target JUMPDEST offset
            &[_]u8{@intFromEnum(Opcode.JUMP)} ++
            helpers.push(0xFF) ++ // This should be skipped
            &[_]u8{@intFromEnum(Opcode.JUMPDEST)} ++ 
            helpers.push(0x42) ++ 
            helpers.push(0) ++ 
            &[_]u8{@intFromEnum(Opcode.MSTORE)} ++
            helpers.ret(0, 32);
            
        try evm_test.execute(100, code, &[_]u8{});
        
        const result = evm_test.result.?;
        try testing.expectEqual(@as(?interpreter.InterpreterError, null), result.status);
        try testing.expectEqual(@as(u64, 32), result.output.?.len);
        
        // Check that the value 0x42 was stored
        try testing.expectEqual(@as(u8, 0x42), result.output.?[31]);
    }
}

// Test invalid jump destinations
test "invalid jump" {
    var evm_test = try EvmTest.init(testing.allocator);
    defer evm_test.deinit();
    
    // Test: Jump to a non-JUMPDEST instruction
    {
        // Code: PUSH1 0x02, JUMP (jumps to the 0x03 in PUSH1 0x03, which is not a JUMPDEST)
        const code = 
            helpers.push(2) ++ 
            &[_]u8{@intFromEnum(Opcode.JUMP)} ++
            helpers.push(3);
            
        try evm_test.execute(100, code, &[_]u8{});
        
        const result = evm_test.result.?;
        try testing.expectEqual(interpreter.InterpreterError.InvalidJump, result.status.?);
    }
    
    // Test: Jump to a destination outside code bounds
    {
        // Code: PUSH1 0x20, JUMP (jumps past the end of the code)
        const code = 
            helpers.push(32) ++ 
            &[_]u8{@intFromEnum(Opcode.JUMP)};
            
        try evm_test.execute(100, code, &[_]u8{});
        
        const result = evm_test.result.?;
        try testing.expectEqual(interpreter.InterpreterError.InvalidJump, result.status.?);
    }
}

// Test conditional jumps
test "conditional jump" {
    var evm_test = try EvmTest.init(testing.allocator);
    defer evm_test.deinit();
    
    // Test: JUMPI when condition is true
    {
        // Code: PUSH1 0x01, PUSH1 0x08, JUMPI, PUSH1 0xFF, PUSH1 0, MSTORE, PUSH1 0x20, PUSH1 0, RETURN, JUMPDEST, PUSH1 0x42, PUSH1 0, MSTORE, PUSH1 0x20, PUSH1 0, RETURN
        // This jumps to offset 8 if the condition (0x01) is non-zero, which it is
        const code = 
            helpers.push(1) ++ // Condition (true) 
            helpers.push(8) ++ // Target JUMPDEST
            &[_]u8{@intFromEnum(Opcode.JUMPI)} ++
            helpers.mstore(0, 0xFF) ++ // This should be skipped
            helpers.ret(0, 32) ++
            &[_]u8{@intFromEnum(Opcode.JUMPDEST)} ++
            helpers.mstore(0, 0x42) ++
            helpers.ret(0, 32);
            
        try evm_test.execute(1000, code, &[_]u8{});
        
        const result = evm_test.result.?;
        try testing.expectEqual(@as(?interpreter.InterpreterError, null), result.status);
        try testing.expectEqual(@as(u64, 32), result.output.?.len);
        
        // Check that we jumped to the second part (0x42)
        try testing.expectEqual(@as(u8, 0x42), result.output.?[31]);
    }
    
    // Test: JUMPI when condition is false
    {
        // Same code but condition is 0 (false)
        const code = 
            helpers.push(0) ++ // Condition (false) 
            helpers.push(8) ++ // Target JUMPDEST
            &[_]u8{@intFromEnum(Opcode.JUMPI)} ++
            helpers.mstore(0, 0xFF) ++ // This should be executed
            helpers.ret(0, 32) ++
            &[_]u8{@intFromEnum(Opcode.JUMPDEST)} ++
            helpers.mstore(0, 0x42) ++
            helpers.ret(0, 32);
            
        try evm_test.execute(1000, code, &[_]u8{});
        
        const result = evm_test.result.?;
        try testing.expectEqual(@as(?interpreter.InterpreterError, null), result.status);
        try testing.expectEqual(@as(u64, 32), result.output.?.len);
        
        // Check that we didn't jump (0xFF)
        try testing.expectEqual(@as(u8, 0xFF), result.output.?[31]);
    }
}

// Test PC opcode
test "program counter" {
    var evm_test = try EvmTest.init(testing.allocator);
    defer evm_test.deinit();
    
    // Test: PC returns the current program counter
    {
        // Code: PUSH1 0x01, PC, PUSH1 0x00, MSTORE, PUSH1 0x20, PUSH1 0x00, RETURN
        // PC should return 2 (after the PUSH1 0x01, which is 2 bytes, but before its own increment)
        const code = 
            helpers.push(1) ++
            &[_]u8{@intFromEnum(Opcode.PC)} ++
            helpers.push(0) ++
            &[_]u8{@intFromEnum(Opcode.MSTORE)} ++
            helpers.ret(0, 32);
            
        try evm_test.execute(100, code, &[_]u8{});
        
        const result = evm_test.result.?;
        try testing.expectEqual(@as(?interpreter.InterpreterError, null), result.status);
        try testing.expectEqual(@as(u64, 32), result.output.?.len);
        
        // PC should be 2 (the PUSH1 0x01 takes 2 bytes)
        try testing.expectEqual(@as(u8, 2), result.output.?[31]);
    }
}

// Test STOP, REVERT, and error conditions
test "execution termination" {
    var evm_test = try EvmTest.init(testing.allocator);
    defer evm_test.deinit();
    
    // Test: STOP terminates execution
    {
        // Code: PUSH1 0x42, PUSH1 0x00, MSTORE, STOP, PUSH1 0xFF, PUSH1 0x00, MSTORE
        // The value 0xFF should not be stored because execution stops
        const code = 
            helpers.mstore(0, 0x42) ++
            &[_]u8{@intFromEnum(Opcode.STOP)} ++
            helpers.mstore(0, 0xFF);
            
        try evm_test.execute(100, code, &[_]u8{});
        
        const result = evm_test.result.?;
        try testing.expectEqual(@as(?interpreter.InterpreterError, null), result.status);
        try testing.expectEqual(@as(?[]const u8, null), result.output);
    }
    
    // Test: REVERT returns data but reverts state changes
    {
        // Code: PUSH1 0x42, PUSH1 0x00, MSTORE, PUSH1 0x20, PUSH1 0x00, REVERT
        const code = 
            helpers.mstore(0, 0x42) ++
            helpers.push(32) ++
            helpers.push(0) ++
            &[_]u8{@intFromEnum(Opcode.REVERT)};
            
        try evm_test.execute(1000, code, &[_]u8{});
        
        const result = evm_test.result.?;
        try testing.expectEqual(@as(?interpreter.InterpreterError, null), result.status);
        try testing.expectEqual(@as(u64, 32), result.output.?.len);
        
        // REVERT should return the data
        try testing.expectEqual(@as(u8, 0x42), result.output.?[31]);
    }
}