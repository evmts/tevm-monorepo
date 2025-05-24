const std = @import("std");

// STOP opcode value
pub const STOP_OPCODE: u8 = 0x00;

// Use relative imports to avoid circular dependencies
const interpreterModule = @import("interpreter.zig");
const Interpreter = interpreterModule.Interpreter;
const InterpreterState = @import("InterpreterState.zig").InterpreterState;
pub const Stack = @import("Stack.zig").Stack;
// Don't import JumpTable directly to avoid circular dependencies
// The JumpTable types are defined in the package.zig file

// Opcode dispatch performance comparison:
//
// Current approach: Struct with function pointers
// - revm: Macro-generated match statement (https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions.rs)
// - evmone: Jump table with computed goto (https://github.com/ethereum/evmone/blob/master/lib/evmone/instruction_names.cpp)
//
// Critical performance insights:
// 1. evmone's computed goto eliminates branch prediction misses
// 2. revm's macro approach enables aggressive inlining
// 3. Both avoid struct overhead for opcode metadata
//
// Suggested optimization: Generate opcodes at comptime with inline dispatch

// MemorySize represents memory expansion requirements for EVM operations
///
// This is used by opcodes that need to calculate memory expansion costs
// and ensure memory is properly sized before execution.
pub const MemorySize = struct {
    /// Size in bytes needed for memory expansion
    size: u32,

    /// Whether the calculation resulted in an overflow
    /// This is used to detect and handle arithmetic overflow errors
    overflow: bool,
};

// ExecutionError represents errors that can occur during EVM execution
///
// These are the fundamental stop/error conditions that can terminate
// an EVM operation during execution.
pub const ExecutionError_Op = error{
    /// Normal stop (STOP opcode)
    STOP,

    /// Revert operation (REVERT opcode)
    REVERT,

    /// Invalid operation (INVALID opcode or invalid state)
    INVALID,
};

pub const STOP = struct {
    constantGas: u32 = 0,
    minStack: u32 = 0,
    maxStack: u32 = 1028,
    dynamicGas: u32 = 0,
    pub fn execute(_: usize, _: *Interpreter, _: *InterpreterState) ExecutionError_Op![]const u8 {
        return ExecutionError_Op.STOP;
    }
    // Not needed with STOP but might be needed for future opcodes
    // fn getMemorySize(_: Stack) MemorySize {
    //   return MemorySize{ .size = 0, .overflow = false };
    // }
};

// Arithmetic operations performance comparison:
// - revm: Uses unsafe stack operations and inline arithmetic (https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions/arithmetic.rs#L13)
// - evmone: Direct pointer arithmetic with no bounds checks (https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_arithmetic.cpp#L15)
//
// Key optimizations:
// 1. evmone uses combined pop2_push1 pattern to minimize stack operations
// 2. revm uses wrapping operations to avoid overflow checks
// 3. Both use specialized 256-bit arithmetic libraries
const ADD = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = interpreter; // autofix
        _ = pc; // autofix
        // Pop two values from stack
        // Performance issue: Individual pop operations vs bulk pop
        // evmone optimization: pop2_push1(&stack.top(), a + b)
        const x = state.stack.pop();
        const y = state.stack.peek();
        // Add them and store result in y
        y.add(&x, y);
        return "";
    }
};

const MUL = struct {
    constantGas: u32 = 5, // GasFastStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop two values from stack, multiply them, and push result
        return "";
    }
};

const SUB = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop two values from stack, subtract second from first, and push result
        return "";
    }
};

const DIV = struct {
    constantGas: u32 = 5, // GasFastStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop two values from stack, divide first by second, and push result
        // Handle division by zero
        return "";
    }
};

const SDIV = struct {
    constantGas: u32 = 5, // GasFastStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop two values from stack, perform signed division, and push result
        // Handle division by zero
        return "";
    }
};

const MOD = struct {
    constantGas: u32 = 5, // GasFastStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop two values from stack, calculate modulo, and push result
        // Handle modulo by zero
        return "";
    }
};

const SMOD = struct {
    constantGas: u32 = 5, // GasFastStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop two values from stack, calculate signed modulo, and push result
        // Handle modulo by zero
        return "";
    }
};

const ADDMOD = struct {
    constantGas: u32 = 8, // GasMidStep
    minStack: u32 = 3,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop three values from stack, add first two modulo third, and push result
        // Handle modulo by zero
        return "";
    }
};

// MULMOD/ADDMOD optimization comparison:
// - revm: Uses specialized bigint library for 512-bit intermediate results (https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions/arithmetic.rs#L170)
// - evmone: Custom uint512 type with optimized multiplication (https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_arithmetic.cpp#L140)
//
// Critical optimization: Avoiding full 512-bit arithmetic when possible
// evmone checks if result fits in 256 bits before using expensive path
const MULMOD = struct {
    constantGas: u32 = 8, // GasMidStep
    minStack: u32 = 3,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop three values from stack, multiply first two modulo third, and push result
        // Handle modulo by zero
        // Performance note: Need 512-bit intermediate for correct overflow handling
        return "";
    }
};
const EXP = struct {
    constantGas: u32 = 10, // Base cost, actual cost is dynamic
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 50, // Additional dynamic calculation needed per byte in exponent
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop base and exponent from stack, calculate base^exponent, and push result
        return "";
    }
};

const SIGNEXTEND = struct {
    constantGas: u32 = 5, // GasFastStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop byte position and value from stack, sign extend the value from the specified byte position
        return "";
    }
};

const LT = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop two values from stack, compare (first < second), push 1 if true, 0 if false
        return "";
    }
};

const GT = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop two values from stack, compare (first > second), push 1 if true, 0 if false
        return "";
    }
};

const SLT = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop two values from stack, compare signed (first < second), push 1 if true, 0 if false
        return "";
    }
};

const SGT = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop two values from stack, compare signed (first > second), push 1 if true, 0 if false
        return "";
    }
};

const EQ = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop two values from stack, compare equality, push 1 if equal, 0 if not equal
        return "";
    }
};

