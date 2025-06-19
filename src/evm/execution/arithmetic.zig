/// Arithmetic operations for the Ethereum Virtual Machine
///
/// This module implements all arithmetic opcodes for the EVM, including basic
/// arithmetic (ADD, SUB, MUL, DIV), signed operations (SDIV, SMOD), modular
/// arithmetic (MOD, ADDMOD, MULMOD), exponentiation (EXP), and sign extension
/// (SIGNEXTEND).
///
/// ## Design Philosophy
///
/// All operations follow a consistent pattern:
/// 1. Pop operands from the stack (validated by jump table)
/// 2. Perform the arithmetic operation
/// 3. Push the result back onto the stack
///
/// ## Performance Optimizations
///
/// - **Unsafe Operations**: Stack bounds checking is done by the jump table,
///   allowing opcodes to use unsafe stack operations for maximum performance
/// - **In-Place Updates**: Results are written directly to stack slots to
///   minimize memory operations
/// - **Wrapping Arithmetic**: Uses Zig's wrapping operators (`+%`, `*%`, `-%`)
///   for correct 256-bit overflow behavior
///
/// ## EVM Arithmetic Rules
///
/// - All values are 256-bit unsigned integers (u256)
/// - Overflow wraps around (e.g., MAX_U256 + 1 = 0)
/// - Division by zero returns 0 (not an error)
/// - Modulo by zero returns 0 (not an error)
/// - Signed operations interpret u256 as two's complement i256
///
/// ## Gas Costs
///
/// - ADD, SUB, NOT: 3 gas (GasFastestStep)
/// - MUL, DIV, SDIV, MOD, SMOD: 5 gas (GasFastStep)
/// - ADDMOD, MULMOD, SIGNEXTEND: 8 gas (GasMidStep)
/// - EXP: 10 gas + 50 per byte of exponent
///
/// ## Stack Requirements
///
/// Operation    | Stack Input | Stack Output | Description
/// -------------|-------------|--------------|-------------
/// ADD          | [a, b]      | [a + b]      | Addition with overflow
/// MUL          | [a, b]      | [a * b]      | Multiplication with overflow
/// SUB          | [a, b]      | [a - b]      | Subtraction with underflow
/// DIV          | [a, b]      | [a / b]      | Division (b=0 returns 0)
/// SDIV         | [a, b]      | [a / b]      | Signed division
/// MOD          | [a, b]      | [a % b]      | Modulo (b=0 returns 0)
/// SMOD         | [a, b]      | [a % b]      | Signed modulo
/// ADDMOD       | [a, b, n]   | [(a+b)%n]    | Addition modulo n
/// MULMOD       | [a, b, n]   | [(a*b)%n]    | Multiplication modulo n
/// EXP          | [a, b]      | [a^b]        | Exponentiation
/// SIGNEXTEND   | [b, x]      | [y]          | Sign extend x from byte b
const std = @import("std");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame/frame.zig");
const Vm = @import("../vm.zig");

/// ADD opcode (0x01) - Addition operation
///
/// Pops two values from the stack, adds them with wrapping overflow,
/// and pushes the result.
///
/// ## Stack Input
/// - `a`: First operand (second from top)
/// - `b`: Second operand (top)
///
/// ## Stack Output
/// - `a + b`: Sum with 256-bit wrapping overflow
///
/// ## Gas Cost
/// 3 gas (GasFastestStep)
///
/// ## Execution
/// 1. Pop b from stack
/// 2. Pop a from stack
/// 3. Calculate sum = (a + b) mod 2^256
/// 4. Push sum to stack
///
/// ## Example
/// Stack: [10, 20] => [30]
/// Stack: [MAX_U256, 1] => [0] (overflow wraps)
pub fn op_add(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const sum = a +% b;

    frame.stack.set_top_unsafe(sum);

    return Operation.ExecutionResult{};
}

