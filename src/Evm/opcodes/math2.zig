const std = @import("std");
const JumpTable = @import("../JumpTable.zig");

// Import the interpreter module directly to get the correct types
const interpreter_mod = @import("../interpreter.zig");
const Interpreter = interpreter_mod.Interpreter;
const Frame = @import("../Frame.zig").Frame;
const ExecutionError = @import("../Frame.zig").ExecutionError;
const Stack = @import("../Stack.zig").Stack;
const Memory = @import("../Memory.zig").Memory;

// For tests we'll use these types
const test_utils = @import("test_utils.zig");
const TestInterpreter = test_utils.Interpreter;
const TestFrame = test_utils.Frame;
const TestExecutionError = test_utils.ExecutionError;
const JumpTableTest = test_utils.JumpTable;
const TestStack = test_utils.Stack;
const TestMemory = test_utils.Memory;

// Use a disambiguated name for the 256-bit integer to avoid shadowing
pub const @"u256" = u64;

/// ADDMOD operation - (x + y) % z where x, y, z are the top three items on the stack
pub fn opAddmod(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 3 items on the stack
    if (frame.stack.size < 3) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop values from the stack
    var z: u64 = 0;
    var y: u64 = 0;
    
    if (frame.stack.pop()) |value| {
        z = value;
    } else |_| {
        return ExecutionError.StackUnderflow;
    }
    
    if (frame.stack.pop()) |value| {
        y = value;
    } else |_| {
        // Push back z since we couldn't complete the operation
        _ = frame.stack.push(z) catch {};
        return ExecutionError.StackUnderflow;
    }
    
    // Get reference to x (which is now at the top of the stack) - handle error case
    const x = frame.stack.peek() catch |err| {
        // Re-push the values we popped so stack is in a consistent state
        _ = frame.stack.push(y) catch {};
        _ = frame.stack.push(z) catch {};
        return err;
    };
    
    // If modulus is zero, the result is zero
    if (z == 0) {
        x.* = 0;
        return "";
    }
    
    // Calculate (x + y) % z
    // We need to handle overflow correctly by using u256 addition
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
    var z: u64 = 0;
    var y: u64 = 0;
    
    if (frame.stack.pop()) |value| {
        z = value;
    } else |_| {
        return ExecutionError.StackUnderflow;
    }
    
    if (frame.stack.pop()) |value| {
        y = value;
    } else |_| {
        // Push back z since we couldn't complete the operation
        _ = frame.stack.push(z) catch {};
        return ExecutionError.StackUnderflow;
    }
    
    // Get reference to x (which is now at the top of the stack) - handle error case
    const x = frame.stack.peek() catch |err| {
        // Re-push the values we popped so stack is in a consistent state
        _ = frame.stack.push(y) catch {};
        _ = frame.stack.push(z) catch {};
        return err;
    };
    
    // If modulus is zero, the result is zero
    if (z == 0) {
        x.* = 0;
        return "";
    }
    
    // Calculate (x * y) % z
    // We need to handle overflow correctly by using u256 multiplication
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
    var exponent: u64 = 0;
    if (frame.stack.pop()) |value| {
        exponent = value;
    } else |_| {
        return ExecutionError.StackUnderflow;
    }
    
    // Get reference to base (which is now at the top of the stack)
    const base = frame.stack.peek() catch |err| {
        // Re-push the exponent so the stack remains consistent
        _ = frame.stack.push(exponent) catch {};
        return err;
    };
    
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
        var result: u64 = 1;
        var i: u64 = 0;
        
        while (i < exponent) : (i += 1) {
            result = result *% base.*; // Using wrapping multiplication
        }
        
        base.* = result;
        return "";
    }
    
    // For larger exponents, use binary exponentiation (square-and-multiply)
    var result: u64 = 1;
    var base_val = base.*;
    var exp_val = exponent;
    
    // Binary exponentiation algorithm (no need for explicit iteration limit
    // since we're working with finite-width integers)
    while (exp_val > 0) {
        if (exp_val & 1 == 1) {
            // If current exponent bit is 1, multiply result by current base
            result = result *% base_val;
        }
        
        // Square the base
        base_val = base_val *% base_val;
        
        // Shift exponent right by 1 bit
        // This guarantees termination since we're working with a finite-width integer
        exp_val >>= 1;
    }
    
    base.* = result;
    return "";
}