const ISZERO = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop value from stack, push 1 if value is zero, 0 otherwise
        return "";
    }
};

const AND = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop two values from stack, compute bitwise AND, push result
        return "";
    }
};

const OR = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop two values from stack, compute bitwise OR, push result
        return "";
    }
};

const XOR = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop two values from stack, compute bitwise XOR, push result
        return "";
    }
};

const NOT = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop value from stack, compute bitwise NOT, push result
        return "";
    }
};

const BYTE = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop position and value, extract byte at position from value, push result
        return "";
    }
};

const SHL = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop shift and value, compute (value << shift), push result
        return "";
    }
};

const SHR = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop shift and value, compute (value >> shift), push result
        return "";
    }
};

const SAR = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop shift and value, compute arithmetic right shift, push result
        return "";
    }
};

const KECCAK256 = struct {
    constantGas: u32 = 30, // Keccak256Gas
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 6, // Per word, plus memory expansion cost
    fn getMemorySize(stack: Stack) MemorySize {
        if (stack.size < 2) {
            return MemorySize{ .size = 0, .overflow = false };
        }

        // Stack has [offset, size]
        // We need to get the memory size required to perform the operation
        // First, we need a copy of the stack to avoid modifying it
        const offset = stack.data[stack.size - 2];
        const size = stack.data[stack.size - 1];

        // If size is 0, no memory expansion is needed
        if (size == 0) {
            return MemorySize{ .size = 0, .overflow = false };
        }

        // Calculate the memory size required (offset + size, rounded up to next multiple of 32)
        var total_size: u64 = undefined;

        // Check for overflow when adding offset and size
        const add_result = @addWithOverflow(offset, size);
        if (add_result[1] != 0) {
            return MemorySize{ .size = 0, .overflow = true };
        }
        total_size = add_result[0];

        // Calculate memory size with proper alignment (32 bytes)
        const words = (total_size + 31) / 32;
        const memory_size = words * 32;

        return MemorySize{ .size = memory_size, .overflow = false };
    }
    fn execute(pc: usize, _: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc;

        // Pop offset and size from stack
        if (state.stack.size < 2) {
            return ExecutionError_Op.StackUnderflow;
        }

        const size = try state.stack.pop();
        const offset = try state.stack.pop();

        // If size is 0, return empty hash (all zeros)
        if (size == 0) {
            try state.stack.push(0);
            return "";
        }

        // Get memory range to hash
        const mem_offset = @as(u64, offset); // Convert to u64
        const mem_size = @as(u64, size); // Convert to u64

        // Make sure the memory access is valid
        if (mem_offset + mem_size > state.memory.data().len) {
            return ExecutionError_Op.OutOfOffset;
        }

        // Get memory slice to hash
        const data = state.memory.data()[mem_offset .. mem_offset + mem_size];

        // Calculate keccak256 hash
        var hash: [32]u8 = undefined;
        std.crypto.hash.sha3.Keccak256.hash(data, &hash, .{});

        // Convert hash to u256 and push to stack
        const hash_value = bytesToUint256(hash);
        try state.stack.push(hash_value);

        return "";
    }
};

// Helper function to convert bytes to u256
fn bytesToUint256(bytes: [32]u8) u256 {
    var result: u256 = 0;

    for (bytes, 0..) |byte, i| {
        // Shift and OR each byte into the result
        // For big-endian, start with most significant byte (index 0)
        const shift_amount = (31 - i) * 8;
        result |= @as(u256, byte) << shift_amount;
    }

    return result;
}

const ADDRESS = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Push the address of the current executing account
        return "";
    }
};

const BALANCE = struct {
    constantGas: u32 = 700, // Later versions reduced this cost
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop address, push balance of that address
        return "";
    }
};

const ORIGIN = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Push the address of the original transaction sender
        return "";
    }
};

const CALLER = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Push the address of the caller
        return "";
    }
};

const CALLVALUE = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Push the value sent with the current call
        return "";
    }
};

const CALLDATALOAD = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop offset, push 32 bytes of calldata starting at that offset
        return "";
    }
};

const CALLDATASIZE = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Push size of calldata
        return "";
    }
};

const CALLDATACOPY = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 3,
    maxStack: u32 = 0,
    dynamicGas: u32 = 3, // Per word, plus memory expansion
    fn getMemorySize(stack: Stack) MemorySize {
        _ = stack; // autofix
        // Calculate memory expansion size based on memOffset and size from stack
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop memOffset, dataOffset, and size
        // Copy call data from dataOffset to memory at memOffset
        return "";
    }
};

const CODESIZE = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Push size of code running in current environment
        return "";
    }
};

const CODECOPY = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 3,
    maxStack: u32 = 0,
    dynamicGas: u32 = 3, // Per word, plus memory expansion
    fn getMemorySize(stack: Stack) MemorySize {
        _ = stack; // autofix
        // Calculate memory expansion size based on memOffset and size from stack
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop memOffset, codeOffset, and size
        // Copy code from codeOffset to memory at memOffset
        return "";
    }
};

const GASPRICE = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Push the gas price used in the current transaction
        return "";
    }
};

const EXTCODESIZE = struct {
    constantGas: u32 = 700, // Later versions reduced this
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop address, push size of code at that address
        return "";
    }
};

const EXTCODECOPY = struct {
    constantGas: u32 = 700, // Later versions reduced this
    minStack: u32 = 4,
    maxStack: u32 = 0,
    dynamicGas: u32 = 3, // Per word, plus memory expansion
    fn getMemorySize(stack: Stack) MemorySize {
        _ = stack; // autofix
        // Calculate memory expansion size based on memOffset and size from stack
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop address, memOffset, codeOffset, and size
        // Copy code of the specified account from codeOffset to memory at memOffset
        return "";
    }
};

const RETURNDATASIZE = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Push size of data returned from most recent call
        return "";
    }
};