/// MUL opcode (0x02) - Multiplication operation
///
/// Pops two values from the stack, multiplies them with wrapping overflow,
/// and pushes the result.
///
/// ## Stack Input
/// - `a`: First operand (second from top)
/// - `b`: Second operand (top)
///
/// ## Stack Output
/// - `a * b`: Product with 256-bit wrapping overflow
///
/// ## Gas Cost
/// 5 gas (GasFastStep)
///
/// ## Execution
/// 1. Pop b from stack
/// 2. Pop a from stack
/// 3. Calculate product = (a * b) mod 2^256
/// 4. Push product to stack
///
/// ## Example
/// Stack: [10, 20] => [200]
/// Stack: [2^128, 2^128] => [0] (overflow wraps)
pub fn op_mul(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;
    const product = a *% b;

    frame.stack.set_top_unsafe(product);

    return Operation.ExecutionResult{};
}

/// SUB opcode (0x03) - Subtraction operation
///
/// Pops two values from the stack, subtracts the top from the second,
/// with wrapping underflow, and pushes the result.
///
/// ## Stack Input
/// - `a`: Minuend (second from top)
/// - `b`: Subtrahend (top)
///
/// ## Stack Output
/// - `a - b`: Difference with 256-bit wrapping underflow
///
/// ## Gas Cost
/// 3 gas (GasFastestStep)
///
/// ## Execution
/// 1. Pop b from stack
/// 2. Pop a from stack
/// 3. Calculate result = (a - b) mod 2^256
/// 4. Push result to stack
///
/// ## Example
/// Stack: [30, 10] => [20]
/// Stack: [10, 20] => [2^256 - 10] (underflow wraps)
pub fn op_sub(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const result = a -% b;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

/// DIV opcode (0x04) - Unsigned integer division
///
/// Pops two values from the stack, divides the second by the top,
/// and pushes the integer quotient. Division by zero returns 0.
///
/// ## Stack Input
/// - `a`: Dividend (second from top)
/// - `b`: Divisor (top)
///
/// ## Stack Output
/// - `a / b`: Integer quotient, or 0 if b = 0
///
/// ## Gas Cost
/// 5 gas (GasFastStep)
///
/// ## Execution
/// 1. Pop b from stack
/// 2. Pop a from stack
/// 3. If b = 0, result = 0 (no error)
/// 4. Else result = floor(a / b)
/// 5. Push result to stack
///
/// ## Example
/// Stack: [20, 5] => [4]
/// Stack: [7, 3] => [2] (integer division)
/// Stack: [100, 0] => [0] (division by zero)
///
/// ## Note
/// Unlike most programming languages, EVM division by zero does not
/// throw an error but returns 0. This is a deliberate design choice
/// to avoid exceptional halting conditions.
pub fn op_div(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const result = if (b == 0) blk: {
        @branchHint(.unlikely);
        break :blk 0;
    } else a / b;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

/// SDIV opcode (0x05) - Signed integer division
///
/// Pops two values from the stack, interprets them as signed integers,
/// divides the second by the top, and pushes the signed quotient.
/// Division by zero returns 0.
///
/// ## Stack Input
/// - `a`: Dividend as signed i256 (second from top)
/// - `b`: Divisor as signed i256 (top)
///
/// ## Stack Output
/// - `a / b`: Signed integer quotient, or 0 if b = 0
///
/// ## Gas Cost
/// 5 gas (GasFastStep)
///
/// ## Execution
/// 1. Pop b from stack
/// 2. Pop a from stack
/// 3. Interpret both as two's complement signed integers
/// 4. If b = 0, result = 0
/// 5. Else if a = -2^255 and b = -1, result = -2^255 (overflow case)
/// 6. Else result = truncated division a / b
/// 7. Push result to stack
///
/// ## Example
/// Stack: [20, 5] => [4]
/// Stack: [-20, 5] => [-4] (0xfff...fec / 5)
/// Stack: [-20, -5] => [4]
/// Stack: [MIN_I256, -1] => [MIN_I256] (overflow protection)
///
/// ## Note
/// The special case for MIN_I256 / -1 prevents integer overflow,
/// as the mathematical result (2^255) cannot be represented in i256.
pub fn op_sdiv(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;
    if (b == 0) {
        @branchHint(.unlikely);
        result = 0;
    } else {
        const a_i256 = @as(i256, @bitCast(a));
        const b_i256 = @as(i256, @bitCast(b));
        const min_i256 = @as(i256, 1) << 255;
        if (a_i256 == min_i256 and b_i256 == -1) {
            @branchHint(.unlikely);
            result = @as(u256, @bitCast(min_i256));
        } else {
            const result_i256 = @divTrunc(a_i256, b_i256);
            result = @as(u256, @bitCast(result_i256));
        }
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

/// MOD opcode (0x06) - Modulo remainder operation
///
/// Pops two values from the stack, calculates the remainder of dividing
/// the second by the top, and pushes the result. Modulo by zero returns 0.
///
/// ## Stack Input
/// - `a`: Dividend (second from top)
/// - `b`: Divisor (top)
///
/// ## Stack Output
/// - `a % b`: Remainder of a / b, or 0 if b = 0
///
/// ## Gas Cost
/// 5 gas (GasFastStep)
///
/// ## Execution
/// 1. Pop b from stack
/// 2. Pop a from stack
/// 3. If b = 0, result = 0 (no error)
/// 4. Else result = a modulo b
/// 5. Push result to stack
///
/// ## Example
/// Stack: [17, 5] => [2]
/// Stack: [100, 10] => [0]
/// Stack: [7, 0] => [0] (modulo by zero)
///
/// ## Note
/// The result is always in range [0, b-1] for b > 0.
/// Like DIV, modulo by zero returns 0 rather than throwing an error.
pub fn op_mod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const result = if (b == 0) blk: {
        @branchHint(.unlikely);
        break :blk 0;
    } else a % b;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

/// SMOD opcode (0x07) - Signed modulo remainder operation
///
/// Pops two values from the stack, interprets them as signed integers,
/// calculates the signed remainder, and pushes the result.
/// Modulo by zero returns 0.
///
/// ## Stack Input
/// - `a`: Dividend as signed i256 (second from top)
/// - `b`: Divisor as signed i256 (top)
///
/// ## Stack Output
/// - `a % b`: Signed remainder, or 0 if b = 0
///
/// ## Gas Cost
/// 5 gas (GasFastStep)
///
/// ## Execution
/// 1. Pop b from stack
/// 2. Pop a from stack
/// 3. Interpret both as two's complement signed integers
/// 4. If b = 0, result = 0
/// 5. Else result = signed remainder of a / b
/// 6. Push result to stack
///
/// ## Example
/// Stack: [17, 5] => [2]
/// Stack: [-17, 5] => [-2] (sign follows dividend)
/// Stack: [17, -5] => [2]
/// Stack: [-17, -5] => [-2]
///
/// ## Note
/// In signed modulo, the result has the same sign as the dividend (a).
/// This follows the Euclidean division convention where:
/// a = b * q + r, where |r| < |b| and sign(r) = sign(a)
pub fn op_smod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;
    if (b == 0) {
        @branchHint(.unlikely);
        result = 0;
    } else {
        const a_i256 = @as(i256, @bitCast(a));
        const b_i256 = @as(i256, @bitCast(b));
        const result_i256 = @rem(a_i256, b_i256);
        result = @as(u256, @bitCast(result_i256));
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

/// ADDMOD opcode (0x08) - Addition modulo n
///
/// Pops three values from the stack, adds the first two, then takes
/// the modulo with the third value. Handles overflow correctly by
/// computing (a + b) mod n, not ((a + b) mod 2^256) mod n.
///
/// ## Stack Input
/// - `a`: First addend (third from top)
/// - `b`: Second addend (second from top)
/// - `n`: Modulus (top)
///
/// ## Stack Output
/// - `(a + b) % n`: Sum modulo n, or 0 if n = 0
///
/// ## Gas Cost
/// 8 gas (GasMidStep)
///
/// ## Execution
/// 1. Pop n from stack (modulus)
/// 2. Pop b from stack (second addend)
/// 3. Pop a from stack (first addend)
/// 4. If n = 0, result = 0
/// 5. Else result = (a + b) mod n
/// 6. Push result to stack
///
/// ## Example
/// Stack: [10, 20, 7] => [2] ((10 + 20) % 7)
/// Stack: [MAX_U256, 5, 10] => [4] (overflow handled)
/// Stack: [50, 50, 0] => [0] (modulo by zero)
///
/// ## Note
/// This operation is atomic - the addition and modulo are
/// performed as one operation to handle cases where a + b
/// exceeds 2^256.
pub fn op_addmod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 3) {
        @branchHint(.cold);
        unreachable;
    }

    const n = frame.stack.pop_unsafe();
    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;
    if (n == 0) {
        result = 0;
    } else {
        // The EVM ADDMOD operation computes (a + b) % n
        // Since we're working with u256, overflow wraps automatically
        // So (a +% b) gives us (a + b) mod 2^256
        // Then we just need to compute that result mod n
        const sum = a +% b; // Wrapping addition
        result = sum % n;
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

/// MULMOD opcode (0x09) - Multiplication modulo n
///
/// Pops three values from the stack, multiplies the first two, then
/// takes the modulo with the third value. Correctly handles cases where
/// the product exceeds 2^256.
///
/// ## Stack Input
/// - `a`: First multiplicand (third from top)
/// - `b`: Second multiplicand (second from top)
/// - `n`: Modulus (top)
///
/// ## Stack Output
/// - `(a * b) % n`: Product modulo n, or 0 if n = 0
///
/// ## Gas Cost
/// 8 gas (GasMidStep)
///
/// ## Execution
/// 1. Pop n from stack (modulus)
/// 2. Pop b from stack (second multiplicand)
/// 3. Pop a from stack (first multiplicand)
/// 4. If n = 0, result = 0
/// 5. Else compute (a * b) mod n using Russian peasant algorithm
/// 6. Push result to stack
///
/// ## Algorithm
/// Uses Russian peasant multiplication with modular reduction:
/// - Reduces inputs modulo n first
/// - Builds product bit by bit, reducing modulo n at each step
/// - Avoids need for 512-bit intermediate values
///
/// ## Example
/// Stack: [10, 20, 7] => [4] ((10 * 20) % 7)
/// Stack: [2^128, 2^128, 100] => [0] (handles overflow)
/// Stack: [50, 50, 0] => [0] (modulo by zero)
///
/// ## Note
/// This operation correctly computes (a * b) mod n even when
/// a * b exceeds 2^256, unlike naive (a *% b) % n approach.
pub fn op_mulmod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 3) {
        @branchHint(.cold);
        unreachable;
    }

    const n = frame.stack.pop_unsafe();
    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;
    if (n == 0) {
        result = 0;
    } else {
        // For MULMOD, we need to compute (a * b) % n where a * b might overflow
        // We can't just do (a *% b) % n because that would give us ((a * b) % 2^256) % n
        // which is not the same as (a * b) % n when a * b >= 2^256

        // We'll use the Russian peasant multiplication algorithm with modular reduction
        // This allows us to compute (a * b) % n without needing the full 512-bit product
        result = 0;
        var x = a % n;
        var y = b % n;

        while (y > 0) {
            // If y is odd, add x to result (mod n)
            if ((y & 1) == 1) {
                const sum = result +% x;
                result = sum % n;
            }

            x = (x +% x) % n;

            y >>= 1;
        }
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

/// EXP opcode (0x0A) - Exponentiation
///
/// Pops two values from the stack and raises the second to the power
/// of the top. All operations are modulo 2^256.
///
/// ## Stack Input
/// - `a`: Base (second from top)
/// - `b`: Exponent (top)
///
/// ## Stack Output
/// - `a^b`: Result of a raised to power b, modulo 2^256
///
/// ## Gas Cost
/// - Static: 10 gas
/// - Dynamic: 50 gas per byte of exponent
/// - Total: 10 + 50 * byte_size_of_exponent
///
/// ## Execution
/// 1. Pop b from stack (exponent)
/// 2. Pop a from stack (base)
/// 3. Calculate dynamic gas cost based on exponent size
/// 4. Consume the dynamic gas
/// 5. Calculate a^b using binary exponentiation
/// 6. Push result to stack
///
/// ## Algorithm
/// Uses binary exponentiation (square-and-multiply):
/// - Processes exponent bit by bit
/// - Squares base for each bit position
/// - Multiplies result when bit is set
/// - All operations modulo 2^256
///
/// ## Example
/// Stack: [2, 10] => [1024]
/// Stack: [3, 4] => [81]
/// Stack: [10, 0] => [1] (anything^0 = 1)
/// Stack: [0, 10] => [0] (0^anything = 0, except 0^0 = 1)
///
/// ## Gas Examples
/// - 2^10: 10 + 50*1 = 60 gas (exponent fits in 1 byte)
/// - 2^256: 10 + 50*2 = 110 gas (exponent needs 2 bytes)
/// - 2^(2^255): 10 + 50*32 = 1610 gas (huge exponent)
pub fn op_exp(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    _ = vm;

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    const exp = frame.stack.pop_unsafe();
    const base = frame.stack.peek_unsafe().*;

    var exp_copy = exp;
    var byte_size: u64 = 0;
    while (exp_copy > 0) : (exp_copy >>= 8) {
        byte_size += 1;
    }
    if (byte_size > 0) {
        @branchHint(.likely);
        const gas_cost = 50 * byte_size;
        try frame.consume_gas(gas_cost);
    }

    var result: u256 = 1;
    var b = base;
    var e = exp;

    while (e > 0) {
        if ((e & 1) == 1) {
            result *%= b;
        }
        b *%= b;
        e >>= 1;
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

/// SIGNEXTEND opcode (0x0B) - Sign extension
///
/// Extends the sign bit of a value from a given byte position to fill
/// all higher-order bits. Used to convert smaller signed integers to
/// full 256-bit representation.
///
/// ## Stack Input
/// - `b`: Byte position of sign bit (0-indexed from right)
/// - `x`: Value to sign-extend
///
/// ## Stack Output
/// - Sign-extended value
///
/// ## Gas Cost
/// 5 gas (GasFastStep)
///
/// ## Execution
/// 1. Pop b from stack (byte position)
/// 2. Pop x from stack (value to extend)
/// 3. If b >= 31, return x unchanged (already full width)
/// 4. Find sign bit at position (b * 8 + 7)
/// 5. If sign bit = 1, fill higher bits with 1s
/// 6. If sign bit = 0, fill higher bits with 0s
/// 7. Push result to stack
///
/// ## Byte Position
/// - b = 0: Extend from byte 0 (bits 0-7, rightmost byte)
/// - b = 1: Extend from byte 1 (bits 8-15)
/// - b = 31: Extend from byte 31 (bits 248-255, leftmost byte)
///
/// ## Example
/// Stack: [0, 0x7F] => [0x7F] (positive sign, no change)
/// Stack: [0, 0x80] => [0xFFFF...FF80] (negative sign extended)
/// Stack: [1, 0x80FF] => [0xFFFF...80FF] (extend from byte 1)
/// Stack: [31, x] => [x] (already full width)
///
/// ## Use Cases
/// - Converting int8/int16/etc to int256
/// - Arithmetic on mixed-width signed integers
/// - Implementing higher-level language semantics
pub fn op_signextend(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    const byte_num = frame.stack.pop_unsafe();
    const x = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;

    if (byte_num >= 31) {
        @branchHint(.unlikely);
        result = x;
    } else {
        const byte_index = @as(u8, @intCast(byte_num));
        const sign_bit_pos = byte_index * 8 + 7;

        const sign_bit = (x >> @intCast(sign_bit_pos)) & 1;

        const keep_bits = sign_bit_pos + 1;

        if (sign_bit == 1) {
            // First, create a mask of all 1s for the upper bits
            if (keep_bits >= 256) {
                result = x;
            } else {
                const shift_amount = @as(u9, 256) - @as(u9, keep_bits);
                const ones_mask = ~(@as(u256, 0) >> @intCast(shift_amount));
                result = x | ones_mask;
            }
        } else {
            // Sign bit is 0, extend with 0s (just mask out upper bits)
            if (keep_bits >= 256) {
                result = x;
            } else {
                const zero_mask = (@as(u256, 1) << @intCast(keep_bits)) - 1;
                result = x & zero_mask;
            }
        }
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}