/// Calculate dynamic gas for the EXP operation
pub fn expDynamicGas(interpreter: *Interpreter, frame: *Frame, stack: *Stack, memory: *Memory, requested_size: u64) error{OutOfGas}!u64 {
    _ = interpreter;
    _ = frame;
    _ = memory;
    _ = requested_size;
    
    // We need at least 2 items on stack for EXP
    if (stack.size < 2) {
        return error.OutOfGas;
    }
    
    // Check if stack access is valid - prevent out-of-bounds access
    if (stack.size <= 2 or stack.data.len < stack.size) {
        return error.OutOfGas;
    }
    
    // Get the exponent (2nd item on stack)
    const exponent = stack.data[stack.size - 2];
    
    // Gas calculation based on the byte size of the exponent
    // Each non-zero byte in the exponent costs 50 gas
    var byte_size: u64 = 0;
    
    // Find the byte size of the exponent (count significant bytes)
    // Use a safe approach with a max limit to prevent infinite loops
    var remaining_exp = exponent;
    const max_bytes = 32; // Maximum bytes in a 256-bit number
    
    while (remaining_exp > 0 and byte_size < max_bytes) : (remaining_exp >>= 8) {
        byte_size += 1;
    }
    
    // Safety check to prevent overflow in gas calculation
    if (byte_size > 1000000) { // Arbitrary but reasonable limit
        return error.OutOfGas;
    }
    
    // Calculate gas: base_gas + (byte_size * byte_gas)
    const base_gas: u64 = 10;
    const byte_gas: u64 = 50;
    
    // Check for multiplication overflow
    if (byte_gas > std.math.maxInt(u64) / byte_size) {
        return error.OutOfGas;
    }
    
    const byte_cost = byte_size * byte_gas;
    
    // Check for addition overflow
    if (base_gas > std.math.maxInt(u64) - byte_cost) {
        return error.OutOfGas;
    }
    
    const exp_gas_cost = base_gas + byte_cost;
    
    return exp_gas_cost;
}

/// SIGNEXTEND operation - extend length of two's complement signed integer
pub fn opSignextend(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop the byte position from the stack (the number of low-order bytes to consider)
    var byte_pos: u64 = 0;
    if (frame.stack.pop()) |value| {
        byte_pos = value;
    } else |_| {
        return ExecutionError.StackUnderflow;
    }
    
    // Get reference to the value (which is now at the top of the stack) - handle error case
    const value = frame.stack.peek() catch |err| {
        // Re-push the value we popped so stack is in a consistent state
        _ = frame.stack.push(byte_pos) catch {};
        return err;
    };
    
    // If byte_pos >= 32, value remains unchanged
    if (byte_pos >= 32) {
        return "";
    }
    
    // Calculate bit position for sign extension
    const bit_pos = (byte_pos * 8) + 7;
    
    // Check if sign bit is set in the specified byte
    const sign_bit = (value.* >> @intCast(bit_pos)) & 1;
    
    if (sign_bit == 1) {
        // If sign bit is set, set all higher bits to 1
        // When using u64, ensure we don't exceed the available bits
        const adjusted_bit_pos = @min(bit_pos, 63);
        const mask = (@as(u64, 1) << @intCast(adjusted_bit_pos + 1)) - 1;
        value.* = value.* | (~mask);
    } else {
        // If sign bit is not set, clear all higher bits to 0
        // When using u64, ensure we don't exceed the available bits
        const adjusted_bit_pos = @min(bit_pos, 63);
        const mask = (@as(u64, 1) << @intCast(adjusted_bit_pos + 1)) - 1;
        value.* = value.* & mask;
    }
    
    return "";
}

/// MOD operation - modulo remainder operation
pub fn opMod(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop x (divisor) from the stack
    var x: u64 = 0;
    if (frame.stack.pop()) |value| {
        x = value;
    } else |_| {
        return ExecutionError.StackUnderflow;
    }
    
    // Get reference to y (dividend, which is now at the top of the stack) - handle error case
    const y = frame.stack.peek() catch |err| {
        // Re-push the value we popped so stack is in a consistent state
        _ = frame.stack.push(x) catch {};
        return err;
    };
    
    // Modulo by zero returns 0 in the EVM
    if (x == 0) {
        y.* = 0;
    } else {
        y.* = y.* % x; // Modulo operation
    }
    
    return "";
}

