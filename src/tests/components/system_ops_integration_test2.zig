//! Additional integration tests for system operations
//! Tests the system operations implementation in the dispatch system

const std = @import("std");
const testing = std.testing;
const Interpreter = @import("../../interpreter/interpreter.zig").Interpreter;
const types = @import("../../util/types.zig");
const U256 = types.U256;
const Address = types.Address;
const Opcode = @import("../../opcodes/opcodes.zig").Opcode;

/// Create a simple program with LOG operations
fn createLogProgram(log_number: u8) []const u8 {
    // Format: PUSH data to memory, then emit LOG
    return switch (log_number) {
        0 => &[_]u8{
            // Store some data in memory first
            @intFromEnum(Opcode.PUSH1), 0xAA,                 // Push value 0xAA
            @intFromEnum(Opcode.PUSH1), 0x00,                 // Push memory offset 0
            @intFromEnum(Opcode.MSTORE),                      // Store in memory
            
            // Set up LOG0 params
            @intFromEnum(Opcode.PUSH1), 0x20,                 // Push size 32
            @intFromEnum(Opcode.PUSH1), 0x00,                 // Push offset 0
            @intFromEnum(Opcode.LOG0),                        // LOG0
            @intFromEnum(Opcode.STOP),                        // STOP
        },
        1 => &[_]u8{
            // Store some data in memory first
            @intFromEnum(Opcode.PUSH1), 0xAA,                 // Push value 0xAA
            @intFromEnum(Opcode.PUSH1), 0x00,                 // Push memory offset 0
            @intFromEnum(Opcode.MSTORE),                      // Store in memory
            
            // Set up LOG1 params
            @intFromEnum(Opcode.PUSH1), 0xCC,                 // Push topic1
            @intFromEnum(Opcode.PUSH1), 0x20,                 // Push size 32
            @intFromEnum(Opcode.PUSH1), 0x00,                 // Push offset 0
            @intFromEnum(Opcode.LOG1),                        // LOG1
            @intFromEnum(Opcode.STOP),                        // STOP
        },
        2 => &[_]u8{
            // Store some data in memory first
            @intFromEnum(Opcode.PUSH1), 0xAA,                 // Push value 0xAA
            @intFromEnum(Opcode.PUSH1), 0x00,                 // Push memory offset 0
            @intFromEnum(Opcode.MSTORE),                      // Store in memory
            
            // Set up LOG2 params
            @intFromEnum(Opcode.PUSH1), 0xDD,                 // Push topic2
            @intFromEnum(Opcode.PUSH1), 0xCC,                 // Push topic1
            @intFromEnum(Opcode.PUSH1), 0x20,                 // Push size 32
            @intFromEnum(Opcode.PUSH1), 0x00,                 // Push offset 0
            @intFromEnum(Opcode.LOG2),                        // LOG2
            @intFromEnum(Opcode.STOP),                        // STOP
        },
        else => &[_]u8{@intFromEnum(Opcode.STOP)},            // Just STOP for other values
    };
}

/// Create a simple program with SELFDESTRUCT operation
fn createSelfDestructProgram() []const u8 {
    return &[_]u8{
        @intFromEnum(Opcode.PUSH20), 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 
                            0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10, 0x11, 0x12, 0x13, 0x14, // Beneficiary address
        @intFromEnum(Opcode.SELFDESTRUCT),                    // SELFDESTRUCT
    };
}

/// Create a simple program with STATICCALL operation (should fail due to SSTORE in static context)
fn createStaticViolationProgram() []const u8 {
    return &[_]u8{
        // Try to modify storage in static context
        @intFromEnum(Opcode.PUSH1), 0xAA,                     // Push value 0xAA
        @intFromEnum(Opcode.PUSH1), 0x01,                     // Push key 0x01
        @intFromEnum(Opcode.SSTORE),                          // SSTORE (will fail in static context)
        @intFromEnum(Opcode.STOP),                            // STOP
    };
}

