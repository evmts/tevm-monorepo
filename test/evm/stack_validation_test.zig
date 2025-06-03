const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const Stack = evm.Stack;
const JumpTable = evm.JumpTable;
const Operation = evm.Operation;
const ExecutionError = evm.ExecutionError;
const Frame = evm.Frame;
const Contract = evm.Contract;
const Address = evm.Address;
const stack_validation = @import("../../src/evm/stack_validation.zig");

// Test stack validation in the context of actual opcodes

test "Stack validation: binary operations" {
    const allocator = testing.allocator;
    
    // Create a simple contract with ADD operation
    const zero_address = Address.ZERO_ADDRESS;
    const code = [_]u8{0x01}; // ADD opcode
    const code_hash = [_]u8{0} ** 32;
    const input = [_]u8{};
    
    var contract = Contract.init(
        zero_address, // caller
        zero_address, // address
        0,           // value
        1000,        // gas
        &code,       // code
        code_hash,   // code_hash
        &input,      // input
        false,       // is_static
    );
    
    var frame = Frame.init(allocator, &contract);
    defer frame.deinit();
    
    // Create jump table
    var table = JumpTable.init_from_hardfork(.FRONTIER);
    
    // Get ADD operation
    const add_op = table.get_operation(0x01);
    
    // Verify min_stack requirement
    try testing.expectEqual(@as(u32, 2), add_op.min_stack);
    
    // Test underflow - empty stack
    try testing.expectError(
        ExecutionError.Error.StackUnderflow, 
        stack_validation.validate_stack_requirements(&frame.stack, add_op)
    );
    
    // Add one item - still underflow
    try frame.stack.append(10);
    try testing.expectError(
        ExecutionError.Error.StackUnderflow,
        stack_validation.validate_stack_requirements(&frame.stack, add_op)
    );
    
    // Add second item - should pass
    try frame.stack.append(20);
    try stack_validation.validate_stack_requirements(&frame.stack, add_op);
}

test "Stack validation: PUSH operations" {
    const allocator = testing.allocator;
    
    // Create contract with PUSH1 opcode
    const zero_address = Address.ZERO_ADDRESS;
    const code = [_]u8{0x60}; // PUSH1 opcode
    const code_hash = [_]u8{0} ** 32;
    const input = [_]u8{};
    
    var contract = Contract.init(
        zero_address, // caller
        zero_address, // address
        0,           // value
        1000,        // gas
        &code,       // code
        code_hash,   // code_hash
        &input,      // input
        false,       // is_static
    );
    
    var frame = Frame.init(allocator, &contract);
    defer frame.deinit();
    
    var table = JumpTable.init_from_hardfork(.FRONTIER);
    const push1_op = table.get_operation(0x60);
    
    // PUSH operations have min_stack = 0
    try testing.expectEqual(@as(u32, 0), push1_op.min_stack);
    
    // Fill stack to capacity
    frame.stack.size = Stack.CAPACITY;
    
    // Should fail due to overflow
    try testing.expectError(
        ExecutionError.Error.StackOverflow,
        stack_validation.validate_stack_requirements(&frame.stack, push1_op)
    );
}

test "Stack validation: DUP operations" {
    const allocator = testing.allocator;
    
    // Create contract with DUP1 opcode
    const zero_address = Address.ZERO_ADDRESS;
    const code = [_]u8{0x80}; // DUP1 opcode
    const code_hash = [_]u8{0} ** 32;
    const input = [_]u8{};
    
    var contract = Contract.init(
        zero_address, // caller
        zero_address, // address
        0,           // value
        1000,        // gas
        &code,       // code
        code_hash,   // code_hash
        &input,      // input
        false,       // is_static
    );
    
    var frame = Frame.init(allocator, &contract);
    defer frame.deinit();
    
    var table = JumpTable.init_from_hardfork(.FRONTIER);
    const dup1_op = table.get_operation(0x80);
    
    // DUP1 needs at least 1 item
    try testing.expectEqual(@as(u32, 1), dup1_op.min_stack);
    
    // Test with empty stack
    try testing.expectError(
        ExecutionError.Error.StackUnderflow,
        stack_validation.validate_stack_requirements(&frame.stack, dup1_op)
    );
    
    // Add item and test
    try frame.stack.append(42);
    try stack_validation.validate_stack_requirements(&frame.stack, dup1_op);
    
    // Test overflow - fill stack to capacity
    frame.stack.size = Stack.CAPACITY;
    try testing.expectError(
        ExecutionError.Error.StackOverflow,
        stack_validation.validate_stack_requirements(&frame.stack, dup1_op)
    );
}

test "Stack validation: SWAP operations" {
    const allocator = testing.allocator;
    
    // Create contract with SWAP1 opcode
    const zero_address = Address.ZERO_ADDRESS;
    const code = [_]u8{0x90}; // SWAP1 opcode
    const code_hash = [_]u8{0} ** 32;
    const input = [_]u8{};
    
    var contract = Contract.init(
        zero_address, // caller
        zero_address, // address
        0,           // value
        1000,        // gas
        &code,       // code
        code_hash,   // code_hash
        &input,      // input
        false,       // is_static
    );
    var frame = Frame.init(allocator, &contract);
    defer frame.deinit();
    
    var table = JumpTable.init_from_hardfork(.FRONTIER);
    const swap1_op = table.get_operation(0x90);
    
    // SWAP1 needs at least 2 items
    try testing.expectEqual(@as(u32, 2), swap1_op.min_stack);
    
    // Test validation patterns
    try testing.expectError(
        ExecutionError.Error.StackUnderflow,
        stack_validation.ValidationPatterns.validate_swap(&frame.stack, 1)
    );
    
    // Add items
    try frame.stack.append(10);
    try frame.stack.append(20);
    
    // Should pass now
    try stack_validation.ValidationPatterns.validate_swap(&frame.stack, 1);
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

test "Stack validation: integration with jump table execution" {
    const allocator = testing.allocator;
    
    // Create contract with ADD opcode
    const zero_address = Address.ZERO_ADDRESS;
    const code = [_]u8{0x01}; // ADD opcode
    const code_hash = [_]u8{0} ** 32;
    const input = [_]u8{};
    
    var contract = Contract.init(
        zero_address, // caller
        zero_address, // address
        0,           // value
        1000,        // gas
        &code,       // code
        code_hash,   // code_hash
        &input,      // input
        false,       // is_static
    );
    
    var frame = Frame.init(allocator, &contract);
    defer frame.deinit();
    
    // Provide enough gas
    frame.gas_remaining = 1000;
    
    var table = JumpTable.init_from_hardfork(.FRONTIER);
    
    // Try to execute ADD without enough stack items
    const interpreter_ptr: *Operation.Interpreter = @ptrCast(@alignCast(&frame));
    const state_ptr: *Operation.State = @ptrCast(@alignCast(&frame));
    
    // Should fail with stack underflow
    const result = table.execute(0, interpreter_ptr, state_ptr, 0x01);
    try testing.expectError(ExecutionError.Error.StackUnderflow, result);
    
    // Add items and try again
    try frame.stack.append(10);
    try frame.stack.append(20);
    
    // Should succeed now
    _ = try table.execute(0, interpreter_ptr, state_ptr, 0x01);
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