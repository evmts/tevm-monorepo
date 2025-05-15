const std = @import("std");
const testing = std.testing;
const address = @import("Address");
const frame = @import("frame.zig");
const evm = @import("evm.zig");

test "Frame initialization" {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();
    
    const callInput = frame.FrameInput{
        .Call = .{
            .callData = &[_]u8{},
            .gasLimit = 100000,
            .target = address.ZERO_ADDRESS,
            .codeAddress = address.ZERO_ADDRESS,
            .caller = address.ZERO_ADDRESS,
            .value = 0,
            .callType = .Call,
            .isStatic = false,
        },
    };
    
    // Create a frame
    var testFrame = try frame.Frame.init(
        allocator,
        callInput,
        &[_]u8{0x00}, // STOP opcode
        0,
        0
    );
    defer testFrame.deinit();
    
    // Test initialization values
    try testing.expectEqual(@as(u16, 0), testFrame.depth);
    try testing.expectEqual(@as(u64, 100000), testFrame.state.gas.remaining);
}

test "Frame simple execution (STOP)" {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();
    
    // Create a simple state manager for testing
    var stateManager = frame.StateManager{};
    
    const callInput = frame.FrameInput{
        .Call = .{
            .callData = &[_]u8{},
            .gasLimit = 100000,
            .target = address.ZERO_ADDRESS,
            .codeAddress = address.ZERO_ADDRESS,
            .caller = address.ZERO_ADDRESS,
            .value = 0,
            .callType = .Call,
            .isStatic = false,
        },
    };
    
    // Create a frame with STOP bytecode
    var testFrame = try frame.Frame.init(
        allocator,
        callInput,
        &[_]u8{0x00}, // STOP opcode
        0,
        0
    );
    defer testFrame.deinit();
    
    // Execute the frame
    const result = try testFrame.execute(&stateManager);
    
    // Check result
    try testing.expect(result == .Result);
    switch (result) {
        .Result => |frameResult| {
            try testing.expect(frameResult == .Call);
            switch (frameResult) {
                .Call => |callResult| {
                    try testing.expectEqual(frame.InstructionResult.Success, callResult.status);
                },
                else => unreachable,
            }
        },
        else => unreachable,
    }
}

test "Frame stack operations" {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();
    
    var stack = frame.Stack.init(allocator);
    defer stack.deinit();
    
    // Push and pop values
    try stack.push(123);
    try stack.push(456);
    
    try testing.expectEqual(@as(u256, 456), try stack.pop());
    try testing.expectEqual(@as(u256, 123), try stack.pop());
    
    // Test stack underflow
    try testing.expectError(error.StackUnderflow, stack.pop());
    
    // Push many values to test overflow
    var i: usize = 0;
    while (i < 1024) : (i += 1) {
        try stack.push(i);
    }
    
    // Test stack overflow
    try testing.expectError(error.StackOverflow, stack.push(1025));
}

test "Memory operations" {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();
    
    var memory = frame.Memory.init(allocator);
    defer memory.deinit();
    
    // Test storing and loading
    try memory.store(0, &[_]u8{1, 2, 3, 4});
    
    const loaded = memory.load(0, 4);
    try testing.expectEqualSlices(u8, &[_]u8{1, 2, 3, 4}, loaded);
    
    // Test memory expansion
    try memory.store(100, &[_]u8{5, 6, 7, 8});
    
    const loaded2 = memory.load(100, 4);
    try testing.expectEqualSlices(u8, &[_]u8{5, 6, 7, 8}, loaded2);
    
    // Memory should be expanded
    try testing.expect(memory.data.items.len >= 104);
}

test "EVM simple execution - call" {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();
    
    var stateManager = frame.StateManager{};
    var testEvm = evm.Evm.init(allocator, &stateManager);
    
    const callInput = frame.FrameInput{
        .Call = .{
            .callData = &[_]u8{},
            .gasLimit = 100000,
            .target = address.ZERO_ADDRESS,
            .codeAddress = address.ZERO_ADDRESS,
            .caller = address.ZERO_ADDRESS,
            .value = 0,
            .callType = .Call,
            .isStatic = false,
        },
    };
    
    // This is a bit of a hack for testing - normally we'd have a proper state manager
    // that would return the code for an address, but for testing we're using a simple mock
    stateManager.mockCode = &[_]u8{0x00}; // STOP opcode
    
    // Execute a simple call that just stops
    const result = try testEvm.execute(callInput);
    
    try testing.expect(result == .Call);
    switch (result) {
        .Call => |callResult| {
            try testing.expectEqual(frame.InstructionResult.Success, callResult.status);
        },
        else => unreachable,
    }
}

test "EVM simple execution - create" {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();
    
    var stateManager = frame.StateManager{};
    var testEvm = evm.Evm.init(allocator, &stateManager);
    
    const createInput = frame.FrameInput{
        .Create = .{
            .initCode = &[_]u8{0x00},  // Simple STOP opcode
            .gasLimit = 100000,
            .caller = address.ZERO_ADDRESS,
            .value = 0,
            .salt = null, // Regular CREATE (not CREATE2)
        },
    };
    
    // Execute the frame to create a contract
    const result = try testEvm.execute(createInput);
    
    try testing.expect(result == .Create);
    switch (result) {
        .Create => |createResult| {
            try testing.expectEqual(frame.InstructionResult.Success, createResult.status);
        },
        else => unreachable,
    }
}