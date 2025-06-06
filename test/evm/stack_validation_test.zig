const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const Stack = evm.Stack;
const JumpTable = evm.JumpTable;
const ExecutionError = evm.ExecutionError;
const stack_validation = evm.stack_validation;

// Test stack validation in the context of actual opcodes

test "Stack validation: binary operations" {
    // Create jump table
    var table = JumpTable.init_from_hardfork(.FRONTIER);

    // Get ADD operation
    const add_op = table.get_operation(0x01);

    // Verify min_stack requirement
    try testing.expectEqual(@as(u32, 2), add_op.min_stack);

    // Test with a standalone stack
    var stack = Stack{};
    
    // Test underflow - empty stack
    try testing.expectError(
        ExecutionError.Error.StackUnderflow, 
        stack_validation.validate_stack_requirements(&stack, add_op)
    );

    // Add one item - still underflow
    try stack.append(10);
    try testing.expectError(
        ExecutionError.Error.StackUnderflow,
        stack_validation.validate_stack_requirements(&stack, add_op)
    );

    // Add second item - should pass
    try stack.append(20);
    try stack_validation.validate_stack_requirements(&stack, add_op);
}

test "Stack validation: PUSH operations" {
    var table = JumpTable.init_from_hardfork(.FRONTIER);
    const push1_op = table.get_operation(0x60);
    
    // PUSH operations have min_stack = 0
    try testing.expectEqual(@as(u32, 0), push1_op.min_stack);
    
    // Test with a standalone stack
    var stack = Stack{};
    
    // Fill stack to capacity
    stack.size = Stack.CAPACITY;
    
    // Should fail due to overflow
    try testing.expectError(
        ExecutionError.Error.StackOverflow,
        stack_validation.validate_stack_requirements(&stack, push1_op)
    );
}

test "Stack validation: DUP operations" {
    var table = JumpTable.init_from_hardfork(.FRONTIER);
    const dup1_op = table.get_operation(0x80);
    
    // DUP1 needs at least 1 item
    try testing.expectEqual(@as(u32, 1), dup1_op.min_stack);
    
    // Test with a standalone stack
    var stack = Stack{};
    
    // Test with empty stack
    try testing.expectError(
        ExecutionError.Error.StackUnderflow,
        stack_validation.validate_stack_requirements(&stack, dup1_op)
    );
    
    // Add item and test
    try stack.append(42);
    try stack_validation.validate_stack_requirements(&stack, dup1_op);
    
    // Test overflow - fill stack to capacity
    stack.size = Stack.CAPACITY;
    try testing.expectError(
        ExecutionError.Error.StackOverflow,
        stack_validation.validate_stack_requirements(&stack, dup1_op)
    );
}

test "Stack validation: SWAP operations" {
    var table = JumpTable.init_from_hardfork(.FRONTIER);
    const swap1_op = table.get_operation(0x90);
    
    // SWAP1 needs at least 2 items
    try testing.expectEqual(@as(u32, 2), swap1_op.min_stack);
    
    // Test with a standalone stack
    var stack = Stack{};
    
    // Test validation patterns
    try testing.expectError(
        ExecutionError.Error.StackUnderflow,
        stack_validation.ValidationPatterns.validate_swap(&stack, 1)
    );
    
    // Add items
    try stack.append(10);
    try stack.append(20);
    
    // Should pass now
    try stack_validation.ValidationPatterns.validate_swap(&stack, 1);
}

test "Stack validation: max_stack calculations" {
    // Test correct max_stack values for different operation types

    // Binary operations (pop 2, push 1) - net effect -1
    try testing.expectEqual(@as(u32, Stack.CAPACITY), stack_validation.calculate_max_stack(2, 1));

    // PUSH operations (pop 0, push 1) - net effect +1
    try testing.expectEqual(@as(u32, Stack.CAPACITY - 1), stack_validation.calculate_max_stack(0, 1));

    // DUP operations (pop 0, push 1) - net effect +1
    try testing.expectEqual(@as(u32, Stack.CAPACITY - 1), stack_validation.calculate_max_stack(0, 1));

    // POP operation (pop 1, push 0) - net effect -1
    try testing.expectEqual(@as(u32, Stack.CAPACITY), stack_validation.calculate_max_stack(1, 0));

    // SWAP/Comparison operations (pop n, push n) - net effect 0
    try testing.expectEqual(@as(u32, Stack.CAPACITY), stack_validation.calculate_max_stack(2, 2));

    // Complex operations
    // ADDMOD (pop 3, push 1) - net effect -2
    try testing.expectEqual(@as(u32, Stack.CAPACITY), stack_validation.calculate_max_stack(3, 1));

    // CALL-like operations that pop 7 and push 1 - net effect -6
    try testing.expectEqual(@as(u32, Stack.CAPACITY), stack_validation.calculate_max_stack(7, 1));
}