/// Create a simple program that logs in static context (should fail)
fn createStaticLogProgram() []const u8 {
    return &[_]u8{
        // Try to emit a log in static context
        @intFromEnum(Opcode.PUSH1), 0x20,                     // Push size 32
        @intFromEnum(Opcode.PUSH1), 0x00,                     // Push offset 0
        @intFromEnum(Opcode.LOG0),                            // LOG0 (will fail in static context)
        @intFromEnum(Opcode.STOP),                            // STOP
    };
}

/// Test LOG operations in the interpreter
test "LOG operations in interpreter" {
    // Test LOG0
    {
        const code = createLogProgram(0);
        var interpreter = try Interpreter.init(std.testing.allocator, code, 100000, 0);
        defer interpreter.deinit();
        
        const result = interpreter.execute();
        
        // Check successful execution
        switch (result) {
            .Success => |success| {
                try std.testing.expect(success.gas_used > 0);
                try std.testing.expect(success.return_data.len == 0);
            },
            else => {
                try std.testing.expect(false); // Unexpected result
            },
        }
    }
    
    // Test LOG1
    {
        const code = createLogProgram(1);
        var interpreter = try Interpreter.init(std.testing.allocator, code, 100000, 0);
        defer interpreter.deinit();
        
        const result = interpreter.execute();
        
        // Check successful execution
        switch (result) {
            .Success => |success| {
                try std.testing.expect(success.gas_used > 0);
                try std.testing.expect(success.return_data.len == 0);
            },
            else => {
                try std.testing.expect(false); // Unexpected result
            },
        }
    }
    
    // Test LOG2
    {
        const code = createLogProgram(2);
        var interpreter = try Interpreter.init(std.testing.allocator, code, 100000, 0);
        defer interpreter.deinit();
        
        const result = interpreter.execute();
        
        // Check successful execution
        switch (result) {
            .Success => |success| {
                try std.testing.expect(success.gas_used > 0);
                try std.testing.expect(success.return_data.len == 0);
            },
            else => {
                try std.testing.expect(false); // Unexpected result
            },
        }
    }
}

/// Test SELFDESTRUCT operation in the interpreter
test "SELFDESTRUCT operation in interpreter" {
    const code = createSelfDestructProgram();
    var interpreter = try Interpreter.init(std.testing.allocator, code, 100000, 0);
    defer interpreter.deinit();
    
    const result = interpreter.execute();
    
    // Check successful execution
    switch (result) {
        .Success => |success| {
            try std.testing.expect(success.gas_used > 0);
            try std.testing.expect(success.return_data.len == 0);
        },
        else => {
            try std.testing.expect(false); // Unexpected result
        },
    }
}

/// Test static context violations
test "Static context violations" {
    // First test: SSTORE in static context
    {
        const code = createStaticViolationProgram();
        var interpreter = try Interpreter.init(std.testing.allocator, code, 100000, 0);
        defer interpreter.deinit();
        
        // Set static mode
        interpreter.is_static = true;
        
        const result = interpreter.execute();
        
        // Check for error result
        switch (result) {
            .Error => |err| {
                // Should be StaticModeViolation error
                try std.testing.expectEqual(types.Error.StaticModeViolation, err.error_type);
            },
            else => {
                try std.testing.expect(false); // Unexpected result
            },
        }
    }
    
    // Second test: LOG in static context
    {
        const code = createStaticLogProgram();
        var interpreter = try Interpreter.init(std.testing.allocator, code, 100000, 0);
        defer interpreter.deinit();
        
        // Set static mode
        interpreter.is_static = true;
        
        const result = interpreter.execute();
        
        // Check for error result
        switch (result) {
            .Error => |err| {
                // Should be StaticModeViolation error
                try std.testing.expectEqual(types.Error.StaticModeViolation, err.error_type);
            },
            else => {
                try std.testing.expect(false); // Unexpected result
            },
        }
    }
}

