const std = @import("std");
const testing = std.testing;
const address = @import("../Address/address.zig");
const frame = @import("frame.zig");
const evm = @import("evm.zig");

// Use this to avoid ambiguous reference
const ActualFrame = @import("Frame/Frame.zig").Frame;
const FrameInput = frame.FrameInput;
const FrameResult = frame.FrameResult;
const FrameOrCall = frame.FrameOrCall;
const InstructionResult = frame.InstructionResult;
const JournalCheckpoint = frame.JournalCheckpoint;

test "Frame initialization with Call input" {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    const callInput = FrameInput{
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
    var testFrame = try ActualFrame.init(allocator, callInput, &[_]u8{0x00}, // STOP opcode
        0, 0);
    defer testFrame.deinit();

    // Test initialization values
    try testing.expectEqual(@as(u16, 0), testFrame.depth);
    try testing.expectEqual(@as(u64, 100000), testFrame.state.gas.remaining);
    try testing.expectEqual(@as(u64, 0), testFrame.state.gas.refunded);
    try testing.expectEqual(@as(usize, 1), testFrame.code.len);
    try testing.expectEqual(@as(u8, 0x00), testFrame.code[0]);
}

test "Frame initialization with Create input" {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    const createInput = FrameInput{
        .Create = .{
            .initCode = &[_]u8{ 0x60, 0x01, 0x60, 0x02, 0x01 }, // PUSH1 1 PUSH1 2 ADD
            .gasLimit = 50000,
            .caller = address.ZERO_ADDRESS,
            .value = 100,
        },
    };

    // Create a frame
    var testFrame = try ActualFrame.init(allocator, createInput, &[_]u8{ 0x60, 0x01, 0x60, 0x02, 0x01 }, // Same bytecode as initCode
        1, // Depth 1
        42 // Some checkpoint
    );
    defer testFrame.deinit();

    // Test initialization values
    try testing.expectEqual(@as(u16, 1), testFrame.depth);
    try testing.expectEqual(@as(u64, 50000), testFrame.state.gas.remaining);
    try testing.expectEqual(@as(u64, 0), testFrame.state.gas.refunded);
    try testing.expectEqual(@as(usize, 5), testFrame.code.len);
    try testing.expectEqual(@as(JournalCheckpoint, 42), testFrame.checkpoint);

    // Test gas limit from Create input
    try testing.expectEqual(@as(u64, 50000), createInput.getGasLimit());
}

test "Frame execution with empty code" {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    // Create a simple state manager for testing
    var stateManager = frame.StateManager{};

    const callInput = FrameInput{
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

    // Create a frame with empty bytecode
    var testFrame = try ActualFrame.init(allocator, callInput, &[_]u8{}, // Empty bytecode
        0, 0);
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
                    try testing.expectEqual(InstructionResult.Success, callResult.status);
                    try testing.expectEqual(@as(usize, 0), callResult.returnData.len);
                    try testing.expectEqual(@as(u64, 0), callResult.gasUsed);
                },
                else => unreachable,
            }
        },
        else => unreachable,
    }
}

test "Frame execution with STOP opcode" {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    // Create a simple state manager for testing
    var stateManager = frame.StateManager{};

    const callInput = FrameInput{
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
    var testFrame = try ActualFrame.init(allocator, callInput, &[_]u8{0x00}, // STOP opcode
        0, 0);
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
                    try testing.expectEqual(InstructionResult.Success, callResult.status);
                    try testing.expectEqual(@as(usize, 0), callResult.returnData.len);
                    try testing.expectEqual(@as(u64, 0), callResult.gasUsed);
                    try testing.expectEqual(@as(u64, 0), callResult.gasRefunded);
                },
                else => unreachable,
            }
        },
        else => unreachable,
    }
}

test "Frame execution with invalid opcode" {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    // Create a simple state manager for testing
    var stateManager = frame.StateManager{};

    const callInput = FrameInput{
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

    // Create a frame with invalid bytecode
    var testFrame = try ActualFrame.init(allocator, callInput, &[_]u8{0xFF}, // Invalid opcode
        0, 0);
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
                    try testing.expectEqual(InstructionResult.InvalidOpcode, callResult.status);
                    try testing.expectEqual(@as(usize, 0), callResult.returnData.len);
                    try testing.expectEqual(@as(u64, 0), callResult.gasUsed);
                },
                else => unreachable,
            }
        },
        else => unreachable,
    }
}

test "Frame debug output" {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    // Create a frame with Call input
    const callInput = FrameInput{
        .Call = .{
            .callData = &[_]u8{ 0x01, 0x02, 0x03 },
            .gasLimit = 100000,
            .target = address.ZERO_ADDRESS,
            .codeAddress = address.ZERO_ADDRESS,
            .caller = address.ZERO_ADDRESS,
            .value = 1000,
            .callType = .Call,
            .isStatic = false,
        },
    };

    var testFrame = try ActualFrame.init(allocator, callInput, &[_]u8{ 0x60, 0x01, 0x60, 0x02, 0x01 }, // PUSH1 1 PUSH1 2 ADD
        0, 0);
    defer testFrame.deinit();

    // Call debug - this mainly tests that it doesn't crash
    testFrame.debug();

    // Create a frame with Create2 input
    const create2Input = FrameInput{
        .Create2 = .{
            .initCode = &[_]u8{ 0x01, 0x02, 0x03 },
            .gasLimit = 50000,
            .caller = address.ZERO_ADDRESS,
            .value = 2000,
            .salt = [_]u8{ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32 },
        },
    };

    var testFrame2 = try ActualFrame.init(allocator, create2Input, &[_]u8{ 0x60, 0x01, 0x60, 0x02, 0x01 }, // PUSH1 1 PUSH1 2 ADD
        2, // Depth 2
        42);
    defer testFrame2.deinit();

    // Call debug - this mainly tests that it doesn't crash
    testFrame2.debug();
}

// Original tests for related components

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
    try memory.store(0, &[_]u8{ 1, 2, 3, 4 });

    const loaded = memory.load(0, 4);
    try testing.expectEqualSlices(u8, &[_]u8{ 1, 2, 3, 4 }, loaded);

    // Test memory expansion
    try memory.store(100, &[_]u8{ 5, 6, 7, 8 });

    const loaded2 = memory.load(100, 4);
    try testing.expectEqualSlices(u8, &[_]u8{ 5, 6, 7, 8 }, loaded2);

    // Memory should be expanded
    try testing.expect(memory.data.items.len >= 104);
}

test "EVM simple execution - call" {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    var stateManager = frame.StateManager{};
    var testEvm = evm.Evm.init(allocator, &stateManager);

    const callInput = FrameInput{
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
            try testing.expectEqual(InstructionResult.Success, callResult.status);
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

    const createInput = FrameInput{
        .Create = .{
            .initCode = &[_]u8{0x00}, // Simple STOP opcode
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
            try testing.expectEqual(InstructionResult.Success, createResult.status);
        },
        else => unreachable,
    }
}
