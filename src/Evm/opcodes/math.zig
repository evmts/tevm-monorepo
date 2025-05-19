const std = @import("std");
const Interpreter = @import("../interpreter.zig").Interpreter;
const Frame = @import("../Frame.zig").Frame;
const ExecutionError = @import("../Frame.zig").ExecutionError;
const JumpTable = @import("../JumpTable.zig");

/// ADD operation - adds top two values on the stack and pushes the result
pub fn opAdd(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop x from the stack
    const x = try frame.stack.pop();
    
    // Get reference to y (which is now at the top of the stack)
    const y = try frame.stack.peek();
    
    // Add x + y and store result in y
    y.* = x +% y.*; // Using wrapping addition for EVM semantics
    
    return "";
}

/// SUB operation - subtracts the second value from the first value on the stack
pub fn opSub(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop x from the stack
    const x = try frame.stack.pop();
    
    // Get reference to y (which is now at the top of the stack)
    const y = try frame.stack.peek();
    
    // Subtract y - x and store result in y
    y.* = y.* -% x; // Using wrapping subtraction for EVM semantics
    
    return "";
}

/// MUL operation - multiplies the top two items on the stack
pub fn opMul(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop x from the stack
    const x = try frame.stack.pop();
    
    // Get reference to y (which is now at the top of the stack)
    const y = try frame.stack.peek();
    
    // Multiply x * y and store result in y
    y.* = x *% y.*; // Using wrapping multiplication for EVM semantics
    
    return "";
}

/// DIV operation - integer division of the top two items on the stack
pub fn opDiv(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop x (divisor) from the stack
    const x = try frame.stack.pop();
    
    // Get reference to y (dividend, which is now at the top of the stack)
    const y = try frame.stack.peek();
    
    // Division by zero returns 0 in the EVM
    if (x == 0) {
        y.* = 0;
    } else {
        y.* = y.* / x; // Integer division
    }
    
    return "";
}

/// SDIV operation - signed integer division of the top two items on the stack
pub fn opSdiv(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop x (divisor) from the stack
    const x = try frame.stack.pop();
    
    // Get reference to y (dividend, which is now at the top of the stack)
    const y = try frame.stack.peek();
    
    // Division by zero returns 0 in the EVM
    if (x == 0) {
        y.* = 0;
    } else {
        // Division between two two's complement signed integers
        // TODO: Implement proper signed division
        y.* = y.* / x; // For now, use unsigned division as placeholder
    }
    
    return "";
}

/// MOD operation - modulo of the top two items on the stack
pub fn opMod(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop x (modulus) from the stack
    const x = try frame.stack.pop();
    
    // Get reference to y (which is now at the top of the stack)
    const y = try frame.stack.peek();
    
    // Modulo by zero returns 0 in the EVM
    if (x == 0) {
        y.* = 0;
    } else {
        y.* = y.* % x; // Modulo operation
    }
    
    return "";
}

/// ADDMOD operation - (x + y) % z where x, y, z are the top three items on the stack
pub fn opAddmod(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 3 items on the stack
    if (frame.stack.size < 3) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop values from the stack
    const z = try frame.stack.pop(); // Modulus
    const y = try frame.stack.pop();
    
    // Get reference to x (which is now at the top of the stack)
    const x = try frame.stack.peek();
    
    // If modulus is zero, the result is zero
    if (z == 0) {
        x.* = 0;
        return "";
    }
    
    // Calculate (x + y) % z
    // TODO: This should handle overflow correctly with BigInt addition
    const sum = x.* +% y; // Wrapping addition
    x.* = sum % z;
    
    return "";
}

/// MULMOD operation - (x * y) % z where x, y, z are the top three items on the stack
pub fn opMulmod(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 3 items on the stack
    if (frame.stack.size < 3) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop values from the stack
    const z = try frame.stack.pop(); // Modulus
    const y = try frame.stack.pop();
    
    // Get reference to x (which is now at the top of the stack)
    const x = try frame.stack.peek();
    
    // If modulus is zero, the result is zero
    if (z == 0) {
        x.* = 0;
        return "";
    }
    
    // Calculate (x * y) % z
    // TODO: This should handle overflow correctly with BigInt multiplication
    const product = x.* *% y; // Wrapping multiplication
    x.* = product % z;
    
    return "";
}

