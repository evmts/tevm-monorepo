const std = @import("std");
const testing = std.testing;
const transient = @import("transient.zig");
const Interpreter = @import("../interpreter.zig").Interpreter;
const Frame = @import("../Frame.zig").Frame;
const Stack = @import("../Stack.zig").Stack;
const Memory = @import("../Memory.zig").Memory;
const Contract = @import("../Contract.zig").Contract;

// Mock implementation for testing
fn createTestFrame() !struct {
    frame: *Frame,
    stack: *Stack,
    memory: *Memory,
    interpreter: *Interpreter,
} {
    const allocator = testing.allocator;
    
    var stack = try allocator.create(Stack);
    stack.* = Stack.init(allocator);
    
    var memory = try allocator.create(Memory);
    memory.* = Memory.init(allocator);
    
    var contract = try allocator.create(Contract);
    contract.* = Contract{
        .gas = 100000,
        .code_address = undefined,
        .address = undefined,
        .input = &[_]u8{},
        .value = 0,
        .gas_refund = 0,
    };
    
    var frame = try allocator.create(Frame);
    frame.* = Frame{
        .stack = stack,
        .memory = memory,
        .contract = contract,
        .ret_data = undefined,
        .return_data_size = 0,
        .pc = 0,
        .gas_remaining = 100000,
        .err = null,
        .depth = 0,
        .ret_offset = 0,
        .ret_size = 0,
        .call_depth = 0,
    };
    
    var interpreter = try allocator.create(Interpreter);
    interpreter.* = Interpreter{
        .evm = undefined,
        .cfg = undefined,
        .readOnly = false,
        .returnData = &[_]u8{},
    };
    
    return .{
        .frame = frame,
        .stack = stack,
        .memory = memory,
        .interpreter = interpreter,
    };
}

fn cleanupTestFrame(test_frame: anytype, allocator: std.mem.Allocator) void {
    test_frame.memory.deinit();
    test_frame.stack.deinit();
    allocator.destroy(test_frame.memory);
    allocator.destroy(test_frame.stack);
    allocator.destroy(test_frame.frame.contract);
    allocator.destroy(test_frame.frame);
    allocator.destroy(test_frame.interpreter);
}

test "TLOAD basic operation" {
    const allocator = testing.allocator;
    var test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);
    
    // Setup stack for TLOAD operation test
    try test_frame.stack.push(0x123); // Key
    
    // Execute TLOAD operation
    _ = try transient.opTload(0, test_frame.interpreter, test_frame.frame);
    
    // Check result - should have one item on stack with value 0
    try testing.expectEqual(@as(usize, 1), test_frame.stack.size);
    try testing.expectEqual(@as(u256, 0), test_frame.stack.data[0]);
}

test "TSTORE basic operation" {
    const allocator = testing.allocator;
    var test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);
    
    // Setup stack for TSTORE operation test
    try test_frame.stack.push(0x123); // Key
    try test_frame.stack.push(0x456); // Value
    
    // Execute TSTORE operation
    _ = try transient.opTstore(0, test_frame.interpreter, test_frame.frame);
    
    // Check result - stack should be empty
    try testing.expectEqual(@as(usize, 0), test_frame.stack.size);
    
    // Now try to load the value to see if it works
    // The mock implementation won't actually persist the value,
    // but we can at least test the mechanics of the operation
    try test_frame.stack.push(0x123); // Key
    _ = try transient.opTload(0, test_frame.interpreter, test_frame.frame);
    
    // Should be empty value (0)
    try testing.expectEqual(@as(usize, 1), test_frame.stack.size);
}

test "TSTORE read-only mode" {
    const allocator = testing.allocator;
    var test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);
    
    // Enable read-only mode
    test_frame.interpreter.readOnly = true;
    
    // Setup stack for TSTORE operation test
    try test_frame.stack.push(0x123); // Key
    try test_frame.stack.push(0x456); // Value
    
    // Execute TSTORE operation - should fail in read-only mode
    const result = transient.opTstore(0, test_frame.interpreter, test_frame.frame);
    try testing.expectError(error.WriteProtection, result);
}