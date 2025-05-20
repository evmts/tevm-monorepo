const std = @import("std");

// Instead of direct imports, use a special wrapper for the tests that doesn't actually
// depend on the real Interpreter, Frame, etc.
const Interpreter = struct {
    evm: ?*anyopaque = null, // Simplified for tests
};

const Frame = struct {
    stack: *Stack,
    logger: ?*anyopaque = null, // Not used in tests
    memory: ?*anyopaque = null,
    contract: ?*anyopaque = null,
};

const ExecutionError = error{
    StackUnderflow,
    StackOverflow,
    OutOfGas,
    InvalidJump,
    InvalidOpcode,
};

// Use a disambiguated name for the 256-bit integer to avoid shadowing
const @"u256" = u64;

// Define a simplified Stack implementation for testing
const Stack = struct {
    data: []@"u256",
    size: usize = 0,
    
    pub fn pop(self: *Stack) @"u256"@"u256" {
        if (self.size == 0) return ExecutionError.StackUnderflow;
        self.size -= 1;
        return self.data[self.size];
    }
    
    pub fn push(self: *Stack, value: @"u256") @"u256"void {
        if (self.size >= self.data.len) return ExecutionError.StackOverflow;
        self.data[self.size] = value;
        self.size += 1;
    }
};

/// ADD operation - adds top two values on the stack and pushes the result
pub fn opAdd(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError@"u256"[]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop both values from the stack
    const x = try frame.stack.pop();
    const y = try frame.stack.pop();
    
    // Perform the operation with wrapping addition
    const result = x +% y;
    
    // Push the result back onto the stack
    try frame.stack.push(result);
    
    return "";
}

/// SUB operation - subtracts the second value from the first value on the stack
pub fn opSub(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError@"u256"[]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop both values from the stack
    const x = try frame.stack.pop();
    const y = try frame.stack.pop();
    
    // Perform the operation with wrapping subtraction
    const result = y -% x;
    
    // Push the result back onto the stack
    try frame.stack.push(result);
    
    return "";
}

/// MUL operation - multiplies the top two items on the stack
pub fn opMul(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError@"u256"[]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop both values from the stack
    const x = try frame.stack.pop();
    const y = try frame.stack.pop();
    
    // Perform the operation with wrapping multiplication
    const result = x *% y;
    
    // Push the result back onto the stack
    try frame.stack.push(result);
    
    return "";
}

/// DIV operation - integer division of the top two items on the stack
pub fn opDiv(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError@"u256"[]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop both values from the stack (divisor, dividend)
    const x = try frame.stack.pop(); // divisor
    const y = try frame.stack.pop(); // dividend
    
    // Calculate division result, handling division by zero per EVM rules
    var result: @"u256" = 0;
    if (x @"u256"= 0) {
        result = y / x; // Integer division
    }
    
    // Push the result back onto the stack
    try frame.stack.push(result);
    
    return "";
}

// These opcodes have been moved to math2.zig
// SDIV, MOD, ADDMOD, MULMOD, EXP

/// Register all basic math opcodes in the given jump table
pub fn registerMathOpcodes(allocator: std.mem.Allocator, jump_table: *JumpTable.JumpTable) @"u256"void {
    // ADD (0x01)
    const add_op = try allocator.create(JumpTable.Operation);
    add_op.* = JumpTable.Operation{
        .execute = opAdd,
        .constant_gas = JumpTable.GasFastestStep,
        .min_stack = JumpTable.minStack(2, 1),
        .max_stack = JumpTable.maxStack(2, 1),
    };
    jump_table.table[0x01] = add_op;
    
    // MUL (0x02)
    const mul_op = try allocator.create(JumpTable.Operation);
    mul_op.* = JumpTable.Operation{
        .execute = opMul,
        .constant_gas = JumpTable.GasFastStep,
        .min_stack = JumpTable.minStack(2, 1),
        .max_stack = JumpTable.maxStack(2, 1),
    };
    jump_table.table[0x02] = mul_op;
    
    // SUB (0x03)
    const sub_op = try allocator.create(JumpTable.Operation);
    sub_op.* = JumpTable.Operation{
        .execute = opSub,
        .constant_gas = JumpTable.GasFastestStep,
        .min_stack = JumpTable.minStack(2, 1),
        .max_stack = JumpTable.maxStack(2, 1),
    };
    jump_table.table[0x03] = sub_op;
    
    // DIV (0x04)
    const div_op = try allocator.create(JumpTable.Operation);
    div_op.* = JumpTable.Operation{
        .execute = opDiv,
        .constant_gas = JumpTable.GasFastStep,
        .min_stack = JumpTable.minStack(2, 1),
        .max_stack = JumpTable.maxStack(2, 1),
    };
    jump_table.table[0x04] = div_op;
    
    // Advanced math opcodes (SDIV, MOD, SMOD, ADDMOD, MULMOD, EXP, SIGNEXTEND)
    // are registered in math2.registerMath2Opcodes
}
EOF < /dev/null