const RETURNDATACOPY = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 3,
    maxStack: u32 = 0,
    dynamicGas: u32 = 3, // Per word, plus memory expansion
    fn getMemorySize(stack: Stack) MemorySize {
        _ = stack; // autofix
        // Calculate memory expansion size based on memOffset and size from stack
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop memOffset, dataOffset, and size
        // Copy return data from dataOffset to memory at memOffset
        return "";
    }
};

const EXTCODEHASH = struct {
    constantGas: u32 = 700, // ExtcodeHashGasConstantinople
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop address, push hash of the code at that address
        return "";
    }
};

const BLOCKHASH = struct {
    constantGas: u32 = 20, // GasExtStep
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop block number, push hash of that block
        return "";
    }
};

const COINBASE = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Push address of the current block's miner
        return "";
    }
};

const TIMESTAMP = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Push timestamp of the current block
        return "";
    }
};

const NUMBER = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Push current block number
        return "";
    }
};

const PREVRANDAO = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Push RANDAO value from current block
        // This is the new opcode that replaced DIFFICULTY after The Merge
        return "";
    }
};

const GASLIMIT = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Push gas limit of the current block
        return "";
    }
};

const CHAINID = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Push chain ID
        return "";
    }
};

const SELFBALANCE = struct {
    constantGas: u32 = 5, // GasFastStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Push balance of the current contract
        return "";
    }
};

const BASEFEE = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Push base fee of the current block (post-EIP 1559)
        return "";
    }
};

const BLOBHASH = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop index, push hash of blob at that index (EIP-4844)
        return "";
    }
};

const BLOBBASEFEE = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Push blob base fee of the current block (EIP-7516)
        return "";
    }
};

const POP = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 1,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop value from stack and discard it
        return "";
    }
};

const MLOAD = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0, // Plus memory expansion
    fn getMemorySize(stack: Stack) MemorySize {
        _ = stack; // autofix
        // Calculate memory expansion size based on offset from stack
        return MemorySize{ .size = 32, .overflow = false }; // 32 bytes read
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop offset, push value from memory at that offset
        return "";
    }
};

const MSTORE = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0, // Plus memory expansion
    fn getMemorySize(stack: Stack) MemorySize {
        _ = stack; // autofix
        // Calculate memory expansion size based on offset from stack
        return MemorySize{ .size = 32, .overflow = false }; // 32 bytes written
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop offset and value, store value in memory at offset
        return "";
    }
};

const MSTORE8 = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0, // Plus memory expansion
    fn getMemorySize(stack: Stack) MemorySize {
        _ = stack; // autofix
        // Calculate memory expansion size based on offset from stack
        return MemorySize{ .size = 1, .overflow = false }; // 1 byte written
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop offset and value, store least significant byte in memory at offset
        return "";
    }
};

const SLOAD = struct {
    constantGas: u32 = 800, // SloadGas (post-London)
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop key, push value from storage at that key
        return "";
    }
};

const SSTORE = struct {
    constantGas: u32 = 0, // All costs are dynamic
    minStack: u32 = 2,
    maxStack: u32 = 0,
    dynamicGas: u32 = 20000, // Base cost, actual cost depends on value being set
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop key and value, store value in storage at key
        return "";
    }
};

const JUMP = struct {
    constantGas: u32 = 8, // GasMidStep
    minStack: u32 = 1,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop destination, set PC to destination
        // Must validate destination is a JUMPDEST
        return "";
    }
};

const JUMPI = struct {
    constantGas: u32 = 10, // GasSlowStep
    minStack: u32 = 2,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop destination and condition
        // If condition is not zero, set PC to destination
        // Must validate destination is a JUMPDEST
        return "";
    }
};

const PC = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Push current program counter
        return "";
    }
};

const MSIZE = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Push current memory size in bytes
        return "";
    }
};

const GAS = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Push remaining gas
        return "";
    }
};

const JUMPDEST = struct {
    constantGas: u32 = 1, // JumpdestGas
    minStack: u32 = 0,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Mark valid jump destination, no operation performed
        return "";
    }
};

const TLOAD = struct {
    constantGas: u32 = 100, // Approximate cost
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop key, push value from transient storage at that key (EIP-1153)
        return "";
    }
};

const TSTORE = struct {
    constantGas: u32 = 100, // Approximate cost
    minStack: u32 = 2,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop key and value, store value in transient storage at key (EIP-1153)
        return "";
    }
};

const MCOPY = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 3,
    maxStack: u32 = 0,
    dynamicGas: u32 = 3, // Per word, plus memory expansion
    fn getMemorySize(stack: Stack) MemorySize {
        _ = stack; // autofix
        // Calculate memory expansion size based on dest, source, and size from stack
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop dest, source, and size
        // Copy memory from source to dest for size bytes (EIP-5656)
        return "";
    }
};

const PUSH0 = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Push zero onto the stack (EIP-3855)
        return "";
    }
};

// Define PUSH1 through PUSH32
const PUSH1 = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Push 1 byte onto stack from code after PC
        return "";
    }
};

// Define DUP1 through DUP16
const DUP1 = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 1,
    maxStack: u32 = 2,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Duplicate the 1st stack item
        return "";
    }
};

// Define SWAP1 through SWAP16
const SWAP1 = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 2,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Swap 1st and 2nd stack items
        return "";
    }
};

// Define LOGx operations
const LOG0 = struct {
    constantGas: u32 = 375, // LogGas
    minStack: u32 = 2,
    maxStack: u32 = 0,
    dynamicGas: u32 = 8, // LogDataGas per byte, plus memory expansion
    fn getMemorySize(stack: Stack) MemorySize {
        _ = stack; // autofix
        // Calculate memory expansion size based on offset and size from stack
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop offset and size, log data from memory with no topics
        return "";
    }
};

const LOG1 = struct {
    constantGas: u32 = 750, // LogGas + LogTopicGas
    minStack: u32 = 3,
    maxStack: u32 = 0,
    dynamicGas: u32 = 8, // LogDataGas per byte, plus memory expansion
    fn getMemorySize(stack: Stack) MemorySize {
        _ = stack; // autofix
        // Calculate memory expansion size based on offset and size from stack
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop offset, size, and topic1, log data from memory with 1 topic
        return "";
    }
};