/// EXP operation - x to the power of y, where x and y are the top two items on the stack
pub fn opExp(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop exponent from the stack
    const exponent = try frame.stack.pop();
    
    // Get reference to base (which is now at the top of the stack)
    const base = try frame.stack.peek();
    
    // Special cases
    if (exponent == 0) {
        // x^0 = 1 for any x (including 0)
        base.* = 1;
        return "";
    }
    
    if (base.* == 0) {
        // 0^y = 0 for any y (except 0, handled above)
        base.* = 0;
        return "";
    }
    
    // For small exponents, use simple iteration
    if (exponent < 10) {
        var result: u256 = 1;
        var i: u256 = 0;
        
        while (i < exponent) : (i += 1) {
            result = result *% base.*; // Using wrapping multiplication
        }
        
        base.* = result;
    } else {
        // For larger exponents, use binary exponentiation (square-and-multiply)
        var result: u256 = 1;
        var base_val = base.*;
        var exp_val = exponent;
        
        while (exp_val > 0) {
            if (exp_val & 1 == 1) {
                // If current exponent bit is 1, multiply result by current base
                result = result *% base_val;
            }
            
            // Square the base and halve the exponent
            base_val = base_val *% base_val;
            exp_val >>= 1;
        }
        
        base.* = result;
    }
    
    return "";
}

/// Register all math opcodes in the given jump table
pub fn registerMathOpcodes(allocator: std.mem.Allocator, jump_table: *JumpTable.JumpTable) !void {
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
    
    // SDIV (0x05)
    const sdiv_op = try allocator.create(JumpTable.Operation);
    sdiv_op.* = JumpTable.Operation{
        .execute = opSdiv,
        .constant_gas = JumpTable.GasFastStep,
        .min_stack = JumpTable.minStack(2, 1),
        .max_stack = JumpTable.maxStack(2, 1),
    };
    jump_table.table[0x05] = sdiv_op;
    
    // MOD (0x06)
    const mod_op = try allocator.create(JumpTable.Operation);
    mod_op.* = JumpTable.Operation{
        .execute = opMod,
        .constant_gas = JumpTable.GasFastStep,
        .min_stack = JumpTable.minStack(2, 1),
        .max_stack = JumpTable.maxStack(2, 1),
    };
    jump_table.table[0x06] = mod_op;
    
    // ADDMOD (0x08)
    const addmod_op = try allocator.create(JumpTable.Operation);
    addmod_op.* = JumpTable.Operation{
        .execute = opAddmod,
        .constant_gas = JumpTable.GasMidStep,
        .min_stack = JumpTable.minStack(3, 1),
        .max_stack = JumpTable.maxStack(3, 1),
    };
    jump_table.table[0x08] = addmod_op;
    
    // MULMOD (0x09)
    const mulmod_op = try allocator.create(JumpTable.Operation);
    mulmod_op.* = JumpTable.Operation{
        .execute = opMulmod,
        .constant_gas = JumpTable.GasMidStep,
        .min_stack = JumpTable.minStack(3, 1),
        .max_stack = JumpTable.maxStack(3, 1),
    };
    jump_table.table[0x09] = mulmod_op;
    
    // EXP (0x0A)
    const exp_op = try allocator.create(JumpTable.Operation);
    exp_op.* = JumpTable.Operation{
        .execute = opExp,
        .constant_gas = JumpTable.GasSlowStep,
        .min_stack = JumpTable.minStack(2, 1),
        .max_stack = JumpTable.maxStack(2, 1),
        // Dynamic gas calculation would be added here for EXP
    };
    jump_table.table[0x0A] = exp_op;
}