const std = @import("std");
const evm = @import("evm");
const Interpreter = evm.Interpreter;
const Frame = evm.Frame;
const ExecutionError = evm.ExecutionError;
const JumpTable = evm.JumpTable;
const Stack = evm.Stack;

/// LT operation - compares if x < y for the top two stack items
pub fn opLt(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop y from the stack
    const y = try frame.stack.pop();
    
    // Get reference to x (which is now at the top of the stack)
    const x = try frame.stack.peek();
    
    // Compare x < y, store 1 if true, 0 if false
    x.* = if (x.* < y) 1 else 0;
    
    return "";
}

/// GT operation - compares if x > y for the top two stack items
pub fn opGt(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop y from the stack
    const y = try frame.stack.pop();
    
    // Get reference to x (which is now at the top of the stack)
    const x = try frame.stack.peek();
    
    // Compare x > y, store 1 if true, 0 if false
    x.* = if (x.* > y) 1 else 0;
    
    return "";
}

/// SLT operation - signed less than comparison
pub fn opSlt(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop y from the stack
    const y = try frame.stack.pop();
    
    // Get reference to x (which is now at the top of the stack)
    const x = try frame.stack.peek();
    
    // Convert to signed integers for comparison
    // We use a simple approach for signed comparison using 2's complement semantics:
    // If the high bit is different, the negative number is smaller
    const x_negative = (x.* >> 255) == 1;
    const y_negative = (y >> 255) == 1;
    
    var result: u256 = 0;
    
    if (x_negative != y_negative) {
        // If signs are different, negative number is smaller
        result = if (x_negative) 1 else 0;
    } else {
        // If signs are the same, compare absolute values, accounting for sign
        if (x_negative) {
            // Both negative, compare magnitudes (reversed)
            result = if (x.* > y) 1 else 0;
        } else {
            // Both positive, normal comparison
            result = if (x.* < y) 1 else 0;
        }
    }
    
    x.* = result;
    
    return "";
}

/// SGT operation - signed greater than comparison
pub fn opSgt(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop y from the stack
    const y = try frame.stack.pop();
    
    // Get reference to x (which is now at the top of the stack)
    const x = try frame.stack.peek();
    
    // Convert to signed integers for comparison
    // We use a simple approach for signed comparison using 2's complement semantics:
    // If the high bit is different, the negative number is smaller
    const x_negative = (x.* >> 255) == 1;
    const y_negative = (y >> 255) == 1;
    
    var result: u256 = 0;
    
    if (x_negative != y_negative) {
        // If signs are different, positive number is greater
        result = if (!x_negative) 1 else 0;
    } else {
        // If signs are the same, compare absolute values, accounting for sign
        if (x_negative) {
            // Both negative, compare magnitudes (reversed)
            result = if (x.* < y) 1 else 0;
        } else {
            // Both positive, normal comparison
            result = if (x.* > y) 1 else 0;
        }
    }
    
    x.* = result;
    
    return "";
}

/// EQ operation - compares if x == y for the top two stack items
pub fn opEq(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop y from the stack
    const y = try frame.stack.pop();
    
    // Get reference to x (which is now at the top of the stack)
    const x = try frame.stack.peek();
    
    // Compare x == y, store 1 if true, 0 if false
    x.* = if (x.* == y) 1 else 0;
    
    return "";
}

/// ISZERO operation - checks if the top stack item is zero
pub fn opIszero(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 1 item on the stack
    if (frame.stack.size < 1) {
        return ExecutionError.StackUnderflow;
    }
    
    // Get reference to x (which is at the top of the stack)
    const x = try frame.stack.peek();
    
    // Check if x is zero, store 1 if true, 0 if false
    x.* = if (x.* == 0) 1 else 0;
    
    return "";
}

