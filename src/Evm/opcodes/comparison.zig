const std = @import("std");
const jumpTableModule = @import("../jumpTable/JumpTable.zig");
const JumpTable = jumpTableModule.JumpTable;
const Operation = jumpTableModule.Operation;
const Interpreter = @import("../interpreter.zig").Interpreter;
const Frame = @import("../Frame.zig").Frame;
const ExecutionError = @import("../interpreter.zig").InterpreterError;
const stackModule = @import("../Stack.zig");
const Stack = stackModule.Stack;
const StackError = stackModule.StackError;

// Helper to convert Stack errors to ExecutionError
fn mapStackError(err: StackError) ExecutionError {
    return switch (err) {
        error.OutOfBounds => ExecutionError.StackUnderflow,
        error.StackOverflow => ExecutionError.StackOverflow,
        error.OutOfMemory => ExecutionError.OutOfGas,
    };
}

/// LT operation - compares if x < y for the top two stack items
pub fn opLt(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop y from the stack
    const y = frame.stack.pop() catch |err| return mapStackError(err);
    
    // Get reference to x (which is now at the top of the stack)
    const x = frame.stack.peek() catch |err| return mapStackError(err);
    
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
    const y = frame.stack.pop() catch |err| return mapStackError(err);
    
    // Get reference to x (which is now at the top of the stack)
    const x = frame.stack.peek() catch |err| return mapStackError(err);
    
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
    const y = frame.stack.pop() catch |err| return mapStackError(err);
    
    // Get reference to x (which is now at the top of the stack)
    const x = frame.stack.peek() catch |err| return mapStackError(err);
    
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
    const y = frame.stack.pop() catch |err| return mapStackError(err);
    
    // Get reference to x (which is now at the top of the stack)
    const x = frame.stack.peek() catch |err| return mapStackError(err);
    
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
    const y = frame.stack.pop() catch |err| return mapStackError(err);
    
    // Get reference to x (which is now at the top of the stack)
    const x = frame.stack.peek() catch |err| return mapStackError(err);
    
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
    const x = frame.stack.peek() catch |err| return mapStackError(err);
    
    // Check if x is zero, store 1 if true, 0 if false
    x.* = if (x.* == 0) 1 else 0;
    
    return "";
}

/// Register all comparison opcodes in the given jump table
pub fn registerComparisonOpcodes(allocator: std.mem.Allocator, jump_table: anytype) !void {
    // LT (0x10)
    const lt_op = try allocator.create(Operation);
    lt_op.* = Operation{
        .execute = opLt,
        .constant_gas = jumpTableModule.GasFastestStep,
        .min_stack = jumpTableModule.minStack(2, 1),
        .max_stack = jumpTableModule.maxStack(2, 1),
    };
    jump_table.table[0x10] = lt_op;
    
    // GT (0x11)
    const gt_op = try allocator.create(Operation);
    gt_op.* = Operation{
        .execute = opGt,
        .constant_gas = jumpTableModule.GasFastestStep,
        .min_stack = jumpTableModule.minStack(2, 1),
        .max_stack = jumpTableModule.maxStack(2, 1),
    };
    jump_table.table[0x11] = gt_op;
    
    // SLT (0x12)
    const slt_op = try allocator.create(Operation);
    slt_op.* = Operation{
        .execute = opSlt,
        .constant_gas = jumpTableModule.GasFastestStep,
        .min_stack = jumpTableModule.minStack(2, 1),
        .max_stack = jumpTableModule.maxStack(2, 1),
    };
    jump_table.table[0x12] = slt_op;
    
    // SGT (0x13)
    const sgt_op = try allocator.create(Operation);
    sgt_op.* = Operation{
        .execute = opSgt,
        .constant_gas = jumpTableModule.GasFastestStep,
        .min_stack = jumpTableModule.minStack(2, 1),
        .max_stack = jumpTableModule.maxStack(2, 1),
    };
    jump_table.table[0x13] = sgt_op;
    
    // EQ (0x14)
    const eq_op = try allocator.create(Operation);
    eq_op.* = Operation{
        .execute = opEq,
        .constant_gas = jumpTableModule.GasFastestStep,
        .min_stack = jumpTableModule.minStack(2, 1),
        .max_stack = jumpTableModule.maxStack(2, 1),
    };
    jump_table.table[0x14] = eq_op;
    
    // ISZERO (0x15)
    const iszero_op = try allocator.create(Operation);
    iszero_op.* = Operation{
        .execute = opIszero,
        .constant_gas = jumpTableModule.GasFastestStep,
        .min_stack = jumpTableModule.minStack(1, 1),
        .max_stack = jumpTableModule.maxStack(1, 1),
    };
    jump_table.table[0x15] = iszero_op;
}

// Unit tests for comparison operations 
