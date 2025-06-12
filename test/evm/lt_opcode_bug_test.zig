const std = @import("std");
const testing = std.testing;
const evm_mod = @import("evm");
const comparison = evm_mod.execution.comparison;
const Frame = evm_mod.Frame;
const Stack = evm_mod.Stack;
const ExecutionError = evm_mod.ExecutionError;
const Operation = evm_mod.Operation;

test "LT opcode should return StackUnderflow error instead of unreachable" {
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    std.debug.print("\n=== TDD: LT Opcode Bug Test ===\n", .{});

    // Create a frame with an empty stack
    var frame = try Frame.init(allocator);
    defer frame.deinit();

    std.debug.print("Test 1: LT with empty stack (0 items, needs 2)...\n", .{});
    
    // Cast frame to State for the operation
    const state = @as(*Operation.State, @ptrCast(&frame));
    
    // This should return StackUnderflow error, not crash with unreachable
    const result = comparison.op_lt(0, undefined, state);
    
    // EXPECTED: This test should FAIL because op_lt currently calls unreachable
    // AFTER FIX: This test should pass with StackUnderflow error
    try testing.expectError(ExecutionError.Error.StackUnderflow, result);
    
    std.debug.print("✓ Test 1 passed: LT returns StackUnderflow on empty stack\n", .{});

    std.debug.print("\nTest 2: LT with 1 item (has 1, needs 2)...\n", .{});
    
    // Add one item to stack
    try frame.stack.append(42);
    
    // This should also return StackUnderflow error
    const result2 = comparison.op_lt(0, undefined, state);
    try testing.expectError(ExecutionError.Error.StackUnderflow, result2);
    
    std.debug.print("✓ Test 2 passed: LT returns StackUnderflow with insufficient stack\n", .{});

    std.debug.print("\nTest 3: LT with 2 items (sufficient stack)...\n", .{});
    
    // Add second item to stack
    try frame.stack.append(100);
    
    // This should succeed: 42 < 100 = true (1)
    const result3 = comparison.op_lt(0, undefined, state);
    try result3; // Should not return error
    
    // Verify the result: stack should now contain [1] (42 < 100 is true)
    try testing.expect(frame.stack.size == 1);
    const final_value = frame.stack.peek_unsafe().*;
    try testing.expectEqual(@as(u256, 1), final_value);
    
    std.debug.print("✓ Test 3 passed: LT works correctly with sufficient stack\n", .{});
    
    std.debug.print("\n=== All tests designed - ready to fix the bug ===\n", .{});
}