const LOG2 = struct {
    constantGas: u32 = 1125, // LogGas + 2*LogTopicGas
    minStack: u32 = 4,
    maxStack: u32 = 0,
    dynamicGas: u32 = 8, // LogDataGas per byte, plus memory expansion
    fn getMemorySize(stack: Stack) MemorySize {
        _ = stack; // autofix
        // Calculate memory expansion size based on offset and size from stack
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop offset, size, topic1, and topic2, log data from memory with 2 topics
        return "";
    }
};

const LOG3 = struct {
    constantGas: u32 = 1500, // LogGas + 3*LogTopicGas
    minStack: u32 = 5,
    maxStack: u32 = 0,
    dynamicGas: u32 = 8, // LogDataGas per byte, plus memory expansion
    fn getMemorySize(stack: Stack) MemorySize {
        _ = stack; // autofix
        // Calculate memory expansion size based on offset and size from stack
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop offset, size, topic1, topic2, and topic3, log data from memory with 3 topics
        return "";
    }
};

const LOG4 = struct {
    constantGas: u32 = 1875, // LogGas + 4*LogTopicGas
    minStack: u32 = 6,
    maxStack: u32 = 0,
    dynamicGas: u32 = 8, // LogDataGas per byte, plus memory expansion
    fn getMemorySize(stack: Stack) MemorySize {
        _ = stack; // autofix
        // Calculate memory expansion size based on offset and size from stack
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop offset, size, topic1, topic2, topic3, and topic4, log data from memory with 4 topics
        return "";
    }
};

// Create/call operations
const CREATE = struct {
    constantGas: u32 = 32000, // CreateGas
    minStack: u32 = 3,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0, // Complex calculation based on execution, plus memory expansion
    fn getMemorySize(stack: Stack) MemorySize {
        _ = stack; // autofix
        // Calculate memory expansion size based on offset and size from stack
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop value, offset, and size
        // Create a new contract with code from memory and value
        return "";
    }
};

const CALL = struct {
    constantGas: u32 = 700, // CallGas (post-Tangerine Whistle)
    minStack: u32 = 7,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0, // Complex calculation based on value transfer and new account
    fn getMemorySize(stack: Stack) MemorySize {
        _ = stack; // autofix
        // Calculate memory expansion from inOffset, inSize, outOffset, outSize
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop gas, address, value, inOffset, inSize, outOffset, outSize
        // Call the specified address with the given inputs
        return "";
    }
};

const CALLCODE = struct {
    constantGas: u32 = 700, // CallGas (post-Tangerine Whistle)
    minStack: u32 = 7,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0, // Complex calculation based on value transfer
    fn getMemorySize(stack: Stack) MemorySize {
        _ = stack; // autofix
        // Calculate memory expansion from inOffset, inSize, outOffset, outSize
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop gas, address, value, inOffset, inSize, outOffset, outSize
        // Call the specified code with the current contract's context
        return "";
    }
};

const RETURN = struct {
    constantGas: u32 = 0,
    minStack: u32 = 2,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0, // Memory expansion only
    fn getMemorySize(stack: Stack) MemorySize {
        _ = stack; // autofix
        // Calculate memory expansion from offset and size
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop offset and size, return data from memory
        return "";
    }
};

const DELEGATECALL = struct {
    constantGas: u32 = 700, // CallGas (post-Tangerine Whistle)
    minStack: u32 = 6,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0, // Complex calculation
    fn getMemorySize(stack: Stack) MemorySize {
        _ = stack; // autofix
        // Calculate memory expansion from inOffset, inSize, outOffset, outSize
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop gas, address, inOffset, inSize, outOffset, outSize
        // Call the specified code with the sender and value of the current contract
        return "";
    }
};

const CREATE2 = struct {
    constantGas: u32 = 32000, // CreateGas
    minStack: u32 = 4,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0, // Complex calculation including hash cost
    fn getMemorySize(stack: Stack) MemorySize {
        _ = stack; // autofix
        // Calculate memory expansion from offset and size
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop value, offset, size, and salt
        // Create a new contract with deterministic address
        return "";
    }
};

const STATICCALL = struct {
    constantGas: u32 = 700, // CallGas (post-Tangerine Whistle)
    minStack: u32 = 6,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0, // Complex calculation
    fn getMemorySize(stack: Stack) MemorySize {
        _ = stack; // autofix
        // Calculate memory expansion from inOffset, inSize, outOffset, outSize
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop gas, address, inOffset, inSize, outOffset, outSize
        // Call the specified address with static restrictions (no state changes)
        return "";
    }
};

const REVERT = struct {
    constantGas: u32 = 0,
    minStack: u32 = 2,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0, // Memory expansion only
    fn getMemorySize(stack: Stack) MemorySize {
        _ = stack; // autofix
        // Calculate memory expansion from offset and size
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop offset and size, revert state changes and return data from memory
        return ExecutionError_Op.REVERT;
    }
};

const INVALID = struct {
    constantGas: u32 = 0,
    minStack: u32 = 0,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0,
    pub fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Invalid operation
        return ExecutionError_Op.INVALID;
    }
};

const SELFDESTRUCT = struct {
    constantGas: u32 = 5000, // Base cost, dynamic in recent versions
    minStack: u32 = 1,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0, // Additional cost based on whether account already has balance
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop beneficiary address, destroy current contract and send funds to beneficiary
        return "";
    }
};

const RETURNDATALOAD = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // Pop offset from stack, load return data at that offset
        return "";
    }
};

const EXTCALL = struct {
    constantGas: u32 = 700, // CallGas (post-Tangerine Whistle)
    minStack: u32 = 7,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn getMemorySize(stack: Stack) MemorySize {
        _ = stack; // autofix
        return MemorySize{ .size = 0, .overflow = false };
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // External call operation
        return "";
    }
};

const EXTDELEGATECALL = struct {
    constantGas: u32 = 700, // CallGas (post-Tangerine Whistle)
    minStack: u32 = 6,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn getMemorySize(stack: Stack) MemorySize {
        _ = stack; // autofix
        return MemorySize{ .size = 0, .overflow = false };
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // External delegate call operation
        return "";
    }
};