/// SDIV operation - signed integer division operation
pub fn opSdiv(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop divisor from the stack
    var divisor: u64 = 0;
    if (frame.stack.pop()) |value| {
        divisor = value;
    } else |_| {
        return ExecutionError.StackUnderflow;
    }
    
    // Get reference to dividend (which is now at the top of the stack) - handle error case
    const dividend = frame.stack.peek() catch |err| {
        // Re-push the value we popped so stack is in a consistent state
        _ = frame.stack.push(divisor) catch {};
        return err;
    };
    
    // Division by zero returns 0 in the EVM
    if (divisor == 0) {
        dividend.* = 0;
        return "";
    }
    
    // Convert to signed integers for signed division
    // First determine if the inputs are negative by checking the most significant bit
    // Since we're using u64 as our u256, we need to check bit 63 (not 255)
    const divisor_neg = (divisor >> 63) == 1;
    const dividend_neg = (dividend.* >> 63) == 1;
    
    // Convert to absolute values using two's complement for negatives
    var divisor_abs = divisor;
    var dividend_abs = dividend.*;
    
    if (divisor_neg) {
        divisor_abs = (~divisor) +% 1; // Two's complement of divisor
    }
    
    if (dividend_neg) {
        dividend_abs = (~dividend.*) +% 1; // Two's complement of dividend
    }
    
    // Perform unsigned division on absolute values
    var result = dividend_abs / divisor_abs;
    
    // Apply sign to result based on input signs
    if (divisor_neg != dividend_neg) {
        result = (~result) +% 1; // Make result negative
    }
    
    dividend.* = result;
    return "";
}

/// SMOD operation - signed modulo remainder operation
pub fn opSmod(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop modulus from the stack
    var modulus: u64 = 0;
    if (frame.stack.pop()) |value| {
        modulus = value;
    } else |_| {
        return ExecutionError.StackUnderflow;
    }
    
    // Get reference to value (which is now at the top of the stack) - handle error case
    const value = frame.stack.peek() catch |err| {
        // Re-push the value we popped so stack is in a consistent state
        _ = frame.stack.push(modulus) catch {};
        return err;
    };
    
    // Modulo by zero returns 0 in the EVM
    if (modulus == 0) {
        value.* = 0;
        return "";
    }
    
    // Determine if the inputs are negative by checking the most significant bit
    // Since we're using u64 as our u256, we need to check bit 63 (not 255)
    const modulus_neg = (modulus >> 63) == 1;
    const value_neg = (value.* >> 63) == 1;
    
    // Convert to absolute values using two's complement for negatives
    var modulus_abs = modulus;
    var value_abs = value.*;
    
    if (modulus_neg) {
        modulus_abs = (~modulus) +% 1; // Two's complement of modulus
    }
    
    if (value_neg) {
        value_abs = (~value.*) +% 1; // Two's complement of value
    }
    
    // Perform unsigned modulo on absolute values
    var result = value_abs % modulus_abs;
    
    // The sign of the result follows the sign of the dividend (value) in signed modulo
    if (value_neg and result != 0) {
        result = (~result) +% 1; // Make result negative
    }
    
    value.* = result;
    return "";
}

/// Register all math2 opcodes in the given jump table
pub fn registerMath2Opcodes(allocator: std.mem.Allocator, jump_table: anytype) !void {
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
    
    // SMOD (0x07)
    const smod_op = try allocator.create(JumpTable.Operation);
    smod_op.* = JumpTable.Operation{
        .execute = opSmod,
        .constant_gas = JumpTable.GasFastStep,
        .min_stack = JumpTable.minStack(2, 1),
        .max_stack = JumpTable.maxStack(2, 1),
    };
    jump_table.table[0x07] = smod_op;
    
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
        .dynamic_gas = expDynamicGas,
        .min_stack = JumpTable.minStack(2, 1),
        .max_stack = JumpTable.maxStack(2, 1),
    };
    jump_table.table[0x0A] = exp_op;
    
    // SIGNEXTEND (0x0B)
    const signextend_op = try allocator.create(JumpTable.Operation);
    signextend_op.* = JumpTable.Operation{
        .execute = opSignextend,
        .constant_gas = JumpTable.GasFastStep,
        .min_stack = JumpTable.minStack(2, 1),
        .max_stack = JumpTable.maxStack(2, 1),
    };
    jump_table.table[0x0B] = signextend_op;
}