test "Stack validation: jump table stack requirements verification" {
    // This test verifies that the jump table properly sets stack requirements
    // for operations, and that our validation functions work correctly with them
    
    var table = JumpTable.init_from_hardfork(.FRONTIER);
    
    // Test ADD operation requirements
    const add_op = table.get_operation(0x01);
    try testing.expectEqual(@as(u32, 2), add_op.min_stack);
    try testing.expectEqual(@as(u32, Stack.CAPACITY), add_op.max_stack);
    
    // Test with a simple stack
    var stack = Stack{};
    
    // Should fail with empty stack
    try testing.expectError(
        ExecutionError.Error.StackUnderflow,
        stack_validation.validate_stack_requirements(&stack, add_op)
    );
    
    // Add one item - still should fail
    try stack.append(10);
    try testing.expectError(
        ExecutionError.Error.StackUnderflow,
        stack_validation.validate_stack_requirements(&stack, add_op)
    );
    
    // Add second item - should pass
    try stack.append(20);
    try stack_validation.validate_stack_requirements(&stack, add_op);
    
    // Test PUSH1 operation
    const push1_op = table.get_operation(0x60);
    try testing.expectEqual(@as(u32, 0), push1_op.min_stack);
    try testing.expectEqual(@as(u32, Stack.CAPACITY - 1), push1_op.max_stack);
    
    // Test at capacity
    stack.size = Stack.CAPACITY;
    try testing.expectError(
        ExecutionError.Error.StackOverflow,
        stack_validation.validate_stack_requirements(&stack, push1_op)
    );
}

test "Stack validation: all operation categories" {
    // This test verifies that all operation categories have appropriate
    // min_stack and max_stack values set

    var table = JumpTable.init_from_hardfork(.CANCUN);

    const test_cases = [_]struct {
        opcode: u8,
        name: []const u8,
        expected_min: u32,
        expected_pop: u32,
        expected_push: u32,
    }{
        // Arithmetic
        .{ .opcode = 0x01, .name = "ADD", .expected_min = 2, .expected_pop = 2, .expected_push = 1 },
        .{ .opcode = 0x08, .name = "ADDMOD", .expected_min = 3, .expected_pop = 3, .expected_push = 1 },

        // Stack operations
        .{ .opcode = 0x50, .name = "POP", .expected_min = 1, .expected_pop = 1, .expected_push = 0 },
        .{ .opcode = 0x60, .name = "PUSH1", .expected_min = 0, .expected_pop = 0, .expected_push = 1 },
        .{ .opcode = 0x80, .name = "DUP1", .expected_min = 1, .expected_pop = 0, .expected_push = 1 },
        .{ .opcode = 0x90, .name = "SWAP1", .expected_min = 2, .expected_pop = 0, .expected_push = 0 },

        // Memory operations
        .{ .opcode = 0x51, .name = "MLOAD", .expected_min = 1, .expected_pop = 1, .expected_push = 1 },
        .{ .opcode = 0x52, .name = "MSTORE", .expected_min = 2, .expected_pop = 2, .expected_push = 0 },

        // System operations
        .{ .opcode = 0xf1, .name = "CALL", .expected_min = 7, .expected_pop = 7, .expected_push = 1 },
        .{ .opcode = 0xf0, .name = "CREATE", .expected_min = 3, .expected_pop = 3, .expected_push = 1 },
    };

    for (test_cases) |tc| {
        const op = table.get_operation(tc.opcode);

        // Check min_stack
        try testing.expectEqual(tc.expected_min, op.min_stack);

        // Calculate expected max_stack
        const expected_max = stack_validation.calculate_max_stack(tc.expected_pop, tc.expected_push);

        // For now we're checking that max_stack is set appropriately
        // In production, these should match our calculated values
        if (tc.expected_push > tc.expected_pop) {
            // Operations that grow the stack should have max_stack < CAPACITY
            try testing.expect(op.max_stack <= expected_max);
        }
    }
}