const EXTSTATICCALL = struct {
    constantGas: u32 = 700, // CallGas (post-Tangerine Whistle)
    minStack: u32 = 6,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn getMemorySize(stack: Stack) MemorySize {
        _ = stack; // autofix
        return MemorySize{ .size = 0, .overflow = false };
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError_Op![]const u8 {
        _ = pc; // autofix
        _ = interpreter; // autofix
        _ = state; // autofix
        // External static call operation
        return "";
    }
};

// Now let's create the complete Operation union
pub const Operation = union(enum) {
    STOP: STOP,
    ADD: ADD,
    MUL: MUL,
    SUB: SUB,
    DIV: DIV,
    SDIV: SDIV,
    MOD: MOD,
    SMOD: SMOD,
    ADDMOD: ADDMOD,
    MULMOD: MULMOD,
    EXP: EXP,
    SIGNEXTEND: SIGNEXTEND,
    LT: LT,
    GT: GT,
    SLT: SLT,
    SGT: SGT,
    EQ: EQ,
    ISZERO: ISZERO,
    AND: AND,
    OR: OR,
    XOR: XOR,
    NOT: NOT,
    BYTE: BYTE,
    SHL: SHL,
    SHR: SHR,
    SAR: SAR,
    KECCAK256: KECCAK256,
    ADDRESS: ADDRESS,
    BALANCE: BALANCE,
    ORIGIN: ORIGIN,
    CALLER: CALLER,
    CALLVALUE: CALLVALUE,
    CALLDATALOAD: CALLDATALOAD,
    CALLDATASIZE: CALLDATASIZE,
    CALLDATACOPY: CALLDATACOPY,
    CODESIZE: CODESIZE,
    CODECOPY: CODECOPY,
    GASPRICE: GASPRICE,
    EXTCODESIZE: EXTCODESIZE,
    EXTCODECOPY: EXTCODECOPY,
    RETURNDATASIZE: RETURNDATASIZE,
    RETURNDATACOPY: RETURNDATACOPY,
    EXTCODEHASH: EXTCODEHASH,
    BLOCKHASH: BLOCKHASH,
    COINBASE: COINBASE,
    TIMESTAMP: TIMESTAMP,
    NUMBER: NUMBER,
    PREVRANDAO: PREVRANDAO,
    GASLIMIT: GASLIMIT,
    CHAINID: CHAINID,
    SELFBALANCE: SELFBALANCE,
    BASEFEE: BASEFEE,
    BLOBHASH: BLOBHASH,
    BLOBBASEFEE: BLOBBASEFEE,
    POP: POP,
    MLOAD: MLOAD,
    MSTORE: MSTORE,
    MSTORE8: MSTORE8,
    SLOAD: SLOAD,
    SSTORE: SSTORE,
    JUMP: JUMP,
    JUMPI: JUMPI,
    PC: PC,
    MSIZE: MSIZE,
    GAS: GAS,
    JUMPDEST: JUMPDEST,
    TLOAD: TLOAD,
    TSTORE: TSTORE,
    MCOPY: MCOPY,
    PUSH0: PUSH0,
    PUSH1: PUSH1,
    // PUSH2 through PUSH32 would be included here
    DUP1: DUP1,
    // DUP2 through DUP16 would be included here
    SWAP1: SWAP1,
    // SWAP2 through SWAP16 would be included here
    LOG0: LOG0,
    LOG1: LOG1,
    LOG2: LOG2,
    LOG3: LOG3,
    LOG4: LOG4,
    CREATE: CREATE,
    CALL: CALL,
    CALLCODE: CALLCODE,
    RETURN: RETURN,
    DELEGATECALL: DELEGATECALL,
    CREATE2: CREATE2,
    STATICCALL: STATICCALL,
    REVERT: REVERT,
    INVALID: INVALID,
    SELFDESTRUCT: SELFDESTRUCT,
    RETURNDATALOAD: RETURNDATALOAD,
    EXTCALL: EXTCALL,
    EXTDELEGATECALL: EXTDELEGATECALL,
    EXTSTATICCALL: EXTSTATICCALL,
};

// A function to get an operation by opcode byte
pub fn getOperation(opcode: u8) Operation {
    return switch (opcode) {
        0x00 => Operation{ .STOP = STOP{} },
        0x01 => Operation{ .ADD = ADD{} },
        0x02 => Operation{ .MUL = MUL{} },
        0x03 => Operation{ .SUB = SUB{} },
        0x04 => Operation{ .DIV = DIV{} },
        0x05 => Operation{ .SDIV = SDIV{} },
        0x06 => Operation{ .MOD = MOD{} },
        0x07 => Operation{ .SMOD = SMOD{} },
        0x08 => Operation{ .ADDMOD = ADDMOD{} },
        0x09 => Operation{ .MULMOD = MULMOD{} },
        0x0A => Operation{ .EXP = EXP{} },
        0x0B => Operation{ .SIGNEXTEND = SIGNEXTEND{} },
        0x10 => Operation{ .LT = LT{} },
        0x11 => Operation{ .GT = GT{} },
        0x12 => Operation{ .SLT = SLT{} },
        0x13 => Operation{ .SGT = SGT{} },
        0x14 => Operation{ .EQ = EQ{} },
        0x15 => Operation{ .ISZERO = ISZERO{} },
        0x16 => Operation{ .AND = AND{} },
        0x17 => Operation{ .OR = OR{} },
        0x18 => Operation{ .XOR = XOR{} },
        0x19 => Operation{ .NOT = NOT{} },
        0x1A => Operation{ .BYTE = BYTE{} },
        0x1B => Operation{ .SHL = SHL{} },
        0x1C => Operation{ .SHR = SHR{} },
        0x1D => Operation{ .SAR = SAR{} },
        0x20 => Operation{ .KECCAK256 = KECCAK256{} },
        0x30 => Operation{ .ADDRESS = ADDRESS{} },
        0x31 => Operation{ .BALANCE = BALANCE{} },
        0x32 => Operation{ .ORIGIN = ORIGIN{} },
        0x33 => Operation{ .CALLER = CALLER{} },
        0x34 => Operation{ .CALLVALUE = CALLVALUE{} },
        0x35 => Operation{ .CALLDATALOAD = CALLDATALOAD{} },
        0x36 => Operation{ .CALLDATASIZE = CALLDATASIZE{} },
        0x37 => Operation{ .CALLDATACOPY = CALLDATACOPY{} },
        0x38 => Operation{ .CODESIZE = CODESIZE{} },
        0x39 => Operation{ .CODECOPY = CODECOPY{} },
        0x3A => Operation{ .GASPRICE = GASPRICE{} },
        0x3B => Operation{ .EXTCODESIZE = EXTCODESIZE{} },
        0x3C => Operation{ .EXTCODECOPY = EXTCODECOPY{} },
        0x3D => Operation{ .RETURNDATASIZE = RETURNDATASIZE{} },
        0x3E => Operation{ .RETURNDATACOPY = RETURNDATACOPY{} },
        0x3F => Operation{ .EXTCODEHASH = EXTCODEHASH{} },
        0x40 => Operation{ .BLOCKHASH = BLOCKHASH{} },
        0x41 => Operation{ .COINBASE = COINBASE{} },
        0x42 => Operation{ .TIMESTAMP = TIMESTAMP{} },
        0x43 => Operation{ .NUMBER = NUMBER{} },
        0x44 => Operation{ .PREVRANDAO = PREVRANDAO{} },
        0x45 => Operation{ .GASLIMIT = GASLIMIT{} },
        0x46 => Operation{ .CHAINID = CHAINID{} },
        0x47 => Operation{ .SELFBALANCE = SELFBALANCE{} },
        0x48 => Operation{ .BASEFEE = BASEFEE{} },
        0x49 => Operation{ .BLOBHASH = BLOBHASH{} },
        0x4A => Operation{ .BLOBBASEFEE = BLOBBASEFEE{} },
        0x50 => Operation{ .POP = POP{} },
        0x51 => Operation{ .MLOAD = MLOAD{} },
        0x52 => Operation{ .MSTORE = MSTORE{} },
        0x53 => Operation{ .MSTORE8 = MSTORE8{} },
        0x54 => Operation{ .SLOAD = SLOAD{} },
        0x55 => Operation{ .SSTORE = SSTORE{} },
        0x56 => Operation{ .JUMP = JUMP{} },
        0x57 => Operation{ .JUMPI = JUMPI{} },
        0x58 => Operation{ .PC = PC{} },
        0x59 => Operation{ .MSIZE = MSIZE{} },
        0x5A => Operation{ .GAS = GAS{} },
        0x5B => Operation{ .JUMPDEST = JUMPDEST{} },
        0x5C => Operation{ .TLOAD = TLOAD{} },
        0x5D => Operation{ .TSTORE = TSTORE{} },
        0x5E => Operation{ .MCOPY = MCOPY{} },
        0x5F => Operation{ .PUSH0 = PUSH0{} },
        0x60 => Operation{ .PUSH1 = PUSH1{} },
        // 0x61..0x7F => PUSH2..PUSH32
        0x80 => Operation{ .DUP1 = DUP1{} },
        // 0x81..0x8F => DUP2..DUP16
        0x90 => Operation{ .SWAP1 = SWAP1{} },
        // 0x91..0x9F => SWAP2..SWAP16
        0xA0 => Operation{ .LOG0 = LOG0{} },
        0xA1 => Operation{ .LOG1 = LOG1{} },
        0xA2 => Operation{ .LOG2 = LOG2{} },
        0xA3 => Operation{ .LOG3 = LOG3{} },
        0xA4 => Operation{ .LOG4 = LOG4{} },
        0xF0 => Operation{ .CREATE = CREATE{} },
        0xF1 => Operation{ .CALL = CALL{} },
        0xF2 => Operation{ .CALLCODE = CALLCODE{} },
        0xF3 => Operation{ .RETURN = RETURN{} },
        0xF4 => Operation{ .DELEGATECALL = DELEGATECALL{} },
        0xF5 => Operation{ .CREATE2 = CREATE2{} },
        0xFA => Operation{ .STATICCALL = STATICCALL{} },
        0xFD => Operation{ .REVERT = REVERT{} },
        0xFE => Operation{ .INVALID = INVALID{} },
        0xFF => Operation{ .SELFDESTRUCT = SELFDESTRUCT{} },
        0xF7 => Operation{ .RETURNDATALOAD = RETURNDATALOAD{} },
        0xF8 => Operation{ .EXTCALL = EXTCALL{} },
        0xF9 => Operation{ .EXTDELEGATECALL = EXTDELEGATECALL{} },
        0xFB => Operation{ .EXTSTATICCALL = EXTSTATICCALL{} },
        else => Operation{ .INVALID = INVALID{} }, // Default to INVALID for undefined opcodes
    };
}

// Function to get the string name of an opcode
pub fn getOpcodeName(opcode: u8) []const u8 {
    return switch (opcode) {
        0x00 => "STOP",
        0x01 => "ADD",
        0x02 => "MUL",
        0x03 => "SUB",
        0x04 => "DIV",
        0x05 => "SDIV",
        0x06 => "MOD",
        0x07 => "SMOD",
        0x08 => "ADDMOD",
        0x09 => "MULMOD",
        0x0A => "EXP",
        0x0B => "SIGNEXTEND",
        0x10 => "LT",
        0x11 => "GT",
        0x12 => "SLT",
        0x13 => "SGT",
        0x14 => "EQ",
        0x15 => "ISZERO",
        0x16 => "AND",
        0x17 => "OR",
        0x18 => "XOR",
        0x19 => "NOT",
        0x1A => "BYTE",
        0x1B => "SHL",
        0x1C => "SHR",
        0x1D => "SAR",
        0x20 => "KECCAK256",
        0x30 => "ADDRESS",
        0x31 => "BALANCE",
        0x32 => "ORIGIN",
        0x33 => "CALLER",
        0x34 => "CALLVALUE",
        0x35 => "CALLDATALOAD",
        0x36 => "CALLDATASIZE",
        0x37 => "CALLDATACOPY",
        0x38 => "CODESIZE",
        0x39 => "CODECOPY",
        0x3A => "GASPRICE",
        0x3B => "EXTCODESIZE",
        0x3C => "EXTCODECOPY",
        0x3D => "RETURNDATASIZE",
        0x3E => "RETURNDATACOPY",
        0x3F => "EXTCODEHASH",
        0x40 => "BLOCKHASH",
        0x41 => "COINBASE",
        0x42 => "TIMESTAMP",
        0x43 => "NUMBER",
        0x44 => "PREVRANDAO",
        0x45 => "GASLIMIT",
        0x46 => "CHAINID",
        0x47 => "SELFBALANCE",
        0x48 => "BASEFEE",
        0x49 => "BLOBHASH",
        0x4A => "BLOBBASEFEE",
        0x50 => "POP",
        0x51 => "MLOAD",
        0x52 => "MSTORE",
        0x53 => "MSTORE8",
        0x54 => "SLOAD",
        0x55 => "SSTORE",
        0x56 => "JUMP",
        0x57 => "JUMPI",
        0x58 => "PC",
        0x59 => "MSIZE",
        0x5A => "GAS",
        0x5B => "JUMPDEST",
        0x5C => "TLOAD",
        0x5D => "TSTORE",
        0x5E => "MCOPY",
        0x5F => "PUSH0",
        0x60 => "PUSH1",
        0x61 => "PUSH2",
        0x62 => "PUSH3",
        0x63 => "PUSH4",
        0x64 => "PUSH5",
        0x65 => "PUSH6",
        0x66 => "PUSH7",
        0x67 => "PUSH8",
        0x68 => "PUSH9",
        0x69 => "PUSH10",
        0x6A => "PUSH11",
        0x6B => "PUSH12",
        0x6C => "PUSH13",
        0x6D => "PUSH14",
        0x6E => "PUSH15",
        0x6F => "PUSH16",
        0x70 => "PUSH17",
        0x71 => "PUSH18",
        0x72 => "PUSH19",
        0x73 => "PUSH20",
        0x74 => "PUSH21",
        0x75 => "PUSH22",
        0x76 => "PUSH23",
        0x77 => "PUSH24",
        0x78 => "PUSH25",
        0x79 => "PUSH26",
        0x7A => "PUSH27",
        0x7B => "PUSH28",
        0x7C => "PUSH29",
        0x7D => "PUSH30",
        0x7E => "PUSH31",
        0x7F => "PUSH32",
        0x80 => "DUP1",
        0x81 => "DUP2",
        0x82 => "DUP3",
        0x83 => "DUP4",
        0x84 => "DUP5",
        0x85 => "DUP6",
        0x86 => "DUP7",
        0x87 => "DUP8",
        0x88 => "DUP9",
        0x89 => "DUP10",
        0x8A => "DUP11",
        0x8B => "DUP12",
        0x8C => "DUP13",
        0x8D => "DUP14",
        0x8E => "DUP15",
        0x8F => "DUP16",
        0x90 => "SWAP1",
        0x91 => "SWAP2",
        0x92 => "SWAP3",
        0x93 => "SWAP4",
        0x94 => "SWAP5",
        0x95 => "SWAP6",
        0x96 => "SWAP7",
        0x97 => "SWAP8",
        0x98 => "SWAP9",
        0x99 => "SWAP10",
        0x9A => "SWAP11",
        0x9B => "SWAP12",
        0x9C => "SWAP13",
        0x9D => "SWAP14",
        0x9E => "SWAP15",
        0x9F => "SWAP16",
        0xA0 => "LOG0",
        0xA1 => "LOG1",
        0xA2 => "LOG2",
        0xA3 => "LOG3",
        0xA4 => "LOG4",
        0xF0 => "CREATE",
        0xF1 => "CALL",
        0xF2 => "CALLCODE",
        0xF3 => "RETURN",
        0xF4 => "DELEGATECALL",
        0xF5 => "CREATE2",
        0xFA => "STATICCALL",
        0xFD => "REVERT",
        0xFE => "INVALID",
        0xFF => "SELFDESTRUCT",
        0xF7 => "RETURNDATALOAD",
        0xF8 => "EXTCALL",
        0xF9 => "EXTDELEGATECALL",
        0xFB => "EXTSTATICCALL",
        else => "INVALID",
    };
}

pub fn stringToOp(str: []const u8) ?u8 {
    const op_map = std.ComptimeStringMap(u8, .{
        .{ "STOP", 0x00 },
        .{ "ADD", 0x01 },
        .{ "MUL", 0x02 },
        .{ "SUB", 0x03 },
        .{ "DIV", 0x04 },
        .{ "SDIV", 0x05 },
        .{ "MOD", 0x06 },
        .{ "SMOD", 0x07 },
        .{ "ADDMOD", 0x08 },
        .{ "MULMOD", 0x09 },
        .{ "EXP", 0x0A },
        .{ "SIGNEXTEND", 0x0B },
        .{ "LT", 0x10 },
        .{ "GT", 0x11 },
        .{ "SLT", 0x12 },
        .{ "SGT", 0x13 },
        .{ "EQ", 0x14 },
        .{ "ISZERO", 0x15 },
        .{ "AND", 0x16 },
        .{ "OR", 0x17 },
        .{ "XOR", 0x18 },
        .{ "NOT", 0x19 },
        .{ "BYTE", 0x1A },
        .{ "SHL", 0x1B },
        .{ "SHR", 0x1C },
        .{ "SAR", 0x1D },
        .{ "KECCAK256", 0x20 },
        .{ "ADDRESS", 0x30 },
        .{ "BALANCE", 0x31 },
        .{ "ORIGIN", 0x32 },
        .{ "CALLER", 0x33 },
        .{ "CALLVALUE", 0x34 },
        .{ "CALLDATALOAD", 0x35 },
        .{ "CALLDATASIZE", 0x36 },
        .{ "CALLDATACOPY", 0x37 },
        .{ "CODESIZE", 0x38 },
        .{ "CODECOPY", 0x39 },
        .{ "GASPRICE", 0x3A },
        .{ "EXTCODESIZE", 0x3B },
        .{ "EXTCODECOPY", 0x3C },
        .{ "RETURNDATASIZE", 0x3D },
        .{ "RETURNDATACOPY", 0x3E },
        .{ "EXTCODEHASH", 0x3F },
        .{ "BLOCKHASH", 0x40 },
        .{ "COINBASE", 0x41 },
        .{ "TIMESTAMP", 0x42 },
        .{ "NUMBER", 0x43 },
        .{ "PREVRANDAO", 0x44 },
        .{ "GASLIMIT", 0x45 },
        .{ "CHAINID", 0x46 },
        .{ "SELFBALANCE", 0x47 },
        .{ "BASEFEE", 0x48 },
        .{ "BLOBHASH", 0x49 },
        .{ "BLOBBASEFEE", 0x4A },
        .{ "POP", 0x50 },
        .{ "MLOAD", 0x51 },
        .{ "MSTORE", 0x52 },
        .{ "MSTORE8", 0x53 },
        .{ "SLOAD", 0x54 },
        .{ "SSTORE", 0x55 },
        .{ "JUMP", 0x56 },
        .{ "JUMPI", 0x57 },
        .{ "PC", 0x58 },
        .{ "MSIZE", 0x59 },
        .{ "GAS", 0x5A },
        .{ "JUMPDEST", 0x5B },
        .{ "TLOAD", 0x5C },
        .{ "TSTORE", 0x5D },
        .{ "MCOPY", 0x5E },
        .{ "PUSH0", 0x5F },
        .{ "PUSH1", 0x60 },
        .{ "PUSH2", 0x61 },
        .{ "PUSH3", 0x62 },
        .{ "PUSH4", 0x63 },
        .{ "PUSH5", 0x64 },
        .{ "PUSH6", 0x65 },
        .{ "PUSH7", 0x66 },
        .{ "PUSH8", 0x67 },
        .{ "PUSH9", 0x68 },
        .{ "PUSH10", 0x69 },
        .{ "PUSH11", 0x6A },
        .{ "PUSH12", 0x6B },
        .{ "PUSH13", 0x6C },
        .{ "PUSH14", 0x6D },
        .{ "PUSH15", 0x6E },
        .{ "PUSH16", 0x6F },
        .{ "PUSH17", 0x70 },
        .{ "PUSH18", 0x71 },
        .{ "PUSH19", 0x72 },
        .{ "PUSH20", 0x73 },
        .{ "PUSH21", 0x74 },
        .{ "PUSH22", 0x75 },
        .{ "PUSH23", 0x76 },
        .{ "PUSH24", 0x77 },
        .{ "PUSH25", 0x78 },
        .{ "PUSH26", 0x79 },
        .{ "PUSH27", 0x7A },
        .{ "PUSH28", 0x7B },
        .{ "PUSH29", 0x7C },
        .{ "PUSH30", 0x7D },
        .{ "PUSH31", 0x7E },
        .{ "PUSH32", 0x7F },
        .{ "DUP1", 0x80 },
        .{ "DUP2", 0x81 },
        .{ "DUP3", 0x82 },
        .{ "DUP4", 0x83 },
        .{ "DUP5", 0x84 },
        .{ "DUP6", 0x85 },
        .{ "DUP7", 0x86 },
        .{ "DUP8", 0x87 },
        .{ "DUP9", 0x88 },
        .{ "DUP10", 0x89 },
        .{ "DUP11", 0x8A },
        .{ "DUP12", 0x8B },
        .{ "DUP13", 0x8C },
        .{ "DUP14", 0x8D },
        .{ "DUP15", 0x8E },
        .{ "DUP16", 0x8F },
        .{ "SWAP1", 0x90 },
        .{ "SWAP2", 0x91 },
        .{ "SWAP3", 0x92 },
        .{ "SWAP4", 0x93 },
        .{ "SWAP5", 0x94 },
        .{ "SWAP6", 0x95 },
        .{ "SWAP7", 0x96 },
        .{ "SWAP8", 0x97 },
        .{ "SWAP9", 0x98 },
        .{ "SWAP10", 0x99 },
        .{ "SWAP11", 0x9A },
        .{ "SWAP12", 0x9B },
        .{ "SWAP13", 0x9C },
        .{ "SWAP14", 0x9D },
        .{ "SWAP15", 0x9E },
        .{ "SWAP16", 0x9F },
        .{ "LOG0", 0xA0 },
        .{ "LOG1", 0xA1 },
        .{ "LOG2", 0xA2 },
        .{ "LOG3", 0xA3 },
        .{ "LOG4", 0xA4 },
        .{ "CREATE", 0xF0 },
        .{ "CALL", 0xF1 },
        .{ "CALLCODE", 0xF2 },
        .{ "RETURN", 0xF3 },
        .{ "DELEGATECALL", 0xF4 },
        .{ "CREATE2", 0xF5 },
        .{ "RETURNDATALOAD", 0xF7 },
        .{ "EXTCALL", 0xF8 },
        .{ "EXTDELEGATECALL", 0xF9 },
        .{ "STATICCALL", 0xFA },
        .{ "EXTSTATICCALL", 0xFB },
        .{ "REVERT", 0xFD },
        .{ "INVALID", 0xFE },
        .{ "SELFDESTRUCT", 0xFF },
    });
    return op_map.get(str);
}

pub fn isPush(opcode: u8) bool {
    return 0x5F <= opcode and opcode <= 0x7F; // PUSH0 to PUSH32
}

// Tests
const testing = std.testing;

test "opcodes - placeholder test" {
    // TODO: Add comprehensive tests for opcodes functionality
    // This is a placeholder to ensure the test runs
    try testing.expect(true);
}