/// Test out of gas conditions for system operations
test "System operations out of gas" {
    // Test LOG0 with insufficient gas
    {
        const code = createLogProgram(0);
        var interpreter = try Interpreter.init(std.testing.allocator, code, 400, 0); // Just enough gas for pushes but not LOG
        defer interpreter.deinit();
        
        const result = interpreter.execute();
        
        // Check for out of gas error
        switch (result) {
            .Error => |err| {
                try std.testing.expectEqual(types.Error.OutOfGas, err.error_type);
            },
            else => {
                try std.testing.expect(false); // Unexpected result
            },
        }
    }
    
    // Test SELFDESTRUCT with insufficient gas
    {
        const code = createSelfDestructProgram();
        var interpreter = try Interpreter.init(std.testing.allocator, code, 100, 0); // Not enough gas
        defer interpreter.deinit();
        
        const result = interpreter.execute();
        
        // Check for out of gas error
        switch (result) {
            .Error => |err| {
                try std.testing.expectEqual(types.Error.OutOfGas, err.error_type);
            },
            else => {
                try std.testing.expect(false); // Unexpected result
            },
        }
    }
}

/// Test gas consumption for LOG operations
test "LOG operations gas consumption" {
    // Setup code for different LOG operations with different data sizes
    const log0_small = &[_]u8{
        // Small data
        @intFromEnum(Opcode.PUSH1), 0x01,                     // Push size 1
        @intFromEnum(Opcode.PUSH1), 0x00,                     // Push offset 0
        @intFromEnum(Opcode.LOG0),                            // LOG0
        @intFromEnum(Opcode.STOP),                            // STOP
    };
    
    const log1_small = &[_]u8{
        // Small data with 1 topic
        @intFromEnum(Opcode.PUSH1), 0xCC,                     // Push topic1
        @intFromEnum(Opcode.PUSH1), 0x01,                     // Push size 1
        @intFromEnum(Opcode.PUSH1), 0x00,                     // Push offset 0
        @intFromEnum(Opcode.LOG1),                            // LOG1
        @intFromEnum(Opcode.STOP),                            // STOP
    };
    
    const log2_small = &[_]u8{
        // Small data with 2 topics
        @intFromEnum(Opcode.PUSH1), 0xDD,                     // Push topic2
        @intFromEnum(Opcode.PUSH1), 0xCC,                     // Push topic1
        @intFromEnum(Opcode.PUSH1), 0x01,                     // Push size 1
        @intFromEnum(Opcode.PUSH1), 0x00,                     // Push offset 0
        @intFromEnum(Opcode.LOG2),                            // LOG2
        @intFromEnum(Opcode.STOP),                            // STOP
    };
    
    // Test LOG0 small data
    {
        var interpreter = try Interpreter.init(std.testing.allocator, log0_small, 100000, 0);
        defer interpreter.deinit();
        
        const result = interpreter.execute();
        
        // Check successful execution and expected gas usage
        switch (result) {
            .Success => |success| {
                // LOG0 base cost (375) + data cost (1 byte * 8) + some overhead for the PUSH operations
                try std.testing.expect(success.gas_used > 375 + 8);
            },
            else => {
                try std.testing.expect(false); // Unexpected result
            },
        }
    }
    
    // Test LOG1 small data
    {
        var interpreter = try Interpreter.init(std.testing.allocator, log1_small, 100000, 0);
        defer interpreter.deinit();
        
        const result = interpreter.execute();
        
        // Check successful execution and expected gas usage
        switch (result) {
            .Success => |success| {
                // LOG1 base cost (375 + 375) + data cost (1 byte * 8) + some overhead
                try std.testing.expect(success.gas_used > 375 * 2 + 8);
            },
            else => {
                try std.testing.expect(false); // Unexpected result
            },
        }
    }
    
    // Test LOG2 small data
    {
        var interpreter = try Interpreter.init(std.testing.allocator, log2_small, 100000, 0);
        defer interpreter.deinit();
        
        const result = interpreter.execute();
        
        // Check successful execution and expected gas usage
        switch (result) {
            .Success => |success| {
                // LOG2 base cost (375 + 375*2) + data cost (1 byte * 8) + some overhead
                try std.testing.expect(success.gas_used > 375 * 3 + 8);
            },
            else => {
                try std.testing.expect(false); // Unexpected result
            },
        }
    }
}