/// Register all comparison opcodes in the given jump table
pub fn registerComparisonOpcodes(allocator: std.mem.Allocator, jump_table: anytype) !void {
    // LT (0x10)
    const lt_op = try allocator.create(JumpTable.Operation);
    lt_op.* = JumpTable.Operation{
        .execute = opLt,
        .constant_gas = JumpTable.GasFastestStep,
        .min_stack = JumpTable.minStack(2, 1),
        .max_stack = JumpTable.maxStack(2, 1),
    };
    jump_table.table[0x10] = lt_op;
    
    // GT (0x11)
    const gt_op = try allocator.create(JumpTable.Operation);
    gt_op.* = JumpTable.Operation{
        .execute = opGt,
        .constant_gas = JumpTable.GasFastestStep,
        .min_stack = JumpTable.minStack(2, 1),
        .max_stack = JumpTable.maxStack(2, 1),
    };
    jump_table.table[0x11] = gt_op;
    
    // SLT (0x12)
    const slt_op = try allocator.create(JumpTable.Operation);
    slt_op.* = JumpTable.Operation{
        .execute = opSlt,
        .constant_gas = JumpTable.GasFastestStep,
        .min_stack = JumpTable.minStack(2, 1),
        .max_stack = JumpTable.maxStack(2, 1),
    };
    jump_table.table[0x12] = slt_op;
    
    // SGT (0x13)
    const sgt_op = try allocator.create(JumpTable.Operation);
    sgt_op.* = JumpTable.Operation{
        .execute = opSgt,
        .constant_gas = JumpTable.GasFastestStep,
        .min_stack = JumpTable.minStack(2, 1),
        .max_stack = JumpTable.maxStack(2, 1),
    };
    jump_table.table[0x13] = sgt_op;
    
    // EQ (0x14)
    const eq_op = try allocator.create(JumpTable.Operation);
    eq_op.* = JumpTable.Operation{
        .execute = opEq,
        .constant_gas = JumpTable.GasFastestStep,
        .min_stack = JumpTable.minStack(2, 1),
        .max_stack = JumpTable.maxStack(2, 1),
    };
    jump_table.table[0x14] = eq_op;
    
    // ISZERO (0x15)
    const iszero_op = try allocator.create(JumpTable.Operation);
    iszero_op.* = JumpTable.Operation{
        .execute = opIszero,
        .constant_gas = JumpTable.GasFastestStep,
        .min_stack = JumpTable.minStack(1, 1),
        .max_stack = JumpTable.maxStack(1, 1),
    };
    jump_table.table[0x15] = iszero_op;
}

// Unit tests for comparison operations 
const testing = std.testing;

// In Zig, built-in primitives like u256 are available without explicit definition
// if the architecture supports them. We assume u256 is available in this environment.

// Simple mock implementation for testing
const MockInterpreter = struct {
    // Simplified mock interpreter for testing
};

const MockFrame = struct {
    stack: Stack,
    
    pub fn init() MockFrame {
        return MockFrame{ .stack = Stack{} };
    }
};

test "LT operation" {
    var frame = MockFrame.init();
    var mock_interpreter = MockInterpreter{};
    
    try frame.stack.push(5); // First push (x)
    try frame.stack.push(10); // Second push (y)
    
    // Execute opLt - this should compare 5 < 10 and result in 1
    _ = try opLt(0, &mock_interpreter, &frame);
    
    // Check the result
    const result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 1), result);
    
    // Test case where x > y
    try frame.stack.push(20); // First push (x)
    try frame.stack.push(10); // Second push (y)
    
    _ = try opLt(0, &mock_interpreter, &frame);
    
    // Check the result - should be 0 since 20 < 10 is false
    const result2 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), result2);
}

test "GT operation" {
    var frame = MockFrame.init();
    var mock_interpreter = MockInterpreter{};
    
    try frame.stack.push(20); // First push (x)
    try frame.stack.push(10); // Second push (y)
    
    // Execute opGt - this should compare 20 > 10 and result in 1
    _ = try opGt(0, &mock_interpreter, &frame);
    
    // Check the result
    const result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 1), result);
    
    // Test case where x < y
    try frame.stack.push(5); // First push (x)
    try frame.stack.push(10); // Second push (y)
    
    _ = try opGt(0, &mock_interpreter, &frame);
    
    // Check the result - should be 0 since 5 > 10 is false
    const result2 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), result2);
}

test "EQ operation" {
    var frame = MockFrame.init();
    var mock_interpreter = MockInterpreter{};
    
    try frame.stack.push(10); // First push (x)
    try frame.stack.push(10); // Second push (y)
    
    // Execute opEq - this should compare 10 == 10 and result in 1
    _ = try opEq(0, &mock_interpreter, &frame);
    
    // Check the result
    const result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 1), result);
    
    // Test case where x != y
    try frame.stack.push(5); // First push (x)
    try frame.stack.push(10); // Second push (y)
    
    _ = try opEq(0, &mock_interpreter, &frame);
    
    // Check the result - should be 0 since 5 == 10 is false
    const result2 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), result2);
}

test "ISZERO operation" {
    var frame = MockFrame.init();
    var mock_interpreter = MockInterpreter{};
    
    try frame.stack.push(0); // Push 0
    
    // Execute opIszero - this should check if 0 == 0 and result in 1
    _ = try opIszero(0, &mock_interpreter, &frame);
    
    // Check the result
    const result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 1), result);
    
    // Test case with non-zero value
    try frame.stack.push(42); // Push non-zero value
    
    _ = try opIszero(0, &mock_interpreter, &frame);
    
    // Check the result - should be 0 since 42 == 0 is false
    const result2 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), result2);
}